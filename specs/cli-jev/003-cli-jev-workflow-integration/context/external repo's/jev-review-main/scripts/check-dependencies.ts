// Enforces the one-directional dependency flow between src/ layers:
//
//   { cli, dashboard } -> review -> adapters -> domain
//
// A module may import from its own layer or any lower one, never upward,
// and the two entry layers may not import each other. Import cycles fail.
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";

const SRC = resolve(import.meta.dirname, "..", "src");
const RANK: Record<string, number> = { domain: 0, adapters: 1, review: 2, cli: 3, dashboard: 3 };
const IMPORT = /^\s*(?:import|export)\b[^'"]*?from\s+['"]([^'"]+)['"]/gm;

const layerOf = (file: string) => relative(SRC, file).split(sep)[0];

const files = readdirSync(SRC, { recursive: true, encoding: "utf8" })
  .filter((name) => name.endsWith(".ts"))
  .map((name) => join(SRC, name));

const graph = new Map<string, string[]>();
const problems: string[] = [];

for (const file of files) {
  const layer = layerOf(file);
  if (!(layer in RANK)) problems.push(`${relative(SRC, file)}: unknown layer "${layer}"`);

  const targets: string[] = [];
  for (const [, specifier] of readFileSync(file, "utf8").matchAll(IMPORT)) {
    if (!specifier.startsWith(".")) continue;
    const target = resolve(dirname(file), specifier);
    targets.push(target);

    const targetLayer = layerOf(target);
    const upward = RANK[targetLayer] > RANK[layer];
    const sideways = targetLayer !== layer && RANK[targetLayer] === RANK[layer];
    if (upward || sideways) {
      problems.push(`${relative(SRC, file)} imports ${relative(SRC, target)} (${layer} -> ${targetLayer})`);
    }
  }
  graph.set(file, targets);
}

const visiting = new Set<string>();
const done = new Set<string>();
function walk(file: string, trail: string[]) {
  if (done.has(file)) return;
  if (visiting.has(file)) {
    const cycle = [...trail.slice(trail.indexOf(file)), file].map((f) => relative(SRC, f));
    problems.push(`cycle: ${cycle.join(" -> ")}`);
    return;
  }
  visiting.add(file);
  for (const target of graph.get(file) ?? []) walk(target, [...trail, file]);
  visiting.delete(file);
  done.add(file);
}
for (const file of files) walk(file, []);

if (problems.length > 0) {
  console.error("Dependency flow violations:");
  for (const problem of problems) console.error(`  ${problem}`);
  process.exit(1);
}
console.log(`dependency flow ok (${files.length} modules)`);
