# Supercov engine contract v1

Status: **frozen** on 2026-08-24 from the shipped TypeScript engine, then
audited as an implementation-neutral compatibility contract.

These contracts are implementation-neutral requirements. The Rust engine and
every future language frontend must pass the same black-box corpus.
Changing an implementation is not permission to change a contract. A contract
change requires a new version, migration rules, golden fixtures, and an
explicit compatibility decision. This does not make historical TypeScript
behavior semantically authoritative: a conflict with ECMAScript semantics, an
independent coverage oracle, or the stated coverage model is a bug to correct
and version—not behavior Rust must preserve forever.

The four normative surfaces are:

1. [Evidence archive](evidence-archive.md)
2. [Run store and lifecycle](run-store.md)
3. [CLI and agent JSON](cli-json.md)
4. [Process supervision](process-supervision.md)

`contract.json` is the machine-readable version registry. Markdown in this
directory is normative where the registry does not express an invariant.

There is deliberately no server or daemon contract. Every Supercov invocation
must terminate. Query acceleration may persist integrity-checked data, never a
resident process.

## Compatibility rule

- Manifests, archive framing, normalized query JSON, error codes, exit status,
  and lifecycle outcomes must be identical.
- Generated JavaScript need only be behaviorally equivalent; Babel and oxc do
  not emit byte-identical source text.
- Diagnostic prose on stderr may gain information, but it must remain
  sanitized and cannot alter stdout JSON.
- Unknown fields may be rejected unless their containing schema explicitly
  allows forward-compatible extensions.
