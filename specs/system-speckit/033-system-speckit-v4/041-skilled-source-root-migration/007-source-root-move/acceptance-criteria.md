---
title: "Acceptance Criteria: Phase 7: Source-Root Move"
description: "The criteria the source-root move phase must satisfy before it may close, one per requirement, each with the exact command or artifact that proves it."
trigger_phrases:
  - "source root move acceptance criteria"
  - "rename commit closure gate"
  - "skilled move verification rows"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/007-source-root-move"
    last_updated_at: "2026-09-16T18:40:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Authored one criterion per requirement with exact verification commands"
    next_safe_action: "Meet the criteria in task order once phase 004 freezes the layout and phase 006 validates"
    blockers:
      - "Phase 004 has not frozen the .opencode compatibility shape"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "041-007-acceptance-criteria"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
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
**Status:** Draft
**Date:** 2026-09-16
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. `C1_SHA`, `C2_SHA`, `C3_SHA`, `PRE_MOVE_SHA` and `MAIN` are defined in `plan.md` and recorded in `goal.md`'s log.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given `.skilled/` tracks only the placeholder, When C1 is committed, Then C1 deletes that file and nothing else and `.skilled/` tracks nothing | `git show --name-status --format= "$C1_SHA"` prints one line, `D` with `.skilled/future-task-placeholder-move-opencode-contents-to-here-and-relative-symlink-back/.gitkeep`. `git ls-tree -r --name-only "$C1_SHA" -- .skilled` prints nothing | Unmet | - |
| AC-002 | REQ-002 | Given C1, When C2 is committed, Then every status line is an exact rename and the count equals the moved count | `git show -M --name-status --format= "$C2_SHA" \| cut -f1 \| sort \| uniq -c` prints one line: `R100` with 17,767, less phase 004's kept count under option C | Unmet | - |
| AC-003 | REQ-003 | Given C1 and C2, When both trees are compared by mode, blob id and prefix-rewritten path, Then nothing differs | `diff <(git -c core.quotePath=false ls-tree -r --format='%(objectmode) %(objectname) %(path)' "$C1_SHA" -- .opencode \| sed 's# \.opencode/# .skilled/#' \| sort) <(git -c core.quotePath=false ls-tree -r --format='%(objectmode) %(objectname) %(path)' "$C2_SHA" -- .skilled \| sort)` prints nothing, or only the kept entries under option C | Unmet | - |
| AC-004 | REQ-004 | Given C2, When C3 is committed, Then `.opencode` tracks exactly phase 004's compatibility entries and the root sentinel resolves | `git show --name-status --format= "$C3_SHA"` prints only `A` lines for 004's entries, `git ls-files -s -- .opencode` matches 004's list with mode `120000` for every link and `test -f .opencode/skills/system-spec-kit/SKILL.md` exits 0 under options A and B. `scratch/link-census.tsv` counts 8 dangling links under A and B, or 8 plus the list routed to phase 008 under C | Unmet | - |
| AC-005 | REQ-005 | Given every phase commit, When its paths are listed, Then none lies outside `.gitignore`, `.skilled/` and `.opencode` | For each of C0 (when present), C1, C2 and C3, `git show --name-only --format= <sha> \| grep -vcE '^(\.gitignore\|\.skilled/\|\.opencode)'` prints 0 | Unmet | - |
| AC-006 | REQ-006 | Given the phase is done, When origin, the main checkout and the hook links are inspected, Then none carries the move | After `git fetch origin`, `git branch -r --contains "$C2_SHA"` prints nothing, `git -C "$MAIN" merge-base --is-ancestor "$C2_SHA" HEAD` exits 1 and `readlink ~/.config/git/hooks/*` matches the T007 record | Unmet | - |
| AC-007 | REQ-007 | Given C2, When one unique-content path per moved top-level entry is followed, Then each reaches history older than C2 | In `scratch/follow-samples.tsv`, every row shows `git log --follow --format=%h -- <path> \| wc -l` greater than `git log --format=%h -- <path> \| wc -l`, one row per moved entry (16 under options A and B) | Unmet | - |
| AC-008 | REQ-008 | Given the 12 ignored entries recorded before the move, When C3 is in place, Then each is travelled, relocated or rebuilt at its recorded location and neither root shows an untracked file | `git ls-files --others --ignored --exclude-standard --directory -- .skilled .opencode` lists all 12 at the locations T030 and T031 recorded, and `git status --porcelain --untracked-files=all -- .skilled .opencode` prints nothing | Unmet | - |
| AC-009 | REQ-009 | Given C2 and C3, When their hook output and phase 005's independent check are read, Then every gate result is recorded and the check passes on C3 | `scratch/commit-c2-hooks.txt` and `scratch/commit-c3-hooks.txt` are copied into the log with exit status 0 and the `Commit-Id:` trailer state, and 005's check exits 0 on `C3_SHA` | Unmet | - |
| AC-010 | REQ-010 | Given C3, When the push-time gates are previewed, Then phase 011 has the deletion count, the naming offenders and the way through the ceiling | The log records `git diff --name-only --diff-filter=D <remote tip or merge base> "$C3_SHA" \| wc -l` (1 expected from this phase's commits), the naming preview's offenders (4 expected) and `SPECKIT_ALLOW_MASS_DELETION=1` on a single push as the documented route if a later count exceeds 100 | Unmet | - |
| AC-011 | REQ-011 | Given no state change yet, When the log is read, Then `PRE_MOVE_SHA` and the R1 to R3 rollback commands appear before the C1 entry | `goal.md`'s log lists the rollback record above the C1 row, and `git cat-file -e "$PRE_MOVE_SHA^{commit}"` exits 0 | Unmet | - |
| AC-012 | REQ-012 | Given the phase documents, When metadata is regenerated and validated on the main checkout's toolchain, Then validation passes | `node "$MAIN/.opencode/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs" --folder <this folder> --apply`, then `bash "$MAIN/.opencode/skills/system-spec-kit/runtime/cli/spec/validate.sh" <this folder> --strict` prints `RESULT: PASSED` | Unmet | - |

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

**Closeable:** No

No criterion is met yet, because the move has not run. This statement is rewritten when the phase closes.
<!-- /ANCHOR:closure -->
