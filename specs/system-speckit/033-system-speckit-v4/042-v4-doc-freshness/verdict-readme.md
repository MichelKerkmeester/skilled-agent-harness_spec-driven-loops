---
title: "README freshness verdict: README.md"
date: 2026-09-19
---

# README freshness verdict: `README.md`

**Verdict: TARGETED CORRECTIONS, NOT A REWRITE.** The README's command inventory, skill table,
path probes and document map hold. What drifted is the gate model it describes, a set of shipped
counts, three dead or stale references, one missing agent, and the repository's own name.

## How this verdict was reached

Same run as the changelog verdict: ten deep-research iterations on `cli-devin`
(`deepseek-v4-1-flash-max`), then a synthesis pass on `gemini-3-8-flash-high`, an independent
review on `glm-5-3-flash-max`, and a bounded repair pass.

The README side is where that layered approach earned its cost. The synthesis dropped the ten
README defect findings iterations 3 and 6 had recorded and then described the work as closed, and
the review caught it. The repair pass recovered the rows, and re-verification overturned one row
in the run's own apply list (**B2**, below) plus two line pins.

## Rows

Line numbers are as they stood before the correction pass.

### Applied

| # | Line | Claim that drifted | Current truth | Evidence | Correction applied | Confidence |
|---|---|---|---|---|---|---|
| R1 | L14-16, L96-97 | Badges and clone instructions name `opencode--spec-kit-skilled-agent-orchestration` | The repository is `skilled-agent-harness_spec-driven-loops` | `git remote -v`; the old slug answers HTTP 301 to the canonical one (probed during this pass) | Badge URLs and the `clone`/`cd` pair now name the canonical slug | High |
| R2 | L45, L261, L271 | "GATE SYSTEM (3 mandatory gates)", "3 mandatory gates run before any file change", and Gate 1's "confidence >= 0.70, uncertainty <= 0.35" | Five mandatory gates run before a file change, plus three after execution, and Gate 1 uses the three-tier table | `AGENTS.md:52-108` (Gates 1-5), `AGENTS.md:153`, and the confidence table at `AGENTS.md:73-78` | The box and the prose say five, the diagram enumerates Gates 4 and 5, and Gate 1's line now reads "Levels: 80%+ go, 40-79% caveat, <40% ask" | High |
| R3 | L59 | The overview diagram claims "20 domain skills" | Thirteen skills ship, which the README itself states three times | 13 directories under `.skilled/skills/`; `README.md:10`, `:547`, `:990` all say 13 | Diagram now reads "13 domain skills" | High |
| R4 | L92 | "Node.js 18+" | No shipped manifest supports Node 18 | `engines` floors: `>=20.11.0` in system-spec-kit, `>=22.12.0` in the spec-kit runtime CLI | "Node.js 20.11+ (22.12+ for the spec-kit runtime CLI)" | High |
| R5 | L180 | "Sixteen templates ship" | Eighteen `.tmpl` files ship | 4 in `core/`, 10 in `addons/`, 4 in `packet-types/` | "Eighteen templates"; `research.spec.md` and `review-report.md` added to the packet-types row | High |
| R6 | L567 | "Two ready surfaces" for `sk-code` | Three surface packets ship | `.skilled/skills/sk-code/` holds webflow, opencode, obsidian; `README.md:950` already lists all three | "Three ready surfaces", with OBSIDIAN described | High |
| R7 | L607, L945 | `mcp-tooling` routes to three modes (L607) and four (L945) | Ten modes ship | `.skilled/skills/mcp-tooling/mode-registry.json` modes 0-9; ten `mcp-*` packet dirs | Both rows now enumerate ten modes, six workflow plus four design transports | High |
| R8 | L644-676 | The agent roster omits the shipped `design` agent | Twelve agents ship and the roster covered eleven | `.skilled/agents/` holds 12 files including `design.md` | A **Design** entry was added at the end of the orchestration block, taken from the agent's own description | High |
| R9 | L839 | "The 12 underlying YAML workflows in `.skilled/commands/doctor/assets/`" | Thirteen ship | 13 `doctor-*.yaml` files counted on disk | "The 13 underlying YAML workflows" | High |
| R10 | L966 | A `- **`.vscode/mcp.json`**` bullet in the configuration list | The path does not exist | Commit `759713c41aa` deleted `.vscode/`; `git ls-files .vscode` returns nothing | The bullet was removed | High |
| R11 | L625 | "96-feature catalog + 76-scenario playbook" | The playbook index lists 37 scenarios | The packet's own scenario index; the 96-feature half verifies | "37-scenario playbook" | Medium-high |
| R12 | L913-920 | The `.utcp_config.json` integration list names 7 templates and includes a `clickup` community server | 14 templates are registered and the `clickup` community template is not one of them | `.utcp_config.json` `manual_call_templates` holds 14 entries, none named `clickup` | The list now states 14, keeps the six described rows, names the rest, and drops the phantom row | High |
| R13 | L957 | "the shipped Webflow + OpenCode + Motion.dev surfaces" | Obsidian is the third surface; Motion.dev is an overlay | Three surface packets; Motion.dev lives inside `sk-code-webflow` | "Webflow + OpenCode + Obsidian", with Motion.dev named as an animation overlay inside Webflow | High |

### Rejected at the verdict gate

| # | Line | Proposed edit | Why it was refused | Evidence |
|---|---|---|---|---|
| B2 | L412 | Correct "121 advisor test files, 872 tests" to "3 test files" | **The proposal was false and would have made the README wrong by roughly forty times.** The census behind it counted only `*.test.ts` and missed the `*.vitest.ts` files that dominate the suite | `.skilled/skills/system-skill-advisor/runtime/tests/` holds 55 test files at top level (3 `*.test.ts` + 52 `*.vitest.ts`), 128 recursively, with 811 `it()`/`test()` cases. Against that, "121 files, 872 tests" is approximately right, so the row was left unedited |

The independent review caught this row; the orchestrator re-counted the tree before refusing it.
It is the strongest argument in this packet for the layered run: the run's own final apply list
carried one edit that would have written a false number into a release document.

### Closed with no edit

| # | Line | Claim | Verdict | Evidence |
|---|---|---|---|---|
| — | L412 | Advisor test counts | Holds approximately; no edit | See B2 above |
| — | L1030-1046 | Related Documents section with its internal links | Holds; the section lists 12 bullets, all resolving | `README.md:1030`; iteration 9's "section is missing" flag was a case-sensitive search artifact |
| — | L9, L36, L547 | "12 agents", "13 skills", "13 advisor skill identities" | Hold | Re-counted against `.skilled/agents/` and `.skilled/skills/` |
| — | L413 | 47 scenario files | Holds | Counted in the playbook |
| — | L696 | The command inventory | Holds | 32 entry points plus 3 root utilities |
| — | L427, L534, L116, L961-965, L156 | Packet structure, two co-equal lanes, four families and five commands, the nine advisor commands, configuration files | Hold | Re-read at iteration 10 |
| — | L447 | A "Rust Joins the Code" row | The heading is changelog text, not README text | `README.md:447` is a diagram line and the README contains no Rust text; the row was withdrawn |
| — | L686 | The "Context Retrieval" heading | Kept. It is `@context`'s deep-loop leaf view, by the README's own cross-reference convention, not a duplicate entry | `README.md:686` reads "`@context` owns direct lookup and continuity recovery" |

### Recommended, not executed

**Two recommendations, neither applied:**

1. **The changelog's pre-release numerics** (28KB command, 3,000-line template, forty-two
   surfaces, forty-four alerts, 178 recommendations and the rest) cannot be re-derived, because
   the artifacts they counted no longer exist. Provenance auditing would settle them; nothing in
   this packet can.
2. **A rewrite of neither document.** The evidence supports targeted corrections only.

## What the correction pass did not touch

Named here so they are not lost, and deliberately not fixed:

- `cli-devin`'s `SKILL.md` roster line lists only `deepseek-v4-flash-max`.
- `041-skilled-source-root-migration/spec.md` carries a stale continuity block.

## Review defects and how each was handled

| Review finding | Handling |
|---|---|
| The synthesis dropped ten README findings from iterations 3 and 6 | Rows recovered and applied as R1-R13 |
| Row B2's census was wrong | Rejected (see above) |
| Row B16 quoted changelog text as README text | Withdrawn |
| The link count was 10, not 12 | Corrected in this document |
| The stop-reason citation pointed at a file without that field | Recorded; the convergence report cites the strategy file instead |
| One commit date in the synthesis references was a day early | Corrected |
| A zero-count overgeneralized a scoped observation | Recorded as scoped to `repo-rules/` |
| The 18th bridged hook package was named as confirmed when it was inference | Recorded as unresolved; the changelog row needed no edit |
| "Q3 closed" was an overclaim | This document carries the full adjudicated set instead |
