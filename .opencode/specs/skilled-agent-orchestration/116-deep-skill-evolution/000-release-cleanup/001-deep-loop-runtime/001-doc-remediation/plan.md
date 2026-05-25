---
title: "Implementation Plan: deep-loop-runtime doc-remediation"
description: "4 sequential cli-devin SWE-1.6 RCAF dispatch batches (A consolidated cleanup, B description drift, C council expansion, D test coverage) closing all 36 Phase 5 findings."
trigger_phrases:
  - "deep-loop-runtime doc-remediation plan"
  - "batch a consolidated"
  - "batch b description drift"
  - "batch c council expansion"
  - "batch d test coverage"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/116-deep-skill-evolution/000-release-cleanup/001-deep-loop-runtime/001-doc-remediation"
    last_updated_at: "2026-05-23T22:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "phase-1-plan-authored"
    next_safe_action: "author-tasks-checklist-decision-record-summary"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000131000602"
      session_id: "131-000-001-001-doc-remediation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2 | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: deep-loop-runtime doc-remediation

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (doc edits), JSON (graph-metadata, schemas), TypeScript (vitest in Batch D) |
| **Framework** | sk-doc templates, validate.sh strict, cli-devin SWE-1.6 RCAF dispatcher |
| **Storage** | This packet under `001-deep-loop-runtime/001-doc-remediation/`; per-batch prompts under `prompts/`; per-batch logs under `logs/` |
| **Testing** | Strict validator (`validate.sh --strict`), `validate_document.py --type readme`, `pnpm vitest run`, `skill_graph_compiler.py` |

### Overview

Sequential 4-batch workflow on cli-devin SWE-1.6. Phase 1 stands up this Level 2 packet folder. Phase 2 dispatches Batch A → B → C → D one-at-a-time with SIGKILL between, per-batch SC-007 invariant verification, per-batch strict validate on the parent. Phase 3 closes the packet with changelog v1.2.0.0.md, SKILL.md version bump, skill_graph_compiler rerun, parent docs reconciliation, `/memory:save`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Parent Phase 5 synthesis complete with replacement-string packages ready
- [x] sk-doc templates verified present
- [x] cli-devin binary verified (v2026.5.6-12) + Phase 5 demonstrated 90s/batch baseline
- [x] SC-007 partial relaxation scope locked (tests/ permitted, others prohibited)
- [x] Batch sequencing locked (A→B→C→D)

### Definition of Done

- [ ] All 36 findings closed or deferred with rationale
- [ ] Strict validate exits 0 on packet + parent
- [ ] `pnpm vitest run` exits 0 on Batch D test files
- [ ] SC-007 invariant verified: lib/scripts/storage/reduce-state diff empty
- [ ] README HVR score ≥85 post-Batch-A
- [ ] `skill_advisor.py` surfaces skill at threshold 0.8
- [ ] SKILL.md version `1.2.0`, changelog v1.2.0.0.md present
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Sequential 4-batch cli-devin dispatch. Each batch carries: RCAF prompt + medium-density pre-plan + bundle gate + per-batch SC-007 check + per-batch strict validate on parent. State machine: `prompts/batch-{A,B,C,D}-prompt.md` + `logs/batch-{A,B,C,D}-{stdout,stderr}.txt`.

### Data Flow

```
spec.md + tasks.md (finding→edit rows)
            │
            ▼
Phase 1 strict validate on packet + parent
            │
            ▼
Batch A: cli-devin SWE-1.6 RCAF prompt → 22 findings closed in 6 doc files
            │
            ▼ (SC-007 check + strict validate on parent + SIGKILL cleanup)
Batch B: cli-devin SWE-1.6 → ≤17 description drifts surveyed, fixes applied
            │
            ▼ (SC-007 check + strict validate + cleanup)
Batch C: cli-devin SWE-1.6 → 12 new files + 7 existing-file updates for council expansion
            │
            ▼ (SC-007 check + per-file validate_document.py + strict validate + cleanup)
Batch D: cli-devin SWE-1.6 → 2 new + 2 updated vitest files; pnpm vitest exit 0
            │
            ▼ (SC-007 partial check: tests/ ONLY non-doc path; strict validate + cleanup)
Phase 3 closeout: changelog v1.2.0.0.md + SKILL.md version bump + skill_graph_compiler.py + parent doc reconciliation + /memory:save
```

### Key Components

- **cli-devin SWE-1.6**: `devin --print --prompt-file <path> --model swe-1.6 --permission-mode auto -p </dev/null` per `cli-devin/SKILL.md`
- **RCAF prompt-pack**: Role / Context / Pre-plan (medium-density 3-4 steps) / Action / Format. NO verbose bundle-gate wording (SWE-1.6 anti-pattern per `cli-devin/SKILL.md` §3)
- **Bundle gate**: per-batch grep verify of internal_imports + smoke-run validation_commands per `feedback_bundle_gate_smoke_run`
- **Sk-doc templates**: `feature_catalog_creation.md` + `manual_testing_playbook_creation.md` consumed by Batch C verbatim
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Spec folder creation

- [x] Author `spec.md` (Level 2)
- [x] Author `plan.md` (this file)
- [ ] Author `tasks.md` with finding→edit rows
- [ ] Author `checklist.md` with per-batch exit gates
- [ ] Author `decision-record.md` with 4 ADRs
- [ ] Author `implementation-summary.md` skeleton
- [x] Copy schemas from parent
- [ ] Author `description.json` + `graph-metadata.json`
- [ ] Run `validate.sh --strict` exits 0 on packet + parent

### Phase 2: 4 cli-devin SWE-1.6 RCAF dispatches

#### Batch A — Consolidated cleanup
- [ ] Compose `prompts/batch-a-prompt.md` (RCAF + medium-density pre-plan)
- [ ] Dispatch via Bash to `devin --print ...`
- [ ] Capture stdout/stderr to `logs/`
- [ ] Bundle gate: grep verify + smoke-run
- [ ] Verify SC-007: `git diff --stat -- lib/ scripts/ storage/ reduce-state.cjs` empty
- [ ] Run `validate.sh --strict` on packet + parent
- [ ] Mark closed findings in tasks.md
- [ ] SIGKILL cleanup before Batch B

#### Batch B — Description-drift sweep
- [ ] Compose `prompts/batch-b-prompt.md`
- [ ] Dispatch + capture
- [ ] Bundle gate
- [ ] SC-007 check
- [ ] strict validate
- [ ] Mark closed
- [ ] SIGKILL cleanup before Batch C

#### Batch C — Council surface expansion
- [ ] Compose `prompts/batch-c-prompt.md` (templates pasted verbatim)
- [ ] Dispatch + capture
- [ ] Bundle gate
- [ ] Run `validate_document.py` per new feature_catalog + playbook file
- [ ] SC-007 check
- [ ] strict validate
- [ ] Mark closed
- [ ] SIGKILL cleanup before Batch D

#### Batch D — Test coverage gaps
- [ ] Compose `prompts/batch-d-prompt.md`
- [ ] Dispatch + capture
- [ ] Run `pnpm vitest run <4 files>` exit 0
- [ ] SC-007 partial check: tests/ ONLY non-doc path
- [ ] strict validate
- [ ] Mark closed

### Phase 3: Closeout

- [ ] Author `changelog/v1.2.0.0.md` per `changelog-entry.schema.json`
- [ ] Bump `SKILL.md` frontmatter `version: 1.1.0` → `1.2.0`
- [ ] Run `skill_graph_compiler.py --export-json --pretty`
- [ ] Run `validate_document.py --type readme` on `README.md`
- [ ] Final strict validate on packet + parent
- [ ] Fill `implementation-summary.md`
- [ ] Update parent `resource-map.md` Phase-5 Augmentation: mark findings `[closed]`
- [ ] Update parent `implementation-summary.md` §1 Phase-5 paragraph
- [ ] `/memory:save` writes continuity update
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Strict spec validate | After every batch + final | `bash .../validate.sh <folder> --strict` |
| Per-doc validate | After Batch A + final | `validate_document.py --type readme` |
| Per-file template validate | After Batch C | `validate_document.py` per new catalog/playbook file |
| Vitest | After Batch D | `pnpm vitest run <4 test files>` |
| SC-007 invariant | After every batch | `git diff --stat` on prohibited paths |
| Bundle gate | After every batch | `rg -F` on cited paths; smoke-run commands |
| Skill advisor parity | After Phase 3 | `skill_advisor.py "deep-loop-runtime" --threshold 0.8` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Status | Impact if Blocked |
|------------|--------|-------------------|
| `cli-devin` binary v2026.5.6-12 | Green | All 4 batches blocked |
| `validate.sh --strict` | Green | Per-batch gates blocked |
| `validate_document.py` | Green | Batch C per-file gates blocked |
| `skill_graph_compiler.py` | Green | Phase 3 closeout blocked |
| `pnpm vitest run` | Green | Batch D verification blocked |
| Parent `iteration-007.md` + `iteration-009.md` replacement strings | Green | Batch A blocked |
| sk-doc `feature_catalog_creation.md` + `manual_testing_playbook_creation.md` templates | Green | Batch C blocked |
| Parent `001-deep-loop-runtime/` folder validates (tolerant phase-parent) | Green at plan time | Parent strict-validate gate blocked |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any batch produces SC-007 violation, OR strict validate fails after a batch, OR Batch D test fails.
- **Procedure**:
  1. Per-file: `git checkout HEAD -- <offending-file>` to revert
  2. Per-batch: `git restore --staged .` to unstage; verify diff returns to pre-batch state; re-compose prompt with tighter ground-truth pre-pass
  3. Per-packet: `rm -rf .opencode/specs/.../001-doc-remediation/` + `git checkout HEAD -- .opencode/skills/deep-loop-runtime/` to wholesale revert

### Pre-deployment Checklist

- [ ] Backup not required (all changes in git working tree; revertible)
- [ ] No feature flag, no monitoring (doc + test packet)
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Batch A ──► Batch B ──► Batch C ──► Batch D ──► Phase 3 (Closeout)
```

| Stage | Depends On | Blocks |
|-------|------------|--------|
| Phase 1 | None | All batches |
| Batch A | Phase 1 | Batches B/C/D |
| Batch B | Batch A | Batches C/D |
| Batch C | Batch B (graph-metadata fixes consumed by new catalog files) | Batch D |
| Batch D | Batch C | Phase 3 |
| Phase 3 | Batch D | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Stage | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1 (Setup) | Low | ~30 min authoring |
| Batch A | Med | ~3-5 min dispatch + verify |
| Batch B | Med | ~3-5 min dispatch + verify |
| Batch C | Med-High | ~5-7 min dispatch + per-file validate |
| Batch D | Med-High | ~5-8 min dispatch + vitest run |
| Phase 3 (Closeout) | Low | ~10-15 min |
| **Total** | | **~30-45 min wall-clock** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [ ] All work committed-on-main per `feedback_stay_on_main_no_feature_branches`
- [ ] Snapshot `git rev-parse HEAD` recorded at Phase 1 exit + per-batch exit for forensic trace

### Rollback Procedure

1. **Single-batch regression**: `git diff --stat .opencode/skills/deep-loop-runtime/` to scope changes; `git checkout HEAD~N -- <files>` where N = commits since the batch landed
2. **SC-007 violation in Batches A/B/C**: HARD BLOCKER. `git checkout HEAD -- <code-path>` immediately; document deviation in tasks.md; do NOT proceed to next batch
3. **Batch D test failure**: revert the failing test file with `git checkout`; document gap; do NOT touch `lib/` to "fix the test"
4. **Wholesale packet abandonment**: `rm -rf .opencode/specs/.../001-doc-remediation/` + revert any skill edits via `git checkout HEAD~N`; remove `children_ids` entry from parent graph-metadata.json
<!-- /ANCHOR:enhanced-rollback -->
