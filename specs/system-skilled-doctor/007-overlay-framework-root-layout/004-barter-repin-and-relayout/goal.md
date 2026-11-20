---
title: "Goal: Phase 4: barter-repin-and-relayout"
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
    packet_pointer: "system-skilled-doctor/007-overlay-framework-root-layout/004-barter-repin-and-relayout"
    last_updated_at: "2026-11-20T16:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-004-barter-repin-and-relayout"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 4: barter-repin-and-relayout

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** From an ai-speckit session, Barter's vendored tree `ai-speckit/skilled` is re-pinned onto the Skilled commit named on this phase's `Target Skilled commit:` line and every overlay source is relaid under `framework/` or `root/`, so status passes with an empty `offLayout` in three commits that each revert alone.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The session runs with cwd `/Users/michelkerkmeester/MEGA/Development/Skilled/barter/ai-speckit`. In the Skilled checkout it writes only this phase's `spec.md`, `plan.md` and `tasks.md`. |
| D2 | Nothing starts while the `Target Skilled commit:` line in this phase's `spec.md` still reads `<C>`. |
| D3 | The re-pin is staged first, and the `adopted-skilled-commands-doctor-routes-yaml` copy is rebased onto the target commit before the live run. |
| D4 | From the live re-pin to `apply --relayout`, no `--adopt` runs and no overlay source is edited, apart from the changelog record. A `not-copied` decision that needs an `--adopt` becomes its own change after this phase; a `STALE` line halts the run for the operator. |
| D5 | The commits land in order: `chore(overlays): re-pin Skilled to <short C>`, `docs(changelog): record the <short C> re-pin in <release>`, then the relayout with every path fix. Each is staged by explicit pathspec, and `relayout-runs/` never reaches git. |
| D6 | The folder name `barter-overlays`, the overlay-folder setting and the hooks' folder lookup are phase 5's. This phase changes only the source segment after `barter-overlays/`. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [ ] In `ai-speckit`, `[ "$(node -p "require('./skilled/barter-overlays/overlay-manifest.json').pin.commit")" = "$(sed -n 's/^Target Skilled commit: //p' /Users/michelkerkmeester/MEGA/Development/Skilled/specs/system-skilled-doctor/007-overlay-framework-root-layout/004-barter-repin-and-relayout/spec.md)" ]` exits 0.
- [ ] In `ai-speckit`, `node -p "require('./skilled/barter-overlays/overlay-manifest.json').overlays.find(o=>o.id==='adopted-skilled-commands-doctor-routes-yaml').pinnedSha256"` prints the same hex as `git -C /Users/michelkerkmeester/MEGA/Development/Skilled show "$(node -p "require('./skilled/barter-overlays/overlay-manifest.json').pin.commit")":.skilled/commands/doctor/_routes.yaml | shasum -a 256`.
- [ ] In `ai-speckit/skilled`, `node .skilled/commands/doctor/scripts/overlay-engine.cjs status` prints `RESULT: PASSED` and no line starting `LAYOUT`, `status --json` has an `offLayout` array of length 0, and a following `apply` prints `0 changed`.
- [ ] In `ai-speckit`, `rg -n '"source": "skilled/' skilled/barter-overlays/overlay-manifest.json` prints nothing, and `node -e 'const m=require(process.argv[1]); console.log("off-rule="+m.overlays.flatMap(e=>[e.source,e.fragment,e.base]).filter(v=>typeof v==="string"&&!/^(framework|root)\//.test(v)).length)' "$PWD/skilled/barter-overlays/overlay-manifest.json"` prints `off-rule=0`.
- [ ] In `ai-speckit`, `git log --format=%s -3` prints three subjects whose second starts `docs(changelog): record the ` and whose third starts `chore(overlays): re-pin Skilled to `, `git show --stat --format= HEAD~1` lists one file, `git show --stat HEAD` lists no path under `relayout-runs/`, `overlays.length` of `skilled/barter-overlays/overlay-manifest.json` is equal at `HEAD` and `HEAD~3`, and `ls skilled/barter-overlays/relayout-runs` fails.
- [ ] In `ai-speckit`, `bash tests/run-all.sh` exits 0, and `node --test` over every `*.test.cjs` and `*.test.mjs` under `skilled/barter-overlays`, skipping `relayout-runs/` and `repin-runs/`, exits 0 and prints `# fail 0`.
- [ ] In `ai-speckit`, `rg -n --hidden 'barter-overlays/(skilled|opencode|pi|vibe)/|barter-overlays/(AGENTS\.md|REPO RULES\.md|opencode\.json|utcp_config\.json)' --glob '!specs/**' --glob '!**/changelog/**' --glob '!.index/**' --glob '!.git/**' --glob '!**/relayout-runs/**' --glob '!**/repin-runs/**' .` prints nothing.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG
<!-- FILL: Record each step with its command output. Keep this table current. GOOD: T001 Done. `ls logs/archive | wc -l` printed 3. WEAK: Progress is good. -->

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Child goal authored | Done | `/create:goal ... child :auto`, criteria drawn from REQ-001 to REQ-013 in `spec.md` and the verify commands of T010, T020, T021, T035 to T040 in `tasks.md` |

### Deviations and findings

| Item | Note |
|------|------|
| No `acceptance-criteria.md` | This phase is Level 1 and carries none. On the operator's direction the goal takes acceptance from `spec.md`, `plan.md` and `tasks.md`, so the workflow's stop on a missing acceptance file was bypassed |
| `packet_budget=unknown` | A phase child that is not itself a phase parent is exempt from the 4,000-character cap and reports `unknown` (`budget-and-handoff.md` section 2), so `ok` is not the expected result here |
<!-- /ANCHOR:log -->
