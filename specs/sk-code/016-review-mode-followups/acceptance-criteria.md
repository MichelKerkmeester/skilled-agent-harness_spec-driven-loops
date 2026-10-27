---
title: "Acceptance Criteria: sk-code-review follow-ups"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "review mode followups acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/016-review-mode-followups"
    last_updated_at: "2026-10-27T06:26:54Z"
    last_updated_by: "claude-opus"
    recent_action: "Marked every criterion Met with observed evidence"
    next_safe_action: "Orchestrator lands the lane commits"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "lane-d-review-mode-followups"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: sk-code-review follow-ups

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** `016-review-mode-followups`
**Level:** 2
**Status:** Complete
**Date:** 2026-10-27
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the fixed vocabulary, When `review .github/workflows/ci.yml` is routed, Then the route is `surfaceBundle` with `sk-code-review` then `sk-code-ci` | `.skilled/bin/tests/compiled-route-surface-hint.test.cjs:199`. `compiled-route.cjs` replay printed `surfaceBundle ['sk-code-review', 'sk-code-ci']`; `compiled-route-surface-hint.test.cjs` path-only test passes, compiled-route suite `# pass 95 # fail 0` | Met | - |
| AC-002 | REQ-002 | Given a report whose Overall assessment says `REQUESTED_CHANGES` and whose last line says `APPROVED`, When the final-line checker runs, Then it exits 1 naming the contradiction | `.skilled/skills/sk-code/sk-code-review/scripts/check-review-final-line.js:101`. `check-review-final-line.js overall-contradicts-status.md` rc=1 with `Overall assessment "REQUESTED_CHANGES" contradicts the final status line "Review status: APPROVED"`; harness ends `All rule-canary test cases passed` | Met | - |
| AC-003 | REQ-003 | Given a repository with no `origin`, When the reviewer computes `<repo-ref>`, Then the docs give the root-path fallback and the pathspec form | `.skilled/skills/sk-code/sk-code-review/SKILL.md:549` and `.skilled/skills/sk-code/sk-code-review/references/pr-state-dedup.md:48`. `SKILL.md` section 9.1 and `references/pr-state-dedup.md` Cache Format and Pathspec Scope; both VALID | Met | - |
| AC-004 | REQ-004 | Given the report template, When a review is written, Then its header states `Quality gate evidence` without skipping a baseline check | `.skilled/skills/sk-code/sk-code-review/SKILL.md:369` and `.skilled/skills/sk-code/sk-code-review/SKILL.md:395`. `grep -n 'Quality gate evidence' SKILL.md` prints the template line and the rule paragraph; the valid fixtures carry the line; all three live reviews printed it | Met | - |
| AC-005 | REQ-005 | Given a user security surface added to the hub, When a review request is replayed through both stages, Then stage one picks `sk-code` and stage two bundles review and the surface | `.skilled/skills/sk-code/sk-code-review/SKILL.md:510`. CR-028 stage-two command printed `surfaceBundle sk-code-review,sk-code-security`; advisor ranked `sk-code` first at 0.85; `SKILL.md` section 7 User-Authored Modes | Met | - |
| AC-006 | REQ-006 | Given the finding-accuracy scenarios, When they run live, Then each run records executor, model, duration and tokens and the playbook count is derived | `.skilled/skills/sk-code/sk-code-review/benchmark/reports/2026-10-27--finding-accuracy--live/README.md:41`. Report `2026-10-27--finding-accuracy--live` records pi, DeepSeek V4.1 Flash, 111/74/82 s and tokens, D4 67/100; `render-report.cjs --check` matches 7 files; 34 index rows equal 34 scenario files and the playbook validator is VALID | Met | - |
| AC-007 | REQ-007 | Given the mode docs, When searched for `.skilled/`, Then no path remains | `.skilled/skills/sk-code/sk-code-review/SKILL.md:506`. `grep -c '\.skilled/'` prints 0 for `SKILL.md` and `scripts/README.md`; the packet-relative canary command exits 0 from the packet root | Met | - |
| AC-008 | REQ-008 | Given the consumers of the review mode, When each is checked, Then each is aligned or recorded as needing no change | `.skilled/agents/review.md:279`. `review.md` gained Summary agreement; mirrors synced (`check-agent-mirror-sync.cjs --all` OK, codex, pi and hermes PASS); `deep-review.md`, `/deep:review`, `/doctor:sk-code` and `parent-skill-check.cjs` need no change, recorded in implementation-summary.md | Met | - |

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

Every criterion is Met with observed evidence.
<!-- /ANCHOR:closure -->
