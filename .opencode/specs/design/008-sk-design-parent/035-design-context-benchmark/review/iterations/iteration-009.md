# Iteration 009 - Security And Path-Guard Posture

## Dimension

Security and path-guard posture: check whether new dispatch guidance preserves model-specific guardrails and safe execution defaults.

## Review Actions

- Compared MiniMax-M3 profile dispatch gotchas with the new CO-037 manual scenario.
- Checked whether the scenario weakens permissions or contradicts model-profile guidance.

## Findings

### F-005 - P1 - MiniMax manual scenario weakens path-guard posture and contradicts model profile guidance

Hypothesis confirmed. The MiniMax profile says `variant_status: "omitted-by-default-historically"` and to omit `--variant` until accepted behavior is verified at `.opencode/skills/sk-prompt-models/references/models/minimax-m3.md:205`. It also says not to pass `--agent` at `.opencode/skills/sk-prompt-models/references/models/minimax-m3.md:206`.

The CO-037 manual test command uses `--variant high` and `--dangerously-skip-permissions` in the same live dispatch command at `.opencode/skills/cli-opencode/manual_testing_playbook/07--prompt-templates/minimax-design-context-manifest.md:50`.

The no-`--agent` requirement is preserved, but the variant flag conflicts with the profile, and the permission bypass is too broad for a scenario whose purpose is validating prompt composition and child-output proof fields.

Fix: remove `--dangerously-skip-permissions`, omit `--variant` for MiniMax unless the acceptance is verified and documented, and keep provider-missing behavior as SKIP.

Review verdict: CONDITIONAL
