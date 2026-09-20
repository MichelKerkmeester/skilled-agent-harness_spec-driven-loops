---
title: "Tasks: sk-design consolidation remediation"
description: "Retrospective task record for the nine verified fixes closing the deep-review and deep-research findings after the /interface:audit and /interface:foundations retirement."
trigger_phrases:
  - "sk-design consolidation remediation tasks"
  - "post-consolidation fixes tasks"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/007-consolidation-remediation"
    last_updated_at: "2026-07-27T08:07:00.762Z"
    last_updated_by: "orchestrator"
    recent_action: "Authored L2 task record for the nine shipped fixes"
    next_safe_action: "Run the deferred styles checksum and a regenerated design benchmark"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/description.json"
      - ".opencode/skills/sk-design/design-mcp-open-design/grounding-receipt.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-007-remediation-session"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Restore the eleven AI-tell fixture pairs, the only mechanism proving a detector fires?"
    answered_questions: []
---
# Tasks: sk-design consolidation remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort]`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Re-verify all nine findings against the live tree (fresh-context Opus pass over the 006 review/research output, per `spec.md` §2)
- [x] T002 Enumerate out-of-scope alternatives so they are not re-litigated mid-fix (`spec.md` §3)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 [P] Remove the `design-quality-score` keyword and trigger example (`sk-design/description.json`, `graph-metadata.json:123-124`, `SKILL.md:11`)
- [x] T004 [P] Correct thirteen styles paths by three-way mapping (`SKILL.md:207,208,218,255`, `README.md:72`, `manual-testing-playbook.md:284,285`, two `styles-library-utilization/*.md`)
- [x] T005 Shrink the styles README from 165,030 B / 1,314 lines to 1,928 B / 26 lines; fix two broken refs at line 8 (`styles/README.md`)
- [x] T006 [P] Remove retired `foundations`/`audit` vocabulary from 15 live contract files, including the foundations procedure-card row rename
- [x] T007 [B] Delete the Audit Backlog Handoff Card and the audit deterministic-minimum row together, so the deletion is paired (`sk-code-handoff.md`, `creation-contract.md`) — blocked on T006 landing first
- [x] T008 [P] Correct `PAIRED_MODES` to the live three-mode set (`grounding-receipt.mjs:26-31`)
- [x] T009 [P] Delete four unsupported proof claims (`commands/interface/design.md:24`, `motion.md:24`, two presentation assets)
- [x] T010 [P] Delete the duplicate `build` lane enum, not synchronise it (`interface-design-auto.yaml:157`)
- [x] T011 Guard `--design-md` through `resolveOutputPath()` and a `design-md-path` preflight check; add two negative tests (`guided-run.ts:170`)
- [x] T012 Reconcile the sibling `006` packet (not this one): mark `spec.md:157` NFR-S01 superseded, correct `checklist.md:3` frontmatter
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 `procedure-card-schema-check.mjs` — fail (3 cards) → pass (12/12)
- [x] T014 `interface-command-contract.test.mjs` — 8/8 pass
- [x] T015 `design-command-surface-check.test.mjs` (7/7) + `design-command-surface-check.mjs` (`invalid=0 drift=0`)
- [x] T016 `parent-skill-check.cjs` — OK, 0 warnings
- [x] T017 Open Design transport suite — 37/37 pass
- [x] T018 md-generator backend suite — 173/173 pass, build clean
- [x] T019 Full sk-design suite set — 260/260 passing
- [x] T020 `styles build --check` — `ok:true`, `recordCount:1290`, empty diff
- [ ] T021 Design benchmark suite — not run; route gold still encodes the retired six-mode topology, would fail for the wrong reason until regenerated
- [ ] T022 Styles SHA-256 equality check against `006/scratch/styles.sha256.before` — not run
- [x] T023 Author `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` with evidence
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All nine fixes marked `[x]` with owning-gate evidence
- [x] No `[B]` tasks remain blocked (T007 unblocked once T006 landed)
- [x] Full gate set green (T013–T020)
- [ ] T021, T022 remain open — documented as not run, not silently dropped
- [x] Checklist.md fully verified for everything the gate table supports
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
