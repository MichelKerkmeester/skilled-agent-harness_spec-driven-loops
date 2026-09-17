## Verdict

Not safe to run as edited. A retained publication using the old `.opencode` spelling can fail textual path checks during rollback or cleanup, leaving its lock in place and blocking the next write run (`.skilled/bin/compiled-route-sync.cjs:48,250-273,337-372,581-620`).

## Findings

| ID | Severity (P0 blocks the write run, P1 must fix before the write run, P2 should fix) | File:line | Scenario (the inputs and the wrong outcome) | Suggested fix |
|---|---|---|---|---|
| SRM-001 | P1 | `.skilled/bin/compiled-route-sync.cjs:250-273,366-372,581-620` | A publication created with `runtimeRoot=/repo/.opencode/bin/lib/compiled-routing` leaves `.opencode` in its persisted lock/state. The edited default uses `.skilled` (`:48`). An old-spelled rollback is rejected by the textual parent comparison (`:252`), while a `.skilled` spelling fails lock/state comparisons (`:371,588,606,620`). The retained lock then prevents the next build from creating its lock (`:337-347`). | Canonicalize runtime, rollback, lock and state paths with `fs.realpathSync` before comparison, including rollback-parent checks. |
Codex exit 0, 2026-09-17T14:16:12Z to 2026-09-17T14:23:26Z, --model gpt-5.6-luna, reasoning xhigh, service tier fast, --sandbox read-only.
