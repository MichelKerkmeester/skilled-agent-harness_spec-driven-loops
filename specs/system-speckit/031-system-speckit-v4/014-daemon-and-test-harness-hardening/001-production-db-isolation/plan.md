---
title: "Implementation Plan: Phase 1: Production Database Isolation"
description: "Reconcile the two vitest entry points and add a fail-closed resolver check so a test run cannot reach the production memory database, proven by a negative control run before the fix."
trigger_phrases:
  - "production db isolation plan"
  - "vitest config reconcile"
  - "fail closed resolver"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1: Production Database Isolation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node |
| **Framework** | Vitest |
| **Storage** | SQLite (`context-index.sqlite`, 12.9 GB, daemon-held) |
| **Testing** | Vitest, with a negative control run before the fix |

### Overview
Two vitest configs cover overlapping test globs and only one loads the isolation setup. Collapse that asymmetry, then add a second line of defence in the path resolver so the guarantee does not depend on which config a run happens to pick up.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- The resolver-wide versus test-scoped question in spec.md is answered
- The pre-fix negative control has been captured

### Definition of Done
- Runs from `scripts/`, `mcp-server/`, and the skill root all resolve a throwaway directory
- The negative control that reproduced the bypass now fails closed
- Full suite run shows no new failures against the recorded baseline
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Defence in depth: one structural fix (single reachable setup) plus one behavioural fix (resolver refuses the production directory in a test context).

### Key Components
- `vitest.config.ts` (root) — currently no `setupFiles`, globs `mcp-server/tests/**`
- `mcp-server/vitest.config.ts` — loads the isolation setup
- `tests/_support/vitest-setup.ts` — owns `isolateProductionDatabase()`
- shared path resolver — currently falls back to the production directory

### Data Flow
Working directory selects a config, config selects setup files, setup sets `SPEC_KIT_DB_DIR`, resolver reads it or falls back. The gap is at the second step; the fix closes it at the second and fourth.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
Capture the negative control: record the pre-fix resolved database path from a `scripts/`-rooted run, and confirm which config that run actually loads.

### Phase 2: Implementation
Reconcile the two configs by sharing `setupFiles` or deleting the root config if it has no remaining caller. Add the fail-closed resolver check under the decided condition, then add the drift check that fails on an unguarded glob.

### Phase 3: Verification
Re-run the negative control, run from all three working directories, and compare the full suite against the recorded baseline.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The negative control is the primary evidence: reproduce the exact bypass first, so the same check proves the fix. Assert on the resolved path only — never open a handle against the live database. Add a config-drift check that fails when a vitest config globs `mcp-server/tests/**` without the isolation setup.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

None blocking. This phase runs first and hands off to 002.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Every change is additive or a config edit. Revert the commit to restore prior behaviour. If the root config is deleted rather than repaired, restoring it is a single file revert. No data migration, so rollback carries no data risk.
<!-- /ANCHOR:rollback -->

---
