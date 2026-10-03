# Findings re-check (before any edit, 2026-10-03)

| # | Finding | Re-check | Result |
|---|---------|----------|--------|
| 1 | Guard covers Code Mode only | `bash check-mcp-mutation-class.sh` printed one PASS row (`mcp-code-mode/scripts/install.sh`); the six CLI scripts exist under `.skilled/skills/mcp-tooling/{mcp-figma,mcp-chrome-devtools,mcp-click-up}/scripts/` | Holds |
| 2 | Three parent-skill suites fail on `@spec-kit/shared` | `parent-skill-failures.log`: each suite fails with `FAIL: 12-lib ... Cannot find module '@spec-kit/shared/frontmatter/parse-frontmatter.js'`, plus a second failure the audit did not record: `FAIL: 13a-version: SKILL.md declares no four-part version` (the release-version check landed after the fixtures were written) | Holds, with one extra cause |
| 3 | `route-validate` never checks workflow activities | `route-validate.py` assertion I only tests that `script_invocations` paths exist | Holds |
| 4 | Codex hook parity never compared | `install-codex-hooks.mjs --check --allow-worktree` exits 0 with its OK line | Resolved by recording (see `codex-hook-parity.md`) |
| 5 | Skill-budget presentation row reads "Advisor budget/status helper" | `doctor-rebuild-presentation.txt:172` | Holds; the other three skill-budget text items are handled by `specs/sk-doc/063-description-budget` |
| 6 | `ENV-REFERENCE.md` states 144 | Line 34 said 144; the stated method gives 154 (`env-count.md`) | Holds |
| 7 | `fable-baseline.json` points at a deleted corpus | Its `target` named `.opencode/specs/skilled-agent-orchestration/144-operate-like-fable-5/...`; no such folder exists under `specs/` | Holds |
| 8 | Speckit presentation uses generic `/doctor` forms | Lines 1, 3, 31, 41, 79, 86; no root `doctor.md` exists; the loader registers `doctor/speckit.md` as `/doctor:speckit` | Holds |
| 9 | Two closed-packet statements out of date | `048/003-update/spec.md` Phase Context named the deleted `doctor-update.yaml`; `048/013` limitations 2 and 5 named the old workflow and `/doctor:update` as regeneration owner | Holds |
