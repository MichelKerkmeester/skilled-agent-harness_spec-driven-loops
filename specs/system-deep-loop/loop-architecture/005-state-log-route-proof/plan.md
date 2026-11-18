---
title: "Implementation Plan: Keep route-proof fields in the deep-research state log and keep the pre-dispatch audit path inside the packet"
description: "Adds three optional route-proof fields to the iteration record and carries them through the ledger schema, the legacy conversion and the state-log projection. Resolves a relative state-log path against the caller's working directory before the append gateway spawns."
trigger_phrases:
  - "state log route proof plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Keep route-proof fields in the deep-research state log and keep the pre-dispatch audit path inside the packet

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript |
| **Framework** | Vitest 4.1.12 |
| **Storage** | A state log file, written through the append gateway |
| **Testing** | Vitest (`npx vitest run`) and the TypeScript compiler (`npm run typecheck`) |

### Overview
The change adds three optional fields to the `deep_research.iteration_completed` record. It copies them through the legacy conversion and the projection, so the state log keeps them. It also exports `gatewayRunDirectory`, which fixes a relative state-log path against the caller's working directory before the append gateway spawns. Each part has a test, and the whole deep-loop suite runs after the change.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] `npm test` in the runtime folder exits 0 and prints `Tests  3098 passed` with 9 skipped. `npm run typecheck` in the same folder exits 0.
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other: ledger-to-state-log projection

### Key Components
- **Ledger schema and legacy conversion** (`.skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/`): types the three optional fields and copies them from a legacy record. Without them, the fields never reach the ledger.
- **Contract projection** (`.skilled/skills/system-deep-loop/runtime/lib/legacy-projections/deep-research-contract.ts`): writes the fields into the state log under snake_case keys. Without it, the state log keeps only `mode`.
- **Executor audit path** (`.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts`): `gatewayRunDirectory` fixes the run directory before the spawn. Without it, a relative path resolves inside the Skilled checkout.

### Data Flow
The iteration delta file carries the three fields. The legacy conversion copies them into the ledger record when their types are valid. The projection writes them into the `deep_research.iteration_completed` state-log entry as `target_agent`, `agent_definition_loaded` and `resolved_route`. The post-dispatch validator (`lib/deep-loop/post-dispatch-validate.ts`) reads those keys for the route-proof check. For a relative state-log path, `gatewayRunDirectory` returns the absolute directory before the append gateway spawns from the repository root.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup confirms the branch, the source item and the sibling packet. Implementation adds the three optional fields to the schema, copies them in the legacy conversion, writes them in the projection, adds the route-proof test and the run-directory test, and exports `gatewayRunDirectory` for `appendThroughGateway`. Verification runs the ledger suite, the three executor-audit suites, the typecheck and the whole deep-loop suite. The ordered steps and their verify commands are in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Run `npm test` in the runtime folder. It must print `Test Files  186 passed (186)` and `Tests  3098 passed` with 9 skipped. The focused runs come first, in `tasks.md` T010 to T012.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The change adds no package. `package.json` and `package-lock.json` are not in the diff. The runtime uses Vitest 4.1.12 from its own `devDependencies`. The typecheck runs the TypeScript compiler from `.skilled/skills/system-spec-kit/node_modules/.bin/tsc`, so that folder must have its dependencies installed.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a correct run fails the route-proof check, or a relative state-log path writes outside the packet again. Revert the commit that lands this change. Before that commit exists, restore the five modified files and delete `executor-audit-run-directory.vitest.ts`.
<!-- /ANCHOR:rollback -->

---

