# Iteration 9 — ADR-001 evidence package assembly

## Focus

Assemble an ADR-001-ready portability evidence pack from iterations 3–8. The pack consolidates the full Claude hook, OpenCode plugin, and seven guard-core verdicts; the native-import matrix; the bash-only cwd/env and exit contract; the PreCompact/PostCompaction analysis; the OpenCode alternatives; and one concrete eight-event `.devin/hooks.v1.json` skeleton.

The requested `research/evidence/` directory could not be created in this leaf: the dispatch contract permits writes only to this iteration narrative, the append-only state log, and `deltas/iter-009.jsonl`. The assembled pack is therefore recorded here, with the out-of-scope directory request flagged below.

## Actions Taken

- Read the phase 001 Devin contract pin, phase 004 ADR/plan, research config, prior iteration narratives 003–008, deltas 003–008, current state-log tail, and `findings-registry.json`.
- Reconciled the iteration-5 C-01–C-20, P-01–P-15, and G-01–G-07 classifications against the later iteration-6 cwd/exit correction and the iteration-7/8 lifecycle corrections.
- Preserved the later, stricter interpretation where evidence changed an earlier provisional verdict: the four shell-only rows and SessionEnd are treated as needing a thin cwd/output or process-identity boundary for production parity, even though iteration 5 called the simple lifecycle cases conditional 1:1.
- Cross-checked registry state without modifying the reducer-owned registry or dashboard.
- Wrote this narrative, the canonical iteration-9 state record, and the iteration-9 delta stream only.

## Findings

### ADR-001 decision

Use explicit Devin adapters as the authoritative path. Enable `read_config_from.claude:true` only as a compatibility probe or optional baseline for simple shell lifecycle commands and prompt-context candidates. Do not treat native import as parity: it does not rewrite Claude matcher names, normalize payloads or environment variables, translate Claude output envelopes, supply missing Stop evidence, rename `PreCompact` to `PostCompaction`, or load OpenCode plugin factories.

The reusable boundary is the runtime-neutral policy core plus a thin Devin transport adapter. The adapter owns Devin matcher selection, `DEVIN_PROJECT_DIR` anchoring, stdin normalization, exit-policy preservation, and Devin decision/context output. Completion evidence and post-compaction recovery remain semantic adaptations because their required Claude/OpenCode lifecycle inputs do not exist in Devin unchanged.

### Consolidated verdict table

Verdict meanings: **portable 1:1** means the behavior can use the Devin event without changing policy semantics, subject to the stated runtime condition; **needs adaptation** means the policy or useful behavior is reusable but the matcher, payload, cwd/env, output, or lifecycle boundary changes; **cannot port 1:1** means Devin has no equivalent hook/plugin surface for the registered behavior.

#### Claude settings: C-01–C-20

The repository has seven Claude settings hook keys and 19 command handlers. `PermissionRequest` is absent from the source settings and is represented as C-20 only to make the Devin coverage gap explicit.

| ID | Claude registration | Devin verdict and target | Native import | Evidence-based rationale |
|---|---|---|---|---|
| C-01 | `PreToolUse` / `Bash` / `cli-opencode/scripts/hooks/dispatch-preflight-lint.mjs` | **Needs adaptation** → `PreToolUse(^exec$)` | No effective coverage | `Bash` does not select Devin `exec`; the handler and deny envelope are Claude-specific. Reuse dispatch-rule evaluation, translate `tool_input.command` and Devin blocking output. |
| C-02 | `PreToolUse` / `Bash` / `system-spec-kit/runtime/hooks/claude/spec-gate-enforce.mjs` | **Needs adaptation** → `PreToolUse(^exec$)` | No effective coverage | The spec-gate policy is reusable, but the imported matcher and Claude permission output do not select or block Devin shell calls. |
| C-03 | `PreToolUse` / `Task` / `system-deep-loop/runtime/hooks/claude/task-dispatch-guard.cjs` | **Needs adaptation** → `PreToolUse(^run_subagent$)` | No effective coverage | Devin dispatch is `run_subagent`, with `profile`, `is_background`, and `resume`; the Claude wrapper expects `task` and `subagent_type`. |
| C-04 | `PreToolUse` / `mcp__claude_ai_.*` / `mcp-code-mode/runtime/hooks/claude/mcp-route-guard.cjs` | **Needs adaptation** → `PreToolUse(^mcp__.*$)` | Partial at best | The Claude registration hard-codes one server family. Devin exposes the generic MCP namespace; widen the matcher and translate project-root/context output. |
| C-05 | `PreToolUse` / `Write\|Edit` / `system-spec-kit/runtime/hooks/claude/spec-gate-enforce.mjs` | **Needs adaptation** → `PreToolUse(^edit$)` | No effective coverage | Devin's mutation tool is `edit`; path extraction and deny output also need Devin normalization. |
| C-06 | `UserPromptSubmit` / empty / `user-prompt-submit.js` | **Needs adaptation** → `UserPromptSubmit` | Conditional candidate | Devin supplies `prompt` and supports context output, but project discovery and the compiled Claude transport were not live-import verified. |
| C-07 | `UserPromptSubmit` / empty / `spec-gate-classify.mjs` | **Needs adaptation** → `UserPromptSubmit` | Conditional candidate | Event and prompt field align; cwd, state path, and output normalization remain runtime-specific. |
| C-08 | `PreCompact` / empty / `compact-inject.js` | **Cannot port 1:1**; replacement is `PostCompaction` | No | Devin has no before-compaction event. The after-compaction summary cannot preserve the original timing invariant. |
| C-09 | `SessionStart` / empty / `session-prime.js` | **Needs adaptation** → `SessionStart` | Conditional only | The event exists, but the compiled handler reads Claude-oriented session/context state and needs project-root/context normalization. |
| C-10 | `SessionStart` / empty / `worktree-guard.sh` | **Needs adaptation for production parity** → `SessionStart` | Conditional baseline | Shell-only behavior is event-compatible, but the command relies on inherited cwd. Anchor it at `DEVIN_PROJECT_DIR`; preserve its advisory exit behavior. |
| C-11 | `SessionStart` / empty / `check-git-hooks.sh` | **Needs adaptation for production parity** → `SessionStart` | Conditional baseline | Same cwd issue as C-10; warning is advisory and must not become a block. |
| C-12 | `SessionStart` / empty / `check-dist-staleness.sh --all` | **Needs adaptation for production parity** → `SessionStart` | Conditional baseline | The relative launcher and stdout warning require explicit project-root anchoring and optional Devin context wrapping. |
| C-13 | `SessionStart` / empty / `install-codex-hooks.mjs --check ...` | **Needs adaptation for production parity** → `SessionStart` | Conditional baseline | The command is shell/runtime independent after cwd normalization, but its source check can return exit 2; the Claude registration intentionally makes drift advisory, so the Devin wrapper must preserve that intent. |
| C-14 | `Stop` / empty / `session-stop.js` (`async:true`) | **Needs adaptation** → `Stop` | No authoritative parity | Devin has `Stop`, but `async` is undocumented and the Stop payload is smaller than the Claude owner expects. Do not assume imported async/autosave parity. |
| C-15 | `Stop` / empty / `completion-evidence-stop.cjs` (`async:true`) | **Needs adaptation** → `Stop` | No effective evidence parity | Devin Stop lacks `last_assistant_message`; define a safe claim/state source before claiming completion-sentinel parity. |
| C-16 | `SessionEnd` / empty / `session-cleanup.sh` | **Needs adaptation for production parity** → `SessionEnd` | Conditional baseline | The shell command is event-compatible and fail-open under the Claude wrapper, but Devin documents no equivalent OS PID bridge. Keep safe no-op/orphan-only behavior unless an explicit PID is supplied. |
| C-17 | `PostToolUse` / `Write\|Edit` / `claude-posttooluse.cjs` | **Needs adaptation** → `PostToolUse(^edit$)` | No effective coverage | The matcher and edit fields are Claude-shaped; Devin adds `tool_response`. Reuse the checker/router and emit bounded Devin context. |
| C-18 | `PostToolUse` / `Write\|Edit` / `code-graph-freshness.cjs` | **Needs adaptation** → `PostToolUse(^edit$)`; optional `SessionStart` | No effective coverage | Normalize Devin edit paths and response data. OpenCode timer/disposal behavior has no Devin equivalent. |
| C-19 | `PostToolUse` / `Bash` / `dispatch-audit-posttooluse.mjs` | **Needs adaptation** → `PostToolUse(^exec$)` | No effective coverage | Devin's equivalent is `exec` with a Devin response envelope. Reuse the observation-only audit core after command/output/session normalization. |
| C-20 | No Claude `PermissionRequest` registration | **No source item; omit** | N/A | Devin exposes `PermissionRequest`, but this repository has no Claude handler to import or port. Adding one would be new Devin-specific behavior, not a port. |

Source evidence: `.claude/settings.json:14-180`; phase 001 contract pin; iteration 004 native-import matrix; iteration 005 full matrix; iteration 006 cwd/exit correction.

#### OpenCode plugin entrypoints: P-01–P-15

The live directory contains 15 non-test default-exported plugin entrypoints. Devin hooks can rebuild selected lifecycle behavior, but cannot import OpenCode's plugin factory, callable tool registry, transform containers, message stream, or disposal lifecycle.

| ID | OpenCode registration | Devin verdict and useful target | Native import | Recommended boundary |
|---|---|---|---|---|
| P-01 | `mk-cli-dispatch-audit.js` / `tool.execute.after` | **Needs adaptation** → `PostToolUse(^exec$)` | No | Reuse the audit core; normalize Devin command, response, and session identity. |
| P-02 | `mk-code-graph-freshness.js` / before/after tools, events, disposal | **Needs adaptation** → `PostToolUse(^edit$)`, optional `SessionStart` | No | Reuse freshness policy; omit OpenCode disposal/timer semantics. |
| P-03 | `mk-code-graph.js` / status tool, system/message transforms, compaction, session events | **Cannot port 1:1** | No | Use the code-graph MCP/daemon CLI; add optional bounded prompt or post-compaction context adapters. |
| P-04 | `mk-codex-hooks-watchdog.js` / `session.created` | **Needs adaptation** → `SessionStart` | No plugin import | Rebuild the check as a Devin command hook, not an imported plugin. |
| P-05 | `mk-completion-sentinel.js` / `session.created`, `session.idle` | **Needs adaptation** → `Stop` | No | Reuse the sentinel only after defining Devin claim/spec-folder lookup; no OpenCode message lookup exists. |
| P-06 | `mk-deep-loop-guard.js` / before-tool, session event | **Needs adaptation** → `PreToolUse(^run_subagent$)` | No effective coverage | Map `profile`, prompt, background, and resume deliberately; keep the shared dispatch policy. |
| P-07 | `mk-dist-freshness-guard.js` / before-tool, system transform, disposal | **Needs adaptation** → `PreToolUse(^exec$)`, optional `SessionStart` | No | Use Devin context output for bounded warnings; do not pretend to reproduce system transforms. |
| P-08 | `mk-goal.js` / goal tools, transforms, message/permission/question events | **Cannot port 1:1** | No | Use a Devin rule/skill plus project-owned state and explicit CLI/MCP status operations. External orchestration is required for automatic continuation. |
| P-09 | `mk-mcp-route-guard.js` / before-tool | **Needs adaptation** → `PreToolUse(^mcp__.*$)` | No plugin import | Strong mapping to the shared warn-only route core; translate cwd and context output. |
| P-10 | `mk-post-edit-quality.js` / before/after tools, system transform | **Needs adaptation** → `PreToolUse`/`PostToolUse(^edit$)` | No | Devin supplies enough edit input to avoid the OpenCode correlation map; emit findings through Devin context. |
| P-11 | `mk-skill-advisor.js` / status tool, system transform, session/disposal | **Needs adaptation** → `UserPromptSubmit`, optional `SessionStart` | No | Register the daemon through MCP or call its warm CLI; use a prompt hook only for bounded automatic briefs. |
| P-12 | `mk-spec-gate.js` / transform, before-tool guard, session events | **Needs adaptation** → `UserPromptSubmit`, `PreToolUse(^(exec|edit)$)` | No | Reuse the spec-gate core; Devin owns tool mapping, state, and decision/context output. |
| P-13 | `mk-spec-memory.js` / status tool, transform, session/disposal | **Needs adaptation** → `SessionStart`, `UserPromptSubmit`, optional `PostCompaction` | No | Use Spec Memory MCP/CLI as the primary capability; lifecycle adapters may inject bounded context. |
| P-14 | `mk-speckit-completion.js` / read-only registered tool | **Cannot port 1:1** | No | Use `.opencode/bin/speckit-completion.cjs` from a Devin skill/script or expose the neutral core through MCP. |
| P-15 | `session-cleanup.js` / session events, transform, `dispose` | **Needs adaptation** → `SessionStart`/`SessionEnd` | No plugin import | Port useful cleanup explicitly; treat OpenCode disposal as an omitted host feature. |

Native Claude import covers zero OpenCode plugin registrations. The repository-backed alternatives are MCP for callable services, daemon CLI for scripts/CI/fallbacks, Devin rules/skills for persistent guidance, and lifecycle adapters only where context or guard behavior is genuinely needed.

#### Seven guard cores: G-01–G-07

| ID | Runtime-neutral core | Devin adapter verdict and target | Native import | Adapter responsibility |
|---|---|---|---|---|
| G-01 | `spec-gate-enforce/classify` / `spec-gate-core.mjs` | **Needs adaptation** → `UserPromptSubmit` plus `PreToolUse(^(exec|edit)$)` | Partial baseline only | Map Devin tool names, paths, session gate state, cwd, and deny/context output. |
| G-02 | `dispatch-preflight-lint` / `dispatch-rule-checks.mjs` | **Needs adaptation** → `PreToolUse(^exec$)` | No effective baseline | Read `tool_input.command`, evaluate shared rules, and emit Devin blocking semantics. |
| G-03 | `post-edit-quality` / `post-edit-router.cjs` | **Needs adaptation** → `PostToolUse(^edit$)` | No effective baseline | Extract Devin edit paths and `tool_response`; retain warn-only behavior and emit context if useful. |
| G-04 | `code-graph-freshness` / `freshness-core.cjs` | **Needs adaptation** → `PostToolUse(^edit$)`, optional `SessionStart` | No effective baseline | Normalize paths and trigger the shared non-blocking freshness work; omit OpenCode disposal timers. |
| G-05 | `dispatch-audit` / `dispatch-audit.mjs` | **Needs adaptation** → `PostToolUse(^exec$)` | No effective baseline | Normalize command, output, session, and call identity; remain silent and fail-open. |
| G-06 | `completion-evidence-sentinel` / completion evidence core | **Needs adaptation** → `Stop` | No effective baseline | Obtain claim text and active spec folder from a safe Devin-owned source, or explicitly leave the check advisory/incomplete. |
| G-07 | `mcp-route-guard` / `mcp-route-guard.cjs` | **Needs adaptation** → `PreToolUse(^mcp__.*$)` | Partial baseline only | Widen the matcher, resolve `DEVIN_PROJECT_DIR`, and translate advisory context. |

The seven policy cores are reusable. None of their current Claude/OpenCode transports is authoritative under Devin without an adapter.

### Native-import coverage decision

`read_config_from.claude:true` is useful for compatibility testing and possibly for the shell-only `SessionStart`/`SessionEnd` commands after cwd and exit semantics are verified. It is not a full or safe substitute for hand-built adapters.

| Coverage class | Rows | Decision |
|---|---|---|
| Conditional shell baseline | C-10–C-13, C-16 | Import may reduce registration duplication, but production parity still needs `DEVIN_PROJECT_DIR`, output, exit-policy, and cleanup-identity checks. |
| Closest prompt-context candidates | C-06–C-07 | `UserPromptSubmit` and `prompt` align, but runtime state and output normalization remain unverified. |
| Matcher mismatch | C-01–C-05, C-17–C-19 | Import preserves `Bash`, `Write`, `Edit`, `Task`, and `mcp__claude_ai_.*`; Devin calls `exec`, `edit`, `run_subagent`, and generic `mcp__.*`. |
| Missing fields/output | C-02, C-05, C-14–C-15, C-17–C-19 | Imported commands receive Devin payloads; Claude-specific permission envelopes, `last_assistant_message`, `async`, path fields, and response layout are not normalized. |
| Lifecycle gap | C-08 and post-compaction recovery | No import can turn before-compaction `PreCompact` into after-compaction `PostCompaction` parity. |
| OpenCode plugins | P-01–P-15 | Zero coverage; `.opencode/plugins/*.js` is outside the Claude config-import boundary. |

### Bash-only cwd, environment, and exit contract

Confirmed from iteration 6:

- Devin guarantees `DEVIN_PROJECT_DIR`; it does not guarantee that command hooks start in the project root, that `PWD` is project-root, or that every event has a universal stdin `cwd` field.
- Anchor repository-relative commands at `DEVIN_PROJECT_DIR`.
- Exit `0` continues, exit `2` blocks, and other nonzero exits fail open while logging a hook error.
- Do not forward exit `2` from an advisory source check when the Claude wrapper intentionally made it non-blocking.
- Plain stdout/stderr is not the documented agent-context injection path; convert agent-facing warnings to `hookSpecificOutput.additionalContext` when they must be visible in-session.
- Session cleanup cannot infer an OS process tree from Devin `session_id`. Keep cleanup safe no-op/orphan-only or supply an explicit PID owned by the Devin adapter.

| Handler | Correct Devin boundary |
|---|---|
| `worktree-guard.sh` | Launch from `DEVIN_PROJECT_DIR`; preserve exit `0`; optionally wrap warning text as context. |
| `check-git-hooks.sh` | Same cwd normalization; keep warning advisory. |
| `check-dist-staleness.sh --all` | Normalize relative launch path; preserve exit `0`; optionally wrap bounded banner as context. |
| `install-codex-hooks.mjs --check` | Normalize cwd; convert drift to advisory context and exit `0` rather than changing SessionStart policy to blocking. |
| `session-cleanup.sh` | Normalize cwd; preserve SessionEnd fail-open behavior; do not infer a PID from `session_id` or PPID. |

### PreCompact to PostCompaction evidence

The Claude `compact-inject.js` path reads `session_id`, `transcript_path`, and `trigger`, tails the transcript, writes `pendingCompactPrime`, and emits no stdout because Claude later delivers the cache through `SessionStart(source=compact)`. Devin `PostCompaction` supplies `session_id` and possibly-null `summary`, but not the transcript path, trigger, or Claude follow-up event.

Therefore the unchanged handler is not portable. A Devin adapter must:

1. retain `summary` as the first recovery section;
2. rehydrate authoritative continuity from active session/spec state;
3. use bounded `memory_context(mode=resume)` or an equivalent fallback when summary is null or incomplete;
4. apply provenance and semantic-safety filtering before model-visible injection; and
5. emit bounded `hookSpecificOutput.additionalContext` directly from `PostCompaction`.

Exact before-compaction timing is unavailable. The OpenCode correction is also material: only `mk-code-graph.js` has `experimental.session.compacting`; `mk-dist-freshness-guard.js` and `mk-skill-advisor.js` use per-turn system transforms, not a compaction callback.

### OpenCode cannot-port alternatives

| Plugin | Why a Devin hook is not a 1:1 host | Alternative |
|---|---|---|
| `mk-code-graph.js` | No callable status tool, mutable system/message/compaction containers, or plugin-cache lifecycle | Existing code-graph MCP/daemon CLI; optional bounded prompt/post-compaction context hooks. |
| `mk-goal.js` | No OpenCode goal tools, message-part stream, permission/question events, idle verifier, or hidden continuation loop | Devin rule/skill, project-owned goal state, explicit CLI/MCP status, and external orchestration for continuation. |
| `mk-skill-advisor.js` | No system transform, status tool, client history lookup, or disposal callback | Devin MCP/skill; warm CLI call from `UserPromptSubmit` only for optional bounded briefs. |
| `mk-spec-memory.js` | No per-transform injection or in-process cache/disposal lifecycle | Spec Memory MCP/CLI plus resume skill/rule; optional prompt/post-compaction context adapters. |
| `mk-speckit-completion.js` | Devin hooks cannot register the OpenCode callable tool schema | Existing `speckit-completion.cjs` script/skill or a Devin MCP wrapper. |

### Proposed `.devin/hooks.v1.json` skeleton

This is one concrete registration shape. It contains all eight Devin event keys, uses only necessary matchers, includes portable/needs-adaptation behavior, and omits the cannot-port rows (`PreCompact` is not a Devin event; no OpenCode-only plugin factory is represented; `PermissionRequest` has no source handler and remains empty). Adapter paths are proposed boundaries, not implemented files in this research iteration.

```json
{
  "PreToolUse": [
    { "type": "command", "matcher": "^exec$", "command": "cd \"${DEVIN_PROJECT_DIR}\" && node .opencode/skills/cli-external-orchestration/cli-opencode/scripts/hooks/devin-dispatch-preflight-lint.mjs", "timeout": 5 },
    { "type": "command", "matcher": "^exec$", "command": "cd \"${DEVIN_PROJECT_DIR}\" && node .opencode/skills/system-spec-kit/runtime/hooks/devin/spec-gate-enforce.mjs", "timeout": 5 },
    { "type": "command", "matcher": "^edit$", "command": "cd \"${DEVIN_PROJECT_DIR}\" && node .opencode/skills/system-spec-kit/runtime/hooks/devin/spec-gate-enforce.mjs", "timeout": 5 },
    { "type": "command", "matcher": "^run_subagent$", "command": "cd \"${DEVIN_PROJECT_DIR}\" && node .opencode/skills/system-deep-loop/runtime/hooks/devin/task-dispatch-guard.cjs", "timeout": 5 },
    { "type": "command", "matcher": "^mcp__.*$", "command": "cd \"${DEVIN_PROJECT_DIR}\" && node .opencode/skills/mcp-code-mode/runtime/hooks/devin/mcp-route-guard.cjs", "timeout": 5 }
  ],
  "PostToolUse": [
    { "type": "command", "matcher": "^edit$", "command": "cd \"${DEVIN_PROJECT_DIR}\" && node .opencode/skills/sk-code/code-quality/scripts/hooks/devin-posttooluse.cjs", "timeout": 10 },
    { "type": "command", "matcher": "^edit$", "command": "cd \"${DEVIN_PROJECT_DIR}\" && node .opencode/skills/system-code-graph/runtime/hooks/devin/code-graph-freshness.cjs", "timeout": 5 },
    { "type": "command", "matcher": "^exec$", "command": "cd \"${DEVIN_PROJECT_DIR}\" && node .opencode/skills/cli-external-orchestration/cli-opencode/scripts/hooks/devin-dispatch-audit-posttooluse.mjs", "timeout": 5 }
  ],
  "PermissionRequest": [],
  "UserPromptSubmit": [
    { "type": "command", "command": "cd \"${DEVIN_PROJECT_DIR}\" && node .opencode/skills/system-spec-kit/mcp-server/hooks/devin/user-prompt-submit.js", "timeout": 3 },
    { "type": "command", "command": "cd \"${DEVIN_PROJECT_DIR}\" && node .opencode/skills/system-spec-kit/runtime/hooks/devin/spec-gate-classify.mjs", "timeout": 3 }
  ],
  "Stop": [
    { "type": "command", "command": "cd \"${DEVIN_PROJECT_DIR}\" && node .opencode/skills/system-spec-kit/mcp-server/hooks/devin/session-stop.js", "timeout": 10 },
    { "type": "command", "command": "cd \"${DEVIN_PROJECT_DIR}\" && node .opencode/skills/system-spec-kit/mcp-server/hooks/devin/completion-evidence-stop.cjs", "timeout": 10 }
  ],
  "PostCompaction": [
    { "type": "command", "command": "cd \"${DEVIN_PROJECT_DIR}\" && node .opencode/skills/system-spec-kit/mcp-server/hooks/devin/post-compaction.cjs", "timeout": 5 }
  ],
  "SessionStart": [
    { "type": "command", "command": "cd \"${DEVIN_PROJECT_DIR}\" && .opencode/bin/worktree-guard.sh", "timeout": 3 },
    { "type": "command", "command": "cd \"${DEVIN_PROJECT_DIR}\" && .opencode/bin/check-git-hooks.sh", "timeout": 3 },
    { "type": "command", "command": "cd \"${DEVIN_PROJECT_DIR}\" && .opencode/skills/sk-code/code-quality/scripts/check-dist-staleness.sh --all", "timeout": 5 },
    { "type": "command", "command": "cd \"${DEVIN_PROJECT_DIR}\" && node .opencode/bin/install-codex-hooks.mjs --check", "timeout": 5 },
    { "type": "command", "command": "cd \"${DEVIN_PROJECT_DIR}\" && node .opencode/skills/system-spec-kit/mcp-server/hooks/devin/session-prime.js", "timeout": 3 }
  ],
  "SessionEnd": [
    { "type": "command", "command": "cd \"${DEVIN_PROJECT_DIR}\" && .opencode/scripts/session-cleanup.sh || true", "timeout": 10 }
  ]
}
```

The skeleton deliberately has no `PreCompact` entry, no `async` field, no Claude matcher names, no OpenCode plugin registration, and no `PermissionRequest` handler. The concrete adapter commands still require implementation-phase smoke tests for stdin fields, stdout/exit handling, process cwd, `run_subagent`, file-write vocabulary, and the Stop/PostCompaction evidence sources.

### Findings-registry cross-check

The evidence pack agrees with the 34 existing `keyFindings` on the core claims: Claude matcher mismatch; OpenCode host-boundary mismatch; payload/output normalization; `CLAUDE_PROJECT_DIR` and undocumented `async`; `PreCompact` versus `PostCompaction`; `DEVIN_PROJECT_DIR`; fail-open/blocking exit intent; cleanup PID limitations; and post-compaction summary/state/context requirements.

The registry does not, however, fully reflect the accumulated iteration claims:

| Registry condition | Evidence | Required handling |
|---|---|---|
| Six key questions remain unresolved | `findings-registry.json`: `resolvedQuestions=[]`; every Q1–Q6 has `resolved:false` | Flag as reducer drift. Do not mark the questions resolved in this leaf because the registry is reducer-owned. |
| Registry status is stale | Registry says `status=INITIALIZED`, `metrics.iterationsCompleted=7`, while the state log has canonical iterations through 8 before this append | Flag; reducer/dashboard synchronization is outside this leaf's write scope. |
| Iteration-5 granular findings are unmatched | Delta IDs `f-iter005-001` through `f-iter005-004` and `inv-iter005-001`/`inv-iter005-002` have no same-ID entry in `keyFindings` | Treat the full C/P/G matrix as evidence-local until the reducer promotes or indexes these claims. |
| Iteration-8 granular findings are unmatched | Delta IDs `f-iter008-001` through `f-iter008-004` and `inv-iter008-001`/`inv-iter008-002` have no same-ID entry in `keyFindings` | Treat the OpenCode alternative table as evidence-local until registry reduction. |
| Iteration-4 matrix has no dedicated promoted key set | Its claims are only covered indirectly by earlier broad registry findings | Keep explicit row evidence in this pack; do not infer registry promotion. |
| Iteration-9 evidence package is not represented yet | This append is the first canonical i9 record | The workflow reducer must update registry/dashboard after dispatch; this leaf must not edit them. |

No substantive claim in the pack contradicts an existing registry key. The unmatched items are missing/stale registry coverage, not evidence contradictions.

## Questions Answered

- **Q1:** Yes at source level. `.claude/settings.json` has seven hook keys and 19 handlers; C-01–C-20 enumerate the 19 rows and the absent Devin `PermissionRequest` source item.
- **Q2:** Yes at source level. `.opencode/plugins/` has 15 non-test entrypoints; P-01–P-15 enumerate their registration boundaries and alternatives. The seven neutral guard cores are separately listed as G-01–G-07.
- **Q3:** Yes from the pinned Devin contract: `PreToolUse`, `PostToolUse`, `PermissionRequest`, `UserPromptSubmit`, `Stop`, `PostCompaction`, `SessionStart`, and `SessionEnd`; command/prompt entry shape with optional matcher and timeout; JSON stdin; Devin decision/context output; and `DEVIN_PROJECT_DIR`.
- **Q4:** Yes. Every Claude source handler, every OpenCode plugin entrypoint, and every guard core has a verdict grounded in matcher, payload, cwd/env, output, or lifecycle differences.
- **Q5:** Yes. Native import is partial and conditional, never a full substitute. It may baseline simple lifecycle commands and prompt-context candidates after verification; it misses guard semantics, OpenCode plugins, changed tool names, output envelopes, cleanup identity, and compaction timing.
- **Q6:** Yes as a research artifact. The C/P/G tables and concrete eight-event skeleton are ready to inform ADR-001, subject to the explicitly retained live smoke-test gaps.

## Questions Remaining

- Run authenticated Devin `/hooks` in this repository and record whether imported `PreCompact` is ignored, warned on, or rejected, and how `async` is handled.
- Smoke-test plain stdout, stderr, exit `2`, and top-level JSON decisions for imported commands and explicit Devin adapters.
- Capture one live `PreToolUse(run_subagent)` event to confirm required fields and `resume` representation.
- Confirm Devin's live file-write vocabulary and whether `tool_use_id`/`cwd` exist on relevant post-tool events.
- Confirm the actual process cwd used by Devin command hooks.
- Determine the safe Devin-owned source for completion claims and active spec-folder state at `Stop`.
- Smoke-test `PostCompaction` context injection, including the null-summary case, and verify whether a follow-up `SessionStart` or `UserPromptSubmit` fires.
- Have the reducer promote iteration-5, iteration-8, and iteration-9 findings and reconcile the six key-question statuses before ADR-001 is treated as registry-complete.

## Next Focus

Implementation-phase preflight: live schema/import/output verification, then update phase 004 ADR-001 with this evidence pack before writing the adapters. No implementation is claimed by this research iteration.

## SCOPE VIOLATIONS

The requested `research/evidence/` evidence-package directory is outside the leaf's allowed write list. I did not create or modify it. The complete evidence pack is recorded in this iteration narrative instead; the workflow owner can materialize it later under the appropriate reducer-controlled path.

## Assessment

`newInfoRatio`: **0.31**. This iteration adds little new repository fact; its value is consolidation, temporal correction of earlier conditional 1:1 labels, the concrete eight-event skeleton, and explicit registry-drift flags.

Confidence is high for the source inventories, matcher/lifecycle gaps, shared-core boundaries, cwd/exit contract, and OpenCode alternatives. Confidence remains medium for live Devin handling of imported unsupported fields, exact command cwd, Stop claim availability, and PostCompaction context injection because those smoke tests require an authenticated Devin session.

## Sources Consulted

- `.opencode/specs/cli-external-orchestration/029-cli-devin-revival/001-devin-contract-pin/implementation-summary.md`
- `.opencode/specs/cli-external-orchestration/029-cli-devin-revival/004-devin-hook-adapter-layer/decision-record.md`
- `.opencode/specs/cli-external-orchestration/029-cli-devin-revival/004-devin-hook-adapter-layer/plan.md`
- `research/iterations/iteration-003.md` through `iteration-008.md`
- `research/deltas/iter-003.jsonl` through `iter-008.jsonl`
- `research/findings-registry.json`
- `.claude/settings.json`
- `.opencode/plugins/README.md`

