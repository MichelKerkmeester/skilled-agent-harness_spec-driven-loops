# Decision Record: README Rewrite

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

## ADR-001: Feature Ordering — Lead with Memory Engine (D1)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-12 |
| **Deciders** | Project maintainer |

---

### Context

The current README buries the most novel and powerful features. The Spec Kit Memory MCP Server — a custom MCP server with 22 tools across 7 layers, cognitive memory (8 subsystems including FSRS scheduling, spreading activation, attention decay), and causal memory graphs — is the most differentiated capability in the entire project. Yet it appears only as bullet points and a small subsection starting at line 487 of 1,109.

### Constraints
- README must work for both new visitors and returning users
- First impression determines whether visitors explore further
- Most novel features should create the strongest differentiation signal

---

### Decision

**Summary**: Restructure the README to position The Memory Engine as the first deep-dive section (Section 4), immediately after Architecture Overview.

**Details**: The new section ordering is: Hero → Quick Start → Architecture Overview → **The Memory Engine** → The Agent Network → The Gate System → Spec Kit → Skills → Commands → Installation → What's Next. This puts the crown jewel feature front-and-center while still providing immediate actionability through Quick Start first.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Memory Engine first (chosen)** | Leads with strongest differentiator; unique in ecosystem | Unconventional order; may surprise users expecting install-first | 9/10 |
| Alphabetical ordering | Predictable, easy to find sections | No prioritization of novel features; buries differentiators | 3/10 |
| Installation-first (current pattern) | Conventional README structure; matches expectations | 156 lines of setup before any feature showcase | 4/10 |
| Agent Network first | Agents are visible and tangible | Less technically unique than Memory Engine | 6/10 |

**Why Chosen**: The Memory Engine (custom MCP server with cognitive features and causal graphs) has no equivalent in the ecosystem. Leading with it creates immediate differentiation for technical evaluators and demonstrates the project's depth. Quick Start before it ensures actionability isn't sacrificed.

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Current ordering buries best features — visitors miss core value |
| 2 | **Beyond Local Maxima?** | PASS | 4 alternatives explored; Memory-first scored highest |
| 3 | **Sufficient?** | PASS | Reordering alone addresses the discoverability problem |
| 4 | **Fits Goal?** | PASS | Directly supports SC-002 (causal graph subsection) and SC-003 (cognitive memory subsection) |
| 5 | **Open Horizons?** | PASS | Section structure is modular; can reorder later if feedback warrants |

**Checks Summary**: 5/5 PASS

---

### Consequences

**Positive**:
- Visitors immediately encounter the most unique capability
- Technical evaluators can assess depth without scrolling past boilerplate
- Creates strong first impression differentiating from simpler tools

**Negative**:
- Unconventional ordering may confuse users expecting install-first - Mitigation: Quick Start section provides immediate actionability before deep dive

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Users skip to install, miss Memory Engine | L | Quick Start links to Memory Engine; section is prominently positioned |

---

### Implementation

**Affected Systems**:
- README.md section ordering

**Rollback**: Reorder sections to conventional install-first if user feedback indicates confusion

---

---

## ADR-002: Maximum One Before/After Comparison Table (D2)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-12 |
| **Deciders** | Project maintainer |

---

### Context

The current README contains 5 before/after comparison tables at lines 41-61, 70-92, 96-124, 260-281, and 398-418. While the first comparison effectively communicates the project's value, subsequent repetitions dilute the impact and add ~120 lines of redundant content.

### Constraints
- Before/after comparisons are effective communication tools when used sparingly
- Repetition causes reader fatigue and signals lack of editorial discipline
- Every line must earn its place in the target 450-500 line budget

---

### Decision

**Summary**: Allow maximum one before/after comparison table in the entire README.

**Details**: If used, the single comparison should appear in the Hero or Quick Start section where it has maximum impact. All other comparisons will be replaced with concise feature descriptions or removed entirely.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Max 1 comparison (chosen)** | One strong comparison has impact; eliminates redundancy | Loses some comparative context | 9/10 |
| Keep all 5 comparisons | Thorough comparison coverage | Repetitive, adds ~120 lines, dilutes impact | 2/10 |
| Zero comparisons | Maximum compression | Loses an effective communication tool entirely | 5/10 |
| 2 comparisons (intro + summary) | Bookend effect | Still feels repetitive | 6/10 |

**Why Chosen**: One well-crafted comparison delivers 90% of the value with 20% of the line cost. Readers who see the same format 5 times stop reading.

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | 5 repetitions actively harm readability |
| 2 | **Beyond Local Maxima?** | PASS | 4 options considered from zero to all |
| 3 | **Sufficient?** | PASS | 1 comparison communicates the value pattern |
| 4 | **Fits Goal?** | PASS | Directly supports SC-007 (max 1 comparison) and line count target |
| 5 | **Open Horizons?** | PASS | Can add a second comparison later if needed |

**Checks Summary**: 5/5 PASS

---

### Consequences

**Positive**:
- Eliminates ~120 lines of redundant content
- Remaining comparison has maximum impact
- More room for missing content (diagrams, examples)

**Negative**:
- Loses some comparative context - Mitigation: The remaining comparison is carefully crafted to represent the overall pattern

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Visitors miss value without comparisons | L | Hero section value prop + the single comparison cover this |

---

### Implementation

**Affected Systems**:
- README.md (remove 4 of 5 comparison tables)

**Rollback**: Re-add specific comparisons if user feedback indicates need

---

---

## ADR-003: Gate System Promoted to Own Section (D3)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-12 |
| **Deciders** | Project maintainer |

---

### Context

The Gate System (3 mandatory pre-execution gates with dual-threshold validation) is the core enforcement mechanism of the entire framework. Currently it receives ONE paragraph at line 746 of the README. This is the system that prevents AI assistants from making changes without proper documentation, skill routing, and spec folder assignment.

### Constraints
- Gate System is invisible to users if buried
- It's the enforcement mechanism for all other features
- Understanding gates is essential for both users and AI assistants

---

### Decision

**Summary**: Give the Gate System its own dedicated section (Section 6) with an ASCII flow diagram showing the 3-gate progression.

**Details**: Section will cover Gate 1 (Understanding + Context, SOFT), Gate 2 (Skill Routing, REQUIRED), and Gate 3 (Spec Folder, HARD BLOCK), including the dual-threshold validation formula and bypass conditions.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Own section with flow diagram (chosen)** | Full visibility; flow diagram aids understanding | Uses ~40 lines of budget | 9/10 |
| Keep as paragraph in AGENTS.md section | Saves space | Buries core enforcement mechanism | 3/10 |
| Fold into Agent Network section | Logical grouping | Gets lost among 10 agent descriptions | 5/10 |
| Appendix/reference section | Detailed but separate | Nobody reads appendices | 4/10 |

**Why Chosen**: The Gate System is what makes this framework self-enforcing rather than suggestive. It deserves prominent placement to communicate that this isn't just guidelines — it's enforced behavior.

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Core mechanism currently invisible at line 746 |
| 2 | **Beyond Local Maxima?** | PASS | 4 placement options explored |
| 3 | **Sufficient?** | PASS | Own section with diagram is comprehensive but not excessive |
| 4 | **Fits Goal?** | PASS | Directly supports SC-004 (gate system with flow diagram) |
| 5 | **Open Horizons?** | PASS | Section is modular; can expand or compress independently |

**Checks Summary**: 5/5 PASS

---

### Consequences

**Positive**:
- Users immediately understand the framework is self-enforcing
- AI assistants can reference the flow diagram for compliance
- Dual-threshold validation gets proper explanation

**Negative**:
- 40 lines of line budget allocated - Mitigation: Well within budget; other sections compressed to compensate

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Section feels too technical for new visitors | L | Progressive disclosure: overview first, details after |

---

### Implementation

**Affected Systems**:
- README.md (new Section 6: The Gate System)

**Rollback**: Fold back into AGENTS.md section if feedback indicates separate section is unnecessary

---

---

## ADR-004: Installation Compressed to Essentials + Link (D4)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-12 |
| **Deciders** | Project maintainer |

---

### Context

The current Installation section spans 156 lines in the README. This includes detailed configuration for multiple MCP providers, environment variables, and troubleshooting. A README should get users started quickly; detailed installation belongs in a dedicated guide.

### Constraints
- Users need enough to get started
- Detailed configuration varies by environment
- Line budget for installation is ~30 lines
- Detailed guide may not exist yet

---

### Decision

**Summary**: Compress installation to essential steps (~30 lines) with a link to a detailed installation guide.

**Details**: The README installation section will cover: prerequisites, clone, install dependencies, configure MCP server (basic), and first run. Advanced configuration (multiple providers, environment-specific setup, troubleshooting) will link to a separate guide.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Essentials + link (chosen)** | Focused, respects line budget | Requires separate guide | 9/10 |
| Keep full 156 lines | Complete in one place | Bloats README; overwhelms new users | 3/10 |
| Installation in separate doc only | Maximum README compression | Users can't start from README alone | 4/10 |
| Collapsible details block | Both brief and detailed | GitHub rendering inconsistent | 6/10 |

**Why Chosen**: 30 lines gets users started. 156 lines serves as reference documentation, which belongs in a dedicated guide, not the project showcase.

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | 156 lines is 14% of README for setup boilerplate |
| 2 | **Beyond Local Maxima?** | PASS | 4 options from full to none |
| 3 | **Sufficient?** | PASS | Essential steps get users running |
| 4 | **Fits Goal?** | PASS | Supports SC-008 (installation <35 lines) and SC-009 (total line count) |
| 5 | **Open Horizons?** | PASS | Detailed guide can grow independently |

**Checks Summary**: 5/5 PASS

---

### Consequences

**Positive**:
- Saves ~126 lines for actual feature content
- New users aren't overwhelmed
- Detailed guide can be maintained separately

**Negative**:
- Users must follow a link for advanced setup - Mitigation: Essential setup works without the detailed guide

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Detailed guide doesn't exist yet | L | Note "detailed guide coming soon" or create stub |

---

### Implementation

**Affected Systems**:
- README.md (Section 10: Installation, compressed)
- Potential new file: detailed installation guide (separate deliverable)

**Rollback**: Expand installation section if users report inability to get started

---

---

## ADR-005: Architecture Diagram Required (D5)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-12 |
| **Deciders** | Project maintainer |

---

### Context

The project has 5+ major components (Memory Engine, Agent Network, Gate System, Spec Kit, Skills System) with complex interdependencies. No visual overview exists in the current README. Users must read 1,109 lines to build a mental model of how components relate.

### Constraints
- Must render in GitHub markdown (no external images to maintain)
- Must be readable at 80-character terminal width
- Must show component relationships, not just list components
- ASCII art is the only portable option for markdown

---

### Decision

**Summary**: Include an ASCII architecture diagram in Section 3 (Architecture Overview) showing how all major components relate.

**Details**: The diagram will use box-drawing characters to show: User/AI → Gate System → Agent Router → Agents → Skills/Memory Engine → Spec Kit. Data flows and enforcement boundaries will be indicated with arrows.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **ASCII diagram in README (chosen)** | Portable, no external dependencies, renders everywhere | Limited visual expressiveness | 8/10 |
| Mermaid diagram | Rich visuals, GitHub renders natively | Not all markdown viewers support it | 7/10 |
| External image (PNG) | Maximum visual quality | Maintenance burden, external hosting, can break | 4/10 |
| No diagram, text description only | Simplest | Complex system needs visual aid | 3/10 |

**Why Chosen**: ASCII diagrams render in every markdown viewer, require no external hosting, and are easy to update. They're good enough for showing component relationships even if they lack the visual polish of images.

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | 5+ components with complex interdependencies need visual overview |
| 2 | **Beyond Local Maxima?** | PASS | 4 options from none to external image |
| 3 | **Sufficient?** | PASS | ASCII diagram shows relationships; not overkill |
| 4 | **Fits Goal?** | PASS | Directly supports SC-005 (architecture diagram present) |
| 5 | **Open Horizons?** | PASS | Can upgrade to Mermaid or image later if needed |

**Checks Summary**: 5/5 PASS

---

### Consequences

**Positive**:
- Visitors get instant mental model of system architecture
- Component relationships visible at a glance
- No maintenance burden (no external files)

**Negative**:
- ASCII art has limited expressiveness - Mitigation: Supplement with brief text descriptions below diagram

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Diagram renders poorly in some viewers | M | Use only basic box-drawing characters; test on GitHub, VS Code, Obsidian |

---

### Implementation

**Affected Systems**:
- README.md (Section 3: Architecture Overview)

**Rollback**: Replace with text description if rendering issues are widespread

---

---

## ADR-006: Tone Preserved — Engaging Style, Cut Marketing Repetition (D6)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-12 |
| **Deciders** | Project maintainer |

---

### Context

The current README oscillates between engaging, personality-driven writing and dry reference-manual style. The engaging sections are effective but some cross into repetitive marketing (5 before/after tables saying essentially the same thing). The goal is to keep what works and cut what doesn't.

### Constraints
- Project has an established voice that users may recognize
- Technical accuracy cannot be sacrificed for engagement
- Marketing repetition actively harms credibility

---

### Decision

**Summary**: Maintain the engaging, personality-driven tone throughout but eliminate repetitive marketing patterns and ensure consistent voice across all sections.

**Details**: Specific guidelines: (1) Use active voice and direct address, (2) Technical sections can use engaging framing but must prioritize clarity, (3) No section should repeat a value proposition already stated elsewhere, (4) Humor/personality is welcome but must serve communication, not padding.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Engaging tone, no repetition (chosen)** | Best of both worlds | Requires careful editing | 9/10 |
| Pure reference manual | Consistent, professional | Loses project's personality | 5/10 |
| Full marketing style | Engaging, memorable | Lacks technical credibility | 4/10 |
| Dual-mode (summary + reference) | Serves both audiences | Doubles content, increases length | 3/10 |

**Why Chosen**: The project's engaging voice is an asset. The problem isn't the tone — it's the repetition. Keep the voice, cut the echoes.

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Tone inconsistency identified as Problem 5 |
| 2 | **Beyond Local Maxima?** | PASS | 4 tone strategies evaluated |
| 3 | **Sufficient?** | PASS | Tone guidelines + repetition removal addresses the issue |
| 4 | **Fits Goal?** | PASS | Supports SC-010 (engaging, consistent tone) |
| 5 | **Open Horizons?** | PASS | Tone can evolve with project; guidelines are flexible |

**Checks Summary**: 5/5 PASS

---

### Consequences

**Positive**:
- Consistent reading experience
- Personality preserved
- Repetition eliminated saves ~120 lines

**Negative**:
- Subjective judgment required in tone review - Mitigation: Dedicated tone review task (T21) with specific checklist

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Different sections feel inconsistent anyway | M | Single author for initial draft; tone review as final pass |

---

### Implementation

**Affected Systems**:
- All README.md sections (tone applied throughout)

**Rollback**: Adjust tone per section based on user feedback

---

---

## ADR-007: Enterprise Orchestration Folded into Agent Network (D7)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-12 |
| **Deciders** | Project maintainer |

---

### Context

The current README has Enterprise Orchestration patterns (circuit breaker, saga compensation, quality gates) as a small table at line 682. These patterns are part of the @orchestrate agent's capabilities and don't warrant their own section. However, they're impressive capabilities that shouldn't be lost.

### Constraints
- Enterprise patterns are part of @orchestrate agent
- They're impressive but not a standalone system
- Line budget is tight; can't justify separate section for a subtopic
- Must not lose the information entirely

---

### Decision

**Summary**: Fold Enterprise Orchestration into The Agent Network section (Section 5) as a subsection under @orchestrate agent.

**Details**: When describing the @orchestrate agent, include its enterprise patterns (circuit breaker, saga compensation, quality gates) as a highlight. This contextualizes the patterns within the agent that implements them rather than presenting them as a separate system.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Fold into Agent Network (chosen)** | Contextual, saves space | Slightly less prominent | 8/10 |
| Separate Enterprise section | Maximum visibility | Uses ~30 lines for a subtopic; feels orphaned | 5/10 |
| Remove entirely | Saves space | Loses impressive capability showcase | 3/10 |
| Fold into Architecture Overview | Shows system maturity | Architecture is meant for high-level overview, not detail | 4/10 |

**Why Chosen**: Enterprise orchestration is a capability of the @orchestrate agent. Describing it there provides natural context and saves line budget without losing information.

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Must decide where enterprise patterns go in new structure |
| 2 | **Beyond Local Maxima?** | PASS | 4 placement options considered |
| 3 | **Sufficient?** | PASS | Subsection in Agent Network covers the content |
| 4 | **Fits Goal?** | PASS | Contributes to line count target while preserving content |
| 5 | **Open Horizons?** | PASS | Can extract to own section if enterprise patterns expand |

**Checks Summary**: 5/5 PASS

---

### Consequences

**Positive**:
- Natural contextualization within the implementing agent
- Saves ~20 lines vs. separate section
- Agent Network section gains a compelling highlight

**Negative**:
- Enterprise patterns slightly less prominent - Mitigation: Highlight them with bold text or callout within Agent Network

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Users looking for "enterprise" features can't find them | L | Table of contents or heading includes "enterprise patterns" |

---

### Implementation

**Affected Systems**:
- README.md Section 5: The Agent Network (includes enterprise orchestration subsection)

**Rollback**: Extract to separate section if user feedback indicates need for prominence

---

---

## ADR-008: Line Count Target ~450-500 Lines (D8)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-12 |
| **Deciders** | Project maintainer |

---

### Context

The current README is 1,109 lines. The project has extensive features that could easily fill 2,000+ lines. A README should be a showcase and entry point, not a reference manual. Need a target that's comprehensive enough to cover all major features but disciplined enough to remain readable.

### Constraints
- Must cover 5+ major systems with meaningful depth
- Must include new content (diagrams, quick start, examples)
- Must eliminate 5 duplicate comparison tables (~120 lines saved)
- Must compress installation from 156 to ~30 lines (~126 lines saved)
- Current overview is 228 lines (can compress to ~40)

---

### Decision

**Summary**: Target 450-500 lines with hard acceptance bounds of 400-550.

**Details**: Section line budgets: Hero (20), Quick Start (30), Architecture (40), Memory Engine (80), Agent Network (60), Gate System (40), Spec Kit (50), Skills (40), Commands (30), Installation (30), What's Next (20). Buffer of ~60 lines for formatting, blank lines, and section headers. Total: ~500 lines.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **450-500 lines (chosen)** | Comprehensive yet focused; fits all major features | Requires disciplined writing | 9/10 |
| <300 lines | Maximum conciseness | Cannot cover 5+ systems with meaningful depth | 4/10 |
| 600-800 lines | More room for examples | Still bloated; loses focus | 5/10 |
| No target (organic length) | Maximum flexibility | Risk of re-bloating to 1,000+ lines | 2/10 |

**Why Chosen**: 450-500 lines is approximately 55% reduction from current 1,109. It's enough to cover all 11 planned sections with meaningful depth, includes new content (diagrams, examples), and forces editorial discipline. The hard bounds (400-550) provide flexibility without allowing drift.

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Without a target, the README will re-bloat |
| 2 | **Beyond Local Maxima?** | PASS | 4 range options considered |
| 3 | **Sufficient?** | PASS | Section budgets show all content fits in 450-500 |
| 4 | **Fits Goal?** | PASS | Directly defines SC-009 (line count target) |
| 5 | **Open Horizons?** | PASS | Target can be adjusted after first draft with feedback |

**Checks Summary**: 5/5 PASS

---

### Consequences

**Positive**:
- Forces editorial discipline
- README remains readable in one sitting
- Clear success metric for completion

**Negative**:
- Some features may feel under-documented - Mitigation: Link to detailed docs for deep dives; README is showcase, not reference

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Target too aggressive, key content cut | M | Hard bounds extend to 550; review after first draft |
| Target too generous, README still bloated | L | 450 soft target encourages conciseness |

---

### Implementation

**Affected Systems**:
- README.md (entire document constrained to target)
- All section budgets derived from this target

**Rollback**: Adjust bounds based on first draft results and feedback

---

<!--
Level 3 Decision Record
Document significant technical decisions
One ADR per major decision
-->
