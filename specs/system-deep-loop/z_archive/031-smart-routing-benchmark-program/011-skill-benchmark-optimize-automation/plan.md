---
title: "Implementation Plan: Skill-Benchmark Optimize Automation (patch-gen)"
description: "Reconstructed Level 2 implementation plan for the skill-benchmark optimize automation phase. It restates the spec.md purpose, scope and success criteria; the original plan was never written."
trigger_phrases:
  - "skill-benchmark optimize automation plan"
  - "router patch gold patch automation plan"
importance_tier: "important"
contextType: "implementation"
---

> Reconstructed on 2026-10-07 from spec.md and git history. It was not written at the time.

# Implementation Plan: Skill-Benchmark Optimize Automation (patch-gen)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Not recorded |
| **Framework** | Skill-benchmark engine modules plus the loop-host mode wiring |
| **Storage** | `proposals/` patch and report artifacts (`router.patch`, `gold.patch`, `optimize-report.json`, `optimize-report.md`) |
| **Testing** | RED/GREEN vitest on synthetic skills; dry-run against the packet-002 code-review fix class; loop-host `planInvocation` check |

### Overview
Build the planned loop-host `--mode=skill-benchmark-optimize` to `optimize-skill-benchmark.cjs` that turns benchmark signals into propose-by-default `router.patch` and `gold.patch` (behind `--apply-router`/`--apply-gold`), re-deriving concrete fixes from source, gating every candidate through a mandatory anti-gaming guard and a re-benchmark, and preserving the sk-code `parent == union(children)` invariant.
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
Reuse the existing engine modules rather than adding a scoring engine: `routeSkillResources`, `parseRouter`, `scanConnectivity` and `loadPlaybookScenarios` are what let the optimizer re-derive concrete fixes from source, which is also what keeps it honest.

### Key Components
- Signal-to-fix classifier (orphan, always-loaded, gold-align, intent-gate)
- Patch emitter (`router.patch`, `gold.patch`) via `git diff --no-index`
- Apply path (`--apply-router`, `--apply-gold`) via `git apply --check` then re-benchmark
- Mandatory anti-gaming guard (methodology section 7)
- Loop-host mode wiring

### Data Flow
Benchmark signals go through the classifier, which re-derives a fix from source and emits a proposal patch. Every emitted patch must survive the anti-gaming guard and a re-benchmark before emission. Hub-aware fixes edit the child `SKILL.md` and verify `parent == union(children) + tier` as a hard precondition.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

### Phase 1: Signal-to-fix classifier and guard
- [ ] Classify orphan signals to a meaningful existing intent or to `routing-allowlist.json`
- [ ] Classify always-loaded and gold-align signals
- [ ] Classify intent-gate genuine over-routing via `wasteExDefault`
- [ ] Implement the mandatory anti-gaming guard

### Phase 2: Patch emission and apply modes
- [ ] Emit proposals via `git diff --no-index`
- [ ] Add `--apply-router` and `--apply-gold` via `git apply --check` then re-benchmark

### Phase 3: Hub-aware wiring
- [ ] Verify the `parent == union(children) + tier` precondition
- [ ] Wire the loop-host mode and flip the command-doc caveat

### Phase 4: Verification
- [ ] RED/GREEN vitest on synthetic skills
- [ ] Dry-run reproduces the packet-002 code-review fix class
- [ ] Loop-host `planInvocation('skill-benchmark-optimize', ...)` returns a single step
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Orphan to intent, orphan to allowlist, D3-ex-default to gold, D3-ex-default to router | vitest on synthetic skills |
| Unit | Anti-gaming rejections, hub drift-guard, propose-by-default, apply modes | vitest |
| Integration | Dry-run reproduces the packet-002 code-review fix class (orphan-wire + gold-align) | Optimizer dry-run |
| Unit | `planInvocation('skill-benchmark-optimize', ...)` returns a single step; missing args fail | loop-host test |

The `D3-ex-default` diagnostic stays optimizer-local (not a `scoreD3` change) to avoid the byte-identical-baseline blast radius across all skills.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing engine modules (`routeSkillResources`, `parseRouter`, `scanConnectivity`, `loadPlaybookScenarios`) | Internal | Available | Fixes cannot be re-derived from source |
| Packet 003's optimize-mode docs and methodology | Internal | Shipped per spec | The anti-gaming guard has no authored methodology |
| The sk-code hub union invariant | Internal | Available | Hub-aware fixes cannot be verified |

The phase could later ingest phase 010's anti-overfit awareness. It is a pure build with no operator decision recorded.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Not recorded — no rollback steps were captured when the phase was scaffolded. The spec's propose-by-default contract is the primary safety property: zero target mutation happens without `--apply-*`.
<!-- /ANCHOR:rollback -->
