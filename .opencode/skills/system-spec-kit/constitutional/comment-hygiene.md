---
title: "Comment Hygiene — No Ephemeral Artifact Pointers in Code Comments"
importanceTier: constitutional
contextType: decision
triggerPhrases:
  # Code comment writes
  - code comment
  - inline comment
  - add comment
  - write comment
  - source comment
  # Ephemeral label patterns that must be caught
  - spec path
  - packet number
  - ADR id
  - ADR-
  - REQ-
  - CHK-
  - finding id
  - task id
  # Enforcement surfaces
  - check-comment-hygiene
  - comment hygiene
  - ephemeral artifact
  - ephemeral pointer
---

# Comment Hygiene — No Ephemeral Artifact Pointers in Code Comments

> Always-surface constitutional rule. Enforcement at pre-commit gate and Claude Code PostToolUse hook.

## The Rule

Never embed spec-folder paths, packet/phase numbers, ADR ids, task/checklist/requirement ids, or finding ids in code comments. These labels are perishable — they rot as specs are renamed, renumbered, consolidated, or archived.

Keep the durable WHY (the reason the code exists or behaves a certain way). Drop the perishable label (the ephemeral identifier that points to it).

## Forbidden vs. Allowed

| Category | Forbidden (perishable) | Allowed (durable) |
| -------- | ---------------------- | ----------------- |
| Spec paths | `.opencode/specs/012-foo/` | — |
| Packet/phase numbers | `see packet 031`, `phase 004` | — |
| ADR identifiers | `ADR-017`, `per ADR-003` | full rationale inline |
| Requirement ids | `REQ-042`, `CHK-007` | plain-language description |
| Task/checklist ids | `T042`, `checklist item 3` | — |
| Finding ids | `P1-finding-2`, `finding #7` | — |
| Standard body refs | — | `CWE-89`, `RFC 7230`, `POSIX 2017`, `WEBFLOW:`, `ISO 8601` |

Standard body identifiers (CWE, RFC, POSIX, platform tags) are stable and durable — use them freely.

## Code Example

```python
# BAD — ephemeral pointer that rots
# Fix per ADR-017 and REQ-042 (spec: .opencode/specs/031-embedding-stack/004-wal/)
conn.execute("PRAGMA wal_checkpoint(TRUNCATE)")

# GOOD — durable WHY
# Truncate WAL on close to prevent unbounded growth on long-idle connections.
conn.execute("PRAGMA wal_checkpoint(TRUNCATE)")
```

## Enforcement

Three gates check every code comment write:

1. **Pre-commit gate** — `check-comment-hygiene.sh` runs as a pre-commit hook and fails the commit if any staged file contains forbidden patterns in comments.
2. **Claude Code PostToolUse hook** — fires after every Edit/Write tool call and flags violations inline before the response is returned.
3. **CI gate** — `.github/workflows/comment-hygiene.yml` re-validates on every PR to main; this gate cannot be bypassed with `--no-verify`.

The pre-commit gate cannot be bypassed with `--no-verify` but can be skipped with `SPECKIT_SKIP_COMMENT_HYGIENE=1` (requires explicit operator intent). The CI gate cannot be bypassed from the command line. Individual lines may be exempted by appending `// hygiene-ok` — use only for documented false-positives (e.g. stable standard-body refs that trigger a pattern).

*Constitutional Memory — Always surfaces at top of search results*
