---
title: "Decision Record: reference checker and disposition ledger (032 phase 005.002)"
description: "Design decisions for complete reference verification: a manifest-driven resolver matrix, a ledger schema that covers map entries and dynamic sites, path-value boundaries, read-only scanning, and fail-closed completeness semantics."
trigger_phrases:
  - "reference checker decisions"
  - "disposition ledger schema"
  - "reference completeness argument"
  - "dynamic site ledger decision"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/005-rename-and-reference-tooling/002-reference-checker-and-disposition-ledger"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/005-rename-and-reference-tooling/002-reference-checker-and-disposition-ledger"
    last_updated_at: "2026-07-14T17:28:50Z"
    last_updated_by: "codex"
    recent_action: "Recorded the reference checker and disposition ledger decisions"
    next_safe_action: "Implement the resolver matrix and ledger completeness gate"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Completeness is measured against a tracked-file manifest and explicit map/dynamic-site row sets."
      - "The ledger is the auditable boundary for both static references and sites that require manual disposition."
      - "The checker scans and reports; it does not execute or rewrite repository content."
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

# Decision Record: Reference Checker and Disposition Ledger

<!-- ANCHOR:context -->
## Context

The rename engine can prove that a source path has a target, but it cannot by itself prove that every consumer will resolve the
target. A regex-only search misses module resolution rules, path-valued configuration, shell sourcing, registries, symlinks,
and dynamic expressions. A resolver-only report also lacks a durable record of what happened to map entries that are exempt,
frozen, generated, tool-mandated, already resolved, or intentionally preserved.

The checker must therefore make its completeness argument explicit: enumerate the scan universe, extract typed references,
reconcile each observation with the semantic map, and require a terminal ledger row for every map entry and dynamic site.
<!-- /ANCHOR:context -->

<!-- ANCHOR:decisions -->
## Decisions

### DR-001 — Use a manifest-driven resolver matrix

The checker starts from a tracked-file and symlink manifest and dispatches observations to resolver adapters. The matrix covers
JS/TS module resolution, Markdown links, JSON/YAML/TOML path values, shell sourcing and executable paths, registries, and
symlink targets. The manifest is the denominator for scan coverage, and a zero-file result is an error.

**Alternative rejected:** one global text search. It is easy to run, but it cannot prove module semantics or distinguish a path
value from an identifier, key, or prose occurrence.

### DR-002 — Define two ledger row classes with one completeness gate

The ledger contains a `map-entry` row for every semantic rename-map entry and a `dynamic-site` row for every dynamic `require`,
`source`, or glob expression. A map-entry row records `map_id`, source path, target path, classification, decision, rationale,
status, evidence, and reference locations. A dynamic-site row records `site_id`, file and location, expression kind, candidate
paths or resolver result, disposition, rationale, status, and evidence. IDs are unique within their row class.

The gate compares observed map IDs and dynamic site IDs with ledger IDs. Missing, duplicate, pending, unresolved, ambiguous, or
undispositioned rows fail; an explicit `preserve`, `exempt`, `frozen`, `generated`, `tool-mandated`, `already-resolved`, or
`rewrite-required` decision is valid only with rationale and evidence.

**Alternative rejected:** a free-form notes file. Notes cannot prove that a row exists for every map entry or dynamic site.

### DR-003 — Check path-valued data without rewriting keys or identifiers

The extractor treats filesystem path values in JSON/YAML/TOML and frontmatter as references, but leaves JSON/YAML/TOML keys,
frontmatter field names, code identifiers, and database columns outside the path-reference contract. Python filenames and package
directories, generated/lockfile output, tool-mandated names, test-runner magic, and frozen surfaces are reported with their
policy disposition rather than treated as ordinary rename targets.

**Alternative rejected:** normalize every matching token. That would alter data/API contracts and violate the 032 exemption
boundary.

### DR-004 — Keep the checker read-only and do not execute dynamic code

The checker resolves static paths and inspects dynamic expressions, but never runs a sourced shell file, imports a module, invokes
a glob callback, or rewrites a reference. Dynamic sites receive a ledger disposition such as resolved by a bounded fixture,
manual-review-required, or preserved by policy. A non-resolvable dynamic site blocks acceptance until its disposition is explicit.

**Alternative rejected:** execute the repository to discover runtime paths. Execution is non-deterministic, can have side effects,
and would turn a verification tool into a migration risk.

### DR-005 — Fail closed on missing coverage and bad resolution

The checker returns non-zero for a zero scan, empty map reconciliation, missing target, stale source-only reference in post-rename
mode, ambiguous module resolution, invalid ledger status, or undispositioned dynamic site. It can report a clean result only when
the manifest, observations, map rows, and dynamic rows reconcile.

**Alternative rejected:** treat an empty scan or unresolved dynamic site as a warning. A silent pass is exactly the failure mode
this phase exists to prevent.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:consequences -->
## Consequences

- The checker needs parser and resolver adapters rather than one search expression, but each supported reference class becomes
  independently testable.
- The ledger is a required artifact and makes every rename decision reviewable, including preserves and exemptions.
- Dynamic sites remain visible as bounded manual decisions instead of being silently treated as safe.
- Read-only behavior makes the checker safe to run before, during, and after a future dependency-closed rename batch.
- The complete-row gate may reject a technically resolvable repository until evidence is recorded; that is intentional.
<!-- /ANCHOR:consequences -->

<!-- ANCHOR:references -->
## References

- Parent phase map: `../spec.md`
- Engine map contract: `../001-rename-engine/spec.md`
- Naming policy and exemption boundary: `../../001-convention-policy-and-scope/decision-record.md`
- Fixture consumer: `../003-fixture-corpus-and-dry-run-harness/spec.md`
<!-- /ANCHOR:references -->
