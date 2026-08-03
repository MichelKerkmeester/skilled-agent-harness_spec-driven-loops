# Research strategy — Beancount Ledger file-layer operation

## Scope and authority

This detached lineage investigates the released community-plugin identity Beancount Ledger, id beancount-finance, author mkshp, version 2.3.1. The plugin repository’s tracked implementation is TypeScript. The examined entry source is src/main.ts, which builds the installed main.js; the repository did not expose a tracked source main.js at the reviewed revision. Claims about plugin behavior are tied to the relevant source module, not inferred from the marketing description.

The requested result is a file-layer operating model: what an AI may safely create or append in a Beancount ledger, how the plugin reads those files and its own data.json, how BQL and price retrieval run, and how to diagnose invalid or risky states.

## Key questions

- [x] What ledger directives, posting forms, currencies, prices, costs, and includes make up the relevant Beancount v3 data model?
- [x] Which fields in .obsidian/plugins/beancount-finance/data.json are persisted, their defaults, and their runtime-only counterparts?
- [x] What commands, editors, processors, dashboards, and file operations does version 2.3.1 expose?
- [x] How do BeanQuery / bean-query and bean-price execute, including BQL grammar and plugin-specific limits?
- [x] What repeatable file-layer AI workflows and failure recoveries are supported by source and Beancount semantics?

## Evidence plan

Primary plugin evidence:

- manifest.json, src/main.ts, settings and command registration
- src/utils/queryRunner.ts, src/utils/SystemDetector.ts, and src/services/price.service.ts
- BQL markdown processors, dashboard query builders, transaction and directive writers
- relevant UI modal routing and validators

Primary ledger and query evidence:

- Beancount v3 syntax documentation and v3 project documentation
- BeanQuery grammar and command shell source
- beanprice README for commodity price metadata and CLI usage

Repository sources are cited by immutable-revision URL where available. Documentation and recommended AI operating procedures are distinguished from observed plugin writes.

## Iteration plan

| Iteration | Angle | Completion test |
| --- | --- | --- |
| 001 | Recover exact persisted settings, commands, source entry points, process invocations, and file-write boundary. | Every setting and command has a source-backed entry. |
| 002 | Reconstruct Beancount directives, transaction serialization, BQL syntax, inline/block query behavior, and dashboard query families. | Ledger model and query recipes can be independently executed by a file-layer agent. |
| 003 | Stress workflows against malformed inputs, multi-currency and lot accounting, import/reconciliation risk, and operational safety. | Each high-risk workflow has preflight, validation, and recovery guidance. |

## Coverage and ambiguity rules

resource-map.md was not present in the parent packet, so no pre-existing coverage gate can be applied. This lineage emits its own source map.

Known caveats to preserve:

- The release bundle named main.js is not the same thing as a reviewed tracked source file. The conclusion uses the corresponding TypeScript sources.
- A command existing in Beancount does not prove the plugin automatically invokes it. In particular, source evidence for a BQL ERRORS helper is not evidence that every plugin write runs bean-check.
- Recommended CSV and reconciliation procedures are AI operating recipes, not claims that the plugin ships a CSV importer.

## Stop rule

Stop only after iteration 003 has been reduced and synthesis is written. Convergence measures are recorded as telemetry; they do not permit early synthesis under stopPolicy: max-iterations.
