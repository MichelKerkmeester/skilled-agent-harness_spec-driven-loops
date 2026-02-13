# MILESTONE: {{milestone_name}}

**Version:** {{version}}
**Started:** {{started_date}}
**Target:** {{target_date}}
**Status:** {{status}}

---

## Milestone Goal

{{goal}}

**Definition of Done:**
{{#definition_of_done}}
- [ ] {{.}}
{{/definition_of_done}}

---

## Progress

```
{{progress_bar}} {{progress_percent}}%
```

| Metric | Current | Target |
|--------|---------|--------|
| Waves | {{waves_completed}}/{{waves_total}} | {{waves_total}} |
| Tasks | {{tasks_completed}} | {{tasks_total}} |
| Time | {{time_spent}} | {{time_estimated}} |

---

## Waves in This Milestone

{{#waves}}
### Wave {{number}}: {{name}}

**Status:** {{status}}
**Tasks:** {{tasks_completed}}/{{tasks_total}}

{{#completed}}
**Completed:** {{completed_date}}
**Summary:** {{summary}}
{{/completed}}

{{^completed}}
**Next:** {{next_task}}
{{/completed}}

{{/waves}}

---

## Key Deliverables

{{#deliverables}}
- [{{status}}] **{{name}}**: {{description}}
{{/deliverables}}

---

## Dependencies

### External
{{#external_deps}}
- {{dependency}} — {{status}}
{{/external_deps}}

### Internal
{{#internal_deps}}
- Requires: {{requirement}} — {{status}}
{{/internal_deps}}

---

## Decisions Log

Significant decisions made during this milestone:

{{#decisions}}
| Date | Decision | Rationale |
|------|----------|-----------|
| {{date}} | {{decision}} | {{rationale}} |
{{/decisions}}

---

## Blockers & Risks

### Active Blockers
{{#blockers}}
- **[{{severity}}]** {{description}}
  - **Impact:** {{impact}}
  - **Resolution:** {{resolution}}
{{/blockers}}
{{^blockers}}
None
{{/blockers}}

### Identified Risks
{{#risks}}
- **{{risk}}**: {{mitigation}}
{{/risks}}

---

## On Completion

When this milestone completes:

1. Run `/goop-complete` to archive
2. Generate RETROSPECTIVE.md
3. Extract LEARNINGS.md → Memory
4. Tag git: `git tag -a {{version}} -m "{{milestone_name}}"`
5. Update project status

---

## Notes

{{#notes}}
- {{note}}
{{/notes}}

---

*Milestone tracking by GoopSpec*
*Complete milestones are archived with learnings extracted*
*GoopSpec v0.1.0*
