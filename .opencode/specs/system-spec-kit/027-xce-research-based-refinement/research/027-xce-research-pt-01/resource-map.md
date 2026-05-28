---
title: "XCE Research — Resource Map (Path Ledger)"
packet: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement"
created: "2026-05-08T18:00:00Z"
---

# Resource Map — Path Ledger

Per spec.md REQ-009, this maps all file paths referenced during the 10-iteration deep-research run.

---

## Inputs (Read-Only Paths)

### External/ (XCE public surface)
| Path | Lines | Purpose |
|------|-------|---------|
| `external/README.md` | 283 | XCE public surface: tool catalog, steering rules, benchmark results, pricing, architecture diagram |
| `external/LICENSE` | 21 | MIT license — confirms Apache 2.0 / MIT compatibility for pattern adoption |
| `external/steering/CLAUDE.md` | 12 | Claude Code steering rules — "Always use xanther-xce" + "FIRST" pattern |
| `external/steering/kiro.md` | 12 | Kiro steering rules — "Always use xanther-xce" + "FIRST step when starting any task" |
| `external/steering/opencode-prompt.txt` | 4 | OpenCode steering rules — "Always use xanther-xce MCP tools for codebase understanding before reading files" |
| `external/steering/.clinerules` | 8 | Cline steering rules — "Call xce_get_context as your first action on any task" |
| `external/steering/.cursorrules` | 9 | Cursor steering rules — same pattern |
| `external/steering/.windsurfrules` | 9 | Windsurf steering rules — same pattern |
| `external/configs/*.json` | (5 files) | MCP server config shapes per IDE (referenced, not line-cited) |
| `external/assets/*.png` | (3 files) | Benchmark chart, hero, integration matrix (visual metadata extraction only) |

> Code-graph + cocoindex content for this section extracted to 028/research/027-xce-research-pt-01/resource-map.md.
### MCP Server — Skill Advisor
| Path | Lines | Purpose |
|------|-------|---------|
| `mcp_server/skill_advisor/lib/render.ts` | 174 | renderAdvisorBrief(), capText, DEFAULT_TOKEN_CAP (80), confidence ≥ 0.8 threshold gate, FIRST_ACTION_HINT proposal target |
| `mcp_server/skill_advisor/lib/skill-advisor-brief.ts` | ~200 | renderSharedBrief() integration, prompt-boundary gate |
| `mcp_server/skill_advisor/lib/prompt-cache.ts` | 192 | Exact-match brief cache, token cap normalization, hit/miss counter |
| `mcp_server/skill_advisor/lib/scorer/` | (directory) | Scorer surface — reference only, out of scope |

> Code-graph + cocoindex content for this section extracted to 028/research/027-xce-research-pt-01/resource-map.md.
### Spec Folder — Input Documents
| Path | Lines | Purpose |
|------|-------|---------|
| `spec.md` | 331 | Packet spec: 11 REQs, RQ1-RQ9, success criteria, risks, scope |
| `research/deep-research-config.json` | ~30 | Iteration config: maxIterations=10, convergenceThreshold=0.10, executor routing |
| `research/iterations/iteration-001.md` | 192 | RQ1: Architectural Context Gap — F-001 through F-006 |
| `research/iterations/iteration-002.md` | 193 | RQ2: Trace Tool Design — F-007 through F-012 |
| `research/iterations/iteration-003.md` | 176 | RQ3: Impact Analysis Schema — F-013 through F-019 |
| `research/iterations/iteration-004.md` | 171 | RQ4: Get-Context Combiner — F-020 through F-025 |
| `research/iterations/iteration-005.md` | 209 | RQ5: PRAT Reverse-Engineering — F-026 through F-032 |
| `research/iterations/iteration-006.md` | 252 | RQ6: Steering Pattern Transfer — F-033 through F-038 |
| `research/iterations/iteration-007.md` | 233 | RQ7: Benchmark Methodology — F-039 through F-042 |
| `research/iterations/iteration-008.md` | 287 | RQ8: Token Reduction Validation — F-043 through F-047 |
| `research/iterations/iteration-009.md` | 152 | RQ9: Non-Adoption Boundary — SKIP-1 through SKIP-9 |
| `research/findings-registry.json` | 1 | Pre-run registry (empty — filled by iterations) |
| `research/deltas/` | directory | Per-iteration delta JSONL records |

---

## Outputs (Created Paths)

### Research Synthesis (this iteration)
| Path | Lines (est.) | Purpose |
|------|-------------|---------|
| `research/research.md` | ~400 | Final synthesis: executive summary, 9 RQ sections, PRAT reconstruction, steering pattern transfer, alternatives, open questions, references |
| `research/findings.md` | ~280 | Adoption matrix: 21 feature rows classified (4 ADOPT, 9 ADAPT, 2 DEFER, 6 SKIP) with file:line cites, blast radius, sub-packet mapping. "Will NOT adopt" section has 9 expanded rationale items. |
| `research/sub-packet-proposals.md` | ~270 | 5 sub-packet proposals: 028 (HLD/LLD), 029 (Trace), 030 (Impact Analysis), 031 (Advisor Mandate), 032 (Eval Harness). Each with scope, level, dependencies, risk register, out-of-scope guard. Dependency graph. |
| `research/resource-map.md` | ~150 | This file — path ledger with Inputs, Outputs, and External References sections. |
| `research/deep-research-state.jsonl` | 15 lines | State machine: config + 10 iterations + 2 events (executor fallback, convergence). |

### Per-Iteration Outputs (created in iters 001-009)
| Path | Purpose |
|------|---------|
| `research/iterations/iteration-NNN.md` (9 files) | Per-iteration findings, actions, tool-call logs |
| `research/deltas/iter-NNN.jsonl` (9 files) | Per-iteration delta records (structured findings export) |
| `research/logs/` | Iteration logs |
| `research/prompts/` | Per-iteration LLM prompt files |

---

## External References (URLs from `external/README.md` only)

Per spec.md REQ-009, only URLs that appear verbatim in `external/README.md` are included:

| URL | Source line | Description |
|-----|------------|-------------|
| `https://xanther.ai` | README:12 | Xanther website |
| `https://app.xanther.ai` | README:13 | Xanther dashboard |
| `https://discord.gg/Y768kBRS` | README:14 | Xanther Discord community |
| `https://github.com/Xanther-Ai/xanther-cli` | README:15 | Xanther CLI source repository |
| `https://www.swebench.com/` | README:37 | SWE-bench Verified benchmark site |
| `https://xanther.ai/signup` | README:53 | Xanther sign-up page |
| `https://mcp.xanther.ai/sse` | README:74, 88 | XCE MCP server SSE endpoint |
| `https://xanther.ai/pricing` | README:271 | Xanther pricing page |
| `https://xanther.ai/benchmarks` | README:279 | Xanther benchmark results page |

**No other external URLs were referenced during this research run.**
