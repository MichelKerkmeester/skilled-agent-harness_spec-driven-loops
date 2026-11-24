# Deep Review Report — Packet 012, lineage deepseek-max-1

Generated: 2026-11-24T12:04:00.000Z
Run: `fanout-deepseek-max-1-1795518961022-7ms9ak`, generation 1, lineage mode `new`
Executor: `cli-pi` model `deepseek-v4.1-flash-1017`, reasoning effort `max`
Iterations: 7 of 7 (`stopPolicy=max-iterations`, stop reason `maxIterationsReached`)

## 1. Executive Summary

**Overall verdict: CONDITIONAL**
**hasAdvisories:** false (the verdict is CONDITIONAL because active P1s remain, so the advisory flag does not apply)
**Active findings:** P0 = 0, P1 = 4, P2 = 8 — these are the counts the verdict used (`review-verdict.cjs` over the registry).

The packet's traceability record is in good shape: every `Met` row resolves, the Verification Summary matches its boxes, the one `Unmet` row (AC-040) is coherent with the open task, the open check box and `Closeable: No`, and the hub/router/skill documents agree. The code, however, still has four must-fix defects in the deep-loop offer gate, all on paths the shared fixture does not exercise, and the two requirement rows that promised those outcomes read `Met`/`pass` because their checks are narrower than their claims.

**Adversarial self-check:** no finding was downgraded or called a false positive. The Referee confirmed the four P1s against the re-read source and served measurements; no P0 candidate was raised.

**Review scope:** 46 files from the pre-bound scope list (packet docs, the advisor gate and its tests, the deep presentation and command assets, the two deep YAML workflows, the reducer), plus hub/router documents and agent mirrors as context evidence.

**Operator review focus (config.reviewFocus, verbatim):** Traceability: finish the spec_code and checklist_evidence protocols. Check every REQ in spec.md against the code that implements it or the decision that records it, and every ticked task in tasks.md and every Met row in acceptance-criteria.md against evidence that really exists in the tree, including the sixth fix round (REQ-023 to REQ-034, AC-030 to AC-042, ADR-005, ADR-006).

**How the focus was covered:** iteration 1 ran `spec_code` over REQ-001..REQ-039 and found two P1s; iteration 2 ran `checklist_evidence` over all 47 criteria and 123 tasks and found three P2 pointer defects with zero unresolved citations; iterations 3 to 6 executed the sixth-to-eighth-round rules on the served gate and found two more P1s and three P2s; iteration 7 closed the overlay protocols.

## 2. Planning Trigger

`/speckit:plan` **is required**: four active P1 findings name code paths that must change before this packet can close, and AC-040 (the coverage rerun) stays open until they are fixed and this review is rerun.

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": {
    "P0": 0,
    "P1": 4,
    "P2": 8,
    "ids": ["ITER1-P1-001", "ITER1-P1-002", "ITER3-P1-001", "ITER6-P1-001", "ITER1-P2-003", "ITER2-P2-001", "ITER2-P2-002", "ITER2-P2-003", "ITER3-P2-002", "ITER4-P2-001", "ITER5-P2-001", "ITER5-P2-002"]
  },
  "remediationWorkstreams": [
    {"id": "WS-1", "priority": "P1", "findingIds": ["ITER3-P1-001", "ITER3-P2-002"], "surface": "command-attach.ts deferredLoopCommand", "work": "Strip refused loop phrases from cueText before MODE_CUES reads it, and let an unrefused plural loop name supply the mode."},
    {"id": "WS-2", "priority": "P1", "findingIds": ["ITER6-P1-001"], "surface": "command-attach.ts attachCommand", "work": "Do not apply the no-edit guard to read-only deep-loop workflows; keep it for writing commands."},
    {"id": "WS-3", "priority": "P1", "findingIds": ["ITER1-P1-002"], "surface": "hub-router.json / command-attach.ts cue read", "work": "Make the plural loop names reach the routed mode, or amend REQ-035 to the layer that was built."},
    {"id": "WS-4", "priority": "P1", "findingIds": ["ITER1-P1-001"], "surface": "command-attach.ts routed branch", "work": "Blank a loop-name subject before the routed mode is read, or amend REQ-026 to name the deferred-route condition it actually covers."},
    {"id": "WS-5", "priority": "P2", "findingIds": ["ITER1-P2-003", "ITER4-P2-001"], "surface": "command-attach.ts commandOnlyMentioned / doctor lane", "work": "Treat a past-run summary as no doctor ask, and accept a comma-joined typed doctor as a request."},
    {"id": "WS-6", "priority": "P2", "findingIds": ["ITER2-P2-001", "ITER2-P2-002", "ITER2-P2-003"], "surface": "acceptance-criteria.md / tasks.md", "work": "Repoint the three evidence cells and resolve AC-019's Then/Observed disagreement."},
    {"id": "WS-7", "priority": "P2", "findingIds": ["ITER5-P2-001", "ITER5-P2-002"], "surface": "tests/deep-loop-offer-cases.vitest.ts / hub-router.json", "work": "Compare the gate grammar, and give the four mode-vocabulary surfaces one cross-check."}
  ],
  "specSeed": [
    "Amend REQ-035 so its promise matches the layer that was built, or extend the router to the plural names.",
    "Amend REQ-026 to name the routed path it does not cover, or extend the subject blanking to the routed branch.",
    "Add a requirement for the no-edit wording on read-only workflows.",
    "Record the refused-cue rule as a gate invariant with a fixture row."
  ],
  "planSeed": [
    "Add a fixture column for the served command of every plural run row and assert it in both suites.",
    "Add refusal-plus-mode prompts to the shared fixture ('run deep reviews … but skip the deep research').",
    "Add no-edit review prompts to the shared fixture.",
    "Add a doctor-request prompt joined by a comma.",
    "Rerun the traceability review (AC-040) after the fixes."
  ],
  "findingClasses": ["spec-mismatch", "correctness", "evidence-pointer", "record-inconsistency", "drift-risk", "single-source-of-truth", "false-offer", "typed-request-withheld", "no-edit-withheld"],
  "affectedSurfacesSeed": [
    ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts",
    ".skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts",
    ".skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py",
    ".skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json",
    ".skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts",
    ".skilled/skills/system-deep-loop/hub-router.json",
    "specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md",
    "specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md",
    "specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md"
  ],
  "fixCompletenessRequired": true
}
```

## 3. Active Finding Registry

| ID | Severity | Dimension | Title | Location | Evidence | Impact | Fix recommendation | findingClass | Disposition |
|---|---|---|---|---|---|---|---|---|---|
| ITER1-P1-001 | P1 | traceability | REQ-026's deferred-route guard never runs for the prompt it was built for | `command-attach.ts:1408` | Served head returns `/deep:research` for "run a deep loop to review the research loop config"; route is `route/single/research` | The requirement's stated outcome is not delivered; AC-033's synthetic deferred route cannot detect it | Blank the loop-name subject before the routed mode is read, or amend REQ-026 | spec-mismatch | active |
| ITER1-P1-002 | P1 | traceability | REQ-035 promises a command for eight plural run prompts; two carry none anywhere | `spec.md:326` | "run two deep loops on the cache layer" → hub, no command; "run two research loops …" → hub not recommended | Two of the requirement's eight run rows never offer a command; AC-044 checks only the predicate | Extend the router or amend the requirement to the built layer | spec-mismatch | active |
| ITER3-P1-001 | P1 | correctness | A refused loop phrase still supplies the mode cue, so the gate can offer the exact command the prompt refused | `command-attach.ts:1489` | "run deep reviews on the parser, but skip the deep research" → `/deep:research (ask)` | The offer contradicts an explicit refusal | Strip refused phrases from `cueText` before the cue read | correctness | active |
| ITER6-P1-001 | P1 | correctness | A no-edit clause withholds a read-only deep-loop offer | `command-attach.ts:1424` | "run a deep review of the parser but don't change anything" → no command | Common read-only phrasing loses the offer; equivalent phrasings keep it | Skip the no-edit guard for read-only deep workflows | correctness | active |
| ITER1-P2-003 | P2 | traceability | A past-run summary carries a doctor run command | `command-attach.ts:563` | "summarize the deep reviews from last week" → `/doctor:deep-loop (run)` | Read-only doctor offer on a summary request | Withhold the doctor on past-run reads | false-offer | active |
| ITER2-P2-001 | P2 | traceability | AC-015's evidence line proves the question-tool convention, not the three placements it claims | `acceptance-criteria.md:72` | `:30` cited; placements at `:223`, `:236`, `:246` | The row's `Met` cannot be confirmed from its evidence cell | Repoint the cell | evidence-pointer | active |
| ITER2-P2-002 | P2 | traceability | AC-041 and T082 cite a blank line and a neighbouring line for two closure claims | `acceptance-criteria.md:98` | `:232` blank; content at `:231` and `:233` | Citation lands on an empty line | Repoint both records | evidence-pointer | active |
| ITER2-P2-003 | P2 | traceability | AC-019's Then clause and its own observation disagree on the near-miss count | `acceptance-criteria.md:76` | Then says 15; Observed says 31; corpus holds 31 | Superseded row contradicts itself | Restate the Then at the superseded value | record-inconsistency | active |
| ITER3-P2-002 | P2 | correctness | Two non-command asks share the plural/cue gap and lose the offer silently | `command-attach.ts:1489` | "no deep research, run a deep review on the parser" → no command | Requested review not offered | Same fix as ITER3-P1-001 | correctness | active |
| ITER4-P2-001 | P2 | security (narrative tag: correctness) | A typed `/doctor:deep-loop` after a comma is read as a mention, not a request | `command-attach.ts:1325` | Comma withholds; semicolon or period keeps | Punctuation decides a typed request | Accept a comma-joined typed run-policy command as a request | typed-request-withheld | active |
| ITER5-P2-001 | P2 | maintainability | The drift guard compares vocabulary, not the grammar that carries the exceptions | `deep-loop-offer-cases.vitest.ts:68` | `VOCABULARY_PAIRS` + two numbers only; grammar hand-ported at `command-attach.ts:605` / `skill_advisor.py:4975` | A one-sided grammar edit passes | Compare the generated patterns, or add paired grammar cases | drift-risk | active |
| ITER5-P2-002 | P2 | maintainability | Four surfaces each carry their own mode vocabulary, and nothing checks that they agree | `command-attach.ts:450` | `LOOP_NAMES`, `MODE_CUES`, `NAMED_LOOP_MODE`, hub keywords | Future one-surface edits diverge silently | One cross-check test over the four surfaces | single-source-of-truth | active |

## 4. Remediation Workstreams

**P1 (must fix before closure)**

1. **WS-1 — Refused cues (ITER3-P1-001, ITER3-P2-002).** In `deferredLoopCommand`, compute a refusal-stripped copy of the prompt and read `MODE_CUES` from it, as `hasLoopAsk` already does. Add a fixture row for "run deep reviews … but skip the deep research" and one for "no deep research, run a deep review on the parser", asserting the served command.
2. **WS-2 — No-edit guard (ITER6-P1-001).** Before the `isNoEditRequest` return in `attachCommand` and `deferredLoopCommand`, exempt `system-deep-loop` (or the two read-only workflows) and add three fixture rows.
3. **WS-3 — Plural routing (ITER1-P1-002).** Either teach the hub/explicit lane the plural names, or amend REQ-035 to the predicate it built and record the two no-command rows as limits.
4. **WS-4 — Routed subject (ITER1-P1-001).** Either blank a loop-name subject in the routed branch too, or amend REQ-026 to name only the deferred route and record the served research outcome as accepted.

**P2 (advisory, ordered by value)**

5. **WS-5 — Doctor lane (ITER1-P2-003, ITER4-P2-001).** Withhold the doctor on a past-run read; accept a comma-joined typed doctor.
6. **WS-6 — Closure record (ITER2-P2-001/002/003).** Three pointers and one internal contradiction.
7. **WS-7 — Drift surfaces (ITER5-P2-001/002).** Grammar pairs and one mode-vocabulary cross-check.

## 5. Spec Seed

- REQ-035: replace "carry `/deep:review` or `/deep:research`" with the layer that is actually checked, or add the router change and a served assertion per row.
- REQ-026: state the routed-path outcome explicitly, because the deferred branch is unreachable for the motivating prompt.
- New REQ: a read-only constraint ("don't change anything") must not withhold a deep review or research offer.
- New REQ (or an invariant line in REQ-021): a refused loop phrase must not supply a mode cue.
- REQ-031: record that the drift guard compares vocabulary only, and name the grammar as an open gap.

## 6. Plan Seed

- T-1: add `servedCommand` to the plural fixture rows and assert it in the TypeScript and Python suites.
- T-2: add the three refusal-plus-mode prompts and the three no-edit review prompts to the shared fixture.
- T-3: add the comma-joined typed-doctor prompt to the doctor group.
- T-4: fix `deferredLoopCommand` and re-measure the 26 refusal and cue prompts.
- T-5: exempt read-only deep workflows from the no-edit guard.
- T-6: repoint AC-015, AC-041/T082 and restate AC-019.
- T-7: rerun `/deep:review` on this packet and close AC-040.

## 7. Traceability Status

**Core protocols**

| Protocol | Status | Evidence | Unresolved drift |
|---|---|---|---|
| `spec_code` | partial | REQ-001..REQ-039 mapped to producers; 50 requirement prompts executed on the served head; two requirements state outcomes the shipped path does not produce (ITER1-P1-001, ITER1-P1-002) | The two P1 mismatches, plus the two P1 code defects found under the same requirements (ITER3-P1-001, ITER6-P1-001) |
| `checklist_evidence` | pass | All 47 criteria and 123 tasks read; every `path:line` citation resolves (0 unresolved, 0 out-of-range); 120/123 boxes checked; AC-040 `Unmet` matches T084, CHK-020 and `Closeable: No` | Three P2 pointer/record defects (ITER2-P2-001/002/003) |

**Overlay protocols**

| Protocol | Status | Evidence | Unresolved drift |
|---|---|---|---|
| `skill_agent` | pass | Hub `SKILL.md:20`, mode packet `argument-hint:4` and Gate 2 lines, quick-reference `=` example | None |
| `agent_cross_runtime` | notApplicable | Packet changed no agent definition; canonical and `.opencode` identical; `.claude` differs by its generated header (mirror check owns parity) | None |
| `feature_catalog_code` | not run | No catalog surface was claimed by this packet | - |
| `playbook_capability` | not run | No playbook surface was claimed by this packet | - |

**AC_COVERAGE:** exempt. The target is a Level 2 spec folder with `acceptance-criteria.md`; no `checklist.md` exists, so the advisory signal does not apply.

## 8. Deferred Items

- **Feature-catalog and playbook overlays** were not run; the packet does not claim either surface.
- **Suite and build re-execution** is outside this lineage's write surface. Every suite count in the report is read from the packet's records; the review verified the cited files and line numbers, not a fresh run.
- **The hub keyword lists** are routing data; any plural change needs the out-of-domain replay ADR-002 requires.
- **Registry frontier:** none (default depth mode).

## Dimension Expansion Map

- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none
- Pivot lineage: none
- Remaining frontier: none recorded
- Selected review directions: traceability/spec_code (1), traceability/checklist_evidence (2), correctness/refusals and cues (3), security (4), maintainability (5), correctness follow-up (6), traceability overlays (7)

## 9. Search Ledger

Reducer-owned coverage for the terminal record:

- `searchCoverage.requiredBugClasses`: `["document_drift", "mirror_drift"]`
- `searchCoverage.covered`: `[]`
- `searchCoverage.ruledOut`: `["document_drift", "mirror_drift"]`
- `searchCoverage.deferred`: `[]`
- `searchCoverage.blocked`: `[]`
- `graphCoverageMode`: `graphless_fallback`
- `searchDebt`: 0 (no hasSearchDebt)

Per-iteration ledgers carry the detail: `deltas/iter-001.jsonl` (SL-001..SL-004), `iter-002` (SL-005..SL-008), `iter-003` (SL-009..SL-011), `iter-004` (SL-012..SL-013), `iter-005` (SL-014..SL-016), `iter-006` (SL-017..SL-018), `iter-007` (SL-019..SL-020). The reducer keeps only the latest pass's class list, which is why the terminal coverage above names the overlay classes; the earlier classes (`spec_mismatch`, `false_offer`, `refusal_bypass`, `false_negative`, `redos`, `command_injection`, `drift_risk`) were covered or ruled out in those ledgers.

## 10. Audit Appendix

**Convergence summary**

| Iteration | Dimension | New findings | Ratio |
|---|---|---|---|
| 1 | traceability / spec_code | 2 P1, 1 P2 | 1.0 |
| 2 | traceability / checklist_evidence | 3 P2 | 0.214 |
| 3 | correctness | 1 P1, 1 P2 | 0.30 |
| 4 | security | 1 P2 | 0.048 |
| 5 | maintainability | 2 P2 | 0.087 |
| 6 | correctness (follow-up) | 1 P1, 1 P2 (refinement) | 0.193 |
| 7 | traceability (overlays) | 0 | 0.0 |

**Coverage summary:** 4 of 4 canonical dimensions covered (traceability 3 passes, correctness 3, security 1, maintainability 1); core protocols both run; overlay `skill_agent` pass, `agent_cross_runtime` notApplicable.

**Ruled-out claims:** 20 directions across the seven ledgers, including the depth-word gate, the council words, the token budget, the long-prompt cost, the degraded command injection, the keyword-table parity and the agent-mirror parity.

**Sources reviewed:** 46 pre-bound scope files, plus hub/router documents and agent mirrors as context. Full list in each iteration's `Files Reviewed` and in the run's `deep-review-state.jsonl`.

**Cross-reference appendix**

- **Core Protocols:** `spec_code` partial, `checklist_evidence` pass.
- **Overlay Protocols:** `skill_agent` pass, `agent_cross_runtime` notApplicable, `feature_catalog_code` not run, `playbook_capability` not run.
