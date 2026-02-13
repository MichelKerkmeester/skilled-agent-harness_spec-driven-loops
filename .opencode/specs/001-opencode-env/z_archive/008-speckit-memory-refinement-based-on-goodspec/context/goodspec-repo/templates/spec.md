# SPEC: {{project_name}}

**Version:** {{version}}
**Created:** {{created_date}}
**Last Updated:** {{updated_date}}
**Status:** {{status}}

---

## Vision

{{vision}}

**Why this matters:** {{why}}

---

## Must-Haves (The Contract)

These are non-negotiable. The spec is not complete until ALL must-haves are delivered.

{{#must_haves}}
- [ ] **{{title}}**: {{description}}
{{/must_haves}}

---

## Nice-to-Haves

These enhance the deliverable but are not required for acceptance.

{{#nice_to_haves}}
- [ ] **{{title}}**: {{description}}
{{/nice_to_haves}}

---

## Out of Scope

Explicitly excluded to prevent scope creep.

{{#out_of_scope}}
- {{item}}
{{/out_of_scope}}

---

## Technical Constraints

### Stack (Non-Negotiable)
- **Runtime:** {{runtime}}
- **Language:** {{language}}
- **Framework:** {{framework}}
- **Database:** {{database}}
- **Testing:** {{testing}}

### Conventions
- **Files:** {{file_naming}}
- **Components:** {{component_naming}}
- **Functions:** {{function_naming}}
- **Commits:** {{commit_format}}

### Boundaries

**Always Do:**
{{#always}}
- {{.}}
{{/always}}

**Ask First:**
{{#ask_first}}
- {{.}}
{{/ask_first}}

**Never Do:**
{{#never}}
- {{.}}
{{/never}}

---

## Acceptance Criteria

The spec is complete when:

{{#acceptance_criteria}}
1. {{.}}
{{/acceptance_criteria}}

---

## Amendment History

| Version | Date | Change | Approved By |
|---------|------|--------|-------------|
{{#amendments}}
| {{version}} | {{date}} | {{change}} | {{approved_by}} |
{{/amendments}}

---

*This specification is a CONTRACT. Changes require explicit amendment.*
*GoopSpec v0.1.0*
