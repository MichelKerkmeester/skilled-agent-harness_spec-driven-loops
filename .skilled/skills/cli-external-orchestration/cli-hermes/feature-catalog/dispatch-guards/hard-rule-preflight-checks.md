---
title: "Hermes Hard-Rule Preflight Checks"
description: "Seven Hermes-specific checks evaluate a composed command before it is spawned, covering binary availability, approval scope, rule injection, toolsets, worktrees, MCP configuration and hooks."
trigger_phrases:
  - "hermes hard-rule preflight checks"
  - "hermes-explicit-toolsets-required"
  - "hermes-yolo-required-for-writes"
  - "dispatch rule checks hermes"
version: 1.0.0.0
---

# Hermes Hard-Rule Preflight Checks (dispatch-rule-checks)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Seven Hermes-specific checks evaluate a composed command before it is spawned, covering binary availability, approval scope, rule injection, toolsets, worktrees, MCP configuration and hooks.

The packet declares its rules as frontmatter; a dependency-free engine implements them. Neither half is useful alone, and a declared rule whose check is missing simply never fires.

---

## 2. HOW IT WORKS

### The Seven Checks

`command-v-hermes-required` refuses a command that invokes the binary when the binary is conclusively absent from a readable PATH, and passes on anything uncertain. `hermes-yolo-required-for-writes` requires the approval bypass when the explicit toolset list names a write-capable or terminal toolset, and passes a read-only list. `hermes-ignore-rules-required` requires the rule-suppression flag on any chat command, since without it the operator's instruction files, memories and session search are injected into the leaf prompt. `hermes-explicit-toolsets-required` fails a chat command that names no toolset list at all, and fails one whose list includes delegation or memory. `hermes-no-worktree-flag` refuses the worktree flag, which would create a worktree inside the repository that the containment guard attributes to the lineage and reverts. `hermes-mcp-config-operator-required` refuses a command shaped like an MCP registration, because that is an operator step rather than a task. `hermes-hooks-user-level` refuses the hook-acceptance flag, which would bless whatever the operator's config declares.

The shared headless stdin rule also carries both Hermes forms, and treats the query-file flag as satisfying it, since that flag is Hermes's own stdin contract and never waits on an inherited terminal.

### What The Approval Flag Actually Governs

Omitting the approval bypass does not block ordinary writes or commands. It leaves the run under the single-query approval gate for the calls Hermes itself flags as dangerous, including its dangerous-command patterns and writes into a protected `.hermes/` directory; headless, with nobody present to approve, those calls are blocked. The check therefore fires on the write-capable toolset list rather than on the notion of writing, so that a flagged step cannot silently fail a leaf midway.

### Severity And Failure Posture

The engine parses just enough of the frontmatter to read the flat rule list, evaluates only rules whose check exists, and treats an unknown check as a skip. A check that throws is treated as passing, because a guard must never block a dispatch by malfunctioning. A rule's own declared severity decides the outcome: `block` or `error` denies the dispatch, and anything else is advisory.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs` | Shared | `parseHardRules`, `readHardRules`, the Hermes checks in `CHECKS`, and the severity mapping in `evaluate`. |
| `.skilled/skills/cli-external-orchestration/cli-hermes/SKILL.md` | Handler | The packet's `hard_rules` frontmatter: rule ids, check names, messages and severities. |
| `.skilled/skills/cli-external-orchestration/cli-hermes/references/hook-contract.md` | Handler | The hook boundary the hooks rule states. |
| `.skilled/skills/cli-external-orchestration/cli-hermes/references/mcp-policy.md` | Handler | The operator boundary the MCP rule states. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` | Automated test | Per-check pass and violation cases, including the Hermes rules and the severity mapping. |
| `.skilled/hooks/dispatch/lib/dispatch-audit.test.mjs` | Automated test | The recognition half the preflight shares with the audit trail. |

---

## 4. SOURCE METADATA

- Group: Dispatch guards
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `dispatch-guards/hard-rule-preflight-checks.md`

Related references:
- [dispatch-shape-recognition.md](dispatch-shape-recognition.md) - how a command is recognized as a Hermes dispatch in the first place.
- [../runtime-surface/repo-guards-project-plugin.md](../runtime-surface/repo-guards-project-plugin.md) - the same preflight core reached from inside a Hermes session.
