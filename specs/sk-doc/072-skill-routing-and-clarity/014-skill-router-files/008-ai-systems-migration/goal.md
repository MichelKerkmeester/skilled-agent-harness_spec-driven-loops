---
title: "Goal: Phase 8: ai-systems-migration"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/072-skill-routing-and-clarity/014-skill-router-files/008-ai-systems-migration"
    last_updated_at: "2026-10-29T15:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Committed the migration locally: gate edits and 16 of 16 routers in five repositories"
    next_safe_action: "Operator approves the five pushes"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "0269-skill-router-files"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Phase 8: ai-systems-migration

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Move the machine router of each AI Systems skill that carries one into a sibling `ROUTER.md` linked from its `SKILL.md`, with every gate that passed before still passing, while each Claude Project keeps routing from its kernel's Router Code.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Work lands as local commits on `main` of the AI Systems checkout, one commit per system, gate edits before the first skill move. |
| D2 | The Moneybird Accountant hub gains a root `ROUTER.md` holding its stage one prose and a final `## 3. MACHINE ROUTER` that names the child modes as `hub-router.json` and `mode-registry.json` do; its `SKILL.md` Section 2 ends with the hub pointer line, and its routing behavior is unchanged. |
| D3 | `mcp-click-up`, `mcp-code-mode` and `mcp-figma` move only by `vendor-sync.py pull` from Public main, never by hand edit. |
| D4 | `references/router-contract.md` files and the kernel `ROUTER CODE` sections stay where they are. |
| D5 | No Claude Project routing knowledge document (conductor option C, 2026-10-29): each Project keeps routing from its kernel's Router Code, and `SYNC.md` records the move. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] All 16 AI Systems skill folders hold a `ROUTER.md` whose last H2 is `## 3. MACHINE ROUTER`; each of the 14 skill `SKILL.md` ends SMART ROUTING with a relative markdown link to the sibling `ROUTER.md` followed by "before selecting skill-local resources; open only the matched files.", and the Moneybird Accountant and Product Owner hub `SKILL.md` end Section 2 with the hub pointer line.
- [x] In the AI Systems repository, Product Owner `check_hub.py` prints `PASSED the hub, 4 registry packets and 51 gold rows`, and `benchmark/router/run_fixtures.sh` exits 0 for Product Owner, Barter - Deal Templates, Media Editor, Prompt Improver, Sales - Direct Communication and Sales - HubSpot & Automation.
- [x] Moneybird `check-route-table.py` prints `route-table: ok` after two consecutive `--write` runs leave `git diff --stat` unchanged, and `check-skill-words.py`, `route-replay.py --mode replay` and `cli-moneybird/scripts/exit-code-parity.sh` each exit 0.
- [x] `package_skill.py --check --strict` reports no RS-001 to RS-005 routing-shape finding for any of the 16 skills that hold a `ROUTER.md`, and prints `Result: PASS` for each skill whose other canon findings a routing move can fix. (Amended 2026-10-29: 12 of 16 pass; the other four fail on renames, missing sections and resource-doc versions that a routing move cannot fix, recorded in the implementation summary.)
- [x] No Claude Project gains a routing knowledge document and no `Custom Instructions.md` or `systems.py` changes; each of the seven `SYNC.md` lists `ROUTER.md` in step 1 with a dated note naming the gate that still compares the kernel Router Code, and each `benchmark/parity/run_parity.sh` exits 0.
- [x] No commit reaches `Barter-BV/marketing-ai-systems` before the operator approves a push.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Planning docs | Done | `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md` filled from `007-ai-systems-research/research/research.md` |
| Gate baseline | Done | `scratch/baseline.md`: 37 rows at AI Systems `8e4573b8f`, 33 exit 0, rows 1, 7, 13 and 29 red before any edit |
| Start commit | Recorded | AI Systems `main` at `8e4573b8f` (`git log -1 --format=%h`) |
| Gate edits | Done, committed locally | 11 scripts read `SKILL.md` then `ROUTER.md`; each printed its baseline pass line on the unmoved tree |
| Skill moves | 16 of 16, committed locally | 16 `ROUTER.md` with a final `## 3. MACHINE ROUTER`; the 3 vendored MCP packets arrived by `vendor-sync.py pull` at Public `ca10a236d2` and read `in step` |
| Project routing documents | Superseded | Conductor option C: none ships; seven `SYNC.md` updated instead |
| Rerun | Done | `scratch/after.md`: 37 rows, every passing row still passes with the same counts, row 1 improved |
| Push | Waits on the operator | AI Systems `rev-list --count origin/main..main` prints 8, one per system plus the Copywriter lane-budget refresh; each nested repository is one commit ahead of its upstream |

### Deviations and findings

| Item | Note |
|------|------|
| 16, as the parent reads | D2 was rewritten so the Moneybird hub gets a `ROUTER.md`, which brings this phase back to the parent's 16. |
| SMART ROUTING prose moved too | RS-001 caps SMART ROUTING at 12 lines and 180 words, so almost all routing prose moved into each `ROUTER.md` Section 2, not only the machine data the research table named. |
| Moneybird hub pointer wording | The hub has no compiled-routing directive, so its pointer line names the stage one rules in its own `ROUTER.md` instead, ending "before selecting hub resources." as the hub form does. |
| Nested repositories | `Moneybird Accountant` is its own repository and is ignored by AI Systems, so the brief's Moneybird guard, run against AI Systems, always prints nothing. The nested repository showed no change and no commit in two hours before the edits. Media Editor, Prompt Improver and Product Owner also hold their own `.git`. |
| `check-route-table.py` | The generator owns no heading; the hub check that required `## 2. SMART ROUTING` was changed instead. |
| Project routing documents | Superseded by the conductor's option C on 2026-10-29: no routing knowledge document, no gate change, no `systems.py` change; each Project keeps routing from its kernel's Router Code. |
| Pre-existing canon errors | Fixed where routing stays the same: 4-part skill versions (four skills), the Moneybird packet and hub descriptions, the hub name check through a `repo-root-hub` extension, an ESCALATE IF block the name fix unmasked, and the Prompt Improver markers as prose. 12 of 16 now pass; the other 4 need renames, new sections or resource-doc re-versioning. |
| Readers the research missed | The baseline found five more gate readers of `SKILL.md` routing: the Barter - Copywriter, Product Owner and Media Editor `differential.py`, and the Prompt Improver and Sales - HubSpot & Automation `kernel_parity.py`. They are tasks T009 to T011. |
| RS codes | The AI Systems `.skilled/skills` is a symlink to the Public main checkout, so the research note that the vendored RS codes differ is stale. |
| Commits per system | The run first landed as one AI Systems commit; it was split into seven, one per system, so one `git revert` undoes one system (NFR-R01). Each system's gate edits ride in its own commit with its skill moves, and the split tree equals the combined one byte for byte. |
| Moneybird token baseline | Phase 009 ran `token-baseline.py --check` with a seeded tiktoken cache, which this phase's baseline could not, and found the `units` rows stale after the move (the pre-move tree passes). `token-baseline.py` rewrote `benchmark/token-baseline.json`, the check now exits 0, and the file joined the unpushed Moneybird commit, now `b12930a`. |
| Barter - Copywriter differential | It already failed on a stale `lane-budget-baseline.md`, so the Copywriter router gate is not in criterion 2. A phase 008 follow-up, found by the phase 009 battery, refreshed the baseline with `lane_budget.py --write` (each lane 434 tokens higher, all under their ceilings) in commit `66e69cbd2`, and the differential now passes `186/186`. |
<!-- /ANCHOR:log -->
