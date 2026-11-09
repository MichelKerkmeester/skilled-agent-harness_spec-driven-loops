---
title: "Trigger lookup total candidates"
description: "Reports the ranked trigger-index candidate total before applying --limit and indicates when results are truncated."
trigger_phrases:
  - "Trigger lookup total candidates"
  - "total trigger-index candidate count"
  - "trigger lookup truncation"
  - "lookup-trigger-index.mjs"
version: 1.0.0.0
---

# Trigger lookup total candidates (lookup-trigger-index.mjs)

## 1. OVERVIEW

Reports the ranked trigger-index candidate total before applying `--limit` and indicates when results are truncated.

The lookup counts documents after the optional `--scoring-only` filter and before applying the result limit. JSON always includes `totalCandidates` and `truncated`; the human summary adds the total only when the limit truncates results. Hit, clean no-hit and error exit codes remain unchanged.

---

## 2. HOW IT WORKS

`lookup-trigger-index.mjs` ranks matching documents, applies `--scoring-only` when requested, records that candidate count, and then applies `--limit`. The `truncated` field is true only when a non-zero limit is smaller than the candidate count.

With a truncated result, the human summary reports both counts, such as `candidates : 2 of 14 (truncated) from 9 phrase(s)`. An untruncated result keeps the existing form, such as `candidates : 6 from 9 phrase(s)`.

Section 9 of `retrieval-conventions.md` records that the trigger index skips `specs/**/research/**` run output except `research/research.md`, while ripgrep still searches those files as raw evidence.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs` | Script | Counts ranked documents before the result limit and reports truncation in JSON and human-readable output |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/system-spec-kit/runtime/cli/tests/trigger-index.vitest.ts` | Automated test | Covers trigger-index lookup ranking, scoring-only filtering and hit/no-hit CLI behavior |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/retrieval-coverage-parity.vitest.ts` | Automated test | Enforces the documented trigger-index and ripgrep corpus differences |
| `.skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md` | Reference | Section 9 documents deliberate coverage differences, including research run output |

---

## 4. SOURCE METADATA

- Group: Retrieval
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `retrieval/trigger-lookup-total-candidates.md`

Related references:
- [session-recovery-spec-kit-resume.md](session-recovery-spec-kit-resume.md) - Trigger-index lookup is a prompt-to-packet fallback in session recovery.
