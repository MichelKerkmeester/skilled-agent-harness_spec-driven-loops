---
title: "Implementation Summary: Chart Command Surface"
description: "/create:chart now exists and reaches every runtime, and the compiled routing the hub edit tore down was rebuilt in the same change rather than left for the next reader to discover."
trigger_phrases:
  - "chart command summary"
  - "create chart shipped"
  - "compiled routing restored"
  - "impl summary core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "specs/sk-doc/055-chart-command-surface"
    last_updated_at: "2026-09-04T09:05:00Z"
    last_updated_by: "implementation"
    recent_action: "Shipped /create:chart and refreshed sk-doc routing"
    next_safe_action: "Decide the two open questions in spec.md section 10, then commit"
    blockers: []
    key_files:
      - ".opencode/commands/create/chart.md"
      - ".opencode/commands/create/assets/create-chart-presentation.txt"
      - ".opencode/skills/sk-doc/mode-registry.json"
      - ".opencode/skills/sk-doc/SKILL.md"
      - ".opencode/skills/sk-doc/command-metadata.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-055-chart-command-surface"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Should the @markdown agent roster list every /create:* command? It names ten of fourteen."
      - "Should the two command catalogs under .opencode/commands/ be derived from command-metadata.json?"
    answered_questions:
      - "Does hub-router.json or ROUTER.md carry a command surface? Neither does. Only mode-registry.json and the SKILL.md mode table do."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 055-chart-command-surface |
| **Status** | Complete |
| **Completed** | 2026-09-04 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`/create:chart` exists. Before this change, fourteen of the fifteen `sk-doc` packets answered a slash command and `sk-create-chart` did not, so the only way to reach the chart corpus was to phrase a request the advisor happened to score above its bar. The second half of the work was less visible and mattered more: the hub `SKILL.md` is a hashed byte source of the compiled route, so editing it made the hub serve legacy, and the fleet was already in that state when this packet started.

### The command

The router is thin, in the shape the two most recently authored sibling commands use. It owns three assets: a presentation contract that holds every user-visible word, and two workflow files that run the same seven steps with and without an approval gate per step. The workflow is the packet's own: name the comparison the reader needs, resolve it to exactly one catalog row across both lookup tables, copy that form file whole, replace only the region between the data sentinels, apply one colour system, write the headline as a conclusion, then run the corpus check and read its `RESULT:` line.

Two behaviors are worth naming because they are refusals rather than features. A run that finds no catalog row reports the gap and stops, which is a successful terminal state. A run handed a described dataset rather than literal values also stops, because every value a chart form displays is typed into its data block.

### The routing repair

Editing the hub `SKILL.md` and `mode-registry.json` invalidates the activation manifest for both the runtime copy and the authored copy, and it drifts the canary's hand-pinned source digests. Both were refreshed here. One of the three drifted digests, `sk-create-chart/SKILL.md`, was already stale before this change, which is why the canary was red on arrival.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/commands/create/chart.md` | Created | The thin router, six canonical sections, zero validator issues |
| `.opencode/commands/create/assets/create-chart-presentation.txt` | Created | Phase 0, setup resolution, prompts, dashboard, catalog report, three terminal outputs |
| `.opencode/commands/create/assets/create-chart-auto.yaml` | Created | Seven autonomous steps with hard gates and recovery paths |
| `.opencode/commands/create/assets/create-chart-confirm.yaml` | Created | The same seven steps, checkpointed |
| `.opencode/skills/sk-doc/mode-registry.json` | Modified | `command` moved from `null` to `/create:chart` |
| `.opencode/skills/sk-doc/SKILL.md` | Modified | Mode-table command cell, and 20 forms corrected to 21 |
| `.opencode/skills/sk-doc/command-metadata.json` | Modified | Advisor-facing entry with a discriminator against `/create:diagram` |
| `.opencode/skills/sk-doc/README.md` | Modified | Command list, and the same form count |
| `.claude/commands/create/chart.md` | Created | Symlink, written by the mirror sync |
| `.cursor/commands/create-chart.md` | Created | Symlink, written by the mirror sync |
| `.codex/prompts/create-chart.md` | Created | Generated bridge, written by the prompt sync |
| `command-bridges.generated.json`, `projection.ts`, `skill_advisor.py` | Modified | Derived by `derive-command-bridges.cjs` |
| `command-metadata-e2e.vitest.ts` | Modified | Declaration census, 19 to 20 |
| `emitted-name-contract.json`, `test_emitted_name_contract.py` | Modified | Asset roster plus three names, YAML count 26 to 28 |
| `.opencode/bin/lib/compiled-routing/013-live-activation/activation/sk-doc/manifest.json` | Modified | Refreshed activation manifest |
| `019-skill-routing-refactor/015-router-unification-program/**` | Modified | Authored manifest copy, rebuilt canary artifacts, three re-pinned digests |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Baselines came first, including for the two gates that were already red, so the change could be measured rather than asserted. The surface sweep was `grep -rl "create:diagram"` over the repository excluding `specs/`, which found four surfaces that were not in the original brief: the Codex prompt bridge, the advisor command-bridge derivation and its two generated language blocks, a hard-coded declaration census in a vitest file, and a source-asset roster fixture with an exact-equality assertion.

Every derived file was written by its own generator rather than by hand, and each generator's `--check` was then run to prove the result was fresh. The three canary digests were re-derived independently through the harness's own `sourceBytes` and `sha256` before being written, rather than copied from the failure output.

One check failed and was diagnosed rather than dismissed. The chart corpus check with `--render` reported two `settled-render` errors while a second heavy job held the machine. Headless Chrome could not return the second document inside its budget. Run alone it printed `RESULT: PASSED` with zero errors, and `git status` over the chart packet showed no file changed at all, so nothing the check reads was touched.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Copy the two newest sibling routers rather than `/create:diagram` | The command packet has since deprecated the trailing `User request: $ARGUMENTS` echo and set frontmatter budgets. The diagram router carries three warnings for exactly those reasons, so copying it would have imported known defects |
| Give the metadata entry a discriminator naming `/create:diagram` | The chart packet documents this boundary as the one that actually gets tested: a request naming a bare type reaches both. The discriminator is where a sibling preference is recorded |
| Update the two test censuses rather than relax them | Both carry a comment saying to recount rather than relax. The census is the point: it is what makes adding a command a visible event |
| Re-pin the already-stale `sk-create-chart/SKILL.md` digest | The canary cannot report REAL-GREEN with it stale, and re-pinning is the step the pin block itself documents for a deliberate hub change |
| Leave the `@markdown` agent roster alone | It lists ten of fourteen `/create:*` commands. Adding only chart would make the inconsistency harder to see rather than easier. Recorded as an open question instead |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `validate_document.py --type command` on the router | PASS, exit 0, 0 issues. The diagram router reports 3 warnings on the same check |
| `check_authored_name_kebab.py` | PASS, exit 0 |
| `parent-skill-check.cjs .opencode/skills/sk-doc` | PASS, exit 0, 0 warnings, including `6c` which had nothing to assert for chart before |
| `sync-runtime-mirrors.cjs --check` | PASS, 173 mirrors in sync, up from 171 |
| `sync-prompts.cjs --check` | PASS, 37 prompts in sync, up from 36 |
| `derive-command-bridges.cjs --check` | fresh, `commandMetadata` 19 to 20, `generated` 27 to 28, `changed: []` |
| `generate-command-routers.cjs --check` | exit 1 on the pre-existing `memory/learn.md` drift only. `routers=31 clean=30`, up from `30 / 29` |
| `compiled-route.cjs --hub sk-doc` on a chart prompt | `action: route`, target `sk-create-chart`. Was `{"servingAuthority":"legacy"}` |
| `compiled-route-sync.cjs --check` | PASS, exit 0, all 5 hubs resolve |
| `compiled-route-sync.cjs --verify` | PASS, exit 0. Was exit 1, `promoted closure failed to resolve hubs: sk-doc` |
| `compiled-route-guard.cjs` | PASS, exit 0, all 5 hubs fresh. Was exit 1, `sk-doc stale-manifest` |
| `validate-canary.cjs` | `REAL-GREEN`, exit 0, 23 route-gold rows. Was exit 1, `CANARY_RED` |
| Advisor vitest, 3 command suites | 9 passed, exit 0, unchanged from baseline |
| `node --test` over the doctor script tests | 7 passed, exit 0 |
| `python3 -m unittest discover` over the create asset tests | 13 passed, exit 0, unchanged from baseline |
| `pytest` over 4 sk-doc README and contract suites | 26 passed, exit 0 |
| `npm run typecheck` over the advisor package | exit 0 |
| `python3 -m py_compile scripts/skill_advisor.py` | exit 0 |
| `check-corpus.cjs --render` | `RESULT: PASSED`, errors 0, exit 0, run serially |
| Advisor probes, 6 chart prompts | 4 surface `sk-doc` with a compiled route to `sk-create-chart`. Before the change, 3 surfaced with no compiled route at all |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Two plausible chart prompts still abstain.** "make a chart of our monthly revenue by plan" and "which chart type should I use to show the spread of delivery times" return no recommendation at the 0.8 confidence bar. Probed at a lowered threshold, both score `sk-doc` top and carry the correct compiled route to `sk-create-chart`, so this is a scorer property rather than a wiring gap. Both were equally silent before the change.
2. **The `@markdown` agent roster does not name the command.** It names ten of the fourteen `/create:*` commands, missing chart, diff, repo-rule and with-human-voice. Its own contract returns `STATUS=FAIL ERROR=unsupported-create-template` for a template it does not list, so the agent path is closed for four commands. The command itself does not require that agent: its Phase 0 checks packet resources, exactly as the diagram command's does.
3. **The two command catalogs under `.opencode/commands/` are stale.** `README.txt` at the root and under `create/` were each already missing two or three sibling commands. Deriving them from `command-metadata.json` would remove the failure mode entirely.
4. **A code comment in the chart validator still says "twenty forms".** It sits at `check-corpus.cjs:581` inside the packet this change deliberately did not touch, and it describes a historical rationale rather than a live count.
<!-- /ANCHOR:limitations -->

---
