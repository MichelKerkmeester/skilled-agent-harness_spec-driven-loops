# Iteration 4 — Security: Dispatch Surface (cli-opencode + Stop hook + spec_folder authority)

## Dispatcher
- **Run**: 4 of 10
- **Mode**: review
- **Dimension**: security
- **Focus**: dispatch surface — cli-opencode `--dangerously-skip-permissions` semantics, Stop hook NODE_ENV gating, workflow-resolved spec_folder authority, prompt-injection paths, self-invocation guard
- **Budget profile**: scan (target 9, soft max 12, hard max 13)
- **Tool calls used**: 9
- **Status**: complete

## Files Reviewed
- `.opencode/commands/speckit/assets/speckit_deep-review_auto.yaml` (lines 1-120, 650-820)
- `.opencode/skills/system-spec-kit/shared/review-research-paths.cjs` (full, 291 lines)
- `.claude/settings.local.json` (full, 81 lines)
- `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts` (lines 1-80)
- `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts` (full, 170 lines)
- `.opencode/skills/system-spec-kit/mcp_server/matrix_runners/adapter-cli-opencode.ts` (full, 36 lines)
- `.opencode/skills/cli-opencode/SKILL.md` (lines 1-100)

## A-E Verdict Summary

| ID | Focus area                                                            | Verdict   | Evidence anchor                                                                                  |
|----|-----------------------------------------------------------------------|-----------|--------------------------------------------------------------------------------------------------|
| A  | cli-opencode `--dangerously-skip-permissions` + `--dir {repo_root}`   | **DEFECT (subsumed by P1-028)** | `spec_kit_deep-review_auto.yaml:787-788`; sandboxMode wiring divergence already P1               |
| B  | Stop hook env-override gating (NODE_ENV='test')                       | **PASS**  | `session-stop.ts:43-44` — gating in effect per "packet 097/P1-006 + 098/004"                     |
| C  | Workflow-resolved spec_folder authority — path traversal              | **DEFECT (NEW P1-029)** | `review-research-paths.cjs:200-214`; probe confirms `..` escapes project root |
| D  | Prompt-injection escape via `$(cat 'PROMPT_PATH')`                    | **PASS** with caveat | Shell `$(...)` does not re-evaluate file contents; agent tool-call boundary is downstream concern |
| E  | cli-opencode self-invocation guard (runtime enforcement)              | **DEFECT (NEW P2-031)** | cli-opencode SKILL.md:54-96 documents 3-layer detection but enforcement is convention-only       |

## Findings — New

### P0 Findings
None.

### P1 Findings

1. **Path traversal in `resolveArtifactRoot` — `..` segments escape project root** — `.opencode/skills/system-spec-kit/shared/review-research-paths.cjs:210`
   - **Description**: The metacharacter rejection regex at line 210 (`/['"`$;|&<>\\]/.test(specFolder)`) blocks shell metacharacters (P1-019 from 099 was correctly resolved here) but does NOT block `..` path-traversal segments. `path.resolve()` on line 216 then happily expands them. Direct probe with input `.opencode/specs/../../../tmp/evil` resolved to `/Users/michelkerkmeester/MEGA/Development/Code_Environment/tmp/evil/review` — outside the project root. Combined with the cli-opencode branch's `--dangerously-skip-permissions` and the workflow's claim that this resolver is "the single source of truth for rejecting empty/unresolved/template/whitespace-only/string-coerced empty values" (`spec_kit_deep-review_auto.yaml:696-701`), this represents a write-authority escape on any dispatch path that accepts an externally-supplied `{spec_folder}`. The Gate-3 spec folder question is documentation-level, not enforcement-level — the resolver is the runtime gate.
   - **Recommendation**: Add `path.resolve(specFolder)` containment check against the project root. If `resolved.startsWith(repoRoot)` is false, throw. Equivalent: reject any input containing `..` segments before resolution. Pattern: `if (specFolder.split(/[/\\]/).includes('..')) throw ...`.
   - **Finding class**: cross-consumer
   - **Scope proof**: All 4 deep-* YAML files (lines 118 in deep-review_auto, deep-research_auto, deep-research_confirm, deep-review_confirm) call `resolveArtifactRoot('{spec_folder}', mode)` as the canonical write-authority resolver; no upstream caller wraps with containment check.
   - **Affected surface hints**: `review-research-paths.cjs:200-284`, `spec_kit_deep-research_auto.yaml:129`, `spec_kit_deep-research_confirm.yaml:113`, `spec_kit_deep-review_auto.yaml:118`, `spec_kit_deep-review_confirm.yaml:118`

```json
{
  "id": "P1-029",
  "type": "claim",
  "claim": "resolveArtifactRoot accepts path-traversal segments (e.g. '..') and resolves them to a path outside the project root, breaking the workflow's stated write-authority contract",
  "evidenceRefs": [
    "review-research-paths.cjs:210 (metacharacter regex; no .. check)",
    "review-research-paths.cjs:216 (path.resolve() expands .. blindly)",
    "spec_kit_deep-review_auto.yaml:696-701 (workflow comment claims helper is single source of truth)",
    "in-process probe iteration 4: input '.opencode/specs/../../../tmp/evil' → output '/Users/michelkerkmeester/MEGA/Development/Code_Environment/tmp/evil/review'"
  ],
  "counterevidenceSought": "Is there an upstream containment check in any of the 4 YAML files or in the workflow harness? Result: grep for 'startsWith.*repo_root|containment|projectRoot' in spec_kit/assets returns nothing relevant. Gate-3 prompt is documentation-level. Helper is the runtime gate.",
  "alternativeExplanation": "Could be intentional (operator runs across repo boundaries via .. for cross-repo dispatch). Refuted: no docstring or comment indicates this; line 200-214 P1-019 docstring framing is purely defensive against shell-injection.",
  "finalSeverity": "P1",
  "confidence": "high",
  "downgradeTrigger": "If a maintainer documents an explicit cross-boundary use case where .. is intentional, downgrade to P2 with required containment check still recommended."
}
```

### P2 Findings

1. **Whitespace-only specFolder accepted by `resolveArtifactRoot`** — `.opencode/skills/system-spec-kit/shared/review-research-paths.cjs:207-209`
   - **Description**: The non-empty string check `specFolder.length === 0` rejects `''` but accepts `'   '` (3 spaces). Probe confirms input `'   '` produces artifactDir `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/   /review`. The workflow then creates a literal `   ` directory at the repo root with state files inside. Not a privilege-escalation surface, but creates malformed artifacts that look legitimate at a glance and pollute the workspace. The `normalizeSpecFolderReference` helper (line 60) DOES `.trim()`, so the rejection logic at line 207 is inconsistent with the normalization elsewhere.
   - **Recommendation**: Change `specFolder.length === 0` to `specFolder.trim().length === 0`, or add explicit `.trim()` before the regex check at line 210. Match the normalization pattern at line 60.
   - **Finding class**: instance-only
   - **Scope proof**: Direct probe (single-line input); `normalizeSpecFolderReference` at line 60 already uses `.trim()` so the inconsistency is local to `resolveArtifactRoot`.
   - **Affected surface hints**: `review-research-paths.cjs:207-209`

```json
{
  "id": "P2-029",
  "type": "claim",
  "claim": "resolveArtifactRoot accepts whitespace-only specFolder and produces literal-whitespace directory paths",
  "evidenceRefs": [
    "review-research-paths.cjs:207-208 (length === 0 check, no trim)",
    "review-research-paths.cjs:60 (sibling helper does .trim() — inconsistent)",
    "in-process probe: input '   ' → artifactDir 'Public/   /review'"
  ],
  "counterevidenceSought": "None — direct probe is conclusive; sibling helper inconsistency is independent confirmation.",
  "alternativeExplanation": "Could be intentional sentinel for testing. Refuted: no test fixtures or comments indicate this.",
  "finalSeverity": "P2",
  "confidence": "high",
  "downgradeTrigger": "n/a — already lowest active severity for this class"
}
```

2. **cli-opencode self-invocation guard is convention-only on dispatch path** — `.opencode/skills/cli-opencode/SKILL.md:54-96`; runtime not enforced at `.opencode/commands/speckit/assets/speckit_deep-review_auto.yaml:781-802`
   - **Description**: The cli-opencode SKILL.md §Self-Invocation Guard documents a 3-layer detection (env var lookup, process ancestry, state-lock probe) at lines 54-96. YAML branch line 802 acknowledges "the cli-opencode skill SKILL.md §SELF-INVOCATION PROHIBITED contract is the authoritative gate." However, **no runtime check exists on the dispatch path**. The YAML invokes `opencode run ...` directly without any preflight guard against $OPENCODE_CONFIG_DIR / OPENCODE_* env vars or process ancestry. If a maintainer dispatches `/speckit:deep-review:auto` from inside an OpenCode session with executor=cli-opencode, the workflow will spawn a child opencode process. The skill-level guard fires only if the calling AI loads cli-opencode SKILL.md (advisor-driven), not at workflow dispatch.
   - **Recommendation**: Add a pre-dispatch check inside the `if_cli_opencode` branch: `if [ -n "$OPENCODE_CONFIG_DIR" ] || env | grep -q '^OPENCODE_'; then echo "ERROR: self-invocation refused" >&2; exit 1; fi`. Or equivalently call `runtimeCapabilityResolver` for opencode detection.
   - **Finding class**: cross-consumer
   - **Scope proof**: All 4 deep-* YAML files have `if_cli_opencode` branches (lines 781-802 in deep-review_auto, plus deep-review_confirm:if_cli_opencode, deep-research_auto:if_cli_opencode, deep-research_confirm:if_cli_opencode). None contain runtime self-invocation detection.
   - **Affected surface hints**: `spec_kit_deep-review_auto.yaml:781-802`, sibling 3 YAMLs, `cli-opencode/SKILL.md:54-96`

```json
{
  "id": "P2-031",
  "type": "claim",
  "claim": "cli-opencode self-invocation guard is convention-only via SKILL.md and not runtime-enforced at YAML dispatch path",
  "evidenceRefs": [
    "cli-opencode/SKILL.md:54-96 (3-layer detection in skill body)",
    "spec_kit_deep-review_auto.yaml:781-802 (no preflight env/ancestry check)",
    "spec_kit_deep-review_auto.yaml:802 (note delegating to skill content)"
  ],
  "counterevidenceSought": "Is there a runtimeCapabilityResolver call that detects opencode? Grep at .opencode/commands/speckit/assets/speckit_deep-review_auto.yaml shows runtimeCapabilityResolver only referenced in config (line not in command surface). No opencode-specific guard found in YAML.",
  "alternativeExplanation": "Could be intentional — operator-trusted dispatch surface. Acceptable for P2; P1 would require evidence of actual cycle harm (token burn, runaway loop). No such evidence at this iteration.",
  "finalSeverity": "P2",
  "confidence": "medium",
  "downgradeTrigger": "If a maintainer documents that workflow-level self-invocation is acceptable (e.g., parallel detached use case), the finding remains advisory but the contract should be made explicit in YAML notes."
}
```

## Traceability Checks

| Protocol            | Status   | Notes                                                                                                                          |
|---------------------|----------|--------------------------------------------------------------------------------------------------------------------------------|
| spec_code           | partial  | resolveArtifactRoot docstring at line 200-214 claims P1-019 is resolved; partial — shell-meta yes, traversal no.               |
| checklist_evidence  | pass     | 098/004 NODE_ENV gating verified at session-stop.ts:43-44 with explicit packet citation in code comment                        |
| runtime_parity      | pass     | Stop hook is single-runtime (.claude/settings.local.json:67-79 → dist/hooks/claude/session-stop.js); no mirror drift surface   |

## Integration Evidence

```json
{
  "yamlBranches": {
    "cli_opencode_dispatch": "spec_kit_deep-review_auto.yaml:781-802",
    "cli_copilot_authority_guard_claim": "spec_kit_deep-review_auto.yaml:684-746",
    "spec_folder_resolver_call": "spec_kit_deep-review_auto.yaml:118"
  },
  "stopHookGate": {
    "settingsRegistration": ".claude/settings.local.json:67-79",
    "compiledTarget": ".opencode/skills/system-spec-kit/mcp_server/dist/hooks/claude/session-stop.js (507 lines)",
    "sourceGate": ".opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:43-44 (NODE_ENV='test' || SPECKIT_TEST='true')"
  },
  "resolverContract": {
    "shellMetaCheck": "review-research-paths.cjs:210",
    "pathResolveCall": "review-research-paths.cjs:216",
    "missingTraversalCheck": "review-research-paths.cjs:200-214 (P1-029)",
    "missingTrim": "review-research-paths.cjs:207 (P2-029)"
  },
  "dispatchAuthority": {
    "copilotBranchClaim": "buildCopilotPromptArg referenced at spec_kit_deep-review_auto.yaml:690 + 714",
    "copilotBranchImpl": "lib/deep-loop/executor-config.ts: NOT FOUND (full-codebase grep returns 0 hits in TS/JS)",
    "copilotBranchOnlyDocs": "lib/deep-loop/README.md:64 only",
    "openCodeBranchAuthority": "NONE — direct cat substitution + --dangerously-skip-permissions + --dir {repo_root}"
  },
  "selfInvocationGuard": {
    "skillLevel": "cli-opencode/SKILL.md:54-96 (3-layer detection: env, ancestry, lockfile)",
    "yamlLevel": "NONE — note at line 802 delegates to skill"
  }
}
```

## Edge Cases

- **Ambiguity**: cli-opencode `--dangerously-skip-permissions` is unconditionally hardcoded (line 787); from the security angle this overlaps with P1-028 (sandboxMode wiring divergence — correctness angle). Recorded as A-DEFECT subsumed_by P1-028 to avoid double-counting.
- **Counterevidence search**: For P1-029, searched 4 YAML files and 1 resolver source for any upstream containment check. Result: `findAncestorSpecFolder` (line 87) walks UP the tree looking for an ancestor `spec.md`, but does not enforce that the input is INSIDE the project tree. Confirmed no upstream containment.
- **Missing dependency**: `buildCopilotPromptArg` referenced in YAML (line 690) and README (line 64) but no implementation found in the codebase. **OUT OF SCOPE for cli-opencode security focus** — flagged in `ruledOut` as `deferred_to_separate_review`. This may be a P0/P1 against a different surface (Copilot dispatch) and is the surface @deep-research / @deep-review run should investigate next.
- **Partial success**: 5 of 5 in-process probes ran cleanly (4 rejections + 1 traversal-accept). No tool-call failures. Budget under target (9 of 12).

## Confirmed-Clean Surfaces

- **Stop hook NODE_ENV gating** (B): session-stop.ts:43-44 — `NODE_ENV === 'test' || SPECKIT_TEST === 'true'` gate is in effect. Comment at line 39-42 explicitly cites "packet 097/P1-006 + 098/004" lineage. PASS.
- **Shell-injection regex in resolveArtifactRoot** (P1-019 from 099): line 210 rejects `'`, `"`, `` ` ``, `$`, `;`, `|`, `&`, `<`, `>`, `\`. 5 of 5 metacharacter probes correctly REJECTED. PASS.
- **Empty-string specFolder rejection**: line 207 rejects `''`. PASS.
- **Prompt-injection via `$(cat 'PROMPT_PATH')` shell substitution** (D): shell `$(...)` reads file content as a literal string and passes it as a single arg to opencode; the contents are not re-evaluated. Prompt-injection escape via shell-layer NOT possible. (Tool-call escape via opencode itself processing hostile prompt content is downstream; not a YAML-dispatch-layer defect.)

## Ruled Out

- **`buildCopilotPromptArg` missing implementation**: full-codebase grep (`find . -type f -name '*.ts' -o -name '*.js'` + xargs grep) returns ZERO hits for the function name in source code. The YAML imports it at line 690 from `executor-config.ts`, but `executor-config.ts` (170 lines, fully read) has no such export. README.md at line 64 documents it but no implementation. Disposition: `deferred_to_separate_review`. **Reasoning**: out of scope for the dispatch-surface focus on cli-opencode (A-E). The Copilot branch is a separate executor surface with its own claimed authority guard. If this finding is accurate, it would be P0/P1 against the Copilot dispatch path — recommend a dedicated iteration to verify the missing implementation before Copilot dispatch is exercised in production.
- **`--dir {repo_root}` substitution path-injection**: `{repo_root}` is workflow-engine-controlled (project root), not user-controlled. No injection surface at this anchor. Disposition: `ruled_out_at_security_granularity`.
- **Prompt-injection from reviewed file content escaping the shell**: `$(cat 'X')` does not re-evaluate file contents at the shell layer. Tool-boundary escape inside the spawned opencode process is a separate concern (Anthropic / opencode runtime), not a 101-wiring-layer defect. Disposition: `out_of_scope_for_dispatch_layer`.
- **Stop hook env override gating could be bypassed**: confirmed `NODE_ENV === 'test' || SPECKIT_TEST === 'true'` is the only path that honors `SPECKIT_GENERATE_CONTEXT_SCRIPT`. Production env ignores this var. Disposition: `ruled_out_at_security_granularity`.

## Next Focus

- **Dimension**: traceability
- **Focus area**: parity audit across the 4 cli-opencode YAML branches + advisor aliases coverage + 100 sub-phase canonicalization cross-references
- **Reason**: dimension queue advances per strategy doc item 4 (iter 5-6); also need to verify P1-027's "missing --pure" and the 4-branch YAML drift claim more deeply to support synthesis. Security pass is now exercised at 1 surface (this iteration). 2 dimensions remain (traceability, maintainability).
- **Rotation status**: rotating to next dimension (traceability)
- **Blocked carry-forward**: F2 cli-opencode null-model (BLOCKED iter-3); P1-026 hidden regression (BLOCKED iter-2)
- **Productive carry-forward**: in-process Node adversarial probes (PRODUCTIVE iter-2-3-4 — apply to advisor alias scoring next)
- **Required evidence**: full diff of `if_cli_opencode` blocks across deep-review_auto, deep-review_confirm, deep-research_auto, deep-research_confirm; cross-check `aliases.ts` against 101 implementation-summary claim about advisor alias; spot-check 100 sub-phase canonicalization
- **Recovery note**: 2 NEW security findings (P1-029, P2-029, P2-031) increase total but do not exhaust budget; 1 deferred (buildCopilotPromptArg) recommended for fork into a follow-on packet
