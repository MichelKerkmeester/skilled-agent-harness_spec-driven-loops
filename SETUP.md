# Use Skilled in Your Own Project

## 1. OVERVIEW

This guide sets up Skilled in one of your project repositories. You run each step as a `/doctor` command from the `system-skilled-doctor` skill. A command that writes shows you a plan first and waits for your yes.

You need a working Skilled checkout before you start. The root README's [Install](README.md#install) section lists the build commands. Run `/doctor:setup` in the checkout to confirm the install.

### Link or Copy

You can set up a project in one of two ways. Pick one per project.

| | Link | Copy |
| --- | --- | --- |
| **How it works** | Your project links to your Skilled checkout | Your project commits its own copy of Skilled |
| **Updates** | One `git pull` in the checkout updates every linked project | You re-pin the copy to a newer commit |
| **Your changes** | Live in your project's own files, next to the links | Live in an overlay folder that goes back on the copy after each update |
| **Teammates** | Each one keeps their own Skilled checkout | Everyone gets Skilled from the project repo |
| **Choose it when** | You work alone, or every teammate keeps a checkout | The team needs one pinned version, or you change Skilled's own files |

Linking is simpler. Choose a copy only when you need one of its two reasons.

---

## 2. LINK IT INTO YOUR PROJECT

### Step 1: Run the Install Guide

Open your Skilled checkout in your runtime and run:

```
/doctor:install
```

It asks four questions in one prompt:

1. **Target repo:** the absolute path of your project.
2. **Runtimes:** any of `claude`, `opencode`, `codex`, `cursor`, `devin` and `pi`.
3. **Link shape:** choose `auto`.
4. **Instruction file:** `embed` adds the shipped sections to your project's own `AGENTS.md`. `link` points `AGENTS.md`, `CLAUDE.md` and `REPO RULES.md` at the checkout's copies.

<!-- readme-check
allow-ref CLAUDE.md | the instruction file in the operator's target repo, which this checkout does not ship
-->

The guide writes nothing. It prints the steps below with your paths filled in.

### Step 2: Run the Printed Steps

| Step | Command | Run it from | What it does |
| --- | --- | --- | --- |
| 1 | `/doctor:symlink link --root <dir> --runtimes <list> --mode auto` | the checkout | Links `.skilled` and your runtime folders into the project |
| 2 | `/doctor:agents-md embed --root <dir>` | the checkout | Adds the shipped sections to your `AGENTS.md`. Skip it if you chose `link` |
| 3 | `/doctor:mcp install` | the checkout | Builds and registers Code Mode |
| 4 | `/doctor:git setup` | your project | Checks the git hooks and sk-git settings |
| 5 | `/doctor:setup` | your project | Confirms the whole setup works |

### Step 3: Check the Links

```
/doctor:symlink check --root <dir>
```

Each folder should read `linked-whole` or `linked-merge`. A folder that reads `partial-merge` lacks entries the checkout gained since your last `link`. Run `link` again to add them.

### What Gets Linked

- **Always:** `.skilled`.
- **Per runtime:** `.claude` with `.mcp.json`, `.opencode`, `.codex`, `.cursor`, `.devin` or `.pi`.
- **On request:** `--include` adds `repo-rules`, `.github`, `.utcp_config.json` or `.env`.
- **Secrets:** linking `.env` shares the checkout's secrets with every tool in the project. The plan warns you before you approve it.

A folder your project already has stays a real folder. Each entry inside it becomes its own link, and your own files there stay untouched.

A folder your project lacks becomes one link. The exception is a folder that holds links of its own, such as `.claude/skills` pointing at `.skilled/skills`. The engine builds that folder entry by entry instead.

### Keep the Links Out of Git

The links point at your machine's checkout, so never commit them. `link` writes an ignore line for each one to `.git/info/exclude`. Git reads that file but never commits it, so `git status` stays clean. Pass `--ignore gitignore` to write `.gitignore` instead.

### Undo a Link

Each `link` run ends by printing its undo command:

```
/doctor:symlink unlink --run <run dir> --dry-run
```

Drop `--dry-run` to run it for real. Unlink removes only what that run created. It restores only what that run replaced, and it removes the run's ignore lines. After several `link` runs, undo the newest first.

> **Context saves.** A save goes to the `specs/` folder of the repo you run it from. Run `/doctor:setup` and your saves from your project, not from the checkout.

---

## 3. COPY IT INTO YOUR PROJECT

A re-pin replaces your copy whole with a newer commit. A change you made to the copy would be lost, so each change lives in an overlay instead. An overlay is a file in your project's overlay folder. `/doctor:overlay` applies it on top of the copy.

<!-- readme-check
allow-ref overlay-manifest.json | the manifest inside the overlay folder of a project that copies Skilled in
allow-ref skilled-overlays/overlay-manifest.json | the manifest path the engine names in its error, in a project that copies Skilled in
allow-ref skilled-overlays/ | the overlay folder in a project that copies Skilled in, which this checkout does not ship
allow-ref .skilled-overlays.json | the optional overlay folder setting in a project that copies Skilled in, which this checkout does not ship
-->

### Step 1: Create the Copy

Export `.skilled` and the runtime folders you use from one commit of your checkout:

```bash
cd /path/to/skilled
git archive <commit> .skilled .claude .opencode | tar -x -C /path/to/your-project
```

Commit the result in your project. Note the commit you exported. That commit is your pin.

### Step 2: Create the Overlay Folder

The engine looks for `skilled-overlays/` at the root of your project. To use another folder, add `.skilled-overlays.json` at the root, for example `{ "overlayDir": "my-overlays" }`.

The folder holds `overlay-manifest.json` and your overlay files. This manifest replaces one upstream file and adds a folder of team commands:

```json
{
  "schemaVersion": 1,
  "pin": { "upstream": "skilled", "commit": "<the commit you exported>" },
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

- **`source`:** where your version lives, inside the overlay folder.
- **`destination`:** the path in the copy that the overlay owns.

Save your version of each file at its `source` path.

### Overlay Types

| `scope` | What the overlay does |
| --- | --- |
| `file` | Replaces one file with your version |
| `directory` | Keeps a folder equal to your folder |
| `marked-section` | Keeps your block between two marker lines in an upstream file |
| `json-entry` | Changes named keys in an upstream JSON file |
| `skill-root` | Replaces a whole skill folder with yours |
| `remove-root` | Removes named upstream paths from the copy |

Most projects need only `file` and `directory`. The [overlays reference](.skilled/skills/system-skilled-doctor/references/overlays.md) covers the rest, plus the optional `regenerate`, `verifyGenerated` and `repin` blocks.

### Step 3: Apply the Overlays

Check what is out of sync:

```
/doctor:overlay status
```

A new overlay reads `overlay-edited`, because the copy does not have it yet. Apply it:

```
/doctor:overlay apply
```

`apply` shows the status report as its plan and writes after your yes. Run `status` again. It now ends with `RESULT: PASSED`. Commit the overlay folder and the copy together.

Running `apply` a second time changes nothing.

### Change an Overlay

Edit the file in the overlay folder, never in the copy. Then run `apply`.

Someone may still edit the copy directly. `status` then reports the file as `live-edited`, and `apply` refuses to write. Move the edit into its overlay:

```
/doctor:overlay apply --capture <path>
```

An AI agent is stopped sooner. The `overlay-guard` hook refuses an agent's edit to a file an overlay owns. It names the overlay file to edit instead.

### Step 4: Re-Pin to a Newer Commit

A re-pin moves your copy to a newer commit and applies your overlays again. It reads from your Skilled checkout, which must hold both your pin and the new commit:

```
/doctor:overlay repin --upstream /path/to/skilled --to <new commit>
```

1. **It stages first.** It builds the result in a temporary folder and leaves your project alone. The report lists the paths it will copy and delete, any blocked overlays and any overlays that now equal upstream.
2. **You fix the report.** Update each blocked overlay to match the new upstream file. Remove each overlay that now equals upstream. Run the command again.
3. **You approve.** The live run backs up every path it touches. Then it copies, moves the pin and applies the overlays.
4. **It checks the result.** The run ends with `RESULT: PASSED` and the new pin in your manifest.

A re-pin copies `.skilled` and the runtime folders. It never copies a root file such as `AGENTS.md`, so your project's version survives. Each upstream change it skips prints as a `not-copied` line. Copy those over by hand if you want them.

A re-pin refuses to start when someone edited a file in place that no overlay owns, because the new copy would erase that edit. The refusal names the file. Move the edit into an overlay or add the path to the manifest's `repin.exclude` list. You can also restore the file from your pin.

### Undo a Re-Pin

Each live run saves a backup in `skilled-overlays/repin-runs/<run-id>/` and prints the run id. Undo it with:

```bash
node .skilled/commands/doctor/scripts/overlay-engine.cjs repin --rollback <run-id>
```

Rollback restores every backed-up file byte for byte. It removes the files the run added and sets the old pin back. Run `/doctor:overlay status` afterwards to confirm.

### Bring an Existing Overlay Folder

Already keep overlays with a script of your own? The engine reads the same manifest and state files, so the folder stays where it is. Name it in `.skilled-overlays.json` and run `status`. Each line names its fix. The overlays reference has the full [adoption steps](.skilled/skills/system-skilled-doctor/references/overlays.md#6-adopting-the-engine-with-existing-overlays).

---

## 4. KEEP IT HEALTHY

| When | Linked project | Copied project |
| --- | --- | --- |
| **After a `git pull` in the checkout** | Run `/doctor:symlink check --root <dir>`. Run `link` again if it lists missing entries | No action until you re-pin |
| **To adopt a new Skilled release** | The `git pull` already adopted it | Run `/doctor:overlay repin` |
| **When something looks wrong** | Run `/doctor:setup` in your project | Run `/doctor:overlay status`, then `/doctor:setup` |
| **To find the right command** | Run `/doctor:helper` and describe the problem | Same as linked |

---

## 5. TROUBLESHOOTING

| You see | Cause | Fix |
| --- | --- | --- |
| `partial-merge` in `/doctor:symlink check` | The checkout gained entries since your last `link` | Run `link` again |
| `no overlay manifest at skilled-overlays/overlay-manifest.json` | The engine found no overlay folder | Create one (section 3, step 2), or name yours in `.skilled-overlays.json` |
| `overlay-edited` | An overlay changed and the copy lags behind | Run `/doctor:overlay apply` |
| `live-edited` | Someone edited the copy directly | Run `/doctor:overlay apply --capture <path>` |
| `both-changed` or `upstream-moved` | Two versions of one change disagree | Read both, update the overlay by hand and run `status` again |
| `refusing to inspect a protected path` | An overlay walks a file with `token` in its name | Add that file to the overlay's `protectedPaths`, as the line says |
| `refuse: unowned <path> differs from the old pin` | Someone edited a file in place that no overlay owns | Move the edit into an overlay, or restore the file from your pin |
| A held `.build-lock` | Another `apply` is running, or one crashed | Once no run is active, delete the lock file the message names |

---

## 6. RELATED DOCUMENTS

- [system-skilled-doctor README](.skilled/skills/system-skilled-doctor/README.md): every doctor command in this guide.
- [Overlays reference](.skilled/skills/system-skilled-doctor/references/overlays.md): sync states, refusals, re-pins and adoption in full.
- [overlay-guard README](.skilled/hooks/overlay-guard/README.md): the hook that protects overlay-owned files.
- [Root README](README.md): what Skilled is and how to install it.
