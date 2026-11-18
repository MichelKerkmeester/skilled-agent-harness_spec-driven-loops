---
title: "Goal: Drift-Guard Probe Script Errors"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "drift guard probe script errors goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/013-drift-guard-probe-script-errors"
    last_updated_at: "2026-11-18T17:10:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Authored the durable directive"
    next_safe_action: "Start task T001 once phase 011 is complete"
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "20078428-5166-43d7-85ac-a68d9210f82f"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Drift-Guard Probe Script Errors

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** The sk-code drift-guard gate passes because the ten archived review probes it flags meet its shebang, strict-mode and module-header rules.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | No path is excluded from the guard, and no probe moves into an `evidence`, `scratch` or `z_archive` folder. Either one weakens the check instead of meeting it |
| D2 | Each file changes at its top only: the shebang becomes `#!/usr/bin/env bash`, the strict-mode line is exactly `set -uo pipefail` and the TypeScript header is a three-line `MODULE:` comment block. No `set -e` and no body edit |
| D3 | The edits land in another packet's files, under `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/`. That packet's docs stay untouched |
| D4 | Built by the parent's Luna swarm with the Vibe fallback, one file per brief, in waves of at most four. The conductor runs `bash -n` and the gate. WARN rows stay out of scope |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh` exits 0 from the repository root
- [x] `bash -n` exits 0 on each of the nine shell probes under the 008 `review/` folder
- [x] `git diff --numstat -- specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review` lists exactly ten files
- [x] `validate.sh --strict` on this phase prints `RESULT: PASSED`
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
| Phase planned | Done | `spec.md`, `plan.md` and `tasks.md` written 2026-11-18. Gate exit 1 with `Errors: 11`, all under the 008 `review/` folder |

### Deviations and findings

| Item | Note |
|------|------|
| Handoff paths | The handoff also named the `sk-git` `deepseek` probes and the `.vibe` repo-guard fixtures. The planning run shows 0 ERROR rows there. They are WARN only, because their `research` and `fixtures` segments are advisory |
| Severity reason | The 008 probes are ERROR because `review/lineages/.../probes` and `review/verify-N/probes` carry no advisory segment |
<!-- /ANCHOR:log -->
