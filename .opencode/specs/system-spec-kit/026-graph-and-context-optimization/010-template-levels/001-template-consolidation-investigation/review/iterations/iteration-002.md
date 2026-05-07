# Iteration 002: code-correctness

## Dispatcher
Dimension `code-correctness` — focused on logic errors, error-handling defects, edge cases, exit code handling, and determinism of `inline-gate-renderer.ts`.

## Files Reviewed
- `.opencode/skills/system-spec-kit/scripts/spec/create.sh` (full, 1708 lines)
- `.opencode/skills/system-spec-kit/scripts/lib/template-utils.sh` (281 lines)
- `.opencode/skills/system-spec-kit/scripts/utils/template-structure.js` (877 lines)
- `.opencode/skills/system-spec-kit/scripts/templates/inline-gate-renderer.ts` (297 lines)
- `.opencode/skills/system-spec-kit/scripts/templates/inline-gate-renderer.sh` (14 lines)
- `.opencode/skills/system-spec-kit/mcp_server/lib/templates/level-contract-resolver.ts` (235 lines)
- `.opencode/skills/system-spec-kit/templates/manifest/spec-kit-docs.json` (709 lines)

## Findings - New

### P1 Findings

1. **`copy_templates_batch` silently returns success on renderer failure** — [SOURCE: template-utils.sh:147-149] — The function uses `if ! "$renderer" ...; then return $?` to check the renderer exit status. In Bash, the `!` operator flips the exit code: when the renderer exits non-zero, `!` converts it to 0, so `$?` inside the `then` block is 0 (not the renderer's actual failure code). The function returns 0 to its caller, which interprets this as success. In `create.sh` line 1527, this means `batch_created_files` is empty but no error is raised, producing an incomplete spec folder with no indication of failure.

   **Finding class:** `class-of-bug`
   **Scope proof:** `copy_templates_batch` defined at template-utils.sh:113-159; called from create.sh:1527 inside `$(...) || { echo error; exit 3; }`; `||` guard never triggers when function returns 0 on failure.
   **Affected surface hints:** `create.sh` normal-mode scaffold (line 1527), spec folder creation path.

   ```json
   {
     "type": "claim-adjudication",
     "claim": "copy_templates_batch returns 0 when inline-gate-renderer fails",
     "evidenceRefs": ["template-utils.sh:147-149", "bash documentation: ! operator flips exit code"],
     "counterevidenceSought": "Verified Bash 3.2+ (macOS) and Bash 5.x behavior: `if ! false; then echo $?; fi` prints 0. Confirmed $? after !cmd is always 0 when cmd fails.",
     "alternativeExplanation": "None — this is a well-known Bash pitfall and the code pattern is unambiguous.",
     "finalSeverity": "P1",
     "confidence": "high",
     "downgradeTrigger": null
   }
   ```

2. **`create_graph_metadata_file` JSON injection via unescaped user input** — [SOURCE: create.sh:449] — The `causal_summary` field uses `${summary_text//\"/\\\"}` which only escapes double-quotes. Backslashes and newlines in user-provided `$FEATURE_DESCRIPTION` (from line 312) are not escaped, producing invalid JSON in `graph-metadata.json`. Example: a feature description containing `test\path` would produce `"causal_summary": "test\path"` with an unescaped backslash. Newlines would produce literal newlines inside the JSON string.

   **Finding class:** `class-of-bug`
   **Scope proof:** `create_graph_metadata_file` function at create.sh:385-458; `summary_text` derived from `$FEATURE_DESCRIPTION` (user argument, line 312-316); heredoc at line 430-457 writes directly to JSON without proper escaping.
   **Affected surface hints:** `graph-metadata.json` generation, validate.sh JSON parsing, memory indexing.

   ```json
   {
     "type": "claim-adjudication",
     "claim": "User-provided text containing backslashes or newlines produces invalid JSON in graph-metadata.json",
     "evidenceRefs": ["create.sh:449", "create.sh:312-316", "create.sh:430-457"],
     "counterevidenceSought": "Checked all callers: summary_text always flows from user input (FEATURE_DESCRIPTION or topic name). No sanitization step exists between input and JSON output.",
     "alternativeExplanation": "Could be mitigated if bash heredoc with <<EOF handles special chars, but bash only expands variables in double-quoted heredocs — it does NOT JSON-escape the expanded content.",
     "finalSeverity": "P1",
     "confidence": "high",
     "downgradeTrigger": null
   }
   ```

3. **`getManifestPath` in template-structure.js lacks path fallback** — [SOURCE: template-structure.js:128-130] — `getManifestPath` hardcodes `path.join(templatesRoot, 'manifest', 'spec-kit-docs.json')`. In contrast, `level-contract-resolver.ts` (lines 78-86) implements a `resolveManifestPath` function that checks both `DEFAULT_MANIFEST_PATH` and `DIST_MANIFEST_PATH` as fallbacks. If a CLI caller uses `template-structure.js` from a context where the manifest is at the alternate path (e.g., built/compiled output directory), the tool fails with a cryptic error instead of falling back.

   **Finding class:** `class-of-bug`
   **Scope proof:** `getManifestPath` at template-structure.js:128-130; called by `loadLevelContract` (line 134) and `resolveTemplatePath` (line 317); `level-contract-resolver.ts` counterpart at line 78-86 shows the intended fallback pattern.
   **Affected surface hints:** `template-structure.js` CLI (line 820-857), `compareDocumentToTemplate` (line 727), validator pipeline.

   ```json
   {
     "type": "claim-adjudication",
     "claim": "template-structure.js getManifestPath diverges from level-contract-resolver.ts fallback pattern",
     "evidenceRefs": ["template-structure.js:128-130", "level-contract-resolver.ts:58-59", "level-contract-resolver.ts:78-86"],
     "counterevidenceSought": "Verified that template-structure.js has no fallback logic for manifest path resolution — a single path.join call. Confirmed level-contract-resolver.ts uses two-path fallback.",
     "alternativeExplanation": "Could be intentional if template-structure.js only runs from source tree where DEFAULT path always works, but this creates a silent divergence risk that would surface only in edge cases (e.g., after a build step).",
     "finalSeverity": "P1",
     "confidence": "medium",
     "downgradeTrigger": "Downgrade to P2 if template-structure.js is never invoked from a dist/ or compiled context."
   }
   ```

### P2 Findings

1. **`get_level_templates_dir` returns paths to non-existent directories** — [SOURCE: template-utils.sh:37-47] — The function returns `base_dir/level_1`, `base_dir/level_2`, `base_dir/level_3`, `base_dir/level_3+` — none of which exist in the current manifest-based template architecture. The function is defined but no active callers were found in the code paths reviewed. If resurrected by a future caller, it would produce paths to non-existent directories, causing downstream `copy_template` to fail with "required template document missing."

   **Finding class:** `dead-code-risk`
   **Scope proof:** `get_level_templates_dir` at template-utils.sh:37-47; verified no callers in create.sh, template-utils.sh copy_template (uses _manifest_template_path), or the resolver chain.
   **Affected surface hints:** Any future script that sources template-utils.sh and calls `get_level_templates_dir`.

2. **Misleading `SKILL_ROOT` variable in `inline-gate-renderer.sh`** — [SOURCE: inline-gate-renderer.sh:10] — The variable is named `SKILL_ROOT` but resolves to `scripts/` (one `..` from `scripts/templates/`), not the actual skill root. The actual skill root is `../../` from `scripts/templates/`. The script works because `node_modules/tsx` exists at `scripts/node_modules/` (verified), but the variable name suggests a different semantics. A future refactor that rearranges node_modules could silently break this.

   **Finding class:** `maintainability`
   **Scope proof:** inline-gate-renderer.sh:9-10; verified `scripts/node_modules/tsx/dist/loader.mjs` EXISTS at filesystem level; `skill-root-level node_modules/tsx` does NOT exist.
   **Affected surface hints:** `copy_template` (template-utils.sh:92-94) which calls this wrapper; any path-sensitive refactor of the scripts directory.

3. **Stale CORE+ADDENDUM architecture comment in `create.sh` header** — [SOURCE: create.sh:7-18] — The header describes "TEMPLATE ARCHITECTURE (v2.0 - CORE + ADDENDUM)" with `level_1/`, `level_2/`, `level_3/`, `level_3+/` directories. The actual implementation uses `templates/manifest/*.tmpl` files with a JSON manifest. This header comment is misleading for anyone reading the script to understand its behavior.

   **Finding class:** `documentation`
   **Scope proof:** create.sh:7-18 vs actual template resolution at create.sh:1502-1535 (uses manifest-backed resolver, not level directories).
   **Affected surface hints:** Developer onboarding, maintenance.

## Traceability Checks
- **Determinism of `inline-gate-renderer.ts`**: CONFIRMED. `renderInlineGates()` is a pure function — same template + same level → identical output every time. No randomness, no I/O, no external state. The state machine (stack, isInFence, pendingInactiveGateBoundary) is fully reset per call.
- **Exit code propagation**: PARTIAL. `copy_template` (template-utils.sh:92-100) correctly captures renderer exit codes using `if cmd; then :; else local rc=$?; ... return $rc`. However, `copy_templates_batch` (line 147-149) uses flawed `if ! cmd; then return $?` pattern — see P1-001.
- **`set -euo pipefail` consistency**: VERIFIED. `create.sh` line 22 enables strict mode. All non-trivial commands are tested with `if`, `||`, or `&&` patterns that suppress `set -e` where intended. No unsafe unchecked commands were found outside the sharded template warning paths (lines 1570-1585), which correctly use `>`&2 echo for warnings without `exit`.

## Integration Evidence
- `inline-gate-renderer.sh` (shell wrapper) → `inline-gate-renderer.ts` (Node.js renderer): Path resolution at line 10 is semantically misaligned (P2-002) but functionally correct due to existing `scripts/node_modules/` layout.
- `create.sh` → `template-utils.sh` (copy_templates_batch, copy_template, resolve_level_contract, level_contract_docs_from_json): Integration chain verified; subfolder mode uses `copy_template` (correct error handling), normal mode uses `copy_templates_batch` (P1-001).
- `level-contract-resolver.ts` → `spec-kit-docs.json`: Manifest loading verified (lines 57-100); caching works correctly; fallback path resolution (lines 78-86) is more robust than `template-structure.js` counterpart (P1-003).

## Edge Cases
- **Ambiguity**: The `copy_templates_batch` bug at P1-001 may not surface in practice if the renderer never fails during normal operations. The error would only manifest during edge cases like corrupted template files, missing tsx loader, or OOM conditions. The severity remains P1 because the error-swallowing pattern is structurally wrong regardless of current test coverage.
- **Contradiction**: `template-structure.js` `getManifestPath` (line 128-130) diverges from `level-contract-resolver.ts` `resolveManifestPath` (lines 78-86). Both resolve the same manifest but use different resolution strategies. Recorded as P1-003 with medium confidence due to uncertainty about whether template-structure.js ever runs from a dist context.
- **Partial success**: The `isInFence` toggle in `inline-gate-renderer.ts` (line 198) correctly identifies open/close fences and skips gate parsing inside fenced blocks. Gate markers inside code examples are treated as literal content — this is correct behavior. Documented for completeness.

## Confirmed-Clean Surfaces
- **`inline-gate-renderer.ts` gate expression parser** (lines 92-176): The recursive descent parser correctly handles AND/OR/NOT precedence, parenthesized groups, and tokenization of level values. Trailing commas are correctly handled (line 118-119). Leading commas correctly produce parse errors.
- **`create.sh` argument parsing** (lines 54-310): All flag validation guards (missing values, invalid values, mutual exclusivity checks at lines 318-328) are correct and consistent.
- **`level-contract-resolver.ts` manifest caching** (lines 88-100): Single-cache pattern is safe for the single-threaded Node.js context. No stale-cache edge cases.
- **`spec-kit-docs.json`** schema integrity (lines 1-709): All level entries have consistent `requiredCoreDocs`, `requiredAddonDocs`, `sectionGates` structure. No level has empty requiredCoreDocs (assertion at `level-contract-resolver.ts:109-111`).

## Ruled Out
- **`DOC_LEVEL` type coercion**: `DOC_LEVEL` defaults to `1` (number, line 33) and is passed through `resolve_level_contract` (line 1504) which converts to string via `normalizeLevel`. Pattern verified safe.
- **`copy_template` error propagation**: The `if cmd; then :; else ...` pattern at lines 92-100 correctly captures renderer exit codes. Ruled out as a bug source.
- **`inline-gate-renderer.sh` runtime failure**: Verified `scripts/node_modules/tsx/dist/loader.mjs` exists — the wrapper works despite the misnamed SKILL_ROOT variable.
- **Gate expression determinism**: `evaluateGateExpression` is pure. Inputs (`expression` string + `level` enum) produce identical boolean results on repeated calls. No hidden state.

## Next Focus
- **Dimension**: template-rendering-correctness
- **Focus Area**: Verify manifest `.tmpl` files produce correct output for each level (1/2/3/3+/phase). Check ANCHOR tag preservation through inline-gate-renderer processing. Verify `copy_templates_batch` output ordering and `copy_template` fallback logic.
- **Reason**: P1-001 found in `copy_templates_batch` — must verify the rendering output is actually correct for all levels, especially since error handling is compromised.
- **Required Evidence**: Render each .tmpl file through inline-gate-renderer for all supported levels; diff level-specific output; verify ANCHOR tags survive rendering.
- **Recovery Note**: Target `templates/manifest/*.tmpl` files; test with level `1`, `2`, `3`, `3+`, and `phase`.

## Summary
- **Budget profile**: `verify` (13 calls used)
- **Total findings**: 5 (P1=3, P2=2, P0=0)
- **Focus**: code-correctness — logic bugs, error handling, determinism
- **Key finding**: `copy_templates_batch` silently swallows renderer failures (P1-001) due to Bash `!` operator flipping exit code
- **Determinism**: `inline-gate-renderer.ts` confirmed deterministic
- **Clean**: Gate expression parser, argument validation, manifest schema integrity
