## Consumer inventory

Files that name a surface or count surfaces, with the matching line numbers read on the worktree after the surface removal landed. Counts and names are inserted into these files, never rewritten from memory.

| File | Lines |
|---|---|
| `.skilled/skills/sk-code/SKILL.md` | 15, 36, 38, 61, 68, 69, 72, 80, 162, 169, 199 |
| `.skilled/skills/sk-code/README.md` | 23, 55, 67, 104, 120, 123, 124, 125, 131, 132, 146, 189 |
| `.skilled/skills/sk-code/shared/README.md` | 17, 22, 77 |
| `.skilled/skills/sk-code/shared/references/phase-detection.md` | 16, 24, 62, 65, 75 |
| `.skilled/skills/sk-code/feature-catalog/feature-catalog.md` | 15, 35 |
| `.skilled/skills/sk-code/feature-catalog/two-axis-registry-driven-routing/two-axis-registry-driven-routing.md` | 26 |
| `.skilled/skills/sk-code/mode-registry.json` | 5, 18, 19, 61, 70, 71 |
| `.skilled/skills/sk-code/hub-router.json` | 7, 11, 31, 34 |
| `.skilled/skills/sk-code/description.json` | 45 |
| `.skilled/skills/sk-code/graph-metadata.json` | 43, 211, 223, 224, 225, 243, 247 |
| `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs` | 33, 34, 200, 201, 211, 214, 216, 261, 263, 265 |
| `.skilled/skills/sk-code/ROUTER.md` | 37, 98, 107 to 164, 178, 202, 255 to 274 and the maps in section 11 |

`graph-metadata.json` is generated except `derived.causal_summary`, the one hand-owned field.

`ROUTER.md` is added to the plan-time list because the CI map and both `CI_WORKFLOW` machine entries land there.

Not consumers: `sk-code-quality/` and `sk-code-review/` mention `sk-code-skilled` but never enumerate or count surfaces.
