---
title: "Feature Specification: One sk- prefix across every mode packet and routing key"
description: "Rename 20 mode packets and 21 workflowMode keys across the four sk- hubs so a mode's directory name and its routing key are the same string, and every consumer follows."
trigger_phrases:
  - "sk prefix rename"
  - "mode packet rename"
  - "workflowMode rename"
importance_tier: "critical"
contextType: "implementation"
parent: "sk-doc/019-skill-routing-refactor"
---

<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent.spec | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Feature Specification: One sk- Prefix Across Every Mode Packet And Routing Key

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/019-skill-routing-refactor/030-mode-sk-prefix-rename |
| **Level** | 3 |
| **Status** | Complete |
| **Owner** | sk-doc, which owns skill and hub authoring |
| **Scope** | The four sk- hubs: sk-code, sk-design, sk-doc, sk-prompt |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

A mode is identified by two strings that are free to disagree. `sk-design` routes the key
`interface` to the directory `design-interface`; `sk-code` routes `quality` to `code-quality`.
Nothing enforces a relationship between them, so a reader cannot infer either from the other and
a rename of one silently leaves the other behind.

Prefixing every packet with `sk-` and making each routing key adopt its own directory name closes
that gap: after this, the key and the directory are the same string in 20 of 21 cases, and the
single exception is a mode that deliberately shares a packet with another.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- 20 packet directories renamed with an `sk-` prefix across four hubs.
- 21 `workflowMode` keys renamed to match their new directory.
- Every consumer that reads either string: routers, registries, leaf manifests, advisor metadata,
  benchmark gold, command bindings, agent definitions, runtime mirrors and documentation.

### Out of Scope

- `cli-external-orchestration`, `mcp-tooling` and `system-deep-loop`. Their packets already carry
  meaningful prefixes, and doubling them would read worse than what they have.
- Any change to what a mode does, which resources it loads, or how it is scored.

### The One Deliberate Exception

`sk-create-skill-parent` keeps a key that differs from its directory `sk-create-skill`, because two
modes share that packet and the distinguishing suffix has to survive.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every surface is found before anything moves | Research enumerates the consumer classes and no later phase discovers a class research missed |
| REQ-002 | Key and directory agree | 20 of 21 modes have identical strings; the exception is named and justified |
| REQ-003 | Routing still resolves | Advisor and hub routers select the same modes for the same prompts as before |
| REQ-004 | No orphaned reference | No live path or key reference to a pre-rename name survives outside historical records |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Benchmark gold follows the rename | Lane C route-gold rows reference new keys and score as before |
| REQ-006 | Generated metadata regenerates cleanly | Leaf manifests and advisor pairs rebuild without hand edits |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- A reader can derive a mode's directory from its routing key, and the reverse.
- The link checker and the lane suites sit at their pre-rename baselines.
- Routing behaviour is unchanged; only the names moved.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Mitigation |
|------|------------|
| A consumer class is missed and fails silently | Research runs first, on two independent models and CLIs, and its output is the frozen input to every later phase |
| A routing key is a common word and a bare-string sweep corrupts prose | Rewrite only in typed positions; never match a bare key in text |
| Advisor scores shift because identifiers changed | Re-baseline advisor and Lane C after the rename, comparing behaviour rather than strings |
| A partially renamed tree is worse than an unrenamed one | One hub per phase, each independently revertible |

**Dependencies:** the advisor, the hub routers, the leaf-manifest generator, Lane C gold, and the
runtime mirrors under `.claude/`, `.cursor/`, `.devin/` and `.codex/`.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

1. Whether the three non-sk hubs should later adopt a parallel scheme, so the fleet reads
   consistently without doubled prefixes.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

| Phase | Purpose |
|---|---|
| `001-surface-research` | Find every surface, reference and path a rename touches. Two models, two CLIs, five iterations each. |
| `002-rename-contract-and-map` | Freeze the map and the rewrite rules research produced |
| `003-sk-code-rename` | Four packets, four keys |
| `004-sk-design-rename` | Three packets, three keys |
| `005-sk-doc-rename` | Eleven packets, twelve keys, including the shared-packet exception |
| `006-sk-prompt-rename` | Two packets, two keys |
| `007-consumer-and-gold-realignment` | Advisor metadata, Lane C gold, command bindings, runtime mirrors |
| `008-verification-and-closeout` | Behaviour re-baseline and packet closeout |
| `009-post-review-remediation` | Clear stale route-gold, status-rollup, pre-existing test, and advisor-vocabulary findings |
| `010-luna-review-remediation` | Align the live catalog, publish authoritative current-state verification, and harden freshness traversal |
<!-- /ANCHOR:phase-map -->

Current executable acceptance state: [`010-luna-review-remediation/current-state-verification.md`](010-luna-review-remediation/current-state-verification.md) supersedes the phase 008 snapshot; the earlier observations remain historical.
