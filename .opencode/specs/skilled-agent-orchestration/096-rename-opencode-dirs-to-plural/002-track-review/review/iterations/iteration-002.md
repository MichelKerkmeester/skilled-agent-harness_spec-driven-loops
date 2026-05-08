# Iteration 002 - Deep correctness pass on packet 096 rename impact

## Dimension

Correctness, deep pass on packet 096 rename impact.

This pass adjudicated the four active P1 findings from iteration 1, traced whether generated `dist/` JavaScript is live at runtime, localized the packet 096 validator failure, bucketed case-insensitive singular `.opencode/{skill,agent,command}/` hits, and sampled source-vs-generated parity for the requested `mcp_server` directories.

## Files Reviewed

- `opencode.json:23`
- `.codex/config.toml:11`
- `.gemini/settings.json:29`
- `.claude/settings.local.json:37`
- `.opencode/skills/system-spec-kit/mcp_server/package.json:9`
- `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/index-scope-policy.ts:15`
- `.opencode/skills/system-spec-kit/mcp_server/dist/code_graph/lib/index-scope-policy.js:13`
- `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/gold-query-verifier.ts:36`
- `.opencode/skills/system-spec-kit/mcp_server/dist/code_graph/lib/gold-query-verifier.js:27`
- `.opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml:56`
- `.opencode/commands/spec_kit/assets/spec_kit_deep-review_confirm.yaml:56`
- `.opencode/commands/spec_kit/assets/spec_kit_deep-research_auto.yaml:67`
- `.opencode/commands/spec_kit/assets/spec_kit_deep-research_confirm.yaml:53`
- `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/freshness/generation.ts:12`
- `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/daemon/watcher.ts:276`
- `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/daemon/lease.ts:45`
- `.opencode/skills/system-spec-kit/scripts/spec/validate.sh:20`
- `.opencode/skills/system-spec-kit/scripts/lib/validator-registry.json:75`
- `.opencode/skills/system-spec-kit/mcp_server/lib/validation/spec-doc-structure.ts:363`
- `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/spec.md:55`
- `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/001-rename-opencode-dirs/004-symlinks/spec.md:136`
- `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/001-rename-opencode-dirs/004-symlinks/implementation-summary.md:31`
- `.opencode/install_guides/SET-UP - Code Graph.md:6`
- `.opencode/install_guides/SET-UP - Skill Advisor.md:6`
- `.opencode/install_guides/SET-UP - Skill Creation.md:82`
- `barter/setup-project.sh:414`
- `barter/init-repository.sh:38`

Commands and sweeps executed:

- `rg -i 'sk-deep-(review|research)'` excluding `barter/coder/`, `barter/repositories/`, `z_archive/`, `z_future/`, `review/iter-archive/`, and `review-research-paths*`.
- `rg -il '\.opencode/(skill|agent|command)/'` with explicit buckets for active violations, spec/review history, vendored roots, generated outputs, and intentional compatibility helpers.
- `validate.sh --strict` for packet 096 parent and children `001-skills`, `002-agents`, `003-commands`, `004-symlinks`.
- Direct JSON diagnostics from `dist/lib/validation/spec-doc-structure.js --rule SPEC_DOC_SUFFICIENCY`.

## Findings by Severity

### P0

#### P1-001 [P0] Live runtime uses stale generated code-graph scope globs after plural rename

- Claim: The live MCP/context-server runtime executes generated `dist/` JavaScript, and that generated code still contains singular `.opencode/skill`, `.opencode/agent`, and `.opencode/command` scope globs.
- Evidence refs: `opencode.json:23`, `.codex/config.toml:11`, `.gemini/settings.json:29`, `.claude/settings.local.json:37`, `.opencode/skills/system-spec-kit/mcp_server/package.json:9`, `.opencode/skills/system-spec-kit/mcp_server/dist/code_graph/lib/index-scope-policy.js:13`.
- Evidence: OpenCode, Codex, Gemini, Claude hooks, package `main`, package `exports`, package `bin`, and `npm start` all route through `dist/*.js`; no checked runtime entry transpiles TypeScript source before launch. Source is plural at `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/index-scope-policy.ts:15-17`, but live generated JS is singular at `dist/code_graph/lib/index-scope-policy.js:13-15`.
- Counterevidence sought: Checked config entrypoints and package metadata for source `.ts`, `tsx`, or non-dist imports. None were present on the sampled live paths.
- Alternative explanation: A local development test runner may execute TypeScript source directly, but the configured runtime servers and hooks do not.
- Final severity: P0, promoted per iteration rule because `dist/` is live.
- Confidence: 0.94.
- Downgrade trigger: Downgrade to P1 only if every supported runtime is changed to execute rebuilt plural output or TypeScript source before code-graph scan is available.
- Finding class: cross-consumer.
- Recommendation: Rebuild `mcp_server/dist` from TypeScript and add a release grep guard that blocks singular `.opencode/(skill|agent|command)/` literals in live generated runtime paths.

### P1

#### P1-002 [P1] Command-owned deep-review/deep-research YAML reads non-existent `sk-deep-*` skill paths

- Claim: The command workflow assets contain live runtime fields that reference `sk-deep-review` and `sk-deep-research`, while the actual skill folders are `.opencode/skills/deep-review/` and `.opencode/skills/deep-research/`.
- Evidence refs: `.opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml:56`, `.opencode/commands/spec_kit/assets/spec_kit_deep-review_confirm.yaml:56`, `.opencode/commands/spec_kit/assets/spec_kit_deep-research_auto.yaml:67`, `.opencode/commands/spec_kit/assets/spec_kit_deep-research_confirm.yaml:53`, `.opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml:655`, `.opencode/commands/spec_kit/assets/spec_kit_deep-research_auto.yaml:743`.
- Evidence: The grep found four live workflow YAML files. The fields are not just prose: `skill_reference.skill_md`, `references`, `templates`, `template_path`, and reducer `command` entries point at `.opencode/skills/sk-deep-*`, and the same YAML later renders prompt packs and runs reducers from these paths.
- Counterevidence sought: Searched for `sk-deep-(review|research)` excluding vendored roots and archived paths. Hits outside the YAML were doc/live-instruction, fixtures, or spec history; the YAML remains the live workflow path.
- Alternative explanation: The current prompt pack may have been rendered by a caller that substituted the correct paths manually. That does not make the command-owned YAML safe for fresh runs.
- Final severity: P1.
- Confidence: 0.93.
- Downgrade trigger: Downgrade to P2 only if the command runner demonstrably ignores all affected YAML path fields and resolves skill assets exclusively through a separate canonical resolver.
- Finding class: cross-consumer.
- Recommendation: Replace `sk-deep-review` and `sk-deep-research` with `deep-review` and `deep-research` in the command YAML and command docs, then dry-run both `/spec_kit:deep-review:auto` and `/spec_kit:deep-research:auto`.

#### P1-003 [P1] Skill advisor source still writes `.opencode/skill/.advisor-state`

- Claim: `.opencode/skill/.advisor-state` is not only leftover disk state; source code still writes advisor freshness and daemon lease state into the singular root path.
- Evidence refs: `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/freshness/generation.ts:12`, `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/daemon/watcher.ts:276`, `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/daemon/lease.ts:45`, `.opencode/skill/.advisor-state/skill-graph-generation.json:1`.
- Evidence: `GENERATION_RELATIVE_PATH` is `join('.opencode', 'skill', '.advisor-state', 'skill-graph-generation.json')`; daemon quarantine and lease DB paths also use `.opencode/skill/.advisor-state`. This proves the root singular survivor is source-backed rename residue, not a one-time cleanup artifact.
- Counterevidence sought: Searched `.opencode/skills/`, the advisor script path, and available scripts for `.advisor-state` and `.opencode/skill/`. Plural `.opencode/skills/.advisor-state` appears only in docs/stress fixtures; active source still has singular writes.
- Alternative explanation: The singular path could be an intentional neutral cache location, but the name is not neutral and conflicts with the packet 096 root singular-directory removal objective.
- Final severity: P1.
- Confidence: 0.91.
- Downgrade trigger: Downgrade to P2 only if maintainers explicitly document `.opencode/skill/.advisor-state` as a stable compatibility cache and add discovery guards excluding it.
- Finding class: cross-consumer.
- Recommendation: Move advisor state to `.opencode/skills/.advisor-state` or a neutral cache path, migrate/delete existing singular state, and update tests plus docs together.

#### P1-004 [P1] Packet 096 validation failure localizes to parent and `004-symlinks` anchor/doc sufficiency defects

- Claim: Packet 096 still fails strict validation because the phase parent and `004-symlinks` child have malformed spec anchors and placeholder implementation-summary content.
- Evidence refs: `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/spec.md:55`, `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/001-rename-opencode-dirs/004-symlinks/spec.md:136`, `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/001-rename-opencode-dirs/004-symlinks/implementation-summary.md:31`, `.opencode/skills/system-spec-kit/mcp_server/lib/validation/spec-doc-structure.ts:363`.
- Evidence: Strict validation passes for children `001-skills`, `002-agents`, and `003-commands`. The parent fails `SPEC_DOC_SUFFICIENCY` with `spec.md: line 105: unclosed anchor 'dependencies'`. Child `004-symlinks` fails `ANCHORS_VALID` and `SPEC_DOC_SUFFICIENCY`; JSON diagnostics report orphaned closing anchors at `spec.md` lines 151, 152, and 189. Its implementation summary is still a pre-implementation placeholder with `[Filled post-execution.]` and template placeholders at lines 31, 50, 56, 64, 74, 84, and 91.
- Counterevidence sought: Ran `validate.sh --strict` across the parent and all four children, then called `spec-doc-structure.js` directly for JSON diagnostics.
- Alternative explanation: The validator may be stricter than older phase packets expected, but the direct anchor parse failures and placeholder implementation summary are concrete doc defects.
- Final severity: P1.
- Confidence: 0.95.
- Downgrade trigger: Downgrade to P2 only after parent and `004-symlinks` strict validation pass or the validator is changed with an explicit compatibility waiver.
- Finding class: matrix/evidence.
- Recommendation: Repair the parent `dependencies` anchor closure, fix `004-symlinks` question/NFR/reliability anchor structure, fill implementation-summary evidence, then rerun recursive strict validation.

### P2

#### P2-001 [P2] User-facing setup docs still teach singular `.opencode/agent/` and `.opencode/command/` paths

- Claim: Active setup docs still instruct users to create, inspect, or troubleshoot singular directories after the plural rename.
- Evidence refs: `.opencode/install_guides/SET-UP - Opencode Agents.md:6`, `.opencode/install_guides/SET-UP - AGENTS.md:622`, `barter/README.md:150`.
- Evidence: Existing P2 remains valid. The case-insensitive sweep confirmed these active docs are still in the violation bucket.
- Finding class: matrix/evidence.
- Recommendation: Update the setup docs to plural paths and leave archived/spec-history examples alone.

#### P2-002 [P2] Generated dist tests and fixtures retain singular path fixtures

- Claim: Generated test/fixture outputs retain singular path literals that can preserve old-world assumptions if dist tests are run directly.
- Evidence refs: `.opencode/skills/system-spec-kit/mcp_server/dist/code_graph/tests/code-graph-indexer.vitest.js:248`, `.opencode/skills/system-spec-kit/mcp_server/dist/code_graph/tests/code-graph-scan.vitest.js:349`, `.opencode/skills/system-spec-kit/mcp_server/dist/scripts/tests/resource-map-extractor.vitest.js:29`.
- Evidence: The singular sweep found 63 generated/non-source build hits, including 52 under `mcp_server/dist`. This remains advisory compared with the live runtime `dist` P0 because many generated hits are fixtures, rotated data, or declarations.
- Finding class: test-isolation.
- Recommendation: Rebuild generated tests and fixtures after the source rename, and decide which fixtures intentionally exercise legacy compatibility.

#### P2-003 [P2] Additional active setup and Barter helper files still carry singular root paths

- Claim: The case-insensitive sweep found active non-archived singular path hits not fully covered by P2-001, including doctor setup guides, skill-creation setup guidance, and Barter helper scripts.
- Evidence refs: `.opencode/install_guides/SET-UP - Code Graph.md:6`, `.opencode/install_guides/SET-UP - Skill Advisor.md:6`, `.opencode/install_guides/SET-UP - Skill Creation.md:82`, `barter/setup-project.sh:414`, `barter/init-repository.sh:38`, `barter/install.sh:262`.
- Evidence: Bucket counts after excluding `.git`, `node_modules`, venvs, `barter/coder/`, `barter/repositories/`, and caches: violations 11, archived/spec-history 497, vendored 0, generated 63, review-research-paths intentional 0. The 11 active violations are five `.opencode/install_guides/*` docs plus six root `barter/*` docs/scripts.
- Finding class: matrix/evidence.
- Recommendation: Treat this as a documentation/helper-script cleanup workstream separate from runtime blockers; update active install guides and root Barter scripts or explicitly classify Barter root as out of scope.

## Traceability Checks

- `spec_code`: fail. Packet 096 claims zero singular references and strict recursive validation as success criteria, but live runtime generated code, advisor source, command workflow YAML, and active docs/scripts still contain singular or stale skill paths.
- `checklist_evidence`: fail. Parent packet 096 and child `004-symlinks` fail strict validation; `001-skills`, `002-agents`, and `003-commands` pass.
- `skill_agent`: partial. Deep review and deep research skills exist at plural `.opencode/skills/deep-*`, but command YAML, active agent instructions, and install guides still cite `sk-deep-*`.
- `agent_cross_runtime`: partial. Cross-runtime MCP config paths use `.opencode/skills/system-spec-kit/.../dist`, proving live plural skill-root pathing for server launch, but the launched generated JS still contains singular scope policy.
- `feature_catalog_code`: not applicable for this correctness pass.
- `playbook_capability`: not applicable for this correctness pass.

Singular-path bucket summary:

| Bucket | Count | Notes |
|---|---:|---|
| Violation | 11 | Active setup docs and root Barter docs/scripts. |
| Archived/spec history | 497 | Spec docs, review prompts/logs/deltas, archived/future research. |
| Vendored | 0 | `barter/coder/` and `barter/repositories/` excluded. |
| Generated | 63 | 52 under `mcp_server/dist`, plus generated `scripts/dist` and `shared/dist` docs/code. |
| Review-research-paths intentional | 0 | No singular-path hits in the compatibility helper. |

Generated-vs-source parity sample:

- `code_graph/lib/index-scope-policy`: source plural at lines 15-17; `dist` singular at lines 13-15.
- `code_graph/lib/gold-query-verifier`: source comment plural at line 36; `dist` comment singular at line 27.
- `lib/deep-loop/executor-audit`, `lib/deep-loop/prompt-pack`, and `lib/spec/is-phase-parent`: no singular `.opencode/{skill,agent,command}/` or `sk-deep-*` hits in source or dist for the sampled pattern.

## Verdict

FAIL, `hasAdvisories=true`.

The deep correctness pass converged, but the verdict is fail because one existing P1 escalated to P0 on live runtime proof. The remaining P1s are still required fixes: live command workflow paths are stale, advisor state writes to a singular root path, and packet 096 validation fails at the parent plus `004-symlinks`.

## Next Dimension

Iteration 3 should move to D2 Security: hooks integrity, sandbox/auth assumptions, environment variable precedence, and workflow-resolved `spec_folder` write authority.
