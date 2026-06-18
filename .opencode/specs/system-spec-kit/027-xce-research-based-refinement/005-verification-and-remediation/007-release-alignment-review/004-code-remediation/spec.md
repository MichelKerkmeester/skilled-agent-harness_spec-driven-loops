---
title: "Feature Specification: Code vs sk-code Remediation (Track B)"
description: "Fix the confirmed OpenCode-surface code findings from the 027 release-alignment review so code aligns with sk-code standards, via gpt-5.5-fast general+sk-code fixer seats."
trigger_phrases:
  - "code sk-code remediation"
  - "027 code alignment fix"
  - "track B code remediation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/007-release-alignment-review/004-code-remediation"
    last_updated_at: "2026-06-18T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Author code remediation spec and plan"
    next_safe_action: "Record remediation outcome and verification in implementation-summary"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-18-027-code-remediation"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

## Overview

Remediate the confirmed sk-code OpenCode-surface misalignments surfaced by the Track B review (`../002-code-vs-sk-code-opencode/review/findings-all.json`). The raw P0 count was inflated ~3x by false positives; this packet fixes only the confirmed subset, behavior-neutral.

## Scope

In scope: comment-hygiene ephemeral-id cleanup (drop the perishable label, keep the durable WHY), shell `set -euo pipefail`, `any[]`→typed public DB row, module headers, and opted-in P2 style nits (catch-typing, TSDoc).

Out of scope (binding do-not-fix — confirmed false positives): `// Feature catalog:` comments (allowed), TSDoc `@example` values, `dist/` build output, and any finding that does not reproduce against the live file.

## Acceptance Criteria

- Confirmed findings fixed; no behavior change.
- `tsc` clean (spec-kit, advisor, code-graph); `check-comment-hygiene` 0 violations; shell strict-mode + `bash -n` clean; node/py syntax clean.
- No false-positive cluster edited; no out-of-scope file changed (file-disjoint seats; changed ⊆ allowed).
- Affected test spot-check passes vs baseline; changes committed scoped.

## Execution

Executor, slicing, and verification gates in `plan.md`. Outcome in `implementation-summary.md`.
