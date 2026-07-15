---
title: "Spec: 020 Deep-review of 016-019 stack via cli-devin SWE 1.6"
description: "20-iteration spec_kit:deep-review run covering all code work in packets 016-019 plus dist-freshness vitest. Executor cli-devin SWE 1.6 with 3-check bundle gate. Synthesize P0/P1/P2 findings into review-report.md."
trigger_phrases:
  - "020 deep review 016-019 stack"
  - "deep review embedder + rescue + registry"
  - "cli-devin SWE 1.6 review run"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/005-cross-cutting-quality/002-deep-review-stack"
    last_updated_at: "2026-05-17T20:35:00Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffolded deep-review packet"
    next_safe_action: "Dispatch /deep:start-review-loop with iterations=20 + cli-devin SWE 1.6"
    blockers: []
    key_files:
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000020000"
      session_id: "020-deep-review-016-019-stack"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Spec: 020 Deep-review of 016-019 stack via cli-devin SWE 1.6

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| Status | Complete |
| Level | 1 |
| Owner | main agent |
| Iterations | 20 |
| Executor | cli-devin |
| Model | SWE 1.6 |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The 016-019 stack landed a lot of new code in a short window: pluggable embedder architecture (016), retrieval-rescue layer (016/004), dist-freshness vitest (post-016), CocoIndex jina-code swap + MPS auto-detect + registered_embedders + INSTALL_GUIDE updates (018 + 019). All have unit-level coverage and have been smoke-tested, but no adversarial deep-review has been run across the whole stack.

Purpose: catch P0/P1/P2 issues across the integrated surface via 20-iter adversarial review using cli-devin SWE 1.6.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope — code changes from packets 016, 016/004, 018, 019 + dist-freshness vitest:**

mk-spec-memory (TypeScript):
- `mcp_server/lib/embedders/**` (EmbedderAdapter interface, MANIFESTS, OllamaAdapter, LlamaCppBaselineAdapter, registry.ts, types.ts, schema.ts, reindex.ts, adapters/*)
- `mcp_server/lib/search/rerank/retrieval-rescue.ts` (rescue layer)
- `mcp_server/lib/search/pipeline/stage2-fusion.ts` (rescue wiring)
- `mcp_server/handlers/embedder-list.ts`, `embedder-set.ts`, `embedder-status.ts`
- `mcp_server/tests/dist-freshness.vitest.ts`

CocoIndex (Python):
- `mcp_server/cocoindex_code/config.py` (_DEFAULT_MODEL + _resolve_device)
- `mcp_server/cocoindex_code/registered_embedders.py` (registry module)
- `mcp_server/tests/test_config.py`, `tests/test_registered_embedders.py`
- `INSTALL_GUIDE.md` + `README.md` (embedder-onboarding docs)

**Out of scope:**
- 017 playbook scenarios (markdown content, already validated by B-RETRY commit `915fbb42e`)
- Pre-016 code (already reviewed in prior cycles)
- z_archive/* (frozen archive)
- node_modules/, .venv/, dist/ output
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| # | Requirement |
|---|---|
| R1 | Run /deep:start-review-loop with iterations=20 |
| R2 | Executor = cli-devin, model = swe-1.6 |
| R3 | Per-iteration output passes 3-check bundle gate (imports grep + exports grep + validation_commands smoke-run) per memory note feedback_bundle_gate_smoke_run |
| R4 | Findings classified P0 / P1 / P2 with file:line citations + concrete repro steps |
| R5 | Convergence detection: iterations stop if 3 consecutive iterations produce no new P0/P1 findings |
| R6 | Final `evidence/review-report.md` synthesizes findings + recommends remediation packets |
| R7 | Memory note created ratifying review verdict |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- 20 iterations complete OR converges early (R5)
- review-report.md committed with cited findings
- P0 findings (if any) → immediate remediation packet scaffolded
- P1 findings → batched remediation packet for next cycle
- P2 findings → backlog with annotation
- Strict-validate PASSED
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

Risks:
- **cli-devin SWE 1.6 hallucination** (memory note feedback_cli_devin_bundle_verification): bundles can name non-existent CLI flags or hallucinated import paths. 3-check gate per R3 catches this.
- **Wrong-cwd path defects** (memory note feedback_bundle_gate_smoke_run): grep alone misses these; validation_commands smoke-run is the catch.
- **Scope creep**: model may pull in adjacent files that aren't in this packet's scope. Mitigation: scope.md explicit allowlist.
- **Daemon contention**: if CocoIndex reindex still running, review tools that read code may hit slowness. Mitigation: deep-review reads source files directly, not via daemon, so this is decoupled.

Dependencies:
- /deep:start-review-loop skill (already installed)
- cli-devin executor (already installed)
- SWE 1.6 model availability (verify via cli-devin --list-models)
- The code under review must all be committed (no WIP — verified via git status before dispatch)
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- If review surfaces P0 in 016/004's retrieval-rescue layer (which is now load-bearing for cat-24/409 closure), how aggressive should rollback be? Defer to verdict-time decision.
- Whether to chain 020's findings into automatic remediation dispatch (cli-codex) vs operator-driven. Default = operator-driven for safety.
<!-- /ANCHOR:questions -->


## Dispatch A evidence

Review artifacts exist under `review/`; parent `005-cross-cutting-quality` treats this child as shipped. Task evidence cells were reconciled in this cleanup pass.
