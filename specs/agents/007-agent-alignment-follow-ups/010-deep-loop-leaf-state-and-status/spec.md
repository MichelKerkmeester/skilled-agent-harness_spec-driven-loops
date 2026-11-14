---
title: "Feature Specification: Phase 10: deep-loop-leaf-state-and-status"
description: "The two deep-loop leaf agents disagree with themselves and with their workflows about iteration status, the state record and its fields, the setup bindings, the write set and the verdict mapping. This phase fixes the eight owned review findings in the agent text so a leaf reports what the reducer and the gateway expect."
trigger_phrases:
  - "deep loop leaf state and status"
  - "phase 10 deep loop leaf state and status"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 10: deep-loop-leaf-state-and-status

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-14 |
| **Branch** | `worktrees/384-agent-alignment-follow-ups` |
| **Parent Spec** | ../spec.md |
| **Phase** | 10 of 14 |
| **Predecessor** | 009-ai-council-writer-and-round-model |
| **Successor** | 011-debug-agent-revert-and-handoff |
| **Handoff Criteria** | Each owned finding has a shipped edit or a recorded no-fix decision with a command output behind it, the two compiled deep-loop contracts pass the drift check and every runtime mirror is in sync |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 10** of the agent alignment follow-ups packet.

**Scope Boundary**: The text of `.skilled/agents/deep-research.md` and `.skilled/agents/deep-review.md`, their `.claude/agents/` forks, the generated Pi, Codex and harness copies and the two compiled deep-loop contracts that pin a digest of each agent file. The gateway, the reducers, the workflow YAML files, the prompt packs and the mode contract do not change. The tool budgets and the pre-ticked checklists in both files belong to phase 006 and are not planned here.

**Dependencies**:
- Phase 006, which edits the same two files first (the budget lines and the pre-delivery checklists). Every check in this phase is anchored on quoted text, not on a line number, so it holds after 006 moves the lines.
- The review report in `../scratch/agent-review/agents-review.out.md` and the ownership map in `../scratch/agent-review/finding-to-phase.tsv`.

**Deliverables**:
- One status rule for a failed source recovery in `deep-research.md`, and no second copy of the recovery tiers
- A research state record that names the gateway as its only writer and leaves out the fields nothing measures
- A `deep-review.md` that emits its bindings after it reads the config, names the delta file in its write set, scopes its verdict table and lists `noveltyJustification` among the record fields
- Workflow-owned lifecycle text removed from `deep-review.md`, regenerated mirrors and recompiled contracts
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`deep-research.md` tells the leaf to set status `error` when source recovery fails, while its own status rule keeps `error` for state corruption and the workflow halts after 3 consecutive errors. It also says to append the JSONL record a few lines above the rule that forbids a direct write, asks for a `timestamp` and a `durationMs` that no step measures and states the recovery tiers, the write rules and the convergence semantics more than once. `deep-review.md` emits a `convergence` binding before it reads the config that holds the value, calls the state log writable and leaves out the delta file, maps FAIL two ways, demands a `noveltyJustification` its field list lacks and describes restart and synthesis events the workflow writes.

### Purpose
Each owned finding ends as an agent edit or a recorded no-fix decision, and a leaf that follows the agent text produces the status, record and verdict that the gateway, the reducer and the workflow accept.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Taken at `c1dbb1bcc4`. The full record, with every consumer read, is `scratch/measured.txt`.
```text
$ git diff --quiet 09f1d6499a HEAD -- .skilled/agents/deep-research.md .skilled/agents/deep-review.md; echo exit=$?
exit=0
$ wc -l .skilled/agents/deep-research.md .skilled/agents/deep-review.md
     599 .skilled/agents/deep-research.md
     600 .skilled/agents/deep-review.md
    1199 total
$ sed -n '166,168p;196p;404p;495p' .skilled/agents/deep-research.md
- Use `timeout` when tool/source failures or budget limits prevent adequate coverage but some evidence was gathered.
- Use `stuck` when ambiguity or missing evidence leaves no productive in-scope path after alternatives are tried.
- Use `error` only for unrecoverable state corruption, missing required control files, or write failures that prevent valid artifacts.
- **Tier 3+ escalation**: if Tier 1-2 recovery fails, write the failure in the iteration file and set status to `error`; the orchestrator handles higher tiers.
- **Tier 3+ escalation**: if Tier 1-2 recovery fails, report the error in the iteration file and set status to `error`; the orchestrator handles higher tiers.
- If tool failures prevent any research, report timeout status
$ sed -n '2635p' .skilled/commands/deep/assets/deep-research-auto.yaml
  consecutive_failures: "After 3 consecutive errors, halt loop and enter synthesis with partial findings."
$ sed -n '249p' .skilled/agents/deep-research.md
2. Append the structured JSONL record.
$ grep -n -o 'never write .research/deep-research-state.jsonl. directly' .skilled/agents/deep-research.md
254:never write `research/deep-research-state.jsonl` directly
$ grep -n -o '"timestamp":"ISO-8601","durationMs":NNNNN' .skilled/agents/deep-research.md
257:"timestamp":"ISO-8601","durationMs":NNNNN
$ grep -c 'durationMs' .skilled/agents/deep-research.md
2
$ rg -n 'assert_jsonl_fields' .skilled/commands/deep/assets/deep-research-auto.yaml
1960:          assert_jsonl_fields: [type, iteration, newInfoRatio, status, focus, mode]
$ rg -n 'occurredAt: meta.occurredAt' .skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs
332:      occurredAt: meta.occurredAt || meta.occurred_at || nowIso,
$ sed -n '305p' .skilled/skills/system-deep-loop/runtime/lib/legacy-projections/deep-research-contract.ts
          timestamp: occurredAt,
$ for r in 43,53 65,73 118,132 321,333 399,404 423,438 449,455 537,570; do printf '%s ' $r; sed -n "${r}p" .skilled/agents/deep-research.md | wc -l | tr -d ' '; done
43,53 11
65,73 9
118,132 15
321,333 13
399,404 6
423,438 16
449,455 7
537,570 34
$ sed -n '104p' .skilled/agents/deep-review.md | cut -c1-120
Immediately after validating dispatch inputs, BEFORE any state read or workflow step, this agent MUST emit one canonical
$ rg -n 'Review Iteration:|Dimension:|convergenceThreshold' .skilled/skills/system-deep-loop/deep-review/assets/prompt-pack-iteration.md.tmpl
16:Review Iteration: {current_iteration} of {max_iterations}
18:Dimension: {next_dimension}
$ grep -n -o 'Writable files are limited to the iteration artifact, strategy file, and JSONL state log' .skilled/agents/deep-review.md
33:Writable files are limited to the iteration artifact, strategy file, and JSONL state log
$ sed -n '349p;357p;377p' .skilled/agents/deep-review.md
| **Coverage** | Required dimensions and traceability protocols are covered before STOP |
| **FAIL** | Active `P0` exists or any binary gate fails | `/speckit:plan` |
Mapping runs over findings ACTIVE at this iteration rather than only the ones it raised: PASS when no active P0 or P1 remains; CONDITIONAL when an active P1 remains and no P0; FAIL when any active P0 remains.
$ sed -n '105p' .skilled/skills/system-deep-loop/deep-review/assets/review-mode-contract.yaml
      condition: "activeP0 > 0 OR any required quality gate fails"
$ sed -n '2403,2404p' .skilled/commands/deep/assets/deep-review-auto.yaml
          if p0_count > 0:
            verdict = "FAIL"
$ sed -n '493p;508p' .skilled/agents/deep-review.md
8. Report newFindingsRatio + noveltyJustification honestly.
5. Skip convergence data: newFindingsRatio and noveltyJustification.
$ grep -c 'noveltyJustification' <(sed -n '236p' .skilled/agents/deep-review.md)
0
$ sed -n '396p;448p' .skilled/agents/deep-review.md
- `restart`: archive existing `review/`, mint a fresh `sessionId`, increment `generation`, and append a typed `restarted` event with non-null `archivedPath`.
- Under `stop_policy=max-iterations`, the terminal synthesis record must carry `stopReason: maxIterationsReached`; the fan-out runner rejects a lineage that reaches the cap without recording it.
$ sed -n '599p' .skilled/commands/deep/assets/deep-review-auto.yaml
      step_record_restarted_run:
$ sed -n '1743p' .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs
          `The terminal synthesis record must carry stopReason "maxIterationsReached"; the runner`,
$ grep -c 'sessionId\|runId\|lineageId' .skilled/agents/deep-research.md
0
$ node .skilled/skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs --command deep/research; echo exit=$?
[CONTRACT DRIFT] OK commands=1
exit=0
$ node .skilled/skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs --command deep/review; echo exit=$?
[CONTRACT DRIFT] OK commands=1
exit=0
$ cd .skilled/skills/system-spec-kit/runtime/cli && npx --no-install vitest run --config ../../vitest.config.ts --project cli tests/deep-review-contract-parity.vitest.ts tests/deep-research-contract-parity.vitest.ts 2>&1 | grep -E '^ +Tests '
      Tests  19 passed (19)
$ cd .skilled/skills/system-deep-loop/runtime && node_modules/.bin/vitest run --config vitest.config.ts tests/fanout-loop-prompt-in-process.test.ts 2>&1 | grep -E '^ +Tests '
      Tests  8 passed (8)
```

Finding classification, one line each:
- deep-research-2: reproduced. Lines 196 and 404 set `error` where lines 166 to 168 and 495 say `timeout` or `stuck`, and three errors in a row halt the loop.
- deep-research-3: reproduced. Line 249 says append, line 254 forbids a direct write.
- deep-research-4: partly reproduced. No step measures either field. The proposed gateway change is not needed: the gateway already stamps the event time from `occurredAt` (`append-mode-event.cjs:332`), the research projection writes it back as `timestamp` and drops `durationMs` (`deep-research-contract.ts:293-306`) and neither the workflow assertion nor the research reducer reads `durationMs`.
- deep-research-5: partly reproduced. The recovery tiers appear twice (193-196, 399-404), the write rules in four places (65-73, 118-132, 423-438, 449-455), the verification twice (321-333, 537-570) and the convergence block at 43-53 restates what line 30 gives to the workflow. The duplicated ranges total 111 lines by this count, against the report's estimate of about 120. The verification pair is left to phase 006, which owns the checklist at 537-570.
- deep-review-2: partly reproduced. The dispatch prompt carries `max_iterations` and the next dimension, so two bindings can come before the state read. `convergence` is not in the prompt pack and lives only in the config.
- deep-review-3: reproduced. Line 33 names the state log as writable and leaves out the delta file that line 444 allows.
- deep-review-4: partly reproduced. The two mappings disagree, but the proposed fix is wrong. Putting gate failure into the per-iteration mapping would end every iteration before full coverage in FAIL, because the Coverage gate at line 349 passes only before STOP. The workflow's verdict step (`deep-review-auto.yaml:2403-2404`) counts P0 only.
- deep-review-5: reproduced. Line 236 lacks `noveltyJustification`, the workflow writes the restart event (`deep-review-auto.yaml:599`) and the fan-out runner states the `maxIterationsReached` rule in the lineage prompt itself (`fanout-run.cjs:1743`).
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Replace the two `Tier 3+ escalation` lines in `deep-research.md` with one rule that reports `timeout` or `stuck`, and remove the second copy of the recovery tiers
- Reword the research reducer step to record through the gateway, and drop `durationMs` from the research record and its verification list while the gateway stamps `timestamp`
- Remove the research convergence block, which the research skill already states, and the `Write Safety` list, which restates the scope lock and the gateway step
- Move the review binding emission after the config read, name the delta file in the review write set, leave the gate rule of the FAIL row to the session verdict and add `noveltyJustification` to the review record fields
- Replace the review lifecycle bullets with one line that names the workflow as owner, remove the `stopReason` bullet, then hand-edit the `.claude` forks, regenerate the runtime copies and recompile the two contracts

### Out of Scope
- The tool budgets and the pre-ticked checklists in both files - phase 006 owns deep-research-1, deep-review-1 and across-2
- A gateway change that stamps `durationMs` - nothing consumes the research field, and the review record requires it through the workflow, which this phase does not change
- The disagreement between `review-mode-contract.yaml:105` and the workflow's verdict step - both files are outside this phase, so it is an open question
- The review `durationMs` requirement and the convergence block in `deep-review.md` - no owned finding covers them
- The stale line citations in the deep-research playbook scenarios, such as `iteration-citation-jsonl.md:103-106` - they were already out of date at this base

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/agents/deep-research.md` | Modify | Status rule, reducer step wording, record fields and the three duplicated blocks |
| `.skilled/agents/deep-review.md` | Modify | Binding order, write set, verdict row, record fields and lifecycle text |
| `.claude/agents/deep-research.md`, `.claude/agents/deep-review.md` | Modify | Hand edits that match the canonical files |
| `.pi/agents/`, `.codex/agents/`, `.dsh/agents/` copies of both agents | Regenerate | Rewritten by the three sync scripts |
| `.skilled/commands/deep/assets/compiled/deep-research.contract.markdown`, `deep-review.contract.markdown` | Regenerate | Each pins a sha256 of its agent file |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A failed source recovery in `deep-research.md` reports `timeout` or `stuck`, never `error`, and the rule appears once. | `rg -c 'set status to .error.' .skilled/agents/deep-research.md` prints nothing and exits 1, and `rg -c 'Tier 3\+ escalation' .skilled/agents/deep-research.md` prints 1 on a line that names `timeout` and `stuck` |
| REQ-010 | Every runtime copy and both compiled contracts match the edited agents, and both stay at or under 600 lines. | `sync-agent-roster.cjs --check` prints `agent-roster: OK`, `check-agent-mirror-sync.cjs` exits 0, `check-contract-drift.cjs` prints `OK commands=1` for `deep/research` and `deep/review` and `wc -l` prints 600 or less for each canonical file |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | The research reducer step points at the gateway instead of an append. | `rg -c 'Append the structured JSONL record' .skilled/agents/deep-research.md` exits 1, and the fan-out prompt test still passes its `state record ... directly` guard |
| REQ-003 | The research record leaves out `durationMs` and says the gateway stamps the time. | `grep -c 'durationMs' .skilled/agents/deep-research.md` prints 0, and `rg -n 'gateway stamps' .skilled/agents/deep-research.md` prints one line |
| REQ-004 | The research convergence block, the second recovery-tier block and the `Write Safety` list are gone. | `rg -c '^## Convergence Threshold Semantics'`, `rg -c '^### Error-Aware Execution'` and `rg -c '^### Write Safety'` on `.skilled/agents/deep-research.md` each exit 1, `rg -c 'Tier 1 \(Source failure\)' .skilled/agents/deep-research.md` prints 1, and the research parity test passes |
| REQ-005 | The review bindings are emitted after the config read. | `rg -c 'BEFORE any state read' .skilled/agents/deep-review.md` exits 1, and `rg -n 'BINDING line' .skilled/agents/deep-review.md` prints a line that names the config |
| REQ-006 | The review permission line names the delta file and the gateway, not a writable state log. | `rg -c 'and JSONL state log listed' .skilled/agents/deep-review.md` exits 1, and `rg -n 'SPEC FOLDER PERMISSION.*deltas/iter-NNN.jsonl' .skilled/agents/deep-review.md` prints one line |
| REQ-007 | The review FAIL row leaves the gate rule to the session verdict the workflow derives, and the iteration mapping stays findings-only. | `rg -n 'FAIL.*session verdict' .skilled/agents/deep-review.md` prints one line, and `rg -c 'FAIL when any active P0 remains' .skilled/agents/deep-review.md` prints 1 |
| REQ-008 | The review record field list includes `noveltyJustification`. | `rg -n '^- Required review data includes.*noveltyJustification' .skilled/agents/deep-review.md` prints one line |
| REQ-009 | The review file no longer describes restart or synthesis events the workflow writes, and keeps the lifecycle terms the parity test reads. | `rg -c 'append a typed .restarted. event'` and `rg -c 'stopReason: maxIterationsReached'` on `.skilled/agents/deep-review.md` each exit 1, and the review parity test passes |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The two parity suites and the fan-out prompt suite print the same pass counts after the edits as before them, 19 and 8.
- **SC-002**: `check-contract-drift.cjs` prints `OK commands=1` for both commands, and `check-agent-mirror-sync.cjs` exits 0.
- **SC-003**: `validate.sh --strict` on this folder prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 006 edits the same two files first | A line-anchored check or edit would hit the wrong text | Every task finds its text with `rg -n` on a quoted string, and Phase 1 re-runs the measured commands by text |
| Risk | A trimmed block carries a term a test reads, such as `completed-continue` or `workflow reducer` | Med | The three suites run before and after, and the lifecycle line keeps `completed-continue` |
| Risk | `deep-review.md` is at 600 lines and an edit pushes it over the cap | Med | The plan's review edits net four lines fewer, and `wc -l` is an acceptance check |
| Risk | A research consumer reads `durationMs` after all | Low | At this base `rg -n durationMs` over the research skill and both research workflows finds only writers and examples. Phase 1 re-runs it, and a reader stops the REQ-003 edit |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- The research record example in Step 8 has no `runId`, `sessionId` or `lineageId`, and `grep -c` counts 0 of them in the file. The prompt pack says a record without them is refused with `stable-identity-missing`, and `legacy-compatibility.ts` refuses it. Fold the three fields into the REQ-003 edit of that same line? Recommended: yes. It is planned only after the operator says yes, because no owned finding names it.
- Which rule is the review session verdict: `review-mode-contract.yaml:105`, which fails on a quality gate, or `deep-review-auto.yaml:2403-2408`, which counts P0 only? Both files are outside this phase. REQ-007 makes the agent defer to the session verdict without choosing between them.
- deep-review-2: the binding order comes from `agent-template.md:281`, and `markdown.md:118` copies it. Should the template say "after the config read" for agents whose bindings live in config? That file is outside this phase.
<!-- /ANCHOR:questions -->

---
