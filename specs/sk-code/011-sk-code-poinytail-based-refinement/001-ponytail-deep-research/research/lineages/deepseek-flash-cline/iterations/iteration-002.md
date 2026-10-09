---
title: "Iteration 2: Ponytail hook mechanisms vs sk-code's cross-runtime hook layer"
trigger_phrases: []
---
# Iteration 2: Ponytail hook mechanisms vs sk-code's cross-runtime hook layer

## Focus

Q2 — how Ponytail's hooks activate, persist mode, track sessions, propagate into subagents, and gate per runtime; which of those mechanisms are missing from or already stronger in sk-code's hook layer. Every item is classified `NEW`, `ALREADY-ADOPTED`, or `LOST`.

## What was read

- `specs/sk-code/011-sk-code-poinytail-based-refinement/context/hooks/ponytail-runtime.js:1-90` — host detection, per-project mode flag, cache paths.
- `specs/sk-code/011-sk-code-poinytail-based-refinement/context/hooks/ponytail-activate.js:1-80` — SessionStart activation, ruleset emission, codebase-map append.
- `specs/sk-code/011-sk-code-poinytail-based-refinement/context/hooks/ponytail-mode-tracker.js:1-70` — UserPromptSubmit command parsing and mode switching.
- `specs/sk-code/011-sk-code-poinytail-based-refinement/context/hooks/ponytail-subagent.js:1-94` — SubagentStart injection, fail-open scoping.
- `specs/sk-code/011-sk-code-poinytail-based-refinement/context/hooks/ponytail-map.js:1-103` — the codebase map builder.
- `specs/sk-code/011-sk-code-poinytail-based-refinement/context/hooks/ponytail-instructions.js:1-60` and `claude-codex-hooks.json` — the shared instruction builder and hook wiring.
- `specs/sk-code/011-sk-code-poinytail-based-refinement/context/.opencode/plugins/ponytail.mjs:1-80` — the OpenCode plugin.
- `.skilled/hooks/post-edit-quality/README.md`, `.skilled/hooks/session-lifecycle/README.md`, `.skilled/hooks/task-dispatch/README.md` — the repo's hook concerns.
- `.skilled/hooks/post-edit-quality/lib/post-edit-router.cjs:1-160` — the single path-dispatch table.
- `.skilled/skills/sk-code/sk-code-quality/scripts/hooks/` and `sk-code-opencode/scripts/` — sk-code's own hook scripts.

## Findings

1. **[NEW] Ponytail ships a codebase map whose stated purpose is to make "reuse first" cost no search — sk-code has no equivalent.** The SessionStart hook appends the map output to the injected ruleset: "Codebase map: what already exists, so 'reuse first' costs no search". [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/hooks/ponytail-map.js:1-10] The builder lists exported names one line per folder inside a 2000-character budget, orders shared-code folders first when the budget is tight, skips tests/generated/vendored files, and documents its own limit as a `shortcut:` comment (regex not parser; tree-sitter is the upgrade). [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/hooks/ponytail-map.js:16-21,70-99] The activation hook treats map failure as non-blocking ("a map that cannot be built must never block or slow the session start"). [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/hooks/ponytail-activate.js:62-67] The injected instruction copy independently confirms reuse-first is rung 2 of the doctrine: "Already in this codebase (a helper, component, service, pattern)? Use it the way the surrounding code does." [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/hooks/ponytail-instructions.js:58] sk-code's post-edit-quality hook layer only runs defect checkers after edits; nothing in the hook tree emits an existence map. [SOURCE: .skilled/hooks/post-edit-quality/README.md] This mechanism is the enabler for iteration 1's missing repo-reuse rung.

2. **[NEW, partially] Ponytail propagates its doctrine into subagents through a SubagentStart hook; sk-code injects nothing about the active surface/mode into dispatched code subagents.** Ponytail's hook exists because "SessionStart context is parent-thread only and never reaches subagents, so without this every Task-spawned agent runs ponytail-unaware". [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/hooks/ponytail-subagent.js:1-11] It injects the same ruleset, with opt-in scoping by agent_type and fail-open behavior on unparseable input, stdin stalls, and catastrophic-regex timeouts. [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/hooks/ponytail-subagent.js:32-49,57-94] sk-code's `task-dispatch/` guards dispatches (`allow`/`warn`/`reject`) but does not inject code-work doctrine or surface identity into the spawned agent. [SOURCE: .skilled/hooks/task-dispatch/README.md] A sk-code SubagentStart context-injection (active surface, mode, verification floor) is a candidate, bounded by the existing guard layer; cost is a new per-runtime adapter surface.

3. **[ALREADY-ADOPTED, stronger] One policy source across runtimes beats Ponytail's per-host JS branching.** Ponytail detects the host from environment variables (Copilot, Codex, Qoder, CodeBuddy, Cursor) and selects a per-host state directory and output shape at runtime. [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/hooks/ponytail-runtime.js:14-42] sk-code's hook layer keeps one path-dispatch table in `post-edit-router.cjs` shared by Claude, Codex, Devin, Pi and the OpenCode plugin, evaluated in priority order so an overlapping path resolves to exactly one checker, never two; the checker scripts stay in the owning skill and are invoked by repo-relative path. [SOURCE: .skilled/hooks/post-edit-quality/README.md] [SOURCE: .skilled/hooks/post-edit-quality/lib/post-edit-router.cjs:146-160] This is the stronger design; no adoption needed.

4. **[ALREADY-ADOPTED, codified] Fail-open is a written contract in sk-code, not just defensive code.** Ponytail catches and swallows failures at every step (flag best-effort, map fail-open, silent EPIPE). [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/hooks/ponytail-activate.js:46-47,52-56,62-67] sk-code states it as a router contract: "Warn-only by contract: every failure path (missing checker, unexpected exit code, spawn error, exhausted deadline) resolves to no finding, and the edit itself is never blocked." [SOURCE: .skilled/hooks/post-edit-quality/README.md] The session-lifecycle concern carries the same "fails open" property. [SOURCE: .skilled/hooks/session-lifecycle/README.md]

5. **[REJECT, reasoned] Ponytail's per-project mode flag machinery should not be ported.** It keeps a session mode in a flag file keyed by a SHA-256 of the project directory, with a shared fallback flag for hosts without a project dir, and documents its own limit (same-repo concurrent sessions share one mode). [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/hooks/ponytail-runtime.js:44-81] The prior refinement already rejected an intensity state machine as disproportionate for sk-code's multi-axis contract. [SOURCE: specs/sk-code/z_archive/015-sk-code-ponytail-based-refinement/research/research.md:83] sk-code keeps per-session state only where a named consumer exists (continuity in session-lifecycle, goal binding in `goal/`), which is the honest boundary. [SOURCE: .skilled/hooks/session-lifecycle/README.md]

6. **[ALREADY-ADOPTED] One-shot skill vs session-level mode discipline is already the sk-code design.** Ponytail explicitly refuses to treat `/ponytail-review` as a session level because it would latch a mode. [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/hooks/ponytail-mode-tracker.js:53-56] sk-code has no session latch: `sk-code-review` is a routed workflow mode, and review depth is an env alias that names an existing tier without persisting a level. [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:530-532]

7. **[NEW, partially] Ponytail treats host-quirk regression tests as product surface; verify sk-code's hook suites cover the same failure classes.** Ponytail ships four hook test suites (~1,710 lines) covering hooks, Windows behavior, cursor interplay, and the OpenCode plugin. [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/tests/hooks.test.js] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/tests/hooks-windows.test.js] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/tests/cursor-hooks.test.js] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/tests/opencode-plugin.test.js] sk-code has hook tests too (`claude-posttooluse.test.sh`, `check-comment-hygiene.test.sh`, and the `.opencode/hooks/post-edit-quality` suites). [SOURCE: .skilled/skills/sk-code/sk-code-quality/scripts/hooks/claude-posttooluse.test.sh] [SOURCE: .skilled/hooks/post-edit-quality/devin/post-edit-quality.test.cjs] The portable pattern is the *failure-class list* (stdin stall, BOM, unrecognized host, regex timeout), not the file count; whether every class is covered here is unverified and is the exact check a phase-2 item should run.

8. **[ALREADY-ADOPTED] Env-over-config-over-default precedence is already the repo idiom.** Ponytail resolves the default level from `PONYTAIL_DEFAULT_MODE` or `~/.config/ponytail/config.json` and persists `/ponytail default <mode>` separately from the session switch. [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/README.md:167-168] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/hooks/ponytail-mode-tracker.js:57-67] sk-code-review's `SK_CODE_REVIEW_DEPTH` resolves the same way (env > config > default). [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:530-532]

### Classification roll-up (iteration 2)

| Classification | Findings |
|---|---|
| NEW | 1 (codebase map for reuse-first), 2 (subagent doctrine injection), 7 (host-quirk test classes) |
| ALREADY-ADOPTED | 3 (single policy source), 4 (fail-open contract), 6 (one-shot discipline), 8 (precedence idiom) |
| REJECT (reasoned) | 5 (per-project mode flag machinery) |
| LOST | none — the adopted hook work from the prior refinement stayed adopted; the ADOPT-LATER SessionStart priming item (#15) is still open rather than lost |

## Ruled Out

- Porting Ponytail's per-host JS branching as a sk-code pattern: the router-plus-adapter design here already covers the same ground with less drift.
- Treating Ponytail's mode-flag machinery as session-state parity work: no sk-code consumer exists for a latched session level, and the prior research rejection still holds.

## Dead Ends

- Searching for a sk-code "codebase map" by name: the concept does not exist under any name in the hook tree; probing by mechanism (map/exists/exports) closes the question.

## Edge Cases

- Ambiguous input: none — Q2 answered from named sources.
- Contradictory evidence: none. Ponytail's own comments acknowledge the mode-flag limit; the rejection is based on fit, not on a disputed fact.
- Missing dependencies: none.
- Partial success: none. Finding 7's gap claim is explicitly bounded as unverified pending the phase-2 test audit.

## Sources Consulted

- specs/sk-code/011-sk-code-poinytail-based-refinement/context/hooks/ponytail-map.js:1-10,16-21,70-99
- specs/sk-code/011-sk-code-poinytail-based-refinement/context/hooks/ponytail-activate.js:31-35,46-67
- specs/sk-code/011-sk-code-poinytail-based-refinement/context/hooks/ponytail-runtime.js:14-81,83-90
- specs/sk-code/011-sk-code-poinytail-based-refinement/context/hooks/ponytail-subagent.js:1-11,32-49,57-94
- specs/sk-code/011-sk-code-poinytail-based-refinement/context/hooks/ponytail-mode-tracker.js:26-27,42-70
- specs/sk-code/011-sk-code-poinytail-based-refinement/context/hooks/ponytail-instructions.js:1-60
- specs/sk-code/011-sk-code-poinytail-based-refinement/context/hooks/claude-codex-hooks.json
- specs/sk-code/011-sk-code-poinytail-based-refinement/context/.opencode/plugins/ponytail.mjs:1-80
- specs/sk-code/011-sk-code-poinytail-based-refinement/context/tests/hooks.test.js, hooks-windows.test.js, cursor-hooks.test.js, opencode-plugin.test.js
- specs/sk-code/011-sk-code-poinytail-based-refinement/context/README.md:152-171
- .skilled/hooks/post-edit-quality/README.md
- .skilled/hooks/post-edit-quality/lib/post-edit-router.cjs:146-160
- .skilled/hooks/session-lifecycle/README.md
- .skilled/hooks/task-dispatch/README.md
- .skilled/skills/sk-code/sk-code-quality/scripts/hooks/
- .skilled/skills/sk-code/sk-code-review/SKILL.md:530-532
- specs/sk-code/z_archive/015-sk-code-ponytail-based-refinement/research/research.md:66,83

## Assessment

- New information ratio: 0.31 (1 fully new, 3 partially new, 4 already-adopted/rejected among 8 findings)
- Questions addressed: Q2
- Questions answered: Q2

## Reflection

- What worked and why: reading the hook *wire-up* (`claude-codex-hooks.json`) beside the hook code showed which events Ponytail considers first-class (SessionStart, UserPromptSubmit, SubagentStart) — a mechanism-level fact the docs do not state.
- What did not work and why: an early concept grep for a codebase map missed because the concept has no sk-code name; mechanism probes are the reliable second pass.
- What I would do differently: check the hosting runtime's own installed hooks before judging injection gaps, so "sk-code injects nothing into subagents" is not confused with "the repo injects nothing".

## Recommended Next Focus

Q3 — Ponytail's command and bundled-skill delegation (review/audit/gain/debt/help) versus sk-code's mode-registry and hub-router routing, including how each keeps one delegating surface from drifting into duplicated doctrine.
