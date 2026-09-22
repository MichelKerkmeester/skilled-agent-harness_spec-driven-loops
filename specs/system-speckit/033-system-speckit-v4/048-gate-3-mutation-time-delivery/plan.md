---
title: "Implementation Plan: Phase 1: gate-3-mutation-time-delivery"
description: "Move the Gate 3 question from turn time to mutation time: remove per-turn menu emission from every classify adapter, deliver once per session through each runtime's strongest channel (a native pi dialog, deny-or-context elsewhere), persist the emission marker so stateless per-event runtimes can suppress repeats, and let a not-yet-created packet path bind."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1: gate-3-mutation-time-delivery

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node ESM for the shared core and CLI adapters; TypeScript for the pi extension; JavaScript for the OpenCode plugin |
| **Framework** | None. A runtime-neutral policy core under `runtime/hooks/lib/spec-gate/` with thin per-runtime adapters |
| **Storage** | The existing per-session gate-state JSON under `.skilled/skills/.state/spec-gate/`; no new store |
| **Testing** | `node --test` for the core and the CLI adapters; the runtime vitest project for the new pi extension suite |

### Overview
Gate 3 keeps being asked at the wrong moment. Today every classify adapter appends the option menu into the user's turn, the gate rarely closes because the answer channel is the user's next message, and per-event runtimes cannot suppress repeats because the shadow receipts live in process memory. This phase stops turn-time emission everywhere, delivers the question at the first non-exempt mutation instead, gives pi a native dialog that binds the operator's answer in one interaction, persists a per-session emission marker that survives process boundaries, and repairs the create-a-new-folder answer that `validateSpecFolderBinding()` rejects as `missing_folder` today.

Prior art this phase builds on, and deliberately does not repeat: `specs/hooks/006-spec-gate-question-noise` fixed the read-only re-ask and the answer grammar (already in the core: read-only turns return `question: null`, `isAnswerAttempt()` re-surfaces an incomplete answer); `specs/hooks/002-injection-bloat-reduction/005-gate3-relay-edge-triggering` shipped the edge-triggered suppression shadow-only and left the consuming branch deferred "pending runtime-specific delivery evidence". This phase is that consuming branch, and it supplies the evidence.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] `node --test .skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.test.mjs` passes
- [ ] `node --test .skilled/skills/system-spec-kit/runtime/hooks/claude/spec-gate-claude.test.mjs .skilled/skills/system-spec-kit/runtime/hooks/codex/spec-gate-codex.test.mjs .skilled/skills/system-spec-kit/runtime/hooks/devin/spec-gate-devin.test.mjs .skilled/skills/system-spec-kit/runtime/hooks/cursor/spec-gate-prebind.test.mjs` passes
- [ ] `cd .skilled/skills/system-spec-kit/runtime && npx vitest run --config ../vitest.config.ts --project root` passes, including the new pi extension suite
- [ ] Both adapter-boundary checks in `tasks.md` (classify emits nothing; enforce carries the reframed notice) show the expected output
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/033-system-speckit-v4/048-gate-3-mutation-time-delivery --strict` prints `RESULT: PASSED`
- [ ] The parent tree validates with `--recursive --strict` and its phase map lists 048
- [ ] `git status --porcelain` after cleanup shows only intended files
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
The existing adapter/core seam, unchanged: `spec-gate-core.mjs` owns policy and state, each runtime adapter owns payload translation and the response envelope. What moves is *when* the policy is consulted for delivery: the classify entrypoint stops returning the question, and the enforce entrypoint starts returning it when a real mutation arrives.

### Key Components
- **Core policy** (`lib/spec-gate/spec-gate-core.mjs`): reframed question constants, the persisted emission marker and its re-arm rules, a programmatic answer-binding entrypoint for dialog-capable runtimes, and the new-folder acceptance rule inside the existing prior-answer binding path.
- **Pi extension** (`hooks/pi/spec-gate-classify.ts`, `spec-gate-enforce.ts`): the only runtime with a dialog. Classify opens the gate silently; enforce asks through `ctx.ui.select` plus `ctx.ui.input` at the first non-exempt `write`/`edit`, binds the answer, and blocks that one call with a short retry reason.
- **CLI adapters** (`claude/`, `codex/`, `devin/`, `cursor/`): thin stdin payload readers unchanged in shape; their classify output becomes empty and their enforce output carries the reframed notice.
- **OpenCode plugin** (`.skilled/plugins/system-spec-gate.js`): system-transform injection becomes a one-shot reframed notice; the throw reason is reframed.

### Data Flow
A user turn is classified; write intent opens the session gate in the same gate-state file as today, and the turn proceeds without injected text. When a mutation arrives, the enforce adapter reads that state; if the gate is open and the question has not yet been delivered this session, the adapter delivers it through its strongest channel and marks it delivered. A validated answer (letter, existing folder, or a fresh packet path whose parent exists) satisfies or skips the gate; the marker never changes the decision, only the repeat emission.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `lib/spec-gate/spec-gate-core.mjs` | Owns `GATE_3_QUESTION`, `GATE_3_DENY_DETAIL`, `classifyIntent`, `evaluateMutation`, gate state, binding validation | Update: reframed texts, persisted emission marker plus re-arm, dialog binding entrypoint, new-folder acceptance | `node --test spec-gate-core.test.mjs` |
| `lib/spec-gate/spec-gate-core.test.mjs` | Core corpus, including the shadow-delivery cases | Update: new contract cases; keep every fail-open and child-session case | New and existing cases all pass |
| `claude/spec-gate-classify.mjs`, `codex/…`, `devin/…`, `cursor/…` | Append the question as `UserPromptSubmit` context | Update: emit nothing; keep opening the gate and parsing answers | Adapter tests plus the classify boundary check |
| `claude/spec-gate-enforce.mjs`, `codex/…`, `devin/…`, `cursor/…` | Deny reason or tool-call context on an open gate | Update: carry the reframed mutation-time notice, once per session | Adapter tests plus the enforce boundary check |
| `pi/spec-gate-classify.ts` | Appends the menu to the user turn | Update: open the gate silently; a reframed one-shot instruction only when no dialog-capable UI exists | New pi extension suite |
| `pi/spec-gate-enforce.ts` | Blocks on deny only | Update: dialog at the first non-exempt `write`/`edit`, bind, one-time block, fail-open on cancel | New pi extension suite |
| `.skilled/plugins/system-spec-gate.js` | Injects the question via `experimental.chat.system.transform`; throws on deny | Update: one-shot reframed injection; reframed throw reason | Plugin test lane |
| `.skilled/skills/system-skill-advisor/runtime/lib/policy-plan.ts` | Reads `GATE_3_QUESTION` from the owner module for its policy-block registry | Not a consumer of delivery timing; unchanged, and it picks the new text up automatically | `rg -n "GATE_3_QUESTION"` shows the read-only reference; advisor lane stays green |
| `.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/README.md`, `runtime/hooks/README.md`, per-runtime hook READMEs, `.skilled/hooks/README.md`, `.skilled/hooks/injection-contract.md` | Document the delivery table, the environment table and the question text | Update: mutation-time delivery, the emission-marker default, the reframed texts | Doc greps return no stale claim |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/spec-mutation-gate*.md` | Expected outputs for the old delivery | Update: expected outputs for mutation-time delivery | Playbook pages match the adapter boundary checks |

Required inventories:
- Question-text producers and readers: `rg -ln "GATE_3_QUESTION|GATE_3_DENY_DETAIL" --glob '!**/node_modules/**' .` returns the core, its corpus, the advisor's policy-plan reader, one playbook page, and spec archives. Only the core and its corpus change; the rest are readers or historical records.
- Entrypoint consumers: `rg -ln "runClassifyGate|runEnforceGate" --glob '!**/node_modules/**' .` returns the four CLI adapter pairs, the pi pair, the core, its corpus and `runtime/hooks/README.md`. All six adapters are in scope.
- Matrix axes and rows: runtime (6) × entrypoint (classify, enforce) = 12, plus boundary rows for child session, disabled flag, invalid dialog answer and cancelled dialog = 16 rows, each with an assertion.
- Algorithm invariant: the emission marker changes only whether the question is repeated, never whether a mutation is allowed, denied or satisfied; and a binding accepts exactly two new-folder shapes (existing valid folder, or a packet path whose parent directory exists inside the repository `specs/` root with a leaf matching `^\d{3}-[a-z0-9-]+$`). Adversarial cases: `..` traversal, an absolute path outside the tree, a file where a folder is expected, and an empty path.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

**Phase 1: Core policy.** `spec-gate-core.mjs` plus its corpus: reframed constants, persisted emission marker with re-arm, dialog binding entrypoint, new-folder acceptance. Every adapter depends on this contract, so it lands first.

**Phase 2: Pi extension.** `spec-gate-classify.ts`, `spec-gate-enforce.ts`, and the new fake-`ExtensionAPI` vitest suite: the only runtime that asks directly.

**Phase 3: CLI adapters.** Claude, Codex, Devin and Cursor classify/enforce pairs and their four `node --test` suites.

**Phase 4: OpenCode plugin.** One-shot reframed injection and the reframed throw reason.

**Phase 5: Documentation and registration.** Hook READMEs, the spec-gate delivery table, the injection contract, the playbook pages, then the parent phase map, timeline and derived metadata.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Core: emission marker and re-arm, reframed texts, dialog binding entrypoint, new-folder acceptance, preserved fail-open corpus | `node --test spec-gate-core.test.mjs` |
| Unit | Four CLI adapter pairs: classify emits nothing, enforce carries the reframed notice | `node --test` over the four suites |
| Unit/integration | Pi extension over a fake `ExtensionAPI`: no turn-time menu, dialog at the first write, one-time block with retry reason, repeat suppression, cancel falls through | `npx vitest run --project root` |
| Boundary | Real adapter processes over stdin: classify returns no output and exit 0; enforce prints the reframed notice (and denies under `SYSTEM_SPEC_GATE_ENFORCE=1`) | `printf … \| node …` checks in `tasks.md` |
| Manual | A live pi TUI session: no menu in the turn, one dialog at the first write, no repeat after answering | Operator (see `tasks.md`) |
| Validation | Packet strict and parent recursive strict | `validate.sh` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| pi `ExtensionContext` (`hasUI`, `ui.select`, `ui.input`) | External runtime API | Green; confirmed in the installed type declarations | The pi dialog degrades to the shipped advisory path, guarded by `hasUI` |
| `shared/dist/gate-3-classifier.js` binding validation | Internal | Green; imported by the core today | Stale `dist` would validate the wrong contract; the shared test lane runs before completion |
| Prior packets `hooks/006` and `hooks/002/005` | Internal, informational | Complete | No blocking dependency; they define the behavior this phase must not regress |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A core corpus failure, an adapter suite failure, a runtime vitest failure, or a strict-validation failure that the change introduced.
- **Procedure**: One revert of the implementation commit restores turn-time delivery, the old binding rules and the old suppression default; the packet scaffold may be reverted separately. Gate-state files are per-session and the new fields are additive, so a reverted reader ignores them.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Phase 1 (Core) ──► Phase 2 (Pi) ──► Phase 3 (CLI adapters) ──► Phase 4 (OpenCode) ──► Phase 5 (Docs + registration)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Core | None | Pi, CLI adapters, OpenCode |
| Pi | Core | Docs |
| CLI adapters | Core | Docs |
| OpenCode | Core | Docs |
| Docs + registration | All of the above | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Core | High | 2-3 hours, mostly emission-marker semantics and binding rules |
| Pi | High | 2-3 hours including the new suite |
| CLI adapters | Med | 2-3 hours across four pairs and four suites |
| OpenCode | Low | About 1 hour |
| Docs + registration | Low | 1-2 hours |
| **Total** | | **8-12 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Baseline captured before the first edit: core suite count and the four adapter suites' counts
- [ ] Worktree provisioned and its branch recorded (no push; local-only by operator instruction)
- [ ] Doc grep re-run immediately before the documentation phase to catch drift since planning

### Rollback Procedure
1. Stop before committing if any suite or the strict validation fails.
2. If already committed, `git revert` the single implementation commit in the worktree.
3. Re-run the core suite, the adapter suites and the classify boundary check to confirm the revert restored the old delivery.
4. No stakeholder notification needed; internal hook contract, no user-facing surface.

### Data Reversal
- **Has data migrations?** No. New gate-state fields are additive and per-session.
- **Reversal procedure**: N/A. A session with the new fields keeps them; a reverted reader ignores unknown keys, and the retention sweep evicts the file as before.
<!-- /ANCHOR:enhanced-rollback -->

---
