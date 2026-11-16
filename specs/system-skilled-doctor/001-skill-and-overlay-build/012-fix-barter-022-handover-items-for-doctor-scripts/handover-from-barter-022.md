---
title: "Handover to Skilled: what Barter still sees after re-pinning to edf921316c"
description: "The seven handed-over fixes hold in Barter. Five items are left: the alignment guard fails on 23 of Skilled's own files, a live re-pin failed where its stage passed, a host pre-commit has no accepted form, two captured fixtures differ in a host, and two small overlay engine limits."
trigger_phrases:
  - "alignment drift pi extensions module header"
  - "repin live run failed after stage passed"
  - "host pre-commit hook source"
importance_tier: "important"
contextType: "implementation"
---
# Handover to Skilled: what Barter still sees after re-pinning to edf921316c

<!-- SPECKIT_TEMPLATE_SOURCE: handover | v1.0 -->

---

<!-- ANCHOR:when-to-use -->
## WHEN TO USE THIS TEMPLATE

**Use this handover when** a Skilled session works on the alignment guard, the overlay engine's re-pin, the git setup check or the captured routing fixtures, or a Barter session re-pins after Skilled changes one of them.

**Addressed to:** Skilled. Every file named below is vendored and held at upstream bytes in Barter unless an overlay is named.

**Status:** open. Nothing below has been started in Skilled.
<!-- /ANCHOR:when-to-use -->

---

<!-- ANCHOR:handover-summary -->
## 1. Handover Summary

Barter re-pinned from `320e7b64d4` to `edf921316c` on 2026-11-13. The seven fixes from the earlier handovers hold there: an sk-code prompt answers in 259 to 313 ms with a compiled route, the advisor starts under Node 22.23.4 and 24.22.2 with no daemon, the five history prompts return sk-git, `compiled-route-sync.cjs --check` passes, router-sync passes 5 of 5 with `surfaceIntentFolds` set, and the git setup check accepts five hand-over hooks. Barter dropped its three temporary overlays.

**1. The alignment guard fails on 23 of Skilled's own files (confirmed in both trees).**
- `python3 .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify_alignment_drift.py --check-router` prints `[alignment-drift] FAIL`, `Errors: 23`, in the Skilled checkout at `edf921316c` and in Barter. The two error lists are identical.
- 22 are `[TS-MODULE-HEADER]` on files under `.pi/extensions/`: `ask-surface-guard`, `classifier-injection-screen`, `completion-evidence`, `decision-capture`, `dispatch-audit`, `dispatch-preflight-lint`, `env-secret-guard`, `git-message-gate`, `git-preflight-advisory`, `goal-context`, `mcp-route-guard`, `overlay-guard`, `post-edit-quality`, `prompt-advisor`, `session-compact-context`, `session-relaunch`, `session-start-advisories`, `session-start-context`, `session-stop-context`, `spec-gate-classify`, `spec-gate-enforce`, `task-dispatch-guard` (each `.ts`).
- Each of those is a one-line re-export, for example `export { default } from '../../.skilled/hooks/overlay-guard/pi/overlay-guard.ts';`.
- 1 is `[SH-STRICT-MODE]` on `.skilled/bin/skilled-loop-shell.sh`, whose header says it is sourced from `~/.zshrc` or `~/.bashrc`.
- Effect: `run-all-drift-guards.sh` fails, so `/doctor:sk-code setup` reports `drift-guards` as failed in any tree at this pin. It is the one row still failing in Barter's sk-code battery.

**2. A live re-pin failed where its stage passed (observed once).**
- `overlay-engine.cjs repin --stage` ended `RESULT: STAGED` and printed `stage skipped 9 regenerate and 10 verify step(s); the live run runs them`.
- The live run copied 890 paths and then ended `RESULT: FAILED` on `upstream-moved .skilled/skills/sk-git/graph-metadata.json`.
- Cause: the regenerate step `generate-router-intent-signals.cjs --write`, now running the fixed block pattern, rewrote that file without two phrases the old pattern had captured by mistake. Barter's `skill-root` overlay `sk-git-root` owns the file and its source still held the two phrases, so the check after regenerate saw a difference.
- The tree was left copied and pinned with the engine's own verify steps not run. Barter took the regenerated file into the overlay source and ran the runbook by hand.
- The engine reported a file a generator had just written as `upstream-moved`, which names the wrong cause.

**3. A host's own `pre-commit` has no accepted form in the git setup check.**
- `git-setup-check.cjs` accepts a hook that is a hook source, a hand-over file with the `# skilled-hook-handover:` marker and an `exec`, or an absent hook listed under `skilled.omitHook`.
- Barter's `pre-commit` is its own script: it runs the overlay engine's `status` and `pre-commit` and does not run Skilled's. It is installed, so `skilled.omitHook` does not cover it, and it hands over to nothing, so the marker does not either. The `hooks` row fails on that one line.

**4. Two captured routing fixtures differ in a host (measured).**
- `runtime/scripts/routing-accuracy/command-routing-baseline.json`, row `cmd-create-skill-plain-holdout-01`: three skills tie at 0.82 and Barter's `sk-code` leads where the capture has `cli-external-orchestration`. The row misses its expected command in both.
- `runtime/tests/parity/fixtures/local-native-approved-divergences.json`, entry `rr-hub6-205`: the local scorer returns no skill in Barter where the ledger records `sk-git`. The native top matches gold in both.
- Barter carries a `json-entry` overlay for each, one value apiece. Both follow from Barter's hub vocabulary, not from a scorer difference.

**5. Two small overlay engine limits.**
- A `json-entry` `set` operation refuses a key that does not exist yet (`missing key "surfaceIntentFolds"`). Barter used `insertObjectKeys` with an empty path instead.
- `apply --adopt` refuses a path under `repin.exclude` ("is not under a vendored root"), so a host file in an excluded folder gets its manifest entry written by hand. Barter's five hand-over hooks under `.opencode/scripts/git-hooks/` are that case.
<!-- /ANCHOR:handover-summary -->

---

<!-- ANCHOR:context-transfer -->
## 2. Context Transfer

- Evidence in this phase's `scratch/`: `align.txt` (Barter's alignment output), `stage1.log`, `stage3.log` and `live.log` (the re-pin runs), `advisor-suite2.txt`, `setup-a2.txt` and `setup-b3.txt` (the batteries).
- Item 1 was run in the upstream checkout at `/Users/michelkerkmeester/MEGA/Development/Skilled` with `main` at `edf921316c`. That checkout had two uncommitted paths at the time; which paths was not recorded.
- Not confirmed for item 1: whether the guard began reporting these at this pin or earlier. Barter's earlier triage did not list `alignment-drift` as failing, and no run at the old pin was kept to compare.
- Not confirmed for item 2: whether a stage that ran the regenerate steps on its copy would have caught it. It was not tried.
- Barter fixed the rest of its advisor failures on its own side by adding git vocabulary to its `sk-git` metadata. Those needed nothing from Skilled.
<!-- /ANCHOR:context-transfer -->

---

<!-- ANCHOR:next-session -->
## 3. For Next Session

Proposed to Skilled:

1. **Exempt generated re-export files and sourced shell files in the alignment guard**, or give them what it asks for. A one-line `export { default } from …` mirror has no module to describe, and `set -uo pipefail` in a file sourced into an interactive shell would change that shell.
2. **Run the regenerate steps on the staged copy**, so a stage that passes means the live run passes. Failing that, have the stage report say that a generator may rewrite a file an overlay owns.
3. **Name the cause when a generator changes an overlay-owned file.** `upstream-moved` sent the reader to the upstream diff, which was empty for that path.
4. **Give a host hook that replaces a Skilled hook an accepted form**, for example a `skilled.hostHook` local config value per hook, shown in the passing row's notes as `omitHook` is.
5. **Decide what a host does with captured fixtures.** Either let a host keep its own capture beside the upstream one, or have the two tests skip rows a host marks.
6. **Let `set` create a missing key, and let `apply --adopt` take a path under `repin.exclude`** when a source file for it exists in the overlay folder.

In Barter, after Skilled ships any of these: re-pin, drop the two fixture overlays if item 5 lands, and rerun both setup batteries.
<!-- /ANCHOR:next-session -->

---

<!-- ANCHOR:validation-checklist -->
## 4. Validation Checklist

- [ ] `verify_alignment_drift.py --check-router` prints no error in the Skilled checkout.
- [ ] `node .skilled/commands/doctor/scripts/sk-code-setup-check.cjs` ends `STATUS=PASS` in Barter.
- [ ] A re-pin whose stage ends `RESULT: STAGED` ends `RESULT: PASSED` live.
- [ ] `node .skilled/commands/doctor/scripts/git-setup-check.cjs` passes its `hooks` row in Barter with the host `pre-commit` declared.
- [ ] The advisor suite passes in Barter without the two fixture overlays.
<!-- /ANCHOR:validation-checklist -->

---

<!-- ANCHOR:session-notes -->
## 5. Session Notes

The operator asked for this handover after the re-pin and the Barter-side fixes (2026-11-13). Barter changed no vendored file for items 1, 2, 3 and 5.
<!-- /ANCHOR:session-notes -->
