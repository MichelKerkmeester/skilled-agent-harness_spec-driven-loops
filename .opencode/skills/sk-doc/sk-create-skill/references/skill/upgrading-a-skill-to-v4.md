---
title: Upgrading a Customized Skill to v4
description: Adopter guide for reconciling a customized standalone skill with the v4 parent-hub format, or keeping that skill single.
trigger_phrases:
  - "upgrade skill to v4"
  - "convert standalone skill to parent hub"
  - "adopter customized sk-code"
  - "keep sk-git as a single skill"
  - "remove repo parent skill"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Upgrading a Customized Skill to v4

Adopters who customized `sk-code` (their stack) or `sk-git` (their conventions) use this guide to decide whether that skill becomes a parent hub or stays a single skill. Most other skills in this framework are internals and need no adopter work.

---

## 1. OVERVIEW

v4 reshaped `sk-code` into a parent hub: one advisor identity that dispatches to nested workflow-mode packets and read-only surface packets. `sk-git` stayed a single skill. This file is the adopter-facing path for reconciling a customized copy with that split.

**Core Principle**: Convert a skill into a parent hub only when it has two or more distinct jobs. Keep it single when it has one job. You may also drop the repo's parent `sk-code` and keep your own single skill.

**When to Use**:
- You customized `sk-code` or `sk-git` and a framework update now ships a different shape
- You are deciding whether a flat skill should become a parent hub
- You want to keep a customized skill single and avoid a false migration

**When not to Use**:
- You are creating a brand-new skill from scratch. Use `/create:skill` or `/create:skill-parent` directly. See [creation-workflow.md](creation-workflow.md) and [parent-skills-nested-packets.md](../parent-skill/parent-skills-nested-packets.md)
- You are only scoring or editing prose in an existing skill. Use `create-quality-control`
- You are tempted to convert framework-internal skills (`sk-doc`, `system-spec-kit`, `system-deep-loop`, and peers). Leave those alone

**Key Sources**:
- `/create:skill-parent` - parent-hub scaffold (`create` or `update`). Argument order is `<skill-name> [create|update] [--modes <m1,m2,...>] [--surfaces <s1,s2,...>] [--path <dir>]`
- `/create:skill` - standalone scaffold and repair (`full-create`, `full-update`, `reference-only`, `asset-only`)
- [parent-skills-nested-packets.md](../parent-skill/parent-skills-nested-packets.md) - hub layout, `modes[]`, One-Identity Invariant
- [parent-hub-router-schema.md](../parent-skill/parent-hub-router-schema.md) - `hub-router.json` contract
- [skill-root-metadata-contract.md](../shared/skill-root-metadata-contract.md) - class H (hub) vs class S (standalone) file matrix
- `scripts/validate_skill_package.py` - completion gate
- `.opencode/commands/doctor/scripts/parent-skill-check.cjs` - parent-hub structural and routing audit

The live layout to copy from is `.opencode/skills/sk-code/` (parent hub) and `.opencode/skills/sk-git/` (single skill).

---

## 2. DECISION RULE

Count distinct jobs, not files.

A **job** is a process the assistant follows (a workflow mode) or a read-only evidence base it loads beside that process (a surface packet). Two quality-gate checklists in the same `SKILL.md` are still one job. Implement versus review, or Webflow evidence versus OpenCode evidence, are distinct jobs.

| What you have | What you do |
| --- | --- |
| One job | Keep a single skill (class S). Do not add `mode-registry.json` or `hub-router.json` |
| Two or more distinct jobs | Convert to a parent hub (class H) with `/create:skill-parent` |
| A customized single `sk-code` you want to keep | Remove or ignore the repo's parent `sk-code` and keep your own single skill. See [Section 3](#3-adopter-cases) |

Choose **workflow** packets for process (quality, review, implement). Choose **surface** packets for read-only stack evidence. The test is in [parent-skills-nested-packets.md](../parent-skill/parent-skills-nested-packets.md) section 6.

Do not invent a third class. A root is a hub when both `mode-registry.json` and `hub-router.json` exist, and standalone when neither exists. One file without the other is a partial declaration. `validate_skill_package.py` rejects that as unclassified.

---

## 3. ADOPTER CASES

### `sk-code`: convert to parent, or keep your own single skill

The repo now ships `sk-code` as a parent hub. Workflow packets `sk-code-quality` and `sk-code-review` act. Surface packets `sk-code-webflow` and `sk-code-opencode` are read-only evidence. `graph-metadata.json` lives only at `.opencode/skills/sk-code/`. Nested packets have none.

You have two legal outcomes:

1. **Convert-to-parent.** Follow [Section 4](#4-convert-a-single-skill-into-a-parent-hub) so your customized stack becomes nested packets under one hub identity.
2. **Remove-repo-and-keep-own-single.** Keep your customized standalone `.opencode/skills/sk-code/` (class S: `graph-metadata.json` plus `leaf-manifest.config.json`, no registry or router). When you take a framework update, do not replace that folder with the repo's parent-hub tree.

There is no convert-in-place flag. Keeping your own single skill is a merge-time choice, not a `/create:*` operation.

### `sk-git`: the repo ships it single

The repo ships `sk-git` as a single skill. It has `graph-metadata.json` and `leaf-manifest.config.json`. It has no `mode-registry.json` and no `hub-router.json`.

Keep it single if git work stays one job (worktree, commit, finish under one contract). Promote it to a parent hub only if you have split that work into two or more distinct jobs and want one advisor identity in front of them. That promotion is your preference, not a framework requirement.

### Most other skills need no adopter action

`sk-doc`, `sk-design`, `sk-prompt`, `sk-communication`, `system-spec-kit`, `system-skill-advisor`, `system-deep-loop`, `mcp-tooling`, and `cli-external-orchestration` are framework internals. They are repo-agnostic. Do not convert them, flatten them, or "upgrade" them to match `sk-code`. Over-migrating those trees is how adopters create rogue advisor identities and routing drift.

---

## 4. CONVERT A SINGLE SKILL INTO A PARENT HUB

Use existing tooling only. `/create:skill-parent` is the scaffold. `create` will not write on top of an occupied folder (`requires_existing_skill: false`). There is no in-place `--convert` flag.

The command requires `@markdown` for template-first generation. Restart with that prefix if the self-check blocks.

### Step 1. Inventory jobs and name the packets

List every distinct job. Mark each as `workflow` or `surface`. Pick hyphen-case mode names.

**Failure this prevents:** scaffolding one `primary` packet and stuffing every job back into a single `SKILL.md`, which recreates the flat skill under a hub costume.

### Step 2. Move the existing skill aside

Copy the customized folder out of `.opencode/skills/<name>` to a backup path you control. Leave the destination name free.

**Failure this prevents:** `/create:skill-parent <name> create` stopping because the folder already exists, or the scaffold overwriting your customized `SKILL.md` and references.

### Step 3. Scaffold the hub with `/create:skill-parent`

```text
@markdown /create:skill-parent <skill-name> create --modes <mode1,mode2,...> [--surfaces <s1,s2,...>] [--path .opencode/skills] [:auto|:confirm]
```

`--modes` is required. Do not omit it. `--surfaces` is optional. `--path` defaults to `.opencode/skills/`.

Example for a customized `sk-code` with quality, review, and two evidence bases:

```text
@markdown /create:skill-parent sk-code create --modes quality,review --surfaces webflow,opencode
```

That command creates:

- A thin hub `SKILL.md` (routing only)
- `mode-registry.json`, `hub-router.json`, `description.json`, and exactly one hub `graph-metadata.json`
- One workflow packet per distinct mode, folder `[hub-prefix]-<mode>` (so `--modes quality,review` under `sk-code` yields `sk-code-quality` and `sk-code-review`)
- Optional surface packets from `--surfaces` as **bare-noun** folders (`webflow`, `opencode`), each `packetKind: surface`
- Hub `changelog/`, `manual-testing-playbook/`, and a non-discoverable `shared/` with `shared/README.md`
- No `graph-metadata.json` inside any packet or inside `shared/`

**Surface folder names.** The command scaffolds `--surfaces` as bare-noun folders. The published nested-packet convention and the live `sk-code` hub use hub-prefixed surface folders (`sk-code-webflow`, `sk-code-opencode`). After scaffold, rename those folders so `folder == packetSkillName` and update `modes[].packet` plus `modes[].packetSkillName`. No `--surface-prefix` flag exists.

**One-Identity Invariant.** The hub owns exactly one `graph-metadata.json`. Never add one inside a mode packet or inside `shared/`. A nested copy becomes a second advisor identity.

**Do not use `init_skill.py --kind parent` as a substitute for this step.** That helper exists and takes `--path` plus optional `--compiled-routing legacy|ready`. It scaffolds one `primary` packet and does not accept `--modes` or `--surfaces`. A multi-job conversion needs the slash command above.

**Failure this prevents:** a hand-rolled hub missing `hub-router.json`, a nested `graph-metadata.json`, or a `surfacePackets[]` array the checker does not read.

### Step 4. Move the flat skill body into the matching packet

Open the backup `SKILL.md`. Keep the hub `SKILL.md` thin (activation, routing, rules, success criteria). Move the executable workflow body into the matching workflow-mode packet `SKILL.md`. If the old skill was only stack evidence, move that body into a surface packet instead.

Move `references/`, `assets/`, and `scripts/` with the body that uses them. Put a helper in `shared/` only when two or more packets genuinely share it.

Give each packet its own `SKILL.md`, `README.md`, and `changelog/`. Surface packets also get `references/` and `assets/` when they carry evidence.

Do not copy `leaf-manifest.config.json` onto the hub. That file is required on a standalone root and **forbidden** on a hub. Class H generates `leaf-manifest.json` from the registry. See [skill-root-metadata-contract.md](../shared/skill-root-metadata-contract.md).

**Failure this prevents:** a hub `SKILL.md` that still runs the old workflow (the router never reaches the packet) and a `FORBIDDEN_FILE` failure from a leftover standalone manifest config.

### Step 5. Register every packet in `mode-registry.json` and keep the router in parity

Every packet is one `modes[]` entry. Required fields are `workflowMode`, `packetKind`, `backendKind`, `toolSurface`, `packet`, `packetSkillName`, `grandfatheredFolderMismatch`, `aliases`, and `advisorRouting`. New packets keep `folder == packetSkillName` and `grandfatheredFolderMismatch: false`. Keep aliases unique and lowercase.

Then keep `hub-router.json` aligned:

- `routerSignals` keys must equal the registry `workflowMode` set both ways
- `routerPolicy.tieBreak` lists every registry mode once, workflow modes before surfaces
- Outcomes include `single`, `orderedBundle`, and `defer`. Add `surfaceBundle` only when the hub has surface packets (`surface-axis`)
- Every `resources[]` path is hub-root-relative and packet-qualified (`sk-code-quality/SKILL.md`, not `SKILL.md`)

Schema detail lives in [parent-hub-router-schema.md](../parent-skill/parent-hub-router-schema.md). Do not add a second registry array.

After the registry and packet trees are final, refresh the hub-only leaf manifest:

```bash
node .opencode/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs --write .opencode/skills/<hub-name>
```

That is the scoped generator `/create:skill-parent` already runs. Do not run fleet `ci-skill-root-metadata.cjs --fix` unless you intend to regenerate generated files across every scanned root.

**Failure this prevents:** check 5 routing drift (`routerSignals` keys that do not match `modes[].workflowMode`), orphan packets on disk, and a stale `leaf-manifest.json`.

### Step 6. Confirm the One-Identity Invariant on disk

Count `graph-metadata.json` files under the hub. There must be exactly one, at the hub root. Packets and `shared/` must have zero.

**Failure this prevents:** parent-skill-check `1a` / `2a` failures and a second skill-graph identity for the same folder name.

### Step 7. Validate (see [Section 6](#6-validate))

Run the completion gate until it exits clean. Then run the routing-drift check if you edited aliases or vocabulary classes.

**Failure this prevents:** shipping a hub that scaffolds but does not pass the same gate `/create:skill-parent` and `/doctor parent-skill` require.

If you need another mode later, use `/create:skill-parent <skill-name> update --modes ...`. Do not re-run `create` on the live folder.

---

## 5. KEEP A SINGLE SKILL

Stay on class S when the skill still has one job.

A standalone root keeps `SKILL.md`, `graph-metadata.json`, and `leaf-manifest.config.json`. It must not gain `mode-registry.json`, `hub-router.json`, `description.json`, or `command-metadata.json`. Repair that package with `/create:skill <skill-name> full-update` (or `reference-only` / `asset-only` for a scoped add). `/create:skill <skill-name> full-create` is only for a folder that does not exist yet.

**Keeping your own `sk-code` while the repo ships a parent hub.** Leave your customized `.opencode/skills/sk-code/` in place. Do not copy the repo hub's `mode-registry.json` or `hub-router.json` into it. Adding only one of those two files makes `validate_skill_package.py` report a partial hub declaration and refuse to classify the root.

**Failure this prevents:** a customized single skill that the advisor treats as a broken hub, and a framework update that silently replaces your stack conventions.

---

## 6. VALIDATE

Run these from the repository root. End on `validate_skill_package.py` for every conversion or keep-single repair. Add the routing-drift check when you changed aliases, vocabulary classes, or `routerSignals`.

### Parent hub (after Section 4)

Structural audit (same checker `/doctor parent-skill` runs, and the same script `validate_skill_package.py` invokes for a parent root):

```bash
node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/<hub-name>
```

Pass looks like `OK: parent-skill-check — all hard invariants passed`. Exit 0. This is the routing-parity gate: `routerSignals` vs `modes[]`, `tieBreak` coverage, `surfaceBundle` only with surfaces, on-disk packet paths, and the one-identity rule.

Routing-drift check (aliases and typed vocabulary still agree across registry, router, and packets):

```bash
node .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/parent-hub-vocab-sync.cjs --skill .opencode/skills/<hub-name>
```

Pass is exit 0 with `"driftDetected": false`. Exit 1 means `VOCAB-DRIFT` (orphan aliases, collisions, or ownership drift). Exit 2 means the hub-router or registry could not be parsed. Run this after you edit `aliases[]` or `vocabularyClasses`. Skip it when you only moved files and left vocabulary untouched.

Completion gate (must exit clean):

```bash
python3 .opencode/skills/sk-doc/sk-create-skill/scripts/validate_skill_package.py .opencode/skills/<hub-name>
```

For a parent root this runs `package_skill.py --check`, compiled-routing readiness, and `parent-skill-check.cjs`. Pass prints `Detected kind: parent` and each check as `PASS (exit 0)`. The report is clean only when the process itself exits 0.

Keep the compiled-routing directive block the hub template ships in `SKILL.md`. Removing it fails compiled-routing readiness even if the checker is otherwise green.

### Standalone skill (after Section 5)

```bash
python3 .opencode/skills/sk-doc/sk-create-skill/scripts/validate_skill_package.py .opencode/skills/<skill-name>
```

Pass prints `Detected kind: standalone` and `package_skill.py --check: PASS (exit 0)`. Do not run `parent-skill-check.cjs` on a single skill. That script audits hubs.

`--strict` promotes noncanonical generated paths from advisory to blocking. Use it on a newly generated package.

---

## 7. RELATED RESOURCES

- [parent-skills-nested-packets.md](../parent-skill/parent-skills-nested-packets.md) - hub shape, `packetKind`, One-Identity Invariant
- [parent-hub-router-schema.md](../parent-skill/parent-hub-router-schema.md) - `hub-router.json` fields and check 5
- [skill-root-metadata-contract.md](../shared/skill-root-metadata-contract.md) - class H vs class S required and forbidden files
- [validation-and-packaging.md](../shared/validation-and-packaging.md) - completion gate and packaging
- [creation-workflow.md](creation-workflow.md) - standalone create path
- `.opencode/commands/create/skill-parent.md` - `/create:skill-parent` operations `create` and `update`
- `.opencode/commands/create/skill.md` - `/create:skill` operations `full-create`, `full-update`, `reference-only`, `asset-only`
