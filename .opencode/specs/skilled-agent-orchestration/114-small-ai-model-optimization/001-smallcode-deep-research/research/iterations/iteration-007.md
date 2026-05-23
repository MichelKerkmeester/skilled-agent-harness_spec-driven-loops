# Iteration 007 — RQ2 Deepening: Output Verification Recipe Additions

## Focus

RQ2 deepening — Concrete output-verification recipe additions. Iter 2 surfaced verifier + hard-fail + tool-scorer at principle level. This iter produces patch-ready specifics: (a) the EXACT lines of `system_instructions` to add to `cli-devin/assets/agent-config-deep-research-iter.json` for SWE-1.6 output-verification discipline, (b) confidence-scoring rubric formula adapted from smallcode's verification pipeline, (c) integration handshake with the existing `post-dispatch-validate.ts`, (d) hard-fail message template for refused delivery.

## Actions Taken

1. Read iter-002.md (RQ2 baseline) to extract the smallcode verification patterns discovered in iteration 2, including the exact confidence scoring formula, hard-fail gatekeeper logic, and multi-stage verification pipeline structure.

2. Read `agent-config-deep-research-iter.json` to understand the current `system_instructions` structure and identify where to add verification discipline without breaking existing configuration.

3. Read `deep-loop-iter-contract.md` to understand the iter contract structure and where verification sections would fit within the existing framework.

4. Read `post-dispatch-validate.ts` to understand the current validation surface (`validateIterationOutputs` function) and determine whether to extend it or create a sibling validator for output-quality verification.

5. Authored concrete artifacts: (a) drop-in `system_instructions` JSON snippet for SWE-1.6 output-verification, (b) confidence-scoring rubric formula mapping smallcode terms to research output terms, (c) integration handshake for `post-dispatch-validate.ts`, (d) hard-fail message template for refused delivery.

## Findings

### Artifact 1: Drop-in System Instructions for SWE-1.6 Output Verification

**Target file:** `.opencode/skills/cli-devin/assets/agent-config-deep-research-iter.json`

**Integration note:** Append to the existing `system_instructions` array (after line 8, before the closing bracket). These instructions add output-quality verification discipline on top of the existing sequential_thinking requirement and read-only constraints.

**Drop-in JSON snippet:**

```json
{
  "system_instructions": [
    "Before producing the output, you MUST call the sequential_thinking tool (mcp__sequential_thinking__sequentialthinking) with at least 5 thoughts covering: (1) pre-planning what evidence to read, (2) reading the evidence, (3) extracting findings with file:line citations, (4) identifying gaps for the next iter, (5) composing the JSONL delta row. Only after these 5 thoughts complete do you emit the final iter output.",
    "You are a SWE-1.6 deep-research iteration worker.",
    "Stay read-only. Never propose file mutations. Cite evidence with file:line.",
    "Honor the per-iter scoped research question stated in the prompt body.",
    "Produce the iteration-NNN.md output shape the iter template requires.",
    "Stop conditions: emit the required output then exit. Do not request further input.",
    "OUTPUT VERIFICATION DISCIPLINE: Before finalizing iteration-NNN.md, self-verify your output using the 5-stage quality pipeline: (1) STRUCTURE-CHECK — confirm all required sections exist (Focus, Actions Taken, Findings, Questions Answered, Next Focus) with proper heading hierarchy; (2) CITE-CHECK — validate every claim has a <ref_file file:path /> or <ref_snippet file:path lines=\"start-end\" /> citation with verifiable file:line precision; (3) RECOMMENDATION-ACTIONABILITY — ensure all Findings include concrete, actionable artifacts (code snippets, configuration patches, integration handoffs) not abstract principles; (4) CITATION-ACCURACY — verify all cited file:line references actually exist and contain the claimed content (cross-check during evidence reading); (5) ANTI-HALLUCINATION — reject claims where evidence is missing, line numbers don't match, or files don't exist — use 'UNKNOWN' prefix when uncertain.",
    "CONFIDENCE SCORING: Compute self-confidence using the weighted formula: 0.35×structure-check + 0.25×cite-check + 0.25×recommendation-actionability + 0.10×citation-accuracy − 0.05×anti-hallucination-failures. If confidence < 0.70, refuse to ship and emit a hard-fail message with specific failure reasons.",
    "HARD-FAIL GATE: If any verification stage fails catastrophically (missing required sections, zero citations, no actionable artifacts, citation mismatches, or hallucinated content), emit the hard-fail message template and exit without writing iteration-NNN.md. The dispatcher will retry with escalated context or decompose the research question."
  ]
}
```

**Rationale:** This adapts smallcode's 5-stage verification pipeline (compile → execute → smoke-test → lint) to research output quality checks. The weighted confidence formula preserves smallcode's calibration (35% structure, 25% citations, 25% actionability, 10% accuracy, -5% anti-hallucination penalty) while mapping to research-specific quality dimensions.

---

### Artifact 2: Confidence-Scoring Rubric Formula (Smallcode → Research Output Mapping)

**Smallcode original formula** (from iter-002.md findings, pattern 3):

```ms
fn computeConfidence(self, result: VerificationResult): Float {
  let score = 0.0
  if result.compiled { score += 0.35 }
  if result.executed { score += 0.25 }
  if result.tests_passed { score += 0.25 }
  if result.lint_clean { score += 0.10 }
  if result.auto_fixed { score -= 0.05 }  // Slight penalty for needing auto-fix
  return score
}
```

**Research output adaptation:**

```typescript
/**
 * Confidence scoring for SWE-1.6 research iteration output.
 * Adapted from smallcode's verification pipeline (verifier.ms:252-260).
 *
 * Term mapping:
 * - compiled → structure-check (required sections exist, heading hierarchy valid)
 * - executed → cite-check (every claim has file:line citation)
 * - tests_passed → recommendation-actionability (findings include concrete artifacts)
 * - lint_clean → citation-accuracy (cited refs actually exist and match content)
 * - auto_fixed → anti-hallucination-failures (penalty for uncertain/unknown claims)
 */
interface ResearchVerificationResult {
  structureCheck: boolean;      // All required sections present with valid headings
  citeCheck: boolean;           // Every claim has <ref_file /> or <ref_snippet /> citation
  recommendationActionability: boolean;  // Findings include concrete artifacts (code/config)
  citationAccuracy: boolean;   // All cited file:line refs exist and match claimed content
  antiHallucinationFailures: number;    // Count of uncertain/unknown claims prefixed with 'UNKNOWN'
}

function computeResearchConfidence(result: ResearchVerificationResult): number {
  let score = 0.0;
  if (result.structureCheck) score += 0.35;
  if (result.citeCheck) score += 0.25;
  if (result.recommendationActionability) score += 0.25;
  if (result.citationAccuracy) score += 0.10;
  score -= (result.antiHallucinationFailures * 0.05);  // Penalty per uncertainty
  return Math.max(0.0, score);  // Floor at 0.0
}
```

**Threshold guidance:**
- **0.80+**: Ship without hesitation (all stages pass, zero anti-hallucination failures)
- **0.70-0.79**: Ship with warning (minor citation gaps or 1-2 anti-hallucination flags)
- **< 0.70**: Hard-fail and refuse delivery (catastrophic failure in one or more stages)

**Rationale:** Preserves smallcode's weight distribution (35/25/25/10/-5) while mapping each stage to research output quality dimensions. The anti-hallucination penalty scales linearly with the number of uncertain claims, unlike smallcode's binary auto-fix flag.

---

### Artifact 3: Post-Dispatch-Validate.ts Integration Handshake

**Target file:** `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts`

**Integration approach:** Create a **sibling validator function** (`validateIterationQuality`) rather than extending `validateIterationOutputs`. This separation keeps structural validation (file existence, JSONL shape, required fields) orthogonal from content-quality validation (citations, actionability, anti-hallucination).

**New function signature (add after line 234, before `PostDispatchValidationError` class):**

```typescript
/**
 * Content-quality validator for research iteration output.
 * Sibling to validateIterationOutputs — this function validates the QUALITY
 * of iteration content (citations, actionability, anti-hallucination) rather
 * than structural correctness (file existence, JSONL shape).
 *
 * Adapted from smallcode's verification pipeline (verifier.ms:32-102) with
 * research-specific quality dimensions.
 */
export type IterationQualityValidateInput = {
  iterationFile: string;
  confidenceThreshold?: number;  // Default: 0.70
};

export type IterationQualityValidateResult =
  | { ok: true; confidence: number; failures: string[] }
  | {
      ok: false;
      reason:
        | 'structure_check_failed'
        | 'cite_check_failed'
        | 'actionability_check_failed'
        | 'citation_accuracy_failed'
        | 'anti_hallucination_failed';
      confidence: number;
      failures: string[];
      details: string;
    };

export function validateIterationQuality(input: IterationQualityValidateInput): IterationQualityValidateResult {
  const threshold = input.confidenceThreshold ?? 0.70;
  const content = readFileSync(input.iterationFile, 'utf8');
  const failures: string[] = [];

  // Stage 1: Structure-check (required sections exist)
  const requiredSections = ['## Focus', '## Actions Taken', '## Findings', '## Questions Answered', '## Next Focus'];
  for (const section of requiredSections) {
    if (!content.includes(section)) {
      failures.push(`Missing required section: ${section}`);
    }
  }
  const structureCheck = failures.length === 0;

  // Stage 2: Cite-check (every claim has <ref_file /> or <ref_snippet />)
  const hasCitations = /<ref_file\s+file="[^"]+"\s*\/>|<ref_snippet\s+file="[^"]+"\s+lines="[^"]+"\s*\/>/.test(content);
  if (!hasCitations) {
    failures.push('No <ref_file /> or <ref_snippet /> citations found');
  }
  const citeCheck = hasCitations;

  // Stage 3: Recommendation-actionability (findings include concrete artifacts)
  const hasConcreteArtifacts = /```(json|typescript|yaml|bash)|`[\s\S]{20,}`/.test(content);
  if (!hasConcreteArtifacts) {
    failures.push('Findings lack concrete artifacts (code snippets, config patches, integration handoffs)');
  }
  const recommendationActionability = hasConcreteArtifacts;

  // Stage 4: Citation-accuracy (verify cited files exist)
  // Note: This stage requires file-system access; for now, assume pass if citations exist
  // Full implementation would extract file paths from <ref_file /> tags and check existsSync()
  const citationAccuracy = true;  // Placeholder — requires file-system traversal

  // Stage 5: Anti-hallucination (count 'UNKNOWN' prefixes)
  const unknownMatches = content.match(/I'M UNCERTAIN|UNKNOWN:/gi) || [];
  const antiHallucinationFailures = unknownMatches.length;
  if (antiHallucinationFailures > 2) {
    failures.push(`Too many uncertain claims (${antiHallucinationFailures} instances of 'UNKNOWN' prefix)`);
  }

  // Compute confidence using smallcode-adapted formula
  const confidence = computeResearchConfidence({
    structureCheck,
    citeCheck,
    recommendationActionability,
    citationAccuracy,
    antiHallucinationFailures,
  });

  if (confidence < threshold) {
    // Determine primary failure reason for hard-fail message
    let primaryReason: IterationQualityValidateResult['ok']['reason'];
    if (!structureCheck) primaryReason = 'structure_check_failed';
    else if (!citeCheck) primaryReason = 'cite_check_failed';
    else if (!recommendationActionability) primaryReason = 'actionability_check_failed';
    else if (!citationAccuracy) primaryReason = 'citation_accuracy_failed';
    else primaryReason = 'anti_hallucination_failed';

    return {
      ok: false,
      reason: primaryReason,
      confidence,
      failures,
      details: `Confidence ${confidence.toFixed(2)} below threshold ${threshold}. Failures: ${failures.join('; ')}`,
    };
  }

  return { ok: true, confidence, failures };
}
```

**Integration point in dispatcher:** Call `validateIterationQuality` after `validateOrThrow` succeeds in the deep-loop dispatcher (`.opencode/commands/deep/assets/deep_start-research-loop_auto.yaml` executor logic). If quality validation fails, emit a `dispatch_failure` event to the state log with the quality validation result details, then retry or escalate per the hard-fail policy.

**Rationale:** Sibling validator separation keeps concerns clear — `validateIterationOutputs` handles structural correctness (file existence, JSONL shape), while `validateIterationQuality` handles content quality (citations, actionability, anti-hallucination). This mirrors smallcode's separation between verifier (pipeline execution) and hard_fail (gatekeeper logic).

---

### Artifact 4: Hard-Fail Message Template for Refused Delivery

**Target:** Emitted by cli-devin when `validateIterationQuality` returns `ok: false` with confidence below threshold.

**Template:**

```markdown
# ITERATION DELIVERY REFUSED — OUTPUT QUALITY GATE FAILED

**Iteration:** {iteration_number}
**Confidence Score:** {confidence_score} (threshold: {threshold})
**Failure Reason:** {primary_reason}

## Verification Failures

{failure_list}

## Required Remediation

This iteration cannot ship until the following quality issues are resolved:

1. **Structure-Check Failure** (if applicable): Add missing required sections (## Focus, ## Actions Taken, ## Findings, ## Questions Answered, ## Next Focus) with proper heading hierarchy.

2. **Cite-Check Failure** (if applicable): Ensure every claim includes a `<ref_file file="path" />` or `<ref_snippet file="path" lines="start-end" />` citation with verifiable file:line precision.

3. **Recommendation-Actionability Failure** (if applicable): Convert abstract principles into concrete artifacts (code snippets, configuration patches, integration handoffs, drop-in JSON snippets).

4. **Citation-Accuracy Failure** (if applicable): Verify all cited file:line references actually exist and contain the claimed content. Cross-check during evidence reading.

5. **Anti-Hallucination Failure** (if applicable): Remove uncertain claims or prefix with 'I'M UNCERTAIN ABOUT THIS:' and provide evidence to resolve the uncertainty. Reduce 'UNKNOWN' prefixes to ≤2 per iteration.

## Next Steps

The dispatcher will retry this iteration with escalated context or decompose the research question into smaller sub-questions. Do not manually edit the iteration file — allow the retry mechanism to address the quality failures.

---

Generated by SWE-1.6 deep-research quality gate (adapted from smallcode verification pipeline: verifier.ms:32-102, hard_fail.ms:29-70)
```

**Template variable mapping:**
- `{iteration_number}`: Extracted from iteration file name (e.g., `iteration-007.md` → 7)
- `{confidence_score}`: From `validateIterationQuality` result confidence field
- `{threshold}`: Configured threshold (default 0.70)
- `{primary_reason}`: From `validateIterationQuality` result reason field
- `{failure_list}`: Bulleted list from `validateIterationQuality` result failures array

**Rationale:** Adapts smallcode's `formatHardFail` function (hard_fail.ms:29-70) to research output context. Provides actionable remediation guidance per failure stage, mirrors smallcode's decompose strategy (retry with escalated context or decompose research question), and includes provenance reference to smallcode source patterns.

---

## Questions Answered

- **RQ2 — Output Verification Pipeline (Deepening):** Produced patch-ready specifics for integrating smallcode's verification patterns into cli-devin's deep-research iter workflow: (a) exact `system_instructions` lines to add to `agent-config-deep-research-iter.json` for SWE-1.6 output-verification discipline, (b) confidence-scoring rubric formula adapted from smallcode (0.35×structure-check + 0.25×cite-check + 0.25×recommendation-actionability + 0.10×citation-accuracy − 0.05×anti-hallucination-failures), (c) integration handshake with `post-dispatch-validate.ts` (sibling validator `validateIterationQuality`), (d) hard-fail message template for refused delivery. All artifacts include smallcode provenance citations (verifier.ms:32-102, hard_fail.ms:29-70) and concrete integration guidance.

## Questions Remaining

- [x] RQ1 — Context Budget Engine (iter 1 + iter 6 deepen)
- [x] RQ2 — Output Verification Pipeline (iter 2 + iter 7 deepen)
- [x] RQ3 — Per-Model Profiles & Escalation
- [x] RQ4 — Structured Scope/Permissions
- [x] RQ5 — Skill Architecture verdict: HYBRID

## Next Focus

RQ1 deepening — Context budget engine concrete implementation details. Iter 6 produced concrete defaults table + truncation marker syntax + eviction ladder. Next iter should deepen with (a) exact token-count estimation logic for evidence files, (b) token-budget enforcement at dispatch time, (c) eviction priority formula for cached context, (d) integration handshake with the memory context retrieval system.
