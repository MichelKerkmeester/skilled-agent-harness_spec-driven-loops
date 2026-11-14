---
title: "Decision Record: Phase 5: hub-router-alignment"
description: "Why the battery criterion reads its real pass line, why the loop shell shim lost one blank line and why the Pi entry files keep one line each."
trigger_phrases:
  - "hub router alignment decision record"
  - "pi entry file header decision"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/hub-architecture/006-sk-code-audit-remediation/005-hub-router-alignment"
    last_updated_at: "2026-11-14T15:55:00Z"
    last_updated_by: "implement-workflow"
    recent_action: "Recorded ADR-001 to ADR-003 and two operator answers"
    next_safe_action: "None, the phase is closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cb575834-612f-4e84-bf49-84990f162157"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: Phase 5: hub-router-alignment

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: The battery criterion reads the pass line the battery prints

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-14 |
| **Deciders** | The implementing session, reported to the operator at close |

---

<!-- ANCHOR:adr-001-context -->
### Context

REQ-003 and AC-003 ask for a battery run that ends with `STATUS=PASS failed=0`. The battery has never printed that line. `sk-code-setup-check.cjs` prints `STATUS=OK legs=9` when every leg passes and `STATUS=FAIL failed=<n> skipped=<n>` when one does not. The plan was written while the battery was failing, so the pass line was a guess.

### Constraints

- `sk-code-setup-check.test.cjs` asserts `STATUS=OK legs=9`, and `doctor-sk-code-setup.yaml` reads the same line.
- Parent decision D4 allows no script refactor.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Read AC-003 as met in substance when the battery ends with `STATUS=OK legs=9` and exits 0, and mark the row `Superseded`.

**How it works**: The script is unchanged. The acceptance row records the observed line and names this decision. The parent goal's third criterion quotes the same guessed line, and the close-out reports that to the operator.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Accept the real pass line** | No contract changes, and the criterion's intent holds | The literal string in three documents stays wrong | 8/10 |
| Change the script to print `STATUS=PASS failed=0` | The criterion passes as written | Breaks one test and the doctor workflow that read `STATUS=OK` | 2/10 |

**Why this one**: The criterion exists to prove a green battery. The battery is green, and its own tests define what green prints.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The battery's output contract and its 17 tests stay as they are.

**What it costs**:
- A reader who greps for `STATUS=PASS` finds nothing. Mitigation: AC-003 and the implementation summary quote the real line.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The operator wants the literal string | L | The close-out names this decision, and reversing it is one line in the script plus its test |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The literal criterion cannot be met without changing the script |
| 2 | **Beyond Local Maxima?** | PASS | The script change was costed against its test and its workflow |
| 3 | **Sufficient?** | PASS | One acceptance row changes |
| 4 | **Fits Goal?** | PASS | The battery passes with an exit status that agrees |
| 5 | **Open Horizons?** | PASS | The script can still be changed later |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `acceptance-criteria.md` row AC-003 is `Superseded` and names ADR-001.

**How to roll back**: Set AC-003 back to `Unmet` and change line 409 of `sk-code-setup-check.cjs` with its test.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: The loop shell shim loses one blank line and gains no `set`

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-14 |
| **Deciders** | Michel Kerkmeester, operator |

---

<!-- ANCHOR:adr-002-context -->
### Context

The plan adds strict mode to `.skilled/bin/skilled-loop-shell.sh`. The file is sourced into the operator's interactive shell, and its header says it sets no option there. A top-level `set -uo pipefail` would turn on nounset and pipefail in that shell. The file already declared `set -uo pipefail` on line 81, inside the subshell function `skilled_loop_resolve`. The guard reads the first 80 lines, so it missed the declaration by one line.

### Constraints

- The shim must not change the operator's shell options.
- Parent decision D5 lets this file change only on the operator's answer.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: Delete the blank line between the end of `skilled_loop_real_path` and the comment that follows it.

**How it works**: The existing declaration moves to line 80, inside the guard's window. No line of code changes.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Remove one blank line** | No behaviour change, one file | A line added above line 80 later brings the error back | 7/10 |
| Widen the guard window | The shim is untouched | Relaxes the rule for every shell file | 5/10 |
| Add a top-level `set` | Matches the plan | Changes the operator's interactive shell | 1/10 |
| Leave the error | No change | The battery stays red | 1/10 |

**Why this one**: It is the only option that clears the error and changes no behaviour anywhere.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- The drift guard reports no `SH-STRICT-MODE` error for the shim.

**What it costs**:
- The fix depends on a line count. Mitigation: the guard fails again the moment the declaration leaves the window, and its message names the file.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A later edit pushes the declaration past line 80 | L | The drift guard is a pre-commit gate and a battery leg |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The guard error kept the battery red |
| 2 | **Beyond Local Maxima?** | PASS | Three options were put to the operator |
| 3 | **Sufficient?** | PASS | One deleted line |
| 4 | **Fits Goal?** | PASS | `bash -n` exits 0, and the shim's 37 tests pass |
| 5 | **Open Horizons?** | PASS | The guard window can still be widened later |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `.skilled/bin/skilled-loop-shell.sh` loses the blank line that was line 50.

**How to roll back**: Put the blank line back after the closing brace of `skilled_loop_real_path`.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: The guard skips the header rule for a one-line re-export file

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-14 |
| **Deciders** | Michel Kerkmeester, operator |

---

<!-- ANCHOR:adr-003-context -->
### Context

The operator's first answer was to add a module header to the 22 files in `.pi/extensions/`. An earlier session did that. The pre-commit mirror-parity gate then blocked the commit. `sync-hook-registrations.cjs` requires each of those files to be exactly one `export { default } from '<path>';` line, and `.pi/README.md`, `.pi/SYNC.md` and a CI workflow rely on the same rule. The two rules cannot both hold for those files.

### Constraints

- The mirror check is a shared contract outside the hub.
- The drift guard is the hub's own script, and it already skips the header rule for compiler-emitted declaration files.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: Revert the 22 headers and make `verify_alignment_drift.py` skip the module header rule for a file whose only content is one default re-export line.

**How it works**: `is_single_line_reexport` returns true when a file's one non-blank line matches the re-export pattern. `check_typescript` returns no finding for such a file. A file with a second statement still needs the header, and one test holds both cases.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Exempt the one-line re-export in the guard** | Stays inside the hub and keeps the Pi contract | The header rule has a second exception | 8/10 |
| Allow comment lines in the mirror check | The 22 headers stay | Changes a shared contract, its test and two documents outside the hub | 4/10 |
| Bypass the gate once | Nothing to build | The gate and the CI check fail for every later commit to those files | 1/10 |

**Why this one**: An entry file with one re-export has no module body for a header to describe, and the rule that fixes its shape is older and wider than the header rule.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- The drift guard and the mirror check both pass on the same tree.

**What it costs**:
- The TypeScript header rule has two exceptions. Mitigation: the TypeScript checklist and the style guide both state the second one.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A real module hides behind the exemption | L | The pattern matches only a file whose single line is a default re-export |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The commit was blocked with the headers, and the battery was red without them |
| 2 | **Beyond Local Maxima?** | PASS | Three options were put to the operator |
| 3 | **Sufficient?** | PASS | One function, one condition and one test |
| 4 | **Fits Goal?** | PASS | The guard prints 0 errors, and the mirror check passes with 22 extensions |
| 5 | **Open Horizons?** | PASS | The mirror pattern can still be widened later |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- `verify_alignment_drift.py` gains `SINGLE_REEXPORT_PATTERN` and `is_single_line_reexport`, called from `check_typescript`.
- `test_verify_alignment_drift.py` gains one test.
- `typescript-checklist.md` and the TypeScript style guide state the exemption.
- The 22 files in `.pi/extensions/` are back to their committed content.

**How to roll back**: Delete the function and its call. The guard then reports the 22 files again.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Remove one line from the loop shell shim | A top-level `set` would change the operator's own shell | The plan's "add strict mode" for T013 | ADR-002 |
| Q002 | Exempt the Pi entry files in the guard | The mirror-parity gate requires each file to be one re-export line | The earlier answer to add 22 headers, T012 as written | ADR-003 |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001

Question: The last drift-guard error is `.skilled/bin/skilled-loop-shell.sh`: it already has `set -uo pipefail` on line 81 (inside the `skilled_loop_resolve` subshell), but the guard only reads the first 80 lines. The plan's fix, a top-level `set`, would switch on nounset and pipefail in your own interactive shell, so I will not do that. How should phase 005 clear this error?

Options: `Remove one line (Recommended)`, `Widen the guard window`, `Leave the error`.

Answer, 2026-11-14: `Remove one line (Recommended)`

### Q002

Question: LOGIC-SYNC: your earlier answer (add a MODULE header to the 22 `.pi/extensions/*.ts` files) contradicts the pre-commit mirror-parity gate, which requires each of those files to be exactly a one-line re-export (`sync-hook-registrations.cjs`, also documented in `.pi/README.md` and `.pi/SYNC.md` and run in CI). With the headers the phase 005 commit is blocked; without them the sk-code drift guard fails on 22 files. Which rule gives way?

Options: `Exempt them in the guard (Recommended)`, `Allow headers in the mirror check`, `Bypass the gate once`.

Answer, 2026-11-14: `Exempt them in the guard (Recommended)`
<!-- /ANCHOR:operator-answers-verbatim -->

---
