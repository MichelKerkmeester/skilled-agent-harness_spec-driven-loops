---
title: "Session Handover: Cursor session-start Gate-3 prebinding"
description: "Detailed transfer package for independently analyzing the completed Cursor startup prebind and shared autonomous-child Gate-3 no-op behavior."
trigger_phrases:
  - "Cursor Gate-3 handover"
  - "analyze Cursor prebind"
  - "review autonomous child no-op"
importance_tier: "important"
contextType: "handover"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation/013-cursor-spec-gate-prebind"
    last_updated_at: "2026-07-26T08:12:44Z"
    last_updated_by: "opencode"
    recent_action: "Captured completed delivery state and an independent audit brief."
    next_safe_action: "Audit commits 348b644283 and 1580cd2852 without modifying code."
    blockers:
      - "Memory indexing awaits release of the SQLite single-writer lock."
    key_files:
      - "handover.md"
      - "implementation-summary.md"
      - ".opencode/skills/system-spec-kit/runtime/hooks/cursor/spec-gate-prebind.mjs"
      - ".opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cursor-spec-gate-prebind-handover"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Session Handover: Cursor session-start Gate-3 prebinding

This handover gives a new AI enough evidence to independently analyze the completed implementation without relying on conversation history. The implementation and closeout are committed locally; this handover itself is a later continuity artifact and is not included in those commits.

<!-- SPECKIT_TEMPLATE_SOURCE: handover | v1.0 -->

---

<!-- ANCHOR:handover-summary -->
## 1. Handover Summary

- **From Session:** OpenCode implementation and closeout session, 2026-07-25 through 2026-07-26
- **To Session:** Independent reviewing AI
- **Phase Completed:** Implementation, verification, and documentation closeout
- **Handover Time:** 2026-07-26T08:06:57Z
- **Recent action:** Committed the implementation, pinned its SHA, completed all checklist items, and passed phase plus recursive strict validation
- **Status:** Complete
- **Spec folder:** `.opencode/specs/cli-external-orchestration/030-cli-cursor-creation/013-cursor-spec-gate-prebind`
- **Parent packet:** `.opencode/specs/cli-external-orchestration/030-cli-cursor-creation`
- **Branch:** `skilled/v4.0.0.0`, five commits ahead of `origin/skilled/v4.0.0.0` when this handover was written
- **Implementation commit:** `348b644283 feat(spec-gate): activate Cursor session-start prebinding`
- **Closeout commit:** `1580cd2852 docs(specs): close Cursor Gate-3 prebind phase`
- **Remote state:** Neither commit was pushed in this session
<!-- /ANCHOR:handover-summary -->

---

<!-- ANCHOR:context-transfer -->
## 2. Context Transfer

### 2.1 Problem That Was Solved

Cursor already had a deny-capable `preToolUse` mutation hook, but that hook can enforce only after session gate state becomes `open`. The normal prompt classifier is registered on `beforeSubmitPrompt`; live probing showed that the installed Cursor CLI does not deliver that event. A top-level Cursor CLI session could therefore opt into enforcement without ever creating enforceable state.

The solution adds a fail-open `sessionStart` adapter. It validates a declared spec folder into `satisfied` state or opens state only when enforcement is explicitly enabled. The existing pre-tool adapter remains the mutation consumer.

### 2.2 Final Runtime Behavior

| Startup condition | Persisted state | Later mutation behavior |
|---|---|---|
| Valid `MK_SPEC_FOLDER` | `satisfied` with source `flags` and a validated absolute path | Existing consumer allows the mutation |
| No valid folder and `MK_SPEC_GATE_ENFORCE=1` | `open` | Existing consumer can deny a non-exempt Write/Edit |
| Enforcement unset and no folder | No state | Fail-open allow |
| Invalid folder with enforcement unset | No state | Invalid folder is never accepted |
| Invalid folder with enforcement enabled | `open` | Enforcement applies, but the invalid folder is never treated as satisfied |
| Missing, empty, whitespace-only, or malformed session identity | No state | Fail-open allow |
| `MK_SPEC_GATE_DISABLED=1` | No state | Complete no-op |
| `AI_SESSION_CHILD=1` | No state read or write | Complete allow no-op with no question or telemetry |
| Existing `satisfied` or `skipped` state | Existing bytes preserved | Terminal state is not regressed |

### 2.3 Key Decisions Made

| Decision | Rationale | Impact |
|---|---|---|
| Use confirmed `sessionStart` delivery for prebinding | Cursor CLI does not deliver the prompt event needed to open state | `.cursor/hooks.json` and `spec-gate-prebind.mjs` |
| Keep enforcement opt-in | Startup registration must not silently activate mutation denial | `MK_SPEC_GATE_ENFORCE=1` remains required for unbound sessions |
| Preserve `session_id` verbatim | Trimming would make producer and consumer derive different state keys and could bypass enforcement | Startup adapter and padded-ID regression test |
| Make autonomous children a complete shared-core no-op | A child has no user turn to answer Gate 3, so asking, advising, logging, reading state, or denying is invalid | Cursor, Claude, Codex, and OpenCode consumers |
| Preserve terminal state | Repeated startup must not reopen a satisfied or skipped session | Startup adapter and process suite |
| Keep interactive deny policy unchanged | The transport timing gap did not require changing normal interactive semantics | Shared core changes only the child short-circuit |
| Defer multi-root support | Every Cursor hook currently resolves `workspace_roots[0]`; changing only the spec gate would create inconsistent policy | Separate all-Cursor-hooks follow-up |

### 2.4 Blockers Encountered

**Current implementation blockers:** None.

| Blocker | Status | Resolution or Workaround |
|---|---|---|
| Cursor CLI does not deliver `beforeSubmitPrompt` | Known runtime limitation | Prebind on confirmed `sessionStart`; retain prompt registration only for forward compatibility |
| Initial prebind trimmed session IDs | Resolved | Preserve nonblank IDs verbatim and prove the padded ID reaches a real deny |
| Shared child behavior advised and logged | Resolved | Short-circuit `classifyIntent()` and `evaluateMutation()` before state access or telemetry |
| Phase and parent metadata initially omitted or mislinked phase 018 | Resolved | Link phase 017 to 018, reconcile 18 unique children, remove the ghost entry, and rerun recursive strict validation |
| Documented graph-backfill helper was absent from compiled output | Resolved | Use the approved `generate-context.js` fallback to refresh graph metadata |
| Memory indexing could not acquire the SQLite single-writer lock | Open, non-blocking | File and graph metadata are current; retry MCP indexing after the writer lock held by PID 21021 clears |

### 2.5 Files Modified

**Primary runtime and test files:**

| File | Change Summary | Status |
|---|---|---|
| `.opencode/skills/system-spec-kit/runtime/hooks/cursor/spec-gate-prebind.mjs` | New fail-open startup producer with folder validation, opt-in open state, verbatim IDs, and terminal-state preservation | Committed in `348b644283` |
| `.opencode/skills/system-spec-kit/runtime/hooks/cursor/spec-gate-prebind.test.mjs` | New nine-row isolated process and consumer matrix | Committed in `348b644283` |
| `.opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.mjs` | Complete `AI_SESSION_CHILD=1` no-op before state reads, questions, telemetry, or denial | Committed in `348b644283` |
| `.opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.test.mjs` | Shared child no-op and pre-existing-state regression coverage | Committed in `348b644283` |
| `.opencode/plugins/tests/mk-spec-gate.test.cjs` | OpenCode consumer proof for no question, state, telemetry, or denial | Committed in `348b644283` |
| `.cursor/hooks.json` | Registers the real startup adapter under `sessionStart` | Committed in `348b644283` |
| `.cursor/hooks/spec-gate-prebind.mjs` | Discovery-only relative symlink to the real adapter | Committed in `348b644283` |

**Primary documentation and continuity files:**

| File or group | Change Summary | Status |
|---|---|---|
| Cursor hook READMEs and hook contract | Describe active startup wiring, partial event delivery, and shared editor configuration | Committed in `348b644283` |
| CLI Claude/OpenCode guidance and worktree README | Describe the complete child-session no-op and defense-in-depth enforcement neutralization | Committed in `348b644283` |
| Cursor feature catalog and manual playbook | Replace the unreviewed scenario with executable `9/9` evidence | Committed in `348b644283` |
| Phase 017 continuity | Links phase 018 as the successor | Committed in `348b644283` |
| Phase 018 canonical documents | Capture requirements, plan, tasks, evidence, decisions, limitations, and completion state | Created in `348b644283`, completed in `1580cd2852` |
| Parent packet spec and metadata | Records all 18 phases as complete and removes ghost child metadata | Closed in `1580cd2852` |
| `handover.md` | Transfers the completed state and independent analysis brief | Created after both commits; not committed unless the operator requests it |

### 2.6 Verification Evidence

| Gate | Result |
|---|---|
| Cursor prebind process suite | `9/9` passed |
| Shared spec-gate core suite with module mocks | `67/67` passed |
| OpenCode spec-gate plugin suite | `11/11` passed |
| Live Claude child probe | Empty output, no question, no warning log |
| Cursor config and symlink checks | One resolving real-path entry; discovery symlink resolves |
| Syntax and code-comment hygiene | Passed |
| OpenCode alignment guards | `3/3` passed |
| Affected document validation | `21/21` passed before closeout; all canonical phase docs passed again afterward |
| Phase 018 strict validation | `0 errors`, `0 warnings`, `RESULT: PASSED` |
| Parent recursive strict validation | 18 phase links, `0 errors`, `0 warnings`, `RESULT: PASSED` |
| Completion calculation | `27/27`; P0 `14/14`; P1 `13/13` |
| Whitespace validation | `git diff --check` passed |

### 2.7 Traps and Scar Tissue

| Trap or blast site | Activation condition | Load-bearing or defensive? | How to avoid re-paying it |
|---|---|---|---|
| Session-key mismatch | Producer trims the ID while consumer hashes it verbatim | Load-bearing | Preserve any nonblank ID exactly; keep the padded-ID deny test |
| Child session accidentally interacts with Gate 3 | Child check happens after state access or only narrows denial | Load-bearing | Return from both shared entrypoints before any state read, question, warning, or deny calculation |
| Registration mistaken for delivery | Reviewer assumes `beforeSubmitPrompt` fires because it appears in config | Load-bearing | Treat the live event table as authority; `sessionStart` is the proven startup event |
| Invalid folder treated as satisfied | Adapter trusts `MK_SPEC_FOLDER` without filesystem-backed validation | Load-bearing | Use `validateSpecFolderBinding()` and require `resolvedAbsolutePath` |
| Terminal state regression | Repeated startup rewrites `satisfied` or `skipped` state | Load-bearing | Read state first and return without mutation for terminal statuses |
| Shared Cursor editor blast radius | `.cursor/hooks.json` is edited as though it were CLI-private | Load-bearing | Keep the adapter fail-open and enforcement opt-in; test both config and runtime envelope |
| Partial multi-root fix | Only spec-gate adapters change root selection | Defensive | Address every Cursor hook under a separate shared root-set policy |
| Broad staging in a dirty tree | `git add .`, `git add -A`, or folder-wide staging captures concurrent work | Load-bearing | Stage explicit files and inspect `git diff --cached --name-status` before committing |
| Metadata freshness loop | Canonical docs are edited after graph generation | Defensive | Edit docs, refresh metadata, then run strict validation as the final write-sensitive gate |
| Memory save writer contention | Standalone save attempts to open a second SQLite writer | Defensive | Keep file metadata as source of truth and retry indexing through the live MCP daemon later |
<!-- /ANCHOR:context-transfer -->

---

<!-- ANCHOR:next-session -->
## 3. For Next Session

### 3.1 Recommended Starting Point

- **File:** `.opencode/specs/cli-external-orchestration/030-cli-cursor-creation/013-cursor-spec-gate-prebind/implementation-summary.md:57`
- **Next safe action:** Perform an independent read-only audit of commits `348b644283` and `1580cd2852`; do not modify code until findings are verified against actual behavior
- **Cold-read order:** 1. `handover.md` -> 2. `implementation-summary.md` -> 3. `spec.md` -> 4. `checklist.md` -> 5. `spec-gate-prebind.mjs` -> 6. `spec-gate-core.mjs` -> 7. both test files -> 8. `.cursor/hooks.json` -> 9. `git show 348b644283` and `git show 1580cd2852`
- **Context:** Focus on correctness, fail-open safety, producer-consumer state-key agreement, cross-runtime effects of the shared child no-op, and whether the tests discriminate against plausible regressions

### 3.2 Priority Tasks Remaining

1. Independently analyze the two commits for correctness, security, behavioral regressions, and missing test cases.
2. Confirm that documentation claims match implementation and that the known limitations are framed accurately.
3. If findings exist, report them findings-first with severity and exact file references; propose the smallest fix but do not edit without operator authorization.
4. Retry memory indexing only after the SQLite writer lock clears; indexing is not evidence that runtime behavior is correct.
5. Treat multi-root Cursor support as a separate follow-up, not as an opportunistic change to this completed phase.

### 3.3 Critical Context to Load

- [x] Continuity target: this `handover.md` plus `_memory.continuity` in `implementation-summary.md`
- [x] Specification: `spec.md`, especially Problem and Purpose, Scope, Requirements, Success Criteria, and Risks
- [x] Plan: `plan.md`, especially Architecture, Affected Surfaces, Implementation Phases, and Testing Strategy
- [x] Verification: `checklist.md` and `implementation-summary.md`
- [x] Runtime producer: `.opencode/skills/system-spec-kit/runtime/hooks/cursor/spec-gate-prebind.mjs`
- [x] Shared policy: `.opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.mjs`
- [x] Consumer wiring: `.cursor/hooks.json` and `.opencode/plugins/tests/mk-spec-gate.test.cjs`
- [x] Commit evidence: `348b644283` and `1580cd2852`

### 3.4 Independent Analysis Questions

1. Can any malformed or adversarial startup payload create enforceable or satisfied state unexpectedly?
2. Do producer and consumer always derive the same state key for every accepted session ID?
3. Is the child-session short-circuit early enough to guarantee no state access, question, telemetry, or denial across all consumers?
4. Did centralizing the child no-op introduce a regression for any legitimate interactive runtime path?
5. Does filesystem-backed folder validation prevent traversal, out-of-tree binding, and invalid metadata acceptance?
6. Are terminal `satisfied` and `skipped` states truly preserved byte-for-byte on repeated startup?
7. Does `.cursor/hooks.json` remain safe for both Cursor CLI and the desktop editor?
8. Are the `9/9`, `67/67`, and `11/11` suites sufficiently discriminating, or are important negative cases missing?
9. Do phase and parent documentation accurately distinguish completed behavior from deferred multi-root work?
10. Is any claimed invariant based only on documentation rather than executable evidence?
<!-- /ANCHOR:next-session -->

---

<!-- ANCHOR:validation-checklist -->
## 4. Validation Checklist

- [x] All implementation work owned by this phase is committed in `348b644283` and `1580cd2852`
- [x] Unrelated concurrent worktree changes were left untouched and unstaged
- [x] Current context is captured in canonical phase documents and this handover
- [x] No breaking change is left mid-implementation
- [x] Runtime suites pass: `9/9`, `67/67`, and `11/11`
- [x] Phase strict validation passes with zero errors and warnings
- [x] Parent recursive strict validation passes across all 18 phases
- [x] Completion evidence is `27/27`, including every P0 and P1 item
- [x] This handover contains no unresolved template placeholders
- [x] No push occurred; remote publication remains an explicit operator action
<!-- /ANCHOR:validation-checklist -->

---

<!-- ANCHOR:session-notes -->
## 5. Session Notes

### Repository State

The two task commits are local on `skilled/v4.0.0.0`. At handover creation, the branch is five commits ahead of its remote. The repository contains extensive unrelated modifications, deletions, generated artifacts, and untracked directories from other work. Do not reset, clean, stash, stage, or reinterpret those paths as part of this phase.

The scoped implementation paths were clean after `1580cd2852`. Creating this handover and refreshing its packet metadata introduces new uncommitted documentation-only changes unless the operator later requests another commit.

### Known Limitations

1. Cursor CLI still does not deliver `beforeSubmitPrompt`, so interactive A-E answer parsing is unavailable on that surface.
2. `.cursor/hooks.json` is shared with the Cursor desktop editor.
3. All Cursor hooks currently use only `workspace_roots[0]`; secondary roots are not covered.
4. Memory indexing is pending because the live SQLite writer lock blocked standalone and MCP/CLI scan attempts.
5. The implementation commits are not pushed.

### Ready-to-Use Analysis Prompt

```text
Perform an independent, findings-first analysis of the completed Cursor session-start Gate-3 prebinding work in this repository.

Start by reading:
1. .opencode/specs/cli-external-orchestration/030-cli-cursor-creation/013-cursor-spec-gate-prebind/handover.md
2. .opencode/specs/cli-external-orchestration/030-cli-cursor-creation/013-cursor-spec-gate-prebind/implementation-summary.md
3. .opencode/specs/cli-external-orchestration/030-cli-cursor-creation/013-cursor-spec-gate-prebind/spec.md
4. .opencode/specs/cli-external-orchestration/030-cli-cursor-creation/013-cursor-spec-gate-prebind/checklist.md

Then inspect implementation commit 348b644283 and closeout commit 1580cd2852. Review the actual code and tests, especially:
- .opencode/skills/system-spec-kit/runtime/hooks/cursor/spec-gate-prebind.mjs
- .opencode/skills/system-spec-kit/runtime/hooks/cursor/spec-gate-prebind.test.mjs
- .opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.mjs
- .opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.test.mjs
- .opencode/plugins/tests/mk-spec-gate.test.cjs
- .cursor/hooks.json

Analyze correctness, security, fail-open behavior, state-key consistency, path validation, terminal-state preservation, and cross-runtime consequences of making AI_SESSION_CHILD=1 a complete Gate-3 no-op. Verify that the tests are discriminating rather than merely green. Check whether documentation claims match executable behavior and whether any relevant negative case is missing.

Known constraints:
- Cursor CLI does not deliver beforeSubmitPrompt under the tested build.
- .cursor/hooks.json is shared with the desktop editor.
- Multi-root support is intentionally deferred; current hooks use workspace_roots[0].
- Memory indexing is pending due an SQLite single-writer lock and is not a runtime correctness signal.
- The worktree contains extensive unrelated changes. Do not modify, stage, reset, clean, or attribute them to this task.
- The task commits are local and unpushed.

Return findings first, ordered P0/P1/P2, with exact file and line references and a concrete failure scenario for each finding. Distinguish confirmed defects from hypotheses. If there are no findings, say so explicitly and list residual risks and testing gaps. Do not edit files unless I separately authorize implementation.
```
<!-- /ANCHOR:session-notes -->

---
