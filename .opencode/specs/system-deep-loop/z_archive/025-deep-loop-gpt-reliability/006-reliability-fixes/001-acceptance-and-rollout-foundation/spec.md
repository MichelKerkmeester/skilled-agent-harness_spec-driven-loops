---
title: "Spec: Acceptance and Rollout Foundation"
description: "Phase 001 of packet 035 (unified command-contract architecture). Closes F-014, F-025 and builds the rollout mechanism (plan-review GAP-47). Two jobs, both prerequisites for safely landing any rewrite: make the 033 behavior-benchmark trustworthy as the acceptance harness, and build the per-command feature-flag rollout kill-switch with a byte-identical pre-035 fallback. Absorbs plan-review gaps GAP-01/03/06/08/14/37/38/39/40/45/47/49."
trigger_phrases:
  - "035 phase 001"
  - "acceptance and rollout foundation"
  - "benchmark harness rollout"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/025-deep-loop-gpt-reliability/006-reliability-fixes/001-acceptance-and-rollout-foundation"
    last_updated_at: "2026-07-03T16:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored: acceptance + rollout foundation"
    next_safe_action: "Execute first: harness hardening + rollout mechanism; plan.md/tasks.md detail at execution"
    blockers: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "035-001-restructure"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Spec: Acceptance and Rollout Foundation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-07-03 |
| **Parent Packet** | ../ (035-gpt-reliability-fixes) |
| **Parent Spec** | ../spec.md |
| **Successor** | [../002-gate3-precedence-and-validator/spec.md](../002-gate3-precedence-and-validator/spec.md) |
| **Closes findings** | F-014, F-025 |
| **Effort** | M |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Two prerequisites must exist before any runtime rewrite lands, or the rest of the packet builds on sand. First, the 033 behavior-benchmark must be a trustworthy acceptance harness: two instrument bugs (the runner only detects NEW fixture files, and the vague-ask prompts leak fixture-path tokens) plus missing measurement capability mean cell-flip claims cannot be believed. Second, the highest-blast-radius rewrites (Gate-3 bridge, contract compiler, injection dedupe) have no kill switch — the plan-review found the synthesis-mandated rollout safety-belt was dropped, so a regression would ship to every command-scoped GPT run with no fallback.

Findings closed: F-014, F-025. Absorbs plan-review GAP-01, GAP-03, GAP-06, GAP-08, GAP-14, GAP-37, GAP-38, GAP-39, GAP-40, GAP-45, GAP-47, GAP-49. Evidence in `../../034-gpt-reliability-research/research/` and `../plan-review/gap-registry.md`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope:** `behavior-bench-run.cjs` detection + instrumentation; the three vague-ask scenario contracts; the acceptance methodology (N-sample, stall-rate, latency self-comparison, full re-score); a per-command feature-flag mechanism with a byte-identical pre-035 injection fallback and a CI comparator; one non-GPT executor leg.

**Out of scope:** the runtime rewrites themselves (phases 002-005 ship behind the flag this phase builds).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001**: `fixtureGained` detection compares before/after file CONTENT (hash), not only new-file presence, so rewrite-heavy runs score consistently (F-014, GAP-01 note).
- **REQ-002**: The vague-ask prompts (ACB-003, IMB-003, RSB-004) are rewritten path-free; the post-rewrite re-score is captured as the NEW baseline handed to phase 005's routing acceptance (F-025, GAP-14).
- **REQ-003**: Add the missing harness instrumentation (GAP-08): presentation snapshot assertions, budget-edge integration checks (first-artifact deadline, progress cadence, pre-cap finalizer), and advisor vague-ask outcome telemetry (routed/offered/inline/misroute).
- **REQ-004**: Acceptance methodology: N≥3 stable samples for contested stall cells {ACB-004, ACB-005, CXB-004} before any flip claim (GAP-06); pre/post per-mode `stuck_no_progress` stall-rate recorded (GAP-38); latency compared GPT-leg-vs-itself pre/post, never vs the Claude host binary (D-007, GAP-39); `primary_cause`/`secondary_cause` result fields with a locked multi-cause list the runner may not collapse (GAP-03).
- **REQ-005**: One-shot full 32×3 re-score under the corrected runner with a delta-classification report BEFORE any phase-002 flip; cells whose bucket moves invalidate the prior "baseline green" claim for that cell (GAP-37).
- **REQ-006**: Add one non-GPT executor leg (DeepSeek or Kimi) to the acceptance harness to test that "GPT-safe" == "executor-safe" (GAP-45).
- **REQ-007**: A per-command feature flag (default off) selecting `fix` vs a byte-identical pre-035 injection fallback; a CI comparator that re-runs the Claude-native-leg cells on both branches and blocks promotion on unexpected divergence; a documented promotion rule (N consecutive green GPT-leg runs) (GAP-47, GAP-49).
- **REQ-008**: RSB-001 pre-init determinism is resolved — the toy research fixture `fx-002-research-target` is made valid against deep-research's ACTUAL pre-init rule set (the scoped `SPECKIT_RULES=FRONTMATTER_VALID,LEVEL_DECLARED,TEMPLATE_SOURCE,TEMPLATE_HEADERS,PLACEHOLDER_FILLED,SECTIONS_PRESENT,ANCHORS_VALID,SPEC_DOC_INTEGRITY,TOC_POLICY` that `deep_research_auto.yaml` runs — NOT plain `--strict`, which additionally enforces `FOLDER_NAMING` and is stricter than what RSB-001 triggers), fixed in place so RSB-001/006/007/008 all validate deterministically; RSB-001 is named an acceptance cell (GAP-01). The fixture keeps its `fx-` name (the pre-init check does not enforce FOLDER_NAMING); the Unicode-vs-spec probe is preserved.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

1. `fixtureGained` detects rewrites (unit-tested); vague-ask prompts carry no path tokens; hermetic suite exit 0.
2. Snapshot/budget/telemetry instrumentation lands and is exercised by the harness.
3. The feature flag toggles fix/fallback per command; the CI comparator blocks a divergent promotion; the fallback reproduces the pre-035 Claude-native buckets byte-for-byte.
4. Full 32×3 re-score published with a delta-classification report; contested-cell N≥3 methodology in place.

**Acceptance harness:** Harness-internal + rollout smoke (flag toggles, fallback reproduces baseline, comparator blocks divergence). Scoped to the 32-scenario suite (GAP-40).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk / Dependency | Handling |
|---|---|
| GAP-47 — no kill switch for global rewrites | This phase builds it and lands FIRST, before 002 |
| GAP-49 — "baseline green" unenforceable | CI comparator script makes it machine-checkable |
| GAP-37 — broken-runner baselines carried forward | One-shot full 32×3 re-score before any flip |
| GAP-39 — D-007 host-binary latency confound | Latency compared GPT-leg vs itself, not vs Claude host |
| GAP-45 — single-executor validation | One non-GPT leg added |
| Fallback must be byte-identical | Hash the pre-035 injection manifest; comparator asserts reproduction |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which non-GPT executor leg is cheapest to wire (DeepSeek-v4-pro vs Kimi-k2.7-code) is resolved at execution against runner cost.
<!-- /ANCHOR:questions -->
