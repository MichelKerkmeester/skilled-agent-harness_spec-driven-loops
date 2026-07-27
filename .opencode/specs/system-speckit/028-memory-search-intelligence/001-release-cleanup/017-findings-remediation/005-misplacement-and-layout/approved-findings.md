# Approved finding set

8 findings dispositioned CONFIRMED by phase 001 triage.

Every row was re-tested against the real tree. Re-verify against current HEAD before acting:
a concurrent session has been modifying this repository throughout.

| finding | cat | evidence command | note |
|---|---|---|---|
| `devin-01:F13` | CAT-4 | `grep -n feature-catalog .opencode/skills/sk-doc/SKILL.md` | SKILL.md layout (lines 120-134) lists `create-feature-catalog/` (a packet) but NOT the separate `feature-catalog/` directory at hub root, which exists with `feature-catalog.md` + 2 subfolders |
| `devin-01:F18` | CAT-4 | `grep -n '.github/workflows\` | .github/hooks/scripts' .opencode/skills/sk-git/changelog/v1.3.2.0.md` + `find .opencode/skills/sk-git/.github` |
| `devin-03:F10` | CAT-4 | `find .opencode/skills -path '*/doctor/scripts/tests/*'` | No `doctor/scripts/tests/` directory found under any skill; claim cannot be confirmed against the real tree |
| `devin-03:F9` | CAT-4 | `find .opencode/skills -path '*/create/assets/tests/*'` | No `create/assets/tests/` directory found under any skill; claim cannot be confirmed against the real tree |
| `devin-04:F7` | CAT-4 | `head -40 karabiner.json` | File at repo root contains personal Karabiner-Elements keyboard shortcuts (osascript clipboard-paste commands for AI workflows); personal macOS config in a public repo |
| `devin-05:F3` | CAT-4 | `ls .opencode/skills/sk-design/benchmark/reports/2026-07-06--after-009--router/` + `grep -n 'after-009\` | after-012-routing\ |
| `fanout:SOL-06` | CAT-4 | `head -40 .opencode/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs` | HUB_CHILD object lists 7 hub compilers (sk-code, system-deep-loop, mcp-tooling, cli-external-orchestration, sk-prompt, sk-design, sk-doc); phase-numbered topology confirmed (014-runtime-engine, 009-pa |
| `fanout:SOL-09` | CAT-4 | `head -7 .opencode/skills/system-spec-kit/scripts/.scan-one.sh` | Lines 5-6 embed absolute workstation paths: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/...` |
