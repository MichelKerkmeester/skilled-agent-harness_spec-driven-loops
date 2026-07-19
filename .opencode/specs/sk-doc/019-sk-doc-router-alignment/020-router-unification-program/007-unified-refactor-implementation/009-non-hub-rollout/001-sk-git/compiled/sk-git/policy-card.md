---
{"admission":["positive selector signal routes","zero signal defers with no-match","negative admission rejects as forbidden"],"authorityEdges":[],"bundleGrammar":["single"],"effectivePolicyHash":"7912844c9e6cdcf9e16bbfebdfa43e317c7334aee4147e8a1bcfc641253ef7b8","hubId":"sk-git","humanViewHash":"68a7dc6f724e2c7d72466a159ff63ea164d7ed5dd205afdd8553de9d62db730b","lifecycleChecklist":["prepare","verify","commit","receipt"],"limitations":["DOCUMENT_ONLY_UNATTESTED","PREPARED_DRAFT","No live activation freshness","No calibrated probability","No committed effects"],"negativeReasons":["forbidden","no-match"],"qualifiedRoles":["sk-git/sk-git:actor"],"recoveryBudget":"one clarify turn; no handoff when the handoff collection is empty","schemaVersion":"V1","thresholdPolicy":"exact-admission"}
---

# Compiled Router Policy Card

## Identity

Effective policy: `7912844c9e6cdcf9e16bbfebdfa43e317c7334aee4147e8a1bcfc641253ef7b8`
Human view: `68a7dc6f724e2c7d72466a159ff63ea164d7ed5dd205afdd8553de9d62db730b`

## Admission and precedence

Negative admission wins first. Positive selector evidence routes one destination. Near-tied selector evidence asks exactly one clarification. Zero signal defers with `no-match`; it never defaults to the only destination.

## Document-only routing table

```json
{"ambiguityDelta":"1.0","maximumIntents":2,"negativeAdmissions":["force push to main/master"],"selectors":[{"intent":"COMMIT","keywords":["commit","commit","commit","commit","conventional commit","conventional commit","conventional commit","conventional commit","message","message","message","message","staged","staged","staged","staged"],"resources":["assets/commit-message-template.md","references/commit-workflows.md","references/quick-reference.md"]},{"intent":"FINISH","keywords":["finish","finish","finish","finish","integrate","integrate","integrate","integrate","merge","merge","merge","merge","pr","pr","pr","pr","pull request","pull request","pull request","pull request"],"resources":["assets/pr-template.md","references/finish-workflows.md","references/github-mcp-integration.md","references/quick-reference.md"]},{"intent":"GITKRAKEN_MCP","keywords":["commit composer","commit composer","commit composer","commit composer","cross-platform pr","cross-platform pr","cross-platform pr","cross-platform pr","gitkraken","gitkraken","gitkraken","gitkraken","gitlens","gitlens","gitlens","gitlens","gitlens start review","gitlens start review","gitlens start review","gitlens start review","gitlens start work","gitlens start work","gitlens start work","gitlens start work","launchpad","launchpad","launchpad","launchpad","multi-provider issue","multi-provider issue","multi-provider issue","multi-provider issue"],"resources":["references/gitkraken-mcp-integration.md","references/quick-reference.md"]},{"intent":"SHARED_PATTERNS","keywords":["branch naming","branch naming","branch naming","convention","convention","convention","pattern","pattern","pattern","reference","reference","reference"],"resources":["references/quick-reference.md","references/shared-patterns.md"]},{"intent":"WORKSPACE_SETUP","keywords":["create worktree","create worktree","create worktree","create worktree","numbered worktree","numbered worktree","numbered worktree","numbered worktree","parallel work","parallel work","parallel work","parallel work","restructure worktrees","restructure worktrees","restructure worktrees","restructure worktrees","workspace","workspace","workspace","workspace","worktree","worktree","worktree","worktree"],"resources":["assets/worktree-checklist.md","references/quick-reference.md","references/worktree-workflows.md"]}]}
```

## Posture

- T: exact-admission
- R: clarify → defer → reject
- P: static

## Qualified roles

- sk-git/sk-git:actor

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
