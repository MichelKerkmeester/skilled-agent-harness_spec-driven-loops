---
title: "code-quality — Manual Testing Playbook"
description: "Type-1 routing-recall scenarios for the code-quality skill's thin prompt-intent router."
version: 1.0.0.0
---

# code-quality — Manual Testing Playbook

Type-1 resource-recall scenarios for the deterministic skill-benchmark (Lane C, router mode).
code-quality routes primarily by TARGET PATH — verified by its own unit test — and its parent-to-child
discoverability is the hub `quality` signal. This playbook exercises the one thin prompt-intent `QUALITY`
route so the harness can score its single routable checklist in Mode-A.

<!-- MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT -->
> **Result persistence**: a scenario run is complete only after its `PASS`, `FAIL`, or `SKIP` outcome and
> reason are persisted through `run-manual-playbook-scenario.cjs` into
> `sk-code-quality/benchmark/reports/<dated-run-label>/`.

**Totals:** 1 scenario, 1 category.

## Scenarios

| # | ID | Intent | File |
| --- | --- | --- | --- |
| 1 | CQ-001 | QUALITY | [quality-checklist.md](quality-gate/quality-checklist.md) |

Every scenario assumes the hub has already routed the request to `code-quality`; the scenario then
exercises whether the thin `QUALITY` prompt-intent projection resolves the declared `expected_resources`
set. A scenario's verdict is `PASS` when every path in `expected_resources` resolves under the skill root
and the frontmatter `expected_intent` agrees with the table above, `FAIL` when either check fails, and
`SKIP` only when the `assets/code-quality-checklist/` directory is unavailable in the sandboxed checkout.
