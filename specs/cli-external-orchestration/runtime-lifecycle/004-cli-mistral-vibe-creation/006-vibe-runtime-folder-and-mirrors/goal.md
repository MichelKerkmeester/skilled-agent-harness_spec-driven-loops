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
    recent_action: "Planned the .vibe runtime folder and its generated mirrors from the research phase plan"
    next_safe_action: "Wait for phase 005's mode packet, then run T001"
    blockers:
      - "Phase 005's mode packet does not exist yet"
    key_files:
      - "../001-deep-research/research/research.md"
      - "../005-cli-mistral-vibe-skill-packet/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "mistral-support-2026-11-14"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Which source claims a skill name first, skill_paths or .vibe/skills?"
      - "Does --trust from a repository subdirectory apply the root .vibe/config.toml?"
      - "Which phase wires the three --check commands into the pre-commit mirror gate and CI?"
    answered_questions: []
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

- [ ] `node .skilled/skills/system-spec-kit/runtime/cli/vibe/sync-agents-vibe.cjs --check`, `sync-skills-vibe.cjs --check` and `sync-prompts-vibe.cjs --check` each exit 0
- [ ] `~/.local/share/uv/tools/mistral-vibe/bin/python scratch/validate-config.py .vibe/config.toml scratch/vibe-config-schema.json` prints `valid`
- [ ] `jq -r .exit_code scratch/strict-load/export.json` prints `0`
- [ ] `find ~/.vibe -newer scratch/run-start.marker | wc -l` prints `0`
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
| Phase 005 mode packet | Blocked | Phase 005 has not run |
| `.vibe/` folder | Pending | `ls .vibe` printed No such file or directory on 2026-11-14 |

### Open questions

- Open question: Which source claims a skill name first, `skill_paths` or `.vibe/skills` (research question 5)? UNKNOWN. D3 avoids the collision until a fixture settles it.
- Amended 2026-11-14: the phase plan's handoff read "`vibe config schema` accepts the config under `--trust`", but `vibe config schema --help` prints only "Usage: vibe config schema" and takes no file. The handoff is now schema validation (T009) plus a strict-config load under `--trust` (T012).
- Open question: Does `--trust` from a subdirectory of the repository apply the root `.vibe/config.toml`? UNKNOWN until T012 runs.
- Open question: Which phase wires the three `--check` commands into the pre-commit mirror gate and CI, as `.dsh` has? The phase plan names no owner.

### Deviations and findings

| Item | Note |
|------|------|
| Handoff wording | `vibe config schema` only prints a schema, so T009 and T012 together stand in for "accepts the config under `--trust`" |
<!-- /ANCHOR:log -->
