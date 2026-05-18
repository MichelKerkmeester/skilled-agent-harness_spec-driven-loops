---
title: "Spec: 018/002 Code-retrieval baseline fixture"
description: "Author 10-20 deterministic query→expected-source pairs for CocoIndex embedder benchmarking"
trigger_phrases:
  - "018/002 baseline fixture"
  - "code-retrieval fixture authoring"
  - "cocoindex measurement fixture"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/006-cocoindex-stack/002-baseline-fixture"
    last_updated_at: "2026-05-17T18:50:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored and validated 18-pair code retrieval fixture"
    next_safe_action: "Use fixture from 003-comparison-measure"
    blockers: []
    key_files:
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000018002"
      session_id: "018-002-baseline-fixture"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Spec: 018/002 Code-retrieval baseline fixture

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| Status | Complete |
| Level | 1 |
| Owner | main agent |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

To compare CocoIndex embedder candidates we need a deterministic fixture (query → expected-source pairs grounded in actual repo code). Without this, "is CodeRankEmbed better?" has no measurable answer. The mk-spec-memory side has cat-24/409; CocoIndex has no equivalent today.

Purpose: ship a reusable code-retrieval fixture that 018/003 (and future embedder comparisons) can score against.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

In scope:
- 10-20 (query, expected_source_path) pairs grounded in real repo files
- Mix of difficulties (easy / medium / hard) — avoid adversarial
- Path-existence validator script (`fixture-validate.sh`)

Out of scope:
- Running the fixture against embedders (018/003)
- Cross-language fixtures (only the languages CocoIndex indexes today)
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| # | Requirement |
|---|---|
| R1 | At least 10 (max 20) pairs in fixture |
| R2 | Every `expected_source_path` exists on disk and matches CocoIndex include patterns |
| R3 | Difficulty distribution covers easy / medium / hard tiers |
| R4 | Queries do not literally quote the source's identifiers (avoid lexical leakage bias) |
| R5 | Validator script `fixture-validate.sh` exits 0 |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- All 5 requirements met
- Hand review confirms no biased pairs
- Fixture file committed at `evidence/code-retrieval-fixture.json`
- Strict-validate PASSED
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

Risks:
- **Author bias**: query and expected source written by same person may share unintended cues — mitigated by hand-review checklist
- **Difficulty hand-ranking is subjective** — 018/003 reports per-difficulty breakdown to surface bias
- **Fixture drift**: files can be renamed/deleted — `fixture-validate.sh` catches this

Dependencies:
- 018/001 swap mechanism (so 018/003 can consume the fixture)
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Optimal fixture size: 10 (minimum statistical signal) vs 20 (more robust)? Defer to authoring phase.
<!-- /ANCHOR:questions -->
