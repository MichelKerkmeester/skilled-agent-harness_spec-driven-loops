---
title: "Feature Specification: Completion Evidence Sentinel"
description: "Runtime backstop that checks recorded completion evidence when an assistant turn ends with a completion claim, and appends a bounded advisory when the claim outruns the evidence, without running any test or build."
trigger_phrases:
  - "completion evidence sentinel"
  - "completion claim backstop"
  - "stop hook completion check"
  - "session idle completion advisory"
  - "completion verification rule runtime backstop"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/132-plugin-hook-implementation/004-completion-evidence-sentinel"
    last_updated_at: "2026-07-11T14:17:40Z"
    last_updated_by: "spec-author"
    recent_action: "Upgraded phase docs from Level 1 scaffold to Level 3 planning"
    next_safe_action: "Build the shared completion-evidence-sentinel.cjs core and its unit test"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/hooks/completion-evidence-sentinel.cjs"
      - ".opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts"
      - ".opencode/plugins/mk-completion-sentinel.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/004-completion-evidence-sentinel"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: Completion Evidence Sentinel

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

## EXECUTIVE SUMMARY

CLAUDE.md's COMPLETION VERIFICATION RULE is a HARD BLOCK on paper but prompt-discipline-only in practice: nothing at runtime checks that a "done" claim actually carries recorded evidence. This phase adds a Completion Evidence Sentinel that, when an assistant turn ends with a completion claim, verifies WITHOUT running any test or build that the active packet carries recorded completion evidence, and appends a bounded advisory when the claim outruns the evidence.

**Key Decisions**: One runtime-neutral policy core shared by both runtimes, and an advisory / fail-open posture with no blocking for the entire v1 rollout.

**Critical Dependencies**: The existing Claude `Stop` owner `session-stop.ts` (already resolves `lastSpecFolder` and `last_assistant_message`), the `check-completion.sh --json` status enum, and the `COMPLETION_CLAIM_PATTERN` at `quality-loop.ts:13`.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-07-11 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 4 of 7 |
| **Predecessor** | 003-post-edit-quality-router |
| **Successor** | 005-mcp-route-guard |
| **Handoff Criteria** | Shared core and its unit test land; Claude Stop adapter ships with a rebuilt dist; OpenCode adapter follows. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
CLAUDE.md's COMPLETION VERIFICATION RULE requires running `validate.sh --strict` and verifying `checklist.md` before any "done/complete/works" claim, but that rule is enforced only by prompt discipline. When a turn ends with a completion claim and the packet has no recorded evidence, nothing at runtime notices. The gap between a green claim and the recorded reality is exactly where the expensive failures hide.

### Purpose
Give the COMPLETION VERIFICATION RULE its first runtime backstop: a sentinel that reads recorded artifacts (never executes them) and surfaces a bounded advisory whenever a completion claim outruns the evidence on disk.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A runtime-neutral policy core `completion-evidence-sentinel.cjs` that gates on a completion claim plus a resolved spec folder, then evaluates recorded evidence and returns a transport-free decision.
- A Claude adapter that extends the existing `Stop` owner `session-stop.ts` after its single atomic state write.
- An OpenCode adapter as a new thin `session.idle` plugin that resolves the last assistant text and active packet via `ctx.client` before delegating to the core.
- A core unit test proving the policy and the no-test guarantee before either adapter is wired.
- Dedup by packet plus message fingerprint and a bounded shared-log append path.

### Out of Scope
- Any blocking or reject posture. v1 is advisory / fail-open only, so no `{decision:"block"}` and no enforce env are introduced.
- Running `validate.sh`, tests, builds, or any executable during evaluation. Evidence is read from recorded artifacts only.
- Tightening the completion-claim detector beyond reusing `COMPLETION_CLAIM_PATTERN`. A stricter detector is a prerequisite for a future enforce posture, not part of this phase.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/hooks/completion-evidence-sentinel.cjs` | Create | Runtime-neutral policy core: claim gate, evidence evaluation, dedup, bounded log |
| `.opencode/plugins/mk-completion-sentinel.js` | Create | OpenCode `session.idle` thin adapter, default-export only |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts` | Modify | Claude Stop adapter: call the core after the single atomic state write |
| `.opencode/skills/system-spec-kit/mcp_server/dist/hooks/claude/session-stop.js` | Rebuild | Compiled output refreshed by `npm run build` after the TS edit |
| `.opencode/skills/system-spec-kit/mcp_server/tests/completion-evidence-sentinel.vitest.ts` | Create | Core unit test: fixture A advises, fixture B is ok, no-claim is a no-op |
| `.opencode/plugins/README.md` | Modify | Register the new `mk-completion-sentinel` plugin in the plugin list |
| `.claude/settings.json` | Unchanged | Existing `Stop` wiring at lines 87-99 is reused, no second hook is added |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The core gates before doing any work: it evaluates only when `detectCompletionClaim(claimText)` is true AND a spec folder is resolved, otherwise it returns `decision: 'ok'` as a no-op. | Unit test: a last message with no completion claim returns `ok` and never spawns `check-completion.sh`. |
| REQ-002 | For a folder that has `checklist.md`, the core spawns `check-completion.sh <folder> --json`, parses the JSON status, and advises on `EVIDENCE_MISSING`, `PRIORITY_CONTEXT_MISSING`, `P0_INCOMPLETE`, or `P1_INCOMPLETE`, returning `ok` on `COMPLETE`. | Unit test on fixture A (completed P0 item lacks an evidence marker) returns `advise` with an `EVIDENCE_MISSING` detail; fixture B returns `ok`. |
| REQ-003 | For a Level 1 folder with no `checklist.md`, the core stats `implementation-summary.md`: absent advises, present returns `ok`. | Unit test: a folder with a claim, no checklist, and no `implementation-summary.md` advises with a "no implementation-summary.md recorded" detail. |
| REQ-004 | The sentinel never executes tests, builds, or `validate.sh`, never blocks, and fails open: any internal error resolves to a silent `ok`. | Grep confirms no `validate.sh`, `vitest`, `npm test`, or build invocation in the core; a forced internal error returns `ok`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The Claude adapter extends the existing `Stop` owner after the single atomic state write, consuming `autosaveState.lastSpecFolder` and `input.last_assistant_message`, and surfaces an advisory via `hookLog`, the bounded log, and the `processStopHook` return object without emitting `{decision:"block"}`. | The dist is rebuilt after the TS edit; the return object exposes the advisory; no block decision is emitted. |
| REQ-006 | The OpenCode adapter is a new default-export plugin on `session.idle` that resolves the last assistant text and active packet via `ctx.client` (since the event carries neither), delegates to the core, and no-ops when it cannot resolve them. | Plugin loads with a single default export; when the last message or packet cannot be resolved it no-ops without error. |
| REQ-007 | Advisories are deduplicated by packet plus message fingerprint in a shared state dir, and both adapters append only to a bounded shared log, never to stdout or stderr. | Repeated identical claims append at most one advisory; grep confirms no stdout/stderr writes in either adapter path. |
| REQ-008 | The claim detector reuses `COMPLETION_CLAIM_PATTERN` from `quality-loop.ts:13`; no second completion-claim regex is minted. | Grep confirms a single shared definition of the completion-claim pattern is referenced, not duplicated. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A completion claim against a packet with missing evidence produces exactly one bounded advisory, and the same claim repeated produces none.
- **SC-002**: No path in the sentinel executes a test, build, or `validate.sh`; the guarantee is proven by the core unit test before any adapter is wired.
- **SC-003**: The Claude Stop hook never forces continuation; it logs and surfaces the advisory and returns normally, staying inside the 10s async Stop budget.
- **SC-004**: A parsing, IO, or resolution failure anywhere in the sentinel resolves to a silent `ok`, so unrelated stop or idle processing is never affected.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `check-completion.sh --json` status enum | Advisory detail depends on stable status strings | Parse the JSON `status`/`error` field, never the exit code, since exit 1 covers both incomplete and missing checklist |
| Dependency | Existing Claude `Stop` owner state | Adapter reuses already-resolved `lastSpecFolder` and `last_assistant_message` | Insert after the single atomic state write; do not add a second Stop hook |
| Risk | Editing `session-stop.ts` without rebuilding `mcp_server/dist` | Dist-freshness guard and `validate.sh` staleness backstop trip | Run `npm run build` as part of the same task; never edit the compiled `.js` directly |
| Risk | `session.idle` carries neither the last message nor the transcript | OpenCode adapter cannot see the claim without extra work | Resolve both via `ctx.client`; best-effort and no-op for advisory v1 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The `check-completion.sh` spawn stays bounded under 1.5s so the Claude adapter fits inside the 10s async Stop budget.

### Security
- **NFR-S01**: The sentinel reads recorded artifacts only and executes nothing, so it introduces no new execution surface.

### Reliability
- **NFR-R01**: The sentinel fails open on every error path; a sentinel bug must never block a stop, an idle sweep, or unrelated work.

---

## 8. EDGE CASES

### Data Boundaries
- Empty input: no last assistant message, or no resolved spec folder, returns `ok` as a no-op.
- Maximum length: the shared advisory log is bounded and rotated by a throttled sweep, mirroring the deep-loop guard log.

### Error Scenarios
- External service failure: `check-completion.sh` missing or non-zero returns a parsed status when JSON is present, else the core fails open to `ok`.
- Network timeout: not applicable; the sentinel performs local file reads and one bounded local spawn only.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 12/25 | Files: 5 new or changed, LOC: ~225, Systems: 2 runtimes plus 1 shared core |
| Risk | 10/25 | Auth: No, API: No, Breaking: No, advisory and fail-open only |
| Research | 12/20 | The `session.idle` last-message resolution needed source verification |
| Multi-Agent | 3/15 | Workstreams: 1 |
| Coordination | 8/15 | Dependencies: Claude Stop owner, check-completion.sh, quality-loop pattern |
| **Total** | **45/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Stale `mcp_server/dist` after the TS edit trips the freshness guard | Med | Med | Rebuild dist in the same task; verify with the dist-freshness guard |
| R-002 | `COMPLETION_CLAIM_PATTERN` false-positives on mid-turn narration | Low | Med | Advisory plus dedup keeps the cost low; anchor detection to sentence-final text |
| R-003 | OpenCode `session.idle` cannot resolve the last message or packet | Med | Med | Best-effort resolution via `ctx.client`; no-op when unresolved |
| R-004 | `check-completion.sh` spawn overruns the async Stop budget | Low | Low | Keep the spawnSync timeout under 1.5s inside the 10s Stop budget |

---

## 11. USER STORIES

### US-001: Advisory when a claim outruns checklist evidence (Priority: P0)

**As a** developer closing a Level 2+ packet, **I want** a bounded advisory when I claim done but a completed P0 item lacks an evidence marker, **so that** the COMPLETION VERIFICATION RULE has a runtime backstop.

**Acceptance Criteria**:
1. Given a packet with `checklist.md` whose completed P0 item lacks an evidence marker, When the turn ends with a completion claim, Then the core returns `advise` with an `EVIDENCE_MISSING` detail.
2. Given the same packet with full evidence markers, When the turn ends with a completion claim, Then the core returns `ok`.

---

### US-002: No-op when there is no completion claim (Priority: P0)

**As a** developer mid-task, **I want** the sentinel to stay silent when my turn is not a completion claim, **so that** normal work is never interrupted and nothing is spawned.

**Acceptance Criteria**:
1. Given a last message that contains no completion claim, When the sentinel runs, Then it returns `ok` and never spawns `check-completion.sh`.
2. Given a completion claim but no resolved spec folder, When the sentinel runs, Then it returns `ok` as a no-op.

---

### US-003: Level 1 fallback on implementation-summary (Priority: P1)

**As a** developer closing a Level 1 packet with no checklist, **I want** an advisory when no `implementation-summary.md` is recorded, **so that** a bare "done" still gets a recorded-evidence check.

**Acceptance Criteria**:
1. Given a Level 1 packet with a completion claim and no `implementation-summary.md`, When the sentinel runs, Then it advises that no `implementation-summary.md` is recorded.

---

### US-004: Claude Stop stays advisory (Priority: P1)

**As an** operator, **I want** the Stop hook to log and surface the advisory without forcing continuation, **so that** the advisory rollout never changes control flow.

**Acceptance Criteria**:
1. Given a decision of `advise` in the Claude adapter, When the Stop hook returns, Then it emits `hookLog` plus a bounded-log append and exposes the advisory in the return object, and never emits `{decision:"block"}`.

---

## 12. OPEN QUESTIONS

- Should the OpenCode `session.idle` adapter attempt packet resolution from the full transcript when `ctx.client` yields only a truncated last message, or stay strictly best-effort for v1?
- What is the right default retention and byte cap for the shared advisory log, and should it reuse the deep-loop guard log tuning or define its own env vars?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
