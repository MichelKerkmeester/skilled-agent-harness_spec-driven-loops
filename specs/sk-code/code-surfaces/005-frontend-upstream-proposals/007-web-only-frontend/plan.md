---
title: "Implementation Plan: Phase 7: web-only-frontend"
description: "Remove the React Native layer from canonical sk-code in one DeepSeek build, then republish the compiled routes, prune the orphaned advisor signals and rerun every routing gate."
trigger_phrases:
  - "web only frontend plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 7: web-only-frontend

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, JSON, Python-dict router blocks |
| **Framework** | sk-code parent hub, compiled routing |
| **Storage** | None |
| **Testing** | `node --test`, router reach, playbook validator, `validate.sh` |

### Overview
One DeepSeek V4.1 Flash max build removes the native files and rewrites every surface that names React Native. This session then republishes the compiled routes, prunes the advisor signals the removed aliases leave behind, recompiles the skill graph and reruns the routing gates.
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
- [x] Compiled-route suites `fail 0`, reach `outranked=0` on every hub, signal check 0 orphans
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Removal across a two-stage router: the hub's stage-one vocabulary picks the surface, and the packet router's stage-two intents pick its leaves. Both stages lose the native intents together.

### Key Components
- **Packet router** `sk-code-frontend/ROUTER.md`: native intents and resource rows.
- **Hub router** `sk-code/ROUTER.md` and `hub-router.json`: mirrored intents, the frontend alias class, the ownership sentence.
- **Advisor vocabulary** `sk-code/graph-metadata.json` and `mode-registry.json` aliases.

### Data Flow
Edit sources → `compiled-route-manifest.cjs refresh` → `compiled-route-sync.cjs` → gates → `--finalize`; `generate-router-intent-signals.cjs --write` and the skill graph compile follow.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Six native references and the native scenario | React Native guidance | Delete | `ls` shows none |
| Packet and hub routers, vocabulary, registry | Route native prompts | Update | Reach, compiled-route suites |
| Docs naming "web and React Native" | Describe the surface | Update | `rg -n -i "react native" .skilled/skills/sk-code` |
| Frontend gold scenario `CB-CR-009` | Pins a React Native prompt | Update to a web prompt | `validate-compiled-routing-scenarios.cjs`, admission |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Router and manifest suites | `node --test .skilled/bin/tests/compiled-route-*.test.cjs` |
| Integration | Hub routing and advisor reach | `compiled-route-status.cjs`, `ci-router-vocabulary-reach.cjs --concurrency 2` |
| Manual | A web prompt routes to the surface; a React Native prompt does not | `compiled-route.cjs --hub sk-code --prompt` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `opencode run -m opencode-go/deepseek-v4.1-flash#max` | External | Green this session | No build; stop and ask |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a gate that passed at `f829fa7be5` fails after the change.
- **Procedure**: `git revert` the removal commit, then `compiled-route-sync.cjs` and finalize.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 006 closed | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Phase close |
<!-- /ANCHOR:phase-deps -->

---
