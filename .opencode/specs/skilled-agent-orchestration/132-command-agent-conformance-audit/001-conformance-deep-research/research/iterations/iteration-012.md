# Iteration 12: Claude Runtime Frontmatter Schema Enforcement (P1-A1 Resolution)

## Focus

**Which frontmatter schema does the installed Claude runtime enforce?** (carried since iteration 3 — P1-A1)

This iteration resolves the long-standing question of whether the Claude Code runtime enforces `tools:` (comma-separated string) or `permission:` (nested object), and whether `create-agent` should emit different schemas per runtime.

## Actions Taken

1. **Cross-runtime frontmatter sweep** — Grepped all 12 agent files in both `.claude/agents/*.md` and `.opencode/agents/*.md` for frontmatter fields (`tools`, `permission`, `mode`, `temperature`, `mcpServers`).
2. **create-agent schema audit** — Read `create-agent/SKILL.md` and `assets/agent_template.md` to determine what canonical schema the skill emits and what it calls "deprecated."
3. **Outlier verification** — Confirmed `.claude/agents/deep-improvement.md` uses the wrong (OpenCode) schema, reading full frontmatter block.
4. **Validator audit** — Checked `validate_document.py` (838 lines) for any agent-specific frontmatter schema enforcement.

## Findings

### P1-A1 RESOLVED: Claude enforces `tools:` string; OpenCode enforces `permission:` object — `create-agent` emits only `permission:` for both

**Surface:** agents / cross-surface

**Evidence:**

- `.claude/agents/*.md` — **11 of 12** agents use `tools: Read, Write, Edit, ...` (the Claude Code native schema). Claude Code subagents parse a comma-separated `tools:` string and enforce it as the only tool restriction mechanism. Fields `mode`, `temperature`, `permission:`, `mcpServers:` are OpenCode-specific and silently ignored by the Claude Code runtime.

- `.opencode/agents/*.md` — **all 12** agents use `mode: subagent`, `temperature: 0.1`, `permission: { read: allow, ... }` (the OpenCode native schema). OpenCode parses the `permission:` object for per-tool allow/deny/ask enforcement.

- `create-agent/SKILL.md:71-96` declares `permission:` as the **sole** canonical schema with no runtime branching.

- `create-agent/SKILL.md:105` — "do not use deprecated standalone `tools:` as the canonical model" — but `tools:` is NOT deprecated; it is the **only** enforceable schema under Claude Code.

- `create-agent/SKILL.md:177` — "Never use deprecated standalone `tools:` frontmatter as the canonical permission model" — same false deprecation.

- `create-agent/assets/agent_template.md:34` — Frontmatter table shows only `permission`/`mcpServers` with no mention of `tools:` at all.

- `validate_document.py` — **zero** agent-specific frontmatter schema checks (grep for `permission`/`tools`/`frontmatter` returns no schema-validation hits across 838 lines). It validates markdown structure only.

**Answer:** Claude Code enforces `tools:` (comma-separated string with tool names and MCP wildcard patterns like `mcp__mk_spec_memory__*`). OpenCode enforces `permission:` (nested object with per-tool allow/deny/ask). `create-agent` should emit **different** schemas per runtime: `tools:` for Claude, `permission:` for OpenCode. The "deprecated" label on `tools:` is incorrect for the Claude surface.

**Concrete fix:**
1. `create-agent/SKILL.md` §2 Canonical Frontmatter: add a runtime-detection branch. When target is `.claude/agents/`, emit `tools:` string. When target is `.opencode/agents/`, emit `permission:` object.
2. Remove "deprecated" language from lines 105 and 177; replace with "runtime-specific" guidance.
3. `create-agent/assets/agent_template.md`: document both schemas in the frontmatter table (line 34).

---

### P1-A2: `.claude/agents/deep-improvement.md` uses wrong schema — OpenCode `permission:` instead of Claude `tools:`

**Surface:** agents

**Evidence:** `.claude/agents/deep-improvement.md:4-19` uses `mode: subagent`, `temperature: 0.2`, `permission:` nested object. There is **no** `tools:` field. All other 11 `.claude/agents/*.md` files correctly use `tools:`.

Under Claude Code, the absence of a `tools:` field means this agent **inherits the parent session's full tool set** — it is effectively unrestricted. The `permission:` block denies `webfetch`, `memory`, `chrome_devtools`, `task`, and `patch`, but all of those denials are silently ignored by Claude Code.

The `.opencode/agents/deep-improvement.md` mirror uses the identical `permission:` schema (correct for OpenCode).

**Concrete fix:** Replace lines 4-19 of `.claude/agents/deep-improvement.md` with the equivalent `tools:` string:

```yaml
tools: Read, Write, Edit, Bash, Grep, Glob
```

This maps the allow-listed permissions (read/write/edit/bash/grep/glob/list/external_directory → all file/shell tools) and drops the deny-listed ones (webfetch, memory, chrome_devtools, task, patch). Note: `list` and `external_directory` are OpenCode-only permission keys with no Claude equivalent — the `tools:` string implicitly allows List and external directory access in Claude Code, which is acceptable for this proposal-only mutator agent.

---

### P2-A1: `create-agent/SKILL.md` falsely labels `tools:` as "deprecated" — it is the active canonical Claude schema

**Surface:** agents / cross-surface

**Evidence:**
- `create-agent/SKILL.md:105` — "do not use deprecated standalone `tools:` as the canonical model"
- `create-agent/SKILL.md:177` — "Never use deprecated standalone `tools:` frontmatter as the canonical permission model"

`tools:` is NOT deprecated — it is the **only** schema Claude Code enforces. Any new agent created via `create-agent` targeting `.claude/agents/` will receive the `permission:` object, which Claude Code ignores, leaving the agent unrestricted (same bug as P1-A2).

**Concrete fix:** Replace "deprecated" with "runtime-specific" in both locations. Add a decision rule: "Use `tools:` for Claude Code agents; use `permission:` for OpenCode agents. Both are canonical for their respective runtimes."

---

### P2-A2: `validate_document.py` has no agent frontmatter schema enforcement

**Surface:** agents / cross-surface

**Evidence:** `validate_document.py` (838 lines) has no frontmatter schema validation for `--type agent`. It validates markdown structure (TOC, headings, emoji, links) but does not check whether an agent file uses the correct permission model for its runtime directory.

**Concrete fix:** Add a frontmatter validator pass for `--type agent`:
- If file path is under `.claude/agents/`: require `tools:` field present and non-empty; warn if `permission:` is used instead.
- If file path is under `.opencode/agents/`: require `permission:` object with at least `read`, `write`, `task` keys; warn if `tools:` is used instead.

---

### Observation: Agent body drift between `.claude/` and `.opencode/` deep-improvement mirrors

**Surface:** agents

Both `.claude/agents/deep-improvement.md` and `.opencode/agents/deep-improvement.md` have **identical** bodies and frontmatter. The Claude copy is a verbatim copy of the OpenCode original — this is the root cause of P1-A2 (the OpenCode schema was copied into the Claude directory). This pattern should be mechanically checked for all 12 mirror pairs going forward: frontmatter MUST differ by runtime, but body should be in sync.

## Questions Answered

1. **Which frontmatter schema does the Claude runtime enforce?** — RESOLVED. Claude Code enforces `tools:` (comma-separated string). OpenCode enforces `permission:` (nested object). The two are runtime-specific, not interchangeable. `create-agent` must emit the correct schema per runtime.

## Questions Remaining

The following carried-forward questions remain unaddressed this iteration (tool budget exhausted):

- Which remaining router-level allowed-tool grants are unused overgrants after route-specific reconciliation? (carried since iteration 5)
- Should `compile-command-contracts.cjs` be wired into a pre-commit/CI hook? (carried since iteration 6)
- Should `mutation_boundaries:` become a cross-family workflow-YAML convention? (inventory complete at iter-10; adoption decision deferred)
- Should create-agent call the system-spec-kit command workflow directly, or should a new typed handoff field replace the retired `speckit.md` agent lookup? (carried since iteration 5 — answered in principle at iteration 7, implementation not yet applied)
- Should doctor `_routes.yaml` trigger_phrases be actively wired into the advisor's signal map? (carried since iteration 6)
- Does canonical skill-graph reindex remove every retired topology node, or are source metadata changes also required? (carried since iteration 2)
- Is `.codex/agents` intended to be restored as a generated mirror in a later phase? (carried since iteration 3)
- Should runtime directory inventories be generated from runtime capability metadata rather than repeated in command YAML? (carried since iteration 5)

## Next Focus

With P1-A1 resolved, the highest-value remaining focus is **router-level allowed-tool grant reconciliation** (carried since iteration 5 — the longest-unaddressed open question). If the remaining iterations prioritize correctly, the convergence pass should consolidate all findings into the final P0/P1/P2 ranked deliverable partitioned by surface.
