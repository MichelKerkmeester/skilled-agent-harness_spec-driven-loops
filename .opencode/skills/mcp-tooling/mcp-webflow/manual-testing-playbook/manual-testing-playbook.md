---
title: "mcp-webflow: Manual Testing Playbook"
description: "Deterministic manual scenarios for the mcp-webflow transport: discovery, read-only, draft-write, publish gate, destructive refusal, and sk-design pairing."
trigger_phrases:
  - "webflow playbook"
  - "webflow manual testing"
  - "webflow scenarios"
version: 1.0.0.0
---

# mcp-webflow: Manual Testing Playbook

## 1. OVERVIEW

### Coverage

| Category | Scenarios | IDs |
|---|---|---|
| Discovery and Setup | 1 | DISCOVER-001 |
| Read-Only | 1 | READCMS-001 |
| Draft-Write | 1 | DRAFTSET-001 |
| Safety Gate | 2 | PUBGATE-001, REFUSE-001 |
| Judgment Pairing | 1 | PAIR-001 |
| **TOTAL** | **6** | **6 scenarios** |

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
| READCMS-001 | Read CMS collection | RO class passes without confirmation; scope check holds |
| DRAFTSET-001 | Draft page settings update | DW class; no publish-status change; before-state captured |
| PUBGATE-001 | Staging-only single-page publish | Operator confirmation required; `publishToWebflowSubdomain` only; publish receipt + rollback plan |
| REFUSE-001 | Destructive action without confirmation | Delete/`customDomains` publish refused; fail-closed holds |
| PAIR-001 | Designer-family change pairs with sk-design | deElement/deVariable change routed through `sk-design` first |

## 11. Cross-reference index

- `discovery-setup/discover-001.md`
- `read-only/readcms-001.md`
- `draft-write/draftset-001.md`
- `safety-gate/pubgate-001.md`
- `safety-gate/refuse-001.md`
- `pairing/pair-001.md`
