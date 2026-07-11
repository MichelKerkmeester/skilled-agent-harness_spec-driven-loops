# Research: Additional OpenCode Plugins and Claude Hooks

## 1. Executive Summary

Seven candidate families are justified by current skill contracts. The strongest first implementation is a cross-runtime Git Safety Guard, followed by a Spec Mutation Gate and an expanded Post-Edit Quality Router. OpenCode should use `tool.execute.before/after`, `session.created`, `session.idle`, and bounded `experimental.chat.system.transform` injection. Claude should use `PreToolUse`, the existing `PostToolUse`, `UserPromptSubmit`, and the existing `Stop` owner. Shared policy/checker cores are appropriate; shared transport adapters are not. [SOURCE: .opencode/plugins/README.md:24-67] [SOURCE: .opencode/skills/sk-code/code-opencode/references/shared/hooks.md:166-175]

## 2. Research Scope

The research inventoried current plugin coverage, extracted deterministic contracts from real skills, mapped candidates only to the runtime surfaces named in the brief, ranked them by value and risk, and eliminated overlaps. It did not implement hooks or assume undocumented events.

## 3. Current Runtime Baseline

OpenCode currently ships entrypoints for skill advice, code graph, memory continuity, goal state, deep-loop dispatch protection, dist freshness, and session cleanup. Entrypoints must remain default-export-only and delegate helper logic to owning skills. [SOURCE: .opencode/plugins/README.md:24-38] [SOURCE: .opencode/plugins/README.md:42-67]

Claude's live wiring currently includes `PreToolUse/Bash`, `PreToolUse/Task`, `UserPromptSubmit`, `SessionStart`, `Stop`, `SessionEnd`, and `PostToolUse/Write|Edit`. New behavior should extend current owners where possible instead of creating competing entries. [SOURCE: .claude/settings.json:13-123]

## 4. Candidate Design Principles

1. Put reusable policy and classifiers under the owning skill; keep runtime entrypoints thin. [SOURCE: .opencode/plugins/README.md:24-38]
2. Block only deterministic, high-confidence violations; use advisory context for semantic checks.
3. Fail open on internal hook errors but fail closed on confirmed destructive operations, following existing guard patterns. [SOURCE: .opencode/plugins/mk-deep-loop-guard.js:57-89]
4. Never write plugin warnings to OpenCode stdout/stderr; use bounded context or append-only logs. [SOURCE: .opencode/skills/sk-code/code-opencode/SKILL.md:120-125]
5. Keep prompt-time and post-edit work bounded, warm-only, cached, and deadline-aware. [SOURCE: .opencode/plugins/mk-dist-freshness-guard.js:114-217] [SOURCE: .opencode/skills/sk-code/code-quality/scripts/hooks/claude-posttooluse.sh:24-42]

## 5. OpenCode Candidate Set

| ID | Candidate | Skill grounding | Exact surface | Enforcement posture |
|---|---|---|---|---|
| OC-1 | Spec Mutation Gate | `system-spec-kit` | `tool.execute.before` | Deny mutation only when no valid Gate 3 state exists. [SOURCE: .opencode/skills/system-spec-kit/SKILL.md:28-61] |
| OC-2 | Git Safety Guard | `sk-git` | `tool.execute.before` on Bash | Deny exact destructive forms; warn nuanced authorization cases. [SOURCE: .opencode/skills/sk-git/SKILL.md:291-317] [SOURCE: .opencode/skills/sk-git/SKILL.md:459-469] |
| OC-3 | Post-Edit Quality Router | `sk-code/code-quality` | `tool.execute.after` plus next-turn `experimental.chat.system.transform` | Run cheap target-path checks and inject bounded warnings. [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:54-136] |
| OC-4 | External MCP Route Guard | `mcp-code-mode` | `tool.execute.before` | Warn-first; use a manifest allowlist for native MCP families. [SOURCE: .opencode/skills/mcp-code-mode/SKILL.md:14-42] |
| OC-5 | Completion Evidence Sentinel | `system-spec-kit`, `code-quality` | `session.idle` plus next-turn `experimental.chat.system.transform` | Verify recorded evidence; do not run tests. [SOURCE: .opencode/skills/system-spec-kit/SKILL.md:59-65] [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:162-175] |
| OC-6 | Session Readiness Primer | `system-spec-kit`, `system-skill-advisor` | `session.created` plus `experimental.chat.system.transform` | One-shot degraded-health facts only; do not duplicate continuity or advisor briefs. [SOURCE: .opencode/plugins/mk-spec-memory.js:288-309] |
| OC-7 | Incremental Code-Graph Freshness | `system-code-graph` | `tool.execute.after` | Invalidate and queue a warm-only, debounced changed-file scan. [SOURCE: .opencode/skills/system-code-graph/references/runtime/naming_conventions.md:77-87] |

## 6. Claude Candidate Set

| ID | Candidate | Skill grounding | Exact surface | Enforcement posture |
|---|---|---|---|---|
| CL-1 | Spec Mutation Gate | `system-spec-kit` | `UserPromptSubmit` classification plus `PreToolUse/Write|Edit|Bash` enforcement | Persist the answer, then deny only actual mutations lacking it. [SOURCE: .opencode/skills/system-spec-kit/SKILL.md:28-61] |
| CL-2 | Git Safety Guard | `sk-git` | `PreToolUse/Bash` | Compose with the existing Bash preflight contract. [SOURCE: .opencode/skills/cli-external/cli-opencode/scripts/hooks/dispatch-preflight-lint.mjs:1-85] |
| CL-3 | Expanded Post-Edit Quality Router | `sk-code/code-quality` | Existing `PostToolUse/Write|Edit` | Extend the current deadline-aware, warn-only hook. [SOURCE: .opencode/skills/sk-code/code-quality/scripts/hooks/claude-posttooluse.sh:1-136] |
| CL-4 | External MCP Route Guard | `mcp-code-mode` | `PreToolUse` generated external-MCP matchers | Warn-first; regenerate matchers from the tool manifest. [SOURCE: .opencode/skills/mcp-code-mode/SKILL.md:14-42] |
| CL-5 | Completion Evidence Sentinel | `system-spec-kit`, `code-quality` | Existing `Stop` owner | Verify evidence in `session-stop.js`; avoid a competing Stop hook. [SOURCE: .claude/settings.json:87-99] |
| CL-6 | Incremental Code-Graph Freshness | `system-code-graph` | `PostToolUse/Write|Edit` | Share the changed-file classifier with OC-7; retain the intentional spec-kit hook home. [SOURCE: .opencode/skills/system-code-graph/references/runtime/naming_conventions.md:77-87] |

## 7. Cross-Runtime Parity

| Policy core | OpenCode adapter | Claude adapter | Parity type |
|---|---|---|---|
| Mutation gate | `tool.execute.before` | `UserPromptSubmit` + `PreToolUse` | Equivalent enforcement, richer Claude prompt timing |
| Git safety | `tool.execute.before` | `PreToolUse/Bash` | Direct |
| Post-edit quality | `tool.execute.after` | `PostToolUse/Write|Edit` | Direct |
| MCP route policy | `tool.execute.before` | `PreToolUse` matcher set | Direct policy, different registration |
| Completion evidence | `session.idle` | `Stop` | Approximate lifecycle parity |
| Graph freshness | `tool.execute.after` | `PostToolUse/Write|Edit` | Direct |

Hook entrypoints are runtime-specific. Share policy/checker functions and test fixtures, but keep adapters and output envelopes separate. [SOURCE: .opencode/skills/sk-code/code-opencode/references/shared/hooks.md:50-70] [SOURCE: .opencode/skills/sk-code/code-opencode/references/shared/hooks.md:166-175]

## 8. Priority Ranking

| Rank | Candidate family | Value | Feasibility | Primary risk control |
|---:|---|---|---|---|
| 1 | Git Safety Guard | Very high | High | Exact destructive-pattern deny list; advisory elsewhere |
| 2 | Spec Mutation Gate | Very high | Medium | Enforce only at mutation; durable per-session answer state |
| 3 | Expanded Post-Edit Quality Router | High | High | Cheap path-specific checks; warn-only; deadline |
| 4 | Incremental Code-Graph Freshness | High | Medium | Warm-only, debounce, changed-file scope |
| 5 | Completion Evidence Sentinel | High | Medium | Advisory rollout; verify evidence instead of running tests |
| 6 | External MCP Route Guard | Medium | Medium | Native-family allowlist; warn-first |
| 7 | Session Readiness Primer | Medium | High | Emit degraded facts only; dedupe existing briefs |

## 9. Recommended Architecture

Each candidate should have one runtime-neutral module under its owning skill, one OpenCode adapter under `.opencode/plugins/` when required, and one Claude command entrypoint registered in `.claude/settings.json`. Existing owners should be extended for CL-3 and CL-5. Test policy cores with shared fixtures, then adapter envelopes separately. This mirrors the current shared deep-loop guard core used by OpenCode and Claude. [SOURCE: .opencode/plugins/mk-deep-loop-guard.js:24-28] [SOURCE: .opencode/skills/system-deep-loop/runtime/hooks/claude/task-dispatch-guard.cjs:1-14]

## 10. Safety and Failure Modes

- **False positives:** roll semantic candidates out warn-only and measure before enabling denial.
- **Latency:** cap prompt/edit hooks, cache static manifests, debounce graph scans, and never cold-start daemons from prompt-time paths.
- **Ordering:** extend current Claude event owners rather than registering duplicate entries.
- **State leaks:** key Gate 3 and completion state by session ID with bounded retention.
- **TUI corruption:** OpenCode plugins use context or logs, never console output.
- **Drift:** generate matcher sets and native MCP allowlists from checked-in manifests rather than hand-maintained lists.

## 11. Eliminated Alternatives

- Another generic prompt-context injector: existing advisor, memory, graph, and goal plugins already occupy that layer. [SOURCE: .opencode/plugins/README.md:42-52]
- Hook-owned deep-loop convergence or synthesis: mode packets and runtime own lifecycle semantics. [SOURCE: .opencode/skills/system-deep-loop/SKILL.md:88-110]
- Full quality suites after every edit: too slow; only cheap path-specific checks fit post-tool timing.
- Design-audit auto-scoring from file writes: visual evidence and register context are mandatory. [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:95-117] [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:136-169]
- Blanket blocking of `mcp__*`: native MCP families are explicit exceptions. [SOURCE: .opencode/skills/mcp-code-mode/SKILL.md:32-42]
- Duplicate Claude `PostToolUse` or `UserPromptSubmit` entries: extend existing owners to avoid duplicate work and ordering ambiguity. [SOURCE: .claude/settings.json:36-47] [SOURCE: .claude/settings.json:112-123]
- `SessionEnd` completion verification: too late to correct a false claim; that surface already owns cleanup. [SOURCE: .claude/settings.json:100-110]
- Stop-time test execution: unbounded latency and re-entrancy risk; verify evidence instead.
- One cross-runtime transport implementation: event names and envelopes differ; share policy cores only.

## Divergence Map

- Saturated directions: current plugin inventory, OpenCode mapping, Claude mapping, prioritization, and eliminated alternatives.
- Pivots taken: none; the three planned passes produced sufficient evidence.
- Pivot failures or overrides: none.
- Remaining frontier: implementation smoke tests and rollout telemetry, not additional research candidates.

## 12. Open Questions

The research charter is answered. Implementation must still test: OpenCode `tool.execute.after` result mutation, Claude matcher composition for MCP tools, `Stop` warning/block behavior, per-session Gate 3 retention, and graph scan debounce under rapid edits.

## 13. Validation Plan

1. Unit-test each policy core with allow/deny/ambiguous fixtures.
2. Smoke each runtime adapter with captured hook payloads.
3. Prove fail-open internal errors and fail-closed exact destructive cases.
4. Measure p50/p95 latency and false-positive rate in warn-only mode.
5. Verify OpenCode plugins emit no stdout/stderr and Claude hooks return valid event envelopes.
6. Verify duplicate invocation does not occur when extending existing Claude owners.

## 14. Delivery Sequence

1. Implement Git Safety Guard policy core and both pre-tool adapters.
2. Implement session-scoped Spec Mutation Gate state and both enforcement adapters.
3. Extend the existing Claude post-edit hook and add the OpenCode after-hook adapter.
4. Add warm-only graph invalidation/scanning to the post-edit core.
5. Trial Completion Evidence Sentinel and MCP Route Guard in advisory mode.
6. Add Session Readiness Primer only if measurements show a gap after current startup briefs.

## 15. Evidence Summary

Evidence spans seven live OpenCode plugin contracts, live Claude settings, three current hook implementations, and source skills for spec governance, code quality, git safety, MCP routing, code graph ownership, design evidence, skill routing, and deep-loop lifecycle. Iteration details and full citations are preserved in `iterations/iteration-001.md` through `iteration-003.md`.

## 16. Recommendation

Build the Git Safety Guard first. It has the clearest deterministic policy, highest destructive-risk reduction, and existing adapter patterns in both runtimes. Design the shared policy-core boundary during that work, then reuse it for Spec Mutation Gate and post-edit quality/graph adapters.

## 17. Conclusion

The repo's skill corpus supports meaningful always-on automation, but the correct shape is selective enforcement at lifecycle boundaries, not broad prompt injection. Thin adapters, skill-owned policy cores, bounded execution, and advisory-first rollout preserve current ownership while converting the strongest manual rules into reliable runtime behavior.

## Convergence Report

- Stop reason: converged (`all_questions_answered`)
- Total iterations: 3
- Questions answered: 5 / 5
- Remaining questions: 0 research questions; 5 implementation validation probes retained
- Last 3 iteration summaries: inventory (1.00), OpenCode mapping (0.86), Claude mapping and prioritization (0.72)
- Average newInfoRatio: 0.86
- Convergence threshold: 0.05
- Legal-stop basis: all questions answered after the minimum three iterations; source diversity, focus alignment, and no-single-weak-source guards passed
- Divergence summary: no pivots; all planned directions saturated
