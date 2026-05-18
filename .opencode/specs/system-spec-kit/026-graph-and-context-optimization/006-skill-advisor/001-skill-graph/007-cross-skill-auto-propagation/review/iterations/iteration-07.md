# Iteration 07 - Correctness — context-template substitution edge cases

## Focus
Correctness — context-template substitution edge cases

## Sources Read
- `.opencode/skills/system-skill-advisor/mcp_server/lib/cross-skill-edges/context-template.ts:1-146` (full — substituteTemplate, substituteProviderName, inferEdgePayload)
- `.opencode/skills/system-skill-advisor/mcp_server/lib/cross-skill-edges/detect-inbound-enhances.ts:1-246` (caller of inferEdgePayload)
- `.opencode/skills/system-skill-advisor/mcp_server/lib/cross-skill-edges/types.ts:1-112` (EnhanceWhenRule, SkillMetadataRecord.edges enhances context type)
- `.opencode/skills/system-skill-advisor/mcp_server/lib/cross-skill-edges/metadata-loader.ts:1-193` (edge sub-field parsing — unsafe `as` cast)
- `.opencode/skills/system-skill-advisor/mcp_server/tests/cross-skill-edges.vitest.ts:1-289` (verify no substitution-specific tests)
- `.opencode/skills/sk-prompt/graph-metadata.json:45-49` (context_template value)
- `.opencode/skills/system-skill-advisor/graph-metadata.json:95-106, 200-207` (enhances contexts + context_template)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/007-cross-skill-auto-propagation/spec.md:1-247` (REQ-011, REQ-012)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/007-cross-skill-auto-propagation/plan.md:324-329` (§3 substituteTemplate sketch)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/007-cross-skill-auto-propagation/review/iterations/iteration-01.md:1-152`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/007-cross-skill-auto-propagation/review/iterations/iteration-02.md:1-101`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/007-cross-skill-auto-propagation/review/iterations/iteration-03.md:1-182`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/007-cross-skill-auto-propagation/review/iterations/iteration-04.md:1-213`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/007-cross-skill-auto-propagation/review/iterations/iteration-05.md:1-312`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/007-cross-skill-auto-propagation/review/iterations/iteration-06.md:1-334`

## Findings

### F-07-001 [P1] `inferEdgePayload` crashes on `null`/`undefined` exemplar context — `substituteProviderName` dereferences without null guard

- **Where**: `context-template.ts:134`
- **What**: When the same-family exemplar fallback path is taken (enhance_when didn't match, contexts differ), `inferEdgePayload` calls `substituteProviderName(exemplar.context, ...)` at line 134. `exemplar` is `familyEdges[0]` — an element from `source.edges?.enhances[]`. The type signature says `context: string`, but `metadata-loader.ts:122` performs an unsafe `as` cast (`rawEdgeList as Array<{ target: string; weight: number; context: string }>`) with zero runtime field validation. If a `graph-metadata.json` edge lacks a `context` field (or has `context: null` in JSON), `exemplar.context` is `undefined` or `null` at runtime. Inside `substituteProviderName` (line 76-82), `result = context` becomes `null`/`undefined`, and `result.replace(...)` at line 79 throws: `TypeError: Cannot read properties of null (reading 'replace')` or `Cannot read properties of undefined (reading 'replace')`. This is an unhandled crash in `detectInboundEnhances` — no try/catch around `inferEdgePayload`.
- **Why it matters**: The spec edge cases section (`spec.md:215`) requires "Malformed source `graph-metadata.json`: catch JSON.parse errors per skill; continue with remaining skills". This crash path is NOT a JSON.parse error — the parse succeeds but the data is structurally malformed (missing `context` on an edge object). The crash would abort the entire detection run for all skills, not just the affected one. In production, all existing edges have valid `context` strings, so this cannot trigger today — but the code path is unprotected against future corrupt or hand-edited `graph-metadata.json` files.
- **Evidence**:
  ```typescript
  // context-template.ts:132-134 — exemplar.context dereference without null guard
  const exemplar = familyEdges[0];
  const peerIds = familyEdges.map(e => e.target);
  context = substituteProviderName(exemplar.context, peerIds, target.skillId);
  //          ^^^^^^^^^^^^^^^^^^^^^^^^ — null/undefined if exemplar lacks context field
  ```
  ```typescript
  // context-template.ts:75-79 — no null check on `context` parameter
  function substituteProviderName(context: string, peerIds: string[], targetSkillId: string): string {
    let result = context;           // null/undefined flows through
    for (const peerId of peerIds) {
      result = result.replace(...); // ← TypeError on null.replace()
    }
  }
  ```
  ```typescript
  // metadata-loader.ts:122 — unsafe as cast, no runtime field validation
  edges[edgeType as keyof typeof edges] = rawEdgeList as Array<{ target: string; weight: number; context: string }>;
  ```
- **Fix suggestion**: Guard against null `exemplar.context` before calling `substituteProviderName`:
  ```typescript
  const exemplar = familyEdges[0];
  if (!exemplar.context) {
    blockers.push('exemplar context missing or null — cannot infer provider name');
    return { weight: clipWeight(stableWeight), context: null, blockers };
  }
  ```
  Or defensively null-check inside `substituteProviderName` itself:
  ```typescript
  function substituteProviderName(context: string | null, ...): string {
    if (!context) return '';
    // ...
  }
  ```
- **REQ trace**: spec.md:215 (malformed source error handling), REQ-012 (deterministic context inference)

### F-07-002 [P2] `substituteProviderName` `\b` word boundary fails to prevent substring matching within hyphenated skill IDs

- **Where**: `context-template.ts:79`
- **What**: The regex `new RegExp('\\b' + peerId + '\\b', 'g')` uses `\b` (word boundary) to achieve "exact word" matching. However, `\b` matches between a word character (`[a-zA-Z0-9_]`) and a non-word character. Hyphenated skill IDs like `sk-code` contain the non-word char `-` internally. When searching for `\bsk-code\b` in a string like `"routes sk-code-review delegation requests"`, the first `\b` correctly matches at the start-of-string / `s` boundary. The second `\b` at position after `e` in `sk-code` sees the next character `-` (non-word) and matches — because the boundary between word-char `e` and non-word-char `-` IS a word boundary. Result: `sk-code` is matched and replaced within `sk-code-review`, producing e.g. `"routes cli-new-review delegation requests"` instead of leaving `sk-code-review` unchanged.
- **Why it matters**: In the current production skill set, skill IDs are not substrings of each other (no ID is a prefix or infix of another when hyphenation is considered), so this cannot trigger with today's data. However, the iteration focus specifically asks about "exact-word, not substring" replacement. The `\b` approach is fundamentally insufficient for hyphenated identifiers — it provides only partial boundary protection. If a future skill ID like `sk-code` is registered alongside `sk-code-review`, and an exemplar context references `sk-code-review`, the substitution would incorrectly replace the `sk-code` portion.
- **Evidence**:
  ```typescript
  // context-template.ts:75-82 — \b boundaries treat hyphen as word boundary
  function substituteProviderName(context: string, peerIds: string[], targetSkillId: string): string {
    let result = context;
    for (const peerId of peerIds) {
      // peerId "sk-code" → regex /\bsk-code\b/g
      // In "sk-code-review": \b matches after 'e' (word) before '-' (non-word)
      result = result.replace(new RegExp(`\\b${peerId}\\b`, 'g'), targetSkillId);
    }
    return result;
  }
  ```
- **Fix suggestion**: Use a more precise boundary that forbids both `\w` and `-` characters on either side:
  ```typescript
  const escaped = peerId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(?<![\\w-])${escaped}(?![\\w-])`, 'g');
  ```
  This uses negative lookbehind/lookahead assertions to ensure the match isn't adjacent to word characters OR hyphens. This prevents `sk-code` from matching within `sk-code-review`. Note: lookbehind requires Node.js >= 16.9 (the project uses Node built-ins, so this should be fine).
- **REQ trace**: REQ-012 (deterministic context inference — "Never an LLM call at runtime" satisfied, but output correctness not fully guarded), extends F-03-004 (regex metacharacters) to the word-boundary dimension

### F-07-003 [P2] `substituteTemplate` plan-vs-implementation divergence — single `.replace(string)` in plan vs global `/g` regex in implementation

- **Where**: `plan.md:326` vs `context-template.ts:66`
- **What**: The plan.md §3 `substituteTemplate` sketch (lines 324-329) uses `.replace('${target.id}', target.skillId)` — JavaScript's `String.replace` with a string first-argument, which replaces only the FIRST occurrence of the pattern. The implementation (lines 64-68) uses `.replace(/\$\{target\.id\}/g, ...)` — a regex with the `/g` global flag, which replaces ALL occurrences. For a template string like `"${target.id} enhances ${target.id}"`, the plan would produce `"cli-new enhances ${target.id}"` (second token unchanged), while the implementation produces `"cli-new enhances cli-new"` (both replaced). The implementation's behavior is arguably better, but it diverges from the plan's documented contract.
- **Why it matters**: The plan is the acceptance document for implementation correctness. A reader who tests against the plan's exact sketches would observe different behavior for templates with repeated tokens. In practice, both current production context_templates use `${target.id}` only once, so the divergence has zero practical impact today. The finding is about spec-implementation traceability, not a runtime defect.
- **Evidence**:
  ```javascript
  // plan.md:326 — string search, replaces first occurrence only
  .replace('${target.id}', target.skillId)
  ```
  ```typescript
  // context-template.ts:66 — global regex, replaces all occurrences
  .replace(/\$\{target\.id\}/g, target.skillId)
  ```
  ```json
  // system-skill-advisor/graph-metadata.json:206 — single occurrence in production
  "context_template": "routes ${target.id} delegation requests"
  ```
- **Fix suggestion**: Either (A) adopt the implementation's behavior as intentional and update plan.md to use `/\$\{target\.id\}/g` (recommended — the `/g` form is more correct), or (B) remove the `/g` flag from the implementation to match the plan's strict sketch. Option A is preferred since replacing all occurrences is the more intuitive semantics for template engines.
- **REQ trace**: REQ-012 (context inference), plan.md §3 function sketches

### F-07-004 [P2] `substituteTemplate` silently passes through malformed `${target.id` (unbalanced `$ {` / missing `}`)

- **Where**: `context-template.ts:64-68`
- **What**: `substituteTemplate` uses three regexes (`\$\{target\.id\}`, `\$\{target\.family\}`, `\$\{target\.category\}`) with literal closing `\}`. A template string containing an unbalanced token like `"routes ${target.id delegation requests"` (missing `}`) or `"routes $ {target.id} delegation requests"` (space between `$` and `{`) would not match any regex. The raw, un-substituted token passes through as literal context text. No warning or error is logged. The resulting context string is written verbatim into `graph-metadata.json` via `applyEnhanceEdge`.
- **Why it matters**: If a skill author makes a typo in their `context_template` field (e.g., writes `${tarrget.id}` instead of `${target.id}`), the output context will contain the literal `${tarrget.id}` rather than the intended skill ID. This degrades the quality of auto-generated context strings silently — the operator has no way to discover the issue (no validation, no warning, no error). The template processing is "best-effort" with no feedback loop.
- **Evidence**:
  ```typescript
  // context-template.ts:64-68 — only three exact patterns are matched
  function substituteTemplate(template: string, target: SkillMetadataRecord): string {
    return template
      .replace(/\$\{target\.id\}/g, target.skillId)       // ← requires exact `}`
      .replace(/\$\{target\.family\}/g, target.family ?? '')
      .replace(/\$\{target\.category\}/g, target.category ?? '');
    // Any non-matching text (e.g., "${target.id", "${tarrget.id}") passes through as-is
  }
  ```
  ```json
  // system-skill-advisor/graph-metadata.json:206 — valid template today
  "context_template": "routes ${target.id} delegation requests"
  // If an author writes "routes ${target.id delegation requests" (no `}`),
  // output becomes "routes ${target.id delegation requests" — untouched.
  ```
- **Fix suggestion**: Add a post-substitution validation check: if the output still contains `$ {` or `\${`, log a warning or add a blocker to prevent applying a candidate with un-resolved template tokens:
  ```typescript
  const result = template
    .replace(/\$\{target\.id\}/g, target.skillId)
    .replace(/\$\{target\.family\}/g, target.family ?? '')
    .replace(/\$\{target\.category\}/g, target.category ?? '');
  if (/\$\{/.test(result)) {
    // Still contains un-resolved `${` tokens — template may be malformed
    // Could log warning or mark context as suspect
  }
  return result;
  ```
- **REQ trace**: REQ-012 (deterministic context inference should produce valid output)

### F-07-005 [P2] `inferEdgePayload` context-conflict fallback ignores non-first exemplars — only `familyEdges[0].context` used

- **Where**: `context-template.ts:130-134`
- **What**: When same-family exemplar contexts differ (the `allEqual(contexts)` check at line 128 fails), the fallback path at lines 130-135 uses ONLY the first exemplar's context (`familyEdges[0].context`) for provider-name substitution. The other exemplars' contexts (which caused the `allEqual` check to fail in the first place) are completely ignored. The assumption is that contexts differ only in the provider/skill-name embedded within them, and that the first exemplar's template structure is representative. But if the first exemplar happens to have a structurally different context from the majority (e.g., one exemplar uses `"peer"` as context while four others use `"routes <name> delegation requests"`), the `substituteProviderName` call would try to find skill IDs in the poor exemplar's `"peer"` string, produce no meaningful substitution, and return a degraded context.
- **Why it matters**: The first exemplar (lowest array index) is not guaranteed to be the most representative. In typical data, the first exemplar will be the earliest-created edge, which is likely representative. But the algorithm has no "majority vote" logic — it picks the first and hopes it's good. If an operator manually adds an enhances edge with unusual context, it could "poison" the inferenced context for all future auto-detected candidates. The conservative approach would be to signal low confidence rather than silently producing degraded output.
- **Evidence**:
  ```typescript
  // context-template.ts:126-135 — context conflict fallback uses only [0]
  const contexts = familyEdges.map(e => e.context);
  let context: string | null = null;
  if (allEqual(contexts)) {
    context = contexts[0];
  } else {
    // Provider-template substitution: replace any peer-skill-id appearing in an exemplar context
    const exemplar = familyEdges[0];  // ← always takes first, ignores majority
    const peerIds = familyEdges.map(e => e.target);
    context = substituteProviderName(exemplar.context, peerIds, target.skillId);
  }
  ```
- **Fix suggestion**: Consider a majority-vote approach: group contexts by structural similarity (e.g., after stripping known skill ID substrings, compare the remaining template skeleton), and use the most-common skeleton for substitution. Or, at minimum, log a warning when using the fallback path so the operator can audit the produced context. The simplest fix without adding complexity: after `substituteProviderName` produces the result, add a `blocker` if substitution didn't actually change the context (indicating the exemplar context didn't contain any recognizable peer-skill-id):
  ```typescript
  if (context === exemplar.context) {
    blockers.push('provider-name substitution produced no change — contexts are structurally different');
  }
  ```
- **REQ trace**: REQ-012 (deterministic context inference quality)

### F-07-006 [P2] `$` in replacement values interpreted by JavaScript's `String.replace()` pattern-substitution semantics

- **Where**: `context-template.ts:66` and `context-template.ts:79`
- **What**: Both `substituteTemplate` and `substituteProviderName` pass `target.skillId` as the second argument to `String.prototype.replace()`. In JavaScript, the replacement string undergoes pattern-substitution: `$$`, `$&`, `$``, `$'`, and `$1`-`$9` are treated as special sequences. If a skill ID contained any of these sequences (e.g., a skill named `test$1`), the replacement would not be literal — `$1` would be interpreted as a backreference to the first capture group (which doesn't exist in these simple regexes, producing empty string). Currently all skill IDs follow `[a-z0-9-]+` naming, so this is purely hypothetical. The `$` character is already constrained by `requireString` only requiring "non-empty string", not preventing `$`.
- **Why it matters**: Very low — skill IDs are constrained by folder naming conventions (`[a-z0-9-]+`) and no skill uses `$`. However, if the naming convention ever expands, or if a future `context_template` contains `$&`-style tokens that interact with the replacement logic, this could produce silently garbled output. Noting for completeness since the iteration focus covers substitution edge cases.
- **Evidence**:
  ```typescript
  // context-template.ts:66 — target.skillId passed as replacement string
  .replace(/\$\{target\.id\}/g, target.skillId)
  // If skillId were "test$&", output would be "test${target.id}" ($& = matched text)
  ```
  ```typescript
  // context-template.ts:79 — targetSkillId passed as replacement string
  result = result.replace(new RegExp(`\\b${peerId}\\b`, 'g'), targetSkillId);
  // Same $ interpretation risk for targetSkillId
  ```
  ```typescript
  // metadata-loader.ts:56-59 — requireString only enforces non-empty string
  function requireString(value: unknown, fieldName: string, sourcePath: string): string {
    if (typeof value !== 'string' || value.trim().length === 0) {
      throw new Error(`${sourcePath}: ${fieldName} must be a non-empty string`);
    }
    return value;  // no `$` or regex-safe-content check
  }
  ```
- **Fix suggestion**: Use `.replace()` with a replacer function to avoid `$` interpretation:
  ```typescript
  .replace(/\$\{target\.id\}/g, () => target.skillId)
  ```
  When a function is passed as the second argument, its return value is used literally — no `$` interpretation occurs. Same fix for `substituteProviderName`.
- **REQ trace**: REQ-012 (deterministic context inference should produce exact literal output)

## New Info Ratio
6 new weighted findings this iteration. All 6 address the iteration 07 focus area (context-template substitution edge cases) and are novel — no overlap with prior iterations' findings about null-weight blockers (F-01-006, F-02-001), regex metacharacters (F-03-004), or empty-context applyable (F-05-005). These are different code paths and different root causes.

**newInfoRatio: 1.00**

New weighted findings this iteration: 6. Any weighted findings considered: 6.

## Quality Gates
- **Evidence**: pass — every finding cites file:line with quoted code; adversarial self-check verified crash path (F-07-001) by tracing through all null-guard branches; regex behavior (F-07-002) verified against JavaScript `\b` spec; plan divergence (F-07-003) checked against plan.md §3 sketches; `$` interpretation (F-07-006) verified against MDN `String.replace` docs
- **Scope**: pass — all files in the review scope were read; context-template.ts re-read with granular focus on each substitution function; plan.md §3 confirmed for divergence; metadata-loader.ts checked for edge-field validation gap; test file verified for absence of substitution-specific test coverage
- **Coverage**: D1 (Correctness) constrained to context-template substitution — `substituteTemplate` (plan divergence, malformed template passthrough, `$` replacement edge case), `substituteProviderName` (null-context crash, `\b` substring matching, `$` replacement edge case), `inferEdgePayload` (exemplar-selection bias, null-context propogation). All five edge cases from the iteration focus are covered.

## Convergence Signal
not-converged — iteration 07 shifts back to D1 (Correctness) with a narrow focus on substitution-edge-cases, finding 6 P2 findings (1 P1 — null-context crash). This is the seventh iteration. The review strategy's stop conditions require `newInfoRatio < 0.10` for 2 consecutive iterations — we are far from convergence at 1.00. Cross-iteration tally to date:

| Iteration | Dimension | P0 | P1 | P2 | Total |
|-----------|---|---|----|----|-------|
| 01 | D1 Correctness — scoring math | 0 | 0 | 6 | 6 |
| 02 | D1 Correctness — idempotence/hash/filter | 0 | 0 | 1 | 1 |
| 03 | D2 Security — path traversal/parse/injection | 0 | 1 | 3 | 4 |
| 04 | D3 Traceability — P0 REQs | 0 | 2 | 4 | 6 |
| 05 | D3 Traceability — P1 REQs + checklist | 0 | 2 | 4 | 6 |
| 06 | D4 Maintainability — naming/dead code/errors/docs | 0 | 1 | 6 | 7 |
| 07 | D1 Correctness — substitution edge cases | 0 | 1 | 5 | 6 |

**Totals across all 7 iterations**: 0 P0 + 7 P1 + 29 P2 = 36 findings.
