---
title: "Task Breakdown: Hard-rule enforcement + dispatch-reliability hardening (handoff) [template:level_2/tasks.md]"
description: "Implementation task list for the hardening. Core (Wave D + A′ + B2, T00-T13) shipped 2026-07-05; T14 (B1) and T15 (burn-in) remain. Per-task commit evidence in implementation-summary.md."
trigger_phrases:
  - "hardening implementation tasks"
  - "dispatch linter task list"
  - "stall detector rollout tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/002-skill-advisor/001-hard-rule-and-dispatch-preflight-hardening"
    last_updated_at: "2026-07-05T08:13:59.253Z"
    last_updated_by: "claude-opus"
    recent_action: "Shipped T00-T13 core; T14/T15 + optional remain"
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

> **STATUS: CORE SHIPPED 2026-07-05** (Q2=300000ms, operator go). Wave D + A′ + B2 are implemented,
> tested, and pushed — both acceptance tests met. Per-task commit evidence is in
> `implementation-summary.md`. Remaining: T14 (B1 fan-out guard, low value — deferred) and T15
> (warn→block burn-in promotion, operator-gated). T16–T18 stay optional/deferred by design.

- `[ ]` not started · `[~]` in progress · `[x]` complete.
- **T00** is a prerequisite gate; all other tasks depend on it.
- **Implementation deviations (authoritative account: `implementation-summary.md`):** the hard_rules
  parser + CI guard landed in a dependency-free `cli-opencode/scripts/lib/dispatch-rule-checks.mjs`
  (+ its `node --test` suite) rather than the advisor's `skill-hard-rules.ts` /
  `check-skill-doc-frontmatter.mjs`, so the PreToolUse hook stays daemon-free (T08/T09). T06's AC-2
  proof reuses the existing `stall_detected` fan-out test + the D-exit-truth unit coverage rather than
  a new replay fixture. T03 is covered by the schema-level defaults (the YAML passes
  `{config.fanout_json}` through `parseFanoutConfig`, so no per-YAML literal is needed).
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T00 — Operator resolves the six open questions in `decision-record.md` (esp. Q2 default values
  and Q3 the PreToolUse block-response schema). Implementation must not begin on Q2/Q3 items before
  their answers exist.
- [x] T01 — Flip Zod defaults `lagCeilingMs` + `progressHeartbeatSeconds` to non-zero in
  `executor-config.ts:277-278` (`progressHeartbeatSeconds: 60`, evidence-backed; `lagCeilingMs` per Q2).
- [x] T02 — Flip the raw-alias default for `stallWatchdogMs` in `fanout-run.cjs:645-653` (the
  schema-bypass trap — must move together with T01, per Q2).
- [x] T03 — Set all three keys explicitly in `deep_review_auto.yaml` + `deep_review_confirm.yaml`
  fanout-config build (defense in depth for the two production `/deep:review` entry points).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T04 — Re-walk `main()`'s summary→exit chain (`fanout-run.cjs:1809`, `:1819-1821`) to CONFIRM the
  inferred aggregation, then extend abnormal-exit classification (`:1702-1703`) to treat any non-null
  signal as abnormal and route abort-requeue into the non-zero exit bucket.
- [x] T05 — Add a single-line stderr echo to `appendObservabilityEvent` on
  `stall_detected`/`orphan_requeued`/`aborted`.
- [x] T07 — Add the `hard_rules` frontmatter slice to `cli-opencode/SKILL.md` and
  `cli-claude-code/SKILL.md` (scope per Q5), every rule `severity: warn` initially.
- [x] T08 — Author `system-skill-advisor/mcp_server/lib/skill-graph/skill-hard-rules.ts` (small sibling
  parser; do not overload `doc-frontmatter.ts`).
- [x] T09 — Extend `check-skill-doc-frontmatter.mjs` (or a SKILL.md twin) to validate
  `hard_rules[].check` against a known-checks enum so a typo fails CI loudly.
- [x] T10 — Author `dispatch-rule-checks.mjs` (dependency-free pure functions keyed by `check` id).
- [x] T11 — Author `cli-opencode/scripts/hooks/dispatch-preflight-lint.mjs` (fast-exit registry, read
  hard_rules off disk, run checks, block/warn, fail-open). Confirm the block-response schema (Q3) first.
- [x] T12 — Wire the new `PreToolUse(Bash)` block in `.claude/settings.json`.
- [ ] T14 — B1: call the shared check module in-process after `buildLineageCommand(...)` returns, via
  `scripts/lib/cli-guards.cjs`, as a regression tripwire for the orchestrated path.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T06 — Extend existing fixtures (`fanout-run.vitest.ts`, `executor-config.vitest.ts`) to assert
  "non-zero default now fires"; add the AC-2 replay fixture (zero-iteration worker → bounded-window
  labeled event + non-zero orchestrator exit). Mutation-prove each.
- [x] T13 — Add the AC-1 fixture (opencode run with/without `</dev/null` → block/warn vs clean pass).
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
- Cross-track: Option D is `004-deep-loop` surface work; B2+A′ are `002-skill-advisor`; B1 straddles both.
<!-- /ANCHOR:cross-refs -->
