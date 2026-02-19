# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/workflows-documentation/assets/documentation/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | [###-feature-name] |
| **Completed** | [YYYY-MM-DD] |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

<!-- Voice guide:
     Open with a hook paragraph: what changed and why it matters. Impact first.
     Then ### subsections per feature. Each: what it does + why it exists.
     Write "You can now inspect the trace" not "Trace inspection was implemented."
     The narrative IS the summary. No "Files Changed" table needed at this level.
     Reference: specs/003-system-spec-kit/136-mcp-working-memory-hybrid-rag/implementation-summary.md -->

[Opening hook: 2-4 sentences on what changed and why it matters. Lead with impact.]

### [Feature Name]

[What this feature does and why it exists. 1-2 paragraphs with direct address.
Explain what the user gains, not what files you touched.]
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

<!-- Voice guide:
     Tell the delivery story in stages: testing, verification, rollout.
     "All features shipped behind feature flags" not "Feature flags were used."
     Include specific numbers: pass rates, failure counts, gate decisions. -->

[How was this tested, verified and shipped? What was the rollout approach?
What checks gave you confidence this works correctly?]
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

<!-- Voice guide: "Why" reads like you're explaining to a colleague.
     "Chose X because Y" not "X was selected due to Y." -->

| Decision | Why |
|----------|-----|
| [What was decided] | [Active-voice rationale with specific reasoning] |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

<!-- Voice guide: Be honest. Show failures alongside passes.
     "FAIL, TS2349 error in benchmarks.ts" not "Minor issues detected." -->

| Check | Result |
|-------|--------|
| [Validation, lint, tests, manual check] | [PASS/FAIL with specifics] |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

<!-- Voice guide: Number them. Specific and actionable.
     "Adaptive fusion defaults to off. Set SPECKIT_ADAPTIVE_FUSION=true to enable."
     not "Some features may require configuration." -->

1. **[Limitation]** [Specific detail with workaround if one exists.]
<!-- /ANCHOR:limitations -->

---

<!--
Level 3: Narrative post-implementation summary. Feature subsections replace file tables.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skill/workflows-documentation/assets/documentation/hvr_rules.md
-->
