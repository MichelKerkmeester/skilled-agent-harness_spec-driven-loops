---
title: "Goal: Phase 6: vibe-runtime-folder-and-mirrors"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "vibe runtime folder and mirrors goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/006-vibe-runtime-folder-and-mirrors"
    last_updated_at: "2026-11-14T14:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Built .vibe/: config, three generators with --check, SYNC.md; strict load and roster close proven"
    next_safe_action: "Phase 007 builds dispatch recognition and the six rule checks"
    blockers: []
    key_files:
      - "../001-deep-research/research/research.md"
      - "../005-cli-mistral-vibe-skill-packet/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "mistral-support-2026-11-14"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Which source claims a skill name first, skill_paths or .vibe/skills?"
      - "Which phase wires the three --check commands into the pre-commit mirror gate and CI?"
    answered_questions:
      - "--trust from a subdirectory does not apply the root config; a seeded trusted_folders.toml does"
      - "allowed_models matches model names, not aliases"
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 6: vibe-runtime-folder-and-mirrors

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Give Vibe a `.vibe/` project folder whose config closes the model roster and whose agent, skill and prompt mirrors are generated from `.skilled/` and checked for drift.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | `.vibe/` follows `.dsh/SYNC.md`'s split: `config.toml` and `SYNC.md` hand-authored, agents, skills and prompts generated |
| D2 | `allowed_models` names exactly the two Mistral roster rows |
| D3 | `skill_paths` stays unset. The generated `.vibe/skills/` farm is the only project skill source |
| D4 | `hooks.toml` and `plugins/repo-guards/` are phase 008's, not this phase's |
| D5 | Every Vibe command runs with `VIBE_HOME` set to a fresh temp dir |
| D6 | No default model changes anywhere. DevPass stays the default |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `node .skilled/skills/system-spec-kit/runtime/cli/vibe/sync-agents-vibe.cjs --check`, `sync-skills-vibe.cjs --check` and `sync-prompts-vibe.cjs --check` each exit 0
- [x] `~/.local/share/uv/tools/mistral-vibe/bin/python scratch/validate-config.py .vibe/config.toml scratch/vibe-config-schema.json` prints `valid`
- [x] `jq -r .exit_code scratch/strict-load/export.json` prints `0`
- [x] `find ~/.vibe -newer scratch/run-start.marker | wc -l` prints `0`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Config | Done | `.vibe/config.toml` validates against the captured schema (`valid`); `allowed_models` has length `2` |
| Generators | Done | agents 11 of 11, skills 56 (dsh 55 plus `cli-mistral-vibe`), prompts 45 of 45; all three `--check` print ok |
| Drift | Done | Removing `.vibe/skills/sk-git` makes `--check` exit 1; regenerating restores ok. A duplicate skill `name` exits 1 and writes nothing |
| Strict load | Done | `scratch/strict-load/export.json`: exit `0`, `finished`, `allowed_models` holds both names |
| Roster close | Done | `scratch/allowed-models/export.json`: `usage_error` for `mistral-medium-3.5` |
| Home isolation | Done | `find ~/.vibe -newer scratch/run-start.marker` prints `0` |

### Open questions

- Open question: Which source claims a skill name first, `skill_paths` or `.vibe/skills` (research question 5)? UNKNOWN. D3 avoids the collision until a fixture settles it.
- Amended 2026-11-14: the phase plan's handoff read "`vibe config schema` accepts the config under `--trust`", but `vibe config schema --help` prints only "Usage: vibe config schema" and takes no file. The handoff is now schema validation (T009) plus a strict-config load under `--trust` (T012).
- Answered: `--trust` from a subdirectory does not apply the root `.vibe/config.toml`; it trusts only the subdirectory. Listing the checkout root in the fresh home's `trusted_folders.toml` does (`scratch/trust-probe.md`).
- Open question: Which phase wires the three `--check` commands into the pre-commit mirror gate and CI, as `.dsh` has? The phase plan names no owner.

### Deviations and findings

| Item | Note |
|------|------|
| allowed_models semantics | The list matches row names, not aliases. An alias list only warns and closes nothing (`scratch/allowed-models-probe.md`). Phase 005's providers, runtime-folder and SKILL docs said aliases; corrected here |
| Trust from a subdirectory | `--trust` from `scratch/` left the repository config unapplied (`allowed_models` `[]`, `mistral-medium-3.5` finished). Listing the checkout root in the fresh home's `trusted_folders.toml` applies it (`scratch/trust-probe.md`). T012 and T013 now name that setup, and the phase 005 references and `.vibe/SYNC.md` say so |
| Skill count | T006 compared against the dsh farm, which predates `cli-mistral-vibe`; the Vibe farm holds one more link, and `sync-skills-dsh.cjs --check` reports that link MISSING. Regenerating the other runtime mirrors belongs to the hub-registration and closeout phases |
| Hand-written config | `.vibe/config.toml` was written by the orchestrator, not a dispatch: it is 25 lines built from rows already proven in phase 004. The generators, `SYNC.md` and the validator came from dispatches on `mistral/deepseek-v4-1-flash-1017#max` |
| No generator tests | The frozen file list names no tests, so none were added. The dsh generators have tests under `runtime/cli/tests/`; adding `sync-*-vibe.test.mjs` is a proposed amendment |
<!-- /ANCHOR:log -->
