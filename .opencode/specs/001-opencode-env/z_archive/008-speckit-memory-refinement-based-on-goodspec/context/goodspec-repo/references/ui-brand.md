# GoopSpec UI Brand Guide

GoopSpec has a distinctive visual identity that differs from other AI development tools. Our aesthetic is **clean**, **organic**, and **professional**.

## Brand Symbol

The **hexagon** `⬢` represents GoopSpec - evoking molecules, honeycombs, and interconnected systems. It appears at the start of all GoopSpec UI elements.

## Message Formats

### Standard Header (Gates, Major Sections)

```
╭─ ⬢ GoopSpec ───────────────────────────────────────╮
│                                                    │
│  SECTION TITLE                                     │
│                                                    │
╰────────────────────────────────────────────────────╯
```

### Compact Header (Status, Progress)

```
⬢ GoopSpec · Section Title
──────────────────────────────────────────────────────
```

### Inline Indicator

```
⬢ message here
```

## Gate Messages

### Contract Gate (Specify Phase)

```
╭─ ⬢ GoopSpec ───────────────────────────────────────╮
│                                                    │
│  🔒 CONTRACT GATE                                  │
│                                                    │
│  The specification is ready to lock.               │
│                                                    │
│  MUST HAVES:                                       │
│  • Requirement 1                                   │
│  • Requirement 2                                   │
│                                                    │
│  OUT OF SCOPE:                                     │
│  • Excluded item                                   │
│                                                    │
│  ─────────────────────────────────────────────     │
│  Type "confirm" to lock and proceed.               │
│                                                    │
╰────────────────────────────────────────────────────╯
```

### Acceptance Gate (Accept Phase)

```
╭─ ⬢ GoopSpec ───────────────────────────────────────╮
│                                                    │
│  ✓ ACCEPTANCE GATE                                 │
│                                                    │
│  Implementation complete. Verification:            │
│                                                    │
│  ☑ Requirement 1 - verified                        │
│  ☑ Requirement 2 - verified                        │
│                                                    │
│  Tests: 24/24 passing                              │
│  Build: Successful                                 │
│                                                    │
│  ─────────────────────────────────────────────     │
│  Type "accept" to confirm completion.              │
│                                                    │
╰────────────────────────────────────────────────────╯
```

## Status Messages

### Workflow Status

```
⬢ GoopSpec · Status
──────────────────────────────────────────────────────

Project: my-project
Phase:   ⬢ execute (wave 2/4)
Mode:    standard

Progress: [████████░░░░] 67%

Tasks:
  ☑ Task 1.1 - complete
  ☑ Task 1.2 - complete
  ◉ Task 2.1 - in progress
  ○ Task 2.2 - pending

──────────────────────────────────────────────────────
```

### Phase Transition

```
⬢ GoopSpec · Phase Complete
──────────────────────────────────────────────────────

✓ Research phase complete

Findings saved to RESEARCH.md
3 recommendations identified
2 risks documented

Ready for: /goop-specify

──────────────────────────────────────────────────────
```

## Progress Indicators

### Task Status Icons

| Icon | Meaning |
|------|---------|
| `○` | Pending |
| `◉` | In Progress |
| `☑` | Complete |
| `☒` | Failed |
| `◌` | Skipped |

### Phase Icons

| Icon | Phase |
|------|-------|
| `📝` | Plan |
| `🔍` | Research |
| `📋` | Specify |
| `🔨` | Execute |
| `✓` | Accept |

### Mode Icons

| Icon | Mode |
|------|------|
| `⚡` | Quick |
| `📦` | Standard |
| `🏗️` | Comprehensive |
| `🎯` | Milestone |

## Completion Messages

### Task Complete

```
⬢ Task 2.1 complete (commit: abc123)
```

### Wave Complete

```
⬢ GoopSpec · Wave Complete
──────────────────────────────────────────────────────

Wave 2 of 4 complete

Tasks: 3/3 ☑
Commits: 3 atomic commits
Time: 4m 32s

Ready for Wave 3

──────────────────────────────────────────────────────
```

### Milestone Complete

```
╭─ ⬢ GoopSpec ───────────────────────────────────────╮
│                                                    │
│  🎯 MILESTONE COMPLETE                             │
│                                                    │
│  v1.0 Authentication System                        │
│                                                    │
│  Delivered:                                        │
│  • User login/logout                               │
│  • Session management                              │
│  • OAuth integration                               │
│                                                    │
│  Archived: .goopspec/archive/v1.0-auth/            │
│  Learnings: 5 patterns extracted                   │
│                                                    │
╰────────────────────────────────────────────────────╯
```

## Error & Warning Messages

### Warning

```
⬢ Warning: High comment density (35%)
  Consider reducing comments in src/auth/login.ts
```

### Error

```
⬢ Error: Phase transition blocked
  Cannot skip from 'plan' to 'execute'
  Required: Complete 'research' phase first
```

### Deviation

```
⬢ Deviation (Rule 2): Added missing error handling
  File: src/api/users.ts
  Logged to ADL
```

## Character Reference

| Character | Use |
|-----------|-----|
| `⬢` | GoopSpec brand symbol |
| `╭╮╰╯` | Rounded box corners |
| `─` | Horizontal lines |
| `│` | Vertical lines |
| `·` | Separator dot |
| `○◉☑☒◌` | Task status |
| `►` | Action prompt |

## Color Guidelines

When color is available:
- **Green** `#65f463` - GoopSpec brand, success
- **Blue** - Information, links
- **Yellow** - Warnings, attention
- **Red** - Errors, failures
- **Gray** - Secondary info, disabled

## Anti-Patterns

### Don't Use

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  GOOPSPEC > SECTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

This heavy style with `━` characters and `>` separator is used by other tools.

### Do Use

```
╭─ ⬢ GoopSpec ───────────────────────────────────────╮
│  SECTION                                           │
╰────────────────────────────────────────────────────╯
```

The rounded box with hexagon symbol is uniquely GoopSpec.
