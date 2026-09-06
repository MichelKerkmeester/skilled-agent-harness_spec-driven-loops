---
title: "Acceptance Criteria: Phase 10: fix newcomer reachability for sk-create-frontmatter routing"
description: "The criteria this phase must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "reachability closure"
  - "ac traceability"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/049-sk-create-frontmatter/010-fix-newcomer-reachability-for-sk-create-frontmatter-routing"
    last_updated_at: "2026-09-06T00:00:00Z"
    last_updated_by: "implementation"
    recent_action: "Recorded the observed outcome of every criterion"
    next_safe_action: "Commit the phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-06-049-010-implementation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 10: fix newcomer reachability for sk-create-frontmatter routing

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/049-sk-create-frontmatter/010-fix-newcomer-reachability-for-sk-create-frontmatter-routing
**Level:** 3
**Status:** Complete
**Date:** 2026-09-06
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given ten newcomer prompts, When they are replayed before any edit, Then each outcome is recorded with the advisor generation | Baseline at generation 605: six returned nothing, four reached `sk-doc` with no target. Zero resolved to the mode | Met | - |
| AC-002 | REQ-001 | Given the same ten prompts, When they are replayed after the compile, Then at least half resolve to the mode | Six of ten resolve to `sk-create-frontmatter`, at 0.85 to 0.94. Two stop at the hub floor, two return nothing | Met | - |
| AC-003 | REQ-002 | Given each added phrase, When five out-of-domain prompts are replayed, Then none resolves to the mode | `missing a field` captured a phone-number form prompt at 0.8966 and was replaced by `validator says my file is missing`, after which the form prompt returns nothing. A license-comment prompt, a listing-page description, a wiki edit count and an npm search prompt route nothing to `sk-doc` | Met | - |
| AC-004 | REQ-002 | Given the two hub-only version prompts, When `version number` and `version line` are probed before adding, Then they are refused if they already reach the hub on unrelated prompts | `what is the version number of node` and `the version line at the top of this doc` already reach `sk-doc` at 0.82. Adding the aliases would resolve a Node version question to the mode. Not added, ADR-002 | Met | - |
| AC-005 | REQ-003 | Given the keyword line and the registry aliases, When both are sorted and diffed, Then the diff is empty | 28 entries on each side, no difference | Met | - |
| AC-006 | REQ-001 | Given the eighteen declared triggers, When replayed after the compile, Then every one still routes to the mode | `yaml frontmatter` 0.8762 and `trigger_phrases` 0.82 both resolve to the mode, matching the phase 009 closing state | Met | - |
| AC-007 | REQ-004 | Given the registry and hub router are pinned sources, When edited, Then the guard goes stale, the manifests are re-minted, the artifacts rebuilt and the three moved digests re-pinned | Guard `stale-manifest`, manifest re-minted to `9b9fc1f0...`, authored copy matched, three `AUTHORED_DIGESTS` entries re-pinned, guard fresh, sync verify OK | Met | - |
| AC-008 | REQ-004 | Given the canary red on two tool digests this phase did not move, When each is classified against HEAD, Then only committed drift is re-pinned | Both scripts changed in commit `2f21545e3e` and are clean at HEAD. Re-pinned in the canary, the shared `protected-digests.json` and the four sibling canaries. sk-doc canary `REAL-GREEN`, 23 of 23 rows | Met | - |
| AC-009 | REQ-005 | Given this phase folder and the parent, When the spec validator runs strict, Then each prints `RESULT: PASSED` | Recorded in the summary's verification table | Met | - |
| AC-010 | REQ-005 | Given every document this phase wrote, When the human-voice scanner runs, Then no hard blocker | Recorded in the summary's verification table | Met | - |

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

AC-002 carried the phase: newcomer reachability went from zero of ten to six of ten with a compiled
target, and AC-003 and AC-004 kept the vocabulary narrow by dropping one phrase and refusing two.
The four prompts that still stop short are recorded against the advisor scorer, where every earlier
phase placed the same residual.
<!-- /ANCHOR:closure -->
