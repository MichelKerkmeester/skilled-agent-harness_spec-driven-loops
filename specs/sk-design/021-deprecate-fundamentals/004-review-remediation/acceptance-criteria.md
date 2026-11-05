---
title: "Acceptance Criteria: Phase 4: review-remediation"
description: "The criteria the nine deep-review findings must satisfy before this phase closes, each one proved by the check the review recorded."
trigger_phrases:
  - "review remediation acceptance criteria"
  - "deep review findings criteria"
  - "phase 4 closure gate"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/021-deprecate-fundamentals/004-review-remediation"
    last_updated_at: "2026-11-05T12:00:00Z"
    last_updated_by: "markdown"
    recent_action: "Recorded the evidence for every criterion"
    next_safe_action: "None, the phase is closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-021-004-review-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 4: review-remediation

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** 004-review-remediation
**Level:** 2
**Status:** Complete
**Date:** 2026-11-05
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the four visual-review phrases, When `compiled-route --hub sk-code` replays them, Then each one returns a surfaceBundle of `sk-code-review` and `sk-code-frontend` | `node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "<phrase>"` returned `selectionKind":"surfaceBundle"` with both modes for `design review`, `design review findings`, `review this design` and `review this screen` (`scratch/facts.md:95`) | Met | - |
| AC-002 | REQ-002 | Given the served canary fixture, When the sk-code harness runs, Then the three new visual cases pass and the authored twin matches the served file | The fixture holds 12 cases, including `visual-values-frontend`, `visual-review-bundle` and `visual-motion-frontend`. The sk-code canary harness passed, and the served fixture was copied over its authored twin (`scratch/facts.md:102`) | Met | - |
| AC-003 | REQ-003 | Given the `WEB_VISUAL_HIERARCHY` intent, When both router mirrors are read, Then each lists `references/web-accessibility-patterns.md` in the prose line and in `RESOURCE_MAP` | `verify-router-sync.cjs` passed 5 of 5 checks on sk-code-frontend and `run-all-drift-guards` passed all 4 guards (`scratch/facts.md:110`) | Met | - |
| AC-004 | REQ-004 | Given the sk-design hub, When its graph metadata is read, Then ten intent signals name the extract, chart and diagram modes and no retired values phrase remains | `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-design` reports OK with 0 warnings. The ten retired phrases are gone and ten extract, chart and diagram phrases are in place (`scratch/facts.md:119`) | Met | - |
| AC-005 | REQ-005 | Given the sk-code hub, When `SKILL.md` and `description.json` are read, Then they name the three visual references and `tokens.css` and `lastUpdated` reads 2026-11-05 | `parent-skill-check.cjs` on `.skilled/skills/sk-code` reports OK with 0 warnings. The surface row, the surface list and the layout comment name the references and `tokens.css`, and `lastUpdated` reads `2026-11-05T00:00:00Z` (`scratch/facts.md:50`) | Met | - |
| AC-006 | REQ-006 | Given the phase 2 summary, When its files table is read, Then no row claims `node-to-token-markup.md` changed | `git diff 10474a9567 --stat -- .skilled/skills/mcp-tooling/mcp-figma/manual-testing-playbook/figma-to-code/node-to-token-markup.md` printed nothing and `grep -c node-to-token` on the summary printed 0 (`scratch/facts.md:120`) | Met | - |
| AC-007 | REQ-007 | Given AC-005 of the phase 1 criteria, When it is read, Then it names the five baseline value prompts and records a replay result for each | `rg -n 'AC-005' specs/sk-design/021-deprecate-fundamentals/001-frontend-upgrade/acceptance-criteria.md` prints one row that names the padding, type scale, palette, looks wrong and dropdown animation prompts, and each records a single `sk-code-frontend` route (`scratch/facts.md:98`) | Met | - |
| AC-008 | REQ-008 | Given item V20, When it is read, Then it carries the shadow animation pitfall with the pseudo-element code block and a See also to Section 10, and the item numbers stay V1 to V41 | `validate_document.py` reports Total issues 0 on `web-visual-values.md`. The `^### V` count is 41 and the V20 body holds the pitfall, the code block and the See also (`scratch/facts.md:114`) | Met | - |
| AC-009 | REQ-009 | Given M33, When it is read, Then it states that the client redirect is UX only, that the server refuses every data request and that the client clears cached protected data | `validate_document.py` reports Total issues 0 on `web-motion-and-interaction.md` and the M33 bullet states the client redirect is UX only, the server refuses every data request and the client clears cached protected data (`scratch/facts.md:114`) | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Pending` | Planned and not yet executed. Counts as open and blocks closure. |
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

Every criterion is Met with a check from the remediation run and nothing was waived, so the closure carries no waiver.
<!-- /ANCHOR:closure -->
