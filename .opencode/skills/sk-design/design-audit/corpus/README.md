# Audit corpus comparison lane

This directory contains the maintainer-facing comparison adapter and its
contract fixtures. It is not a style gallery and does not add a corpus-derived
finding class.

`comparison-lane.mjs` consumes the neutral corpus context plan and the styles
engine. It accepts zero to two mode-selected references, hydrates them under the
generation guard, and discards every source body before producing closed,
enum-backed comparison rows. Each row is labelled non-authoritative context and
carries provenance, rights state, typed target-evidence references, limitations,
and the shared proof fields. Drift additionally requires a source ID and content
hash that exactly match the owned-system anchor and selected corpus card.

A Bash-capable `sk-code` OpenCode consumer imports the module and returns its
validated JSON result to the read-only audit mode. The test command below
executes that same public function.

The fixtures form a falsification atlas:

- `intended-anchor-drift` proves drift remains context and requires target
  evidence for any audit verdict.
- `comparison-unavailable` proves a zero-reference result is accepted evidence
  and leaves the target-evidence audit active.
- Counterexamples reject corpus attempts to assign severity, prove
  accessibility, authorize exact reuse, or create drift without an intended
  anchor and target evidence.

Run from the repository root:

```bash
node --test .opencode/skills/sk-design/design-audit/corpus/tests/*.test.mjs
```
