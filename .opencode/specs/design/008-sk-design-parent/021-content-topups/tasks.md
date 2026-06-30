---
title: "Tasks: sk-design targeted per-mode content top-ups"
description: "Completed task list for the per-mode content top-ups: interface redesign intake, foundations examples, motion advanced-craft top-up, audit worksheet and rubric, md-generator wrapper, smoke lane, probes and exemplar, then package and validate."
trigger_phrases:
  - "sk-design content topups tasks"
  - "md-generator wrapper tasks"
importance_tier: "supporting"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/021-content-topups"
    last_updated_at: "2026-06-27T08:55:00Z"
    last_updated_by: "opencode-gpt-5.5"
    recent_action: "Completed implementation and verification tasks across five modes"
    next_safe_action: "Use the refreshed packet and benchmark reports as the handoff state"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "author-154-021-content-topups"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: sk-design targeted per-mode content top-ups

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the five lineage content findings (interface P1 redesign intake, foundations P2-2 examples, motion P1 advanced craft, audit R3/R5, md-generator P1/P2) and the `../015-per-skill-improvement-research/decision-record.md` do-not list
- [x] T002 Confirm each addition's home in the live five mode packets, avoiding duplication of existing references and assets
- [x] T003 Confirm the md-generator fidelity boundary so the wrapper orchestrates the existing tools and never auto-authors
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P] Author the interface redesign intake (greenfield vs preserve vs overhaul) with the never-silently-change list (URLs, nav labels, form fields, legal copy) (`.opencode/skills/sk-design/design-interface/`)
- [x] T005 [P] Author the two foundations annotated worked examples (a dense product dashboard and a generous brand landing), each marked illustrative and NOT a reusable preset (`.opencode/skills/sk-design/design-foundations/`)
- [x] T006 [P] Author the motion compact advanced-craft top-up (origin-aware popovers, instant follow-up tooltips, `@starting-style`, slow-motion debugging, the Framer Motion shorthand-under-load caveat) (`.opencode/skills/sk-design/design-motion/`)
- [x] T007 [P] Author the audit evidence worksheet (confirmed / inferred / not-assessed labels into findings) and the 0-4 Anti-Patterns calibration rubric (`.opencode/skills/sk-design/design-audit/`)
- [x] T008 Author the md-generator guided preflight/run wrapper (checks Node, deps, Chromium, output path, then orchestrates extract to write-prompt to validate to report, no auto-author, no fidelity weakening), a 3-step smoke lane, schema-aligned validation probes and one non-SaaS extraction exemplar (`.opencode/skills/sk-design/design-md-generator/`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Run `package_skill.py --check` on every touched sk-design skill (exit 0)
- [x] T010 Run `validate.sh --strict` on this packet (0 errors) and confirm all new prose follows the Human Voice Rules (no em dashes, no semicolons, no Oxford commas)
- [x] T011 Confirm the md-generator wrapper never auto-authors, the foundations examples are marked illustrative and nothing on the do-not list was added
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All implementation tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Each mode gains its evidence-backed top-up, packaging and strict validation pass, and all new prose is HVR-clean

### Status note

This packet is COMPLETE. It added the one evidence-backed content gap each lineage named, kept the family lean and honored the unanimous do-not list. Verification evidence is recorded in `implementation-summary.md` and the refreshed benchmark reports under the sibling benchmark packet.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Grounding**: See the five lineage research files and `../015-per-skill-improvement-research/decision-record.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
