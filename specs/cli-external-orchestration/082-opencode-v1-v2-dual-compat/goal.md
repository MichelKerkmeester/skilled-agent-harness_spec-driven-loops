---
title: "Goal: OpenCode v1 and v2 dual compatibility"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/082-opencode-v1-v2-dual-compat"
    last_updated_at: "2026-10-18T15:00:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "opencode-dual-compat-build"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: OpenCode v1 and v2 dual compatibility

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make every repo plugin, agent, command, skill, guard and config file run on OpenCode 1.19.3 and 2.0.32, and cli-opencode dispatch to both, so that: all 11 phase children report `RESULT: PASSED` under `validate.sh --recursive --strict` on this packet; all 16 plugins load on v1 and show active in v2 `/api/plugin`; the `/doctor:opencode` battery exits 0 on both versions; `.skilled/hooks/dispatch/lib/dispatch-audit.mjs` classifies and evaluates `opencode2 run`; `run-all-drift-guards.sh` exits 0; and the cli-opencode `SKILL.md` names OpenCode 1.19.3, OpenCode 2.0.32 and a verification date.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Each plugin default-exports one plain object `{ id, setup, server }`, never a function carrying `.id` |
| D2 | `opencode.json` stays in the v1 shape: the singular `permission` map and `mcp.<name>` entries, with no `permissions`, `plugins` or `disabled` key |
| D3 | Version comes from parsed `--version`, never the binary name. Every v2 child uses `run --standalone` |
| D4 | No phase runs `opencode upgrade --major`, changes the operator's installs or restarts the v2 service. Install proofs use throwaway prefixes |
| D5 | Targets are 1.19.3 and 2.0.32: `@opencode-ai/plugin` 1.19.3 exact, zod declared, `@opencode/plugin` 2.0.32 type-only |
| D6 | Code goes to GPT-6 Luna max fast via cli-codex. Docs, probes and review go to DeepSeek V4.1 Flash max via cli-devin. Each reviews the other, and the orchestrator reruns every test |
| D7 | Changed code follows the sk-code OPENCODE surface, and changed docs follow their sk-doc mode |
| D8 | The public claim is scoped: verified on 1.19.3 and 2.0.32 on a stated date, with a documented capability delta, and later versions unsupported until re-verified |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001-unknowns-and-baseline | `001-unknowns-and-baseline/goal.md` |
| 002-pins-imports-dual-export | `002-pins-imports-dual-export/goal.md` |
| 003-hard-plugins | `003-hard-plugins/goal.md` |
| 004-agents-commands-config | `004-agents-commands-config/goal.md` |
| 005-version-aware-guards | `005-version-aware-guards/goal.md` |
| 006-cli-opencode-dual-dispatch | `006-cli-opencode-dual-dispatch/goal.md` |
| 007-install-guidance-and-setup-helper | `007-install-guidance-and-setup-helper/goal.md` |
| 008-doctor-and-ci | `008-doctor-and-ci/goal.md` |
| 009-sk-code-opencode-alignment | `009-sk-code-opencode-alignment/goal.md` |
| 010-documentation-sweep | `010-documentation-sweep/goal.md` |
| 011-two-version-proof-and-closeout | `011-two-version-proof-and-closeout/goal.md` |

**Precedence.** Decisions above outrank child detail. Child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] All 11 phase children report `RESULT: PASSED` under `validate.sh --recursive --strict` on this packet
- [ ] All 16 plugins load on v1 and show active in v2 `/api/plugin`
- [ ] The `/doctor:opencode` battery exits 0 on both versions
- [ ] `.skilled/hooks/dispatch/lib/dispatch-audit.mjs` classifies and evaluates `opencode2 run`
- [ ] `run-all-drift-guards.sh` exits 0
- [ ] The cli-opencode `SKILL.md` names OpenCode 1.19.3, OpenCode 2.0.32 and a verification date
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
| Phase tree scaffolded | Done | 11 children created under this packet |
| 001 unknowns and baseline | Done | findings.md Q1 to Q11, baseline.json: v1 16 of 16 loaded, v2 0 of 16 active |

### Deviations and findings

| Item | Note |
|------|------|
| sk-vision bundle | `vision-runtime/dist/` is a build output missing from a fresh worktree, so 001 builds it before the baseline |
<!-- /ANCHOR:log -->
