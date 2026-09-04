---
title: "Acceptance Criteria: Command contract reconciliation"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "specs/sk-doc/056-command-contract-reconciliation"
    last_updated_at: "2026-09-04T11:20:00Z"
    last_updated_by: "claude"
    recent_action: "Recorded the observed result for every acceptance criterion"
    next_safe_action: "Register command-catalog-mirror-check.cjs into the doctor route manifest"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/sk-create-command/assets/command-contract.json"
      - ".opencode/skills/sk-doc/sk-create-command/assets/command-contract.schema.json"
      - ".opencode/commands/doctor/scripts/command-catalog-mirror-check.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Should the two hub command-metadata files be reworded to match command frontmatter, or should the check's prose tier be retired?"
      - "Is the prompt family's underscore asset naming an intentional exception or an unfinished migration?"
    answered_questions:
      - "Which side was wrong about the arguments trailer — the contract, against three agreeing sources."
      - "Whether asset naming differs per family — yes: create, speckit, doctor and deep carry the family prefix; memory and design drop it."
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Command contract reconciliation

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/056-command-contract-reconciliation
**Level:** 2
**Status:** Complete
**Date:** 2026-09-04
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

Every Verification cell names a command that was run with output redirected to a file and the exit status read from that file, never through a pipe. The observed result follows the expectation.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the contract claimed the create family consumes an `$ARGUMENTS` trailer at the router foot, When the claim is checked against the router template, the skill and the document validator, Then all three say arguments are resolved in the router body and the foot-of-file echo is deprecated, and the contract now says the same | `grep -n 'ARGUMENTS' .opencode/skills/sk-doc/sk-create-command/assets/command-contract.json` — expected: the create loader requirement names MODE ROUTING and calls the raw echo deprecated. Observed: `"$ARGUMENTS resolved in the router's MODE ROUTING section; the foot-of-file \`User request: $ARGUMENTS\` raw echo is deprecated"`. Corroborated by `validate_document.py:1424` matching `^User request:\s*\$ARGUMENTS\s*$` as deprecated, and by `grep -rn '^User request:' .opencode/commands --include='*.md'` returning nothing | Met | - |
| AC-002 | REQ-002 | Given every contract asset path is expanded across its family's commands, When each expansion is stat'ed on disk, Then none is missing | `node scratch/contract-paths.cjs` — expected: `missing=0`. Observed before the change: `checked=155 missing=142` with 70 create, 30 deep, 24 speckit, 13 doctor, 4 memory and 1 absent family. Observed after: `contract asset paths checked=160 missing=0`, exit 0 | Met | - |
| AC-003 | REQ-002 | Given the only live consumer of the contract derives each router's expected asset paths from it, When it is run in check mode, Then it reports no path drift and no shape drift | `node .opencode/skills/system-spec-kit/scripts/codex/generate-command-routers.cjs --check` — expected: `path-drift=0 shape-drift=0`, exit 0. Observed before: `routers=31 clean=30 path-drift=1 shape-drift=1`, exit 1. Observed after: `routers=32 clean=32 path-drift=0 shape-drift=0`, exit 0 | Met | - |
| AC-004 | REQ-003 | Given the create family's `argument_hint` was one command's hint verbatim, When it is compared with how the other families express theirs, Then it reads as a family shape in the same register | `python3 -c "import json;print(json.load(open('.opencode/skills/sk-doc/sk-create-command/assets/command-contract.json'))['families']['create']['input']['argument_hint'])"` — expected: a generic positional plus the recurring flag and the mode suffixes. Observed: `<target> [operation] [--path <dir>] [per-command flags] [:auto\|:confirm]`, alongside deep's `<topic> …` and speckit's `<feature-description> …` | Met | - |
| AC-005 | REQ-004 | Given the contract declared an `interface` family, When the directory is listed, Then no such directory exists and the entry now describes the `design` family that occupies its slot | `ls .opencode/commands/` — expected: no `interface`. Observed: `create deep design doctor memory prompt rewrite scripts speckit` plus root files. `python3 -c "…print(list(d['families']))"` — expected six families, all present on disk. Observed: `['create', 'design', 'speckit', 'memory', 'doctor', 'deep']` | Met | - |
| AC-006 | REQ-005 | Given the command tree as it stands, When the new check runs in its default mode, Then it exits 0 and reports every catalog and hub metadata as covering the tree | `node .opencode/commands/doctor/scripts/command-catalog-mirror-check.cjs` — expected: `STATUS=OK`, exit 0. Observed: `STATUS=OK command-catalog-mirror: every catalog and hub metadata covers the command tree`, exit 0, over 39 commands, 4 catalogs and 2 metadata files | Met | - |
| AC-007 | REQ-005 | Given a scratch copy of the tree, When each of five staleness shapes is introduced in turn, Then the check exits 1 and names the specific disagreement, and exits 0 again once restored | `node …/command-catalog-mirror-check.cjs --root <copy>` per case — expected: exit 1 on each break, exit 0 after restore. Observed: family catalog row deleted → `/create:chart not listed`, exit 1; repo-wide row deleted → `/create:chart not listed`, exit 1; group count 14→13 → `group 'create' count says 13, folder holds 14`, exit 1; command file deleted → 4 issues across both catalogs and the hub metadata, exit 1; command file added → 4 issues including `has no entry, though this hub covers the rest of create/`, exit 1; restored copy → `STATUS=OK`, exit 0 | Met | - |
| AC-008 | REQ-006 | Given the schema described `router_path` as an array for create, design and deep, and asserted that confirm equals auto plus checkpoints, When both are checked against the contract's own data and metadata, Then the schema was wrong on both and now agrees | `python3 -c "…jsonschema…"` — expected: 0 errors. Observed: `schema errors: 0`, exit 0. The `router_path` description now says a uniform family carries a glob string; the `workflow_schema_ref` description now defers to `metadata.confirm_auto_relationship` instead of contradicting it | Met | - |
| AC-009 | REQ-007 | Given the mode's templates and references taught underscore-joined asset paths, When the mode is grepped for those forms, Then only the genuine `_routes.yaml` filename remains | `grep -rn '_auto\.yaml\|_confirm\.yaml\|_presentation\.txt\|_routes\.yaml' .opencode/skills/sk-doc/sk-create-command/ \| grep -v '/changelog/'` — expected: `_routes.yaml` hits only. Observed: 5 lines, all naming the real `_routes.yaml` file | Met | - |
| AC-010 | REQ-007 | Given the mode's documents were edited, When each is validated, Then every one reports zero issues, as it did before the change | `for f in $(find … -name '*.md'); do python3 …/validate_document.py "$f"; done` with each exit status read from a file — expected: 21 documents, 0 non-zero exits. Observed: `non-zero exits: 0`, and 21 of 21 report `Total issues: 0` | Met | - |
| AC-011 | REQ-007 | Given the mode sits under a parent hub with a byte-checked leaf manifest, When the hub check runs, Then it passes with no warnings | `node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/sk-doc` — expected: exit 0. Observed: `OK: parent-skill-check — all hard invariants passed, 0 warnings`, exit 0, including check 10b regenerating the leaf manifest byte for byte | Met | - |
| AC-012 | REQ-008 | Given ten divergences between hub command metadata and command frontmatter that this packet does not own, When the check runs, Then it names each one without failing the default run, and fails under `--strict` | `node …/command-catalog-mirror-check.cjs` then `--strict` — expected: 10 warnings at exit 0, then exit 1. Observed: 10 lines marked `?` with `10 prose divergence(s) reported above; --strict fails on them.` at exit 0; `--strict` reports `STATUS=DRIFT command-catalog-mirror: 10 issue(s)`, exit 1 | Met | - |
| AC-013 | REQ-005 | Given the check must not itself be a source of noise, When it is asked to check a directory with no command tree, Then it exits 2 rather than passing vacuously | `node …/command-catalog-mirror-check.cjs --root /tmp` — expected: exit 2 with a named cause. Observed: `STATUS=ERROR command-catalog-mirror: commands directory not found: /tmp/.opencode/commands`, exit 2 | Met | - |

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

AC-002 and AC-003 carried the packet: 142 of the contract's 155 declared asset paths named a file that does not exist, and the one tool that reads the contract had been compensating for it with a separator-insensitive comparison rather than reporting it. Both now read zero. Deliberately left out: the ten prose divergences between hub command metadata and command frontmatter, which sit outside this packet's ownership and are reported by the new check rather than repaired, and registering that check into the doctor route manifest, which lives under a tree a concurrent agent owns.
<!-- /ANCHOR:closure -->
