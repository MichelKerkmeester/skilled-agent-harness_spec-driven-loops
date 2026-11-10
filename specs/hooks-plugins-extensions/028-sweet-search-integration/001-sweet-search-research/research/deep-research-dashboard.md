---
title: Deep Research Dashboard
description: Auto-generated reducer view over the research packet.
---

# Deep Research Dashboard - Session Overview

Auto-generated from JSONL state log, iteration files, findings registry, and strategy state. Never manually edited.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Reducer-generated observability surface for the active research packet.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:status -->
## 2. STATUS
- Topic: Research sweet-search (local code search for AI coding agents; source at specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main): how useful is it, and how could it integrate into the Skilled repo, a relevant Skilled skill, or elsewhere. Prioritize UX in this repo, UX in external repos that install Skilled, and preventing over-engineering.
- Started: 2026-11-09T11:31:26Z
- Status: INITIALIZED
- Iteration: 10 of 10
- Session ID: 2026-11-09T11:31:26Z
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Q1: What does sweet-search actually do (tools, index, runtime, MCP/CLI surface), and what are its hard requirements (Node >=22, macOS/Linux only, native build, GPU, model downloads, disk, index time)? | runtime | 1.00 | 5 | complete |
| 2 | Q2: How credible are its usefulness claims (5-33% cheaper runs, up to 34% less model time)? What do its eval code and data show, and where would the gain be largest or zero for Skilled-style work (large markdown/skill trees, spec folders, TypeScript runtime)? Confirm the active graph-summary path that can send source-derived content to remote providers. | evaluation | 0.88 | 4 | complete |
| 3 | Q3: How does it overlap with or complement what Skilled already has: the committed trigger index, the ripgrep retrieval recipes, the AGENTS.md code-search decision tree, Code Mode/UTCP MCP registration, and the doctor install commands? | - | 0.75 | 4 | complete |
| 4 | Q4: Which integration surfaces are candidates (nothing; a docs pointer; a Code Mode/UTCP manual entry; a new mcp-tooling mode; a doctor install/setup step; an sk-code or system-spec-kit retrieval hook), and what does each cost the user in this repo and in external repos that install Skilled? | integration | 0.75 | 6 | complete |
| 5 | Q5: What is the smallest integration that delivers most of the value, which options are over-engineering, and what are the opt-in, failure and uninstall paths (licence, maintenance, staleness, platform gaps)? | integration | 0.73 | 4 | complete |
| 6 | Q6: What is the strongest case against the iteration-5 recommendation (one optional sk-code pointer), and does any evidence from iterations 1-5 contradict it? Consider whether the right answer is no integration at all, or a slightly bigger one. | - | 0.60 | 3 | insight |
| 7 | Q7: Independent evidence: outside sweet-search's own eval data, what confirms or undercuts its claimed gains? Compare with comparable agent code-search tools and with the built-in search Claude Code, Codex and OpenCode already ship. | - | 0.80 | 5 | complete |
| 8 | Q8: External-repo UX walkthrough: following the recommended path, what exactly does a user in a fresh project repo with Skilled installed see and do, step by step, including when sweet-search is absent, half-installed, stale, or on an unsupported platform (Windows without WSL2, Node below 22)? | - | 0.85 | 6 | complete |
| 9 | Q9: Where exactly would the pointer live and how would agents act on it: which sk-code file and section, the precise wording, how an agent detects that sweet-search is installed without a new script, and how it interacts with the AGENTS.md code-search decision tree? Weigh iteration 6's finding that no integration may be the strongest option. | - | 0.70 | 5 | complete |
| 10 | Q10: What should phase 2 of this packet contain: the file list, the acceptance checks, and the measurement (if any) that would justify growing the integration later? | - | 0.70 | 0 | complete |

- iterationsCompleted: 10
- keyFindings: 47
- openQuestions: 0
- resolvedQuestions: 10

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 10/10
- [x] Q1: What does sweet-search actually do (tools, index, runtime, MCP/CLI surface), and what are its hard requirements (Node >=22, macOS/Linux only, native build, GPU, model downloads, disk, index time)?
- [x] Q2: How credible are its usefulness claims (5-33% cheaper runs, up to 34% less model time)? What do its eval code and data show, and where would the gain be largest or zero for Skilled-style work (large markdown/skill trees, spec folders, TypeScript runtime)?
- [x] Q3: How does it overlap with or complement what Skilled already has: the committed trigger index, the ripgrep retrieval recipes, the code-search decision tree in AGENTS.md, Code Mode/UTCP MCP registration, and the doctor install commands?
- [x] Q4: Which integration surfaces are candidates (nothing; a docs pointer; a Code Mode/UTCP manual entry; a new mcp-tooling mode; a doctor install/setup step; an sk-code or system-spec-kit retrieval hook), and what does each cost the user in this repo and in external repos that install Skilled?
- [x] Q5: What is the smallest integration that delivers most of the value, which options are over-engineering, and what are the opt-in, failure and uninstall paths (licence, maintenance, staleness, platform gaps)?
- [x] Q6: What is the strongest case against the iteration-5 recommendation (one optional sk-code pointer), and does any evidence from iterations 1-5 contradict it? Consider whether the right answer is no integration at all, or a slightly bigger one.
- [x] Q7: Independent evidence: outside sweet-search's own eval data, what confirms or undercuts its claimed gains? Compare with comparable agent code-search tools and with the built-in search Claude Code, Codex and OpenCode already ship.
- [x] Q8: External-repo UX walkthrough: following the recommended path, what exactly does a user in a fresh project repo with Skilled installed see and do, step by step, including when sweet-search is absent, half-installed, stale, or on an unsupported platform (Windows without WSL2, Node below 22)?
- [x] Q9: Where exactly would the pointer live and how would agents act on it: which sk-code file and section, the precise wording, how an agent detects that sweet-search is installed without a new script, and how it interacts with the AGENTS.md code-search decision tree?
- [x] Q10: What should phase 2 of this packet contain: the file list, the acceptance checks, and the measurement (if any) that would justify growing the integration later?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: █▇▆▅▄▄▄▄▃▃▂▂▃▅▅▅▄▃▃▃
- score sparkline: █▇▆▅▄▄▄▄▃▃▂▂▃▅▅▅▄▃▃▃
- Last 3 ratios: 0.85 -> 0.70 -> 0.70
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.70
- coverageBySources: {"arxiv.org":1,"code":20,"code-rag-bench.github.io":1,"codex.danielvaughan.com":1,"cursor.com":3,"github.com":5,"jxnl.co":1,"officechai.com":1,"opencode.ai":1,"other":91,"semlith.com":1,"www.anthropic.com":1,"www.sota2.com":1}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- Code Mode/UTCP mirror: it adds a second registration path beside Sweet Search's native `init --mcp`. (iteration 5)
- Doctor-owned install/setup: it duplicates Sweet Search's own project initialization and uninstall lifecycle. (iteration 5)
- New mcp-tooling mode: it adds routing and packet maintenance for an optional external search tool. (iteration 5)
- system-spec-kit retrieval hook: code navigation belongs on the code-search surface, not document retrieval. (iteration 5)
- The npm package page returned 403 and the GitHub commits page did not expose a latest commit date. Upstream maintenance cadence stays UNKNOWN; the canonical README and release page were still available. (iteration 5)
- The web search snippet was stale for the Node requirement; the current opened README and local package metadata agree on Node 22+. (iteration 5)
- Searching for an independent third-party evaluation of sweet-search itself produced none; every quantitative claim about it still traces to its own checked-in eval data, consistent with iteration 2. (iteration 7)
- The public evidence base on "semantic retrieval for coding agents" is dominated by vendors measuring their own product (Cursor, Zilliz's claude-context, Semlith) or by small pilots; there is no neutral, large-scale, cross-tool benchmark of the kind Q7 would ideally cite. (iteration 7)
- Treating Anthropic's reversal as proof that no code index can help. The published reasons are maintenance, transparency, accuracy, and index-hosting liability for their own product; they do not measure third-party indexes against their harness. [SOURCE: https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk] (iteration 7)
- Treating Cursor's 12.5% accuracy figure as transferable to sweet-search. Cursor's gain is attributed to a custom embedding model trained on agent traces, so the number describes that model, not local embeddings in general. [SOURCE: https://cursor.com/blog/semsearch] (iteration 7)
- Using the CodeRAG-Bench and structural-index results as direct support for sweet-search. Both evaluate retrieval or localisation components, not sweet-search's specific tool contract, and CodeRAG-Bench's repository slice is document retrieval for generation rather than agentic tool use. [SOURCE: https://code-rag-bench.github.io/] [SOURCE: https://arxiv.org/html/2606.22417] (iteration 7)
- Adding a Skilled-side health check or doctor step for sweet-search. The status command already returns one next step per failure, and iteration 5 blocked doctor-owned install/setup. (iteration 8)
- Making the pointer unconditional or install-prompting. Absent is the default; an unconditional note would advertise a tool most repos do not have. (iteration 8)
- None new. The platform matrix resolved cleanly from the compatibility table and Skilled's own prerequisites. (iteration 8)
- Treating Node below 22 as a live failure state for a Skilled-installed repo. Skilled's Node 24 prerequisite makes it unreachable. (iteration 8)
- Adding a detector script or doctor check: the MCP roster, the `.sweet-search/config.json` marker and `status --json` already answer the question with no new maintenance surface. (iteration 9)
- Editing `AGENTS.md`: the root file is not part of the always-linked `.skilled` set, so the pointer would not travel to external repos, and a vendor name would make a capability-framed tree tool-specific. (iteration 9)
- Mirroring the pointer into `workflow-debug.md` as well: one doctrine file is enough to test the idea; a second edit doubles the cost before any evidence of need. (iteration 9)
- None. The exact locations, tool names and status contract were all present in the checked-in sources. (iteration 9)
- Placing the pointer in `sk-code/SKILL.md`: the hub is routing-only by its own contract, and search behavior is workflow logic, not routing. (iteration 9)
- Making the pointer phase 2 without a demonstrated need: it fixes no current failure and spends attention on every code query. (iteration 10)
- No new dead ends. The Q5/Q6 surface rulings still hold. (iteration 10)
- Running a paid agent benchmark inside phase 2: research non-goals exclude it; the measurement is a protocol for a later phase. (iteration 10)
- Treating the pointer as a one-line change: the hub release cost is five files. (iteration 10)

<!-- /ANCHOR:dead-ends -->
<!-- ANCHOR:divergent-pivots -->
## 6A. DIVERGENT PIVOTS
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergent-pivots -->
<!-- ANCHOR:next-focus -->
## 7. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 8. ACTIVE RISKS
- None active beyond normal research uncertainty.

<!-- /ANCHOR:active-risks -->
<!-- ANCHOR:blocked-stops -->
## 9. BLOCKED STOPS
No blocked-stop events recorded.

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 10. GRAPH CONVERGENCE
- graphConvergenceScore: 0.00
- graphDecision: [Not recorded]
- graphBlockers: none recorded

<!-- /ANCHOR:graph-convergence -->
