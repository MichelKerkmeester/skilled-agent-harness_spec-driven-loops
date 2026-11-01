# T016 — the new suite fails against the unmodified scripts

Command: `node --test .skilled/commands/doctor/scripts/tests/doctor-root-resolution.test.cjs`

```text
✔ fixture: a framework copy one folder below a git root with a decoy .opencode (0.297292ms)
✖ nested hub: sk-skill-check reports the hub inside the nested copy (23.731625ms)
✖ nested freshness: the panel reads the compiled stamp of the nested copy (23.353209ms)
✖ nested parent: parent-skill-check resolves the copy past the decoy (22.3735ms)
✔ baseline layout: the Skilled checkout resolves to itself (963.60325ms)
✔ baseline layout: a linked .skilled resolves the shared checkout (1009.038459ms)
✖ resolver unit: a nested path resolves the folder holding its framework copy (0.98125ms)
✖ resolver unit: a path with no sentinel hoists above its source tree (0.2665ms)
ℹ tests 8
ℹ pass 3
ℹ fail 5
```

Failing cases:

- `nested hub: sk-skill-check reports the hub inside the nested copy` — pre-change root is the enclosing git root, so `HUB_NOT_FOUND` replaces the report.
- `nested freshness: the panel reads the compiled stamp of the nested copy` — the panel scans `<enclosing>/.skilled/skills` and prints `panel error`.
- `nested parent: parent-skill-check resolves the copy past the decoy` — the decoy `.opencode` wins the walk and the module-scope require fails with `Cannot find module .../enclosing/.skilled/skills/sk-doc/sk-create-skill/scripts/lib/routing-shape-debt.cjs`.
- `resolver unit: a nested path resolves the folder holding its framework copy` — returns `<enclosing>` instead of `<enclosing>/nested`.
- `resolver unit: a path with no sentinel hoists above its source tree` — returns `<enclosing>` instead of `<enclosing>/loose`.

The two `baseline layout` cases and the `fixture` case already pass; they are the controls that must stay green.
