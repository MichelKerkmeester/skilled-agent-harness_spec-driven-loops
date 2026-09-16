---
title: "Goal: settle the layout-deciding behaviors by live probe"
description: "The durable directive for the phase that answers, in disposable clones and read-only lanes, the nine runtime and git questions phase 004 needs before it chooses what .opencode becomes."
trigger_phrases:
  - "skilled layout probes goal"
  - "layout probe completion criteria"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/003-layout-probes"
    last_updated_at: "2026-09-16T18:17:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Authored the phase directive and probe plan"
    next_safe_action: "Run T001 shared setup, then the probes in tasks.md order"
    blockers: []
    key_files:
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "041-003-goal"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Can Claude Code, Cursor Agent and Codex authenticate with isolated config directories?"
    answered_questions: []
---
# Goal: settle the layout-deciding behaviors by live probe

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Answer the nine runtime and git questions that decide what `.opencode/` becomes, each by a live probe or a cited source line, without changing either checkout or this machine's home config.

### Decisions

Frozen. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Probes run in clones under `/tmp/skilled-probes-003/` with the remote removed and git hooks redirected. Status captures and home-file hashes taken before and after prove nothing else changed. |
| D2 | DeepSeek V4.1 Flash max on cli-pi reads source with read-only tools, one brief and one record per unit. The orchestrator runs every runtime, git and home-scan command and opens every citation a lane returns. |
| D3 | Every live row runs on an unmodified baseline clone first. A baseline that shows nothing marks the method blind, never a negative result. |
| D4 | A question that cannot be probed without touching a checkout or home config gets a recorded reason, not an inferred answer. |

### Operator copy

A change here that alters a parent decision or criterion is applied to the parent first.
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] Nine probe records under `probes/` each give a result or a recorded reason
- [ ] Every citation in a lane-produced record is marked matched or struck
- [ ] Both checkouts and every guarded home file match their pre-probe captures, apart from `probes/` and this phase's documents
- [ ] Every probe record ends with its shape A, B and C implication lines
- [ ] The phase validates PASSED with every acceptance criterion Met
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Phase plan | Done | `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md` and this goal, authored 2026-09-16 |
| Probes | Pending | `tasks.md` T001 to T025 |

### Deviations and findings

| Item | Note |
|------|------|
| The home scan stays with the orchestrator | Parent D3 routes enumerations to DeepSeek. Home files can hold credentials, such as `~/.pi/agent/auth.json`, and a lane's reads leave the machine through the gateway, so Q8 runs locally and records only counts and key paths |
| Phase 001 hook citations drifted | Comment hygiene now sits at `pre-commit:50` and the agent filter at `pre-commit:95`, where `../001-deep-research/research/research.md:81` and `:87` cite `:49` and `:94` |
| A clone's default remote is the real repository | `git clone <path>` records the source as `origin`, so the plan removes it from every clone before any probe writes |
<!-- /ANCHOR:log -->
