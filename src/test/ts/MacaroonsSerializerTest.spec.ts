import { Macaroon,
    MacaroonsBuilder,
    MacaroonsSerializer } from '../../main/ts';
import { expect } from 'chai';

describe('MacaroonSerializerTest', function () {

    var location = "http://mybank/";
    var secret = "this is our super secret key; only we should know it";
    var identifier = "we used our secret key";
  
    it("a macaroon can be serialized", function () {
  
      var m = new MacaroonsBuilder(location, secret, identifier).getMacaroon();
  
      expect(MacaroonsSerializer.serialize(m)).to.eq("MDAxY2xvY2F0aW9uIGh0dHA6Ly9teWJhbmsvCjAwMjZpZGVudGlmaWVyIHdlIHVzZWQgb3VyIHNlY3JldCBrZXkKMDAyZnNpZ25hdHVyZSDj2eApCFJsTAA5rhURQRXZf91ovyujebNCqvD2F9BVLwo");
      expect(MacaroonsSerializer.serialize(m)).to.eq(m.serialize());
    });
  
  });
  