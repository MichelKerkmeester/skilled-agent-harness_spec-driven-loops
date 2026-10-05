## Row 68 (ambiguous)
- Doc: `specs/cli-orca/002-consolidate-official-orca-skills/scratch/research-official-skills.md:101`
- Citation: `skills/orca-linear/SKILL.md:13`
- Candidates: `.hermes/skills/agent-ai-council/SKILL.md`, `.hermes/skills/agent-code/SKILL.md`, `.hermes/skills/agent-context/SKILL.md`, `.hermes/skills/agent-debug/SKILL.md`, `.hermes/skills/agent-deep-improvement/SKILL.md`, `.hermes/skills/agent-deep-research/SKILL.md`, `.hermes/skills/agent-deep-review/SKILL.md`, `.hermes/skills/agent-design/SKILL.md` and 131 more

```text
- **Named CLI entry points / commands / flags:** `ORCA skills get orca-linear` [SOURCE: skills/orca-linear/SKILL.md:37]; full command list identical to §1.2 [SOURCE: skill-guides/orca-linear.md:27-136]; docs add `orca skills get orca-linear --json` as the canonical example for that flag [SOURCE: docs/site/content/docs/cli/skills.mdx:45].
- **Obtain / install:** in-file: only `ORCA skills get orca-linear` → install command **UNKNOWN in-file**. Docs (outside brief list): `npx skills add https://github.com/stablyai/orca --skill orca-linear --global`; "Existing `linear-tickets` installs still resolve" [SOURCE: docs/site/content/docs/cli/skills.mdx:26, 133, 136].
- **Hybrid-stub note:** yes [SOURCE: skills/orca-linear/SKILL.md:13].

### 1.7 `orca-per-workspace-env`
```

## Row 71 (ambiguous)
- Doc: `specs/system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/research/iterations/iteration-005.md:28`
- Citation: `spec.md:58`
- Candidates: `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/002-valid-level1/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/003-valid-level2/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/004-valid-level3/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/005-unfilled-placeholders/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/007-valid-anchors/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/008-invalid-anchors/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/009-valid-priority-tags/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/010-valid-evidence/spec.md` and 4650 more

```text
| f-iter005-005 | BUGGED | Reranker model docs are partially stale after the Qwen promotion. Current source sets `DEFAULT_RERANKER_NAME = "Qwen/Qwen3-Reranker-0.6B"` at `registered_embedders.py:255-256` and `_DEFAULT_RERANK_MODEL = DEFAULT_RERANKER_NAME` at `config/config.py:30`. The top-level README agrees in the pipeline table at `README.md:78`, but still says `Cross-encoder rerank ... Local Jina v3 reranker` at `README.md:104`. Git history confirms the later flip in `63fcbb57d7 feat(reranker): flip default jina-v3 -> Qwen3-Reranker-0.6B`. | Replace the stale Jina sentence in the README with…
| f-iter005-006 | DEAD | Public docs point to files/folders that do not exist. `INSTALL_GUIDE.md:350` links `feature_catalog/hybrid-search.md` and `INSTALL_GUIDE.md:367` links `feature_catalog/reranker.md`; actual files are `feature_catalog/05--search-and-ranking/07-hybrid-search-bm25-rrf.md` and `feature_catalog/05--search-and-ranking/08-reranker-cross-encoder.md`. `INSTALL_GUIDE.md:365` and `INSTALL_GUIDE.md:1088` cite `benchmark-2026-05-20-cocoindex-via-sidecar`, but `rg --files .opencode/skills/mcp-coco-index/mcp_server/benchmarks` only found the sidecar artifacts under `benchmark-2026-05-…
| f-iter005-007 | MISSED | Nested `023-deep-research-arc-blind-spots/spec.md:2-3` says this is an 8-packet follow-on arc and `spec.md:58-67` maps only `001` through `008`. But `023-deep-research-arc-blind-spots/graph-metadata.json:6-16` includes an additional `010-public-repo-docs-alignment` chi
```

## Row 73 (ambiguous)
- Doc: `specs/sk-code/001-sk-code-parent/023-sk-code-workflow-subskill-research/research/iterations/iteration-003.md:16`
- Citation: `.opencode/skills/sk-code/code-verify/SKILL.md:124`
- Candidates: `.hermes/skills/agent-ai-council/SKILL.md`, `.hermes/skills/agent-code/SKILL.md`, `.hermes/skills/agent-context/SKILL.md`, `.hermes/skills/agent-debug/SKILL.md`, `.hermes/skills/agent-deep-improvement/SKILL.md`, `.hermes/skills/agent-deep-research/SKILL.md`, `.hermes/skills/agent-deep-review/SKILL.md`, `.hermes/skills/agent-design/SKILL.md` and 131 more

```text
2. `code-debug` has a strong local universal checklist, but its checklist still contains older path vocabulary (`references/webflow/...`, `references/opencode/shared/...`, `assets/universal/checklists/...`) that conflicts with the current surface-axis layout. [SOURCE: .opencode/skills/sk-code/code-debug/assets/universal-debugging_checklist.md:69] [SOURCE: .opencode/skills/sk-code/code-debug/assets/universal-debugging_checklist.md:70] [SOURCE: .opencode/skills/sk-code/code-debug/assets/universal-debugging_checklist.md:90] [SOURCE: .opencode/skills/sk-code/code-debug/SKILL.md:227]
3. `code-debug`'s `SKILL.md` has local-vs-delegated resource drift: Resource Domains list local-looking `assets/webflow-debugging_checklist.md` and `references/webflow-debugging/*`, while References and README point to delegated `../code-webflow/...` paths. [SOURCE: .opencode/skills/sk-code/code-debug/SKILL.md:89] [SOURCE: .opencode/skills/sk-code/code-debug/SKILL.md:91] [SOURCE: .opencode/skills/sk-code/code-debug/SKILL.md:227] [SOURCE: .opencode/skills/sk-code/code-debug/README.md:48]
4. `code-verify` is useful as the non-mutating Phase 3 evidence gate: the registry marks it read/Bash/Grep/Glob only, its contract forbids edits and subagents, and it requires fresh command evidence plus baseline/current/delta/claim-scope reporting before completion claims. [SOURCE: .opencode/skills/sk-code/mode-registry.json:80] [SOURCE: .opencode/skills/sk-code/mode-registry.json:83] [SOURCE: .opencode/skills/sk-code
```

## Row 75 (ambiguous)
- Doc: `specs/system-skill-advisor/025-mcp-decommission-cli-front-door/011-deep-research-swe-2/research/lineages/swe-2-research/iterations/iteration-003.md:33`
- Citation: `acceptance-criteria.md:63`
- Candidates: `.skilled/skills/system-spec-kit/templates/examples/level-2/acceptance-criteria.md`, `.skilled/skills/system-spec-kit/templates/examples/level-3+/acceptance-criteria.md`, `.skilled/skills/system-spec-kit/templates/examples/level-3/acceptance-criteria.md`, `specs/agents/006-restraint-and-routing-gates/acceptance-criteria.md`, `specs/agents/007-orchestrator-inline-authority/acceptance-criteria.md`, `specs/agents/008-orchestrate-external-cli-delegation/acceptance-criteria.md`, `specs/agents/009-turn-closeout-next-steps/001-deep-research/acceptance-criteria.md`, `specs/agents/009-turn-closeout-next-steps/002-decision-and-design/acceptance-criteria.md` and 471 more

```text
**C7. Generated-artifact residue.** The committed trigger index carried stale paths into the renamed directories until regenerated (`f5c55c7eb8` "regenerate the trigger index after the advisor rename") — a generated artifact has to be regenerated, not edited; hand-editing corrupts it. Verified: the current index's 56 `mcp-server` hits are all other skills'/specs' (mcp-server-dir-and-manifest-closure, mcp-servers feature docs); zero for `system-skill-advisor/mcp-server`. Same class: `dist/` outputs — the launcher resolves `runtime/dist/runtime/advisor-server.js`, so a rename invalidates every r…

…24 historical files keep the old name by design" on the non-specs tree. [SOURCE: command:`git show afd10f291f`] [SOURCE: file:manual-testing-playbook/auto-indexing/sanitizer-boundaries.md:73-110] [SOURCE: command:`git grep -l system-skill-advisor/mcp-server` bucketed by directory] [SOURCE: file:008 acceptance-criteria.md:63]…

**C9. Negative-guard residue — references that must keep the name.** `skill-advisor-route-contract.test.cjs:142` asserts `!read(docPath).includes('mcp__system_skill_advisor__')` — the retired id kept in the test precisely to guard its absence; the three inverted contract tests do the same. Phase 007's own sweep rules list this class as exempt. [SOURCE: file:.opencode/commands/doctor/scripts/tests/skill-advisor-route-contract.test.cjs:142] [SOURCE: file:007-docs-and-residue-sweep/spec.md:174-176]
```

## Row 76 (ambiguous)
- Doc: `specs/sk-code/001-sk-code-parent/023-sk-code-workflow-subskill-research/research/iterations/iteration-004.md:51`
- Citation: `.opencode/skills/sk-code/code-quality/SKILL.md:144`
- Candidates: `.hermes/skills/agent-ai-council/SKILL.md`, `.hermes/skills/agent-code/SKILL.md`, `.hermes/skills/agent-context/SKILL.md`, `.hermes/skills/agent-debug/SKILL.md`, `.hermes/skills/agent-deep-improvement/SKILL.md`, `.hermes/skills/agent-deep-research/SKILL.md`, `.hermes/skills/agent-deep-review/SKILL.md`, `.hermes/skills/agent-design/SKILL.md` and 131 more

```text
- .opencode/skills/sk-code/shared/references/phase_detection.md:95
- .opencode/skills/sk-code/code-implement/SKILL.md:157
- .opencode/skills/sk-code/code-quality/SKILL.md:144
- .opencode/skills/sk-code/code-debug/SKILL.md:130
- .opencode/skills/sk-code/code-verify/SKILL.md:144
```
