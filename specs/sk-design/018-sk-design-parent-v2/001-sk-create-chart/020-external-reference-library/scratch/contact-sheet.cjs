// Tiles every capture in a directory into one page so a set can be judged at a glance.
const fs = require('fs'); const path = require('path');
const [dir, out, cols = '4'] = process.argv.slice(2);
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.png')).sort();
const cells = files.map((f) => `<figure><img src="file://${path.resolve(dir, f)}" loading="eager"><figcaption>${f.replace('.png', '')}</figcaption></figure>`).join('\n');
fs.writeFileSync(out, `<!doctype html><html><head><meta charset="utf-8"><style>
body{margin:0;background:#111;color:#ddd;font:11px ui-sans-serif,system-ui}
main{display:grid;grid-template-columns:repeat(${cols},1fr);gap:6px;padding:6px}
figure{margin:0}img{width:100%;aspect-ratio:1440/1000;object-fit:cover;object-position:top;display:block;background:#333}
figcaption{padding:2px 0 4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}</style></head><body><main>${cells}</main></body></html>`);
console.log(files.length, 'tiles');
