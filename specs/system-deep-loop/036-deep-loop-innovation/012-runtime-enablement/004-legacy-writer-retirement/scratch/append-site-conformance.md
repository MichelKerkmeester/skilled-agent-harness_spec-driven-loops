# Append-site conformance checker

## Why it exists

The `state_write_protocol` block added to the workflow assets is prose. Nothing
failed when a workflow ignored it, which is what the adversarial review called
out: a declaration no gate enforces is advisory, not a control. This turns it
into something a run can fail on.

Built: `runtime/scripts/check-protocol-append-sites.cjs` (line-oriented, no YAML
parser — one real asset is unparseable by a strict loader) and
`runtime/tests/unit/check-protocol-append-sites.vitest.ts` (11 cases, all green).
Exit codes follow the sibling guard: 0 clean, 1 script error, 2 violation.

Rules: a file with append directives must declare `mechanism: "append-gateway"`
(`UNDECLARED_APPEND_MECHANISM`); a file containing a literal direct append must
declare a `migration_exception` (`UNDECLARED_DIRECT_APPEND`).

## It found two things a one-time search had missed

**Two files nobody had inventoried.** `deep-alignment-auto.yaml` and
`deep-alignment-confirm.yaml` record canonical state and had no protocol block
at all. They were absent from the earlier ten-file inventory. Both now carry the
block with the `alignment` mode token, and the auto file carries a
`migration_exception` naming its two embedded executor-branch appends.

**A blind spot in the checker itself.** Its first version detected only shell
`>>` redirects. Real workflows also append by calling `appendFileSync` on the
state log from embedded JavaScript, across five files. The checker was widened
to recognise that form, including calls written across several lines, while
still ignoring a bare `import { appendFileSync }` that never calls it.

## Current real-data verdict: exit 2, two violations

| File | Rule |
|------|------|
| `deep-research-auto.yaml` | `UNDECLARED_DIRECT_APPEND` |
| `deep-research-confirm.yaml` | `UNDECLARED_DIRECT_APPEND` |

Both declare the gateway protocol yet call `appendFileSync(paths.stateLog, ...)`
from embedded scripts. That is an executable direct-append path, not a
documentation defect, and converting it changes shipped workflow behaviour. It
is left standing and reported rather than silenced, because the checker's value
is that it tells the truth about the tree.

## Falsifiability, proven on real input

Reverting the two alignment blocks moves the checker from 2 violations to 5,
with both rules firing on the reverted files; restoring them returns it to 2.
The guard has been seen red and green against the real tree, not only against
fixtures.

## Known coarseness

One `migration_exception` excuses every direct append in its file. That is why
`deep-review-auto.yaml` reports clean although it also contains embedded
`appendFileSync` calls beyond the migration marker its exception describes.
Per-site exemption would be the stricter design and is not built here.

---

# Second adversarial round: two real bypasses, both closed

The checker was submitted for refutation. The reviewer returned REFUTED and was
right on three counts. Two were concrete bypasses and are now fixed; the third
was a framing correction that has been adopted.

## What it is, stated honestly

It is a **declaration-coverage check**, not a conformance gate. A clean result
means every direct append in these assets is declared and counted. It does not
mean the appends are correct or justified. Whether a declared exception deserves
to exist is a human review. The reviewer's phrasing was fair: every failing state
is curable by adding a declaration, so green can never mean "no wrongful append".
The banner and comments now say this rather than implying more.

Its actual value is narrower and still real: nothing can append *silently*. Every
site must be declared, counted, and re-reviewed when the count moves.

## Bypass 1 — evadable target matching (closed)

Detection required the call text to mention `stateLog`/`state_log` within a
three-line window. A helper wrapper, or `const L = 'state_log'` used indirectly,
moved the token out of the window and the call read clean.

Fixed by dropping the target test entirely: **every** `appendFileSync(` call in a
workflow asset is now flagged, because a workflow asset has no business
performing a raw filesystem append at all. A bare import that never calls is
still ignored.

## Bypass 2 — one exception, unlimited appends (closed)

A single `migration_exception` covered every append in its file, so a new site
added later inherited the exemption and the gate stayed green for code nobody
reviewed. The reviewer gave the exact scenario.

Fixed with a required `exempt_append_sites:` count. Two new rules:
`UNCOUNTED_EXEMPTION` when the count is absent, and `EXEMPTION_COUNT_MISMATCH`
when it disagrees with the sites found. The violation detail names both numbers.

Declared counts, produced by the checker: `deep-alignment-auto` 2,
`deep-research-auto` 3, `deep-research-confirm` 1, `deep-review-auto` 3,
`deep-review-confirm` 1.

## The bypass, reproduced and then blocked

Adding one more raw append inside an embedded script of `deep-research-auto.yaml`
— exactly the reviewer's scenario — now fails with `EXEMPTION_COUNT_MISMATCH`
(declared 3, found 4). Removing it returns the tree to zero violations.

The injected call targeted `/tmp/whatever.log`, which mentions no state log, so
the same control also demonstrates that bypass 1 is closed: the site was caught
on the call itself, not on its target.

Unit coverage is 16 cases, including a target that names nothing log-like and a
helper wrapper, both of which must be flagged.

## Where the reviewer was answered rather than agreed with

It argued the schema justification for the research assets was an excuse, since
a catch-all sink or a normalisation mapping could route those records. Each of
those is itself a change to the ledger schema or the gateway, which is the point:
the work is real and belongs where the schema lives, not in a documentation
phase. What was fair in the criticism is that freezing an exception without a
route out is not a plan, so each exception now states the condition for removing
it — the schema naming those records.

## Remaining known limit

Line-oriented scanning cannot follow a call assembled dynamically or hidden
behind an aliased import. Flagging every append call rather than matching targets
removes the easy evasions, but a determined indirection still defeats a lexical
scanner. Recorded rather than papered over.
