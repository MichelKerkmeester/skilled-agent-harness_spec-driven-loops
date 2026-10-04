// Prints every value export of context-types as sorted JSON, from the module path given.
const mod = await import(process.argv[2]);
const out = {};
for (const key of Object.keys(mod).sort()) {
  const v = mod[key];
  if (v instanceof Set) out[key] = [...v].sort();
  else if (typeof v === 'function') continue;
  else out[key] = Object.fromEntries(Object.entries(v).sort());
}
console.log(JSON.stringify(out, null, 2));
