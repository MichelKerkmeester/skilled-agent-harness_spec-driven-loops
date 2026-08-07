---
title: "Implementation Plan: deep-review P1+P2 remediation"
description: "Single cli-codex dispatch implements all 16 findings via mechanical edits to 9 files."
trigger_phrases:
  - "102 p1 p2 remediation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/z_archive/011-sk-doc-skill-readme-and-structure/005-deep-review-p1-p2-remediation"
    last_updated_at: "2026-05-11T09:35:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored plan"
    next_safe_action: "Dispatch cli-codex"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "102-005-deep-review-p1-p2-remediation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: deep-review P1+P2 remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown + YAML frontmatter |
| **Framework** | sk-doc playbook + spec-kit Level 2 docs |
| **Storage** | Filesystem; git on main |
| **Testing** | `validate.sh --strict` per touched packet |

### Overview
One cli-codex dispatch (`gpt-5.5 / high / fast`) makes all the mechanical edits in a single transaction. Codex reads the deep-review dashboard, applies edits per `tasks.md` Phase 2, captures the diff, and exits. Verification is two strict-validate runs plus a grep matrix.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] All 9 files in scope exist on disk and are on main.
- [ ] Deep-review dashboard + report present at `../review/`.
- [ ] cli-codex binary + auth verified.

### Definition of Done
- [ ] cli-codex transcript present in `evidence/` with exit 0.
- [ ] `bash validate.sh --strict` exits 0 on 004 and 005.
- [ ] All 7 P1 + 9 P2 findings closed with file:line evidence.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Batched mechanical edit via single CLI dispatch. No iteration loop; codex is fast and reliable for grunt work.

### Key Components
- **Comprehensive prompt**: enumeration of every edit with exact path + old-string + new-string.
- **cli-codex (gpt-5.5/high/fast)**: executor.
- **Transcript file**: `evidence/codex-remediation-dispatch.txt`.
- **Strict validator**: gates completion.

### Data Flow
1. Author the prompt enumerating all 16 finding → edits.
2. Codex reads, scans target files, applies edits, summarizes.
3. Verifier runs strict-validate + grep matrix.
4. Implementation-summary populated with per-finding closure evidence.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `102/spec.md` parent | Phase parent metadata + handoffs | Update Phase 2 status; add SD-019 note to 003→004 handoff; add Known Issues; cross-ref 003/review/ | grep "Complete" Phase 2; grep "Known Issues"; grep "F-001"; grep "003/review" |
| `001/spec.md`, `002/spec.md`, `003/spec.md` | Child phase specs | "N of 3" → "N of 5" | grep "of 5" returns 3 hits |
| `002/checklist.md` | Phase 2 verification | CHK-003 handoff evidence; frontmatter completion_pct 0→100 | grep "CHK-003.*handoff"; YAML head check |
| `004/spec.md`, `004/checklist.md`, `004/implementation-summary.md` | Phase 4 spec + verification + summary | Status Draft→Complete; "4 of 4"→"4 of 5"; mark CHK items; completion_pct 90→100; close open_questions | strict-validate; YAML head checks |
| `06--agent-dispatch/002-markdown-agent-cli-codex.md` | SD-019 scenario | Frontmatter `expected_skip_in_non_interactive: true` + rationale | grep returns 1 hit |

Required inventories:
- Same-class producers: 9 files; no other producers.
- Consumers of changed symbols: dashboard + review-report (read-only).
- Matrix axes: (Phase × Document × Field) = 16 cells.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Verify all 9 files exist.
- [ ] Read `../review/deep-review-dashboard.md`.
- [ ] Snapshot 004 strict-validate baseline.

### Phase 2: Core Implementation
- [ ] Dispatch single cli-codex with comprehensive prompt.
- [ ] Capture full transcript.

### Phase 3: Verification
- [ ] Strict-validate 004 (exit 0).
- [ ] Strict-validate 005 (exit 0).
- [ ] Run grep matrix from §AFFECTED SURFACES.
- [ ] Populate implementation-summary with closure rows.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Strict validation | 004 and 005 | `validate.sh --strict` |
| Grep matrix | Per-finding evidence | `grep -n` |
| Diff audit | Codex transcript | `git diff --stat` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| cli-codex binary | External | Green | Fall back to manual Edit. |
| Codex auth | External | Green | Dispatch errors. |
| Sandbox network-access | Config | Green | Pass via `-c` flag. |
| Deep-review dashboard | Internal | Green | Source of truth. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Strict-validate fails after codex dispatch.
- **Procedure**: `git diff` to inspect; `git restore <path>` per file; re-dispatch or finish manually via Edit.
- **State Preserved**: 005 spec folder remains for retry.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## 8. PHASE DEPENDENCIES

| Phase | Depends On | Provides | Notes |
|-------|-----------|----------|-------|
| Phase 1: Setup | 004 (Active) + dashboard | File-existence verified | No writes. |
| Phase 2: Implementation | Phase 1 | All edits applied | One dispatch. |
| Phase 3: Verification | Phase 2 | Strict-validate green | Closes packet. |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## 9. EFFORT ESTIMATION

| Activity | Estimate | Drivers |
|----------|----------|---------|
| Setup verification | 2 min | `ls` + dashboard read. |
| cli-codex dispatch | 5-8 min | gpt-5.5/fast for 9-file edit. |
| Verification | 5 min | Two strict-validates + grep checks. |
| Summary fill | 5 min | Per-finding evidence rows. |
| **Total** | **~20 min** | Single session. |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## 10. ENHANCED ROLLBACK

### Failure Modes

| Failure Mode | Trigger | Rollback Action |
|--------------|---------|-----------------|
| Codex partial-edit | Transcript shows N of M edits, exit !=0 | Per-file `git restore` + retry remaining |
| Strict-validate regression on 004 | Codex broke an anchor or header | `git diff` then targeted Edit fix |
| Frontmatter parser breakage | Invalid YAML | `git restore`; re-author via Edit |
| SD-019 scenario field conflict | Codex modified existing fields | Restore; manually add the one new field |

### State Preserved Across Rollback
- 005 spec folder intact for retry.
- Parent 102 graph-metadata children_ids[5] stays.
- Phases 001/002/003 unchanged.

### Recovery Procedure
1. Inspect codex transcript for partial application.
2. `git diff --name-only`.
3. `git restore <path>` per failed file.
4. Re-dispatch or finish via Edit.
5. Re-validate with `--strict`.
<!-- /ANCHOR:enhanced-rollback -->
