---
title: "Plan: 022/011 Arc Follow-Ons"
description: "Multi-step bundle: MCP recovery + validator fix + opencode idle-kill + RERANKER fill."
trigger_phrases: ["022/011 plan"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/011-arc-022-followons"
    last_updated_at: "2026-05-23T18:30:00Z"
    last_updated_by: "main_agent"
    recent_action: "Plan post-execution"
    next_safe_action: "n/a"
    blockers: []
    key_files: ["spec.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000002b12"
      session_id: "016-002-022-011-plan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: ["Sequenced 5-step plan executed in order"]
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- REVERTED: Step 3 opencode-persistent wrapper REVERTED 2026-05-23 same-day per operator directive. See implementation-summary.md §6. References below to Step 3 reflect ORIGINAL plan; treat as historical work-of-record. -->

# Plan: 022/011 Arc Follow-Ons

<!-- ANCHOR:summary -->
## 1. SUMMARY
### Technical Context
4 active debts surfaced post-022 arc convergence: MCP -32000, validator false-positives, opencode idle-kills, voyage/cohere reranker placeholders.
### Overview
Sequenced steps 1-5 + skip Step 4b (structural, deferred).
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
### Definition of Ready
- All 3 diagnoses from Explore agents complete
- Plan reviewed + approved via ExitPlanMode
### Definition of Done
- R1–R9 from spec.md §4 pass
- Strict-validate exit 0
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
### Pattern
Direct fixes per-debt; mixed executor (main-agent + cli-codex gpt-5.5 high fast for the wrapper script).
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
### Step 1 — MCP recovery (~5 min main-agent Bash)
Kill orphans + clear stale lease/socket/WAL + npm run build + manual JSON copy. No source edits.
### Step 2 — Validator 6-bug fix (~30 min main-agent Edit)
6 line-edits in validate-doc-model-refs.js. Iterative — initial 4 fixes per Explore diagnosis, then 2 deeper bugs (path resolution, wrapper-prefix normalization) found during verification.
### Step 3 — opencode idle-kill mitigation (~20 min cli-codex)
Dispatched cli-codex gpt-5.5 high fast to write `.opencode/bin/opencode-persistent` wrapper + update cli-opencode SKILL.md rule 5. Main-agent wrote memory file (workspace-write sandbox limitation).
### Step 4a — RERANKER fill (~5 min main-agent Edit)
voyage: 'rerank-2.5', cohere: 'rerank-v3.5' + TODO for bench-validation.
### Step 4b/c/d — Deferred
- 4b LANE_WEIGHTS_JSON: ~90 min structural; needs bench-diff
- 4c ENV_REFERENCE consistency: review-only, deferred
- 4d pre-commit hook: blocked on validator llama-cpp canonical-source addition
### Step 5 — This packet
spec/plan/tasks/checklist/implementation-summary + description + graph-metadata.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
- MCP: launcher probe (manual)
- Validator: `node validate-doc-model-refs.js; echo $?` shape verification
- opencode-persistent: `--detect` smoke + `--help` syntax check + `bash -n` exit 0
- RERANKER fill: typecheck:root exit 0
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
- 022 arc 12/12 phases shipped (this packet is the 13th child)
- cli-codex (gpt-5.5 high fast) for Step 3
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
- MCP: re-delete the manually-copied JSON + rerun build. State self-heals on next dispatch.
- Validator: `git restore validate-doc-model-refs.js` reverts to broken canonical loader.
- opencode-persistent: `git rm .opencode/bin/opencode-persistent` + `git restore .opencode/skills/cli-opencode/SKILL.md` to revert.
- RERANKER fill: `git restore registry.ts` reverts to empty placeholders (preserving 005's TODO).
<!-- /ANCHOR:rollback -->

<!-- ANCHOR:phase-deps -->
## 8. PHASE DEPENDENCIES
13th + final child of 022 arc. Independent of any other in-flight work.
<!-- /ANCHOR:phase-deps -->

<!-- ANCHOR:effort -->
## 9. EFFORT ESTIMATE
| Step | Est | Actual |
|---|---|---|
| 1 MCP recovery | 5 min | ~5 min |
| 2 Validator fix | 30 min | ~45 min (deeper bugs surfaced) |
| 3 opencode mitigation | 20 min | ~15 min (cli-codex) |
| 4a RERANKER fill | 5 min | ~5 min |
| 5 Packet docs | 30 min | ~20 min |
| Total | 90 min | ~90 min |
<!-- /ANCHOR:effort -->

<!-- ANCHOR:enhanced-rollback -->
## 10. ENHANCED ROLLBACK
If voyage/cohere reranker names cause production fetch failures (vendor renamed them), revert registry.ts to empty placeholders + add observability for the getRerankerFallback call site.
<!-- /ANCHOR:enhanced-rollback -->
