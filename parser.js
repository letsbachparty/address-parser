/**
 * U.S./Canada/Mexico address completeness parser. No country is inferred,
 * required, accepted as a routing hint, or returned. Existing extra arguments
 * are ignored for compatibility. Required: Address 1 AND (state OR postal code).
 * City is extracted when possible but is not required for completeness.
 * Shared administrative aliases are accepted as written; stateCandidates lists
 * their possible normalized codes without selecting a country or blocking input.
 * zip accepts five digits, ZIP+4, or the supplied Canadian postal-code pattern.
 * This is a completeness check, not delivery or geographic verification.
 */
(function(f) {
    if (typeof exports === "object" && typeof module !== "undefined") {
        module.exports = f()
    } else if (typeof define === "function" && define.amd) {
        define([], f)
    } else {
        var g;
        if (typeof window !== "undefined") {
            g = window
        } else if (typeof global !== "undefined") {
            g = global
        } else if (typeof self !== "undefined") {
            g = self
        } else {
            g = this
        }
        g.parseAddress = f()
    }
}
)(function() {
    var define, module, exports;
    return function() {
        function r(e, n, t) {
            function o(i, f) {
                if (!n[i]) {
                    if (!e[i]) {
                        var c = "function" == typeof require && require;
                        if (!f && c)
                            return c(i, !0);
                        if (u)
                            return u(i, !0);
                        var a = new Error("Cannot find module '" + i + "'");
                        throw a.code = "MODULE_NOT_FOUND",
                        a
                    }
                    var p = n[i] = {
                        exports: {}
                    };
                    e[i][0].call(p.exports, function(r) {
                        var n = e[i][1][r];
                        return o(n || r)
                    }, p, p.exports, r, e, n, t)
                }
                return n[i].exports
            }
            for (var u = "function" == typeof require && require, i = 0; i < t.length; i++)
                o(t[i]);
            return o
        }
        return r
    }()({
        1: [function(require, module, exports) {
            "use strict";
            (function() {
                var root;
                root = this;
                var XRegExp;
                if (typeof require !== "undefined") {
                    XRegExp = require("xregexp/src/xregexp.js")
                } else
                    XRegExp = root.XRegExp;
                var parser = {};
                var Addr_Match = {};
                var Directional = {
                    north: "N",
                    northeast: "NE",
                    east: "E",
                    southeast: "SE",
                    south: "S",
                    southwest: "SW",
                    west: "W",
                    northwest: "NW"
                };
                var Street_Type = {
                    allee: "aly",
                    alley: "aly",
                    ally: "aly",
                    anex: "anx",
                    annex: "anx",
                    annx: "anx",
                    arcade: "arc",
                    av: "ave",
                    aven: "ave",
                    avenu: "ave",
                    avenue: "ave",
                    avn: "ave",
                    avnue: "ave",
                    bayoo: "byu",
                    bayou: "byu",
                    beach: "bch",
                    bend: "bnd",
                    bluf: "blf",
                    bluff: "blf",
                    bluffs: "blfs",
                    bot: "btm",
                    bottm: "btm",
                    bottom: "btm",
                    boul: "blvd",
                    boulevard: "blvd",
                    boulv: "blvd",
                    branch: "br",
                    brdge: "brg",
                    bridge: "brg",
                    brnch: "br",
                    brook: "brk",
                    brooks: "brks",
                    burg: "bg",
                    burgs: "bgs",
                    bypa: "byp",
                    bypas: "byp",
                    bypass: "byp",
                    byps: "byp",
                    camp: "cp",
                    canyn: "cyn",
                    canyon: "cyn",
                    cape: "cpe",
                    causeway: "cswy",
                    causway: "cswy",
                    causwa: "cswy",
                    cen: "ctr",
                    cent: "ctr",
                    center: "ctr",
                    centers: "ctrs",
                    centr: "ctr",
                    centre: "ctr",
                    circ: "cir",
                    circl: "cir",
                    circle: "cir",
                    circles: "cirs",
                    ck: "crk",
                    cliff: "clf",
                    cliffs: "clfs",
                    club: "clb",
                    cmp: "cp",
                    cnter: "ctr",
                    cntr: "ctr",
                    cnyn: "cyn",
                    common: "cmn",
                    commons: "cmns",
                    corner: "cor",
                    corners: "cors",
                    course: "crse",
                    court: "ct",
                    courts: "cts",
                    cove: "cv",
                    coves: "cvs",
                    cr: "crk",
                    crcl: "cir",
                    crcle: "cir",
                    crecent: "cres",
                    creek: "crk",
                    crescent: "cres",
                    cresent: "cres",
                    crest: "crst",
                    crossing: "xing",
                    crossroad: "xrd",
                    crossroads: "xrds",
                    crscnt: "cres",
                    crsent: "cres",
                    crsnt: "cres",
                    crssing: "xing",
                    crssng: "xing",
                    crt: "ct",
                    curve: "curv",
                    dale: "dl",
                    dam: "dm",
                    div: "dv",
                    divide: "dv",
                    driv: "dr",
                    drive: "dr",
                    drives: "drs",
                    drv: "dr",
                    dvd: "dv",
                    estate: "est",
                    estates: "ests",
                    exp: "expy",
                    expr: "expy",
                    express: "expy",
                    expressway: "expy",
                    expw: "expy",
                    extension: "ext",
                    extensions: "exts",
                    extn: "ext",
                    extnsn: "ext",
                    fall: "fall",
                    falls: "fls",
                    ferry: "fry",
                    field: "fld",
                    fields: "flds",
                    flat: "flt",
                    flats: "flts",
                    ford: "frd",
                    fords: "frds",
                    forest: "frst",
                    forests: "frst",
                    forg: "frg",
                    forge: "frg",
                    forges: "frgs",
                    fork: "frk",
                    forks: "frks",
                    fort: "ft",
                    freeway: "fwy",
                    freewy: "fwy",
                    frry: "fry",
                    frt: "ft",
                    frway: "fwy",
                    frwy: "fwy",
                    garden: "gdn",
                    gardens: "gdns",
                    gardn: "gdn",
                    gateway: "gtwy",
                    gatewy: "gtwy",
                    gatway: "gtwy",
                    glen: "gln",
                    glens: "glns",
                    grden: "gdn",
                    grdn: "gdn",
                    grdns: "gdns",
                    green: "grn",
                    greens: "grns",
                    grov: "grv",
                    grove: "grv",
                    groves: "grvs",
                    gtway: "gtwy",
                    harb: "hbr",
                    harbor: "hbr",
                    harbors: "hbrs",
                    harbr: "hbr",
                    haven: "hvn",
                    havn: "hvn",
                    height: "hts",
                    heights: "hts",
                    hgts: "hts",
                    highway: "hwy",
                    highwy: "hwy",
                    hill: "hl",
                    hills: "hls",
                    hiway: "hwy",
                    hiwy: "hwy",
                    hllw: "holw",
                    hollow: "holw",
                    hollows: "holw",
                    holws: "holw",
                    hrbor: "hbr",
                    ht: "hts",
                    hway: "hwy",
                    inlet: "inlt",
                    island: "is",
                    islands: "iss",
                    isles: "isle",
                    islnd: "is",
                    islnds: "iss",
                    jction: "jct",
                    jctn: "jct",
                    jctns: "jcts",
                    junction: "jct",
                    junctions: "jcts",
                    junctn: "jct",
                    juncton: "jct",
                    key: "ky",
                    keys: "kys",
                    knol: "knl",
                    knoll: "knl",
                    knolls: "knls",
                    la: "ln",
                    lake: "lk",
                    lakes: "lks",
                    land: "land",
                    landing: "lndg",
                    lane: "ln",
                    lanes: "ln",
                    ldge: "ldg",
                    light: "lgt",
                    lights: "lgts",
                    lndng: "lndg",
                    loaf: "lf",
                    lock: "lck",
                    locks: "lcks",
                    lodg: "ldg",
                    lodge: "ldg",
                    loops: "loop",
                    mall: "mall",
                    manor: "mnr",
                    manors: "mnrs",
                    meadow: "mdw",
                    meadows: "mdws",
                    medows: "mdws",
                    mews: "mews",
                    mill: "ml",
                    mills: "mls",
                    mission: "msn",
                    missn: "msn",
                    mnt: "mt",
                    mntain: "mtn",
                    mntn: "mtn",
                    mntns: "mtns",
                    motorway: "mtwy",
                    mount: "mt",
                    mountain: "mtn",
                    mountains: "mtns",
                    mountin: "mtn",
                    mssn: "msn",
                    mtin: "mtn",
                    neck: "nck",
                    orchard: "orch",
                    orchrd: "orch",
                    overpass: "opas",
                    ovl: "oval",
                    parks: "park",
                    parkway: "pkwy",
                    parkways: "pkwy",
                    parkwy: "pkwy",
                    pass: "pass",
                    passage: "psge",
                    paths: "path",
                    pikes: "pike",
                    pine: "pne",
                    pines: "pnes",
                    pk: "park",
                    pkway: "pkwy",
                    pkwys: "pkwy",
                    pky: "pkwy",
                    place: "pl",
                    plain: "pln",
                    plaines: "plns",
                    plains: "plns",
                    plaza: "plz",
                    plza: "plz",
                    point: "pt",
                    points: "pts",
                    port: "prt",
                    ports: "prts",
                    prairie: "pr",
                    prarie: "pr",
                    prk: "park",
                    prr: "pr",
                    rad: "radl",
                    radial: "radl",
                    radiel: "radl",
                    ranch: "rnch",
                    ranches: "rnch",
                    rapid: "rpd",
                    rapids: "rpds",
                    rdge: "rdg",
                    rest: "rst",
                    ridge: "rdg",
                    ridges: "rdgs",
                    river: "riv",
                    rivr: "riv",
                    rnchs: "rnch",
                    road: "rd",
                    roads: "rds",
                    route: "rte",
                    rvr: "riv",
                    row: "row",
                    rue: "rue",
                    run: "run",
                    shoal: "shl",
                    shoals: "shls",
                    shoar: "shr",
                    shoars: "shrs",
                    shore: "shr",
                    shores: "shrs",
                    skyway: "skwy",
                    spng: "spg",
                    spngs: "spgs",
                    spring: "spg",
                    springs: "spgs",
                    sprng: "spg",
                    sprngs: "spgs",
                    spurs: "spur",
                    sqr: "sq",
                    sqre: "sq",
                    sqrs: "sqs",
                    squ: "sq",
                    square: "sq",
                    squares: "sqs",
                    station: "sta",
                    statn: "sta",
                    stn: "sta",
                    str: "st",
                    strav: "stra",
                    strave: "stra",
                    straven: "stra",
                    stravenue: "stra",
                    stravn: "stra",
                    stream: "strm",
                    street: "st",
                    streets: "sts",
                    streme: "strm",
                    strt: "st",
                    strvn: "stra",
                    strvnue: "stra",
                    sumit: "smt",
                    sumitt: "smt",
                    summit: "smt",
                    terr: "ter",
                    terrace: "ter",
                    throughway: "trwy",
                    tpk: "tpke",
                    tr: "trl",
                    trace: "trce",
                    traces: "trce",
                    track: "trak",
                    tracks: "trak",
                    trafficway: "trfy",
                    trail: "trl",
                    trails: "trl",
                    trk: "trak",
                    trks: "trak",
                    trls: "trl",
                    trnpk: "tpke",
                    trpk: "tpke",
                    tunel: "tunl",
                    tunls: "tunl",
                    tunnel: "tunl",
                    tunnels: "tunl",
                    tunnl: "tunl",
                    turnpike: "tpke",
                    turnpk: "tpke",
                    underpass: "upas",
                    union: "un",
                    unions: "uns",
                    valley: "vly",
                    valleys: "vlys",
                    vally: "vly",
                    vdct: "via",
                    viadct: "via",
                    viaduct: "via",
                    view: "vw",
                    views: "vws",
                    vill: "vlg",
                    villag: "vlg",
                    village: "vlg",
                    villages: "vlgs",
                    ville: "vl",
                    villg: "vlg",
                    villiage: "vlg",
                    vist: "vis",
                    vista: "vis",
                    vlly: "vly",
                    vst: "vis",
                    vsta: "vis",
                    wall: "wall",
                    walks: "walk",
                    well: "wl",
                    wells: "wls",
                    wy: "way"
                };
                var State_Code = {
                    alabama: "AL",
                    alaska: "AK",
                    "american samoa": "AS",
                    arizona: "AZ",
                    arkansas: "AR",
                    california: "CA",
                    colorado: "CO",
                    connecticut: "CT",
                    delaware: "DE",
                    "district of columbia": "DC",
                    "federated states of micronesia": "FM",
                    florida: "FL",
                    georgia: "GA",
                    guam: "GU",
                    hawaii: "HI",
                    idaho: "ID",
                    illinois: "IL",
                    indiana: "IN",
                    iowa: "IA",
                    kansas: "KS",
                    kentucky: "KY",
                    louisiana: "LA",
                    maine: "ME",
                    "marshall islands": "MH",
                    maryland: "MD",
                    massachusetts: "MA",
                    michigan: "MI",
                    minnesota: "MN",
                    mississippi: "MS",
                    missouri: "MO",
                    montana: "MT",
                    nebraska: "NE",
                    nevada: "NV",
                    "new hampshire": "NH",
                    "new jersey": "NJ",
                    "new mexico": "NM",
                    "new york": "NY",
                    "north carolina": "NC",
                    "north dakota": "ND",
                    "northern mariana islands": "MP",
                    ohio: "OH",
                    oklahoma: "OK",
                    oregon: "OR",
                    palau: "PW",
                    pennsylvania: "PA",
                    "puerto rico": "PR",
                    "rhode island": "RI",
                    "south carolina": "SC",
                    "south dakota": "SD",
                    tennessee: "TN",
                    texas: "TX",
                    utah: "UT",
                    vermont: "VT",
                    "virgin islands": "VI",
                    virginia: "VA",
                    washington: "WA",
                    "west virginia": "WV",
                    wisconsin: "WI",
                    wyoming: "WY"
                };
                var Direction_Code;
                var initialized = false;
                var Normalize_Map = {
                    prefix: Directional,
                    prefix1: Directional,
                    prefix2: Directional,
                    suffix: Directional,
                    suffix1: Directional,
                    suffix2: Directional,
                    type: Street_Type,
                    type1: Street_Type,
                    type2: Street_Type,
                    state: State_Code
                };
				// Format address fields, without changing the complete pasted address.
				// Use field-specific casing so compass directions remain uppercase but street
				// types like St, Rd, Ave, Apt and Ste use their normal title-case form.
				const STREET_INITIALISMS = new Set([
				  'N', 'S', 'E', 'W', 'NE', 'NW', 'SE', 'SW',
				  'NNE', 'NNW', 'ENE', 'ESE', 'SSE', 'SSW', 'WNW', 'WSW',
				  'US', 'USA', 'SR', 'CR', 'FM', 'RR', 'PO'
				]);
				const UNIT_INITIALISMS = new Set(['PH', 'PO', 'VIP']);
				const LOWERCASE_CONNECTORS = new Set(['and', 'at', 'by', 'for', 'in', 'of', 'on', 'the', 'to']);
                function capitalize(s) {
                    return s && s[0].toUpperCase() + s.slice(1)
                }
                function keys(o) {
                    return Object.keys(o)
                }
                function values(o) {
                    var v = [];
                    keys(o).forEach(function(k) {
                        v.push(o[k])
                    });
                    return v
                }
                function each(o, fn) {
                    keys(o).forEach(function(k) {
                        fn(o[k], k)
                    })
                }
                function invert(o) {
                    var o1 = {};
                    keys(o).forEach(function(k) {
                        o1[o[k]] = k
                    });
                    return o1
                }
                function flatten(o) {
                    return keys(o).concat(values(o))
                }
                function lazyInit() {
                    if (initialized) {
                        return
                    }
                    initialized = true;
                    Direction_Code = invert(Directional);
                    Addr_Match = {
                        type: Array.from(new Set(flatten(Street_Type))).sort().join("|"),
                        fraction: "(?<fraction>\\d+\\/\\d+)",
                        state: "\\b(?:" + keys(State_Code).concat(values(State_Code)).sort(function(a, b) { return b.length - a.length; }).map(XRegExp.escape).join("|") + ")\\b",
                        direct: values(Directional).sort(function(a, b) {
                            return b.length - a.length
                        }).reduce(function(prev, curr) {
                            return prev.concat([XRegExp.escape(curr.replace(/\w/g, "$&.")), curr])
                        }, keys(Directional)).join("|"),
                        dircode: keys(Direction_Code).join("|"),
                        zip: "(?<zip>\\d{5})(?:[- ]?(?<plus4>\\d{4}))?(?![\\w-]|\\s+\\d)",
                        corner: "(?:\\band\\b|\\bat\\b|&|\\@)"
                    };
                    Addr_Match.number = "(?<number>(?:\\d+(?:[-–—]\\d+)?|[NSEW]\\d{1,3}[NSEW]\\d{1,6}))(?=\\D)(?![A-Za-z])";
                    Addr_Match.street = "                                       \n      (?:                                                       \n        (?:(?<street_0>" + Addr_Match.direct + ")\\W+               \n           (?<type_0>" + Addr_Match.type + ")\\b                    \n        )                                                       \n        |                                                       \n        (?:(?<prefix_0>" + Addr_Match.direct + ")\\W+)?             \n        (?:                                                     \n          (?<street_1>[^,]*\\d)                                 \n          (?:[^\\w,]*(?<suffix_1>" + Addr_Match.direct + ")\\b)     \n          |                                                     \n          (?<street_2>[^,]+)                                    \n          (?:[^\\w,]+(?<type_2>" + Addr_Match.type + ")\\b)         \n          (?:[^\\w,]+(?<suffix_2>" + Addr_Match.direct + ")\\b)?    \n          |                                                     \n          (?<street_3>[^,]+?)                                   \n          (?:[^\\w,]+(?<type_3>" + Addr_Match.type + ")\\b)?        \n          (?:[^\\w,]+(?<suffix_3>" + Addr_Match.direct + ")\\b)?    \n        )                                                       \n      )";
                    Addr_Match.po_box = "p\\W*(?:[om]|ost\\ ?office)\\W*b(?:ox)?";
                    Addr_Match.sec_unit_type_numbered = "             \n      (?<sec_unit_type_1>su?i?te                      \n        |" + Addr_Match.po_box + "                        \n        |(?:ap|dep)(?:ar)?t(?:me?nt)?                 \n        |ro*m                                         \n        |flo*r?                                       \n        |uni?t                                        \n        |bu?i?ldi?n?g                                 \n        |ha?nga?r                                     \n        |lo?t                                         \n        |pier                                         \n        |slip                                         \n        |spa?ce?                                      \n        |stop                                         \n        |tra?i?le?r                                   \n        |box)(?![a-z]                                 \n      )                                               \n      ";
                    Addr_Match.sec_unit_type_unnumbered = "           \n      (?<sec_unit_type_2>ba?se?me?n?t                 \n        |fro?nt                                       \n        |lo?bby                                       \n        |lowe?r                                       \n        |off?i?ce?                                    \n        |pe?n?t?ho?u?s?e?                             \n        |rear                                         \n        |side                                         \n        |uppe?r                                       \n      )\\b";
                    Addr_Match.sec_unit = "                               \n      (?:                               #fix3             \n        (?:                             #fix1             \n          (?:                                             \n            (?:" + Addr_Match.sec_unit_type_numbered + "\\W*) \n            |(?<sec_unit_type_3>\\#)\\W*                  \n          )                                               \n          (?<sec_unit_num_1>[\\w-]+)                      \n        )                                                 \n        |                                                 \n        " + Addr_Match.sec_unit_type_unnumbered + "           \n      )";
                    Addr_Match.city_and_state = "                       \n      (?:                                               \n        (?<city>[^\\d,]+?)\\W+                          \n        (?<state>" + Addr_Match.state + ")                  \n      )                                                 \n      ";
                    Addr_Match.place = "                                \n      (?:" + Addr_Match.city_and_state + "\\W*)?            \n      (?:" + Addr_Match.zip + ")?                           \n      ";
                    // Place-only input must be checked before the informal street parser.
                    // Unlike Addr_Match.place, the city and state are mandatory here;
                    // a ZIP or ZIP+4 is optional. Anchors prevent partial matches.
                    Addr_Match.place_only = XRegExp(
                        "^\\s*" + Addr_Match.city_and_state +
                        "(?:\\W*" + Addr_Match.zip + ")?\\W*$", "ix"
                    );
                    Addr_Match.address = XRegExp("                      \n      ^                                                 \n      [^\\w\\#]*                                        \n      (" + Addr_Match.number + ")\\W*                       \n      (?:" + Addr_Match.fraction + "\\W*)?                  \n         " + Addr_Match.street + "\\W+                      \n      (?:" + Addr_Match.sec_unit + ")?\\W*          #fix2   \n         " + Addr_Match.place + "                           \n      \\W*$", "ix");
                    Addr_Match.po_start = XRegExp("^" + Addr_Match.po_box, "xi");
                    Addr_Match.corner_test = XRegExp(Addr_Match.corner, "xi");
                    Addr_Match.city_direction = XRegExp("^(?<dircode>" + Addr_Match.dircode + ")\\s+(?=\\S)", "ix");
                    var sep = "(?:\\W+|$)";
                    Addr_Match.informal_address = XRegExp("                   \n      ^                                                       \n      \\s*                                                    \n      (?:" + Addr_Match.sec_unit + sep + ")?                        \n      (?:" + Addr_Match.number + ")?\\W*                          \n      (?:" + Addr_Match.fraction + "\\W*)?                        \n         " + Addr_Match.street + sep + "                            \n      (?:" + Addr_Match.sec_unit.replace(/_\d/g, "$&1") + sep + ")?  \n      (?:" + Addr_Match.place + ")?                               \n      ", "ix");
                    Addr_Match.po_address = XRegExp("                         \n      ^                                                       \n      \\s*                                                    \n      (?:" + Addr_Match.sec_unit.replace(/_\d/g, "$&1") + sep + ")?  \n      (?:" + Addr_Match.place + ")?                               \n      ", "ix");
                    Addr_Match.intersection = XRegExp("                     \n      ^\\W*                                                 \n      " + Addr_Match.street.replace(/_\d/g, "1$&") + "\\W*?      \n      \\s+" + Addr_Match.corner + "\\s+                         \n      " + Addr_Match.street.replace(/_\d/g, "2$&") + "($|\\W+) \n      " + Addr_Match.place + "\\W*$", "ix")
                }
				function addressPart(value) {
				  return value == null ? '' : String(value).trim();
				}
				function joinAddressParts(parsed, keys) {
				  return keys.map(key => addressPart(parsed[key])).filter(Boolean).join(' ');
				}
				function mapParsedAddress(parsed) {
				  const zip = addressPart(parsed.zip);
				  const plus4 = addressPart(parsed.plus4);
				  let addr1 = parser.formatAddressLine(joinAddressParts(parsed, ['number', 'fraction', 'prefix', 'street', 'type', 'suffix']), 'addr1');
				  let addr2 = parser.formatAddressLine(joinAddressParts(parsed, ['sec_unit_type', 'sec_unit_num']), 'addr2');
				  const isPoBox = /^(?:P[.\s]*O\.?\s*Box|Post\s+Office\s+Box)(?=$|[\s#\d.-])/i.test(addr2);
				  if (!addr1 && isPoBox) {
					addr1 = parser.formatAddressLine(addr2, 'addr1');
					addr2 = '';
				  }
				  return {
					addr1,
					addr2,
					city: parser.formatAddressLine(parsed.city, 'city'),
					state: addressPart(parsed.state).toUpperCase(),
					// A ZIP+4 suffix without the five-digit ZIP cannot stand on its own.
					zip: zip && plus4 ? `${zip}-${plus4}` : zip
				  };
				}
                parser.normalize_address = function(parts) {
                    lazyInit();
                    if (!parts)
                        return null;
                    var parsed = {};
                    Object.keys(parts).forEach(function(k) {
                        if (["input", "index"].indexOf(k) !== -1 || isFinite(k))
                            return;
                        var key = isFinite(k.split("_").pop()) ? k.split("_").slice(0, -1).join("_") : k;
                        if (parts[k]) {
                            var value = parts[k].trim();
                            if (key === 'number') {
                                parsed[key] = value.replace(/^\s+|\s+$|[^\w\s\-–—#&]/g, '');
                            } else if (key === 'fraction') {
                                parsed[key] = value;
                            } else if (key === 'city' || /^street\d*$/.test(key)) {
                                // Apostrophes and punctuation can be part of actual street names.
                                parsed[key] = value;
                            } else {
                                parsed[key] = value.replace(/^\s+|\s+$|[^\w\s\-#&]/g, '');
                            }
                        }
                    });
                    each(Normalize_Map, function(map, key) {
                        if (parsed[key] && map[parsed[key].toLowerCase()]) {
                            parsed[key] = map[parsed[key].toLowerCase()]
                        }
                    });
                    ["type", "type1", "type2"].forEach(function(key) {
                        if (key in parsed)
                            parsed[key] = parsed[key].charAt(0).toUpperCase() + parsed[key].slice(1).toLowerCase()
                    });
                    if (parsed.city) {
                        parsed.city = XRegExp.replace(parsed.city, Addr_Match.city_direction, function(match) {
                            return capitalize(Direction_Code[match.dircode.toUpperCase()]) + " "
                        })
                    }
                    return parsed
                }
                ;
                parser.parseAddress = function(address) {
                    lazyInit();
                    var parts = XRegExp.exec(address, Addr_Match.address);
                    return parser.normalize_address(parts)
                }
                ;
                parser.parseInformalAddress = function(address) {
                    lazyInit();
                    var parts = XRegExp.exec(address, Addr_Match.informal_address);
                    return parser.normalize_address(parts)
                }
                ;
                parser.parsePoAddress = function(address) {
                    lazyInit();
                    var parts = XRegExp.exec(address, Addr_Match.po_address);
                    return parser.normalize_address(parts)
                }
                ;
                parser.parseLocation = function(address) {
                    lazyInit();
                    address = addressPart(address);
                    if (!address) return null;
                    // PO Box detection must work with leading whitespace in pasted input.
                    if (Addr_Match.po_start.test(address)) {
                        return parser.parsePoAddress(address)
                    }
                    // A numbered street (e.g. "123 Bake and Brew Rd") takes priority
                    // over any internal "and", "at", "&" or "@" separator.
                    var street_address = parser.parseAddress(address);
                    if (street_address) {
                        return street_address
                    }
                    if (Addr_Match.corner_test.test(address)) {
                        var intersection = parser.parseIntersection(address);
                        if (intersection) return intersection;
                    }
                    var informal_address = parser.parseInformalAddress(address);
                    // The informal parser assumes even a city/state/ZIP has a street.
                    // A strict, whole-input place match corrects that assumption.
                    var place_only_parts = XRegExp.exec(address, Addr_Match.place_only);
                    if (place_only_parts) {
                        // Preserve unnumbered street addresses such as
                        // "Main St Chicago IL 60601" (which have a street suffix).
                        if (informal_address && informal_address.street &&
                            informal_address.type && informal_address.city && informal_address.state) {
                            return informal_address
                        }
                        return parser.normalize_address(place_only_parts)
                    }
                    return informal_address
                }
                ;
                parser.parseIntersection = function(address) {
                    lazyInit();
                    var parts = XRegExp.exec(address, Addr_Match.intersection);
                    parts = parser.normalize_address(parts);
                    if (parts) {
                        parts.type2 = parts.type2 || "";
                        parts.type1 = parts.type1 || "";
                        if (parts.type2 && !parts.type1 || parts.type1 === parts.type2) {
                            var type = parts.type2;
                            type = XRegExp.replace(type, /s\W*$/, "");
                            if (XRegExp("^" + Addr_Match.type + "$", "ix").test(type)) {
                                parts.type1 = parts.type2 = type
                            }
                        }
                    }
                    return parts
                }
                ;
				parser.formatAddressLine = function (value, field) {
				  const text = addressPart(value).replace(/\s+/g, ' ');
				  if (!text) return '';
				  let formatted = text.toLowerCase().replace(/\p{L}+/gu, word => word.charAt(0).toUpperCase() + word.slice(1));
				  formatted = formatted.replace(/(\p{L}['’])S\b/gu, '$1s');
                  // Uppercase the letter after O', D' or L' (O'Brien, O’Fallon).
                  formatted = formatted.replace(/\b([ODL]['’])(\p{L})/gu, (_match, start, letter) => start + letter.toUpperCase());
				  formatted = formatted.replace(/\bMc(\p{L})/gu, (_match, letter) => 'Mc' + letter.toUpperCase());
				  formatted = formatted.replace(/\b(\d+)(St|Nd|Rd|Th)\b/g, (_match, digits, ending) => digits + ending.toLowerCase());
				  const words = formatted.split(' ');
				  for (let i = 1; i < words.length - 1; i++) {
					const match = /^([('“]*)([\p{L}]+)([),.'’”]*)$/u.exec(words[i]);
					if (match && LOWERCASE_CONNECTORS.has(match[2].toLowerCase())) {
					  words[i] = match[1] + match[2].toLowerCase() + match[3];
					}
				  }
				  formatted = words.join(' ');
                  if (field === 'addr2') formatted = formatted.replace(/^#\s+(?=[\p{L}\p{N}])/u, '#');
				  const initialisms = field === 'addr1' ? STREET_INITIALISMS : field === 'addr2' ? UNIT_INITIALISMS : null;
				  if (initialisms) {
					formatted = formatted.replace(/\b[\p{L}]+\b/gu, word => initialisms.has(word.toUpperCase()) ? word.toUpperCase() : word);
				  }
				  return formatted;
				};

                // Completeness validation used by Canva before requesting paid geocoding.
                // Required: Address 1 plus (city AND state) OR Address 1 plus ZIP.
                // This does not claim that an address exists or is deliverable.
                // Build immutable lookup tables once, rather than sorting and
                // compiling state names for every blur and form submission.
                const STATE_ABBREVIATIONS = new Set(Object.values(State_Code));
                const STATE_END = new RegExp('(?:^|[\\s,])(' +
                    Object.keys(State_Code).concat([...STATE_ABBREVIATIONS])
                        .sort((a, b) => b.length - a.length)
                        .map(name => name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
                        .join('|') + ')\\s*$', 'i');
                const ZIP_END = /(?:^|[\s,])(\d{5})(?:[-\s]?(\d{4}))?\s*$/;
                const COUNTRY_END = /(?:,\s*|\s+)(?:USA?|United States(?: of America)?)\s*$/i;
                const UNIT_START = /^(?:#\s*\S|(?:apt|apartment|dept|department|suite|ste|unit|floor|fl|room|rm|building|bldg|bld|hangar|hngr|lot|pier|slip|space|spc|stop|trailer|trlr|box|ph|P[.\s]*O[.\s]*Box|Post\s+Office\s+Box)(?:\b|\.)|(?:basement|bsmt|front|lobby|lower|office|penthouse|rear|side|upper)\.?\s*$)/i;
                const STREET_SUFFIX = /\b(?:St|Street|Rd|Road|Ave|Avenue|Dr|Drive|Ct|Court|Ln|Lane|Blvd|Boulevard|Pl|Place|Pkwy|Parkway|Way|Ter|Terrace|Trl|Trail|Cir|Circle|Hwy|Highway)\.?$/i;
                const STREET_SUFFIX_ONLY = /^(?:st|street|rd|road|dr|drive|ave|avenue|ct|court|ln|lane|blvd|boulevard|pl|place|pkwy|parkway|way|ter|terrace|trl|trail|cir|circle|hwy|highway)\.?$/i;
                const PO_START = /^(?:P[.\s]*O[.\s]*Box|Post\s+Office\s+Box)\s*#?\s*[A-Za-z0-9]/i;
                const NUMBERED_STREET = /^(?:\d+[A-Za-z]?(?:[-–—]\d+[A-Za-z]?)?(?:\s+\d+\/\d+)?|[NSEW]\d{1,3}[NSEW]\d{1,6})\s+.*\p{L}/iu;

                function normalizeStateToken(token) {
                    const key = addressPart(token).toLowerCase().replace(/\s+/g, ' ');
                    if (Object.prototype.hasOwnProperty.call(State_Code, key)) return State_Code[key];
                    return STATE_ABBREVIATIONS.has(key.toUpperCase()) ? key.toUpperCase() : '';
                }

                function isCityCandidate(value) {
                    // Units and numeric fragments must not satisfy the city rule.
                    return /\p{L}/u.test(value) && !UNIT_START.test(value) &&
                        !STATE_ABBREVIATIONS.has(value.toUpperCase()) && !/^\d/.test(value);
                }

                function analyzeFullAddress(value) {
                    lazyInit();
                    const input = addressPart(value).replace(/\s+/g, ' ');
                    const empty = { addr1: '', addr2: '', city: '', state: '', zip: '' };
                    if (!input) return empty;
                    let remainder = input.replace(COUNTRY_END, '').replace(/[\s,]+$/, '');
                    let zip = '';
                    const zipMatch = ZIP_END.exec(remainder);
                    if (zipMatch) {
                        zip = zipMatch[1] + (zipMatch[2] ? '-' + zipMatch[2] : '');
                        remainder = remainder.slice(0, zipMatch.index).replace(/[\s,]+$/, '');
                    }
                    let state = '';
                    const stateMatch = STATE_END.exec(remainder);
                    if (stateMatch) {
                        state = normalizeStateToken(stateMatch[1]);
                        remainder = remainder.slice(0, stateMatch.index).replace(/[\s,]+$/, '');
                    }
                    // Normalize the tail before invoking the legacy parser. In
                    // particular, "West Virginia" must stay one state token.
                    const canonical = [remainder, state, zip].filter(Boolean).join(', ');
                    const parts = parseMappedAddress(canonical);
                    const segments = remainder.split(/\s*,\s*/).filter(Boolean);
                    const first = segments[0] || '';
                    const isPoBox = PO_START.test(first);
                    const hasNumberedStreet = NUMBERED_STREET.test(first);
                    const clearStreetSuffix = STREET_SUFFIX.test(first);
                    const unnumberedStreetAndCity = segments.length === 1 &&
                        Boolean(parts.addr1) && Boolean(parts.city) && Boolean(state) &&
                        STREET_SUFFIX.test(parts.addr1);
                    const hasStreet = isPoBox || hasNumberedStreet ||
                        (!UNIT_START.test(first) && (clearStreetSuffix || unnumberedStreetAndCity));

                    let addr1 = hasStreet ? parts.addr1 : '';
                    let addr2 = hasStreet ? parts.addr2 : '';
                    let city = '';
                    if (hasStreet && segments.length > 1) {
                        // A comma explicitly separates the street line. Parsing
                        // it alone prevents its final "St" becoming a city and
                        // keeps inline apartment data out of Address 1.
                        const streetParts = parseMappedAddress(first);
                        addr1 = streetParts.addr1 || parser.formatAddressLine(first, 'addr1');
                        addr2 = streetParts.addr2 || addr2;
                        const rest = segments.slice(1);
                        const unit = rest.find(segment => UNIT_START.test(segment));
                        if (unit && !addr2) addr2 = parser.formatAddressLine(unit, 'addr2');
                        city = rest.filter(isCityCandidate).pop() || '';
                    } else if (hasStreet) {
                        const suffixMisreadAsCity = STREET_SUFFIX_ONLY.test(parts.city || '') &&
                            STREET_SUFFIX.test(remainder);
                        if (suffixMisreadAsCity || clearStreetSuffix) {
                            // With only one street line left, a suffix is not a
                            // city. This also covers "Main St, OH".
                            const streetParts = parseMappedAddress(remainder);
                            addr1 = streetParts.addr1 || parser.formatAddressLine(remainder, 'addr1');
                            addr2 = streetParts.addr2 || addr2;
                        } else {
                            city = parts.city || '';
                            if (!city && !state && !zip) {
                                const suffix = /\b(?:St|Street|Rd|Road|Ave|Avenue|Blvd|Boulevard|Dr|Drive|Ct|Court|Ln|Lane|Way|Pkwy|Parkway|Pl|Place)\s+([\p{L}][\p{L} .’'-]*)$/iu.exec(remainder);
                                if (suffix) city = suffix[1].trim();
                            }
                            // Recover an inline unit when the informal parser
                            // stopped at '#', before the final state token.
                            if (!city && !addr2) {
                                const streetParts = parseMappedAddress(remainder);
                                if (streetParts.addr2) {
                                    addr1 = streetParts.addr1;
                                    addr2 = streetParts.addr2;
                                }
                            }
                        }
                        if (!addr1 && clearStreetSuffix) addr1 = parser.formatAddressLine(first, 'addr1');
                    } else {
                        city = segments.filter(isCityCandidate).pop() || '';
                    }
                    if (!isCityCandidate(city)) city = '';
                    return {
                        addr1: addr1 || '',
                        addr2: addr2 || '',
                        city: parser.formatAddressLine(city, 'city'),
                        state,
                        // Only a whole, explicitly matched ZIP is authoritative;
                        // never reuse a prefix consumed by the informal parser.
                        zip
                    };
                }

                parser.validateFullAddress = function(fullAddress) {
                    const parts = analyzeFullAddress(fullAddress);
                    const found = {
                        address1: Boolean(parts.addr1),
                        city: Boolean(parts.city),
                        state: Boolean(parts.state),
                        zip: /^\d{5}(?:-\d{4})?$/.test(parts.zip)
                    };
                    const valid = found.address1 && ((found.city && found.state) || found.zip);
                    let message = '';

                    if (!valid) {
                        if (!addressPart(fullAddress)) {
                            message = 'Enter a street address (Address 1) and either a city and state or a 5-digit ZIP code.';
                        } else if (!found.address1) {
                            message = 'Add the street address (Address 1) or PO Box. A city, state, or ZIP code alone is not enough.';
                        } else if (found.city && !found.state && !found.zip) {
                            message = 'Add a valid state or 5-digit ZIP code to complete this address.';
                        } else if (!found.city && found.state && !found.zip) {
                            message = 'Add a city or valid 5-digit ZIP code to complete this address.';
                        } else {
                            message = 'Add the city and state, or a valid 5-digit ZIP code, to complete this address.';
                        }
                    }

                    return { valid, message, parts, detected: found };
                };

                // Convenience API for callers that need a literal true/false.
                parser.hasEnoughAddressParts = function(fullAddress) {
                    return parser.validateFullAddress(fullAddress).valid;
                };

                function parseMappedAddress(address) {
                    const parsed = parser.parseLocation(address);
                    return mapParsedAddress(parsed && typeof parsed === 'object' ? parsed : {});
                }
                // Public parsing and validation share the same corrected parts.
                // Low-level parseLocation remains available for raw parser data.
                parser.parseFullAddress = analyzeFullAddress;
                // Combined administrative-area aliases from the supplied workbook.
                const INTERNATIONAL_AREAS = {
    "MX": [
        [
            "AGU",
            "Aguascalientes",
            [
                "Ags",
                "AG",
                "AGU"
            ]
        ],
        [
            "BCN",
            "Baja California",
            [
                "BC",
                "BJ",
                "BN",
                "BCN"
            ]
        ],
        [
            "BCS",
            "Baja California Sur",
            [
                "BS",
                "BCS"
            ]
        ],
        [
            "CAM",
            "Campeche",
            [
                "Camp",
                "CM",
                "CP",
                "CAM"
            ]
        ],
        [
            "CHP",
            "Chiapas",
            [
                "Chis",
                "CH",
                "CS",
                "CHP"
            ]
        ],
        [
            "CHH",
            "Chihuahua",
            [
                "Chih",
                "CH",
                "CI",
                "CHH"
            ]
        ],
        [
            "COA",
            "Coahuila",
            [
                "Coah",
                "CH",
                "CO",
                "CU",
                "COA"
            ]
        ],
        [
            "COL",
            "Colima",
            [
                "CL",
                "COL"
            ]
        ],
        [
            "CMX",
            "Mexico City",
            [
                "CDMX",
                "DF",
                "CMX"
            ]
        ],
        [
            "DUR",
            "Durango",
            [
                "Dgo",
                "DG",
                "DUR"
            ]
        ],
        [
            "GUA",
            "Guanajuato",
            [
                "Gto",
                "GJ",
                "GT",
                "GUA"
            ]
        ],
        [
            "GRO",
            "Guerrero",
            [
                "Gro",
                "GE",
                "GR",
                "GRO"
            ]
        ],
        [
            "HID",
            "Hidalgo",
            [
                "Hgo",
                "HD",
                "HG",
                "HID"
            ]
        ],
        [
            "JAL",
            "Jalisco",
            [
                "JA",
                "JAL"
            ]
        ],
        [
            "MEX",
            "México",
            [
                "Edomex",
                "Méx",
                "EM",
                "MX",
                "MEX"
            ]
        ],
        [
            "MIC",
            "Michoacán",
            [
                "Mich",
                "MH",
                "MI",
                "MIC"
            ]
        ],
        [
            "MOR",
            "Morelos",
            [
                "MO",
                "MR",
                "MOR"
            ]
        ],
        [
            "NAY",
            "Nayarit",
            [
                "NA",
                "NAY"
            ]
        ],
        [
            "NLE",
            "Nuevo León",
            [
                "NL",
                "NLE"
            ]
        ],
        [
            "OAX",
            "Oaxaca",
            [
                "OA",
                "OAX"
            ]
        ],
        [
            "PUE",
            "Puebla",
            [
                "PU",
                "PUE"
            ]
        ],
        [
            "QUE",
            "Querétaro",
            [
                "Qro",
                "QA",
                "QE",
                "QT",
                "QUE"
            ]
        ],
        [
            "ROO",
            "Quintana Roo",
            [
                "Q Roo",
                "QI",
                "QR",
                "ROO"
            ]
        ],
        [
            "SLP",
            "San Luis Potosí",
            [
                "SL",
                "SLP"
            ]
        ],
        [
            "SIN",
            "Sinaloa",
            [
                "SI",
                "SIN"
            ]
        ],
        [
            "SON",
            "Sonora",
            [
                "SO",
                "SON"
            ]
        ],
        [
            "TAB",
            "Tabasco",
            [
                "TA",
                "TB",
                "TAB"
            ]
        ],
        [
            "TAM",
            "Tamaulipas",
            [
                "Tamps",
                "TA",
                "TM",
                "TAM"
            ]
        ],
        [
            "TLA",
            "Tlaxcala",
            [
                "Tlax",
                "TL",
                "TLA"
            ]
        ],
        [
            "VER",
            "Veracruz",
            [
                "VC",
                "VE",
                "VL",
                "VZ",
                "VER"
            ]
        ],
        [
            "YUC",
            "Yucatán",
            [
                "YC",
                "YU",
                "YUC"
            ]
        ],
        [
            "ZAC",
            "Zacatecas",
            [
                "ZA",
                "ZT",
                "ZAC"
            ]
        ]
    ],
    "CA": [
        [
            "AB",
            "Alberta",
            [
                "AB",
                "Alta",
                "Alb"
            ]
        ],
        [
            "BC",
            "British Columbia",
            [
                "BC",
                "CB"
            ]
        ],
        [
            "MB",
            "Manitoba",
            [
                "MB",
                "Man"
            ]
        ],
        [
            "NB",
            "New Brunswick",
            [
                "NB"
            ]
        ],
        [
            "NL",
            "Newfoundland and Labrador",
            [
                "NL",
                "Nfld",
                "Lab",
                "NL",
                "TNL"
            ]
        ],
        [
            "NT",
            "Northwest Territories",
            [
                "NT",
                "NWT",
                "TNO"
            ]
        ],
        [
            "NS",
            "Nova Scotia",
            [
                "NS",
                "NÉ"
            ]
        ],
        [
            "NU",
            "Nunavut",
            [
                "NU",
                "Nvt",
                "Nt"
            ]
        ],
        [
            "ON",
            "Ontario",
            [
                "ON",
                "Ont"
            ]
        ],
        [
            "PE",
            "Prince Edward Island",
            [
                "PE",
                "PEI",
                "ÎPÉ"
            ]
        ],
        [
            "QC",
            "Quebec",
            [
                "QC",
                "Que"
            ]
        ],
        [
            "SK",
            "Saskatchewan",
            [
                "SK",
                "Sask"
            ]
        ],
        [
            "YT",
            "Yukon",
            [
                "YT",
                "Yuk",
                "Yn"
            ]
        ]
    ]
};
                const AREAS = new Map();
                function foldArea(value) {
                    return addressPart(value).normalize('NFD').replace(/\p{M}/gu, '')
                        .toLowerCase().replace(/\./g, '').replace(/\s+/g, ' ');
                }
                function addArea(code, name, aliases = []) {
                    for (const alias of [name, code, ...aliases]) {
                        const key = foldArea(alias), matches = AREAS.get(key) || [];
                        if (!matches.some(item => item.code === code)) matches.push({code, name});
                        AREAS.set(key, matches);
                    }
                }
                Object.entries(State_Code).forEach(([name, code]) => addArea(code, name));
                Object.values(INTERNATIONAL_AREAS).forEach(rows => rows.forEach(row => addArea(row[0], row[1], row[2])));
                addArea('QC', 'Québec');
                addArea('CMX', 'Ciudad de México', ['Distrito Federal']);
                addArea('MEX', 'Estado de México');
                addArea('COA', 'Coahuila de Zaragoza');
                addArea('MIC', 'Michoacán de Ocampo');
                addArea('VER', 'Veracruz de Ignacio de la Llave');
                function cleanEdge(value) { return value.replace(/^[\s,]+|[\s,]+$/g, ''); }
                function findArea(text) {
                    const tokens = [...text.matchAll(/[\p{L}\p{N}.'’\-]+/gu)];
                    for (let i = Math.max(0, tokens.length - 7); i < tokens.length; i++) {
                        const start = tokens[i].index, token = cleanEdge(text.slice(start));
                        const matches = AREAS.get(foldArea(token));
                        if (matches) return {start, token, matches};
                    }
                    return null;
                }
                const POSTAL_PATTERN = /^(?:\d{5}(?:-\d{4})?|[ABCEGHJKLMNPRSTVXY]\d[ABCEGHJ-NPRSTV-Z] \d[ABCEGHJ-NPRSTV-Z]\d)$/i;
                function takePostal(text) {
                    let match = /(?:^|[\s,])([ABCEGHJKLMNPRSTVXY]\d[ABCEGHJ-NPRSTV-Z] ?\d[ABCEGHJ-NPRSTV-Z]\d)\s*$/i.exec(text);
                    let zip = '';
                    if (match) zip = match[1].toUpperCase().replace(/ /g, '').replace(/^(.{3})/, '$1 ');
                    else {
                        match = /(?:^|[\s,])(?:C\.?\s*P\.?\s*)?(\d{5})(?:[ -]?(\d{4}))?\s*$/i.exec(text);
                        if (!match) {
                            const candidates = [...text.matchAll(/(?:^|[\s,])(?:C\.?\s*P\.?\s*)?(\d{5})(?=$|[\s,])/gi)];
                            match = candidates.reverse().find(item => text.slice(0, item.index).includes(',') || /C\.?\s*P\.?/i.test(item[0]));
                        }
                        if (match) zip = match[1] + (match[2] ? '-' + match[2] : '');
                    }
                    if (!match) return {text, zip:''};
                    return {text:cleanEdge(text.slice(0,match.index)+text.slice(match.index+match[0].length)), zip};
                }
                function neutralContext(value) {
                    let text = addressPart(value).replace(/\r?\n|\r/g, ', ').replace(/\s+/g, ' ');
                    // Ignore an optional trailing label without assigning a country.
                    const label = /(?:^|[\s,])(?:Canada|USA?|United States(?: of America)?|Estados Unidos Mexicanos|M[eé]xico)\s*$/i.exec(text);
                    if (label) {
                        const before = cleanEdge(text.slice(0, label.index));
                        if (takePostal(before).zip || findArea(before) || !/m[eé]xico/i.test(label[0])) text = before;
                    }
                    let postal = takePostal(text), area = findArea(postal.text);
                    if (area && !postal.zip) {
                        const earlier = takePostal(cleanEdge(postal.text.slice(0,area.start)));
                        if (earlier.zip) {
                            postal = {text:cleanEdge(earlier.text+', '+area.token),zip:earlier.zip};
                            area = findArea(postal.text);
                        }
                    }
                    return {view:{postal,area}};
                }
                const INTL_UNIT = /(?:^|\s)((?:apartment|appartement|apt|app|suite|ste|unit|unité|bureau|depto|departamento|dpto|interior|int|piso|local|oficina|of|floor|fl|room|rm)\.?\s*#?\s*[\p{L}\p{N}-]+)\s*$/iu;
                const INTL_PO = /^(?:P[.\s]*O[.\s]*Box|Post\s+Office\s+Box|Postal\s+Box|Case\s+Postale|C\.?\s*P\.?|Apartado\s+Postal)\s*#?\s*[\p{L}\p{N}-]+(?:\s+.*)?$/iu;
                const MX_STREET = /^(?:(?:calle|avenida|av|ave|avda|paseo|calzada|calz|boulevard|blvd|bulevar|carretera|carr|camino|cerrada|cda|privada|priv|andador|prolongaci[oó]n|circuito)\.?\s+.+\s+(?:(?:n[uú]m(?:ero)?|no)\.?\s*|#\s*)?(?:\d+[\p{L}]?(?:[-/]\d+)?|s\/?n)|[\p{L}].*\s+\d+[\p{L}]?)$/iu;
                const INTL_STREET_END = /\b(?:street|st|road|rd|avenue|ave|drive|dr|court|ct|lane|ln|boulevard|blvd|place|pl|parkway|pkwy|way|terrace|ter|trail|trl|circle|cir|highway|hwy|crescent|cres|close|cl|roadway|route|rang)\.?(?:\s+(?:N|S|E|W|NE|NW|SE|SW|O|NO|SO))?(?=\s|$)/gi;
                function intlFormat(value, field) {
                    const formatted = parser.formatAddressLine(value, field);
                    return formatted.replace(/\p{L}+/gu, (word, offset) => offset > 0 &&
                        /^(?:de|del|la|las|los|el|y|du|des|le|les|et|sur)$/i.test(word) ? word.toLowerCase() : word);
                }
                function internationalParts(context) {
                    const { view } = context;
                    const area = view.area;
                    let remainder = area ? cleanEdge(view.postal.text.slice(0, area.start)) : view.postal.text;
                    let state = area ? (area.matches.length === 1 ? area.matches[0].code : area.token.toUpperCase()) : '';
                    const segments = remainder.split(/\s*,\s*/).filter(Boolean);
                    let line = segments[0] || '';
                    let addr2 = '';
                    const unit = INTL_UNIT.exec(line);
                    if (unit) { addr2 = unit[1]; line = cleanEdge(line.slice(0, unit.index)); }
                    const streetPresent = value => INTL_PO.test(value) || NUMBERED_STREET.test(value) ||
                        (MX_STREET.test(value)) ||
                        (/^(?:calle|avenida|av|ave|avda|paseo|calzada|calz|boulevard|blvd|bulevar|carretera|carr|camino|cerrada|cda|privada|priv|andador|prolongaci[oó]n|circuito)\.?\s+.*\d/iu.test(value)) ||
                        (!UNIT_START.test(value) && STREET_SUFFIX.test(value));
                    let hasStreet = streetPresent(line);
                    let city = '';
                    if (hasStreet && segments.length > 1) {
                        const rest = segments.slice(1);
                        const cityIndex = rest.map(value => !UNIT_START.test(value) && !INTL_UNIT.test(value) &&
                            !/^(?:col(?:onia)?|fracc(?:ionamiento)?|barrio|municipio|alcald[ií]a)\.?\s/iu.test(value) &&
                            /\p{L}/u.test(value) && !/^\d/.test(value)).lastIndexOf(true);
                        if (cityIndex >= 0) city = rest[cityIndex];
                        addr2 = [addr2].concat(rest.filter((_, index) => index !== cityIndex)).filter(Boolean).join(', ');
                    } else if (hasStreet) {
                        // Split only at a recognizable street boundary. A missing
                        // comma in a free-form French street cannot always be resolved.
                        const ends = [...line.matchAll(INTL_STREET_END)];
                        const split = ends.reverse().find(match => {
                            const tail = line.slice(match.index + match[0].length).trim();
                            return /\p{L}/u.test(tail) && !/^\d/.test(tail) && !INTL_UNIT.test(tail);
                        });
                        const poLine = /^(.*?\b(?:box|postale|postal|C\.?\s*P\.?)\s*#?\s*[\p{L}\p{N}-]+)\s+([\p{L}][\p{L} .'’\-]*)$/iu.exec(line);
                        if (INTL_PO.test(line) && poLine) {
                            line = poLine[1]; city = poLine[2];
                        } else if (split) {
                            city = line.slice(split.index + split[0].length).trim();
                            line = line.slice(0, split.index + split[0].length).trim();
                            const cityUnit = /^((?:apt|apartment|appartement|app|suite|ste|unit|bureau|depto|departamento|dpto|interior|int|piso|local)\.?\s*#?\s*[\p{L}\p{N}-]+)\s+(.+)$/iu.exec(city);
                            if (cityUnit) { addr2 = [addr2, cityUnit[1]].filter(Boolean).join(', '); city = cityUnit[2]; }
                        } else {
                            const numbered = /^(.*\s(?:\d+[A-Za-z]?|s\/?n))\s+([\p{L}][\p{L} .'’\-]*)$/iu.exec(line);
                            if (numbered && MX_STREET.test(numbered[1])) { line = numbered[1]; city = numbered[2]; }
                        }
                        const inlineUnit = INTL_UNIT.exec(line);
                        if (inlineUnit) { addr2 = [inlineUnit[1], addr2].filter(Boolean).join(', '); line = line.slice(0, inlineUnit.index).trim(); }
                    } else {
                        city = segments.filter(value => /\p{L}/u.test(value) && !UNIT_START.test(value) && !/^\d/.test(value)).pop() || '';
                    }
                    if (!city && state === 'CMX' && area && /^(?:ciudad de m[eé]xico|mexico city)$/i.test(area.token)) city = area.token;
                    const parts = { addr1: hasStreet ? intlFormat(line, 'addr1') : '',
                        addr2: hasStreet ? intlFormat(addr2, 'addr2') : '', city: intlFormat(city, 'city'),
                        state, zip: view.postal.zip };
                    if (area && area.matches.length > 1) parts.stateCandidates = area.matches.map(item => item.code);
                    return parts;
                }
                function parseWithoutCountry(value) {
                    return internationalParts(neutralContext(value));
                }
                parser.parseFullAddress = parseWithoutCountry;
                parser.validateFullAddress = function(value) {
                    const parts = parseWithoutCountry(value);
                    const detected = {address1:Boolean(parts.addr1), city:Boolean(parts.city),
                        state:Boolean(parts.state), zip:POSTAL_PATTERN.test(parts.zip)};
                    const valid = detected.address1 && (detected.state || detected.zip);
                    const message = valid ? '' : !addressPart(value)
                        ? 'Enter a street address and a state/province/territory or postal code.'
                        : !detected.address1
                        ? 'Add the street address (Address 1) or PO Box.'
                        : 'Add a recognized state/province/territory or a valid postal code.';
                    return {valid,message,parts,detected};
                };
                parser.hasEnoughAddressParts = function(value) {
                    return parser.validateFullAddress(value).valid;
                };
                ['parseLocation','parseAddress','parseInformalAddress','parsePoAddress'].forEach(name => {
                    parser[name] = function(value) {
                        if (!addressPart(value)) return null;
                        const parts = parseWithoutCountry(value);
                        if (name === 'parseAddress' && !parts.addr1) return null;
                        if (name === 'parsePoAddress' && !INTL_PO.test(parts.addr1)) return null;
                        const raw = {...parts};
                        const number = /^(\d+[A-Za-z]?(?:[-–—]\d+[A-Za-z]?)?)(?:\s+(\d+\/\d+))?\s+(.*)$/u.exec(parts.addr1);
                        const trailing = /^(.*?)\s+(?:(?:n[uú]m(?:ero)?|no)\.?\s*|#\s*)?(\d+[A-Za-z]?(?:[-/]\d+)?|s\/?n)$/iu.exec(parts.addr1);
                        const box = /^(.*?(?:box|postale|postal|C\.?\s*P\.?))\s*#?\s*([\p{L}\p{N}-]+)$/iu.exec(parts.addr1);
                        if (box && INTL_PO.test(parts.addr1)) {raw.sec_unit_type=box[1];raw.sec_unit_num=box[2];}
                        else if (number) {raw.number=number[1];raw.street=number[3];if(number[2])raw.fraction=number[2];}
                        else if (trailing) {raw.number=trailing[2];raw.street=trailing[1];}
                        else if (parts.addr1) raw.street=parts.addr1;
                        if (parts.addr2) {
                            const unit=/^([^\d#]+?)\s*#?\s*([\p{L}\p{N}-]+)$/u.exec(parts.addr2);
                            if(unit && !parts.addr2.includes(',')){raw.sec_unit_type=unit[1].trim();raw.sec_unit_num=unit[2];}
                            else raw.sec_unit_type=parts.addr2;
                        }
                        if (/^\d{5}-\d{4}$/.test(raw.zip)) {raw.plus4=raw.zip.slice(6);raw.zip=raw.zip.slice(0,5);}
                        return raw;
                    };
                });
                if (typeof define !== "undefined" && define.amd) {
                    define([], function() {
                        return parser
                    })
                } else if (typeof exports !== "undefined") {
                    exports.parseIntersection = parser.parseIntersection;
                    exports.parseLocation = parser.parseLocation;
                    exports.parseInformalAddress = parser.parseInformalAddress;
                    exports.parseAddress = parser.parseAddress;
                    exports.parsePoAddress = parser.parsePoAddress;
					exports.validateFullAddress = parser.validateFullAddress;
					exports.hasEnoughAddressParts = parser.hasEnoughAddressParts;
					exports.parseFullAddress = parser.parseFullAddress;
					exports.formatAddressLine = parser.formatAddressLine
                } else {
                    root.addressParser = root.addressParser || parser
                }
            }
            )()
        }
        , {
            "xregexp/src/xregexp.js": 2
        }],
        2: [function(require, module, exports) {
            "use strict";
            var REGEX_DATA = "xregexp";
            var features = {
                astral: false,
                natives: false
            };
            var nativ = {
                exec: RegExp.prototype.exec,
                test: RegExp.prototype.test,
                match: String.prototype.match,
                replace: String.prototype.replace,
                split: String.prototype.split
            };
            var fixed = {};
            var regexCache = {};
            var patternCache = {};
            var tokens = [];
            var defaultScope = "default";
            var classScope = "class";
            var nativeTokens = {
                "default": /\\(?:0(?:[0-3][0-7]{0,2}|[4-7][0-7]?)?|[1-9]\d*|x[\dA-Fa-f]{2}|u(?:[\dA-Fa-f]{4}|{[\dA-Fa-f]+})|c[A-Za-z]|[\s\S])|\(\?(?:[:=!]|<[=!])|[?*+]\?|{\d+(?:,\d*)?}\??|[\s\S]/,
                "class": /\\(?:[0-3][0-7]{0,2}|[4-7][0-7]?|x[\dA-Fa-f]{2}|u(?:[\dA-Fa-f]{4}|{[\dA-Fa-f]+})|c[A-Za-z]|[\s\S])|[\s\S]/
            };
            var replacementToken = /\$(?:{([\w$]+)}|(\d\d?|[\s\S]))/g;
            var correctExecNpcg = nativ.exec.call(/()??/, "")[1] === undefined;
            var hasFlagsProp = /x/.flags !== undefined;
            var toString = {}.toString;
            function hasNativeFlag(flag) {
                var isSupported = true;
                try {
                    new RegExp("",flag)
                } catch (exception) {
                    isSupported = false
                }
                return isSupported
            }
            var hasNativeU = hasNativeFlag("u");
            var hasNativeY = hasNativeFlag("y");
            var registeredFlags = {
                g: true,
                i: true,
                m: true,
                u: hasNativeU,
                y: hasNativeY
            };
            function augment(regex, captureNames, xSource, xFlags, isInternalOnly) {
                var p;
                regex[REGEX_DATA] = {
                    captureNames: captureNames
                };
                if (isInternalOnly) {
                    return regex
                }
                if (regex.__proto__) {
                    regex.__proto__ = XRegExp.prototype
                } else {
                    for (p in XRegExp.prototype) {
                        regex[p] = XRegExp.prototype[p]
                    }
                }
                regex[REGEX_DATA].source = xSource;
                regex[REGEX_DATA].flags = xFlags ? xFlags.split("").sort().join("") : xFlags;
                return regex
            }
            function clipDuplicates(str) {
                return nativ.replace.call(str, /([\s\S])(?=[\s\S]*\1)/g, "")
            }
            function copyRegex(regex, options) {
                if (!XRegExp.isRegExp(regex)) {
                    throw new TypeError("Type RegExp expected")
                }
                var xData = regex[REGEX_DATA] || {};
                var flags = getNativeFlags(regex);
                var flagsToAdd = "";
                var flagsToRemove = "";
                var xregexpSource = null;
                var xregexpFlags = null;
                options = options || {};
                if (options.removeG) {
                    flagsToRemove += "g"
                }
                if (options.removeY) {
                    flagsToRemove += "y"
                }
                if (flagsToRemove) {
                    flags = nativ.replace.call(flags, new RegExp("[" + flagsToRemove + "]+","g"), "")
                }
                if (options.addG) {
                    flagsToAdd += "g"
                }
                if (options.addY) {
                    flagsToAdd += "y"
                }
                if (flagsToAdd) {
                    flags = clipDuplicates(flags + flagsToAdd)
                }
                if (!options.isInternalOnly) {
                    if (xData.source !== undefined) {
                        xregexpSource = xData.source
                    }
                    if (xData.flags != null) {
                        xregexpFlags = flagsToAdd ? clipDuplicates(xData.flags + flagsToAdd) : xData.flags
                    }
                }
                regex = augment(new RegExp(options.source || regex.source,flags), hasNamedCapture(regex) ? xData.captureNames.slice(0) : null, xregexpSource, xregexpFlags, options.isInternalOnly);
                return regex
            }
            function dec(hex) {
                return parseInt(hex, 16)
            }
            function getContextualTokenSeparator(match, scope, flags) {
                if (match.input.charAt(match.index - 1) === "(" || match.input.charAt(match.index + match[0].length) === ")" || isPatternNext(match.input, match.index + match[0].length, flags, "[?*+]|{\\d+(?:,\\d*)?}")) {
                    return ""
                }
                return "(?:)"
            }
            function getNativeFlags(regex) {
                return hasFlagsProp ? regex.flags : nativ.exec.call(/\/([a-z]*)$/i, RegExp.prototype.toString.call(regex))[1]
            }
            function hasNamedCapture(regex) {
                return !!(regex[REGEX_DATA] && regex[REGEX_DATA].captureNames)
            }
            function hex(dec) {
                return parseInt(dec, 10).toString(16)
            }
            function indexOf(array, value) {
                var len = array.length;
                var i;
                for (i = 0; i < len; ++i) {
                    if (array[i] === value) {
                        return i
                    }
                }
                return -1
            }
            function isPatternNext(pattern, pos, flags, needlePattern) {
                var inlineCommentPattern = "\\(\\?#[^)]*\\)";
                var lineCommentPattern = "#[^#\\n]*";
                var patternsToIgnore = flags.indexOf("x") > -1 ? ["\\s", lineCommentPattern, inlineCommentPattern] : [inlineCommentPattern];
                return nativ.test.call(new RegExp("^(?:" + patternsToIgnore.join("|") + ")*(?:" + needlePattern + ")"), pattern.slice(pos))
            }
            function isType(value, type) {
                return toString.call(value) === "[object " + type + "]"
            }
            function pad4(str) {
                while (str.length < 4) {
                    str = "0" + str
                }
                return str
            }
            function prepareFlags(pattern, flags) {
                var i;
                if (clipDuplicates(flags) !== flags) {
                    throw new SyntaxError("Invalid duplicate regex flag " + flags)
                }
                pattern = nativ.replace.call(pattern, /^\(\?([\w$]+)\)/, function($0, $1) {
                    if (nativ.test.call(/[gy]/, $1)) {
                        throw new SyntaxError("Cannot use flag g or y in mode modifier " + $0)
                    }
                    flags = clipDuplicates(flags + $1);
                    return ""
                });
                for (i = 0; i < flags.length; ++i) {
                    if (!registeredFlags[flags.charAt(i)]) {
                        throw new SyntaxError("Unknown regex flag " + flags.charAt(i))
                    }
                }
                return {
                    pattern: pattern,
                    flags: flags
                }
            }
            function prepareOptions(value) {
                var options = {};
                if (isType(value, "String")) {
                    XRegExp.forEach(value, /[^\s,]+/, function(match) {
                        options[match] = true
                    });
                    return options
                }
                return value
            }
            function registerFlag(flag) {
                if (!/^[\w$]$/.test(flag)) {
                    throw new Error("Flag must be a single character A-Za-z0-9_$")
                }
                registeredFlags[flag] = true
            }
            function runTokens(pattern, flags, pos, scope, context) {
                var i = tokens.length;
                var leadChar = pattern.charAt(pos);
                var result = null;
                var match;
                var t;
                while (i--) {
                    t = tokens[i];
                    if (t.leadChar && t.leadChar !== leadChar || t.scope !== scope && t.scope !== "all" || t.flag && flags.indexOf(t.flag) === -1) {
                        continue
                    }
                    match = XRegExp.exec(pattern, t.regex, pos, "sticky");
                    if (match) {
                        result = {
                            matchLength: match[0].length,
                            output: t.handler.call(context, match, scope, flags),
                            reparse: t.reparse
                        };
                        break
                    }
                }
                return result
            }
            function setAstral(on) {
                features.astral = on
            }
            function setNatives(on) {
                RegExp.prototype.exec = (on ? fixed : nativ).exec;
                RegExp.prototype.test = (on ? fixed : nativ).test;
                String.prototype.match = (on ? fixed : nativ).match;
                String.prototype.replace = (on ? fixed : nativ).replace;
                String.prototype.split = (on ? fixed : nativ).split;
                features.natives = on
            }
            function toObject(value) {
                if (value == null) {
                    throw new TypeError("Cannot convert null or undefined to object")
                }
                return value
            }
            function XRegExp(pattern, flags) {
                if (XRegExp.isRegExp(pattern)) {
                    if (flags !== undefined) {
                        throw new TypeError("Cannot supply flags when copying a RegExp")
                    }
                    return copyRegex(pattern)
                }
                pattern = pattern === undefined ? "" : String(pattern);
                flags = flags === undefined ? "" : String(flags);
                if (XRegExp.isInstalled("astral") && flags.indexOf("A") === -1) {
                    flags += "A"
                }
                if (!patternCache[pattern]) {
                    patternCache[pattern] = {}
                }
                if (!patternCache[pattern][flags]) {
                    var context = {
                        hasNamedCapture: false,
                        captureNames: []
                    };
                    var scope = defaultScope;
                    var output = "";
                    var pos = 0;
                    var result;
                    var applied = prepareFlags(pattern, flags);
                    var appliedPattern = applied.pattern;
                    var appliedFlags = applied.flags;
                    while (pos < appliedPattern.length) {
                        do {
                            result = runTokens(appliedPattern, appliedFlags, pos, scope, context);
                            if (result && result.reparse) {
                                appliedPattern = appliedPattern.slice(0, pos) + result.output + appliedPattern.slice(pos + result.matchLength)
                            }
                        } while (result && result.reparse);
                        if (result) {
                            output += result.output;
                            pos += result.matchLength || 1
                        } else {
                            var token = XRegExp.exec(appliedPattern, nativeTokens[scope], pos, "sticky")[0];
                            output += token;
                            pos += token.length;
                            if (token === "[" && scope === defaultScope) {
                                scope = classScope
                            } else if (token === "]" && scope === classScope) {
                                scope = defaultScope
                            }
                        }
                    }
                    patternCache[pattern][flags] = {
                        pattern: nativ.replace.call(output, /(?:\(\?:\))+/g, "(?:)"),
                        flags: nativ.replace.call(appliedFlags, /[^gimuy]+/g, ""),
                        captures: context.hasNamedCapture ? context.captureNames : null
                    }
                }
                var generated = patternCache[pattern][flags];
                return augment(new RegExp(generated.pattern,generated.flags), generated.captures, pattern, flags)
            }
            XRegExp.prototype = new RegExp;
            XRegExp.version = "3.2.0";
            XRegExp._clipDuplicates = clipDuplicates;
            XRegExp._hasNativeFlag = hasNativeFlag;
            XRegExp._dec = dec;
            XRegExp._hex = hex;
            XRegExp._pad4 = pad4;
            XRegExp.addToken = function(regex, handler, options) {
                options = options || {};
                var optionalFlags = options.optionalFlags;
                var i;
                if (options.flag) {
                    registerFlag(options.flag)
                }
                if (optionalFlags) {
                    optionalFlags = nativ.split.call(optionalFlags, "");
                    for (i = 0; i < optionalFlags.length; ++i) {
                        registerFlag(optionalFlags[i])
                    }
                }
                tokens.push({
                    regex: copyRegex(regex, {
                        addG: true,
                        addY: hasNativeY,
                        isInternalOnly: true
                    }),
                    handler: handler,
                    scope: options.scope || defaultScope,
                    flag: options.flag,
                    reparse: options.reparse,
                    leadChar: options.leadChar
                });
                XRegExp.cache.flush("patterns")
            }
            ;
            XRegExp.cache = function(pattern, flags) {
                if (!regexCache[pattern]) {
                    regexCache[pattern] = {}
                }
                return regexCache[pattern][flags] || (regexCache[pattern][flags] = XRegExp(pattern, flags))
            }
            ;
            XRegExp.cache.flush = function(cacheName) {
                if (cacheName === "patterns") {
                    patternCache = {}
                } else {
                    regexCache = {}
                }
            }
            ;
            XRegExp.escape = function(str) {
                return nativ.replace.call(toObject(str), /[-\[\]{}()*+?.,\\^$|#\s]/g, "\\$&")
            }
            ;
            XRegExp.exec = function(str, regex, pos, sticky) {
                var cacheKey = "g";
                var addY = false;
                var fakeY = false;
                var match;
                var r2;
                addY = hasNativeY && !!(sticky || regex.sticky && sticky !== false);
                if (addY) {
                    cacheKey += "y"
                } else if (sticky) {
                    fakeY = true;
                    cacheKey += "FakeY"
                }
                regex[REGEX_DATA] = regex[REGEX_DATA] || {};
                r2 = regex[REGEX_DATA][cacheKey] || (regex[REGEX_DATA][cacheKey] = copyRegex(regex, {
                    addG: true,
                    addY: addY,
                    source: fakeY ? regex.source + "|()" : undefined,
                    removeY: sticky === false,
                    isInternalOnly: true
                }));
                pos = pos || 0;
                r2.lastIndex = pos;
                match = fixed.exec.call(r2, str);
                if (fakeY && match && match.pop() === "") {
                    match = null
                }
                if (regex.global) {
                    regex.lastIndex = match ? r2.lastIndex : 0
                }
                return match
            }
            ;
            XRegExp.forEach = function(str, regex, callback) {
                var pos = 0;
                var i = -1;
                var match;
                while (match = XRegExp.exec(str, regex, pos)) {
                    callback(match, ++i, str, regex);
                    pos = match.index + (match[0].length || 1)
                }
            }
            ;
            XRegExp.globalize = function(regex) {
                return copyRegex(regex, {
                    addG: true
                })
            }
            ;
            XRegExp.install = function(options) {
                options = prepareOptions(options);
                if (!features.astral && options.astral) {
                    setAstral(true)
                }
                if (!features.natives && options.natives) {
                    setNatives(true)
                }
            }
            ;
            XRegExp.isInstalled = function(feature) {
                return !!features[feature]
            }
            ;
            XRegExp.isRegExp = function(value) {
                return toString.call(value) === "[object RegExp]"
            }
            ;
            XRegExp.match = function(str, regex, scope) {
                var global = regex.global && scope !== "one" || scope === "all";
                var cacheKey = (global ? "g" : "") + (regex.sticky ? "y" : "") || "noGY";
                var result;
                var r2;
                regex[REGEX_DATA] = regex[REGEX_DATA] || {};
                r2 = regex[REGEX_DATA][cacheKey] || (regex[REGEX_DATA][cacheKey] = copyRegex(regex, {
                    addG: !!global,
                    removeG: scope === "one",
                    isInternalOnly: true
                }));
                result = nativ.match.call(toObject(str), r2);
                if (regex.global) {
                    regex.lastIndex = scope === "one" && result ? result.index + result[0].length : 0
                }
                return global ? result || [] : result && result[0]
            }
            ;
            XRegExp.matchChain = function(str, chain) {
                return function recurseChain(values, level) {
                    var item = chain[level].regex ? chain[level] : {
                        regex: chain[level]
                    };
                    var matches = [];
                    function addMatch(match) {
                        if (item.backref) {
                            if (!(match.hasOwnProperty(item.backref) || +item.backref < match.length)) {
                                throw new ReferenceError("Backreference to undefined group: " + item.backref)
                            }
                            matches.push(match[item.backref] || "")
                        } else {
                            matches.push(match[0])
                        }
                    }
                    for (var i = 0; i < values.length; ++i) {
                        XRegExp.forEach(values[i], item.regex, addMatch)
                    }
                    return level === chain.length - 1 || !matches.length ? matches : recurseChain(matches, level + 1)
                }([str], 0)
            }
            ;
            XRegExp.replace = function(str, search, replacement, scope) {
                var isRegex = XRegExp.isRegExp(search);
                var global = search.global && scope !== "one" || scope === "all";
                var cacheKey = (global ? "g" : "") + (search.sticky ? "y" : "") || "noGY";
                var s2 = search;
                var result;
                if (isRegex) {
                    search[REGEX_DATA] = search[REGEX_DATA] || {};
                    s2 = search[REGEX_DATA][cacheKey] || (search[REGEX_DATA][cacheKey] = copyRegex(search, {
                        addG: !!global,
                        removeG: scope === "one",
                        isInternalOnly: true
                    }))
                } else if (global) {
                    s2 = new RegExp(XRegExp.escape(String(search)),"g")
                }
                result = fixed.replace.call(toObject(str), s2, replacement);
                if (isRegex && search.global) {
                    search.lastIndex = 0
                }
                return result
            }
            ;
            XRegExp.replaceEach = function(str, replacements) {
                var i;
                var r;
                for (i = 0; i < replacements.length; ++i) {
                    r = replacements[i];
                    str = XRegExp.replace(str, r[0], r[1], r[2])
                }
                return str
            }
            ;
            XRegExp.split = function(str, separator, limit) {
                return fixed.split.call(toObject(str), separator, limit)
            }
            ;
            XRegExp.test = function(str, regex, pos, sticky) {
                return !!XRegExp.exec(str, regex, pos, sticky)
            }
            ;
            XRegExp.uninstall = function(options) {
                options = prepareOptions(options);
                if (features.astral && options.astral) {
                    setAstral(false)
                }
                if (features.natives && options.natives) {
                    setNatives(false)
                }
            }
            ;
            XRegExp.union = function(patterns, flags, options) {
                options = options || {};
                var conjunction = options.conjunction || "or";
                var numCaptures = 0;
                var numPriorCaptures;
                var captureNames;
                function rewrite(match, paren, backref) {
                    var name = captureNames[numCaptures - numPriorCaptures];
                    if (paren) {
                        ++numCaptures;
                        if (name) {
                            return "(?<" + name + ">"
                        }
                    } else if (backref) {
                        return "\\" + (+backref + numPriorCaptures)
                    }
                    return match
                }
                if (!(isType(patterns, "Array") && patterns.length)) {
                    throw new TypeError("Must provide a nonempty array of patterns to merge")
                }
                var parts = /(\()(?!\?)|\\([1-9]\d*)|\\[\s\S]|\[(?:[^\\\]]|\\[\s\S])*\]/g;
                var output = [];
                var pattern;
                for (var i = 0; i < patterns.length; ++i) {
                    pattern = patterns[i];
                    if (XRegExp.isRegExp(pattern)) {
                        numPriorCaptures = numCaptures;
                        captureNames = pattern[REGEX_DATA] && pattern[REGEX_DATA].captureNames || [];
                        output.push(nativ.replace.call(XRegExp(pattern.source).source, parts, rewrite))
                    } else {
                        output.push(XRegExp.escape(pattern))
                    }
                }
                var separator = conjunction === "none" ? "" : "|";
                return XRegExp(output.join(separator), flags)
            }
            ;
            fixed.exec = function(str) {
                var origLastIndex = this.lastIndex;
                var match = nativ.exec.apply(this, arguments);
                var name;
                var r2;
                var i;
                if (match) {
                    if (!correctExecNpcg && match.length > 1 && indexOf(match, "") > -1) {
                        r2 = copyRegex(this, {
                            removeG: true,
                            isInternalOnly: true
                        });
                        nativ.replace.call(String(str).slice(match.index), r2, function() {
                            var len = arguments.length;
                            var i;
                            for (i = 1; i < len - 2; ++i) {
                                if (arguments[i] === undefined) {
                                    match[i] = undefined
                                }
                            }
                        })
                    }
                    if (this[REGEX_DATA] && this[REGEX_DATA].captureNames) {
                        for (i = 1; i < match.length; ++i) {
                            name = this[REGEX_DATA].captureNames[i - 1];
                            if (name) {
                                match[name] = match[i]
                            }
                        }
                    }
                    if (this.global && !match[0].length && this.lastIndex > match.index) {
                        this.lastIndex = match.index
                    }
                }
                if (!this.global) {
                    this.lastIndex = origLastIndex
                }
                return match
            }
            ;
            fixed.test = function(str) {
                return !!fixed.exec.call(this, str)
            }
            ;
            fixed.match = function(regex) {
                var result;
                if (!XRegExp.isRegExp(regex)) {
                    regex = new RegExp(regex)
                } else if (regex.global) {
                    result = nativ.match.apply(this, arguments);
                    regex.lastIndex = 0;
                    return result
                }
                return fixed.exec.call(regex, toObject(this))
            }
            ;
            fixed.replace = function(search, replacement) {
                var isRegex = XRegExp.isRegExp(search);
                var origLastIndex;
                var captureNames;
                var result;
                if (isRegex) {
                    if (search[REGEX_DATA]) {
                        captureNames = search[REGEX_DATA].captureNames
                    }
                    origLastIndex = search.lastIndex
                } else {
                    search += ""
                }
                if (isType(replacement, "Function")) {
                    result = nativ.replace.call(String(this), search, function() {
                        var args = arguments;
                        var i;
                        if (captureNames) {
                            args[0] = new String(args[0]);
                            for (i = 0; i < captureNames.length; ++i) {
                                if (captureNames[i]) {
                                    args[0][captureNames[i]] = args[i + 1]
                                }
                            }
                        }
                        if (isRegex && search.global) {
                            search.lastIndex = args[args.length - 2] + args[0].length
                        }
                        return replacement.apply(undefined, args)
                    })
                } else {
                    result = nativ.replace.call(this == null ? this : String(this), search, function() {
                        var args = arguments;
                        return nativ.replace.call(String(replacement), replacementToken, function($0, $1, $2) {
                            var n;
                            if ($1) {
                                n = +$1;
                                if (n <= args.length - 3) {
                                    return args[n] || ""
                                }
                                n = captureNames ? indexOf(captureNames, $1) : -1;
                                if (n < 0) {
                                    throw new SyntaxError("Backreference to undefined group " + $0)
                                }
                                return args[n + 1] || ""
                            }
                            if ($2 === "$") {
                                return "$"
                            }
                            if ($2 === "&" || +$2 === 0) {
                                return args[0]
                            }
                            if ($2 === "`") {
                                return args[args.length - 1].slice(0, args[args.length - 2])
                            }
                            if ($2 === "'") {
                                return args[args.length - 1].slice(args[args.length - 2] + args[0].length)
                            }
                            $2 = +$2;
                            if (!isNaN($2)) {
                                if ($2 > args.length - 3) {
                                    throw new SyntaxError("Backreference to undefined group " + $0)
                                }
                                return args[$2] || ""
                            }
                            throw new SyntaxError("Invalid token " + $0)
                        })
                    })
                }
                if (isRegex) {
                    if (search.global) {
                        search.lastIndex = 0
                    } else {
                        search.lastIndex = origLastIndex
                    }
                }
                return result
            }
            ;
            fixed.split = function(separator, limit) {
                if (!XRegExp.isRegExp(separator)) {
                    return nativ.split.apply(this, arguments)
                }
                var str = String(this);
                var output = [];
                var origLastIndex = separator.lastIndex;
                var lastLastIndex = 0;
                var lastLength;
                limit = (limit === undefined ? -1 : limit) >>> 0;
                XRegExp.forEach(str, separator, function(match) {
                    if (match.index + match[0].length > lastLastIndex) {
                        output.push(str.slice(lastLastIndex, match.index));
                        if (match.length > 1 && match.index < str.length) {
                            Array.prototype.push.apply(output, match.slice(1))
                        }
                        lastLength = match[0].length;
                        lastLastIndex = match.index + lastLength
                    }
                });
                if (lastLastIndex === str.length) {
                    if (!nativ.test.call(separator, "") || lastLength) {
                        output.push("")
                    }
                } else {
                    output.push(str.slice(lastLastIndex))
                }
                separator.lastIndex = origLastIndex;
                return output.length > limit ? output.slice(0, limit) : output
            }
            ;
            XRegExp.addToken(/\\([ABCE-RTUVXYZaeg-mopqyz]|c(?![A-Za-z])|u(?![\dA-Fa-f]{4}|{[\dA-Fa-f]+})|x(?![\dA-Fa-f]{2}))/, function(match, scope) {
                if (match[1] === "B" && scope === defaultScope) {
                    return match[0]
                }
                throw new SyntaxError("Invalid escape " + match[0])
            }, {
                scope: "all",
                leadChar: "\\"
            });
            XRegExp.addToken(/\\u{([\dA-Fa-f]+)}/, function(match, scope, flags) {
                var code = dec(match[1]);
                if (code > 1114111) {
                    throw new SyntaxError("Invalid Unicode code point " + match[0])
                }
                if (code <= 65535) {
                    return "\\u" + pad4(hex(code))
                }
                if (hasNativeU && flags.indexOf("u") > -1) {
                    return match[0]
                }
                throw new SyntaxError("Cannot use Unicode code point above \\u{FFFF} without flag u")
            }, {
                scope: "all",
                leadChar: "\\"
            });
            XRegExp.addToken(/\[(\^?)\]/, function(match) {
                return match[1] ? "[\\s\\S]" : "\\b\\B"
            }, {
                leadChar: "["
            });
            XRegExp.addToken(/\(\?#[^)]*\)/, getContextualTokenSeparator, {
                leadChar: "("
            });
            XRegExp.addToken(/\s+|#[^\n]*\n?/, getContextualTokenSeparator, {
                flag: "x"
            });
            XRegExp.addToken(/\./, function() {
                return "[\\s\\S]"
            }, {
                flag: "s",
                leadChar: "."
            });
            XRegExp.addToken(/\\k<([\w$]+)>/, function(match) {
                var index = isNaN(match[1]) ? indexOf(this.captureNames, match[1]) + 1 : +match[1];
                var endIndex = match.index + match[0].length;
                if (!index || index > this.captureNames.length) {
                    throw new SyntaxError("Backreference to undefined group " + match[0])
                }
                return "\\" + index + (endIndex === match.input.length || isNaN(match.input.charAt(endIndex)) ? "" : "(?:)")
            }, {
                leadChar: "\\"
            });
            XRegExp.addToken(/\\(\d+)/, function(match, scope) {
                if (!(scope === defaultScope && /^[1-9]/.test(match[1]) && +match[1] <= this.captureNames.length) && match[1] !== "0") {
                    throw new SyntaxError("Cannot use octal escape or backreference to undefined group " + match[0])
                }
                return match[0]
            }, {
                scope: "all",
                leadChar: "\\"
            });
            XRegExp.addToken(/\(\?P?<([\w$]+)>/, function(match) {
                if (!isNaN(match[1])) {
                    throw new SyntaxError("Cannot use integer as capture name " + match[0])
                }
                if (match[1] === "length" || match[1] === "__proto__") {
                    throw new SyntaxError("Cannot use reserved word as capture name " + match[0])
                }
                if (indexOf(this.captureNames, match[1]) > -1) {
                    throw new SyntaxError("Cannot use same name for multiple groups " + match[0])
                }
                this.captureNames.push(match[1]);
                this.hasNamedCapture = true;
                return "("
            }, {
                leadChar: "("
            });
            XRegExp.addToken(/\((?!\?)/, function(match, scope, flags) {
                if (flags.indexOf("n") > -1) {
                    return "(?:"
                }
                this.captureNames.push(null);
                return "("
            }, {
                optionalFlags: "n",
                leadChar: "("
            });
            module.exports = XRegExp
        }
        , {}]
    }, {}, [1])(1)
});
