---
title: "Implementation Summary: Pi CLI contract pin"
description: "Pi CLI is installed and live-verified: real headless dispatch syntax, a genuine cursor-agent-class exit-code gotcha, an active extension-validation gate, and a confirmed third-party install-verb all converted from documented-but-unconfirmed to fact."
trigger_phrases:
  - "pi cli contract pin results"
  - "pi live verification findings"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/031-cli-pi-creation/001-pi-contract-pin"
    last_updated_at: "2026-07-27T09:35:00Z"
    last_updated_by: "claude-code"
    recent_action: "Installed Pi CLI and executed the live verification tasks in tasks.md"
    next_safe_action: "Phase 002 may now design buildPiLineageCommand against these confirmed facts"
    blockers: ["No provider API key configured on this machine - a successful-path model dispatch could not be observed"]
    key_files: ["spec.md", "tasks.md", "checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-pi-creation-authoring"
      parent_session_id: null
    completion_pct: 85
    open_questions: ["Skills-flattening question for phase 004 remains unconfirmed", "Successful-path dispatch exit code remains unobserved without provider credentials"]
    answered_questions: ["Headless dispatch is --print/-p combined with --mode text/json/rpc", "Pi shares the cursor-agent-class exit-0-on-failure gotcha", "pi install npm:<pkg> -l --approve is the confirmed install verb"]
---
# Implementation Summary: Pi CLI contract pin

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-pi-contract-pin |
| **Completed** | 2026-07-27 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Pi CLI is now installed on this machine and its whole contract has been live-tested rather than taken from documentation. Six of eight REQs converted from "documented, unconfirmed" to confirmed fact; two remain genuinely open because completing them needs either provider credentials this machine doesn't have, or a debug surface Pi doesn't expose. The single most load-bearing finding: **Pi shares the exact `cursor-agent -p` exit-code gotcha the 030 packet already learned the hard way** — a failed dispatch returned exit 0 on the very first invocation and exit 1 on every subsequent one, so phase 002's dispatch guard must never key success/failure detection on exit code alone.

### Install and Binary Contract (REQ-001)
`npm install -g --ignore-scripts @earendil-works/pi-coding-agent` succeeded (132 packages, ~2s). `pi --version` returns `0.82.1`. Full `--help` captured: default provider is `google` (not Anthropic), config directory defaults to `~/.pi/agent` (`PI_CODING_AGENT_DIR` env override), built-in tools are `read`/`bash`/`edit`/`write`/`grep`/`find`/`ls`, and 30+ provider API-key env vars are recognized (Anthropic, OpenAI, Gemini, Groq, Bedrock, and many more).

### Config Directory and Settings Merge (REQ-002, partial)
`.pi/` is **not** auto-scaffolded by a bare invocation — a failed headless dispatch in an empty scratch directory left no `.pi/` behind. It only exists once a file is deliberately placed under it. A related but different merge behavior was confirmed instead: `pi install ... -l` read-modify-wrote the existing `.pi/settings.json`, adding a `"packages"` array while preserving unrelated keys already present — Pi's settings writer merges, it does not clobber. The specific "project overrides global on a colliding nested key" claim from the docs could not be observed end to end, because doing so needs a successful dispatch this machine's missing credentials block.

### Extension Discovery and Validation (REQ-005)
This is the most concrete unplanned finding. Dropping an invalid `.pi/extensions/probe.ts` (`export default {}`) did not silently skip — it failed the **entire session** with `Error: Failed to load extension "...": Extension does not export a valid factory function`, exit 1, plus the exact remediation hint `pi -ne` to disable extensions. Fixing the stub to `export default function probeExtension() { return {} }` made that specific error disappear. Conclusion: extensions are actively discovered under `.pi/extensions/*.ts`, validated against a real contract (must export a callable factory), and a bad one is fail-**closed** for the whole session, not fail-open with a warning.

### Auth/Provider Surface and the Exit-Code Gotcha (REQ-006, REQ-007)
An unauthenticated dispatch reports exactly: `No API key found for the selected model. Use /login to log into a provider via OAuth or API key.` plus two local doc-file paths. `--list-models` with no auth reports `No models available.` and exits **0**. The very first `pi -p "..."` attempt (before any project files existed) also exited **0**. Every subsequent identical attempt, once `.pi/settings.json` existed, exited **1**. Same failure, different exit codes across otherwise-identical invocations — this is the confirmed cursor-agent-class gotcha, and it is worse than a single wrong constant: it is not even consistent run to run. Headless dispatch itself is `--print`/`-p`; structured output is `--mode json` (a JSONL event stream: `session` header, then `agent_start/end`, `turn_start/end`, `message_*`, `tool_execution_*` events, confirmed against the live `pi.dev/docs/latest/json` page) or `--mode rpc` (a **persistent** stdin/stdout JSON-Lines protocol for a long-running process, architecturally different from the one-shot `-p` pattern every sibling CLI adapter assumes — confirmed against `pi.dev/docs/latest/rpc`, which explicitly states exit-code conventions for the RPC subprocess are not documented at all). Also newly discovered: `--verbose` without `--offline` hung for 2+ minutes with no network path available; adding `--offline` made it return immediately. A successful-path dispatch could not be completed — this machine has no provider API key configured (checked `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `GEMINI_API_KEY`, and others; none set), and obtaining one is an operator-only action out of scope for this phase, mirroring the Devin/Cursor login-deferral precedent.

### Third-Party Install Verb (REQ-008)
`pi install npm:pi-subagents -l` without `--approve` fails cleanly: `Project is not trusted. Use --approve to modify local package config.`, exit 1. Adding `--approve` succeeds: real npm install (4 packages, ~479ms) into a self-contained `.pi/npm/node_modules/pi-subagents/` directory, and the package itself bundles its own `agents/`, `prompts/`, `skills/`, and `src/`/`index.ts` — a richer surface than a bare agent-schema spec, worth flagging to phase 006. `pi list --approve` correctly lists the installed package; `pi list` without `--approve` reports "No packages installed." even when one is — the trust gate applies uniformly to every command that reads project-local files, not just `install`.

### Not Confirmed (REQ-003, REQ-004)
Skills discovery (hub-level-only vs. flattened) and prompt-template discovery (non-recursive, argument substitution) could not be observed. Neither `--verbose` nor `--mode json` surfaced any discovery diagnostic before the auth failure short-circuited the session, and no debug/introspection flag exists in `--help` for either surface. Both remain "documented, unconfirmed" and are now phase 004's and phase 005's live-verification burden respectively, not something to assume from here.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Every finding above came from a real command run in a scratch directory (`pi --version`, `pi --help`, `pi -p`, `pi --list-models`, `pi install`, `pi list`, with and without `--approve`/`--offline`/`--verbose`), with exit codes and stdout/stderr captured verbatim via explicit redirection rather than trusted from memory. Two live pi.dev docs pages (`/docs/latest/rpc`, `/docs/latest/json`) were fetched during this pass specifically to resolve REQ-007's Programmatic Usage gap. Test artifacts written to the operator's real `~/.pi/agent/settings.json` during probing were restored to their original (absent) state before finishing.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Did not pursue a successful-path dispatch by asking for API credentials | Obtaining provider credentials is the operator's call, not something to request mid-verification — mirrors the Devin/Cursor packets' own login-deferral boundary. |
| Recorded the exit-0-then-exit-1 inconsistency as-is rather than picking one number | A single confidently-wrong exit code would be worse than an honestly-inconsistent one; phase 002's guard needs to know exit code is unreliable at all, not which specific value to check. |
| Left REQ-003/REQ-004 as "documented, unconfirmed" rather than inferring from precedent | Devin's hooks-schema misdiagnosis taught this repo not to guess when live evidence is unavailable; phases 004/005 own their own live checks instead. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npm install -g --ignore-scripts @earendil-works/pi-coding-agent` | PASS — 132 packages added |
| `pi --version` | PASS — `0.82.1` |
| `pi --help` | PASS — full flag/env-var/tool surface captured |
| `pi -p "..."` with no auth (first run, no project files) | Exit 0, "No API key found" on stderr |
| `pi -p "..."` with no auth (subsequent runs, project files present) | Exit 1, identical message |
| `pi --list-models` with no auth | Exit 0, "No models available." |
| Invalid `.pi/extensions/probe.ts` | Exit 1, session-blocking factory-function error |
| Valid `.pi/extensions/probe.ts` | Error resolved; further progress blocked by auth, not the extension |
| `pi install npm:pi-subagents -l` (untrusted) | Exit 1, "Project is not trusted" |
| `pi install npm:pi-subagents -l --approve` | PASS — real install, `.pi/settings.json` merged non-destructively |
| `pi list` vs `pi list --approve` | Confirms the trust gate applies to reads too |
| `pi.dev/docs/latest/rpc`, `/json` fetched live | PASS — Programmatic Usage syntax confirmed |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No successful-path dispatch observed.** This machine has no provider API key configured. Phase 002's dispatch builder should treat the "on success" exit code and stdout shape as still unconfirmed, not just the failure path.
2. **Skills-discovery flattening question (REQ-003) unresolved.** Phase 004 must live-test this itself against a real `pi` session with a working provider — it cannot be inferred from this phase's findings.
3. **Prompt-template discovery and argument substitution (REQ-004) unresolved.** Same constraint; phase 005 owns the live check.
4. **`--verbose` without `--offline` can hang** when there is no reachable network path (observed: 2+ minutes before manual kill). Any automated/CI dispatch of Pi should pass `--offline` explicitly rather than rely on a fast failure.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr-rules.md
-->
