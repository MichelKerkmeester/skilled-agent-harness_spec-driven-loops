| Line | Content | Classification |
|---|---|---|
| 7 | `# The global ~/.gitignore_global ignores /.opencode/ for symlinked repos.` | comment |
| 8 | `# But THIS repo is the SOURCE of .opencode/ content — it MUST be tracked.` | comment |
| 10 | `!.opencode/` | negation |
| 52 | `.opencode/output/` | ignore rule |
| 63 | `.opencode/skills/system-skill-advisor/runtime/lib/**/*.js` | ignore rule |
| 64 | `.opencode/skills/system-skill-advisor/runtime/lib/**/*.js.map` | ignore rule |
| 65 | `.opencode/skills/system-skill-advisor/runtime/lib/**/*.d.ts` | ignore rule |
| 66 | `.opencode/skills/system-skill-advisor/runtime/lib/**/*.d.ts.map` | ignore rule |
| 67 | `.opencode/skills/system-skill-advisor/runtime/schemas/**/*.js` | ignore rule |
| 68 | `.opencode/skills/system-skill-advisor/runtime/schemas/**/*.js.map` | ignore rule |
| 69 | `.opencode/skills/system-skill-advisor/runtime/schemas/**/*.d.ts` | ignore rule |
| 70 | `.opencode/skills/system-skill-advisor/runtime/schemas/**/*.d.ts.map` | ignore rule |
| 75 | `.opencode/skills/system-spec-kit/runtime/lib/**/*.js` | ignore rule |
| 76 | `.opencode/skills/system-spec-kit/runtime/lib/**/*.js.map` | ignore rule |
| 77 | `.opencode/skills/system-spec-kit/runtime/lib/**/*.d.ts` | ignore rule |
| 78 | `.opencode/skills/system-spec-kit/runtime/lib/**/*.d.ts.map` | ignore rule |
| 79 | `.opencode/skills/system-spec-kit/shared/**/*.js` | ignore rule |
| 80 | `.opencode/skills/system-spec-kit/shared/**/*.js.map` | ignore rule |
| 81 | `.opencode/skills/system-spec-kit/shared/**/*.d.ts` | ignore rule |
| 83 | `!.opencode/skills/system-spec-kit/shared/js-yaml.d.ts` | negation |
| 84 | `.opencode/skills/system-spec-kit/shared/**/*.d.ts.map` | ignore rule |
| 85 | `.opencode/skills/system-spec-kit/runtime/cli/tests/*.vitest.d.ts.map` | ignore rule |
| 86 | `.opencode/skills/system-spec-kit/runtime/cli/tests/*.vitest.js.map` | ignore rule |
| 108 | `.opencode/skills/.state/*/*` | ignore rule |
| 109 | `!.opencode/skills/.state/*/README.md` | negation |
| 112 | `.opencode/skills/.authority-state/` | ignore rule |
| 113 | `.opencode/skills/.spec-gate-state/` | ignore rule |
| 118 | `.opencode/skills/system-deep-loop/runtime/database/*.sqlite` | ignore rule |
| 119 | `.opencode/skills/system-deep-loop/runtime/database/*.sqlite-shm` | ignore rule |
| 120 | `.opencode/skills/system-deep-loop/runtime/database/*.sqlite-wal` | ignore rule |
| 121 | `.opencode/skills/system-deep-loop/runtime/database/*.sqlite.bak*` | ignore rule |
| 122 | `.opencode/skills/system-deep-loop/runtime/database/observability-events.jsonl` | ignore rule |
| 127 | `.opencode/skills/system-skill-advisor/runtime/database/*.db` | ignore rule |
| 128 | `.opencode/skills/system-skill-advisor/runtime/database/*.db-*` | ignore rule |
| 129 | `.opencode/skills/system-skill-advisor/runtime/database/*.sqlite` | ignore rule |
| 130 | `.opencode/skills/system-skill-advisor/runtime/database/*.sqlite-*` | ignore rule |
| 131 | `.opencode/skills/system-skill-advisor/runtime/database/*.sqlite.bak*` | ignore rule |
| 132 | `.opencode/skills/system-skill-advisor/runtime/database/.system-skill-advisor-launcher.json` | ignore rule |
| 133 | `.opencode/skills/system-skill-advisor/runtime/database/.system-skill-advisor-launcher.lockdir/` | ignore rule |
| 134 | `.opencode/skills/system-skill-advisor/runtime/database/skill-graph.json` | ignore rule |
| 139 | `.opencode/skills/*/mcp-server/database/.*-owner.json` | ignore rule |
| 140 | `.opencode/skills/*/runtime/database/.*-owner.json` | ignore rule |
| 141 | `.opencode/skills/*/mcp-server/database/.*-launcher.lockdir/` | ignore rule |
| 142 | `.opencode/skills/*/runtime/database/.*-launcher.lockdir/` | ignore rule |
| 152 | `.opencode/commands/deep/assets/compiled/manifest.jsonl` | ignore rule |
| 162 | `.opencode/skills/system-skill-advisor/runtime/config/route-exclusions.local.json` | ignore rule |
| 163 | `.opencode/skills/system-skill-advisor/runtime/data/shadow-deltas.jsonl` | ignore rule |
| 164 | `.opencode/skills/system-skill-advisor/runtime/data/shadow-deltas.jsonl.*` | ignore rule |
| 169 | `.opencode/skills/system-spec-kit/runtime/.opencode/` | ignore rule |
| 170 | `.opencode/skills/system-spec-kit/runtime/skill_advisor/scripts/out/*.json` | ignore rule |
| 175 | `/*/**/.opencode/logs/` | ignore rule |
| 176 | `/*/**/.opencode/skills/.advisor-state/` | ignore rule |
| 177 | `/*/**/.opencode/skills/.spec-gate-state/` | ignore rule |
| 182 | `/*/**/.opencode/skills/.state/` | ignore rule |
| 187 | `.opencode/bin/lib/compiled-routing/*/activation/manifest-race-*/` | ignore rule |
| 188 | `.opencode/bin/lib/compiled-routing/*/activation/manifest-test-*/` | ignore rule |
| 189 | `.opencode/bin/tests/.sandboxes/` | ignore rule |
| 236 | `.opencode/agents/.provider-backups/` | ignore rule |
| 237 | `.opencode/skills/system-spec-kit/manual-testing-playbook/_sandbox/*/fixtures/states/*.tar.gz` | ignore rule |
| 275 | `.opencode/barter` | ignore rule |
| 287 | `.opencode/hooks/hook-flags.env` | ignore rule |
| 309 | `.opencode/skills/system-spec-kit/runtime/database/` | ignore rule |
