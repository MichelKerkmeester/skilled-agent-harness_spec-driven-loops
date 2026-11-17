# Deep Review Strategy - command surfacing pass fourteen (mention area)

## 1. OVERVIEW

### Purpose

Persistent brain for the `mention-14` fan-out lineage. It records dimension coverage, findings, what worked and failed, and the next focus across iterations.

### Usage

Read before each iteration; updated after each iteration. Writable sections are edited in place by the reviewer; machine-owned blocks are refreshed by the reducer.

---

## 2. TOPIC

Review pass fourteen of command surfacing, area `mention`:

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts`
- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts`

Diff base `932aff4e437`, head `e626653ce79`.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 6. NON-GOALS

- The `data` area of pass fourteen (advisor intent signals, ADR-001) belongs to `data-14`.
- The recorded limits in `review-brief-14.txt` line 10 are not re-reported without a new input.
- No code changes are made; this is an observation-only review.
- Holdout corpora are never opened (holdout rule in the brief).

---

## 7. STOP CONDITIONS

- Convergence threshold `0.1` under `stopPolicy: convergence`, or `maxIterations: 8` reached.
- An iteration over budget or a failed gateway append halts with an honest non-`complete` status.
- `convergence.cjs --stop-decision` is the only stop authority; its `blockedBy` steers the next iteration.

---

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->
<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 2
- P2 (Suggestions): 1
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED

- Importing the exported guard directly with Node's type stripping and replaying concrete prompts: it produced both P1s in one pass and showed the intended `then run it` case is carried by the pronoun rule, not the new guard (iteration 1).
- Reading the pass-thirteen decision record beside the code: it turned a narrow anchor mismatch into a stated-contract violation rather than a style note (iteration 1).
- Enumerating every `new RegExp` site and timing pathological prompts: a security pass over a regex guard needs both, and both were cheap (iteration 2).
- A line-level branch audit after the recovery trigger: it showed the branch order is sound and isolated the `then` scope mismatch without inventing a new finding (iteration 4).

---

## 9. WHAT FAILED

- Reading the diff alone: it shows the two new patterns but not which ordinary prompts they misread; all findings needed direct execution (iteration 1).
- No negative fixture exists for either boundary, so the suite could not surface the regressions (iteration 1).

---

<!-- ANCHOR:exhausted-approaches -->
## 10. EXHAUSTED APPROACHES (do not retry)
### A checklist failure for AC-002/AC-003: both are `Met` and unrelated to this diff. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A checklist failure for AC-002/AC-003: both are `Met` and unrelated to this diff.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A checklist failure for AC-002/AC-003: both are `Met` and unrelated to this diff.

### A comment finding on its own: both comment mismatches are the two active P1s; a separate row would repeat the same fix. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: A comment finding on its own: both comment mismatches are the two active P1s; a separate row would repeat the same fix.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A comment finding on its own: both comment mismatches are the two active P1s; a separate row would repeat the same fix.

### A complexity finding for the fourth early return: the branch is two conditions long and its order is documented at 420-422; no nesting was added. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: A complexity finding for the fourth early return: the branch is two conditions long and its order is documented at 420-422; no nesting was added.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A complexity finding for the fourth early return: the branch is two conditions long and its order is documented at 420-422; no nesting was added.

### A consumer finding for the two P1 shapes: the consumer already withholds when the guard returns a mention; the defect is the guard's reading, already carried by the two P1s. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: A consumer finding for the two P1 shapes: the consumer already withholds when the guard returns a mention; the defect is the guard's reading, already carried by the two P1s.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A consumer finding for the two P1 shapes: the consumer already withholds when the guard returns a mention; the defect is the guard's reading, already carried by the two P1s.

### A duplication finding for the shared `clause` computation: it is one `split` used by three checks, which is cheaper to read than three copies. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: A duplication finding for the shared `clause` computation: it is one `split` used by three checks, which is cheaper to read than three copies.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A duplication finding for the shared `clause` computation: it is one `split` used by three checks, which is cheaper to read than three copies.

### A finding against the fixture titles: each title matches its assertion for the five new rows. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: A finding against the fixture titles: each title matches its assertion for the five new rows.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A finding against the fixture titles: each title matches its assertion for the five new rows.

### A new finding for `today`: it is a limit, not a refusal, and the change's own comment names limits as requests. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: A new finding for `today`: it is a limit, not a refusal, and the change's own comment names limits as requests.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A new finding for `today`: it is a limit, not a refusal, and the change's own comment names limits as requests.

### A refusal swallowed by the leading-lead rule: the `before` side still requires the lead to sit directly before the name, so a refusal in a later clause does not affect an earlier occurrence. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: A refusal swallowed by the leading-lead rule: the `before` side still requires the lead to sit directly before the name, so a refusal in a later clause does not affect an earlier occurrence.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A refusal swallowed by the leading-lead rule: the `before` side still requires the lead to sit directly before the name, so a refusal in a later clause does not affect an earlier occurrence.

### A request read as a mention caused by the reordering itself: the decline and ask checks were only moved ahead of the document check, and `..., then run it` still returns a request through `COMMAND_ASKED_BY_PRONOUN`; no prompt was found where the new order withholds a command the earlier order delivered. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: A request read as a mention caused by the reordering itself: the decline and ask checks were only moved ahead of the document check, and `..., then run it` still returns a request through `COMMAND_ASKED_BY_PRONOUN`; no prompt was found where the new order withholds a command the earlier order delivered.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A request read as a mention caused by the reordering itself: the decline and ask checks were only moved ahead of the document check, and `..., then run it` still returns a request through `COMMAND_ASKED_BY_PRONOUN`; no prompt was found where the new order withholds a command the earlier order delivered.

### A separate P2 for `PLAIN_ROWS` membership: the hand-check found the invariant already holds, and `R1-P2-001` already asks for the rows that would matter. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: A separate P2 for `PLAIN_ROWS` membership: the hand-check found the invariant already holds, and `R1-P2-001` already asks for the rows that would matter.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A separate P2 for `PLAIN_ROWS` membership: the hand-check found the invariant already holds, and `R1-P2-001` already asks for the rows that would matter.

### A separate traceability finding for the phase-040 summary row: it states the intended behavior, and the code gap is already an active P1; a second row would duplicate the same fix. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A separate traceability finding for the phase-040 summary row: it states the intended behavior, and the code gap is already an active P1; a second row would duplicate the same fix.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A separate traceability finding for the phase-040 summary row: it states the intended behavior, and the code gap is already an active P1; a second row would duplicate the same fix.

### A table-mismatch finding: the mode rows and tracked rows agree for both commands. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: A table-mismatch finding: the mode rows and tracked rows agree for both commands.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A table-mismatch finding: the mode rows and tracked rows agree for both commands.

### Adding a new finding in this pass: the last iteration re-confirms the same three; no new input was found. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Adding a new finding in this pass: the last iteration re-confirms the same three; no new input was found.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Adding a new finding in this pass: the last iteration re-confirms the same three; no new input was found.

### Backtracking denial of service on long or repetitive prompts: measured at 11 ms for 400k characters on the worst tried shape; the alternations are literal and bounded. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Backtracking denial of service on long or repetitive prompts: measured at 11 ms for 400k characters on the worst tried shape; the alternations are literal and bounded.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Backtracking denial of service on long or repetitive prompts: measured at 11 ms for 400k characters on the worst tried shape; the alternations are literal and bounded.

### Consent bypass in the fold: the guard's output only withholds or allows the offer; the refusal misreads are carried as correctness at `R1-P1-001` and `R1-P1-002`, and no separate security defect was found. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Consent bypass in the fold: the guard's output only withholds or allows the offer; the refusal misreads are carried as correctness at `R1-P1-001` and `R1-P1-002`, and no separate security defect was found.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Consent bypass in the fold: the guard's output only withholds or allows the offer; the refusal misreads are carried as correctness at `R1-P1-001` and `R1-P1-002`, and no separate security defect was found.

### Downgrading `R1-P1-001` because `again` can imply a previous run: the probe uses `keeps failing` and `is broken`, where the clause refuses a further run and the prompt contains no request. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Downgrading `R1-P1-001` because `again` can imply a previous run: the probe uses `keeps failing` and `is broken`, where the clause refuses a further run and the prompt contains no request.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Downgrading `R1-P1-001` because `again` can imply a previous run: the probe uses `keeps failing` and `is broken`, where the clause refuses a further run and the prompt contains no request.

### Downgrading `R1-P1-002` because `then` often introduces work: five of six probed `then` clauses ask for a read or a different task, so the word alone is not a request marker. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Downgrading `R1-P1-002` because `then` often introduces work: five of six probed `then` clauses ask for a read or a different task, so the word alone is not a request marker.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Downgrading `R1-P1-002` because `then` often introduces work: five of six probed `then` clauses ask for a read or a different task, so the word alone is not a request marker.

### Markup folding used to turn a refusal into a request: the fold strips the wrapper, and a wrapped refusal still returns a mention (`(do not run /create:readme)`, `[do not run /create:readme]`, `**never use /create:readme**`, `` `what does /create:readme do?` ``). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Markup folding used to turn a refusal into a request: the fold strips the wrapper, and a wrapped refusal still returns a mention (`(do not run /create:readme)`, `[do not run /create:readme]`, `**never use /create:readme**`, `` `what does /create:readme do?` ``).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Markup folding used to turn a refusal into a request: the fold strips the wrapper, and a wrapped refusal still returns a mention (`(do not run /create:readme)`, `[do not run /create:readme]`, `**never use /create:readme**`, `` `what does /create:readme do?` ``).

### Raising the core protocols to `pass` to allow a legal STOP: the spec and checklist are not satisfied while the two P1s are open, so a pass would be false. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Raising the core protocols to `pass` to allow a legal STOP: the spec and checklist are not satisfied while the two P1s are open, so a pass would be false.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Raising the core protocols to `pass` to allow a legal STOP: the spec and checklist are not satisfied while the two P1s are open, so a pass would be false.

### Regex injection through a command name: `escapePhrase` (`command-attach.ts:316-318`) escapes every metacharacter; both the occurrence regex and the determiner regex use the result. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Regex injection through a command name: `escapePhrase` (`command-attach.ts:316-318`) escapes every metacharacter; both the occurrence regex and the determiner regex use the result.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Regex injection through a command name: `escapePhrase` (`command-attach.ts:316-318`) escapes every metacharacter; both the occurrence regex and the determiner regex use the result.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS

[Review angles investigated and eliminated, with evidence]

---

<!-- ANCHOR:next-focus -->
## 12. NEXT FOCUS
- Dimension: none; the loop reaches `maxIterations`. - Focus area: synthesis compiled the eight iterations into `review-report.md`; the verdict is `FAIL` because the required terminal `coverage` gate is still failing, with two active P1s and one P2. - Reason: the cap is reached with two open P1s and a closed traceability gate; the workflow's verdict rule makes the failed required gate a FAIL. - Rotation status: all dimensions complete. - Blocked/productive carry-forward: `spec_code` and `checklist_evidence` remain partial; the operator owns the fix decision. - Required evidence: the registry counts, the terminal gates output, and the eight iteration files.

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers: `commandOnlyMentioned` (`command-attach.ts:442`), `COMMAND_DECLINED_BY_PRONOUN` (`command-attach.ts:415`), `COMMAND_AS_DOCUMENT` (`command-attach.ts:423`), and the guard suite `command-attach-guards.vitest.ts`.
- Behavior claims in the reviewed diff: a `do not run it` refusal must end its clause (only `yet`, `now`, `for now`, `at all`, `please` may follow), and a document naming followed by `then` is not only a read.
- Reuse and conventions: `commandOnlyMentioned` returns true for a mention; `attachCommand` withholds the command when the guard returns true. `COMMAND_USE_VERB`, `COMMAND_OR_LIST` and `COMMAND_DECLINE_LEADS` are shared vocabulary.
- Review risks and gaps: the working tree matches `e626653ce79` for both scope files; no other pass-fourteen file is read. `data-14` owns the advisor signals and ADR-001.
- Out of scope: every other file, including the corpus and holdout files named by the holdout rule.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | partial | 3 | Doc reading matches; the then variant is offered (R1-P1-002). Refusal reading requires `it` at the clause end (R1-P1-001). |
| `checklist_evidence` | core | partial | 3 | AC-005 Unmet for pass 14 (two P1 open); CHK-FIX-002 matrix does not cover the two new boundary shapes. |
| `skill_agent` | overlay | notApplicable | - | not a skill/agent definition change |
| `agent_cross_runtime` | overlay | notApplicable | - | no agent mirror touched by this diff |
| `feature_catalog_code` | overlay | notApplicable | - | no feature catalog row in scope |
| `playbook_capability` | overlay | notApplicable | - | no playbook capability in scope |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` | [correctness, security, traceability, maintainability] | 4 | 2 P1 | partial |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts` | [correctness, security, traceability, maintainability] | 4 | 1 P2 | partial |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 8
- Convergence threshold: 0.1
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-mention-14-1794868189353-tsxtos, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 24 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-11-16T22:37:01Z
<!-- MACHINE-OWNED: END -->
