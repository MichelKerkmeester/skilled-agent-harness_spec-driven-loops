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
    last_updated_at: "2026-09-20T10:30:00Z"
    last_updated_by: "pi"
    recent_action: "Corpus moved; references and checker updated; harness green"
    next_safe_action: "Open the PR from the worktree branch"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "021-repo-rules-source-root-migration"
      parent_session_id: null
    completion_pct: 100
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
**Status:** Complete
**Date:** 2026-09-20
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the move, When the corpus is read from either path, Then 13 rule files resolve and each is a symlink to its canonical counterpart | `ls -L repo-rules` returns 13, `scratch/check-farm.cjs` prints `PASSED files=13 links=13 every link resolves`, and the mutated fixture names a deleted entry (`scratch/verify-run.txt:4` and `:18`) | Met | - |
| AC-002 | REQ-002 | Given the reference rewrite, When every tracked file outside `specs/` is rescanned, Then no live path names the root form | `scratch/rescan-census-before.txt` (422 lines) against `scratch/rescan-census-after.txt` (424 lines), every residual hit given a disposition in `research/research.md` §3 to §5 (`research/research.md:46`) | Met | - |
| AC-003 | REQ-003 | Given the checker, When it runs in this repository, Then it prints `RESULT: PASSED (9/9 checks)` | `node .skilled/skills/sk-doc/sk-create-repo-rule/scripts/check-repo-rules.cjs` — receipt `scratch/verify-run.txt`, along with 8 trigger rows, 13 index rows, 45 resolving rule links and 252 unique phrases (`scratch/verify-run.txt:1`) | Met | - |
| AC-004 | REQ-003 | Given a checkout carrying only `repo-rules/`, When the same checker runs, Then it prints the same verdict | The portability fixture in `scratch/verify.sh`: copies of the corpus and the checker in a temp tree with no `.skilled/` — `RESULT: PASSED (9/9 checks)` (`scratch/verify-run.txt:17`) | Met | - |
| AC-005 | REQ-004 | Given the phase head, When every mirror check runs, Then each exits 0 with no drift | Runtime mirrors, Codex agents and prompts, and Pi agents all `PASS`; the doctor roster and catalog checks print `STATUS=OK`; the Hermes drift set equals the base receipt (`DRIFT cli-devin`, pre-existing at `c1817442b2`) (`scratch/verify-run.txt:8` to `:12`) | Met | - |
| AC-006 | REQ-004 | Given the frozen-set digest at the base commit, When it is recomputed at the phase head, Then it is unchanged | `scratch/verify.sh` frozen-record row: no modified or deleted frozen file since `c1817442`; the one activation manifest the commit gate re-minted is asserted on its own row (`scratch/verify-run.txt:13` and `:14`) | Met | - |
| AC-007 | REQ-001 | Given the moved files, When `git log --follow` runs per rule, Then the full history is walked | `git log --follow --oneline -- .skilled/repo-rules/blast-radius.md` reaches 11 commits, including the rename-only move (`scratch/verify-run.txt:16`) | Met | - |
| AC-008 | REQ-005 | Given a deleted farm entry, When the integrity check runs, Then it reports the uncovered rule file | The mutated fixture in `scratch/verify.sh` removes one public entry from a temp tree and the check reports `blast-radius.md: no farm entry reaches it` (`scratch/verify-run.txt:18`) | Met | - |
| AC-009 | REQ-002 | Given the CI workflow, When `check-gate-inputs.sh` runs, Then it reports `RESULT: PASSED` | `bash .github/scripts/check-gate-inputs.sh` — `RESULT: PASSED`, with the new filter and its `.opencode` twin counted in `twin_pairs` (`scratch/verify-run.txt:3`) | Met | - |
| AC-010 | REQ-006 | Given the parent packet, When validation runs recursively, Then the phase map, the handoff row and the child id all name this phase | `validate.sh --recursive --strict` prints `RESULT: PASSED`; the phase map row 21, the handoff row `020 → 021` and `children_ids` all name `021-repo-rules-source-root-migration` (`scratch/verify-run.txt:19` and `:20`) | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |
<!-- /ANCHOR:criteria -->

---
