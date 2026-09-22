---
title: "Feature Specification: Phase 1: gate-3-mutation-time-delivery"
description: "The spec gate appends its option menu into every write-intent user turn and never resolves: 52 injections in one recent session and 44 of 54 active gate states still open. This phase moves the question to the first real file mutation, asks once per session through each runtime's strongest channel, and repairs the create-a-new-folder answer that could never bind."
trigger_phrases:
  - "gate 3 delivery"
  - "spec folder question"
  - "pi spec gate dialog"
  - "mutation-time prompt"
  - "gate 3 suppression"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1: gate-3-mutation-time-delivery

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-22 |
| **Branch** | `worktrees/058-gate-3-mutation-time-delivery` |
| **Parent Spec** | ../spec.md |
| **Phase** | 48 of 48 |
| **Predecessor** | 047-v4-changelog-review-fixes |
| **Successor** | None |
| **Handoff Criteria** | Every runtime adapter ships the mutation-time delivery with its test updated, the pi dialog binds an answer end to end, the packet and the parent tree validate strict, and no turn-time menu emission remains in any adapter |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 48** of the v4 parent, and it owns the spec-gate delivery contract: when the Gate 3 question reaches the operator, through which channel, and how often.

**Scope Boundary**: The delivery half of Gate 3 only. Delivery lives in `runtime/hooks/<runtime>/` classify and enforce adapters plus their shared policy core, the OpenCode plugin, and the hook documentation that describes them. The classifier's trigger vocabulary, the gate's satisfy/skip semantics, its enforce/advise meaning, and dispatched-child behavior all stay as they are.

**Dependencies**:
- None. The delivery rework reads and reuses the existing core entrypoints (`classifyIntent`, `evaluateMutation`, `answerParse`, `validateSpecFolderBinding`); no sibling phase must ship first.

**Deliverables**:
- Core: reframed question texts, a persisted per-session emission marker with re-arm rules, a programmatic answer-binding entrypoint for dialog-capable runtimes, and acceptance of a not-yet-created packet path.
- Adapters: turn-time menu emission removed in every runtime; mutation-time delivery added to every enforce adapter; a native dialog in the pi extension.
- Tests: extended core corpus, updated per-runtime fixtures, and a new pi extension suite driven by a fake `ExtensionAPI`.
- Docs: the spec-gate delivery/environment tables, per-runtime hook READMEs, the hook injection contract, and the mutation-gate playbook pages.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The Gate 3 question is delivered by appending a four-option menu to the user's own turn whenever the classifier reads write intent, and the gate almost never closes. Measured on this checkout: one session carried 52 separate menu injections, and the same transcript records the operator's own words "Luna is stuck, take over deep research" — an instruction-following model treats the injected menu as a blocking user question and stops every turn, while models that shrug it off leave the gate open. Of the gate-state files, 44 of 54 active and 140 of 168 archived are still `open`, because the only way to answer is the user's next message, which in practice is the next instruction. A structural defect compounds it: the question's option B ("create a new spec folder, reply with a new path") can never bind, because `validateSpecFolderBinding()` returns `missing_folder` for a path that does not exist yet, so that answer is rejected and the same question re-surfaces. Suppression exists in the core but is inert for pi: the lifecycle-epoch advance is wired only in the OpenCode plugin, and the shadow receipts are per-process, so every stateless per-event adapter re-emits forever.

### Purpose
Ask Gate 3 once, at the first mutation that actually needs it, through the strongest channel the running runtime offers, and keep the question out of turns that are not producing a mutation.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Turn-time menu emission removed from every classify adapter; the gate state still opens, and conversational answers (letter or path) still bind.
- Mutation-time delivery added to every enforce adapter: pi opens a dialog; Claude, Codex and Devin carry the reframed notice as a deny reason or tool-call context; Cursor uses `permission: deny` plus `user_message`/`agent_message`; OpenCode throws with the reframed reason.
- Reframed text constants in the core: one instruction line plus the option menu for channels without a dialog, and a deferral instruction for classify paths that cannot ask.
- Persisted per-session emission marker in the session gate state, so once-per-session suppression survives stateless per-event runtimes; re-armed on resume triggers, answer attempts and a re-opened gate; `SYSTEM_SPEC_GATE_3_DELIVERY_SUPPRESSION=0` forces always-emit.
- Pi dialog at the first non-exempt `write`/`edit`: `ctx.ui.select` plus `ctx.ui.input`, the answer bound through a new core entrypoint, that one call blocked with a short retry reason, cancel or timeout falling through to today's advisory result, and no dialog for `bash`.
- `acceptPriorAnswerBinding()` accepts a not-yet-created packet path whose leaf matches `^\d{3}-[a-z0-9-]+$` and whose parent directory exists inside the repository's `specs/` root.
- Tests and documentation for all of the above.

### Out of Scope
- `AGENTS.md` prose - operator decision: this phase changes hooks only, so the shared model-facing contract keeps its current wording.
- The classifier's trigger vocabulary and its read-only disqualifiers - a separate concern with its own review history.
- Flipping advisory to deny by default for non-pi runtimes - enforcement stays opt-in via `SYSTEM_SPEC_GATE_ENFORCE`.
- Native folder dialogs outside pi - each other runtime keeps its existing envelope and gains only the reframed mutation-time text.
- Spec-folder content, archives and historical records of the old question shape.
- Dispatched and child session behavior - `AI_SESSION_CHILD=1` stays a complete no-op.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs` | Modify | Reframed texts, persisted emission marker, dialog binding entrypoint, new-folder acceptance |
| `.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.test.mjs` | Modify | Coverage for the new contract and preserved fail-open corpus |
| `.skilled/skills/system-spec-kit/runtime/hooks/pi/spec-gate-classify.ts` | Modify | Stop menu emission; deferral instruction only when no dialog-capable UI exists |
| `.skilled/skills/system-spec-kit/runtime/hooks/pi/spec-gate-enforce.ts` | Modify | Write-time dialog, bind, one-time block, fail-open |
| `.skilled/skills/system-spec-kit/runtime/tests/spec-gate-pi-extension.vitest.ts` | Create | Fake `ExtensionAPI` suite for the new pi delivery |
| `.skilled/skills/system-spec-kit/runtime/hooks/claude/spec-gate-classify.mjs` | Modify | Stop menu emission |
| `.skilled/skills/system-spec-kit/runtime/hooks/claude/spec-gate-enforce.mjs` | Modify | Mutation-time reframed notice |
| `.skilled/skills/system-spec-kit/runtime/hooks/codex/spec-gate-classify.mjs` | Modify | Stop menu emission |
| `.skilled/skills/system-spec-kit/runtime/hooks/codex/spec-gate-enforce.mjs` | Modify | Mutation-time reframed notice |
| `.skilled/skills/system-spec-kit/runtime/hooks/devin/spec-gate-classify.mjs` | Modify | Stop menu emission |
| `.skilled/skills/system-spec-kit/runtime/hooks/devin/spec-gate-enforce.mjs` | Modify | Mutation-time reframed notice |
| `.skilled/skills/system-spec-kit/runtime/hooks/cursor/spec-gate-classify.mjs` | Modify | Stop menu emission |
| `.skilled/skills/system-spec-kit/runtime/hooks/cursor/spec-gate-enforce.mjs` | Modify | Mutation-time reframed notice over Cursor's envelope |
| `.skilled/skills/system-spec-kit/runtime/hooks/claude/spec-gate-claude.test.mjs` | Modify | Fixtures assert mutation-time delivery, not classify emission |
| `.skilled/skills/system-spec-kit/runtime/hooks/codex/spec-gate-codex.test.mjs` | Modify | Same |
| `.skilled/skills/system-spec-kit/runtime/hooks/devin/spec-gate-devin.test.mjs` | Modify | Same |
| `.skilled/skills/system-spec-kit/runtime/hooks/cursor/spec-gate-prebind.test.mjs` | Modify | Same over Cursor's envelope |
| `.skilled/plugins/system-spec-gate.js` | Modify | One-shot reframed injection, reframed throw reason |
| `.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/README.md` | Modify | Delivery and environment tables |
| `.skilled/hooks/README.md` | Modify | Hook-delivery index where it names the gate question |
| `.skilled/hooks/injection-contract.md` | Modify | The question text this contract quotes |
| Per-runtime hook READMEs under `.skilled/skills/system-spec-kit/runtime/hooks/` | Modify | Delivery column per runtime |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/spec-mutation-gate*.md` | Modify | Expected outputs for the new delivery |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A write-intent turn must not, by itself, inject the option menu into the user's turn in any runtime; the gate state still opens and the turn proceeds unmodified. |
| REQ-002 | The question must be delivered at the first non-exempt mutation of a session, through the strongest channel the running runtime offers, exactly once per session. |
| REQ-003 | A pi interactive session must receive the question as a dialog (`ctx.ui.select` plus path input), and the operator's answer must bind the gate before the mutation proceeds. |
| REQ-004 | Repeat emissions within one session must be suppressed from persisted state that survives per-event process boundaries, re-armed on a resume trigger, an answer attempt, or a re-opened gate, and forceable via `SYSTEM_SPEC_GATE_3_DELIVERY_SUPPRESSION=0`. |
| REQ-005 | A not-yet-created packet path must bind when its parent directory exists inside the repository `specs/` root and its leaf matches the packet-folder grammar, so option B and a dialog "create new" answer resolve instead of re-asking. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | Dialog cancel, dialog timeout, malformed payloads, a disabled flag and an unresolvable project root must all resolve to the same decision the shipped default takes today, never to a new block. |
| REQ-007 | `AI_SESSION_CHILD=1` must remain a complete no-op in both entrypoints, before any state read, question or telemetry. |
| REQ-008 | Every changed runtime adapter and the shared core must carry tests for the new contract, including the pi dialog path driven by a fake `ExtensionAPI`. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Feeding a write-intent prompt to any classify adapter produces no option menu (observed as empty stdout for the CLI adapters, `{action: continue}` without the text for pi).
- **SC-002**: With an open gate, a first non-exempt mutation yields exactly one delivery per session, and a second mutation in the same session yields none; a resume trigger or an answer attempt re-arms it.
- **SC-003**: A fresh packet path under the repository `specs/` root binds as a valid answer in the core corpus and in the pi dialog suite, and a path outside the spec root or with traversal is rejected.
- **SC-004**: The core corpus, all per-runtime adapter suites, the runtime vitest project and both strict validations (packet and parent tree) pass from the final state.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | pi's `ExtensionContext` (`hasUI`, `ui.select`, `ui.input`) | The dialog path cannot ship if the runtime lacks it | Types confirmed in the installed runtime declaration; the code path is guarded by `ctx.hasUI` and falls back to the shipped advisory behavior |
| Dependency | The compiled classifier at `shared/dist/gate-3-classifier.js` | Validation rules for bindings come from there; a stale `dist` would validate the wrong contract | Core tests import the compiled artifact already; the shared test lane runs before completion |
| Risk | A dialog stalls an unattended session | Medium | Dialog timeout plus cancel both fall through to today's decision; prompts fire only for `write`/`edit`, never `bash` |
| Risk | New gate-state fields break older readers or writers | Low | Fields are additive JSON; readers ignore unknown keys; eviction and retention logic is untouched |
| Risk | A path-shaped answer can typo its way to a binding | Low | Acceptance still requires an existing parent inside the repository `specs/` root plus the packet grammar; traversal and out-of-root paths are rejected |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: A read-only turn must not gain filesystem writes; the only new persisted state is written when a question is actually delivered.
- **NFR-P02**: The dialog path must add no work to turns that never mutate, and one prompt at most per session for turns that do.

### Security
- **NFR-S01**: Only paths that resolve inside the repository `specs/` root may bind; traversal, symlink escape and out-of-root candidates are rejected.
- **NFR-S02**: No new environment variable is logged or persisted beyond the existing gate-state directory.

### Reliability
- **NFR-R01**: Every new code path fails open: a classifier throw, an unreadable state file, a missing UI, a cancelled dialog or an unexpected payload resolves to today's decision.
- **NFR-R02**: Child sessions remain stateless no-ops, verified on both entrypoints.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty prompt: classifies as no match; no state write, no delivery.
- Invalid path in a dialog answer: the dialog re-prompts or the answer is rejected and the gate stays open; no partial binding is persisted.
- Path outside the spec root, or with `..` traversal: rejected with the existing validation reasons.

### Error Scenarios
- External service failure: not applicable; everything is local filesystem and in-process.
- Dialog cancel or timeout: the mutation falls through to the decision the shipped default would have taken.
- Concurrent access: gate state writes remain atomic (write-then-rename); two runtimes racing the same session key resolve to the last atomic write.

### State Transitions
- Partial completion: a delivery marker persists even when the answer does not; the marker only suppresses repeats and never satisfies or blocks the gate.
- Session expiry: state retention and eviction rules are unchanged; stale sessions are swept as before.
- Re-opened gate: after a satisfied or skipped gate re-opens for a new task, the emission marker is cleared with it.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | About eighteen files across a shared core, six runtime adapters, their tests and hook docs |
| Risk | 12/25 | A shared hook contract and six runtimes, but additive state, fail-open paths and a single-commit revert |
| Research | 8/20 | The failure modes were measured live; the remaining design work is the delivery mechanics per runtime |
| **Total** | **36/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None. The operator settled the three design forks before this packet was created: hybrid dialog plus reframed text, all runtimes in scope, and hooks only with `AGENTS.md` untouched.
<!-- /ANCHOR:questions -->

---
