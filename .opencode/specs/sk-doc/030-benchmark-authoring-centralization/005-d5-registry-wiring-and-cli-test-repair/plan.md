---
title: "Implementation Plan: D5 registry-gate wiring + cli-* test repair"
description: "Wire scanHubRegistry into the run path with a BLOCKED-BY-REGISTRY verdict branch and repair the relocated cli-* skill-benchmark tests, via a GPT-5.6 SOL agent, verified by a fresh Sonnet reviewer and the orchestrator."
trigger_phrases:
  - "d5 registry wiring plan"
  - "cli test repair plan"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-benchmark-authoring-centralization/005-d5-registry-wiring-and-cli-test-repair"
    last_updated_at: "2026-07-14T19:30:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored the plan"
    next_safe_action: "Dispatch the fix agent"
    blockers: []
    key_files: []
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
# Implementation Plan: D5 registry-gate wiring + cli-* test repair

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node/CJS runtime + vitest |
| **Framework** | deep-improvement Lane C skill-benchmark runtime |
| **Storage** | Filesystem skill trees; no DB change |
| **Testing** | vitest (skill-benchmark) |

### Overview
Close packet 004's two documented limitations: make `BLOCKED-BY-REGISTRY` reachable through `run()` and repair the relocated cli-* test references. A GPT-5.6 SOL (xhigh) agent applies the fixes; a fresh Sonnet (xhigh) reviewer and the orchestrator verify against the real files and the full suite.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Wiring path traced (`aggregate` verdict block; `emptyHubRegistryResult` safe for non-hubs)
- [x] Relocation confirmed committed + stable on origin/v4
- [x] Spec folder + caveat-3 deferral operator-resolved

### Definition of Done
- [x] Full skill-benchmark suite passes (0 failures) incl. new registry-gate test
- [x] Non-hub skill unaffected; 004 structural gate intact
- [x] validate.sh --strict Errors 0
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Minimal wiring + test repair; agent-applied, adversarially verified.

### Key Components
- **run-skill-benchmark.cjs**: adds the `scanHubRegistry` call, threads it into `aggregate`.
- **score-skill-benchmark.cjs `aggregate()`**: new `BLOCKED-BY-REGISTRY` verdict branch after the structural branch.
- **skill-benchmark.vitest.ts**: relocated-path repair + registry-gate test.

### Data Flow
`run()` scans both connectivity (structural) and hub registry; `aggregate` sets the verdict with structural precedence over registry; `run()` returns exit 3 on either D5 block.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `run-skill-benchmark.cjs` | Runs only `scanConnectivity` | update | calls `scanHubRegistry`; registry test passes |
| `score-skill-benchmark.cjs` | `aggregate` ignores hub registry | update | `BLOCKED-BY-REGISTRY` branch; precedence test |
| `skill-benchmark.vitest.ts` | 8 tests at stale cli-* paths | repair | suite 0 failures |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Wire `scanHubRegistry` into `run()` + `aggregate` verdict branch
- [ ] Add the registry-gate exit-code test

### Phase 2: Implementation
- [ ] Repair the relocated cli-* test references + router-parse assertions

### Phase 3: Verification
- [ ] Sonnet reviewer + orchestrator re-verify; full suite 0 failures
- [ ] validate.sh --strict Errors 0; commit + integrate
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | registry gate, exit code, non-hub safety | vitest |
| Regression | full skill-benchmark suite | vitest |
| Spec | packet integrity | validate.sh --strict |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| vitest (deep-improvement) | Internal | Green | Changes unverifiable |
| cli-* relocation on origin/v4 | Internal | Green | Test repair target undefined |
| validate.sh --strict | Internal | Green | Packet ungated |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A gate regresses or the registry branch changes an existing verdict unexpectedly.
- **Procedure**: Work lands as one scoped commit; `git revert` restores. The wiring is additive (a new verdict branch + a guarded call), so reverting is clean.
<!-- /ANCHOR:rollback -->
