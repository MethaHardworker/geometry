const pnt1 = new Point('A').at([1,2]);
const pnt2 = new Point().at([3,4]);
const lin1 = line(point([1,2]),point([4,6]));
const lin2 = line(point([-2,3]),point([4,-6]));
const l1 = line(point([2,3]),point([5,8]))
var l2 = line(point([10,13]),point([5,8]))
const s1 = segment(point([1,1]),point([2,3]))
const ray1 = ray(point([1,2]),point([5,6]));
const seg1 = segment(point([1,2]),point([6,6]));
const pol1 = new Polygon().through([pnt1, pnt2, origin, seg1.middle]);
const tri1 = new Triangle(pnt2, pnt1, point([5,0]));
const cir1 = new Circle(3).at(point([1,2]));
const sqr1 = new Square(2)
const ang1 = new Angle(30).on(lin1);
const grp1 = new Group([pnt1, pnt2, lin1, ray1, seg1, cir1, ang1]);
const grp2 = grp1.copy();


const anyCoordinate = anyNum.range(-paperSize/2, paperSize/2).precision(0.1)
const anyXY = Arbitrary.tuple([anyCoordinate, anyCoordinate])
const anyPoint = args(anyXY).iso(point, p => [p.xy])
const anyAngle = anyNum.range(0,360).precision(1)
const anyLine = args(anyPoint, anyPoint).iso(line, l => [l.point(0), l.point(1)])
const anyRay = args(anyPoint, anyAngle).iso(ray, r => [r.start, r.angle(0)])
const anyRadius =  anyNum.range(0, paperSize/2).precision(0.5)
const anyCircle = args(anyPoint, anyRadius).iso(circle, c => [c.center, c.R])

////////////////////////////////////////////////////////////
const testTests = {
    name : 'Tests',
    skip : true,
    suite : [
	{
	    name  : "testing tests",
	    for   : [any.point, any.number],
	    hold  : (p, n) => new Circle(5).at([-7,-7]).isEnclosing(p)
	}
    ]
}

////////////////////////////////////////////////////////////
const testPoints = {
    name: 'Points',
    suite : [
	{
	    name  : "isomorphism 1",
	    for   : [anyPoint],
	    holds : p => Point.iso(Point.iso(p).xy).point .isEqual (p)
	},
	{
	    name   : "copy 1",
	    run    : () => point([3,4]).copy(),  result : point([3,4])
	},
	{
	    name  : "superpose",
	    for   : [anyPoint, anyPoint],
	    holds : (p1,p2) => p1.superpose(p1,p2) .isEqual (p2),
	    number : 5
	},
	{
	    name  : "isomorphism 1",
	    for   : [any.point],
	    hold  : p => Point.iso(Point.iso(p).xy).point .isEqual (p)
	},
	{
	    name : "isomorphism 2",
	    for  : [any.xy],
	    hold : xy => equal(Point.iso(Point.iso(xy).point).xy, xy)
	},
	{
	    name : "copy 1",
	    for  : [any.point], hold : p => p.copy() .isEqual (p),
	    number : 5
	},
	{
	    name : "coordinates 1",
	    for  : [any.point],
	    hold : p => origin.at(p) .isEqual (point(p)),
	    number : 5
	},
	{
	    name : "equality 1",
	    for  : [any.point], hold : p => p .isEqual (p),
	    number : 5
	},
	{
	    name : "equality 2",
	    for  : [any.point], hold : p => point(p.xy) .isEqual (p),
	    number : 5
	},
	{
	    name : "equality 3",
	    for  : [any.point],  
	    hold : p => !p.copy().translate([1,1]) .isEqual (p),
	    number : 5
	},
	{
	    name : "translate 1", 
	    run : () => new Point().translate([1,2]).xy,  result : [1,2]
	}
    ]
}

/*

  , new test("translate 2", new Point().translate([1,2]).translate([-1,-2]), new Point())
  , new test("scale 1", pnt1.scale(2,3).xy, [2,6])
  , new test("scale 2", pnt1.scaleAt(pnt1,2,3).xy, pnt1.xy)
  , new test("superpose", pnt1.superpose(pnt1, pnt2).xy, pnt2.xy)
  , new test("rotate 1", pnt1.rotate(90).xy, [-2,1])
  , new test("rotate 2", pnt1.rotateAt(pnt1,90).xy, pnt1.xy)
  , new test("rotate 3", pnt1.rotateAt(pnt2,180).xy, [5, 6])
  , new test("reflect 1", pnt1.reflect(0).xy, [1, -2])
  , new test("reflect 2", pnt1.reflect(90).xy, [-1, 2])
  , new test("reflect 3", pnt1.reflect(45).xy, [2, 1])
  , new test("reflect 4", pnt1.reflectAt(point([2,3]), 135).xy, pnt2.xy)
  , new test("reflect 5", pnt1.reflectAt(pnt1, 45).xy, pnt1.xy)
  , new test("reflect 6", pnt1.reflectAt(point([2,3])).xy, [3,4])
  , new test("reflect 7", pnt2.reflectAt(lin1).xy, [2.36, 4.48])
  , new test("inside 1", pnt1.isEnclosing)
  , new test("inside 2", !pnt1.translate([100,100]).isEnclosing)
  , new test("on line 1", new Point().on(lin1,0).xy, lin1.pivot)
  , new test("on line 2", new Point().on(lin1,1).xy, lin1.pivot.vadd(lin1.vector))
  , new test("on line 3", new Point().on(seg1,0), seg1.start)
  , new test("on line 4", new Point().on(seg1,1), seg1.end)
  , new test("on circle 1", new Point().on(cir1,0).xy, [4,2])
  , new test("on circle 2", new Point().on(cir1,1/4).xy, [1,5])
  , new test("on circle 3", new Point().on(cir1,2).xy, [4,2])
  , new Property("distance 1", [any.point],
  (a, b) => a.distance(a) == 0)
  , new Property("distance 2", [any.point, any.point],
  (a, b) => a.distance(b) == b.distance(a))
  , new Property("distance 3", [any.point, any.xy],
  (a, v) => equal(a.translate(v).distance(a), v.norm()))
  , new Property("distance 4", [any.line, any.number()],
  (l, s) => equal(l.point(s).distance(l), 0))
  , new test("distance 7", cir1.center.distance(cir1), cir1.R)
  , new test("between 1", new Point().between(pnt1,pnt2,0), pnt1)
  , new test("between 2", new Point().between(pnt1,pnt2,1), pnt2)
  , new test("between 3", new Point().between(pnt1,pnt2,1/2).xy, [2,3])
  , new test("azimuth 1", new Point().azimuth(pnt1,0,pnt2,40).xy, pnt2.xy)
  , new test("azimuth 2", new Point().azimuth(pnt1,40,pnt2,0).xy, pnt1.xy)
  , new test("azimuth 3", new Point().azimuth(pnt1,40,pnt2,-40).xy, [1/0,1/0])
  , new test("azimuth 4", new Point().azimuth(pnt1,0,pnt2,0).xy, [1/0,1/0])
  , new test("azimuth 5", angle(pnt2,pnt1,new Point().azimuth(pnt1,30,pnt2,45)).value, 30)
  , new test("azimuth 6", angle(new Point().azimuth(pnt1,30,pnt2,45),pnt2,pnt1).value, 45)
  , new test("azimuth 7", angle(pnt1,new Point().azimuth(pnt1,30,pnt2,90),pnt2).value, 60)
  , new Property("idempotency",
  [any.xy],
  xy => point(point(xy)).isEqual(point(xy)))
*/

////////////////////////////////////////////////////////////
const testAngles = {
    name : 'Angle computations',
    suite : [
	{
	    name : "modulus",
	    for : [any.angle],
	    hold : a => equal(mod(-a, 360), mod(360-a, 360))
	},
	{
	    name : "isomorphism 1",
	    for : [any.xy],
	    hold : v => equal(Angle.iso(Angle.iso(v).angle).vector, v.normalize())
	},
	{
	    name : "isomorphism 2",
	    for : [any.angle],
	    hold : a => equalMod(360,Angle.iso(Angle.iso(a).vector).angle, a)
	}
    ]
}
////////////////////////////////////////////////////////////
const testLines = {
    name : 'Lines',
    suite : [
	{
	    name     : "isomorphism 1",
	    for      : [any.line, any.number()],
	    assuming : [l => !l.isTrivial],
	    hold     : (l, s) => equal(l.locus(l.point(s)), s)
	},
	{
	    name     : "isomorphism 2",
	    for      : [any.point, any.number()],
	    hold     : (p, s) => { let l = line(p, p)
				   return l.isTrivial && equal(l.locus(l.point(s)), 0)}
	},
	{
	    name     : "isomorphism 3",
	    for      : [any.line, any.number()],
	    assuming : [l => !l.isTrivial],
	    hold     : (l, s) => { let p = l.point(s)
	 			   return equal(l.point(l.locus(p)), p)}
	},
	{
	    name     : "equation 1",
	    for      : [any.line, any.number()],
	    hold     : (l, s) => l.equation(l.point(s))
	},
	{
	    name     : "equation 2",
	    for      : [any.line, any.number()],
	    assuming : [l => !l.isTrivial],
	    hold     : (l, s) => !l.equation(l.point(s).translate(l.normalV(0)))
	},
	{
	    skip     : true,
	    name     : "line intersections 1",
	    for      : [any.line, any.line],
	    assuming : [(a,b) => !(a.isTrivial || b.isTrivial)],
	    hold     : (a,b) => { let ps = a.intersections(b)
				  return a.isParallelTo(b) ? ps.length == 0 : ps.length == 1 }
	},
	{
	    name     : "plane intersections 1",
	    for      : [any.line],	     
	    hold     : l => { let ps = plane.intersections(l)
			      return ps.every(p => plane.isContaining(p)) }
	},
	{
	    name     : "perpendicularity 1",
	    for      : [any.line, any.xy],
	    assuming : [l => !l.isTrivial],
	    hold     : (l, xy) => new Line().at(xy).perpendicularTo(l).isPerpendicularTo(l)
	},
	{
	    name     : "perpendicularity 2",
	    for      : [any.line],
	    hold     : l => !l.isPerpendicularTo(line(origin, origin))
	},
	{
	    name     : "parallelity 1",
	    for      : [any.line, any.xy],
	    assuming : [l => !l.isTrivial],
	    hold     : (l, xy) => new Line().at(xy).parallelTo(l).isParallelTo(l)
	},
	{
	    name     : "parallelity 2",
	    for      : [any.line],
	    hold     : l => !l.isParallelTo(line(origin, origin))
	},
	{
	    name     : "tangentTo",
	    for      : [any.point, any.circle],
	    assuming : [(p, c) => !c.isEnclosing(p)],
	    hold     : (p, c) => { let t = new Line().at(p).tangentTo(c)
				   let is = c.intersections(t)
				   return (is.length == 1
					   && new Line().at(is[0]).perpendicularTo(t).isContaining(c.center))}
	},
	{name :"LineEquation 1",
	 run : () => lineEquation([0,0],[1,2])(0).xy, result : [0,0]},
	{name :"LineEquation 2",
	 run : () => lineEquation([0,0],[1,2])(1).xy, result : [1,2]},
	{name :"LineEquation 3",
	 run : () => lineEquation([0,0],[1,2])(1).xy, result : [-1,2]},
	{name :"LineEquation 4",
	 run : () => lineEquation([0,0],[1,2],2)(1).xy, result : [2,4]},
	{name :"LineEquation 5",
	 run : () => lineEquation([0,0],[1,2],2)(-1).xy, result : [-2,-4]},
	{name :"LineEquation 6",
	 run : () => lineEquation([0,0],[0,1])(0).xy, result : [0,0]},
	{name :"LineEquation 7",
	 run : () => lineEquation([0,0],[0,1])(2).xy, result : [0,2]},
	{name :"LineEquation 8",
	 run : () => lineEquation([1,2],[1,2])(0).xy, result : [1,2]},
	{name :"LineEquation 9",
	 run : () => lineEquation([1,2],[1,2])(1).xy, result : [1,2]},
	{name :"LineEquation 10",
	 run : () => lineEquation([1,2],[0,0],-1)(0).xy, result : [1,2]},
	{name :"LineEquation 11",
	 run : () => lineEquation([1,2],[0,0],-1)(1).xy, result : [2,4]},
	{name:"intersectionV 1",
	 run : () => intersectionV([0,0],[1,2],[0,0],[2,1]), result : [0,0]},
	{name:"intersectionV 2",
	 run : () => intersectionV([1,2],[1,1],[2,1],[-1,1]), result : [1,2]},
	{name:"intersectionV 3",
	 run : () => intersectionV([1,0],[0,1],[0,1],[1,0]), result : [1,1]},
	{name:"intersectionV 5",
	 run : () => intersectionV([1,2],[-1,-2],[3,4],[-3,-4]), result : [0,0]},
	{name:"intersectionV 6",
	 run : () => intersectionV([1,2],[1,2],[3,4],[2,4]), result : [1/0,1/0]},
	{name:"intersectionV 7",
	 run : () => intersectionV([1,2],[1,2],[1,2],[-2,-4]), result : [1/0,1/0]}
    ]
}

/*
  [ new test("identification", lin1 instanceof Curve),
  testLineEquation
  , testIntersectionV
  , new test("copy 0", lin1.copy() instanceof Line)
  , new test("copy 1", lin1.copy().pivot, lin1.pivot)
  , new test("copy 2", lin1.copy().vector, lin1.vector)
  , new test("copy 3", lin1.copy().point(5), lin1.point(5))
  , new test("copy 4", lin1.copy().angle(0), lin1.angle(0))
  , new test("copy 5", lin1.copy().rotate(60), lin1.angle(0), nequal)
  , new test("translate 1", lin1.translate([4,5]).pivot, [5, 7])
  , new test("translate 2", lin1.translate([4,5]).angle(0), lin1.angle(0))
  , new test("scale 1", lin1.scale(4).angle(0), lin1.angle(0))
  , new test("scale 2", lin1.scale(4).pivot, [4,8])
  , new test("scale 3", lin1.scale(1,-1).angle(0), 360-lin1.angle(0))
  , new test("scale 4", lin1.scale(1,2).pivot, [1,4])
  , new test("superpose", lin1.superpose(pnt1,pnt2).pivot, [3,4])
  , new test("rotate 1", lin1.rotate(90).pivot, [-2,1])
  , new test("rotate 2", lin1.rotate(90).vector, [-4,3])
  , new test("rotate 3", lin1.rotateAt(point(lin1.pivot),35).pivot, lin1.pivot)
  , new test("reflect 1", lin1.reflect(90).pivot, [-1,2])
  , new test("reflect 2", lin1.reflect(90).vector, [-3,4])
  , new test("reflect 3", lin1.reflect(45).pivot, [2,1])
  , new test("reflect 4", lin1.reflect(45).vector, [4,3])
  , new test("reflect 5", lin1.reflectAt(lin1).pivot, [1,2])
  , new test("reflect 6", lin1.reflectAt(lin1).vector, [3,4])
  , new test("reflect 7", lin1.reflectAt(lin1).pivot, [1,2])
  , new test("reflect 8", lin1.reflectAt(ray1).vector, [4,3])
  , new test("reflect 9", lin1.reflectAt(origin).pivot, [-1,-2])
  , new test("reflect 10", lin1.reflectAt(origin).vector, [-3,-4])
  , new test("reflect 11", lin1.reflectAt(pnt2).pivot, [5,6])
  , new test("reflect 12", lin1.reflectAt(pnt2).vector, [-3,-4])
  , new test("locate 1", lin1.location(lin1.point(0)), 0)
  , new test("locate 2", lin1.location(lin1.point(2)), 2)
  , new test("locate 2", lin1.location(lin1.point(-2)), -2)
  , new test("locate 2", lin1.location(lin1.point(1.52)), 1.52)
  , new test("locate 3", lin1.location(point(lin1.point(3).xy.vadd(lin1.normalV(0)))), 3)
  , new test("locate 4", lin1.location(point(lin1.point(-2).xy.vadd(lin1.normalV(0)))), -2)
  , new test("isContaining 1", lin1.isContaining(lin1.point(3)))
  , new test("isContaining 2", !lin1.isContaining(origin))
  , new test("isParallelTo 1", !lin1.isParallelTo(lin2))
  , new test("isParallelTo 2", lin1.isParallelTo(lin1))
  , new test("isParallelTo 3", lin1.isParallelTo(lin1.translate([10,20])))
  , new test("isParallelTo 4", lin1.isParallelTo(lin2.parallelTo(lin1)))
  , new test("isParallelTo 5", lin1.isParallelTo(lin2.atAngle(lin1.angle(0))))
  , new test("isParallelTo 6", lin1.isParallelTo(lin1.reflectAt(lin1.point(5))))
  , new test("isPerpendicularTo 1", !lin1.isPerpendicularTo(lin2))
  , new test("isPerpendicularTo 2", Oy.isPerpendicularTo(Ox))
  , new test("isPerpendicularTo 3", lin1.isPerpendicularTo(lin2.atAngle(lin1.angle(0) - 90)))
  , new test("isEqual 1", lin1.isEqual(lin1.copy()))
  , new test("isEqual 2", !lin1.isEqual(lin2))
  , new test("isEqual 3", !lin1.isEqual(pnt1))
  , new test("isSimilar 1", lin1.isSimilar(line(lin1.point(8), lin1.point(2))))
  , new test("isSimilar 2", !lin1.isSimilar(line(lin2.point(0), lin2.point(1))))
  , new test("joining 1", new Line().joining(lin1.point(0),lin1.point(1)), lin1)
  , new test("joining 2", new Line().joining(lin1.point(0),lin1.point(0)).vector, [0,0])
  , new test("joining 3"
  , new Line().joining(lin1.point(0),lin1.point(2)).point(1).xy
  , lin1.point(2).xy)
  , new test("joining 4"
  , new Line().joining(lin1.point(0),lin1.point(2)).tangentV(0)
  , lin1.tangentV(0))
  , new test("atAngle 1", lin1.atAngle(60).angle(0),60)
  , new test("atAngle 2", lin1.atAngle(400).angle(0),40)
  , new test("at 1", lin1.at(origin).pivot,[0,0])
  , new test("at 2", lin1.at(pnt2).point(0), pnt2)
  , new test("at 3", lin1.at(pnt2).vector, lin1.vector)
  , new test("at 4", lin1.at(pnt2,[4,5]).vector, [4,5])
  , new test("parallelTo 1", lin1.parallelTo(Ox).angle(0), 0)
  , new test("parallelTo 2", lin1.parallelTo(Oy).angle(0), 90)
  , new test("along 1", lin1.along(lin2).isParallelTo(lin2))
  , new test("along 2", lin1.along(lin2).isSimilar(lin2))
  , new test("perpendicularTo 1", lin1.perpendicularTo(lin2).isPerpendicularTo(lin2))
  , new test("bisectrisse 1", new Line().bisectrisse(ang1).angle(0), lin1.angle(0)+15)
  , new test("midPerpendicular 1", new Line().midPerpendicular(seg1).isPerpendicularTo(seg1))
  , new test("midPerpendicular 2", new Line().midPerpendicular(seg1).point(0).xy, seg1.middle.xy)
  , new test("tangentTo 1"
  , new Line().at(cir1.point(1)).tangentTo(cir1)
  .isPerpendicularTo(ray(cir1.center, cir1.point(1))))
  , new test("tangentTo 2"
  , new Line().at(point([5,0])).tangentTo(cir1)
  .intersections(cir1).length, 1)
  , new test("tangentTo 3"
  , new Line().at(point([5,0])).tangentTo(cir1,1)
  .reflectAt(line(cir1.center, point([5,0])))
  .isSimilar(new Line().at(point([5,0])).tangentTo(cir1,-1)))
  , new test("distance 1", lin1.distance(lin1.point(4)), 0)
  , new test("distance 2", new Segment().at(lin1.point(0)).perpendicularTo(lin1)
  .extendToLength(10).end.distance(lin1), 10)
  , new test("distance 3", new Line().at(point([5,0])).tangentTo(cir1)
  .distance(cir1), 0)
  , new test("distance 4", lin1.distance(cir1), 0, nequal)
*/
////////////////////////////////////////////////////////////
const testRays = {
    name :'Rays',
    suite : [
	{
	    name     : "isContaining 1",
	    for      : [any.ray, any.number()],
	    assuming : [r => !r.isTrivial],
	    hold  : (r, s) => (s >= 0
			       ? r.isContaining(r.point(s))
			       : !r.isContaining(r.point(s)))
	},
	{
	    name     : "isContaining 2",
	    for      : [any.ray, any.number()],
	    assuming : [r => !r.isTrivial],
	    hold  : (r, s) => !r.isContaining(r.point(s).translate(r.normalV(0)))
	}
    ]
}

/*
  [ new test("identification", ray1 instanceof Curve),
  , new test("copy 1", ray1.copy().pivot, ray1.pivot)
  , new test("copy 2", ray1.copy().vector, ray1.vector)
  , new test("copy 3", ray1.copy().point(5), ray1.point(5))
  , new test("copy 4", ray1.copy().angle(0), ray1.angle(0))
  , new test("isContaining 1", ray1.isContaining(ray1.start))
  , new test("isContaining 2", ray1.isContaining(ray1.point(2)))
  , new test("isContaining 3", !(ray1.isContaining(ray1.point(-2))))
  , new test("isContaining 4", !ray1.isContaining(origin))
  , new test("isEqual 1", ray1.isEqual(ray1))
  , new test("isEqual 2", !ray1.isEqual(new Ray()))
  , new test("isEqual 3", ray1.isEqual(new Ray().at(ray1.start).parallelTo(ray1)))
  , new test("isEqual 4", !ray1.isEqual(ray1.flip()))
  , new test("isSimilar 1", ray1.isSimilar(new Ray().at(ray1.start).parallelTo(ray1)))
  , new test("isSimilar 2", !ray1.isSimilar(new Ray().at(ray1.point(1)).parallelTo(ray1)))
  , new test("isSimilar 3", !ray1.isSimilar(ray1.flip()))
  , new test("joining", new Ray().joining(pnt1,pnt1).vector, [0,0])
  , new test("flip 1", ray1.isEqual(ray1.flip().flip()))
  , new test("flip 2", ray1.start.isEqual(ray1.flip().start))
  , new test("flip 3", equal(ray1.tangentV(0), ray1.flip().tangentV(0).scale(-1)))
*/

////////////////////////////////////////////////////////////
const testSegments = {
    name : 'Segments',
    suite : [
	{
	    name     : "isContaining 1",
	    for      : [any.segment, any.number()],
	    assuming : [s => !s.isTrivial],
	    hold  : (s, t) => (t >= 0 && t <= 1
			       ? s.isContaining(s.point(t))
			       : !s.isContaining(s.point(t)))
	},
	{
	    name     : "extension 1",
	    for      : [any.segment, any.number()],
	    hold  : (s, n) => equal(s.extend(n).length, abs(n)*s.length) },
	{
	    name     : "extension 2",
	    for      : [any.segment, any.number()],
	    hold  : (s, n) => equal(s.extend(n).extend(n).length, n*n*s.length)
	},
	{
	    name     : "extension 3",
	    for      : [any.segment, any.number()],
	    assuming : [(_,n) => n >= 0],
	    hold  : (s, n) => equal(s.extendToLength(n).length, s.isTrivial ? 0 : n)
	},
	{
	    name     : "extension 4",
	    for      : [any.segment],
	    hold  : (s, n) => s.extend(0).isTrivial && s.extendToLength(0).isTrivial
	}
    ]
}

/*

const testTransformations = {
    name : 'Transformations',
    suite : [
	new test("translate 3", new Line().translate([1,2]).pivot, [1,2])
	, new test("translate 4", new Line().translate([1,2]).vector, [1,0])
	, new test("translate 5", new Circle(2).translate([1,2]).center.xy, [1,2])
	, new test("translate 6", new Circle(2).translate([1,2]).R, 2)
	, new test("translate 7", seg1.translate([5,6]).start.xy, [6,8])
	, new test("translate 8", seg1.translate([5,6]).end.xy, [11,12])
	, new test("translate 9", seg1.translate([5,6]).isParallelTo(seg1))
	, new test("translate 10", cir1.translate([5,6]).center.xy, [6,8])
	, new test("translate 11", cir1.translate([5,6]).R, 3)
    ]
}


const testGroup = {
    name : 'Group',
    suite : [
	new test("identification", grp1 instanceof Curve, false)
	, new test("elements 1", grp1.element(1).option('label'), "A")
	, new test("elements 2", grp1.element(6) instanceof Circle)
	, new test("elements 3", grp1.element(8).xy, [1,2])
	, new test("copy", range(1,8).every(i => grp2.element(i).isEqual(grp1.element(i))))
    ]
}


const testSegment = {
    name : 'Segment',
    suite : [
	new test("identification", seg1 instanceof Curve),
	new test("copy 1", seg1.copy().start.xy, seg1.start.xy)
	, new test("copy 2", seg1.copy().end.xy, seg1.end.xy)
	, new test("copy 3", seg1.copy().isEqual(seg1))
	, new test("copy 4", !seg1.copy().isEqual(seg1.rotate(30)))
	, new test("isContaining 1", seg1.isContaining(seg1.point(0)))
	, new test("isContaining 2", seg1.isContaining(seg1.point(1/2)))
	, new test("isContaining 3", !seg1.isContaining(seg1.point(1.4)))
	, new test("isContaining 4", !seg1.isContaining(seg1.point(-1.4)))
	, new test("isContaining 5", !seg1.isContaining(origin))
	, new test("isContaining 6", new Segment().extendToLength(10).isContaining(point([0,0])))
	, new test("isContaining 7", new Segment().extendToLength(10).isContaining(point([5,0])))
	, new test("isContaining 8", new Segment().extendToLength(10).isContaining(point([10,0])))
	, new test("isContaining 9", !new Segment().extendToLength(10).isContaining(point([15,0])))
	, new test("isContaining 10", !new Segment().extendToLength(10).isContaining(point([-10,0])))
	, new test("isContaining 11", !new Segment().extendToLength(10).isContaining(point([-11,0])))
	, new test("isContaining 12", !new Segment().extendToLength(10).isContaining(point([-9,0])))
	, new test("isContaining 13", !new Segment().extendToLength(10).isContaining(point([5,1])))
	, new test("isSimilar 1", seg1.isSimilar(seg1.rotate(30)))
	, new test("isSimilar 2", !seg1.isSimilar(seg1.scale(2)))
	, new test("isSimilar 3", seg1.isSimilar(seg1.copy()))
	, new test("extend 1", seg1.extend(0,1).isEqual(seg1))
	, new test("extend 2", seg1.extend(0,2).length, seg1.length*2)
	, new test("extend 3", seg1.extend(-2,0).length, seg1.length*2)
	, new test("extend 4", seg1.extend(0,2).isContaining(seg1.point(1.4)))
	, new test("extend 5", seg1.extend(1).isEqual(seg1))
	, new test("extend 6", seg1.extend(2).isEqual(seg1.extend(0,2)))
	, new test("extendToLength 1", seg1.extendToLength(seg1.length).isSimilar(seg1))
	, new test("extendToLength 2", seg1.extendToLength(-1).length, 1)
	, new test("extendToLength 3", seg1.extendToLength(25).length, 25)
	, new test("extendToLine 1", seg1.extendToLine(Ox).start.isEqual(seg1.start))
	, new test("extendToLine 2", Ox.isContaining(seg1.extendToLine(Ox).end))
	, new test("extendToLine 3", seg1.extendToLine(Ox).isParallelTo(seg1))
	, new test("extendToLine 4"
		   , seg1.extendToLine(new Ray().parallelTo(seg1))
		   .isSimilar(new Ray().at(seg1.start).parallelTo(seg1)))
	, new test("heightTo 1", seg1.heightTo(Ox).length, seg1.start.y)
	, new test("heightTo 2", seg1.heightTo(Oy).length, seg1.start.x)
	, new test("heightTo 3", seg1.heightTo(lin1).length, 0)
	, new test("heightTo 4", seg1.heightTo(lin2).isPerpendicularTo(lin2))
	, new test("tangentTo 1"
		   , new Segment().at(cir1.point(1)).tangentTo(cir1)
		   .isPerpendicularTo(ray(cir1.center, cir1.point(1))))
	, new test("tangentTo 2"
		   , new Segment().at(point([5,0])).tangentTo(cir1)
		   .intersections(cir1).length, 0)
	, new test("tangentTo 3"
		   , new Segment().at(point([5,0])).tangentTo(cir1,1)
		   .reflectAt(line(cir1.center, point([5,0])))
		   .isSimilar(new Segment().at(point([5,0])).tangentTo(cir1,-1)))
    ]
}

const testIntersections = {
    name : 'Intersections',
    suite : [
	new test("line & line 1", l1.intersections(l2).length, 1)
	, new test("line & line 2", l1.intersections(l2)[0].xy, [5,8])
	, new test("line & line 3", l2.intersections(l1)[0].xy, [5,8])
	//   , new test("line & line 4", l2.intersections(l2), [l2.point(0)])
	, new test("line & line 5", l2.intersections(l2.translate([0,1])), [])
	, new test("line & line 6", lin1.intersections(Ox)[0].xy, [-1/2,0])
	, new test("line & line 7", Oy.intersections(Ox)[0].xy, [0,0])
	, new test("line & ray 1", Ox.intersections(ray(point([2,-3]),45)).map(p => p.xy), [[5,0]])
	, new test("line & ray 2", Ox.intersections(ray(point([2,3]),45)), [])
	, new test("line & ray 3", ray(point([2,-3]),45).intersections(Ox).map(p => p.xy), [[5,0]])
	, new test("ray & ray 1", ray(point([2,-3]),45)
		   .intersections(ray(point([1,0]),-45)).map(p => p.xy), [[3,-2]])
	, new test("ray & ray 2", ray(point([2,-3]),45)
		   .intersections(ray(point([5,0]),-45)).map(p => p.xy), [[5,0]])
	, new test("ray & ray 3", ray(point([2,-3]),45)
		   .intersections(ray(point([0,-1]),-45)).map(p => p.xy), [[2,-3]])
	, new test("ray & ray 4", ray(point([2,-3]),45)
		   .intersections(ray(point([6,0]),-45)), [])
	, new test("ray & ray 5", ray(point([2,-3]),45)
		   .intersections(ray(point([1,-4]),180+45)), [])
	, new test("ray & ray 6", ray(point([2,-3]),45)
		   .intersections(ray(point([2,-3]),180+45)), [point([2,-3])])
	, new test("line & segment 1", Ox.intersections(s1), [])
	, new test("line & segment 2", Ox.intersections(s1.translate([0,-5])), [])
	, new test("line & segment 3", Ox.intersections(s1.translate([0,-1])), [point([1,0])])
	, new test("line & segment 4", Ox.intersections(s1.translate([0,-2])), [point([1.5,0])])
	, new test("ray & segment 1", ray(origin).intersections(s1), [])
	, new test("ray & segment 2", ray(origin).intersections(s1.translate([0,-5])), [])
	, new test("ray & segment 3", ray(origin).intersections(s1.translate([0,-1])), [point([1,0])])
	, new test("ray & segment 4", ray(origin).intersections(s1.translate([0,-2])), [point([1.5,0])])
	, new test("ray & segment 5", ray(origin).flip().intersections(s1.translate([0,-2])), [])
	, new test("circle & line 1", new Circle().intersections(Ox).map(p => p.xy), [[1,0],[-1,0]])
	, new test("circle & line 2", new Circle().translate([0,1]).intersections(Ox).map(p => p.xy), [[0,0]])
	, new test("circle & line 3", new Circle().translate([0,1.1]).intersections(Ox), [])
    ]
}

const testAngle = {
    name : 'Angle',
    suite : [
	new test("angleV 1", angleV([0,0]), 0)
	, new test("angleV 2", angleV([1,1]), 45)
	, new test("angleV 3", angleV([-1,1]), 135)
	, new test("angleV 4", angleV([-1,-1]), 225)
	, new test("angleV 5", angleV([1,-1]), 315)
	, new test("identification", !(ang1 instanceof Curve))
	, new test("copy 1", ang1.copy().isEqual(ang1))
	, new test("copy 2", ang1.value, ang1.copy().on(seg1), nequal)
	, new test("setValue 1", new Angle().on(lin1).setValue(90).endRay.isPerpendicularTo(lin1))
	, new test("setValue 2", new Angle().setValue(80).start, 0)
	, new test("isEqual 1", ang1.isEqual(ang1))
	, new test("isEqual 2", !ang1.isEqual(new Angle(45)))
	, new test("isEqual 3", ang1.isEqual(ang1.copy()))
	, new test("isSimilar 1", ang1.isSimilar(new Angle(30)))
	, new test("isSimilar 2", ang1.isSimilar(new Angle(360+30)))
	, new test("isSimilar 3", !ang1.isSimilar(new Angle(60)))
	, new test("on 1", new Angle(10).on(seg1).start, seg1.angle(0))
	, new test("on 2", new Angle(10).on(seg1).end, seg1.angle(0)+10)
	, new test("on 3", new Angle(10).on(seg1).vertex, seg1.start)
	, new test("on 4", new Angle(10).on(seg1).value, 10)
	, new test("at 1", new Angle().at(pnt1).vertex.xy, pnt1.xy)
	, new test("translate 1", ang1.translate([10,20]).vertex.xy, [11,22])
	, new test("translate 2", ang1.translate([3,4]).value, ang1.value)
	, new test("translate 3", ang1.translate([10,20]).start, lin1.angle(0))
	, new test("scale 1", ang1.scale(10,10).vertex.xy, [10,20])
	, new test("scale 2", ang1.scale(10,10).value, ang1.value)
	, new test("scale 3", ang1.scale(10,10).start, lin1.angle(0))
	, new test("rotate 1", ang1.rotateAt(point([1,2]),10).vertex.xy, ang1.vertex.xy)
	, new test("rotate 2", ang1.rotate(10).value, ang1.value)
	, new test("rotate 3", ang1.rotate(10).start, lin1.angle(0) + 10)
	, new test("reflect 1", ang1.reflectAt(point([1,2])).vertex.xy, ang1.vertex.xy)
	, new test("reflect 2", ang1.reflectAt(point([1,2])).value, ang1.value)
	, new test("reflect 3", ang1.reflectAt(point([1,2])).start, ang1.start+180)
	, new test("reflect 4", ang1.reflectAt(point([1,2])).end, ang1.end+180)
	, new test("reflect 5", ang1.reflectAt(lin1).vertex.xy, ang1.vertex.xy)
	, new test("reflect 6", ang1.reflectAt(lin1).value, ang1.complement().value)
	, new test("reflect 7", ang1.reflectAt(lin1).start, lin1.angle(0))
	, new test("reflect 8", ang1.reflectAt(lin1).end, lin1.angle(0)-ang1.value)
	, new test("vertical", ang1.vertical().value, ang1.value)
	, new test("adjacent", ang1.adjacent().value, 180-ang1.value)
	, new test("complement", ang1.complement().value, 360-ang1.value)
	, new test("within 1", new Angle().within(cir1.point(1/12), cir1.center, cir1.point(1/6)).value, 30)
	, new test("within 2", new Angle().within(cir1.point(1/6), cir1.center, cir1.point(1/12)).value, 330)
	, new test("within 3", new Angle().within(cir1.point(1/4), cir1.point(2), cir1.point(3/4)).isRight)
	, new test("within 4", new Angle().within(cir1.point(1/12), cir1.center, cir1.point(1/12)).value, 0)
	, new test("within 5", new Angle().within(pnt1, pnt1, pnt1).value, 0)
	, new test("within 6", new Angle().within(pnt1, pnt2, pnt2).value, 135)
	, new test("within 7", new Angle().within(pnt2, pnt2, pnt1).value, 225)
	, new test("within 8", new Angle().within(pnt2, pnt1, pnt2).value, 0)
	, new test("between 1", new Angle().between(Ox,lin1).value, lin1.angle(0))
	, new test("between 2", new Angle().between(Oy, Ox).isRight)
	, new test("between 3", new Angle().between(lin1, lin1).value, 0)
    ]
}

const testPolygon = {
    name : 'Polygon',
    suite : [
	new test("identification", pol1 instanceof Curve)
	//   , new test("copy 1", pol1.copy().isEqual(pol1))
	//   , new test("isEqual 1", pol1.copy().isEqual(new Polygon().through([pnt1, pnt2, origin])))
	//   , new test("isEqual 2", !pol1.copy().isEqual(new Polygon().through([pnt1, origin, pnt2])))
	, new test("area 1", !tri1.isEnclosing(tri1.median(3).point(0)))
	, new test("area 2", tri1.isEnclosing(tri1.median(3).middle))
	, new test("area 3", !tri1.isEnclosing(tri1.median(3).point(1)))
	, new test("area 4", !tri1.isEnclosing(tri1.median(3).point(2)))
	, new test("area 5", !tri1.isEnclosing(tri1.median(3).point(-1)))
	, new test("area 6", new Square(2).isEnclosing(origin))
	, new test("area 7", new Square(2).isEnclosing(point([1,0])))
	, new test("area 8", !(new Square(2).isEnclosing(point([2,0]))))
	, new test("curve 1", tri1.isContaining(tri1.median(3).point(1)))
	, new test("curve 2", tri1.isContaining(tri1.median(3).point(0)))
	, new test("curve 3", !tri1.isContaining(tri1.bisectrisse(1).point(1/2)))
	, new test("translate")
	, new test("scale")
	, new test("superpose")
	, new test("rotate")
	, new test("reflect")
    ]
}

const testSquare = {
    name : 'Square',
    suite : [
	new test("identification 1", new Square(2) instanceof Curve)
	, new test("identification 2", new Square(2) instanceof Square)
	, new test("identification 3", new Square(2) instanceof Quadrilateral)
	, new test("identification 4", new Square(2) instanceof Polygon)
	, new test("constructor 1", new Square(2).sides.same(s => s.length))
	, new test("constructor 2", new Square(2).side(1).length, 2)
	, new test("constructor 3", new Square().through(pnt1, pnt2).side(1).middle, [2,3])
	, new test("constructor 4", new Square().on(seg1).side(1), seg1)
	, new test("constructor 5", new Square().sideLength(10).side(2).length, 10)
    ]
}

const testCircle = {
    name : 'Circle',
    suite : [
	new test("identification", cir1 instanceof Curve),
	new test("copy 1", seg1.copy().start.xy, seg1.start.xy)
	, new test("copy 2", seg1.copy().end.xy, seg1.end.xy)
	, new test("area 1", cir1.isEnclosing(cir1.center))
	, new test("area 2", cir1.isEnclosing(cir1.center.translate([cir1.R/2,0])))
	, new test("area 3", cir1.isEnclosing(cir1.center.translate([cir1.R-1e-12,0])))
	, new test("area 4", cir1.isEnclosing(cir1.center.translate([cir1.R,0])))
	, new test("area 5", !cir1.isEnclosing(cir1.center.translate([cir1.R+1e-12,0])))
	, new test("curve 1", cir1.isContaining(cir1.point(1)))
	, new test("curve 2", cir1.isContaining(cir1.center.translate([cir1.R,0])))
	, new test("curve 3", !cir1.isContaining(cir1.center.translate([cir1.R-1e-9,0])))
	, new test("curve 4", !cir1.isContaining(cir1.center.translate([cir1.R+1e-9,0])))
	, new test("translate")
	, new test("scale")
	, new test("superpose")
	, new test("rotate")
	, new test("reflect")
    ]
}
*/

var allTests = {
    name : 'all',
    suite : [
	testPoints,
	testLines,
	testRays,
	testSegment,
	testPolygon,
	testCircle,
	testAngles,
	testAngle,
	testTransformations,
	testGroup,
	testIntersections
    ]
}

runTests(allTests)
console.log('Testing done')