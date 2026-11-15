---
title: "Feature Specification: Phase 19: vibe-relaunch-command-tier"
description: "The session-relaunch loop knows six runtimes and Vibe is not one of them, so a Vibe session that fills its context cannot hand off to a fresh session that claims the note. This phase adds Vibe on the command-only tier Cursor and Devin use: the operator runs the handoff command, exits, and the wrapper starts a fresh vibe session from the seed."
trigger_phrases:
  - "vibe relaunch command tier"
  - "phase 19 vibe relaunch command tier"
  - "skilled-loop vibe"
  - "vibe session relaunch"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 19: vibe-relaunch-command-tier

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | In Progress |
| **Created** | 2026-11-14 |
| **Branch** | `worktrees/383-mistral-vibe-runtime` |
| **Parent Spec** | ../spec.md |
| **Phase** | 19 of 21 |
| **Predecessor** | 018-vibe-compaction-context |
| **Successor** | 020-vibe-dispatch-hardening |
| **Handoff Criteria** | `RUNTIMES` lists `vibe`, the relaunch suites pass, and one manual Vibe hop records a claim in the hop history |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 19** of the Mistral Vibe runtime mode build specification.

**Scope Boundary**: The command-only relaunch tier for Vibe: the runtime list, the wrapper's launch case, the prepare message, the README row and their tests. No hook arms or ends a Vibe session.

**Dependencies**:
- The existing relaunch loop: `.skilled/bin/skilled-loop`, `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs` and `lib/relaunch-core.cjs`.
- `.vibe/prompts/speckit-handoff.md`, the command surface the Vibe session already has.
- Phase 015's turn-start composer, only if T011 shows the seed claim needs a hook part.
- `MISTRAL_API_KEY` for the manual hop and the resume probe.

**Deliverables**:
- `vibe` accepted by the relaunch CLI and launched by `skilled-loop`.
- A Vibe row in the relaunch README runtime matrix marked COMMAND-ONLY.
- A recorded manual hop and a recorded `--resume` probe in `scratch/`.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`relaunch-core.cjs:35` freezes the loop's runtimes as `claude pi opencode codex cursor devin`, and `skilled-loop` has no `vibe` case, so `skilled-loop vibe` falls through to Claude and `session-relaunch.cjs` refuses `--runtime vibe`. A Vibe session that fills its context therefore cannot hand off: the operator starts a new `vibe` by hand and pastes the claim instructions, even though `.vibe/prompts/speckit-handoff.md` already gives the session the handoff command.

### Purpose
A Vibe session started through `skilled-loop vibe` hands off to a fresh Vibe session that claims the note, on the same command-only tier Cursor and Devin use.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ node -e 'console.log(require("./.skilled/hooks/session-relaunch/lib/relaunch-core.cjs").RUNTIMES.join(" "))'
claude pi opencode codex cursor devin
$ rg -c '\bvibe\b' .skilled/bin/skilled-loop; echo "exit=$?"
exit=1
$ ls .vibe/prompts/speckit-handoff.md
.vibe/prompts/speckit-handoff.md
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `vibe` to the frozen runtime list in `lib/relaunch-core.cjs`, so every CLI command accepts `--runtime vibe`.
- Add a `vibe` case to `skilled-loop`'s runtime selection and launch arguments that starts `vibe "<seed>"`, with the seed as the `INITIAL_PROMPT` argument `vibe --help` documents. No `--model` flag: `vibe --help` documents `--model` as headless-only, so an interactive relaunch keeps the config's `active_model`.
- Add Vibe to the "nothing ends this session" prepare message beside Cursor and Devin (`session-relaunch.cjs:611`), because no Vibe hook ends the session.
- Add the Vibe row to the relaunch README runtime matrix, marked COMMAND-ONLY, and a wrapper launch-arguments test case.
- Probe `vibe -p --resume <session_id>` once on a keyed headless run and record whether it continues a run that stopped on a limit.

### Out of Scope
- The automatic tier (a `notification` hook on `turn_completed` that arms the hop and a detached killer that ends the session) - Vibe runs here mostly as a headless child, the relaunch loop skips `AI_SESSION_CHILD=1` workers by design (`.skilled/hooks/session-relaunch/README.md:225`), and Vibe compacts on its own, so the automatic tier pays for little. How interactive Vibe exits on SIGTERM is also UNVERIFIED.
- A turn-start claim or withdraw hook part - Cursor and Devin carry the claim in the seed with no hook; a part is added only if T011 shows the seed claim fails.
- Context-fill nudges - they need a per-request seam and the context-usage reader; this tier has the operator decide when to hand off.
- Correcting the cli-mistral-vibe references with the resume result - phase 021 owns those doc lines and cites this phase's probe.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` | Modify | `vibe` in `RUNTIMES` |
| `.skilled/bin/skilled-loop` | Modify | `vibe` runtime case and launch arguments; Vibe options in the value-taking option tables |
| `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs` | Modify | Vibe joins the command-only prepare message |
| `.skilled/hooks/session-relaunch/README.md` | Modify | Vibe matrix row, COMMAND-ONLY |
| `.skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-launch-arguments.test.cjs` | Modify | A Vibe launch-arguments case |
| `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` | Modify | The frozen list assertion includes `vibe` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The relaunch CLI accepts Vibe | The `RUNTIMES` print in Measured Behavior ends with `vibe`, and `node --test .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` prints `fail 0` |
| REQ-002 | `skilled-loop vibe` launches Vibe with the seed as the initial prompt | The wrapper launch-arguments test's Vibe case asserts the argument list `vibe <seed>` with no `--model`, and the suite prints `fail 0` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | A manual Vibe hop claims its note | One hop under `skilled-loop vibe`: `/speckit-handoff` prepares, the prepare line says nothing ends the session, the operator exits, and `session-relaunch.cjs history` shows the receiver's claim with runtime `vibe` |
| REQ-004 | A dispatched Vibe child never claims or nudges | With `AI_SESSION_CHILD=1`, the relaunch CLI's child check returns `child-session` for runtime `vibe` in a test |
| REQ-005 | The headless resume path is recorded | `scratch/resume-probe.md` holds the command, exit code and verdict of one keyed `vibe -p --resume <session_id>` run |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node --test .skilled/hooks/session-relaunch/tests/*.test.cjs` prints `fail 0`.
- **SC-002**: `node .skilled/hooks/session-relaunch/bin/session-relaunch.cjs history` shows one claimed hop with runtime `vibe`, recorded in `scratch/manual-hop.md`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `MISTRAL_API_KEY` for the manual hop and the resume probe | Med: REQ-003 and REQ-005 cannot run without it | The suites prove REQ-001, REQ-002 and REQ-004 offline; the two runs wait for the key |
| Risk | `skilled-loop`'s option tables (lines 582-706) do not know which Vibe options take a value, so a replayed launch line could swallow the seed | Med | T002 records `vibe --help`'s value-taking options and T006 adds them to the tables; the launch-arguments test covers one value option |
| Risk | A Vibe session started without `VIBE_SPEC_FOLDER` gets no goal slice at start | Low | Open question; the claim seed names the spec folder either way |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should `skilled-loop vibe` export `VIBE_SPEC_FOLDER` from the claimed note, so the session-start hook injects the goal slice in the relaunched session? Decide in T011 from the manual hop.
- Does `vibe -p --resume <session_id>` continue a headless run that stopped on a budget? UNVERIFIED until T013 runs it.
<!-- /ANCHOR:questions -->

---
