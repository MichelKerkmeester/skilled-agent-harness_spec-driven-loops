---
title: "Implementation Plan: Phase 7: handoff-gate-exemptions"
description: "Exempt the runtime-state handoff note from the spec gate, state that exemption in the two AGENTS.md gate sentences, pin the OpenCode default model, then prove the hop live on Claude, Pi and OpenCode with no Gate 3 answer."
trigger_phrases:
  - "handoff gate exemptions plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 7: handoff-gate-exemptions

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js ES modules (`.mjs`), JSON and Markdown |
| **Framework** | None. The spec-gate hook is a plain module in `runtime/hooks/lib/spec-gate/` |
| **Storage** | Gitignored runtime state under `.skilled/skills/.state/`, plus the repo `opencode.json` |
| **Testing** | `node --test` on `spec-gate-core.test.mjs`, live tmux runs on Claude, Pi and OpenCode through `skilled-loop` and the document validators |

### Overview
The phase makes the spec gate treat one path as runtime state, states that rule in the two AGENTS.md sentences that decide whether a turn is spec work, and pins the OpenCode default model. The approach adds one path-class exemption after the existing exemptions, with a test that fails before the fix. A live run then proves the hop on each runtime with no Gate 3 answer in the prompt.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (the spec-gate test file ends with `fail 0`)
- [x] Docs updated (spec, plan, tasks, the parent and the 006 pointers)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A path-class exemption inside the spec-gate core, plus matching wording in the framework gate rules. The change extends the existing exemption function and adds no new module.

### Key Components
- **`isExemptTargetPath`** (`spec-gate-core.mjs`, line 1546): decides whether a write target is exempt. The runtime-state rule sits after the `.git` rule and before the `node_modules` rule.
- **`RUNTIME_STATE_RELATIVE_PATH`** (`spec-gate-core.mjs`, line 71): one constant for the runtime-state folder. `GATE_STATE_DIR_RELATIVE_PATH` (line 72) derives from it, so the gate state folder and the exemption share one source.
- **AGENTS.md Gate 2 and Gate 3** (lines 70 and 75): the wording a session reads before it decides whether to route a write to sk-doc or to ask the Gate 3 question.
- **`opencode.json`**: the default model and the `variant` for the `build` and `plan` agents.
- **Run 10 evidence**: the proof, in `evidence/live-run10-2026-10-19/`.

### Data Flow
A session writes its handoff note with the Write tool. The PreToolUse hook calls `evaluateMutation`, which calls `isExemptTargetPath`. A note under `.skilled/skills/.state/` returns `allow`, even with enforcement on and a gate open. Then `prepare` records the note, the killer sends SIGTERM and the wrapper relaunches the session with the claim seed. The Gate 2 and Gate 3 sentences are read before the write, so a session that reads them does not route the note to sk-doc and does not ask the Gate 3 question.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase fixes a gate defect found in live runs, so the surfaces are listed here.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `isExemptTargetPath` (`spec-gate-core.mjs`, line 1546) | Exempts the specs tree, `.git`, `node_modules` and `dist`, and every path outside the project | Update: add the runtime-state rule | Test at `spec-gate-core.test.mjs` line 896 |
| `RUNTIME_STATE_RELATIVE_PATH` and `GATE_STATE_DIR_RELATIVE_PATH` (lines 71 and 72) | The gate state folder is `.skilled/skills/.state/spec-gate` | Update: the second derives from the new constant, and its value does not change | Inventory below |
| AGENTS.md Gate 2 artifact trigger (line 70) and Gate 3 clause (line 75) | Route `.md` writes to sk-doc, and fire Gate 3 for file writes | Update: name runtime state that no skill owns, and exclude it from Gate 3 | Run 10 Pi pane: no `compiled-route` call and no operator question |
| `gate-3-classifier.ts`, `classifyPrompt()` | Gate 3 vocabulary | Unchanged. The relaunch seed and a read-only prompt both return `no_match` | tsx run during this phase |
| sk-doc router (`compiled-route.cjs --hub sk-doc`) | Resolves a doc mode | Unchanged. `clarify` is correct for a note no mode fits | The trigger text is what changes |
| `opencode.json` default model | The MiMo default failed provider routing | Update: pin the model and the `max` variant | Stored message rows (`modelID` and `variant`) |

Required inventories:
- Same-class producers: `rg -n "\.skilled/skills/\.state|RUNTIME_STATE_RELATIVE_PATH|GATE_STATE_DIR" .skilled/skills/system-spec-kit/runtime .skilled/hooks`. The result is recorded in `implementation-summary.md`.
- Consumers of the changed symbols: `rg -n "isExemptTargetPath" .skilled/skills/system-spec-kit/runtime`. The result is recorded in `implementation-summary.md`.
- Matrix axes: enforcement (on, off) by gate state (open, closed) by path class (handoff note, concern README, nested `.state` path, spec folder).
- Algorithm invariant: a path is exempt only when, after real-path and `..` resolution, it sits under `<project>/.skilled/skills/.state/` and is not `<concern>/README.md` directly under that folder. Adversarial cases in the test: the concern README (denied) and a nested `src/.state/cache.json` (denied).
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The runtime-state exemption, its concern README case and its nested `.state` case | `node --test` on `.skilled/skills/system-spec-kit/runtime/tests/hooks/spec-gate-core.test.mjs` |
| Classifier check | Whether Gate 3 fires on the relaunch seed and on a read-only prompt | tsx run of `classifyPrompt()` in `.skilled/skills/system-spec-kit/shared/gate-3-classifier.ts` |
| Live | A hop on Claude, Pi and OpenCode with no Gate 3 answer in the prompt | `skilled-loop` inside tmux, clean environment, run 10 |
| Document | Spec docs, the run folder and the three playbook pages | `validate.sh --strict`, `validate_document.py`, `hvr_scan.py` and the playbook package validator |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| LLM Gateway serving `llmgateway/deepseek-v4.1-flash` | External | Green. The TUI footer and the stored rows show the model in use during this phase | An OpenCode hop cannot run |
| `skilled-loop claude` relaunch | Internal | Green. Run 10 printed `relaunch ... reason=ready` | The Claude proof cannot run |
| Pi with `openai/gpt-6-luna` | External | Green. The run 10 Pi pane footer shows `gpt-6-luna [openai]` | The Pi proof cannot run |
| Parent `spec.md` and `goal.md` | Internal | Green once the phase 7 row and the binding rows are present | Recursive validation of the parent fails |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a spec-gate change that exempts a source path, a Gate 2 or Gate 3 sentence that lets a session skip Gate 3 for real spec work, or a gateway that rejects the pinned OpenCode model.
- **Procedure**: restore the pre-phase text by hand in the four changed files: the constant and the exemption block in `spec-gate-core.mjs`, the two sentences in `AGENTS.md`, and the model keys in `opencode.json`. `git diff` on those files shows the pre-phase text. The change is uncommitted, so there is no commit to revert, and nothing else is deleted.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

The steps run in one order. Each step waits for the one before it.

| Step | Depends On | Blocks |
|------|------------|--------|
| Red test (T004) | Phase 006 record of G20 and G21 | Fix |
| Fix and AGENTS.md wording (T005 to T006) | Red test | Live run |
| `opencode.json` pin (T007) | None, parallel with the fix | Live run |
| Live run 10 (T008) | Fix, wording and pin | Evidence and run folder |
| Run folder, parent and 006 pointers, validation (T009 to T013) | Live run 10 | Closure |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

Effort was not estimated before the work started. The phase was scoped on 2026-10-19 after the operator's decisions, and the table records complexity only.

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Not estimated |
| Core Implementation | Low | Not estimated |
| Verification | Med | Not estimated |
| **Total** | | **Not estimated** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- N/A: no data changes, so no backup is needed.
- N/A: no feature flag was added. The exemption applies to the path without a switch.
- N/A: no monitoring was added, because nothing is deployed. The change is a worktree edit.

### Rollback Procedure
1. Restore the pre-phase text by hand in `spec-gate-core.mjs`, `AGENTS.md` and `opencode.json`, as section 7 describes.
2. Run `node --test .skilled/skills/system-spec-kit/runtime/tests/hooks/spec-gate-core.test.mjs` and confirm the result matches the restored code.
3. Confirm the rollback with `rg -n "RUNTIME_STATE_RELATIVE_PATH" .skilled/skills/system-spec-kit/runtime/hooks`. The command should return nothing once the constant is removed.
4. Tell the operator, who owns the home `~/.claude/CLAUDE.md` copy.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A. The handoff notes are gitignored runtime state, and they can stay on disk.
<!-- /ANCHOR:enhanced-rollback -->

---

