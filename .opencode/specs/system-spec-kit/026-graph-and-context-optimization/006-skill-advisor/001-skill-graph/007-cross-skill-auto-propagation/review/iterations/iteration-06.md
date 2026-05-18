# Iteration 06 - Maintainability — naming, dead code, error messages, doc quality

## Focus
Maintainability — naming, dead code, error messages, doc quality

## Sources Read
- `.opencode/skills/system-skill-advisor/mcp_server/lib/cross-skill-edges/types.ts:1-112`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/cross-skill-edges/metadata-loader.ts:1-193`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/cross-skill-edges/detect-inbound-enhances.ts:1-246`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/cross-skill-edges/context-template.ts:1-146`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/cross-skill-edges/apply-graph-metadata-patch.ts:1-58`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/cross-skill-edges/index.ts:1-67`
- `.opencode/skills/system-skill-advisor/mcp_server/handlers/skill-graph/propagate-enhances.ts:1-75`
- `.opencode/skills/system-skill-advisor/mcp_server/handlers/skill-graph/index.ts:1-8`
- `.opencode/skills/system-skill-advisor/mcp_server/tools/skill-graph-tools.ts:1-145`
- `.opencode/skills/system-skill-advisor/mcp_server/tests/cross-skill-edges.vitest.ts:1-289`
- `.opencode/skills/sk-prompt/graph-metadata.json:45-49`
- `.opencode/skills/system-skill-advisor/graph-metadata.json:104-105, 200-207`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/007-cross-skill-auto-propagation/spec.md:1-247`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/007-cross-skill-auto-propagation/plan.md:73-319`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/007-cross-skill-auto-propagation/checklist.md:1-132`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/007-cross-skill-auto-propagation/implementation-summary.md:1-132`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/007-cross-skill-auto-propagation/review/deep-review-strategy.md:1-53`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/007-cross-skill-auto-propagation/review/iterations/iteration-01.md:1-152`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/007-cross-skill-auto-propagation/review/iterations/iteration-02.md:1-101`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/007-cross-skill-auto-propagation/review/iterations/iteration-03.md:1-182`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/007-cross-skill-auto-propagation/review/iterations/iteration-04.md:1-213`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/007-cross-skill-auto-propagation/review/iterations/iteration-05.md:1-312`
- `.opencode/skills/system-skill-advisor/mcp_server/advisor-server.ts:14-16` (import verification for TOOL_NAMES)
- `.opencode/skills/system-skill-advisor/mcp_server/tools/index.ts:16, 29-30` (barrel export verification)

## Findings

### F-06-001 [P2] Public function name `propagateInboundEnhances` in code vs `proposeInboundEnhances` in spec
- **Where**: `spec.md:113` vs `implementation-summary.md:69` and `index.ts:26`
- **What**: The spec "Files to Change" table describes `index.ts` as "Public entry point: `proposeInboundEnhances({ skillsRoot, mode, minConfidence, ... })`". The actual implementation exports `propagateInboundEnhances`. The plan.md §3 types (`PropagateEnhancesOptions`, `PropagateEnhancesResult`) and the implementation-summary both use the `propagate` prefix consistently. The spec is the outlier.
- **Why it matters**: A reader following the spec literally would look for `proposeInboundEnhances` in the codebase and not find it. The spec is the acceptance contract; when it drifts, future implementers or auditors may report a false-negative ("function not found"). The code and plan are consistent — only the spec is stale.
- **Evidence**:
  ```markdown
  # spec.md:113 — spec says proposeInboundEnhances
  `.opencode/skills/system-skill-advisor/mcp_server/lib/cross-skill-edges/index.ts` | Create | Public entry point: `proposeInboundEnhances(...)`
  ```
  ```typescript
  // index.ts:26 — implementation uses propagateInboundEnhances
  export async function propagateInboundEnhances(options: PropagateEnhancesOptions): Promise<PropagateEnhancesResult> {
  ```
  ```typescript
  // plan.md:114-115 — plan types use Propagate prefix
  export interface PropagateEnhancesOptions { ... }
  export interface PropagateEnhancesResult { ... }
  ```
- **Fix suggestion**: Update spec.md:113 to `propagateInboundEnhances` to match code + plan.

### F-06-002 [P2] Unused `EnhanceWhenRule` type import in `context-template.ts`
- **Where**: `context-template.ts:8`
- **What**: `EnhanceWhenRule` is imported as a type but never explicitly referenced in the file body. The `asArray(source.enhance_when)` call at line 102 infers the generic type from the argument, so the explicit type annotation is never needed. The import statement reads `import type { EnhanceWhenRule, SkillMetadataRecord } from './types.js';` — `SkillMetadataRecord` is used (4 references), `EnhanceWhenRule` is not.
- **Why it matters**: Dead imports accumulate confusion and, with `noUnusedLocals` enabled in strict tsconfig, would become a compile error. Currently it passes because either the project doesn't enforce unused type imports, but it's clutter that signals a connection to `EnhanceWhenRule` that doesn't exist in the file's logic.
- **Evidence**:
  ```typescript
  // context-template.ts:8 — only appearance of EnhanceWhenRule in the file
  import type { EnhanceWhenRule, SkillMetadataRecord } from './types.js';
  ```
  Grep for `EnhanceWhenRule` in `context-template.ts` returns only line 8. No other occurrence.
- **Fix suggestion**: Remove `EnhanceWhenRule` from the import: `import type { SkillMetadataRecord } from './types.js';`

### F-06-003 [P2] Unused `TOOL_NAMES` export in `skill-graph-tools.ts` — never imported by any consumer
- **Where**: `skill-graph-tools.ts:93`
- **What**: `TOOL_NAMES` is exported at line 93 (`export const TOOL_NAMES = new Set(skillGraphToolDefinitions.map((tool) => tool.name))`) and re-exported via `tools/index.ts:30` (`export * as skillGraphTools from './skill-graph-tools.js'`). No file in the codebase imports either `TOOL_NAMES` directly or `skillGraphTools.TOOL_NAMES` via the namespace re-export. `advisor-server.ts:38` defines its own local `TOOL_NAMES` constant — it does not import from `skill-graph-tools.ts`. The `skillGraphTools` namespace export itself is also never imported.
- **Why it matters**: Dead exports are dead code. If `TOOL_NAMES` was intended as the canonical list for tool routing in `advisor-server.ts`, the local redefinition at `advisor-server.ts:38` creates a subtle maintenance risk — removing a tool from `skillGraphToolDefinitions` would NOT remove it from the server's routing table unless the local copy is also updated.
- **Evidence**:
  ```typescript
  // skill-graph-tools.ts:93 — exported but unused
  export const TOOL_NAMES = new Set(skillGraphToolDefinitions.map((tool) => tool.name));
  ```
  ```typescript
  // tools/index.ts:30 — re-exported via wildcard, also unused
  export * as skillGraphTools from './skill-graph-tools.js';
  ```
  ```typescript
  // advisor-server.ts:38 — defines its own TOOL_NAMES, does not import from skill-graph-tools
  const TOOL_NAMES = new Set(TOOL_DEFINITIONS.map((tool) => tool.name));
  ```
  ```typescript
  // advisor-server.ts:14-16 — imports only dispatchTool and TOOL_DEFINITIONS from tools/index
  import {
    dispatchTool,
    TOOL_DEFINITIONS,
  } from './tools/index.js';
  ```
- **Fix suggestion**: Either (A) remove the `TOOL_NAMES` export from `skill-graph-tools.ts` and the `skillGraphTools` namespace re-export from `tools/index.ts`, or (B) have `advisor-server.ts` import `TOOL_NAMES` from `skill-graph-tools.ts` instead of redefining it locally.

### F-06-004 [P1] JSON parse failures silently swallowed during metadata loading — never surfaced to tool output `errors[]`
- **Where**: `metadata-loader.ts:83-85, 88-94` (silent null returns) vs `spec.md:215-216` (error contract)
- **What**: `parseSkillMetadata` returns `null` without any console.warn for two failure modes: (1) `parsedJson` is not a plain object (`!isRecord(parsedJson)` at line 83), and (2) the file lacks recognizable skill metadata fields (`!hasSkillFields` at line 92). These nulls are filtered out by `loadAllSkillMetadata` at line 170 (`if (record) { records.push(record); }`), silently discarding malformed files. Only hard exceptions (e.g., `SyntaxError` from `JSON.parse`) are caught and logged at line 150. The spec edge cases section (line 215-216) explicitly requires: **"Malformed source `graph-metadata.json`: catch JSON.parse errors per skill; continue with remaining skills; report in tool output as `errors: [{ skill_id, error }]`"**. The `PropagateEnhancesResult.errors` array (types.ts:75) is designed to surface these errors, but it is only populated for apply-mode failures (index.ts:61) — never for load-time parse issues.
- **Why it matters**: This is a spec contract violation for the error reporting surface. An operator who accidentally commits a non-object JSON file (e.g., `graph-metadata.json` containing `"hello"` or `123`) would get zero candidates, zero errors, and zero indication that a file was skipped. The error is silently suppressed, making the tool appear to work correctly while hiding real data quality problems. Debugging would require manual console inspection or reading the source code.
- **Evidence**:
  ```typescript
  // metadata-loader.ts:83-85 — silent null on non-object JSON
  if (!isRecord(parsedJson)) {
    return null;  // No console.warn, no error surfaced
  }
  ```
  ```typescript
  // metadata-loader.ts:88-94 — silent null on missing skill fields
  const hasSkillFields = typeof parsedJson.skill_id === 'string' ||
                        typeof parsedJson.family === 'string' ||
                        isRecord(parsedJson.edges);
  if (!hasSkillFields) {
    return null;  // No console.warn, no error surfaced
  }
  ```
  ```typescript
  // metadata-loader.ts:170 — nulls silently discarded
  if (record) {
    records.push(record);
  }
  // No error tracking for null results
  ```
  ```typescript
  // index.ts:54-63 — only apply failures populate errors[]
  for (const c of toApply) {
    const r = await applyEnhanceEdge(c);
    if (r.applied) {
      result.applied.push(c.id);
    } else if (r.reason === 'edge already exists') {
      result.skipped_existing.push(c.id);
    } else {
      result.errors.push({ skillId: c.sourceSkillId, error: r.reason });
    }
  }
  ```
  ```markdown
  # spec.md:215-216 — spec contract for error reporting
  Malformed source graph-metadata.json: catch JSON.parse errors per skill; continue with remaining skills; 
  report in tool output as errors: [{ skill_id, error }]
  ```
- **Fix suggestion**: Track non-parseable/null results in `loadAllSkillMetadata` and return them alongside records. Or add a second return value `{ records, errors }`. The errors would then be merged into `PropagateEnhancesResult.errors` by `propagateInboundEnhances` in index.ts. At minimum, add `console.warn` for the two silent-null paths (lines 84, 94) so the operator can at least see them in server logs.
- **REQ trace**: spec.md:215-216 (Error Scenarios — Malformed source), types.ts:75 (errors field contract)

### F-06-005 [P2] `applyEnhanceEdge` catch block reports all errors generically — EACCES not differentiated per spec contract
- **Where**: `apply-graph-metadata-patch.ts:54-56` vs `spec.md:217`
- **What**: The spec edge cases section says: "Write permission denied: apply mode catches EACCES, reports per candidate `applied: false, error: "EACCES"`, continues". The implementation catches all errors identically at lines 54-56 and wraps them as `"failed to apply edge: <raw message>"`. An EACCES error would surface as `"failed to apply edge: EACCES: permission denied, open '/path'"` — not the clean `"EACCES"` string the spec describes. Other error types (SyntaxError, ENOENT, etc.) are also reported identically with no differentiation.
- **Why it matters**: The spec explicitly calls for EACCES to be identifiable as a distinct error type so operators can distinguish transient permission issues from structural failures (malformed JSON, missing files). The generic wrapping makes automated error classification (e.g., CI scripts checking error codes) impossible without parsing nested error messages.
- **Evidence**:
  ```typescript
  // apply-graph-metadata-patch.ts:54-56 — generic catch-all
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { applied: false, reason: `failed to apply edge: ${message}` };
  }
  ```
  ```markdown
  # spec.md:217 — spec requires specific EACCES reporting
  Write permission denied: apply mode catches EACCES, reports per candidate 
  applied: false, error: "EACCES", continues
  ```
- **Fix suggestion**: Check `instanceof Error` for Node.js `ErrnoException` with `err.code === 'EACCES'` and return the clean error string. For JSON parse errors, return `"failed to parse JSON: ..."`. For generic errors, use the current format.
- **REQ trace**: spec.md:217

### F-06-006 [P2] "Target not registered" edge case from spec not implemented
- **Where**: `spec.md:216-217` vs `detect-inbound-enhances.ts:193-246` (no such check)
- **What**: The spec edge cases section describes: "Target skill not in skill_nodes table: skip candidate generation for that target with a `reason: "target not registered"` warning". The detection loop in `detectInboundEnhances` iterates over `skills: SkillMetadataRecord[]` — all records are already loaded and present. There is no concept of a "skill_nodes table" in the cross-skill-edges module (only in the SQLite-backed `lib/skill-graph/`). The spec edge case describes a scenario from the SQLite indexer's perspective that doesn't apply to the metadata-loader-driven detection path. The implementation correctly handles every target in the loaded skills array, but the spec describes a check that was never implemented because the detection path doesn't use the skill_nodes table.
- **Why it matters**: Minor — the check is unnecessary in the current implementation (all targets from `loadAllSkillMetadata` are valid). But the spec contains a documented edge case that doesn't correspond to any code path, creating a false expectation for future readers.
- **Evidence**:
  ```typescript
  // detect-inbound-enhances.ts:201-243 — target loop iterates all loaded skills
  for (const target of skills) {
    if (options.targetSkillIds && !options.targetSkillIds.includes(target.skillId)) continue;
    // ... no "target not registered" check
  }
  ```
  ```markdown
  # spec.md:216-217 — spec describes an unimplemented check
  Target skill not in skill_nodes table: skip candidate generation for that target 
  with a reason: "target not registered" warning
  ```
- **Fix suggestion**: Either (A) retire the spec edge case as inapplicable to the current architecture (detection uses metadata-loader, not SQLite skill_nodes), or (B) implement the check against `byId` for defense-in-depth: if `options.targetSkillIds` specifies an ID not in `skills`, log a warning and skip. The current filter at line 202 already implicitly handles this (unlisted targets are skipped), so option A (retire the spec edge case) is simplest.
- **REQ trace**: spec.md:216-217

### F-06-007 [P2] Single-letter variable names `c` and `r` in apply filter loop
- **Where**: `index.ts:46, 55`
- **What**: The `propagateInboundEnhances` function uses single-letter variables `c` for candidate and `r` for the apply result in the apply-mode filter-and-apply loop. The surrounding codebase uses descriptive names (e.g., `candidate`, `source`, `target`, `familyScore`, `transitivityScore`).
- **Why it matters**: Single-letter variables reduce readability in loops with non-trivial logic. The filter block at lines 46-52 spans 5 lines with predicate logic — `c` is used 4 times, making it visually noisy to distinguish from `candidate` (the outer array). `r` on line 55 is used once but `applyResult` would be clearer for what the variable represents.
- **Evidence**:
  ```typescript
  // index.ts:45-63 — single-letter variables in apply loop
  if (options.mode === 'apply' && (options.dryRun !== true)) {
    const toApply = candidates.filter(c => {          // ← 'c' instead of 'candidate'
      if (options.applyCandidateIds?.includes(c.id)) return true;
      if (options.applyAllHighConfidence && c.confidenceLabel === 'high' && c.applyable) return true;
      return false;
    });

    for (const c of toApply) {                         // ← 'c' again
      const r = await applyEnhanceEdge(c);               // ← 'r' instead of 'applyResult'
      if (r.applied) {
        result.applied.push(c.id);
      } else if (r.reason === 'edge already exists') {
        result.skipped_existing.push(c.id);
      } else {
        result.errors.push({ skillId: c.sourceSkillId, error: r.reason });
      }
    }
  }
  ```
- **Fix suggestion**: Rename `c` to `cand` or `candidate` throughout, and `r` to `applyResult` or `result`.

### F-06-008 [P2] `PropagateEnhancesArgs` interface fields lack JSDoc descriptions
- **Where**: `propagate-enhances.ts:17-26`
- **What**: The `PropagateEnhancesArgs` interface (the runtime args shape for the MCP tool handler) has zero field-level JSDoc. Contrast with the `inputSchema` in `skill-graph-tools.ts:72-82` which provides descriptions for every field. The handler interface duplicates the schema fields but without documentation, creating a documentation gap for future maintainers reading the handler without also consulting the tool schema.
- **Why it matters**: The handler is a public entry point (callers reach it via MCP dispatch). Without field-level JSDoc, a developer adding new fields or modifying existing ones in the handler won't see the intended constraints (defaults, valid ranges, nullability) without cross-referencing the tool schema. The `inputSchema` descriptions at `skill-graph-tools.ts:73-80` document defaults and semantics, but the handler interface at `propagate-enhances.ts:17-26` is the one TypeScript surfaces in editor tooltips.
- **Evidence**:
  ```typescript
  // propagate-enhances.ts:17-26 — no JSDoc on fields
  export interface PropagateEnhancesArgs {
    skillsRoot?: string;
    mode?: 'report' | 'propose' | 'apply';
    minConfidence?: number;
    targetSkillIds?: string[];
    sourceSkillIds?: string[];
    applyCandidateIds?: string[];
    applyAllHighConfidence?: boolean;
    dryRun?: boolean;
  }
  ```
  ```typescript
  // skill-graph-tools.ts:73-80 — inputSchema has descriptions for the same fields
  skillsRoot: { type: 'string', description: 'Defaults to .opencode/skills' },
  mode: { type: 'string', enum: ['report', 'propose', 'apply'], default: 'report' },
  minConfidence: { type: 'number', minimum: 0, maximum: 1, default: 0.75 },
  ```
- **Fix suggestion**: Add JSDoc field descriptions matching the inputSchema documentation, e.g.:
  ```typescript
  export interface PropagateEnhancesArgs {
    /** Skills root directory (default: .opencode/skills) */
    skillsRoot?: string;
    /** Propagation mode: report (read-only), propose (alias for report), or apply (write). Default: 'report' */
    mode?: 'report' | 'propose' | 'apply';
    // ...
  }
  ```

---

## Naming Conformance — Plan §3 Sketches vs Implementation

All function names in the implementation match the plan.md §3 TypeScript sketches verbatim:

| Plan §3 Name | Implementation | File:Line | Match |
|---|---|---|---|
| `scoreFamilyInference` | `scoreFamilyInference` | `detect-inbound-enhances.ts:92` | ✓ |
| `scoreAssetShape` | `scoreAssetShape` | `detect-inbound-enhances.ts:133` | ✓ |
| `scoreSiblingTransitivity` | `scoreSiblingTransitivity` | `detect-inbound-enhances.ts:161` | ✓ |
| `inferEdgePayload` | `inferEdgePayload` | `context-template.ts:92` | ✓ |
| `clipWeight` | `clipWeight` | `context-template.ts:55` | ✓ |
| `substituteTemplate` | `substituteTemplate` | `context-template.ts:64` | ✓ |
| `substituteProviderName` | `substituteProviderName` | `context-template.ts:75` | ✓ |
| `asArray` | `asArray` | `context-template.ts:17` | ✓ |
| `targetHasFile` | `targetHasFile` | `context-template.ts:24` | ✓ |
| `allEqual` | `allEqual` | `context-template.ts:33` | ✓ |
| `medianOf` | `medianOf` | `context-template.ts:42` | ✓ |
| `detectInboundEnhances` | `detectInboundEnhances` | `detect-inbound-enhances.ts:193` | ✓ |
| `hasEnhanceEdge` | `hasEnhanceEdge` | `detect-inbound-enhances.ts:58` | ✓ |
| `hashCandidate` | `hashCandidate` | `detect-inbound-enhances.ts:66` | ✓ |
| `stableSortByConfidenceDesc` | `stableSortByConfidenceDesc` | `detect-inbound-enhances.ts:74` | ✓ |
| `loadAllSkillMetadata` | `loadAllSkillMetadata` | `metadata-loader.ts:163` | ✓ |
| `groupByFamily` | `groupByFamily` | `metadata-loader.ts:182` | ✓ |

The only naming discrepancy is the spec-level naming in the "Files to Change" table (F-06-001): `proposeInboundEnhances` in spec vs `propagateInboundEnhances` in plan + implementation. The plan and implementation are consistent with each other.

---

## Dead Code Inventory (Previously Reported + New)

| Item | Location | Status |
|---|---|---|
| `allEqual` in `detect-inbound-enhances.ts` | lines 36-40 | Previously reported (F-01-002), not yet resolved |
| `medianOf` in `detect-inbound-enhances.ts` | lines 45-53 | Previously reported (F-01-002), not yet resolved |
| `EnhanceWhenRule` import in `context-template.ts` | line 8 | **New** (F-06-002) |
| `TOOL_NAMES` export in `skill-graph-tools.ts` | line 93 | **New** (F-06-003) |
| `skillGraphTools` namespace re-export in `tools/index.ts` | line 30 | **New** (F-06-003, related) |

---

## Error Message Quality Audit

| Error Site | File:Line | Message | Verdict |
|---|---|---|---|
| `requireString` failure | `metadata-loader.ts:58` | `"${path}: ${field} must be a non-empty string"` | PASS — clear, includes file path and field name |
| `requireStringArray` failure | `metadata-loader.ts:65` | `"${path}: ${field} must be an array of strings"` | PASS — clear |
| Schema version rejection | `metadata-loader.ts:98` | `"${path}: schema_version must be 1 or 2"` | PASS — clear, but does not include actual value |
| skill_id mismatch | `metadata-loader.ts:104` | `"${path}: skill_id X does not match folder name Y"` | PASS — clear, includes both values |
| JSON parse exception | `metadata-loader.ts:150` | `"[cross-skill-edges] Failed to parse ${path}: ${msg}"` | PASS — logged to console |
| Non-object JSON skip | `metadata-loader.ts:84` | **SILENT** — no message logged | **GAP** — F-06-004 |
| Missing skill fields skip | `metadata-loader.ts:93` | **SILENT** — no message logged | **GAP** — F-06-004 |
| Not applyable | `apply-graph-metadata-patch.ts:20` | `"not applyable: ${blockers}"` | PASS — clear reason chain |
| Edge already exists | `apply-graph-metadata-patch.ts:38` | `"edge already exists"` | PASS — clear |
| Apply failure (catch-all) | `apply-graph-metadata-patch.ts:56` | `"failed to apply edge: ${msg}"` | PARTIAL — lumps all error types together |
| Workspace escape | `propagate-enhances.ts:51` | `"Refusing to scan outside workspace: ..."` | PASS — clear |
| Handler failure | `propagate-enhances.ts:72` | `"Skill graph propagate enhances failed: ..."` | PASS — clear |

---

## New Info Ratio
7 new weighted findings this iteration. 0 overlap with prior iterations (iterations 01-05 covered D1 Correctness, D2 Security, D3 Traceability; all findings here are in D4 Maintainability — naming, dead code, error messages, doc quality).

**newInfoRatio: 1.00**

New weighted findings this iteration: 7. Any weighted findings considered: 7.

---

## Quality Gates
- **Evidence**: pass — every finding cites file:line with quoted code or markdown; adversarial self-check verified all claims against actual source; `TOOL_NAMES` and `EnhanceWhenRule` import verified via grep
- **Scope**: pass — all 12 implementation files + spec docs + graph-metadata.json files + prior 5 iterations read and analyzed; `advisor-server.ts` and `tools/index.ts` read for import-chain verification
- **Coverage**: D4 (Maintainability) — naming conformance (plan §3 vs implementation, 17/17 match); dead code (3 new items + 2 previously reported); error message quality (11 sites audited, 2 silent gaps identified, 1 generic catch-all identified); documentation (JSDoc on all public entry points confirmed per CHK-041, field-level JSDoc gap on handler args interface identified)

---

## Convergence Signal
approaching-convergence — this is the first and only D4 (Maintainability) iteration. Across all 6 iterations:

| Iteration | Dimension | Findings |
|---|---|---|
| 01 | D1 Correctness — scoring math | 6 P2 |
| 02 | D1 Correctness — idempotence/hash/filter | 1 P2 |
| 03 | D2 Security — path traversal/parse/injection | 1 P1 + 3 P2 |
| 04 | D3 Traceability — P0 REQs | 2 P1 + 4 P2 |
| 05 | D3 Traceability — P1 REQs + checklist | 2 P1 + 4 P2 |
| 06 | D4 Maintainability — naming/dead code/errors/docs | 1 P1 + 6 P2 |

**Totals across all 6 iterations**: 6 P1 + 24 P2 = 30 findings. Zero P0 findings.

All four plan dimensions (D1-D4) have now been covered at least once. The deep-review strategy's coverage conditions are met. The review is converging — findings are trending toward minor P2 issues (naming, unused imports, spec ↔ code drift) rather than structural or security flaws. Recommend iteration 07 cover mutation-testing (adversarial fixture validation) as a validation pass before concluding the review cycle.
