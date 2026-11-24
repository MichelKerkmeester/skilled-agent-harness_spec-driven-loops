---
title: "Deep Review Report: 012 deep-loop command offers (lineage opus-medium-3)"
description: "Five-iteration review of the deep-loop offer gate, its Python fallback and the packet 013 typed-command hint. One P1, nine P2, verdict FAIL on the coverage gate."
---

# Deep Review Report: 012 deep-loop command offers (lineage opus-medium-3)

## 1. Executive Summary

- **Verdict: FAIL.** `review-verdict.cjs` derives it. The findings alone give CONDITIONAL: no P0 and one active P1. The coverage gate also fails with `traceability-incomplete`, because both core protocols, `spec_code` and `checklist_evidence`, ended `partial` on the gaps below. That failed gate forces FAIL.
- Active findings: P0 0, P1 1, P2 9. Every finding cites a file and line in the declared scope, and the evidence and scope gates pass.
- Stop reason: `maxIterationsReached` (5 of 5, stopPolicy `max-iterations`). All four dimensions were covered.
- Release readiness: `in-progress`.
- Review focus: the deep-loop offer gate in `command-attach.ts`, the Python fallback in `skill_advisor.py`, and the packet 013 typed-command hint. Every iteration probed the TypeScript source directly, using node type stripping. The Python module was imported read-only and its CLI was never run.

## 2. Planning Trigger

The P1 blocks a PASS. Route it to `/speckit:plan` for packet 012 or a follow-up child. Before any code changes, the operator has to decide one thing: when a stuck-run complaint also types `/deep:review`, should the brief offer the typed command (what the native path does today) or the doctor (what the Python path and the packet docs say)?

## 3. Active Finding Registry

| ID | Sev | Dim | Title | Location |
|----|-----|-----|-------|----------|
| O3-R3-P1-006 | P1 | traceability | A typed `/deep:review` in a stuck-run complaint still reaches the native brief while the Python gate drops it. AC-027 records both as withheld | `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:434` |
| O3-R1-P2-001 | P2 | correctness | A typed deep command is lost when the prompt also types a longer, different command (TS longest-key rule; Python disagrees) | `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:238` |
| O3-R1-P2-002 | P2 | correctness | The degraded path drops `typed`, so a typed deep command still gets the A/B/C offer (013 REQ-006) | `.skilled/skills/system-skill-advisor/runtime/lib/render.ts:250` |
| O3-R2-P2-003 | P2 | security | `skip`, `avoid`, `instead of` and `refuse` do not withhold the deep command, in TS or Python | `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:440` |
| O3-R2-P2-004 | P2 | security | A stuck-run complaint attaches the run-policy doctor despite "please don't run anything" | `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:837` |
| O3-R2-P2-005 | P2 | security | The Python `_has_loop_ask` is quadratic: a 96 000-char prompt takes 6.3 s against a 3 s fallback timeout | `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4718` |
| O3-R3-P2-007 | P2 | traceability | AC-008's evidence text says "accepted that as Met" while its status is Waived | `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:65` |
| O3-R4-P2-008 | P2 | maintainability | Python inlines the vocabulary lists that TS keeps as data, and nothing generates or compares them | `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4529` |
| O3-R5-P2-009 | P2 | correctness | The review mode cue misses `checking`/`inspecting`/`scanning`, though its comment says the -ing form counts | `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:384` |
| O3-R5-P2-010 | P2 | correctness | The stage-one loop rule reads raw loop wording without the gate's subject and refusal exceptions (inference, not scorer-run) | `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:449` |

## 4. Remediation Workstreams

1. **Typed-command parity (P1-006, P2-001, P2-002).** Settle how a typed command interacts with the stuck-run rule. Make `typedCommandForTop` and the Python `_typed_deep_command` choose the same way: prefer the deep command the route attached, not the longest key across unrelated commands. Have `degradedRecommendations` set `typed: true` on rows it keeps because the prompt typed them. Extend `deep-loop-offer-cases.vitest.ts` so the fixture's `typedReviewKept` is asserted through `attachTypedCommand` as well.
2. **Refusal and consent vocabulary (P2-003, P2-004).** Add `skip`, `avoid`, `instead of` and `rather than` to `RUN_ASK_NEGATED` and its Python twin, as the typed-command decline list already does. Withhold the doctor when the prompt says not to run anything.
3. **Fallback performance (P2-005).** Bound the Python scan, for example by checking the prefix tail only, since the patterns are end-anchored.
4. **Sync cost and vocabulary (P2-008, P2-009, P2-010).** Use one vocabulary source for both languages. Add the -ing defect-check verbs. Let the stage-one rule reuse the gate's exceptions, or confirm by a scorer run that it does no harm.
5. **Doc hygiene (P2-007).** Reword AC-008's evidence cell to match `Waived`.

## 5. Spec Seed

- REQ-020 should state end-to-end parity: what the native brief prints, after `attachTypedCommand`, equals what the Python gate keeps.
- REQ-015 should either list the refusal verbs it covers or say outright that it covers only the six named prompts.

## 6. Plan Seed

- T1: decide the typed-plus-stuck rule. T2: implement it in both languages and in the degraded row mapper. T3: add fixture rows for every probe prompt quoted above. T4: widen the refusal and cue vocabularies. T5: fix the Python scan cost and add a timing test. T6: reword AC-008.

## 7. Traceability Status

| Protocol | Status | Notes |
|----------|--------|-------|
| spec_code | partial | REQ-020 fails end to end, REQ-015's general rule has gaps, and 013 REQ-006 fails on the degraded path. REQ-005 and 013 REQ-001 pass. |
| checklist_evidence | partial | AC-027 overclaims, and AC-008's text contradicts its status. The other AC rows cite concrete evidence. Probes and suites were not rerun, because this lineage may not run repo tooling. |
| overlays | not run | skill_agent, agent_cross_runtime, feature_catalog_code and playbook_capability were not exercised. |

## 8. Deferred Items

- Run the full scorer on "several passes of the linter failed, review the config" to confirm or drop P2-010.
- Run `skill_advisor.py --stdin` on the typed prompts to confirm what the degraded brief prints for P2-002. Today that rests on reading `skill-advisor-cli.ts:1501-1510`.

## 9. Audit Appendix

- Iterations: 001 correctness, 002 security, 003 traceability, 004 maintainability, 005 correctness (second pass).
- newFindingsRatio by iteration: 1.0, 1.0, 1.0, 0.29, 0.15.
- Terminal gates: evidence pass, scope pass, coverage fail (`traceability-incomplete`).
- Probe scripts (lineage scratch only): `scratch/probe.mts`, `scratch/redos.mts`.
- steer.md was absent at every check.
