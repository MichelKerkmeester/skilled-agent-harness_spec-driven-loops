---
title: "Feature Specification: Phase 24: vibe-hook-review-2-remediation"
description: "The second deep review of the Vibe hooks and plugins returned CONDITIONAL with one verified P1: Vibe names a background shell command process.start in its payload, the guards' tool-name map only knew process_start, so every shell guard allowed a background command. This phase maps that name, fixes the nineteen verified P2 findings and records a disposition for all twenty-six."
trigger_phrases:
  - "vibe hook review 2 remediation"
  - "phase 24 vibe hook review 2 remediation"
  - "vibe process.start shell guard"
  - "vibe background shell guard bypass"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 24: vibe-hook-review-2-remediation

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-16 |
| **Branch** | `worktrees/383-mistral-vibe-runtime` |
| **Parent Spec** | ../spec.md |
| **Phase** | 24 of 24 |
| **Predecessor** | 023-vibe-review-remediation |
| **Successor** | None |
| **Handoff Criteria** | Every verified finding is fixed with a test or a doc line, every finding V01 to V26 has a disposition, and the live `process.start` scenario VIB-HK-029 has passed |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 24** of the Mistral Vibe runtime mode build specification.

**Scope Boundary**: The findings `../review/review-report.md` verified as CONFIRMED or severity-changed: V01, V03, V05 to V09, V11 to V16, V18, V19, V21 to V23, V25 and V26. The false positives (V02, V04, V17, V20, V24) and the prior-dispositioned V10 change nothing. No hook gains behavior a finding does not require, and no shared core used by another runtime changes.

**Dependencies**:
- The second deep review in `../review/`: the finding ids, their evidence and the decisions the orchestrator recorded for each.
- Phase 023 (`023-vibe-review-remediation`): the dispositions this review treated as its exclusion list.
- The installed Vibe 3.1.2 source under `~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/`, which settles the payload tool name and the default hook timeout.

**Deliverables**:
- `process.start` mapped to `bash` in the guards' tool-name map, with a payload test per shell guard.
- The binding, cwd, budget, nudge and renderer fixes, each with a unit test that fails on the old file.
- The guard reference and the session-lifecycle README corrected.
- A disposition for every finding, recorded in `implementation-summary.md`.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Vibe 3.1.2 puts `"tool_name": "process.start"` in the payload of a background shell command, while the repo guards' tool-name map keyed only `process_start`, the alias a `match` selector accepts. A background command therefore reached env-secret-guard, git-message-gate, dispatch-preflight and spec-gate as an unknown tool, and each allowed it. The review also found nineteen smaller defects: a goal slice injected into subagents, a strict binding on tools its guard ignores, writers that create folders a payload names, a spawn budget equal to the work it bounds, an untested entry point and doc drift.

### Purpose
A background shell command is judged by every Vibe shell guard exactly as a foreground one is, and the Vibe hooks and their reference match what Vibe 3.1.2 sends and what the code does.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ node --test .vibe/plugins/repo-guards/tests/    (new process.start cases, before the map change)
✖ a dispatch its hard rules refuse is denied in the foreground and in the background (70.772541ms)
  AssertionError [ERR_ASSERTION]: process.start
✖ a background shell command that reads a dotenv file is denied like a foreground one (61.186083ms)
  AssertionError [ERR_ASSERTION]: process.start
✖ a non-conforming commit message is refused in the foreground and in the background (92.016125ms)
  AssertionError [ERR_ASSERTION]: process.start
✖ a background shell command is annotated like a foreground one while the gate is open (95.275375ms)
  AssertionError [ERR_ASSERTION]: process.start
ℹ tests 21
ℹ pass 17
ℹ fail 4
```
Each case checks `file_system.bash` first, so the four failures are the `process.start` half alone.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Map `process.start` to `bash` in `lib/hook-io.mjs` and prove the deny or the note for each shell guard with a `process.start` payload test.
- Keep the compaction part out of subagents, narrow the overlay-guard binding, raise the startup-guard budget and make a throw under the nudge claim deliver nothing.
- Resolve every Vibe writer and its reader through one cwd rule, and write only under a payload folder that already exists.
- Load the OpenCode session-cleanup module inside the fail-open wrapper, and check every line of a rendered command value.
- Make session-start importable, share one stdin reader, test deep-loop-guard and thread the injected env through the advisor receipts and the two kill-switch calls.
- Correct `guards-and-hooks.md`, `tool-names.md` and the session-lifecycle README.

### Out of Scope
- V02, V04, V17, V20 and V24 - the synthesis refuted each against the installed Vibe source or a test (`../review/review-report.md` section 3, False positives).
- V10, the compaction part's missing kill switch - 023 dispositioned it as documented by design, and that disposition holds.
- A dedupe of the spec-gate operator note - the decision is to keep the repeat and record why; `observe()` would stop the model from ever getting the question.
- A shared context-reply writer - none exists yet, and the decision limits V15 to the stdin reader.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.vibe/plugins/repo-guards/lib/hook-io.mjs` | Modify | `process.start` in the tool-name map; re-export the payload-directory rules |
| `.skilled/hooks/shared/payload-dir.mjs` | Create | `sessionDirFor` and `existingDirectory` inside the hooks tree, so the adapters there import nothing from `.vibe/` |
| `.vibe/plugins/repo-guards/tests/env-secret-guard.test.mjs`, `spec-gate.test.mjs` | Modify | `process.start` payload cases |
| `.vibe/plugins/repo-guards/tests/git-message-gate.test.mjs`, `dispatch-preflight.test.mjs`, `deep-loop-guard.test.mjs` | Create | Payload tests for the three guards with none |
| `.vibe/plugins/repo-guards/spec-gate.mjs` | Modify | Comment: why `observe()` is not called and that the note repeats |
| `.vibe/hooks.toml`, `.vibe/plugins/repo-guards/fixtures/overlay-guard/hooks.toml` | Modify | overlay-guard on the write tools only; `process_write` in the four command-guard matches |
| `.vibe/plugins/repo-guards/dist-freshness.mjs`, `dispatch-preflight.mjs` | Modify | Shared `sessionDirFor` |
| `.vibe/plugins/repo-guards/session-cleanup.mjs` | Modify | Dynamic import inside `main` |
| `.vibe/plugins/repo-guards/render-home-hooks.cjs` and its test | Modify | Whole command values, multi-line cases |
| `.skilled/hooks/session-lifecycle/vibe/compaction-context.mjs` and its test | Modify | Subagent skip in the post-tool part |
| `.skilled/hooks/session-lifecycle/vibe/session-start.mjs` | Modify | Entry gate, exported parts, 9000 ms budget, shared reader |
| `.skilled/hooks/session-lifecycle/vibe/session-start.test.mjs` | Create | Session-prime, startup-guard and dist part tests |
| `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs`, `turn-end.mjs`, `compaction-post-tool.mjs` | Modify | Shared reader; the turn-start readers use `sessionDirFor` |
| `.skilled/hooks/decision-capture/vibe/ask-capture-post-tool.mjs` | Modify | Queue writer uses `sessionDirFor` |
| `.skilled/skills/system-spec-kit/runtime/hooks/vibe/completion-evidence-post-agent.cjs` | Modify | Existing-directory rule, checkout fallback, env to the kill switch |
| `.skilled/hooks/ask-surface-guard/vibe/ask-surface-post-agent.mjs` | Modify | Existing-directory rule for the fire log, env to the kill switch |
| `.skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs` | Modify | Receipt folder from the injected env |
| `.skilled/hooks/session-handover/vibe/handover-parts.mjs` | Modify | Quiet on a throw under the nudge claim |
| `.skilled/hooks/session-lifecycle/vibe/turn-end.test.mjs`, `turn-start.test.mjs`, `.skilled/hooks/session-handover/tests/vibe-adapters.test.cjs` | Modify | Cases for the writers, the receipts and the nudge catch |
| `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/guards-and-hooks.md`, `.vibe/plugins/repo-guards/fixtures/wire-format/tool-names.md`, `.skilled/hooks/session-lifecycle/vibe/README.md` | Modify | Doc drift |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A `process.start` payload gets the same verdict as `file_system.bash` from env-secret-guard (deny on a dotenv read), git-message-gate (deny on a non-conforming commit), dispatch-preflight (deny on a refused dispatch) and spec-gate (the operator note while the gate is open), and the docs spell the payload name `process.start` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-002 | The spec-gate advise branch states why it does not call `observe()` and that its note repeats until a model-facing delivery writes the marker |
| REQ-003 | The compaction post-tool part returns nothing in a subagent, overlay-guard binds only `write_file` and `edit`, the startup-guard spawn outlasts the inner 8250 ms, and a throw under the nudge claim delivers nothing |
| REQ-004 | Every Vibe writer and its reader resolve the payload cwd through one rule, and the completion and ask-surface writers create nothing under a folder that does not exist |
| REQ-005 | A session-cleanup load failure exits 0 with one stderr line, and the home renderer refuses a substitution on any line of a command value |
| REQ-006 | `guards-and-hooks.md` and the session-lifecycle README state the strict `post_tool` binding, the reply fields, the unported tool registrations and the goal switch |
| REQ-007 | session-start's parts are testable without a subprocess, the four lifecycle entry points share one stdin reader, deep-loop-guard has a payload test, and the advisor and the two adapters read the injected env |
| REQ-008 | In a live Vibe session, a dotenv read started through the background process tool is denied by env-secret-guard and no value reaches the journal |
| REQ-009 | Input typed into a running background process with `process.write` is judged by the command guards as the shell command it becomes, in unit tests and in a live Vibe session |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node --test .vibe/plugins/repo-guards/tests/ .skilled/hooks/goal/vibe/goal-vibe.test.mjs` prints `fail 0`, and the four `process.start` cases fail on the old map.
- **SC-002**: The session-lifecycle, decision-capture, session-handover and Vibe reader suites print `fail 0` with the new cases included.
- **SC-003**: `validate.sh` on this folder with `--strict` prints `RESULT: PASSED`.
- **SC-004**: The live scenario VIB-HK-029 shows a background `cat` of a dotenv file denied in a real Vibe session.
- **SC-005**: The live scenario VIB-HK-030 shows a dotenv read typed into a clean background shell denied in a real Vibe session.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The orchestrator's live Vibe run for VIB-HK-029 | The payload name rests on the installed source until a live run captures it | The unit tests use the source's spelling; the live task stays open until the run lands |
| Risk | The shared stdin reader settles after 3 s with what arrived, where the local copies waited for end of input | Low | Vibe writes the payload and closes stdin at spawn; a partial payload fails JSON parsing, and every entry point fails open on that |
| Risk | The startup-guard budget grows the session-start worst case | Low | About 2.8 + 9 + 5 s run in series, inside the 60 s default `vibe/core/hooks/models.py:65` gives a hook with no timeout |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: A shell call spawns one strict hook fewer, because overlay-guard no longer matches `bash` or `process_start`.

### Security
- **NFR-S01**: No Vibe writer creates a directory under a payload cwd that is relative or does not exist.
- **NFR-S02**: A background shell command gets every deny a foreground one gets.

### Reliability
- **NFR-R01**: Every changed hook still fails open: a load error, a throw or a malformed payload exits 0.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a payload with no cwd resolves to the checkout on both sides of each writer and reader pair.
- Maximum input: a multi-line command value is checked to its closing delimiter, so a substitution on any line is refused.
- Failure path: a missing OpenCode session-cleanup module exits 0 with `session-cleanup: Cannot find module ...` on stderr.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | About 30 files: thirteen hook modules, eleven test files, three docs and two bindings |
| Risk | 10/25 | A guard bypass closed in a shared map; every change fails open |
| Research | 4/20 | The review traced each finding and the decisions were made before work started |
| **Total** | **28/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The spec-gate note repeat is decided: keep it and record why in the code comment.
<!-- /ANCHOR:questions -->

---
