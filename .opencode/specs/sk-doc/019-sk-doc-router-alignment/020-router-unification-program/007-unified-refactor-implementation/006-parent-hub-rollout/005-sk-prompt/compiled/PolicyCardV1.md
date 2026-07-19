---
{"admission":["positive-signal","bounded-default","forbidden-reject"],"authorityEdges":["authority:actor:sk-prompt/prompt-improve/prompt-improve/workflow/prompt-engine approveBeforeCommit {\"backendKind\":\"prompt-engine\",\"packetId\":\"prompt-improve\",\"packetKind\":\"workflow\",\"skillId\":\"sk-prompt\",\"workflowMode\":\"prompt-improve\"}","authority:actor:sk-prompt/prompt-models/prompt-models/workflow/profile-lookup approveBeforeCommit {\"backendKind\":\"profile-lookup\",\"packetId\":\"prompt-models\",\"packetKind\":\"workflow\",\"skillId\":\"sk-prompt\",\"workflowMode\":\"prompt-models\"}"],"bundleGrammar":["single","orderedBundle"],"effectivePolicyHash":"c009db2367563a49b68140b1481708703e87832ac199884fd4bb7f7ec05ac1f9","hubId":"sk-prompt","humanViewHash":"00415182d40726be0de19421e5c8b7dacc1a6a6204d7ad6c68caeaf15b989454","lifecycleChecklist":["PREPARE","VERIFY","COMMIT","receipt"],"limitations":["DOCUMENT_ONLY_UNATTESTED","PREPARED_DRAFT","No live activation freshness","No committed effects"],"negativeReasons":["forbidden","dependency-failure","no-match"],"qualifiedRoles":["sk-prompt/prompt-improve:prompt-improve:workflow:prompt-engine:weight=4:actor","sk-prompt/prompt-models:prompt-models:workflow:profile-lookup:weight=6:actor"],"recoveryBudget":"one clarify turn; no handoff","schemaVersion":"V1","thresholdPolicy":"authored-weighted-signals-with-bounded-default"}
---

# sk-prompt Compiled Router Policy Card

## Identity and hashes

Effective policy: `c009db2367563a49b68140b1481708703e87832ac199884fd4bb7f7ec05ac1f9`
Base policy: `5c704a4e5405e093705b4f5bacbe9b39c3fcd0774acd2acd4255182fef9577d4`
Human view: `00415182d40726be0de19421e5c8b7dacc1a6a6204d7ad6c68caeaf15b989454`

## Qualified workflow projections

| Qualified mode | Packet | Backend | Weight | Default | Resource | Role |
| --- | --- | --- | ---: | --- | --- | --- |
| `sk-prompt/prompt-improve` | `prompt-improve` | `prompt-engine` | 4 | yes | `prompt-improve/SKILL.md` | `actor` |
| `sk-prompt/prompt-models` | `prompt-models` | `profile-lookup` | 6 | no | `prompt-models/SKILL.md` | `actor` |

## Admission and precedence

Forbidden input rejects first. Explicit dual-mode requests use the authored tie-break order. Weighted signals select one mode; a score within the authored ambiguity delta clarifies once. Zero signal routes the authored default mode with bounded-default basis.

## Bundle grammar

Single routes and the authored two-mode ordered bundle are legal. No surface bundle exists.

## Document-only routing snapshot

```json
{"activationGeneration":5,"advisorProjectionHash":"2eac1d11b7cd3a3a9eb4d1367925952ee42f0bc95196aaca9e1e45274cedef58","basePolicyHash":"5c704a4e5405e093705b4f5bacbe9b39c3fcd0774acd2acd4255182fef9577d4","destinations":[{"authorityRef":"authority:actor:sk-prompt/prompt-models/prompt-models/workflow/profile-lookup","id":{"backendKind":"profile-lookup","packetId":"prompt-models","packetKind":"workflow","skillId":"sk-prompt","workflowMode":"prompt-models"},"mutatesWorkspace":false,"role":"actor"},{"authorityRef":"authority:actor:sk-prompt/prompt-improve/prompt-improve/workflow/prompt-engine","id":{"backendKind":"prompt-engine","packetId":"prompt-improve","packetKind":"workflow","skillId":"sk-prompt","workflowMode":"prompt-improve"},"mutatesWorkspace":true,"role":"actor"}],"effectivePolicyHash":"c009db2367563a49b68140b1481708703e87832ac199884fd4bb7f7ec05ac1f9","routingModel":{"ambiguityDelta":1,"defaultMode":"prompt-improve","modes":[{"destinationId":{"backendKind":"prompt-engine","packetId":"prompt-improve","packetKind":"workflow","skillId":"sk-prompt","workflowMode":"prompt-improve"},"keywords":["improve prompt","enhance prompt","prompt framework","prompt engineering","structure prompt","clear score","depth thinking","rewrite instructions","select framework","sk-prompt","prompt","mode-registry","hub-router","workflowmode","packetkind","prompt-improve","/prompt-improve"],"resource":"prompt-improve/SKILL.md","weight":4,"workflowMode":"prompt-improve"},{"destinationId":{"backendKind":"profile-lookup","packetId":"prompt-models","packetKind":"workflow","skillId":"sk-prompt","workflowMode":"prompt-models"},"keywords":["small model prompt","per-model profile","model dispatch craft","prompt-models","deepseek","kimi","minimax","mimo","glm-5.2","model_profiles","deepseek prompt","kimi prompt","minimax prompt","mimo prompt","glm prompt"],"resource":"prompt-models/SKILL.md","weight":6,"workflowMode":"prompt-models"}],"tieBreak":["prompt-improve","prompt-models"]},"sourceHashes":[{"hash":"075529592119a5be48f4ac07b60144dd3ea175868b5b40b0aee33c00f969b901","sourceId":"SKILL.md"},{"hash":"a32791dc8c4a4fb24ff8f94303621e3cfaf3254746af49745c10a61f98a1dd97","sourceId":"hub-router.json"},{"hash":"36deecb3840ae8a5067187e6c5ae8fd40a76cd56034d41a8a3b632f3d6e2fcbe","sourceId":"mode-registry.json"},{"hash":"129c17f585e229022721158e64554e3c1e00f2e943071828fbb70e46275cae24","sourceId":"prompt-improve/SKILL.md"},{"hash":"93883122e6220646b46252ce5567c5cae220d462aeee5c88cfda95d9c3339cb9","sourceId":"prompt-models/SKILL.md"}]}
```

## Authority and lifecycle

Destination authority remains withheld until VERIFY. The effect path is PREPARE → VERIFY → COMMIT → receipt.

## Negative decisions

Clarify, defer, and reject decisions are target-free and keep authority withheld.

## Limitations

- DOCUMENT_ONLY_UNATTESTED
- PREPARED_DRAFT only
- No live activation freshness or committed effects
