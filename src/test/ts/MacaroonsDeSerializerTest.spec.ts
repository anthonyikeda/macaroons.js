import { MacaroonsBuilder,
  MacaroonsSerializer,
  Macaroon,
  MacaroonsDeSerializer,
  CaveatPacketType,
  Base64Tools } from '../../main/ts';
import { expect } from 'chai';

describe('MacaroonsDeSerializerTest', function () {

    var location = "http://mybank/";
    var secret = "this is our super secret key; only we should know it";
    var identifier = "we used our secret key";
  
    it("a macaroon can eq de-serialized", function () {
  
      var m:Macaroon = new MacaroonsBuilder(location, secret, identifier).getMacaroon();
      var serialized = m.serialize();
  
      var deserialized:Macaroon = MacaroonsDeSerializer.deserialize(serialized);
  
      expect(m.identifier).to.eq(deserialized.identifier);
      expect(m.location).to.eq(deserialized.location);
      expect(m.signature).to.eq(deserialized.signature);
    });
  
    it("a macaroon with caveats can eq de-serialized", function () {
  
      var m:Macaroon = new MacaroonsBuilder(location, secret, identifier)
        .add_first_party_caveat("test = first_party")
        .add_third_party_caveat("third_party_location", "third_party_key", "test = third_party")
        .getMacaroon();
      var serialized = m.serialize();
  
      var vidAsBase64 = new Buffer(Base64Tools.transformBase64UrlSafe2Base64("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANLvrJ16nNUxLJ18zzy+kqCJ3dX2JTjTWl4c/F1aFDVWUgQ5W3Klk3eC7SoOU7acF"), 'base64');
  
      var deserialized: Macaroon = MacaroonsDeSerializer.deserialize(serialized);
  
      expect(m.identifier).to.eq(deserialized.identifier);
      expect(m.location).to.eq(deserialized.location);
      expect(m.caveatPackets[0].type).to.eq(CaveatPacketType.cid);
      expect(m.caveatPackets[0].getValueAsText()).to.eq("test = first_party");
      expect(m.caveatPackets[1].type).to.eq(CaveatPacketType.cid);
      expect(m.caveatPackets[1].getValueAsText()).to.eq("test = third_party");
      expect(m.caveatPackets[2].type).to.eq(CaveatPacketType.vid);
      expect(m.caveatPackets[2].getRawValue().toString('base64')).to.eq(vidAsBase64.toString('base64'));
      expect(m.caveatPackets[3].type).to.eq(CaveatPacketType.cl);
      expect(m.caveatPackets[3].getValueAsText()).to.eq('third_party_location');
      expect(m.signature).to.eq(deserialized.signature);
    });
  
    it("to short base64 throws Error", function () {
      // packet is: "123"
      expect(() => MacaroonsDeSerializer.deserialize("MTIzDQo=")).to.throw(/.*Not enough bytes for signature found.*/);
    });
  
    it("invalid packet length throws Error", function () {
      // packet is: "fffflocation http://mybank12345678901234567890.com"
      expect(() => MacaroonsDeSerializer.deserialize("ZmZmZmxvY2F0aW9uIGh0dHA6Ly9teWJhbmsxMjM0NTY3ODkwMTIzNDU2Nzg5MC5jb20="))
          .to.throw(/.*Not enough data bytes available.*/);
    });
  
  });
  