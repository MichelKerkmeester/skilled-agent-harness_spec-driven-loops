---
title: "Feature Specification: Phase 1: hook-adapter-thin-transports"
description: "Four of the five runtime hook adapters still duplicate the spec-gate classify and enforce orchestration that pi already delegates to the shared core, and this phase ports them onto that core."
trigger_phrases:
  - "hook adapter thin transports"
  - "spec gate core port"
  - "adapter duplication removal"
  - "gate three shared core"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1: hook-adapter-thin-transports

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-07 |
| **Branch** | `scaffold/001-hook-adapter-thin-transports` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 16 |
| **Predecessor** | None |
| **Successor** | 002-multiplexed-rule-split |
| **Handoff Criteria** | All eight named regression suites pass and each of claude/codex/cursor/devin's classify+enforce+shared.ts trio measures under 200 lines |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the Recorded findings closure specification.

**Scope Boundary**: The spec-gate classify and enforce hooks under `.opencode/skills/system-spec-kit/runtime/hooks/{claude,codex,cursor,devin,pi}/`, plus the shared modules under `hooks/lib/`. The lifecycle hooks (session-prime, session-stop, compact-inject) that spawn `claude/*.js` as a subprocess are out of boundary. That delegation is a separate, deliberate design documented at `hooks/README.md:79`.

**Dependencies**:
- `hooks/lib/spec-gate/spec-gate-core.mjs`, the runtime-neutral Gate-3 policy core every adapter already imports, must exist and stay the single source of policy decisions.
- The eight regression suites this phase must keep green: `spec-gate-claude.test.mjs`, `spec-gate-codex.test.mjs`, `spec-gate-devin.test.mjs`, `spec-gate-prebind.test.mjs`, `spec-gate-core.test.mjs`, `directive-lifecycle-adapter-parity.vitest.ts`, `completion-evidence-sentinel.vitest.ts`, `hook-completion-evidence-stop.vitest.ts`.

**Deliverables**:
- A shared classify/enforce orchestration function in `spec-gate-core.mjs` that claude, codex, cursor, devin and pi all call the same way.
- Each of claude/codex/cursor/devin's `spec-gate-classify.mjs` and `spec-gate-enforce.mjs` reduced to payload parsing plus envelope emission, with the duplicated glue removed from `shared.ts`.
- `hooks/README.md` updated to name the new single call site.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The five runtime hook adapters under `.opencode/skills/system-spec-kit/runtime/hooks/` each re-implement the same Gate-3 classify and enforce orchestration instead of sharing it. Round two of lane 005's overengineering research measured the duplication directly: the four gate-adapter classify files are 76-82 percent shared text, the four enforce files are 68-76 percent shared text and each runtime's `shared.ts` is only 12-28 percent genuine per-runtime transport code (`specs/system-speckit/033-system-speckit-v4/030-spec-kit-simplification-research/005-overengineering-simplification/research/lineages/deepseek-v4-flash-overengineering/research.md:66`). Round one put an exact line count on the resulting spread: claude 4,249 lines, codex 1,069, cursor 1,523, devin 1,608, against pi's 667 for the identical Gate-3 plus session-lifecycle job (`research.md:39`, re-verified in the main checkout: `.opencode/skills/system-spec-kit/runtime/hooks/{claude,codex,cursor,devin,pi}` file counts match exactly). Both rounds recorded the port as a deliberate non-change, gated on "the perimeter-trim momentum proving the appetite" (`research.md:108`, `confirmed-findings.md` F11 and the "Phase 2 adapter port" plan-move row).

### Purpose
Give claude, codex, cursor and devin's classify and enforce hooks the same thin shape pi's already has (payload parse, one call into `spec-gate-core.mjs`, envelope emit), so a Gate-3 policy change is made once instead of four (or five) times.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Extracting the duplicated classify/enforce orchestration (prompt sanitize, `classifyIntent`/`evaluateMutation`, observe/deny handling) currently copy-pasted inside each runtime's `spec-gate-classify.mjs`(.ts) and `spec-gate-enforce.mjs`(.ts) into new shared functions in `hooks/lib/spec-gate/spec-gate-core.mjs`.
- Widening `hooks/lib/hook-adapter-shared.mjs` (20 lines today: `parseJsonFailOpen`, `readStdin`) so the JSON-stdin-read boilerplate the four fat adapters' `shared.ts` files each restate has one home.
- Re-pointing claude/codex/cursor/devin's `spec-gate-classify.mjs`/`spec-gate-enforce.mjs` at the new shared entry points and removing the duplicated logic each currently carries.
- Moving pi's `spec-gate-classify.ts`/`spec-gate-enforce.ts` onto the same new shared entry points the other four now call, rather than leaving pi as an independently-thin fifth shape.
- Updating `hooks/README.md`'s architecture section to name the new single call site.

### Out of Scope
- The lifecycle hooks (session-prime, session-stop, compact-inject, directive-lifecycle-boundary, user-prompt-submit) that spawn `claude/*.js` as a subprocess via `runClaudeHookAdapter` in each runtime's `shared.ts` (e.g. `hooks/codex/shared.ts:95-119`, `hooks/devin/shared.ts:104-119`, `hooks/cursor/shared.ts:139-...`) - `hooks/README.md:79` and pi's own `hooks/pi/lib/claude-hook-adapter.ts:5-15` both document this out-of-process delegation as deliberate: it keeps transcript and session-state semantics from drifting across five runtimes. F11's evidence targets the spec-gate mechanism, not this one.
- Cursor's `spec-gate-prebind.mjs` and devin's `permission-request-policy.mjs` - runtime-specific mechanisms with no counterpart in the other four adapters.
- The `opencode/` browsability symlink - already resolved as a non-defect (F13: it is a documented symlink, not an empty directory).
- Verifying the five hook matrices' live wiring (`.claude/settings.json`, `.codex/hooks.json`, `.cursor/`, `.devin/`) - round two logged which runtimes actually fire the hook matrix as an open UNKNOWN outside this evidence boundary (`research.md:124`). This phase changes the hooks' internals, not their registration.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs` | Modify | Add runtime-parameterized classify and enforce orchestration functions |
| `.opencode/skills/system-spec-kit/runtime/hooks/lib/hook-adapter-shared.mjs` | Modify | Add the shared JSON-stdin-read helper the four `shared.ts` files each restate |
| `.opencode/skills/system-spec-kit/runtime/hooks/claude/spec-gate-classify.mjs` | Modify | Call the new shared classify function. Drop duplicated orchestration |
| `.opencode/skills/system-spec-kit/runtime/hooks/claude/spec-gate-enforce.mjs` | Modify | Call the new shared enforce function. Drop duplicated orchestration |
| `.opencode/skills/system-spec-kit/runtime/hooks/codex/spec-gate-classify.mjs` | Modify | Same as claude |
| `.opencode/skills/system-spec-kit/runtime/hooks/codex/spec-gate-enforce.mjs` | Modify | Same as claude |
| `.opencode/skills/system-spec-kit/runtime/hooks/cursor/spec-gate-classify.mjs` | Modify | Same as claude |
| `.opencode/skills/system-spec-kit/runtime/hooks/cursor/spec-gate-enforce.mjs` | Modify | Same as claude |
| `.opencode/skills/system-spec-kit/runtime/hooks/devin/spec-gate-classify.mjs` | Modify | Same as claude |
| `.opencode/skills/system-spec-kit/runtime/hooks/devin/spec-gate-enforce.mjs` | Modify | Same as claude |
| `.opencode/skills/system-spec-kit/runtime/hooks/pi/spec-gate-classify.ts` | Modify | Call the same shared function the other four now call |
| `.opencode/skills/system-spec-kit/runtime/hooks/pi/spec-gate-enforce.ts` | Modify | Same as pi classify |
| `.opencode/skills/system-spec-kit/runtime/hooks/claude/shared.ts`, `codex/shared.ts`, `cursor/shared.ts`, `devin/shared.ts` | Modify | Remove the now-dead classify/enforce glue. Keep the lifecycle spawnSync bridge unchanged |
| `.opencode/skills/system-spec-kit/runtime/hooks/README.md` | Modify | Document the new single call site |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Each of claude, codex, cursor and devin's `spec-gate-classify.mjs` and `spec-gate-enforce.mjs` calls one shared function in `spec-gate-core.mjs` for the classify/enforce decision logic, with no duplicated observe/deny orchestration left in the runtime file. |
| REQ-002 | pi's `spec-gate-classify.ts` and `spec-gate-enforce.ts` call the same shared function the other four call, not a separate pi-only path. |
| REQ-003 | All eight named regression suites (`spec-gate-claude.test.mjs`, `spec-gate-codex.test.mjs`, `spec-gate-devin.test.mjs`, `spec-gate-prebind.test.mjs`, `spec-gate-core.test.mjs`, `directive-lifecycle-adapter-parity.vitest.ts`, `completion-evidence-sentinel.vitest.ts`, `hook-completion-evidence-stop.vitest.ts`) pass with the same rule ids and pass/fail outcomes as the pre-port baseline. |
| REQ-004 | Each of claude, codex, cursor and devin's combined `spec-gate-classify.mjs` + `spec-gate-enforce.mjs` + `shared.ts` line count drops under 200 lines (baseline: claude 351, codex 398, cursor 439, devin 401). |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | `hooks/README.md`'s architecture section documents the new single call site so the delegation contract stays accurate. |
| REQ-006 | The lifecycle spawnSync delegation (session-prime/session-stop/compact-inject) is explicitly left untouched, with the plan documenting why, so a future reader does not mistake this port for covering it too. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `wc -l` on each of claude/codex/cursor/devin's `spec-gate-classify.mjs` + `spec-gate-enforce.mjs` + `shared.ts` sums under 200 lines per runtime.
- **SC-002**: All eight named test suites pass with identical rule ids and pass/fail outcomes to the pre-port baseline.
- **SC-003**: No runtime's live registration file (`.claude/settings.json`, `.codex/hooks.json`, etc.) needs a change, since the CLI entrypoint contract (stdin in, stdout out) is unchanged.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Cursor's envelope shape (`{permission, user_message, agent_message}`) differs from Claude/Codex/Devin's `hookSpecificOutput` shape, so a naive extraction could force one envelope shape on all four | High if mishandled: would break Cursor's live response contract | Keep envelope construction in each runtime's own file. The shared function returns plain decision data (`{question}` or `{decision, detail}`), never a pre-built envelope |
| Risk | pi's classify/enforce hooks register through the Pi extension API (`pi.on('input', ...)`), not a Node stdin/stdout process, so the shared function must not assume a process entrypoint | Medium: could block REQ-002 | Confirmed low risk: `spec-gate-core.mjs`'s existing exports (`classifyIntent`, `evaluateMutation`, `resolveSessionKey`, `buildGate3ObservedReceipt`, `observeGate3QuestionDelivery`) already take and return plain data with no `process.exit`/`process.stdin` coupling |
| Dependency | `directive-lifecycle-adapter-parity.vitest.ts` and `completion-evidence-sentinel.vitest.ts` are the regression backstop for this port | If either suite is stale or missing, the testing strategy has no floor | Confirmed present at `.opencode/skills/system-spec-kit/runtime/tests/` |
| Dependency | Live registration status of the five hook matrices is an open UNKNOWN outside this evidence boundary (`research.md:124`) | Low: this phase changes internals, not the CLI contract, so an unverified registration does not block the port | Note the UNKNOWN in the plan rather than resolving it here. Resolving it is a separate, unscoped usage census |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The shared classify/enforce call must stay within each runtime's existing timeout budget (e.g. codex's 2,800ms constant in `shared.ts`) since it replaces in-process logic with in-process logic, not a new subprocess hop.
- **NFR-P02**: No new spawnSync call is introduced by this port. The spec-gate hooks already call `spec-gate-core.mjs` in-process for all five runtimes.

### Security
- **NFR-S01**: The fail-open contract holds for every one of the ten call sites (5 runtimes x classify/enforce): a shared-function error must never turn into a block or a corrupted turn.
- **NFR-S02**: No new secret, credential or network call is introduced. The shared function reads only the same payload fields the current per-runtime code already reads.

### Reliability
- **NFR-R01**: Each runtime's own `try`/`catch` wrapper around the shared call stays in the runtime file rather than moving into the core, so one runtime's failure mode cannot change another's.
- **NFR-R02**: `buildGate3ObservedReceipt`'s serialized shape stays byte-identical across all five runtimes after the port, since downstream state (`readGateState`) is runtime-agnostic today and must stay that way.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty or missing payload: every adapter's existing fail-open path (`approve()` in claude, `return { action: 'continue' }` in pi) must remain reachable through the shared function without adding a new failure mode.
- Malformed JSON on stdin: `parseJsonFailOpen` already returns `null` on parse failure. The widened `hook-adapter-shared.mjs` must preserve that contract for all four Node-CLI runtimes.

### Error Scenarios
- Shared-core internal error (e.g. `classifyIntent` throws): each runtime's own catch block must still convert this into its runtime's fail-open response, not a shared generic one, since the four runtimes emit different shapes on failure.
- Session-file lookup failure (pi's `ctx.sessionManager.getSessionFile()` can throw): the existing fallback to the raw session id via `resolveSessionKey` must survive the port unchanged.

### State Transitions
- Gate lifecycle epoch (`currentGate3LifecycleEpoch`): must resolve identically whether called from a runtime's own file or from the new shared wrapper, since the epoch is keyed by session id, not by which file called it.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | 14 files across 4 languages (`.mjs`, `.ts` compiled, `.cjs` unaffected) and 5 runtime envelope shapes |
| Risk | 18/25 | Touches five runtimes' live Gate-3 enforcement. MEDIUM-HIGH per `research.md:86` since it changes runtime behavior, not just documentation |
| Research | 10/20 | Extensive prior research already exists (three research rounds). This phase's own research need is confirming exact duplication boundaries per file, not discovering whether to do the work |
| **Total** | **43/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

None. The envelope-shape and pi-registration risks above are resolved by keeping envelope construction runtime-local. The only unresolved item (live hook-matrix registration status) is explicitly out of scope, not an open question this phase must answer.
<!-- /ANCHOR:questions -->

---



<!-- SCAFFOLD_VALIDATION_COUNTS:
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
