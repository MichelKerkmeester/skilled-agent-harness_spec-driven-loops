# Iteration 006 - Cross-runtime Public-surface Parity Replay

## Dispatcher

- Session: `deep-review-066-20260503T211436Z`
- Iteration: 6 of 7
- Mode: review
- Focus: cross-runtime public-surface parity replay
- Dimension: cross-runtime public-surface parity replay
- Budget profile: `verify` (selected for mirror parity reads plus F004 baseline-inversion replay)
- Status: complete

## Files Reviewed

- `.opencode/specs/skilled-agent-orchestration/z_archive/052-sk-code-opencode-merger/review/prompts/iteration-6.md`
- `.opencode/specs/skilled-agent-orchestration/z_archive/052-sk-code-opencode-merger/review/deep-review-state.jsonl`
- `.opencode/specs/skilled-agent-orchestration/z_archive/052-sk-code-opencode-merger/review/deep-review-findings-registry.json`
- `.opencode/specs/skilled-agent-orchestration/z_archive/052-sk-code-opencode-merger/review/deep-review-strategy.md`
- `.opencode/specs/skilled-agent-orchestration/z_archive/052-sk-code-opencode-merger/review/deep-review-config.json`
- `.opencode/skills/sk-code-review/references/review_core.md`
- `.opencode/agents/code.md`
- `.claude/agents/code.md`
- `.gemini/agents/code.md`
- `.codex/agents/code.toml`
- `.opencode/agents/review.md`
- `.claude/agents/review.md`
- `.gemini/agents/review.md`
- `.codex/agents/review.toml`
- `.opencode/agents/orchestrate.md`
- `.claude/agents/orchestrate.md`
- `.gemini/agents/orchestrate.md`
- `.codex/agents/orchestrate.toml`
- `.opencode/commands/speckit/assets/speckit_implement_auto.yaml`
- `.opencode/commands/speckit/assets/speckit_implement_confirm.yaml`
- `.opencode/commands/speckit/assets/speckit_complete_auto.yaml`
- `.opencode/commands/speckit/assets/speckit_complete_confirm.yaml`
- `.opencode/commands/speckit/deep-review.md`

## Findings - New

### P0 Findings

- None.

### P1 Findings

- None.

### P2 Findings

- None.

## Traceability Checks

- `review_doctrine_loaded`: pass. Severity definitions require P1 for required spec mismatch / must-fix gate issues and P2 for non-blocking documentation polish. [SOURCE: `.opencode/skills/sk-code-review/references/review_core.md:20`]
- `public_agent_code_router_wording`: pass. OpenCode, Claude, Gemini, and Codex `code` mirrors all describe `sk-code` as the single router and exclude `sk-code-review` from `@code`, without exposing internal route names in the checked skills table. [SOURCE: `.opencode/agents/code.md:74`] [SOURCE: `.opencode/agents/code.md:78`] [SOURCE: `.claude/agents/code.md:74`] [SOURCE: `.claude/agents/code.md:78`] [SOURCE: `.gemini/agents/code.md:74`] [SOURCE: `.gemini/agents/code.md:78`] [SOURCE: `.codex/agents/code.toml:55`] [SOURCE: `.codex/agents/code.toml:59`]
- `public_agent_review_baseline_wording`: pass. OpenCode, Claude, Gemini, and Codex `review` mirrors all state the baseline+router contract as `sk-code-review` first, then `sk-code` router-selected evidence. [SOURCE: `.opencode/agents/review.md:31`] [SOURCE: `.opencode/agents/review.md:47`] [SOURCE: `.claude/agents/review.md:31`] [SOURCE: `.claude/agents/review.md:47`] [SOURCE: `.gemini/agents/review.md:31`] [SOURCE: `.gemini/agents/review.md:47`] [SOURCE: `.codex/agents/review.toml:19`] [SOURCE: `.codex/agents/review.toml:35`]
- `public_agent_orchestrator_review_contract`: pass. The runtime orchestrator mirrors consistently route code review to `@review` with `sk-code-review baseline + sk-code router-selected evidence`. [SOURCE: `.opencode/agents/orchestrate.md:99`] [SOURCE: `.claude/agents/orchestrate.md:99`] [SOURCE: `.gemini/agents/orchestrate.md:99`] [SOURCE: `.codex/agents/orchestrate.toml:90`]
- `command_public_examples`: pass. The checked deep-review command example uses generic `skill:sk-code router-guidance` branding and does not expose retired `sk-code-opencode` or internal stack/surface specifics. [SOURCE: `.opencode/commands/speckit/deep-review.md:309`]
- `F004_command_variant_replay`: still-active existing P1, not a new finding. The four implement/complete workflow variants still set `standards_contract.baseline: "sk-code"` while their adjacent phase labels name `sk-code-review baseline + sk-code router-selected evidence`, matching F004 rather than adding a distinct variant. [SOURCE: `.opencode/commands/speckit/assets/speckit_implement_auto.yaml:213`] [SOURCE: `.opencode/commands/speckit/assets/speckit_implement_auto.yaml:214`] [SOURCE: `.opencode/commands/speckit/assets/speckit_implement_auto.yaml:221`] [SOURCE: `.opencode/commands/speckit/assets/speckit_implement_confirm.yaml:199`] [SOURCE: `.opencode/commands/speckit/assets/speckit_implement_confirm.yaml:200`] [SOURCE: `.opencode/commands/speckit/assets/speckit_implement_confirm.yaml:207`] [SOURCE: `.opencode/commands/speckit/assets/speckit_complete_auto.yaml:310`] [SOURCE: `.opencode/commands/speckit/assets/speckit_complete_auto.yaml:311`] [SOURCE: `.opencode/commands/speckit/assets/speckit_complete_auto.yaml:318`] [SOURCE: `.opencode/commands/speckit/assets/speckit_complete_confirm.yaml:319`] [SOURCE: `.opencode/commands/speckit/assets/speckit_complete_confirm.yaml:320`] [SOURCE: `.opencode/commands/speckit/assets/speckit_complete_confirm.yaml:327`]

## Integration Evidence

- Checked public runtime mirrors: `.opencode/agent`, `.claude/agents`, `.gemini/agents`, and `.codex/agents`.
- Checked command workflow variants: `speckit_implement_auto.yaml`, `speckit_implement_confirm.yaml`, `speckit_complete_auto.yaml`, and `speckit_complete_confirm.yaml`.
- Checked command example surface: `.opencode/commands/speckit/deep-review.md`.

## Edge Cases

- Active F004 is confirmed across the four intended command variants, but no additional mirror variant was found in this replay. The issue remains one existing P1 rather than a new cross-runtime parity finding.
- Grep results surfaced `sk-code-review` and `sk-code router-selected evidence` in review/orchestrator mirrors; these are expected public review-contract phrases, not internal `sk-code` router implementation details.
- The Codex mirror uses TOML packaging while preserving the same markdown contract lines; parity was assessed against the embedded content lines rather than file extension shape.

## Confirmed-Clean Surfaces

- Checked `@code` mirrors consistently expose generic single-router `sk-code` wording without the retired `sk-code-opencode` label in the scoped hits.
- Checked `@review` and `@orchestrate` mirrors consistently use the correct `sk-code-review` baseline plus `sk-code` router-selected evidence phrasing.
- Checked deep-review command examples avoid public old-skill/internal-stack leakage in the inspected example block.

## Ruled Out

- New P0/P1 public-agent parity failure: ruled out for the checked runtime mirror slices because the baseline/router wording is consistent and evidence-backed.
- Additional F004 mirror variant outside the four workflow assets: ruled out within the declared command assets inspected in this iteration.
- New public command example leakage of `sk-code-opencode` or internal stack names: ruled out for the inspected deep-review command example block.

## Next Focus

- dimension: convergence / final release-readiness synthesis
- focus area: carry F001, F003, and F004 as active P1 blockers and F002 as advisory unless targeted changes resolve them before reducer refresh
- reason: cross-runtime public-surface replay found no new findings, but active P1 evidence still blocks a PASS verdict
- rotation status: correctness, security, traceability, maintainability, release-readiness replay, and cross-runtime parity replay are complete
- blocked/productive carry-forward: do not re-run broad historical old-skill searches; only re-read exact active-finding lines if files changed
- required evidence: current file:line evidence for any claimed resolution of ADR/spec/plan/resource-map current-state drift or workflow `standards_contract.baseline` inversion

## Assessment

Dimensions addressed: cross-runtime public-surface parity replay
