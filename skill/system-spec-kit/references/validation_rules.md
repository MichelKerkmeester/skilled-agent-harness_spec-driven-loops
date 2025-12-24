# Validation Rules Reference

> Complete reference for all validation rules in `validate-spec.sh`.

---

## Rule Summary

| Rule ID              | Severity | Applies To        | Description                                    |
| -------------------- | -------- | ----------------- | ---------------------------------------------- |
| `FILE_EXISTS`        | ERROR    | All levels        | Required files present for documentation level |
| `PLACEHOLDER_FILLED` | ERROR    | Core files        | No unfilled template placeholders              |
| `SECTIONS_PRESENT`   | WARNING  | All templates     | Required markdown sections exist               |
| `LEVEL_DECLARED`     | INFO     | spec.md           | Level explicitly stated in metadata            |
| `PRIORITY_TAGS`      | WARNING  | checklist.md      | P0/P1/P2 priority tags properly formatted      |
| `EVIDENCE_CITED`     | WARNING  | checklist.md      | Non-P2 items cite supporting evidence          |
| `ANCHORS_VALID`      | ERROR    | memory/*.md       | ANCHOR pairs properly opened and closed        |

---

## FILE_EXISTS

**Severity:** ERROR  
**Description:** Validates that all required files exist for the detected documentation level.

### Required Files by Level

| Level | Required Files                                              |
| ----- | ----------------------------------------------------------- |
| 1     | `spec.md`, `plan.md`, `tasks.md`                            |
| 2     | Level 1 + `checklist.md`                                    |
| 3     | Level 2 + `decision-record.md`                              |

### Examples

**Pass:**
```
specs/007-feature/
├── spec.md         ✓
├── plan.md         ✓
└── tasks.md        ✓
```

**Fail:**
```
specs/007-feature/
├── plan.md         ✓
└── tasks.md        ✓
                    ✗ Missing: spec.md
```

### How to Fix

Create the missing file(s) using the appropriate template:
```bash
cp .opencode/skill/system-spec-kit/templates/spec.md specs/007-feature/
```

---

## PLACEHOLDER_FILLED

**Severity:** ERROR  
**Description:** Detects unfilled template placeholders that should be replaced with actual content.

### Patterns Detected

| Pattern                      | Status    | Action Required           |
| ---------------------------- | --------- | ------------------------- |
| `[YOUR_VALUE_HERE: ...]`     | FLAGGED   | Replace with actual value |
| `[NEEDS CLARIFICATION: ...]` | FLAGGED   | Resolve and replace       |
| `[OPTIONAL: ...]`            | IGNORED   | Optional content          |

### Files Scanned

- `spec.md`
- `plan.md`
- `tasks.md`
- `checklist.md` (if exists)
- `decision-record.md` (if exists)

### Excluded Paths

- `**/scratch/**` - Scratch files are never scanned
- `**/memory/**` - Memory files use different validation (ANCHORS_VALID)
- `**/templates/**` - Template files are expected to have placeholders

### Examples

**Fail:**
```markdown
## Metadata

| Field | Value |
|-------|-------|
| **Type** | [YOUR_VALUE_HERE: Feature type] |  ← FLAGGED
```

**Pass:**
```markdown
## Metadata

| Field | Value |
|-------|-------|
| **Type** | Feature |
```

### How to Fix

Replace placeholder text with actual content:

1. Find the flagged line in the output
2. Replace `[YOUR_VALUE_HERE: description]` with the actual value
3. Remove the entire `[...]` block, not just the inner text

---

## SECTIONS_PRESENT

**Severity:** WARNING  
**Description:** Validates that required markdown sections exist in each file type.

### Required Sections

| File                | Required Sections                                |
| ------------------- | ------------------------------------------------ |
| `spec.md`           | Problem Statement, Requirements, Scope           |
| `plan.md`           | Technical Context, Architecture, Implementation  |
| `checklist.md`      | P0, P1 (section headers)                         |
| `decision-record.md`| Context, Decision, Consequences                  |

### Matching Rules

- Case-insensitive matching
- Partial match (e.g., "Implementation Phases" matches "Implementation")
- Matches `##` or `###` headers

### Examples

**Warning:**
```markdown
# My Spec

## Overview           ← Does not match "Problem Statement"
## What We Need       ← Does not match "Requirements"
## Scope              ✓ Match
```

**Pass:**
```markdown
# My Spec

## 1. Problem Statement    ✓
## 2. Requirements         ✓
## 3. Scope               ✓
```

### How to Fix

Add the missing section headers. You can use numbered prefixes:
```markdown
## 1. Problem Statement

[Content here]

## 2. Requirements

[Content here]
```

---

## LEVEL_DECLARED

**Severity:** INFO  
**Description:** Checks if the documentation level is explicitly declared in spec.md metadata.

### Detection Method

1. **Explicit (preferred):** Look for `| **Level** | N |` in spec.md metadata table
2. **Inferred (fallback):** Based on file presence:
   - Has `decision-record.md` → Level 3
   - Has `checklist.md` → Level 2
   - Otherwise → Level 1

### Examples

**Explicit (no INFO):**
```markdown
## Metadata

| Field | Value |
|-------|-------|
| **Level** | 2 |
```

**Inferred (INFO logged):**
```markdown
## Metadata

| Field | Value |
|-------|-------|
| **Type** | Feature |
                        ← No Level field, will be inferred
```

### How to Fix

Add the Level field to your spec.md metadata table:
```markdown
| **Level** | 2 |
```

---

## PRIORITY_TAGS

**Severity:** WARNING  
**Description:** Validates that checklist items use proper P0/P1/P2 priority tagging format.

### Priority Definitions

| Priority | Meaning       | Deferral Rules                          |
| -------- | ------------- | --------------------------------------- |
| **P0**   | HARD BLOCKER  | Must complete, cannot defer             |
| **P1**   | Must complete | Can defer only with explicit user approval |
| **P2**   | Can defer     | Can defer without approval              |

### Recognized Formats

**Section Headers (preferred):**
```markdown
## P0 - Critical Items

- [ ] Item one
- [ ] Item two

## P1 - Required Items

- [ ] Item three
```

**Inline Tags:**
```markdown
- [ ] [P0] This is a critical item
- [ ] [P1] This must be done
- [ ] [P2] This can be deferred
```

### Context Reset Behavior

Priority tags apply to items **until the next priority header or end of file**:

```markdown
## P0 - Critical

- [ ] Item A          ← P0 (from header)
- [ ] Item B          ← P0 (from header)

## P1 - Required

- [ ] Item C          ← P1 (context reset)
- [ ] [P0] Item D     ← P0 (inline override)
- [ ] Item E          ← P1 (back to header context)
```

### Examples

**Pass:**
```markdown
## P0 - Blockers

- [x] Database migration complete
- [ ] API endpoints deployed

## P1 - Required

- [ ] Documentation updated
```

**Warning (no priority context):**
```markdown
## Tasks

- [ ] Do something      ← No priority assigned
- [ ] Do another thing  ← No priority assigned
```

### How to Fix

Add priority headers or inline tags to all checklist items:

1. Group items under `## P0`, `## P1`, `## P2` headers, OR
2. Add inline tags: `- [ ] [P1] Task description`

---

## EVIDENCE_CITED

**Severity:** WARNING  
**Description:** Validates that non-P2 checklist items include evidence citations to support claims.

### Why Evidence Matters

Evidence citations:
- Prevent "works on my machine" claims
- Enable verification by reviewers
- Create audit trail for decisions
- Support future debugging

### Recognized Evidence Patterns

| Pattern | Description | Example |
| ------- | ----------- | ------- |
| `[Source: ...]` | General source citation | `[Source: API docs v2.1]` |
| `[File: ...]` | File path reference | `[File: src/auth.ts:45-67]` |
| `[Test: ...]` | Test execution reference | `[Test: npm run test:auth]` |
| `[Commit: ...]` | Git commit reference | `[Commit: abc1234]` |
| `[Screenshot: ...]` | Visual evidence | `[Screenshot: ./evidence/login.png]` |

### Priority Exemptions

| Priority | Evidence Required | Rationale |
| -------- | ----------------- | --------- |
| **P0**   | YES               | Critical items need strong proof |
| **P1**   | YES               | Required items need verification |
| **P2**   | NO (exempt)       | Deferrable items may be incomplete |

### Examples

**Pass:**
```markdown
## P0 - Critical

- [x] Auth flow working [Test: npm run test:auth - all 12 passing]
- [x] Database migrated [Commit: abc1234]

## P1 - Required

- [x] Docs updated [File: docs/api.md]

## P2 - Optional

- [ ] Refactor utils      ← No evidence needed (P2 exempt)
```

**Warning:**
```markdown
## P0 - Critical

- [x] Auth flow working   ← WARNING: No evidence cited
```

### Case Sensitivity

Evidence patterns are **case-insensitive**:
- `[Source: ...]` ✓
- `[source: ...]` ✓
- `[SOURCE: ...]` ✓

### How to Fix

Add evidence to non-P2 items:

```markdown
## Before
- [x] Feature implemented

## After
- [x] Feature implemented [Test: npm test - 15/15 passing]
```

---

## ANCHORS_VALID

**Severity:** ERROR  
**Description:** Validates that memory files use proper ANCHOR format with matching open/close pairs.

### What Are Anchors?

Anchors are structured markers that define semantic boundaries in memory files. They enable:
- Targeted memory retrieval
- Section-specific context loading
- Semantic search indexing

### Anchor Format

```markdown
<!-- ANCHOR:section-name -->
Content goes here...
<!-- /ANCHOR:section-name -->
```

### Rules

1. **Every ANCHOR must have a closing /ANCHOR**
2. **Names must match exactly** (case-sensitive)
3. **No nesting** - anchors cannot contain other anchors
4. **Scope:** Only `memory/*.md` files are validated

### Examples

**Pass:**
```markdown
<!-- ANCHOR:context -->
## Project Context

This feature adds authentication...
<!-- /ANCHOR:context -->

<!-- ANCHOR:decisions -->
## Key Decisions

We chose JWT because...
<!-- /ANCHOR:decisions -->
```

**Error (unclosed anchor):**
```markdown
<!-- ANCHOR:context -->
## Project Context

This feature adds authentication...

<!-- ANCHOR:decisions -->        ← ERROR: 'context' never closed
## Key Decisions
<!-- /ANCHOR:decisions -->
```

**Error (mismatched names):**
```markdown
<!-- ANCHOR:context -->
## Content
<!-- /ANCHOR:Context -->         ← ERROR: 'context' ≠ 'Context'
```

### Pair Matching Logic

The validator tracks anchor state:

```
Open "context"     → Stack: [context]
Open "decisions"   → ERROR: "context" still open
Close "context"    → Stack: []
Open "decisions"   → Stack: [decisions]
Close "decisions"  → Stack: [] ✓
```

### How to Fix

1. Find the unclosed anchor in the error message
2. Add the matching close tag: `<!-- /ANCHOR:name -->`
3. Ensure name casing matches exactly

```markdown
## Before (broken)
<!-- ANCHOR:context -->
Content here...
(missing close tag)

## After (fixed)
<!-- ANCHOR:context -->
Content here...
<!-- /ANCHOR:context -->
```

---

## Severity Levels

| Severity | Exit Code | Strict Mode | Description                           |
| -------- | --------- | ----------- | ------------------------------------- |
| ERROR    | 2         | 2           | Validation failed, must fix           |
| WARNING  | 1         | 2           | Passed with issues, should fix        |
| INFO     | 0         | 0           | Informational, no action required     |

---

## Environment Variables

| Variable             | Default | Description                           |
| -------------------- | ------- | ------------------------------------- |
| `SPECKIT_VALIDATION` | true    | Set to `false` to skip validation     |
| `SPECKIT_STRICT`     | false   | Set to `true` to fail on warnings     |
| `SPECKIT_JSON`       | false   | Set to `true` for JSON output         |
| `SPECKIT_VERBOSE`    | false   | Set to `true` for verbose output      |

---

## Related

- [path_scoped_rules.md](./path_scoped_rules.md) - Path scoping overview
- [level_specifications.md](./level_specifications.md) - Level requirements
- `validate-spec.sh` - Implementation script
