import { MacaroonsBuilder,
    CaveatPacketType } from '../../main/ts';
import { expect } from 'chai';

describe('MacaroonBuilderCaveatsTest', function () {

    var location = "http://mybank/";
    var identifier = "we used our secret key";
    var secret = "this is our super secret key; only we should know it";
  
  
    it("add first party caveat", function () {
  
      var m = new MacaroonsBuilder(location, secret, identifier)
          .add_first_party_caveat("account = 3735928559")
          .getMacaroon();
  
      expect(m.location).to.eq(location);
      expect(m.identifier).to.eq(identifier);
      expect(m.caveatPackets[0].getValueAsText()).to.eq("account = 3735928559");
      expect(m.signature).to.eq("1efe4763f290dbce0c1d08477367e11f4eee456a64933cf662d79772dbb82128");
    });
  
  
    it("modify also copies first party caveats", function () {
  
      // given
      var m = new MacaroonsBuilder(location, secret, identifier)
          .add_first_party_caveat("account = 3735928559")
          .getMacaroon();
  
      // when
      m = MacaroonsBuilder.modify(m)
          .getMacaroon();
  
      expect(m.location).to.eq(location);
      expect(m.identifier).to.eq(identifier);
      expect(m.caveatPackets[0].getValueAsText()).to.eq("account = 3735928559");
      expect(m.signature).to.eq("1efe4763f290dbce0c1d08477367e11f4eee456a64933cf662d79772dbb82128");
    });
  
  
    it("add first party caveat 3 times", function () {
  
      // given
      var m = new MacaroonsBuilder(location, secret, identifier)
          .add_first_party_caveat("account = 3735928559")
          .add_first_party_caveat("time < 2015-01-01T00:00")
          .add_first_party_caveat("email = alice@example.org")
          .getMacaroon();
  
      expect(m.location).to.eq(location);
      expect(m.identifier).to.eq(identifier);
      expect(m.caveatPackets[0].type).to.eq(CaveatPacketType.cid);
      expect(m.caveatPackets[0].getValueAsText()).to.eq("account = 3735928559");
      expect(m.caveatPackets[1].type).to.eq(CaveatPacketType.cid);
      expect(m.caveatPackets[1].getValueAsText()).to.eq("time < 2015-01-01T00:00");
      expect(m.caveatPackets[2].type).to.eq(CaveatPacketType.cid);
      expect(m.caveatPackets[2].getValueAsText()).to.eq("email = alice@example.org");
      expect(m.signature).to.eq("882e6d59496ed5245edb7ab5b8839ecd63e5d504e54839804f164070d8eed952");
    });
  
  
    it("add first party caveat German umlauts using UTF8 encoding", function () {
  
      // given
      var mb = new MacaroonsBuilder(location, secret, identifier);
      mb = mb.add_first_party_caveat("\u00E4");
      mb = mb.add_first_party_caveat("\u00FC");
      mb = mb.add_first_party_caveat("\u00F6");
      var m = mb.getMacaroon();
  
      expect(m.location).to.eq(location);
      expect(m.identifier).to.eq(identifier);
      expect(m.caveatPackets[0].type).to.eq(CaveatPacketType.cid);
      expect(m.caveatPackets[0].getValueAsText()).to.eq("\u00E4");
      expect(m.caveatPackets[1].type).to.eq(CaveatPacketType.cid);
      expect(m.caveatPackets[1].getValueAsText()).to.eq("\u00FC");
      expect(m.caveatPackets[2].type).to.eq(CaveatPacketType.cid);
      expect(m.caveatPackets[2].getValueAsText()).to.eq("\u00F6");
      expect(m.signature).to.eq("e38cce985a627fbfaea3490ca184fb8c59ec2bd14f0adc3b5035156e94daa111");
    });
  
  
    it("add first party caveat null save", function () {
  
      // given
      var m = new MacaroonsBuilder(location, secret, identifier)
          .add_first_party_caveat(null)
          .getMacaroon();
  
      expect(m.location).to.eq(location);
      expect(m.identifier).to.eq(identifier);
      expect(m.signature).to.eq("e3d9e02908526c4c0039ae15114115d97fdd68bf2ba379b342aaf0f617d0552f");
    });
  
  
    it("add first party caveat inspect", function () {
  
      // given
      var m = new MacaroonsBuilder(location, secret, identifier)
          .add_first_party_caveat("account = 3735928559")
          .getMacaroon();
  
      var inspect = m.inspect();
  
      expect(inspect).to.eq(
          "location http://mybank/\n" +
          "identifier we used our secret key\n" +
          "cid account = 3735928559\n" +
          "signature 1efe4763f290dbce0c1d08477367e11f4eee456a64933cf662d79772dbb82128\n"
      );
    });
  
  
  });
  