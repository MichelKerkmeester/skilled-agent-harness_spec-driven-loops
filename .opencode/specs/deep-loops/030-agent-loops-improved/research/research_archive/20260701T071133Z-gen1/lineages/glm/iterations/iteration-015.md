# Iteration 015: 008 Parent Template-Default Scaffolds (P1-006 Confirmed Live)

## Focus
- Scope: 008-loop-systems-remediation parent tasks.md and implementation-summary.md — still template defaults
- Question: Is the P1-006 "parent scaffold drift" finding still live?

## Findings

### F-015: 008 parent tasks.md and implementation-summary.md are pure unmodified templates despite Complete status

**Severity: High (P1-006 confirmed still live)**

The 008 parent spec.md has been partially remediated (it now has real Phase Context, Problem, Purpose, and Scope content at lines 40-80), but its **tasks.md and implementation-summary.md remain pure templates**:

**tasks.md — 100% template default:**
```
## Phase 1: Setup
- [ ] T001 Create project structure
- [ ] T002 Install dependencies
- [ ] T003 [P] Configure development tools

## Phase 2: Implementation
- [ ] T004 [Implement core feature 1]
- [ ] T005 [Implement core feature 2]
...

## Phase 3: Verification
- [ ] T008 Test happy path manually
- [ ] T009 Test edge cases
```

ALL 10 tasks are unchecked `[ ]`. Zero tasks are customized for remediation work. The content is the verbatim Level-1 tasks template.

[SOURCE: `008-loop-systems-remediation/tasks.md:50-86`]

**implementation-summary.md — 100% template default:**
```yaml
last_updated_by: "template-author"
recent_action: "Initialize continuity block"
next_safe_action: "Replace template defaults on first save"
completion_pct: 0
```

The "What Was Built" section contains voice-guide comments and placeholder text:
```
[Opening hook: 2-3 sentences on what changed and why it matters. Lead with impact.]
### [Feature Name]
[What this feature does and why it exists.]
```

[SOURCE: `008-loop-systems-remediation/implementation-summary.md:15-24,59-72`]

**Contradiction:**
- 008 spec.md: `completion_pct: 100`, `Status: Complete (children 001-006 shipped)`
- 008 implementation-summary.md: `completion_pct: 0`, `next_safe_action: "Replace template defaults on first save"`
- 008 tasks.md: all `[ ]` unchecked

[SOURCE: `008-loop-systems-remediation/spec.md:27,42` vs `implementation-summary.md:24` vs `tasks.md:50-86`]

**P1-006 verdict:** The GLM review's P1-006 finding ("009 remediation parent marked complete while parent docs contain scaffolds") is **STILL LIVE**. While the parent spec.md was partially remediated, the tasks.md and implementation-summary.md were never touched. The finding's `status: "?"` in the registry is accurate — it was never resolved.

**Root cause:** The remediation of P1-006 updated spec.md but did not cascade to tasks.md and implementation-summary.md. There is no workflow step that finalizes ALL parent docs when a phase is marked complete.

**Recommendation:**
1. **Immediate:** Write real task content into `008/tasks.md` from the 7 child phase specs, and write a real implementation summary into `008/implementation-summary.md` from the child implementation summaries
2. **Workflow fix:** `speckit:complete` should check that ALL sibling docs (spec.md, plan.md, tasks.md, implementation-summary.md) have been customized away from template defaults before allowing Complete status
3. **Template detection:** Add a validate.sh check that scans for template markers (`[Opening hook:`, `[Implement core feature`, `T001 Create project structure`) in any doc under a Complete-status folder

## Novelty Justification
Confirmed P1-006 is still live with fresh evidence (specific template lines quoted). New finding: the parent spec.md was partially remediated (has real content) but tasks.md/implementation-summary.md were missed — the remediation was incomplete, not absent. This is a refinement of P1-006 that narrows the scope to 2 of 4 parent docs.

## What Was Tried and Failed
- Checked if the spec.md was also a template (it was not — it has real Phase Context content)

## Ruled-Out Directions
- The templates are NOT acceptable under Complete status (Iron Law + REQ-002 require children to reach Complete, and the parent should too)
