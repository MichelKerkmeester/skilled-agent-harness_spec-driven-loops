---
title: "Pi Agent Delegation Reference"
description: "Delegation guidance for Pi's built-in tool boundary and the community pi-subagents bridge."
trigger_phrases:
  - "pi agent delegation"
  - "pi subagent"
  - "pi-subagents"
  - "pi worker"
  - "delegate from pi"
importance_tier: important
contextType: implementation
version: 1.0.0.0
---

# Pi Agent Delegation Reference

This reference prevents a common category error: Pi's core CLI tools are not the same thing as a subagent framework.

The local contract pin confirmed the pi-subagents install verb and package contents. Pi's own documentation says the core stays small and does not include built-in sub-agents. Keep those sources separate: [Pi contract pin](../../../../specs/cli-external-orchestration/031-cli-pi-creation/001-pi-contract-pin/implementation-summary.md), [Using Pi](https://pi.dev/docs/latest/usage).

## 1. CORE BOUNDARY

The installed Pi help exposes built-in tools:

| Tool | Typical role |
|---|---|
| read | Read a file |
| bash | Execute a shell command |
| edit | Apply a find/replace edit |
| write | Create or overwrite a file |
| grep | Search file contents |
| find | Find paths by glob |
| ls | List directory contents |

These tools run in the main Pi session. They do not imply a separate agent process.

Per Pi docs, unconfirmed: Pi's core intentionally does not include built-in sub-agents, plan mode, to-dos, permission popups, or background bash. Extensions and packages can add such workflows. Source: [Using Pi](https://pi.dev/docs/latest/usage).

## 2. COMMUNITY BRIDGE

pi-subagents is a community package, not a first-party Pi CLI mode. The local pin installed it with:

~~~bash
pi install npm:pi-subagents -l --approve
~~~

The install succeeded in the contract run and produced a self-contained project package with agents, prompts, skills, source, and an index file. That evidence confirms the install path and observed package shape, not every behavior of the package.

The package's community status matters:

- Pi core does not own the package contract.
- Package versions can change independently.
- Package permissions and prompts need review.
- A package install mutates project-local settings.
- The package must not become an invisible hub dependency.

## 2A. PROJECT AGENT MIRRORS

Project-local Pi agent profiles live at `.pi/agents/**/*.md` as flat files, one profile per `.opencode/agents/*.md` source. The supported frontmatter keeps the required `name`, carries `description`, and maps allowed OpenCode permissions to Pi tool names in the `tools` array (`read`, `write`, `edit`, `bash`, `grep`, `find`, and `ls` where the source permission has a literal Pi equivalent). Unmapped OpenCode-only permissions stay documented as YAML comments; unsupported optional schema fields remain omitted rather than guessed.

pi-subagents resolves agents in this order: built-in, installed package, user `~/.pi/agent/agents/**/*.md`, then project `.pi/agents/**/*.md`. Project files win when names collide, so these flat project mirrors are the authoritative local override.

## 3. CONDUCTOR MODEL

When using a community subagent bridge, the calling AI remains the outer conductor:

~~~text
Outer calling AI
  -> defines task, scope, and acceptance criteria
Pi main session
  -> decides whether the bridge is appropriate
Community package
  -> creates and manages delegated child work
Pi main session
  -> reports child output
Outer calling AI
  -> validates files, tests, and claims
~~~

The outer conductor must not assume that a child package inherits the parent spec folder, worktree policy, or permission boundary. Put those requirements in the prompt and verify the result.

## 4. REQUEST SHAPE

Use a delegation request with these fields:

| Field | Guidance |
|---|---|
| Objective | One concrete task |
| Context | Relevant files and known evidence |
| Scope | Allowed paths and forbidden paths |
| Child role | Explore, review, or implement |
| Model | Explicit only when the package supports it |
| Tools | Least permissive set |
| Verification | Tests and checks |
| Handback | Required summary and evidence |

Example:

~~~text
Delegate a read-only review of src/auth.
Do not modify files.
Report findings with file and line evidence.
Run no network commands.
Return a structured handback with verification suggestions.
~~~

## 5. EXPLORATION CHILD

Use an exploration child for repository mapping, dependency tracing, or independent research. The child should return paths, symbols, data flow, and unknowns. It should not edit files unless the parent explicitly selects a write-capable path.

Exploration checklist:

- Read the repository instructions first.
- State the inspected paths.
- Separate evidence from inference.
- Avoid broad destructive commands.
- Return a small, searchable handback.

## 6. REVIEW CHILD

Use a review child for adversarial checking of an implementation. Require findings-first output:

1. Severity.
2. Exact location.
3. Failure mechanism.
4. Why the behavior matters.
5. Minimal correction.
6. Missing test.

The calling AI confirms findings against the actual repository before editing. A child report is a hypothesis, not a completion claim.

## 7. IMPLEMENTATION CHILD

Use a write-capable child only when the parent has approved the scope and verification. The prompt must state:

- The allowed worktree.
- The files in scope.
- The required tests.
- The no-scope-creep rule.
- The handback format.

Do not let a package-created child decide the hub's documentation scope or invent an adapter.

## 8. PARALLEL CHILDREN

Parallel child work is safe only when file ownership is disjoint or every child is read-only. Shared writes create races even when the package reports separate logical tasks.

Prefer:

- Multiple read-only mapping children.
- One implementation child followed by one review child.
- Separate worktrees only when explicitly approved.

Avoid parallel writes to settings, registries, or the same source file.

## 9. TRUST AND ROLLBACK

The pin confirmed that pi install can reject an untrusted project and that --approve allows a project-local install. Before installing a community bridge:

1. Review the package source and version.
2. Record the settings file that will change.
3. Define the rollback command.
4. Approve only the intended scope.
5. Run a package listing check.
6. Remove the package if the contract is not acceptable.

Do not report a package as installed because a prompt claimed it was installed.

## 10. HANDBACK

Require this minimum:

~~~text
child_type: explore | review | implement
status: PASS | FAIL | BLOCKED
summary: <one sentence>
files_read:
  - <path>
files_changed:
  - <path or none>
evidence:
  - <finding and source>
verification:
  - <command and result>
unknowns:
  - <unknown or none>
~~~

The parent validates the handback, inspects the diff, and owns the final result.
