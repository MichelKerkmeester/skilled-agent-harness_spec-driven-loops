---
title: Turn Close-Out Next Steps Research Strategy
description: Detached fan-out lineage strategy deciding whether a turn close-out next-steps obligation, plus structured question-tool use, belongs in the repo-rules set. Completed at the iteration cap.
trigger_phrases: []
---

# Deep Research Strategy

## 2. TOPIC

Decide from repository evidence whether a close-out obligation belongs in this repository's
repo-rules set, and if so in what shape. The operator's request, verbatim: "Always end with
next steps in msg if i need to do something and / or use ask question tool". Half (A): a turn
must end with the actions that are now the operator's to take. Half (B): where a choice is
needed, a structured question tool is used instead of a prose question, named per runtime.

## 3. KEY QUESTIONS (remaining)

- [x] KQ-1 always-loaded test: answered. Half (A) must bind on read-only turns, half (B) is action-conditioned.
- [x] KQ-2 four-part refusal test: answered. Single row, partly carried, anchored, still refused.
- [x] KQ-3 restraint test: answered. No failure caused by the absence of this rule is evidenced.
- [x] KQ-4 scope boundary test: answered. Half (B) sits Out, and it would be a fourth widening.
- [x] KQ-5 verdict: answered. AGENTS.md-row, decided by the always-loaded test.

## 4. NON-GOALS

- Do not draft rule text, edit `REPO RULES.md` or `AGENTS.md`, or write outside the lineage directory.
- Do not treat authoring a rule as the goal. A refusal verdict is an acceptable outcome.
- Do not re-derive the already ruled-out fact that no binding document mentions a question tool.

## 5. STOP CONDITIONS

- Complete exactly four evidence-gathering iterations; convergence is telemetry only because stopPolicy is max-iterations.
- Answer all five key questions with `file:line` citations that resolve, and record the verdict with the deciding test.

## 6. KNOWN CONTEXT

- Corpus under study: `REPO RULES.md` (154 lines), nine rule files under `repo-rules/`, `AGENTS.md` (515 lines).
- Decision doctrine: `.opencode/skills/sk-doc/sk-create-repo-rule/references/decision-tests.md` (four tests), plus `rule-anatomy.md`, `creation-standards.md`, `agents-md-integration.md`.
- The load mechanics are decisive: Gate 5 fires on the FIRST write of a session and read-only turns never fire it (`AGENTS.md:121-122`); `REPO RULES.md` §1 states nothing fires means `AGENTS.md` alone governs (`REPO RULES.md:18`).
- Prior rule-set records: `specs/sk-doc/040-create-repo-rules/` (ten refusals, refusal reproduction) and `specs/sk-doc/043-repo-rules-router-audit/` (Gate 5 payload measurement, read-only turn loads zero rules).
- The packet being researched: `specs/agents/009-turn-closeout-next-steps/` (phase 001 spec states the gap; phase 002 decides shape).

## 7. WHAT WORKED

- Reading the load mechanics before the content question. Gate 5's read-only exclusion decided the always-loaded test, not the shape of the request. (iteration 1)
- Inventorying the existing obligations line by line, which made the "partly satisfied" verdict concrete rather than impressionistic. (iteration 2)
- Checking provenance of the two adjacent clauses, which turned "the rule is missing" into "the rule was never demanded by an incident". (iteration 3)
- Reading the third-widening paragraph as a pre-commitment, which made the fourth-widening answer determinate. (iteration 4)

## 8. WHAT FAILED

- The first hypothesis, that the "close out a turn" trigger row made a rule-file home viable, does not survive the Gate 5 mechanics. (iteration 1)
- The hypothesis that an existing rule already carries the action list in full. It does not. (iteration 2)
- Three distinct search angles produced no incident record for the restraint test. The negative finding is the result. (iteration 3)
- The hypothesis that the third carve-out could admit per-runtime tool naming as an evidence obligation. A tool name is selection, not verification. (iteration 4)

## 9. EXHAUSTED APPROACHES (do not retry)

### A rule-file home for half (A), resting on the REPO RULES.md §2 close-out trigger row. [SOURCE: REPO RULES.md:42] -- BLOCKED (iteration 1)
- What was tried: routing the close-out obligation through `evidence-and-proof.md` because closing out is a listed trigger.
- Why blocked: Gate 5 loads only on the first write of a session, and read-only turns never fire it, so the row cannot guarantee the load at the close-out message.
- Do NOT retry: asserting a trigger row guarantees a load at message time.

### A full-satisfaction claim based on the existing close-out status. [SOURCE: repo-rules/evidence-and-proof.md:169] -- BLOCKED (iteration 2)
- What was tried: treating §10 item 3, "what only the operator can verify", as the operator action list.
- Why blocked: it is a verification list for work already done, not a list of actions the operator must now take.
- Do NOT retry: reading the status obligation as an action obligation.

## 10. RULED-OUT DIRECTIONS

- Re-deriving whether a binding document mentions a question tool: already ruled out, zero hits outside `specs/` records.
- Treating the parent packet's gap statement as failure evidence: it is a gap claim authored with the request, not an incident record.
- Using the third-widening routing carve-out as precedent for per-runtime tool naming: the carve-out admits verifying wiring while refusing selection.

## 11. NEXT FOCUS

- Complete. Synthesis written to `research.md`. Verdict: `AGENTS.md-row`, decided by the always-loaded test. Phase 002 owns the shape decision and the operator question on the §4 widening.
