---
{"admission":["positive selector signal routes","zero signal routes the authored bounded default resource","negative admission rejects as forbidden"],"authorityEdges":[],"bundleGrammar":["single"],"effectivePolicyHash":"64f24e05b897bad2be29d86b13e87c8feca179e3bc6e31641ddab11e8b01964d","hubId":"system-spec-kit","humanViewHash":"45244847a3e1d78cdbb6e4b02ab5fe8daab44a0a85026448f6278382677b06b9","lifecycleChecklist":["prepare","verify","commit","receipt"],"limitations":["DOCUMENT_ONLY_UNATTESTED","PREPARED_DRAFT","No live activation freshness","No calibrated probability","No committed effects"],"negativeReasons":["forbidden"],"qualifiedRoles":["system-spec-kit/system-spec-kit:actor"],"recoveryBudget":"one clarify turn; no handoff when the handoff collection is empty","schemaVersion":"V1","thresholdPolicy":"exact-admission"}
---

# Compiled Router Policy Card

## Identity

Effective policy: `64f24e05b897bad2be29d86b13e87c8feca179e3bc6e31641ddab11e8b01964d`
Human view: `45244847a3e1d78cdbb6e4b02ab5fe8daab44a0a85026448f6278382677b06b9`

## Admission and precedence

Negative admission wins first. Positive selector evidence routes one destination. Near-tied selector evidence asks exactly one clarification. Zero signal uses the authored bounded default resource; it does not invent an unconditional singleton route.

## Document-only routing table

```json
{"ambiguityDelta":"1.0","defaultResource":"references/workflows/quick-reference.md","maximumIntents":2,"negativeAdmissions":["add toc sections to standard spec artifacts","claim done without checklist verification","create documentation from scratch","decide autonomously update vs create","leave placeholders in final docs","make changes before spec + approval","proceed without spec folder confirmation","skip spec folder creation","skip validation before completion"],"selectors":[{"intent":"COMPLETE","keywords":["checklist","checklist","checklist","checklist","complete","complete","complete","complete","done","done","done","done","finish","finish","finish","finish","verify","verify","verify","verify"],"resources":["references/validation/validation-rules.md","references/workflows/intake-contract.md","references/workflows/nested-changelog.md","references/workflows/spec-folder-authoring-checklist.md","references/workflows/spec-folder-write-recipe.md"]},{"intent":"DEBUG","keywords":["debug","debug","debug","debug","error","error","error","error","failed","failed","failed","failed","not working","not working","not working","not working","stuck","stuck","stuck","stuck"],"resources":["references/debugging/troubleshooting.md","references/debugging/universal-debugging-methodology.md","references/workflows/quick-reference.md"]},{"intent":"EVALUATION","keywords":["ablation","ablation","ablation","baseline","baseline","baseline","benchmark","benchmark","benchmark","evaluate","evaluate","evaluate","metrics","metrics","metrics"],"resources":["references/config/environment-variables.md","references/memory/epistemic-vectors.md"]},{"intent":"GOVERNANCE","keywords":["audit","audit","audit","governance","governance","governance","retention","retention","retention","tenant","tenant","tenant"],"resources":["references/config/environment-variables.md"]},{"intent":"HANDOVER","keywords":["continue later","continue later","continue later","continue later","handover","handover","handover","handover","next session","next session","next session","next session","pause","pause","pause","pause"],"resources":["references/workflows/quick-reference.md"]},{"intent":"HOOKS","keywords":["/goal","/goal","/goal","/goal","active_goal","active_goal","active_goal","active_goal","advisor hook","advisor hook","advisor hook","advisor hook","advisor_validate","advisor_validate","advisor_validate","advisor_validate","goal plugin","goal plugin","goal plugin","goal plugin","hook","hook","hook","hook","mk-goal","mk-goal","mk-goal","mk-goal","prompt-time advisor","prompt-time advisor","prompt-time advisor","prompt-time advisor","session goal","session goal","session goal","session goal","skill advisor hook","skill advisor hook","skill advisor hook","skill advisor hook"],"resources":["references/config/hook-system.md","references/hooks/goal-plugin.md","references/hooks/skill-advisor-hook-validation.md","references/hooks/skill-advisor-hook.md"]},{"intent":"IMPLEMENT","keywords":["build","build","build","execute","execute","execute","implement","implement","implement","workflow","workflow","workflow"],"resources":["assets/template-mapping.md","references/templates/template-guide.md","references/validation/template-compliance-contract.md","references/validation/validation-rules.md"]},{"intent":"INTAKE","keywords":["folder_state","folder_state","folder_state","folder_state","intake","intake","intake","intake","intake-only","intake-only","intake-only","intake-only","repair-mode","repair-mode","repair-mode","repair-mode","start_state","start_state","start_state","start_state"],"resources":["references/templates/template-guide.md","references/validation/template-compliance-contract.md","references/workflows/intake-contract.md"]},{"intent":"LAUNCHER","keywords":["launcher","launcher","launcher","launcher","lease","lease","lease","lease","lease_held_by","lease_held_by","lease_held_by","lease_held_by","pid file","pid file","pid file","pid file","single-writer","single-writer","single-writer","single-writer"],"resources":["references/config/launcher-lease.md","references/memory/memory-system.md"]},{"intent":"MEMORY","keywords":["checkpoint","checkpoint","checkpoint","checkpoint","context","context","context","context","memory","memory","memory","memory","resume","resume","resume","resume","save context","save context","save context","save context"],"resources":["references/memory/memory-system.md","references/memory/save-workflow.md","references/memory/trigger-config.md"]},{"intent":"PHASE","keywords":["decompose","decompose","decompose","decompose","multi-phase","multi-phase","multi-phase","multi-phase","multi-session","multi-session","multi-session","multi-session","phase","phase","phase","phase","phased","phased","phased","phased","phased approach","phased approach","phased approach","phased approach","split","split","split","split","workstream","workstream","workstream","workstream"],"resources":["references/structure/phase-definitions.md","references/structure/sub-folder-versioning.md","references/validation/phase-checklists.md"]},{"intent":"PLAN","keywords":["design","design","design","level selection","level selection","level selection","new spec","new spec","new spec","option b","option b","option b","plan","plan","plan"],"resources":["assets/complexity-decision-matrix.md","assets/level-decision-matrix.md","references/templates/template-guide.md","references/validation/template-compliance-contract.md","references/workflows/intake-contract.md"]},{"intent":"RENAME","keywords":["case variants","case variants","case variants","git mv","git mv","git mv","mechanical refactor","mechanical refactor","mechanical refactor","rename","rename","rename","rename pattern","rename pattern","rename pattern"],"resources":["references/workflows/rename-pattern.md"]},{"intent":"RESEARCH","keywords":["analyze","analyze","analyze","evidence","evidence","evidence","explore","explore","explore","investigate","investigate","investigate","prior work","prior work","prior work"],"resources":["references/memory/epistemic-vectors.md","references/workflows/quick-reference.md","references/workflows/worked-examples.md"]},{"intent":"RETRIEVAL_TUNING","keywords":["fusion","fusion","fusion","pipeline","pipeline","pipeline","retrieval","retrieval","retrieval","scoring","scoring","scoring","search tuning","search tuning","search tuning"],"resources":["references/memory/embedder-architecture.md","references/memory/embedder-pluggability.md","references/memory/embedding-resilience.md","references/memory/trigger-config.md"]},{"intent":"ROLLOUT_FLAGS","keywords":["disable","disable","disable","enable","enable","enable","feature flag","feature flag","feature flag","rollout","rollout","rollout","toggle","toggle","toggle"],"resources":["references/config/environment-variables.md"]},{"intent":"SCORING_CALIBRATION","keywords":["calibration","calibration","calibration","decay","decay","decay","interference","interference","interference","normalization","normalization","normalization","scoring","scoring","scoring"],"resources":["references/config/environment-variables.md"]}]}
```

## Posture

- T: exact-admission
- R: clarify → defer → reject
- P: static

## Qualified roles

- system-spec-kit/system-spec-kit:actor

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
