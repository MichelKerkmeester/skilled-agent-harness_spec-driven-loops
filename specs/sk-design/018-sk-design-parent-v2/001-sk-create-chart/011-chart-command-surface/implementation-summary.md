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
    packet_pointer: "specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/011-chart-command-surface"
    last_updated_at: "2026-09-04T12:55:00Z"
    last_updated_by: "implementation"
    recent_action: "All 39 command documents validate clean; every router conforms to its contract"
    next_safe_action: "Commit, then hand over the three items in Known Limitations"
    blockers: []
    key_files:
      - ".opencode/commands/create/chart.md"
      - ".opencode/commands/create/assets/create-chart-presentation.txt"
      - ".opencode/skills/sk-doc/mode-registry.json"
      - ".opencode/skills/sk-doc/SKILL.md"
      - ".opencode/skills/sk-doc/command-metadata.json"
      - ".opencode/agents/markdown.md"
      - ".claude/agents/markdown.md"
      - ".opencode/commands/README.txt"
      - ".opencode/commands/create/README.txt"
      - ".opencode/commands/create/diagram.md"
      - ".opencode/commands/deep/research.md"
      - ".opencode/commands/memory/learn.md"
      - ".opencode/commands/speckit/plan.md"
      - ".opencode/commands/scripts/validate-command-references.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-055-chart-command-surface"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Does hub-router.json or ROUTER.md carry a command surface? Neither does. Only mode-registry.json and the SKILL.md mode table do."
      - "Should the @markdown agent roster list every /create:* command? Yes. All four missing commands were added and the runtime mirrors regenerated."
      - "Should the two command catalogs be derived from command-metadata.json? No. That file covers 20 of 39 commands and is itself a hand-kept copy of the frontmatter that had already drifted."
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
| **Spec Folder** | 011-chart-command-surface |
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

Added by the pass that closed the remaining fifteen commands:

| File | Change | Note |
|------|--------|------|
| `deep/research.md`, `deep/review.md`, `deep/ai-council.md`, `deep/model-benchmark.md` | Modified | Hint cut to the family-contract shape; the full flag surface moved into MODE ROUTING |
| `deep/skill-benchmark.md` | Modified | Description trimmed under the soft target |
| `speckit/plan.md`, `speckit/complete.md`, `speckit/implement.md` | Modified | Hint and description trimmed; flag surface moved into MODE ROUTING |
| `memory/manage.md` | Modified | Hint and description trimmed, and `memory_ln` corrected to `memory_embedding_reconcile` |
| `memory/search.md` | Modified | Hint trimmed, and the missing `allowed-tools` key added from the tools its body binds |
| `memory/learn.md` | Modified | Rebuilt as the six-section router its family contract already claimed, owning `learn-presentation.txt` |
| `vision.md` | Modified | Description trimmed; `HOW TO RESPOND` renamed to the canonical `INSTRUCTIONS` |
| `create/changelog.md` | Modified | Missing `allowed-tools` key added from what its workflow YAMLs actually use |
| `doctor/mcp.md`, `doctor/speckit.md` | Modified | Descriptions rephrased without angle brackets |
| `rewrite/explain-visually.md` | Modified | Description trimmed under the soft target |
| `doctor/assets/doctor-mcp-install.yaml` | Modified | `install_guide` repointed to where the file actually sits |
| `scripts/validate-command-references.cjs` | Modified | Runtime allowlist widened to the six runtimes that ship an agents tree |
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
| Reversed later: add all four missing commands at once | The partial fix was refused for the right reason, and the whole fix removes the reason. Chart, diff, repo-rule and with-human-voice were added together, so the roster now matches the command directory rather than a list someone maintained |
| Fix the catalogs by hand and reject the derived-catalog remedy | `command-metadata.json` reaches only 20 of the 39 commands, and it is a second hand-kept copy of the frontmatter that had already drifted from it. Deriving from it would relocate the staleness, not end it |
| Bring `/create:diagram` to zero warnings by relocating detail, not dropping it | The over-budget argument hint held real flags. They moved into the router body, which is what the validator's own fix hint prescribes, so the hint summarizes and no capability left the document |
| Fix only the mechanical warnings on commands outside this packet | The deprecated `$ARGUMENTS` echo and the repeated setup-answers boilerplate are identical everywhere they appear and carry no per-command meaning. Every remaining warning needs an authored judgment about which capability signal to shorten, so those are reported rather than guessed |
| Reversed later: author the judgment for all fifteen | The judgment was asked for, so the reason to defer was gone. Each was decided on its own evidence rather than by a rule, which is why the fixes differ: three routers needed a flag table, two needed a section, two needed a frontmatter key, and two needed nothing but different words |
| Ground every flag description in a source rather than inferring an effect | Writing a plausible effect for a flag is the failure mode a flag table invites. Each cell came from the feature catalog, the convergence reference, the presentation asset or the workflow YAML; where a flag's effect was not documented anywhere, the table carries its value grammar and points at the presentation asset that owns the binding |
| Correct `memory_ln` rather than leave a documented recovery path broken | It appears once in the whole repository and matches no registered tool, so the recovery for `degraded_needs_repair` could not be followed. `memory_embedding_reconcile` matches the sentence's description verbatim, so this was a naming error with one right answer, not a design choice |
| Widen the reference checker's runtime allowlist rather than delete the reference it rejected | The checker named three runtimes; six ship a populated `agents/` tree, and the reference it rejected pointed at a real one. The comment says the rule exists to catch a phantom directory, so a runtime the repository grew later is the false positive, not the target |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `validate_document.py --type command` on the router | PASS, exit 0, 0 issues. The diagram router reported 3 warnings on the same check and now reports 0 |
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
| `validate_document.py --type command` across the whole command tree | 24 of 39 clean, up from 12 of 39. The 15 remaining each need an authored trim or a new section |
| `validate_document.py` on both command catalogs | 0 issues each. The root catalog had 1 pre-existing warning |
| `sync-agents-pi.cjs --check` and `sync-agents.cjs --check` | Both reported the markdown agent stale after the hand edit, then `PASS: 12 agents are in sync` after their own sync run |
| `agent-roster-mirror-check.cjs` | `STATUS=OK`, exit 0, every runtime covers the canonical roster |
| `sync-runtime-mirrors.cjs --check` and `sync-prompts.cjs --check`, re-run | `PASS` 173 mirrors and `PASS` 37 prompts, unchanged. Command mirrors are symlinks, so the router edits propagate without a regeneration |
| `derive-command-bridges.cjs --check`, re-run | `fresh`, `changed: []`, exit 0, unchanged by the frontmatter edits |
| `generate-command-routers.cjs --check`, re-run | exit 1 on the same pre-existing `memory/learn.md` drift only, `routers=31 clean=30`, unchanged |
| Advisor vitest, 4 command suites, re-run | 15 passed, exit 0, unchanged from baseline |
| `validate-command-references.cjs` | exit 1 on the same 8 pre-existing unresolved references, unchanged from baseline. None are in this packet's surface |
| `test-flowchart-validator.sh` | PASS, exit 0 |
| Roster count across all six runtime surfaces | 14 of 14 in `.opencode`, `.claude`, `.pi`, `.codex`, `.cursor`, `.devin` |
| `check-corpus.cjs --render` | `RESULT: PASSED`, errors 0, exit 0, run serially |
| Advisor probes, 6 chart prompts | 4 surface `sk-doc` with a compiled route to `sk-create-chart`. Before the change, 3 surfaced with no compiled route at all |

Added by the pass that closed the remaining fifteen commands. Every command was run from the repository root against the final state, with output written to a file and the exit status read directly rather than through a pipe.

| Check | Before | After |
|-------|--------|-------|
| `validate_document.py --type command`, all 39 commands | 24 clean, 15 carrying 23 issues | 39 clean, `Total issues: 0` on every one |
| `generate-command-routers.cjs --check` | exit 1, `routers=31 clean=30 path-drift=1 shape-drift=1` | exit 0, `routers=32 clean=32 path-drift=0 shape-drift=0` |
| Contract conformance audit over every router | not previously run | `routers=32 asset_refs=153 missing=0`; sections, order, numbering and frontmatter keys all conform |
| `validate-command-references.cjs` | exit 1, 8 unresolved | exit 1, 6 unresolved, all one missing skills-side template |
| `command-catalog-mirror-check.cjs` | exit 0, 4 prose divergences | exit 0, 10 prose divergences; the 6 new ones are the deep metadata handover in Known Limitations |
| `route-validate.sh` | not re-run before | exit 0, 10 routes, 13 PASS rows, 2 warnings |
| `sync-prompts.cjs`, then `--check` | 37 in sync | wrote 0 of 37, `--check` PASS. Prompts are generated stubs and needed no rewrite |
| `sync-runtime-mirrors.cjs`, then `--check` | 173 in sync | linked 0, removed 0, `--check` PASS across 8 trees |
| `node` over the 4 doctor script test suites | not re-run before | 4 of 4 exit 0 |
| Advisor vitest, 3 command suites | 9 passed | 9 passed, exit 0 |
| `agent-roster-mirror-check.cjs`, `parent-skill-check.cjs`, `skill-graph-freshness.cjs` | not re-run before | exit 0 each |
| `audit_descriptions.py` | not re-run before | exit 0; no command is over the soft target, and the 5 that are are skills and one agent |
| Command description budget | 4,045 chars | 3,748 chars, 297 returned to the project total |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Two plausible chart prompts still abstain.** "make a chart of our monthly revenue by plan" and "which chart type should I use to show the spread of delivery times" return no recommendation at the 0.8 confidence bar. Probed at a lowered threshold, both score `sk-doc` top and carry the correct compiled route to `sk-create-chart`, so this is a scorer property rather than a wiring gap. Both were equally silent before the change.
2. **Closed: the `@markdown` agent roster now names all fourteen.** It listed ten, missing chart, diff, repo-rule and with-human-voice, and its own contract returns `STATUS=FAIL ERROR=unsupported-create-template` for a template it does not list, so the agent path was closed for four commands. All four were added to the invocation list and the command template map, the dispatch contract's count moved from ten to fourteen, and the Codex and Pi mirrors were rebuilt by their own sync scripts rather than by hand. Cursor and Devin are symlinks into the Claude tree and followed automatically.
3. **Closed: both command catalogs match the command tree.** They were staler than first recorded. The `create/` index was missing four commands, and the root index was missing three plus the entire `rewrite` group and the root `vision` command, with its group counts and structure tree wrong as well. Both were brought up to date and now validate at 0 issues. The proposed remedy of deriving them from `command-metadata.json` was rejected: it covers 20 of 39 commands, and it is itself a hand-kept copy of the frontmatter that had already drifted. A checker over the frontmatter is the proportionate guard and is proposed below rather than built.
4. **A code comment in the chart validator still says "twenty forms".** It sits at `check-corpus.cjs:581` inside the packet this change deliberately did not touch, and it describes a historical rationale rather than a live count.
5. **Closed: every command document now validates at zero issues.** The fifteen were fixed one at a time, since each needed the judgment a rule could not supply. Nine over-long hints were cut to the shape their family contract prescribes, and the flag surface each one stopped naming moved into a `Workflow Flag Surface` table in that router's MODE ROUTING, with the value grammar intact. Nine descriptions were trimmed under the soft target, which returned 297 chars to the project budget. `memory/learn.md` was rebuilt as the six-section router its family contract already claimed it was, and `vision.md`'s response section took the canonical `INSTRUCTIONS` name its non-router siblings use. The two angle-bracket warnings were real after all: both descriptions were rephrased without brackets, losing no meaning, because the validator emits that warning on any bracket and zero was the bar.
6. **A checker for the catalogs now exists but is uncommitted.** `command-catalog-mirror-check.cjs` covers what this row asked for, reporting `STATUS=OK` with all four catalogs and both hub metadata files at full coverage. It is untracked in the working tree and was not written by this pass, so it is recorded here rather than claimed.

7. **Six deep-command entries in `system-deep-loop/command-metadata.json` now disagree with their frontmatter.** Trimming the `deep` hints and descriptions moved them away from the hand-kept copies in that file. `command-catalog-mirror-check.cjs` reports the divergence and names the repair direction itself: the command frontmatter is the source, and the hub metadata entry is what must follow. The file sits under `.opencode/skills/`, which this pass was scoped out of, so the six values are handed over rather than applied. Default run stays exit 0; `--strict` fails on 10, the other 4 being pre-existing `sk-doc` create entries.

8. **Six workflow assets reference a spec template that has never existed.** `create-feature-catalog`, `create-manual-testing-playbook` and `create-skill-parent`, in both their auto and confirm YAMLs, list `system-spec-kit/templates/examples/level-2/checklist.md` among the templates they load. No level ships a `checklist.md` — not level-1, level-2, level-3 or level-3+ — and the path was already absent at the previous commit. This is the one reference-gate failure the pass could not close: creating the template means writing under `.opencode/skills/`, and repointing the six references means choosing a substitute that does not exist. The instruction to create `checklist.md` is itself correct, so deleting the lines would lose real behaviour.

9. **`/speckit:resume` does not support three modes its family contract declares.** The speckit entry lists `:autopilot`, `:unattended` and `--unattended` in `mode_matrix.supported_modes`, and `resume` implements none of them — its hint offers `:auto` and `:confirm` only, and neither of its workflow YAMLs mentions autopilot. The contract's `overrides` array can vary `default_policy` per command but not `supported_modes`, so either the schema needs a per-command mode override or `resume` is under-implemented. The contract is read-only to this pass, so the mismatch is reported rather than resolved.

<!-- /ANCHOR:limitations -->

---
