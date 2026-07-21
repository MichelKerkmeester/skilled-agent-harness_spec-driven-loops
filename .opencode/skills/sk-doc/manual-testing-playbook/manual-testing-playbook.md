---
title: "sk-doc: Manual Testing Playbook"
description: "Operator-facing index for sk-doc smart-router validation: intent detection, resource loading, unknown-fallback, cross-CLI dispatch, and token-cost baselines."
version: 1.8.0.15
---

# sk-doc: Manual Testing Playbook

> **EXECUTION POLICY**: Every scenario MUST be executed against the live sk-doc skill — no mocks, no stubs. Scenarios verify the AI's actual routing behavior: which `workflowMode` the smart router picks (per `SKILL.md` §2 Smart Routing, resolved through `mode-registry.json` / `hub-router.json`), which resources it loads, and how it behaves under ambiguous, large, or multi-step inputs. Acceptable verdicts: PASS, PARTIAL, FAIL, or SKIP (with documented blocker).

This document is the operator directory for the sk-doc manual testing playbook. Per-scenario execution detail lives in the category folders below; each scenario file ships a YAML contract (id, expected_intent, expected_resources, token ranges) plus setup, expected behavior, cross-CLI variants, and success criteria.

Source of truth for routing behavior: `.opencode/skills/sk-doc/SKILL.md` §2 Smart Routing, resolved at runtime through `mode-registry.json` / `hub-router.json` (the retired flat RESOURCE_MAP is no longer the source of record), plus UNKNOWN_FALLBACK_CHECKLIST, AMBIGUITY_DELTA, and ON_DEMAND_KEYWORDS.

---

## 1. OVERVIEW

The sk-doc manual testing playbook validates smart-router behavior through deterministic routing scenarios, cross-CLI dispatch probes, and token-cost baselines.

---

## Categories

| # | Category | Folder | Scenario IDs | One-line summary |
|---|----------|--------|--------------|------------------|
| 1 | Intent Detection | `intent-detection/` | SD-001 .. SD-003, SD-016 | Router picks the correct intent for unambiguous DOC_QUALITY / SKILL_CREATION / AGENT_COMMAND / OPTIMIZATION prompts. SD-017 (INSTALL_GUIDE) was never authored on disk — see the §01 note. |
| 2 | Resource Loading | `resource-loading/` | SD-004 .. SD-006 | Router loads only the expected resource set: references-only (HVR), assets-only (FLOWCHART), and mixed (README_CREATION). |
| 3 | Unknown Fallback | `unknown-fallback/` | SD-007 .. SD-009 | Router escalates ambiguous prompts via AMBIGUITY_DELTA top-2 return or UNKNOWN_FALLBACK_CHECKLIST. |
| 4 | Cross-CLI Dispatch | `cross-cli-dispatch/` | SD-010 .. SD-012 | CLI-specific behavior: short-prompt baseline, large-prompt stress (opencode stdin mitigation), multi-step dispatch stability. |
| 5 | Token Cost Baseline | `token-cost-baseline/` | SD-013 .. SD-015 | Cost normalization: floor (1 resource), median (4 resources), ceiling (ON_DEMAND load-all). |
| 6 | Agent Dispatch | `agent-dispatch/` | SD-018, SD-020 | `@markdown` agent dispatch across cli-claude-code and cli-opencode (DeepSeek v4 Pro direct API). EXECUTES real work — distinct from the routing-trace-probe sections. SD-019 was never authored as a separate on-disk scenario — see the §06 note. |
| 7 | Holdout | `holdout/` | SD-H01 .. SD-H13 | Generalization probes excluded from the fitted routing aggregate: natural-phrasing rewrites (SD-H01..H05) + independent keyword-blind prompts (SD-H06..H13) across SKILL_CREATION / DOC_QUALITY / README_CREATION / CHANGELOG / FLOWCHART / OPTIMIZATION / INSTALL_GUIDE / FEATURE_CATALOG. |
| 8 | Compiled Routing | `compiled-routing/` | SD-CR-001 | Compiled-serving-authority parity: proves the compiled routing engine reproduces the legacy bundle-rules routing decision for a `create-skill` request. |

---

## Scenario Index

### 01 — Intent Detection
- **SD-001** — `intent-detection/doc-quality.md` — DOC_QUALITY: validate documentation quality for a skill.
- **SD-002** — `intent-detection/skill-creation.md` — SKILL_CREATION: author a new sk-skill.
- **SD-003** — `intent-detection/agent-command.md` — AGENT_COMMAND: author paired @agent and /create command.
- **SD-016** — `intent-detection/optimization.md` — OPTIMIZATION: rewrite for token efficiency + llms.txt generation. (added in 076)

> **SD-017 gap**: reserved for an INSTALL_GUIDE intent-detection scenario (`intent-detection/INSTALL-GUIDE.md`, added in 076) that was never authored on disk. INSTALL_GUIDE intent-routing coverage currently exists only via the holdout probe **SD-H12** (`holdout/ind-install-guide.md`, §07).

### 02 — Resource Loading
- **SD-004** — `resource-loading/references-global-only.md` — HVR loads only `references/hvr-rules.md`.
- **SD-005** — `resource-loading/assets-only.md` — FLOWCHART loads only `assets/flowcharts/*`.
- **SD-006** — `resource-loading/mixed-references-assets.md` — README_CREATION loads mixed references + assets.

### 03 — Unknown Fallback
- **SD-007** — `unknown-fallback/ambiguous-multi-intent.md` — DOC_QUALITY + FLOWCHART tie within AMBIGUITY_DELTA=1.
- **SD-008** — `unknown-fallback/no-keyword-match.md` — Zero-keyword prompt → UNKNOWN_FALLBACK_CHECKLIST.
- **SD-009** — `unknown-fallback/disambiguation-required.md` — FEATURE_CATALOG ↔ PLAYBOOK tie disambiguation.

### 04 — Cross-CLI Dispatch
- **SD-010** — `cross-cli-dispatch/short-prompt-baseline.md` — Short-prompt CHANGELOG baseline across all 3 CLIs.
- **SD-011** — `cross-cli-dispatch/large-prompt-stress.md` — ~3000-char prompt; cli-opencode stdin-redirection mitigation.
- **SD-012** — `cross-cli-dispatch/multi-step-dispatch.md` — 3 sequential sk-doc invocations with shared session context.

### 05 — Token Cost Baseline
- **SD-013** — `token-cost-baseline/minimal-load.md` — Floor: 1 reference (HVR).
- **SD-014** — `token-cost-baseline/medium-load.md` — Median: 4 resources (SKILL_CREATION).
- **SD-015** — `token-cost-baseline/max-load.md` — Ceiling: ON_DEMAND load-all RESOURCE_MAP.

### 06 — Agent Dispatch
- **SD-018** — `agent-dispatch/markdown-agent-cli-claude-code.md` — `@markdown` agent dispatch via cli-claude-code; `/create:changelog` for stub `sk-test-dummy`.
- **SD-020** — `agent-dispatch/markdown-agent-cli-opencode.md` — `@markdown` agent dispatch via cli-opencode with DeepSeek v4 Pro through the DIRECT DeepSeek API.

> **SD-019 gap**: per `changelog/v1.5.0.0.md`, SD-019 covered `@markdown` via **cli-codex** (`gpt-5.5 / fast`) rewritten to `execution_mode: dispatch_inline_contract` — codex v0.130.0's `SpawnAgent` runtime allowlist doesn't propagate user-defined agents, so codex reads `.codex/agents/markdown.toml` developer_instructions directly instead of dispatching a sub-agent (`expected_skip_in_non_interactive: true`; rubric differs from SD-018/020's real dispatch). The root index previously (and incorrectly) mapped SD-019 to `agent-dispatch/markdown-agent-cli-opencode.md`, but that file's frontmatter/body is entirely SD-020 (DeepSeek v4 Pro) — no file with `id: SD-019` exists anywhere in the tree today.

### 07 — Holdout (Generalization Probes)

Natural-phrasing holdouts — same fitted scenario, decontaminated wording (no router keyword vocabulary):
- **SD-H01** — `holdout/skill-creation-natural.md` — SKILL_CREATION via natural phrasing.
- **SD-H02** — `holdout/doc-quality-natural.md` — DOC_QUALITY via natural phrasing.
- **SD-H03** — `holdout/readme-natural.md` — README_CREATION via natural phrasing.
- **SD-H04** — `holdout/changelog-natural.md` — CHANGELOG via natural phrasing.
- **SD-H05** — `holdout/flowchart-natural.md` — FLOWCHART via natural phrasing.

Independent holdouts — authored by an agent blind to the router keyword list:
- **SD-H06** — `holdout/ind-skill-creation.md` — SKILL_CREATION, keyword-blind.
- **SD-H07** — `holdout/ind-doc-quality.md` — DOC_QUALITY, keyword-blind.
- **SD-H08** — `holdout/ind-readme.md` — README_CREATION, keyword-blind.
- **SD-H09** — `holdout/ind-changelog.md` — CHANGELOG, keyword-blind.
- **SD-H10** — `holdout/ind-flowchart.md` — FLOWCHART, keyword-blind.
- **SD-H11** — `holdout/ind-optimization.md` — OPTIMIZATION, keyword-blind.
- **SD-H12** — `holdout/ind-install-guide.md` — INSTALL_GUIDE, keyword-blind.
- **SD-H13** — `holdout/ind-feature-catalog.md` — FEATURE_CATALOG, keyword-blind.

All 13 carry `stage: holdout`: excluded from the fitted routing aggregate, scored only for the fitted-vs-held-out generalization gap.

### 08 — Compiled Routing
- **SD-CR-001** — `compiled-routing/bundle-rules-compiled-routing.md` — sk-doc `create-skill` bundle-rules route: compiled engine (`servingAuthority: compiled`) reproduces the legacy routing decision. Run via `run-skill-benchmark.cjs --compiled-routing-parity on`.

---

## Global Preconditions

1. `.opencode/skills/sk-doc/SKILL.md` is at HEAD-of-main and contains the §2 Smart Routing block resolved through `mode-registry.json` / `hub-router.json` (UNKNOWN_FALLBACK_CHECKLIST, AMBIGUITY_DELTA, ON_DEMAND_KEYWORDS), and both `mode-registry.json` and `hub-router.json` resolve on disk.
2. All `references/*.md`, `references/*.md`, `assets/skill/*.md`, `assets/readme/*.md`, `assets/flowcharts/*.md`, `assets/command/*.md`, and `assets/agent-template.md` resolve on disk.
3. Skill advisor binary callable: `python3 .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py --help` exits 0.
4. Each of the 2 CLI runtimes (cli-opencode, cli-claude-code) is installed and authenticated.
5. Token-cost baselines (SD-013 → SD-014 → SD-015) MUST run in order on the same CLI to keep the floor/median/ceiling comparable.
6. **Section 6 (Agent Dispatch) scenarios EXECUTE real work** — unlike sections 1–5, 7, and 8, which are routing-trace probes (`DO NOT execute the work below`, or the equivalent `stage: holdout` / `stage: routing` framing for §§07–08). SD-018 and SD-020 actually dispatch `@markdown` to scaffold a changelog (SD-019 has no separate on-disk scenario — see the §06 note). They MUST run sequentially (not in parallel) per the CLI-dispatch reliability constraint, and they MUST forbid installation of the stub skill into the `.opencode/skills/` tree.

## Pass / Fail Grading

For every scenario:

- **PASS** iff: intent picked matches expected, false_positive_resource_load_count ≤ scenario tolerance, response references at least one expected_resource.
- **PARTIAL** iff: intent correct but extra resources loaded above tolerance, OR response references resources but is incomplete.
- **FAIL** iff: wrong intent, OR no expected_resource referenced, OR (for SD-008) any mode-registry-mapped resource load.
- **SKIP** iff: a Global Precondition is unmet — document the blocker.

## Evidence Capture

For each scenario run, capture:

1. The exact prompt sent to the CLI.
2. The CLI's resolved intent (and runner-up intents within AMBIGUITY_DELTA).
3. The list of resources the CLI reports as loaded.
4. Input + output token counts (for SD-010..SD-015).
5. Wall-clock latency from dispatch to first byte (for SD-010..SD-012).

Persist evidence under `/tmp/skd-<SCENARIO_ID>-<cli>.txt` so cross-CLI comparison is reproducible.
