---
title: "Implementation Plan: Phase 3: template-dedup"
description: "Correct the real roughly 24-line decision-record frontmatter duplication and malformed L3+ description while preserving one shared ADR body, then make a separately reviewed research-taxonomy decision without breaking content routing."
trigger_phrases:
  - "decision-record frontmatter dedup"
  - "template dedup"
  - "research taxonomy neutralization"
  - "shared ADR body"
importance_tier: "important"
contextType: "general"
---
# Implementation Plan: Phase 3: template-dedup

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, YAML frontmatter, inline level gates, and Node.js tooling |
| **Framework** | system-spec-kit decision-record and research templates with content-router anchors |
| **Storage** | Template sources, rendered golden snapshots, and rebuilt distribution trees |
| **Testing** | Focused snapshot review, anchor-route inspection, and strict validation on fresh L3/L3+ scaffolds |

### Overview
Replace the two level-specific decision-record frontmatter blocks with one combined L3/L3+ metadata block, correct the malformed L3+ description, and leave the already-shared ADR body unchanged. Review the research template separately: neutralize its widget taxonomy while preserving the research_finding anchor set, or record an explicit deferral with the routing rationale.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The phase spec distinguishes the roughly 24 duplicated frontmatter lines from the shared ADR body.
- [x] The decision-record template, research template, content-router, snapshot file, and dist rebuild gate are named.
- [x] The research anchor-coupling risk and deferral path are explicit.

### Definition of Done
- [ ] L3 and L3+ use the corrected shared frontmatter and retain the same ADR body.
- [ ] The focused snapshot diff contains only the intended decision-record metadata correction and any reviewed research taxonomy change.
- [ ] The research outcome preserves routing or records a concrete deferral rationale, and both distribution trees validate cleanly.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Shared gated skeleton with isolated metadata correction: consolidate only frontmatter, preserve the ADR body, and treat research taxonomy as an independent anchor-preserving decision.

### Key Components
- **Decision-record template**: `.opencode/skills/system-spec-kit/templates/manifest/decision-record.md.tmpl` holds the L3/L3+ frontmatter and one shared ADR body.
- **Research template**: `.opencode/skills/system-spec-kit/templates/manifest/research.md.tmpl` holds the domain-specific taxonomy and required research anchors.
- **Routing and evidence**: `.opencode/skills/system-spec-kit/mcp-server/lib/content-router.ts` and `.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap` prove anchor stability and output scope.

### Data Flow
The inline-gate renderer emits one corrected metadata block and the unchanged ADR body for L3 and L3+. The research template either emits a neutral taxonomy with the same routing anchors or remains unchanged while the deferral rationale is recorded. Snapshot and validation gates inspect both paths.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Inspect the two frontmatter blocks and mark the exact duplicated roughly 24-line region separately from the shared ADR body.
- [ ] Inventory the research_finding anchor set and its content-router destinations before editing research prose.

### Phase 2: Core Implementation
- [ ] Replace the duplicated decision-record metadata with one combined L3/L3+ block and correct the malformed description.
- [ ] Preserve the shared ADR body, renderer markers, required frontmatter keys, and anchor ordering.
- [ ] Neutralize the research widget taxonomy while retaining its routing anchors, or record an explicit deferral with the coupling rationale.

### Phase 3: Verification
- [ ] Review the focused decision-record snapshot diff and confirm the ADR body is unchanged.
- [ ] Review any research snapshot re-baseline and confirm every required research_finding route still resolves.
- [ ] Rebuild `scripts/dist/` and `mcp-server/dist/`, then validate fresh L3 and L3+ scaffolds.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Template structure | Frontmatter gates, shared ADR body, required keys, and anchor ordering | Inline-gate render review and targeted `rg` |
| Snapshot | L3/L3+ decision-record output and reviewed research taxonomy output | `scaffold-golden-snapshots.vitest.ts` |
| Routing | `research_finding` destinations and unchanged content-router mappings | `content-router.ts` inspection and route checks |
| Validation | Fresh L3 and L3+ scaffolds with rebuilt distributions | `.opencode/skills/system-spec-kit/scripts/spec/validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `decision-record.md.tmpl` inline-gate grammar | Internal renderer contract | Green | Metadata dedup can alter L3/L3+ output shape |
| `research.md.tmpl` anchor set | Internal routing contract | Yellow | Taxonomy edits can break research content routing |
| `mcp-server/lib/content-router.ts` | Internal consumer | Green | Required research destinations cannot be confirmed |
| Golden snapshot suite | Internal verification | Green | The focused diff cannot be reviewed |
| `scripts/dist/` and `mcp-server/dist/` | Generated runtime surfaces | Green | Strict validation can run against stale code |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The ADR body changes, the decision-record diff exceeds the intended frontmatter correction, a research_finding route moves, or rebuilt strict validation fails.
- **Procedure**:
  1. Restore the prior decision-record and research template sources and the prior snapshot baseline.
  2. Rebuild both distribution trees from the restored sources.
  3. Confirm the previous L3/L3+ renders and research routes before reopening either template change.
<!-- /ANCHOR:rollback -->
