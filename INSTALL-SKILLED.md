# Install Skilled

## 1. OVERVIEW

This guide installs Skilled and then sets it up in your own project repositories. Section 2 installs and checks a Skilled checkout. Sections 3 and 4 bring that checkout into a project, by linking it or by copying it in.

From section 3 on, you run each step as a `/doctor` command from the `system-skilled-doctor` skill. A command that writes shows you a plan first and waits for your yes.

### Link or Copy

You can set up a project in one of two ways. Pick one per project.

| | Link | Copy |
| --- | --- | --- |
| **How it works** | Your project links to your Skilled checkout | Your project commits its own copy of Skilled |
| **Updates** | One `git pull` in the checkout updates every linked project | You re-pin the copy: move it from the commit it came from to a newer one |
| **Your changes** | Live in your project's own files, next to the links | Live in an overlay folder that goes back on the copy after each update |
| **Teammates** | Each one keeps their own Skilled checkout | Everyone gets Skilled from the project repo |
| **Choose it when** | You work alone, or every teammate keeps a checkout | The team needs one pinned version, or you change Skilled's own files |

Linking is simpler. Choose a copy only when you need one of its two reasons.

---

## 2. INSTALL A SKILLED CHECKOUT

### Prerequisites

You need Node.js 24, `npm`, `git` and a POSIX shell. Node 24 is the one version every part of the framework accepts.

### Clone and Build

Clone the repository and step into it:

```bash
git clone https://github.com/MichelKerkmeester/skilled-agent-harness_spec-driven-loops.git
cd skilled-agent-harness_spec-driven-loops
```

Build the Spec Kit first. The runtimes' session hooks load this build.

```bash
npm --prefix .skilled/skills/system-spec-kit install
npm --prefix .skilled/skills/system-spec-kit run build
```

Then build the Skill Advisor. Its build uses the Spec Kit's TypeScript compiler, so it comes second. The last command checks the advisor's CLI. `list-tools` answers offline, with no daemon running.

```bash
npm --prefix .skilled/skills/system-skill-advisor/runtime install
npm --prefix .skilled/skills/system-skill-advisor/runtime run build
node .skilled/bin/skill-advisor.cjs list-tools --format json
```

### Check the Install

Open the repository in any of the six runtimes: OpenCode, Claude Code, Codex, Cursor, Devin or Pi. Then run:

```
/doctor:setup
```

It checks the install without changing anything. It names one repair command for each failure.

Codex, Cursor and Pi spell commands with a hyphen, as in `/doctor-setup`. Devin reaches the spec-kit workflows through its `/system-spec-kit` skill.

### Add Code Mode

Code Mode is the bridge your runtime uses to call external MCP tools. It builds separately from the two builds above. Run:

```
/doctor:mcp install
```

It installs the dependencies and builds Code Mode when its `dist` is missing or stale. It configures the `.utcp_config.json` manuals. It registers Code Mode in the seven project config files, two of them for Claude. Each write waits for its own approval. Add `--runtime <name>` to register one runtime only: `opencode`, `claude`, `codex`, `cursor`, `pi` or `devin`.

To check Code Mode later, run `/doctor:mcp debug`. It reports PASS, WARN or FAIL per check, and `--fix` adds guided repair. Provider keys live in `.env`, which only Code Mode reads. Section 1 of [`.env.example`](.env.example) lists them. An agent cannot read that file: the [dotenv guard](.skilled/hooks/env-secret-guard/README.md) refuses it on every runtime and offers key names or a fingerprint instead. The [Code Mode install guide](.skilled/skills/mcp-code-mode/INSTALL-GUIDE.md) covers the manual steps.

### Git Hooks

The first AI session installs the repository's git hooks. The root README's [Git Hooks](README.md#git-hooks) section says what each hook blocks. `/doctor:git setup` checks the hooks and the sk-git settings.

Your checkout is ready once `/doctor:setup` passes. Run `/doctor:setup` again whenever something looks wrong. To use Skilled in a project of your own, pick a way in below.

---

## 3. LINK IT INTO YOUR PROJECT

### Step 1: Run the Install Guide

Open your Skilled checkout in your runtime and run:

```
/doctor:install
```

It asks four questions in one prompt:

1. **Target repo:** the absolute path of your project.
2. **Runtimes:** the AI coding tools you use. Pick any of `claude`, `opencode`, `codex`, `cursor`, `devin` and `pi`.
3. **Link shape:** choose `auto`. [What Gets Linked](#what-gets-linked) explains the shapes.
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
| 3 | `/doctor:mcp install` | the checkout | Builds and registers Code Mode, the bridge your runtime uses to call MCP tools |
| 4 | `/doctor:git setup` | your project | Checks the git hooks and sk-git settings. Run `/doctor:git standards` afterwards to write repo-owned commit, PR and branch rules; until then the shipped defaults apply |
| 5 | `/doctor:setup` | your project | Confirms the whole setup works |

If you chose `link` for the instruction file, step 1 also carries `--link-instructions` and step 2 drops out.

### Step 3: Check the Links

```
/doctor:symlink check --root <dir>
```

Each folder should read `linked-whole` or `linked-merge`. A folder that reads `partial-merge` lacks entries the checkout gained since your last `link`. Run `link` again to add them.

### What Gets Linked

- **Always:** `.skilled`.
- **Per runtime:** `.claude` with `.mcp.json`, `.opencode`, `.codex`, `.cursor`, `.devin` or `.pi`.
- **On request:** `--include` takes `repo-rules`, `github`, `utcp` or `env`. They add the `repo-rules` folder, `.github`, `.utcp_config.json` and `.env`.
- **Secrets:** linking `.env` shares the checkout's secrets with every tool in the project. The plan warns you before you approve it.

The link shape decides how each folder is linked:

- **`whole`:** each folder becomes one link to the checkout where it can.
- **`merge`:** the folder stays a real folder, and each entry inside it becomes its own link.
- **`auto`:** picks per folder, as described below.

With `auto`, a folder your project already has stays a real folder. Each entry inside it becomes its own link, and your own files there stay untouched.

A folder your project lacks becomes one link. The exception is a folder that holds a link to a sibling folder, such as `.skilled` (its `specs` link) or `.claude` (its `skills` link). The engine builds that folder entry by entry instead.

### Keep the Links Out of Git

Most links point at your machine's checkout, so never commit them. `link` writes an ignore line for each of those to `.git/info/exclude`. Git reads that file but never commits it. Pass `--ignore gitignore` to write `.gitignore` instead.

One link is different. When your project has its own `specs/` folder, `.skilled/specs` links to it with a relative path. That link works on any machine, so it receives no ignore line and you can commit it.

### Undo a Link

Each `link` run ends by printing its undo command:

```
node .skilled/commands/doctor/scripts/symlink-engine.cjs unlink --run <run dir> --dry-run
```

`/doctor:symlink unlink --run <run dir>` does the same. Drop `--dry-run` to run it for real. Unlink removes only what that run created. It restores only what that run replaced, and it removes the run's ignore lines. After several `link` runs, undo the newest first.

> **Context saves.** `/speckit:save` records your session's progress in the `specs/` folder of the repo you run it from. Run `/doctor:setup` and every save from your project, not from the checkout.

---

## 4. COPY IT INTO YOUR PROJECT

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

A re-pin copies `.skilled` and the runtime folders. It never copies a root file such as `AGENTS.md`, so your project's version survives. Each upstream change it skips prints as a `not-copied` line. Copy those over by hand if you want them. A top-level link, such as `specs`, is skipped without a line.

A re-pin refuses to start when someone edited a file in place that no overlay owns, because the new copy would erase that edit. The refusal names the file. Move the edit into an overlay or add the path to the manifest's `repin.exclude` list. You can also restore the file from your pin.

### Undo a Re-Pin

Each live run saves a backup in `skilled-overlays/repin-runs/<run-id>/` and prints the run id. Undo it with:

```
/doctor:overlay repin --rollback <run-id>
```

Rollback restores every backed-up file byte for byte. It removes the files the run added and sets the old pin back. Run `/doctor:overlay status` afterwards to confirm.

### Bring an Existing Overlay Folder

Already keep overlays with a script of your own? The engine reads the same manifest and state files, so the folder stays where it is. Name it in `.skilled-overlays.json` and run `status`. Each line names its fix. The overlays reference has the full [adoption steps](.skilled/skills/system-skilled-doctor/references/overlays.md#6-adopting-the-engine-with-existing-overlays).

---

## 5. KEEP IT HEALTHY

| When | Linked project | Copied project |
| --- | --- | --- |
| **After a `git pull` in the checkout** | Run `/doctor:symlink check --root <dir>`. Run `link` again if it lists missing entries | No action until you re-pin |
| **To adopt a new Skilled release** | The `git pull` already adopted it | Run `/doctor:overlay repin` |
| **When something looks wrong** | Run `/doctor:setup` in your project | Run `/doctor:overlay status`, then `/doctor:setup` |
| **To find the right command** | Run `/doctor:helper` and describe the problem | Same as linked |

---

## 6. TROUBLESHOOTING

| You see | Cause | Fix |
| --- | --- | --- |
| `partial-merge` in `/doctor:symlink check` | The checkout gained entries since your last `link` | Run `link` again |
| `no overlay manifest at skilled-overlays/overlay-manifest.json` | The engine found no overlay folder | Create one (section 4, step 2), or name yours in `.skilled-overlays.json` |
| `overlay-edited` | An overlay changed and the copy lags behind | Run `/doctor:overlay apply` |
| `live-edited` | Someone edited the copy directly | Run `/doctor:overlay apply --capture <path>` |
| `both-changed` | The overlay and the copy both changed since the last apply | Read both, update the overlay by hand and run `status` again |
| `upstream-moved` | The pin moved, and the file matches neither the old copy nor your overlay | Update the overlay to fit the new upstream file and run `status` again |
| `refusing to inspect a protected path` | An overlay walks a file with `token` in its name | Add that file to the overlay's `protectedPaths`, as the line says |
| `refuse: unowned <path> differs from the old pin` | Someone edited a file in place that no overlay owns | Move the edit into an overlay, or restore the file from your pin |
| A held `.build-lock` | Another `apply` is running, or one crashed | Once no run is active, delete the lock file the message names |

---

## 7. RELATED DOCUMENTS

- [system-skilled-doctor README](.skilled/skills/system-skilled-doctor/README.md): every doctor command in this guide.
- [Overlays reference](.skilled/skills/system-skilled-doctor/references/overlays.md): sync states, refusals, re-pins and adoption in full.
- [overlay-guard README](.skilled/hooks/overlay-guard/README.md): the hook that protects overlay-owned files.
- [Root README](README.md): what Skilled is and what each part does.
- [Code Mode install guide](.skilled/skills/mcp-code-mode/INSTALL-GUIDE.md): the manual Code Mode setup.
