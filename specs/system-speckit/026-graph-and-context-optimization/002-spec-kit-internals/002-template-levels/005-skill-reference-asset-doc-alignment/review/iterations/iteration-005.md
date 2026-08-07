# Deep Review Iteration 005 - cross-runtime-mirror-consistency

## Dispatcher

- Command: `/deep:start-review-loop:auto /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/005-skill-reference-asset-doc-alignment --max-iterations=5`
- Iteration: 005 of 005
- Mode: review
- Focus dimension: cross-runtime-mirror-consistency
- Budget profile: verify
- Session: `2026-05-04T07:25:51.952Z`
- Generation: 1
- Lineage mode: new
- Review target: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/005-skill-reference-asset-doc-alignment`

## Files Reviewed

- `.opencode/skills/sk-code-review/references/review_core.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/005-skill-reference-asset-doc-alignment/review/deep-review-config.json`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/005-skill-reference-asset-doc-alignment/review/deep-review-state.jsonl`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/005-skill-reference-asset-doc-alignment/review/deep-review-findings-registry.json`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/005-skill-reference-asset-doc-alignment/review/deep-review-strategy.md`
- `.opencode/skills/system-spec-kit/SKILL.md`
- `.opencode/skills/system-spec-kit/references/workflows/execution_methods.md`
- `.opencode/skills/system-spec-kit/references/workflows/quick_reference.md`
- `.opencode/skills/system-spec-kit/references/templates/template_guide.md`
- `.opencode/skills/system-spec-kit/assets/template_mapping.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/graph-metadata.json`
- `.opencode/commands/deep/start-review-loop.md`
- `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml`
- `.opencode/agents/deep-review.md`
- `.claude/agents/deep-review.md`
- `.codex/agents/deep-review.toml`
- `.gemini/agents/deep-review.md`
- `.opencode/skills/sk-deep-review/SKILL.md`
- `.claude/skills/sk-deep-review/README.md`
- `.opencode/skills/sk-deep-review/assets/prompt_pack_iteration.md.tmpl`

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **Iteration prompt pack points executor contexts at a non-existent review doctrine path** -- `.opencode/skills/sk-deep-review/assets/prompt_pack_iteration.md.tmpl:18` -- The executor-agnostic prompt pack instructs iteration executors to load `.agents/skills/sk-code-review/references/review_core.md`, but the canonical native agent contract loads `.opencode/skills/sk-code-review/references/review_core.md` [SOURCE: `.opencode/agents/deep-review.md:273`]. The YAML renders this prompt pack before dispatch [SOURCE: `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml:638-657`], uses it as native context [SOURCE: `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml:666-670`], and pipes it to `codex exec` for CLI execution [SOURCE: `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml:672-680`]. This can make non-native executor severity classification diverge or fail to load the required doctrine, even though the canonical agent has the correct path.
   - Finding class: cross-consumer
   - Scope proof: The prompt pack is the shared rendered context for native and CLI executor paths; direct file discovery found the canonical `.opencode/skills/sk-code-review/references/review_core.md` path and no `.agents/skills/sk-code-review/references/review_core.md` path.
   - Affected surface hints: ["prompt pack", "cli-codex executor", "native rendered context", "severity doctrine", "post-dispatch validation"]
   - Recommendation: Change the prompt-pack doctrine path to `.opencode/skills/sk-code-review/references/review_core.md`, or render a runtime-resolved variable that always points to an existing review_core.md surface before dispatch.

```json
{
  "type": "claim-adjudication",
  "claim": "The shared iteration prompt pack references a non-existent sk-code-review doctrine path, which can make executor severity behavior inconsistent across runtimes.",
  "evidenceRefs": [
    ".opencode/skills/sk-deep-review/assets/prompt_pack_iteration.md.tmpl:18",
    ".opencode/agents/deep-review.md:273",
    ".opencode/commands/deep/assets/deep_start-review-loop_auto.yaml:638-657",
    ".opencode/commands/deep/assets/deep_start-review-loop_auto.yaml:666-680"
  ],
  "counterevidenceSought": "Checked whether canonical native agent guidance has the correct path and whether the rendered prompt pack is actually used by dispatch routes. Native agent is correct, but YAML still passes the prompt pack to native and CLI executor paths.",
  "alternativeExplanation": "A dispatcher or executor wrapper could inject an additional corrected doctrine path, but the inspected YAML/prompt surfaces do not show that correction.",
  "finalSeverity": "P1",
  "confidence": "high",
  "downgradeTrigger": "Downgrade to P2 if a follow-up inspection proves every non-native executor receives a separate corrected doctrine path before severity calls."
}
```

### P2 Findings

1. **Runtime mirrors re-label their packaged mirror path as canonical while command/YAML declares `.opencode/agents/deep-review.md` canonical** -- `.claude/agents/deep-review.md:27` -- The canonical OpenCode agent says path references should use `.opencode/agents/*.md` [SOURCE: `.opencode/agents/deep-review.md:27`], and the auto workflow identifies `.opencode/agents/deep-review.md` as the canonical agent file with runtime-specific directories referencing that source [SOURCE: `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml:71-72`]. The mirrors otherwise say they are downstream packaging surfaces [SOURCE: `.claude/agents/deep-review.md:259-267`; `.gemini/agents/deep-review.md:259-267`; `.codex/agents/deep-review.toml:252-260`], but each mirror's top-level Path Convention points to its own runtime path instead: `.claude/agents/*.md`, `.gemini/agents/*.md`, and `.codex/agents/*.toml` [SOURCE: `.claude/agents/deep-review.md:27`; `.gemini/agents/deep-review.md:27`; `.codex/agents/deep-review.toml:20`]. This is advisory because the operational workflow still names the canonical `.opencode` surface, but mirror-executed agents can cite or reason from a different "canonical" path during traceability review.
   - Finding class: matrix/evidence
   - Scope proof: Direct reads across all four agent definitions show the same contract body and mirror-awareness table, with only the Path Convention line varying by runtime while YAML marks `.opencode/agents/deep-review.md` canonical.
   - Affected surface hints: ["runtime mirrors", "agent_cross_runtime traceability", "canonical path references", "review evidence naming"]
   - Recommendation: Keep runtime-specific packaging notes if needed, but reword mirror Path Convention lines to state that the packaged runtime file is a mirror and `.opencode/agents/deep-review.md` remains the canonical source/reference path.

## Traceability Checks

- `agent_cross_runtime`: complete. Compared canonical `.opencode/agents/deep-review.md` with `.claude/agents/deep-review.md`, `.codex/agents/deep-review.toml`, and `.gemini/agents/deep-review.md`; one P2 mirror wording drift found.
- `skill_agent`: complete. Checked `sk-deep-review` skill surfaces for executor invariants and runtime path descriptions; one P1 prompt-pack doctrine path defect found through the skill/YAML render surface.
- `command_yaml`: complete. Checked `/deep:start-review-loop` command entrypoint and auto YAML for canonical agent path, prompt-pack rendering, executor dispatch, and output validation requirements.
- `review_core`: complete. Loaded `.opencode/skills/sk-code-review/references/review_core.md` before severity classification; P1/P2 severities classified using the shared doctrine.

## Integration Evidence

- `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml:71-72` declares `.opencode/agents/deep-review.md` canonical and runtime directories as references to that source.
- `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml:638-657` renders `.opencode/skills/sk-deep-review/assets/prompt_pack_iteration.md.tmpl` with state-path variables, including delta path.
- `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml:666-680` uses the rendered prompt pack as native context and CLI Codex stdin.
- `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml:781-788` validates iteration markdown, state-log append, and per-iteration delta file.
- `.opencode/skills/sk-deep-review/SKILL.md:55-60` requires command-owned dispatch and both markdown narrative and JSONL delta.
- `.opencode/skills/sk-deep-review/assets/prompt_pack_iteration.md.tmpl:18` points to a non-existent `.agents/skills/.../review_core.md` path.
- `.opencode/agents/deep-review.md:273` uses the existing canonical `.opencode/skills/sk-code-review/references/review_core.md` path.
- `.opencode/agents/deep-review.md:259-267`, `.claude/agents/deep-review.md:259-267`, `.gemini/agents/deep-review.md:259-267`, and `.codex/agents/deep-review.toml:252-260` consistently treat mirrors as downstream read-only packaging surfaces.

## Edge Cases

- Direct artifact writing was unavailable/disabled in this execution context; the command manager materialized this returned markdown, state JSONL record, delta JSONL, and strategy update summary.
- The strategy file contains stale machine-owned "blocked" entries that say `agent_cross_runtime` was deferred or not expanded in earlier iterations, while its active Next Focus section explicitly directs iteration 005 to run `cross-runtime-mirror-consistency`; this iteration followed the active dispatch and Next Focus.
- The mirror Path Convention issue was kept at P2 because the command/YAML operational surface still points to `.opencode/agents/deep-review.md` as canonical, limiting the impact to traceability wording and mirror-executed evidence naming.
- The prompt-pack doctrine path issue was escalated to P1 because the shared prompt is used by executor routes and the referenced doctrine path does not exist; severity classification is a required gate-relevant behavior.
- Prior P2-001, P2-002, and P2-003 were not duplicated.

## Confirmed-Clean Surfaces

- Native, Claude, Gemini, and Codex agent mirrors consistently preserve LEAF-only no-subagent constraints in the inspected contract body.
- Runtime mirror awareness tables consistently mark `.claude/agents/deep-review.md`, `.codex/agents/deep-review.toml`, and `.gemini/agents/deep-review.md` as read-only mirror/downstream surfaces.
- Command/YAML post-dispatch validation explicitly requires all three artifacts: iteration markdown, state JSONL append, and delta file.
- `sk-deep-review` skill guidance consistently states the command/YAML workflow owns dispatch and state.

## Ruled Out

- No P0 finding opened: no evidence showed destructive writes, auth/security exposure, or data-loss behavior.
- No finding opened for delta-file omission in YAML: the prompt pack and YAML both explicitly require a per-iteration delta file.
- No duplicate finding opened for prior P2-001, P2-002, or P2-003.
- No finding opened for the runtime mirror awareness table itself; the table consistently labels mirrors as read-only downstream packaging surfaces.

## Next Focus

- Dimension: synthesis/max-iterations
- Focus area: Final synthesis of five completed dimensions with active findings P0=0, P1=1, P2=4.
- Reason: Iteration 005 completed the final configured dimension and reached max iterations.
- Rotation status: stop-review-loop; proceed to synthesis.
- Blocked/productive carry-forward: Carry P1-001 as required remediation and P2-001/P2-002/P2-003/P2-004 as advisories.
- Required evidence: Build final review report from state JSONL, deltas, iteration narratives, and findings registry after reducer refresh.
