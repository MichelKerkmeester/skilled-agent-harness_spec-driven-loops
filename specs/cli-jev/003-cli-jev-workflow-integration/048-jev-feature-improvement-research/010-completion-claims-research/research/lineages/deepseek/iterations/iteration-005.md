# Iteration 5: Q5 - what a default-on integration needs, cost and risk

## Focus

Turn the previous findings into the requirements, measured cost and risk register for running the judge by default in the completion sentinel, and rank the first step.

## Findings

### F5-01 - Role choice comes first

Three integrations are possible: regex replacement (3 calls per turn, ~1s serial), adjudicator behind the existing gate (3 calls per firing turn; the gate fired on 7/110 = 6.4% of this corpus), or shadow scorer (offline, no user effect). The 026 measurement only adjudicates the replacement role; today's stop (margin) is a verdict on that role.
[SOURCE: score-completion-claims.mjs:722-839; census fires 7/110; 047 stdout "planned calls: jev=331"]

### F5-02 - Per-surface latency budgets bound the judge

Claude Stop: timeout 10, async true. Codex/Devin Stop: timeout 10. Pi turn_end: advisory delivered `deliverAs: nextTurn`, non-blocking. OpenCode session.idle: blocks the whole plugin host — the one surface needing an async path or strict sub-budget. The scorer's 90s per-call timeout must not cross into hooks; the sentinel's own evidence check runs at a 1.2s default (NFR under 1.5s).
[SOURCE: .claude/settings.json:180-181; .codex/hooks.json:139; .devin/hooks.v1.json:171]
[SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/pi/completion-evidence.ts:81-97]
[SOURCE: completion-evidence-sentinel.cjs:45-53,90-94; score-completion-claims.mjs:78]

### F5-03 - Availability and identity must be pinned

`jevGate` skips the arm when jev is absent or the credential misses, so default-on needs "judgment unavailable = degrade to regex-only", a pinned jev 0.6.2/model identity, and a requalify rule on provider/model change (the scorer prints "requalify: model changed").
[SOURCE: score-completion-claims.mjs:650-683,827-833]
[SOURCE: 047 stdout jev_version=0.6.2 provider=official model=jev-1.13.0]

### F5-04 - Privacy is a hard gate

The judge forwards the turn tail verbatim; the scorer requires `--accept-payload`; 047 required "Jev gets no secret" with a 0-match secret scan. Default-on needs explicit consent and a stripping pass before any tail leaves the machine.
[SOURCE: cli-jev/SKILL.md (state-is-a-secret exclusion); score-completion-claims.mjs:729,971-974]
[SOURCE: 047 spec.md:120 REQ-003; 047 results.md:15 (secret scan 0 matches)]

### F5-05 - Measured cost scales with turns

331 calls per 110 rows (3 reruns + auth), 24,735 estimated input tokens (~225/turn), p50 320 ms / p95 391 ms per call. A replacement-role default-on is ~3 calls and ~1s serial per turn — ~3,000 calls per 1,000 turns at these rates. Advisory dedup exists; a text-hash judgment cache does not and would bound repeats.
[SOURCE: 047 stdout; calls.jsonl aggregation; completion-evidence-sentinel.cjs:292-309]

### F5-06 - The failure semantics are already right; two additions

All adapters fail open and are advisory-only (the Claude adapter never emits a block decision); kill switches and bounded log/dedup/retention exist. A judge must inherit these plus a strict per-call timeout and a circuit breaker after repeated unavailability.
[SOURCE: claude/completion-evidence-stop.cjs:17-20; completion-evidence-sentinel.cjs:489-547,321-340,449-474]
[SOURCE: .skilled/hooks/shared/hook-flags.cjs:63-69]

### F5-07 - The measurement gate is not passed yet

047's stop (margin) is the replacement-role verdict, and the passing threshold 0.7 replay is post-hoc at exact margin equality. Default-on requires a pre-registered role and threshold plus a held-out keep with cost inside the rule; the recorded rowsSha256/labelsSha256/calls.jsonl make the re-run exact.
[SOURCE: 047 results.md:15; calls.jsonl threshold replay; score-completion-claims.mjs:991-1022]

### F5-08 - Ranked first step: fix the gate, shadow the judge

Highest value, lowest risk: vocabulary plus closing-anchor fixes at zero per-turn cost and no new privacy exposure; keep the judge offline/shadow; fold the sibling judgment (spec-folder resolution) into the same label workspace. The judge stays available for audits and later adjudication once a pre-registered held-out keep exists.
[SOURCE: F2-01..F2-03; F4-03; F5-04]

## Risk register

| Risk | Why it bites | Mitigation required before default-on |
|---|---|---|
| Latency on a blocking surface | OpenCode session.idle blocks the host; codex/devin Stop share the 10s window | async path or sub-budget; per-call timeout ~2s; fail-open |
| Silent identity change | a new provider model moves the answers that moved the verdict | pin jev 0.6.2 + model; requalify line on change |
| Privacy exposure | the tail is session text forwarded verbatim | consent + stripping; honor the audit's accept-payload precedent |
| Cost creep | 3 reruns per turn, forever | caching, single-rerun near-threshold policy, call budget |
| Tuned-metric inflation | threshold/pattern chosen on the measuring rows | pre-registration + held-out split; report both |
| Wrong advisory fatigue | false advisories erode trust in the sentinel | keep advisory-only; keep dedup; fix precision first |
| Judge replaces evidence | judgment is not evidence | judge may gate; check-completion.sh stays the evidence source |

## Sources Consulted

- Runtime wiring: `.claude/settings.json`, `.codex/hooks.json`, `.devin/hooks.v1.json`, `.pi/extensions/`, `.opencode/plugins/system-completion-sentinel.js`
- `.skilled/skills/system-spec-kit/runtime/hooks/lib/completion-evidence-sentinel.cjs` (timing, dedup, fail-open paths)
- `.skilled/skills/system-spec-kit/runtime/hooks/claude/completion-evidence-stop.cjs`, `hooks/pi/completion-evidence.ts`
- `.skilled/skills/cli-classifier/cli-jev/SKILL.md`
- `~/.skilled/.labels/runs/047-026-jev-20261002/` artifacts; 047 `spec.md`, `results.md`
- Commands: wiring reads, cost aggregation, threshold replay (read-only)

## Assessment

- newInfoRatio: 0.82
- Novelty justification: Turns the audit verdict into a role-specific integration decision, with per-surface budgets from the actual wiring files and a cost model from the recorded calls; the ranked first step separates the free regex fix from the unpriced judge.
- Confidence: high on budgets, cost and privacy facts; medium on the production turn-rate (no telemetry on Stop frequency was collected here).

## Reflection

- Worked: reading the wiring files for real timeout/async values instead of assuming one budget.
- Failed: no data on Stop-hook frequency, so cost-per-day is left as an arithmetic model, not a measurement.
- Ruled out: carrying the scorer's 90s call timeout into a hook; default-on with the judge as the primary gate before a held-out keep.

## Recommended Next Focus

Synthesis: rank the recommendations across Q1-Q5 with evidence, and record the max-iterations stop.
