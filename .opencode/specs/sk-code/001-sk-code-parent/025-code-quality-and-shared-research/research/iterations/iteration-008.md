# Iteration 8: Delta/artifact ownership and boundary decisions

## Focus
This iteration followed the explicit dispatch focus rather than the stale reducer `NEXT FOCUS`: delta/artifact ownership and boundary decisions. I separated findings that belong to the `deep-research` / deep-loop workflow from findings that belong to the `code-quality` follow-up, and identified which recommendations should stay in this packet's code-quality implementation backlog versus separate deep-loop or system-spec-kit issues.

## Findings
1. Route-proof is a deep-loop dispatch/state concern, not `code-quality` evidence. The compiled `/deep:research` contract says `:auto` dispatch must write iteration state records with `target_agent`, `resolved_route`, `agent_definition_loaded`, and `mode`, while `verify-iteration.cjs` validates those fields on the canonical iteration record. By contrast, `code-quality` owns the author-side quality gate and explicitly leaves verification evidence, formal review output, and spec-kit workflows to other owners. [SOURCE: .opencode/commands/deep/assets/compiled/deep_research.contract.md:105] [SOURCE: .opencode/commands/deep/assets/compiled/deep_research.contract.md:111] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/verify-iteration.cjs:99] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/verify-iteration.cjs:116] [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:44] [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:219]
2. The delta artifact decision belongs to deep-loop workflow/runtime owners, not the `code-quality` follow-up. The verifier requires `deltas/iter-NNN.jsonl` with a `type: "iteration"` record, but the leaf `deep-research` agent's allowed write targets do not include `research/deltas/*`; the workflow docs also mix terminology by saying the YAML workflow owns dispatch/evaluation while each leaf writes only one research cycle. This should become a separate deep-loop issue: either add `research/deltas/*` to the leaf/workflow write contract or make the verifier/reducer own deltas consistently. [SOURCE: .opencode/skills/deep-loop-runtime/scripts/verify-iteration.cjs:159] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/verify-iteration.cjs:162] [SOURCE: .opencode/agents/deep-research.md:69] [SOURCE: .opencode/agents/deep-research.md:71] [SOURCE: .opencode/skills/deep-loop-workflows/deep-research/SKILL.md:345] [SOURCE: .opencode/skills/deep-loop-workflows/deep-research/SKILL.md:367]
3. A small system-spec-kit boundary issue exists only if deltas become canonical deep-research artifacts. System-spec-kit already says deep-research workflow-owned packet markdown and progressive `research/research.md` updates are exempt from the generic authored spec-doc validation rule, and that `@deep-research` retains exclusive write access for `research/research.md`; it does not name `research/deltas/*.jsonl`. If deep-loop resolves deltas as canonical, system-spec-kit should document that governance/validation classification separately instead of pushing it into `code-quality`. [SOURCE: .opencode/skills/system-spec-kit/SKILL.md:59] [SOURCE: .opencode/skills/system-spec-kit/SKILL.md:61] [SOURCE: .opencode/skills/system-spec-kit/SKILL.md:410] [SOURCE: .opencode/skills/system-spec-kit/SKILL.md:415] [SOURCE: .opencode/skills/system-spec-kit/references/workflows/spec_folder_authoring_checklist.md:22] [SOURCE: .opencode/skills/system-spec-kit/references/workflows/spec_folder_authoring_checklist.md:29]
4. The `code-quality` follow-up should focus on a consumer-readable quality evidence handoff, not deep-loop delta files or spec-kit completion claims. Existing `code-quality` workflow steps already require loading checklists, running comment hygiene, applying P0/P1/P2 checks, handing P0-clear work to verification, and never making completion/done/passing claims. The concrete implementation backlog item is therefore a stable advisory envelope plus checklist summary containing checker outputs, checklist paths, P0/P1/P2 decisions, deferrals, verification handoff, and remaining accepted risk. [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:140] [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:150] [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:183] [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:187] [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:204] [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:213] [SOURCE: .opencode/skills/sk-code/code-quality/assets/code_quality_checklist.md:461] [SOURCE: .opencode/skills/sk-code/code-quality/assets/code_quality_checklist.md:463]
5. The ownership split is now actionable: keep `code-quality` work inside docs/navigation, checklist/handoff schema, parent-router/advisor vocabulary, hook-doc alignment, and sk-code-owned hook coverage; open separate deep-loop work for route-proof/delta verifier consistency; open a system-spec-kit note only if the delta decision changes generic spec-folder governance. Further broad research is lower-value than making those owner decisions and implementing the trimmed backlog. [SOURCE: research/research.md:57] [SOURCE: research/research.md:64] [SOURCE: research/iterations/iteration-007.md:61] [SOURCE: research/iterations/iteration-007.md:62] [INFERENCE: based on Findings 1-4 separating owner-specific contracts]

## Ruled Out
- Writing `research/deltas/iter-008.jsonl` from this leaf execution. The file would be packet-local, but the current `deep-research` leaf write contract does not include `research/deltas/*`, while reducer-owned files are explicitly read-only. [SOURCE: .opencode/agents/deep-research.md:69] [SOURCE: .opencode/agents/deep-research.md:71] [SOURCE: .opencode/agents/deep-research.md:72]
- Treating route-proof fields as mandatory `code-quality` output fields. Route-proof proves deep-loop dispatch identity; it does not prove checklist quality, checker results, or P0/P1/P2 handling. [SOURCE: .opencode/skills/deep-loop-runtime/scripts/verify-iteration.cjs:99] [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:204]
- Folding system-spec-kit validation/memory ownership into the `code-quality` packet. `code-quality` should reference and hand off to system-spec-kit for spec-folder targets, not duplicate its validation or continuity workflow. [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:106] [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:222] [SOURCE: .opencode/skills/system-spec-kit/SKILL.md:410] [SOURCE: .opencode/skills/system-spec-kit/SKILL.md:415]

## Dead Ends
- Another broad discovery pass is unlikely to change the owner split. The remaining uncertainty is a contract decision across deep-loop runtime and, conditionally, system-spec-kit governance, not a lack of codebase evidence. [INFERENCE: based on iterations 1-8 covering baseline, spec-kit, advisor, deep-loop, hooks, benchmarks, backlog synthesis, validation, and artifact contracts]
- The verifier-vs-leaf delta mismatch cannot be resolved by this research leaf without editing out-of-scope deep-loop runtime files or writing an unpermitted delta artifact. [SOURCE: .opencode/skills/deep-loop-runtime/scripts/verify-iteration.cjs:159] [SOURCE: .opencode/agents/deep-research.md:71]

## Edge Cases
- Ambiguous input: Strategy `NEXT FOCUS` is stale and still points at the original baseline; I followed the explicit dispatch focus for iteration 8.
- Contradictory evidence: `verify-iteration.cjs` requires a per-iteration delta file, while the `deep-research` leaf allowed-write contract excludes `research/deltas/*`. This remains unresolved and is assigned to a separate deep-loop contract issue.
- Missing dependencies: Delta write authority is absent for this leaf, so no `research/deltas/iter-008.jsonl` was written.
- Partial success: Iteration markdown, one canonical state append, and progressive `research.md` are in scope and were written; the delta artifact was omitted by contract.

## Sources Consulted
- `.opencode/agents/deep-research.md:69`
- `.opencode/agents/deep-research.md:71`
- `.opencode/agents/deep-research.md:72`
- `.opencode/commands/deep/assets/compiled/deep_research.contract.md:105`
- `.opencode/commands/deep/assets/compiled/deep_research.contract.md:111`
- `.opencode/skills/deep-loop-runtime/scripts/verify-iteration.cjs:99`
- `.opencode/skills/deep-loop-runtime/scripts/verify-iteration.cjs:116`
- `.opencode/skills/deep-loop-runtime/scripts/verify-iteration.cjs:159`
- `.opencode/skills/deep-loop-runtime/scripts/verify-iteration.cjs:162`
- `.opencode/skills/deep-loop-workflows/deep-research/SKILL.md:345`
- `.opencode/skills/deep-loop-workflows/deep-research/SKILL.md:367`
- `.opencode/skills/sk-code/code-quality/SKILL.md:44`
- `.opencode/skills/sk-code/code-quality/SKILL.md:140`
- `.opencode/skills/sk-code/code-quality/SKILL.md:150`
- `.opencode/skills/sk-code/code-quality/SKILL.md:187`
- `.opencode/skills/sk-code/code-quality/SKILL.md:204`
- `.opencode/skills/sk-code/code-quality/SKILL.md:213`
- `.opencode/skills/sk-code/code-quality/SKILL.md:219`
- `.opencode/skills/sk-code/code-quality/SKILL.md:222`
- `.opencode/skills/sk-code/code-quality/assets/code_quality_checklist.md:461`
- `.opencode/skills/sk-code/code-quality/assets/code_quality_checklist.md:463`
- `.opencode/skills/system-spec-kit/SKILL.md:59`
- `.opencode/skills/system-spec-kit/SKILL.md:61`
- `.opencode/skills/system-spec-kit/SKILL.md:410`
- `.opencode/skills/system-spec-kit/SKILL.md:415`
- `.opencode/skills/system-spec-kit/references/workflows/spec_folder_authoring_checklist.md:22`
- `.opencode/skills/system-spec-kit/references/workflows/spec_folder_authoring_checklist.md:29`
- `research/research.md:57`
- `research/research.md:64`
- `research/iterations/iteration-007.md:61`
- `research/iterations/iteration-007.md:62`

## Assessment
- New information ratio: 0.80
- Questions addressed: delta/artifact ownership; deep-research versus code-quality boundaries; code-quality follow-up versus separate deep-loop/system-spec-kit issues; convergence decision.
- Questions answered: route-proof and delta verifier consistency belong to deep-loop; a conditional governance note for deltas belongs to system-spec-kit only if deltas become canonical; code-quality should implement the quality evidence handoff and related docs/router/checklist work, not deep-loop artifacts.

## Reflection
- What worked and why: Reading the leaf agent contract, runtime verifier, deep-research workflow docs, code-quality boundary rules, and system-spec-kit governance text together made the owner split explicit instead of treating every artifact gap as a `code-quality` backlog item.
- What did not work and why: The existing sources still contradict each other about delta files, so this iteration could classify ownership but could not resolve the contract without out-of-scope implementation edits.
- What I would do differently: Start the implementation packet with a short owner decision record: deep-loop delta ownership first, optional system-spec-kit governance wording second, then the code-quality evidence handoff.

## Recommended Next Focus
Converge research and move to implementation planning. First open/resolve the separate deep-loop issue for delta ownership (`research/deltas/iter-NNN.jsonl` leaf-owned vs reducer/verifier-owned). If deltas become canonical deep-research artifacts, add a system-spec-kit governance note for their validation/write classification. Then implement this packet's `code-quality` follow-up: stable quality-evidence handoff, checklist/docs navigation, parent router/advisor vocabulary, hook-doc alignment, and sk-code-owned hook coverage.
