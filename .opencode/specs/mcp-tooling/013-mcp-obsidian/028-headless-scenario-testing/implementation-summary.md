# Implementation Summary — mcp-obsidian headless scenario testing

## Final state: complete — shipped to v4

Both testing follow-ups from packet 027 are done: `OBS-013` runs fully offline via a shipped BRAT release fixture, and the plugin-scenario regression harness now lives in the skill.

## What changed

- **BRAT offline fixture** — `assets/plugins/obsidian42-brat/release.example.json` (captured GitHub release shape: tag + `main.js`/`manifest.json` asset entries) plus `sample-beta-plugin/{main.js,manifest.json}`, an inert but valid/parseable stand-in plugin. The `OBS-013` tie-in gained a **Fixture mode (no network)** stage variant that copies from the fixture instead of `curl`; its OVERVIEW, orchestration note, source anchors, and the root playbook prereq line now present the offline path as the default.
- **Harness** — `scripts/run-scenarios.sh`: the 11-scenario (`OBS-011`..`OBS-021`) runner, generalized out of scratch. Self-locating via `BASH_SOURCE`, optional workdir arg, copies `examples/` + `assets/` into each disposable throwaway-vault workspace, dispatches one sandboxed `cli-codex` runner per scenario, and prints a per-scenario `RESULT: PASS/FAIL/SKIP` summary (non-zero exit on any FAIL). Documented in `scripts/README.md`.
- **Housekeeping** — SKILL.md 0.15.0.0 → 0.16.0.0; `changelog/v0.16.0.0.md`; regenerated `mcp-tooling/leaf-manifest.json`.

## How

Done directly in an isolated worktree from `origin/skilled/v4.0.0.0` — investigate → author fixture → wire fixture mode → relocate harness → prove offline → validate → ship. No fan-out; the work is fixture authoring and doc wiring, not a rewrite.

## Verification (all passed)

- **OBS-013 offline proof** — deterministic `bash`+`jq` against a throwaway vault, no network, no LLM: stage (assets staged non-empty), register (`sample-owner/obsidian-sample-beta` + frozen `1.0.0-beta.1` in BRAT `data.json`), and activate (`obsidian-sample-beta` in `community-plugins.json`) all verify independently.
- `validate_document.py`: **0 issues** on `brat-headless-install.md`, `manual-testing-playbook.md`, `scripts/README.md`, `changelog/v0.16.0.0.md`, `SKILL.md`.
- `jq empty` passes both JSON fixtures; `node --check` passes `main.js`; `bash -n` passes `run-scenarios.sh`; leaf-manifest `--check` OK.
- Scope: **0** staged files outside `.opencode/skills/mcp-tooling/`; all 3 new fixture links resolve on disk.

## Scar tissue

- `validate_document.py` treats the BRAT tie-in as `playbook_feature` (its own 4-key frontmatter), not the 6-key skill-reference template — so edits had to stay additive within the existing playbook structure, not impose the reference-doc shape.
- The harness genuinely needs the `codex` CLI; the *proof* of OBS-013 does not (plain bash+jq), which is the check that actually gates the fixture's correctness.

## Follow-ups (separate, on-disk — not a repo change)

- Real-vault Iconic file/folder/tag-rule parity across the vaults + cleanup of the `.bak-ribbon-menu` backups. Tracked here but executed directly on disk with fresh backups, since it is not a v4 commit.
