---
title: "Feature Specification: Plugin State-Dir Auto-Cleanup (completion-sentinel + smart-router-telemetry)"
description: "Two of the seven plugin state dirs have no retention path: .completion-sentinel-state/advisory-dedup.json grows forever and .smart-router-telemetry/compliance.jsonl is append-only with no cap. This phase makes both self-bounding using the sweep+prune+rotate idiom the other five guards already ship."
trigger_phrases:
  - "completion sentinel state cleanup"
  - "smart router telemetry rotation"
  - "advisory dedup prune"
  - "plugin state dir sweep"
  - "state hygiene remediation"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/132-plugin-hook-implementation/008-plugin-state-cleanup"
    last_updated_at: "2026-07-11T11:22:33.213Z"
    last_updated_by: "spec-author"
    recent_action: "Authored Level 2 planning docs scoping both state-cleanup gaps"
    next_safe_action: "Implement sweepStaleSentinelState + telemetry rotation per plan.md"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/hooks/completion-evidence-sentinel.cjs"
      - ".opencode/plugins/mk-completion-sentinel.js"
      - ".opencode/skills/system-spec-kit/mcp_server/hooks/claude/completion-evidence-stop.cjs"
      - ".opencode/skills/system-spec-kit/scripts/observability/smart-router-telemetry.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/008-plugin-state-cleanup"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Confirm the telemetry cap default (1 MiB) and dedup retention default (30 days) match operator expectations for signal retention versus disk footprint."
      - "Confirm whether the singular .opencode/skill/ path was ever a real write target in any environment before reconciling telemetryFilePath to the plural .opencode/skills/ live dir."
    answered_questions: []
---
# Feature Specification: Plugin State-Dir Auto-Cleanup (completion-sentinel + smart-router-telemetry)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
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
| **Priority** | P2 |
| **Status** | Draft |
| **Created** | 2026-07-11 |
| **Branch** | `008-plugin-state-cleanup` |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 of 8 |
| **Predecessor** | 007-speckit-completion-exposer |
| **Successor** | None |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
An audit of the seven plugin state dirs found five already bounded (freshness, spec-gate, loop-guard, and goal each ship sweep + archive/prune + log rotation; the skill-advisor `.advisor-state` is daemon-managed with SQLite stale-lease reclaim), but two have real retention gaps. `.opencode/skills/.completion-sentinel-state/advisory-dedup.json` (the shared `dedupKeyForSpecFolder -> {fingerprint, advisedAt}` store) is only ever grown: every distinct packet ever advised persists forever, there is no sweep function, no stray-`.tmp` cleanup, and no session-lifecycle invocation. Separately, `.opencode/skills/.smart-router-telemetry/compliance.jsonl` is append-only with no size cap and no rotation, so it grows without bound (already 72 KiB).

### Purpose
Both unbounded state dirs become self-bounding: the sentinel gains a throttled sweep that prunes stale dedup entries and stray temp files, and the telemetry writer gains a pre-append size cap with single-backup rotation, so each matches the fail-open sweep+rotate pattern the other five guards already use.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- GAP 1 core: add `sweepStaleSentinelState(stateDir, runtimeState)` to the sentinel core that prunes `advisory-dedup.json` entries past a retention window (atomic rewrite), removes stray `*.tmp` files, and age-prunes the rotated advisory-log backup, throttled via `runtimeState`; export it.
- GAP 1 adapters: invoke that sweep (throttled, best-effort, try/catch) from the OpenCode plugin `event` on `session.created` and from the Claude Stop adapter.
- GAP 2: add a pre-append size cap plus single-backup rotation to `appendJsonl` in the smart-router-telemetry script, and reconcile the singular/plural telemetry path so writes and rotation act on one real path.
- Tests for both gaps (sweep, adapter invocation, telemetry rotation, path reconcile).

### Out of Scope
- The five already-bounded state dirs (freshness, spec-gate, loop-guard, goal, daemon-managed advisor) - already bounded, unchanged.
- The active advisory-log cap/rotation in `appendAdvisoryLog` - already size-caps and single-backup-rotates; only the age-prune of its `.1` backup is added inside the sweep.
- Sentinel decision policy, claim detection, dedup key/fingerprint semantics - unchanged; this is retention-only.
- Any `mcp_server/` dist rebuild - the sentinel core is a plain `.cjs`, and the telemetry script is an observability `.ts` outside `mcp_server/`, so neither needs a build.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/hooks/completion-evidence-sentinel.cjs` | Modify | Add `sweepStaleSentinelState` + retention/interval env constants; export the sweep |
| `.opencode/plugins/mk-completion-sentinel.js` | Modify | Add a `runtimeState` closure and a throttled `session.created` sweep call in the `event` handler |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/completion-evidence-stop.cjs` | Modify | Add a best-effort sweep call around Stop processing |
| `.opencode/skills/system-spec-kit/scripts/observability/smart-router-telemetry.ts` | Modify | Pre-append size cap + single-backup rotation in `appendJsonl`; reconcile singular `.opencode/skill` -> plural `.opencode/skills` in `locateRepoRoot` and `telemetryFilePath` |
| `.opencode/skills/system-spec-kit/mcp_server/tests/completion-evidence-sentinel.vitest.ts` | Modify | Add sweep unit tests |
| `.opencode/skills/system-spec-kit/mcp_server/tests/hook-completion-evidence-stop.vitest.ts` | Modify | Add Stop-adapter best-effort-invocation test |
| `.opencode/skills/system-spec-kit/mcp_server/tests/smart-router-telemetry.vitest.ts` | Modify | Add rotation + path-reconcile tests |
| `.opencode/plugins/tests/mk-completion-sentinel.test.cjs` | Create | New plugin test: `session.created` triggers the throttled sweep, fail-open |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `sweepStaleSentinelState` prunes stale dedup entries and preserves fresh ones, rewriting the store atomically | A store with one stale entry (old `advisedAt`) and one fresh entry -> after sweep only the fresh entry remains; the store file stays valid JSON |
| REQ-002 | The telemetry writer rotates `compliance.jsonl` to a single `.1` backup when it exceeds the cap, then continues appending | Appending past the cap moves the file to `compliance.jsonl.1` and the new record lands in a fresh `compliance.jsonl`; a `.1` from a prior generation is replaced, not stacked |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The sweep removes stray `*.tmp` files past the retention window and age-prunes the rotated advisory-log backup | A `.tmp` older than retention is removed; a `<log>.1` older than retention is removed; fresh temp/backup files are left alone |
| REQ-004 | The sweep is invoked throttled and best-effort from both adapters and never affects the observed lifecycle | OpenCode plugin `session.created` and the Claude Stop adapter each call the sweep inside try/catch; a thrown sweep error leaves stop/idle processing untouched (fail-open) |
| REQ-005 | The telemetry write path is reconciled so writes and rotation act on one real path | `locateRepoRoot` and `telemetryFilePath` resolve to the live plural dir `.opencode/skills/.smart-router-telemetry/compliance.jsonl`; `rg -n "'skill'" smart-router-telemetry.ts` returns no singular-marker hit; env overrides still win |
| REQ-006 | Retention, sweep interval, and telemetry cap are env-tunable with safe defaults | `MK_COMPLETION_SENTINEL_RETENTION_DAYS` (default 30), `MK_COMPLETION_SENTINEL_SWEEP_INTERVAL_MS` (default ~1h), and `SPECKIT_SMART_ROUTER_TELEMETRY_MAX_BYTES` (default 1 MiB) each override the default; invalid/negative values fall back to the default |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `advisory-dedup.json` stops growing without bound - stale entries are pruned and a corrupt/unreadable store is a no-op, both proven by unit tests.
- **SC-002**: `compliance.jsonl` is bounded - it rotates to a single `.1` backup at the cap with recent data preserved (rotate-not-delete), proven by a rotation test.
- **SC-003**: Every new step fails open - a corrupt store, unreadable dir, rotation error, or sweep exception never affects the observed turn/session, and the kill-switch fully no-ops the sweep.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A sweep or rotation error affects the observed turn/session | High | Every step is wrapped fail-open (per-entry/per-step try/catch), mirroring `sweepStaleGateStates`' per-entry fail-open |
| Risk | Recent dedup or telemetry signal is silently dropped | Med | Rotate-not-delete: copy/rename to `.1` and prune only past the retention window; the incoming record is always appended |
| Risk | Rotation acts on the wrong telemetry path (singular vs plural) | Med | Reconcile to the real live path `.opencode/skills/.smart-router-telemetry/` before adding rotation |
| Dependency | spec-gate `sweepStaleGateStates`/`maintainWarningLogPath` idiom and loop-guard dispatch-guard | Green | Proven exemplars; this phase mirrors their shape, adds no new mechanism |
| Dependency | `completion-state.cjs` / `check-completion.sh` (already imported by the sentinel core) | Green | Unchanged by this phase |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The sweep is throttled to once per interval (default ~1h) via `runtimeState`, so a single pass is a bounded `readdir` plus a few `statSync`/`unlink` calls; the hot path adds at most one throttle check.
- **NFR-P02**: Telemetry rotation adds one `statSync` (and, only when over cap, one copy/rename) before each append - no per-record scan of the file contents.

### Security
- **NFR-S01**: No `mcp_server/` dist is rebuilt - the sentinel core is a plain `.cjs` and the telemetry script is an observability `.ts` outside `mcp_server/`.
- **NFR-S02**: Comment hygiene - code comments carry only the durable WHY, with no artifact ids, spec paths, or packet numbers.
- **NFR-S03**: Env-derived retention/interval/cap values are validated (positive-int-from-env style); invalid or negative input falls back to the safe default.

### Reliability
- **NFR-R01**: Fail-open everywhere - a cleanup or rotation error must never affect the observed turn/session; per-entry failures still let the rest of the sweep run.
- **NFR-R02**: Kill-switch - `MK_COMPLETION_SENTINEL_DISABLED=1` fully no-ops the sentinel and its sweep; telemetry stays observe-only regardless.
- **NFR-R03**: No stdout/stderr from the OpenCode plugin or the sentinel core; advisories stay in the bounded log, and the plugin stays default-export-only.
- **NFR-R04**: Rotate-not-delete - recent signal is preserved to `.1` and never silently dropped; when rotation fails the record is still appended.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: an absent or empty dedup store makes the sweep a no-op; an absent `compliance.jsonl` is the normal first-write case with no rotation.
- Maximum length: a store far past retention still prunes only entries older than the window; telemetry rotates exactly once per over-cap append (single `.1`).
- Invalid format: a corrupt/unreadable `advisory-dedup.json` leaves the store untouched and returns without error.

### Error Scenarios
- External service failure: not applicable - all work is local filesystem state.
- Network timeout: not applicable.
- Concurrent access: both Claude Stop hooks plus the OpenCode plugin may fire near-simultaneously; the sweep is throttled via `runtimeState`/mtime and is idempotent, and per-entry work fails open.

### State Transitions
- Partial completion: if a single entry's `statSync` fails, the remaining entries are still processed.
- Session expiry: not applicable - the sweep is stateless beyond its throttle timestamp.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | Two gaps, ~4 code files + 3 test files, modest LOC; both mirror an existing idiom |
| Risk | 8/25 | Touches session lifecycle and persistence, but advisory/observe-only, no auth/API/breaking change; fail-open contains blast radius |
| Research | 4/20 | Exemplars already exist (`sweepStaleGateStates`, `maintainWarningLogPath`); low investigation |
| **Total** | **22/70** | **Level 2** (LOC/risk soft; Level 2 chosen for QA of the fail-open + rotation edge cases) |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Confirm the telemetry cap default (1 MiB) and dedup retention default (30 days) match operator expectations for signal retention versus disk footprint.
- Confirm whether the singular `.opencode/skill/` path in `telemetryFilePath` was ever the real write target in any environment before reconciling to the plural `.opencode/skills/` live dir (grep shows only the plural dir holds data).
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
