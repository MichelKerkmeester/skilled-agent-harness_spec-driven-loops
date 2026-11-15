---
title: "Feature Specification: Phase 7: handoff-gate-exemptions"
description: "A relaunch handoff note is gitignored runtime state, yet the spec gate and the framework gate rules treated its write as spec work. A session with no Gate 3 answer could not hop without an operator prompt, and the repo's OpenCode default model failed provider routing. This phase exempts that path, states the exemption in AGENTS.md and pins the default model."
trigger_phrases:
  - "handoff gate exemptions"
  - "phase 7 handoff gate exemptions"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 7: handoff-gate-exemptions

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-19 |
| **Branch** | `worktrees/142-session-relaunch-loop` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 7 |
| **Predecessor** | 006-deep-review-2-remediation |
| **Successor** | None |
| **Handoff Criteria** | `validate.sh` prints `RESULT: PASSED` for this folder and recursively for the parent, every row in `acceptance-criteria.md` is Met and the run 10 record is in the benchmark reports. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the Session relaunch loop specification. It closes the two framework gaps that phase 006 recorded as G20 and G21, and it pins the OpenCode default model that phase 006 recorded as a limitation.

**Scope Boundary**: The spec-gate exemption for runtime state, the two AGENTS.md sentences that decide whether a turn is spec work, the repo `opencode.json` default model and the live proof on Claude, Pi and OpenCode with no Gate 3 answer. The items that stay out are listed in section 3.

**Dependencies**:
- `../006-deep-review-2-remediation/`, whose live run 5 recorded G20 and G21 in `evidence/live-runs-2026-10-19/sr-pi-run5-pane.txt`.
- The parent `../spec.md`, whose phase map row 7 and binding table this phase updates.

**Deliverables**:
- A spec-gate exemption and a test for it that failed before the fix.
- The Gate 3 and Gate 2 sentences in `AGENTS.md`.
- The default model and agent variant in `opencode.json`.
- The live run 10 evidence and a benchmark run folder for it, `2026-10-19--manual-testing-playbook--session-relaunch-gate-exemptions`.

**Changelog**:
- No changelog folder exists under the parent packet, so this phase refreshes none.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A session that has no Gate 3 answer and reaches its context limit hands off by writing a note under `.skilled/skills/.state/`. In phase 006's Pi live run 5, the session applied the Gate 3 rule, which fires when a turn will write a file, and asked the operator before it wrote the note (`006-deep-review-2-remediation/evidence/live-runs-2026-10-19/sr-pi-run5-pane.txt`, lines 184 to 203). The same session then routed the note through the Gate 2 artifact trigger, and the sk-doc router answered `clarify`, so it asked the operator again (lines 307 to 334). A third problem sat in the spec-gate hook. With enforcement on and a gate open, a Write to the handoff note was denied, which would have made the hop impossible.

### Purpose
A Claude, Pi or OpenCode session with no Gate 3 answer hands off near the context limit and finishes the work in a fresh session without an operator prompt.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A spec-gate exemption for runtime state under `.skilled/skills/.state/`, except a concern's tracked `README.md`.
- A regression test for that exemption, which failed before the fix.
- The Gate 3 "does not fire" clause and the Gate 2 artifact trigger in `AGENTS.md`.
- The default model and the `build` and `plan` agent variant in the repo `opencode.json`.
- A live run 10 on Claude, Pi and OpenCode with no Gate 3 answer, with its evidence folder.
- The benchmark run folder, its index row and the pointers in the three session-relaunch playbooks.
- The phase 7 row in the parent phase map, the parent binding table and the G20 and G21 pointers in phase 006.

### Out of Scope
- `gate-3-classifier.ts`. `classifyPrompt()` returns `no_match` for the relaunch seed and for a read-only prompt, run through tsx during this phase. The classifier does not fire on this path, so it needs no change.
- The sk-doc router. Its `clarify` answer for a runtime-state note is correct, because no doc mode fits the note. The defect was the trigger text that sent the note to the router, and section 4.1 changes that text.
- Codex, Cursor, Devin and Hermes live reruns. The Codex result stays as phase 006 recorded it. The other three were not run in this phase.
- The home copy `~/.claude/CLAUDE.md`. It is a home-config write, so it waits for the operator (see the Known Limitations in `implementation-summary.md`).
- Committing, pushing or merging. The change is uncommitted and drafted for the operator's review (decision D6 in the parent `goal.md`).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs` | Modify | Adds `RUNTIME_STATE_RELATIVE_PATH` (line 71) and the exemption in `isExemptTargetPath` (lines 1573 to 1579) |
| `.skilled/skills/system-spec-kit/runtime/tests/hooks/spec-gate-core.test.mjs` | Modify | Adds the exemption test at line 896 |
| `AGENTS.md` | Modify | The Gate 2 artifact trigger (line 70) and the Gate 3 "does not fire" clause (line 75) |
| `opencode.json` | Modify | The default `model` (line 3), and the `build` and `plan` agents with the same model and variant `max` (lines 6 to 7 and 10 to 11) |
| `.skilled/skills/system-spec-kit/benchmark/reports/2026-10-19--manual-testing-playbook--session-relaunch-gate-exemptions/` | Create | The run 10 record |
| `.skilled/skills/system-spec-kit/benchmark/reports/README.md` | Modify | One index row for the run |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md`, `session-relaunch-pi-opencode.md`, `session-relaunch-command-runtimes.md` | Modify | One pointer each to the run folder |
| `specs/hooks/023-session-relaunch-loop/spec.md` and `goal.md` | Modify | The phase 7 map row, and binding rows for phases 006 and 007 |
| `specs/hooks/023-session-relaunch-loop/006-deep-review-2-remediation/spec.md` and `implementation-summary.md` | Modify | One pointer sentence each for G20 and G21 |
| `specs/hooks/023-session-relaunch-loop/007-handoff-gate-exemptions/` | Create | This folder and its `evidence/live-run10-2026-10-19/` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The spec gate treats a write under `.skilled/skills/.state/` as exempt, which covers gitignored runtime state such as a relaunch handoff note. A concern's `README.md` directly under that folder stays gated, and a `.state` folder nested under another path stays gated. |
| REQ-004 | A live run on Claude, Pi and OpenCode, with no Gate 3 answer in the prompt, completes its hop with zero operator prompts, and each receiving session closes its note. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-002 | `AGENTS.md` states the runtime-state exemption in the Gate 3 "does not fire" clause and in the Gate 2 artifact trigger. |
| REQ-003 | The repo `opencode.json` sets the default model to `llmgateway/deepseek-v4.1-flash` with variant `max` for the `build` and `plan` agents, so a launch without `-m` uses it. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.

### 4.1 Gap register

Each row is one gap that phase 006 recorded and the change that closes it.

| Gap | Observed in a live session | Change | Evidence |
|-----|----------------------------|--------|----------|
| G20 | A read-only Pi session with no Gate 3 answer asked the Gate 3 question before it wrote the handoff note | The Gate 3 "does not fire" clause names gitignored runtime state (`AGENTS.md` line 75) | Phase 006 pane lines 184 to 203. Run 10 Pi pane: no `ask_user_question` call |
| G21 | The Gate 2 artifact trigger sent the handoff note to sk-doc, which answered `clarify` | The artifact trigger excludes runtime state that no skill owns (`AGENTS.md` line 70) | Phase 006 pane lines 307 to 334. Run 10 Pi pane: no `compiled-route` call |
| OpenCode default | The default model failed with "Direct provider routing is not available" | `opencode.json` pins `llmgateway/deepseek-v4.1-flash` with variant `max` (lines 3, 6 to 7 and 10 to 11) | Stored message rows carry `modelID` `deepseek-v4.1-flash` and `variant` `max`, recorded during this phase |

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The run 10 record shows zero operator prompts on Claude, Pi and OpenCode, and a note that reads `status: done` for each hop.
- **SC-002**: `spec-gate-core.test.mjs` finishes with `fail 0` and exit 0, and it includes the exemption test.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | LLM Gateway serving `llmgateway/deepseek-v4.1-flash` | If the gateway stops serving the model, an OpenCode hop cannot run | The model is pinned in the repo `opencode.json`, so the operator changes one file to switch models |
| Risk | The exemption leaves `.state` writes ungated | Low | The exemption is path-scoped. Concern READMEs and nested `.state` paths stay gated, and the test holds both. `.gitignore` line 132 keeps the handoff notes out of commits |
| Risk | The home `~/.claude/CLAUDE.md` copy lacks the exemption, and Claude loads both files | Med | The home copy waits for the operator. Until then, the repo file carries the rule |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Not applicable. No latency target was set for this phase, and none was measured.
- **NFR-P02**: Not applicable. No throughput target was set for this phase.

### Security
- **NFR-S01**: The exemption applies only after the path is resolved through real symlinks and `..` segments, so a symlink or a relative path cannot pass as runtime state (`spec-gate-core.mjs`, `isExemptTargetPath`).
- **NFR-S02**: Runtime state is gitignored (`.gitignore` line 132), so a handoff note is never committed by this change.

### Reliability
- **NFR-R01**: Not applicable. The change adds no service and no uptime target.
- **NFR-R02**: Run 10 recorded zero operator prompts across three runtimes, and three of three hops relaunched.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: an empty or blank path is exempt, as it was before this phase. The change does not alter that behavior.
- Maximum length: Not applicable to the path rule.
- Invalid format: a `.state` folder nested under another path, such as `src/.state/cache.json`, stays gated, and the test denies it.

### Error Scenarios
- External service failure: if the LLM Gateway is down, an OpenCode hop fails at the provider. See the Risks table.
- Network timeout: Not applicable to this change. The killer timeout belongs to phase 006.
- Concurrent access: not changed by this phase.

### State Transitions
- Partial completion: a handoff note stays `pending` until a receiving session claims it, and it reads `done` after `complete` runs (the status lines in the run 10 notes).
- Session expiry: not changed by this phase.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | Four code and config files, one run folder, three playbook pointers and the parent and 006 pointers |
| Risk | 12/25 | The change sits on the spec-gate enforcement path and the framework gate rules that every runtime reads |
| Research | 8/20 | Three causes found in live runs, each checked against the code or a live pane |
| **Total** | **30/70** | **Level 2**. These scores are the phase author's judgment. |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should the home `~/.claude/CLAUDE.md` copy receive the same two sentences? The copy already differs from `AGENTS.md`, and it lacks the exemption. This is an operator decision.
- When is the change committed? The operator reviews the uncommitted worktree first (decision D6 in the parent `goal.md`).
<!-- /ANCHOR:questions -->

---

