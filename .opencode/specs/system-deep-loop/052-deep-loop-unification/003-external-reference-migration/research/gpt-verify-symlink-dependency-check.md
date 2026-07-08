**Symlink Confirmation**
- `.opencode/skills/deep-loop-workflows -> system-deep-loop`
- `.opencode/skills/deep-loop-runtime -> system-deep-loop/runtime`
- `readlink .opencode/skills/deep-loop-workflows` returned `system-deep-loop`
- `readlink .opencode/skills/deep-loop-runtime` returned `system-deep-loop/runtime`
- `git ls-files -s` shows both as tracked symlinks, mode `120000`.

**Live-Code-Path Hits**
Static docs/spec/changelog/manual-playbook mentions were excluded unless they feed an executable command/config/test path.

All live hits found are **OLD references**, not new symlink-created dependencies. Evidence: the symlinks were introduced in `6323b84342 refactor(system-deep-loop): merge deep-loop-runtime into deep-loop-workflows`; representative hit files predate that commit, or were moved from the old tree in that commit.

- `.github/workflows/agent-mirror-sync.yml:17` uses `.opencode/skills/deep-loop-workflows/...` as `CHECKER`, then `-f` and `node "$CHECKER"` at `:20`, `:34`. OLD.
- `.opencode/plugins/mk-deep-loop-guard.js:35` sets `.opencode/skills/deep-loop-workflows/mode-registry.json`; runtime read occurs through `readFileSync` at `:77`. OLD.
- `.opencode/plugins/tests/mk-deep-loop-guard.test.cjs:25,105` creates/removes a hermetic temp fixture under `deep-loop-workflows`. OLD, not dependent on the real symlink.
- `.opencode/commands/doctor/_routes.yaml:108-110` invokes `deep-loop-runtime` scripts. OLD.
- `.opencode/commands/doctor/assets/doctor_deep-loop.yaml:83-86,171-172` points at `deep-loop-runtime` DB/script paths. OLD.
- `.opencode/commands/doctor/assets/doctor_update.yaml:106-107` points at `deep-loop-runtime` DB paths. OLD.
- `.opencode/commands/doctor/assets/doctor_parent-skill.yaml:60,75` defaults/reference-implementation to `deep-loop-workflows`. OLD.
- `.opencode/commands/doctor/scripts/parent-skill-check.cjs:97` defaults target to `.opencode/skills/deep-loop-workflows`. OLD.
- `.opencode/commands/deep/ai-system-improvement.md:37,74,102` includes executable/readable `deep-loop-workflows` paths. OLD.
- `.opencode/commands/deep/skill-benchmark.md:37,83` includes executable/readable `deep-loop-workflows` paths. OLD.
- `.opencode/commands/deep/assets/deep_ai-council_auto.yaml:41,43-52,82,88,91,94,121,134,177`. OLD.
- `.opencode/commands/deep/assets/deep_ai-council_confirm.yaml:41,43-52,89,95,98,101,133,188`. OLD.
- `.opencode/commands/deep/assets/deep_agent-improvement_auto.yaml:81,83-94,146,150,159,168,174,177,180,183,186,189,192,195,198,201,207,213,217,230`. OLD.
- `.opencode/commands/deep/assets/deep_agent-improvement_confirm.yaml:87,89-100,149,153,172,181,195,198,201,204,207,210,213,216,219,222,228,240,244,248,261`. OLD.
- `.opencode/commands/deep/assets/deep_model-benchmark_auto.yaml:38,51,84,86-97,143,155,165,168,175,181,188,195,206`. OLD.
- `.opencode/commands/deep/assets/deep_model-benchmark_confirm.yaml:38,51,89,91-102,146,168,187,190,197,209,214,221,231`. OLD.
- `.opencode/commands/deep/assets/deep_research_auto.yaml:68,70-76,160,229,237,240,243,298,334,377,432-433,616,823,834-835,854,872-873,945,1018-1019,1107,1136,1193-1194,1268,1294,1328,1548-1549,1672`. OLD.
- `.opencode/commands/deep/assets/deep_research_confirm.yaml:84,86-92,174,238,243,246,249,304,336,407,516,658,667-668,688,768,792,819,875,906,965,1124`. OLD.
- `.opencode/commands/deep/assets/deep_review_auto.yaml:60,62-67,176,253,261,264,267,380,429,451,542,769,784-785,805,823-824,922,1002,1075-1076,1173,1203,1290,1386,1663`. OLD.
- `.opencode/commands/deep/assets/deep_review_confirm.yaml:58,60-65,149,228,233,236,239,356,400,510,728,742-743,763,843,925,955,1071,1191,1316`. OLD.
- `.opencode/skills/system-deep-loop/deep-ai-council/assets/runtime_capabilities.json:27-28`. OLD content carried through rename.
- `.opencode/skills/system-deep-loop/deep-improvement/assets/agent_improvement/improvement_config.json:34-35`. OLD content carried through rename.
- `.opencode/skills/system-deep-loop/deep-improvement/assets/agent_improvement/target_manifest.jsonc:16,21,25`. OLD content carried through rename.
- `.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/*.json` at line `7` or `8` in each profile points fixture dirs through `deep-loop-workflows`. OLD content carried through rename.
- `.opencode/skills/system-deep-loop/deep-research/assets/deep_research_config.json:59-62` and `runtime_capabilities.json:4-5`. OLD content carried through rename.
- `.opencode/skills/system-deep-loop/deep-review/assets/deep_review_config.json:57-58`, `runtime_capabilities.json:4-5`, `review_mode_contract.yaml:13,432,445`. OLD content carried through rename.
- `.opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts:26,55`. OLD.
- `.opencode/skills/system-skill-advisor/mcp_server/tests/command-binding-existence.vitest.ts:44,49,54-56`. OLD.
- `.opencode/skills/system-skill-advisor/mcp_server/tests/skill-advisor-cli-parity.vitest.ts:48,141`. OLD.

**System-Skill-Advisor Answer**
Yes. At least three tests currently pass only because `.opencode/skills/deep-loop-workflows` resolves:

- `routing-registry-drift-guard.vitest.ts:26` sets `registryPath` to `.opencode/skills/deep-loop-workflows/mode-registry.json`; `:55` immediately `readFileSync`s it.
- `command-binding-existence.vitest.ts:44` includes `deep-loop-workflows` in `HUBS`; `:49` reads `.opencode/skills/<hub>/mode-registry.json`.
- `skill-advisor-cli-parity.vitest.ts:48` includes a `deep-loop-workflows` parity row; `:141` asserts `.opencode/skills/deep-loop-workflows/SKILL.md` exists.

These are **OLD references**, not new symlink dependencies.

**Final Verdict**
SAFE TO REMOVE SYMLINKS ONCE MIGRATION LANDS

1. No new dependency on the symlink names was found.
2. The symlinks are load-bearing today only because old live references still exist.
3. Files that must be fixed before symlink removal beyond the generic reference rewrite: **none found**.