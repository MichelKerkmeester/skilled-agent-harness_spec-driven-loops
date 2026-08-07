# Iteration 003 — Generated artifacts (rebuild) vs hand-edited (Q3)

**Focus (Q3):** Identify which artifacts are generated and must be rebuilt rather than hand-edited. Inspect command bindings under `.opencode/commands/` and locate the generators behind graph-metadata / description / command-metadata.

**Lineage:** glm-5-2 | **Executor:** cli-devin glm-5-2 | **Status:** complete

---

## Approach

Search `.opencode` scripts for writers of `graph-metadata.json`, `description.json`, `command-metadata.json`. Inspect command router `.md` files and command workflow YAML assets for mode-key / packet-dir references. Classify each artifact as generated (rebuild) vs hand-authored (edit).

## Findings

### GENERATED artifacts — must be rebuilt, not swept

#### G1 — `graph-metadata.json` (×4 hubs)
Generator: `.opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts` [SOURCE: .opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:538-544] ("A scoped run refreshes that single packet only. A broad [run] ... created, refreshed, skipped, and failed packets"). Companion: `migrate-generated-json.ts` in the same dir. The script walks packet folders and derives `source_docs`, `key_files`, `entities`, `key_topics`, `domains`, `category` [SOURCE: backfill-graph-metadata.ts:511-512 (`metadata.derived.source_docs`)].
- After rename: rename packet dirs first, then re-run backfill-graph-metadata.ts per hub. Sweeping the `derived` block by hand would diverge from the generator.
- Freshness guard exists: `.opencode/commands/doctor/scripts/skill-graph-freshness.cjs` [SOURCE: grep] — a doctor route verifies graph-metadata freshness, so a stale hand-edit would be flagged.

#### G2 — `description.json` (×4 hubs)
Generator: `.opencode/skills/system-spec-kit/scripts/spec-folder/generate-description.ts` [SOURCE: path .opencode/skills/system-spec-kit/scripts/spec-folder/generate-description.ts]. Emits `keywords`/`trigger_examples`/`supported_surfaces` from SKILL.md frontmatter and packet content.
- After rename: rebuild via generate-description.ts. The `code-quality` keyword in sk-code/description.json:41 is generator-emitted, not hand-typed.

### HAND-AUTHORED artifacts — edit directly (typed + path positions)

#### H1 — `mode-registry.json` (×4), `hub-router.json` (×4), `leaf-manifest.json` (×4), `leaf-aliases.json` (sk-doc)
Hand-authored typed manifests. No generator found. Edit typed fields (`workflowMode`, `packet`, `packetSkillName`, `command`, `tieBreak[]`, `routerSignals` keys) and path fields (`resources[]`, `proceduresPath`) directly. (Class A/B/C/D from iteration 1–2.)

#### H2 — `command-metadata.json` (sk-design)
No generator script found — references appear only in TEST files: `.opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs`, `interface-command-contract.test.mjs`, and `.opencode/skills/system-skill-advisor/mcp-server/tests/command-binding-existence.vitest.ts` [SOURCE: grep results]. → HAND-AUTHORED, but test-guarded. Edit `ownerMode`, `choreography[].skill`, `choreography[].resource` directly, then run the design-command-surface-check + command-binding-existence tests.

#### H3 — Command router `.md` files (`.opencode/commands/{create,interface,...}/*.md`)
Hand-authored router docs. Carry packet-dir-prefixed paths as path-positions.
- Example: `.opencode/commands/create/skill.md:22-24,31,43-44,56` references `.opencode/commands/create/assets/create-skill-{presentation.txt,auto.yaml,confirm.yaml}` and `.opencode/skills/sk-doc/create-skill/assets/skill/*-template.md` [SOURCE: .opencode/commands/create/skill.md:190-194 via yaml].
- The `create/` command set maps 1:1 to sk-doc `create-*` modes (skill.md, readme.md, agent.md, command.md, diff.md, flowchart.md, changelog.md, benchmark.md, feature-catalog.md, manual-testing-playbook.md, skill-parent.md) [SOURCE: ls .opencode/commands/create/].
- The `interface/` command set maps to sk-design `interface` + `md-generator` modes (design.md, design-reference.md) [SOURCE: ls .opencode/commands/interface/].

#### H4 — Command workflow YAML assets (`.opencode/commands/*/assets/*.yaml`)
Hand-authored workflow YAML. Carry BOTH typed-ish `workflowMode=<key>` literals AND packet-dir-prefixed paths.
- `workflowMode=interface` literal: [SOURCE: .opencode/commands/interface/assets/interface-design-auto.yaml:11,83,99,159-162] — embedded in YAML strings/prose; sweep as exact token `workflowMode=interface` → `workflowMode=sk-design-interface`.
- Packet-dir paths: [SOURCE: .opencode/commands/create/assets/create-skill-auto.yaml:190-194] (`.opencode/skills/sk-doc/create-skill/assets/skill/skill-md-template.md`), :214-217 (`.opencode/skills/sk-doc/scripts/...`).
- `role: Unified Skill Creator using sk-doc` (:9) — prose, no mode key; safe.

### Command-binding → mode mapping (ordering-relevant)

| Command file | Bound mode (workflowMode) | Hub |
|--------------|---------------------------|-----|
| `commands/create/skill.md` | `create-skill` | sk-doc |
| `commands/create/skill-parent.md` | `create-skill-parent` | sk-doc |
| `commands/create/readme.md` | `create-readme` | sk-doc |
| `commands/create/agent.md` | `create-agent` | sk-doc |
| `commands/create/command.md` | `create-command` | sk-doc |
| `commands/create/feature-catalog.md` | `create-feature-catalog` | sk-doc |
| `commands/create/manual-testing-playbook.md` | `create-manual-testing-playbook` | sk-doc |
| `commands/create/benchmark.md` | `create-benchmark` | sk-doc |
| `commands/create/flowchart.md` | `create-flowchart` | sk-doc |
| `commands/create/changelog.md` | `create-changelog` | sk-doc |
| `commands/create/diff.md` | `create-diff` | sk-doc |
| `commands/interface/design.md` | `interface` | sk-design |
| `commands/interface/design-reference.md` | `md-generator` | sk-design |

Note: `create-quality-control` and `prompt-improve`/`prompt-models` have no `commands/create/` or `commands/interface/` router file — `create-quality-control` binds to `/doc:quality` (per mode-registry.json:158) and `prompt-improve` to `/prompt-improve` (per sk-prompt mode-registry.json:26); these command files live elsewhere (e.g. a top-level `commands/` or hub-owned). Carried to iteration 4.

## What Worked
- `grep -rln` for generator scripts across `.opencode` isolated the two real generators (backfill-graph-metadata.ts, generate-description.ts) and confirmed command-metadata.json has NO generator (only test references) → hand-authored.
- Cross-referencing `commands/create/` listing with sk-doc mode-registry.json `command` fields gave the 1:1 command→mode binding table.

## What Failed / Ruled Out
- generate-description.ts did not grep-match `packet`/`workflowMode` (it reads SKILL.md frontmatter), so the exact input→output mapping for the `code-quality` keyword is INFERRED, not confirmed. To confirm: read generate-description.ts input handling (deferred — not load-bearing for the rebuild-vs-edit classification).
- Did not yet locate command files for `create-quality-control` (`/doc:quality`) and `prompt-improve` (`/prompt-improve`) — carried forward.

## Carried-Forward Open Questions
- Location of `/doc:quality` and `/prompt-improve` command files (and `/prompt-models` if any).
- Runtime mirrors: `.claude/`,`.cursor/`,`.codex/`,`.devin/` skill mirrors — do they duplicate mode-registry/leaf-manifest?
- Agent definitions (`.opencode/agents/`) referencing mode keys.
- Benchmark gold files referencing mode keys.
- DB/cache consumers (spec open question).
- Ordering constraints + verification commands (Q4/Q5).

## Next Focus
Q4+Q5: ordering constraints and verification commands. Inspect runtime mirrors (`.claude/`,`.cursor/`,`.codex/`,`.devin/`), agent definitions, benchmark gold, and the doctor scripts that already verify mode/leaf-manifest parity (candidate verification levers).

## newInfoRatio: 0.65
Novelty justification: established the generated-vs-hand-authored split with named generators (backfill-graph-metadata.ts, generate-description.ts), confirmed command-metadata.json is hand-authored+test-guarded, and produced the command→mode binding table. Not fully novel because command bindings were partially surfaced in iteration 1's `command` field evidence.
