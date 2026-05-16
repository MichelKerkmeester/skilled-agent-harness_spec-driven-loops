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
- Topic: system-code-graph uplift: skill usefulness, marketing README rewrite (problem-first arc with HVR clean prose), and sk-doc 1:1 alignment (validate_document.py --type <type> exit-0 across every authored doc). Inputs: Public root README + system-spec-kit README as structural exemplars for the marketing voice; sk-doc readme_template.md + hvr_rules.md + template_rules.json as the validation contract; system-code-graph current authored docs (SKILL.md, README.md, ARCHITECTURE.md, INSTALL_GUIDE.md, references/*.md, mcp_server/**/README.md, feature_catalog/feature_catalog.md, manual_testing_playbook/manual_testing_playbook.md) as the targets; INSTALL_GUIDE.md lines 49/56/195 as confirmed drift. Three downstream implementation children already scaffolded as stubs at 001-skill-md-and-references-polish/, 002-readme-marketing-rewrite/, 003-sk-doc-1to1-alignment/. Research must produce a unified evidence base that informs all three children.
- Started: 2026-05-16T09:50:43Z
- Status: INITIALIZED
- Iteration: 20 of 20
- Session ID: 029-uplift-9002D7A6
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| undefined | Q1+Q3 discovery scan of authored docs for bugs/drift/HVR violations | - | 0.65 | 0 | insight |
| undefined | Q5+Q6 content gaps and mcp_server READMEs currency assessment | - | 0.70 | 0 | insight |
| undefined | Q1 bugs/drift/weak prose beyond known 3 INSTALL_GUIDE drifts | - | 0.60 | 0 | insight |
| undefined | Q2 sk-doc --type classification and mandatory requirements per authored doc | - | 0.85 | 0 | insight |
| undefined | Q4 README structural arc analysis from Public root + system-spec-kit exemplars | - | 0.75 | 0 | insight |
| undefined | Q10 worst-case HVR pitfalls in root README + system-spec-kit README to avoid | - | 0.80 | 0 | insight |
| undefined | Q1 bugs/drift/weak prose in authored docs beyond known INSTALL_GUIDE drifts | - | 0.90 | 0 | insight |
| undefined | Q7+Q8 feature_catalog and manual_testing_playbook validation as playbook types | - | 0.85 | 0 | insight |
| undefined | Q9 optimal child-001 task ordering: SKILL.md first then batch by file-type | - | 0.80 | 0 | insight |
| undefined | Q1 deep dive: 6 additional bugs/drift beyond known 3 INSTALL_GUIDE issues plus weak prose | - | 0.85 | 0 | insight |
| undefined | Q1 deep dive: 5 additional bugs/drift beyond iter-010 findings plus weak prose and cross-doc inconsistencies | - | 0.80 | 0 | insight |
| undefined | Q1 deep dive: 4 additional bugs/drift beyond iter-011 findings plus weak prose; core authored docs audit complete | - | 0.75 | 0 | insight |
| undefined | Q5/Q6 deep dive: content gaps in SKILL.md/README.md/references/per-folder READMEs + 8/9 mcp_server READMEs currency assessment (plugin_bridges requires fresh authoring) | - | 0.80 | 0 | insight |
| undefined | Q2 sk-doc --type mapping for all authored docs + mandatory requirements per type + contract violations (ARCHITECTURE.md frontmatter, INSTALL_GUIDE.md missing Section 0/Core Principle) | - | 0.85 | 0 | insight |
| undefined | Q3 gap analysis: mcp_server per-folder README HVR violations (4 Oxford commas across 2 files; 9 files clean) | - | 0.70 | 0 | partial |
| undefined | Q1 audit complete: 5 additional bugs/drift beyond known 3 INSTALL_GUIDE issues (version, tool count, database path, packet pointer, cross-doc version inconsistencies) + weak prose in database path descriptions | - | 0.75 | 0 | insight |
| undefined | Q4 README structural arc analysis: problem hook patterns, section ordering, HVR risks to avoid for child-002 rewrite | - | 0.80 | 0 | insight |
| undefined | Q10 HVR pitfalls audit: 3 worst patterns to avoid in child-002 rewrite (semicolons in complex sentences, Oxford commas in lists, em dashes for emphasis) | - | 0.85 | 0 | insight |
| undefined | Q2 sk-doc --type classification and mandatory requirements audit: 8 primary authored docs compliant with contracts; per-feature files deferred to Q7/Q8 | - | 0.80 | 0 | insight |
| undefined | Final synthesis: consolidated findings across all 10 research questions (Q1-Q10) with evidence citations; identified registry sync issues | - | 0.95 | 0 | complete |

- iterationsCompleted: 20
- keyFindings: 939
- openQuestions: 10
- resolvedQuestions: 0

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 0/10
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

<!-- /ANCHOR:questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- Last 3 ratios: 0.85 -> 0.80 -> 0.95
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.95
- coverageBySources: {}

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- None yet

<!-- /ANCHOR:dead-ends -->
<!-- ANCHOR:next-focus -->
## 7. NEXT FOCUS
Q1: What specific bugs, drift, or weak prose exist in each authored doc under `.opencode/skills/system-code-graph/` beyond the 3 known INSTALL_GUIDE drifts (`:49`, `:56`, `:195`)?

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
