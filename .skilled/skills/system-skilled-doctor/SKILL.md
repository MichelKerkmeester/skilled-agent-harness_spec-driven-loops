---
name: "system-skilled-doctor"
description: "Doctor commands that put Skilled into a project repo and keep it current there, plus the setup checks of each skill."
allowed-tools: [Read, Write, Edit, Bash, Glob, Grep]
version: 1.3.0.0
---

<!-- Keywords: put skilled into my project, skilled in my project repo, keep skilled current in my project, vendored skilled copy, vendored skilled overlays, keep my changes to vendored skilled, re-pin vendored skilled, link a local skilled checkout into a project, overlay layout path, relayout, overlay audit, strict overlay writes, unowned vendored files, unowned vendored change, overlay sources, no overlay owns, overlay root files drifted upstream, overlay rebase, drifted from the pinned upstream commit, changed the root files an overlay owns, overlay no longer adds a json item, stage an overlay re-pin, staged overlay re-pin, take over an overlay lock, overlay lock whose owner has ended, overlay folder beside the tree, sibling overlay folder, move my overlay folder out of the tree, adopt an unowned vendored file into an overlay, overlay folders missing a readme, base from a pinned framework commit -->
<!-- Owns: every /doctor command. /doctor:install, /doctor:symlink, /doctor:update, /doctor:agents-md, /doctor:runtime-mirrors, /doctor:env, /doctor:setup, /doctor:helper, /doctor:speckit, /doctor:mcp, /doctor:overlay, /doctor:sk-code, /doctor:ci, /doctor:git, /doctor:sk-skill, /doctor:skill-advisor, /doctor:deep-loop. -->

# System Skilled Doctor

Owns every doctor command: the ones that put Skilled into a project and keep it current there, and the ones that check one skill's own setup.

---

## 1. WHEN TO USE

### Activation Triggers

Use this skill when:

- Someone wants Skilled in their own project repository, as a first install, a linked checkout, an update to a newer release or a vendored copy.
- A project's runtime folders, environment switches, `AGENTS.md` sections, trigger index or Code Mode registration need checking against what Skilled ships.
- A project that vendors Skilled needs its own changes, its overlays, applied or checked after the copy changed.
- A problem is described and the right doctor command is not known yet.
- One skill's own setup needs checking or repair: the sk-code battery or quality config, the CI workflows, the sk-git hook gates and rules, a skill's format, the skill advisor's graph or a deep loop's convergence.

**Keyword Triggers**:
- "put Skilled into my project", "install Skilled", "link the Skilled checkout"
- "update Skilled", "runtime mirrors", "environment switches", "doctor setup"
- "which doctor command", "AGENTS.md sections", "trigger index fresh", "Code Mode install"
- "vendored Skilled", "Skilled overlays", "overlay status", "apply the overlays"
- "sk-code setup", "CI switches", "git hook gates", "skill format check", "rebuild the skill advisor", "deep-loop convergence"

### When NOT to Use

Do not use this skill for:

- A skill's own work. Writing code is `sk-code`'s, committing and opening a PR are `sk-git`'s, authoring a skill is `sk-doc`'s and running a deep loop is `system-deep-loop`'s. A doctor command only checks or repairs the setup that work runs on.
- Writing or validating spec folders, which is `system-spec-kit`'s work. That skill still owns the scripts these commands call, such as the trigger-index lookup and `ENV-REFERENCE.md`.

---

## 2. SMART ROUTING

A request that names one of the owned commands, or describes installing, linking, updating or checking Skilled in a project, selects this skill.

The owned-command table in [`README.md`](./README.md) loads first. It names what each command does, so the request can be matched to one command and that command run. A request about a vendored copy's overlays also loads [`references/overlays.md`](./references/overlays.md), which says what each sync state means and what resolves it.

A request to do a skill's own work looks related but belongs to that skill, as When NOT to Use says. The router refuses it rather than loading this table.

The machine router and its resource map live in [`ROUTER.md`](./ROUTER.md), which calls `discover_markdown_resources()` and `_guard_in_skill()` and returns `UNKNOWN_FALLBACK` on no match. Read it before loading a skill-local resource.

---

## 3. HOW IT WORKS

### Workflow

1. Match the request to one owned command, using the README table. When nothing matches clearly, run `/doctor:helper` with the problem in the user's words.
2. Run that command. Each one is a router in `.skilled/commands/doctor/` that owns its own workflow YAML and presentation asset, so this skill adds no second copy of either.
3. Read the command's result and its exit status before reporting it. A command that writes shows its plan and waits for approval first.

### Output Contract

The chosen doctor command's own result: a check report, or a plan that changes nothing until the user approves it.

### Verification

The command's own checks, read with their exit status. For a change to this skill's ownership, run `node --test .skilled/commands/doctor/scripts/tests/*.test.cjs` and the command-bridge drift guard.

---

## 4. RULES

### ✅ ALWAYS

- Run the doctor command itself, rather than repeating its steps by hand.
- Read a command's output and exit status before reporting what it found.
- Let a writing command show its plan and wait for the user's approval.

### ❌ NEVER

- Move a command file out of `.skilled/commands/doctor/`. The bridge deriver and the runtime mirrors read that folder, and so does `_routes.yaml`.
- Claim a check passed from its exit status alone.
- Answer another skill's doctor question from this skill.

### ⚠️ ESCALATE IF

- No owned command fits and `/doctor:helper` ranks nothing.
- A command refuses or fails in a way its own output does not explain.
- A request would change a project file the command's plan did not list.

---

## 5. SUCCESS CRITERIA

The task is complete when:

- The fitting doctor command ran and its result was read.
- Any write it made was approved first and matches its printed plan.
- Anything left unresolved is reported with the command's own words.

---

## 6. INTEGRATION POINTS

### Inputs

- A project repository with the Skilled checkout or release it uses.
- The user's description of what to set up or check.

### Outputs

- Doctor reports and approved plans.
- The changes those plans apply.

### Related Workflows

- `system-spec-kit` owns the trigger index, its retrieval recipes, the runtime-mirror generators and `ENV-REFERENCE.md`, which three of the owned commands check.
- `mcp-code-mode` owns Code Mode itself. `/doctor:mcp` installs and debugs it in a project.

---

## 7. REFERENCES AND RELATED RESOURCES

### Core References

- [`README.md`](./README.md): the owned-command table.
- [`references/overlays.md`](./references/overlays.md): the overlay sync states and the overlay folder setting, what the engine refuses and how to re-pin.
- `.skilled/commands/doctor/`: each command's router with its workflow YAML and presentation asset.

### Loading Notes

- Load the README table first, then the one command it points to.
- Load the overlay reference only for a vendored copy's overlays.
