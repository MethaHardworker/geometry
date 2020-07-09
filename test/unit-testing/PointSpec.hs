module PointSpec where
  
import Test.Hspec
import Test.QuickCheck hiding (scale)
import Test.Invariant

import Data.Complex

import Geometry
import Geometry.Testing

spec :: Spec
spec = describe "Point" $ do
    describe "Affinity" $ do
      it "1" $ property $ cmp `inverts` Point 
      it "2" $ property $ Point `inverts` cmp 
      it "3" $ property $ cmp `inverts` (Point . cmp)
      it "4" $ property $ (Point . cmp) `inverts` cmp

    describe "pointOn" $ do
      it "1" $ xy (pointOn (aCircle # scale 2) 0) ~= (2, 0)
      it "2" $ xy (pointOn (aCircle # scale 2) 0.5) ~= (-2, 0)
      it "3" $ property $ \c t ->
        let _ = c :: Circle
        in c `isContaining` pointOn c t
      it "4" $ property $ \(Nontrivial l) t ->
        let _ = l :: Line
        in l `isContaining` pointOn l t
      it "5" $ property $ \n t ->
        let p = regularPoly (3 + abs n)
        in p `isContaining` pointOn p t
                    
