---
title: "Goal: Phase 38: pi-classifier-transport-integration"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "pi classifier transport integration goal"
  - "jev transport switch goal"
  - "pi transport integration criteria"
  - "choice transport opt-in goal"
  - "pi transport follow-up list"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/038-pi-classifier-transport-integration"
    last_updated_at: "2026-09-30T19:47:37Z"
    last_updated_by: "markdown-leaf"
    recent_action: "Ticked all five criteria from the build's evidence and recorded the closure"
    next_safe_action: "None. The orchestrator commits the build and the phase docs path-scoped"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/038-pi-classifier-transport-integration/spec.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/038-pi-classifier-transport-integration/plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-038-pi-classifier-transport-integration"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 38: pi-classifier-transport-integration

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make Pi's native classifier runtime an opt-in transport for Jev `choice` questions, and teach cli-pi workers to use it, without changing today's default.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The jev CLI stays the default. Pi answers only when a caller or the environment asks for it by name |
| D2 | Only `choice` moves, as 037 measured. `bool` and `score` stay on the CLI until each passes its own run under 037's keep rule |
| D3 | The transport returns the shape callers get from the jev CLI today. A caller that opts in changes one call, not its parsing |
| D4 | When Pi is asked for but its gate fails, the transport prints one skip line and does what `spec.md` fixes. It never switches silently |
| D5 | Pi's own store holds every credential. The transport never reads, prints or passes a key. Runtime trees owned by other packets are not edited |
| D6 | Executors follow parent D5: DeepSeek writes, SWE 2 max or Luna 6 max reviews, no MiMo or Claude workers. Fix P0 and P1, record P2 |
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] With the switch off, every changed caller prints what it printed before, byte for byte, on a stub-backed run
- [x] With the switch on, the transport answers a `choice` question through Pi and returns the CLI's result shape, proved by tests with both backends stubbed
- [x] A failed Pi gate prints one skip line and follows the rule in `spec.md`, proved by a test for each gate
- [x] `cli-jev` and `cli-pi/SKILL.md` document the Pi route, and `validate_document.py` is VALID on every changed doc
- [x] Runtime-tree callers are listed as a follow-up with file paths, and `validate.sh --strict` passes for this phase
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Spec authored | Done | 2026-09-30, docs only, from `scratch/context/context.md`, the 037 verdict and the operator's "Plan the integration". Status Planned, Level 2, priority P1. No build exists |
| Build | Done | The working tree at HEAD `c5c72d31ec`: M1 the design read and the module with its tests (design steps 1 to 5, `.skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs` and its 22-row suite), M2 the two caller opt-ins with their before and after recordings (steps 6 and 7, `leaf-route-replay.cjs` and `score-clarify-default.cjs`, one call site each), M3 the docs (steps 8 to 12: `cli-jev` 0.1.3.0, `cli-pi` 1.5.13.0, the catalog entry and the playbook scenario with their index rows), with the env-switch test added after review. DeepSeek V4.1 Flash wrote every batch, all STATUS DONE |
| Review | Done | SWE 2 max on cli-devin, `scratch/verify/review-swe2-r1.txt`, 979 s: `VERDICT: PASS` with all five criteria met. Four P2s, none open at closure: the `calls.jsonl` backend field and the unpinned Pi version recorded, the env-switch test fixed, the stub closure docs closed by this record. No open P0 or P1 |
| Gates | Done | `scratch/verify/`: both before and after recordings byte-identical (59 and 202 lines); `transport-tests.txt` 22 pass, 0 fail; `leaf-route-replay-tests.txt` 37 pass and `score-clarify-default-tests.txt` 28 pass, equal to baseline; the REQ-006 key grep exit 1 and the three runtime-tree diffs empty; 9 changed docs VALID; `g.txt` all hubs fresh, `l.txt` 15 of 15, `df.txt` 15 of 15, `h.txt` 72 in sync |
| Closure | Done | This pass: all five criteria ticked, `repair-derived.cjs --apply`, `validate.sh --strict --recursive` `RESULT: PASSED`, `check-goal.cjs` `RESULT: PASSED (5/5 checks)` and `goal.cjs packet` `packet_durable_chars=2146` on this phase with `packet_budget=ok` on the parent |

### Deviations and findings

| Item | Note |
|------|------|
| Planned state (2026-09-30) | At authoring, nothing is built and the five completion criteria are open. The five open questions in `spec.md` section 10 each carry a proposed answer, and the gate-failure rule in `spec.md` section 4 is fixed at spec approval, before any wiring |
| Basis | 037's one approved live run printed `verdict pi-transport: adopt K=111 M=111 coverage=100.0 agreement=95.5 median_abs_dp=0.0100 p95_ms=340/387 cost_per_100=0.0022` for `choice` only, on Pi 0.99.1 `openrouter` `typesafe/jev-1.13` against the CLI's `official` `jev-1.13.0`, and it holds on a one-row margin (`../037-pi-native-classifier-transport/scratch/live-run.stdout.txt`) |
| Out of scope | Any edit under the system-deep-loop, system-skill-advisor or system-spec-kit runtime trees, adopting `bool` or `score` without their own measured run, installing anything, and changing the default transport (D1, D2, parent D7) |
| Executor roster change mid-build (2026-09-30) | The operator dropped MiMo and the LLM Gateway fallback, keeping DeepSeek V4.1 Flash on cli-pi and moving reviews to SWE 2 max on cli-devin or Luna 6 max fast on cli-codex. The MiMo review that had started was stopped before it reported, and SWE 2 max reviewed once at the end. The roster amendment is commit `c5c72d31ec`, and D6 carries the change |
<!-- /ANCHOR:log -->

---
