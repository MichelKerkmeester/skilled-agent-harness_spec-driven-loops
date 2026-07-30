---
{"admission":["positive-signal","bounded-default","forbidden-reject"],"authorityEdges":["authority:actor:sk-prompt/sk-prompt-improve/sk-prompt-improve/workflow/prompt-engine approveBeforeCommit {\"backendKind\":\"prompt-engine\",\"packetId\":\"sk-prompt-improve\",\"packetKind\":\"workflow\",\"skillId\":\"sk-prompt\",\"workflowMode\":\"sk-prompt-improve\"}","authority:actor:sk-prompt/sk-prompt-models/sk-prompt-models/workflow/profile-lookup approveBeforeCommit {\"backendKind\":\"profile-lookup\",\"packetId\":\"sk-prompt-models\",\"packetKind\":\"workflow\",\"skillId\":\"sk-prompt\",\"workflowMode\":\"sk-prompt-models\"}"],"bundleGrammar":["single","orderedBundle"],"effectivePolicyHash":"96b5eddeced1d2bddf566d8a12e94032ca55f84167e627cb97cd7a6b38217308","hubId":"sk-prompt","humanViewHash":"0649d1e2e32b9ae74371ec3caba5801628912186eeeaa3cef3e1308c25a6fe04","lifecycleChecklist":["PREPARE","VERIFY","COMMIT","receipt"],"limitations":["DOCUMENT_ONLY_UNATTESTED","PREPARED_DRAFT","No live activation freshness","No committed effects"],"negativeReasons":["forbidden","dependency-failure","no-match"],"qualifiedRoles":["sk-prompt/sk-prompt-improve:sk-prompt-improve:workflow:prompt-engine:weight=4:actor","sk-prompt/sk-prompt-models:sk-prompt-models:workflow:profile-lookup:weight=6:actor"],"recoveryBudget":"one clarify turn; no handoff","schemaVersion":"V1","thresholdPolicy":"authored-weighted-signals-with-bounded-default"}
---

# sk-prompt Compiled Router Policy Card

## Identity and hashes

Effective policy: `96b5eddeced1d2bddf566d8a12e94032ca55f84167e627cb97cd7a6b38217308`
Base policy: `5dfb922af667b1316d04e82f6d285fb3332cdac21d219ff08e7ad3d9f3dd309b`
Human view: `0649d1e2e32b9ae74371ec3caba5801628912186eeeaa3cef3e1308c25a6fe04`

## Qualified workflow projections

| Qualified mode | Packet | Backend | Weight | Default | Resource | Role |
| --- | --- | --- | ---: | --- | --- | --- |
| `sk-prompt/sk-prompt-improve` | `sk-prompt-improve` | `prompt-engine` | 4 | yes | `sk-prompt-improve/SKILL.md` | `actor` |
| `sk-prompt/sk-prompt-models` | `sk-prompt-models` | `profile-lookup` | 6 | no | `sk-prompt-models/SKILL.md` | `actor` |

## Admission and precedence

Forbidden input rejects first. Explicit dual-mode requests use the authored tie-break order. Weighted signals select one mode; a score within the authored ambiguity delta clarifies once. Zero signal routes the authored default mode with bounded-default basis.

## Bundle grammar

Single routes and the authored two-mode ordered bundle are legal. No surface bundle exists.

## Document-only routing snapshot

```json
{"activationGeneration":5,"advisorProjectionHash":"61a9c931cb37352c31a46e5aee9362b2dc4506a2395b38ed04ce126ac7c7d862","basePolicyHash":"5dfb922af667b1316d04e82f6d285fb3332cdac21d219ff08e7ad3d9f3dd309b","destinations":[{"authorityRef":"authority:actor:sk-prompt/sk-prompt-models/sk-prompt-models/workflow/profile-lookup","id":{"backendKind":"profile-lookup","packetId":"sk-prompt-models","packetKind":"workflow","skillId":"sk-prompt","workflowMode":"sk-prompt-models"},"mutatesWorkspace":false,"role":"actor"},{"authorityRef":"authority:actor:sk-prompt/sk-prompt-improve/sk-prompt-improve/workflow/prompt-engine","id":{"backendKind":"prompt-engine","packetId":"sk-prompt-improve","packetKind":"workflow","skillId":"sk-prompt","workflowMode":"sk-prompt-improve"},"mutatesWorkspace":true,"role":"actor"}],"effectivePolicyHash":"96b5eddeced1d2bddf566d8a12e94032ca55f84167e627cb97cd7a6b38217308","routingModel":{"ambiguityDelta":1,"defaultMode":"sk-prompt-improve","modes":[{"destinationId":{"backendKind":"prompt-engine","packetId":"sk-prompt-improve","packetKind":"workflow","skillId":"sk-prompt","workflowMode":"sk-prompt-improve"},"keywords":["improve prompt","enhance prompt","prompt framework","prompt engineering","structure prompt","clear score","depth thinking","rewrite instructions","select framework","sk-prompt","prompt","mode-registry","hub-router","workflowmode","packetkind","sk-prompt-improve","/prompt:improve"],"resource":"sk-prompt-improve/SKILL.md","weight":4,"workflowMode":"sk-prompt-improve"},{"destinationId":{"backendKind":"profile-lookup","packetId":"sk-prompt-models","packetKind":"workflow","skillId":"sk-prompt","workflowMode":"sk-prompt-models"},"keywords":["small model prompt","per-model profile","model dispatch craft","prompt-models","deepseek","kimi","minimax","mimo","glm-5.2","model_profiles","sk-prompt-models","deepseek prompt","kimi prompt","minimax prompt","mimo prompt","glm prompt"],"resource":"sk-prompt-models/SKILL.md","weight":6,"workflowMode":"sk-prompt-models"}],"tieBreak":["sk-prompt-improve","sk-prompt-models"]},"sourceHashes":[{"hash":"5d7bdc13bb53363557927ea4a14de8beb518ce01efed0ea0a90b50a6af930121","sourceId":"SKILL.md"},{"hash":"9591886dac2f63abf77a89d8b6ed79b7534d7293163c25a0cbd513a7ab63fa25","sourceId":"hub-router.json"},{"hash":"a96830f197e8cab8d89b8a7ff46f7264f7d2e16e06f29c7bf3a773a4f9bda4fa","sourceId":"mode-registry.json"},{"hash":"b3cc8f5e2678472ff9e8ebdff74503481c08d911e61a2b6ffe85d54e3d14fc72","sourceId":"sk-prompt-improve/SKILL.md"},{"hash":"6b6f81f6f5ddf4558d87e9e3066211d85e4ea287e4c1032a2c49320833a6ef9e","sourceId":"sk-prompt-models/SKILL.md"}]}
```

## Authority and lifecycle

Destination authority remains withheld until VERIFY. The effect path is PREPARE → VERIFY → COMMIT → receipt.

## Negative decisions

Clarify, defer, and reject decisions are target-free and keep authority withheld.

## Limitations

- DOCUMENT_ONLY_UNATTESTED
- PREPARED_DRAFT only
- No live activation freshness or committed effects
