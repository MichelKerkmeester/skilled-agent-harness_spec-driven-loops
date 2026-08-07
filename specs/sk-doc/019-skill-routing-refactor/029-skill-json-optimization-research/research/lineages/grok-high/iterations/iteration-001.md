# Iteration 001 — Inventory and current state

## Focus
Dimension (1): inventory every in-scope JSON type — authored vs generated, presence per H/S class, automation coverage across the fleet and named pipeline scripts.

## Actions Taken
1. Enumerated all 11 top-level skill roots under `.opencode/skills/*/SKILL.md` and presence of the eight contract filenames.
2. Read the H/S class contract, `ci-skill-root-metadata.cjs`, `init_skill.py` scaffold writes, and doctor `parent-skill-check.cjs` description rules.
3. Located advisor ingest (`skill_graph_scan` → `skill-graph.sqlite`), compiled-route-manifest consumers of registry/router, and confirmed `generate-description.js` / `backfill-graph-metadata.js` are **spec-folder** tools, not skill-root generators.
4. Ran `ci-skill-root-metadata.cjs --format json` — fleet currently 11/11 pass (7 H + 4 S).

## Findings

### F1 — Fleet presence matches the H/S matrix exactly (confirmed)
Live census of top-level roots:

| File | Count | Notes |
|------|------:|-------|
| `graph-metadata.json` | 11/11 | Required both classes |
| `description.json` | 7/11 | H only (matches hub set) |
| `mode-registry.json` | 7/11 | H discriminator half |
| `hub-router.json` | 7/11 | H discriminator half |
| `leaf-manifest.json` | 11/11 | Generated both |
| `leaf-manifest.config.json` | 4/11 | S only |
| `leaf-aliases.json` | 5/11 | All 4 S + optional H (`sk-doc`) |
| `command-metadata.json` | 7/11 | H only |

[SOURCE: skill-root-metadata-contract.md:60-69]
[SOURCE: live presence census via Path.glob on `.opencode/skills/*/SKILL.md`]
[SOURCE: ci-skill-root-metadata.cjs JSON: checked=11, passed=11, failed=0]

### F2 — Authored vs generated split is explicit and narrow
Only `leaf-manifest.json` (H+S) and `leaf-aliases.json` (S only) are generated. The other six/seven files are authored semantic identity/policy. Gate `--fix` regenerates manifests only and refuses to invent authored meaning.

[SOURCE: skill-root-metadata-contract.md:85-101]
[SOURCE: ci-skill-root-metadata.cjs:40-42]

### F3 — Discriminator is registry+router pair; half-declarations rejected
Class H requires both `mode-registry.json` and `hub-router.json`; class S requires neither. Exactly one → `UNCLASSIFIABLE_ROOT`. Classification ignores generated artifacts deliberately.

[SOURCE: skill-root-metadata-contract.md:39-45]
[SOURCE: skill-root-metadata-contract.cjs:18-34]

### F4 — Advisor identity path is `graph-metadata.json` → SQLite, not `description.json`
`skill_graph_scan` indexes `.opencode/skills/*/graph-metadata.json` into `skill-graph.sqlite`. Contract and library both state no production consumer reads skill-root `description.json`; it exists for hub doctor checks (`parent-skill-check.cjs` rules 8a/8b).

[SOURCE: skill-graph-tools.ts:21-23]
[SOURCE: skill-root-metadata-contract.md:73-75]
[SOURCE: skill-root-metadata-contract.cjs:24-29]
[SOURCE: parent-skill-check.cjs:1022-1043]

### F5 — Pipeline scripts split across two domains (skill-root vs spec-folder)
In-scope generation/validation map:

| Script | Domain | Role |
|--------|--------|------|
| `create-skill/scripts/init_skill.py` | skill-root | Scaffolds H (registry/router/graph/description/command-metadata) or S (graph + leaf-manifest.config) |
| `generate-leaf-manifest.cjs` | skill-root | Builds generated manifest bytes |
| `ci-skill-root-metadata.cjs` | skill-root | Fleet class gate + freshness front |
| `ci-leaf-manifest-freshness.cjs` | skill-root | Manifest byte freshness (walks committed manifests) |
| `bin/lib/compiled-route-manifest.cjs` | hub routing | Reads hub `mode-registry.json` + `hub-router.json` to compile routes |
| `system-spec-kit/.../generate-description.js` | **spec-folder** | Spec continuity `description.json`, not skill-root |
| `system-spec-kit/.../backfill-graph-metadata.js` | **spec-folder** | Spec continuity `graph-metadata.json`, not skill-root |

Same filenames, different schemas — contract already warns, but the research charter listing these scripts together is a real operator confusion surface.

[SOURCE: init_skill.py:588-603]
[SOURCE: generate-description.js:7-12]
[SOURCE: skill-root-metadata-contract.md:32]
[SOURCE: compiled-route-manifest.cjs:405-412]

### F6 — Nested packet identity is currently clean
39 nested `SKILL.md` packets exist; nested `graph-metadata.json` under skills are only system-spec-kit **test fixtures**, not live second identities. Fleet gate rejects nested advisor identity.

[SOURCE: ci-skill-root-metadata.cjs:20-26]
[SOURCE: live rglob — only fixtures under `system-spec-kit/scripts/test-fixtures` and `tests/fixtures`]

### F7 — Automation coverage today
- **Presence/class/freshness**: automated via `ci-skill-root-metadata.cjs` (live green).
- **Scaffold**: `init_skill.py` emits class-required authored stubs for new H/S roots.
- **Hub doctor**: `parent-skill-check.cjs` (description schema + no nested identity + more).
- **Advisor ingest**: watcher/scan of graph-metadata into SQLite.
- **Compiled routes**: registry+router → compiled-route-manifest.
- **Not automated at skill-root**: authoring quality of intent_signals, edges, description prose, command-metadata choreography content (gate validates schema/presence, not routing effectiveness).

## Questions Answered
- Which JSON types exist fleet-wide, and which are authored vs generated per H/S class? → Answered (F1–F3, F5).

## Questions Remaining
- Which fields are redundant, unused, or drift-prone?
- What still requires hand-authoring that could be generated/auto-validated?
- Do intent-signals and load-bearing fields actually drive advisor routing quality?
- Where are test/CI and e2e scaffold→gate→ingest→routing gaps?

## Ruled Out
- Treating `generate-description.js` / `backfill-graph-metadata.js` as skill-root optimizers — they are spec-folder continuity tools (F5). Do not conflate schemas.

## Next Focus
Dimension (2) Optimization — redundant/unused fields, drift-prone data, consolidation candidates, fields no consumer reads (especially `description.json` vs `graph-metadata.json` overlap with SKILL.md / doctor-only consumers).
