---
title: "Implementation Plan: Make Runtime-Mirror and Routing Parity Gates Compare What Actually Differs"
description: "Replace Set-based body comparison with an order-and-surface-sensitive mirror check, derive the Codex sandbox mode from the source agent deny list instead of hardcoding it, resolve packet and leaf identities at compile time, and close the routing vocabulary and leaf-identity gaps."
trigger_phrases:
  - "runtime mirror parity"
  - "mirror sync verify ordering"
  - "registry compiler unresolved identity"
  - "codex agent parity coverage"
  - "deep loop 030 parity"
importance_tier: "high"
contextType: "general"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/006-runtime-docs-and-integrity-hardening/008-runtime-mirror-and-routing-parity"
    last_updated_at: "2026-08-18T23:59:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Reconciled packet docs to Complete with F-028-01 deferred"
    next_safe_action: "Commit the reconciled packet docs"
    blockers: []
    key_files:
      - "plan.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

# Implementation Plan: Make Runtime-Mirror and Routing Parity Gates Compare What Actually Differs

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | CommonJS (`sync-agents.cjs`, `mirror-sync-verify.cjs`, `registry-compiler.cjs`), agent definitions (Markdown, TOML), JSON registries |
| **Framework** | The mirror and parity suites plus `parent-skill-check.cjs` |
| **Storage** | Agent definition files, capability matrices, route registries |
| **Testing** | The existing mirror/parity suites, `node .opencode/commands/doctor/scripts/parent-skill-check.cjs` |

### Overview
The mirror gate and the registry compiler are independent of OD-2 and land first. OD-2 is resolved operationally from the shipped surfaces: Codex is included where a TOML mirror exists, while absent `.codex/*.md` files are not treated as missing; TOML tool surfaces remain non-comparable. Each fix is proven by inverting the probe the finding describes: the reordered body must now fail, the missing tool must now fail, and the ghost packet or missing leaf must now fail compilation.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `021`'s hashed-child-manifest boundary has landed, so this child can be scaffolded without widening the parent recursive glob
- [ ] The `021` baseline captured and cited
- [x] The load-bearing instruction set enumerated per mirrored agent
- [x] OD-2 answered, or REQ-008 explicitly deferred

### Definition of Done
- [x] Reordered-body and tool-surface probes both fail the gate
- [x] Ghost packet and missing leaf both fail compilation
- [x] One ai-council writer authority, agreed across every mirror
- [x] Whole gate re-run and reported as a delta against the captured baseline
- [ ] Independent adversarial verification pass complete
- [x] `validate.sh --strict` exits 0 for this child
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Invert the probe: every gate must fail on the difference the finding demonstrated it missed

### Key Components
- **Order-sensitive mirror comparison**: Load-bearing instruction sequences compared as sequences, not as a Set
- **Surface-sensitive mirror comparison**: Tool allowlists compared against what the body mandates
- **Derived sandbox mode**: The Codex mirror's sandbox mode computed from the source agent deny list
- **Resolving registry compiler**: Packet and leaf identities resolved on disk at compile time
- **Distinct improvement leaf identity**: Shared-packet leaves that keep the three improvement modes observable

### Data Flow
Source agent -> `sync-agents.cjs` (derive sandbox mode from the deny list) -> runtime mirrors -> `mirror-sync-verify.cjs` (order- and surface-sensitive comparison) -> parity claim. Separately: registry entries -> compiler (resolve packet and leaf on disk) -> compiled route vocabulary.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This child plans from a deep-review CONDITIONAL verdict, so the fix addendum applies in full.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `mirror-sync-verify.cjs` | Compares body tokens as a Set | update | Reordered-body and missing-tool probes both fail |
| `sync-agents.cjs` | Hardcodes the Codex sandbox mode | update | Derived mode does not contradict the generated body |
| `.codex/agents/ai-council.toml`, `.claude/agents/deep-review.md`, `.opencode/agents/*` | Mirrors with contradictory settings or surfaces | update | Gate passes only when they genuinely agree |
| `runtime-capabilities.json`, `review-mode-contract.yaml` | Hardcode two runtimes | update | Matrix matches shipped deep-review mirrors; TOML surface is non-comparable |
| `hub-router.json` | Missing a supported launcher | update | Orphaned-alias vocabulary check clean |
| `registry-compiler.cjs` | Asserts identity strings without resolving them | update | Ghost packet fails compilation |
| `shared/references/smart-routing.md` | Instructs readers to reinterpret a wrong identity | update | Three improvement modes distinct in a replay test |

Required inventories (run before implementation, record the output):
- Mirror comparison shape: `rg -n "Set|includes|sort" .opencode/skills/system-deep-loop/deep-improvement/scripts/lib/mirror-sync-verify.cjs`.
- Hardcoded runtime sets: `rg -n "opencode.*claude|claude.*opencode" .opencode/skills/system-deep-loop/deep-review/assets`.
- Identity assertions: `rg -n "assertString" bin/lib/compiled-routing/009-parent-hub-rollout/002-system-deep-loop/lib/registry-compiler.cjs`.
- Shipped Codex mirrors: `ls .codex/agents/`.

**Algorithm invariant.** A parity gate passes only when every load-bearing instruction sequence and every tool surface agrees across mirrors, and the compiler emits a route only when its packet and leaf resolve on disk. Adversarial cases: reordered instructions; a tool mandated by the body but absent from the allowlist; a sandbox mode contradicting the generated deny list; a ghost packet; a shared-packet leaf collapsed into the first-declared mode.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Confirm and enumerate
- [x] T001 classification of all 8 findings at HEAD
- [x] Enumerate the load-bearing instruction set per mirrored agent
- [x] Record OD-2 status

### Phase 2: Mirror gate and sync
- [x] Order-sensitive and surface-sensitive mirror comparison
- [ ] Derive the Codex sandbox mode from the source deny list (F-028-01 deferred — reverted, not landed)
- [x] Choose one ai-council writer authority and update every mirror together

### Phase 3: Routing
- [x] Add the missing launcher to the route vocabulary
- [x] Resolve packet and leaf identities at compile time
- [x] Keep the three improvement modes distinct and stop instructing readers to reinterpret

### Phase 4: Matrices and gate
- [x] Reconcile the capability matrices per OD-2
- [x] Run the mirror and parity suites plus `parent-skill-check.cjs`
- [ ] Independent verification pass
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Negative | Reordered-body probe fails the mirror gate | Mirror suite |
| Negative | Tool-surface difference fails the mirror gate | Mirror suite |
| Negative | Ghost packet and missing leaf fail compilation | Registry compiler test |
| Vocabulary | Orphaned-alias check clean | Route vocabulary check |
| Replay | Three improvement modes remain distinct | Routing replay test |
| Structural | Hub conformance | `node .opencode/commands/doctor/scripts/parent-skill-check.cjs` |

### Named verification commands

- `node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/system-deep-loop`
- `npx vitest run --config .opencode/skills/system-deep-loop/deep-improvement/scripts/vitest.config.mjs`
- `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-deep-loop/036-deep-loop-innovation/008-runtime-mirror-and-routing-parity --strict`
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `021` honest baselines | Internal | Red (not started) | Evidence issued against dishonest counts |
| Codex mirror regeneration and independent verification | Environment/process | Red (blocked) | Final closeout only; focused implementation gates remain available |
| Mirror and parity suites | Internal | Green | No verification possible |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The order-sensitive mirror gate fails on benign formatting differences at a rate that makes it unusable.
- **Procedure**: Revert the order-sensitivity commit while keeping surface sensitivity, which is the higher-value half. Re-enumerate the load-bearing instruction set before re-landing.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Confirm + enumerate) ──► Phase 2 (Mirror gate + sync)
                                          │
                                          ▼
                                  Phase 3 (Routing)
                                          │
                                          ▼
                                  Phase 4 (Matrices + gate)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 1 Confirm + enumerate | `021` | 2 |
| 2 Mirror gate + sync | 1 | 4 |
| 3 Routing | 1 | 4 |
| 4 Matrices + gate | 2, 3, OD-2 | Parity claims |
<!-- /ANCHOR:l2-phase-deps -->

---

<!-- ANCHOR:l2-effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Confirm + enumerate | Low | 3-5 hours |
| Mirror gate + sync | Medium | 10-16 hours |
| Routing | Medium | 8-12 hours |
| Matrices + gate | Low | 4-6 hours |
| **Total** |  | **25-39 hours** |
<!-- /ANCHOR:l2-effort -->

---

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-implementation Checklist
- [x] Baseline captured for every runner this child touches, at a named SHA
- [x] Work runs in an isolated git worktree (a concurrent session moved the review target mid-run)
- [x] Load-bearing instruction set enumerated per mirrored agent
- [x] OD-2 status recorded

### Rollback Procedure
1. Revert the order-sensitivity commit, keeping surface sensitivity.
2. Re-enumerate the load-bearing instruction set.
3. Re-run the mirror suite to confirm the prior behavior returns.
4. Record that `F-028-04` re-opens.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A — definitions and gates only.
<!-- /ANCHOR:l2-rollback -->
