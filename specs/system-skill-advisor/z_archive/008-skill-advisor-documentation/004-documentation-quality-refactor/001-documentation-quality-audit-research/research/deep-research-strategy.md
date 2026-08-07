---
title: Deep Research Strategy — skill-advisor docs quality refactor audit
description: Session strategy for the 20-iter cli-devin SWE 1.6 audit of system-skill-advisor docs surface.
---

# Deep Research Strategy — Session Tracking

## 1. OVERVIEW

20-iter audit run by cli-devin SWE 1.6. Coverage-by-design across 6 doc surfaces of `.opencode/skills/system-skill-advisor/` plus cross-cutting concerns. Convergence forced disabled (`convergenceThreshold=0.0`) so all 20 iters execute.

---

## 2. TOPIC

Make `.opencode/skills/system-skill-advisor` more useful, relevant, and bug-free, with a marketing-style README and 1:1 sk-doc template alignment across SKILL.md, README.md, ARCHITECTURE.md, INSTALL_GUIDE.md, references/*, feature_catalog/*, manual_testing_playbook/*. Surface all drift, broken refs, content gaps, HVR violations, alignment misses; rank by impact; group findings by sub-phase 002-005 mapping.

---

## 3. KEY QUESTIONS (remaining)

- [ ] Q1: Does SKILL.md fully conform to sk-doc skill_md template? Which anchors drift?
- [ ] Q2: Where does README.md fall short of peer system-code-graph/README.md marketing voice?
- [ ] Q3: What ARCHITECTURE.md statements drift from actual mcp_server/ source code?
- [ ] Q4: Do INSTALL_GUIDE.md commands actually work as documented?
- [ ] Q5: Do all 7 references/*.md files match the sk-doc skill_reference template 1:1?
- [ ] Q6: What's the root cause of the feature_catalog/05 numbering gap?
- [ ] Q7: What's the root cause of the manual_testing_playbook/09 numbering gap?
- [ ] Q8: Which HVR hard-blocker words/phrases appear across the 6 doc surfaces?
- [ ] Q9: Do all relative links and ADR paths in the package resolve?
- [ ] Q10: Are all 9 MCP tools (8 public + 1 internal) documented consistently across docs?
- [ ] Q11: Which content gaps need new reference docs (lane-weight tuning, query cookbook, etc.)?
- [ ] Q12: How should findings be impact-ranked for 002-005 mapping?

---

## 4. NON-GOALS

- Actual edits to system-skill-advisor docs (this is read-only audit)
- Embeddings symlink work (owned by 040 follow-on)
- `lib/skill-graph/` relocation (owned by packet 011)
- Tool renames or new MCP tools beyond current 9

---

## 5. STOP CONDITIONS

- All 20 iters complete (stopReason=`maxIterationsReached`) — this is the target
- `--convergence=0.0` disables convergence gate; no early stop possible by that lever
- Hard stops only on: lock conflict, lethal config error, 3+ consecutive iter failures

---

## 6. ANSWERED QUESTIONS

(None yet — populated as iters answer questions)

---

<!-- MACHINE-OWNED: START -->
## 7. WHAT WORKED

(First iter — populated after iteration 1 completes)

---

## 8. WHAT FAILED

(First iter — populated after iteration 1 completes)

---

## 9. EXHAUSTED APPROACHES (do not retry)

(Populated when an approach has been tried from multiple angles without success)

---

## 10. RULED OUT DIRECTIONS

(Populated from iteration dead-end data)

---

## 11. NEXT FOCUS

**Iter 1 angle:** SKILL.md anchor coverage + smart-router INPUTS↔ACTIONS↔OUTPUTS conformance.
**Evidence target:** `.opencode/skills/system-skill-advisor/SKILL.md` + `.opencode/skills/sk-doc/references/` skill_md template definition.

<!-- MACHINE-OWNED: END -->

---

## 12. KNOWN CONTEXT

Pre-audit findings from Phase 1 exploration (carried into iter 1):

- 3 HIGH-severity bugs: ADR-001 path missing `004-skill-graph/` segment in SKILL.md + ARCHITECTURE.md; broken hook reference link in README + INSTALL_GUIDE; wrong build-command path in ARCHITECTURE §8
- 2 numbering gaps: feature_catalog/ skips `05--*`, manual_testing_playbook/ skips `09--*`
- manual_testing_playbook PARTIAL (incomplete legacy SAD-NNN mapping, count discrepancy)
- HVR rules binding (no hard-blocker words, no em dashes/semicolons/Oxford commas)
- 8 USPs for README rewrite: standalone MCP, 5-lane scorer, Gate 2 cross-runtime, skill-graph SQLite + propagate_enhances, v0.2.0 isolation, v0.3.0 async I/O + 4-tier config, freshness model, mk_skill_advisor namespace

Peer reference for README voice ceiling: `.opencode/skills/system-code-graph/README.md` (~2000 words, 9 numbered sections, tables-heavy).

resource-map.md not present at child level; skipping coverage gate.

---

## 13. AGENT INSTRUCTIONS (per iter)

Per the 20-iter plan, each iter focuses on a specific angle (see spec.md `Implementation Phases` Phase 2 table). cli-devin SWE 1.6 dispatched per iter with read-only recipe `.opencode/skills/cli-devin/assets/agent-config-deep-research-iter.json`. Final synthesis switches to scoped-write recipe `.opencode/skills/cli-devin/assets/agent-config-synthesis.json`.
