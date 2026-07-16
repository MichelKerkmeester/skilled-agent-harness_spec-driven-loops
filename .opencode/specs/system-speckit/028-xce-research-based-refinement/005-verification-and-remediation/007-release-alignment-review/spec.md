---
title: "Feature Specification: Release-Alignment Review and Remediation (Phase Parent)"
description: "Phase-parent for the 027 release-alignment program: a 36-seat gpt-5.5-fast review of every README vs current reality and all OpenCode-surface code vs sk-code standards, followed by a fixer-fleet remediation of the confirmed findings."
trigger_phrases:
  - "027 release alignment review"
  - "readme vs 027 alignment"
  - "code vs sk-code alignment"
  - "release alignment remediation"
  - "027 doc currency review"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-xce-research-based-refinement/005-verification-and-remediation/007-release-alignment-review"
    last_updated_at: "2026-06-18T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Author release-alignment-review phase-parent control trio"
    next_safe_action: "Validate or resume a child phase folder"
    blockers: []
    key_files:
      - "spec.md"
      - "synthesis.md"
      - "001-readmes-vs-027/review/findings-all.json"
      - "002-code-vs-sk-code-opencode/review/findings-all.json"
      - "003-readme-remediation/plan.md"
      - "004-code-remediation/plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-18-027-release-alignment"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT — root purpose, sub-phase list, and outcome only. -->

## Root Purpose

Establish, at release time for the 027 epic, whether the repository's documentation and code still tell the truth about the system the epic produced — and remediate where they do not. Two independent questions are answered by read-only fan-out review, then the confirmed gaps are fixed by a scope-locked writer fleet:

1. Are all README / code-README files across the public repo aligned with current post-027 reality (tool counts, schema version, removed features, agent rosters, daemon/CLI facts, dead links)?
2. Does the OpenCode-surface code align with `sk-code`'s OpenCode standards (structure, naming, error handling, comment hygiene, verification patterns, TS/CJS conventions)?

The program is deliberately split review-from-remediation: review finds and disposes (confirmed vs refuted), remediation fixes only the confirmed set. The round-2 disposition and false-positive exclusions are recorded in `synthesis.md`.

## Sub-Phases

| Child | Role |
|-------|------|
| `001-readmes-vs-027` | Read-only review: README currency vs 027 reality (18 seats). Findings in `review/findings-all.json`. |
| `002-code-vs-sk-code-opencode` | Read-only review: code vs sk-code OpenCode standards (18 seats). Findings in `review/findings-all.json`. |
| `003-readme-remediation` | Remediation: fix confirmed README drift via markdown fixer seats. |
| `004-code-remediation` | Remediation: fix confirmed code findings via general+sk-code fixer seats. |

`synthesis.md` (parent level) holds the cross-track round-2 disposition: confirmed clusters, refuted false positives (Feature-catalog comments, TSDoc examples, `dist/`, the correct CLI=37 tool count), and the surface-aware tool-count nuance.

## What Needs Done

The review is complete (36/36 seats) and the remediation is executed (252 fixes / 8 refuted across 192 files, verified tsc-clean + comment-hygiene-clean + syntax + spot-tests, committed). The remaining outcome the phases work toward: a doc-accuracy audit of the README rewrites (long-tail factual confirmation) and the per-child implementation summaries that record each remediation's verified result.
