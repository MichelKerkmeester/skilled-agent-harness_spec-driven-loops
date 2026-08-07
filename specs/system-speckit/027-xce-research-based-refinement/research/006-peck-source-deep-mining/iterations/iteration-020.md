# Iteration 020 — UX integration: how each rule surfaces to the user

**Focus:** per-rule UX design (surface, message, interaction, friction) reusing existing spec-kit UX hooks.
**Executor:** cli-opencode `openai/gpt-5.5-fast` --variant high (read-only; orchestrator-written). **Status:** complete. **newInfoRatio:** 0.78.

## Findings (UX design — full table in `prompts/iteration-020.out`)
- **completion-freshness** → `/speckit:complete` Step 12 + `validate.sh --strict` summary. Message: "COMPLETION_FRESHNESS: evidence is stale after in-scope edits. Re-run verification, update checklist evidence, retry." Warn-first; show the 1 changed-since-verdict file + next command. friction med.
- **escalation** → `/speckit:complete` quality/reviewer gates. "ESCALATION_REQUIRED: implementation conflicts with spec… A) amend spec B) fix impl C) stop for user." One consolidated prompt only after contradiction/3-strike. friction med.
- **anti-softening** → deep-review verdict line. "VERDICT_LOCK: active P0 ⇒ FAIL. Do not relabel as partial/conditional." Exact final verdict stays parseable. friction low.
- **reviewer read-budget** → `@review`/`@deep-review` budget surfaces. "Read reason: verify <X>; not re-reading a new/full file." Only for non-diff/repeat reads; exempt P0 rereads. friction low.
- **numeric-severity** → deep-review report schema (optional advisory `riskScore`, never a blocker). friction low.
- **AC coverage** → checklist render + validation-rule style. "AC_COVERAGE WARNING: 8/10 ACs have evidence; floor 9/10. Add evidence or mark Manual—infeasible." Lifecycle opt-in; warn-first. friction med.
- **010 benchmark** → deep-improvement Lane B. "REVIEWER_BENCHMARK: fixture stale-verdict expected FAIL, got PASS — rule not safe to promote." friction med.

## UX anti-patterns to avoid
Wall-of-errors (aggregate by rule + one top fix) · cryptic failures (every new rule needs `How to Fix` wording) · blocking a fresh scaffold (AC gate honors lifecycle opt-in) · double-prompting (hooks = passive/fail-open context, not blocking prompts) · verdict ambiguity (keep exact PASS/CONDITIONAL/FAIL strings).

## Verdict contribution
UX rule: each new rule REUSES an existing surface + ships warn-first with an actionable, auto-fix-style message. Feeds the integration-plan UX section + each packet's UX requirements.
