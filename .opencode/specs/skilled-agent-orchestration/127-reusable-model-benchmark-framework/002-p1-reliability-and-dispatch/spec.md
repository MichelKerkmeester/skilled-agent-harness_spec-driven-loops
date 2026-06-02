---
title: "Feature Specification: P1 — statistical rigor, dispatch envelope, capability table + tiered fixtures"
description: "The P1 reliability tier from the 127 research roadmap: paired-bootstrap-CI + noise-floor gating the trust verdict; a normalized dispatch envelope with latency + nullable tokens/cost + OpenCode JSON usage parsing; machine-readable provider capability fields; a tiered fixture taxonomy; an operator guide for the A-F modes."
trigger_phrases:
  - "p1 benchmark reliability"
  - "paired bootstrap ci verdict"
  - "dispatch envelope cost latency"
  - "capability table tiered fixtures"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/127-reusable-model-benchmark-framework/002-p1-reliability-and-dispatch"
    last_updated_at: "2026-06-02T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Phase scaffolded from the P1 roadmap; stage A (CI verdict) launched"
    next_safe_action: "Verify stage A, then stage B (dispatch envelope), then stage C (capability/fixtures/docs)"
    blockers: []
    key_files:
      - ".opencode/skills/deep-improvement/scripts/model-benchmark/lib/sweep-stats.cjs"
      - ".opencode/skills/deep-improvement/scripts/model-benchmark/dispatch-model.cjs"
      - ".opencode/skills/sk-prompt/assets/model-profiles.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-127-002-p1"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: P1 — statistical rigor, dispatch envelope, capability + tiered fixtures

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-06-02 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Predecessor** | 001-p0-mvp-implementation (the MVP this hardens) |
| **Handoff Criteria** | Winner claims are gated by paired-bootstrap CI + noise-floor; dispatch returns a normalized envelope with latency + nullable tokens/cost (OpenCode JSON parsed); provider quirks are machine-readable capability fields; a tiered fixture taxonomy + operator guide exist; all existing tests stay green |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The P0 MVP makes benchmarking config-driven and gates correctness, but its trust verdict uses a minimal single-sample heuristic, the dispatcher does not capture latency/tokens/cost (so "token efficiency" is approximated by word count), provider quirks (`--agent` omission, token-plan slugs) live in prose, and the fixture set is just a couple of T3 tasks. The research §5/§6/§4 roadmap calls these the P1 reliability tier.

### Purpose
Harden the framework to publication-grade reliability per `../research/research.md` (§5 stats, §6 dispatch, §4 fixtures) + `../research/deltas/deltas.jsonl` P1 deltas — without breaking Lane B or the MVP.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope — three verified stages
- **A. Statistical rigor (additive over our modules):** paired bootstrap CI + MAD noise-floor in `lib/sweep-stats.cjs`; a CI-gated verdict (WINNER only if `N≥k AND margin>noiseFloor AND paired 90% CI excludes zero`); `lib/sweep-reporter.cjs` computes the top-pair CI and uses it.
- **B. Normalized dispatch envelope (edits `dispatch-model.cjs` — additive return fields only):** `{output, stdout, stderr, latency_ms, exit_code, attempts, tokens_in, tokens_out, cost_usd, executor, provider, model, variant}`; OpenCode `--format json` usage parsing (nullable where a CLI does not expose usage — never fabricated); the sweep captures cost/latency into rows; the reporter can rank on a real efficiency dimension.
- **C. Capability table + tiered fixtures + docs (data/doc, mostly additive):** machine-readable capability fields in `sk-prompt/assets/model-profiles.json` (`model_slug/default_variant/variant_flag/agent_policy/format_mode/quota_pool`); a tiered fixture taxonomy (more T1–T4 fixtures + a taxonomy doc); an operator guide for the six A–F modes; a meaningful `default.json` `repeatabilityTolerance`.

### Out of Scope (P2)
- Mutation/hill-climb over framework axes; single-parent profile `extends`/overrides; per-executor (Claude/Codex/Gemini/Devin) cost parsers; capability-radar reducers; long-context/agentic fixture categories.

### Files to Change

| File Path | Change | Stage |
|-----------|--------|-------|
| `deep-improvement/scripts/model-benchmark/lib/sweep-stats.cjs` | Modify (additive exports) | A |
| `deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs` | Modify (CI verdict) | A |
| `deep-improvement/scripts/model-benchmark/dispatch-model.cjs` | Modify (additive envelope fields) | B |
| `deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs` | Modify (capture envelope) | B |
| `sk-prompt/assets/model-profiles.json` | Modify (capability fields) | C |
| `deep-improvement/assets/model-benchmark/benchmark-fixtures/*.json` | Create (taxonomy) | C |
| `deep-improvement/scripts/model-benchmark/SWEEP.md` / a modes guide | Modify/Create | C |
| `deep-improvement/assets/model-benchmark/benchmark-profiles/default.json` | Modify (repeatabilityTolerance) | C |
| `deep-improvement/scripts/model-benchmark/tests/*.vitest.ts` | Create | A/B |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | CI-gated verdict | A clearly-separated pair → WINNER with a paired CI excluding zero; an overlapping pair → TIE('ci_overlaps_zero'); n=1 → INCONCLUSIVE('insufficient_n') |
| REQ-002 | Dispatch envelope | `dispatch-model.cjs` returns latency_ms + nullable tokens/cost; OpenCode `--format json` usage parsed when present, `null` otherwise (never fabricated) |
| REQ-003 | No regression | The existing model-benchmark vitest suite stays green at every stage; Lane B legacy behavior unchanged |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Capability table | `model-profiles.json` carries machine-readable `model_slug/default_variant/variant_flag/agent_policy/format_mode/quota_pool` for the token-plan providers |
| REQ-005 | Tiered fixtures + modes guide | A T1–T4 taxonomy (≥1 new fixture per non-trivial tier) + an operator guide mapping the A–F modes to profile shapes |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `npx vitest run model-benchmark/tests/` green at every stage (existing + new).
- **SC-002**: A CI demo shows WINNER↔TIE flips with separation; a dispatch demo shows latency populated + tokens/cost null-or-parsed.
- **SC-003**: `node --check` all touched .cjs; all touched JSON jq-valid.
- **SC-004**: `validate.sh --strict` on this folder passes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Editing `dispatch-model.cjs` (Lane B) breaks the 56 tests | High | Additive return FIELDS only (don't change existing keys/signature); re-run the suite after stage B |
| Risk | Bootstrap nondeterminism | Med | Seeded resampling; deterministic tests |
| Risk | Fabricated token/cost | Med | Nullable; return `null` when a CLI does not expose usage |
| Risk | Comment-hygiene in edited .cjs | Med | Durable WHY only |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-001 | Dependency-free | Bootstrap/CI implemented in Node stdlib; no new npm deps |
| NFR-002 | Backward compatible | Existing `sweep-stats`/`dispatch-model` exports + return keys preserved; only additions |
| NFR-003 | Deterministic tests | Seeded; mock dispatch |
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- **Single sample** → INCONCLUSIVE('insufficient_n') before any CI math.
- **CI straddles zero** → TIE('ci_overlaps_zero'), never WINNER.
- **Executor exposes no usage** → tokens/cost `null` + a `parser_status`; never fabricated.
- **OpenCode JSON event stream missing usage fields** → null (the research flags this as unverified for the live binary).
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

Moderate. Stage A + the docs are additive/low-risk; stage B carries the only real risk (editing a Lane B dispatcher) and is constrained to additive return fields + guarded by the full suite. Built and verified in three stages.
<!-- /ANCHOR:complexity -->
