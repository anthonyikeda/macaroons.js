/*
 * Copyright 2014 Martin W. Kirst
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/// <reference path="../../typings/tsd.d.ts" />

declare var require; // TODO: bad hack to make TSC compile, possible reason https://github.com/Microsoft/TypeScript/issues/954
var expect = require('expect.js');

import MacaroonsBuilder = require('../../main/ts/MacaroonsBuilder');
import Macaroon = require('../../main/ts/Macaroon');


describe('MacaroonBuilderTest', function () {

  var location = "http://mybank/";
  var identifier = "we used our secret key";
  var secret = "this is our super secret key; only we should know it";

  it("create a Macaroon and verify signature location and identfier", function () {

    var m = new MacaroonsBuilder(location, secret, identifier).getMacaroon();

    expect(m.location).to.be(location);
    expect(m.identifier).to.be(identifier);
    expect(m.signature).to.be("e3d9e02908526c4c0039ae15114115d97fdd68bf2ba379b342aaf0f617d0552f");
  });

  it("create a Macaroon with static helper function", function () {

    var m = MacaroonsBuilder.create(location, secret, identifier);

    expect(m.location).to.be(location);
    expect(m.identifier).to.be(identifier);
    expect(m.signature).to.be("e3d9e02908526c4c0039ae15114115d97fdd68bf2ba379b342aaf0f617d0552f");
  });

});