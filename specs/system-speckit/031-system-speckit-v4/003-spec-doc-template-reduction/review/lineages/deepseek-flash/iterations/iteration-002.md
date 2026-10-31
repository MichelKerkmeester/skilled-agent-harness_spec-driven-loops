---
title: "Iteration 002: D1 Correctness — Template Corpus Deep Dive (level-1 examples + template sources)"
trigger_phrases: []
---
# Iteration 002: D1 Correctness — Template Corpus Deep Dive (level-1 examples + template sources)

## Focus
Correctness of the template corpus: level-1 example docs (spec/plan/tasks/implementation-summary), template sources (templates/manifest/*.tmpl), and the scaffold generator (scripts/spec/create.sh). Verify root causes for F002 (session_id composition), F007 (FIX ADDENDUM), F003 (SCAFFOLD_VALIDATION_COUNTS), and the phase-5 comment-leakage premise.

## Scorecard
- Dimensions covered: correctness
- Files reviewed: 8 (level-1 spec/plan/tasks/implementation-summary ×4, templates/manifest/plan.md.tmpl, spec.md.tmpl, tasks.md.tmpl, implementation-summary.md.tmpl, checklist.md.tmpl, decision-record.md.tmpl, scripts/spec/create.sh)
- New findings: P0=0 P1=1 P2=3
- Refined findings: P0=0 P1=0 P2=0 (F002 root cause located; evidence upgraded)
- New findings ratio: 0.28

## Findings

### P1, Required
- **F009**: Level-1 example corpus has garbled/truncated frontmatter descriptions, `.opencode/skills/system-spec-kit/templates/examples/level-1/spec.md:3`, [Description: `description: "required for a simple authentication feature (~80 LOC). Use this as a reference when"` — a mid-sentence fragment of the EXAMPLE comment; plan.md:3 ends "Note the straightforward", tasks.md:3 "Note the straightforward task numbering", and implementation-summary.md:3 ends with a literal `-->` (`"the completed authentication feature. Created AFTER implementation completes. -->"`). All four canonical level-1 reference docs carry broken description metadata that authors copying the examples would inherit.] (dimension: correctness)

### P2, Suggestion
- **F010**: Level-1 example docs have drifted from the manifest templates, `templates/manifest/plan.md.tmpl:152`, [Description: scaffolds produced by plan.md.tmpl carry the `_memory` continuity block, SELF-CHECK/FAILURE-MODES comments, and the FIX ADDENDUM section, but the filled-in example (examples/level-1/plan.md) shows none of these — an author comparing example to scaffold sees two different structures. Same for spec.md.tmpl vs examples/level-1/spec.md (no `_memory` in example).] (dimension: correctness)
- **F011**: Instructional HTML comment leakage confirmed in current scaffold output, `001-analysis/plan.md:33-39`, [Description: all scaffolded plans carry SELF-CHECK/FAILURE-MODES comment blocks; the level-1 examples additionally carry `<!-- EXAMPLE: ... -->` blocks (spec.md:20-22, tasks.md:18-20) and CORE TEMPLATE footers (spec.md:137-142, plan.md:148-153). This corroborates phase-5's 15.5% premise: plain HTML comments are not stripped by the renderer and leak into rendered bytes.] (dimension: correctness)
- **F012**: SCAFFOLD_VALIDATION_COUNTS block is appended unconditionally with phantom REQ ids, `scripts/spec/create.sh:550-582`, [Description: create.sh appends the REQ-003..REQ-008 + six bare `**Given**` block to any spec.md lacking it (line 550), so every scaffolded spec carries six nonexistent REQ ids. Only create.sh itself references the marker (no validator parses it) — inert, but pollutes authored docs until removed; 001 spec.md:169-182 still carries it.] (dimension: correctness)

## Root-Cause Confirmations (prior findings)
- **F002 CONFIRMED with root cause**: `scripts/spec/create.sh:529` sets `PACKET_POINTER="scaffold/$safe_packet_pointer"` and line 545 rewrites `session_id: "template-session"` → `scaffold-$PACKET_POINTER`, producing `scaffold-scaffold/<slug>`. The phase-parent path repeats the bug at create.sh:599-615. The malformed session id is a generator bug, not authoring residue.
- **F007 CONFIRMED**: `templates/manifest/plan.md.tmpl:152` ships the FIX ADDENDUM unconditionally in the base L1 plan template; it is not gated by a render-time condition.
- **F003 SUPPORTED**: SCAFFOLD_VALIDATION_COUNTS (001 spec.md:169-182) is a create.sh scaffold artifact (create.sh:550), corroborating that 001 spec.md was never re-processed/authored after scaffolding.
- Phase-4 premise confirmed at template level: spec/plan/tasks/checklist/implementation-summary/decision-record/review.spec/phase-parent `.tmpl` files ALL emit the `_memory` continuity block (greps at tasks.md.tmpl:58-65, plan.md.tmpl:65-72, spec.md.tmpl:57-64, checklist.md.tmpl:20-27, implementation-summary.md.tmpl:56-63, decision-record.md.tmpl:21-28, phase-parent.spec.md.tmpl:18-25).

## Claim Adjudication Packets (new P0/P1)

```json
{
  "findingId": "F009",
  "claim": "All four level-1 example docs carry truncated or garbled description frontmatter, including a literal HTML comment close in implementation-summary.md.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/templates/examples/level-1/spec.md:3",
    ".opencode/skills/system-spec-kit/templates/examples/level-1/plan.md:3",
    ".opencode/skills/system-spec-kit/templates/examples/level-1/tasks.md:3",
    ".opencode/skills/system-spec-kit/templates/examples/level-1/implementation-summary.md:3"
  ],
  "counterevidenceSought": "Checked whether the truncation is intentional stylistic clipping; compared against the EXAMPLE comment text (spec.md:20-22) which shows the description is a verbatim fragment of that comment, cut mid-sentence.",
  "alternativeExplanation": "The description fields may be generated by a doc-extraction script that spliced the EXAMPLE comment. Rejected as harmless: the shipped reference corpus is the packet's canonical authoring surface and the fragments are objectively broken metadata.",
  "finalSeverity": "P1",
  "confidence": 0.9,
  "downgradeTrigger": "If a generator script is found that rewrites example descriptions from a canonical source (making the file state a build artifact), downgrade to P2 build-noise.",
  "transitions": [{ "iteration": 2, "from": null, "to": "P1", "reason": "Initial discovery" }]
}
```

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | create.sh:529,545 vs scaffolded session_ids; plan.md.tmpl:152 vs example plan | Template-level claims verified; full spec claim sweep in iterations 4-5 |

## Assessment
- New findings ratio: 0.28
- Dimensions addressed: correctness (template corpus)
- Novelty justification: template-level root causes are new; F002/F007/F003 evidence upgraded from observation to generator-level confirmation

## Ruled Out
- "Example corpus is intentionally minimal": the truncation fragments and literal `-->` are objectively broken; minimality cannot explain a trailing HTML comment close inside YAML.

## Dead Ends
- SCAFFOLD_VALIDATION_COUNTS as a validator input: only create.sh references it — validator-consumer hypothesis eliminated (downshifted to inert residue).

## Recommended Next Focus
- Dimension: security
- Focus area: Trust boundaries of validator/scaffold consumption of doc content — create.sh perl substitutions (injection surface), template markers consumed by detectLevel, secrets handling in examples (localStorage/JWT examples), path handling in check-anchors/template-structure.

## Review verdict: CONDITIONAL
