---
title: "Goal: Phase 9: mirror-and-template-fixes"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "mirror and template fixes goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/075-doctor-sk-skill-command/009-mirror-and-template-fixes"
    last_updated_at: "2026-10-30T07:05:00Z"
    last_updated_by: "code-agent"
    recent_action: "Implemented both decisions and met every completion criterion"
    next_safe_action: "Record the template fix in the sk-create-skill changelog, then hand the program to phase 10"
    blockers: []
    key_files:
      - ".skilled/commands/doctor/_routes.yaml"
      - ".skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml"
      - ".skilled/commands/doctor/scripts/tests/doctor-runtime-mirrors-contract.test.cjs"
      - ".skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-leaf-manifest-config-template.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-009-mirror-and-template-fixes"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 9: mirror-and-template-fixes

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make `/doctor:runtime-mirrors` check the Hermes skill copies CI already checks, and remove the stale router-in-SKILL.md wording from the skill templates.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The route gains `sync-skills-hermes.cjs --check` and `sync-prompts-hermes.cjs --check`, the two Hermes checks CI runs. |
| D2 | An absent `.hermes/` directory gives an n/a row and is never created. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `rg -c "sync-skills-hermes.cjs --check"` prints 1 or more for both `.skilled/commands/doctor/_routes.yaml` and `.skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml`
- [x] `rg -c "sync-prompts-hermes.cjs --check"` prints 1 or more for both `.skilled/commands/doctor/_routes.yaml` and `.skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml`
- [x] `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0
- [x] `node --test .skilled/commands/doctor/scripts/tests/doctor-runtime-mirrors-contract.test.cjs` exits 0
- [x] `rg -n "in-SKILL.md router" .skilled/skills` exits 1
- [x] `skill-leaf-manifest-config-template.json` parses with `JSON.parse` without error
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
| Phase planned | Done | Spec docs authored 2026-10-30 |
| Hermes checks in the route and workflow | Done | `route-validate.sh` exit 0, 46 invocations from 44, `rg -c` prints 1 per file for both checks |
| Contract test | Done | 7 tests pass, and each of the four removals fails the run (`scratch/contract-fail-proof.md`) |
| Template wording | Done | `rg -n "in-SKILL.md router" .skilled/skills` exit 1, template still parses with the same keys |
| Gates | Done | `run-all.sh` 7 suites, `create-journey-proof.test.cjs` 1 test, `validate.sh --strict` at close |

### Deviations and findings

| Item | Note |
|------|------|
| CI also runs `sync-prompts-hermes.cjs --check` | Seen at `command-tree-parity.yml:122`; brought into scope on 2026-10-30 because the operator keeps nothing deferred |
| Each step names the `--check` command itself | The requirement measures the literal `<script> --check` string in both files, so a step naming only the asset key would leave that string absent from the workflow |
| The manual drift run was a checker-level run | No runtime was attached, and the tracked `.hermes/` tree was outside this run's write authority, so the skills cycle used `HERMES_SKILLS_OUTPUT_DIR` against a scratch copy (`scratch/t010-drift-transcript.md`) |
| The prompts drift half ran on the tracked tree | That checker takes no output-root override, so the conductor edited one `.hermes/prompts` copy in the worktree, saw `STALE` with exit 1, and restored it with the generator |
| The template changelog entry is not written | `.skilled/skills/sk-doc/sk-create-skill/changelog/` is outside this run's write authority; `tasks.md` marks the item `[B]` and `007-docs-and-changelogs` owns it |
| The workflow `purpose` line was extended | It now names `.pi` and `.hermes`, a one-line change beyond the frozen list, made because the sentence would otherwise be wrong once the Hermes rows ship |
| The new steps inline the full command | REQ-001 measures the literal `<script> --check` in the workflow, so the two steps name the command instead of saying `with --check` as their neighbours do |
<!-- /ANCHOR:log -->
