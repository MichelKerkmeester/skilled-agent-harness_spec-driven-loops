# Supercov findings from the fresh Supergateway capture

No product bugs are fixed in this task. Application code/tests and all runtime
probes are unchanged. This records a real reproduction of a known integration
limit and the remaining capability/performance work; it does not relabel every
unresolved site as an application bug.

## REC-001: full-suite assertion JSON cannot be made small with site pagination

Status: **reproduced; open**. Previously noted generally; now confirmed on a
fresh ordinary Node archive.

Project: the existing Supergateway prototype worktree. Run:
`run_2e5d74892cf7c201`, with 84 passed tests and 504 passed assertion phases.

```sh
/Users/domas/Developer/supercorp/supercov/target/debug/supercov \
  runs run_2e5d74892cf7c201 asserted --limit 1 --json
```

Actual: exit 2, `RESPONSE_TOO_LARGE`, 129,943 bytes vs 65,536 maximum. The
candidate page contains only one site, but global tests, execution links and
diagnostics are still repeated. The error's suggestion to reduce `--limit`
cannot help when it is already one. Text queries and independent calibration
of the archive remain usable.

Expected: bounded shared-evidence retrieval with explicit continuation, or a
small summary linking to evidence pages. Do not silently truncate evidence or
raise the cap merely to hide the design limitation.

## REC-002: logger assertion dependencies remain unsupported

Status: **capability gap; open**, not a claim that the tests omit assertions.

Fresh calibration has 11 missed historical kills in `getLogger.ts`. Conditional
mock-call aliases, call arguments and prebuilt object selection are the main
paths to investigate. A call-count assertion must not be promoted to a proof
that argument values were checked; choosing one conditional branch does not
observe both branches. Existing channel-level mock modeling also deserves
negative controls before being extended.

Keep the fixed 100-mutant denominator and the original prediction rules while
checking any extension. Current result is 84 correct, four false kills, 12
missed kills (two explicitly unknown). The target check at 85 correctly fails.

## REC-003: <10% total test overhead remains unestablished

Status: **performance finding needing controlled measurement**, not an isolated
root-cause diagnosis.

The single native/instrumented full-suite pair was 37.493 → 43.814 s, +16.9%.
Existing assertion markers stayed enabled; none were added. Separate runner
cost from build/workspace/query cost and from the earlier incremental +0.9%
assertion-marker measurement. Use matched alternating runs before assigning
the regression to a particular subsystem or claiming the budget is met.

[Detailed results and reproducible checks](asserted-supergateway-recapture-2026-09-09.md).
