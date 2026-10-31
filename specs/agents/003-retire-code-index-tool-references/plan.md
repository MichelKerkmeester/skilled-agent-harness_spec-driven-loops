---
title: "Implementation Plan: Retire the decommissioned code-index tool from the review agents and their documentation"
description: "Change the canonical sources first, regenerate every mirror, then prove the gates that guard these surfaces still pass."
trigger_phrases:
  - "retire detect_changes plan"
  - "code-index cleanup plan"
importance_tier: "normal"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Retire the decommissioned code-index tool from the review agents and their documentation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Canonical first, mirrors second, gates third. That order is the whole plan, and it is not arbitrary: the previous attempt reversed it and failed the mirror-sync commit gate.

`.opencode` owns both review agents. Its permission block grants the tool and its body prose instructs the agent to use it, and the verifier reads both. A mirror edited ahead of its source is drift by definition.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Command | Pass condition |
|------|---------|----------------|
| Mirror sync | `verifyMirrorSync` over both review agents | `allInSync: true`, no drift runtimes |
| Review playbook | the playbook package validator | PASS with the scenario removed |
| Deep-loop tests | the mirror-sync vitest | green with the alias assertions removed |
| Residue | live-tree search for the tool name | only historical records and generated fixtures |
| Packet | `validate.sh <this folder> --strict` | `RESULT: PASSED` printed |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Four surfaces reference the tool, and they have different owners.

**The agents.** `.opencode/agents/{review,deep-review}.md` are canonical. Claude, Codex and Pi mirrors are generated from them; the Cursor entries are symlinks into Claude and follow for free.

**The review skill.** `sk-code-review/SKILL.md` documents the preflight as two numbered steps, which renumber when removed.

**The playbook.** One scenario exists solely to validate the tool, plus its index entry and category.

**The verifier.** `mirror-sync-verify.cjs` maps the bare tool name to its MCP-prefixed form, so a mirror declaring either was treated as matching. With no agent declaring it, the alias has nothing to reconcile.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Stage 1: Canonical sources

Remove the permission grant, the review-methodology prose and the tool-table rows from both `.opencode` agents. Remove the two preflight steps from the review skill and renumber what follows.

### Stage 2: Mirrors

Regenerate the Claude, Codex and Pi agent mirrors through the runtime-mirror sync rather than editing them. Confirm the verifier reports both agents in sync.

### Stage 3: Playbook and verifier

Delete the scenario, update the playbook index and its category, and drop the alias plus its test assertions.

### Stage 4: Proof

Run every gate in section 2 from the final state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

No new tests. This removes references to a capability that does not exist, so there is no new behavior to cover, and the coverage floor applies to behavior rather than deletions.

The proof is the existing gates: the mirror verifier, the playbook validator and the deep-loop unit tests. The negative control already happened, when removing the Claude mirror alone made the verifier report drift. That is the exact failure this ordering avoids, and re-running the verifier is what proves it avoided it.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Direction | Note |
|------------|-----------|------|
| `sync-runtime-mirrors.cjs` | Consumed | Regenerates the agent mirrors |
| `mirror-sync-verify.cjs` | Consumed and changed | The gate, and also a file this packet edits |
| The decommissioned code-index server | Absent | Its absence is the reason for the packet |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

**To undo this: `git revert` the commit.** Every change is a tracked-file edit or deletion, and no generated artifact outside the repository is involved.
<!-- /ANCHOR:rollback -->
