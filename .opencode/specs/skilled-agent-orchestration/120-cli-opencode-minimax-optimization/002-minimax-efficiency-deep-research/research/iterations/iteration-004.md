# Iteration 4: Q4 - MiniMax Quota Pool, Fallback, and Permissions Matrix

## Focus

Define `minimax-api` quota-pool semantics and fallback behavior for MiniMax 2.7 through `cli-opencode`, then map the existing structured permissions matrix to the direct MiniMax provider tool-use path without creating MiniMax-only permission logic.

## Actions Taken

- Read the 114 fallback decision record to recover the accepted invariant: fallback is one-step only, allowed only to a different quota pool, and otherwise fail-fast with a clear exhausted-pool reason. [SOURCE: .opencode/specs/skilled-agent-orchestration/114-small-ai-model-optimization/005-model-profiles-and-fallback/decision-record.md]
- Read the shared fallback router implementation and unit tests to verify the runtime behavior rejects unknown models, null targets, missing targets, and same-pool targets before allowing a route. [SOURCE: .opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts] [SOURCE: .opencode/skills/deep-loop-runtime/tests/unit/fallback-router.vitest.ts]
- Inspected `model-profiles.json` to confirm `minimax-2.7` currently declares `provider: "minimax"`, `quota_pool: "minimax-api"`, `primary_quota_pool: "minimax-api"`, and `fallback_target: null`. [SOURCE: .opencode/skills/sk-prompt/assets/model-profiles.json]
- Read the structured permissions matrix reference, JSON schema, and gate implementation to confirm the matrix is operation/path based, provider-neutral, most-specific-glob-wins, and default-deny when absent or malformed. [SOURCE: .opencode/skills/cli-opencode/references/permissions-matrix.md] [SOURCE: .opencode/skills/cli-opencode/assets/permissions-matrix.schema.json] [SOURCE: .opencode/skills/deep-loop-runtime/lib/deep-loop/permissions-gate.ts]
- Checked `cli-opencode` provider documentation to confirm MiniMax is documented as an explicit direct-provider route that bypasses `opencode-go`, requires `MINIMAX_API_KEY`, and must not be silently substituted when unavailable. [SOURCE: .opencode/skills/cli-opencode/SKILL.md] [SOURCE: .opencode/skills/cli-opencode/references/cli_reference.md]

## Findings

### F1 - `minimax-api` should remain a distinct direct-provider quota pool

`model-profiles.json` already models MiniMax as a direct `cli-opencode` provider with `quota_pool: "minimax-api"` and `primary_quota_pool: "minimax-api"`. This matches the `cli-opencode` provider docs: MiniMax is selected as `minimax/minimax-2.7`, uses `MINIMAX_API_KEY`, and bypasses the `opencode-go` gateway.

That means `minimax-api` should be treated as a first-class pool beside `opencode-go`, `deepseek-api`, `cognition-free`, and `cognition-pro`, not as a sub-pool of `opencode-go`. The practical value is pool isolation: MiniMax can remain available when `opencode-go` or Cognition pools are exhausted, and MiniMax exhaustion should not trigger a blind retry against another MiniMax route.

Concrete delta: keep `minimax-2.7.executors[0].quota_pool` and `primary_quota_pool` as `minimax-api`; update docs to explicitly say this pool is independent of `opencode-go` and direct DeepSeek API.

### F2 - Default MiniMax fallback should stay `fallback_target: null`

The 114 ADR chose quota-pool-aware fallback over same-pool retries. The router implements exactly that: `fallback_target: null` returns fail-fast, missing targets fail-fast, and same-pool targets fail-fast. Only a configured target in a different pool returns `action: "fallback"`.

MiniMax currently has one active executor path: `cli-opencode` through provider `minimax`. There is no verified MiniMax sibling pool, no adopted Haiku/Gemini/OpenAI small-model fallback policy for this packet, and no evidence that another active small-model pool is a safe semantic substitute. Therefore the correct default is the current one: `fallback_target: null`, fail-fast on `minimax-api` exhaustion, and surface a clear operator message.

This mirrors Qwen's single-path behavior more than DeepSeek's multi-provider situation. DeepSeek has direct API and gateway surfaces; MiniMax in this packet only has the direct MiniMax.io path. A fallback to DeepSeek, Kimi, GLM, or Qwen would be a task-routing decision after operator approval, not automatic quota fallback.

Concrete delta: document `minimax-api` as fail-fast by default in `cli-opencode` and `sk-prompt-small-model`; do not populate `fallback_target` unless a later packet verifies and adopts a separate-pool target.

### F3 - Fallback should be single-step and pool-aware, not preference-aware

The fallback router's contract is intentionally narrow: it answers "can this exhausted pool route to a separate configured pool?" It does not choose the best model for the task. That distinction matters for MiniMax because routing heuristics may later prefer DeepSeek for harder reasoning or Kimi/GLM for broader synthesis, but those are pre-dispatch selection rules, not quota-exhaustion recovery.

MiniMax should not add a MiniMax-specific fallback router branch. It should use the existing registry fields and the existing rule: one step, configured target only, target must exist, target must have a different `quota_pool`.

Concrete delta: if tests are added in the follow-up implementation packet, extend `fallback-router.vitest.ts` with a `minimax-2.7` profile asserting null-target fail-fast and optional separate-pool success. Do not create `resolveMiniMaxFallback`.

### F4 - The structured permissions matrix applies unchanged to MiniMax tool use

The permissions gate normalizes tool calls into operation classes: `Read`, `Grep`, and `Glob` become `read`; `Write` becomes `write`; `Edit`, `MultiEdit`, and `apply_patch` become `edit`; `Delete` becomes `delete`; `Bash`, `Exec`, and `Shell` become `execute`. Bash is normalized to `Exec(<command>)`, including destructive mappings such as `git rm` and `find -delete` to `Exec(rm)`.

None of that depends on provider name or model id. MiniMax direct-provider tool calls should therefore use the same matrix selected by workflow mode:

- Research/review-only MiniMax dispatches: use the read-only matrix.
- Approved packet implementation: use a packet-local matrix with explicit write/edit globs for the packet docs and target source files.
- Trusted `.opencode` refactors: use the repo-wide `.opencode` matrix, still denying delete and external config writes.

MiniMax's native tool-use / interleaved-thinking characteristics do not require a new permission system. The security boundary is the pre-tool-call gate, not the model's internal reasoning format.

Concrete delta: add a `MiniMax direct provider` note to `cli-opencode/references/permissions-matrix.md` stating that provider routes, including `minimax/minimax-2.7`, inherit the active matrix unchanged.

### F5 - Do not introduce MiniMax-only permission logic

MiniMax-specific permission logic would weaken the 114 design by duplicating policy outside the structured matrix and creating a second place for RM-8 protections to drift. The existing schema is intentionally small: flat `rules[]`, operation class, scope, effect, rationale. The runtime already defaults deny on empty or malformed matrices, unsupported tools, missing file paths, and missing Bash commands.

The only MiniMax-specific documentation needed is operational: direct MiniMax dispatches must be run under the same matrix discipline as other `cli-opencode` dispatches, and fallback/model substitution must remain explicit. No schema fields like `provider`, `model`, or `minimax_tools` are needed for Q4.

Concrete delta: leave `permissions-matrix.schema.json` unchanged. Add examples or docs only if they clarify matrix selection by workflow mode.

## Questions Answered

- Q4 quota-pool semantics: `minimax-api` is a separate direct-provider pool independent of `opencode-go`, Cognition, and DeepSeek direct API pools.
- Q4 fallback behavior: keep `fallback_target: null` for MiniMax by default. On `minimax-api` exhaustion, fail-fast with a pool-specific message until a verified separate-pool target is deliberately adopted.
- Q4 permissions mapping: MiniMax direct-provider tool calls should pass through the existing structured permissions matrix unchanged. Matrix selection is based on workflow scope, not provider.
- Q4 implementation direction: extend docs/tests around existing registry and gate behavior; do not add MiniMax-only fallback or permission branches.

## Questions Remaining

- Q5: synthesize MiniMax routing heuristics versus DeepSeek, Qwen, Kimi, and GLM.
- Q5: produce the final concrete file-level delta list across `sk-prompt-small-model`, `sk-prompt`, `cli-opencode`, and any 114 runtime tests/docs that should be extended.
- Q5: decide whether MiniMax should be a default candidate for cost-conscious iteration or remain explicit-only pending live latency and quality data.

## Next Focus

Q5: Define routing heuristics for MiniMax 2.7 versus DeepSeek, Qwen, Kimi, and GLM, then consolidate Q1-Q4 into patch-ready file-level deltas.
