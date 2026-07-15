---
title: "Implementation Plan: Runtime-hosted cli-codex dispatch helper + thin skill-benchmark codex executor"
description: "Add a runtime-owned single-shot codex dispatch helper and a thin skill-benchmark codex executor that reuses the opencode path's prompt+parsers, keeping the codex spawn inside the deep-loop runtime."
trigger_phrases:
  - "codex transport plan"
  - "runtime codex dispatch plan"
  - "skill-benchmark codex executor plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/068-skill-benchmark-codex-executor"
    last_updated_at: "2026-07-15T15:15:00Z"
    last_updated_by: "claude"
    recent_action: "Authored implementation plan for the codex transport"
    next_safe_action: "Run the live benchmark batch and synthesize"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/executor-dispatch.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/068-skill-benchmark-codex-executor"
      parent_session_id: null
    completion_pct: 60
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Runtime-hosted cli-codex dispatch helper + thin skill-benchmark codex executor

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS (`.cjs`) |
| **Framework** | Lane C skill-benchmark harness (`loop-host` → `run-skill-benchmark`) |
| **Storage** | None (writes benchmark report JSON/MD to an outputs dir) |
| **Testing** | Vitest (`*/tests/**/*.vitest.ts`) + node `--check` + live smoke dispatch |

### Overview
Reuse the existing executor seam rather than fork it. The opencode live path already owns the routing-analysis prompt and the JSON/declaration parsers; the codex path reuses both and swaps only the dispatch channel. The actual `codex exec` spawn is a new single-shot helper in the deep-loop runtime (satisfying cli-codex's single-adapter rule); the benchmark packet's codex executor is a thin wrapper that builds the prompt, calls the helper, and normalizes the reply.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified (codex CLI + OAuth)

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (regression baseline delta 0; live smoke both transports)
- [ ] Docs updated (spec/plan/tasks/checklist/impl-summary)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Adapter + single seam. One execution authority (runtime) behind a transport-agnostic dispatch seam.

### Key Components
- **`runtime/scripts/codex-dispatch.cjs`**: synchronous single-shot `codex exec` (model/effort/tier/read-only sandbox, stdin prompt, `-o` capture, timeout, per-PID reap).
- **`skill-benchmark/codex-executor.cjs`**: builds the prompt (reused `buildLiveDispatchPrompt`), calls the helper, parses with the reused `extractRoutingJson`/`proseRoutingFallback`/`parseRoutedDeclaration`, returns the observed-result.
- **`executor-dispatch.cjs`**: routes `traceMode==='live' && executor==='codex'` to the codex executor.

### Data Flow
`loop-host --executor=codex` → `run-skill-benchmark` (reads `args.executor`) → `runPlaybook` → `dispatchScenario` → codex branch → `codex-executor.runCodexScenario` → `codex-dispatch.dispatchCodex` → `codex exec` → `-o` last-message → `parseCodexResult` → `scoreScenario` → report.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `runtime/scripts/fanout-run.cjs` | The multi-lineage codex loop adapter | unchanged (not a consumer) | `git grep "codex exec"` — spawn remains here + the new single-shot helper only |
| `executor-dispatch.cjs` | Orchestrator→executor seam | update (add codex branch) | live+router branch selection intact; regression delta 0 |
| `live-executor.cjs` | opencode live path + shared parsers | update (export `hasRouteGold`) | additive export; unit + baseline unchanged |
| `score-skill-benchmark.cjs` | Transport-agnostic scorer | unchanged (consumer of observed-result) | codex row scores via existing dims (d1intra/d2/d3) |
| `run-skill-benchmark.cjs` | Lane C orchestrator | unchanged (already threads `args.executor`) | `--executor` forwarded by loop-host |

Required inventories:
- Codex spawn sites: `git grep -n "codex exec" .opencode/skills` → runtime only.
- Observed-result consumers: `rg -n "observedResources|observedSurface|routeDeclaration|activation" score-skill-benchmark.cjs`.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read the cli-codex contract + fanout-run codex branch (flag/kill parity)
- [x] Confirm the scorer's activation handling (null = unmeasured)
- [x] Scaffold packet 068 (Level 2)

### Phase 2: Core Implementation
- [x] Build `runtime/scripts/codex-dispatch.cjs`
- [x] Build `skill-benchmark/codex-executor.cjs` (thin)
- [x] Export `hasRouteGold`; wire the `executor==='codex'` branch

### Phase 3: Verification
- [x] Syntax + import-chain + parse-shape checks
- [x] Mode-A regression baseline (delta 0)
- [x] Live smoke both transports (statedRoutingParsed true)
- [ ] Live Tier-1 benchmark batch + synthesis
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `parseCodexResult` shape; import chain; `hasRouteGold` export | node `-e`, node `--check` |
| Integration | Full wired path, one scenario, each transport | `loop-host --executor=codex` / opencode |
| Regression | Skill-benchmark vitest gate with/without edits | `npx vitest run skill-benchmark` |
| Manual | luna xhigh live dispatch, report inspection | codex / opencode |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `codex` CLI (>= 0.144) | External | Green (0.144.4) | No codex transport; opencode path unaffected |
| ChatGPT OAuth | External | Green (logged in) | Codex dispatch fails with auth error; surfaced in the row |
| `opencode` CLI | External | Green (1.17.11) | Opencode transport unaffected by this packet |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The codex transport regresses the deterministic gate or corrupts reports.
- **Procedure**: `git revert` the packet commit — the two new files are unreferenced unless `--executor codex` is passed, and the two edits are additive (one export, one branch), so reverting restores the exact prior behavior.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Core) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Med | contract reading + scaffold |
| Core Implementation | Med | 2 files + 2 edits |
| Verification | Med | regression baseline + live smokes + batch |
| **Total** | | Level 2 |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] The codex path is opt-in (`--executor codex`); default behavior unchanged
- [x] No scorer or opencode-path dispatch changes
- [x] Regression baseline captured (delta 0)

### Rollback Procedure
1. `git revert <packet-commit>` (removes the 2 new files + 2 additive edits).
2. Confirm `npx vitest run skill-benchmark` matches the pre-change baseline.
3. No data reversal — the packet writes only benchmark reports to disposable outputs dirs.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Verification additions
- Phase dependencies, effort estimation
- Enhanced rollback procedures
-->
