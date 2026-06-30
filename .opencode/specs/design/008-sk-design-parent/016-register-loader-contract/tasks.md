---
title: "Tasks: sk-design shared-register loader contract"
description: "Task list for the shared-register loader fix: wire a hub preamble or register-scoped allowlist, align the motion, audit, and interface routers, then rerun the routing benchmark for the three modes. Not started."
trigger_phrases:
  - "sk-design register loader tasks"
  - "shared register preload tasks"
importance_tier: "supporting"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/016-register-loader-contract"
    last_updated_at: "2026-06-27T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Implemented the loader contract and verified across four modes"
    next_safe_action: "Move to 017; 020 normalizes gold expected-resources to credit the register"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "author-154-016-register-loader-contract"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: sk-design shared-register loader contract

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

- [x] T001 Read the 015 loader-contract evidence as grounding (motion, audit, interface lineages)
- [x] T002 Confirm the live loading mechanism. The operative guard is the benchmark connectivity gate `d5-connectivity.cjs`, which flags any `../` path in `RESOURCE_MAP` as a P0 escape. The sk-design hub has no `_guard_in_skill()`, so the scaffold's hub-guard assumption was corrected to the real gate
- [x] T003 Confirm which modes mandate `../shared/register.md` on every task. interface, foundations, motion and audit mandate it in prose; md-generator cites it once and does not
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Wire the loader. Added an explicit parent-`shared/` sanction to the connectivity gate (`d5-connectivity.cjs` `resolveRoutedPath`) so the cross-packet path is allowed while every other escape and a missing sanctioned file still fail, then placed `../shared/register.md` in each mandating mode's `DEFAULT_RESOURCE` (the always-loaded slot the gate does not escape-check)
- [x] T005 [P] design-motion router loads the register on every task via `DEFAULT_RESOURCE` (`.opencode/skills/sk-design/design-motion/SKILL.md`)
- [x] T006 [P] design-audit router loads `../shared/register.md` for register-gated scoring via `DEFAULT_RESOURCE` (`.opencode/skills/sk-design/design-audit/SKILL.md`)
- [x] T007 [P] design-interface loads the register via `DEFAULT_RESOURCE` and its routing note was corrected; design-foundations included on the same basis (`.opencode/skills/sk-design/design-{interface,foundations}/SKILL.md`)
- [x] T008 Manual playbook gold matches the contract (no scenario contradicts the register loading, recall is unaffected). Crediting the register in gold expected-resources, so it is not scored as economy-waste, is handed to 020 fixture seeding
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Reran the routing replay and connectivity gate. All five modes score 100 with 0 path escapes, and `../shared/register.md` loads in the routed resources for interface, foundations, motion and audit with 0 missing. Three adversarial fixtures confirm a genuine escape still fails, the sanctioned path passes, and a missing sanctioned file still fails. The three Lane C vitest suites pass 71 of 71
- [x] T010 `package_skill.py --check` passes on all four touched modes (exit 0)
- [x] T011 `validate.sh --strict` on this packet PASSED with 0 errors and 0 warnings; the guard sanctions only the parent `shared/` dir and every other escape still fails
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All implementation tasks complete (T008's gold-credit enhancement reclassified to 020, rationale above)
- [x] No blocked tasks remaining
- [x] The connectivity gate and router replay confirm the register loads on every mandatory task across the four modes, and packaging plus strict validation pass

### Status note

COMPLETE. The shared register now loads on every task for interface, foundations, motion and audit through `DEFAULT_RESOURCE`, and the connectivity gate sanctions the parent `shared/` dir so the cross-packet path is no longer a path escape. The mechanism reading corrected the scaffold's hub-guard assumption: the operative guard is the benchmark `d5-connectivity.cjs` gate, and the always-loaded `DEFAULT_RESOURCE` slot is the register's home. Verified by the gate, router replay, three adversarial fixtures, the Lane C vitest suites (71 of 71), package check and strict validation.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Grounding**: See `../015-per-skill-improvement-research/decision-record.md` (ADR-002) and the motion, audit, and interface lineage research
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
