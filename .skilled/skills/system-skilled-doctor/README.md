---
title: "system-skilled-doctor"
description: "Puts Skilled into a project and keeps it working and current there, through the doctor commands this skill owns."
trigger_phrases:
  - "system-skilled-doctor readme"
  - "skilled doctor commands"
  - "put skilled into my project"
version: 1.0.14.0
---

# system-skilled-doctor

> Install Skilled into your own project and keep it working and current there.

---

## 1. OVERVIEW

### At a Glance

| Aspect | What you get |
|---|---|
| **Use it for** | Installing, linking, updating and checking Skilled in a project repository, including a vendored copy |
| **Invoke with** | One of the `/doctor:*` commands below or a described problem for `/doctor:helper` |
| **Works on** | A project repository and the Skilled checkout or release it uses |
| **Produces** | Check reports and plans that change nothing until you approve them |

### What It Does

This skill owns all seventeen doctor commands. Eleven are about Skilled inside a project, and six check one skill's own setup. Each one is a router in `.skilled/commands/doctor/` that runs its own workflow, so the skill names the command that fits and runs it. `/doctor:setup` checks a project and names the command that repairs each failing leg. When no command is obvious, `/doctor:helper` reads the problem in your words and ranks the commands that fit.

### The Owned Commands

Each command below has its own router and workflow. The table says what each one is for.

| Command | What it does |
|---|---|
| `/doctor:install` | Prints the checks and the ordered steps that install Skilled in your own project repo. It writes nothing |
| `/doctor:symlink` | Checks a project repo's links to the Skilled checkout and creates or removes them. `link` writes only with the digest its own plan printed |
| `/doctor:update` | Moves a checkout to a newer spec-kit release through six actions: `check`, `align`, `apply`, `rollback`, `record-base`, `compat`. A bare run is the read-only `check`. `compat` asks for two separate approvals. `apply` ends with the post-upgrade cleanup of what the retired advisor lane left on the machine. A linked project runs that cleanup from the Skilled checkout, as `INSTALL-SKILLED.md` section 5 says |
| `/doctor:agents-md` | Checks the sections Skilled ships in a project's `AGENTS.md` and embeds or restores them after showing the plan. `check` reports twelve rows and writes nothing |
| `/doctor:runtime-mirrors` | Checks the agent, command, prompt and hook mirrors each runtime directory derives from `.skilled`. Each drifting surface is reported with its repair command |
| `/doctor:env` | Shows the switches documented in `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` and every other setting in the root `.env.example`, with where each is set. It saves a preference after you approve the exact line |
| `/doctor:setup` | Lists every doctor command and target and runs six read-only checks. A failing leg names its repair command, then the report shows the last session hop, any unclaimed handoff note, the context window the relaunch nudge measures against and the orphaned processes still running |
| `/doctor:helper` | Reads the problem in plain words and ranks up to three doctor commands that fit, with the reason and a command ready to run |
| `/doctor:speckit` | Checks that the trigger index is fresh and that its lookup and the ripgrep recipes return results. A stale index is reported with its regeneration command |
| `/doctor:mcp` | Installs or debugs Code Mode with its UTCP configuration and runtime registration. Every repair asks for approval first |
| `/doctor:overlay` | Checks a vendored copy's overlays and puts them back, with a re-pin that moves the copy to a newer upstream commit. `status --audit` adds each vendored path that drifted with no overlay owning it, then one advisory `DOCS` line per overlay-folder README that is missing or fails sk-doc's validator. `apply --relayout` moves overlay copies onto their layout paths |
| `/doctor:sk-code` | Runs the sk-code setup battery, or checks and creates the repository quality config, naming each repair |
| `/doctor:ci` | Lists the GitHub Actions workflows with their switch state, scaffolds a new workflow or toggles one CI switch |
| `/doctor:git` | Switches the sk-git hook gates, edits the commit, PR and branch rules in `.sk-git/` and checks which settings are live |
| `/doctor:sk-skill` | Checks a skill against the Skilled format, or converts one to it, plan first |
| `/doctor:skill-advisor` | Tunes and rebuilds the skill advisor, and audits graph freshness, router reach, budgets and parent hubs |
| `/doctor:deep-loop` | Reads the coverage graphs and convergence of research and review runs |

---

## 2. QUICK START

**Step 1: Name the job.** Describe it in your own words, such as installing Skilled in your project repo. You can also pick a command from the table.

**Step 2: Run the install guide.**

```text
/doctor:install
```

It prints the build and link checks and the ordered steps for your project. It writes nothing itself.

**Step 3: Check the result.**

```text
/doctor:setup
```

It prints one line per setup leg and names the command that repairs each failing one.

---

## 3. HOW IT WORKS

A request about Skilled inside a project, or about one skill's own setup checks, selects this skill. The skill matches it to one command from the table. When nothing matches clearly, `/doctor:helper` ranks the commands that fit. That command runs its own workflow and shows its result. A command that changes a project prints its plan first and changes nothing until you approve it. Read the command's output and its exit status before you report what it found.

```text
┌──────────────────────────────┐
│ Request about Skilled        │
│ in a project                 │
└────────────────┬─────────────┘
                │
                ▼
┌────────────────┬─────────────┐                        ┌──────────────────────────────┐
│ Match one owned command      ├────no clear match─────▶├ /doctor:helper ranks the     │
└────────────────┬─────────────┘                        │ commands that fit            │
                │                                       └────────────────┬─────────────┘
                │         ──────────────────────────────────────────────┘
                ▼         ▼
┌────────────────┬─────────┬───┐                        ┌──────────────────────────────┐
│ Run the command's own        ├───────read-only───────▶├ Check report                 │
│ workflow                     │                        └──────────────────────────────┘
└────────────────┬─────────────┘
                │ writes
                ▼
┌────────────────┬─────────────┐                        ┌──────────────────────────────┐
│ Plan shown first             ├──────you approve──────▶├ Change applied               │
└──────────────────────────────┘                        └──────────────────────────────┘
```

### The Plan Before The Write

Every command that changes a project shows its plan first and waits for your yes. `/doctor:symlink link` and `/doctor:agents-md embed` also print a digest. The write runs only when that digest comes back with the plan, so an approval cannot drift onto a changed tree. A read-only command such as `/doctor:setup` asks nothing and writes nothing in the repository.

### A Vendored Copy's Overlays

A project that copies Skilled replaces the whole copy when it moves to a new upstream release. Its own changes survive only when each one also lives in an overlay folder that the engine applies back onto the copy. `/doctor:overlay status` prints one line per destination that is out of sync, with the fix. `apply` writes nothing while any destination is `live-edited`, `both-changed`, `upstream-moved` or `cannot-apply`. A `live-edited` one needs `/doctor:overlay apply --capture <path>`, and the other three need a person to decide.

Each overlay copy has a layout path in the overlay folder. A copy of a `.skilled/` path sits under `framework/`, and a copy of any other path under `root/`, so `.claude/settings.json` sits at `root/claude/settings.json`. The overlay folder can sit inside the tree or beside it as `../<name>`, which the tree's `.skilled-overlays.json` names. A folder beside the tree must still sit in the tree's git repository, or every command exits 2. After a re-pin onto this layout, `status` prints a `LAYOUT` line for each copy still at its older path. The lines never fail the run. Run `/doctor:overlay apply --relayout` once to move the copies. The [overlay reference](./references/overlays.md) has the states, the layout and the re-pin steps.

---

## 4. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for it when you add Skilled to a project, link a local checkout into another repository, move a project to a newer release, embed the shipped `AGENTS.md` sections or carry a vendored copy's own changes across a new copy. It also fits when something about Skilled in a project looks wrong and you want the check that names the repair, and when you want one skill's own setup checked: the sk-code battery, the CI switches, the sk-git hook gates, a skill's format, the skill advisor or a deep-loop run.

### Related Skills

Six doctor commands check the setup of one skill. The skill keeps its own work, and this skill owns the command that checks it.

| Skill | Doctor commands that check it |
|---|---|
| `sk-code` | `/doctor:sk-code` and `/doctor:ci` |
| `sk-git` | `/doctor:git` |
| `sk-doc` | `/doctor:sk-skill` |
| `system-skill-advisor` | `/doctor:skill-advisor` |
| `system-deep-loop` | `/doctor:deep-loop` |

`system-spec-kit` owns the scripts several of the commands call, such as the trigger-index lookup. It also owns the `ENV-REFERENCE.md` that `/doctor:env` reads. `mcp-code-mode` owns Code Mode itself, which `/doctor:mcp` installs and debugs in a project.

---

## 5. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| `status` stops and names the default manifest path | The tree has no overlay folder and no `.skilled-overlays.json` setting | Add `.skilled-overlays.json` naming a folder that holds `overlay-manifest.json`. Without that setting, create `skilled-overlays/` with its own `overlay-manifest.json` |
| `apply` writes nothing and reports `both-changed` or `upstream-moved` | The overlay and the live copy hold edits the engine cannot reconcile | Read both copies, decide, update the overlay, then run `status` again |
| A run refuses and prints an overlay lock owner line | The run cannot confirm the lock's owner has ended | Run the `Next:` line it prints: check with `ps -p <pid>` that the owner has ended, then remove the lock file it names |
| `status` prints `LAYOUT` lines after a re-pin | Overlay copies still sit at their older paths, off the `framework/` and `root/` layout | Run `/doctor:overlay apply --relayout` once. The lines never fail `status`, so this can wait |
| `apply` reports a path that `does not match what apply last wrote there`, `is a link that leads outside the tree` or `is a link that does not resolve` | An unowned file, folder or link stands where an overlay now writes another shape, or a link on the path leads outside the tree or loops | Run the `Next:` line it prints, which moves the path aside to `<path>.keep` and applies again |

---

## 6. VERIFICATION

Run the checks below from the repository root. The manual playbook covers what an operator sees.

| Check | Result |
|---|---|
| README structure | `python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/skills/system-skilled-doctor/README.md --type readme` prints `✅ VALID` and `Total issues: 0` |
| Doctor command contracts | `node --test .skilled/commands/doctor/scripts/tests/*.test.cjs` reports `fail 0` in its summary |
| Advisor command bridges | `node .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs --check` prints `"changed": []` |
| Operator scenarios | [The manual playbook](./manual-testing-playbook/manual-testing-playbook.md) holds the routing and overlay scenarios `SKD-001` to `SKD-013` and the `DOC` scenarios of every doctor command in its `doctor-commands/` category |

---

## 7. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions, rules and the boundary with other skills |
| [`ROUTER.md`](./ROUTER.md) | Machine router: the intent map and the resource map |
| [`references/overlays.md`](./references/overlays.md) | The overlay sync states, what the engine refuses and the re-pin steps |
| [`manual-testing-playbook/manual-testing-playbook.md`](./manual-testing-playbook/manual-testing-playbook.md) | The routing, overlay and doctor command scenarios and where each verdict is recorded |
| [`INSTALL-SKILLED.md`](../../../INSTALL-SKILLED.md) | The step-by-step guide to linking Skilled into a project or copying it in with overlays |
| [`.skilled/commands/doctor/`](../../commands/doctor/) | The command routers and the workflows they load |

<!-- readme-check
allow-ref .skilled-overlays.json | written in a project that vendors Skilled, not in this repository
allow-ref framework/ | the layout folder inside a vendoring project's overlay folder, not in this repository
allow-ref root/claude/settings.json | an example layout path inside a vendoring project's overlay folder
-->
