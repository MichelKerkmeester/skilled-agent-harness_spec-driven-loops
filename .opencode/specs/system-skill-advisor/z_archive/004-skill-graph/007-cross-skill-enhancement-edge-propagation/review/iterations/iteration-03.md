# Iteration 03 - Security — path traversal, JSON parse safety, write boundary

## Focus
Security — path traversal, JSON parse safety, write boundary

## Sources Read
- `.opencode/skills/system-skill-advisor/mcp_server/lib/cross-skill-edges/apply-graph-metadata-patch.ts:1-58` (write boundary, idempotence guard, JSON.parse safety)
- `.opencode/skills/system-skill-advisor/mcp_server/lib/cross-skill-edges/metadata-loader.ts:1-193` (JSON.parse error handling, enhance_when parsing, symlink-susceptible discovery)
- `.opencode/skills/system-skill-advisor/mcp_server/handlers/skill-graph/propagate-enhances.ts:1-75` (workspace-escape guard, trusted-caller check, skillsRoot resolution)
- `.opencode/skills/system-skill-advisor/mcp_server/lib/cross-skill-edges/index.ts:1-67` (apply-mode orchestration, dryRun gating)
- `.opencode/skills/system-skill-advisor/mcp_server/lib/cross-skill-edges/context-template.ts:1-146` (deterministic templating, substituteProviderName regex construction)
- `.opencode/skills/system-skill-advisor/mcp_server/lib/cross-skill-edges/types.ts:1-112` (EnhanceWhenRule weight optionality, InboundEnhanceCandidate field definitions)
- `.opencode/skills/system-skill-advisor/mcp_server/tools/skill-graph-tools.ts:1-145` (full tool registration delta + handleTool case)
- `.opencode/skills/system-skill-advisor/mcp_server/handlers/skill-graph/index.ts:1-8` (export line)
- `.opencode/skills/system-skill-advisor/mcp_server/tests/cross-skill-edges.vitest.ts:1-289` (test coverage of path-sensitive operations)
- `.opencode/skills/system-skill-advisor/graph-metadata.json:1-208` (enhance_when + auto-added edge with markers)
- `.opencode/skills/sk-prompt/graph-metadata.json:1-178` (enhance_when field)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/007-cross-skill-enhancement-edge-propagation/spec.md:1-247` (NFR-S01, REQ-007, REQ-031/CHK-031)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/007-cross-skill-enhancement-edge-propagation/plan.md:1-603` (§3 apply patch sketch, path assumptions)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/007-cross-skill-enhancement-edge-propagation/checklist.md:1-132` (CHK-030, CHK-031, CHK-032)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/007-cross-skill-enhancement-edge-propagation/implementation-summary.md:1-132` (claimed outcomes, verification table)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/007-cross-skill-enhancement-edge-propagation/review/deep-review-strategy.md:1-53` (iteration constraints)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/007-cross-skill-enhancement-edge-propagation/review/iterations/iteration-01.md:1-152` (prior findings to avoid re-reporting)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/007-cross-skill-enhancement-edge-propagation/review/iterations/iteration-02.md:1-101` (prior findings to avoid re-reporting)

## Findings

### F-03-001 [P1] No path-boundary check in `applyEnhanceEdge` — candidate.sourcePath written without workspace validation

- **Where**: `apply-graph-metadata-patch.ts:52`
- **What**: `applyEnhanceEdge` writes to `candidate.sourcePath` via `writeFile(candidate.sourcePath, ...)` with no validation that the path falls inside the intended skills root. The path originates from `discoverGraphMetadataFiles` (metadata-loader.ts:29-46), which recursively walks the directory tree using `readdirSync` with `withFileTypes: true`. On filesystems where `d_type` is `DT_UNKNOWN` (NFS, certain FUSE mounts), `Dirent.isDirectory()` falls back to `stat()` — which follows symlinks. A symlink placed under `.opencode/skills/` pointing outside the workspace would cause `discoverGraphMetadataFiles` to surface `graph-metadata.json` files outside the skills tree. Those paths are stored as `source.filePath` and flow into `candidate.sourcePath` (detect-inbound-enhances.ts:237), then into `applyEnhanceEdge` with no further boundary check. The handler's workspace guard at `propagate-enhances.ts:49` only validates the root argument, not individual discovered file paths.
- **Why it matters**: Violates NFR-S01 ("Apply mode MUST NOT write outside `.opencode/skills/*/graph-metadata.json`"). A malicious or accidental symlink in the skills directory could cause apply-mode writes to escape the intended boundary. Even on common filesystems (ext4, APFS) where `d_type` is reliable, the absence of any defense-in-depth path check is a single point of failure against filesystem-specific or future runtime behavior.
- **Evidence**:
  ```typescript
  // metadata-loader.ts:30-35 — recursive discovery follows isDirectory()
  const entries = readdirSync(currentDir, { withFileTypes: true });
  for (const entry of entries) {
    const entryPath = join(currentDir, entry.name);
    if (entry.isDirectory()) {
      stack.push(entryPath);  // symlinks→directories may pass this on some FS
  ```
  ```typescript
  // apply-graph-metadata-patch.ts:52 — no boundary check before write
  await writeFile(candidate.sourcePath, JSON.stringify(parsed, null, 2) + '\n', 'utf-8');
  ```
  ```typescript
  // propagate-enhances.ts:49 — root-only guard
  if (!skillsRoot.startsWith(cwd + '/') && skillsRoot !== cwd) {
    // only checks the root argument, not discovered child paths
  ```
- **Fix suggestion**: Add a boundary check in `applyEnhanceEdge`: resolve `candidate.sourcePath` with `realpathSync` and verify it starts with the resolved `skillsRoot`. Or defensively canonicalize all paths in `discoverGraphMetadataFiles` to detect symlink escapes during discovery. Example:
  ```typescript
  const realPath = realpathSync(candidate.sourcePath);
  if (!realPath.startsWith(options.skillsRoot + '/')) {
    return { applied: false, reason: 'path escapes skills root' };
  }
  ```
- **REQ trace**: NFR-S01, CHK-031

### F-03-002 [P2] Empty-string `skillsRoot` bypass via `??` operator — default value not applied for falsy non-null strings

- **Where**: `propagate-enhances.ts:46`
- **What**: `args.skillsRoot ?? '.opencode/skills'` uses the nullish coalescing operator (`??`), which only substitutes the default when the value is `null` or `undefined`. Passing `skillsRoot: ''` (empty string) or `skillsRoot: '.'` explicitly bypasses the default. `resolve(cwd, '')` returns `cwd`, and `resolve(cwd, '.')` also returns `cwd`. The workspace guard at line 49 (`!skillsRoot.startsWith(cwd + '/') && skillsRoot !== cwd`) evaluates to `true && false = false` when `skillsRoot === cwd`, allowing the call through. This causes `loadAllSkillMetadata` to recursively scan the entire working directory for `graph-metadata.json` files — including under `specs/`, `node_modules/`, and any other subtree containing JSON files named `graph-metadata.json`. In apply mode, this could surface and write to files far outside `.opencode/skills/`.
- **Why it matters**: While apply-mode writes require explicit candidate selection (mitigating accidental writes), the expanded scan scope is a violation of the tool's contract ("Default to .opencode/skills"). Empty-string or dot-path inputs produce results the operator did not intend.
- **Evidence**:
  ```typescript
  // propagate-enhances.ts:46
  const skillsRoot = resolve(cwd, args.skillsRoot ?? '.opencode/skills');
  // args.skillsRoot = ''  →  resolve(cwd, '')  =  cwd   (bypasses default)
  // args.skillsRoot = '.' →  resolve(cwd, '.') =  cwd   (bypasses default)
  ```
  ```typescript
  // propagate-enhances.ts:49-52 — guard evaluates to false when skillsRoot === cwd
  if (!skillsRoot.startsWith(cwd + '/') && skillsRoot !== cwd) {
    // skillsRoot === cwd → startsWith false, !== false → guard does NOT trigger
  ```
- **Fix suggestion**: Replace `??` with `||` to cover all falsy values, or add an explicit empty-string check: `const skillsRoot = resolve(cwd, args.skillsRoot || '.opencode/skills');`.
- **REQ trace**: CHK-031 (write boundary), NFR-S01

### F-03-003 [P2] `enhance_when` parsed with unsafe type assertion — malformed non-object/array silently accepted

- **Where**: `metadata-loader.ts:131`
- **What**: `parsedJson.enhance_when as SkillMetadataRecord['enhance_when']` — the TypeScript `as` cast performs no runtime validation. If `enhance_when` in the JSON is a string, number, boolean, or `null` (not covered by the `!== null` guard on literals `null`, but the JSON value `"null"` is a string and would pass), the cast succeeds and the mis-typed value is stored. Downstream in `scoreAssetShape` (detect-inbound-enhances.ts:137-138), `asArray(rules)` wraps non-array values in a single-element array, and `rule.skill_has_asset` on a non-object would be `undefined`, silently producing contribution 0 instead of a diagnostic error. This means a malformed `enhance_when: "bad_data"` produces the same behavior as `enhance_when: undefined` (no matches), but without warning the operator that their data is misconfigured.
- **Why it matters**: Violates the edge-case contract in spec.md ("Malformed source graph-metadata.json: catch JSON.parse errors per skill"). While it doesn't crash (the outer try/catch won't fire for this since `as` doesn't throw), the silent data loss means operators can ship malformed `enhance_when` rules and get zero detection candidates with no indication of the root cause. The type-level contract at `types.ts:100` (`enhance_when?: EnhanceWhenRule | EnhanceWhenRule[]`) is not enforced at runtime.
- **Evidence**:
  ```typescript
  // metadata-loader.ts:127-132
  let enhance_when: SkillMetadataRecord['enhance_when'] = undefined;
  if (parsedJson.enhance_when !== undefined && parsedJson.enhance_when !== null) {
    // No isRecord() or Array.isArray() guard — trusts JSON to match type
    enhance_when = parsedJson.enhance_when as SkillMetadataRecord['enhance_when'];
  }
  ```
  ```typescript
  // detect-inbound-enhances.ts:137-138 — asArray silently wraps non-array
  const rules = source.enhance_when ?? [];
  for (const rule of asArray(rules)) {
    // rule.skill_has_asset on non-object → undefined → no match, no diagnostic
  ```
- **Fix suggestion**: Add runtime type guard before the cast:
  ```typescript
  const rawEnhance = parsedJson.enhance_when;
  if (rawEnhance !== undefined && rawEnhance !== null) {
    if (isRecord(rawEnhance) || (Array.isArray(rawEnhance) && rawEnhance.every(r => isRecord(r)))) {
      enhance_when = rawEnhance as SkillMetadataRecord['enhance_when'];
    } else {
      console.warn(`[cross-skill-edges] ${sourcePath}: enhance_when is not an object or array of objects — ignoring`);
    }
  }
  ```
- **REQ trace**: REQ-007 (schema-additive tolerance)

### F-03-004 [P2] Unescaped skill-ID injection in `substituteProviderName` regex construction

- **Where**: `context-template.ts:79`
- **What**: `new RegExp('\\b${peerId}\\b', 'g')` interpolates raw `peerId` values (from `familyEdges[].target`) into a regex pattern without escaping regex-special characters. If a skill ID contained `.`, `*`, `+`, `?`, `[`, `]`, `(`, `)`, `{`, `}`, `^`, `$`, `|`, or `\`, the regex would match unintended substrings in the context string, producing garbled output.
- **Why it matters**: Currently no skill IDs in the codebase contain regex metacharacters (all use `[a-z0-9-]+`), so practical exploitability is zero. However, the substitution produces auto-marker context strings that are written into `graph-metadata.json` (`applyEnhanceEdge` at line 44 writes `candidate.context`). A future skill with a metacharacter in its ID (e.g., `my.skill`) would produce silently incorrect context strings. This is a defense-in-depth gap: data originating from `graph-metadata.json` on disk is treated as trusted regex input without sanitization.
- **Evidence**:
  ```typescript
  // context-template.ts:75-82
  function substituteProviderName(context: string, peerIds: string[], targetSkillId: string): string {
    let result = context;
    for (const peerId of peerIds) {
      // peerId "cli.codex" → regex /\bcli.codex\b/g → "." matches any char
      result = result.replace(new RegExp(`\\b${peerId}\\b`, 'g'), targetSkillId);
    }
    return result;
  }
  ```
  ```typescript
  // context-template.ts:132-134 — peerIds come from graph-metadata.json edges
  const peerIds = familyEdges.map(e => e.target);
  context = substituteProviderName(exemplar.context, peerIds, target.skillId);
  ```
- **Fix suggestion**: Escape regex metacharacters before interpolation:
  ```typescript
  const escaped = peerId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`\\b${escaped}\\b`, 'g');
  ```
- **REQ trace**: REQ-012 (deterministic context inference — "Never an LLM call at runtime" satisfied, but output correctness not fully guarded)

## Non-Findings (Verified as PASS)

### CHK-030 — No hardcoded secrets
- **Status**: PASS
- Scanned all 12 new/modified files (6 `lib/cross-skill-edges/*.ts`, `propagate-enhances.ts`, `skill-graph-tools.ts`, `handlers/index.ts`, `cross-skill-edges.vitest.ts`, `sk-prompt/graph-metadata.json`, `system-skill-advisor/graph-metadata.json`). No API keys, tokens, passwords, credentials, or sensitive configuration found. All imports are standard Node.js built-ins (`node:crypto`, `node:fs`, `node:path`, `node:fs/promises`) or internal project modules.

### CHK-031 Write boundary — path traversal guard analysis
- **Status**: PARTIAL PASS
- The handler's workspace-escape guard (`propagate-enhances.ts:49`) correctly rejects paths outside `cwd`. `resolve()` normalizes relative paths before the guard. However, the guard only validates `skillsRoot` — individual discovered file paths are not validated before writes. F-03-001 and F-03-002 document concrete gaps.
- The handler requires trusted caller authentication (line 40-43), which gates all tool invocations including apply mode. This is a compensating control: unauthenticated callers cannot reach the write path.
- The `dryRun` default is `true` in the tool spec (`skill-graph-tools.ts:80`), meaning apply-mode calls require an explicit `dryRun: false` opt-out before any writes occur.

### CHK-032 — No LLM calls at runtime
- **Status**: PASS
- Confirmed: `context-template.ts` uses only deterministic templating (`substituteTemplate` with string replacement, `substituteProviderName` with regex replacement). No HTTP requests, no LLM SDK imports, no external process calls.

### REQ-007 — Schema-additive enhance_when
- **Status**: PASS (with caveat F-03-003)
- Existing parsers tolerate the new `enhance_when` field. `metadata-loader.ts` treats it as optional (line 128: `if (parsedJson.enhance_when !== undefined && ...)`), so files without it produce `enhance_when: undefined`. Files with it parse without errors. The `schema_version` check at line 97-99 requires exactly 1 or 2, and both existing files remain at version 2. No version bump needed.
- Caveat: malformed `enhance_when` values (non-object, non-array) are silently accepted rather than diagnosed (F-03-003), but this does not cause parser failure — downstream code handles them gracefully.

### JSON.parse failure handling in metadata-loader.ts
- **Status**: PASS
- `parseSkillMetadata` (metadata-loader.ts:78-153) wraps all parsing in try/catch. Line 81: `JSON.parse(content)` — any `SyntaxError` is caught. Line 148-152: catch block logs via `console.warn` and returns `null`. Line 163-175: `loadAllSkillMetadata` filters out `null` results. Malformed files are skipped without crashing the loader or affecting other skills. Matches the documented edge case: "catch JSON.parse errors per skill; continue with remaining skills."

### JSON.parse failure handling in apply-graph-metadata-patch.ts
- **Status**: PASS
- `applyEnhanceEdge` (apply-graph-metadata-patch.ts:23-25) reads and parses the target file. Line 54-56: catch block catches parse errors and returns `{ applied: false, reason: 'failed to apply edge: ...' }`. The file is not corrupted. Index.ts lines 60-62 route this into `result.errors`.

## New Info Ratio
4 new weighted findings this iteration. All 4 are novel — no overlap with iteration 01 (correctness/scoring) or iteration 02 (idempotence/hash/edge filter). **newInfoRatio: 1.00**.

New weighted findings this iteration: 4. Any weighted findings considered: 4.

## Quality Gates
- **Evidence**: pass — every finding cites file:line with quoted code and surrounding context; adversarial self-check verified all claims against actual source
- **Scope**: pass — all 12 files in the review scope were read and analyzed; plan.md consulted for design intent; spec.md consulted for NFR and REQ contracts
- **Coverage**: D2 (Security) — path traversal analysis (handler guard + discovery + apply boundary), JSON parse resilience (loader + patcher), secret audit (all new files), template injection (substituteTemplate + substituteProviderName), empty-string bypass, unsafe type assertions

## Convergence Signal
not-converged — this is the first security-focused iteration. 4 P2 findings (0 P0, 1 P1) reflect implementation gaps in defense-in-depth rather than exploitable vulnerabilities. The core security properties (trusted caller gating, dryRun default, no LLM calls, JSON error handling) are sound. Remaining uncovered dimensions: D3 (Traceability — REQ-to-code mapping, checklist evidence audit) and D4 (Maintainability — naming, dead code, error clarity, function-level JSDoc). Recommend iteration 04 cover D3.
