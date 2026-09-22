---
title: "Feature Specification: Phase 49: Gate-3 delivery residue"
description: "Close the residue left by phase 048: Hermes, the seventh runtime, lost Gate-3 delivery when the Devin classify adapter went silent, and several documentation surfaces still describe turn-time injection."
trigger_phrases:
  - "gate-3 delivery residue"
  - "hermes spec gate"
  - "mutation-time delivery"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 49: Gate-3 delivery residue

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
| **Branch** | `worktrees/058-gate-3-mutation-time-delivery` (local only, never pushed) |
| **Parent Spec** | ../spec.md |
| **Phase** | 49 of 49 |
| **Predecessor** | 048-gate-3-mutation-time-delivery |
| **Successor** | None |
| **Handoff Criteria** | Every runtime that owns a Gate-3 delivery path delivers the question once per session through its own channel (Hermes included); no documentation surface still describes turn-time injection; the two Pi spec-gate extensions pass a type check; the external sweep and the cli-codex review are reconciled; both strict validations and the completion gate pass. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 49** of the Gate-3 delivery residue: Hermes runtime fix and stale surfaces specification.

**Scope Boundary**: Only the Gate-3 delivery residue of phase 048 may change. The shared `AGENTS.md` Gate-3 prose stays untouched (operator decision), the spec-gate core's delivery semantics stay as 048 shipped them, and pre-existing drift outside the Gate-3 surface (cli-jev benchmark scripts, spec quarantine copies) is reported, not repaired.

**Dependencies**:
- Phase 048 (`8c63174469`) — the mutation-time delivery contract this phase completes.
- `.hermes/plugins/repo-guards/__init__.py` — the seventh runtime's only hook host.
- `.skilled/skills/system-spec-kit/runtime/hooks/devin/spec-gate-enforce.mjs` — the adapter Hermes reuses as its execution path.

**Deliverables**:
- Hermes mutation-time delivery through the repo-guards plugin, with its dead prompt-time question read retired and its tests rewritten.
- Corrected stale surfaces across documentation, feature catalog and runtime references.
- A dedicated TypeScript config that type-checks the two Pi spec-gate extensions.
- A cli-devin surface sweep report and a cli-codex (Luna) review report, both reconciled into the packet scratch directory.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 048 removed turn-time Gate-3 injection and moved delivery to the first mutation for six runtimes. Hermes — the seventh runtime, whose `repo-guards` plugin reads the question from the Devin classify adapter's `additionalContext` — was missed: that adapter is now silent, so the read always yields nothing, and Hermes has no mutation-time gate path at all. The gate opens and the question is delivered nowhere. Alongside it, several documentation and reference surfaces still describe the pre-048 behavior, the two Pi spec-gate extensions sit outside every type check, and the suppression environment variable's documentation still describes its retired opt-in semantics.

### Purpose
Every runtime that owns a Gate-3 delivery path — Hermes included — delivers the spec-folder question exactly once, at the first non-exempt mutation, and no surface describes behavior the code no longer has.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Hermes mutation-time delivery in `.hermes/plugins/repo-guards/__init__.py` (`pre_tool_call` runs the shared Devin enforce adapter; advise stages the notice once, `SYSTEM_SPEC_GATE_ENFORCE=1` blocks), retirement of the dead prompt-time question read, and the plugin's tests, `SYNC.md`, `hook-contract.md` and HERMES-028 playbook page.
- Correction of verified stale surfaces: `codex-hook-parity.md` step 2, the `cursor-hooks-and-spec-gate` feature-catalog page, `runtime/ENV-REFERENCE.md`, `.env.example`, `.pi/extensions/README.md`, the `prompt-advisor.ts` comment, and plugin README rows that misstate classify behavior.
- Any additional surface confirmed by the cli-devin sweep, after reading the cited line.
- A dedicated TypeScript config type-checking `.pi/extensions/spec-gate-classify.ts` and `.pi/extensions/spec-gate-enforce.ts`.
- External verification: the cli-devin sweep and the cli-codex (gpt-5.6-luna, max, fast) review, with every HIGH finding fixed or rebutted.

### Out of Scope
- The shared `AGENTS.md` Gate-3 prose — the operator decided the static contract stays unchanged.
- The spec-gate core's shipped delivery semantics and the six runtimes phase 048 completed — verified green, not revisited.
- `dispatch-preflight-lint.ts`'s `SPEC_GATE_MARKER` — it still strips a pasted question from a dispatch prompt, which its own test pins as authorization hygiene.
- Pre-existing drift outside the Gate-3 surface (cli-jev benchmark raw scripts, spec quarantine copies) — recorded as a known boundary.
- The parent tree's own recursive validation fails on `030-spec-kit-simplification-research`, whose `goal.md` durable slice is 6498 characters against a 4000-character ceiling. The phase measured it from the pre-change tree, where it fails identically, so it is recorded rather than repaired: the goal file belongs to another phase and trimming another packet's goal state is outside this phase's scope.
- Any push to a remote — the branch stays local by standing operator constraint.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.hermes/plugins/repo-guards/__init__.py` | Modify | Mutation-time delivery in `pre_tool_call`; retire the prompt-time question read |
| `.hermes/plugins/repo-guards/tests/test_repo_guards.py` | Modify | Rewrite the two gate tests to the mutation-time contract |
| `.hermes/SYNC.md` | Modify | Hook-map rows for `pre_llm_call` and `pre_tool_call` |
| `.skilled/skills/cli-external-orchestration/cli-hermes/references/hook-contract.md` | Modify | Hook map rows for the gate path |
| `.skilled/skills/cli-external-orchestration/cli-hermes/manual-testing-playbook/goal-hook/advisor-brief-and-gate-delivery.md` | Rename + Modify | Scenario contract and recorded result move to mutation-time delivery |
| `.skilled/skills/cli-external-orchestration/cli-hermes/manual-testing-playbook/manual-testing-playbook.md` | Modify | Both index rows for the renamed scenario |
| `.skilled/skills/cli-external-orchestration/manual-testing-playbook/plugins-and-hooks/codex-hook-parity.md` | Modify | Classify is silent; delivery moves to the first mutation |
| `.skilled/skills/cli-external-orchestration/feature-catalog/cursor-hooks-and-spec-gate/cursor-hooks-and-spec-gate.md` | Modify | Classify silence and the persisted-marker suppression contract |
| `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` | Modify | `SYSTEM_SPEC_GATE_3_DELIVERY_SUPPRESSION` semantics |
| `.env.example` | Modify | Suppression variable description |
| `.skilled/hooks/hook-flags.env.example` | None | Checked against the core: it never mentions the suppression variable, so nothing was stale |
| `.skilled/skills/cli-external-orchestration/cli-codex/references/hook-contract.md` | Modify | Classify row wording, when stale |
| `.skilled/plugins/README.md` | None | Checked: its classify rows describe the hook that runs, and the per-turn injection row still holds because the OpenCode plugin relays the deferral there |
| `.pi/extensions/README.md` | Modify | Tree comment and handler rows for the classify extension |
| `.skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts` | Modify | Comment describing the spec-gate classify extension |
| `tsconfig.pi.json` (repo root) | Create | Type-check the two Pi spec-gate extensions |
| `.pi/types/pi-coding-agent.d.ts`, `.pi/types/node-globals.d.ts` | Create | Ambient shims the check needs, since the repo root resolves no package types |
| `.hermes/plugins/repo-guards/plugin.yaml` | Modify | Manifest description that still named a prompt-time question |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/spec-mutation-gate-enforce.md` | Modify | Classify emits nothing; corpus count |
| `.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs` | Modify | Suppression docstring; the concurrent-delivery window |
| `.skilled/skills/system-spec-kit/runtime/hooks/devin/README.md`, `.skilled/skills/cli-external-orchestration/cli-devin/manual-testing-playbook/goal-hook/goal-hook.md` | Modify | Devin surfaces that still claimed classify delivered context |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modify | Comment explaining why `SYSTEM_SPEC_GATE_DISABLED=1` accompanies the child env |
| `.skilled/skills/.state/spec-gate/README.md`, `.skilled/skills/system-skill-advisor/runtime/lib/shadow/README.md` | Modify | State-field table and the default-on suppression naming note |
| `.skilled/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook/hooks/confirmed-non-delivery-documentation.md`, `.skilled/skills/cli-external-orchestration/cli-hermes/feature-catalog/runtime-surface/repo-guards-project-plugin.md` | Modify | Cursor's real boundary; the Hermes catalog rows |
| `specs/system-speckit/033-system-speckit-v4/048-gate-3-mutation-time-delivery/implementation-summary.md` | Modify | Phase 048's Cursor claim corrected against the adapter's own test |
| `specs/system-speckit/033-system-speckit-v4/049-gate-3-delivery-residue/scratch/**` | Create | Sweep and review reports |
| `specs/system-speckit/033-system-speckit-v4/spec.md`, `timeline.md` | Modify | Phase-map row, handoff row, timeline milestone |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A Hermes session delivers the Gate-3 notice at its first non-exempt write-capable tool call and only once per session: `pre_tool_call` evaluates the shared gate, an advise stages the notice for that call's result, and `SYSTEM_SPEC_GATE_ENFORCE=1` blocks the call with the shared deny reason. |
| REQ-002 | No Hermes surface reads the Gate-3 question from a silent classify path: the prompt-time question read is retired, the advisor brief keeps its behavior, and an orchestrated leaf (`SYSTEM_SPEC_GATE_DISABLED=1` plus `AI_SESSION_CHILD=1`) still never receives a gate notice. |
| REQ-003 | No documentation, feature-catalog or runtime-reference surface still describes turn-time Gate-3 injection: the verified stale surfaces are corrected to classify-silent plus once-per-mutation delivery, and every additional surface the external sweep confirms is corrected or rebutted with the line that proves it current. |
| REQ-004 | The two Pi spec-gate extensions (`hooks/pi/spec-gate-classify.ts`, `hooks/pi/spec-gate-enforce.ts`) are covered by a dedicated TypeScript config whose check exits 0. |
| REQ-005 | External verification is reconciled: the cli-devin sweep report and the cli-codex Luna review land in the packet scratch directory, and every HIGH finding is either fixed or answered with evidence in the packet. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | Code writes route through `sk-code` with the `sk-code-opencode` surface checklists applied, no code comment carries an ephemeral id or spec path, and the sk-code-opencode drift guards are re-run with zero findings naming a touched file. |
| REQ-007 | The packet closes green: tasks.md checklist items tagged P0/P1/P2 with evidence markers, acceptance-criteria rows carrying `file:line` citations, the parent registers phase 049, derived metadata is regenerated after the last document edit, and both strict validations plus the completion gate pass. |
| REQ-008 | Existing boundaries are unchanged: disabled sessions, child sessions, malformed payloads, unresolvable roots and fail-open paths keep today's decisions; the shared `AGENTS.md` prose is untouched; the commit stays local and is never pushed. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The Hermes plugin's test suite proves first-mutation delivery once, second-mutation silence, enforce-on denial and leaf exemption, with the full suite green.
- **SC-002**: The Hermes scenario page, its index row, `SYNC.md` and `hook-contract.md` describe mutation-time delivery, and every reconciled sweep finding is resolved.
- **SC-003**: `.skilled/skills/system-spec-kit/node_modules/.bin/tsc --noEmit -p tsconfig.pi.json` exits 0 (the path-qualified binary, since the repo root has no TypeScript install and `npx` cannot resolve one offline), and the drift-guard output names no touched file.
- **SC-004**: The full system-spec-kit root vitest lane and every Gate-3 suite pass from the frozen state, with real counts recorded as evidence.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Hermes `pre_tool_call` result shape and advisory staging | The notice cannot ride a result the plugin does not already use | Mirror the existing advisory staging (`git-preflight`, `mcp-route-guard`, `sk-vision`) and pin it in the plugin's tests |
| Dependency | Devin CLI OAuth and Codex OAuth | An external dispatch fails mid-round-trip | Auth pre-flight before each dispatch; record the exact failure instead of substituting a model |
| Risk | Shared `tsconfig` gains errors from other Pi extensions | The new type gate cannot go green | Scope the config to the two spec-gate extensions; widen only if the wider include stays green |
| Risk | Sweep findings pull in unrelated drift | Scope creep | Fix only Gate-3-delivery residue; record the rest as a known boundary |
| Risk | `devin -p --permission-mode dangerous` writes into the tree | Unintended edits | Explicit read-only instruction in the prompt, `AI_SESSION_CHILD=1`, captured PID, and a `git status --porcelain` check after the dispatch |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The Hermes gate step adds no new process spawn beyond the shared enforce adapter already used by the CLI runtimes, and stays inside the plugin's existing core timeout.
- **NFR-P02**: A mutation with the gate already delivered performs no state write and no extra adapter spawn.

### Security
- **NFR-S01**: The plugin keeps its fail-open discipline: a missing session id, a malformed payload, an adapter failure or an unexpected result shape never blocks an unrelated tool call.
- **NFR-S02**: No secret, credential or session content leaves the machine through the new paths; the plugin reuses the shared core's existing state directory.

### Reliability
- **NFR-R01**: Losing session state costs at most one extra ask; it never loses a delivered enforcement decision (`SYSTEM_SPEC_GATE_ENFORCE=1` keeps denying).
- **NFR-R02**: The Hermes test suite runs offline and deterministically, with no live model call.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty session id: the plugin skips the gate step rather than opening state under a nameless record.
- Maximum payload: the existing payload parse stays fail-open.
- Invalid format: the adapter's own parse failure leaves the call untouched.

### Error Scenarios
- External service failure: the enforce adapter's failure leaves the tool call untouched (fail-open).
- Network timeout: the plugin's core timeout applies as it does today.
- Concurrent access: gate state is per session key, the same as the six 048 runtimes.

### State Transitions
- Partial completion: a delivered marker survives per-call process boundaries because it is persisted in session state.
- Session expiry: state eviction means a re-opened gate may deliver once more, the intended fail-open direction.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | One runtime plugin, its tests, four doc surfaces plus corrected references, one new TypeScript config |
| Risk | 9/25 | Delivery semantics are shared; the plugin keeps fail-open and the core is untouched |
| Research | 8/20 | The sweep and review are dispatched, but the affected surface is already enumerated |
| **Total** | **31/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
