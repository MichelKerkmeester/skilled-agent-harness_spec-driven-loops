---
title: "Tasks: Phase 23: ollama-deprecation-research"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "ollama deprecation research tasks"
importance_tier: "normal"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 23: ollama-deprecation-research

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`A` is this phase's `research/` folder.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Scaffold this child with `create.sh --phase --parent` (`spec.md`). Verify: `ls 023-ollama-deprecation-research` lists `spec.md`. Evidence: create.sh exit 0.
- [x] T002 Initialize the run on claude2 as generation 2 (`A/deep-research-config.json`). Verify: the gateway prints `"ok":true` for the run-open and restart events. Evidence: ledger sequences 1 and 2. Generation 1 was archived unused to `research_archive/` when the executor moved to claude2.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Run iterations 1 to 5 as Fable 5.2 high on claude2 (`A/iterations/`). Verify: `verify-iteration.cjs` prints `OK iteration N complete` for each. Evidence: all five printed it with exit 0; findings 8, 10, 14, 15 and 14.
- [x] T004 Reduce state after each iteration (`A/findings-registry.json`). Verify: `reduce-state.cjs` exits 0. Evidence: exit 0 after each iteration; the strategy shows 5 of 5 questions checked.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 Synthesize and close out (`A/research.md`). Verify: `synthesis-closeout.cjs` exits 0 and the gateway accepts its events. Evidence: exit 0, ledger sequence 14.
- [x] T006 Spot-check the package-consumer verdict. Verify: an import search outside tests and generated data finds only the advisor's `lib/embedders/`, the launcher, `shared/types.ts` and the sk-doc validator. Evidence: confirmed by `rg`.
- [x] T007 Validate this phase. Verify: `validate.sh --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: `research/research.md` answers all five questions
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Synthesis**: See `research/research.md`
<!-- /ANCHOR:cross-refs -->

---
