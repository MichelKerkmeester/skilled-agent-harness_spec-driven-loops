---
title: "Acceptance Criteria: manifest and template block"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "agents md manifest acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "agents/021-doctor-agents-md/001-doctor-agents-md/001-manifest-and-template-block"
    last_updated_at: "2026-10-30T12:40:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet the open criteria, then mark each one Met with its command output"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "worktree-292-doctor-agents-md"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: manifest and template block

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `agents/021-doctor-agents-md/001-doctor-agents-md/001-manifest-and-template-block`
**Level:** 2
**Status:** Implemented
**Date:** 2026-10-30
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the root `AGENTS.md`, When the segmenter runs, Then it yields 44 sections whose start bytes match the table and whose match prefixes each find their section | `node --test .skilled/commands/doctor/scripts/tests/agents-md-manifest.test.cjs` case names the 44 sections and passes **Observed:** the suite's `segmenter: 44 sections tile the root document and their start bytes match the table` passes against the 44 level-1 to level-4 headings the root file carries and the 44 rows the design's section table lists; `segmenter: every authored match prefix finds exactly one section` proves each prefix finds its own heading | Met | - |
| AC-002 | REQ-002 | Given a root file with a heading no authored entry matches, or an authored entry matching nothing, When the generator runs, Then it exits 1 | the suite's two refusal cases pass **Observed:** `generator refusal: a heading no authored entry matches exits 1 and names it` and `generator refusal: an authored entry that matches nothing exits 1 and names it`, both exit 1 with the heading or the id printed | Met | - |
| AC-003 | REQ-003 | Given a one-byte edit to a temporary copy of the derived body, or an authored ceiling the canary does not state, When `--check` runs, Then it exits 1 | the suite's drift and ceiling cases pass **Observed:** `derived key: a one-byte edit to a copy of a derived body exits 1` flips one byte inside a copied body and `--check` exits 1, naming the section; `limits: a budget ceiling the canary does not state exits 1` raises `max_bytes` to `40960` and the run exits 1 with `budget max_bytes: the manifest states 40960, the canary enforces 32768` and offers no `--write`, which cannot change an authored ceiling | Met | - |
| AC-004 | REQ-004 | Given each pin, When the contract case reads its consumer file, Then the consumer still contains the text or its own constant equals it | the suite's two pin cases pass with no pin skipped **Observed:** `pins: every consumer file still holds the text its pin promises` walks all 30 pins against 5 distinct consumer files and each named evidence string is found in its own consumer; `pins: every pinned string still sits inside the section it names` finds every pinned string inside the shipped section the pin records | Met | - |
| AC-005 | REQ-005 | Given the canary's `AGENTS.md` string list, When the pin set is compared, Then every canary string appears in it | `rg -n 'AGENTS.md' .skilled/commands/doctor/assets/agents-md-manifest.json` prints the pin block and the suite's canary-coverage case passes **Observed:** `rg -n 'AGENTS.md'` prints five lines: line 4 the `root_file` key, lines 712, 714 and 718 the `root-presence` pin's path, text and consumer evidence, and line 734 the `.codex/AGENTS.md` runtime-copy path; `pins: the rule-copy canary finds every AGENTS.md string inside the pin set` runs the canary over a root file built from the pin texts alone and it exits 0 | Met | - |
| AC-006 | REQ-006 | Given the edited root file, When the block markers are counted, Then exactly one start marker and one end marker exist after the last shipped section | `grep -c 'skilled:repo-local:start' AGENTS.md` prints `1` **Observed:** `grep -c` prints `1` for the start marker and `1` for the end marker; `manifest: the template carries exactly one empty marked block after the last section` also passes | Met | - |
| AC-007 | REQ-006 | Given the edited root file, When its size is measured, Then it is at most 27899 bytes | `wc -c < AGENTS.md` prints at most `27899` **Observed:** prints `27888`, which is 27,673 after the line 3 edit plus a 215-byte block | Met | - |
| AC-008 | REQ-006 | Given the edited root file, When the canary runs, Then it passes and the last delivery anchor ends at or before byte 16374 | `node .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js` prints `OK: all rule invariants present` and `  16374  #### Blast-Radius Management` or a smaller byte **Observed:** `OK: all rule invariants present (8 exact-string file(s) + 2 Iron Law file(s) + 21 delivery-prefix anchor(s) + 6 extension floor(s) + 2 example output(s)).` and `  16368  #### Blast-Radius Management`; the 6-byte drop is the line 3 edit, and the suite proves the recorded byte equals the canary's | Met | - |
| AC-009 | REQ-001 | Given the edited root file, When the gate 1 pointer sync checks, Then it passes | `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-gate1-pointers.cjs --check` prints `PASS` **Observed:** `[gate1-pointer-sync] PASS: 1 instruction files carry the root Gate 1 lookup.`, exit 0 | Met | - |
| AC-010 | REQ-007 | Given the release tags, When the history key is generated, Then it holds one body per distinct body, deduped by sha256 | the suite's dedupe case passes and prints the history count **Observed:** `history: bodies are deduped by sha256 and never repeat a current body` passes, and `history: the derived key holds one entry per distinct body` prints `history bodies: 12, read from the last 6 release tags` | Met | - |
| AC-011 | REQ-008 | Given an origin that is not the source repository, When the suite runs, Then it prints its skip reason and passes | the suite's skip case prints a reason naming the origin **Observed:** `source gate: a foreign origin yields a skip reason that names it` asserts the reason names `example.invalid/someone-else/their-fork` and `manifest.source_repository`; the live cases carry that same reason as their `skip`, so a consumer sees the reason instead of failures | Met | - |
| AC-012 | REQ-009 | Given the workflow file, When both path-filter lists are read, Then each names `AGENTS.md` and `REPO RULES.md` | `grep -c "'AGENTS.md'" .github/workflows/spec-kit-check.yml` prints `2` **Observed:** `grep -c` prints `2` for `'AGENTS.md'` and `2` for `'REPO RULES.md'`; the parsed YAML shows both entries in both lists | Met | - |
| AC-013 | REQ-010 | Given a checkout holding the source origin and no release tags, When `--check` runs, Then it exits 0 and reports that the history was not compared | the suite's no-tag case passes **Observed:** `history: a checkout holding no release tags skips the comparison and passes` initialises a throwaway repository, adds `manifest.source_repository` as its origin, asserts `git tag --list` prints nothing, and the run prints `NOTE: history was not compared because no release tags are available` before `PASS: 44 sections, 30 pins, derived matches AGENTS.md`, exit 0 | Met | - |
| AC-014 | REQ-011 | Given a root file whose prose quotes both marker lines, When the segmenter reads it, Then no marker line exists and the quoted sentence is a line of the section it ends | the suite's `segmenter: a marker is the whole line, and the block reports the lines it owns` case passes: `block` is `null`, the sentence is in the last section's body, and an indented pair of marker lines still reads as a complete block whose `rows` span five lines — see .skilled/commands/doctor/scripts/tests/agents-md-manifest.test.cjs:189 | Met | - |
| AC-015 | REQ-012 | Given a template that grew a line above its first heading, When `--check` runs, Then it exits 1 and the message names the line | the suite's `generator refusal: text above the first heading exits 1 and names the line` case passes: `composeDerived` returns `ok: false` with `unmarked-prelude`, and the message reads `before its first heading at line 1, starting with "Read this first: the harness ships these instructions."` — see .skilled/commands/doctor/scripts/tests/agents-md-manifest.test.cjs:252 | Met | - |

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

AC-001 through AC-015 are met, each with the command output that decided it recorded in its row. Every count in the table is the count the file carries: 44 shipped sections, 30 pins naming 5 distinct consumer files, and the five `rg -n 'AGENTS.md'` matches the criteria quote. One figure records a value the design states differently: AC-008's deepest anchor reads 16,368 rather than 16,374 because the line 3 edit is 6 bytes shorter, and both sit inside the 16,384-byte delivery prefix.
<!-- /ANCHOR:closure -->
