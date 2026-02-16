# Decision Record: Partner Email System

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record + level3plus-govern | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Platform Choice - ChatGPT Custom GPT

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-15 |
| **Deciders** | Sales Team Lead, System Architect |

---

<!-- ANCHOR:adr-001-context -->
### Context

The sales team (Floris, Sam) needs a partner email system to handle platform inquiries and demo requests. The team already uses ChatGPT daily, with two existing GPTs (Floris, Sam) that demonstrate adoption. The challenge is selecting a platform that minimizes friction while delivering quality output.

### Constraints
- No dedicated dev resources for custom build
- Sales team already familiar with ChatGPT, not Claude
- Need immediate deployment (within 1 week)
- Must integrate with existing knowledge base architecture
- Zero budget for third-party email automation tools
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**Summary**: Use ChatGPT Custom GPT as the platform for the partner email system.

**Details**: Deploy a single Custom GPT accessible to the sales team through their existing ChatGPT accounts. The GPT will use the full KB architecture (system/, context/, rules/, voice/) with AGENTS.md as the routing entry point. No custom application development required.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **ChatGPT Custom GPT** | Team already uses it daily, zero migration friction, two GPTs exist proving adoption, immediate deployment | Instruction-following quality slightly below Claude, token limits per request | 9/10 |
| Claude Projects | Superior instruction-following, better long-form generation, more reliable adherence to rules | Team unfamiliar with platform, requires onboarding, different pricing model | 7/10 |
| Custom Web Application | Full control over UX/logic, unlimited customization, can integrate directly with email tools | Requires significant dev investment (8-12 weeks), ongoing maintenance burden, delays deployment | 5/10 |
| Microsoft Copilot | Enterprise integration, familiar Microsoft ecosystem | Limited customization, poor KB architecture support, weaker generative quality | 4/10 |

**Why Chosen**: ChatGPT scores highest due to zero adoption friction. The team already has muscle memory with the platform, and two existing GPTs demonstrate successful usage patterns. The slight quality gap vs Claude is acceptable given the time-to-value advantage.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**Positive**:
- Immediate deployment (no onboarding needed)
- Leverages existing team workflows
- Proven adoption path (Floris/Sam GPTs exist)
- Low maintenance burden

**Negative**:
- Instruction-following quality ~15% below Claude - Mitigation: Use explicit routing (AGENTS.md), strict templates, HVR hard blockers
- Per-session token limits may truncate long KB contexts - Mitigation: Modular KB design with lazy loading via AGENTS.md routing

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| ChatGPT instruction drift with complex routing | Medium | Use explicit step-by-step instructions in AGENTS.md, test routing with real partner emails |
| Token limit hit on large KB loads | Low | Lazy load KB sections via routing, keep system/ prompts under 2K tokens |
| OpenAI model changes breaking custom instructions | Medium | Version all KB files, document OpenAI model version in metadata, test quarterly |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Sales team receives 15-20 partner emails per week, currently spending 30-45 min per reply. System pays for itself in week 1. |
| 2 | **Beyond Local Maxima?** | PASS | Evaluated 4 platforms (ChatGPT, Claude, Custom, Copilot) across adoption, quality, cost, time-to-deploy dimensions. |
| 3 | **Sufficient?** | PASS | Custom GPT is simplest path. No dev work, no servers, no maintenance. Avoids overbuilding. |
| 4 | **Fits Goal?** | PASS | Goal is "reduce email reply time by 60%". Platform choice directly enables this via daily-driver integration. |
| 5 | **Open Horizons?** | PASS | ChatGPT supports future expansions (multilingual, automated follow-ups, integrations via Zapier). Not a dead-end choice. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**Affected Systems**:
- New: Partner Email System Custom GPT (ChatGPT)
- Reference: Copywriter GPT (reuse KB architecture patterns)
- Shared: Global Brand KB, Global HVR rules

**Rollback**: If ChatGPT proves inadequate, migrate to Claude Projects by copying KB files verbatim (same architecture). Estimated migration time: 2 hours.

---

### Governance

**Decision Authority**: System Architect (Michel Kerkmeester) — platform selection falls under technical architecture scope.

**Review Requirements**:
- Sales Ops Team: Consulted (validated adoption feasibility)
- Sales Team Lead: Informed (no veto, advisory role on platform choice)

**Governance Notes**:
- Platform choice reviewed quarterly against ChatGPT Custom GPT capabilities and limitations
- Migration trigger: If ChatGPT instruction-following quality drops below acceptable threshold (measured by quality scores <6 on 3+ consecutive emails), initiate Claude Projects migration per rollback plan
- Budget impact: Zero (uses existing ChatGPT Plus subscriptions)
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Unified System with Voice Profiles vs Separate GPTs

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-15 |
| **Deciders** | System Architect, Sales Team Lead |

---

<!-- ANCHOR:adr-002-context -->
### Context

Two sales team members (Floris, Sam) currently use separate Custom GPTs. This creates duplicate knowledge base maintenance: platform info, pricing, processes must be updated in two places. A unified system with voice profile switching could eliminate duplication while preserving individual tone preferences.

### Constraints
- Must preserve Floris' factual/technical tone and Sam's persuasive/warm tone
- Cannot increase cognitive load (switching profiles must be simple)
- KB updates must propagate to both voices instantly
- Reference architecture (Copywriter) already uses tone modifiers ($natural, $simple)
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**Summary**: Create ONE unified Custom GPT with voice profile switching instead of maintaining separate Floris and Sam GPTs.

**Details**: Implement voice/ folder with floris.md and sam.md tone profiles. Users activate profiles via simple commands ("/floris" or "/sam"). All platform/pricing/process knowledge lives in shared context/ and rules/ folders, eliminating duplicate maintenance.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Unified GPT with voice profiles** | Single KB maintenance point, instant updates to both voices, consistent platform knowledge, proven pattern (Copywriter) | Requires 1-line profile activation command | 9/10 |
| Keep 2 separate GPTs | Simpler user experience (no profile switching), familiar to team | Duplicate KB maintenance nightmare, version drift risk, update overhead 2x | 5/10 |
| Create 3+ GPTs by topic | Granular control (pricing GPT, demo GPT, tech GPT) | Unsustainable maintenance (3x+ update overhead), unclear which GPT to use when | 3/10 |
| One GPT per language | Supports multilingual replies | Misses the point (language is orthogonal to tone), creates 4+ GPTs (EN/NL/DE/FR) | 4/10 |

**Why Chosen**: Unified system scores highest due to maintenance efficiency. The Copywriter reference architecture already proves this pattern works ($natural, $simple modifiers). The 1-line activation command ("/floris") is negligible friction compared to maintaining duplicate KBs.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**Positive**:
- Single source of truth for platform/pricing knowledge
- KB updates propagate instantly to both voices
- 50% reduction in maintenance overhead
- Consistent factual accuracy (no version drift)

**Negative**:
- Users must type "/floris" or "/sam" once per session - Mitigation: Add default voice selection in custom instructions, sticky session memory
- Risk of voice profiles not being distinct enough - Mitigation: Test with 10 real partner emails, tune profiles based on team feedback

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Users forget to activate profile, get generic tone | Low | Set default voice in system prompt, add reminder in AGENTS.md welcome message |
| Voice profiles blend together over time (instruction drift) | Medium | Include explicit tone examples in voice/*.md, quarterly review of output quality |
| Profile switching adds cognitive load | Low | Test with sales team, simplify to single-word commands, add aliases (@floris, @sam) |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Current 2-GPT setup causes version drift (Floris GPT has outdated pricing, Sam GPT has correct). Unified system solves real pain. |
| 2 | **Beyond Local Maxima?** | PASS | Evaluated 4 options (unified, separate, by-topic, by-language). Copywriter architecture provides proven alternative to explore. |
| 3 | **Sufficient?** | PASS | Voice profiles via simple .md files is simplest solution. No complex logic, no external tools. |
| 4 | **Fits Goal?** | PASS | Goal includes "maintainable system". Unified KB directly reduces maintenance burden by 50%. |
| 5 | **Open Horizons?** | PASS | Unified system supports adding future voices (new sales hires) without exponential KB growth. Scales linearly. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**Affected Systems**:
- New: voice/floris.md, voice/sam.md tone profiles
- Modified: AGENTS.md (add voice activation routing)
- Deprecated: Existing Floris GPT, Sam GPT (archive after migration)

**Rollback**: If unified system fails, revert to 2 separate GPTs by forking current GPT twice. Estimated rollback time: 30 minutes.

---

### Governance

**Decision Authority**: System Architect (Michel Kerkmeester) — system architecture decision, with Sales Ops advisory input.

**Review Requirements**:
- Floris: Approved (validated voice profile switching is acceptable workflow)
- Sam: Approved (validated unified system meets English communication needs)
- Sales Team Lead: Informed

**Governance Notes**:
- Unified system adoption reviewed after 30 days of use (compare output quality between unified and legacy separate GPTs)
- If voice profile confusion rate exceeds 10% of outputs (wrong voice applied), trigger review of profile activation UX
- Legacy Floris/Sam GPTs archived but not deleted for 90 days (rollback safety net)
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Full Architecture Mirror from Existing Systems

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-15 |
| **Deciders** | System Architect |

---

<!-- ANCHOR:adr-003-context -->
### Context

The ecosystem already has established Custom GPT systems (Copywriter, Pieter, Nigel) using a proven KB architecture: system/, context/, rules/, voice/ folders with AGENTS.md as the entry point. The partner email system can either mirror this architecture or create a simplified custom structure optimized for email-specific workflows.

### Constraints
- Must integrate with Global shared resources (Brand, HVR)
- System architect familiarity with existing architecture patterns
- Need versioned naming convention for future updates
- Must support lazy loading (KB sections loaded on-demand via routing)
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**Summary**: Mirror the full KB architecture from Copywriter/Pieter/Nigel systems with system/, context/, rules/, voice/ folders, AGENTS.md entry point, and versioned naming convention.

**Details**: Use the standard folder structure with AGENTS.md providing step-by-step routing to specialized sections. Apply versioned naming (e.g., platform-knowledge_v1-0.md) for trackable updates. Reuse Global shared resources via symbolic links or direct references.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Full architecture mirror** | Ecosystem consistency, proven patterns, reusable Global resources, maintainable versioning, familiar to architect | Slightly more files than minimal approach | 8/10 |
| Simplified flat structure | Faster to build (all rules in one file), easier for newcomers to understand | Loses ecosystem benefits, no lazy loading, harder to version, no Global resource reuse | 5/10 |
| Custom email-specific structure | Optimized for email workflows (e.g., inbox/, drafts/, sent/ folders) | Inconsistent with ecosystem, architect unfamiliarity, reinvents wheel | 6/10 |
| Minimal system | Just templates and HVR, no routing | Fastest to build, lowest complexity | Loses quality control, no voice profiles, no process documentation | 3/10 |

**Why Chosen**: Full mirror scores highest due to ecosystem consistency. The Copywriter/Pieter/Nigel systems already prove this architecture works. Reusing Global resources (Brand, HVR) eliminates duplicate maintenance. Versioned naming enables safe iterative improvements.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**Positive**:
- Consistent with existing ecosystem (easier onboarding)
- Reuses Global Brand and HVR files (no duplication)
- Proven lazy loading pattern (AGENTS.md routing)
- Versioned files enable safe updates without breaking changes

**Negative**:
- More files than minimal approach (~12 files vs ~3) - Mitigation: AGENTS.md provides clear navigation, folder structure is self-documenting
- Requires understanding existing architecture - Mitigation: System architect already familiar, documentation exists in reference systems

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Architecture complexity overwhelms sales team users | Low | Sales team only interacts with AGENTS.md entry point, complexity is hidden behind routing |
| Global resource changes break email system | Medium | Use versioned references to Global files (e.g., Brand_v2-1.md), test before updating |
| Over-engineering for simple email task | Low | Architecture pays dividends when expanding (multilingual, follow-ups, demo scheduling) |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Need structured KB to handle 15-20 partner emails/week reliably. Flat structure would cause rule conflicts. |
| 2 | **Beyond Local Maxima?** | PASS | Evaluated 4 architectures (full, flat, custom, minimal). Reference systems provide proven alternatives. |
| 3 | **Sufficient?** | PASS | Reusing existing architecture is simpler than inventing new patterns. Avoids reinventing wheel. |
| 4 | **Fits Goal?** | PASS | Goal includes "integrate with ecosystem". Full mirror enables Global resource reuse, future expansions. |
| 5 | **Open Horizons?** | PASS | Architecture supports future needs (multilingual, automated follow-ups, CRM integration) without refactoring. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**Affected Systems**:
- New: Partner Email System KB (system/, context/, rules/, voice/, AGENTS.md)
- Shared: Global Brand KB, Global HVR rules
- Reference: Copywriter/Pieter/Nigel architectures (pattern source)

**Rollback**: If architecture proves too complex, simplify to flat structure by merging context/*.md and rules/*.md into single files. Estimated rollback time: 1 hour.

---

### Governance

**Decision Authority**: System Architect (Michel Kerkmeester) — KB architecture is technical domain.

**Review Requirements**:
- Sales Ops Team: Informed (no direct impact on their workflow)
- Global Resource Owners: Consulted (symlink dependencies on Brand v0.110, HVR v0.101)

**Governance Notes**:
- Symlink integrity verified at every deployment (pre-deployment checklist item CHK-102)
- Global resource version changes require re-validation of partner email system (e.g., if Brand updates from v0.110 to v0.120, test 3 sample emails for compatibility)
- Architecture pattern changes across ecosystem require ADR update and re-evaluation
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Lightweight Email Quality Rubric (not full MEQT)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-15 |
| **Deciders** | System Architect, Sales Team Lead |

---

<!-- ANCHOR:adr-004-context -->
### Context

Partner emails are shorter (3-5 paragraphs) and more transactional than marketing copy or LinkedIn posts. The existing ecosystem uses MEQT (25-point rubric for marketing) and 100-point rubric (for LinkedIn). Adapting either to partner emails risks over-engineering. A lightweight rubric tailored to email quality is needed.

### Constraints
- Partner emails average 150-300 words (vs 800+ for marketing copy)
- HVR hard blockers still apply (all 13 rules, no exceptions)
- Must cover factual accuracy (pricing, processes) not just tone
- Sales team needs quick pass/flag/fail signals, not granular scores
- Must handle multilingual emails (EN/NL/DE/FR)
<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**Summary**: Create a simplified 5-dimension email quality rubric instead of adapting the full MEQT (25-point) or 100-point scoring systems.

**Details**: Implement a 5-dimension rubric with pass/flag/fail per dimension: (1) Clarity - is the reply easy to understand? (2) Accuracy - are facts/pricing/processes correct? (3) Tone - factual when explaining, persuasive when selling? (4) Actionability - clear next step for partner? (5) Language - matches incoming email language? HVR still applies as hard blockers (any violation = auto-fail).
<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Lightweight 5-dimension rubric** | Right-sized for 3-paragraph emails, fast evaluation, covers critical dimensions (clarity, accuracy, tone, action, language) | Less granular than MEQT (no sub-scores) | 9/10 |
| Full MEQT adaptation | Comprehensive evaluation (25 points), proven for marketing copy | Too heavy for transactional emails, evaluation time exceeds writing time, false precision | 5/10 |
| 100-point rubric (LinkedIn-style) | Extremely detailed feedback | Excessive for partner emails, designed for storytelling not transactions, cognitive overload | 4/10 |
| No scoring system | Fastest evaluation (just HVR check) | Risks quality drift over time, no feedback loop for improvement, misses factual errors | 2/10 |
| Simple pass/fail | Easy to understand (binary outcome) | Too coarse-grained, misses opportunity for targeted feedback, no distinction between minor/major issues | 6/10 |

**Why Chosen**: Lightweight rubric scores highest due to right-sizing for email context. Partner emails need fast, actionable feedback on 5 critical dimensions. Pass/flag/fail per dimension enables targeted fixes without MEQT's evaluation overhead.
<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**Positive**:
- Fast evaluation (30 seconds per email vs 3-5 min for MEQT)
- Actionable feedback (flag specific dimension needing fix)
- Accuracy dimension catches factual errors (pricing, processes)
- Language dimension ensures reply matches incoming email language

**Negative**:
- Less granular than MEQT (no sub-scores for structure, hooks, CTAs) - Mitigation: Email templates provide structure, rubric focuses on variable elements
- Requires defining clear pass/flag/fail criteria per dimension - Mitigation: Document criteria with examples in rules/quality-rubric.md

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Dimension criteria become subjective over time | Medium | Document concrete examples (3 pass, 3 flag, 3 fail per dimension), quarterly calibration |
| Accuracy dimension misses edge cases (outdated pricing) | High | Link accuracy check to context/platform-knowledge.md (single source of truth), version pricing data |
| Language dimension fails on mixed-language emails | Low | Default to incoming email's primary language (first sentence), allow override |
<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Need quality control beyond HVR. Early tests show tone issues (too casual) and factual errors (wrong pricing tier). |
| 2 | **Beyond Local Maxima?** | PASS | Evaluated 5 options (lightweight, MEQT, 100-point, none, pass/fail). Chose custom solution vs forcing MEQT fit. |
| 3 | **Sufficient?** | PASS | 5 dimensions cover email-specific needs. Simpler than MEQT, more structured than pass/fail. Right balance. |
| 4 | **Fits Goal?** | PASS | Goal is "high-quality partner emails". Rubric directly measures quality across critical dimensions. |
| 5 | **Open Horizons?** | PASS | 5 dimensions can expand (add dimension 6: Follow-up timing) or contract (merge Clarity+Actionability) based on learnings. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-004-five-checks -->

---

<!-- ANCHOR:adr-004-impl -->
### Implementation

**Affected Systems**:
- New: rules/quality-rubric.md (5-dimension criteria with examples)
- New: AGENTS.md evaluation routing (invoke rubric after draft generation)
- Modified: HVR rules (remain as hard blockers, rubric is secondary check)

**Rollback**: If 5-dimension rubric proves insufficient, adopt simplified MEQT (10-point version focusing on clarity, accuracy, tone). Estimated migration time: 2 hours.

---

### Governance

**Decision Authority**: System Architect (Michel Kerkmeester) + Sales Team Lead (joint) — quality system affects both technical accuracy and operational workflow.

**Review Requirements**:
- Floris: Approved (validated 5-dimension rubric captures Dutch email quality)
- Sam: Approved (validated rubric captures English email quality)
- Finance: Consulted (accuracy dimension covers pricing/refund correctness)

**Governance Notes**:
- Quality rubric calibrated quarterly: run 20 sample emails through rubric, compare agent scores vs human judgment, adjust criteria if >15% divergence
- Hard blockers list reviewed monthly: add new blockers as edge cases emerge, remove blockers that cause false positives
- Score threshold (≥40/50) reviewed after first 100 emails: adjust if too strict (>20% flagged) or too lenient (<5% flagged)
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->

---

<!--
Level 3+ Decision Record
Document significant technical decisions with governance oversight
One ADR per major decision, with decision authority and review tracking
-->
