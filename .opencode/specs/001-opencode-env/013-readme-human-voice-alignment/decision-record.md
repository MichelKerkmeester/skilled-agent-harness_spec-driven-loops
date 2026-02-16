# Decision Record: README Human Voice Alignment

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Adopt Human Voice Rules as Permanent Documentation Standard

<!-- ANCHOR:adr-001-context -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-02-15 |
| **Deciders** | Michel Kerkmeester |

---

### Context

All ~77 README files in the .opencode/ public release repo use AI-detectable writing patterns. Em dashes, semicolons, Oxford commas, and overused vocabulary (leverage, robust, seamless, utilize) make documentation read like machine-generated text. The Barter ecosystem developed Human Voice Rules (HVR) that produce natural, human-sounding prose. These rules need a permanent home in the documentation workflow so every future README follows the same standard.

### Constraints
- ~77 files across the repo need retroactive updates (one-time cost)
- HVR rules must not change technical meaning in any file
- Code blocks and examples must remain untouched
- The workflows-documentation skill is the single enforcement point for writing standards

<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**Summary**: Adopt HVR from the Barter ecosystem as the permanent documentation standard, integrated into the workflows-documentation skill.

**Details**: All existing README files will be rewritten to pass HVR checks. The workflows-documentation skill will gain a new HVR section that enforces these rules for all future documentation. This creates one voice standard across the entire public release.

<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Adopt HVR permanently (chosen)** | Consistent voice, automated enforcement, proven rules | One-time rewrite cost of ~77 files | 9/10 |
| Edit files ad hoc as noticed | No upfront cost, flexible | Inconsistent voice, no enforcement, drift over time | 3/10 |
| Create custom rules from scratch | Tailored to .opencode/ specifically | Duplicate effort, HVR already proven, higher risk of gaps | 4/10 |
| Use an AI writing detector tool | Automated detection | Does not fix problems, adds tooling dependency, false positives | 2/10 |

**Why Chosen**: HVR rules are already proven in the Barter ecosystem. Integrating them into the existing workflows-documentation skill creates enforcement with zero new tooling. The one-time rewrite cost is acceptable given ~77 files is a bounded, finite scope.

<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**Positive**:
- Every README in the public release reads in the same natural voice
- Future documentation automatically follows HVR through skill enforcement
- No new tools or dependencies required

**Negative**:
- One-time cost of ~6-10 hours to rewrite 77 files - Mitigation: Wave-based parallel execution reduces wall-clock time
- Risk of meaning drift during rewrites - Mitigation: Spot-checks after each wave, semantic review

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Meaning changes during rewrite | H | Semantic review per wave + spot-checks |
| Rules too restrictive for technical writing | M | Document exemptions for proper nouns and technical terms |
| Contributor confusion about new standards | L | HVR section in skill provides clear rules |

<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | AI-detectable patterns exist across all 77 files now |
| 2 | **Beyond Local Maxima?** | PASS | 4 alternatives evaluated, HVR scored highest |
| 3 | **Sufficient?** | PASS | Reuses proven rules rather than creating new ones |
| 4 | **Fits Goal?** | PASS | Directly addresses the stated problem of AI-sounding docs |
| 5 | **Open Horizons?** | PASS | Skill integration means rules evolve with project |

**Checks Summary**: 5/5 PASS

<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**Affected Systems**:
- All README.md files under .opencode/ (~77 files)
- workflows-documentation skill (SKILL.md + references/)
- system-spec-kit/README.md (anchor retention policy)

**Rollback**: `git revert` per-wave commits. Each wave committed separately for granular rollback.

<!-- /ANCHOR:adr-001-impl -->

<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Anchor Tag Policy - Centralized to system-spec-kit/README.md

<!-- ANCHOR:adr-002-context -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-02-15 |
| **Deciders** | Michel Kerkmeester |

---

### Context

Multiple README files contain HTML anchor tags (`<a id="...">`). These anchors add visual clutter to raw markdown and complicate maintenance. Only system-spec-kit/README.md has a legitimate need for anchors (cross-referencing from other documentation).

### Constraints
- system-spec-kit/README.md uses anchors for navigation from external documents
- Other READMEs have anchors that serve no cross-referencing purpose
- Anchor removal must not break any existing links

<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**Summary**: Only system-spec-kit/README.md retains anchor tags. All other README files have anchors stripped.

**Details**: During the HVR rewrite pass, all anchor tags will be removed from every README except system-spec-kit/README.md. Any internal links pointing to removed anchors will be updated or removed.

<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Centralize to system-spec-kit only (chosen)** | Clean markdown, single anchor source | Must verify no broken links | 8/10 |
| Keep all anchors | No link breakage risk | Clutter remains, maintenance burden | 3/10 |
| Remove all anchors everywhere | Maximum simplicity | Breaks legitimate cross-references in spec-kit | 2/10 |

**Why Chosen**: Balances cleanliness with functionality. The one file that needs anchors keeps them. All others get cleaner markdown.

<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**Positive**:
- Cleaner raw markdown across 76+ files
- Single source of truth for anchor-based navigation

**Negative**:
- Must verify no external links break - Mitigation: grep for anchor references before removal

<!-- /ANCHOR:adr-002-consequences -->

<!-- /ANCHOR:adr-002 -->

---

<!--
Level 3 Decision Record - README Human Voice Alignment
ADR-001: HVR adoption
ADR-002: Anchor tag centralization
-->
