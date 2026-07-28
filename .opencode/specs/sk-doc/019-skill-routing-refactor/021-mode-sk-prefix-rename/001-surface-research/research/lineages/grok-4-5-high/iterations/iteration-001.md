# Iteration 001 — Typed hub routing surfaces

## Focus
Enumerate `mode-registry.json` `workflowMode`+`packet` fields and `hub-router.json` `tieBreak`/`routerSignals` keys across sk-code, sk-design, sk-doc, sk-prompt; classify typed vs path; note collision risk for bare keys.

## Actions Taken
1. Loaded frozen rename map (21 rows) from parent assets.
2. Parsed all four hub `mode-registry.json` files and cross-checked against on-disk packet directories.
3. Parsed all four `hub-router.json` files for `tieBreak`, `routerSignals` object keys, and `resources` path strings.
4. Sampled `leaf-manifest.json` shape and located generation/verification via `parent-skill-check.cjs` / `generate-leaf-manifest.cjs`.

## Findings

### F1 — Consumer class: mode-registry typed identity fields
- **Class:** Typed JSON identity (`workflowMode`, `packet`, `packetSkillName`)
- **Classification:** typed / safe-to-sweep (JSON string values in known fields)
- **Collision risk:** Low for field rewrite; high if a bare-string grep for `quality`/`interface`/`diff` is used outside these fields
- **Count:** 21 registry rows across 4 hubs (4+3+12+2); matches rename-map row count
- **Evidence:**
  - [SOURCE: .opencode/skills/sk-code/mode-registry.json:24] `workflowMode: "quality"`, packet `code-quality`
  - [SOURCE: .opencode/skills/sk-design/mode-registry.json:36] `workflowMode: "interface"`, packet `design-interface`
  - [SOURCE: .opencode/skills/sk-doc/mode-registry.json:19-35] `create-skill` and `create-skill-parent` share packet `create-skill`
  - [SOURCE: .opencode/skills/sk-prompt/mode-registry.json:19-35] `prompt-improve` / `prompt-models`
  - [SOURCE: .opencode/specs/.../021-mode-sk-prefix-rename/assets/rename-map.json] 21 authoritative old→new pairs

### F2 — Consumer class: hub-router signal keys and tieBreak arrays
- **Class:** Typed JSON object keys + string array members keyed by workflowMode
- **Classification:** typed / safe-to-sweep for `routerSignals.<key>` and `routerPolicy.tieBreak[]` members; path rewrite needed for `resources` entries that embed packet directory names
- **Collision risk:** Medium-High — keys like `quality` and `interface` also appear inside keyword synonym arrays as English (`"quality"`, `"interface design"`)
- **Evidence:**
  - [SOURCE: .opencode/skills/sk-code/hub-router.json:7] tieBreak includes `"quality"`
  - [SOURCE: .opencode/skills/sk-code/hub-router.json:17-20] routerSignals.quality.resources → `code-quality/SKILL.md` (path position)
  - [SOURCE: .opencode/skills/sk-code/hub-router.json:42-43] vocabulary class keywords include bare `"quality"` (free-prose-like synonym list — requires-judgment)
  - [SOURCE: .opencode/skills/sk-design/hub-router.json:7,27,43] `interface` key + `design-interface/SKILL.md` path
  - [SOURCE: .opencode/skills/sk-doc/hub-router.json:7,23-24] all 12 mode keys including shared-packet pair

### F3 — Path position: packet directory names on disk
- **Class:** Filesystem directories under each hub root
- **Classification:** path position (rename/move, not string sweep)
- **Collision risk:** N/A for directory rename; must update every path consumer after move
- **Evidence:** All 20 unique packet dirs exist today (`create-skill` shared by two modes). Rename map maps each to `sk-*` directory except the deliberate key≠dir exception for `sk-create-skill-parent` → still `sk-create-skill`.

### F4 — Consumer class: leaf-manifest.json is generated
- **Class:** Generated artifact keyed by `workflowMode` + `packet`
- **Classification:** regenerate, do not hand-edit
- **Verification lever:** `node .opencode/commands/doctor/scripts/parent-skill-check.cjs <hub-dir>` (rules 10a–10d byte-drift against `generate-leaf-manifest.cjs`)
- **Evidence:**
  - [SOURCE: .opencode/commands/doctor/scripts/parent-skill-check.cjs:1080-1151] regenerate-and-compare contract
  - [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs] generator path referenced by doctor

### F5 — High-collision bare keys (typed-position only)
| Key | Hub | Why collision-prone |
|-----|-----|---------------------|
| `quality` | sk-code | Common English; appears in keyword lists |
| `interface` | sk-design | Common English/UI term |
| `diff` (via create-diff) | sk-doc | Common VCS term in prose |
| `md-generator` | sk-design | Lower risk but still free-text capable |

Sweep rule: rewrite only typed JSON fields and known path slots; never bare-token replace in Markdown/prose.

## Questions Answered
- Partial Q1: At least three consumer classes confirmed — mode-registry fields, hub-router keys/paths, leaf-manifest (generated), plus on-disk packet dirs.
- Partial Q2: Typed vs path vs judgment (keyword synonym arrays) separated for hub routing surfaces.

## Questions Remaining
- Advisor metadata / description.json / graph-metadata.json mode references
- Benchmark gold and Lane C route rows
- Command bindings, agent definitions, runtime mirrors
- Full ordering + verification matrix
- DB/cache consumers (open question from spec)

## Ruled Out / Dead Ends
- Ruled out treating hub-router `vocabularyClasses.*.keywords` as safe-to-sweep typed positions — they are free-text synonym banks even though stored in JSON. [SOURCE: sk-code/hub-router.json:42-43]

## Next Focus
Advisor metadata and generated hub identity pair (`description.json` / `graph-metadata.json`), leaf-alias maps, and whether mode keys leak into packet-local SKILL frontmatter.

## SCOPE VIOLATIONS
None.
