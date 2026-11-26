# Iteration 001 - Correctness of the routing core

## Dimension

correctness (D1), first of five passes. The review target is the skill .skilled/skills/system-skill-advisor, 154 source files. This pass covered the routing and scoring core named in the strategy's Next Focus.
Operator review focus: the advisor's logic in runtime/ and hooks/, prose docs out of scope. Addressed here by reviewing the scorer, command-attach, prompt-policy, the recommend handler and the brief renderer inside runtime/. hooks/ and the Python fallback runtime/scripts/skill_advisor.py are carried into the security and maintainability passes, because their failure modes there are trust-boundary and duplication rather than ranking.

## Files Reviewed

- .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts - 1-1470, read in full (score assembly, seed bound, ambiguity wiring, doctor handoff, withhold passes)
- .skilled/skills/system-skill-advisor/runtime/lib/scorer/ambiguity.ts - 1-139, read in full
- .skilled/skills/system-skill-advisor/runtime/lib/prompt-policy.ts - 119-274, read (policy decisions and the exported token helper)
- .skilled/skills/system-skill-advisor/runtime/lib/scorer/scoring-constants.ts - 179-244, read (calibration surface)
- .skilled/skills/system-skill-advisor/runtime/lib/scorer/lane-registry.ts - 9-22, read (lane weights and live/shadow flags)
- .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts - 222-246 and 767-807, read (typedCommandIn, commandOnlyMentioned)
- .skilled/skills/system-skill-advisor/runtime/lib/scorer/executor-delegation.ts - 563-623, read (override return shape, for the double finishRanked splice)
- .skilled/skills/system-skill-advisor/runtime/lib/render.ts - 560-636, read (ambiguity rendering and brief head)
- .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts - 470-590, read (thresholds, cache key, ambiguous passthrough)

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **RRF-fused scores are normalised, thresholded and bonus-adjusted as if they were weighted sums** -- .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1189-1192 -- Verified by direct read of the cited lines; the surrounding call sites and the calibration constants were read to check for a deliberate reason.
Finding class: logic-defect / unit-mismatch
Scope proof: File is in config.reviewScopeFiles (reviewTarget .skilled/skills/system-skill-advisor).
Affected surface hints: fusion.ts:1189 score source -> fusion.ts:1208 confidence normalisation -> fusion.ts:1260-1265 comparator bonuses -> handlers/advisor-recommend.ts:586 ambiguous/effective thresholds
Case: With SPECKIT_ADVISOR_RRF_FUSION=1, a candidate matching all four live lanes at rank 1 scores at most 0.95/(8+1) = 0.106, so liveNormalized is about 0.11 and confidence about 0.58 instead of the 0.83 the same match gets on the weighted path; and a routing constant of 0.5 exceeds the whole RRF range.

2. **The skill-versus-command tie-break is disabled by any slash, including a file path** -- .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1254-1255 -- Verified by direct read of the cited lines; the surrounding call sites and the calibration constants were read to check for a deliberate reason.
Finding class: logic-defect / wrong predicate
Scope proof: File is in config.reviewScopeFiles.
Affected surface hints: fusion.ts:1254-1255 comparator penalty -> command bridges in projection.ts; the precise predicate already exists at command-attach.ts:222 and :767
Case: The prompt 'review src/lib/fusion.ts for bugs' contains two path slashes, so every passing command row keeps its unpenalised score and a bridge that would have ranked 0.08 below a skill now ties or overtakes it.

3. **The ambiguous flag is recomputed on the doctor-inclusive list, contradicting the doctor-free invariant** -- .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1462 -- Verified by direct read of the cited lines; the surrounding call sites and the calibration constants were read to check for a deliberate reason.
Finding class: invariant-violation
Scope proof: Files are in config.reviewScopeFiles; render.ts is the consumer.
Affected surface hints: fusion.ts:1272-1273 stated invariant -> fusion.ts:1407-1411 doctorFreeRun -> fusion.ts:1462 returned flag -> render.ts:599-607 printed brief line
Case: A prompt where a passing /doctor: bridge lands within 0.05 score of the top skill returns ambiguous true and prints the 'ambiguous: X vs Y' line although the skill slots were deliberately computed from a pass with those bridges removed; when applyDoctorHelperHandoff places a zero-score handoff first, two genuinely tied skills below it report ambiguous false.

4. **Low-information abstention counts stop words, drifting from the policy's own meaningful-token measure** -- .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1304-1306 -- Verified by direct read of the cited lines; the surrounding call sites and the calibration constants were read to check for a deliberate reason.
Finding class: measurement-drift
Scope proof: Both files are in config.reviewScopeFiles.
Affected surface hints: prompt-policy.ts:130-141 exported promptPolicyTokens contract -> fusion.ts:1304-1306 whitespace split -> fusion.ts:1333 lowInfoAmbiguityFloor abstention
Case: 'do it now' counts three words and turns the abstention floor on, while 'please do it now' counts four and turns it off, so one stop word removes the floor from an equally empty request.

5. **heldBelow names a single holder, so the ambiguity exception misses a cap set by another holder** -- .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:545-558 -- Verified by direct read of the cited lines; the surrounding call sites and the calibration constants were read to check for a deliberate reason.
Finding class: boundary-defect
Scope proof: Both files are in config.reviewScopeFiles.
Affected surface hints: fusion.ts:545-558 binding holder selection -> ambiguity.ts:68 heldBelow exception -> ambiguity.ts:70 score margin
Case: Two slash-anchored seeds such as /deep:review and /deep:research both hold one target; heldBelow records only the lower seed, so if the higher seed is the passing top the target's 1e-6 gap still falls inside AMBIGUITY_MARGIN and the pair reports as a coin flip.

## Traceability Checks

- spec_code (core, hard): partial. Compared the code against the scorer module's own documented caller contract - promptPolicyTokens is exported at .skilled/skills/system-skill-advisor/runtime/lib/prompt-policy.ts:130 with the stated purpose that callers judging prompt shape count words as the policy does - and found one caller that does not. No spec-document comparison ran this iteration, so the protocol stays partial rather than pass.
- checklist_evidence (core, hard): not run this iteration; it is a traceability-dimension activity and dimension 3 owns it.

## Integration Evidence

Exact surfaces checked as consumers of the ranking, not just as nearby files:
- MCP handler .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:565-586 passes thresholds into scoreAdvisorPrompt and republishes result.ambiguous unchanged at :586, which is why finding R1-P2-003 reaches the wire payload.
- Hook brief .skilled/skills/system-skill-advisor/runtime/lib/render.ts:599-607 consumes result.ambiguous as precomputedAmbiguous and prefers the scorer's named ambiguousWith partner, so a mis-shaped flag prints as a reader-visible 'ambiguous: X vs Y' line.
- CLI entry .skilled/bin/skill-advisor.cjs answered the probe through the daemon, which is the path the findings were probed on.

## Edge Cases

- Lineage contradiction: deep-review-config.json declares lineageMode restart, while the newest state event ('resumed', 2026-11-23T21:06:53.963Z) declares resume. The record copies config per the agent contract; the disagreement is recorded here rather than silently resolved.
- The probe with SPECKIT_ADVISOR_RRF_FUSION=1 returned byte-identical scores and confidences to the default run for three prompts. The best explanation is the already-warm daemon answering from its own process environment, so the probe is not evidence either that the flag works or that it does not. Finding R1-P2-001 therefore rests on the code, not on the probe.
- iterations/iteration-001.out exists from the crashed cli-devin dispatch and is not this iteration's artifact; it was left untouched.
- Scope was held to the named core. The Python fallback, hooks/, and the freshness and daemon code were not read this pass and no finding here implies they are clean.

## Confirmed-Clean Surfaces

- Seed-bound cap iteration terminates: caps are monotone decreasing and the loop runs one pass per held target (.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:525-541).
- clustersWithTop's floor exception and wideAmbiguityMembers' floor-tie handling behave as their comments describe (.skilled/skills/system-skill-advisor/runtime/lib/scorer/ambiguity.ts:63-123).
- The advisor self-recommendation penalty covers both the canonical id and the alias via ADVISOR_SELF_RECOMMENDATION_SKILL_IDS (.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:122, :740), while the confidence floor at :354 is alias-only by explicit design.
- applyExecutorDelegationOverride is length-preserving when the executor is already a candidate and adds at most the synthesized one (.skilled/skills/system-skill-advisor/runtime/lib/scorer/executor-delegation.ts:578-622), so the double finishRanked splice at .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1412-1421 stays index-aligned in both passes.
- Probe on the weighted path: 'review src/lib/fusion.ts for bugs' returned sk-code at score 0.551, confidence 0.832, uncertainty 0.12, one passing recommendation, ambiguous false - consistent with the calibration in .skilled/skills/system-skill-advisor/runtime/lib/scorer/scoring-constants.ts:182-195.

## Ruled Out

- dominantLane corrupting contribution order: it sorts a filtered copy, not the source array (runtime/lib/scorer/attribution.ts:8-10).
- buildConflictMatchIndex seeding rawScore at 0 and taking Math.min: correct for negative demotion scores, which is the only shape the graph conflict lane emits (.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:256-267).
- A stale ambiguousWith list after the withhold passes: render.ts:603-607 falls back to the second passing entry when a named partner is absent, so the reader never sees a partner that is not offered. Not a finding, though R1-P2-003 covers the aggregate flag.

## Next Focus

- Dimension: security.
- Focus area: the daemon and IPC surface (runtime/lib/daemon/, runtime/lib/ipc/, runtime/lib/auth/trusted-caller.ts), subprocess and Python bridge invocation (runtime/lib/subprocess.ts, runtime/scripts/skill_advisor.py bridge ), and the hook entry points under hooks/.
- Reason: iteration 1 reviewed no trust boundary. The handoff that builds a doctor recommendation at .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:987-1003 injects a passing recommendation without going through lane scoring, and the executor override at .skilled/skills/system-skill-advisor/runtime/lib/scorer/executor-delegation.ts:600-608 synthesizes one, so the security pass should check whether either can be reached with an attacker-influenced prompt.
- Required evidence: file:line receipts for each trust boundary, plus a probe of the socket or CLI entry where reachability is claimed.
- Rotation status: correctness is reviewed but not closed; findings R1-P2-001 through R1-P2-005 carry forward to the cross-cutting pass.

Review verdict: PASS
