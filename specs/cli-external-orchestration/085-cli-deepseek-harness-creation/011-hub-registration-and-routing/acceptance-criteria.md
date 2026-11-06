---
title: "Acceptance Criteria: Phase 11: hub-registration-and-routing"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "hub registration and routing acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/085-cli-deepseek-harness-creation/011-hub-registration-and-routing"
    last_updated_at: "2026-11-06T08:57:12Z"
    last_updated_by: "codex-gpt-6"
    recent_action: "Recorded verified routing results"
    next_safe_action: "Resolve the remaining checklist items"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-085-011-hub-registration-and-routing"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 11: hub-registration-and-routing

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** cli-external-orchestration/085-cli-deepseek-harness-creation/011-hub-registration-and-routing
**Level:** 2
**Status:** In Progress
**Date:** 2026-11-06
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the edited registry, When `node -e` counts `modes` in `mode-registry.json`, Then it prints 8 and the `cli-deepseek-harness` entry carries aliases `dsh`, `dsh headless` and `deepseek harness` | `evidence/closeout-rerun.txt:3` records eight modes and the aliases | Met | - |
| AC-002 | REQ-002 | Given the regenerated advisor graph, When `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"run this task through dsh headless"}' --format json` runs, Then its top recommendation is `cli-external-orchestration` | `evidence/advisor-dsh-headless.json:12`; the saved run is also summarized in `evidence/checks.txt:24` | Met | - |
| AC-003 | REQ-003 | Given the edited harness source list, When `build-artifacts.cjs` under `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/004-cli-external-orchestration/harness/` runs, Then generated compiled-routing outputs verify without drift | `evidence/remint-after-doc-edits.txt:17` records the post-edit remint; `evidence/closeout-compiled-route-manifest-rerun.txt:141` records the current 48/48 manifest tests | Met | - |
| AC-004 | REQ-004 | Given the card-sync list includes the packet, When the card-sync script and advisor parity and scorer suites run, Then each exits 0 | `evidence/card-sync.txt:19`; `evidence/closeout-advisor-parity-scorer.txt:6`; `evidence/scorer-baseline-recapture.txt:4` | Met | - |
| AC-005 | REQ-005 | Given the edited agent tables, When `node .skilled/bin/check-agent-mirror-sync.cjs` runs, Then it exits 0 | `evidence/agent-mirror-sync.txt:1` reports all 11 mirrors in sync | Met | - |
| AC-006 | REQ-006 | Given the canary fixture, When the DeepSeek model prompt is advised and routed through the compiled hub, Then the child route resolves to `cli-opencode` | `evidence/closeout-advisor-opencode-deepseek.json:12` records the hub first hop; `evidence/closeout-compiled-route-opencode-deepseek.txt:1` records the child route and exit 0 | Met | - |

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

**Closeable:** Yes

All six acceptance rows are Met, so the acceptance gate is closeable. The phase remains In Progress while T003 and checklist items CHK-040, CHK-041 and CHK-050 remain open; their reasons are recorded in `tasks.md` and `implementation-summary.md`.
<!-- /ANCHOR:closure -->
