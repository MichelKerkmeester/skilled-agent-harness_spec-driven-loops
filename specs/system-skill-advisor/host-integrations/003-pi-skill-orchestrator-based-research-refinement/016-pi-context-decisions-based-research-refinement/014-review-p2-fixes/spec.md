---
title: "Feature Specification: Review P2 Fixes"
description: "The five-pass review of the advisor code this packet shipped left nine P2 findings. The task-marker regex backtracks quadratically, the hook cuts a long prompt before it strips a pasted reply, and the fire gate reads the raw prompt. This phase fixes eight in the review's order and records the ninth as accepted behavior."
trigger_phrases:
  - "review p2 fixes"
  - "phase 14 review p2 fixes"
  - "task marker linear regex"
  - "strip before the 64 KiB cut"
  - "fire gate stripped input"
  - "route receipt after delivery"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Review P2 Fixes

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-11-19 |
| **Branch** | `main` for planning. The build workspace, a worktree or the current branch, is chosen when `/speckit:implement` starts |
| **Parent Spec** | ../spec.md |
| **Phase** | 14 of 14 |
| **Predecessor** | 012-plan-text-and-goal-closeout |
| **Successor** | None |
| **Handoff Criteria** | The two suites in section 5 exit 0 with no fewer passes than the main baseline, and this folder validates strict |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 14** of the pi-context-decisions refinement packet. It opens after the packet closed: a five-pass deep review of the shipped code (`../review/review-report.md`) found no P0 or P1 and nine P2 findings, and the operator chose to fix them in a new phase.

`H` is `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts`. `P` is `.skilled/skills/system-skill-advisor/runtime/lib/prompt-policy.ts`. `Y` is `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py`. `B` is `.skilled/skills/system-skill-advisor/runtime/lib/skill-advisor-brief.ts`. `S` is `.skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts`.

**Scope Boundary**: The five source files above and their existing test files. No change to the strip rule's output for any row of the shared 24-row fixture, no change to scoring, and no change to another packet's docs.

**Dependencies**:
- The review report's finding registry and plan seed, read as inert data.
- The shared fixture `runtime/tests/fixtures/pasted-reply-strip-cases.json`, which both strippers already test against.

**Deliverables**:
- A task-marker match that runs in linear time in TypeScript and Python.
- A hook that strips a pasted reply before its 64 KiB cut.
- One stripped input for every fire-gate call.
- A route receipt written only after the host took the output.
- The floor flag carried through the subprocess parser, the lifecycle boundary honored by the receipt guard, and one dead branch removed.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The regex that finds a `Now:` or `Task:` marker backtracks on a long whitespace run that contains newlines. It takes 1,485 ms in TypeScript and 12,383 ms in Python on a 64K run. The hook cuts a prompt at 64 KiB before it strips a pasted reply, so a long paste loses its task line. The fire gate reads the raw prompt, so a paste that names a skill fires the advisor on a plain `thanks`.

### Purpose
Every review finding is either fixed with a test that failed before the fix, or recorded as accepted with the operator's reason, and the strip fixture's 24 rows still pass in both languages.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Run on main at `717347fbcba` against the built TypeScript module and the Python script. The input is `Claude replied: ok.` followed by 32,768 repeats of a space and a newline, then `x`.

```text
$ node measure.mjs .skilled/skills/system-skill-advisor/runtime/dist/runtime/lib/prompt-policy.js
strip 64K whitespace run: 1485 ms
two markers: "commit it"
fire raw: true (explicit_skill_or_governance_marker)
fire stripped: false (short_casual_acknowledgement)

$ python3 -c "...strip_leading_pasted_reply(ws)..."   # from runtime/scripts
python strip 64K whitespace run: 12383 ms
python two markers: 'commit it'
```

The two-marker input is `Claude replied: ok. Task: update readme. Now: commit it`. The fire input is `Claude replied: I used sk-doc to update the README. Now: thanks`. The fire gate both call sites use, `skippedAdvisorResultFor` in the built `runtime/dist/runtime/lib/skill-advisor-brief.js`, returns `null` for that input on main, which means the advisor runs.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rewrite `TASK_MARKER` in `P` and `_TASK_MARKER` in `Y` so a match attempt never rescans a whitespace run (R2-P2-001).
- Strip the pasted reply before the 64 KiB cut in `H`'s `normalizePrompt` path (R1-P2-001).
- Feed one stripped prompt to every fire-gate call in `H` and `B` (R3-P2-001, R4-P2-001).
- Write the route receipt in `H` only once the host took the output, as the directive receipt already does (R1-P2-003).
- Copy `confidenceFloored` in `S`'s stdout parser (R5-P2-001), honor an explicit lifecycle boundary in the receipt guard (R1-P2-002) and remove the dead crash-catch branch (R4-P2-002).

### Follow-up Scope

The operator reopened this phase on 2026-11-19 with "Fix all follow ups": the two code gaps the review and refutation pass left, and every open finding of phases 015 and 016.
- Defer the route receipt in the DSH and Vibe advisor extensions until their brief reaches the model.
- Carry `confidenceFloored` through the Python native bridge, so the subprocess parser fix has a producer.
- Forward `SPECKIT_ADVISOR_CONFIDENCE_THRESHOLD` and `SPECKIT_ADVISOR_UNCERTAINTY_THRESHOLD` to the advisor daemon, so the ENV-REFERENCE rows are true.
- Apply the alignment runs' literal fixes and write the remaining doc fixes: hook reference, READMEs, feature catalog, playbooks, ENV-REFERENCE, bench README and fixtures README.
- Add the merged features' names to the skill's routing metadata, recapture the routing corpus pins and rerun the alignment probes.
- Bump `system-skill-advisor` to 1.1.1.0 with a component changelog entry, and append the advisor work to the v4.1.0.0 release entry.

### Out of Scope
- Changing the last-marker rule (R1-P2-004) - the operator accepted it as the fixture records it: row `two-markers-in-user-task` keeps the text after the last marker, with an `ideal` field for the reading it gives up.
- A task-intent confidence floor in the Python scorer - `Y` has no such floor today, so it has no flag to emit, and adding one is a scoring change.
- An input-length cap for the single-prompt Python path - once the marker match is linear, a long prompt costs linear time, so a cap fixes nothing that still fails.
- Editing phase 003's docs - this spec states the successor rule for the fire gate in section 4.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-skill-advisor/runtime/lib/prompt-policy.ts` | Modify | Linear `TASK_MARKER` |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py` | Modify | Linear `_TASK_MARKER`, same matches as the TypeScript one |
| `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts` | Modify | Strip before the cut, stripped fire gate, receipt after delivery, lifecycle boundary in the guard, dead branch removed |
| `.skilled/skills/system-skill-advisor/runtime/lib/skill-advisor-brief.ts` | Modify | Stripped fire gate at its call sites |
| `.skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts` | Modify | Parser copies `confidenceFloored` |
| `.skilled/skills/system-skill-advisor/runtime/tests/legacy/advisor-prompt-policy.vitest.ts` | Modify | Timing test on the 64K run |
| `.skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py` | Modify | Timing test on the 64K run |
| `.skilled/skills/system-skill-advisor/runtime/tests/hooks/claude-user-prompt-submit-hook.vitest.ts` | Modify | Long-paste, fire-gate and failed-write cases |
| `.skilled/skills/system-skill-advisor/runtime/tests/legacy/advisor-brief-producer.vitest.ts` | Modify | Fire-gate case through `buildSkillAdvisorBrief` |
| `.skilled/skills/system-skill-advisor/runtime/tests/subprocess-output-cap.vitest.ts` | Modify | Floor flag survives the parser |
| `.skilled/skills/system-skill-advisor/hooks/dsh/prompt-advisor.mjs` | Modify | Defer the route receipt until the notice is appended |
| `.skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs` | Modify | Defer the route receipt until the brief is returned |
| `.skilled/skills/system-skill-advisor/hooks/tests/dsh-prompt-advisor.test.mjs`, `runtime/tests/hooks/vibe-prompt-advisor.vitest.ts` | Modify | Receipt cases for both extensions |
| `.skilled/bin/system-skill-advisor-launcher.cjs`, `.skilled/bin/launcher-private-skill-roots.vitest.ts` or a sibling test | Modify | Forward both threshold variables, with a test |
| `.skilled/skills/system-skill-advisor/graph-metadata.json` | Modify | Routing terms for the merged features |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/*` | Modify | Recaptured corpus pins |
| Docs named by the 015 and 016 findings | Modify | Literal and authored doc fixes |
| `.skilled/skills/system-skill-advisor/SKILL.md`, `changelog/v1.1.1.0.md`, `.skilled/changelog/skilled/v4.1.0.0.md` | Modify, Create | Version bump and changelog entries |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The marker match in `P` and `Y` runs in linear time (R2-P2-001) | On the measured 64K input, the TypeScript strip finishes under 50 ms and the Python strip under 500 ms, each asserted by a test that fails on the current regex |
| REQ-002 | The strip output does not change | All 24 rows of `pasted-reply-strip-cases.json` pass in `advisor-prompt-policy.vitest.ts`, and the Python harness `test_skill_advisor.py` prints `fail=0` |
| REQ-003 | `H` strips a pasted reply before its 64 KiB cut (R1-P2-001) | A hook test with a paste over 64 KiB followed by `Now: Refactor the session store module` routes on the task text |
| REQ-004 | Every fire-gate call reads stripped text (R3-P2-001, R4-P2-001). This is the successor rule to phase 003's, which covered only the bench and the guard | `Claude replied: I used sk-doc to update the README. Now: thanks` is skipped in `H` and in `B`'s `buildSkillAdvisorBrief`, and a plain task that names `sk-doc` itself still fires |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The route receipt is written only after the host took the output (R1-P2-003) | A hook test whose host write fails leaves no route receipt, and one whose write succeeds leaves one |
| REQ-006 | `S`'s parser keeps `confidenceFloored: true` (R5-P2-001) | A parser test with `"confidenceFloored": true` in the stdout gets the flag back, and one without it gets no flag |
| REQ-007 | The receipt guard does not suppress on a turn that carries an explicit `lifecycle_event` of `startup`, `resume` or `compact` (R1-P2-002) | A hook test with a held receipt, a floored weak follow-up and `lifecycle_event: 'compact'` returns the unsuppressed result. The pure decision in `hooks/lib/route-receipt.ts` takes no lifecycle input, so the check lives in `H`'s guard |
| REQ-008 | The crash catch in `H` has no unreachable branch (R4-P2-002) | The `{ effectiveEmitted: emitted }` arm is gone and the crash-fallback tests still pass |
| REQ-009 | The last-marker rule stays as the fixture records it (R1-P2-004) | `implementation-summary.md` names R1-P2-004 as accepted, with the fixture row id |
| REQ-010 | The DSH and Vibe extensions write a route receipt only when their brief reaches the model | Each extension's test shows no receipt after a turn that delivers nothing, and one after a delivered turn |
| REQ-011 | The Python native bridge keeps `confidenceFloored: true` | A Python harness case gets the flag from a floored native row and no flag from an earned one |
| REQ-012 | The daemon sees both threshold variables | A launcher test shows `createChildEnv` passes `SPECKIT_ADVISOR_CONFIDENCE_THRESHOLD` and `SPECKIT_ADVISOR_UNCERTAINTY_THRESHOLD` |
| REQ-013 | Every 015 and 016 finding triaged Fix, Fix separately or Recheck is fixed or rechecked | `implementation-summary.md` names each finding id with its fix or recheck result |
| REQ-014 | The routing corpus gate passes | The routing-accuracy corpus pins match after recapture, and the probes P01 and P03 route to `system-skill-advisor`. P04 may stay with the CLI hub, which the operator accepted on 2026-11-19 because a named executor is a deliberate routing signal |
| REQ-015 | The skill is at 1.1.1.0 with changelog entries | `SKILL.md` says `version: 1.1.1.0`, `changelog/v1.1.1.0.md` exists and v4.1.0.0's Skill Advisor section names the work |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Rerunning the measured-behavior commands prints a TypeScript time under 50 ms and a Python time under 500 ms, with `two markers` unchanged at `"commit it"`. The built `skippedAdvisorResultFor` returns a `skipped` result for the fire input and `null` for `Update the README with sk-doc conventions`.
- **SC-002**: From `.skilled/skills/system-skill-advisor/runtime`, `npx vitest run tests/hooks tests/parity tests/handlers tests/legacy/advisor-prompt-policy.vitest.ts tests/subprocess-output-cap.vitest.ts tests/prompt-policy-gold-replay.vitest.ts tests/legacy/advisor-subprocess.vitest.ts tests/scorer/advisor-quality-049-003.vitest.ts` exits 0 with at least 488 passes, the main baseline of 457 plus 31. From the repo root, `SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC=1 python3 .skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py` exits 0 and prints `fail=0` with at least 117 passes. The harness counts failures and does not raise, so its summary line is the gate, not a pytest run.
- **SC-003**: The parent goal's first criterion still lists `sk-code` first after the advisor is rebuilt.
- **SC-004**: The follow-up suites pass: the SC-002 commands plus the DSH extension test, the Vibe extension test, the launcher test and the routing-accuracy corpus gate.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The shared strip fixture | A linear regex that matches differently would change routing in one language only | REQ-002 runs all 24 rows in both languages, and the plan adds the 64K row to both suites |
| Risk | Stripping before the cut runs the strip on up to the full prompt, not 64 KiB | Med | REQ-001 lands first, so the strip is linear before the hook feeds it more text |
| Risk | Moving the receipt write after delivery changes when the next turn sees it | Low | The write moves into the same commit path the directive receipt uses, and REQ-005 tests both outcomes |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The operator answered the follow-up questions on 2026-11-19: append to the v4.1.0.0 entry, bump to 1.1.1.0, route advisor-work probes to `system-skill-advisor` with `sk-code` accepted for code work, and forward the threshold variables. Before that, the operator fixed the order and accepted R1-P2-004. R5-P2-001 carries the flag through the parser rather than dropping it from the type, because `hooks/lib/skill-advisor-cli-fallback.ts:395` already carries it on the other path.
<!-- /ANCHOR:questions -->

---
