# Three-Tier Boundary System

GoopSpec enforces a three-tier boundary system to control agent behavior. These boundaries are defined in the project configuration and respected by all agents.

## Tiers

### Tier 1: Always

Actions the agent MUST perform without asking. These are non-negotiable quality gates.

**Default Always Actions:**
- Run tests before committing
- Run linter before committing
- Update ADL.md when making architectural decisions
- Follow code style conventions
- Commit atomically after each task
- Run audit after execution phase
- Confirm outcomes with user before planning next phase

**Configuration:**
```json
{
  "boundaries": {
    "always": [
      "run_tests_before_commit",
      "update_adl_on_decisions",
      "follow_conventions",
      "atomic_commits"
    ]
  }
}
```

### Tier 2: Ask First

Actions that require user confirmation before proceeding. These have significant impact and deserve human review.

**Default Ask First Actions:**
- Database schema changes
- Adding new dependencies
- Changing authentication mechanisms
- Modifying CI/CD configuration
- Deleting files
- Changes to production configuration
- External service integrations

**Configuration:**
```json
{
  "boundaries": {
    "ask_first": [
      "schema_changes",
      "new_dependencies",
      "auth_changes",
      "delete_files",
      "production_config"
    ]
  }
}
```

### Tier 3: Never

Actions the agent is PROHIBITED from performing. These are hard stops.

**Default Never Actions:**
- Commit secrets or credentials
- Ignore test failures
- Modify files outside spec scope (in strict mode)
- Push to protected branches without PR
- Delete production data
- Disable security features
- Skip code review for critical changes

**Configuration:**
```json
{
  "boundaries": {
    "never": [
      "commit_secrets",
      "ignore_test_failures",
      "modify_outside_scope",
      "push_to_protected",
      "delete_production_data"
    ]
  }
}
```

## Enforcement

### Spec Enforcer Hook

The `spec-enforcer` hook monitors `write` and `edit` tool calls:
- Checks if target file is in spec scope
- Warns or blocks based on `strict_mode` setting
- Logs violations for audit

### Stop Enforcer Hook

The `stop-enforcer` hook prevents premature exits:
- Blocks stop if incomplete todos remain
- Requires all "Always" checks to pass
- Enforces commit before stop if files modified

### Permission Hook

The `permission.ask` hook intercepts permission requests:
- Auto-allows "Always" actions
- Prompts user for "Ask First" actions
- Denies "Never" actions with explanation

## Custom Boundaries

Projects can customize boundaries in `.goopspec/config.json`:

```json
{
  "boundaries": {
    "always": [
      "run_tests_before_commit",
      "update_changelog"
    ],
    "ask_first": [
      "modify_api_contracts",
      "change_error_codes"
    ],
    "never": [
      "use_deprecated_apis",
      "hardcode_credentials"
    ]
  }
}
```

## Best Practices

1. **Start conservative:** Begin with strict boundaries, relax as trust builds.
2. **Document exceptions:** If bypassing a boundary, log to ADL with rationale.
3. **Review regularly:** Audit boundary violations to refine rules.
4. **Team alignment:** Ensure all team members understand the boundaries.
