{-# Language MultiParamTypeClasses #-}
{-# Language FlexibleContexts #-}
module Line where

import Data.Complex
import Data.List

import Base

data Line = Line (LabelData, (CN, CN))
          | Segment (LabelData, (CN, CN))
          | Ray (LabelData, (CN, CN))

refPoints (Line (_, p)) = p
refPoints (Ray (_, p)) = p
refPoints (Segment (_, p)) = p

instance Eq Line where
  Line (_, p1)    == Line (_,p2)     = p1 ~== p2
  Ray (_, p1)     == Ray (_, p2)     = p1 ~== p2
  Segment (_, p1) == Segment (_, p2) = p1 ~== p2
  _ == _ = False

lineConstructor (Line _) = Line
lineConstructor (Ray _)  = Ray
lineConstructor (Segment _) = Segment

trivialLine = mkLine (0,0)
mkLine ps = Line (mempty, ps)
mkRay ps = Ray (mempty, ps)
mkSegment ps = Segment (mempty, ps)

extendAs :: Line -> ((LabelData, (CN, CN)) -> Line) -> Line
l1 `extendAs` l = let res = l (labelData l1, refPoints l1)
                   in case l1 of
                     Segment _ -> res
                     Ray _ -> case res of
                                Segment _ -> l1
                                _ -> res
                     Line _  -> l1


instance Show Line where
  show l = case l of
    Segment _ -> unwords [ "<Segment"
                         , "(" <> show x1 <> "," <> show y1 <> "),"
                         , "(" <> show x2 <> "," <> show y2 <> ")>"]
    Line _ -> unwords [ "<Line"
                      , "(" <> show x1 <> "," <> show y1 <> "),"
                      , show a <> ">"]
    Ray _ -> unwords [ "<Ray"
                     , "(" <> show x1 <> "," <> show y1 <> "),"
                     , show a <> ">"]
    where (x1, y1) = coord (l .@ 0)
          (x2, y2) = coord (l .@ 1)
          a = angle l

instance Figure Line where
  labelData (Line (l,_)) = l
  labelData (Ray (l,_)) = l
  labelData (Segment (l,_)) = l

  appLabelData lb l = lineConstructor l (labelData l <> lb, refPoints l)

  isTrivial l = cmp l == 0

  isSimilar s1@(Segment _) s2@(Segment _) = unit s1 ~== unit s2
  isSimilar (Line _) (Line _) = True
  isSimilar (Ray _) (Ray _) = True
  isSimilar _ _ = False

  refPoint = fst . refPoints

  labelPosition l = l .@ 0.5
  labelOffset l = coord $ scale 12 $ normal l 0
  labelCorner _ = (0,0)


instance Affine Line where
  cmp l =  let (p1, p2) = refPoints l in normalize $ cmp p2 - cmp p1
  fromCN p = Line (mempty, (0, p))


instance Trans Line where
  transform t l = constr (transformCN t p1, transformCN t p2)
    where p1 = l .@ 0
          p2 = l .@ 1
          constr ps = lineConstructor l (labelData l, ps)
  

instance Curve Line where
  unit l = let (p1, p2) = refPoints l in distance p1 p2

  param l t = let (p1, p2) = refPoints l in scaleAt p1 t p2

  locus l p | isTrivial l = 0
            | otherwise = let p1 = fst $ refPoints l
                              v = cmp p - cmp p1
                          in (v `dot` cmp l) / unit l

  isClosed = const False

  isContaining l p = case l of
    Line _    -> res
    Ray _     -> cmp p ~== start l || (res && 0 <= x)
    Segment _ -> cmp p ~== start l || (res && 0 <= x && x ~<= 1)
    where p1 = refPoint l
          x = p @. l
          res = l `isCollinear` azimuth p1 p

  tangent l _ = angle l

  distanceTo l p = case p ?. l of
    Just x -> p `distance` (l .@ x)
    Nothing -> (p `distance` (l .@ 0)) `min`
               (p `distance` (l .@ 1))


instance Intersections Line Line where
  intersections l1 l2
    | isTrivial l1 = filter (isContaining l2) [refPoint l1]
    | isTrivial l2 = filter (isContaining l1) [refPoint l2]
    | otherwise = 
      filter (isContaining l1) $
      filter (isContaining l2) $
      intersectionV (refPoint l1) (cmp l1) (refPoint l2) (cmp l2)


intersectionV (x1 :+ y1) (v1x :+ v1y) (x2 :+ y2) (v2x :+ v2y) =
  [(v1x*d2 - v2x*d1) :+ (v1y*d2 - v2y*d1) | d0 /= 0]
  where
    d0 = v1y*v2x - v1x*v2y
    d1 = (v1x*y1 - v1y*x1) / d0
    d2 = (v2x*y2 - v2y*x2) / d0


clipBy :: (Intersections Line c, Curve c) => Line -> c -> [Line]
clipBy l c = filter internal $ (\p -> Segment (ld, p)) <$> zip ints (tail ints) 
  where
    ld = labelData l
    ints = sortOn (locus l) $ intersections l c <> ends
    internal s = c `isEnclosing` (s .@ 1/2)
    ends = case l of
             Segment _ -> [l .@ 0, l .@ 1]
             Ray _ -> [l .@ 0]
             Line _ -> []

