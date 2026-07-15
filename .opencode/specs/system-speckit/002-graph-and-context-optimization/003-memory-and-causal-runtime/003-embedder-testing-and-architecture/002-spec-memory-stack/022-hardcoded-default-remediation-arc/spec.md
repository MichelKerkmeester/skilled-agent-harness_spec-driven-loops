---
title: "Spec: 016/002/022 Hardcoded-Default Remediation Arc — phase parent closing every audit finding from packet 021"
description: "Phase parent unifying 10 child remediation phases that fix all 94 hardcoded-default findings (23 P0 + 33 P1 + 38 P2) surfaced by the packet 021 deep-research audit. Multi-executor: cli-devin SWE-1.6 for mechanical edits + cli-opencode/deepseek-v4-pro for multi-file refactors. Closes one CONFIRMED-ACTIVE bug (profile.ts:195 BAAI hf-local fallback), 14 skill-advisor production-path thresholds (0.8/0.35 inline in 6 files), 5 doc-drift sites in CocoIndex, and a structural gap (.codex/agents/ empty). Authors 4 ADRs that lock the governance gaps the audit surfaced."
trigger_phrases:
  - "hardcoded-default remediation arc"
  - "022 phase parent"
  - "skill-advisor threshold consolidation"
  - "profile.ts fallback fix"
  - "cocoindex doc drift resync"
  - "ADR governance for embedder + advisor"
  - "follow-on to 020 + 021"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc"
    last_updated_at: "2026-05-23T15:30:00Z"
    last_updated_by: "main_agent"
    recent_action: "Phase parent scaffolded; 10 child packets enumerated"
    next_safe_action: "Scaffold + dispatch phase 001 (profile.ts fallback fix via cli-devin)"
    blockers: []
    key_files:
      - "001-profile-ts-fallback-fix/spec.md"
      - "002-cocoindex-doc-drift-resync/spec.md"
      - "003-codex-agents-mirror-fill/spec.md"
      - "004-skill-advisor-threshold-consolidation/spec.md"
      - "010-adr-writing-and-doc-validator/decision-record.md"
    session_dedup:
      fingerprint: "sha256:00000000000000000000000000000000000000000000000000000000000022a0"
      session_id: "016-002-022-arc"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - ".codex/agents/ empty: intentional or mirror missed? (phase 003 pre-investigation)"
      - "SPECKIT_ADVISOR_* env-var naming alignment with existing ENV_REFERENCE.md (phase 004 wave 3)"
      - "ADR-013/014 amendment: in-place edit vs new ADR-015 supersession (phase 010, operator approval)"
      - "Bench-diff requirement for phases 004/005/007 (tuned-constant refactors)"
    answered_questions:
      - "Phase parent location: under 002-spec-memory-stack (sibling to 020 + 021)"
      - "Executor split: cli-devin SWE-1.6 for mechanical, cli-opencode deepseek-v4-pro for multi-file refactor (per-phase table)"
      - "Sequencing: one dispatch at a time per memory feedback_deep_loop_iter_one_at_a_time + cli-X SKILL §4 ALWAYS #14"
      - "P2 inclusion: bundled into matching subsystem packets where they share files"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - heavy docs: plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
    - merge/migration narratives beyond the source-map below
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Spec: 016/002/022 Hardcoded-Default Remediation Arc

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| Status | In Progress (parent scaffolded; children 001-010 pending) |
| Type | Phase parent — multi-child remediation arc |
| Owner | Main agent orchestrator; cli-devin + cli-opencode per-phase executors |
| Parent | `../spec.md` (002-spec-memory-stack) |
| Predecessor | 020-embedder-default-drift-fix (partial fix that the audit found incomplete) + 021-hardcoded-default-audit-deep-research (audit packet) |
| Successor | None planned — drift becomes structurally impossible after the 4 ADRs + invariant tests lock the contract |
| Triggered by | 2026-05-23 deep-research audit (packet 021) surfacing 1 CONFIRMED-ACTIVE bug + 22 latent + 38 cosmetic findings |
| Estimated wall-clock | ~17 hr orchestrated across 10 phases |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The deep-research audit (packet 021) found **94 hardcoded-default findings** that survived packet 020's `getCanonicalFallback()` migration. Critically:

- **1 P0 CONFIRMED ACTIVE**: `profile.ts:195` returns `'BAAI/bge-base-en-v1.5'` as the hf-local fallback in common no-config scenarios. CLI scripts (checkpoint, ablation, eval) have been writing vector tables for the BAAI model even though the spec-memory daemon switched to nomic on 2026-05-19 (ADR-014).
- **14 P0 in skill-advisor**: `0.8` confidence and `0.35` uncertainty thresholds appear inline in **6 separate production files** (`fusion.ts`, `lanes/calibration.ts`, `routing/routing-decision.ts`, `prompt-cache.ts`, `subprocess.ts`, `render.ts`). The typed `SKILL_ADVISOR_COMPAT_CONTRACT` is declared but only test files import it.
- **5 P0 doc-drift in CocoIndex docs**: `config_templates.md`, `CFG-007-reranker-opt-in.md`, `manual_testing_playbook.md`, `benchmarks/README.md`, `embedder-pluggability.md` all cite stale model names (`embeddinggemma-300m`, `BAAI/bge-reranker-v2-m3`, `jina-v2-base-code`) that contradict the actual shipped defaults.
- **1 P0 structural**: `.codex/agents/` directory is empty — the Codex runtime mirror has zero agent definitions.

Plus 33 P1 latent-drift sites + 38 P2 cosmetic findings.

The audit also surfaced 4 ADR gaps: no ADR governs skill-advisor thresholds, ADR-013/014 never enumerated `profile.ts` (root cause of packet 020 miss), no ADR governs cascade-probe magic numbers, no ADR mandates doc-implementation cross-checking.

### Purpose

Ship a **10-phase remediation arc** that closes every audit finding and authors the 4 missing ADRs. Each phase scopes one subsystem or finding cluster with explicit executor + framework selection. Per-phase boundaries protect neighbors against dispatch failures. Cross-phase invariants enforced by the parent verification gate ensure registry-derived patterns become the global rule going forward.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, decisions, and implementation summaries live in the 10 child phase folders.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- **10 child phases** under `022-hardcoded-default-remediation-arc/` (001 through 010)
- All 23 P0 + 33 P1 + 38 P2 findings from packet 021's `research/research.md`
- 4 new ADRs (3 in phase 010's decision-record.md + 1 amendment to `004-spec-memory-embedder-bake-off/decision-record.md`)
- New invariant test files: `profile.test.ts`, `scorer-threshold-invariants.test.ts`, `routing-calibration-completeness.test.ts`, `calibration-override.test.ts`, `auto-select.test.ts`, `cascade-probe-config.test.ts`, `config-defaults.test.ts`, `no-duplicate-defaults.test.ts`, `test_chunk_size_consistency.py`, `test_rerank_via_sidecar_single_source.py`, `test_sidecar_config_single_source.py`
- New API surface: `RERANKER_CANONICAL` + `getRerankerFallback(provider)` in `registry.ts`; `CascadeProbeConfig` in `auto-select.ts`; `config-defaults.ts` in code-graph; `sidecar-config.sh` in rerank-sidecar
- Validator script: `validate-doc-model-refs.js` (phase 010)

### Out of Scope

- Reimplementing the embedder provider abstraction (preserves ADR-014 design)
- Touching CocoIndex Python code beyond the 2 P1 dedup sites (different code path, healthy)
- Backfilling memory entries that cite old defaults (historical artifacts)
- CI integration of the new sk-doc validator (phase 010 ships script + 1-shot; CI wiring deferred)
- Renumbering 020 or 021 or any prior packet
- Fixing memory-graph or causal-coverage advisories from earlier session (separate concern)

### Files Changed (cumulative across all 10 phases)

| File path pattern | Change | Phase |
|---|---|---|
| `022-hardcoded-default-remediation-arc/{spec,description,graph-metadata}` | Create | Setup |
| `022-.../001-profile-ts-fallback-fix/**` | Create | 001 |
| `shared/embeddings/profile.ts:188-200` | Modify | 001 |
| `shared/embeddings.ts:774` | Modify (delete dead code) | 001 |
| `shared/embeddings/profile.test.ts` | Create | 001 |
| `022-.../002-cocoindex-doc-drift-resync/**` | Create | 002 |
| `mcp-coco-index/{config_templates,CFG-007,manual_testing_playbook,benchmarks/README,embedder-pluggability}.md` | Modify | 002 |
| `022-.../003-codex-agents-mirror-fill/**` | Create | 003 |
| `.codex/agents/*.toml` | Create (12+ files) | 003 |
| `.opencode/agents/deep-{research,review}.md` | Modify (qualifier removal) | 003 |
| `022-.../004-skill-advisor-threshold-consolidation/**` | Create | 004 |
| `system-skill-advisor/mcp_server/lib/scorer/**` + `routing/**` + `policy/**` + `prompt-cache.ts` + `subprocess.ts` | Modify (6+ files, 4-wave refactor) | 004 |
| `system-skill-advisor/mcp_server/tests/scorer-threshold-invariants.vitest.ts` + 2 sibling tests | Create | 004 |
| `022-.../005-spec-memory-p1-registry-consolidation/**` | Create | 005 |
| `shared/embeddings/{registry.ts,auto-select.ts,providers/openai.ts,providers/voyage.ts}` + `mcp_server/lib/search/cross-encoder.ts` | Modify | 005 |
| `shared/embeddings/{registry,auto-select}.test.ts` | Extend/Create | 005 |
| `022-.../006-cocoindex-p1-dedup/**` | Create | 006 |
| `mcp-coco-index/mcp_server/cocoindex_code/{indexer/indexer,reranker,settings,embedders/rerankers_jina_v3}.py` | Modify | 006 |
| `022-.../007-code-graph-p1-config-extraction/**` | Create | 007 |
| `system-code-graph/mcp_server/lib/config-defaults.ts` | Create | 007 |
| `system-code-graph/mcp_server/lib/{index,owner-lease}.ts` + 4 callers | Modify | 007 |
| `022-.../008-rerank-sidecar-p1-dedup/**` | Create | 008 |
| `system-rerank-sidecar/scripts/sidecar-config.sh` | Create | 008 |
| `system-rerank-sidecar/{start.sh,ensure-rerank-sidecar.cjs,<python-app>}` | Modify | 008 |
| `022-.../009-cascade-thresholds-env-driven/**` | Create | 009 |
| `shared/embeddings/auto-select.ts:99-130` | Modify | 009 |
| `shared/embeddings/cascade-probe-config.test.ts` | Create | 009 |
| `mcp_server/ENV_REFERENCE.md` | Modify | 009 + 010 |
| `022-.../010-adr-writing-and-doc-validator/**` | Create | 010 |
| `010-.../decision-record.md` | Create (3 ADRs + ADR amendment reference) | 010 |
| `004-spec-memory-embedder-bake-off/decision-record.md` | Modify (ADR-013/014 amendment — operator-approved) | 010 |
| `sk-doc/scripts/validate-doc-model-refs.js` | Create | 010 |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| # | Requirement |
|---|---|
| R1 | Each of the 10 child phases ships as a strict-validating Level 2 packet under `022-hardcoded-default-remediation-arc/` |
| R2 | All 23 P0 audit findings have a corresponding `Resolves:` reference in one of the 10 child phases' `implementation-summary.md` |
| R3 | All 33 P1 audit findings have a corresponding fix or explicit deferral with rationale |
| R4 | All 38 P2 findings are either fixed (bundled with matching subsystem) or documented in the parent spec.md as deferred |
| R5 | 11 new test files authored across phases 001-009; all pass before phase ships |
| R6 | 4 ADRs authored in phase 010 (3 net-new + 1 amendment to ADR-013/014 with operator approval) |
| R7 | `validate-doc-model-refs.js` ships in phase 010 and reports 0 drift on the post-arc codebase |
| R8 | Cross-phase invariants (6 items, see §10) all pass on arc convergence |
| R9 | `npm run typecheck:root` exits 0 after every phase + at arc completion |
| R10 | `bash validate.sh 022-hardcoded-default-remediation-arc --strict --recursive` exits 0 at convergence |
| R11 | Sequencing: one cli-X dispatch active at a time per memory `feedback_deep_loop_iter_one_at_a_time.md` |
| R12 | Each cli-X prompt composed via sk-prompt framework per the executor table (RCAF/CRAFT/TIDD-EC); CLEAR ≥ 40/50 before dispatch |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- All R1–R12 satisfied.
- Re-grep of every audit pattern across `.opencode/skills/` returns 0 hits outside `changelog/`, `scratch/`, and `research/iterations/`.
- Re-running packet 021's audit (or a follow-on 10-iter loop) finds 0 new P0/P1 — only P2 cosmetic patterns remain.
- The 4 ADRs make future drift structurally impossible: any new model swap or threshold tune ships with explicit ADR text and matching invariant test.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:approach -->
## 6. APPROACH

10 child phases, sequential execution, executor-per-phase mapping. Each phase ships in 4 stages:

1. **Scaffold** (main agent, ~5 min): mkdir, copy canonical templates from `015-cascade-reorder-and-nomic-hf-local-default/`, author spec.md anchors + requirements + success criteria.
2. **Dispatch** (cli-X executor, 30 min – 3 hr): main agent reads `cli-<executor>/SKILL.md`, runs sequential_thinking ≥ 5 thoughts (for SWE-1.6), composes prompt via sk-prompt with CLEAR ≥ 40/50, writes to `/tmp/<phase>-prompt.md`, dispatches in background.
3. **Ingest** (main agent, ~10 min): wait for completion notification, verify `git diff --stat`, run verification gate (typecheck + vitest + ban-list grep + strict-validate).
4. **Finalize** (main agent, ~10 min): author post-execution narrative — plan.md, tasks.md, checklist.md, implementation-summary.md per canonical Level 2 templates.

After all 10 phases ship: arc convergence (~30 min) runs 6 cross-phase invariant checks, MCP reindex (memory/skill/code graph), updates parent spec.md status table, and writes one-line MEMORY.md arc entry.

See `.claude/plans/turn-these-spec-folders-shimmying-lagoon.md` (current session plan) for full per-phase detail including dispatch-prompt skeletons and verification gates.
<!-- /ANCHOR:approach -->

<!-- ANCHOR:risks -->
## 7. RISKS & DEPENDENCIES

Risks:
- **Skill-advisor recalibration drift** (phase 004): wave 3 changes effective behavior if any caller passed env vars matching the inline fallback. Mitigation: ban-list test asserts canonical 0.8/0.35 stay default; env-var overrides explicitly documented.
- **cli-X dispatch failures mid-arc**: per memory `feedback_cli_dispatch_unreliability.md`, parallelism > 3 risks silent reverts. Strict single-dispatch mitigates. Phase boundaries protect neighbors.
- **opencode-go credit exhaustion** mid-arc: phases 004/005/007 use cli-opencode + deepseek-v4-pro. Pre-check `opencode providers list` before each dispatch. Fallback: cli-devin --model deepseek-v4-pro (DeepSeek API direct).
- **.codex/agents/ design ambiguity** (phase 003): empty dir may be intentional. Phase 003 pre-investigation resolves before dispatch.
- **ADR-013/014 amendment scope** (phase 010): editing a SHIPPED ADR. Operator approval required before phase 010 dispatch.

Dependencies:
- Packet 020 shipped → `getCanonicalFallback()` exists in registry.ts (phases 001 + 005 reuse).
- Packet 021 shipped → `research/research.md` synthesis drives per-phase finding references.
- ADR-013 + ADR-014 (in `004-spec-memory-embedder-bake-off/decision-record.md`) — ground truth for cleanup direction.
- `SKILL_ADVISOR_COMPAT_CONTRACT` exists in `system-skill-advisor/.../policy/contract.ts:10-11` (declared but unused; phase 004 wires it).
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 8. OPEN QUESTIONS

See frontmatter `open_questions` — 4 pre-execution unknowns that resolve during phase setup:

1. `.codex/agents/` intent → phase 003 pre-investigation
2. `SPECKIT_ADVISOR_*` env-var naming → phase 004 wave 3 setup
3. ADR-013/014 amendment shape → phase 010 setup with operator approval
4. Bench-diff requirement for tuned-constant refactors → phase 004/005/007 plan.md

None blocks arc start.
<!-- /ANCHOR:questions -->

<!-- ANCHOR:nfr -->
## 9. NON-FUNCTIONAL REQUIREMENTS

- **Latency**: ~17 hr total wall-clock across 10 phases; achievable in 2-3 working sessions.
- **Cost**: cli-opencode + deepseek-v4-pro ~$0.10–$0.30/dispatch × 3 phases ~ $1–3. cli-devin SWE-1.6 negligible (small model).
- **Reliability**: each phase is independently rollback-able via `git restore` + `git rm`. No DB/state mutation outside the spec folder until phase 010 reindex.
- **Observability**: each phase produces `iterations/iter-NNN.md`-equivalent narrative in `implementation-summary.md`; `git diff --stat` per phase surfaces blast radius.
- **Sequencing discipline**: one dispatch at a time; no parallel cli-X calls per memory operational guidance.
<!-- /ANCHOR:nfr -->

<!-- ANCHOR:edge-cases -->
## 10. EDGE CASES + Cross-phase invariants

Cross-phase invariants enforced at arc convergence:

1. **Registry is single source of truth**: no inline `BAAI/bge-base-en-v1.5`, `jina-embeddings-v3`, `embeddinggemma-300m`, `BAAI/bge-reranker-v2-m3`, `jina-v2-base-code`, `ms-marco-MiniLM-L-6-v2` outside `changelog/`/`scratch/`/`research/iterations/`.
2. **Skill-advisor thresholds**: every `0.8`/`0.35` literal in production paths replaced by import from `SKILL_ADVISOR_COMPAT_CONTRACT`. Verified by `scorer-threshold-invariants.test.ts`.
3. **Frozen constants documented**: every audited P0/P1 constant has either env-var override OR explicit Shape-B comment.
4. **Doc-implementation parity**: `validate-doc-model-refs.js` returns 0 drift.
5. **4-runtime mirror parity**: `.opencode/.claude/.codex/.gemini/agents/` match (or `.codex/` documented as intentionally empty).
6. **Audit synthesis closure**: every P0+P1 finding has a `Resolves:` reference in a child phase's `implementation-summary.md`.

Edge cases:
- Mid-arc cli-X failure → `git restore` + redispatch; phase boundary protects neighbors.
- Bench-diff regression on phase 004/005/007 → halt arc, escalate to operator.
- ADR-B operator denial → phase 010 ships ADR-A/C/D + skips ADR-B; document deferral.
<!-- /ANCHOR:edge-cases -->

<!-- ANCHOR:complexity -->
## 11. COMPLEXITY

| Dimension | Score | Justification |
|---|---|---|
| LOC changed | High (~600-1000 LOC across 10 phases + 11 new test files + 4 ADRs) | Multi-subsystem refactor |
| Files touched | ~40 modified + ~25 created across 10 phases | Bounded by per-phase scope |
| Behavior risk | Medium (phase 004 + 005 + 007 touch tuned constants) | Bench-diff mitigates |
| Architectural risk | Low (preserves ADR-013/014/015 design; only closes gaps) | Builds on packet 020 helper |
| Operator-approval gates | 1 (ADR-013/014 amendment in phase 010) | Single approval point |
| Total complexity | **Medium-High** | Bounded by per-phase verification gates + invariant tests |
<!-- /ANCHOR:complexity -->

<!-- ANCHOR:cross-links -->
## 12. CROSS-LINKS

- **Predecessor**: `../020-embedder-default-drift-fix/` (the partial fix that triggered the audit)
- **Audit packet**: `../021-hardcoded-default-audit-deep-research/research/research.md` (drives per-finding remediation)
- **ADR origin**: `../004-spec-memory-embedder-bake-off/decision-record.md` (ADR-001..ADR-013)
- **ADR-014 packet**: `../015-cascade-reorder-and-nomic-hf-local-default/` (canonical Level 2 template source)
- **Sibling arc**: `skilled-agent-orchestration/116-deep-skill-evolution/` (the 17→6 nested consolidation; same multi-phase pattern)
- **Plan file**: `~/.claude/plans/turn-these-spec-folders-shimmying-lagoon.md` (current session full-detail plan)
- **Executor SKILL.md**: `.opencode/skills/cli-devin/SKILL.md`, `.opencode/skills/cli-opencode/SKILL.md`, `.opencode/skills/sk-prompt/SKILL.md`
- **Helper reused**: `.opencode/skills/system-spec-kit/shared/embeddings/registry.ts` (`getCanonicalFallback`)
- **Test convention**: `.opencode/skills/system-spec-kit/shared/predicates/boolean-expr.test.ts` (standalone assertions for `shared/`)
<!-- /ANCHOR:cross-links -->

---

## PHASE DOCUMENTATION MAP

| Phase | Folder | Focus | Executor | Findings | Status |
|-------|--------|-------|----------|----------|--------|
| 001 | `001-profile-ts-fallback-fix/` | profile.ts inline `\|\|` fallbacks (BAAI + jina) + embeddings.ts:774 dead code | main-agent direct | 3 P0 closed | **Shipped 2026-05-23** |
| 002 | `002-cocoindex-embedder-doc-drift-resync/` | embedder-side doc-drift: config_templates _NOTE_2 x3 + embedder-pluggability + ENV_REFERENCE date + SKILL.md keywords | main-agent direct | 2 P0 + 1 P1 + 1 P2 closed (embedder side); reranker side split to 002b | **Shipped 2026-05-23** |
| 002b | `002b-cocoindex-reranker-doc-prose/` | Reranker prose corrections: 007-reranker-opt-in.md (121-line CFG-007) + manual_testing_playbook.md + benchmarks/README.md — BAAI/bge-reranker-v2-m3 → Qwen/Qwen3-Reranker-0.6B with size + daemon-log silent-success corrections | main-agent direct | 4 P0 closed | **Shipped 2026-05-23** |
| 003 | `003-codex-agents-mirror-fill/` | Investigation: .codex/agents/ has 11 .toml (full mirror); `[agents.ai-council]` block declared at .codex/config.toml:139. P0 closed via investigation. 2 P1 `(proposed)` qualifier sites removed in .opencode/agents/. | main-agent direct | 1 P0 (already-closed) + 1 P1 (2 sites) | **Shipped 2026-05-23** |
| 004a | `004a-skill-advisor-compat-contract-consolidation/` | Wave 1 of 4-wave: 5 production-path inline 0.8/0.35 sites in skill-advisor wired to SKILL_ADVISOR_COMPAT_CONTRACT.defaults | main-agent direct | 14 P0 closed | **Shipped 2026-05-23** |
| 004b | `004b-skill-advisor-interface-and-env-vars/` | Waves 2-4 atomic dispatch: RoutingCalibration interface expansion + env-var overrides (3 SPECKIT_ADVISOR_* threshold env vars) + prompt-policy.default.json externalization (5 fire/no-fire env vars + SPECKIT_ADVISOR_PROMPT_POLICY_PATH). SPECKIT_ADVISOR_LANE_WEIGHTS_JSON skipped (lane-registry has no extension point — deferred). | cli-opencode + deepseek-v4-pro --variant high | 9 P1 + 2 P2 closed | **Shipped 2026-05-23** |
| 005 | `005-spec-memory-p1-registry-consolidation/` | 7 P1 cleanup: auto-select dupes, openai/voyage standalones, cross-encoder reranker. Extends registry.ts with RERANKER_CANONICAL + getRerankerFallback. | cli-opencode + deepseek-v4-pro --variant high | 7 P1 + 7 P2 | **In progress** (dispatched 2026-05-23 18:00) |
| 006 | `006-cocoindex-p1-dedup/` | 2 P1: indexer chunk-size dedup via config.py canonical import; COCOINDEX_RERANK_VIA_SIDECAR dual-default → _DEFAULT_RERANK_VIA_SIDECAR canonical. 3 P2 rebutted as over-flags. | main-agent direct | 2 P1 closed; 3 P2 rebutted | **Shipped 2026-05-23** |
| 007 | `007-code-graph-p1-config-extraction/` | New config-defaults.ts with env-var overrides for 6 P1 sites (DEFAULT_TTL_MS, DEFAULT_EDGE_WEIGHTS, DEFAULT_FLOORS, DEFAULT_QUARANTINE_AGE_DAYS, maxDepth, fatal-parse-ratio) | cli-opencode + deepseek-v4-pro --variant high | 6 P1 + 10 P2 | **Pending** (after 005) |
| 008 | `008-rerank-sidecar-p1-dedup/` | New scripts/sidecar_defaults.py canonical (PORT=8765, MODEL_NAME=Qwen3-Reranker-0.6B, MODEL_REVISION=e61197...) + lazy Python imports + cross-language sync comments for bash + cjs launchers. | main-agent direct | 4 P1 closed; 9 P2 rebutted | **Shipped 2026-05-23** |
| 009 | `009-cascade-thresholds-env-driven/` | 3 cascade-probe timing constants in auto-select.ts (DEFAULT_TIMEOUT_MS=2500, DEFAULT_LOCK_STALE_MS=30000, DEFAULT_SLEEP_MS=25) wired to SPECKIT_CASCADE_PROBE_TIMEOUT_MS / _LOCK_STALE_MS / _SLEEP_MS via parsePositiveInt helper. Council estimated 6 thresholds; actual 3. | main-agent direct | 1 P1 multi-site closed | **Shipped 2026-05-23** |
| 010 | `010-adr-writing-and-doc-validator/` | 4 ADRs (A: skill-advisor calibration; B: ADR-013/014 amendment; C: profile.ts scope coverage; D: doc-impl cross-checking) + validate-doc-model-refs.js validator script | cli-devin SWE-1.6 | 0 audit findings; 4 ADRs + 1 validator | **In progress** (dispatched 2026-05-23 18:00) |

### Phase transition rules

- Each phase passes its own verification gate before the next dispatches.
- Phase boundaries are commit boundaries: each phase ships as `git mv` + new files + `git status` clean.
- Cross-phase invariants checked only at arc convergence; per-phase gates protect against regression introduction.
- Sequential dispatch — one cli-X call active at a time.

---

## SOURCE-HISTORY MAP

The audit (021) produced 94 findings spread across 7 logical clusters. This arc bundles them into 10 phases as follows:

| Cluster (from 021 synthesis) | Findings | Bundled into Phase(s) |
|---|---|---|
| spec-memory P0 (3 sites) | profile.ts:195, profile.ts:192, embeddings.ts:774 | 001 |
| spec-memory P1 (7 sites) | auto-select dupes + openai/voyage standalones + cross-encoder | 005 |
| spec-memory P2 (7 sites) | indexer-types, edge-drift, misc inline numerics | 005 (bundled) |
| CocoIndex P0 (5 doc-drift sites) | config_templates, CFG-007, manual_testing_playbook, benchmarks/README, embedder-pluggability | 002 |
| CocoIndex P1 (2 sites) | indexer.py chunk-size, reranker dual-read | 006 |
| CocoIndex P2 (3 sites) | settings dataclass, unused param, comment | 006 (bundled) |
| Skill-advisor P0 (14 sites) | 6 inline 0.8/0.35 + 8 fusion/scoring/floor magic numbers | 004 |
| Skill-advisor P1 (9 sites) | lease/watcher TTLs, arg defaults | 004 (bundled) |
| Skill-advisor P2 (2 sites) | comments/tests | 004 (bundled) |
| Code-graph P1 (6 sites) | DEFAULT_TTL_MS dupe, edge weights, floors, parse-error ratio, quarantine age, maxDepth | 007 |
| Code-graph P2 (10 sites) | misc magic numbers | 007 (bundled) |
| Rerank-sidecar P1 (4 sites) | port, model name, revision, reaper policy duplication | 008 |
| Rerank-sidecar P2 (9 sites) | env-driven misc + non-env caps | 008 (bundled) |
| Cross-cutting docs P0/P1/P2 | INSTALL_GUIDE, README, ENV_REFERENCE, SKILL.md keywords | 002 (mostly) + 010 (validator) |
| Agent defs P0 (1 site) | .codex/agents/ empty | 003 |
| Agent defs P1 (2 sites) | (proposed) qualifier, cascade thresholds | 003 + 009 |
| Agent defs P2 (5 sites) | confirmations | (no-op; documented in 003 implementation-summary) |
| ADR gaps (4) | threshold governance, ADR amendment, profile.ts scope, doc-impl validator | 010 |

**Total**: 94 findings + 4 ADRs covered across 10 phases. Arc convergence verifies closure.
