# Level 3+ Templates

> Extended templates for enterprise-scale changes requiring formal governance, multi-agent coordination, and compliance tracking.

---

## 1. 📖 OVERVIEW

Level 3+ templates support enterprise-scale changes requiring formal approval workflows, compliance tracking, multi-agent coordination, and comprehensive governance. These templates build on Level 3 by adding AI execution frameworks, extended checklists, workstream coordination, and compliance checkpoints.

### When to Use Level 3+

Use Level 3+ templates when:

1. **Enterprise Scale** - High-visibility changes with formal approval workflows
2. **Compliance Required** - SOX, HIPAA, or other regulatory checkpoints needed
3. **Stakeholder Governance** - Sign-off tracking across multiple stakeholders
4. **Multi-Agent Coordination** - AI execution protocols for coordinated work
5. **High Complexity** - Complexity score 80-100 with extensive dependencies
6. **Version Tracking** - Changelog and version history mandated

**Do NOT use Level 3+ if:**
- Standard complex feature without governance requirements (use Level 3)
- No formal approvals required (use Level 3)
- Compliance not mandated (use Level 3)
- Single-agent execution sufficient (use Level 3)

### What Level 3+ Adds

Level 3+ builds on Level 3 by adding enterprise governance and multi-agent coordination:

| Addition | Purpose | Impact |
|----------|---------|--------|
| **AI Execution Framework** | Pre-task checklists, execution rules, status tracking | Coordinated multi-agent work |
| **Extended Checklist** | 100-150 items with P0/P1/P2 prioritization | Comprehensive validation |
| **Workstream Coordination** | Parallel workstream tracking and dependencies | Complex project management |
| **Compliance Checkpoints** | SOX, HIPAA, regulatory tracking | Enterprise compliance |
| **Approval Workflow** | Stakeholder matrix with sign-off tracking | Formal governance |
| **Communication Plan** | Status reporting, escalation paths | Stakeholder management |

**Template Composition:**
```
Level 3+ = Core + Level 2 Verify + Level 3 Arch + Level 3+ Govern
         = ~640 LOC of structured documentation
```

---

## 2. 📁 STRUCTURE

Level 3+ includes 6 template files:

| File | Purpose | Additions Over Level 3 |
|------|---------|------------------------|
| `spec.md` | Feature specification | +Approval Workflow, +Compliance Checkpoints, +Stakeholder Matrix |
| `plan.md` | Implementation plan | +AI Execution Framework, +Workstream Coordination, +Communication Plan |
| `tasks.md` | Task breakdown | +3-Tier Task Format, +AI Execution Protocol, +Workstream Organization |
| `checklist.md` | Validation checklist | +Extended items (100-150), +Sign-off section, +Compliance verification |
| `decision-record.md` | Architecture decisions | +Decision Authority, +Review Requirements, +Governance notes |
| `implementation-summary.md` | Post-implementation outcomes | Standard template (no L3+ additions) |

All files include `SPECKIT_LEVEL: 3+` frontmatter.

---

## 3. 🚀 QUICK START

### 1. Copy Templates to Spec Folder

```bash
# Create new spec folder
mkdir -p specs/###-feature-name

# Copy all Level 3+ templates
cp .opencode/skill/system-spec-kit/templates/level_3+/*.md specs/###-feature-name/

# Create supporting folders
mkdir -p specs/###-feature-name/{memory,scratch}
```

### 2. Fill Templates in Order

1. **spec.md** - Define requirements, stakeholders, approval workflow
2. **plan.md** - Create implementation plan with AI execution framework
3. **tasks.md** - Break down into workstreams with task dependencies
4. **decision-record.md** - Document architectural decisions as they occur
5. **checklist.md** - Track validation items throughout implementation
6. **implementation-summary.md** - Document outcomes after completion

### 3. Verify Level Requirements

Before claiming completion, ensure:
- All 6 template files filled completely
- Approval workflow documented with sign-offs
- Compliance checkpoints completed (if applicable)
- Extended checklist items verified (100-150 items)
- AI execution protocols followed for multi-agent work

---

## 4. 📚 RELATED DOCUMENTS

### Level Documentation
- [Level 3 Templates](../level_3/) - Standard complex features without governance
- [Level Specifications](../../references/templates/level_specifications.md) - Complete level requirements

### Verbose Templates
- [Verbose Level 3+ Templates](../verbose/level_3+/) - Extended guidance versions

### Addendum Components
- [Level 3+ Governance Addendum](../addendum/level3plus-govern/) - Source components for L3+ additions

---

<!--
LEVEL 3+ TEMPLATES - Enterprise Governance
- Complexity score 80-100
- Multi-agent coordination
- Formal approval workflows
- Compliance tracking
- Extended checklists (100-150 items)
-->
