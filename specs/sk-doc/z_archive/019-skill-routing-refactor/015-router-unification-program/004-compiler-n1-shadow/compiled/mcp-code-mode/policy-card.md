---
{"admission":["positive selector signal routes","zero signal defers with no-match","negative admission rejects as forbidden"],"authorityEdges":[],"bundleGrammar":["single"],"effectivePolicyHash":"663c356a3dc72455a25f391a1d97767ace28de911c91b3b70ab4ef91bb37ce9f","hubId":"mcp-code-mode","humanViewHash":"c2d877fe596d83335515f643f271ca2a2e801ddb4e8269ac1daafd0607402009","lifecycleChecklist":["prepare","verify","commit","receipt"],"limitations":["DOCUMENT_ONLY_UNATTESTED","PREPARED_DRAFT","No live activation freshness","No calibrated probability","No committed effects"],"negativeReasons":["forbidden","no-match"],"qualifiedRoles":["mcp-code-mode/mcp-code-mode:actor"],"recoveryBudget":"one clarify turn; no handoff when the handoff collection is empty","schemaVersion":"V1","thresholdPolicy":"exact-admission"}
---

# Compiled Router Policy Card

## Identity

Effective policy: `663c356a3dc72455a25f391a1d97767ace28de911c91b3b70ab4ef91bb37ce9f`
Human view: `c2d877fe596d83335515f643f271ca2a2e801ddb4e8269ac1daafd0607402009`

## Admission and precedence

Negative admission wins first. Positive selector evidence routes one destination. Near-tied selector evidence asks exactly one clarification. Zero signal defers with `no-match`; it never defaults to the only destination.

## Document-only routing table

```json
{"ambiguityDelta":"1.0","maximumIntents":2,"negativeAdmissions":["bash commands","continuity recovery","file discovery","file operations","sequential thinking","text searching"],"selectors":[{"intent":"ARCHITECTURE","keywords":["architecture","architecture","internals","internals","performance","performance","token","token"],"resources":["references/architecture.md"]},{"intent":"CATALOG","keywords":["catalog","catalog","catalog","discover tools","discover tools","discover tools","list tools","list tools","list tools","what tools","what tools","what tools"],"resources":["references/tool-catalog.md"]},{"intent":"NAMING","keywords":["format","format","format","format","naming","naming","naming","naming","prefix","prefix","prefix","prefix","tool not found","tool not found","tool not found","tool not found"],"resources":["references/naming-convention.md"]},{"intent":"SETUP","keywords":[".env",".env",".env",".env",".utcp_config",".utcp_config",".utcp_config",".utcp_config","configure","configure","configure","configure","install","install","install","install","setup","setup","setup","setup"],"resources":["assets/config-template.md","assets/env-template.md","references/configuration.md"]},{"intent":"VALIDATE","keywords":["check config","check config","check config","check config","schema","schema","schema","schema","validate","validate","validate","validate","validation","validation","validation","validation"],"resources":["references/configuration.md","references/naming-convention.md"]},{"intent":"WORKFLOW","keywords":["error handling","error handling","error handling","multi-tool","multi-tool","multi-tool","orchestrate","orchestrate","orchestrate","workflow","workflow","workflow"],"resources":["references/workflows.md"]}]}
```

## Posture

- T: exact-admission
- R: clarify → defer → reject
- P: static

## Qualified roles

- mcp-code-mode/mcp-code-mode:actor

## Authority

Route output is evidence with `WithheldUntilVerify`; negative decisions use `Withheld`. The advisory route guard is not VERIFY. Only the destination lifecycle can consume authority.

## Lifecycle

A document-only reader may emit `PREPARED_DRAFT`. It cannot attest activation freshness, destination readiness, or effects, so its honest terminal is `DOCUMENT_ONLY_UNATTESTED`.

## Limitations

- DOCUMENT_ONLY_UNATTESTED
- PREPARED_DRAFT
- No live activation freshness
- No calibrated probability
- No committed effects
