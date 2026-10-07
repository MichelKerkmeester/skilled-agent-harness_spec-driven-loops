---
title: "Implementation Plan: Phase 006 — Command surface + docs + final parity"
description: "Reconstructed Level 2 implementation plan for the command-surface and parity phase. It restates the spec.md purpose, scope and success criteria; the original plan was never written."
trigger_phrases:
  - "command surface docs parity plan"
  - "fanout command flags parity plan"
importance_tier: "important"
contextType: "implementation"
---
> Reconstructed on 2026-10-07 from spec.md and git history. It was not written at the time.

# Implementation Plan: Phase 006 — Command surface + docs + final parity

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Command markdown entrypoints, the deep-loop YAML assets and the runtime SKILL docs |
| **Framework** | deep-loop-runtime fan-out exposed through `/deep:start-research-loop` and `/deep:start-review-loop` |
| **Storage** | Not recorded |
| **Testing** | Full vitest suite plus the strict `validate.sh` gate and the byte-identical parity check |

### Overview
Expose fan-out as an opt-in command flag surface, document it for both consumers, and prove the single-executor path stays byte-identical to pre-change `main`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phases 001-005 available, including `fanout-pool.cjs` and `fanout-merge.cjs`
- [ ] Default-resolution behavior agreed for the single-executor path

### Definition of Done
- [ ] Command flags documented for both entrypoints with the single-executor default unchanged
- [ ] Fan-out carve-out documented in both consumer SKILLs and the runtime script table
- [ ] Single-executor run byte-identical to pre-change `main`
- [ ] `validate.sh --strict` green for parent and children
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Opt-in flag surface: 0-1 executor without `--executors` resolves to the unchanged `config.executor`; 2+ executors, `--executors`, or `count>1` resolve to `config.fanout`.

### Key Components
- `commands/deep/start-research-loop.md` and `start-review-loop.md` §0
- `deep-research/SKILL.md` and `deep-review/SKILL.md` carve-outs
- Both `references/convergence/convergence.md` files
- `deep-loop-runtime/SKILL.md` script table

### Data Flow
Command flags are parsed into `config.executor` or `config.fanout`; the documented default keeps the single-executor path unchanged.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`; it owns task state.

### Phase 1: Command surface
- [ ] Add the fan-out flags, default resolution table and examples to both entrypoints

### Phase 2: Docs
- [ ] Add the consumer SKILL carve-outs, convergence docs and the runtime script-table rows

### Phase 3: Verification
- [ ] Parity gate plus the full test and strict-validation runs
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Full vitest suite, the strict `validate.sh` gate for parent and children, and the non-negotiable byte-identical single-executor parity check; exact command output is Not recorded.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 001-002 schema and pool | Internal | Not recorded | Flags would have no config surface or pool to drive |
| Phases 003-005 spawn, salvage and merge | Internal | Not recorded | Fan-out could not run end to end |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Not recorded — no rollback steps were captured when the phase was worked.
<!-- /ANCHOR:rollback -->
