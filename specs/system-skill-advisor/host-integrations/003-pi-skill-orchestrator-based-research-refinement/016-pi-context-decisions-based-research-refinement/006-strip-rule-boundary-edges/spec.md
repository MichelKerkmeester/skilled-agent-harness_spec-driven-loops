---
title: "Feature Specification: Strip-Rule Boundary Edges"
description: "The pasted-reply strip drops a user's own quoted requirement, cuts a pasted reply at a task marker inside it and misses an Assistant response header. This phase fixes the three edges behind red-first tests read from one shared case fixture, with no new strip on the routing corpus."
trigger_phrases:
  - "strip rule boundary edges"
  - "phase 6 strip rule boundary edges"
  - "pasted reply strip edges"
  - "pasted reply strip shared fixture"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Strip-Rule Boundary Edges

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-18 |
| **Branch** | `worktrees/474-advisor-pasted-context-and-crash-fallback` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 13 |
| **Predecessor** | 003-follow-up-routing-benchmark |
| **Successor** | 007-python-scorer-strip-parity |
| **Handoff Criteria** | The fixture-driven strip test passes, the corpus count shows no strip beyond `rr-paste-208`, the corpus gates are green and the follow-up bench still prints `N` 9 and `H` 5. Phase 007 ports this final rule to Python and reads the same fixture |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the pi-context-decisions refinement packet and the first closure phase. It fixes refutation findings 1 to 3 from the phase 002 build, recorded in `tmp/p002-briefs/out/last-refute.txt` at the repository root. Every later closure phase consumes the strip rule, so this phase builds first.

Paths are relative to `.skilled/skills/system-skill-advisor/` unless they start with a dot.

**Scope Boundary**: The cue and marker regexes and the one-pass helper in `runtime/lib/prompt-policy.ts`, one fixture-driven test and one shared fixture. The exported name `stripLeadingPastedReply` and its three call sites stay as they are.

**Dependencies**:
- `stripLeadingPastedReply` at `runtime/lib/prompt-policy.ts:242-249`, called by the handler (`runtime/handlers/advisor-recommend.ts:536`), the scorer entry (`runtime/lib/scorer/fusion.ts:1277`) and the bench (`runtime/bench/scorer-calibration.bench.ts:231`, `:276`).

**Deliverables**:
- A cue that needs an attribution header and also reads `Assistant response:` style headers.
- A marker choice made by the tests, the corpus count and a tie-break fixed in advance.
- One JSON fixture of input and expected-output pairs, read by the TypeScript test now and by the Python test in phase 007.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The cue at `runtime/lib/prompt-policy.ts:225` fires on a leading `>`, `"` or `“` alone, so a user's own quoted requirement before `Task:` is dropped as if it were pasted. The helper at `:228-234` cuts at the first task marker it finds (`:230`), so a reply that itself holds `Task:` keeps its tail and the pasted skill names leak back into scoring. The cue lists only reported-speech verbs after `you`, `the assistant` or `claude` (`:225`), so a header such as `Assistant response:` is not seen and the whole reply is scored. No test reads `stripLeadingPastedReply` today: `rg -n stripLeadingPastedReply runtime/tests` prints nothing, and the phase 002 cases live only in a scratch script.

### Purpose
The strip removes a pasted reply only when an attribution header proves it is one, removes all of it, and every case the rule must honor sits in one fixture both scorers read.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Run on 2026-11-18 from the repository root. `rule.cjs` is the phase 002 scratch copy of the shipped rule. `shipped-rule-new-cases.cjs`, `candidate-rules.cjs`, `score-miss-outputs.mjs` and `count-corpus-strips.mjs` are in this phase's `scratch/` folder.

```text
$ node scratch/shipped-rule-new-cases.cjs
"Refactor the session store module to remove duplicated locking code."
"Create a README with sk-doc. Now: Refactor the session store module to remove duplicated locking code."
"Assistant response: I updated the README with sk-doc conventions and committed it with sk-git. Task: Refactor the session store module to remove duplicated locking code."
"Refactor the session store module. Now: also update its tests."

$ node scratch/candidate-rules.cjs <runtime>/scripts/routing-accuracy <runtime>/scripts/fixtures
first-marker misses=1 ["markerInReply=>\"Create a README with sk-doc. Now: Refactor the session store module to remove duplicated locking code.\""] corpus=701 changed=["rr-paste-208"]
last-marker  misses=1 ["twoMarkersUser=>\"also update its tests.\""] corpus=701 changed=["rr-paste-208"]
harder current corpus=24 changed=0
harder first-marker corpus=24 changed=0
harder last-marker corpus=24 changed=0

$ SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC=1 node scratch/score-miss-outputs.mjs "$PWD"
"Create a README with sk-doc. Now: Refactor the session store module to remove duplicated locking code." -> sk-doc [["sk-doc",0.95],["sk-code",0.82],["system-spec-kit",0.82]]
"Refactor the session store module to remove duplicated locking code." -> sk-code [["sk-code",0.82],["sk-doc",0.82],["cli-external-orchestration",0.82]]
"also update its tests." -> sk-code [["sk-code",0.82]]
"Refactor the session store module. Now: also update its tests." -> sk-code [["sk-code",0.82],["sk-doc",0.82]]

$ node scratch/count-corpus-strips.mjs
{"jsonl":701,"jsonlChanged":["rr-paste-208"],"harder":24,"harderChanged":[]}

$ SPECKIT_RUN_BENCHES=true npx vitest run bench/scorer-calibration.bench.ts --reporter=verbose   # from runtime/
advisor-scorer-calibration {"corpusSha":"18bc5977...","corpusRows":196,"brierScore":0.214279,"expectedCalibrationError":0.136104,...}
"floored":{"correct":29,"wrong":11,"workIntent":27,"workIntentCorrect":19,"collateral":19,...}
"N":9 "H":5 "Hsame":2
 Test Files  1 passed (1)
```

The shipped rule fails the first three new cases and passes the fourth. The two marker candidates use the cue in `plan.md`. Each misses exactly one of the two marker cases and changes no corpus prompt beyond `rr-paste-208`, so the tests and the corpus count tie. The scorer separates them. First-marker's miss routes `sk-doc`, the failure the strip exists to stop. Last-marker's miss still routes `sk-code`. The bench's ECE reads 0.136104 here and 0.136108 in phase 003's record before any change, so the bench check compares against this run.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Replace the cue so it needs an attribution header and also matches `assistant` or `claude` followed by `response`, `reply` or `answer`. A leading `>`, `"` or `“` is no longer a cue by itself.
- Pick first-marker or last-marker by the fixture run, the corpus count and the tie-break in `plan.md` section 3. Record the case the chosen rule still misses.
- Create `runtime/tests/fixtures/pasted-reply-strip-cases.json` with every phase 002 case and the new cases as input and expected-output pairs.
- Add one fixture-driven `describe` block to `runtime/tests/legacy/advisor-prompt-policy.vitest.ts` that checks each expected output and that a second call changes nothing.
- Rerun the corpus count, the corpus gates and the follow-up bench. Recapture baselines only if routing moves.

### Out of Scope
- The Python local scorer - phase 007 ports the final rule and reads this fixture.
- Compiled routes and typed commands reading the raw prompt (refutation finding 4) - phase 008.
- A quote character or `>` in front of an attribution header - no case shows one. See Open Questions.
- Renaming `stripLeadingPastedReply` or moving its call sites - the handler, the scorer and the bench import the current name.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `runtime/lib/prompt-policy.ts` | Modify | New `PASTED_REPLY_CUE`, and the marker choice in `TASK_MARKER` and `stripPastedReplyOnce` (`:225-234`). The export at `:242-249` keeps its name and loop |
| `runtime/tests/legacy/advisor-prompt-policy.vitest.ts` | Modify | One `describe` block that reads the shared fixture |
| `runtime/tests/fixtures/pasted-reply-strip-cases.json` | Create | Shared input and expected-output pairs |
| `runtime/tests/fixtures/README.md` | Modify | One tree row for the new fixture. Added by conductor amendment on 2026-11-18 |
| `runtime/scripts/routing-accuracy/scorer-eval-baseline.json` | Modify, only if routing moves | Recaptured by `capture-scorer-eval-baseline.mjs --write` |
| `runtime/bench/scorer-calibration-baseline.json` | Modify, only if routing moves | Rewritten by the bench with `SPECKIT_WRITE_SCORER_CALIBRATION_BASELINE=1` |
| `runtime/tests/parity/fixtures/local-native-approved-divergences.json` | Modify, only if routing moves | Recaptured by `capture-local-native-divergence-ledger.mjs --write` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A `>`-quoted requirement before `Task:` stays | The fixture row `quote-requirement-kept` expects its input unchanged, and `npx vitest run tests/legacy/advisor-prompt-policy.vitest.ts` from `runtime/` passes it |
| REQ-002 | An `Assistant response:` header is a cue | The fixture row `assistant-response-header` expects `Refactor the session store module to remove duplicated locking code.` and the test passes it |
| REQ-003 | A task marker inside the pasted reply no longer leaks the reply's tail | The rule chosen by the tie-break passes `marker-inside-reply` or `two-markers-in-user-task`, and the one it misses carries an `ideal` field in the fixture and is named in `implementation-summary.md` Known Limitations |
| REQ-004 | Every phase 002 case still holds | The fixture holds the probe, the `You said:` variant, the six negatives, the plain task and both nested cases with their phase 002 outputs, and the test passes all of them |
| REQ-005 | The rule changes no corpus prompt it did not already change | This phase's `scratch/count-corpus-strips.mjs`, run from the repository root after the advisor build, prints `"jsonlChanged":["rr-paste-208"]` and `"harderChanged":[]` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | The corpus gates stay green | `SPECKIT_RUN_BENCHES=true npx vitest run tests/parity tests/legacy/advisor-corpus-parity.vitest.ts tests/prompt-policy-gold-replay.vitest.ts bench/scorer-calibration.bench.ts` from `runtime/` exits 0 |
| REQ-007 | The follow-up bench does not move | The 003 bench with `--reporter=verbose` prints `"N":9`, `"H":5` and `collateral` 19, and `test -f .skilled/skills/system-skill-advisor/runtime/bench/scorer-calibration-baseline.json && git diff --stat -- .skilled/skills/system-skill-advisor/runtime/bench/scorer-calibration-baseline.json` from the repository root prints nothing and exits 0 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The fixture test fails on exactly five rows before the rule changes (`quote-requirement-kept`, `marker-inside-reply`, `assistant-response-header`, `quote-led-straight`, `quote-led-curly`) and passes every row after.
- **SC-002**: `git diff --stat` for this phase lists `prompt-policy.ts`, `advisor-prompt-policy.vitest.ts` and the new fixture, plus baseline files only when routing moved.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 007 reads the fixture from Python | A fixture shape Python cannot read stalls 007 | Plain JSON, UTF-8, non-ASCII text written as `\u` escapes, the shape of `runtime/tests/fixtures/affordance-injection-fixtures.json`, which both test suites already read |
| Risk | No marker rule passes both marker cases | Med | They have the same shape: a reply, then `Task:`, then `Now:`. The tie-break in `plan.md` picks the miss that keeps the ideal output's top skill, and the summary names the miss |
| Risk | A quote-led paste with a marker no longer strips | Low | 0 of 701 JSONL prompts and 0 of 24 harder prompts are quote-led with a marker. The `quote-led-straight` and `quote-led-curly` rows pin the new behavior |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which marker rule ships? The tests and the corpus count tie on today's data. The plan fixes a tie-break before the build: score the chosen candidate's missed output and its ideal output with `scoreAdvisorPrompt`, and the candidate whose miss keeps the ideal top skill wins. Recommended default: apply that tie-break as written. On today's measurement it favors last-marker, and the build reruns it after the cue changes.
- Should a `>` or quote in front of an attribution header (`> You said: ...`) count as a cue? Recommended default: no, until a corpus or reported prompt shows one.
- `runtime/tests/fixtures/README.md` lists every file in its tree and names each shared fixture's readers. The brief's Files to Change does not include it. Recommended default: add its one row by amendment in this phase, naming the TypeScript reader, and let phase 007 add the Python reader. Closed 2026-11-18 by the conductor: the row is added here, as the default says.
<!-- /ANCHOR:questions -->

---
