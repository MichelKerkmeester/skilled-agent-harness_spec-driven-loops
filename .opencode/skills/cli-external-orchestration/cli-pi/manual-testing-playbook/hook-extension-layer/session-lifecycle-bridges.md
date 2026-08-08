---
title: "PI-020 -- Session-lifecycle bridges"
description: "This scenario live-traces the five session-lifecycle extension bridges (session_start, session_shutdown, session_compact, input) against a real authenticated provider and records per-hook firing evidence for `PI-020`."
version: 1.0.0.0
---

# PI-020 -- Session-lifecycle bridges

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `PI-020`.

---

## 1. OVERVIEW

This scenario verifies that the five session-lifecycle bridges (`session-start-context.ts`, `session-start-advisories.ts`, `session-stop-context.ts`, `prompt-advisor.ts`, `session-compact-context.ts`) actually fire on a real provider-backed session, not merely load. It uses a temporary probe extension plus observable side effects (audit-log lines, spawn results, injected prompt length) so each hook's evidence class is explicit.

### Why This Matters

`PI-015` proves registration is accepted; this scenario proves handler bodies execute. A bridge whose event never fires, or whose proxied spawn silently fails, is indistinguishable from a working one without side-effect evidence.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm live firing of `session_start`, `session_shutdown(quit)`, and the `input` transform chain in print mode, plus a clean proxied `session-stop.js` spawn, against an authenticated provider.
- Real user request: `Prove the new session-lifecycle Pi extensions actually run, not just load.`
- Prompt: `Run exactly this shell command and report its output: echo opencode run probe-shape-match`
- Expected execution process: Drop a temporary probe extension that appends every observed event to a log file -> run one authenticated print-mode session with a dispatch-shaped bash command -> read the probe log, the dispatch audit log, and the proxied spawn result -> delete the probe.
- Expected signals: Probe log shows `session_start reason=startup`, `input`, `tool_call`, `tool_result`, and `session_shutdown reason=quit` with a real session id; the `input` event text length materially exceeds the raw prompt length (injected advisor and gate context); `.opencode/logs/cli-dispatch-audit.log` gains a `"runtime":"pi"` line with the same session id; the probe-instrumented `session-stop.js` spawn returns exit 0.
- Desired user-visible outcome: Per-hook firing evidence with the one untraceable event (`session_compact`) explicitly bounded, never inferred.
- Pass/fail: PASS when all print-mode-reachable events fire with side-effect evidence. SKIP the `session_compact` sub-check with blocker `only fires on manual /compact, context threshold, or overflow in an interactive session`. FAIL if a reachable event does not fire, the audit line is absent, or the proxied spawn returns a failure.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Write a temporary probe extension logging every relevant event to a file; never commit it.
2. Run one authenticated print-mode session whose bash command matches a dispatch shape (`opencode run` or `claude -p` as harmless `echo` text), with stdin closed and a timeout above 240s (a down `mk-spec-memory` daemon adds ~49s of MCP retries to startup).
3. Read the probe log, the audit-log delta, and the spawn result before interpreting anything.
4. Delete the probe and re-run the plain offline smoke check.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| PI-020 | Session-lifecycle bridges | Live-trace the five session-lifecycle bridges end to end | `Run exactly this shell command and report its output: echo opencode run probe-shape-match` | Write the probe extension -> `timeout 240 pi --provider opencode-go --model deepseek-v4-flash --approve -p "<prompt>" </dev/null` -> read the probe log -> `grep '"runtime":"pi"' .opencode/logs/cli-dispatch-audit.log` -> delete the probe -> offline smoke re-check | All print-mode-reachable events fire; injected `input` length exceeds the raw prompt; a fresh pi audit line exists; the `session-stop.js` spawn exits 0 | Probe log (2026-07-28) recorded `session_start reason=startup`, `input textLen=970` for a ~90-char prompt (~880 chars injected by the advisor and gate transforms), `tool_call`/`tool_result` for `bash`, `session_shutdown reason=quit`, and `session-stop spawn result: ok(len=0)`. The audit log gained `"runtime":"pi","sessionID":"019fa6d1-..."` for the dispatch-shaped command. `session_compact` did not fire, as expected in print mode. | PASS for every print-mode-reachable bridge. SKIP `session_compact` with the interactive-only blocker. FAIL on a missing event, missing audit line, or failed spawn. | Distinguish the three miss classes before touching code: a non-dispatch-shaped command correctly writes no audit line (`recordDispatch()` fast-exits); `session-stop.js` correctly writes no state without a transcript; a timeout below ~90s can kill startup during the MCP retry loop. |

### Optional Supplemental Checks

- Trigger `session_compact` in a long interactive session via `/compact` and confirm a `session-compact-context` custom message appears in the session file.
- Compare `input` handler ordering by filename to confirm transform chaining is additive (later handlers see earlier injections).

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Evidence-class and isolation rules |
| `../../SKILL.md` | Extension routing and provider boundary |
| `../../references/native-skills-and-extensions.md` | Lifecycle-event confidence labels |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.pi/extensions/session-start-context.ts` | `session_start` -> `session-prime.js` bridge |
| `.pi/extensions/session-start-advisories.ts` | `session_start` -> 4 warn-only CLI checks (TUI-visible only; `notify()` is a print-mode no-op) |
| `.pi/extensions/session-stop-context.ts` | `session_shutdown(quit)` -> `session-stop.js` bridge |
| `.pi/extensions/prompt-advisor.ts` | `input` -> skill-advisor bridge (measured 1.9-2.6s per prompt, capped at its 2.8s budget) |
| `.pi/extensions/session-compact-context.ts` | `session_compact` native recovery port (interactive-only firing) |
| `.pi/extensions/lib/claude-hook-adapter.ts` | Shared spawnSync proxy used by the bridges |
| `.opencode/logs/cli-dispatch-audit.log` | Cross-runtime dispatch audit evidence |

---

## 5. SOURCE METADATA

- Group: Hook Extension Layer
- Playbook ID: PI-020
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `hook-extension-layer/session-lifecycle-bridges.md`
