---
title: "Acceptance Criteria: Phase 19: ollama-lane-honest-and-closeout"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "ollama lane honest and closeout acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/019-ollama-lane-honest-and-closeout"
    last_updated_at: "2026-11-19T17:05:15Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-019-ollama-lane-honest-and-closeout"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 19: ollama-lane-honest-and-closeout

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** `019-ollama-lane-honest-and-closeout`
**Level:** 2
**Status:** In Progress
**Date:** 2026-11-19
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given missing rows and a reachable backend, When the daemon refresh runs, Then it embeds them at weight 0; given full coverage it makes no probe and no embed call; given the opt-out env it does nothing | `refresh-in-background.vitest.ts` (embed, complete no-op, opt-out); live daemon 14/14 and 47/47 at weight 0 | Met | - |
| AC-002 | REQ-002 | Given a stored vector, When its refresh fails on an outage, Then the vector is still stored | `skill-graph-embedding-outage.vitest.ts` keeps skill vectors through a tripped outage; the two command-loop deletes are removed in the diff, with no test of their own | Met | - |
| AC-003 | REQ-003 | Given an embeddable skill or command with no vector, When the lane scores, Then it returns [] and reports incomplete_skill_vectors | `semantic-shadow-cosine.vitest.ts` incomplete-coverage cases | Met | - |
| AC-004 | REQ-004 | Given a failed prompt embed, When the closure scores, Then semantic_shadow is runtime_degraded | `semantic-outage-degraded.vitest.ts` | Met | - |
| AC-005 | REQ-005 | Given a local Ollama and full seeded coverage, When the harness runs twice, Then both runs match and the default weight follows the pass bar | Runs 3 and 4 match (156 vs 161, 7 flips); default 0 asserted by the pass bar | Met | - |
| AC-006 | REQ-006 | Given no heartbeat newer than spawn, When 5 minutes pass, Then the watchdog stops the child; and createChildEnv always sets the database directory | `launcher-heartbeat-watchdog.vitest.ts` grace cases and `launcher-threshold-env.vitest.ts` DB dir case | Met | - |
| AC-007 | REQ-007 | Given OLLAMA_BASE_URL and OLLAMA_REQUEST_TIMEOUT_MS in the launcher env, When createChildEnv runs, Then both reach the child | `launcher-threshold-env.vitest.ts` OLLAMA forwarding case | Met | - |
| AC-008 | REQ-008 | Given repeated runs on quiet main, When they finish, Then each one-off failure is reproduced and fixed or shown not to repeat | Python 10/10 and runtime 4/4 clean; the six daemon-start failures reproduced as a stale dist under vitest | Met | - |
| AC-009 | REQ-009 | Given the orphan scan, When the writes finish, Then it lists only live or skipped sessions, each skip with its reason | `--scan-orphans` lists only the running session, this session and 2 held answers; skip reasons in implementation-summary.md | Met | - |
| AC-011 | REQ-011 | Given the daemon on main with Ollama up, When status runs with `includeSemanticHealth`, Then skills and commands both read current equal to total | The live status block | Unmet | - |
| AC-012 | REQ-012 | Given the doctor checks, When coverage is full at weight 0, Then they pass; without Ollama they read DEGRADED | Setup and embedder YAML pass on `coverageComplete`, DEGRADED without Ollama, weight 0 not a fail | Met | - |
| AC-013 | REQ-013 | Given the committed branch, When both alignment commands run, Then their reports are in `evidence/` and each finding is fixed or accepted with a reason before the merge | The two reports and the finding list in implementation-summary.md | Unmet | - |
| AC-010 | REQ-010 | Given the docs, When they are searched, Then they state the shipped weight and behavior | `rg semantic_shadow` over the advisor docs shows weight 0 and the background refresh | Met | - |

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

**Closeable:** No

No. AC-013 and AC-011 wait on the alignment runs, the merge and the live status check on main.
<!-- /ANCHOR:closure -->
