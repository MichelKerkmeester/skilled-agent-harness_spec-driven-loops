---
title: "Tasks: Phase 006 — Parent-Skill Canon Verification & Procedures Pattern Formalization"
description: "Executed Level 2 task list re-verifying sk-design against the canon parent-hub checker and deciding the procedures/ pattern's canon status."
trigger_phrases:
  - "tasks"
  - "parent-skill canon verification"
  - "sk-design canon re-verification"
  - "procedures pattern formalization"
importance_tier: "high"
contextType: "tasks"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/006-parent-skill-canon-verification"
    last_updated_at: "2026-07-06T00:00:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Completed Phase 006 task breakdown with evidence."
    next_safe_action: "Continue with Phase 007 sk-design-local procedure-card template alignment."
---
# Tasks: Phase 006 — Parent-Skill Canon Verification & Procedures Pattern Formalization

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| unchecked marker | Open task marker; every task below is open |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path or evidence target) [effort]`

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Entry Gate and Current State Review

- [x] T001 Verify Phase 005 documentation-level closure and the CONDITIONAL release verdict (Phase 005 `spec.md`, `release-report.md` §7) [15m]
  - Evidence target: Phase 005 `spec.md` Status field reads "Complete / Conditional Release Gate"; `release-report.md` §7 states the CONDITIONAL verdict and the outstanding live/manual/browser gaps that remain operator-owned.
- [x] T002 Read the current `sk-design` parent hub before auditing (`.opencode/skills/sk-design/SKILL.md`) [10m]
  - Evidence target: read `SKILL.md` before citing any hub-level behavior in this phase's docs.
- [x] T003 Read the current mode registry and hub router before auditing (`.opencode/skills/sk-design/mode-registry.json`, `hub-router.json`) [10m]
  - Evidence target: read both files; confirm the five expected workflow modes and note each mode's `proceduresPath` value.
- [x] T004 Read the current sk-doc canon reference sections before auditing (`.opencode/skills/sk-doc/references/skill_creation/parent_skills_nested_packets.md` §4, §6) [15m]
  - Evidence target: read both sections in full before claiming any canon-doc gap.
- [x] T005 Record any logic-sync conflict between this plan and current `sk-design`/`sk-doc` state (`implementation-summary.md`, once created) [10m]
  - Evidence target: state explicitly whether live state matched this plan's grounding or diverged, and how.

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Canon Verification

- [x] T006 Run `parent-skill-check.cjs` fresh against `.opencode/skills/sk-design` and capture the full transcript and exit code (checker evidence) [10m]
  - Evidence target: `node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/sk-design` full stdout/stderr and exit code, recorded verbatim.
- [x] T007 [P] Confirm `proceduresPath` presence and directory resolution for all five workflow modes (`mode-registry.json`) [15m]
  - Evidence target: every workflow mode entry declares `proceduresPath`, and each path resolves to an existing directory on disk.
- [x] T008 [P] Inventory the six `procedures/` directories and their card counts (directory listing) [10m]
  - Evidence target: card counts for `design-interface`, `design-foundations`, `design-motion`, `design-audit`, `design-md-generator`, and `shared/procedures/`, summed and compared against the expected 14-card total.
- [x] T009 Sample-check at least one card per owning mode against `procedure_card_schema.md`'s required fields (`procedure_card_schema.md`) [20m]
  - Evidence target: for each of the five owning modes plus the shared bucket, confirm the sampled card's Purpose/Owning mode/Source reference/Trigger/Output contract/Proof gate/Privacy rule fields are present and in order.

### Boundaries

- [x] T010 Confirm no `.opencode/skills/sk-design/**`, `.opencode/commands/design/**`, or `.opencode/skills/sk-doc/**` file is edited during this audit (`git status`/`git diff`) [10m]
  - Evidence target: scoped diff/status review shows zero changes to those paths from this phase's own activity.

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Canon-Doc Gap Audit

- [x] T011 Confirm `parent_skills_nested_packets.md` §4 (Three Hubs Extension Matrix) omits `procedures/`/`proceduresPath` (canon-doc read) [10m]
  - Evidence target: quote or paraphrase the current sk-design row's Notes column and confirm no mention of the pattern.
- [x] T012 Confirm `parent_skills_nested_packets.md` §6 (Companion file policy) omits `procedures/`/`proceduresPath` (canon-doc read) [10m]
  - Evidence target: quote or paraphrase the current companion file policy bullet list and confirm no mention of the pattern.

### Rule-of-Three Cross-Hub Check

- [x] T013 [P] Check the `sk-code` hub directory for any `procedures/` companion directory (directory search) [10m]
  - Evidence target: directory search result for `.opencode/skills/sk-code` confirming presence or absence of a `procedures/` folder.
- [x] T014 [P] Check the `deep-loop-workflows` hub directory for any `procedures/` companion directory (directory search) [10m]
  - Evidence target: directory search result for `.opencode/skills/deep-loop-workflows` confirming presence or absence of a `procedures/` folder.
- [x] T015 Record the Rule-of-Three finding as an adopted-by-N-hubs count (`decision-record.md` context) [10m]
  - Evidence target: state the count explicitly (1 of 3 documented hubs, unless T013/T014 find otherwise) and use it to inform the ADR recommendation.

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:phase-4 -->
## Phase 4: Verification and Handoff

### Decision

- [x] T016 Draft ADR-001 alternatives and a Five Checks evaluation (`decision-record.md`) [30m]
  - Evidence target: at least three alternatives compared (keep local, formalize now, formalize plus checker change) with scores and a rationale.
- [x] T017 Record the formalize-vs-local recommendation and its reconsideration trigger (`decision-record.md`) [15m]
  - Evidence target: one clear decision statement plus the explicit condition (a second hub adopting the pattern) that would justify revisiting it.
- [x] T018 State the Phase 007 handoff criteria explicitly (`spec.md` Related Documents, `implementation-summary.md` once created) [10m]
  - Evidence target: an unambiguous statement of which template family (sk-doc-wide vs. sk-design-local) Phase 007 must design against.

### Verification

- [x] T019 Run strict spec validation for this phase folder after metadata regeneration (validation evidence) [5m]
  - Evidence target: `validate.sh --strict` command and exit code recorded once this phase executes.
- [x] T020 Update `checklist.md` P0/P1 rows with evidence or an approved deferral (`checklist.md`) [15m]
  - Evidence target: checklist summary records the actual verified count once this phase executes; no P0 deferrals remain.
- [x] T021 Review negative controls: confirm zero `sk-design`/`sk-doc`/`commands` file edits (`checklist.md`, `git diff`/`git status`) [10m]
  - Evidence target: checklist rows CHK-013, CHK-023, and CHK-031 are checked with file/command evidence once this phase executes.

### Documentation

- [x] T022 Ensure docs do not claim implementation completion while Phase 006 execution remains unresolved (all Phase 006 docs) [5m]
  - Evidence target: every doc's Status field reads "Planned / Not Started" until this phase actually executes and records real evidence.
- [x] T023 Record the rollback path and stop triggers (`plan.md`) [5m]
  - Evidence target: `plan.md` rollback section requires diff/status inspection first and explicit approval before any destructive recovery.

<!-- /ANCHOR:phase-4 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Phase 005 documentation-level closure is verified with evidence before Phase 006 audit work begins.
- [x] A fresh canon-checker transcript and exit code exist for this phase, independent of prior grounding.
- [x] `proceduresPath` consistency across all five workflow modes is confirmed.
- [x] The canon-doc gap in §4/§6 is confirmed by direct read.
- [x] The Rule-of-Three cross-hub check is performed and its finding is recorded.
- [x] ADR-001 is recorded with a clear formalize-vs-local recommendation and reconsideration trigger.
- [x] Phase 007 handoff criteria are explicit.
- [x] `checklist.md` reflects the real verified state once this phase executes.

---

<!-- ANCHOR:execution-evidence -->
## Execution Evidence

| Task Range | Evidence |
|------------|----------|
| T001 | Phase 005 `spec.md` line 47 reads `Complete / Conditional Release Gate`; `release-report.md` §7 lines 137-140 state the verdict is CONDITIONAL and live/manual/browser lanes remain operator-owned. |
| T002-T003 | `.opencode/skills/sk-design/SKILL.md`, `mode-registry.json`, and `hub-router.json` were read before checker execution. `mode-registry.json` declares five workflow modes and each declares `proceduresPath`. |
| T004 | `parent_skills_nested_packets.md` §4 lines 135-143 and §6 lines 197-203 were read; both omit `procedures/` and `proceduresPath`. |
| T005 | No logic-sync conflict found: live state matched the phase plan's grounding. |
| T006 | `node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/sk-design` exited 0 and ended with `OK: parent-skill-check — all hard invariants passed, 0 warnings`. |
| T007-T009 | Procedures inventory found 14 cards: interface 6, foundations 3, motion 1, audit 2, md-generator 1, shared 1. Six sampled cards, one per owning mode plus shared, contain the required fields in order. |
| T010, T021 | This phase performed no writes to `.opencode/skills/sk-design/**`, `.opencode/commands/design/**`, or `.opencode/skills/sk-doc/**`; final scoped status/diff evidence is recorded in `implementation-summary.md`. |
| T011-T015 | `Grep` for `proceduresPath|procedures/` under `sk-code` and `deep-loop-workflows` returned no files; Rule-of-Three adoption is 1 of 3 documented hubs. |
| T016-T018 | ADR-001 is Accepted: keep the pattern sk-design-local; reconsider only if a second hub adopts a comparable companion-directory pattern. Phase 007 handoff is Path B / sk-design-local. |
| T019-T020, T022-T023 | Metadata regeneration and strict validation are recorded in `implementation-summary.md`; checklist rows were updated with evidence and no P0/P1 deferrals. |

<!-- /ANCHOR:execution-evidence -->

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decision Record**: See `decision-record.md`
- **Predecessor Gate**: See `../005-parity-benchmark-release-gate/`

<!-- /ANCHOR:cross-refs -->
