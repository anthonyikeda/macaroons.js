import { MacaroonsBuilder } from '../../main/ts';
import { expect } from 'chai';

describe('MacaroonsBuilderTest', function () {

    var location = "http://mybank/";
    var identifier = "we used our secret key";
    var secret = "this is our super secret key; only we should know it";
  
    it("create a Macaroon and verify signature location and identfier using secret string", function () {
  
      var m = new MacaroonsBuilder(location, secret, identifier).getMacaroon();
  
      expect(m.location).to.eq(location);
      expect(m.identifier).to.eq(identifier);
      expect(m.signature).to.eq("e3d9e02908526c4c0039ae15114115d97fdd68bf2ba379b342aaf0f617d0552f");
    });
  
    it("create a Macaroon and verify signature location and identfier using secret Buffer ", function () {
  
      var m = new MacaroonsBuilder(location, new Buffer(secret,'ascii'), identifier).getMacaroon();
  
      expect(m.location).to.eq(location);
      expect(m.identifier).to.eq(identifier);
      expect(m.signature).to.eq("5c748a4dabfd5ff2a0b5ab56120c8021912b591ac09023b4bffbc6e1b54e664f");
    });
  
    it("create a Macaroon with static helper function using secret string", function () {
  
      var m = MacaroonsBuilder.create(location, secret, identifier);
  
      expect(m.location).to.eq(location);
      expect(m.identifier).to.eq(identifier);
      expect(m.signature).to.eq("e3d9e02908526c4c0039ae15114115d97fdd68bf2ba379b342aaf0f617d0552f");
    });
  
    it("create a Macaroon with static helper function using secret Buffer", function () {
  
      var m = MacaroonsBuilder.create(location, new Buffer(secret,'ascii'), identifier);
  
      expect(m.location).to.eq(location);
      expect(m.identifier).to.eq(identifier);
      expect(m.signature).to.eq("5c748a4dabfd5ff2a0b5ab56120c8021912b591ac09023b4bffbc6e1b54e664f");
    });
  
    it("create a Macaroon and inspect", function () {
  
      var inspect = MacaroonsBuilder.create(location, secret, identifier).inspect();
  
      expect(inspect).to.eq(
          "location http://mybank/\n" +
          "identifier we used our secret key\n" +
          "signature e3d9e02908526c4c0039ae15114115d97fdd68bf2ba379b342aaf0f617d0552f\n"
      );
    });
  
    it("different locations doesnt change the signatures", function () {
  
      var m1 = new MacaroonsBuilder("http://location_ONE", secret, identifier).getMacaroon();
      var m2 = new MacaroonsBuilder("http://location_TWO", secret, identifier).getMacaroon();
  
      expect(m1.signature).to.eq(m2.signature);
    });
  
  
  });
  
