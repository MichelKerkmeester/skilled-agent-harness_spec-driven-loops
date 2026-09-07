---
title: Validation Rules Reference
description: Complete reference for all validation rules used by the SpecKit validation system.
trigger_phrases:
  - "validation rule registry"
  - "rule severity levels"
  - "acceptance coverage rollout"
  - "completion freshness rule"
  - "continuity freshness fix"
importance_tier: important
contextType: implementation
version: 3.6.0.30
---

# Validation Rules Reference - Complete Rule Reference

Complete reference for all validation rules used by the SpecKit validation system.

---

## 1. OVERVIEW

### What Is This Reference?

This document provides comprehensive documentation for every validation rule enforced by the SpecKit system. It covers rule behavior, severity levels, detection patterns, and remediation steps for each validation check.

**Core Purpose**:
- **Rule Documentation** - Complete specifications for all validation checks
- **Fix Instructions** - Clear remediation steps when validation fails
- **Configuration Guide** - Environment variables and usage patterns

### Core Principle

> Validation ensures spec folders meet quality standards before claiming completion—preventing incomplete documentation from passing the Completion Verification Rule.

### Severity Levels

| Severity | Exit Code | Strict Mode | Description                       |
| -------- | --------- | ----------- | --------------------------------- |
| ERROR    | 2         | 2           | Validation failed, must fix       |
| WARNING  | 0         | 0           | Passed with issues, should fix    |
| INFO     | 0         | 0           | Informational, no action required |

CLI taxonomy: `0` = success, `1` = user error, `2` = validation error, and `3` = system error. `--strict` selects the rules that only run under strict; a warning stays advice in both modes and never changes the exit code. A rule that should block reports an error itself.

---

## 2. RULE SUMMARY

| Rule ID              | Severity | Applies To    | Description                                    |
| -------------------- | -------- | ------------- | ---------------------------------------------- |
| `FILE_EXISTS`        | ERROR    | All levels    | Required files present for documentation level |
| `PLACEHOLDER_FILLED` | ERROR    | Core files    | No unfilled template placeholders              |
| `LEVEL_DECLARED`     | INFO     | spec.md       | Level explicitly stated in metadata            |
| `AC_COVERAGE`        | INFO     | acceptance-criteria.md | Advisory traceability scan over each criterion's Verification cell (on by default; `SPECKIT_AC_COVERAGE_ENFORCE=true` makes an under-floor result fail) |
| `AC_CLOSURE`         | ERROR    | acceptance-criteria.md | Closure gate for Levels 2/3/3+: unmet criteria block a completion claim, waivers must cite a real ADR |
| `CONTINUITY_FRESHNESS` | WARNING | completion claims | Opt-in strict-only completion freshness check |
| `ANCHORS_VALID`      | ERROR    | spec docs + memory/*.md | ANCHOR pairs properly opened and closed  |
| `FOLDER_NAMING`      | ERROR    | Folder path   | Folder follows ###-short-name convention       |
| `FRONTMATTER_VALID`  | ERROR    | spec docs     | YAML frontmatter properly structured           |
| `COMPLEXITY_MATCH`   | WARNING  | All levels    | Content metrics match declared level           |
| `AI_PROTOCOLS`       | ERROR    | Level 3/3+    | AI execution protocols present                 |
| `LEVEL_MATCH`        | ERROR    | All files     | Level consistent across all spec files         |

> **Partial reference:** The table above covers the most commonly-encountered rules. The authoritative, complete rule set and their canonical severities live in [`runtime/cli/lib/validator-registry.json`](../../runtime/cli/lib/validator-registry.json).

### AC_CLOSURE

`AC_CLOSURE` decides whether a packet may be closed. It is registered at ERROR severity and runs by default; set `SPECKIT_AC_CLOSURE=false` to opt out.

**Rule ID:** `AC_CLOSURE`

**Scope:** Levels 2, 3 and 3+. Level 1 keeps acceptance criteria inline in `spec.md` and is never gated.

**Rollout:** forward-only behind `SPECKIT_AC_CLOSURE_CUTOFF` (default `2026-08-30`), compared against the `Created` date in the packet's `spec.md` metadata table. A packet created on or before the cutoff, or whose date cannot be read, is advisory on **every** branch — presence, waiver integrity and completion alike — and is never blocked. A malformed override falls back to the default rather than being compared as a string, which would otherwise grandfather the whole repository. This mirrors the `CANONICAL_SAVE_CUTOFF` pattern rather than introducing a third grandfathering mechanism.

**Failure modes:**

| Condition | Result |
|---|---|
| Post-cutoff packet with no `acceptance-criteria.md` | `fail` — the document is required at these levels |
| A row marked `Waived` or `Superseded` naming no ADR | `fail` — an unbacked waiver is not a pass |
| A criterion row that cannot be parsed, or an unbalanced code fence | `fail` — a dropped row would empty the table and close the packet |
| Duplicate criterion ids | `fail` — the tally is ambiguous |
| A row citing an ADR that `decision-record.md` does not contain | `fail` — the record is the whole justification |
| A packet claiming completion with an `Unmet` row | `fail` — this is the closure gate |
| An `Unmet` row while the packet is still in progress | `info` — work in progress is expected to carry open criteria |
| Pre-cutoff packet | `info` — grandfathered |

**Waiver contract:** a criterion may only be dropped or replaced through a decision record. The Waiver cell must name `ADR-NNN`, and every ADR it names must be declared in `decision-record.md` as a heading, a bold list item or a table row, outside any code fence. `ADR-1` and `ADR-001` are the same record.

**Column binding:** the criteria table is parsed by header name, not by column position, so an escaped pipe or an added column cannot shift the Status cell.

`AC_COVERAGE` is registered at INFO severity and runs by default; set `SPECKIT_AC_COVERAGE=false` to opt out. The rule is advisory: it reports the coverage denominator, covered count, configured floor, manual-infeasible escape hatch status, and malformed evidence citations without adding strict warnings or errors. The `SPECKIT_AC_COVERAGE_ENFORCE` flag is documented as a future promotion switch; changing validation outcome requires a later severity change backed by adoption evidence.

**Rule ID:** `AC_COVERAGE`  
**Severity:** INFO  
**Default:** Enabled (advisory). Set `SPECKIT_AC_COVERAGE=false` to opt out.  
**Lifecycle predicate:** Level 2+ only, with `acceptance-criteria.md` present and `implementation-summary.md` status in-progress or later. Level 1 folders and fresh scaffolds are exempt.  
**Coverage calculation:** covered acceptance criteria divided by total acceptance criteria must meet `ceil(total * SPECKIT_AC_COVERAGE_FLOOR)`. The default floor is `0.9`; values outside `[0,1]` are clamped.  
**Escape hatch:** a traceability row classified as Manual-infeasible counts as covered only when it carries a rationale.  
**Evidence citations:** Tested or Partially covered rows count only with `file:line` evidence. Malformed evidence is named in the advisory details.

| Flag | Default | Effect |
| --- | --- | --- |
| `SPECKIT_AC_TRACEABILITY_TEMPLATE` | `false` | Reserved opt-in for future scaffold template rendering of traceability rows. |
| `SPECKIT_AC_COVERAGE` | `true` | Runs the advisory validation scan by default; set to `false` to opt out. |
| `SPECKIT_AC_COVERAGE_ENFORCE` | `false` | Reserved promotion switch; current rule remains INFO/advisory. |
| `SPECKIT_AC_COVERAGE_FLOOR` | `0.9` | Sets the advisory coverage floor, clamped to `[0,1]`. |

### Non-Breaking Completion Freshness Rollout

`CONTINUITY_FRESHNESS` is strict-only and inert by default. It runs only when `SPECKIT_COMPLETION_FRESHNESS=true`, so unset validation output stays unchanged. When enabled, it binds a completion claim to the stored `session_dedup.fingerprint`: the validator recomputes the fingerprint, which is the SHA-256 of `implementation-summary.md`'s own text after line endings are normalized, trailing whitespace is stripped and the fingerprint line itself is zeroed, compares it to the stored value, and checks that packet-scoped working-tree paths are clean. The zero fingerprint placeholder is treated as never recorded and does not produce stale warnings.

**Rule ID:** `CONTINUITY_FRESHNESS`  
**Severity (inner label):** `warn` by default; `error` when `SPECKIT_COMPLETION_FRESHNESS_ENFORCE=true`  
**Default:** Disabled. Set `SPECKIT_COMPLETION_FRESHNESS=true` to run the strict-only scan.  
**Lifecycle predicate:** strict validation only, with a completion claim present (tasks.md checked verification evidence, `completion_pct: 100`, or complete/shipped status).  
**Clean-tree scope:** packet-scoped paths only, not the whole repository.  
**Clock drift:** a continuity timestamp newer than graph metadata remains a benign pass path.

> **Completion-blocking note:** the rule runs only when `SPECKIT_COMPLETION_FRESHNESS` is enabled, and the decision to run it is made once, at the rule's own entry point, so every caller gets the same answer. A stale result reports a `warn`, which does not block: the orchestrator passes whenever no rule reports an error. `SPECKIT_COMPLETION_FRESHNESS_ENFORCE` escalates that `warn` to an `error`, and only then does `--strict` exit 2. The ENFORCE flag is the warn-versus-block switch.

| Flag | Default | Effect |
| --- | --- | --- |
| `SPECKIT_COMPLETION_FRESHNESS` | `false` | Enables strict-only completion freshness validation. When on, a stale result reports a warning, which does not block. |
| `SPECKIT_COMPLETION_FRESHNESS_ENFORCE` | `false` | Escalates a stale-freshness `warn` to an `error`, which makes `--strict` exit 2. |

### How to Fix `CONTINUITY_FRESHNESS`

1. Re-run the verification that supports the completion claim.
2. Refresh the packet continuity fingerprint after the verified content is current.
3. Ensure the packet's own paths are clean, then run `validate.sh --strict` again.

---

## 3. FILE_EXISTS

**Severity:** ERROR  
**Description:** Validates that all required files exist for the detected documentation level.

### Required Files by Level

| Level | Required Files                                                 |
| ----- | -------------------------------------------------------------- |
| 1     | `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`  |
| 2     | Level 1 + `acceptance-criteria.md`                                       |
| 3     | Level 2 + `decision-record.md`                                 |
| **review** | `spec.md`, `review/review-report.md` (lean review record, entered only via the `<!-- SPECKIT_LEVEL: review -->` marker, waives plan/tasks/decision-record/implementation-summary) |
| **Phase Parent** | `spec.md`, `description.json`, `graph-metadata.json` (lean trio only; heavy docs live in phase children) |

> **Phase Parent Mode:** A spec folder is treated as a phase parent when at least one direct child matches `^[0-9]{3}-[a-z0-9][a-z0-9-]*$` AND that child has `spec.md` OR `description.json`. Detection is implemented identically by `is_phase_parent()` (shell, in `runtime/cli/lib/shell-common.sh`) and `isPhaseParent()` (ESM JS, at `runtime/cli/dist/spec/is-phase-parent.js`). When detected, FILE_EXISTS skips Level-N file requirements at the parent and accepts only the lean trio. Phase children continue to follow their own Level 1/2/3/3+ contract. Tolerant policy: legacy phase parents that retain heavy docs continue to validate without churn.

### Implementation Summary (All Levels)

All spec folders require an implementation summary that captures what was built:

| File                        | Created When                | Purpose                                        |
| --------------------------- | --------------------------- | ---------------------------------------------- |
| `implementation-summary.md` | End of implementation phase | Captures what was built, deviations, results   |

**Note:** `create.sh` scaffolds `implementation-summary.md` for Level 1 and above. `check-files.sh` skips it in the base required-doc loop and only enforces it once implementation has started — i.e. when `tasks.md` shows completed `[x]` items. At that point a missing `implementation-summary.md` is an ERROR.

### Nested Packet Changelog (Recommended for phased work)

Packet-local changelogs are not part of the required FILE_EXISTS contract, but they are recommended whenever a spec root or phase child needs a durable packet history beside `implementation-summary.md`.

| Artifact | Typical Path | Created When |
| --- | --- | --- |
| Root nested changelog | `changelog/changelog-<packet>-root.md` | End of root-packet completion |
| Phase nested changelog | `../changelog/changelog-<packet>-<phase-folder>.md` | End of phase completion |

### Examples

✅ **Pass (Level 1):**
```
specs/007-feature/
├── spec.md                   ✓
├── plan.md                   ✓
├── tasks.md                  ✓
└── implementation-summary.md ✓
```

✅ **Pass (Level 2):**
```
specs/008-complex-feature/
├── spec.md                   ✓
├── plan.md                   ✓
├── tasks.md                  ✓
├── acceptance-criteria.md    ✓
└── implementation-summary.md ✓
```

❌ **Fail (Level 1 - missing core file):**
```
specs/007-feature/
├── plan.md                   ✓
├── tasks.md                  ✓
└── implementation-summary.md ✓
                              ✗ Missing: spec.md
```

❌ **Fail (Level 1 - missing implementation summary):**
```
specs/007-feature/
├── spec.md         ✓
├── plan.md         ✓
└── tasks.md        ✓
                    ✗ Missing: implementation-summary.md
```

### How to Fix

Create the missing file(s) using the appropriate template:

```bash
# Core files
bash .opencode/skills/system-spec-kit/runtime/cli/spec/create.sh --level 1 --path specs/007-feature --name feature-name

# Implementation summary is scaffolded by create.sh for all levels
bash .opencode/skills/system-spec-kit/runtime/cli/spec/create.sh --level 1 --path specs/007-feature --name feature-name
```

**Workflow:**
1. Complete implementation phase → create `implementation-summary.md`
2. Run validation to confirm all requirements are met

---

## 4. PLACEHOLDER_FILLED

**Severity:** ERROR  
**Description:** Detects unfilled template placeholders that should be replaced with actual content.

### Patterns Detected

| Pattern                                              | Status  | Action Required           |
| ---------------------------------------------------- | ------- | ------------------------- |
| `[YOUR_VALUE_HERE: ...]`                             | FLAGGED | Replace with actual value |
| `[NEEDS_CLARIFICATION: ...]` / `[NEEDS CLARIFICATION: ...]` | FLAGGED | Resolve and replace |
| `[OPTIONAL: ...]`                                    | IGNORED | Optional content          |

### Files Scanned

- `spec.md`
- `plan.md`
- `tasks.md`
- `acceptance-criteria.md` (if exists)
- `decision-record.md` (if exists)

### Excluded Paths

- `**/scratch/**` - Scratch files are never scanned
- `**/memory/**` - Generated continuity artifacts use different validation (ANCHORS_VALID)
- `**/templates/**` - Template files are expected to have placeholders

### Examples

❌ **Fail:**
```markdown
## Metadata

| Field | Value |
|-------|-------|
| **Type** | [YOUR_VALUE_HERE: Feature type] |  ← FLAGGED
```

✅ **Pass:**
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

## 5. LEVEL_DECLARED

**Severity:** INFO  
**Description:** Checks if the documentation level is explicitly declared in spec.md metadata.

### Detection Method

1. **Explicit (preferred):** Look for `| **Level** | N |` in spec.md metadata table
2. **Inferred (fallback):** Based on file presence:
   - Has `decision-record.md` → Level 3
   - Has `acceptance-criteria.md` → Level 2
   - Otherwise → Level 1

### Examples

✅ **Explicit (no INFO):**
```markdown
## Metadata

| Field | Value |
|-------|-------|
| **Level** | 2 |
```

⚠️ **Inferred (INFO logged):**
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

## 6. ANCHORS_VALID

**Severity:** ERROR  
**Description:** Validates that generated continuity artifacts and other support docs use proper ANCHOR format with matching open/close pairs.

### What Are Anchors?

Anchors are structured markers that define semantic boundaries in a packet's continuity documents. They enable:
- Extracting one named region without parsing the whole document
- Section-specific context loading
- Template-contract checks that assert a required region is present

### Anchor Format

```markdown
<!-- ANCHOR:id -->
Content goes here...
<!-- /ANCHOR:id -->
```

### Rules

1. **Every ANCHOR must have a closing /ANCHOR**
2. **Names must match exactly** (case-sensitive)
3. **No nesting** - anchors cannot contain other anchors
4. **Scope:** `memory/*.md` files plus the major spec docs — `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `decision-record.md`, and `implementation-summary.md` — are validated

### Examples

✅ **Pass:**
```markdown
## Project Context

This feature adds authentication...

## Key Decisions

We chose JWT because...
```

❌ **Error (unclosed anchor):**
```markdown
## Project Context

This feature adds authentication...

<!-- ANCHOR:decisions -->        ← ERROR: 'context' never closed
## Key Decisions
```

❌ **Error (mismatched names):**
```markdown
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
Content here...
(missing close tag)

## After (fixed)
Content here...
```

---

## 7. FOLDER_NAMING

**Severity:** ERROR
**Description:** Validates that the spec folder follows the `###-short-name` naming convention.

### Naming Rules

| Rule              | Valid                     | Invalid                   |
| ----------------- | ------------------------- | ------------------------- |
| 3-digit prefix    | `001-`, `042-`, `999-`    | `1-`, `01-`, `1234-`      |
| Lowercase only    | `007-auth-feature`        | `007-Auth-Feature`        |
| Hyphens only      | `007-my-feature`          | `007_my_feature`          |
| No spaces         | `007-login-flow`          | `007-login flow`          |

### Examples

**Pass:**
```
specs/001-initial-setup/
specs/042-user-authentication/
specs/007-api-refactor/
```

**Fail:**
```
specs/1-setup/                  ← Missing 3-digit prefix
specs/001-User-Auth/            ← Contains uppercase
specs/001_login_flow/           ← Uses underscores
specs/feature-without-number/   ← Missing numeric prefix
```

### How to Fix

Rename the folder to follow the pattern `###-short-name`:

```bash
# From invalid
mv specs/1-setup specs/001-setup
mv specs/001_login_flow specs/001-login-flow
mv specs/Feature specs/001-feature
```

---

## 8. FRONTMATTER_VALID

**Severity:** ERROR
**Description:** Validates YAML frontmatter structure and required semantic values across the major spec documents.

### Validation Checks

`check-frontmatter.sh` scans all six major spec docs: `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `decision-record.md`, and `implementation-summary.md`. It validates frontmatter closure plus required semantic fields (`title`, `description`, `importance_tier`, `contextType`, `trigger_phrases`).

| Check                     | Files Scanned     | Description                             |
| ------------------------- | ----------------- | --------------------------------------- |
| Frontmatter closure       | all six spec docs | Opening `---` has matching closing `---`|
| Template source marker    | all six spec docs | Contains `SPECKIT_TEMPLATE_SOURCE`      |
| Semantic fields           | all six spec docs | `title`, `description`, `importance_tier`, `contextType`, `trigger_phrases` present |

### Examples

**Pass:**
```markdown
---
title: My Feature Spec
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

# Content here
```

**Warning (unclosed frontmatter):**
```markdown
---
title: My Feature Spec
                          ← Missing closing ---

# Content here
```

**Warning (missing template marker):**
```markdown
---
title: My Feature Spec
---                       ← No SPECKIT_TEMPLATE_SOURCE

# Content here
```

### How to Fix

1. Ensure frontmatter has both opening and closing `---` markers
2. Use templates from `.opencode/skills/system-spec-kit/templates/` which include the source marker

```bash
bash .opencode/skills/system-spec-kit/runtime/cli/spec/create.sh --level 1 --path specs/007-feature --name feature-name
```

---

## 9. COMPLEXITY_MATCH

**Severity:** WARNING
**Description:** Validates that declared complexity level matches actual content metrics (user stories, phases, tasks).

### Expected Ranges by Level

| Level | User Stories | Phases  | Tasks     |
| ----- | ------------ | ------- | --------- |
| 1     | 1-2          | 2-3     | 5-15      |
| 2     | 2-4          | 3-5     | 15-50     |
| 3/3+  | 4-15         | 5-12    | 50-200    |

### Detection Patterns

| Metric       | Pattern Searched                           |
| ------------ | ------------------------------------------ |
| User Stories | `### User Story` headers in spec.md        |
| Phases       | `### Phase` headers in plan.md             |
| Tasks        | `- [ ] T##` or `- [ ] TASK-` in tasks.md   |

### Examples

**Warning (under-scoped for Level 2):**
```
Declared Level: 2
Found: 1 user story, 2 phases, 8 tasks
Expected: 2-4 stories, 3-5 phases, 15-50 tasks
```

**Warning (over-scoped for Level 1):**
```
Declared Level: 1
Found: 5 user stories, 6 phases, 45 tasks
Expected: 1-2 stories, 2-3 phases, 5-15 tasks
```

### How to Fix

Either adjust the declared level or modify content to match:

1. **Upgrade level:** If content is complex, change `| **Level** | 1 |` to `| **Level** | 2 |`
2. **Reduce scope:** Split complex specs into multiple smaller specs
3. **Add content:** For sparse specs, add missing user stories, phases, or tasks

---

## 10. AI_PROTOCOLS

**Severity:** ERROR
**Description:** Validates that Level 3 and 3+ specs include AI execution protocol sections for agent guidance. For Level 3+, missing protocol components are reported as errors.

### Required for Level 3+

| Component             | Location        | Purpose                           |
| --------------------- | --------------- | --------------------------------- |
| AI Execution section  | plan/tasks.md   | Main protocol header              |
| Pre-Task Checklist    | plan/tasks.md   | Steps before starting any task    |
| Execution Rules       | plan/tasks.md   | TASK-SEQ, TASK-SCOPE constraints  |
| Status Format         | plan/tasks.md   | How to report progress            |
| Blocked Protocol      | plan/tasks.md   | What to do when stuck             |

### Scoring

- Level 3: Should have protocol section (warning if missing)
- Level 3+: Must have at least 3/4 components (error if fewer)

### Detection Patterns

```markdown
## AI EXECUTION PROTOCOL         ← Main section
### Pre-Task Checklist           ← Component 1
### Execution Rules              ← Component 2
### Status Reporting Format      ← Component 3
### Blocked Task Protocol        ← Component 4
```

### Examples

**Pass (Level 3+):**
```markdown
## AI EXECUTION PROTOCOL

### Pre-Task Checklist
- [ ] Read relevant files
- [ ] Verify preconditions

### Execution Rules
| Rule | Description |
|------|-------------|
| TASK-SEQ | Complete tasks in order |
| TASK-SCOPE | Only modify files in scope |

### Status Reporting Format
After each task: "Task T## complete. Files modified: [list]"

### Blocked Task Protocol
If blocked: Stop, document blocker, request help
```

### How to Fix

Add the AI Execution Protocol section to plan.md or tasks.md. Reference the Level 3 templates:

```bash
# See protocol examples in templates
cat .opencode/skills/system-spec-kit/templates/core/plan.md.tmpl
```

---

## 11. LEVEL_MATCH

**Severity:** ERROR
**Description:** Validates that the declared level is consistent across all spec folder files and required files exist.

### Consistency Checks

| Check                  | Description                                           |
| ---------------------- | ----------------------------------------------------- |
| Cross-file consistency | Level in spec.md matches level in plan.md, checklist  |
| Required files         | All files required for declared level exist           |
| File presence hints    | Warns if files suggest higher level than declared     |

### Required Files by Level

| Level | Required Files                                                                |
| ----- | ---------------------------------------------------------------------------- |
| 1     | spec.md, plan.md, tasks.md, implementation-summary.md (enforced once implementation starts — see §3) |
| 2     | Level 1 + acceptance-criteria.md                                                        |
| 3     | Level 2 + decision-record.md                                                  |
| 3+    | Level 3 set + Level-3+ governance section gates (see template-compliance-contract.md §6) |

### Examples

**Error (missing required file):**
```
Declared: Level 2
Missing: acceptance-criteria.md
```

**Error (inconsistent levels):**
```
spec.md declares: Level 2
plan.md declares: Level 1
```

**Warning (file suggests higher level):**
```
Declared: Level 1
Present: decision-record.md (suggests Level 3)
```

### How to Fix

1. **Add missing files:** Create required files for your level
2. **Fix level declarations:** Ensure all files declare the same level
3. **Upgrade level:** If you have Level 3 files, declare Level 3

```bash
# Add checklist for Level 2
bash .opencode/skills/system-spec-kit/runtime/cli/spec/create.sh --level 2 --path specs/007-feature --name feature-name
```

---

## 12. CONFIGURATION

### Environment Variables

| Variable             | Default | Description                       |
| -------------------- | ------- | --------------------------------- |
| `SPECKIT_VALIDATION` | true    | Set to `false` to skip validation |
| `SPECKIT_STRICT`     | false   | Set to `true` to run the strict-only rules |
| `SPECKIT_JSON`       | false   | Set to `true` for JSON output     |
| `SPECKIT_VERBOSE`    | false   | Set to `true` for verbose output  |
| `SPECKIT_POST_VALIDATE` | unset | Set to `1` during scaffolding to run `validate.sh --quiet` after `create.sh` writes files |

`validate.sh` delegates to the Node validation orchestrator by default. In a linked worktree whose `dist` directories are symlinks, run it with `NODE_OPTIONS=\"--preserve-symlinks --preserve-symlinks-main\"`; `NODE_PRESERVE_SYMLINKS=1` alone does not cover the main module and the orchestrator then exits 0 with no output. The strict path is designed for fast packet checks; packet 004 measured a fresh Level 3 strict validation at about 108ms on the local harness.

### Usage Examples

**Run validation on a spec folder:**
```bash
bash .opencode/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/007-feature/
```

**Run in strict mode (strict-only rules enabled; warnings stay advice):**
```bash
SPECKIT_STRICT=true bash .opencode/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/007-feature/
```

**Get JSON output for automation:**
```bash
SPECKIT_JSON=true bash .opencode/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/007-feature/
```

---

## 13. RELATED RESOURCES

### Reference Files

- level specifications reference - Documentation level requirements
- [template-guide.md](../templates/template-guide.md) - Template usage guide
- [path-scoped-rules.md](path-scoped-rules.md) - Path scoping overview
- [phase-definitions.md](../structure/phase-definitions.md) - Phase decomposition system

### Scripts

- `../../runtime/cli/spec/validate.sh` - Main validation script
- `../../runtime/cli/rules/` - Individual rule implementations

---
