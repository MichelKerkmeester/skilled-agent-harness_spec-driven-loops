---
title: "Deep Review Report: deep-loop command offers, generation 10 traceability lineage"
description: "DeepSeek V4.1 Flash at max thinking through cli-pi, seven iterations: one P1 refusal gap and six P2s, verdict CONDITIONAL."
---

# Deep Review Report: deep-loop command offers, generation 10 traceability lineage

## 1. Executive Summary

- **Verdict:** `CONDITIONAL`. One active P1 and six active P2s; no P0.
- **Counts the verdict used:** P0 0, P1 1, P2 6. `hasAdvisories: false`, because that flag is set only for a PASS carrying P2s.
- **Review scope:** the 77 files in `review-scope-files.txt`, led by the two gate copies (`command-attach.ts`, `skill_advisor.py`), the shared 368-case fixture, the reducer, the hook brief and the packet's seven canonical docs.
- **Operator review focus:** "Lead with traceability: finish spec_code and checklist_evidence. Check every REQ in spec.md against its code or decision, and every ticked task in tasks.md and Met row in acceptance-criteria.md against real evidence, including the thirteenth round (T115 onward). Cover all four dimensions before the last iteration: correctness, security and maintainability one iteration each within iterations 1 to 4, the rest traceability. Write no gateClass on protocol results: the reducer assigns hard to the two core protocols and advisory to the overlays. File findings only on files in review-scope-files.txt, with full repo-relative paths, never bare file names. A defect in an unlisted file goes under Edge Cases. Do not write a terminal_gates row: the orchestrator computes it after the run."
- **Run:** generation 10, lineage `deepseek-max-1`, seven iterations at the cap, stop reason `maxIterationsReached`. `executor: cli-pi model=deepseek-v4.1-flash-1017`.

## 2. Planning Trigger

`/speckit:plan` is required for the P1; the six P2s are advisories and may be scheduled separately.

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": [
    {"id": "L1-P1-001", "severity": "P1", "title": "A refused run ask in the question's later clause is read as the run the question asks for", "file": ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1303", "findingClass": "class-of-bug"},
    {"id": "L1-P2-001", "severity": "P2", "title": "Two iterations that rule out one direction are written as two one-attempt directions", "file": ".skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2414", "findingClass": "class-of-bug"},
    {"id": "L2-P2-001", "severity": "P2", "title": "The hook brief vets a child-supplied command but still trusts the child's policy and owner", "file": ".skilled/skills/system-skill-advisor/runtime/lib/skill-advisor-brief.ts:191", "findingClass": "cross-consumer"},
    {"id": "L3-P2-001", "severity": "P2", "title": "A ruled-out reason that quotes a spaced -- inside a code span is cut in two", "file": ".skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2396", "findingClass": "class-of-bug"},
    {"id": "L3-P2-002", "severity": "P2", "title": "The brief ownership test cannot tell the child's policy and owner from the tracked table's", "file": ".skilled/skills/system-skill-advisor/runtime/tests/brief-command-owner-check.vitest.ts:113", "findingClass": "test-isolation"},
    {"id": "L4-P2-001", "severity": "P2", "title": "The continuity metadata still names generation 8 as the latest round", "file": "specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/implementation-summary.md:13", "findingClass": "docs-drift"},
    {"id": "L7-P2-001", "severity": "P2", "title": "T053 still says AC-008 reads Met, while the row reads Waived", "file": "specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:114", "findingClass": "docs-drift"}
  ],
  "remediationWorkstreams": [
    {"order": 1, "severity": "P1", "name": "Refusal in a question clause", "findings": ["L1-P1-001"]},
    {"order": 2, "severity": "P2", "name": "Reducer projection", "findings": ["L1-P2-001", "L3-P2-001"]},
    {"order": 3, "severity": "P2", "name": "Hook-brief field trust", "findings": ["L2-P2-001", "L3-P2-002"]},
    {"order": 4, "severity": "P2", "name": "Closure records", "findings": ["L4-P2-001", "L7-P2-001"]}
  ],
  "specSeed": [
    "REQ-015's general refusal rule is the anchor for the P1; no new REQ is needed.",
    "REQ-059's reason projection and REQ-046's reopenable ruling keep their text; the two reducer P2s are implementation refinements.",
    "No requirement in this packet claims the brief's policy or owner is table-derived; the security P2 is hardening beyond REQ-058 as written."
  ],
  "planSeed": [
    "Change `isLoopQuestion` and `_is_loop_question` to read only an unrefused run ask, then add the question-plus-refusal row to the shared fixture and the guards tests.",
    "Group `buildExhaustedApproaches` on `splitRuledOutEntry(...).direction`, merge reasons, and make the separator scan ignore Markdown code spans.",
    "Have `ownedCommandRecommendation` return the tracked table's `policy` and `ownerSkillId`, and add a mismatched child-row case to the ownership test.",
    "Refresh the three continuity blocks to the thirteenth round and generation 10, and rewrite T053's Verify clause to AC-008's `Waived` status."
  ],
  "findingClasses": ["class-of-bug", "cross-consumer", "test-isolation", "docs-drift"],
  "affectedSurfacesSeed": [
    "isLoopQuestion / _is_loop_question",
    "hasUnrefusedRunAsk",
    "buildExhaustedApproaches / splitRuledOutEntry",
    "ownedCommandRecommendation / trackedCommandForOwner",
    "implementation-summary continuity block",
    "tasks.md T053"
  ],
  "fixCompletenessRequired": true
}
```

## 3. Active Finding Registry

### L1-P1-001 (P1, correctness)

- **Title:** A refused run ask in the question's later clause is read as the run the question asks for.
- **File:** `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1303`; twin at `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5357`.
- **Evidence:** `isLoopQuestion` returns `!LOOP_RUN_REQUESTED.test(...)`, and that pattern has no negation check, while `hasLoopAsk` skips the same phrase through `runAskNegatedAt`. The fallback copy returns `True` for "what is a deep review? don't run a deep review on the parser" and keeps the `system-deep-loop` row, so the served head offers `/deep:review (ask)` for a run the reader refused.
- **Impact:** a false offer on an explicit refusal, in both gate copies, which is the bug class this packet exists to prevent.
- **Fix:** read the unrefused ask helper (`hasUnrefusedRunAsk`) in both question branches, and add the row to the shared fixture.
- **Disposition:** active. `findingClass: class-of-bug`.

### L1-P2-001 (P2, correctness)

- **Title:** Two iterations that rule out one direction are written as two one-attempt directions.
- **File:** `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2414`.
- **Evidence:** `buildExhaustedApproaches` groups on the full entry text, so "X -- reason A" and "X -- reason B" are two keys with one attempt each; the `MIN_BLOCKED_ATTEMPTS = 2` branch is unreachable for that direction.
- **Fix:** group on the split direction, merge reasons, count runs from the merged bucket.

### L2-P2-001 (P2, security)

- **Title:** The hook brief vets a child-supplied command but still trusts the child's policy and owner.
- **File:** `.skilled/skills/system-skill-advisor/runtime/lib/skill-advisor-brief.ts:191`.
- **Evidence:** on an accepted command the brief returns the original recommendation, while `trackedCommandForOwner` returns the table's `policy` and `ownerSkillId` and the CLI uses those values. A row `{skill: "system-deep-loop", command: "/deep:review", policy: "run", ownerSkillId: "sk-code"}` renders `sk-code → /deep:review (run)` although the table says `ask` and `system-deep-loop`.
- **Fix:** return `{ ...recommendation, ...trackedCommandForOwner(skill, command) }`.

### L3-P2-001 (P2, maintainability)

- **Title:** A ruled-out reason that quotes a spaced `--` inside a code span is cut in two.
- **File:** `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2396`.
- **Evidence:** the separator scan does not respect backticks; this lineage's own strategy shows the entry "only `\s+--\s+` and `\s+—\s+` split an entry" cut mid-code-span.
- **Fix:** mask code spans before the scan.

### L3-P2-002 (P2, maintainability)

- **Title:** The brief ownership test cannot tell the child's policy and owner from the tracked table's.
- **File:** `.skilled/skills/system-skill-advisor/runtime/tests/brief-command-owner-check.vitest.ts:113`.
- **Evidence:** the accepted row uses `policy: "start"` and `ownerSkillId: "sk-doc"`, exactly the table's values for `/create:readme`, so it passes whether the brief keeps the child's fields or overrides them.
- **Fix:** add a mismatched child row and assert the table's values win.

### L4-P2-001 (P2, traceability)

- **Title:** The continuity metadata still names generation 8 as the latest round.
- **File:** `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/implementation-summary.md:13`; also `acceptance-criteria.md:13` and `decision-record.md:13`.
- **Evidence:** `recent_action` says "Generation 8 recorded"; `next_safe_action` says "Fix the nine generation 8 P2s, then run generation 9"; the same files carry thirteenth-round content and a 21:44 timestamp.
- **Fix:** point each block at the thirteenth-round result and the open AC-040 rerun.

### L7-P2-001 (P2, traceability)

- **Title:** T053 still says AC-008 reads `Met`, while the row reads `Waived`.
- **File:** `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:114`.
- **Evidence:** T053's Verify clause says `Met`; AC-008 is `Waived` under ADR-003 and T062 records the waiver.
- **Fix:** rewrite T053's Verify clause to the waived status.

## 4. Remediation Workstreams

1. **P1 first:** fix the question/refusal branch in both copies, add the fixture row, and add the guards case. Re-run both suites and the 69-probe compare.
2. **Reducer projection (P2):** group exhausted approaches by direction and make the separator scan code-span aware; extend the T120 unit cases with two-iteration and code-span inputs.
3. **Hook-brief trust (P2):** make `ownedCommandRecommendation` return the table's policy and owner; add the mismatched-child case to the ownership test and the CLI parity test.
4. **Closure records (P2):** refresh the three continuity blocks and T053's Verify clause; re-run `evidence-tails.py` and `validate.sh --strict`.

## 5. Spec Seed

- Keep REQ-015 as the P1's anchor: a spelled-out refusal withholds the command, including after a loop question.
- Keep REQ-046 and REQ-059 as written; the two reducer P2s are implementation refinements inside their scope.
- Record that REQ-058 claims the command check only; a policy/owner passthrough is hardening beyond the requirement as written.

## 6. Plan Seed

- Task 1: `isLoopQuestion` / `_is_loop_question` use `hasUnrefusedRunAsk`; fixture row `question-then-refused-run`; guards case; both suites.
- Task 2: `buildExhaustedApproaches` groups on `splitRuledOutEntry(...).direction`; `splitRuledOutEntry` masks code spans; unit cases for two iterations and a backticked separator.
- Task 3: `ownedCommandRecommendation` spreads the tracked table's values; ownership test with `policy: "run"` and `ownerSkillId: "sk-code"`.
- Task 4: continuity blocks and T053; `evidence-tails.py` problems=0; `validate.sh --strict` `RESULT: PASSED`.

## 7. Traceability Status

- **Core `spec_code`: partial.** Every REQ-001 to REQ-059 is mapped to a code, fixture, probe or decision pointer (iterations 4 to 6). The one gap is REQ-015's general refusal rule, where `L1-P1-001` lives.
- **Core `checklist_evidence`: partial.** All 67 acceptance rows and all checked task and checklist rows were read (iteration 7): 62 `Met`, 3 `Waived`, 1 `Superseded`, 1 `Unmet`. Every `Met` row has an `Evidence:` tail and `evidence-tails.py` reports `problems=0`. The T053/AC-008 contradiction is the one drift.
- **Overlay `feature_catalog_code`: pass.** The advisor-recommend leaf matches the gate and command contract.
- **Overlay `playbook_capability`: pass.** NC-012's prompts and expected signals match the guards test and the tracked table.
- **Overlay `skill_agent`: notApplicable.** No agent definition is in the change set.
- **Overlay `agent_cross_runtime`: notApplicable.** No runtime mirror is in the change set.
- **AC_COVERAGE: advisory-shortfall.** 66 of 67 rows are covered (62 Met, 3 Waived, 1 Superseded); AC-040 is `Unmet` and waits for this rerun's terminal gates.

## 8. Deferred Items

- The reducer's two projection failures (`L1-P2-001`, `L3-P2-001`) are advisory and can ship after the P1; they change strategy prose, not product behavior.
- The brief's policy/owner passthrough (`L2-P2-001`) needs a buggy or compromised fallback to occur, which is why it is P2.
- The two closure-record drifts (`L4-P2-001`, `L7-P2-001`) are a single docs pass.
- Known limitations recorded in `implementation-summary.md` (the blind -04 holdouts, the argument-hint soft budget, the multi-round alias memo, F6's offer rate, the typed-on-stuck diagnosis, the multi-pass compiler miss, the untyped fallback brief) stay outside this review's verdict.

## Dimension Expansion Map

- Swept dimensions: all four configured dimensions, one iteration each for correctness, security and maintainability, four traceability passes.
- Completed pivots: 0; failed pivots: 0; audited overrides: 0; remaining frontier: none (default depth mode, no frontier nodes).
- Selected review directions: the thirteenth-round gate code, the two-copy parity, the hook brief, the reducer projections and the closure records.

## 9. Search Ledger

- `searchCoverage`: no v2 search-depth record was emitted; this is a legacy v1 run. The iteration narratives carry the coverage: the two gate copies, the fixture, the reducer, the brief, the command/presentation docs, the hub files and the seven packet docs.
- `candidateCoverage`: covered = the 77 scope files; ruledOut = the five hypotheses closed in iterations 1, 3 and 5; deferred = none; blocked = none.
- `searchDebt`: 0.
- `ruledOutCandidates`: the pronoun-refusal path, the `then`/`and` join, the typed-on-stuck row, the second doctor declaration, the mode-free Python row, the no-edit read-only rule, the refused mode cue and the corpus regression.
- `cleanSearchProof`: each of the above was read at file:line and is recorded in the iteration's Ruled Out section.

## 10. Audit Appendix

- **Convergence:** 7 of 7 iterations; stop reason `maxIterationsReached`; new-findings ratios 1.0, 0.14, 0.29, 0.125, 0, 0, 0.11; dimension coverage 4 of 4; search debt 0.
- **Coverage:** every configured dimension reviewed; both core protocols attempted; four overlays recorded (two pass, two notApplicable).
- **Ruled-out claims:** the eight hypotheses above.
- **Sources reviewed:** the 77 files in `review-scope-files.txt`; the probe snapshots `results-after.json` and `ac034-served-head.jsonl`; the corpus files `command-prompts.jsonl` and `command-routing-baseline.json`; the seven packet docs; `decision-record.md` ADR-001 to ADR-009.
- **Cross-reference appendix:** Core Protocols: `spec_code` partial, `checklist_evidence` partial. Overlay Protocols: `feature_catalog_code` pass, `playbook_capability` pass, `skill_agent` notApplicable, `agent_cross_runtime` notApplicable.
- **Self-check:** the one P1 was re-read at its cited lines before the verdict; no P0 existed; no finding was downgraded or marked false positive.
