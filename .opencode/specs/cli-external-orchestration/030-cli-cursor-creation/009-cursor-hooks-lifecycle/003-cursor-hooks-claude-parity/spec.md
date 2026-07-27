---
title: "Feature Specification: cli-cursor hooks Claude-parity expansion"
description: "Expand the phase-010 committed .cursor/hooks.json toward Claude-adapter parity: 5 sessionStart/sessionEnd repo-guard scripts wired directly (Tier 0), a beforeSubmitPrompt advisor proxy plus a preCompact proxy registered for parity (Tier 1/3a, delivery unconfirmed), a postToolUse chain proxy wired live (Tier 2), a Task-matcher preToolUse dispatch guard wired and live-fire confirmed (Tier 4), and an MCP-route advisory guard built but deliberately left unwired pending a configured MCP server (Tier 3b)."
trigger_phrases: ["cli-cursor hooks Claude parity", "cursor postToolUse wiring", "cursor task-dispatch-guard", ".cursor/hooks.json Claude parity expansion"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation/011-cursor-hooks-claude-parity"
    last_updated_at: "2026-07-24T18:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Built, live-fire tested, and documentation cross-references updated"
    next_safe_action: "Run validate.sh --strict, commit"
    blockers: []
    key_files: [".cursor/hooks.json", ".opencode/skills/system-spec-kit/mcp-server/hooks/cursor/shared.ts", ".opencode/skills/cli-external-orchestration/feature-catalog/feature-catalog.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-cursor-hooks-claude-parity", parent_session_id: null }
    completion_pct: 100
    open_questions: []
    answered_questions: ["Wire the 5 Tier-0 sessionStart/sessionEnd repo-guard scripts directly (not thin TS proxies): yes, they take no Cursor-specific input shape and already fail open/print advisory text.", "Wire mcp-route-guard.mjs (Tier 3b) despite no configured MCP server: no -- mirrors spec-gate-classify.mjs's own precedent of registering only after live delivery is re-confirmed, applied one step earlier (before any registration).", "Wire completion-evidence-stop.cjs (Tier 1c): no -- it requires a last_assistant_message field Cursor's sessionEnd payload never carries."]
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Feature Specification: cli-cursor hooks Claude-parity expansion

<!-- ANCHOR:metadata -->
## 1. METADATA
| Field | Value |
|---|---|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-24 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `cli-external-orchestration/030-cli-cursor-creation` |
| **Predecessor** | `../010-cursor-hooks-live-wiring/spec.md` |
| **Successor** | `../012-hooks-manual-testing-results/spec.md` |
| **Handoff Criteria** | Every newly wired adapter is live-fire confirmed or explicitly documented as registered-but-unconfirmed/dormant; `spec-gate-prebind.mjs`'s Tier-1c analog (`completion-evidence-stop.cjs`) and the unconfigured-MCP `mcp-route-guard.mjs` stay unwired with the reason stated; `.cursor/hooks.json` is restored byte-identical to its clean, intended content (no leftover diagnostic wrapper) before commit. |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 010 registered exactly the 4 adapters ADR-001 originally scoped (`sessionStart`/`sessionEnd`/`preToolUse`/`beforeSubmitPrompt`), deliberately excluding everything else pending further review. That left a real parity gap against this repo's own Claude-side hook surface: no Cursor `sessionStart` counterpart for the Claude worktree/git-hooks/dist-staleness/codex-hooks startup checks; no `sessionEnd` counterpart for Claude's session-cleanup script; no `postToolUse` proxy at all (Claude's post-edit quality/code-graph-freshness/dispatch-audit chain had zero Cursor equivalent); no `Task`-scoped dispatch guard (Claude's `task-dispatch-guard.cjs` had no Cursor counterpart, so a Cursor-dispatched subagent delegation was invisible to this repo's deep-loop dispatch guard); and no attempt at `preCompact`/MCP-route parity, even as documentation-only placeholders.

Research (this phase) confirmed `postToolUse` fires for both `Write` and `Shell` tool_name payloads (plus `postToolUseFailure`), confirmed a `Task` tool_name exists in Cursor's hook vocabulary with `tool_input: {description, prompt, model, subagent_type}`, and confirmed `preCompact` has no forcing mechanism reachable from a single `-p` dispatch and no configured MCP server exists on this machine to test `beforeMCPExecution` against.

### Purpose
Close as much of the Claude-adapter parity gap as the confirmed Cursor hook vocabulary actually supports, wiring what live-fires and can be proven, registering-for-parity what is plausible-but-unconfirmed with the status stated honestly, and explicitly declining to wire what cannot yet be justified (an unreviewed Tier-1c dependency chain, and an MCP guard with no server to verify against) -- without inflating any claim beyond what this phase's own live-fire evidence supports.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Wire 4 additional `sessionStart` entries (`worktree-guard.sh`, `check-git-hooks.sh`, `check-dist-staleness.sh --all`, `install-codex-hooks.mjs --check`) and 1 additional `sessionEnd` entry (`session-cleanup.sh`) as direct repo-guard script invocations (Tier 0) -- no new adapter code, just registry additions.
- Extend `shared.ts`'s `CursorHookEvent` union with `beforeSubmitPrompt` (already registered by phase 010 for `spec-gate-classify.mjs`, now also needed by the new TS-based `user-prompt-submit.ts`) and `preCompact`; extend `ClaudeHookAdapterFilename` with `compact-inject.js`; deliberately exclude `stop` (`sessionEnd` is the confirmed-firing substitute already used by `session-end.ts`).
- Author `user-prompt-submit.ts`, a thin proxy from `beforeSubmitPrompt` to the existing `user-prompt-submit.js` advisor-brief shim, adding an explicit `prompt` field on top of `toClaudeShape()` (load-bearing: the target fails open to `{}` without it) and using `emitNormalizedCursorResponse()` to unwrap its JSON envelope rather than treating the raw JSON string as `agent_message` verbatim.
- Author `post-tool-use.mjs`, a plain-`.mjs` `postToolUse` proxy chaining `Write` -> `claude-posttooluse.cjs` + `code-graph-freshness.cjs`, and `Shell` -> `dispatch-audit-posttooluse.mjs` with an explicit `Shell`->`Bash` `tool_name` normalization (that target's own matcher requires the literal string `bash`).
- Author `task-dispatch-guard.mjs`, a `Task`-matcher `preToolUse` proxy to the existing `task-dispatch-guard.cjs` deep-loop dispatch guard, registered as a SECOND `preToolUse` array entry alongside the existing unmatched `spec-gate-enforce.mjs` entry (both fire on the same tool call).
- Author `precompact.ts`, a thin `preCompact` proxy to `compact-inject.js`, registered for parity though its trigger cannot be manufactured in a short probe session.
- Author `mcp-route-guard.mjs` (a `beforeMCPExecution` advisory proxy to `mcp-route-guard.cjs`), standalone-test it against a synthetic payload, and deliberately leave it OUT of `.cursor/hooks.json` -- no MCP server is configured on this machine to verify its assumed `tool_name`/`workspace_roots` payload shape against a real `beforeMCPExecution` delivery.
- Live-fire test every wired change against the real repo via a temporary marker-wrapper diagnostic (mirroring phase 010's methodology), then restore `.cursor/hooks.json` byte-identical to its clean, intended content before commit.
- Update the feature-catalog `cursor-hooks-and-spec-gate` entry and the `cli-cursor` manual-testing-playbook hooks category to reflect only what this phase actually wired and confirmed.

### Out of Scope
- Wiring `completion-evidence-stop.cjs` (the Claude-side Tier-1c analog): it requires `payload.last_assistant_message`, a field Cursor's `sessionEnd` payload never carries (only `transcript_path`, a JSONL file path), and depends on a `lastSpecFolder` state file only the Claude-side `Stop` hook currently populates. Building real Cursor-transcript-JSONL parsing to backfill that field would be new capability, not a thin proxy.
- Wiring `mcp-route-guard.mjs` into `.cursor/hooks.json` -- no configured MCP server exists on this machine (`.cursor/mcp.json` absent, `~/.cursor/mcp.json` empty, `cursor-agent mcp list` reports none) to confirm `beforeMCPExecution`'s actual payload shape against.
- Changing `dispatch-audit-posttooluse.mjs`'s hardcoded `runtime: 'claude'` field -- it is a shared Claude-authored script outside this phase's file scope; the cosmetic provenance drift (a Cursor-proxied audit line still reads `runtime:"claude"`) is documented as a known limitation, not fixed here.
- Reviewing, testing, or wiring `spec-gate-prebind.mjs` -- unchanged from phase 010's own exclusion; still a concurrent session's unreviewed, uncommitted work.
- Building any new deep-loop runtime logic -- every new adapter is a thin proxy to an existing, already-reviewed Claude-side or runtime-neutral script; no target script's internal logic was modified.

### Files to Change
| File Path | Change Type | Description |
|---|---|---|
| `.cursor/hooks.json` | Modify | Add 4 `sessionStart` entries, 1 `sessionEnd` entry, 1 `postToolUse` array, a 2nd `preToolUse` (`matcher: "Task"`) entry, a 2nd `beforeSubmitPrompt` entry, and a new `preCompact` array. |
| `.opencode/skills/system-spec-kit/mcp-server/hooks/cursor/shared.ts` | Modify | Extend `CursorHookEvent` with `beforeSubmitPrompt`/`preCompact`; extend `ClaudeHookAdapterFilename` with `compact-inject.js`. |
| `.opencode/skills/system-spec-kit/mcp-server/hooks/cursor/user-prompt-submit.ts` | Create | Thin `beforeSubmitPrompt` proxy to `user-prompt-submit.js`. |
| `.opencode/skills/system-spec-kit/mcp-server/hooks/cursor/post-tool-use.mjs` | Create | Plain `postToolUse` proxy chaining Write/Shell targets. |
| `.opencode/skills/system-spec-kit/mcp-server/hooks/cursor/task-dispatch-guard.mjs` | Create | `Task`-matcher `preToolUse` proxy to `task-dispatch-guard.cjs`. |
| `.opencode/skills/system-spec-kit/mcp-server/hooks/cursor/precompact.ts` | Create | Thin `preCompact` proxy to `compact-inject.js`. |
| `.opencode/skills/system-spec-kit/mcp-server/hooks/cursor/mcp-route-guard.mjs` | Create (unwired) | `beforeMCPExecution` advisory proxy, standalone-tested only. |
| `.opencode/skills/system-spec-kit/mcp-server/dist/hooks/cursor/*.js` | Rebuild | Compiled output for the new/changed `.ts` sources via `npm run build` (dist is gitignored; no tracked diff). |
| `.opencode/skills/cli-external-orchestration/feature-catalog/cursor-hooks-and-spec-gate/cursor-hooks-and-spec-gate.md` + `feature-catalog.md` | Modify | Document the newly wired events/adapters actually built and confirmed. |
| `.opencode/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook/manual-testing-playbook.md` (+ new `hooks/*.md` scenario) | Modify/Create | Add a `CU-021` scenario for the live-fire-confirmed `Task`-matcher dispatch guard; note the still-dormant/unwired adapters in prose only. |
| `../010-cursor-hooks-live-wiring/spec.md` | Modify | Update `Successor` field to point at this phase. |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Priority |
|---|---|---|
| REQ-001 | The 5 Tier-0 `sessionStart`/`sessionEnd` repo-guard scripts are added to `.cursor/hooks.json` and confirmed to fire in the same live-fire pass as the pre-existing entries. | P0 |
| REQ-002 | `postToolUse` is wired via a proxy that correctly routes `Write` and `Shell` tool_name payloads to their respective Claude-side chained hooks, including the `Shell`->`Bash` normalization required by `dispatch-audit-posttooluse.mjs`'s literal-string matcher. | P0 |
| REQ-003 | A `Task`-matcher `preToolUse` dispatch guard is wired as a second array entry (not replacing the existing unmatched entry) and is live-fire confirmed against a real subagent-delegation dispatch. | P0 |
| REQ-004 | `preCompact` and the extended `beforeSubmitPrompt` proxy are registered for parity with their unconfirmed-delivery status stated explicitly, never claimed as confirmed. | P1 |
| REQ-005 | `mcp-route-guard.mjs` is authored and standalone-tested but NOT added to `.cursor/hooks.json`, with the no-configured-MCP-server reason documented. | P1 |
| REQ-006 | The Tier-1c `completion-evidence-stop.cjs` analog is not wired, with the missing-field reason (`last_assistant_message`) documented as a known limitation rather than a defect. | P1 |
| REQ-007 | `.cursor/hooks.json` is restored byte-identical to its clean, intended content (diff-verified) after the live-fire diagnostic wrapper is removed, before commit. | P0 |
| REQ-008 | The feature-catalog and manual-testing-playbook hooks documentation reflect only what this phase actually wired and confirmed -- no adapter is described as working beyond its own evidence. | P1 |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
- **SC-001**: A live `cursor-agent -p` dispatch (file write + shell command) shows `sessionStart-fired`, all 5 wrapped `sessionStart` entries firing, `preToolUse-unmatched-fired`, `postToolUse-fired` (both Write and Shell), and `sessionEnd-fired` (both wrapped entries) in the marker log. **MET**.
- **SC-002**: A live dispatch requesting explicit subagent delegation shows both `preToolUse-Task-fired` and `preToolUse-unmatched-fired` for the same `Task` tool call. **MET**.
- **SC-003**: A live plain-prompt dispatch shows no `beforeSubmitPrompt`-classify/advisor marker, re-confirming the pre-existing dormancy finding rather than contradicting it. **MET**.
- **SC-004**: A synthetic stdin payload piped directly through `post-tool-use.mjs` with `tool_name: "Shell"` produces a real new line in `.opencode/logs/cli-dispatch-audit.log` with correct `sessionID`/`callID`/`command`/`skill` fields. **MET**.
- **SC-005**: `.cursor/hooks.json` diffs byte-identical against its clean, un-wrapped, intended content before the session ends. **MET**.
- **SC-006**: `validate.sh 030-cli-cursor-creation --recursive --strict` returns 0 errors and 0 warnings after this phase lands.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
- **Editor cross-surface impact (same as phase 010).** Every wired adapter is fail-open by design; a malformed payload or internal error never blocks an editor user opening this repo in the Cursor desktop app.
- **`dispatch-audit-posttooluse.mjs` provenance drift.** The chained script hardcodes `runtime: 'claude'` even when proxied from Cursor; confirmed live (the recorded audit line reads `runtime:"claude"`). Cosmetic, inherited, and out of this phase's file scope (the shared script itself was not touched).
- **`mcp-route-guard.mjs`'s field-name assumption is unverified.** Its `tool_name`/`workspace_roots` shape is inferred by analogy to every other confirmed Cursor event, not independently confirmed for `beforeMCPExecution`. Mitigation: left unwired until a configured MCP server allows a real payload capture.
- **Diagnostic-wrapper leakage into the committed file.** Mitigation: the wrapped `.cursor/hooks.json` was diffed byte-identical against the clean, intended version before finishing, mirroring phase 010's own reversion discipline.
- **Concurrent-session collision (established precedent from phase 010).** The same shared working directory carried unrelated concurrent-session activity during this phase (archive-moves, research folders); this phase's own `git status --porcelain` sweep before staging distinguishes its files from that activity, per phase 010's T012 precedent.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS
- **NFR-P01**: Every new adapter script stays fail-open -- a spawn error, parse error, or missing field never denies a tool call or session event by accident.
- **NFR-P02**: No adapter renames or reshapes a target script's own required input fields; each proxy either forwards the payload as-is (`task-dispatch-guard.mjs`) or performs only the minimum documented normalization the target's own matcher requires (`Shell`->`Bash` in `post-tool-use.mjs`).

## 8. EDGE CASES
- A Cursor dispatch that never calls `Task` (the vast majority of dispatches): `task-dispatch-guard.mjs` receives every `preToolUse` call (it is unmatched at the schema level for anything but `Task`... actually IS matched to `Task` only) and returns a plain `allow` for any non-`Task` payload without invoking the guard script at all -- confirmed by direct code read (`if (String(payload?.tool_name || '') !== 'Task') return approve();`).
- A future MCP server gets configured on this machine: `mcp-route-guard.mjs` already exists and is standalone-tested; wiring it in becomes a follow-up decision once a real `beforeMCPExecution` payload can be captured and the field-name assumption re-checked, not a rebuild.
- A future `cursor-agent` build changes compaction or prompt-submission delivery: `preCompact`/`beforeSubmitPrompt` are already registered, so re-verifying delivery is a live-fire re-test, not a re-authoring effort.

## 9. COMPLEXITY ASSESSMENT
| Dimension | Score | Notes |
|---|---|---|
| Scope | 10/25 | 5 new/modified adapter files + 1 registry file + doc updates; no runtime code changed outside the thin-proxy layer. |
| Risk | 10/25 | Real behavior change (editor + CLI hook execution across the whole repo), mitigated by fail-open adapters, a restored-clean-diff discipline, and one deliberately-unwired adapter pending real verification. |
| Research | 8/20 | This phase's own live-fire probes (postToolUse payload shapes, Task tool_name/subagent_type shape, preCompact/MCP infeasibility) established new facts beyond what phase 004/010 already confirmed. |
| **Total** | **28/70** | **Level 2** |

## 10. RISK MATRIX
| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| `postToolUse` proxy silently drops the `Shell`->`Bash` normalization in a future edit | Low | Medium (dispatch-audit trail would silently stop recording Shell calls) | Comment explicitly documents why the normalization is load-bearing; live-fire test asserted a real new audit-log line |
| `task-dispatch-guard.mjs`'s second `preToolUse` entry conflicts with the existing unmatched entry | Low | Low (both fire independently, confirmed by the same live dispatch producing both marker lines) | Live-fire dispatch 3 showed both entries firing for the same Task call, not a collision |
| `mcp-route-guard.mjs`'s unverified field-name assumption gets wired in later without re-checking | Low | Medium (a wrong field name would make the guard silently no-op) | Header comment explicitly states the re-verification bar before wiring |

## 11. USER STORIES
- As the operator, I want the Cursor CLI hook surface to reach the same repo-guard coverage the Claude Code hook surface already has, wherever Cursor's own event vocabulary actually supports it.
- As a maintainer, I want every newly wired adapter's status (confirmed-firing vs. registered-for-parity vs. deliberately-unwired) stated honestly, so a future session never assumes more coverage than this phase actually proved.

## 12. OPEN QUESTIONS
All questions below are resolved.
- Wire the 5 Tier-0 scripts directly, or through a thin TS proxy? **Resolved: directly.** They take no Cursor-specific input shape and already print advisory text / fail open on their own; a proxy layer would add indirection with no behavioral benefit.
- Wire `mcp-route-guard.mjs` despite no configured MCP server? **Resolved: no.** Mirrors `spec-gate-classify.mjs`'s own "register only after re-confirming live delivery" precedent, applied one step earlier -- before any registration, not just before trusting the result.
- Wire the Tier-1c `completion-evidence-stop.cjs` analog? **Resolved: no.** Its required `last_assistant_message` field has no Cursor-side source; building one would be new capability, not a thin proxy, and was out of this pass's scope.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS
- `plan.md`, `tasks.md`, `checklist.md` (this phase)
- `../010-cursor-hooks-live-wiring/spec.md` (predecessor)
- `../spec.md` (phase-parent packet)
- `../004-cursor-hook-adapter-layer/decision-record.md` (ADR-001, the original committed-registration decision this phase further extends)
- `.cursor/hooks.json` (the artifact this phase extends)
