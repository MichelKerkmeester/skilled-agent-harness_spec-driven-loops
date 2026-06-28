# Iteration 3: Q3 - MiniMax Prompt Quality and Variant Policy

## Focus

Define MiniMax 2.7 prompt-quality / RCAF guidance and a safe `--variant` mapping policy for `cli-opencode` through the direct MiniMax.io provider. This pass avoids claiming that `--variant high` changes MiniMax reasoning until a live ablation or provider documentation proves it.

## Actions Taken

- Read the small-model sentinel and pattern index to confirm `sk-prompt-models` must stay link-only, with real prompt and provider guidance living in the owning executor docs. [SOURCE: .opencode/skills/sk-prompt-models/SKILL.md] [SOURCE: .opencode/skills/sk-prompt-models/references/pattern-index.md]
- Read the shared `sk-prompt` CLI quality card and the `cli-opencode` mirror card to map MiniMax guidance onto existing RCAF / CLEAR / medium-density pre-planning patterns. [SOURCE: .opencode/skills/sk-prompt/assets/cli_prompt_quality_card.md] [SOURCE: .opencode/skills/cli-opencode/assets/prompt_quality_card.md]
- Inspected the phase-001 `cli-opencode` `--variant` matrix row, which already marks MiniMax variant behavior as unverified. [SOURCE: .opencode/skills/cli-opencode/references/cli_reference.md]
- Checked current OpenCode model docs and MiniMax coding-tool/model docs. OpenCode documents provider/model variants generally, but the public docs do not prove a built-in MiniMax-specific `--variant high` mapping. MiniMax documents `MiniMax-M2.7-highspeed` as a separate model id, not as a variant flag effect. [SOURCE: https://dev.opencode.ai/docs/models/] [SOURCE: https://platform.minimax.io/docs/token-plan/other-tools] [SOURCE: https://platform.minimax.io/docs/guides/text-generation]

## Findings

### F1 - MiniMax should inherit the RCAF fast path, not a new prompt framework

The shared prompt-quality card already says `RCAF` is the default for general implementation, edit, and documentation prompts, with `CRISPE` for research and `CRAFT` for high-complexity planning. [SOURCE: .opencode/skills/sk-prompt/assets/cli_prompt_quality_card.md] The OpenCode mirror carries the same core table and adds OpenCode-specific task rows. [SOURCE: .opencode/skills/cli-opencode/assets/prompt_quality_card.md]

MiniMax does not need a new framework. The concrete guidance should be:

- Use `RCAF` for normal MiniMax coding/edit/doc dispatches: role, local context, concrete action, and expected output format.
- Use `CRISPE` for deep-research / option-discovery prompts and `TIDD-EC` only when correctness, policy, security, or review constraints dominate.
- Keep the existing medium-density pre-plan guidance: 3-4 ordered steps, each with acceptance criteria and a verification command when applicable.
- Keep bundle-gate strictness at the standard level. Do not add aggressive multi-layer enforcement language unless the task itself is compliance-critical.

Concrete delta: update `.opencode/skills/cli-opencode/assets/prompt_quality_card.md` with a short "MiniMax direct-API prompt guidance" note under the task map. Mirror or point from `.opencode/skills/sk-prompt/assets/cli_prompt_quality_card.md` by adding `minimax-2.7` to Budget Awareness rather than copying provider-specific content into the shared card.

### F2 - MiniMax-specific prompt quality is mostly context hygiene

MiniMax's usage tips emphasize keeping task state visible in the long context, including the working plan, current status, and open questions. They also recommend concise system prompts when context compression exists. [SOURCE: https://platform.minimax.io/docs/token-plan/prompting-best-practices]

That maps cleanly onto the 114 budget/verification findings:

- Keep current plan/status/open questions in the retained working set.
- Preserve exact file paths, command names, model slug, and acceptance criteria.
- Explain why non-obvious constraints matter. This improves trade-off selection without inflating the prompt with generic warnings.
- Preserve complete tool-call / tool-result / reasoning continuity for active MiniMax tool rounds; do not summarize the active round into text-only prose.

Concrete delta: `cli-opencode/assets/prompt_quality_card.md` should say MiniMax prompts should prefer explicit repo/file anchors, current task state, and concise rationale for constraints. `sk-prompt-models/references/pattern-index.md` should add at most a pointer row to this OpenCode-owned MiniMax prompt-quality note.

### F3 - The safe MiniMax `--variant` default is unset, not `high`

OpenCode documents `--variant` as provider/model-specific configuration and shows built-in variants for popular providers such as Anthropic, OpenAI, and Google. It also says custom variants can be defined in config. [SOURCE: https://dev.opencode.ai/docs/models/] The current local `cli_reference.md` says the skill default is `--variant high`, but its MiniMax row already says MiniMax behavior is unverified. [SOURCE: .opencode/skills/cli-opencode/references/cli_reference.md]

MiniMax docs expose `MiniMax-M2.7` and `MiniMax-M2.7-highspeed` as separate model IDs with the same context window and different output speeds. [SOURCE: https://platform.minimax.io/docs/guides/text-generation] MiniMax's coding-tool docs also tell OpenCode users to select `MiniMax-M2.7`; they do not document an OpenCode variant toggle for MiniMax reasoning. [SOURCE: https://platform.minimax.io/docs/token-plan/other-tools]

Therefore the safe policy is:

- For `--model minimax/...`, omit `--variant` by default until a live ablation or official docs prove a mapping.
- Do not treat `--variant high` as `MiniMax-M2.7-highspeed`.
- If the user wants highspeed, route to the exact highspeed model ID exposed by `opencode models minimax`, after confirming the live slug. That is model selection, not variant selection.
- Keep the existing global `--variant high` default for non-MiniMax routes where the docs already support it.

Concrete delta: revise `.opencode/skills/cli-opencode/references/cli_reference.md` §5 so the MiniMax row says `--variant` is omitted by default for direct MiniMax dispatches; highspeed is a distinct model ID if exposed. The base invocation shape can keep `--variant high`, but the MiniMax provider decision tree should explicitly override it to unset.

### F4 - The ablation recipe should test observable provider behavior before changing the default

The ablation should be small, live, and falsifiable:

1. Run `opencode models minimax` after login and record exact exposed model IDs, especially whether `MiniMax-M2.7` and `MiniMax-M2.7-highspeed` appear.
2. Run the same bounded coding prompt three times with `--model <exact-minimax-M2.7-slug>` and variants unset, `high`, and `max` if accepted. Use `--format json`; add `--thinking` only if local policy permits exposing thinking blocks.
3. Use the same prompt, same repo state, same agent, and same verification command. Capture wall-clock time, output token estimate if available, tool-call success, event metadata, final patch quality, and verification result.
4. Accept a MiniMax variant mapping only if OpenCode event metadata or provider payload options show a real MiniMax option change, or official OpenCode/MiniMax docs explicitly document the mapping.
5. If no difference is proven, keep `--variant` unset for MiniMax and treat highspeed as a separate model selection.

Concrete delta: add this recipe to `.opencode/skills/cli-opencode/references/cli_reference.md` near the MiniMax `--variant` row or as a short "MiniMax variant ablation" subsection. Add a pointer row in `sk-prompt-models/references/pattern-index.md`; do not duplicate the recipe in the sentinel.

### F5 - Concrete Q3 file-level deltas

Recommended Q3 deltas:

1. `.opencode/skills/cli-opencode/references/cli_reference.md`: update the MiniMax variant row from "unverified" to "unverified; omit by default; highspeed is a separate model id if exposed"; add the ablation recipe above.
2. `.opencode/skills/cli-opencode/assets/prompt_quality_card.md`: add MiniMax direct-API prompt guidance: RCAF default, CRISPE for research, medium-density pre-plan, concise constraint rationale, exact file/model anchors, and active tool-round continuity.
3. `.opencode/skills/sk-prompt/assets/cli_prompt_quality_card.md`: update Budget Awareness to include `minimax-2.7`; keep shared guidance generic and point to `cli-opencode` for provider-specific MiniMax policy.
4. `.opencode/skills/sk-prompt-models/references/pattern-index.md`: add a link-only row for "MiniMax prompt-quality / variant-ablation policy" owned by `cli-opencode`, pointing at `cli-opencode/assets/prompt_quality_card.md` and `cli-opencode/references/cli_reference.md`.
5. `.opencode/skills/sk-prompt-models/SKILL.md`: no body change required unless the implementation wants the dispatch matrix status text to mention "variant mapping pending ablation." The sentinel already names MiniMax and should stay thin.

## Questions Answered

- Q3 is answered at policy level: MiniMax should use the existing RCAF / CLEAR fast path with MiniMax-specific context hygiene, not a new prompt framework.
- The safe `--variant` policy is conservative: omit `--variant` by default for direct MiniMax until docs or live ablation prove a mapping.
- Highspeed should be selected as a distinct model id, not inferred from `--variant high`.
- The ablation recipe is defined and small enough to run once a configured `MINIMAX_API_KEY` and live `opencode models minimax` are available.

## Questions Remaining

- Q4: decide quota-pool / fallback behavior for `minimax-api`, including whether any different-pool target should be named or whether MiniMax remains fail-fast.
- Q4: determine how the existing permissions matrix applies to MiniMax tool use and interleaved-thinking continuity.
- Q5: synthesize final routing heuristics versus DeepSeek, Qwen, Kimi, and GLM, then produce final patch-ready deltas.

## Next Focus

Q4: Define `minimax-api` quota-pool and fallback behavior, then map the existing structured permissions matrix to MiniMax's direct-provider tool-use path without creating MiniMax-only permission logic.
