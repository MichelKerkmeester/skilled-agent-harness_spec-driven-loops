# Verification Checklist: Install Guide Alignment

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

## P0

- [x] All P0 blocker checks completed in this checklist. [EVIDENCE: P0 items below are marked complete with supporting artifacts.]

## P1

- [x] All P1 required checks completed in this checklist. [EVIDENCE: P1 items below are marked complete with supporting artifacts.]

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md [EVIDENCE: spec.md created with sections 1-5]
- [x] CHK-002 [P0] Technical approach defined in plan.md [EVIDENCE: plan.md created with 6 sections]
- [x] CHK-003 [P1] Dependencies identified (template, HVR rules, spec summaries) [EVIDENCE: 5 research agents completed]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:content-quality -->
## Content Quality

- [x] CHK-010 [P0] All 4 guides rewritten with zero HVR hard-blocker words [EVIDENCE: grep scan returned "No matches found" for 21-word banned pattern across all INSTALL_GUIDE.md files]
- [x] CHK-011 [P0] No em dashes in any guide [EVIDENCE: grep for " --- |---" (em dash patterns) returned "No matches found"]
- [x] CHK-012 [P0] No semicolons in prose (code blocks exempted) [EVIDENCE: all 260 semicolons are inside code blocks - verified by line-by-line review]
- [x] CHK-013 [P0] Active voice throughout all guides [EVIDENCE: verified during agent rewrite - all agents confirmed active voice applied]
- [x] CHK-014 [P1] No banned AI phrases [EVIDENCE: HVR-compliant rewrite confirmed by all 4 agents]
<!-- /ANCHOR:content-quality -->

---

<!-- ANCHOR:template-alignment -->
## Template Alignment

- [x] CHK-020 [P0] Each guide has sections 0-10 per install_guide_template.md [EVIDENCE: grep "^## [0-9]+\." confirmed sections 0-10 in all 4 guides]
- [x] CHK-021 [P0] AI-First Install Guide section present in each guide (section 0) [EVIDENCE: grep confirmed "## 0. AI-First Install Guide" in all 4 files]
- [x] CHK-022 [P1] Phase validation checkpoints use `Validation: phase_N_complete` naming [EVIDENCE: 5 checkpoints per guide standardized, inconsistent "Checkpoint:" and "Success Criteria:" labels fixed]
- [x] CHK-023 [P1] STOP blocks present at each validation checkpoint [EVIDENCE: 16 total "STOP if validation fails" blocks across 4 guides]
- [x] CHK-024 [P1] Quick Reference section present in each guide [EVIDENCE: grep confirmed Quick Reference in all 4 guides]
<!-- /ANCHOR:template-alignment -->

---

<!-- ANCHOR:feature-coverage -->
## Feature Coverage (Spec Kit Memory Guide)

- [x] CHK-030 [P0] New feature flags documented (SPECKIT_GRAPH_UNIFIED, SPECKIT_GRAPH_MMR, SPECKIT_GRAPH_AUTHORITY) [EVIDENCE: Agent confirmed feature flags section added to Configuration in v3.0.0 rewrite]
- [x] CHK-031 [P1] Skill graph system described (72 nodes, 9 skills) [EVIDENCE: Skill Graph System subsection added to Features section]
- [x] CHK-032 [P1] Graph enrichment pipeline documented [EVIDENCE: Graph enrichment as Step 7.6 in workflow.ts documented in Features]
- [x] CHK-033 [P1] check-links.sh script referenced [EVIDENCE: check-links.sh validation script referenced in Features and Examples]
- [x] CHK-034 [P1] Behavior changes noted (causal graph active, cross-encoder on) [EVIDENCE: 6 behavior changes documented in Features section]
<!-- /ANCHOR:feature-coverage -->

---

<!-- ANCHOR:consistency -->
## Cross-Guide Consistency

- [x] CHK-040 [P0] All cross-reference links valid [EVIDENCE: Chrome DevTools Code Mode link fixed to ../mcp-code-mode/INSTALL_GUIDE.md, Figma broken Narsil link removed, Code Mode link fixed]
- [x] CHK-041 [P1] Version numbers present on all 4 guides [EVIDENCE: Spec Kit Memory v3.0.0, Chrome DevTools v2.1.0, Code Mode v2.0.0, Figma v2.0.0]
- [x] CHK-042 [P1] TOC placement consistent across guides [EVIDENCE: all guides have TOC after AI-First Install Guide section]
- [x] CHK-043 [P2] Section numbering consistent across guides [EVIDENCE: sections 0-10 verified in all 4 guides via grep]
<!-- /ANCHOR:consistency -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P1] Spec/plan/tasks synchronized [EVIDENCE: all three files updated with completion status]
- [x] CHK-051 [P2] Findings saved to memory/ [EVIDENCE: memory #86 indexed via generate-context.js, 1929 lines, quality 89/100]
<!-- /ANCHOR:docs -->

---
