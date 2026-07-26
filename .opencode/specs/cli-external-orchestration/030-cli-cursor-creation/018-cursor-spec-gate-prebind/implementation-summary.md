---
title: "Implementation Summary: Cursor session-start spec-gate prebinding"
description: "Activated Cursor's opt-in mutation gate through tested, fail-open session-start state prebinding."
trigger_phrases:
  - "Cursor prebind implementation"
  - "Cursor Gate-3 delivery"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation/018-cursor-spec-gate-prebind"
    last_updated_at: "2026-07-26T06:54:58Z"
    last_updated_by: "opencode"
    recent_action: "Implementation committed as 348b644283; all completion gates pass."
    next_safe_action: "No further phase work; push only on explicit approval."
    blockers: []
    key_files: ["spec.md", ".opencode/skills/system-spec-kit/runtime/hooks/cursor/spec-gate-prebind.mjs", ".opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.mjs"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cursor-spec-gate-prebind"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 018-cursor-spec-gate-prebind |
| **Completed** | 2026-07-26 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

<!-- Voice guide:
     Open with a hook: what changed and why it matters. One paragraph, impact first.
     Then use ### subsections per feature. Each subsection: what it does + why it exists.
     Write "You can now inspect the trace" not "Trace inspection was implemented."
     NO "Files Changed" table for Level 3/3+. The narrative IS the summary.
     For Level 1-2, a Files Changed table after the narrative is fine.
     Reference: specs/system-spec-kit/020-mcp-working-memory-hybrid-rag/implementation-summary.md -->

Cursor's existing mutation guard is now reachable in top-level sessions without relying on the prompt event the CLI does not deliver. Startup prebinding validates explicit folders, opens enforcement only on operator opt-in, and leaves disabled, malformed, unidentified, and autonomous child sessions untouched.

### Guarded startup state

The adapter establishes state on confirmed `sessionStart` delivery. A valid `MK_SPEC_FOLDER` creates terminal `satisfied` state; otherwise `MK_SPEC_GATE_ENFORCE=1` creates `open` state for an identifiable top-level session. Repeated startup preserves existing `satisfied` and `skipped` records. The session id is preserved verbatim (never trimmed) so the pre-tool enforce consumer reads the same state key the startup producer wrote.

### Autonomous-child Gate-3 no-op (shared core)

A review found that `AGENTS.md`'s autonomous-child exemption ("must not emit Gate-3 questions") contradicted the shared core's prior advise-only child behavior. The resolution favors `AGENTS.md`: a dispatched/child session (`AI_SESSION_CHILD=1`) is now a COMPLETE no-op in the shared core — `classifyIntent()` returns closed with no question and `evaluateMutation()` returns allow with no telemetry, before any state read or write. This is enforced centrally so every runtime adapter (Cursor, Codex, Claude, OpenCode) behaves identically.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `spec-gate-prebind.mjs` | Created | Initializes safe startup state; preserves session ids verbatim. |
| `spec-gate-prebind.test.mjs` | Created | Runs the isolated state/environment matrix (padded-id and enforce-off rows added). |
| `spec-gate-core.mjs` | Modified | Child session becomes a complete Gate-3 no-op in classify/evaluate. |
| `mk-spec-gate.test.cjs` | Modified | Proves the OpenCode consumer emits no child question, state, telemetry, or denial. |
| `.cursor/hooks.json` and mirror | Modified/Created | Registers the tested real path and exposes discovery. |
| Runtime/orchestration docs, Cursor catalog/playbook | Modified | Replaces stale unreviewed and advise-only language with current tested behavior. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

<!-- Voice guide:
     Tell the delivery story. What gave you confidence this works?
     "All features shipped behind feature flags" not "Feature flags were used."
     For Level 1: a single sentence is enough.
     For Level 3+: describe stages (testing, rollout, verification). -->

The process suite runs both real adapter entrypoints in isolated workspaces with fresh environment maps. Enforcement remains behind `MK_SPEC_GATE_ENFORCE=1`; the shared core changes only the autonomous-child branch, leaving interactive deny/exemption behavior unchanged.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

<!-- Voice guide: "Why" column should read like you're explaining to a colleague.
     "Chose X because Y" not "X was selected due to Y." -->

| Decision | Why |
|----------|-----|
| Make a child session a complete shared-core no-op | `AGENTS.md` §2 exempts autonomous children from Gate-3 entirely; the prior advise-only behavior surfaced the question to sessions that cannot answer it. Centralizing the no-op keeps every adapter consistent. |
| Keep interactive mutation policy unchanged | The event gap is transport-specific; the deny predicate and path exemptions already model open, satisfied, skipped, disabled, and child states correctly. |
| Preserve session ids verbatim | The enforce consumer and the core's `sessionStateKey()` never trim; trimming at prebind would write state under a key enforcement cannot read, bypassing the gate. |
| Require a non-empty session id | Writing fallback startup state could leak one session's opt-in into another session. |
| Defer multi-root support | Every Cursor adapter here resolves `workspace_roots[0]`; a partial fix on the gate adapters alone would leave the others inconsistent. A single root-set policy is tracked separately. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

<!-- Voice guide: Be honest. Show failures alongside passes.
     "FAIL, TS2349 error in benchmarks.ts" not "Minor issues detected." -->

| Check | Result |
|-------|--------|
| Contract audit | PASS: state producer, consumer, shared core, config, and docs inventoried |
| Prebind process suite | PASS: 9/9 (local, during repair) |
| Shared spec-gate suite | PASS: 67/67 (local, during repair — child no-op rows added) |
| OpenCode spec-gate plugin suite | PASS: 11/11 (local — confirms no regression from the child contract change) |
| Syntax and comment hygiene | PASS: all changed JavaScript parses; code-comment hygiene clean |
| Cursor config and mirror | PASS: exactly one resolving entry; symlink resolves |
| OpenCode alignment | PASS: 3/3 drift guards |
| Changed document validation | PASS: 21/21 affected documents, zero issues |
| Strict phase and recursive packet validation | PASS: phase 018 and packet 030 recursive runs report 0 errors and 0 warnings; parent verifies all 18 phase links |
| Implementation commit | PASS: `348b644283` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

<!-- Voice guide: Number them. Be specific and actionable.
     "Adaptive fusion is enabled by default. Set SPECKIT_ADAPTIVE_FUSION=false to disable."
     not "Some features may require configuration."
     Write "None identified." if nothing applies. -->

1. `beforeSubmitPrompt` remains dormant under the installed Cursor CLI, so interactive A-E answer parsing is still unavailable inside that runtime.
2. `.cursor/hooks.json` is shared with the Cursor desktop editor; registration applies to both surfaces.
3. Multi-root Cursor workspaces are not enforced: both spec-gate adapters and every other Cursor hook in this repo resolve `workspace_roots[0]` only, so writes under a secondary root read as out-of-repo. Tracked as a separate all-Cursor-hooks follow-up.
<!-- /ANCHOR:limitations -->

---
