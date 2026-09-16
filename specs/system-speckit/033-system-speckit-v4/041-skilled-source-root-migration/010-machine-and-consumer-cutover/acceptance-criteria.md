---
title: "Acceptance Criteria: Phase 10: machine-and-consumer-cutover"
description: "The criteria this phase must satisfy before it may close: hooks that never dangle, Codex hooks without duplicates, one-line config edits with backups, working consumer projects and no leaked secret, each met, waived or superseded."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "machine cutover acceptance"
  - "global hooks relink criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/010-machine-and-consumer-cutover"
    last_updated_at: "2026-09-16T18:45:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Authored one criterion per requirement, all Unmet"
    next_safe_action: "Run T001 once phases 004 to 009 validate"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "041-010-acceptance"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 10: machine-and-consumer-cutover

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/010-machine-and-consumer-cutover
**Level:** 2
**Status:** Draft
**Date:** 2026-09-16
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. Shell variables and evidence IDs come from `plan.md` section 1.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given no home file or consumer link has changed, When T003 to T007 run, Then both raw census files and both classified files exist with matching row counts, and their verification is logged before T010 starts | `wc -l` on `scratch/home-census-raw.tsv` against `scratch/home-census-classified.tsv`, and on `scratch/consumer-links-raw.tsv` against `scratch/consumer-links-classified.tsv`. The T007 entry in `goal.md` carries a timestamp earlier than the creation of `B/manifest.tsv` (`stat -f %B`) | Unmet | - |
| AC-002 | REQ-002 | Given an item is about to change, When its task starts, Then `B/manifest.tsv` already holds its path, kind, checksum or link target and restore command | `awk -F'\t' 'NF<5' "$B/manifest.tsv"` prints nothing. For every copy, `shasum -a 256` equals its manifest row. Each item's backup line precedes its change in the goal log | Unmet | - |
| AC-003 | REQ-003 | Given the landing rewrites `MAIN`, When T011 to T016 run, Then checkpoints 1 to 5 each report only resolving entries, every final link names `$MAIN/.skilled/scripts/git-hooks/<hook>` and `core.hooksPath` is `$HOOKS` with `$BRIDGE` deleted | Five checkpoint outputs with no `FAIL` line and the expected `entries=` count, timestamped in the goal log. The V1 loop in `plan.md` item H1 prints no `FAIL` line. `git config --global --get core.hooksPath` prints `/Users/michelkerkmeester/.config/git/hooks`. `test -e "$BRIDGE"` fails after T029 | Unmet | - |
| AC-004 | REQ-004 | Given the relinked hooks, When V2 runs in a scratch repository, Then the non-conforming commit exits 1 and every later command exits 0, and the trace names `pre-commit`, `prepare-commit-msg`, `commit-msg`, `post-commit`, `post-rewrite`, `post-merge` and `pre-push` | V2 in `plan.md` section 5 prints `BLOCKED: commit message validation failed` and `exit=1`. `grep -c "$HOOKS/pre-commit"` on the trace is above 0, and the `hook_name` count list names all seven hooks | Unmet | - |
| AC-005 | REQ-005 | Given 18 repository entries and 15 third-party entries, When T017 runs, Then the dry-run reports added 18, removed plus orphaned 18 and kept 15, and afterwards `~/.codex/hooks.json` holds 33 entries with 0 `.opencode/` and 18 `.skilled/` identities | The counts printed from `B/codex-hooks-dry-run.json`. `node .skilled/bin/install-codex-hooks.mjs --check` in `MAIN` prints `install-codex-hooks: OK /Users/michelkerkmeester/.codex/hooks.json` with exit 0. The E6 census rerun prints the four counts | Unmet | - |
| AC-006 | REQ-006 | Given 10 consumer `.opencode` links and 4 consumer-owned paths that resolve before the landing, When the landing and T019 are done, Then every link resolves the root sentinel, every linked root file resolves and all 4 paths still resolve | V4 in `plan.md`: `test -f "$link/skills/system-spec-kit/SKILL.md"` passes for every `.opencode` link from E18 and every link in `B/consumer-links-created.tsv`. `test -e` passes for the E20 files and the 4 E21 paths. `git -C "$R" status --porcelain -- .skilled` prints nothing for each root | Unmet | - |
| AC-007 | REQ-007 | Given home configs that hold secrets, When the phase closes, Then no brief, log, census file or spec document carries a value read from them | Every raw census file keeps only its planned columns: path, kind, key or line, link target and count. Each delegate brief lists only inputs under `scratch/` or `research/maps/`. The orchestrator's review of the phase folder and the goal logs, with its result, is recorded in `goal.md` | Unmet | - |
| AC-008 | REQ-008 | Given fresh backups of the three configs, When T018, T021 and T022 run, Then each diff against its backup shows only the planned lines, or `B/manifest.tsv` records a keep decision for the Hermes line | `diff "$B/codex-config.toml" ~/.codex/config.toml` shows the line 21 header only. `diff "$B/hermes-config.yaml" ~/.hermes/config.yaml` shows line 17 only, or nothing beside a keep row. `diff "$B/pi-sync.md" ~/.pi/agent/SYNC.md` shows the two planned lines only | Unmet | - |
| AC-009 | REQ-009 | Given a shared clone of `MAIN` checked out at `PRE`, When one conforming commit runs there, Then it exits 0 and the trace names `pre-commit`, `prepare-commit-msg`, `commit-msg` and `post-commit` | V3 in `plan.md` section 5, output and exit status recorded in `goal.md`. `test -e` on the clone directory fails after cleanup | Unmet | - |
| AC-010 | REQ-010 | Given the home state after T023, When T030 to T032 run, Then every remaining `.opencode` mention is classified `kept-by-design`, `record` or `backup`, and the two checksums equal the baseline | `grep -c 'must-fix' scratch/residue-census-classified.tsv` prints 0. `shasum -a 256 ~/.pi/agent/trust.json ~/.zshrc` matches `scratch/cutover-baseline.txt` | Unmet | - |
| AC-011 | REQ-011 | Given other machines this phase cannot reach, When the phase closes, Then `plan.md` holds the checklist and the parent goal log names it as the operator's item | `grep -n 'ANCHOR:other-machines' plan.md` finds the section, and the parent `../goal.md` log holds a row that names the checklist | Unmet | - |
| AC-012 | REQ-012 | Given 38 stubs with no writer in the tree, When T008 and T023 run, Then the answer to whether codex-cli 0.154.0 loads `~/.codex/prompts/` cites its source, and the directory matches that answer | The T008 entry in `goal.md` with its source. When not loaded, `grep -l '\.opencode/commands/' ~/.codex/prompts/*.md \| wc -l` prints 38. When loaded, the stubs still naming `.opencode/commands/` are exactly those whose target is missing, and every `.skilled/commands/` path passes `test -f` | Unmet | - |

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

Every row is `Unmet`. The phase is planned from a read-only census, and nothing on the machine has changed. This statement is rewritten when the phase closes.
<!-- /ANCHOR:closure -->
