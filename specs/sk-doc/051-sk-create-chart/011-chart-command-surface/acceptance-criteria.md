---
title: "Acceptance Criteria: Chart Command Surface"
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
    packet_pointer: "specs/sk-doc/051-sk-create-chart/011-chart-command-surface"
    last_updated_at: "2026-09-04T12:55:00Z"
    last_updated_by: "implementation"
    recent_action: "Closed the remaining fifteen commands; verified AC-017 through AC-022"
    next_safe_action: "Commit, then hand over the three items in Known Limitations"
    blockers:
      - "Six deep entries in system-deep-loop/command-metadata.json trail their frontmatter; the file is outside this pass's scope"
      - "Six workflow assets load a level-2 checklist.md template that no level ships"
    key_files:
      - ".opencode/commands/create/chart.md"
      - ".opencode/skills/sk-doc/mode-registry.json"
      - ".opencode/skills/sk-doc/SKILL.md"
      - ".opencode/skills/sk-doc/command-metadata.json"
      - ".opencode/commands/deep/research.md"
      - ".opencode/commands/memory/learn.md"
      - ".opencode/commands/speckit/plan.md"
      - ".opencode/commands/scripts/validate-command-references.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Chart Command Surface

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/051-sk-create-chart/011-chart-command-surface
**Level:** 2
**Status:** Complete
**Date:** 2026-09-04
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

Every command below was run from the repository root, from the final state, with its output and exit status read.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the new router, When it is validated as a command document, Then it passes with no issues | `python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/commands/create/chart.md --type command`. Expected `VALID`, `Total issues: 0`, exit 0. Observed exactly that. The sibling `/create:diagram` router reported 3 warnings on the same check at the time; AC-015 closed them | Met | - |
| AC-002 | REQ-001 | Given the create-command family contract, When the router-generator drift gate runs, Then the new router is clean | `node .opencode/skills/system-spec-kit/scripts/codex/generate-command-routers.cjs --check`. Expected the new router absent from the drift list. Observed `routers=31 clean=30`, the single drift being the pre-existing `memory/learn.md`, which was also the single drift at `routers=30 clean=29` before the change | Met | - |
| AC-003 | REQ-002 | Given the registry declares `/create:chart` for `sk-create-chart`, When the hub gate runs, Then the mode table shows that exact command | `node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/sk-doc`. Expected `PASS: 6c` and exit 0. Observed `PASS: 6c: every mode-table row whose registry entry declares a command shows that exact command`, plus `OK: parent-skill-check — all hard invariants passed, 0 warnings` | Met | - |
| AC-004 | REQ-003 | Given the canonical router, When the mirror gates run, Then every runtime tree resolves it | `node .opencode/skills/system-spec-kit/scripts/runtime-mirrors/sync-runtime-mirrors.cjs --check` expected `PASS`, observed `PASS: 173 mirrors across 8 trees are in sync` against a baseline of 171. `node .opencode/skills/system-spec-kit/scripts/codex/sync-prompts.cjs --check` expected `PASS`, observed `PASS: 37 prompts are in sync` against a baseline of 36 | Met | - |
| AC-005 | REQ-004 | Given the hub `SKILL.md` was edited, When a chart request is resolved through compiled routing, Then a real route is served rather than the legacy sentinel | `node .opencode/bin/compiled-route.cjs --hub sk-doc --prompt "I need a treemap showing where the budget went"`. Expected an `action: route` decision naming `sk-create-chart`. Before the change this printed `{"servingAuthority":"legacy","hubId":"sk-doc"}`. Observed after: `"action":"route"` with one target, `workflowMode: sk-create-chart`, generation 5 | Met | - |
| AC-006 | REQ-004 | Given both manifest copies were refreshed, When the fleet guard runs, Then every hub is fresh | `node .opencode/bin/compiled-route-guard.cjs`. Expected exit 0 and five `fresh` rows. Before the change: exit 1, `sk-doc stale-manifest`, `Re-mint: sk-doc`. Observed after: exit 0, all five hubs `fresh` | Met | - |
| AC-007 | REQ-004 | Given the promoted closure, When the move simulation runs, Then every hub still resolves | `node .opencode/bin/compiled-route-sync.cjs --verify`. Expected exit 0. Before the change: exit 1, `promoted closure failed to resolve hubs: sk-doc`. Observed after: exit 0, `move-simulation OK: all 5 hubs resolve; 0 reads under .opencode/specs` | Met | - |
| AC-008 | REQ-005 | Given rebuilt artifacts and re-pinned digests, When the canary validates, Then it reports REAL-GREEN | `node harness/build-artifacts.cjs` then `node harness/validate-canary.cjs` from `specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/007-sk-doc`. Expected `"status":"REAL-GREEN"` and exit 0. Before the change: exit 1, `CANARY_RED` on a stale `sk-create-chart/SKILL.md` digest. Observed after: exit 0, `REAL-GREEN`, 23 real-green route-gold rows including `single-create-chart` | Met | - |
| AC-009 | REQ-006 | Given the new command metadata entry, When the bridge derivation is checked, Then the projection is fresh and carries the command | `node .opencode/skills/system-skill-advisor/mcp-server/scripts/command-bridges/derive-command-bridges.cjs --check`. Expected `"status": "fresh"` with an empty `changed` list. Observed `fresh`, `commandMetadata: 20` against a baseline of 19, `generated: 28` against 27, `changed: []` | Met | - |
| AC-010 | REQ-007 | Given two suites carry a declaration census, When they run, Then both pass at the new count | `npx vitest run tests/command-metadata-e2e.vitest.ts tests/command-binding-existence.vitest.ts tests/command-bridges-drift-guard.vitest.ts` from the advisor `mcp-server`, expected 9 passed, observed 9 passed at census 20. `python3 -m unittest discover .opencode/commands/create/assets/tests`, expected 13 passed, observed `Ran 13 tests ... OK` at 28 root YAML assets | Met | - |
| AC-011 | REQ-008 | Given the catalog holds twenty-one forms, When the hub mode table and the hub README are read, Then both state twenty-one | `grep -n "21 forms" .opencode/skills/sk-doc/SKILL.md` and `grep -n "twenty-one forms" .opencode/skills/sk-doc/README.md`. Expected one hit each. Observed one hit each, and `grep -rn "catalog of 20" .opencode/skills/sk-doc/` returns nothing outside historical changelog entries | Met | - |
| AC-012 | SC-003 | Given the chart packet was not to be touched, When the corpus check runs, Then it passes and the packet shows no working-tree change | `node .opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs --render`. Expected `RESULT: PASSED`, errors 0, exit 0. Observed exactly that, and `git status --porcelain .opencode/skills/sk-doc/sk-create-chart/` returns nothing. One earlier run of this command failed with 2 `settled-render` errors while another heavy job held the machine, and reproduced clean when run alone | Met | - |
| AC-013 | REQ-009 | Given the `@markdown` agent refuses any `/create:*` command its roster omits, When the roster is compared against the command directory, Then every command in the directory appears | `ls .opencode/commands/create/` gives 14 commands. Expected all 14 present in the agent's invocation list and command template map. Before: 10, missing chart, diff, repo-rule and with-human-voice, and the dispatch contract said "ten valid". Observed after: 14 of 14 in `.opencode/agents/markdown.md` and `.claude/agents/markdown.md`, contract reads "fourteen valid" | Met | - |
| AC-014 | REQ-009 | Given four runtimes mirror that agent, When each mirror is regenerated by its own sync script and re-checked, Then all report in sync | `node .opencode/skills/system-spec-kit/scripts/codex/sync-agents.cjs --check` and the Pi equivalent both reported `STALE .../markdown` after the hand edit, confirming the guard sees drift. After running each without `--check`: both `PASS: 12 agents are in sync`, exit 0. `agent-roster-mirror-check.cjs` returned `STATUS=OK`, exit 0. Roster count is 14 in all six surfaces including the Cursor and Devin symlinks | Met | - |
| AC-015 | REQ-010 | Given `/create:diagram` failed three document checks, When it is validated after the fix, Then it reports no issues and loses no capability | `python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/commands/create/diagram.md --type command`. Before: exit 0, `Total issues: 3`, a 158-char description, a 286-char argument hint, and the deprecated `User request: $ARGUMENTS` echo. Observed after: `Total issues: 0`. The description is 107 chars and still names all three artifact families and the 27 types; the hint is 139 chars and still names every flag; the enumerated surface, including the pre-bound setup-answers block, moved into MODE ROUTING step 3, which is what the validator's own fix hint prescribes. `test-flowchart-validator.sh` PASS exit 0, `validate-command-references.cjs` unchanged at the same 8 pre-existing failures | Met | - |
| AC-016 | REQ-011 | Given both command catalogs were stale, When each command file in the tree is looked up in its index, Then none is missing | Directory as the check: 14 commands under `create/`, 39 across the tree in 8 groups. Before: `create/README.txt` was missing 4, and the root `README.txt` was missing 3 plus the whole `rewrite` group and the root `vision` command, with a create count of 11 and a wrong structure tree. Observed after: 0 missing in either, group counts and both structure trees corrected, and `validate_document.py` reports `Total issues: 0` on each, the root having carried 1 pre-existing warning | Met | - |
| AC-017 | REQ-012 | Given fifteen commands still carried document warnings, When every command in the tree is validated, Then none reports an issue | `validate_document.py --type command` over all 39 command documents. Before: 24 clean, 15 carrying 23 issues between them — 9 argument hints from 244 to 548 chars, 9 descriptions 7 to 51 chars over target, 2 missing required sections, 2 angle-bracket warnings. Observed after: 39 of 39 at `Total issues: 0` | Met | - |
| AC-018 | REQ-012 | Given a hint may not be shortened by dropping capability, When each shortened hint is compared against its router body, Then every flag it stopped naming is documented there | Token-by-token diff of all 9 shortened hints against their final bodies: 81 flags, 22 mode suffixes and 9 sub-actions between them, `0` routers losing one. Hints fell from 244-548 chars to 83-122. `deep/research`, `deep/review`, `deep/ai-council` and `speckit/plan` had left 1, 13, 6 and 4 flags undocumented in the body; a `Workflow Flag Surface` table in MODE ROUTING now carries each with its value grammar, which is what the validator's own fix hint prescribes. `memory/manage` and `memory/search` needed none, their mode and sub-action lists already being enumerated in the body. Every cell was grounded in the feature catalog, the convergence reference, the presentation asset or the workflow YAML rather than inferred | Met | - |
| AC-019 | REQ-013 | Given each family declares its shape in the command contract, When every router is audited against its entry, Then all conform | Contract-driven audit over all 32 routers: the six canonical sections present and in order, H2 numbering 1..N, the three frontmatter keys, and every asset path in OWNED ASSETS and EXECUTION TARGETS resolved against disk. Observed `routers=32 asset_refs=153 missing=0`, zero section, order, numbering or frontmatter problems. The 7 commands with no family entry were audited separately: every asset they name exists, none carries a foot-of-file `$ARGUMENTS` echo | Met | - |
| AC-020 | REQ-013 | Given the router drift gate was red, When it runs after the fix, Then it is clean | `node .opencode/skills/system-spec-kit/scripts/codex/generate-command-routers.cjs --check`. Before: exit 1, `routers=31 clean=30 path-drift=1 shape-drift=1`, `memory/learn.md` missing its presentation asset and carrying no owned-assets table. Observed after: exit 0, `routers=32 clean=32 path-drift=0 shape-drift=0` | Met | - |
| AC-021 | REQ-014 | Given `memory/manage.md` documented a repair path through `memory_ln`, When that tool name is looked up, Then it resolves | `memory_ln` appeared exactly once in the repository, in `memory/manage.md`, and is absent from the memory server's tool schemas. The registered tool matching the described behaviour verbatim — one guarded transaction, dry-run by default, active-shard verification, `mode: "apply"` — is `memory_embedding_reconcile`. The name was corrected, so the documented recovery for `degraded_needs_repair` is now executable | Met | - |
| AC-022 | REQ-014 | Given the command-tree reference gate was failing, When every reference this tree owns is resolved, Then the only ones left name an artifact another tree owns | `node .opencode/commands/scripts/validate-command-references.cjs`. Before: exit 1, 8 unresolved. Two were this tree's own and both were fixed: `doctor-mcp-install.yaml` pointed at `mcp-click-up/references/INSTALL-GUIDE.md` when the file sits at the skill root, and the checker's runtime allowlist named 3 runtimes when 6 ship a populated `agents/` tree, so a real `.pi/agents/` reference was being rejected. Observed after: 6 unresolved, every one naming the same absent `system-spec-kit/templates/examples/level-2/checklist.md`. No level ships that file and it was already absent at the previous commit, so the artifact is missing from the skills tree rather than mis-referenced here; recorded with its owner in Known Limitations | Met | - |

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

AC-005 through AC-008 carried the packet, because they are the four that were red before the change and are the ones a green build would otherwise have hidden.

The three gaps this packet consciously left out are now closed, under AC-013 through AC-016. All three predated the chart work, which is why a partial fix had been refused: the `@markdown` roster named ten of fourteen commands while refusing any it did not list, both command catalogs had fallen behind the command directory, and `/create:diagram` failed three document checks that the chart router passes. Each was fixed whole rather than only where chart touched it.

The fifteen commands left needing an authored judgment are now closed under AC-017 through AC-022, and the whole tree validates at zero issues. Shortening was held to one rule: a hint may lose words but never a flag, so every flag a trimmed hint stopped naming was moved into that router's MODE ROUTING with its value grammar intact, and the flag-by-flag diff is the evidence in AC-018.

Three things remain open and are recorded in the Known Limitations rather than waived. All three sit outside what this pass could reach. Six `deep` entries in `system-deep-loop/command-metadata.json` now trail their frontmatter, and the catalog checker names the metadata as the side that must follow, but that file is under `.opencode/skills/`. Six workflow assets load a level-2 `checklist.md` template that no level has ever shipped, which cannot be fixed by repointing to a file that does not exist. And `/speckit:resume` implements two of the five modes its family contract declares, which is a contract-side question about whether the schema should carry per-command mode overrides.

Deriving the catalogs from `command-metadata.json` was rejected on evidence: it reaches 20 of 39 commands and is itself a hand-kept copy of the frontmatter that had already drifted, so it would relocate the staleness instead of ending it.
<!-- /ANCHOR:closure -->
