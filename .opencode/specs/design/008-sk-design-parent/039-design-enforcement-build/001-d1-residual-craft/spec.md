---
title: "D1 — Residual Craft"
description: "Port the residual feature/reference/asset craft from impeccable-main and designer-skills-main into the live sk-design modes, one phase per recommendation, D1-R1..R13."
trigger_phrases:
  - "d1 residual craft build"
  - "design craft phases"
  - "sk-design craft backlog"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/001-d1-residual-craft"
    last_updated_at: "2026-06-30T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Documented D1 residual craft phase parent"
    next_safe_action: "Execute child phases under this parent"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-parent-154-039-d1-residual-craft"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-phase-parent | v1.0 -->
# D1 — Residual Craft

## 1. PURPOSE
D1 captures the residual feature, reference, and asset craft that the corpus review (impeccable-main + designer-skills-main) found missing from the live sk-design modes. It is real, buildable craft rather than new architecture: numeric-law indexing, transform-verb lanes, per-model AI-tell registries/fixtures, audit performance evidence, hardening probes, baseline rhythm, and duplicate-law guards. Most items are hybrid — the artifact shape (a row, a card, a JSON schema, a report field) is deterministically enforceable, but the underlying taste/visual judgment stays advisory.

## 2. RECOMMENDATIONS (one phase each)

| Phase folder | ID | Title | Sev | Class |
|---|---|---|---|---|
| `001-numeric-law-index` | D1-R1 | No central index of cross-mode numeric laws | P1 | hybrid |
| `002-transform-verb-aliases` | D1-R2 | Transform verbs absent from registry aliases + no interface authoring lane | P1 | enforceable |
| `003-ai-fingerprint-registry` | D1-R3 | Per-model AI tells: audit has only a human catalog | P1 | hybrid |
| `004-ai-tell-fixture-corpus` | D1-R4 | No fixture corpus / provider gate / expected counts for the AI-tell scenario | P1 | enforceable |
| `005-audit-performance-evidence` | D1-R5 | Optimize metric proof softened — audit report has no baseline/delta fields | P1 | hybrid |
| `006-device-constrained-probes` | D1-R6 | Harden device/constrained-context probes missing | P1 | hybrid |
| `007-baseline-rhythm-token` | D1-R7 | Baseline rhythm: line-height→spacing relation not required | P1 | hybrid |
| `008-transform-lane-proof-cards` | D1-R8 | Transform-lane proof cards missing (distill/clarify/delight) | P2 | hybrid |
| `009-harden-fix-shapes` | D1-R9 | Harden fix-shapes not systematic in the matrix | P2 | hybrid |
| `010-polish-readiness-gate` | D1-R10 | Polish readiness is prose, not a gate | P2 | hybrid |
| `011-codex-theater-tell` | D1-R11 | Missing Codex "theater / meta-criticism copy" tell | P2 | hybrid |
| `012-variant-parameter-contract` | D1-R12 | Live-variant numeric knobs not a transport-facing contract | P2 | hybrid |
| `013-duplicate-law-detection` | D1-R13 | Already-adopted laws → guard against duplicate re-port | P2 | enforceable |

## 3. ENFORCEMENT CEILING
On corpus/CI the build can enforce that the law, proof, or owner *exists and was cited*: routing aliases + gold modes (R2), fixture corpora with expected tell IDs and clean negatives (R4), registry-row/fixture completeness (R3), report-field presence and TODO scans (R5, R10), required card rows / before-after presence (R7, R8), JSON knob schema + range (R12), and duplicate-law detection (R13). It cannot prove the visual judgment is good: whether metrics are real (R5), whether a model internalizes a self-defect card (R3), or whether the chosen aesthetic is correct (R8) all stay advisory pending rendered/behavioral review.

## 4. SEQUENCING
P1 phases come first: `001`–`007` (D1-R1..R7). P2 phases follow: `008`–`013` (D1-R8..R13). Nothing in D1 is P0, so no phase blocks the broader enforcement build; the dimension is parallelizable once the P1 artifact shapes land. Two enforceable phases (R2, R4) gate the corpus benchmark and should land before their hybrid neighbors that assert against them.

## 5. RELATED
- Source: [[044-design-routing-and-integration-research]] research.md §4
