---
title: "Feature Research: Worktree provisioning and adapter suite runner research after the merge - Comprehensive Technical Investigation"
description: "Complete research documentation providing in-depth technical analysis, architecture patterns, and implementation guidance."
trigger_phrases:
  - "post merge research provisioning research"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: research | v1.0 -->
# Feature Research: Worktree provisioning and adapter suite runner research after the merge - Comprehensive Technical Investigation

Complete research documentation providing in-depth technical analysis, architecture patterns, and implementation guidance.


---

<!-- ANCHOR:when-to-use -->
## WHEN TO USE THIS TEMPLATE

**Use research.md when:**
- Complex features requiring deep technical investigation spanning multiple areas
- Research involving multiple integration points or technologies
- Documentation will serve as authoritative reference during implementation
- Research answers strategic technical questions requiring comprehensive analysis
- Investigation covers 3+ major technical domains (APIs, data models, integrations, etc.)

**Do NOT use when:**
- Simple feature specifications (use spec.md)
- Architecture decisions only (use decision-record.md or include in this doc)

**This template is designed for comprehensive feature research that will guide implementation.**
<!-- /ANCHOR:when-to-use -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

- **Research ID**: RESEARCH-[FORMAT: ###]
- **Feature/Spec**: [YOUR_VALUE_HERE: link to related spec.md or feature name]
- **Status**: [FORMAT: Draft | In Progress | Review | Complete | Archived]
- **Date Started**: [FORMAT: YYYY-MM-DD]
- **Date Completed**: [FORMAT: YYYY-MM-DD] [OPTIONAL: empty if in progress]
- **Researcher(s)**: [YOUR_VALUE_HERE: names/roles]
- **Reviewers**: [YOUR_VALUE_HERE: names/roles]
- **Last Updated**: [FORMAT: YYYY-MM-DD]

**Related Documents**:
- Spec: [OPTIONAL: link to spec.md if applicable]
- Spike: [OPTIONAL: link to spike-*.md if applicable]
- ADR: [OPTIONAL: link to decision-record-*.md if applicable]
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:file-organization -->
## FILE ORGANIZATION

**During research, organize files as:**
- Research findings → This file (research.md)
- Experiments/code → `scratch/experiments/`
- Raw data/responses → `scratch/data/`
- Debug/logs → `scratch/logs/`

**After research:**
- Move valuable code to permanent location
- Summarize key data in research.md
- Delete scratch/ contents

> **OpenCode Users:** Clean up scratch/ manually before claiming completion.
<!-- /ANCHOR:file-organization -->

---

<!-- ANCHOR:investigation-report -->
## 2. INVESTIGATION REPORT

### Request Summary
[YOUR_VALUE_HERE: summarize the original request or problem - what question are we trying to answer? What feature are we investigating? - 2-4 sentences]

### Current Behavior
[YOUR_VALUE_HERE: describe the current state if applicable - what exists today? What are the current limitations or issues?] [OPTIONAL: N/A if greenfield feature]

### Key Findings
1. **[YOUR_VALUE_HERE: finding 1 title]**: [Description and significance]
2. **[YOUR_VALUE_HERE: finding 2 title]**: [Description and significance]
3. **[YOUR_VALUE_HERE: finding 3 title]**: [Description and significance]

### Recommendations
[YOUR_VALUE_HERE: based on research findings, what do we recommend? What is the proposed path forward?]

**Primary Recommendation**:
- [YOUR_VALUE_HERE: primary approach with rationale - example: Use GraphQL API because it reduces over-fetching and provides flexible queries]

**Alternative Approaches**:
- [YOUR_VALUE_HERE: alternative 1 with trade-offs - example: REST API - simpler but requires multiple endpoints]
- [YOUR_VALUE_HERE: alternative 2 with trade-offs - example: gRPC - faster but steeper learning curve]
<!-- /ANCHOR:investigation-report -->

---

<!-- ANCHOR:executive-overview -->
## 3. EXECUTIVE OVERVIEW

### Executive Summary
[YOUR_VALUE_HERE: 2-3 paragraph high-level summary of the research, findings, and recommendations - should be understandable by non-technical stakeholders]

### Architecture Diagram

```
[YOUR_VALUE_HERE: ASCII diagram showing high-level architecture, data flow, or system components]

Example:
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Client    │─────▶│   Server    │─────▶│  Database   │
│  (Browser)  │◀─────│   (API)     │◀─────│ (Storage)   │
└─────────────┘      └─────────────┘      └─────────────┘
```

### Quick Reference Guide

**When to use this approach**:
- [YOUR_VALUE_HERE: use case 1]
- [YOUR_VALUE_HERE: use case 2]

**When NOT to use this approach**:
- [YOUR_VALUE_HERE: limitation 1]
- [YOUR_VALUE_HERE: limitation 2]

**Key considerations**:
- [YOUR_VALUE_HERE: consideration 1]
- [YOUR_VALUE_HERE: consideration 2]

### Research Sources

| Source Type | Description | Link/Reference | Credibility |
|-------------|-------------|----------------|-------------|
| Documentation | [Official docs title] | [URL] | High |
| Article/Tutorial | [Title] | [URL] | Medium |
| Example Implementation | [Description] | [URL] | High |
| Community Discussion | [Topic] | [URL] | Medium |
<!-- /ANCHOR:executive-overview -->

---

<!-- ANCHOR:core-architecture -->
## CHANGELOG & UPDATES

### Version History

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| [FORMAT: YYYY-MM-DD] | 1.0.0 | Initial research completed | [Name] |
| [FORMAT: YYYY-MM-DD] | 1.1.0 | Updated with [changes] | [Name] |

### Recent Updates
- [FORMAT: YYYY-MM-DD]: [Description of update]
<!-- /ANCHOR:changelog-updates -->
- [FORMAT: YYYY-MM-DD]: [Description of update]

---

<!--
  REPLACE SAMPLE CONTENT IN FINAL OUTPUT
  - This template contains placeholders and examples
  - Replace them with actual content
  - Remove sections that don't provide value (mark as N/A or delete)
  - Adjust language/code examples to match your tech stack
  - Maintain the SPECKIT_TEMPLATE_SOURCE marker at the top
-->
