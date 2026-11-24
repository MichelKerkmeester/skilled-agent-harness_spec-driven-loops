# Deep Review Report - 012-deep-loop-command-offers (lineage deepseek-max-1)

<!-- Lineage: fanout-deepseek-max-1-1795552859377-13gxwk | generation 9 | one of three lineages; the cross-lineage merge is the authoritative rollup -->

## Executive Summary

- Overall verdict: **PASS** (no active P0 or P1; five active P2 advisories)
- hasAdvisories: true
- P0/P1/P2 counts: 0 / 0 / 5 — these are the counts the verdict used, taken from the reducer-owned findings registry by `.skilled/skills/system-deep-loop/runtime/scripts/review-verdict.cjs`.
- Self-check outcomes: no P0 or P1 was raised, so the adversarial Hunter/Skeptic/Referee pass had nothing to adjudicate. Each of the five P2s carries its own claim packet and a counterevidence search in the iteration that raised it; four hypotheses raised during the run were disproved and are recorded under the iterations' Ruled Out sections.
- Review scope: 72 files on `review-scope-files.txt` — the packet's five closure docs, the two gate copies, the shared fixture and advisor tests, the deep-loop reducer and its tests, the two command documents, both presentation files, the hub router, and the changelog.
- Operator review focus: Traceability is the lead focus: finish the spec_code and checklist_evidence protocols. Check every REQ in spec.md (REQ-001 to REQ-053) against the code that implements it or the decision that records it (ADR-001 to ADR-009), and every ticked task in tasks.md and every Met row in acceptance-criteria.md (AC-001 to AC-061) against evidence that really exists in the tree, including the twelfth fix round (T112 to T114). Cover all four configured dimensions, because the coverage gate needs each one recorded before the last iteration. Give correctness, security and maintainability one iteration each within iterations 1 to 4, and spend the rest on traceability. Record every finding's file as its full repo-relative path, such as specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md, never a bare file name. The scope gate matches full paths only. Do not write a terminal_gates row yourself. The orchestrator computes it with terminal-gates.cjs after the run.
- Iterations: 7 of 7, stop reason `maxIterationsReached`. Both core traceability protocols finished at `pass`, and all four configured dimensions were reviewed (correctness 1, security 2, traceability 5).

## Planning Trigger

`/speckit:plan` is **not required** for this lineage's verdict: PASS with advisories. The five P2s are record and hardening items, and the operator may fold them into the next fix round without a planning pass. The merge across the three lineages decides whether the packet's release state changes.

```json
{
  "triggered": false,
  "verdict": "PASS",
  "hasAdvisories": true,
  "activeFindings": ["L1-P2-001", "L1-P2-002", "L1-P2-003", "L1-P2-004", "L1-P2-005"],
  "remediationWorkstreams": [
    {
      "id": "WS-1",
      "severity": "P2",
      "title": "Re-point three closure counts and pointers",
      "findings": ["L1-P2-003", "L1-P2-004"],
      "files": ["specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md", "specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md"],
      "action": "Set CHK-001's count to 53 and re-point AC-028's Evidence tail at the eleventh-round row (implementation-summary.md:195), relabelling its round as the eleventh."
    },
    {
      "id": "WS-2",
      "severity": "P2",
      "title": "Retire or mark the stale requirement and question records",
      "findings": ["L1-P2-002", "L1-P2-005"],
      "files": ["specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md"],
      "action": "Name the live list in REQ-011 (LOOP_WORDING / LOOP_REQUEST) instead of DEPTH_WORDING, and mark the N9 open question resolved by AC-021 or move it to history."
    },
    {
      "id": "WS-3",
      "severity": "P2",
      "title": "Fold zero-width format characters in both gate copies",
      "findings": ["L1-P2-001"],
      "files": [".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts", ".skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py", ".skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json"],
      "action": "Extend lowerFolded and _fold_quotes to strip U+200B and U+FEFF, add one shared fixture row per character, and keep the drift guard's folds compared."
    }
  ],
  "specSeed": [
    "REQ-011 names the live loop-ask lists rather than the retired DEPTH_WORDING identifier.",
    "spec.md section 10 marks the N9 question resolved by AC-021 and keeps the K3 assumption as recorded scope.",
    "REQ-049's whitespace clause either names zero-width format characters or records that they are out of contract."
  ],
  "planSeed": [
    "Edit tasks.md:268 to print 53 and re-tick with a fresh observation.",
    "Edit acceptance-criteria.md:85 to cite implementation-summary.md:195 and say 'after the eleventh round'.",
    "Edit command-attach.ts:884 and skill_advisor.py:5109 to strip ZWSP and BOM; add fixture rows and extend the vocabulary guard."
  ],
  "findingClasses": ["docs-drift", "input-normalization gap"],
  "affectedSurfacesSeed": [
    "tasks.md checklist evidence",
    "acceptance-criteria.md evidence tails",
    "spec.md requirement and open-question records",
    "command-attach.ts lowerFolded",
    "skill_advisor.py _fold_quotes",
    "deep-loop-offer-cases.json shared fixture"
  ],
  "fixCompletenessRequired": false
}
```

## Active Finding Registry

| ID | Severity | Title | Dimension | File:line | Finding class | Fix recommendation | Disposition |
|---|---|---|---|---|---|---|---|
| L1-P2-001 | P2 | Zero-width format characters inside a loop phrase still lose the offer | security | `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:884` | input-normalization gap | Strip U+200B/U+FEFF in both folds and pin one fixture row per character | active |
| L1-P2-002 | P2 | REQ-011 names `DEPTH_WORDING`, a surface the tree no longer carries | traceability | `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:235` | docs-drift | Name `LOOP_WORDING`/`LOOP_REQUEST` as the live lists | active |
| L1-P2-003 | P2 | `CHK-001` still counts 52 requirement rows, and the tree has 53 | traceability | `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:268` | docs-drift | Set the count to 53 with a fresh observation | active |
| L1-P2-004 | P2 | `AC-028` cites the eighth-round row for the eleventh round's suite counts | traceability | `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:85` | docs-drift | Point the tail at `implementation-summary.md:195` and relabel the round | active |
| L1-P2-005 | P2 | The open-questions section still carries a decision the packet has since answered | traceability | `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:390` | docs-drift | Mark the N9 item resolved by AC-021, or move it to history | active |

Each P2's claim packet, counterevidence search, alternative explanation and downgrade trigger is recorded in the iteration that raised it (iterations 2, 3, 5 and 7).

## Remediation Workstreams

1. **WS-1 — closure counts and pointers (P2, 2 findings).** L1-P2-003 and L1-P2-004 are one-line edits in the checklist and the acceptance file; both were verified by running the commands the rows name, so the corrected values are the ones quoted in the findings.
2. **WS-2 — stale record entries (P2, 2 findings).** L1-P2-002 and L1-P2-005 are record clarity: one names a retired list, the other leaves a decision open that an acceptance row has answered. Neither touches behaviour.
3. **WS-3 — input normalization hardening (P2, 1 finding).** L1-P2-001 is the only code item. It is hardening beyond REQ-049's stated contract: a zero-width character between the words of a loop phrase loses the offer, while every whitespace run is already folded.

No P0 or P1 workstreams exist in this lineage.

## Spec Seed

- REQ-011 should name the loop-ask lists the tree carries (`LOOP_WORDING`, `LOOP_REQUEST`) instead of `DEPTH_WORDING`, so a reader can check the clause it states.
- REQ-049 should either include zero-width format characters in its whitespace clause or say they are out of contract, matching whichever way WS-3 lands.
- `spec.md` §10 should record the N9 question as resolved by `AC-021`'s observed outcome, and keep the K3 assumption as recorded scope rather than as an open question.

## Plan Seed

- `tasks.md:268` — change 52 to 53 and record the fresh observation.
- `acceptance-criteria.md:85` — change the round label to the eleventh and the Evidence tail to `implementation-summary.md:195`.
- `command-attach.ts:884` and `skill_advisor.py:5109` — strip `\u200b` and `\ufeff` alongside the whitespace fold; add one shared fixture row per character and extend the vocabulary guard so the two copies stay compared.
- `spec.md:235` and `spec.md:390` — two record edits, no behaviour change.

## Traceability Status

**Core protocols**

| Protocol | Status | Evidence | Notes |
|---|---|---|---|
| `spec_code` | pass | REQ-001 to REQ-053 mapped across iterations 3, 5 and 6, each row to a live file:line or ADR section | No requirement is unmapped. REQ-033's outcome stays open because AC-040 is `Unmet` in the tree. |
| `checklist_evidence` | pass | 61 AC rows, 114 tasks and 26 checklist rows read at row level (iteration 5); `scratch/citations/evidence-tails.py` prints `problems=0` on this tree | Two P2 drifts recorded against `CHK-001` and `AC-028`; the protocol itself completed. |

**Overlay protocols** — not applicable to this target's changed surfaces, and not run: the packet edits two gate copies, their tests and fixture, the reducer, and its own docs. No agent definition, cross-runtime agent mirror, feature catalog entry or playbook changed, so `skill_agent`, `agent_cross_runtime`, `feature_catalog_code` and `playbook_capability` have no surface here. They are named rather than silently skipped.

**AC_COVERAGE** — `advisory-shortfall`: 60 of 61 acceptance rows are `Met`, `Waived` or `Superseded`; `AC-040` reads `Unmet` because it is the rerun this lineage belongs to. The signal is advisory and does not change the verdict. `resource-map.md` is absent, so the Resource Map Coverage Gate is skipped, as `deep-review-config.json` records with `resource_map_present: false`.

## Deferred Items

- The three cross-lineage items belong to the fan-out root, not to this lineage: the merged verdict, the terminal-gate rows computed by `terminal-gates.cjs`, and the packet's release-readiness state.
- `validate.sh --strict` was not run from inside this lineage; the dispatch forbids repository validators here. The acceptance-tail script and the row-level evidence above stand in for it, and the omission is named rather than hidden.
- No `resource-map.md` exists for this packet, so the resource-map coverage audit stays deferred until one is authored.

## Dimension Expansion Map

- Dimensions covered: correctness (iteration 1), security (iteration 2), traceability (iterations 3, 5, 6, 7), maintainability (iteration 4). Coverage: 4 of 4.
- Completed pivots: none — this was a default-depth run with no divergence pivot. Failed pivots: none. Audited overrides: none.
- Swept directions: none recorded; the run never reached a saturated direction, because each iteration opened a new slice of the packet.
- Remaining frontier: no expansive frontier exists for this lineage (`depthMode: default`, no frontier node store).

## Search Ledger

- `searchCoverage`: required bug classes for this run were state/record drift (`docs-drift`) and input handling. Covered: `docs-drift`; ruled out: none; deferred: none; blocked: none. `graphCoverageMode`: graph, through the seeded scope graph and the per-iteration upserts.
- `candidateCoverage`: the candidates examined were the requirement table (53 rows), the acceptance table (61 rows), the task checklist (114 tasks and 26 checklist rows), the ADR set (9 decisions), the changelog's loop-offer claims, and the gate's input path. Every candidate reached a verdict.
- `searchDebt`: none. The verdict's `search_debt` count is 0.
- `ruledOutCandidates`: astral-character cut divergence; ReDoS through an unbounded prefix scan; a forged command through the degraded renderer; doctor-gate disagreement on a no-edit stuck complaint; unescaped command name in `DOCTOR_NAMING_LED`; Next Focus line flattening; the Verification Summary totals; `T084` as missing evidence; the continuity `next_safe_action` field; REQ-039's baseline provenance; REQ-047's fourth mode-free row; the timeline's report pointer.
- `cleanSearchProof`: each ruled-out candidate names the file:line that disproved it in its iteration's Ruled Out section.

## Audit Appendix

- **Convergence summary:** 7 iterations under `stopPolicy: max-iterations`, stop reason `maxIterationsReached`. Ratios by iteration: 0.0, 1.0, 0.5, 0.0, 0.5, 0.0, 0.2. Convergence was treated as telemetry only, per the dispatch, and the run broadened its angles rather than synthesizing early.
- **Coverage summary:** 4 of 4 dimensions; both core protocols at `pass`; 5 active P2 findings, 0 P0, 0 P1.
- **Ruled-out claims:** listed in Search Ledger above; each has a named disproving surface.
- **Sources reviewed:** the packet's `spec.md`, `tasks.md`, `acceptance-criteria.md`, `decision-record.md`, `implementation-summary.md`, `timeline.md` and `review/fanout-review-focus.txt`; the gate copies `lib/command-attach.ts`, `lib/scorer/fusion.ts`, `lib/scorer/lanes/explicit.ts`, `skill-advisor-cli.ts`, `lib/skill-advisor-brief.ts`, `lib/subprocess.ts`, `lib/render.ts`, `handlers/advisor-recommend.ts`, `schemas/advisor-tool-schemas.ts` and `scripts/skill_advisor.py`; the fixture and the advisor tests named in the findings; `runtime/scripts/reduce-state.cjs`; `.skilled/changelog/skilled/v4.2.0.0.md`; and the two command documents.
- **Cross-reference appendix — Core Protocols:** `spec_code` and `checklist_evidence`, both `pass`, evidence above.
- **Cross-reference appendix — Overlay Protocols:** not applicable to this target's changed surfaces; see Traceability Status.
