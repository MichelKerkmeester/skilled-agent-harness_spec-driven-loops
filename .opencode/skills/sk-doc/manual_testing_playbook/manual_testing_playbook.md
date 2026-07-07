---
title: "sk-doc: Manual Testing Playbook"
description: "Operator-facing index for sk-doc smart-router validation: intent detection, resource loading, unknown-fallback, cross-CLI dispatch, and token-cost baselines."
version: 1.8.0.14
---

# sk-doc: Manual Testing Playbook

> **EXECUTION POLICY**: Every scenario MUST be executed against the live sk-doc skill — no mocks, no stubs. Scenarios verify the AI's actual routing behavior: which intent the smart router picks (per `SKILL.md` §2 RESOURCE_MAP / INTENT_MODEL), which resources it loads, and how it behaves under ambiguous, large, or multi-step inputs. Acceptable verdicts: PASS, PARTIAL, FAIL, or SKIP (with documented blocker).

This document is the operator directory for the sk-doc manual testing playbook. Per-scenario execution detail lives in the numbered category folders below; each scenario file ships a YAML contract (id, expected_intent, expected_resources, token ranges) plus setup, expected behavior, cross-CLI variants, and success criteria.

Source of truth for routing behavior: `.opencode/skills/sk-doc/SKILL.md` §2 Smart Routing (RESOURCE_MAP, INTENT_MODEL, UNKNOWN_FALLBACK_CHECKLIST, AMBIGUITY_DELTA, ON_DEMAND_KEYWORDS).

---

## 1. OVERVIEW

The sk-doc manual testing playbook validates smart-router behavior through deterministic routing scenarios, cross-CLI dispatch probes, and token-cost baselines.

---

## Categories

| # | Category | Folder | Scenario IDs | One-line summary |
|---|----------|--------|--------------|------------------|
| 1 | Intent Detection | `01--intent-detection/` | SD-001 .. SD-003, SD-016 .. SD-017 | Router picks the correct intent for unambiguous DOC_QUALITY / SKILL_CREATION / AGENT_COMMAND / OPTIMIZATION / INSTALL_GUIDE prompts. |
| 2 | Resource Loading | `02--resource-loading/` | SD-004 .. SD-006 | Router loads only the expected resource set: references-only (HVR), assets-only (FLOWCHART), and mixed (README_CREATION). |
| 3 | Unknown Fallback | `03--unknown-fallback/` | SD-007 .. SD-009 | Router escalates ambiguous prompts via AMBIGUITY_DELTA top-2 return or UNKNOWN_FALLBACK_CHECKLIST. |
| 4 | Cross-CLI Dispatch | `04--cross-cli-dispatch/` | SD-010 .. SD-012 | CLI-specific behavior: short-prompt baseline, large-prompt stress (opencode stdin mitigation), multi-step dispatch stability. |
| 5 | Token Cost Baseline | `05--token-cost-baseline/` | SD-013 .. SD-015 | Cost normalization: floor (1 resource), median (4 resources), ceiling (ON_DEMAND load-all). |
| 6 | Agent Dispatch | `06--agent-dispatch/` | SD-018 .. SD-020 | `@markdown` agent dispatch across cli-claude-code, cli-opencode, and cli-opencode (DeepSeek v4 Pro direct API). EXECUTES real work — distinct from sections 1-5 which are routing-trace probes. |

---

## Scenario Index

### 01 — Intent Detection
- **SD-001** — `01--intent-detection/create-quality-control.md` — DOC_QUALITY: validate documentation quality for a skill.
- **SD-002** — `01--intent-detection/skill-creation.md` — SKILL_CREATION: author a new sk-skill.
- **SD-003** — `01--intent-detection/agent-command.md` — AGENT_COMMAND: author paired @agent and /create command.
- **SD-016** — `01--intent-detection/optimization.md` — OPTIMIZATION: rewrite for token efficiency + llms.txt generation. (added in 076)
- **SD-017** — `01--intent-detection/install-guide.md` — INSTALL_GUIDE: scaffold install guide for an MCP server. (added in 076)

### 02 — Resource Loading
- **SD-004** — `02--resource-loading/references-global-only.md` — HVR loads only `references/hvr_rules.md`.
- **SD-005** — `02--resource-loading/assets-only.md` — FLOWCHART loads only `assets/flowcharts/*`.
- **SD-006** — `02--resource-loading/mixed-references-assets.md` — README_CREATION loads mixed references + assets.

### 03 — Unknown Fallback
- **SD-007** — `03--unknown-fallback/ambiguous-multi-intent.md` — DOC_QUALITY + FLOWCHART tie within AMBIGUITY_DELTA=1.
- **SD-008** — `03--unknown-fallback/no-keyword-match.md` — Zero-keyword prompt → UNKNOWN_FALLBACK_CHECKLIST.
- **SD-009** — `03--unknown-fallback/disambiguation-required.md` — FEATURE_CATALOG ↔ PLAYBOOK tie disambiguation.

### 04 — Cross-CLI Dispatch
- **SD-010** — `04--cross-cli-dispatch/short-prompt-baseline.md` — Short-prompt CHANGELOG baseline across all 3 CLIs.
- **SD-011** — `04--cross-cli-dispatch/large-prompt-stress.md` — ~3000-char prompt; cli-opencode stdin-redirection mitigation.
- **SD-012** — `04--cross-cli-dispatch/multi-step-dispatch.md` — 3 sequential sk-doc invocations with shared session context.

### 05 — Token Cost Baseline
- **SD-013** — `05--token-cost-baseline/minimal-load.md` — Floor: 1 reference (HVR).
- **SD-014** — `05--token-cost-baseline/medium-load.md` — Median: 4 resources (SKILL_CREATION).
- **SD-015** — `05--token-cost-baseline/max-load.md` — Ceiling: ON_DEMAND load-all RESOURCE_MAP.

### 06 — Agent Dispatch
- **SD-018** — `06--agent-dispatch/markdown-agent-cli-claude-code.md` — `@markdown` agent dispatch via cli-claude-code; `/create:changelog` for stub `sk-test-dummy`.
- **SD-019** — `06--agent-dispatch/markdown-agent-cli-opencode.md` — `@markdown` agent inline-contract execution via cli-opencode (gpt-5.5/xhigh/fast). Verifies opencode follows `.opencode/agents/markdown.toml` developer_instructions itself (no SpawnAgent) because the SpawnAgent runtime allowlist upstream-blocks user-defined agents — rubric differs from SD-018/020; see scenario header.
- **SD-020** — `06--agent-dispatch/markdown-agent-cli-opencode.md` — `@markdown` agent dispatch via cli-opencode with DeepSeek v4 Pro through the DIRECT DeepSeek API.

---

## Global Preconditions

1. `.opencode/skills/sk-doc/SKILL.md` is at HEAD-of-main and contains the §2 Smart Routing block (RESOURCE_MAP, INTENT_MODEL, UNKNOWN_FALLBACK_CHECKLIST, AMBIGUITY_DELTA, ON_DEMAND_KEYWORDS).
2. All `references/*.md`, `references/*.md`, `assets/skill/*.md`, `assets/readme/*.md`, `assets/flowcharts/*.md`, `assets/command/*.md`, and `assets/agent_template.md` resolve on disk.
3. Skill advisor binary callable: `python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py --help` exits 0.
4. Each of the 2 CLI runtimes (cli-opencode, cli-claude-code) is installed and authenticated.
5. Token-cost baselines (SD-013 → SD-014 → SD-015) MUST run in order on the same CLI to keep the floor/median/ceiling comparable.
6. **Section 6 (Agent Dispatch) scenarios EXECUTE real work** — unlike sections 1–5 which are routing-trace probes (`DO NOT execute the work below`). SD-018/019/020 actually dispatch `@markdown` to scaffold a changelog. They MUST run sequentially (not in parallel) per the CLI-dispatch reliability constraint, and they MUST forbid installation of the stub skill into the `.opencode/skills/` tree.

## Pass / Fail Grading

For every scenario:

- **PASS** iff: intent picked matches expected, false_positive_resource_load_count ≤ scenario tolerance, response references at least one expected_resource.
- **PARTIAL** iff: intent correct but extra resources loaded above tolerance, OR response references resources but is incomplete.
- **FAIL** iff: wrong intent, OR no expected_resource referenced, OR (for SD-008) any RESOURCE_MAP load.
- **SKIP** iff: a Global Precondition is unmet — document the blocker.

## Evidence Capture

For each scenario run, capture:

1. The exact prompt sent to the CLI.
2. The CLI's resolved intent (and runner-up intents within AMBIGUITY_DELTA).
3. The list of resources the CLI reports as loaded.
4. Input + output token counts (for SD-010..SD-015).
5. Wall-clock latency from dispatch to first byte (for SD-010..SD-012).

Persist evidence under `/tmp/skd-<SCENARIO_ID>-<cli>.txt` so cross-CLI comparison is reproducible.
