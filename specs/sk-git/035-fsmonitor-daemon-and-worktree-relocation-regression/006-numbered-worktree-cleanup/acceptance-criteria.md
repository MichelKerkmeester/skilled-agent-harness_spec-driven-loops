---
title: "Acceptance Criteria: Phase 6: numbered-worktree-cleanup"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "numbered worktree cleanup acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-git/035-fsmonitor-daemon-and-worktree-relocation-regression/006-numbered-worktree-cleanup"
    last_updated_at: "2026-10-27T22:30:00Z"
    last_updated_by: "claude"
    recent_action: "Built the numbered reaper lane, the throttled session-start sweep and the doctor line"
    next_safe_action: "Operator commits the tree, including the untracked bounded-git.sh and the new guard test"
    blockers: []
    key_files:
      - ".skilled/bin/worktree-reaper.sh"
      - ".skilled/bin/worktree-guard.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "62098141-a640-42f2-be0a-f0b9b06d61df"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 6: numbered-worktree-cleanup

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-git/035-fsmonitor-daemon-and-worktree-relocation-regression/006-numbered-worktree-cleanup
**Level:** 2
**Status:** Complete
**Date:** 2026-10-27
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a clean, merged, idle numbered worktree with only regenerable ignored paths and no process inside, When the reaper runs with `--numbered`, Then the folder and branch are gone and the fsmonitor reaper ran first; without the flag it is untouched | `.skilled/bin/tests/worktree-reaper.test.sh:333` (flag off) and `:379` to `:381` (removed, daemon reaper ran) | Met | - |
| AC-002 | REQ-002 | Given a worktree with a fresh reflog, an ignored `specs/` file, an off-list ignored file, an untracked file, an unmerged commit, a live process, a lock, a stash entry or a mismatched pair, When the sweep runs, Then each is kept with its reason | `.skilled/bin/tests/worktree-reaper.test.sh:385` to `:399`, rules at `.skilled/bin/worktree-reaper.sh:362` | Met | - |
| AC-003 | REQ-002 | Given an `lsof` that prints nothing, When either lane runs, Then the worktree is kept and the reason is `process listing unavailable` (numbered) or `pid unknown` (wrapper) | `.skilled/bin/tests/worktree-reaper.test.sh:178` to `:180` and `:345` to `:349`, probe at `.skilled/bin/worktree-reaper.sh:234` | Met | - |
| AC-004 | REQ-003 | Given an unregistered `099-orphan` folder, a detached worktree, a branch of another pattern and the main checkout, When the sweep runs, Then none is touched and the orphan is reported as `orphan path=` | `.skilled/bin/tests/worktree-reaper.test.sh:394` to `:402`, report at `.skilled/bin/worktree-reaper.sh:434` | Met | - |
| AC-005 | REQ-004 | Given a branch whose ref is locked so `git branch -d` refuses, When the sweep runs, Then it logs keep, removes the later `002-ok` worktree and exits 0; the script contains no `--force` or `-D` | `.skilled/bin/tests/worktree-reaper.test.sh:376` to `:383` and `:405`, handler at `.skilled/bin/worktree-reaper.sh:280` | Met | - |
| AC-006 | REQ-005 | Given the fixture repository, When `--numbered --dry-run` runs, Then worktree folders and branches are identical before and after and the would-reap row names `002-ok` | `.skilled/bin/tests/worktree-reaper.test.sh:336` to `:343` | Met | - |
| AC-007 | REQ-006 | Given a `git` that never returns from `status` and `SPECKIT_GIT_TIMEOUT=2`, When the sweep runs, Then it ends in under 55 seconds with `git status timed out`, and every tree-reading git call carries `core.fsmonitor=false` | `.skilled/bin/tests/worktree-reaper.test.sh:351` to `:376` | Met | - |
| AC-008 | REQ-007 | Given the HEAD reaper, When the new reaper suite runs against it, Then the empty-listing, wedged-status and numbered cases fail | `.skilled/bin/tests/worktree-reaper.test.sh:178` fails against the HEAD reaper; the run is at `implementation-summary.md:104` | Met | - |
| AC-009 | REQ-008 | Given a stub sweep that runs 4 seconds, When the guard runs, Then it returns in under 3 seconds, a second start and a start from a linked worktree spawn nothing, an expired stamp spawns again, and each switch spawns nothing | `.skilled/bin/tests/worktree-guard.test.sh:70` to `:118`, hook at `.skilled/bin/worktree-guard.sh:53` | Met | - |
| AC-010 | REQ-009 | Given a stub reaper, When the doctor runs, Then the worktrees row shows the three counts and a hint, shows `not checked (reaper exited 5)` on failure, and stays PASS | `.skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs:1200`, `:1225` and `:1239`, line at `.skilled/commands/doctor/scripts/git-setup-check.cjs:712` | Met | - |
| AC-011 | REQ-010 | Given the sk-git docs and READMEs, When read, Then rule 17, the catalog entry, GIT-034, `.env.example` and the READMEs name the lane, the sweep and `SPECKIT_WORKTREE_AUTOREAP`, the false catalog line is gone from all playbook files, and the playbook and skill validators exit 0 | `.skilled/skills/sk-git/SKILL.md:316` (rule 17) and `.env.example:556`; `rg -n 'No .feature-catalog/. package' .skilled/skills/sk-git` prints nothing; validator exit codes at `implementation-summary.md:152` | Met | - |
| AC-012 | REQ-010 | Given phase 003's Known Limitations, When read, Then items 2 and 4 name phase 005 as the fix | `specs/sk-git/035-fsmonitor-daemon-and-worktree-relocation-regression/003-fsmonitor-daemon-lifecycle/implementation-summary.md:137` and `:139` | Met | - |
| AC-013 | REQ-011 | Given a loaded machine, When the fsmonitor reaper suite runs its real-daemon case, Then the outcome is explained by a trace and the case is deterministic | `.skilled/bin/tests/fsmonitor-daemon-reaper.test.sh:778`, trace and the two backed-out bounds at `implementation-summary.md:121` | Met | - |
| AC-014 | REQ-001 | Given every suite that passed at HEAD, When rerun after the change, Then none fails and no count drops | `implementation-summary.md:93` before and after counts | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes

Every row above is Met, and the evidence is in `implementation-summary.md`.
<!-- /ANCHOR:closure -->
