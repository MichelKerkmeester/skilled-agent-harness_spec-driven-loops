# Phase 005 — Root README Update (Opus, surgical)

> Charter only. Full narrative in `../plan.md` §4 Phase 5.

## Goal

Refresh the public root `README.md` to the v4 state — **targeted edits, no regeneration.**

## Inputs

- `004-release-notes-reduce/release-notes-v4.0.0.0.md`.
- Current `README.md` (98 KB / 1,300+ lines).

## Known targets

- Version field / release badge → v4.
- **Stale link at line ~1311** ("Latest System Spec-Kit Release Notes" → `v3.6.0.0.md`) → v4 notes.
- Only the capability sections the breaking/added items actually changed (new cli skills, deep-loop
  modes, sk-doc/sk-design/mcp-tooling hubs, advisor refactor).

## Constraints

- Read before edit; surgical diffs only; no opportunistic cleanup (SCOPE LOCK).
- Every changed claim traceable to a release-note item.

## Exit criteria

- README version + release link current.
- Changed sections match the release notes; unrelated content untouched (verify via scoped diff).
