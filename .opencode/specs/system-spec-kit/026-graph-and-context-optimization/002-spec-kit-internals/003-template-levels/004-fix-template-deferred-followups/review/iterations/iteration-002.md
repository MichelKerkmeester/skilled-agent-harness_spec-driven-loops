# Iteration 2: Code-Correctness

## Focus
Deep review of logic correctness, edge cases, error handling, type safety, and potential bugs in orchestrator.ts, level-contract-resolver.ts, and generate-context.ts (lock handling). Files: orchestrator.ts (full 452 lines), level-contract-resolver.ts (full 235 lines), generate-context.ts (lock section lines 387-417).

## Scorecard
- Dimensions covered: code-correctness
- Files reviewed: 3
- New findings: P0=0 P1=2 P2=2
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.00

## Findings

### P1 — Required

- **F004**: `level` parameter in `loadManifest()` is unused — dead parameter signaling potential latent defect
  - `mcp_server/lib/templates/level-contract-resolver.ts:88` — `function loadManifest(level: SpecKitLevel, manifestPath = DEFAULT_MANIFEST_PATH)` declares `level` but never uses it. The parameter only appears in the error message at line 98: `throw levelContractError(level, error)`. Since `cachedManifest` is global (line 62) and checked first (line 89), the `level` parameter is effectively dead for the cache-hit path. If `manifestPath` were passed differently per level (e.g., different manifests for different levels), this would be a bug — but all levels share one manifest. The `level` parameter is misleading: it suggests per-level manifest loading that doesn't exist.
  - Evidence: Full function body at lines 88-100. `level` only used in error path at line 98. In normal flow (cache hit at line 89-91 or successful parse at lines 93-96), `level` is unused.
  - Recommendation: Remove the `level` parameter or rename it to signal it's only for error context. If it's intentionally only for error context, use a parameter naming convention (e.g., `_level` or a separate error-context parameter).

- **F005**: `renderInlineGates()` fence-tracking resets within function but shares no state with `stripFences()`
  - `mcp_server/lib/validation/orchestrator.ts:108-138` — `renderInlineGates()` implements its own fence tracker (`let inFence = false` at line 112) independent of `stripFences()` at lines 96-106. Both process the same content, but `renderInlineGates` does its own fence detection. This is correct isolation (renderInlineGates is template-only, stripFences is for instance docs), but the fence regex at line 116 (`/^\s*(\x60{3}|~~~)/u`) differs slightly from `stripFences` at line 100 (`/^\s*(```|~~~)/u`): renderInlineGates uses `\x60{3}` (hex for backtick × 3) versus literal `\`\`\``. Behaviorally identical but the regex divergence is a maintenance concern — if backtick fence detection ever needs updating, both places must be touched.
  - Recommendation: Extract fence detection into a shared utility or at minimum add a comment noting the duplication.

### P2 — Suggestion

- **F006**: `collectKnownSessionIds()` scans all .md files under .opencode/specs/ without depth or size limits
  - `mcp_server/lib/validation/orchestrator.ts:274-303` — The function walks the entire `.opencode/specs/` tree recursively, reading every `.md` file to extract session IDs. For large repositories with thousands of spec docs, this validation rule (FRONTMATTER_MEMORY_BLOCK) could be slow, especially since it runs synchronously (`readdirSync`, `readFileSync`). No mitigation (cache, bailout, timeout) is present.
  - Impact: Validation wall-clock may degrade linearly with tree size. The performance target (NFR-P01: <2000ms) could be breached for large trees, though the current tree size may be manageable.
  - Recommendation: Consider caching the known session ID set at the manifest/resolver level (similar to manifest caching), or add a file-count bailout threshold.

- **F007**: `validateTemplateShape()` ADR-001 special case matches any header containing "ADR-001:" 
  - `mcp_server/lib/validation/orchestrator.ts:225-227` — The special case `foundAt = actualHeaders.findIndex((header, index) => index >= cursor && /^ADR-001:/u.test(header))` matches the FIRST header at or after cursor position matching `^ADR-001:`. In a decision record with multiple ADRs (ADR-001 through ADR-005), this correctly matches the first occurrence. However, the template `header cursor` advances past this position, so subsequent expected headers like `ADR-001-context` would use the normal `indexOf` search which would fail to find them since they are `ADR-001:` matches not `ADR-001-context:` matches. Wait — the manifest's decision-record.md section gates use keys like `adr-001`, `adr-001-context`, etc., which correspond to ANCHORS, not HEADERS. The ADR-001 special case in header comparison is a workaround for the template using "ADR-001:" as a header placeholder while actual docs prefix it differently. The workaround is functional but fragile — it assumes exactly one ADR-001-like header exists at the cursor position.
  - Recommendation: Document this special case clearly, or better: use a dedicated template placeholder marker that's distinct from actual ADR headers.

## Code Walkthrough Highlights

### orchestrator.ts — validateFolder (lines 347-380)
- Entry validation: folder existence checked, level detected (phase parent takes precedence)
- All core checks in sequence: file existence, placeholders, template source, headers, anchors, priority tags, frontmatter basics, spec-doc structure rules (×2), sections presence (info), level declared (info), graph metadata
- **Correctness analysis**: All checks are independent (no shared mutable state between them). The FRONTMATTER_MEMORY_BLOCK rule at line 362 fires `collectKnownSessionIds()` which does filesystem traversal — the only expensive check. Ordering is reasonable (cheap checks first, expensive ones later).
- **Exit code contract**: Lines 446, 450 match ADR-003 taxonomy (0=success, 2=validation error, 3=system error, 1=user error).

### level-contract-resolver.ts — loadManifest (lines 88-100)
- Caches manifest globally (line 62). Thread-safe in single-threaded Node context.
- `resolveManifestPath()` falls back from DEFAULT to DIST path. Both paths are hardcoded relative to the module file, which is robust.
- **Edge case**: If the manifest JSON contains malformed data (non-object at `levels[level]`), `assertLevelRow()` throws. The error message is generic per `levelContractError()` — it doesn't distinguish "manifest missing" from "level row is malformed" from "document list is invalid". This is acceptable for an internal tool but could make debugging harder.

### generate-context.ts — acquireCanonicalSaveLock (lines 387-409)
- Uses directory-as-lock (mkdirSync). Atomic on most filesystems.
- Writes owner file with PID + timestamp for debugging.
- **Stale lock detection**: Checks mtime-based age > 30s (CANONICAL_SAVE_STALE_MS). Removes and reacquires if stale.
- **Edge case**: If `mkdirSync` succeeds but `writeFileSync` for owner file fails, the lock directory exists but is empty. `releaseCanonicalSaveLock` uses `rmSync(lockPath, { recursive: true, force: true })` which cleanly removes empty directories. This is safe.
- **Race condition**: Between stale-lock detection (`statSync`) and removal (`rmSync`), another process could acquire the lock. Since this is a single-process CLI tool (not a server), concurrent saves are unlikely. The stale timeout (30s) provides enough margin that two sequential saves won't collide.

### renderInlineGates (lines 108-138)
- Stack-based IF/ENDIF processor. Levels parsed from comma-separated values in `level:X,Y,Z` format.
- Fence lines inside active IF blocks are preserved. Outside inactive blocks they're omitted.
- **Correct**: The output preserves only lines where all active stack entries are true (`stack.every(Boolean)`).

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | pass | hard | All REQ items implemented | Confirmed in iteration 1 |
| checklist_evidence | pass | hard | CHK-G1 items checked | Confirmed in iteration 1 |

## Assessment
- New findings ratio: 1.00 (all findings are new in first correctness-focused iteration)
- Dimensions addressed: code-correctness
- Novelty justification: First correctness pass — F004 (dead parameter) and F005 (regex divergence) are meaningful maintainability concerns. F006 (unbounded I/O scan) is a potential performance issue. F007 (fragile ADR special case) is a minor design smell.

## Claim Adjudication

### F004 — P1 "Dead level parameter in loadManifest"
```json
{
  "findingId": "F004",
  "claim": "The `level` parameter in `loadManifest()` is unused in the normal execution path, creating a misleading API surface that suggests per-level manifest loading.",
  "evidenceRefs": ["mcp_server/lib/templates/level-contract-resolver.ts:88-100"],
  "counterevidenceSought": "Checked all callers: resolveLevelContract passes level (line 194), but loadManifest only uses it in the error throw. The cache at line 89-91 returns immediately without touching level. No per-level manifest switching logic exists in the codebase.",
  "alternativeExplanation": "Could be intentional for error context only — the level helps debug which level's contract failed. But the parameter name doesn't signal this limited role.",
  "finalSeverity": "P1",
  "confidence": 0.85,
  "downgradeTrigger": "If code documentation or a comment is added explaining the parameter is error-context-only, downgrade to P2.",
  "transitions": [{"iteration": 2, "from": null, "to": "P1", "reason": "Initial discovery"}]
}
```

### F005 — P1 "Fence tracking regex divergence"
```json
{
  "findingId": "F005",
  "claim": "renderInlineGates and stripFences use slightly different fence-detection regex patterns that are behaviorally identical but create a maintenance hazard.",
  "evidenceRefs": ["mcp_server/lib/validation/orchestrator.ts:100", "mcp_server/lib/validation/orchestrator.ts:116"],
  "counterevidenceSought": "Tested both regex patterns against common fence variants — both match ```, ~~~, indented fences, and mixed markers identically. No behavioral divergence found in testing.",
  "alternativeExplanation": "The hex escape may have been chosen for readability in a regex-heavy context, or was a result of separate implementation sessions.",
  "finalSeverity": "P2",
  "confidence": 0.90,
  "downgradeTrigger": "Downgraded from P1 to P2 during adjudication: divergence is cosmetic and confirmed behaviorally identical.",
  "transitions": [{"iteration": 2, "from": "P1", "to": "P2", "reason": "Behaviorally identical, cosmetic only. Not a correctness concern."}]
}
```

Note: After adjudication, F005 is downgraded from P1 to P2. Finding registry should reflect final P2 severity.

## Ruled Out
- **Potential race in canonical save lock**: Examined — single-process CLI, 30s stale timeout provides sufficient margin. No mutation risk in practice.
- **Phase parent strict mode double-check**: The `isPhaseParent()` call at line 352 is redundant with line 67 but not a bug — the ternary short-circuits correctly in all paths.

## Recommended Next Focus
Iteration 3: template-rendering-correctness — verify inline-gate-renderer batch mode, template-utils.sh scaffolding, create.sh integration, manifest sectionGates rendering, and snapshot test coverage.
