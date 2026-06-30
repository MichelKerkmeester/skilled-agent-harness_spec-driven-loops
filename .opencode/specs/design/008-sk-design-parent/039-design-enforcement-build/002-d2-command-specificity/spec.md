---
title: "D2 — Command Specificity & Usefulness"
description: "Build the D2 design-command surface as one phase per recommendation (D2-R1..R13): a command-metadata.json SSOT plus a deterministic surface checker that restores real per-mode contracts to the five identical /design:* wrappers."
trigger_phrases:
  - "d2 command specificity build"
  - "design command phases"
  - "design slash command backlog"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/002-d2-command-specificity"
    last_updated_at: "2026-06-30T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Documented D2 command specificity phase parent"
    next_safe_action: "Execute child phases under this parent"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-parent-154-039-d2-command-specificity"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-phase-parent | v1.0 -->
# D2 — Command Specificity & Usefulness

## 1. PURPOSE
The five `/design:*` wrappers are byte-templated thin bridges: identical generic `argument-hint: "<design request>"`, identical mutating toolset, and a bare `STATUS=OK|FAIL` tail. Every gap traces to one root — the command surface erases the mode-specific contracts that already live in the child packets, and no single metadata source projects or drift-checks them. The buildable fix is a sibling `command-metadata.json` SSOT (ownerMode → `workflowMode`, keeping `mode-registry.json` routing-only) plus a deterministic `design-command-surface-check`.

## 2. RECOMMENDATIONS (one phase each)
| Phase folder | ID | Title | Sev | Class |
|--------------|----|-------|-----|-------|
| 001-strip-tool-over-grant | D2-R1 | Wrapper tool over-grant: read-and-guide modes get Write/Edit/Bash | P0 | enforceable |
| 002-per-mode-arg-grammar | D2-R2 | Generic `<design request>` arg-hint → per-mode arg grammar | P0 | enforceable |
| 003-command-metadata-ssot | D2-R3 | Metadata fragmented across wrapper/hub/registry; no SSOT or drift gate | P0 | enforceable |
| 004-invocation-example-and-returns | D2-R4 | No concrete invocation example or `Returns:` line | P1 | enforceable |
| 005-deliverable-output-contract | D2-R5 | Deliverable shape unspecified — only STATUS=OK/FAIL | P1 | enforceable |
| 006-sibling-discriminator | D2-R6 | No sibling discriminator / `deferToHubWhen` at command layer | P1 | hybrid |
| 007-preconditions-and-failure-modes | D2-R7 | Preconditions & failure modes unnamed | P1 | hybrid |
| 008-register-pinning | D2-R8 | Register (Brand/Product) not pinnable at command entry | P1 | hybrid |
| 009-pipeline-handoff-visibility | D2-R9 | No pipeline/handoff visibility across the five commands | P1 | hybrid |
| 010-user-intent-framing | D2-R10 | Command-as-mode framing leads with "Thin bridge / Pin mode" not user intent | P2 | hybrid |
| 011-interface-intent-lanes | D2-R11 | Interface mode hides 11 intent lanes behind one bridge | P2 | hybrid |
| 012-promote-task-verbs | D2-R12 | High-value task verbs buried in references/aliases | P2 | advisory |
| 013-description-role-projection | D2-R13 | Descriptions treated as auto-trigger, but NL collapses to the hub | P2 | hybrid |

## 3. ENFORCEMENT CEILING
Enforceable: the metadata-drift gate (wrapper frontmatter must equal `command-metadata.json`), arg-grammar presence (no surviving `<design request>`), tool-policy parity, ownerMode→workflowMode + alias-uniqueness, presence of example/Returns/discriminator/precondition/register/pipeline sections, non-generic artifact names, and gold-corpus replay (direct-command-loads-packet, Brand≠Product dials). Advisory: editorial wording and the Brand/Product call on genuinely mixed surfaces. Honest residual: a least-privilege surface still cannot guarantee taste, and NL→specific-command auto-selection is provable only inside the fixture corpus.

## 4. SEQUENCING
Build the SSOT first. D2-R3 (`command-metadata.json` + `design-command-surface-check.mjs`) is the spine the other phases generate from and drift-check against. The remaining P0s land next — D2-R1 (strip tool over-grant) and D2-R2 (per-mode arg grammar) — then the P1 contract sections (R4–R9), then the P2 framing/projection work (R10–R13).

## 5. RELATED
- Source: [[044-design-routing-and-integration-research]] research.md §5
