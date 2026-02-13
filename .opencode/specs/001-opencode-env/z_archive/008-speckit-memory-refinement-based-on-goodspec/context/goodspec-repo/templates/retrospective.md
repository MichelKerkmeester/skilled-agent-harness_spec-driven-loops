# RETROSPECTIVE: {{milestone_name}}

**Version:** {{version}}
**Completed:** {{completed_date}}
**Duration:** {{total_duration}}
**Archived:** {{archived_date}}

---

## Summary

{{summary}}

**Key Achievement:** {{key_achievement}}

---

## Metrics

| Metric | Planned | Actual | Variance |
|--------|---------|--------|----------|
| Waves | {{planned_waves}} | {{actual_waves}} | {{wave_variance}} |
| Tasks | {{planned_tasks}} | {{actual_tasks}} | {{task_variance}} |
| Duration | {{planned_duration}} | {{actual_duration}} | {{duration_variance}} |
| Commits | — | {{total_commits}} | — |

### Performance
- **Average task time:** {{avg_task_time}}
- **Fastest wave:** {{fastest_wave}}
- **Slowest wave:** {{slowest_wave}}

---

## What Worked Well

{{#worked_well}}
### {{title}}
{{description}}

**Evidence:** {{evidence}}
**Carry Forward:** {{carry_forward}}

{{/worked_well}}

---

## What Didn't Work

{{#didnt_work}}
### {{title}}
{{description}}

**Impact:** {{impact}}
**Root Cause:** {{root_cause}}
**Prevention:** {{prevention}}

{{/didnt_work}}

---

## Surprises

Things we didn't anticipate:

{{#surprises}}
- **{{surprise}}**: {{how_handled}}
{{/surprises}}

---

## Key Decisions

Architectural and design choices made:

{{#key_decisions}}
### {{decision}}
- **Context:** {{context}}
- **Choice:** {{choice}}
- **Alternatives:** {{alternatives}}
- **Outcome:** {{outcome}}
- **Would Choose Again:** {{would_choose_again}}
{{/key_decisions}}

---

## Technical Debt Incurred

{{#tech_debt}}
- **{{item}}**
  - Location: `{{location}}`
  - Reason: {{reason}}
  - Effort to fix: {{effort}}
  - Priority: {{priority}}
{{/tech_debt}}

{{^tech_debt}}
No significant technical debt incurred.
{{/tech_debt}}

---

## Patterns Established

Reusable patterns for future work:

{{#patterns}}
### {{name}}
- **When to use:** {{when}}
- **Implementation:** {{implementation}}
- **Example:** `{{example_file}}`
{{/patterns}}

---

## Tools & Libraries

### Added
{{#tools_added}}
- **{{name}}** ({{version}}): {{purpose}} — {{verdict}}
{{/tools_added}}

### Removed
{{#tools_removed}}
- **{{name}}**: {{reason}}
{{/tools_removed}}

### Evaluated but Rejected
{{#tools_rejected}}
- **{{name}}**: {{reason}}
{{/tools_rejected}}

---

## Team Notes

### For Future Self
{{#notes_future_self}}
- {{note}}
{{/notes_future_self}}

### For Others
{{#notes_others}}
- {{note}}
{{/notes_others}}

---

## Memory Extraction

The following will be persisted to memory:

### Facts
{{#facts}}
- {{fact}}
{{/facts}}

### Concepts
{{#concepts}}
- {{concept}}
{{/concepts}}

### Gotchas
{{#gotchas}}
- **{{gotcha}}**: {{solution}}
{{/gotchas}}

---

## Archive Location

```
.goopspec/archive/{{version}}-{{slug}}/
├── SPEC.md
├── BLUEPRINT.md
├── CHRONICLE.md
├── RESEARCH.md
├── RETROSPECTIVE.md   (this file)
├── LEARNINGS.md       (extracted patterns)
└── waves/
    └── ...
```

---

*Retrospective generated on milestone completion*
*Learnings extracted and persisted to memory*
*Search with: /goop-recall "{{milestone_name}}"*
*GoopSpec v0.1.0*
