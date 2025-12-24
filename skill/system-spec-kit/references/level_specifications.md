# Level Specifications - Complete Level 1-3 Requirements

> Complete specifications for all three documentation levels using the progressive enhancement model.

**Progressive Enhancement Model:**
```
Level 1 (Baseline):     spec.md + plan.md + tasks.md
                              ↓
Level 2 (Verification): Level 1 + checklist.md
                              ↓
Level 3 (Full):         Level 2 + decision-record.md + optional research-spike.md
```

**Key Points:**
- LOC thresholds are **SOFT GUIDANCE** (not enforcement)
- **Enforcement is MANUAL** - verify required templates exist before claiming completion
- When in doubt, choose higher level

**Note:** Single typo/whitespace fixes (<5 characters in one file) are exempt from spec folder requirements.

---

## 1. 🔵 LEVEL 1: BASELINE DOCUMENTATION (LOC guidance: <100)

### When to Use

- **All features start here** - this is the minimum documentation for any work
- Localized to one component or module
- Includes trivial changes (typos, single-line fixes)
- Clear, well-defined requirements
- Low to moderate complexity

### Required Files (Baseline)

- `spec.md` - Requirements and user stories (copy template from `templates/spec.md`)
- `plan.md` - Technical implementation plan (copy template from `templates/plan.md`)
- `tasks.md` - Task breakdown by user story (copy template from `templates/tasks.md`)

### Optional Files

- None (baseline is complete)

### Content Expectations

**spec.md required sections:**
- Problem statement or feature description
- Proposed solution
- Files to change
- Testing approach
- Success criteria

**plan.md required sections:**
- Implementation approach
- File changes breakdown
- Testing strategy
- Dependencies

**tasks.md required sections:**
- Task breakdown by user story
- Dependencies between tasks
- Estimated effort per task

**Enforcement:** Hard block if any required file missing

### Example Scenarios

**Good fits for Level 1:**
- Fix "Error" → "Eror" typo
- Update comment for clarity
- Add email validation to contact form
- Fix bug in calculation logic
- Add loading spinner to form submission
- Update error message formatting
- Add new API endpoint (simple CRUD)
- Refactor single component for clarity

**Escalate to Level 2 if:**
- Needs systematic QA validation
- Affects multiple systems (not localized)
- High risk (security, config cascades)
- LOC estimate increases to 100+

### Template Sources

- `.opencode/skill/system-spec-kit/templates/spec.md`
- `.opencode/skill/system-spec-kit/templates/plan.md`
- `.opencode/skill/system-spec-kit/templates/tasks.md`

### Template Adaptation

1. Fill metadata block (created date, status, level, estimated LOC)
2. Replace `[PROBLEM]` with clear problem statement
3. Replace `[SOLUTION]` with proposed approach
4. List specific files to modify
5. Define testing approach (unit tests, manual verification)
6. State clear success criteria
7. Fill plan.md with implementation steps
8. Fill tasks.md with task breakdown
9. Remove all sample content and placeholders

---

## 2. 🟡 LEVEL 2: VERIFICATION ADDED (LOC guidance: 100-499)

### When to Use

- Features needing systematic QA validation
- Multiple files or components affected
- Moderate complexity
- High risk areas (security, config cascades)
- Requires validation checklists

### Required Files (Level 1 + checklist)

- `spec.md` (from Level 1) - Requirements and user stories
- `plan.md` (from Level 1) - Technical implementation plan
- `tasks.md` (from Level 1) - Task breakdown by user story
- `checklist.md` (NEW at Level 2) - Validation/QA checklists

### Optional Files

- None

### Content Expectations

**All Level 1 content expectations PLUS:**

**checklist.md required sections:**
- Pre-implementation validation
- Per-task verification
- Integration testing steps
- Security review checklist (if applicable)
- Deployment verification

**Enforcement:** Hard block if `checklist.md` missing

### Example Scenarios

**Good fits for Level 2:**
- Create reusable modal component with animations
- Implement form validation framework
- Add authentication flow
- Migrate from library A to library B
- Build file upload feature with progress tracking
- Refactor state management approach
- Config changes affecting multiple systems
- Security-related changes

**Escalate to Level 3 if:**
- Requires architectural decisions to be documented
- Discover >500 LOC during implementation
- Complexity increases substantially
- Need multiple developers for coordination
- Architectural impact broader than anticipated

### Template Sources

- `.opencode/skill/system-spec-kit/templates/spec.md`
- `.opencode/skill/system-spec-kit/templates/plan.md`
- `.opencode/skill/system-spec-kit/templates/tasks.md`
- `.opencode/skill/system-spec-kit/templates/checklist.md`

### Template Adaptation

**All Level 1 adaptations PLUS:**

**checklist.md:**
1. Fill pre-implementation checks specific to feature
2. Add implementation validation steps
3. Define testing checklist items
4. Include deployment verification steps
5. Add security checks if applicable
6. Remove all sample content

### Level 2 Example: API Endpoint Feature

**Scenario:** Adding a new REST API endpoint (~200 LOC)

**Folder Structure:**
```
specs/012-user-profile-api/
├── spec.md          # Requirements and scope
├── plan.md          # Technical approach
├── tasks.md         # Implementation tasks
├── checklist.md     # Verification checklist
├── memory/          # Session context
└── scratch/         # Temporary files
```

**Checklist Example:**
```markdown
## Implementation Checklist

### P0 - Blockers
- [x] API endpoint responds to GET /users/:id [EVIDENCE: api.test.js:45-67]
- [x] Authentication middleware applied [EVIDENCE: routes/users.js:12]

### P1 - Required
- [x] Input validation implemented [EVIDENCE: validators/user.js]
- [x] Error responses follow API standard [EVIDENCE: manual test]

### P2 - Nice to Have
- [ ] Rate limiting (deferred to next sprint)
```

---

## 3. 🔴 LEVEL 3: FULL DOCUMENTATION (LOC guidance: ≥500)

### When to Use

- Complex features, architecture changes, major decisions
- High complexity
- Multiple systems or components involved
- Requires coordination across teams
- Significant architectural impact
- Major technical decisions need to be documented

### Required Files (Level 2 + decision-record)

- `spec.md` (from Level 2) - Requirements and user stories
- `plan.md` (from Level 2) - Technical implementation plan
- `tasks.md` (from Level 2) - Task breakdown by user story
- `checklist.md` (from Level 2) - Validation/QA checklists
- `decision-record.md` (NEW at Level 3) - Architecture Decision Records/ADRs

### Optional Files

- `research-spike.md` - Time-boxed research/PoC (prefix with topic)
- `research.md` - Comprehensive research documentation

### Content Expectations

**All Level 2 content expectations PLUS:**

**decision-record.md required sections:**
- Context and problem
- Options considered (2-4 typically)
- Decision made
- Rationale
- Consequences and trade-offs

**research-spike-[name].md (if used):**
- Research question
- Approach and experiments
- Findings and recommendations
- Decision (go/no-go)
- Time-boxed (1-3 days typically)

**Enforcement:** Hard block if `decision-record.md` missing

### Example Scenarios

**Good fits for Level 3:**
- Major feature implementation (user dashboard with analytics)
- System redesign (payment flow v2)
- Architecture changes (microservices migration)
- Multi-team projects (integration with external systems)
- New product vertical (marketplace feature)
- Performance overhaul (real-time collaboration)
- Database or framework choices
- Major refactoring approaches

### Template Sources

- `.opencode/skill/system-spec-kit/templates/spec.md`
- `.opencode/skill/system-spec-kit/templates/plan.md`
- `.opencode/skill/system-spec-kit/templates/tasks.md`
- `.opencode/skill/system-spec-kit/templates/checklist.md`
- `.opencode/skill/system-spec-kit/templates/decision-record.md`
- `.opencode/skill/system-spec-kit/templates/research-spike.md` (optional)
- `.opencode/skill/system-spec-kit/templates/research.md` (optional)

### Template Adaptation

**All Level 2 adaptations PLUS:**

**decision-record-[topic].md:**
1. Document context and problem clearly
2. Present 2-4 viable options (not every possible choice)
3. Fair comparison (pros/cons for each)
4. State clear decision with rationale
5. Document trade-offs honestly
6. Note what was sacrificed for chosen path
7. Use descriptive filename (e.g., `decision-record-database-choice.md`)
8. Remove all sample content

**research-spike-[topic].md (if used):**
1. State clear research question upfront
2. Document approach and experiments
3. Provide data-driven findings (not opinions)
4. Make clear recommendation with rationale
5. Time-box appropriately (don't let spike become implementation)
6. Use descriptive filename
7. Remove all sample content

---

## 4. 🔄 LEVEL MIGRATION

### When Scope Grows During Implementation

If you discover mid-work that scope is larger than anticipated, escalate by adding the required files:

| From  | To                         | Action                                                | Files to Add |
| ----- | -------------------------- | ----------------------------------------------------- | ------------ |
| 1 → 2 | Add verification           | `checklist.md`                                        |
| 2 → 3 | Add decision documentation | `decision-record.md` (+ optional `research-spike.md`) |

**Changelog example:**

```markdown
## Change Log
- 2025-11-15: Created as Level 1 (simple feature) - spec.md, plan.md, tasks.md
- 2025-11-16: Escalated to Level 2 (discovered validation needs) - added checklist.md
- 2025-11-17: Escalated to Level 3 (architectural decision required) - added decision-record.md
```

**Rules:**
- Keep existing documentation (progressive enhancement - don't delete lower-level files)
- Update `level:` field in metadata
- Document reason for escalation
- Inform user of level change and implications

### When to Stay at Current Level

**Don't escalate unnecessarily:**
- Minor scope increase (50 → 95 LOC still Level 1)
- Complexity didn't actually increase (just took longer than expected)
- One additional file doesn't change coordination needs

**Stability preferred:**
- Once started, try to stay at chosen level
- Only escalate if genuinely needed
- Inform user before escalating

---

## 5. 📌 STATUS FIELD CONVENTION

Every spec.md should include a status field to track lifecycle:

```yaml
---
title: Feature Name
created: 2025-11-15
status: active  # ← Add this field
level: 2
---
```

### Valid Status Values

| Status     | Meaning                 | When to Use                        | Reuse Priority              |
| ---------- | ----------------------- | ---------------------------------- | --------------------------- |
| `draft`    | Planning phase          | Initial spec creation, not started | 2 (can start)               |
| `active`   | Work in progress        | Currently implementing             | 1 (highest - continue here) |
| `paused`   | Temporarily on hold     | Blocked or deprioritized           | 3 (can resume)              |
| `complete` | Implementation finished | Feature deployed and stable        | 4 (avoid reopening)         |
| `archived` | Historical record       | Deprecated or superseded           | 5 (do not reuse)            |

### Status Lifecycle

```
draft → active → complete → archived
   ↓       ↓
paused  paused
   ↓
active (resume)
```

**Update status as work progresses:**
- Create spec → `draft`
- Start implementation → `active`
- Blocked/paused → `paused`
- Deployment complete → `complete`
- Feature deprecated → `archived`

---

## 6. 🔀 RELATED SPECS: UPDATE VS CREATE

### When to UPDATE Existing Spec

Update an existing spec folder when:

✅ **Iterative development** - Continuing work on same feature across sessions
- Example: Initial implementation → bug fixes → enhancements

✅ **Bug fixes** - Fixing issues in existing implementation
- Example: "Fix alignment bug in markdown-c7-optimizer" → Update markdown-c7-optimizer spec

✅ **Scope escalation** - Work grows beyond original estimate
- Example: Level 1 bug fix → Requires Level 2 refactor → Add plan.md to same folder

✅ **Feature enhancement** - Adding to existing functionality
- Example: "Add dark mode to modal" → Update modal-component spec

✅ **Resuming paused work** - Continuing previously paused implementation
- Example: Spec status: paused → active (add continuation notes)

### When to CREATE New Spec

Create a new spec folder when:

❌ **Distinct feature** - Completely separate functionality
- Example: "markdown-c7-optimizer" ≠ "markdown-validator" (different purposes)

❌ **Different approach** - Alternative implementation strategy
- Example: "hero-animation-css" vs "hero-animation-js" (different approaches)

❌ **Separate user story** - Different requirement or use case
- Example: "user-authentication" ≠ "user-profile" (separate stories)

❌ **Complete redesign** - Starting over with new architecture
- Example: "payment-flow-v2" (complete rewrite of v1)

❌ **Unrelated work** - No connection to existing specs
- Example: "add-search-feature" ≠ "fix-form-validation" (different areas)

### Decision Flowchart

```
User requests modification
    ↓
Extract keywords from request
    ↓
Search existing specs (folder names, titles)
    ↓
    ├─→ No matches found
    │      ↓
    │   Create new spec folder
    │
    └─→ Related specs found
           ↓
        Check status field
           ↓
           ├─→ status: active or draft
           │      ↓
           │   Recommend: UPDATE existing spec
           │   Reason: Work in progress, maintain continuity
           │
           ├─→ status: paused
           │      ↓
           │   ASK user: Resume paused work or create new?
           │   Reason: Context exists, but was stopped intentionally
           │
           └─→ status: complete or archived
                  ↓
               ASK user: Reopen completed work or create new?
               Reason: Feature was finished, ensure not regression
```

---

## 7. 🔗 RELATED RESOURCES

### Reference Files
- [quick_reference.md](./quick_reference.md) - Commands, checklists, and troubleshooting
- [template_guide.md](./template_guide.md) - Template selection, adaptation, and quality standards
- [path_scoped_rules.md](./path_scoped_rules.md) - Future path-based validation (design document)

### Templates
- [spec.md](../templates/spec.md) - Requirements and user stories template
- [plan.md](../templates/plan.md) - Technical implementation plan template
- [tasks.md](../templates/tasks.md) - Task breakdown template
- [checklist.md](../templates/checklist.md) - Validation checklist template (Level 2+)
- [decision-record.md](../templates/decision-record.md) - Architecture Decision Records template (Level 3)
- [research-spike.md](../templates/research-spike.md) - Time-boxed research template (Level 3 optional)
- [research.md](../templates/research.md) - Comprehensive research template (Level 3 optional)

### Related Skills
- `workflows-code` - Implementation, debugging, and verification lifecycle
- `system-memory` - Context preservation with semantic memory
- `workflows-git` - Git workspace setup and clean commits