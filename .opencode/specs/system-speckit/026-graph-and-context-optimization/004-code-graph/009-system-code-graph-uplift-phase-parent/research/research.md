---
title: "Deep Research: 029 system-code-graph uplift"
description: "Consolidated 20-iter cli-devin SWE 1.6 deep-research output covering skill usefulness, marketing README rewrite arc, and sk-doc 1:1 alignment across system-code-graph authored docs."
---

# Deep Research: 029 system-code-graph uplift

## 1. EXECUTIVE SUMMARY

The 20-iteration deep-research session identified 15 additional bugs and drift beyond the 3 known INSTALL_GUIDE issues, documented extensive HVR violations across core authored docs (87 total violations with estimated scores as low as 45), mapped all 8 primary authored docs to their sk-doc types with full contract compliance, and extracted structural patterns from Public root and system-spec-kit READMEs to inform a marketing rewrite for system-code-graph. The research found that plugin_bridges/README.md requires fresh authoring due to post-extraction drift, while 8 other per-folder READMEs need only validation passes. Content gaps were identified across SKILL.md, README.md, references/, and mcp_server READMEs (missing "why structural matters" primers, glossaries, situational triggers). The three implementation children should proceed with: child-001 using SKILL.md hook-first then batch-by-file-type ordering to fix 15 drift bugs and HVR violations, child-002 following the problem-hook-to-solution arc pattern while avoiding semicolons/Oxford commas/em dashes, and child-003 validating all docs against their sk-doc type contracts (already compliant per iter-019).

## 2. TOPIC & SCOPE

**Topic:** system-code-graph uplift: skill usefulness, marketing README rewrite (problem-first arc with HVR clean prose), and sk-doc 1:1 alignment across every authored doc. Research must produce a unified evidence base that informs three downstream implementation children: 001-skill-docs-install-guide-and-readmes-polish, 002-readme-problem-first-rewrite, 003-sk-doc-type-validation-alignment.

**Non-goals:** Source-code changes under mcp_server/{lib,handlers,tools,...} — runtime is correct. HVR cleanup of the Public root README or system-spec-kit README — separate packet if found drifted. Re-running packet 028's tool-count/topology fixes — already shipped at commit a7b9b8ae8. Implementation execution of children 001/002/003 — they scaffold and execute as follow-on work after research.md synthesizes. Bumping package.json runtime version — only skill-doc version is touched by this uplift.

## 3. METHODOLOGY

20-iter autonomous loop using cli-devin SWE 1.6 agent with convergence threshold 0.05. Each iteration read strategy, dashboard, findings registry, and prior iteration narratives before executing focused investigation. Per-iteration prompts targeted specific research questions (Q1-Q10 from strategy). Bundle verification gate required grep-verify of internal imports and smoke-run of validation commands. Reducer-driven state management updated machine-owned sections of strategy after each iteration. Progressive focus guide prioritized Q1 (bugs/drift) first, then Q5/Q6 (content gaps), then Q2/Q4/Q10 (structural/HVR), then Q7/Q8 (catalog validation), then Q9 (task ordering), with final synthesis in iter-20.

## 4. KEY QUESTIONS

**Q1:** What specific bugs, drift, or weak prose exist in each authored doc beyond the 3 known INSTALL_GUIDE drifts? Iter-010, 011, 012, 016 identified 15 additional issues including version drift, tool count drift, database path conflicts, packet pointer drift, and weak prose in database migration descriptions.

**Q2:** What sk-doc --type does each authored doc match, and what mandatory anchors/H2 cases/TOC requirements does each per-type contract impose? Iter-019 mapped 8 primary docs to types and validated full compliance: SKILL.md (skill), README.md (readme), INSTALL_GUIDE.md (install_guide), ARCHITECTURE.md (reference), feature_catalog.md (reference), manual_testing_playbook.md (playbook), mcp_server READMEs (readme).

**Q3:** What HVR violations does each authored doc currently contain? Iter-001 documented 87 violations across core docs: ARCHITECTURE.md (34 violations, score ~45), INSTALL_GUIDE.md (21 violations, score ~60), feature_catalog.md (9 violations, score ~68), README.md (4 violations, score ~75), SKILL.md (3 violations, score ~82), ownership-boundary.md (2 violations, score ~82). Iter-015 found 4 Oxford commas in mcp_server READMEs.

**Q4:** What problem hook and section arc do the Public root README and system-spec-kit README use that the system-code-graph README should mimic structurally? Iter-017 identified the pattern: problem hook in OVERVIEW ("AI coding assistants have amnesia"), solution breakdown, statistics/comparison tables, QUICK START with concrete examples, section ordering OVERVIEW→QUICK START→FEATURES→CONFIGURATION→FAQ→RELATED.

**Q5:** What "useful" content gaps exist in SKILL.md/references/per-folder mcp_server READMEs that operators reading cold would benefit from? Iter-013 identified 8 gap categories: missing "why structural matters" primers, no glossaries of technical terms, no situational triggers, weak boundary explanations, dense prose without conceptual framing.

**Q6:** Which per-folder mcp_server READMEs require fresh authoring vs validation-only passes? Iter-013 assessed 8 of 9 READMEs: 7 require validation-only (handlers, lib, tools, tests, database, core, stress_test/code-graph), 1 requires fresh authoring (plugin_bridges has critical post-extraction drift in import paths), 1 unassessed (lib/utils/README.md).

**Q7:** Does the feature_catalog index + per-feature files validate as --type playbook? Iter-008 answered: NO. No "feature_catalog" document type exists in template_rules.json. Per-feature files have "CURRENT REALITY" and "SOURCE FILES" sections, not playbook's "SCENARIO CONTRACT" and "TEST EXECUTION". Requires manual recursion.

**Q8:** Does the manual_testing_playbook index + per-scenario files validate as --type playbook? Iter-008 answered: YES for index (validates as playbook type), YES for per-scenario files (validate as playbook_feature type via path pattern detection), but requires manual recursion because validator does not auto-validate subdirectories.

**Q9:** What's the optimal child-001 task ordering? Iter-009 recommended: SKILL.md hook first (dependency root for INSTALL_GUIDE version fix), then batch by file-type (Batch A: References HVR pass, Batch B: mcp_server README usefulness audit, Batch C: INSTALL_GUIDE drift fixes). Batching by file-type maximizes parallelism.

**Q10:** What are the 3 worst-case HVR pitfalls the root README + system-spec-kit README contain that the system-code-graph README must avoid mimicking? Iter-018 identified: (1) Semicolons in complex explanatory sentences (13 instances in system-spec-kit alone), (2) Oxford commas in lists (Public root uses in high-visibility contexts), (3) Em dashes for emphasis (both READMEs use in technical descriptions).

## 5. ANSWERED QUESTIONS

**Q1:** What specific bugs, drift, or weak prose exist in each authored doc beyond the 3 known INSTALL_GUIDE drifts?
