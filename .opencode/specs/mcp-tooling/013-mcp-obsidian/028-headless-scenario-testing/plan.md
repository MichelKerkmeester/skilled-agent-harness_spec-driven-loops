# Plan — mcp-obsidian headless scenario testing

## Approach

Done directly in an isolated worktree from `origin/skilled/v4.0.0.0`; real vaults untouched.

1. **Investigate** the current `OBS-013` tie-in and the existing scratch harness to find why the scenario was SKIP (staging needed network or "a captured release fixture" that did not exist).
2. **Author the fixture** — `release.example.json` (GitHub release shape) + `sample-beta-plugin/{main.js,manifest.json}` (inert, valid, parseable). The plugin asset files keep their tool-mandated literal names inside a kebab subdir.
3. **Wire fixture mode** into the `OBS-013` tie-in (a no-`curl` stage variant), the OVERVIEW/orchestration notes, source anchors, and the playbook prereq line.
4. **Relocate the harness** to `scripts/run-scenarios.sh`, generalized (self-locating via `BASH_SOURCE`, workdir arg, copies `examples/` + `assets/`, aggregates a RESULT summary), documented in `scripts/README.md`.
5. **Prove + verify** — run `OBS-013` offline deterministically; validate every doc; bump version; changelog; regen leaf-manifest.
6. **Ship** — commit skill work + this record to v4 via the worktree.

## Critical files

- New: `assets/plugins/obsidian42-brat/release.example.json`, `.../sample-beta-plugin/{main.js,manifest.json}`, `scripts/run-scenarios.sh`, `changelog/v0.16.0.0.md`.
- Edited: `manual-testing-playbook/plugin-tie-ins/brat-headless-install.md`, `manual-testing-playbook/manual-testing-playbook.md`, `scripts/README.md`, `SKILL.md`, `mcp-tooling/leaf-manifest.json`.

## Verification

- Offline `OBS-013`: bash+jq run against a throwaway vault; stage/register/activate all verify; JSON parses; no network call.
- `validate_document.py` exit 0 on all edited docs; `jq empty` on fixtures; `node --check` on `main.js`; `bash -n` on the harness; leaf-manifest `--check` OK.
- 0 staged files outside `.opencode/skills/mcp-tooling/`; all new doc links resolve on disk.

## Risk note

Low-blast, reversible — additive test assets, docs, and a script; no runtime code and no vault data. The fixture plugin is intentionally inert, so there is no risk of it being mistaken for a real plugin. The one judgment call is that `run-scenarios.sh` depends on the `codex` CLI; it fails fast with a clear message when absent, and the offline proof of `OBS-013` itself needs neither codex nor network.
