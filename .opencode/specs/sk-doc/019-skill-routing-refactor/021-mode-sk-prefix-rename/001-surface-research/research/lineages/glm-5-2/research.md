# Research Report — sk- prefix rename surface discovery (lineage glm-5-2)

**Spec:** `sk-doc/019-skill-routing-refactor/021-mode-sk-prefix-rename/001-surface-research`
**Lineage:** glm-5-2 (cli-devin, model glm-5-2) | **Iterations:** 5 | **Stop reason:** max-iterations
**Generated:** 2026-07-27 | **Independent of sibling lineage grok-4-5-high; disagreements recorded, not averaged.**

---

## 1. Executive Summary

The rename of 20 mode packet directories and 21 workflowMode keys across the four sk- hubs touches **13 consumer classes (A–M)**. Every consumer is filesystem-reachable; **no DB/cache stores mode keys** (the advisor caches and routing gold are keyed by skill identity, which is unchanged). Two of the 21 workflowMode keys (`quality`, `interface`) are bare-English collision hazards in prose positions. Two artifacts are GENERATED and must be rebuilt (`graph-metadata.json`, `description.json`); the rest are hand-edited. Seven ordering constraints govern the rename, anchored by a HARD registry↔directory reverse-mapping check and a shared-packet dependency (`create-skill` serves two workflowModes). Nine verification levers (doctor routes + test guards) prove correctness per class.

## 2. Consumer Class Inventory (REQ-001)

| Class | Artifact | Files | Carries | Source |
|-------|----------|-------|---------|--------|
| A | `mode-registry.json` | 4 (one per hub) | workflowMode, packet, packetSkillName, command, aliases, proceduresPath, advisorRouting.packetSkillName, extensions surfaces/transports | iteration-001 |
| B | `hub-router.json` | 4 | tieBreak[], routerSignals.{key}, routerSignals.{key}.resources[], vocabularyClasses keywords | iteration-001 |
| C | `leaf-manifest.json` | 4 | modes[].workflowMode, modes[].packet, modes[].leaves[] | iteration-001 |
| D | `leaf-aliases.json` | 1 (sk-doc) | [].workflowMode, [].diskPath | iteration-001 |
| E | `description.json` | 4 | keywords[] (GENERATED) | iteration-001/003 |
| F | `graph-metadata.json` | 4 | category, domains[], key_topics[], source_docs[], key_files[], entities[].path (GENERATED) | iteration-002/003 |
| G | `command-metadata.json` | 1 (sk-design) | ownerMode, choreography[].skill, choreography[].resource, command, next[] | iteration-002 |
| H | Runtime mirrors (`.claude/`,`.devin/`,`.cursor/`,`.codex/`) | real dirs (not symlinks in this worktree) | copies of A–G + agents | iteration-004 |
| I | Agent definitions (`.opencode/agents/`,`.claude/agents/`,`.codex/agents/*.toml`) | 5+ files reference mode keys | prose mode mentions + packet-dir paths | iteration-004 |
| J | Benchmark gold (`skill-benchmark-report.json`) | 6+ hubs | workflowMode fields (GENERATED) | iteration-004 |
| K | Advisor DB/cache/state | 3 stores | skill-identity-keyed (NOT mode keys) | iteration-005 |
| L | `.devin/skills/` naming layer | 37 dirs | advisor skill identities (dir names OUT of scope; content IN scope) | iteration-005 |
| M | Drift-guard + graph compiler tests | 2+ | read mode-registry workflowMode/packet/packetSkillName | iteration-005 |

Representative paths per class (REQ-001 acceptance):
- A: `.opencode/skills/sk-code/mode-registry.json:24` (`workflowMode: "quality"`)
- B: `.opencode/skills/sk-code/hub-router.json:7` (`tieBreak[]`)
- C: `.opencode/skills/sk-code/leaf-manifest.json:71-72`
- D: `.opencode/skills/sk-doc/leaf-aliases.json:3`
- F: `.opencode/skills/sk-code/graph-metadata.json:212-228` (`key_files[]`)
- G: `.opencode/skills/sk-design/command-metadata.json:4,84-97`
- I: `.opencode/agents/markdown.md:193-194`, `.opencode/agents/prompt-improver.md:63`
- J: `.opencode/skills/sk-code/benchmark/reports/baseline/skill-benchmark-report.json:1045-1060`
- K: `.opencode/skills/system-skill-advisor/mcp-server/tests/scorer/fixtures/.embeddings-cache/skill-embeddings.json` (zero mode-key matches)

## 3. Typed vs Path vs Prose + Collision Risk (REQ-002)

| Position type | Classes | Sweep safety |
|---------------|---------|--------------|
| Typed (exact-string field) | A (`workflowMode`,`packet`,`packetSkillName`,`command`,`extensions`), B (`tieBreak[]`,`routerSignals` keys), C (`workflowMode`,`packet`), D (`workflowMode`), G (`ownerMode`,`skill`,`command`,`next[]`) | SAFE to sweep — exact match |
| Path-position | A (`proceduresPath`), B (`resources[]`), C (`leaves[]` resolution root), G (`choreography[].resource`), I (agent paths), H (mirror paths) | Path-aware sweep — packet dir as path segment |
| Free-prose | A (`aliases[]`), B (`vocabularyClasses keywords[]`), E (`keywords[]`), I (agent prose), F (`domains[]`,`key_topics[]`) | JUDGMENT required — bare keys embedded in prose |
| Generated | E, F, J, M (compiler output) | REBUILD, do not sweep |

**Collision risk (REQ-002 acceptance — stated per class):**
- **HIGH:** `quality` and `interface` are bare-English workflowMode keys; they appear in ordinary prose (`aliases[]`, `keywords[]`, agent prose). NEVER regex-sweep prose for bare `quality`/`interface`. Sweep only typed fields + path positions.
- **LOW:** all other 19 workflowMode keys are compound/prefixed (`code-review`, `create-*`, `prompt-*`, `md-generator`, `design-mcp-open-design`) — minimal prose collision.
- All 20 packet dir names are compound (`code-quality`, `design-interface`, `create-skill`, `prompt-improve`) — path-position sweeps are safe.
- The rename to `sk-code-quality`/`sk-design-interface`/etc. ELIMINATES future collision because the new keys are unique prefixed tokens.

## 4. Generated vs Hand-Edited (REQ-003)

**Generated — rebuild, do not edit:**
- `graph-metadata.json` (×4) — generator: `.opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts` (+ `migrate-generated-json.ts`). Freshness guard: `doctor-skill-graph-freshness`.
- `description.json` (×4) — generator: `.opencode/skills/system-spec-kit/scripts/spec-folder/generate-description.ts`.
- `skill-benchmark-report.json` (×6+ hubs) — generator: skill-benchmark runner (Lane C). Old reports become stale gold.
- `.codex/agents/*.toml` — generated from `.opencode/agents/` (Codex dialect).
- `skill_graph_compiler.py` output — compiled skill graph.

**Hand-edited — edit directly:**
- `mode-registry.json`, `hub-router.json`, `leaf-manifest.json`, `leaf-aliases.json` (typed manifests).
- `command-metadata.json` (sk-design) — hand-authored, test-guarded by `design-command-surface-check.mjs` + `command-binding-existence.vitest.ts`.
- Command router `.md` files + workflow YAML assets (`.opencode/commands/{create,interface,prompt,...}/`).
- `.opencode/agents/*.md` + `.claude/agents/*.md` (real fork).
- Runtime mirror copies (`.claude/skills/`,`.devin/skills/`,`.cursor/`) — re-sync from `.opencode` or sweep, then verify with `doctor-runtime-mirrors`.

## 5. Ordering Constraints (REQ-004)

1. **Shared-packet (HARD):** `create-skill` packet is shared by `create-skill` + `create-skill-parent` workflowModes. Dir rename `create-skill`→`sk-create-skill` updates BOTH modes' `packet`/`packetSkillName`/`advisorRouting.packetSkillName` simultaneously. `create-skill-parent` keeps key≠directory.
2. **Registry↔directory reverse mapping (HARD):** `parent-skill-check.cjs` check 3 requires `modes[].packet` == real directory and vice versa. Dir rename + `mode-registry.json` `packet` field MUST land together.
3. Typed manifests (A–D, G) before generated artifacts (E, F, J) — generators derive from manifests + dirs.
4. `.opencode/agents/` before `.codex/agents/*.toml` — Codex TOMLs generated from `.opencode/agents/`.
5. `.opencode` source before runtime mirrors — mirrors are real copies; re-sync after source edits, then `doctor-runtime-mirrors`.
6. Command bindings (router .md + YAML) after `mode-registry.json` `command`/`workflowMode` fields — so `command-binding-existence` passes.
7. Benchmark gold last — regenerate after all routing surfaces use new keys.

## 6. Verification Levers (REQ-005)

| Class | Verification command |
|-------|----------------------|
| A–D (typed manifests) | `doctor-parent-skill` route → `.opencode/commands/doctor/scripts/parent-skill-check.cjs` (checks 2a,2b,3a,3b: registry↔dir reverse mapping, packetKind, no nested graph-metadata/description) |
| F (graph-metadata freshness) | `doctor-skill-graph-freshness` route → `skill-graph-freshness.cjs` |
| E (description) | regenerate via `generate-description.ts`; `doctor-parent-skill` check 2b (no nested description.json) |
| G (command-metadata) | `design-command-surface-check.mjs` + `interface-command-contract.test.mjs` + `command-binding-existence.vitest.ts` |
| H (mirrors) | `doctor-runtime-mirrors` route → `agent-roster-mirror-check.cjs` + mirror parity |
| I (agents) | `doctor-agent-roster-mirror` route; `.codex/agents` regeneration parity |
| M (drift guard) | `routing-registry-drift-guard.vitest.ts` (+ sibling per-hub guards if present) + `vocabulary-agreement.vitest.ts` + `parent-skill-check-fixtures.vitest.ts` |
| All routes | `route-validate.py` (mutation-class correctness) |
| Full gate | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh` (packet validation) + `doctor` full sweep |

## 7. Spec Open Question — Answered

> "Whether any consumer stores a mode key in a database or cache that a filesystem sweep cannot reach."

**Answer: NO.** The advisor's three stores are keyed by SKILL IDENTITY (hub names `sk-code`/`sk-design`/`sk-doc`/`sk-prompt`), which the rename does NOT change:
- `.advisor-state/skill-graph-generation.json` — only a `generation` counter.
- `.embeddings-cache/skill-embeddings.json` — zero mode-key matches (grep).
- `labeled-prompts.jsonl` — labels `skill_top_1` (skill identity), not mode keys.

The only "gold" carrying mode keys is the generated benchmark report (Class J, filesystem-reachable, regenerated). **Caveat:** a full scan of `labeled-prompts.jsonl` for mode-level labels was not completed (sampled 3 rows); the rename phase should confirm no row carries a mode-level expected label.

## 8. Gaps Flagged for the Rename Phase

1. `/doc:quality` (create-quality-control) command router file NOT FOUND under `.opencode/commands/` — resolve before sweeping.
2. Sibling drift-guard tests for the four sk- hubs (only the deep-loop guard confirmed).
3. Full `labeled-prompts.jsonl` scan for mode-level expected labels.
4. Whether `.devin/skills/` dir names should be renamed (judgment: NO — advisor identities; content yes).
5. `orchestrate.md`/`deep-alignment.md` agent mode-key references field-verified only by match, not by line.

## 9. Independent Corroboration Note (REQ-006)

This lineage (glm-5-2 via cli-devin) ran independently of the sibling grok-4-5-high lineage. Agreement between the two is evidence; disagreement is recorded in the parent packet, not averaged. Notable independent findings: the symlink-vs-real-dir correction (SYNC.md claims symlinks; this worktree has real dirs) and the skill-identity-keyed cache answer are glm-5-2's own verification.
