---
{"admission":["positive-signal","bounded-default","forbidden-reject"],"authorityEdges":["authority:actor:sk-prompt/sk-prompt-improve/sk-prompt-improve/workflow/prompt-engine approveBeforeCommit {\"backendKind\":\"prompt-engine\",\"packetId\":\"sk-prompt-improve\",\"packetKind\":\"workflow\",\"skillId\":\"sk-prompt\",\"workflowMode\":\"sk-prompt-improve\"}","authority:actor:sk-prompt/sk-prompt-models/sk-prompt-models/workflow/profile-lookup approveBeforeCommit {\"backendKind\":\"profile-lookup\",\"packetId\":\"sk-prompt-models\",\"packetKind\":\"workflow\",\"skillId\":\"sk-prompt\",\"workflowMode\":\"sk-prompt-models\"}"],"bundleGrammar":["single","orderedBundle"],"effectivePolicyHash":"7e97fef45860a03e820f0f890398415bf051bacd34ecac5b9a6e3111401e519d","hubId":"sk-prompt","humanViewHash":"c9a86844287e6a554ce8abea9fb61dbf4e15c32f5546a54a6cf84511e8bd14da","lifecycleChecklist":["PREPARE","VERIFY","COMMIT","receipt"],"limitations":["DOCUMENT_ONLY_UNATTESTED","PREPARED_DRAFT","No live activation freshness","No committed effects"],"negativeReasons":["forbidden","dependency-failure","no-match"],"qualifiedRoles":["sk-prompt/sk-prompt-improve:sk-prompt-improve:workflow:prompt-engine:weight=4:actor","sk-prompt/sk-prompt-models:sk-prompt-models:workflow:profile-lookup:weight=6:actor"],"recoveryBudget":"one clarify turn; no handoff","schemaVersion":"V1","thresholdPolicy":"authored-weighted-signals-with-bounded-default"}
---

# sk-prompt Compiled Router Policy Card

## Identity and hashes

Effective policy: `7e97fef45860a03e820f0f890398415bf051bacd34ecac5b9a6e3111401e519d`
Base policy: `d6b6adb4f3e8c9c21da994c9835e3d1485b9e276525bba9b4463e2ec115a50be`
Human view: `c9a86844287e6a554ce8abea9fb61dbf4e15c32f5546a54a6cf84511e8bd14da`

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
{"activationGeneration":5,"advisorProjectionHash":"16729b9d08d91b0b9c17bdd5f45bcaeaa0515e1a751cbb0223e4033aed7c27d5","basePolicyHash":"d6b6adb4f3e8c9c21da994c9835e3d1485b9e276525bba9b4463e2ec115a50be","destinations":[{"authorityRef":"authority:actor:sk-prompt/sk-prompt-models/sk-prompt-models/workflow/profile-lookup","id":{"backendKind":"profile-lookup","packetId":"sk-prompt-models","packetKind":"workflow","skillId":"sk-prompt","workflowMode":"sk-prompt-models"},"mutatesWorkspace":false,"role":"actor"},{"authorityRef":"authority:actor:sk-prompt/sk-prompt-improve/sk-prompt-improve/workflow/prompt-engine","id":{"backendKind":"prompt-engine","packetId":"sk-prompt-improve","packetKind":"workflow","skillId":"sk-prompt","workflowMode":"sk-prompt-improve"},"mutatesWorkspace":true,"role":"actor"}],"effectivePolicyHash":"7e97fef45860a03e820f0f890398415bf051bacd34ecac5b9a6e3111401e519d","routingModel":{"ambiguityDelta":1,"defaultMode":"sk-prompt-improve","modes":[{"destinationId":{"backendKind":"prompt-engine","packetId":"sk-prompt-improve","packetKind":"workflow","skillId":"sk-prompt","workflowMode":"sk-prompt-improve"},"keywords":["improve prompt","enhance prompt","prompt framework","prompt engineering","structure prompt","clear score","depth thinking","rewrite instructions","select framework","sk-prompt","prompt","mode-registry","hub-router","workflowmode","packetkind","sk-prompt-improve","/prompt:improve"],"resource":"sk-prompt-improve/SKILL.md","weight":4,"workflowMode":"sk-prompt-improve"},{"destinationId":{"backendKind":"profile-lookup","packetId":"sk-prompt-models","packetKind":"workflow","skillId":"sk-prompt","workflowMode":"sk-prompt-models"},"keywords":["small model prompt","per-model profile","model dispatch craft","prompt-models","deepseek","kimi","minimax","mimo","glm-5.2","model_profiles","sk-prompt-models","deepseek prompt","kimi prompt","minimax prompt","mimo prompt","glm prompt"],"resource":"sk-prompt-models/SKILL.md","weight":6,"workflowMode":"sk-prompt-models"}],"tieBreak":["sk-prompt-improve","sk-prompt-models"]},"sourceHashes":[{"hash":"11be5c0b3deb70f2a6fe986326b8ab88ec58bc05146a8951328ca2162c495d45","sourceId":"SKILL.md"},{"hash":"9591886dac2f63abf77a89d8b6ed79b7534d7293163c25a0cbd513a7ab63fa25","sourceId":"hub-router.json"},{"hash":"a96830f197e8cab8d89b8a7ff46f7264f7d2e16e06f29c7bf3a773a4f9bda4fa","sourceId":"mode-registry.json"},{"hash":"2eb2dcab831956b5fbe2afbdcda668cd720a6c7ed054aacfc95b149296d3b16a","sourceId":"sk-prompt-improve/SKILL.md"},{"hash":"8bd2f3e6fd02f2b06682d56de03e92b8e127d88c6c32635c7ce874b24ec6082e","sourceId":"sk-prompt-models/SKILL.md"}]}
```

## Authority and lifecycle

Destination authority remains withheld until VERIFY. The effect path is PREPARE → VERIFY → COMMIT → receipt.

## Negative decisions

Clarify, defer, and reject decisions are target-free and keep authority withheld.

## Limitations

- DOCUMENT_ONLY_UNATTESTED
- PREPARED_DRAFT only
- No live activation freshness or committed effects
