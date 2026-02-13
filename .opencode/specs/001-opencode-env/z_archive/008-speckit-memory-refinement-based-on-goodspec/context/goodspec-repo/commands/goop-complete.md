---
name: goop-complete
description: Complete and archive the current milestone
---

# /goop-complete

**Complete a milestone.** Archive artifacts and extract learnings.

## Usage

```bash
/goop-complete
```

## How It Works

Marks the end of a significant body of work (a Milestone). It focuses on cleanup, reflection, and memory persistence.

### 1. Archival
Moves active artifacts (`SPEC.md`, `BLUEPRINT.md`, etc.) to `.goopspec/archive/<milestone-slug>/`.

### 2. Retrospective
Generates `RETROSPECTIVE.md` analyzing:
- What went well?
- What failed?
- Metrics (Time, diff size).

### 3. Memory Extraction
Parses the session for reusable knowledge:
- **Patterns:** "We used Recoil for state."
- **Decisions:** "Chosen Redis over Memcached."
- **Gotchas:** "Beware of circular deps in utils."
These are saved to persistent memory.

### 4. Tagging
Optionally creates a git tag for the release.

## Output
- Archived files.
- `RETROSPECTIVE.md`.
- Memory updates.

## Example
> **User:** `/goop-complete`
> **Agent:** "Milestone 'Auth V1' archived.
> Retrospective generated.
> Saved 3 new patterns to memory.
> Ready for next milestone."
