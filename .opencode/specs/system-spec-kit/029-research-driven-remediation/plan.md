# Implementation Plan: Research-Driven Remediation

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

Four defects across four subsystems: mcp_server (TS), code-graph (TS), deep-improvement (CJS), and the mcp_server test suite. Each builds and verifies independently.

### Overview

Verify-first per finding, fix in isolation (one sub-agent per subsystem), build the affected dist, run the targeted suite, then commit centrally. Treat research findings as hypotheses, not facts.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- The finding is reproduced against the current source with file:line evidence.

### Definition of Done

- Build green where a dist exists; targeted test suite green; diff scope-locked to the named file(s).
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Shared post-mutation hook for cache invalidation; conditional-spread response fields for optional signals; fixture parity for launcher tests.

### Key Components

- `runPostMutationHooks` (mutation-hooks.ts) — the shared cache-invalidation entry point.
- `computeBlastRadius` (code-graph query.ts) — the BFS that gains the `depthTruncated` signal.

### Data Flow

Handler mutates state -> invokes the shared hook -> graph/entity caches cleared -> next read is fresh.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

Locate and verify each finding against the source.

### Phase 2: Core Implementation

Land the four fixes (causal hook, variant forwarding, fixture lib copy, depthTruncated signal).

### Phase 3: Verification

Build affected dists; run targeted vitest suites; review diffs for scope creep.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Per-fix targeted vitest (causal/relation suites, playbook suite, code-graph query suite) plus a launcher un-skip proof. Builds via each subsystem's `npm run build`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `runPostMutationHooks` already exported and used by sibling handlers.
- code-graph builds from its SKILL root, not its mcp_server subdir.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Each fix is an isolated, additive change; revert the single commit `e42232428e` to back all four out. Dists regenerate from source.
<!-- /ANCHOR:rollback -->
