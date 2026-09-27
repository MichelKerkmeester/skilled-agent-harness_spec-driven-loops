---
title: "Goal: Closing the Review Advisories and the Codex Hook Cleanup"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/030-pi-skill-orchestrator-based-research-refinement/010-review-advisories-and-codex-cleanup"
    last_updated_at: "2026-09-27T10:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Closed every finding with a verified fix and live proof"
    next_safe_action: "None. The phase is complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-27-030-phase-010"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Closing the Review Advisories and the Codex Hook Cleanup

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Close the two items phase 9 left open, the duplicate Codex hook entries and every phase 6 review advisory, so the packet hands nothing back.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The orchestrator runs the removal-only installer and the trust repair itself, as the operator directed on 2026-09-27, and backs up both global Codex files first. |
| D2 | Trust is restored only with the hash Codex reports, through the config write its `/hooks` review makes. No other config record changes. |
| D3 | No advisor caller puts a prompt in a child's argv. Each one sends it over stdin, and the argv forms stay for people who type them. |
| D4 | A verifier observation that proves a defect in code this phase touches becomes a sibling finding in `spec.md` before any work on it starts. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `node .skilled/bin/install-codex-hooks.mjs --check` prints `OK`, and a live `codex exec` from the checkout completes 9 SessionStart, 5 UserPromptSubmit and 6 Stop hooks with one advisor record per prompt
- [ ] Codex's `hooks/list` reports every hook for the checkout as trusted, and the config diff touches only the nodeterm, orca and GitKraken SessionStart records
- [ ] Each of the twelve phase 6 advisories and the siblings N1 to N7 has a verifier PASS the orchestrator confirmed, and each behavior change has a test that fails against `05231a01ea`
- [ ] The advisor, deep-loop, spec-kit hook, Pi dispatch, plugin and pi-cache-optimizer suites exit 0 with no test lost against their recorded baselines
- [ ] The hook fallback, the OpenCode plugin and the daemon's compiled-route call each pass a test that reads the prompt from stdin and finds it in no argv element
- [ ] `validate.sh --strict --recursive` prints `RESULT: PASSED` for the parent packet, and the fixes are committed and pushed to `origin/main`
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
| Codex cleanup C1 | Done | `evidence/c1/`: installer run, trust diff and a live run with each hook started once |
| Advisory fixes | Done | The twelve advisories and N1 to N7 each have a verifier PASS. Every suite passes with no test lost, and the live checks are in `evidence/final-state/` |

### Deviations and findings

| Item | Note |
|------|------|
| R1-P2-002 wording | The first corrected comment still called the headless brief the current fallback. The verifier rejected it, because the fallback has carried a status head since the status-headed change, and a second edit names the older build instead |
| Siblings | N3 came from the `edit_lines` verifier and N4 from reading the daemon's compiled-route call while planning N2. Both were added to `spec.md` before work on them started |
| N2 verifier, budget | Accepted. JSON escaping let the request outgrow `maxPromptBytes`, and a budget below the fixed part still sent an empty prompt. The plugin now clamps by escaped size and sends nothing when no character fits |
| N2 verifier, spawn order | Rejected with evidence. It held that stdin is written before the spawn is known to succeed. With a missing binary, Node 26.8.2 and Bun 1.3.9 both raise ENOENT on the child, emit no stdin error and settle as `SPAWN_ERROR`. Waiting for the `spawn` event adds a dependency for no behavior gain. A real-spawn test now pins the path |
| N5 | Found while judging the budget finding. `advisor_recommend` refuses a prompt over 10,000 characters, so every longer prompt got the outage brief. A live Claude hook run proved it, and it went into `spec.md` before work started |
| F004 verifier | Accepted. A failed `chmod` was still remembered as done, so no later write retried it. Only a successful `chmod` is now remembered |
| N1 verifier | Accepted. The research stop-policy line sat under step 3's `convergence_mode == "off"` branch, so the default mode skipped it. It is now step `3a`, and the test checks its parent line |
| F1 verifier | Returned BLOCKED because its sandbox refused the IPC pipe `tsx` needs for one source-level step. Every gate and reverse check passed. The orchestrator ran that step outside the sandbox and got exit 64 with the expected message |
| N2 re-verifier | Returned BLOCKED on the packet's strict validation, which it ran beyond its brief while the implementation summary was still the template. Every requested check passed, and the orchestrator measured its derived claim: 5 of 5 ordinary requests are byte-identical to the old plugin's |
| F001 gap | The F1 verify brief called the dead-gate deletion verified earlier, but no verifier had run it. It got its own verification |
| N6 | Raised by the N1 re-verifier as out of scope. The research confirm step 9 lost its quality-guard body in an earlier parity edit, and the confirm file's census does not list the gap. It went into `spec.md` before work started |
| E1 verifier | Returned FAIL on two items outside the change. `write-containment.ts` carries another session's edit, and this phase never stages it. The `R1` and `R2` it flagged are fixture finding IDs in test data, the values the file's existing tests already use, not comment labels. Every functional check passed: 11 fixture pairs matched the old program and the lineage test fails against base |
| F001 | Verified on its own brief. The hunk holds only removed lines, and no reference remains outside spec history |
| N7 | Raised by the N5 verifier as out of scope. The standalone Python CLI sends its whole prompt to the native bridge. The orchestrator measured it: with `--force-native`, 15,000 characters report the native advisor unavailable while 9,990 route natively. It went into `spec.md` before work started. Its verifier passed it: the new test fails against base and against a plain character slice, and two live long prompts route natively |
| DOC verifier | Accepted one point. The CLI entry said the error path never waits on stdin, but only a bad flag is refused before the read. The sentence was corrected and passed a second review. Its punctuation point was rejected: a word-level diff shows the em dash and semicolons sit in sentences that predate this phase |
| Advisor suite, first final run | 3 job-semantics tests failed with `daemon launcher exited with code 1`. The launcher compares dist and source mtimes and refuses to build under vitest, and the verifiers' restores had left sources newer than the dist. After the dist was rebuilt, the file passed alone and the full suite passed 971 of 971 |
| Advisor daemon | The operator approved restarting the daemon that predated the fixes. It had already exited by 10:10 UTC, for a reason this session could not find, and a launcher had cold-started a new one from a rebuilt dist. The session sent no signal and proved the fixed code live instead (`evidence/final-state/live-daemon.txt`) |
| Out-of-scope drift | The `sk-code-opencode` docs describe three drift guards, and its wrapper runs two. It is outside this packet and is reported to the operator, not fixed here |
<!-- /ANCHOR:log -->
