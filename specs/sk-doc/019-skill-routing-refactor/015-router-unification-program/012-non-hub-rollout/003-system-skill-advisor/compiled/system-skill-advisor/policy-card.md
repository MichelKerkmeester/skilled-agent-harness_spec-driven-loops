---
{"admission":["positive selector signal routes","zero signal defers with no-match","negative admission rejects as forbidden"],"authorityEdges":[],"bundleGrammar":["single"],"effectivePolicyHash":"3b2dfe70b132e6c0b8a7c1fdc3d7c13c2991b4266da6a0f8c258b7841c039e0d","hubId":"system-skill-advisor","humanViewHash":"9425d36dd4cbc174388cbe81e0652860495ed7b64f5acf59ea467ee277affc8d","lifecycleChecklist":["prepare","verify","commit","receipt"],"limitations":["DOCUMENT_ONLY_UNATTESTED","PREPARED_DRAFT","No live activation freshness","No calibrated probability","No committed effects"],"negativeReasons":["forbidden","no-match"],"qualifiedRoles":["system-skill-advisor/system-skill-advisor:actor"],"recoveryBudget":"one clarify turn; no handoff when the handoff collection is empty","schemaVersion":"V1","thresholdPolicy":"exact-admission"}
---

# Compiled Router Policy Card

## Identity

Effective policy: `3b2dfe70b132e6c0b8a7c1fdc3d7c13c2991b4266da6a0f8c258b7841c039e0d`
Human view: `9425d36dd4cbc174388cbe81e0652860495ed7b64f5acf59ea467ee277affc8d`

## Admission and precedence

Negative admission wins first. Positive selector evidence routes one destination. Near-tied selector evidence asks exactly one clarification. Zero signal defers with `no-match`; it never defaults to the only destination.

## Document-only routing table

```json
{"ambiguityDelta":"1.0","maximumIntents":2,"negativeAdmissions":["do not use this skill as a replacement for the recommended target skill"],"selectors":[{"intent":"CLI","keywords":["cli fallback","cli fallback","cli fallback","daemon-backed cli","daemon-backed cli","daemon-backed cli","skill-advisor cli","skill-advisor cli","skill-advisor cli"],"resources":["feature-catalog/mcp-surface/skill-advisor-cli.md"]},{"intent":"DAEMON_LEASE","keywords":["chokidar watcher","chokidar watcher","chokidar watcher","daemon lease","daemon lease","daemon lease","daemon lifecycle","daemon lifecycle","daemon lifecycle","lease contract","lease contract","lease contract","single-writer lease","single-writer lease","single-writer lease"],"resources":["references/runtime/daemon-lease-contract.md"]},{"intent":"DB_PATH","keywords":["database path policy","database path policy","database path policy","db path","db path","db path","sqlite path","sqlite path","sqlite path"],"resources":["references/config/db-path-policy.md"]},{"intent":"DECISIONS","keywords":["deferred decision","deferred decision","deferred decision","deprecation banner","deprecation banner","deprecation banner","tier d","tier d","tier d"],"resources":["references/decisions/deferred-decisions.md"]},{"intent":"ENHANCES","keywords":["enhances propagation","enhances propagation","enhances propagation","propagate enhances","propagate enhances","propagate enhances","skill_graph_propagate_enhances","skill_graph_propagate_enhances","skill_graph_propagate_enhances"],"resources":["references/graph/propagate-enhances.md"]},{"intent":"FRESHNESS","keywords":["degraded daemon","degraded daemon","degraded daemon","freshness contract","freshness contract","freshness contract","quarantined daemon","quarantined daemon","quarantined daemon","trust state","trust state","trust state","trust-state vocabulary","trust-state vocabulary","trust-state vocabulary","unavailable daemon","unavailable daemon","unavailable daemon"],"resources":["references/runtime/freshness-contract.md"]},{"intent":"GRAPH_DRIFT","keywords":["reconcile graph drift","reconcile graph drift","reconcile graph drift","skill graph drift","skill graph drift","skill graph drift","sqlite drift","sqlite drift","sqlite drift"],"resources":["references/graph/skill-graph-drift.md"]},{"intent":"GRAPH_EXTRACTION","keywords":["extraction completion","extraction completion","extraction completion","extraction history","extraction history","extraction history","graph extraction plan","graph extraction plan","graph extraction plan"],"resources":["references/graph/skill-graph-extraction-plan.md"]},{"intent":"GRAPH_QUERY","keywords":["graph query cookbook","graph query cookbook","graph query cookbook","relationship read","relationship read","relationship read","skill graph query","skill graph query","skill graph query","skill graph status","skill graph status","skill graph status","skill graph validate","skill graph validate","skill graph validate","skill_graph_query","skill_graph_query","skill_graph_query"],"resources":["references/graph/skill-graph-query-cookbook.md"]},{"intent":"HOOK","keywords":["goal opencode plugin","goal opencode plugin","goal opencode plugin","opencode plugin bridge","opencode plugin bridge","opencode plugin bridge","prompt-time hook","prompt-time hook","prompt-time hook","skill advisor hook","skill advisor hook","skill advisor hook","userpromptsubmit","userpromptsubmit","userpromptsubmit"],"resources":["references/hooks/skill-advisor-hook.md"]},{"intent":"LANE_TUNING","keywords":["lane weight change","lane weight change","lane weight change","lane weight tuning","lane weight tuning","lane weight tuning","reweight lane","reweight lane","reweight lane"],"resources":["references/scoring/lane-weight-tuning.md"]},{"intent":"LEGACY_BRIDGE","keywords":["bridge policy","bridge policy","bridge policy","compatibility bridge","compatibility bridge","compatibility bridge","legacy tool bridge","legacy tool bridge","legacy tool bridge"],"resources":["references/runtime/legacy-tool-bridge.md"]},{"intent":"MCP_SHAPE","keywords":["mcp topology","mcp topology","mcp topology","server shape","server shape","server shape","standalone advisor mcp","standalone advisor mcp","standalone advisor mcp","standalone mcp shape","standalone mcp shape","standalone mcp shape"],"resources":["references/runtime/standalone-mcp-shape.md"]},{"intent":"REBUILD","keywords":["advisor_rebuild","advisor_rebuild","advisor_rebuild","rebuild from source","rebuild from source","rebuild from source"],"resources":["feature-catalog/mcp-surface/advisor-rebuild.md"]},{"intent":"RECOMMEND","keywords":["advisor_recommend","advisor_recommend","advisor_recommend","recommend happy path","recommend happy path","recommend happy path"],"resources":["feature-catalog/mcp-surface/advisor-recommend.md"]},{"intent":"SCORER","keywords":["ambiguity window","ambiguity window","ambiguity window","ambiguous brief","ambiguous brief","ambiguous brief","confidence calibration","confidence calibration","confidence calibration","five-lane","five-lane","five-lane","lane attribution","lane attribution","lane attribution","lane fusion","lane fusion","lane fusion","scorer","scorer","scorer"],"resources":["references/scoring/advisor-scorer.md"]},{"intent":"STATUS","keywords":["advisor_status","advisor_status","advisor_status","status and rebuild","status and rebuild","status and rebuild","status transition","status transition","status transition"],"resources":["feature-catalog/mcp-surface/advisor-status.md"]},{"intent":"TOOL_IDS","keywords":["stable tool id","stable tool id","stable tool id","tool id","tool id","tool id","tool ids reference","tool ids reference","tool ids reference"],"resources":["references/runtime/tool-ids-reference.md"]},{"intent":"VALIDATE_TOOL","keywords":["advisor_validate","advisor_validate","advisor_validate"],"resources":["feature-catalog/mcp-surface/advisor-validate.md"]},{"intent":"VALIDATION_BASELINES","keywords":["advisor_validate baseline","advisor_validate baseline","advisor_validate baseline","validate slice bundle","validate slice bundle","validate slice bundle","validation baseline","validation baseline","validation baseline"],"resources":["references/scoring/validation-baselines.md"]}]}
```

## Posture

- T: exact-admission
- R: clarify → defer → reject
- P: static

## Qualified roles

- system-skill-advisor/system-skill-advisor:actor

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
