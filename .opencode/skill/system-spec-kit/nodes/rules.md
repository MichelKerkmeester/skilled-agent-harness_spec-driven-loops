---
description: "Mandatory rules (ALWAYS, NEVER, ESCALATE) for using the system-spec-kit workflow."
---
# System-Spec-Kit Rules

### ✅ ALWAYS

1. **Determine level (1/2/3/3+) before ANY file changes** - Count LOC, assess complexity/risk
2. **Copy templates from `templates/level_N/`** - Use level folders, NEVER create from scratch
3. **Fill ALL placeholders** - Remove placeholder markers and sample content
4. **Ask A/B/C/D/E when file modification detected** - Present options, wait for selection
5. **Check for related specs before creating new folders** - Search keywords, review status
6. **Get explicit user approval before changes** - Show level, path, templates, approach
7. **Use consistent folder naming** - `specs/###-short-name/` format
8. **Use checklist.md to verify (Level 2+)** - Load before claiming done
9. **Mark items `[x]` with evidence** - Include links, test outputs, screenshots
10. **Complete P0/P1 before claiming done** - No exceptions
11. **Suggest handover.md on session-end keywords** - "continue later", "next session"
12. **Run validate.sh before completion** - Completion Verification requirement
13. **Create implementation-summary.md at end of implementation phase (Level 1+)** - Document what was built
14. **Suggest /spec_kit:handover when session-end keywords detected OR after extended work (15+ tool calls)** - Proactive context preservation
15. **Suggest /spec_kit:debug after 3+ failed fix attempts on same error** - Do not continue without offering debug delegation
16. **Suggest /spec_kit:phase when task requires multi-phase decomposition** - Complex specs spanning multiple sessions or workstreams
17. **Route all code creation/updates through `sk-code--opencode`** - Full alignment is mandatory before claiming completion
18. **Route all documentation creation/updates through `sk-documentation`** - Full alignment is mandatory before claiming completion

### ❌ NEVER

1. **Create documentation from scratch** - Use templates only
2. **Skip spec folder creation** - Unless user explicitly selects D
3. **Make changes before spec + approval** - Spec folder is prerequisite
4. **Leave placeholders in final docs** - All must be replaced
5. **Decide autonomously update vs create** - Always ask user
6. **Claim done without checklist verification** - Level 2+ requirement
7. **Proceed without spec folder confirmation** - Wait for A/B/C/D/E
8. **Skip validation before completion** - Completion Verification hard block

### ⚠️ ESCALATE IF

1. **Scope grows during implementation** - Run `upgrade-level.sh` to add higher-level templates (recommended), then auto-populate all placeholder content:
   - Read all existing spec files (spec.md, plan.md, tasks.md, implementation-summary.md) for context
   - Replace every placeholder marker pattern in newly injected sections with content derived from that context
   - For sections without sufficient source context, write "N/A — insufficient source context" instead of fabricating content
   - Run `check-placeholders.sh <spec-folder>` to verify zero placeholders remain (see [level_specifications.md](../references/templates/level_specifications.md) for the full procedure)
   - Document the level change in changelog
2. **Uncertainty about level <80%** - Present level options to user, default to higher
3. **Template doesn't fit requirements** - Adapt closest template, document modifications
4. **User requests skip (Option D)** - Warn about tech debt, explain debugging challenges, confirm consent
5. **Validation fails with errors** - Report specific failures, provide fix guidance, re-run after fixes