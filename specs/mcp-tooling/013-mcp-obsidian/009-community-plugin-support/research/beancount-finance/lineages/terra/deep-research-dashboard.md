# Deep research dashboard — Beancount Ledger

Status: complete  
Lineage: terra / fanout-terra-1785671329489-48jpky  
Stop reason: max iterations reached, not convergence

| Iteration | Focus | New information | Convergence telemetry | Action |
| --- | --- | --- | --- | --- |
| 001 | Plugin source, settings, commands, external tools | Identity, full setting schema, command registrations, query and price execution | 0.00 | Continue |
| 002 | Ledger directives, serializers, BQL, dashboards | Beancount model, transaction annotations, BQL grammar, live-query and dashboard surface | 0.31 | Broaden angle and continue |
| 003 | Errors, imports, reconciliation, operational safety | Validation gaps, file-layer workflows, price/lot/currency failure recovery | 0.58 | Synthesize because iteration limit reached |

## Coverage

| Research question | Status | Evidence |
| --- | --- | --- |
| Beancount v3 ledger directives and lots | Answered | Beancount syntax documentation plus directive writers |
| data.json settings and state | Answered | settings.ts and main.ts |
| bean-query, beanquery, bean-price invocation | Answered | queryRunner.ts, SystemDetector.ts, price.service.ts |
| BQL language and plugin query surface | Answered | BeanQuery grammar/shell plus BQL processors and dashboard queries |
| Commands and user-facing features | Answered | main.ts and UnifiedTransactionModal.ts |
| File-layer AI workflows | Answered | Source behavior plus explicitly labeled operational protocol |
| Error and edge-case catalog | Answered | Source behavior plus Beancount rules |

## Remaining caveats

- The repository’s tracked implementation was inspected through TypeScript source rather than a locally installed compiled main.js bundle.
- CSV import and reconciliation recipes are controlled operating procedures, not a claim of plugin-native importer functionality.
- Formatting command internals are non-load-bearing to the data model and are not relied on by the workflow.
