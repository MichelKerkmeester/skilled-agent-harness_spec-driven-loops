# BLUEPRINT: {{project_name}}

**Spec Version:** {{spec_version}}
**Created:** {{created_date}}
**Mode:** {{mode}}

---

## Overview

**Goal:** {{goal}}

**Approach:** {{approach}}

**Waves:** {{wave_count}}
**Estimated Tasks:** {{task_count}}

---

## Wave Architecture

```
{{#waves}}
Wave {{number}}: {{name}} {{#parallel}}(parallel){{/parallel}}{{^parallel}}(sequential){{/parallel}}
{{#depends_on}}  └── depends on Wave {{.}}{{/depends_on}}
{{/waves}}
```

---

{{#waves}}
## Wave {{number}}: {{name}}

**Goal:** {{goal}}
**Parallel:** {{#parallel}}Yes — tasks can run concurrently{{/parallel}}{{^parallel}}No — sequential execution{{/parallel}}
{{#depends_on}}
**Depends On:** Wave {{.}}
{{/depends_on}}

### Tasks

{{#tasks}}
### Task {{wave}}.{{number}}: {{name}}

**Intent:** {{intent}}

**Deliverables:**
{{#deliverables}}
- [ ] {{.}}
{{/deliverables}}

**Files:**
{{#files}}
- `{{.}}`
{{/files}}

**Verification:**
```bash
{{verification}}
```

**Acceptance:**
{{acceptance}}

{{#blocks}}
**Blocks:** {{blocks}}
{{/blocks}}

---

{{/tasks}}

{{/waves}}

## Verification Checklist

Before marking complete:

{{#verification_checklist}}
- [ ] {{.}}
{{/verification_checklist}}

---

## Must-Haves Traceability

Mapping tasks to spec requirements:

| Must-Have | Covered By |
|-----------|------------|
{{#must_have_mapping}}
| {{must_have}} | Wave {{wave}}, Task {{task}} |
{{/must_have_mapping}}

---

## Risk Assessment

{{#risks}}
### {{risk}}
- **Likelihood:** {{likelihood}}
- **Impact:** {{impact}}
- **Mitigation:** {{mitigation}}
{{/risks}}

{{^risks}}
No significant risks identified.
{{/risks}}

---

## Execution Notes

### For Orchestrator
- Delegate ALL code tasks to executor agents
- Track progress in CHRONICLE.md
- Save to memory at wave boundaries
- Confirm with user at CONTRACT GATES

### For Subagents
- Read SPEC.md for requirements
- Check CHRONICLE.md for context
- Use memory_search before decisions
- Persist learnings with memory_save

---

## Deviation Protocol

If you encounter issues:

1. **Bug Found** → Auto-fix, document in CHRONICLE.md
2. **Missing Functionality** → Auto-add if critical, document
3. **Blocking Issue** → Auto-fix (deps, imports), document
4. **Architectural Decision** → STOP, ask user, log to memory

---

*Blueprint derived from SPEC.md*
*Execute with confidence — the plan is the contract*
*GoopSpec v0.1.0*
