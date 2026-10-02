---
title: "Acceptance Criteria: Phase 2: communication-rule-upgrade"
description: "The criteria this phase must satisfy before it may close, each one met, waived by a decision record or superseded by one."
trigger_phrases:
  - "phase 2 acceptance criteria"
  - "communication rule closure gate"
  - "plain-language reply rule verification"
  - "live reference verification"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-communication/007-sk-communication-removal/002-communication-rule-upgrade"
    last_updated_at: "2026-10-02T04:58:21Z"
    last_updated_by: "codex"
    recent_action: "Authored open closure criteria for the communication-rule upgrade phase"
    next_safe_action: "Run the rule, repository and recursive packet checks"
    blockers: []
    key_files:
      - ".skilled/repo-rules/communication.md"
      - ".skilled/repo-rules/communication-prose.md"
      - ".skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md"
    session_dedup:
      fingerprint: "sha256:c1d5e5b7cd8d546569786d885836e3eba75d22c743e22c059b0e765479189b62"
      session_id: "codex-074-sk-communication-removal"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 2: communication-rule-upgrade

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the phase may close. A phase is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-communication/007-sk-communication-removal/002-communication-rule-upgrade
**Level:** 2
**Status:** Complete
**Date:** 2026-10-02
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a reply that needs plainer wording, When communication.md section 4 is read and applied, Then it directs a complete re-render and preserves each claim, number, caveat and uncertainty statement | T004, T006, task trace tasks.md:47; sed -n '/## 4\. WHEN THE READER DID NOT FOLLOW/,/## 5\./p' .skilled/repo-rules/communication.md; observed direct re-render instruction preserves claims, order, strength and logical relations | Met | - |
| AC-002 | REQ-002 | Given terse machine-register prose, When the sentence-level rule is applied, Then it calls for complete, connected wording at the source rather than leaving the clipped register in the reply | T005, task trace tasks.md:48; observed search output includes a direct terse-register prohibition and complete-sentence/connective guidance | Met | - |
| AC-003 | REQ-001, REQ-004 | Given the detailed wording standard, When the rule source and references are checked, Then the Human Voice Rules remain present and are referenced without a copied rubric | T006, task trace tasks.md:49; HVR file existence test and rg for Human Voice Rules/hvr-rules.md; file exists and both rules reference it; no rubric copied | Met | - |
| AC-004 | REQ-005 | Given REPO RULES.md and AGENTS.md still govern routing, When their scoped diff is reviewed, Then only wording made false by this removal changes | T007-T008, task trace tasks.md:50; git -c core.fsmonitor=false diff ecf2897455 -- REPO RULES.md AGENTS.md; observed no stdout, exit 0, so both remain unchanged and accurate | Met | - |
| AC-005 | REQ-003 | Given all live non-historical repository paths, When the scoped search runs, Then no dead runtime reference remains; the only retained match is the existing prompt-set pointer to a historical decision record | T009, task trace tasks.md:59; scoped git grep excludes specs/, changelog/, and generated retrieval snapshots; observed only prompt-set.json at line 84; the historical target file test exited 0 | Met | - |
| AC-006 | REQ-006 | Given the canonical prompt and Hermes skill sources, When all mirror generators run in check mode, Then Codex, Hermes and Pi prompt mirrors and the Hermes skill mirror have no drift | T010, task trace tasks.md:60; all four --check commands; Codex/Hermes/Pi each reported PASS: 32 prompts are in sync, Hermes skills reported PASS: 71 Hermes skill copies in sync; exit 0 for each | Met | - |
| AC-007 | REQ-006 | Given the final spec frontmatter and retrieval fixture, When the trigger-index freshness check runs, Then the committed index matches its source corpus | T011, task trace tasks.md:61; `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs --quiet` then `--check --quiet`; both exited 0 and no indexed path remains under `.skilled/skills/sk-communication/` | Met | - |
| AC-008 | REQ-006 | Given the route-exclusion mechanism remains with an empty skill list, When its focused Vitest suite runs, Then empty-list behavior is safe and other eligible skills remain routable | T012, task trace tasks.md:62; npm --prefix .skilled/skills/system-skill-advisor/runtime test -- tests/route-exclusions.vitest.ts; 1 file passed, 10 tests passed, exit 0 | Met | - |
| AC-009 | REQ-006 | Given the sk-doc reference cleanup and touched test, When the specific changed test and script suite run, Then both pass | T012, task trace tasks.md:62; skill-root metadata contract test passed; script suite reported all sk-doc script tests passed with the requested fixture-harness skip; exit 0 for both | Met | - |
| AC-010 | REQ-006 | Given the completed phase child docs and final packet state, When recursive strict validation runs, Then the validator reports RESULT: PASSED | T013, task trace tasks.md:63; recursive strict validation observed RESULT: PASSED for parent and both children, each with 0 errors and 0 warnings; exit 0 | Met | - |

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

AC-001 through AC-010 are Met with observed evidence. AC-007 is supported by passing trigger-index regeneration and freshness checks; recursive strict validation passed for the parent and both children.
<!-- /ANCHOR:closure -->
