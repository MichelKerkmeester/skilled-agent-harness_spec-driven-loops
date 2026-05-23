# Iteration 001 — Inventory Pass (D1 Correctness lens)

## Dimension

Correctness. Inventory pass over packets 093, 094, 095, and 096 with emphasis on structural integrity after the `.opencode/{skill,agent,command}` to plural rename, generated `dist/` drift, spec validation, command workflow path bindings, and prompt-equality contract samples.

## Files Reviewed

- `.opencode/skills/deep-review/SKILL.md:1`
- `.opencode/skills/deep-review/references/quick_reference.md:1`
- `.opencode/skills/sk-code-review/references/review_core.md:1`
- `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/002-track-review/review/deep-review-strategy.md:1`
- `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/002-track-review/review/deep-review-config.json:1`
- `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/index-scope-policy.ts:15`
- `.opencode/skills/system-spec-kit/mcp_server/dist/code_graph/lib/index-scope-policy.js:13`
- `.opencode/skills/system-spec-kit/mcp_server/dist/code_graph/tests/code-graph-indexer.vitest.js:248`
- `.opencode/skills/system-spec-kit/mcp_server/dist/code_graph/tests/code-graph-scan.vitest.js:349`
- `.opencode/skills/system-spec-kit/mcp_server/dist/scripts/tests/resource-map-extractor.vitest.js:29`
- `.opencode/skills/system-spec-kit/mcp_server/package.json:9`
- `opencode.json:23`
- `.codex/config.toml:11`
- `.gemini/settings.json:29`
- `.claude/settings.local.json:37`
- `.opencode/commands/speckit/deep-review.md:290`
- `.opencode/commands/speckit/deep-research.md:36`
- `.opencode/commands/speckit/assets/speckit_deep-review_auto.yaml:56`
- `.opencode/commands/speckit/assets/speckit_deep-review_confirm.yaml:56`
- `.opencode/commands/speckit/assets/speckit_deep-research_auto.yaml:67`
- `.opencode/commands/speckit/assets/speckit_deep-research_confirm.yaml:62`
- `.opencode/skill/.advisor-state/skill-graph-generation.json:1`
- `.opencode/install_guides/SET-UP - Opencode Agents.md:6`
- `.opencode/install_guides/SET-UP - AGENTS.md:622`
- `barter/README.md:150`
- `.opencode/skills/sk-code-review/manual_testing_playbook/01--baseline-review-flow/001-small-pr-single-file.md:28`
- `.opencode/skills/sk-code-review/manual_testing_playbook/03--severity-and-evidence-discipline/001-p0-blocker-with-file-line.md:28`
- `.opencode/skills/sk-git/manual_testing_playbook/01--worktree-setup/001-fresh-feature-isolated-worktree.md:28`
- `.opencode/skills/sk-git/manual_testing_playbook/03--safety-refusals/001-no-verify-bypass-refused.md:28`

Command inventory also executed:
- `git show --name-only 40dcf80052`
- `git diff --name-status 40dcf80052~..40dcf80052`
- `git show --name-only 0a3f7f70aa`
- `git diff --name-status 0a3f7f70aa~..0a3f7f70aa`
- `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <packet>` and `--strict` for packets 093, 094, 095, 096
- `python3 .opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py "test" --threshold 0.5`

Inventory category counts:
- Packet 096 (`40dcf80052`): `git diff --name-status` reported `A=92`, `D=38`, `M=6973`, and 4,245 rename records across similarity buckets. Category sweep counted 4,217 skill-path hits, 12 agent-path hits, 68 command-path hits, 4 critical config files, 2,676 code-ish files, and 2,325 docs/spec/prose files.
- Packets 093/094 (`0a3f7f70aa`): `A=67`, `M=611`; category sweep counted 651 `manual_testing_playbook` files, 19 `sk-code-review` playbook files, 23 `sk-git` playbook files, 21 sk-doc/create-reference files, and 25 spec-doc files.
- Packet 095: no independent commit was found by `git log --grep='095|sk-code-review playbook execution' -- .opencode/specs/skilled-agent-orchestration/095-sk-code-review-playbook-execution`; the only matching history entry was packet 096's rename commit touching the folder.

## Findings by Severity

### P0

No confirmed P0 in this inventory pass.

### P1

#### P1-001 [P1] Runtime `dist/` code-graph scope still uses singular `.opencode` globs

- Dimension: correctness
- Evidence: `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/index-scope-policy.ts:15` now excludes `**/.opencode/skills/**`, `:16` excludes `agents`, and `:17` excludes `commands`, but `.opencode/skills/system-spec-kit/mcp_server/dist/code_graph/lib/index-scope-policy.js:13-15` still excludes singular `**/.opencode/skill/**`, `agent`, and `command`.
- Runtime tie: `opencode.json:23`, `.codex/config.toml:11`, `.gemini/settings.json:29`, and `.opencode/skills/system-spec-kit/mcp_server/package.json:9` all route the MCP/context server through `dist/context-server.js`, so the stale generated code is on the live path unless a different unpublished runtime entry is used.
- Impact: after packet 096, the running code graph can apply the wrong scope policy to plural `.opencode/skills`, `.opencode/agents`, and `.opencode/commands` paths. That can silently index or skip the wrong surfaces relative to the TypeScript source and the rename spec.
- Finding class: cross-consumer
- Scope proof: dist test files also retain singular path assumptions at `.opencode/skills/system-spec-kit/mcp_server/dist/code_graph/tests/code-graph-indexer.vitest.js:248` and `.opencode/skills/system-spec-kit/mcp_server/dist/code_graph/tests/code-graph-scan.vitest.js:349`, while the source policy file has plural paths.
- Recommendation: rebuild `mcp_server/dist` from the updated TypeScript source and run the code-graph test subset against generated JS or remove generated artifacts from the shipped surface.

```json
{
  "claim": "The live MCP/context-server path can still use singular code-graph scope globs after the plural rename because generated dist output was not rebuilt.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/mcp_server/code_graph/lib/index-scope-policy.ts:15",
    ".opencode/skills/system-spec-kit/mcp_server/dist/code_graph/lib/index-scope-policy.js:13",
    "opencode.json:23",
    ".codex/config.toml:11",
    ".gemini/settings.json:29",
    ".opencode/skills/system-spec-kit/mcp_server/package.json:9"
  ],
  "counterevidenceSought": "Searched runtime entry points and config for direct TypeScript/source imports or non-dist code-graph execution paths; configs and package exports point at dist/context-server.js.",
  "alternativeExplanation": "The stale dist files might be ignored if every runtime transpiles TypeScript from source before launch, but the checked OpenCode, Codex, Gemini, and package paths do not show that.",
  "finalSeverity": "P1",
  "confidence": 0.88,
  "downgradeTrigger": "Downgrade to P2 if maintainers prove dist artifacts are never consumed by any supported runtime or CI path."
}
```

#### P1-002 [P1] Canonical deep-review/deep-research command workflows point to non-existent `sk-deep-*` skill paths

- Dimension: correctness
- Evidence: `.opencode/commands/speckit/assets/speckit_deep-review_auto.yaml:56-64` and `.opencode/commands/speckit/assets/speckit_deep-review_confirm.yaml:56-64` reference `sk-deep-review` and `.opencode/skills/sk-deep-review/...`; `.opencode/commands/speckit/assets/speckit_deep-research_auto.yaml:67-76` and `.opencode/commands/speckit/assets/speckit_deep-research_confirm.yaml:62` do the same for `sk-deep-research`.
- Corroboration: `.opencode/commands/speckit/deep-review.md:290-296` and `.opencode/commands/speckit/deep-research.md:36` also cite `.opencode/skills/sk-deep-review` / `.opencode/skills/sk-deep-research`, while the actual loaded skill folders are `.opencode/skills/deep-review/` and `.opencode/skills/deep-research/`.
- Impact: fresh command-owned deep-review/deep-research runs can fail to load templates, reducers, references, or skill metadata from the canonical YAML route. This review iteration is running from a rendered prompt pack, but the command source still contains broken path bindings.
- Finding class: cross-consumer
- Scope proof: both auto and confirm YAMLs for review and research contain the same stale family of paths, including template and reducer command paths.
- Recommendation: replace `sk-deep-review` with `deep-review` and `sk-deep-research` with `deep-research` across command markdown and YAML assets, then run a dry-run init for both `/speckit:deep-review:auto` and `/speckit:deep-research:auto`.

```json
{
  "claim": "The command-owned deep-review and deep-research workflows still reference old `sk-deep-*` skill folders that do not exist under the pluralized skill tree.",
  "evidenceRefs": [
    ".opencode/commands/speckit/assets/speckit_deep-review_auto.yaml:56",
    ".opencode/commands/speckit/assets/speckit_deep-review_confirm.yaml:56",
    ".opencode/commands/speckit/assets/speckit_deep-research_auto.yaml:67",
    ".opencode/commands/speckit/assets/speckit_deep-research_confirm.yaml:62",
    ".opencode/commands/speckit/deep-review.md:290",
    ".opencode/commands/speckit/deep-research.md:36"
  ],
  "counterevidenceSought": "Loaded the actual skill path for this iteration and confirmed the present folder is `.opencode/skills/deep-review/`, not `.opencode/skills/sk-deep-review/`; the same naming applies to deep-research.",
  "alternativeExplanation": "A higher-level dispatcher could patch these paths before execution, but the YAML command assets themselves remain stale and are documented as the command-owned source of truth.",
  "finalSeverity": "P1",
  "confidence": 0.91,
  "downgradeTrigger": "Downgrade to P2 if the command parser demonstrably ignores all affected YAML and markdown path fields."
}
```

#### P1-003 [P1] Root `.opencode/skill/` survivor leaves stale advisor state after the plural rename

- Dimension: correctness
- Evidence: root discovery shows `.opencode/skill` still exists alongside `.opencode/skills`; `.opencode/skill/.advisor-state/skill-graph-generation.json:1-7` records `reason: "post-index-assertion-failed"` and `state: "stale"`.
- Impact: packet 096's structural-integrity objective was to eliminate root singular discovery surfaces. A remaining root `.opencode/skill/` directory can be discovered by legacy scans and, in this case, already contains stale advisor state from after the rename.
- Finding class: instance-only
- Scope proof: `find .opencode -maxdepth 1` returned both `.opencode/skill` and `.opencode/skills`; the only root singular content found was `.advisor-state/skill-graph-generation.json`, so this is not a broad old skill tree survivor.
- Recommendation: migrate or delete the stale `.opencode/skill/.advisor-state` state, ensure advisor state lives under the plural path or a neutral cache path, and add a root singular-directory guard to rename validation.

```json
{
  "claim": "The root singular `.opencode/skill/` discovery surface still exists after packet 096 and contains stale advisor state.",
  "evidenceRefs": [
    ".opencode/skill/.advisor-state/skill-graph-generation.json:1",
    ".opencode/skill/.advisor-state/skill-graph-generation.json:5",
    ".opencode/skill/.advisor-state/skill-graph-generation.json:7"
  ],
  "counterevidenceSought": "Checked root `.opencode` directory entries and confirmed plural `.opencode/skills` exists but singular `.opencode/skill` was not removed.",
  "alternativeExplanation": "The survivor might be treated as a cache rather than a skill source, but its location still matches the forbidden root singular directory pattern and records a stale post-index assertion.",
  "finalSeverity": "P1",
  "confidence": 0.82,
  "downgradeTrigger": "Downgrade to P2 if advisor state is intentionally documented as living under `.opencode/skill/.advisor-state` and all discovery code excludes it."
}
```

#### P1-004 [P1] Packet 096 fails the required spec validation gate

- Dimension: correctness
- Evidence: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural` exits `2` with `SPEC_DOC_SUFFICIENCY: 1 spec_doc_sufficiency issue(s) found`; `--strict` also exits `2`. The packet root is `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/spec.md:1`.
- Impact: the shipped rename packet does not satisfy the framework's own validation gate. Given packet 096 was the largest and riskiest change in scope, this blocks treating the track as fully verified even before deeper runtime checks.
- Finding class: matrix/evidence
- Scope proof: validation passed for 093, 094, and 095 in both normal and strict mode; only 096 failed in this inventory pass.
- Recommendation: run the validator in diagnostic mode or inspect the phase-parent/child spec sufficiency requirements, patch the 096 spec docs, then rerun `validate.sh` and `validate.sh --strict`.

```json
{
  "claim": "Packet 096 fails the required spec validation gate while the other reviewed packets pass.",
  "evidenceRefs": [
    ".opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/spec.md:1",
    ".opencode/specs/skilled-agent-orchestration/093-testing-playbooks-code-review-and-git/spec.md:1",
    ".opencode/specs/skilled-agent-orchestration/094-playbook-prompt-naturalness/spec.md:1",
    ".opencode/specs/skilled-agent-orchestration/095-sk-code-review-playbook-execution/spec.md:1"
  ],
  "counterevidenceSought": "Ran both normal and strict validation for all four packets; 093, 094, and 095 passed while 096 failed both runs.",
  "alternativeExplanation": "The sufficiency issue may be documentation-only rather than runtime-breaking, but validation failure is a mandatory gate failure for this packet family.",
  "finalSeverity": "P1",
  "confidence": 0.86,
  "downgradeTrigger": "Downgrade to P2 only if the validator is proven wrong for phase-parent rename packets and the validation rule is corrected or waived in the framework."
}
```

### P2

#### P2-001 [P2] User-facing setup docs still teach singular `.opencode/agent/` and `.opencode/command/` paths

- Dimension: correctness
- Evidence: `.opencode/install_guides/SET-UP - Opencode Agents.md:6` scopes the guide to `.opencode/agent/`, and many examples still use that singular path; `.opencode/install_guides/SET-UP - AGENTS.md:622` says commands are defined in `.opencode/command/`; `barter/README.md:150-152` diagrams singular `skill`, `command`, and `agent` folders.
- Impact: setup guidance can steer users toward paths that no longer match the canonical root plural directories.
- Recommendation: update install guides and shared Barter architecture docs to plural paths, while leaving intentionally separate `barter/coder` sibling-repo references alone unless that repo is brought into scope.

#### P2-002 [P2] Generated dist tests and resource-map fixtures retain singular path fixtures

- Dimension: correctness
- Evidence: `.opencode/skills/system-spec-kit/mcp_server/dist/code_graph/tests/code-graph-indexer.vitest.js:248` expects `**/.opencode/skill/**`; `.opencode/skills/system-spec-kit/mcp_server/dist/scripts/tests/resource-map-extractor.vitest.js:29` uses `.opencode/command/spec_kit/deep-review.md` and `:31` uses `.opencode/skill/sk-deep-review/SKILL.md`.
- Impact: these generated fixtures can either fail under pluralized expectations or continue testing the old world if dist tests are executed directly.
- Recommendation: rebuild dist test outputs from updated source and add a grep guard that fails on singular root `.opencode/(skill|agent|command)/` literals outside archived fixtures and intentionally scoped sibling repos.

## Traceability Checks

- `spec_code`: partial. Packet 096's spec intent is the plural rename, but runtime generated code and command YAML still contain singular/stale skill path bindings.
- `checklist_evidence`: fail for this pass because 096 validation fails; 093, 094, and 095 pass normal and strict validation. 094's Level 2 checklist metadata validates.
- `skill_agent`: partial. Four sk-code-review/sk-git playbook samples expose prompt-equality requirement lines and naturalized prompts; exact table-cell equality across the full 093/094 playbook matrix is deferred to a traceability pass.
- `agent_cross_runtime`: partial. OpenCode, Codex, Gemini, and Claude config paths sampled use plural `.opencode/skills` runtime paths, but root `.opencode/skill` survivor and stale command assets prevent a clean pass.
- `feature_catalog_code`: not applicable in this inventory pass.
- `playbook_capability`: partial. Sampled playbooks preserve the prompt-equality requirement text, but full 16-playbook RCAF naturalization integrity remains open.

Quality gates:
- Evidence: pass for inventory; every P1 includes concrete file evidence and command corroboration.
- Scope: pass; no review-target files were modified.
- Coverage: partial; iteration 1 sampled all requested hot-zone categories but did not complete deep adjudication.

## Verdict

CONDITIONAL, `hasAdvisories=true`.

No P0 was confirmed. Active P1s mean the track should not be treated as clean: generated runtime code is stale, command workflows reference non-existent `sk-deep-*` paths, root singular `.opencode/skill` survived with stale advisor state, and packet 096 fails validation.

## Next Dimension

Iteration 2 should stay on D1 correctness for a deep pass on packet 096 rename impact. Prioritize confirming live runtime import paths for `dist/`, replacing command YAML `sk-deep-*` paths, establishing whether `.opencode/skill/.advisor-state` is intentional or residue, and running a case-insensitive singular-path grep with explicit allowlist buckets.
