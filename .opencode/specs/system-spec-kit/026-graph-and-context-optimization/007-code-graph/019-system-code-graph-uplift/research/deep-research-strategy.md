---
title: Deep Research Strategy - 029 system-code-graph uplift
description: Session tracking for the 20-iter cli-devin SWE 1.6 deep-research run informing the three implementation children.
---

# Deep Research Strategy - 029 system-code-graph uplift

## 1. OVERVIEW

### Purpose
Persistent state for the 20-iter deep-research session. Tracks topic, key questions, what worked, what failed, ruled-out directions, and next focus across iterations.

### Usage
- **Init:** Populated 2026-05-16 from packet 019 scaffold and Phase 1 exploration findings.
- **Per iteration:** cli-devin SWE 1.6 agent reads Next Focus, writes `iteration-NNN.md` + `deltas/iter-NNN.jsonl`. Reducer rewrites machine-owned sections (3, 6, 7-11) after each iter.
- **Mutability:** Mutable. Reducer owns Sections 3, 6, 7-11. Sections 2, 4, 5, 12, 13 are analyst-owned (this file at init).

---

## 2. TOPIC
system-code-graph uplift: skill usefulness, marketing README rewrite (problem-first arc with HVR clean prose), and sk-doc 1:1 alignment across every authored doc. Research must produce a unified evidence base that informs three downstream implementation children: 001-skill-md-and-references-polish, 002-readme-marketing-rewrite, 003-sk-doc-1to1-alignment.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] Q1: What specific bugs, drift, or weak prose exist in each authored doc under `.opencode/skills/system-code-graph/` beyond the 3 known INSTALL_GUIDE drifts (`:49`, `:56`, `:195`)?
- [ ] Q2: What sk-doc `--type` does each authored doc match, and what mandatory anchors / H2 cases / TOC requirements does each per-type contract impose?
- [ ] Q3: What HVR violations (em dashes, banned words, banned phrases, semicolons, Oxford commas) does each authored doc currently contain? Itemize per-file with line numbers.
- [ ] Q4: What problem hook and section arc do the Public root README and system-spec-kit README use that the system-code-graph README should mimic structurally while staying HVR-clean?
- [ ] Q5: What "useful" content gaps exist in SKILL.md / references / per-folder mcp_server READMEs that operators reading the skill cold would benefit from (e.g. "why structural matters" primer, glossary, situational triggers)?
- [ ] Q6: Which per-folder mcp_server READMEs (handlers/lib/tools/tests/core/plugin_bridges/database) require fresh authoring vs validation-only passes? Recent packet 035 shipped most; verify currency.
- [ ] Q7: Does the feature_catalog index + per-feature files validate as `--type playbook`? Are per-feature files inside the catalog discoverable via the per-type contract or do they require recursion?
- [ ] Q8: Does the manual_testing_playbook index + per-scenario files validate as `--type playbook`? Same recursion question.
- [ ] Q9: What's the optimal child-001 task ordering: SKILL.md hook first, then references HVR, then mcp_server per-folder usefulness audit, then INSTALL_GUIDE drift fixes? Or batch by file-type?
- [ ] Q10: For child-002 (README marketing rewrite), what are the 3 worst-case HVR pitfalls the root README + system-spec-kit README contain that the system-code-graph README must avoid mimicking?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Source-code changes under `mcp_server/{lib,handlers,tools,...}` — runtime is correct; this is doc work.
- HVR cleanup of the Public root README or system-spec-kit README — separate packet if found drifted.
- Re-running packet 028's tool-count / topology fixes — already shipped at commit `a7b9b8ae8`.
- Implementation execution of children 001/002/003 — they scaffold and execute as follow-on work after `research/research.md` synthesizes.
- Bumping `package.json` runtime version — only skill-doc version is touched by this uplift.

---

## 5. STOP CONDITIONS
- Convergence score >= 0.05 with quality + coverage gates passing → STOP early
- `maxIterations: 20` reached → STOP with partial findings → synthesize
- 3+ consecutive `stuck` or `failed` iterations → enter recovery; if recovery fails, STOP with partial synthesis
- All 10 key questions in Section 3 marked answered → STOP early
- Devin auth failure or executor budget exhaustion → halt with STATUS=FAIL

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
[None yet]

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
[None yet]

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[None yet]

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[No exhausted approach categories yet]

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
[None yet]

<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Q1: What specific bugs, drift, or weak prose exist in each authored doc under `.opencode/skills/system-code-graph/` beyond the 3 known INSTALL_GUIDE drifts (`:49`, `:56`, `:195`)?

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

### From Phase 1 exploration (this session):
- Skill state after packet 028 (commit a7b9b8ae8): tool count reconciled to 11, topology to standalone, version to 1.0.3.1 in SKILL.md/README/ARCHITECTURE/feature_catalog/graph-metadata.json. INSTALL_GUIDE missed by 028.
- Public root README and system-spec-kit README both open with "AI assistants have amnesia" pain hook + problem→solution→mechanism arc. System-code-graph README opens with implementation prose; user wants hybrid voice (mimic structure, HVR-clean prose).
- sk-doc no "marketing" template; `readme_template.md` accepts plain-explanation voice if HVR ≥85. Banned words: leverage, empower, seamless, disrupt, harness, delve, realm, tapestry, illuminate, unveil, game-changer, cutting-edge, revolutionise. Banned phrases: "It's important to", "In today's world", "Let me be clear", "Dive into", "When it comes to" + 9 more.
- Per-type validators: SKILL needs WHEN_TO_USE/SMART_ROUTING/HOW_IT_WORKS/RULES; README needs TOC + OVERVIEW + RELATED with ALL-CAPS numbered H2s; INSTALL_GUIDE needs OVERVIEW/PREREQUISITES/INSTALLATION/VERIFICATION; feature_catalog + manual_testing_playbook validate as `--type playbook`.
- mcp_server per-folder READMEs shipped recently in packet 035 (`mcp_server/`, `core/`, `plugin_bridges/` all authored 2026-05-15). Likely pass validation but usefulness audit pending.
- cli-devin SWE 1.6 contract per .opencode/skills/cli-devin/SKILL.md §v1.0.4.0+: requires sequential_thinking MCP ≥5 thoughts before output, agent-config recipe pins read-only tool allowlist, bundle verification gate (grep + smoke-run).

### Memory hits (relevant feedback):
- `feedback_cli_devin_bundle_verification`: SWE 1.6 hallucinates plausible consumer names + non-existent CLI flags; grep-verify internal_imports + validation_commands before treating bundle as authoritative.
- `feedback_bundle_gate_smoke_run`: Bundle gate must smoke-run validation_commands, not just grep.
- `feedback_stop_over_confirming`: When next step is obvious, just do it. No A/B/C/D menus.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 20
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls, 15 minutes
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `new` (live for this run)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11
- Canonical pause sentinel: `research/.deep-research-pause`
- Capability matrix: `.opencode/skills/deep-research/assets/runtime_capabilities.json`
- Capability matrix doc: `.opencode/skills/deep-research/references/capability_matrix.md`
- Capability resolver: `.opencode/skills/deep-research/scripts/runtime-capabilities.cjs`
- Current generation: 1
- Started: 2026-05-16T09:50:43Z
