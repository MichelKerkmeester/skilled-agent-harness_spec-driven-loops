# Use Skilled in Your Own Project

## 1. 📖 OVERVIEW

This guide puts Skilled into a project repository and keeps it current there. Every step runs through a `/doctor` command from the `system-skilled-doctor` skill, and every command that writes shows you a plan and waits for your yes.

Install Skilled in this checkout first. The root README's [Install](README.md#install) section has the four build commands, and `/doctor:setup` confirms the install.

### Link or Copy

There are two ways to put Skilled into a project. Pick one per project.

| | Link it | Copy it in |
| --- | --- | --- |
| **What it is** | Your project links to this checkout | Your project holds its own copy of Skilled, committed to its repo |
| **Updates** | One `git pull` here updates every linked project | You move the copy to a newer commit with a re-pin |
| **Your own changes** | Kept in your project's own files, next to the links | Kept in an overlay folder and put back on the copy after each update |
| **Teammates** | Each one needs their own Skilled checkout | Everyone gets Skilled from the project repo |
| **Pick it when** | You work alone or everyone keeps a Skilled checkout | The team shares one pinned version, or you change Skilled's own files |

Linking is the simpler choice. Copy only when the team needs one shared, pinned version or you change files inside Skilled.

---

## 2. 🔗 LINK IT INTO YOUR PROJECT

### Step 1: Run the Guide

Open this checkout in your runtime and run:

```
/doctor:install
```

It asks for four things in one prompt:

1. **Target repo:** the absolute path of your project
2. **Runtimes:** any of `claude`, `opencode`, `codex`, `cursor`, `devin` and `pi`
3. **Link shape:** pick `auto`
4. **Instruction file:** `embed` adds the shipped sections to your own `AGENTS.md`, and `link` points `AGENTS.md`, `CLAUDE.md` and `REPO RULES.md` at this checkout

<!-- readme-check
allow-ref CLAUDE.md | the instruction file in the operator's target repo, which this checkout does not ship
-->

It changes nothing itself. It prints the steps below, filled in for your project.

### Step 2: Run the Steps It Prints

| Step | Command | Run it from | What it does |
| --- | --- | --- | --- |
| 1 | `/doctor:symlink link --root <dir> --runtimes <list> --mode auto` | this checkout | Links `.skilled` and your runtime folders into the project, after a plan and your yes |
| 2 | `/doctor:agents-md embed --root <dir>` | this checkout | Adds the shipped instruction sections to the project's `AGENTS.md`. Skipped when you chose `link` |
| 3 | `/doctor:mcp install` | this checkout | Builds and registers Code Mode |
| 4 | `/doctor:git setup` | your project | Checks the git hooks and sk-git settings there |
| 5 | `/doctor:setup` | your project | Confirms the whole setup works from inside the project |

### Step 3: Check the Links

```
/doctor:symlink check --root <dir>
```

Every folder should read `linked-whole` or `linked-merge`.

On a new project, the first `link` leaves the runtime folders as `partial-merge`. Some of their entries are relative links into `.skilled`, and they are added only once `.skilled` exists in the project. Run the same `link` command a second time and `check` reads `linked-merge` everywhere.

### What Gets Linked

`.skilled` is always linked, and each runtime you pick adds its folder: `.claude` (plus `.mcp.json`), `.opencode`, `.codex`, `.cursor`, `.devin` or `.pi`. `--include` adds `repo-rules`, `.github`, `.utcp_config.json` or `.env`. Linking `.env` shares this checkout's secrets with every tool started in the project, and the plan says so before you approve it.

A folder your project already has stays a real folder, and each entry inside it becomes its own link. Your own files there are never replaced. A folder the project does not have is linked whole, unless it holds relative links of its own, such as `.claude/skills` pointing at `.skilled/skills`. Those folders are built in place the same way.

### Links Stay Out of Git

The links are absolute paths on your machine, so they must never be committed. `link` adds an ignore line for each one to `.git/info/exclude`, which git reads but never commits. `--ignore gitignore` writes `.gitignore` instead.

The relative links inside a runtime folder, such as `.claude/skills`, get no ignore line, so `git status` lists them. Leave them uncommitted, because a teammate without the `.skilled` link would get broken links.

### Undo

Every `link` run ends with its undo command:

```
/doctor:symlink unlink --run <run dir> --dry-run
```

Drop `--dry-run` to run it. Unlink removes only what that run created, restores only what it replaced and removes its ignore lines. After two `link` runs, undo the newer one first.

> **Context saves.** A save lands in the project's own `specs/` folder when it runs from inside the project. Run `/doctor:setup` and your saves from the project, not from this checkout.

---

## 3. 📦 COPY IT INTO YOUR PROJECT

A copy is replaced whole each time you move it to a newer Skilled. Any change you make to it therefore lives in an overlay: a file in your project's overlay folder that `/doctor:overlay` puts back on top of the copy.

<!-- readme-check
allow-ref overlay-manifest.json | the manifest inside the overlay folder of a project that copies Skilled in
allow-ref skilled-overlays/overlay-manifest.json | the manifest path the engine names in its error, in a project that copies Skilled in
allow-ref skilled-overlays/ | the overlay folder in a project that copies Skilled in, which this checkout does not ship
allow-ref .skilled-overlays.json | the optional overlay folder setting in a project that copies Skilled in, which this checkout does not ship
-->

### Step 1: Make the Copy

Copy `.skilled` and the runtime folders you use from one commit of this checkout, then commit them in your project:

```bash
cd /path/to/skilled
git archive <commit> .skilled .claude .opencode | tar -x -C /path/to/your-project
```

Write that commit down. It is your pin, the commit the copy matches.

### Step 2: Create the Overlay Folder

The folder is `skilled-overlays/` at the root of your project. To use another name, add `.skilled-overlays.json` next to it, for example `{ "overlayDir": "my-overlays" }`.

The folder holds one manifest, `overlay-manifest.json`, plus the overlay files it names. This one replaces one upstream file and adds a folder of the team's own commands:

```json
{
  "schemaVersion": 1,
  "pin": { "upstream": "skilled", "commit": "<the commit you copied>" },
  "layoutLinks": [],
  "overlays": [
    {
      "id": "commit-template",
      "scope": "file",
      "source": "sk-git/commit-message-template.md",
      "destination": ".skilled/skills/sk-git/assets/commit-message-template.md"
    },
    {
      "id": "team-commands",
      "scope": "directory",
      "source": "team-commands",
      "destination": ".skilled/commands/team"
    }
  ],
  "regenerate": [],
  "verifyGenerated": []
}
```

`source` is a path inside the overlay folder, and `destination` is the path in the copy that the overlay owns. Put your version of each file at its `source` path.

### Overlay Types

| `scope` | What the overlay does |
| --- | --- |
| `file` | Replaces one file with your version |
| `directory` | Keeps a folder in step with your folder of the same files |
| `marked-section` | Keeps your block between two marker lines inside an upstream file |
| `json-entry` | Changes named keys inside an upstream JSON file |
| `skill-root` | Replaces a whole skill folder with your own |
| `remove-root` | Removes named upstream paths from the copy |

Most projects need only `file` and `directory`. The [overlays reference](.skilled/skills/system-skilled-doctor/references/overlays.md) covers the others and the optional `regenerate`, `verifyGenerated` and `repin` blocks.

### Step 3: Put the Overlays On

```
/doctor:overlay status
```

A new overlay reads `overlay-edited`, because the copy does not have it yet. Then run:

```
/doctor:overlay apply
```

It shows the same report as its plan and writes after your yes. Run `status` again and it ends with `RESULT: PASSED`. A second `apply` changes nothing. Commit the overlay folder and the copy together.

### Changing an Overlay

Edit the file in the overlay folder, never in the copy, then run `apply`.

When someone edits the copy anyway, `status` reports that file as `live-edited` and `apply` stops and writes nothing. Move the edit into the overlay with:

```
/doctor:overlay apply --capture <path>
```

The `overlay-guard` hook stops this before it happens for an AI agent. It refuses an agent's edit to a file an overlay owns and names the overlay file to edit instead.

### Step 4: Move to a Newer Skilled

A re-pin moves the copy to a newer commit and puts your overlays back on top. It needs this checkout, holding both your pin and the new commit:

```
/doctor:overlay repin --upstream /path/to/skilled --to <new commit>
```

1. **It stages first.** It builds the result in a temporary copy and reports how many paths it will copy and delete, which overlays are blocked and which now equal upstream. Your project is not touched.
2. **You fix what it reports.** Rebase each blocked overlay onto the new upstream file and drop each overlay that now equals upstream, then run it again.
3. **You approve.** The live run backs up every path it will touch, copies, moves the pin, puts the overlays back and checks the result.

A re-pin copies `.skilled` and the runtime folders, never a root file such as `AGENTS.md`, so your own copy of those survives. Each upstream change it leaves out prints as a `not-copied` line for you to carry over by hand.

A re-pin refuses before writing anything when a file no overlay owns was edited in place, because the new copy would erase that edit. The refusal names the file. Move the edit into an overlay, list the path in the manifest's `repin.exclude` or restore the file from your pin.

### Undo a Re-Pin

Each live run keeps its backup in `skilled-overlays/repin-runs/<run-id>/` and prints its run id. To undo it:

```bash
node .skilled/commands/doctor/scripts/overlay-engine.cjs repin --rollback <run-id>
```

Rollback restores every backed-up file byte for byte, removes the files the run added and puts the old pin back. Run `/doctor:overlay status` afterwards to confirm.

### Already Keep Your Own Overlay Folder

The engine reads the same manifest and state shapes as a hand-made overlay setup, so the folder stays where it is. Name it in `.skilled-overlays.json`, run `status` and follow the fix each line names. The overlays reference has the [adoption steps](.skilled/skills/system-skilled-doctor/references/overlays.md#6-adopting-the-engine-with-existing-overlays).

---

## 4. 🩺 KEEP IT HEALTHY

| When | Linked project | Copied project |
| --- | --- | --- |
| **After a `git pull` in this checkout** | `/doctor:symlink check --root <dir>`, then `link` again if it lists missing entries | Nothing until you re-pin |
| **To take a new Skilled release** | The `git pull` already did it | `/doctor:overlay repin` |
| **When something looks wrong** | `/doctor:setup` from inside the project | `/doctor:overlay status`, then `/doctor:setup` |
| **To find the right command** | `/doctor:helper`, then describe the problem | The same |

---

## 5. 🛠️ TROUBLESHOOTING

| You see | It means | Do this |
| --- | --- | --- |
| `partial-merge` after a first `link` | Relative entries wait for `.skilled` to exist in the project | Run the same `link` again |
| `no overlay manifest at skilled-overlays/overlay-manifest.json` | The engine found no overlay folder | Create it (section 3, step 2), or name your folder in `.skilled-overlays.json` |
| `overlay-edited` | The overlay changed and the copy has not caught up | `/doctor:overlay apply` |
| `live-edited` | Someone edited the copy directly | `/doctor:overlay apply --capture <path>` |
| `both-changed` or `upstream-moved` | Two versions of one change disagree | Read both, update the overlay by hand, run `status` again |
| `refusing to inspect a protected path` | An overlay walks a file whose name contains `token` | Add that file to the overlay's `protectedPaths`, as the line says |
| `refuse: unowned <path> differs from the old pin` | A file no overlay owns was edited in place | Move the edit into an overlay, or restore the file from your pin |
| A held `.build-lock` | Another `apply` is running or one crashed | When no run is active, delete the lock file the message names |

---

## 6. 📚 RELATED DOCUMENTS

- [system-skilled-doctor README](.skilled/skills/system-skilled-doctor/README.md): every doctor command this guide uses
- [Overlays reference](.skilled/skills/system-skilled-doctor/references/overlays.md): sync states, refusals, re-pins and adoption in full
- [overlay-guard README](.skilled/hooks/overlay-guard/README.md): the hook that protects overlay-owned files
- [Root README](README.md): what Skilled is and how to install it
