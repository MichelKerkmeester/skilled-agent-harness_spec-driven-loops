# Iteration 09 - Adversarial — auto-marker fields integrity, weight clipping boundaries

## Focus
Adversarial — auto-marker fields integrity, weight clipping boundaries

## Sources Read
- `.opencode/skills/system-skill-advisor/mcp_server/lib/cross-skill-edges/apply-graph-metadata-patch.ts:1-58` (auto_added_at line 45, auto_added_reason line 46, applyable guard line 19, idempotence line 37)
- `.opencode/skills/system-skill-advisor/mcp_server/lib/cross-skill-edges/context-template.ts:55-58` (clipWeight NaN guard analysis)
- `.opencode/skills/system-skill-advisor/mcp_server/lib/cross-skill-edges/detect-inbound-enhances.ts:216-241` (rules array construction + candidate push — empty rules edge case)
- `.opencode/skills/system-skill-advisor/mcp_server/lib/cross-skill-edges/types.ts:26-41` (InboundEnhanceCandidate.rules + applyable contract)
- `.opencode/skills/system-skill-advisor/mcp_server/tests/cross-skill-edges.vitest.ts:230-257` ('emits only enhances edge type' test — minConfidence 0.0, produces empty-rules candidate), `:259-288` (weight clipping test — relaxed bounds assertions)
- `.opencode/skills/system-skill-advisor/graph-metadata.json:101-106` (applied deep-ai-council edge — all auto-marker values)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/007-cross-skill-auto-propagation/spec.md:134` (REQ-004 auto-marker fields)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/007-cross-skill-auto-propagation/plan.md:336-363` (§3 applyEnhanceEdge sketch)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/007-cross-skill-auto-propagation/checklist.md:83` (CHK-FIX-004 weight clipping testimony)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/007-cross-skill-auto-propagation/implementation-summary.md:85` (claimed auto-marker + weight clipping outcomes)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/007-cross-skill-auto-propagation/review/iterations/iteration-01.md:1-152` (F-01-006 null weight blocker gap)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/007-cross-skill-auto-propagation/review/iterations/iteration-02.md:1-101` (F-02-001 null weight in enhance_when path)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/007-cross-skill-auto-propagation/review/iterations/iteration-05.md:1-312` (F-05-006 weight optionality, REQ-011 trace)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/007-cross-skill-auto-propagation/review/iterations/iteration-08.md:1-274`

## Findings

### F-09-001 [P2] auto_added_reason produces empty string when rules array is empty — reachable at minConfidence=0.0

- **Where**: `apply-graph-metadata-patch.ts:46` (producer) + `detect-inbound-enhances.ts:216-222` (empty-rules path)
- **What**: The `auto_added_reason` field is computed as `candidate.rules.map(r => \`${r.rule}:${r.contribution.toFixed(2)}\`).join(' + ')`. When `candidate.rules` is an empty array `[]`, `[].join(' + ')` returns `""` — an empty string. This happens because the detection loop at `detect-inbound-enhances.ts:216-219` only pushes scorer results into the `rules` array when `contribution > 0`. If all three scorers return contribution 0, `rules` remains `[]`. With the default `minConfidence` of 0.75, the candidate is filtered out at line 222 (`0 < 0.75`). But when `minConfidence` is lowered to 0.0 (as the `'emits only enhances edge type'` test does at line 248), a candidate with `rules: []`, confidence 0, and `applyable: true` (because `inferEdgePayload` can still infer a weight and context from same-family exemplars without any scorer contribution) passes the filter. If such a candidate were applied (it is applyable), the written `auto_added_reason` would be `""`.
- **Why it matters**: The spec REQ-004 describes `auto_added_reason` as a "provenance string" — an empty string conveys zero provenance and violates the field's purpose. While production minConfidence of 0.75 prevents this (a candidate with zero confidence is always filtered out), the code path is unprotected. The existing `'emits only enhances edge type'` test already produces such a candidate — it just never calls `applyEnhanceEdge` to expose the empty reason. A future test or tool invocation using low `minConfidence` could write an edge with no provenance.
- **Evidence**:
  ```typescript
  // apply-graph-metadata-patch.ts:46 — empty array → empty string
  auto_added_reason: candidate.rules.map(r => `${r.rule}:${r.contribution.toFixed(2)}`).join(' + '),
  //                 [].map(...) = [] → [].join(' + ') = ""
  ```
  ```typescript
  // detect-inbound-enhances.ts:216-222 — rules can be empty, confidence can be 0
  const rules: CandidateRuleEvidence[] = [];
  if (familyScore.contribution > 0) rules.push(familyScore);     // 0 → not pushed
  if (assetScore.contribution > 0) rules.push(assetScore);       // 0 → not pushed
  if (transitivityScore.contribution > 0) rules.push(transitivityScore);
  const confidence = rules.reduce((sum, r) => sum + r.contribution, 0);  // 0
  if (confidence < options.minConfidence) continue;  // 0 < 0.0 → false → passes
  ```
  ```typescript
  // cross-skill-edges.vitest.ts:248 — test that triggers the empty-rules path
  const candidates = detectInboundEnhances(skills, { minConfidence: 0.0 });
  // skill-a → skill-c: all scorers return 0, but same-family exemplar inference succeeds
  // → applyable=true, rules=[], auto_added_reason would be ""
  ```
  ```json
  // system-skill-advisor/graph-metadata.json:105 — production auto_added_reason is non-empty
  "auto_added_reason": "family-inference:0.45 + asset-shape:0.30 + sibling-transitivity:0.15"
  // Production safe — all real-world candidates have confidence > 0 → non-empty rules
  ```
- **Fix suggestion**: Guard against empty rules before writing, or make the join produce a default:
  ```typescript
  const reason = candidate.rules.map(r => `${r.rule}:${r.contribution.toFixed(2)}`).join(' + ');
  auto_added_reason: reason || 'no scoring rule triggered (applied via explicit selection)',
  ```
  Alternatively, add a defense at line 222: `if (confidence <= 0) continue;` so zero-confidence candidates are never emitted regardless of minConfidence.
- **REQ trace**: REQ-004 (auto-marker fields must carry provenance)

### F-09-002 [P2] clipWeight passes NaN through unguarded — `w == null` is false for NaN

- **Where**: `context-template.ts:55-58`
- **What**: The `clipWeight` function guards against `null` and `undefined` with `if (w == null) return null`. However, `NaN == null` evaluates to `false` in JavaScript, so `NaN` passes through to the clamping expression: `Math.min(0.7, Math.max(0.3, NaN))`. Both `Math.max(0.3, NaN)` and `Math.min(0.7, NaN)` return `NaN`. The result — a `NaN` weight — would flow through `inferEdgePayload`, be set on the candidate as `weight: NaN`, and if the candidate is applied (`applyable: true`), be written into `graph-metadata.json` as `"weight": null` (JSON does not support NaN; `JSON.stringify` converts NaN to `null` in arrays but as a standalone value — actually, `JSON.stringify(NaN)` → `'null'`, and `JSON.stringify({weight: NaN})` → `'{"weight":null}'`). The downstream skill advisor would encounter a null weight where a number is expected, matching the null-weight issue already documented in F-01-006/F-02-001 but via a novel entry vector (NaN vs undefined).
- **Why it matters**: This is a defense-in-depth gap. NaN can only enter the system via hand-edited `graph-metadata.json` (e.g., a malformed weight field containing `NaN` as a JSON literal — but standard JSON parsers reject `NaN` as invalid; however, `JSON.parse` in Node.js actually accepts `NaN` as a value when it appears in JavaScript expressions, not JSON text). In practice, the existing test at `cross-skill-edges.vitest.ts:283-284` would catch NaN weights because `NaN <= 0.7` is `false` and `NaN >= 0.3` is `false`, causing both assertions to fail. But the `clipWeight` function itself provides no NaN guard, making it less robust than its narrowed type signature `(w: number | null | undefined)` suggests.
- **Evidence**:
  ```typescript
  // context-template.ts:55-58 — NaN passes through
  function clipWeight(w: number | null | undefined): number | null {
    if (w == null) return null;      // NaN == null → false → bypasses
    return Math.min(0.7, Math.max(0.3, w));  // Math.max(0.3, NaN) → NaN
                                              // Math.min(0.7, NaN) → NaN
  }
  ```
  ```javascript
  // JavaScript semantics verify:
  NaN == null          // → false
  Math.max(0.3, NaN)   // → NaN
  Math.min(0.7, NaN)   // → NaN
  JSON.stringify(NaN)   // → 'null'
  JSON.stringify({weight: NaN})  // → '{"weight":null}'
  ```
  ```typescript
  // cross-skill-edges.vitest.ts:283-284 — existing test would catch NaN weight
  expect(candidate?.weight).toBeLessThanOrEqual(0.7);   // NaN <= 0.7 → false → FAIL
  expect(candidate?.weight).toBeGreaterThanOrEqual(0.3); // NaN >= 0.3 → false → FAIL
  // The test protects against NaN reaching assertions, but clipWeight itself is unguarded.
  ```
- **Fix suggestion**: Add `Number.isNaN(w)` to the guard:
  ```typescript
  function clipWeight(w: number | null | undefined): number | null {
    if (w == null || (typeof w === 'number' && Number.isNaN(w))) return null;
    return Math.min(0.7, Math.max(0.3, w));
  }
  ```
- **REQ trace**: REQ-011 (edge weight clipped to [0.3, 0.7])

### F-09-003 [P2] deep-ai-council edge auto_added_reason omits rule detail field — provenance is numeric-only, not human-readable

- **Where**: `apply-graph-metadata-patch.ts:46` vs `system-skill-advisor/graph-metadata.json:105`
- **What**: The `auto_added_reason` field at line 46 constructs a provenance string from `\`${r.rule}:${r.contribution}\``, using only the rule name and its numeric contribution. The `CandidateRuleEvidence.detail` field (e.g., `"4/5 cli-family peers already enhanced (80%)"` or `"target has assets/cli_prompt_quality_card.md"`) is omitted. The resulting production auto_added_reason at `system-skill-advisor/graph-metadata.json:105` reads: `"family-inference:0.45 + asset-shape:0.30 + sibling-transitivity:0.15"`. While this is technically a provenance string (it identifies which rules fired and their weights), it lacks the human-readable explanation that the `detail` field carries. An operator reading this edge in the JSON file knows which rules contributed to the auto-detection but not why each rule triggered.
- **Why it matters**: Minor — the auto-marker fields are advisory metadata (NFR-S02: "never used as runtime trust signal"). The current format is sufficient for audit (operator can cross-reference the rule names against the detector source code). Adding detail strings would make the provenance immediately interpretable without code inspection, improving the operator experience when reviewing auto-applied edges.
- **Evidence**:
  ```typescript
  // apply-graph-metadata-patch.ts:46 — only rule name + numeric contribution
  auto_added_reason: candidate.rules.map(r => `${r.rule}:${r.contribution.toFixed(2)}`).join(' + '),
  // Omits r.detail — e.g., "4/5 cli-family peers already enhanced (80%)"
  ```
  ```json
  // system-skill-advisor/graph-metadata.json:105 — production auto_added_reason
  "auto_added_reason": "family-inference:0.45 + asset-shape:0.30 + sibling-transitivity:0.15"
  // Numeric contributions only — no human-readable detail strings
  ```
  ```typescript
  // types.ts:18-21 — detail field exists on every rule but is unused in auto_added_reason
  export interface CandidateRuleEvidence {
    rule: 'family-inference' | 'asset-shape' | 'sibling-transitivity';
    contribution: number;
    detail: string;        // ← present but omitted from auto_added_reason
  }
  ```
- **Fix suggestion**: Include the `detail` field in the reason string:
  ```typescript
  auto_added_reason: candidate.rules.map(r => `${r.rule}:${r.detail}`).join(' + '),
  // Produces: "family-inference:4/5 cli-family peers + asset-shape:target has SKILL.md, graph-metadata.json + ..."
  ```
  Or include both numeric and human-readable:
  ```typescript
  auto_added_reason: candidate.rules.map(r => `${r.rule}(${r.contribution.toFixed(2)}): ${r.detail}`).join(' + '),
  ```
- **REQ trace**: REQ-004 (auto_added_reason as provenance string)

---

## Focus-Area Verification (Non-Findings)

### auto_added_at — ISO 8601 UTC parseable: PASS
- `apply-graph-metadata-patch.ts:45`: `new Date().toISOString()` — always produces format `YYYY-MM-DDTHH:mm:ss.sssZ` per ECMAScript spec. The production edge at `system-skill-advisor/graph-metadata.json:104` confirms: `"2026-05-15T14:10:44.259Z"` is valid ISO 8601 with UTC `Z` suffix. No defect.

### auto_added_reason — non-empty in production: PASS
- All production-reachable candidates (minConfidence ≥ 0.75 default) have at least one positive scorer → non-empty rules → non-empty auto_added_reason. The production edge at line 105 contains a complete provenance string. The empty-string edge case (F-09-001) requires minConfidence=0.0 and is not reachable in default operation.

### Weight clipping — 0.9→0.7: PASS
- `context-template.ts:57`: `Math.min(0.7, Math.max(0.3, 0.9))` → `Math.min(0.7, 0.9)` → `0.7`. Test at `cross-skill-edges.vitest.ts:283-284` verifies weight is in [0.3, 0.7]. Production enhance_when weight 0.7 is already in range. Correct.

### Weight clipping — 0.1→0.3: PASS (code), UNTESTED (explicit fixture)
- `Math.min(0.7, Math.max(0.3, 0.1))` → `Math.min(0.7, 0.3)` → `0.3`. The code is trivially correct. The test at line 284 (`toBeGreaterThanOrEqual(0.3)`) verifies the lower bound structurally, but no fixture uses weight=0.1 as input. This was noted in iteration 05 as a coverage gap — not a new finding.

### Weight clipping — null input: HANDLED
- `context-template.ts:56`: `if (w == null) return null`. Both `null` and `undefined` return `null`. The applyability blockers for null weight were documented in F-01-006 (exemplar path) and F-02-001 (enhance_when path). No new issues found.

### Applied deep-ai-council edge — values sensible: PASS
- `system-skill-advisor/graph-metadata.json:101-106`:
  - `target: "deep-ai-council"` — correct skill ID. ✓
  - `weight: 0.7` — from enhance_when rule weight (already in [0.3, 0.7]). ✓
  - `context: "routes deep-ai-council delegation requests"` — template `${target.id}` correctly substituted. ✓
  - `auto_added_at: "2026-05-15T14:10:44.259Z"` — valid ISO 8601 UTC. ✓
  - `auto_added_reason: "family-inference:0.45 + asset-shape:0.30 + sibling-transitivity:0.15"` — all three rules fired (composite 0.90), non-empty, descriptive. ✓
  - All values are sensible and match the expected template output.

---

## New Info Ratio
3 new weighted findings this iteration. All 3 address the iteration 09 focus areas (auto-marker fields integrity, weight clipping boundaries) and are novel — no prior iteration examined the `auto_added_reason` generation edge case (F-09-001), the `clipWeight` NaN guard (F-09-002), or the auto_added_reason detail-omission (F-09-003). These are distinct code paths and root causes from prior findings about null-weight blockers (F-01-006, F-02-001, F-05-006), null-context crashes (F-07-001), and non-array skill_has_files (F-08-001).

**newInfoRatio: 1.00**

New weighted findings this iteration: 3. Any weighted findings considered: 3.

## Quality Gates
- **Evidence**: pass — every finding cites file:line with quoted code; F-09-001 empty-rules path verified by tracing through detection loop → empty rules → applyEnhanceEdge; F-09-002 NaN guard verified against JavaScript semantics (`NaN == null`, `Math.min/max` with NaN); F-09-003 detail omission verified by cross-referencing `CandidateRuleEvidence.detail` against `auto_added_reason` construction
- **Scope**: pass — all implementation files in scope read; both graph-metadata.json files verified; test file examined for empty-rules candidate production and weight-clipping assertion precision; all 8 prior iterations read for overlap avoidance
- **Coverage**: D1 (Correctness) adversarial sub-focus — auto_added_at (verified PASS), auto_added_reason (3 findings: empty-string edge case F-09-001, NaN passthrough F-09-002, detail omission F-09-003), weight clipping boundaries (verified PASS for 0.9→0.7, 0.1→0.3, null), deep-ai-council applied edge (verified PASS — all values sensible)

## Convergence Signal
approaching-convergence — iteration 09 is the final adversarial-focused iteration (operator cap at 10). It surfaces 3 P2 findings in the auto-marker integrity space, none of which are production-exploitable. The total tally across all 9 iterations:

| Iteration | Dimension | P0 | P1 | P2 | Total |
|-----------|---|---|----|----|-------|
| 01 | D1 Correctness — scoring math | 0 | 0 | 6 | 6 |
| 02 | D1 Correctness — idempotence/hash/filter | 0 | 0 | 1 | 1 |
| 03 | D2 Security — path traversal/parse/injection | 0 | 1 | 3 | 4 |
| 04 | D3 Traceability — P0 REQs | 0 | 2 | 4 | 6 |
| 05 | D3 Traceability — P1 REQs + checklist | 0 | 2 | 4 | 6 |
| 06 | D4 Maintainability — naming/dead code/errors/docs | 0 | 1 | 6 | 7 |
| 07 | D1 Correctness — substitution edge cases | 0 | 1 | 5 | 6 |
| 08 | D1 Correctness — adversarial data shapes | 0 | 1 | 3 | 4 |
| 09 | D1 Correctness — auto-marker integrity | 0 | 0 | 3 | 3 |

**Totals across all 9 iterations**: 0 P0 + 8 P1 + 35 P2 = 43 findings.

All four plan dimensions (D1-D4) have been covered at least once. The auto-marker fields (auto_added_at, auto_added_reason) are functionally correct in production. Remaining: 1 iteration (iteration 10) before operator cap.

**Stop conditions check**:
- All 4 dimensions covered at least once: ✓ (D1 iterations 01,02,07,08,09; D2 iteration 03; D3 iterations 04,05; D4 iteration 06)
- 0 new P0 in last 2 iterations: ✓ (iterations 08 and 09)
- newInfoRatio < 0.10 for 2 consecutive iterations: ✗ (1.00 for iterations 08 and 09 — novel adversarial paths continue to surface)
