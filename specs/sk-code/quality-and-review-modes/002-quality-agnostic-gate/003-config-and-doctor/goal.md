---
title: "Goal: Phase 3: config-and-doctor"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "config and doctor goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "scaffold/003-config-and-doctor"
    last_updated_at: "2026-10-26T00:00:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-003-config-and-doctor"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 3: config-and-doctor

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Give the sk-code quality gate a committed repository config that names its own checks, and a doctor route that creates that config only after approval.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Repository commands come only from `.sk-code/quality.json` or an explicit `--config` path, as argv arrays. No surface, manifest or discovery supplies a command. |
| D2 | A command read from a manifest is a suggestion. It is never run. |
| D3 | A configured command that changes the workspace ends the run with exit 3 `CHECK_MUTATED_WORKSPACE`, and the runner reverts nothing. |
| D4 | `init` is a dry run until `--apply`, `--apply` never overwrites, and the setup battery stays read-only. |
| D5 | Repository hygiene additions tighten only the author gate. CI and pre-commit keep the core set and whole-file scope. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `node --test .skilled/skills/sk-code/sk-code-quality/scripts/tests/*.test.cjs` exits 0 and prints `# fail 0`.
- [ ] `node .skilled/commands/doctor/scripts/sk-code-setup-check.cjs` exits 0, prints a line that starts with `PASS  quality`, and ends with `STATUS=OK legs=9`.
- [ ] In a temporary git repository, `node .skilled/commands/doctor/scripts/sk-code-quality-config.cjs init --apply` run twice creates `.sk-code/quality.json` on the first run, and the second run exits 1 with `CONFIG_EXISTS` while the file stays byte-identical.
- [ ] `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0, and `.skilled/commands/doctor/_routes.yaml` contains `target: quality`.
- [ ] `node .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs` exits 0, and `rg -n "command-doctor-sk-code['\"]" .skilled/skills/system-skill-advisor/runtime` prints nothing.
- [ ] `node .skilled/skills/system-spec-kit/runtime/cli/codex/sync-prompts.cjs --check`, `node .skilled/skills/system-spec-kit/runtime/cli/pi/sync-prompts-pi.cjs --check` and `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-prompts-hermes.cjs --check` each exit 0.

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
| Spec documents authored as Draft | Done | `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `decision-record.md`, `goal.md` and `implementation-summary.md` in this folder |
| Phase 001 and phase 002 landed | Pending | Task T001 prints `present` for each runner file |
| Implementation | Pending | Tasks T005 to T039 |
| Verification and packet gates | Pending | Tasks T040 to T048 |

### Deviations and findings

| Item | Note |
|------|------|
| Design line citations | Every design citation this phase repeats held at the current tree. None moved. The two commits since the design (`2d068d4b7f`, `c3ca0efaa9`) did not shift them. |
| Bridge id rename | The design omits it. Adding a second target to `/doctor:sk-code` renames the bridge and breaks five runtime files. Taken in ADR-008. |
| Battery leg count | The design omits the change from eight legs to nine. The test, the YAML asset and the hub playbook pin `legs=8`. Taken in ADR-009. |
| Mutation guard ownership | Design section 2.2 places the guard in phase 2, while section 7 places it in phase 3. Snapshot in phase 2, wiring in phase 3 (ADR-006). |
| Design D18 | The `generated` config key has no owning phase in section 7. Its rows run as path-scoped configured checks in this phase (REQ-014). The dist per-file adapter is owned by phase 002 (its REQ-023). |
| Presentation file | The design names a new presentation text. The git precedent is one file per command, so this phase extends the existing file (ADR-010). |
| Second apply | The design says refuse, and `git-standards.cjs` says keep. This phase follows the design (ADR-007). |
| Hub version | Design section 5.5 moves the hub version in phase 5, while D21 needs a hub changelog in each phase. This phase bumps it, because its playbook pins change (T038). |
| Checker flag names | Phase 1 names are not in the design. Task T002 records them before code starts. |
<!-- /ANCHOR:log -->
