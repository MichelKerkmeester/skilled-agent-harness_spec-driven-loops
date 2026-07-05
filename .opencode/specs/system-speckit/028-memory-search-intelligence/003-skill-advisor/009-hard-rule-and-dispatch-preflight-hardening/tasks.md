---
title: "Task Breakdown: Hard-rule enforcement + dispatch-reliability hardening (handoff) [template:level_2/tasks.md]"
description: "Forward-looking implementation task list for the hardening design. This is a plan-only phase — every task below is NOT STARTED and deferred to the implementation packet; nothing here has been executed."
trigger_phrases:
  - "hardening implementation tasks"
  - "dispatch linter task list"
  - "stall detector rollout tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/003-skill-advisor/009-hard-rule-and-dispatch-preflight-hardening"
    last_updated_at: "2026-07-05T05:56:04.453Z"
    last_updated_by: "claude-opus"
    recent_action: "Listed T00-T18 implementation handoff, all not-started"
    next_safe_action: "Operator resolves 6 open questions in decision-record"
    blockers: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Task Breakdown: Hard-rule enforcement + dispatch reliability hardening

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm each task is atomic, has a clear owner phase, and a completion signal.
- Do not mark tasks complete in a plan-only phase; completion belongs to the impl packet.
FAILURE MODES:
- Marking design tasks [x] as if implemented; vague tasks without a verification signal.
-->

---

<!-- ANCHOR:notation -->
## Task Notation

> **STATUS: PLAN ONLY.** Every task below is **NOT STARTED**. This phase produced a design; it did not
> execute any of it. This list is the handoff contract for the future implementation packet, in the
> rollout order fixed in `plan.md`. Do not mark anything `[x]` here — completion belongs to the
> implementation packet, not this design phase.

- `[ ]` not started · `[~]` in progress · `[x]` complete (none may be `[x]` in this phase).
- **T00** is a prerequisite gate; all other tasks depend on it.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T00 — Operator resolves the six open questions in `decision-record.md` (esp. Q2 default values
  and Q3 the PreToolUse block-response schema). Implementation must not begin on Q2/Q3 items before
  their answers exist.
- [ ] T01 — Flip Zod defaults `lagCeilingMs` + `progressHeartbeatSeconds` to non-zero in
  `executor-config.ts:277-278` (`progressHeartbeatSeconds: 60`, evidence-backed; `lagCeilingMs` per Q2).
- [ ] T02 — Flip the raw-alias default for `stallWatchdogMs` in `fanout-run.cjs:645-653` (the
  schema-bypass trap — must move together with T01, per Q2).
- [ ] T03 — Set all three keys explicitly in `deep_review_auto.yaml` + `deep_review_confirm.yaml`
  fanout-config build (defense in depth for the two production `/deep:review` entry points).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T04 — Re-walk `main()`'s summary→exit chain (`fanout-run.cjs:1809`, `:1819-1821`) to CONFIRM the
  inferred aggregation, then extend abnormal-exit classification (`:1702-1703`) to treat any non-null
  signal as abnormal and route abort-requeue into the non-zero exit bucket.
- [ ] T05 — Add a single-line stderr echo to `appendObservabilityEvent` on
  `stall_detected`/`orphan_requeued`/`aborted`.
- [ ] T07 — Add the `hard_rules` frontmatter slice to `cli-opencode/SKILL.md` and
  `cli-claude-code/SKILL.md` (scope per Q5), every rule `severity: warn` initially.
- [ ] T08 — Author `system-skill-advisor/mcp_server/lib/skill-graph/skill-hard-rules.ts` (small sibling
  parser; do not overload `doc-frontmatter.ts`).
- [ ] T09 — Extend `check-skill-doc-frontmatter.mjs` (or a SKILL.md twin) to validate
  `hard_rules[].check` against a known-checks enum so a typo fails CI loudly.
- [ ] T10 — Author `dispatch-rule-checks.mjs` (dependency-free pure functions keyed by `check` id).
- [ ] T11 — Author `cli-opencode/scripts/hooks/dispatch-preflight-lint.mjs` (fast-exit registry, read
  hard_rules off disk, run checks, block/warn, fail-open). Confirm the block-response schema (Q3) first.
- [ ] T12 — Wire the new `PreToolUse(Bash)` block in `.claude/settings.json`.
- [ ] T14 — B1: call the shared check module in-process after `buildLineageCommand(...)` returns, via
  `scripts/lib/cli-guards.cjs`, as a regression tripwire for the orchestrated path.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T06 — Extend existing fixtures (`fanout-run.vitest.ts`, `executor-config.vitest.ts`) to assert
  "non-zero default now fires"; add the AC-2 replay fixture (zero-iteration worker → bounded-window
  labeled event + non-zero orchestrator exit). Mutation-prove each.
- [ ] T13 — Add the AC-1 fixture (opencode run with/without `</dev/null` → block/warn vs clean pass).
- [ ] T15 — Burn in B2 for the operator-set window (Q4); promote `stdin-redirect-required` +
  `command-flag-for-slash-prompt` from `warn` to `block`.
- [ ] T16 — (Deferred, Option C) Gate-2 brief hard-rule echo with a new outside-cap `HARD_RULES_TOKEN_CAP`.
- [ ] T17 — (Optional) Full sqlite-backed `hard_rules` harvest, only if advisor *scoring* influence is wanted.
- [ ] T18 — (Optional, Q6) Re-verify `cli-dispatch-skill-preload.md`'s drifted claims.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

For the implementation packet (not this design phase):
- Both acceptance tests (AC-1, AC-2) pass with mutation-proved fixtures.
- Baseline-before/delta captured for the full deep-loop-runtime + skill-advisor test suites.
- No new comment-hygiene or alignment-drift findings.
- Every INFERRED ledger item in `decision-record.md` re-confirmed against the live code before its edit.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- `spec.md` — problem, scope, acceptance criteria (AC-1, AC-2).
- `plan.md` — the design, ranked options, per-component mount points, rollout order.
- `decision-record.md` — the D+B-over-A/C/E decision, the confirmed-vs-inferred ledger, and the six
  operator open questions (T00 gate).
- Cross-track: Option D is `004-deep-loop` surface work; B2+A′ are `003-skill-advisor`; B1 straddles both.
<!-- /ANCHOR:cross-refs -->
