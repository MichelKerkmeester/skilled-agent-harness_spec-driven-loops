---
title: "Plan: Post-Review Remediation of the sk-design Remediation Program"
description: "Plan for fixing the verified 017-review findings: correct stale _db/_engine current-state references in the styles playbook, database README, 015 phase-map, and graph-metadata pointers, while preserving historical records and shipped code behavior."
trigger_phrases:
  - "post review remediation plan"
  - "fix stale db engine paths plan"
  - "017 findings remediation approach"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/018-post-review-remediation"
    last_updated_at: "2026-07-21T18:25:00Z"
    last_updated_by: "remediation"
    recent_action: "Executed the pointer + doc fixes per this plan."
    next_safe_action: "Validate + commit."
    blockers: []
    key_files:
      - ".opencode/specs/sk-design/015-styles-database-evolution/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-018-post-review-remediation-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Plan: Post-Review Remediation of the sk-design Remediation Program

<!-- ANCHOR:approach -->
## Approach

Apply the fixes on a fresh worktree at the origin tip (the primary tree was concurrently dirty and
behind). Separate genuine stale **pointers** (current-state references that should point at the moved
files) from **historical records** (what a packet did at its time), fixing only the former. Verify each
finding against the code before acting — which turned P1-006 from a fix into a documented refutation.
<!-- /ANCHOR:approach -->

---

<!-- ANCHOR:steps -->
## Steps

1. Fix the user-facing docs (playbook P1-002, database README P1-004) via ordered path replacements; verify every new path resolves.
2. Fix the `015` phase-map statuses (P1-003) and refresh the parent continuity.
3. Fix the `key_files` continuity pointers in `001`/`004` (P1-005), then regenerate graph-metadata + descriptions for `012`/`015`/`001`/`004`; confirm zero dead paths.
4. Verify P1-006 against the code + tests; do not change intentional behavior; document the refutation.
5. Author this packet, validate, commit, push.
<!-- /ANCHOR:steps -->

---

<!-- ANCHOR:risks -->
## Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Falsifying history by rewriting "Files Changed" tables | Scope path edits to `key_files` continuity + user-facing current-state docs only |
| Replacing stale refs with wrong new paths | Verify every rewritten path resolves to a real on-disk file |
| Altering intentional shipped code behavior (P1-006) | Verify reachability + tests first; refute rather than fix |
| Concurrent branch churn | Fresh worktree at origin tip `ed8f3e20d0`; conflict-free add-only packet |
<!-- /ANCHOR:risks -->
