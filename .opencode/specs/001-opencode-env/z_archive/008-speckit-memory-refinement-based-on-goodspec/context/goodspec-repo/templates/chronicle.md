# CHRONICLE: {{project_name}}

**Last Updated:** {{last_updated}}
**Current Phase:** {{current_phase}}

---

## Journey Status

```
{{progress_bar}} {{progress_percent}}%
```

**Position:** {{position_description}}

| Metric | Value |
|--------|-------|
| Waves Completed | {{waves_completed}}/{{waves_total}} |
| Tasks Done | {{tasks_completed}} |
| Time Invested | {{total_time}} |
| Current Mode | {{mode}} |

---

## Current Wave

### Wave {{current_wave}}: {{wave_name}}

**Status:** {{wave_status}}
**Started:** {{wave_started}}

**Tasks:**
{{#wave_tasks}}
- [{{status}}] {{name}}
{{/wave_tasks}}

**Blockers:**
{{#blockers}}
- **[{{severity}}]** {{description}}
{{/blockers}}
{{^blockers}}
None
{{/blockers}}

---

## Recent Activity

{{#recent_activity}}
### {{timestamp}}
- **Action:** {{action}}
- **Outcome:** {{outcome}}
{{#decision}}
- **Decision:** {{decision}} — *Reason: {{reason}}*
{{/decision}}
{{/recent_activity}}

---

## Decisions Made

Significant choices captured for future reference.

{{#decisions}}
### {{date}}: {{title}}
- **Choice:** {{choice}}
- **Alternatives:** {{alternatives}}
- **Reasoning:** {{reasoning}}
- **Impact:** {{impact}}
{{/decisions}}

{{^decisions}}
No decisions recorded yet.
{{/decisions}}

---

## Learnings

Insights gained during this journey.

{{#learnings}}
- **{{topic}}:** {{insight}}
{{/learnings}}

{{^learnings}}
No learnings captured yet.
{{/learnings}}

---

## Checkpoints

Saved positions for recovery.

{{#checkpoints}}
| ID | Phase | Wave | Created | Description |
|----|-------|------|---------|-------------|
| {{id}} | {{phase}} | {{wave}} | {{created}} | {{description}} |
{{/checkpoints}}

{{^checkpoints}}
No checkpoints saved.
{{/checkpoints}}

---

## Memory Integration

### Recent Memory Entries
{{#recent_memories}}
- **[{{type}}]** {{title}} — {{created}}
{{/recent_memories}}

### Relevant Past Context
{{#relevant_context}}
- {{context}}
{{/relevant_context}}

---

## Next Steps

### Immediate
{{#immediate_next}}
1. {{.}}
{{/immediate_next}}

### After This Wave
{{#after_wave}}
- {{.}}
{{/after_wave}}

---

## Quick Commands

```bash
# Check status
/goop-status

# Continue work
/goop-execute

# Save checkpoint
/goop-checkpoint

# Search past work
/goop-recall "{{query}}"
```

---

*Chronicle auto-updated by GoopSpec after each action*
*This is your journey log — decisions persist, context flows*
*GoopSpec v0.1.0*
