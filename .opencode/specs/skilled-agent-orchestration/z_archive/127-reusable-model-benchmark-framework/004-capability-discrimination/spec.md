---
title: "Feature Specification: Capability discrimination — hard fixtures + isolated dispatch + M3-vs-MiMo verdict"
description: "Make the benchmark actually separate frontier models: fix the sweep's dispatch cwd-isolation (so agentic file-writes don't pollute the repo), build a hard partial-credit fixture pack (many adversarial hidden cases so 'mostly right' separates from 'fully right'), and run MiniMax-M3 vs MiMo-V2.5-Pro multi-sample at --variant high through the model-vs-model mode for a CI-gated capability verdict (correctness + real token-efficiency)."
trigger_phrases:
  - "capability discrimination benchmark"
  - "hard partial-credit fixtures"
  - "m3 vs mimo capability verdict"
  - "sweep cwd isolation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/127-reusable-model-benchmark-framework/004-capability-discrimination"
    last_updated_at: "2026-06-02T07:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Capability run complete (24 cells); M3 edges MiMo on reliability — see eval/synthesis.md"
    next_safe_action: "Optional: harder fixtures + more samples for a sharper margin (3 of 4 saturated)"
    blockers: []
    key_files:
      - ".opencode/skills/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs"
      - ".opencode/skills/deep-improvement/assets/model-benchmark/benchmark-fixtures"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-127-004"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Which is better, M3 or MiMo? M3 — perfect consistency vs MiMo's 1-in-12 hard miss (reliability edge)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Capability discrimination

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete — harness verified + live M3-vs-MiMo verdict delivered (M3 edges MiMo on reliability; 24-cell run, 0 pollution; see eval/synthesis.md) |
| **Created** | 2026-06-02 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Predecessor** | 003-p1-reliability-and-dispatch (CI verdict + dispatch envelope + tiered fixtures) |
| **Handoff Criteria** | The sweep dispatches each cell in an isolated temp dir (repo stays clean); a hard partial-credit fixture pack separates frontier models; a real multi-sample M3-vs-MiMo run yields a CI-gated capability verdict (not just format) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The current benchmark cannot say which frontier model is better: the 2 fixtures saturate (both 100% correct), so only format/brevity separated MiniMax-M3 and MiMo-V2.5-Pro. A real-dispatch smoke also revealed (a) the OpenCode JSON parser works + captures **real token counts** (usable efficiency signal), but (b) models run **agentically** (write files), and the sweep passes the repo root as the dispatch cwd — so real runs would pollute the repo.

### Purpose
Make the benchmark discriminate capability: isolate dispatch writes, build hard fixtures with **partial-credit** scoring (many adversarial hidden cases so a model that solves 9/12 separates from 12/12), and run a real multi-sample M3-vs-MiMo comparison gated by the paired-bootstrap CI (003) — reporting **correctness + real token-efficiency**.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **cwd-isolation fix** in `sweep-benchmark.cjs`: dispatch each cell with `cwd` = the per-cell `mkdtemp` dir (already created), and clean it up after; the repo must stay clean across a run.
- **Hard fixture pack** (4–5 new fixtures, tiers T3/T4): genuinely hard tasks (e.g. interval-merge, quoted-CSV parse, roman-numeral validate, expression evaluator, a DP) each with 10–15 hidden + adversarial oracle cases so `correctness_pass_rate` is a fraction that separates models. Tasks instruct "return the function as text; do NOT create files." Oracles validated against reference impls (reference → 1.0, a wrong impl → <1.0) through the real `code-task-scorer.cjs`.
- **Capability profile** `capability-m3-vs-mimo.json`: `mode: model-vs-model`, `models: [minimax-coding-plan/MiniMax-M3, xiaomi-token-plan-ams/mimo-v2.5-pro]`, `frameworks: [costar]` (the format-clean framing), the hard fixtures, `samplesPerCell: 3`, `variant: high`, `reporting.groupBy: model`.
- **The run**: real multi-sample dispatch → `aggregate.json` + CI verdict + a capability `synthesis.md` (correctness + token-efficiency + the verdict).

### Out of Scope
- P2 (mutation/hill-climb, profile inheritance, capability radar).
- Changing the framework recommendations (COSTAR/TIDD-EC) — those are 126/120.

### Files to Change

| File Path | Change |
|-----------|--------|
| `deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs` | Modify (cwd-isolation fix) |
| `deep-improvement/assets/model-benchmark/benchmark-fixtures/hard-*.json` | Create (hard pack) |
| `deep-improvement/assets/model-benchmark/benchmark-profiles/capability-m3-vs-mimo.json` | Create |
| `004-capability-discrimination/eval/{aggregate,synthesis}.*` | Create (results) |
| `deep-improvement/scripts/model-benchmark/tests/*.vitest.ts` | Create (isolation + fixture-shape tests) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance |
|----|-------------|-----------|
| REQ-001 | Dispatch isolation | A real sweep run leaves `git status` clean (model file-writes land in temp dirs, cleaned up); existing tests stay green |
| REQ-002 | Discriminating fixtures | Hard fixtures produce a per-cell `correctness_pass_rate` that is NOT uniformly 1.0 across models (partial credit separates) |
| REQ-003 | Real capability run | A multi-sample M3-vs-MiMo run yields an `aggregate.json` verdict (WINNER/TIE/INCONCLUSIVE) on correctness, with real token-efficiency reported |
| REQ-004 | Honest verdict | If the models genuinely tie within CI, report TIE — do not manufacture a winner |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `git status` clean after a real run (isolation works).
- **SC-002**: `npx vitest run model-benchmark/tests/` green.
- **SC-003**: `eval/synthesis.md` states the M3-vs-MiMo capability verdict with CI + token-efficiency + honest caveats.
- **SC-004**: `validate.sh --strict` on this folder passes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Mitigation |
|------|------|------------|
| Risk | Models still ace the hard fixtures (tie) | Honest TIE is a valid result; partial-credit + many cases maximize separation; report the per-fixture breakdown |
| Risk | Wrong oracle values → garbage benchmark | Validate every oracle against a reference impl through the real scorer before the run |
| Risk | Repo pollution from agentic writes | The cwd-isolation fix + a post-run `git status` clean check (REQ-001) |
| Risk | Single framework (COSTAR) confounds | COSTAR is the format-clean framing for both; correctness (not format) is the capability signal |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- The live MiniMax-M3 vs MiMo-V2.5-Pro capability verdict is unanswerable until opencode dispatches recover — the run hangs at startup registering a wedged MCP server (`mk-spec-memory` `.unclean-shutdown`). The one-command re-run path is in `eval/synthesis.md`.
- Which P2 hardening items (OS-level dispatch kill, incremental result writes, `--pure`/MCP-off dispatch) should be built first to make the framework robust to the failure hit here?
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-001 | Repo safety | No model-written files persist in the repo after a run |
| NFR-002 | Reproducible | Profile + seed recorded; re-run command documented |
| NFR-003 | Honest scoring | Partial credit; no fabricated oracle values |
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- **Model writes a file instead of inline code** → temp-dir isolated; scorer extracts the inline fenced code from the response (the model includes it); a write-only response scores as a format/extraction miss (honest).
- **Both models 100% on a fixture** → that fixture saturated; the aggregate flags it; rely on the harder fixtures for separation.
- **A transient empty dispatch** → retry once; record failures, never fabricate.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

Moderate-to-high: a small but important framework fix (cwd-isolation), a validated hard-fixture pack, and a real multi-sample dispatch run. De-risked by an isolation smoke before the full run, validated oracles, and the CI gate that refuses a spurious winner.
<!-- /ANCHOR:complexity -->
