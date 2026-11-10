# Iteration 001 — Correctness

## Focus
Reviewed the switch resolver's precedence and value semantics against the written contract. This is a read-only source review; no tests or repository validators were run.

## Files reviewed
- `specs/sk-doc/062-doc-validation-off-switches/spec.md`
- `.skilled/hooks/shared/hook-flags.sh`
- `.skilled/hooks/shared/hook-flags.cjs`
- `.skilled/hooks/shared/hook-flags.test.cjs`
- `.skilled/skills/sk-doc/shared/scripts/validation_switch.py`

## Finding
### P2-LUNA-001 — An explicit sentinel value falls through to the config file
The shell resolver uses `__HF_UNSET__` as an in-band marker for an absent environment variable. If a caller explicitly sets a switch to that literal and the config file sets the switch to `1`, the shell reader treats the environment as unset and enables the switch from the file. That contradicts the packet's rule that any set environment value wins, including falsy values. [SOURCE: specs/sk-doc/062-doc-validation-off-switches/spec.md:129-130] [SOURCE: .skilled/hooks/shared/hook-flags.sh:37-44]

The Node and Python readers distinguish key presence from value, so this is isolated to the shell resolver's sentinel check. The existing falsy cases exercise empty, `0`, and `skip`, but not the sentinel literal. [SOURCE: .skilled/hooks/shared/hook-flags.cjs:181-193] [SOURCE: .skilled/skills/sk-doc/scripts/tests/validate-skip-switch.vitest.ts:67-75]

**Recommendation:** Check variable presence independently of its contents and add a focused regression row for this literal.

## Ruled out in this pass
- The public shell flag name is validated before it reaches `eval`; malformed names are rejected. [SOURCE: .skilled/hooks/shared/hook-flags.sh:51-59]
- The CJS and Python resolvers preserve an explicitly empty environment value rather than consulting file configuration. [SOURCE: .skilled/hooks/shared/hook-flags.cjs:181-193] [SOURCE: .skilled/skills/sk-doc/shared/scripts/validation_switch.py:87-92]

## Convergence telemetry
One new P2 finding; weighted novelty ratio 1.0. Continue because the configured stop policy requires five iterations.

Review verdict: PASS
