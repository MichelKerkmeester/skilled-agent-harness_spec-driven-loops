# Agent Patterns

Common patterns for GoopSpec agent behavior and orchestration.

## Sub-Agent Orchestration

### Thin Orchestrator Pattern
The main orchestrator (goop-orchestrator) spawns specialized sub-agents for specific tasks, keeping its own context window clean.

```
Orchestrator Context: ~15% usage
├── Spawn Planner → Plan created → Return
├── Spawn Executor → Tasks done → Return  
├── Spawn Verifier → Verification done → Return
└── Orchestrator aggregates results
```

### Fresh Context Per Agent
Each sub-agent gets a fresh 200K context window:
- Prevents context contamination
- Maintains peak output quality
- Allows parallel execution
- Enables longer task sequences

### Context Handoff Protocol
When spawning sub-agents, provide:
1. **Complete context** - All files needed for the task
2. **Explicit instructions** - What to do, how to verify
3. **Success criteria** - How to know it's done
4. **Return format** - Expected output structure

## Dispatch Routing

### Parallel Dispatch
Use when ALL conditions met:
- 3+ unrelated tasks or independent domains
- No shared state between tasks
- Clear file boundaries with no overlap

Example:
```typescript
// Parallel - different domains, no overlap
Spawn Frontend Agent: React components
Spawn Backend Agent: API routes  
Spawn Database Agent: Schema changes
```

### Sequential Dispatch
Use when ANY condition true:
- Tasks have dependencies (B needs output from A)
- Shared files or state (merge conflict risk)
- Unclear scope (need to understand before proceeding)

Example:
```typescript
// Sequential - dependencies exist
1. Schema → 2. API → 3. Frontend
(Task 2 needs types from Task 1)
```

### Background Dispatch
Use for:
- Research or analysis tasks
- Results aren't blocking current work
- Long-running documentation generation

Example:
```typescript
// Background - non-blocking
Spawn Background Agent: Research Context7 docs
Continue main work...
Receive results when complete
```

## Deviation Handling

### The 4 Deviation Rules

**Rule 1: Auto-fix bugs**
- Wrong logic, type errors, infinite loops
- Security vulnerabilities (SQL injection, XSS)
- Broken validation, race conditions
- Memory/resource leaks

**Rule 2: Auto-add missing critical functionality**
- Error handling (try-catch, promise rejection)
- Input validation and sanitization
- Null/undefined checks
- Authentication/authorization checks
- Rate limiting

**Rule 3: Auto-fix blocking issues**
- Missing dependencies
- Broken import paths
- Missing environment variables
- Config errors
- Circular dependencies

**Rule 4: Ask about architectural changes**
- New database tables (not just columns)
- Schema changes (primary keys, table splits)
- Framework/library switches
- New infrastructure (queues, caches)
- Breaking API changes

### Deviation Documentation
All deviations must be documented:
```markdown
## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed email validation regex**
- **Found during:** Task 3 (User registration)
- **Issue:** Regex didn't accept plus-addressing
- **Fix:** Updated pattern to accept + in local part
- **Files modified:** src/validation/email.ts
- **Verification:** Tests pass for user+tag@domain.com
```

## Checkpoint Patterns

### Verification Checkpoint
Used after building something testable:
```
╔══════════════════════════════════════════════════════════════╗
║  CHECKPOINT: Verification Required                           ║
╚══════════════════════════════════════════════════════════════╝

Progress: 3/8 tasks
Task: Verify user authentication

Built: Login form with email/password validation

How to verify:
  1. Visit http://localhost:3000/login
  2. Try valid credentials → should redirect to /dashboard
  3. Try invalid credentials → should show error
  4. Check form validation on blur

──────────────────────────────────────────────────────────────
→ Type "approved" or describe issues
──────────────────────────────────────────────────────────────
```

### Decision Checkpoint
Used when architectural choice needed:
```
╔══════════════════════════════════════════════════════════════╗
║  CHECKPOINT: Decision Required                               ║
╚══════════════════════════════════════════════════════════════╝

Decision needed: Database for user sessions

Options:
1. PostgreSQL (existing)
   Pros: Consistency, existing infra
   Cons: Harder to scale reads

2. Redis (new)
   Pros: Fast, TTL support
   Cons: New dependency, eventual consistency

──────────────────────────────────────────────────────────────
→ Select: postgres or redis
──────────────────────────────────────────────────────────────
```

### Action Checkpoint
Used for manual steps (rare):
```
╔══════════════════════════════════════════════════════════════╗
║  CHECKPOINT: Action Required                                 ║
╚══════════════════════════════════════════════════════════════╝

I automated: Created webhook endpoint code

Need your help with: Stripe Dashboard configuration

Instructions:
  1. Visit Stripe Dashboard → Developers → Webhooks
  2. Add endpoint: https://your-domain.com/api/webhooks/stripe
  3. Select events: checkout.session.completed

I'll verify after: Webhook appears in Stripe Dashboard

──────────────────────────────────────────────────────────────
→ Type "done" when complete
──────────────────────────────────────────────────────────────
```

## Task Breakdown Patterns

### Vertical Slices (Preferred)
Group by feature, not by layer:
```
Plan 01: User Feature
├── User model
├── User API  
├── User UI
└── User tests

Plan 02: Product Feature
├── Product model
├── Product API
├── Product UI
└── Product tests
```

### Horizontal Layers (Avoid)
Don't group by technical layer:
```
AVOID:
Plan 01: All Models
Plan 02: All APIs
Plan 03: All UIs
```

### Plan Sizing
- 2-4 tasks per plan
- ~50% context usage for standard plans
- ~40% context usage for TDD plans
- Complex work → multiple focused plans

## TDD Pattern

### RED-GREEN-REFACTOR Cycle
```
RED (Write failing test):
  1. Create test describing expected behavior
  2. Run test - must fail
  3. Commit: test(phase-plan): add failing test for X

GREEN (Implement to pass):
  1. Write minimal code to make test pass
  2. Run test - must pass
  3. Commit: feat(phase-plan): implement X

REFACTOR (if needed):
  1. Clean up implementation
  2. Run tests - must still pass
  3. Commit: refactor(phase-plan): clean up X
```

## Commit Patterns

### Atomic Commits
One commit per task, clearly scoped:
```bash
# Task 1
git add src/models/user.ts
git commit -m "feat(01-01): create User model

- Add User interface with id, email, name
- Add validation methods
- Export from models/index.ts"

# Task 2  
git add src/api/users.ts
git commit -m "feat(01-01): create user API endpoints

- GET /users - list all users
- GET /users/:id - get single user
- POST /users - create user
- Add authentication middleware"
```

### Conventional Commit Format
```
type(scope): subject

body (optional)
```

Types:
- `feat` - New feature
- `fix` - Bug fix
- `test` - Test-only changes
- `refactor` - Code cleanup
- `docs` - Documentation
- `perf` - Performance improvement
- `chore` - Config/tooling

## Skills Integration

### Skill Loading Levels

**Level 1: Metadata (Always)**
- Load skill name, description, triggers
- Low token cost
- Used for skill discovery

**Level 2: Instructions (On Use)**
- Load full skill instructions when triggered
- Applied to system prompt
- Enables specialized behavior

**Level 3: Resources (On Demand)**
- Load large resources (docs, examples) only when referenced
- Prevents context bloat
- Progressive disclosure

### Skill Composition
Skills can require other skills:
```yaml
---
name: security-audit
requires:
  - owasp-checklist
  - vulnerability-database
---
```

## Error Recovery

### Context Overflow Recovery
When context usage > 70%:
1. Save current state to checkpoint
2. Summarize completed work
3. Return to orchestrator
4. Spawn fresh agent with summary

### Failed Task Recovery
When task verification fails:
1. Analyze failure cause
2. Attempt auto-fix (Rules 1-3)
3. If unfixable, create checkpoint for user
4. Document in SUMMARY.md

### Agent Timeout Recovery
When agent doesn't complete:
1. Check if checkpoint saved
2. Resume from checkpoint if available
3. Otherwise, restart with reduced scope
