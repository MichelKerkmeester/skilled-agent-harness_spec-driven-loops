---
title: "Feature Specification: Hook Path CLI Spawn Trim"
description: "Every hook turn on Claude, Codex, Cursor, Devin and Pi pays for a compiled-route child process per compiled hub in the top results, then throws the result away, and casual prompts like 'thanks' still spawn the advisor CLI because the casual-prompt gate lost its only caller. This phase lets the hook ask the advisor to skip compiled-route enrichment and reconnects the gate in front of the CLI call."
trigger_phrases:
  - "hook path compiled route spawn"
  - "skip compiled route enrichment hook"
  - "casual prompt gate advisor"
  - "shouldFireAdvisor reconnect"
  - "advisor hook cli spawn trim"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Hook Path CLI Spawn Trim

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-26 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 4 |
| **Predecessor** | 002-hook-deadline-and-diagnostics |
| **Successor** | 004-headless-fallback-status-and-dedup |
| **Handoff Criteria** | No `compiled-route.cjs` child starts on a hook request, hook `durationMs` median sits below the 002 baseline, and a casual prompt produces no advisor CLI spawn |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the Pi skill orchestrator research for skill advisor refinement specification. It carries recommendations R2 and R5 from `../001-deep-research/research/research.md` section 11.

**Scope Boundary**: The advisor_recommend input schema and handler, the hook-side CLI caller, the Claude hook handler and the advisor docs that describe the hook flow. The OpenCode plugin keeps compiled-route enrichment exactly as it is.

**Dependencies**:
- 002-hook-deadline-and-diagnostics. Its `durationMs` baseline per runtime is what R2's speed claim is measured against.

**Deliverables**:
- An advisor_recommend option that skips compiled-route enrichment, sent only by the hook-side CLI caller
- The casual-prompt gate reconnected in front of the hook's CLI call
- Advisor docs that describe the hook flow the code runs

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The advisor_recommend handler runs `enrichCompiledRoutes` on every result, cached or fresh (`.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:504`, `:571`). For each top recommendation that belongs to a compiled hub, it spawns `compiled-route.cjs` synchronously with a 5,000 ms timeout (`:336-347`). Seven hubs are compiled today (`runtime/lib/compiled-routing-flag.ts`). The hook path reaches this handler through `buildSkillAdvisorBriefFromCli` (`hooks/lib/skill-advisor-cli-fallback.ts:222-241`), but nothing on that path reads the compiled route. The hook-side caller has no `compiledRoute` reference, and the only consumer is the OpenCode plugin, which makes its own CLI call (`.skilled/plugins/system-skill-advisor.js:763`) and reads the route at `:606` and `:1347`. So every hook turn whose top result is a compiled hub pays for a child process inside a 2,500 ms budget and discards what it produced.

Separately, the casual-prompt gate `shouldFireAdvisor` (`runtime/lib/prompt-policy.ts:100`) has no live caller. Its one caller is `buildSkillAdvisorBrief` (`runtime/lib/skill-advisor-brief.ts:407`), and nothing calls that builder any more. Commit `a87379aa610` replaced the Claude hook's `buildBrief = dependencies.buildBrief ?? buildSkillAdvisorBrief` path with a direct `buildCliBrief` call (`hooks/claude/user-prompt-submit.ts:276-288`). Its message says "Nothing an operator can see changed", so the gate's loss reads as a side effect. Prompts the gate used to skip now spawn the CLI: exact skip commands such as `/help`, short acknowledgements such as "thanks", and short prompts below its length and token threshold (`prompt-policy.ts:119-191`, word lists in `runtime/data/prompt-policy.default.json`).

### Purpose
A hook turn spawns only the processes whose output it uses, and a prompt the gate would skip costs no CLI spawn.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- R2: add an `includeCompiledRoute` boolean to the advisor_recommend `options` in all three schema copies: the zod schema the daemon parses (`runtime/schemas/advisor-tool-schemas.ts:217-228`), the tool descriptor (`runtime/tools/advisor-recommend.ts:12-25`) and the CLI manifest the CLI validates against before it calls the daemon (`runtime/skill-advisor-cli-manifest.ts:23-45`). It defaults to `true`. When `false`, the handler returns the result without calling `enrichCompiledRoutes`.
- R2: `buildSkillAdvisorBriefFromCli` sends `includeCompiledRoute: false` in its payload.
- R2: when a daemon started before this change rejects the new option, the CLI retries the call once without it. Both sides report protocol `'1'` (`runtime/skill-advisor-cli.ts:22`, `runtime/advisor-server.ts:225`), so the handshake cannot catch the older daemon.
- R5: the Claude hook handler calls `shouldFireAdvisor` before `buildCliBrief`. A declined prompt returns the same `skipped` result the old builder returned, with no CLI spawn. Codex, Cursor, Devin and Pi inherit this, since they all run the Claude handler.
- Docs: update `hooks/skill-advisor-hook.md` and `ARCHITECTURE.md` so the hook flow they describe matches the CLI-only code, as the operator decided.

### Out of Scope
- The OpenCode plugin's compiled-route use. It omits the new option and keeps the default.
- The compiled-route helper itself, its 5,000 ms timeout and its hub list.
- Any change to what `shouldFireAdvisor` declines. The gate is reconnected as it stands.
- The fallback line and its repeat handling. That is phase 004.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts` | Modify | R2: `includeCompiledRoute` in the strict options object |
| `.skilled/skills/system-skill-advisor/runtime/tools/advisor-recommend.ts` | Modify | R2: describe the option in the tool descriptor |
| `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli-manifest.ts` | Modify | R2: the same option in the CLI's own schema copy |
| `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts` | Modify | R2: retry once without the option when an older daemon rejects it (`invokeAdvisorRecommendPayload`, `:1414`) |
| `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts` | Modify | R2: skip `enrichCompiledRoutes` at `:504` and `:571` when the option is `false` |
| `.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts` | Modify | R2: send `includeCompiledRoute: false` |
| `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts` | Modify | R5: gate before `buildCliBrief` |
| `.skilled/skills/system-skill-advisor/runtime/tests/` | Modify | R2 handler and payload tests, R5 hook and replay tests |
| `.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md` | Modify | Docs: steps 3 and 4 at `:37-38`, and `:43`, `:49` |
| `.skilled/skills/system-skill-advisor/ARCHITECTURE.md` | Modify | Docs: the adapter paragraph at `:133` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | R2: a hook request spawns no compiled-route child | A handler test with `includeCompiledRoute: false` and a compiled-hub top result makes zero `compiled-route.cjs` calls, and the same test without the option still makes one |
| REQ-002 | R2: the OpenCode plugin is unchanged | `.skilled/plugins/tests/system-skill-advisor.test.cjs` passes unmodified, and a plugin request still carries `compiledRoute` for a compiled hub |
| REQ-003 | R5: a declined prompt costs no CLI spawn | Claude hook tests with `/help` and with "thanks" each return a `skipped` result and never call the injected `buildCliBrief` |
| REQ-004 | R5: the gate skips no routable prompt | A replay of `shouldFireAdvisor` over `runtime/scripts/routing-accuracy/labeled-prompts.jsonl` and `runtime/scripts/fixtures/gate2-golden-prompts.jsonl` declines zero prompts whose expected skill is a real skill |
| REQ-005 | R2: an older daemon does not cost the hook its brief | A CLI test against a daemon stub that rejects `includeCompiledRoute` as an unknown key still returns the recommendation, after one retry without the option |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | R2: the hook gets faster where it was slow | Over a debug-on window, median hook `durationMs` on turns whose top result is a compiled hub drops below the 002 baseline for the same turns |
| REQ-007 | The docs describe the running code | `hooks/skill-advisor-hook.md` and `ARCHITECTURE.md` name the CLI as the hook's front door and the gate's place in front of it, with no reference to a native brief builder on the hook path |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Hook turns spawn one advisor CLI process and no compiled-route children.
- **SC-002**: Casual prompts reach the model with no advisor spawn and no added latency.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The prompt cache stores pre-enrichment results (`advisor-recommend.ts:565-570`), so a cached entry is shared by callers with and without the option | Low | Enrichment runs after the cache read on both paths, so the option only decides whether it runs. Add a test that a cached hit with the option `false` still skips it |
| Risk | A daemon still running the old strict schema rejects every hook request that carries the new option, and the hook falls open to the fallback until that daemon restarts. The launcher's idle monitor only stops an idle daemon, so a daemon that hooks keep busy may run the old schema for a long time (INFERRED) | High | REQ-005's one-time retry without the option. The three schema copies are held together by `runtime/tests/skill-advisor-cli-manifest-parity.vitest.ts` and `runtime/tests/handlers/advisor-recommend-descriptor-parity.vitest.ts` |
| Risk | The gate declines a prompt a user meant to route | Med | REQ-004's replay over the labeled corpus. Any routable prompt it declines blocks the phase |
| Dependency | 002 baseline for `durationMs` | Med | REQ-006 cannot be measured until 002's diagnostics ship and a debug-on window is collected |
| Risk | The docs drift again the next time the hook path changes | Low | REQ-007 ties the docs to the code as it stands after R5 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None open. The docs describe a native brief builder with a CLI fallback, while the code runs the CLI only (research Q2). The operator decided on 2026-09-26 that the docs change to match the code, with the gate reconnected in front of the CLI call.
<!-- /ANCHOR:questions -->

---
