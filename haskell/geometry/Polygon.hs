{-# language MultiParamTypeClasses #-}
{-# language FlexibleInstances #-}
{-# language FlexibleContexts #-}
{-# language UndecidableInstances #-}
{-# language DerivingVia #-}

module Polygon
  (
    IsPolyline (..)
  , Polyline (..)
  , mkPolyline, trivialPolyline, closePoly
  , Polygon (..)
  , mkPolygon, trivialPolygon
  , Triangle (..)
  , mkTriangle, trivialTriangle
  , Rectangle (..)
  , mkRectangle, trivialRectangle
  , boxRectangle
  )
where

import Data.Complex
import Data.Foldable
import Data.List.Extra (minimumOn)
import Data.Monoid
import Data.Maybe
import Data.Fixed

import Base
import Point
import Line

class Curve p => IsPolyline p where
  vertices :: p -> [CN]
  asPolyline :: p -> Polyline
  
  verticesNumber :: p -> Int
  verticesNumber p = length (vertices p)

  segments :: p -> [Segment]
  segments p = mkSegment <$> zip (vertices p) (tail vs)
    where vs = if isClosed p
               then cycle (vertices p)
               else vertices p
                    
  vertex :: p -> Int -> CN
  vertex p i = vs !! j
    where vs = vertices p
          n = verticesNumber p
          j = if isClosed p
              then i `mod` n
              else (0 `max` i) `min` n
                   
  side :: p -> Int -> Segment
  side p i = segments p !! j
    where j = if isClosed p
              then (i + n `div` 2) `mod` n
              else (0 `max` i) `min` n
          n = verticesNumber p
  

interpolation :: IsPolyline p => p -> Double -> Maybe CN
interpolation p x = param' <$> find interval tbl
  where
    interval ((a, b), _) = a ~<= x && x ~<= b
    param' ((a, b), s) = s @-> ((x - a)/(b-a))
    tbl = zip (zip ds (tail ds)) $ segments p
    ds = scanl (+) 0 $ unit <$> segments p

------------------------------------------------------------

newtype Polyline = Polyline [CN]

instance IsPolyline Polyline where
  vertices (Polyline vs) = vs
  asPolyline = id
  
trivialPolyline :: Polyline
trivialPolyline = Polyline []

mkPolyline :: Affine a => [a] -> Polyline
mkPolyline pts = Polyline $ cmp <$> pts

closePoly :: Polyline -> Polygon
closePoly p = Polygon (vertices p)

instance Show Polyline where
  show p = concat ["<Polyline ", n, ">"]
    where vs = vertices p
          n = if length vs < 5
              then unwords $ show . coord <$> vs
              else "-" <> show (length vs) <> "-"

instance Eq Polyline where
  p1 == p2 = vertices p1 ~== vertices p2

instance Affine Polyline where
  cmp p = case segments p of
            [] -> 0
            (x:_) -> cmp x
  asCmp x = Polyline [0, x]

instance Trans Polyline where
  transform t (Polyline vs) = Polyline $ transform t <$> vs

instance Manifold Polyline where
  param p t | t < 0 = param (asLine (side p 0)) t
            | t > 1 = param (asLine (side p (verticesNumber p - 1))) t
            | otherwise = fromJust $  interpolation p (t * unit p) 

  project p pt = (x0 + (project s pt * unit s)) / unit p
    where
      ss = segments p
      ds = scanl (+) 0 $ unit <$> ss
      (x0, s) = minimumOn (\(_,s) -> distanceTo pt s) $ zip ds ss
      x = (x0 + (project s pt * unit s)) / unit p

  isContaining p x = any (`isContaining` x) (segments p)
  unit p = sum $ unit <$> segments p

instance Curve Polyline where
  orientation _ = 1

  tangent p t =  (p @-> (t + dt)) `azimuth` (p @-> (t - dt))
    where dt = 1e-5

 
instance Figure Polyline where
  isTrivial p = length (vertices p) < 2
  isSimilar p1 p2 = p1 == p2
  refPoint p = if isNontrivial p
               then head $ vertices p
               else 0
  box p = foldMap (box . mkPoint) (vertices p)


------------------------------------------------------------

newtype Polygon = Polygon [CN]
  deriving ( Eq
           , Trans
           , Affine
           , Figure
           ) via Polyline

trivialPolygon :: Polygon
trivialPolygon = Polygon []

mkPolygon :: Affine a => [a] -> Polygon
mkPolygon pts = Polygon $ cmp <$> pts

instance IsPolyline Polygon where
  vertices (Polygon vs) = vs
  asPolyline (Polygon vs) = Polyline $ take (length vs + 1) (cycle vs)

instance Show Polygon where
  show p = concat ["<Polygon ", n, ">"]
    where vs = vertices p
          n = if length vs < 5
              then unwords $ show . coord <$> vs
              else "-" <> show (length vs) <> "-"

instance Manifold Polygon where
  param p t = fromJust $ interpolation p $ (t `mod'` 1) * unit p
  project = project . asPolyline
  isContaining = isContaining . asPolyline
  unit = unit . asPolyline
  
instance Curve Polygon where
  orientation _ = 1
  tangent = tangent . asPolyline

instance ClosedCurve Polygon where
  location p pt = case foldMap go (segments p') of
                    (Any True, _) -> OnCurve
                    (_, Sum n) | odd n -> Inside
                    _ -> Outside
    where
      p' = p # translate' (negate (cmp pt))
      go s | y0 * y1 == 0       = (Any True, mempty)
           | y0 == y1           = mempty
           | x == 0             = (Any True, mempty)
           | x > 0 && y0*y1 < 0 = (mempty, Sum 1)
           | otherwise          = mempty
        where
          (x0:+y0, x1:+y1) = refPoints s 
          x = (x0*y1-x1*y0)/(y1-y0)       

------------------------------------------------------------

newtype Triangle = Triangle [CN]
  deriving ( Figure
           , Manifold
           , Curve
           , ClosedCurve
           , Trans
           , Eq
           , IsPolyline
           ) via Polygon

mkTriangle :: Affine a => [a] -> Triangle
mkTriangle = Triangle . fmap cmp

trivialTriangle = Triangle []

instance Show Triangle where
  show t = concat ["<Triangle ", ss, ">"]
    where ss = unwords $ show . coord <$> vertices t

instance Affine Triangle where
  cmp = cmp . asPolyline
  asCmp = Triangle . scanl (+) 0 . take 2 . iterate (rotate 120)


------------------------------------------------------------

newtype Rectangle = Rectangle [CN]
  deriving ( Figure
           , Manifold
           , Curve
           , ClosedCurve
           , Trans
           , Eq
           , IsPolyline
           ) via Polygon

mkRectangle :: Affine a => [a] -> Rectangle
mkRectangle = Rectangle . fmap cmp

trivialRectangle = Rectangle []

instance Show Rectangle where
  show t = concat ["<Rectangle ", ss, ">"]
    where ss = unwords $ show . coord <$> vertices t

instance Affine Rectangle where
  cmp = cmp . asPolyline
  asCmp = Rectangle . scanl (+) 0 . take 3 . iterate (rotate 90)


boxRectangle f = mkRectangle [ p4, p3, p2, p1 ]
  where ((p4,p3),(p1,p2)) = corner f
