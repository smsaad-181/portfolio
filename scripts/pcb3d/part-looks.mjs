// Realistic part materials for EasyEDA STEP exports.
//
// EasyEDA's STEP files carry almost no colour (bodies are white, lavender or
// uncoloured), so — like the 3D model in Saad's Clock documentation — every
// part gets materials from its type: black IC bodies with tinned pins, beige
// resistors, orange ceramic caps, blue electrolytics, metal crystals and RF
// shields, coloured LED lenses, displays with red segments, gold header pins…
//
// classifyPart() decides the part type from its reference, BOM line and
// footprint; looks[type] says which material each region gets:
//   body   the main body           lead   pins, legs, terminals (thin parts)
//   plate  thin metal sheets/tabs  mark   printed markings (zero-thickness)
//   low    lower layer of a module (module PCB under a shield / screen)
//   face   top face of a 7-segment display (segment texture)

const srgb = (hex) => [(hex >> 16) & 255, (hex >> 8) & 255, hex & 255].map((v) => Math.pow(v / 255, 2.2));

// name → [hex colour, metallic, roughness, extra]
export const MATERIALS = {
  plastic: [0x1c1c1f, 0.0, 0.5],
  plasticMatte: [0x26262a, 0.0, 0.7],
  tin: [0xd2d6da, 0.95, 0.32],
  gold: [0xd9a646, 0.95, 0.3],
  steel: [0xbfc4c9, 0.85, 0.38],
  shield: [0xc9cdd1, 0.9, 0.42],
  brass: [0xc9a24a, 0.85, 0.35],
  marking: [0x9a9aa0, 0.0, 0.6],
  resBeige: [0xd9c59c, 0.0, 0.55],
  resBlue: [0x6c9fd8, 0.0, 0.5],
  ceramicOrange: [0xd9902a, 0.0, 0.5],
  ceramicTan: [0xc4a46e, 0.0, 0.6],
  elecBlue: [0x1d3c80, 0.1, 0.45],
  inductor: [0x3c3c40, 0.1, 0.65],
  cream: [0xeee7d6, 0.0, 0.55],
  relayBlue: [0x2b5cc2, 0.0, 0.45],
  potBlue: [0x2a62c9, 0.0, 0.45],
  terminalGreen: [0x2c8f57, 0.0, 0.5],
  pcbBlue: [0x1e4fa8, 0.0, 0.55],
  pcbRed: [0xae2a31, 0.0, 0.55],
  pcbDark: [0x1d2230, 0.0, 0.55],
  pcbGreen: [0x1f6b3a, 0.0, 0.55],
  glass: [0x0c0c0e, 0.2, 0.12],
  patchTan: [0xcdb487, 0.0, 0.6],
  displayBody: [0x161618, 0.0, 0.55],
  ledRed: [0xe8332e, 0.0, 0.25, { alpha: 0.85, glow: 0.35 }],
  ledGreen: [0x2ecc40, 0.0, 0.25, { alpha: 0.85, glow: 0.35 }],
  ledBlue: [0x2f6bff, 0.0, 0.25, { alpha: 0.85, glow: 0.35 }],
  ledYellow: [0xf5c518, 0.0, 0.25, { alpha: 0.85, glow: 0.35 }],
  ledOrange: [0xff8a1f, 0.0, 0.25, { alpha: 0.85, glow: 0.35 }],
  ledWhite: [0xf2f2ea, 0.0, 0.25, { alpha: 0.85, glow: 0.25 }],
  ledClear: [0xdfe6ea, 0.0, 0.15, { alpha: 0.6, glow: 0.1 }],
};
export const linear = (name) => {
  const [hex, metallic, roughness, extra = {}] = MATERIALS[name];
  return { color: srgb(hex), metallic, roughness, ...extra };
};

// type → material for each region (missing regions fall back to body/lead defaults)
export const LOOKS = {
  ic: { body: "plastic", lead: "tin", plate: "tin" },
  dip: { body: "plastic", lead: "tin", plate: "tin" },
  transistor: { body: "plastic", lead: "tin", plate: "tin" },
  regulator: { body: "plastic", lead: "tin", plate: "steel" },
  diode: { body: "plastic", lead: "tin", plate: "tin" },
  chipR: { body: "plastic", lead: "tin" },
  chipC: { body: "ceramicTan", lead: "tin" },
  chipL: { body: "inductor", lead: "tin" },
  inductor: { body: "inductor", lead: "tin", plate: "tin" },
  resTH: { body: "resBeige", lead: "tin" },
  resTH1: { body: "resBlue", lead: "tin" },
  capCer: { body: "ceramicOrange", lead: "tin" },
  capElec: { body: "elecBlue", lead: "tin", plate: "steel" },
  capElecSmd: { body: "shield", lead: "tin", low: "plastic", plate: "tin" },
  crystal: { body: "shield", lead: "tin", low: "plastic", plate: "tin" },
  rfModule: { body: "shield", low: "pcbDark", lead: "gold", plate: "shield" },
  gps: { body: "shield", low: "pcbBlue", lead: "gold", plate: "shield", second: "patchTan" },
  oled: { body: "glass", low: "pcbBlue", lead: "gold", plate: "steel" },
  tft: { body: "glass", low: "pcbRed", lead: "gold", plate: "steel" },
  module: { body: "plasticMatte", low: "pcbBlue", lead: "gold", plate: "steel" },
  devboard: { body: "shield", low: "pcbDark", lead: "gold", plate: "steel", second: "plastic" },
  devboardBlue: { body: "plastic", low: "pcbBlue", lead: "gold", plate: "steel", second: "plastic" },
  header: { body: "plastic", lead: "gold", plate: "gold" },
  jst: { body: "cream", lead: "tin", plate: "tin" },
  usb: { body: "steel", lead: "tin", low: "plastic", plate: "steel" },
  dcJack: { body: "plastic", lead: "tin", plate: "tin" },
  terminal: { body: "terminalGreen", lead: "tin", plate: "steel" },
  battery: { body: "plastic", lead: "steel", plate: "steel", second: "steel" },
  tact: { body: "plastic", lead: "tin", plate: "steel" },
  slide: { body: "steel", lead: "tin", plate: "steel", second: "plastic" },
  relay: { body: "relayBlue", lead: "tin", plate: "tin" },
  buzzer: { body: "plastic", lead: "tin", plate: "tin" },
  pot: { body: "potBlue", lead: "tin", plate: "brass" },
  display7: { body: "displayBody", lead: "tin", plate: "tin" },
  ledTH: { body: "ledRed", lead: "tin", plate: "tin" },
  ledSmd: { body: "ledRed", lead: "tin", low: "cream", plate: "tin" },
  generic: { body: "plastic", lead: "tin", plate: "tin" },
};

// LED colour from the BOM, most specific field first. EasyEDA/LCSC names put
// the colour letter in a token: LED_TH-R_5mm, LED_0603-G, KT-0603B, …-RD_GREEN.
const CODE = { r: "ledRed", g: "ledGreen", b: "ledBlue", y: "ledYellow", w: "ledWhite", o: "ledOrange" };
const WORD = [[/\bred\b|红/, "ledRed"], [/green|绿/, "ledGreen"], [/blue|蓝/, "ledBlue"], [/yellow|黄/, "ledYellow"],
  [/orange|橙/, "ledOrange"], [/white|白/, "ledWhite"], [/\brgb\b|ws28|sk68/, "ledClear"]];
function ledColour(fields) {
  for (const field of fields) {
    if (!field) continue;
    const t = field.toLowerCase();
    for (const [re, c] of WORD) if (re.test(t)) return c;
    for (const tok of t.split(/[^a-z0-9]+/)) {
      if (CODE[tok]) return CODE[tok];                       // LED_TH-R_5mm → "r"
      const m = tok.match(/^\d{4}([rgbywo])$/);              // KT-0603B → "0603b"
      if (m) return CODE[m[1]];
    }
  }
  return null;
}

/** Decide the part type. Returns { type, overrides, digits } */
export function classifyPart(ref, bom = {}, footprint = "") {
  const R = ref.toUpperCase();
  const fp = footprint.toUpperCase();
  const s = [ref, bom.name, bom.value, bom.footprint, bom.mpn, footprint].filter(Boolean).join(" ").toLowerCase();
  const chip = /^(R|C|L|LED|F|FB|D)?\d{4}\b|_?0[24]0[12]|0603|0805|1206|1210|2010|2512/.test(fp) && !/SOD|SOT|SMA|SMB|SMC/.test(fp);
  const o = {};

  if (/LED-SEG|7SEG|SEG-TH|SEVEN|DIGIT/.test(fp) || /7-seg|seven seg/.test(s)) {
    const digits = /4BIT|4-DIGIT|4DIGIT|12P|-4D/.test(fp) || /4 ?digit|4bit/.test(s) ? 4 : /2BIT|2-DIGIT|2DIGIT|-2D/.test(fp) ? 2 : 1;
    return { type: "display7", o, digits };
  }
  if (/devkit|dev ?board|supermini|super mini|nodemcu|wemos|d1 mini/.test(s)) return { type: "devboard", o };
  if (/arduino|nano|ad8232/.test(s)) return { type: "devboardBlue", o };
  if (/\brgb\b|ws281|sk681/.test(s)) return { type: /SMD|5050|3535|2020/.test(fp) ? "ledSmd" : "ledTH", o: { body: "ledClear" } };
  if (/^LED/.test(R) || /^LED/.test(fp)) {
    const col = ledColour([bom.name, bom.mpn, bom.value, bom.footprint, footprint]) ?? "ledRed";
    if (/SMD|^LED\d{4}|0603|0805|1206|PLCC|5050|3528|2020/.test(fp)) return { type: "ledSmd", o: { body: col } };
    return { type: "ledTH", o: { body: col } };
  }
  if (/oled|ssd1306|sh1106/.test(s)) return { type: "oled", o };
  if (/tft|ili9|st77|lcd|display/.test(s)) return { type: "tft", o };
  if (/wroom|wrover|esp-?12|esp32-c3-mini|\be22-|\be220-|\be32-|ra-0\d|rfm9\d|wirelm|nrf24|hc-?0[56]\b/.test(s)) return { type: "rfModule", o };
  if (/atgm|neo-?[67m]|\bgps|gnss/.test(s)) return { type: "gps", o };
  if (/srd-|relay|jqc|hf\d{2}f/.test(s)) return { type: "relay", o };
  if (/buzz|beep/.test(s) || /^(BZ|BUZ)\d/.test(R)) return { type: "buzzer", o };
  if (/^(X|Y|XTAL)\d/.test(R) || /osc-|hc-?49|crystal|xtal/.test(s)) return { type: "crystal", o };
  // Passives
  if (/^(R|RN)\d/.test(R) || /^R\d{4}|RES-|R_AXIAL/.test(fp)) {
    if (chip || /^R\d{4}/.test(fp)) return { type: "chipR", o };
    if (/RES-TH|AXIAL/.test(fp)) return { type: /mf|1%|metal film/.test(s) ? "resTH1" : "resTH", o };
  }
  if (/^C\d/.test(R) || /^C\d{4}|CAP-/.test(fp)) {
    if (/elec|cp_|e-cap|aluminum|polarized/.test(s) || /CAP-(TH|SMD)_BD/.test(fp)) return { type: /SMD/.test(fp) ? "capElecSmd" : "capElec", o };
    if (chip || /^C\d{4}/.test(fp)) return { type: "chipC", o };
    if (/CAP-TH/.test(fp)) return { type: "capCer", o };
    return { type: "chipC", o };
  }
  if (/^(L|FB)\d/.test(R) || /^IND|^L\d{4}|FB\d{4}/.test(fp)) return { type: chip ? "chipL" : "inductor", o };
  // Semiconductor packages (before connectors: their names also carry "P2.54")
  if (/TO-220|TO-252|TO-263|DPAK|SOT-223/.test(fp)) return { type: "regulator", o };
  if (/^(D|ZD|TVS)\d/.test(R) || /^(SOD|DO-|SMA|SMB|SMC)/.test(fp)) return { type: "diode", o };
  if (/^DIP-|^PDIP/.test(fp)) return { type: "dip", o };
  if (/^Q\d/.test(R) || /TO-92|SOT-23|SOT-89|SC-70/.test(fp)) return { type: "transistor", o };
  if (/SOIC|SOP|SSOP|TSSOP|MSOP|QFN|DFN|VSON|LQFP|TQFP|QFP|SOT-|ESOP|WSON|LGA|BGA/.test(fp)) return { type: "ic", o };
  // Electromechanical
  if (/usb|type-?c|micro-?b|mini-?b/.test(s)) return { type: "usb", o };
  if (/dc-?00\d|dc-?in|dcjack|dc jack|power jack/.test(s)) return { type: "dcJack", o };
  if (/\bkf\d|terminal|screw-?term|\bwj\d|\bdg\d|5\.08-\d+p/.test(s) && !/screw-hole/.test(s)) return { type: "terminal", o };
  if (/bat-|battery|bs-\d|cr20\d\d|cr12\d\d|18650|coin/.test(s) || /^(BT|BAT)\d/.test(R)) return { type: "battery", o };
  if (/\bxh|ph-|-ph\b|\bzh|sh-|jst|b2b|s2b|hy2|gh-|pzh|conn-smd/.test(s) || /CONN-TH_\dP-P2\.50|CONN-SMD/.test(fp)) return { type: "jst", o };
  if (/hdr|header|pin ?head|female|male|pm2\.54|fm2\.54|h2\.54/.test(s)) return { type: "header", o };
  if (/sk12|ss12|slide|msk12|ss-12|toggle/.test(s)) return { type: "slide", o };
  if (/key-|tact|ts-\d|button|sw-smd_4p|sw-th_4p|tl\d{4}/.test(s)) return { type: "tact", o };
  if (/\bpot|3296|\brv\d|trimm|wh148/.test(s) || /^(RV|VR|POT)\d/.test(R)) return { type: "pot", o };
  if (/module|breakout|sensor|mpu|bme|bmp|pms|mlx|max30|ads1|ina2|hx711/.test(s)) return { type: "module", o };
  return { type: "generic", o };
}

/** Parse body dimensions from an EasyEDA footprint name (mm), if present. */
export function footprintBody(fp = "") {
  const F = fp.toUpperCase();
  const num = (re) => { const m = F.match(re); return m ? parseFloat(m[1]) : null; };
  const bd = num(/_BD(\d+(?:\.\d+)?)/) ?? num(/-BD(\d+(?:\.\d+)?)/);
  const L = num(/[-_]L(\d+(?:\.\d+)?)/);
  const W = num(/[-_]W(\d+(?:\.\d+)?)/);
  if (bd && L) return { long: L, short: bd };          // axial: BDd-Ll
  if (bd) return { long: bd, short: bd };              // radial round
  if (L && W) return { long: Math.max(L, W), short: Math.min(L, W) };
  return null;
}

/** SVG for a 7-segment face with all segments lit (the classic test pattern). */
export function segmentSvg(digits = 1) {
  const W = 240 * digits, H = 340;
  const seg = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${Math.min(w, h) / 2}"/>`;
  const one = (ox) => {
    const t = 26, L = 120, x0 = ox + 40, y0 = 40, mid = 170, bot = 300;
    return [
      seg(x0 + t, y0, L, t), seg(x0 + t, mid - t / 2, L, t), seg(x0 + t, bot - t, L, t),
      seg(x0, y0 + t, t, mid - y0 - t * 1.5), seg(x0 + L + t, y0 + t, t, mid - y0 - t * 1.5),
      seg(x0, mid + t / 2, t, bot - mid - t * 1.5), seg(x0 + L + t, mid + t / 2, t, bot - mid - t * 1.5),
      `<circle cx="${x0 + L + t * 2.6}" cy="${bot - t / 2}" r="${t / 1.6}"/>`,
    ].join("");
  };
  const body = Array.from({ length: digits }, (_, i) => one(i * 240)).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <rect width="${W}" height="${H}" fill="#151517"/>
    <g transform="translate(14 0) skewX(-6)" fill="#ff3b30" opacity="0.92">${body}</g></svg>`;
}
