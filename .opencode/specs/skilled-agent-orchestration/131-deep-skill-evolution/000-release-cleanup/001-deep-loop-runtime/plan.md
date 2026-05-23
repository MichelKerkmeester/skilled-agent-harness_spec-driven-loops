---
title: "Implementation Plan: deep-loop-runtime skill release cleanup"
description: "Five sequential phases: spec creation, surgical skill audit (doc-only per ADR-004), README rewrite, blocking alignment validation gate with human approval, deep-research iterations and resource-map merge on cli-devin SWE-1.6. Phase 4 blocks phase 5 until explicit approval."
trigger_phrases:
  - "deep-loop-runtime release cleanup plan"
  - "phase 1 spec creation"
  - "phase 2 skill audit"
  - "phase 3 readme rewrite"
  - "phase 4 alignment validation gate"
  - "phase 5 deep research and merge"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/131-deep-skill-evolution/000-release-cleanup/001-deep-loop-runtime"
    last_updated_at: "2026-05-23T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "phase-1-plan-authored"
    next_safe_action: "run-strict-validate"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000001003"
      session_id: "131-000-001-spec-author"
      parent_session_id: "131-000-001-spec-author"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2 + level3 | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Implementation Plan: deep-loop-runtime skill release cleanup

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (spec docs), JSON Schema (machine contracts), JSONL (state files) |
| **Framework** | sk-doc templates, system-spec-kit validator, cli-devin dispatcher (phase 5), cli-opencode dispatcher (phase 2 auxiliary) |
| **Storage** | Spec folder under `.opencode/specs/.../001-deep-loop-runtime/`; iteration archive under `research/iterations/`; findings under `findings/`; validation under `validation/` |
| **Testing** | Strict validator (`scripts/spec/validate.sh --strict`), `ajv` for schema validation, `rg` for path sweeps, `skill_advisor.py` for advisor parity, `validate_document.py` + `extract_structure.py` for sk-doc conformance |

### Overview

Sequential five-phase workflow. Phase 1 stands up the spec folder, copies schemas from sibling 002, and authors the resource-map. Phase 2 audits the deep-loop-runtime documentation surface surgically against sk-doc templates — code-class findings are LOG_ONLY per ADR-004. Phase 3 rewrites the README to a marketing-leaning HVR voice anchored at ~70% of `Public/README.md` intensity. Phase 4 runs an alignment validation gate and waits for explicit human approval. Phase 5 runs 10 deep-research iterations on cli-devin SWE-1.6 via `/deep:start-research-loop :auto` and merges converged logic gaps into the resource-map.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Problem statement clear and scope documented in `spec.md`
- [x] Success criteria measurable (SC-001 through SC-007)
- [x] Dependencies identified (validator, generate-context.js, skill_graph_compiler.py, cli-devin, cli-opencode for phase-2 auxiliary)
- [x] Toolchain locked (cli-devin SWE-1.6 for phase 5; cli-opencode + deepseek-v4-pro for phase-2 auxiliary)
- [x] Phase boundaries and exit criteria defined
- [x] ADR-004 no-code-edit boundary recorded

### Definition of Done

- [ ] All P0/P1 acceptance criteria met (REQ-001 through REQ-015)
- [ ] Strict validate exits 0 after every phase
- [ ] `checklist.md` fully populated with evidence
- [ ] `implementation-summary.md` filled (no template placeholders)
- [ ] `/memory:save` writes valid continuity update
- [ ] Skill-graph compiler re-run after any `graph-metadata.json` edit
- [ ] Zero code changes to `lib/`, `scripts/`, `tests/`, `storage/` of `.opencode/skills/deep-loop-runtime/` (SC-007)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Sequential phase pipeline with one blocking human-approval gate (phase 4 → 5). State machine externalized to JSONL files validated by JSON Schemas copied from sibling 002 at phase-1 baseline.

### Key Components

- **Spec folder**: Source-of-truth for scope, risks, decisions, schemas, resource-map, validation reports, iteration archive.
- **Target skill**: `.opencode/skills/deep-loop-runtime/` — read in phase 2 audit, surgically edited where documentation deviations found (per ADR-004 no code edits), README rewritten in phase 3, version bumped at end of phase 3.
- **Schemas**: 4 JSON Schemas (audit-finding, changelog-entry, validation-report, iteration-output) — gate every state-file write across phases 2/4/5. Copied verbatim from sibling 002.
- **Validator**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <spec-folder> --strict` — exit 0 at every phase boundary.
- **Phase-2 auxiliary dispatcher**: `cli-opencode --model deepseek/deepseek-v4-pro --variant high` for bulk artifact-vs-template diff work (per CLAUDE.md small-model dispatch matrix + user delegation rule).
- **Phase-5 dispatcher**: `cli-devin --model swe-1.6` per `.opencode/skills/cli-devin/SKILL.md` (RCAF + CLEAR + medium-density pre-planning) and `.opencode/skills/sk-prompt-small-model/SKILL.md` (small-model dispatch matrix).

### Data Flow

```
spec.md + schemas/ ─► resource-map.md (phase 1)
                          │
                          ▼
            findings/audit-findings.jsonl (phase 2) ─► surgical doc edits to deep-loop-runtime/ (NO code)
                                                  │
                                                  └─► code-class findings: defer:follow-on-packet
                          ▼
            README.md rewrite + SKILL.md version bump + changelog v1.1.0.0 (phase 3)
                          │
                          ▼
            validation/validation-report.{md,jsonl} (phase 4) ─► HUMAN APPROVAL GATE (ADR-006)
                          │
                          ▼
            research/iterations/iter-{NN}-cli-devin.json × 10 (phase 5a)
                          │
                          ▼
            research/convergence-summary.md + resource-map.md Phase-5 Augmentation (phase 5b)
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/deep-loop-runtime/SKILL.md` | Skill loader + smart router | Audit + version bump only (1.0.0 → 1.1.0) | `rg -F` path refs + advisor probe |
| `.opencode/skills/deep-loop-runtime/README.md` | Human-facing intro (174 LOC, undersized) | Full rewrite (phase 3) | HVR score ≥85 + 9-section diff vs system-spec-kit/README.md |
| `.opencode/skills/deep-loop-runtime/references/*` (4 files, 732 LOC) | Per-feature deep dives + integration contracts | Surgical audit | Template diff vs `skill_reference_template.md` |
| `.opencode/skills/deep-loop-runtime/assets/` | (absent) | ABSENT_BY_DESIGN per ADR-003 | Single deviation row in validation-report |
| `.opencode/skills/deep-loop-runtime/feature_catalog/**` (18 + index, 1019 LOC) | 7-domain feature inventory + per-feature snippets | Surgical audit | Template diff vs `feature_catalog_creation.md` |
| `.opencode/skills/deep-loop-runtime/manual_testing_playbook/**` (17 + index, 1830 LOC) | Orchestrator-led test prompts | Surgical audit | Template diff vs `manual_testing_playbook_creation.md` |
| `.opencode/skills/deep-loop-runtime/changelog/v*.md` | Version history | Format audit + add v1.1.0.0 | `changelog-entry.schema.json` validation |
| `.opencode/skills/deep-loop-runtime/lib/**` (13 modules, ~4,000 LOC) | Runtime libraries | LOG_ONLY per ADR-004 | `git diff --stat` confirms zero edits |
| `.opencode/skills/deep-loop-runtime/scripts/*` (4 entry points + guard lib) | Runtime helpers consumed by deep-* command YAMLs | LOG_ONLY per ADR-004 | `git diff --stat` confirms zero edits |
| `.opencode/skills/deep-loop-runtime/tests/**` (22 vitest files, 3,651 LOC) | Runtime tests | LOG_ONLY per ADR-004 | `git diff --stat` confirms zero edits |
| `.opencode/skills/deep-loop-runtime/storage/**` | SQLite storage + README | LOG_ONLY per ADR-004 | `git diff --stat` confirms zero edits |
| `.opencode/skills/deep-loop-runtime/graph-metadata.json` | Skill advisor input | Untouched unless edits cascade | `skill_graph_compiler.py --export-json --pretty` rerun if touched |

Required inventories:
- Path references: `rg -F` every file path mentioned in any audited artifact under `.opencode/skills/deep-loop-runtime/` to confirm targets exist.
- MCP tool names: `rg "mcp__" .opencode/skills/deep-loop-runtime/` — every name must resolve to a registered tool in `opencode.json`.
- HVR rule applicability: scan every audited prose paragraph against banned-words / banned-phrase lists from `hvr_rules.md`.
- Cross-system targets named in README rewrite: `deep-research`, `deep-review`, `deep-ai-council`, `system-spec-kit`, `sk-prompt`, `sk-prompt-small-model`, `cli-devin`, `cli-opencode`, `/deep:start-research-loop`, `/deep:start-review-loop`, `/deep:ask-ai-council`.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Initial Spec Creation

- [x] Author `spec.md` (Level 3) with scope, requirements, risks, user stories, complexity.
- [x] Author `decision-record.md` with ADR-001 through ADR-005 + reserved ADR-006/007.
- [x] Author `resource-map.md` with 79-file inventory + LOG_ONLY rows for code + ABSENT_BY_DESIGN row for assets/.
- [x] Author `implementation-summary.md` skeleton.
- [x] Author `checklist.md` with phase-exit blocking rows.
- [x] Author `tasks.md` with T001-T097 across 5 phases.
- [x] Author `plan.md` (this file).
- [x] Copy 4 JSON schemas from sibling 002 into `schemas/`.
- [ ] Run `generate-context.js` to emit `description.json` + `graph-metadata.json`; reapply manual fields.
- [ ] Run `skill_graph_compiler.py` if graph-metadata edited.
- [ ] Validate sample JSON against each of 4 schemas (`ajv`).
- [ ] Run strict validate (exit 0 expected).

### Phase 2: Skill Audit (driven by `resource-map.md`)

- [ ] For each row in resource-map §1 / §5.1-5.6 / §6 / §9: read artifact, diff against sk-doc template, HVR scan, bug scan.
- [ ] For LOG_ONLY rows in §5.7 + §7: read code for evidence; never edit; bugs logged with `status: defer:follow-on-packet` per ADR-004.
- [ ] Emit findings to `findings/audit-findings.jsonl` (one JSON per line, schema-validated).
- [ ] Delegate bulk artifact-vs-template diff work to `cli-opencode + deepseek-v4-pro` via 5 dispatches (SKILL.md, README, references/, feature_catalog/, manual_testing_playbook/).
- [ ] Apply surgical fix for P0/P1 doc-class findings; defer P2 with rationale.
- [ ] Smart Router guard: do NOT edit SKILL.md §2 unless other changes cascade (then ADR-007).
- [ ] README audit defers fixes to phase 3.
- [ ] Changelog audit: format-only; do NOT add new entry yet.
- [ ] Update `resource-map.md` with per-artifact `audit_status` column final values.
- [ ] Author `findings/audit-summary.md` rollup.
- [ ] Verify no code edits via `git diff --stat` filter (SC-007 invariant).
- [ ] Strict validate exits 0.

### Phase 3: README Rewrite

- [ ] Re-read `Public/README.md` (tone anchor) + `system-spec-kit/README.md` (structural anchor).
- [ ] Re-read `hvr_rules.md` + `readme_creation.md`.
- [ ] Extract feature inventory from `feature_catalog/feature_catalog.md` (7 domains: executor, prompt-rendering, validation, state-safety, scoring, coverage-graph, scripts; plus council and storage).
- [ ] Draft outline conforming to 9-section pattern (OVERVIEW, QUICK START, FEATURES with sub-sections, STRUCTURE, CONFIGURATION, USAGE EXAMPLES, TROUBLESHOOTING, FAQ, RELATED).
- [ ] Author frontmatter (title, description, trigger_phrases).
- [ ] Author body section-by-section per `skill_readme_template.md`.
- [ ] Self-score HVR ≥85.
- [ ] Run `validate_document.py --type readme` (exit 0).
- [ ] Author `changelog/v1.1.0.0.md` per `changelog_template.md` + `changelog-entry.schema.json`.
- [ ] Bump `version:` in SKILL.md frontmatter (`1.0.0` → `1.1.0`).
- [ ] Strict validate exits 0.

### Phase 4: Alignment Validation Gate (BLOCKING)

- [ ] For each artifact in scope: classify by `artifact_type`; load matching sk-doc template; run `validate_document.py --json` + `extract_structure.py --json`; compute `conformance_pct`.
- [ ] Emit `validation/validation-report.jsonl` (schema-validated).
- [ ] Add ABSENT_BY_DESIGN row for `assets/` per ADR-003.
- [ ] Author `validation/validation-report.md` (human-readable summary + per-artifact table + deviation rollup).
- [ ] Verify SC-007: zero code changes via `git diff --stat` filter.
- [ ] **STOP. Surface report. Wait for explicit human approval.**
- [ ] Record approval in `decision-record.md` ADR-006 before any phase-5 dispatch.

### Phase 5: Deep Research and Resource-Map Merge

#### Step 5a: 10 iterations (one at a time, SIGKILL between)

- [ ] Read `.opencode/skills/cli-devin/SKILL.md` (mandatory CLI dispatch rule per ADR-002).
- [ ] Read `.opencode/skills/sk-prompt-small-model/SKILL.md` (mandatory small-model dispatch rule).
- [ ] Smoke-test `devin` binary; sweep `/tmp/devin-*` pre-dispatch.
- [ ] Compose iteration prompt-pack from spec.md + audit-findings (summary) + validation-report (summary) + research question.
- [ ] Iters 1-10: `/deep:start-research-loop :auto` with cli-devin SWE-1.6 executor (RCAF + CLEAR + medium-density pre-planning).
- [ ] Between each iter: `pkill -9 -f "devin|codex|opencode"` + sweep `/tmp/devin-*`, `/tmp/deep-research-*` (per `feedback_deep_loop_iter_one_at_a_time` + `feedback_proactive_orphan_cleanup`).
- [ ] Bundle gate per iter: grep internal_imports + smoke-run validation_commands (per `feedback_bundle_gate_smoke_run` + `feedback_cli_devin_bundle_verification`).
- [ ] Convergence: 2 consecutive iters with zero new P0/P1 logic_gaps AND Bayesian scorer confidence ≥0.9, OR iter 10 hard cap.
- [ ] Author `research/convergence-summary.md` with stop reason + per-iter novelty rate.

#### Step 5b: Merge

- [ ] Collect `logic_gaps` from all 10 iteration outputs.
- [ ] Dedupe by `gap_id` + semantic similarity.
- [ ] Drop gaps already in `spec.md` or `findings/audit-findings.jsonl`.
- [ ] Append remaining novel gaps to `resource-map.md` Phase-5 Augmentation section with `Source Iter` links.
- [ ] If empty: explicit single row recording convergence reason + iter count.
- [ ] Escalate any new P0/P1 gap as sub-task (`T-Aux-NN`) in `tasks.md`.
- [ ] Fill `implementation-summary.md` (no template placeholders).
- [ ] Reconcile completion metadata across spec.md / plan.md / checklist.md per CLAUDE.md COMPLETION VERIFICATION rule.
- [ ] Final strict validate exits 0.
- [ ] `/memory:save` writes continuity update.
- [ ] `skill_graph_compiler.py` re-run if metadata touched.
- [ ] `git diff --stat` confirms zero code edits to deep-loop-runtime (SC-007).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Schema validation | Every `*.jsonl` emitted in phases 2/4/5 | `ajv validate -s <schema> -d <jsonl>` |
| Spec-folder strict validate | After every phase boundary | `bash .../scripts/spec/validate.sh <folder> --strict` |
| sk-doc stage-1 validation | After phase 2 + phase 3 + phase 4 per artifact | `python3 .opencode/skills/sk-doc/scripts/validate_document.py --type <type> --json <file>` |
| sk-doc stage-2 structure | After phase 4 per artifact | `python3 .opencode/skills/sk-doc/scripts/extract_structure.py --json <file>` |
| Path-reference sweep | After phase 2 + phase 3 + phase 5 | `rg -F <path>` on every cited file |
| MCP tool-name sweep | After phase 2 + phase 3 | `rg "mcp__" .opencode/skills/deep-loop-runtime/` |
| HVR scoring | After phase-3 README rewrite | Manual rubric per `hvr_rules.md` (threshold ≥85) |
| No-code-edit invariant (SC-007) | After phase 2 + phase 4 + phase 5 | `git diff --stat -- '.opencode/skills/deep-loop-runtime/lib/**' ... ` filter |
| Advisor parity (SC-006) | After phase 5 | `python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py "deep-loop-runtime" --threshold 0.8` |
| Manual playbook spot-check | After phase 5 | Dry-run one entry from `manual_testing_playbook/` |
| Bundle gate per phase-5 iter | After every iter dispatch | grep internal_imports + smoke-run validation_commands |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `bash .../validate.sh --strict` | Internal | Green | All phase exits blocked |
| `node .../generate-context.js` | Internal | Green | Description + graph metadata generation blocked |
| `python3 .../skill_graph_compiler.py` | Internal | Green | Skill advisor stays stale |
| `python3 .../validate_document.py` | Internal | Green | Phase-3 + phase-4 stage-1 validation blocked |
| `python3 .../extract_structure.py` | Internal | Green | Phase-4 stage-2 quality assessment blocked |
| `ajv` CLI | External | Yellow (may need install) | Schema validation falls back to manual check |
| `cli-devin` (`devin` binary + license) | External | Green | Phase 5 blocked |
| `cli-opencode` (`opencode-ai`) | External | Green (1.15.10 installed; smoke-test before phase 2 auxiliary dispatch per `feedback_opencode_1_15_x_instanceref_bug`) | Phase 2 auxiliary dispatches blocked |
| `DEEPSEEK_API_KEY` env | External | Verify before phase 2 auxiliary dispatch | Phase 2 auxiliary cli-opencode + deepseek dispatches blocked |
| `sk-doc` templates | Internal | Green | All phases blocked |
| `hvr_rules.md` | Internal | Green | Phase 3 HVR scoring blocked |
| `.opencode/skills/cli-devin/SKILL.md` | Internal | Green | Phase 5 dispatch invalid without it (CLAUDE.md CLI dispatch rule) |
| `.opencode/skills/sk-prompt-small-model/SKILL.md` | Internal | Green | Phase 5 small-model dispatch invalid without it |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Phase-4 gate denied by human; Smart Router accidentally broken; phase-5 iter discovers ship-blocking P0 in already-edited doc artifact; SC-007 invariant violated (any code edit lands).
- **Procedure**: Spec folder writes are additive + append-only state files; revert via `git checkout HEAD -- .opencode/skills/deep-loop-runtime/<file>` for skill edits. Spec folder itself can be deleted wholesale if the packet is abandoned (no other packet depends on its outputs).

### Pre-deployment Checklist

- [ ] Backup not required (all changes tracked in git; spec folder additive)
- [ ] Feature flag not applicable (documentation/process work, no runtime gate)
- [ ] Monitoring not applicable

### Rollback Procedure

1. For doc regressions: `git diff --stat .opencode/skills/deep-loop-runtime/` → `git checkout HEAD~N -- <files>` where N = commits since baseline.
2. For SC-007 violation (accidental code edit): `git checkout HEAD -- <code-path>` and re-run audit to confirm no other code-class edits leaked.
3. For spec-folder abandonment: `rm -rf .opencode/specs/.../001-deep-loop-runtime/` + remove `children_ids` entry from parent `graph-metadata.json` + re-run `skill_graph_compiler.py`.
4. Verify advisor still surfaces deep-loop-runtime at threshold 0.8 after any rollback.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Spec Creation) ──► Phase 2 (Skill Audit) ──► Phase 3 (README Rewrite) ──► Phase 4 (Validation Gate) ━━HUMAN━━► Phase 5 (Deep Research + Merge)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1 | None | Phase 2, 3, 4, 5 |
| Phase 2 | Phase 1 (resource-map drives dispatch list) | Phase 3, 4, 5 |
| Phase 3 | Phase 2 (audit findings inform README context; defer-to-phase-3 README findings get fixed in rewrite) | Phase 4, 5 |
| Phase 4 | Phase 3 (full surface ready for validation) | Phase 5 |
| Phase 5 | Phase 4 (gate passed + human approval via ADR-006) | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1 (Spec Creation) | Med | 2-3 hours |
| Phase 2 (Skill Audit) | High | 3-5 hours (~55 doc artifacts in scope + LOG_ONLY pass on 23 code files) |
| Phase 3 (README Rewrite) | Med | 2-3 hours |
| Phase 4 (Validation Gate) | Low | 1-2 hours (mechanical) |
| Phase 5 (10 iterations + merge) | High | 2.5-4 hours (≤15 min × 10 iters cli-devin SWE-1.6 + 30 min merge) |
| **Total** | | **10.5-17 hours wall-clock** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [ ] All commits up to phase-3 end on `main` (no feature branch — per user preference `feedback_stay_on_main_no_feature_branches`).
- [ ] Snapshot via `git rev-parse HEAD` recorded at phase-1, phase-3, phase-4 exits in `implementation-summary.md` for reference.

### Rollback Procedure

1. **Doc-edit regression**: `git revert <commit-sha>` for the offending phase commit; re-run strict validate; re-run `skill_graph_compiler.py` if graph-metadata changed.
2. **SC-007 violation (accidental code edit)**: HARD BLOCKER. `git checkout HEAD -- <code-path>` + audit log entry; do not proceed.
3. **Spec-folder abandonment**: see §7 above.
4. **Phase-5 partial-iteration archive**: leave under `research/iterations/` for forensics; do not delete.

### Data Reversal

- **Has data migrations?** No.
- **Reversal procedure**: N/A.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│   Phase 1        │───►│   Phase 2        │───►│   Phase 3        │───►│   Phase 4        │═══►│   Phase 5        │
│   Spec Creation  │    │   Skill Audit    │    │   README Rewrite │    │   Validation     │    │   Deep Research  │
└──────────────────┘    └──────────────────┘    └──────────────────┘    └────────┬─────────┘    └──────────────────┘
                                                                                  │
                                                                          HUMAN APPROVAL
                                                                          (ADR-006 gate)
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| spec.md + schemas + resource-map | None | Artifact inventory + state contracts | Phase 2, 3, 4, 5 |
| findings/audit-findings.jsonl | resource-map.md | Findings ledger (doc-class fixable + code-class deferred) | Phase 3 context, Phase 4 inputs |
| README rewrite + changelog v1.1.0.0 | findings/audit-findings.jsonl | Final user-facing surface | Phase 4 validation scope |
| validation/validation-report.{md,jsonl} | All phase-3 outputs | Per-artifact pass/fail + human approval | Phase 5 |
| research/iterations/*.json | validation-report + ADR-006 | Logic-gap candidates | Phase 5b merge |
| resource-map.md Phase-5 Augmentation | research/iterations | Final state | Packet completion |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Phase 1 (Spec Creation)** — 2-3 hours — CRITICAL (everything depends on schemas + resource-map)
2. **Phase 2 (Skill Audit)** — 3-5 hours — CRITICAL (drives phase 3 + 4 scope; LOG_ONLY discipline preserves SC-007)
3. **Phase 3 (README Rewrite)** — 2-3 hours — CRITICAL (phase 4 validates final surface)
4. **Phase 4 (Validation Gate)** — 1-2 hours — CRITICAL (gates phase 5 with human approval)
5. **Phase 5 (10 iters + merge)** — 2.5-4 hours — CRITICAL (final deliverable)

**Total Critical Path**: 10.5-17 hours wall-clock

**Parallel Opportunities**:
- Inside Phase 1: spec.md, plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md skeleton may be authored in any order. Schemas + resource-map depend on spec.md scope being final.
- Inside Phase 2: 5 audit dispatches (SKILL.md, README, references/, feature_catalog/, manual_testing_playbook/) may proceed in parallel by file class when delegated to cli-opencode + deepseek-v4-pro — but per `feedback_cli_dispatch_unreliability` practical ceiling is 1-2 concurrent on this Mac.
- Inside Phase 5: NOT parallelizable — iterations strictly one at a time on this Mac (per `feedback_deep_loop_iter_one_at_a_time`).
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Phase 1 spec folder ready | Strict validate exits 0; all 4 schemas validate samples | End of phase 1 |
| M2 | Phase 2 audit complete | `findings/audit-findings.jsonl` populated; P0/P1 doc resolved or deferred; code-class LOG_ONLY logged | End of phase 2 |
| M3 | Phase 3 README + changelog shipped | HVR score ≥85; SKILL.md version bumped to 1.1.0 | End of phase 3 |
| M4 | Phase 4 gate passed | `validation-report.md` posted; ADR-006 recorded human approval | End of phase 4 |
| M5 | Phase 5 complete | 10 iters archived; resource-map Phase-5 Augmentation updated; `/memory:save` written; SC-007 confirmed (zero code edits) | End of phase 5 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

The 5 plan-time ADRs live in `decision-record.md`:
- **ADR-001**: Documentation Level 3 doc set
- **ADR-002**: All-cli-devin SWE-1.6 phase-5 toolchain (10 iterations, not split)
- **ADR-003**: Accept absence of `assets/` directory as documented deviation
- **ADR-004**: Surgical-edit policy with hard no-code-edit boundary
- **ADR-005**: `resource-map.md` as the single canonical map (no YAML mirror)

ADR-006 is added at phase 4 → 5 transition recording explicit human approval. ADR-007 is only authored if Smart Router needs editing during phase 2.

---

## RELATED DOCUMENTS

- **Specification**: `spec.md`
- **Task Breakdown**: `tasks.md`
- **Verification Checklist**: `checklist.md`
- **Decision Records**: `decision-record.md`
- **Resource Map**: `resource-map.md`
- **Schemas**: `schemas/audit-finding.schema.json`, `schemas/changelog-entry.schema.json`, `schemas/validation-report.schema.json`, `schemas/iteration-output.schema.json`
- **Implementation Summary**: `implementation-summary.md` (post-implementation)
- **Sibling Plan**: `../002-deep-research/plan.md` (structural template; differs on toolchain split)
- **CLI dispatch contract**: `.opencode/skills/cli-devin/SKILL.md` (mandatory pre-read per ADR-002 for phase 5)
- **Small-model dispatch matrix**: `.opencode/skills/sk-prompt-small-model/SKILL.md` (mandatory pre-read per ADR-002 for phase 5)
- **Phase-2 auxiliary dispatcher**: `.opencode/skills/cli-opencode/SKILL.md` (deepseek/deepseek-v4-pro direct API routing)
