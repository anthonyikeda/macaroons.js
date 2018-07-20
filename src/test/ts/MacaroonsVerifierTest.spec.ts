import { MacaroonsBuilder } from '../../main/ts';
import { MacaroonsVerifier } from '../../main/ts';
import { Macaroon } from '../../main/ts';
import { TimestampCaveatVerifier } from '../../main/ts';
import { expect } from 'chai';

describe('MacaroonsVerifierTest', function () {

    var location = 'http://mybank/';
    var secret:any = 'this is our super secret key; only we should know it';
    var secretBytes = new Buffer('a96173391e6bfa0356bbf095621b8af1510968e770e4d27d62109b7dc374814b', 'hex');
    var identifier = 'we used our secret key';
  
  
    it("verify a valid Macaroon with secret string", function () {
      var m = new MacaroonsBuilder(location, secret, identifier).getMacaroon();
      var verifier = new MacaroonsVerifier(m);
  
      expect(verifier.isValid(secret)).to.eq(true);
    });
  
  
    it("verify a valid Macaroon with secret Buffer", function () {
      secret = new Buffer(secret, 'ascii');
      var m = new MacaroonsBuilder(location, secret, identifier).getMacaroon();
      var verifier = new MacaroonsVerifier(m);
  
      expect(verifier.isValid(secret)).to.eq(true);
    });
  
  
    it("verify a valid Macaroon with assertion with secret string", function () {
      var m = new MacaroonsBuilder(location, secret, identifier).getMacaroon();
      var verifier = new MacaroonsVerifier(m);
      expect(() => verifier.assertIsValid(secret)).to.not.throw();
    });
  
  
    it("verify a valid Macaroon with assertion with secret Buffer", function () {
      secret = new Buffer(secret, 'ascii');
      var m = new MacaroonsBuilder(location, secret, identifier).getMacaroon();
      var verifier = new MacaroonsVerifier(m);
  
      expect(() => verifier.assertIsValid(secret)).to.not.throw();
    });
  
  
    it("verify an invalid Macaroon", function () {
      var m = new MacaroonsBuilder(location, secret, identifier).getMacaroon();
      var verifier = new MacaroonsVerifier(m);
  
      expect(verifier.isValid("wrong secret")).to.eq(false);
    });
  
  
    it("verify an invalid Macaroon with assertion", function () {
      var m = new MacaroonsBuilder(location, secret, identifier).getMacaroon();
      var verifier = new MacaroonsVerifier(m);
  
      expect(() => verifier.assertIsValid("wrong secret")).to.throw();
    });
  
  
    it("verification satisfy exact first party caveat", function () {
      var m = new MacaroonsBuilder(location, secret, identifier)
          .add_first_party_caveat("account = 3735928559")
          .getMacaroon();
  
      var verifier = new MacaroonsVerifier(m);
      expect(verifier.isValid(secret)).to.eq(false);
  
      verifier.satisfyExact("account = 3735928559");
      expect(verifier.isValid(secret)).to.eq(true);
    });
  
  
    it("verification satisfy exact attenuate with additional caveats", function () {
      var m = new MacaroonsBuilder(location, secret, identifier)
          .add_first_party_caveat("account = 3735928559")
          .getMacaroon();
  
      var verifier = new MacaroonsVerifier(m);
      expect(verifier.isValid(secret)).to.eq(false);
  
      verifier.satisfyExact("account = 3735928559");
      verifier.satisfyExact("IP = 127.0.0.1')");
      verifier.satisfyExact("browser = Chrome')");
      verifier.satisfyExact("action = deposit");
      expect(verifier.isValid(secret)).to.eq(true);
    });
  
  
    it("verification general", function () {
      var m = new MacaroonsBuilder(location, secret, identifier)
          .add_first_party_caveat("time < 2020-12-31T18:23:45Z")
          .getMacaroon();
  
      var verifier = new MacaroonsVerifier(m);
      expect(verifier.isValid(secret)).to.eq(false);
  
      verifier.satisfyGeneral(TimestampCaveatVerifier);
      expect(verifier.isValid(secret)).to.eq(true);
    });
  
  });
  