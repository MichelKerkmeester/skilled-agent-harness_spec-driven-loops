---
title: "Devin CLI — Deep-Loop Iter Contract"
description: "Per-iter contract for cli-devin when dispatched as the executor for /spec_kit:deep-research and /spec_kit:deep-review. Codifies model selection, permission mode, agent-config recipe selection, and prompt body shape so SWE-1.6 iter workers produce high-signal output across long iter sweeps."
---

# Devin CLI — Deep-Loop Iter Contract

How cli-devin behaves when the calling AI dispatches it as the executor for `/spec_kit:deep-research` and `/spec_kit:deep-review`. The contract narrows the general SWE-1.6 Prompt-Quality Contract (SKILL.md §4 ALWAYS #12) to the iter-loop surface and enforces the narrowing at Devin's strict parser via `--agent-config`.

---

## 1. OVERVIEW

The deep-loop iter contract has three moving parts:

- **Three pinned recipes** in `assets/` (research-iter / review-iter / synthesis) — each is a `--agent-config` JSON that locks the tool allowlist and scoped permission entries at Devin's strict parser.
- **A four-block prompt body** (framework tag, pre-planning, scoped RQ or review angle, output contract) that ships in `--prompt-file`.
- **Dispatch wording** in the `if_cli_devin:` branches of `spec_kit_deep-research_auto.yaml` and `spec_kit_deep-review_auto.yaml` that pairs the recipe with the prompt file.

When all three parts are present, an iter worker cannot drift outside its profile even under adversarial prompts. The remainder of this document covers when the contract activates, how to choose between recipes, the exact wording each recipe pins, and the prompt body shape that pairs with each.

---

## 2. WHEN THIS CONTRACT APPLIES

The deep-loop iter contract activates when ALL of the following are true:

1. The dispatch is initiated by `/spec_kit:deep-research` or `/spec_kit:deep-review` (the command surface, not a hand-rolled custom orchestration).
2. The command's `executor:` field resolves to `cli-devin` (per the validator at `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts:7`).
3. The dispatch carries a per-iter prompt file (one of: research iter, review iter, synthesis pass).

When ALL three are true, the dispatcher MUST add `--agent-config <recipe-path>` to the `devin` invocation. The recipe enforces tool allowlist and scoped permission entries at parse time, so iter workers cannot drift outside the read-only-research, read-only-review, or scoped-write-synthesis profile.

When ANY of the three are false, the general SWE-1.6 contract (SKILL.md §4 ALWAYS #12) applies on its own — no recipe pin needed.

---

## 3. RECIPE SELECTION

Three pinned recipes ship in `assets/`:

| Recipe | File | Use For |
|--------|------|---------|
| **Research iter** | `assets/agent-config-deep-research-iter.json` | Per-iter dispatches under `/spec_kit:deep-research`; iter loops that read evidence and emit `iteration-NNN.md` |
| **Review iter** | `assets/agent-config-deep-review-iter.json` | Per-iter dispatches under `/spec_kit:deep-review`; iter loops that audit a packet and emit P0 / P1 / P2 findings |
| **Synthesis** | `assets/agent-config-synthesis.json` | Final consolidation pass that reads N iter files and emits `research.md` + `delta-verified.md` / `review-report.md`; the only recipe with scoped write capability |

Each recipe pins `system_instructions` (array), `allowed_tools` (tool name list), and `permissions.allow` / `permissions.deny` (scope expressions like `Read(/path/**)` and `Exec(<cmd>)`). Devin's strict parser rejects unknown fields, so the recipes also serve as schema documentation.

---

## 4. SEQUENTIAL_THINKING REQUIREMENT (v1.0.4.0+)

Every cli-devin dispatch — research-iter, review-iter, or synthesis — MUST enforce `sequential_thinking` MCP via two layers, since the recipe-level `mcp_servers` field is reserved-but-not-wired in Devin 2026.5.6+.

### Two-layer enforcement (v1.0.4.0)

**Layer 1 — User-scope MCP registration** (operator runs once per machine):

```bash
devin mcp add sequential_thinking npx @modelcontextprotocol/server-sequential-thinking@2025.12.18
devin mcp list | grep sequential_thinking   # verify registration
```

Devin loads the server for every session on the user profile.

**Layer 2 — `system_instructions` mandate** (in every recipe JSON):

```json
"system_instructions": [
  "Before producing the output, you MUST call mcp__sequential_thinking__sequentialthinking with at least 5 thoughts...",
  ... existing instructions ...
]
```

The recipe-level `mcp_servers` field is NOT set in v1.0.4.0 — the Devin binary currently rejects every shape with "untagged enum McpServer" and self-logs `ACP: agent_config mcp_servers are not yet supported in the ACP path and will be ignored`. Re-introduce the field once Devin lands `--agent-config mcp_servers` support.

### Why

SWE-1.6 (default model for the loop) is fast but smaller than complex-task models. Empirical data from packet 999's 40-iter run showed:
- iter that benefit from structured pre-thought produce 30-60% denser citations
- iter without pre-thought tend to start with stdout-fallback boilerplate, miss the JSONL state row, or produce prose without `<ref_file>` tags

Forcing sequential_thinking adds ~10s per iter but eliminates the failure modes above.

### Per-stage thought structure

- **Research iter**: 5 thoughts = pre-planning / evidence reading / finding extraction / gap analysis / JSONL row composition
- **Review iter**: 5 thoughts = pre-planning / packet reading / dimension-specific check / finding tagging (P0/P1/P2) / JSONL row composition
- **Synthesis**: 5 thoughts = iter inventory / theme grouping / contradiction resolution / output structure / provenance verification

### Pre-flight check

Operators verify after registration:
```bash
devin mcp list | grep sequential_thinking
```

Expected: `sequential_thinking ... npx @modelcontextprotocol/server-sequential-thinking@2025.12.18` (or current version).

---

## 5. RESEARCH-ITER RECIPE

### Model and permission mode

- **Model**: `swe-1.6` (default; the recipe does not pin model — the dispatcher passes it explicitly).
- **Permission mode**: `auto` (auto-approves read tools; prompts on write/exec).

### Tool allowlist

`Read`, `Grep`, `Glob`, `Bash` — read-only family plus shell for grep/git inspection.

### Permission scopes

- **Allow**: `Read(<repo-root>/**)`, `Exec(rg)`, `Exec(grep)`, `Exec(git)`, `Exec(ls)`, `Exec(find)`, `Exec(cat)`, `Exec(head)`, `Exec(tail)`, `Exec(wc)`, `Exec(awk)`, `Exec(sed)`.
- **Deny**: `Exec(rm)`, `Exec(mv)`, `Exec(cp)`, `Exec(npm)`, `Exec(pnpm)`, `Exec(yarn)`, `Exec(python)`, `Exec(python3)`, `Exec(node)`.

The deny list explicitly blocks shell utilities that could mutate the working tree even though `write` is not in the allow list — defense in depth against an `Exec` that wraps a mutation.

### System instructions

The recipe's `system_instructions` array carries SWE-1.6's per-iter framing:

1. Identify as a SWE-1.6 deep-research iteration worker.
2. Stay read-only — never propose file mutations.
3. Cite evidence with `file:line` precision.
4. Honor the per-iter scoped research question stated in the prompt body.
5. Produce the exact output shape the iter template requires (iteration-NNN.md heading structure, JSONL delta row).
6. Stop conditions: emit the required output then exit; do not request further input.

The system_instructions array is the recipe's contract floor — per-iter prompts add task-specific details (the RQ, target files, prior-iter context) but never weaken the floor.

---

## 6. REVIEW-ITER RECIPE

### Model and permission mode

- **Model**: `swe-1.6` (default).
- **Permission mode**: `auto`.

### Tool allowlist

`Read`, `Grep`, `Glob` — narrower than research-iter. No `Bash`. Review iter does not need shell access, only file evidence.

### Permission scopes

- **Allow**: `Read(<repo-root>/**)`.
- **Deny**: omitted (no `Bash` in allowed_tools means `Exec(*)` is moot).

### System instructions

The recipe's `system_instructions` array carries review-specific framing:

1. Identify as a SWE-1.6 deep-review iteration worker.
2. Stay read-only.
3. Cite evidence with `file:line` precision.
4. Produce findings tagged P0 / P1 / P2 with explicit reproduction evidence.
5. Honor the scoped review angle stated in the prompt body (one dimension per iter — drift / consistency / completeness / freshness / etc.).
6. Stop conditions: emit findings then exit.

Review iter is stricter than research iter because review surfaces ship straight to a `review-report.md` that drives remediation packets — false positives waste cycles.

---

## 7. SYNTHESIS RECIPE

### Model and permission mode

- **Model**: `swe-1.6` for clean consolidation; `deepseek-v4` when the synthesis pass requires reasoning over conflicting iter findings (the dispatcher chooses based on iter outputs).
- **Permission mode**: `auto`.

### Tool allowlist

`Read`, `Grep`, `Glob`, `Bash`, `Write` — `Write` added for the synthesis output.

### Permission scopes

- **Allow**: `Read(<repo-root>/**)`, `Write(<packet-root>/research/research.md)`, `Write(<packet-root>/research/delta-verified.md)`, `Write(<packet-root>/research/review-report.md)`, `Exec(rg)`, `Exec(grep)`, `Exec(git status)`, `Exec(git diff)`.
- **Deny**: `Exec(rm)`, `Exec(mv)`, `Exec(cp)`, `Exec(git checkout)`, `Exec(git reset)`, `Exec(git clean)`, `Exec(npm)`, `Exec(pnpm)`, `Exec(yarn)`, `Exec(python)`, `Exec(python3)`, `Exec(node)`.

The `Write` allow list is the only place a Devin iter can mutate the tree. The narrow scope (3 specific files under `research/`) means a synthesis pass cannot accidentally edit `spec.md`, `plan.md`, or anything outside `research/`.

### System instructions

1. Identify as a SWE-1.6 synthesis worker.
2. Read every `research/iterations/iteration-NNN.md` and the JSONL delta state.
3. Consolidate findings into the required output file — `research.md` for research, `review-report.md` for review, `delta-verified.md` for surgical edit lists.
4. Cite each consolidated finding by iter number and file:line.
5. Stop conditions: emit the consolidated file then exit. Do not edit any other file.

---

## 8. PROMPT BODY SHAPE

Each iter prompt MUST include five blocks, in this order:

1. **RCAF / STAR / BUILD framework tag** — the first line states which framework the prompt uses (`Framework: RCAF`). RCAF is the SWE-1.6 default per SKILL.md §4 #12; STAR for narrative-heavy iters, BUILD for synthesis passes where multi-file scope boundaries dominate.
2. **Pre-planning block** — ordered steps, per-step acceptance criteria, stop conditions, verification approach.
3. **Scoped RQ or review angle** — one research question per research iter, one review dimension per review iter, one consolidation directive per synthesis pass.
4. **Sequential_thinking invocation marker** — the prompt must include a line: "Sequential_thinking is mandatory before output." The recipe's `mcp_servers` and `system_instructions` enforce this at the runtime layer; the prompt body reinforces visually.
5. **Output contract** — exact heading structure for `iteration-NNN.md` / `findings.md` / consolidated output; required fields for the JSONL delta row.

The cli-devin SKILL.md §4 ALWAYS #12 (general SWE-1.6 contract) governs framework selection and CLEAR 5-check. The deep-loop contract layers the five-block shape on top.

---

## 9. DISPATCH SHAPE

```bash
devin -p \
  --prompt-file "$PROMPT_FILE" \
  --model swe-1.6 \
  --permission-mode auto \
  --agent-config .opencode/skills/cli-devin/assets/agent-config-deep-research-iter.json \
  > "$LOG" 2>&1 </dev/null
```

The dispatcher (one of `spec_kit_deep-research_auto.yaml` or `spec_kit_deep-review_auto.yaml` `if_cli_devin` branch) is the canonical source for the exact invocation shape. This reference doc documents the contract — the YAML carries the dispatch wording.

---

## 10. WHY STRICT PARSING MATTERS

Devin's `--agent-config` flag uses strict parsing — unknown fields are rejected at load time. This is load-bearing for the deep-loop contract:

- If a future Devin CLI version adds a new permission key (e.g. `network`), the recipes do not silently grant it. They fail loudly and the operator updates the recipe explicitly.
- If a per-iter prompt tries to opt into broader tool access via the prompt body, Devin's parser has already locked the allowed_tools list — the prompt cannot override.
- Recipe drift (typo in a key, missing comma) fails the dispatch immediately rather than producing wrong-shape output mid-iter.

Strict parsing converts the contract from a soft norm into a parse-time check.

---

## 11. VERSIONING

This contract is versioned at the cli-devin SKILL.md frontmatter level. Bumping the contract requires:

1. Update `version:` in `.opencode/skills/cli-devin/SKILL.md` frontmatter.
2. Update the recipe JSON files in `assets/` to match the new shape.
3. Add a changelog entry under `.opencode/skills/cli-devin/changelog/`.
4. Run `python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/cli-devin/SKILL.md` to confirm structural integrity.
5. Smoke-test each recipe against `devin -p --agent-config <recipe> --model swe-1.6 --permission-mode auto -- "say ok then stop"` and confirm parse + exit-0.

Current version: `v1.0.3.0` (packet 059, 2026-05-15).

---

## 12. RELATED

- [SKILL.md](../SKILL.md) §4 ALWAYS #12 (SWE-1.6 Prompt-Quality Contract) + #13 (Deep-Loop Iter Contract pointer)
- [agent-config-recipes.md](./agent-config-recipes.md) — per-recipe wording and rationale
- [assets/agent-config-deep-research-iter.json](../assets/agent-config-deep-research-iter.json)
- [assets/agent-config-deep-review-iter.json](../assets/agent-config-deep-review-iter.json)
- [assets/agent-config-synthesis.json](../assets/agent-config-synthesis.json)
- [assets/deep-loop-iter-template.md](../assets/deep-loop-iter-template.md) — per-iter prompt template that pairs with the recipes
- `.opencode/commands/spec_kit/assets/spec_kit_deep-research_auto.yaml` (`if_cli_devin:` branch) — dispatch wording for research
- `.opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml` (`if_cli_devin:` branch) — dispatch wording for review
- `.opencode/agents/deep-research.md` (SWE-1.6 Iter Contract subsection) — agent-side awareness
- `.opencode/agents/deep-review.md` (SWE-1.6 Iter Contract subsection) — agent-side awareness
