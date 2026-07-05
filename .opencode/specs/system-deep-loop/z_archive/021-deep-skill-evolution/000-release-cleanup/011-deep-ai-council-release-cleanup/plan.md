---
title: "Implementation Plan: deep-ai-council skill release cleanup"
description: "Five sequential phases: spec creation, surgical skill audit, README rewrite, blocking alignment validation gate with human approval, deep-research iterations and resource-map merge. Phase 4 blocks phase 5 until explicit approval."
trigger_phrases:
  - "deep-ai-council release cleanup plan"
  - "phase 1 spec creation"
  - "phase 2 skill audit"
  - "phase 3 readme rewrite"
  - "phase 4 alignment validation gate"
  - "phase 5 deep research and merge"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/116-deep-skill-evolution/000-release-cleanup/004-deep-ai-council"
    last_updated_at: "2026-05-23T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "phase-1-plan-authored"
    next_safe_action: "author-tasks-checklist-decision-record"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000004003"
      session_id: "131-000-004-spec-author"
      parent_session_id: "131-000-004-spec-author"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2 + level3 | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Implementation Plan: deep-ai-council skill release cleanup

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (spec docs), JSON Schema (machine contracts), JSONL (state files), YAML (resource map) |
| **Framework** | sk-doc templates, system-spec-kit validator, cli-devin dispatcher, native `/deep:start-research-loop` |
| **Storage** | Spec folder under `.../004-deep-ai-council/`; iteration archive under `research/iterations/` |
| **Testing** | Strict validator (`scripts/spec/validate.sh --strict`), `ajv` for schema validation, `rg` for path sweeps, `skill_advisor.py` for advisor parity |

### Overview

Sequential five-phase workflow. Phase 1 stands up the spec folder, schemas, and `resource-map.yaml`. Phase 2 audits the deep-ai-council skill surgically against sk-doc templates. Phase 3 rewrites the README. Phase 4 runs an alignment validation gate and waits for explicit human approval. Phase 5 runs 10 deep-research iterations (all cli-devin SWE-1.6, per skill workflows, orchestrated by the native loop) and merges converged logic gaps into `resource-map.yaml`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Problem statement clear and scope documented in `spec.md`
- [x] Success criteria measurable (SC-001 through SC-006)
- [x] Dependencies identified (devin reachable, validator presence, sk-doc templates)
- [x] Toolchain locked (cli-devin SWE-1.6 for all phase-5 iterations)
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

Sequential phase pipeline with one blocking human-approval gate (phase 4 → 5). State machine externalized to JSONL files validated by JSON Schemas authored in phase 1.

### Key Components

- **Spec folder**: Source-of-truth for scope, risks, decisions, schemas, resource-map, validation reports, iteration archive.
- **Target skill**: `.opencode/skills/deep-ai-council/` — read in phase 2 audit, surgically edited where deviations found, README rewritten in phase 3, version bumped at end of phase 3.
- **Schemas**: 4 JSON Schemas (audit-finding, changelog-entry, validation-report, iteration-output) that gate every state-file write across phases 2-5.
- **Validator**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <spec-folder> --strict` — exit 0 at every phase boundary.
- **Dispatcher (phase 5)**: `cli-devin --model swe-1.6` per `.opencode/skills/cli-devin/SKILL.md` (RCAF + CLEAR + medium-density pre-planning), consulted alongside `sk-prompt-models`. The deep-research loop itself is orchestrated by the native runtime (`/deep:start-research-loop` + `@deep-research`); cli-devin is the per-iteration executor inside that loop.

### Data Flow

```
spec.md + schemas/ ─► resource-map.yaml (phase 1)
                          │
                          ▼
            audit-findings.jsonl (phase 2) ─► surgical edits to deep-ai-council/
                          │
                          ▼
            README.md rewrite + changelog v2.1.0.0 (phase 3)
                          │
                          ▼
            validation-report.{md,jsonl} (phase 4) ─► HUMAN APPROVAL GATE (ADR-006)
                          │
                          ▼
            research/iterations/iter-{NN}-cli-devin.json × 10 (phase 5a)
                          │
                          ▼
            convergence-summary.md + resource-map.yaml phase_5_augmentation (phase 5b)
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/deep-ai-council/SKILL.md` | Skill loader + smart router (§3) | Audit + version bump | `rg -F` path refs + advisor probe |
| `.opencode/skills/deep-ai-council/README.md` | Human-facing intro | Full rewrite (phase 3) | HVR score ≥85 + section diff vs system-spec-kit/README.md |
| `.opencode/skills/deep-ai-council/references/*` (11) | Per-feature deep dives | Surgical audit | Template diff vs `skill_reference_template.md` |
| `.opencode/skills/deep-ai-council/feature_catalog/**` (32) | Per-feature inventory | Surgical audit | Standard diff vs `feature_catalog_creation.md` |
| `.opencode/skills/deep-ai-council/manual_testing_playbook/**` (33) | Orchestrator-led test prompts | Surgical audit | Standard diff vs `manual_testing_playbook_creation.md` |
| `.opencode/skills/deep-ai-council/changelog/v*.md` (5) | Version history | Format audit + add v2.1.0.0 | `changelog-entry.schema.json` validation |
| `.opencode/skills/deep-ai-council/scripts/**` (16) | Runtime helpers + lib + tests | Bug-scan only | `node -c` / `bash -n` syntax + path refs (sk-code/opencode standards) |
| `.opencode/skills/deep-ai-council/graph-metadata.json` | Skill advisor input | Untouched unless edits cascade | `skill_graph_compiler.py --export-json --pretty` rerun if touched |

Required inventories:
- Path references: `rg -F` every file path mentioned in any artifact under `.opencode/skills/deep-ai-council/` to confirm targets exist.
- MCP tool names: `rg "mcp__\|council_graph_" .opencode/skills/deep-ai-council/` — every name must resolve to a registered tool.
- HVR rule applicability: scan every prose paragraph against banned-words / banned-phrase lists from `hvr_rules.md`.
- Cross-system targets named in README rewrite: `deep-research`, `deep-review`, `deep-loop-runtime`, `system-spec-kit`, `@orchestrate`, `@deep-ai-council` runtime mirrors (OpenCode/Claude/Codex), `council_graph_*` MCP tool family, the `cli-*` skill family, `/deep:ask-ai-council`.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Initial Spec Creation

- [x] Author `spec.md` (Level 3) with scope, requirements, risks, user stories, complexity.
- [ ] Author `plan.md` (this file).
- [ ] Author `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md` skeleton.
- [ ] Author `resource-map.yaml` with full artifact inventory (~100 rows).
- [ ] Author 4 JSON schemas in `schemas/`.
- [ ] Hand-author `description.json` + `graph-metadata.json` (mirror sibling 002; do NOT run generate-context.js — protects parent wiring).
- [ ] Run strict validate (exit 0 expected).
- [ ] `memory_index_scan({ specFolder })` to index without regenerating metadata.

### Phase 2: Skill Audit (driven by `resource-map.yaml`)

- [ ] For each row in resource-map: read artifact, diff against sk-doc template, HVR scan, bug scan.
- [ ] Verify each phase-1 candidate-drift item against the actual template + file before logging (false-positive-P0 discipline).
- [ ] Emit findings to `audit-findings.jsonl` (one JSON per line, schema-validated).
- [ ] Apply surgical fix for P0/P1 findings; defer P2 with rationale.
- [ ] Smart Router guard: do NOT edit SKILL.md §3 unless other changes cascade (then ADR-005).
- [ ] README audit defers fixes to phase 3.
- [ ] Changelog audit: format-only; do NOT add new entry yet.
- [ ] Update `resource-map.yaml` `audit_status` per artifact.
- [ ] Strict validate exits 0.

### Phase 3: README Rewrite

- [ ] Re-read `Public/README.md` (tone anchor) + `system-spec-kit/README.md` (structural anchor).
- [ ] Re-read `hvr_rules.md` + `readme_creation.md`.
- [ ] Extract feature inventory from `feature_catalog/**` (32 entries across 9 categories).
- [ ] Rewrite `.opencode/skills/deep-ai-council/README.md` in place per `skill_readme_template.md`.
- [ ] Self-score HVR ≥85.
- [ ] Author `changelog/v2.1.0.0.md` per sk-doc changelog convention + `changelog-entry.schema.json`.
- [ ] Bump `version:` in SKILL.md frontmatter (`2.0.0.0` → `2.1.0.0`).
- [ ] Strict validate exits 0.

### Phase 4: Alignment Validation Gate (BLOCKING)

- [ ] For each artifact in scope: reload sk-doc template, diff structure, score template-match %.
- [ ] Emit `validation-report.jsonl` (schema-validated).
- [ ] Author `validation-report.md` (human-readable summary + per-artifact table).
- [ ] **STOP. Surface report. Wait for explicit human approval.**
- [ ] Record approval in `decision-record.md` ADR-006 before any phase-5 dispatch.

### Phase 5: Deep Research and Resource-Map Merge

#### Step 5a: 10 iterations (one at a time, devin-preserving sweep between)

- [ ] Verify `devin` reachable + authenticated (`devin --print` smoke-test).
- [ ] Read `.opencode/skills/cli-devin/SKILL.md` (CLI dispatch rule) + `.opencode/skills/sk-prompt-models/SKILL.md` (small-model dispatch rule) before composing any prompt.
- [ ] Define per-iteration output schema (`schemas/iteration-output.schema.json`) and convergence criteria (below) BEFORE running.
- [ ] Iters 1-10: `cli-devin --model swe-1.6` (RCAF + CLEAR + medium-density pre-planning) → `research/iterations/iter-NN-cli-devin.json`.
- [ ] Between each iter: kill `codex|opencode|deep-research-{runner,monitor}|gtimeout` orphans + `rm /tmp/{codex,deep-research,opencode,save-context}-*`; PRESERVE `devin --print` + `/tmp/devin-*` (per "kill for all except devin").
- [ ] Convergence: 2 consecutive iters with `delta_vs_prev_iter == "no new gaps"` AND zero new P0/P1 logic_gaps, OR iter 10.

#### Step 5b: Merge

- [ ] Collect `logic_gaps` from all 10 iteration outputs.
- [ ] Dedupe by `gap_id` + semantic similarity.
- [ ] Drop gaps already in `spec.md` or `audit-findings.jsonl`.
- [ ] Append remaining novel gaps to `resource-map.yaml` `phase_5_augmentation`.
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
| Schema validation | Every `*.jsonl` emitted in phases 2/4/5 | `ajv validate -s <schema> -d <jsonl>` |
| Spec-folder strict validate | After every phase boundary | `bash .../scripts/spec/validate.sh <folder> --strict` |
| Path-reference sweep | After phase 2 + phase 3 + phase 5 | `rg -F <path>` on every cited file |
| MCP tool-name sweep | After phase 2 + phase 3 | `rg "mcp__\|council_graph_" .opencode/skills/deep-ai-council/` |
| HVR scoring | After phase-3 README rewrite | Manual rubric per `hvr_rules.md` |
| Advisor parity | After phase 5 | `python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py "run a deep ai council" --threshold 0.8` |
| Manual playbook spot-check | After phase 5 | Dry-run one entry from `manual_testing_playbook/` |
| Script syntax | After phase 2 bug-scan | `node -c <file>.cjs` / `bash -n <file>.sh` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `bash .../validate.sh` | Internal | Green | All phase exits blocked |
| `python3 .../skill_graph_compiler.py` | Internal | Green | Skill advisor stays stale |
| `ajv` CLI | External | Yellow (may need install) | Schema validation falls back to manual check |
| `cli-devin` (`devin` binary) | External | Verify before phase 5 | Phase 5 blocked entirely |
| `sk-doc` templates | Internal | Green | Phase 1/2/3/4 all blocked |
| `hvr_rules.md` | Internal | Green | Phase 3 HVR scoring blocked |
| `cli-devin/SKILL.md` + `sk-prompt-models/SKILL.md` | Internal | Green | Phase 5 prompt composition blocked (mandatory read) |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Phase-4 gate denied by human; Smart Router accidentally broken; phase-5 iter discovers ship-blocking P0 in already-edited artifact.
- **Procedure**: Spec folder writes are append-only state files plus a small set of created docs; revert via `git checkout HEAD -- .opencode/skills/deep-ai-council/<file>` for skill edits. Spec folder itself can be deleted wholesale if the packet is abandoned (no other packet depends on its outputs).

### Pre-deployment Checklist

- [ ] Backup not required (all changes tracked in git; spec folder additive)
- [ ] Feature flag not applicable (documentation/process work, no runtime gate)
- [ ] Monitoring not applicable

### Rollback Procedure

1. For skill regressions: `git diff --stat .opencode/skills/deep-ai-council/` → `git checkout HEAD~N -- <files>` where N = commits since baseline.
2. For spec-folder abandonment: `rm -rf .../004-deep-ai-council/` — note the parent `graph-metadata.json` already lists 004; leave the parent untouched (re-adding/removing the child entry is out of scope and risks clobbering siblings).
3. Verify advisor still surfaces deep-ai-council at threshold 0.8 after any rollback.
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
| Phase 2 (Skill Audit) | High | 4-6 hours (~100 artifacts incl. scripts bug-scan) |
| Phase 3 (README Rewrite) | Med | 2-3 hours |
| Phase 4 (Validation Gate) | Low | 1-2 hours (mechanical) |
| Phase 5 (10 iterations + merge) | High | 3-5 hours (≤15 min × 10 + merge) |
| **Total** | | **12-19 hours wall-clock** |
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
| README rewrite + changelog v2.1.0.0 | audit-findings.jsonl | Final user-facing surface | Phase 4 validation scope |
| validation-report.{md,jsonl} | All phase-3 outputs | Per-artifact pass/fail + human approval | Phase 5 |
| research/iterations/*.json | validation-report + ADR-006 | Logic-gap candidates | Phase 5b merge |
| resource-map.yaml phase_5_augmentation | research/iterations | Final state | Packet completion |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Phase 1 (Spec Creation)** — 2-3 hours — CRITICAL (everything depends on schemas + resource-map)
2. **Phase 2 (Skill Audit)** — 4-6 hours — CRITICAL (drives phase 3 + 4 scope)
3. **Phase 3 (README Rewrite)** — 2-3 hours — CRITICAL (phase 4 validates final surface)
4. **Phase 4 (Validation Gate)** — 1-2 hours — CRITICAL (gates phase 5)
5. **Phase 5 (10 iters + merge)** — 3-5 hours — CRITICAL (final deliverable)

**Total Critical Path**: 12-19 hours wall-clock

**Parallel Opportunities**:
- Inside Phase 1: spec.md, plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md skeleton may be authored in any order. Schemas + resource-map depend on spec.md scope being final.
- Inside Phase 2: audit of references/, feature_catalog/, manual_testing_playbook/, scripts/ may proceed in parallel by file class.
- Inside Phase 5: NOT parallelizable — iterations strictly one at a time on this Mac.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Phase 1 spec folder ready | Strict validate exits 0; all 4 schemas validate samples | End of phase 1 |
| M2 | Phase 2 audit complete | `audit-findings.jsonl` populated, P0/P1 resolved or deferred | End of phase 2 |
| M3 | Phase 3 README + changelog shipped | HVR score ≥85; SKILL.md version bumped | End of phase 3 |
| M4 | Phase 4 gate passed | `validation-report.md` posted; ADR-006 recorded human approval | End of phase 4 |
| M5 | Phase 5 complete | 10 iters archived; resource-map phase_5_augmentation updated; `/memory:save` written | End of phase 5 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

The plan-time ADRs live in `decision-record.md`:
- **ADR-001**: All-cli-devin SWE-1.6 phase 5 (10 iterations, native-orchestrated loop)
- **ADR-002**: Surgical-edit policy across phases 2-3
- **ADR-003**: Machine-readable `resource-map.yaml` (operator-directed; diverges from sibling 002's `resource-map.md`)
- **ADR-004**: Smart Router preservation default (SKILL.md §3 untouched unless cascade required)

ADR-005 may be added at phase 2 if Smart Router needs editing. ADR-006 is added at phase 4 → 5 transition recording explicit human approval.
