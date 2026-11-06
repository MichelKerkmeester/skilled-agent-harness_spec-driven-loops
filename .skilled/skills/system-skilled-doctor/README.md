---
title: "system-skilled-doctor"
description: "Puts Skilled into a project, checks it there and keeps it current, through the doctor commands this skill owns."
trigger_phrases:
  - "system-skilled-doctor readme"
  - "skilled doctor commands"
  - "put skilled into my project"
version: 1.0.0.0
---

# system-skilled-doctor

> Get Skilled into your own project, check that it works there and keep it current.

---

## 1. OVERVIEW

### At a Glance

| Aspect | What you get |
|---|---|
| **Use it for** | Installing, linking, updating and checking Skilled in a project repository |
| **Invoke with** | The doctor commands below, or a request such as "put Skilled into my project repo" |
| **Works on** | A project repository and the Skilled checkout or release it uses |
| **Produces** | Check reports, plans waiting for your approval, and the changes they apply |

### What It Does

This skill owns ten doctor commands about supporting and integrating Skilled into a project. Each command keeps its own workflow in `.skilled/commands/doctor/`, so the skill's job is to say which command fits and to run it. When you are not sure which one, `/doctor:helper` takes the problem in your words and ranks the commands that fit.

Doctor commands about a single skill's own checks stay with that skill, such as `/doctor:git` with `sk-git`.

### The Owned Commands

| Command | What it does |
|---|---|
| `/doctor:install` | Walks a first install into your own project repo: checks the builds, runs the symlink check and prints the ordered setup commands for you to run, writing nothing itself |
| `/doctor:symlink` | Checks, links or unlinks `.skilled` and the chosen runtime folders in another project repo, as a whole-folder link or a real folder holding one link per entry, writing only after you approve the printed plan and its digest |
| `/doctor:update` | Moves a checkout to a newer spec-kit release: `check`, `align`, a gated `apply`, `rollback`, `record-base` and `compat`, which moves a v3 spec layout to v4 behind two approvals |
| `/doctor:agents-md` | Checks, embeds or restores the sections Skilled ships in a project's `AGENTS.md`, showing the plan first |
| `/doctor:runtime-mirrors` | Checks the agent, command, prompt and hook mirrors each runtime directory derives from `.skilled` and names the repair command |
| `/doctor:env` | Shows the switches documented in `system-spec-kit`'s `runtime/ENV-REFERENCE.md`, plus every other setting in the root `.env.example`, and where each is set, and saves a preference after you approve the exact line |
| `/doctor:setup` | Lists every doctor command and target, runs five read-only setup checks, names the repair command for each failing one and shows the last session hop, any unclaimed handoff note and the orphaned processes still running |
| `/doctor:helper` | Takes a described problem and ranks the doctor commands that fit, with why, ready to run |
| `/doctor:speckit` | Checks that the trigger index is fresh, its lookup runs and the ripgrep recipes return results |
| `/doctor:mcp` | Installs or debugs Code Mode, its UTCP configuration and its runtime registration |

---

## 2. QUICK START

**Step 1: Name the job.** Ask in your own words, for example "put Skilled into my project repo", or run a command from the table.

**Step 2: Run the command.**

```bash
/doctor:install
```

It prints the ordered steps for your project and writes nothing itself.

**Step 3: Check the result.**

```bash
/doctor:setup
```

Each failing check names the command that repairs it.

---

## 3. HOW IT WORKS

A request reaches this skill when it is about Skilled inside a project. The skill matches it to one command from the table. That command runs its own workflow and shows its result. A command that writes shows its plan first and changes nothing until you approve it.

The scripts some commands call stay with the skill that owns them. `/doctor:speckit` runs `system-spec-kit`'s trigger-index lookup, and `/doctor:env` reads its `ENV-REFERENCE.md`.

---

## 4. INTEGRATION & NAVIGATION

### Related Skills

| Skill | Relationship |
|---|---|
| `system-spec-kit` | Owns the trigger index, the runtime-mirror generators and the environment reference these commands check |
| `mcp-code-mode` | Owns Code Mode itself, which `/doctor:mcp` installs and debugs in a project |
| `sk-git`, `sk-code`, `sk-doc`, `system-skill-advisor`, `system-deep-loop` | Each keeps the doctor command for its own checks |

---

## 5. VERIFICATION

| Check | Result |
|---|---|
| Doctor contract tests | `node --test .skilled/commands/doctor/scripts/tests/*.test.cjs` passes every test |
| Command bridges | `command-bridges-drift-guard.vitest.ts` passes, and each owned command's bridge names `system-skilled-doctor` |

---

## 6. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions |
| [`ROUTER.md`](./ROUTER.md) | Machine router: intent map, resource map and loading levels |
