---
title: "Feature Specification: Runtime-hosted cli-codex dispatch helper + thin skill-benchmark codex executor"
description: "The Lane C skill-benchmark live path can only dispatch its model subject through cli-opencode; cli-codex is unwired, so a GPT-5.6 model cannot be benchmarked via the codex transport and cross-transport comparisons are impossible."
trigger_phrases:
  - "skill-benchmark codex transport"
  - "codex executor adapter"
  - "runtime codex dispatch helper"
  - "benchmark luna via codex"
  - "cli-codex single adapter benchmark"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/034-skill-benchmark-codex-executor"
    last_updated_at: "2026-07-15T15:15:00Z"
    last_updated_by: "claude"
    recent_action: "Spec complete; adapter built, Tier-1 benchmarked, comparison written"
    next_safe_action: "Commit packet 068"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/scripts/codex-dispatch.cjs"
      - ".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/codex-executor.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/034-skill-benchmark-codex-executor"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Runtime-hosted cli-codex dispatch helper + thin skill-benchmark codex executor

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-15 |
| **Branch** | `skilled/v4.0.0.0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The Lane C skill-benchmark live path (Mode B) dispatches its model "test subject" exclusively through cli-opencode; the `--executor` flag is threaded all the way to `runLiveScenario` but ignored there, so cli-codex is unwired. A GPT-5.6 model therefore cannot be benchmarked over the codex transport, and "run both transports and compare" is impossible. The naive fix — a packet-local `codex exec` spawn inside the benchmark scripts — would violate cli-codex's `deep-loop-runtime-required` hard rule (severity: error), which makes the deep-loop runtime the single codex execution adapter.

### Purpose
Add a runtime-hosted single-shot codex dispatch helper plus a thin skill-benchmark codex executor so a GPT-5.6 model can be benchmarked live over the codex transport, scored comparably to the opencode transport, with the actual `codex exec` spawn confined to the runtime (one codex adapter, invariant intact).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A runtime-owned single-shot codex dispatch helper that spawns `codex exec` (model/effort/tier/sandbox, stdin prompt, `-o` last-message capture, timeout, per-PID orphan reap).
- A thin skill-benchmark codex executor that builds the routing-analysis prompt, calls the runtime helper, and normalizes the reply into the scorer's observed-result shape.
- Wiring the codex transport into the existing dispatch seam via `--executor codex`.
- Exporting the shared route-gold predicate so both transports parse identically.

### Out of Scope
- Fixing the `system-deep-loop` hub playbook's hyphen/underscore feature-file breakage (pre-existing, concurrent-owned) — it yields 0 live scenarios and is excluded from live runs, recorded as a finding.
- Any change to the scorer (`score-skill-benchmark.cjs`) — the observed-result contract is transport-agnostic and stays unchanged.
- The opencode live path (`live-executor.cjs`) dispatch logic — reused as-is, only its exports extended.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-deep-loop/runtime/scripts/codex-dispatch.cjs` | Create | Single-shot codex dispatch helper (the runtime's one-shot codex adapter). |
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/codex-executor.cjs` | Create | Thin executor: prompt → runtime helper → parse → observed-result. |
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/executor-dispatch.cjs` | Modify | Branch the live path on `executor === 'codex'`. |
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/live-executor.cjs` | Modify | Export `hasRouteGold` so both transports single-source the route-gold predicate. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | codex stays single-adapter: the only new `codex exec` spawn lives in the runtime, not the benchmark packet. | `git grep "codex exec"` shows codex spawned only under `runtime/scripts/`; the executor calls the runtime helper. |
| REQ-002 | The codex executor returns the same observed-result shape the scorer consumes. | `parseCodexResult` emits `mode/observedResources/observedSurface/observedIntents/observedWorkflowMode/routeDeclaration`; scorer runs unchanged. |
| REQ-003 | The deterministic router (Mode A) path is undisturbed. | Regression baseline: the skill-benchmark vitest gate is identical with and without the edits (delta 0). |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | An xhigh timeout degrades gracefully. | On timeout the dispatch retries once at a lower fallback effort and flags `usedFallback` in `raw`. |
| REQ-005 | Codex-unobservable activation is recorded unmeasured, not a miss. | `activation: null` (the router-mode convention); scorer records `activated: undefined`. |
| REQ-006 | Single-dispatch / per-PID kill discipline holds. | Orphan reap is scoped to the captured PID (`pkill -9 -P <pid>`), never a blanket `pkill -f codex`. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A live codex dispatch through the full wired path (loop-host → executor-dispatch → codex-executor → runtime helper → `codex exec` → parse → score) produces a parsed, scored observation (`statedRoutingParsed: true`).
- **SC-002**: Both transports run the same scenario and yield comparable stated-routing scores; the event-stream fidelity gap (opencode emits `tool_use`, codex does not) is documented rather than read as a luna behavioral difference.

### Acceptance Scenarios (Given/When/Then)

- **Given** a routing scenario carrying route-gold, **When** dispatched via codex, **Then** a `ROUTED:` declaration is parsed and its workflowMode/intents score.
- **Given** a scenario with no route-gold, **When** dispatched via codex, **Then** `routeDeclaration` is absent and the stated resources still score.
- **Given** a codex dispatch that times out at xhigh, **When** a fallback effort is configured, **Then** it retries once at `high` and flags `usedFallback`.
- **Given** the codex binary is unavailable, **When** `dispatchCodex` runs, **Then** it returns an error result without constructing or launching a command.
- **Given** a codex reply with a fenced json block, **When** parsed, **Then** `observedResources`/`observedSurface`/`observedIntents` populate from the stated declaration.
- **Given** the Mode A router path after wiring, **When** the gate re-runs, **Then** its verdict and pass/fail counts are unchanged (delta 0).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `codex` CLI + ChatGPT OAuth | No codex dispatch possible | Availability probe (`command -v codex`) + auth pre-flight; error result, no command constructed |
| Risk | Codex tool-use corroboration weaker than opencode | Med — activation/observed-reads not comparable | Score on stated declaration; record `activation: null`; flag the gap in the report |
| Risk | xhigh timeouts | Med — null results | One fallback to `high`, logged as `usedFallback` |
| Risk | Shared branch + concurrent session | Low — accidental cross-commit | Path-isolated commits; run outputs to session scratch, not the skill tree |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Per-dispatch timeout defaults to 480s (xhigh is slow), overridable by env; a breach SIGKILLs and reaps the child tree.
- **NFR-P02**: Dispatches run strictly sequentially (single-dispatch discipline); no concurrency is introduced.

### Security
- **NFR-S01**: The benchmark subject runs `--sandbox read-only` — it can analyze routing but never edit the tree.
- **NFR-S02**: `approval_policy=never` with read-only sandbox; no `danger-full-access`.

### Reliability
- **NFR-R01**: A dispatch failure (non-zero exit, unavailable binary, empty reply) degrades to a scored error row, never a crash.
- **NFR-R02**: A timeout at the configured effort retries once at a lower effort before yielding an error row.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: an empty prompt still dispatches; an empty reply yields `parseable: false`.
- Maximum length: the graded response text is capped at 8000 chars (matches the opencode path).
- Invalid format: a malformed/absent json reply falls back to prose surface/path recovery.

### Error Scenarios
- External service failure: non-zero codex exit → scored error row with `error` + truncated stderr.
- Network timeout: SIGKILL at the timeout, per-PID orphan reap, one fallback retry.
- Concurrent access: single-dispatch discipline serializes dispatches; no shared mutable state.

### State Transitions
- Partial completion: a per-scenario failure is recorded on its row; the batch continues.
- Session expiry: an OAuth error surfaces via stderr in the error row (diagnosable, not scored as 0 silently).
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | 2 new files + 2 edits, ~300 LOC across the runtime and benchmark packet |
| Risk | 8/25 | New spawn path, but read-only sandbox and reused, tested fan-out flags |
| Research | 6/20 | Required reading the cli-codex contract + fanout-run's codex branch |
| **Total** | **26/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- How far should the live benchmark breadth (Tier-2 skills) scale, given each xhigh dispatch is minutes-long? (operator decision; Tier-1 deep-improvement runs by default)
- Should the `system-deep-loop` hub playbook hyphen/underscore breakage be fixed under a separate packet? (excluded here; concurrent-owned migration)
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
