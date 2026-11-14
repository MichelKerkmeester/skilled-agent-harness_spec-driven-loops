---
title: "Feature Specification: Phase 7: code-agent-retry-and-status"
description: "The code agent states three retry rules that disagree, never says when to return FAIL instead of BLOCKED, escalates a status its own return enum does not hold and opens with a dispatch gate it cannot fire. This phase gives each one rule, so the orchestrator's retry ladder and circuit breaker in phase 8 can count statuses that mean one thing."
trigger_phrases:
  - "code agent retry and status"
  - "phase 7 code agent retry and status"
  - "code agent fail versus blocked"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 7: code-agent-retry-and-status

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-11-14 |
| **Branch** | `worktrees/384-agent-alignment-follow-ups` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 14 |
| **Predecessor** | 006-shared-agent-contract |
| **Successor** | 008-orchestrate-routing-and-retry |
| **Handoff Criteria** | `code.md` holds one retry rule and one definition each of `PASS`, `FAIL` and `BLOCKED`, phase 8 can cite those definitions by section and the roster, mirror and contract checks pass |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the agent alignment follow-ups packet. It owns review findings code-1, code-2, code-3, code-4 and code-6. Finding code-5, the fast-path `Max 5 tool calls` cap at `code.md:114`, belongs to phase 6 and is not planned here.

**Scope Boundary**: The `@code` agent file and its runtime copies, the `code` record's `notes` in the agent registry and the two `orchestrate.md` lines that repeat the dispatch gate this phase removes. The orchestrator's retry ladder, circuit breaker and rejection rules stay with phase 8.

**Dependencies**:
- Phase 6, `006-shared-agent-contract`, for the shared tool-budget rule and the shared self-score rule. The `Rubric Score` field and the confidence rows that quote the rubric follow whatever phase 6 decides.
- Phase 8, `008-orchestrate-routing-and-retry`, depends on this phase. Its retry ladder and circuit breaker count the `FAIL` and `BLOCKED` returns this phase defines, so this phase lands first.

**Deliverables**:
- One retry rule for a failed check: one targeted in-scope fix, one rerun, then return
- One definition each of `PASS`, `FAIL` and `BLOCKED`, with the escalation triggers sorted under them
- One escalation name for an unresolved route, `UNKNOWN_STACK`
- A caller note in place of the dispatch gate that never fires
- A severity table in place of the 100-point rubric, and no gate-type section nothing reads
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`code.md` step 6 says "NO internal retry. NO loop-fix." while its quality bands say "Continue fixing if in-scope" and its escalation list says "fails after the targeted in-scope fix", so the agent cannot tell whether one fix is allowed. Its return line offers `PASS`, `FAIL` and `BLOCKED`, but no rule ever assigns `FAIL`: the escalation list sends a failed verification to `BLOCKED`, while the circuit breaker says a failed verification is an ordinary `FAIL` that must not count toward the three `BLOCKED` returns that stop retries. It escalates `UNKNOWN_ROUTE` in four places while its return enum holds only `UNKNOWN_STACK`. It opens with a gate that halts when the orchestrator's marker is missing and then lets a direct operator invocation through with no marker, two cases the agent receives as the same prompt. It gates `PASS` on a self-score of 70 that the same section calls "a communication aid", and it defines three gate types and a result format that no other file names.

### Purpose
The orchestrator reads one status from `@code` that means one thing, so its retries and circuit breaker count the same events every time.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Run at `c1dbb1bcc4` from the worktree root. The review's line numbers were taken at `09f1d6499a`, and the first command shows neither code file changed since.

```text
$ git diff --stat 09f1d6499a HEAD -- .skilled/agents/code.md .claude/agents/code.md | wc -l
       0
$ wc -l .skilled/agents/code.md .claude/agents/code.md
     539 .skilled/agents/code.md
     524 .claude/agents/code.md
    1063 total
$ rg -n 'NO internal retry|fix in place or escalate|Continue fixing if in-scope|plausible in-scope fix|after the targeted in-scope fix' .skilled/agents/code.md | cut -c1-90
73:   `BLOCKED` means fix in place or escalate.
80:6. **VERIFY** → Run sk-code's returned verification command. Capture command name, exit
205:| **NEEDS REVISION** | 50-69 | FAIL | Continue fixing if in-scope; otherwise return `B
213:| **P1** | REQUIRED | Spec mismatch, correctness bug, integration break, required-chec
426:- Verification command fails after the targeted in-scope fix
$ rg -n 'Return BLOCKED with|Verification fails|ordinary .FAIL. scores|returns .BLOCKED. three' .skilled/agents/code.md | cut -c1-62
317:If @code returns `BLOCKED` three consecutive times for the
319:This rule does NOT fire on three ordinary `FAIL` scores al
387:Return BLOCKED with the appropriate escalation classifier
389:- Verification fails (per §1 step 6 fail-closed contract)
$ rg -n -i 'return .?FAIL|RETURN: FAIL' .skilled/agents/code.md; echo "exit=$?"
exit=1
$ rg -n 'UNKNOWN_ROUTE' .skilled/agents/code.md | cut -d: -f1 | paste -sd' ' -
67 89 130 138
$ rg -n 'UNKNOWN_STACK' .skilled/agents/code.md | cut -d: -f1 | paste -sd' ' -
302 328 340 383 388 421 456 527
$ rg -l 'UNKNOWN_ROUTE' --glob '!specs/**' --glob '!**/trigger-index*' .
./.skilled/agents/code.md
$ rg -n 'HALT and return|A direct operator invocation satisfies this gate' .skilled/agents/code.md | cut -c1-90
28:> ⛔ **DISPATCH GATE (§0 caller-restriction, D3 convention-floor):** @code MUST be dispa
32:> **A direct operator invocation satisfies this gate.** When the user names this agent
41:> ⛔ **COMPONENT-AUTHORING GATE:** @code MUST NOT author skill, agent, or command compon
$ rg -n 'Depth: 1. marker' .skilled/agents/ | cut -d: -f1,2
.skilled/agents/orchestrate.md:180
.skilled/agents/orchestrate.md:901
.skilled/agents/code.md:536
.skilled/agents/agent-registry.json:107
$ rg -n 'communication aid|^\| \*\*ACCEPTABLE' .skilled/agents/code.md | cut -c1-90
187:Use this rubric before returning `PASS` or any completion-equivalent status. The score
204:| **ACCEPTABLE** | 70-89 | PASS | Return `PASS` with notes; documented P2s; any approv
$ awk '/^## [0-9]+\./{print NR": "$0}' .skilled/agents/code.md | sed -n '7,10p'
185: ## 6. CODER ACCEPTANCE RUBRIC
228: ## 7. CODER CHECKLIST
275: ## 8. ORCHESTRATOR INTEGRATION
323: ## 9. RETURN CONTRACT
$ rg -l 'pre_implementation_check|Code Gate Validation' --glob '!specs/**' --glob '!**/trigger-index*' .
./.skilled/agents/code.md
$ node .skilled/bin/sync-agent-roster.cjs --check
agent-roster: OK
$ node .skilled/bin/check-agent-mirror-sync.cjs | tail -1 | rg -o '11 agent\(s\) checked|all comparable mirrors in sync|OK$'
11 agent(s) checked
all comparable mirrors in sync
OK
$ node --test .opencode/plugins/tests/speckit-review-dispatch-contract.test.cjs 2>&1 | rg '^ℹ (pass|fail)'
ℹ pass 5
ℹ fail 0
```

Each command above exited 0 except the `RETURN: FAIL` search, which exited 1 with no match. Reading the section spans, section 6 runs from line 185 to 227 (43 lines) and section 8 from line 275 to 322 (48 lines), 91 lines in all.

| Finding | Classification | Evidence |
|---------|----------------|----------|
| code-1 | Partly reproduced | Line 80 forbids a retry while lines 205, 213 and 426 each assume one in-scope fix. Line 73 is a different `BLOCKED`: the quality runner's verdict, not the return status, so it is not the contradiction the review names. It still reads as the return status, and the build rewords it |
| code-2 | Reproduced | Line 389 sends a failed verification to `BLOCKED` and line 319 calls it an ordinary `FAIL`. The `RETURN: FAIL` search finds no rule that assigns `FAIL`. Line 317 counts `BLOCKED` |
| code-3 | Reproduced | `UNKNOWN_ROUTE` at lines 67, 89, 130 and 138. `UNKNOWN_STACK` at eight lines, including the return enum at 328 and the envelope map at 383. No other file outside `specs/` names `UNKNOWN_ROUTE` |
| code-4 | Reproduced by reading | Lines 28 to 37 halt on a missing marker and then pass a marker-less operator invocation. A dispatched agent sees only the prompt its caller wrote, so nothing in the input tells the two apart. No live dispatch was run, so this rests on the text |
| code-6 | Partly reproduced | The `PASS` band at line 204 starts at 70 while line 187 calls the score "a communication aid". The gate names at lines 283 to 292 appear in no other file. The review's "roughly 120 lines" did not hold: the two sections measure 91 |
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Replace the three retry statements with one rule: after a failed quality gate or verification command, make one targeted in-scope fix, rerun the same check once, then return (code-1)
- Define `PASS`, `FAIL` and `BLOCKED` once, and sort the escalation triggers under them: a check that still fails is `FAIL` with `VERIFY_FAIL`, and a missing input only the caller can supply is `BLOCKED` (code-2)
- Rename the four `UNKNOWN_ROUTE` escalations to `UNKNOWN_STACK`, the name the return enum and the I/O envelope already use (code-3)
- Replace the dispatch gate with a caller note that keeps the visible-brief rule, and update the registry note and the two `orchestrate.md` lines that describe the removed gate (code-4)
- Cut section 6 to the P0 and P1 completion rule and the severity table, and cut section 8 to the status definitions and the circuit breaker, so sections 9 to 13 keep their numbers (code-6)

### Out of Scope
- The fast-path `Max 5 tool calls` cap at line 114 - finding code-5 belongs to phase 6
- The shared self-score rule itself - phase 6 owns it. This phase applies its result to `code.md`
- The orchestrator's retry ladder, circuit breaker and rejection table in `orchestrate.md` section 7 - phase 8 owns them and counts the statuses this phase defines
- The frontmatter `description` and the registry `summary` and `dispatchers` - "dispatched only by @orchestrate" stays true for agent-to-agent dispatch, and the description feeds routing metadata this phase does not need to move
- New names for the three statuses - every consumer found reads `PASS`, `FAIL` and `BLOCKED` or their lowercase envelope forms, so renaming would break them for no gain

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/agents/code.md` | Modify | Dispatch gate, steps 5 and 6, the four `UNKNOWN_ROUTE` lines, sections 6 and 8, the escalation triggers, the rules list, the confidence table and the related-resources line |
| `.claude/agents/code.md` | Modify | Hand-edit the same changes into the Claude fork. `.cursor/agents/code.md` and `.devin/agents/code/AGENT.md` are symlinks to it |
| `.pi/agents/code.md`, `.codex/agents/code.toml`, `.dsh/agents/code.patch.yml` | Regenerate | Pi, Codex and harness copies from their sync scripts |
| `.skilled/agents/agent-registry.json` | Modify | The `code` record's `notes`, which says a `Depth: 1` marker is required |
| `.skilled/agents/orchestrate.md` | Modify, Regenerate | Line 180 is the generated roster row from the registry note. Line 901 repeats "gated by a `Depth: 1` marker" |
| `.claude/agents/orchestrate.md`, `.pi/agents/orchestrate.md`, `.codex/agents/orchestrate.toml`, `.dsh/agents/orchestrate.patch.yml` | Hand-edit, Regenerate | Runtime copies of the two `orchestrate.md` lines |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `code.md` states one retry rule for a failed check: one targeted in-scope fix, one rerun, then return. No line forbids the fix or allows a second one. | `rg -c 'NO internal retry\|NO loop-fix\|Continue fixing if in-scope' .skilled/agents/code.md` prints nothing and exits 1, and `rg -c 'one targeted in-scope fix' .skilled/agents/code.md` prints 3 (steps 5 and 6 and the escalate list) |
| REQ-002 | `code.md` defines `PASS`, `FAIL` and `BLOCKED` once, in section 8. A check that still fails after the one fix returns `FAIL` with `VERIFY_FAIL`. `BLOCKED` covers only `UNKNOWN_STACK`, `SCOPE_CONFLICT`, `LOW_CONFIDENCE` and `LOGIC_SYNC`. The circuit breaker counts `BLOCKED` and names `FAIL` as the retryable status. | `rg -c '^\| .(PASS\|FAIL\|BLOCKED). \|' .skilled/agents/code.md` prints 3, and `rg -n 'Return BLOCKED with the appropriate' -A7 .skilled/agents/code.md \| rg -c VERIFY_FAIL` prints 0 where the baseline printed 1 |
| REQ-003 | The agent rosters and every runtime copy agree after the edits, and the file stays under the template cap. | `node .skilled/bin/sync-agent-roster.cjs --check` prints `agent-roster: OK`, `node .skilled/bin/check-agent-mirror-sync.cjs` ends with `OK` and exits 0, and `wc -l .skilled/agents/code.md` prints 600 or less |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | An unresolved route escalates as `UNKNOWN_STACK` everywhere. | `rg -c 'UNKNOWN_ROUTE' .skilled/agents/code.md .claude/agents/code.md .pi/agents/code.md .codex/agents/code.toml .dsh/agents/code.patch.yml` prints nothing and exits 1 |
| REQ-005 | The dispatch gate is replaced by a caller note that never halts and keeps the rule to state the packet and frozen scope when no orchestrator brief arrived. No file still says `@code` requires or halts without a `Depth: 1` marker. | `rg -c 'REFUSE: @code\|orchestrator-context marker\|halts without' .skilled/agents/code.md` prints nothing, `rg -c 'Depth: 1. marker' .skilled/agents/` prints nothing, and `rg -c 'state the packet and the frozen scope' .skilled/agents/code.md` prints 1 |
| REQ-006 | Section 6 holds the P0 and P1 completion rule and the severity table only, and section 8 holds the status definitions and the circuit breaker only. Sections 9 to 13 keep their numbers. | `rg -c 'Quality Bands\|Scoring Dimensions\|Dimension Rubrics\|pre_implementation_check\|Code Gate Validation' .skilled/agents/code.md` prints nothing, `rg -n '^## 9\. RETURN CONTRACT' .skilled/agents/code.md` prints one line, and the contract test prints `pass 5` and `fail 0` |
| REQ-007 | No line in `code.md` scores against the deleted rubric. The `Rubric Score` field, its required-field entry, the "Score using §6 rubric" rule and the rubric clauses in the confidence table follow phase 6's self-score rule. | `rg -n '§6 rubric\|rubric self-score\|rubric 70-89\|rubric < 70' .skilled/agents/code.md` prints nothing, and each remaining `Rubric Score` or `rubric_score` line matches the rule phase 6 shipped |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every verification failure path in `code.md` ends in `FAIL` with `VERIFY_FAIL`, and every other escalation ends in `BLOCKED`, so phase 8 can count each status by its section 8 definition.
- **SC-002**: The five owned findings each have a row in `implementation-summary.md` with the command that shows them closed, and code-1 and code-6 record the part that did not reproduce.
- **SC-003**: `validate.sh --strict` on this folder prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 6's self-score rule | REQ-007 cannot close until phase 6 decides whether `@code` keeps a score | The build reads phase 6's shipped rule first. If phase 6 is not built, REQ-007 stays open and the rest ships |
| Dependency | Phase 8 counts the statuses defined here | A status meaning that shifts after phase 8 lands breaks its ladder | This phase lands before phase 8, and section 8 keeps its number so phase 8 can cite it |
| Risk | Moving a failed verification from `BLOCKED` to `FAIL` lowers how often the current circuit breaker fires | Medium | That is the behavior line 319 already describes. Phase 8 sets how many `FAIL` returns the orchestrator retries |
| Risk | Deleting a section renumbers the ones after it and breaks `orchestrate.md:567`, which cites `code.md` §9 | Medium | Sections 6 and 8 are cut, not deleted, and REQ-006 checks that section 9 keeps its number |
| Risk | The registry note edit rewrites the generated roster row in `orchestrate.md`, a file phase 8 also edits | Low | The row is generated, the edit is one line at 901, and phase 8 starts from this phase's result |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- No operator question is open for this phase. The per-child brief named none.
- Which self-score rule does phase 6 ship for `@code`? REQ-007 waits on that answer. It is a dependency between phases, not an operator decision for this phase.
<!-- /ANCHOR:questions -->

---
