---
title: "Acceptance Criteria: Phase 7: Source-Root Move"
description: "The criteria the source-root move phase must satisfy before it may close, one per requirement, each with the exact command or artifact that proves it and the evidence observed at the move commit."
trigger_phrases:
  - "source root move acceptance criteria"
  - "rename commit closure gate"
  - "skilled move verification rows"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/007-source-root-move"
    last_updated_at: "2026-09-17T13:55:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Met every criterion with evidence observed at a06f17bf52 and ec33385ae5"
    next_safe_action: "Start phase 008 per D1 once this folder validates"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "goal.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "041-007-acceptance-criteria"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase 004 chose L1, so the only compatibility entry is the .opencode link"
      - "The operator chose one commit for the renames and the link, so no C3 exists"
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 7: Source-Root Move

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/007-source-root-move
**Level:** 2
**Status:** Complete
**Date:** 2026-09-17
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. `C1_SHA`, `C2_SHA`, `PRE_MOVE_SHA` and `MAIN` are defined in `plan.md` and recorded in `goal.md`'s log. The operator's single-commit choice on 2026-09-17 put the link into C2, so AC-004 and AC-009 read C2 where they first read C3.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given `.skilled/` tracks only the placeholder, When C1 is committed, Then C1 deletes that file and nothing else and `.skilled/` tracks nothing | `git show --name-status --format= "$C1_SHA"` prints one line, `D` with `.skilled/future-task-placeholder-move-opencode-contents-to-here-and-relative-symlink-back/.gitkeep`. `git ls-tree -r --name-only "$C1_SHA" -- .skilled` prints nothing. Observed at `a06f17bf52`: that single `D` line, and 0 entries under `.skilled`. Evidence: `goal.md:93` | Met | - |
| AC-002 | REQ-002 | Given C1, When C2 is committed, Then every rename is exact, the count equals the moved count and the only other line adds the link | `git show -M --name-status --format= "$C2_SHA" \| cut -f1 \| sort \| uniq -c` prints `1 A` and `17773 R100`. Observed at `ec33385ae5`: exactly those two lines, and every rename keeps its relative path, with 0 crossed pairs in `scratch/r-status-census.tsv`. Evidence: `goal.md:96` | Met | - |
| AC-003 | REQ-003 | Given C1 and C2, When both trees are compared by mode, blob id and prefix-rewritten path, Then nothing differs | `diff <(git -c core.quotePath=false ls-tree -r --format='%(objectmode) %(objectname) %(path)' "$C1_SHA" -- .opencode \| sed 's# \.opencode/# .skilled/#' \| sort) <(git -c core.quotePath=false ls-tree -r --format='%(objectmode) %(objectname) %(path)' "$C2_SHA" -- .skilled \| sort)` prints nothing. Observed: 0 lines over 17,773 entries on each side, and the unit's separate comparison agrees. Evidence: `goal.md:97` | Met | - |
| AC-004 | REQ-004 | Given C1, When C2 is committed with the link, Then `.opencode` tracks exactly the link phase 004 chose and the root sentinel resolves | `git show --name-status --format= "$C2_SHA"` holds one `A .opencode` line, `git ls-files -s -- .opencode` prints one entry with mode `120000`, `git show "$C2_SHA":.opencode` prints `.skilled` and `test -f .opencode/skills/system-spec-kit/SKILL.md` exits 0. `scratch/link-census.tsv` counts 8 dangling links. Observed: all four, and the 8 dangling paths are the pre-move 8 after the prefix rewrite. Evidence: `goal.md:96`, `goal.md:97` | Met | - |
| AC-005 | REQ-005 | Given every phase commit, When its paths are listed, Then none lies outside `.gitignore`, `.skilled/` and `.opencode` | For C1 and C2, `git show --name-only --format= <sha> \| grep -vcE '^(\.gitignore\|\.skilled/\|\.opencode)'` prints 0. No C0 or C3 exists. Observed: 0 and 0. Evidence: `goal.md:96` | Met | - |
| AC-006 | REQ-006 | Given the phase is done, When origin, the main checkout and the hook links are inspected, Then none carries the move | After `git fetch origin`, `git branch -r --contains "$C2_SHA"` prints nothing, `git -C "$MAIN" merge-base --is-ancestor "$C2_SHA" HEAD` exits 1 and `readlink ~/.config/git/hooks/*` matches the T007 record. Observed: fetch exit 0, no branch, exit 1 with `MAIN` at `048d16d725`, and all seven links still point into `MAIN`'s `.opencode/scripts/git-hooks/`. Evidence: `goal.md:98` | Met | - |
| AC-007 | REQ-007 | Given C2, When one unique-content path per moved top-level entry is followed, Then each reaches history older than C2 | In `scratch/follow-samples.tsv`, every row shows `git log --follow --format=%h -- <path> \| wc -l` greater than `git log --format=%h -- <path> \| wc -l`, one row per moved entry. Observed: 16 of 16 rows, and re-runs of `.skilled/bin/README.md` (1 and 36) and `.skilled/vitest.config.bin.ts` (1 and 3) match. Evidence: `goal.md:97` | Met | - |
| AC-008 | REQ-008 | Given the 18 ignored entries recorded before the move, When C2 is in place, Then each is travelled, relocated or rebuilt at its relative path and neither root shows an untracked file | `git ls-files --others --ignored --exclude-standard --directory -- .skilled` lists all 18 at their pre-move relative paths, and `git status --porcelain --untracked-files=all -- .skilled .opencode` prints nothing. Observed: 17 travelled with their entry, `node_modules` was relocated, the four `dist` trees were rebuilt in place, the root-normalized lists are identical and the status prints nothing. Evidence: `goal.md:95` | Met | - |
| AC-009 | REQ-009 | Given C1 and C2, When their hook output and phase 005's independent check are read, Then every gate result is recorded and the check passes on C2 | The hook output of both commits is copied into the log with exit status 0 and the `Commit-Id:` trailer state, and 005's check exits 0 on `C2_SHA`. Observed: C1 printed nothing, C2 printed five route re-mint lines, the trailers are `0009514` and `0009515`, and `check-gate-inputs.sh` prints `RESULT: PASSED` with exit 0 at `ec33385ae5`. Evidence: `goal.md:93`, `goal.md:96`, `goal.md:98` | Met | - |
| AC-010 | REQ-010 | Given C2, When the push-time gates are previewed, Then phase 011 has the deletion count, the naming offenders and the way through the ceiling | The log records `git diff --name-only --diff-filter=D <remote tip or merge base> "$C2_SHA" \| wc -l` (1 expected from this phase's commits), the naming preview's offenders and `SPECKIT_ALLOW_MASS_DELETION=1` on a single push as the documented route if a later count exceeds 100. Observed: 1 deletion against `origin/skilled/v4.0.0.0` at `048d16d725`, the placeholder. The preview passes with no offender, because phase 005 lets a rename that keeps its basename through. Evidence: `goal.md:97`, `goal.md:123` | Met | - |
| AC-011 | REQ-011 | Given no state change yet, When the log is read, Then `PRE_MOVE_SHA` and the R1 to R3 rollback commands appear before the C1 entry | `goal.md`'s log lists the rollback record above the move rows, and `git cat-file -e "$PRE_MOVE_SHA^{commit}"` exits 0. Observed: the record was written before C1, and the check exits 0. Evidence: `goal.md:91` | Met | - |
| AC-012 | REQ-012 | Given the phase documents, When metadata is regenerated and validated on the main checkout's toolchain, Then validation passes | `node "$MAIN/.opencode/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs" --folder <this folder> --apply`, then `bash "$MAIN/.opencode/skills/system-spec-kit/runtime/cli/spec/validate.sh" <this folder> --strict` prints `RESULT: PASSED`. Observed: `RESULT: PASSED` with 0 errors and 0 warnings. `repair-derived.cjs` ran with the worktree as its working directory, because it resolves the repository from there and refuses a folder outside it. Evidence: `goal.md:99` | Met | - |

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

All 12 criteria are Met, with evidence observed at `a06f17bf52` and `ec33385ae5` in worktree 055. No criterion is waived or superseded, and nothing from this phase is pushed.
<!-- /ANCHOR:closure -->
