# Iteration 4 — kimi

**Angle:** Documented-but-removed: doc/changelog claims for features no longer in code (dead refs, legacy names, opencode-go remnants).

**Findings:** 6

- **[P1] dead** `.opencode/commands/deep/assets/deep_context_presentation.txt:371` — Deep context example references removed opencode-go provider
  - evidence: --executor=cli-opencode --model=opencode-go/deepseek-v4-pro --prompt-framework=tidd-ec --label=deepseek
  - fix: Replace the example model with deepseek/deepseek-v4-pro (or another supported cli-opencode provider) and verify the pool example reflects current options.
- **[P1] drift** `.opencode/skills/deep-loop-workflows/deep-ai-council/SKILL.md:20` — AI council docs claim OpenCode uses removed opencode-go gateway models
  - evidence: the active CLI's own model bench (e.g. Opus + Sonnet + Haiku on Claude Code; gpt-5.5 + gpt-5.5-pro + gpt-5.5-xhigh on Codex; opencode-go gateway models on OpenCode) supplies the seat diversity for a round
  - fix: Update the OpenCode seat-diversity example to current supported providers/models (e.g., deepseek/deepseek-v4-pro) and remove the opencode-go gateway claim.
- **[P1] dead** `.opencode/skills/deep-loop-workflows/deep-ai-council/references/patterns/seat_diversity_patterns.md:64` — Seat-diversity table lists opencode-go gateway as a cli-opencode model option
  - evidence: model via `opencode-go/*` gateway (`deepseek-v4-pro`, `kimi-k2.6`, `glm-5.1`, etc.) or direct provider (`deepseek/deepseek-v4-pro`, `openai/gpt-5.5-pro`); `--variant low/medium/high`
  - fix: Remove the opencode-go/* gateway column and keep only currently supported direct providers in the cli-opencode row.
- **[P1] dead** `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/live-executor.cjs:41` — Skill benchmark default model is the removed opencode-go/deepseek-v4-pro
  - evidence: const DEFAULT_MODEL = process.env.SKILL_BENCH_OPENCODE_MODEL || 'opencode-go/deepseek-v4-pro';
  - fix: Change the default to deepseek/deepseek-v4-pro and update any docs/scripts that reference the old default.
- **[P1] dead** `.opencode/skills/system-spec-kit/mcp_server/tests/matrix-adapter-opencode.vitest.ts:36` — Matrix adapter test expects removed opencode-go model invocation
  - evidence: 'opencode', [ 'run', '--model', 'opencode-go/deepseek-v4-pro', '--variant', 'high', ... ]
  - fix: Update the expected spawn args to use deepseek/deepseek-v4-pro so the test matches the current cli-opencode default.
- **[P2] contradiction** `.opencode/skills/cli-opencode/changelog/v1.3.15.0.md:39` — Changelog claims manual_testing_playbook still contains opencode-go scenarios that no longer exist
  - evidence: The `manual_testing_playbook/` test suite still references opencode-go, including two scenario files dedicated to the gateway path (`07--prompt-templates/deepseek-v4-via-opencode-go-with-sk-prompt-models.md` and `kimi-k2-6-via-opencode-go-with-sk-prompt-models.md`).
  - fix: Remove or update the Open section now that the referenced opencode-go scenario files are absent from manual_testing_playbook/.
