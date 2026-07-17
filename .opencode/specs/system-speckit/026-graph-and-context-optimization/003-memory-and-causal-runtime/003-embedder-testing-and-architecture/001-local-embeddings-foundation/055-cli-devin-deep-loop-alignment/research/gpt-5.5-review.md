# gpt-5.5 xhigh fast Scaffold Review — packet 059

Date: 2026-05-15
Reviewer: cli-codex (gpt-5.5, reasoning_effort=xhigh, service_tier=fast)
Session: 019e2cfe-8b33-7df3-b842-08f7d1721705
Log: `/tmp/codex-059-review.log` (7297 lines)

## Verdict

**REVISE** — the scaffold's scope assumptions are stale against the current tree. The packet's idea is correct but Phase 2 needs a smaller (and slightly different) edit set than the scaffold implies.

## Codex's substantive finding (verbatim)

> The scaffold's 6-surface count is a little stale against the current tree: `executor-config.ts` already lists `cli-devin`, and `deep-review_auto.yaml` already has an `if_cli_devin` branch, while `deep-research_auto.yaml` does not. That pushes the review toward "revise the scaffold before execution," not because the idea is bad, but because the file inventory and tests need to match reality.

The codex review session truncated before producing the full 6-dimension structured review I requested. The model produced this one critical observation, executed a series of file-read confirmations, and ran out of token budget before emitting the per-dimension verdicts. The one finding it did surface is high-signal.

## Direct verification of the finding

After the codex review returned, I ran the verification grep myself:

| Surface | cli-devin support today | Needs update in 059? |
|---|---|---|
| `executor-config.ts` validator (line 7) | YES — already lists cli-devin in `EXECUTOR_KINDS` array; has supported-model list (DEVIN_SUPPORTED_MODELS); has validation rules (`config.kind === 'cli-devin'`) | NO change needed |
| `deep-research_auto.yaml` executor switch | NO `if_cli_devin` branch | ADD branch (port the existing one from deep-review_auto.yaml) |
| `deep-review_auto.yaml` executor switch | YES — `if_cli_devin:` at line 806 already runs `devin --print --prompt-file ... --model {config.executor.model} --permission-mode {resolved_permission_mode}` | NO change needed |
| `deep-research.md` command doc, line 79 | NO — enum string lists only `native \| cli-codex \| cli-gemini \| cli-claude-code` | UPDATE string |
| `deep-review.md` command doc, line 79 | NO — same drift | UPDATE string |

**Additional drift codex didn't catch:** `executor-config.ts` line 7 actually lists SIX kinds: `native, cli-codex, cli-gemini, cli-claude-code, cli-opencode, cli-devin`. The command enum strings list only FOUR. So **cli-opencode is also missing from the command docs**, not just cli-devin. That's a second drift the packet should fix while it's editing those lines.

## Scope correction for Phase 2

| Original scope (in spec.md) | Corrected scope |
|---|---|
| "Extend deep-research + deep-review executor enum to include cli-devin" | Update enum STRINGS in 2 command docs to list all 6 kinds the validator already accepts (adds both cli-devin AND cli-opencode where missing). Validator is already correct. |
| "Update YAML dispatch switch in deep-research_auto.yaml + deep-review_auto.yaml" | Only deep-research_auto.yaml needs an `if_cli_devin` branch. deep-review_auto.yaml already has one (line 806). Port that block over. |

## Scope correction for Phase 3 + 4

Codex did NOT review these phases substantively before truncating. Hold the original scope (2 agents + cli-devin SKILL section + 2 references + 3 assets) unless a separate review surfaces concerns.

## Open items the codex review did NOT cover

1. **Phase ordering** — original ask
2. **Risk acknowledgment quality** — original ask
3. **Acceptance-criteria sharpness** — original ask
4. **Out-of-scope discipline** — original ask
5. **agent-config JSON design (JSON vs YAML, 3rd recipe for synthesis, embedded prompt contract, tool allowlist)** — original ask

These remain unevaluated. Two options:
- (a) Re-dispatch codex with a tighter prompt focused on Phases 3-4 + agent-config design (since Phase 2 is now clarified, the next-priority review is the JSON recipe shape).
- (b) Ship Phase 2 with the corrected scope, then evaluate Phases 3-4 + recipes during the work.

## Recommended next action

Apply Phase 2 with corrected scope first (it's now smaller + clearer); then re-dispatch a focused codex review for Phase 4's agent-config JSON design before authoring those JSONs. Phases 3 + 4 SKILL.md / references / iter-template work can proceed in parallel.
