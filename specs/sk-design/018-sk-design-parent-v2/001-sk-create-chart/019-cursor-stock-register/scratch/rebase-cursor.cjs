const fs = require('fs'); const path = require('path');
const ROOT = process.cwd() + '/.opencode/skills/sk-design/sk-design-chart';
const P = path.join(ROOT, 'assets/color/palettes.json');
const d = JSON.parse(fs.readFileSync(P, 'utf8'));
const src = '.opencode/skills/sk-design/sk-design-md-generator/styles/library/bundles/cursor/DESIGN.md';
d.note = "The single source of truth for every colour value in this packet. A template carries these values inline in a sentinel-marked palette block, and check-corpus.cjs compares the block against this file in both directions. Edit here, then run the validator and paste the block it prints. The values are the cursor Style Reference in the style library (" + src + "): its parchment, ink, ash, driftwood, mist, stone and linen carry the chrome and the neutral system, its ember, verdant, crimson and amber carry the categorical system, and its ember drawn toward the ground carries the ordered ramp. Where a measured tone sat just under a gate it was moved by the least amount that clears: ash to #72716C for muted, amber to #BE8332 on paper, mist to #908F8D as the fourth neutral step, and the far end of the paper ramp to #E64B02 so five rungs fit above the ground.";
d.chrome = { surface: '#F7F7F4', ink: '#26251E', muted: '#72716C', rule: '#CDCDC9' };
d.chromeDark = { surface: '#26251E', ink: '#F7F7F4', muted: '#A1A19F', rule: '#F7F7F417' };
d.chromeDarkNote = "The ground a reader gets when their operating system asks for dark: the cursor ink itself, which the reference already uses as the surface behind its light action fills. Parchment becomes the ink and mist the muted tone, both clearing the text gate on that ground. The rule is ink at nine percent rather than a solid grey, chosen so the same declaration reads as a hairline on both grounds.";
d.radius = { mark: '2px', track: '4px', swatch: '4px', pill: '4px', card: '8px' };
if (d.radiusRoles && d.radiusRoles.ladder) d.radiusRoles.ladder = "One 2px knob, five steps, on the cursor reference's 4px corner with 8px for the one container that holds a whole card. Every step is a corner the corpus actually draws, so a rung exists for a consumer rather than for symmetry.";
d.systems.neutral.series = ['#26251E', '#7A7974', '#84847E', '#908F8D'];
d.systems.neutral.emphasis = '#F54E00';
d.systems.neutral.seriesDark = ['#F7F7F4', '#E6E5E0', '#CDCDC9', '#A1A19F'];
d.systems.neutral.emphasisDark = '#F54E00';
d.systems.ordered.series = ['#E64B02', '#F56C2C', '#F69363', '#F6B798', '#F7DACB'];
d.systems.ordered.emphasis = '#26251E';
d.systems.ordered.seriesDark = ['#F54E00', '#CF4606', '#AA3F0B', '#853810', '#603116'];
d.systems.ordered.emphasisDark = '#F7F7F4';
d.systems.categorical.series = ['#F54E00', '#1F8A65', '#CF2D56', '#BE8332'];
d.systems.categorical.emphasis = '#26251E';
d.systems.categorical.seriesDark = ['#F54E00', '#1F8A65', '#CF2D56', '#C08532'];
d.systems.categorical.emphasisDark = '#F7F7F4';
// keep the file's own formatting for arrays: splice values by regex rather than re-dumping
let raw = fs.readFileSync(P, 'utf8');
const setStr = (key, val) => { raw = raw.replace(new RegExp('("' + key + '":\\s*)"[^"]*"'), `$1${JSON.stringify(val)}`); };
const setObj = (key, obj) => { raw = raw.replace(new RegExp('("' + key + '":\\s*)\\{[^}]*\\}'), `$1` + JSON.stringify(obj, null, 4).replace(/\n\s*/g, m => m).replace(/\n/g, '\n  ')); };
setStr('note', d.note); setStr('chromeDarkNote', d.chromeDarkNote);
setObj('chrome', d.chrome); setObj('chromeDark', d.chromeDark); setObj('radius', d.radius);
raw = raw.replace(/("ladder":\s*)"[^"]*"/, `$1${JSON.stringify(d.radiusRoles.ladder)}`);
for (const [name, sy] of Object.entries(d.systems)) {
  const block = raw.slice(raw.indexOf(`"${name}": {`));
  const end = block.indexOf('\n    }');
  let seg = block.slice(0, end);
  seg = seg.replace(/("series":\s*)\[[^\]]*\]/, `$1${JSON.stringify(sy.series)}`).replace(/("seriesDark":\s*)\[[^\]]*\]/, `$1${JSON.stringify(sy.seriesDark)}`)
    .replace(/("emphasis":\s*)"[^"]*"/, `$1"${sy.emphasis}"`).replace(/("emphasisDark":\s*)"[^"]*"/, `$1"${sy.emphasisDark}"`);
  raw = raw.slice(0, raw.indexOf(`"${name}": {`)) + seg + block.slice(end);
}
JSON.parse(raw); fs.writeFileSync(P, raw);
const pal = JSON.parse(raw); const pre = pal.customPropertyPrefix;
function light(id) { const sy = pal.systems[id]; const l = [`/* CHART_PALETTE:BEGIN system=${id} */`, ':root {'];
  for (const [r, v] of Object.entries(pal.chrome)) l.push(`  ${pre}${r}: ${v};`);
  for (const [r, v] of Object.entries(pal.radius)) l.push(`  ${pre}radius-${r}: ${v};`);
  sy.series.forEach((v, i) => l.push(`  ${pre}series-${i + 1}: ${v};`)); l.push(`  ${pre}emphasis: ${sy.emphasis};`, '}', '/* CHART_PALETTE:END */'); return l.join('\n'); }
function dark(id) { const sy = pal.systems[id]; const props = []; for (const [r, v] of Object.entries(pal.chromeDark)) props.push([`${pre}${r}`, v]); sy.seriesDark.forEach((v, i) => props.push([`${pre}series-${i + 1}`, v])); props.push([`${pre}emphasis`, sy.emphasisDark]);
  const l = [`/* CHART_PALETTE_DARK:BEGIN system=${id} */`, '@media (prefers-color-scheme: dark) {', '  :root:not([data-scheme="light"]) {']; props.forEach(([p, v]) => l.push(`    ${p}: ${v};`)); l.push('  }', '}', ':root[data-scheme="dark"] {'); props.forEach(([p, v]) => l.push(`  ${p}: ${v};`)); l.push('}', '/* CHART_PALETTE_DARK:END */'); return l.join('\n'); }
const files = ['assets/templates', 'assets/examples', 'assets/color'].flatMap(dir => fs.readdirSync(path.join(ROOT, dir)).filter(f => f.endsWith('.html')).map(f => path.join(ROOT, dir, f)));
let changed = 0, fonts = 0;
for (const f of files) { let s = fs.readFileSync(f, 'utf8'); const m = /\/\*\s*CHART_PALETTE:BEGIN\s+system=([a-z0-9-]+)\s*\*\//.exec(s); if (!m || m[1] === 'design-md') continue; const id = m[1];
  s = s.replace(/\/\*\s*CHART_PALETTE:BEGIN[\s\S]*?\/\* CHART_PALETTE:END \*\//, light(id)).replace(/\/\*\s*CHART_PALETTE_DARK:BEGIN[\s\S]*?\/\* CHART_PALETTE_DARK:END \*\//, dark(id));
  const before = s; s = s.replace(/font-family: ui-sans-serif, system-ui, "Helvetica Neue", Arial, sans-serif;/g, 'font-family: CursorGothic, Inter, system-ui, "Helvetica Neue", sans-serif;'); if (s !== before) fonts++;
  fs.writeFileSync(f, s); changed++; }
console.log('files rebased', changed, 'font stacks set', fonts);
