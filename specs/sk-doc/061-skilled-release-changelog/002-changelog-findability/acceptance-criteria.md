---
title: "Acceptance Criteria: Phase 2: changelog-findability"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "changelog findability acceptance criteria"
  - "changelog metadata closure gate"
  - "changelog findability evidence"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/061-skilled-release-changelog/002-changelog-findability"
    last_updated_at: "2026-09-27T12:51:52Z"
    last_updated_by: "phase-002-orchestrator"
    recent_action: "Wrote the Stage 2 acceptance criteria, all Unmet"
    next_safe_action: "Meet each row in Stage 2 after the parent's release message"
    blockers:
      - "Stage 2 waits for the parent's release message"
    key_files:
      - "acceptance-criteria.md"
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:118e8d206b7446d8ac6cfdc57a912a2b3091f7b85857217bec043e43a35b4f2e"
      session_id: "75aab0e6-dcc7-401b-9d10-f48248374023"
      parent_session_id: null
    completion_pct: 15
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 2: changelog-findability

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/061-skilled-release-changelog/002-changelog-findability
**Level:** 3
**Status:** Draft
**Date:** 2026-09-27
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the final tree, When the residue scan reads every release, skill and packet-local entry, Then each one opens with a block holding all five canonical keys, and every exception is a dirty-skipped file named in the skip list (US-001) | The residue scan's per-kind counts, and the skip list, both saved in the session scratch folder | Unmet | - |
| AC-002 | REQ-001 | Given the retrofit's written entries, When each is compared with its preimage, Then the body after the closing fence is byte-identical and every key that existed keeps its value | The preimage guard log, plus a scripted check that every `git diff` hunk lies inside the leading block | Unmet | - |
| AC-003 | REQ-002 | Given the final tree, When the identity rule is recomputed for each entry, Then each entry declares the identity phrases its kind requires (US-001) | The residue scan's identity column, 0 missing outside the skip list | Unmet | - |
| AC-004 | REQ-003 | Given sk-create-changelog's SKILL.md, template and both command YAMLs, When the format contract, step 4 and step 5 are read side by side, Then each requires, generates or checks the same block and identity phrases (US-002) | The reviewed diffs of the five files, and CHG-011's recorded run | Unmet | - |
| AC-005 | REQ-004 | Given the rebuilt nested generator, When it renders a phase entry and a root entry, Then `trigger_phrases` holds the identity phrase and none of the five template defaults (US-002) | `npx vitest run runtime/cli/tests/nested-changelog.vitest.ts`, and a render of this folder without `--write` | Unmet | - |
| AC-006 | REQ-005 | Given a scratch index built from the final tree, When the generator publishes it, Then it reports 0 malformed documents, grows no more than 10 percent over the same-day baseline and adds no negative phrase class | `generate-trigger-index.mjs` output for both builds, with every output path in scratch | Unmet | - |
| AC-007 | REQ-005 | Given that final scratch index, When `measure-cold-lookup.mjs` runs three times, Then p95 and max stay under 200 ms each time | The three latency reports in scratch | Unmet | - |
| AC-008 | REQ-006 | Given the baseline and final scratch indexes, When one identity phrase per kind is looked up in each, Then the target is absent or unscored before and ranked first after, and two negative controls score nothing for the target (US-001) | `lookup-trigger-index.mjs --json --index <scratch index>` results read by rank, match class and score | Unmet | - |
| AC-009 | REQ-007 | Given the skill and release entries, When their descriptions are read, Then every one has a description, the reported ones quote the entry's opening sentence and the 15 model-written ones pass the checker and the voice scan | The checker log, and `hvr_scan.py` on the 15 residue descriptions | Unmet | - |
| AC-010 | REQ-008 | Given the entries that declared no phrase, When their frontmatter is read, Then each carries a topic phrase or appears in the lane-failure list, and a looked-up model topic phrase ranks its entry first (US-003) | The checker log, the lane-failure list and one topic probe | Unmet | - |
| AC-011 | REQ-009 | Given the new validator check, When it runs on an entry with no block, a missing key or no version phrase, and on a README in a changelog folder, Then the first three block and the README passes | `python3 -m pytest -p no:cacheprovider .skilled/skills/sk-doc/scripts/tests/test_changelog_validator.py`, and a sweep over every entry | Unmet | - |
| AC-012 | REQ-010 | Given the playbook with CHG-011 and CHG-012, When the package validator runs, Then it passes with 12 scenarios in 5 categories | `validate-playbook-package.cjs --package sk-doc/sk-create-changelog` | Unmet | - |
| AC-013 | REQ-011 | Given sk-create-changelog's next entry, When it is validated, Then it carries the block, passes the new check and the voice scan, and `SKILL.md` names the same version | `validate_document.py`, `hvr_scan.py` and `check-frontmatter-versions.sh` on the final tree | Unmet | - |
| AC-014 | REQ-012 | Given the operator approved the removal, When the carriers are counted after the strip pass, Then no packet-local entry carries a template default and no body changed | The carrier count before and after, and the hunk check from AC-002 | Unmet | - |
| AC-015 | REQ-013 | Given the final tree, When the ripgrep lane searches an identity phrase of each kind, Then it returns trigger-phrase evidence from the entry's frontmatter | `rg-wrapper.mjs structured "<identity phrase>" --json` for each kind | Unmet | - |
| AC-016 | NFR-S02 | Given the final working tree, When its status is compared with the Stage 2 starting snapshot, Then only the planned write set changed, and nothing under retrieval, the committed index, its fixtures or `.hermes/**` did | `git status --porcelain` before and after, with the diff of the two lists | Unmet | - |
| AC-017 | NFR-R01 | Given the finished tree, When the retrofit runs a second time, Then it reports no change | The second run's summary line | Unmet | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** No

Stage 1 wrote these criteria and met none of them, because Stage 2 has not started. AC-014 becomes Waived by ADR-005 if the operator declines the removal of the template defaults.
<!-- /ANCHOR:closure -->
