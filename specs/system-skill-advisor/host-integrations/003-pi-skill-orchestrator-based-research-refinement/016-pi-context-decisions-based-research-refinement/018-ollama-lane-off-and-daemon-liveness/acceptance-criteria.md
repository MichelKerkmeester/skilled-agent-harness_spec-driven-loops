---
title: "Acceptance Criteria: Phase 18: ollama-lane-off-and-daemon-liveness"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "ollama lane off and daemon liveness acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/018-ollama-lane-off-and-daemon-liveness"
    last_updated_at: "2026-11-19T14:42:56Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-018-ollama-lane-off-and-daemon-liveness"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 18: ollama-lane-off-and-daemon-liveness

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** `018-ollama-lane-off-and-daemon-liveness`
**Level:** 2
**Status:** Complete
**Date:** 2026-11-19
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the default weight and an embedder that answers, When one prompt is scored with `VITEST` stubbed off, Then the embed spy records 0 calls; with `SPECKIT_ADVISOR_LANE_WEIGHTS_JSON` setting the lane to 0.05 it records 1 | guard test 2 of 2 green, red 1 of 2 without the guard | Met | - |
| AC-002 | REQ-002 | Given the registry, When it loads with no env override, Then `semantic_shadow` has weight 0 and `live: true` | `defaultWeight: 0, ... live: true`; semantic-lane-promotion green | Met | - |
| AC-003 | REQ-003 | Given a running server, When its parent pid changes, Then it calls `shutdownAdvisor` and exits 0 within 60 s | liveness test green; live SIGKILL of launcher 53046, server 53060 exited after 6 s | Met | - |
| AC-004 | REQ-004 | Given a launcher with a child, When the heartbeat file is older than 3 minutes, Then the child gets SIGTERM and SIGKILL after 5 s; a fresh file or no file yet leaves it running | watchdog tests 7 of 7 green, red 7 of 7 without it; live SIGSTOP reaped after 245 s | Met | - |
| AC-005 | REQ-005 | Given the labeled corpus, When it is scored at weight 0.05 and at 0, Then the none-gold fire count does not rise; otherwise the default stays 0.05 | 5 none-gold fires at 0.05 and 5 at 0 in both regimes | Met | - |
| AC-006 | REQ-006 | Given weight 0, When `advisor_status` runs, Then it reports `lane_weight_zero` and `laneEnabled: false`, and a recommend call carries no `semantic_lane_off` warning | status pair 40 of 40 green, red 8 of 40 without the change | Met | - |
| AC-007 | REQ-007 | Given an `auto` pointer, When `ensureActiveEmbedder` runs, Then the pointer names the one registered manifest and the cascade is not called | pointer test 5 of 5 green, cascade spy never called | Met | - |
| AC-008 | REQ-008 | Given the runtime, When it is searched, Then `refreshSkillEmbeddingsLegacy` is gone and a refresh with no pointer embeds nothing | `rg -c refreshSkillEmbeddingsLegacy` prints nothing; refresh-roundtrip green | Met | - |
| AC-009 | REQ-009 | Given an unset `SPECKIT_SKILL_ADVISOR_MODEL_SERVER_ENABLED`, When the launcher starts, Then it arms no hf demand listener; `1` arms it | hf test 13 of 13 green, red 5 of 13 without the change | Met | - |
| AC-010 | REQ-010 | Given the docs, When they are searched, Then none states 0.05 as the live semantic weight, `SKILL.md` is 1.2.0.0 and `changelog/v1.2.0.0.md` exists | docs leaf accept checks; `version: 1.2.0.0`; `changelog/v1.2.0.0.md` exists | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT
<!-- FILL: Write Yes or No and one sentence. Name a criterion by its id only when it blocks closure. Never write a count of criteria or an id range, because every added row makes it wrong. GOOD: No. AC-002 is unmet. WEAK: All eight criteria AC-001 to AC-008 are met. -->

**Closeable:** Yes

Yes. Every criterion is met with observed evidence.
<!-- /ANCHOR:closure -->
