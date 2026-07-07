---
title: "Implementation Plan: Lane C Live Playbook Mode (Mode B)"
description: "Phased build of the Lane C redesign: playbook corpus + dual trace-mode (router CI gate / live default), live cli-opencode executor, bdg browser executor, D4 ablation, and an auto-CREATE generator."
trigger_phrases:
  - "Lane C mode B plan"
  - "skill-benchmark live playbook plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/023-deep-improvement-skill-benchmark-mode/010-skill-benchmark-live-playbook-mode"
    last_updated_at: "2026-06-01T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Phases 0-5 + parser hardening built; live Mode B confirmed (gpt-5.5-fast high)"
    next_safe_action: "Finalize packet docs + validate.sh --strict"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "skill-benchmark-live-playbook-mode"
      parent_session_id: null
    completion_pct: 85
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Lane C Live Playbook Mode (Mode B)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS (`.cjs`) harness; opencode CLI; bdg (Chrome DevTools CLI) |
| **Framework** | Vitest |
| **Storage** | None (filesystem playbooks + JSON/MD reports) |
| **Testing** | `npx vitest run` from `.opencode/skills/deep-improvement/scripts` |

### Overview
One playbook corpus, two trace-modes (router = deterministic CI gate; live = cli-opencode, the operator default), three executors selected by classKind (router-replay / live / bdg-browser), plus D4 ablation and a staged generator.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Plan-mode research (3 explore + 3 plan agents) + live spike
- [x] Decisions fixed (dual-mode/live-default; browser-now; full build)

### Definition of Done
- [x] All 6 phases built; 245 tests green
- [x] Live Mode B confirmed with gpt-5.5-fast high (aggregate 76)
- [ ] Packet docs strict-valid + reference/command docs updated
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Additive, seam-based: one parser → one dispatch seam → one scorer → one report. Executors plug in behind the seam; router mode stays dependency-free.

### Key Components
- **load-playbook-scenarios.cjs**: playbook → normalized gold (classKind routing/advisor/browser).
- **executor-dispatch.cjs**: one observed-result for all executors; live/browser gated to live mode.
- **live-executor.cjs / browser-executor.cjs / d4-ablation.cjs / playbook-generator.cjs**: the executors + generator.
- **score/build-report**: real-gold scoring, A↔B divergence, coverage, live evidence.

### Data Flow
playbook → scenarios{classKind} → dispatchScenario(trace-mode) → observed-result → scoreScenario → aggregate → report.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| run-skill-benchmark.cjs | orchestrator | dual-path corpus + classKind loop | suite + live run |
| score-skill-benchmark.cjs | scorer | adapter + real-gold + divergence + live evidence | unit tests |
| executor-dispatch / live / browser / d4 / generator | executors | new modules | unit + live + bdg |
| loop-host.cjs | planner | flags forwarded | wiring test |

Consumers of `parseRouter`/`scoreScenario`: updated with back-compat adapters; full suite re-run green.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Parser + executor-dispatch + dual-path run + real-gold score + report + flags

### Phase 2: Core Implementation
- [x] Phase 0 spike; Phase 2 live executor; Phase 3 browser; Phase 4 D4; Phase 5 generator
- [x] Cross-model parser hardening (fenced-any-tag / bare / prose)

### Phase 3: Verification
- [x] 245 tests green; live Mode B confirmed (gpt-5.5-fast high, aggregate 76)
- [ ] Packet docs + reference/command docs + strict validate
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | parser, dispatch, score, divergence, live-parse, browser verdicts, d4, generator gates | Vitest (deterministic) |
| Live | spike + re-benchmark via cli-opencode | opencode CLI (gpt-5.5-fast high) |
| Browser | MR-001 smoke | bdg headless |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| cli-opencode + provider auth | External | Green (OpenAI/DeepSeek/MiniMax) | live mode only |
| bdg | External | Green | browser scenarios only |
| gradeD4 (Lane B) | Internal | Green | D4 only |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: regression in inline-router benchmarks or CI flakiness.
- **Procedure**: `git revert` the harness edits; new modules are inert unless trace-mode=live; router mode stays deterministic.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
spike(0) ─► spine(1) ─► live(2) ─► browser(3) ─► d4(4) ─► generator(5) ─► docs(6)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Spine | Spike | all executors |
| Executors | Spine | Docs |
| Docs | Executors | release |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Spine + executors | High | done |
| Docs | Med | in progress |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] 245-test suite green before claiming done
- [x] Live default-flip deferred until stable

### Rollback Procedure
1. `git revert` the three modified harness scripts.
2. Re-run `npx vitest run` to confirm prior state.
3. New executor modules + packet are inert.

### Data Reversal
- **Has data migrations?** No. Filesystem-only.
<!-- /ANCHOR:enhanced-rollback -->
