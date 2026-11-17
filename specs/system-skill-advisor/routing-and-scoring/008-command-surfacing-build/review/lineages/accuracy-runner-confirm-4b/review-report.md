# Review Report: Command Surfacing Build, Pass Four (accuracy-runner lineage)

- Review target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build` (spec-folder)
- Pass: the confirming round of review pass four, on the fix range `11af224a34..48f03b5013`.
- Lineage: `accuracy-runner-confirm-4b`, area `accuracy-runner`, run `fanout-accuracy-runner-confirm-4b-1794680176420-xvj4ed`, executor `cli-opencode` `opencode-go/deepseek-v4.1-flash` at reasoning effort max.
- Reviewed scope: the nine paths in `review/review-scope-4b.txt` whose area is `accuracy-runner` — the routing-accuracy offer and runner pair, their two changed tests, the Codex session reader and its test, the Codex declaration map, and the doctor presentation row — plus the shared README that describes the pair.
- Inputs to this synthesis: the three iteration narratives, the three delta files, the lineage registry (2 active P2 findings), the strategy and the dashboard.
- Cross-area boundary: `lib/command-attach.ts`, the scorer modules, the feature docs and `score-command-transcripts.mjs` belong to `scorer-attach-confirm-4b`. This lineage read them only as context and raises no finding against them.
- Iteration cap: 3 of 3. The loop stopped at the cap; convergence was not declared.
- Operator review focus: Confirming round of review pass four of command surfacing. FIRST read and follow specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/review-brief-4b.txt: it names the scope file, the commit range, which files your lineage reviews and the checks. HOLDOUT RULE: never open command-prompts.jsonl or holdout-prompts.jsonl except through jq 'del(.prompt)', never run git diff, show or log -p over a path that includes command-prompts.jsonl without the pathspec ':(exclude)**/command-prompts.jsonl', and never print a prompt whose split is holdout. The reviewer changes no code and writes only inside its lineage folder.

---

## 1. Executive Summary

- **Verdict: PASS.** No P0 and no P1 findings are active.
- **hasAdvisories: true.** Two P2 documentation drifts remain active.
- **Active counts:** P0 0, P1 0, P2 2.
- **The P1 that this round confirms is fixed.** `offeredAs` now travels from `parseOffer` through both run-log writers: the backfill at `command-offer.mjs:496` and the live turn at `run-command-behaviour.mjs:1203` via `offerLineFields`. The scorer's single consumer reads the field at `score-command-transcripts.mjs:1471-1476`.
- **The Codex containment P2 is fixed.** `resolveInside` realpaths both sides and the reader now opens `storePath` (`codex.mjs:169`). The new test proves the link path is never opened and the resolved file is (`codex.test.mjs:117-127`).
- **The holdout guard holds in this area.** `findRow` refuses a split-holdout row before its prompt can reach a child (`run-command-behaviour.mjs:633-634`), and the G2 fixed prompts are runner-owned ids absent from both corpora. The live-capture half of the guard is present in the sibling area at `command-routing-slice.vitest.ts:206-210`.
- **The A11 malformed-row guidance agrees with the code.** The checker reports the cell count against the header width (`agents-md-check.cjs:776-778`), and the embed only splices missing rows (`agents-md-embed.cjs:373-410`).
- **The two P2s are README drift, not code drift.** The backfill paragraph still says three fields (`README.md:76`) and the runner table row lists three (`README.md:125`); the blanket "every line carries four fields" sentence (`README.md:65`) is false for the head-moved line written at `run-command-behaviour.mjs:1183`.
- **Holdout hygiene:** no holdout prompt text was read or printed. Corpus access was limited to id and split counts, and no prompt value was used in a finding or report sentence.
- **Cross-runtime:** the changed Codex reader is shared; the runner's prompt and refusal logic is runtime-neutral. No live per-runtime session was captured in this lineage.
- **Release readiness:** `in-progress`. The cap was reached; no convergence event was recorded, and the packet checklist is still open.

---

## 2. Planning Trigger

No plan is required for the PASS verdict. The two P2s are advisory documentation corrections that can fold into phase 027 T012's follow-up; they do not block release.

```json Planning Packet
{
  "triggered": false,
  "triggerReason": "PASS with two advisory documentation drifts; no P0 or P1 remains.",
  "verdict": "PASS",
  "hasAdvisories": true,
  "counts": { "p0": 0, "p1": 0, "p2": 2, "active": 2, "iterations": 3 },
  "activeFindings": [
    {
      "id": "AR4B-P2-001",
      "severity": "P2",
      "title": "The README still says the backfill adds three fields and lists three in the runner row",
      "file": ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md:76",
      "findingClass": "doc_code_drift",
      "disposition": "advisory"
    },
    {
      "id": "AR4B-P2-002",
      "severity": "P2",
      "title": "The README says every run line carries four attribution fields, but a head-moved line carries none",
      "file": ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md:65",
      "findingClass": "doc_code_drift",
      "disposition": "advisory"
    }
  ],
  "remediationWorkstreams": [
    {
      "order": 1,
      "advisory": true,
      "name": "README attribution contract",
      "files": [".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md"],
      "actions": [
        "Change the backfill paragraph at :76 from three fields to four and name offeredAs.",
        "Add offeredAs to the run-command-behaviour field list at :125.",
        "Qualify the every-line sentence at :65 for the head-moved line, or state the exception beside the head-moved paragraph."
      ]
    }
  ],
  "specSeed": [
    "The routing-accuracy README is the doc of record for the two writers; its field lists must match the six fields the backfill writes and the four the live turn writes."
  ],
  "planSeed": [
    "Edit README.md:76 and :125 to name offeredAs.",
    "Edit README.md:65 to name the head-moved exception, or move the four-field statement under a completed-turn qualification."
  ],
  "findingClasses": ["doc_code_drift"],
  "affectedSurfacesSeed": [
    "routing-accuracy README attribution section",
    "run-command-behaviour head_moved path",
    "command-offer backfill output contract"
  ],
  "fixCompletenessRequired": false
}
```

---

## 3. Active Finding Registry

### AR4B-P2-001 — The README still says the backfill adds three fields and lists three in the runner row

- Severity: P2
- Dimension: traceability
- File: `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md:76`
- Finding class: `doc_code_drift`
- Evidence: `README.md:76` says "adds those three fields"; `README.md:125` says `--backfill` rewrites with `offeredCommand`, `offeredPolicy` and `briefDelivered`; `README.md:188` already names `offeredAs`; `command-offer.mjs:496` and `run-command-behaviour.mjs:824` write it.
- Case: run `--backfill`; every output line carries `offeredAs` (pinned by `command-offer.vitest.ts:385-388`), while the paragraph and the row count three.
- Fix: change "three" to "four" in the backfill paragraph and add `offeredAs` to the runner table row's field list.
- Scope proof: the README is in the declared scope; the two code lines are the changed writers.
- Affected surface hints: README backfill section, runner table row, the `offeredAs` attribution contract.
- Disposition: advisory, P2.

### AR4B-P2-002 — The README says every run line carries four attribution fields, but a head-moved line carries none

- Severity: P2
- Dimension: maintainability
- File: `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md:65`
- Finding class: `doc_code_drift`
- Evidence: `README.md:65` says each appended line carries four fields; `run-command-behaviour.mjs:1180-1184` appends `{ ...line, restored: false, headMoved: true }` before the offer replay and returns exit 3.
- Case: a turn that commits or stashes during the run sets `headMoved`; the written line has no `offeredCommand`, `offeredPolicy`, `offeredAs` or `briefDelivered`, and the scorer reads it as `offerFieldAbsent`.
- Fix: qualify the sentence for a completed turn, or name the head-moved exception in the paragraph that already documents exit 3.
- Scope proof: the README and `run-command-behaviour.mjs` are both in the declared scope.
- Affected surface hints: head-moved run line, exit 3, attribution contract, scorer `offerFieldAbsent`.
- Disposition: advisory, P2.

---

## 4. Remediation Workstreams

### P0 — none

### P1 — none

### P2 — advisory documentation

1. README attribution contract (`routing-accuracy/README.md`):
   - `:76` — three → four, and name `offeredAs`.
   - `:125` — add `offeredAs` to the `--backfill` field list.
   - `:65` — qualify the every-line sentence for the head-moved line, or name the exception in the exit-3 paragraph.

These edits touch one file and no code. They can fold into the phase 027 T012 follow-up.

---

## 5. Spec Seed

- The README's attribution section owns four live-turn fields (`offeredCommand`, `offeredPolicy`, `offeredAs`, `briefDelivered`) and six backfill fields (the four plus `offerError` and `offerBackfilled`).
- The head-moved line is a partial record by construction: it is written before the replay and the restore. Any "every line" statement must exclude it or say what it carries.
- Phase 027 T012's "both field lists" reading should include the backfill paragraph and the runner table row, not only the top list and the output sentence.

---

## 6. Plan Seed

- Update `README.md:76` to four fields and name `offeredAs`.
- Update `README.md:125` to add `offeredAs` to the backfill field list.
- Update `README.md:65` and the head-moved paragraph so the partial line is explicit.
- Re-run the README's own counts if any are asserted; no code or test change is needed.

---

## 7. Traceability Status

### Core Protocols

| Protocol | Level | Status | Notes |
|----------|-------|--------|-------|
| `spec_code` | core | partial | Phase 027 T006/T007/T010/T012/T013/T017 are `[x]` with evidence and the code matches T006/T007/T010. T012's "both field lists" misses the backfill paragraph and runner row (AR4B-P2-001). |
| `checklist_evidence` | core | partial | `CHK-040` asks `RA` to name `offeredAs` in both field lists; the two lists T012 edited are correct, the backfill lists remain stale. `CHK-FIX-003`/`CHK-FIX-004` stay open with the phase. |

### Overlay Protocols

| Protocol | Level | Status | Notes |
|----------|-------|--------|-------|
| `skill_agent` | overlay | notApplicable | No agent definition changed in this area. |
| `agent_cross_runtime` | overlay | notApplicable | No runtime branch in the changed docs or writers; the Codex reader is shared and tested directly. |
| `feature_catalog_code` | overlay | notApplicable | No feature-catalog page describes the two changed writers. |
| `playbook_capability` | overlay | notApplicable | No playbook surface changed. |

### AC_COVERAGE

`exempt`. The review target's root folder has no `acceptance-criteria.md`; the phase children hold
their own criteria, and this lineage's scope is the changed `accuracy-runner` files.

---

## 8. Deferred Items

- **Residual Codex read race.** A target replaced after `realpathSync` but before `readFileSync`
  remains a narrow race. The verify report's probe (a link swapped before containment) is fixed;
  closing the residual needs an `open` with a no-follow flag, which is outside this change.
- **A11 duplicate-row note.** A malformed shipped router row is reported as malformed and as
  missing, so an embed adds a second, well-formed copy and leaves the malformed row. The new A11
  row does not claim otherwise; it is an operator note, not a finding.
- **Sibling surfaces.** The live-capture holdout guard (`command-routing-slice.vitest.ts`), the
  scorer's `paired` key and `unscoredOnly`, and the feature docs are the sibling lineage's
  findings and are not re-reported here.

---

## 9. Dimension Expansion Map

- Completed pivots: none.
- Failed pivots: none.
- Audited overrides: none.
- Swept directions: none; the three iterations covered correctness, security and the
  traceability/maintainability recovery pass.
- Selected review directions: offer persistence, Codex containment, holdout guard, README and
  doctor row agreement.
- Remaining frontier: the packet checklist is still open, so traceability and maintainability are
  recorded as partial rather than complete.
- This section records breadth only. It does not change the Executive Summary, the finding
  registry or the verdict.

---

## 10. Search Ledger

### Search Coverage

- Required bug classes: `field_persistence`, `writer_parity`, `partner_semantics`,
  `doc_code_drift`, `symlink_escape`, `resolved_path_toctou`, `holdout_leak`,
  `untrusted_checkout_execution`, `checklist_evidence`.
- Covered: `doc_code_drift`, `checklist_evidence`.
- Ruled out: `field_persistence`, `writer_parity`, `partner_semantics`, `symlink_escape`,
  `resolved_path_toctou`, `holdout_leak`, `untrusted_checkout_execution`.
- Deferred: none.
- Blocked: none.
- `graphCoverageMode`: `graphless_fallback`.
- `searchDebt`: empty.
- `hasSearchDebt: false`.

### Candidate Coverage

- The candidate set was the nine `accuracy-runner` paths. Every changed source file was read at
  its changed lines; the two changed tests were read in full around the additions; the generated
  `codex.d.mts.map` was checked for the expected declaration shift only.
- `ruledOutCandidates`: none.
- `cleanSearchProof`: every required bug class has at least one cited direct read or grep.

### Ledger Rows

| Id | Dimension | Bug class | Disposition |
|----|-----------|-----------|-------------|
| AR4B-SL-001 | correctness | field_persistence | ruled_out |
| AR4B-SL-002 | correctness | writer_parity | ruled_out |
| AR4B-SL-003 | correctness | partner_semantics | ruled_out |
| AR4B-SL-004 | correctness | doc_code_drift | found (AR4B-P2-001) |
| AR4B-SL-005 | security | symlink_escape | ruled_out |
| AR4B-SL-006 | security | resolved_path_toctou | ruled_out |
| AR4B-SL-007 | security | holdout_leak | ruled_out |
| AR4B-SL-008 | security | untrusted_checkout_execution | ruled_out |
| AR4B-SL-009 | traceability | doc_code_drift | found (AR4B-P2-001) |
| AR4B-SL-010 | maintainability | doc_code_drift | found (AR4B-P2-002) |
| AR4B-SL-011 | traceability | checklist_evidence | ruled_out |

---

## Audit Appendix

### Convergence Summary

- Iterations: 3 of 3. Stop reason: `maxIterationsReached`. Convergence was not declared.
- Ratios: 0.0 → 0.0 → 1.0. The two clean iterations reached the stuck threshold, so iteration 3
  was a recovery pass at line-level doc granularity.
- Dimension coverage: 4 of 4 (correctness, security, traceability, maintainability).

### Coverage Summary

- Correctness: iteration 1; both writers and their tests.
- Security: iteration 2; Codex reader, containment helper, holdout guard.
- Traceability and maintainability: iteration 3 recovery pass; README, doctor row, phase 027
  task rows.

### Ruled-Out Claims

- A missing `offeredAs` on either writer: ruled out by the two writer lines and their tests.
- A partner-side command counted as an offer: ruled out by the scorer's side check.
- A Codex link escaping the store or being opened as the link: ruled out by `resolveInside` and
  the new test.
- A holdout row reaching a live turn through the G2 table: ruled out by row-id comparison.
- The A11 row contradicting the doctor code: ruled out by the checker message and the embed's
  insert-only path.

### Sources Reviewed

- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-offer.mjs`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md`
- `.skilled/skills/system-skill-advisor/runtime/tests/command-offer.vitest.ts`
- `.skilled/skills/system-skill-advisor/runtime/tests/command-behaviour-guards.vitest.ts`
- `.skilled/hooks/shared/session-readers/codex.mjs`
- `.skilled/hooks/shared/tests/session-readers/codex.test.mjs`
- `.skilled/hooks/shared/tests/session-readers/helpers.mjs`
- `.skilled/hooks/shared/session-readers/identity.mjs` (context)
- `.skilled/commands/doctor/assets/doctor-agents-md-presentation.txt`
- `.skilled/commands/doctor/scripts/agents-md-check.cjs` (context)
- `.skilled/commands/doctor/scripts/agents-md-embed.cjs` (context)
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/027-review-pass-four-remediation/tasks.md`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/verify-4/report.md`

### Cross-Reference Protocols

- Core: `spec_code` partial, `checklist_evidence` partial.
- Overlay: `skill_agent` notApplicable, `agent_cross_runtime` notApplicable,
  `feature_catalog_code` notApplicable, `playbook_capability` notApplicable.

### Release Readiness

`in-progress`. The verdict is PASS with advisories, but the stop reason is `maxIterationsReached`
and the packet checklist is still open, so the converged state is not claimed.
