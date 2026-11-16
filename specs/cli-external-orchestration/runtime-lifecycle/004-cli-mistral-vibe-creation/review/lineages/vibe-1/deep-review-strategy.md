---
title: Deep Review Strategy - Vibe hooks and plugins (lineage vibe-1)
description: Runtime strategy for the fan-out lineage reviewing every Mistral Vibe hook and plugin binding.
importance_tier: normal
contextType: planning
---

# Deep Review Strategy - Vibe Hooks and Plugins (lineage vibe-1)

## 1. REVIEW CHARTER

- Target: `.vibe/hooks.toml`, `.vibe/plugins/repo-guards/*.mjs`, `.vibe/plugins/repo-guards/render-home-hooks.cjs`, `.vibe/plugins/repo-guards/lib/hook-io.mjs`, the `.skilled/hooks/**/vibe/*` adapters, the Vibe session reader, the skill-advisor Vibe part and the completion-evidence Vibe part.
- Target type: files (27 files, expanded from the declared globs).
- Dimensions: correctness, security, traceability, maintainability.
- Operator review focus: every Vibe hook and plugin binding, its fail-open behaviour, wire-format and payload edge cases, ordering and kill-switch gaps, and parity against the OpenCode plugins. Only new or still-open issues; the 29 findings dispositioned in `023-vibe-review-remediation/implementation-summary.md` are out of scope.
- Stop conditions: `maxIterations` = 5 reached (stopPolicy `max-iterations`); convergence is telemetry only for this lineage.
- Success criteria: every declared dimension covered at least once, each finding carries `file:line` evidence, and the synthesis names the exact integration surfaces checked.

## 2. TOPIC

Mistral Vibe hook and plugin bindings: the 18 `[[hooks]]` entries in `.vibe/hooks.toml`, the repo-guards scripts behind them, the shared `lib/hook-io.mjs` seam, the home-hooks renderer, and the `.skilled/hooks/**/vibe/` adapters that compose the turn-start, turn-end, session-start and compaction context.

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS

- Re-reporting the 29 findings already dispositioned in `023-vibe-review-remediation/implementation-summary.md`.
- Reviewing the shared runtime-neutral guard cores under `.skilled/hooks/*/lib/` except where a Vibe adapter's call into them is the defect.
- Reviewing the OpenCode plugins themselves; they are parity reference only.
- Reviewing the manual-testing playbook scenarios except as traceability evidence.
- Implementing fixes. This lineage reports only.

## 5. STOP CONDITIONS

- `maxIterations` = 5 reached. This lineage runs to the cap; convergence before the cap is telemetry only.
- A hard-block invariant failure before the first write of an iteration returns `error` instead of a partial artifact.

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->
<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 1
- P2 (Suggestions): 15
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED

- Reading each `[[hooks]]` binding against the documented wire format in `guards-and-hooks.md` section 5, then following the binding into its script to check that the field the script reads is a field the payload carries. That single pass produced the P1 and three of the five P2s (iteration 1).
- Counting the binding census and the strict set against `guards-and-hooks.md:37` first, so the traceability protocol had a cheap, exact check before the deeper reads (iteration 1).
- Grepping the whole census for one helper name (`isHookEnabled`) and diffing the hit list against the 18 bindings. The one script with zero hits and no documented reason was the kill-switch gap, found in a single pass (iteration 2).
- Reading the guarded sibling beside the unguarded one. `compaction-context.mjs:72-77` states the payload-path rule in a comment and enforces it eight lines later, which turned "is this a defect" into "which adapters lack the guard the repo already wrote" (iteration 2).
- Reading the reference document as a claim set rather than as background, then testing each claim against the file it describes. The census, the 21-row classification and the reply table each resolved to a checkable assertion, and two of them failed (iteration 3).
- Grepping for one reply field across the whole bundle to size a documentation gap. Eight emitters against a table that lists none of them made the finding exact instead of impressionistic (iteration 3).
- Measuring test coverage by grepping each adapter's name across every `*.test.*` file rather than by listing test directories. That found the three adapters with no test reference at all, and showed they are the three that carry this lineage's findings (iteration 4).
- Checking whether the `.skilled/hooks/*/vibe/` tree was a duplicate before reporting it. `-L` showed eleven symlinks into the repo-guards tree, which turned a would-be duplication finding into a confirmed-clean surface (iteration 4).
- Cross-referencing the scenario census against the binding census. Matching 28 scenario files to 18 bindings left exactly one uncovered binding, which is a sharper result than reading either list alone (iteration 5).
- Reading the verdict table before writing the synthesis. It supplied counterevidence that narrowed two carried findings instead of leaving them overstated (iteration 5).

## 9. WHAT FAILED

- Looking for a defect in the `tool_status` guards and in the strict `post_tool` reply shape. Both were ruled out: `tool_status` is a documented `post_tool` field, and VIB-HK-016's live pass shows a strict `post_tool` hook can return `hook_specific_output.additional_context` without blanking the tool result (iteration 1).
- Treating the `session-cleanup.mjs` `session_start` branch as dead code. It is reachable through `session-start.mjs:82-86`, which spawns the same script with the same stdin (iteration 1).
- Looking for a size cap or a timeout gap in `classifier-injection-screen`. Both belong to the shared `screenText` core, outside the declared target, and the non-strict binding turns a timeout into a no-op rather than a block (iteration 2).
- Trying to raise the payload-path finding to P1. `payload.cwd` is runtime-set and the relative path is a fixed constant, so the reachable impact stays a stray directory tree and a self-inflicted unlink. Held at P2 with the class named (iteration 2).
- Looking for a parity gap in `classifier-injection-screen`, `ask-surface-guard` or `mcp-route-guard`. All three differences are documented as intentional, and `mcp-route-guard`'s missing `match` is correct because Vibe's MCP tool names are dynamic (iteration 3).
- Citing `hooks.toml:93` for the `post-edit-quality` strictness in iteration 2. The correct line is `:91`; `:93` is the `command` line. Corrected in iteration 3's traceability checks rather than by rewriting the durable artifact (iteration 3).
- Looking for a god module in `compaction-context.mjs`. Its six sections are cohesive and its three exports are the detector, the journal measurement and the post-tool composition, so no finding was raised (iteration 4).
- Treating `R4-P2-003`'s three adapters as unverified. The verdict table shows VIB-HK-015, VIB-HK-008 and VIB-HK-009 each passed live for one of them, so the finding was narrowed to the automated-test gap (iteration 5).
- Treating `R1-P2-001` as an author oversight. `spec-gate.mjs:73-75` documents why `system_message` was chosen, so the finding was narrowed to the undocumented field on a strict hook and the missing `advise`-path scenario (iteration 5).

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **`classifier-injection-screen` lacking a size cap on the fetched text.** Ruled out as a Vibe-adapter finding: `classifier-injection-advisory.mjs:45-54` and `:91-101` bound the text through the shared `screenText` helper, and the absence of a `timeout` in `hooks.toml:115-119` leaves the documented 60 s default, which the non-strict binding turns into a no-op rather than a block. The cap belongs to the shared core, outside this review target. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **`classifier-injection-screen` lacking a size cap on the fetched text.** Ruled out as a Vibe-adapter finding: `classifier-injection-advisory.mjs:45-54` and `:91-101` bound the text through the shared `screenText` helper, and the absence of a `timeout` in `hooks.toml:115-119` leaves the documented 60 s default, which the non-strict binding turns into a no-op rather than a block. The cap belongs to the shared core, outside this review target.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`classifier-injection-screen` lacking a size cap on the fetched text.** Ruled out as a Vibe-adapter finding: `classifier-injection-advisory.mjs:45-54` and `:91-101` bound the text through the shared `screenText` helper, and the absence of a `timeout` in `hooks.toml:115-119` leaves the documented 60 s default, which the non-strict binding turns into a no-op rather than a block. The cap belongs to the shared core, outside this review target.

### **`compaction-context.mjs` as a god module.** Ruled out: its six sections are cohesive and its three exports are the detector, the journal measurement and the post-tool composition. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **`compaction-context.mjs` as a god module.** Ruled out: its six sections are cohesive and its three exports are the detector, the journal measurement and the post-tool composition.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`compaction-context.mjs` as a god module.** Ruled out: its six sections are cohesive and its three exports are the detector, the journal measurement and the post-tool composition.

### **`deep-loop-guard` reading a `tool_input` key the payload does not carry.** Ruled out: `deep-loop-guard.mjs:99-105` reads `config_name` from `tool_input`, which is the key the classification row at `:124` names, and the guard reads it defensively. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **`deep-loop-guard` reading a `tool_input` key the payload does not carry.** Ruled out: `deep-loop-guard.mjs:99-105` reads `config_name` from `tool_input`, which is the key the classification row at `:124` names, and the guard reads it defensively.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`deep-loop-guard` reading a `tool_input` key the payload does not carry.** Ruled out: `deep-loop-guard.mjs:99-105` reads `config_name` from `tool_input`, which is the key the classification row at `:124` names, and the guard reads it defensively.

### **`env-secret-guard.js`'s "registers three value-free dotenv inspection tools" as a Vibe claim.** Ruled out: the "What it does" column describes the OpenCode plugin, and the verdict column lands it on `pre_tool` alone. The tool registration is not claimed for Vibe. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **`env-secret-guard.js`'s "registers three value-free dotenv inspection tools" as a Vibe claim.** Ruled out: the "What it does" column describes the OpenCode plugin, and the verdict column lands it on `pre_tool` alone. The tool registration is not claimed for Vibe.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`env-secret-guard.js`'s "registers three value-free dotenv inspection tools" as a Vibe claim.** Ruled out: the "What it does" column describes the OpenCode plugin, and the verdict column lands it on `pre_tool` alone. The tool registration is not claimed for Vibe.

### **`env-secret-guard` lacking an `isHookEnabled` kill switch.** Ruled out: `env-secret-guard.cjs:843-846` reads the switch from the environment only, deliberately, because a flags file in the checkout is agent-writable. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **`env-secret-guard` lacking an `isHookEnabled` kill switch.** Ruled out: `env-secret-guard.cjs:843-846` reads the switch from the environment only, deliberately, because a flags file in the checkout is agent-writable.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`env-secret-guard` lacking an `isHookEnabled` kill switch.** Ruled out: `env-secret-guard.cjs:843-846` reads the switch from the environment only, deliberately, because a flags file in the checkout is agent-writable.

### **`env-secret-guard` missing a tool the binding matches.** Ruled out: `env-secret-guard.cjs:32-35` covers `read_file`/`write`/`edit` and `:40` covers `bash`, and `evaluateToolCall` at `:770-798` dispatches on all of them. The binding at `hooks.toml:45` adds `process_start`, which reaches the same shell branch through `hook-io.mjs:37`; that mapping's unverified `tool_input` key is already finding 1 of iteration 1 and is not re-reported here. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **`env-secret-guard` missing a tool the binding matches.** Ruled out: `env-secret-guard.cjs:32-35` covers `read_file`/`write`/`edit` and `:40` covers `bash`, and `evaluateToolCall` at `:770-798` dispatches on all of them. The binding at `hooks.toml:45` adds `process_start`, which reaches the same shell branch through `hook-io.mjs:37`; that mapping's unverified `tool_input` key is already finding 1 of iteration 1 and is not re-reported here.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`env-secret-guard` missing a tool the binding matches.** Ruled out: `env-secret-guard.cjs:32-35` covers `read_file`/`write`/`edit` and `:40` covers `bash`, and `evaluateToolCall` at `:770-798` dispatches on all of them. The binding at `hooks.toml:45` adds `process_start`, which reaches the same shell branch through `hook-io.mjs:37`; that mapping's unverified `tool_input` key is already finding 1 of iteration 1 and is not re-reported here.

### **`git-message-gate.mjs` lacking a kill switch.** Ruled out: `:9` documents the absence as deliberate, with the reason stated in the file. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **`git-message-gate.mjs` lacking a kill switch.** Ruled out: `:9` documents the absence as deliberate, with the reason stated in the file.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`git-message-gate.mjs` lacking a kill switch.** Ruled out: `:9` documents the absence as deliberate, with the reason stated in the file.

### **`goal-inject.mjs` and `ask-surface-post-agent.mjs` as parse-failure inconsistencies.** Ruled out: neither parses stdin itself; both take a payload from a shared reader, so the parse-failure branch lives one layer down. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **`goal-inject.mjs` and `ask-surface-post-agent.mjs` as parse-failure inconsistencies.** Ruled out: neither parses stdin itself; both take a payload from a shared reader, so the parse-failure branch lives one layer down.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`goal-inject.mjs` and `ask-surface-post-agent.mjs` as parse-failure inconsistencies.** Ruled out: neither parses stdin itself; both take a payload from a shared reader, so the parse-failure branch lives one layer down.

### **`mcp-route-guard`'s missing `match` as a dead or over-broad binding.** Ruled out: `mcp-route-guard.mjs:53-54` filters to `mcp_<server>.<tool>` names before the core runs, and Vibe's MCP tool names are dynamic so no static selector could express them. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **`mcp-route-guard`'s missing `match` as a dead or over-broad binding.** Ruled out: `mcp-route-guard.mjs:53-54` filters to `mcp_<server>.<tool>` names before the core runs, and Vibe's MCP tool names are dynamic so no static selector could express them.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`mcp-route-guard`'s missing `match` as a dead or over-broad binding.** Ruled out: `mcp-route-guard.mjs:53-54` filters to `mcp_<server>.<tool>` names before the core runs, and Vibe's MCP tool names are dynamic so no static selector could express them.

### **`overlay-guard` not judging `bash` as a parity defect.** Ruled out: `.opencode/plugins/overlay-guard.js:101-103` also restricts itself to write/edit/patch tools. Only the `match` mismatch is reported, as finding 6. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **`overlay-guard` not judging `bash` as a parity defect.** Ruled out: `.opencode/plugins/overlay-guard.js:101-103` also restricts itself to write/edit/patch tools. Only the `match` mismatch is reported, as finding 6.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`overlay-guard` not judging `bash` as a parity defect.** Ruled out: `.opencode/plugins/overlay-guard.js:101-103` also restricts itself to write/edit/patch tools. Only the `match` mismatch is reported, as finding 6.

### **`payload.tool_status` absent from the `post_tool` payload.** Ruled out: `guards-and-hooks.md:196` lists `tool_status` among the documented `post_tool` fields, so the failed-tool guard at `post-edit-quality.mjs:45`, `dist-freshness.mjs:106` and `classifier-injection-screen.mjs:41` reads a documented field. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **`payload.tool_status` absent from the `post_tool` payload.** Ruled out: `guards-and-hooks.md:196` lists `tool_status` among the documented `post_tool` fields, so the failed-tool guard at `post-edit-quality.mjs:45`, `dist-freshness.mjs:106` and `classifier-injection-screen.mjs:41` reads a documented field.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`payload.tool_status` absent from the `post_tool` payload.** Ruled out: `guards-and-hooks.md:196` lists `tool_status` among the documented `post_tool` fields, so the failed-tool guard at `post-edit-quality.mjs:45`, `dist-freshness.mjs:106` and `classifier-injection-screen.mjs:41` reads a documented field.

### **`prompt-advisor.mjs`'s `headReceiptDir` reading `process.env` instead of the injected `env`.** Ruled out as a production defect: the injected `env` is only used for the child-session check, and `process.env` is the live environment in every real invocation. Left as a test-isolation note for the maintainability pass. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **`prompt-advisor.mjs`'s `headReceiptDir` reading `process.env` instead of the injected `env`.** Ruled out as a production defect: the injected `env` is only used for the child-session check, and `process.env` is the live environment in every real invocation. Left as a test-isolation note for the maintainability pass.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`prompt-advisor.mjs`'s `headReceiptDir` reading `process.env` instead of the injected `env`.** Ruled out as a production defect: the injected `env` is only used for the child-session check, and `process.env` is the live environment in every real invocation. Left as a test-isolation note for the maintainability pass.

### **`prompt-advisor.mjs`'s receipt directory as a payload-rooted write.** Ruled out: `headReceiptDir` resolves from `tmpdir()` or a configured environment path, never from the payload. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **`prompt-advisor.mjs`'s receipt directory as a payload-rooted write.** Ruled out: `headReceiptDir` resolves from `tmpdir()` or a configured environment path, never from the payload.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`prompt-advisor.mjs`'s receipt directory as a payload-rooted write.** Ruled out: `headReceiptDir` resolves from `tmpdir()` or a configured environment path, never from the payload.

### **`R1-P2-001` as an author oversight.** Ruled out: `spec-gate.mjs:73-75` documents the choice and the reason. The finding is scoped to the undocumented field on a strict hook and the missing `advise`-path scenario. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **`R1-P2-001` as an author oversight.** Ruled out: `spec-gate.mjs:73-75` documents the choice and the reason. The finding is scoped to the undocumented field on a strict hook and the missing `advise`-path scenario.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`R1-P2-001` as an author oversight.** Ruled out: `spec-gate.mjs:73-75` documents the choice and the reason. The finding is scoped to the undocumented field on a strict hook and the missing `advise`-path scenario.

### **`R3-P2-002` as a runtime defect.** Ruled out by VIB-HK-016's live pass. The finding is scoped to the reply table's completeness. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **`R3-P2-002` as a runtime defect.** Ruled out by VIB-HK-016's live pass. The finding is scoped to the reply table's completeness.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`R3-P2-002` as a runtime defect.** Ruled out by VIB-HK-016's live pass. The finding is scoped to the reply table's completeness.

### **`R4-P2-003`'s three adapters as unverified.** Ruled out: VIB-HK-015, VIB-HK-008 and VIB-HK-009 each passed live for one of them. The finding is narrowed to the automated-test gap. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **`R4-P2-003`'s three adapters as unverified.** Ruled out: VIB-HK-015, VIB-HK-008 and VIB-HK-009 each passed live for one of them. The finding is narrowed to the automated-test gap.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`R4-P2-003`'s three adapters as unverified.** Ruled out: VIB-HK-015, VIB-HK-008 and VIB-HK-009 each passed live for one of them. The finding is narrowed to the automated-test gap.

### **`readVibeUsage` reading the whole journal on every `post_tool` call.** Ruled out: `context-usage.cjs:368-384` reads a bounded tail and grows it only until a counted model call is found, capped at `MAX_TAIL_BYTES`. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **`readVibeUsage` reading the whole journal on every `post_tool` call.** Ruled out: `context-usage.cjs:368-384` reads a bounded tail and grows it only until a counted model call is found, capped at `MAX_TAIL_BYTES`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`readVibeUsage` reading the whole journal on every `post_tool` call.** Ruled out: `context-usage.cjs:368-384` reads a bounded tail and grows it only until a counted model call is found, capped at `MAX_TAIL_BYTES`.

### **`session_start`'s `system_message` as an undocumented field.** Ruled out: `:238` documents it for `session_start` explicitly. The undocumented use is `spec-gate.mjs:76` on a strict `pre_tool` hook, already recorded as `R1-P2-001`. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **`session_start`'s `system_message` as an undocumented field.** Ruled out: `:238` documents it for `session_start` explicitly. The undocumented use is `spec-gate.mjs:76` on a strict `pre_tool` hook, already recorded as `R1-P2-001`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`session_start`'s `system_message` as an undocumented field.** Ruled out: `:238` documents it for `session_start` explicitly. The undocumented use is `spec-gate.mjs:76` on a strict `pre_tool` hook, already recorded as `R1-P2-001`.

### **`session-cleanup.mjs` calling the OpenCode plugin with a partial context.** Ruled out as a runtime break: `session-cleanup.js:130` reads `input.worktree || input.directory || REPO_ROOT`, so `{ worktree }` is sufficient today. The coupling itself is reported as finding 5. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **`session-cleanup.mjs` calling the OpenCode plugin with a partial context.** Ruled out as a runtime break: `session-cleanup.js:130` reads `input.worktree || input.directory || REPO_ROOT`, so `{ worktree }` is sufficient today. The coupling itself is reported as finding 5.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`session-cleanup.mjs` calling the OpenCode plugin with a partial context.** Ruled out as a runtime break: `session-cleanup.js:130` reads `input.worktree || input.directory || REPO_ROOT`, so `{ worktree }` is sufficient today. The coupling itself is reported as finding 5.

### **`session-cleanup.mjs`'s `session_start` branch being dead code.** Ruled out: `session-start.mjs:82-86` spawns the same script with the same stdin, so the branch is reachable. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **`session-cleanup.mjs`'s `session_start` branch being dead code.** Ruled out: `session-start.mjs:82-86` spawns the same script with the same stdin, so the branch is reachable.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`session-cleanup.mjs`'s `session_start` branch being dead code.** Ruled out: `session-start.mjs:82-86` spawns the same script with the same stdin, so the branch is reachable.

### **`spec-gate`'s `AI_SESSION_CHILD` exemption as a security defect.** Ruled out as a defect: the exemption is the documented child-dispatch contract, and the gate still records the decision. It is a deliberate trade-off, not a bypass. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **`spec-gate`'s `AI_SESSION_CHILD` exemption as a security defect.** Ruled out as a defect: the exemption is the documented child-dispatch contract, and the gate still records the decision. It is a deliberate trade-off, not a bypass.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`spec-gate`'s `AI_SESSION_CHILD` exemption as a security defect.** Ruled out as a defect: the exemption is the documented child-dispatch contract, and the gate still records the decision. It is a deliberate trade-off, not a bypass.

### **`turn-end.mjs` lacking its own kill switch.** Ruled out: it delegates to `completion-evidence-post-agent.cjs`, which calls `isHookEnabled` twice, so the switch is reachable through the delegate. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **`turn-end.mjs` lacking its own kill switch.** Ruled out: it delegates to `completion-evidence-post-agent.cjs`, which calls `isHookEnabled` twice, so the switch is reachable through the delegate.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`turn-end.mjs` lacking its own kill switch.** Ruled out: it delegates to `completion-evidence-post-agent.cjs`, which calls `isHookEnabled` twice, so the switch is reachable through the delegate.

### **`turn-end.mjs` missing from the reply-write duplication.** Ruled out as an omission: it writes a deny object rather than a context reply, which is the correct shape for `post_agent`. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **`turn-end.mjs` missing from the reply-write duplication.** Ruled out as an omission: it writes a deny object rather than a context reply, which is the correct shape for `post_agent`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`turn-end.mjs` missing from the reply-write duplication.** Ruled out as an omission: it writes a deny object rather than a context reply, which is the correct shape for `post_agent`.

### **A fifth dimension left uncovered.** Ruled out: correctness, security, traceability and maintainability each ran a full iteration, and this sweep closed the cross-reference protocol. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **A fifth dimension left uncovered.** Ruled out: correctness, security, traceability and maintainability each ran a full iteration, and this sweep closed the cross-reference protocol.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A fifth dimension left uncovered.** Ruled out: correctness, security, traceability and maintainability each ran a full iteration, and this sweep closed the cross-reference protocol.

### **A parity gap in `classifier-injection-screen` or `ask-surface-guard`.** Ruled out: both differences are documented as intentional at `:135` and `:133`, and neither drops a behaviour the OpenCode plugin has. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A parity gap in `classifier-injection-screen` or `ask-surface-guard`.** Ruled out: both differences are documented as intentional at `:135` and `:133`, and neither drops a behaviour the OpenCode plugin has.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A parity gap in `classifier-injection-screen` or `ask-surface-guard`.** Ruled out: both differences are documented as intentional at `:135` and `:133`, and neither drops a behaviour the OpenCode plugin has.

### **A self-injection loop through the completion sentinel.** Ruled out: the `detail` written by `writePendingAdvisory` is built from fixed strings plus `specFolder` (`completion-evidence-sentinel.cjs:260,309,595`) and never from the model's claim text, so the advisory cannot carry model output back into the next turn's context. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **A self-injection loop through the completion sentinel.** Ruled out: the `detail` written by `writePendingAdvisory` is built from fixed strings plus `specFolder` (`completion-evidence-sentinel.cjs:260,309,595`) and never from the model's claim text, so the advisory cannot carry model output back into the next turn's context.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A self-injection loop through the completion sentinel.** Ruled out: the `detail` written by `writePendingAdvisory` is built from fixed strings plus `specFolder` (`completion-evidence-sentinel.cjs:260,309,595`) and never from the model's claim text, so the advisory cannot carry model output back into the next turn's context.

### **A strict `post_tool` hook's `hook_specific_output.additional_context` blanking the tool result.** Ruled out by live evidence: VIB-HK-016 passed with the advisory present in the journal `post_tool_call` result and the tool output intact. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **A strict `post_tool` hook's `hook_specific_output.additional_context` blanking the tool result.** Ruled out by live evidence: VIB-HK-016 passed with the advisory present in the journal `post_tool_call` result and the tool output intact.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A strict `post_tool` hook's `hook_specific_output.additional_context` blanking the tool result.** Ruled out by live evidence: VIB-HK-016 passed with the advisory present in the journal `post_tool_call` result and the tool output intact.

### **The `.skilled/hooks/*/vibe/` tree as a duplicated second copy of the guards.** Ruled out: eleven of the entries are symlinks into `.vibe/plugins/repo-guards/`, verified with `-L`, and the remaining real files have no counterpart in the repo-guards tree. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **The `.skilled/hooks/*/vibe/` tree as a duplicated second copy of the guards.** Ruled out: eleven of the entries are symlinks into `.vibe/plugins/repo-guards/`, verified with `-L`, and the remaining real files have no counterpart in the repo-guards tree.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The `.skilled/hooks/*/vibe/` tree as a duplicated second copy of the guards.** Ruled out: eleven of the entries are symlinks into `.vibe/plugins/repo-guards/`, verified with `-L`, and the remaining real files have no counterpart in the repo-guards tree.

### **The `main().catch(() => { process.exitCode = 0; })` pattern as an error-swallowing defect.** Ruled out: it is the documented fail-open contract for a non-strict hook, and every adapter that uses it also documents the intent in its header comment. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **The `main().catch(() => { process.exitCode = 0; })` pattern as an error-swallowing defect.** Ruled out: it is the documented fail-open contract for a non-strict hook, and every adapter that uses it also documents the intent in its header comment.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The `main().catch(() => { process.exitCode = 0; })` pattern as an error-swallowing defect.** Ruled out: it is the documented fail-open contract for a non-strict hook, and every adapter that uses it also documents the intent in its header comment.

### **The `session_start` binding as mis-declared.** Ruled out: `hooks.toml:141-144` declares it on `session_start` with no `strict`, which matches `guards-and-hooks.md:69`. The finding is the missing verification, not the declaration. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **The `session_start` binding as mis-declared.** Ruled out: `hooks.toml:141-144` declares it on `session_start` with no `strict`, which matches `guards-and-hooks.md:69`. The finding is the missing verification, not the declaration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The `session_start` binding as mis-declared.** Ruled out: `hooks.toml:141-144` declares it on `session_start` with no `strict`, which matches `guards-and-hooks.md:69`. The finding is the missing verification, not the declaration.

### **The classification table's `not needed` rows as missing ports.** Ruled out: `codex-hooks-watchdog.js`, `sk-git-preflight-advisory.js` and `system-speckit-completion.js` each name a reason that holds for Vibe, and none of them names a binding that should exist. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **The classification table's `not needed` rows as missing ports.** Ruled out: `codex-hooks-watchdog.js`, `sk-git-preflight-advisory.js` and `system-speckit-completion.js` each name a reason that holds for Vibe, and none of them names a binding that should exist.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The classification table's `not needed` rows as missing ports.** Ruled out: `codex-hooks-watchdog.js`, `sk-git-preflight-advisory.js` and `system-speckit-completion.js` each name a reason that holds for Vibe, and none of them names a binding that should exist.

### **The verdict table as stale evidence for the three hooks the hand-over merge changed.** Ruled out: the table records the reruns of VIB-HK-003 to 007 on the merged code between 19:40 and 19:56 UTC, and `manual-testing-playbook.md:265` states the rule the table follows. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **The verdict table as stale evidence for the three hooks the hand-over merge changed.** Ruled out: the table records the reruns of VIB-HK-003 to 007 on the merged code between 19:40 and 19:56 UTC, and `manual-testing-playbook.md:265` states the rule the table follows.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The verdict table as stale evidence for the three hooks the hand-over merge changed.** Ruled out: the table records the reruns of VIB-HK-003 to 007 on the merged code between 19:40 and 19:56 UTC, and `manual-testing-playbook.md:265` states the rule the table follows.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS

- `payload.tool_status` absent from the Vibe `post_tool` payload: ruled out. `guards-and-hooks.md` section 5 documents `tool_status` among the `post_tool` fields, so the failed-tool guard in `post-edit-quality.mjs:45`, `dist-freshness.mjs:106` and `classifier-injection-screen.mjs:41` reads a documented field.
- `{"hook_specific_output":{"additional_context":...}}` from a strict `post_tool` hook blanking the tool result: ruled out by live evidence. VIB-HK-016 passed with the advisory present in the journal `post_tool_call` result and the tool output intact.
- `env-secret-guard` lacking an `isHookEnabled` kill switch: ruled out. `env-secret-guard.cjs:843` reads the switch from the environment only, deliberately, because a flags file in the checkout is agent-writable.
- `overlay-guard` not judging `bash`: ruled out as a parity defect. `.opencode/plugins/overlay-guard.js` also restricts itself to write/edit/patch tools.
- `env-secret-guard` missing a tool the binding matches: ruled out. `env-secret-guard.cjs:32-35` covers `read_file`/`write`/`edit`, `:40` covers `bash`, and `evaluateToolCall` at `:770-798` dispatches on all of them.
- A self-injection loop through the completion sentinel: ruled out. The advisory `detail` is built from fixed strings plus `specFolder` (`completion-evidence-sentinel.cjs:260,309,595`), never from the model's claim text.
- `spec-gate`'s `AI_SESSION_CHILD` exemption as a security defect: ruled out. It is the documented child-dispatch contract and the gate still records the decision.
- `classifier-injection-screen` lacking a size cap or a timeout: ruled out as a Vibe-adapter finding. The bound belongs to the shared `screenText` core, and the non-strict binding turns a timeout into a no-op rather than a block.
- `turn-end.mjs` lacking its own kill switch: ruled out. It delegates to `completion-evidence-post-agent.cjs`, which calls `isHookEnabled` twice.
- `git-message-gate.mjs` lacking a kill switch: ruled out. `:9` documents the absence as deliberate, with the reason stated in the file.
- `prompt-advisor.mjs`'s receipt directory as a payload-rooted write: ruled out. `headReceiptDir` resolves from `tmpdir()` or a configured environment path, never from the payload.
- `ask-surface-post-agent.mjs`'s marker path as a payload-rooted write: ruled out. `markTurn` is called with `markerDir`, which is `undefined` in production, so the default `baseDir = tmpdir()` applies.
- `mcp-route-guard`'s missing `match` as a dead or over-broad binding: ruled out. `mcp-route-guard.mjs:53-54` filters to `mcp_<server>.<tool>` names before the core runs, and Vibe's MCP tool names are dynamic so no static selector could express them.
- `deep-loop-guard` reading a `tool_input` key the payload does not carry: ruled out. `deep-loop-guard.mjs:99-105` reads `config_name` defensively, which is the key the classification row at `:124` names.
- The classification table's three `not needed` rows as missing ports: ruled out. Each names a reason that holds for Vibe and none names a binding that should exist.
- `env-secret-guard.js`'s "registers three value-free dotenv inspection tools" as a Vibe claim: ruled out. The "What it does" column describes the OpenCode plugin; the verdict column lands it on `pre_tool` alone.
- `session_start`'s `system_message` as an undocumented field: ruled out. `:238` documents it for `session_start`; the undocumented use is `spec-gate.mjs:76` on a strict `pre_tool` hook, already `R1-P2-001`.
- A parity gap in `classifier-injection-screen` or `ask-surface-guard`: ruled out. Both differences are documented as intentional at `:135` and `:133`.
- The `.skilled/hooks/*/vibe/` tree as a duplicated second copy of the guards: ruled out. Eleven of the entries are symlinks into `.vibe/plugins/repo-guards/`, verified with `-L`, and the remaining real files have no counterpart there.
- `compaction-context.mjs` as a god module: ruled out. Six cohesive sections and three exports.
- `turn-end.mjs` missing from the reply-write duplication: ruled out as an omission. It writes a deny object, which is the correct shape for `post_agent`.
- The `main().catch(() => { process.exitCode = 0; })` pattern as error swallowing: ruled out. It is the documented fail-open contract for a non-strict hook.
- `goal-inject.mjs` and `ask-surface-post-agent.mjs` as parse-failure inconsistencies: ruled out. Neither parses stdin itself; both take a payload from a shared reader.
- The verdict table as stale evidence for the three hooks the hand-over merge changed: ruled out. The table records the reruns of VIB-HK-003 to 007 on the merged code, and `manual-testing-playbook.md:265` states the rule it follows.
- `R4-P2-003`'s three adapters as unverified: ruled out. VIB-HK-015, VIB-HK-008 and VIB-HK-009 each passed live for one of them; the finding is narrowed to the automated-test gap.
- `R3-P2-002` as a runtime defect: ruled out by VIB-HK-016's live pass. The finding is scoped to the reply table's completeness.
- `R1-P2-001` as an author oversight: ruled out. `spec-gate.mjs:73-75` documents the choice and the reason.
- The `session_start` binding as mis-declared: ruled out. `hooks.toml:141-144` declares it on `session_start` with no `strict`, matching `guards-and-hooks.md:69`.

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none remaining. All four declared dimensions are complete and the cross-reference sweep is closed. - Focus area: the synthesis. The report carries 16 active findings (1 P1, 15 P2), the verdict `CONDITIONAL`, and the Planning Packet built from the finding registry. - Reason: `config.maxIterations` is 5 and this is iteration 5, so the lineage stops on `max-iterations` with `stopReason: "maxIterationsReached"`. - Rotation status: correctness, security, traceability, maintainability and cross-reference all complete. - Blocked/productive carry-forward: productive — cross-referencing the scenario census against the binding census found the one unverified binding in a single pass, and the verdict table supplied counterevidence that narrowed two carried findings. - Required evidence: the synthesis cites the registry, not this narrative, for the finding count and the verdict. Review verdict: CONDITIONAL

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers: `.vibe/hooks.toml` (18 bindings), `.vibe/plugins/repo-guards/` (13 scripts + `lib/hook-io.mjs` + `render-home-hooks.cjs`), `.skilled/hooks/session-lifecycle/vibe/` (5 modules), `.skilled/hooks/ask-surface-guard/vibe/`, `.skilled/hooks/decision-capture/vibe/`, `.skilled/hooks/goal/vibe/`, `.skilled/hooks/session-handover/vibe/`, `.skilled/hooks/shared/session-readers/vibe.mjs`, `.skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs`, `.skilled/skills/system-spec-kit/runtime/hooks/vibe/completion-evidence-post-agent.cjs`.
- Behaviour claims to verify: `guards-and-hooks.md` sections 2-5 (seven hook types, the strict set, the default 60 s timeout, the reply table, the documented payload fields); `.vibe/plugins/README.md` sections 4-5 (key files and the plugin map); `injection-contract.md` line 30 and line 238 (Vibe's injection channels).
- Reuse and conventions: every adapter is fail-open by construction (`runGuard` in `hook-io.mjs`), every guard core is runtime-neutral under `.skilled/hooks/*/lib/`, and every kill switch goes through `isHookEnabled` from `.skilled/hooks/shared/hook-flags.mjs` except where a core deliberately reads the environment only.
- Review risks and gaps: the `post_tool` and `pre_agent` payload shapes are documented rather than observed (only `pre_tool` and `post_agent` were captured), so a payload-field finding must cite the documentation, not a capture. No `resource-map.md` exists for this packet, so the Resource Map Coverage Gate is skipped.

### Recorded contract conflicts

- **`step_update_config_status` versus the agent's config prohibition.** The workflow's synthesis phase sets `status: "complete"` in `deep-review-config.json`. The `@deep-review` agent contract marks that file read-only and forbids modifying it after init. The agent contract wins here, so the config still reads `status: "initialized"`. The run's completion is durable in `deep-review-state.jsonl` instead: the terminal `event` row carries `stopReason: "maxIterationsReached"` and `verdict: "CONDITIONAL"`, and a resume reads the state log rather than the config status.
- **`step_stage_artifact_dir`.** The workflow stages the artifact directory with `git add`. The dispatch forbids any git write, so the step was skipped and the operator keeps staging authority.

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pass | 1 | The documented binding census and strict set match `.vibe/hooks.toml:7-150` exactly (18 bindings: 2 `pre_agent`, 7 strict `pre_tool`, 6 `post_tool`, 1 `post_agent`, 1 `session_start`, 1 `session_end`). |
| `checklist_evidence` | core | notApplicable | 1 | The declared target is a file set, not a spec folder with a checklist. The only checklist-shaped evidence is the remediation disposition table, which this lineage treats as an exclusion list. |
| `skill_agent` | overlay | pending | - | - |
| `agent_cross_runtime` | overlay | pending | - | - |
| `feature_catalog_code` | overlay | pending | - | - |
| `playbook_capability` | overlay | pending | - | - |
<!-- MACHINE-OWNED: END -->

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `.vibe/hooks.toml` | correctness | 1 | 0 P0, 0 P1, 2 P2 | partial |
| `.vibe/plugins/repo-guards/lib/hook-io.mjs` | correctness | 1 | 0 P0, 1 P1, 1 P2 | partial |
| `.vibe/plugins/repo-guards/spec-gate.mjs` | correctness | 1 | 0 P0, 0 P1, 1 P2 | partial |
| `.vibe/plugins/repo-guards/spec-gate-classify.mjs` | correctness | 1 | 0 P0, 0 P1, 0 P2 | partial |
| `.vibe/plugins/repo-guards/env-secret-guard.mjs` | correctness | 1 | 0 P0, 0 P1, 0 P2 | partial |
| `.vibe/plugins/repo-guards/dispatch-preflight.mjs` | correctness | 1 | 0 P0, 0 P1, 1 P2 | partial |
| `.vibe/plugins/repo-guards/overlay-guard.mjs` | correctness | 1 | 0 P0, 0 P1, 1 P2 | partial |
| `.vibe/plugins/repo-guards/mcp-route-guard.mjs` | correctness | 1 | 0 P0, 0 P1, 0 P2 | partial |
| `.vibe/plugins/repo-guards/git-message-gate.mjs` | correctness | 1 | 0 P0, 0 P1, 0 P2 | partial |
| `.vibe/plugins/repo-guards/deep-loop-guard.mjs` | correctness | 1 | 0 P0, 0 P1, 0 P2 | partial |
| `.vibe/plugins/repo-guards/post-edit-quality.mjs` | correctness | 1 | 0 P0, 0 P1, 0 P2 | partial |
| `.vibe/plugins/repo-guards/dist-freshness.mjs` | correctness | 1 | 0 P0, 0 P1, 0 P2 | partial |
| `.vibe/plugins/repo-guards/classifier-injection-screen.mjs` | correctness | 1 | 0 P0, 0 P1, 0 P2 | partial |
| `.vibe/plugins/repo-guards/session-cleanup.mjs` | correctness | 1 | 0 P0, 0 P1, 1 P2 | partial |
| `.vibe/plugins/repo-guards/render-home-hooks.cjs` | correctness | 1 | 0 P0, 0 P1, 0 P2 | partial |
| `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs` | correctness | 1 | 0 P0, 0 P1, 1 P2 | partial |
| `.skilled/hooks/session-lifecycle/vibe/turn-end.mjs` | correctness | 1 | 0 P0, 0 P1, 0 P2 | partial |
| `.skilled/hooks/session-lifecycle/vibe/session-start.mjs` | correctness | 1 | 0 P0, 0 P1, 0 P2 | partial |
| `.skilled/hooks/session-lifecycle/vibe/compaction-context.mjs` | correctness | 1 | 0 P0, 0 P1, 1 P2 | partial |
| `.skilled/hooks/session-lifecycle/vibe/compaction-post-tool.mjs` | correctness | 1 | 0 P0, 0 P1, 1 P2 | partial |
| `.skilled/hooks/ask-surface-guard/vibe/ask-surface-post-agent.mjs` | correctness | 1 | 0 P0, 0 P1, 1 P2 | partial |
| `.skilled/hooks/decision-capture/vibe/ask-capture-post-tool.mjs` | correctness | 1 | 0 P0, 0 P1, 1 P2 | partial |
| `.skilled/hooks/goal/vibe/goal-inject.mjs` | correctness | 1 | 0 P0, 0 P1, 1 P2 | partial |
| `.skilled/hooks/session-handover/vibe/handover-parts.mjs` | correctness | 1 | 0 P0, 0 P1, 1 P2 | partial |
| `.skilled/hooks/shared/session-readers/vibe.mjs` | correctness | 1 | 0 P0, 0 P1, 0 P2 | partial |
| `.skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs` | correctness | 1 | 0 P0, 0 P1, 0 P2 | partial |
| `.skilled/skills/system-spec-kit/runtime/hooks/vibe/completion-evidence-post-agent.cjs` | correctness | 1 | 0 P0, 0 P1, 1 P2 | partial |
<!-- MACHINE-OWNED: END -->

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 5
- Convergence threshold: 0.1
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-vibe-1-1794808672532-65xu0h, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 24 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: files
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-11-16T06:00:44Z
<!-- MACHINE-OWNED: END -->
