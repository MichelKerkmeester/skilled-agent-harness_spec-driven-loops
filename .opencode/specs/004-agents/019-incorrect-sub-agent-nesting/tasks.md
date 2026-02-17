# Tasks: Sub-Agent Nesting Depth Control

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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
## Phase 1: NDP Design

- [x] T001 Define 3-tier agent classification (ORCHESTRATOR, DISPATCHER, LEAF) (spec.md)
- [x] T002 Define absolute depth limit of 3 with counting rules (spec.md)
- [x] T003 Map all agents to their tiers (spec.md)
- [x] T004 Design depth field for Task Decomposition Format (spec.md)
- [x] T005 Write legal vs illegal nesting chain examples (plan.md)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation — Update orchestrate.md Files

### Base orchestrate.md (`.opencode/agent/orchestrate.md`)

- [ ] T006 Add NDP section (new Section 27) with tier definitions and depth rules
- [ ] T007 Update Section 3 Agent Routing table — add Tier column
- [ ] T008 Update Section 4 Sub-Orchestrator Pattern — add depth inheritance rule and replace "Maximum 2 levels" with NDP reference
- [ ] T009 Update Section 10 Task Decomposition Format — add `Depth` field
- [ ] T010 Update Section 10 PDR template — add `Depth` line
- [ ] T011 Add anti-pattern to Section 24 — "Never dispatch beyond max depth 3"
- [ ] T012 Add LEAF enforcement instruction to dispatch template

### ChatGPT orchestrate.md (`.opencode/agent/chatgpt/orchestrate.md`)

- [ ] T013 [P] Apply T006-T012 changes (identical content)

### Copilot orchestrate.md (`.opencode/agent/copilot/orchestrate.md`)

- [ ] T014 [P] Apply T006-T012 changes (identical content)
- [ ] T015 Fix Section 11 — remove conflicting "Maximum nesting: 3 levels deep" and reference NDP instead
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T016 Diff NDP sections across all 3 files — must be identical
- [ ] T017 Verify every agent in routing table has Tier classification
- [ ] T018 Trace workflow: User > Orchestrator > @context > @explore — confirm depth stays within 3
- [ ] T019 Trace workflow: User > Orchestrator > Sub-Orchestrator > @general — confirm depth stays within 3
- [ ] T020 Trace workflow: User > Orchestrator > @speckit — confirm LEAF, no sub-dispatch
- [ ] T021 Update checklist.md with verification results
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed (T016-T020)
- [ ] All 3 orchestrate.md files synchronized
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decision Record**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 3 TASKS
- 3 phases: Design, Implementation, Verification
- 21 tasks total
-->
