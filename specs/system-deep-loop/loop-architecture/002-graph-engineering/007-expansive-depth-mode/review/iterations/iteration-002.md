# Iteration 2: Security

## Dispatcher
- Dimension: security. Iteration 2 of 3, run 2, session 2026-11-19T15:38:08.666Z, generation 2, lineageMode restart.
- Iteration number matches the state log (one prior iteration record).
- Operator focus: only the logic the range 21c4b325b5a..f30fcdb42f6 added or changed was weighed, read through `git diff` per file, production scripts and the two command YAML assets first. Tests were not read this iteration; no test change carries a trust boundary of its own.

## Files Reviewed
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` (file flags, frontier partition, lineage store seeding, prompt params, DEEP_LOOP_COVERAGE_DB_DIR)
- `.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs` (id minting, proposal cleaning, scope containment, frontier block)
- `.skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs` (finding and evidence derivation, source quality class, orphan-edge skip)
- `.skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs` (research --claude-config-dir, CLAUDE_CONFIG_DIR env)
- `.skilled/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs` (route-proof source order)
- `.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs` (frontier projection, focus regex, budget)
- `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts`, `.skilled/skills/system-deep-loop/deep-review/scripts/divergent-review-pivot.ts` (attempt-2 paths, revisit candidates)
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs` (lineage-qualified node ids)
- `.skilled/commands/deep/assets/deep-review.yaml`, `.skilled/commands/deep/assets/deep-research.yaml` (shell steps carrying `{active_frontier_node}`, focus, topic and target)

## Findings - New

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings
1. **Research topic read from --research-topic-file keeps its line breaks and can forge lineage binding lines** -- .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3712 -- The new `readTextFileFlags` reads the topic file verbatim, and the research YAML tells the workflow to write `{research_topic}` verbatim into that file. The review side collapses whitespace and control characters for both focus and target, but `researchTopic` is only trimmed. It is then pushed as `  research_topic: ${researchTopic}` into the lineage prompt params, directly ahead of `config.maxIterations`, `config.convergenceThreshold` and `config.depthMode`, so an embedded line break makes the following text read as further binding lines.
   Finding class: input normalization gap at a trust boundary.
   Scope proof: `readTextFileFlags` and the `--research-topic-file` call at deep-research.yaml:404 are new in the range; the trim-only path at fanout-run.cjs:3712 is the consumer they now feed.
   Affected surface hints: fanout-run.cjs (`researchTopic` normalization), deep-research.yaml (fan-out topic file step).
   Case: research fan-out whose topic holds a line break followed by `  config.maxIterations: 99` puts a second maxIterations binding line ahead of the real one in every lineage prompt.
   Evidence: [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3712] trim only; [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1812] params push; contrast [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:238] and [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:266]; [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:386] verbatim write.
   Severity rationale: the topic is operator text, so no privilege boundary is crossed; the impact is ambiguous lineage bindings, which keeps it at P2. Fix: apply the same control-character and whitespace collapse used by `normalizeReviewFocus` to `researchTopic`.

## Traceability Checks
- spec_code: notApplicable (traceability is not a configured dimension; specs and docs are excluded from the target).
- checklist_evidence: notApplicable (checklists are excluded from the target).

## Integration Evidence
- `.skilled/commands/deep/assets/deep-review.yaml` step bindings for `active_frontier_node` (line 1193) and the frontier close/activate/block commands (lines 1611, 1717, 1759).
- `.skilled/commands/deep/assets/deep-research.yaml` fan-out topic file step (line 386) and frontier focus file step (line 1661).

## Edge Cases
- Verdict mapping: the prompt pack maps the final line from findings of this iteration; the agent contract maps it from findings active at this iteration. R1-P1-001 is still active, so the line is CONDITIONAL under the agent contract.
- Ledger schemas (deep-research and deep-review) were not read under security; deferred to iteration 3 as a carry-forward.
- A fan-out lineage process could write its own `frontier-nodes.jsonl` and so forge a node id that reaches a shell argument, but that process is the same agent that runs those shell steps, so no privilege boundary is crossed.

## Confirmed-Clean Surfaces
- Node ids reaching shell arguments are minted as `F-<depth>-<serial>` (frontier-admit.cjs:672, :766) and bound from the reducer-projected registry (deep-review.yaml:1193, reduce-state.cjs:2062), never from leaf text.
- Review proposal scope: `normalizeTargetPath` normalizes with `path.posix.normalize` (frontier-admit.cjs:467); a probe refused `src/lib/../../etc/passwd`, `/etc/passwd` and `../x`.
- Leaf question and scope text: control characters stripped and length capped before admission (frontier-admit.cjs:136, :588).
- Research focus reaches frontier-admit through a file, never a shell argument (deep-research.yaml:1661); the research reducer escapes node ids before building its focus regex.
- upsert.cjs now derives research source `quality_class` from location, overriding any leaf value; derived finding evidence adds no capability a leaf lacked through `graphEvents`.
- dispatch-iteration.cjs research `--claude-config-dir` reuses `validateClaudeConfigDir` (fanout-run.cjs:813).
- verify-iteration.cjs only reorders the route-proof source; the both-must-fail rule is unchanged.

## Ruled Out
- Shell injection through `{active_frontier_node}`: ids are minted, not leaf-chosen.
- Path traversal through review proposal scope: normalized and refused.
- Prompt-row breakage by leaf proposals: control characters stripped.
- Regex injection through node ids in the research reducer: escaped.
- Convergence-signal forgery through upsert derivations: no new capability.
- Env leakage through research CLAUDE_CONFIG_DIR: same validator and allowlist as review.

## Next Focus
- Dimension: maintainability.
- Focus area: overengineering and sk-code-alignment rubrics over frontier-admit.cjs (1219 added lines), fanout-run.cjs expansive helpers, upsert.cjs finding-id folding and the two YAML assets; comment hygiene across the range.
- Reason: last configured dimension; the run stops at iteration 3.
- Rotation status: correctness and security done.
- Carry-forward: R1-P1-001 still active; R2-P2-001 open; ledger schemas unread under security.
- Required evidence: file:line from reviewScopeFiles only.

Review verdict: CONDITIONAL
