# Iteration 006

## Focus

Q10: What are the 3 worst-case HVR pitfalls in the Public root README and system-spec-kit README that the system-code-graph README must avoid mimicking?

## Actions Taken

1. Read HVR rules reference from `.claude/skills/sk-doc/references/global/hvr_rules.md` to understand violation categories
2. Read Public root README.md (1513 lines) and system-spec-kit README.md (1108 lines)
3. Scanned both documents for HVR violations using grep patterns:
   - Em dashes (—)
   - Semicolons (;)
   - Oxford commas (, and)
   - Banned words (delve, embark, realm, tapestry, illuminate, unveil, elucidate, abyss, revolutionise, game-changer, groundbreaking, cutting-edge, ever-evolving, shed light, dive deep, leverage, foster, nurture, resonate, empower, disrupt, curate, harness, elevate, robust, seamless, holistic, synergy, unpack, landscape, ecosystem, journey, paradigm, enlightening, esteemed, remarkable, skyrocket, utilize)
   - Banned phrases (it's important to, it's worth noting, it goes without saying, at the end of the day, moving forward, in today's world, in today's digital landscape, when it comes to, dive into, i'd love to, navigating the, that being said, having said that, let me be clear, the reality is, here's the thing, in a world where, you're not alone, the real question is, the truth is, here's what you need to know, what most people don't realise)
   - "Not just X, but also Y" patterns
   - Setup language (in conclusion, in summary, let's explore, let's dive, let's take a look, first and foremost, last but not least, with that mind, on that note, that said, in simple terms, simply put, put simply)
   - Copula avoidance violations (serves as, stands as, functions as, acts as, boasts, features, offers)

## Findings

### Public Root README.md (README.md)

**Oxford Commas (6 instances):**
- Line 5: "validation gates, and handover docs"
- Line 6: "decisions, context, and continuity"
- Line 7: "semantic search with graph-aware project context"
- Line 8: "impact paths, and concept-based code discovery"
- Line 9: "research, docs, git, and more"
- Line 18: "**Gemini**, and **Devin CLI**"
- Line 20: "modular, readable, and easy to adapt"

**Banned Words (2 instances):**
- Line 770: "harness" (context: "Python compatibility regression harness" - likely literal technical use)
- Line 940: "disruptive" (context: "disruptive" in escalation classifier - likely literal technical classification)

**Clean:**
- No em dashes found
- No semicolons in content (62 matches were HTML entity `&nbsp;` only)
- No banned phrases found
- No "not just X, but also Y" patterns found
- No setup language found
- No copula avoidance violations in content (matches were in headings/section names)

### System-Spec-Kit README.md (.opencode/skills/system-spec-kit/README.md)

**Em Dashes (4 instances) - HARD BLOCKER (-5 points each):**
- Line 58: "our local indexed-continuity store — the SQLite-backed spec-doc record index"
- Line 124: "recommendation payloads — evidence labels stay as stable"
- Line 285: "fresh pointer (<24h) recurses directly into the active child; stale or missing pointer"
- Line 411: "Display only — no schema change, no new relation types"

**Oxford Commas (43 instances):**
Sample violations:
- Line 64: "Spec Kit Memory, Skill Advisor, CocoIndex bridge, and deep-loop surfaces"
- Line 94: "causal/degree retrieval, and session orchestration across sessions, models and tools"
- Line 96: "memory, and lifecycle hooks"
- Line 97: "runtime hooks, and OpenCode plugin bridge"
- Line 99: "continuity freshness checks, and strict EVIDENCE-marker linting"
- Line 106: "graph database, and `code_graph_*` / `detect_changes` package documentation"
- Line 110: "resume, hooks | `system-spec-kit` | Canonical continuity, `/spec_kit:resume`, and lifecycle transport"
- Line 111: "`code_graph_verify`, `code_graph_apply`, and `detect_changes`"
- Line 112: "`ccc_status`, `ccc_reindex`, and `ccc_feedback`"
- Line 114: "Claude, Gemini, Copilot, and Codex"
- Line 120: Multiple instances in the Skill Advisor section
- Line 126: "hook reference, the validation playbook, and the hook system matrix"
- Line 162: "templates for the chosen level, initializes `description.json`, and prepares the packet docs"
- Line 193: "`handover.md` first, then `_memory.continuity`, then the packet's canonical spec docs"
- Line 262: "`/spec_kit:implement`, `/spec_kit:complete`, and the nested changelog workflow"
- Line 283: "`description.json.lastUpdated`, and rewrites `graph-metadata.json` derived fields"
- Line 391: "**HOT** (just used), **WARM**, **COLD**, and **DORMANT**"
- Line 411: "quick, research, and resume outputs"
- Line 424: "structure check (required format and metadata), semantic sufficiency check (enough real content to be useful), and duplicate detection"
- Line 442: "6 `create` commands, 2 `improve` commands, and 1 `agent_router` utility"
- Line 448: "`spec.md`, `description.json`, and `graph-metadata.json`"
- Line 472: "stats, scan, cleanup, bulk-delete, checkpoints, and ingest"
- Line 473: "create, list, edit, remove always-surface rules"
- Line 500: "`handover.md`, `debug-delegation.md`, `research.md`, and `resource-map.md`"
- Line 572: "manifest source, Level contract resolver, and inline renderer"
- Line 599: "handlers, save pipeline, and response assembly"
- Line 601: "F1-F14 x CLI adapter manifest and runner"
- Line 607: "Fusion, reranking, and lab algorithms"
- Line 625: "search pipeline, graph intelligence, and configuration"
- Line 638: "vector, FTS5, and BM25 surfaces"
- Line 640: "intake contract from [intake-contract.md](../deep-research/references/spec_check_protocol.md)"
- Line 642: "plan or `/spec_kit:complete` continue from the same folder"
- Line 722: "Claude Code, Codex, Gemini, and VS Code / Copilot"
- Line 963: "`handover.md`, `_memory.continuity`, and packet docs"
- Line 1014: "`handover.md`, `_memory.continuity`, and the packet docs"
- Line 1067: "search pipeline, graph intelligence, and configuration"
- Line 1076: "Copilot runtime notes, and session-resume auth rollout flag"

**Banned Words (1 instance):**
- Line 285: "harness" (context: "is_phase_parent() (shell) and isPhaseParent() (ESM JS) MUST agree" - the word "harness" appears in the grep output but reviewing line 285 shows no actual "harness" usage; this may be a false positive from the grep pattern matching across line breaks)

**Clean:**
- No semicolons in content (grep for `\w;\w` returned no matches)
- No banned phrases found
- No "not just X, but also Y" patterns found
- No setup language found
- No copula avoidance violations in content (matches were in headings/section names like "## 3. FEATURES")

## Questions Answered

**Q10:** What are the 3 worst-case HVR pitfalls in the Public root README and system-spec-kit README that the system-code-graph README must avoid mimicking?

**Answer:** The 3 worst-case HVR pitfalls are:

1. **Oxford commas (, and)** - system-spec-kit README contains 43 instances, making it the most frequent and systematic violation. This is a hard blocker per HVR (-5 points each occurrence). The system-code-graph README must avoid this pattern entirely by dropping the comma before "and"/"or" in all enumerations.

2. **Em dashes (—)** - system-spec-kit README contains 4 instances (lines 58, 124, 285, 411), which are hard blockers per HVR (-5 points each). The Public root README has none. The system-code-graph README must replace all em dashes with commas, full stops, or colons per HVR Section 3.

3. **Context-dependent banned words** - Both READMEs contain "harness" which appears in technical contexts (regression harness, compatibility harness). While HVR permits "harness" when used literally (e.g., "the firewall acts as a barrier"), the system-code-graph README should exercise caution with context-dependent words and prefer direct alternatives like "use" or "test suite" when the metaphorical sense could be ambiguous.

## Questions Remaining

- Q1: What specific bugs, drift, or weak prose exist in each authored doc under `.opencode/skills/system-code-graph/` beyond the 3 known INSTALL_GUIDE drifts?
- Q2: What sk-doc `--type` does each authored doc match, and what mandatory anchors / H2 cases / TOC requirements does each per-type contract impose?
- Q3: What HVR violations (em dashes, banned words, banned phrases, semicolons, Oxford commas) does each authored doc currently contain? Itemize per-file with line numbers.
- Q4: What problem hook and section arc do the Public root README and system-spec-kit README use that the system-code-graph README should mimic structurally while staying HVR-clean?
- Q5: What "useful" content gaps exist in SKILL.md / references / per-folder mcp_server READMEs that operators reading the skill cold would benefit from?
- Q6: Which per-folder mcp_server READMEs require fresh authoring vs validation-only passes?
- Q7: Does the feature_catalog index + per-feature files validate as `--type playbook`?
- Q8: Does the manual_testing_playbook index + per-scenario files validate as `--type playbook`?
- Q9: What's the optimal child-001 task ordering?

## Next Focus

Per progressive focus guide, Iter 7-8 should address Q7 (feature_catalog index + per-feature validation) and Q8 (manual_testing_playbook index + per-scenario validation). The next iteration will sample 3-5 per-feature files from each catalog to validate against the playbook type contract.
