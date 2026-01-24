# Level 3 Templates

> Core templates for large features (500+ LOC) requiring architecture decisions, risk assessment, and executive oversight.

---

## 1. 📖 OVERVIEW

Level 3 templates support large features (500+ LOC) requiring formal architecture decisions, risk management, and stakeholder communication. These templates build on Level 2 by adding executive summaries, risk matrices, dependency graphs, and architecture decision records.

### When to Use Level 3

Use Level 3 templates when:

1. **Large Features** - Changes affecting 500+ lines of code
2. **Architecture Decisions** - Formal documentation needed (ADRs)
3. **Stakeholder Communication** - Executive summary required for management
4. **Risk Management** - Risk matrix and mitigation strategies needed
5. **Multiple Teams** - Cross-functional work or multiple integration points
6. **User Stories** - 4-8 user stories defining feature scope

Do NOT use Level 3 if:
- Simple feature (<100 LOC) → Use Level 1
- Only verification needed (100-499 LOC) → Use Level 2
- Governance approval workflow required → Use Level 3+
- Multi-agent parallel execution coordination → Use Level 3+

### What Level 3 Adds

Level 3 builds on Level 2 by adding:

**In spec.md:**
- Executive Summary (2-3 sentence overview for stakeholders)
- Risk Matrix (risk identification, impact assessment, mitigation strategies)
- User Stories (4-8 stories with acceptance criteria)

**In plan.md:**
- Dependency Graph (visual representation of task dependencies)
- Critical Path (sequence of tasks determining minimum project duration)
- Milestones (key checkpoints with dates and deliverables)

**New Files:**
- decision-record.md (Architecture Decision Records documenting major technical choices)

**Enhanced Verification:**
- Architecture Review (design patterns, scalability, maintainability)
- Performance Benchmarks (load testing, optimization targets)
- Deployment Strategy (rollout plan, rollback procedures)
- Compliance (security, accessibility, regulatory requirements)

---

## 2. 📁 STRUCTURE

Level 3 includes **6 required files**:

| File | Purpose | Size (lines) |
|------|---------|--------------|
| `spec.md` | Feature specification with Executive Summary, Risk Matrix, User Stories | ~150-200 |
| `plan.md` | Implementation plan with Dependency Graph, Critical Path, Milestones | ~180-220 |
| `tasks.md` | Task breakdown with priority tracking | ~40-60 |
| `implementation-summary.md` | Post-completion summary of what was built | ~35-45 |
| `checklist.md` | Verification checklist with architecture, performance, deployment checks | ~120-140 |
| `decision-record.md` | Architecture Decision Record (ADR) template | ~50-60 |

### Optional File

| File | Purpose | When to Add |
|------|---------|-------------|
| `research.md` | Comprehensive technical investigation | Complex features requiring deep analysis across 3+ domains |

Copy from: `/Users/michelkerkmeester/MEGA/Development/Websites/anobel.com/.opencode/skill/system-spec-kit/templates/research.md`

---

## 3. 🚀 QUICK START

### 1. Copy Templates to New Spec Folder

```bash
# Create spec folder
mkdir -p specs/###-feature-name

# Copy Level 3 templates
cp .opencode/skill/system-spec-kit/templates/level_3/*.md specs/###-feature-name/

# Optional: Add research.md if needed
cp .opencode/skill/system-spec-kit/templates/research.md specs/###-feature-name/
```

### 2. Fill Out Templates in Order

1. **spec.md** - Start with Executive Summary, then complete all sections
2. **decision-record.md** - Document architecture decisions as you design
3. **plan.md** - Break down implementation, identify dependencies and milestones
4. **tasks.md** - Create actionable task list with priorities
5. **checklist.md** - Review verification items, customize as needed
6. **implementation-summary.md** - Complete AFTER implementation finishes

### 3. Update Throughout Implementation

- Mark checklist items as you complete them
- Add new decisions to decision-record.md
- Update plan.md if scope or timeline changes
- Track progress in tasks.md

### 4. Verify Before Completion

- All checklist.md items marked [x]
- Executive Summary reflects final state
- Risk Matrix updated with actual mitigations
- Decision Record documents all major choices

---

## 4. 📚 RELATED DOCUMENTS

### Template Variants
- [Level 2 Templates](../level_2/) - Medium features (100-499 LOC)
- [Level 3+ Templates](../level_3+/) - Governance and multi-agent coordination

### Addendum Sections
- [Level 3 Architecture Addendum](../addendum/level3-arch/) - Additional sections for spec.md and plan.md

### References
- [Level Decision Matrix](../../assets/level_decision_matrix.md) - LOC thresholds and complexity scoring
- [Template Mapping](../../assets/template_mapping.md) - Complete template selection guide
- [Phase Checklists](../../references/validation/phase_checklists.md) - Validation criteria for each level

---

<!--
LEVEL 3 TEMPLATES - Architecture & Risk Management
- 6 required files (spec, plan, tasks, impl-summary, checklist, decision-record)
- 1 optional file (research.md)
- Executive Summary for stakeholders
- Risk Matrix for risk management
- Dependency Graph and Critical Path
- Architecture Decision Records
- Enhanced verification (arch review, performance, deployment)
-->
