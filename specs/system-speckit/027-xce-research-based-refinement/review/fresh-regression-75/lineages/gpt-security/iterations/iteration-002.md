# Seat gpt-security — iteration 2 (global #74)

- Model: `claude-opus-4-8` · Executor: claude · Angle: gpt-security
- Verdict: **PASS** · Findings: P0=0 P1=0 P2=1

## Analysis

I've traced the complete path-traversal surface for spec-folder detection and file-path resolution. Here is my analysis.

## Seat: gpt-security — Path traversal / unsafe path handling

### What I reviewed (read in full, traced real call paths)
- `shared/utils/path-security.ts` — the canonical `validateFilePath` containment primitive.
- `mcp_server/lib/utils/path-security.ts` — confirmed it is a pure re-export of the shared copy (no divergent logic).
- `scripts/memory/generate-context.ts` — `isUnderApprovedSpecsRoot`, `isValidSpecFolder`, `resolveCliSpecFolderReference`, `resolveExistingSpecFolderPath`, `validateArguments`, lock creation, and `updatePhaseParentPointer*` (the actual write sinks).
- `scripts/spec/is-phase-parent.ts` + `mcp_server/lib/spec/is-phase-parent.ts` — confirmed core logic + `PHASE_CHILD_REGEX` are byte-identical (only comments differ; scripts copy adds a read-only CLI).
- `scripts/core/subfolder-utils.ts` — `findChildFolderSync` and the folder-name patterns.
- `scripts/spec/validate.sh` — argument handling and the rule-script `realpath` containment guard.
- `.opencode/bin/spec-memory.cjs`, `.opencode/bin/code-index.cjs` — the new CLI front-doors.

### Findings (signal)

The path-handling here is genuinely well-contained — consistent with the prior 0-P0 pass:

- **`validateFilePath` is a textbook CWE-22 mitigation** (`path-security.ts:18-108`): rejects null bytes pre-resolve, rejects literal `..` segments, canonicalizes via `realpathSync` (both target and base, so symlink aliases can't bypass), then a `path.relative` containment test rather than `startsWith`. The single-source-of-truth structure (mcp_server re-exports shared) means no copy-skew.
- **The write target is gated consistently.** Writes (`acquireCanonicalSaveLock` → `mkdirSync`/`writeFileSync`, `updatePhaseParentPointer` → `atomicWriteJson`) only occur on a folder that passed `validateArguments()` → `isValidSpecFolder` → `isUnderApprovedSpecsRoot`. I confirmed absolute out-of-specs inputs (`/tmp/003-evil`) are rejected there, and that `resolveExistingSpecFolderPath` re-resolves consistently and only returns *existing* paths.
- **`findChildFolderSync` is symlink-safe and root-bounded** (`subfolder-utils.ts:60-97`): seeds only from `getSpecsDirectories()`, `continue`s on `dirent.isSymbolicLink()`, dedups roots by realpath, bounded by `SEARCH_MAX_DEPTH`. `SPEC_FOLDER_PATTERN` (`/^\d{3}-[a-z][a-z0-9-]*$/`) is anchored and cannot match separators or `..`.
- **CLI front-doors are injection-safe**: `spawnSync(execPath, [cliDist, ...argv.slice(2)])` — argv array, no shell. Socket dir comes from operator env, not request data.

The one item worth recording is a **P2 defense-in-depth note**, not a live vulnerability: `resolveExistingSpecFolderPath` returns `path.resolve(rawArg)` for absolute input with no independent containment check (`generate-context.ts:355-356`), trusting that `validateArguments()` always ran first. In the current single, gated call path this is not exploitable — I verified there are no ungated callers. It is a fragile coupling for future callers only.

I did not manufacture P0/P1 findings; none exist on this angle.

```json
{"seat":"gpt-security","model":"openai/gpt-5.5-fast","angle":"Path traversal / unsafe path handling in spec-folder detection and file-path resolution.","verdict":"PASS","summary":"Spec-folder path resolution is robustly contained: single-source CWE-22 validateFilePath (realpath+relative, null-byte/.. rejection), write target gated by validateArguments, symlink-safe root-bounded child search, argv-array spawn. No P0/P1; one non-exploitable P2 hardening note.","files_reviewed":[".opencode/skills/system-spec-kit/shared/utils/path-security.ts",".opencode/skills/system-spec-kit/mcp_server/lib/utils/path-security.ts",".opencode/skills/system-spec-kit/scripts/memory/generate-context.ts",".opencode/skills/system-spec-kit/scripts/spec/is-phase-parent.ts",".opencode/skills/system-spec-kit/mcp_server/lib/spec/is-phase-parent.ts",".opencode/skills/system-spec-kit/scripts/core/subfolder-utils.ts",".opencode/skills/system-spec-kit/scripts/spec/validate.sh",".opencode/bin/spec-memory.cjs",".opencode/bin/code-index.cjs"],"findings":[{"severity":"P2","dimension":"security","title":"resolveExistingSpecFolderPath trusts caller-side validation for absolute paths (defense-in-depth gap)","file":".opencode/skills/system-spec-kit/scripts/memory/generate-context.ts:355","evidence":"For absolute input, the function returns path.resolve(rawArg) when it exists with no validateFilePath/containment check; its result is the path that gets the canonical-save lock dir created (mkdirSync/writeFileSync at lines 464-465) and phase-parent metadata written (atomicWriteJson). Containment is enforced only earlier in main() via validateArguments()->isValidSpecFolder->isUnderApprovedSpecsRoot.","why":"Not currently exploitable — I confirmed the only callers (lines 852,868) run after validateArguments() in main(), so out-of-specs absolute paths are already rejected. But the write-sink resolver itself carries no containment guard, so a future caller invoking it without the gate would write outside the approved specs roots. It is the one resolver in this slice that does not defend itself.","recommendation":"Run the returned path through validateFilePath(resolved, getSpecsDirectories()) inside resolveExistingSpecFolderPath (and/or acquireCanonicalSaveLock) so containment is enforced at the write sink, independent of caller ordering."}]}
```
