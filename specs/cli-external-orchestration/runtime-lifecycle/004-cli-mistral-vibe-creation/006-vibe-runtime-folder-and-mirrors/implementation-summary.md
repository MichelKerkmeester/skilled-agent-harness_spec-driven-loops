---
title: "Implementation Summary"
description: "The repository now has a .vibe/ runtime folder: a hand-written config that closes the roster by model name, three generators with drift checks, and a sync manifest."
trigger_phrases:
  - "vibe runtime folder implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/006-vibe-runtime-folder-and-mirrors"
    last_updated_at: "2026-11-14T17:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Built .vibe/: config, three generators with --check, SYNC.md; strict load and roster close proven"
    next_safe_action: "Phase 007 builds dispatch recognition and the six rule checks"
    blockers: []
    key_files:
      - ".vibe/config.toml"
      - ".vibe/SYNC.md"
      - "scratch/allowed-models-probe.md"
      - "scratch/trust-probe.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "mistral-support-2026-11-14"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Which source claims a skill name first, skill_paths or .vibe/skills?"
      - "Which phase wires the three --check commands into the pre-commit mirror gate and CI?"
    answered_questions:
      - "allowed_models matches model names, not aliases"
      - "--trust from a subdirectory does not apply the root config"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-vibe-runtime-folder-and-mirrors |
| **Completed** | 2026-11-14 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Vibe now finds this repository's agents, skills and command prompts in `.vibe/`, and its config closes the model roster to the two Mistral rows. Two facts surfaced on the way, and both changed the docs. `allowed_models` matches model names, not aliases. And the repository config applies only when the checkout root is trusted, which `--trust` from a subdirectory does not do.

### Phase 6: vibe-runtime-folder-and-mirrors

The generators port the dsh ones. Agents carry only `description` and `instructions`, because any other key becomes a Vibe config override. The skills farm refuses a duplicate skill `name`, because Vibe would shadow the second claimant.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.vibe/config.toml` | Created | Provider, two rows at `thinking = "max"`, `allowed_models` by name |
| `.vibe/agents/*.toml` | Created | 11 generated profiles |
| `.vibe/skills/` | Created | 56 generated relative links |
| `.vibe/prompts/` | Created | 45 generated pointer stubs |
| `.vibe/SYNC.md` | Created | Sync manifest and drift commands |
| `.skilled/skills/system-spec-kit/runtime/cli/vibe/sync-{agents,skills,prompts}-vibe.cjs` | Created | Generators with `--check` |
| `scratch/validate-config.py` | Created | TOML-against-schema validator |
| `cli-mistral-vibe` references and `SKILL.md` | Modified | `allowed_models` by name; trust from a subdirectory |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The generators, `SYNC.md` and the validator came from OpenCode dispatches on `mistral/deepseek-v4-1-flash-1017#max`, one file per brief. The orchestrator wrote the 25-line config and ran every check, the keyed probes included. Reading Vibe's `project.py` and `trusted_folders.py` explained why the first strict-load run left the config unapplied.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| `allowed_models` lists names | An alias list warns and closes nothing (`scratch/allowed-models-probe.md`) |
| Trust by seeding the home's `trusted_folders.toml` | A repository-root cwd is forbidden by `no-repo-root-cwd`, and `--trust` from a subdirectory does not reach the root (`scratch/trust-probe.md`) |
| Agents emit two keys | Other keys become config overrides in Vibe's `AgentProfile.from_toml` |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Config schema validation | PASS: `valid` |
| Generators `--check` | PASS: ok for all three |
| Drift and duplicate-name refusal | PASS: exit 1 each, restored after regeneration |
| Strict load with the root trusted | PASS: exit `0`, both names in `allowed_models` |
| `--model mistral-medium-3.5` | PASS: `usage_error` |
| `~/.vibe` untouched | PASS: `0` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No generator tests.** The frozen file list names none. Proposed amendment: add `sync-{agents,skills,prompts}-vibe.test.mjs` beside the dsh tests.
2. **Other mirrors lag.** The dsh farm, and likely the other runtime farms, lack `cli-mistral-vibe` until they are regenerated.
3. **No CI wiring.** No phase owns adding the three `--check` commands to the pre-commit mirror gate.
<!-- /ANCHOR:limitations -->
