{-# language OverloadedStrings #-}
import Geometry
import Data.Complex
import Data.Functor.Const

path = "dist-newstyle/build/x86_64-linux/ghc-8.6.5/geometry-0.1.2.0/doc/html/geometry/figs/"

main = do
  writeSVG 400 (path <> "angle1.svg") $
    let t = triangle2a 30 60
        a1 = anAngle 30 #: "#" <> loffs (asDeg 135)
        a2 = anAngle 90 # on (side 2 t) 0 #: "#"
        a3 = t # vertexAngle 1 #: "#"
    in t <+> a1 <+> a2 <+> a3

  writeSVG 300 (path <> "angle2.svg") $
    let a = anAngle 60
        b = supplementary a
    in aLine <+> aLine # rotate 60 <+>
       a #: "a" <+> b #: "b"

  writeSVG 300 (path <> "angle3.svg") $
    let a = anAngle 60
        b = vertical a
    in aLine <+> aLine # rotate 60 <+>
       a #: "a" <+> b #: "b"

  writeSVG 300 (path <> "angle4.svg") $
    let a = anAngle 60
        b = reflex a
    in aRay <+> aRay # rotate 60 <+>
       a #: "a" <+> b #: "b"

  writeSVG 400 (path <> "modularScale.svg") $
    let c = aCircle # rotate 90
        s1 = group $ modularScale 12 c
        t = aTriangle # scale 2
        s2 = group $ modularScale 9 t
    in (c <+> s1) `beside` space 0.3 `beside` (s2 <+> t)

  writeSVG 300 (path <> "points.svg") $
    aPoint #: "O" <+>
    point' (45 :: Direction) #: "A" <+>
    point' (1 :: Cmp) #: "B" 

  writeSVG 300 (path <> "pointOn.svg") $
    aCircle <+>
    pointOn aCircle 0 #: "A" <+>
    pointOn aCircle 0.25 #: "B" <+>
    pointOn aCircle 0.667 #: "C"

  writeSVG 500 (path <> "projectOn.svg") $
    let c = Plot  $ (\t -> t :+ sin t) . (*6)
        pA = point (1,0) #: "A"
        pB = point (2,0) #: "B"
        pC = point (4,0) #: "C"
        pD = point (6,1) #: "D"
    in  c  <+> pA <+> pA # projectOn c #: "A'" <+>
        pB <+> pB # projectOn c #: "B'" <+>
        pC <+> pC # projectOn c #: "C'" <+>
        pD <+> pD # projectOn c #: "D'"

  writeSVG 300 (path <> "intersectionPoints.svg") $
    let p = regularPoly 7
        c = aCircle # scale 0.95
    in p <+> c <+> group (intersectionPoints c p)

  writeSVG 400 (path <> "extendTo.svg") $
    let t = aTriangle
        s1 = aSegment # at (1,1)
        s2 = aSegment # at (0.3,0.3)
    in t <+>
       group [s1 # along a # extendTo t | a <- [0,10..360] ] <+>
       group [s2 # along a # extendTo t | a <- [0,10..360] ]

  writeSVG 300 (path <> "groups.svg") $
    group $ take 10 $ iterate (rotate 3 . scale 1.1) $ regularPoly 3

  writeSVG 300 (path <> "compose.svg") $
    let f = G . translate (1,0) . scale 0.7 . rotate 30 <>
            G . translate (1,0) . scale 0.6 . rotate (-45)
    in G aSegment # iterate f # take 8 # mconcat # rotate 90

  writeSVG 300 (path <> "beside.svg") $
    aTriangle `beside` aSquare

  writeSVG 300 (path <> "above.svg") $
    aTriangle `above` aSquare

  writeSVG 300 (path <> "serp.svg") $
    let tr t = t `above` (t `beside` t)
    in G aCircle # iterate tr # take 5 # mconcat # rotate 225 # scaleX 0.6

  writeSVG 400 (path <> "extendToLength.svg") $
   group [aSegment # rotate x # extendToLength r
         | x <- [0,5..360] 
         , let r = 2 + sin (7 * rad x) ]

  writeSVG 400 (path <> "normalTo.svg") $
   let c = Plot $ (\t -> t :+ sin t) . (*6)
   in c <+>
      group [ aSegment # at (x,0) # normalTo c
            | x <- [0,1..7] ]

  writeSVG 300 (path <> "on.svg") $
   let c = aCircle
   in c <+>
      aPoint # on c 0.1 <+>
      aSegment # scale 0.5 # on c 0.3 <+>
      aSquare # scale 0.5 # on c 0.6 <+>
      aTriangle # scale 0.5 # on c 0.9

  writeSVG 300 (path <> "through.svg") $
   let pA = point (2,3) #: "A"
       pB = point (3,2) #: "B"
   in aSegment # through' pA <+>
      aRay # through (3,2) <+>
      pA <+> pB <+> origin 

  writeSVG 300 (path <> "along.svg") $
   let a = aSegment #: "a" # at (1,0) # along 20
       t = aTriangle # along' a
       s = aSquare # at (1,1) # along' t
   in a <||> t <||> s
   
  writeSVG 300 (path <> "normalSegment.svg") $
   let t = aTriangle
   in t
      <+> t # normalSegment 0.2 #: "1"
      <+> t # normalSegment 0.5 #: "2"
      <+> t # normalSegment (2/3) #: "3"
      <+> t # normalSegment 1 #: "4"

  writeSVG 300 (path <> "heightFrom.svg") $
   let t = aTriangle
       pA = point (1,1) #: "A"
       sa = t # heightFrom pA #: "a"
       pB = point (1.2,0) #: "B"
       sb = sa # heightFrom pB #: "b"
   in t <+> pA <+> sa <+> pB <+> sb

  writeSVG 300 (path <> "midPerpendicular.svg") $
    let t = triangle2a 50 70
        l1 = t # side 0 # midPerpendicular #: thin <> white
        l2 = t # side 1 # midPerpendicular #: thin <> white
        l3 = t # side 2 # midPerpendicular #: thin <> white
        p = head $ intersectionPoints l1 l2
        c = circle' (p `distance` vertex 0 t) p
    in t <+> c <+> l1 <+> l2 <+> l3 <+> p
