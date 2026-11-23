---
title: "Acceptance Criteria: Phase 8: hub-wiring"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "hub wiring acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/001-headless-bots-first-build/008-hub-wiring"
    last_updated_at: "2026-11-22T10:48:35Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-008-hub-wiring"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 8: hub-wiring

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** 008-hub-wiring
**Level:** 2
**Status:** In Progress
**Date:** 2026-11-23
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001, REQ-002 | Given the hub is scaffolded by `/create:skill-parent`, When `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/system-skilled-bots` runs, Then it exits 0 and its `INFO: Parent skill:` subject line names `system-skilled-bots` | Verbatim gate output with exit status in `implementation-summary.md`. A run without the hub path or with another subject line does not count (`skill-hub-routing.md` §3). Evidence: Observed 2026-11-23 from the final state, after the hub was produced by `/create:skill-parent` run as @markdown (step log `specs/system-skilled-bots/001-headless-bots-first-build/008-hub-wiring/scratch/workflow-run-log.txt:1`): `INFO: Parent skill: .skilled/skills/system-skilled-bots` and `OK: parent-skill-check — all hard invariants passed, 0 warnings`, exit 0 (`specs/system-skilled-bots/001-headless-bots-first-build/008-hub-wiring/scratch/parent-skill-check-final.txt:2`, `specs/system-skilled-bots/001-headless-bots-first-build/008-hub-wiring/scratch/parent-skill-check-final.txt:66`) | Met | - |
| AC-002 | REQ-003 | Given one natural prompt per mode (author, run, schedule, status), When each goes through `compiled-route.cjs --hub system-skilled-bots` and `skill_advisor.py --threshold 0.5`, Then stage two returns that mode with non-empty intents and stage one returns `system-skilled-bots` | Eight verbatim outputs, two per mode. A stage-one hit with `surfaceIntents: []` or a stage-two hit with `intents: [NONE]` fails the row, and the vocabulary is fixed on both sides (`parent-skills-nested-packets.md` §7, `skill-hub-routing.md` §1). Evidence: Observed 2026-11-23 from the final state (`specs/system-skilled-bots/001-headless-bots-first-build/008-hub-wiring/scratch/stage-one-final.jsonl:1`). Stage one at `--threshold 0.5` lists `system-skilled-bots` first for author at 0.929, run at 0.896, schedule at 0.95 and status at 0.896 (`what is the status of my bots and their last runs`). Stage two: the manifest serves `compiled` (`.skilled/bin/lib/compiled-routing/013-live-activation/activation/system-skilled-bots/manifest.json:1`), and `compiled-route.cjs --hub system-skilled-bots` returns `action: route` with one target per prompt, author, run, schedule and status (`specs/system-skilled-bots/001-headless-bots-first-build/008-hub-wiring/scratch/stage-two-after-review-fix.jsonl:1`). The front door prints no intents field for any hub; the compiled gold records non-empty `observedIntents` per scenario, such as `["author"]` (`specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/011-system-skilled-bots/compiled/route-gold.typed.json:1`). Known stage-one limitation: the `show me ...` form of the status prompt gets no recommendation, because the scorer caps a match with no intent booster at 0.25 for every hub (`specs/system-skilled-bots/001-headless-bots-first-build/008-hub-wiring/scratch/stage-one-final.jsonl:5`). Stage two still routes it to status | Met | - |
| AC-003 | REQ-004, REQ-011 | Given every surface ADR-001 lists as applying to a `metadata` mode, When each is inspected, Then each carries all four modes, and the hub `SKILL.md` mode table names all four with the packet count | A checklist row per applicable surface of `parent-skills-nested-packets.md` §7 with the file and the `rg` output. The ungated rows (stage-two intent, advisor vocabulary, `description.json`) are checked by hand, never inferred from a registry entry (`skill-hub-routing.md` §2). Evidence: Re-checked 2026-11-23 on the workflow-built hub. All four modes appear in mode-registry, hub-router, ROUTER.md, graph-metadata, description.json, SKILL.md, command-metadata and leaf-manifest; each mode is `metadata`; tieBreak is a permutation of the four; SKILL.md says `This table lists all 4 mode packets.`; no nested `graph-metadata.json` exists (`specs/system-skilled-bots/001-headless-bots-first-build/008-hub-wiring/scratch/surfaces-final.txt:1`). Advisor vocabulary: `ci-hub-vocabulary-source` and `ci-router-vocabulary-reach --hub system-skilled-bots` both print `RESULT: PASSED` (`specs/system-skilled-bots/001-headless-bots-first-build/008-hub-wiring/scratch/activation-log.txt:1`) | Met | - |
| AC-004 | REQ-005 | Given the commands exist from `/create:command`, When the mirror sync scripts and checkers run, Then every runtime mirror carries every bots command and the doctor bots command | `validate-command-tree-parity.sh`, `codex/sync-prompts.cjs --check` and `pi/sync-prompts-pi.cjs --check` each exit 0, plus a listing per mirror tree. Evidence: The commands were written by `/create:command` run as @markdown (`specs/system-skilled-bots/001-headless-bots-first-build/008-hub-wiring/scratch/workflow-run-log.txt:1`), and the mirrors only by the sync scripts. Each sync script's `--check` exits 0, and `validate-command-tree-parity.sh` prints `PASS: 271 mirrors across 10 trees are in sync.` (`specs/system-skilled-bots/001-headless-bots-first-build/008-hub-wiring/scratch/mirrors-redo.txt:312`) | Met | - |
| AC-005 | REQ-006 | Given the leaf manifest was regenerated, When the per-hub gate runs with the hub path, Then `10b-byte-drift` passes | The `10b-byte-drift` line from the AC-001 gate output. Evidence: `PASS: 10b-byte-drift: committed leaf-manifest.json matches a fresh regeneration byte for byte` in the final gate run (`specs/system-skilled-bots/001-headless-bots-first-build/008-hub-wiring/scratch/parent-skill-check-final.txt:51`) | Met | - |
| AC-006 | REQ-007 | Given a copy of a vendored consumer with a fixture `bots/` folder, When `overlay-engine.cjs repin --upstream <dir> --to <commit> --root <copy> --stage <empty dir>` runs on it, Then every file under `bots/` in the staged tree and in the copy is byte-identical to the copy before the run | `shasum` lists of `bots/` from the copy before, the copy after and the staged tree, compared with `diff` and printing nothing, plus the repin exit status. Evidence: Rerun 2026-11-23 from the final state: `RESULT: STAGED`, `repin exit=0` (`specs/system-skilled-bots/001-headless-bots-first-build/008-hub-wiring/scratch/repin-proof-final.txt:29`). `diff` of before against copy-after and of before against staged both print nothing, exit 0 (`specs/system-skilled-bots/001-headless-bots-first-build/008-hub-wiring/scratch/repin-proof-final.txt:41`, `specs/system-skilled-bots/001-headless-bots-first-build/008-hub-wiring/scratch/repin-proof-final.txt:43`) | Met | - |
| AC-007 | REQ-008 | Given phases 001 to 008 are written, When their documents are searched, Then none claims a mode is routed or reachable before AC-001 and AC-002 are Met, or integrated before AC-001 to AC-005 are Met (`skill-hub-routing.md` §2) | `rg` output over `../00[1-8]-*/*.md` showing no such claim. Evidence: `rg` over phases 001 to 007 for routed, reachable or integrated claims returns only negations (`specs/system-skilled-bots/001-headless-bots-first-build/008-hub-wiring/scratch/ac007-no-routed-claim.txt:1`). Rerun 2026-11-23 after the redo, with the same two negations | Met | - |
| AC-008 | REQ-009 | Given the alias list in ADR-002, When each alias's out-of-domain phrase goes through both stages, Then neither stage selects `system-skilled-bots` | One verbatim stage-one and stage-two output per alias (`skill-hub-routing.md` §4). Evidence: Read as top-1 selection, which is judgment: `skill-hub-routing.md` §4 frames the risk as an alias that captures traffic the hub cannot serve, and does not define select. Reviews 2 to 4 found generic prompts reaching the hub through the keyword tokens `question` and `open`, the keyword `launchd schedule` and the bare `SKILL.md` keyword `needs-you`. All are fixed (ADR-002 amendments, operator answers Q008 to Q013). Final state: stage one ranks the hub first for none of the six ADR-002 probes (`specs/system-skilled-bots/001-headless-bots-first-build/008-hub-wiring/scratch/stage-one-fix6.txt:1`), none of the eleven `answer the open X` and `answer the X` paraphrases (`specs/system-skilled-bots/001-headless-bots-first-build/008-hub-wiring/scratch/stage-one-fix6.txt:7`) and none of the three `needs you` prompts (`specs/system-skilled-bots/001-headless-bots-first-build/008-hub-wiring/scratch/stage-one-fix6.txt:18`). Stage two returns `defer` for all six probes, three paraphrases and five non-bot launchd and cron prompts (`specs/system-skilled-bots/001-headless-bots-first-build/008-hub-wiring/scratch/stage-two-fix6.jsonl:13`, `specs/system-skilled-bots/001-headless-bots-first-build/008-hub-wiring/scratch/stage-two-fix6.jsonl:25`). Non-bot launchd prompts still rank the hub first at stage one through the bare keyword `launchd` (`specs/system-skilled-bots/001-headless-bots-first-build/008-hub-wiring/scratch/stage-one-fix6.txt:21`). That keyword is kept so an in-domain blind corpus row keeps routing (Q013), and implementation-summary limitation 6 records it. A reader who counts any passing row would mark this Unmet | Met | - |
| AC-009 | REQ-010 | Given the doctor asset under `.skilled/commands/doctor/assets/`, When the doctor bots command runs on a fixture `bots/` folder, Then it runs the phase 2 checker read-only and reports each negative fixture by its invariant id | Command output plus `git status` showing no write outside the doctor state log. Evidence: The workflow-built doctor asset `doctor-bots-auto.yaml` runs the unchanged checker `bot-check.cjs` over the root, the same command the evidence below ran (`.skilled/commands/doctor/assets/doctor-bots-auto.yaml:35`). Over 17 fixtures, `clean` exits 0 and each in-place negative exits 1 with a `FAIL:` line carrying its invariant id (`specs/system-skilled-bots/001-headless-bots-first-build/008-hub-wiring/scratch/doctor-bots-check.txt:1`). `no-identity` fails `identity-missing` in a remote-less temp repository (`specs/system-skilled-bots/001-headless-bots-first-build/008-hub-wiring/scratch/doctor-bots-check.txt:136`). `git status` is unchanged | Met | - |
| AC-010 | REQ-012 | Given the phase diff, When it is inspected, Then no file under `.skilled/skills/system-skilled-bots/runtime/` changed | `git diff --stat -- .skilled/skills/system-skilled-bots/runtime` prints nothing. Evidence: Final state: `git diff --stat HEAD` and `git status --short` over the runtime folder both print nothing (`specs/system-skilled-bots/001-headless-bots-first-build/008-hub-wiring/scratch/d4-final.txt:1`) | Met | - |
| AC-011 | REQ-013 | Given the AC-006 copy with a fixture install record at `<state root>/<identity>/installs/<bot-id>.json` under a temp user-level state root, and a fixture run folder under the copy's `.skilled/skills/.state/system-skilled-bots/<identity>/runs/`, When the staged re-pin runs and the staged tree replaces the copy at its path, Then `bots status` reports the schedule as needing reinstall (amended by operator decision Q004 in `decision-record.md`), and whether the run folder survived is recorded | `bots status` output naming the reinstall row, plus `ls` of the run folder in the copy and the staged tree, in `implementation-summary.md`. Evidence: Rerun 2026-11-23 from the final state against the row as amended by operator decision Q004. Once the staged tree takes the copy's path, `bots status` prints `needs-reinstall` for `nightly-digest`, with reinstall reason `pin-changed` and fix `bots schedule install nightly-digest` (`specs/system-skilled-bots/001-headless-bots-first-build/008-hub-wiring/scratch/repin-proof-final.txt:61`, `specs/system-skilled-bots/001-headless-bots-first-build/008-hub-wiring/scratch/repin-proof-final.txt:63`). The fixture run folder survived in the copy and in the staged tree (`specs/system-skilled-bots/001-headless-bots-first-build/008-hub-wiring/scratch/repin-proof-final.txt:45`, `specs/system-skilled-bots/001-headless-bots-first-build/008-hub-wiring/scratch/repin-proof-final.txt:50`) | Met | - |
| AC-012 | REQ-014 | Given one natural prompt for `bots inbox` and one for `bots answer`, When each goes through `compiled-route.cjs --hub system-skilled-bots` and `skill_advisor.py --threshold 0.5`, Then stage two returns status and run with non-empty intents and stage one returns `system-skilled-bots`, and each new alias misses its out-of-domain phrase | Four verbatim routing outputs plus one stage-one and stage-two output per new alias. Evidence: Final state: `what is waiting in my bots inbox` lists `system-skilled-bots` first at 0.855 (`specs/system-skilled-bots/001-headless-bots-first-build/008-hub-wiring/scratch/stage-one-fix6.txt:29`) and routes to status at stage two (`specs/system-skilled-bots/001-headless-bots-first-build/008-hub-wiring/scratch/stage-two-fix6.jsonl:5`). The run gold prompt, reworded per Q010 to `answer the release bot's needs-you question`, lists it first at 0.877 (`specs/system-skilled-bots/001-headless-bots-first-build/008-hub-wiring/scratch/stage-one-fix6.txt:27`) and routes to run through `bot's needs-you` (`specs/system-skilled-bots/001-headless-bots-first-build/008-hub-wiring/scratch/stage-two-fix6.jsonl:6`). The reword has a cost: the old prompt `answer the open needs-you question for the release bot` now defers at stage two (`specs/system-skilled-bots/001-headless-bots-first-build/008-hub-wiring/scratch/stage-two-fix6.jsonl:31`). The alias out-of-domain probes are in AC-008 | Met | - |

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
<!-- FILL: Write Yes or No and one sentence. Name a criterion by its id only when it blocks closure. Never write a count of criteria or an id range, because every added row makes it wrong. GOOD: No. AC-002 is unmet. WEAK: All eight criteria AC-001 to AC-008 are met. -->

**Closeable:** Yes

Every criterion is Met. The packet stays In Progress until T001 closes, which waits on phase 002's weekday probe.
<!-- /ANCHOR:closure -->
