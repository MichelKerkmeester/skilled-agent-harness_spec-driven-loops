---
title: "Pi Dispatch Authorization Boundary Hardening"
description: "Make Pi dispatch authorization deterministic, executor-bound, and honest about shell command syntax while preserving a conservative fail-open adapter boundary."
trigger_phrases:
  - "Pi dispatch authorization"
  - "dispatch shape tokenizer"
  - "cli-pi self dispatch"
  - "Pi tool_call enforcement"
  - "user-authored dispatch override"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/007-fable-governor-pi-hook/006-dispatch-authorization-hardening"
    last_updated_at: "2026-08-04T22:26:28Z"
    last_updated_by: "phase006-evidence-refresh"
    recent_action: "Refreshed validator-recognized evidence receipts"
    next_safe_action: "Hand off evidence inventory to Phase 007"
    blockers: []
    key_files:
      - ".opencode/hooks/dispatch/lib/dispatch-audit.mjs"
      - ".opencode/hooks/dispatch/pi/dispatch-preflight-lint.ts"
      - ".opencode/hooks/dispatch/pi/dispatch-preflight-lint.test.ts"
      - ".opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts"
    session_dedup:
      fingerprint: "sha256:808ad83b37a41fd41d3a0bafb56ab6c92fd65996f341786c7cf56985bc59e9df"
      session_id: "2026-08-04-cli-038-006-plan"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Which bounded tokenizer grammar supports direct commands without evaluating shell indirection?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Pi Dispatch Authorization Boundary Hardening

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-08-04 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 6 of 9 |
| **Predecessor** | 005-agents-md-pi-row |
| **Successor** | 007-dispatch-validation-evidence |
| **Handoff Criteria** | A bounded inspection result, unconditional Pi self-deny, exact executor authorization, raw-user capture, and registered Pi handler tests are all specified and then verified by the named commands. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The current working tree contains a partial Pi guard: it denies `cli-pi`, stores an input event, strips known advisor/directive markers, and has a pure helper matrix. The actual enforcement boundary still starts with raw-text `DISPATCH_SHAPES` regexes, so `printf "devin -p task"` can look executable while variables, aliases, wrappers, and shell composition can evade or confuse classification. The current authorization also receives transformed text unless the original user turn is captured independently, and a mismatched deep-loop executor can be authorized by a different matched shape.

### Purpose
Make Pi dispatch decisions conservative and reproducible: only a statically proven direct executor can receive a matching user authorization, `cli-pi` can never be authorized, opaque shell indirection cannot become an allow, and transformed advisor or directive text cannot grant permission.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A bounded command inspector shared by dispatch auditing and Pi preflight, with direct, ambiguous, and no-match outcomes.
- Exact binding between the inspected executor and a positive `cli-*` or deep-loop authorization.
- An unconditional `cli-pi` self-dispatch deny before all override paths.
- Raw user-turn capture that is independent of advisor, directive, spec-gate, and sibling extension ordering.
- Pure classifier tests and a registered Pi extension-factory `input`/`tool_call` integration matrix.

### Out of Scope
- Governor, proof, or injection-contract wording; Phase 009 owns that documentation contract.
- Historical evidence wording, corpus baselines, and test-claim reconciliation; Phase 007 owns those artifacts.
- Final packet status and generated metadata reconciliation; Phase 008 owns those artifacts.
- Shell evaluation, alias expansion, variable resolution, or launching a child process from the guard.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/hooks/dispatch/lib/dispatch-audit.mjs` | Modify | Export a bounded inspection result and keep audit consumers on the same command-shape contract. |
| `.opencode/hooks/dispatch/lib/dispatch-audit.test.mjs` | Modify | Cover direct commands, prose/quoted false positives, separators, wrappers, and opaque indirection. |
| `.opencode/hooks/dispatch/pi/dispatch-preflight-lint.ts` | Modify | Apply exact executor authorization, self-deny, and raw-user capture at Pi `tool_call`. |
| `.opencode/hooks/dispatch/pi/dispatch-preflight-lint.test.ts` | Modify | Add pure rows and registered-factory `input`/`tool_call` coverage. |
| `.opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts` | Modify if required | Preserve the untouched input boundary without making transformed advisor text authoritative. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Pi must never authorize a `cli-pi` self-dispatch, even when the user explicitly names `cli-pi` or a deep-loop executor names it. | A pure predicate row and a registered Pi `tool_call` callback both block a direct Pi print command; the reason does not offer a user override. |
| REQ-002 | Authorization must match the executor proven by the command inspector. | A direct Devin command is allowed only by a positive `cli-devin` authorization or an exact `--executor cli-devin`; `cli-cursor`, `cli-opencode`, and all other mismatches remain blocked. |
| REQ-003 | Enforcement must be tested at the actual Pi extension boundary, not only through an exported helper. | The default factory is registered against a fake `ExtensionAPI`, its `input` and `tool_call` handlers are invoked, and the returned block/allow result is asserted. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The shared matcher must not treat prose, quoted prompt text, `echo`, or `printf` text as an executable direct dispatch. | `matchDispatchShape` or its replacement returns no direct executor for quoted/prose payloads and recognizes a direct `devin -p` command in a deterministic test. |
| REQ-005 | Variables, aliases, command substitutions, unknown wrappers, and unsupported shell syntax must not bypass enforcement. | The inspector reports `ambiguous` or `none` for opaque forms; Pi does not allow an ambiguous external print-mode candidate merely because unrelated `cli-*` text appears in the turn, and no shell is spawned. |
| REQ-006 | Authorization must use original user-authored text deterministically. | Advisor/directive recommendations, injected examples, quoted mentions, variable assignments, aliases, and negated mentions cannot authorize a dispatch; positive unquoted matching text can, and both extension registration orders produce the same result. |
| REQ-007 | Existing hard-rule linting, non-Pi behavior, and native Pi subagent tools remain intact. | Shared dispatch tests pass, a non-Pi runtime is unchanged, and a `subagent` tool event is not denied by this policy. |
| REQ-008 | Internal guard failures remain fail-open for unrelated work without manufacturing an authorization allow. | A classifier/import/session-capture failure does not block an unrelated command, while a candidate external dispatch without provable authorization is not converted into an allow. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: **Given** a direct `pi --offline -p` command, **when** the user text names `cli-pi`, **then** the registered Pi handler blocks it before any override branch.
- **SC-002**: **Given** a direct Devin command, **when** the user text names `cli-cursor` or a deep-loop executor names `cli-opencode`, **then** the command remains blocked because the authorization does not match Devin.
- **SC-003**: **Given** `printf "devin -p task"`, `echo "cursor-agent -p task"`, or quoted prompt prose, **when** the inspector runs, **then** it reports no direct dispatch and does not block an unrelated command solely for containing the text.
- **SC-004**: **Given** `$CLI -p task`, an alias/function expanding to `devin`, a command substitution, or an unknown wrapper, **when** the executor cannot be proven, **then** Pi reports an ambiguous candidate and does not authorize it through a generic `cli-*` mention.
- **SC-005**: **Given** advisor output or the Pi directive contains `cli-devin`, **when** the user only asks for a normal task and handlers are registered in either order, **then** a Devin dispatch remains denied.
- **SC-006**: **Given** the user says `do not use cli-devin` or puts the name in a quote, example, variable assignment, or alias definition, **when** a direct Devin command is evaluated, **then** the mention does not authorize it.
- **SC-007**: **Given** a registered Pi `tool_call` handler and a native `subagent` event, **when** both are invoked, **then** only the unauthorized external bash dispatch is evaluated and the native tool remains unaffected.
- **SC-008**: The focused matcher, Pi integration, rule-core, and headless-startup commands below each exit 0, with output classes reported separately.

**Objective verification commands:**

```bash
npx vitest run .opencode/hooks/dispatch/pi/dispatch-preflight-lint.test.ts --reporter=dot
npx vitest run .opencode/hooks/dispatch/lib/dispatch-audit.test.mjs --reporter=dot
node --test .opencode/hooks/dispatch/lib/dispatch-rule-checks.test.mjs
command -v pi && pi --offline --approve -p "list available tools; do not modify files" </dev/null
```
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A shared matcher change can alter audit recognition for every runtime. | High | Preserve a typed result, add direct/ambiguous/none regression rows, run shared tests before Pi integration tests, and keep the shared change separately revertible. |
| Risk | Conservative blocking of opaque shell syntax can surprise operators. | Medium | Document the boundary, provide a precise block reason, and never evaluate shell code to guess intent. |
| Risk | Pi extension order or transformed input can alter authorization. | High | Capture raw input before composition, key it by session, test both registration orders, and deny when authorization cannot be proven. |
| Dependency | Installed Pi event API and extension mirror. | Medium | Use the actual factory shape and headless startup smoke; do not substitute helper-only evidence. |
| Dependency | Existing dispatch audit/rule suites. | Medium | Record focused baselines and do not hand off while a scoped regression is unexplained. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Inspection is synchronous and bounded by command length; it performs no shell spawn, network call, or unbounded recursion.
- **NFR-P02**: Guard overhead remains within the existing `tool_call` preflight path and preserves the fail-open error boundary.

### Security
- **NFR-S01**: Authorization never executes, sources, expands, or resolves user shell code.
- **NFR-S02**: An unknown or ambiguous executor cannot gain permission from advisor text, model names, a mismatched `cli-*` token, or a deep-loop token for another executor.

### Reliability
- **NFR-R01**: Raw user text is session-bound and replaced for every new interactive or RPC input.
- **NFR-R02**: Shared audit and Pi preflight consume one inspection contract rather than independent raw-text interpretations.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty, non-string, or overlong command: return a bounded no-match result and never throw.
- Quoted `devin -p` text inside `printf`, `echo`, a prompt argument, or a comment: do not classify it as a direct dispatch.
- Top-level `&&`, `||`, `;`, and `|`: inspect segments independently; authorization from one segment cannot authorize another.
- A transparent wrapper such as `env KEY=value devin -p` may be supported only when the executor token remains statically provable; unknown wrappers are ambiguous.

### Error Scenarios
- A variable or alias might resolve to a known executor: block as ambiguous rather than evaluating it.
- Import, tokenizer, or session-capture failure: fail open for unrelated work, but never manufacture an authorization allow for a candidate dispatch.
- Negated, quoted, or injected `cli-*` text: remain denied unless a positive, unquoted, executor-matching override is proven.

### State Transitions
- A new input turn replaces the prior raw-user capture for the same session.
- Missing or mismatched session capture cannot authorize an external dispatch.
- A deep-loop executor is allowed only when it exactly equals the inspected direct executor and is not `cli-pi`.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 22/25 | Shared matcher, Pi adapter, prompt capture, pure tests, and factory integration. |
| Risk | 24/25 | P0 self-recursion and P1 parser/authentication boundary with shell syntax. |
| Research | 16/20 | Current partial fix, Pi lifecycle behavior, and matcher consumers require confirmation. |
| **Total** | **62/70** | Level 2; high-risk implementation with a bounded tokenizer seam. |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Which transparent shell wrappers are worth supporting in the first bounded grammar; which should remain ambiguous and blocked?
- Does the installed Pi event API expose an immutable raw user-message accessor, or should the current adapter remain the capture owner?
<!-- /ANCHOR:questions -->

---

## REMEDIATION TRACEABILITY

| Finding | Requirement(s) | Acceptance scenario(s) | Task(s) | Rollback boundary | Objective verification |
|---------|----------------|------------------------|---------|-------------------|------------------------|
| P0 Pi self-recursion | REQ-001, REQ-003 | SC-001, SC-007 | T004, T008, T009 | Revert the Pi deny branch and its integration rows together; retain the shared inspector only if its tests remain green. | `npx vitest run .opencode/hooks/dispatch/pi/dispatch-preflight-lint.test.ts --reporter=dot` |
| P1 executor mismatch | REQ-002, REQ-006 | SC-002, SC-007 | T004, T006, T008 | Revert exact authorization binding without restoring a mismatched override path. | `npx vitest run .opencode/hooks/dispatch/pi/dispatch-preflight-lint.test.ts --reporter=dot` |
| P1 raw matcher false positives and bypasses | REQ-004, REQ-005 | SC-003, SC-004 | T002, T003, T007 | Revert the shared inspector and its tests as one unit; keep ambiguous candidates blocked until a safe boundary exists. | `npx vitest run .opencode/hooks/dispatch/lib/dispatch-audit.test.mjs --reporter=dot` |
| P1 transformed-input authorization | REQ-006 | SC-005, SC-006 | T005, T006, T008 | Revert the capture handoff and integration fixtures; do not restore marker-derived authorization. | `npx vitest run .opencode/hooks/dispatch/pi/dispatch-preflight-lint.test.ts --reporter=dot` |
| P2 evidence/state and P3 contract docs | Handoff to Phases 007-009 | SC-008 | T011 | Do not mark this phase complete for documentation work owned by later phases. | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/hooks/007-fable-governor-pi-hook/006-dispatch-authorization-hardening --strict` |

## RELATED DOCUMENTS

- Parent packet: [../spec.md](../spec.md)
- Pi skill prohibition: `.opencode/skills/cli-external-orchestration/cli-pi/SKILL.md`
- Shared matcher: `.opencode/hooks/dispatch/lib/dispatch-audit.mjs`
- Pi adapter: `.opencode/hooks/dispatch/pi/dispatch-preflight-lint.ts`
- Validation and evidence phase: [../007-dispatch-validation-evidence/spec.md](../007-dispatch-validation-evidence/spec.md)
