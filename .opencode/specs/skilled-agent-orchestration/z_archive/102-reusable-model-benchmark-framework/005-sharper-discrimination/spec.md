---
title: "Feature Specification: Sharper discrimination — harder non-saturating fixtures + CI-certified M3-vs-MiMo margin"
description: "004 showed 3 of 4 hard fixtures saturate (both frontier models 1.0), leaving only one discriminating fixture and a verdict resting on a single n=3 variance blip. This phase adds genuinely-harder, spec-heavy fixtures (semver-compare, normalize-path, int-to-words) with validated oracles, keeps the one fixture that discriminated (roman-to-int), and runs more samples (n=5) so correctness can rank and the paired-bootstrap CI can certify a sharper M3-vs-MiMo margin — or honestly report a TIE if the models are genuinely matched."
trigger_phrases:
  - "sharper discrimination benchmark"
  - "harder non-saturating fixtures"
  - "ci-certified m3 vs mimo margin"
  - "anti-saturation fixture pack"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/102-reusable-model-benchmark-framework/005-sharper-discrimination"
    last_updated_at: "2026-06-02T09:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "De-risk: 3 computational fixtures saturated; pivoted to validation fixtures (006)"
    next_safe_action: "Continue in 006 — de-risk + run the validation-heavy fixture pack"
    blockers: []
    key_files:
      - ".opencode/skills/deep-improvement/assets/model-benchmark/benchmark-fixtures"
      - ".opencode/skills/deep-improvement/assets/model-benchmark/benchmark-profiles"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-127-005"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Do harder computational fixtures separate M3 vs MiMo? No — all 3 saturated at 1.0; pivot to validation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Sharper discrimination

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete (negative result — computational fixtures saturated; validation iteration in 006) |
| **Created** | 2026-06-02 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Predecessor** | 004-capability-discrimination (hard fixtures + the first M3-vs-MiMo run) |
| **Handoff Criteria** | At least 2 fixtures do NOT saturate (a real per-fixture gap between the models, not just one variance blip); oracles validated through the real scorer; a multi-sample (n=5) run yields a CI-certified verdict OR an honest TIE; repo stays clean |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 004 capability run discriminated only on the margins: 3 of 4 hard fixtures saturated (both MiniMax-M3 and MiMo-V2.5-Pro scored 1.0), so correctness could not rank and the framework fell back to a format-TIE. The only signal was `hard-roman-to-int`, where MiMo's mean (0.627) came from a single catastrophic 0.0 across n=3 — a reliability blip, not a certified capability margin. The benchmark cannot yet CI-certify which model is better.

### Purpose
Make the verdict sharp and certifiable: add genuinely-harder, spec-heavy fixtures with many adversarial edge cases (so frontier models land at a *fraction*, not 1.0), keep the one fixture that discriminated, and run enough samples (n=5) that the paired-bootstrap CI (003) can either certify a winner or honestly call a TIE.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **3 new harder fixtures** (tier T4/T5), each spec-heavy with 18-30 adversarial oracle cases so partial credit spreads:
  - `harder-semver-compare` — semver.org §11 precedence incl. pre-release identifier rules + build-metadata-ignored.
  - `harder-normalize-path` — Unix path normalization incl. `..` beyond root, `.`, multi-slash, trailing-slash, empty.
  - `harder-int-to-words` — non-negative integer → American-English words (hyphenation, no "and", scale words, zero).
- **Keep `hard-roman-to-int`** (it discriminated); **drop** the 3 saturated fixtures (merge-intervals, parse-csv-line, eval-expr) from the sharper profile.
- **New profile** `capability-m3-vs-mimo-v2.json`: same 2 models (cli-opencode, `--variant high`), the 4 fixtures above, `samplesPerCell: 5`, correctness gate, groupBy model.
- **Oracle validation** through the real `code-task-scorer.cjs` (reference impl → 1.0; a deliberately-wrong impl → <1.0) for every new fixture.
- **A de-risk run (n=2)** to confirm the new fixtures do not saturate, then **the full n=5 run** → `eval/{results,aggregate}.json` + a CI verdict + `synthesis.md`.

### Out of Scope
- Other P2 roadmap items (mutation/hill-climb, profile `extends`, capability-radar reducers).
- Dispatch-bounding hardening (OS-level kill, incremental result writes) — recommended, but separate.

### Files to Change

| File Path | Change |
|-----------|--------|
| `deep-improvement/assets/model-benchmark/benchmark-fixtures/harder-*.json` | Create (3 fixtures) |
| `deep-improvement/assets/model-benchmark/benchmark-profiles/capability-m3-vs-mimo-v2.json` | Create |
| `deep-improvement/scripts/model-benchmark/tests/*.vitest.ts` | Extend (fixture-shape coverage for the new pack) |
| `005-sharper-discrimination/eval/{results,aggregate}.json, synthesis.md` | Create (results) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance |
|----|-------------|-----------|
| REQ-001 | Non-saturating fixtures | At least 2 of the 4 profile fixtures yield a per-model correctness mean strictly < 1.0 for at least one model (real partial-credit spread, not a lone variance blip) |
| REQ-002 | Validated oracles | Each new fixture's reference impl scores 1.0 and a deliberately-wrong impl scores < 1.0 through the real `code-task-scorer.cjs` |
| REQ-003 | Sharper verdict | A multi-sample (n=5) run produces an `aggregate.json` verdict; if correctness no longer saturates, the CI either certifies a winner or returns an honest TIE with the CI numbers |
| REQ-004 | Repo safety + green tests | The run leaves `git status` clean (cwd-isolation) and the vitest suite stays green |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `npx vitest run model-benchmark/tests/` green (new fixtures parse + carry ≥18 oracle cases each).
- **SC-002**: De-risk run confirms ≥2 fixtures do not saturate (else iterate on fixtures before the full run).
- **SC-003**: `eval/synthesis.md` states the n=5 M3-vs-MiMo verdict with the CI (certified winner or honest TIE) + per-fixture breakdown.
- **SC-004**: `validate.sh --strict` on this folder passes; `git status` clean after the run.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Mitigation |
|------|------|------------|
| Risk | New fixtures also saturate (frontier models ace them) | De-risk run (n=2) first; iterate fixture difficulty before the full n=5 run; honest report if they still tie |
| Risk | Wrong oracle values → garbage benchmark | Validate every oracle against a reference impl through the real scorer before any run |
| Risk | Long runtime (40 cells × ~150s ≈ 100 min) + rate limits | Background run, correctly-sized `gtimeout`, per-dispatch cap, dispatcher backoff; de-risk first to avoid wasting a long run |
| Dep | cli-opencode dispatch contract | `</dev/null` stdin (skill ALWAYS rule 5) — already in the dispatcher; confirmed working in 004 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Will the harder fixtures discriminate on *capability* (a consistent per-fixture gap) or only surface more *reliability* variance? The de-risk run answers this before the full run.
- Is n=5 enough for the paired-bootstrap CI to certify, or is n=8+ needed? Decide after seeing the de-risk spread.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-001 | Repo safety | No model-written files persist after the run (cwd-isolation + before/after untracked diff) |
| NFR-002 | Reproducible | Profile + sample count + re-run command recorded in synthesis |
| NFR-003 | Honest scoring | Partial credit; no fabricated oracle values; report a TIE if the models genuinely tie |
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- **A new fixture still saturates** → keep it only if ≥1 other discriminates; otherwise iterate or demote to smoke, and say so.
- **A model emits a verbose / non-extractable answer** (the MiMo 0.0 failure mode) → scored as a correctness miss (honest); more samples quantify the rate.
- **A dispatch times out at the per-cell cap** → recorded as a failure, never fabricated; re-run the missing cells.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

Moderate: the engineering is a validated fixture pack + a profile (additive, like 004), but the difficulty is *designing problems that frontier models actually fail repeatably* — the de-risk run is the gate that proves the fixtures earn their place before the expensive full run.
<!-- /ANCHOR:complexity -->
