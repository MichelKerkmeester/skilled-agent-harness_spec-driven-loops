---
title: "Implementation Plan: Phase 15: cli-hub-routing-and-classifier"
description: "Resolve the managed Pi install, route every advertised Jev phrase, send OpenCode Go prompts to the CLI hub and hook problems to a doctor command, then regenerate bridges and compiled routing copies."
trigger_phrases:
  - "cli hub routing and classifier plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 15: cli-hub-routing-and-classifier

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | ESM transport, JSON routing data, TypeScript advisor scorer, YAML doctor routes |
| **Framework** | cli-classifier hub, compiled routing, system-skill-advisor |
| **Storage** | hub-router.json, generated command bridges, activation manifests |
| **Testing** | node:test in cli-classifier and `.skilled/bin/tests`, vitest in the advisor runtime |

### Overview
Each miss is fixed in the data the router reads: the transport's package resolution, the hub vocabulary, the advisor's explicit phrase table and problem cue, and the doctor trigger phrases. Generated artifacts are rebuilt with their documented commands.
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
- [x] Advisor vitest at least 1379 passed, classifier 172, bin tests no new failures
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Fix the data at the source each router reads; regenerate what is derived.

### Key Components
- **`jev-transport.mjs`**: finds Pi and decides whether its route can run.
- **`hub-router.json`**: the vocabulary compiled routing reads for the classifier hub.
- **`lanes/explicit.ts`, `doctor-helper-handoff.ts`**: advisor phrase boosts and problem cues.
- **`_routes.yaml` and `derive-command-bridges.cjs`**: doctor trigger phrases and the bridges generated from them.

### Data Flow
A prompt reaches the advisor, which scores skills and command bridges; a hub prompt then goes through compiled routing against the hub vocabulary pinned by the activation manifest.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Pi package resolution | Climb only, exact pin | update | transport tests; real preflight on Pi 1.5.0 |
| cli-classifier hub vocabulary | Missing advertised phrases | update | `hub-router-phrases.test.mjs` |
| Advisor explicit phrase table | Bare `opencode` to sk-code | update | `opencode-provider-route.vitest.ts`, live CLI probe |
| Doctor helper cue and trigger phrases | No firing cue or phrase | update | `doctor-helper-handoff.vitest.ts`, bridges test |
| Activation manifest, bridges, projection | Generated | regenerate | guard, sync check, bridge `--check` |
| cli-external-orchestration mode choice for "opencode go route" | DeepSeek Harness by design | unchanged | ADR-001 |

Required inventories:
- Same-class producers: `rg -n "PI_PACKAGE_VERSION" .skilled/skills/cli-classifier`.
- Consumers: advisor gold and holdout prompts that mention opencode.
- Matrix axes: advertised phrase by router file (hub, cli-jev).
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup baselines the advisor, classifier and compiled-routing suites. Implementation runs one worker per finding, then the orchestrator regenerates the bridges, rebuilds the advisor dist and re-mints the classifier manifest. Verification reruns every baseline and the review.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Transport resolution and gate, cue table, explicit lane | node:test, vitest |
| Integration | Every advertised phrase through compiled routing; live advisor CLI probes | node:test, `skill-advisor.cjs` |
| Manual | Real preflight against the installed Pi 1.5.0 | node |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| cli-codex `gpt-6-luna` high fast | External | Green | Fall back to DeepSeek and log it |
| cli-pi `opencode-go/deepseek-v4.1-flash` max | External | Green | Only model reachable after GPT quota ran out |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A routed prompt lands on the wrong target.
- **Procedure**: `git revert` the phase commit.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 008 commit | Implementation |
| Implementation | Baseline recorded | Verification |
| Verification | Implementation and review | Phase 017 |
<!-- /ANCHOR:phase-deps -->

---
