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
    last_updated_at: "2026-09-27T14:56:00Z"
    last_updated_by: "phase-002-orchestrator"
    recent_action: "Marked all 17 criteria Met with observed Stage 2 evidence"
    next_safe_action: "Parent commits the phase and rebuilds the committed trigger index"
    blockers: []
    key_files:
      - "acceptance-criteria.md"
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:118e8d206b7446d8ac6cfdc57a912a2b3091f7b85857217bec043e43a35b4f2e"
      session_id: "75aab0e6-dcc7-401b-9d10-f48248374023"
      parent_session_id: null
    completion_pct: 100
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
**Status:** Complete
**Date:** 2026-09-27
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the final tree, When the residue scan reads every release, skill and packet-local entry, Then each one opens with a block holding all five canonical keys, and every exception is a dirty-skipped file named in the skip list (US-001) | `implementation-summary.md:130`. The residue scan's per-kind counts, and the skip list, both saved in the session scratch folder. Observed: The residue scan after the strip pass reads 1,959 entries, complete by kind: release 45 of 45, skill 542 of 542, packet 1,372 of 1,372, with 0 missing keys. The retrofit skipped 0 dirty files, so the skip list is empty. The three new component entries carry the block too | Met | - |
| AC-002 | REQ-001 | Given the retrofit's written entries, When each is compared with its preimage, Then the body after the closing fence is byte-identical and every key that existed keeps its value | `implementation-summary.md:131`. The preimage guard log, plus a scripted check that every `git diff` hunk lies inside the leading block. Observed: The retrofit guard failed 0 of 1,959 entries in the apply pass and 0 of 468 in the strip pass. A scripted read of `git diff -U0 HEAD` found 1,987 hunks across the 1,959 entries and none outside the leading block. PyYAML parses all 1,959 blocks with the five keys typed correctly | Met | - |
| AC-003 | REQ-002 | Given the final tree, When the identity rule is recomputed for each entry, Then each entry declares the identity phrases its kind requires (US-001) | `implementation-summary.md:130` and `.skilled/skills/system-spec-kit/runtime/cli/spec-folder/nested-changelog.ts:667`. The residue scan's identity column, 0 missing outside the skip list. Observed: The residue scan's identity column reads 0 missing for every kind, and the skip list is empty | Met | - |
| AC-004 | REQ-003 | Given sk-create-changelog's SKILL.md, template and both command YAMLs, When the format contract, step 4 and step 5 are read side by side, Then each requires, generates or checks the same block and identity phrases (US-002) | `.skilled/skills/sk-doc/sk-create-changelog/SKILL.md:252` and `.skilled/commands/create/assets/create-changelog-auto.yaml:510`. The reviewed diffs of the five files, and CHG-011's recorded run. Observed: The diffs of `SKILL.md` (Frontmatter Contract, step 4, global check 15, nested check 6), `changelog-template.md` (both skeletons) and both command YAMLs (a FRONTMATTER step and the format checks) state the same five keys and identity phrases. CHG-011 ran on the sk-doc draft: `name: sk-doc`, the five keys in order and a validator exit of 0 | Met | - |
| AC-005 | REQ-004 | Given the rebuilt nested generator, When it renders a phase entry and a root entry, Then `trigger_phrases` holds the identity phrase and none of the five template defaults (US-002) | `.skilled/skills/system-spec-kit/runtime/cli/spec-folder/nested-changelog.ts:771` and `implementation-summary.md:121`. `npx vitest run runtime/cli/tests/nested-changelog.vitest.ts`, and a render of this folder without `--write`. Observed: `npx vitest run runtime/cli/tests/nested-changelog.vitest.ts` passes 6 of 6. Rendering this folder without `--write` gives `skilled release changelog findability changelog`, the root gives `skilled release changelog`, and neither render carries a template default | Met | - |
| AC-006 | REQ-005 | Given a scratch index built from the final tree, When the generator publishes it, Then it reports 0 malformed documents, grows no more than 10 percent over the same-day baseline and adds no negative phrase class | `implementation-summary.md:127`. `generate-trigger-index.mjs` output for both builds, with every output path in scratch. Observed: Both builds published with 0 malformed documents. The index grew from 3,288,752 to 3,533,560 bytes, 7.44 percent. Every negative phrase class kept its count, and no class was added | Met | - |
| AC-007 | REQ-005 | Given that final scratch index, When `measure-cold-lookup.mjs` runs three times, Then p95 and max stay under 200 ms each time | `implementation-summary.md:128`. The three latency reports in scratch. Observed: Three runs gave p95 and max of 65.2 and 66.2 ms, 61.8 and 63.8 ms, and 60.5 and 62.2 ms, all under 200 ms | Met | - |
| AC-008 | REQ-006 | Given the baseline and final scratch indexes, When one identity phrase per kind is looked up in each, Then the target is absent or unscored before and ranked first after, and two negative controls score nothing for the target (US-001) | `implementation-summary.md:129`. `lookup-trigger-index.mjs --json --index <scratch index>` results read by rank, match class and score. Observed: Identity phrases for a release, a skill and a packet entry, plus the new sk-create-changelog entry, were absent before and ranked first with an exact 1.0 score after. `stripe webhook signature` never reached the target, and `phase changelog` fell from rank 2 at 1.0 to unscored for its former carrier | Met | - |
| AC-009 | REQ-007 | Given the skill and release entries, When their descriptions are read, Then every one has a description, the reported ones quote the entry's opening sentence and the 15 model-written ones pass the checker and the voice scan | `implementation-summary.md:106` and `decision-record.md:138`. The checker log, and `hvr_scan.py` on the 15 residue descriptions. Observed: All 529 skill and release entries that lacked a description now have one. 517 quote the entry's opening sentence, under a sentence rule that keeps in-word stops such as `v1.3` and `SKILL.md` inside the sentence. The 12 model-written ones passed the checker, whose rules include `hvr_scan.py` | Met | - |
| AC-010 | REQ-008 | Given the entries that declared no phrase, When their frontmatter is read, Then each carries a topic phrase or appears in the lane-failure list, and a looked-up model topic phrase ranks its entry first (US-003) | `implementation-summary.md:62`. The checker log, the lane-failure list and one topic probe. Observed: Every entry that declared no phrase now carries a topic phrase, 532 of 532, and the lane-failure list is empty after one retry batch. `esm module compliance`, a model topic phrase, ranks its entry first at 1.0 | Met | - |
| AC-011 | REQ-009 | Given the new validator check, When it runs on an entry with no block, a missing key or no version phrase, and on a README in a changelog folder, Then the first three block and the README passes | `.skilled/skills/sk-doc/shared/scripts/validate_document.py:1503` and `implementation-summary.md:123`. `python3 -m pytest -p no:cacheprovider .skilled/skills/sk-doc/scripts/tests/test_changelog_validator.py`, and a sweep over every entry. Observed: pytest passes 7 of 7, and its five new cases cover the missing block, the complete entry, a missing key, a missing version phrase and a README. The sweep over 2,194 entry-named files found every one of the 1,959 entries clean. It flagged 63 files outside the retrofit: 59 in `z_archive` and 4 review containment copies | Met | - |
| AC-012 | REQ-010 | Given the playbook with CHG-011 and CHG-012, When the package validator runs, Then it passes with 12 scenarios in 5 categories | `.skilled/skills/sk-doc/sk-create-changelog/manual-testing-playbook/manual-testing-playbook.md:147` and `implementation-summary.md:124`. `validate-playbook-package.cjs --package sk-doc/sk-create-changelog`. Observed: `validate-playbook-package.cjs --package sk-doc/sk-create-changelog` prints PASS with 12 scenarios in 5 categories and exits 0 | Met | - |
| AC-013 | REQ-011 | Given sk-create-changelog's next entry, When it is validated, Then it carries the block, passes the new check and the voice scan, and `SKILL.md` names the same version | `.skilled/skills/sk-doc/sk-create-changelog/SKILL.md:5` and `.skilled/skills/sk-doc/sk-create-changelog/changelog/v1.3.0.0.md:1`. `validate_document.py`, `hvr_scan.py` and `check-frontmatter-versions.sh` on the final tree. Observed: `v1.3.0.0.md` is VALID under the enforced check, `hvr_scan.py` reports 0 hard blockers and 0 deductions, `SKILL.md` names 1.3.0.0 and `check-frontmatter-versions.sh` exits 0 | Met | - |
| AC-014 | REQ-012 | Given the operator approved the removal, When the carriers are counted after the strip pass, Then no packet-local entry carries a template default and no body changed | `implementation-summary.md:130` and `decision-record.md:434`. The carrier count before and after, and the hunk check from AC-002. Observed: The carrier count fell from 468 to 0 after the strip pass removed 1,337 phrase members. The hunk check from AC-002 covered the stripped files, and no body changed | Met | - |
| AC-015 | REQ-013 | Given the final tree, When the ripgrep lane searches an identity phrase of each kind, Then it returns trigger-phrase evidence from the entry's frontmatter | `implementation-summary.md:132`. `rg-wrapper.mjs structured "<identity phrase>" --json` for each kind. Observed: `rg-wrapper.mjs structured --json` returned an exact `trigger_phrases` hit from the entry's frontmatter for `skilled v3.4.0.0`, `sk-git v1.0.0.0` and `memory store and search changelog`, all exit 0 | Met | - |
| AC-016 | NFR-S02 | Given the final working tree, When its status is compared with the Stage 2 starting snapshot, Then only the planned write set changed, and nothing under retrieval, the committed index, its fixtures or `.hermes/**` did | `implementation-summary.md:68`. `git status --porcelain` before and after, with the diff of the two lists. Observed: Against the Stage 2 starting snapshot, 1,989 paths changed: 1,959 entries, 21 planned files and 9 paths from other sessions, with none unexplained. No path changed under the retrieval runtime, the committed index, its fixtures or `.hermes/**`. The parent's later Hermes sync regenerated the three `.hermes/skills` copies that this phase's version changes left stale, outside the lanes' write set | Met | - |
| AC-017 | NFR-R01 | Given the finished tree, When the retrofit runs a second time, Then it reports no change | `implementation-summary.md:133`. The second run's summary line. Observed: A second completion run changed 0 of 1,959 entries, and a second strip run removed 0 phrases | Met | - |

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

**Closeable:** Yes

Stage 2 met all 17 criteria, and none is waived. The operator approved the removal of the template defaults, so AC-014 stands as written under ADR-005. Every observation came from commands whose output and exit status were read, with logs kept in the session scratch folder outside the repository.
<!-- /ANCHOR:closure -->
