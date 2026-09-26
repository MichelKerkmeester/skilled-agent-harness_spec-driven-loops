# Iteration 3 — RQ2: Push versus pull — failure modes on our code

Focus: the advisor's pushed brief vs the extension's model-pulled `skill_search`; the observed
`fail_open` + "CLI fallback timed out" data point; what a pull surface would change.

## Findings

### F3-1 — Push failure mode located: the timeout chain and its fail-open envelope

- **Orchestrator mechanism** [CONFIRMED]: pull has no prompt-path deadline at all — `skill_search`
  is an ordinary in-session tool (`context/pi-skill-orchestrator-main/src/index.ts:578-698`); its
  only latency is the extra tool round-trip the model chooses to spend.
- **Advisor counterpart** [CONFIRMED]: the pushed brief sits on the prompt critical path under a
  2500 ms default hook budget (`.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:106`),
  with a CLI fallback whose own default is 250 ms but is clamped to the caller's remaining budget
  (`.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:76`, `:145-158`).
  The observed 2026-09-26 log line "CLI fallback timed out" resolves verbatim to
  `skill-advisor-cli-fallback.ts:527-538` (`errorMessage: 'CLI_RETRYABLE_UNAVAILABLE exit 75:
  CLI fallback timed out'`), producing `status: 'fail_open'` with `reason: 'timeout'` and a
  retryable envelope (`:370-407`, `:113-122`). Fallback is attempted only when the primary brief
  is null (`:160-168`). The degraded local-scorer answer is deliberately mapped to `stale`, not
  `unavailable`, so it still renders `Advisor: stale` (`:313-321`); a live advisor with no
  above-threshold match is `no_recommendation`, explicitly not an outage (`:436-445`).
- **Proposed change**: when the hook emits the directives-only fallback, name the pull recovery
  surface in that text — `node .skilled/bin/skill-advisor.cjs advisor_recommend --json
  '{"prompt":"..."}' --format json` (contract at `.skilled/skills/system-skill-advisor/SKILL.md:297`)
  — so a fail-open turn is recoverable in-band instead of silent.
- **Benefit**: turns the observed failure class into a self-healing turn at zero prompt-path cost.
- **Cost**: one line in `renderAdvisorFallbackDirective`
  (`.skilled/skills/system-skill-advisor/runtime/lib/render.ts:443-448`).
- **Risk**: on a genuinely broken daemon the model may burn one tool call re-confirming the
  outage; acceptable because the fallback text is already delivered only on failure.
- **Verdict: ADAPT** — keep the push, but let the fail-open envelope carry the pull handle; the
  pull command already exists, it is just unnamed at the moment it would matter.

### F3-2 — Pull accuracy depends on query quality and a shallow ranker

- **Orchestrator mechanism** [CONFIRMED]: `skill_search` scores name/description by substring and
  token inclusion (`context/pi-skill-orchestrator-main/src/search.ts:19-38`) — exact-name 200,
  prefix 80, substring 60, description substring 35, small token bonuses. Zero active-scope
  matches triggers one automatic bounded global fallback search
  (`context/pi-skill-orchestrator-main/src/index.ts:666-685`), which papers over miss queries but
  cannot rank semantically.
- **Advisor counterpart** [CONFIRMED]: the pushed answer comes from a five-lane fused scorer
  (`.skilled/skills/system-skill-advisor/ARCHITECTURE.md:101`) with calibrated confidence and
  uncertainty, and the brief reports both (`runtime/lib/render.ts:435-438`). An ambiguity signal
  widens the brief to two labels (`.skilled/skills/system-skill-advisor/runtime/lib/render.ts:421-433`).
- **Proposed change**: if a pull surface is added, back it with the advisor scorer (the
  `advisor_recommend` CLI already does exactly this, `ARCHITECTURE.md:29`, `:101`), not with
  substring ranking; keep results bounded like the extension (≤5 default, ≤8 max — see RQ6).
- **Benefit**: pull results at push quality; the model gets semantic candidates on demand.
- **Cost**: wiring a tool/command wrapper over the existing CLI; no new scoring code.
- **Risk**: two sources of truth if push and pull disagree; mitigation — same handler, same
  thresholds (`skill-advisor-cli-fallback.ts:323-331` reuses the CLI's effective thresholds).
- **Verdict: ADAPT** — adopt the pull *shape* (bounded, metadata-only, scope-first) with the
  advisor's own scorer underneath.

### F3-3 — Pull-only is worse than push-only on this code; hybrid is the transferable design

- **Orchestrator mechanism** [CONFIRMED]: the extension makes the model discover capability needs
  itself; the scope stub is the only nudge (`context/pi-skill-orchestrator-main/src/scope.ts:104-118`),
  and correctness leans on instructions in the tool schema (`index.ts:583-587`).
- **Advisor counterpart** [CONFIRMED]: the push is gated by prompt policy so trivial prompts cost
  nothing (`.skilled/skills/system-skill-advisor/runtime/lib/prompt-policy.ts:60-67`) and the brief
  arrives before the model commits to an approach
  (`.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:5-6`).
- **Analysis**: pull-only loses the "before the model starts" timing advantage and adds one to two
  round-trips per capability discovery [INFERRED — would confirm with a routing-accuracy A/B where
  the same prompts run push-only vs pull-only against a labelled skill set]. Push-only loses every
  turn where the hook times out (F3-1). The hybrid keeps both floors.
- **Proposed change**: none beyond F3-1/F3-2; this finding records the verdict on "pull replaces
  push".
- **Benefit**: stops a redesign that would trade a measured failure mode (timeouts) for an
  unmeasured one (model never pulls).
- **Cost**: none.
- **Risk**: none.
- **Verdict: REJECT** (pull replacing push) — the advisor's push failures are transport failures
  with a defined envelope, while pull's failure mode is silent non-discovery that no envelope can
  report.

## Ruled out this iteration

- Reconstructing the exact 2026-09-26 dispatch trace — the log line maps 1:1 to
  `skill-advisor-cli-fallback.ts:533`; the underlying cause (cold daemon vs slow CLI) is not
  recoverable from the message and is not needed for the design verdict.
- Retry loops around the hook call — a prompt-path retry doubles worst-case latency inside a
  2500 ms budget; rejected without implementation per restraint rules.

## Claim ledger

| Claim | Status | What would confirm |
|-------|--------|--------------------|
| Observed "CLI fallback timed out" is `skill-advisor-cli-fallback.ts:533` | CONFIRMED | — (verbatim match) |
| Timeout chain: 2500 ms hook default → caller-clamped CLI fallback | CONFIRMED | — (`user-prompt-submit.ts:106`, `cli-fallback.ts:76,145-158`) |
| Degraded local-scorer answers render `stale`, not `unavailable` | CONFIRMED | — (`cli-fallback.ts:313-321`) |
| Pull-only would reduce routing accuracy vs push | INFERRED | A/B run of the same labelled prompt set under push-only vs pull-only |
| The advisor CLI is a complete pull surface already (recommend + status + rebuild) | CONFIRMED | — (`ARCHITECTURE.md:29,101`, `SKILL.md:297`) |
