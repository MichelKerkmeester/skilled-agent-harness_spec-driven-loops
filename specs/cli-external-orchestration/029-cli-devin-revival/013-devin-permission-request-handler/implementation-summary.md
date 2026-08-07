---
title: "Implementation Summary: Devin PermissionRequest handler"
description: "Implemented and registered a fail-closed Devin PermissionRequest adapter that composes the shared write-target and dispatch hard-rule cores, with process-level discrimination and documented live-probe limits."
trigger_phrases:
  - "devin permission request handler summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/029-cli-devin-revival/013-devin-permission-request-handler"
    last_updated_at: "2026-07-27T12:00:00Z"
    last_updated_by: "claude"
    recent_action: "Adapter inert under the bypass mode actually used; PreToolUse guards verified active."
    next_safe_action: "None; scope resolved."
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md", "permission-request-policy.mjs", "permission-request-policy.test.mjs", ".devin/hooks.v1.json"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "devin-permission-request-handler"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: ["The local policy matrix distinguishes five deny rows from a naive always-allow classifier.", "A live probe confirms the adapter itself computes the correct decision for real payloads.", "auto mode fires the hook but ignores its answer; dangerous mode never fires it; no tested mode honors the hook's decision."]
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 013-devin-permission-request-handler |
| **Completed** | 2026-07-27 (local implementation; live verification pending) |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`permission-request-policy.mjs` now handles Devin `PermissionRequest` payloads with strict identity validation and a fail-closed policy. Write-class tools delegate target-path classification to `isExemptTargetPath(filePath, projectDir)`. Exec-class tools delegate hard-rule loading and evaluation to `readHardRules(skillMdPath)` and `evaluate(command, rules)`. Unknown tools, malformed JSON, missing identity, invalid tool shapes, and policy errors deny.

The adapter emits the repository-standard nested `hookSpecificOutput` envelope for `PermissionRequest`, plus Devin's documented top-level `decision`/`reason` fields for runtime compatibility. `.devin/hooks.v1.json` registers the adapter for every PermissionRequest tool name with the established nested matcher schema.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `permission-request-policy.mjs` | Created | Fail-closed write/exec permission adapter over the two existing shared cores. |
| `permission-request-policy.test.mjs` | Created | Process-level matrix and always-allow falsifier test. |
| `.devin/hooks.v1.json` | Modified | Registers the adapter under `PermissionRequest`. |
| `tasks.md` | Modified | Records task evidence and the unavailable live probe. |
| `checklist.md` | Modified | Records verified checks; leaves live verification unchecked. |
| `implementation-summary.md` | Created | Captures implementation decisions, evidence, and limitations. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The adapter is stateless and does not write files or log raw payload contents. Project-root resolution follows the existing Devin trim-and-fallback convention: non-blank payload `cwd`, then `DEVIN_PROJECT_DIR`, then the process directory. An empty matcher is intentional so unclassifiable tool names reach the adapter and are denied rather than bypassing it.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Default-deny the PermissionRequest path | Approval is the safe failure direction; unknown or malformed requests must not silently proceed. |
| Reuse the two shared cores without changes | Keeps path exemptions and dispatch hard rules single-sourced across runtimes. |
| Require all PermissionRequest identity fields | A request without its event, tool, session, turn, or tool-use identity cannot be safely correlated. |
| Register with an empty matcher | The adapter must see unknown tools so the explicit fail-closed branch remains effective. |
| Emit nested and top-level decision fields | The nested shape matches this repository's Devin adapters; the top-level `approve`/`block` fields match the current Devin hook contract. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| New adapter syntax | PASS: `node --check` |
| New process suite | PASS: 2/2 tests; matrix rows include 5 allows/denies as specified, with five deny outcomes |
| Discrimination falsifier | PASS: all five expected-deny rows mismatch a naive always-allow classifier |
| Shared spec-gate core suite | PASS: 73/73 with `AI_SESSION_CHILD` removed and module mocks enabled |
| Shared dispatch-rule suite | PASS: 6/6 |
| Config syntax | PASS: `.devin/hooks.v1.json` parses with `python3 -m json.tool` |
| Comment hygiene | PASS: no violations in either new JavaScript file |
| sk-code drift guards | PASS: alignment-drift, stack-folders, and router-sync; router-sync 10/10 |
| Shared core diff | PASS: no diff in `spec-gate-core.mjs` or `dispatch-rule-checks.mjs` |
| Live Devin probe (adapter correctness) | PASS: captured real `PermissionRequest` payloads for `write` and `exec` tool calls against an exempt `/tmp` target; the adapter returned `{"decision":"approve","hookSpecificOutput":{"permissionDecision":"allow",...}}` for both, matching the expected policy outcome exactly. |
| Live Devin probe (runtime honors the decision) | **FAIL — devin CLI limitation, not an adapter defect** (see finding table below). |

**Live verification finding (escalation).** Methodology: backed up `.devin/hooks.v1.json`, temporarily pointed the registered `PermissionRequest` command at a wrapper script that tees stdin/stdout to log files around the real adapter, dispatched `devin -p "Create a new file at /tmp/<probe>.txt ..."` under several permission modes, captured the exact payload and the adapter's exact decision, then restored the original file. All probes below targeted `/tmp`, which `isExemptTargetPath` classifies as exempt (expected: `allow`).

| `--permission-mode` | Hook fired? | Adapter decision | Devin's actual outcome |
|---|---|---|---|
| `auto` (default) | **Yes**, twice (once for `write`, once for an `exec` fallback) | `approve` / `allow` for both | **Rejected** — "Running in non-interactive mode. Use --permission-mode dangerous to auto-approve all tools." Devin's own non-interactive-mode policy overrides the hook's answer for non-read-only tools; the hook's decision is discarded. |
| `autonomous --sandbox` | No | n/a | Rejected at the OS sandbox layer (`/tmp` not in a granted `Write(...)` scope) before the hook's answer could matter. |
| `dangerous` | **No** | n/a | **Approved unconditionally** — the file was created without the hook ever being invoked. |
| `smart` | n/a | n/a | Not a valid runtime value despite appearing in `--help`; the binary's actual error lists only `normal (auto)`, `accept-edits`, `dangerous (yolo, bypass)`, `autonomous (requires --sandbox)`. |
| `bypass` **(the mode this repo actually uses)** | **No** | n/a | Approved unconditionally, same as `dangerous` — `bypass` is an alias for it. The hook is never consulted, so this phase's adapter is inert in real use. `PreToolUse` guards still fire under this mode; see the addendum below. |

**Operator-mode addendum (added after the operator confirmed real usage).** This repo dispatches Devin as `devin --permission-mode bypass`, which was not among the modes probed above. `bypass` behaves like `dangerous`: the `PermissionRequest` hook is never consulted at all, so the adapter this phase built is **inert in actual use** — a no-op, not a bypassed safeguard.

That is not a security hole, and the distinction matters: a follow-up probe confirmed **`PreToolUse` still fires under `bypass`**, so the spec-gate and dispatch guards registered on that event remain fully active. Devin's guard coverage under the mode actually used is therefore intact; only the approval-prompt event — which `bypass` exists precisely to skip — is absent. The same check on Cursor found `--force` also still fires `preToolUse`. Read the conclusion below as scoped to `PermissionRequest` alone, never as a statement about overall guard coverage.

**Conclusion**: in devin 3000.2.17, no tested non-interactive permission mode lets the `PermissionRequest` hook's decision control the final tool-approval outcome. `auto` consults the hook (proving it is wired correctly) but ignores the answer; `dangerous` never consults it at all. The adapter built in this phase is provably correct -- it computes the right decision for a real payload -- but Devin's current CLI does not act on that decision for `-p` sessions under any permission mode this probe could reach. This is a devin CLI-runtime limitation discovered by this phase's own live verification, not a defect in `permission-request-policy.mjs`.

**What this means for REQ-002/REQ-006**: both requirements asked for a live probe showing "an approval-needing call now resolves through the new adapter instead of the empty-array silent rejection." The empty-array behavior and the current wired-adapter behavior are observably IDENTICAL under `auto` mode (both reject) -- not because the fix is wrong, but because Devin's runtime does not yet consult the hook's answer for this decision. The adapter is correctly built, tested, and registered, and stands ready to take effect the moment Devin's non-interactive runtime is updated to honor `PermissionRequest` decisions (mirroring how the phase 004/008 hook-dormancy finding was later resolved by a devin-side schema fix, not a rebuild of the adapters). Recommend the operator track this as an upstream devin-CLI question/bug report rather than further adapter work on this side.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. The `PermissionRequest` hook's decision is not currently honored by devin's non-interactive runtime under any tested permission mode — see "Live Verification Finding" above. This is the primary open item, and it is an upstream CLI behavior, not something fixable from the adapter side.
2. The first unpinned shared-core test attempt inherited `AI_SESSION_CHILD=1` from the host session and reported 25 failures; the authoritative rerun removed that inherited flag and passed cleanly (67/67 confirmed independently with `--experimental-test-module-mocks`). The adapter test itself does not depend on that flag.
<!-- /ANCHOR:limitations -->
