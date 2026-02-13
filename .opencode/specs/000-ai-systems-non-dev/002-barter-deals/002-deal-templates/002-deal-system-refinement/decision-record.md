# Barter Deal Templates — Deal System Refinement Decision Record

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.0 -->

| Field | Value |
|-------|-------|
| **Version** | 1.0.0 |
| **Last Updated** | 2026-02-07 |
| **Total Decisions** | 5 (1 accepted, 4 proposed) |

---

## Decision Summary

| ADR | Title | Status | Date |
|-----|-------|--------|------|
| ADR-001 | Harmonize HVR Across All Barter AI Systems | Accepted | 2026-02-07 |
| ADR-002 | Add Per-Dimension Minimum Floors to DEAL Scoring | Proposed | 2026-02-07 |
| ADR-003 | Adopt Tiered Validation Thresholds by Deal Complexity | Proposed | 2026-02-07 |
| ADR-004 | Add Self-Correction Diagnostic Matrix for Common Failure Modes | Proposed | 2026-02-07 |
| ADR-005 | Standardize File Naming Convention Across All Barter AI Systems | Proposed | 2026-02-07 |

---

## ADR-001: Harmonize HVR Across All Barter AI Systems

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-07 |
| **Deciders** | Michel Kerkmeester, Pieter Bertram |

### Context

The Barter ecosystem has 5 AI systems sharing HVR v0.100 (Copywriter, LinkedIn Pieter, LinkedIn Nigel, TikTok SEO, Deal Templates). Analysis revealed significant divergence: the Deals HVR is missing approximately 15 hard blocker words and 18 phrase blockers that exist in LinkedIn Pieter v0.130. The Deals HVR uses US English spellings (optimize, color) while the ecosystem standard established by LinkedIn systems is UK English (optimise, colour). The Brand Context file has a separate HVR blacklist summary that diverges from the full HVR file, creating a second source of truth. This divergence means content that passes Deals HVR validation could fail when checked against LinkedIn HVR rules, undermining ecosystem-wide voice consistency.

### Constraints

- **Technical:** All 5 systems reference HVR v0.100 but each has its own copy (per DR-006 in 001-initial-creation: copy, not symlink). Changes must be propagated manually.
- **Business:** Voice consistency is a core brand value. Pieter Bertram has stated that all Barter AI systems should sound like the same person.
- **Time/resource:** Updating all 5 systems simultaneously is out of scope for this refinement. Only Deal Templates HVR is modified here; other systems should follow.

### Decision

**Harmonize the Deal Templates HVR with LinkedIn Pieter v0.130 as the authoritative source.** Add all missing hard blockers (~15 words), phrase blockers (~18 phrases), and enforce UK English throughout. Sync the Brand Context HVR summary with the full HVR file to eliminate the dual source of truth.

### Details

LinkedIn Pieter v0.130 is chosen as the authoritative source because it is the most recently updated and most thoroughly tested HVR in the ecosystem. Harmonization is one-directional for this refinement: Deal Templates aligns to LinkedIn Pieter. Future work should propagate these changes to the other 3 systems (Copywriter, LinkedIn Nigel, TikTok SEO) in a separate spec.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| A. Keep current divergence | No work required, no risk of breaking templates | Inconsistent voice, content passes in one system but fails in another | 2/10 |
| B. Create new HVR v0.200 standard | Clean slate, addresses all issues | Massive scope, affects all 5 systems, requires extensive testing | 4/10 |
| **C. Harmonize to LinkedIn Pieter v0.130** | **Proven standard, minimal risk, addresses the specific gaps** | **One-directional, other systems still diverge until updated** | **8/10** |
| D. Create shared HVR module (symlink/import) | Single source, automatic propagation | Breaks DR-006 (copy, not symlink), platform-dependent | 5/10 |

**Why C was chosen:** It resolves the immediate divergence with the least risk. LinkedIn Pieter v0.130 is battle-tested with the most comprehensive blocker list. One-directional harmonization is pragmatic: fix Deal Templates now, propagate to other systems later.

### Five Checks Evaluation

| Check | Result | Evidence |
|-------|--------|----------|
| 1. Necessary? | PASS | Cross-system analysis confirmed 15+ missing hard blockers and US English violations. Content that passes Deals HVR fails LinkedIn validation. |
| 2. Beyond Local Maxima? | PASS | Harmonization addresses the root cause (divergent copies) rather than just patching individual missing words. Sets precedent for ecosystem-wide consistency. |
| 3. Sufficient? | PASS | Adding all missing blockers and enforcing UK English closes the identified gaps completely for Deal Templates. |
| 4. Fits Goal? | PASS | Directly supports G-006 (cross-system voice consistency) from the original spec. |
| 5. Open Horizons? | PASS | Does not prevent future creation of HVR v0.200 or a shared module approach. Changes are additive and compatible with any future architecture. |

**Summary:** 5/5 PASS

### Consequences

**Positive:**
- Deal Templates voice aligns with LinkedIn systems
- Content validated against Deals HVR will also pass LinkedIn HVR checks
- Brand Context HVR summary no longer contradicts full HVR file
- UK English enforced consistently

**Negative:**
- Existing deal template examples may fail new HVR rules and require updates (mitigated by T-207 re-validation task)
- Other 3 systems (Copywriter, LinkedIn Nigel, TikTok SEO) still diverge until separately updated
- Manual propagation needed for future HVR changes until a shared module is implemented

| Risk | Impact | Mitigation |
|------|--------|------------|
| Existing templates fail new blockers | Medium | Re-validate all examples, prepare corrected versions |
| New blockers create false positives in deal context | Low | Audit each added blocker for deal-specific relevance |
| Other systems remain divergent | Medium | Document gaps, create follow-up spec for propagation |

### Implementation

**Affected Systems:**
- `Barter deals - HVR v0.100.md` (primary: add blockers, fix spelling)
- `Barter deals - Brand Context.md` (secondary: sync HVR summary)
- `Barter deals - System Prompt.md` (tertiary: update any HVR references)

**Rollback:** Revert HVR file to pre-harmonization version via git history. No data or state to reverse.

---

## ADR-002: Add Per-Dimension Minimum Floors to DEAL Scoring

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-02-07 |
| **Deciders** | Michel Kerkmeester, Pieter Bertram (approval pending) |

### Context

The current DEAL scoring system uses a single threshold (19/25) with no per-dimension minimums. This means a deal template could score 7/7 on Expectations, 6/6 on Appeal, 6/6 on Legitimacy, and 0/6 on Description and still technically pass with 19/25. In practice, such a template would be unusable because it lacks a coherent description. LinkedIn Nigel v0.100 addresses this with component floor scores that prevent one strong dimension from masking a critical weakness.

### Constraints

- **Technical:** Floors must be simple enough for AI agents to evaluate in-line during template generation without complex calculation.
- **Business:** Floors should not be so high that they reject templates that are genuinely good but have one slightly weaker area.
- **Time/resource:** Floor values need calibration against existing scored examples.

### Decision

**Add per-dimension minimum floors: D >= 3/6, E >= 4/7, A >= 3/6, L >= 3/6.** A deal template cannot pass overall scoring even if the total exceeds the threshold, if any single dimension falls below its floor. Templates with a dimension below the floor are flagged as "conditional" and require targeted improvement on that dimension.

### Details

The floors are set at approximately 50% of each dimension's maximum, with Expectations (E) set slightly higher at 57% because incomplete or unclear expectations is the most common reason creators abandon deal applications. The "conditional" status provides a clear signal without a hard rejection, allowing targeted revision rather than full restart.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| A. No floors (current system) | Simple, no calibration needed | Allows fundamentally flawed templates to pass | 3/10 |
| **B. Fixed floors at ~50% per dimension** | **Simple to implement, prevents worst cases, calibratable** | **May need adjustment after real-world testing** | **8/10** |
| C. Proportional floors (e.g., each must be >= 60% of max) | Mathematically elegant | Same as B but less intuitive for operators | 6/10 |
| D. Weighted floors varying by deal type | Most nuanced, different floors for product vs service | Complex to implement, hard to communicate | 4/10 |

**Why B was chosen:** It is the simplest approach that prevents the core problem (masking weakness). Fixed values are easy to communicate, implement, and calibrate. If real-world testing shows the floors are too strict or lenient, they can be adjusted without changing the mechanism.

### Five Checks Evaluation

| Check | Result | Evidence |
|-------|--------|----------|
| 1. Necessary? | PASS | Without floors, the scoring system has a known gap where fundamentally flawed templates can pass. |
| 2. Beyond Local Maxima? | PASS | Addresses the structural flaw in the scoring system rather than just adding more scoring questions. |
| 3. Sufficient? | PASS | Combined with the total threshold, floors prevent both dimension-level and overall-level quality failures. |
| 4. Fits Goal? | PASS | Directly supports G-003 (enforce quality gates) from the original spec. |
| 5. Open Horizons? | PASS | Floors can be adjusted per deal type or complexity tier in the future without architectural changes. |

**Summary:** 5/5 PASS

### Consequences

**Positive:**
- Prevents fundamentally flawed templates from passing
- Provides specific improvement guidance (which dimension needs work)
- Aligns with LinkedIn Nigel v0.100 scoring sophistication

**Negative:**
- Some previously-passing templates may become "conditional" (mitigated by setting floors at conservative ~50% levels)
- Adds complexity to scoring flow (mitigated by clear documentation and simple threshold checks)

| Risk | Impact | Mitigation |
|------|--------|------------|
| Floors too strict, blocking valid templates | Medium | Start at ~50%, calibrate with 10+ test templates before finalising |
| Operators confused by "conditional" status | Low | Clear documentation with examples of conditional vs passing vs failing |

### Implementation

**Affected Systems:**
- `Barter deals - System Prompt.md` (add floor definitions to DEAL scoring section)
- `Barter deals - Standards.md` (add floor display in scoring output format)

**Rollback:** Remove floor definitions. Revert to total-only threshold.

---

## ADR-003: Adopt Tiered Validation Thresholds by Deal Complexity

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-02-07 |
| **Deciders** | Michel Kerkmeester, Pieter Bertram (approval pending) |

### Context

The current system uses a single 19/25 threshold for all deals regardless of complexity. A simple single-product deal (e.g., "Try a HEMA scarf, EUR 25") is held to the same standard as a complex multi-product service bundle (e.g., "Full brand ambassador package at De Bijenkorf, EUR 500+"). LinkedIn Nigel v0.100 addresses this by scaling validation thresholds by energy level (70/80/85), recognizing that higher-stakes content requires higher quality. Similarly, complex deals with higher monetary values, multiple products, or combined product+service elements carry higher reputational risk and warrant stricter quality gates.

### Constraints

- **Technical:** Tier classification must be deterministic from deal attributes (value, type, product count), not subjective.
- **Business:** Higher-value deals represent larger brand investments and carry higher reputational risk.
- **Time/resource:** Need enough test templates across all tiers to validate threshold levels.

### Decision

**Implement three complexity tiers with corresponding DEAL thresholds:**
- **Simple** (EUR < 100, single product, one brand): 19/25
- **Standard** (EUR 100-300, single product or service, one brand): 21/25
- **Complex** (EUR 300+, multi-product, multi-brand, or service bundle): 23/25

Classification is automatic based on deal attributes. An override mechanism allows manual tier assignment for edge cases.

### Details

Tier classification uses the highest-matching tier. For example, a single-product deal at EUR 400 is classified as Complex based on value alone, even though it is a single product. This conservative approach ensures high-value deals always receive stricter validation. The override mechanism is documented but should be used rarely and only with explicit justification.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| A. Single threshold for all deals (current) | Simple, consistent | Ignores risk variation, under-validates high-value deals | 3/10 |
| **B. Three fixed tiers** | **Clear, deterministic, matches risk profile** | **Some edge cases may need override** | **8/10** |
| C. Continuous scaling (e.g., threshold = 17 + value/100) | Smooth, no tier boundaries | Hard to communicate, unpredictable thresholds | 4/10 |
| D. Two tiers (standard/premium) | Simpler than three | Misses the distinction between truly simple and moderate deals | 6/10 |

**Why B was chosen:** Three tiers map naturally to deal reality (simple product gifts, standard collaborations, premium partnerships). Deterministic classification from deal attributes removes subjectivity. The override mechanism handles edge cases without complicating the default flow.

### Five Checks Evaluation

| Check | Result | Evidence |
|-------|--------|----------|
| 1. Necessary? | PASS | A single threshold under-validates complex deals that carry higher reputational risk. LinkedIn Nigel proves the pattern works. |
| 2. Beyond Local Maxima? | PASS | Tier-based thresholds address the structural gap rather than just raising the single threshold (which would over-validate simple deals). |
| 3. Sufficient? | PASS | Three tiers cover the full range of deal complexity observed in the Barter marketplace. |
| 4. Fits Goal? | PASS | Supports G-003 (enforce quality gates) with risk-proportionate enforcement. |
| 5. Open Horizons? | PASS | Tiers can be subdivided or threshold values adjusted without changing the mechanism. |

**Summary:** 5/5 PASS

### Consequences

**Positive:**
- High-value deals receive proportionate quality scrutiny
- Simple deals are not over-burdened with complex-deal requirements
- Aligns with LinkedIn Nigel tiered validation approach

**Negative:**
- Tier boundaries are somewhat arbitrary (EUR 100, EUR 300) and may need adjustment (mitigated by override mechanism)
- Adds classification step to scoring flow

| Risk | Impact | Mitigation |
|------|--------|------------|
| Tier boundaries mismatch marketplace reality | Medium | Survey actual deal value distribution, adjust boundaries if needed |
| Complex tier too strict, blocking valid premium deals | Medium | Calibrate with 5+ complex deal templates before finalising |

### Implementation

**Affected Systems:**
- `Barter deals - System Prompt.md` (add tier classification and threshold table)
- `Barter deals - Standards.md` (add tier display in scoring output, classification rules)

**Rollback:** Remove tier classification. Revert to single 19/25 threshold.

---

## ADR-004: Add Self-Correction Diagnostic Matrix for Common Failure Modes

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-02-07 |
| **Deciders** | Michel Kerkmeester, Pieter Bertram (approval pending) |

### Context

When a deal template scores below the threshold, the current system provides only the total score and dimension breakdown. There is no guidance on why it failed or how to fix it. Operators must interpret the score manually and guess at corrective actions. LinkedIn Nigel v0.100 includes a diagnostic pattern that maps common failure modes to root causes and fixes, significantly reducing revision cycles. Without a diagnostic matrix, the AI agent also lacks structured self-correction capability, often re-generating templates with the same issues rather than targeting specific weaknesses.

### Constraints

- **Technical:** Matrix must be comprehensive enough to cover common failures but compact enough to fit in context window when loaded on demand.
- **Business:** Corrective actions must be concrete and actionable, not generic advice.
- **Time/resource:** Requires analysis of actual failure patterns from the scoring rubric.

### Decision

**Add a self-correction diagnostic matrix to Standards.md with 10+ documented failure mode patterns.** Each pattern includes: Failure Mode name, observable Symptom (what the operator sees in the template), Root Cause (why it happens), Corrective Action (specific steps to fix), and a short Example (before/after). The matrix is loaded on demand when a template scores below threshold.

### Details

The initial 10 failure modes are derived from analysis of the DEAL scoring rubric and common AI content generation patterns:

1. **Inflated value claims** — Symptom: Value statement uses superlatives without evidence. Root cause: AI defaults to marketing language. Fix: Replace claims with specific numbers.
2. **Vague requirements** — Symptom: Creator requirements are generic ("high-quality content"). Root cause: Input lacked specifics. Fix: Add deliverable count, format, deadline.
3. **Generic descriptions** — Symptom: Description could apply to any brand. Root cause: Insufficient brand context. Fix: Add brand-specific details, product names, unique features.
4. **HVR violations in high-scoring templates** — Symptom: Template scores 20+ but contains blacklisted words. Root cause: Scoring and HVR validation are sequential, not integrated. Fix: Run HVR check before finalising score.
5. **Dimension imbalance** — Symptom: One dimension scores 6/6 while another scores 2/6. Root cause: Template over-invests in one area. Fix: Redistribute content effort per dimension guidance.
6. **Missing creator benefit** — Symptom: Template focuses on brand needs, not creator value. Root cause: Brand-centric input. Fix: Add explicit "what you get" section.
7. **Template fatigue** — Symptom: Multiple templates from same brand sound identical. Root cause: No variation in approach. Fix: Use variation scaling, change opening angle.
8. **Over-formal tone** — Symptom: Template reads like a legal contract or press release. Root cause: AI default register too formal. Fix: Apply tone alignment checkpoint, conversational rewrite.
9. **Missing logistics** — Symptom: Template lacks shipping, timeline, or process details. Root cause: Input incomplete. Fix: Trigger Interactive Mode for missing logistics fields.
10. **Cultural mismatch** — Symptom: Template uses non-Dutch marketplace conventions. Root cause: AI trained on global content. Fix: Apply Dutch market data benchmarks and conventions.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| A. No diagnostic guidance (current) | No maintenance overhead | Operators guess at fixes, AI repeats mistakes | 2/10 |
| **B. Structured diagnostic matrix with examples** | **Actionable, systematic, reduces revision cycles** | **Requires maintenance as new failure modes emerge** | **9/10** |
| C. Free-text revision suggestions per score band | Flexible, less rigid | Inconsistent quality, no pattern recognition | 5/10 |
| D. AI-generated diagnostics per template | Most tailored | Unreliable, adds latency, no standardisation | 3/10 |

**Why B was chosen:** A structured matrix provides consistent, reliable diagnostic guidance. It enables both operators and the AI agent to systematically identify and fix issues. The matrix can be extended over time as new failure modes are observed. Examples make guidance concrete rather than theoretical.

### Five Checks Evaluation

| Check | Result | Evidence |
|-------|--------|----------|
| 1. Necessary? | PASS | Without diagnostics, operators guess at fixes and the AI agent repeats the same mistakes. Revision cycles are unnecessarily long. |
| 2. Beyond Local Maxima? | PASS | Addresses the systematic gap in the correction workflow rather than just adding more scoring criteria. |
| 3. Sufficient? | PASS | 10 failure modes cover the most common patterns. The matrix is extensible for future additions. |
| 4. Fits Goal? | PASS | Supports G-003 (enforce quality gates) by making gate failures actionable rather than just informative. |
| 5. Open Horizons? | PASS | Matrix format accommodates new failure modes without structural changes. Could be extended with severity levels, frequency data. |

**Summary:** 5/5 PASS

### Consequences

**Positive:**
- Operators receive specific, actionable guidance for low-scoring templates
- AI agent can self-correct systematically instead of random regeneration
- Reduces average revision cycles from 3-4 to 1-2 (estimated)
- Creates institutional knowledge about common failure patterns

**Negative:**
- Matrix requires periodic maintenance as new patterns emerge (mitigated by extensible format)
- Matrix adds ~80-100 lines to Standards.md context load (mitigated by on-demand loading)

| Risk | Impact | Mitigation |
|------|--------|------------|
| Matrix too generic, same as doing nothing | Medium | Ground every failure mode in a real template example |
| Matrix becomes stale as system evolves | Low | Review matrix quarterly, add new patterns from scoring data |

### Implementation

**Affected Systems:**
- `Barter deals - Standards.md` (add diagnostic matrix section)
- `Barter deals - System Prompt.md` (add routing instruction to load diagnostic matrix on low scores)

**Rollback:** Remove diagnostic matrix section. No other changes affected.

---

## ADR-005: Standardize File Naming Convention Across All Barter AI Systems

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-02-07 |
| **Deciders** | Michel Kerkmeester, Pieter Bertram (approval pending) |

### Context

The 001-initial-creation plan specified filenames with a `DT - ` prefix (e.g., `DT - System Prompt.md`), but the actual implementation used `Barter deals - ` prefix (e.g., `Barter deals - System Prompt.md`). The AGENTS.md and README.md still reference the `DT - ` prefix, causing all routing instructions to reference non-existent files. This is a P0 blocker. Beyond the immediate fix, the broader question is what naming convention should be used going forward, as the ecosystem has inconsistent patterns: Copywriter uses no prefix, LinkedIn systems use system-specific prefixes, and Deal Templates used an implementation-time prefix that diverged from the planned prefix.

### Constraints

- **Technical:** File references are hardcoded strings in Markdown files. Any rename requires updating all references across all files in the system.
- **Business:** Naming should be intuitive for operators who may browse the file system directly.
- **Time/resource:** Renaming files across all 5 AI systems is out of scope. This decision covers Deal Templates only, with a recommendation for ecosystem-wide adoption.

### Decision

**Keep the current `Barter deals - ` prefix for all knowledge base files and fix all references to match.** Do not rename files. Update AGENTS.md, README.md, and System Prompt to use `Barter deals - ` prefix consistently. Document the naming convention for future reference.

Separately, propose the following ecosystem-wide naming standard for future adoption:
- Format: `[System Name] - [File Purpose].md`
- System names: `Barter deals`, `Copywriter`, `LinkedIn Pieter`, `LinkedIn Nigel`, `TikTok SEO`
- This standardizes across systems while keeping files self-documenting when browsed in a file manager.

### Details

Renaming the actual files would create unnecessary risk (all 10 files renamed, all references updated, all system prompts re-verified) when the simpler fix is to update the 3 files with wrong references. The ecosystem-wide naming recommendation is non-binding and documented for when other systems undergo their own refinement cycles.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| A. Rename files to match `DT - ` prefix | Matches original plan | Touches all 10 files, cascading reference updates, no clear benefit | 3/10 |
| **B. Fix references to match `Barter deals - ` prefix** | **Minimal changes (3 files), preserves current working state** | **Diverges from original plan naming** | **9/10** |
| C. Remove all prefixes, use bare names | Shorter filenames | Ambiguous when files are outside their directory context | 4/10 |
| D. Use numbered prefixes (01-, 02-, etc.) | Forces load order, compact | Obscures file purpose, breaks if load order changes | 2/10 |

**Why B was chosen:** The files already exist with `Barter deals - ` prefix and the system works except for the references. Fixing 3 reference files is far less risky than renaming 10 knowledge base files plus updating all cross-references. The `Barter deals - ` prefix is more descriptive than `DT - ` and self-documents the system name.

### Five Checks Evaluation

| Check | Result | Evidence |
|-------|--------|----------|
| 1. Necessary? | PASS | Broken cross-references are a P0 blocker. The system cannot load knowledge base files with wrong references. |
| 2. Beyond Local Maxima? | PASS | Establishes a naming convention standard for the ecosystem, not just a point fix. |
| 3. Sufficient? | PASS | Fixing 3 reference files resolves all broken cross-references. Naming standard prevents future divergence. |
| 4. Fits Goal? | PASS | Directly resolves REQ-001 (fix file cross-references). |
| 5. Open Horizons? | PASS | Naming standard is a recommendation, not a constraint. Systems can adopt it during their own refinement cycles. |

**Summary:** 5/5 PASS

### Consequences

**Positive:**
- P0 blocker resolved with minimal risk
- Naming convention documented for ecosystem consistency
- Files remain self-documenting in file system browsers

**Negative:**
- Original plan naming (`DT -`) is formally abandoned (mitigated by documenting the decision)
- Ecosystem-wide naming standard is only a recommendation until other systems adopt it

| Risk | Impact | Mitigation |
|------|--------|------------|
| Other systems do not adopt naming standard | Low | Document recommendation, include in future system refinement specs |
| Future file additions use inconsistent naming | Low | Naming convention documented in README.md as the authoritative reference |

### Implementation

**Affected Systems:**
- `2. Barter deals/AGENTS.md` (fix all file references)
- `2. Barter deals/README.md` (fix all file references, update inventory)
- `2. Barter deals/knowledge base/Barter deals - System Prompt.md` (fix routing references)

**Rollback:** Not applicable. This fixes a P0 blocker; rollback would reintroduce the blocker.

---

## Session Decision Log

This log tracks all gate decisions made during the 002-deal-system-refinement analysis session.

| Timestamp | Gate | Decision | Confidence | Uncertainty | Evidence | Related ADR |
|-----------|------|----------|------------|-------------|----------|-------------|
| 2026-02-07 09:00 | Issue Triage | P0 classification for broken cross-references | HIGH | 0.05 | Every file routing instruction uses wrong prefix. Verified by comparing AGENTS.md references to actual filenames. | ADR-005 |
| 2026-02-07 09:00 | Issue Triage | P0 classification for empty directories | HIGH | 0.10 | Export protocol is BLOCKING (per AGENTS.md). Empty export/ directory confirmed by filesystem scan. | — |
| 2026-02-07 09:00 | Issue Triage | P0 classification for EUR values stripped | HIGH | 0.05 | Brand Context lines 191-199 show `...` where specific EUR amounts are expected. Data loss confirmed. | — |
| 2026-02-07 09:00 | Issue Triage | P0 classification for DEAL dimension inconsistency | HIGH | 0.05 | System Prompt defines D=Description, Standards.md redefines as D=Description quality. Two different definitions for same scoring system. | ADR-002 |
| 2026-02-07 09:30 | HVR Strategy | Harmonize to LinkedIn Pieter v0.130 rather than create new HVR version | HIGH | 0.10 | Pieter v0.130 is most recently updated, most comprehensive blocker list. Proven in production. | ADR-001 |
| 2026-02-07 09:30 | Scoring Strategy | Add per-dimension floors rather than raise overall threshold | MEDIUM | 0.20 | Floors address dimension imbalance directly. Raising threshold alone would over-penalise balanced templates. Calibration needed. | ADR-002 |
| 2026-02-07 09:30 | Scoring Strategy | Three tiers rather than two or continuous scaling | MEDIUM | 0.15 | Three tiers map to observable deal categories (simple gift, standard collab, premium partnership). Two tiers miss the simple/standard distinction. | ADR-003 |
| 2026-02-07 10:00 | Naming Strategy | Fix references rather than rename files | HIGH | 0.05 | Renaming 10 files is higher risk than fixing 3 reference files. Current names are more descriptive. | ADR-005 |
| 2026-02-07 10:00 | Diagnostic Strategy | Structured matrix rather than free-text or AI-generated diagnostics | HIGH | 0.10 | Structured format ensures consistency and enables both operator and AI self-correction. LinkedIn Nigel validates the pattern. | ADR-004 |
| 2026-02-07 10:30 | Scope | UK English enforcement within this refinement (not deferred) | HIGH | 0.05 | Ecosystem standard established by LinkedIn systems. Deferring creates ongoing inconsistency. Low effort to fix. | ADR-001 |
| 2026-02-07 10:30 | Scope | Hybrid deal type support as P2 (not P1) | MEDIUM | 0.20 | No existing hybrid deal examples to reference. Need market data on hybrid deal frequency. Lower priority than scoring infrastructure. | — |
| 2026-02-07 11:00 | Architecture | On-demand loading for diagnostic matrix (not always-loaded) | HIGH | 0.05 | Matrix adds ~80-100 lines. Loading only when needed preserves context window budget. | ADR-004 |
| 2026-02-07 11:00 | Architecture | Override mechanism for tier classification (not rigid) | HIGH | 0.10 | Edge cases exist (e.g., high-value simple product). Override prevents threshold from blocking valid deals. Must be documented, not silent. | ADR-003 |

---

## Related Documents

- [spec.md](./spec.md) — Full specification with 22 requirements
- [plan.md](./plan.md) — Implementation plan with 5 phases and 3 workstreams
- Parent: [001-initial-creation/decision-record.md](../001-initial-creation/decision-record.md) — 18 original decisions (DR-001 through DR-018)
