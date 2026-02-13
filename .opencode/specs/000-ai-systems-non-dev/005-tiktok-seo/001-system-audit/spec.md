<!-- SPECKIT_LEVEL: 2 -->

# TikTok SEO & Creative Strategy System Audit

## Metadata

| Field | Value |
|-------|-------|
| Spec ID | 003-tiktok-audit |
| Title | TikTok SEO & Creative Strategy System Audit |
| Status | In Progress |
| Priority | P0 - Critical |
| Created | 2026-02-10 |
| Author | Orchestrator |
| System | 4. TikTok SEO & Creative Strategy |

---

## Problem Statement

The TikTok SEO & Creative Strategy AI agent system contains cross-document inconsistencies, missing integrations with Global shared files, contradictory scoring definitions, and misaligned document loading instructions that undermine system reliability and content quality.

### Why This Matters

This system creates publication-ready thought leadership content, trend digests, and SEO guides for Barter. Bugs in scoring (35 vs 37 points), missing canonical data sources, and contradictory loading conditions mean the AI agent may:
- Score content against the wrong maximum (35 instead of 37), inflating quality perception
- Miss loading critical documents (base Human Voice Rules, base Brand Context) leading to off-brand output
- Use stale or conflicting statistics (Gen Z search: "40-74%" vs "64%") in published content
- Violate its own Human Voice Rules by learning from em-dash examples in the system prompt
- Reference incorrect brand voice values ("Simple, Scalable, Effective" vs the real "Simple, Empowering, Real")

---

## Scope

### In Scope

| Area | Description |
|------|-------------|
| AGENTS.md | Master orchestration file for the TikTok system |
| System Prompt v0.121 | Core routing, commands, scoring, export naming |
| DEPTH Framework v0.111 | DEPTH methodology, cognitive rigor, SCOPE validation |
| Interactive Mode v0.110 | Conversation flows, state management, response patterns |
| Context files (7) | Audience, Brand Extensions, Frameworks, Language, Platform, Research, Strategy |
| Rules files (1+1 symlink) | Human Voice Extensions + symlinked base Human Voice Rules |
| Global shared files (5) | Brand, Canonical Stats Registry, Industry, Market, Human Voice Rules |
| Symlink integrity | 2 symlinks: Brand → Global, Human Voice → Global |
| Cross-document consistency | Statistics, scoring, loading conditions, terminology |

### Out of Scope

| Area | Reason |
|------|--------|
| Export folder content quality | Content already published; separate review needed |
| Context/memory folder structure | Empty scaffolding, no content to audit |
| Other Barter AI systems | Separate audits (001 completed for Copywriter) |
| Actual AI model behaviour | Auditing instructions/docs, not live model output |

### Files to Change

| # | File | Change Type | Description |
|---|------|-------------|-------------|
| 1 | `AGENTS.md` | Modify | Fix brand voice values, add base document loading, fix processing hierarchy |
| 2 | `knowledge base/system/TikTok - System - Prompt - v0.121.md` | Modify | Fix 35→37 scoring refs, remove em dash from example, align loading conditions |
| 3 | `knowledge base/system/TikTok - Thinking - DEPTH Framework - v0.111.md` | Modify | Fix Gen Z stat, remove hardcoded stats, add $quick exception to perspective rules |
| 4 | `knowledge base/system/TikTok - System - Interactive Mode - v0.110.md` | Modify | Fix loading condition header from TRIGGER to ALWAYS |
| 5 | `knowledge base/context/TikTok - Context - Brand Extensions - v0.100.md` | Review | Check for stale v0.100 references |
| 6 | `knowledge base/rules/TikTok - Rules - Human Voice Extensions - v0.100.md` | Review | Check for stale v0.100 references |
| 7 | `knowledge base/context/` (new symlink) | Create | Symlink to Global Canonical Stats Registry |

---

## Requirements

### P0 — Blockers (Must Fix)

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| R-01 | CONTENT scoring must consistently use 37-point scale | All references to "/35" replaced with "/37"; Originality dimension shows /7 not /5; artifact header template says Z/37 |
| R-02 | Interactive Mode loading condition must match actual usage | File header updated from "TRIGGER" to "ALWAYS" |
| R-03 | AGENTS.md Step 1 must include base Human Voice Rules | Base rules file added to mandatory Step 1 reading list |
| R-04 | AGENTS.md Step 1 must include base Brand Context | Base Brand file (symlink) added to mandatory Step 1 reading list |
| R-05 | Canonical Stats Registry must be accessible to TikTok system | Symlink created; local stat duplicates reference registry as source of truth |

### P1 — Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| R-06 | Brand voice values in AGENTS.md must match Global Brand | "Simple, Scalable, Effective" → "Simple, Empowering, Real" |
| R-07 | Em dash removed from System Prompt voice example | Example rewritten without em dash |
| R-08 | Gen Z search statistic aligned across all docs | DEPTH Framework "40-74%" replaced with "64% (Adobe Survey, 2024)" |
| R-09 | Processing hierarchy validation order corrected | Validation moved before Response in AGENTS.md hierarchy |
| R-10 | $quick perspective exception explicitly noted in DEPTH Framework | DEPTH Framework perspective blocking rule includes $quick exception note |

---

## Success Criteria

| ID | Criterion | Evidence |
|----|-----------|----------|
| SC-01 | Zero CRITICAL cross-document contradictions | Audit re-check shows 0 CRITICAL findings |
| SC-02 | All "ALWAYS" documents loadable from AGENTS.md | Step 1 reading list matches System Prompt Section 4 ALWAYS list |
| SC-03 | CONTENT scoring references consistent across all files | Grep for "/35" returns 0 results in TikTok system files |
| SC-04 | Statistics traceable to Canonical Stats Registry | All stats in System Prompt cite registry or have explicit override justification |

---

## Risks & Dependencies

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Fixing loading conditions increases token consumption | High | Medium | Document estimated token budget; prioritize which ALWAYS docs are truly needed |
| Symlink to registry may break if Global folder moves | Low | High | Document symlink targets; add to maintenance checklist |
| Version bump cascade required | Medium | Medium | Plan coordinated version bump across affected files |
| Breaking existing export naming convention | Low | Low | Grandfather existing files; enforce new convention going forward |

---

## Complexity Assessment

| Dimension | Score (1-10) | Notes |
|-----------|:---:|-------|
| Files affected | 7 | 7+ files need changes |
| Cross-references | 8 | Heavy interdependency between documents |
| Risk of regression | 6 | Changes to scoring/loading could affect content quality |
| Testing difficulty | 5 | Manual verification of cross-document consistency |
| Domain knowledge | 7 | Requires understanding of multi-doc AI system architecture |
| **Total** | **33/50** | Medium-High complexity |

---

## Open Questions

| # | Question | Impact | Status |
|---|----------|--------|--------|
| 1 | Should the Canonical Stats Registry be symlinked or should stats in System Prompt reference it inline? | Architecture decision affects all stat references | Open |
| 2 | Should token budget be documented for the 5 ALWAYS-load documents? | Affects feasibility of loading all required docs | Open |
| 3 | Should Context - Brand Extensions be bumped to v0.110 to match base? | Version alignment | Open |
| 4 | Should export naming use command names ($blog) or framework names (INSIGHT) consistently? | Convention standardisation | Open |
