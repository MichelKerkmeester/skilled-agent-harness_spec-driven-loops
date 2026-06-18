---
title: "Feature Specification: README Currency Remediation (Track A)"
description: "Fix the confirmed README / code-README drift found by the 027 release-alignment review so docs match current post-027 reality, via gpt-5.5-fast markdown fixer seats."
trigger_phrases:
  - "readme currency remediation"
  - "027 readme drift fix"
  - "track A doc remediation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/007-release-alignment-review/003-readme-remediation"
    last_updated_at: "2026-06-18T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Author README remediation spec and plan"
    next_safe_action: "Run the doc-accuracy audit and record results in implementation-summary"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-18-027-readme-remediation"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

## Overview

Remediate the confirmed README / code-README staleness surfaced by the Track A review (`../001-readmes-vs-027/review/findings-all.json`). The READMEs lag the code 027 shipped — stale tool counts, removed/renamed features described as present, dead links, old defaults. The fix restores currency surgically, README by README.

## Scope

In scope: confirmed drift themes — surface-aware tool counts (MCP 39 vs CLI 37), `/speckit:resume` spelling, local-first embedding defaults, deep-loop `improvement`-mode roster, removed cross-encoder/rerank docs, dead cross-skill links, advisor/code-graph factual drift, plus opted-in P2 cosmetics.

Out of scope (binding do-not-fix — confirmed false positives): the correct CLI=37 tool count, `// Feature catalog:` comments, TSDoc example values, and any claim that does not reproduce against the live file (refuted at fix time).

## Acceptance Criteria

- Confirmed stale claims corrected against live source; stale signatures gone (re-grep).
- No false-positive cluster edited.
- Doc-accuracy audit run over the rewrites; any wrong new value corrected.
- Changes committed scoped; review evidence retained in `../001-readmes-vs-027/review/`.

## Execution

Executor and slicing detail in `plan.md`. Outcome and verification in `implementation-summary.md`.
