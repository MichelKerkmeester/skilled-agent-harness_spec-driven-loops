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
