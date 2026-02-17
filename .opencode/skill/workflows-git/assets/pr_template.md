---
title: Pull Request Template
description: Templates and examples for creating professional pull requests with clear summaries and test plans.
---

# Pull Request Template - PR Description Standard

Templates for creating professional pull requests following best practices.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

This asset provides structured templates for pull request descriptions. Use it when creating PRs to ensure consistent, comprehensive documentation of changes.

### Usage

1. Choose the appropriate template section based on your PR type (feature, bug fix, refactor, or docs)
2. Copy the template structure
3. Fill in the relevant sections
4. Follow the guidelines for summary, test plan, and related issues

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:basic-structure -->
## 2. BASIC STRUCTURE

```markdown
<!-- /ANCHOR:basic-structure -->
<!-- ANCHOR:summary -->
## Summary
<2-3 bullet points describing the changes>

<!-- /ANCHOR:summary -->
<!-- ANCHOR:test-plan -->
## Test Plan
- [ ] <verification step 1>
- [ ] <verification step 2>
- [ ] All tests pass

<!-- /ANCHOR:test-plan -->
<!-- ANCHOR:related-issues -->
## Related Issues
<Issue references>
```

---

<!-- /ANCHOR:related-issues -->
<!-- ANCHOR:complete-pr-template -->
## 3. COMPLETE PR TEMPLATE

```markdown
<!-- /ANCHOR:complete-pr-template -->
<!-- ANCHOR:summary-2 -->
## Summary

- <Brief description of change 1>
- <Brief description of change 2>
- <Brief description of change 3>

<!-- /ANCHOR:summary-2 -->
<!-- ANCHOR:motivation -->
## Motivation

<Why this change is needed - optional but recommended>

<!-- /ANCHOR:motivation -->
<!-- ANCHOR:test-plan-2 -->
## Test Plan

### Manual Testing
- [ ] <Specific user flow tested>
- [ ] <Edge case verified>
- [ ] <Cross-browser/cross-platform testing>

### Automated Testing
- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] No console errors

<!-- /ANCHOR:test-plan-2 -->
<!-- ANCHOR:screenshots-videos -->
## Screenshots/Videos

<If applicable, add visual evidence of changes>

<!-- /ANCHOR:screenshots-videos -->
<!-- ANCHOR:breaking-changes -->
## Breaking Changes

<If applicable, describe breaking changes and migration path>

<!-- /ANCHOR:breaking-changes -->
<!-- ANCHOR:related-issues-2 -->
## Related Issues

Closes #<issue-number>
Related to #<issue-number>

<!-- /ANCHOR:related-issues-2 -->
<!-- ANCHOR:additional-context -->
## Additional Context

<Any other relevant information>
```

---

<!-- /ANCHOR:additional-context -->
<!-- ANCHOR:example-feature-pr -->
## 4. EXAMPLE: FEATURE PR

```markdown
<!-- /ANCHOR:example-feature-pr -->
<!-- ANCHOR:summary-3 -->
## Summary

- Implements OAuth2 authentication flow with JWT tokens
- Adds login/logout endpoints
- Includes user session management

<!-- /ANCHOR:summary-3 -->
<!-- ANCHOR:motivation-2 -->
## Motivation

Replaces basic authentication to improve security and enable
SSO integration. Current basic auth is vulnerable to brute-force
attacks and doesn't support modern authentication patterns.

<!-- /ANCHOR:motivation-2 -->
<!-- ANCHOR:test-plan-3 -->
## Test Plan

### Manual Testing
- [x] Users can log in with email/password
- [x] Invalid credentials show appropriate error
- [x] JWT token persists across page refreshes
- [x] Logout clears session properly
- [x] Tested in Chrome, Firefox, Safari

### Automated Testing
- [x] 152 unit tests pass
- [x] 23 integration tests pass
- [x] Authentication flow tests added
- [x] No console errors

<!-- /ANCHOR:test-plan-3 -->
<!-- ANCHOR:screenshots -->
## Screenshots

![Login screen](./screenshots/login.png)
![Dashboard after login](./screenshots/dashboard.png)

<!-- /ANCHOR:screenshots -->
<!-- ANCHOR:security-considerations -->
## Security Considerations

- Tokens expire after 24 hours
- Refresh tokens implemented with rotation
- CSRF protection enabled
- Rate limiting on login endpoint

<!-- /ANCHOR:security-considerations -->
<!-- ANCHOR:related-issues-3 -->
## Related Issues

Closes #234
Related to #235 (SSO integration - follow-up)

<!-- /ANCHOR:related-issues-3 -->
<!-- ANCHOR:deployment-notes -->
## Deployment Notes

- Requires `JWT_SECRET` environment variable
- Database migration needed for user_sessions table
```

---

<!-- /ANCHOR:deployment-notes -->
<!-- ANCHOR:example-bug-fix-pr -->
## 5. EXAMPLE: BUG FIX PR

```markdown
<!-- /ANCHOR:example-bug-fix-pr -->
<!-- ANCHOR:summary-4 -->
## Summary

- Fixes memory leak in data processing pipeline
- Adds proper cleanup for event listeners
- Implements connection pooling limits

<!-- /ANCHOR:summary-4 -->
<!-- ANCHOR:problem -->
## Problem

Large datasets were causing memory usage to grow unbounded.
Application would crash after processing ~10k records due to
unclosed database connections and lingering event listeners.

<!-- /ANCHOR:problem -->
<!-- ANCHOR:solution -->
## Solution

- Implemented connection pooling with max 20 concurrent connections
- Added cleanup in `finally` blocks to ensure resources are released
- Removed event listeners after processing complete

<!-- /ANCHOR:solution -->
<!-- ANCHOR:test-plan-4 -->
## Test Plan

### Manual Testing
- [x] Processed 50k records without memory growth
- [x] Monitored memory usage with Chrome DevTools
- [x] Verified connections are properly closed

### Automated Testing
- [x] All existing tests pass
- [x] Added memory leak regression test
- [x] Load testing with 100k records passes

<!-- /ANCHOR:test-plan-4 -->
<!-- ANCHOR:before-after -->
## Before/After

**Before**: Memory grows to 2GB after 10k records
**After**: Memory stable at 150MB for 50k+ records

<!-- /ANCHOR:before-after -->
<!-- ANCHOR:related-issues-4 -->
## Related Issues

Fixes #345
Fixes #346 (duplicate of same issue)
```

---

<!-- /ANCHOR:related-issues-4 -->
<!-- ANCHOR:example-refactoring-pr -->
## 6. EXAMPLE: REFACTORING PR

```markdown
<!-- /ANCHOR:example-refactoring-pr -->
<!-- ANCHOR:summary-5 -->
## Summary

- Extracts validation logic to reusable middleware
- Consolidates duplicate code across 5 route handlers
- Improves testability and maintainability

<!-- /ANCHOR:summary-5 -->
<!-- ANCHOR:motivation-3 -->
## Motivation

Validation logic was duplicated across multiple route handlers,
making it hard to maintain and test. Each endpoint had slightly
different validation patterns, leading to inconsistencies.

<!-- /ANCHOR:motivation-3 -->
<!-- ANCHOR:changes -->
## Changes

- Created `ValidationMiddleware` class
- Migrated 5 route handlers to use middleware
- Removed 200+ lines of duplicate code
- Added comprehensive middleware tests

<!-- /ANCHOR:changes -->
<!-- ANCHOR:test-plan-5 -->
## Test Plan

### Functional Testing
- [x] All API endpoints still validate correctly
- [x] Error messages unchanged (backward compatible)
- [x] Edge cases still handled properly

### Automated Testing
- [x] All 147 existing tests pass
- [x] 32 new middleware tests added
- [x] Code coverage increased from 78% to 85%

<!-- /ANCHOR:test-plan-5 -->
<!-- ANCHOR:non-functional-improvements -->
## Non-Functional Improvements

- **Maintainability**: Validation logic now in one place
- **Testability**: Middleware can be tested independently
- **Consistency**: All endpoints use same validation pattern
- **Performance**: No degradation (benchmarked)

<!-- /ANCHOR:non-functional-improvements -->
<!-- ANCHOR:related-issues-5 -->
## Related Issues

Closes #123

<!-- /ANCHOR:related-issues-5 -->
<!-- ANCHOR:migration-guide -->
## Migration Guide

No external API changes. Internal developers should use
`ValidationMiddleware.validate()` for new endpoints.
```

---

<!-- /ANCHOR:migration-guide -->
<!-- ANCHOR:example-documentation-pr -->
## 7. EXAMPLE: DOCUMENTATION PR

```markdown
<!-- /ANCHOR:example-documentation-pr -->
<!-- ANCHOR:summary-6 -->
## Summary

- Updates API reference with authentication endpoints
- Adds OAuth2 flow documentation
- Includes code examples for common use cases

<!-- /ANCHOR:summary-6 -->
<!-- ANCHOR:documentation-added -->
## Documentation Added

- Authentication overview
- OAuth2 flow diagram
- Token refresh guide
- Error handling examples
- Rate limiting documentation

<!-- /ANCHOR:documentation-added -->
<!-- ANCHOR:test-plan-6 -->
## Test Plan

- [x] All code examples tested and verified
- [x] Links checked (no broken links)
- [x] Reviewed for clarity and completeness
- [x] Spell-checked

<!-- /ANCHOR:test-plan-6 -->
<!-- ANCHOR:preview -->
## Preview

Documentation preview available at: [link to preview deployment]

<!-- /ANCHOR:preview -->
<!-- ANCHOR:related-issues-6 -->
## Related Issues

Closes #456
Related to #234 (OAuth2 feature PR)
```

---

<!-- /ANCHOR:related-issues-6 -->
<!-- ANCHOR:pr-title-guidelines -->
## 8. PR TITLE GUIDELINES

**Format**: Follow Conventional Commits

```
<type>(<scope>): <description>
```

**Examples**:
```
feat(auth): add OAuth2 authentication system
fix(api): resolve memory leak in data processing
refactor(validation): extract validation to middleware
docs: update API reference with authentication guide
chore(deps): update axios to v1.6.0
```

---

<!-- /ANCHOR:pr-title-guidelines -->
<!-- ANCHOR:summary-section-guidelines -->
## 9. SUMMARY SECTION GUIDELINES

**DO**:
- Use bullet points for clarity
- Keep each point concise (one line)
- Focus on **what** changed
- List 2-5 key changes

**DON'T**:
- Write paragraphs in summary
- Include implementation details
- List every file changed
- Be vague ("updated stuff")

**Example - Good**:
```markdown
<!-- /ANCHOR:summary-section-guidelines -->
<!-- ANCHOR:summary-7 -->
## Summary

- Implements real-time notifications using WebSocket
- Adds notification badge with unread count
- Includes mark-as-read functionality
```

**Example - Bad**:
```markdown
<!-- /ANCHOR:summary-7 -->
<!-- ANCHOR:summary-8 -->
## Summary

Updated the notification system. Made some changes to the
backend and frontend. Added WebSocket stuff.
```

---

<!-- /ANCHOR:summary-8 -->
<!-- ANCHOR:test-plan-guidelines -->
## 10. TEST PLAN GUIDELINES

**Structure**:
- Separate manual and automated testing
- Use checkboxes for verification steps
- Be specific about what was tested

**Manual Testing** should include:
- Key user flows tested
- Edge cases verified
- Cross-browser/cross-platform testing
- Visual/UI verification (if applicable)

**Automated Testing** should include:
- Unit test status
- Integration test status
- E2E test status (if applicable)
- Console errors check

**Example**:
```markdown
<!-- /ANCHOR:test-plan-guidelines -->
<!-- ANCHOR:test-plan-7 -->
## Test Plan

### Manual Testing
- [x] User can create new notification
- [x] Notification badge updates in real-time
- [x] Mark-as-read updates notification count
- [x] Tested in Chrome, Firefox, Safari
- [x] Mobile responsive (375px, 768px)

### Automated Testing
- [x] 45 new unit tests pass
- [x] All 234 existing tests pass
- [x] WebSocket connection tests added
- [x] No console errors or warnings
```

---

<!-- /ANCHOR:test-plan-7 -->
<!-- ANCHOR:screenshots-videos-guidelines -->
## 11. SCREENSHOTS/VIDEOS GUIDELINES

**When to include**:
- UI changes
- Visual bugs fixed
- New features with UI
- Complex workflows

**How to include**:
```markdown
<!-- /ANCHOR:screenshots-videos-guidelines -->
<!-- ANCHOR:screenshots-2 -->
## Screenshots

### Before
![Before fix](./screenshots/before.png)

### After
![After fix](./screenshots/after.png)

### Mobile View
![Mobile layout](./screenshots/mobile.png)
```

**Video example**:
```markdown
<!-- /ANCHOR:screenshots-2 -->
<!-- ANCHOR:demo-video -->
## Demo Video

[Watch demo](https://example.com/demo.mp4)

Shows complete user flow: login → notification → mark as read
```

---

<!-- /ANCHOR:demo-video -->
<!-- ANCHOR:breaking-changes-guidelines -->
## 12. BREAKING CHANGES GUIDELINES

**When to document**:
- API changes that break backward compatibility
- Database schema changes
- Configuration changes required
- Deprecated features removed

**Format**:
```markdown
<!-- /ANCHOR:breaking-changes-guidelines -->
<!-- ANCHOR:breaking-changes-2 -->
## Breaking Changes

### API Response Format Changed

**Before**:
```json
{ "data": {...}, "error": null }
```

**After**:
```json
{ "success": true, "data": {...} }
```

**Migration**:
Update client code to expect new response format.
See [migration guide](./docs/migration.md) for details.
```

---

<!-- /ANCHOR:breaking-changes-2 -->
<!-- ANCHOR:related-issues-guidelines -->
## 13. RELATED ISSUES GUIDELINES

**Format**:
```markdown
Fixes #123         # Closes issue completely
Closes #234        # Same as Fixes
Related to #345    # Related but doesn't close
Part of #456       # Part of larger epic
```

**When to use**:
- Always link PRs to issues
- Use "Fixes" or "Closes" for issues PR completely resolves
- Use "Related to" for partial fixes or related work

---

<!-- /ANCHOR:related-issues-guidelines -->
<!-- ANCHOR:pr-checklist -->
## 14. PR CHECKLIST

Before submitting PR, verify:

- [ ] Title follows Conventional Commits format
- [ ] Summary has 2-5 clear bullet points
- [ ] Test plan includes manual and automated testing
- [ ] All tests pass (show evidence)
- [ ] Screenshots included (if UI changes)
- [ ] Breaking changes documented (if applicable)
- [ ] Related issues linked
- [ ] Code follows project style guidelines
- [ ] Documentation updated (if needed)
- [ ] No console errors or warnings
- [ ] Reviewed own code first

---

<!-- /ANCHOR:pr-checklist -->
<!-- ANCHOR:creating-prs-programmatically -->
## 15. CREATING PRS PROGRAMMATICALLY

### GitHub CLI (Preferred)
```bash
gh pr create --title "feat(auth): add OAuth2 authentication" --body "$(cat <<'EOF'
<!-- /ANCHOR:creating-prs-programmatically -->
<!-- ANCHOR:summary-9 -->
## Summary

- Implements OAuth2 authentication flow
- Adds login/logout endpoints
- Includes user session management

<!-- /ANCHOR:summary-9 -->
<!-- ANCHOR:test-plan-8 -->
## Test Plan

### Manual Testing
- [x] Login flow tested in Chrome, Firefox, Safari
- [x] Invalid credentials show proper errors
- [x] Session persists across page refreshes

### Automated Testing
- [x] 152 unit tests pass
- [x] 23 integration tests pass
- [x] No console errors

<!-- /ANCHOR:test-plan-8 -->
<!-- ANCHOR:related-issues-7 -->
## Related Issues

Closes #234
EOF
)"
```

### GitHub MCP (via Code Mode)

Alternative when `gh` CLI is unavailable or you need richer API features:

```javascript
call_tool_chain(`github.github_create_pull_request({
  owner: 'owner',
  repo: 'repo',
  title: 'feat(auth): add OAuth2 authentication',
  head: 'feature/oauth',
  base: 'main',
  body: '## Summary\\n- Implements OAuth2 flow\\n\\n## Test Plan\\n- [x] Tests pass\\n\\nCloses #234'
})`)
```

**Note**: GitHub MCP runs via `npx @modelcontextprotocol/server-github`. Requires a GitHub PAT configured in `.utcp_config.json`. See [SKILL.md](../SKILL.md) Section 2 for full tool reference.

---

<!-- /ANCHOR:related-issues-7 -->
<!-- ANCHOR:tips -->
## 16. TIPS

1. **Write PR description as you code** - Don't wait until end
2. **Test plan first** - Know what you're testing before claiming "done"
3. **Screenshots save review time** - Visual evidence is powerful
4. **Link issues early** - Connect PR to work tracking immediately
5. **Self-review first** - Review your own PR before requesting review
6. **Keep it focused** - One PR = one logical change
7. **Update as you go** - Mark test plan items as you complete them

---

<!-- /ANCHOR:tips -->
<!-- ANCHOR:related-resources -->
## 17. RELATED RESOURCES

- [GitHub PR Best Practices](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests) - Official GitHub documentation on pull request collaboration
- [Conventional Commits](https://www.conventionalcommits.org/) - Specification for commit message formatting
- [GitHub CLI Manual](https://cli.github.com/manual/gh_pr_create) - Command reference for creating PRs via CLI
<!-- /ANCHOR:related-resources -->
