# Opus xhigh review triage

Source: `opus-xhigh-review.md` beside this file. Each finding is a hypothesis until a test that fails before the fix confirms it.

Operator decisions taken 2026-11-23 (AskUserQuestion):
- Retry contradiction: the runner's rule (phase 003 REQ-011) wins. A run that already ran is never dispatched again. Phase 005 ADR-002 is amended.
- Definition drift: pin `stateRoot` and `identity` in the launchd job, and refuse scheduled and queued runs whose definition or config hash differs from the approved one. Phase 001 REQ-003 is amended.
- Timeout kill: fix the bots-owned precheck only. The shared executor half is a follow-up for the deep-loop owner.

| Finding | Severity | Citation check | Disposition |
|---|---|---|---|
| BOT-R-01 definition and config drift | P0 | `runner.ts:644-664` reads the checkout config and hashes the definition without comparing it: resolved | Fix with test |
| BOT-R-02 ignored files deleted on cleanup | P1 | `isolation.ts:600` has no `--ignored`, `:695` plain remove: resolved | Fix with test |
| BOT-R-03 drain re-runs finished bots | P1 | `request-drain.ts:110-111` retries every `failed`; `runner.ts:1053-1068` sets `result-event-unrecorded`: resolved | Fix with test, operator chose 003 |
| BOT-R-04 answered item loses its resume | P1 | Plausible chain | Fix with test (hold non-resume runs while a resume is pending) |
| BOT-R-05 timeout leaves children alive | P1 | Reviewer repro | Precheck fixed with test, executor half recorded as follow-up |
| BOT-R-06 drain discards queue on bare PATH | P1 | `request-drain.ts:110` retry path | Fix with test (environment stop) |
| BOT-R-07 hold check and lease not atomic | P2 | Plausible | Recorded, not fixed |
| BOT-R-08 `danger-full-access` allowed | P2 | Design choice in 003 ADR | Recorded, design question |
| BOT-R-09 corrupt registered-roots mid-install | P2 | Traced | Fix with test |
| BOT-R-10 killed run with no record | P2 | Traced | Recorded, not fixed |
| BOT-R-11 generation stamp lost update | P2 | Plausible | Recorded, not fixed |
| BOT-R-12 held schedules grow state | P2 | Partly recorded in 007 | Recorded, not fixed |
| BOT-R-13 checker warns on folder/id mismatch | P2 | `bot-check.cjs:184` advise vs `runner.ts:726` refuse: resolved | Fix with test |
| BOT-R-14 manual `--schedule-index` | P2 | Traced | Fix with test |
| BOT-R-15 rebuild deletes WAL files | P2 | Plausible | Recorded, not fixed |
| BOT-R-16 contract text mismatches | P2 | Read | Usage text fixed; 005 REQ-012 outcome name amended in spec |
| BOT-R-17 untested risky paths | P2 | Read | Covered by the tests added with each fix above |
