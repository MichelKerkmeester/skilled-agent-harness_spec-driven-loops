---
title: "Goal: Phase 8: doctor-and-ci"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "doctor and ci goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "scaffold/008-doctor-and-ci"
    last_updated_at: "2026-10-18T12:45:08Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-008-doctor-and-ci"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 8: doctor-and-ci

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Give the repo a repeatable doctor battery and a CI workflow that prove, for each pinned OpenCode version, that every repo plugin loads and that the repo's skills are visible.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| L1 | The battery matches the requested family to the parsed major of each candidate binary, and it never infers a family from a binary name. |
| L2 | The v1 log window starts at the byte offset recorded before the load trigger. A log that shrinks is DEGRADED. |
| L3 | The v2 leg reads only a service that already runs. With none running, the leg reports SKIP with exit 3. |
| L4 | No leg reports PASS from a `debug config` read alone. |
| L5 | The route entry in `_routes.yaml` waits for the operator's decision on Q1. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `node .skilled/commands/doctor/scripts/opencode-version-battery.cjs --family=v1 --json` exits 0 with OpenCode 1.19.3 installed.
- [ ] `node .skilled/commands/doctor/scripts/opencode-version-battery.cjs --family=v2 --json` exits 0 with the 2.0.32 service running.
- [ ] The same battery run with `--root` pointed at a copy in which one repo plugin is broken exits 1 and names that plugin.
- [ ] `/opt/homebrew/bin/actionlint .github/workflows/opencode-dual-version.yml` exits 0 with no output.
- [ ] Each leg that reports PASS names an observed plugin load or an active plugin state, and the JSON summary shows it.
- [ ] The process listing for the v2 service is the same before and after the battery runs, as the saved listings show.
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
| Planning documents filled | Done | `validate.sh --strict` output in the orchestrator report |
| Process listing before probes (T001) | Pending | Not yet run |
| v1 load trigger probe (T002) | Pending | Not yet run |
| v2 service probe (T003) | Pending | Not yet run |
| Decisions Q1 to Q9 (T004) | Pending | Not yet run |
| Fixture suite red run (T006) | Pending | Not yet run |
| Live runs (T015, T016) | Pending | Not yet run |
| Broken-copy run (T017) | Pending | Not yet run |
| actionlint (T018) | Pending | Not yet run |

### Deviations and findings

| Item | Note |
|------|------|
| v2 oracle against D4 | The brief's v2 leg reads `/api/plugin`, which the shared service serves. D4 forbids starting that service. Default in L3: SKIP when none runs. Open question Q5 in spec.md. |
| Retry rule | The brief says repeat the read until the count is stable. Iteration-017 says retry once. Default: the brief's rule, with a fixed bound. Open question Q3. |
| v1 trigger | `debug config` loads no modules (iteration-017 F3). A load trigger is needed, and none is proven yet. Open question Q4. |
| Route assets | The route schema requires a `yaml:` asset, and the brief names none. The route entry is held under L5. Open question Q1. |
| Advisor bridge | Iteration-017 item 7 is not in the brief. Open question Q2. |
| Package names | Iteration-017 left the CI package names UNKNOWN. Iteration-015 F2 gives `opencode-ai` at `1.19.3` and `@opencode/cli` at `2.0.32`, and the spec uses them. |
<!-- /ANCHOR:log -->
