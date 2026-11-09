---
title: "Stale index fallback"
description: "Searches newly written spec packet docs when the trigger index returns no scored candidate."
trigger_phrases:
  - "Stale index fallback"
  - "unindexed spec packet search"
  - "lookup-trigger-index.mjs stale fallback"
  - "find a packet before the trigger index is rebuilt"
version: 1.0.0.0
---

# Stale index fallback (lookup-trigger-index.mjs)

## 1. OVERVIEW

Searches newly written spec packet docs when the trigger index returns no scored candidate.

That keeps a packet findable after it is written and before the committed trigger index is rebuilt.

---

## 2. HOW IT WORKS

When the index has no scored candidate, `lookup-trigger-index.mjs` checks whether the caller is inside a Git work tree and then scans eligible docs under `specs/`. It skips the scan when the index already has a scored hit, `--no-stale-fallback` is set or the caller passes `--index`.

The scanner follows the index generator's directory-pruning rules. It considers recognized packet filenames that the index does not list and scores only their declared frontmatter `trigger_phrases`. The read is capped at 500 docs, and packet body text does not affect matching.

JSON adds `staleFallback` with availability, files read, match count, matching paths and truncation. Human output reports the docs read and matches. A fallback hit exits 0. A lookup with no scored match exits 1, and a caller outside a Git work tree sees an unavailable fallback. The fallback does not detect a changed trigger phrase in a document already listed by the index; `generate-trigger-index.mjs --check` reports that drift.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs` | Script | Runs the fallback after an index miss, merges its matches and reports fallback status |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/unindexed-docs.mjs` | Shared | Finds unindexed packet docs and scores their declared trigger phrases |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs` | Shared | Supplies the directory-pruning rules shared with index generation |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs` | Script | Checks for trigger-index drift in docs already listed by the index |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/system-spec-kit/runtime/cli/tests/stale-fallback.vitest.ts` | Automated test | Covers fallback matching, disabled mode, result limits and human output |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/retrieval-coverage-parity.vitest.ts` | Automated test | Checks that retrieval coverage follows the shared corpus rules |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/retrieval/stale-index-fallback.md` | Manual playbook | Checks that a user can find an unindexed packet through the fallback |

---

## 4. SOURCE METADATA

- Group: Retrieval
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `retrieval/stale-index-fallback.md`

Related references:
- [trigger-lookup-total-candidates.md](trigger-lookup-total-candidates.md) - Documents candidate counts from the committed trigger-index lookup.
- [session-recovery-spec-kit-resume.md](session-recovery-spec-kit-resume.md) - Describes trigger lookup as one packet-discovery option.
