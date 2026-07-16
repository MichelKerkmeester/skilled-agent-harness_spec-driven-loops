# Iteration 003: RQ3 P3 planner-review-focus-and-drift-hint — integration & impact

**Focus:** RQ3 P3 planner-review-focus-and-drift-hint — integration & impact  
**Executor:** cli-opencode `openai/gpt-5.5-fast` --variant high (read-only). **Status:** complete. **newInfoRatio:** 0.76.  
**Raw output:** prompts/iteration-003.out

### IMPACT
| Existing surface (file:line) | Change (ADD/MODIFY/NONE) | What changes | Severity (LOW/MED/HIGH) | Backward-compat risk |
|---|---:|---|---:|---|
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/007-gem-team-adoption-matrix/sub-packet-proposals.md:88-99` | NONE | P3 already defines `reviewer_focus`/`quality_score` and `spec_drift`/`update_recommended`; use it as source-of-truth for the child packet. | LOW | None |
| `.opencode/agents/orchestrate.md:192-214`, `.opencode/agents/orchestrate.md:217-230` | ADD | Add optional dispatch fields: `Reviewer Focus`, `Planner Quality Score` or better `Self-Assessed Quality Score`, and `Spec Drift Handling`. Keep them advisory in task packages. | LOW | Low; optional fields do not alter existing task format consumers. |
| `.opencode/agents/orchestrate.md:436-452`, `.opencode/agents/orchestrate.md:487-496` | MODIFY | Add reviewer-focus consumption to output review: verify review attention covered named high-risk areas, but do not change the existing `Quality score >= 70` acceptance rule. | LOW | Low; avoid treating hints as new rejection criteria. |
| `.opencode/agents/review.md:237-245`, `.opencode/agents/review.md:101-110` | MODIFY | Extend gate input/context to accept `reviewer_focus`; reviewer uses it to prioritize files/risks while existing threshold remains default `70`. | LOW | Low; if absent, current review flow is unchanged. |
| `.opencode/agents/review.md:328-335`, `.opencode/agents/review.md:412-418` | MODIFY | State that `reviewer_focus` cannot create a finding without normal evidence; focused areas still need file:line proof and severity evidence. | LOW | Low; prevents advisory hint from becoming phantom P1/P0 pressure. |
| `.opencode/agents/code.md:270-301` | ADD | Add optional RETURN advisory block: `Spec Drift: update_recommended=<true|false>; spec_drift=<short reason>; affected_spec_docs=<paths>; affected_files=<paths>`. Required RETURN fields stay unchanged. | LOW | Low; markdown consumers ignore unknown optional sections. |
| `.opencode/agents/code.md:303-311`, `AGENTS.md:312-314` | NONE | Logic-Sync remains the hard contradiction path: contradictions still return `LOGIC_SYNC`/halt; `spec_drift` is only for non-blocking plan/spec update recommendations. | LOW | None; preserves existing escalation precedence. |
| `.opencode/agents/code.md:328-331`, `.opencode/agents/code.md:461-462` | MODIFY | Clarify @code must not edit packet docs for drift; it emits `spec_drift` instead, and orchestrator/main-agent save path handles continuity. | LOW | Low; reinforces existing no-spec-doc-authorship rule. |
| `.opencode/commands/memory/save.md:71-80`, `.opencode/commands/memory/save.md:90-104`, `.opencode/commands/memory/save.md:408-418` | MODIFY | Document destination: drift advisories route to `handover_state` for narrative stop-state and `metadata_only` for compact `_memory.continuity`; typical targets already include `handover.md`, `implementation-summary.md`, `_memory.continuity`, and `graph-metadata.json`. | LOW | Low; uses existing route categories. |
| `.opencode/skills/system-spec-kit/scripts/memory/generate-context.ts:103-140` | ADD | Optionally accept structured JSON keys such as `specDrift`/`reviewerFocus` as JSON-mode enrichment fields, alongside existing optional `toolCalls`, `exchanges`, `routeAs`, and `mergeModeHint`. | LOW | Low if optional and ignored when absent. |
| `.opencode/skills/system-spec-kit/mcp_server/tools/types.ts:174-189`, `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:98-107` | NONE | Do not add a new `spec_drift` route category; existing `handover_state` and `metadata_only` are sufficient. | LOW | None; avoids MCP schema churn. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/continuity/thin-continuity-record.ts:30-42`, `.opencode/skills/system-spec-kit/mcp_server/lib/continuity/thin-continuity-record.ts:856-897` | NONE | Smallest viable path should not add raw `spec_drift` fields to thin continuity. Map advisory state into existing `recent_action`, `next_safe_action`, and `key_files`; detailed rationale belongs in `handover.md`/session narrative. | LOW | Low; avoids changing strict continuity schema and serializer behavior. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:1351-1392`, `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:1606-1685` | NONE/MODIFY | Runtime already builds and upserts thin continuity. Modify only if automatic extraction from new JSON advisory fields is required; otherwise `/memory:save` docs can instruct the AI to route advisory text through existing paths. | LOW | Low; runtime change is optional, docs-only path is safest. |

### INTEGRATION
1. Add `reviewer_focus` at the planner/orchestrator dispatch boundary first. It lives in `.opencode/agents/orchestrate.md` task format as an optional short field listing high-risk files/areas and rationale, with an optional self-assessed score. Prefer `self_assessed_quality_score` or `planner_quality_score` over bare `quality_score` to avoid memory-index quality-score ambiguity.

2. Pass `reviewer_focus` into @review as part of the existing gate `context` input. @review uses it to prioritize reads and evidence checks, not to change the default `threshold: 70` or create findings without proof.

3. Add `spec_drift` to @code’s optional RETURN body, not the first-line escalation enum. Suggested shape: `update_recommended: true|false`, `spec_drift: <one-line reason>`, `affected_spec_docs: [...]`, `affected_files: [...]`, `severity: advisory`.

4. Preserve Logic-Sync precedence explicitly: if implementation contradicts spec/code requirements, @code still returns `BLOCKED` with `escalation=LOGIC_SYNC`; `spec_drift` is only for lower-severity discoveries where the spec/plan should probably be revised.

5. Route drift write-back through `/memory:save`: detailed drift rationale goes to `handover_state`/`handover.md`; compact continuity gets a short `recent_action`, imperative `next_safe_action` like `Update plan for discovered scope drift`, and relevant `key_files`.

6. Keep `_memory.continuity` schema unchanged for the L1 version. Do not add raw `spec_drift` keys unless a later packet updates `ThinContinuityRecord`, validators, serializer, tests, and resume readers.

7. Add a small docs-only contract note in `/memory:save` and/or `generate-context` JSON guidance so AI-constructed JSON may include `specDrift` and `reviewerFocus`, but consumers must tolerate absence.

### BREAKS / WATCH-OUTS
`quality_score` is already used in memory/save quality contexts, including post-save review wording in `.opencode/commands/memory/save.md:359`; avoid a second bare `quality_score` with a different scale.

Do not make `reviewer_focus` a gate. Existing orchestrator and reviewer quality gates already use score thresholds and severity evidence; the new field should only steer attention.

Do not write `spec_drift` directly into `_memory.continuity` without schema work. The current thin continuity record has a fixed field set and normalization path.

Do not let `spec_drift` soften contradictions. `AGENTS.md:312-314` and `.opencode/agents/code.md:303-311` already define contradiction handling via Logic-Sync.

### OPEN QUESTIONS
Should P3 wait for P1’s typed envelope, since the proposal says P3 fields live in that envelope, or ship as markdown optional fields first?

What exact score scale should the self-assessed planner score use: `0.0-1.0`, `0-100`, or existing HIGH/MED/LOW?

Should non-@code agents such as @markdown/@debug also emit `spec_drift`, or only implementation agents?

Should detailed drift rationale always go to `handover.md`, or only when `update_recommended=true` and the session is being saved?

### METRICS
newInfoRatio: 0.76
novelty: The main new integration finding is that P3 can avoid MCP/schema churn by mapping drift into existing `handover_state` plus compact `_memory.continuity` fields.
status: complete
focus: RQ3 P3 planner-review-focus-and-drift-hint — integration & impact
