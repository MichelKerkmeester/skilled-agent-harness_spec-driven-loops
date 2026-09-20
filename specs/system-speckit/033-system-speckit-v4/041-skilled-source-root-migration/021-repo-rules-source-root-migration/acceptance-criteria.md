---
title: "Acceptance Criteria: Phase 21: repo-rules-source-root-migration"
description: "The criteria phase 21 must satisfy before it may close."
trigger_phrases:
  - "repo rules source migration acceptance"
  - "phase 21 closure gate"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/021-repo-rules-source-root-migration"
    last_updated_at: "2026-09-20T00:00:00Z"
    last_updated_by: "pi"
    recent_action: "Scaffolded the phase and recorded baselines"
    next_safe_action: "Run the bounded research loop"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "021-repo-rules-source-root-migration"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Should the three sibling repositories be re-pointed at the canonical path?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 21: repo-rules-source-root-migration

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 041-skilled-source-root-migration/021-repo-rules-source-root-migration
**Level:** 2
**Status:** In progress
**Date:** 2026-09-20
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the move, When the corpus is read from either path, Then 13 rule files resolve and each is a symlink to its canonical counterpart | `ls -L repo-rules` plus the farm-integrity check | Unmet | - |
| AC-002 | REQ-002 | Given the reference rewrite, When every tracked file outside `specs/` is rescanned, Then no live path names the root form | The phase rescan with a disposition per hit | Unmet | - |
| AC-003 | REQ-003 | Given the checker, When it runs in this repository, Then it prints `RESULT: PASSED (9/9 checks)` | `node check-repo-rules.cjs` | Unmet | - |
| AC-004 | REQ-003 | Given a checkout carrying only `repo-rules/`, When the same checker runs, Then it prints the same verdict | The portability fixture | Unmet | - |
| AC-005 | REQ-004 | Given the phase head, When every mirror check runs, Then each exits 0 with no drift | The seven `--check` commands | Unmet | - |
| AC-006 | REQ-004 | Given the frozen-set digest at the base commit, When it is recomputed at the phase head, Then it is unchanged | `scratch/baseline/freeze-digest.txt` | Unmet | - |
| AC-007 | REQ-001 | Given the moved files, When `git log --follow` runs per rule, Then the full history is walked | `git log --follow --oneline <rule>` | Unmet | - |
| AC-008 | REQ-005 | Given a deleted farm entry, When the integrity check runs, Then it reports the uncovered rule file | The check on a mutated fixture | Unmet | - |
| AC-009 | REQ-002 | Given the CI workflow, When `check-gate-inputs.sh` runs, Then it reports `RESULT: PASSED` | `bash .github/scripts/check-gate-inputs.sh` | Unmet | - |
| AC-010 | REQ-006 | Given the parent packet, When validation runs recursively, Then the phase map, the handoff row and the child id all name this phase | `validate.sh --recursive --strict` | Unmet | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |
<!-- /ANCHOR:criteria -->

---
