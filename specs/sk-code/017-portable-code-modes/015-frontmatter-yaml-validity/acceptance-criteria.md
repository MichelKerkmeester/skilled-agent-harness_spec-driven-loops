---
title: "Acceptance Criteria: Phase 15: frontmatter-yaml-validity"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "frontmatter yaml validity acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/017-portable-code-modes/015-frontmatter-yaml-validity"
    last_updated_at: "2026-10-28T06:20:00Z"
    last_updated_by: "implementer"
    recent_action: "Met every criterion with the scan, the validator and both test files"
    next_safe_action: "Conductor flips the parent phase row, saves the packet and commits"
    blockers: []
    key_files:
      - ".skilled/skills/sk-doc/shared/scripts/validate_document.py"
      - ".skilled/skills/sk-doc/scripts/tests/test_frontmatter_yaml.py"
      - ".skilled/skills/sk-doc/scripts/tests/test_frontmatter_fleet.py"
      - ".skilled/skills/sk-code/sk-code-quality/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "frontmatter-yaml-validity-implementer"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 15: frontmatter-yaml-validity

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `015-frontmatter-yaml-validity`
**Level:** 2
**Status:** Complete
**Date:** 2026-10-28
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given every tracked `.skilled` Markdown file that opens with a frontmatter fence, When the block is parsed with `yaml.safe_load`, Then only `fixtures/grep-convention/non-yaml.md` is rejected | Scan at base `65bafca332`: `29 blocks rejected`. Working tree: `1 block rejected`, `fixtures/grep-convention/non-yaml.md:2: expected a comment or a line break, but found 'C'`. Same parse in the suite: `test_frontmatter_fleet.py:69`, exclusion at `:30` | Met | - |
| AC-002 | REQ-002 | Given the base version of the quality `SKILL.md`, When `validate_document.py --json` runs on it, Then it reports one blocking `frontmatter_invalid_yaml` with that line, and the repaired file reports 0 | Base file: `"total_issues": 0` under the base validator, `total_issues 1` with `frontmatter_invalid_yaml blocking line 3` once the check exists. Repaired file: `total_issues 0`. Code: `validate_document.py:1783`, called at `:1958` | Met | - |
| AC-003 | REQ-003 | Given an interpreter that cannot import PyYAML, When the same block is checked, Then the line check returns the same issue type and line | `test_frontmatter_yaml.py` prints `17/17 passed` under `/usr/bin/python3` (PyYAML 6.0.3) and under `/opt/homebrew/bin/python3` (ImportError for `yaml`); the parity cases run each verdict through `_unquoted_colon_line` at `validate_document.py:1805` | Met | - |
| AC-004 | REQ-004 | Given the 28 repaired blocks, When each is compared with its base version, Then no value is reworded and no body text moves | Per-key comparison after stripping the added quotes: `0 changed values`; body text identical in all 28. The only value differences are the two carriers stepped and the escaped inner quotes of two `cupt` examples. The playbook's `version: 2.1.0.20` moved to the end of its block, keys equal. Quoted value: `.skilled/skills/sk-code/sk-code-quality/SKILL.md:3` | Met | - |
| AC-005 | REQ-005 | Given the nine `SKILL.md` metadata blocks and the plugin manifest, When the headers are read, Then no `author` key remains and no code reads one | Working tree: 0 frontmatter blocks under `.skilled` carry an `author` key; `author: "OpenCode"` is gone from `.hermes/plugins/repo-guards/plugin.yaml`. `rg -n 'metadata\.author'` over the scripts prints nothing; the one `'author'` literal is a stop-word at `trigger-extractor.ts:58` | Met | - |
| AC-006 | REQ-006 | Given the 24 touched skills and modes, When their changelog entries are validated, Then each reports 0 issues and its carriers state that version | 24 entries, each `"total_issues": 0`. `sk-code-quality/SKILL.md:5` reads `version: 1.13.8.0`, matched by `hub-router.json`, `description.json`, `mode-registry.json` and the refreshed manifest. `compiled-route-guard` exit 0, `compiled-route-sync.cjs --check` exit 0, `parent-skill-check` clean on the five hubs | Met | - |
| AC-007 | REQ-007 | Given the two new test files, When they run, Then the unit test prints 17/17 under both interpreters, the fleet test passes both its tests, and the sk-doc suite passes | `17/17 passed` twice, exit 0; `2 passed in 3.96s`, exit 0; `run-script-tests.sh` prints `all sk-doc script tests passed`, 45 `PASS`, 0 `FAIL`, exit 0. Exclusion-live case: `test_frontmatter_fleet.py:89` | Met | - |

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

Every criterion is met, and the one block the scan still rejects is the fixture the retrieval tests are built around.
<!-- /ANCHOR:closure -->
