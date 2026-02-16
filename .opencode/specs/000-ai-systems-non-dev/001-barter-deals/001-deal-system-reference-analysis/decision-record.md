# Decision Record: Deal System Reference Analysis Implementation

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Campaign Goal as Primary Input Parameter

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-15 |
| **Deciders** | Product Owner, Sales Operations Lead |

---

<!-- ANCHOR:adr-001-context -->
### Context

Analysis of Floris' ChatGPT Knowledge revealed that campaign goal (awareness/sales/reviews/UGC) fundamentally changes deal template output, yet the current system does not capture this information. Sales teams determine goal before creating deals but have no way to communicate this to the system. This results in generic templates that do not optimize for the actual campaign objective.

### Constraints

- Must maintain backward compatibility with existing deal creation workflows
- Cannot require Sales team to answer 10 questions instead of 9 (input friction)
- Must clearly document how each goal type affects template generation
- Default behavior needed for users who skip goal selection

<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**Summary**: Add campaign goal as Question 0 (before the existing 9-question deal brief) with 4 options: awareness, sales, reviews, UGC. Make it optional with default to "awareness" for backward compatibility.

**Details**: Create new Campaign Goal Input section in System Prompt Section 0. Document template impact per goal type: awareness emphasizes reach and shareability, sales includes discount codes and CTAs, reviews specifies review platform and longer deadline, UGC includes higher usage rights compensation and content ownership clauses. Goal parameter informs content direction defaults, compensation recommendations, and success metrics across all deal types.

<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Add as Question 0 (optional with default)** | Clear, explicit, affects all template generation, backward compatible | One more input step | 9/10 |
| Infer goal from deal brief text | No extra input step | Too unreliable, users often omit goal information, inference errors likely | 3/10 |
| Add goal as Question 10 (after brief) | No workflow disruption | Too late to influence template generation logic, requires regeneration | 4/10 |
| Add as metadata field (Sales team sets once) | No per-deal input needed | Inflexible, many partners have multiple campaign goals across deals | 5/10 |

**Why Chosen**: Question 0 approach provides explicit goal capture at the right moment (before template generation) while maintaining backward compatibility through optional field with sensible default. Clear user intent beats unreliable inference.

<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**Positive**:
- Template output correctly tailored to campaign objective (awareness gets broader reach focus, sales gets conversion tracking)
- Compensation recommendations align with goal (UGC gets EUR 50-100 higher for ad rights)
- Content direction matches partner expectations (reviews get platform-specific guidance)
- Sales team can optimize deals for actual business goals, not generic templates

**Negative**:
- Adds one more input step for users - Mitigation: Make optional with "awareness" default, document that skipping is acceptable
- Requires documentation of 4 goal types and their template impacts - Mitigation: Create clear table in Campaign Goal Input section showing awareness/sales/reviews/UGC differences

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Users confused by 4 goal options | Medium | Add clear descriptions: "More brand visibility" (awareness), "Drive purchases" (sales), "Collect testimonials" (reviews), "Get ad content" (UGC) |
| Default "awareness" incorrect for sales-focused partners | Low | Sales team can override default, most deals are awareness-focused per Floris analysis |
| Template changes too subtle per goal | Low | Document explicit differences: discount codes only for sales, usage rights only for UGC, etc. |

<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Floris explicitly states "Voordat je iets invult, bepaal je: Wat is je doel?" - goal determines all downstream template decisions |
| 2 | **Beyond Local Maxima?** | PASS | Considered inference (unreliable), post-brief addition (too late), metadata field (inflexible) before choosing Question 0 |
| 3 | **Sufficient?** | PASS | Single optional parameter with 4 clear options is simplest approach that solves the problem |
| 4 | **Fits Goal?** | PASS | Directly addresses core problem: templates not optimized for campaign objective |
| 5 | **Open Horizons?** | PASS | Foundation for future enhancements: goal-based analytics, success metrics per goal type, goal-specific quality gates |

**Checks Summary**: 5/5 PASS

<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**Affected Systems**:
- System Prompt - Section 0 (Input Parameters): Add Campaign Goal Input section
- All Deal Type Templates: Add goal-conditional content direction defaults
- Compensation Logic: Add goal-based compensation adjustments (UGC +EUR 50-100)
- Content Direction Inference: Add goal-based hashtag strategy, CTA guidance

**Rollback**: Remove Campaign Goal Input section, revert all templates to goal-agnostic defaults, system returns to v0.201 behavior.

<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Multi-Language as Routing Framework vs Translation Layer

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-15 |
| **Deciders** | Product Owner, Technical Lead, Sales Sam |

---

<!-- ANCHOR:adr-002-context -->
### Context

Barter operates in 4 countries (Netherlands, Belgium, UK, Germany) with 35,000+ creators speaking Dutch, German, and English. The current system is hardcoded to UK English for all deals, forcing Sales team to manually translate or create non-English deals outside the system. Reference materials from Sales Sam show explicit German terminology ("Tauschgeschäft", "Kategorien") and Dutch phrases that cannot be directly translated without losing cultural nuance and platform-appropriate phrasing.

### Constraints

- Must not break existing English deal creation workflows
- Cannot introduce translation errors or culturally inappropriate phrasing
- Sales team must be able to review and validate each language variant
- HVR (Human Voice Rules) validation assumes English punctuation and sentence structure
- No runtime translation API available in ChatGPT project environment

<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**Summary**: Implement language routing framework with brand country detection. Create parallel template variants (Dutch, German, English) as separate knowledge base sections rather than runtime translation layer.

**Details**: Add Multi-Language Support Framework section to System Prompt documenting brand country to language mapping (NL/BE brands → Dutch template, DE brands → German template, UK/international → English template). Create parallel template variant structure for each deal type in each language. Document German terminology glossary. Note that multi-language HVR rules (separate validation per language for punctuation norms) is Phase 2 work and deferred.

<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Parallel template variants with routing** | Clean separation, no translation errors, culturally appropriate, Sales can review | 3x template maintenance overhead | 8/10 |
| Runtime translation via API | Single template to maintain, automatic coverage | Translation errors likely, loses cultural nuance, API not available in ChatGPT project | 2/10 |
| English-only with manual translation | No implementation needed | Current state, creates inconsistency, Sales team friction | 1/10 |
| AI-generated translation per deal | No pre-translation needed | Unreliable, culturally inappropriate phrases, no quality control | 3/10 |

**Why Chosen**: Parallel template variants provide highest quality output with cultural appropriateness. 3x maintenance overhead is acceptable given only 3 languages and core templates only. Sales team validation is critical for brand voice, which runtime translation cannot guarantee.

<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**Positive**:
- Clean language separation, no translation errors
- Culturally appropriate phrasing (Dutch directness vs English politeness)
- Sales team can review and validate each template variant before use
- Platform-appropriate terminology (German "Tauschgeschäft" for barter, Dutch "Categorieën" for categories)
- Foundation for future language expansion (French, Spanish, etc.)

**Negative**:
- 3x template maintenance overhead (Product, Service, Gift Card, Subscription, Hybrid × 3 languages = 15 templates) - Mitigation: Start with core templates only (Product, Service, Hybrid), expand Gift Card and Subscription as Phase 2
- HVR rules need per-language validation logic (Dutch/German punctuation differs from English) - Mitigation: Document as Phase 2 work, implement template variants first without language-specific HVR
- Brand country detection may be ambiguous (international brand targeting NL market) - Mitigation: Add language preference override parameter

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| 3x maintenance becomes unsustainable | Medium | Start with 3 core templates × 3 languages = 9 variants only, expand based on usage |
| HVR English-centric rules produce false violations in Dutch/German | High | Defer HVR per-language rules to Phase 2, accept lower validation for non-English initially |
| Brand country detection fails for edge cases | Low | Add explicit language preference parameter in deal brief, default to brand country mapping |
| Translation quality for specialized terms | Medium | Create German terminology glossary, Dutch terminology glossary with Sales team review |

<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | 4-country operation with 3 languages, Sales Sam explicitly documents German terminology, current English-only creates friction |
| 2 | **Beyond Local Maxima?** | PASS | Considered runtime translation (unreliable), AI translation per deal (no quality control), English-only (status quo) |
| 3 | **Sufficient?** | PASS | Parallel variants with routing is simplest quality-controlled approach |
| 4 | **Fits Goal?** | PASS | Directly addresses Sales team friction with non-English deals |
| 5 | **Open Horizons?** | PASS | Extensible to French, Spanish, Italian; foundation for per-language HVR rules and analytics |

**Checks Summary**: 5/5 PASS

<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**Affected Systems**:
- System Prompt - New Section: Multi-Language Support Framework with brand country mapping
- Deal Type Templates: Create NL, DE variants for Product, Service, Hybrid (9 templates total)
- Smart Routing Logic: Add language detection step before deal type routing
- Terminology Documentation: Create German glossary, Dutch glossary

**Rollback**: Remove Multi-Language Support Framework section, delete NL/DE template variants, revert to English-only routing.

<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Deal Attractiveness Self-Check as Separate Quality Gate

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-15 |
| **Deciders** | Product Owner, Sales Operations Lead |

---

<!-- ANCHOR:adr-003-context -->
### Context

The existing DEAL 25-point scoring framework validates template quality (Appeal, Depth, Execution, Alignment, Language) but does not catch practical operational issues that prevent deals from performing well. Analysis of reference materials reveals 7 common problems the DEAL score misses: missing story deliverable (standard across all Sales team deals), wrong title length (80 chars vs 50 platform limit), follower-to-value mismatch (3000+ followers required for EUR 50 value), generic hashtags (#love, #instagood), and campaign goal misalignment with content requirements.

### Constraints

- Cannot modify DEAL 25-point scoring (existing calibration would break)
- Must not create alert fatigue (too many warnings reduces user attention)
- Should run automatically alongside DEAL scoring during Test phase
- Warnings should be actionable, not vague quality complaints
- Must clearly distinguish from DEAL scoring (different purpose: practical operations vs template quality)

<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**Summary**: Create separate pre-export quality gate called Deal Attractiveness Self-Check with 7 practical criteria. Run alongside DEAL scoring during Test phase, surface as warnings not blockers.

**Details**: Add new Deal Attractiveness Self-Check section to System Prompt documenting 7 criteria: (1) Value is EUR 50+ or justified if lower, (2) Deliverables are concrete and specific (no vague "creative content"), (3) Follower requirements match value offered (1500+ for EUR 50-75, 3000+ for EUR 100+), (4) Campaign goal matches content requirements (awareness goal does not demand 5 story posts), (5) Hashtags are niche-specific 5-10 (no generic #love #instagood), (6) Story deliverable is included, (7) Title is under 50 characters. Auto-run with DEAL scoring, output warnings with actionable fixes.

<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Separate pre-export quality gate (7 criteria, warnings only)** | Catches practical issues DEAL misses, no alert fatigue, actionable | Another validation step | 9/10 |
| Expand DEAL scoring to 32 points | Single unified score | Breaks existing calibration, mixes template quality with operational checks | 4/10 |
| Manual checklist only | No implementation needed | Relies on Sales team memory, inconsistent application | 2/10 |
| Post-publish diagnostic only | No pre-export friction | Too late, deal already published with issues | 3/10 |

**Why Chosen**: Separate quality gate with limited criteria (7 only) catches high-impact operational issues without alert fatigue. Warnings are actionable (specific fixes) unlike DEAL score (general quality assessment). Auto-run with DEAL scoring requires no extra user action.

<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**Positive**:
- Catches operational issues DEAL 25-point scoring misses (missing story deliverable, wrong title length)
- Surfaces actionable warnings before publish (increase value to EUR 50, reduce follower requirement to 1500)
- Prevents weak deals from going live (follower-to-value mismatch, generic hashtags)
- Complements DEAL scoring (template quality + practical operations = comprehensive validation)

**Negative**:
- Risk of alert fatigue if too many warnings fire - Mitigation: Limit to 7 high-impact criteria only, not exhaustive checklist
- Another validation step adds complexity - Mitigation: Auto-run with DEAL scoring during Test phase, no extra user action required
- May conflict with DEAL scoring (DEAL passes but Attractiveness Check warns) - Mitigation: Clearly document different purposes, warnings not blockers

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Alert fatigue from too many warnings | Medium | Strict limit to 7 criteria, each must be high-impact and actionable |
| Users ignore warnings and publish anyway | Low | Make warnings highly visible, provide specific fixes not vague complaints |
| Criteria become outdated as operations evolve | Medium | Document criteria source (research.md recommendations), review quarterly |
| Conflicts with DEAL scoring create confusion | Low | Clear documentation: DEAL = template quality, Attractiveness = practical operations |

<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | DEAL scoring misses 7 operational issues documented in research.md (story deliverable, title length, follower-to-value, etc.) |
| 2 | **Beyond Local Maxima?** | PASS | Considered expanding DEAL (breaks calibration), manual checklist (inconsistent), post-publish diagnostic (too late) |
| 3 | **Sufficient?** | PASS | 7 criteria is simplest high-impact set, more would create alert fatigue |
| 4 | **Fits Goal?** | PASS | Directly addresses practical issues preventing deal performance |
| 5 | **Open Horizons?** | PASS | Foundation for automated deal optimization, pre-publish quality analytics, criteria evolution based on performance data |

**Checks Summary**: 5/5 PASS

<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**Affected Systems**:
- System Prompt - New Section: Deal Attractiveness Self-Check with 7 criteria documentation
- Test Phase Workflow: Add Attractiveness Check auto-run alongside DEAL scoring
- Output Format: Add Attractiveness warnings section after DEAL score display

**Rollback**: Remove Deal Attractiveness Self-Check section, revert Test phase to DEAL scoring only.

<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!--
3 ADRs documenting major architectural decisions
ADR-001: Campaign goal as primary input (Question 0 approach)
ADR-002: Multi-language as routing framework (parallel templates not translation)
ADR-003: Deal Attractiveness Self-Check (separate quality gate, 7 criteria)
All marked as Accepted, all passed Five Checks evaluation
-->
