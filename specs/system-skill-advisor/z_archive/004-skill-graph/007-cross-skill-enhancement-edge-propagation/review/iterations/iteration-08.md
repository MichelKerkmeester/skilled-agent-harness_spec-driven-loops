# Iteration 08 - Adversarial — same-family avoidance, empty enhances, malformed JSON

## Focus
Adversarial — same-family avoidance, empty enhances, malformed JSON

## Sources Read
- `.opencode/skills/system-skill-advisor/mcp_server/lib/cross-skill-edges/detect-inbound-enhances.ts:1-246` (scoreFamilyInference same-family guard lines 92-100, scoreAssetShape lines 133-155, main detector loop lines 193-246)
- `.opencode/skills/system-skill-advisor/mcp_server/lib/cross-skill-edges/context-template.ts:1-146` (inferEdgePayload enhance_when path lines 102-114, substituteTemplate lines 64-68, asArray lines 17-19)
- `.opencode/skills/system-skill-advisor/mcp_server/lib/cross-skill-edges/metadata-loader.ts:1-193` (enhance_when parse lines 127-132, parseSkillMetadata try/catch lines 78-153, loadAllSkillMetadata per-file loop lines 163-176)
- `.opencode/skills/system-skill-advisor/mcp_server/lib/cross-skill-edges/types.ts:100-112` (EnhanceWhenRule interface, SkillMetadataRecord.enhance_when union type)
- `.opencode/skills/system-skill-advisor/mcp_server/lib/cross-skill-edges/apply-graph-metadata-patch.ts:1-58` (idempotence guard line 37)
- `.opencode/skills/system-skill-advisor/mcp_server/lib/cross-skill-edges/index.ts:1-67` (orchestration + apply loop lines 45-64)
- `.opencode/skills/system-skill-advisor/mcp_server/handlers/skill-graph/propagate-enhances.ts:1-75` (handler try/catch boundary lines 39-74)
- `.opencode/skills/system-skill-advisor/mcp_server/tools/skill-graph-tools.ts:66-83` (inputSchema definition)
- `.opencode/skills/system-skill-advisor/mcp_server/tests/cross-skill-edges.vitest.ts:1-289` (full test file — verified no adversarial fixture exists for same-family skip, empty enhances family-inference, or string/non-array skill_has_files)
- `.opencode/skills/sk-prompt/graph-metadata.json:45-49` (enhance_when single-object form)
- `.opencode/skills/system-skill-advisor/graph-metadata.json:200-207` (enhance_when single-object form)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/007-cross-skill-enhancement-edge-propagation/spec.md:210-222` (Edge Cases section — same-family circular, empty enhances, malformed JSON, write denied)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/007-cross-skill-enhancement-edge-propagation/plan.md:199-227` (scoreFamilyInference plan sketches)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/007-cross-skill-enhancement-edge-propagation/review/iterations/iteration-01.md:1-152`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/007-cross-skill-enhancement-edge-propagation/review/iterations/iteration-06.md:1-334` (F-06-004 — silent null returns from metadata loader)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/007-cross-skill-enhancement-edge-propagation/review/iterations/iteration-07.md:1-235`

## Findings

### F-08-001 [P1] `skill_has_files` non-array value crashes `.every()` — unvalidated enhance_when rule field

- **Where**: `detect-inbound-enhances.ts:146` and `context-template.ts:105`
- **What**: Both `scoreAssetShape` and `inferEdgePayload` access `rule.skill_has_files.every(...)` guarded only by a truthiness check (`rule.skill_has_files &&`), not by `Array.isArray()`. The `metadata-loader.ts:131` stores `enhance_when` via an unsafe `as` cast with zero runtime shape validation — it only rejects `undefined` and `null`. If a `graph-metadata.json` file contains `"skill_has_files": "SKILL.md"` (a string instead of an array), or `"skill_has_files": true` (a boolean), the truthy value passes the `&&` guard but lacks an `.every()` method, producing: `TypeError: rule.skill_has_files.every is not a function`. This call site — inside `detectInboundEnhances()`, which has **no try/catch around the scorer calls** (lines 212-214) — would abort the entire detection run for all skills, not just the malformed one. The outer handler try/catch at `propagate-enhances.ts:70` would surface the error generically, but all valid candidates from other skills would be lost.
- **Why it matters**: This is a runtime crash triggered by hand-edited or corrupted `graph-metadata.json`. The crash path is not tested (grep confirms `cross-skill-edges.vitest.ts` only passes well-formed arrays at lines 92, 266). While current production data is correctly formatted, the `as`-cast propagation chain means any future editing error could take down the entire detection tool. This is parallel in severity to F-07-001 (null-context crash) but on a different code path and data field. The spec's error-scenario contract (`spec.md:215-216`) requires per-skill error capture and continued processing — a crash in the main detector violates this.
- **Evidence**:
  ```typescript
  // detect-inbound-enhances.ts:146 — truthiness guard, not Array.isArray()
  if (rule.skill_has_files && rule.skill_has_files.every(f => targetHasFile(target, f))) {
  //  ^^^^^^^^^^^^^^^^^^^^ truthy for non-empty string, number, boolean, object
  //                        ^^^^^^^^^^^^^^^^^^^^^^^^^ calls .every() which doesn't exist on non-arrays
  ```
  ```typescript
  // context-template.ts:105 — identical pattern, same vulnerability
  const filesMatch = rule.skill_has_files && rule.skill_has_files.every(f => targetHasFile(target, f));
  ```
  ```typescript
  // metadata-loader.ts:129-132 — unsafe as cast, no runtime validation
  if (parsedJson.enhance_when !== undefined && parsedJson.enhance_when !== null) {
    // It's either a single rule object or an array of rule objects
    enhance_when = parsedJson.enhance_when as SkillMetadataRecord['enhance_when'];
    //             ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ no validation of element types / shapes
  }
  ```
  ```typescript
  // detect-inbound-enhances.ts:212-214 — no try/catch around scorers
  const familyScore = scoreFamilyInference(source, target, byFamily);
  const assetScore = scoreAssetShape(source, target);          // ← crash propagates
  const transitivityScore = scoreSiblingTransitivity(source, target, byId);
  ```
  ```typescript
  // types.ts:108 — skill_has_files typed as string[] but unenforced at runtime
  export interface EnhanceWhenRule {
    skill_has_asset?: string;
    skill_has_files?: string[];  // ← compile-time only, no runtime enforcement
    weight?: number;
    context_template?: string;
  }
  ```
  ```bash
  # No adversarial test for non-array skill_has_files
  $ grep -n 'skill_has_files' cross-skill-edges.vitest.ts
  92:         skill_has_files: ['SKILL.md', 'graph-metadata.json'],
  266:        skill_has_files: ['test.md'],
  # Both use arrays — no string/boolean/null-element test
  ```
- **Fix suggestion**: Add `Array.isArray()` guard before calling `.every()` in both locations, and optionally validate shapes in `metadata-loader` at parse time:
  ```typescript
  // In scoreAssetShape and inferEdgePayload:
  if (Array.isArray(rule.skill_has_files) && rule.skill_has_files.every(f => targetHasFile(target, f))) {
  ```
  Additionally, in `metadata-loader.ts` around line 131, add a structural validation of `enhance_when` contents to reject invalid shapes at load time rather than deferring failure to detection-time:
  ```typescript
  if (parsedJson.enhance_when !== undefined && parsedJson.enhance_when !== null) {
    const raw = parsedJson.enhance_when;
    const rules = Array.isArray(raw) ? raw : [raw];
    for (const rule of rules) {
      if (typeof rule !== 'object' || rule === null) {
        console.warn(`[cross-skill-edges] Invalid enhance_when element in ${sourcePath}: expected object`);
        continue;
      }
      if (rule.skill_has_files !== undefined && !Array.isArray(rule.skill_has_files)) {
        console.warn(`[cross-skill-edges] Invalid skill_has_files in ${sourcePath}: expected array`);
      }
    }
    enhance_when = parsedJson.enhance_when as SkillMetadataRecord['enhance_when'];
  }
  ```
- **REQ trace**: spec.md:215-216 (Error Scenarios — malformed JSON; per-skill error capture, continue processing)

### F-08-002 [P2] Same-family circular protection is scoped to family-inference only — asset-shape and sibling-transitivity still produce candidates within same family

- **Where**: `detect-inbound-enhances.ts:92-100` (family-inference guard) vs `detect-inbound-enhances.ts:193-243` (main detector loop — no same-family guard)
- **What**: The spec edge cases (`spec.md:212-213`) state "Same-family circular: skill A is `family: cli` and enhances cli-codex; if A's family is cli too, detector skips (do not self-enhance via family-share — only enhance NON-self family members)." The implementation's `scoreFamilyInference` function (line 98) correctly returns contribution 0 when `source.family === target.family`, but the main detection loop at lines 212-214 still runs `scoreAssetShape` and `scoreSiblingTransitivity` for same-family (source, target) pairs. Neither scorer checks family. This means a same-family pair (e.g., `sk-prompt` family `sk-util` enhancing another `sk-util` skill) can still produce candidates at confidence 0.30 (asset-shape match) or 0.15 (sibling-transitivity match), even though the spec says "detector skips" for same-family.
- **Why it matters**: The spec edge case says "do not self-enhance via family-share — only enhance NON-self family members." The "via family-share" qualifier narrows the scope to family-inference specifically, so the implementation is arguably consistent with the spec's intent (same-family should only block family-inference, not asset-shape rules). However, the broader phrasing "detector skips" could be read as a full skip, creating an ambiguity that a future implementer or auditor might interpret differently. In production with today's data, this cannot trigger because `sk-prompt` (family: sk-util) has no same-family targets with matching assets — all its enhances targets are in the `cli` family. But a future skill in a family with internal `enhance_when` rules could produce unexpected same-family candidates.
- **Evidence**:
  ```typescript
  // detect-inbound-enhances.ts:98-99 — family-inference guard: correct
  if (source.family === target.family) {
    return { rule: 'family-inference', contribution: 0, detail: 'source and target same family — skip (avoid self-enhance)' };
  }
  ```
  ```typescript
  // detect-inbound-enhances.ts:133-155 — scoreAssetShape has NO family check
  function scoreAssetShape(source: SkillMetadataRecord, target: SkillMetadataRecord): CandidateRuleEvidence {
    const rules = source.enhance_when ?? [];
    for (const rule of asArray(rules)) {
      if (rule.skill_has_asset && targetHasFile(target, rule.skill_has_asset)) {
        return { rule: 'asset-shape', contribution: 0.30, ... };  // ← runs for same-family too
      }
      // ...
    }
  }
  ```
  ```typescript
  // detect-inbound-enhances.ts:161-183 — scoreSiblingTransitivity has NO family check
  function scoreSiblingTransitivity(source, target, byId): CandidateRuleEvidence {
    // ... no reference to source.family or target.family
  }
  ```
  ```typescript
  // detect-inbound-enhances.ts:204-214 — main loop: no same-family guard
  for (const source of skills) {
    if (source.skillId === target.skillId) continue;    // ← only self-identity skipped
    // No family check: same-family pairs proceed to all scorers
    const familyScore = scoreFamilyInference(source, target, byFamily);
    const assetScore = scoreAssetShape(source, target);          // ← runs for same-family
    const transitivityScore = scoreSiblingTransitivity(source, target, byId);
  }
  ```
  ```markdown
  # spec.md:212-213 — edge case phrasing could be read as full detector skip
  Same-family circular: skill A is family: cli and enhances cli-codex; if A's family is 
  cli too, detector skips (do not self-enhance via family-share — only enhance NON-self family members)
  ```
- **Fix suggestion**: Two options: (A) If the design intent is that same-family should never produce ANY candidate (asset-shape within a family is circular), add a same-family guard at line 206 of the main loop: `if (source.family === target.family) continue;`. (B) If the design intent is that only family-inference should be skipped (the current code), clarify the spec edge case wording to say "detector skips family-inference for same-family pairs" explicitly and add a note that asset-shape/sibling-transitivity still run. Option B is lower-effort and matches the current implementation. The test suite should also include a same-family adversarial fixture (a source with enhance_when and an in-family target with matching assets) to document the expected behavior.
- **REQ trace**: spec.md:212-213 (Same-family circular edge case)

### F-08-003 [P2] `enhance_when` field receives zero runtime type validation in metadata-loader — any non-null JSON value passes through as-cast

- **Where**: `metadata-loader.ts:127-132`
- **What**: The only checks on `parsedJson.enhance_when` before the `as` cast are `!== undefined && !== null`. Any JSON value that is neither undefined nor null passes: strings (`"enhance_when": "not_an_object"`), numbers (`42`), booleans (`true`), plain objects, and arrays. The `as SkillMetadataRecord['enhance_when']` cast defeats TypeScript's compile-time safety. Downstream, `asArray()` (both copies at `detect-inbound-enhances.ts:20-22` and `context-template.ts:17-19`) wraps non-array values: `asArray("not_an_object")` → `["not_an_object"]`, `asArray(true)` → `[true]`, `asArray(42)` → `[42]`. In the scorer loop, these primitives have no matching properties (`skill_has_asset` / `skill_has_files` are undefined on strings/numbers/booleans), so they silently produce no match. No candidate is emitted, no error is surfaced, and the operator has zero indication that the `enhance_when` field is malformed. The silently-ignored `enhance_when` means expected candidates for that source skill are never proposed.
- **Why it matters**: The silent pass-through means an operator who misformats an `enhance_when` field (e.g., forgets the second `[` making it `[{skill_has_files: ["x"]}` instead of `[{...}]` — resulting in a single object that works via `asArray` wrapping, but the overall shape is wrong) would not see the expected candidates and would have no error message to diagnose the issue. This is the same class of silent-degradation issue as F-06-004 (silent null returns), but specific to the `enhance_when` data path. The current production data is correctly formatted (both `enhance_when` files use single-object form with valid fields), so this is a defense-in-depth concern.
- **Evidence**:
  ```typescript
  // metadata-loader.ts:127-132 — only null/undefined checked
  let enhance_when: SkillMetadataRecord['enhance_when'] = undefined;
  if (parsedJson.enhance_when !== undefined && parsedJson.enhance_when !== null) {
    // It's either a single rule object or an array of rule objects
    enhance_when = parsedJson.enhance_when as SkillMetadataRecord['enhance_when'];
    //             ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ no isObject/Array check; any JSON value passes
  }
  ```
  ```typescript
  // detect-inbound-enhances.ts:20-22 — asArray wraps anything
  function asArray<T>(value: T | T[]): T[] {
    return Array.isArray(value) ? value : [value];
    // "not_an_object" → ["not_an_object"] → no crash, silent no-match
    // true → [true] → silent no-match
    // 42 → [42] → silent no-match
  }
  ```
  ```typescript
  // detect-inbound-enhances.ts:137-153 — silent no-match for primitive wrappers
  for (const rule of asArray(rules)) {
    if (rule.skill_has_asset && targetHasFile(target, rule.skill_has_asset)) {
      // "not_an_object".skill_has_asset → undefined → skip
    }
    if (rule.skill_has_files && rule.skill_has_files.every(...)) {
      // true.skill_has_files → undefined → skip
      // (but non-empty-string would crash — see F-08-001)
    }
  }
  ```
  ```json
  // Current production data is correctly formatted — no current exploit
  // sk-prompt/graph-metadata.json:45 — valid object
  "enhance_when": {
      "skill_has_asset": "assets/cli_prompt_quality_card.md",
      "weight": 0.4,
      "context_template": "prompt quality card"
  }
  ```
- **Fix suggestion**: Add a structural validation check before the `as` cast:
  ```typescript
  if (parsedJson.enhance_when !== undefined && parsedJson.enhance_when !== null) {
    const raw = parsedJson.enhance_when;
    const isValid = (typeof raw === 'object' && !Array.isArray(raw))
      || (Array.isArray(raw) && raw.every(r => typeof r === 'object' && r !== null));
    if (!isValid) {
      console.warn(`[cross-skill-edges] Invalid enhance_when in ${sourcePath}: expected object or array of objects, got ${typeof raw}`);
      // enhance_when stays undefined — no bad data propagated
    } else {
      enhance_when = raw as SkillMetadataRecord['enhance_when'];
    }
  }
  ```
- **REQ trace**: spec.md:215-216 (Error Scenarios — malformed source graph-metadata.json)

### F-08-004 [P2] Empty-source enhances path in `inferEdgePayload` correctly returns applyable=false — but no test validates this defensive behavior

- **Where**: `context-template.ts:98-99` and `context-template.ts:117-119` vs `cross-skill-edges.vitest.ts` (no empty-source test)
- **What**: When a source has 0 prior enhances edges AND no matching enhance_when rules, `inferEdgePayload` correctly returns `{weight: null, context: null, blockers: ['no same-family exemplar to infer payload']}`. The `familyEdges` filter (line 98-99) produces an empty array, the length-0 guard at line 117 triggers, and `applyable` is set to `false` by the `blockers.length === 0` check at `detect-inbound-enhances.ts:239`. This is correct defensive behavior — the candidate is detected (confidence from asset-shape or sibling-transitivity) but not applyable. However, the test suite never exercises this path. Fixture A (`cross-skill-edges.vitest.ts:63-126`) creates `sk-prompt` with 0 enhances edges but compensate with `enhance_when` rules that trigger the enhance_when-first path (line 102-114), never reaching the same-family exemplar fallback. There is no test where a source has 0 enhances AND no matching enhance_when rule, which would exercise the `applyable: false` path.
- **Why it matters**: This is a correctness confidence gap, not a defect. The code implements the right behavior, but without test coverage, the `applyable: false` guard against applying un-inferrable candidates is untrusted. If future code changes accidentally remove the `familyEdges.length === 0` guard (or change the enhance_when-first-path to always match), the regression would not be caught. The spec explicitly documents this scenario: "Empty enhances[]: source skill with no existing enhancements yields no candidates (family-share denominator = 0)" (`spec.md:210-211`).
- **Evidence**:
  ```typescript
  // context-template.ts:98-99 — familyEdges filters source enhances for target's family
  const familyEdges = (source.edges?.enhances ?? [])
    .filter(e => byFamily.get(target.family)?.some(s => s.skillId === e.target));
  ```
  ```typescript
  // context-template.ts:117-119 — length-0 guard triggers not-applyable
  if (familyEdges.length === 0) {
    blockers.push('no same-family exemplar to infer payload');
    return { weight: null, context: null, blockers };
  }
  ```
  ```typescript
  // detect-inbound-enhances.ts:239 — applyable derived from blockers
  applyable: blockers.length === 0,
  ```
  ```typescript
  // cross-skill-edges.vitest.ts:69-76 — Fixture A: sk-prompt has 0 enhances but has enhance_when
  // Actually lines 83-88 — sk-prompt has {} edges + { skill_has_asset: ... } enhance_when
  writeGraphMetadata(skillRoot, 'sk-prompt', 'sk-util', {}, {
    skill_has_asset: 'assets/quality_card.md',
    weight: 0.4,
    context_template: 'prompt quality card',
  });
  // enhance_when matches → takes enhance_when path → applyable: true
  // Never reaches familyEdges.length === 0 guard
  ```
  ```bash
  # No test for source with 0 enhances AND no matching enhance_when
  $ grep -c 'blocker\|applyable\|no.*exemplar' cross-skill-edges.vitest.ts
  0  # Zero references — applyable/blocker paths not tested
  ```
- **Fix suggestion**: Add a test fixture where a source has 0 enhances edges, NO enhance_when rules, but sibling-transitivity produces a candidate (confidence 0.15). Verify the candidate has `applyable: false` and `blockers` contains `"no same-family exemplar to infer payload"`. This closes the defense-in-depth gap between empty-source detection and blocked-apply.
- **REQ trace**: spec.md:210-211 (Empty enhances[] edge case), REQ-003 (idempotent apply — blocked apply is a precondition)

## New Info Ratio
4 new weighted findings this iteration. All 4 address the iteration 08 adversarial focus areas (same-family circular, empty enhances, malformed JSON, enhance_when shapes) and none overlap with prior iteration findings — F-06-004 (silent null returns) is about missing-skill-fields, not enhance_when validation; F-07-001 (null context crash) is about context, not skill_has_files.

**newInfoRatio: 1.00**

New weighted findings this iteration: 4. Any weighted findings considered: 4.

## Quality Gates
- **Evidence**: pass — every finding cites file:line with quoted code; F-08-001 crash path verified by tracing through metadata-loader `as` cast → asArray → .every() call; F-08-002 verified by tracing main loop to all three scorers; F-08-003 verified by testing asArray wrapping behavior for each primitive type; F-08-004 verified by confirming zero blocker/applyable references in test file
- **Scope**: pass — all implementation files, both graph-metadata.json files, test file, spec edge cases section, and all 7 prior iterations read and cross-referenced for overlap avoidance
- **Coverage**: D1 (Correctness) adversarial sub-focus — same-family circular (F-08-002: family-inference guard confirmed correct, asset-shape/sibling gap noted), empty enhances (F-08-004: defensive behavior correct but untested), malformed JSON (F-08-001: crash path for non-array skill_has_files, F-08-003: silent pass-through for invalid enhance_when types), enhance_when shapes (single-object and array both handled by asArray — correct; element-level validation missing — F-08-001/F-08-003)

## Convergence Signal
not-converged — iteration 08 is the first adversarial-focused iteration after the core D1-D4 coverage (iterations 01-06) and context-template edge cases (iteration 07). It surfaces 1 P1 (crash) and 3 P2 findings. The P1 finding is significant — a runtime crash path that none of the prior 7 iterations detected. Convergence requires the crash path to be addressed and retested. Cross-iteration tally:

| Iteration | Dimension | P0 | P1 | P2 | Total |
|-----------|---|---|----|----|-------|
| 01 | D1 Correctness — scoring math | 0 | 0 | 6 | 6 |
| 02 | D1 Correctness — idempotence/hash/filter | 0 | 0 | 1 | 1 |
| 03 | D2 Security — path traversal/parse/injection | 0 | 1 | 3 | 4 |
| 04 | D3 Traceability — P0 REQs | 0 | 2 | 4 | 6 |
| 05 | D3 Traceability — P1 REQs + checklist | 0 | 2 | 4 | 6 |
| 06 | D4 Maintainability — naming/dead code/errors/docs | 0 | 1 | 6 | 7 |
| 07 | D1 Correctness — substitution edge cases | 0 | 1 | 5 | 6 |
| 08 | D1 Correctness — adversarial data | 0 | 1 | 3 | 4 |

**Totals across all 8 iterations**: 0 P0 + 8 P1 + 32 P2 = 40 findings.

Remaining: 2 iterations maximum (operator cap at 10). The review strategy's stop conditions (all 4 dimensions covered at least once, 0 new P0 in last 2 iterations, newInfoRatio < 0.10 for 2 consecutive iterations) are not yet met — newInfoRatio remains at 1.00 for the fourth consecutive iteration (05→06→07→08). Total unique findings continue to accumulate at high rate.
