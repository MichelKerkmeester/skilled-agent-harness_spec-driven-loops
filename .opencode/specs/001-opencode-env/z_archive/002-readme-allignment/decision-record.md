# Decision Record: README Alignment

## DR-001: Merge Memory Section into Spec Kit

**Status:** Accepted
**Date:** 2024-12-26

### Context
The system-memory skill was merged into system-spec-kit in spec 035-memory-speckit-merger. The README still describes them as separate systems.

### Decision
Merge the Memory System section (Section 3) into the Spec Kit Framework section (Section 2) as a subsection.

### Rationale
- Reflects actual architecture
- Reduces confusion for new users
- Maintains "Two Semantic Systems" concept (LEANN for code, Spec Kit Memory for conversation)

### Consequences
- Section numbering changes
- Some content consolidation needed
- Clearer mental model for users

---

## DR-002: Keep "Two Semantic Systems" Concept

**Status:** Accepted
**Date:** 2024-12-26

### Context
The README explains the difference between LEANN (code search) and Spec Kit Memory (conversation context). This distinction is still valid.

### Decision
Keep the "Two Semantic Systems" explanation but update the naming.

### Rationale
- Users still need to understand the difference
- Prevents confusion between the two vector databases
- Important for correct tool selection

### Consequences
- Update tool names in the explanation
- Keep the comparison table
- Clarify that both are "Native MCP" tools

---

## DR-003: Update All Counts Based on Research

**Status:** Accepted
**Date:** 2024-12-26

### Context
Research found discrepancies in counts:
- Skills: README says 9, reality is 8
- Commands: README says 18, reality is 17
- Templates: README says 10, reality is 11
- MCP Tools: README says 14, reality is 13

### Decision
Update all counts to match verified reality.

### Rationale
- Accuracy builds trust
- Prevents user confusion
- Reflects actual system state

### Consequences
- Minor text updates throughout
- May need to update any lists that enumerate items
