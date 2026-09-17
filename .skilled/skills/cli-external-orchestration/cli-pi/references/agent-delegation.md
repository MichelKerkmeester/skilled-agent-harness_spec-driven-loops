---
title: "Pi Agent Delegation Reference"
description: "Delegation guidance for Pi's built-in tool boundary and for handing work out of a Pi session by CLI dispatch."
trigger_phrases:
  - "pi agent delegation"
  - "pi built-in tools"
  - "pi delegation boundary"
  - "pi worker"
  - "delegate from pi"
importance_tier: important
contextType: implementation
version: 1.5.0.5
---

# Pi Agent Delegation Reference

This reference prevents a common category error: Pi's core CLI tools are not the same thing as a delegation framework.

Pi's core stays small and has no sub-agents, and no community package supplies them either. A Pi session that needs to hand work out dispatches a CLI, itself included. Sources: [Pi contract pin](../../../../specs/cli-external-orchestration/031-cli-pi-creation/001-pi-contract-pin/implementation-summary.md), [Using Pi](https://pi.dev/docs/latest/usage).

## 1. OVERVIEW

### Core Principle

Pi's 7 built-in tools cover file and shell operations only. Pi has no in-process delegation at all: no built-in sub-agents, and no community package standing in for them any more. Delegation therefore leaves the session as a CLI dispatch, and everything not confirmed by the local pin stays labeled per Pi docs, unconfirmed.

### Purpose

Distinguishes Pi's built-in tool surface from delegation, and gives the conductor model, request shape, and handback contract for work handed to a child session.

### When to Use

- Deciding whether a task needs a Pi built-in tool or a child dispatch
- Composing the request and handback for a child session
- Choosing an exploration, review, or implementation child pattern

---

## 2. CORE BOUNDARY

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

---

## 3. DELEGATION LEAVES THROUGH A CLI DISPATCH

Pi cannot spawn a worker in-process. Work that must run somewhere else leaves through a CLI
dispatch, and `cli-pi` is a legal target: a Pi session may dispatch pi, because refusing it would
leave Pi with no delegation route at all.

Two bounds survive that permission, both enforced by the shared runtime rather than by prose:

- A dispatch from inside a fan-out lineage is refused. A lineage was spawned to do the work, not
  to delegate it again.
- A dispatch whose kind already appears in the dispatch stack is refused, which is what stops a
  chain from growing without limit.

Neither is about being inside Pi. Both are about already being inside a chain.

One leftover is worth naming rather than leaving for someone to rediscover: the generated
`.pi/agents/` profile mirrors have no consumer any more, and the generator that writes them is
dead code awaiting its own cleanup.

---

## 4. CONDUCTOR MODEL

When work leaves the Pi session, the calling AI remains the outer conductor:

~~~text
Outer calling AI
  -> defines task, scope, and acceptance criteria
Pi main session
  -> decides whether a child dispatch is appropriate
Dispatched child session
  -> does the delegated work under the stated scope
Pi main session
  -> reports child output
Outer calling AI
  -> validates files, tests, and claims
~~~

The outer conductor must not assume that a child inherits the parent spec folder, worktree policy, or permission boundary. Put those requirements in the prompt and verify the result.

---

## 5. REQUEST SHAPE

Use a delegation request with these fields:

| Field | Guidance |
|---|---|
| Objective | One concrete task |
| Context | Relevant files and known evidence |
| Scope | Allowed paths and forbidden paths |
| Child role | Explore, review, or implement |
| Model | Explicit, from the packet's closed roster |
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

---

## 6. EXPLORATION CHILD

Use an exploration child for repository mapping, dependency tracing, or independent research. The child should return paths, symbols, data flow, and unknowns. It should not edit files unless the parent explicitly selects a write-capable path.

Exploration checklist:

- Read the repository instructions first.
- State the inspected paths.
- Separate evidence from inference.
- Avoid broad destructive commands.
- Return a small, searchable handback.

---

## 7. REVIEW CHILD

Use a review child for adversarial checking of an implementation. Require findings-first output:

1. Severity.
2. Exact location.
3. Failure mechanism.
4. Why the behavior matters.
5. Minimal correction.
6. Missing test.

The calling AI confirms findings against the actual repository before editing. A child report is a hypothesis, not a completion claim.

---

## 8. IMPLEMENTATION CHILD

Use a write-capable child only when the parent has approved the scope and verification. The prompt must state:

- The allowed worktree.
- The files in scope.
- The required tests.
- The no-scope-creep rule.
- The handback format.

Do not let a child decide the hub's documentation scope or invent an adapter.

---

## 9. PARALLEL CHILDREN

Parallel child work is safe only when file ownership is disjoint or every child is read-only. Shared writes create races even when the package reports separate logical tasks.

Prefer:

- Multiple read-only mapping children.
- One implementation child followed by one review child.
- Separate worktrees only when explicitly approved.

Avoid parallel writes to settings, registries, or the same source file.

---

## 10. TRUST AND ROLLBACK

The pin confirmed that pi install can reject an untrusted project and that --approve allows a project-local install. That gate still applies to the community packages this packet does document, `pi-mcp-extension` among them. Before installing one:

1. Review the package source and version.
2. Record the settings file that will change.
3. Define the rollback command.
4. Approve only the intended scope.
5. Run a package listing check.
6. Remove the package if the contract is not acceptable.

Do not report a package as installed because a prompt claimed it was installed.

---

## 11. HANDBACK

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
