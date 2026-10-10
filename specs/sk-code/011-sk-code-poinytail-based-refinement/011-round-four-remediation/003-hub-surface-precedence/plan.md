---
title: "Implementation Plan: Phase 3: hub-surface-precedence"
description: "Reorder the surfaces in the sk-code hub's routerPolicy.tieBreak to opencode, obsidian, webflow, which is the documented detection precedence, so every multi-surface bundle lists the higher-precedence packet first. One canary case pins the implementation phrasing in both fixture copies, one SKILL.md sentence states the rule, and the hub moves to release 2.2.6.0."
trigger_phrases:
  - "hub surface precedence plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 3: hub-surface-precedence

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON hub data, Markdown, Node.js (v26.8.2 observed) for the read-only probes |
| **Framework** | None. The compiled-routing canary harness at `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/` |
| **Storage** | None |
| **Testing** | Canary assertion, all-hub canary run, route probe, advisor battery replay, router-sync, doc-claims, parent-skill-check, leaf manifest `--check` |

### Overview
The canary router sorts the modes it keeps by `routerPolicy.tieBreak` (`canary-router.cjs:251-253`, `:264`), and the sk-code list places webflow before opencode and obsidian (`hub-router.json:7`). This phase changes only that hub data line, so the shared router code under `.skilled/bin/lib/` stays as it is. A new canary case checks the implementation phrasing beside the review-phrased case, a hub `SKILL.md` sentence says why the list reads that way, and the six hub-root carriers move to 2.2.6.0 with a changelog entry. The orchestrator re-mints the compiled manifest afterwards.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Hub data change plus one regression fixture case. No code changes.

### Key Components
- **Recheck (2026-10-10).** `node specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/003-hub-surface-precedence/scratch/probe-route.cjs "obsidian plugin webflow implementation"` printed `route orderedBundle sk-code-webflow,sk-code-obsidian`, and `node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "obsidian plugin webflow implementation"` returned the same target order. The item still reproduces. The probe is a byte copy of the one round three used, `010-round-three-remediation/005-opencode-and-guards/scratch/probe-collision.cjs`.
- **Cause.** `scoreModes` gives Obsidian two hits (`obsidian`, `obsidian plugin`) and Webflow two hits (`webflow`, `webflow implementation`), 8 points each (`canary-router.cjs:208-219`). Both stay within `ambiguityDelta: 1`, and `evaluateCanary` sorts the kept pair by `tieBreak` (`canary-router.cjs:264`). The review-phrased case passes only because review takes the first slot and Webflow, with one hit, falls outside the delta.
- **Fix: `hub-router.json:7`.** `tieBreak` becomes `["sk-code-quality", "sk-code-review", "sk-code-opencode", "sk-code-obsidian", "sk-code-webflow"]`. The compiler builds every bundle rule from this list (`registry-compiler.cjs:227-242`), so the bundle kinds stay valid. Doctor rule 5e still sees an exact permutation (`.skilled/commands/doctor/scripts/parent-skill-check.cjs:1076`) and rule 5i still sees the workflow modes first (`:1144`).
- **Canary case.** `surface-collision-obsidian-over-webflow-implementation`, prompt `obsidian plugin webflow implementation`, expected `route`, `orderedBundle`, `["sk-code-obsidian", "sk-code-webflow"]`, inserted after `surface-collision-obsidian-over-webflow` in `canary-cases.v1.json`, then copied byte for byte over the archive copy, the way round three's T030 did.
- **Hub `SKILL.md` sentence.** After the example `"review my webflow animation for jank" → [sk-code-review, sk-code-webflow].` (`SKILL.md:72`): ``Bundled surfaces follow the `routerPolicy.tieBreak` order, which is the detection precedence OPENCODE > OBSIDIAN > WEBFLOW, so the higher-precedence evidence packet comes first.``
- **Release.** 2.2.5.0 to 2.2.6.0 is a patch bump (bug fix) under `.skilled/skills/sk-doc/sk-create-changelog/SKILL.md` section 4. The six carriers are the ones `SKILL.md:17` names. The entry uses the compact shape of `assets/changelog-template.md` section 2 and keeps a `version:` line, which doctor rule 13d reads. Its full text is `scratch/units/v2.2.6.0.md`.

### Data Flow
A prompt is lower-cased and scored per mode. The modes within the delta of the top score are kept and sorted by `tieBreak`, and the sorted list picks the bundle rule and its kind. The compiled front door serves the same model once the manifest is re-minted. Until then it returns the legacy sentinel `{"servingAuthority":"legacy","hubId":"sk-code"}`.

### Decisions

| ID | Decision | Why |
|----|----------|-----|
| D1 | Fix in hub data (`tieBreak`), not in shared router code | The brief prefers hub-local data, and shared code under `.skilled/bin/lib/` serves seven hubs. The dry run shows hub data alone fixes it |
| D2 | Reorder every surface to opencode, obsidian, webflow, not only swap obsidian and webflow | `stack-detection.md:39` gives one total order. A partial swap would leave `webflow opencode` listing Webflow first, which the probe showed before the fix |
| D3 | The rule is stated in `SKILL.md`, not in a new `hub-router.json` key | A new `routerPolicy` key is an unchecked schema change for the compiler and doctor. `SKILL.md` already explains `surfaceBundle` ordering on the same line |
| D4 | The new case uses `riskSlice` `actor:mutating:composite` with no `certificateFixture` | It mirrors round three's probe input. The canary router reads neither field when routing |
| D5 | The negative control runs between adding the case and reordering the list | Running the new case against the old order proves it can fail, the same way round three proved its guard tests |

### Round three's reason, and this plan's answer
Round three recorded the item as "Not a defect here" and left it out because the hub router belonged to its child 001, and because no rule said whether implementation phrasing should also put Obsidian first (`010-round-three-remediation/005-opencode-and-guards/plan.md:108`, and the "Not built" row of `010-round-three-remediation/goal.md:122`). This child owns `hub-router.json`, so the ownership reason no longer applies. The open question is settled by the hub's own precedence rule, which has no phrasing exception, and by its reason that an Obsidian plugin outranks a Webflow marker in the same tree (`stack-detection.md:76-79`).

### Handoffs
None outgoing. This child needs no file that another child owns. Hub-file edits from children 001, 002, 004 or 005 reach this build through the orchestrator and land in the same 2.2.6.0 release. Each reader-visible one adds one glance bullet to `changelog/v2.2.6.0.md`.

### Orchestrator steps
The builder never runs these: the compiled manifest re-mint and its archive copy (T024, T025), the Hermes generator (T026) and the trigger-index rebuild (T027). The builder runs only the `--check` forms in Phase 3. The leaf manifest needs no refresh: the planner dry run kept `leaf-manifest.json OK (59ea33fd...)`, because the manifest lists packet leaves and no hub-root files.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- **Planner dry run (2026-10-10).** All 12 units in `scratch/dispatch-units.json` were applied to a mirror holding copies of the sk-code hub, `.skilled/bin` and the doctor folder, with the other skills linked read-only. Every unit check printed its expected text. Results: the canary printed `cases 13 failures 0` with the new case OK, and the negative control printed `cases 13 failures 1`. The all-hub run kept its baseline, `all hubs failures 1`, from `004-cli-external-orchestration jev-transport-single`. Router-sync printed 5/5, doc-claims 4/4 and parent-skill-check `OK` with 5e, 5i, 13c and 13d PASS. The leaf manifest stayed `OK (59ea33fd...)`. The changelog validated with 0 issues. `SKILL.md` kept 0 issues and 36 voice hard blockers. A re-mint in the mirror gave `sk-code fresh`, and the front door then returned `sk-code-obsidian` before `sk-code-webflow`.
- **Surface pairs.** The probe covers four prompts: `obsidian plugin webflow implementation`, `obsidian opencode`, `webflow opencode` and `opencode webflow obsidian`. Before the fix, three of the four list Webflow ahead of a higher surface. After it, all four follow OPENCODE > OBSIDIAN > WEBFLOW.
- **Advisor.** `scratch/advisor-battery.cjs` replays the SA-001 battery from `.skilled/skills/sk-code/manual-testing-playbook/skill-advisor-integration/advisor-probe-battery.md` through `skill_advisor.py --threshold 0.8`. It printed `positives 13/17 negatives-false-positive 2/5` on two planning runs. That is below the scenario's own pass bar. The bar for this phase is no change, and the advisor does not read `tieBreak`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Baselines at plan time: sk-code canary `cases 12 failures 0`, all hubs `all hubs failures 1` (the cli-external-orchestration case above, exit 1), router-sync 5/5, doc-claims 4/4, parent-skill-check `OK` with 0 warnings, leaf manifest `OK (59ea33fd...)`, compiled guard all hubs fresh with sk-code policy hash `d55cc15d57f7a1ac47e9614242c8b71ebc97d9bad4f194a106f1f49072c7e78d`, Hermes `--check` `PASS: 70 Hermes skill copies in sync`, and `git status --porcelain` over this phase's paths empty.
- The re-minted policy hash will differ from `d55cc15d...`. The planner mirror gave `4cbc56a5...`, and any incoming handoff edit to `SKILL.md` moves it again.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- Restore the eight modified tracked files with `git restore` on the Files to Change paths in `spec.md`, and delete `.skilled/skills/sk-code/changelog/v2.2.6.0.md`.
- If the orchestrator has re-minted, rerun `node .skilled/bin/compiled-route-manifest.cjs refresh --hub sk-code --skill-root .skilled/skills/sk-code` and copy the manifest over its archive copy again, then regenerate Hermes.
<!-- /ANCHOR:rollback -->

---
