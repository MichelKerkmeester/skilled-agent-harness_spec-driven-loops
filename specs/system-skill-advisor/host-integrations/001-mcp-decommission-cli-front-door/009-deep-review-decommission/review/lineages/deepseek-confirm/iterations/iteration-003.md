# Iteration 3: D3 Traceability — packet completion presentation

## Focus

Dimension: traceability (`confirm-target.txt` question 3; question 1 item 9 — whether prior F015's "packet cannot present its own completion" actually closes).
Files: `009-deep-review-decommission/{spec.md,plan.md,tasks.md,goal.md,description.json,implementation-summary.md}`, `025-mcp-decommission-cli-front-door/{spec.md,goal.md,description.json}`, `008-verification-and-closeout/{spec.md,acceptance-criteria.md,implementation-summary.md}`, fix commit `16a01fa20c`.

## Scorecard

- Dimensions covered: traceability
- Files reviewed: 12
- New findings: P0=0 P1=1 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.0

## Findings

### P0, Blocker

None.

### P1, Required

- **F003**: Prior F015 does not fully close — the packet's completion-presentation surface is fixed in three places and still stale in two. Fixed: `008-verification-and-closeout` now carries a real verification record (8 acceptance rows, each naming evidence), `008/spec.md` status is `Complete`, and the parent `goal.md` Progress table marks every phase `Done`. Still stale: (a) the parent `spec.md` Phase Documentation Map — the document that declares "Parent spec tracks aggregate progress via this map" (`spec.md:154`) — reads `Draft` for phases 1-8 and `Pending` for 9-10 with literal `[Phase N scope]` placeholders, contradicting `goal.md` (phases Done) and the child `spec.md` statuses (`008`, `009`, `010` each `Complete`; phases `001`-`007` `Draft`); the table is also split by a blank line after row 8, so rows 9-10 fall outside it; (b) the target packet's own docs — `009-deep-review-decommission/spec.md` (template description at `:3`, `[What is broken...]` at `:60`, `[Deliverable 1]` at `:72`, `[Requirement description]` at `:96`), `tasks.md` (13 unchecked placeholder tasks, 0 checked), `plan.md`, `goal.md` (placeholder Objective/decisions) and `description.json` (template description whose keywords are literally `broken, missing, inefficient, ...`) — remain unpopulated scaffolds beside a `Status: Complete` metadata row. The prior finding named exactly these two clauses; the fix commit (`16a01fa20c`) touched `008/**`, the parent `goal.md`, `description.json` and `graph-metadata.json`, never the parent `spec.md` or `009/**`.
  Reproduction: `rg -n "Draft|Pending|\[Phase 9 scope\]" specs/system-skill-advisor/025-mcp-decommission-cli-front-door/spec.md` → rows 141-151; `rg -n "Status" specs/.../008-verification-and-closeout/spec.md specs/.../009-deep-review-decommission/spec.md` → both `Complete`; `grep -c "\- \[ \]" specs/.../009-deep-review-decommission/tasks.md` → 13.
  ```json
  {
    "findingId": "F003",
    "claim": "The packet still cannot fully present its completion: the parent phase map remains stale/placeholder and malformed, and the 009 packet's own spec, plan, tasks, goal and description are unpopulated scaffolds while spec.md declares Status: Complete.",
    "evidenceRefs": [
      "specs/system-skill-advisor/025-mcp-decommission-cli-front-door/spec.md:141-151",
      "specs/system-skill-advisor/025-mcp-decommission-cli-front-door/spec.md:154",
      "specs/system-skill-advisor/025-mcp-decommission-cli-front-door/009-deep-review-decommission/spec.md:3",
      "specs/system-skill-advisor/025-mcp-decommission-cli-front-door/009-deep-review-decommission/spec.md:25",
      "specs/system-skill-advisor/025-mcp-decommission-cli-front-door/009-deep-review-decommission/description.json:3"
    ],
    "counterevidenceSought": "Checked the parent goal.md Progress table (all phases Done — a different surface), each child spec.md status (008/009/010 Complete, 001-007 Draft), the fix commit's file list (no parent spec.md, no 009 docs), and the 009 implementation-summary (authored). Confirmed the blank line before row 9 splits the markdown table.",
    "alternativeExplanation": "The phase map could be frozen at authoring-time status and deliberately not maintained; rejected because spec.md itself says 'Parent spec tracks aggregate progress via this map', the map's own status column carries later values (Draft on some, Pending on others), and rows 9-10 are template text.",
    "finalSeverity": "P1",
    "confidence": 0.82,
    "downgradeTrigger": "If the map is declared authoring-only by an operator decision, or refreshed to match goal.md and the child statuses, downgrade this to P2 (or resolved for the map clause) — the 009 scaffold clause would still stand separately.",
    "transitions": [
      { "iteration": 3, "from": null, "to": "P1", "reason": "Initial discovery in confirm loop; residue of prior F015's phase-map and unpopulated-scaffold clauses" }
    ]
  }
  ```

### P2, Suggestion

- **F004**: `goal.md` Progress row still measures the durable directive at 2,481 characters, a number that predates its own compression. The row reads "Durable directive compressed for the operator surface | Done | Durable text measured at 2,481 characters against the 4,000 cap" (`goal.md:111`), while the same fix line states the compressed measurement is 3,993 (`git show 16a01fa20c` message) and the durable text measured from `# Goal:` through the log anchor is 3,946 bytes (`awk '/^# Goal/{f=1} /ANCHOR:log/{exit} f{print}' goal.md | wc -c`). The row was present unchanged at `a87379aa61` — stale evidence inside the table the completion fix rewrote. Calibration note: the cap governs an operator surface that truncates from the tail, so a stale undercount reads as headroom that is not there.
  Reproduction: `rg -n "2,481" specs/system-skill-advisor/025-mcp-decommission-cli-front-door/goal.md` → `:111`.
  ```json
  {
    "findingId": "F004",
    "claim": "goal.md's Progress table understates the current durable-directive length (2,481 characters) against a measured 3,946 bytes, so the row's evidence is stale.",
    "evidenceRefs": [
      "specs/system-skill-advisor/025-mcp-decommission-cli-front-door/goal.md:111"
    ],
    "counterevidenceSought": "Measured the durable text three ways (whole file above the log anchor 4,979; from '# Goal:' to the log anchor 3,946; commit message 3,993); checked the row's history at a87379aa61 where it already read 2,481.",
    "alternativeExplanation": "The 2,481 figure could refer to a different draft of the durable section kept at an earlier commit; rejected because the row claims the current compressed measurement and no revision in between reports 2,481 as current.",
    "finalSeverity": "P2",
    "confidence": 0.75,
    "downgradeTrigger": "If the row is refreshed to the current measurement, resolve; if a convention defines the figure as a different span, downgrade to informational.",
    "transitions": [
      { "iteration": 3, "from": null, "to": "P2", "reason": "Initial discovery during the completion-presentation audit" }
    ]
  }
  ```

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | parent spec.md:141-151 vs goal.md:105-125 vs child statuses | Normative completion claims contradict the map; F003 |
| checklist_evidence | partial | hard | 009 tasks.md:13 unchecked; 008 acceptance-criteria.md all `Met` | The 008 rows' claims were sampled (AC-002 re-verified clean; AC-001/004/005/006 execution-dependent and recorded as owed) |

## Assessment

- New findings ratio: 1.0 (one P1 + one P2; weights 5+1 of 6)
- Dimensions addressed: traceability
- Novelty justification: the fix commit's own message claimed the packet now presented completion; auditing each remaining surface found the two it did not touch. Both are reproducible from the tree without tooling.

## Ruled Out

- "008 still cannot present its completion": `acceptance-criteria.md` carries eight `Met` rows and `implementation-summary.md` a full verification table; the gate record is authored. Closed.
- "The parent goal doesn't track progress": `goal.md:105-125` marks every phase Done with evidence. Closed.
- "The 009 packet has no completion record": `implementation-summary.md` is a full authored record of the audit and its limitations. The scaffold finding is about the other five docs, not the record.

## Dead Ends

- Searching for a second progress surface that would redeem the parent map: none; `spec.md` is the only file claiming to track it.

## Recommended Next Focus

D2 Security + D4 Maintainability — Q2 regression scan over what the fixes touched (paths, printed commands, trust claims), and the Q3 evidence audit (suite numbers, baseline, acceptance-row reproduction status).

Review verdict: CONDITIONAL
