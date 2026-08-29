# Iteration 9: Priority/risk scoring and implementation sequencing

## Focus
This iteration followed the explicit dispatch focus rather than the stale reducer `NEXT FOCUS`: priority/risk scoring and implementation sequencing. I re-ranked the accumulated `code-quality` and shared-asset recommendations by leverage, implementation cost, integration risk, and owner boundary, then separated no-change recommendations from deferred deep-loop/system-spec-kit issues.

## Findings
1. The highest-leverage, lowest-risk first step is docs/navigation cleanup: update `sk-code/shared/README.md` from placeholder text, clarify the `code-quality` checklist-path label, and preserve the existing conditional handoff to the system-spec-kit checklist. This is cheap because it edits documentation only, reduces user routing friction immediately, and does not change runtime behavior. [SOURCE: .opencode/skills/sk-code/shared/README.md:3] [SOURCE: .opencode/skills/sk-code/shared/README.md:11] [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:89] [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:90] [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:106]
2. The next highest-leverage implementation is a stable `code-quality` evidence handoff shape, but it has medium cost because it changes the main workflow contract and any downstream examples. The schema should summarize changed files, loaded checklists, checker outputs, P0/P1/P2 decisions, deferrals, verification handoff, and remaining accepted risk; that maps to existing success criteria and avoids letting quality mode make completion claims. [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:140] [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:145] [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:146] [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:150] [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:187] [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:213]
3. Hook-doc alignment should precede expanded hook coverage because current documentation and implementation disagree about pre-commit scope. `code-quality` correctly lists write-time warning, pre-commit block, and CI block as independent enforcement layers, but `.opencode/hooks/README.md` says pre-commit checks comment hygiene only while the actual hook also blocks staged agent mirror drift. Fixing the docs first lowers integration risk for later hook tests. [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:124] [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:130] [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:131] [SOURCE: .opencode/hooks/README.md:70] [SOURCE: .opencode/hooks/README.md:71] [SOURCE: .opencode/hooks/pre-commit:36] [SOURCE: .opencode/hooks/pre-commit:52]
4. Parent router/advisor vocabulary is useful but should be sequenced after the evidence handoff and docs cleanup. The parent already routes the single `sk-code` identity and has quality aliases; the implementation should only tune alias/test vocabulary for quality-mode prompts, not create a separate `code-quality` advisor identity. [SOURCE: .opencode/skills/sk-code/mode-registry.json:4] [SOURCE: .opencode/skills/sk-code/mode-registry.json:10] [SOURCE: .opencode/skills/sk-code/mode-registry.json:23] [SOURCE: .opencode/skills/sk-code/mode-registry.json:35] [SOURCE: .opencode/skills/sk-code/hub-router.json:42] [SOURCE: .opencode/skills/sk-code/hub-router.json:46] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/tests/scorer/fixtures/intent-prompt-corpus.ts:13] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/tests/scorer/fixtures/intent-prompt-corpus.ts:74]
5. Hook coverage is later than doc/schema work: the manual playbook has a deterministic tooling-and-hooks category and a `TH-001` dist-staleness scenario, but it explicitly lacks automated coverage for the dist branch and any dedicated comment-hygiene branch scenario. Add comment-hygiene hook coverage after the hook contract and quality evidence handoff are explicit, otherwise tests will encode ambiguous expectations. [SOURCE: .opencode/skills/sk-code/manual_testing_playbook/manual_testing_playbook.md:292] [SOURCE: .opencode/skills/sk-code/manual_testing_playbook/manual_testing_playbook.md:294] [SOURCE: .opencode/skills/sk-code/manual_testing_playbook/manual_testing_playbook.md:298] [SOURCE: .opencode/skills/sk-code/manual_testing_playbook/manual_testing_playbook.md:322] [SOURCE: .opencode/skills/sk-code/manual_testing_playbook/manual_testing_playbook.md:324]
6. No-change and deferred-owner decisions are now explicit. Do not add new-file authority, subagent authority, done/passing claims, copied shared detection, or packet-local `graph-metadata.json` to `code-quality`; its current contract forbids those. Defer the `research/deltas/iter-NNN.jsonl` contradiction to deep-loop runtime/workflow owners, because the verifier requires a delta record while the leaf agent allowed-write contract excludes deltas; system-spec-kit only needs a follow-up if deep-loop makes deltas canonical governed artifacts. [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:185] [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:186] [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:187] [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:189] [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:192] [SOURCE: .opencode/agents/deep-research.md:69] [SOURCE: .opencode/agents/deep-research.md:71] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/verify-iteration.cjs:159] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/verify-iteration.cjs:162] [SOURCE: .opencode/skills/system-spec-kit/SKILL.md:410] [SOURCE: .opencode/skills/system-spec-kit/SKILL.md:414]

## Ruled Out
- Writing `research/deltas/iter-009.jsonl` from this leaf execution. The file would be packet-local, but the loaded `deep-research` agent contract allows iteration markdown, one JSONL state append, optional idea rows, progressive `research.md`, and explicitly listed idea-file writes only; it does not permit `research/deltas/*`. [SOURCE: .opencode/agents/deep-research.md:69] [SOURCE: .opencode/agents/deep-research.md:71] [SOURCE: .opencode/agents/deep-research.md:72]
- Starting implementation from router/advisor fixtures before docs/schema work. Existing parent routing is already functional; vocabulary tuning has lower leverage until the handoff shape and docs navigation are stable. [SOURCE: .opencode/skills/sk-code/mode-registry.json:10] [SOURCE: .opencode/skills/sk-code/hub-router.json:42]
- Treating hook coverage as first work. The actual hook surface and hook README currently disagree, so tests should follow contract alignment rather than freeze a known ambiguity. [SOURCE: .opencode/hooks/README.md:71] [SOURCE: .opencode/hooks/pre-commit:36]

## Dead Ends
- Another broad discovery pass should be promoted to exhausted/low-value. The remaining work is owner-specific implementation planning: code-quality/shared docs and handoff changes, separate deep-loop delta ownership, and conditional system-spec-kit governance only if deep-loop changes the artifact contract. [INFERENCE: based on iterations 1-9 and Findings 1-6]
- Trying to solve the delta artifact mismatch from this packet is a boundary violation for `code-quality` and for this leaf execution. [SOURCE: .opencode/skills/deep-loop-runtime/scripts/verify-iteration.cjs:159] [SOURCE: .opencode/agents/deep-research.md:71]

## Edge Cases
- Ambiguous input: Strategy `NEXT FOCUS` is stale and still points at baseline; I followed the explicit dispatch focus for iteration 9 and documented the stale strategy condition.
- Contradictory evidence: `verify-iteration.cjs` requires a per-iteration delta file, while the loaded `deep-research` leaf allowed-write contract excludes `research/deltas/*`. This remains unresolved and deferred to deep-loop owners. [SOURCE: .opencode/skills/deep-loop-runtime/scripts/verify-iteration.cjs:159] [SOURCE: .opencode/agents/deep-research.md:71]
- Missing dependencies: Delta write authority is absent for this leaf, so no `research/deltas/iter-009.jsonl` was written.
- Partial success: Iteration markdown, one canonical state append, and progressive `research.md` are in scope; the optional delta artifact requested by dispatch was omitted by contract.

## Sources Consulted
- `.opencode/agents/deep-research.md:69`
- `.opencode/agents/deep-research.md:71`
- `.opencode/agents/deep-research.md:72`
- `.opencode/skills/sk-code/code-quality/SKILL.md:89`
- `.opencode/skills/sk-code/code-quality/SKILL.md:90`
- `.opencode/skills/sk-code/code-quality/SKILL.md:106`
- `.opencode/skills/sk-code/code-quality/SKILL.md:124`
- `.opencode/skills/sk-code/code-quality/SKILL.md:140`
- `.opencode/skills/sk-code/code-quality/SKILL.md:145`
- `.opencode/skills/sk-code/code-quality/SKILL.md:146`
- `.opencode/skills/sk-code/code-quality/SKILL.md:150`
- `.opencode/skills/sk-code/code-quality/SKILL.md:185`
- `.opencode/skills/sk-code/code-quality/SKILL.md:187`
- `.opencode/skills/sk-code/code-quality/SKILL.md:192`
- `.opencode/skills/sk-code/code-quality/SKILL.md:213`
- `.opencode/skills/sk-code/shared/README.md:3`
- `.opencode/skills/sk-code/shared/README.md:11`
- `.opencode/skills/sk-code/mode-registry.json:4`
- `.opencode/skills/sk-code/mode-registry.json:10`
- `.opencode/skills/sk-code/mode-registry.json:23`
- `.opencode/skills/sk-code/mode-registry.json:35`
- `.opencode/skills/sk-code/hub-router.json:42`
- `.opencode/skills/sk-code/hub-router.json:46`
- `.opencode/hooks/README.md:70`
- `.opencode/hooks/README.md:71`
- `.opencode/hooks/pre-commit:36`
- `.opencode/hooks/pre-commit:52`
- `.opencode/skills/sk-code/manual_testing_playbook/manual_testing_playbook.md:292`
- `.opencode/skills/sk-code/manual_testing_playbook/manual_testing_playbook.md:298`
- `.opencode/skills/sk-code/manual_testing_playbook/manual_testing_playbook.md:322`
- `.opencode/skills/sk-code/manual_testing_playbook/manual_testing_playbook.md:324`
- `.opencode/skills/deep-loop-runtime/scripts/verify-iteration.cjs:159`
- `.opencode/skills/deep-loop-runtime/scripts/verify-iteration.cjs:162`
- `.opencode/skills/system-spec-kit/SKILL.md:410`
- `.opencode/skills/system-spec-kit/SKILL.md:414`
- `.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/fixtures/intent-prompt-corpus.ts:13`
- `.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/fixtures/intent-prompt-corpus.ts:74`

## Assessment
- New information ratio: 0.68
- Questions addressed: priority/risk scoring; implementation sequencing; no-change recommendations; deferred deep-loop/system-spec-kit issues.
- Questions answered: implementation should start with docs/navigation, then the quality evidence handoff, then hook-doc alignment, then parent/router advisor vocabulary, then hook coverage and deep-review consumption notes; no-change and deferred-owner items are explicit.

## Reflection
- What worked and why: Re-reading the current source anchors for each prior recommendation made leverage, cost, and boundary risk concrete instead of ranking by memory of previous iterations.
- What did not work and why: The delta-file contradiction is still not resolvable inside this leaf because the verifier and agent write contract disagree across owner boundaries.
- What I would do differently: Open the implementation packet with this ranked backlog and treat the delta decision as a separate deep-loop owner issue before relying on verifier success.

## Recommended Next Focus
Converge research and move to implementation planning. Sequence the `code-quality`/shared work as: (1) docs/navigation cleanup, (2) stable quality-evidence handoff schema, (3) hook-doc alignment, (4) parent router/advisor vocabulary and scorer coverage, (5) sk-code-owned hook coverage and deep-review consumption note. Defer deep-loop delta ownership to a separate issue; add a system-spec-kit governance note only if deep-loop makes deltas canonical artifacts.
