---
title: "Implementation Plan: Phase 25: data-driven hub registry"
description: "Move the compiled-route hub set into one hub-registry.json with a validating reader in each tree and a fail-closed reader in the advisor, prove route output byte-identical against a baseline, then review the branch until the review approves."
trigger_phrases:
  - "data driven hub registry plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 25: data-driven hub registry

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS and TypeScript |
| **Framework** | None |
| **Storage** | `hub-registry.json` in the promoted tree and the authored program root |
| **Testing** | `node --test` and vitest |

### Overview
Five hard-coded hub lists become reads of one registry file. Each reader lands with tests that failed on the unchanged code, and a captured baseline of route, guard, admission and status output proves no hub's routing moved. A `@review` pass over the branch proves it ready.
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
- [x] `node --test .skilled/bin/tests/` passes 218 with 1 skipped, and the 121 route outputs diff empty against the baseline
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single data registry

### Key Components
- **`hub-registry.json`**: lists each hub's `id`, `rolloutChild` and `defaultOn` in serving order. A consumer appends to `hubs` with a json-entry overlay.
- **`014-runtime-engine/lib/hub-registry.cjs`**: validates the registry and gives the engine, resolver, guard and sync their sets. Each tree carries its own copy, and sync reads each root's registry with the reader beside it.
- **The advisor reader in `compiled-routing-flag.ts`**: reads the same file without a dependency and returns empty sets on any error.

### Data Flow
The registry is read at load. The engine maps each id to its rollout child, the resolver and the advisor take the `defaultOn` hubs as the default-on cohort, and the guard and sync walk the same list. Sync copies the registry and its reader into the serving closure, so the promoted tree reads no spec path.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup captures the gates and the route, guard, admission, status and sync baselines. Implementation writes the tests red, adds the registry and its readers in both trees and the advisor, and regenerates the closure with sync. Verification diffs every baseline, runs `@review` until it approves and reruns the gates. The ordered work is in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The 121 `compiled-route.cjs --hub` outputs must diff empty against the baseline, and guard JSON, admission `--all` and status output must match. `.skilled/bin/tests` must pass 218 with 1 skipped from 196, bin vitest 95 of 95, and the advisor vitest 3545 with 4 skipped from 3530. `sync --check` and `--verify` must pass.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

None beyond Node.js, vitest and git. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a route output differs from the baseline or a gate drops below it. Revert `db263f34ebe` and `bf022a67b20` on the branch with `git revert`, then run `compiled-route-sync.cjs` to regenerate the closure. Nothing is pushed, so no remote state changes.
<!-- /ANCHOR:rollback -->

---
