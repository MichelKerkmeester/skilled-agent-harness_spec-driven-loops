---
title: "Implementation Plan: Deep-loop fan-out remediation (009)"
description: "Phase-grouped plan to fix the 14 verified fan-out findings: make the gate honest (C-02) before making it concurrent (C-01), then P1 hardening, then the L/High verbatim change and docs. Reuses existing runtime helpers throughout."
trigger_phrases:
  - "123 phase 009 plan"
  - "fanout remediation plan"
  - "fix fanout concurrency plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/009-deep-loop-parallel-fanout/009-fanout-remediation"
    last_updated_at: "2026-05-31T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored Level-3 plan; 3 phases, gate-honest before concurrent"
    next_safe_action: "Implement Phase 1 P0 fixes; C-02 fail-closed before C-01 async spawn"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Deep-loop fan-out remediation (009)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Fix the 14 verified findings in dependency order. The governing principle: **make the gate honest before making it concurrent** — C-02 (failed lineage = failure; merge fails closed) lands first so the test harness reports failures truthfully before C-01's concurrency change can mask them. Then P1 hardening (bounds, env, dedup, xor, salvage), then the L/High verbatim change (C-03) and doc cleanup. Reuse `runAuditedExecutorCommandAsync` (async spawn + process-group kill), `buildExecutorDispatchEnv` (env allowlist), and `pad3` (filename padding) rather than writing new code. The single-executor path stays byte-identical (hard parity gate). Stack: Node CJS scripts + TypeScript lib + YAML workflows; tests via vitest from `system-spec-kit/mcp_server`.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Findings source-verified across 3 review passes (008 review + 2 Opus iterations)
- [x] Reuse targets located and confirmed (executor-audit.ts, session-state-hierarchy.cjs)
- [x] ADRs decided (verbatim / `.kind` / allowlist / full-anchor / parity gate)

### Definition of Done
- [ ] All P0 + P1 requirements met with their tests
- [ ] Real-spawn concurrency test + fail-closed merge test present and green
- [ ] Full fanout suite green; single-executor parity gate green; `validate.sh --strict` green on 009

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Capped async worker pool over per-lineage subprocesses; consumer-specific cross-lineage merge.

### Key Components (touched)
- **fanout-run.cjs** — pool worker + per-lineage command build + env + salvage call (C-01, C-02, C-03, ENV-LEAK, N-02)
- **fanout-merge.cjs** — research + review cross-lineage merge (C-02 fail-closed, MERGE-DROP, MERGE-DEDUP, N-04)
- **fanout-salvage.cjs** — stdout→md recovery (C-04, N-01)
- **executor-config.ts** — schema + parse/expand (BOUNDS, XOR)
- **command YAMLs + docs** — executor field parity (U-01)

### Data Flow (target, post-fix)
```
config → parseFanoutConfig (BOUNDS + XOR) → expandLineages
   → runCappedPool(worker = async spawn via runAuditedExecutorCommandAsync, env = buildExecutorDispatchEnv)
   → per-lineage verbatim command (C-03) → salvage (padded, per-iter) → fanout-merge (fail-closed, content-hash dedup)
```
Single-executor path: UNCHANGED (byte-identical parity gate).

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: P0 correctness (gate-honest, then concurrent)
- [ ] C-02 worker throws on non-zero/timeout; merge fails closed on zero registries
- [ ] C-01 replace inner `spawnSync` with async spawn (reuse `runAuditedExecutorCommandAsync`) — folds in TIMEOUT-ORPHANS
- [ ] U-01 standardize executor field on `.kind` across YAML predicates + command docs
- [ ] MERGE-DROP `tryReadJson` parse-error sentinel; merge fails closed

### Phase 2: P1 hardening
- [ ] BOUNDS `.max()` on count + concurrency + total-expansion cap
- [ ] ENV-LEAK replace `{...process.env}` with `buildExecutorDispatchEnv()` + per-kind state vars
- [ ] MERGE-DEDUP key on `content_hash` (fallback `file:line+normalized_title`)
- [ ] XOR root validator rejecting both-present config
- [ ] C-04 + N-01 zero-pad salvage filename (reuse `pad3`); stop blob reuse

### Phase 3: design + docs
- [ ] C-03 replace `buildLoopPrompt` synthesis with verbatim command invoke; forward `lineage.iterations`
- [ ] N-04 attribution verdict from live severities; N-02 comment; DOC-STALENESS cleanup

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tool | Target |
|-----------|-------|------|--------|
| Unit (new) | real-spawn pool concurrency | vitest | ≥2 alive at cap 2 (catches C-01) |
| Unit (new) | all-fail merge | vitest | non-PASS + failed>0 (catches C-02) |
| Unit | bounds / xor / dedup / padding | vitest | each P1 acceptance criterion |
| Parity | single-executor byte-identical | diff vs `main` | non-negotiable (ADR-005) |
| Suite | full `fanout-*` + `executor-config` | vitest | green, run from `system-spec-kit/mcp_server` |

Test invocation: `cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run ../../deep-loop-runtime/tests/unit/<file>.vitest.ts`

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `runAuditedExecutorCommandAsync` (executor-audit.ts:663) | Internal | Green | C-01/TIMEOUT-ORPHANS need a hand-rolled async spawn |
| `buildExecutorDispatchEnv` (executor-audit.ts:466) | Internal | Green | ENV-LEAK needs a new allowlist |
| `pad3` (session-state-hierarchy.cjs:25) | Internal | Green (needs export) | C-04 inlines `padStart(3,'0')` |
| reducer `content_hash` field | Internal | Verify | MERGE-DEDUP adds a small `computeFindingHash` if absent |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: parity gate fails (single-executor output drifts), or the fanout suite regresses.
- **Procedure**: revert the phase's commits by pathspec; the fan-out layer is opt-in, so reverting restores the prior single-executor behavior with no data migration.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## 8. PHASE DEPENDENCIES

```
Phase 1 (C-02 → C-01 → U-01 → MERGE-DROP) ──> Phase 2 (P1 hardening) ──> Phase 3 (C-03 verbatim + docs)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1 | review findings (008) | Phase 2 |
| Phase 2 | Phase 1 (honest gate) | Phase 3 |
| Phase 3 | Phase 1, 2 | Done |

C-02 must precede C-01 (honest failures before concurrency can hide them). MERGE-DROP completes C-02's merge half. C-03 is last (largest, highest risk).

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## 9. EFFORT ESTIMATION

| Item | Complexity | Effort |
|------|------------|--------|
| C-02 + MERGE-DROP | S | 2h |
| C-01 + TIMEOUT-ORPHANS | M | 4h |
| U-01 | S–M | 2h |
| BOUNDS + XOR | S | 2h |
| ENV-LEAK | M | 2h |
| MERGE-DEDUP | M | 3h |
| C-04 + N-01 | S | 2h |
| C-03 verbatim | L | 6h |
| N-04 + N-02 + DOC-STALENESS | S–M | 3h |
| **Total** | | **~26h** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## 10. ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Single-executor parity baseline captured (config/state/iteration/report on `main`)
- [ ] Full fanout suite count recorded before changes
- [ ] Commits scoped by pathspec (daemon graph-metadata excluded)

### Rollback Procedure
1. Revert the offending phase commits (`git revert` by pathspec).
2. Re-run the fanout suite + parity gate to confirm restored state.
3. The fan-out layer is opt-in; single-executor users are unaffected either way.

### Data Reversal
- **Has data migrations?** No — code + docs only; no schema change (coverage-graph isolation is by session_id, unchanged).

<!-- /ANCHOR:enhanced-rollback -->
---

<!-- ANCHOR:dependency-graph -->
## 11. DEPENDENCY GRAPH

```
C-02 (fail-honest) ──> C-01 (async spawn) ──> [TIMEOUT-ORPHANS folded in]
   │                       │
   ├──> MERGE-DROP         └──> real-spawn concurrency test
U-01 (.kind parity) ── independent, Phase 1
Phase 2: BOUNDS, XOR, ENV-LEAK, MERGE-DEDUP, (C-04+N-01) ── mostly independent
Phase 3: C-03 depends on C-01 spawn shape; N-04, N-02, DOC-STALENESS independent
```

<!-- /ANCHOR:dependency-graph -->
---

<!-- ANCHOR:critical-path -->
## 12. CRITICAL PATH

1. **C-02** fail-honest — 2h — CRITICAL (unblocks honest testing)
2. **C-01** async spawn — 4h — CRITICAL (the headline fix; depends on honest gate)
3. **C-03** verbatim — 6h — CRITICAL (largest; depends on the new spawn shape)

**Total critical path**: ~12h. Parallel opportunities: U-01, BOUNDS, XOR, ENV-LEAK, salvage, and doc cleanup proceed alongside the critical path.

<!-- /ANCHOR:critical-path -->
---

<!-- ANCHOR:milestones -->
## 13. MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Honest gate | C-02 + MERGE-DROP land; all-fail → non-PASS test green | Phase 1 mid |
| M2 | True concurrency | C-01 lands; real-spawn test green; parity gate green | Phase 1 end |
| M3 | Hardened | BOUNDS/XOR/ENV/DEDUP/salvage land with tests | Phase 2 end |
| M4 | Contract-honest | C-03 verbatim + U-01 + docs; full suite green | Phase 3 end |

<!-- /ANCHOR:milestones -->
---

<!-- ANCHOR:adr-summary -->
## 14. ARCHITECTURE DECISION SUMMARY

See `decision-record.md`:

| ADR | Decision | Rationale |
|-----|----------|-----------|
| ADR-001 | C-03 true verbatim per-CLI-lineage execution | Honor packet §2 Option B; avoid model-interpretation drift |
| ADR-002 | Standardize executor field on `.kind` | Loader-canonical; one name across docs/YAML/code |
| ADR-003 | Reuse `buildExecutorDispatchEnv` allowlist | Strongest guarantee, least new code, runtime-consistent |
| ADR-004 | Full-anchor Level-3 docs for this phase | Pass `validate.sh --strict`; upgrade packet posture |
| ADR-005 | Single-executor byte-identical parity gate | Non-negotiable; fan-out is opt-in and must not perturb default |

<!-- /ANCHOR:adr-summary -->
