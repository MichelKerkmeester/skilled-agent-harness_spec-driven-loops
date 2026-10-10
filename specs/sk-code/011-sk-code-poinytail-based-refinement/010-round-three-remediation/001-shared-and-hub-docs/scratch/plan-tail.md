<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. Phase 2 is also `scratch/dispatch-units.json`, one unit per task from T014 to T118, each with a check command and its expected output; dispatch them one at a time and run each check before the next unit.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- **Uniqueness**: `python3 -I scratch/gen_units.py` from the repository root rebuilds the units and prints `units=105 failures=0`, which proves every OLD text occurs once at the point its unit applies. Run it only before the build: after the build the OLD texts are gone by design.
- **Per unit**: `node scratch/check-unit.cjs <task>` prints `LANDED <task>` for every edit and the create. T138 counts 98.
- **Pointers**: `scratch/check-links.cjs` resolves every backticked `.skilled/` path and every `./` or `../` link in `shared/**/*.md`, the hub `SKILL.md` and the hub README. It skips one example input in a detection test case (`.skilled/skills/sk-doc/scripts/preview-server.js`). Plan-time dry run on the simulated tree: `checked=127 missing=0`.
- **Guards**: router-sync, the rule-copy canary, the compiled-route guard, the leaf manifest checks, `parent-skill-check.cjs` and the package validator, before (T002 to T006) and after (T126 to T129). The dry run on a copy of the hub with every unit applied passed all of them except compiled routing readiness, which reported `stale-manifest` as expected before the re-mint.
- **Docs**: `validate_document.py` and `hvr_scan.py` on every edited Markdown file and the new changelog, and the catalog package validator (`violations=2` before and after, both pre-existing description warnings).
- **Gap**: the Hermes copies, the trigger index and the sk-doc README fixtures go red until the orchestrator runs T119 to T121. T140 and T141 pin exactly which lines may appear.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Node.js and Python 3 as used by the guards. `rg` for the searches.
- `.skilled/skills/sk-doc/sk-create-skill/scripts/lib/root-router-contract.cjs` (the shared-control rule behind D2) and `.skilled/skills/sk-code/sk-code-opencode/assets/scripts/router_replay_lib.cjs` (the load behavior the new prose describes). Neither changes.
- `.skilled/skills/system-spec-kit/references/validation/validation-rules.md` sections 1 and 14 own the `validate.sh` contract T039 points to.
- `.claude/settings.json` wires `.skilled/hooks/post-edit-quality/claude/claude-posttooluse.cjs` as the `Write|Edit` `PostToolUse` hook, and `.skilled/scripts/install-git-hooks.sh` installs `.skilled/scripts/git-hooks/pre-commit` through `core.hooksPath`, both read on 2026-10-10.
- Baseline state: the spec-kit trigger index `--check` already exits 1 at plan time from unrelated stale spec docs, so T120 is a full rebuild, not a repair of this child alone.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- Restore the tracked files with `git restore -- .skilled/skills/sk-code/SKILL.md .skilled/skills/sk-code/ROUTER.md .skilled/skills/sk-code/README.md .skilled/skills/sk-code/description.json .skilled/skills/sk-code/hub-router.json .skilled/skills/sk-code/mode-registry.json .skilled/skills/sk-code/feature-catalog .skilled/skills/sk-code/shared .skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/sk-code/manifest.json`. This also brings back the three deleted pattern files.
- Delete the new `.skilled/skills/sk-code/changelog/v2.2.5.0.md`.
- If the orchestrator already ran T119 to T121, rerun those generators after the restore.
<!-- /ANCHOR:rollback -->

---
