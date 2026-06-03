---
title: "cli-opencode permissions matrix"
description: "Structured permissions-matrix schema, examples, RM-8 replay reasoning, and migration checklist for cli-opencode deep-loop dispatches."
---

# cli-opencode permissions matrix

Structured permissions-matrix schema, resolution semantics, example matrices, RM-8 replay reasoning, and migration checklist for cli-opencode deep-loop dispatches.

---

## 1. OVERVIEW

### Purpose

This reference documents the structured gate that replaces the RM-8 four-layer prose mitigation as the primary defense when a cli-opencode deep-loop dispatch has a permissions matrix configured. The design uses a flat `rules[]` array where the most-specific glob wins and first-in-array breaks exact ties.

### When to Use

Read this when configuring or auditing a permissions matrix for a cli-opencode `opencode run` deep-loop dispatch (deep-research or deep-review), when converting a prose-constrained recipe to a structured matrix, or when reasoning about how the gate blocks destructive scope violations.

### Core Principle

The structured gate checks each tool call against deterministic `rules[]` before the tool runs; no matching rule means deny, so the matrix is the primary control whenever it is configured.

---

## 2. SCHEMA FIELDS

Schema file:

`.opencode/skills/cli-opencode/assets/permissions-matrix.schema.json`

Examples:

- `.opencode/skills/cli-opencode/assets/permissions-matrix.example-readonly.json`
- `.opencode/skills/cli-opencode/assets/permissions-matrix.example-packet-local.json`
- `.opencode/skills/cli-opencode/assets/permissions-matrix.example-repo-wide.json`

Top-level fields:

| Field | Required | Type | Meaning |
| --- | --- | --- | --- |
| `version` | yes | string | Must be `"1.0"`. |
| `description` | no | string | Human-readable purpose and resolution note. |
| `rules` | yes | array | Flat rule list evaluated by deterministic specificity. |

Rule fields:

| Field | Required | Type | Meaning |
| --- | --- | --- | --- |
| `target_glob` | yes | string | File path glob or Bash command target such as `Exec(rg)`. |
| `operation_class` | yes | enum | `read`, `write`, `edit`, `delete`, or `execute`. |
| `scope` | yes | enum | `packet-local`, `repo-wide`, or `external`. |
| `effect` | yes | enum | `allow` or `deny`. |
| `rationale` | yes | string | Audit reason surfaced in deny messages. |

Rule objects set `additionalProperties: false`.

The schema intentionally keeps the rule object small. Conditions, nested
allow/deny maps, and generated tokens were left out by design because the
schema optimizes for auditability and deterministic runtime matching.

---

## 3. RESOLUTION SEMANTICS

Runtime matching does four things.

1. Normalize the tool call into an operation and one or more targets.
2. Resolve file paths with `realpath` before matching.
3. Filter rules by `operation_class` and `target_glob`.
4. Pick the most-specific matching glob.

Specificity is measured as:

| Metric | Higher priority |
| --- | --- |
| Literal prefix length | Longer prefix wins. |
| Wildcards | Fewer wildcards wins. |
| Array order | Earlier rule wins exact ties. |

This means an allow rule for
`.opencode/specs/<track>/<packet>/**` beats a broad deny rule for
`**`, but two identical globs keep the first rule's effect.

No matching rule means deny. Empty or malformed matrix means deny.

---

## 4. EXAMPLE MATRIX: READ-ONLY

Use `permissions-matrix.example-readonly.json` for audit, review, and research
iterations that should not mutate the repository.

Core intent:

| Rule shape | Effect | Why |
| --- | --- | --- |
| `read` on `**` | allow | Review loops need corpus access. |
| `execute` on `Exec(rg)`, `Exec(grep)`, `Exec(git)`, `Exec(ls)`, `Exec(find)`, `Exec(cat)`, `Exec(head)`, `Exec(tail)`, `Exec(wc)`, `Exec(awk)`, `Exec(sed)` | allow | Read-only shell inspection remains ergonomic. |
| `execute` on `Exec(rm*)`, `Exec(mv)`, `Exec(cp)`, package managers, `node`, `python*`, and `Exec(sed -i*)` | deny | These commands can mutate files or execute mutation scripts. |
| `write`, `edit`, `delete` on `**` | deny | Read-only means no filesystem mutation. |

The read-only matrix is the closest match for deep-review mode. It blocks the
RM-8 class in two independent ways: direct write/edit/delete tool calls deny,
and the Bash command targets used for deletion deny before shell execution.

---

## 5. EXAMPLE MATRIX: PACKET-LOCAL

Use `permissions-matrix.example-packet-local.json` when the operator approves a
specific packet or small file set.

Core intent:

| Rule shape | Effect | Why |
| --- | --- | --- |
| `read` on `**` | allow | Implementation needs evidence from the whole repo. |
| `write`/`edit` on the approved packet docs | allow | Packet docs are the approved continuity scope. |
| `write`/`edit` on the packet schema, examples, reference doc, gate, and test | allow | These are the explicit implementation files. |
| `edit` on `cli-opencode/SKILL.md` | allow | The packet updates only the relevant ALWAYS entry. |
| `edit` on `sk-prompt-small-model/references/pattern-index.md` | allow | The packet marks the downstream pattern shipped. |
| `execute` on read-only shell commands | allow | Search and inspection stay usable. |
| `execute` on destructive commands | deny | RM-8 prevention. |
| `write`, `edit`, `delete` on `**` | deny | Anything outside the explicit approved packet paths blocks. |

This is the matrix to use for implementation packets where broad reads are safe
but mutation must stay narrow.

---

## 6. EXAMPLE MATRIX: REPO-WIDE `.opencode`

Use `permissions-matrix.example-repo-wide.json` for trusted refactors across
`.opencode`.

Core intent:

| Rule shape | Effect | Why |
| --- | --- | --- |
| `read` on `**` | allow | Repo-wide work needs corpus evidence. |
| `write`/`edit` on `.opencode/**` | allow | Authored `.opencode` source/docs are in scope. |
| `write`/`edit`/`delete` on `.git/**` | deny | Git internals are never authored by agents. |
| `write`/`edit`/`delete` on `node_modules/**` | deny | Vendor trees are not source. |
| `write`/`edit`/`delete` on `~/.config/**` | deny | User config is external to the repo. |
| `delete` on `**` | deny | Repo-wide write does not imply delete permission. |
| `execute` allow/deny set | mixed | Same read-only shell allowlist and destructive denylist. |

This profile has wider authoring scope but still keeps delete and external
configuration operations blocked.

---

## 7. RUNTIME GATE BEHAVIOR

The implementation lives at:

`.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/permissions-gate.ts`

Primary function:

```ts
evaluateToolCall(
  toolName: string,
  args: Record<string, unknown>,
  activeMatrix: PermissionsMatrix,
): { allowed: boolean; reason: string; ruleId?: string }
```

Tool normalization:

| Tool | Operation |
| --- | --- |
| `Read`, `Grep`, `Glob` | `read` |
| `Write` | `write` |
| `Edit`, `MultiEdit`, `apply_patch` | `edit` |
| `Delete` | `delete` |
| `Bash`, `Exec`, `Shell` | `execute` |

Bash calls are normalized to `Exec(<command>)`. Examples:

| Command | Target |
| --- | --- |
| `rg TODO .opencode` | `Exec(rg)` |
| `sed -i s/a/b/g file.md` | `Exec(sed -i)` |
| `git rm file.md` | `Exec(rm)` |
| `find . -delete` | `Exec(rm)` |

If a command contains multiple segments, every command target must pass. A
single denied command denies the whole Bash call.

---

## 8. RM-8 COUNTER-EXAMPLE WALKTHROUGH

Incident source:

`.opencode/skills/cli-opencode/references/destructive_scope_violations.md`

Research source: the SmallCode deep-research record and its patch-ready deepening iteration (iter 009), which concluded the structured matrix would have blocked the recorded RM-8 deletions.

The incident doc records:

- Date: 2026-05-04.
- Executor: `opencode-go/deepseek-v4-pro`.
- Mode: `/deep:start-review-loop:auto`.
- Flag: `--dangerously-skip-permissions`.
- Damage: 44 files deleted across two phase children.
- File classes: spec docs and `review/` packet subtrees.

Research iter 009 concludes the structured matrix would have blocked all 44
deletions because the attempted filesystem mutation would match either a broad
write deny or an `Exec(rm*)`/`Exec(rm)` deny before execution.

The exact historical deletion manifest is not embedded in the incident doc. The
replay harness therefore uses the two recorded RM-8 classes:

1. canonical spec docs under the two affected phase children;
2. review subtree artifacts under the two affected phase children.

That yields a 44-entry replay set matching the recorded damage count and classes.

### 7.1 Spec doc deletion class

For each phase child, the canonical spec docs are:

| File | Operation | Packet-local decision |
| --- | --- | --- |
| `spec.md` | `write` deletion attempt | denied by broad `write` deny outside the approved packet scope |
| `plan.md` | `write` deletion attempt | denied by broad `write` deny outside the approved packet scope |
| `tasks.md` | `write` deletion attempt | denied by broad `write` deny outside the approved packet scope |
| `checklist.md` | `write` deletion attempt | denied by broad `write` deny outside the approved packet scope |
| `decision-record.md` | `write` deletion attempt | denied by broad `write` deny outside the approved packet scope |
| `implementation-summary.md` | `write` deletion attempt | denied by broad `write` deny outside the approved packet scope |
| `description.json` | `write` deletion attempt | denied by broad `write` deny outside the approved packet scope |
| `graph-metadata.json` | `write` deletion attempt | denied by broad `write` deny outside the approved packet scope |

Across two phases, that accounts for 16 blocked deletions.

### 7.2 Review subtree deletion class

The recorded review subtree deletion class is blocked twice.

| Attempt shape | Operation | Packet-local decision |
| --- | --- | --- |
| `Write(file_path=<phase>/review/deep-review-config.json)` | `write` | denied by broad `write` deny outside the approved packet scope |
| `Write(file_path=<phase>/review/deep-review-state.jsonl)` | `write` | denied by broad `write` deny outside the approved packet scope |
| `Write(file_path=<phase>/review/deep-review-strategy.md)` | `write` | denied by broad `write` deny outside the approved packet scope |
| `Write(file_path=<phase>/review/deep-review-findings-registry.json)` | `write` | denied by broad `write` deny outside the approved packet scope |
| `Write(file_path=<phase>/review/review-report.md)` | `write` | denied by broad `write` deny outside the approved packet scope |
| `Write(file_path=<phase>/review/deltas/iter-*.jsonl)` | `write` | denied by broad `write` deny outside the approved packet scope |
| `Write(file_path=<phase>/review/iterations/iteration-*.md)` | `write` | denied by broad `write` deny outside the approved packet scope |
| `Write(file_path=<phase>/review/prompts/iteration-*.md)` | `write` | denied by broad `write` deny outside the approved packet scope |
| `Bash(command="rm -rf <phase>/review")` | `execute` | denied by `Exec(rm*)` |

Across the current reconstructed review artifacts, the replay set uses 28 review
entries plus the 16 spec docs above: 44/44 blocked.

### 7.3 Why the matrix is stronger than prose

The old Layer 1 prompt hardening asked the model not to mutate scope. The matrix
gate checks the tool call before the tool runs. That matters because the RM-8
root cause was not missing prose; it was instruction-only prose combined with
unrestricted filesystem capability.

Layers 2-4 remain useful as defense in depth:

- worktree isolation contains a runtime escape;
- commit-before-dispatch gives a recovery baseline;
- model selection lowers risk for multi-phase targets.

But when a matrix is configured, the structured gate is the primary control.

---

## 9. MIGRATION CHECKLIST

Use this checklist when converting a prose-constrained cli-opencode recipe.

- Identify the dispatch mode: read-only, packet-local, or repo-wide `.opencode`.
- Choose the closest example matrix.
- Replace broad prose permissions with explicit `rules[]` entries.
- Keep `read` broad only when the task genuinely needs corpus evidence.
- Write allow rules before the broad deny rules if they have identical globs.
- Prefer narrow file globs over directory-wide globs.
- Add explicit `Exec(<cmd>)` allows for every shell command the task requires.
- Add explicit denies for `rm`, `mv`, `cp`, package managers, `node`, `python*`,
  `sed -i*`, and any project-specific destructive command.
- Validate with `npx ajv validate -s permissions-matrix.schema.json -d <matrix>`.
- Run a dry replay with representative denied writes before dispatch.
- If no matrix is loaded, keep using the legacy four-layer prose mitigation.

---

## 10. `**` GLOB SMELL WARNING

`**` is sometimes necessary as a final deny or broad read allow. It is a smell
when used as a broad write or edit allow.

Acceptable broad shapes:

- `read` on `**` for corpus inspection;
- `write`/`edit`/`delete` on `**` with `effect: "deny"`;
- `execute` on command-specific `Exec(...)` targets.

Risky shapes:

- `write` on `**` with `effect: "allow"`;
- `edit` on `**` with `effect: "allow"`;
- `delete` on `**` with `effect: "allow"`;
- `execute` on `**` with `effect: "allow"`.

The gate logs broad-glob warnings as a smoke check. A future CI lint can turn
the smell into a blocking rule if the team wants enforcement.

---

## 11. VALIDATION COMMANDS

Schema examples:

```bash
npx ajv validate -s .opencode/skills/cli-opencode/assets/permissions-matrix.schema.json -d .opencode/skills/cli-opencode/assets/permissions-matrix.example-readonly.json
npx ajv validate -s .opencode/skills/cli-opencode/assets/permissions-matrix.schema.json -d .opencode/skills/cli-opencode/assets/permissions-matrix.example-packet-local.json
npx ajv validate -s .opencode/skills/cli-opencode/assets/permissions-matrix.schema.json -d .opencode/skills/cli-opencode/assets/permissions-matrix.example-repo-wide.json
```

Runtime tests:

```bash
cd .opencode/skills/system-spec-kit/mcp_server
npx vitest run tests/deep-loop/permissions-gate.vitest.ts
```

Packet validation:

```bash
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <spec-folder> --strict
```
