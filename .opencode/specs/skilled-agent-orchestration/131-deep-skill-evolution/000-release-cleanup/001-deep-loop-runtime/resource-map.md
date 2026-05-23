---
title: "Resource Map: deep-loop-runtime skill release cleanup"
description: "Full path catalog of every deep-loop-runtime skill artifact in audit scope plus this spec folder's own outputs. Per-row Note column reserves the audit_status field populated in phase 2; Phase-5 Augmentation section reserved for novel logic gaps surfaced in phase 5."
trigger_phrases:
  - "deep-loop-runtime release cleanup resource map"
  - "artifact inventory"
  - "audit scope"
  - "files touched"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/131-deep-skill-evolution/000-release-cleanup/001-deep-loop-runtime"
    last_updated_at: "2026-05-23T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "phase-1-resource-map-authored"
    next_safe_action: "run-strict-validate"
    blockers: []
    key_files:
      - "resource-map.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000001008"
      session_id: "131-000-001-spec-author"
      parent_session_id: "131-000-001-spec-author"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

# Resource Map

---

<!-- ANCHOR:when-to-use -->
## WHEN TO USE THIS TEMPLATE

Use this map alongside `spec.md` and `plan.md` when:
- Phase 2 audit dispatch needs an enumerable target list (every row drives a dispatch).
- Phase 4 alignment validation gate needs a complete artifact inventory to score.
- Phase 5 deep-research iterations need a baseline of "already in scope" so novel gaps are recognizable.
- A future reviewer or downstream packet needs a single-glance blast radius without reading `implementation-summary.md` end-to-end.

Pairs with `implementation-summary.md` — the summary narrates *what and why*; this map lists *which files*. Do not duplicate narrative, decisions, or test evidence here — those belong in `implementation-summary.md`, `decision-record.md`, or `checklist.md`.
<!-- /ANCHOR:when-to-use -->

---

<!-- ANCHOR:summary -->
## Summary

- **Total references**: ~88 (79 deep-loop-runtime artifacts + 12 spec-folder artifacts + a handful of external anchors)
- **By category**: READMEs=8, Documents=14, Skills=58, Specs=12, Scripts=4, Code=23 (LOG_ONLY per ADR-004), Config=1, Meta=1
- **assets/ row**: ABSENT_BY_DESIGN per ADR-003 (no row needed; deviation recorded in phase-4 validation report)
- **Missing on disk**: 0 at phase 1; updated each phase
- **Scope**: All deep-loop-runtime documentation files under audit in phases 2-4, this spec folder's own deliverables, code files marked LOG_ONLY per ADR-004 no-code-edit boundary, plus a small set of cross-system anchors cited in phase 3 README rewrite
- **Generated**: 2026-05-23T00:00:00Z (phase 1 baseline)

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed` · `LogOnly` (per ADR-004 — read for evidence, no edits).
> **Status vocabulary**: `OK` (exists on disk) · `MISSING` (referenced but absent) · `PLANNED` (intentional future path) · `ABSENT_BY_DESIGN` (per ADR-003).
> **Note column convention**: `audit_status:{PENDING|PASS|PASS_WITH_DEVIATIONS|PASS_SPOT_CHECK|PENDING_PHASE_3_REWRITE|FAIL|LOG_ONLY_NO_DEFECTS_SPOTTED|NO_TEMPLATE_DEVIATION_LOGGED|ABSENT_BY_DESIGN}` populated by phase 2. Phase-4 validation match% appended after audit.

### Phase 2 Audit Roll-up (2026-05-23)

- 21 findings emitted to `findings/audit-findings.jsonl` (0 P0 / 6 P1 / 15 P2)
- 4 P1 doc-class findings fixed in-session via surgical Edit (SKILL.md description trim, broken changelog path ref on SKILL.md + README.md, `## Council Primitives` H2 → H3 demotion)
- 11 findings deferred (3 to Phase 3 README rewrite, 2 to Phase 5 deep-research class-of-bug verification, 3 to Phase 4 deviation log, 3 code-class to follow-on packets per ADR-004)
- SC-007 invariant preserved: zero edits to lib/scripts/tests/storage
- Smart Router (SKILL.md §2) UNTOUCHED — ADR-007 not triggered
- Full rollup: `findings/audit-summary.md`
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:readmes -->
## 1. READMEs

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/deep-loop-runtime/README.md` | Updated (phase 2 partial: changelog path fix; phase 3 full rewrite) | OK | audit_status:PENDING_PHASE_3_REWRITE; 174 LOC; AF-0010 broken changelog path fixed in-session; AF-0011/0012/0013 deferred to phase 3 |
| `.opencode/skills/deep-loop-runtime/lib/README.md` | Analyzed | OK | audit_status:PENDING; 32 LOC; lib/ orientation README |
| `.opencode/skills/deep-loop-runtime/lib/council/README.md` | Analyzed | OK | audit_status:PENDING; 38 LOC; council subsystem README |
| `.opencode/skills/deep-loop-runtime/lib/coverage-graph/README.md` | Analyzed | OK | audit_status:PENDING; 37 LOC; coverage-graph subsystem README |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/README.md` | Analyzed | OK | audit_status:PENDING; 35 LOC; deep-loop subsystem README |
| `.opencode/skills/deep-loop-runtime/scripts/README.md` | Analyzed | OK | audit_status:PENDING; 45 LOC; scripts/ subdir README |
| `.opencode/skills/deep-loop-runtime/tests/README.md` | Analyzed | OK | audit_status:PENDING; 47 LOC; tests/ subdir README |
| `.opencode/skills/deep-loop-runtime/tests/helpers/README.md` | Analyzed | OK | audit_status:PENDING; 28 LOC; tests/helpers/ README |
| `.opencode/skills/deep-loop-runtime/storage/README.md` | Analyzed | OK | audit_status:PENDING; 36 LOC; storage/ orientation README |
<!-- /ANCHOR:readmes -->

---

<!-- ANCHOR:documents -->
## 2. Documents

> External markdown cited as anchors in phase 3 README rewrite or as standards references across phases 2-4. NOT modified.

| Path | Action | Status | Note |
|------|--------|--------|------|
| `Public/README.md` | Cited | OK | Tone anchor (~70% intensity); 1528 LOC |
| `.opencode/skills/system-spec-kit/README.md` | Cited | OK | Structural anchor (9-section pattern); 1053 LOC |
| `.opencode/skills/sk-doc/references/global/hvr_rules.md` | Cited | OK | HVR rules; pass threshold ≥85 |
| `.opencode/skills/sk-doc/references/global/validation.md` | Cited | OK | Two-stage validation pipeline + DQI scoring |
| `.opencode/skills/sk-doc/references/skill_creation.md` | Cited | OK | Skill creation standards (1027 LOC) |
| `.opencode/skills/sk-doc/references/readme_creation.md` | Cited | OK | README creation standards |
| `.opencode/skills/sk-doc/references/feature_catalog_creation.md` | Cited | OK | Feature catalog standards |
| `.opencode/skills/sk-doc/references/manual_testing_playbook_creation.md` | Cited | OK | Manual testing playbook standards |
| `.opencode/skills/cli-devin/SKILL.md` | Cited | OK | Phase 5 RCAF + medium-density rule (mandatory pre-read per ADR-002) |
| `.opencode/skills/sk-prompt-small-model/SKILL.md` | Cited | OK | Small-model dispatch sentinel (mandatory pre-read per ADR-002) |
| `.opencode/skills/sk-prompt/SKILL.md` | Cited | OK | Prompt-composition skill (RCAF/CLEAR) |
| `.opencode/skills/cli-opencode/SKILL.md` | Cited | OK | Auxiliary phase-2 dispatch provider routing |
| `.opencode/skills/deep-research/SKILL.md` | Cited | OK | Phase 5a consumer of `/deep:start-research-loop`; consumes 4 scripts in deep-loop-runtime |
| `.opencode/skills/deep-research/commands/start-research-loop.md` | Cited | OK | Phase 5a command surface (if present at command level) |
<!-- /ANCHOR:documents -->

---

<!-- ANCHOR:skills -->
## 5. Skills

> Every artifact under `.opencode/skills/deep-loop-runtime/` in audit scope. Per-row `audit_status` populated in phase 2. Code files (lib/, tests/) are LOG_ONLY per ADR-004.

### 5.1 SKILL.md (1 file)

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/deep-loop-runtime/SKILL.md` | Updated (phase 2 surgical: description trim + path fix + H2→H3; phase 3 version bump) | OK | audit_status:PASS_WITH_DEVIATIONS; 266 LOC; v1.0.0 → v1.1.0 (phase 3); Smart Router §2 PRESERVED (ADR-007 not triggered); AF-0001/0003/0004 fixed in-session; AF-0002/0005/0006/0007 P2 held with rationale |

### 5.2 References (4 files, 732 LOC total)

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/deep-loop-runtime/references/coverage_graph_schema.md` | Analyzed | OK | audit_status:PENDING; 193 LOC; template=skill_reference_template.md |
| `.opencode/skills/deep-loop-runtime/references/integration_points.md` | Analyzed | OK | audit_status:PENDING; 181 LOC; consumer surface map |
| `.opencode/skills/deep-loop-runtime/references/script_interface_contract.md` | Analyzed | OK | audit_status:PENDING; 165 LOC; 4-script CLI contract |
| `.opencode/skills/deep-loop-runtime/references/state_format.md` | Analyzed | OK | audit_status:PENDING; 193 LOC; runtime state JSONL shape |

### 5.3 Assets — ABSENT_BY_DESIGN (per ADR-003)

> Per ADR-003: deep-loop-runtime has no `assets/` directory. This is logged once in `validation/validation-report.jsonl` and requires no phase-2 audit dispatch.

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/deep-loop-runtime/assets/` | (none) | ABSENT_BY_DESIGN | audit_status:ABSENT_BY_DESIGN; rationale in ADR-003; deviation recorded in phase-4 validation report |

### 5.4 Feature Catalog (18 files + 1 index, 1019 LOC total)

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/deep-loop-runtime/feature_catalog/feature_catalog.md` | Analyzed | OK | audit_status:PENDING; 356 LOC; root inventory; template=feature_catalog_template.md |
| `.opencode/skills/deep-loop-runtime/feature_catalog/01--executor/01-executor-config.md` | Analyzed | OK | audit_status:PENDING; 57 LOC |
| `.opencode/skills/deep-loop-runtime/feature_catalog/01--executor/02-executor-audit.md` | Analyzed | OK | audit_status:PENDING; 58 LOC |
| `.opencode/skills/deep-loop-runtime/feature_catalog/01--executor/03-fallback-router.md` | Analyzed | OK | audit_status:PENDING; 57 LOC |
| `.opencode/skills/deep-loop-runtime/feature_catalog/02--prompt-rendering/01-prompt-pack.md` | Analyzed | OK | audit_status:PENDING; 57 LOC |
| `.opencode/skills/deep-loop-runtime/feature_catalog/03--validation/01-post-dispatch-validate.md` | Analyzed | OK | audit_status:PENDING; 58 LOC |
| `.opencode/skills/deep-loop-runtime/feature_catalog/04--state-safety/01-atomic-state.md` | Analyzed | OK | audit_status:PENDING; 57 LOC |
| `.opencode/skills/deep-loop-runtime/feature_catalog/04--state-safety/02-jsonl-repair.md` | Analyzed | OK | audit_status:PENDING; 57 LOC |
| `.opencode/skills/deep-loop-runtime/feature_catalog/04--state-safety/03-loop-lock.md` | Analyzed | OK | audit_status:PENDING; 57 LOC |
| `.opencode/skills/deep-loop-runtime/feature_catalog/04--state-safety/04-permissions-gate.md` | Analyzed | OK | audit_status:PENDING; 57 LOC |
| `.opencode/skills/deep-loop-runtime/feature_catalog/05--scoring/01-bayesian-scorer.md` | Analyzed | OK | audit_status:PENDING; 57 LOC |
| `.opencode/skills/deep-loop-runtime/feature_catalog/06--coverage-graph/01-coverage-graph-db.md` | Analyzed | OK | audit_status:PENDING; 58 LOC |
| `.opencode/skills/deep-loop-runtime/feature_catalog/06--coverage-graph/02-coverage-graph-query.md` | Analyzed | OK | audit_status:PENDING; 57 LOC |
| `.opencode/skills/deep-loop-runtime/feature_catalog/06--coverage-graph/03-coverage-graph-signals.md` | Analyzed | OK | audit_status:PENDING; 58 LOC |
| `.opencode/skills/deep-loop-runtime/feature_catalog/07--script-entry-points/01-convergence-script.md` | Analyzed | OK | audit_status:PENDING; 57 LOC |
| `.opencode/skills/deep-loop-runtime/feature_catalog/07--script-entry-points/02-upsert-script.md` | Analyzed | OK | audit_status:PENDING; 57 LOC |
| `.opencode/skills/deep-loop-runtime/feature_catalog/07--script-entry-points/03-query-script.md` | Analyzed | OK | audit_status:PENDING; 57 LOC |
| `.opencode/skills/deep-loop-runtime/feature_catalog/07--script-entry-points/04-status-script.md` | Analyzed | OK | audit_status:PENDING; 57 LOC |

### 5.5 Manual Testing Playbook (17 files + 1 index, 1830 LOC total)

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/deep-loop-runtime/manual_testing_playbook/manual_testing_playbook.md` | Analyzed | OK | audit_status:PENDING; 415 LOC; root orchestrator; template=manual_testing_playbook_template.md |
| `.opencode/skills/deep-loop-runtime/manual_testing_playbook/01--executor/*.md` | Analyzed (3 files) | OK | audit_status:PENDING; 001/002/003; 83 LOC each |
| `.opencode/skills/deep-loop-runtime/manual_testing_playbook/02--prompt-rendering/*.md` | Analyzed (1 file) | OK | audit_status:PENDING; 004; 83 LOC |
| `.opencode/skills/deep-loop-runtime/manual_testing_playbook/03--validation/*.md` | Analyzed (1 file) | OK | audit_status:PENDING; 005; 83 LOC |
| `.opencode/skills/deep-loop-runtime/manual_testing_playbook/04--state-safety/*.md` | Analyzed (4 files) | OK | audit_status:PENDING; 006/007/008/009; 83 LOC each |
| `.opencode/skills/deep-loop-runtime/manual_testing_playbook/05--scoring/*.md` | Analyzed (1 file) | OK | audit_status:PENDING; 010; 83 LOC |
| `.opencode/skills/deep-loop-runtime/manual_testing_playbook/06--coverage-graph/*.md` | Analyzed (3 files) | OK | audit_status:PENDING; 011/012/013; 83 LOC each |
| `.opencode/skills/deep-loop-runtime/manual_testing_playbook/07--script-entry-points/*.md` | Analyzed (4 files) | OK | audit_status:PENDING; 014/015/016/017; 83 LOC each |

### 5.6 Changelog (1 file + 1 added in phase 3)

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/deep-loop-runtime/changelog/v1.0.0.0.md` | Analyzed | OK | audit_status:PENDING; 99 LOC; current head; format-only check |
| `.opencode/skills/deep-loop-runtime/changelog/v1.1.0.0.md` | Created (phase 3) | PLANNED | audit_status:PENDING; authored at end of phase 3 per changelog-entry.schema.json |

### 5.7 Code (LOG_ONLY per ADR-004 — no edits)

> Per ADR-004 no-code-edit boundary: these files are read for evidence during phase 2 audit but never modified. Findings in these files are logged with `status: defer:follow-on-packet`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts` | LogOnly | OK | audit_status:LOG_ONLY; 54 LOC |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/bayesian-scorer.ts` | LogOnly | OK | audit_status:LOG_ONLY; 44 LOC |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-audit.ts` | LogOnly | OK | audit_status:LOG_ONLY; 797 LOC (largest module) |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts` | LogOnly | OK | audit_status:LOG_ONLY; 275 LOC |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts` | LogOnly | OK | audit_status:LOG_ONLY; 77 LOC |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/jsonl-repair.ts` | LogOnly | OK | audit_status:LOG_ONLY; 107 LOC |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/loop-lock.ts` | LogOnly | OK | audit_status:LOG_ONLY; 259 LOC |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/permissions-gate.ts` | LogOnly | OK | audit_status:LOG_ONLY; 445 LOC |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts` | LogOnly | OK | audit_status:LOG_ONLY; 727 LOC |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/prompt-pack.ts` | LogOnly | OK | audit_status:LOG_ONLY; 96 LOC |
| `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-db.ts` | LogOnly | OK | audit_status:LOG_ONLY; 829 LOC (2nd largest) |
| `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-query.ts` | LogOnly | OK | audit_status:LOG_ONLY; 438 LOC |
| `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts` | LogOnly | OK | audit_status:LOG_ONLY; 632 LOC |
| `.opencode/skills/deep-loop-runtime/lib/council/adjudicator-verdict-scoring.cjs` | LogOnly | OK | audit_status:LOG_ONLY; 189 LOC |
| `.opencode/skills/deep-loop-runtime/lib/council/cost-guards.cjs` | LogOnly | OK | audit_status:LOG_ONLY; 151 LOC |
| `.opencode/skills/deep-loop-runtime/lib/council/multi-seat-dispatch.cjs` | LogOnly | OK | audit_status:LOG_ONLY; 178 LOC |
| `.opencode/skills/deep-loop-runtime/lib/council/round-state-jsonl.cjs` | LogOnly | OK | audit_status:LOG_ONLY; 282 LOC |
| `.opencode/skills/deep-loop-runtime/lib/council/session-state-hierarchy.cjs` | LogOnly | OK | audit_status:LOG_ONLY; 208 LOC |
| `.opencode/skills/deep-loop-runtime/tests/**/*.vitest.ts` | LogOnly | OK | audit_status:LOG_ONLY; 22 vitest files; 3,651 LOC total; unit/integration/lifecycle/council |
| `.opencode/skills/deep-loop-runtime/tests/helpers/spawn-cjs.ts` | LogOnly | OK | audit_status:LOG_ONLY; 156 LOC; test helper |
<!-- /ANCHOR:skills -->

---

<!-- ANCHOR:specs -->
## 6. Specs

> This spec folder's own deliverables. Includes phase-2 / phase-4 / phase-5 outputs as PLANNED at phase-1 baseline.

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/000-release-cleanup/001-deep-loop-runtime/spec.md` | Created | OK | Level 3 |
| `.../001-deep-loop-runtime/plan.md` | Created | OK | Level 3 with dependency graph |
| `.../001-deep-loop-runtime/tasks.md` | Created | OK | Phased task ledger across 5 phases |
| `.../001-deep-loop-runtime/checklist.md` | Created | OK | Level-3 verification + sign-off |
| `.../001-deep-loop-runtime/decision-record.md` | Created | OK | ADR-001 through ADR-005 + reserved ADR-006/007 |
| `.../001-deep-loop-runtime/implementation-summary.md` | Created (skeleton) | OK | Filled post-phase-5 |
| `.../001-deep-loop-runtime/resource-map.md` | Created | OK | This file |
| `.../001-deep-loop-runtime/description.json` | Created | PLANNED | Auto-generated by generate-context.js |
| `.../001-deep-loop-runtime/graph-metadata.json` | Created | PLANNED | Auto-generated by generate-context.js |
| `.../001-deep-loop-runtime/schemas/audit-finding.schema.json` | Created | OK | Copied from sibling 002 (reusable across release-cleanup packets) |
| `.../001-deep-loop-runtime/schemas/changelog-entry.schema.json` | Created | OK | Copied from sibling 002 |
| `.../001-deep-loop-runtime/schemas/validation-report.schema.json` | Created | OK | Copied from sibling 002 |
| `.../001-deep-loop-runtime/schemas/iteration-output.schema.json` | Created | OK | Copied from sibling 002; phase-5 iteration output contract |
| `.../001-deep-loop-runtime/findings/audit-findings.jsonl` | Created (phase 2) | PLANNED | One JSON per line, schema-validated |
| `.../001-deep-loop-runtime/findings/audit-summary.md` | Created (phase 2) | PLANNED | Human-readable rollup |
| `.../001-deep-loop-runtime/validation/validation-report.jsonl` | Created (phase 4) | PLANNED | One JSON per line, schema-validated |
| `.../001-deep-loop-runtime/validation/validation-report.md` | Created (phase 4) | PLANNED | Human-readable summary |
| `.../001-deep-loop-runtime/research/iterations/iter-NN-cli-devin.json` | Created (phase 5) | PLANNED | 10 iteration outputs |
| `.../001-deep-loop-runtime/research/convergence-summary.md` | Created (phase 5) | PLANNED | Stop reason + signals |
<!-- /ANCHOR:specs -->

---

<!-- ANCHOR:scripts -->
## 7. Scripts

> Per template precedence: shell + node + cjs scripts under `scripts/` belong here. README inside scripts/ stays under §READMEs. Code under LOG_ONLY per ADR-004.

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs` | LogOnly | OK | audit_status:LOG_ONLY; 389 LOC; consumed by deep-research + deep-review YAMLs |
| `.opencode/skills/deep-loop-runtime/scripts/upsert.cjs` | LogOnly | OK | audit_status:LOG_ONLY; 222 LOC |
| `.opencode/skills/deep-loop-runtime/scripts/query.cjs` | LogOnly | OK | audit_status:LOG_ONLY; 155 LOC |
| `.opencode/skills/deep-loop-runtime/scripts/status.cjs` | LogOnly | OK | audit_status:LOG_ONLY; 138 LOC |
| `.opencode/skills/deep-loop-runtime/scripts/lib/cli-guards.cjs` | LogOnly | OK | audit_status:LOG_ONLY; 199 LOC; guard library shared across the 4 entry-point scripts |
<!-- /ANCHOR:scripts -->

---

<!-- ANCHOR:config -->
## 9. Config

> Spec-folder JSON metadata (description.json, graph-metadata.json) lives under §Specs per template precedence. This category covers SKILL-level config not under §5.

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/deep-loop-runtime/graph-metadata.json` | Analyzed | OK | audit_status:PENDING; 170 LOC; skill advisor input; not edited unless cascade forces it (then skill-graph compile required per `feedback_skill_graph_compiler_rebuild`) |
<!-- /ANCHOR:config -->

---

<!-- ANCHOR:meta -->
## 10. Meta

| Path | Action | Status | Note |
|------|--------|--------|------|
| `CLAUDE.md` | Cited | OK | Governance — §1 CLI dispatch rule + small-model dispatch rule (load-bearing for phase 5 per ADR-002) |
| `AGENTS.md` | Cited | OK | §7 Skill Routing reference (gate 2 routing protocol) |
<!-- /ANCHOR:meta -->

---

## Phase-5 Augmentation

> **[CLOSED 2026-05-23]** All 36 findings remediated in child packet `001-doc-remediation/` (4 cli-devin-orchestrated batches; ships deep-loop-runtime v1.2.0). Batch A closed the cross-doc + cross-arc + schema-doc + council-metadata cluster (26 findings). Batch B fixed 3 confirmed description drifts (DR-025/026/028; 14 unchecked deferred per N=3 sampling note). Batch C closed DR-034 by creating feature_catalog/08--council/ + manual_testing_playbook/08--council/ (12 new files + 7 updates). Batch D closed DR-012/013/014/015 with 4 vitest files (29 tests pass). DR-037 (supersedes DR-029) cross-arc citation corrected at 6 sites. SC-007 held (only tests/ code-class writes, per child ADR-002). See `001-doc-remediation/implementation-summary.md` + `changelog/v1.2.0.0.md`.

> Populated by iter-10 synthesis on 2026-05-23 after a 10-iter cli-devin SWE-1.6 deep-research loop (iter 3 + 10 orchestrator-direct per ADR-002). Stop reason: `discovery-saturation-after-9-iters` (canonical `newInfoRatio < 0.05 for 2 consecutive iters` threshold was structurally unreachable on this audit trajectory; see `research/convergence-summary.md`). 36 unique novel findings emerged across 9 dispatch iters (0 P0 / 23 P1 / 13 P2); DR-037 supersedes DR-029 (37 emitted, 36 unique). Every DR-* finding deduped against AF-0001..AF-0080 — zero overlap. Per ADR-004, the 4 test-coverage-gap findings (DR-012..DR-015) were LOG_ONLY at synthesis time; the child packet `001-doc-remediation` ADR-002 partially relaxed SC-007 to close them.

### Findings grouped by cluster (for remediation-packet planning)

| Gap ID | Source Iter | Severity | Description | Recommended Action |
|--------|-------------|----------|-------------|--------------------|
| **CLUSTER 1: Council-omission cluster (7 findings × 9 artifact surfaces — single remediation packet)** | | | | |
| DR-016 | iter-02 (cli-devin) | P1 | `graph-metadata.json:53-61, :79-95, :96-104, :105-154` — consolidates iter-1 DR-006/DR-007/DR-008. `domains` array missing "council"; `key_topics` omits 5 council modules; `entities` missing 5 council entities + `cli-guards.cjs`. | Apply ready-to-apply JSON patch from `research/iterations/iteration-002.md`: 1 domain + 5 key_topics + 10 key_files + 6 entities. Re-run `skill_graph_compiler.py --export-json --pretty` after. |
| DR-017 | iter-03 (orchestrator-direct) | P1 | `references/integration_points.md` — entire AI-Council section missing despite `deep_ask-ai-council_{auto,confirm}.yaml:46-48` loading 3 `lib/council/*.cjs` modules. | Add a new §AI-Council section enumerating the YAML-config call shape + runtime-import call shape. |
| DR-018 | iter-03 (orchestrator-direct) | P1 | `references/integration_points.md:25-28` §1 OVERVIEW — lists `lib/deep-loop/` + `lib/coverage-graph/` but OMITS `lib/council/` (5 cjs modules runtime-coupled via 8 production `require()` calls in `deep-ai-council/scripts/orchestrate-*.cjs`). | Extend §1 OVERVIEW to include `lib/council/` and reframe consumer list from "3 consumers: deep-review, deep-research, doctor" to "4 consumers: + deep-ai-council". |
| DR-031 | iter-06 (cli-devin) | P2 | `graph-metadata.json:155` `causal_summary` — does NOT mention the council surface (5 cjs modules added in 131/001/008 ADR-001). | Patch causal_summary to include council surface; reference corrected 131/001/008 ADR-001 path (NOT legacy 129/001). Single remediation packet should apply with DR-029→DR-037 fix together for "129/001" → "131/001/008" consistency. |
| DR-033 | iter-06 (cli-devin) | P1 | `graph-metadata.json:47-51` `manual.related_to` — lists deep-review, deep-research, system-code-graph but OMITS `deep-ai-council` despite 8 production `require()` calls in `deep-ai-council/scripts/orchestrate-{topic,session}.cjs` consuming council modules. Breaks bi-directional graph traversal. | Add `deep-ai-council` to `manual.related_to`. Re-run skill_graph_compiler. |
| DR-034 | iter-07 (cli-devin) | P1 | `feature_catalog/feature_catalog.md:31, :33-41` + `manual_testing_playbook/manual_testing_playbook.md:47, :27-41` omit `lib/council/` (5 cjs modules) despite SKILL.md §3.5 + README.md §3.5 documenting council as in-scope. ADR-001 L88 mandates broadening. 19 remediation surfaces: 12 new files (5 catalog + 5 playbook + 2 folders 08--council/) + 7 existing-file updates (TOC, coverage table, count claims, cross-reference index). | Create new `08--council/` folder in both catalog and playbook; instantiate 5 catalog entries (4-section template) + 5 playbook scenarios (5-section template, numbered 018..022) from `system-spec-kit/templates/`; update root index TOC + coverage table + count claims. Re-baseline README §4/§9 disambiguation (DR-009) after expansion to "22 features + 22 scenarios + 1 index = 23 files". |
| DR-037 | iter-09 (cli-devin) | P1 | Supersedes DR-029. 6 prose phrases across 5 sites cite legacy "Packet 129/001 ADR-001" instead of current `131/001/008 ADR-001 (Runtime Boundary Decision)`. Sites: `SKILL.md:144` phrase A + `SKILL.md:144` phrase B ("downstream packet 129 phases 003-006" → `131/001/010-013`) + `README.md:198`, `:247`, `:417` + `changelog/v1.1.0.0.md:63`. | Apply 6 ready-to-apply replacement strings from `research/iterations/iteration-009.md` §"DR-037 replacement-string package". Single batch edit. |
| **CLUSTER 2: Schema-doc-drift cluster (2 findings — folds into Cluster 1 remediation packet)** | | | | |
| DR-035 | iter-08 (cli-devin) | P1 | `README.md:194` lists 6 review-node-kinds `(dimension, file, finding, evidence, remediation, code-surface)` — source `coverage-graph-db.ts:132-143` enforces 10 (`DIMENSION, FILE, FINDING, EVIDENCE, REMEDIATION, BUG_CLASS, INVARIANT, PRODUCER, CONSUMER, TEST`). 5 omissions + 1 fabrication (`code-surface` exists nowhere in source — likely Phase-3 README rewriter cross-contamination from `sk-code` "surface" vocabulary). | Option A preferred: drop inline enumeration, defer to authoritative schema doc §3 table. Option B: list all 10 kinds. See `research/iterations/iteration-008.md` §"Recommended remediation". |
| DR-036 | iter-08 (cli-devin) | P2 | `references/coverage_graph_schema.md:36` loop-type prose has same `code-surface` fabrication; internally contradicts same file's §3 authoritative table at L52-65 (which has all 10 correct kinds). | Same Option A preferred: drop fabricated kind from prose, defer to §3 table. Apply with DR-035 in single packet. |
| **CLUSTER 3: Integration-point omissions (7 additional findings — folds into Cluster 1 remediation packet)** | | | | |
| DR-019 | iter-03 (orchestrator-direct) | P1 | `references/integration_points.md:62-76` §4 DOCTOR — never names the route manifest at `.opencode/commands/doctor/_routes.yaml:88-104` (gate3_location + 4 script_invocations + 4 trigger_phrases). | Extend §4 to name the route manifest path + the 4 trigger_phrases. |
| DR-020 | iter-03 (orchestrator-direct) | P1 | `references/integration_points.md:62-76` §4 DOCTOR omits `.opencode/commands/doctor/update.md:28,:220,:272` which references deep-loop scripts including the `.pre-doctor-update.*.bak` backup pattern. | Add `update.md` reference + backup pattern doc to §4. |
| DR-021 | iter-03 (orchestrator-direct) | P1 | `references/integration_points.md:79-89` §5 SYSTEM-CODE-GRAPH lists 4 feature_catalog refs but OMITS playbook scenarios `009-deep-loop-graph-convergence-yaml-fire.md` + `010-deep-loop-graph-upsert-conditional.md`. | Add the 2 playbook scenario paths to §5. |
| DR-022 | iter-03 (orchestrator-direct) | P1 | `references/integration_points.md:93-101` §6 TEST DISCOVERY lists vitest.config.ts glob but OMITS `mcp_server/lib/deep-loop/README.md:25-68` (legacy migration README) + `mcp_server/handlers/coverage-graph/README.md`. | Add the 2 README paths as legacy-migration anchors in §6. |
| DR-023 | iter-03 (orchestrator-direct) | P1 | `references/integration_points.md:93-101` §6 doesn't call out the cross-pkg test discovery surprise: `mcp_server/tests/deep-loop/review-depth-reducer.vitest.ts:9` imports `../../../../deep-review/scripts/reduce-state.cjs` (memory hypothesis CONFIRMED). | Add a `§6.1 Cross-Pkg Test Discovery Surprise` callout documenting the boundary extension. |
| DR-024 | iter-03 (orchestrator-direct) | P1 | `references/integration_points.md:79-89, :62-76` §§4-5 omit `commands/doctor/assets/doctor_deep-loop.yaml`, `doctor_update.yaml` (route YAMLs) + `deep-agent-improvement/scripts/lib/README.md:26` (peer reference describing typed-errors pattern mirrored from cli-guards). | Add the 3 paths to §§4 + 5 as cross-system anchors. |
| DR-030 | iter-06 (cli-devin) | P2 | `graph-metadata.json:156-164` `source_docs` array (8 entries) excludes `changelog/v1.0.0.0.md` + `changelog/v1.1.0.0.md` despite SKILL.md L266 + README.md L438 referencing them. | Append 2 changelog filenames to `source_docs`. Apply with DR-016 in graph-metadata batch. Re-run skill_graph_compiler. |
| **CLUSTER 4: Cross-doc consistency batch (iter 1 + iter 5 residue — 12 findings, surgical patches)** | | | | |
| DR-001 | iter-01 (cli-devin) | P1 | `README.md:3, :82` claims "22 vitest files"; actual = 27 (14 unit + 7 integration + 1 lifecycle + 5 council). | Update to "27 vitest files" or rephrase. |
| DR-002 | iter-01 (cli-devin) | P2 | `SKILL.md:81` claims "21+ vitest files"; actual = 27. | Update or rephrase. |
| DR-003 | iter-01 (cli-devin) | P1 | `README.md:242` §4 STRUCTURE tree omits `changelog/v1.1.0.0.md` (self-omission of current release). | Add `changelog/v1.1.0.0.md` to tree. |
| DR-004 | iter-01 (cli-devin) | P1 | `README.md:438` §9 RELATED DOCUMENTS table omits link to `v1.1.0.0.md`. | Add link to the v1.1.0.0.md row. |
| DR-005 | iter-01 (cli-devin) | P2 | `graph-metadata.json:167` `last_updated_at: "2026-05-22T00:00:00Z"` stale vs README + v1.1.0.0.md dated 2026-05-23. | Update timestamp. Re-run skill_graph_compiler. |
| DR-009 | iter-01 (cli-devin) | P1 | `README.md:259, :440` self-inconsistency — §4 says "18 manual-test scenarios" (file count), §9 says "(17 entries)" (scenario count). | Standardize on a single metric. After DR-034 expansion, re-baseline to "22 features + 22 scenarios + 1 index = 23 files". |
| DR-010 | iter-01 (cli-devin) | P2 | `SKILL.md:253` grammar drift — singular "workflow YAML call" used for plural subject context ("Deep-review and deep-research"). | Pluralize. |
| DR-011 | iter-01 (cli-devin) | P1 | `SKILL.md:266` §8 REFERENCES still cites only `changelog/v1.0.0.0.md`; v1.1.0.0 is current release. | Add v1.1.0.0.md reference. |
| DR-006 | iter-01 (cli-devin) | P1 | `graph-metadata.json:79-95` `derived.key_topics` omits all 5 council modules. Consolidated into DR-016 patch. | Apply via DR-016 patch. |
| DR-007 | iter-01 (cli-devin) | P2 | `graph-metadata.json:105-154` `derived.entities` missing 5 council entities + `cli-guards.cjs`. Consolidated into DR-016. | Apply via DR-016 patch. |
| DR-008 | iter-01 (cli-devin) | P2 | `graph-metadata.json:53-61` `domains` array missing "council". Consolidated into DR-016. | Apply via DR-016 patch. |
| DR-027 | iter-05 (cli-devin) | P1 | `lib/README.md:31` "Per-domain READMEs" list includes only 2 of 3 (`lib/council/`, `lib/coverage-graph/`) — omits `lib/deep-loop/README.md`. Reader following the documented index would miss the deep-loop README. | Add `lib/deep-loop/README.md` to the list. |
| **CLUSTER 5: Description-drift class-of-bug (3 confirmed instances — escalate to full-17 remediation packet, 43% prevalence in N=7 sample)** | | | | |
| DR-025 | iter-04 (cli-devin) | P2 | `feature_catalog/01--executor/03-fallback-router.md:3` + paired playbook L11 — catalog/playbook says "Chooses whether a failed model should fall back to a configured target" but source `lib/deep-loop/fallback-router.ts:31-39` JSDoc says "Resolve the fallback route when a model exhausts its quota pool". | Update catalog + playbook descriptions to align with source-JSDoc emphasis. |
| DR-026 | iter-04 (cli-devin) | P2 | `feature_catalog/05--scoring/01-bayesian-scorer.md:3` + paired playbook L11 — over-specializes general primitive ("executor reliability" vs source "Compute a Bayesian estimate of success probability using Laplace smoothing"). | Update descriptions to reflect general primitive scope. |
| DR-028 | iter-05 (cli-devin) | P2 | `feature_catalog/03--validation/01-post-dispatch-validate.md:3` + paired playbook L11 — narrows description to "appends degraded verification events" but source exports 4 functions of broader scope. | Update descriptions to reflect 4-function scope. |
| **CLUSTER 6: Test-coverage gaps (LOG_ONLY per ADR-004 — separate code-edit-authorized follow-on packet)** | | | | |
| DR-012 | iter-02 (cli-devin) | P1 (LOG_ONLY) | `lib/coverage-graph/coverage-graph-query.ts` ZERO unit coverage. Imported by scripts/convergence.cjs:280 + scripts/query.cjs:107 but no test file imports it. | Author unit test in a code-edit-authorized follow-on packet. |
| DR-013 | iter-02 (cli-devin) | P1 (LOG_ONLY) | `lib/coverage-graph/coverage-graph-signals.ts` ZERO unit coverage. Imported by scripts/convergence.cjs:279 + scripts/status.cjs:103 but no test file imports it. | Author unit test in follow-on packet. |
| DR-014 | iter-02 (cli-devin) | P2 (LOG_ONLY) | `tests/council/multi-seat-dispatch.vitest.ts` WEAK (2 tests / 8 expects / 62 LOC) for parallel dispatch + error + timeout + summary aggregation. | Deepen assertions in follow-on packet. |
| DR-015 | iter-02 (cli-devin) | P2 (LOG_ONLY) | `tests/council/round-state-jsonl.vitest.ts` WEAK (2 tests / 10 expects / 63 LOC) for JSONL state persistence + repair. | Deepen assertions in follow-on packet. |
| **CLUSTER 7: DR-029 supersede record** | | | | |
| DR-029 | iter-06 (cli-devin) | SUPERSEDED | 4-site cross-arc citation drift ("Packet 129/001 ADR-001" → `131/001/008`). Superseded by DR-037 which adds 2 NEW sites/phrases and packages the complete 6-string replacement set. Retained here as a registry pointer. | Apply via DR-037. Mark DR-029 `superseded-by-DR-037` in `findings-registry.json` on next reducer pass. |

### Phase-5 Augmentation Summary

- **Net novel findings merged**: 36 unique (37 emitted; DR-037 supersedes DR-029).
- **Dedupe verdict vs `findings/audit-findings.jsonl`**: 0 overlaps. AF-* findings target SKILL.md frontmatter / sub-readme no-template / changelog naming / LOG_ONLY code passes — structurally orthogonal to DR-* findings which target cross-doc count drift, hidden integration points, council omissions, cross-arc citations, schema-doc fabrications, description drift.
- **Severity rollup**: 0 P0 / 23 P1 / 13 P2 = 36.
- **LOG_ONLY (ADR-004) subset**: 4 (DR-012, DR-013, DR-014, DR-015) — separate code-edit-authorized follow-on packet.
- **Remediation-packet candidates**: 3 (council-omission + cross-arc + schema-doc consolidated; description-drift full-17 sweep; cross-doc consistency batch).
- **Replacement strings ready**: 6 for DR-037 in `research/iterations/iteration-009.md`; complete JSON patch for DR-016 in `research/iterations/iteration-002.md`; 19-surface enumeration for DR-034 in `research/iterations/iteration-007.md`.
- **SC-007 invariant**: held across all 10 iters (`git diff --stat -- 'lib/' 'scripts/' 'tests/' 'storage/'` returns empty).
- **Stop reason**: `discovery-saturation-after-9-iters` (canonical `newInfoRatio < 0.05 for 2 consecutive iters` structurally unreachable; see `research/convergence-summary.md`).

---

<!-- ANCHOR:author-instructions -->
## Author Instructions

**Path conventions:**
- Paths are **relative to the repo root** (e.g., `.opencode/skills/deep-loop-runtime/SKILL.md`), not absolute.
- One path per row. Glob suffixes (`/**`, `/*`) used in §5.5 and §5.7 where every file under the glob received the same Action (Analyzed or LogOnly).

**Action column:** what this packet did to the file. `Analyzed` = read for audit context (phase 2 default); `Updated` = surgical edit applied; `Created` = new file; `Cited` = external doc referenced as anchor; `Validated` = phase-4 validation pass; `LogOnly` = code file read for evidence per ADR-004, no edits permitted.

**Status column:** state at the moment this map was written/updated. `OK` = exists on disk now. `PLANNED` = will be created in a downstream phase. `MISSING` = referenced but absent (no such case at phase-1 baseline). `ABSENT_BY_DESIGN` = decision recorded in ADR (only `assets/` row in this packet).

**Category precedence applied here:**
1. `Specs > Config` — spec-folder JSON belongs to §Specs.
2. `Meta > READMEs` — root-level CLAUDE.md sits under §Meta.
3. `Skills > Documents` — every markdown inside `.opencode/skills/deep-loop-runtime/**` lives in §5.
4. `Tests > Scripts` — vitest files under `tests/` live in §5.7 Code per ADR-004 LOG_ONLY policy (not §7 Scripts).

**Category deletion:**
- §3 Commands and §4 Agents are empty for this packet and intentionally omitted (deep-loop-runtime has no commands or agents of its own — consumed by `deep-review` / `deep-research` / `deep-ai-council` command YAMLs).
- §8 Tests merged into §5.7 Code per ADR-004 (treated as LOG_ONLY alongside lib/).
- Original numbering preserved (§5 Skills, §6 Specs, §7 Scripts, §9 Config, §10 Meta) per template author rule (no renumbering after deletion).

**Phase progression:**
- Phase 1 (baseline): every PENDING row populated; PLANNED rows reserved for downstream creation.
- Phase 2: Note column `audit_status:PENDING` updated to `PASS` / `PASS_WITH_DEVIATIONS` / `FAIL` per artifact. `LOG_ONLY` rows updated with finding count and `defer:follow-on-packet` references.
- Phase 3: README.md row's `audit_status` updated post-rewrite; v1.1.0.0.md row flipped PLANNED → OK.
- Phase 4: per-row validation match% appended to Note column from `validation-report.jsonl`.
- Phase 5: Phase-5 Augmentation section populated from `research/iterations/*.json` merge.

**Size budget:**
- This file is intentionally larger than the 250-LOC suggested cap because the audit scope (79 deep-loop-runtime artifacts) needs row-level visibility for phase 2 dispatch and ADR-004 traceability for code-class LOG_ONLY rows. Glob-grouping is applied where it does not erode that visibility (§5.5 manual testing playbook sub-categories collapsed by directory; §5.7 vitest files collapsed by glob since every file is LOG_ONLY).

**Reference reading:**
- `.opencode/skills/system-spec-kit/templates/README.md` (template architecture)
- `.opencode/skills/system-spec-kit/templates/manifest/resource-map.md.tmpl` (canonical template source)
- `.opencode/skills/system-spec-kit/SKILL.md` §3 Canonical Spec Docs
- `.opencode/skills/sk-doc/references/skill_creation.md` (skill-folder standards)
- `../002-deep-research/resource-map.md` (sibling packet — structural source for this map)
<!-- /ANCHOR:author-instructions -->
