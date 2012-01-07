/**
 * @class BroadPhase
 * @todo Make it a base class for broadphase implementations, and rename this one to NaiveBroadphase
 */
PHYSICS.BroadPhase = function(){
  
};

/**
 * Get all the collision pairs in a physics world
 * @param World world
 * @todo Should be placed in a subclass to BroadPhase
 */
PHYSICS.BroadPhase.prototype.collisionPairs = function(world){
  var pairs1 = [];
  var pairs2 = [];
  var n = world.numObjects();

  // Local fast access
  var SPHERE = PHYSICS.RigidBody.prototype.types.SPHERE;
  var PLANE =  PHYSICS.RigidBody.prototype.types.PLANE;
  var BOX =    PHYSICS.RigidBody.prototype.types.BOX;
  var x = world.x;
  var y = world.y;
  var z = world.z;
  var geodata = world.geodata;
  var type = world.type;

  // Naive N^2 ftw!
  for(var i=0; i<n; i++){
    for(var j=0; j<i; j++){

      // Sphere-sphere
      if(type[i]==SPHERE && type[j]==SPHERE){
	var r2 = (geodata[i].radius + geodata[j].radius);
	if(Math.abs(x[i]-x[j]) < r2 && 
	   Math.abs(y[i]-y[j]) < r2 && 
	   Math.abs(z[i]-z[j]) < r2){
	  pairs1.push(i);
	  pairs2.push(j);
	}

	// Sphere-plane
      } else if((type[i]==SPHERE && type[j]==PLANE) ||
		(type[i]==PLANE &&  type[j]==SPHERE)){
	var si = type[i]==SPHERE ? i : j;
	var pi = type[i]==PLANE ? i : j;
	
	// Rel. position
	var r = new PHYSICS.Vec3(x[si]-x[pi],
				 y[si]-y[pi],
				 z[si]-z[pi]);
	var normal = geodata[pi].normal;
	var q = r.dot(normal)-geodata[si].radius;
	if(q<0.0){
	  pairs1.push(i);
	  pairs2.push(j);
	}
	
	// Box-plane
      } else if((type[i]==BOX && type[j]==PLANE) ||
		(type[i]==PLANE &&  type[j]==BOX)){
	var bi = type[i]==BOX   ? i : j;
	var pi = type[i]==PLANE ? i : j;
	
	// Rel. position
	var r = new PHYSICS.Vec3(x[bi]-x[pi],
				 y[bi]-y[pi],
				 z[bi]-z[pi]);
	var normal = geodata[pi].normal;
	var d = r.dot(normal); // Distance from box center to plane
	var boundingRadius = world.body.halfExtents.norm();
	var q = d - boundingRadius;
	if(q<0.0){
	  pairs1.push(i);
	  pairs2.push(j);
	}
      }
    }
  }

  return [pairs1,pairs2];
};
