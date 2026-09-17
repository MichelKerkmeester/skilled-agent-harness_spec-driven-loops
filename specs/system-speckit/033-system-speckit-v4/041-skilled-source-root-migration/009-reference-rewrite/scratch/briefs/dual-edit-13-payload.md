## Edit 1

File: `.skilled/skills/system-skill-advisor/runtime/lib/skill-graph/metadata-sanitizer.ts`

OLD:

~~~~text
  const resolved = resolve(sourcePath);
  const marker = `${sep}.opencode${sep}skills${sep}`;
  const index = resolved.indexOf(marker);
  if (index >= 0) return resolved.slice(0, index);
~~~~

NEW:

~~~~text
  const resolved = resolve(sourcePath);
  const markers = [`${sep}.skilled${sep}skills${sep}`, `${sep}.opencode${sep}skills${sep}`];
  const index = Math.max(...markers.map((marker) => resolved.indexOf(marker)));
  if (index >= 0) return resolved.slice(0, index);
~~~~
