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
    last_updated_at: "2026-09-27T13:30:00Z"
    last_updated_by: "build-018"
    recent_action: "Recorded the approved sk-doc repair and closed every criterion"
    next_safe_action: "None. The phase is closed; the orchestrator commits"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "owner-fix-018-planning"
      parent_session_id: null
    completion_pct: 100
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
**Status:** Complete
**Date:** 2026-09-27
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a package whose only dependency is `"@spec-kit/shared": "file:../shared"` and no link on disk, When provisioning runs twice, Then the first run installs it and the second skips it, and a real package in the same state reads unsatisfied | `bash .skilled/skills/sk-git/scripts/tests/worktree-naming.test.sh` prints no `FAIL:` line for the `spec-kit-only` assertion, and before the repair `bash -c 'source .skilled/skills/sk-git/scripts/worktree-naming.sh && _wn_deps_satisfied "$PWD/.skilled/skills/sk-doc" "$PWD"'` exits 1 in this worktree. Observed 2026-09-27: the harness printed no `FAIL:` line (`PASS=83 FAIL=0`, exit 0), and the `bash -c` call for `sk-doc` exited 1. Evidence: `.skilled/skills/sk-git/scripts/worktree-naming.sh:490`, `.skilled/skills/sk-git/scripts/tests/worktree-naming.test.sh:292` | Met | - |
| AC-002 | REQ-002 | Given a package declaring `@spec-kit/shared` first and `left-pad` second, with only its link present, When provisioning runs, Then it is installed, and no listed package other than `sk-doc` changes its result | The harness prints no `FAIL:` line for the `spec-kit-and-real` assertion, and the same `bash -c` call run with each of the other eight listed packages that have a `package.json` (`.skilled`, `system-spec-kit`, its `shared`, `runtime` and `runtime/cli`, `system-skill-advisor/runtime`, `sk-communication/cli-communication-projection`, `system-deep-loop/runtime`) exits 0. Observed 2026-09-27: no `FAIL:` line in the harness, and the `bash -c` call exited 0 for each of the eight. Evidence: `.skilled/skills/sk-git/scripts/worktree-naming.sh:489`, `.skilled/skills/sk-git/scripts/tests/worktree-naming.test.sh:293` | Met | - |
| AC-003 | REQ-003 | Given the three new assertions, When the owner's harness runs, Then all pass with the old ones, and each fails when its own behavior is reverted | `bash .skilled/skills/sk-git/scripts/tests/worktree-naming.test.sh` exits 0 and prints `worktree-naming tests:` with `FAIL=0` and a `PASS` count three higher than the baseline taken before the edit (`PASS=80 FAIL=0` on 2026-09-27). With the name-choice change reverted, the same run prints `FAIL:` for `spec-kit-only` and exits 1. Observed 2026-09-27: `worktree-naming tests: PASS=83 FAIL=0`, exit 0, against the pre-edit `PASS=80 FAIL=0`. Reverted name choice: `FAIL: spec-kit-only installs once across both runs (exp='1' got='0')`, `PASS=82 FAIL=1`, exit 1. Filter removed: `FAIL: spec-kit-and-real installs although its link was present`, exit 1. A package declaring nothing made unsatisfied: `FAIL: needs-build declares nothing and is never installed (exp='0' got='2')`, exit 1. Evidence: `.skilled/skills/sk-git/scripts/tests/worktree-naming.test.sh:292`, `.skilled/skills/sk-git/scripts/tests/worktree-naming.test.sh:293`, `.skilled/skills/sk-git/scripts/tests/worktree-naming.test.sh:294` | Met | - |
| AC-004 | REQ-004 | Given the edited script, When its comment block is read, Then it states when a `@spec-kit/*` entry is checked, and it names no spec path or id | `rg -n 'spec-kit' .skilled/skills/sk-git/scripts/worktree-naming.sh` returns a comment line whose number is smaller than that of the `_wn_deps_satisfied()` line, and `rg -n -e 'specs/' -e 'REQ-[0-9]' -e 'AC-[0-9]' -e 'cli-jev' .skilled/skills/sk-git/scripts/worktree-naming.sh` returns no match. Observed 2026-09-27: `rg -n 'spec-kit'` returns comment line 478, and `_wn_deps_satisfied()` is line 481. The hygiene search exits 1 with no match, and the same pattern counts 10 lines in this phase's `spec.md`. Evidence: `.skilled/skills/sk-git/scripts/worktree-naming.sh:478` | Met | - |
| AC-005 | REQ-005 | Given the operator's yes, When the repair runs, Then this worktree gets an `sk-doc` link that resolves inside it, and the hub check passes | The goal log records the yes and the command used. `test -e .skilled/skills/system-spec-kit/shared/dist/frontmatter/parse-frontmatter.js` exits 0 before the run. After it, `readlink .skilled/skills/sk-doc/node_modules/@spec-kit/shared` prints `../../../system-spec-kit/shared`, `(cd .skilled/skills/sk-doc/node_modules/@spec-kit/shared && pwd -P)` prints a path under this worktree's root, and `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-doc` prints `OK: parent-skill-check` and exits 0. Observed 2026-09-27: the operator said yes, the dist precheck passed, and the orchestrator ran `bash .skilled/skills/sk-git/scripts/worktree-naming.sh provision` after the operator's yes on 2026-09-27. It printed `provisioning .skilled/skills/sk-doc (ci)` and `provisioned: 1 installed, 0 built, 8 already present, 0 failed`, exit 0. A second run printed `provisioned: 0 installed, 0 built, 9 already present, 0 failed`. `readlink` prints `../../../system-spec-kit/shared`, `pwd -P` prints this worktree's `.skilled/skills/system-spec-kit/shared`, and `parent-skill-check.cjs .skilled/skills/sk-doc` prints `OK: parent-skill-check` and exits 0, loading the require at `.skilled/skills/sk-doc/sk-create-skill/scripts/lib/root-router-contract.cjs:65` | Met | - |
| AC-006 | REQ-006 | Given the finished build, When the tracked diff is listed, Then it holds only the two `sk-git` files, and the repair adds nothing tracked | `git diff --name-only -- .skilled` prints exactly `.skilled/skills/sk-git/scripts/tests/worktree-naming.test.sh` and `.skilled/skills/sk-git/scripts/worktree-naming.sh`, `git diff --quiet -- .skilled/skills/sk-git/scripts/worktree-provision-paths.txt` exits 0, and `git status --porcelain -- .skilled/skills/sk-doc` prints nothing. Observed 2026-09-27 after the build and before the repair: `git diff --name-only -- .skilled` printed exactly the two files, the `git diff --quiet` call exited 0, and the `sk-doc` status printed nothing. After the repair, `git status --porcelain -- .skilled/skills/sk-doc` still prints nothing and `git status --porcelain -- .skilled` lists only the two `sk-git` files. Evidence: `.skilled/skills/sk-git/scripts/worktree-naming.sh:488` and `.skilled/skills/sk-git/scripts/tests/worktree-naming.test.sh:292` are the only edited regions | Met | - |

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

Closeable. All six criteria are Met with observed evidence: the build closed AC-001 to AC-004 and AC-006, and the operator-approved repair closed AC-005.
<!-- /ANCHOR:closure -->
