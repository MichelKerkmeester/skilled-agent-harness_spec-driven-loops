---
title: "Feature Specification: Strict-validation fixtures — boolean validators that punish lax acceptance"
description: "005 sharpened discrimination with spec-heavy comparison/transform fixtures. This phase adds three boolean strict-VALIDATION fixtures (validate-ipv4, validate-date, validate-semver) dominated by adversarial-INVALID inputs — subtle malformed cases a lax-but-plausible solution wrongly accepts. A validator that misses ANY rule scores below 1.0, so the fixtures discriminate two near-equal frontier models by strictness. Adds the capability-m3-vs-mimo-v3 profile (4 fixtures incl. retained roman, n=5)."
trigger_phrases:
  - "strict validation fixtures"
  - "boolean validator benchmark"
  - "adversarial invalid input fixtures"
  - "validate-ipv4 validate-date validate-semver"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/102-reusable-model-benchmark-framework/006-strict-validation-fixtures"
    last_updated_at: "2026-06-02T12:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Validation fixtures + n=5 run shipped; M3 more reliable than MiMo (eval/synthesis.md)"
    next_safe_action: "Optional P2: fix reporter TIE-on-format when only one model is gate-eligible"
    blockers: []
    key_files:
      - ".opencode/skills/deep-improvement/assets/model-benchmark/benchmark-fixtures"
      - ".opencode/skills/deep-improvement/assets/model-benchmark/benchmark-profiles/capability-m3-vs-mimo-v3.json"
      - ".opencode/skills/deep-improvement/scripts/model-benchmark/tests/sweep-isolation.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-127-006"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Strict-validation fixtures

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-06-02 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Predecessor** | 005-sharper-discrimination (harder comparison/transform fixtures + v2 profile) |
| **Handoff Criteria** | 3 boolean validation fixtures (≥26 oracle cases each, ≥60% adversarial-invalid); every reference impl scores 1.0 and a deliberately-lax impl scores strictly <1.0 through the real `code-task-scorer.cjs`; v3 profile validates `{valid:true,errors:[]}`; vitest stays green |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The existing hard/harder packs lean on transform and comparison tasks where partial credit spreads across structurally-varied outputs. They under-test one specific axis that separates near-equal frontier models: **strictness on input validation**. A lax-but-plausible solution that skips a single rule (a leading-zero check, a leap-year check, an empty-identifier check) still looks correct on happy-path inputs and only fails on subtle malformed inputs.

### Purpose
Add three boolean strict-VALIDATION fixtures whose oracle sets are DOMINATED by adversarial-invalid inputs, so a validator missing ANY rule lands strictly below 1.0. Each fixture's oracle is generated from a reference implementation that scores 1.0 through the real scorer, with a deliberately-lax implementation confirmed strictly <1.0. Ship a v3 capability profile that runs these three plus the retained `hard-roman-to-int` at n=5.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **3 new strict-validation fixtures** (tier T4, boolean return, 26-30 adversarial oracle cases each, ≥60% invalid):
  - `validate-ipv4` — `isValidIPv4(s)` strict dotted-decimal (4 octets, 0-255, no leading zeros, no stray chars/whitespace).
  - `validate-date` — `isValidDate(s)` strict ISO `YYYY-MM-DD` (Gregorian, zero-padded, leap-year-correct, per-month day counts).
  - `validate-semver` — `isValidSemver(s)` strict SemVer 2.0.0 (no-leading-zero core, non-empty pre-release/build identifiers, numeric-id leading-zero rule, ASCII-only).
- **New profile** `capability-m3-vs-mimo-v3.json`: copy v2; `fixtures` (+ `fixtureSelection.include`) = `["validate-ipv4","validate-date","validate-semver","hard-roman-to-int"]`; `sampling.samplesPerCell: 5`; both models retained (MiniMax-M3 + mimo-v2.5-pro, cli-opencode, variant high); correctness gate 1.0; groupBy model.
- **Oracle validation** through the real `code-task-scorer.cjs` (reference impl → 1.0; deliberately-lax impl → strictly <1.0) for every new fixture.
- **vitest extension** in `sweep-isolation.vitest.ts`: the 3 new fixtures parse + carry ≥26 cases each + the v3 profile loads and validates.

### In Scope (extended)
- The live n=5 benchmark run was performed by the orchestrator after the fixtures shipped (de-risk → full 40-cell run); the verdict + per-sample evidence live in `eval/`.

### Out of Scope
- Other P2 roadmap items (mutation/hill-climb, profile `extends`, capability-radar reducers, fixing the reporter's TIE-on-format label).

### Files to Change

| File Path | Change |
|-----------|--------|
| `deep-improvement/assets/model-benchmark/benchmark-fixtures/validate-ipv4.json` | Create |
| `deep-improvement/assets/model-benchmark/benchmark-fixtures/validate-date.json` | Create |
| `deep-improvement/assets/model-benchmark/benchmark-fixtures/validate-semver.json` | Create |
| `deep-improvement/assets/model-benchmark/benchmark-profiles/capability-m3-vs-mimo-v3.json` | Create |
| `deep-improvement/scripts/model-benchmark/tests/sweep-isolation.vitest.ts` | Extend (validation-pack shape coverage + v3 profile) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance |
|----|-------------|-----------|
| REQ-001 | Adversarial-invalid density | Each fixture has ≥26 oracle cases (visible + hidden) with ≥60% returning `false`, so a single missed rule drops the score below 1.0 |
| REQ-002 | Validated oracles | Each fixture's reference impl scores 1.0 and a deliberately-lax impl (skipping one real rule) scores strictly <1.0 through the real `code-task-scorer.cjs` |
| REQ-003 | v3 capability profile | `capability-m3-vs-mimo-v3.json` references the 3 validation fixtures + `hard-roman-to-int`, n=5, both models, correctness gate 1.0, groupBy model; `profile-validator.cjs` returns `{valid:true,errors:[]}` |
| REQ-004 | Green tests + repo safety | `npx vitest run model-benchmark/tests/` stays green; no `eval/` change; no /tmp harness pollution; comment hygiene respected in code |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All three fixtures parse, carry the required code-task keys, and hold ≥26 oracle cases each (≥60% invalid).
- **SC-002**: Reference impls score 1.0 and lax impls score strictly <1.0 through the real scorer (reported per fixture).
- **SC-003**: `capability-m3-vs-mimo-v3.json` validates `{valid:true,errors:[]}` and selects the 4 fixtures at n=5.
- **SC-004**: `npx vitest run model-benchmark/tests/` green; `validate.sh --strict` on this folder passes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Mitigation |
|------|------|------------|
| Risk | Wrong oracle expected-values → garbage benchmark | Every `expect` is computed by the reference impl and the reference is confirmed 1.0 through the real scorer before the fixture is written |
| Risk | Whitespace/newline inputs corrupted in transit | Oracle args round-trip through `JSON.parse(JSON.stringify(args))` exactly as the scorer does; the `\n`/space cases are validated in that path |
| Risk | A lax impl that accidentally still scores 1.0 (non-discriminating) | Each lax impl skips a real rule that the invalid set exercises; confirmed strictly <1.0 |
| Dep | `code-task-scorer.cjs` extraction + deep-equal contract | Oracle cases are `{name,args,expect}` with boolean `expect`; deep-equal handles booleans natively |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The benchmark run itself is out of scope; this phase ships validated fixtures + the v3 profile only.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-001 | Honest oracles | No fabricated expected-values; every `expect` derived from a reference impl that scores 1.0 |
| NFR-002 | Repo cleanliness | No /tmp validation harness persists; no `eval/` write; no spec paths/task ids in code comments |
| NFR-003 | Reproducible | The reference/lax scores + valid/invalid split recorded per fixture |
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- **Whitespace/newline-only difference** (`1.2.3.4 `, `1.2.3.4\n`, ` 2021-01-01`, `1.2.3 `) → must return `false`; validated through the scorer's JSON round-trip.
- **Leading-zero ambiguity** (`0` valid vs `00`/`01` invalid for octets, core numerics, and numeric pre-release ids) → the single most common lax miss; over-represented on purpose.
- **Century leap-year edge** (`2000`/`2024` leap, `1900`/`2100` not) → exercises the full `%400` rule, not just `%4`.
- **Empty identifiers** in semver (`1.2.3-`, `1.2.3-alpha..1`, `1.2.3+`) → a permissive regex misses these.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

Low-moderate: additive fixtures + a profile, like 004/005. The care is in oracle correctness — every expected boolean is generated by a reference impl and certified 1.0 through the real scorer, with a lax counter-impl proving the fixture discriminates.
<!-- /ANCHOR:complexity -->
