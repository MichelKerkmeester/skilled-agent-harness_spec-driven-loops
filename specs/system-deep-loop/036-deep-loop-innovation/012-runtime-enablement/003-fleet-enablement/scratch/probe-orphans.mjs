const base = '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/022-012-runtime-enablement-build/.opencode/skills/system-deep-loop/runtime/lib';
const { LEGACY_PROJECTION_MANIFEST } = await import(`${base}/legacy-projections/index.ts`);
const { AUTHORITY_FLIP_MODE_ORDER } = await import(`${base}/per-mode-authority-flip/index.ts`);
const { deriveModeSurfaceSet } = await import(`${base}/fleet-enablement/index.ts`);

const owned = new Map();
for (const mode of AUTHORITY_FLIP_MODE_ORDER) {
  for (const id of deriveModeSurfaceSet(mode).surfaceIds) {
    owned.set(id, [...(owned.get(id) ?? []), mode]);
  }
}
const all = LEGACY_PROJECTION_MANIFEST.map((e) => e.surfaceId);
console.log(`manifest entries: ${all.length}`);
const orphans = all.filter((id) => !owned.has(id));
const doubles = [...owned.entries()].filter(([, m]) => m.length > 1);
console.log(`attributed to no mode : ${orphans.length}`);
orphans.forEach((id) => {
  const e = LEGACY_PROJECTION_MANIFEST.find((x) => x.surfaceId === id);
  console.log(`   ${id}  [${e.disposition}]  writer=${e.legacyWriter}`);
});
console.log(`attributed to 2+ modes: ${doubles.length}`);
doubles.forEach(([id, m]) => console.log(`   ${id} -> ${m.join(', ')}`));
