# Deep Review Strategy - Vibe Hooks and Plugins (lineage vibe-2)

## 1. REVIEW CHARTER

- Target: the Mistral Vibe hook and plugin surface — `.vibe/hooks.toml`, the 13 repo-guards scripts plus `lib/hook-io.mjs` and `render-home-hooks.cjs`, the five session-lifecycle composers, and the goal, hand-over, ask-surface, decision-capture, completion and skill-advisor adapters, plus the Vibe session reader.
- Dimensions: correctness, security, traceability, maintainability.
- Stop conditions: `maxIterations` = 5 reached (stopPolicy `max-iterations`); convergence is telemetry only for this lineage.
- Success criteria: every new or still-open defect carries `file:line` evidence; the 29 findings dispositioned in `023-vibe-review-remediation/implementation-summary.md` are not re-reported.
- Operator review focus (bound as `review_focus`): correctness, security and fail-open defects, wire-format and payload edge cases, ordering and kill-switch gaps, and parity gaps against the OpenCode plugins.

---

## 2. TOPIC

Every Mistral Vibe hook and plugin: the bindings in `.vibe/hooks.toml`, the repo-guards plugins and `lib/hook-io.mjs`, `render-home-hooks.cjs`, the session-lifecycle composers (turn-start, turn-end, session-start, compaction), the goal, hand-over, ask-surface, decision-capture, completion and skill-advisor adapters, and the Vibe session reader.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS

- Re-reporting the 29 findings already dispositioned in `023-vibe-review-remediation/implementation-summary.md`. Only new or still-open defects are in scope.
- The runtime-neutral guard cores under `.skilled/hooks/*/lib/` and `.skilled/skills/system-spec-kit/runtime/hooks/lib/`, except where a Vibe adapter's use of a core contract is the defect.
- The OpenCode plugins themselves. They are read as the parity reference, not as review targets.
- Live re-execution of the manual-testing playbook. Verdicts are read as evidence, not re-run.

---

## 5. STOP CONDITIONS

- `maxIterations` = 5 reached. This lineage runs to the cap by design; convergence before the cap is telemetry only.
- A hard-block invariant failure before an iteration's writes (packet boundary, writable path, state file) returns `error` instead of a partial artifact.

---

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

- Reading the runtime-neutral core beside each Vibe adapter: the adapter's contract violation is only visible against the core's own docstring (iteration 1).
- Grepping the sibling adapters (`claude`, `codex`, `cursor`, `devin`) for the same core call: a missing acknowledgement shows up as a parity gap rather than a style choice (iteration 1).
- Reading each ported guard beside its OpenCode original: a Vibe-only gate with no cross-runtime precedent stands out immediately, which is how the `tool_status` assumption surfaced (iteration 5).
- Counting the bindings in `.vibe/hooks.toml` against the port map's own count: the two agree at 18, so the binding set is provably complete and the remaining gap is in the per-plugin verdicts (iteration 5).

---

## 9. WHAT FAILED

- Treating the journal segment sort as a defect: the live journal names are zero-padded to 16 digits (`journal/0000000000000234.jsonl`), so the lexicographic sort in `vibe.mjs:66` is numeric order. Ruled out before writing (iteration 1).
- Treating the port map as incomplete: all 21 OpenCode plugins are classified and each `not needed` verdict names a reason. Only two `hook` rows omit a loss, which is the narrower finding R5-P2-003 records (iteration 5).
- Reading the `post_tool` field names as a correctness defect: the reference doc records them as documented rather than observed, so the finding is a traceability finding about an unverified assumption, not a claim that the value is wrong (iteration 5).

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **`appendAdvisoryLog` throwing and losing the pending advisory.** The sentinel wraps its whole body and returns `false`. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **`appendAdvisoryLog` throwing and losing the pending advisory.** The sentinel wraps its whole body and returns `false`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`appendAdvisoryLog` throwing and losing the pending advisory.** The sentinel wraps its whole body and returns `false`.

### **`claimNudge` throwing.** It returns a no-op claim on any error. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **`claimNudge` throwing.** It returns a no-op claim on any error.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`claimNudge` throwing.** It returns a no-op claim on any error.

### **`compaction-post-tool.mjs` judging a non-`post_tool` payload.** `buildPostToolPart` checks `hook_event_name` itself at line 361. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **`compaction-post-tool.mjs` judging a non-`post_tool` payload.** `buildPostToolPart` checks `hook_event_name` itself at line 361.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`compaction-post-tool.mjs` judging a non-`post_tool` payload.** `buildPostToolPart` checks `hook_event_name` itself at line 361.

### **`deep-loop-guard.mjs` reading the wrong subagent field.** `tool_input.config_name` is confirmed as the Vibe field by `guards-and-hooks.md:126` and by live scenario VIB-HK-024, which asserts the spawn carries `"config_name":"prompt-improver"`. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **`deep-loop-guard.mjs` reading the wrong subagent field.** `tool_input.config_name` is confirmed as the Vibe field by `guards-and-hooks.md:126` and by live scenario VIB-HK-024, which asserts the spawn carries `"config_name":"prompt-improver"`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`deep-loop-guard.mjs` reading the wrong subagent field.** `tool_input.config_name` is confirmed as the Vibe field by `guards-and-hooks.md:126` and by live scenario VIB-HK-024, which asserts the spawn carries `"config_name":"prompt-improver"`.

### **`dist-freshness` throwing on a missing `python3`.** `runChecker` returns `String(result.stdout ?? '')`, so a spawn error yields an empty banner. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **`dist-freshness` throwing on a missing `python3`.** `runChecker` returns `String(result.stdout ?? '')`, so a spawn error yields an empty banner.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`dist-freshness` throwing on a missing `python3`.** `runChecker` returns `String(result.stdout ?? '')`, so a spawn error yields an empty banner.

### **`earlyWithdrawn` growing without bound.** Each hook invocation is a fresh process and the entry is deleted in the same turn. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **`earlyWithdrawn` growing without bound.** Each hook invocation is a fresh process and the entry is deleted in the same turn.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`earlyWithdrawn` growing without bound.** Each hook invocation is a fresh process and the entry is deleted in the same turn.

### **`git-message-gate.mjs` having no kill switch.** Documented as deliberate at lines 8-9: "The contract has no bypass on any surface, so this hook has no kill switch either." -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **`git-message-gate.mjs` having no kill switch.** Documented as deliberate at lines 8-9: "The contract has no bypass on any surface, so this hook has no kill switch either."
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`git-message-gate.mjs` having no kill switch.** Documented as deliberate at lines 8-9: "The contract has no bypass on any surface, so this hook has no kill switch either."

### **`goal-inject.mjs` defaulting `workspace` to `process.cwd()`.** Both callers pass `REPO_ROOT` explicitly. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **`goal-inject.mjs` defaulting `workspace` to `process.cwd()`.** Both callers pass `REPO_ROOT` explicitly.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`goal-inject.mjs` defaulting `workspace` to `process.cwd()`.** Both callers pass `REPO_ROOT` explicitly.

### **`mcp-route-guard` running on every `pre_tool` call.** It has no `match`, but `coreToolNameFor` returns null for any name that does not start with `mcp_`, so a non-MCP call is allowed before the core is consulted. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **`mcp-route-guard` running on every `pre_tool` call.** It has no `match`, but `coreToolNameFor` returns null for any name that does not start with `mcp_`, so a non-MCP call is allowed before the core is consulted.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`mcp-route-guard` running on every `pre_tool` call.** It has no `match`, but `coreToolNameFor` returns null for any name that does not start with `mcp_`, so a non-MCP call is allowed before the core is consulted.

### **`post-edit-quality` command injection through an edited file's path.** The router spawns without a shell. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **`post-edit-quality` command injection through an edited file's path.** The router spawns without a shell.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`post-edit-quality` command injection through an edited file's path.** The router spawns without a shell.

### **`post-edit-quality` running on a failed write.** The `tool_status` gate at line 45 covers it, and line 55 covers a file that does not exist. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **`post-edit-quality` running on a failed write.** The `tool_status` gate at line 45 covers it, and line 55 covers a file that does not exist.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`post-edit-quality` running on a failed write.** The `tool_status` gate at line 45 covers it, and line 55 covers a file that does not exist.

### **`session-cleanup.mjs` not disposing the plugin at session start.** `dispose()` runs the cleanup script, which is the session-end work; skipping it at start is correct. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **`session-cleanup.mjs` not disposing the plugin at session start.** `dispose()` runs the cleanup script, which is the session-end work; skipping it at start is correct.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`session-cleanup.mjs` not disposing the plugin at session start.** `dispose()` runs the cleanup script, which is the session-end work; skipping it at start is correct.

### **`spec-gate-classify` opening the gate for a subagent.** `classifyIntent` returns before any state read when `isChildSession` is true. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **`spec-gate-classify` opening the gate for a subagent.** `classifyIntent` returns before any state read when `isChildSession` is true.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`spec-gate-classify` opening the gate for a subagent.** `classifyIntent` returns before any state read when `isChildSession` is true.

### **`spec-gate.mjs` and `spec-gate-classify.mjs` keying different state files.** Both resolve to the same key; see Confirmed-Clean Surfaces. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **`spec-gate.mjs` and `spec-gate-classify.mjs` keying different state files.** Both resolve to the same key; see Confirmed-Clean Surfaces.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`spec-gate.mjs` and `spec-gate-classify.mjs` keying different state files.** Both resolve to the same key; see Confirmed-Clean Surfaces.

### **`toCoreCall` reading the wrong write path field.** `tool_input.file_path` is confirmed for `file_system.write_file` and `file_system.edit` by `fixtures/wire-format/tool-names.md:8-9`. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **`toCoreCall` reading the wrong write path field.** `tool_input.file_path` is confirmed for `file_system.write_file` and `file_system.edit` by `fixtures/wire-format/tool-names.md:8-9`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`toCoreCall` reading the wrong write path field.** `tool_input.file_path` is confirmed for `file_system.write_file` and `file_system.edit` by `fixtures/wire-format/tool-names.md:8-9`.

### **`turn-end.mjs` requiring the completion part by an absolute path.** `createRequire(import.meta.url)` accepts an absolute path, and the path resolves to `.skilled/skills/system-spec-kit/runtime/hooks/vibe/completion-evidence-post-agent.cjs`. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **`turn-end.mjs` requiring the completion part by an absolute path.** `createRequire(import.meta.url)` accepts an absolute path, and the path resolves to `.skilled/skills/system-spec-kit/runtime/hooks/vibe/completion-evidence-post-agent.cjs`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`turn-end.mjs` requiring the completion part by an absolute path.** `createRequire(import.meta.url)` accepts an absolute path, and the path resolves to `.skilled/skills/system-spec-kit/runtime/hooks/vibe/completion-evidence-post-agent.cjs`.

### **A missing binding in `.vibe/hooks.toml`.** The count is 18 and the event split matches the doc. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **A missing binding in `.vibe/hooks.toml`.** The count is 18 and the event split matches the doc.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A missing binding in `.vibe/hooks.toml`.** The count is 18 and the event split matches the doc.

### **A wrong relative root in any composer.** `turn-start.mjs:44`, `session-start.mjs:29`, `compaction-context.mjs:45`, `prompt-advisor.mjs:30` and `hook-io.mjs:16` each climb the correct number of levels to the checkout. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A wrong relative root in any composer.** `turn-start.mjs:44`, `session-start.mjs:29`, `compaction-context.mjs:45`, `prompt-advisor.mjs:30` and `hook-io.mjs:16` each climb the correct number of levels to the checkout.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A wrong relative root in any composer.** `turn-start.mjs:44`, `session-start.mjs:29`, `compaction-context.mjs:45`, `prompt-advisor.mjs:30` and `hook-io.mjs:16` each climb the correct number of levels to the checkout.

### **An unclassified OpenCode plugin.** All 21 rows are present. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **An unclassified OpenCode plugin.** All 21 rows are present.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **An unclassified OpenCode plugin.** All 21 rows are present.

### **Journal segment ordering in the session reader.** `session-readers/vibe.mjs:66` sorts journal file names with a default lexicographic `.sort()`, which would misorder `10.jsonl` before `2.jsonl`. Ruled out: the live journal names are zero-padded to 16 digits (`journal/0000000000000234.jsonl`, recorded in `.skilled/logs/cli-dispatch-audit.log:163`), so lexicographic order equals numeric order. Recorded in the strategy as a BLOCKED approach. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Journal segment ordering in the session reader.** `session-readers/vibe.mjs:66` sorts journal file names with a default lexicographic `.sort()`, which would misorder `10.jsonl` before `2.jsonl`. Ruled out: the live journal names are zero-padded to 16 digits (`journal/0000000000000234.jsonl`, recorded in `.skilled/logs/cli-dispatch-audit.log:163`), so lexicographic order equals numeric order. Recorded in the strategy as a BLOCKED approach.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Journal segment ordering in the session reader.** `session-readers/vibe.mjs:66` sorts journal file names with a default lexicographic `.sort()`, which would misorder `10.jsonl` before `2.jsonl`. Ruled out: the live journal names are zero-padded to 16 digits (`journal/0000000000000234.jsonl`, recorded in `.skilled/logs/cli-dispatch-audit.log:163`), so lexicographic order equals numeric order. Recorded in the strategy as a BLOCKED approach.

### **Journal segment ordering in the session reader.** Zero-padded names make the lexicographic sort correct; BLOCKED in the strategy. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Journal segment ordering in the session reader.** Zero-padded names make the lexicographic sort correct; BLOCKED in the strategy.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Journal segment ordering in the session reader.** Zero-padded names make the lexicographic sort correct; BLOCKED in the strategy.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS

- Journal segment ordering: zero-padded names make the lexicographic sort correct (iteration 1, evidence: `.skilled/logs/cli-dispatch-audit.log:163` names `journal/0000000000000234.jsonl`).
- `deep-loop-guard.mjs` reading `tool_input.config_name`: confirmed as the real Vibe field by `references/guards-and-hooks.md:126` and live scenario VIB-HK-024 (iteration 1).
- `toCoreCall` reading the wrong write path field: `tool_input.file_path` is confirmed for `file_system.write_file` and `file_system.edit` by `fixtures/wire-format/tool-names.md:8-9` (iteration 1).
- `spec-gate.mjs` and `spec-gate-classify.mjs` keying different state files: both resolve to the same key, since `resolveSessionKey` and `sessionStateKey` share the `UNKNOWN_SESSION_ID` fallback (iteration 1).
- `git-message-gate.mjs` having no kill switch: documented as deliberate at lines 8-9 (iteration 1).
- `session-cleanup.mjs` not disposing the plugin at session start: `dispose()` runs the cleanup script, which is the session-end work (iteration 2).
- `spec-gate-classify` opening the gate for a subagent: `classifyIntent` returns before any state read when `isChildSession` is true (iteration 2).
- `mcp-route-guard` running on every `pre_tool` call: `coreToolNameFor` returns null for a non-MCP name (iteration 2).
- `post-edit-quality` command injection through an edited file's path: the router spawns without a shell (iteration 2).
- `compaction-post-tool` judging a non-`post_tool` payload: `buildPostToolPart` checks `hook_event_name` itself (iteration 3).
- `turn-end` requiring the completion part by an absolute path: `createRequire` accepts it and the path resolves correctly (iteration 3).
- A wrong relative root in any composer: each climbs the correct number of levels to the checkout (iteration 3).
- `appendAdvisoryLog` throwing and losing the pending advisory: the sentinel wraps its whole body and returns `false` (iteration 4).
- `claimNudge` throwing: it returns a no-op claim on any error (iteration 4).
- `earlyWithdrawn` growing without bound: each hook invocation is a fresh process and the entry is deleted in the same turn (iteration 4).
- `goal-inject` defaulting `workspace` to `process.cwd()`: both callers pass `REPO_ROOT` explicitly (iteration 4).
- A missing binding in `.vibe/hooks.toml`: the count is 18 and the event split matches `guards-and-hooks.md:37` (iteration 5).
- An unclassified OpenCode plugin: all 21 rows are present in `guards-and-hooks.md:116-139` (iteration 5).
- `post-edit-quality` running on a failed write: the `tool_status` gate at line 45 covers it and line 55 covers a file that does not exist (iteration 5).
- `dist-freshness` throwing on a missing `python3`: `runChecker` returns `String(result.stdout ?? '')`, so a spawn error yields an empty banner (iteration 5).

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- None. This is the fifth and final iteration of the lineage; `maxIterations` is reached and the synthesis phase follows. Review verdict: CONDITIONAL

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers: `.vibe/hooks.toml` declares 18 bindings (2 `pre_agent`, 7 strict `pre_tool`, 6 `post_tool`, 1 `post_agent`, 1 `session_start`, 1 `session_end`). The guard scripts live under `.vibe/plugins/repo-guards/`; the composers under `.skilled/hooks/session-lifecycle/vibe/`.
- Behavior claims: the recorded wire format in `references/guards-and-hooks.md` §5 — `tool_name` is always the qualified name; a `pre_tool` reply is either empty or `{"decision":"deny","reason":"..."}`; `strict = true` turns a `pre_tool` failure path into a deny; `session_start` reads `additional_context` and `system_message` only.
- Reuse and conventions: every adapter is fail-open by construction — `runGuard` catches a thrown error and allows. The runtime-neutral cores own the decisions; the Vibe files own transport only.
- Review risks and gaps: the `post_tool` and `session_start` payloads are documented rather than observed, so a field-name assumption there is inference. The 29 prior findings are dispositioned, so a re-report is a false positive.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | partial | 4 | Binding set and part order match the record; the `pre_tool` advise reply field, the compaction size-gate claim and the advisor's isolation-switch claim do not |
| `checklist_evidence` | core | notApplicable | 1 | No checklist document on a hook and plugin surface |
| `skill_agent` | overlay | pending | - | - |
| `agent_cross_runtime` | overlay | pending | - | - |
| `feature_catalog_code` | overlay | pending | - | - |
| `playbook_capability` | overlay | pending | - | - |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `.vibe/plugins/repo-guards/lib/hook-io.mjs` | D1 | 1 | 0 P0, 0 P1, 1 P2 | partial |
| `.vibe/plugins/repo-guards/spec-gate.mjs` | D1 | 1 | 0 P0, 1 P1, 0 P2 | partial |
| `.vibe/plugins/repo-guards/session-cleanup.mjs` | D1 | 1 | 0 P0, 0 P1, 1 P2 | partial |
| `.vibe/plugins/repo-guards/dispatch-preflight.mjs` | D1 | 1 | 0 P0, 0 P1, 1 P2 | partial |
| `.vibe/plugins/repo-guards/spec-gate-classify.mjs` | D1 | 1 | clean | complete |
| `.vibe/plugins/repo-guards/env-secret-guard.mjs` | D1 | 1 | clean | complete |
| `.vibe/plugins/repo-guards/overlay-guard.mjs` | D1 | 1 | clean | complete |
| `.vibe/plugins/repo-guards/git-message-gate.mjs` | D1 | 1 | clean | complete |
| `.vibe/plugins/repo-guards/mcp-route-guard.mjs` | D1 | 1 | clean | complete |
| `.vibe/plugins/repo-guards/deep-loop-guard.mjs` | D1 | 1 | clean | complete |
| `.vibe/plugins/repo-guards/post-edit-quality.mjs` | D1 | 1 | clean | complete |
| `.vibe/plugins/repo-guards/dist-freshness.mjs` | D1 | 1 | clean | complete |
| `.vibe/plugins/repo-guards/classifier-injection-screen.mjs` | D1 | 1 | clean | complete |
| `.vibe/plugins/repo-guards/render-home-hooks.cjs` | D1 | 1 | clean | complete |
| `.vibe/hooks.toml` | D1, D2 | 2 | clean | complete |
| `.skilled/hooks/session-lifecycle/vibe/session-start.mjs` | D2, D1 | 3 | 0 P0, 0 P1, 3 P2 | partial |
| `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs` | D1 | 3 | 0 P0, 0 P1, 1 P2 | partial |
| `.skilled/hooks/session-lifecycle/vibe/turn-end.mjs` | D1 | 3 | clean | complete |
| `.skilled/hooks/session-lifecycle/vibe/compaction-post-tool.mjs` | D1 | 3 | 0 P0, 0 P1, 1 P2 | partial |
| `.skilled/hooks/session-lifecycle/vibe/compaction-context.mjs` | D1 | 3 | clean | complete |
| `.skilled/hooks/shared/session-readers/vibe.mjs` | D1 | 3 | clean | complete |
| `.skilled/hooks/session-handover/vibe/handover-parts.mjs` | D1 | 4 | 0 P0, 0 P1, 1 P2 | partial |
| `.skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs` | D1 | 4 | 0 P0, 0 P1, 1 P2 | partial |
| `.skilled/hooks/ask-surface-guard/vibe/ask-surface-post-agent.mjs` | D1 | 4 | 0 P0, 0 P1, 1 P2 | partial |
| `.skilled/skills/system-spec-kit/runtime/hooks/vibe/completion-evidence-post-agent.cjs` | D1 | 4 | 0 P0, 0 P1, 1 P2 | partial |
| `.skilled/hooks/goal/vibe/goal-inject.mjs` | D1 | 4 | clean | complete |
| `.skilled/hooks/decision-capture/vibe/ask-capture-post-tool.mjs` | D1 | 4 | clean | complete |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 5
- Convergence threshold: 0.1
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-vibe-2-1794808672532-65xu0h, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 24 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: files
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-11-16T06:04:21Z
<!-- MACHINE-OWNED: END -->
