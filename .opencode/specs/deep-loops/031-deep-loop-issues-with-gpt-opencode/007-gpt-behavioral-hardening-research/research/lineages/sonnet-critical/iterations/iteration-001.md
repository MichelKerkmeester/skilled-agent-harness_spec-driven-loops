# Iteration 1 — Phase 005 "inconclusive" is doing self-protective work

**Focus:** KQ-CRIT-1, KQ-CRIT-2 — does "Phase 005 never reached a real leaf dispatch / did not prove the agent-layer fix works" (gpt-fast-high, consolidated research.md) accurately represent what actually happened, or does it launder a de facto failure into a neutral non-result?

## What was read

- `research/lineages/gpt-fast-high/research.md` (full, prior session)
- `research/lineages/glm-max/research.md` (full, prior session)
- `research/research.md` (consolidated, prior session)
- `005-gpt-verification-smoke/verification-smoke.md` (full, this iteration)
- `006-host-hard-identity-fix5/decision-record.md` (full, this iteration)

## Finding 1 — Phase 005's actual outcome is 4/4 dispatch_failure-class signals, not a neutral "blocked" result

Re-reading `verification-smoke.md` §6 directly:

| Mode | Workflow Result | Verdict |
|---|---|---|
| research | Halted at Phase 0 | FAIL: `GENERAL AGENT REQUIRED failure`; YAML not reached |
| review | Halted before workflow writes | FAIL: `cli-opencode self-invocation refused`; `OPENCODE_PID=63869` |
| context | Parent timed out after artifacts written | FAIL/BLOCKED: GPT seat blocked before launch by `OPENCODE_PID` |
| ai-council | Workflow executed, failed cleanly | FAIL/BLOCKED: dispatch stopped at `phase_loop.step_orchestrate_session.pre_dispatch` |

[SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/005-gpt-verification-smoke/verification-smoke.md:117-124]

All four rows are explicitly labeled `FAIL` or `FAIL/BLOCKED` in the source document itself — the document's own table does not use the word "inconclusive" anywhere. That word first appears in this packet's own downstream synthesis layer (research-prompt.md §2: "Phase 005 (GPT verification smoke, the acceptance gate) is inconclusive, not a clean pass"), then gets repeated verbatim in flavor by both fan-out lineages:

- gpt-fast-high: "Phase 005 did not prove the agent-layer fix works because all command-owned GPT smokes failed before real leaf dispatch." [gpt-fast-high/research.md:11]
- glm-max: "Why phase 005 was inconclusive (CONFIRMED): all 4 command-owned attempts tripped the cli-opencode 3-layer self-invocation guard." [glm-max/research.md:18]

Both are technically accurate paraphrases of the *cause* (self-invocation guard), but both use it to justify calling the *result* neutral ("inconclusive," "did not prove... works," i.e. framed as absence-of-proof-of-success) rather than what the source table actually says (`FAIL` × 4). This is not a factual error — it is a **framing choice**, and it is the specific kind of framing the operator's charter (§9.2) warns about: "places where 'wait for more evidence' was used to avoid a harder conclusion."

## Finding 2 — The decision-record's own trigger is more permissive than "inconclusive" implies, and was arguably already partially met

Decision-record.md's actual trigger text: "**If, for any mode, the GPT dispatch produces a route-mismatched artifact** ... OR a `dispatch_failure`/`jsonl_wrong_type`/missing-artifact signal fires while the native/Claude baseline passes — then the agent-layer fix is insufficient and 005 is mandatory." [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/006-host-hard-identity-fix5/decision-record.md:22]

Parsed carefully, this is a disjunction of two independent conditions:
1. route-mismatched artifact for any mode, OR
2. a dispatch_failure-class signal fires **while the native/Claude baseline passes**.

Condition 1 was never tested (no artifact was produced to mismatch — dispatch failed before producing one). Condition 2's dispatch_failure clause literally fired 4/4 times (`GENERAL AGENT REQUIRED failure`, `cli-opencode self-invocation refused`, blocked pre-launch, dispatch stopped pre-dispatch — all are dispatch_failure-class by the plain meaning of the phrase). What is actually missing is the qualifier "**while the native/Claude baseline passes**" — no native/Claude baseline was run in the same phase-005 session to compare against. [SOURCE: verification-smoke.md — no baseline run appears anywhere in §§1-7]

This means the honest characterization is: **the FIX-5 trigger's dispatch_failure clause could not be evaluated at all, because the required control (baseline) was never run — not because the GPT-side evidence was ambiguous.** The GPT-side evidence was unambiguous (4/4 failures); what's missing is the other half of the comparison. Neither prior lineage states it this way. Both describe the *whole* trigger as unmet/inconclusive, which conflates "one arm of the AND-like condition is unmet" with "the evidence itself is ambiguous." These are different claims with different implications for next steps: the former implies "run the missing baseline, and you likely have your trigger" (a targeted, small next step); the latter implies "we need much more evidence before we can say anything" (a vaguer, bigger ask). The prior gpt-fast-high recommendation choice — full external 8-run harness + benchmark as phase 008 — reads like the second framing. **Correction: the more surgical, higher-value first move is not a brand-new 8-run harness; it is completing the ALREADY-STARTED phase-005 comparison by running the SAME 4 command-owned smokes against native/Claude in the same environment** (external shell not even strictly required for this specific comparison, since the constraint was on the GPT leg via `cli-opencode`'s self-invocation guard, not on native dispatch — see iteration 2 for a check of whether native/Claude has the same guard).

## Finding 3 — Self-protective asymmetry: gpt-fast-high hedges toward "not yet a route-proof failure artifact"

gpt-fast-high's Executive Summary states: "The operator's real-world symptoms are enough to keep the problem active, but they are not yet a route-proof failure artifact." [SOURCE: gpt-fast-high/research.md:11, citing spec.md:58-60]

This sentence subtly reframes the operator's *direct, first-hand, confirmed* experience (§9.1 of this round's charter did not exist yet when gpt-fast-high ran, but the underlying operator report — spec.md:58-60 — already did) as something that needs to become a "route-proof failure artifact" before it counts as real evidence of a problem. That is a legitimate distinction for *validator-level* evidence (KQ1's specific ask), but gpt-fast-high uses it in the Executive Summary as the reason the *overall* recommendation is "staged hardening, not immediate FIX-5" — i.e., it lets a narrow evidentiary bar (route-proof artifact) gate a broad decision (whether to treat the problem as real and urgent). glm-max's equivalent framing is functionally identical in outcome (also recommends WAIT) but is explicit that Mode D is "CONFIRMED-in-mechanism, INFERRED-in-magnitude" [glm-max/research.md:36] — i.e., glm-max separates "is this real" (confirmed) from "how big is this" (unmeasured), while gpt-fast-high's phrasing blurs the two into a single "not yet... artifact" gate. This is the asymmetry the charter's §9.2 asks to name explicitly.

## Ruled out this iteration

- Treating "Phase 005 was inconclusive" as an accurate, evidence-neutral summary — RULED OUT. The source document's own table says FAIL/FAIL-BLOCKED for all 4 modes; "inconclusive" is a downstream reframing that both lineages inherited without re-deriving from the primary source.

## Status

`insight` — no new file reads beyond primary sources already cited by prior lineages, but a materially different reading of the same evidence.

newInfoRatio: 0.85 — novelty: re-deriving the phase-005 result directly from its own source table (rather than trusting the "inconclusive" characterization both prior lineages inherited) surfaces a framing bias neither lineage flagged, plus a concrete, smaller next step (run the missing native/Claude baseline against the SAME 4 already-attempted smokes) that neither lineage proposed in this form.
