---
title: "mcp-webflow: Manual Testing Playbook"
description: "Deterministic manual scenarios for the mcp-webflow transport: discovery, read-only, draft-write, publish gate, destructive refusal, and sk-design pairing."
trigger_phrases:
  - "webflow playbook"
  - "webflow manual testing"
  - "webflow scenarios"
version: 1.1.0.0
---

# mcp-webflow: Manual Testing Playbook

## 1. OVERVIEW

### Coverage

| Category | Scenarios | IDs |
|---|---|---|
| Discovery and Setup | 3 | DISCOVER-001, DISCOVER-DRIFT-001, REMOTE-SURFACE-001 |
| Read-Only | 3 | READCMS-001, READPAGES-001, ANALYZE-001 |
| Draft-Write | 2 | DRAFTSET-001, INSTRUCTIONS-001 |
| Safety Gate | 5 | PUBGATE-001, REFUSE-001, RATELIMIT-001, DEPLOYGATE-001, BULKGATE-001 |
| Judgment Pairing | 2 | PAIR-001, PAIR-DATA-001 |
| Negative | 1 | NONWEBFLOW-001 |
| **TOTAL** | **16** | **16 scenarios** |

### Realistic Test Model

1. A realistic user request is given to an orchestrator.
2. The orchestrator discovers tools, applies the frozen operation class, and (where required) obtains operator confirmation.
3. The operator captures the execution process and the user-visible outcome.
4. The scenario passes only when the workflow is sound and the safety boundary held.

### Prerequisites (operator)

- Dedicated test workspace + test site (frozen D7); read-only scopes baseline token.
- `webflow_WEBFLOW_TOKEN` exported; `webflow` manual verified via discovery.
- Version pinned after the first verified session.

## 7-10. Scenario index

| ID | Name | Verifies |
|---|---|---|
| DISCOVER-001 | Discovery and prefix contract | `list_tools` shows `webflow.webflow.*`; callables documented in `tool-surface.md` |
| DISCOVER-DRIFT-001 | Tool-surface drift fails closed | Live discovery is authoritative; drift recorded; no calls from memory |
| READCMS-001 | Read CMS collection | RO class passes without confirmation; scope check holds |
| READPAGES-001 | Page reads pass ungated | RO pages ops without confirmation |
| DRAFTSET-001 | Draft page settings update | DW class; no publish-status change; before-state captured |
| PUBGATE-001 | Staging-only single-page publish | Operator confirmation required; `publishToWebflowSubdomain` only; publish receipt + rollback plan |
| REFUSE-001 | Destructive action without confirmation | Delete/`customDomains` publish refused; fail-closed holds |
| RATELIMIT-001 | 429 backoff and Retry-After | Rate-limit discipline; no blind replay of non-idempotent writes |
| DEPLOYGATE-001 | run_workflow requires confirmation | Deploy class gated; named inputs + blast-radius note |
| PAIR-001 | Designer-family change pairs with sk-design | deElement/deVariable change routed through `sk-design` first |
| PAIR-DATA-001 | Data-family runs transport-only | Negative pairing check — no forced sk-design on data ops |
| NONWEBFLOW-001 | Non-Webflow intent defers | Off-topic requests never route to webflow tools |

## 11. Cross-reference index

- `discovery-setup/discover-001.md`
- `discovery-setup/discover-drift-001.md`
- `discovery-setup/remote-surface-001.md`
- `read-only/readcms-001.md`
- `read-only/readpages-001.md`
- `read-only/analyze-001.md`
- `draft-write/draftset-001.md`
- `draft-write/instructions-001.md`
- `safety-gate/pubgate-001.md`
- `safety-gate/refuse-001.md`
- `safety-gate/rate-limit-001.md`
- `safety-gate/deploygate-001.md`
- `safety-gate/bulkgate-001.md`
- `pairing/pair-001.md`
- `pairing/pair-data-001.md`
- `negative/non-webflow-001.md`
