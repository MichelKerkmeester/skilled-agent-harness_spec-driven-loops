# Commit Message Template

Templates and examples for writing professional commit messages following Conventional Commits specification.

---

## 1. 📝 BASIC FORMAT

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

---

## 2. 🏷️ TYPE REFERENCE

| Type | When to Use | Breaking? |
|------|-------------|-----------|
| `feat` | New feature for the user | Possibly |
| `fix` | Bug fix for the user | No |
| `refactor` | Code change that neither fixes nor adds feature | No |
| `docs` | Documentation only changes | No |
| `style` | Formatting, whitespace, semicolons (no code change) | No |
| `test` | Adding or updating tests | No |
| `chore` | Build process, dependency updates, tooling | No |
| `perf` | Performance improvement | Possibly |
| `ci` | CI/CD configuration changes | No |

---

## 3. 🎯 SCOPE GUIDELINES

**What is scope?**
The component or area of the codebase affected by the change.

**Common scopes**:
- `auth` - Authentication/authorization
- `api` - API layer
- `ui` - User interface
- `db` - Database
- `config` - Configuration
- `cli` - Command-line interface
- `deps` - Dependencies

**Scope is optional** - omit if change affects multiple areas or is too general.

---

## 4. ✅ DESCRIPTION RULES

✅ **DO**:
- Use imperative mood ("add" not "added" or "adds")
- Start with lowercase after the colon
- Keep under 50 characters total
- Be specific and descriptive
- Focus on **what** changed

❌ **DON'T**:
- End with a period
- Use past tense ("added", "fixed")
- Be vague ("update stuff", "fix bug")
- Include implementation details
- Use internal task numbers in subject

---

## 5. 📝 BODY GUIDELINES

**When to include a body**:
- Change is complex or non-obvious
- Need to explain **why** the change was made
- Multiple paragraphs of context needed
- Breaking changes or migration steps

**Format**:
- Separate from subject with blank line
- Wrap lines at 72 characters
- Explain **what** and **why**, not **how**
- Can have multiple paragraphs

---

## 6. 🔗 FOOTER GUIDELINES

### Breaking Changes

**Format**:
```
BREAKING CHANGE: <description>
```

**Example**:
```
feat(api): change response format to JSON

BREAKING CHANGE: XML response format no longer supported.
Clients must update to handle JSON responses.
```

### Issue References

**Format**:
```
Fixes #123
Closes #456
Related to #789
```

**When to use**:
- `Fixes` - For bug fixes
- `Closes` - For features or tasks
- `Related to` - For related issues

---

## 7. 📚 COMPLETE EXAMPLES

### Example 1: Feature with Body

```
feat(auth): add OAuth2 login support

Implements OAuth2 authentication flow to replace basic auth.
Improves security and enables SSO integration.
```

**Why this is good**:
- Type: `feat` (new feature)
- Scope: `auth` (authentication component)
- Description: Clear, imperative, under 50 chars
- Body: Explains **why** and **what** benefits


### Example 2: Bug Fix with Issue

```
fix(api): handle null response in error handler

Prevents crash when error response body is null.
Adds null check before accessing response properties.

Fixes #234
```

**Why this is good**:
- Type: `fix` (bug fix)
- Scope: `api` (API layer)
- Description: Specific about the issue
- Body: Explains the problem and solution
- Footer: Links to issue


### Example 3: Refactor

```
refactor(utils): extract validation logic to middleware

Moves input validation from route handlers to reusable
middleware. Reduces code duplication and improves testability.
```

**Why this is good**:
- Type: `refactor` (code restructuring)
- Scope: `utils` (utilities)
- Body: Explains benefits of the refactor


### Example 4: Documentation

```
docs: update API reference with authentication endpoints

Adds documentation for OAuth2 login and token refresh
endpoints. Includes example requests and responses.
```

**Why this is good**:
- Type: `docs` (documentation)
- No scope needed (general documentation)
- Description: Clear about what docs were updated


### Example 5: Breaking Change

```
feat(api): migrate to v2 response format

Standardizes all API responses to follow v2 format with
consistent error handling and pagination.

BREAKING CHANGE: v1 response format no longer supported.
Update client code to handle new response structure:
- Old: { data: {...}, error: null }
- New: { success: true, data: {...} }
```

**Why this is good**:
- Type: `feat` (new feature, even though breaking)
- Scope: `api`
- Body: Explains the change
- Footer: Clear breaking change notice with migration info


### Example 6: Multiple Issues

```
fix(db): resolve connection pool exhaustion

Implements connection pooling with configurable limits.
Prevents connection leaks by ensuring proper cleanup.

Fixes #123
Fixes #124
Related to #125
```

**Why this is good**:
- Multiple related issues fixed in one commit
- Clear about what was fixed
- Links all relevant issues

---

## 8. ❌ BAD EXAMPLES (LEARN WHAT TO AVOID)

### ❌ Example 1: Vague

```
fix: update stuff

Changed some files.
```

**Problems**:
- "update stuff" - too vague
- No scope
- Body doesn't explain anything
- What files? What changed?

**Fixed version**:
```
fix(api): handle timeout errors in data fetch

Adds retry logic with exponential backoff for network
timeouts. Improves reliability for slow connections.
```

### ❌ Example 2: Internal Reference

```
feat: TASK-456 new feature

Implemented the thing from the task.
```

**Problems**:
- TASK-456 in subject (should be in footer)
- "new feature" - not descriptive
- "the thing" - vague
- Message doesn't make sense without internal context

**Fixed version**:
```
feat(auth): add two-factor authentication

Implements TOTP-based 2FA for user accounts.
Users can enable 2FA in account settings.

Related to TASK-456
```

### ❌ Example 3: Implementation Details

```
fix(api): refactor getUserData function to use async/await instead of callbacks

Changed all the callback code to async/await.
```

**Problems**:
- Subject too long (>50 chars)
- Implementation details in subject
- Focus on **how** instead of **what/why**

**Fixed version**:
```
fix(api): resolve race condition in user data fetch

Prevents intermittent failures when fetching user data.
Async/await pattern ensures proper error handling.
```

### ❌ Example 4: Wrong Tense

```
feat(ui): added new dashboard widgets

Added widgets for displaying user metrics.
```

**Problems**:
- "added" - past tense (should be imperative "add")
- Body also uses past tense

**Fixed version**:
```
feat(ui): add dashboard widgets for user metrics

Adds customizable widgets for displaying active users,
revenue, and conversion rates on the dashboard.
```

### ❌ Example 5: Multiple Unrelated Changes

```
feat: add login feature and fix sidebar bug and update docs

Lots of changes in this commit.
```

**Problems**:
- Multiple unrelated changes in one commit
- Not atomic
- Hard to review or revert

**Fixed version** (split into 3 commits):
```
feat(auth): add login feature

Implements email/password login with JWT tokens.

fix(ui): correct sidebar navigation alignment

Fixes misaligned menu items in responsive mode.

docs: update authentication guide

Adds documentation for new login endpoints.
```

---

## 9. 📋 TEMPLATES FOR COMMON SCENARIOS

### Feature Addition

```
feat(<scope>): <add/implement X>

<Why this feature is needed>
<How it benefits users/system>

[Closes #<issue-number>]
```

### Bug Fix

```
fix(<scope>): <resolve/correct/prevent X>

<What was broken>
<How this fixes it>

[Fixes #<issue-number>]
```

### Refactoring

```
refactor(<scope>): <extract/restructure X>

<Why refactoring was needed>
<What improvements this brings>
```

### Documentation

```
docs: <update/add X documentation>

<What was documented>
<Why it was needed>
```

### Dependencies

```
chore(deps): <update/add X to version Y>

[Why the update was needed]
```

---

## 10. ✅ COMMIT MESSAGE CHECKLIST

Before committing, verify:

- [ ] Type is correct (`feat`, `fix`, `refactor`, etc.)
- [ ] Scope accurately describes affected component (if applicable)
- [ ] Description uses imperative mood
- [ ] Description is under 50 characters
- [ ] Description is specific and clear
- [ ] No period at end of description
- [ ] Body explains **what** and **why** (not **how**)
- [ ] Body lines wrapped at 72 characters
- [ ] Breaking changes documented in footer (if applicable)
- [ ] Issue references included (if applicable)
- [ ] No internal task numbers in subject
- [ ] Message makes sense to external developers

---

## 11. 🏎️ QUICK REFERENCE

### Imperative Mood Conversion

| ❌ Wrong | ✅ Right |
|---------|---------|
| added | add |
| fixed | fix |
| updated | update |
| changed | change |
| removed | remove |
| refactored | refactor |
| implemented | implement |

### Length Guidelines

- **Subject**: ≤50 characters
- **Body line**: ≤72 characters
- **Commit as whole**: No limit, but be concise

### Common Patterns

```
feat: add <feature>
fix: resolve <problem>
refactor: extract <component>
docs: update <section>
test: add <test suite>
chore: update <dependency>
```

---

## 12. 🔗 REFERENCES

- [Conventional Commits Specification](https://www.conventionalcommits.org/)
- [How to Write a Git Commit Message](https://chris.beams.io/posts/git-commit/)
- [Semantic Versioning](https://semver.org/)
