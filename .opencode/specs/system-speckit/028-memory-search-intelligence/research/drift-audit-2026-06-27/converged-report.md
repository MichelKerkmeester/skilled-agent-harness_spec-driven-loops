# 028 Drift Audit — Converged Report

Direct-orchestration deep research, **50 iterations**, read-only executors (harness owned all writes).
Executors: kimi `k2p7` + gpt-5.5-fast (iters 1-30 also used mimo + deepseek before the mid-run switch to kimi/gpt-5.5-high only).

## Totals
- Raw findings: **206** across 50 iterations
- Converged (deduped by file+type): **175** distinct issues
- Cross-model corroborated (same file+type from >=2 models): **13**
- Raw severity: P0 7 / P1 111 / P2 88
- Converged severity: **P0 6 / P1 91 / P2 78**

> Every finding is a HYPOTHESIS produced by an LLM executor with file:line evidence. Confirm against the real file before acting — especially before any fix.

## P0 — converged
### `.opencode/commands/doctor/_routes.yaml` (76-93, 30-38, 63-69) — contradiction
- **/doctor code-graph route declares read-only but advertises mutating operations**
- evidence: _routes.yaml:84 says `mutating: read-only` and line 85 says 'never scans or writes the index'; yet line 81 allows `--operation=rescan|prune-excludes|repair-nodes|recover-sqlite-corruption|rollback-bad-apply` and line 83 allows `--confirm`, all of which invoke `code_graph_apply` (tool-schemas.ts:149-165), a destructive apply-mode tool. The target's `mcp_tools` list (lines 86-92) also omits `code_graph_apply`.
- fix: Either reclassify target as `mutating: mutates` and add `mcp__mk_code_index__code_graph_apply`/`code_graph_scan` to mcp_tools, or remove the mutating `--operation` values from `allowed_flags` to match the read-only Phase A contract.
- found by: kimi, deepseek (iters 1, 12, 29) — CORROBORATED

### `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/graph-metadata.json` (6-55) — drift
- **Phase parent 005 carries full Level 3 heavy-doc stack + missing migrated flag**
- evidence: graph-metadata.json lists 44 children_ids (lines 6-51) confirming phase parent; directory contains plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md, handover.md, before-vs-after.md, benchmark-and-test-status.md, SUMMARY.md — all heavy docs at parent level; description.json claims 'level': '3'; no 'migrated' field in graph-metadata.json. Policy at references/structure/phase_definitions.md:86-88: 'Heavy docs (plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md) live exclusively in the phase children.'
- fix: Move heavy docs into the appropriate phase children (or a new consolidating child); add 'migrated': true to graph-metadata.json; recategorize description.json as a phase parent
- found by: deepseek (iters 21)

### `.opencode/commands/doctor/assets/doctor_causal-graph.yaml` (78-89) — contradiction
- **Causal-graph doctor mutation boundaries invert the canonical DB path**
- evidence: allowed_targets lists "mcp_server/database/context-index__*.sqlite" as the active profile DB for causal_edges; forbidden_targets lists "mcp_server/database/context-index.sqlite*" as "legacy singleton DB path and snapshots". profile.ts:77-78 shows the canonical DB is context-index.sqlite, and causal_edges live in that canonical DB.
- fix: Allow context-index.sqlite* and vectors/context-vectors__*.sqlite*; forbid the retired context-index__*.sqlite pattern.
- found by: kimi (iters 24)

### `.codex/agents/ai-council.toml` (6) — misalignment
- **ai-council agent re-pinned to gpt-5.4 after cli-codex gpt-5.5 lock**
- evidence: `.codex/agents/ai-council.toml:6` reads `model = "gpt-5.4"`; git shows that pin was set 2026-05-21 (`e40c454235`), after the cli-codex gpt-5.5 lock on 2026-05-07, yet still targets the wrong model.
- fix: Update `.codex/agents/ai-council.toml:6` to `model = "gpt-5.5"`.
- found by: kimi (iters 31)

### `.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts` (13-17) — misalignment
- **Fallback router type expects model-level quota_pool that does not exist**
- evidence: `export type ModelProfile = { readonly id: string; readonly quota_pool: string; readonly fallback_target: string | null; };`
- fix: Update ModelProfile to match model_profiles.json schema: derive the effective pool from `primary_quota_pool` and `executors[].quota_pool`, not a top-level `quota_pool` field.
- found by: kimi (iters 43)

### `.opencode/skills/deep-loop-runtime/tests/unit/fallback-router.vitest.ts` (9-14) — drift
- **Fallback router tests exercise stale cli-devin registry**
- evidence: `{ id: 'deepseek-v4-pro', quota_pool: 'cognition-pro', fallback_target: null }`, plus `swe-1.6`, `kimi-k2.6`, `qwen3.6` — none of which match the current model_profiles.json.
- fix: Rewrite the test fixture registry to use current model_profiles.json entries and pools (deepseek-api, opencode-go, kimi-for-coding, minimax-token-plan, xiaomi-token-plan).
- found by: kimi (iters 43)

## P1 — converged, grouped by surface area
### 028 spec tree (17)
- `.opencode/specs/system-spec-kit/028-memory-search-intelligence/changelog/007-dark-flag-graduation/changelog-007-root.md`:62 **contradiction** — 007-root claims bitemporal wiring is still pending, but 011 follow-up says it was done
- `.opencode/specs/system-spec-kit/028-memory-search-intelligence/changelog/007-dark-flag-graduation/changelog-007-010-dark-flag-validation.md`:62 **contradiction** — 010 validation says bitemporal wiring unconfirmed, but 011 says it was done
- `.opencode/specs/system-spec-kit/028-memory-search-intelligence/graph-metadata.json`:65 **drift** — Dead relative key_file path in root graph-metadata
- `.opencode/specs/system-spec-kit/028-memory-search-intelligence/006-review-remediation/graph-metadata.json`:44 **drift** — Dead relative key_file path in review-remediation graph-metadata
- `.opencode/specs/system-spec-kit/028-memory-search-intelligence/006-review-remediation/006-review-record-packet-type/spec.md`:56 **contradiction** — Review-record packet carries waived docs
- `.opencode/specs/system-spec-kit/028-memory-search-intelligence/007-dark-flag-graduation/benchmark-and-test-status.md`:1 **drift** — Non-migrated phase parent contains heavy doc
- `.opencode/specs/system-spec-kit/028-memory-search-intelligence/handover.md` **drift** — 028-root phase parent carries heavy/non-canonical docs violating lean trio
- `.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory/graph-metadata.json`:1-3 **drift** — 5 of 8 child phase parents missing migrated flag (inconsistent with 000/006/028-root)
- `.opencode/specs/system-spec-kit/028-memory-search-intelligence/007-dark-flag-graduation/graph-metadata.json`:1-5 **drift** — 007 phase parent has non-trio benchmark doc + missing migrated flag
- `.opencode/specs/system-spec-kit/028-memory-search-intelligence/graph-metadata.json`:65 **misalignment** — Parent 028 graph-metadata uses bare lib/ path that does not resolve at repo root
- `.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory/001-corpus-reindex-gate-zero/graph-metadata.json`:44-48 **misalignment** — Mixed absolute-vs-bare-lib conventions in key_files
- `.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory/007-bitemporal-window/graph-metadata.json`:44-50 **misalignment** — Same file represented twice with different path conventions
- `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/033-identity-resolver-merge-safety/graph-metadata.json`:54 **misalignment** — Entity path reverts to bare lib/ while sibling entities use absolute paths
- `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/034-scoped-backfill-boundary/checklist.md`:3 **contradiction** — Completed child checklist still declares 'Pending (scaffold, not yet verified)'
- `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/035-idempotent-writes-cache-upsert/checklist.md`:3 **contradiction** — Completed child checklist still declares 'Pending (scaffold, not yet verified)'
- `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/036-metadata-validator-status-enum/checklist.md`:3 **contradiction** — Completed child checklist still declares 'Pending (scaffold, not yet verified)'
- `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/029-vague-query-model-benchmark/checklist.md`:3 **contradiction** — Completed child checklist still declares 'Pending (run in progress)'

### commands/doctor (16)
- `.opencode/commands/doctor/_routes.yaml`:121-133 **misalignment** — skill-advisor route declares mutates but exposes a --dry-run preview flag _(x4 models)_
- `.opencode/commands/doctor/assets/doctor_causal-graph.yaml`:57-60 **misalignment** — causal-graph YAML user_inputs missing no_snapshot and dry_run fields declared in route allowed_flags _(x2 models)_
- `.opencode/commands/doctor/update.md`:30-31 **undocumented** — /doctor:update binds skip_status_check without a flag
- `.opencode/commands/doctor/assets/doctor_causal-graph.yaml`:174 **drift** — Causal-graph doctor fail-fast text references retired missing-DB glob
- `.opencode/commands/doctor/speckit.md`:4 **contradiction** — Read-only code-graph route can access scan/apply tools from router union
- `.opencode/commands/doctor/update.md`:4 **misalignment** — /doctor:update missing L5 Lifecycle + L7 Maintenance tools
- `.opencode/commands/doctor/assets/doctor_memory.yaml`:67,122 **contradiction** — Memory doctor allowed targets name retired profile DB while doc text names canonical DB
- `.opencode/commands/doctor/assets/doctor_update.yaml`:102-103 **misalignment** — Update doctor allowed targets omit canonical DB and vector shard
- `.opencode/commands/doctor/assets/doctor_memory.yaml`:50-53 **misalignment** — memory YAML user_inputs missing no_snapshot and dry_run fields declared in route allowed_flags
- `.opencode/commands/doctor/assets/doctor_deep-loop.yaml`:59-62 **misalignment** — deep-loop YAML user_inputs missing no_snapshot and dry_run fields declared in route allowed_flags
- `.opencode/commands/doctor/mcp.md`:3-4 **dead** — doctor:mcp has MCP-style flags but no MCP tools in allowed-tools
- `.opencode/commands/doctor/assets/doctor_memory.yaml`:24 **drift** — Memory doctor invariant text names retired per-profile DB glob
- `.opencode/commands/doctor/assets/doctor_memory.yaml`:153 **dead** — Memory doctor discovery shell example uses non-matching retired glob
- `.opencode/commands/doctor/assets/doctor_causal-graph.yaml`:161 **dead** — Causal-graph doctor discovery shell example uses non-matching retired glob
- `.opencode/commands/doctor/assets/doctor_speckit_presentation.txt`:49 **drift** — Speckit doctor symptom router still advertises retired DB glob
- `.opencode/commands/doctor/scripts/route-validate.py`:14 **misalignment** — Validator allows extra mutating tools in router frontmatter

### skills/system-spec-kit (16)
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts`:204 **undocumented** — LLM provider envs are missing from ENV_REFERENCE _(x2 models)_
- `.opencode/skills/system-spec-kit/references/cli/daemon_cli_reference.md`:27 **contradiction** — Daemon CLI reference documents spec-memory CLI as 37 tools, contradicting the 39-tool MCP surface
- `.opencode/skills/system-spec-kit/references/memory/memory_system.md`:23 **drift** — Memory reference still claims schema v37
- `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md`:31 **undocumented** — ENV_REFERENCE has no legacy rows for renamed 028 `_V1` flags
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts`:1030-1039 **drift** — JSDoc says default OFF, code returns default ON for RELEVANCE_AWARE_GAP
- `.opencode/skills/system-spec-kit/mcp_server/tests/matrix-adapter-opencode.vitest.ts`:36 **dead** — Matrix adapter test expects removed opencode-go model invocation
- `.opencode/skills/system-spec-kit/references/config/environment_variables.md`:63 **contradiction** — Provider-selection doc denies actual cloud fallback
- `.opencode/skills/system-spec-kit/shared/gate-3-classifier.ts`:108-139 **drift** — Gate 3 RESUME_TRIGGERS missing /deep:ai-council and /deep:context write-producing commands
- `.opencode/skills/system-spec-kit/mcp_server/lib/validation/preflight.ts`:235-248 **undocumented** — Seven MCP_* preflight config env vars missing from ENV_REFERENCE
- `.opencode/skills/system-spec-kit/changelog/v3.7.0.0.md`:84 **contradiction** — v3.7 says retrieval-shape routing is on, runtime keeps it opt-in
- `.opencode/skills/system-spec-kit/shared/README.md`:195,350,478 **drift** — Shared README still documents retired per-profile database filenames
- `.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md`:98,101 **drift** — INSTALL_GUIDE still presents context-index__*.sqlite as the active database
- `.opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/cli-list-tools-parity.md`:3 **contradiction** — Manual parity playbook still pins spec-memory CLI to 37 tools
- `.opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/cli-compact-and-completion.md`:21 **contradiction** — Compact/completion manual test expects 37 spec-memory tools against a 39-tool catalog source
- `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts`:953-959 **undocumented** — Historical 37-tool subset is reconstructible only from git history
- `.opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/cli-list-tools-parity.md`:3,11,17-21,40,59-60,69,89,93 **misalignment** — Manual playbook still locks spec-memory CLI parity to 37 tools

### agents (14)
- `.claude/agents/context.md`:4 **drift** — Claude context agent lacks code_graph MCP grant but body instructs its use _(x2 models)_
- `.claude/agents/deep-review.md`:4 **misalignment** — tools: line only exposes detect_changes but body declares code_graph_query + code_graph_context as available tools _(x2 models)_
- `.codex/agents/orchestrate.toml`:7 **misalignment** — orchestrate agent pinned to gpt-5.4 before cli-codex gpt-5.5 lock _(x2 models)_
- `.codex/agents/code.toml`:6 **misalignment** — code agent pinned to gpt-5.4 before cli-codex gpt-5.5 lock _(x2 models)_
- `.codex/agents/review.toml`:6 **misalignment** — review agent pinned to gpt-5.4 before cli-codex gpt-5.5 lock _(x2 models)_
- `.claude/agents/deep-research.md`:4 **drift** — Claude deep-research agent lacks code_graph MCP grant but wedged-daemon fallback references it
- `.claude/agents/review.md`:4 **misalignment** — tools: line only exposes detect_changes but .opencode/agents/review.md body references it without any code_graph permissions declared
- `.opencode/agents/context.md`:20-22 **misalignment** — OpenCode context agent declares non-existent MCP server 'code_graph'
- `.opencode/agents/review.md`:6-19 **misalignment** — OpenCode review agent body uses detect_changes without granting it
- `.claude/agents/deep-review.md`:4 **drift** — Claude deep-review agent body references code_graph_query/context not in tools line
- `.codex/agents/context.toml`:6 **misalignment** — context agent pinned to gpt-5.4 before cli-codex gpt-5.5 lock
- `.codex/agents/markdown.toml`:8 **misalignment** — Markdown Codex agent is pinned to high effort despite documentation tasks being medium
- `.claude/agents/context.md`:4 **misalignment** — context agent frontmatter omits required code-graph tool grants
- `.opencode/agents/context.md`:22 **dead** — Context agent references unregistered MCP server `code_graph`

### commands/speckit (7)
- `.opencode/commands/speckit/complete.md`:4 **misalignment** — complete.md allowed-tools missing memory_search required by context_loading step _(x2 models)_
- `.opencode/commands/speckit/plan.md`:4 **misalignment** — /speckit:plan omits Code Graph allowed tool required by workflow asset _(x2 models)_
- `.opencode/commands/speckit/resume.md`:4 **misalignment** — resume.md allowed-tools missing session_bootstrap required by recovery ladder
- `.opencode/commands/speckit/plan.md`:3 **undocumented** — speckit:plan advertises workflow flags absent from allowed MCP tool schemas
- `.opencode/commands/speckit/complete.md`:4 **contradiction** — complete.md router omits memory_search used by both complete YAMLs
- `.opencode/commands/speckit/plan.md`:4 **dead** — plan.md router allows memory_index_scan never invoked as mcp_tool in plan YAMLs
- `.opencode/commands/speckit/implement.md`:4 **dead** — implement.md router allows memory_index_scan never invoked as mcp_tool in implement YAMLs

### commands/memory (4)
- `.opencode/commands/memory/manage.md`:32 **drift** — /memory:manage validate subcommand uses wrong value type _(x2 models)_
- `.opencode/commands/memory/manage.md`:4 **misalignment** — /memory:manage missing memory_context and memory_embedding_reconcile _(x2 models)_
- `.opencode/commands/memory/learn.md`:4 **misalignment** — /memory:learn missing memory_context and 16 other spec-memory tools
- `.opencode/commands/memory/search.md`:3 **misalignment** — memory:search --intent:<type> colon syntax fails resolvePropertyName

### skills/sk-prompt-models (4)
- `.opencode/skills/sk-prompt-models/references/models/mimo-v2.5-pro.md`:165 **drift** — MiMo model card still recommends removed opencode-go free fallback
- `.opencode/skills/sk-prompt-models/assets/model_profiles.json`:192 **drift** — Registry still encodes removed opencode-go MiMo free path
- `.opencode/skills/sk-prompt-models/references/quota_fallback.md`:99-141 **misalignment** — Quota-fallback algorithm documents schema incompatible with registry
- `.opencode/skills/sk-prompt-models/references/models/deepseek-v4-pro.md`:158 **misalignment** — DeepSeek profile lists cognition-pro pool absent from registry

### commands/deep (3)
- `.opencode/commands/deep/assets/deep_context_presentation.txt`:371 **dead** — Deep context example references removed opencode-go provider
- `.opencode/commands/deep/agent-improvement.md`:4 **misalignment** — agent-improvement workflow requires memory_search but command disallows it
- `.opencode/commands/deep/model-benchmark.md`:4 **misalignment** — model-benchmark workflow requires memory_search but command disallows it

### skills/deep-loop-workflows (3)
- `.opencode/skills/deep-loop-workflows/deep-ai-council/SKILL.md`:20 **drift** — AI council docs claim OpenCode uses removed opencode-go gateway models
- `.opencode/skills/deep-loop-workflows/deep-ai-council/references/patterns/seat_diversity_patterns.md`:64 **dead** — Seat-diversity table lists opencode-go gateway as a cli-opencode model option
- `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/live-executor.cjs`:41 **dead** — Skill benchmark default model is the removed opencode-go/deepseek-v4-pro

### skills/system-skill-advisor (2)
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts`:39-47 **drift** — aliases.ts SKILL_ALIAS_GROUPS maps deep-ai-council but mode-registry legacyAliases differ in set membership
- `.opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts`:47 **misalignment** — Drift guard ignores registry fields implicated by the line-71 issue

### .github (2)
- `.github/workflows/routing-registry-drift.yml`:7 **misalignment** — Drift guard CI is PR-only despite direct-main workflow
- `.github/workflows/routing-registry-drift.yml`:9 **dead** — Workflow can be changed without self-running

### .opencode/bin (1)
- `.opencode/bin/cli-offline-smoke.cjs`:12 **drift** — Offline smoke hardcodes spec-memory CLI count as 37 while the MCP registry has 39 tools

### .opencode/install_guides (1)
- `.opencode/install_guides/README.md`:318 **contradiction** — Install guide claims mk_skill_advisor has 8 tools instead of the registered 9

### skills/cli-codex (1)
- `.opencode/skills/cli-codex/README.md`:138 **contradiction** — Codex runtime agents use gpt-5.4 but cli-codex docs claim only gpt-5.5 is supported

## P2 — converged counts by surface area
- 028 spec tree: 24
- skills/system-spec-kit: 18
- skills/deep-loop-runtime: 7
- agents: 5
- commands/memory: 4
- commands/doctor: 4
- commands/speckit: 3
- commands/create: 3
- skills/deep-loop-workflows: 2
- skills/cli-codex: 2
- skills/sk-prompt-models: 2
- skills/cli-opencode: 1
- ALL commands (code-index registry): 1
- ALL commands (skill-advisor registry): 1
- .opencode/bin: 1

## Hot surface areas (all severities, converged)
- **028 spec tree** — 42 (P0 1 / P1 17 / P2 24)
- **skills/system-spec-kit** — 34 (P0 0 / P1 16 / P2 18)
- **commands/doctor** — 22 (P0 2 / P1 16 / P2 4)
- **agents** — 20 (P0 1 / P1 14 / P2 5)
- **commands/speckit** — 10 (P0 0 / P1 7 / P2 3)
- **skills/deep-loop-runtime** — 9 (P0 2 / P1 0 / P2 7)
- **commands/memory** — 8 (P0 0 / P1 4 / P2 4)
- **skills/sk-prompt-models** — 6 (P0 0 / P1 4 / P2 2)
- **skills/deep-loop-workflows** — 5 (P0 0 / P1 3 / P2 2)
- **commands/deep** — 3 (P0 0 / P1 3 / P2 0)
- **skills/cli-codex** — 3 (P0 0 / P1 1 / P2 2)
- **commands/create** — 3 (P0 0 / P1 0 / P2 3)
- **.opencode/bin** — 2 (P0 0 / P1 1 / P2 1)
- **skills/system-skill-advisor** — 2 (P0 0 / P1 2 / P2 0)
- **.github** — 2 (P0 0 / P1 2 / P2 0)

## Model contribution (raw findings)
- kimi: 92
- gpt55: 72
- mimo: 23
- deepseek: 19

## Caveats
- Findings are unverified LLM hypotheses; treat each as a lead with evidence, not a confirmed defect.
- 3 iterations failed (2 parse failures, 1 timeout) — mimo over-explored; those angles are uncovered.
- Dedup is by file+type, so two genuinely distinct issues in the same file under the same type may be merged into one cluster; the raw findings.jsonl preserves every individual finding.
- Run was capped at 50 of a planned 80 ("converge at 50"); the remaining angle backlog is preserved in angles.json.

