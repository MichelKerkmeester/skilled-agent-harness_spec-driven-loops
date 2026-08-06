# Spec — mcp-obsidian headless scenario testing (BRAT fixture + harness)

## Status

- **Level:** 1
- **State:** complete
- **Type:** Test infrastructure + documentation (skill docs/assets/scripts; no runtime code)

## Purpose

Close the two testing follow-ups recorded in packet 027: make the BRAT headless-install scenario (`OBS-013`) runnable without network, and commit the plugin-scenario regression harness into the skill so it stops living in scratch.

## Scope

- **BRAT offline fixture** — add a captured GitHub release response and an inert stand-in beta plugin (`main.js` + `manifest.json`) under `assets/plugins/obsidian42-brat/`, and a "Fixture mode (no network)" stage variant in the `OBS-013` tie-in so the scenario stages from local files.
- **Scenario harness** — relocate the 11-scenario runner into `scripts/run-scenarios.sh`, generalized (self-locating, no scratchpad-hardcoded paths, per-scenario PASS/FAIL/SKIP summary).
- **Housekeeping** — playbook prereq line, `scripts/README.md`, SKILL.md version bump, changelog, leaf-manifest.
- **Out of scope (this packet):** the real-vault Iconic parity + `.bak` cleanup — a separate on-disk operation, not a repo change.

## Acceptance criteria

- AC1: `OBS-013` runs end-to-end offline (no network, no LLM) against a throwaway vault, with stage, register, and activate each verifying independently.
- AC2: `scripts/run-scenarios.sh` is self-locating (no `/private/tmp` scratch paths), passes `bash -n`, and copies the fixtures needed for `OBS-013` fixture mode.
- AC3: every edited doc passes `validate_document.py`; the JSON fixtures parse; `main.js` passes `node --check`; leaf-manifest `--check` passes; 0 staged files outside `mcp-tooling/`.

## Outcome

All met. Shipped to v4. The `OBS-013` offline proof passed (stage/register/activate all green). Details in `implementation-summary.md`.
