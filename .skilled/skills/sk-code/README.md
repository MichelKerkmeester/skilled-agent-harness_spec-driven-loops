---
title: sk-code
description: The single advisor-routable entry point for code work: one hub that routes each request to the focused quality or review mode it needs, bundles the matching surface evidence and keeps one graph identity for the whole code family.
trigger_phrases:
  - "code skill"
  - "code mode router"
  - "sk-code hub"
version: 2.2.16.0
---

# sk-code

> Code work is more than one activity. sk-code is the single entry point that routes each request to the quality or review mode it needs, with the surface evidence to back it up, under one advisor identity.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Code-family work: implementation, quality gating, debugging, verification and findings-first review |
| **Invoke with** | `Skill(sk-code)` plus an optional mode hint such as `sk-code-quality:` or `sk-code-review:` |
| **Works on** | The shared surface-detection router for the three surfaces the hub `SKILL.md` lists: the native SKILLED surface and the optional example WEBFLOW and OBSIDIAN surfaces, plus the Motion.dev animation overlay |
| **Produces** | A routed workflow mode or bundled surface evidence packet with the matching code-work contract and tool surface |

---

## 2. OVERVIEW

### Why This Skill Exists

Code work is not one activity. Writing code needs author-side quality gates and comment hygiene. Reviewing it needs a findings-first baseline with security and correctness checks. Frontend work needs browser and performance evidence. System work needs hook and alignment verification. Each kind of code work carries its own contract, yet they all share the same surface identity rules.

Without one routing point, every contract would duplicate surface detection and a request that touches several kinds of code work would have no ordered way to resolve. sk-code exists so one advisor identity covers the whole code family: the hub centralizes surface detection once and routes each request to the focused packet that owns the work.

### What It Does

`Skill(sk-code)` loads the hub. The hub routes the request through `mode-registry.json` to one of two workflow modes. Root `ROUTER.md` then selects the packet leaves and declared shared controls bundled alongside it. Each mode and surface holds its own code-work contract while the hub itself stays routing-only. The packets carry no `graph-metadata.json`, so the advisor discovers exactly one code skill.

The boundary is deliberate: sk-code routes code work. Documentation quality, git workflow, spec discipline and browser evidence belong to sibling skills that sk-code hands off to.

### The Code Work Contract Grid

**Workflow modes (act):**

| Mode | Owns |
|---|---|
| `sk-code-quality` | Author-side quality gates, comment hygiene and surface checklists |
| `sk-code-review` | Findings-first review, security and correctness baseline, review output cache |

**Surface evidence packets (read-only and advisor-invisible, bundled alongside a workflow mode):**

| Surface | Carries |
|---|---|
| `sk-code-webflow` | Optional example. Frontend evidence: CSS/HTML/JS standards, implementation and performance patterns, CDN deployment, browser debug and verify, plus the Motion.dev animation overlay |
| `sk-code-skilled` | Native surface. System-code evidence: TypeScript, Python, shell and config standards, hooks, alignment verification, authoring checklists |
| `sk-code-obsidian` | Optional example. Obsidian-plugin design-system and source-convention evidence for the Note Database plugin |

---

## 3. HOW IT WORKS

### How A Request Resolves

A code request resolves through the hub to a primary workflow mode and one or more bundled surface packets. A request that spans intents stays at the hub for ordered routing or disambiguation. Two examples show the shape of a resolution:

| Request | Resolves to |
|---|---|
| "review my webflow animation for jank" | `[sk-code-review, sk-code-webflow]` |
| "run my implementation through the author-side quality gates" | `[sk-code-quality]` |

### The Implement To Verify Doctrine

The implement → debug → verify phases are not standalone modes. Their surface-agnostic doctrine lives once in `shared/references/`, symlinked into each surface so the active surface carries the full workflow without duplicating it:

- `workflow-implement.md` for the authoring pass
- `workflow-debug.md` for the repair pass
- `workflow-verify.md` for the proof pass

### One Advisor Identity

The mode packets and `shared/` carry no `graph-metadata.json` of their own. The hub root keeps the single graph identity for the whole family. `mode-registry.json` is the routing source of truth while `hub-router.json` preserves the vocabulary that helps code prompts resolve to the right mode.

---

## 4. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for sk-code when the task is code work and the next step is implementation, author-side quality, debugging, verification or review. The shared router keeps surface identity consistent across every mode and surface for the native SKILLED surface and the optional example WEBFLOW and OBSIDIAN surfaces, plus the Motion.dev animation overlay. Use a mode hint when you already know the contract you need and let the hub classify when the request spans intents.

### Related Skills

| Skill | Relationship |
|---|---|
| `sk-design-md-generator` | Extracts a measured Style Reference (design tokens from a live source) that sk-code may implement |
| `sk-doc` | Owns markdown and documentation quality |
| `sk-git` | Owns branches, commits, PRs and the finish workflow |
| `system-spec-kit` | Owns spec folders, memory, continuity and packet validation |
| `mcp-chrome-devtools` | Provides browser evidence for frontend runtime behavior |

---

## 5. ADAPTING TO YOUR STACK

sk-code ships one native surface and two optional examples. The Skilled surface, at `.skilled/skills/sk-code/sk-code-skilled/`, holds the standards for this framework's own code, so keep it. Webflow, at `.skilled/skills/sk-code/sk-code-webflow/`, and Obsidian, at `.skilled/skills/sk-code/sk-code-obsidian/`, are optional examples you can remove or keep as models.

A surface you add for your own stack ranks ahead of the Skilled surface. Run every command below from the repository root.

### Before You Start

1. In a fresh clone, run `bash .skilled/skills/sk-git/scripts/worktree-naming.sh provision .` first. It installs the dependencies and builds the spec-kit outputs the checks below load. Without it, `parent-skill-check.cjs` and `ci-skill-root-metadata.cjs` fail on a missing `@spec-kit/shared` build.
2. In a clone, run `git config --local skilled.trustRepoHooks true` before you install the hooks. The hooks run this repository's scripts only in a trusted clone, so without it the commit-time re-mint never fires.
3. Install the git hooks with `bash .skilled/scripts/install-git-hooks.sh`. A commit that stages the hub's routing files then re-mints its activation manifest and copies the manifest to its authored path. Without the hooks, do both by hand after each routing change: run `node .skilled/bin/compiled-route-manifest.cjs refresh --hub sk-code --skill-root .skilled/skills/sk-code`, then copy `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json` over `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/sk-code/manifest.json`.
4. If you prune `specs/`, keep `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/`, the authored source of compiled routing, and keep the `.opencode/skills` link. Without either one the guard and sync checks fail.

### Remove An Example Surface

Repeat these steps for each surface you drop. `<mode>` is `sk-code-webflow` or `sk-code-obsidian`.

1. Delete the folder `.skilled/skills/sk-code/<mode>/`.
2. In `.skilled/skills/sk-code/mode-registry.json`, delete the mode's `modes` entry and its name in `extensions.surface-axis.surfaces`. In `.skilled/skills/sk-code/hub-router.json`, delete it from `routerPolicy.tieBreak`, delete its `routerSignals` entry and delete the two `vocabularyClasses` that entry names.
3. Regenerate the leaf manifest with `node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs --write .skilled/skills/sk-code`.
4. Edit section 11 of `.skilled/skills/sk-code/ROUTER.md` by hand, because no command writes it. Delete every `RESOURCE_MAP` path under `<mode>/`, then delete each key left with no paths from both `RESOURCE_MAP` and `INTENT_SIGNALS`. Trim the prose map rows and sections above section 11 that point at the removed packet.
5. Update the surface table and the surface list sentence in `.skilled/skills/sk-code/SKILL.md`, the surface markers in `.skilled/skills/sk-code/shared/references/stack-detection.md` and the surface lines in the root `README.md`.
6. Delete or adjust the files written for the example. These are its scenarios under `.skilled/skills/sk-code/manual-testing-playbook/`, with their rows in `manual-testing-playbook.md`, the Obsidian and Webflow checklist pointers in `.skilled/skills/sk-code/sk-code-quality/`, the entries in `.skilled/skills/sk-code/feature-catalog/feature-catalog.md` and `.skilled/skills/sk-code/feature-catalog/two-axis-registry-driven-routing/two-axis-registry-driven-routing.md`, which present the examples as live surfaces, the cases in `.skilled/bin/tests/compiled-route-surface-hint.test.cjs` and the canary cases that name the mode in `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json`. After a canary edit, copy that fixture over its authored twin at `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json`.
7. Run `node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-doc-claims.cjs` and fix every dead path and stale surface count it lists, including those in this README. Then run `node .skilled/skills/sk-doc/sk-create-skill/scripts/regenerate-skill-derived.cjs --root .skilled/skills/sk-code --write`, which prunes the dead `key_files`, `source_docs` and entities from the hub's `graph-metadata.json`. The only hand edit left in that file is its `causal_summary`, which still names the examples.
8. Refresh the README manifest with `python3 .skilled/skills/sk-doc/scripts/tests/test_readme_manifest.py --write`, and the Hermes skill copies with `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs`, which drops the removed packet's copy.
9. Commit with the hooks installed, or refresh and copy the manifest by hand as above.

### Add Your Own Surface

1. Run `/create:skill-parent update --surfaces <name>` in your AI runtime. Its steps live in `.skilled/commands/create/assets/create-skill-parent-auto.yaml`. It scaffolds the packet, registers it and places it ahead of `sk-code-skilled` in `tieBreak`, so your surface wins a keyword tie. If you edit `tieBreak` by hand instead, keep your surface ahead of `sk-code-skilled`, because the doctor's check 5l fails a surface placed after it.
2. Link the three shared workflow docs into the new packet the way `sk-code-skilled/references/` does: in `.skilled/skills/sk-code/<name>/references/`, symlink `workflow-implement.md`, `workflow-debug.md` and `workflow-verify.md` to `../../shared/references/`.
3. Add the packet's paths to the `ROUTER.md` maps and section 11, and its markers to `stack-detection.md`. Update the surface-count lines `verify-doc-claims.cjs` checks: the count in `.skilled/skills/sk-code/shared/references/phase-detection.md`, and the counts in the hub's `README.md` and `SKILL.md`. A packet copied from an example has the same leaf set as that example, so `generate-leaf-manifest.cjs --write` stops with `MODE_LEAF_SET_COLLISION`. Give each of the two modes its own `leafScopes` in a new `leaf-scopes.json` at the hub root, in the array format `.skilled/skills/sk-doc/leaf-scopes.json` uses, or change the copy until its files differ.
4. Add a canary case that routes to the new surface in the canary fixture above, and copy the fixture over its authored twin. The completion report of the update command names both follow-ups.
5. Refresh the Hermes skill copies the same way, then commit with the hooks installed, or refresh and copy the manifest by hand.

### Verify The Result

Each of these must exit 0. Then route a prompt that names your stack, and check that your surface comes first.

```bash
node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-code
node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs
node .skilled/bin/compiled-route-guard.cjs
node .skilled/bin/compiled-route-sync.cjs --check
bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh
node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "<a prompt about your stack>"
```

`/doctor:sk-code setup` runs these legs in one read-only pass, adds the derived-metadata freshness check CI runs and a provisioning precheck, fails the route probe when it returns the legacy stub, and prints one repair command for each failing leg. Outside an AI runtime, run `node .skilled/commands/doctor/scripts/sk-code-setup-check.cjs`.

---

## 6. FAQ

**Q: Why does the advisor see only one code skill when the hub contains five packets?**

A: The mode packets and `shared/` carry no `graph-metadata.json` of their own. The hub root holds the single graph identity for the whole family, so prompts resolve to one entry point and the hub routes from there.

**Q: What happens when a request spans intents, like review plus implementation?**

A: The request stays at the hub. The hub orders the routing and asks for disambiguation instead of guessing a single mode.

---

## 7. VERIFICATION

| Check | Result |
|---|---|
| README structure | `python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/skills/sk-code/README.md --type readme` reports zero issues |
| Routing scenarios | The manual testing playbook runs every routing and disambiguation scenario behind the hub |
| Setup battery | `/doctor:sk-code setup` runs the adaptation battery read-only and names the repair command for each failing leg |

---

## 8. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime hub instructions and routing rules |
| [`ROUTER.md`](./ROUTER.md) | Active stage-two surface router, leaf map, and explicit shared-control declaration |
| [`mode-registry.json`](./mode-registry.json) | The mode-to-packet routing map |
| [`hub-router.json`](./hub-router.json) | Hub-local routing vocabulary and mode signals |
| [`shared/README.md`](./shared/README.md) | Shared surface detection and cross-mode helpers, plus the implement/debug/verify workflow doctrine |
| [`feature-catalog/feature-catalog.md`](./feature-catalog/feature-catalog.md) | Current-state inventory of every mode, surface and routing capability |
| [`manual-testing-playbook/manual-testing-playbook.md`](./manual-testing-playbook/manual-testing-playbook.md) | Manual scenarios that validate routing and disambiguation |
| [`sk-code-quality/SKILL.md`](./sk-code-quality/SKILL.md) | Quality mode packet |
| [`sk-code-review/SKILL.md`](./sk-code-review/SKILL.md) | Review mode packet |
| [`sk-code-webflow/SKILL.md`](./sk-code-webflow/SKILL.md) | Webflow surface packet |
| [`sk-code-skilled/SKILL.md`](./sk-code-skilled/SKILL.md) | Skilled surface packet |
| [`sk-code-obsidian/SKILL.md`](./sk-code-obsidian/SKILL.md) | Obsidian surface packet |
