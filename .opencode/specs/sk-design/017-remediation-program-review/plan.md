---
title: "Plan: Deep Review of the sk-design Remediation Program"
description: "Plan for a 10-iteration GPT-5.6-SOL forced-depth deep review of the Packet A/B/C shipped surface, pinned at HEAD 7b9d3b6b71, followed by an independent human verification pass over every finding before any verdict is reported."
trigger_phrases:
  - "sk-design remediation review plan"
  - "gpt-5.6-sol forced depth review plan"
  - "packet A B C review verify plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/017-remediation-program-review"
    last_updated_at: "2026-07-21T17:52:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Executed the review + verification per this plan."
    next_safe_action: "Operator decides remediation of the confirmed gaps."
    blockers: []
    key_files:
      - ".opencode/specs/sk-design/017-remediation-program-review/goal-file-manifest.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-017-remediation-review-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Plan: Deep Review of the sk-design Remediation Program

<!-- ANCHOR:approach -->
## Approach

Run a forced-depth (`stop-policy max-iterations`) 10-iteration review with `openai/gpt-5.6-sol` over a pinned, curated surface, then verify every finding against the code before reporting. Isolation and honesty are the two design goals: a fresh worktree pinned at `7b9d3b6b71` guarantees a stable target under concurrent branch churn, and a human verification pass guards against single-reviewer severity/scope inflation.

- **Executor:** cli-opencode `openai/gpt-5.6-sol`, high effort, normal speed, single lineage via `fanout-run.cjs` (Claude orchestrates cross-runtime — the correct topology for one cli-opencode executor).
- **Scope:** 118-file curated manifest (`goal-file-manifest.txt`); bundle data + concurrent deep-loop commits excluded.
- **Verification:** each finding re-checked at file:line; operator-CLI claims reproduced by running `operator.mjs`.
<!-- /ANCHOR:approach -->

---

<!-- ANCHOR:steps -->
## Steps

1. Pin a fresh worktree at `7b9d3b6b71`; author `spec.md` + `goal-file-manifest.txt` as the scope authority.
2. Configure a single SOL lineage (`fanout-config.json`); launch `fanout-run.cjs` with `--stop-policy max-iterations --lineage-timeout-hours 4`.
3. Let the loop run 10 forced iterations across correctness/security/traceability/maintainability.
4. Read the SOL report; verify all findings against the code (confirm / downgrade / refute).
5. Write the consolidated `review/review-report.md`; finalize packet docs + metadata; validate.
<!-- /ANCHOR:steps -->

---

<!-- ANCHOR:risks -->
## Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Concurrent branch churn moves the target mid-review | Fresh worktree pinned at `7b9d3b6b71` (immutable base) |
| Single-reviewer severity/scope inflation | Mandatory human verification pass before any verdict |
| `--dangerously-skip-permissions` dispatch blast radius | Isolated worktree (RM-8); review is read-only of the target |
| Fresh worktree missing git-ignored deps | Symlink runtime `node_modules`; `node:sqlite` is built-in |
<!-- /ANCHOR:risks -->
