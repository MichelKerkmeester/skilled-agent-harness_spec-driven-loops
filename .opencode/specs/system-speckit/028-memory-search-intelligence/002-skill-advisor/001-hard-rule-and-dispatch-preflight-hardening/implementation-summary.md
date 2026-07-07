---
title: "Implementation Summary: hardening core shipped (Wave D + A′ + B2) [template:level_2/implementation-summary.md]"
description: "The hardening design was implemented on-branch 2026-07-05 (Q2=300000ms): Wave D stall-detector defaults + exit-truth (deep-loop-runtime) and A′+B2 hard_rules dispatch linter (cli-opencode). Both acceptance tests met; B1 + burn-in are follow-up."
trigger_phrases:
  - "hardening plan implementation summary"
  - "dispatch linter design status"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/002-skill-advisor/001-hard-rule-and-dispatch-preflight-hardening"
    last_updated_at: "2026-07-06T18:49:53.017Z"
    last_updated_by: "claude-opus"
    recent_action: "Shipped Wave D + A′+B2; both acceptance tests met"
    next_safe_action: "Operator resolves 6 open questions in decision-record"
    blockers: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Hard-rule enforcement + dispatch reliability hardening

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Core implementation SHIPPED (Wave D + A′ + B2); both acceptance tests met; B1 + burn-in are follow-up |
| **Level** | 2 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Deliverable** | Shipped code: stall-detector defaults + exit-truth (deep-loop-runtime); hard_rules dispatch linter (cli-opencode) |
| **Date** | 2026-07-05 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The design was implemented on `system-speckit/028-memory-search-intelligence` (2026-07-05, Q2=300000ms).
Both acceptance tests are satisfied.

**Wave D — deep-loop stall reliability (AC-2):**
- Stall detection defaults flipped ON: `lagCeilingMs` 0→300000, `progressHeartbeatSeconds` 0→60
  (`executor-config.ts`) + the `stallWatchdogMs` raw-alias default 0→300000 (`fanout-run.cjs`, the
  schema-bypass reader — all three together) — commit `5bc0a3037c`.
- Abnormal-exit classification widened: any non-SIGTERM signal-kill now fails loud instead of being
  masked as exit-0 success (`fanout-run.cjs`) — commit `37c9eed7b4`.
- Loud-signal: `stall_detected`/`orphan_requeued`/`aborted` mirrored to stderr
  (`observability-events.cjs`) — commit `3ad2c5e52c`.

**Wave A′ + B2 — skill-advisor dispatch enforcement (AC-1):** commit `015a18437a`
- `hard_rules:` frontmatter on `cli-opencode` + `cli-claude-code` SKILL.md.
- `dispatch-rule-checks.mjs` (dependency-free parser + pure checks) + `dispatch-preflight-lint.mjs`
  (PreToolUse(Bash) hook — warn-first, fail-open) + `.claude/settings.json` wiring + a `node --test` suite.

**Verification:** deep-loop-runtime targeted suites 49/49 (incl. the existing `stall_detected` test); the
dispatch linter 6/6 (`node:test`) incl. the AC-1 both-directions mutation guard and a CI unknown-check
guard; the PreToolUse hook confirmed end-to-end (warns on missing `</dev/null`, silent with it,
fast-exits on non-dispatch, fails open on malformed payload). Baselines captured before each change; the
only test touched (the old default-off assertion) was updated to the new contract.

**Not yet shipped (follow-up):** T14 B1 fan-out in-process guard (low marginal value — fan-out spawns are
already stdin-safe by construction; deferred to avoid a cross-skill ESM→CJS import); T15 the warn→block
promotion of `stdin-redirect-required` / `command-flag-for-slash-prompt` (operator-gated burn-in). The
sqlite-backed hard_rules harvest and the Gate-2 brief echo (option C) remain deferred by design.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

- The investigation was outsourced to a two-thread Sonnet-5 (max-effort) workflow plus a synthesis pass
  (604K subagent tokens, 3/3 agents, 0 errors): thread 1 = skill-advisor/skill-preload surface; thread 2
  = dispatch/executor reliability (forensically grounded in real `orchestration-status.log` evidence
  across 4 packets).
- The synthesis bound both threads with one thesis: wire an existing/cheap machine check into the
  dispatch execution path rather than adding more docs (thread 1) or another advisory surface (thread 2).
- Load-bearing claims were verified by direct read/grep of the live repo during the synthesis pass; the
  few inferred sub-steps are labeled for re-confirmation before coding.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Ship D + B (enforceable), A′ as substrate; defer C; reject E standalone.** D and B are the only two
  options that can stop or truthfully fail a bad state without depending on an agent choosing to comply.
- **Home the plan in `002-skill-advisor/009` in full, with a cross-reference to `004-deep-loop`** rather
  than split it — the design is one cohesive thesis and the user's primary framing was skill-advisor
  hardening. Provisional; the operator may re-home (open Q1).
- Full rationale and the confirmed-vs-inferred ledger live in `decision-record.md`.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Plan-only; "done" = the design is complete and self-contained, not that any behavior changed.
- Both threads' findings are captured with file:line evidence (`plan.md` §Findings).
- Both acceptance tests map to a design element: AC-1 → Option B2; AC-2 → Option D (`plan.md` §Testing).
- Every recommended component names a confirmed mount point; inferred sub-steps flagged (`decision-record.md`).
- `validate.sh --strict` on this folder: template headers/anchors clean; GENERATED_METADATA_INTEGRITY
  path-prefix invariant passed (the `system-speckit` prefix matches disk + the 028 packet root).
- No production behavior changed, so no test suite was run for this phase — implementation verification
  is deferred and listed in `tasks.md`.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- Three inferred ledger items must be re-confirmed against live code before their edits: the
  abnormal-exit aggregation chain in `main()`, the two `/deep:review` YAML line numbers, and the exact
  Claude Code PreToolUse block-response schema.
- The `stallWatchdogMs`/`lagCeilingMs` default (proposed 5 min) is an informed proposal, not
  evidence-backed like `progressHeartbeatSeconds: 60`.
- The stale `system-spec-kit`→`system-speckit` prefix on the `002-skill-advisor` parent and its 001-008
  children is left as-is — a separate, operator-gated subtree reconciliation out of this phase's scope.
<!-- /ANCHOR:limitations -->
