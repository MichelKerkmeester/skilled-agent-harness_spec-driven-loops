---
title: "Tasks: Phase 13: session-signal-sweeps"
description: "Confirm each runtime's session variable, dispatch one literal brief per runtime, then rerun the suites and a live two-session probe per runtime."
trigger_phrases:
  - "session signal sweeps tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 13: session-signal-sweeps

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`DC` is `.skilled/hooks/decision-capture`. `PROBE` is the scratch two-session probe for one runtime: session A, then session B, then A resumed running the old and new sweeps.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm each variable in the installed source. Verify: Pi `bash.js` lines 166 to 171 set `PI_SESSION_ID` and `PI_SESSION_FILE`, DSH `dsh-shell-env` line 113 sets the session id, and the OpenCode binary holds `OPENCODE_SESSION_ID=V.sessionID`.
- [x] T002 Confirm DSH folder names equal header ids. Verify: three decoded headers print `true`.
- [x] T003 Confirm unified Vibe journals parse. Verify: the shared reader loads a real unified session with its one question entry.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P] OpenCode (`DC/bin/sweep-opencode.mjs`). Verify: the new test passes and the file fails on the old code.
- [x] T005 [P] Pi (`DC/bin/sweep-pi.mjs`). Verify: the new test passes and fails on the old code.
- [x] T006 [P] DSH (`DC/bin/sweep-dsh.mjs`). Verify: the new test passes and fails on the old code.
- [x] T007 [P] Vibe (`DC/bin/sweep-vibe.mjs`). Verify: the new CLI test passes and fails on the old code.
- [x] T008 Codex, after its probe (`DC/bin/sweep-codex.mjs`). Verify: the new test passes and fails on the old code.
- [x] T009 Update the README lines on session choice (`DC/README.md`, `DC/bin/README.md`). Verify: `rg -c SESSION DC/bin/README.md` counts the four new variables.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Rerun the hook suites. Verify: `node --test DC/lib/*.test.mjs DC/bin/*.test.mjs DC/claude/*.test.mjs DC/vibe/*.test.mjs` prints 0 failed.
- [x] T011 `PROBE` for OpenCode, Pi, DSH and Codex. Verify: the variable equals session A's id and the new sweep prints session A.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: four live probes read session A
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
