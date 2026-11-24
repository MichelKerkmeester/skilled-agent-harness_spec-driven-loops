const fs = require("fs"), path = require("path");
const ADV = ".skilled/skills/system-skill-advisor/runtime";
const roots = [ADV + "/lib", ADV + "/handlers", ADV + "/tests", ADV + "/scripts", ADV];
const files = [];
function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (!["node_modules", "dist", "data", "database", "__pycache__"].includes(e.name)) walk(p); }
    else if (/\.(ts|mjs|js)$/.test(e.name)) files.push(p);
  }
}
roots.forEach(walk);
const src = fs.readFileSync(ADV + "/lib/command-attach.ts", "utf8");
const exportNames = [...src.matchAll(/^export (?:const|function|type|interface) ([A-Za-z_][A-Za-z0-9_]*)/gm)].map((m) => m[1]);
const bodies = files.filter((f) => f !== ADV + "/lib/command-attach.ts").map((f) => fs.readFileSync(f, "utf8"));
const unused = exportNames.filter((name) => {
  const re = new RegExp("\\b" + name + "\\b");
  return !bodies.some((b) => re.test(b));
});
console.log("exports", exportNames.length, "referenced only inside their own file:", unused.length);
console.log(unused.join(", "));
