---
title: "Implementation Plan: Align sk-doc numbering by coordinating with the live concurrent migration"
description: "Gate-then-verify coordination plan: document the target aligned sk-doc numbering end-state now, then defer any alignment check or git execution until the concurrent sk-doc migration session commits and the working tree is clean."
trigger_phrases:
  - "sk-doc numbering alignment plan"
  - "sk-doc concurrent migration gate"
  - "sk-doc working tree clean verification"
  - "sk-doc archive gap coordination"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/000-migration-from-soa-and-cleanup/004-sk-doc-alignment"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored gate-then-verify coordination plan"
    next_safe_action: "Re-run sk-doc git status after concurrent commit"
    blockers:
      - "sk-doc tree dirty from concurrent migration (929 paths: 926 D + 3 untracked, mtime to 07:52); no git-mv/rm until clean."
    key_files:
      - ".opencode/specs/sk-doc/z_archive/"
      - ".opencode/specs/sk-doc/015-sk-doc-parent/"
      - ".opencode/specs/sk-doc/016-hub-doc-conformance-fixes/"
      - ".opencode/specs/sk-doc/030-benchmark-authoring-centralization/"
      - ".opencode/specs/sk-doc/031-sk-doc-router-alignment/"
      - ".opencode/specs/sk-doc/032-hyphen-naming-convention/"
      - ".opencode/specs/sk-doc/033-create-diff-mode/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Close 014 gap via archive renumber, or leave intentionally open?"
      - "Is 016->030 a reserved range, or should it renumber contiguously?"
    answered_questions: []
---
# Implementation Plan: Align sk-doc numbering by coordinating with the live concurrent migration

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown spec-kit documentation only; no source code is authored or changed. |
| **Framework** | `system-spec-kit` templates (`templates/manifest/*.md.tmpl`) and `scripts/spec/validate.sh`. |
| **Storage** | None - git-tracked markdown files under this packet folder only. |
| **Testing** | `validate.sh --strict` for this packet's own docs; `git status --porcelain` as the coordination gate check. |

### Overview
This phase is coordination and verification-scoped, not execution-scoped. It documents the observed current state of `.opencode/specs/sk-doc` (archive contiguity, active packet numbering, the `014` gap, tracked vs. untracked directories) and the target aligned end-state, then defers any alignment check or git action to a future pass that only proceeds after the concurrent sk-doc migration session commits and `git status --porcelain -- .opencode/specs/sk-doc` returns zero lines. No file under `.opencode/specs/sk-doc` is read-write touched by this plan; every command used to gather evidence was read-only (`git status`, `git ls-files`, `ls`, `find`, `git log`).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented in `spec.md`.
- [x] Success criteria measurable (SC-001 through SC-003 in `spec.md`).
- [x] Dependency identified: the concurrent sk-doc migration session must commit before verification can proceed.

### Definition of Done
- [x] Target aligned end-state documented, including both valid resolutions for the `014` gap and the `016`→`030` jump.
- [x] Hard gate stated prominently in `spec.md` and this plan.
- [ ] `git status --porcelain -- .opencode/specs/sk-doc` re-checked and confirmed clean (deferred - concurrent session still in flight).
- [ ] Final on-disk sk-doc numbering compared against the documented target end-state (deferred - blocked on the item above).
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Gate-then-verify coordination: observe → document target end-state → hard gate on external commit → re-observe → compare → report. Not applicable: MVC/MVVM/Clean Architecture patterns, since no application code is involved.

### Key Components
- **Baseline evidence pass (this phase, complete)**: `git status --porcelain -- .opencode/specs/sk-doc`, `ls`/`find` over `z_archive` and active top-level folders, `git ls-files` per active folder, and `git log -1` to timestamp the last landed sk-doc commit.
- **Hard gate (standing, enforced going forward)**: no git-mv/rm may be proposed or run against `.opencode/specs/sk-doc` while `git status --porcelain -- .opencode/specs/sk-doc` is non-empty.
- **Deferred verification pass (future, not yet run)**: re-run the same evidence commands once the concurrent session commits, and compare the result to the two documented target end-states.

### Data Flow
Read repo state (git/ls/find) → record as evidence with exact commands in `spec.md`/this plan → hold at the hard gate → re-read repo state once the concurrent session lands → diff against the documented target end-state → report the match or escalate a LOGIC-SYNC if neither documented end-state fits.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/specs/sk-doc/z_archive/001`-`013` | Contiguous historical record | Unchanged - observe only | `ls .opencode/specs/sk-doc/z_archive` confirms `001`-`013`, no `014`. |
| `.opencode/specs/sk-doc/{015,016,030,031,032,033}` | Active packets, mixed tracked/untracked | Unchanged - observe only | `git ls-files -- .opencode/specs/sk-doc/<dir>` per folder: `015`=456, `016`=38, `030`=0, `031`=0, `032`=1110, `033`=0. |
| `.opencode/specs/sk-doc` working tree | Currently dirty from a concurrent migration | Unchanged - no mutation proposed | `git status --porcelain -- .opencode/specs/sk-doc` = 929 lines (926 `D`, 3 `??`). |

Required inventories:
- Same-class producers: `git status --porcelain -- .opencode/specs/sk-doc | awk '{print $1}' | sort | uniq -c` → `926 D`, `3 ??`.
- Consumers of changed symbols: none - this phase changes no code, so no downstream consumer of sk-doc packet numbering (skill-advisor graph, `generate-context.js`, spec-kit graph traversal) is exercised or touched.
- Matrix axes: archived vs. active; tracked vs. untracked; contiguous vs. gapped numbering.
- Algorithm invariant: no git mutation against `.opencode/specs/sk-doc` may be proposed or executed while `git status --porcelain -- .opencode/specs/sk-doc` is non-empty.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Scaffold this coordination packet (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`).
- [x] Capture baseline `git status --porcelain -- .opencode/specs/sk-doc` evidence: 929 dirty paths (926 `D`, 3 `??`), newest mtime `2026-07-16 07:52:46`.
- [x] Capture baseline archive/active directory listing evidence via `ls`, `find`, and `git ls-files`.

### Phase 2: Core Implementation
- [ ] Wait for the concurrent session to commit its sk-doc renumbering.
- [ ] Re-run `git status --porcelain -- .opencode/specs/sk-doc` and confirm zero output.
- [ ] Diff the final on-disk sk-doc numbering against the two documented target end-states (`014` gap closed vs. intentionally retained; `016`→`030` reserved range vs. renumbered contiguously).

### Phase 3: Verification
- [ ] Record the verified final sk-doc numbering state with command evidence.
- [ ] Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/004-sk-doc-alignment --strict` for this packet's own docs.
- [ ] Hand off verification evidence for a future `implementation-summary.md` (not authored in this scaffold phase).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Coordination gate | sk-doc working tree cleanliness | `git status --porcelain -- .opencode/specs/sk-doc` |
| Spec validation | This packet's own four docs | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <folder> --strict` |
| Manual | Compare final numbering to the documented target end-state | `ls`, `find`, `git ls-files` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Concurrent sk-doc migration session | External/concurrent session | In progress - tree dirty (929 paths) as of 2026-07-16 | Alignment verification cannot start; this phase stays at documentation-only completion. |
| `system-spec-kit` `validate.sh` | Internal tool | Available | Low risk - script exists and is used by the reference Level 2 packet cited in `checklist.md`. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any future step in this packet accidentally proposes a git-mv/rm against `.opencode/specs/sk-doc` before the tree is clean.
- **Procedure**: Do not run the proposed command. Re-check `git status --porcelain -- .opencode/specs/sk-doc`; if non-empty, halt and escalate to the user citing this packet's hard gate (`spec.md` REQ-001/REQ-002) instead of proceeding.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup: baseline evidence) ──► Phase 2 (Wait + re-verify) ──► Phase 3 (Verify + report)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup, concurrent session commit | Verify |
| Verify | Core | Completion claim |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 30-45 minutes (this scaffold) |
| Core Implementation | Low | UNKNOWN - depends entirely on the concurrent session's own timeline |
| Verification | Low | 15-30 minutes once the tree is clean |
| **Total** | | **Scaffold ~30-45 minutes now; remainder UNKNOWN pending the concurrent session** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No production deployment or data migration in this phase.
- [x] No git mutation performed by this phase (documentation-only, verified by re-checking `git status --porcelain -- .opencode/specs/sk-doc` was unaffected by authoring these docs).
- [ ] Concurrent session's migration has landed and the tree is clean (checked at future verification time, not now).

### Rollback Procedure
1. If a future step mistakenly proposes touching `.opencode/specs/sk-doc`, discard that proposal before running it.
2. Re-run `git status --porcelain -- .opencode/specs/sk-doc`.
3. If dirty, halt and wait; if clean, proceed per Phase 2/3 above.
4. No external stakeholder notification needed - this is internal repo coordination.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A - no mutation was performed by this phase.
<!-- /ANCHOR:enhanced-rollback -->
