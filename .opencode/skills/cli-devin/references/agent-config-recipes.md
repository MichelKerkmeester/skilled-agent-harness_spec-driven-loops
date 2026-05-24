---
title: "Devin CLI — Agent-Config Recipes"
description: "Per-recipe wording, allowlist rationale, and copy-paste invocations for the three pinned --agent-config JSONs used by /deep:start-research-loop and /deep:start-review-loop cli-devin dispatches. Recipes pin tool allowlist and scoped permission entries at Devin's strict parser so iter workers cannot drift outside their profile."
---

# Devin CLI — Agent-Config Recipes

Three pinned recipes ship in `assets/`. Each maps to a stage of the deep-loop pipeline and pins the smallest tool + permission surface that stage needs. Devin's `--agent-config` flag uses strict parsing (unknown fields rejected), so the recipes are both contract and schema.

For the contract these recipes enforce, see [`deep-loop-iter-contract.md`](./deep-loop-iter-contract.md).

---

## 1. OVERVIEW

This document covers the recipe authoring surface: schema, per-recipe wording and allowlist rationale, substitution placeholders, copy-paste invocations, and the verification procedure run after every edit. Recipes live in `.opencode/skills/cli-devin/assets/` as JSON files. They are read by the `if_cli_devin:` branches of the deep-research and deep-review YAMLs, which substitute `<repo-root>` and `<packet-root>` at dispatch time and write the substituted JSON to a temp file before passing it to `--agent-config`.

| Section | Purpose |
|---------|---------|
| §2 Schema reference | Devin's accepted keys + permission entry syntax |
| §3 Research-iter recipe | Read-only research profile |
| §4 Review-iter recipe | Read-only review profile (narrower than research) |
| §5 Synthesis recipe | Scoped-write consolidation profile |
| §6 Substitution placeholders | Variable substitution at dispatch time |
| §7 Copy-paste invocations | Per-recipe `devin` invocation skeletons |
| §8 Verification | Smoke test after recipe edits |

---

## 2. SCHEMA REFERENCE

Devin's `--agent-config` accepts JSON or YAML. The accepted top-level keys (verified against `devin 2026.5.6-8` on 2026-05-15) are:

| Key | Type | Purpose |
|-----|------|---------|
| `system_instructions` (or `system-instructions`) | array of strings | The system-prompt floor for the dispatched session |
| `allowed_tools` (or `allowed-tools`) | array of tool names | The tool allowlist (e.g. `["Read", "Grep", "Glob", "Bash"]`) |
| `permissions` | object with `allow` / `deny` / `ask` | Scoped permission entries (tool names or scope expressions) |
| `mcp_servers` (or `mcp-servers`) | object map | MCP server registry (Devin 2026.5.6+ schema). DEFERRED in v1.0.4.0 — the binary currently rejects every shape with "untagged enum McpServer" and self-logs `ACP: agent_config mcp_servers are not yet supported in the ACP path and will be ignored`. Enforce sequential_thinking via user-scope registration (`devin mcp add sequential_thinking ...`) PLUS the `system_instructions` mandate. Re-introduce this field once Devin lands `--agent-config mcp_servers` support |
| `extensions` | array | Extension allowlist (not used by deep-loop recipes) |

> **Rejected custom fields.** The strict parser accepts ONLY the keys above. Fields such as `verification_enabled`, `verification_languages`, `bayesian_scoring_enabled`, `bayesian_score_file`, and `fallback_chain` are NOT valid Devin agent-config keys — the binary rejects the entire recipe if any are present. The features they were meant to gate (`output-verification.md`, `quota-fallback.md`, `confidence-scoring-rubric.md`) are deferred at the recipe layer until Devin supports custom agent-config fields, the same way `mcp_servers` is deferred. Do not re-add them to the shipped recipes.

### Permission entry syntax

| Form | Example | Meaning |
|------|---------|---------|
| Tool name | `"read"` | Grant the named tool globally |
| MCP-style | `"mcp__linear__*"` | Glob over MCP-namespaced tools |
| Scope expression | `"Read(/path/**)"` | Grant a tool with a scoped argument |
| Exec scope | `"Exec(git)"` | Grant shell command `git` (no path glob needed) |

Bash commands enter permission scopes as `Exec(<cmd>)`, NOT `Bash(<cmd>)`. The error message from strict parsing on an unknown form is the canonical reference: `expected a tool name (e.g. "read", "mcp__linear__*") or scope expression (e.g. "Read(/path/**)", "Exec(git)")`.

---

## 3. RESEARCH-ITER RECIPE

**File**: `assets/agent-config-deep-research-iter.json`
**Used by**: `/deep:start-research-loop` per-iter dispatches under `cli-devin` executor

### Wording (system_instructions)

```json
[
  "You are a SWE-1.6 deep-research iteration worker.",
  "Before producing the output, you MUST call mcp__sequential_thinking__sequentialthinking with at least 5 thoughts.",
  "Stay read-only EXCEPT for the iter output file. Cite evidence with file:line.",
  "Honor the per-iter scoped research question stated in the prompt body.",
  "Produce the iteration-NNN.md output shape the iter template requires.",
  "Stop conditions: emit the required output then exit. Do not request further input."
]
```

### MCP servers (deferred)

Sequential_thinking enforcement in v1.0.4.0 lives at TWO layers:

1. **User-scope MCP registration** (operator runs `devin mcp add sequential_thinking npx @modelcontextprotocol/server-sequential-thinking@2025.12.18` once). The server appears in `devin mcp list` and Devin loads it for every session on the profile.
2. **`system_instructions` mandate** in this recipe (see the JSON above) that requires the model to call `mcp__sequential_thinking__sequentialthinking` with ≥ 5 thoughts before producing output.

The recipe-level `mcp_servers` field is RESERVED but not yet wired by the Devin binary. Smoke-testing every documented shape against `devin 2026.5.6-8` returned the rejection "untagged enum McpServer", and the binary itself logs `ACP: agent_config mcp_servers are not yet supported in the ACP path and will be ignored`. The 2-layer enforcement above is the working pattern. Re-introduce the recipe-level field once Devin lands `--agent-config mcp_servers` support. See [`deep-loop-iter-contract.md`](./deep-loop-iter-contract.md) §4 for the full contract.

### Tool allowlist rationale

`["Read", "Grep", "Glob", "Bash", "Write"]` — research iter needs to read evidence (`Read`), pattern-match across the tree (`Grep`, `Glob`), run inspection-only shell commands (`Bash` constrained by the permissions `Exec` allowlist below), and write the iter output file (`Write` scoped narrowly to `research/iterations/iteration-NNN.md`, new in v1.0.4.0+; previously the iter relied on stdout-capture which empirical data showed dropped the JSONL row in 22.5% of iters).

### Permissions

- **Allow**: `Read(<repo-root>/**)`, `Exec(rg)`, `Exec(grep)`, `Exec(git)`, `Exec(ls)`, `Exec(find)`, `Exec(cat)`, `Exec(head)`, `Exec(tail)`, `Exec(wc)`, `Exec(awk)`, `Exec(sed)`.
- **Deny**: `Exec(rm)`, `Exec(mv)`, `Exec(cp)`, `Exec(npm)`, `Exec(pnpm)`, `Exec(yarn)`, `Exec(python)`, `Exec(python3)`, `Exec(node)`.

The deny list is defense in depth — even though `Write(*)` is not granted, the deny block stops a `sed -i` or similar shell-mediated mutation.

### Why these scopes

| Scope | Rationale |
|-------|-----------|
| `Read(<repo-root>/**)` | Iter must traverse the full repo to find evidence |
| `Exec(rg)`, `Exec(grep)` | Pattern search across files |
| `Exec(git)` | Inspect `git status`, `git show`, `git log` for history evidence |
| `Exec(ls)`, `Exec(find)` | Directory traversal |
| `Exec(cat)`, `Exec(head)`, `Exec(tail)`, `Exec(wc)` | Content inspection |
| `Exec(awk)`, `Exec(sed)` | Read-only text extraction (no `-i`) |

---

## 4. REVIEW-ITER RECIPE

**File**: `assets/agent-config-deep-review-iter.json`
**Used by**: `/deep:start-review-loop` per-iter dispatches under `cli-devin` executor

### Wording (system_instructions)

```json
[
  "You are a SWE-1.6 deep-review iteration worker.",
  "Before producing the output, you MUST call mcp__sequential_thinking__sequentialthinking with at least 5 thoughts.",
  "Stay read-only EXCEPT for the iter output file. Cite evidence with file:line.",
  "Produce findings tagged P0 / P1 / P2 with explicit reproduction evidence.",
  "Honor the scoped review angle stated in the prompt body — one dimension per iter.",
  "Stop conditions: emit findings then exit."
]
```

### MCP servers (deferred)

Sequential_thinking enforcement in v1.0.4.0 lives at TWO layers:

1. **User-scope MCP registration** (operator runs `devin mcp add sequential_thinking npx @modelcontextprotocol/server-sequential-thinking@2025.12.18` once). The server appears in `devin mcp list` and Devin loads it for every session on the profile.
2. **`system_instructions` mandate** in this recipe (see the JSON above) that requires the model to call `mcp__sequential_thinking__sequentialthinking` with ≥ 5 thoughts before producing output.

The recipe-level `mcp_servers` field is RESERVED but not yet wired by the Devin binary. Smoke-testing every documented shape against `devin 2026.5.6-8` returned the rejection "untagged enum McpServer", and the binary itself logs `ACP: agent_config mcp_servers are not yet supported in the ACP path and will be ignored`. The 2-layer enforcement above is the working pattern. Re-introduce the recipe-level field once Devin lands `--agent-config mcp_servers` support. See [`deep-loop-iter-contract.md`](./deep-loop-iter-contract.md) §4 for the full contract.

### Tool allowlist rationale

`["Read", "Grep", "Glob", "Write"]` — narrower than research iter. No `Bash`. Review surfaces ship straight to a `review-report.md` that drives remediation packets, so false-positive risk from shell-mediated evidence gathering is unacceptable. `Write` is scoped narrowly to `research/iterations/iteration-NNN.md` (new in v1.0.4.0+; previously the iter relied on stdout-capture which empirical data showed dropped the JSONL row in 22.5% of iters).

### Permissions

- **Allow**: `Read(<repo-root>/**)`.
- **Deny**: omitted (without `Bash` in `allowed_tools`, `Exec(*)` scopes are moot).

### Why narrower than research

Review iter finds problems. Research iter finds answers. A research iter that runs `grep` to verify a claim is fine. A review iter that runs `grep` to verify a claim risks shaping its findings to whatever the shell command surfaces, rather than reading the evidence directly. Forcing review iter through `Read` only keeps its findings grounded in actual file contents.

---

## 5. SYNTHESIS RECIPE

**File**: `assets/agent-config-synthesis.json`
**Used by**: Final consolidation pass after N iter dispatches; the ONLY recipe with scoped write capability

### Wording (system_instructions)

```json
[
  "You are a SWE-1.6 synthesis worker.",
  "Before producing the output, you MUST call mcp__sequential_thinking__sequentialthinking with at least 5 thoughts.",
  "Read every research/iterations/iteration-NNN.md and the JSONL delta state.",
  "Consolidate findings into the required output file: research.md for research, review-report.md for review, delta-verified.md for surgical edit lists.",
  "Cite each consolidated finding by iter number and file:line.",
  "Stop conditions: emit the consolidated file then exit. Do not edit any other file."
]
```

### MCP servers (deferred)

Sequential_thinking enforcement in v1.0.4.0 lives at TWO layers:

1. **User-scope MCP registration** (operator runs `devin mcp add sequential_thinking npx @modelcontextprotocol/server-sequential-thinking@2025.12.18` once). The server appears in `devin mcp list` and Devin loads it for every session on the profile.
2. **`system_instructions` mandate** in this recipe (see the JSON above) that requires the model to call `mcp__sequential_thinking__sequentialthinking` with ≥ 5 thoughts before producing output.

The recipe-level `mcp_servers` field is RESERVED but not yet wired by the Devin binary. Smoke-testing every documented shape against `devin 2026.5.6-8` returned the rejection "untagged enum McpServer", and the binary itself logs `ACP: agent_config mcp_servers are not yet supported in the ACP path and will be ignored`. The 2-layer enforcement above is the working pattern. Re-introduce the recipe-level field once Devin lands `--agent-config mcp_servers` support. See [`deep-loop-iter-contract.md`](./deep-loop-iter-contract.md) §4 for the full contract.

### Tool allowlist rationale

`["Read", "Grep", "Glob", "Bash", "Write"]` — `Write` added for the synthesis output. `Bash` retained for git inspection in case the synthesis pass needs to verify git history alignment.

### Permissions

- **Allow**:
  - `Read(<repo-root>/**)`
  - `Write(<packet-root>/research/research.md)`
  - `Write(<packet-root>/research/delta-verified.md)`
  - `Write(<packet-root>/research/review-report.md)`
  - `Exec(rg)`, `Exec(grep)`, `Exec(git status)`, `Exec(git diff)`
- **Deny**: `Exec(rm)`, `Exec(mv)`, `Exec(cp)`, `Exec(git checkout)`, `Exec(git reset)`, `Exec(git clean)`, `Exec(npm)`, `Exec(pnpm)`, `Exec(yarn)`, `Exec(python)`, `Exec(python3)`, `Exec(node)`.

### Why three specific Write scopes

Synthesis must mutate the tree (to write the consolidated output) but only one of three files. Listing them explicitly means a synthesis pass cannot accidentally edit `spec.md`, `plan.md`, `tasks.md`, or anything outside `research/`. The `<packet-root>` placeholder is substituted at dispatch time by the calling AI (the YAML `if_cli_devin` branch interpolates `{spec_folder}` or equivalent).

### Why `Exec(git status)` not `Exec(git)`

The deny list takes precedence over the allow list, but listing `Exec(git status)` + `Exec(git diff)` explicitly (instead of `Exec(git)` plus broad denies) gives a future reader the exact intent: this recipe inspects git state, it does not mutate it. The recipe is also documentation.

---

## 6. SUBSTITUTION PLACEHOLDERS

Each recipe ships with `<repo-root>` and `<packet-root>` placeholders. The dispatcher substitutes these at runtime.

| Placeholder | Substituted by | Example value |
|-------------|----------------|---------------|
| `<repo-root>` | Calling AI's CWD or explicit override | `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public` |
| `<packet-root>` | `{spec_folder}` resolved by the command | Internal design notes |

The dispatcher writes the substituted JSON to a temp file (e.g. `${TMPDIR:-/tmp}/agent-config-iter-NNN.json`) and passes that temp path to `--agent-config`. The asset files remain unchanged.

---

## 7. COPY-PASTE INVOCATIONS

### Research iter

```bash
# Substitute <repo-root> and write to a temp file
REPO_ROOT="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public"
sed "s|<repo-root>|$REPO_ROOT|g" \
  .opencode/skills/cli-devin/assets/agent-config-deep-research-iter.json \
  > /tmp/agent-config-iter-001.json

devin -p \
  --prompt-file /tmp/devin-iter-001.md \
  --model swe-1.6 \
  --permission-mode auto \
  --agent-config /tmp/agent-config-iter-001.json \
  > /tmp/devin-iter-001.log 2>&1 </dev/null
```

### Review iter

```bash
REPO_ROOT="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public"
sed "s|<repo-root>|$REPO_ROOT|g" \
  .opencode/skills/cli-devin/assets/agent-config-deep-review-iter.json \
  > /tmp/agent-config-review-001.json

devin -p \
  --prompt-file /tmp/devin-review-001.md \
  --model swe-1.6 \
  --permission-mode auto \
  --agent-config /tmp/agent-config-review-001.json \
  > /tmp/devin-review-001.log 2>&1 </dev/null
```

### Synthesis

```bash
REPO_ROOT="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public"
PACKET_ROOT="<spec-folder>"
sed -e "s|<repo-root>|$REPO_ROOT|g" -e "s|<packet-root>|$PACKET_ROOT|g" \
  .opencode/skills/cli-devin/assets/agent-config-synthesis.json \
  > /tmp/agent-config-synthesis.json

devin -p \
  --prompt-file /tmp/devin-synthesis.md \
  --model swe-1.6 \
  --permission-mode auto \
  --agent-config /tmp/agent-config-synthesis.json \
  > /tmp/devin-synthesis.log 2>&1 </dev/null
```

---

## 8. VERIFICATION

After authoring or editing a recipe, verify the JSON parses and Devin accepts the shape:

```bash
# 1. JSON parse check
python3 -c "import json; json.load(open('.opencode/skills/cli-devin/assets/agent-config-deep-research-iter.json'))"

# 2. Smoke-test against devin's strict parser (use a stand-in repo-root)
REPO_ROOT=$(pwd)
sed "s|<repo-root>|$REPO_ROOT|g" \
  .opencode/skills/cli-devin/assets/agent-config-deep-research-iter.json \
  > /tmp/smoke-test.json

devin -p \
  --agent-config /tmp/smoke-test.json \
  --model swe-1.6 \
  --permission-mode auto \
  -- "say ok then stop" </dev/null
# Expected: "ok" then exit 0. Any "Failed to parse agent config" output means the recipe has drifted.

# 3. Sequential_thinking MCP server registration check (v1.0.4.0+)
devin mcp list | grep sequential_thinking
# Expected: sequential_thinking row present. If empty, register: devin mcp add sequential_thinking

# 4. Trace-level invocation check (when devin's print mode surfaces tool calls)
# After substitution + smoke, expect the smoke output to show `mcp__sequential_thinking__sequentialthinking`
# invocation in the trace. If the trace does not surface tool calls, fall back to JSONL row presence
# in the iter output as the proxy signal.
```

A drift event (devin updates and tightens schema) is the trigger for a `v1.0.X.0` bump in `SKILL.md` frontmatter and a changelog entry under `changelog/`.

---

## 9. RELATED

- [SKILL.md](../SKILL.md) §4 ALWAYS #13 (Deep-Loop Iter Contract)
- [deep-loop-iter-contract.md](./deep-loop-iter-contract.md) — full contract this file's recipes enforce
- [cli_reference.md](./cli_reference.md) — full `devin` CLI flag reference
- [assets/agent-config-deep-research-iter.json](../assets/agent-config-deep-research-iter.json)
- [assets/agent-config-deep-review-iter.json](../assets/agent-config-deep-review-iter.json)
- [assets/agent-config-synthesis.json](../assets/agent-config-synthesis.json)
- [assets/deep-loop-iter-template.md](../assets/deep-loop-iter-template.md) — paired per-iter prompt template
