---
title: "D1-R4 — No fixture corpus / provider gate / expected counts for the AI-tell scenario"
description: "Add a fixture-backed AI-tell scenario plus a benchmark asserting expected tell IDs and no off-family false positives, extending the slop-hardening playbook."
trigger_phrases:
  - "d1-r4 ai tell fixtures"
  - "ai tell fixture corpus design build"
importance_tier: "normal"
contextType: "planning"
status: "planned"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-phase-scaffold | v1.0 -->
# D1-R4 — No fixture corpus / provider gate / expected counts for the AI-tell scenario

## 1. OBJECTIVE
Build a fixture corpus and benchmark for the AI-tell scenario so detection is measured against known positives and negatives with expected counts, not asserted by prose.

## 2. WHY
There is no fixture corpus, provider gate, or expected counts for the AI-tell scenario, so tell detection cannot be proven or guarded against false positives.

## 3. TARGET & CLASS
- **Target file(s):** `manual_testing_playbook/03--slop-hardening/001-ai-fingerprint-tells.md`
- **Severity:** P1
- **Enforcement class:** enforceable
- **Dimension:** D1 — Residual Craft

## 4. BUILD OUTLINE
- Add a fixture-backed scenario: clean pass + Codex/Gemini positives + clean negatives.
- Add a benchmark asserting expected tell IDs and no off-family false positives.
- Extend `manual_testing_playbook/03--slop-hardening/001-ai-fingerprint-tells.md`.
- **Candidate nested sub-phases (materialize at execution):** fixture corpus (positives/negatives) / benchmark assertions + playbook extension

## 5. ACCEPTANCE
- Benchmark asserts the expected tell IDs fire on positives and none fire on off-family negatives (deterministic).

## 6. EVIDENCE
- `001-ai-fingerprint-tells.md:30` — playbook scenario lacking fixtures and expected counts.
- Source: `research/research.md` §4 (D1-R4)

## 7. STATUS
planned — plan.md / tasks.md / checklist.md authored when executed.
