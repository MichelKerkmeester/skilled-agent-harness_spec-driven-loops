# Install Skilled

This guide installs a Skilled checkout and then brings it into your own projects. Section 2 builds and checks the checkout. Sections 3 and 4 bring it into a project, by linking it or by copying it in.

From section 3 on, each step is a doctor command. A command that writes shows its plan first and waits for your yes.

&nbsp;

## 1. OVERVIEW

You can bring Skilled into a project in one of two ways. Pick one per project.

| | Link | Copy |
| --- | --- | --- |
| **How it works** | The project links to your Skilled checkout | The project commits its own copy of Skilled |
| **Updates** | One `git pull` in the checkout updates every linked project | You re-pin the copy to a newer Skilled commit |
| **Your changes** | Live in the project's own files, next to the links | Live in an overlay folder that goes back on the copy after each update |
| **Teammates** | Each one keeps a Skilled checkout | Everyone gets Skilled from the project repository |
| **Choose it when** | You work alone, or every teammate keeps a checkout | The team needs one pinned version, or you change Skilled's own files |

Linking is simpler. Choose a copy only when you need one of its two reasons.

&nbsp;

## 2. INSTALL A SKILLED CHECKOUT

### Prerequisites

You need Node.js, npm, git and a POSIX shell. Use Node 24.22.1 or a newer 24.x release, because Code Mode runs only on Node 24. Everything else also runs on 22.23.4 or 26.12.1 and newer releases on those lines.

### Clone And Build

Clone the repository and step into it:

```bash
git clone https://github.com/MichelKerkmeester/skilled-agent-harness_spec-driven-loops.git
cd skilled-agent-harness_spec-driven-loops
```

Build the Spec Kit first. The session hooks load this build, and the other two builds use its TypeScript compiler.

```bash
npm --prefix .skilled/skills/system-spec-kit install
npm --prefix .skilled/skills/system-spec-kit run build
```

Then build the Skill Advisor. The last command checks its CLI, and it answers with no daemon running.

```bash
npm --prefix .skilled/skills/system-skill-advisor/runtime install
npm --prefix .skilled/skills/system-skill-advisor/runtime run build
node .skilled/bin/skill-advisor.cjs list-tools --format json
```

Last, build the history lookup. A session handover uses it to read an earlier session's turns back. It needs no install of its own.

```bash
npm --prefix .skilled/hooks/session-handover/history run build
```

### Check The Install

Open the repository in any of the eight runtimes and run:

```
/doctor:setup
```

It checks the install without changing anything. Each failing check names one repair command. It also reports whether each runtime's prompt hook is wired, and names the repair when one is missing.

A few runtimes need one step of their own:

- **Spelling.** Codex, Cursor, Pi, DeepSeek Harness and Mistral Vibe write commands with a hyphen, as in `/doctor-setup`. Devin reaches the Spec Kit workflows through its `/system-spec-kit` skill.
- **Codex.** Codex runs a project hook only after you approve it. Open `/hooks` in a Codex session at the repository root and approve each entry it lists. A changed entry needs approving again.
- **DeepSeek Harness.** It loads the repository's guards only from the patches a run names, so start it with `--patch .dsh/patches/guards.patch.yml`.
- **Mistral Vibe.** It loads the repository's config and hooks only when you trust the checkout root.

To see the advisor route a prompt, run this. It needs `jq`.

```bash
node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"create a readme for the utils folder"}' --format json | jq -r '.data.recommendations[0].skillId'
```

It prints one skill id, such as `sk-doc`. When it prints nothing or `null`, run `/doctor:skill-advisor rebuild`.

### Meaning Matching For Commands

Out of the box, the advisor matches a request to a command by its phrases. A local embedding model alone does not turn on meaning matching: the `semantic_shadow` lane ships at weight `0`, because a measured run routed fewer prompts correctly with it on. The daemon still keeps the vectors current, so you can try it with `SPECKIT_ADVISOR_LANE_WEIGHTS_JSON='{"semantic_shadow":0.05}'`. The model runs on your own machine through Ollama.

Run the setup from the repository you are setting up:

```
/doctor:skill-advisor embedder
```

It first checks Ollama, its server and the model without changing anything. It then lists each missing step with its cost and its undo, and asks once before it acts. After your yes it starts the server, pulls the model and indexes every command. It never installs Ollama itself. When Ollama is missing, the plan prints the install command for you to run.

The model takes about 262 MB on disk and unloads after five idle minutes. The Skill Advisor install guide lists the [measured costs](.skilled/skills/system-skill-advisor/INSTALL-GUIDE.md#127-setup-route-and-cost). Meaning matching is optional. Without it, everything still works on phrases alone.

### Add Code Mode

Code Mode is the bridge your runtime uses to call external MCP tools. It builds apart from the builds above. Run:

```
/doctor:mcp install
```

It builds Code Mode when its build is missing or stale, sets up its tool manuals and registers it in seven project config files for six runtimes. Each write waits for its own approval. Add `--runtime <name>` to register one runtime only: `opencode`, `claude`, `codex`, `cursor`, `pi` or `devin`.

To check Code Mode later, run `/doctor:mcp debug`. It reports PASS, WARN or FAIL per check, and `--fix` adds guided repair. Provider keys live in `.env`, which only Code Mode reads. Section 1 of the [environment example](.env.example) lists them. An agent cannot read that file, because the [dotenv guard](.skilled/hooks/env-secret-guard/README.md) refuses it. The [Code Mode install guide](.skilled/skills/mcp-code-mode/INSTALL-GUIDE.md) covers the manual steps.

### Git Hooks

Your first AI session in the checkout installs the repository's git hooks. To install them by hand, run:

```bash
bash .skilled/scripts/install-git-hooks.sh
```

The [Git Hooks](README.md#git-hooks) section of the README says what each hook blocks. `/doctor:git setup` checks the hooks and the sk-git settings.

Your checkout is ready once `/doctor:setup` passes. Run it again whenever something looks wrong.

&nbsp;

## 3. LINK IT INTO YOUR PROJECT

### Step 1: Print Your Steps

Open your Skilled checkout in your runtime and run:

```
/doctor:install
```

It asks four questions in one prompt:

1. **Target repo:** the absolute path of your project.
2. **Runtimes:** the AI tools you use, from `claude`, `opencode`, `codex`, `cursor`, `devin` and `pi`.
3. **Link shape:** choose `auto`. [What Gets Linked](#what-gets-linked) explains the shapes.
4. **Instruction file:** `embed` adds the shipped sections to your project's own `AGENTS.md` and leaves a one-line `CLAUDE.md` that points to it, because Claude Code reads only `CLAUDE.md`. `link` points `AGENTS.md`, `CLAUDE.md` and `REPO RULES.md` at the checkout's copies.

<!-- readme-check
allow-ref CLAUDE.md | the instruction file in the operator's target repo, which this checkout does not ship
-->

The command writes nothing. It prints the steps below with your paths filled in.

### Step 2: Run The Printed Steps

| Step | Command | Run it from | What it does |
| --- | --- | --- | --- |
| 1 | `/doctor:symlink link --root <dir> --runtimes <list> --mode auto` | the checkout | Links `.skilled` and your runtime folders into the project |
| 2 | `/doctor:agents-md embed --root <dir>` | the checkout | Adds the shipped sections to your `AGENTS.md`. Skip it if you chose `link` |
| 3 | `/doctor:mcp install` | the checkout | Builds and registers Code Mode |
| 4 | `/doctor:git setup` | your project | Checks the git hooks and sk-git settings |
| 5 | `/doctor:skill-advisor embedder` | your project | Sets up meaning matching for commands |
| 6 | `/doctor:setup` | your project | Confirms the whole setup works |

If you chose `link` for the instruction file, step 1 also carries `--link-instructions` and step 2 drops out. After step 4, `/doctor:git standards` writes your project's own commit, PR and branch rules. Until you run it, the shipped rules apply.

Run `/doctor:setup` and every `/speckit:save` from your project, not from the checkout. A save records progress in the `specs/` folder of the repository it runs in.

### Step 3: Check The Links

```
/doctor:symlink check --root <dir>
```

Each folder should read `linked-whole` or `linked-merge`. A folder that reads `partial-merge` lacks entries the checkout gained since your last `link`. Run `link` again to add them.

### What Gets Linked

`.skilled` is always linked. Each runtime you pick adds its own folder, and `claude` also adds `.mcp.json`. `--include` adds extras on request: `repo-rules`, `github`, `utcp` or `env`, for the repo rules folder, `.github`, `.utcp_config.json` and `.env`. Linking `.env` shares the checkout's secrets with every tool in the project, and the plan warns you before you approve it.

The link shape decides how each folder is linked. `whole` makes each folder one link to the checkout. `merge` keeps a real folder and links each entry inside it. `auto` picks per folder. A folder your project already has stays real, and your own files in it stay untouched. A folder your project lacks becomes one link, unless it holds a link to a sibling folder, such as the `specs` link inside `.skilled`. That folder is built entry by entry instead.

### Keep The Links Out Of Git

Most links point at your machine's checkout, so never commit them. `link` writes an ignore line for each one to `.git/info/exclude`, which git reads but never commits. Pass `--ignore gitignore` to write `.gitignore` instead.

One link is different. When your project has its own `specs/` folder, `.skilled/specs` links to it with a relative path. That link works on any machine, so it gets no ignore line and you can commit it.

### Undo A Link

Each `link` run ends by printing its undo command:

```
node .skilled/commands/doctor/scripts/symlink-engine.cjs unlink --run <run dir> --dry-run
```

It shows what the undo would remove and writes nothing. To run it, use `/doctor:symlink unlink --run <run dir>`, which shows the same plan and asks before it writes. Unlink removes only what that run created, restores only what it replaced and removes its ignore lines. A path that changed since the run is skipped and reported.

&nbsp;

## 4. COPY IT INTO YOUR PROJECT

A re-pin replaces your copy whole with a newer commit, so a change made in the copy would be lost. Each change lives in an overlay instead. An overlay is a file in your project's overlay folder, and `/doctor:overlay` applies it on top of the copy.

<!-- readme-check
allow-ref skilled-overlays/overlay-manifest.json | the manifest path the engine names in its error, in a project that copies Skilled in
allow-ref .skilled-overlays.json | the optional overlay folder setting in a project that copies Skilled in, which this checkout does not ship
allow-ref ../my-overlays | an example sibling overlay folder in a project that copies Skilled in
allow-ref framework/ | the layout folder inside a project's overlay folder, which this checkout does not ship
allow-ref root/claude/settings.json | an example layout path inside a project's overlay folder
-->

### Step 1: Create The Copy

Export `.skilled` and the runtime folders you use from one commit of your checkout:

```bash
cd /path/to/skilled
git archive <commit> .skilled .claude .opencode | tar -x -C /path/to/your-project
```

Commit the result in your project. The commit you exported is your pin.

### Step 2: Create The Overlay Folder

The engine looks for `skilled-overlays/` at the root of your project. To use another folder, add `.skilled-overlays.json` at the root, for example `{ "overlayDir": "my-overlays" }`. The setting can also name a folder beside the copy, such as `{ "overlayDir": "../my-overlays" }`. That works only when one git repository holds both, for example with the copy in a subfolder of the repository, or when the copy is in no git repository. A folder outside the repository stops every `/doctor:overlay` command with exit 2.

The folder holds `overlay-manifest.json` and your overlay files. This manifest replaces one Skilled file and adds a folder of team commands:

```json
{
  "pin": { "commit": "<the commit you exported>", "checkout": "/path/to/skilled" },
  "overlays": [
    {
      "id": "commit-template",
      "scope": "file",
      "source": "framework/skills/sk-git/assets/commit-message-template.md",
      "destination": ".skilled/skills/sk-git/assets/commit-message-template.md"
    },
    {
      "id": "team-commands",
      "scope": "directory",
      "source": "framework/commands/team",
      "destination": ".skilled/commands/team"
    }
  ]
}
```

`source` is where your version lives, inside the overlay folder. `destination` is the path in the copy that the overlay owns. Put each source at its layout path, so a teammate can find the overlay for any file. A destination under `.skilled/` goes under `framework/` with `.skilled/` dropped. Any other destination goes under `root/` with its leading dots dropped, so `.claude/settings.json` goes at `root/claude/settings.json`. A source elsewhere still works, but `status` prints a `LAYOUT` line for it until you run `/doctor:overlay apply --relayout`. The pin's `checkout` names your local Skilled checkout, so the engine can read the pinned files. Save your version of each file at its `source` path.

### Overlay Types

| `scope` | What the overlay does |
| --- | --- |
| `file` | Replaces one file with your version |
| `directory` | Keeps a folder equal to your folder |
| `marked-section` | Keeps your block between two marker lines in a Skilled file |
| `json-entry` | Changes named keys in a Skilled JSON file |
| `skill-root` | Replaces a whole skill folder with yours |
| `remove-root` | Removes named Skilled paths from the copy |

Most projects need only `file` and `directory`. The [overlay guide](.skilled/skills/system-skilled-doctor/references/overlays.md) covers the rest, along with the optional `regenerate`, `verifyGenerated` and `repin` blocks.

### Step 3: Apply The Overlays

Check what is out of sync:

```
/doctor:overlay status
```

A new overlay reads `overlay-edited`, because the copy does not have it yet. Apply it:

```
/doctor:overlay apply
```

`apply` shows the status report as its plan and writes after your yes. Run `status` again, and it ends with `RESULT: PASSED`. Commit the overlay folder and the copy together. A second `apply` changes nothing.

### Change An Overlay

Edit the file in the overlay folder, never in the copy. Then run `apply`.

When someone edits the copy directly, `status` reports the file as `live-edited` and `apply` refuses to write. Move the edit into its overlay:

```
/doctor:overlay apply --capture <path>
```

An AI agent is stopped sooner. The [overlay guard](.skilled/hooks/overlay-guard/README.md) refuses an agent's edit to a file an overlay owns and names the overlay file to edit instead.

### Step 4: Re-Pin To A Newer Commit

A re-pin moves your copy to a newer commit and applies your overlays again. It reads from your Skilled checkout, which must hold both your pin and the new commit:

```
/doctor:overlay repin --upstream /path/to/skilled --to <new commit>
```

1. **It stages first.** It builds the result in a temporary folder and leaves your project alone. The report lists the paths it will copy and delete, any blocked overlays and any overlays that now equal Skilled's own file.
2. **You fix the report.** Update each blocked overlay to fit the new Skilled file, and remove each overlay that now equals it. Run the command again.
3. **You approve.** The live run backs up every path it touches, copies the new files, moves the pin and applies the overlays.
4. **It checks the result.** The run ends with `RESULT: PASSED` and the new pin in your manifest. The command then names `/doctor:update record-base` as the next step, because the update base still names the old pin.
5. **You move older copies onto the layout, once.** If `status` prints `LAYOUT` lines after the re-pin, some overlay copies still sit at their older paths. Run `/doctor:overlay apply --relayout` to move them. It backs each copy up first and points the manifest at the new paths. The lines never fail `status`, so this step can wait.

A re-pin copies `.skilled` and the runtime folders. It never copies a root file such as `AGENTS.md`, so your project's version survives. Each Skilled change it skips prints as a `not-copied` line, and you copy those over by hand when you want them.

A re-pin refuses to start when someone edited a file in place that no overlay owns, because the new copy would erase that edit. The refusal names the file. Move the edit into an overlay, add the path to the manifest's `repin.exclude` list or restore the file from your pin.

### Undo A Re-Pin

Each live run saves a backup in a `repin-runs` folder inside your overlay folder and prints the run id. Undo it with:

```
/doctor:overlay repin --rollback <run-id>
```

Rollback restores every backed-up file byte for byte, removes the files the run added and sets the old pin back. Run `/doctor:overlay status` afterwards to confirm.

### Bring An Existing Overlay Folder

If you already keep overlays with a script of your own, the engine reads the same manifest and state files, so the folder stays where it is. Name it in `.skilled-overlays.json` and run `status`. Each line names its fix. Expect a `LAYOUT` line for each source that is not at its layout path. Those lines never fail `status`, and `/doctor:overlay apply --relayout` moves the sources when you want. The overlay guide has the full [adoption steps](.skilled/skills/system-skilled-doctor/references/overlays.md#6-adopting-the-engine-with-existing-overlays).

&nbsp;

## 5. KEEP IT HEALTHY

| When | Linked project | Copied project |
| --- | --- | --- |
| **After a `git pull` in the checkout** | Run `/doctor:symlink check --root <dir>`, and run `link` again if it lists missing entries | Nothing until you re-pin |
| **To adopt a new Skilled release** | The `git pull` already did | Run `/doctor:overlay repin`, then `/doctor:overlay apply --relayout` if `status` prints `LAYOUT` lines |
| **When something looks wrong** | Run `/doctor:setup` in your project | Run `/doctor:overlay status`, then `/doctor:setup` |
| **To find the right command** | Run `/doctor:helper` and describe the problem | Same as linked |

&nbsp;

## 6. TROUBLESHOOTING

| You see | Cause | Fix |
| --- | --- | --- |
| `partial-merge` in `/doctor:symlink check` | The checkout gained entries since your last `link` | Run `link` again |
| `no overlay manifest at skilled-overlays/overlay-manifest.json` | The engine found no overlay folder | Create one, as in section 4 step 2, or name yours in `.skilled-overlays.json` |
| `overlay-edited` | An overlay changed and the copy lags behind | Run `/doctor:overlay apply` |
| `live-edited` | Someone edited the copy directly | Run `/doctor:overlay apply --capture <path>` |
| `both-changed` | The overlay and the copy both changed since the last apply | Read both, update the overlay by hand and run `status` again |
| `upstream-moved` | The pin moved, and the file matches neither the old copy nor your overlay | Update the overlay to fit the new Skilled file and run `status` again |
| `refusing to inspect a protected path` | An overlay walks a file with `token` in its name | Add that file to the overlay's `protectedPaths`, as the line says |
| `refuse: unowned <path> differs from the old pin` | Someone edited a file in place that no overlay owns | Move the edit into an overlay, or restore the file from your pin |
| `refuse: the overlay lock is held` | Another run still holds the lock, or a run on another machine left it | Wait for the other run. Then run the `Next:` line the message prints, which names the pid to check with `ps -p` and the lock file to remove. A lock left by an ended run on this machine is taken over on its own |
| `LAYOUT   <overlay>: <field> <from> belongs at <to>; <remedy>` | An overlay copy sits off its `framework/` or `root/` layout path, often after a re-pin. `<field>` is `source`, `fragment` or `base` | Do what the remedy says. It is usually `/doctor:overlay apply --relayout`, run once. When `<to>` sits under `root/skilled`, change the entry's destination or remove the entry, because relayout refuses that move. The line never fails `status` |
| `does not match what apply last wrote there`, `is a link that leads outside the tree` or `is a link that does not resolve` | An unowned file, folder or link stands where an overlay now writes another shape, or a link on the path leads outside the tree or nowhere | Run the `Next:` line it prints, which moves the path aside to `<path>.keep` and applies again |
| `semantic_lane_off` in a recommendation's `warnings` | The advisor answered on phrases alone. The reason after the colon says why, such as `prompt_embedding_unreachable` when Ollama is not answering | Run `/doctor:skill-advisor embedder` from the project. If the warning stays, restart the advisor daemon, which picks its embedder at startup |

&nbsp;

## 7. RELATED DOCUMENTS

- [Doctor README](.skilled/skills/system-skilled-doctor/README.md): every doctor command in this guide.
- [Overlay guide](.skilled/skills/system-skilled-doctor/references/overlays.md): sync states, refusals, re-pins and adoption in full.
- [Overlay guard README](.skilled/hooks/overlay-guard/README.md): the hook that protects overlay-owned files.
- [Skill Advisor install guide](.skilled/skills/system-skill-advisor/INSTALL-GUIDE.md): the advisor build, its embedder and its tuning.
- [Code Mode install guide](.skilled/skills/mcp-code-mode/INSTALL-GUIDE.md): the manual Code Mode setup.
- [Root README](README.md): what Skilled is and what each part does.
