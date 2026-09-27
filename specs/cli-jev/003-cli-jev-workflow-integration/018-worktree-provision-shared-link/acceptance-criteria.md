---
title: "Acceptance Criteria: Phase 18: worktree-provision-shared-link"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/018-worktree-provision-shared-link"
    last_updated_at: "2026-09-27T12:06:41Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Build the fix, then ask the operator before the repair install"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "owner-fix-018-planning"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 18: worktree-provision-shared-link

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** cli-jev/003-cli-jev-workflow-integration/018-worktree-provision-shared-link
**Level:** 2
**Status:** Planned
**Date:** 2026-09-27
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a package whose only dependency is `"@spec-kit/shared": "file:../shared"` and no link on disk, When provisioning runs twice, Then the first run installs it and the second skips it, and a real package in the same state reads unsatisfied | `bash .skilled/skills/sk-git/scripts/tests/worktree-naming.test.sh` prints no `FAIL:` line for the `spec-kit-only` assertion, and before the repair `bash -c 'source .skilled/skills/sk-git/scripts/worktree-naming.sh && _wn_deps_satisfied "$PWD/.skilled/skills/sk-doc" "$PWD"'` exits 1 in this worktree | Unmet | - |
| AC-002 | REQ-002 | Given a package declaring `@spec-kit/shared` first and `left-pad` second, with only its link present, When provisioning runs, Then it is installed, and no listed package other than `sk-doc` changes its result | The harness prints no `FAIL:` line for the `spec-kit-and-real` assertion, and the same `bash -c` call run with each of the other eight listed packages that have a `package.json` (`.skilled`, `system-spec-kit`, its `shared`, `runtime` and `runtime/cli`, `system-skill-advisor/runtime`, `sk-communication/cli-communication-projection`, `system-deep-loop/runtime`) exits 0 | Unmet | - |
| AC-003 | REQ-003 | Given the three new assertions, When the owner's harness runs, Then all pass with the old ones, and each fails when its own behavior is reverted | `bash .skilled/skills/sk-git/scripts/tests/worktree-naming.test.sh` exits 0 and prints `worktree-naming tests:` with `FAIL=0` and a `PASS` count three higher than the baseline taken before the edit (`PASS=80 FAIL=0` on 2026-09-27). With the name-choice change reverted, the same run prints `FAIL:` for `spec-kit-only` and exits 1 | Unmet | - |
| AC-004 | REQ-004 | Given the edited script, When its comment block is read, Then it states when a `@spec-kit/*` entry is checked, and it names no spec path or id | `rg -n 'spec-kit' .skilled/skills/sk-git/scripts/worktree-naming.sh` returns a comment line whose number is smaller than that of the `_wn_deps_satisfied()` line, and `rg -n -e 'specs/' -e 'REQ-[0-9]' -e 'AC-[0-9]' -e 'cli-jev' .skilled/skills/sk-git/scripts/worktree-naming.sh` returns no match | Unmet | - |
| AC-005 | REQ-005 | Given the operator's yes, When the repair runs, Then this worktree gets an `sk-doc` link that resolves inside it, and the hub check passes | The goal log records the yes and the command used. `test -e .skilled/skills/system-spec-kit/shared/dist/frontmatter/parse-frontmatter.js` exits 0 before the run. After it, `readlink .skilled/skills/sk-doc/node_modules/@spec-kit/shared` prints `../../../system-spec-kit/shared`, `(cd .skilled/skills/sk-doc/node_modules/@spec-kit/shared && pwd -P)` prints a path under this worktree's root, and `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-doc` prints `OK: parent-skill-check` and exits 0 | Unmet | - |
| AC-006 | REQ-006 | Given the finished build, When the tracked diff is listed, Then it holds only the two `sk-git` files, and the repair adds nothing tracked | `git diff --name-only -- .skilled` prints exactly `.skilled/skills/sk-git/scripts/tests/worktree-naming.test.sh` and `.skilled/skills/sk-git/scripts/worktree-naming.sh`, `git diff --quiet -- .skilled/skills/sk-git/scripts/worktree-provision-paths.txt` exits 0, and `git status --porcelain -- .skilled/skills/sk-doc` prints nothing | Unmet | - |

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

Not closeable. The phase is Planned and every criterion is Unmet until the build runs.
<!-- /ANCHOR:closure -->
