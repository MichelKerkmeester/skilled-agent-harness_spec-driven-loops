---
title: "Spec Kit Memory: Manual Testing Playbook"
description: "Operator-facing reference combining the manual testing directory, integrated review/orchestration guidance, execution expectations, and per-feature validation files for the Spec Kit Memory MCP server."
last_updated: "2026-06-11"
version: 3.6.0.99
---

# Spec Kit Memory: Manual Testing Playbook

> **EXECUTION POLICY**: Every scenario MUST be executed for real — not mocked and not stubbed. AI agents executing these scenarios must run the actual commands, inspect real files, call real handlers, and verify real outputs. Valid scenario classifications are `PASS`, `FAIL`, `SKIP` (with a specific sandbox or runtime blocker documented), or `UNAUTOMATABLE` (with the concrete reason the scenario cannot be truthfully executed through the direct-handler runner). Packet-level summaries may additionally use `PARTIAL` when core behavior was observed but supporting evidence remained incomplete.

This document combines the full manual-validation contract for the Spec Kit Memory MCP server into a single reference. The root playbook acts as the operator directory, review protocol, and orchestration guide: it explains how realistic user-driven tests should be run, how evidence should be captured, how results should be graded, and where each per-feature validation file lives. The per-feature files provide the deeper execution contract for each scenario, including the user request, orchestrator prompt, execution process, source anchors, and validation criteria.

---

This playbook package adopts the Feature Catalog split-document pattern for canonical Spec Kit operator validation. The root document acts as the directory, review surface, and orchestration guide, while per-feature execution detail now lives in the category folders at the playbook root.

Canonical source artifacts:
- `.opencode/skills/system-spec-kit/manual_testing_playbook/retrieval/`
- `.opencode/skills/system-spec-kit/manual_testing_playbook/mutation/`
- `.opencode/skills/system-spec-kit/manual_testing_playbook/discovery/`
- `.opencode/skills/system-spec-kit/manual_testing_playbook/maintenance/`
- `.opencode/skills/system-spec-kit/manual_testing_playbook/lifecycle/`
- `.opencode/skills/system-spec-kit/manual_testing_playbook/analysis/`
- `.opencode/skills/system-spec-kit/manual_testing_playbook/evaluation/`
- `.opencode/skills/system-spec-kit/manual_testing_playbook/bug_fixes_and_data_integrity/`
- `.opencode/skills/system-spec-kit/manual_testing_playbook/evaluation_and_measurement/`
- `.opencode/skills/system-spec-kit/manual_testing_playbook/graph_signal_activation/`
- `.opencode/skills/system-spec-kit/manual_testing_playbook/scoring_and_calibration/`
- `.opencode/skills/system-spec-kit/manual_testing_playbook/query_intelligence/`
- `.opencode/skills/system-spec-kit/manual_testing_playbook/memory_quality_and_indexing/`
- `.opencode/skills/system-spec-kit/manual_testing_playbook/pipeline_architecture/`
- `.opencode/skills/system-spec-kit/manual_testing_playbook/retrieval_enhancements/`
- `.opencode/skills/system-spec-kit/manual_testing_playbook/tooling_and_scripts/`
- `.opencode/skills/system-spec-kit/manual_testing_playbook/governance/`
- `.opencode/skills/system-spec-kit/manual_testing_playbook/ux_hooks/`
- `.opencode/skills/system-spec-kit/manual_testing_playbook/feature_flag_reference/`
- `.opencode/skills/system-spec-kit/manual_testing_playbook/remediation_revalidation/`
- `.opencode/skills/system-spec-kit/manual_testing_playbook/implement_and_remove_deprecated_features/`
- `.opencode/skills/system-spec-kit/manual_testing_playbook/context_preservation/`
- `.opencode/skills/system-spec-kit/manual_testing_playbook/doctor_commands/`
- `.opencode/skills/system-spec-kit/manual_testing_playbook/local_llm_query_intelligence/` — local-LLM memory substrate (query intelligence + causal graph + drift detection + cross-AI handoff + concurrent multi-AI safety)
- `.opencode/skills/system-spec-kit/manual_testing_playbook/plugins_and_hooks/` — live-validation scenarios for the system-spec-kit-owned plugins/hooks (completion sentinel, spec mutation gate, speckit completion exposer, spec-memory, dist freshness, session cleanup). Scenarios for plugins whose core lives elsewhere are hosted by their owning skill: cli-external (dispatch audit), system-code-graph (freshness guard, code-graph plugin), sk-code (post-edit quality), mcp-code-mode (MCP route guard)

---

## 1. OVERVIEW

This playbook is the operator-facing manual validation directory for canonical Spec Kit features. It preserves the existing EX/PHASE/M scenario IDs and numbered feature entries, keeps root-level summaries readable, and links each scenario to a dedicated feature file with the full execution contract. Those per-feature files should mirror the feature-catalog snippet style: prose-first explanation, current reality, structured source references, and concise metadata.

Coverage note (2026-03-18): runtime-labeled scenarios in this playbook primarily prove shared-backend behavior plus multi-runtime capture/save-path handling. Unless a scenario explicitly drives a Hydra feature through a given CLI, treat runtime labels as repo-backed coverage only and not as full end-to-end Hydra parity proof for that CLI.

### Realistic Test Model

These manual tests should mimic real user behavior, not just isolated command execution. The preferred execution shape is:

1. A realistic user request is given to an orchestrator.
2. The orchestrator decides whether to work locally, delegate to sub-agents, or invoke another CLI/runtime.
3. The operator captures both the execution process and the user-visible outcome.
4. The scenario passes only when the workflow is sound and the returned result would satisfy a real user.

### What The Feature Files Should Explain

- The realistic user request that should trigger the behavior
- The orchestrator brief or agent-facing prompt that should drive the test
- The expected execution process, including delegation or external CLI use when relevant
- The desired user-visible outcome, not just the internal tool output

---

## 2. GLOBAL PRECONDITIONS
1. Working directory is project root.
2. Feature summary files are accessible.
3. Spec/memory commands are available in the runtime.
4. Manual execution logging is enabled (terminal transcript capture).
5. Destructive scenarios (`EX-008`, `EX-009`, `EX-018`, `EX-021`) MUST run only in a disposable sandbox spec folder (for example `specs/test-sandbox`), never in active project folders.
6. Before each destructive scenario, create and record a named checkpoint for rollback evidence.

---

## 3. GLOBAL EVIDENCE REQUIREMENTS
- Command transcript
- User request used
- Orchestrator or agent-facing prompt used
- Delegation or runtime-routing notes when applicable
- Output snippets
- Final user-facing response or outcome summary
- Artifact path or output reference
- Scenario verdict with rationale

---

## 4. DETERMINISTIC COMMAND NOTATION
- Replace placeholders before execution: `<target-spec>`, `<sandbox-spec>`, `<memory-id>`, `<checkpoint-name>`.
- Do not execute literal ellipsis (`...`) or omitted-argument forms; transcripts must contain fully resolved commands.
- For shorthand tool syntax, execute with explicit argument keys in runtime calls.
- When a scenario is orchestrator-led, capture both the realistic user request and the explicit orchestrator prompt before executing the deterministic steps.

---

## 5. REVIEW PROTOCOL AND RELEASE READINESS

### Inputs Required

1. `manual_testing_playbook.md`
2. Referenced per-feature files under `manual_testing_playbook/NN__category_name/`
3. Scenario execution evidence (logs, tool outputs, artifacts)
4. Feature-to-scenario coverage map
5. Triage notes for all non-pass outcomes

### Scenario Acceptance Rules

For each executed scenario, check:

1. Preconditions were satisfied.
2. Prompt and command sequence were executed as written.
3. Expected signals are present.
4. Evidence is complete and readable.
5. Outcome rationale is explicit.

Scenario verdict:
- `PASS`: all acceptance checks true
- `FAIL`: expected behavior missing, contradictory output, or critical check failed
- `SKIP`: a specific sandbox or runtime blocker prevented execution (document the blocker)
- `UNAUTOMATABLE`: the scenario cannot be truthfully executed through the direct-handler runner (document why)

`PARTIAL` is a packet-level summary classification only (core behavior observed, supporting evidence incomplete); it is not a valid per-scenario verdict.

### Feature Verdict Rules

`PARTIAL` is an aggregate evidence state, never inherited from a per-scenario `PARTIAL` (which is not a valid scenario verdict — see above):

- `PASS`: all mapped scenarios for the feature are `PASS`
- `PARTIAL`: no mapped scenario is `FAIL`, but core behavior is only partially evidenced — i.e. some mapped scenarios are `SKIP`/`UNAUTOMATABLE`, or supporting evidence for one or more `PASS` scenarios is incomplete
- `FAIL`: any mapped scenario is `FAIL`

Hard rule:
- Any critical-path scenario `FAIL` forces feature verdict to `FAIL`.

### Release Readiness Rule

Release is `READY` only when:

1. No feature verdict is `FAIL`.
2. All critical scenarios are `PASS`.
3. Coverage is 100% of playbook scenarios defined by the root index and backed by per-scenario files (`COVERED_SCENARIOS == TOTAL_SCENARIOS`).
4. Feature-catalog cross-reference coverage has been reviewed separately; scenario coverage does not imply a 1:1 feature-file count because the playbook currently contains 420 executable scenario files (category README/package-map files are excluded) while the feature catalog contains 345 feature files.
5. No unresolved blocking triage item remains.
6. Orphan scenario count does not exceed the recorded reconciliation baseline (82 as of 2026-06-16 — legacy index debt, recomputed after excluding 3 category README files; the baseline may only ratchet DOWN), and zero index links are broken.

Otherwise release is `NOT READY`.

Deterministic coverage check (run from repository root):

```bash
python3 - <<'PY'
import re
import sys
from pathlib import Path

root = Path('.opencode/skills/system-spec-kit/manual_testing_playbook')
index = root / 'manual_testing_playbook.md'

scenario_files = {
    path.relative_to(root).as_posix()
    for pattern in ('[0-9][0-9]--*/*.md', '[0-9][0-9]--*/_deprecated/*.md')
    for path in root.glob(pattern)
    if path.is_file() and path.name != 'README.md'  # category README/package-map files are not executable scenarios
}

linked = {
    re.sub(r'^\./', '', target)
    for target in re.findall(r'\]\(((?:\./)?[0-9][0-9]--[^)#]+\.md)', index.read_text())
}

failures = []
if len(scenario_files) != 420:
    failures.append(f'expected 420 scenario files, found {len(scenario_files)}')
broken = sorted(linked - scenario_files)
if broken:
    failures.append(f'{len(broken)} index link(s) resolve to no file: {broken[:5]}')
ORPHAN_RATCHET_BASELINE = 82
orphans = sorted(f for f in scenario_files - linked if '/_deprecated/' not in f)
if len(orphans) > ORPHAN_RATCHET_BASELINE:
    failures.append(f'{len(orphans)} orphan scenario file(s) exceed the recorded baseline of {ORPHAN_RATCHET_BASELINE}: {orphans[:5]}')

if failures:
    print('\n'.join(failures), file=sys.stderr)
    sys.exit(1)
print(f'OK: {len(scenario_files)} files, {len(linked)} index links, 0 broken, {len(orphans)} orphans (baseline {ORPHAN_RATCHET_BASELINE})')
PY
```

Final verdict report must include `COVERED_SCENARIOS/TOTAL_SCENARIOS` and should call out any remaining feature-catalog entries that are automated-only, indirect, or intentionally operator-only.
As of 2026-07-05, the deterministic executable-scenario file count is 420 (category README/package-map files excluded). Scenarios 450-455 are the current high-water entries: graceful embedder-degrade to lexical (450), the constitutional self-edit and compare-and-swap guard (451), background enrichment pending/failed gauges (452), the Speckit autopilot lifecycle (453), goal OpenCode plugin active-goal injection and status (454), and validate.sh dist-freshness backstop (compiled validation orchestrator, exit 3) (455). Scenario 419 is the runtime lifecycle guardrail entry for orphan MCP cleanup. Scenarios 421-426 are the daemon-reliability hardening entries. Scenarios 427-438 and 449 are the MCP-to-CLI program entries: daemon-backed CLI surfaces (427-431), the tri-daemon program gate (432), runtime warm-only hook fallbacks (433), CLI stress set (434-438), and compact/completion automation (449). Scenarios 439-448 are the release-hardening entries for default-off flags, retrieval observability, and governance guards. Broader legacy index reconciliation remains governed by the release-readiness rule above.

### Destructive Scenario Rules

- `EX-008`, `EX-009`, `EX-018`, and `EX-021` MUST run on non-production data only.
- Before executing, verify the affected resource can be rebuilt from scratch.
- Never run destructive scenarios in parallel with other scenarios that depend on the same resource.

### Memory/Spec-Kit Mandatory Flows

Treat the root playbook plus referenced per-feature files as the canonical source of truth:
- `M-001 Context Recovery and Continuation`
- `M-002 Targeted Memory Lookup`
- `M-003 Context Save + Index Update`
- `M-004 Main-Agent Review and Verdict Handoff`
- `M-005 Outsourced Agent Memory Capture Round-Trip`
- `M-006 Stateless Enrichment and Alignment Guardrails`

Rule: keep global verdict logic in the root playbook. Put feature-specific acceptance caveats in the relevant per-feature file instead of in a separate sidecar document.

---

## 6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING

This section records coordinator/worker utilization guidance for assembling or reviewing playbook bundles. It is not a runtime support matrix and does not, by itself, prove Hydra feature parity for OpenCode or any other CLI.

The wave plans here apply to the split playbook package: the root `manual_testing_playbook.md` acts as the directory, review surface, and orchestration guide, while the detailed scenario contracts live in the category folders at the playbook root.

### Run A: OpenCode 5.3 xhigh (Observed)

Observed orchestration:
- Hard cap detected: 6 total sub-agent threads
- Effective model: 1 coordinator + 5 workers
- Saturation strategy: full worker saturation in waves

| Runtime | Reported/Observed Capacity | Workers Used | Coordinator | Wave Count | Saturation |
|---|---:|---:|---:|---:|---:|
| OpenCode 5.3 xhigh | 6 total | 5 | 1 | 2 | 100% while active |

### Merged Operational Rule

1. Probe runtime capacity at start.
2. Reserve one coordinator.
3. Saturate remaining worker slots.
4. Pre-assign explicit scenario IDs, per-feature files, and ranges to each wave before execution.
5. Run destructive scenarios (`EX-008`, `EX-009`, `EX-018`, `EX-021`) in dedicated sandbox-only waves.
6. After each wave, execute playbook `M-003` (save + index), then begin the next wave via `M-001` continuation.
7. Record utilization table and evidence paths in the final report.

### What Belongs In Per-Feature Files

Use the per-feature files for feature-specific:
- Real user requests
- Orchestrator prompts
- Expected delegation or alternate-CLI routing
- Desired user-visible outcomes
- Isolation constraints or acceptance caveats that do not apply globally

---

## 7. EXISTING FEATURES

### EX-001 | Unified context retrieval (memory_context)

#### Description
Intent-aware context pull.

#### Scenario Contract
Prompt: `Validate memory_context recovery via /speckit:resume specs/<target-spec> and confirm bounded context is relevant and non-empty.`

Relevant bounded context returned; auto-resume context stays within budget

#### Test Execution
> **Feature File:** [EX-001](retrieval/unified_context_retrieval_memory_context.md)
> **Catalog:** [retrieval/unified_context_retrieval_memorycontext.md](../feature_catalog/retrieval/unified_context_retrieval_memorycontext.md)

### EX-002 | Semantic and lexical search (memory_search)

#### Description
Hybrid precision check.

#### Scenario Contract
Prompt: `Validate memory_search hybrid retrieval for checkpoint rollback and confirm ranked results include relevant hybrid signals.`

Relevant ranked results with hybrid signals

Additional audit scenario: `Run memory_search against a fixture set that contains one expired memory, one live memory, and enough constitutional rows to overflow a tiny limit. Capture the evidence needed to prove multi-concept search excludes the expired row, constitutional injection never returns more than the requested limit, and malformed embeddings fail with a clear validation-style error instead of a raw sqlite-vec exception. Return a concise user-facing pass/fail verdict with the main reason.`

Expired rows excluded from multi-concept search; constitutional injection respects caller limit; malformed embeddings fail with clear validation errors

#### Test Execution
> **Feature File:** [EX-002](retrieval/semantic_and_lexical_search_memory_search.md)
> **Catalog:** [retrieval/semantic_and_lexical_search_memorysearch.md](../feature_catalog/retrieval/semantic_and_lexical_search_memorysearch.md)

### EX-003 | Trigger phrase matching (memory_match_triggers)

#### Description
Fast recall path.

#### Scenario Contract
Prompt: `Validate memory_match_triggers with cognitive enrichment and confirm trigger hits, cache reload, and prepared-statement reuse.`

Fast in-scope trigger hits + cognitive enrichment; out-of-scope matches filtered

#### Test Execution
> **Feature File:** [EX-003](retrieval/trigger_phrase_matching_memory_match_triggers.md)
> **Catalog:** [retrieval/trigger_phrase_matching_memorymatchtriggers.md](../feature_catalog/retrieval/trigger_phrase_matching_memorymatchtriggers.md)

### EX-004 | Hybrid search pipeline

#### Description
Confirm multi-channel fusion stays coherent when routing and fallback interact.

#### Scenario Contract
Prompt: `Validate hybrid search trace behavior and confirm fusion, score aliases, graph suppression, and lexical fallback stay coherent.`

Non-empty result set with trace evidence of multi-channel contribution; aligned boosted scores across the exposed score aliases; `useGraph:false` suppresses both graph and degree contributions even during fallback; lexical fallback only uses still-allowed lexical channels

#### Test Execution
> **Feature File:** [EX-004](retrieval/hybrid_search_pipeline.md)
> **Catalog:** [retrieval/hybrid_search_pipeline.md](../feature_catalog/retrieval/hybrid_search_pipeline.md)

### EX-005 | 4-stage pipeline architecture

#### Description
Stage invariant verification.

#### Scenario Contract
Prompt: `Validate the 4-stage memory_search pipeline and confirm invariant-free execution with stable final scoring.`

Deep-mode reformulation and HyDE candidates pass the same scope, tier, contextType and qualityThreshold filters before merge; constitutional injection obeys shouldApplyScopeFiltering; chunk reassembly accepts both snake_case and camelCase chunk metadata

#### Test Execution
> **Feature File:** [EX-005](retrieval/4_stage_pipeline_architecture.md)
> **Catalog:** [retrieval/4_stage_pipeline_architecture.md](../feature_catalog/retrieval/4_stage_pipeline_architecture.md)

### EX-006 | Memory indexing (memory_save)

#### Description
8-category canonical continuity save routing.

#### Scenario Contract
Prompt: `As a mutation validation operator, validate Memory indexing (memory_save) against memory_save(filePath). Verify the 8-category content router chooses the correct target or safe refusal; spec-doc continuity updates when the route merges; description.json and graph-metadata.json refresh on every successful canonical save; searchable result appears for merged saves; and no template-contract or insufficiency rejection appears. Return a concise pass/fail verdict with the main reason and cited evidence.`

Correct route or safe refusal reported; spec-doc continuity updated for merged saves; searchable result appears; no template-contract or insufficiency rejection

#### Test Execution
> **Feature File:** [EX-006](mutation/memory_indexing_memory_save.md)
> **Catalog:** [mutation/memory_indexing_memorysave.md](../feature_catalog/mutation/memory_indexing_memorysave.md)

### EX-007 | Memory metadata update (memory_update)

#### Description
Metadata + re-embed update.

#### Scenario Contract
Prompt: `As a mutation validation operator, validate Memory metadata update (memory_update) against memory_update(id,title,triggers). Verify updated metadata reflected in retrieval. Return a concise pass/fail verdict with the main reason and cited evidence.`

Updated metadata reflected in retrieval

Additional audit scenario: `Update a spec-doc record with new title, trigger phrases and a replacement embedding while forcing one failed vec write before a successful retry. Capture the evidence needed to prove the row stays pending until the vector write completes, never reports false success on the failed attempt, and cached searches reflect the successful metadata update immediately afterward. Return a concise user-facing pass/fail verdict with the main reason.`

Pending-until-written embedding status; no false-success state; post-update cached search refreshes immediately

#### Test Execution
> **Feature File:** [EX-007](mutation/memory_metadata_update_memory_update.md)
> **Catalog:** [mutation/memory_metadata_update_memoryupdate.md](../feature_catalog/mutation/memory_metadata_update_memoryupdate.md)

### EX-008 | Single and folder delete (memory_delete)

#### Description
Atomic single delete.

#### Scenario Contract
Prompt: `As a mutation validation operator, validate Single and folder delete (memory_delete) against checkpoint_create(name:"pre-ex008-delete",specFolder:"<sandbox-spec>"). Verify deleted item absent from retrieval. Return a concise pass/fail verdict with the main reason and cited evidence.`

Deleted item absent from retrieval

#### Test Execution
> **Feature File:** [EX-008](mutation/single_and_folder_delete_memory_delete.md)
> **Catalog:** [mutation/single_and_folder_delete_memorydelete.md](../feature_catalog/mutation/single_and_folder_delete_memorydelete.md)

### EX-009 | Tier-based bulk deletion (memory_bulk_delete)

#### Description
Tier cleanup with safety.

#### Scenario Contract
Prompt: `As a mutation validation operator, validate Tier-based bulk deletion (memory_bulk_delete) against checkpoint_create(name:"pre-ex009-bulk-delete",specFolder:"<sandbox-spec>"). Verify scoped deletion count + checkpoint created. Return a concise pass/fail verdict with the main reason and cited evidence.`

Scoped deletion count + checkpoint created

#### Test Execution
> **Feature File:** [EX-009](mutation/tier_based_bulk_deletion_memory_bulk_delete.md)
> **Catalog:** [mutation/tier_based_bulk_deletion_memorybulkdelete.md](../feature_catalog/mutation/tier_based_bulk_deletion_memorybulkdelete.md)

### EX-010 | Validation feedback (memory_validate)

#### Description
Feedback learning loop.

#### Scenario Contract
Prompt: `As a mutation validation operator, validate Validation feedback (memory_validate) against memory_validate(memoryId,helpful:true,queryId). Verify confidence/promotion metadata updates. Return a concise pass/fail verdict with the main reason and cited evidence.`

Confidence/promotion metadata updates

#### Test Execution
> **Feature File:** [EX-010](mutation/validation_feedback_memory_validate.md)
> **Catalog:** [mutation/validation_feedback_memoryvalidate.md](../feature_catalog/mutation/validation_feedback_memoryvalidate.md)

### EX-011 | Memory browser (memory_list)

#### Description
Folder inventory audit.

#### Scenario Contract
Prompt: `Validate memory_list folder inventory and confirm paginated results and totals are present with cited pass/fail evidence.`

Paginated list and totals

#### Test Execution
> **Feature File:** [EX-011](discovery/memory_browser_memory_list.md)
> **Catalog:** [discovery/memory_browser_memorylist.md](../feature_catalog/discovery/memory_browser_memorylist.md)

### EX-012 | System statistics (memory_stats)

#### Description
System baseline snapshot.

#### Scenario Contract
Prompt: `Validate memory_stats with composite folder ranking and scores, confirming counts, tiers, folder ranking, and partial-bucket totals.`

Counts, tiers, folder ranking present

Additional audit scenario: `Return memory_stats from a fixture set that includes at least one partial embedding_status row. Capture the evidence needed to prove the response exposes a partial bucket and that total equals pending + success + failed + retry + partial. Return a concise user-facing pass/fail verdict with the main reason.`

Partial bucket present and included in totals

#### Test Execution
> **Feature File:** [EX-012](discovery/system_statistics_memory_stats.md)
> **Catalog:** [discovery/system_statistics_memorystats.md](../feature_catalog/discovery/system_statistics_memorystats.md)

### EX-013 | Health diagnostics (memory_health)

#### Description
Index/FTS integrity check.

#### Scenario Contract
Prompt: `Validate memory_health full diagnostics and confirm healthy/degraded status with actionable pass/fail evidence.`

healthy/degraded status and diagnostics

Additional contract (026 index block): `Run memory_health and confirm the response includes an index block with a summary enum value drawn from: healthy_fresh, healthy_lagging_vectors, stale_needs_scan, degraded_needs_repair, or unavailable. Verify the index block also exposes indexed, pending, and failed counts. Return a concise pass/fail verdict with the main reason and cited field names.`

index.summary is one of the documented enum values; index.indexed, index.pending and index.failed are all present as numeric fields

#### Test Execution
> **Feature File:** [EX-013](discovery/health_diagnostics_memory_health.md)
> **Catalog:** [discovery/health_diagnostics_memoryhealth.md](../feature_catalog/discovery/health_diagnostics_memoryhealth.md)

### EX-014 | Workspace scanning and indexing (memory_index_scan)

#### Description
Incremental sync run.

#### Scenario Contract
Prompt: `Validate memory_index_scan incremental sync, spec-doc warn-only indexing, and atomic lease acquisition, rejection, expiry, and completion.`

Scan summary, updated index state, and spec-doc warn-only indexing behavior

Additional contract (026 self-maintaining behavior): `Run two overlapping memory_index_scan calls and confirm the second returns a success envelope with coalesced:true rather than a raw E429. Then run a scan after saving a document whose spec folder has been renamed and confirm the handler heals the move by packet identity without re-embedding the content. Capture evidence that a completed scan result can carry status complete_with_pending_vectors with a non-zero pendingVectors count when vectors are still draining. Return a concise pass/fail verdict with cited field names.`

Overlapping scan returns coalesced:true success envelope instead of E429; renamed spec folder healed by packet identity without re-embedding; complete_with_pending_vectors status present with non-zero pendingVectors when vectors are still draining; BM25/FTS rows are searchable while vectors drain (lexical-first commit confirmed)

#### Test Execution
> **Feature File:** [EX-014](maintenance/workspace_scanning_and_indexing_memory_index_scan.md)
> **Catalog:** [maintenance/workspace_scanning_and_indexing_memoryindexscan.md](../feature_catalog/maintenance/workspace_scanning_and_indexing_memoryindexscan.md)

### EX-015 | Checkpoint creation (checkpoint_create)

#### Description
Pre-destructive backup.

#### Scenario Contract
Prompt: `Validate Checkpoint creation with checkpoint_create(name,specFolder), verify the new checkpoint is listed, and return a concise verdict with evidence.`

New checkpoint listed

#### Test Execution
> **Feature File:** [EX-015](lifecycle/checkpoint_creation_checkpoint_create.md)
> **Catalog:** [lifecycle/checkpoint_creation_checkpointcreate.md](../feature_catalog/lifecycle/checkpoint_creation_checkpointcreate.md)

### EX-016 | Checkpoint listing (checkpoint_list)

#### Description
Recovery asset discovery.

#### Scenario Contract
Prompt: `Validate Checkpoint listing with checkpoint_list(specFolder,limit), verify available restore points are displayed, and return a concise verdict with evidence.`

Available restore points displayed

#### Test Execution
> **Feature File:** [EX-016](lifecycle/checkpoint_listing_checkpoint_list.md)
> **Catalog:** [lifecycle/checkpoint_listing_checkpointlist.md](../feature_catalog/lifecycle/checkpoint_listing_checkpointlist.md)

### EX-017 | Checkpoint restore (checkpoint_restore)

#### Description
Rollback restore drill.

#### Scenario Contract
Prompt: `Validate Checkpoint restore with checkpoint_restore(name,clearExisting:false), verify restored data and healthy state, and return a concise verdict with evidence.`

Restored data + healthy state

#### Test Execution
> **Feature File:** [EX-017](lifecycle/checkpoint_restore_checkpoint_restore.md)
> **Catalog:** [lifecycle/checkpoint_restore_checkpointrestore.md](../feature_catalog/lifecycle/checkpoint_restore_checkpointrestore.md)

### EX-018 | Checkpoint deletion (checkpoint_delete)

#### Description
Old snapshot cleanup.

#### Scenario Contract
Prompt: `Validate Checkpoint deletion in the sandbox list, verify the removed checkpoint is absent, and return a concise verdict with evidence.`

Removed checkpoint absent from list

#### Test Execution
> **Feature File:** [EX-018](lifecycle/checkpoint_deletion_checkpoint_delete.md)
> **Catalog:** [lifecycle/checkpoint_deletion_checkpointdelete.md](../feature_catalog/lifecycle/checkpoint_deletion_checkpointdelete.md)

### EX-019 | Causal edge creation (memory_causal_link)

#### Description
Causal provenance linking.

#### Scenario Contract
Prompt: `Validate memory_causal_link causal provenance and exact-first batch reference resolution; return pass/fail with cited evidence.`

Edge appears in chain trace

#### Test Execution
> **Feature File:** [EX-019](analysis/causal_edge_creation_memory_causal_link.md)
> **Catalog:** [analysis/causal_edge_creation_memorycausallink.md](../feature_catalog/analysis/causal_edge_creation_memorycausallink.md)

### EX-020 | Causal graph statistics (memory_causal_stats)

#### Description
Graph coverage review.

#### Scenario Contract
Prompt: `Validate memory_causal_stats per-window metrics across balanced, skewed, and cap-trigger corpora; return pass/fail with cited evidence.`

Coverage and edge metrics present

#### Test Execution
> **Feature File:** [EX-020](analysis/causal_graph_statistics_memory_causal_stats.md)
> **Catalog:** [analysis/causal_graph_statistics_memorycausalstats.md](../feature_catalog/analysis/causal_graph_statistics_memorycausalstats.md)

### EX-021 | Causal edge deletion (memory_causal_unlink)

#### Description
Edge correction.

#### Scenario Contract
Prompt: `Validate memory_causal_unlink removes the target edge after checkpoint creation; return pass/fail with cited evidence.`

Removed edge absent in trace

#### Test Execution
> **Feature File:** [EX-021](analysis/causal_edge_deletion_memory_causal_unlink.md)
> **Catalog:** [analysis/causal_edge_deletion_memorycausalunlink.md](../feature_catalog/analysis/causal_edge_deletion_memorycausalunlink.md)

### EX-022 | Causal chain tracing (memory_drift_why)

#### Description
Decision why-trace.

#### Scenario Contract
Prompt: `Validate memory_drift_why returns the expected causal chain relations; return pass/fail with cited evidence.`

Chain includes expected relations

#### Test Execution
> **Feature File:** [EX-022](analysis/causal_chain_tracing_memory_drift_why.md)
> **Catalog:** [analysis/causal_chain_tracing_memorydriftwhy.md](../feature_catalog/analysis/causal_chain_tracing_memorydriftwhy.md)

### EX-023 | Epistemic baseline capture (task_preflight)

#### Description
Pre-task baseline logging.

#### Scenario Contract
Prompt: `Validate task_preflight persists the epistemic baseline record; return pass/fail with cited evidence.`

Baseline record created

#### Test Execution
> **Feature File:** [EX-023](analysis/epistemic_baseline_capture_task_preflight.md)
> **Catalog:** [analysis/epistemic_baseline_capture_taskpreflight.md](../feature_catalog/analysis/epistemic_baseline_capture_taskpreflight.md)

### EX-024 | Post-task learning measurement (task_postflight)

#### Description
Learning closeout.

#### Scenario Contract
Prompt: `Validate task_postflight saves the learning delta record; return pass/fail with cited evidence.`

Delta/learning record saved

#### Test Execution
> **Feature File:** [EX-024](analysis/post_task_learning_measurement_task_postflight.md)
> **Catalog:** [analysis/post_task_learning_measurement_taskpostflight.md](../feature_catalog/analysis/post_task_learning_measurement_taskpostflight.md)

### EX-025 | Learning history (memory_get_learning_history)

#### Description
Trend review.

#### Scenario Contract
Prompt: `Validate memory_get_learning_history returns completed learning cycles for the spec folder; return pass/fail with cited evidence.`

Historical entries returned; fresh DB init succeeds; NaN rejected

#### Test Execution
> **Feature File:** [EX-025](analysis/learning_history_memory_get_learning_history.md)
> **Catalog:** [analysis/learning_history_memorygetlearninghistory.md](../feature_catalog/analysis/learning_history_memorygetlearninghistory.md)

### EX-026 | Ablation studies (eval_run_ablation)

#### Description
Channel impact experiment.

#### Scenario Contract
Prompt: `Validate eval_run_ablation ablation reporting, including baseline recall, channel deltas, fts5 verdict, query-ID status, and provenance/truncation evidence.`

Baseline recall, per-channel deltas, focused fts5 verdict, and provenance/truncation status are all explicit

#### Test Execution
> **Feature File:** [EX-026](evaluation/ablation_studies_eval_run_ablation.md)
> **Catalog:** [evaluation/ablation_studies_evalrunablation.md](../feature_catalog/evaluation/ablation_studies_evalrunablation.md)

### EX-027 | Reporting dashboard (eval_reporting_dashboard)

#### Description
Eval reporting pass.

#### Scenario Contract
Prompt: `Validate eval_reporting_dashboard text and JSON reporting, including sprint limits, chronological ordering, active DB selection, and parent-memory aggregation.`

Trend/channel/summary data present in supported runtime formats; active eval DB remains selected; request limit trims sprint groups rather than raw runs; chunk-backed rows aggregate to parent memory IDs

#### Test Execution
> **Feature File:** [EX-027](evaluation/reporting_dashboard_eval_reporting_dashboard.md)
> **Catalog:** [evaluation/reporting_dashboard_evalreportingdashboard.md](../feature_catalog/evaluation/reporting_dashboard_evalreportingdashboard.md)

### EX-028 | 1. Search Pipeline Features (SPECKIT_*)

#### Description
Flag catalog verification with inert and retired surface cleanup.

#### Scenario Contract
Prompt: `Validate 1. Search Pipeline Features (SPECKIT_*) against memory_search({ query: "SPECKIT search pipeline flags active inert retired RSF shadow scoring", limit: 20 }).`

Accurate active/inert/retired classification; retired topics absent from active manual-test guidance

#### Test Execution
> **Feature File:** [EX-028](feature_flag_reference/1_search_pipeline_features_speckit.md)
> **Catalog:** [feature_flag_reference/1_search_pipeline_features_speckit.md](../feature_catalog/feature_flag_reference/1_search_pipeline_features_speckit.md)

### EX-029 | 2. Session and Cache

#### Description
Session policy audit.

#### Scenario Contract
Prompt: `Validate 2. Session and Cache against memory_search({ query:"DISABLE_SESSION_DEDUP session cache policy settings", limit:20 }).`

Session/cache controls found

#### Test Execution
> **Feature File:** [EX-029](feature_flag_reference/2_session_and_cache.md)
> **Catalog:** [feature_flag_reference/2_session_and_cache.md](../feature_catalog/feature_flag_reference/2_session_and_cache.md)

### EX-030 | 3. MCP Configuration

#### Description
MCP limits audit.

#### Scenario Contract
Prompt: `Validate 3. MCP Configuration against memory_search({ query:"MCP_MAX_MEMORY_TOKENS validation settings defaults", limit:20 }).`

MCP guardrails returned

#### Test Execution
> **Feature File:** [EX-030](feature_flag_reference/3_mcp_configuration.md)
> **Catalog:** [feature_flag_reference/3_mcp_configuration.md](../feature_catalog/feature_flag_reference/3_mcp_configuration.md)

### EX-031 | 4. Memory and Storage

#### Description
Storage precedence check.

#### Scenario Contract
Prompt: `Validate 4. Memory and Storage against memory_search({ query: "SPEC_KIT_DB_DIR SPECKIT_DB_DIR MEMORY_DB_PATH database path precedence", limit: 20 }).`

Precedence chain identified

#### Test Execution
> **Feature File:** [EX-031](feature_flag_reference/4_memory_and_storage.md)
> **Catalog:** [feature_flag_reference/4_memory_and_storage.md](../feature_catalog/feature_flag_reference/4_memory_and_storage.md)

### EX-032 | 5. Embedding and API

#### Description
Provider selection audit.

#### Scenario Contract
Prompt: `Validate 5. Embedding and API against memory_search({ query:"EMBEDDINGS_PROVIDER auto provider selection rules ollama hf-local nomic-embed-text-v1.5 local defaults", limit:20 }).`

Provider rules show explicit provider override, local-first auto mode (`ollama` before `hf-local`), cloud providers selected only by explicit `EMBEDDINGS_PROVIDER` or later fallback, and current `nomic-embed-text-v1.5` local default/fallback model IDs.

#### Test Execution
> **Feature File:** [EX-032](feature_flag_reference/5_embedding_and_api.md)
> **Catalog:** [feature_flag_reference/5_embedding_and_api.md](../feature_catalog/feature_flag_reference/5_embedding_and_api.md)

### EX-033 | 6. Debug and Telemetry

#### Description
Observability toggle check.

#### Scenario Contract
Prompt: `Validate 6. Debug and Telemetry against memory_search({ query:"DEBUG_TRIGGER_MATCHER telemetry opt-in inert flags", limit:20 }).`

Debug/telemetry controls identified

#### Test Execution
> **Feature File:** [EX-033](feature_flag_reference/6_debug_and_telemetry.md)
> **Catalog:** [feature_flag_reference/6_debug_and_telemetry.md](../feature_catalog/feature_flag_reference/6_debug_and_telemetry.md)

### EX-034 | 7. CI and Build (informational)

#### Description
Branch metadata source audit.

#### Scenario Contract
Prompt: `Validate 7. CI and Build (informational) against memory_search({ query:"GIT_BRANCH BRANCH_NAME checkpoint metadata", limit:20 }).`

Branch source vars surfaced

#### Test Execution
> **Feature File:** [EX-034](feature_flag_reference/7_ci_and_build_informational.md)
> **Catalog:** [feature_flag_reference/7_ci_and_build_informational.md](../feature_catalog/feature_flag_reference/7_ci_and_build_informational.md)

### EX-035 | Startup runtime compatibility guards

#### Description
Startup diagnostics verification.

#### Scenario Contract
Prompt: `Validate startup runtime compatibility guards and confirm the targeted diagnostics suite covers runtime mismatch, marker creation, and SQLite diagnostics.`

Targeted suite passes; runtime mismatch, marker creation, and SQLite diagnostics coverage are visible in the transcript

#### Test Execution
> **Feature File:** [EX-035](maintenance/startup_runtime_compatibility_guards.md)
> **Catalog:** [maintenance/startup_runtime_compatibility_guards.md](../feature_catalog/maintenance/startup_runtime_compatibility_guards.md)


### EX-037 | Checkpoint v2 file-snapshot round-trip (checkpoint_create / checkpoint_restore)

#### Description
Full-DB v2 rollback net: `VACUUM INTO` create then restore round-trip. Sandbox-only.

#### Scenario Contract
Prompt: `Validate the v2 full-DB checkpoint path: create an unscoped checkpoint with includeEmbeddings, confirm snapshot_format='v2' and a snapshot_path directory, then restore it into an isolated scratch copy and confirm memory_health consistency. Return a concise pass/fail verdict with cited field names.`

snapshot_format='v2' with a populated snapshot_path and manifest.json; restore round-trip restores main plus the active_vec shard; memory_health reports rowsTotal == ftsRowsTotal == vecRowsTotal; restore-journal (swap-pending -> swap-done) gives crash-safe recovery

#### Test Execution
> **Feature File:** [EX-037](lifecycle/checkpoint_v2_file_snapshot_roundtrip.md)

### EX-038 | Post-insert enrichment lifecycle (schema v30)

#### Description
post_insert_enrichment_status lifecycle after memory_save, with repair-on-replay and scan-lease backfill.

#### Scenario Contract
Prompt: `Validate the schema v30 post-insert enrichment lifecycle: after memory_save, confirm post_insert_enrichment_status transitions toward complete; then confirm an incomplete (pending/partial/failed) marker is repaired on replay and backfilled during a leased memory_index_scan. Return a concise pass/fail verdict with cited field names.`

post_insert_enrichment_status converges to complete for a healthy save; incomplete (pending/partial/failed) markers are re-run by repairEnrichmentOnReplay; repairIncompleteMarkers backfills incomplete markers during a leased scan and reports a repaired count; complete/deferred markers are left untouched

#### Test Execution
> **Feature File:** [EX-038](maintenance/post_insert_enrichment_lifecycle_v30.md)

### EX-039 | index_scan phased-async refinements (move reconciliation, active-row uniqueness, repair counts)

#### Description
walk -> commit-lexical -> async vector drain, packet_id move reconciliation, migration-28 active-row uniqueness, response repair counts.

#### Scenario Contract
Prompt: `Validate the index_scan phased-async refinements: confirm lexical rows are searchable before vectors drain (complete_with_pending_vectors with pendingVectors), a moved file is reconciled in place by packet identity (moveReconciled), the migration-28 active-row uniqueness guard holds, and the response surfaces repair counts. Return a concise pass/fail verdict with cited field names.`

status complete_with_pending_vectors with non-zero pendingVectors while vectors drain; BM25/FTS rows searchable before vectors finish; moveReconciled > 0 when a tracked file moved; no duplicate active logical-key rows (mig 28); response carries moveReconciled, staleDeleted, orphan-sweep, and checkpointRepair counts

#### Test Execution
> **Feature File:** [EX-039](maintenance/index_scan_phased_async_refinements.md)

### EX-040 | MCP front-proxy reconnect, SPECKIT_BACKEND_ONLY, and -32002 vs -32001

#### Description
Transparent backend RSS-recycle (-32001 retryable-recycle), backend-only mode, and -32002 fail-closed protocol mismatch. Sandbox-only.

#### Scenario Contract
Prompt: `Validate the front-proxy reconnect contract: confirm a backend recycle is transparent via -32001 retryable-recycle, SPECKIT_BACKEND_ONLY=1 puts the server in backend mode behind the proxy, and a protocol-version mismatch fails closed with -32002 (terminal CLOSED, non-retryable). Return a concise pass/fail verdict with cited error codes.`

a backend recycle reattaches transparently (-32001 RETRYABLE_RECYCLE_ERROR, retryable:true; LIVE, not removed); SPECKIT_BACKEND_ONLY=1 makes the server skip its own stdio transport; a protocol-version mismatch surfaces -32002 PROTOCOL_MISMATCH_ERROR (retryable:false) and the proxy goes terminal CLOSED

#### Test Execution
> **Feature File:** [EX-040](pipeline_architecture/front_proxy_reconnect_and_backend_only.md)

### EX-041 | sk-git worktree convention (wt/{NNNN}-{name} under .worktrees/)

#### Description
Numbered-worktree convention validation: branch wt/{NNNN}-{name}, directory .worktrees/{NNNN}-{name}, 4-digit global max+1 counter. No git writes beyond the worktree add.

#### Scenario Contract
Prompt: `Validate the sk-git worktree convention: create a wt/{NNNN}-{name} worktree using the 4-digit global max+1 counter, confirm the matching .worktrees/{NNNN}-{name} directory exists, and confirm the number is one greater than the existing maximum (or 0001 if none). Return a concise pass/fail verdict with cited paths.`

new branch named wt/{NNNN}-{name}; worktree directory .worktrees/{NNNN}-{name}; {NNNN} equals max(existing NNNN under .worktrees/) + 1 (or 0001 when none), 4-digit zero-padded; no commit/push/merge performed

#### Test Execution
> **Feature File:** [EX-041](tooling_and_scripts/sk_git_worktree_convention.md)

### EX-042 | Checkpoint v2 .needs-rebuild self-heal (boot / scan-lease)

#### Description
Post-restore .needs-rebuild sentinel repaired at daemon boot and during a leased memory_index_scan. Sandbox-only.

#### Scenario Contract
Prompt: `Validate the .needs-rebuild self-heal: confirm the sentinel is repaired at daemon boot and during a memory_index_scan after the scan lease is acquired, and that a successful repair clears the sentinel. Return a concise pass/fail verdict with cited field names.`

repairNeedsRebuildSentinel reports sentinelPresent, attempted, completed, failed, skipped, cleared; the sentinel is repaired and cleared at boot (runCheckpointNeedsRebuildRepair) and during a leased scan (runCheckpointNeedsRebuildRepairForScan, after acquireIndexScanLease); the scan response surfaces the repair counts

#### Test Execution
> **Feature File:** [EX-042](lifecycle/checkpoint_v2_needs_rebuild_self_heal.md)

---

## 8. FEATURES

Note: 042, 119, 131, and 132 all map to the same catalog entry for spec folder description discovery.

### 001 | Graph channel ID fix (G1)

#### Description
Confirm graph hits are non-zero when edges exist.

#### Scenario Contract
Prompt: `Validate Graph channel ID fix (G1) and confirm graph hits are non-zero when causal edges exist.`

Graph channel returns >0 hits when causal edges exist

#### Test Execution
> **Feature File:** [001](bug_fixes_and_data_integrity/graph_channel_id_fix_g1.md)
> **Catalog:** [bug_fixes_and_data_integrity/graph_channel_id_fix.md](../feature_catalog/bug_fixes_and_data_integrity/graph_channel_id_fix.md)

### 002 | Chunk collapse deduplication (G3)

#### Description
Confirm dedup in default mode.

#### Scenario Contract
Prompt: `Validate chunk collapse deduplication (G3) for memory_search(includeContent:false) and confirm collapsed chunks return unique parent IDs.`

No duplicate memory IDs in results; collapsed chunks yield unique parents only

#### Test Execution
> **Feature File:** [002](bug_fixes_and_data_integrity/chunk_collapse_deduplication_g3.md)
> **Catalog:** [bug_fixes_and_data_integrity/chunk_collapse_deduplication.md](../feature_catalog/bug_fixes_and_data_integrity/chunk_collapse_deduplication.md)

### 003 | Co-activation fan-effect divisor (R17)

#### Description
Confirm hub dampening.

#### Scenario Contract
Prompt: `Validate co-activation fan-effect divisor (R17) and confirm hub scores dampen by fan-out without changing non-hub scores.`

Hub node score dampened proportionally to fan-out degree; non-hub scores unaffected

#### Test Execution
> **Feature File:** [003](bug_fixes_and_data_integrity/co_activation_fan_effect_divisor_r17.md)
> **Catalog:** [bug_fixes_and_data_integrity/co_activation_fan_effect_divisor.md](../feature_catalog/bug_fixes_and_data_integrity/co_activation_fan_effect_divisor.md)

### 004 | SHA-256 content-hash deduplication (TM-02)

#### Description
Confirm identical re-save skips embedding.

#### Scenario Contract
Prompt: `Validate SHA-256 content-hash deduplication (TM-02) and confirm identical re-saves skip embeddings with exact-match SQL probes.`

Second save returns skip/no-op status; no new embedding row created; content hash matches

#### Test Execution
> **Feature File:** [004](bug_fixes_and_data_integrity/sha_256_content_hash_deduplication_tm_02.md)
> **Catalog:** [bug_fixes_and_data_integrity/sha_256_content_hash_deduplication.md](../feature_catalog/bug_fixes_and_data_integrity/sha_256_content_hash_deduplication.md)

### 005 | Evaluation database and schema (R13-S1)

#### Description
Confirm eval data isolation.

#### Scenario Contract
Prompt: `Validate evaluation database isolation and cite whether eval tables stay separate while retrieval logging leaves the main memory DB untouched.`

Eval tables created in separate DB/schema; retrieval events logged without affecting main memory DB

#### Test Execution
> **Feature File:** [005](evaluation_and_measurement/evaluation_database_and_schema_r13_s1.md)
> **Catalog:** [evaluation_and_measurement/evaluation_database_and_schema.md](../feature_catalog/evaluation_and_measurement/evaluation_database_and_schema.md)

### 006 | Core metric computation (R13-S1)

#### Description
Confirm metric battery outputs.

#### Scenario Contract
Prompt: `Validate core metric computation and cite whether precision, recall, MRR, and NDCG are present and within valid ranges.`

Metric battery returns precision, recall, MRR, NDCG, and MAP values; contiguous top-K positions drive rank-based metrics; all outputs stay within valid ranges

#### Test Execution
> **Feature File:** [006](evaluation_and_measurement/core_metric_computation_r13_s1.md)
> **Catalog:** [evaluation_and_measurement/core_metric_computation.md](../feature_catalog/evaluation_and_measurement/core_metric_computation.md)

### 007 | Observer effect mitigation (D4)

#### Description
Confirm non-blocking logging failures.

#### Scenario Contract
Prompt: `Validate observer-effect mitigation and cite whether search still works when eval logging fails without adding latency.`

Search returns normal results even when eval logging throws; no latency spike from logging failure

#### Test Execution
> **Feature File:** [007](evaluation_and_measurement/observer_effect_mitigation_d4.md)
> **Catalog:** [evaluation_and_measurement/observer_effect_mitigation.md](../feature_catalog/evaluation_and_measurement/observer_effect_mitigation.md)

### 009 | Quality proxy formula (B7)

#### Description
Confirm proxy formula correctness.

#### Scenario Contract
Prompt: `Validate the quality proxy formula and cite whether the stored value matches manual calculation with all components present.`

Computed proxy value matches manual formula calculation within tolerance; formula components are all present

#### Test Execution
> **Feature File:** [009](evaluation_and_measurement/quality_proxy_formula_b7.md)
> **Catalog:** [evaluation_and_measurement/quality_proxy_formula.md](../feature_catalog/evaluation_and_measurement/quality_proxy_formula.md)

### 010 | Synthetic ground truth corpus (G-NEW-1, G-NEW-3 phase A)

#### Description
Confirm corpus coverage and hard negatives.

#### Scenario Contract
Prompt: `Validate the synthetic ground-truth corpus and cite coverage for intents, hard negatives, non-trigger prompts, and tier balance.`

Corpus covers all intent categories; hard negatives present; non-trigger prompts included; tier distribution balanced

#### Test Execution
> **Feature File:** [010](evaluation_and_measurement/synthetic_ground_truth_corpus_g_new_1_g_new_3_phase_a.md)
> **Catalog:** [evaluation_and_measurement/synthetic_ground_truth_corpus.md](../feature_catalog/evaluation_and_measurement/synthetic_ground_truth_corpus.md)

### 011 | BM25-only baseline (G-NEW-1)

#### Description
Confirm baseline reproducibility.

#### Scenario Contract
Prompt: `Validate the BM25-only baseline and cite whether ENABLE_BM25 produces reproducible MRR@5 with no non-BM25 trace contributions.`

BM25-only run produces reproducible MRR@5; no non-BM25 channel contributions in trace

#### Test Execution
> **Feature File:** [011](evaluation_and_measurement/bm25_only_baseline_g_new_1.md)
> **Catalog:** [evaluation_and_measurement/bm25_only_baseline.md](../feature_catalog/evaluation_and_measurement/bm25_only_baseline.md)

### 012 | Agent consumption instrumentation (G-NEW-2)

#### Description
Confirm wiring with inert runtime.

#### Scenario Contract
Prompt: `Validate agent consumption instrumentation and cite whether the logger gate stays inert while telemetry handlers remain error-free.`

Logger gate is closed (inert); telemetry handlers are wired but produce no output; no runtime errors

#### Test Execution
> **Feature File:** [012](evaluation_and_measurement/agent_consumption_instrumentation_g_new_2.md)
> **Catalog:** [evaluation_and_measurement/agent_consumption_instrumentation.md](../feature_catalog/evaluation_and_measurement/agent_consumption_instrumentation.md)

### 013 | Scoring observability (T010)

#### Description
Confirm sample logging + fail-safe.

#### Scenario Contract
Prompt: `Validate scoring observability and cite whether sampled rows are logged, sample rate is respected, and write failures do not crash search.`

Sampled scoring rows appear in observability log; write error does not crash search; sample rate respected

#### Test Execution
> **Feature File:** [013](evaluation_and_measurement/scoring_observability_t010.md)
> **Catalog:** [evaluation_and_measurement/scoring_observability.md](../feature_catalog/evaluation_and_measurement/scoring_observability.md)

### 014 | Full reporting and ablation study framework (R13-S3)

#### Description
Confirm ablation+report workflow.

#### Scenario Contract
Prompt: `Validate reporting and ablation output and cite whether each channel has deltas, dashboard trends, and no empty reports.`

Ablation run produces per-channel delta snapshots without synthetic zero-only token usage; dashboard renders with trend data from the active eval DB; sprint-group limit behavior is correct

#### Test Execution
> **Feature File:** [014](evaluation_and_measurement/full_reporting_and_ablation_study_framework_r13_s3.md)
> **Catalog:** [evaluation_and_measurement/full_reporting_and_ablation_study_framework.md](../feature_catalog/evaluation_and_measurement/full_reporting_and_ablation_study_framework.md)

### 016 | Typed-weighted degree channel (R4)

#### Description
Confirm bounded typed-degree boost.

#### Scenario Contract
Prompt: `Validate typed-weighted degree scoring and cite caps, batched cold-cache queries, cache reuse, fallback, and varied type scoring.`

Typed-degree boost bounded within configured cap; per-database cache isolation and explicit invalidation work; fallback activates when edge types missing; varied types produce different scores

#### Test Execution
> **Feature File:** [016](graph_signal_activation/typed_weighted_degree_channel_r4.md)
> **Catalog:** [graph_signal_activation/typed_weighted_degree_channel.md](../feature_catalog/graph_signal_activation/typed_weighted_degree_channel.md)

### 017 | Co-activation boost strength increase (A7)

#### Description
Confirm multiplier impact.

#### Scenario Contract
Prompt: `Validate co-activation boost strength and cite contribution delta, batched hydration, causal-neighbor query shape, and one precompute per batch.`

Increased co-activation strength produces measurably higher contribution delta vs baseline

#### Test Execution
> **Feature File:** [017](graph_signal_activation/co_activation_boost_strength_increase_a7.md)
> **Catalog:** [graph_signal_activation/co_activation_boost_strength_increase.md](../feature_catalog/graph_signal_activation/co_activation_boost_strength_increase.md)

### 018 | Edge density measurement

#### Description
Confirm edges-per-node thresholding.

#### Scenario Contract
Prompt: `Validate edge density measurement and cite whether edges/nodes ratio and threshold gate behavior are correct.`

Edge density ratio computed correctly (edges/nodes); threshold gate activates/deactivates at boundary

#### Test Execution
> **Feature File:** [018](graph_signal_activation/edge_density_measurement.md)
> **Catalog:** [graph_signal_activation/edge_density_measurement.md](../feature_catalog/graph_signal_activation/edge_density_measurement.md)

### 019 | Weight history audit tracking

#### Description
Confirm edge change logging + rollback.

#### Scenario Contract
Prompt: `Validate weight history audit tracking and cite audit rows, rollback restoration, and append-only history evidence.`

Audit rows logged for each edge strength mutation; rollback restores previous weights; audit history is append-only

#### Test Execution
> **Feature File:** [019](graph_signal_activation/weight_history_audit_tracking.md)
> **Catalog:** [graph_signal_activation/weight_history_audit_tracking.md](../feature_catalog/graph_signal_activation/weight_history_audit_tracking.md)

### 020 | Graph momentum scoring (N2a)

#### Description
Confirm 7-day delta bonus.

#### Scenario Contract
Prompt: `Validate graph momentum scoring and cite capped 7-day momentum bonus plus zero bonus for nodes without history.`

7-day momentum delta bonus applied and capped; nodes with no history get zero bonus; cap enforced

#### Test Execution
> **Feature File:** [020](graph_signal_activation/graph_momentum_scoring_n2a.md)
> **Catalog:** [graph_signal_activation/graph_momentum_scoring.md](../feature_catalog/graph_signal_activation/graph_momentum_scoring.md)

### 021 | Causal depth signal (N2b)

#### Description
Confirm normalized depth scoring.

#### Scenario Contract
Prompt: `Validate causal depth scoring and cite normalization, longer-chain ranking, shortcut behavior, and cycle depth bounding.`

Depth score normalized to [0,1]; deeper chains produce higher normalized values; shortcut edges do not reduce longest-path depth; cycle members share one bounded depth layer

#### Test Execution
> **Feature File:** [021](graph_signal_activation/causal_depth_signal_n2b.md)
> **Catalog:** [graph_signal_activation/causal_depth_signal.md](../feature_catalog/graph_signal_activation/causal_depth_signal.md)

### 022 | Community detection (N2c)

#### Description
Confirm community boost injection.

#### Scenario Contract
Prompt: `Validate community detection and cite cluster assignment, co-member boost injection, and configured boost cap enforcement.`

Community detection assigns cluster IDs; co-member boost injected; boost capped at configured maximum

#### Test Execution
> **Feature File:** [022](graph_signal_activation/community_detection_n2c.md)
> **Catalog:** [graph_signal_activation/community_detection.md](../feature_catalog/graph_signal_activation/community_detection.md)

### 023 | Score normalization

#### Description
Confirm batch min-max behavior.

#### Scenario Contract
Prompt: `Validate Score normalization with range, min-max, equal-score, and single-result evidence.`

Normalized scores in [0,1] range; min-max normalization correct; equal-score and single-result edge cases handled

#### Test Execution
> **Feature File:** [023](scoring_and_calibration/score_normalization.md)
> **Catalog:** [scoring_and_calibration/score_normalization.md](../feature_catalog/scoring_and_calibration/score_normalization.md)


### 025 | Interference scoring (TM-01)

#### Description
Confirm cluster penalty.

#### Scenario Contract
Prompt: `Validate interference scoring penalties for near duplicates, non-duplicates, and inactive or deprecated siblings.`

Near-duplicate cluster receives penalty; penalty reduces effective score; non-duplicates unaffected

#### Test Execution
> **Feature File:** [025](scoring_and_calibration/interference_scoring_tm_01.md)
> **Catalog:** [scoring_and_calibration/interference_scoring.md](../feature_catalog/scoring_and_calibration/interference_scoring.md)

### 026 | Classification-based decay (TM-03)

#### Description
Confirm class+tier decay matrix.

#### Scenario Contract
Prompt: `Validate classification-based decay, including tier multipliers and rejection of zero half-life config.`

Decay multipliers differ by classification and tier; matrix values match documented configuration; zero half-life config is rejected with the positive-number-or-null error

#### Test Execution
> **Feature File:** [026](scoring_and_calibration/classification_based_decay_tm_03.md)
> **Catalog:** [scoring_and_calibration/classification_based_decay.md](../feature_catalog/scoring_and_calibration/classification_based_decay.md)

### 027 | Folder-level relevance scoring (PI-A1)

#### Description
Confirm folder-first retrieval.

#### Scenario Contract
Prompt: `Validate folder-level relevance scoring and confirm folder results rank before individual memory results.`

Folder pre-ranking scores computed; folder-level results appear before individual spec-doc results in ranking

#### Test Execution
> **Feature File:** [027](scoring_and_calibration/folder_level_relevance_scoring_pi_a1.md)
> **Catalog:** [scoring_and_calibration/folder_level_relevance_scoring.md](../feature_catalog/scoring_and_calibration/folder_level_relevance_scoring.md)

### 028 | Embedding cache (R18)

#### Description
Confirm cache hit/miss behavior.

#### Scenario Contract
Prompt: `Validate embedding cache hits, misses, and hit timestamp updates.`

Cache hit returns instantly without embedding API call; cache miss triggers embedding; metadata timestamps updated on hit

#### Test Execution
> **Feature File:** [028](scoring_and_calibration/embedding_cache_r18.md)
> **Catalog:** [scoring_and_calibration/embedding_cache.md](../feature_catalog/scoring_and_calibration/embedding_cache.md)

### 029 | Double intent weighting investigation (G2)

#### Description
Confirm no hybrid double-weight.

#### Scenario Contract
Prompt: `Validate double intent weighting handling for hybrid and non-hybrid queries.`

Stage-2 intent weighting skipped for hybrid queries; no double-weight detected in trace; non-hybrid queries apply intent normally

#### Test Execution
> **Feature File:** [029](scoring_and_calibration/double_intent_weighting_investigation_g2.md)
> **Catalog:** [scoring_and_calibration/double_intent_weighting_investigation.md](../feature_catalog/scoring_and_calibration/double_intent_weighting_investigation.md)

### 030 | RRF K-value sensitivity analysis (FUT-5)

#### Description
Confirm K sensitivity measurements.

#### Scenario Contract
Prompt: `Validate RRF K-value sensitivity analysis and identify the optimal K with evidence.`

K-value grid produces per-K metric comparisons; optimal K identified with rationale; sensitivity curve shows diminishing returns

#### Test Execution
> **Feature File:** [030](scoring_and_calibration/rrf_k_value_sensitivity_analysis_fut_5.md)
> **Catalog:** [scoring_and_calibration/rrf_k_value_sensitivity_analysis.md](../feature_catalog/scoring_and_calibration/rrf_k_value_sensitivity_analysis.md)

### 031 | Negative feedback confidence signal (A4)

#### Description
Confirm demotion floor+recovery.

#### Scenario Contract
Prompt: `Validate the negative feedback confidence signal, including floor enforcement and half-life recovery.`

Negative feedback reduces confidence multiplier; floor enforced (never reaches 0); half-life recovery observed over time

#### Test Execution
> **Feature File:** [031](scoring_and_calibration/negative_feedback_confidence_signal_a4.md)
> **Catalog:** [scoring_and_calibration/negative_feedback_confidence_signal.md](../feature_catalog/scoring_and_calibration/negative_feedback_confidence_signal.md)

### 032 | Auto-promotion on validation (T002a)

#### Description
Confirm promotion thresholds/throttle.

#### Scenario Contract
Prompt: `Validate auto-promotion on validation, including threshold promotion, throttle behavior, and audit logging.`

Positive validations promote tier at configured threshold; throttle prevents rapid re-promotion; audit trail logged

#### Test Execution
> **Feature File:** [032](scoring_and_calibration/auto_promotion_on_validation_t002a.md)
> **Catalog:** [scoring_and_calibration/auto_promotion_on_validation.md](../feature_catalog/scoring_and_calibration/auto_promotion_on_validation.md)

### 033 | Query complexity router (R15)

#### Description
Confirm query-class routing.

#### Scenario Contract
Prompt: `As a query_intelligence validation operator, validate Query complexity router (R15) against the documented validation surface. Verify simple queries route to fewer channels; complex queries activate all channels; disabled flag falls back to default routing. Return a concise pass/fail verdict with the main reason and cited evidence.`

Simple queries route to fewer channels; complex queries activate all channels; disabled flag falls back to default routing

#### Test Execution
> **Feature File:** [033](query_intelligence/query_complexity_router_r15.md)
> **Catalog:** [query_intelligence/query_complexity_router.md](../feature_catalog/query_intelligence/query_complexity_router.md)


### 035 | Channel min-representation (R2)

#### Description
Confirm top-k channel diversity rule.

#### Scenario Contract
Prompt: `As a query_intelligence validation operator, validate Channel min-representation (R2) against the documented validation surface. Verify each channel represented in top-k results even when one channel dominates; quality floor prevents low-relevance injection. Return a concise pass/fail verdict with the main reason and cited evidence.`

Each channel represented in top-k results even when one channel dominates; quality floor prevents low-relevance injection

#### Test Execution
> **Feature File:** [035](query_intelligence/channel_min_representation_r2.md)
> **Catalog:** [query_intelligence/channel_min_representation.md](../feature_catalog/query_intelligence/channel_min_representation.md)

### 036 | Confidence-based result truncation (R15-ext)

#### Description
Confirm relevance-cliff cutoff.

#### Scenario Contract
Prompt: `As a query_intelligence validation operator, validate Confidence-based result truncation (R15-ext) against the documented validation surface. Verify results truncated at confidence cliff; minimum result count guaranteed; cutoff threshold documented in trace. Return a concise pass/fail verdict with the main reason and cited evidence.`

Results truncated at confidence cliff; minimum result count guaranteed; cutoff threshold documented in trace

#### Test Execution
> **Feature File:** [036](query_intelligence/confidence_based_result_truncation_r15_ext.md)
> **Catalog:** [query_intelligence/confidence_based_result_truncation.md](../feature_catalog/query_intelligence/confidence_based_result_truncation.md)

### 037 | Dynamic token budget allocation (FUT-7)

#### Description
Confirm complexity-tier budgets.

#### Scenario Contract
Prompt: `As a query_intelligence validation operator, validate Dynamic token budget allocation (FUT-7) against the documented validation surface. Verify token budget scales with query complexity tier; simple queries get smaller budgets; disabled flag falls back to default budget. Return a concise pass/fail verdict with the main reason and cited evidence.`

Token budget scales with query complexity tier; simple queries get smaller budgets; disabled flag falls back to default budget

#### Test Execution
> **Feature File:** [037](query_intelligence/dynamic_token_budget_allocation_fut_7.md)
> **Catalog:** [query_intelligence/dynamic_token_budget_allocation.md](../feature_catalog/query_intelligence/dynamic_token_budget_allocation.md)

### 038 | Query expansion (R12)

#### Description
Confirm parallel expansion + dedup.

#### Scenario Contract
Prompt: `As a query_intelligence validation operator, validate Query expansion (R12) against the documented validation surface. Verify complex queries produce expanded variants; expanded results deduplicated against baseline; simple queries skip expansion. Return a concise pass/fail verdict with the main reason and cited evidence.`

Complex queries produce expanded variants; expanded results deduplicated against baseline; simple queries skip expansion

#### Test Execution
> **Feature File:** [038](query_intelligence/query_expansion_r12.md)
> **Catalog:** [query_intelligence/query_expansion.md](../feature_catalog/query_intelligence/query_expansion.md)

### 039 | Verify-fix-verify memory quality loop (PI-A5)

#### Description
Confirm retry then reject path.

#### Scenario Contract
Prompt: `Validate the verify-fix-verify memory quality loop.`

Low-quality memory triggers retry cycle; final reject after max retries; rejection reason logged

#### Test Execution
> **Feature File:** [039](memory_quality_and_indexing/verify_fix_verify_memory_quality_loop_pi_a5.md)
> **Catalog:** [memory_quality_and_indexing/verify_fix_verify_memory_quality_loop.md](../feature_catalog/memory_quality_and_indexing/verify_fix_verify_memory_quality_loop.md)

### 040 | Signal vocabulary expansion (TM-08)

#### Description
Confirm signal category detection.

#### Scenario Contract
Prompt: `Validate signal vocabulary expansion for correction, preference, and reinforcement signals.`

Signal categories (correction, preference, reinforcement) detected from prompt analysis; trigger matching reflects expanded vocabulary

#### Test Execution
> **Feature File:** [040](memory_quality_and_indexing/signal_vocabulary_expansion_tm_08.md)
> **Catalog:** [memory_quality_and_indexing/signal_vocabulary_expansion.md](../feature_catalog/memory_quality_and_indexing/signal_vocabulary_expansion.md)

### 041 | Pre-flight token budget validation (PI-A3)

#### Description
Confirm save-time preflight warn/fail behavior.

#### Scenario Contract
Prompt: `Validate pre-flight token budget handling in memory_save dry-run.`

Token estimate is computed before embedding/database writes; near-limit input emits `PF021` warning; over-limit input emits `PF020` failure; behavior follows `MCP_CHARS_PER_TOKEN`, `MCP_MAX_MEMORY_TOKENS`, and `MCP_TOKEN_WARNING_THRESHOLD`

#### Test Execution
> **Feature File:** [041](memory_quality_and_indexing/pre_flight_token_budget_validation_pi_a3.md)
> **Catalog:** [memory_quality_and_indexing/pre_flight_token_budget_validation.md](../feature_catalog/memory_quality_and_indexing/pre_flight_token_budget_validation.md)

### 042 | Spec folder description discovery (PI-B3)

#### Description
Confirm per-folder + aggregated routing.

#### Scenario Contract
Prompt: `Validate spec folder description discovery and description.json fallback behavior.`

description.json exists after create.sh; stale detection triggers on spec.md edit; per-folder files preferred over spec.md fallback; mixed-mode aggregation works; invalid JSON or schema-invalid description.json files are ignored, spec.md fallback is used, and existing files are repaired in place; missing description.json falls back cleanly without implicit backfill; out-of-base or prefix-bypass paths are rejected by realpath containment checks; YAML frontmatter is stripped before description extraction, including CRLF-heavy frontmatter cases; memory_context uses folder routing; regeneration leaves valid JSON on disk with no leftover temp files

#### Test Execution
> **Feature File:** [042](memory_quality_and_indexing/spec_folder_description_discovery_pi_b3.md)
> **Catalog:** [memory_quality_and_indexing/spec_folder_description_discovery.md](../feature_catalog/memory_quality_and_indexing/spec_folder_description_discovery.md)

### 043 | Pre-storage quality gate (TM-04)

#### Description
Confirm 3-layer gate behavior.

#### Scenario Contract
Prompt: `Validate the pre-storage quality gate for structural, semantic, and duplication checks.`

3-layer gate: structural check, semantic check, duplication check; each layer can warn or reject; decision log captures all gate evaluations

#### Test Execution
> **Feature File:** [043](memory_quality_and_indexing/pre_storage_quality_gate_tm_04.md)
> **Catalog:** [memory_quality_and_indexing/pre_storage_quality_gate.md](../feature_catalog/memory_quality_and_indexing/pre_storage_quality_gate.md)

### 044 | Reconsolidation-on-save (TM-06)

#### Description
Confirm merge/deprecate thresholds.

#### Scenario Contract
Prompt: `Validate reconsolidation-on-save thresholds and repair debt.`

Similarity >=0.88 triggers merge; 0.75-0.88 triggers supersede/deprecate; below 0.75 saves independently; thresholds documented in output

#### Test Execution
> **Feature File:** [044](memory_quality_and_indexing/reconsolidation_on_save_tm_06.md)
> **Catalog:** [memory_quality_and_indexing/reconsolidation_on_save.md](../feature_catalog/memory_quality_and_indexing/reconsolidation_on_save.md)

### 045 | Smarter memory content generation (S1)

#### Description
Confirm quality/structure output.

#### Scenario Contract
Prompt: `Validate smarter memory content generation preserves structure and coherence.`

Generated content retains structural elements (headings, lists, code blocks); output is concise; coherence maintained across sections; multiple pathless batch inputs keep distinct inference results

#### Test Execution
> **Feature File:** [045](memory_quality_and_indexing/smarter_memory_content_generation_s1.md)
> **Catalog:** [memory_quality_and_indexing/smarter_memory_content_generation.md](../feature_catalog/memory_quality_and_indexing/smarter_memory_content_generation.md)

### 046 | Anchor-aware chunk thinning (R7)

#### Description
Confirm anchor-priority thinning.

#### Scenario Contract
Prompt: `Validate anchor-aware chunk thinning preserves anchor chunks.`

Anchor chunks retained; filler chunks thinned; retained set is non-empty; anchor priority respected in thinning order

#### Test Execution
> **Feature File:** [046](memory_quality_and_indexing/anchor_aware_chunk_thinning_r7.md)
> **Catalog:** [memory_quality_and_indexing/anchor_aware_chunk_thinning.md](../feature_catalog/memory_quality_and_indexing/anchor_aware_chunk_thinning.md)

### 047 | Encoding-intent capture at index time (R16)

#### Description
Confirm persisted intent labels.

#### Scenario Contract
Prompt: `Validate encoding-intent capture at index time.`

Intent labels (doc/code/structured) persisted in metadata; labels read-only after indexing; varied content types produce correct labels

#### Test Execution
> **Feature File:** [047](memory_quality_and_indexing/encoding_intent_capture_at_index_time_r16.md)
> **Catalog:** [memory_quality_and_indexing/encoding_intent_capture_at_index_time.md](../feature_catalog/memory_quality_and_indexing/encoding_intent_capture_at_index_time.md)

### 048 | Auto entity extraction (R10)

#### Description
Confirm entity pipeline persistence.

#### Scenario Contract
Prompt: `Validate auto entity extraction persistence, normalization, and denylist behavior.`

Entities extracted and persisted in entity tables; normalization applied (case, aliases); denylist entities excluded

#### Test Execution
> **Feature File:** [048](memory_quality_and_indexing/auto_entity_extraction_r10.md)
> **Catalog:** [memory_quality_and_indexing/auto_entity_extraction.md](../feature_catalog/memory_quality_and_indexing/auto_entity_extraction.md)

### 049 | 4-stage pipeline refactor (R6)

#### Description
Confirm stage flow and invariant.

#### Scenario Contract
Prompt: `Validate 4-stage pipeline refactor (R6) against the documented validation surface and return pass/fail with cited evidence.`

Query traverses all 4 stages in order; stage transitions visible in verbose metadata; stage-4 scores immutable after final stage

#### Test Execution
> **Feature File:** [049](pipeline_architecture/4_stage_pipeline_refactor_r6.md)
> **Catalog:** [pipeline_architecture/4_stage_pipeline_refactor.md](../feature_catalog/pipeline_architecture/4_stage_pipeline_refactor.md)

### 050 | MPAB chunk-to-memory aggregation (R1)

#### Description
Confirm MPAB formula.

#### Scenario Contract
Prompt: `Validate MPAB chunk-to-memory aggregation (R1) against the documented validation surface and return pass/fail with cited evidence.`

MPAB aggregation formula produces correct parent score from child chunks; manual formula matches computed value

#### Test Execution
> **Feature File:** [050](pipeline_architecture/mpab_chunk_to_memory_aggregation_r1.md)
> **Catalog:** [pipeline_architecture/mpab_chunk_to_memory_aggregation.md](../feature_catalog/pipeline_architecture/mpab_chunk_to_memory_aggregation.md)

### 051 | Chunk ordering preservation (B2)

#### Description
Confirm ordered reassembly.

#### Scenario Contract
Prompt: `Validate chunk ordering preservation (B2) against the documented validation surface and return pass/fail with cited evidence.`

Collapsed chunks reassemble in original document order; marker sequence preserved; snake_case and camelCase chunk metadata trigger the same collapse path; no reordering or silent passthrough artifacts remain

#### Test Execution
> **Feature File:** [051](pipeline_architecture/chunk_ordering_preservation_b2.md)
> **Catalog:** [pipeline_architecture/chunk_ordering_preservation.md](../feature_catalog/pipeline_architecture/chunk_ordering_preservation.md)

### 052 | Template anchor optimization (S2)

#### Description
Confirm anchor metadata enrichment.

#### Scenario Contract
Prompt: `Validate template anchor optimization (S2) against the documented validation surface and return pass/fail with cited evidence.`

Anchor metadata enriched in pipeline; anchor tags visible in query metadata; no score mutation from anchor presence

#### Test Execution
> **Feature File:** [052](pipeline_architecture/template_anchor_optimization_s2.md)
> **Catalog:** [pipeline_architecture/template_anchor_optimization.md](../feature_catalog/pipeline_architecture/template_anchor_optimization.md)

### 053 | Validation signals as retrieval metadata (S3)

#### Description
Confirm bounded multiplier.

#### Scenario Contract
Prompt: `Validate validation signals as retrieval metadata (S3) against the documented validation surface and return pass/fail with cited evidence.`

Validation signal multiplier bounded to [0.8, 1.2]; highly validated docs score higher; zero-validation docs use 1.0 multiplier

#### Test Execution
> **Feature File:** [053](pipeline_architecture/validation_signals_as_retrieval_metadata_s3.md)
> **Catalog:** [pipeline_architecture/validation_signals_as_retrieval_metadata.md](../feature_catalog/pipeline_architecture/validation_signals_as_retrieval_metadata.md)

### 054 | Learned relevance feedback (R11)

#### Description
Confirm learned trigger safeguards.

#### Scenario Contract
Prompt: `Validate learned relevance feedback (R11) against the documented validation surface and return pass/fail with cited evidence.`

Learned triggers added from helpful validations; safeguards prevent trigger flooding; queryId required for trigger learning

#### Test Execution
> **Feature File:** [054](pipeline_architecture/learned_relevance_feedback_r11.md)
> **Catalog:** [pipeline_architecture/learned_relevance_feedback.md](../feature_catalog/pipeline_architecture/learned_relevance_feedback.md)

### 055 | Dual-scope memory auto-surface (TM-05)

#### Description
Confirm auto-surface hooks.

#### Scenario Contract
Prompt: `As a retrieval-enhancement validation operator, validate Dual-scope memory auto-surface (TM-05) against the documented validation surface. Verify non-memory-aware tool path triggers auto-surface hook; compaction event surfaces relevant memories; surfaced memories match current context. Return a concise pass/fail verdict with the main reason and cited evidence.`

Non-memory-aware tool path triggers auto-surface hook; compaction event surfaces relevant spec-doc records; surfaced spec-doc records match current context

#### Test Execution
> **Feature File:** [055](retrieval_enhancements/dual_scope_memory_auto_surface_tm_05.md)
> **Catalog:** [retrieval_enhancements/dual_scope_memory_auto_surface.md](../feature_catalog/retrieval_enhancements/dual_scope_memory_auto_surface.md)

### 056 | Constitutional memory as expert knowledge injection (PI-A4)

#### Description
Confirm directive enrichment.

#### Scenario Contract
Prompt: `As a retrieval-enhancement validation operator, validate Constitutional memory as expert knowledge injection (PI-A4) against the documented validation surface. Verify directive metadata appears in retrieval results; constitutional tier classification applied; enrichment fields populated. Return a concise pass/fail verdict with the main reason and cited evidence.`

Directive metadata appears in retrieval results; constitutional tier classification applied; enrichment fields populated; injected constitutional rows obey shouldApplyScopeFiltering and stay inside enforced scope boundaries

#### Test Execution
> **Feature File:** [056](retrieval_enhancements/constitutional_memory_as_expert_knowledge_injection_pi_a4.md)
> **Catalog:** [retrieval_enhancements/constitutional_memory_as_expert_knowledge_injection.md](../feature_catalog/retrieval_enhancements/constitutional_memory_as_expert_knowledge_injection.md)

### 057 | Spec folder hierarchy as retrieval structure (S4)

#### Description
Confirm hierarchy-aware retrieval.

#### Scenario Contract
Prompt: `As a retrieval-enhancement validation operator, validate Spec folder hierarchy as retrieval structure (S4) against the documented validation surface. Verify self-folder results ranked highest; parent and sibling folders contribute scored results; hierarchy depth reflected in ranking. Return a concise pass/fail verdict with the main reason and cited evidence.`

Self-folder results ranked highest; parent and sibling folders contribute scored results; hierarchy depth reflected in ranking

#### Test Execution
> **Feature File:** [057](retrieval_enhancements/spec_folder_hierarchy_as_retrieval_structure_s4.md)
> **Catalog:** [retrieval_enhancements/spec_folder_hierarchy_as_retrieval_structure.md](../feature_catalog/retrieval_enhancements/spec_folder_hierarchy_as_retrieval_structure.md)

### 058 | Lightweight consolidation (N3-lite)

#### Description
Confirm maintenance cycle behavior.

#### Scenario Contract
Prompt: `As a retrieval-enhancement validation operator, validate Lightweight consolidation (N3-lite) against the documented validation surface. Verify consolidation cycle completes; contradiction detection, hebbian strengthening, and staleness decay all produce output; no runtime errors in logs. Return a concise pass/fail verdict with the main reason and cited evidence.`

Consolidation cycle completes; contradiction detection, hebbian strengthening, and staleness decay all produce output; no runtime errors in logs

#### Test Execution
> **Feature File:** [058](retrieval_enhancements/lightweight_consolidation_n3_lite.md)
> **Catalog:** [retrieval_enhancements/lightweight_consolidation.md](../feature_catalog/retrieval_enhancements/lightweight_consolidation.md)

### 059 | Memory summary search channel (R8)

#### Description
Confirm scale-gated summary channel.

#### Scenario Contract
Prompt: `As a retrieval-enhancement validation operator, validate Memory summary search channel (R8) against the documented validation surface. Verify summary channel activates only above corpus size threshold; channel contributes to fusion when active; channel is inert below threshold. Return a concise pass/fail verdict with the main reason and cited evidence.`

Summary channel activates only above corpus size threshold; channel contributes to fusion when active; channel is inert below threshold

#### Test Execution
> **Feature File:** [059](retrieval_enhancements/memory_summary_search_channel_r8.md)
> **Catalog:** [retrieval_enhancements/memory_summary_search_channel.md](../feature_catalog/retrieval_enhancements/memory_summary_search_channel.md)

### 060 | Cross-document entity linking (S5)

#### Description
Confirm guarded supports-edge linking.

#### Scenario Contract
Prompt: `As a retrieval-enhancement validation operator, validate Cross-document entity linking (S5) against the documented validation surface. Verify supports-edges created between documents sharing entities; density guard prevents excessive edges; entity normalization applied. Return a concise pass/fail verdict with the main reason and cited evidence.`

Supports-edges created between documents sharing entities; density guard prevents excessive edges; entity normalization applied

#### Test Execution
> **Feature File:** [060](retrieval_enhancements/cross_document_entity_linking_s5.md)
> **Catalog:** [retrieval_enhancements/cross_document_entity_linking.md](../feature_catalog/retrieval_enhancements/cross_document_entity_linking.md)

### 061 | Tree thinning for spec folder consolidation (PI-B1)

#### Description
Confirm small-file merge thinning.

#### Scenario Contract
Prompt: `Validate Tree thinning for spec folder consolidation (PI-B1) against the documented validation surface and report cited pass/fail evidence.`

Files below the 150-token small-file threshold merge into consolidated output; no merged parent absorbs more than 3 children; overflow files are kept instead of over-merged; token count is reduced; large files are left untouched; merge preserves content integrity

#### Test Execution
> **Feature File:** [061](tooling_and_scripts/tree_thinning_for_spec_folder_consolidation_pi_b1.md)
> **Catalog:** [tooling_and_scripts/tree_thinning_for_spec_folder_consolidation.md](../feature_catalog/tooling_and_scripts/tree_thinning_for_spec_folder_consolidation.md)

### 062 | Progressive validation for spec documents (PI-B2)

#### Description
Confirm level 1-4 behavior.

#### Scenario Contract
Prompt: `Validate Progressive validation for spec documents (PI-B2) against the documented validation surface and report cited pass/fail evidence.`

Each validation level produces appropriate checks; level progression increases strictness; exit codes reflect severity; auto-fix diffs applied at permitted levels

#### Test Execution
> **Feature File:** [062](tooling_and_scripts/progressive_validation_for_spec_documents_pi_b2.md)
> **Catalog:** [tooling_and_scripts/progressive_validation_for_spec_documents.md](../feature_catalog/tooling_and_scripts/progressive_validation_for_spec_documents.md)

### 063 | Feature flag governance

#### Description
Confirm governance policy conformance.

#### Scenario Contract
Prompt: `Validate Feature flag governance against the documented validation surface and report whether all expected governance signals are present.`

All flags enumerated with age and review cadence; compliance gaps identified; no undocumented flags found

#### Test Execution
> **Feature File:** [063](governance/feature_flag_governance.md)
> **Catalog:** [governance/feature_flag_governance.md](../feature_catalog/governance/feature_flag_governance.md)

### 064 | Feature flag sunset audit

#### Description
Confirm sunset dispositions for active, inert, and retired surfaces.

#### Scenario Contract
Prompt: `Verify feature flag sunset audit outcomes. Capture the evidence needed to prove documented dispositions match code state; inert compatibility flags such as SPECKIT_RSF_FUSION and SPECKIT_SHADOW_SCORING stay no-op; retired topics such as full-context ceiling eval, index refresh, context budget, PageRank, and entity scope are not treated as live runtime checks. Return a concise user-facing pass/fail verdict with the main reason.`

Documented dispositions match code state; inert compatibility flags remain no-op; retired topics are not treated as live runtime checks

#### Test Execution
> **Feature File:** retired feature-flag sunset audit manual record
> **Catalog:** retired feature-flag sunset audit record

### 065 | Database and schema safety

#### Description
Confirm Sprint 8 DB safety bundle.

#### Scenario Contract
Prompt: `Validate database and schema safety and confirm mutations are atomic, constraints hold, and failures roll back cleanly.`

Mutations complete atomically; no partial SQL corruption; schema constraints enforced; rollback on failure

Additional audit scenario: `Open the default vector store, then initialize a second store with a custom DB path. Capture the evidence needed to prove each path keeps an independent connection, close_db() closes every tracked handle, and constitutional-memory cache results differ correctly between includeArchived=false and includeArchived=true requests. Return a concise user-facing pass/fail verdict with the main reason.`

Per-path DB isolation holds; close_db cleans up all handles; archived cache scoping does not leak across options

#### Test Execution
> **Feature File:** [065](bug_fixes_and_data_integrity/database_and_schema_safety.md)
> **Catalog:** [bug_fixes_and_data_integrity/database_and_schema_safety.md](../feature_catalog/bug_fixes_and_data_integrity/database_and_schema_safety.md)

### 066 | Scoring and ranking corrections

#### Description
Confirm Sprint 8 scoring fixes.

#### Scenario Contract
Prompt: `Validate scoring and ranking corrections for score ranges, relevance order, inversions, and NaN values.`

Score values fall within expected ranges; ranking order matches relevance; no score inversions or NaN values; ablation token_usage metrics omit synthetic zero-only samples

#### Test Execution
> **Feature File:** [066](scoring_and_calibration/scoring_and_ranking_corrections.md)
> **Catalog:** [scoring_and_calibration/scoring_and_ranking_corrections.md](../feature_catalog/scoring_and_calibration/scoring_and_ranking_corrections.md)

### 067 | Search pipeline safety

#### Description
Confirm Sprint 8 pipeline safety fixes.

#### Scenario Contract
Prompt: `Validate search pipeline safety against the documented validation surface and return pass/fail with cited evidence.`

Pipeline handles heavy queries without crash; filters apply correctly; tokenization produces valid tokens; no unguarded exceptions

#### Test Execution
> **Feature File:** [067](pipeline_architecture/search_pipeline_safety.md)
> **Catalog:** [pipeline_architecture/search_pipeline_safety.md](../feature_catalog/pipeline_architecture/search_pipeline_safety.md)

### 068 | Guards and edge cases

#### Description
Confirm edge-case guard fixes.

#### Scenario Contract
Prompt: `Validate guards and edge cases and confirm aggregation, fallback paths, and invalid-state guards behave correctly.`

No double-counting in aggregation; fallback paths trigger correctly; guard conditions prevent invalid state

Additional audit scenario: `Validate retrieval guard fixes with a sandbox corpus that includes one expired memory, one partial-status memory, and enough constitutional rows to overflow a tiny limit. Capture the evidence needed to prove expired rows do not survive multi-concept search, vector_search never returns more than the requested limit, malformed embeddings fail with a validation error, and stats still count the partial row. Return a concise user-facing pass/fail verdict with the main reason.`

Expired rows excluded; result limits respected; invalid embeddings rejected cleanly; partial state counted

#### Test Execution
> **Feature File:** [068](bug_fixes_and_data_integrity/guards_and_edge_cases.md)
> **Catalog:** [bug_fixes_and_data_integrity/guards_and_edge_cases.md](../feature_catalog/bug_fixes_and_data_integrity/guards_and_edge_cases.md)

### 069 | Entity normalization consolidation

#### Description
Confirm shared normalization path.

#### Scenario Contract
Prompt: `Validate entity normalization consolidation across extraction and linking.`

Extractor and linker produce identical normalized forms for same input; unicode entities handled consistently; no normalization divergence

#### Test Execution
> **Feature File:** [069](memory_quality_and_indexing/entity_normalization_consolidation.md)
> **Catalog:** [memory_quality_and_indexing/entity_normalization_consolidation.md](../feature_catalog/memory_quality_and_indexing/entity_normalization_consolidation.md)

### 070 | Dead code removal

#### Description
Confirm documented removals remain absent.

#### Scenario Contract
Prompt: `Validate Dead code removal against isShadowScoringEnabled and report cited pass/fail evidence.`

Removed hybrid-search branches absent; retired helpers absent; dead module state and exports absent; representative flows execute without missing-reference errors

#### Test Execution
> **Feature File:** [070](tooling_and_scripts/dead_code_removal.md)
> **Catalog:** [tooling_and_scripts/dead_code_removal.md](../feature_catalog/tooling_and_scripts/dead_code_removal.md)

### 071 | Performance improvements

#### Description
Confirm key perf remediations active.

#### Scenario Contract
Prompt: `Validate performance improvements against hybrid-search.ts and return pass/fail with cited evidence.`

Optimized code paths are active (not bypassed); heavy queries complete within acceptable time; no performance regressions

#### Test Execution
> **Feature File:** [071](pipeline_architecture/performance_improvements.md)
> **Catalog:** [pipeline_architecture/performance_improvements.md](../feature_catalog/pipeline_architecture/performance_improvements.md)

### 072 | Test quality improvements

#### Description
Confirm test quality remediations.

#### Scenario Contract
Prompt: `Validate the test quality improvements and cite teardown, assertion specificity, timing stability, and isolation evidence.`

Tests use proper teardown; assertions are specific (not generic truthy checks); no flaky timing-dependent patterns; test isolation maintained

#### Test Execution
> **Feature File:** [072](evaluation_and_measurement/test_quality_improvements.md)
> **Catalog:** [evaluation_and_measurement/test_quality_improvements.md](../feature_catalog/evaluation_and_measurement/test_quality_improvements.md)

### 073 | Quality gate timer persistence

#### Description
Confirm restart persistence.

#### Scenario Contract
Prompt: `Validate quality gate timer persistence across service restart.`

Activation timestamp survives service restart; quality gate respects persisted timer; no timer reset on restart

#### Test Execution
> **Feature File:** [073](memory_quality_and_indexing/quality_gate_timer_persistence.md)
> **Catalog:** [memory_quality_and_indexing/quality_gate_timer_persistence.md](../feature_catalog/memory_quality_and_indexing/quality_gate_timer_persistence.md)

### 074 | Stage 3 effectiveScore fallback chain

#### Description
Confirm fallback order correctness.

#### Scenario Contract
Prompt: `Validate the Stage 3 effectiveScore fallback chain and confirm each fallback produces a valid score.`

Fallback chain follows defined priority order; missing score fields trigger next fallback; final fallback produces valid score

#### Test Execution
> **Feature File:** [074](scoring_and_calibration/stage_3_effectivescore_fallback_chain.md)
> **Catalog:** [scoring_and_calibration/stage_3_effectivescore_fallback_chain.md](../feature_catalog/scoring_and_calibration/stage_3_effectivescore_fallback_chain.md)

### 075 | Canonical ID dedup hardening

#### Description
Confirm mixed-format ID dedup.

#### Scenario Contract
Prompt: `Validate canonical ID dedup hardening and confirm mixed-format IDs dedup with parent-only index coverage.`

Mixed-format IDs (numeric, string, prefixed) resolve to single canonical form; dedup produces exactly one result per logical entity

#### Test Execution
> **Feature File:** [075](bug_fixes_and_data_integrity/canonical_id_dedup_hardening.md)
> **Catalog:** [bug_fixes_and_data_integrity/canonical_id_dedup_hardening.md](../feature_catalog/bug_fixes_and_data_integrity/canonical_id_dedup_hardening.md)


### 077 | Tier-2 fallback channel forcing

#### Description
Confirm force-all-channels in tier-2.

#### Scenario Contract
Prompt: `As a retrieval-enhancement validation operator, validate Tier-2 fallback channel forcing against the documented validation surface. Verify tier-2 fallback activates all search channels; channel options show forceAllChannels=true; results include contributions from all channels. Return a concise pass/fail verdict with the main reason and cited evidence.`

Tier-2 fallback activates all search channels; channel options show forceAllChannels=true; results include contributions from all channels

#### Test Execution
> **Feature File:** [077](retrieval_enhancements/tier_2_fallback_channel_forcing.md)
> **Catalog:** [retrieval_enhancements/tier_2_fallback_channel_forcing.md](../feature_catalog/retrieval_enhancements/tier_2_fallback_channel_forcing.md)

### 078 | Legacy V1 pipeline removal

#### Description
Confirm V2-only runtime.

#### Scenario Contract
Prompt: `Validate legacy V1 pipeline removal against the documented validation surface and return pass/fail with cited evidence.`

V1 pipeline symbols absent from codebase; all queries route through V2 pipeline; no V1 fallback paths remain

#### Test Execution
> **Feature File:** [078](pipeline_architecture/legacy_v1_pipeline_removal.md)
> **Catalog:** [pipeline_architecture/legacy_v1_pipeline_removal.md](../feature_catalog/pipeline_architecture/legacy_v1_pipeline_removal.md)

### 079 | Scoring and fusion corrections

#### Description
Confirm phase-017 correction bundle.

#### Scenario Contract
Prompt: `Validate the scoring and fusion correction bundle with executable sources and regression evidence.`

Scoring math produces correct values; normalization stays within bounds; fusion formula applies corrected weights

#### Test Execution
> **Feature File:** [079](scoring_and_calibration/scoring_and_fusion_corrections.md)
> **Catalog:** [scoring_and_calibration/scoring_and_fusion_corrections.md](../feature_catalog/scoring_and_calibration/scoring_and_fusion_corrections.md)

### 080 | Pipeline and mutation hardening

#### Description
Confirm mutation hardening bundle.

#### Scenario Contract
Prompt: `Validate pipeline and mutation hardening against the documented validation surface and return pass/fail with cited evidence.`

CRUD mutations are atomic (all-or-nothing); error handling cleans up partial state; no orphaned records on failure; deep-mode reformulation and HyDE candidates re-enter scope/context/quality filtering before merge; constitutional injection obeys global scope enforcement; chunk reassembly accepts camelCase metadata aliases

#### Test Execution
> **Feature File:** [080](pipeline_architecture/pipeline_and_mutation_hardening.md)
> **Catalog:** [pipeline_architecture/pipeline_and_mutation_hardening.md](../feature_catalog/pipeline_architecture/pipeline_and_mutation_hardening.md)

### 081 | Graph and cognitive memory fixes

#### Description
Confirm graph/cognitive fix bundle.

#### Scenario Contract
Prompt: `Validate graph and cognitive memory fixes and cite self-loop prevention, depth clamps, mutation invalidation, and stale-data protection.`

Self-loops prevented; depth clamps enforced; cache invalidation triggers on mutation; no stale cognitive data returned

#### Test Execution
> **Feature File:** [081](graph_signal_activation/graph_and_cognitive_memory_fixes.md)
> **Catalog:** [graph_signal_activation/graph_and_cognitive_memory_fixes.md](../feature_catalog/graph_signal_activation/graph_and_cognitive_memory_fixes.md)

### 082 | Evaluation and housekeeping fixes

#### Description
Confirm eval/housekeeping reliability.

#### Scenario Contract
Prompt: `Validate evaluation housekeeping and cite unique run IDs, idempotent upserts, boundary guards, and clean housekeeping evidence.`

Run-IDs are unique across restarts; upserts are idempotent; boundary guards prevent out-of-range values; housekeeping completes cleanly

#### Test Execution
> **Feature File:** [082](evaluation_and_measurement/evaluation_and_housekeeping_fixes.md)
> **Catalog:** [evaluation_and_measurement/evaluation_and_housekeeping_fixes.md](../feature_catalog/evaluation_and_measurement/evaluation_and_housekeeping_fixes.md)

### 083 | Math.max/min stack overflow elimination

#### Description
Confirm large-array safety.

#### Scenario Contract
Prompt: `Validate Math.max/min stack overflow elimination and confirm large arrays process without RangeError.`

Large arrays (10k+ elements) processed without RangeError; numeric outputs match expected min/max values; no stack overflow in any code path

#### Test Execution
> **Feature File:** [083](bug_fixes_and_data_integrity/math_max_min_stack_overflow_elimination.md)
> **Catalog:** [bug_fixes_and_data_integrity/mathmax_min_stack_overflow_elimination.md](../feature_catalog/bug_fixes_and_data_integrity/mathmax_min_stack_overflow_elimination.md)

### 084 | Session-manager transaction gap fixes

#### Description
Confirm transactional limit enforcement.

#### Scenario Contract
Prompt: `Validate session-manager transaction gap fixes and confirm concurrent writes serialize without data corruption.`

Concurrent writes are serialized via transactions; session limits enforced; no data corruption from concurrent access

#### Test Execution
> **Feature File:** [084](bug_fixes_and_data_integrity/session_manager_transaction_gap_fixes.md)
> **Catalog:** [bug_fixes_and_data_integrity/session_manager_transaction_gap_fixes.md](../feature_catalog/bug_fixes_and_data_integrity/session_manager_transaction_gap_fixes.md)

### 085 | Transaction wrappers on mutation handlers

#### Description
Confirm atomic wrapper behavior.

#### Scenario Contract
Prompt: `As a mutation validation operator, validate Transaction wrappers on mutation handlers against the documented validation surface. Verify mid-step fault triggers automatic rollback; DB state remains consistent after rollback; no partial writes persist. Return a concise pass/fail verdict with the main reason and cited evidence.`

Mid-step fault triggers automatic rollback; DB state remains consistent after rollback; no partial writes persist

#### Test Execution
> **Feature File:** [085](mutation/transaction_wrappers_on_mutation_handlers.md)
> **Catalog:** [mutation/transaction_wrappers_on_mutation_handlers.md](../feature_catalog/mutation/transaction_wrappers_on_mutation_handlers.md)

### 086 | BM25 trigger phrase re-index gate

#### Description
Confirm trigger edit causes re-index.

#### Scenario Contract
Prompt: `Validate the BM25 trigger phrase re-index gate and confirm edited triggers become searchable when BM25 is enabled.`

Trigger phrase edit triggers BM25 re-index; new trigger is searchable after re-index; old trigger phrase still works if not removed

#### Test Execution
> **Feature File:** [086](retrieval/bm25_trigger_phrase_re_index_gate.md)
> **Catalog:** [retrieval/bm25_trigger_phrase_re_index_gate.md](../feature_catalog/retrieval/bm25_trigger_phrase_re_index_gate.md)

### 087 | DB_PATH extraction and import standardization

#### Description
Confirm shared DB path resolution.

#### Scenario Contract
Prompt: `Validate DB_PATH extraction and import standardization against the documented validation surface and return pass/fail with cited evidence.`

All scripts/tools resolve to the same DB path for identical env vars; precedence chain is respected; no hardcoded fallbacks diverge

#### Test Execution
> **Feature File:** [087](pipeline_architecture/db_path_extraction_and_import_standardization.md)
> **Catalog:** [pipeline_architecture/dbpath_extraction_and_import_standardization.md](../feature_catalog/pipeline_architecture/dbpath_extraction_and_import_standardization.md)

### 088 | Cross-AI validation fixes (Tier 4)

#### Description
Confirm tier-4 fix pack behavior.

#### Scenario Contract
Prompt: `Validate the Tier 4 cross-AI fixes and cite corrected behavior, representative flow outputs, and regression evidence.`

Each tier-4 fix location shows corrected behavior; representative flows produce expected outputs; no regressions in adjacent functionality

#### Test Execution
> **Feature File:** [088](evaluation_and_measurement/cross_ai_validation_fixes_tier_4.md)
> **Catalog:** [evaluation_and_measurement/cross_ai_validation_fixes.md](../feature_catalog/evaluation_and_measurement/cross_ai_validation_fixes.md)

### 089 | Code standards alignment

#### Description
Confirm standards conformance.

#### Scenario Contract
Prompt: `Validate Code standards alignment against the documented validation surface and report cited pass/fail evidence.`

Affected files follow naming conventions; comments are meaningful (not boilerplate); import order matches standard; no mismatches found

#### Test Execution
> **Feature File:** [089](tooling_and_scripts/code_standards_alignment.md)
> **Catalog:** [tooling_and_scripts/code_standards_alignment.md](../feature_catalog/tooling_and_scripts/code_standards_alignment.md)

### 090 | INT8 quantization evaluation (R5)

#### Description
Confirm no-go decision remains valid.

#### Scenario Contract
Prompt: `Validate the INT8 quantization no-go decision and cite current degradation metrics, criteria, and rationale evidence.`

Quality degradation metrics exceed acceptable threshold; no-go criteria still met; decision rationale documented with current data

#### Test Execution
> **Feature File:** [090](evaluation_and_measurement/int8_quantization_evaluation_r5.md)
> **Catalog:** [evaluation_and_measurement/int8_quantization_evaluation.md](../feature_catalog/evaluation_and_measurement/int8_quantization_evaluation.md)

### 091 | Implemented: graph centrality and community detection (N2)

#### Description
Confirm deferred->implemented status.

#### Scenario Contract
Prompt: `Validate graph centrality and community detection and cite N2 tables, active flags, and score contribution evidence.`

N2 tables exist with data; feature flags show active status; graph queries include centrality/community contributions in scores

#### Test Execution
> **Feature File:** [091](graph_signal_activation/implemented_graph_centrality_and_community_detection_n2.md)
> **Catalog:** [graph_signal_activation/community_detection.md](../feature_catalog/graph_signal_activation/community_detection.md)

### 092 | Implemented: auto entity extraction (R10)

#### Description
Confirm deferred->implemented status.

#### Scenario Contract
Prompt: `Validate implemented auto entity extraction defaults and output types.`

Entities automatically extracted on save; entity outputs contain expected entity types; default extraction settings are applied

#### Test Execution
> **Feature File:** [092](memory_quality_and_indexing/implemented_auto_entity_extraction_r10.md)
> **Catalog:** [memory_quality_and_indexing/auto_entity_extraction.md](../feature_catalog/memory_quality_and_indexing/auto_entity_extraction.md)

### 093 | Implemented: memory summary generation (R8)

#### Description
Confirm deferred->implemented status.

#### Scenario Contract
Prompt: `As a retrieval-enhancement validation operator, validate Implemented: memory summary generation (R8) against the documented validation surface. Verify summary generated for long memories; summary persisted in DB; scale gate prevents summary generation below corpus threshold. Return a concise pass/fail verdict with the main reason and cited evidence.`

Summary generated for long memories; summary persisted in DB; scale gate prevents summary generation below corpus threshold

#### Test Execution
> **Feature File:** [093](retrieval_enhancements/implemented_memory_summary_generation_r8.md)
> **Catalog:** [retrieval_enhancements/memory_summary_search_channel.md](../feature_catalog/retrieval_enhancements/memory_summary_search_channel.md)

### 094 | Implemented: cross-document entity linking (S5)

#### Description
Confirm deferred->implemented status.

#### Scenario Contract
Prompt: `As a retrieval-enhancement validation operator, validate Implemented: cross-document entity linking (S5) against the documented validation surface. Verify entity linker creates supports-edges between related documents; density guards cap edge creation; edge types are correctly classified. Return a concise pass/fail verdict with the main reason and cited evidence.`

Entity linker creates supports-edges between related documents; density guards cap edge creation; edge types are correctly classified

#### Test Execution
> **Feature File:** [094](retrieval_enhancements/implemented_cross_document_entity_linking_s5.md)
> **Catalog:** [retrieval_enhancements/cross_document_entity_linking.md](../feature_catalog/retrieval_enhancements/cross_document_entity_linking.md)

### 095 | Strict Zod schema validation (P0-1)

#### Description
Confirm schema enforcement rejects hallucinated params.

#### Scenario Contract
Prompt: `Validate strict Zod schema validation (P0-1) against memory_search({query:"test", bogus:1}) and return pass/fail with cited evidence.`

Zod strict error returned for unknown params in strict mode; extra params pass through in permissive mode; validation occurs per-tool in handler layer

#### Test Execution
> **Feature File:** [095](pipeline_architecture/strict_zod_schema_validation_p0_1.md)
> **Catalog:** [pipeline_architecture/strict_zod_schema_validation.md](../feature_catalog/pipeline_architecture/strict_zod_schema_validation.md)

### 096 | Provenance-rich response envelopes (P0-2)

#### Description
Confirm includeTrace opt-in exposes scores/source/trace.

#### Scenario Contract
Prompt: `As a retrieval-enhancement validation operator, validate Provenance-rich response envelopes (P0-2) against SPECKIT_RESPONSE_TRACE. Verify trace objects (scores, source, trace) present when includeTrace=true or env override active; absent when neither is set; score fields include all 7 expected sub-fields. Return a concise pass/fail verdict with the main reason and cited evidence.`

Trace objects (scores, source, trace) present when includeTrace=true or env override active; absent when neither is set; score fields include all 7 expected sub-fields

#### Test Execution
> **Feature File:** [096](retrieval_enhancements/provenance_rich_response_envelopes_p0_2.md)
> **Catalog:** [retrieval_enhancements/provenance_rich_response_envelopes.md](../feature_catalog/retrieval_enhancements/provenance_rich_response_envelopes.md)

### 097 | Async ingestion job lifecycle (P0-3)

#### Description
Confirm job state machine and crash recovery.

#### Scenario Contract
Prompt: `Validate async ingestion job lifecycle, including state order, duplicate-path dedup, cancel behavior, nanoid job IDs, and restart re-enqueue evidence.`

Job state transitions through queued→parsing→embedding→indexing→complete in order; cancel sets state to cancelled; job IDs match nanoid format; incomplete jobs re-enqueue after restart

#### Test Execution
> **Feature File:** [097](lifecycle/async_ingestion_job_lifecycle_p0_3.md)
> **Catalog:** [lifecycle/async_ingestion_job_lifecycle.md](../feature_catalog/lifecycle/async_ingestion_job_lifecycle.md)

### 099 | Real-time filesystem watching 

#### Description
Confirm file watcher debounce, hash seeding, and ENOENT grace.

#### Scenario Contract
Prompt: `Validate Real-time filesystem watching (P1-7) against SPECKIT_FILE_WATCHER=true and report cited pass/fail evidence.`

File add seeds hash cache; modifications trigger reindex after 2s debounce; identical-content modifications produce no reindex; rapid create-delete produces no ENOENT crash

#### Test Execution
> **Feature File:** [099](tooling_and_scripts/real_time_filesystem_watching_p1_7.md)
> **Catalog:** [tooling_and_scripts/real_time_filesystem_watching_with_chokidar.md](../feature_catalog/tooling_and_scripts/real_time_filesystem_watching_with_chokidar.md)


### 101 | memory_delete confirm schema tightening

#### Description
Confirm confirm field accepts only literal true.

#### Scenario Contract
Prompt: `As a mutation validation operator, validate memory_delete confirm schema tightening against memory_delete({id:1, confirm:true}). Verify confirm:true accepted; confirm:false rejected with Zod literal error; bulk delete requires confirm:true; missing confirm field rejected for bulk path. Return a concise pass/fail verdict with the main reason and cited evidence.`

confirm:true accepted; confirm:false rejected with Zod literal error; bulk delete requires confirm:true; missing confirm field rejected for bulk path

#### Test Execution
> **Feature File:** [101](mutation/memory_delete_confirm_schema_tightening.md)
> **Catalog:** *(memory_delete confirm schema — covered by `mutation/03`)*

### 102 | Ollama runtime optionalDependencies

#### Description
Confirm install succeeds without native build tools.

#### Scenario Contract
Prompt: `Validate Ollama runtime optionalDependencies and graceful dynamic-import fallback behavior.`

Ollama runtime listed in optionalDependencies (not dependencies); npm install completes without error on clean env; dynamic import with graceful fallback when module absent

#### Test Execution
> **Feature File:** *(102 consolidated — no standalone file; coverage lives in the scoring_and_calibration category)*
> **Catalog:** *(Ollama runtime optionalDependencies — covered by `scoring-and-calibration/14`)*

### 103 | UX hook module coverage (`mutation-feedback`, `response-hints`)

#### Description
Confirm new hook modules return the finalized metadata and hint shape.

#### Scenario Contract
Prompt: `Validate UX hook module coverage for mutation-feedback and response-hints against tests/hooks-ux-feedback.vitest.ts.`

Test output shows suite pass, including latency/cache-clear booleans and finalized hint payload assertions

#### Test Execution
> **Feature File:** [103](ux_hooks/ux_hook_module_coverage_mutation_feedback_response_hints.md)
> **Catalog:** [ux_hooks/dedicated_ux_hook_modules.md](../feature_catalog/ux_hooks/dedicated_ux_hook_modules.md)

### 104 | Mutation save-path UX parity and no-op hardening

#### Description
Confirm duplicate-save no-op behavior and atomic-save parity/hints.

#### Scenario Contract
Prompt: `Validate mutation save-path UX parity and no-op hardening against tests/memory-save-ux-regressions.vitest.ts.`

Suite passes and assertions show no false `postMutationHooks` on no-op saves, cache-left-unchanged messaging, and parity between standard and atomic save responses

#### Test Execution
> **Feature File:** [104](ux_hooks/mutation_save_path_ux_parity_and_no_op_hardening.md)
> **Catalog:** [ux_hooks/duplicate_save_no_op_feedback_hardening.md](../feature_catalog/ux_hooks/duplicate_save_no_op_feedback_hardening.md)

### 105 | Context-server success-envelope finalization

#### Description
Confirm `appendAutoSurfaceHints()` runs before budget enforcement and preserves the finalized envelope contract.

#### Scenario Contract
Prompt: `Validate context-server success-envelope finalization against tests/context-server.vitest.ts.`

Context-server suite passes with end-to-end assertions for appended hints, preserved `autoSurfacedContext`, and finalized token metadata

#### Test Execution
> **Feature File:** [105](ux_hooks/context_server_success_envelope_finalization.md)
> **Catalog:** [ux_hooks/context_server_success_hint_append.md](../feature_catalog/ux_hooks/context_server_success_hint_append.md)

### 106 | Hooks barrel + README synchronization

#### Description
Confirm hooks index exports and docs cover the finalized modules and contract fields.

#### Scenario Contract
Prompt: `Validate hooks barrel and README synchronization for mutation-feedback, response-hints, MutationHookResult, and postMutationHooks.`

Expected signals: Both barrel (`hooks/index.ts`) and README (`hooks/README.md`) reference `mutation-feedback`, `response-hints`, `MutationHookResult`, and `postMutationHooks`
Pass/fail: PASS if both files reference the new modules and contract fields

#### Test Execution
> **Feature File:** [106](ux_hooks/hooks_barrel_readme_synchronization.md)
> **Catalog:** [ux_hooks/hooks_readme_and_export_alignment.md](../feature_catalog/ux_hooks/hooks_readme_and_export_alignment.md)

### 107 | Checkpoint confirmName and schema enforcement

#### Description
Confirm delete safety is required across handler and validation layers.

#### Scenario Contract
Prompt: `Validate checkpoint confirmName and schema enforcement across handler, schema, input-validation, and context-server tests.`

Validation and handler suites pass with missing-`confirmName` rejection plus successful delete confirmation reporting

#### Test Execution
> **Feature File:** [107](ux_hooks/checkpoint_confirmname_and_schema_enforcement.md)
> **Catalog:** [ux_hooks/checkpoint_delete_confirmname_safety.md](../feature_catalog/ux_hooks/checkpoint_delete_confirmname_safety.md)

### 108 | Spec 007 finalized verification command suite evidence

#### Description
Confirm the recorded verification set matches the current Spec 007 evidence.

#### Scenario Contract
Prompt: `Validate Spec 007 finalized verification command suite evidence against npx tsc -b and report cited pass/fail evidence.`

`npx tsc -b` PASS, `npm run lint` PASS, UX suite PASS with 7 files / 510 tests, stdio plus embeddings suite PASS with 2 files / 15 tests, and MCP SDK stdio smoke PASS with 28 tools listed

#### Test Execution
> **Feature File:** [108](tooling_and_scripts/spec_007_finalized_verification_command_suite_evidence.md)
> **Catalog:** *(Spec 007 verification suite — no dedicated catalog entry)*

### 109 | Quality-aware 3-tier search fallback

#### Description
Confirm 3-tier degradation chain triggers correctly.

#### Scenario Contract
Prompt: `Validate quality-aware 3-tier search fallback and confirm degradation, tier widening, and final enrichment behave correctly.`

Tier 1 low-quality results trigger Tier 2; Tier 2 forces all channels with minSimilarity=0.1; Tier 3 SQL fallback fires when Tier 2 also fails; _degradation property reflects active tier; SPECKIT_SEARCH_FALLBACK=false disables tiered degradation

#### Test Execution
> **Feature File:** [109](retrieval/quality_aware_3_tier_search_fallback.md)
> **Catalog:** [retrieval/quality_aware_3_tier_search_fallback.md](../feature_catalog/retrieval/quality_aware_3_tier_search_fallback.md)

### 110 | Prediction-error save arbitration

#### Description
Confirm 5-action PE decision engine during save.

#### Scenario Contract
Prompt: `As a mutation validation operator, validate Prediction-error save arbitration against memory_conflicts. Verify each similarity band triggers the correct action (CREATE/REINFORCE/UPDATE/SUPERSEDE/CREATE_LINKED); memory_conflicts table records action/similarity/contradiction; force:true bypasses PE arbitration. Return a concise pass/fail verdict with the main reason and cited evidence.`

Each similarity band triggers the correct action; memory_conflicts rows are recorded; force:true bypasses arbitration; cross-session PE bleed is blocked

#### Test Execution
> **Feature File:** [110](mutation/prediction_error_save_arbitration.md)
> **Catalog:** [mutation/prediction_error_save_arbitration.md](../feature_catalog/mutation/prediction_error_save_arbitration.md)

### 111 | Deferred lexical-only indexing

#### Description
Confirm embedding-failure fallback and BM25 searchability.

#### Scenario Contract
Prompt: `Validate deferred lexical-only indexing after embedding failure.`

Record saved with embedding_status='pending' on embedding failure; BM25/FTS5 lexical search returns the record; reindex transitions status to 'success'; vector search works after reindex

#### Test Execution
> **Feature File:** [111](memory_quality_and_indexing/deferred_lexical_only_indexing.md)
> **Catalog:** [memory_quality_and_indexing/deferred_lexical_only_indexing.md](../feature_catalog/memory_quality_and_indexing/deferred_lexical_only_indexing.md)

### 112 | Cross-process DB hot rebinding

#### Description
Confirm marker-file triggers DB reinitialization.

#### Scenario Contract
Prompt: `Validate cross-process DB hot rebinding against memory_save(filePath) and return pass/fail with cited evidence.`

Server detects DB_UPDATED_FILE marker; DB reinitializes without restart; stats reflect post-mutation state (no stale data); health reports healthy after rebind

#### Test Execution
> **Feature File:** [112](pipeline_architecture/cross_process_db_hot_rebinding.md)
> **Catalog:** [pipeline_architecture/cross_process_db_hot_rebinding.md](../feature_catalog/pipeline_architecture/cross_process_db_hot_rebinding.md)


### 114 | Path traversal validation (P0-4)

#### Description
Verify memory_ingest_start rejects paths outside allowed base directories and paths containing traversal segments.

#### Scenario Contract
Prompt: `Validate memory_ingest_start path traversal checks, including traversal rejection, out-of-base rejection, and valid in-base path acceptance.`

Traversal paths (../) rejected with E_VALIDATION error; absolute paths outside allowed base rejected; valid paths within allowed directories accepted and job created

#### Test Execution
> **Feature File:** [114](lifecycle/path_traversal_validation_p0_4.md)
> **Catalog:** [lifecycle/async_ingestion_job_lifecycle.md](../feature_catalog/lifecycle/async_ingestion_job_lifecycle.md)

### 115 | Transaction atomicity on rename failure (P0-5)

#### Description
Verify that pending file is preserved (not deleted) when rename fails after DB commit, enabling recovery on next startup.

#### Scenario Contract
Prompt: `Validate transaction atomicity on rename failure (P0-5) against executeAtomicSave() and return pass/fail with cited evidence.`

Rename failure returns {success:false, dbCommitted:true}; pending file preserved on disk after failure; recoverAllPendingFiles discovers and recovers the pending file

#### Test Execution
> **Feature File:** [115](pipeline_architecture/transaction_atomicity_on_rename_failure_p0_5.md)
> **Catalog:** [pipeline_architecture/atomic_pending_file_recovery.md](../feature_catalog/pipeline_architecture/atomic_pending_file_recovery.md)

### 116 | Chunking safe swap atomicity (P0-6)

#### Description
Verify re-chunking indexes new chunks before deleting old ones, and old chunks survive if new indexing fails.

#### Scenario Contract
Prompt: `Validate chunking safe swap atomicity (P0-6) and confirm staged re-chunking preserves old data on failures.`

New chunks indexed in staged state before old deletion; old chunks deleted only after successful new indexing; embedding failure preserves old children; handler returns error status on failure

#### Test Execution
> **Feature File:** [116](bug_fixes_and_data_integrity/chunking_safe_swap_atomicity_p0_6.md)
> **Catalog:** [bug_fixes_and_data_integrity/chunking_orchestrator_safe_swap.md](../feature_catalog/bug_fixes_and_data_integrity/chunking_orchestrator_safe_swap.md)

### 117 | SQLite datetime session cleanup (P0-7)

#### Description
Verify cleanupOldSessions() correctly identifies expired sessions using SQLite-native datetime comparison regardless of timestamp format.

#### Scenario Contract
Prompt: `Validate SQLite datetime session cleanup (P0-7) and confirm expired sessions are deleted across timestamp formats.`

Expired session (45min old) deleted; active session (5min old) preserved; cleanup works with both YYYY-MM-DD HH:MM:SS and ISO timestamp formats

#### Test Execution
> **Feature File:** [117](bug_fixes_and_data_integrity/sqlite_datetime_session_cleanup_p0_7.md)
> **Catalog:** [bug_fixes_and_data_integrity/working_memory_timestamp_fix.md](../feature_catalog/bug_fixes_and_data_integrity/working_memory_timestamp_fix.md)

### 118 | Stage-2 score field synchronization (P0-8)

#### Description
Verify intentAdjustedScore reflects all downstream signal modifications after non-hybrid intent weighting.

#### Scenario Contract
Prompt: `Validate Stage-2 score field synchronization with includeTrace evidence for non-hybrid intent weighting.`

intentAdjustedScore set at Step 4 in trace; downstream signals modify score field; final intentAdjustedScore >= score (Math.max sync); resolveEffectiveScore returns synchronized value

#### Test Execution
> **Feature File:** [118](scoring_and_calibration/stage_2_score_field_synchronization_p0_8.md)
> **Catalog:** [scoring_and_calibration/scoring_and_fusion_corrections.md](../feature_catalog/scoring_and_calibration/scoring_and_fusion_corrections.md)

### 119 | Memory filename uniqueness (ensureUniqueMemoryFilename)

#### Description
Confirm collision resolution.

#### Scenario Contract
Prompt: `Validate memory filename uniqueness and collision fallback behavior.`

Second save produces filename with `-1` suffix; both files exist with distinct names; exhausting `-1` through `-100` collisions triggers a random 12-hex fallback suffix from `crypto.randomBytes(6).toString('hex')`, not SHA1; repeated fallback saves still reserve distinct filenames; `memorySequence` increments through the hardened `Number(existing.memorySequence) | 0` coercion; and `memoryNameHistory` is updated.

#### Test Execution
> **Feature File:** [119](memory_quality_and_indexing/memory_filename_uniqueness_ensureuniquememoryfilename.md)
> **Catalog:** [memory_quality_and_indexing/spec_folder_description_discovery.md](../feature_catalog/memory_quality_and_indexing/spec_folder_description_discovery.md)

### 120 | Unified graph rollback and explainability (Phase 3)

#### Description
Confirm graph kill switch removes graph-side effects while traces still explain enabled runs.

#### Scenario Contract
Prompt: `Validate graph rollback and explainability and cite kill-switch behavior, trace explanations, CTE dedup, and deterministic ordering.`

When enabled, trace includes graph contribution summary and repeated identical inputs return identical order; when disabled, graph-side effects are absent and baseline ordering remains deterministic

#### Test Execution
> **Feature File:** [120](graph_signal_activation/unified_graph_rollback_and_explainability_phase_3.md)
> **Catalog:** [graph_signal_activation/unified_graph_retrieval_deterministic_ranking_explainability_and_rollback.md](../feature_catalog/graph_signal_activation/unified_graph_retrieval_deterministic_ranking_explainability_and_rollback.md)

### 121 | Adaptive shadow proposal and rollback (Phase 4)

#### Description
Confirm adaptive scoring runs in shadow mode only, captures bounded proposals, and can be disabled cleanly.

#### Scenario Contract
Prompt: `Validate adaptive shadow proposal and rollback with SPECKIT_MEMORY_ADAPTIVE_RANKING enabled.`

Adaptive proposal is present in shadow mode, proposal deltas are bounded, production ordering is unchanged by the shadow run, and disabling the flag removes adaptive proposal output

#### Test Execution
> **Feature File:** [121](scoring_and_calibration/adaptive_shadow_proposal_and_rollback_phase_4.md)
> **Catalog:** [scoring_and_calibration/adaptive_shadow_ranking_bounded_proposals_and_rollback.md](../feature_catalog/scoring_and_calibration/adaptive_shadow_ranking_bounded_proposals_and_rollback.md)

### 122 | Governed ingest and scope isolation (Phase 5)

#### Description
Confirm governed saves require provenance and scope markers and scoped retrieval blocks cross-actor leakage.

#### Scenario Contract
Prompt: `Validate governed ingest and scope isolation against memory_save(), including provenance rejection, scoped retrieval, leakage blocking, and audit rows.`

Governed save requires provenance; ephemeral save requires deleteAfter; scope mismatches are filtered; governance audit recorded; no orphaned ungoverned row remains after failure

#### Test Execution
> **Feature File:** [122](governance/governed_ingest_and_scope_isolation_phase_5.md)
> **Catalog:** [governance/hierarchical_scope_governance_governed_ingest_retention_and_audit.md](../feature_catalog/governance/hierarchical_scope_governance_governed_ingest_retention_and_audit.md)

### 125 | Memory roadmap flags

#### Description
Verify runtime roadmap resolvers stay distinct from live runtime flags while keeping adaptive ranking default-off until explicitly enabled.

#### Scenario Contract
Prompt: `Validate memory roadmap flag resolution without changing live graph-channel defaults. Work locally in the system-spec-kit mcp_server package, capture the exact commands and outputs, and summarize the result in user language. Capture the evidence needed to prove the first snapshot keeps scope-governance phase with graph-unified metadata on and adaptive ranking off even when SPECKIT_GRAPH_UNIFIED=false is set; the second snapshot uses SPECKIT_MEMORY_ROADMAP_PHASE=graph and SPECKIT_MEMORY_GRAPH_UNIFIED=false to report graph phase with graph-unified metadata off; the third snapshot uses SPECKIT_MEMORY_ADAPTIVE_RANKING=true and reports adaptive ranking on; the fourth snapshot sets SPECKIT_MEMORY_ADAPTIVE_RANKING=false and reports adaptive ranking off again. Return a concise user-facing pass/fail verdict with the main reason.`

First snapshot keeps `scope-governance` phase with graph-unified metadata on and adaptive ranking off; second snapshot reports `graph` phase with graph-unified metadata off; third snapshot reports adaptive ranking on; fourth snapshot confirms explicit canonical opt-out by returning adaptive ranking off again

Adaptive-ranking roadmap metadata now stays default-off until explicitly enabled. This keeps roadmap snapshots aligned with the live runtime gate while preserving explicit opt-in and opt-out behavior.

#### Test Execution
> **Feature File:** 125 memory roadmap flags
> **Catalog:** [feature_flag_reference/1_search_pipeline_features_speckit.md](../feature_catalog/feature_flag_reference/1_search_pipeline_features_speckit.md)

### 126 | Memory roadmap baseline snapshot

#### Description
Verify Phase 1 readiness baselines capture/persist metrics and handle missing context DBs without throwing.

#### Scenario Contract
Prompt: `Validate the memory roadmap baseline snapshot and cite persisted metrics plus missing-context DB fallback coverage.`

Targeted suite passes; transcript shows persisted snapshot rows, missing-context DB zero fallback coverage, and prior eval DB handle restoration after forced init failure

#### Test Execution
> **Feature File:** [126](evaluation_and_measurement/memory_roadmap_baseline_snapshot.md)
> **Catalog:** [evaluation_and_measurement/memory_roadmap_baseline_snapshot.md](../feature_catalog/evaluation_and_measurement/memory_roadmap_baseline_snapshot.md)

### 127 | Migration checkpoint scripts

#### Description
Verify raw SQLite migration checkpoint create/restore helpers produce sidecar metadata and safe restore backups.

#### Scenario Contract
Prompt: `Validate Migration checkpoint scripts against cd .opencode/skills/system-spec-kit/mcp_server and report cited pass/fail evidence.`

Targeted suite passes; transcript shows checkpoint sidecar creation, restore success, and pre-restore backup coverage

#### Test Execution
> **Feature File:** [127](tooling_and_scripts/migration_checkpoint_scripts.md)
> **Catalog:** [tooling_and_scripts/migration_checkpoint_scripts.md](../feature_catalog/tooling_and_scripts/migration_checkpoint_scripts.md)

### 128 | Schema compatibility validation

#### Description
Verify backward-compatibility validation flags required schema gaps without throwing on partial databases.

#### Scenario Contract
Prompt: `Validate Schema compatibility validation against cd .opencode/skills/system-spec-kit/mcp_server and report cited pass/fail evidence.`

Targeted suite passes; transcript shows missing-table reporting and minimal-compatible schema success coverage

#### Test Execution
> **Feature File:** [128](tooling_and_scripts/schema_compatibility_validation.md)
> **Catalog:** [tooling_and_scripts/schema_compatibility_validation.md](../feature_catalog/tooling_and_scripts/schema_compatibility_validation.md)

### 129 | Lineage state active projection and asOf resolution

#### Description
Verify append-first lineage projection and deterministic `asOf` resolution.

#### Scenario Contract
Prompt: `Validate lineage state active projection and asOf resolution in the MCP server and return pass/fail with cited evidence.`

Targeted suite passes; transcript shows active projection selection, deterministic `asOf` resolution, malformed-chain detection, and timestamp-order coverage for non-ISO or timezone variants

#### Test Execution
> **Feature File:** [129](pipeline_architecture/lineage_state_active_projection_and_asof_resolution.md)
> **Catalog:** [pipeline_architecture/lineage_state_active_projection_and_asof_resolution.md](../feature_catalog/pipeline_architecture/lineage_state_active_projection_and_asof_resolution.md)

### 130 | Lineage backfill rollback drill

#### Description
Verify dry-run planning, idempotent backfill, and checkpoint-backed rollback for Phase 2 lineage rollout.

#### Scenario Contract
Prompt: `Validate the lineage backfill rollback drill in the MCP server and return pass/fail with cited evidence.`

Targeted suite passes; transcript shows dry-run plan counts, successful backfill application, idempotent rerun, and checkpoint restore rollback

#### Test Execution
> **Feature File:** [130](pipeline_architecture/lineage_backfill_rollback_drill.md)
> **Catalog:** [pipeline_architecture/lineage_state_active_projection_and_asof_resolution.md](../feature_catalog/pipeline_architecture/lineage_state_active_projection_and_asof_resolution.md)

### 131 | Description.json batch backfill validation (PI-B3)

#### Description
Confirm batch-generated folder descriptions exist and conform to schema.

#### Scenario Contract
Prompt: `Validate description.json batch backfill schema coverage.`

Description.json coverage stays in parity with the current active spec inventory; all JSON files parse without syntax errors; C1 field-type checks pass with `specId` string, `parentChain` array of strings, and `memorySequence` number; schema fields are present at varying depths; per-folder files preferred over spec.md fallback

#### Test Execution
> **Feature File:** [131](memory_quality_and_indexing/description_json_batch_backfill_validation_pi_b3.md)
> **Catalog:** [memory_quality_and_indexing/spec_folder_description_discovery.md](../feature_catalog/memory_quality_and_indexing/spec_folder_description_discovery.md)

### 132 | description.json schema field validation

#### Description
Confirm per-folder description metadata matches schema contract.

#### Scenario Contract
Prompt: `Validate description.json schema field validation and repair behavior.`

description.json generated on folder creation with all 9 required fields; field types match contract with strings for `specId`, `folderSlug`, `specFolder`, `description`, and `lastUpdated`, arrays of strings for `parentChain`, `memoryNameHistory`, and `keywords`, and number for `memorySequence`; `memorySequence` and `memoryNameHistory` update on save; corrupted fields repaired on regeneration

#### Test Execution
> **Feature File:** [132](memory_quality_and_indexing/description_json_schema_field_validation.md)
> **Catalog:** [memory_quality_and_indexing/spec_folder_description_discovery.md](../feature_catalog/memory_quality_and_indexing/spec_folder_description_discovery.md)

### 133 | Dry-run preflight for memory_save

#### Description
Confirm dry-run previews preflight plus semantic insufficiency without indexing side effects.

#### Scenario Contract
Prompt: `Validate dry-run preflight for memory_save without indexing side effects.`

Dry-run returns preflight plus quality-loop and sufficiency payloads; thin memories report `INSUFFICIENT_CONTEXT_ABORT` without indexing/database mutation; `force:true` does not bypass insufficiency; rich non-dry-run save indexes the same file

#### Test Execution
> **Feature File:** [133](memory_quality_and_indexing/dry_run_preflight_for_memory_save.md)
> **Catalog:** [memory_quality_and_indexing/dry_run_preflight_for_memory_save.md](../feature_catalog/memory_quality_and_indexing/dry_run_preflight_for_memory_save.md)


### 135 | Grep traceability for feature catalog code references

#### Description
Verify feature-source traceability through feature catalog docs and the catalog code-reference index, without requiring in-code catalog comments.

#### Scenario Contract
Prompt: `Validate feature-source traceability for feature catalog code references through the feature catalog docs and catalog code-reference index, then report cited pass/fail evidence without requiring // Feature catalog: comments in code.`

Feature catalog docs and the catalog code-reference index identify the expected handler and lib source anchors; all referenced files exist

#### Test Execution
> **Feature File:** [135](tooling_and_scripts/grep_traceability_for_feature_catalog_code_references.md)
> **Catalog:** [tooling_and_scripts/feature_catalog_code_references.md](../feature_catalog/tooling_and_scripts/feature_catalog_code_references.md)

### 136 | Feature catalog annotation name validity

#### Description
Verify all annotation names cross-reference against catalog H3 headings with 0 invalid.

#### Scenario Contract
Prompt: `Validate Feature catalog annotation name validity against the documented validation surface and report cited pass/fail evidence.`

Expected signals: verify_alignment_drift.py or grep output shows 0 annotation names that fail to match an H3 heading in feature_catalog.md.

#### Test Execution
> **Feature File:** [136](tooling_and_scripts/feature_catalog_annotation_name_validity.md)
> **Catalog:** [tooling_and_scripts/feature_catalog_code_references.md](../feature_catalog/tooling_and_scripts/feature_catalog_code_references.md)

### 137 | Multi-feature annotation coverage

#### Description
Verify known multi-feature files have annotation count >= 2.

#### Scenario Contract
Prompt: `Validate Multi-feature annotation coverage against handlers/memory-save.ts and report cited pass/fail evidence.`

All known multi-feature files carry >= 2 annotations; annotations are semantically appropriate

#### Test Execution
> **Feature File:** [137](tooling_and_scripts/multi_feature_annotation_coverage.md)
> **Catalog:** [tooling_and_scripts/feature_catalog_code_references.md](../feature_catalog/tooling_and_scripts/feature_catalog_code_references.md)

### 138 | MODULE: header compliance via verify_alignment_drift.py

#### Description
Verify `verify_alignment_drift.py` returns 0 TS-MODULE-HEADER findings.

#### Scenario Contract
Prompt: `Validate MODULE: header compliance via verify_alignment_drift.py against cd .opencode/skills/system-spec-kit and report cited pass/fail evidence.`

verify_alignment_drift.py reports PASS with 0 TS-MODULE-HEADER findings

#### Test Execution
> **Feature File:** [138](tooling_and_scripts/module_header_compliance_via_verify_alignment_drift_py.md)
> **Catalog:** [tooling_and_scripts/feature_catalog_code_references.md](../feature_catalog/tooling_and_scripts/feature_catalog_code_references.md)

### 139 | Session capturing pipeline quality

#### Description
Canonical coverage sourced from M-007 session-capturing closure verification.

#### Scenario Contract
Prompt: `Validate Session capturing pipeline quality against the documented validation surface and report cited pass/fail evidence.`

Coverage is sourced from the M-007 closure suite, including JSON authority, shipped structured-summary fields (`toolCalls`, `exchanges`), file-backed JSON authority, output-quality hardening, insufficiency rejection, and indexing readiness.

Current claim boundary:
- Automated parity proves the shared runtime contract.
- Retained live artifacts are still required before claiming flawless current coverage across every supported CLI and save mode.

#### Test Execution
> **Feature File:** [139](tooling_and_scripts/session_capturing_pipeline_quality_coverage.md)
> **Catalog:** [tooling_and_scripts/session_capturing_pipeline_quality.md](../feature_catalog/tooling_and_scripts/session_capturing_pipeline_quality.md)

### 142 | Session transition trace contract

#### Description
Verify `memory_context` emits trace-only session transitions with no non-trace leakage.

#### Scenario Contract
Prompt: `Validate session transition tracing and confirm trace-only sessionTransition output appears without non-trace metadata leakage.`

Trace-enabled responses include spec-shaped `sessionTransition`; non-trace responses omit it entirely; no top-level metadata leak appears when trace is disabled

#### Test Execution
> **Feature File:** [142](retrieval/session_transition_trace_contract.md)
> **Catalog:** [retrieval/unified_context_retrieval_memorycontext.md](../feature_catalog/retrieval/unified_context_retrieval_memorycontext.md)

### 143 | Bounded graph-walk rollout and diagnostics

#### Description
Verify `SPECKIT_GRAPH_WALK_ROLLOUT` changes diagnostics and bounded bonus behavior without destabilizing ordering.

#### Scenario Contract
Prompt: `Validate bounded graph diagnostics and confirm live trace fields and deterministic ordering remain stable.`

Rollout states switch cleanly between `trace_only`, `bounded_runtime`, and `off`; trace diagnostics expose raw/normalized metrics; bounded runtime never exceeds the Stage 2 cap; `off` disables only the graph-walk bonus ladder, not the broader graph-signal feature flag; repeated identical runs preserve deterministic ordering

#### Test Execution
> **Feature File:** [143](retrieval/bounded_graph_walk_rollout_and_diagnostics.md)
> **Catalog:** [retrieval/semantic_and_lexical_search_memorysearch.md](../feature_catalog/retrieval/semantic_and_lexical_search_memorysearch.md)

### 144 | Advisory ingest lifecycle forecast

#### Description
Verify `memory_ingest_status` exposes advisory forecast fields and degrades safely on sparse progress.

#### Scenario Contract
Prompt: `Validate advisory ingest lifecycle forecasts, including forecast fields, sparse-progress degradation, ETA/risk updates, and additive telemetry.`

Status payloads always include a `forecast` object; sparse progress yields null or low-confidence fields plus caveat text; progressing jobs update ETA/risk fields without breaking the handler contract; optional telemetry remains additive

#### Test Execution
> **Feature File:** [144](lifecycle/advisory_ingest_lifecycle_forecast.md)
> **Catalog:** [lifecycle/async_ingestion_job_lifecycle.md](../feature_catalog/lifecycle/async_ingestion_job_lifecycle.md)

### 145 | Contextual tree injection 

#### Description
Verify hierarchical spec-folder headers are injected into search results when `SPECKIT_CONTEXT_HEADERS=true` and suppressed when disabled.

#### Scenario Contract
Prompt: `As a retrieval-enhancement validation operator, validate Contextual tree injection (P1-4) against memory_search({ query:"spec folder context headers", includeContent:true, includeTrace:true, limit:5 }). Verify hierarchical spec-folder headers are injected into search results when SPECKIT_CONTEXT_HEADERS=true and suppressed when disabled. Return a concise pass/fail verdict with the main reason and cited evidence.`

Enabled: results with spec-folder paths have `[parent > child — description]` headers prepended, truncated at 100 chars; Disabled: no headers injected, content unchanged

#### Test Execution
> **Feature File:** [145](retrieval_enhancements/contextual_tree_injection_p1_4.md)
> **Catalog:** [retrieval_enhancements/contextual_tree_injection.md](../feature_catalog/retrieval_enhancements/contextual_tree_injection.md)

### 146 | Dynamic server instructions 

#### Description
Verify `setInstructions()` is called at MCP startup with memory count, spec folder count, channel list, and stale warning.

#### Scenario Contract
Prompt: `Validate dynamic server instructions (P1-6) against setInstructions() and return pass/fail with cited evidence.`

Startup instructions include memory system overview with counts and channels; stale warning appears only above threshold; disabled flag yields empty instructions

#### Test Execution
> **Feature File:** [146](pipeline_architecture/dynamic_server_instructions_p1_6.md)
> **Catalog:** [pipeline_architecture/dynamic_server_instructions_at_mcp_initialization.md](../feature_catalog/pipeline_architecture/dynamic_server_instructions_at_mcp_initialization.md)

### 147 | Constitutional memory manager command

#### Description
Verify `/memory:learn` flows and active docs all reflect the constitutional-only workflow.

#### Scenario Contract
Prompt: `Validate Constitutional memory manager command against /memory:learn and report cited pass/fail evidence.`

Constitutional memory manager

#### Test Execution
> **Feature File:** [147](tooling_and_scripts/constitutional_memory_manager_command.md)
> **Catalog:** [tooling_and_scripts/constitutional_memory_manager_command.md](../feature_catalog/tooling_and_scripts/constitutional_memory_manager_command.md)

### 149 | Rendered spec-doc record template contract

#### Description
Confirm malformed rendered spec-doc records fail before write/index and valid rendered output remains validator-clean.

#### Scenario Contract
Prompt: `Validate Rendered spec-doc record template contract against memory_save({ filePath:"<sandbox-file>", dryRun:true }) and report cited pass/fail evidence.`

Dry-run surfaces template-contract violations; non-dry-run rejects malformed files before index side effects; valid rendered output remains validator-clean

#### Test Execution
> **Feature File:** [149](tooling_and_scripts/rendered_memory_template_contract.md)
> **Catalog:** [tooling_and_scripts/session_capturing_pipeline_quality.md](../feature_catalog/tooling_and_scripts/session_capturing_pipeline_quality.md)

### 150 | Source-dist alignment validation

#### Description
Validate the check-source-dist-alignment.ts script detects no orphaned dist files. Verify every dist/lib/*.js maps to a source .ts file.

#### Scenario Contract
Prompt: `Validate Source-dist alignment validation against cd .opencode/skills/system-spec-kit and report cited pass/fail evidence.`

0 violations, all dist files aligned, exit code 0

#### Test Execution
> **Feature File:** [150](tooling_and_scripts/source_dist_alignment_validation.md)
> **Catalog:** [tooling_and_scripts/source_dist_alignment_enforcement.md](../feature_catalog/tooling_and_scripts/source_dist_alignment_enforcement.md)

### 151 | MODULE_MAP.md accuracy validation

#### Description
Validate MODULE_MAP.md content accuracy by spot-checking module entries against actual code structure. Verify listed files exist and consumers are correct.

#### Scenario Contract
Prompt: `Validate MODULE_MAP.md accuracy validation against cd .opencode/skills/system-spec-kit and report cited pass/fail evidence.`

All 5 sampled modules have accurate file lists and consumer mappings

#### Test Execution
> **Feature File:** [151](tooling_and_scripts/module_map_accuracy.md)
> **Catalog:** [tooling_and_scripts/module_boundary_map.md](../feature_catalog/tooling_and_scripts/module_boundary_map.md)

### 152 | No symlinks in lib/ tree

#### Description
Validate the no-symlinks policy by confirming zero symlinks exist under mcp_server/lib/. Enforces the ARCHITECTURE.md "No Symlinks in lib/ Tree" policy.

#### Scenario Contract
Prompt: `Validate No symlinks in lib/ tree against cd .opencode/skills/system-spec-kit and report cited pass/fail evidence.`

Zero symlinks found

#### Test Execution
> **Feature File:** [152](tooling_and_scripts/no_symlinks_in_lib_tree.md)
> **Catalog:** [tooling_and_scripts/module_boundary_map.md](../feature_catalog/tooling_and_scripts/module_boundary_map.md)

### 153 | JSON mode structured summary hardening

#### Description
Verify the structured JSON summary contract for `generate-context.js`, including `toolCalls`/`exchanges` fields, file-backed JSON authority, and Wave 2 hardening.

#### Scenario Contract
Prompt: `Validate JSON mode structured summary hardening against toolCalls and report cited pass/fail evidence.`

Structured fields preserved in rendered output, counts match explicit input, file-backed JSON stays on the structured path

#### Test Execution
> **Feature File:** [153](tooling_and_scripts/json_mode_hybrid_enrichment.md)
> **Catalog:** [tooling_and_scripts/json_mode_hybrid_enrichment.md](../feature_catalog/tooling_and_scripts/json_mode_hybrid_enrichment.md)

### 154 | JSON-primary deprecation posture

#### Description
Verify the JSON-only save contract: `--json` succeeds, direct positional rejects.

#### Scenario Contract
Prompt: `Validate JSON-primary deprecation posture against the documented validation surface and report cited pass/fail evidence.`

Path 1 exits 0, Path 2 exits non-zero with guidance text

#### Test Execution
> **Feature File:** [154](tooling_and_scripts/json_primary_deprecation_posture.md)
> **Catalog:** [tooling_and_scripts/json_primary_deprecation_posture.md](../feature_catalog/tooling_and_scripts/json_primary_deprecation_posture.md)

### 155 | Post-save quality review

#### Description
Confirm the POST-SAVE QUALITY REVIEW hook fires after JSON mode saves, surfaces field-propagation failures with severity-graded instructions, and guides AI remediation.

#### Scenario Contract
Prompt: `Validate post-save quality review issue detection and remediation guidance.`

REVIEW block present in stdout; issue count and severity match the scenario; fix instructions are actionable

#### Test Execution
> **Feature File:** [155](memory_quality_and_indexing/post_save_quality_review.md)
> **Catalog:** [memory_quality_and_indexing/post_save_quality_review.md](../feature_catalog/memory_quality_and_indexing/post_save_quality_review.md)

### 156 | Graph refresh mode (SPECKIT_GRAPH_REFRESH_MODE)

#### Description
Verify dirty-node tracking fires in write_local mode when saving a spec-doc record with entity edges.

#### Scenario Contract
Prompt: `Validate graph refresh write-local mode and cite dirty-node tracking, local recompute, component size estimation, and cleanup.`

markDirty() populates dirty-node set; onWrite() returns localRecomputed=true and skipped=false; component size estimation runs; dirty nodes cleared after local recompute

#### Test Execution
> **Feature File:** [156](graph_signal_activation/graph_refresh_mode_speckit_graph_refresh_mode.md)
> **Catalog:** [graph_signal_activation/graph_lifecycle_refresh.md](../feature_catalog/graph_signal_activation/graph_lifecycle_refresh.md)

### 157 | LLM graph backfill (SPECKIT_LLM_GRAPH_BACKFILL)

#### Description
Verify backfill hook registration and scheduling for high-value documents when the flag is enabled.

#### Scenario Contract
Prompt: `Validate LLM graph backfill and cite hook registration, high-value scheduling, async callback, and low-value suppression.`

onIndex() returns llmBackfillScheduled=true when qualityScore >= threshold; backfill callback is invoked via setImmediate; low-value docs (qualityScore < 0.7) do not trigger backfill

#### Test Execution
> **Feature File:** [157](graph_signal_activation/llm_graph_backfill_speckit_llm_graph_backfill.md)
> **Catalog:** [graph_signal_activation/llm_graph_backfill.md](../feature_catalog/graph_signal_activation/llm_graph_backfill.md)

### 158 | Graph calibration profile (SPECKIT_GRAPH_CALIBRATION_PROFILE)

#### Description
Verify graph weight cap enforcement at 0.05 and community score capping at 0.03 when graph calibration profile is enabled.

#### Scenario Contract
Prompt: `Validate graph calibration profile and cite graph weight caps, community score caps, Louvain thresholds, and N2 cap enforcement.`

applyGraphWeightCap() clamps values to [0, 0.05]; applyCommunityScoring() caps boost at 0.03; shouldActivateLouvain() returns activate=false when density or size below thresholds; calibrateGraphWeight() enforces N2a/N2b caps

#### Test Execution
> **Feature File:** [158](graph_signal_activation/graph_calibration_profile_speckit_graph_calibration_profile.md)
> **Catalog:** [graph_signal_activation/graph_calibration_profiles.md](../feature_catalog/graph_signal_activation/graph_calibration_profiles.md)

### 159 | Learned Stage 2 combiner (SPECKIT_LEARNED_STAGE2_COMBINER)

#### Description
Verify shadow scoring produces learned vs manual comparison output without affecting live ranking.

#### Scenario Contract
Prompt: `Validate Learned Stage 2 combiner shadow comparisons with SPECKIT_LEARNED_STAGE2_COMBINER enabled.`

shadowScore() returns ShadowResult with learnedScore in [0,1], manualScore matching input, and delta = |learned - manual|; trainRegularizedLinearRanker() produces valid weights; predict() clamps output to [0,1]; flag OFF returns null (no overhead)

#### Test Execution
> **Feature File:** [159](scoring_and_calibration/learned_stage2_combiner_speckit_learned_stage2_combiner.md)
> **Catalog:** [scoring_and_calibration/learned_stage2_weight_combiner.md](../feature_catalog/scoring_and_calibration/learned_stage2_weight_combiner.md)

### 160 | Shadow feedback (SPECKIT_SHADOW_FEEDBACK)

#### Description
Verify shadow scoring log entries are created and holdout evaluation runs without mutating live rankings.

#### Scenario Contract
Prompt: `Validate Shadow feedback logging and holdout evaluation with SPECKIT_SHADOW_FEEDBACK enabled.`

shadow_scoring_log table has rows with query_id, result_id, live_rank, shadow_rank, delta, direction; compareRanks() produces RankComparisonResult with kendallTau and ndcgDelta; evaluatePromotionGate() returns ready/wait/rollback; no live ranking columns mutated

#### Test Execution
> **Feature File:** [160](scoring_and_calibration/shadow_feedback_speckit_shadow_feedback.md)
> **Catalog:** [scoring_and_calibration/shadow_feedback_holdout_evaluation.md](../feature_catalog/scoring_and_calibration/shadow_feedback_holdout_evaluation.md)

### 161 | LLM reformulation (SPECKIT_LLM_REFORMULATION)

#### Description
Verify reformulation pipeline runs in deep mode with corpus-grounded seeds, producing a step-back abstract and variants.

#### Scenario Contract
Prompt: `As a query_intelligence validation operator, validate LLM reformulation (SPECKIT_LLM_REFORMULATION) against memory_search({ query: "complex multi-faceted query", mode: "deep" }). Verify reformulation pipeline runs in deep mode with corpus-grounded seeds. Return a concise pass/fail verdict with the main reason and cited evidence.`

cheapSeedRetrieve() returns up to 3 seed results from FTS5; ReformulationResult contains abstract (>= 5 chars) and variants array (max 2 entries); LLM cache hit on repeated query; reformulated hits respect scope, contextType and qualityThreshold before merge; pipeline is no-op when mode != deep

#### Test Execution
> **Feature File:** [161](query_intelligence/llm_reformulation_speckit_llm_reformulation.md)
> **Catalog:** [query_intelligence/llm_query_reformulation.md](../feature_catalog/query_intelligence/llm_query_reformulation.md)

### 162 | HyDE (SPECKIT_HYDE)

#### Description
Verify HyDE pseudo-document generation for low-confidence deep queries with default-active behavior and optional shadow mode.

#### Scenario Contract
Prompt: `As a query_intelligence validation operator, validate HyDE (SPECKIT_HYDE) against SPECKIT_HYDE=true. Verify hyDE pseudo-document generation for low-confidence deep queries. Return a concise pass/fail verdict with the main reason and cited evidence.`

HyDEResult contains pseudoDocument (non-empty) and embedding (Float32Array); low-confidence detection uses the max score across the full baseline set; LLM cache shared with reformulation; HyDE hits respect scope, contextType and qualityThreshold before merge; setting `SPECKIT_HYDE_ACTIVE=false` switches to shadow-only logging without merge

#### Test Execution
> **Feature File:** [162](query_intelligence/hyde_speckit_hyde.md)
> **Catalog:** [query_intelligence/hyde_hypothetical_document_embeddings.md](../feature_catalog/query_intelligence/hyde_hypothetical_document_embeddings.md)

### 163 | Query surrogates (SPECKIT_QUERY_SURROGATES)

#### Description
Verify surrogate metadata generated at index time and matched at query time with boost scores.

#### Scenario Contract
Prompt: `As a query_intelligence validation operator, validate Query surrogates (SPECKIT_QUERY_SURROGATES) against SPECKIT_QUERY_SURROGATES=true. Verify surrogate metadata generated at index time and matched at query time. Return a concise pass/fail verdict with the main reason and cited evidence.`

SurrogateMetadata contains aliases (from parenthetical abbreviations), headings, summary (max 200 chars), and surrogateQuestions (2-5 entries); query-time matching produces SurrogateMatchResult with score in [0,1] and matchedSurrogates list; no LLM calls on the default path

#### Test Execution
> **Feature File:** [163](query_intelligence/query_surrogates_speckit_query_surrogates.md)
> **Catalog:** [query_intelligence/index_time_query_surrogates.md](../feature_catalog/query_intelligence/index_time_query_surrogates.md)


### 165 | Assistive reconsolidation (SPECKIT_ASSISTIVE_RECONSOLIDATION)

#### Description
Verify near-duplicate auto-merge and borderline recommendation behavior with correct similarity tier classification.

#### Scenario Contract
Prompt: `Validate assistive reconsolidation merge and recommendation behavior.`

similarity >= 0.96 returns 'auto_merge'; 0.88 <= similarity < 0.96 returns 'review' with AssistiveRecommendation logged; similarity < 0.88 returns 'keep_separate'; review tier produces classification (supersede/complement/keep_separate) without destructive action

#### Test Execution
> **Feature File:** [165](memory_quality_and_indexing/assistive_reconsolidation_speckit_assistive_reconsolidation.md)
> **Catalog:** [memory_quality_and_indexing/assistive_reconsolidation.md](../feature_catalog/memory_quality_and_indexing/assistive_reconsolidation.md)

### 166 | Result explain v1 (SPECKIT_RESULT_EXPLAIN)

#### Description
Verify two-tier explainability attachment to search results with slim tier (summary + topSignals) and debug tier (channelContribution).

#### Scenario Contract
Prompt: `Validate result explain v1 behavior with SPECKIT_RESULT_EXPLAIN enabled and disabled.`

Each result has why.summary string (non-empty); why.topSignals array with SignalLabel entries (e.g., 'semantic_match', 'graph_boosted', 'anchor:decisions'); channelContribution with vector/fts/graph numbers only in debug mode; no why field when flag OFF

#### Test Execution
> **Feature File:** [166](ux_hooks/result_explain_v1_speckit_result_explain_v1.md)
> **Catalog:** [ux_hooks/result_explainability.md](../feature_catalog/ux_hooks/result_explainability.md)

### 167 | Response profile v1 (SPECKIT_RESPONSE_PROFILE)

#### Description
Verify mode-aware response shape routing for quick, research, and resume profiles with token savings calculation.

#### Scenario Contract
Prompt: `Validate response profile v1 quick-mode response routing with SPECKIT_RESPONSE_PROFILE enabled.`

quick profile returns QuickProfile with topResult, oneLineWhy, omittedCount, and tokenReduction.savingsPercent; research profile returns results[], evidenceDigest, followUps[]; resume profile returns state, nextSteps[], blockers[]; original full response when flag OFF or profile omitted

#### Test Execution
> **Feature File:** [167](ux_hooks/response_profile_v1_speckit_response_profile_v1.md)
> **Catalog:** [ux_hooks/mode_aware_response_profiles.md](../feature_catalog/ux_hooks/mode_aware_response_profiles.md)

### 168 | Progressive disclosure v1 (SPECKIT_PROGRESSIVE_DISCLOSURE)

#### Description
Verify additive disclosure payload and cursor pagination in response while preserving full results.

#### Scenario Contract
Prompt: `Validate progressive disclosure v1 metadata and cursor pagination for broad memory_search results.`

data.results remains present; data.progressiveDisclosure.summaryLayer with count and digest; data.progressiveDisclosure.results as Snippet[] with snippet (max 100 chars), detailAvailable, resultId; continuation cursor with remainingCount; cursor expiry at DEFAULT_CURSOR_TTL_MS (5 min); page size DEFAULT_PAGE_SIZE (5)

#### Test Execution
> **Feature File:** [168](ux_hooks/progressive_disclosure_v1_speckit_progressive_disclosure_v1.md)
> **Catalog:** [ux_hooks/progressive_disclosure.md](../feature_catalog/ux_hooks/progressive_disclosure.md)

### 169 | Session retrieval state v1 (SPECKIT_SESSION_RETRIEVAL_STATE)

#### Description
Verify additive session-state metadata and goal refinement are emitted on session-aware searches.

#### Scenario Contract
Prompt: `Validate session retrieval state metadata and goal refinement for session-aware memory_search.`

data.sessionState includes activeGoal, seenResultIds, openQuestions, preferredAnchors; data.goalRefinement includes activeGoal and applied status; follow-up search in same session can deprioritize seen results (score * 0.3 fallback path); session expires after SESSION_TTL_MS (30 min); LRU eviction at MAX_SESSIONS (100)

#### Test Execution
> **Feature File:** [169](ux_hooks/session_retrieval_state_v1_speckit_session_retrieval_state_v1.md)
> **Catalog:** [ux_hooks/retrieval_session_state.md](../feature_catalog/ux_hooks/retrieval_session_state.md)

### 171 | Calibrated overlap bonus (SPECKIT_CALIBRATED_OVERLAP_BONUS)

#### Description
Verify calibrated overlap bonus replaces flat convergence bonus in RRF fusion with correct beta=0.15 scaling and 0.06 cap.

#### Scenario Contract
Prompt: `Validate calibrated overlap bonus replacement of the flat convergence bonus in RRF fusion.`

Calibrated bonus computed using CALIBRATED_OVERLAP_BETA=0.15 and mean normalized top score; bonus clamped to CALIBRATED_OVERLAP_MAX=0.06; flat CONVERGENCE_BONUS=0.10 not applied when flag ON

#### Test Execution
> **Feature File:** [171](scoring_and_calibration/calibrated_overlap_bonus_speckit_calibrated_overlap_bonus.md)
> **Catalog:** [scoring_and_calibration/calibrated_overlap_bonus.md](../feature_catalog/scoring_and_calibration/calibrated_overlap_bonus.md)

### 172 | RRF K experimental (SPECKIT_RRF_K_EXPERIMENTAL)

#### Description
Verify per-intent K optimization selects best K from sweep grid {10,20,40,60,80,100,120} using NDCG@10.

#### Scenario Contract
Prompt: `Validate RRF K experimental per-intent optimization across the sweep grid.`

perIntentKSweep() groups queries by intent and sweeps JUDGED_K_SWEEP_VALUES; argmaxNdcg10() selects K maximizing NDCG@10 with ties broken by lower K; falls back to DEFAULT_K=40 when OFF

#### Test Execution
> **Feature File:** [172](scoring_and_calibration/rrf_k_experimental_speckit_rrf_k_experimental.md)
> **Catalog:** [scoring_and_calibration/rrf_k_experimental.md](../feature_catalog/scoring_and_calibration/rrf_k_experimental.md)

### 173 | Query decomposition (SPECKIT_QUERY_DECOMPOSITION)

#### Description
Verify bounded facet detection decomposes multi-faceted queries into max 3 sub-queries using rule-based heuristics in deep mode.

#### Scenario Contract
Prompt: `As a query_intelligence validation operator, validate Query decomposition (SPECKIT_QUERY_DECOMPOSITION) against SPECKIT_QUERY_DECOMPOSITION. Verify bounded facet detection decomposes multi-faceted queries into max 3 sub-queries. Return a concise pass/fail verdict with the main reason and cited evidence.`

Conjunction splitting on "and"/"or"/"also"/"plus"/"as well as"/"along with"; multiple wh-question word detection; MAX_FACETS=3 cap enforced; no LLM calls; deep-mode only activation; graceful fallback returns original query on error

#### Test Execution
> **Feature File:** [173](query_intelligence/query_decomposition_speckit_query_decomposition.md)
> **Catalog:** [query_intelligence/query_decomposition.md](../feature_catalog/query_intelligence/query_decomposition.md)

### 174 | Graph concept routing (SPECKIT_GRAPH_CONCEPT_ROUTING)

#### Description
Verify query-time alias matching activates graph channel for matched concepts via noun phrase extraction.

#### Scenario Contract
Prompt: `Validate graph concept routing and cite alias matching, canonical concepts, graph channel activation, and default enablement.`

Noun phrases extracted from query; concept alias table matched in SQLite; canonical concept names returned; graph channel activated in stage1-candidate-gen for matched concepts; isGraphConceptRoutingEnabled() returns true by default

#### Test Execution
> **Feature File:** [174](graph_signal_activation/graph_concept_routing_speckit_graph_concept_routing.md)
> **Catalog:** [query_intelligence/graph_concept_routing.md](../feature_catalog/query_intelligence/graph_concept_routing.md)

### 175 | Typed traversal (SPECKIT_TYPED_TRAVERSAL)

#### Description
Verify sparse-first policy constrains to 1-hop in sparse graphs and intent-aware edge traversal applies correct scoring formula.

#### Scenario Contract
Prompt: `Validate typed traversal and cite sparse-first gating, hop limits, intent edge priorities, scoring formula, and prior tiers.`

SPARSE_DENSITY_THRESHOLD=0.5 gates sparse-first policy; SPARSE_MAX_HOPS=1 constrains traversal in sparse graphs; INTENT_EDGE_PRIORITY maps intents to edge-type orderings; scoring formula = seedScore * edgePrior * hopDecay * freshness; edge prior tiers: first=1.0, second=0.75, remaining=0.5

#### Test Execution
> **Feature File:** [175](graph_signal_activation/typed_traversal_speckit_typed_traversal.md)
> **Catalog:** [graph_signal_activation/typed_traversal.md](../feature_catalog/graph_signal_activation/typed_traversal.md)


### 177 | Hybrid decay policy (SPECKIT_HYBRID_DECAY_POLICY)

#### Description
Verify type-aware no-decay FSRS policy assigns Infinity stability to decision/constitutional/critical types while standard FSRS decay applies to others.

#### Scenario Contract
Prompt: `Validate hybrid decay policy for no-decay memory types.`

classifyHybridDecay() maps decision/constitutional/critical to no_decay class; applyHybridDecayPolicy() returns Infinity stability for no_decay types; standard FSRS v4 power-law decay for all other types; separate from TM-03

#### Test Execution
> **Feature File:** [177](memory_quality_and_indexing/hybrid_decay_policy_speckit_hybrid_decay_policy.md)
> **Catalog:** [memory_quality_and_indexing/hybrid_decay_policy.md](../feature_catalog/memory_quality_and_indexing/hybrid_decay_policy.md)

### 178 | Save quality gate exceptions (SPECKIT_SAVE_QUALITY_GATE_EXCEPTIONS)

#### Description
Verify short-critical quality gate exception allows decision documents with >=2 structural signals to bypass the 50-char minimum content length check.

#### Scenario Contract
Prompt: `Validate save quality gate exceptions for short decision documents.`

context_type=decision required; SHORT_CRITICAL_MIN_STRUCTURAL_SIGNALS=2 threshold; bypasses MIN_CONTENT_LENGTH=50 in Layer 1; non-decision types still rejected

#### Test Execution
> **Feature File:** [178](memory_quality_and_indexing/save_quality_gate_exceptions_speckit_save_quality_gate_exceptions.md)
> **Catalog:** [memory_quality_and_indexing/save_quality_gate_exceptions.md](../feature_catalog/memory_quality_and_indexing/save_quality_gate_exceptions.md)

### 179 | Empty result recovery (SPECKIT_EMPTY_RESULT_RECOVERY)

#### Description
Verify structured recovery payloads for empty/weak search results across all 3 statuses: no_results, low_confidence, partial.

#### Scenario Contract
Prompt: `Validate empty result recovery payloads for empty and weak memory_search results.`

3 statuses: no_results, low_confidence, partial; root cause reasons: spec_filter_too_narrow, low_signal_query, knowledge_gap; suggested actions: retry_broader, switch_mode, save_memory, ask_user; DEFAULT_LOW_CONFIDENCE_THRESHOLD=0.4; PARTIAL_RESULT_MIN=3

#### Test Execution
> **Feature File:** [179](ux_hooks/empty_result_recovery_speckit_empty_result_recovery_v1.md)
> **Catalog:** [ux_hooks/empty_result_recovery.md](../feature_catalog/ux_hooks/empty_result_recovery.md)

### 180 | Result confidence (SPECKIT_RESULT_CONFIDENCE)

#### Description
Verify per-result calibrated confidence scoring with 3-factor weighting: margin (0.35), channel agreement (0.30), anchor density (0.15).

#### Scenario Contract
Prompt: `Validate result confidence scoring factors, thresholds, labels, drivers, and requestQuality output.`

3 factors: margin 0.35, channel agreement 0.30, anchor density 0.15; HIGH_THRESHOLD=0.7; LOW_THRESHOLD=0.4; labels: high/medium/low; confidence drivers reported per result; heuristic only (no LLM)

#### Test Execution
> **Feature File:** [180](ux_hooks/result_confidence_speckit_result_confidence_v1.md)
> **Catalog:** [ux_hooks/result_confidence.md](../feature_catalog/ux_hooks/result_confidence.md)

### 181 | Template Compliance Contract Enforcement

#### Description
Verify the 3-layer template compliance system prevents non-compliant spec documents from being created.

#### Scenario Contract
Prompt: `Validate Template Compliance Contract Enforcement against bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh --strict <spec-folder> and report cited pass/fail evidence.`

All 5 Level 2 files pass `validate.sh --strict` with exit code 0 and require no post-hoc fixes

#### Test Execution
> **Feature File:** [181](tooling_and_scripts/template_compliance_contract_enforcement_produces_compliant.md)
> **Catalog:** [tooling_and_scripts/template_compliance_contract_enforcement.md](../feature_catalog/tooling_and_scripts/template_compliance_contract_enforcement.md)

---

### 268 | Post-insert retry budget

#### Description
Verify deferred enrichment retries stop after the documented three-attempt budget and reset after a successful completion.

#### Scenario Contract
Prompt: `Validate the post-insert retry budget, including three allowed retries, fourth-attempt skip, exhaustion telemetry, and reset after success.`

First three retries allowed; fourth skipped; successful completion clears the budget

#### Test Execution
> **Feature File:** [268](lifecycle/post_insert_retry_budget.md)
> **Catalog:** [lifecycle/post_insert_retry_budget.md](../feature_catalog/lifecycle/post_insert_retry_budget.md)

### 269 | Scope normalizer canonicalization and lint

#### Description
Verify the canonical scope normalizer is the live helper and strict validation rejects new duplicate local helpers.

#### Scenario Contract
Prompt: `Validate scope normalizer canonicalization and lint and confirm canonical imports, parity semantics, and duplicate-helper rejection.`

Canonical imports visible at the documented call sites; parity matrix still passes; synthetic duplicate helper fails the lint rule

#### Test Execution
> **Feature File:** [269](bug_fixes_and_data_integrity/scope_normalizer_canonicalization_and_lint.md)
> **Catalog:** [bug_fixes_and_data_integrity/scope_normalizer_canonicalization_and_lint.md](../feature_catalog/bug_fixes_and_data_integrity/scope_normalizer_canonicalization_and_lint.md)

### 270 | maintainability extracts

#### Description
Verify the shared helper extracts replaced the old inline variants without changing the live pipeline contracts.

#### Scenario Contract
Prompt: `Validate Phase 017 maintainability extracts against the documented helper surfaces and return pass/fail with cited evidence.`

Helper-based code paths are active; tests for the extracted helpers pass; routing metadata uses advisoryPreset

#### Test Execution
> **Feature File:** [270](pipeline_architecture/phase_017_maintainability_extracts.md)
> **Catalog:** [pipeline_architecture/phase_017_maintainability_extracts.md](../feature_catalog/pipeline_architecture/phase_017_maintainability_extracts.md)

### 271 | Research metadata backfill

#### Description
Verify missing research iteration metadata is created without rewriting already-complete folders.

#### Scenario Contract
Prompt: `Validate Research metadata backfill against scripts/memory/backfill-research-metadata.ts and report cited pass/fail evidence.`

Missing metadata files created; complete folders unchanged; output identifies only the folders that needed repair

#### Test Execution
> **Feature File:** [271](tooling_and_scripts/research_metadata_backfill.md)
> **Catalog:** [tooling_and_scripts/research_metadata_backfill.md](../feature_catalog/tooling_and_scripts/research_metadata_backfill.md)

### 272 | Strict validation add-ons: continuity freshness and evidence markers

#### Description
Verify strict validation now enforces continuity freshness, malformed evidence markers, and duplicate-normalizer rejection.

#### Scenario Contract
Prompt: `Validate Strict validation add-ons: continuity freshness and evidence markers against validate.sh --strict and report cited pass/fail evidence.`

Strict validation surfaces the continuity, evidence-marker, and duplicate-normalizer failures; the audit script reports marker issues for repair use

#### Test Execution
> **Feature File:** [272](tooling_and_scripts/strict_validation_addons_continuity_freshness_and_evidence_markers.md)
> **Catalog:** [tooling_and_scripts/strict_validation_addons_continuity_freshness_and_evidence_markers.md](../feature_catalog/tooling_and_scripts/strict_validation_addons_continuity_freshness_and_evidence_markers.md)

### 273 | Session-resume caller binding and Unicode sanitization

#### Description
Verify strict session-resume caller binding plus the NFKC and zero-width sanitization guardrails.

#### Scenario Contract
Prompt: `Validate session-resume caller binding and Unicode sanitization against the documented strict, permissive, and confusable-input cases.`

Strict mismatch rejected; permissive mismatch allowed with warning; Unicode confusables normalized in both sanitizers

#### Test Execution
> **Feature File:** [273](governance/session_resume_caller_binding_and_unicode_sanitization.md)
> **Catalog:** [governance/session_resume_caller_binding_and_unicode_sanitization.md](../feature_catalog/governance/session_resume_caller_binding_and_unicode_sanitization.md)



### 276 | Reconsolidation conflict transaction helper

#### Description
Verify both reconsolidation conflict branches still share one atomic transaction envelope.

#### Scenario Contract
Prompt: `As a mutation validation operator, validate Reconsolidation conflict transaction helper against executeConflict(). Verify both conflict branches route through the shared transaction helper, stale-predecessor guards still apply, and failures roll back without leaving partial conflict writes behind. Return a concise pass/fail verdict with the main reason and cited evidence.`

Both conflict branches reuse one atomic transaction envelope and preserve rollback behavior on failure

#### Test Execution
> **Feature File:** [276](mutation/reconsolidation_conflict_transaction_helper.md)
> **Catalog:** [mutation/reconsolidation_conflict_transaction_helper.md](../feature_catalog/mutation/reconsolidation_conflict_transaction_helper.md)

---

## 9. PHASE SYSTEM FEATURES

### PHASE-001 | Phase detection scoring

#### Description
Run `recommend-level.sh --recommend-phases --json` on a high-complexity spec and verify scoring output.

#### Scenario Contract
Prompt: `Validate Phase detection scoring against bash .opencode/skills/system-spec-kit/scripts/spec/recommend-level.sh --recommend-phases --json specs/<target-spec> and report cited pass/fail evidence.`

JSON output contains `recommended_phases` (boolean), `phase_score` (number), `suggested_phase_count` (number), and 4 dimension scores: LOC Factor (35%), File Count (20%), Risk Factors (25%), Complexity (20%); simple specs score low

#### Test Execution
> **Feature File:** [PHASE-001](tooling_and_scripts/phase_detection_scoring.md)

### PHASE-002 | Phase folder creation

#### Description
Run `create.sh "Test" --phase --level 3 --phases 3` and verify parent+children structure.

#### Scenario Contract
Prompt: `Validate Phase folder creation against bash .opencode/skills/system-spec-kit/scripts/spec/create.sh "Phase Test" --phase --level 3 --phases 3 --phase-names "Design,Implement,Verify" and report cited pass/fail evidence.`

Parent folder with Phase Documentation Map in spec.md; 3 child folders with correct naming; back-references and predecessor/successor links in child spec.md files; Level 3 template files in all folders

#### Test Execution
> **Feature File:** [PHASE-002](tooling_and_scripts/phase_folder_creation.md)

### PHASE-003 | Recursive phase validation

#### Description
Run `validate.sh --recursive` on a phase parent folder and verify per-phase results.

#### Scenario Contract
Prompt: `Validate Recursive phase validation against create.sh "Validate Test" --phase --level 2 --phases 2 and report cited pass/fail evidence.`

Per-phase pass/fail in output; JSON `phases` array; combined exit code reflects worst child; error propagation works

#### Test Execution
> **Feature File:** [PHASE-003](tooling_and_scripts/recursive_phase_validation.md)

### PHASE-004 | Phase link validation

#### Description
Run `check-phase-links.sh` on a phase folder and verify 4 link checks at warn severity.

#### Scenario Contract
Prompt: `Validate Phase link validation against bash .opencode/skills/system-spec-kit/scripts/rules/check-phase-links.sh specs/<phase-parent> and report cited pass/fail evidence.`

4 link check types reported; well-formed folder produces exit 0; missing child produces warn on Phase Documentation Map; corrupted back-reference produces warn; all issues at warn severity

#### Test Execution
> **Feature File:** [PHASE-004](tooling_and_scripts/phase_link_validation.md)

### PHASE-005 | Phase command workflow

#### Description
Execute `/speckit:plan :with-phases` command in auto mode and verify phase decomposition pre-workflow.

#### Scenario Contract
Prompt: `Validate Phase command workflow against /speckit:plan :with-phases and report cited pass/fail evidence.`

All 7 steps execute in sequence; scoring output visible; folders created with correct structure; link validation passes; recursive validation passes; success summary with paths

#### Test Execution
> **Feature File:** [PHASE-005](tooling_and_scripts/phase_command_workflow.md)

### PHASE-006 | Spec-folder literal naming (create.sh fallback)

#### Description
Run `create.sh --phase --phase-count 3` without `--phase-names` and confirm the placeholder slug and stderr warning behavior shipped in Packet 012.

#### Scenario Contract
Prompt: `Validate create.sh literal-naming fallback by running create.sh "literal-naming smoke" --short-name "literal-naming-smoke" --level 2 --phase --phase-count 3 --path /tmp/speckit-naming-smoke-$$ 2>/tmp/speckit-stderr-$$.log without --phase-names. Report cited pass/fail evidence.`

3 child folders ending with `-PROVIDE-DESCRIPTIVE-SLUG`; 3 `[speckit] Warning:` lines on stderr; create.sh exit 0 (warn-only, not fail-hard)

#### Test Execution
> **Feature File:** [PHASE-006](tooling_and_scripts/spec_folder_literal_naming_create_sh_fallback.md)

### PHASE-008 | Spec-folder literal naming (CLI-driven slug proposal)

#### Description
Route an ambiguous spec task through multiple external CLI agents and confirm each agent proposes phase names with specific subject tokens per the `Generate LITERAL phase names` YAML activity added in Packet 012.

#### Scenario Contract
Prompt: `An operator gives a deliberately ambiguous task to an external CLI agent that should trigger /speckit:plan phase decomposition. Verify the AI proposes phase names with specific subject tokens, NOT generic placeholders.`

All 3 proposed slugs contain a specific subject token naming the concrete component or behavior; no slug matches the generic stoplist (phase-1, phase-2, phase-3, cleanup, remediation, fix, refactor, setup); aggregate PASS requires 2 or more CLIs to report PASS

#### Test Execution
> **Feature File:** [PHASE-008](tooling_and_scripts/spec_folder_literal_naming_cli_driven_slug.md)

### PHASE-009 | Spec-folder literal naming (remediation rule via SKILL.md rule 20)

#### Description
Route a synthetic deep-review FAIL verdict through multiple external CLI agents and confirm each agent proposes a remediation packet slug that references both the source (deep-review findings) and the specific target component, per SKILL.md ALWAYS rule 20 added in Packet 012.

#### Scenario Contract
Prompt: `An operator gives a CLI agent a deep-review FAIL verdict and asks for the remediation packet name. Verify the proposed slug references BOTH the source (deep-review findings) AND the target (the specific component being remediated), per system-spec-kit SKILL.md ALWAYS rule 20.`

`proposed_slug` contains both a source token (origin of findings) and a target token (component being fixed); slug does not match the bare stoplist (remediation, cleanup, fix, phase-N, round-N, review-remediation); `rule_20_self_audit` field cites both portions; aggregate PASS requires 2 or more CLIs to report PASS

#### Test Execution
> **Feature File:** [PHASE-009](tooling_and_scripts/spec_folder_literal_naming_remediation_rule.md)

### Catalog Coverage Notes for Phases 001-018

These 30 catalog entries are explicitly documented here even when validation is automated-only or routed through a shared operator scenario.

| Catalog Entry | Coverage Status | Coverage Path / Notes |
|---|---|---|
| `retrieval/ast_level_section_retrieval_tool.md` | Deferred | Not yet implemented |
| `retrieval/tool_result_extraction_to_working_memory.md` | Automated only | Covered by `working-memory.vitest.ts`, `working-memory-event-decay.vitest.ts`, and `checkpoint-working-memory.vitest.ts` |
| `mutation/07-namespace-management-crud-tools.md` | Deferred | Not yet implemented |
| `mutation/correction_tracking_with_undo.md` | Automated only | Covered by mutation regression tests; no dedicated operator scenario yet |
| `mutation/10-per-record-history-log.md` | Manual + automated | Covered by mutation/history suites and dedicated direct manual scenario M-008 |
| `graph-signal-activation/_deprecated/09-anchor-tags-as-graph-nodes.md` | Deprecated archival | Retained only as a historical deprecation record; anchor markers stay metadata-only |
| `scoring_and_calibration/tool_level_ttl_cache.md` | Automated only | Cache policy behavior is exercised in scoring/cache tests |
| `scoring_and_calibration/access_driven_popularity_scoring.md` | Automated only | Popularity heuristics are validated by ranking tests |
| `scoring_and_calibration/temporal_structural_coherence_scoring.md` | Automated only | Temporal/structural scoring logic is covered by scoring suites |
| `memory_quality_and_indexing/content_aware_memory_filename_generation.md` | Indirect scenario coverage | Covered implicitly via 045 (smarter content generation) |
| `memory_quality_and_indexing/outsourced_agent_memory_capture.md` | Manual + automated | Dedicated memory workflow coverage exists in M-005 |
| `pipeline_architecture/dynamic_server_instructions_at_mcp_initialization.md` | Automated only | Startup concern; validated implicitly by startup/runtime coverage |
| `pipeline-architecture/_deprecated/15-warm-server-daemon-mode.md` | Deprecated archival | Retained only as a historical deprecation record; live transport remains stdio |
| `pipeline_architecture/backend_storage_adapter_abstraction.md` | Automated only | Covered by `interfaces.vitest.ts`, `pipeline-architecture-remediation.vitest.ts`, and `vector-index-impl.vitest.ts`; no operator-facing manual step is required today |
| `pipeline_architecture/atomic_write_then_index_api.md` | Indirect scenario coverage | Covered by 104 and atomic-save failure-injection tests |
| `pipeline_architecture/embedding_retry_orchestrator.md` | Automated only | Covered by `retry-manager.vitest.ts` and `index-refresh.vitest.ts` |
| `pipeline_architecture/7_layer_tool_architecture_metadata.md` | Automated only | Dispatch behavior is covered by context-server and dispatch-matrix tests |
| `retrieval_enhancements/contextual_tree_injection.md` | Manual + automated | Covered directly by 145 and `hybrid-search-context-headers.vitest.ts` |
| `tooling_and_scripts/architecture_boundary_enforcement.md` | Build-time only | Enforced by build/test tooling rather than runtime playbook steps |
| `tooling_and_scripts/watcher_delete_rename_cleanup.md` | Automated only | Covered by `mcp_server/tests/file-watcher.vitest.ts`; no dedicated manual operator scenario yet |
| Shared post-mutation hook wiring | Indirect scenario coverage | Covered by 085, 103, and 104 |
| `ux_hooks/memory_health_autorepair_metadata.md` | Automated only | Covered by `handler-memory-health-edge.vitest.ts` and `memory-crud-extended.vitest.ts` (autoRepair, confirmation-only, partialSuccess). EX-013 covers basic health diagnostics only |
| `ux_hooks/schema_and_type_contract_synchronization.md` | Indirect scenario coverage | Covered by 107 (confirmName enforcement) and hook-contract tests. 095 covers strict-param rejection only |
| `ux_hooks/mutation_hook_result_contract_expansion.md` | Indirect scenario coverage | Covered by 103 |
| `ux_hooks/mutation_response_ux_payload_exposure.md` | Indirect scenario coverage | Covered by 104 |
| `ux_hooks/atomic_save_parity_and_partial_indexing_hints.md` | Indirect scenario coverage | Covered by 104 |
| `ux_hooks/final_token_metadata_recomputation.md` | Indirect scenario coverage | Covered by 105 |
| `ux_hooks/end_to_end_success_envelope_verification.md` | Indirect scenario coverage | Covered by 105 |
| `tooling_and_scripts/session_capturing_pipeline_quality.md` | Manual + automated | Absorbs phases 002 (contamination-detection), 004 (type-consolidation), 005 (confidence-calibration), 007 (phase-classification), 008 (signal-extraction), and 014 (spec-descriptions). Covered by M-007 compound scenario, build/typecheck, and automated extractor/loader suites |

---

## 10. DEDICATED MEMORY/SPEC-KIT SCENARIOS (REQUIRED)

### M-001 | Context Recovery and Continuation

#### Description
Canonical resume workflow through `/speckit:resume` and the packet recovery ladder.

#### Scenario Contract
Prompt: `Validate context recovery with /speckit:resume specs/<target-spec> and confirm the resume ladder returns actionable next steps.`

Expected signals: Resume-ready state summary and next steps via `/speckit:resume` and the canonical packet ladder.

#### Test Execution
> **Feature File:** [M-001](retrieval/context_recovery_and_continuation.md)

### M-002 | Targeted Memory Lookup

#### Description
Precise fact-level retrieval through targeted anchored lookup.

#### Scenario Contract
Prompt: `Validate targeted memory_search lookup for decision rationale and confirm precise fact-level retrieval from the target spec.`

Expected signals: precise fact-level retrieval.

#### Test Execution
> **Feature File:** [M-002](retrieval/targeted_memory_lookup.md)

### M-003 | Context Save + Index Update

#### Description
Context save plus immediate index visibility.

#### Scenario Contract
Prompt: `Validate Context Save + Index Update against generate-context.js and memory_index_scan.`

Expected signals: saved context artifacts are discoverable.

#### Test Execution
> **Feature File:** [M-003](memory_quality_and_indexing/context_save_index_update.md)

### M-004 | Main-Agent Review and Verdict Handoff

#### Description
Severity-ranked findings and deterministic verdict handoff.

#### Scenario Contract
Prompt: `As a tooling validation operator, validate Main-Agent Review and Verdict Handoff against @review. Verify severity-ranked findings and final verdict. Return a concise pass/fail verdict with the main reason and cited evidence.`

Expected signals: severity-ranked findings and final verdict.

#### Test Execution
> **Feature File:** [M-004](tooling_and_scripts/main_agent_review_and_verdict_handoff.md)

### M-005 | Outsourced Agent Memory Capture Round-Trip

#### Description
Outsourced agent output round-trips into searchable saved context.

#### Scenario Contract
Prompt: `Validate outsourced agent memory capture round-trip against cli-opencode.`

Expected signals: Agent output contains structured memory section; saved context is discoverable via search.

#### Test Execution
> **Feature File:** [M-005](memory_quality_and_indexing/outsourced_agent_memory_capture_round_trip.md)

### M-006 | Stateless Enrichment and Alignment Guardrails

#### Description
Continuity-ladder precedence and alignment guardrails for captured-session saves.

#### Scenario Contract
Prompt: `Validate session enrichment and alignment guardrails against memory_search.`

Expected signals: the save resolves through `handover.md` first, then `_memory.continuity`, then spec docs; spec-folder and git enrichment remain supporting-only; and it does not raise `ALIGNMENT_BLOCK` when captured files match the spec's files-to-change table.

#### Test Execution
> **Feature File:** [M-006](memory_quality_and_indexing/session_enrichment_and_alignment_guardrails.md)

### M-007 | Session Capturing Pipeline Quality

#### Description
Session-capturing hardening, structured-input authority, and save-quality closure.

#### Scenario Contract
Prompt: `Validate Session Capturing Pipeline Quality against grep -n 'crypto.randomBytes' .opencode/skills/system-spec-kit/scripts/extractors/session-extractor.ts and report cited pass/fail evidence.`

Minimum scenario family now required for M-007:
- structured `--stdin` save with explicit CLI target precedence
- structured `--json` save with payload-target fallback when no explicit CLI override exists
- same-minute repeated saves that prove unique filenames and stable `description.json` tracking
- direct positional save without `--json`/`--stdin` that rejects with migration guidance to structured JSON

Proof rule:
- Treat automated M-007 parity as the runtime contract baseline.
- Only claim “flawless across every CLI” when the current verification run captures fresh live artifacts for each supported CLI and each supported save mode covered by the current contract.

#### Test Execution
> **Feature File:** [M-007](tooling_and_scripts/session_capturing_pipeline_quality.md)

### M-008 | Feature 09 Direct Manual Scenario (Per-memory History Log)

#### Description
Repeated save/update activity remains visible through direct operator runs.

#### Scenario Contract
Prompt: `As a mutation validation operator, validate Feature 09 Direct Manual Scenario (Per-memory History Log) against memory_save({ filePath:"<sandbox-spec-doc>", force:true }). Verify repeated save/update activity is observable via retrieval output and packet metadata remains coherent for the same saved document lineage. Return a concise pass/fail verdict with the main reason and cited evidence.`

Expected signals: repeated save/update activity is observable via retrieval output and packet metadata remains coherent for the same saved document lineage.

#### Test Execution
> **Feature File:** [M-008](mutation/feature_09_direct_manual_scenario_per_memory_history_log.md)

---

## 11. AUTOMATED TEST CROSS-REFERENCE

This split playbook keeps automated coverage references in three places:
- Per-feature catalog links in the root directory and snippet references.
- The catalog coverage notes section for automated-only, indirect, or deferred coverage.
- Dedicated memory/spec-kit snippets where shared manual scenarios absorb multiple catalog entries.

---

## 12. FEATURE CATALOG CROSS-REFERENCE INDEX

| Playbook ID | Category | Feature Name | Snippet | Catalog Entry |
|---|---|---|---|---|
| EX-001 | Existing Features | Unified context retrieval (memory_context) | [EX-001](retrieval/unified_context_retrieval_memory_context.md) | [retrieval/unified_context_retrieval_memorycontext.md](../feature_catalog/retrieval/unified_context_retrieval_memorycontext.md) |
| EX-002 | Existing Features | Semantic and lexical search (memory_search) | [EX-002](retrieval/semantic_and_lexical_search_memory_search.md) | [retrieval/semantic_and_lexical_search_memorysearch.md](../feature_catalog/retrieval/semantic_and_lexical_search_memorysearch.md) |
| EX-003 | Existing Features | Trigger phrase matching (memory_match_triggers) | [EX-003](retrieval/trigger_phrase_matching_memory_match_triggers.md) | [retrieval/trigger_phrase_matching_memorymatchtriggers.md](../feature_catalog/retrieval/trigger_phrase_matching_memorymatchtriggers.md) |
| EX-004 | Existing Features | Hybrid search pipeline | [EX-004](retrieval/hybrid_search_pipeline.md) | [retrieval/hybrid_search_pipeline.md](../feature_catalog/retrieval/hybrid_search_pipeline.md) |
| EX-005 | Existing Features | 4-stage pipeline architecture | [EX-005](retrieval/4_stage_pipeline_architecture.md) | [retrieval/4_stage_pipeline_architecture.md](../feature_catalog/retrieval/4_stage_pipeline_architecture.md) |
| EX-006 | Existing Features | Memory indexing (memory_save) | [EX-006](mutation/memory_indexing_memory_save.md) | [mutation/memory_indexing_memorysave.md](../feature_catalog/mutation/memory_indexing_memorysave.md) |
| EX-007 | Existing Features | Memory metadata update (memory_update) | [EX-007](mutation/memory_metadata_update_memory_update.md) | [mutation/memory_metadata_update_memoryupdate.md](../feature_catalog/mutation/memory_metadata_update_memoryupdate.md) |
| EX-008 | Existing Features | Single and folder delete (memory_delete) | [EX-008](mutation/single_and_folder_delete_memory_delete.md) | [mutation/single_and_folder_delete_memorydelete.md](../feature_catalog/mutation/single_and_folder_delete_memorydelete.md) |
| EX-009 | Existing Features | Tier-based bulk deletion (memory_bulk_delete) | [EX-009](mutation/tier_based_bulk_deletion_memory_bulk_delete.md) | [mutation/tier_based_bulk_deletion_memorybulkdelete.md](../feature_catalog/mutation/tier_based_bulk_deletion_memorybulkdelete.md) |
| EX-010 | Existing Features | Validation feedback (memory_validate) | [EX-010](mutation/validation_feedback_memory_validate.md) | [mutation/validation_feedback_memoryvalidate.md](../feature_catalog/mutation/validation_feedback_memoryvalidate.md) |
| EX-011 | Existing Features | Memory browser (memory_list) | [EX-011](discovery/memory_browser_memory_list.md) | [discovery/memory_browser_memorylist.md](../feature_catalog/discovery/memory_browser_memorylist.md) |
| EX-012 | Existing Features | System statistics (memory_stats) | [EX-012](discovery/system_statistics_memory_stats.md) | [discovery/system_statistics_memorystats.md](../feature_catalog/discovery/system_statistics_memorystats.md) |
| EX-013 | Existing Features | Health diagnostics (memory_health) | [EX-013](discovery/health_diagnostics_memory_health.md) | [discovery/health_diagnostics_memoryhealth.md](../feature_catalog/discovery/health_diagnostics_memoryhealth.md) |
| EX-014 | Existing Features | Workspace scanning and indexing (memory_index_scan) | [EX-014](maintenance/workspace_scanning_and_indexing_memory_index_scan.md) | [maintenance/workspace_scanning_and_indexing_memoryindexscan.md](../feature_catalog/maintenance/workspace_scanning_and_indexing_memoryindexscan.md) |
| EX-015 | Existing Features | Checkpoint creation (checkpoint_create) | [EX-015](lifecycle/checkpoint_creation_checkpoint_create.md) | [lifecycle/checkpoint_creation_checkpointcreate.md](../feature_catalog/lifecycle/checkpoint_creation_checkpointcreate.md) |
| EX-016 | Existing Features | Checkpoint listing (checkpoint_list) | [EX-016](lifecycle/checkpoint_listing_checkpoint_list.md) | [lifecycle/checkpoint_listing_checkpointlist.md](../feature_catalog/lifecycle/checkpoint_listing_checkpointlist.md) |
| EX-017 | Existing Features | Checkpoint restore (checkpoint_restore) | [EX-017](lifecycle/checkpoint_restore_checkpoint_restore.md) | [lifecycle/checkpoint_restore_checkpointrestore.md](../feature_catalog/lifecycle/checkpoint_restore_checkpointrestore.md) |
| EX-018 | Existing Features | Checkpoint deletion (checkpoint_delete) | [EX-018](lifecycle/checkpoint_deletion_checkpoint_delete.md) | [lifecycle/checkpoint_deletion_checkpointdelete.md](../feature_catalog/lifecycle/checkpoint_deletion_checkpointdelete.md) |
| EX-019 | Existing Features | Causal edge creation (memory_causal_link) | [EX-019](analysis/causal_edge_creation_memory_causal_link.md) | [analysis/causal_edge_creation_memorycausallink.md](../feature_catalog/analysis/causal_edge_creation_memorycausallink.md) |
| EX-020 | Existing Features | Causal graph statistics (memory_causal_stats) | [EX-020](analysis/causal_graph_statistics_memory_causal_stats.md) | [analysis/causal_graph_statistics_memorycausalstats.md](../feature_catalog/analysis/causal_graph_statistics_memorycausalstats.md) |
| EX-021 | Existing Features | Causal edge deletion (memory_causal_unlink) | [EX-021](analysis/causal_edge_deletion_memory_causal_unlink.md) | [analysis/causal_edge_deletion_memorycausalunlink.md](../feature_catalog/analysis/causal_edge_deletion_memorycausalunlink.md) |
| EX-022 | Existing Features | Causal chain tracing (memory_drift_why) | [EX-022](analysis/causal_chain_tracing_memory_drift_why.md) | [analysis/causal_chain_tracing_memorydriftwhy.md](../feature_catalog/analysis/causal_chain_tracing_memorydriftwhy.md) |
| EX-023 | Existing Features | Epistemic baseline capture (task_preflight) | [EX-023](analysis/epistemic_baseline_capture_task_preflight.md) | [analysis/epistemic_baseline_capture_taskpreflight.md](../feature_catalog/analysis/epistemic_baseline_capture_taskpreflight.md) |
| EX-024 | Existing Features | Post-task learning measurement (task_postflight) | [EX-024](analysis/post_task_learning_measurement_task_postflight.md) | [analysis/post_task_learning_measurement_taskpostflight.md](../feature_catalog/analysis/post_task_learning_measurement_taskpostflight.md) |
| EX-025 | Existing Features | Learning history (memory_get_learning_history) | [EX-025](analysis/learning_history_memory_get_learning_history.md) | [analysis/learning_history_memorygetlearninghistory.md](../feature_catalog/analysis/learning_history_memorygetlearninghistory.md) |
| EX-026 | Existing Features | Ablation studies (eval_run_ablation) | [EX-026](evaluation/ablation_studies_eval_run_ablation.md) | [evaluation/ablation_studies_evalrunablation.md](../feature_catalog/evaluation/ablation_studies_evalrunablation.md) |
| EX-027 | Existing Features | Reporting dashboard (eval_reporting_dashboard) | [EX-027](evaluation/reporting_dashboard_eval_reporting_dashboard.md) | [evaluation/reporting_dashboard_evalreportingdashboard.md](../feature_catalog/evaluation/reporting_dashboard_evalreportingdashboard.md) |
| EX-028 | Existing Features | 1. Search Pipeline Features (SPECKIT_*) | [EX-028](feature_flag_reference/1_search_pipeline_features_speckit.md) | [feature_flag_reference/1_search_pipeline_features_speckit.md](../feature_catalog/feature_flag_reference/1_search_pipeline_features_speckit.md) |
| EX-029 | Existing Features | 2. Session and Cache | [EX-029](feature_flag_reference/2_session_and_cache.md) | [feature_flag_reference/2_session_and_cache.md](../feature_catalog/feature_flag_reference/2_session_and_cache.md) |
| EX-030 | Existing Features | 3. MCP Configuration | [EX-030](feature_flag_reference/3_mcp_configuration.md) | [feature_flag_reference/3_mcp_configuration.md](../feature_catalog/feature_flag_reference/3_mcp_configuration.md) |
| EX-031 | Existing Features | 4. Memory and Storage | [EX-031](feature_flag_reference/4_memory_and_storage.md) | [feature_flag_reference/4_memory_and_storage.md](../feature_catalog/feature_flag_reference/4_memory_and_storage.md) |
| EX-032 | Existing Features | 5. Embedding and API | [EX-032](feature_flag_reference/5_embedding_and_api.md) | [feature_flag_reference/5_embedding_and_api.md](../feature_catalog/feature_flag_reference/5_embedding_and_api.md) |
| EX-033 | Existing Features | 6. Debug and Telemetry | [EX-033](feature_flag_reference/6_debug_and_telemetry.md) | [feature_flag_reference/6_debug_and_telemetry.md](../feature_catalog/feature_flag_reference/6_debug_and_telemetry.md) |
| EX-034 | Existing Features | 7. CI and Build (informational) | [EX-034](feature_flag_reference/7_ci_and_build_informational.md) | [feature_flag_reference/7_ci_and_build_informational.md](../feature_catalog/feature_flag_reference/7_ci_and_build_informational.md) |
| EX-035 | Existing Features | Startup runtime compatibility guards | [EX-035](maintenance/startup_runtime_compatibility_guards.md) | [maintenance/startup_runtime_compatibility_guards.md](../feature_catalog/maintenance/startup_runtime_compatibility_guards.md) |
| 001 | Features | Graph channel ID fix (G1) | [001](bug_fixes_and_data_integrity/graph_channel_id_fix_g1.md) | [bug_fixes_and_data_integrity/graph_channel_id_fix.md](../feature_catalog/bug_fixes_and_data_integrity/graph_channel_id_fix.md) |
| 002 | Features | Chunk collapse deduplication (G3) | [002](bug_fixes_and_data_integrity/chunk_collapse_deduplication_g3.md) | [bug_fixes_and_data_integrity/chunk_collapse_deduplication.md](../feature_catalog/bug_fixes_and_data_integrity/chunk_collapse_deduplication.md) |
| 003 | Features | Co-activation fan-effect divisor (R17) | [003](bug_fixes_and_data_integrity/co_activation_fan_effect_divisor_r17.md) | [bug_fixes_and_data_integrity/co_activation_fan_effect_divisor.md](../feature_catalog/bug_fixes_and_data_integrity/co_activation_fan_effect_divisor.md) |
| 004 | Features | SHA-256 content-hash deduplication (TM-02) | [004](bug_fixes_and_data_integrity/sha_256_content_hash_deduplication_tm_02.md) | [bug_fixes_and_data_integrity/sha_256_content_hash_deduplication.md](../feature_catalog/bug_fixes_and_data_integrity/sha_256_content_hash_deduplication.md) |
| 005 | Features | Evaluation database and schema (R13-S1) | [005](evaluation_and_measurement/evaluation_database_and_schema_r13_s1.md) | [evaluation_and_measurement/evaluation_database_and_schema.md](../feature_catalog/evaluation_and_measurement/evaluation_database_and_schema.md) |
| 006 | Features | Core metric computation (R13-S1) | [006](evaluation_and_measurement/core_metric_computation_r13_s1.md) | [evaluation_and_measurement/core_metric_computation.md](../feature_catalog/evaluation_and_measurement/core_metric_computation.md) |
| 007 | Features | Observer effect mitigation (D4) | [007](evaluation_and_measurement/observer_effect_mitigation_d4.md) | [evaluation_and_measurement/observer_effect_mitigation.md](../feature_catalog/evaluation_and_measurement/observer_effect_mitigation.md) |
| 009 | Features | Quality proxy formula (B7) | [009](evaluation_and_measurement/quality_proxy_formula_b7.md) | [evaluation_and_measurement/quality_proxy_formula.md](../feature_catalog/evaluation_and_measurement/quality_proxy_formula.md) |
| 010 | Features | Synthetic ground truth corpus (G-NEW-1, G-NEW-3 phase A) | [010](evaluation_and_measurement/synthetic_ground_truth_corpus_g_new_1_g_new_3_phase_a.md) | [evaluation_and_measurement/synthetic_ground_truth_corpus.md](../feature_catalog/evaluation_and_measurement/synthetic_ground_truth_corpus.md) |
| 011 | Features | BM25-only baseline (G-NEW-1) | [011](evaluation_and_measurement/bm25_only_baseline_g_new_1.md) | [evaluation_and_measurement/bm25_only_baseline.md](../feature_catalog/evaluation_and_measurement/bm25_only_baseline.md) |
| 012 | Features | Agent consumption instrumentation (G-NEW-2) | [012](evaluation_and_measurement/agent_consumption_instrumentation_g_new_2.md) | [evaluation_and_measurement/agent_consumption_instrumentation.md](../feature_catalog/evaluation_and_measurement/agent_consumption_instrumentation.md) |
| 013 | Features | Scoring observability (T010) | [013](evaluation_and_measurement/scoring_observability_t010.md) | [evaluation_and_measurement/scoring_observability.md](../feature_catalog/evaluation_and_measurement/scoring_observability.md) |
| 014 | Features | Full reporting and ablation study framework (R13-S3) | [014](evaluation_and_measurement/full_reporting_and_ablation_study_framework_r13_s3.md) | [evaluation_and_measurement/full_reporting_and_ablation_study_framework.md](../feature_catalog/evaluation_and_measurement/full_reporting_and_ablation_study_framework.md) |
| 016 | Features | Typed-weighted degree channel (R4) | [016](graph_signal_activation/typed_weighted_degree_channel_r4.md) | [graph_signal_activation/typed_weighted_degree_channel.md](../feature_catalog/graph_signal_activation/typed_weighted_degree_channel.md) |
| 017 | Features | Co-activation boost strength increase (A7) | [017](graph_signal_activation/co_activation_boost_strength_increase_a7.md) | [graph_signal_activation/co_activation_boost_strength_increase.md](../feature_catalog/graph_signal_activation/co_activation_boost_strength_increase.md) |
| 018 | Features | Edge density measurement | [018](graph_signal_activation/edge_density_measurement.md) | [graph_signal_activation/edge_density_measurement.md](../feature_catalog/graph_signal_activation/edge_density_measurement.md) |
| 019 | Features | Weight history audit tracking | [019](graph_signal_activation/weight_history_audit_tracking.md) | [graph_signal_activation/weight_history_audit_tracking.md](../feature_catalog/graph_signal_activation/weight_history_audit_tracking.md) |
| 020 | Features | Graph momentum scoring (N2a) | [020](graph_signal_activation/graph_momentum_scoring_n2a.md) | [graph_signal_activation/graph_momentum_scoring.md](../feature_catalog/graph_signal_activation/graph_momentum_scoring.md) |
| 021 | Features | Causal depth signal (N2b) | [021](graph_signal_activation/causal_depth_signal_n2b.md) | [graph_signal_activation/causal_depth_signal.md](../feature_catalog/graph_signal_activation/causal_depth_signal.md) |
| 022 | Features | Community detection (N2c) | [022](graph_signal_activation/community_detection_n2c.md) | [graph_signal_activation/community_detection.md](../feature_catalog/graph_signal_activation/community_detection.md) |
| 023 | Features | Score normalization | [023](scoring_and_calibration/score_normalization.md) | [scoring_and_calibration/score_normalization.md](../feature_catalog/scoring_and_calibration/score_normalization.md) |
| 025 | Features | Interference scoring (TM-01) | [025](scoring_and_calibration/interference_scoring_tm_01.md) | [scoring_and_calibration/interference_scoring.md](../feature_catalog/scoring_and_calibration/interference_scoring.md) |
| 026 | Features | Classification-based decay (TM-03) | [026](scoring_and_calibration/classification_based_decay_tm_03.md) | [scoring_and_calibration/classification_based_decay.md](../feature_catalog/scoring_and_calibration/classification_based_decay.md) |
| 027 | Features | Folder-level relevance scoring (PI-A1) | [027](scoring_and_calibration/folder_level_relevance_scoring_pi_a1.md) | [scoring_and_calibration/folder_level_relevance_scoring.md](../feature_catalog/scoring_and_calibration/folder_level_relevance_scoring.md) |
| 028 | Features | Embedding cache (R18) | [028](scoring_and_calibration/embedding_cache_r18.md) | [scoring_and_calibration/embedding_cache.md](../feature_catalog/scoring_and_calibration/embedding_cache.md) |
| 029 | Features | Double intent weighting investigation (G2) | [029](scoring_and_calibration/double_intent_weighting_investigation_g2.md) | [scoring_and_calibration/double_intent_weighting_investigation.md](../feature_catalog/scoring_and_calibration/double_intent_weighting_investigation.md) |
| 030 | Features | RRF K-value sensitivity analysis (FUT-5) | [030](scoring_and_calibration/rrf_k_value_sensitivity_analysis_fut_5.md) | [scoring_and_calibration/rrf_k_value_sensitivity_analysis.md](../feature_catalog/scoring_and_calibration/rrf_k_value_sensitivity_analysis.md) |
| 031 | Features | Negative feedback confidence signal (A4) | [031](scoring_and_calibration/negative_feedback_confidence_signal_a4.md) | [scoring_and_calibration/negative_feedback_confidence_signal.md](../feature_catalog/scoring_and_calibration/negative_feedback_confidence_signal.md) |
| 032 | Features | Auto-promotion on validation (T002a) | [032](scoring_and_calibration/auto_promotion_on_validation_t002a.md) | [scoring_and_calibration/auto_promotion_on_validation.md](../feature_catalog/scoring_and_calibration/auto_promotion_on_validation.md) |
| 033 | Features | Query complexity router (R15) | [033](query_intelligence/query_complexity_router_r15.md) | [query_intelligence/query_complexity_router.md](../feature_catalog/query_intelligence/query_complexity_router.md) |
| 035 | Features | Channel min-representation (R2) | [035](query_intelligence/channel_min_representation_r2.md) | [query_intelligence/channel_min_representation.md](../feature_catalog/query_intelligence/channel_min_representation.md) |
| 036 | Features | Confidence-based result truncation (R15-ext) | [036](query_intelligence/confidence_based_result_truncation_r15_ext.md) | [query_intelligence/confidence_based_result_truncation.md](../feature_catalog/query_intelligence/confidence_based_result_truncation.md) |
| 037 | Features | Dynamic token budget allocation (FUT-7) | [037](query_intelligence/dynamic_token_budget_allocation_fut_7.md) | [query_intelligence/dynamic_token_budget_allocation.md](../feature_catalog/query_intelligence/dynamic_token_budget_allocation.md) |
| 038 | Features | Query expansion (R12) | [038](query_intelligence/query_expansion_r12.md) | [query_intelligence/query_expansion.md](../feature_catalog/query_intelligence/query_expansion.md) |
| 039 | Features | Verify-fix-verify memory quality loop (PI-A5) | [039](memory_quality_and_indexing/verify_fix_verify_memory_quality_loop_pi_a5.md) | [memory_quality_and_indexing/verify_fix_verify_memory_quality_loop.md](../feature_catalog/memory_quality_and_indexing/verify_fix_verify_memory_quality_loop.md) |
| 040 | Features | Signal vocabulary expansion (TM-08) | [040](memory_quality_and_indexing/signal_vocabulary_expansion_tm_08.md) | [memory_quality_and_indexing/signal_vocabulary_expansion.md](../feature_catalog/memory_quality_and_indexing/signal_vocabulary_expansion.md) |
| 041 | Features | Pre-flight token budget validation (PI-A3) | [041](memory_quality_and_indexing/pre_flight_token_budget_validation_pi_a3.md) | [memory_quality_and_indexing/pre_flight_token_budget_validation.md](../feature_catalog/memory_quality_and_indexing/pre_flight_token_budget_validation.md) |
| 042 | Features | Spec folder description discovery (PI-B3) | [042](memory_quality_and_indexing/spec_folder_description_discovery_pi_b3.md) | [memory_quality_and_indexing/spec_folder_description_discovery.md](../feature_catalog/memory_quality_and_indexing/spec_folder_description_discovery.md) |
| 043 | Features | Pre-storage quality gate (TM-04) | [043](memory_quality_and_indexing/pre_storage_quality_gate_tm_04.md) | [memory_quality_and_indexing/pre_storage_quality_gate.md](../feature_catalog/memory_quality_and_indexing/pre_storage_quality_gate.md) |
| 044 | Features | Reconsolidation-on-save (TM-06) | [044](memory_quality_and_indexing/reconsolidation_on_save_tm_06.md) | [memory_quality_and_indexing/reconsolidation_on_save.md](../feature_catalog/memory_quality_and_indexing/reconsolidation_on_save.md) |
| 045 | Features | Smarter memory content generation (S1) | [045](memory_quality_and_indexing/smarter_memory_content_generation_s1.md) | [memory_quality_and_indexing/smarter_memory_content_generation.md](../feature_catalog/memory_quality_and_indexing/smarter_memory_content_generation.md) |
| 046 | Features | Anchor-aware chunk thinning (R7) | [046](memory_quality_and_indexing/anchor_aware_chunk_thinning_r7.md) | [memory_quality_and_indexing/anchor_aware_chunk_thinning.md](../feature_catalog/memory_quality_and_indexing/anchor_aware_chunk_thinning.md) |
| 047 | Features | Encoding-intent capture at index time (R16) | [047](memory_quality_and_indexing/encoding_intent_capture_at_index_time_r16.md) | [memory_quality_and_indexing/encoding_intent_capture_at_index_time.md](../feature_catalog/memory_quality_and_indexing/encoding_intent_capture_at_index_time.md) |
| 048 | Features | Auto entity extraction (R10) | [048](memory_quality_and_indexing/auto_entity_extraction_r10.md) | [memory_quality_and_indexing/auto_entity_extraction.md](../feature_catalog/memory_quality_and_indexing/auto_entity_extraction.md) |
| 049 | Features | 4-stage pipeline refactor (R6) | [049](pipeline_architecture/4_stage_pipeline_refactor_r6.md) | [pipeline_architecture/4_stage_pipeline_refactor.md](../feature_catalog/pipeline_architecture/4_stage_pipeline_refactor.md) |
| 050 | Features | MPAB chunk-to-memory aggregation (R1) | [050](pipeline_architecture/mpab_chunk_to_memory_aggregation_r1.md) | [pipeline_architecture/mpab_chunk_to_memory_aggregation.md](../feature_catalog/pipeline_architecture/mpab_chunk_to_memory_aggregation.md) |
| 051 | Features | Chunk ordering preservation (B2) | [051](pipeline_architecture/chunk_ordering_preservation_b2.md) | [pipeline_architecture/chunk_ordering_preservation.md](../feature_catalog/pipeline_architecture/chunk_ordering_preservation.md) |
| 052 | Features | Template anchor optimization (S2) | [052](pipeline_architecture/template_anchor_optimization_s2.md) | [pipeline_architecture/template_anchor_optimization.md](../feature_catalog/pipeline_architecture/template_anchor_optimization.md) |
| 053 | Features | Validation signals as retrieval metadata (S3) | [053](pipeline_architecture/validation_signals_as_retrieval_metadata_s3.md) | [pipeline_architecture/validation_signals_as_retrieval_metadata.md](../feature_catalog/pipeline_architecture/validation_signals_as_retrieval_metadata.md) |
| 054 | Features | Learned relevance feedback (R11) | [054](pipeline_architecture/learned_relevance_feedback_r11.md) | [pipeline_architecture/learned_relevance_feedback.md](../feature_catalog/pipeline_architecture/learned_relevance_feedback.md) |
| 055 | Features | Dual-scope memory auto-surface (TM-05) | [055](retrieval_enhancements/dual_scope_memory_auto_surface_tm_05.md) | [retrieval_enhancements/dual_scope_memory_auto_surface.md](../feature_catalog/retrieval_enhancements/dual_scope_memory_auto_surface.md) |
| 056 | Features | Constitutional memory as expert knowledge injection (PI-A4) | [056](retrieval_enhancements/constitutional_memory_as_expert_knowledge_injection_pi_a4.md) | [retrieval_enhancements/constitutional_memory_as_expert_knowledge_injection.md](../feature_catalog/retrieval_enhancements/constitutional_memory_as_expert_knowledge_injection.md) |
| 057 | Features | Spec folder hierarchy as retrieval structure (S4) | [057](retrieval_enhancements/spec_folder_hierarchy_as_retrieval_structure_s4.md) | [retrieval_enhancements/spec_folder_hierarchy_as_retrieval_structure.md](../feature_catalog/retrieval_enhancements/spec_folder_hierarchy_as_retrieval_structure.md) |
| 058 | Features | Lightweight consolidation (N3-lite) | [058](retrieval_enhancements/lightweight_consolidation_n3_lite.md) | [retrieval_enhancements/lightweight_consolidation.md](../feature_catalog/retrieval_enhancements/lightweight_consolidation.md) |
| 059 | Features | Memory summary search channel (R8) | [059](retrieval_enhancements/memory_summary_search_channel_r8.md) | [retrieval_enhancements/memory_summary_search_channel.md](../feature_catalog/retrieval_enhancements/memory_summary_search_channel.md) |
| 060 | Features | Cross-document entity linking (S5) | [060](retrieval_enhancements/cross_document_entity_linking_s5.md) | [retrieval_enhancements/cross_document_entity_linking.md](../feature_catalog/retrieval_enhancements/cross_document_entity_linking.md) |
| 061 | Features | Tree thinning for spec folder consolidation (PI-B1) | [061](tooling_and_scripts/tree_thinning_for_spec_folder_consolidation_pi_b1.md) | [tooling_and_scripts/tree_thinning_for_spec_folder_consolidation.md](../feature_catalog/tooling_and_scripts/tree_thinning_for_spec_folder_consolidation.md) |
| 062 | Features | Progressive validation for spec documents (PI-B2) | [062](tooling_and_scripts/progressive_validation_for_spec_documents_pi_b2.md) | [tooling_and_scripts/progressive_validation_for_spec_documents.md](../feature_catalog/tooling_and_scripts/progressive_validation_for_spec_documents.md) |
| 063 | Features | Feature flag governance | [063](governance/feature_flag_governance.md) | [governance/feature_flag_governance.md](../feature_catalog/governance/feature_flag_governance.md) |
| 064 | Features | Feature flag sunset audit | retired manual record | retired feature-flag sunset audit record |
| 065 | Features | Database and schema safety | [065](bug_fixes_and_data_integrity/database_and_schema_safety.md) | [bug_fixes_and_data_integrity/database_and_schema_safety.md](../feature_catalog/bug_fixes_and_data_integrity/database_and_schema_safety.md) |
| 066 | Features | Scoring and ranking corrections | [066](scoring_and_calibration/scoring_and_ranking_corrections.md) | [scoring_and_calibration/scoring_and_ranking_corrections.md](../feature_catalog/scoring_and_calibration/scoring_and_ranking_corrections.md) |
| 067 | Features | Search pipeline safety | [067](pipeline_architecture/search_pipeline_safety.md) | [pipeline_architecture/search_pipeline_safety.md](../feature_catalog/pipeline_architecture/search_pipeline_safety.md) |
| 068 | Features | Guards and edge cases | [068](bug_fixes_and_data_integrity/guards_and_edge_cases.md) | [bug_fixes_and_data_integrity/guards_and_edge_cases.md](../feature_catalog/bug_fixes_and_data_integrity/guards_and_edge_cases.md) |
| 069 | Features | Entity normalization consolidation | [069](memory_quality_and_indexing/entity_normalization_consolidation.md) | [memory_quality_and_indexing/entity_normalization_consolidation.md](../feature_catalog/memory_quality_and_indexing/entity_normalization_consolidation.md) |
| 070 | Features | Dead code removal | [070](tooling_and_scripts/dead_code_removal.md) | [tooling_and_scripts/dead_code_removal.md](../feature_catalog/tooling_and_scripts/dead_code_removal.md) |
| 071 | Features | Performance improvements | [071](pipeline_architecture/performance_improvements.md) | [pipeline_architecture/performance_improvements.md](../feature_catalog/pipeline_architecture/performance_improvements.md) |
| 072 | Features | Test quality improvements | [072](evaluation_and_measurement/test_quality_improvements.md) | [evaluation_and_measurement/test_quality_improvements.md](../feature_catalog/evaluation_and_measurement/test_quality_improvements.md) |
| 073 | Features | Quality gate timer persistence | [073](memory_quality_and_indexing/quality_gate_timer_persistence.md) | [memory_quality_and_indexing/quality_gate_timer_persistence.md](../feature_catalog/memory_quality_and_indexing/quality_gate_timer_persistence.md) |
| 074 | Features | Stage 3 effectiveScore fallback chain | [074](scoring_and_calibration/stage_3_effectivescore_fallback_chain.md) | [scoring_and_calibration/stage_3_effectivescore_fallback_chain.md](../feature_catalog/scoring_and_calibration/stage_3_effectivescore_fallback_chain.md) |
| 075 | Features | Canonical ID dedup hardening | [075](bug_fixes_and_data_integrity/canonical_id_dedup_hardening.md) | [bug_fixes_and_data_integrity/canonical_id_dedup_hardening.md](../feature_catalog/bug_fixes_and_data_integrity/canonical_id_dedup_hardening.md) |
| 077 | Features | Tier-2 fallback channel forcing | [077](retrieval_enhancements/tier_2_fallback_channel_forcing.md) | [retrieval_enhancements/tier_2_fallback_channel_forcing.md](../feature_catalog/retrieval_enhancements/tier_2_fallback_channel_forcing.md) |
| 078 | Features | Legacy V1 pipeline removal | [078](pipeline_architecture/legacy_v1_pipeline_removal.md) | [pipeline_architecture/legacy_v1_pipeline_removal.md](../feature_catalog/pipeline_architecture/legacy_v1_pipeline_removal.md) |
| 079 | Features | Scoring and fusion corrections | [079](scoring_and_calibration/scoring_and_fusion_corrections.md) | [scoring_and_calibration/scoring_and_fusion_corrections.md](../feature_catalog/scoring_and_calibration/scoring_and_fusion_corrections.md) |
| 080 | Features | Pipeline and mutation hardening | [080](pipeline_architecture/pipeline_and_mutation_hardening.md) | [pipeline_architecture/pipeline_and_mutation_hardening.md](../feature_catalog/pipeline_architecture/pipeline_and_mutation_hardening.md) |
| 081 | Features | Graph and cognitive memory fixes | [081](graph_signal_activation/graph_and_cognitive_memory_fixes.md) | [graph_signal_activation/graph_and_cognitive_memory_fixes.md](../feature_catalog/graph_signal_activation/graph_and_cognitive_memory_fixes.md) |
| 082 | Features | Evaluation and housekeeping fixes | [082](evaluation_and_measurement/evaluation_and_housekeeping_fixes.md) | [evaluation_and_measurement/evaluation_and_housekeeping_fixes.md](../feature_catalog/evaluation_and_measurement/evaluation_and_housekeeping_fixes.md) |
| 083 | Features | Math.max/min stack overflow elimination | [083](bug_fixes_and_data_integrity/math_max_min_stack_overflow_elimination.md) | [bug_fixes_and_data_integrity/mathmax_min_stack_overflow_elimination.md](../feature_catalog/bug_fixes_and_data_integrity/mathmax_min_stack_overflow_elimination.md) |
| 084 | Features | Session-manager transaction gap fixes | [084](bug_fixes_and_data_integrity/session_manager_transaction_gap_fixes.md) | [bug_fixes_and_data_integrity/session_manager_transaction_gap_fixes.md](../feature_catalog/bug_fixes_and_data_integrity/session_manager_transaction_gap_fixes.md) |
| 085 | Features | Transaction wrappers on mutation handlers | [085](mutation/transaction_wrappers_on_mutation_handlers.md) | [mutation/transaction_wrappers_on_mutation_handlers.md](../feature_catalog/mutation/transaction_wrappers_on_mutation_handlers.md) |
| 086 | Features | BM25 trigger phrase re-index gate | [086](retrieval/bm25_trigger_phrase_re_index_gate.md) | [retrieval/bm25_trigger_phrase_re_index_gate.md](../feature_catalog/retrieval/bm25_trigger_phrase_re_index_gate.md) |
| 087 | Features | DB_PATH extraction and import standardization | [087](pipeline_architecture/db_path_extraction_and_import_standardization.md) | [pipeline_architecture/dbpath_extraction_and_import_standardization.md](../feature_catalog/pipeline_architecture/dbpath_extraction_and_import_standardization.md) |
| 088 | Features | Cross-AI validation fixes (Tier 4) | [088](evaluation_and_measurement/cross_ai_validation_fixes_tier_4.md) | [evaluation_and_measurement/cross_ai_validation_fixes.md](../feature_catalog/evaluation_and_measurement/cross_ai_validation_fixes.md) |
| 089 | Features | Code standards alignment | [089](tooling_and_scripts/code_standards_alignment.md) | [tooling_and_scripts/code_standards_alignment.md](../feature_catalog/tooling_and_scripts/code_standards_alignment.md) |
| 090 | Features | INT8 quantization evaluation (R5) | [090](evaluation_and_measurement/int8_quantization_evaluation_r5.md) | [evaluation_and_measurement/int8_quantization_evaluation.md](../feature_catalog/evaluation_and_measurement/int8_quantization_evaluation.md) |
| 091 | Features | Implemented: graph centrality and community detection (N2) | [091](graph_signal_activation/implemented_graph_centrality_and_community_detection_n2.md) | [graph_signal_activation/community_detection.md](../feature_catalog/graph_signal_activation/community_detection.md) |
| 092 | Features | Implemented: auto entity extraction (R10) | [092](memory_quality_and_indexing/implemented_auto_entity_extraction_r10.md) | [memory_quality_and_indexing/auto_entity_extraction.md](../feature_catalog/memory_quality_and_indexing/auto_entity_extraction.md) |
| 093 | Features | Implemented: memory summary generation (R8) | [093](retrieval_enhancements/implemented_memory_summary_generation_r8.md) | [retrieval_enhancements/memory_summary_search_channel.md](../feature_catalog/retrieval_enhancements/memory_summary_search_channel.md) |
| 094 | Features | Implemented: cross-document entity linking (S5) | [094](retrieval_enhancements/implemented_cross_document_entity_linking_s5.md) | [retrieval_enhancements/cross_document_entity_linking.md](../feature_catalog/retrieval_enhancements/cross_document_entity_linking.md) |
| 095 | Features | Strict Zod schema validation (P0-1) | [095](pipeline_architecture/strict_zod_schema_validation_p0_1.md) | [pipeline_architecture/strict_zod_schema_validation.md](../feature_catalog/pipeline_architecture/strict_zod_schema_validation.md) |
| 096 | Features | Provenance-rich response envelopes (P0-2) | [096](retrieval_enhancements/provenance_rich_response_envelopes_p0_2.md) | [retrieval_enhancements/provenance_rich_response_envelopes.md](../feature_catalog/retrieval_enhancements/provenance_rich_response_envelopes.md) |
| 097 | Features | Async ingestion job lifecycle (P0-3) | [097](lifecycle/async_ingestion_job_lifecycle_p0_3.md) | [lifecycle/async_ingestion_job_lifecycle.md](../feature_catalog/lifecycle/async_ingestion_job_lifecycle.md) |
| 099 | Features | Real-time filesystem watching  | [099](tooling_and_scripts/real_time_filesystem_watching_p1_7.md) | [tooling_and_scripts/real_time_filesystem_watching_with_chokidar.md](../feature_catalog/tooling_and_scripts/real_time_filesystem_watching_with_chokidar.md) |
| 101 | Features | memory_delete confirm schema tightening | [101](mutation/memory_delete_confirm_schema_tightening.md) | *(memory_delete confirm schema — covered by `mutation/03`)* |
| 102 | Features | Ollama runtime optionalDependencies | *(consolidated — no standalone file)* | *(Ollama runtime optionalDependencies — covered within `scoring_and_calibration`)* |
| 103 | Features | UX hook module coverage (`mutation-feedback`, `response-hints`) | [103](ux_hooks/ux_hook_module_coverage_mutation_feedback_response_hints.md) | [ux_hooks/dedicated_ux_hook_modules.md](../feature_catalog/ux_hooks/dedicated_ux_hook_modules.md) |
| 104 | Features | Mutation save-path UX parity and no-op hardening | [104](ux_hooks/mutation_save_path_ux_parity_and_no_op_hardening.md) | [ux_hooks/duplicate_save_no_op_feedback_hardening.md](../feature_catalog/ux_hooks/duplicate_save_no_op_feedback_hardening.md) |
| 105 | Features | Context-server success-envelope finalization | [105](ux_hooks/context_server_success_envelope_finalization.md) | [ux_hooks/context_server_success_hint_append.md](../feature_catalog/ux_hooks/context_server_success_hint_append.md) |
| 106 | Features | Hooks barrel + README synchronization | [106](ux_hooks/hooks_barrel_readme_synchronization.md) | [ux_hooks/hooks_readme_and_export_alignment.md](../feature_catalog/ux_hooks/hooks_readme_and_export_alignment.md) |
| 107 | Features | Checkpoint confirmName and schema enforcement | [107](ux_hooks/checkpoint_confirmname_and_schema_enforcement.md) | [ux_hooks/checkpoint_delete_confirmname_safety.md](../feature_catalog/ux_hooks/checkpoint_delete_confirmname_safety.md) |
| 108 | Features | Spec 007 finalized verification command suite evidence | [108](tooling_and_scripts/spec_007_finalized_verification_command_suite_evidence.md) | *(Spec 007 verification suite — no dedicated catalog entry)* |
| 109 | Features | Quality-aware 3-tier search fallback | [109](retrieval/quality_aware_3_tier_search_fallback.md) | [retrieval/quality_aware_3_tier_search_fallback.md](../feature_catalog/retrieval/quality_aware_3_tier_search_fallback.md) |
| 110 | Features | Prediction-error save arbitration | [110](mutation/prediction_error_save_arbitration.md) | [mutation/prediction_error_save_arbitration.md](../feature_catalog/mutation/prediction_error_save_arbitration.md) |
| 111 | Features | Deferred lexical-only indexing | [111](memory_quality_and_indexing/deferred_lexical_only_indexing.md) | [memory_quality_and_indexing/deferred_lexical_only_indexing.md](../feature_catalog/memory_quality_and_indexing/deferred_lexical_only_indexing.md) |
| 112 | Features | Cross-process DB hot rebinding | [112](pipeline_architecture/cross_process_db_hot_rebinding.md) | [pipeline_architecture/cross_process_db_hot_rebinding.md](../feature_catalog/pipeline_architecture/cross_process_db_hot_rebinding.md) |
| 114 | Features | Path traversal validation (P0-4) | [114](lifecycle/path_traversal_validation_p0_4.md) | [lifecycle/async_ingestion_job_lifecycle.md](../feature_catalog/lifecycle/async_ingestion_job_lifecycle.md) |
| 115 | Features | Transaction atomicity on rename failure (P0-5) | [115](pipeline_architecture/transaction_atomicity_on_rename_failure_p0_5.md) | [pipeline_architecture/atomic_pending_file_recovery.md](../feature_catalog/pipeline_architecture/atomic_pending_file_recovery.md) |
| 116 | Features | Chunking safe swap atomicity (P0-6) | [116](bug_fixes_and_data_integrity/chunking_safe_swap_atomicity_p0_6.md) | [bug_fixes_and_data_integrity/chunking_orchestrator_safe_swap.md](../feature_catalog/bug_fixes_and_data_integrity/chunking_orchestrator_safe_swap.md) |
| 117 | Features | SQLite datetime session cleanup (P0-7) | [117](bug_fixes_and_data_integrity/sqlite_datetime_session_cleanup_p0_7.md) | [bug_fixes_and_data_integrity/working_memory_timestamp_fix.md](../feature_catalog/bug_fixes_and_data_integrity/working_memory_timestamp_fix.md) |
| 118 | Features | Stage-2 score field synchronization (P0-8) | [118](scoring_and_calibration/stage_2_score_field_synchronization_p0_8.md) | [scoring_and_calibration/scoring_and_fusion_corrections.md](../feature_catalog/scoring_and_calibration/scoring_and_fusion_corrections.md) |
| 119 | Features | Memory filename uniqueness (ensureUniqueMemoryFilename) | [119](memory_quality_and_indexing/memory_filename_uniqueness_ensureuniquememoryfilename.md) | [memory_quality_and_indexing/spec_folder_description_discovery.md](../feature_catalog/memory_quality_and_indexing/spec_folder_description_discovery.md) |
| 120 | Features | Unified graph rollback and explainability (Phase 3) | [120](graph_signal_activation/unified_graph_rollback_and_explainability_phase_3.md) | [graph_signal_activation/unified_graph_retrieval_deterministic_ranking_explainability_and_rollback.md](../feature_catalog/graph_signal_activation/unified_graph_retrieval_deterministic_ranking_explainability_and_rollback.md) |
| 121 | Features | Adaptive shadow proposal and rollback (Phase 4) | [121](scoring_and_calibration/adaptive_shadow_proposal_and_rollback_phase_4.md) | [scoring_and_calibration/adaptive_shadow_ranking_bounded_proposals_and_rollback.md](../feature_catalog/scoring_and_calibration/adaptive_shadow_ranking_bounded_proposals_and_rollback.md) |
| 122 | Features | Governed ingest and scope isolation (Phase 5) | [122](governance/governed_ingest_and_scope_isolation_phase_5.md) | [governance/hierarchical_scope_governance_governed_ingest_retention_and_audit.md](../feature_catalog/governance/hierarchical_scope_governance_governed_ingest_retention_and_audit.md) |
| 125 | Features | Memory roadmap flags | 125 memory roadmap flags | [feature_flag_reference/1_search_pipeline_features_speckit.md](../feature_catalog/feature_flag_reference/1_search_pipeline_features_speckit.md) <br> Cross-cutting roadmap test - maps to umbrella flag reference. |
| 126 | Features | Memory roadmap baseline snapshot | [126](evaluation_and_measurement/memory_roadmap_baseline_snapshot.md) | [evaluation_and_measurement/memory_roadmap_baseline_snapshot.md](../feature_catalog/evaluation_and_measurement/memory_roadmap_baseline_snapshot.md) |
| 127 | Features | Migration checkpoint scripts | [127](tooling_and_scripts/migration_checkpoint_scripts.md) | [tooling_and_scripts/migration_checkpoint_scripts.md](../feature_catalog/tooling_and_scripts/migration_checkpoint_scripts.md) |
| 128 | Features | Schema compatibility validation | [128](tooling_and_scripts/schema_compatibility_validation.md) | [tooling_and_scripts/schema_compatibility_validation.md](../feature_catalog/tooling_and_scripts/schema_compatibility_validation.md) |
| 129 | Features | Lineage state active projection and asOf resolution | [129](pipeline_architecture/lineage_state_active_projection_and_asof_resolution.md) | [pipeline_architecture/lineage_state_active_projection_and_asof_resolution.md](../feature_catalog/pipeline_architecture/lineage_state_active_projection_and_asof_resolution.md) |
| 130 | Features | Lineage backfill rollback drill | [130](pipeline_architecture/lineage_backfill_rollback_drill.md) | [pipeline_architecture/lineage_state_active_projection_and_asof_resolution.md](../feature_catalog/pipeline_architecture/lineage_state_active_projection_and_asof_resolution.md) |
| 131 | Features | Description.json batch backfill validation (PI-B3) | [131](memory_quality_and_indexing/description_json_batch_backfill_validation_pi_b3.md) | [memory_quality_and_indexing/spec_folder_description_discovery.md](../feature_catalog/memory_quality_and_indexing/spec_folder_description_discovery.md) |
| 132 | Features | description.json schema field validation | [132](memory_quality_and_indexing/description_json_schema_field_validation.md) | [memory_quality_and_indexing/spec_folder_description_discovery.md](../feature_catalog/memory_quality_and_indexing/spec_folder_description_discovery.md) |
| 133 | Features | Dry-run preflight for memory_save | [133](memory_quality_and_indexing/dry_run_preflight_for_memory_save.md) | [memory_quality_and_indexing/dry_run_preflight_for_memory_save.md](../feature_catalog/memory_quality_and_indexing/dry_run_preflight_for_memory_save.md) |
| 135 | Features | Grep traceability for feature catalog code references | [135](tooling_and_scripts/grep_traceability_for_feature_catalog_code_references.md) | [tooling_and_scripts/feature_catalog_code_references.md](../feature_catalog/tooling_and_scripts/feature_catalog_code_references.md) |
| 136 | Features | Feature catalog annotation name validity | [136](tooling_and_scripts/feature_catalog_annotation_name_validity.md) | [tooling_and_scripts/feature_catalog_code_references.md](../feature_catalog/tooling_and_scripts/feature_catalog_code_references.md) |
| 137 | Features | Multi-feature annotation coverage | [137](tooling_and_scripts/multi_feature_annotation_coverage.md) | [tooling_and_scripts/feature_catalog_code_references.md](../feature_catalog/tooling_and_scripts/feature_catalog_code_references.md) |
| 138 | Features | MODULE: header compliance via verify_alignment_drift.py | [138](tooling_and_scripts/module_header_compliance_via_verify_alignment_drift_py.md) | [tooling_and_scripts/feature_catalog_code_references.md](../feature_catalog/tooling_and_scripts/feature_catalog_code_references.md) |
| 139 | Features | Session capturing pipeline quality | [139](tooling_and_scripts/session_capturing_pipeline_quality_coverage.md) | [tooling_and_scripts/session_capturing_pipeline_quality.md](../feature_catalog/tooling_and_scripts/session_capturing_pipeline_quality.md) |
| 142 | Features | Session transition trace contract | [142](retrieval/session_transition_trace_contract.md) | [retrieval/unified_context_retrieval_memorycontext.md](../feature_catalog/retrieval/unified_context_retrieval_memorycontext.md) |
| 143 | Features | Bounded graph-walk rollout and diagnostics | [143](retrieval/bounded_graph_walk_rollout_and_diagnostics.md) | [retrieval/semantic_and_lexical_search_memorysearch.md](../feature_catalog/retrieval/semantic_and_lexical_search_memorysearch.md) |
| 144 | Features | Advisory ingest lifecycle forecast | [144](lifecycle/advisory_ingest_lifecycle_forecast.md) | [lifecycle/async_ingestion_job_lifecycle.md](../feature_catalog/lifecycle/async_ingestion_job_lifecycle.md) |
| 145 | Features | Contextual tree injection  | [145](retrieval_enhancements/contextual_tree_injection_p1_4.md) | [retrieval_enhancements/contextual_tree_injection.md](../feature_catalog/retrieval_enhancements/contextual_tree_injection.md) |
| 146 | Features | Dynamic server instructions  | [146](pipeline_architecture/dynamic_server_instructions_p1_6.md) | [pipeline_architecture/dynamic_server_instructions_at_mcp_initialization.md](../feature_catalog/pipeline_architecture/dynamic_server_instructions_at_mcp_initialization.md) |
| 147 | Features | Constitutional memory manager command | [147](tooling_and_scripts/constitutional_memory_manager_command.md) | [tooling_and_scripts/constitutional_memory_manager_command.md](../feature_catalog/tooling_and_scripts/constitutional_memory_manager_command.md) |
| 149 | Features | Rendered spec-doc record template contract | [149](tooling_and_scripts/rendered_memory_template_contract.md) | [tooling_and_scripts/session_capturing_pipeline_quality.md](../feature_catalog/tooling_and_scripts/session_capturing_pipeline_quality.md) |
| 150 | Features | Source-dist alignment validation | [150](tooling_and_scripts/source_dist_alignment_validation.md) | [tooling_and_scripts/source_dist_alignment_enforcement.md](../feature_catalog/tooling_and_scripts/source_dist_alignment_enforcement.md) |
| 151 | Features | MODULE_MAP.md accuracy validation | [151](tooling_and_scripts/module_map_accuracy.md) | [tooling_and_scripts/module_boundary_map.md](../feature_catalog/tooling_and_scripts/module_boundary_map.md) |
| 152 | Features | No symlinks in lib/ tree | [152](tooling_and_scripts/no_symlinks_in_lib_tree.md) | [tooling_and_scripts/module_boundary_map.md](../feature_catalog/tooling_and_scripts/module_boundary_map.md) |
| 153 | Features | JSON mode structured summary hardening | [153](tooling_and_scripts/json_mode_hybrid_enrichment.md) | [tooling_and_scripts/json_mode_hybrid_enrichment.md](../feature_catalog/tooling_and_scripts/json_mode_hybrid_enrichment.md) |
| 154 | Features | JSON-primary deprecation posture | [154](tooling_and_scripts/json_primary_deprecation_posture.md) | [tooling_and_scripts/json_primary_deprecation_posture.md](../feature_catalog/tooling_and_scripts/json_primary_deprecation_posture.md) |
| 181 | Features | Template Compliance Contract Enforcement | [181](tooling_and_scripts/template_compliance_contract_enforcement_produces_compliant.md) | [tooling_and_scripts/template_compliance_contract_enforcement.md](../feature_catalog/tooling_and_scripts/template_compliance_contract_enforcement.md) |
| M-009 | Dedicated Memory/Spec-Kit Scenarios | Runtime Family Count Census | [M-009](tooling_and_scripts/runtime_family_count_census.md) | *(test-only, no catalog entry)* |
| M-010 | Dedicated Memory/Spec-Kit Scenarios | Runtime Lineage Naming Parity | [M-010](tooling_and_scripts/runtime_lineage_naming_parity.md) | *(test-only, no catalog entry)* |
| M-011 | Dedicated Memory/Spec-Kit Scenarios | Review packet type marker-gated validation | [M-011](tooling_and_scripts/review_packet_type_marker_gated_validation.md) | *(test-only, no catalog entry)* |
| 185 | Features | /memory:search command routing | [185](retrieval/memory_search_command_routing.md) | [feature_catalog.md#command-surface-contract](../feature_catalog/feature_catalog.md#command-surface-contract) |
| 186 | Features | /memory:manage command routing | [186](tooling_and_scripts/memory_manage_command_routing.md) | [feature_catalog.md#command-surface-contract](../feature_catalog/feature_catalog.md#command-surface-contract) |
| 187 | Features | Quick search (memory_quick_search) | [187](retrieval/quick_search_memory_quick_search.md) | [retrieval/fast_delegated_search_memory_quick_search.md](../feature_catalog/retrieval/fast_delegated_search_memory_quick_search.md) |
| 155 | Features | Post-save quality review | [155](memory_quality_and_indexing/post_save_quality_review.md) | [memory_quality_and_indexing/post_save_quality_review.md](../feature_catalog/memory_quality_and_indexing/post_save_quality_review.md) |
| 156 | Features | Graph refresh mode (SPECKIT_GRAPH_REFRESH_MODE) | [156](graph_signal_activation/graph_refresh_mode_speckit_graph_refresh_mode.md) | [graph_signal_activation/graph_lifecycle_refresh.md](../feature_catalog/graph_signal_activation/graph_lifecycle_refresh.md) |
| 157 | Features | LLM graph backfill (SPECKIT_LLM_GRAPH_BACKFILL) | [157](graph_signal_activation/llm_graph_backfill_speckit_llm_graph_backfill.md) | [graph_signal_activation/llm_graph_backfill.md](../feature_catalog/graph_signal_activation/llm_graph_backfill.md) |
| 158 | Features | Graph calibration profile (SPECKIT_GRAPH_CALIBRATION_PROFILE) | [158](graph_signal_activation/graph_calibration_profile_speckit_graph_calibration_profile.md) | [graph_signal_activation/graph_calibration_profiles.md](../feature_catalog/graph_signal_activation/graph_calibration_profiles.md) |
| 159 | Features | Learned Stage 2 combiner (SPECKIT_LEARNED_STAGE2_COMBINER) | [159](scoring_and_calibration/learned_stage2_combiner_speckit_learned_stage2_combiner.md) | [scoring_and_calibration/learned_stage2_weight_combiner.md](../feature_catalog/scoring_and_calibration/learned_stage2_weight_combiner.md) |
| 160 | Features | Shadow feedback (SPECKIT_SHADOW_FEEDBACK) | [160](scoring_and_calibration/shadow_feedback_speckit_shadow_feedback.md) | [scoring_and_calibration/shadow_feedback_holdout_evaluation.md](../feature_catalog/scoring_and_calibration/shadow_feedback_holdout_evaluation.md) |
| 161 | Features | LLM reformulation (SPECKIT_LLM_REFORMULATION) | [161](query_intelligence/llm_reformulation_speckit_llm_reformulation.md) | [query_intelligence/llm_query_reformulation.md](../feature_catalog/query_intelligence/llm_query_reformulation.md) |
| 162 | Features | HyDE (SPECKIT_HYDE) | [162](query_intelligence/hyde_speckit_hyde.md) | [query_intelligence/hyde_hypothetical_document_embeddings.md](../feature_catalog/query_intelligence/hyde_hypothetical_document_embeddings.md) |
| 163 | Features | Query surrogates (SPECKIT_QUERY_SURROGATES) | [163](query_intelligence/query_surrogates_speckit_query_surrogates.md) | [query_intelligence/index_time_query_surrogates.md](../feature_catalog/query_intelligence/index_time_query_surrogates.md) |
| 165 | Features | Assistive reconsolidation (SPECKIT_ASSISTIVE_RECONSOLIDATION) | [165](memory_quality_and_indexing/assistive_reconsolidation_speckit_assistive_reconsolidation.md) | [memory_quality_and_indexing/assistive_reconsolidation.md](../feature_catalog/memory_quality_and_indexing/assistive_reconsolidation.md) |
| 166 | Features | Result explain v1 (SPECKIT_RESULT_EXPLAIN) | [166](ux_hooks/result_explain_v1_speckit_result_explain_v1.md) | [ux_hooks/result_explainability.md](../feature_catalog/ux_hooks/result_explainability.md) |
| 167 | Features | Response profile v1 (SPECKIT_RESPONSE_PROFILE) | [167](ux_hooks/response_profile_v1_speckit_response_profile_v1.md) | [ux_hooks/mode_aware_response_profiles.md](../feature_catalog/ux_hooks/mode_aware_response_profiles.md) |
| 168 | Features | Progressive disclosure v1 (SPECKIT_PROGRESSIVE_DISCLOSURE) | [168](ux_hooks/progressive_disclosure_v1_speckit_progressive_disclosure_v1.md) | [ux_hooks/progressive_disclosure.md](../feature_catalog/ux_hooks/progressive_disclosure.md) |
| 169 | Features | Session retrieval state v1 (SPECKIT_SESSION_RETRIEVAL_STATE) | [169](ux_hooks/session_retrieval_state_v1_speckit_session_retrieval_state_v1.md) | [ux_hooks/retrieval_session_state.md](../feature_catalog/ux_hooks/retrieval_session_state.md) |
| 171 | Features | Calibrated overlap bonus (SPECKIT_CALIBRATED_OVERLAP_BONUS) | [171](scoring_and_calibration/calibrated_overlap_bonus_speckit_calibrated_overlap_bonus.md) | [scoring_and_calibration/calibrated_overlap_bonus.md](../feature_catalog/scoring_and_calibration/calibrated_overlap_bonus.md) |
| 172 | Features | RRF K experimental (SPECKIT_RRF_K_EXPERIMENTAL) | [172](scoring_and_calibration/rrf_k_experimental_speckit_rrf_k_experimental.md) | [scoring_and_calibration/rrf_k_experimental.md](../feature_catalog/scoring_and_calibration/rrf_k_experimental.md) |
| 173 | Features | Query decomposition (SPECKIT_QUERY_DECOMPOSITION) | [173](query_intelligence/query_decomposition_speckit_query_decomposition.md) | [query_intelligence/query_decomposition.md](../feature_catalog/query_intelligence/query_decomposition.md) |
| 174 | Features | Graph concept routing (SPECKIT_GRAPH_CONCEPT_ROUTING) | [174](graph_signal_activation/graph_concept_routing_speckit_graph_concept_routing.md) | [query_intelligence/graph_concept_routing.md](../feature_catalog/query_intelligence/graph_concept_routing.md) |
| 175 | Features | Typed traversal (SPECKIT_TYPED_TRAVERSAL) | [175](graph_signal_activation/typed_traversal_speckit_typed_traversal.md) | [graph_signal_activation/typed_traversal.md](../feature_catalog/graph_signal_activation/typed_traversal.md) |
| 177 | Features | Hybrid decay policy (SPECKIT_HYBRID_DECAY_POLICY) | [177](memory_quality_and_indexing/hybrid_decay_policy_speckit_hybrid_decay_policy.md) | [memory_quality_and_indexing/hybrid_decay_policy.md](../feature_catalog/memory_quality_and_indexing/hybrid_decay_policy.md) |
| 178 | Features | Save quality gate exceptions (SPECKIT_SAVE_QUALITY_GATE_EXCEPTIONS) | [178](memory_quality_and_indexing/save_quality_gate_exceptions_speckit_save_quality_gate_exceptions.md) | [memory_quality_and_indexing/save_quality_gate_exceptions.md](../feature_catalog/memory_quality_and_indexing/save_quality_gate_exceptions.md) |
| 179 | Features | Empty result recovery (SPECKIT_EMPTY_RESULT_RECOVERY) | [179](ux_hooks/empty_result_recovery_speckit_empty_result_recovery_v1.md) | [ux_hooks/empty_result_recovery.md](../feature_catalog/ux_hooks/empty_result_recovery.md) |
| 180 | Features | Result confidence (SPECKIT_RESULT_CONFIDENCE) | [180](ux_hooks/result_confidence_speckit_result_confidence_v1.md) | [ux_hooks/result_confidence.md](../feature_catalog/ux_hooks/result_confidence.md) |
| PHASE-001 | Phase System Features | Phase detection scoring | [PHASE-001](tooling_and_scripts/phase_detection_scoring.md) | *(test-only, no catalog entry)* |
| PHASE-002 | Phase System Features | Phase folder creation | [PHASE-002](tooling_and_scripts/phase_folder_creation.md) | *(test-only, no catalog entry)* |
| PHASE-003 | Phase System Features | Recursive phase validation | [PHASE-003](tooling_and_scripts/recursive_phase_validation.md) | *(test-only, no catalog entry)* |
| PHASE-004 | Phase System Features | Phase link validation | [PHASE-004](tooling_and_scripts/phase_link_validation.md) | *(test-only, no catalog entry)* |
| PHASE-005 | Phase System Features | Phase command workflow | [PHASE-005](tooling_and_scripts/phase_command_workflow.md) | *(test-only, no catalog entry)* |
| PHASE-006 | Phase System Features | Spec-folder literal naming (create.sh fallback) | [PHASE-006](tooling_and_scripts/spec_folder_literal_naming_create_sh_fallback.md) | *(test-only, no catalog entry)* |
| PHASE-008 | Phase System Features | Spec-folder literal naming (CLI-driven slug proposal) | [PHASE-008](tooling_and_scripts/spec_folder_literal_naming_cli_driven_slug.md) | *(test-only, no catalog entry)* |
| PHASE-009 | Phase System Features | Spec-folder literal naming (remediation rule via SKILL.md rule 20) | [PHASE-009](tooling_and_scripts/spec_folder_literal_naming_remediation_rule.md) | *(test-only, no catalog entry)* |
| M-001 | Dedicated Memory/Spec-Kit Scenarios | Context Recovery and Continuation | [M-001](retrieval/context_recovery_and_continuation.md) | *(test-only, no catalog entry)* |
| M-002 | Dedicated Memory/Spec-Kit Scenarios | Targeted Memory Lookup | [M-002](retrieval/targeted_memory_lookup.md) | *(test-only, no catalog entry)* |
| M-003 | Dedicated Memory/Spec-Kit Scenarios | Context Save + Index Update | [M-003](memory_quality_and_indexing/context_save_index_update.md) | *(test-only, no catalog entry)* |
| M-004 | Dedicated Memory/Spec-Kit Scenarios | Main-Agent Review and Verdict Handoff | [M-004](tooling_and_scripts/main_agent_review_and_verdict_handoff.md) | *(test-only, no catalog entry)* |
| M-005 | Dedicated Memory/Spec-Kit Scenarios | Outsourced Agent Memory Capture Round-Trip | [M-005](memory_quality_and_indexing/outsourced_agent_memory_capture_round_trip.md) | [memory_quality_and_indexing/outsourced_agent_memory_capture.md](../feature_catalog/memory_quality_and_indexing/outsourced_agent_memory_capture.md) |
| M-006 | Dedicated Memory/Spec-Kit Scenarios | Session Enrichment and Alignment Guardrails | [M-006](memory_quality_and_indexing/session_enrichment_and_alignment_guardrails.md) | [memory_quality_and_indexing/session_enrichment_and_alignment_guards.md](../feature_catalog/memory_quality_and_indexing/session_enrichment_and_alignment_guards.md) |
| M-007 | Dedicated Memory/Spec-Kit Scenarios | Session Capturing Pipeline Quality | [M-007](tooling_and_scripts/session_capturing_pipeline_quality.md) | [tooling_and_scripts/session_capturing_pipeline_quality.md](../feature_catalog/tooling_and_scripts/session_capturing_pipeline_quality.md) |
| M-008 | Dedicated Memory/Spec-Kit Scenarios | Feature 09 Direct Manual Scenario (Per-memory History Log) | [M-008](mutation/feature_09_direct_manual_scenario_per_memory_history_log.md) | [mutation/per_memory_history_log.md](../feature_catalog/mutation/per_memory_history_log.md) |
| 190 | Features | Session recovery via /speckit:resume | [190](retrieval/session_recovery_spec_kit_resume.md) | [retrieval/session_recovery_spec_kit_resume.md](../feature_catalog/retrieval/session_recovery_spec_kit_resume.md) |
| 125-map | Features | Audit phase mapping note (020) | — | [feature_flag_reference/audit_phase_020_mapping_note.md](../feature_catalog/feature_flag_reference/audit_phase_020_mapping_note.md) |
| 020-stub | Features | Remediation and revalidation (stub) | — | [remediation_revalidation/category_stub.md](../feature_catalog/remediation_revalidation/category_stub.md) |
| 021-stub | Features | Implement and remove deprecated (stub) | — | [implement_and_remove_deprecated_features/category_stub.md](../feature_catalog/implement_and_remove_deprecated_features/category_stub.md) |
| 188 | Features | AST-level section retrieval tool | [188](retrieval/ast_level_section_retrieval_tool.md) | [retrieval/ast_level_section_retrieval_tool.md](../feature_catalog/retrieval/ast_level_section_retrieval_tool.md) |
| 189 | Features | Tool-result extraction to working memory | [189](retrieval/tool_result_extraction_to_working_memory.md) | [retrieval/tool_result_extraction_to_working_memory.md](../feature_catalog/retrieval/tool_result_extraction_to_working_memory.md) |
| 192 | Features | Correction tracking with undo | [192](mutation/correction_tracking_with_undo.md) | [mutation/correction_tracking_with_undo.md](../feature_catalog/mutation/correction_tracking_with_undo.md) |
| 194 | Features | Causal neighbor boost and injection | [194](graph_signal_activation/causal_neighbor_boost_and_injection.md) | [graph_signal_activation/causal_neighbor_boost_and_injection.md](../feature_catalog/graph_signal_activation/causal_neighbor_boost_and_injection.md) |
| 195 | Features | Temporal contiguity layer | [195](graph_signal_activation/temporal_contiguity_layer.md) | [graph_signal_activation/temporal_contiguity_layer.md](../feature_catalog/graph_signal_activation/temporal_contiguity_layer.md) |
| 196 | Features | Tool-level TTL cache | [196](scoring_and_calibration/tool_level_ttl_cache.md) | [scoring_and_calibration/tool_level_ttl_cache.md](../feature_catalog/scoring_and_calibration/tool_level_ttl_cache.md) |
| 197 | Features | Access-driven popularity scoring | [197](scoring_and_calibration/access_driven_popularity_scoring.md) | [scoring_and_calibration/access_driven_popularity_scoring.md](../feature_catalog/scoring_and_calibration/access_driven_popularity_scoring.md) |
| 198 | Features | Temporal-structural coherence scoring | [198](scoring_and_calibration/temporal_structural_coherence_scoring.md) | [scoring_and_calibration/temporal_structural_coherence_scoring.md](../feature_catalog/scoring_and_calibration/temporal_structural_coherence_scoring.md) |
| 199 | Features | Content-aware memory filename generation | [199](memory_quality_and_indexing/content_aware_memory_filename_generation.md) | [memory_quality_and_indexing/content_aware_memory_filename_generation.md](../feature_catalog/memory_quality_and_indexing/content_aware_memory_filename_generation.md) |
| 202 | Features | Backend storage adapter abstraction | [202](pipeline_architecture/backend_storage_adapter_abstraction.md) | [pipeline_architecture/backend_storage_adapter_abstraction.md](../feature_catalog/pipeline_architecture/backend_storage_adapter_abstraction.md) |
| 203 | Features | Atomic write-then-index API | [203](pipeline_architecture/atomic_write_then_index_api.md) | [pipeline_architecture/atomic_write_then_index_api.md](../feature_catalog/pipeline_architecture/atomic_write_then_index_api.md) |
| 204 | Features | Embedding retry orchestrator | [204](pipeline_architecture/embedding_retry_orchestrator.md) | [pipeline_architecture/embedding_retry_orchestrator.md](../feature_catalog/pipeline_architecture/embedding_retry_orchestrator.md) |
| 205 | Features | 7-layer tool architecture metadata | [205](pipeline_architecture/7_layer_tool_architecture_metadata.md) | [pipeline_architecture/7_layer_tool_architecture_metadata.md](../feature_catalog/pipeline_architecture/7_layer_tool_architecture_metadata.md) |
| 206 | Features | Architecture boundary enforcement | [206](tooling_and_scripts/architecture_boundary_enforcement.md) | [tooling_and_scripts/architecture_boundary_enforcement.md](../feature_catalog/tooling_and_scripts/architecture_boundary_enforcement.md) |
| 207 | Features | Watcher delete/rename cleanup | [207](tooling_and_scripts/watcher_delete_rename_cleanup.md) | [tooling_and_scripts/watcher_delete_rename_cleanup.md](../feature_catalog/tooling_and_scripts/watcher_delete_rename_cleanup.md) |
| 208 | Features | Template compliance contract enforcement | [208](tooling_and_scripts/template_compliance_contract_enforcement_blocks_non_compliant.md) | [tooling_and_scripts/template_compliance_contract_enforcement.md](../feature_catalog/tooling_and_scripts/template_compliance_contract_enforcement.md) |
| 209 | Features | Shared post-mutation hook wiring | consolidated manual record | consolidated into successor UX hook records |
| 210 | Features | Memory health autoRepair metadata | [210](ux_hooks/memory_health_autorepair_metadata.md) | [ux_hooks/memory_health_autorepair_metadata.md](../feature_catalog/ux_hooks/memory_health_autorepair_metadata.md) |
| 211 | Features | Schema and type contract sync | [211](ux_hooks/schema_and_type_contract_synchronization.md) | [ux_hooks/schema_and_type_contract_synchronization.md](../feature_catalog/ux_hooks/schema_and_type_contract_synchronization.md) |
| 212 | Features | Mutation hook result contract expansion | [212](ux_hooks/mutation_hook_result_contract_expansion.md) | [ux_hooks/mutation_hook_result_contract_expansion.md](../feature_catalog/ux_hooks/mutation_hook_result_contract_expansion.md) |
| 213 | Features | Mutation response UX payload exposure | [213](ux_hooks/mutation_response_ux_payload_exposure.md) | [ux_hooks/mutation_response_ux_payload_exposure.md](../feature_catalog/ux_hooks/mutation_response_ux_payload_exposure.md) |
| 214 | Features | Atomic-save parity and indexing hints | [214](ux_hooks/atomic_save_parity_and_partial_indexing_hints.md) | [ux_hooks/atomic_save_parity_and_partial_indexing_hints.md](../feature_catalog/ux_hooks/atomic_save_parity_and_partial_indexing_hints.md) |
| 215 | Features | Final token metadata recomputation | [215](ux_hooks/final_token_metadata_recomputation.md) | [ux_hooks/final_token_metadata_recomputation.md](../feature_catalog/ux_hooks/final_token_metadata_recomputation.md) |
| 216 | Features | End-to-end success-envelope verification | [216](ux_hooks/end_to_end_success_envelope_verification.md) | [ux_hooks/end_to_end_success_envelope_verification.md](../feature_catalog/ux_hooks/end_to_end_success_envelope_verification.md) |
| 248 | Context Preservation | PreCompact hook | [248](context_preservation/precompact_hook.md) | [context_preservation/precompact_hook.md](../feature_catalog/context_preservation/precompact_hook.md) |
| 249 | Context Preservation | SessionStart compact | [249](context_preservation/session_start_compact.md) | [context_preservation/session_start_priming.md](../feature_catalog/context_preservation/session_start_priming.md) |
| 250 | Context Preservation | SessionStart startup | [250](context_preservation/session_start_startup.md) | [context_preservation/session_start_priming.md](../feature_catalog/context_preservation/session_start_priming.md) |
| 251 | Context Preservation | Stop hook saves | [251](context_preservation/stop_hook_saves.md) | [context_preservation/stop_token_tracking.md](../feature_catalog/context_preservation/stop_token_tracking.md) |
| 252 | Context Preservation | Cross-runtime fallback | [252](context_preservation/cross_runtime_fallback.md) | [context_preservation/cross_runtime_fallback.md](../feature_catalog/context_preservation/cross_runtime_fallback.md) |
| 253 | Context Preservation | Runtime detection | [253](context_preservation/runtime_detection.md) | [context_preservation/runtime_detection.md](../feature_catalog/context_preservation/runtime_detection.md) |
| 256 | Context Preservation | Budget allocator | [256](context_preservation/budget_allocator.md) | [context_preservation/budget_allocator.md](../feature_catalog/context_preservation/budget_allocator.md) |
| 257 | Context Preservation | Working-set compaction | [257](context_preservation/working_set_compaction.md) | [context_preservation/working_set_tracker.md](../feature_catalog/context_preservation/working_set_tracker.md) |
| 258 | Context Preservation | 3-source compact merger within budget | [258](context_preservation/compact_merger_assembly.md) | [context_preservation/compact_merger.md](../feature_catalog/context_preservation/compact_merger.md) |
| 261 | Context Preservation | MCP auto-priming Prime Package delivery | [261](context_preservation/mcp_auto_priming.md) | [context_preservation/mcp_auto_priming.md](../feature_catalog/context_preservation/mcp_auto_priming.md) |
| 262 | Context Preservation | Session health ok/warning/stale status | [262](context_preservation/session_health.md) | [context_preservation/session_health_tool.md](../feature_catalog/context_preservation/session_health_tool.md) |
| 263 | Context Preservation | Session resume merged result | [263](context_preservation/session_resume.md) | [context_preservation/session_resume_tool.md](../feature_catalog/context_preservation/session_resume_tool.md) |
| 264 | Context Preservation | Query-intent routing in memory_context | [264](context_preservation/query_intent_routing.md) | [context_preservation/query_intent_routing.md](../feature_catalog/context_preservation/query_intent_routing.md) |
| 266 | Context Preservation | Context preservation metrics quality score | [266](context_preservation/context_preservation_metrics.md) | [context_preservation/context_preservation_metrics.md](../feature_catalog/context_preservation/context_preservation_metrics.md) |
| 267 | Context Preservation | Tool routing enforcement | [267](context_preservation/tool_routing_enforcement.md) | [context_preservation/tool_routing_enforcement.md](../feature_catalog/context_preservation/tool_routing_enforcement.md) |
| 268 | Features | Post-insert retry budget | [268](lifecycle/post_insert_retry_budget.md) | [lifecycle/post_insert_retry_budget.md](../feature_catalog/lifecycle/post_insert_retry_budget.md) |
| 269 | Features | Scope normalizer canonicalization and lint | [269](bug_fixes_and_data_integrity/scope_normalizer_canonicalization_and_lint.md) | [bug_fixes_and_data_integrity/scope_normalizer_canonicalization_and_lint.md](../feature_catalog/bug_fixes_and_data_integrity/scope_normalizer_canonicalization_and_lint.md) |
| 270 | Features | maintainability extracts | [270](pipeline_architecture/phase_017_maintainability_extracts.md) | [pipeline_architecture/phase_017_maintainability_extracts.md](../feature_catalog/pipeline_architecture/phase_017_maintainability_extracts.md) |
| 271 | Features | Research metadata backfill | [271](tooling_and_scripts/research_metadata_backfill.md) | [tooling_and_scripts/research_metadata_backfill.md](../feature_catalog/tooling_and_scripts/research_metadata_backfill.md) |
| 272 | Features | Strict validation add-ons: continuity freshness and evidence markers | [272](tooling_and_scripts/strict_validation_addons_continuity_freshness_and_evidence_markers.md) | [tooling_and_scripts/strict_validation_addons_continuity_freshness_and_evidence_markers.md](../feature_catalog/tooling_and_scripts/strict_validation_addons_continuity_freshness_and_evidence_markers.md) |
| 273 | Features | Session-resume caller binding and Unicode sanitization | [273](governance/session_resume_caller_binding_and_unicode_sanitization.md) | [governance/session_resume_caller_binding_and_unicode_sanitization.md](../feature_catalog/governance/session_resume_caller_binding_and_unicode_sanitization.md) |
| 276 | Features | Reconsolidation conflict transaction helper | [276](mutation/reconsolidation_conflict_transaction_helper.md) | [mutation/reconsolidation_conflict_transaction_helper.md](../feature_catalog/mutation/reconsolidation_conflict_transaction_helper.md) |
| 278 | Features | Memory retention sweep basic flow | [278](maintenance/memory_retention_sweep_basic_flow.md) | [maintenance/memory_retention_sweep.md](../feature_catalog/maintenance/memory_retention_sweep.md) |
| 280 | Features | CLI matrix adapter runner smoke | [280](tooling_and_scripts/cli_matrix_adapter_runner_smoke.md) | [tooling_and_scripts/cli_matrix_adapter_runners.md](../feature_catalog/tooling_and_scripts/cli_matrix_adapter_runners.md) |

---
| 323 | Doctor Commands | /doctor memory fresh-install bootstrap | [323](doctor_commands/doctor_memory_fresh_install.md) | [.opencode/commands/doctor/speckit.md](../../../commands/doctor/speckit.md) |
| 324 | Doctor Commands | /doctor memory drift detection on modified spec docs | [324](doctor_commands/doctor_memory_drift_detection.md) | [.opencode/commands/doctor/speckit.md](../../../commands/doctor/speckit.md) |
| 325 | Doctor Commands | /doctor memory long-pole rebuild with snapshot + ETA prompt | [325](doctor_commands/doctor_memory_long_pole_rebuild.md) | [.opencode/commands/doctor/speckit.md](../../../commands/doctor/speckit.md) |
| 326 | Doctor Commands | /doctor memory SIGINT mid-rebuild graceful cancel + restore | [326](doctor_commands/doctor_memory_sigint_cancellation.md) | [.opencode/commands/doctor/speckit.md](../../../commands/doctor/speckit.md) |
| 327 | Doctor Commands | /doctor memory disk-pressure pre-flight refusal | [327](doctor_commands/doctor_memory_disk_pressure.md) | [.opencode/commands/doctor/speckit.md](../../../commands/doctor/speckit.md) |
| 328 | Doctor Commands | /doctor causal-graph low-coverage drift report (<60%) | [328](doctor_commands/doctor_causal_graph_low_coverage.md) | [.opencode/commands/doctor/speckit.md](../../../commands/doctor/speckit.md) |
| 329 | Doctor Commands | /doctor causal-graph confidence threshold ≥0.7 enforcement | [329](doctor_commands/doctor_causal_graph_confidence_threshold.md) | [.opencode/commands/doctor/speckit.md](../../../commands/doctor/speckit.md) |
| 330 | Doctor Commands | /doctor causal-graph add-only mutation boundary | [330](doctor_commands/doctor_causal_graph_add_only.md) | [.opencode/commands/doctor/speckit.md](../../../commands/doctor/speckit.md) |
| 331 | Doctor Commands | /doctor deep-loop lazy-init from iteration folders | [331](doctor_commands/doctor_deep_loop_lazy_init.md) | [.opencode/commands/doctor/speckit.md](../../../commands/doctor/speckit.md) |
| 332 | Doctor Commands | /doctor deep-loop empty graph + no iteration source | [332](doctor_commands/doctor_deep_loop_empty_no_source.md) | [.opencode/commands/doctor/speckit.md](../../../commands/doctor/speckit.md) |
| 333 | Doctor Commands | /doctor deep-loop convergence gold-battery ≥3 iterations | [333](doctor_commands/doctor_deep_loop_convergence.md) | [.opencode/commands/doctor/speckit.md](../../../commands/doctor/speckit.md) |
| 338 | Doctor Commands | /doctor:update G5 failure injection mid-rebuild | [338](doctor_commands/doctor_update_G5_confirm_failure_injection.md) | [.opencode/commands/doctor/update.md](../../../commands/doctor/update.md) |
| 339 | Doctor Commands | /doctor:update G6 concurrent dispatch refusal via flock | [339](doctor_commands/doctor_update_G6_concurrent.md) | [.opencode/commands/doctor/update.md](../../../commands/doctor/update.md) |
| 340 | Doctor Commands | /doctor:update G7 SIGINT mid-rebuild + snapshot restore | [340](doctor_commands/doctor_update_G7_sigint.md) | [.opencode/commands/doctor/update.md](../../../commands/doctor/update.md) |
| 341 | Doctor Commands | /doctor:update G8 migration manifest gap detection | [341](doctor_commands/doctor_update_G8_migration_gap.md) | [.opencode/commands/doctor/update.md](../../../commands/doctor/update.md) |
| 342 | Doctor Commands | /doctor:update G9 cross-subsystem dashboard render | [342](doctor_commands/doctor_update_G9_dashboard.md) | [.opencode/commands/doctor/update.md](../../../commands/doctor/update.md) |
| 344 | Doctor Commands | /doctor:update tier-aware single interactive flow | [344](doctor_commands/doctor_update_tier_aware_default.md) | [.opencode/commands/doctor/update.md](../../../commands/doctor/update.md) |
| 345 | Doctor Commands | Version migration 3.3.0.0 → 3.4.1.0 end-to-end | [345](doctor_commands/version_migration_3.3.0.0_to_3.4.1.0.md) | [migration-manifest.json](../../../specs/system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/009-phase-parent-lean-trio-documentation/004-legacy-phase-parent-migration/scratch/migration-manifest.json) |
| 346 | Doctor Commands | Version migration cleanup-legacy with per-file prompts | [346](doctor_commands/version_migration_cleanup_legacy.md) | [migration-manifest.json](../../../specs/system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/009-phase-parent-lean-trio-documentation/004-legacy-phase-parent-migration/scratch/migration-manifest.json) |
| 347 | Doctor Commands | Version migration no-op (already-current) | [347](doctor_commands/version_migration_no_op.md) | [migration-manifest.json](../../../specs/system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/009-phase-parent-lean-trio-documentation/004-legacy-phase-parent-migration/scratch/migration-manifest.json) |
| 416 | Memory Quality And Indexing | vec_memories KNN dual-write and factory shard fallback | [416](memory_quality_and_indexing/vec_memories_knn_and_factory_shard_fallback.md) | [memory_quality_and_indexing/vec_memories_knn_and_factory_shard_fallback.md](../feature_catalog/memory_quality_and_indexing/vec_memories_knn_and_factory_shard_fallback.md) |
| 417 | Memory Quality And Indexing | Constitutional sufficiency-gate exemption | [417](memory_quality_and_indexing/constitutional_sufficiency_gate_exemption.md) | [memory_quality_and_indexing/constitutional_sufficiency_gate_exemption.md](../feature_catalog/memory_quality_and_indexing/constitutional_sufficiency_gate_exemption.md) |
| 418 | Memory Quality And Indexing | Graph-metadata and lineage repair runner | [418](memory_quality_and_indexing/graph_metadata_and_lineage_repair_runner.md) | [memory_quality_and_indexing/graph_metadata_and_lineage_repair_runner.md](../feature_catalog/memory_quality_and_indexing/graph_metadata_and_lineage_repair_runner.md) |
| 419 | Features | Orphan MCP runtime lifecycle guardrails | [419](tooling_and_scripts/orphan_mcp_runtime_lifecycle_guardrails.md) | [tooling_and_scripts/orphan_mcp_sweeper_and_launchagent_template.md](../feature_catalog/tooling_and_scripts/orphan_mcp_sweeper_and_launchagent_template.md), [feature_flag_reference/launcher_idle_timeout.md](../feature_catalog/feature_flag_reference/launcher_idle_timeout.md) |
| 420 | Tooling And Scripts | Markdown link integrity guard | [420](tooling_and_scripts/markdown_link_integrity_guard.md) | [tooling_and_scripts/markdown_link_integrity_guard.md](../feature_catalog/tooling_and_scripts/markdown_link_integrity_guard.md) |
| 421 | Pipeline Architecture | MCP launcher owner-disposal relaunch gate | [421](pipeline_architecture/mcp_launcher_owner_disposal_relaunch_gate.md) | [pipeline_architecture/mcp_launcher_owner_disposal_relaunch_gate.md](../feature_catalog/pipeline_architecture/mcp_launcher_owner_disposal_relaunch_gate.md) |
| 422 | Pipeline Architecture | MCP launcher persistent log | [422](pipeline_architecture/mcp_launcher_persistent_log.md) | [pipeline_architecture/mcp_launcher_persistent_log.md](../feature_catalog/pipeline_architecture/mcp_launcher_persistent_log.md) |
| 423 | Pipeline Architecture | Lease-probe retry reap hardening | [423](pipeline_architecture/lease_probe_retry_reap_hardening.md) | [pipeline_architecture/lease_probe_retry_reap_hardening.md](../feature_catalog/pipeline_architecture/lease_probe_retry_reap_hardening.md) |
| 424 | Pipeline Architecture | MCP code-index reconnecting proxy | [424](pipeline_architecture/mcp_code_index_reconnecting_proxy.md) | [pipeline_architecture/mcp_code_index_reconnecting_proxy.md](../feature_catalog/pipeline_architecture/mcp_code_index_reconnecting_proxy.md) |
| 425 | Tooling And Scripts | Orphan-sweep Stop-hook activation | [425](tooling_and_scripts/orphan_sweep_stop_hook_activation.md) | [tooling_and_scripts/orphan_sweep_stop_hook_activation.md](../feature_catalog/tooling_and_scripts/orphan_sweep_stop_hook_activation.md) |
| 426 | Pipeline Architecture | Daemon ownership re-election (default-on, reap-before-respawn, live two-session validation) | [426](pipeline_architecture/daemon_ownership_reelection.md) | [pipeline_architecture/daemon_ownership_reelection.md](../feature_catalog/pipeline_architecture/daemon_ownership_reelection.md) |
| 427 | Tooling And Scripts | CLI list-tools parity per system (spec-memory 39 / code-index 8 / skill-advisor 9) | [427](tooling_and_scripts/cli_list_tools_parity.md) | [tooling_and_scripts/spec_memory_cli_daemon_backed_surface.md](../feature_catalog/tooling_and_scripts/spec_memory_cli_daemon_backed_surface.md) |
| 428 | Tooling And Scripts | CLI warm-only no-spawn behavior (exit 75) | [428](tooling_and_scripts/cli_warm_only_no_spawn.md) | [tooling_and_scripts/spec_memory_cli_daemon_backed_surface.md](../feature_catalog/tooling_and_scripts/spec_memory_cli_daemon_backed_surface.md) |
| 429 | Tooling And Scripts | CLI dist-freshness guard trip (exit 69, dev overrides) | [429](tooling_and_scripts/cli_dist_freshness_guard.md) | [tooling_and_scripts/spec_memory_cli_daemon_backed_surface.md](../feature_catalog/tooling_and_scripts/spec_memory_cli_daemon_backed_surface.md) |
| 430 | Tooling And Scripts | code-index CLI blocked-read rendering (exit 0, requiredAction surfaced) | [430](tooling_and_scripts/cli_blocked_read_rendering.md) | [mcp-tool-surface/code-index-cli.md](../../system-code-graph/feature_catalog/mcp_tool_surface/code_index_cli.md) |
| 431 | Tooling And Scripts | skill-advisor CLI trusted-gate refusal (exit 64, fail-closed) | [431](tooling_and_scripts/cli_trusted_gate_refusal.md) | [mcp-surface/skill-advisor-cli.md](../../system-skill-advisor/feature_catalog/mcp_surface/skill_advisor_cli.md) |
| 432 | Pipeline Architecture | Tri-daemon spawn drill invocation (028 program gate, SPECKIT_RUN_TRI_DAEMON_DRILL=1) | [432](pipeline_architecture/tri_daemon_spawn_drill.md) | [tooling_and_scripts/spec_memory_cli_daemon_backed_surface.md](../feature_catalog/tooling_and_scripts/spec_memory_cli_daemon_backed_surface.md) |
| 433 | UX Hooks | CLI hook transport-down fail-open (warm-only, no prompt-time spawn) | [433](ux_hooks/cli_hook_transport_down_fail_open.md) | [tooling_and_scripts/cli_runtime_warm_only_fallbacks.md](../feature_catalog/tooling_and_scripts/cli_runtime_warm_only_fallbacks.md) |
| 434 | Tooling And Scripts | 028 CLI stress: concurrent dual-CLI+MCP load | [434](tooling_and_scripts/cli_stress_concurrent_dual_client_load.md) | [tooling_and_scripts/spec_memory_cli_daemon_backed_surface.md](../feature_catalog/tooling_and_scripts/spec_memory_cli_daemon_backed_surface.md) |
| 435 | Tooling And Scripts | 028 CLI stress: repeated warm-only probes under daemon churn | [435](tooling_and_scripts/cli_stress_warm_only_probe_churn.md) | [tooling_and_scripts/spec_memory_cli_daemon_backed_surface.md](../feature_catalog/tooling_and_scripts/spec_memory_cli_daemon_backed_surface.md) |
| 436 | Tooling And Scripts | 028 CLI stress: large-payload (>64KB) pipe integrity | [436](tooling_and_scripts/cli_stress_large_payload_pipe_integrity.md) | [tooling_and_scripts/spec_memory_cli_daemon_backed_surface.md](../feature_catalog/tooling_and_scripts/spec_memory_cli_daemon_backed_surface.md) |
| 437 | Tooling And Scripts | 028 CLI stress: numeric-coercion edge args | [437](tooling_and_scripts/cli_stress_numeric_coercion_edge_args.md) | [mcp-tool-surface/code-index-cli.md](../../system-code-graph/feature_catalog/mcp_tool_surface/code_index_cli.md) |
| 438 | Tooling And Scripts | 028 CLI stress: trust-gate fuzz (untrusted mutations all exit 64) | [438](tooling_and_scripts/cli_stress_trust_gate_fuzz.md) | [mcp-surface/skill-advisor-cli.md](../../system-skill-advisor/feature_catalog/mcp_surface/skill_advisor_cli.md) |
| 439 | Feature Flag Reference | Semantic trigger shadow and union modes | [439](feature_flag_reference/semantic_trigger_shadow_and_union.md) | *(release-hardening playbook scenario; feature-catalog sibling lane owns catalog entry)* |
| 440 | Feature Flag Reference | Memory idempotency replay and conflict | [440](feature_flag_reference/memory_idempotency_replay_and_conflict.md) | *(release-hardening playbook scenario; feature-catalog sibling lane owns catalog entry)* |
| 441 | Feature Flag Reference | Soft-delete tombstones | [441](feature_flag_reference/soft_delete_tombstones.md) | *(release-hardening playbook scenario; feature-catalog sibling lane owns catalog entry)* |
| 442 | Feature Flag Reference | Session-trace causal inference | [442](feature_flag_reference/session_trace_causal_inference.md) | *(release-hardening playbook scenario; feature-catalog sibling lane owns catalog entry)* |
| 443 | Feature Flag Reference | Feedback retention learning modes | [443](feature_flag_reference/feedback_retention_learning_modes.md) | *(release-hardening playbook scenario; feature-catalog sibling lane owns catalog entry)* |
| 444 | Feature Flag Reference | Authored continuity snapshot | [444](feature_flag_reference/authored_continuity_snapshot.md) | *(release-hardening playbook scenario; feature-catalog sibling lane owns catalog entry)* |
| 445 | Feature Flag Reference | Completion freshness validator | [445](feature_flag_reference/completion_freshness_validator.md) | *(release-hardening playbook scenario; feature-catalog sibling lane owns catalog entry)* |
| 446 | Retrieval Enhancements | Retrieval observability trace and health | [446](retrieval_enhancements/retrieval_observability_trace_and_health.md) | *(release-hardening playbook scenario; feature-catalog sibling lane owns catalog entry)* |
| 447 | Governance | Source kind provenance guard | [447](governance/source_kind_provenance_guard.md) | *(release-hardening playbook scenario; feature-catalog sibling lane owns catalog entry)* |
| 448 | Governance | Stale-exclusion audit and tool-ownership lint | [448](governance/stale_exclusion_audit_and_tool_ownership_lint.md) | *(release-hardening playbook scenario; feature-catalog sibling lane owns catalog entry)* |
| 449 | Tooling And Scripts | CLI compact list-tools and completion generation | [449](tooling_and_scripts/cli_compact_and_completion.md) | [tooling_and_scripts/spec_memory_cli_daemon_backed_surface.md](../feature_catalog/tooling_and_scripts/spec_memory_cli_daemon_backed_surface.md) |
| 450 | Bug Fixes And Data Integrity | Graceful embedder-degrade to lexical | [450](bug_fixes_and_data_integrity/graceful_embedder_degrade_to_lexical.md) | [bug_fixes_and_data_integrity/graceful_embedder_degrade_to_lexical.md](../feature_catalog/bug_fixes_and_data_integrity/graceful_embedder_degrade_to_lexical.md) |
| 451 | Governance | Constitutional self-edit and compare-and-swap guard | [451](governance/constitutional_self_edit_and_cas_guard.md) | [governance/constitutional_self_edit_and_cas_guard.md](../feature_catalog/governance/constitutional_self_edit_and_cas_guard.md) |
| 452 | Memory Quality And Indexing | Background enrichment pending and failed gauges | [452](memory_quality_and_indexing/background_enrichment_pending_and_failed_gauges.md) | [memory_quality_and_indexing/background_enrichment_pending_and_failed_gauges.md](../feature_catalog/memory_quality_and_indexing/background_enrichment_pending_and_failed_gauges.md) |
| 453 | Lifecycle | Speckit autopilot lifecycle | [453](lifecycle/speckit_autopilot_lifecycle.md) | [lifecycle/speckit_autopilot_lifecycle.md](../feature_catalog/lifecycle/speckit_autopilot_lifecycle.md) |
| 454 | UX Hooks | Goal OpenCode plugin active-goal injection and status | [454](ux_hooks/goal_opencode_plugin.md) | [ux_hooks/goal_opencode_plugin.md](../feature_catalog/ux_hooks/goal_opencode_plugin.md) |
| 455 | Tooling And Scripts | validate.sh dist-freshness backstop (compiled validation orchestrator, exit 3) | [455](tooling_and_scripts/validate_sh_dist_freshness_backstop.md) | [tooling_and_scripts/dist_freshness_enforcement.md](../feature_catalog/tooling_and_scripts/dist_freshness_enforcement.md) |
