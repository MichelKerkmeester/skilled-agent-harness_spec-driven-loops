# Iter 009 — Within-doc consistency check

## Question

Within each of `SKILL.md`, `references/loop_protocol.md`, `references/convergence.md`, `references/state_format.md`, are there sections that make mutually contradictory claims about the same behavior, default, field, or contract? Cross-surface consistency was confirmed in iter 8; this iter is about WITHIN-doc consistency. Each contradiction MUST cite two locations IN THE SAME DOC with `file:line`.

## Evidence (file:line citations required)

### convergence.md

**Section 1: Shared Stop Contract (lines 82-130)**
The blocked_stop event example shows 7 gates in gateResults:
- convergenceGate (line 106)
- dimensionCoverageGate (line 107-110)
- p0ResolutionGate (line 112)
- evidenceDensityGate (line 113)
- hotspotSaturationGate (line 114)
- claimAdjudicationGate (line 115)
- fixCompletenessReplayGate (line 116)

<ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/references/convergence.md" lines="98-123" />

**Section 2: Legal-Stop Gate Bundle (lines 400-412)**
The gate table lists only 6 gates:
- findingStability (line 406)
- dimensionCoverage (line 407)
- p0Resolution (line 408)
- evidenceDensity (line 409)
- hotspotSaturation (line 410)
- fixCompletenessReplay (line 411)

<ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/references/convergence.md" lines="404-412" />

**Section 3: Gate Evaluation function (lines 415-444)**
The buildReviewLegalStop function implements only 6 gates matching the table:
- findingStability (line 418)
- dimensionCoverage (line 422)
- p0Resolution (line 428)
- evidenceDensity (line 432)
- hotspotSaturation (line 436)
- fixCompletenessReplay (line 440)

<ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/references/convergence.md" lines="415-444" />

### loop_protocol.md

**Section 1: Step 2 Check Convergence (lines 182-186)**
States the decision tree records "five review-specific gates: convergenceGate, dimensionCoverageGate, p0ResolutionGate, evidenceDensityGate, and hotspotSaturationGate" (5 gates).

<ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/references/loop_protocol.md" lines="182-186" />

**Section 2: Step 4a Claim Adjudication (line 351)**
States that claimAdjudicationGate acts as a hard STOP gate and is consulted by the legal-stop decision tree, implying a 6th gate.

<ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/references/loop_protocol.md" lines="350-352" />

## Findings (numbered)

### Finding 1: convergence.md gate count contradiction (P0)

**Contradiction:** The blocked_stop event example in Section 1 shows 7 gates including `claimAdjudicationGate` and `convergenceGate`, while Section 2's gate table and Section 3's function show only 6 gates with `findingStability` instead of `convergenceGate` and no `claimAdjudicationGate`.

**Section A claim:** (Section 1, lines 98-123) The blocked_stop event example shows 7 gates: `convergenceGate`, `dimensionCoverageGate`, `p0ResolutionGate`, `evidenceDensityGate`, `hotspotSaturationGate`, `claimAdjudicationGate`, and `fixCompletenessReplayGate`. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/references/convergence.md" lines="98-123" />

**Section B contradiction:** (Section 2, lines 404-412) The gate table lists only 6 gates: `findingStability`, `dimensionCoverage`, `p0Resolution`, `evidenceDensity`, `hotspotSaturation`, and `fixCompletenessReplay`. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/references/convergence.md" lines="404-412" />

**Section C contradiction:** (Section 3, lines 415-444) The buildReviewLegalStop function implements only 6 gates matching the table, not the 7 gates shown in the event example. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/references/convergence.md" lines="415-444" />

**Severity:** P0 - This is a contract contradiction that affects the actual gate implementation and JSONL schema. The event example shows gate names and counts that don't match the gate table or implementation function.

### Finding 2: loop_protocol.md gate count contradiction (P1)

**Contradiction:** Step 2 Check Convergence states the decision tree has 5 gates, but Step 4a Claim Adjudication describes claimAdjudicationGate as a hard STOP gate consulted by the legal-stop decision tree, implying at least 6 gates.

**Section A claim:** (Step 2 Check Convergence, lines 182-186) States "That decision tree records five review-specific gates: convergenceGate, dimensionCoverageGate, p0ResolutionGate, evidenceDensityGate, and hotspotSaturationGate." <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/references/loop_protocol.md" lines="182-186" />

**Section B contradiction:** (Step 4a Claim Adjudication, line 351) States "the next iteration's step_check_convergence legal-stop decision tree consults that event via claimAdjudicationGate (gate f). A missing or failing packet vetoes STOP even when every other gate passes." This implies claimAdjudicationGate is part of the legal-stop decision tree, making it at least the 6th gate. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/references/loop_protocol.md" lines="350-352" />

**Severity:** P1 - This is a documentation inconsistency about gate count. The actual implementation may include claimAdjudicationGate, but the prose in Step 2 contradicts this by stating only 5 gates.

## Gaps for next iter

No gaps - this iteration successfully identified within-document contradictions across the deep-review skill documentation.

## JSONL delta row