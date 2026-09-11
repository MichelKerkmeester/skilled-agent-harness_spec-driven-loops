---
title: Synthesis Presentation Research Strategy
description: Detached fan-out lineage strategy deciding whether presenting synthesized recommendations in chat earns a repo rule, and what each of the six deep-loop modes owes the reader. Completed at the iteration cap.
trigger_phrases: []
---

# Deep Research Strategy

## 1. TOPIC

Decide whether presenting a synthesized set of recommendations in chat earns its own repo rule, and
establish what each of the six deep-loop modes owes the reader given what that mode actually
produces. The operator's request, verbatim: "synthesized recommendations should always be presented
in chat in simple and concise terms, structured written with HVR".

## 2. KEY QUESTIONS (remaining)

- [ ] KQ-1 always-loaded test: on a turn where no trigger fires, must the behaviour hold, or is presentation trigger-shaped?
- [ ] KQ-2 scope boundary test: quote REPO RULES.md section 4 In and Out, place the proposal, and decide whether a fifth widening is needed.
- [ ] KQ-3 four-part refusal test: single row or cluster, existing home, anchors, and how much of the request is already satisfied.
- [ ] KQ-4 restraint test: verify the 2026-09-11 four-iteration 265-line synthesis claim against the six Results Display sections.
- [ ] KQ-5 per-mode table: one row per mode with artifact, what chat should carry, what it should not, and whether "recommendations" is the right noun.
- [ ] KQ-6 HVR in a reply: quote the communication.md section 4 boundary and decide whether HVR can bind a reply.
- [ ] KQ-7 duplication line: where the repo rule stops and the mode contracts start, with the sibling packet 046 in view.

## 3. NON-GOALS

- Do not draft rule text, edit `REPO RULES.md` or `AGENTS.md`, or write outside the lineage directory.
- Do not edit any deep-loop presentation contract; that belongs to the sibling packet `specs/system-deep-loop/046-synthesis-chat-presentation`.
- Do not treat authoring a rule as the goal. `deep-loop-contracts-only` and `refuse` are acceptable verdicts.

## 4. STOP CONDITIONS

- Complete exactly four evidence-gathering iterations; convergence is telemetry only because stopPolicy is max-iterations.
- Answer all seven key questions with `file:line` citations that resolve, and record one verdict with the test that decided it.

## 5. KNOWN CONTEXT

- Corpus under study: `REPO RULES.md` (107 lines), ten rule files under `repo-rules/`, `AGENTS.md` (518 lines).
- Decision doctrine: `.opencode/skills/sk-doc/sk-create-repo-rule/references/decision-tests.md` (four tests), plus `rule-anatomy.md` and `creation-standards.md`.
- Load mechanics: Gate 5 fires on the FIRST write of a session and read-only turns never fire it (`AGENTS.md:121-122`); nothing fires means `AGENTS.md` alone governs (`REPO RULES.md:18`).
- Given and not re-derived: `repo-rules/communication.md` is 244 lines against a 250-line ceiling (`rule-anatomy.md:105,92`), so a new section cannot fit there; the trigger index corpus covers `specs/` and `.opencode/skills/`, not `repo-rules/`, so no rule file is indexed; every rule file loads only through `REPO RULES.md` section 2 under Gate 5.
- The packet: `specs/agents/009-turn-closeout-next-steps/006-synthesis-presentation` (spec states the failure and the sibling-packet boundary at `spec.md:42,64-66`).
- Sibling packet: `specs/system-deep-loop/046-synthesis-chat-presentation` will change the deep-loop presentation contracts.

## 6. WHAT WORKED

- Reading the load mechanics before the content question. Gate 5's read-only exclusion frames the always-loaded test. (iteration 1)
- Quoting the router's live section 4 instead of the doctrine doc's summary, which exposed that the fourth widening already exists on the live router. (iteration 1)
- Inventorying communication sections 7 and 8 line by line, which made "the delivery doctrine already has a home" concrete. (iteration 2)
- Verifying the 2026-09-11 incident against the lineage's own state files and the success template rather than accepting the packet's restatement. (iteration 2)
- Reading the six Results Display sections in full, which forced distinct per-mode answers instead of one generic answer. (iteration 3)

## 7. WHAT FAILED

- The hypothesis that the failure is absent today. It is real and verified at the contract level. (iteration 2)
- The hypothesis that HVR as a whole can bind a chat reply. Its document-structure layer cannot. (iterations 3-4)
- The hypothesis that a repo rule would add something the mode contracts and communication.md do not already carry. It would restate them. (iteration 4)

## 8. EXHAUSTED APPROACHES (do not retry)

### A new rule file for "present the synthesis" resting on the communication trigger row. -- BLOCKED (iteration 2)
- What was tried: routing the obligation through the already-existing "present a recommendation" trigger row.
- Why blocked: the row exists, but the content is a single row whose delivery half already lives in communication.md, and the missing half is per-mode content owned by the mode contracts.
- Do NOT retry: treating a passing always-loaded test as sufficient to warrant a new file.

### HVR as the structural standard for a chat reply. -- BLOCKED (iteration 4)
- What was tried: applying the full HVR standard, including its section 9 document structure, to a chat presentation.
- Why blocked: HVR section 9 is document-shaped (numbered ALL-CAPS H2s, dividers, no TOC); a chat message is not a document.
- Do NOT retry: "written with HVR" without naming which HVR layers bind a reply.

## 9. RULED-OUT DIRECTIONS

- Re-deriving that communication.md cannot host a new section: given (244 lines against the 250 ceiling).
- Re-deriving that repo-rules are not in the trigger index: given.
- Treating the packet's problem statement as the incident proof: the incident was verified independently from the 001 lineage artifacts, not from `spec.md:64`.

## 10. NEXT FOCUS

- Complete. Synthesis written to `research.md`. Verdict: `deep-loop-contracts-only`, decided by the four-part refusal test (single row plus existing home), with the restraint test confirming a real but contract-located failure.
