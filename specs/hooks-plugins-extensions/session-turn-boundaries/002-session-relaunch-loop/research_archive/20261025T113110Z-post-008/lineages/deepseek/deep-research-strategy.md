---
title: Deep Research Strategy - Session Relaunch Loop Audit
description: Tracks the five-iteration audit of the session relaunch loop after phase 008, covering core, adapters, command surface, docs and spec-record alignment.
trigger_phrases:
  - "session relaunch audit"
  - "relaunch loop drift"
importance_tier: normal
contextType: planning
version: 1.0.0.0
---

# Deep Research Strategy - Session Relaunch Loop Audit

## 1. OVERVIEW

Audits the post-phase-008 session relaunch loop for code, documentation and spec-record drift, latent bugs, architectural refinements, and alignment with the sk-code-skilled and sk-doc standards.

## 2. TOPIC

Session relaunch loop after phase 008: `.skilled/hooks/session-relaunch`, `.skilled/bin/skilled-loop`, `/speckit:handoff`, the OpenCode plugin and runtime adapters, their tests and docs. Find remaining drift between code, docs and spec records; latent bugs and edge cases; refinements; the ideal architecture of the core and adapters; and alignment gaps against the sk-code-skilled surface standards and checklists and the sk-doc document standards. Every finding needs `file:line` evidence and a concrete fix.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Which behaviors in `.skilled/hooks/session-relaunch/lib` and `.skilled/bin/skilled-loop` diverge from the phase 001-008 spec records, and which concrete fixes restore alignment?
- [ ] Which latent bugs and edge cases remain in the core relaunch decision path (context threshold, nudge, killer, handoff) and which tests expose them?
- [x] Do the runtime adapters (Claude, OpenCode plugin, Pi, Codex, Hermes) implement the same trigger, arm and nudge semantics as the core, and where do they drift?
- [x] Does `/speckit:handoff`, its command documentation and the Gate 3 exemption match the implemented contract and the sk-doc standards?
- [x] What is the ideal core-and-adapter architecture, and which sk-code-skilled surface checklist items and sk-doc standards remain unmet?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- Implementing fixes; this is a findings-only research run.
- Editing any file outside the lineage directory.
- Changing `autoCompactEnabled` or `autoCompactWindow` behavior.
- Reviewing packets unrelated to the session relaunch loop.

---

## 5. STOP CONDITIONS

- Five iterations completed (max-iterations stop policy).
- All five key questions answered with cited evidence.
- Two consecutive iterations add no new evidence beyond prior findings.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Which behaviors in `.skilled/hooks/session-relaunch/lib` and `.skilled/bin/skilled-loop` diverge from the phase 001-008 spec records, and which concrete fixes restore alignment?
- Do the runtime adapters (Claude, OpenCode plugin, Pi, Codex, Hermes) implement the same trigger, arm and nudge semantics as the core, and where do they drift?
- Does `/speckit:handoff`, its command documentation and the Gate 3 exemption match the implemented contract and the sk-doc standards?
- What is the ideal core-and-adapter architecture, and which sk-code-skilled surface checklist items and sk-doc standards remain unmet?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- reading the generated hook command next to the hook source exposed the parent-process assumption that the tests hide by injecting `CLAUDE_PID`. (iteration 1)
- reading every adapter in one pass made the duplicated target-resolution logic visible; no single file looks wrong, but the set does. (iteration 2)
- diffing each documented statement against the code line that implements it found the stale phase-008 behavior quickly. (iteration 3)
- reading the phase 003 review sentence beside the Claude source exposed the cross-phase inconsistency in one comparison. (iteration 4)
- counting each duplicated literal exposed the drift surface in one pass; the target-resolution variants and the CLI path copies are the same class of defect. (iteration 5)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- searching for a repo producer of `CLAUDE_PID` found only tests, which cannot settle whether Claude Code exports it; the finding records that dependency explicitly. (iteration 1)
- the payload-provenance question needed a repository-wide producer search, and absence of a producer is weaker evidence than a failing test. (iteration 2)
- the docs are internally consistent with each other on the `CLAUDE_PID` "only" claim, so only the code could disprove it. (iteration 3)
- phase 002's live-run table required the relaunch log extract to confirm the stale limitation; the summary alone could not date the evidence. (iteration 4)
- the standards checklists are mostly satisfied, so the useful output is the small number of structural gaps, not a long list of checklist rows. (iteration 5)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### A command-standard defect: the frontmatter description is one line and within the 110-character budget, `argument-hint` is present, `allowed-tools` is limited to Read, Write and Bash, and the sections match the command template's purpose/contract/steps/report shape [SOURCE: .skilled/skills/sk-doc/sk-create-command/assets/command-template.md:1]. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A command-standard defect: the frontmatter description is one line and within the 110-character budget, `argument-hint` is present, `allowed-tools` is limited to Read, Write and Bash, and the sections match the command template's purpose/contract/steps/report shape [SOURCE: .skilled/skills/sk-doc/sk-create-command/assets/command-template.md:1].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A command-standard defect: the frontmatter description is one line and within the 110-character budget, `argument-hint` is present, `allowed-tools` is limited to Read, Write and Bash, and the sections match the command template's purpose/contract/steps/report shape [SOURCE: .skilled/skills/sk-doc/sk-create-command/assets/command-template.md:1].

### A Gate 3 exemption gap: the AGENTS.md sentence exempts runtime state under `.skilled/skills/.state/` [SOURCE: AGENTS.md:75], the spec-gate test covers the path, and the handoff note lives there. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A Gate 3 exemption gap: the AGENTS.md sentence exempts runtime state under `.skilled/skills/.state/` [SOURCE: AGENTS.md:75], the spec-gate test covers the path, and the handoff note lives there.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A Gate 3 exemption gap: the AGENTS.md sentence exempts runtime state under `.skilled/skills/.state/` [SOURCE: AGENTS.md:75], the spec-gate test covers the path, and the handoff note lives there.

### A JavaScript or shell checklist violation in the shipped code: module headers, `'use strict'`, camelCase, bracketed log prefixes, quoted expansions, `set -euo pipefail`, documented exit codes and named constants are all present in the reviewed files. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: A JavaScript or shell checklist violation in the shipped code: module headers, `'use strict'`, camelCase, bracketed log prefixes, quoted expansions, `set -euo pipefail`, documented exit codes and named constants are all present in the reviewed files.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A JavaScript or shell checklist violation in the shipped code: module headers, `'use strict'`, camelCase, bracketed log prefixes, quoted expansions, `set -euo pipefail`, documented exit codes and named constants are all present in the reviewed files.

### A parent-goal D3 violation: the claim seed takes `spec_folder` from the note at consume time [SOURCE: .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:509], so the note-written value does reach the seed on every runtime even when the adapter's payload field is absent. The earlier doc-accuracy concern is about the ENV-REFERENCE wording, not the goal. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: A parent-goal D3 violation: the claim seed takes `spec_folder` from the note at consume time [SOURCE: .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:509], so the note-written value does reach the seed on every runtime even when the adapter's payload field is absent. The earlier doc-accuracy concern is about the ENV-REFERENCE wording, not the goal.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A parent-goal D3 violation: the claim seed takes `spec_folder` from the note at consume time [SOURCE: .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:509], so the note-written value does reach the seed on every runtime even when the adapter's payload field is absent. The earlier doc-accuracy concern is about the ENV-REFERENCE wording, not the goal.

### A phase 001 usage-accounting drift: the record says fill uses input, cache creation and cache read, and `readClaudeFill` sums exactly those three [SOURCE: .skilled/hooks/session-relaunch/lib/context-usage.cjs:112]. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: A phase 001 usage-accounting drift: the record says fill uses input, cache creation and cache read, and `readClaudeFill` sums exactly those three [SOURCE: .skilled/hooks/session-relaunch/lib/context-usage.cjs:112].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A phase 001 usage-accounting drift: the record says fill uses input, cache creation and cache read, and `readClaudeFill` sums exactly those three [SOURCE: .skilled/hooks/session-relaunch/lib/context-usage.cjs:112].

### A phase 008 limitation drift: "No live rerun" is accurate; the phase closed unit-level edge cases after the live runs. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: A phase 008 limitation drift: "No live rerun" is accurate; the phase closed unit-level edge cases after the live runs.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A phase 008 limitation drift: "No live rerun" is accurate; the phase closed unit-level edge cases after the live runs.

### A playbook exit-code drift: the playbook's wrapper exit table matches `skilled-loop` lines 430-504, including the 130 path and the decode-failure warnings. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A playbook exit-code drift: the playbook's wrapper exit table matches `skilled-loop` lines 430-504, including the 130 path and the decode-failure warnings.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A playbook exit-code drift: the playbook's wrapper exit table matches `skilled-loop` lines 430-504, including the 130 path and the decode-failure warnings.

### A README structure or sk-doc standards violation: the README has numbered ALL CAPS H2 sections, a directory tree, a switches table, troubleshooting and related links, and no anchor navigation. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: A README structure or sk-doc standards violation: the README has numbered ALL CAPS H2 sections, a directory tree, a switches table, troubleshooting and related links, and no anchor navigation.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A README structure or sk-doc standards violation: the README has numbered ALL CAPS H2 sections, a directory tree, a switches table, troubleshooting and related links, and no anchor navigation.

### Flagging Codex's separate `prompt-seed.mjs` and `context-nudge.mjs` entry points: the installer allows one script per event, and both route through `shared.mjs`. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Flagging Codex's separate `prompt-seed.mjs` and `context-nudge.mjs` entry points: the installer allows one script per event, and both route through `shared.mjs`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Flagging Codex's separate `prompt-seed.mjs` and `context-nudge.mjs` entry points: the installer allows one script per event, and both route through `shared.mjs`.

### Looking for a command-contract entry for `/speckit:handoff`: the contract covers router-shaped families only, and this command is direct-dispatch, so its absence is expected. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Looking for a command-contract entry for `/speckit:handoff`: the contract covers router-shaped families only, and this command is direct-dispatch, so its absence is expected.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a command-contract entry for `/speckit:handoff`: the contract covers router-shaped families only, and this command is direct-dispatch, so its absence is expected.

### Looking for a phase record that claims `CLAUDE_PID` is absent: every record that mentions it says it is recorded in the live hook environment, so the docs' "only for the shell-child check" wording is the sole contradiction. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Looking for a phase record that claims `CLAUDE_PID` is absent: every record that mentions it says it is recorded in the live hook environment, so the docs' "only for the shell-child check" wording is the sole contradiction.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a phase record that claims `CLAUDE_PID` is absent: every record that mentions it says it is recorded in the live hook environment, so the docs' "only for the shell-child check" wording is the sole contradiction.

### Looking for a shared conformance runner outside the per-runtime suites: none exists, and the deep-loop stress adapters are not wired to this hook. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Looking for a shared conformance runner outside the per-runtime suites: none exists, and the deep-loop stress adapters are not wired to this hook.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a shared conformance runner outside the per-runtime suites: none exists, and the deep-loop stress adapters are not wired to this hook.

### Looking for direct writes to `deep-research-state.jsonl` in the hook code: the relaunch hooks never touch the deep-research packet, so none exist. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Looking for direct writes to `deep-research-state.jsonl` in the hook code: the relaunch hooks never touch the deep-research packet, so none exist.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for direct writes to `deep-research-state.jsonl` in the hook code: the relaunch hooks never touch the deep-research packet, so none exist.

### Re-checking the threshold math per adapter: every adapter calls the shared `relaunchThreshold`, `nextLevel` and `handoffPending` helpers, and the per-runtime windows are intentional. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Re-checking the threshold math per adapter: every adapter calls the shared `relaunchThreshold`, `nextLevel` and `handoffPending` helpers, and the per-runtime windows are intentional.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Re-checking the threshold math per adapter: every adapter calls the shared `relaunchThreshold`, `nextLevel` and `handoffPending` helpers, and the per-runtime windows are intentional.

### Re-deriving the hop-cap logic: the wrapper, `prepare`, the killer and every adapter share one resolution path, and phase 008 tests cover zero, non-integer and over-cap values. No drift found. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Re-deriving the hop-cap logic: the wrapper, `prepare`, the killer and every adapter share one resolution path, and phase 008 tests cover zero, non-integer and over-cap values. No drift found.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Re-deriving the hop-cap logic: the wrapper, `prepare`, the killer and every adapter share one resolution path, and phase 008 tests cover zero, non-integer and over-cap values. No drift found.

### Rewriting the lock takeover algorithm: expiry, inode-checked release, and the 30 s/10 min sweeps match the README line for line. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Rewriting the lock takeover algorithm: expiry, inode-checked release, and the 30 s/10 min sweeps match the README line for line.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Rewriting the lock takeover algorithm: expiry, inode-checked release, and the 30 s/10 min sweeps match the README line for line.

### Searching for a runtime that resolves the window from a different source than documented: Pi uses `ctx.getContextUsage()`, OpenCode uses `model.limit.context`, Codex the transcript's `model_context_window`, Hermes the payload or model metadata, all with the same env override. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Searching for a runtime that resolves the window from a different source than documented: Pi uses `ctx.getContextUsage()`, OpenCode uses `model.limit.context`, Codex the transcript's `model_context_window`, Hermes the payload or model metadata, all with the same env override.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching for a runtime that resolves the window from a different source than documented: Pi uses `ctx.getContextUsage()`, OpenCode uses `model.limit.context`, Codex the transcript's `model_context_window`, Hermes the payload or model metadata, all with the same env override.

### Treating `targetIsRunning`'s `EPERM` handling as a bug: for a target pid, `EPERM` means the pid was reused by another user, so "gone" is the correct reading. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Treating `targetIsRunning`'s `EPERM` handling as a bug: for a target pid, `EPERM` means the pid was reused by another user, so "gone" is the correct reading.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `targetIsRunning`'s `EPERM` handling as a bug: for a target pid, `EPERM` means the pid was reused by another user, so "gone" is the correct reading.

### Treating OpenCode's `process.pid` target as a bug: the plugin is hosted in the OpenCode process the wrapper starts, and the plugin tests assert that pid is passed to the killer [SOURCE: .opencode/plugins/tests/session-relaunch.test.cjs:916]. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Treating OpenCode's `process.pid` target as a bug: the plugin is hosted in the OpenCode process the wrapper starts, and the plugin tests assert that pid is passed to the killer [SOURCE: .opencode/plugins/tests/session-relaunch.test.cjs:916].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating OpenCode's `process.pid` target as a bug: the plugin is hosted in the OpenCode process the wrapper starts, and the plugin tests assert that pid is passed to the killer [SOURCE: .opencode/plugins/tests/session-relaunch.test.cjs:916].

### Treating the TypeScript `as string` import specifiers as a defect: the comment explains the dual-base module resolution the Pi loader needs, and the dynamic imports have a fallback. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Treating the TypeScript `as string` import specifiers as a defect: the comment explains the dual-base module resolution the Pi loader needs, and the dynamic imports have a fallback.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the TypeScript `as string` import specifiers as a defect: the comment explains the dual-base module resolution the Pi loader needs, and the dynamic imports have a fallback.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Looking for direct writes to `deep-research-state.jsonl` in the hook code: the relaunch hooks never touch the deep-research packet, so none exist. (iteration 1)
- Re-deriving the hop-cap logic: the wrapper, `prepare`, the killer and every adapter share one resolution path, and phase 008 tests cover zero, non-integer and over-cap values. No drift found. (iteration 1)
- Rewriting the lock takeover algorithm: expiry, inode-checked release, and the 30 s/10 min sweeps match the README line for line. (iteration 1)
- Treating `targetIsRunning`'s `EPERM` handling as a bug: for a target pid, `EPERM` means the pid was reused by another user, so "gone" is the correct reading. (iteration 1)
- Flagging Codex's separate `prompt-seed.mjs` and `context-nudge.mjs` entry points: the installer allows one script per event, and both route through `shared.mjs`. (iteration 2)
- Re-checking the threshold math per adapter: every adapter calls the shared `relaunchThreshold`, `nextLevel` and `handoffPending` helpers, and the per-runtime windows are intentional. (iteration 2)
- Searching for a runtime that resolves the window from a different source than documented: Pi uses `ctx.getContextUsage()`, OpenCode uses `model.limit.context`, Codex the transcript's `model_context_window`, Hermes the payload or model metadata, all with the same env override. (iteration 2)
- Treating OpenCode's `process.pid` target as a bug: the plugin is hosted in the OpenCode process the wrapper starts, and the plugin tests assert that pid is passed to the killer [SOURCE: .opencode/plugins/tests/session-relaunch.test.cjs:916]. (iteration 2)
- A command-standard defect: the frontmatter description is one line and within the 110-character budget, `argument-hint` is present, `allowed-tools` is limited to Read, Write and Bash, and the sections match the command template's purpose/contract/steps/report shape [SOURCE: .skilled/skills/sk-doc/sk-create-command/assets/command-template.md:1]. (iteration 3)
- A Gate 3 exemption gap: the AGENTS.md sentence exempts runtime state under `.skilled/skills/.state/` [SOURCE: AGENTS.md:75], the spec-gate test covers the path, and the handoff note lives there. (iteration 3)
- A playbook exit-code drift: the playbook's wrapper exit table matches `skilled-loop` lines 430-504, including the 130 path and the decode-failure warnings. (iteration 3)
- Looking for a command-contract entry for `/speckit:handoff`: the contract covers router-shaped families only, and this command is direct-dispatch, so its absence is expected. (iteration 3)
- A parent-goal D3 violation: the claim seed takes `spec_folder` from the note at consume time [SOURCE: .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:509], so the note-written value does reach the seed on every runtime even when the adapter's payload field is absent. The earlier doc-accuracy concern is about the ENV-REFERENCE wording, not the goal. (iteration 4)
- A phase 001 usage-accounting drift: the record says fill uses input, cache creation and cache read, and `readClaudeFill` sums exactly those three [SOURCE: .skilled/hooks/session-relaunch/lib/context-usage.cjs:112]. (iteration 4)
- A phase 008 limitation drift: "No live rerun" is accurate; the phase closed unit-level edge cases after the live runs. (iteration 4)
- Looking for a phase record that claims `CLAUDE_PID` is absent: every record that mentions it says it is recorded in the live hook environment, so the docs' "only for the shell-child check" wording is the sole contradiction. (iteration 4)
- A JavaScript or shell checklist violation in the shipped code: module headers, `'use strict'`, camelCase, bracketed log prefixes, quoted expansions, `set -euo pipefail`, documented exit codes and named constants are all present in the reviewed files. (iteration 5)
- A README structure or sk-doc standards violation: the README has numbered ALL CAPS H2 sections, a directory tree, a switches table, troubleshooting and related links, and no anchor navigation. (iteration 5)
- Looking for a shared conformance runner outside the per-runtime suites: none exists, and the deep-loop stress adapters are not wired to this hook. (iteration 5)
- Treating the TypeScript `as string` import specifiers as a defect: the comment explains the dual-base module resolution the Pi loader needs, and the dynamic imports have a fallback. (iteration 5)

<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
[None yet]

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Follow up on: **P3 — The tests README omits the OpenCode plugin suite from the folder inventory, so a reader cannot find one fifth of the regression coverage.** The README says the suite covers Claude, Codex, Hermes and Pi [SOURCE:...

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

- Phase 008 closed fifteen findings from a DeepSeek and Luna fan-out review; later phases (005-008) repeatedly fixed review findings, so residual drift is most likely at the seams between core, adapters and docs.
- Canonical surfaces: `lib/relaunch-core.cjs`, `lib/context-usage.cjs`, `lib/nudge.cjs`, `lib/killer.cjs`, `bin/session-relaunch.cjs`, `.skilled/bin/skilled-loop`, runtime adapter folders, `.opencode/plugins/session-relaunch.js`, `.skilled/commands/speckit/handoff.md`.
- `resource-map.md not present; skipping coverage gate`.

### Bounded Context Snapshot

- Source pointers: `.skilled/hooks/session-relaunch/lib/*.cjs`, `.skilled/hooks/session-relaunch/{claude,codex,hermes,opencode,pi,bin}/`, `.skilled/hooks/session-relaunch/tests/`, `.opencode/plugins/session-relaunch.js`, `.skilled/bin/skilled-loop`, `.skilled/commands/speckit/handoff.md`.
- Reuse candidates: existing adapter helper modules and the shared core decision functions; phase 005-008 implementation summaries for known-fix coordinates.
- Integration points: hook registry, `.claude/settings.json`, `.codex/hooks.json`, `opencode.json`, Pi extension, `AGENTS.md` Gate 3 text.
- Constraints and risks: the lineage is read-only outside its own directory; no test execution needed unless a claim depends on runtime behavior; docs may describe earlier revisions.

---

## 13. RESEARCH BOUNDARIES

- Max iterations: 5
- Convergence threshold: 0.1
- Per-iteration budget: 24 tool calls, 10 minutes
- Progressive synthesis: false
- Lifecycle branches: `new` (this run)
- Machine-owned sections: Sections 3, 6, 7-11A
- Canonical pause sentinel: `.deep-research-pause`
- Started: 2026-10-19T17:12:00.000Z
