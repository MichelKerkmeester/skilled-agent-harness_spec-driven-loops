---
title: "Decision Record: D+B over A/C/E, and the six operator open questions [template:level_3/decision-record.md]"
description: "Records why the recommended hardening design ships the two enforceable options (D stall-detector defaults, B dispatch preflight linter) with A as substrate, defers C, and rejects E as standalone; plus the confirmed-vs-inferred evidence ledger and the six questions only the operator can answer."
trigger_phrases:
  - "hardening design decision record"
  - "dispatch linter open questions"
  - "stall detector default decision"
importance_tier: "high"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record-core | v2.2 -->
# Decision Record — Hard-rule enforcement + dispatch reliability hardening

## Context

Two-thread Sonnet-5 (max-effort) deep research + synthesis, 2026-07-05, investigating (thread 1) the
skill-advisor / skill-preload surface and (thread 2) dispatch/executor reliability. The user's ask was
to harden the system so a critical skill hard-rule (the `</dev/null` stdin rule) is reliably checked
before acting — and, explicitly, to cover dispatch reliability beyond the skill-advisor angle. This
record captures the decisions the design commits to and the questions it deliberately leaves open.

## Decision 1 — Ship D + B (enforcement core), A′ as substrate; defer C; reject E standalone

**Chosen.** D (flip the shipped-but-off fan-out stall detectors + truthful abnormal-exit) and B (a
dispatch preflight linter with a PreToolUse hook + an in-process fan-out guard) are the **only two
enforceable** options — they stop or truthfully fail a bad state without depending on an agent choosing
to comply. A′ (a minimal `hard_rules` SKILL.md frontmatter slice) is included as **substrate**: it lets
B be data-driven (skills declare their own rules) rather than a hardcoded pattern table that drifts as
new `cli-X` skills appear.

**Rejected alternatives:**
- **A or C alone** — both advisory; neither passes either acceptance test. Both incidents are cases
  where advisory-only controls already failed once (A: prose density is already maximal; the analogue of
  D: three detectors already shipped and simply unused). C is deferred (defense-in-depth, second wave),
  not killed.
- **E (self-attested acknowledge-checklist) as a standalone mechanism** — **rejected.** This exact
  control shape already exists in the repo (`constitutional/cli-dispatch-skill-preload.md`) and
  demonstrably rotted within weeks, never preventing the incident it targets. A self-graded checklist
  adds ceremony, not a backstop. If any acknowledge signal is wanted, derive it from B's machine-computed
  linter verdict, not an LLM self-report.

**Why this is the right cut:** it is the minimal set that (a) covers both threads, (b) passes both
acceptance tests, and (c) reuses existing shipped code/patterns (the doc-frontmatter harvest, the three
detectors, the existing hook-wiring convention) rather than inventing new infrastructure.

## Decision 2 — Home the plan in `003-skill-advisor`, in full, with a cross-reference

**Chosen (provisional — see open Q1).** The plan is genuinely cross-cutting: D is pure `004-deep-loop`,
B2+A′ are pure `003-skill-advisor`, and B1 straddles both. The user's primary framing was skill-advisor
hardening ("check that skill next time"), with dispatch reliability as the explicit secondary. The design
is one cohesive thesis, so splitting it into twin phases would fragment it. It is therefore homed here in
`003-skill-advisor/009` in full, with an explicit cross-reference to the `004-deep-loop` track for the D
thread. The operator may re-home it (open Q1) — as a plan doc it moves cleanly with `git mv`.

## Confirmed-vs-inferred evidence ledger

Load-bearing claims in `plan.md`, split by how they were established:

**CONFIRMED this pass (direct read/grep of the live repo):**
- The Gate-2 brief surface carries only skill name + confidence/uncertainty + freshness + universal
  boilerplate — no hard-rules (render templates + renderer input type).
- Zero `hard_rules`-type frontmatter key exists across the 18 top-level SKILL.md files.
- `executor-config.ts:277-278` Zod defaults for `lagCeilingMs`/`progressHeartbeatSeconds` are `0`.
- `fanout-run.cjs:645-653` reads `stallWatchdogMs` via a raw alias reader that bypasses the Zod schema
  (the partial-fix trap).
- The three detector knobs already have configurable test fixtures (`fanout-run.vitest.ts`,
  `executor-config.vitest.ts`).
- `buildLineageCommand` exists at ~`fanout-run.cjs:1295-1373`; the guard sibling is
  `scripts/lib/cli-guards.cjs` (not `lib/cli-guards.cjs`).
- No existing `PreToolUse` hook / `permissionDecision` usage anywhere in the repo (zero grep hits).
- `HYGIENE_DIRECTIVE` is 202 chars; `parseRecommendations` is an explicit field-by-field mapper.
- 028 track structure: `003-skill-advisor` has children 001-008 (next 009); `004-deep-loop` has 001-007.

**INFERRED / per-source-report (re-confirm before coding):**
- The exact abnormal-exit aggregation from an abort-requeue event to the final `process.exit(...)` code
  (`fanout-run.cjs:1809`, `:1819-1821`) — mount points cited by thread 2, but the chain was not
  re-walked in the synthesis pass. **Re-read `main()` before implementing D-step-2.**
- The precise `deep_review_auto.yaml`/`deep_review_confirm.yaml` line numbers for the fanout-config
  build (per thread 2).
- The exact Claude Code PreToolUse block-response schema for the installed version (no in-repo precedent).

## Open questions for the operator

1. **Plan-doc home** — keep at `003-skill-advisor/009`, move to `004-deep-loop/008` (D is the larger
   thread by shipped-code reuse), or split into twin phases with a cross-reference. No in-repo precedent
   for a genuinely dual-owned phase was found. *(Provisional: homed at 003/009 — Decision 2.)*
2. **`stallWatchdogMs` / `lagCeilingMs` default** (proposed 300000ms / 5 min) is an informed proposal,
   not evidence-backed the way `progressHeartbeatSeconds: 60` is (90-min working precedent). Too
   aggressive risks false-aborting a slow-but-healthy lineage; too lax reopens the detection gap.
3. **PreToolUse hard-block response contract** — confirm the exact current Claude Code hook response
   schema before B2 is implemented; do not assume a field shape.
4. **Burn-in window + false-positive tolerance** before promoting `stdin-redirect-required` /
   `command-flag-for-slash-prompt` from `warn` to `block` (e.g. N days / M dispatches with zero false
   positives).
5. **A′ frontmatter scope at v0** — proposed `cli-opencode` + `cli-claude-code` only. Confirm whether
   other skills with real invocation gotchas (destructive-scope skills, `mcp-open-design`) get
   `hard_rules` in the same pass or a later wave.
6. **Bundle the `cli-dispatch-skill-preload.md` drift re-verify** (its unverified example claim + stale
   `last_confirmed` date) into the same implementation packet, or track separately — cheap, and directly
   closes a credibility gap the investigation surfaced, but outside the two named acceptance tests.
