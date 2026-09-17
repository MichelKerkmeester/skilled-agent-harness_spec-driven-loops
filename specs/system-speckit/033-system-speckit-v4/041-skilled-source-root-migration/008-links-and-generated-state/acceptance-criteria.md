---
title: "Acceptance Criteria: Phase 8: links-and-generated-state"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one, with the evidence observed on the committed tree."
trigger_phrases:
  - "skilled links acceptance criteria"
  - "generated state closure gate"
  - "link census acceptance row"
  - "generator freshness acceptance"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/008-links-and-generated-state"
    last_updated_at: "2026-09-17T15:10:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Met every row with evidence from the unit commits"
    next_safe_action: "Start phase 009 per the parent's D1 once this folder validates"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "goal.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "041-008-acceptance"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Reviews ran on GPT-5.6 Luna under the parent's amended D3"
      - "Phase 003 records that council-graph.sqlite needs no migration"
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 8: links-and-generated-state

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 041-skilled-source-root-migration/008-links-and-generated-state
**Level:** 2
**Status:** Complete
**Date:** 2026-09-17
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

`SK` stands for `.skilled/skills/system-spec-kit/runtime/cli`. The census and sweep commands are written out in `plan.md` §5. Evidence rows in `goal.md`'s log name the unit commits `88425278a6` to `aaea487a2b`.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given 436 tracked links at `1464a85667`, the 435 of the planning map plus the `.opencode` link, of which 8 dangle, When the phase closes, Then every tracked link resolves except the frozen allowlist in `plan.md` §3 | The census in `plan.md` §5, saved to `scratch/link-census-after.txt`, prints a `dangling` list identical to the allowlist, `old-root-targets 0` and `absolute 4`. Observed: 433 links after three retirements, 4 dangling, exactly the four absolute frozen records under `specs/`, 0 old-root targets and 4 absolute targets, and the untracked-link sweep prints nothing. Evidence: `scratch/link-census-after.txt:1` | Met | - |
| AC-002 | REQ-002 | Given 27 hand-made runtime links target `.opencode/`, When T012 to T017 land, Then each link equals its `target_if_no_compat` value and resolves | A Python check over the 27 hand-made `mechanical` rows of `map-a-symlinks.tsv` confirms `os.readlink(link) == target_if_no_compat` and `os.path.exists(link)` for all 27, and prints `27/27`. Observed: `27/27`, each resolving to the same real file as before. Evidence: `goal.md:92` | Met | - |
| AC-003 | REQ-003 | Given 168 mirror links owned by `sync-runtime-mirrors.cjs`, When its constants change and it re-runs, Then its check passes and a second write run changes nothing | `node SK/runtime-mirrors/sync-runtime-mirrors.cjs --check` prints `PASS: 168 mirrors across 8 trees are in sync.` and exits 0. A second `node SK/runtime-mirrors/sync-runtime-mirrors.cjs` prints `Linked 0, removed 0, of 168 expected mirrors.` Observed: both, after the first run linked 144 and removed 0. Evidence: `goal.md:93`, `goal.md:99` | Met | - |
| AC-004 | REQ-004 | Given the runtime files owned by eight generators, When each re-runs from edited constants, Then each check exits 0 and a second write run changes no file | `--check` exits 0 with `PASS: 4 registration files match the 29-hook registry; 15 Pi extensions resolve.`, `PASS: 2 instruction files carry the root Gate 1 lookup.`, 33 Codex prompts, 12 Codex agents, 33 Pi prompts, 12 Pi agents, 33 Hermes prompts and the Hermes skill copy count. After a second write run of all eight, the status of `.claude/settings.json`, `.codex`, `.cursor`, `.devin`, `.hermes` and `.pi` is unchanged. Observed: every check passes with those counts and 68 Hermes skill copies, and every second write run wrote 0 files with status and bytes unchanged. Evidence: `scratch/freshness-sweep.txt:1`, `goal.md:99` | Met | - |
| AC-005 | REQ-005 | Given dist output, compiled contracts, the compiled-routing closure, leaf manifests and the trigger index were built against `.opencode` paths, When their owners re-run, Then each owner's freshness proof passes | `node SK/lib/dist-freshness.cjs check --package <id>` exits 0 for the four built packages. `check-contract-drift.cjs` exits 0. `compiled-route-sync.cjs --verify` prints `move-simulation OK` and `serving-closure.manifest.json` records `runtimeRoot` as `.skilled/bin/lib/compiled-routing`. `ci-leaf-manifest-freshness.cjs` exits 0. The `cmp` of the four trigger-index files prints nothing and the index holds no `.opencode/` path entry. Observed: all of them, the last trigger-index comparison taken after the closing document edits. Evidence: `goal.md:91`, `goal.md:95`, `goal.md:96`, `goal.md:98` | Met | - |
| AC-006 | REQ-006 | Given four links dangle before the move, When T006 and T018 run, Then each carries a recorded decision and the census shows it removed or resolved | The `goal.md` log names four decisions with reasons. `git ls-files -s` lists no retired link, and each restored link passes `test -e`. Observed: three links retired in `fd8213edb9`, and `.skilled/plugins/sk-vision.js` resolves after the `vision-runtime` build. Evidence: `goal.md:88`, `goal.md:92` | Met | - |
| AC-007 | REQ-007 | Given 13 skill `graph-metadata.json` files list `.opencode/skills/...` in `derived.key_files` and `derived.entities[].path`, When the T045 rewrite lands, Then the owner's dry run changes nothing and reports no error | `regenerate-skill-derived.cjs --all` prints `"changed": 0` and `"errored": 0`. `ci-skill-derived-freshness.cjs` exits 0. `git grep -c '\.opencode/' -- ':(glob).skilled/skills/*/graph-metadata.json'` prints nothing. `skill_graph_compiler.py --validate-only` exits 0. Observed: all four. The pathspec needs `:(glob)`, because a plain `*` also crosses into spec-kit test fixtures that keep `.opencode` spec paths. Evidence: `goal.md:96` | Met | - |
| AC-008 | REQ-008 | Given `council-graph.sqlite`, `.skilled/package-lock.json` and this folder's metadata carry pre-move values, When their owners run, Then each matches the post-move tree | Phase 003's disposition for the council graph holds, `git diff 1464a85667 -- .skilled/package-lock.json` touches only its opening lines, and `repair-derived.cjs --folder <this folder>` exits 0 as a dry run. Observed: phase 003 recorded that the graph rebuilds per session through `replay-graph-from-artifacts.cjs` and needs no migration, the lock-only install changed line 2 alone, and the metadata dry run exits 0. Evidence: `goal.md:97`, `goal.md:102` | Met | - |
| AC-009 | REQ-009 | Given every constant or path-data diff is contract-adjacent, When each unit runs, Then a review verdict precedes its write run and the orchestrator re-ran its check | Six GPT-5.6 Luna reviews under `scratch/briefs/`, five of them finished between 14:21Z and 14:29Z, before the first write run at 14:33Z. Every finding is dispositioned in `scratch/review-ledger.md`, and every unit's check was re-run by the orchestrator. Observed: all of that. The sixth review covered the command-reference validator, which no write run reads. Evidence: `scratch/review-ledger.md:1`, `goal.md:90` | Met | - |
| AC-010 | REQ-010 | Given phase 009's rewrite stales every output that copies or hashes source text, When phase 009 plans its re-run, Then it uses this runbook unchanged | `plan.md` §4 lists the order, commands, checks and suites for rows 1 to 15, and `009-reference-rewrite/plan.md` points to it. Observed: both. Evidence: `../009-reference-rewrite/plan.md:187` | Met | - |

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

All 10 criteria are Met, with evidence observed on the committed tree in worktree 055. No criterion is waived or superseded, and nothing from this phase is pushed.
<!-- /ANCHOR:closure -->
