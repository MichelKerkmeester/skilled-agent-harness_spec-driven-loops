---
title: "Implementation Plan: Verification + Changelog + Closeout"
description: "Plan for running the full verification sweep, authoring the deep-review v1.4.0.0 changelog + deep-loop-runtime initial release, dropping the deferred 116/008 resource-map, flipping parent status to Complete, and landing the single closeout commit."
trigger_phrases:
  - "118/008 plan"
  - "118 closeout plan"
  - "deep-review v1.4.0.0 plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/131-deep-skill-evolution/003-deep-loop-runtime/009-verification-changelog-closeout"
    last_updated_at: "2026-05-22T19:55:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Scaffolded three-phase plan."
    next_safe_action: "Confirm phase 007 PASS, then execute T001 (Phase 1 setup)."
    blockers: []
    completion_pct: 5
    key_files:
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:1180080080080080080080080080080080080080080080080080080080080001"
      session_id: "118-008-verification-changelog-closeout-scaffold"
      parent_session_id: null
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

# Implementation Plan: Verification + Changelog + Closeout

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash, Python 3 (alignment-drift), Node.js (generate-context.js, vitest), Markdown (docs) |
| **Test Runner** | `pnpm vitest run` (full sweep) |
| **Validation** | `validate.sh --recursive --strict` |
| **Verification Scripts** | `verify_alignment_drift.py`, generate-context.js |

### Overview

Phase 008 is non-code: the work is verification, documentation, metadata refresh, and a single closeout commit. The plan follows three phases that mirror the canonical Level 2 template: (1) Setup gathers preconditions and confirms phase 007 PASS; (2) Implementation runs the four verification commands, authors the two SKILL.md/changelog pairs, drops the deferred resource-map, and flips parent status; (3) Verification reruns strict-validate after all writes, captures the evidence in implementation-summary.md, and lands the closeout commit. Every file authored sits inside the resolved scope listed in spec.md §3.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 007 PASS confirmed (vitest green from prior phase)
- [ ] `deep-loop-runtime/SKILL.md` scaffold from phase 001 exists
- [ ] `sk-doc/assets/changelog_template.md` read
- [ ] Worktree clean for the affected scope (deep-review, deep-loop-runtime, 116/008, 118 parent)

### Definition of Done
- [ ] All four verification commands PASS with evidence captured
- [ ] `deep-review/SKILL.md` version 1.4.0.0 + changelog authored
- [ ] `deep-loop-runtime/SKILL.md` finalized + initial changelog authored
- [ ] `131-deep-skill-evolution/002-deep-review/008-playbooks-and-default-calibration/resource-map.md` authored at post-118 paths
- [ ] Parent spec.md Status = `Complete; 8/8 children shipped`
- [ ] Parent + 8 child `graph-metadata.json` refreshed via `generate-context.js`
- [ ] Single closeout commit landed on `main`
- [ ] implementation-summary.md populated with verification evidence
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Verification-first closeout — no new feature code. Three deterministic clusters:

1. **Verification cluster**: run four commands; capture stdout, exit codes, finding counts; surface failures rather than mask.
2. **Documentation cluster**: bump deep-review version, author two changelogs, author resource-map.
3. **Reconciliation cluster**: flip parent status, refresh graph metadata, populate implementation-summary, land closeout commit.

### Key Components

- **Verification scripts**: `pnpm vitest run`, `verify_alignment_drift.py`, `validate.sh`, `grep`.
- **Doc templates**: `sk-doc/assets/changelog_template.md` (compact vs. expanded selection).
- **Metadata refresher**: `node .opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js`.
- **Commit gate**: standard `sk-git` conventional-commit pattern; one commit captures everything.

### Data Flow

1. Read phase 007 implementation-summary.md to confirm PASS state.
2. Run vitest, alignment-drift x2, validate.sh, grep — capture each into `_scratch_verification.log` for paste-in.
3. Author deep-review version bump + changelog (compact format expected — single dependency change).
4. Author deep-loop-runtime SKILL.md finalize + initial changelog.
5. Author 116/008 resource-map referencing post-118 file paths.
6. Flip parent spec.md Status field.
7. Run `generate-context.js` against parent + each child folder.
8. Populate this phase's implementation-summary.md with command outputs + commit SHA placeholder.
9. Strict-validate the entire 118 phase parent recursively as the gate.
10. Commit with conventional message: `docs(118/008): closeout — deep-review v1.4.0.0 + deep-loop-runtime initial + resource-map + status Complete`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm phase 007 PASS (read `../007-test-migration/implementation-summary.md`)
- [ ] Read `sk-doc/assets/changelog_template.md` to pick compact vs. expanded format
- [ ] Verify `deep-loop-runtime/SKILL.md` scaffold exists (phase 001 output)
- [ ] Confirm worktree clean for affected scope; capture baseline `git status`

### Phase 2: Implementation
- [ ] Run `pnpm vitest run`; capture exit code + failure count
- [ ] Run `verify_alignment_drift.py --root .opencode/skills/deep-loop-runtime`; capture findings
- [ ] Run `verify_alignment_drift.py --root .opencode/commands/speckit/assets`; capture findings
- [ ] Run `validate.sh --recursive --strict` against 118 phase parent; capture exit code
- [ ] Run consumer grep; verify zero hits outside `specs/`
- [ ] Bump `deep-review/SKILL.md` frontmatter `version: 1.3.3.0` -> `1.4.0.0`
- [ ] Author `deep-review/changelog/v1.4.0.0.md` per `sk-doc/assets/changelog_template.md`
- [ ] Finalize `deep-loop-runtime/SKILL.md` (fill phase 001 placeholders; lock version)
- [ ] Author `deep-loop-runtime/changelog/v0.1.0.md` initial release entry
- [ ] Author `131-deep-skill-evolution/002-deep-review/008-playbooks-and-default-calibration/resource-map.md`
- [ ] Update 118 parent `spec.md` Status -> `Complete; 8/8 children shipped`
- [ ] Run `generate-context.js` against parent + each child folder

### Phase 3: Verification
- [ ] Re-run `validate.sh --recursive --strict` after all writes (gate)
- [ ] Populate implementation-summary.md with command outputs + commit SHA placeholder
- [ ] Mark every P0/P1 checklist item with evidence
- [ ] Stage all closeout paths (explicit list, not `git add -A`)
- [ ] Land single closeout commit on `main`
- [ ] Backfill implementation-summary.md commit SHA from `git log -1`
- [ ] Sanity-grep `mcp__mk_spec_memory__deep_loop_graph_` outside `specs/` post-commit (must be zero)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Sweep | Full repo vitest run | `pnpm vitest run` |
| Static | Alignment-drift across runtime + spec_kit assets | `verify_alignment_drift.py` |
| Spec | Recursive strict-validate of 118 phase parent | `validate.sh --recursive --strict` |
| Consumer scan | MCP tool reference grep outside `specs/` | `grep -rE` |
| Manual | Resource-map path resolution (ls each cited path) | `ls`, `find` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 007 PASS | Internal | Pending | Cannot start verification sweep |
| `deep-loop-runtime/SKILL.md` scaffold (phase 001) | Internal | Pending | Cannot finalize SKILL.md |
| `sk-doc/assets/changelog_template.md` | External (skill) | Green | Cannot author changelogs without template |
| `verify_alignment_drift.py` | External (sk-code) | Green | Cannot run alignment check |
| `validate.sh --recursive --strict` | External (system-spec-kit) | Green | Cannot run spec-folder gate |
| `generate-context.js` | External (system-spec-kit) | Green | Cannot refresh graph metadata |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Closeout commit reveals regression (vitest fails after commit, alignment-drift surfaces drift, strict-validate fails post-write).
- **Procedure**: `git reset --soft HEAD~1` to peel back the commit while keeping changes staged; triage the failing check; either patch in same commit window or split into a remediation packet under the arc.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──> Phase 2 (Implementation) ──> Phase 3 (Verification)
   |                       |                            |
   read 007 summary        run 4 commands               re-run strict-validate
   read template           author docs                  populate summary
   confirm scaffold        refresh metadata             commit + sanity grep
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 007 PASS | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | None (closeout) |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 10 minutes |
| Implementation - verification commands | Low | 15 minutes |
| Implementation - changelogs + SKILL bumps | Medium | 45 minutes |
| Implementation - resource-map + metadata | Medium | 30 minutes |
| Verification + commit | Low | 15 minutes |
| **Total** | | **~115 minutes** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] `git status` baseline captured before any write
- [ ] Worktree clean for affected scope
- [ ] All authored paths listed in explicit `git add` block (no `-A`)

### Rollback Procedure
1. **Immediate**: `git reset --soft HEAD~1` to peel commit while keeping changes
2. **Triage**: Identify failing verification command; capture full output
3. **Patch path**: In-scope fixes go in the same commit window; out-of-scope drift opens a remediation packet under `118/`
4. **Revert path** (last resort): `git restore --staged .` + `git checkout HEAD -- <paths>` to undo all writes
5. **Verify**: Re-run strict-validate to confirm tree restored

### Data Reversal
- **Has data migrations?** No (verification + doc-only phase).
- **Reversal procedure**: N/A — all changes are markdown / JSON metadata / version-string edits, fully reversible via `git`.
<!-- /ANCHOR:enhanced-rollback -->
