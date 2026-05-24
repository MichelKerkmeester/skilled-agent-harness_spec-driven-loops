---
title: "Implementation Plan: deep-agent-improvement skill release cleanup"
description: "Five sequential phases: spec creation, surgical skill audit, README rewrite, blocking alignment validation gate with human approval, deep-research iterations and resource-map merge. Phase 4 blocks phase 5 until explicit approval."
trigger_phrases:
  - "deep-agent-improvement release cleanup plan"
  - "phase 1 spec creation"
  - "phase 2 skill audit"
  - "phase 3 readme rewrite"
  - "phase 4 alignment validation gate"
  - "phase 5 deep research and merge"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/131-deep-skill-evolution/000-release-cleanup/005-deep-agent-improvement"
    last_updated_at: "2026-05-23T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "phase-1-plan-authored"
    next_safe_action: "author-tasks-checklist-decision-record"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000005003"
      session_id: "131-000-005-spec-author"
      parent_session_id: "131-000-005-spec-author"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2 + level3 | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Implementation Plan: deep-agent-improvement skill release cleanup

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (spec docs), YAML (resource map), JSON Schema (machine contracts), JSONL (state files) |
| **Framework** | sk-doc templates, system-spec-kit validator, cli-devin SWE-1.6 dispatcher |
| **Storage** | Spec folder under `.opencode/specs/.../005-deep-agent-improvement/`; iteration archive under `research/iterations/` |
| **Testing** | Strict validator (`scripts/spec/validate.sh --strict`), `ajv` for schema validation, `rg` for path sweeps, `node --check` for script syntax, `skill_advisor.py` for advisor parity |

### Overview

Sequential five-phase workflow. Phase 1 stands up the spec folder, schemas, and `resource-map.yaml`. Phase 2 audits the deep-agent-improvement skill surgically against sk-doc templates. Phase 3 rewrites the README. Phase 4 runs an alignment validation gate and waits for explicit human approval. Phase 5 runs 10 deep-research iterations on cli-devin SWE-1.6 (breadth 1-6, adjudication 7, synthesis 8-10) and merges converged logic gaps into `resource-map.yaml`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Problem statement clear and scope documented in `spec.md`
- [x] Success criteria measurable (SC-001 through SC-006)
- [x] Dependencies identified (cli-devin SWE-1.6, validator presence, skill_graph_compiler)
- [x] Toolchain locked (cli-devin SWE-1.6 mixed-executor per skill methodology)
- [x] Phase boundaries and exit criteria defined

### Definition of Done

- [ ] All P0/P1 acceptance criteria met
- [ ] Strict validate exits 0 after every phase
- [ ] `checklist.md` fully populated with evidence
- [ ] `implementation-summary.md` filled (no template placeholders)
- [ ] `/memory:save` writes valid continuity update
- [ ] Skill-graph compiler re-run after any `graph-metadata.json` edit
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Sequential phase pipeline with one blocking human-approval gate (phase 4 → 5). State machine externalized to JSONL files validated by JSON Schemas authored in phase 1. Mirrors the proven sibling `002-deep-research` packet, diverging only on resource-map format (`.yaml`) and phase-5 toolchain (cli-devin SWE-1.6 mixed-executor).

### Key Components

- **Spec folder**: Source-of-truth for scope, risks, decisions, schemas, resource-map, validation reports, iteration archive.
- **Target skill**: `.opencode/skills/deep-agent-improvement/` — read in phase 2 audit, surgically edited where deviations found, README rewritten in phase 3, version bumped at end of phase 3.
- **Schemas**: 4 JSON Schemas (audit-finding, changelog-entry, validation-report, iteration-output) that gate every state-file write across phases 2-5.
- **Validator**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <spec-folder> --strict` — exit 0 at every phase boundary.
- **Dispatcher (phase 5)**: `cli-devin --model swe-1.6` per `.opencode/skills/cli-devin/SKILL.md` (RCAF + CLEAR + medium-density pre-planning) and `.opencode/skills/sk-prompt-small-model/SKILL.md`; mixed-executor breadth/adjudication/synthesis split per `deep-agent-improvement/references/mixed_executor_methodology.md`.

### Data Flow

```
spec.md + schemas/ ─► resource-map.yaml (phase 1)
                          │
                          ▼
            audit-findings.jsonl (phase 2) ─► surgical edits to deep-agent-improvement/
                          │
                          ▼
            README.md rewrite + changelog v1.7.0.0 (phase 3)
                          │
                          ▼
            validation-report.{md,jsonl} (phase 4) ─► HUMAN APPROVAL GATE (ADR-006)
                          │
                          ▼
            research/iterations/iter-{NN}-{executor}.json × 10 (phase 5a)
                          │
                          ▼
            convergence-summary.md + resource-map.yaml phase5_augmentation (phase 5b)
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/deep-agent-improvement/SKILL.md` | Skill loader + smart router (~545 LOC) | Audit + version bump | `rg -F` path refs + advisor probe |
| `.opencode/skills/deep-agent-improvement/README.md` | Human-facing intro (~410 LOC) | Full rewrite (phase 3) | HVR score >=85 + section diff vs system-spec-kit/README.md |
| `.opencode/skills/deep-agent-improvement/references/*` (15 files) | Per-feature deep dives | Surgical audit | Template diff vs `skill_reference_template.md` |
| `.opencode/skills/deep-agent-improvement/assets/*` (9 files) | Charter/strategy/config + benchmark fixtures/profile | Surgical audit | Template diff vs `skill_asset_template.md`; JSON validity for `*.json`/`*.jsonc` |
| `.opencode/skills/deep-agent-improvement/feature_catalog/**` (14 files) | Inventory + per-feature snippets | Surgical audit | Template diff vs `feature_catalog_template.md` |
| `.opencode/skills/deep-agent-improvement/manual_testing_playbook/**` (39 files) | Orchestrator-led test prompts | Surgical audit | Template diff vs `manual_testing_playbook_template.md` |
| `.opencode/skills/deep-agent-improvement/changelog/v*.md` (10 files) | Version history | Format audit + add v1.7.0.0 | `changelog-entry.schema.json` validation |
| `.opencode/skills/deep-agent-improvement/scripts/*` (14 cjs + lib/ + tests/) | Runtime helpers | Bug-scan only | `node --check` syntax + `rg -F` path refs |
| `.opencode/skills/deep-agent-improvement/graph-metadata.json` | Skill advisor input | Untouched unless edits cascade | `skill_graph_compiler.py --export-json --pretty` rerun if touched |

Required inventories:
- Path references: `rg -F` every file path mentioned in any artifact under `.opencode/skills/deep-agent-improvement/` to confirm targets exist.
- MCP tool names: `rg "mcp__" .opencode/skills/deep-agent-improvement/` — every name must resolve to a registered tool in `opencode.json`.
- HVR rule applicability: scan every prose paragraph against banned-words / banned-phrase lists from `hvr_rules.md`.
- Cross-system targets named in README rewrite: `/improve:agent`, `@deep-agent-improvement` (4 runtime mirrors), `deep-loop-runtime`, `deep-research`, `deep-review`, `system-spec-kit`, `sk-doc`, `sk-prompt`, `cli-devin`, `cli-codex`, `system-skill-advisor` (advisor routing).
- README structure currency: confirm §5 STRUCTURE + §6 SCRIPTS list all 15 references and all 14 scripts (current README undercounts both).
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Initial Spec Creation

- [x] Author `spec.md` (Level 3) with scope, requirements, risks, user stories, complexity.
- [ ] Author `plan.md` (this file).
- [ ] Author `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md` skeleton.
- [ ] Author `resource-map.yaml` with full artifact inventory (~110 rows).
- [ ] Author 4 JSON schemas in `schemas/`.
- [ ] Run `generate-context.js` to emit `description.json` + `graph-metadata.json`; reapply manual fields; verify parent `children_ids` + `last_active_child_id`.
- [ ] Run strict validate (exit 0 expected).
- [ ] Run `skill_graph_compiler.py` if graph-metadata edited.

### Phase 2: Skill Audit (driven by `resource-map.yaml`)

- [ ] For each row in resource-map: read artifact, diff against sk-doc template, HVR scan, bug scan.
- [ ] Emit findings to `audit-findings.jsonl` (one JSON per line, schema-validated).
- [ ] Apply surgical fix for P0/P1 findings; defer P2 with rationale.
- [ ] Smart Router guard: do NOT edit SKILL.md §2 unless other changes cascade (then ADR-005).
- [ ] README audit defers fixes to phase 3 (record the stale §5/§6 structure + §3 numbering gap as findings).
- [ ] Changelog audit: format-only; do NOT add new entry yet.
- [ ] Update `resource-map.yaml` `audit_status` per row.
- [ ] Strict validate exits 0.

### Phase 3: README Rewrite

- [ ] Re-read `Public/README.md` (tone anchor) + `system-spec-kit/README.md` (structural anchor).
- [ ] Re-read `hvr_rules.md` + `readme_creation.md` + `skill_readme_template.md`.
- [ ] Extract feature inventory from `feature_catalog/feature_catalog.md` and 3 sub-categories.
- [ ] Rewrite `.opencode/skills/deep-agent-improvement/README.md` in place per `skill_readme_template.md` (correct §5/§6 to 15 references + 14 scripts; fix §3 numbering).
- [ ] Self-score HVR >=85.
- [ ] Author `changelog/v1.7.0.0.md` per `changelog_template.md` + `changelog-entry.schema.json`.
- [ ] Bump `version:` in SKILL.md frontmatter (`1.6.0.0` → `1.7.0.0`).
- [ ] Strict validate exits 0.

### Phase 4: Alignment Validation Gate (BLOCKING)

- [ ] For each artifact in scope: reload sk-doc template, diff structure, score template-match %.
- [ ] Emit `validation-report.jsonl` (schema-validated).
- [ ] Author `validation-report.md` (human-readable summary + per-artifact table).
- [ ] **STOP. Surface report. Wait for explicit human approval.**
- [ ] Record approval in `decision-record.md` ADR-006 before any phase-5 dispatch.

### Phase 5: Deep Research and Resource-Map Merge

#### Step 5a: 10 iterations (one at a time, SIGKILL between)

- [ ] Read `.opencode/skills/cli-devin/SKILL.md` + `.opencode/skills/sk-prompt-small-model/SKILL.md` (CLI + small-model dispatch rules).
- [ ] Read `deep-agent-improvement/references/mixed_executor_methodology.md` for the breadth/adjudication/synthesis split.
- [ ] Iters 1-6: `cli-devin --model swe-1.6` (RCAF) — breadth exploration.
- [ ] Iter 7: `cli-devin --model swe-1.6` — adjudication / false-positive filter pass.
- [ ] Iters 8-10: synthesis on confirmed findings only (cli-devin SWE-1.6; optional cli-codex synthesis pass if approved at the phase-4 gate).
- [ ] Between each iter: `pkill -9 -f "codex|opencode"` + sweep `/tmp/codex-*`, `/tmp/deep-research-*` (devin + `/tmp/devin-*` preserved per operator rule).
- [ ] Convergence: 2 consecutive iters with `delta_vs_prev_iter == "no new gaps"` AND zero new P0/P1 logic_gaps, OR iter 10.

#### Step 5b: Merge

- [ ] Collect `logic_gaps` from all 10 iteration outputs.
- [ ] Dedupe by `gap_id` + semantic similarity.
- [ ] Drop gaps already in `spec.md` or `audit-findings.jsonl`.
- [ ] Append remaining novel gaps to `resource-map.yaml` `phase5_augmentation`.
- [ ] Escalate any new P0/P1 gap as sub-task in `tasks.md`; re-run validate.
- [ ] Fill `implementation-summary.md` (no template placeholders).
- [ ] Final strict validate exits 0.
- [ ] `/memory:save` writes continuity update.
- [ ] `skill_graph_compiler.py` re-run.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Schema validation | Every `*.jsonl` emitted in phases 2/4/5 | `ajv validate -s <schema> -d <jsonl>` (or manual check) |
| Spec-folder strict validate | After every phase boundary | `bash .../scripts/spec/validate.sh <folder> --strict` |
| Path-reference sweep | After phase 2 + phase 3 + phase 5 | `rg -F <path>` on every cited file |
| MCP tool-name sweep | After phase 2 + phase 3 | `rg "mcp__" .opencode/skills/deep-agent-improvement/` |
| Script syntax | After phase 2 bug-scan | `node --check <script.cjs>` |
| HVR scoring | After phase-3 README rewrite | Manual rubric per `hvr_rules.md` |
| Advisor parity | After phase 5 | `python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py "improve an agent" --threshold 0.8` |
| Manual playbook spot-check | After phase 5 | Dry-run one entry from `manual_testing_playbook/` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `bash .../validate.sh` | Internal | Green | All phase exits blocked |
| `node .../generate-context.js` | Internal | Green | Description + graph metadata generation blocked |
| `python3 .../skill_graph_compiler.py` | Internal | Green | Skill advisor stays stale |
| `ajv` CLI | External | Yellow (may need install) | Schema validation falls back to manual check |
| `cli-devin` (`devin` binary) + SWE-1.6 | External | Verify before phase 5 | Phase 5 blocked |
| `sk-doc` templates | Internal | Green | Phase 1/2/3/4 all blocked |
| `hvr_rules.md` | Internal | Green | Phase 3 HVR scoring blocked |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Phase-4 gate denied by human; Smart Router accidentally broken; phase-5 iter discovers ship-blocking P0 in already-edited artifact.
- **Procedure**: Spec folder writes are append-only state files plus a small set of created docs; revert via `git checkout HEAD -- .opencode/skills/deep-agent-improvement/<file>` for skill edits. Spec folder itself can be deleted wholesale if the packet is abandoned (no other packet depends on its outputs).

### Pre-deployment Checklist

- [ ] Backup not required (all changes tracked in git; spec folder additive)
- [ ] Feature flag not applicable (documentation/process work, no runtime gate)
- [ ] Monitoring not applicable

### Rollback Procedure

1. For skill regressions: `git diff --stat .opencode/skills/deep-agent-improvement/` → `git checkout HEAD~N -- <files>` where N = commits since baseline.
2. For spec-folder abandonment: `rm -rf .../005-deep-agent-improvement/` + leave parent `graph-metadata.json` `children_ids` entry (already present) or remove it + re-run `skill_graph_compiler.py`.
3. Verify advisor still surfaces deep-agent-improvement at threshold 0.8 after any rollback.
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
| Phase 2 | Phase 1 (resource-map) | Phase 3, 4, 5 |
| Phase 3 | Phase 2 (audit findings inform README context) | Phase 4, 5 |
| Phase 4 | Phase 3 (full surface ready for validation) | Phase 5 |
| Phase 5 | Phase 4 (gate passed + human approval) | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1 (Spec Creation) | Med | 2-3 hours |
| Phase 2 (Skill Audit) | High | 5-7 hours (~110 artifacts) |
| Phase 3 (README Rewrite) | Med | 2-3 hours |
| Phase 4 (Validation Gate) | Low | 1-2 hours (mechanical) |
| Phase 5 (10 iterations + merge) | High | 3-5 hours (<=15 min × 10 + merge) |
| **Total** | | **13-20 hours wall-clock** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [ ] All commits up to phase-3 end on `main` (no feature branch — per `feedback_stay_on_main_no_feature_branches`).
- [ ] Snapshot via `git rev-parse HEAD` recorded at phase-1, phase-3, phase-4 exits in `implementation-summary.md` for reference.

### Rollback Procedure

1. **Skill-edit regression**: `git revert <commit-sha>` for the offending phase commit; re-run strict validate; re-run `skill_graph_compiler.py` if graph-metadata changed.
2. **Spec-folder abandonment**: see §7 above.
3. **Phase-5 partial-iteration archive**: leave under `research/iterations/` for forensics; do not delete.

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
| spec.md + schemas + resource-map.yaml | None | Artifact inventory + state contracts | Phase 2, 3, 4, 5 |
| audit-findings.jsonl | resource-map.yaml | Findings ledger | Phase 3 context, Phase 4 inputs |
| README rewrite + changelog v1.7.0.0 | audit-findings.jsonl | Final user-facing surface | Phase 4 validation scope |
| validation-report.{md,jsonl} | All phase-3 outputs | Per-artifact pass/fail + human approval | Phase 5 |
| research/iterations/*.json | validation-report + ADR-006 | Logic-gap candidates | Phase 5b merge |
| resource-map.yaml phase5_augmentation | research/iterations | Final state | Packet completion |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Phase 1 (Spec Creation)** — 2-3 hours — CRITICAL (everything depends on schemas + resource-map)
2. **Phase 2 (Skill Audit)** — 5-7 hours — CRITICAL (drives phase 3 + 4 scope)
3. **Phase 3 (README Rewrite)** — 2-3 hours — CRITICAL (phase 4 validates final surface)
4. **Phase 4 (Validation Gate)** — 1-2 hours — CRITICAL (gates phase 5)
5. **Phase 5 (10 iters + merge)** — 3-5 hours — CRITICAL (final deliverable)

**Total Critical Path**: 13-20 hours wall-clock

**Parallel Opportunities**:
- Inside Phase 1: spec.md, plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md skeleton may be authored in any order. Schemas + resource-map depend on spec.md scope being final.
- Inside Phase 2: audit of references/, assets/, feature_catalog/, manual_testing_playbook/ may proceed in parallel by file class.
- Inside Phase 5: NOT parallelizable — iterations strictly one at a time on this Mac.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Phase 1 spec folder ready | Strict validate exits 0; all 4 schemas validate samples | End of phase 1 |
| M2 | Phase 2 audit complete | `audit-findings.jsonl` populated, P0/P1 resolved or deferred | End of phase 2 |
| M3 | Phase 3 README + changelog shipped | HVR score >=85; SKILL.md version bumped | End of phase 3 |
| M4 | Phase 4 gate passed | `validation-report.md` posted; ADR-006 recorded human approval | End of phase 4 |
| M5 | Phase 5 complete | 10 iters archived; resource-map phase5_augmentation updated; `/memory:save` written | End of phase 5 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

The plan-time ADRs live in `decision-record.md`:
- **ADR-001**: cli-devin SWE-1.6 phase-5 toolchain (breadth + adjudication + synthesis per skill mixed-executor methodology)
- **ADR-002**: Surgical-edit policy across phases 2-3
- **ADR-003**: `resource-map.yaml` machine-readable single source of truth (DIVERGES from sibling 002's `resource-map.md`)
- **ADR-004**: Smart Router preservation default (SKILL.md §2 untouched unless cascade required)

ADR-005 may be added at phase 2 if Smart Router needs editing. ADR-006 is added at phase 4 → 5 transition recording explicit human approval.
