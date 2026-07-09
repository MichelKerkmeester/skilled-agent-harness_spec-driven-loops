---
title: "Tasks: Deep-loop fan-out remediation (009)"
description: "One task per verified finding-fix plus the test that catches it, grouped setup / implementation / verification, with dependencies and reuse targets explicit."
trigger_phrases:
  - "123 phase 009 tasks"
  - "fanout remediation tasks"
  - "fanout fix task list"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/009-deep-loop-parallel-fanout/009-fanout-remediation"
    last_updated_at: "2026-05-31T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored Level-3 task list; one task per fix + its test"
    next_safe_action: "Start T101 C-02 worker throw + merge fail-closed"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Deep-loop fan-out remediation (009)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:notation -->
## TASK NOTATION

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file) [effort] {deps} {finding}`. Milestones: M1 honest gate (T101-T104), M2 true concurrency (T110-T113), M3 hardening (T120-T129), M4 verbatim+docs (T140-T148).

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## PHASE 1: SETUP

Capture baselines and the honest-gate prerequisites before touching the concurrency hot path.

- [ ] T001 Capture single-executor parity baseline (config/state/iteration/report on `main`) for the ADR-005 gate [S]
- [ ] T002 Record the current full fanout suite count (`5 files / 72 tests`) as the regression floor [S]
- [ ] T003 Confirm reuse targets resolve: `runAuditedExecutorCommandAsync` (executor-audit.ts:663), `buildExecutorDispatchEnv` (:466), `pad3` (session-state-hierarchy.cjs:25) [S]

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

### C-02 — failed lineage is a failure (do FIRST)
- [ ] T101 Worker throws on `exitCode!==0 || timedOut` (`scripts/fanout-run.cjs:359-360`) [S] {finding: C-02}
- [ ] T102 `mergeReviewRegistries` fails closed on zero readable registries (`scripts/fanout-merge.cjs:197-202`) [S] {deps: T101} {finding: C-02}
- [ ] T103 MERGE-DROP: `tryReadJson` parse-error sentinel; merge does not silently skip (`scripts/fanout-merge.cjs:61-67`) [S] {deps: T102} {finding: MERGE-DROP}

### C-01 — genuine concurrency
- [ ] T110 Replace inner-worker `spawnSync` with async spawn via `runAuditedExecutorCommandAsync` (`scripts/fanout-run.cjs:341`) — folds in TIMEOUT-ORPHANS (detached + group kill) [M] {deps: T101} {finding: C-01/TIMEOUT-ORPHANS}

### U-01 — executor field parity (.kind)
- [ ] T113 [P] Standardize `.kind` across review/research YAML predicates + command docs; predicate reads the loaded/normalized config [M] {finding: U-01}

### Phase 2 hardening
- [ ] T120 [P] BOUNDS: `.max()` on count + concurrency + total-expansion cap (`lib/deep-loop/executor-config.ts:298,306`) [S] {finding: BOUNDS}
- [ ] T122 [P] XOR: root validator rejecting both-present config (`lib/deep-loop/executor-config.ts:304`) [S] {finding: XOR}
- [ ] T124 [P] ENV-LEAK: replace `{...process.env, ...extraEnv}` with `buildExecutorDispatchEnv()` + per-kind state vars (`scripts/fanout-run.cjs:345`) [M] {finding: ENV-LEAK}
- [ ] T126 [P] MERGE-DEDUP: key on `content_hash` (fallback `file:line+normalized_title`) in both merges (`scripts/fanout-merge.cjs:97,174`) [M] {finding: MERGE-DEDUP}
- [ ] T128 [P] C-04+N-01: zero-pad salvage filename (`scripts/fanout-salvage.cjs:106`; reuse `pad3`); stop reusing one `recoveredText` blob (`:103,:120`) [S] {finding: C-04/N-01}

### Verbatim + doc fixes
- [ ] T140 C-03: replace `buildLoopPrompt` synthesis with verbatim command invoke per CLI lineage (`scripts/fanout-run.cjs:122-146,315`); forward `lineage.iterations` as max-iterations [L] {deps: T110} {finding: C-03}
- [ ] T142 [P] N-04: attribution verdict from live `registry.findings` severities (`scripts/fanout-merge.cjs:242`) [S] {finding: N-04}
- [ ] T143 [P] N-02: comment the TSX self-respawn `spawnSync` as intentionally synchronous (`scripts/fanout-run.cjs:52-66`) [S] {finding: N-02}
- [ ] T144 [P] DOC-STALENESS: add `implementation-summary.md` to children 003/004/005/006; regen their `graph-metadata.json`; refresh parent `spec.md` continuity [M] {finding: DOC-STALENESS}

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [ ] T104 Test: all-lineages-fail -> `summary.failed>0` + non-PASS merged verdict; malformed-registry surfaced not dropped (`tests/unit/fanout-merge.vitest.ts`,`fanout-run.vitest.ts`) [M] {deps: T101-T103} {finding: C-02/MERGE-DROP}
- [ ] T111 Test: drive the REAL worker (short `node -e` subprocess) at `concurrency:2`, assert >=2 alive simultaneously (contrast `makeGatedWorker` at `tests/unit/fanout-pool.vitest.ts:35`) [M] {deps: T110} {finding: C-01}
- [ ] T112 Parity gate: single-executor output byte-identical to `main` baseline (T001) [M] {deps: T110} {finding: ADR-005}
- [ ] T121 Test: over-cap config rejected (`tests/unit/executor-config.vitest.ts`) [S] {deps: T120} {finding: BOUNDS}
- [ ] T123 Test: both-present config rejected (`tests/unit/executor-config.vitest.ts`) [S] {deps: T122} {finding: XOR}
- [ ] T125 Test: a non-allowlisted parent var absent in child env (`tests/unit/fanout-run.vitest.ts`) [S] {deps: T124} {finding: ENV-LEAK}
- [ ] T127 Test: same finding from 2 lineages dedupes to 1 (`tests/unit/fanout-merge.vitest.ts`) [S] {deps: T126} {finding: MERGE-DEDUP}
- [ ] T129 Test: salvage writes `iteration-001.md`; distinct iterations not byte-identical; fix the test that enshrines the unpadded name (`tests/unit/fanout-salvage.vitest.ts`) [S] {deps: T128} {finding: C-04/N-01}
- [ ] T141 Test: a CLI lineage invokes the real command with the iteration cap, not a synthesized prompt (`tests/unit/fanout-run.vitest.ts`) [M] {deps: T140} {finding: C-03}
- [ ] T147 Full fanout suite green from `system-spec-kit/mcp_server` (>=72 + new tests) [M] {deps: all impl tasks}
- [ ] T148 `validate.sh --strict` green on this 009 folder [S]

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## COMPLETION CRITERIA

- [ ] All tasks `[x]`; no `[B]` blocked
- [ ] REQ-001..REQ-018 all met with their tests
- [ ] Real-spawn concurrency test + all-fail merge test present and green
- [ ] Single-executor parity gate green (byte-identical)
- [ ] Full fanout suite green; `validate.sh --strict` green on 009

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## CROSS-REFERENCES

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decisions**: See `decision-record.md`
- **Source review**: `../008-deep-review/review/review-report.md`

<!-- /ANCHOR:cross-refs -->
