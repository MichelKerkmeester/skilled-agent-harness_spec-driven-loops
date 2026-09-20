---
title: "Implementation Summary"
description: "A UTCP cli manual registers and answers through Code Mode, returning MagicPath's own JSON; the transport works, and four of its properties reshape the phases that follow."
trigger_phrases:
  - "cli transport proof summary"
  - "utcp cli discovery contract"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/017-mcp-magicpath/001-cli-transport-proof"
    last_updated_at: "2026-08-29T11:48:56Z"
    last_updated_by: "session"
    recent_action: "Proved the cli transport and recorded four properties that reshape phase 002"
    next_safe_action: "Execute 002-manual-and-auth, starting from the discovery-emitter finding"
    blockers:
      - "Phase 002 needs the version decision and a credential before its live checks"
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Phase** | 1 of 5 |
| **Status** | Complete |
| **Completed** | 2026-08-29 |
| **Branch** | `skilled/v4.0.0.0` |
| **Executor** | Orchestrator, proving each property by call rather than by reading the plugin's documentation |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing that persists, which was the point. The phase existed to answer whether the transport four other phases depend on actually works, and it does: a `cli` manual registered, and a call through Code Mode returned MagicPath's own JSON, including the CLI version and its authentication verdict.

Four properties of that transport came out of the proof, and each one changes work downstream.

**Registration is discovery-only.** The `cli` call template accepts `commands`, `env_vars`, `working_dir` and `auth`, and nothing else - there is no inline tool list. The registered command's stdout must itself be a UTCP manual. The first attempt registered MagicPath's own `info` output and was rejected for exactly that reason, naming the missing `tools` array. So the next phase cannot hand-write tools into the configuration; it needs a discovery emitter this repository owns.

**A failing command does not throw.** A missing binary returned the shell's `command not found` text, and an unknown subcommand returned the CLI's own error string. Both came back as ordinary return values. The transport swallows exit status, so failure is legible only if the caller inspects what it got.

**Bridged tools are synchronous, and a returned promise vanishes.** Calls return values directly, with no `await`. Returning a promise from the executed code marshals as an empty object with no error at all - a silent, total loss of the result. Two earlier attempts here produced `{}` and looked like empty successes.

**The binary resolves from PATH.** A tool invoking the bare name answered identically to one naming the absolute path, so the eventual manual does not need to hardcode one machine's filesystem.

### Files Changed

| File | Change |
|------|--------|
| None | The probe was registered at runtime and written nowhere; the shared configuration's checksum is unchanged |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The plan called for adding a probe to the shared configuration. That file is read by four long-running servers, and a malformed entry would have reached all of them, so the probe was registered through the runtime registration tool instead. The proof is identical and the blast radius is a session rather than a machine. The deviation is recorded here rather than absorbed silently, and the requirement it serves - a `cli` manual that registers and answers - is met more safely than as written.

Each property was established by a call whose result is quoted above, not by reading the plugin's documentation. That mattered more than expected: the documentation's own usage example implies tools can be declared inline, and the registration rejected exactly that shape.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Register at runtime, not in the shared file.** The question was whether the transport answers, and that can be asked without touching a file four live servers read. The configuration ends the phase byte-identical.
- **Probe two binary-resolution strategies at once.** One tool used the bare name and one the absolute path, so a single call could distinguish a PATH problem from a transport problem rather than leaving both suspected.
- **Treat the documentation as a hypothesis.** The plugin's readme shows a template whose `commands` appear to define the tool directly. The registration rejects that shape. Every property recorded here was observed instead.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Configuration baseline | sha256 `2fdac285941e9d99`, 13 manuals |
| Configuration after the phase | Identical checksum, 13 manuals, `git status` clean |
| Registration with a non-manual discovery command | Rejected, naming the missing `tools` array |
| Registration with a manual-emitting discovery command | `success:true`, 3 tools |
| Call returning MagicPath data | `cli.version "2.3.2"`, `auth.authenticated false` |
| Bare-name binary resolution | Answered identically to the absolute path |
| Argument substitution | `echo_arg({token:"SUBST-9f3a-PROOF"})` returned `SUBST-9f3a-PROOF` |
| Missing binary | Returned `command not found` text, did not throw |
| Unknown subcommand | Returned `error: unknown command '...'`, did not throw |
| Tool discovery | Search returned every probe tool with a generated TypeScript interface |
| Input schema to signature | A declared `token` string became a typed parameter |

Two failed attempts are worth keeping because they are traps rather than mistakes. Executed code with TypeScript type annotations failed to parse, and code using top-level `await` was rejected outright; between them they produced an error that pointed at the wrong line. Then the corrected version returned `{}` with `success:true` and no logs, because the returned promise was serialized rather than awaited. A caller that had trusted that result would have concluded the tool returned nothing.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- The proof used a static file as the discovery command. A real emitter has to produce the manual for the installed CLI, and nothing here shows what happens when discovery is slow, fails, or emits a manual that parses but describes commands the host lacks.
- Only the unauthenticated path was exercised, because the machine has no MagicPath credential. How the transport surfaces an authentication failure is unknown, and it is the state a new operator starts in.
- Registration is session-scoped, so nothing proven here survives into another session until a manual is written to the shared configuration.
- The probe exercised three tools. Whether a discovery manual describing the full command surface still registers cleanly, and how large it can grow before search quality suffers, is untested.
<!-- /ANCHOR:limitations -->

---
