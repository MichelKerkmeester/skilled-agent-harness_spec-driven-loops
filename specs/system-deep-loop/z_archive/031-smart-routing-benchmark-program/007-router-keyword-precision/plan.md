---
title: "Implementation Plan: Router Keyword-Precision Narrowing (over-activation fix)"
description: "Reconstructed Level 2 implementation plan for the router keyword-precision narrowing phase. It restates the spec.md purpose, scope and success criteria; the original plan was never written."
trigger_phrases:
  - "router keyword precision plan"
  - "router over-activation narrowing plan"
importance_tier: "important"
contextType: "implementation"
---

> Reconstructed on 2026-10-07 from spec.md and git history. It was not written at the time.

# Implementation Plan: Router Keyword-Precision Narrowing (over-activation fix)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Not recorded |
| **Framework** | deep-loop child skill routers (deep-research, deep-improvement) under substring keyword scoring |
| **Storage** | `INTENT_SIGNALS` keyword lists in each child's `SKILL.md` |
| **Testing** | `routeSkillResources` gold-preservation and probe-suppression proofs; Mode-A benchmark (D1intra, D3, D5); drift guards |

### Overview
Narrow the over-broad generic keywords in the deep-research and deep-improvement child routers so unrelated marketing, billing and UI prompts stop mis-routing to research intents, then prove the shipped Type-1 gold is preserved and the reproduced probes are suppressed.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Keyword-list narrowing under substring scoring. Tactic A replaces a bare common word with a compound keyword; Tactic B drops a pure idiom. The `focus trap` compound already shipped in code-webflow is the in-repo narrowing precedent.

### Key Components
- deep-research `SKILL.md` keyword list (STATE, ITERATION, CONVERGENCE)
- deep-improvement `SKILL.md` keyword list (bare words such as `strategy`, `contract`, `integration`)
- Shipped Type-1 gold scenarios and the reproduced probes, re-run through `routeSkillResources`

### Data Flow
A prompt is scored by substring keyword matching in `router-replay.cjs`; the parsed intent set decides which resources load. Narrowing changes which prompts fire an intent without changing `RESOURCE_MAP`, intents or the hub.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

### Phase 1: Baselines
- [ ] Capture the shipped Type-1 gold routing for both skills
- [ ] Reproduce the mis-routing probes

### Phase 2: Narrowing
- [ ] Narrow deep-research keywords (Tactic A compound / Tactic B drop)
- [ ] Narrow deep-improvement keywords
- [ ] Optionally extend 2 deep-research scenario prompts for the new compounds
- [ ] Document deep-review residuals and deep-research secondaries as known; log sk-code as a follow-up

### Phase 3: Verification
- [ ] Gold-preservation proof (zero drift)
- [ ] Probe-suppression proof (all mis-routes eliminated)
- [ ] D5 structural gate unchanged; drift guards green
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Before/after routing of every shipped Type-1 scenario | `routeSkillResources` |
| Unit | The 4 deep-research probes and deep-improvement's probes drop to `intents: []` | `routeSkillResources` |
| Regression | Mode-A D1intra flat, D3 flat on positives, D5 green | Mode-A benchmark |

No separate test commands are recorded; the spec names the proofs and the Mode-A signals as the verification surface.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Shipped Type-1 gold scenarios for deep-research and deep-improvement | Internal | Not recorded | Gold-preservation proof has no baseline |
| `routeSkillResources` and the Mode-A harness | Internal | Available | Routing and scoring proofs cannot run |

The phase is independent of its siblings; the phase-011 optimizer (intent-gate class) could later automate this work.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Not recorded — no rollback steps were captured when the phase was scaffolded. The spec records the accepted in-session recall tradeoff and that compounds cover natural phrasings.
<!-- /ANCHOR:rollback -->
