---
title: sk-code
description: "The single advisor-routable entry point for code work: one hub that routes each request to the focused quality or review mode it needs, bundles the matching surface evidence and keeps one graph identity for the whole code family."
trigger_phrases:
  - "code skill"
  - "code mode router"
  - "sk-code hub"
version: 2.2.52.0
---

# sk-code

> You describe the code work and it routes to the mode that owns it, with the standards for your stack attached.

---

## 1. OVERVIEW

### At a Glance

| Aspect | What it gives you |
|---|---|
| **Use it for** | Code work: writing, gating, debugging and review |
| **Invoke with** | `sk-code`, with an optional mode hint such as `quality:` |
| **Works on** | Any repository, with the surface chosen from the files you change |
| **Produces** | One workflow mode plus the surface evidence beside it |

### What It Does

`sk-code` is the single entry point for code work. It reads the request and picks the workflow mode that owns the job. It then attaches the surface evidence for the files you touched. The hub only routes. The packet it selects does the work and reports back.

The canonical entry point is `node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "<task>"`, which returns the targets to load. The skill advisor reaches the same hub from a plain code request, so you can also ask.

### The Two Axes

The hub holds two kinds of packet. A workflow mode acts on your change. A surface packet is read-only evidence that the hub bundles beside a mode. The table lists all five.

| Packet | What it owns |
|---|---|
| `sk-code-quality` | The author-side gate after a change: P0/P1/P2 checks and comment hygiene |
| `sk-code-review` | Findings-first review with a fixed security and correctness floor and a default lens |
| `sk-code-skilled` | Six language standard sets, shared patterns, hooks and the authoring checklists |
| `sk-code-ci` | GitHub Actions evidence: trigger rules, job shape, the protected set and the scaffold templates |
| `sk-code-frontend` | Web practice, visual decisions, motion and the five-pass Figma check |

### Where It Stops

`sk-doc` owns documentation quality. `sk-git` owns the git workflow. `system-spec-kit` owns spec folders and their validation. A measured style reference comes from `sk-design-md-generator` before the frontend surface implements it. Browser evidence comes from `mcp-chrome-devtools`. This hub reviews in one pass. `deep-review` owns the iterative loop.

---

## 2. QUICK START

**Step 1: Ask for the work.** Describe the change or the review in plain words. The advisor routes every code request to the one hub identity.

**Step 2: Resolve the route.**

```bash
node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "review my typescript module for jank"
```

It prints one JSON line with `"action":"route"`. The `targets` array names `sk-code-review` first and `sk-code-skilled` beside it as evidence.

**Step 3: Open what it names.** Load the first target's packet. Its README carries the commands for that mode. An answer of `clarify` or `defer` asks you a question. `reject` refuses the request instead of guessing.

---

## 3. HOW IT WORKS

Routing runs in two stages. Stage one scores the request against the mode vocabulary in `hub-router.json` and picks a workflow mode. Stage two maps the intent to the exact leaf files in `ROUTER.md`. The hub then bundles the surfaces that match, with the workflow mode leading.

```text
┌──────────────────────────────┐
│ code request                 │
└─────────────┬────────────────┘
              │
              ▼
┌──────────────────────────────┐
│ surface detection            │
└─────────────┬────────────────┘
              │
              ▼
┌──────────────────────────────┐
│ stage one: hub-router.json   │
│ picks the workflow mode      │
└─────────────┬────────────────┘
              │
              ▼
┌──────────────────────────────┐    ┌──────────────────────────────┐
│ stage two: ROUTER.md maps    │ ─▶ │ surface packet supplies      │
│ the intent to leaves         │    │ read-only evidence           │
└─────────────┬────────────────┘    └──────────────────────────────┘
              │
              ▼
┌──────────────────────────────┐
│ workflow mode acts on the    │
│ change                       │
└──────────────────────────────┘
```

Each answer is one of four actions. `route` loads its targets. `clarify` and `defer` ask a question. `reject` refuses the request. A request to write or debug code that names no mode becomes a surface bundle. An unclear code intent asks for disambiguation.

### Surface Detection

Detection runs before the mode choice. It tries every declared specific surface first, then the hub's SKILLED fallback. UNKNOWN is the last resort. The marker lists on each surface decide a match. A `--surface-hint` carries a detected surface into the compiled route. The rules are in [the stack detection reference](./shared/references/stack-detection.md).

### Shared Workflow Doctrine

The shared doctrine covers each phase of a change. It is not a mode. The files live once in `shared/references/`. Each surface symlinks them in so no packet keeps a copy.

- `workflow-implement.md` for the authoring pass.
- `workflow-debug.md` for the repair pass.
- `workflow-verify.md` for the proof pass.

A request to change or repair code resolves the surface first, then loads that surface's copy of the doctrine.

### Rules A Repository Can Change

The quality and review modes ship defaults. A repository can drop or replace any rule outside a small hard floor. The floor holds the checks whose breach causes an incident in any codebase, plus the review severity scale.

An override lives in a `## Rule overrides` section of a checklist. A row names one rule id and the action to apply. `none` drops the rule. `replace: <text>` puts new text in its place. Both modes read the section through one linter, so a rule dropped for quality does not return as a review finding. The modes differ on a bad row. Quality mode reports a refused section or an unknown rule id as `CONFIG_INVALID` with exit 3. A conflict at one level leaves the rule unverified. Review mode lists those rows under `Refused`, `Ignored` and `Conflicts` and adds no exit code. The contract is [the rule overrides reference](./shared/references/universal/rule-overrides.md).

### One Advisor Identity

The hub root holds the only `graph-metadata.json`. The mode packets and `shared/` carry none, so the advisor discovers one code skill and the hub routes from there. `mode-registry.json` holds each packet's contract. `hub-router.json` holds the vocabulary that scores a prompt. `leaf-manifest.json` holds the typed pairs the router guards check.

---

## 4. ADAPTING TO YOUR STACK

sk-code ships three surfaces. Each one is a folder beside the hub. A surface you add for your own stack ranks ahead of Skilled, which is the fallback.

- **CI** ([the CI packet](./sk-code-ci/README.md)): GitHub Actions rules with the protected set and the scaffold templates. The hub bundles it from request vocabulary. Its repository values come from the CI profile at `.skilled/skills/sk-code/sk-code-ci/repository/ci.json`.
- **Frontend** ([the frontend packet](./sk-code-frontend/README.md)): web practice, visual decisions, motion and the five-pass Figma check. Its own `FRONTEND` markers select it.
- **Skilled** ([the SKILLED packet](./sk-code-skilled/README.md)): the native standards for this repository's code. It is the fallback and ranks last.

### Before You Start

1. In a fresh clone, run `bash .skilled/skills/sk-git/scripts/worktree-naming.sh provision .` first. It installs the dependencies and builds the artifacts the checks load. Without that build, the setup check reports `SHARED_NOT_BUILT` and names this command.
2. In a clone, run `git config --local skilled.trustRepoHooks true` before you install the hooks. The hook scripts run this repository's gates only in a trusted clone.
3. Install the hooks with `bash .skilled/scripts/install-git-hooks.sh`. A commit that stages the hub's routing files re-mints the compiled routing manifest and mirrors it to the authored copy. Without the hooks, run `node .skilled/bin/compiled-route-manifest.cjs refresh --hub sk-code --skill-root .skilled/skills/sk-code` after each routing change and mirror the result by hand. `compiled-route-sync.cjs --check` names any copy that is out of step.

### Remove A Surface

Repeat these steps for each surface you drop. `<surface>` is the folder name of the packet.

1. Delete the folder `.skilled/skills/sk-code/<surface>/`.
2. Remove the packet from `mode-registry.json`: its `modes` entry and its name under `extensions.surface-axis.surfaces`.
3. Remove its `routerPolicy.tieBreak` entry and its `vocabularyMirrors` entry from `hub-router.json`. Remove its `routerSignals` entry and the `vocabularyClasses` that entry names.
4. Regenerate the leaf manifest with `node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs --write .skilled/skills/sk-code`.
5. Edit section 8 of `ROUTER.md` by hand, because it is the authored source for the intent vocabulary. Delete every `RESOURCE_MAP` path under `<surface>/`, then delete each key left with no paths from both `RESOURCE_MAP` and `INTENT_SIGNALS`.
6. Update the docs that name the surface: the surface table in `SKILL.md`, the surface lines in the root `README.md`, the packet rows in `feature-catalog/feature-catalog.md` and the scenarios in `manual-testing-playbook/`.
7. Run `node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-doc-claims.cjs` and fix every dead path and stale surface count it lists. Then run `node .skilled/skills/sk-doc/sk-create-skill/scripts/regenerate-skill-derived.cjs --root .skilled/skills/sk-code --write`, which prunes every derived path that no longer resolves. Update `causal_summary` by hand if it names the packet.

### Add Your Own Surface

1. Run `/create:skill-parent <skill-name> update --surfaces <name>` in your AI runtime. It scaffolds the packet and registers it. The new surface lands ahead of `sk-code-skilled` in `tieBreak`. If you edit `tieBreak` by hand, keep your surface ahead of `sk-code-skilled`, because the registry compiler rejects a hub whose single fallback is not last, with `SURFACE_FALLBACK_INVALID`.
2. Symlink the shared doctrine into the new packet's `references/` folder the way `sk-code-skilled/references/` does, with link targets of `../../shared/references/<file>`.
3. Add the packet's paths to the `ROUTER.md` maps and its `surfaceDetection` block to its `mode-registry.json` entry. A packet copied from an existing surface has the same leaf set, so `generate-leaf-manifest.cjs --write` stops with `MODE_LEAF_SET_COLLISION`. Give each mode its own `leafScopes` in a `leaf-scopes.json` at the hub root or change the copy until the files differ.
4. Add a routing scenario for the new surface to `manual-testing-playbook/manual-testing-playbook.md`, then run the checks under Verify The Result.

Each phrase a mode matches adds the mode's `weight` to its score. The router selects workflow modes and surfaces in two separate windows. A workflow mode stays when it scores within `routerPolicy.ambiguityDelta` of the top mode. A surface stays when it scores within that delta of the top surface. A surface that matches several phrases does not push a mode out. It can still push out a second surface that matched fewer phrases. To keep both, lower a surface's `weight` or raise `routerPolicy.ambiguityDelta` in `hub-router.json`.

### Add a Private Surface Outside the Hub

A surface you keep out of the repository lives in its own skill beside the hub.

1. Create the skill folder as `.skilled/skills/local-<name>/`. Git ignores every `local-*` skill, so the folder and its standards stay in your checkout. It can be a symlink to a folder in another repository.
2. In the skill's own `graph-metadata.json`, set `"family": "sk-code"` and add a top-level `surface_detection` block marked `"role": "specific"`. The block needs a `label` and at least one marker list. [The stack detection reference](./shared/references/stack-detection.md) holds the example and the rules.
3. Check the block by hand against those rules. `ci-skill-root-metadata.cjs` skips folders whose name starts with `local-`, so no check validates it for you.
4. If the folder is a symlink whose target sits outside `.skilled/skills/`, add a folder that contains that target to `SPECKIT_PRIVATE_SKILL_ROOTS` for every advisor process. Without it, the advisor skips the skill.

Stack detection tries the hub's own specific surfaces first. It then tries the surfaces that skills outside the hub declare, sorted by skill id. SKILLED comes last as the fallback. Nothing in the hub's own files names the private skill.

### Verify The Result

Each of these must exit 0. Then route a prompt that names your stack. Check that your surface comes first among the surfaces. A workflow mode leads the list when one scores.

```bash
node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-code
node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs
node .skilled/bin/compiled-route-guard.cjs
node .skilled/bin/compiled-route-sync.cjs --check
bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh
node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "<a prompt about your stack>"
```

`parent-skill-check.cjs` prints `all hard invariants passed`. `ci-skill-root-metadata.cjs` prints a summary line carrying `failed=0`, such as `checked=14 passed=14 failed=0 fixed=0`. `run-all-drift-guards.sh` ends with `all 4 guards PASSED`, followed by a warning count when a guard warns. The route probe prints a JSON `targets` array with your surface ahead of the other surfaces.

`/doctor:sk-code setup` runs these legs in one read-only pass. It adds a derived-metadata freshness check and a provisioning precheck, then prints one repair command for each failing leg. Outside an AI runtime, run `node .skilled/commands/doctor/scripts/sk-code-setup-check.cjs`. For GitHub Actions work, `/doctor:ci report` lists each workflow's switch state and drift flags.

---

## 5. VERIFICATION

| Check | Result |
|---|---|
| README structure | `python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/skills/sk-code/README.md --type readme` reports zero issues |
| Routing scenarios | The [manual testing playbook](./manual-testing-playbook/manual-testing-playbook.md) holds the manual routing and disambiguation scenarios behind the hub |
| Setup battery | `/doctor:sk-code setup` runs the adaptation checks read-only and names the repair command for each failing leg |
| Drift guards | `bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh` ends with `all 4 guards PASSED`, plus a warning count when a guard warns |

---

## 6. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime hub instructions and the routing authority split |
| [`ROUTER.md`](./ROUTER.md) | Stage-two leaf router with the intent signals and the resource maps |
| [`mode-registry.json`](./mode-registry.json) | Each packet's contract, aliases and surface detection |
| [`hub-router.json`](./hub-router.json) | The routing vocabulary, the tie-break order and the surface bundle policy |
| [`leaf-manifest.json`](./leaf-manifest.json) | The typed pairs the router guards validate |
| [`shared/README.md`](./shared/README.md) | The shared folder index and the workflow doctrine |
| [`feature-catalog/feature-catalog.md`](./feature-catalog/feature-catalog.md) | Current-state inventory of every mode and routing capability |
| [`manual-testing-playbook/manual-testing-playbook.md`](./manual-testing-playbook/manual-testing-playbook.md) | Manual routing and disambiguation scenarios |
| [`sk-code-quality/README.md`](./sk-code-quality/README.md) | The quality mode |
| [`sk-code-review/README.md`](./sk-code-review/README.md) | The review mode |
| [`sk-code-skilled/README.md`](./sk-code-skilled/README.md) | The SKILLED surface |
| [`sk-code-ci/README.md`](./sk-code-ci/README.md) | The CI surface |
| [`sk-code-frontend/README.md`](./sk-code-frontend/README.md) | The frontend surface |
| [`changelog/`](./changelog/) | Hub release entries |

<!-- readme-check
allow-count 4 guards | run-all-drift-guards.sh runs four guards and prints this line
-->
