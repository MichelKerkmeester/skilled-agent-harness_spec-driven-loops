# Iteration 19 — gpt55

**Angle:** Sweep remaining workflow YAMLs and test fixtures for other hardcoded legacy provider/model strings dropped in cli-opencode v1.3.15.0 (e.g., `glm-5.1`, `qwen3.6-plus`, `kimi-k2.6`, `opencode-go/kimi-k2.6`).

**Findings:** 6

- **[P2] drift** `.opencode/skills/deep-loop-runtime/tests/unit/executor-config.vitest.ts:169` — executor-config unit test uses retired opencode-go models
  - evidence: parseExecutorConfig({ kind: 'cli-opencode', model: 'opencode-go/glm-5.1', reasoningEffort: 'high' })
  - fix: Replace retired opencode-go examples with active cli-opencode model ids such as `deepseek/deepseek-v4-pro` or `kimi-for-coding/k2p7`.
- **[P2] drift** `.opencode/skills/deep-loop-runtime/tests/unit/executor-config.vitest.ts:179` — sandbox rejection fixture uses removed qwen gateway model
  - evidence: parseExecutorConfig({ kind: 'cli-opencode', model: 'opencode-go/qwen3.6-plus', sandboxMode: 'read-only' })
  - fix: Keep the sandboxMode assertion but use a current supported model id, or use a neutral non-provider placeholder if model validity is irrelevant.
- **[P2] dead** `.opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/spec-folder-literal-naming-cli-driven-slug.md:213` — manual test fallback recommends removed qwen gateway route
  - evidence: Substitute `opencode-go/qwen3.6-plus` if GLM-5.1 is unavailable.
  - fix: Remove the opencode-go fallback advice; replace with a supported route such as `deepseek/deepseek-v4-pro` or `kimi-for-coding/k2p7` depending on the test intent.
- **[P2] dead** `.opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/spec-folder-literal-naming-remediation-rule.md:228` — remediation-rule test repeats removed qwen fallback
  - evidence: Substitute `opencode-go/qwen3.6-plus` if GLM-5.1 is unavailable.
  - fix: Rewrite the failure triage to use current cli-opencode provider guidance and delete the GLM/Qwen opencode-go substitution path.
- **[P2] misalignment** `.opencode/skills/sk-prompt-models/benchmarks/003-minimax-prompt-framework/eval-rig/fixtures/fix-001-hallucinated-cli-flag/seed/flag-spec.md:8` — fixture seed lists retired GLM and Kimi models as real flags
  - evidence: - --model <id>          swe-1.6 | deepseek-v4 | glm-5.1 | kimi-k2.6
  - fix: Update the fixture's real model list to current supported ids, or make the fixture model list intentionally synthetic so it no longer asserts retired models are real.
- **[P2] dead** `.opencode/skills/sk-prompt-models/benchmarks/004-mimo-prompt-framework/eval/run-mimo-bench.cjs:14` — MiMo benchmark harness advertises removed free gateway smoke model
  - evidence: //   node run-mimo-bench.cjs --model opencode/mimo-v2.5-free   # cheap smoke
  - fix: Delete the cheap-smoke example or replace it with the active `xiaomi-token-plan-ams/mimo-v2.5-pro` path.
