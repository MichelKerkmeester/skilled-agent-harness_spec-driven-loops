# Iteration 10: Final Consolidation, Confidence, And Follow-On Delta Order

## Focus

Finalize the MiniMax-2.7 research loop before synthesis: assign confidence to each proposed file-level delta, separate runtime-deferred residuals from patch-ready documentation work, and produce the prioritized P0/P1/P2 delta list for the follow-on implementation packet.

## Actions Taken

1. Re-read the active skill contracts for `deep-research`, `sk-prompt-models`, and `cli-opencode` to preserve the leaf-agent boundary and the sentinel ownership boundary. [SOURCE: `.opencode/skills/deep-research/SKILL.md`] [SOURCE: `.opencode/skills/sk-prompt-models/SKILL.md`] [SOURCE: `.opencode/skills/cli-opencode/SKILL.md`]
2. Rechecked the current sentinel index, current MiniMax registry entry, cli-opencode context-budget mirror, cli-opencode model-selection/reference text, prompt-quality budget card, and per-model budget references against iteration 9's patch text. [SOURCE: `.opencode/skills/sk-prompt-models/references/pattern-index.md`] [SOURCE: `.opencode/skills/sk-prompt/assets/model-profiles.json`] [SOURCE: `.opencode/skills/cli-opencode/references/context-budget.md`] [SOURCE: `.opencode/skills/cli-opencode/references/cli_reference.md`] [SOURCE: `.opencode/skills/sk-prompt/assets/cli_prompt_quality_card.md`] [SOURCE: `.opencode/skills/cli-devin/assets/per-model-budgets.json`]
3. Reviewed the state log and iteration 9 delta stream to avoid duplicating Phase 001 edits, MiniMax runtime branches, or already-settled negative knowledge. [SOURCE: `.opencode/specs/skilled-agent-orchestration/z_archive/098-cli-opencode-minimax-optimization/002-minimax-efficiency-deep-research/research/deep-research-state.jsonl`] [SOURCE: `.opencode/specs/skilled-agent-orchestration/z_archive/098-cli-opencode-minimax-optimization/002-minimax-efficiency-deep-research/research/deltas/iter-009.jsonl`]
4. Collapsed the prior exact patch text into confidence-scored, dependency-aware implementation deltas.

## Findings

### Finding 1: Confidence by file-level delta

| Delta | Confidence | Evidence | Caveat |
| --- | --- | --- | --- |
| Update existing `.opencode/skills/sk-prompt/assets/model-profiles.json` `minimax-2.7` object with `context_length: 204800`, native tool calling, `quota_pool: "minimax-api"`, `fallback_target: null`, and omit-variant caveats | High | Current file already has a single `minimax-2.7` object with `context_length: null`, `provider: "minimax"`, `quota_pool: "minimax-api"`, and `fallback_target: null`; iterations 1-2 established the 204,800 window and 143,360 active budget; iteration 9 ruled out duplicate provider rows. | Exact public/provider slug casing still needs runtime verification, but the existing registry id/provider shape is already present. |
| Add `minimax-2.7` to `.opencode/skills/cli-devin/assets/per-model-budgets.json` using the existing array schema and 70 percent budget rule | High | The budget engine already centralizes per-model defaults there; iteration 2 derived 143,360 active tokens from 204,800 * 0.70; iteration 6 confirmed the array schema. | This is a shared budget metadata row, not cli-devin runtime support for MiniMax. |
| Replace the cli-opencode model-window table in `.opencode/skills/cli-opencode/references/context-budget.md` with context window + active budget columns and a MiniMax row | High | Current table lists DeepSeek/Kimi/Qwen only; the file explicitly mirrors canonical cli-devin budget semantics and points to model profiles for windows/quota metadata. | Keep it documentation-only; no budget implementation belongs here. |
| Add a MiniMax direct-provider exception and task-shape routing table to `.opencode/skills/cli-opencode/SKILL.md` | High | Current SKILL.md already documents `minimax/minimax-2.7`, `MINIMAX_API_KEY`, pre-flight behavior, and default `opencode-go/deepseek-v4-pro --variant high`; iterations 5, 8, and 9 produced stable routing heuristics. | Exact insertion point should be near `### Model Selection` to avoid changing the default invocation contract. |
| Refine `.opencode/skills/cli-opencode/references/cli_reference.md` MiniMax `--variant` row and add a direct-provider routing subsection | High | Current reference has a MiniMax row that says behavior is unverified; iteration 3/7/9 converged on omit-by-default plus ablation promotion. | Runtime ablation may later promote a `--variant` policy, but not in this packet. |
| Replace `.opencode/skills/sk-prompt/assets/cli_prompt_quality_card.md` Budget Awareness with the small-model routing table including MiniMax | High | Current paragraph only names `swe-1.6`, `deepseek-v4-pro`, `kimi-k2.6`, and `qwen3.6`; model profiles and SKILL.md already include GLM-5.1 and MiniMax. | Keep the table compact; pattern bodies still live in executor references. |
| Update `.opencode/skills/sk-prompt-models/SKILL.md` dispatch matrix, cli-opencode ownership row, and required model set to include MiniMax-2.7 | High | SKILL.md already names MiniMax in triggers and When To Use, but the dispatch matrix and ownership text still omit it. | Do not expand this sentinel with pattern bodies. |
| Insert three link-only MiniMax rows in `.opencode/skills/sk-prompt-models/references/pattern-index.md` | High | Current pattern index is explicitly link-only and already points at canonical owner files; iteration 8 selected exactly three MiniMax rows. | Avoid generic permissions/fallback/output-verification rows that duplicate existing provider-neutral patterns. |
| Optionally add `.opencode/skills/cli-opencode/manual_testing_playbook/03--multi-provider/005-minimax-variant-ablation.md` | Medium | Iterations 7 and 9 produced a concrete no-variant vs `--variant high` ablation recipe; cli-opencode already has manual testing playbook conventions. | Optional because it is a test playbook, not required for docs/schema correctness, and it cannot pass without live provider access. |

### Finding 2: Runtime-deferred residuals

These cannot be resolved from static repo inspection and should be marked deferred-to-runtime in the follow-on packet:

| Residual | Runtime check needed | Why deferred |
| --- | --- | --- |
| Exact MiniMax model slug casing and discoverability | `MINIMAX_API_KEY=... opencode models minimax` | Static docs and current registry use `minimax/minimax-2.7`, but only the live provider list can prove exact accepted slug(s). |
| Whether `--variant high` is accepted, ignored, rejected, or mapped to reasoning effort | Paired `opencode run --model minimax/minimax-2.7` with and without `--variant high`, stdout/stderr separated | MiniMax API reasoning controls do not prove OpenCode provider translation behavior. |
| Whether a distinct high-speed model slug exists and how it should be selected | `opencode models minimax` plus provider docs/API response | Iteration 3 ruled out treating highspeed as implied by `--variant high`; it may be a separate model id. |
| Real wall-clock latency and timeout envelope for 20k/80k/140k active prompts | Timed MiniMax dispatches with representative prompt sizes | `avg_iter_wall_clock_min` should remain null until measured. |
| Actual RPM/TPM/rate-limit error shapes returned through `opencode run` | Stress/limit run against the live provider or captured real error | Error text determines troubleshooting copy and retry guidance. |
| Tool-call event shape and interleaved thinking preservation in OpenCode JSON output | MiniMax dispatch that uses one read-only tool and inspects `--format json` events | Static MiniMax capability claims do not prove OpenCode's normalized event stream shape. |
| Current pricing/cost metadata and any local billing display | Live MiniMax billing docs/API/provider dashboard at implementation time | Pricing changes over time; documentation should not freeze unverified numbers. |

### Finding 3: Prioritized follow-on delta list

| Priority | File | Exact change | Confidence | Dependency |
| --- | --- | --- | --- | --- |
| P0 | `.opencode/skills/sk-prompt/assets/model-profiles.json` | Replace the existing `minimax-2.7` object; set `context_length` to `204800`, keep `tool_calling: "native"`, keep `provider: "minimax"`, keep `quota_pool: "minimax-api"`, keep `fallback_target: null`, update notes/strengths/weaknesses to say large retained-evidence route, 143,360 active budget, omit `--variant` pending ablation, and pay-as-you-go cost caution. | High | None; update existing object only. |
| P0 | `.opencode/skills/cli-devin/assets/per-model-budgets.json` | Insert a `minimax-2.7` budget row using the existing schema: `provider: "MiniMax"`, `context_length: 204800`, `max_budget_pct: 70`, `working_memory_tokens: 500`, `summary_threshold_lines: 200`, standard truncation marker, and note complete active tool-call/tool-result span preservation. | High | Depends on the model-profile window decision. |
| P0 | `.opencode/skills/cli-opencode/references/context-budget.md` | Replace the cli-opencode model-window table with `Context window` and `70% active budget` columns for DeepSeek/Kimi/Qwen/MiniMax, then add the MiniMax trimming paragraph that preserves complete active tool rounds. | High | Depends on shared budget row and 70 percent rule. |
| P0 | `.opencode/skills/cli-opencode/references/cli_reference.md` | Replace the MiniMax `--variant` row with "omit by default"; update default behavior text so only the default `opencode-go/deepseek-v4-pro` route passes `--variant high`; add a MiniMax direct-provider subsection covering large evidence, quota isolation, no silent substitution, and `fallback_target: null`. | High | Depends on keeping runtime residuals deferred. |
| P1 | `.opencode/skills/cli-opencode/SKILL.md` | Under `### Model Selection`, add the MiniMax direct-provider exception and compact task-shape routing table. Preserve the default `opencode-go/deepseek-v4-pro --variant high` route. | High | Depends on cli_reference wording so SKILL.md can stay concise. |
| P1 | `.opencode/skills/sk-prompt/assets/cli_prompt_quality_card.md` | Replace Budget Awareness with the compact small-model routing table: DeepSeek hard reasoning, Qwen narrow edits, Kimi long-context opencode-go, GLM structured synthesis, MiniMax large evidence/quota isolation, and fail-fast on exhausted pools. | High | Depends on model-profile and cli-opencode route metadata. |
| P1 | `.opencode/skills/sk-prompt-models/SKILL.md` | Add MiniMax-2.7 to the dispatch matrix, expand the cli-opencode ownership row to include MiniMax.io direct provider, and update the required model set. | High | Depends on preserving sentinel-thin rules. |
| P1 | `.opencode/skills/sk-prompt-models/references/pattern-index.md` | Insert exactly three link-only MiniMax rows: context-budget adoption, direct-provider routing, and prompt-quality/variant-ablation policy. | High | Depends on target owner docs existing or being edited in the same packet. |
| P2 | `.opencode/skills/cli-opencode/manual_testing_playbook/03--multi-provider/005-minimax-variant-ablation.md` | Add the optional no-variant vs `--variant high` manual ablation recipe with three paired runs, separate stdout/stderr capture, timing, and pass criteria. | Medium | Depends on live `MINIMAX_API_KEY`; useful before promoting any variant policy. |

### Finding 4: Negative implementation constraints remain stable

Do not add MiniMax-specific runtime logic. The evidence points to metadata, docs, routing guidance, and optional manual verification only.

Do not duplicate Phase 001 provider setup. The current provider path and registry stub already exist; the follow-on packet should refine them.

Do not silently fallback from `opencode-go`, Cognition, or DeepSeek to MiniMax. MiniMax is a separate `minimax-api` pool and remains explicit-route/fail-fast.

Do not default MiniMax to `--variant high`. The safe policy is omit-by-default until live ablation proves accepted and beneficial behavior.

## Questions Answered

All five primary questions are answered at patch-planning level:

1. MiniMax-2.7 should be treated as a 204,800-token, native-tooling direct provider with runtime-deferred latency/pricing/variant details.
2. The budget tuple is 204,800 context with a 143,360 active budget under the existing 70 percent rule, preserving complete active tool-call/tool-result spans.
3. Prompt quality should reuse RCAF/CLEAR and existing budget-awareness patterns; MiniMax omits `--variant` by default pending ablation.
4. `minimax-api` remains its own pool with `fallback_target: null`; permissions and verification stay provider-neutral.
5. Routing favors MiniMax for large retained evidence, active tool-round continuity, and quota isolation; DeepSeek/Qwen/Kimi/GLM remain better for their narrower established shapes.

## Questions Remaining

No static research questions remain for this loop. Runtime-deferred residuals require a live `MINIMAX_API_KEY` and `opencode models minimax` / paired `opencode run` checks.

## Next Focus

Synthesis should produce `research/research.md` and a follow-on implementation packet that applies the P0/P1 deltas first, then optionally adds the P2 ablation playbook before any future `--variant` promotion.
