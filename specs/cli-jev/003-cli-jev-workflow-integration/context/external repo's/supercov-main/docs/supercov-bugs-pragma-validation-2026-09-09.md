# Findings while validating assertion pragmas

No application behavior was fixed. These are remaining analyzer/integration
limitations, not declarations that the application or its tests are wrong.

## PRAGMA-001: a real target is absent from the public inventory

Run: `run_2e5d74892cf7c201` in the Supergateway prototype worktree.
Command: `supercov runs run_2e5d74892cf7c201 asserted --pragmas --json`.

`tests/httpLifecycleE2e.test.ts:144` names this real expression at
`src/gateways/stdioToStatefulStreamableHttp.ts:121`:

```ts
sessionCounter?.inc(sessionId, "POST request for existing session");
```

The legacy inventory includes it as `S516`, category `state-call`, owner
`stdioToStatefulStreamableHttp`. The ordinary-archive inventory lacks it, so the
hint cannot resolve to a site. The JS site frontend explicitly declares that
project-typed state calls need type information (`js-sites-state-call-needs-types`).
This is a concrete instance of the previously recorded 636-versus-661 inventory
gap, not a reason to invent a site or mark a passing assertion as value evidence.

The hint result now says `unresolved / target-not-in-inventory`, not an invalid
user declaration. Future work should reconcile inventories with explicit scope
and parity checks; adding this site must not change the denominator silently.

## PRAGMA-002: passed absence assertion does not establish timer cancellation

The preceding comment at `tests/httpLifecycleE2e.test.ts:143` resolves to
`src/lib/sessionAccessCounter.ts#6`, the `clearTimeout(session.timeout)` site.
The attached `assert.doesNotMatch` at line 145 has an exact passing witness in
test `A52`. But its captured-log operand has no modeled observation supporting
the target, so the result is `unresolved / assertion-operand-not-modelled`.

The annotation cannot establish capture completeness, timing, or that this
particular cancellation explains the absent diagnostic. Do not promote it by
coverage plus a passed assertion, a matching helper name, or trusted `via` text.
The bounded effect-hint checker deliberately does not add a generic absence or
timer-derivation rule. Record richer checked evidence if this is tackled later.

## PRAGMA-003: normal site JSON remains oversized

The separately paged hint view works on the full sample. The ordinary
`asserted --limit 1 --json` still returns `RESPONSE_TOO_LARGE`, because global
execution evidence is repeated outside site pagination. The fresh calibration
records this independently as `publicStatus: 2`; it is not an accuracy-gate
failure. See the earlier `supercov-bugs-js-recapture-2026-09-09.md` for the
original reproduction. Normal evidence pagination remains a release blocker.
