---
title: "Tasks: Keep route-proof fields in the deep-research state log and keep the pre-dispatch audit path inside the packet"
description: "Ordered tasks for the route-proof fields and the run-directory fix, each with the command and the output that proved it."
trigger_phrases:
  - "state log route proof tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Keep route-proof fields in the deep-research state log and keep the pre-dispatch audit path inside the packet

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

Shell variables used by the Verify clauses. Run every Verify command from the worktree root, with these two set:

- `R=.skilled/skills/system-deep-loop/runtime` is the deep-loop runtime folder.
- `S=specs/system-deep-loop/loop-architecture/005-state-log-route-proof` is this packet.

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the branch that Metadata names (repository HEAD). Verify: `git rev-parse --abbrev-ref HEAD` prints `worktrees/470-surfacing-scorer-follow-ups`.
- [x] T002 [P] Confirm item 9 of the source report is this packet's source (`$S/scratch/request-from-vendoring-project.md`). Verify: `rg -c "^9\. \*\*The deep-research state log" $S/scratch/request-from-vendoring-project.md` prints `1`.
- [x] T003 [P] Confirm the sibling packet that holds items 1 to 8 (`specs/system-skill-advisor/routing-and-scoring/011-surfacing-scorer-follow-ups/spec.md`). Verify: `test -f specs/system-skill-advisor/routing-and-scoring/011-surfacing-scorer-follow-ups/spec.md && echo found` prints `found`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add the optional `targetAgent`, `agentDefinitionLoaded` and `resolvedRoute` fields to `deep_research.iteration_completed` (`$R/lib/deep-research-ledger-schema/deep-research-ledger-schema.ts`). Verify: `rg -c "targetAgent: 'prose'|agentDefinitionLoaded: 'boolean'|resolvedRoute: 'prose'" $R/lib/deep-research-ledger-schema/deep-research-ledger-schema.ts` prints `3`.
- [x] T005 Copy the three fields from a legacy record when their types are valid (`$R/lib/deep-research-ledger-schema/legacy-compatibility.ts`). Verify: `rg -c "targetAgent|agentDefinitionLoaded|resolvedRoute" $R/lib/deep-research-ledger-schema/legacy-compatibility.ts` prints `3`.
- [x] T006 Write the fields to the state log as `target_agent`, `agent_definition_loaded` and `resolved_route` when present (`$R/lib/legacy-projections/deep-research-contract.ts`). Verify: `rg -c "target_agent|agent_definition_loaded|resolved_route" $R/lib/legacy-projections/deep-research-contract.ts` prints `3`.
- [x] T007 Add the test "keeps the route-proof fields of a completed iteration in the state log" (`$R/tests/unit/deep-research-ledger-schema.vitest.ts`). Verify: `rg -c "keeps the route-proof fields of a completed iteration in the state log" $R/tests/unit/deep-research-ledger-schema.vitest.ts` prints `1`.
- [x] T008 Export `gatewayRunDirectory` and use it in `appendThroughGateway` (`$R/lib/deep-loop/executor-audit.ts`). Verify: `rg -c "export function gatewayRunDirectory|gatewayRunDirectory\(stateLogPath\)," $R/lib/deep-loop/executor-audit.ts` prints `2`.
- [x] T009 Add the run-directory tests for a relative and an absolute state-log path (`$R/tests/unit/executor-audit-run-directory.vitest.ts`). Verify: `rg -c "^\s*it\(" $R/tests/unit/executor-audit-run-directory.vitest.ts` prints `2`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run the ledger suite (`$R/tests/unit/deep-research-ledger-schema.vitest.ts`). Verify: `(cd $R && npx vitest run tests/unit/deep-research-ledger-schema.vitest.ts)` prints `Tests  58 passed (58)` and exits 0.
- [x] T011 Run the run-directory suite (`$R/tests/unit/executor-audit-run-directory.vitest.ts`). Verify: `(cd $R && npx vitest run tests/unit/executor-audit-run-directory.vitest.ts)` prints `Tests  2 passed (2)` and exits 0.
- [x] T012 Run the three executor-audit suites (`$R/tests/unit/executor-audit.vitest.ts`, `executor-audit-ledger-projection.vitest.ts` and `executor-audit-run-directory.vitest.ts`). Verify: `(cd $R && npx vitest run tests/unit/executor-audit.vitest.ts tests/unit/executor-audit-ledger-projection.vitest.ts tests/unit/executor-audit-run-directory.vitest.ts)` prints `Tests  101 passed (101)` and exits 0.
- [x] T013 Run the typecheck (`$R/tsconfig.json`). Verify: `(cd $R && npm run typecheck)` exits 0.
- [x] T014 Run the whole deep-loop suite (`$R`). Verify: `(cd $R && npm test)` prints `Test Files  186 passed (186)` and `Tests  3098 passed | 9 skipped (3107)`, and exits 0.
- [x] T015 Run strict validation on this packet (`$S`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh $S --strict` prints `RESULT: PASSED`.
- [x] T016 Confirm no placeholder token is left in the packet (`$S/*.md`). Verify: `rg -o '\[Y[O]UR_VALUE_HERE:' $S/*.md | wc -l` prints `0`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed. The reruns in T010 to T014 are the check, and each printed its expected output.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Sibling packet for items 1 to 8**: `specs/system-skill-advisor/routing-and-scoring/011-surfacing-scorer-follow-ups`
<!-- /ANCHOR:cross-refs -->

---

