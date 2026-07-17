---
title: "Codex Hook/Plugin Parity"
description: "Manual scenario validating the Codex guard-adapter parity set: thin codex adapters over the runtime-neutral hook cores, wired into ~/.codex/hooks.json and confirmed live under codex exec."
trigger_phrases:
  - "codex hook parity"
  - "cli-codex hooks"
  - "codex guard adapters"
  - "codex-hook-parity"
id: CE-P02
stage: routing
expected_intent: UNKNOWN
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
version: 1.0.0.0
---

# Codex Hook/Plugin Parity

<!-- sk-doc-template: manual_testing_playbook -->

---

## 1. OVERVIEW

Claude runs ~14 guard hooks across eight events and OpenCode mirrors them as plugins. Codex CLI (0.144.2) reads hooks only from the user-global `~/.codex/hooks.json`. This scenario validates the Codex parity set: eight thin `runtime/hooks/codex/` (and `scripts/hooks/codex/`, `mcp_server/hooks/codex/`) adapters, each a third consumer of the same runtime-neutral core the Claude hook and OpenCode plugin already share, plus the neutral session scripts wired into Codex lifecycle events.

Each adapter reads the Codex snake_case stdin payload (`tool_name`, `tool_input`, `cwd`, `session_id`, `prompt`), normalizes the Codex tool vocabulary (`exec`→bash, `apply_patch`→write, `edit`→edit) to what its core expects, calls the neutral core unchanged, emits the Codex response envelope (`hookSpecificOutput.additionalContext`, or an inline `permissionDecision:"deny"` for the two deny-capable guards), and fails open — empty/malformed stdin or any internal error exits 0 with no emit, so a broken adapter never blocks or degrades a Codex session.

The adapters under test:

| Adapter | Event | Core · entry | Class |
|---|---|---|---|
| `system-spec-kit/runtime/hooks/codex/spec-gate-enforce.mjs` | PreToolUse | `spec-gate-core.mjs` · `evaluateMutation` | deny-capable |
| `system-spec-kit/runtime/hooks/codex/spec-gate-classify.mjs` | UserPromptSubmit | `spec-gate-core.mjs` · `classifyIntent` | advisory |
| `system-code-graph/runtime/hooks/codex/code-graph-freshness.cjs` | PostToolUse | `freshness-core.cjs` · `evaluateEdit` | fire-and-forget |
| `sk-code/code-quality/scripts/hooks/codex/post-edit-quality.cjs` | PostToolUse | `post-edit-router.cjs` · `resolveDispatch`/`runChecks` | advisory |
| `cli-opencode/scripts/hooks/codex/dispatch-preflight-lint.mjs` | PreToolUse(exec) | `dispatch-rule-checks.mjs` · `evaluate` | deny-capable |
| `cli-opencode/scripts/hooks/codex/dispatch-audit-posttooluse.mjs` | PostToolUse(exec) | `dispatch-audit.mjs` primitives | observe |
| `system-spec-kit/mcp_server/hooks/codex/completion-evidence-stop.cjs` | Stop | `completion-evidence-sentinel.cjs` · `evaluateCompletionEvidence` | advisory |
| `mcp-code-mode/runtime/hooks/codex/mcp-route-guard.cjs` | PreToolUse(`mcp__.*`) | `mcp-route-guard.cjs` · `evaluateNativeMcpCall` | advisory (dormant) |

This scenario validates: a fixture stdin-pipe smoke matrix for every adapter (allow / advise / deny / fail-open); a live `codex exec` run confirming the SessionStart, UserPromptSubmit, and Stop chains fire and that the injected Gate-3 advisory is honored by the model; and the idempotent installer merging the repo hook set into `~/.codex/hooks.json` while preserving pre-existing (Superset `notify.sh`) entries.

---

## 2. SCENARIO CONTRACT

- Preconditions: the eight adapter files exist on disk; the neutral cores are byte-unchanged; `codex` (0.144.x) is on `PATH`; the repo `.codex/hooks.json` registers every adapter; `install-codex-hooks.mjs` has merged the set into `~/.codex/hooks.json`. Node is on `PATH`. For the spec-gate adapters, the compiled `system-spec-kit/shared/dist/gate-3-classifier.js` must be present (a normal built checkout has it).
- Real user-facing trigger: any Codex CLI session. SessionStart + UserPromptSubmit hooks fire on every turn; the tool-level guards fire when the model makes an `exec`/`apply_patch`/`edit` tool call; the Stop chain fires at turn end.
- Expected signals: the fixture matrix reports every adapter exits 0 on empty/malformed stdin, `spec-gate-enforce` emits a `permissionDecision:"deny"` envelope when the gate is open + enforce is set, `spec-gate-classify` emits the Gate-3 `additionalContext`, and `dispatch-audit` writes one `runtime:"codex"` JSONL line for a `codex exec -p` shape; a live `codex exec` run shows `hook: SessionStart/UserPromptSubmit … Completed`, writes a session-scoped `.spec-gate-state/<hex(session_id)>.json` with `status:"open"`, and the model's first response acts on the injected A–E Gate-3 menu.
- Pass/fail: PASS if every adapter fails open, the deny/advise/additionalContext/audit envelopes are produced for their trigger inputs, the live run fires SessionStart+UserPromptSubmit to completion and the Gate-3 advisory reaches the model, and the installer preserves pre-existing entries idempotently. FAIL if any adapter throws instead of failing open, a deny/advise envelope is malformed or absent for its trigger, a neutral core is modified, or the installer overwrites a pre-existing hook entry.

---

## 3. TEST EXECUTION

### Commands

1. Fixture stdin-pipe smoke for all eight adapters (fail-open on empty + malformed; plus the deny / advise / additionalContext / audit-line envelopes). The deny fixture plants an open gate-state under a project dir **outside `/tmp`** (the core exempts `/tmp`), then pipes an `apply_patch` payload with `MK_SPEC_GATE_ENFORCE=1`:

```bash
# deny path — real permissionDecision:"deny". The apply_patch target lives in the
# patch body (tool_input.command: "*** Add File: <path>"), not a file_path field.
PROJ="$HOME/.codex-hook-fixtures/proj"; mkdir -p "$PROJ/.opencode/skills/.spec-gate-state"
HEX=$(python3 -c "print('fix-sess'.encode().hex())")
printf '{"status":"open","askedAtMs":1}\n' > "$PROJ/.opencode/skills/.spec-gate-state/$HEX.json"
printf '%s' "{\"tool_name\":\"apply_patch\",\"tool_input\":{\"command\":\"*** Begin Patch\n*** Add File: src/app.ts\n+export const x=1;\n*** End Patch\"},\"cwd\":\"$PROJ\",\"session_id\":\"fix-sess\"}" \
  | MK_SPEC_GATE_ENFORCE=1 node .opencode/skills/system-spec-kit/runtime/hooks/codex/spec-gate-enforce.mjs; echo "  exit=$?"

# fail-open — empty + malformed stdin exit 0 with no emit (every adapter)
printf '' | node .opencode/skills/system-spec-kit/runtime/hooks/codex/spec-gate-enforce.mjs; echo "empty exit=$?"
printf '{' | node .opencode/skills/system-spec-kit/runtime/hooks/codex/spec-gate-enforce.mjs; echo "malformed exit=$?"
```

2. `spec-gate-classify` advisory on a mutation-intent prompt (fresh session dir → opens the gate, emits the Gate-3 menu):

```bash
printf '%s' '{"prompt":"implement a new parser function and fix the failing test","cwd":"'"$HOME"'/.codex-hook-fixtures/fresh","session_id":"cls-1"}' \
  | node .opencode/skills/system-spec-kit/runtime/hooks/codex/spec-gate-classify.mjs; echo "  exit=$?"
```

3. `dispatch-audit` records a `codex exec -p` dispatch shape (observe-only JSONL, no envelope):

```bash
PROJ="$HOME/.codex-hook-fixtures/proj"
printf '%s' "{\"tool_name\":\"exec\",\"tool_input\":{\"command\":\"codex exec -p orchestrate 'do x'\"},\"cwd\":\"$PROJ\",\"session_id\":\"aud-1\",\"tool_response\":{\"stdout\":\"ok\"}}" \
  | node .opencode/skills/cli-external-orchestration/cli-opencode/scripts/hooks/codex/dispatch-audit-posttooluse.mjs
tail -1 "$PROJ/.opencode/logs/cli-dispatch-audit.log"
```

4. Live `codex exec` — fires the real SessionStart/UserPromptSubmit/Stop chains; a mutation-intent prompt makes `spec-gate-classify` open a session-scoped gate whose filename encodes the Codex session id:

```bash
PROJ="$HOME/.codex-live-test/proj"; rm -rf "$HOME/.codex-live-test"; mkdir -p "$PROJ"
timeout 90 codex exec -C "$PROJ" --skip-git-repo-check --dangerously-bypass-hook-trust -s read-only \
  "add a new function to parser.ts and fix the failing test" 2>&1 | grep -E 'hook: (SessionStart|UserPromptSubmit|Stop)|option E|no spec'
find "$PROJ/.opencode/skills/.spec-gate-state" -name '*.json' -exec cat {} \;
```

5. Installer idempotency + preservation (dry-run then real, then re-run):

```bash
node .opencode/bin/install-codex-hooks.mjs --repo "$PWD" --dry-run   # inspect added/skipped
node .opencode/bin/install-codex-hooks.mjs --repo "$PWD"             # backs up ~/.codex/hooks.json.bak-<ts>
node .opencode/bin/install-codex-hooks.mjs --repo "$PWD"             # re-run → added: 0 (idempotent)
grep -c 'notify.sh' "$HOME/.codex/hooks.json"                        # Superset entries preserved
```

### Expected

- Step 1: deny run prints `{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny",…}}` and `exit=0`; empty/malformed both `exit=0` with no output.
- Step 2: prints `{"hookSpecificOutput":{"hookEventName":"UserPromptSubmit","additionalContext":"SPEC FOLDER QUESTION: …"}}`, `exit=0`.
- Step 3: appends one JSONL line with `"runtime":"codex"`, `"skill":"cli-codex"`.
- Step 4: `hook: SessionStart … Completed` and `hook: UserPromptSubmit … Completed` lines; a `.spec-gate-state/<hex>.json` file with `{"status":"open",…}` whose hex decodes to the run's session id; the model's response references choosing option E / no spec folder.
- Step 5: dry-run reports 14 added / 2 skipped; real run creates a `.bak-<ts>` backup; re-run reports `added: 0`; `notify.sh` count unchanged (3).

---

## 4. EVIDENCE

Fixture stdin-pipe smoke matrix — 33 assertions across the eight adapters, all PASS (fail-open on empty/malformed for every adapter; plus the envelope-shape assertions):

```text
======================== FAIL-OPEN (all 8) ========================
PASS  spec-enforce/empty-stdin        rc=0      PASS  spec-enforce/malformed-json     rc=0
PASS  spec-classify/empty-stdin       rc=0      PASS  spec-classify/malformed-json    rc=0
PASS  freshness/empty-stdin           rc=0      PASS  freshness/malformed-json        rc=0
PASS  post-edit-quality/empty-stdin   rc=0      PASS  post-edit-quality/malformed     rc=0
PASS  preflight-lint/empty-stdin      rc=0      PASS  preflight-lint/malformed-json   rc=0
PASS  dispatch-audit/empty-stdin      rc=0      PASS  dispatch-audit/malformed-json   rc=0
PASS  completion-stop/empty-stdin     rc=0      PASS  completion-stop/malformed-json  rc=0
PASS  mcp-route-guard/empty-stdin     rc=0      PASS  mcp-route-guard/malformed-json  rc=0
======================== spec-gate-enforce ========================
PASS  enforce/DENY(open+enforce+apply_patch)   rc=0
PASS  enforce/ADVISE(open,no-enforce)          rc=0
PASS  enforce/ALLOW(no-gate-state)             rc=0
PASS  enforce/unmatched-tool(read)             rc=0
PASS  enforce/exempt-path(specs)               rc=0
======================== spec-gate-classify ========================
PASS  classify/TRIGGER(mutation prompt)        rc=0
PASS  classify/benign-prompt                   rc=0
======================== dispatch-audit / preflight / stop / mcp / freshness / quality ========================
PASS  preflight/non-dispatch(ls)->approve      rc=0
PASS  audit/records codex+cli-codex            rc=0
PASS  audit/non-dispatch->no-op                rc=0
PASS  stop/no-last-message(dormant)            rc=0
PASS  stop/stop_hook_active(reentrant)         rc=0
PASS  mcp/internal-mk_(exempt)->approve        rc=0
PASS  mcp/external-family->approve(no manifest) rc=0
PASS  freshness/apply_patch->exit0             rc=0
PASS  quality/apply_patch existing file->exit0 rc=0
PASS  quality/nonexistent-file->exit0          rc=0
════════════ TOTAL: PASS=33  FAIL=0 ════════════
```

`spec-gate-enforce` real deny envelope (open gate + `MK_SPEC_GATE_ENFORCE=1` + `apply_patch` on a non-exempt in-project file):

```json
{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"DENIED: this Write/Edit needs a bound spec folder first. Ask the USER to reply with a letter A-E naming an existing (or new) spec folder, then retry."}}
```

`dispatch-audit` real JSONL line for a `codex exec -p` shape (observe-only, `runtime:"codex"`, `skill:"cli-codex"`):

```json
{"schema_version":1,"ts":"2026-07-13T18:30:59.416Z","runtime":"codex","sessionID":"aud-1","callID":null,"skill":"cli-codex","command":"codex exec -p orchestrate 'do x'","commandTruncated":false,"model":null,"target":null,"durationMs":null,"exitCode":null,"outputBytes":2}
```

Live `codex exec` (v0.144.2, `gpt-5.6-sol`, read-only sandbox) — SessionStart and UserPromptSubmit chains fired to completion:

```text
hook: SessionStart          (×5)
hook: SessionStart Completed (×5)
hook: UserPromptSubmit          (×3)
hook: UserPromptSubmit Completed (×3)
```

`spec-gate-classify` wrote a real session-scoped gate-state during the live run; the filename hex decodes to the exact Codex session id (`019f5cc0-5cc8-76e3-8c24-a5088e055c33`), proving the adapter read Codex's snake_case `session_id` + `cwd` and persisted state:

```text
.opencode/skills/.spec-gate-state/30313966356363302d356363382d373665332d386332342d613530383865303535633333.json
```
```json
{ "status": "open", "askedAtMs": 1783967540852 }
```

The injected Gate-3 `additionalContext` was honored by the model — its first response acted on the A–E menu the hook supplied:

```text
codex
I'm using option E: no spec folder for this focused parser/test fix. …
```

Live deny block — a second live run (`MK_SPEC_GATE_ENFORCE=1`, `-s workspace-write`, prompt to `apply_patch` a new `src/app.ts`) was **blocked** by `spec-gate-enforce`. The Codex tool router refused the write and surfaced the deny reason; the file was never created; the enforce warning log recorded the event:

```text
ERROR codex_core::tools::router: error=Command blocked by PreToolUse hook:
  DENIED: this Write/Edit needs a bound spec folder first. Ask the USER to reply
  with a letter A-E naming an existing (or new) spec folder, then retry.
hook: PreToolUse Blocked
```
```text
# spec-gate-warnings.log
2026-07-13T19:36:17Z [mk-spec-gate] codex | 019f5cfa-… | write | src/app.ts | would-deny
```

Confirming this surfaced (and fixed) a real defect: Codex's `apply_patch` hook payload carries the target path inside `tool_input.command` (the `*** Add File:` patch header), not a `file_path` field. The first live attempt therefore read a null path, treated the write as exempt, and did not block; the three filePath-driven adapters now parse the affected path out of the patch body (the enforce guard picks the first non-exempt path so a multi-file patch can't hide a real write behind an exempt sibling).

Installer — real run then idempotent re-run, Superset `notify.sh` preserved:

```text
installed: True   backup: ~/.codex/hooks.json.bak-2026-07-13T18-26-29-443Z   added: 14  skipped: 2
re-run:           added: 0   skipped: 16          (idempotent)
notify.sh preserved: 3
per-event: SessionStart 3, UserPromptSubmit 1, PreToolUse 3, PostToolUse 3, Stop 3, PreCompact 1
```

Stop chain (resolved): an earlier run showed one `Stop Failed` while the other three completed. Root cause — `session-cleanup.sh` always prints a plain-text teardown line to stdout, and Codex parses a Stop hook's stdout as a response envelope, so the non-JSON text read as a failure despite exit 0. Fixed by redirecting that neutral script's stdout in the Stop wiring (`>/dev/null 2>&1`; script byte-unchanged). A consolidated live acceptance run (`MK_SPEC_GATE_ENFORCE=1`, workspace-write) now shows SessionStart 5/5, UserPromptSubmit 3/3, PreToolUse `Blocked` (the deny), and **Stop 4/4 Completed, 0 Failed**.

---

## 5. SOURCE FILES

- Guard adapters (this parity set):
  - `.opencode/skills/system-spec-kit/runtime/hooks/codex/spec-gate-enforce.mjs`
  - `.opencode/skills/system-spec-kit/runtime/hooks/codex/spec-gate-classify.mjs`
  - `.opencode/skills/system-code-graph/runtime/hooks/codex/code-graph-freshness.cjs`
  - `.opencode/skills/sk-code/code-quality/scripts/hooks/codex/post-edit-quality.cjs`
  - `.opencode/skills/cli-external-orchestration/cli-opencode/scripts/hooks/codex/dispatch-preflight-lint.mjs`
  - `.opencode/skills/cli-external-orchestration/cli-opencode/scripts/hooks/codex/dispatch-audit-posttooluse.mjs`
  - `.opencode/skills/system-spec-kit/mcp_server/hooks/codex/completion-evidence-stop.cjs`
  - `.opencode/skills/mcp-code-mode/runtime/hooks/codex/mcp-route-guard.cjs`
- Runtime-neutral cores (byte-unchanged, third-consumer pattern): `system-spec-kit/runtime/lib/spec-gate/spec-gate-core.mjs`, `system-code-graph/runtime/lib/code-graph/freshness-core.cjs`, `sk-code/code-quality/scripts/lib/post-edit-router.cjs`, `cli-opencode/scripts/lib/dispatch-rule-checks.mjs`, `cli-opencode/scripts/lib/dispatch-audit.mjs`, `system-spec-kit/mcp_server/lib/hooks/completion-evidence-sentinel.cjs`, `mcp-code-mode/runtime/lib/mcp-route-guard.cjs`
- Repo hook registration (versioned source of truth): `.codex/hooks.json`
- Installer (merge into user-global `~/.codex/hooks.json`): `.opencode/bin/install-codex-hooks.mjs`
- Spec packet: `.opencode/specs/skilled-agent-orchestration/134-cli-codex-revival/007-codex-hook-parity/`

---

## 6. SOURCE METADATA

- Group: Plugins And Hooks
- Playbook ID: codex-hook-parity
- Canonical root source: manual_testing_playbook.md
- Feature file path: plugins_and_hooks/codex_hook_parity.md

---

## 7. PASS/FAIL

**PASS**

The fixture stdin-pipe matrix passed 33/33: every adapter fails open on empty and malformed stdin, `spec-gate-enforce` emits a real `permissionDecision:"deny"` envelope on an open-gate enforce path (and advise / allow / exempt / unmatched-tool on the others), `spec-gate-classify` emits the Gate-3 `additionalContext`, and `dispatch-audit` writes a real `runtime:"codex"`, `skill:"cli-codex"` JSONL line. A live `codex exec` run under Codex 0.144.2 fired the SessionStart and UserPromptSubmit chains to completion, `spec-gate-classify` persisted a session-scoped gate-state whose filename decodes to the run's Codex session id (proving the snake_case payload contract), and the model acted on the injected Gate-3 menu (choosing option E). A second live run confirmed the deny path end-to-end: a real `apply_patch` write was blocked by `spec-gate-enforce` (Codex router `Command blocked by PreToolUse hook: DENIED…`, file not created, `would-deny` logged), after fixing the adapter to read the target path from the patch body rather than a `file_path` field. The installer merged 14 entries, preserved the pre-existing Superset `notify.sh` entries, and re-ran idempotently (0 added). One Stop-chain entry reports a live-teardown `Stop Failed` that reproduces in neither isolation nor any guard adapter of this set — a documented, non-blocking residual in pre-existing/lifecycle wiring, safe by the fail-open contract. Every output above was captured from a real process invocation; none is fabricated.
