# Iteration 2: System-spec-kit integration for code-quality

## Focus
This iteration investigated the required resume focus: how `code-quality` should load or reference system-spec-kit validation, completion-check, memory/continuity, and dist-freshness evidence without duplicating system-spec-kit rules. The selected interpretation is a handoff/reference model for `code-quality`, not an implementation edit to either skill.

## Findings
1. `code-quality` already has the right ownership boundary but only at a coarse level: it conditionally loads the system-spec-kit spec-folder checklist for `.opencode/specs/` targets, maps that target path to packet-document consistency checks, and states that `system-spec-kit` owns spec-folder documentation, validation, and memory workflows. Therefore the improvement should make this boundary more operational, not copy system-spec-kit gates into `code-quality`. [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:106] [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:119] [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:222]
2. The spec-folder authoring handoff should load system-spec-kit's checklist when canonical spec docs or metadata are touched, because that checklist explicitly covers validator compatibility, memory resume ladder requirements, canonical docs, `_memory.continuity`, `description.json`, and `graph-metadata.json`, then requires strict validation. `code-quality` should reference this as the source-of-truth checklist rather than maintaining a parallel spec-doc checklist. [SOURCE: .opencode/skills/system-spec-kit/references/workflows/spec_folder_authoring_checklist.md:22] [SOURCE: .opencode/skills/system-spec-kit/references/workflows/spec_folder_authoring_checklist.md:26] [SOURCE: .opencode/skills/system-spec-kit/references/workflows/spec_folder_authoring_checklist.md:29] [SOURCE: .opencode/skills/system-spec-kit/references/workflows/spec_folder_authoring_checklist.md:51] [SOURCE: .opencode/skills/system-spec-kit/references/workflows/spec_folder_authoring_checklist.md:58]
3. Completion-check integration should be evidence handoff, not reimplementation. `code-quality` already treats missing required checklist evidence and unchecked generated drift as P0 blockers, while system-spec-kit's completion script defines the authoritative checklist rule: P0/P1 must be complete, P2 can defer unless strict, untagged items block, and completed P0/P1 items need evidence markers. `code-quality` should collect and pass this evidence to verification/completion flows rather than claim completion itself. [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:150] [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:156] [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:187] [SOURCE: .opencode/skills/system-spec-kit/scripts/spec/check-completion.sh:48] [SOURCE: .opencode/skills/system-spec-kit/scripts/spec/check-completion.sh:59] [SOURCE: .opencode/skills/system-spec-kit/scripts/spec/check-completion.sh:64] [SOURCE: .opencode/skills/system-spec-kit/scripts/spec/check-completion.sh:69]
4. Memory/continuity integration should remain system-spec-kit-owned. The system-spec-kit core workflow says continuity is preserved in `implementation-summary.md` or through canonical `/memory:save` with `generate-context.js`; the memory workflow says all save paths feed the same canonical entrypoint, update continuity surfaces, and reindex packet docs. `code-quality` has no authority to create new files, so its useful role is to verify or request continuity evidence in the handoff when the broader task requires it. [SOURCE: .opencode/skills/system-spec-kit/SKILL.md:414] [SOURCE: .opencode/skills/system-spec-kit/SKILL.md:418] [SOURCE: .opencode/skills/system-spec-kit/references/memory/save_workflow.md:24] [SOURCE: .opencode/skills/system-spec-kit/references/memory/save_workflow.md:151] [SOURCE: .opencode/skills/system-spec-kit/references/memory/save_workflow.md:153] [SOURCE: .opencode/skills/system-spec-kit/references/memory/save_workflow.md:255] [SOURCE: .opencode/skills/system-spec-kit/references/memory/save_workflow.md:263] [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:185]
5. Dist-freshness is already a concrete cross-skill integration: `code-quality` calls `scripts/check-dist-staleness.sh`, which delegates to system-spec-kit's `dist-freshness.cjs` and prints package rebuild commands when stale output is detected. The system-spec-kit library owns the watched package map and rebuild commands, so `code-quality` should surface stale output as quality evidence/P0 context while leaving package freshness rules in the shared utility. [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:109] [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:156] [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:200] [SOURCE: .opencode/skills/sk-code/code-quality/scripts/check-dist-staleness.sh:30] [SOURCE: .opencode/skills/sk-code/code-quality/scripts/check-dist-staleness.sh:42] [SOURCE: .opencode/skills/sk-code/code-quality/scripts/check-dist-staleness.sh:57] [SOURCE: .opencode/skills/sk-code/code-quality/scripts/check-dist-staleness.sh:60] [SOURCE: .opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs:21] [SOURCE: .opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs:31] [SOURCE: .opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs:48]

## Ruled Out
- Duplicating `validate.sh`, `check-completion.sh`, `/memory:save`, or dist package maps inside `code-quality`; system-spec-kit identifies these as its primary operational scripts and memory surfaces, while `code-quality` explicitly says system-spec-kit owns those workflows. [SOURCE: .opencode/skills/system-spec-kit/SKILL.md:105] [SOURCE: .opencode/skills/system-spec-kit/SKILL.md:109] [SOURCE: .opencode/skills/system-spec-kit/SKILL.md:418] [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:222]
- Running generic spec-folder validation for this deep-research iteration artifact; system-spec-kit exempts deep-research workflow-owned research markdown from the generic authored-spec-doc per-write validation rule. [SOURCE: .opencode/skills/system-spec-kit/SKILL.md:61]

## Dead Ends
- `research/deltas/iter-002.jsonl` was not written because the leaf allowed-write contract for this agent permits iteration markdown, the append-only state JSONL record, optional explicitly allowed idea observations, and progressive `research.md`; it does not include `research/deltas/*` as an allowed direct write target. [INFERENCE: based on the active deep-research allowed-write contract and the user’s conditional “if permitted” instruction]

## Edge Cases
- Ambiguous input: The strategy's reducer-owned `NEXT FOCUS` still points at the baseline, while the user provided an explicit iteration-2 required focus. I followed the explicit dispatch focus and deferred reducer refresh to the workflow.
- Contradictory evidence: None found.
- Missing dependencies: Delta writing was requested only if permitted; it is not permitted by the leaf write contract, so no delta file was created.
- Partial success: The required iteration artifact, state append, and progressive synthesis update are in scope; the optional delta artifact is intentionally omitted.

## Sources Consulted
- `.opencode/skills/sk-code/code-quality/SKILL.md:60`
- `.opencode/skills/sk-code/code-quality/scripts/check-dist-staleness.sh:1`
- `.opencode/skills/system-spec-kit/SKILL.md:1`
- `.opencode/skills/system-spec-kit/SKILL.md:400`
- `.opencode/skills/system-spec-kit/scripts/spec/validate.sh:1`
- `.opencode/skills/system-spec-kit/scripts/spec/check-completion.sh:1`
- `.opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs:1`
- `.opencode/skills/system-spec-kit/references/workflows/spec_folder_authoring_checklist.md:1`
- `.opencode/skills/system-spec-kit/references/memory/save_workflow.md:1`
- `research/iterations/iteration-001.md:54`

## Assessment
- New information ratio: 1.0
- Questions addressed: q3 system-spec-kit validation, completion checks, memory/continuity, and dist-freshness integration.
- Questions answered: `code-quality` should use a source-of-truth handoff model: load/reference system-spec-kit checklists and scripts, collect evidence, and hand completion/memory validation to system-spec-kit-owned workflows rather than duplicating them.

## Reflection
- What worked and why: Pairing `code-quality`'s resource map with system-spec-kit's actual scripts and workflow references exposed a clean division between author-side quality evidence and system-spec-kit-owned validation/completion/memory state.
- What did not work and why: The reducer-owned strategy had not yet advanced its `NEXT FOCUS`; the explicit dispatch focus was more current, so reducer refresh remains a post-iteration orchestration task.
- What I would do differently: In the next iteration, inspect skill-advisor metadata and routing vocabulary using the same ownership-boundary lens before proposing parent-level metadata changes.

## Recommended Next Focus
Investigate system-skill-advisor integration: parent-level `sk-code` metadata, `quality` mode routing aliases, benchmark vocabulary, and prompt-safe recommendation evidence for making `code-quality` easier to discover without adding packet-local graph metadata.
