---
title: "Acceptance Criteria: Phase 1: ignore-and-commit-guard"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "ignore and commit guard acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/013-private-surface-skills/001-ignore-and-commit-guard"
    last_updated_at: "2026-10-23T07:03:38Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 1: ignore-and-commit-guard

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 001-ignore-and-commit-guard
**Level:** 2
**Status:** Draft
**Date:** 2026-10-23
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the phase commit, when `git check-ignore -v .skilled/skills/local-webflow/SKILL.md .hermes/skills/local-obsidian` runs, then two lines print, each naming `.gitignore` and its rule, and the command exits 0 | That exact command. Expected: two lines, one containing `/.skilled/skills/local-*` and one containing `/.hermes/skills/local-*`, exit status 0. Before the change the same command exits 1 | Unmet | - |
| AC-002 | REQ-001 | Given a symlink at `.skilled/skills/local-probe` pointing at the checkout, when `git check-ignore -v .skilled/skills/local-probe` runs, then the `/.skilled/skills/local-*` rule is named, which is what a trailing slash would have missed | `rm -f .skilled/skills/local-probe && ln -s "$PWD" .skilled/skills/local-probe && git check-ignore -v .skilled/skills/local-probe`. Expected: one line naming `/.skilled/skills/local-*`. Then `rm .skilled/skills/local-probe` and `git status --porcelain` prints nothing for it | Unmet | - |
| AC-003 | REQ-002 | Given a throwaway repository with `.skilled/skills/local-probe/SKILL.md` staged, when the real hook runs, then it exits 1 and the output names the path, the gate and the repair | The `plan.md` Step 9 probe. Expected: `rc=1`, output containing `BLOCKED [gate:private-skill]`, `.skilled/skills/local-probe/SKILL.md` and `git rm --cached -r` | Unmet | - |
| AC-004 | REQ-002 | Given the same staged path, when the operator runs the repair the refusal printed, then the hook exits 0 on the next run, so the guard does not block its own fix | In the throwaway repository: `git rm --cached -r -q -- .skilled/skills/local-probe/SKILL.md`, then run the hook again. Expected: `rc=0`. The same property is pinned by harness case 75 | Unmet | - |
| AC-005 | REQ-002 | Given the guard in place, when anyone looks for a way to switch it off, then there is none: no `SPECKIT_SKIP_*` read in the guard and no `lib/gates.tsv` row for it | `grep -c '^PRIVATE_SKILL_RE=' .skilled/scripts/git-hooks/pre-commit` prints `1`; `grep -c 'private' .skilled/scripts/git-hooks/lib/gates.tsv` prints `0`; `grep -c 'SPECKIT_SKIP_PRIVATE' .skilled/scripts/git-hooks/pre-commit` prints `0` | Unmet | - |
| AC-006 | REQ-002 | Given a private skill staged under any of the six skill roots, or a file nested inside one, when the hook runs, then every such path is refused and named | Harness case 76. Expected: `PASS` for each of `.skilled`, `.opencode`, `.claude`, `.pi`, `.devin`, `.hermes`, plus `PASS  the refusal names a file nested in a private skill` | Unmet | - |
| AC-007 | REQ-003 | Given the edited hook, when its syntax and its gate order are checked, then the file parses and the guard's closing `fi` is the last non-blank line before the comment-hygiene gate, with the required blank line between them | `bash -n .skilled/scripts/git-hooks/pre-commit` exits 0; `awk '/Comment hygiene gate \(blocking\)/{print last; exit} NF{last=$0}' .skilled/scripts/git-hooks/pre-commit` prints `fi` | Unmet | - |
| AC-008 | REQ-004 | Given the harness with the new cases, when it runs, then it exits 0, every case passes, and no existing case was rewritten to make that true | `bash .skilled/scripts/git-hooks/tests/pre-commit.test.sh`. Expected: exit 0 and a last line `pre-commit gates: <N> passed, 0 failed` with `<N>` larger than before. Then `git diff 42b41dd286 -- .skilled/scripts/git-hooks/tests/pre-commit.test.sh`, with `---` header lines filtered out, shows one removed line: the harness header sentence that now names the guard, and no other | Unmet | - |
| AC-009 | REQ-004 | Given a `local-` name that sits below the skill root rather than at it, when the hook runs, then nothing is refused, because the pattern must not overreach | Harness case 77. Expected: `PASS  a local- file below the skill root is committable`, and no `gate:private-skill` line in the log | Unmet | - |
| AC-010 | REQ-005 | Given a reader looking for the limits, when they read `spec.md`, then they find that `git commit --no-verify` still bypasses the guard and that removed content stays in git history | `grep -c 'no-verify' spec.md` prints `3`; `grep -c 'git history' spec.md` prints at least `1` | Unmet | - |
| AC-011 | REQ-006 | Given the phase commit, when the diff is inspected, then only the three code files and this packet's documents changed, and no added comment names a spec path, packet number or phase number | `git diff --name-only 42b41dd286` lists only `.gitignore`, `.skilled/scripts/git-hooks/pre-commit`, `.skilled/scripts/git-hooks/tests/pre-commit.test.sh` and files under `specs/sk-code/013-private-surface-skills/001-ignore-and-commit-guard/`; `git diff 42b41dd286 -- .gitignore .skilled/scripts/git-hooks/` added lines grepped with `specs/\|phase [0-9]\|013-private` prints `0` | Unmet | - |

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

[One or two sentences: which criteria carried the packet, and what was consciously
left out. Write this when the packet is closed, not before.]
<!-- /ANCHOR:closure -->
