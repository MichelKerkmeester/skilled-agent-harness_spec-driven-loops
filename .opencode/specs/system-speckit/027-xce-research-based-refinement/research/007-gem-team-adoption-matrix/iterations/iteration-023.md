# Iteration 023: RQ-M4 CHANGELOG operational signals

**Focus:** RQ-M4 CHANGELOG operational signals  
**Executor:** cli-opencode `openai/gpt-5.5-fast` --variant high (read-only). **Status:** complete. **newInfoRatio:** 0.25.  
**Raw output:** prompts/iteration-023.out  ·  **Prompt:** prompts/iteration-023.prompt

### FINDINGS
| Signal | gem CHANGELOG mechanism (line) | spec-kit equivalent or GAP (file:line) | Verdict | Effort(S/M/L) | Net-new value |
|---|---|---|---|---|---|
| (a) Focus-scoped research-findings lookup at agent init | Agents search `docs/plan/{plan_id}/research_findings_{focus_area}.yaml` at init to pre-load relevant research (L236, L359, L644) | `session_bootstrap()` → `memory_context({intent, specFolder})` already scopes retrieval by intent and folder; `memory_match_triggers()` does trigger-based lookup at init. No explicit `focus_area` parameter, but intent-aware routing + specFolder cover the same semantic space. (`system-spec-kit/mcp_server/handlers/memory-context.ts:231`, `feature_catalog/context-preservation/310-tool-routing-enforcement.md:20`) | REJECT | - | 0.15 |
| (b) Plan-template cache + high-confidence bypasses | Persist generated DAG to `plan/templates/{objective_category}` when confidence ≥ 0.85; same-bug and template cache bypasses (L267, L268) | No plan-template caching. `memory_save` has quality-gate exceptions for decision docs (`SPECKIT_SAVE_QUALITY_GATE_EXCEPTIONS`, `mcp_server/ENV_REFERENCE.md:74`) and `skipPreflight` bypass, but these serve different purposes. Checkpoint/restore snapshots DB state, not reusable plan structures. GAP: no mechanism to cache and reuse high-confidence plan DAGs for recurring objective categories. | ADAPT | M | 0.40 |
| (c) Shared-component pre-save check | Pre-save check detects shared component changes before save; coordination rule for cross-agent component ownership (L571) | `SPECKIT_PRE_SAVE_DEDUP` SHA1 overlap check (`feature_catalog/tooling-and-scripts/219-json-mode-hybrid-enrichment.md:125`) prevents duplicate memory saves, NOT shared-component mutation detection. Alignment guards (`feature_catalog/memory-quality-and-indexing/150-session-enrichment-and-alignment-guards.md:33`) check file-path overlap with spec scope. GAP: no pre-save check for shared-infrastructure component mutations that could affect multiple spec packets. | ADAPT | M | 0.45 |
| (d) Failure-log reinjection into next attempt | Standardized failure logging across all agents; failure logs injected into re-delegated tasks (L554, L571) | Deep-research `blocked_stop` events carry `blockedBy`, `gateResults`, `recoveryStrategy`; reducer rewrites `next-focus` from recovery hints (`deep-research/feature_catalog/convergence/013-quality-guards.md:28`). Stuck detection classifies failure modes and injects recovery prompts (`deep-research/feature_catalog/convergence/012-stuck-detection.md:28`). BUT: this is deep-research-specific, not generalized to all agent delegation. GAP: no failure-context injection in `@orchestrate` → `@code` or `@debug` → `@code` re-delegation paths. | ADAPT | S | 0.35 |
| (e) Accessibility-tree snapshots over screenshots | `accessibility_snapshot` over screenshots for browser-tester reliability (L640) | No browser-testing or accessibility-tree capability in spec-kit. `@code` and `@review` agents are code-only. The skill-adrouter routes accessibility tasks to `sk-code` (`system-skill-advisor/mcp_server/scripts/fixtures/skill_advisor_regression_cases.jsonl:27`), not to a dedicated a11y agent. | REJECT | - | 0.00 |

### NEGATIVE / RULED-OUT
- **(a) Focus-scoped init**: The spec-kit's `memory_context({intent, specFolder})` + `memory_match_triggers()` at session start already covers the retrieval-with-scope pattern. Adding an explicit `focus_area` parameter would be redundant with intent-aware routing.
- **(e) Accessibility snapshots**: Out of scope. Spec-kit has no browser automation surface. The gem-browser-tester agent has no spec-kit counterpart by design.

### OPEN QUESTIONS
- **(b)**: Would a `plan-template cache` in spec-kit mean caching `plan.md` DAG structures by objective category, or caching `memory_context` retrieval results for recurring query patterns? The former requires a new storage surface; the latter maps to the existing tool-cache (`mcp_server/lib/cache/tool-cache.ts`).
- **(c)**: Is the "shared component" pattern relevant to spec-kit's `constitutional/` rules or `AGENTS.md` conventions that multiple spec packets depend on? A pre-save check could verify constitutional-rule consistency before saving spec docs that reference them.
- **(d)**: Should `@orchestrate` propagate `blocked_stop`-style failure context when re-delegating to `@code` after a failed attempt, or is the existing debug-delegation pattern (`@debug` → diagnosis → `@code` fix) sufficient?

### METRICS
newInfoRatio: 0.25
novelty: One genuine gap (plan-template caching) and one partial gap (failure-context generalization); the other three signals are already covered or out of scope.
status: complete
focus: RQ-M4 CHANGELOG operational signals
