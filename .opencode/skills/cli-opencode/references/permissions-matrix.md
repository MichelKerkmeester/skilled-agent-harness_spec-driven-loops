---
title: "cli-opencode permissions matrix"
description: "Structured permissions-matrix schema, examples, RM-8 replay reasoning, and migration checklist for cli-opencode deep-loop dispatches."
---

# cli-opencode permissions matrix

This reference documents the Phase 003 structured gate that replaces the RM-8
four-layer prose mitigation as the primary defense when a cli-opencode deep-loop
dispatch has a permissions matrix configured.

The design follows ADR-001 in
`.opencode/specs/skilled-agent-orchestration/114-small-ai-model-optimization/003-structured-permissions-matrix/decision-record.md`:
a flat `rules[]` array, most-specific glob wins, and first-in-array breaks exact
ties.

## 1. Schema fields

Schema file:

`.opencode/skills/cli-opencode/assets/permissions-matrix.schema.json`

Examples:

- `.opencode/skills/cli-opencode/assets/permissions-matrix.example-readonly.json`
- `.opencode/skills/cli-opencode/assets/permissions-matrix.example-packet-local.json`
- `.opencode/skills/cli-opencode/assets/permissions-matrix.example-repo-wide.json`

Top-level fields:

| Field | Required | Type | Meaning |
| --- | --- | --- | --- |
| `version` | yes | string | Must be `"1.0"` for Phase 003. |
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
allow/deny maps, and generated tokens were left out of Phase 003 because
ADR-001 optimizes for auditability and deterministic runtime matching.

## 2. Resolution semantics

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
`.opencode/specs/.../003-permissions-matrix/**` beats a broad deny rule for
`**`, but two identical globs keep the first rule's effect.

No matching rule means deny. Empty or malformed matrix means deny.

## 3. Example matrix: read-only

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

## 4. Example matrix: packet-local

Use `permissions-matrix.example-packet-local.json` when the operator approves a
specific packet or small file set.

Core intent:

| Rule shape | Effect | Why |
| --- | --- | --- |
| `read` on `**` | allow | Implementation needs evidence from the whole repo. |
| `write`/`edit` on Phase 003 packet docs | allow | Packet docs are the approved continuity scope. |
| `write`/`edit` on Phase 003 schema, examples, reference doc, gate, and test | allow | These are the explicit implementation files. |
| `edit` on `cli-opencode/SKILL.md` | allow | Phase 003 updates only ALWAYS #13. |
| `edit` on `sk-ai-small-model/references/pattern-index.md` | allow | Phase 003 marks the downstream pattern shipped. |
| `execute` on read-only shell commands | allow | Search and inspection stay usable. |
| `execute` on destructive commands | deny | RM-8 prevention. |
| `write`, `edit`, `delete` on `**` | deny | Anything outside explicit Phase 003 paths blocks. |

This is the matrix to use for implementation packets where broad reads are safe
but mutation must stay narrow.

## 5. Example matrix: repo-wide `.opencode`

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

## 6. Runtime gate behavior

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

## 7. RM-8 counter-example walkthrough

Incident source:

`.opencode/skills/cli-opencode/references/destructive_scope_violations.md`

Research source:

`.opencode/specs/skilled-agent-orchestration/114-small-ai-model-optimization/001-smallcode-deep-research/research/research.md`

Patch-ready deepening source:

`.opencode/specs/skilled-agent-orchestration/114-small-ai-model-optimization/001-smallcode-deep-research/research/iterations/iteration-009.md`

The incident doc records:

- Date: 2026-05-04.
- Executor: `opencode-go/deepseek-v4-pro`.
- Mode: `/spec_kit:deep-review:auto`.
- Flag: `--dangerously-skip-permissions`.
- Damage: 44 files deleted across phases 007 and 008.
- File classes: spec docs and `review/` packet subtrees.

Research iter 009 concludes the structured matrix would have blocked all 44
deletions because the attempted filesystem mutation would match either a broad
write deny or an `Exec(rm*)`/`Exec(rm)` deny before execution.

The exact historical deletion manifest is not embedded in the incident doc. The
replay harness therefore uses the two recorded RM-8 classes:

1. canonical spec docs under phase 007 and phase 008;
2. review subtree artifacts under phase 007 and phase 008.

That yields a 44-entry replay set matching the recorded damage count and classes.

### 7.1 Spec doc deletion class

For each phase child, the canonical spec docs are:

| File | Operation | Packet-local decision |
| --- | --- | --- |
| `spec.md` | `write` deletion attempt | denied by broad `write` deny outside Phase 003 scope |
| `plan.md` | `write` deletion attempt | denied by broad `write` deny outside Phase 003 scope |
| `tasks.md` | `write` deletion attempt | denied by broad `write` deny outside Phase 003 scope |
| `checklist.md` | `write` deletion attempt | denied by broad `write` deny outside Phase 003 scope |
| `decision-record.md` | `write` deletion attempt | denied by broad `write` deny outside Phase 003 scope |
| `implementation-summary.md` | `write` deletion attempt | denied by broad `write` deny outside Phase 003 scope |
| `description.json` | `write` deletion attempt | denied by broad `write` deny outside Phase 003 scope |
| `graph-metadata.json` | `write` deletion attempt | denied by broad `write` deny outside Phase 003 scope |

Across two phases, that accounts for 16 blocked deletions.

### 7.2 Review subtree deletion class

The recorded review subtree deletion class is blocked twice.

| Attempt shape | Operation | Packet-local decision |
| --- | --- | --- |
| `Write(file_path=<phase>/review/deep-review-config.json)` | `write` | denied by broad `write` deny outside Phase 003 scope |
| `Write(file_path=<phase>/review/deep-review-state.jsonl)` | `write` | denied by broad `write` deny outside Phase 003 scope |
| `Write(file_path=<phase>/review/deep-review-strategy.md)` | `write` | denied by broad `write` deny outside Phase 003 scope |
| `Write(file_path=<phase>/review/deep-review-findings-registry.json)` | `write` | denied by broad `write` deny outside Phase 003 scope |
| `Write(file_path=<phase>/review/review-report.md)` | `write` | denied by broad `write` deny outside Phase 003 scope |
| `Write(file_path=<phase>/review/deltas/iter-*.jsonl)` | `write` | denied by broad `write` deny outside Phase 003 scope |
| `Write(file_path=<phase>/review/iterations/iteration-*.md)` | `write` | denied by broad `write` deny outside Phase 003 scope |
| `Write(file_path=<phase>/review/prompts/iteration-*.md)` | `write` | denied by broad `write` deny outside Phase 003 scope |
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

## 8. Migration checklist

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

## 9. `**` glob smell warning

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

Phase 003 logs broad-glob warnings as a smoke check. A future CI lint can turn
the smell into a blocking rule if the team wants enforcement.

## 10. Validation commands

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
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/114-small-ai-model-optimization/003-structured-permissions-matrix --strict
```
