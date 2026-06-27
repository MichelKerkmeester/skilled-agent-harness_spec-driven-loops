---
title: "Feature Specification: Remaining P1/P2 Fixes"
description: "Remediation phase 6 of 6: 83 drift findings (P1 36, P2 47). Each is verified real, fixed by gpt-5.5 high, re-verified by opus."
trigger_phrases:
  - "028 drift remediation"
  - "feature specification: remaining p1/p2 fixes"
  - "drift fix verification"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    last_updated_at: "2026-06-27T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded phase 6 from the remediation ledger"
    next_safe_action: "Triage and fix the 83 findings"
    blockers: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

# Feature Specification: Remaining P1/P2 Fixes

<!-- ANCHOR:metadata -->
## 1. METADATA
- Track: 008-drift-remediation, phase 6 of 6
- Findings: 83 (P1 36, P2 47)
- Ledger: ../remediation-ledger.jsonl (phase=006-remaining-p1-p2)
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
### Problem Statement
The 028 drift audit surfaced 83 evidence-backed findings in this surface area: doc/config/test reality drifted from code.
### Purpose
Verify each against the real file, fix the genuine ones with minimal scoped edits, re-verify, and leave every ledger entry terminal.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE
### In Scope
The 83 findings in REQUIREMENTS.
### Out of Scope
Findings in other phases; adjacent cleanup not cited by a finding.
### Files to Change
- `.opencode/commands/doctor/_routes.yaml`
- `.opencode/commands/memory/manage.md`
- `.opencode/commands/doctor/update.md`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts`
- `.opencode/skills/system-spec-kit/references/memory/memory_system.md`
- `.opencode/commands/speckit/plan.md`
- `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md`
- `.opencode/commands/doctor/assets/doctor_causal-graph.yaml`
- `.opencode/commands/doctor/speckit.md`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts`
- `.opencode/specs/system-spec-kit/028-memory-search-intelligence/006-review-remediation/006-review-record-packet-type/spec.md`
- `.opencode/skills/system-spec-kit/references/config/environment_variables.md`
- `.opencode/skills/system-spec-kit/shared/gate-3-classifier.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/validation/preflight.ts`
- `.opencode/skills/system-spec-kit/changelog/v3.7.0.0.md`
- `.opencode/commands/doctor/assets/doctor_memory.yaml`
- `.opencode/commands/doctor/assets/doctor_update.yaml`
- `.opencode/skills/system-spec-kit/shared/README.md`
- `.github/workflows/routing-registry-drift.yml`
- `.opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts`
- `.opencode/commands/memory/search.md`
- `.opencode/commands/speckit/implement.md`
- `.opencode/skills/sk-prompt-small-model/references/quota_fallback.md`
- `.opencode/skills/sk-prompt-small-model/references/models/deepseek-v4-pro.md`
- `.opencode/commands/doctor/assets/doctor_speckit_presentation.txt`
- `.opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/cli-compact-and-completion.md`
- `.opencode/commands/doctor/scripts/route-validate.py`
- `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts`
- `.opencode/commands/memory/README.txt`
- `.opencode/skills/system-spec-kit/mcp_server/spec-memory-cli.ts`
- `.opencode/skills/system-spec-kit/mcp_server/tests/flag-ceiling.vitest.ts`
- `.claude/agents/deep-research.md`
- `.codex/agents/`
- `.opencode/skills/system-spec-kit/SKILL.md`
- `.opencode/skills/system-spec-kit/references/memory/embedder_architecture.md`
- `.opencode/skills/system-spec-kit/references/memory/embedding_resilience.md`
- `.opencode/skills/deep-loop-workflows/mode-registry.json`
- `.opencode/skills/system-spec-kit/mcp_server/lib/session/session-manager.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts`
- `.opencode/skills/system-spec-kit/mcp_server/context-server.ts`
- `.opencode/specs/system-spec-kit/028-memory-search-intelligence/feature-flags.md`
- `.opencode/skills/cli-codex/README.md`
- `.opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/spec-folder-literal-naming-cli-driven-slug.md`
- `.opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/spec-folder-literal-naming-remediation-rule.md`
- `.opencode/skills/sk-prompt-small-model/benchmarks/003-minimax-prompt-framework/eval-rig/fixtures/fix-001-hallucinated-cli-flag/seed/flag-spec.md`
- `.opencode/skills/sk-prompt-small-model/benchmarks/004-mimo-prompt-framework/eval/run-mimo-bench.cjs`
- `ALL commands (code-index registry)`
- `ALL commands (skill-advisor registry)`
- `.opencode/skills/system-spec-kit/mcp_server/database/vectors/README.md`
- `.opencode/specs/system-spec-kit/028-memory-search-intelligence/research/drift-audit-2026-06-27/research.md`
- `.opencode/commands/speckit/complete.md`
- `.opencode/commands/speckit/resume.md`
- `.opencode/specs/system-spec-kit/028-memory-search-intelligence/benchmark-status.md`
- `.opencode/specs/system-spec-kit/028-memory-search-intelligence/keep-off-flag-roadmap.md`
- `.opencode/agents/deep-review.md`
- `.claude/agents/deep-review.md`
- `.opencode/skills/deep-loop-workflows/deep-review/SKILL.md`
- `.codex/agents/debug.toml`
- `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/034-scoped-backfill-boundary/plan.md`
- `.opencode/skills/deep-loop-runtime/tests/unit/cli-matrix.vitest.ts`
- `.opencode/skills/deep-loop-runtime/tests/unit/executor-config.vitest.ts`
- `.opencode/skills/deep-loop-runtime/tests/unit/executor-audit.vitest.ts`
- `.opencode/skills/deep-loop-runtime/tests/unit/dispatch-failure.vitest.ts`
- `.opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts`
- `.opencode/skills/deep-loop-runtime/tests/unit/executor-provenance-mismatch.vitest.ts`
- `.opencode/commands/memory/save.md`
- `.opencode/commands/doctor/assets/doctor_skill-budget.yaml`
- `.opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md`
- `.opencode/bin/README.md`
- `.opencode/skills/system-spec-kit/changelog/v3.5.0.5.md`
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
### Required (complete OR user-approved deferral)
- F007 [P1 misalignment] `.opencode/commands/doctor/_routes.yaml:121-133` skill-advisor route declares mutates but exposes a --dry-run preview flag
- F008 [P1 drift] `.opencode/commands/memory/manage.md:32` /memory:manage validate subcommand uses wrong value type
- F009 [P1 misalignment] `.opencode/commands/memory/manage.md:4` /memory:manage missing memory_context and memory_embedding_reconcile
- F011 [P1 undocumented] `.opencode/commands/doctor/update.md:30-31` /doctor:update binds skip_status_check without a flag
- F012 [P1 undocumented] `.opencode/skills/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:204` LLM provider envs are missing from ENV_REFERENCE
- F016 [P1 drift] `.opencode/skills/system-spec-kit/references/memory/memory_system.md:23` Memory reference still claims schema v37
- F018 [P1 misalignment] `.opencode/commands/speckit/plan.md:4` /speckit:plan omits Code Graph allowed tool required by workflow asset
- F019 [P1 undocumented] `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:31` ENV_REFERENCE has no legacy rows for renamed 028 `_V1` flags
- F024 [P1 drift] `.opencode/commands/doctor/assets/doctor_causal-graph.yaml:174` Causal-graph doctor fail-fast text references retired missing-DB glob
- F025 [P1 contradiction] `.opencode/commands/doctor/speckit.md:4` Read-only code-graph route can access scan/apply tools from router union
- F028 [P1 drift] `.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts:1030-1039` JSDoc says default OFF, code returns default ON for RELEVANCE_AWARE_GAP
- F037 [P1 contradiction] `.opencode/specs/system-spec-kit/028-memory-search-intelligence/006-review-remediation/006-review-record-packet-type/spec.md:56` Review-record packet carries waived docs
- F040 [P1 contradiction] `.opencode/skills/system-spec-kit/references/config/environment_variables.md:63` Provider-selection doc denies actual cloud fallback
- F041 [P1 drift] `.opencode/skills/system-spec-kit/shared/gate-3-classifier.ts:108-139` Gate 3 RESUME_TRIGGERS missing /deep:ai-council and /deep:context write-producing commands
- F042 [P1 drift] `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts:39-47` aliases.ts SKILL_ALIAS_GROUPS maps deep-ai-council but mode-registry legacyAliases differ in set membership
- F043 [P1 undocumented] `.opencode/skills/system-spec-kit/mcp_server/lib/validation/preflight.ts:235-248` Seven MCP_* preflight config env vars missing from ENV_REFERENCE
- F045 [P1 contradiction] `.opencode/skills/system-spec-kit/changelog/v3.7.0.0.md:84` v3.7 says retrieval-shape routing is on, runtime keeps it opt-in
- F056 [P1 contradiction] `.opencode/commands/doctor/assets/doctor_memory.yaml:67,122` Memory doctor allowed targets name retired profile DB while doc text names canonical DB
- F057 [P1 misalignment] `.opencode/commands/doctor/assets/doctor_update.yaml:102-103` Update doctor allowed targets omit canonical DB and vector shard
- F058 [P1 drift] `.opencode/skills/system-spec-kit/shared/README.md:195,350,478` Shared README still documents retired per-profile database filenames
- F061 [P1 misalignment] `.github/workflows/routing-registry-drift.yml:7` Drift guard CI is PR-only despite direct-main workflow
- F062 [P1 dead] `.github/workflows/routing-registry-drift.yml:9` Workflow can be changed without self-running
- F063 [P1 misalignment] `.opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts:47` Drift guard ignores registry fields implicated by the line-71 issue
- F066 [P1 misalignment] `.opencode/commands/memory/search.md:3` memory:search --intent:<type> colon syntax fails resolvePropertyName
- F067 [P1 undocumented] `.opencode/commands/speckit/plan.md:3` speckit:plan advertises workflow flags absent from allowed MCP tool schemas
- F070 [P1 dead] `.opencode/commands/speckit/plan.md:4` plan.md router allows memory_index_scan never invoked as mcp_tool in plan YAMLs
- F071 [P1 dead] `.opencode/commands/speckit/implement.md:4` implement.md router allows memory_index_scan never invoked as mcp_tool in implement YAMLs
- F086 [P1 misalignment] `.opencode/skills/sk-prompt-small-model/references/quota_fallback.md:99-141` Quota-fallback algorithm documents schema incompatible with registry
- F087 [P1 misalignment] `.opencode/skills/sk-prompt-small-model/references/models/deepseek-v4-pro.md:158` DeepSeek profile lists cognition-pro pool absent from registry
- F088 [P1 drift] `.opencode/commands/doctor/assets/doctor_memory.yaml:24` Memory doctor invariant text names retired per-profile DB glob
- F089 [P1 dead] `.opencode/commands/doctor/assets/doctor_memory.yaml:153` Memory doctor discovery shell example uses non-matching retired glob
- F090 [P1 dead] `.opencode/commands/doctor/assets/doctor_causal-graph.yaml:161` Causal-graph doctor discovery shell example uses non-matching retired glob
- F091 [P1 drift] `.opencode/commands/doctor/assets/doctor_speckit_presentation.txt:49` Speckit doctor symptom router still advertises retired DB glob
- F094 [P1 contradiction] `.opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/cli-compact-and-completion.md:21` Compact/completion manual test expects 37 spec-memory tools against a 39-tool catalog source
- F095 [P1 misalignment] `.opencode/commands/doctor/scripts/route-validate.py:14` Validator allows extra mutating tools in router frontmatter
- F096 [P1 undocumented] `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:953-959` Historical 37-tool subset is reconstructible only from git history
- F101 [P2 drift] `.opencode/commands/memory/README.txt:335-338` Memory README related-document paths point to non-existent `skill/` directory
- F102 [P2 undocumented] `.opencode/skills/system-spec-kit/mcp_server/spec-memory-cli.ts:228` `spec-memory --session-id` is implemented but absent from CLI reference
- F103 [P2 misalignment] `.opencode/commands/memory/README.txt:231` Memory command coverage matrix omits current public maintenance tools
- F104 [P2 misalignment] `.opencode/skills/system-spec-kit/mcp_server/tests/flag-ceiling.vitest.ts:281` Flag-ceiling test lists RELEVANCE_AWARE_GAP as opt-in unceilinged but code defaults it ON
- F105 [P2 undocumented] `.claude/agents/deep-research.md:4` WebSearch tool in Claude deep-research has no OpenCode equivalent
- F106 [P2 misalignment] `.codex/agents/` Inconsistent profile field across codex agent definitions
- F109 [P2 drift] `.opencode/skills/system-spec-kit/SKILL.md:436` system-spec-kit SKILL.md misstates the code-graph tool surface and readiness contracts
- F110 [P2 dead] `.opencode/skills/system-spec-kit/references/memory/embedder_architecture.md:187` Sidecar worker runbook remains after execution sidecar removal
- F111 [P2 drift] `.opencode/skills/system-spec-kit/references/memory/embedding_resilience.md:41` Bootstrap probe sequence lists removed Ollama manifests
- F112 [P2 misalignment] `.opencode/skills/deep-loop-workflows/mode-registry.json:71` ai-council agent name breaks deep-* naming convention used by all other deep modes
- F113 [P2 drift] `.opencode/commands/memory/search.md:3` Colon intent flag is not a daemon CLI property flag
- F114 [P2 undocumented] `.opencode/skills/system-spec-kit/mcp_server/lib/session/session-manager.ts:187-205` Six session-management env vars absent from ENV_REFERENCE
- F115 [P2 undocumented] `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:619-620` MEMORY_ALLOWED_PATHS security-relevant env var not in ENV_REFERENCE
- F116 [P2 undocumented] `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1550 and core/config.ts:69,156` MEMORY_BASE_PATH and MEMORY_DB_PATH storage env vars missing from ENV_REFERENCE
- F118 [P2 drift] `.opencode/specs/system-spec-kit/028-memory-search-intelligence/feature-flags.md:122` 028 graduated flag table still names removed `_V1` env vars
- F119 [P2 misalignment] `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:144` ENV quick table mixes `v1` display label with unsuffixed governing env var
- F121 [P2 misalignment] `.opencode/skills/cli-codex/README.md:150` deep-review agent runs on Codex despite skill docs routing deep extended-thinking to Claude Code
- F128 [P2 dead] `.opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/spec-folder-literal-naming-cli-driven-slug.md:213` manual test fallback recommends removed qwen gateway route
- F129 [P2 dead] `.opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/spec-folder-literal-naming-remediation-rule.md:228` remediation-rule test repeats removed qwen fallback
- F130 [P2 misalignment] `.opencode/skills/sk-prompt-small-model/benchmarks/003-minimax-prompt-framework/eval-rig/fixtures/fix-001-hallucinated-cli-flag/seed/flag-spec.md:8` fixture seed lists retired GLM and Kimi models as real flags
- F131 [P2 dead] `.opencode/skills/sk-prompt-small-model/benchmarks/004-mimo-prompt-framework/eval/run-mimo-bench.cjs:14` MiMo benchmark harness advertises removed free gateway smoke model
- F132 [P2 dead] `ALL commands (code-index registry)` code_graph_classify_query_intent and code_graph_verify never declared in any command
- F133 [P2 dead] `ALL commands (skill-advisor registry)` skill_graph_propagate_enhances and skill_graph_validate never declared in any command
- F134 [P2 contradiction] `.opencode/skills/system-spec-kit/mcp_server/database/vectors/README.md:148-156` Vector shard README flow omits the vec_memories query surface it declares
- F137 [P2 drift] `.opencode/commands/doctor/_routes.yaml:67` causal-graph route lists memory_causal_stats which has mutating backfill parameter
- F138 [P2 drift] `.opencode/specs/system-spec-kit/028-memory-search-intelligence/research/drift-audit-2026-06-27/research.md:94` Stored audit cites a nonexistent drift-guard line
- F139 [P2 misalignment] `.opencode/commands/doctor/assets/doctor_speckit_presentation.txt:69-97` presentation contract missing parent-skill and fable-mode targets from valid-targets list and subsystem manifest
- F140 [P2 dead] `.opencode/commands/speckit/complete.md:4` complete.md router allows memory_context never invoked as mcp_tool in complete YAMLs
- F141 [P2 dead] `.opencode/commands/speckit/resume.md:4` resume.md router over-declares memory and checkpoint tools never invoked as mcp_tool in resume YAMLs
- F142 [P2 undocumented] `.opencode/specs/system-spec-kit/028-memory-search-intelligence/benchmark-status.md:251` Benchmark status still names graduated legacy env vars with no ENV_REFERENCE aliases
- F143 [P2 contradiction] `.opencode/specs/system-spec-kit/028-memory-search-intelligence/keep-off-flag-roadmap.md:69` Roadmap says `SPECKIT_GROUNDING_SIGNAL_V1` stays off after benchmark says deleted
- F144 [P2 undocumented] `.opencode/agents/deep-review.md:1-22` Canonical OpenCode deep-review agent omits model/reasoning metadata with no Codex-mismatch rationale
- F145 [P2 undocumented] `.claude/agents/deep-review.md:1-5` Claude deep-review agent lacks model metadata and never states it is the intended runtime for deep extended-thinking
- F146 [P2 misalignment] `.opencode/skills/deep-loop-workflows/deep-review/SKILL.md:16-19` deep-review skill lists Codex runtime path without noting the deep-thinking exclusion
- F147 [P2 misalignment] `.codex/agents/debug.toml:7` Debug Codex agent lacks the documented medium-for-fixes split
- F159 [P2 drift] `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/034-scoped-backfill-boundary/plan.md:103` Parent plan FIX ADDENDUM template instruction duplicated verbatim across 39 child plans
- F160 [P2 drift] `.opencode/skills/deep-loop-runtime/tests/unit/cli-matrix.vitest.ts:85` Command-shape tests pin real-looking model IDs
- F161 [P2 misalignment] `.opencode/skills/deep-loop-runtime/tests/unit/executor-config.vitest.ts:47` Executor config parser tests use provider-branded IDs despite no whitelist intent
- F162 [P2 drift] `.opencode/skills/deep-loop-runtime/tests/unit/executor-audit.vitest.ts:38` Audit serialization tests centralize on a stale-looking Codex model example
- F163 [P2 drift] `.opencode/skills/deep-loop-runtime/tests/unit/dispatch-failure.vitest.ts:33` Dispatch-failure tests use model names while validating failure-state behavior
- F164 [P2 misalignment] `.opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts:724` Fanout argv/env tests hard-code model examples unrelated to their assertions
- F165 [P2 contradiction] `.opencode/skills/deep-loop-runtime/tests/unit/executor-provenance-mismatch.vitest.ts:59` Native executor fixture carries a model even though native rejects models
- F169 [P2 undocumented] `.opencode/commands/memory/save.md:4` memory save is write/index heavy with no L2 retrieval precheck
- F171 [P2 misalignment] `.opencode/commands/doctor/assets/doctor_skill-budget.yaml:37` Skill-budget route declares no MCP tools but asset calls advisor_status
- F172 [P2 contradiction] `.opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:3853` Playbook index still summarizes scenario 427 as 37-tool spec-memory parity
- F173 [P2 misalignment] `.opencode/bin/README.md:68` bin README documents offline smoke as a 37/8/9 count gate
- F174 [P2 drift] `.opencode/skills/system-spec-kit/changelog/v3.5.0.5.md:13` CLI release note says TOOL_DEFINITIONS generates 37 commands
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
- Every listed finding terminal in the ledger (fixed+verified or false-positive with reason).
- opus re-read confirms evidence resolved and scope respected.
- validate.sh --strict exit 0 for this phase.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS
- A fix touches more than the cited drift (scope creep) -> opus verifies scope per file.
- A finding is a false positive -> triage before fixing; never fix a phantom.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS
- No behavior regressions; edits are doc/config/test alignment only.
- Comment hygiene: no artifact-ids or spec paths in code comments.
<!-- /ANCHOR:nfr -->

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES
- Same file cited by multiple findings -> batch edits, verify once per file.
- Evidence line numbers shifted since the audit -> verify by content, not line.
<!-- /ANCHOR:edge-cases -->

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS
None open; deferrals (if any) are recorded as false-positive with reason in the ledger.
<!-- /ANCHOR:questions -->

<!-- ANCHOR:related-docs -->
## 10. RELATED DOCS
- ../remediation-ledger.jsonl
- ../../research/drift-audit-2026-06-27/converged-report.md
<!-- /ANCHOR:related-docs -->
