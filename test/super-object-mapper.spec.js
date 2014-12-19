var expect = require('chai').expect;
var SuperOM = require('../');

describe('Super Object Mapper', function() {
  it('exists', function() {
    expect(SuperOM).to.exist();
  });

  beforeEach(function() {
    SuperOM._mappers = {};
  });

  describe('maps a defined object to a specified map', function() {

    var superOM = new SuperOM();

    var userMapper = {
      "database": {
        "name": "name",
        "email": "email"
      }
    };

    var mapper = 'users';

    superOM.addMapper(userMapper, mapper);

    var map = 'database';
    var object = {
      name: "Mario",
      email: "mario@toadstool.com",
      secrets: "Sleeps with a blanky named Stewart"
    };
    var mappedObject = superOM.mapObject(map, mapper, object);

    it('should return a mapped object', function() {
      expect(mappedObject).to.exist();
    });

    it('should transfer keys and values', function() {
      expect(mappedObject.name).to.equal(object.name).and.exist();
      expect(mappedObject.email).to.equal(object.email).and.exist();
    });

    it('should not include fields that are not in the mapper', function() {
      expect(mappedObject.secrets).not.to.exist();
    });
  });

  describe('caches mappers globally', function() {
    var superOM1 = new SuperOM();
    var superOM2 = new SuperOM();

    var userMapper = {
      "database": {
        "name": "name"
      }
    };

    var locationMapper = {
      "database": {
        "name": "name"
      }
    };

    it('should share mappers between implementations', function(){
      superOM1.addMapper(userMapper, "users");
      superOM2.addMapper(locationMapper, "locations");

      expect(SuperOM._mappers.locations).to.exist();
      expect(SuperOM._mappers.users).to.exist();
    });
  });

  describe('handles missing mappers', function() {
    var superOM = new SuperOM();
    it('should throw a missing mapper error', function() {
      var object = {
        "name": "William Franklyn Bowser"
      };
      var mapObjectFunc = superOM.mapObject.bind(superOM, "database", "gremlins", object);

      expect(mapObjectFunc).to.throw(/Mapper not found/);
    });
  });

  describe('handles missing maps', function() {
    var superOM = new SuperOM();
    it('should throw a missing map error', function() {
      var mapper = {};
      superOM.addMapper(mapper, "koopas");
      var object = {
        "name": "William Franklyn Bowser"
      };
      var mapObjectFunc = superOM.mapObject.bind(superOM, "database", "koopas", object);

      expect(mapObjectFunc).to.throw(/Map not found/);
    });
  });

  describe('handles null', function() {
    var superOM = new SuperOM();
    it('should return null', function() {
      superOM.addMapper({"domain":{}}, "users");
      var mappedObject = superOM.mapObject("domain", "users", null);

      expect(mappedObject).to.equal(null);
    });
  });

});
