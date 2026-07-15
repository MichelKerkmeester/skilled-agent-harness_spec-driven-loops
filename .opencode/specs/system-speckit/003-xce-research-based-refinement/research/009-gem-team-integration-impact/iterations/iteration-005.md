# Iteration 005: RQ5 command/workflow blast radius + rollout sequencing

**Focus:** RQ5 command/workflow blast radius + rollout sequencing  
**Executor:** cli-opencode `openai/gpt-5.5-fast` --variant high (read-only). **Status:** complete. **newInfoRatio:** 0.86.  
**Raw output:** prompts/iteration-005.out

### IMPACT
| Command/workflow (file:line) | Proposal(s) | Change (ADD/MODIFY/NONE) | What changes | Severity | Backward-compat risk |
|---|---|---:|---|---|---|
| `/speckit:plan` Step 5 planning dispatch (`.opencode/commands/speckit/assets/speckit_plan_auto.yaml:521-568`; confirm mirrors at `.opencode/commands/speckit/assets/speckit_plan_confirm.yaml:570-578`) | P1, P3 | MODIFY | Emit typed dispatch header on the four `@context` explorer prompts; optionally add `reviewer_focus` / `quality_score` to the planning output because this is where review focus is first knowable. | High | Low if header is adjunct text and `@context` keeps returning the existing Context Package. |
| `/speckit:plan` markdown entrypoint (`.opencode/commands/speckit/plan.md:7-20`, `.opencode/commands/speckit/plan.md:25-28`) | P1, P3 | NONE | No direct dispatch here; it explicitly delegates execution to YAML. Only reference text may need a cross-reference after YAML is wired. | Low | None. |
| `/speckit:implement` Step 6 development (`.opencode/commands/speckit/assets/speckit_implement_auto.yaml:424-440`; confirm mirrors at `.opencode/commands/speckit/assets/speckit_implement_confirm.yaml:437-450`) | P1, P2, P3 | MODIFY | Add typed headers to implementation/test worker dispatches; require medium/high pre-mortem before parallel development; read `spec_drift` from worker outputs before marking tasks done. | High | Medium because implementation/test agents may not emit `spec_drift`; default absent to `none` and continue. |
| `/speckit:implement` debug handoff (`.opencode/commands/speckit/assets/speckit_implement_auto.yaml:450-464`; confirm mirrors at `.opencode/commands/speckit/assets/speckit_implement_confirm.yaml:459-473`) | P1, P2 | MODIFY | When 3+ failures trigger the user-dispatched `@debug` path, validate the debug handoff schema fields before acting on a diagnosis. | High | Medium because older `debug-delegation.md` scaffolds may lack typed `root_cause`, `target_files`, `fix_recommendations`, `confidence`; treat missing schema as warning until debug agent is updated. |
| `/speckit:implement` review availability (`.opencode/commands/speckit/assets/speckit_implement_auto.yaml:230-245`; confirm mirrors at `.opencode/commands/speckit/assets/speckit_implement_confirm.yaml:195-209`) | P1, P3 | MODIFY | If Step 7 review dispatch is used, pass `reviewer_focus` from plan/development context and accept typed review envelope. | Medium | Low if `@review` falls back to normal review scope when no focus hint exists. |
| `/speckit:complete` optional research and planning dispatches (`.opencode/commands/speckit/assets/speckit_complete_auto.yaml:561-572`, `.opencode/commands/speckit/assets/speckit_complete_auto.yaml:676-723`) | P1, P3 | MODIFY | Add typed dispatch headers to embedded research and four `@context` planning explorers; emit `reviewer_focus` after Step 6 planning. | High | Medium because `/complete` duplicates `/plan`; divergence risk unless both YAMLs share the same wording. |
| `/speckit:complete` development/debug path (`.opencode/commands/speckit/assets/speckit_complete_auto.yaml:868-922`; markdown summary at `.opencode/commands/speckit/complete.md:408-415`) | P1, P2, P3 | MODIFY | Add typed headers to implementation/test agents, pre-mortem to medium/high work, debug-handoff schema check, and `spec_drift` readback before Step 11/12. | High | Medium; keep old task results valid with `spec_drift: none` default. |
| `/speckit:complete` review gate/availability (`.opencode/commands/speckit/assets/speckit_complete_auto.yaml:306-320`, `.opencode/commands/speckit/assets/speckit_complete_auto.yaml:354-369`, `.opencode/commands/speckit/assets/speckit_complete_auto.yaml:946-966`) | P1, P3 | MODIFY | Should consume `reviewer_focus` for review approval, but current asset has a mismatch: review availability says Step 11 while Step 11 is checklist verification. | High | Medium; wire only after the Step 11/review-gate ambiguity is resolved or keep advisory-only. |
| `/deep:start-research-loop` native/fanout dispatch (`.opencode/commands/deep/assets/deep_start-research-loop_auto.yaml:144-180`, `.opencode/commands/deep/assets/deep_start-research-loop_auto.yaml:580-624`) | P1 | MODIFY | Add typed dispatch header to rendered prompt packs for native `@deep-research` and native fanout lineages. | Medium | Medium because CLI executor branches consume raw prompt packs; do not require output envelope in post-dispatch validation yet. |
| `/deep:start-review-loop` native/fanout dispatch and scope (`.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml:133-168`, `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml:272-302`, `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml:696-747`) | P1, P3 | MODIFY | Add typed dispatch header to `@deep-review` prompt packs; read `reviewer_focus` as an optional scope-priority hint during scope discovery / dimension ordering. | High | Medium; old review loops continue with target-derived scope when no hint exists. |
| `/deep:start-agent-improvement-loop` (`.opencode/commands/deep/start-agent-improvement-loop.md:17`, `.opencode/commands/deep/start-agent-improvement-loop.md:267-268`) | P1, P2, P3 | NONE | General-agent based workflow; markdown says no agent dispatch from the document. No typed agent I/O needed unless future YAML adds sub-agent dispatch. | Low | None. |
| `/memory:save` sub-agent dispatch grep hit (`.opencode/commands/memory/save.md:654-683`) | P1 | MODIFY | Out-of-focus but real workflow-layer producer: its Task prompt/return can use the same typed dispatch header and output envelope. | Low | Low; existing expected return already has `{ status, file_path, memory_id, anchors_created, trigger_phrases, spec_folder }`. |
| `@orchestrate` dispatch path (`.opencode/agents/orchestrate.md:190-215`, `.opencode/agents/orchestrate.md:217-231`, `.opencode/agents/orchestrate.md:438-452`) | P1, P2, P3 | MODIFY | Central place to add `dispatch_id`, typed `task_definition`, `context_snapshot`, pre-mortem fields, output-envelope parsing, `reviewer_focus`, and `spec_drift` synthesis. | Critical | Medium; must accept rich markdown without envelope and keep manual quality checklist as canonical. |

### INTEGRATION
Wire first: `@orchestrate` task format plus `/speckit:plan` Step 5 `@context` dispatches. This gives fastest payoff because planning already fans out four agents and produces the downstream plan/review context.

Wire second: `/speckit:implement` Step 6 and debug handoff. This is the highest-risk transition where P2’s pre-mortem and debug-handoff schema reduce real execution failures.

Wire third: `/deep:start-review-loop` consumption of `reviewer_focus`, then `/speckit:complete` after resolving its Step 11 review/checklist mismatch. `/complete` duplicates `/plan` and `/implement`, so wiring it too early risks inconsistent contracts.

Wire last: `/deep:start-research-loop`, `/memory:save`, and other deep-loop/benchmark surfaces. They can carry P1 headers, but P2/P3 value is lower.

Agents without typed fields keep working by treating the typed block as optional: if no envelope exists, parse the existing markdown contract; if no `reviewer_focus`, derive review scope from target/files; if no `spec_drift`, record `spec_drift: none`; if no debug handoff schema, warn and require manual verification instead of failing the workflow.

### BREAKS / WATCH-OUTS
`/speckit:complete` has review-gate ambiguity: the quality gate awards `review_approval`, but Step 11 is checklist verification, while `agent_availability.review` says Step 11. Do not enforce P3 review-focus consumption there until that is reconciled.

Deep-loop CLI executors use rendered prompt packs and post-dispatch validation. Requiring a new output envelope immediately would break non-native executors; start with dispatch header only.

P2 must stay scoped. Universal pre-mortems on all low-risk agent dispatches would add ceremony and violate the proposal’s “medium/high only” intent.

### OPEN QUESTIONS
Who owns the shared typed schema: one `agent-io-contract.md`, YAML-local snippets, or both?

Should `reviewer_focus` live in `plan.md`, the P1 output envelope, or both?

Should `spec_drift` be saved only into continuity, or also surfaced as a blocking workflow checkpoint when it contradicts `spec.md`?

For old `debug-delegation.md` files, should missing P2 schema warn, block, or trigger a one-time scaffold upgrade?

### METRICS
newInfoRatio: 0.86
novelty: The main new finding is that `/speckit:complete` is the riskiest rollout target because it duplicates plan/implement behavior and has a review-gate/Step-11 mismatch.
status: complete
focus: RQ5 command/workflow blast radius + rollout sequencing
