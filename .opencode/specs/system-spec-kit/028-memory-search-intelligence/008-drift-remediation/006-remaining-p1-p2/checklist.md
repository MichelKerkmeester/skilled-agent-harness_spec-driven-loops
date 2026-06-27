---
title: "Checklist: Remaining P1/P2 Fixes"
description: "Verification checklist for remediation phase 6."
trigger_phrases:
  - "028 drift remediation"
  - "checklist: remaining p1/p2 fixes"
  - "drift fix verification"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    last_updated_at: "2026-06-27T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded checklist for phase 6"
    next_safe_action: "Verify each finding"
    blockers: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

# Checklist: Remaining P1/P2 Fixes

<!-- ANCHOR:protocol -->
## Protocol
Mark an item done only after opus re-reads the file and confirms the cited evidence is resolved (or records a false-positive in the ledger).
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
- [ ] Ledger entries for 006-remaining-p1-p2 loaded
- [ ] Cited files present
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality
- [ ] Edits minimal and scoped to cited drift
- [ ] Comment hygiene respected (no artifact-ids/spec paths in code comments)
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing
- [ ] Affected tests/validators re-run where a finding touches code or a test
<!-- /ANCHOR:testing -->

<!-- ANCHOR:security -->
## Security
- [ ] No secrets or scope-violating changes introduced
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation
- [ ] F007 `.opencode/commands/doctor/_routes.yaml` skill-advisor route declares mutates but exposes a --dry-run preview flag
- [ ] F008 `.opencode/commands/memory/manage.md` /memory:manage validate subcommand uses wrong value type
- [ ] F009 `.opencode/commands/memory/manage.md` /memory:manage missing memory_context and memory_embedding_reconcile
- [ ] F011 `.opencode/commands/doctor/update.md` /doctor:update binds skip_status_check without a flag
- [ ] F012 `.opencode/skills/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts` LLM provider envs are missing from ENV_REFERENCE
- [ ] F016 `.opencode/skills/system-spec-kit/references/memory/memory_system.md` Memory reference still claims schema v37
- [ ] F018 `.opencode/commands/speckit/plan.md` /speckit:plan omits Code Graph allowed tool required by workflow asset
- [ ] F019 `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` ENV_REFERENCE has no legacy rows for renamed 028 `_V1` flags
- [ ] F024 `.opencode/commands/doctor/assets/doctor_causal-graph.yaml` Causal-graph doctor fail-fast text references retired missing-DB glob
- [ ] F025 `.opencode/commands/doctor/speckit.md` Read-only code-graph route can access scan/apply tools from router union
- [ ] F028 `.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts` JSDoc says default OFF, code returns default ON for RELEVANCE_AWARE_GAP
- [ ] F037 `.opencode/specs/system-spec-kit/028-memory-search-intelligence/006-review-remediation/006-review-record-packet-type/spec.md` Review-record packet carries waived docs
- [ ] F040 `.opencode/skills/system-spec-kit/references/config/environment_variables.md` Provider-selection doc denies actual cloud fallback
- [ ] F041 `.opencode/skills/system-spec-kit/shared/gate-3-classifier.ts` Gate 3 RESUME_TRIGGERS missing /deep:ai-council and /deep:context write-producing commands
- [ ] F042 `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts` aliases.ts SKILL_ALIAS_GROUPS maps deep-ai-council but mode-registry legacyAliases differ in set membership
- [ ] F043 `.opencode/skills/system-spec-kit/mcp_server/lib/validation/preflight.ts` Seven MCP_* preflight config env vars missing from ENV_REFERENCE
- [ ] F045 `.opencode/skills/system-spec-kit/changelog/v3.7.0.0.md` v3.7 says retrieval-shape routing is on, runtime keeps it opt-in
- [ ] F056 `.opencode/commands/doctor/assets/doctor_memory.yaml` Memory doctor allowed targets name retired profile DB while doc text names canonical DB
- [ ] F057 `.opencode/commands/doctor/assets/doctor_update.yaml` Update doctor allowed targets omit canonical DB and vector shard
- [ ] F058 `.opencode/skills/system-spec-kit/shared/README.md` Shared README still documents retired per-profile database filenames
- [ ] F061 `.github/workflows/routing-registry-drift.yml` Drift guard CI is PR-only despite direct-main workflow
- [ ] F062 `.github/workflows/routing-registry-drift.yml` Workflow can be changed without self-running
- [ ] F063 `.opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts` Drift guard ignores registry fields implicated by the line-71 issue
- [ ] F066 `.opencode/commands/memory/search.md` memory:search --intent:<type> colon syntax fails resolvePropertyName
- [ ] F067 `.opencode/commands/speckit/plan.md` speckit:plan advertises workflow flags absent from allowed MCP tool schemas
- [ ] F070 `.opencode/commands/speckit/plan.md` plan.md router allows memory_index_scan never invoked as mcp_tool in plan YAMLs
- [ ] F071 `.opencode/commands/speckit/implement.md` implement.md router allows memory_index_scan never invoked as mcp_tool in implement YAMLs
- [ ] F086 `.opencode/skills/sk-prompt-small-model/references/quota_fallback.md` Quota-fallback algorithm documents schema incompatible with registry
- [ ] F087 `.opencode/skills/sk-prompt-small-model/references/models/deepseek-v4-pro.md` DeepSeek profile lists cognition-pro pool absent from registry
- [ ] F088 `.opencode/commands/doctor/assets/doctor_memory.yaml` Memory doctor invariant text names retired per-profile DB glob
- [ ] F089 `.opencode/commands/doctor/assets/doctor_memory.yaml` Memory doctor discovery shell example uses non-matching retired glob
- [ ] F090 `.opencode/commands/doctor/assets/doctor_causal-graph.yaml` Causal-graph doctor discovery shell example uses non-matching retired glob
- [ ] F091 `.opencode/commands/doctor/assets/doctor_speckit_presentation.txt` Speckit doctor symptom router still advertises retired DB glob
- [ ] F094 `.opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/cli-compact-and-completion.md` Compact/completion manual test expects 37 spec-memory tools against a 39-tool catalog source
- [ ] F095 `.opencode/commands/doctor/scripts/route-validate.py` Validator allows extra mutating tools in router frontmatter
- [ ] F096 `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` Historical 37-tool subset is reconstructible only from git history
- [ ] F101 `.opencode/commands/memory/README.txt` Memory README related-document paths point to non-existent `skill/` directory
- [ ] F102 `.opencode/skills/system-spec-kit/mcp_server/spec-memory-cli.ts` `spec-memory --session-id` is implemented but absent from CLI reference
- [ ] F103 `.opencode/commands/memory/README.txt` Memory command coverage matrix omits current public maintenance tools
- [ ] F104 `.opencode/skills/system-spec-kit/mcp_server/tests/flag-ceiling.vitest.ts` Flag-ceiling test lists RELEVANCE_AWARE_GAP as opt-in unceilinged but code defaults it ON
- [ ] F105 `.claude/agents/deep-research.md` WebSearch tool in Claude deep-research has no OpenCode equivalent
- [ ] F106 `.codex/agents/` Inconsistent profile field across codex agent definitions
- [ ] F109 `.opencode/skills/system-spec-kit/SKILL.md` system-spec-kit SKILL.md misstates the code-graph tool surface and readiness contracts
- [ ] F110 `.opencode/skills/system-spec-kit/references/memory/embedder_architecture.md` Sidecar worker runbook remains after execution sidecar removal
- [ ] F111 `.opencode/skills/system-spec-kit/references/memory/embedding_resilience.md` Bootstrap probe sequence lists removed Ollama manifests
- [ ] F112 `.opencode/skills/deep-loop-workflows/mode-registry.json` ai-council agent name breaks deep-* naming convention used by all other deep modes
- [ ] F113 `.opencode/commands/memory/search.md` Colon intent flag is not a daemon CLI property flag
- [ ] F114 `.opencode/skills/system-spec-kit/mcp_server/lib/session/session-manager.ts` Six session-management env vars absent from ENV_REFERENCE
- [ ] F115 `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts` MEMORY_ALLOWED_PATHS security-relevant env var not in ENV_REFERENCE
- [ ] F116 `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` MEMORY_BASE_PATH and MEMORY_DB_PATH storage env vars missing from ENV_REFERENCE
- [ ] F118 `.opencode/specs/system-spec-kit/028-memory-search-intelligence/feature-flags.md` 028 graduated flag table still names removed `_V1` env vars
- [ ] F119 `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` ENV quick table mixes `v1` display label with unsuffixed governing env var
- [ ] F121 `.opencode/skills/cli-codex/README.md` deep-review agent runs on Codex despite skill docs routing deep extended-thinking to Claude Code
- [ ] F128 `.opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/spec-folder-literal-naming-cli-driven-slug.md` manual test fallback recommends removed qwen gateway route
- [ ] F129 `.opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/spec-folder-literal-naming-remediation-rule.md` remediation-rule test repeats removed qwen fallback
- [ ] F130 `.opencode/skills/sk-prompt-small-model/benchmarks/003-minimax-prompt-framework/eval-rig/fixtures/fix-001-hallucinated-cli-flag/seed/flag-spec.md` fixture seed lists retired GLM and Kimi models as real flags
- [ ] F131 `.opencode/skills/sk-prompt-small-model/benchmarks/004-mimo-prompt-framework/eval/run-mimo-bench.cjs` MiMo benchmark harness advertises removed free gateway smoke model
- [ ] F132 `ALL commands (code-index registry)` code_graph_classify_query_intent and code_graph_verify never declared in any command
- [ ] F133 `ALL commands (skill-advisor registry)` skill_graph_propagate_enhances and skill_graph_validate never declared in any command
- [ ] F134 `.opencode/skills/system-spec-kit/mcp_server/database/vectors/README.md` Vector shard README flow omits the vec_memories query surface it declares
- [ ] F137 `.opencode/commands/doctor/_routes.yaml` causal-graph route lists memory_causal_stats which has mutating backfill parameter
- [ ] F138 `.opencode/specs/system-spec-kit/028-memory-search-intelligence/research/drift-audit-2026-06-27/research.md` Stored audit cites a nonexistent drift-guard line
- [ ] F139 `.opencode/commands/doctor/assets/doctor_speckit_presentation.txt` presentation contract missing parent-skill and fable-mode targets from valid-targets list and subsystem manifest
- [ ] F140 `.opencode/commands/speckit/complete.md` complete.md router allows memory_context never invoked as mcp_tool in complete YAMLs
- [ ] F141 `.opencode/commands/speckit/resume.md` resume.md router over-declares memory and checkpoint tools never invoked as mcp_tool in resume YAMLs
- [ ] F142 `.opencode/specs/system-spec-kit/028-memory-search-intelligence/benchmark-status.md` Benchmark status still names graduated legacy env vars with no ENV_REFERENCE aliases
- [ ] F143 `.opencode/specs/system-spec-kit/028-memory-search-intelligence/keep-off-flag-roadmap.md` Roadmap says `SPECKIT_GROUNDING_SIGNAL_V1` stays off after benchmark says deleted
- [ ] F144 `.opencode/agents/deep-review.md` Canonical OpenCode deep-review agent omits model/reasoning metadata with no Codex-mismatch rationale
- [ ] F145 `.claude/agents/deep-review.md` Claude deep-review agent lacks model metadata and never states it is the intended runtime for deep extended-thinking
- [ ] F146 `.opencode/skills/deep-loop-workflows/deep-review/SKILL.md` deep-review skill lists Codex runtime path without noting the deep-thinking exclusion
- [ ] F147 `.codex/agents/debug.toml` Debug Codex agent lacks the documented medium-for-fixes split
- [ ] F159 `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/034-scoped-backfill-boundary/plan.md` Parent plan FIX ADDENDUM template instruction duplicated verbatim across 39 child plans
- [ ] F160 `.opencode/skills/deep-loop-runtime/tests/unit/cli-matrix.vitest.ts` Command-shape tests pin real-looking model IDs
- [ ] F161 `.opencode/skills/deep-loop-runtime/tests/unit/executor-config.vitest.ts` Executor config parser tests use provider-branded IDs despite no whitelist intent
- [ ] F162 `.opencode/skills/deep-loop-runtime/tests/unit/executor-audit.vitest.ts` Audit serialization tests centralize on a stale-looking Codex model example
- [ ] F163 `.opencode/skills/deep-loop-runtime/tests/unit/dispatch-failure.vitest.ts` Dispatch-failure tests use model names while validating failure-state behavior
- [ ] F164 `.opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts` Fanout argv/env tests hard-code model examples unrelated to their assertions
- [ ] F165 `.opencode/skills/deep-loop-runtime/tests/unit/executor-provenance-mismatch.vitest.ts` Native executor fixture carries a model even though native rejects models
- [ ] F169 `.opencode/commands/memory/save.md` memory save is write/index heavy with no L2 retrieval precheck
- [ ] F171 `.opencode/commands/doctor/assets/doctor_skill-budget.yaml` Skill-budget route declares no MCP tools but asset calls advisor_status
- [ ] F172 `.opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md` Playbook index still summarizes scenario 427 as 37-tool spec-memory parity
- [ ] F173 `.opencode/bin/README.md` bin README documents offline smoke as a 37/8/9 count gate
- [ ] F174 `.opencode/skills/system-spec-kit/changelog/v3.5.0.5.md` CLI release note says TOOL_DEFINITIONS generates 37 commands
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization
- [ ] No files created or moved outside the cited targets
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Summary
- [ ] All 83 findings terminal in the ledger
<!-- /ANCHOR:summary -->
