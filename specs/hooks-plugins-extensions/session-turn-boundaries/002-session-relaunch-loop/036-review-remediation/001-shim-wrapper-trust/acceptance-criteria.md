---
title: "Acceptance Criteria: Phase 1: shim-wrapper-trust"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "shim wrapper trust acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/001-shim-wrapper-trust"
    last_updated_at: "2026-11-12T08:28:53Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-001-shim-wrapper-trust"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 1: shim-wrapper-trust

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `001-shim-wrapper-trust`
**Level:** 2
**Status:** Complete
**Date:** 2026-11-12
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a scratch tree with a `.skilled/bin/skilled-loop` outside the checkout the shim was sourced from, When `claude hello` runs two directories below it, Then the shim does not run that wrapper and the plain runtime binary runs | `node --test .skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs` exits 0 with the outside-wrapper case passing Observed 2026-11-12: `a wrapper outside the sourced checkout is not resolved` passes under bash and zsh in `scratch/green.txt`, and failed before the fix in `scratch/red.txt`. The resolver prints nothing, so the runtime function runs `command <binary>`. Source: `.skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs:118`. | Met | - |
| AC-002 | REQ-002 | Given the sourced checkout and a repository whose `.skilled` is a symlink to it, When an interactive runtime form resolves, Then the wrapper path is printed and the launch runs `bash "$wrapper"` | `node --test .skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs` exits 0 and reports the symlinked `.skilled` case passing Observed 2026-11-12: `every interactive form finds the wrapper through a symlinked .skilled` passes under bash and zsh in `scratch/green.txt`, and `rg -n 'bash "\$wrapper"' .skilled/bin/skilled-loop-shell.sh` prints the launch line. Source: `.skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs:208`. | Met | - |
| AC-003 | REQ-003 | Given the shim source, When `/bin/bash -n` and `/bin/zsh -n` parse it, Then both exit 0 and no shell option is set | `/bin/bash -n .skilled/bin/skilled-loop-shell.sh && /bin/zsh -n .skilled/bin/skilled-loop-shell.sh` exits 0 and `rg -n 'setopt\|set -[a-z]' .skilled/bin/skilled-loop-shell.sh` prints only the subshell line Observed 2026-11-12: both parse commands exit 0, and the option search prints one line, `set -uo pipefail` inside the `skilled_loop_resolve` subshell. Source: `.skilled/bin/skilled-loop-shell.sh:77`. | Met | - |
| AC-005 | REQ-005 | Given a linked git worktree registered in the sourced checkout and a second directory whose `.git` file only points at that checkout, When an interactive runtime form resolves in each, Then the registered worktree's wrapper is printed and the other directory's wrapper is not | `node --test .skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs` exits 0 with the registered-worktree case and the claimed-worktree case passing Observed 2026-11-12: `a wrapper in a registered linked worktree is resolved` and `a .git file alone does not register a trusted worktree` pass under bash and zsh in `scratch/green.txt`. Source: `.skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs:176` and `.skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs:184`. | Met | - |
| AC-006 | REQ-006 | Given a checkout outside the sourced one, When `SKILLED_LOOP_TRUSTED_CHECKOUTS` names its path and when the variable is unset, Then the wrapper is printed only in the first case | `node --test .skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs` exits 0 with both cases passing Observed 2026-11-12: `explicitly trusted checkouts resolve and unset or empty trusts nothing extra` passes under bash and zsh in `scratch/green.txt`. Source: `.skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs:194`. | Met | - |
| AC-007 | REQ-007 | Given a shim sourced through a symlinked file, or a shell copy that lost the stored checkout, When a wrapper is resolved, Then the first case resolves the wrapper of the real checkout and the second resolves nothing and prints no error | `node --test .skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs` exits 0 with the symlinked-shim-file case and the lost-checkout case passing under bash and zsh Observed 2026-11-12: `the shim sourced through a symlinked file trusts its real checkout` and `a shell copy without the stored checkout trusts nothing` pass under bash and zsh in `scratch/green.txt`. Three of the four failed before the fix in `scratch/red-2.txt`. Source: `.skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs:156` and `.skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs:164`. | Met | - |
| AC-008 | REQ-008 | Given a planted repository with its own wrapper and `GIT_DIR` pointing at it, When a wrapper is resolved there, Then nothing is printed, and Given a repository whose `.skilled` is a symlink to the sourced checkout, Then the printed path is the wrapper's real path | `node --test .skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs` exits 0 with the inherited-`GIT_DIR` case and the symlinked `.skilled` case passing under bash and zsh Observed 2026-11-12: `an inherited GIT_DIR cannot vouch for a planted repository` passes under bash and zsh in `scratch/green.txt` and failed before the fix in `scratch/red-3.txt`. The symlinked `.skilled` cases expect the real path. Source: `.skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs:136` and `.skilled/bin/skilled-loop-shell.sh:259`. | Met | - |
| AC-004 | REQ-004 | Given the two README files, When `rg -l 'sourced checkout'` runs over them, Then both paths print | `rg -l 'sourced checkout' .skilled/bin/README.md .skilled/hooks/session-relaunch/README.md` prints both paths Observed 2026-11-12: the command prints `.skilled/bin/README.md` and `.skilled/hooks/session-relaunch/README.md`. Source: `.skilled/bin/README.md:162` and `.skilled/hooks/session-relaunch/README.md:104`. | Met | - |

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

All eight criteria are Met with observed evidence from `scratch/green.txt` and `scratch/green-full.txt`. The evidence is pinned to the diff range `5dafa313e8..working tree`, because nothing is committed without the operator.
<!-- /ANCHOR:closure -->
