---
title: "Implementation Plan: Phase 5: router-sync-guard"
description: "The restored router-sync guard is a standalone CommonJS script with a sibling replay library. It runs five legs (the orphan leg is 1b) over the live sk-code tree and joins the drift-guard umbrella for the legs that pass today. A prototype run on the current tree records each leg's real result."
trigger_phrases:
  - "router sync guard plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 5: router-sync-guard

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS (v26.8.2 observed) and bash |
| **Framework** | None. Node built-ins `node:fs` and `node:path` only |
| **Storage** | None. Reads JSON and markdown from the sk-code tree |
| **Testing** | Seeded-defect controls (`scratch/prototype/negative-controls.sh`), the drift-guard umbrella, `generate-leaf-manifest.cjs --check`, `sync-skills-hermes.cjs --check`, `validate_document.py`, `validate.sh --strict` |

### Overview
The guard re-implements the four checks of the deleted vitest suite without vitest. Its replay functions come from the recovered `router-replay.cjs` with the CLI block removed, and its frontmatter reader needs only the leading fence. The prototype in `scratch/prototype/` runs that code against the current tree: legs 1a, 2, 3 and 4 pass, and leg 1b fails on nine docs. The umbrella wiring is planned for the passing legs only and waits for the operator's go, because parent decision D3 requires a stop when the guard fails on the current tree.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md sections 2 and 3)
- [x] Success criteria measurable (spec.md section 5, each tied to a command in tasks.md)
- [x] Dependencies identified (spec.md section 6; the recovered sources are in `scratch/source/`)

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A check script beside its library, run by the drift-guard umbrella, with no test-runner dependency.

### Key Components

- **Guard `assets/scripts/verify_router_sync.cjs`**: five leg functions, `legPaths` (1a), `legOrphans` (1b), `legSurfaceMap` (2), `legBijection` (3) and `legScenarios` (4). Paths come from `__dirname`: `SKCODE = path.resolve(__dirname, '..', '..', '..')`, `SKILLS_ROOT = path.resolve(__dirname, '..', '..', '..', '..')`, `REPO_ROOT = path.resolve(SKILLS_ROOT, '..', '..')`. The `--checks` flag takes a comma list of leg ids and defaults to all five. An unknown id prints usage and exits 2. Output per leg is `PASS check <id>: <title>` or `FAIL check <id>: <title> (N problem(s))` followed by up to 12 indented problem lines. The summary is `router-sync: X/Y checks passed`. Exit status is 0 when every selected leg passes, otherwise 1.
- **Library `assets/scripts/router_replay_lib.cjs`**: lines 1 to 726 of the recovered `router-replay.cjs`, with the CLI block at lines 727 to 741 removed, the banner rewritten and the exports reduced to `parseRouter`, `loadSurfaceRouter`, `registryPacketRoots` and `routeSkillResources`. The contract path at source line 200 becomes `path.resolve(__dirname, '..', '..', '..', '..', 'sk-doc', 'sk-create-skill', 'scripts', 'lib', 'leaf-resource-contract.cjs')`. That is the same four-level arithmetic the recovered file used, and it resolves to `.skilled/skills/sk-doc/...` from the new folder (checked in the Path Arithmetic section below).
- **Leg 1a walk**: the hub machine router (`SKILL.md`), the surface router (`ROUTER.md` at the sk-code root, found by `loadSurfaceRouter`) and the hub's `hub-router.json` supply the routed paths. Each must exist under the hub root or a mode packet root (`registryPacketRoots`). The prose maps between `## 4. WEBFLOW MAP` and `## 7. VERIFICATION COMMANDS` must name only routed paths. A missing section anchor is a FAIL, never an empty scan.
- **Leg 1b walk (replaces the retired walk)**: every `.md` under `references/` and `assets/` of each top-level folder of sk-code, including `shared/`. A doc counts as routed when the hub machine router, the surface router, or its own packet `SKILL.md` names it. The retired walk read `sk-code/references` and `sk-code/assets`, which do not exist, so it found zero docs. A walk that finds zero docs is a FAIL.
- **Leg 2 surface list**: `['sk-code-webflow', 'sk-code-opencode']`. The retired list also named `sk-code-mobile-cli`, which is not in the tree. The leg keeps the retired rules, including the allowance for `sk-code-obsidian` as a surface packet.
- **Leg 3 route-gold**: candidates in order are `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/001-sk-code/compiled/route-gold.typed.json` and the non-archived path the retired suite used. When neither exists, the leg FAILS with both paths in the message. The retired suite returned early in that case, which passed silently.
- **Umbrella `scripts/run-all-drift-guards.sh`**: a `ROUTER_SYNC` variable, a third `run_guard` line that calls `node "${ROUTER_SYNC}" --checks 1a,2,3,4`, and a final line `all 3 guards PASSED`. Gated (see Decision below).

### Data Flow
The guard reads `SKILL.md`, `ROUTER.md` and `hub-router.json` through the library, and `leaf-manifest.json` and the route-gold file as JSON. Leg 3 calls `qualifiedIdToLeaf` from the sk-doc contract library. Leg 4 replays each playbook prompt through `routeSkillResources` and compares the emitted resources with the scenario's `expected_resources`. The umbrella calls the guard once and turns its exit status into one more `PASS:` or `FAIL:` line.

### Current-Tree Results (planning run, 2026-10-10)

The prototype in `scratch/prototype/` runs the port against the live tree. The verbatim column is the retired suite's logic with only the paths it needs to run, on the same tree.

| Leg | Verbatim port | Restored guard | Evidence |
|-----|---------------|----------------|----------|
| 1a paths and prose | PASS, 176 machine-router paths | PASS, 176 paths | `scratch/prototype/prior/run-verbatim.txt`, `scratch/prototype/run-subset-v2.txt` |
| 1b orphans | PASS, but vacuous: the walk found 0 docs because `sk-code/references` and `sk-code/assets` do not exist | FAIL, 9 docs, listed below | `scratch/prototype/run-default-v2.txt` |
| 2 surface map | THROWS: `ENOENT` on `sk-code-mobile-cli/SKILL.md` | PASS | `scratch/prototype/run-subset-v2.txt` |
| 3 bijection | Route-gold path does not exist, so the retired check returns early. The archived copy passes every round trip and manifest check | PASS, gold read from `z_archive` | `scratch/prototype/run-subset-v2.txt` |
| 4 playbook routing | PASS, 37 scenarios | PASS, 37 scenarios | `scratch/prototype/run-subset-v2.txt` |

Leg 1b, nine docs (no router names them):
- `shared/references/workflow-debug.md`, `shared/references/workflow-implement.md`, `shared/references/workflow-verify.md`
- `sk-code-obsidian/references/accessibility.md`, `operations/operations.md`, `quality/doc-quality-gate.md`, `setup/setup.md`, `skill-reference-integrity.md`, `theme-variables.md`

Seeded-defect controls (`scratch/prototype/negative-controls.sh`), each run on a copy of the tree: C0 clean tree passes legs 1a, 2, 3, 4; C1 dead route fails 1a; C2 orphan probe fails 1b; C3 dropped manifest leaf fails 3; C4 playbook expectation for an unrouted doc fails 4; C5 missing route-gold fails 3. Result: 6/6 as expected (`scratch/prototype/run-negative-controls.txt`).

### Decision: leg 1b fails on the current tree (parent decision D3 applies)

Parent 007 goal decision D3 says to stop and report before wiring the guard into the umbrella if it fails on the current tree. This plan therefore does two things. It plans the umbrella wiring for legs 1a, 2, 3 and 4 only, because those pass. It marks the wiring tasks as blocked until the operator chooses one option for leg 1b:

- **Option A (recommended).** Leg 1b keeps failing and is not wired. A later phase routes or retires the nine docs, which is routing drift and sits outside this phase's scope, and then adds `1b` to the umbrella. Reason: the umbrella fails until the nine docs are dealt with, so the drift stays a blocking item rather than becoming a routine warning.
- **Option B.** The guard prints leg 1b as `WARN check 1b`, through a `--warn 1b` flag that keeps it out of the exit status. The umbrella runs `--checks 1a,1b,2,3,4 --warn 1b`. This changes the PASS/FAIL output contract for that one leg, and every gate run shows the nine docs.

### Path Arithmetic (verified before the build relies on it)

From `.skilled/skills/sk-code/sk-code-opencode/assets/scripts`, four `..` steps reach `.skilled/skills`, and three reach `.skilled/skills/sk-code`. The builder confirms this with `node -e` on the final folder before writing the constants. The prototype used an environment variable in place of `__dirname`, which is the only deliberate difference from the final file.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- **Leg-level runs.** `node <guard> --checks 1a,2,3,4` must exit 0 with four PASS lines. `node <guard>` must exit 1 with `FAIL check 1b` and nine orphan lines. `node <guard> --checks 9` must exit 2.
- **Seeded-defect controls.** `negative-controls.sh` copies the tree, the guard and the sk-doc contract library into a `mktemp -d` folder, seeds one defect per control, and requires the expected FAIL line and exit status. It never edits the repository and never deletes anything. The default `GUARD_SRC_DIR` is the repository's `assets/scripts` folder.
- **Umbrella.** The before-image is `scratch/before/umbrella.txt` (exit 0, `Errors: 0`, `Warnings: 247`, `all 2 guards PASSED`). After wiring, the run must still show `Errors: 0`, a warning count no higher than 247, and `all 3 guards PASSED`.
- **Generated artifacts.** `generate-leaf-manifest.cjs --check` must fail before `--write` and pass after it. The manifest diff must show only the two new leaves plus digest and count lines. `sync-skills-hermes.cjs` must change only `.hermes/skills/sk-code-opencode/SKILL.md`, and `--check` must then print `PASS: 70 Hermes skill copies in sync`.
- **READMEs.** `validate_document.py` prints `✅ VALID` and `Total issues: 0` for the three READMEs. The baseline check on 2026-10-10 passed all three.
- **Gap.** The umbrella is the only place the guard runs. CI does not run the guard in this phase. The first guard in the umbrella reads git-tracked files only, so the new files are not scanned until they are staged.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Recovered sources, saved read-only in `scratch/source/`: `sk-code-router-sync.vitest.ts` (407 lines) and `router-replay.cjs` (741 lines). They come from `git show b45ea54cea3^:...`. Task T006 confirms the copies still match git.
- `.skilled/skills/sk-doc/sk-create-skill/scripts/lib/leaf-resource-contract.cjs` supplies `qualifiedIdToLeaf` and `dualReadLegacyResource`. It is read only.
- Parent 007 goal decision D3 (stop before umbrella wiring on failure) and the parent open question on the same point.
- Sibling phase 002 changes `generate-leaf-manifest.cjs` to skip git-ignored files. This plan uses that generator unchanged.
- Node.js v26.8.2 observed. The guard uses only built-in modules.
- Compiled routing (CI blocker and pre-commit gate). `node .skilled/bin/compiled-route-guard.cjs` reported `sk-code fresh` on 2026-10-10 and exits 0. The workflow's own measurement comment says a SKILL.md under a hub changes that hub's policy hash, while `leaf-manifest.json` does not. So the SKILL.md edits in T019 and T020 need the check in T027, and the manifest regeneration in T026 does not. The pre-commit re-mint command is `node .skilled/bin/compiled-route-manifest.cjs refresh --hub sk-code`.
- Baseline gate state on 2026-10-10: `run-all-drift-guards.sh` exits 0 with `Errors: 0`, `Warnings: 247`. `generate-leaf-manifest.cjs --check` exits 0 with `leaf-manifest.json OK`. `sync-skills-hermes.cjs --check` exits 0 with `PASS: 70 Hermes skill copies in sync`.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- Tracked files: restore the umbrella script, `sk-code-opencode/SKILL.md`, the alignment reference, the two sk-code-opencode READMEs' touched sections, the benchmark README, `.skilled/skills/sk-code/leaf-manifest.json` and `.hermes/skills/sk-code-opencode/SKILL.md` from their `scratch/before/` copies. Use `git restore` on those paths, or copy the before-images back.
- New files: `assets/scripts/verify_router_sync.cjs` and `assets/scripts/router_replay_lib.cjs`. Removing them is an operator action, because they are untracked until staged.
- If the manifest or the Hermes copy is restored, rerun both `--check` commands to confirm they pass on the restored tree.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:cross-refs -->
## 8. CROSS-REFERENCES

- **Spec**: `spec.md`, sections 4 (requirements) and 7 (open questions)
- **Tasks**: `tasks.md`
- **Goal**: `goal.md`, completion criteria 1 to 6
<!-- /ANCHOR:cross-refs -->
