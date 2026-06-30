# Iteration 001: RQ1 P1 typed-agent-io-adapter — integration & impact

**Focus:** RQ1 P1 typed-agent-io-adapter — integration & impact  
**Executor:** cli-opencode `openai/gpt-5.5-fast` --variant high (read-only). **Status:** complete. **newInfoRatio:** 0.78.  
**Raw output:** prompts/iteration-001.out

### IMPACT
| Existing surface (file:line) | Change (ADD/MODIFY/NONE) | What changes | Severity (LOW/MED/HIGH) | Backward-compat risk |
|---|---|---|---|---|
| `specs/system-spec-kit/027-xce-research-based-refinement/research/007-gem-team-adoption-matrix/sub-packet-proposals.md:41-42` | ADD | Add shared `.opencode/skills/system-spec-kit/references/agent-io-contract.md` as the single advisory contract for dispatch headers, output envelopes, field names, confidence mapping, and failure_type enums. | LOW | Low: new doc only, unless consumers treat it as runtime enforcement. |
| `.opencode/agents/orchestrate.md:194-214`, `.opencode/agents/orchestrate.md:292-303`, `.opencode/agents/orchestrate.md:440-452` | MODIFY | Add optional `AGENT_IO_DISPATCH` header to the existing Task Format, including `dispatch_id`, `agent`, per-agent `task_definition`, `context_snapshot`, and read directives. Extend output review to read `AGENT_IO_RESULT` when present while preserving existing prose/rubric checks. | MED | Medium: orchestrator currently branches on `output.confidence`, `output.status`, and score-like fields; envelope must be additive and tolerate missing fields. |
| `.opencode/agents/code.md:55-60`, `.opencode/agents/code.md:117-128`, `.opencode/agents/code.md:270-310` | MODIFY | Smallest change: parse the dispatch header in RECEIVE; keep 7 dispatch modes and existing `RETURN:` first line; append `AGENT_IO_RESULT` with `status`, `confidence.band`, `confidence.numeric`, and `failure_type` mapped from current escalation enums. | LOW | Medium if envelope is placed before line-275 `RETURN:`; low if appended after current markdown body. |
| `.opencode/agents/review.md:241-245`, `.opencode/agents/review.md:264-278`, `.opencode/agents/review.md:348-354` | MODIFY | Add dispatch header parsing and append result envelope. Existing gate I/O already has score, P0/P1/P2, and HIGH/MEDIUM/LOW confidence; only normalize to `status`, numeric confidence, and `failure_type` such as `REVIEW_P0_BLOCKER` / `REVIEW_P1_REQUIRED`. | LOW | Low: rich review report stays canonical. |
| `.opencode/agents/context.md:52-59`, `.opencode/agents/context.md:230-284`, `.opencode/agents/context.md:331-342` | MODIFY | Add dispatch header input for exploration requests and read directives. Keep Context Package as the body; append result envelope with retrieval status and failure types such as `EVIDENCE_GAP`, `GRAPH_UNAVAILABLE`, `SCOPE_REFUSED`. | MED | Medium: Context Package currently requires all 6 sections; envelope must not count as a replacement section. |
| `.opencode/agents/debug.md:91-126`, `.opencode/agents/debug.md:367-426`, `.opencode/agents/debug.md:479-509` | MODIFY | Add dispatch header to the existing Debug Context Handoff. Append result envelope to Success/Blocked/Escalation responses, mapping current blocker types at `.opencode/agents/debug.md:408-409` into normalized `failure_type`. | LOW | Low: existing handoff and response bodies remain intact. |
| `.opencode/commands/speckit/assets/speckit_plan_auto.yaml:524-568`, `.opencode/commands/speckit/assets/speckit_plan_confirm.yaml:573-617` | MODIFY | The 4 parallel `@context` exploration prompts should include the typed dispatch header and request `AGENT_IO_RESULT` after the Context Package. | MED | Medium: prompt size increases across 4 agents; keep header lean. |
| `.opencode/commands/speckit/assets/speckit_complete_auto.yaml:672-723`, `.opencode/commands/speckit/assets/speckit_complete_auto.yaml:908-919`, `.opencode/commands/speckit/assets/speckit_complete_confirm.yaml:717-761`, `.opencode/commands/speckit/assets/speckit_complete_confirm.yaml:924-934` | MODIFY | Add dispatch headers to planning `@context` calls and to the user-dispatched `@debug` handoff example. Use envelope consumption for repeated-failure diagnostics, not auto-dispatch. | MED | Medium: confirm/auto variants must stay aligned; debug remains user-invoked only. |
| `.opencode/commands/speckit/assets/speckit_implement_auto.yaml:88-105`, `.opencode/commands/speckit/assets/speckit_implement_auto.yaml:248-252`, `.opencode/commands/speckit/assets/speckit_implement_confirm.yaml:212-216` | MODIFY | Add the same header/envelope guidance around component-routing dispatch decisions and debug-offer handoff text. | LOW | Low: these workflows mostly surface prompts and constraints, not direct agent execution. |
| `.opencode/commands/create/assets/create_agent_auto.yaml:266-287`, `.opencode/commands/create/assets/create_agent_confirm.yaml:290-321` | MODIFY | Agent creation uses `@context` discovery before creating a new agent. Add a lean dispatch header and request an output envelope after the Context Package. | LOW | Low: discovery output remains Context Package-based. |
| `.opencode/skills/system-spec-kit/references/templates/template_guide.md:628-700`, `.opencode/skills/system-spec-kit/references/debugging/universal_debugging_methodology.md:149-183`, `.opencode/skills/system-spec-kit/references/validation/phase_checklists.md:121-134`, `.opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/debug-delegation-scaffold-generator.md:20-40` | MODIFY | Update debug handoff docs to say the Task-tool `@debug` handoff may carry `AGENT_IO_DISPATCH`, and the debug response may append `AGENT_IO_RESULT`. Also fix language that implies direct dispatch where current policy is “offer, user opts in.” | LOW | Low: documentation alignment only, but important to avoid reintroducing auto-dispatch ambiguity. |
| `.opencode/commands/deep/start-research-loop.md:228-259`, `.opencode/commands/deep/start-review-loop.md:257-286` | NONE | Do not include in P1 MVP. These dispatch `@deep-research` / `@deep-review` through externalized loop state and are outside P1’s listed agent set. Revisit only if the adapter is generalized beyond orchestrator + code/review/context/debug. | LOW | High if touched prematurely: deep-loop state machines have separate convergence contracts. |

### INTEGRATION
1. Add `.opencode/skills/system-spec-kit/references/agent-io-contract.md` as an advisory shared contract, not a runtime validator.
2. Define the dispatch header as a small fenced block at the very top of Task prompts, immediately before the existing `TASK #N` / handoff body:
`AGENT_IO_DISPATCH`, `schema_version`, `dispatch_id`, `agent`, `task_definition`, `context_snapshot`, `read_directives`.
3. Keep `task_definition` per-agent but minimal:
`@code`: mode, objective, allowed_files, success, verification_expectation.
`@review`: gate_type, artifact, scope, threshold, focus.
`@context`: focus, scope, retrieval_layers, output_size.
`@debug`: invocation_approval, error_summary, affected_files, prior_attempts_ref.
4. Keep `context_snapshot` lean and one-shot for MVP:
`spec_folder`, `context_package_ref`, `safe_to_assume`, `verify_before_use`, `do_not_re_read`.
5. Append the output envelope after existing rich markdown bodies:
`AGENT_IO_RESULT`, `dispatch_id`, `status`, `confidence.band`, `confidence.numeric`, `failure_type`, `summary_ref`.
6. Preserve `@code`’s first-line `RETURN:` contract; for `@code`, place the envelope after the current §8 structured body, not before line 275.
7. Update `@orchestrate` to emit headers and consume envelopes opportunistically; if no envelope exists, fall back to current markdown parsing and quality checks.
8. Update only the direct dispatch surfaces in the MVP: orchestrator, the four listed agents, `speckit_plan`, `speckit_complete`, `speckit_implement`, and `create_agent`.
9. Defer deep-loop command/agent integration until there is an explicit second packet for deep-loop envelope parity.

### BREAKS / WATCH-OUTS
- Do not prepend the envelope before `@code`’s `RETURN:` line; existing consumers may assume that compact first line.
- Do not replace Context Package sections; `@context` requires all 6 sections.
- Numeric confidence must be derived from or aligned with HIGH/MEDIUM/LOW, not a competing truth.
- `failure_type` should map existing enums/severities, not import Gem taxonomy wholesale.
- Prompt bloat is the main operational risk in 4-agent planning dispatches; keep headers under ~15 lines.
- Auto/confirm YAML variants must be updated together or workflow behavior will drift.

### OPEN QUESTIONS
- Should `context_snapshot` remain one-shot per invocation, or become an orchestrator-maintained progressive cache?
- What exact numeric defaults map from HIGH/MEDIUM/LOW: e.g. HIGH=0.90, MEDIUM=0.70, LOW=0.30?
- Should `status` use `pass/fail/blocked/partial`, or preserve each agent’s native terms and normalize only in `@orchestrate`?
- Should deep-loop agents get a separate adapter later, or stay under their externalized state contracts?

### METRICS
newInfoRatio: 0.78
novelty: The main new integration finding is that P1 should be dispatch-input-first, with output normalization mostly additive because `@code`, `@review`, and `@context` already have strong markdown contracts.
status: complete
focus: RQ1 P1 typed-agent-io-adapter — integration & impact
