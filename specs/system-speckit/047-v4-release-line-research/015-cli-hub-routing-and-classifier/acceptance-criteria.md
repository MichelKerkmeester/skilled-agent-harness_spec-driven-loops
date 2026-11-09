---
title: "Acceptance Criteria: Phase 15: cli-hub-routing-and-classifier"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "cli hub routing and classifier acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/047-v4-release-line-research/015-cli-hub-routing-and-classifier"
    last_updated_at: "2026-11-08T23:39:05Z"
    last_updated_by: "remediation-orchestrator-a"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-015-cli-hub-routing-and-classifier"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 15: cli-hub-routing-and-classifier

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** 015-cli-hub-routing-and-classifier
**Level:** 2
**Status:** Complete
**Date:** 2026-11-09
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given each keyword in the hub and cli-jev ROUTER files, When it is routed through compiled routing, Then the route is cli-jev | `hub-router-phrases.test.mjs` passes; probes of the eight deferring phrases now print `"action":"route"` | Met | - |
| AC-002 | REQ-002 | Given the managed Pi 1.5.0 install, When the transport preflights, Then it resolves the release package and passes the version gate; an old or method-less Pi gets gate `version` | `jev-transport.test.mjs` 51 with the phrases test, 0 fail; real preflight resolves `install/releases/1.5.0/...` | Met | - |
| AC-003 | REQ-003 | Given "opencode go route this task", When the advisor ranks it, Then cli-external-orchestration is above sk-code, and "write an opencode plugin" still ranks sk-code first | live CLI: hub 0.734 over sk-code 0.657; plugin prompt sk-code 0.767; `opencode-provider-route.vitest.ts` | Met | - |
| AC-004 | REQ-004 | Given "my hooks are not firing, what do I run", When the advisor ranks it, Then a doctor command is recommended | live CLI lists `command-doctor-git-setup` 0.607; `doctor-helper-handoff.vitest.ts` | Met | - |
| AC-005 | REQ-001 | Given the baselines, When rerun, Then no previously passing test fails | advisor 1383 (baseline 1379), typecheck exit 0, classifier 179 (172), bin 172 pass 0 fail (156/16), sync, guard and bridge check fresh | Met | - |

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

Every criterion is met with observed evidence; ADR-001 keeps the hub mode choice for OpenCode Go.
<!-- /ANCHOR:closure -->
