---
title: "v4.0.0.0, Fewer Skills, Safer Paths"
trigger_phrases:
  - "v4.0.0.0 release notes"
  - "v4 changelog"
  - "fewer skills safer paths"
  - "what changed in v4"
---
# v4.0.0.0, Fewer Skills, Safer Paths

This release is about shape. Skill after skill stopped standing alone and folded into a parent that routes you to the one small piece you need. The deep loops, the CLI executors, the doc authoring, the code skill, the design surface and the MCP bridges all took the same form: a thin parent and a mode per job. Where a monolith once hid a 28KB command or a 3,000-line template, a router now hands you the slice that fits.

The failure paths got the same care. Executors refuse to start unless their own binary is installed. Git stops and asks before a push, a mass delete or a misnamed branch. Terminal proof, showing evidence before you claim a result, is now written into every governing section instead of living as a side protocol.

Most of this does not change how you call the system. The `/deep:*`, `/create:*`, `/design:*` and `/speckit:*` families and the agent names behave as before. Two things you may have leaned on are gone for good. The memory database behind `memory_search` and `memory_save` was retired, and a lexical trigger index plus ripgrep took its place behind `/speckit:search`. The `/interface:*` commands became `/design:*`. A few other names changed and the specs folder moved to a new root, but a symlink and a deliberately tolerant gate keep the old paths alive while you catch up.

---

## What's New at a Glance

- **One shape for every skill.** Six hubs now route to modes. Fewer slash commands, one place to maintain and cleaner routing for the AIs that pick them.
- **Specs at the top level.** Your spec paths move to a physical `specs/` folder. A compatibility symlink keeps every old `.opencode/specs/...` reference working.
- **The memory database is gone.** `memory_search`, `memory_save`, the spec-memory MCP server and its daemon were decommissioned. A committed trigger index and ripgrep recipes answer `/speckit:search`, and the spec kit writes its own continuity.
- **A spec kit that tells the truth.** The runtime was renamed and nested under `runtime/cli/`. The completion gate returns one verdict everywhere with forty registered rules. Acceptance criteria and a goal file joined the packet contract. Three research rounds cut the kit back to what a machine reads, and every finding they recorded was closed.
- **Your edits stay yours.** Reindexing and the daemon's startup scan no longer write auto-fixes or trim content back into documents you wrote.
- **Deep loops, one home.** Research, review, ai-council, agent-improvement and the two benchmarks run as one `system-deep-loop` skill with six `/deep:*` commands.
- **Loops run on any model, in parallel.** A deep loop dispatches to Codex, Devin, Cursor, Pi, OpenCode or Claude Code, and fans several out at once for independent perspectives.
- **Every run replayable.** A typed evidence ledger is the authoritative record for every loop mode. Runs replay from it, every state transition is authorized, and the legacy files are projections of it.
- **Executors that only run when installed.** Codex, Devin, Cursor and Pi show up as routable only when their binary is present, so a missing tool never fails halfway through a run.
- **Pi hosts the framework natively.** `cli-pi` gained bridges for the repo's skills, commands, agents, MCP servers and hooks. It is the deepest runtime integration of the six.
- **Design becomes a hub.** `sk-design` went from one skill to a parent of four modes. Fundamentals decides values for any laid-out surface, the md generator measures a live site into a Style Reference, and chart and diagram moved in from sk-doc under `/design:*`.
- **Docs that make anything.** A git-free before-and-after diff, repo-rule authoring and plain-English output join the terminal under `/create:*`. Diagrams across 27 types and charts across 26 forms arrive under `/design:*`.
- **One code skill, two axes.** Code guidance is scoped to what you are doing and to the stack you are doing it on, with review as a first-class mode and Rust as a first-class language.
- **Safer git.** Every commit lands in your IDE checkout on its own. Push, mass-delete and branch-name paths now stop and ask.
- **One prompt skill.** Prompt work lives in `sk-prompt`, a standalone skill with seven frameworks behind `/prompt:improve`. The long run of renames finally settles.
- **Every bridge, one hub.** The browser, ClickUp, Notion, design references, MagicPath and your Obsidian vault all hang off a single `mcp-tooling` skill with nine modes.
- **Goals in OpenCode, Cursor and Pi.** A goal you set carries the same weight in those three runtimes, stored per workspace instead of as one global singleton. The working agent resends the parent goal whenever its durable slice changes.
- **CI that catches drift at commit time.** The pre-commit hook runs the same six mirror checks CI runs, the workflow fires on every mirror source, and the Dependabot backlog on the default branch went to zero.
- **A tidier advisor.** The skill advisor got structural workspace anchoring, a CLI front door and a launcher that starts under Codex on the Node its native SQLite module was built for.

---

## One Shape for Every Skill

You feel this change everywhere. Most of the framework's skills stopped standing alone. Where there used to be a scatter of separate skills, one per workflow, one per stack, one per tool, there is now a small set of parent hubs. Each hub is a thin router. It reads what you asked for and hands the request to a mode, and each mode keeps its own behavior underneath.

Six families made the move: code, documentation, design, the deep loops, the MCP bridges and the external CLIs. Prompt craft stayed a single standalone skill because it never needed a second mode. The reasons are practical:

- **One place to maintain** instead of a dozen near-duplicate homes.
- **No slash-command bloat.** A mode does not need its own command to exist.
- **Cleaner routing for the AIs** that pick skills. Each domain presents one identity to match against instead of five look-alikes.
- **Easier to iterate.** You change one mode without disturbing its neighbors.

None of this was hand-assembled. sk-doc's `create-skill-parent` tooling stamps out each hub's router, modes, README and drift check the same verifiable way, so the six merges followed one recipe. The sections below are organized around those hubs. Each tells you what its family gained without re-explaining the shape.

---

## Spec Kit

The spec kit changed the most under the surface. The memory database that powered `memory_search` was retired outright. The specs folder moved. The runtime was renamed and nested. The completion gate was made coherent, and three research rounds then cut the kit back to what a machine reads. Most of the depth is in what left: an entire retrieval engine replaced by two small lexical tools.

#### Specs Move to the Top Level

Your spec paths have a new root. The specs folder moved from `.opencode/specs/` to a physical top-level `specs/` directory, so canonical spec paths are now `specs/...`. This is a breaking change, but the old location still resolves through a compatibility symlink, so anything still pointing at `.opencode/specs` keeps working while you catch up.

&nbsp;

#### The Memory Database Retired

The Spec-Kit Memory engine is gone. The SQLite database, the embedder, the spec-memory MCP server, its daemon and the `memory_search` and `memory_save` tools were decommissioned end to end, first on a side branch and then landed on the release branch and `main`. What replaced them is deliberately small. A committed trigger index is generated from every document's `trigger_phrases` frontmatter. A lookup script reads it with no daemon. A set of ripgrep recipes handles free text. All of it sits behind `/speckit:search`, and the kit's own context writer handles continuity. Retrieval is lexical now, and a miss is a clean no-hit rather than a degraded guess. The debt the decommission left, from dangling registrations to a package that still called itself an MCP server, was closed across six review passes.

&nbsp;

#### The Runtime Renamed and Nested

The surviving package no longer carries an identity it lost. Its engine lives at `.opencode/skills/system-spec-kit/runtime/cli/`. You will find `spec/validate.sh`, `spec/create.sh`, `spec/repair-derived.cjs` and `spec/recommend-level.sh` for the packet lifecycle, `continuity/` for saves, `spec-folder/` for generated metadata and `retrieval/` for the trigger index. The old `scripts/` and `mcp-server/` paths are gone, so anything you pinned to them needs repointing. A shared package underneath carries the Gate-3 classifier and the frontmatter parser that every other skill now imports rather than copies.

&nbsp;

#### A Completion Gate That Tells the Truth

The gate that decides whether a packet may close now returns the same verdict whatever the environment, counts one fault once and no longer asks a packet for what it cannot satisfy from inside itself. Forty rules are registered. A warning is advice and does not fail a run. Two documents joined the packet contract. `acceptance-criteria.md` decides closure at Levels 2 and 3, and an optional `goal.md` holds the durable directive you set as the session objective. A repair tool fixes the facts a packet records wrongly but a machine can recompute, such as its folder, level and generated fingerprints. It refuses to invent the facts only a person can write.

&nbsp;

#### Reindexing Stops Rewriting Your Edits

A force reindex could write its own auto-fixes, including destructive content trimming, back into your tracked source documents. That is the last thing a "fix it up" operation should do. Write-back is now gated on where the indexing originated, so an automated pass cannot reach into a document you wrote. The same gap was closed in the daemon's startup scan and file watcher.

&nbsp;

#### Three Rounds of Simplification, Every Finding Closed

With the database gone, three research rounds ran over the kit to find what no longer earned its place: the search system, CLI runtime utilization, the shared package, the template and acceptance-criteria system and plain overengineering. Twenty-two remediation children shipped from them. They removed the CLI package residue and dead flags, the dead half of the shared package, orphaned decommission paths and a stale command surface, and they realigned templates, doctor signals and playbook paths with the runtime. A follow-up program then closed every finding those rounds had recorded rather than fixed, sixteen children in one day. Nothing from the research survives as a written-down decision.

&nbsp;

#### Smaller Templates, Same Output

The spec, plan, tasks and implementation-summary templates were consolidated into one shared core with level-gated addenda. The source dropped to 1,275 lines across four core templates without changing a single rendered byte. The research template shrinks by level too, so a Level 1 spec gets a short research doc instead of the full one. You see smaller, level-appropriate templates. What they produce is identical.

&nbsp;

#### CI Catches Drift at Commit Time

For days, every push mailed the operator a "runs failed" notice because a regenerated prompt mirror was never staged, and the pre-commit hook ran one of the six mirror checks CI runs. Now the hook runs all six and blocks any unstaged change under a generated mirror. The Spec-Kit Check workflow fires on every mirror source and every mirror output, so drift surfaces on the commit that caused it. The four workflows red since the shared-parser adoption were fixed, and the forty-four open Dependabot alerts on the default branch were brought to zero.

---

## The Skill Advisor

The skill advisor decides which skill should answer a request. It was already standalone before this release, with a skill-graph backbone and a fast warm path from earlier work. Its v4 changes are narrower and quieter. Workspace anchoring got stricter, the skill graph was tidied and it launches cleanly under Codex.

#### Stricter Workspace Anchoring

The advisor had been leaving litter in spec folders, writing its `.advisor-state` next to whatever directory a session happened to run from. Two changes pull that back toward the repo root: a shared anchored root resolver, and a switch from the old specs-only deny-list to a structural boundary that hoists state above the outermost `.opencode`. The skill graph was tidied in the same pass. Its metadata now points at the tracked source file, a one-identity ingestion hole was closed and a read-only freshness panel shows you whether the compiled graph is current.

&nbsp;

#### Codex Starts the Advisor

Codex sessions now launch the advisor under the Node runtime whose ABI matches the installed native SQLite module, so the advisor initializes instead of aborting the whole MCP startup cascade. Code mode keeps its own independent runtime pin.

---

## Documentation as a System

The doc skill grew up. Where one monolithic skill once did everything, a lean parent hub now hands each job to a small, self-contained packet, and two new authoring surfaces joined the family. Most of the change is internal, but a few command names and the repo's naming convention changed, so a couple of things you type are different.

#### Parent Skills, Nested Modes and the Tool That Builds Them

Two shapes of skill exist now. A standalone skill is one identity with one job. A parent skill holds no logic of its own. It reads what you asked for and dispatches, through a `mode-registry.json`, to one of its nested modes, keyed by a `workflowMode`. A mode is one of two kinds: a workflow packet that does work, or a read-only surface packet that only supplies evidence. `sk-doc` is the worked example. The parent routes to fourteen nested `sk-create-*` workflow packets (`sk-create-skill`, `sk-create-readme`, `sk-create-agent`, `sk-create-diff`, `sk-create-changelog`, `sk-create-repo-rule`, `sk-create-quality-control` and the rest), twelve of them bound to their own `/create:*` command.

`sk-doc` is also where the shape itself comes from. Its `sk-create-skill` mode scaffolds both kinds. `/create:skill` stamps out a standalone skill, and `/create:skill-parent` stamps out a parent wired to its nested packets: the `mode-registry.json` and `hub-router.json` router files, the packets, the README, the agent mirrors and a routing-drift check that keeps the registry honest against the code. Every parent skill in this release was scaffolded the same verifiable way from this tooling.

A few names you type changed. Four `/create` commands were renamed to match their packet (`sk-skill` became `skill`, `folder_readme` became `readme`, and so on). The quality packet is `sk-create-quality-control`, and the old `/doc:quality` command is gone. The authoring agent is now `@markdown`, formerly `@create`. The `/create:*` command family itself is untouched.

&nbsp;

#### Two New Ways to Author

- **`sk-create-repo-rule`** writes, revises and retires the repo-local rule files that `REPO RULES.md` routes to. Reach it through `/create:repo-rule`.
- **`sk-create-diff`** compares a before-and-after document without git and produces a self-contained, shareable HTML report, so you can review an edit even when the file lives outside version control.

&nbsp;

#### Kebab-Case Is Now the One Name

The repo settled on kebab-case as its single filesystem naming form and retired the older underscore convention. In-scope folders, files and scripts were renamed, a guard refuses new snake_case names and a reviewable rename-and-reference toolchain keeps the migration honest. If you had a script or path pinned to an old underscore name, update it.

&nbsp;

#### Benchmarks, One Way

Benchmark authoring has a single home in `create-benchmark`, and every run lands in one dated folder grammar under `benchmark/reports/`. Two things to know. Benchmark result paths moved to the new grammar, and `run-skill-benchmark.cjs` now exits with code 3 on structural or registry blocks instead of 0, so a blocked benchmark can no longer read as a passing one.

---

## The Deep Loops, Unified and Extended

The deep loops finished collapsing into a single home and learned to run on any model you name, several at a time. The hub and its backend are one skill. The loops fan out across every CLI. Underneath, a new evidence-ledger runtime landed dark, proved parity and then, under an operator-ratified flip, became the authoritative record for every mode.

#### One Skill, Hub and Backend Together

The workflow hub and the runtime it ran on are one skill, `system-deep-loop`. Every downstream reference (commands, agents, READMEs, hooks, advisor routing) was repointed at the new home. The modes you already use behave as before: research, review, ai-council, agent-improvement and the model and skill benchmarks. During the merge the deep router agent was renamed `deep` to `deep-loop`, then retired with its routing folded into the `/deep:*` command bodies, so there is no router agent left to call. What changed is the address. The `deep-loop-workflows` and `deep-loop-runtime` skill identities no longer exist, so anything you script that still names one of them now points at a signpost that is not there. An alignment mode was built during the cycle and removed before release.

&nbsp;

#### One Loop, Every Model, In Parallel

The deep loops stopped being tied to a single model. Any loop can run on whichever executor you name, and a fan-out can run several at once.

- **Every CLI is a first-class executor.** A loop dispatches native or to any of the six external CLIs: `cli-opencode`, `cli-codex`, `cli-devin`, `cli-cursor`, `cli-pi` and `cli-claude-code`. Put GPT behind Codex, GLM behind Devin, Composer behind Cursor, DeepSeek behind Pi, and mix them freely.
- **Fan-out runs them in parallel.** Point one loop at several executors and it spawns a lineage per executor in a capped concurrency pool. A research or review pass gathers independent model perspectives at once instead of one after another.
- **Hardened dispatch.** Each lineage's writes are contained, every iteration records which agent ran on which route, and the CLI adapters were stress-tested and repaired to parity. A fan-out is reproducible, and the executor you name is the one that runs.
- **A closed roster per executor.** Each CLI kind carries an enforced model allowlist, so an off-roster id fails at dispatch instead of quietly landing on a default.

Codex and Devin were revived and Cursor and Pi brought up new to make this real, so the whole roster is available to the loops.

&nbsp;

#### A New Evidence Ledger, Now Authoritative

The deep loops grew a new spine, and by the end of the cycle it became the record. A research program of 178 recommendations across the loop family converged on a single architecture, an append-only ledger with a few load-bearing parts:

- a typed, append-only event ledger as the single record of what happened
- a fail-closed gateway that authorizes every state transition
- sealed reference artifacts, versioned replay fingerprints and receipts
- blinded adjudication for the judgments the loops make

Because the runtime holds live in-flight state, it could not be swapped in one move. The substrate landed the careful way: additive and dark behind compatibility adapters, proving shadow parity against the existing behavior, then cutting over one mode at a time behind a rollback window. All seven ledger modes are now on the authoritative path. The ledger is the record, the legacy files are produced by projection from it, and a fail-closed guard rejects any out-of-band write to a projected file. Every run is replayable and every transition accountable.

---

## Orchestrating Other AIs

The way the framework talks to other AI coding tools settled into one honest shape. Six separate CLI-orchestrator skills became one hub. Every executor refuses to start unless its own binary is installed. The surfaces no longer worth keeping were turned off for good.

#### One Hub for the External CLIs

The six CLI-orchestrator skills live under one `cli-external-orchestration` hub. The hub holds no logic of its own and routes to a mode per executor. The change is invisible where it counts, because the concrete executor names like `cli-opencode` keep working. Two of them stop being independently routable top-level identities, so anything that pointed at `cli-opencode` or `cli-claude-code` as standalone skills now resolves through the hub.

&nbsp;

#### Executors That Only Run When Installed

Codex and Devin are back. Cursor and Pi are new. All four join as deep-loop executors, and every one is gated fail-closed on its own binary being present, with a check like `command -v codex`, `cursor-agent`, `devin` or `pi`. A missing tool never shows up as routable or dispatchable, so it cannot fail partway through a run. This reverses an earlier quiet removal. Codex and Devin had been deprecated and stripped out, then brought back this same way, so the roster you can use now matches what is installed on your machine.

&nbsp;

#### Pi Runs the Framework Natively

Of the runtimes the framework can hand work to, Pi went the deepest. `cli-pi` is more than a dispatch target. It hosts the framework, with bridges for the whole repo surface:

- a skill-discovery bridge so Pi finds and runs the repo's own skills
- a command layer and an agent bridge
- MCP host integration and a hook-and-extension layer
- its own model registry and routing, a fan-out executor and DeepSeek V4 Flash on the roster through a flat-price gateway
- forked cache extensions, `deep-pi` and `pi-cache-optimizer`, that cut token cost with persistent per-run cost stats

Where the other executors receive a dispatched prompt and run it, Pi loads the repo's skills, commands, agents, MCP servers and hooks and runs them itself. It is the most complete runtime integration of the six. Pi also dispatches subtasks to its own native subagents by default, so a general request stays on Pi's workers unless you name a `cli-*` mode.

&nbsp;

#### Surfaces Retired

The Gemini and Copilot bridges were retired in the v3.6 cycle after the Copilot price hike and the Gemini cleanup made them not worth maintaining, and v4 carried the residual reference cleanup. `cli-gemini` and `cli-copilot` are gone from the skill tree, the advisor's scoring and hub routing. Copilot-shaped prompts now land on the nearest remaining executor, Claude Code. Only the external binaries in your home directory are left untouched.

---

## Hooks, Goals and the Runtime

The machinery behind your sessions, the goals, the hooks and the background processes that fire on every turn, learned to travel and to stay out of your way. Goals now follow you across three tools, Pi arrived with a fast input path and the whole hook layer became one browsable, switchable library.

#### Goals in OpenCode, Cursor and Pi

Your session goal means the same thing in the three runtimes that carry it. The goal system that started in OpenCode reaches Cursor and Pi through a shared core and a common active-goal store. Devin goal hooks were prototyped and then deliberately decommissioned, so Devin is not a goal target in the shipped release. Honesty was part of the port. Live capability probes recorded what each tool can do rather than what it claims, so Cursor is marked injection-only and Pi verifies at turn's end but cannot force a continuation. Goals also stopped living as one global singleton. They are stored per workspace, runtime and session, so two projects cannot see each other's goals. **Breaking:** a goal saved under the old global scheme no longer injects. It sits in a diagnostic-only state until you migrate or archive it. One late rule closes the loop between the file and your session. Whenever anything above a goal file's log changes, the working agent resends the full parent goal in chat, so the objective you pasted never drifts from the file.

&nbsp;

#### Pi's Fast Input Path

Pi's input path runs its advisor in-process rather than shelling out to a chain of separate processes, and it caches only fingerprint-backed labels. A repeat prompt resolves from a five-minute cache in about a millisecond. A brand-new prompt still pays a cold start of around 1.3 seconds, and the cache invalidates when a skill changes.

&nbsp;

#### The Hook Library, One Switch

The whole hook layer became one browsable, switchable library.

- **Assembled from source by symlink.** The `.opencode/hooks/` directory gathers every hook through 102 relative symlinks that point back to each hook's real home. A git hook lives in `sk-git`'s scripts, the advisor hook in the advisor package, and so on. It is one place to read without duplicating a line of code.
- **One switch, or twenty-two.** A master `SYSTEM_HOOKS_DISABLED` flag turns the entire cross-runtime layer off at once, with a `SYSTEM_<concern>_DISABLED` flag for each of the twenty-two concerns beneath it. The older `MK_` names are still honored as aliases.
- **See what's on, disable what you want.** The README carries a kill-switch index with every concern, its flag, aliases, default and effect. A gitignored `hook-flags.env`, copied from `hook-flags.env.example`, holds your personal defaults. Live environment values win, and a missing file fails open.

The Gate-3 spec question also stays quiet on read-only turns, and the hook reference docs moved into their owning trees. Small things, no behavior change.

---

## The Design Surface

`sk-design` was a single skill. It is now a parent hub of four modes that projects one design identity and routes you to the mode that owns the decision in front of you. Two of those modes moved in from sk-doc, one returned from a standalone life, and the values mode grew from screens to every laid-out surface. Around the hub, the chart corpus was rebuilt on a real visual register, a library of real-world styles lives on your own machine, and one transport, Open Design, leaves the building.

#### One Hub, Four Modes

The hub carries no procedure of its own. It decides which mode owns the question and hands over.

- **`sk-design-fundamentals`**, the default. It designs, builds and reviews any laid-out surface from fixed value scales: spacing, type, colour, contrast and hierarchy. That used to mean screen UI only. It now covers slide decks, printed pages and document layouts too, and adds interaction guidelines, motion principles and a WCAG review pass where the surface is a screen. It routes by alias and carries no command of its own.
- **`sk-design-md-generator`**, behind `/design:extract`. It measures a live site's real CSS into a v3 Style Reference `DESIGN.md` through an extract, write and validate pipeline, and it validates one you already have. It was a standalone skill and came back as a mode.
- **`sk-design-chart`**, behind `/design:chart`. Turn the comparison a reader needs into one of 26 catalog forms and ship it as a standalone HTML file.
- **`sk-design-diagram`**, behind `/design:diagram`. Self-contained HTML/SVG diagrams across 27 types with a skinnable editorial design system, plus ASCII and Markdown flowcharts and draw.io or Mermaid redraws.

Chart and diagram used to live under sk-doc as `sk-create-chart` and `sk-create-diagram`. They moved here, took the hub's name, and gained the routing they never had. Every form the two canvas modes ship now has a rendered screenshot kept beside its mode, so you can see a chart before you ask for it. The `/interface:*` family that preceded all this is gone.

One honest caveat. The other five hubs resolve through a compiled router contract first. This hub does not yet, so its routing is the registry and the root router alone. Joining the compiled closure is planned, not shipped.

&nbsp;

#### Charts on a Real Register

The chart corpus was brought to the shadcn visual register, with three named stock colour systems, their palette source and proof sheets checked in beside the forms. Three decisions from that work are held by checkers rather than by convention, so a form cannot drift off the register without a gate going red. A cursor-derived Style Reference became the stock chart register late in the cycle, and a fresh review of every chart packet was closed before release.

Charts also theme from your own site now. Point the chart mode at a local v3 `DESIGN.md` and `apply-design-md.cjs` derives a gated delivery palette from its measured values, both grounds included, without fetching anything or changing the stock files. Extraction stays with the md generator. Applying an extracted reference stays with the chart mode.

&nbsp;

#### A Style Library You Own

You have a design reference library on your own machine instead of behind someone else's network call. The Refero styles, each carrying four tabs, were pulled into a local token library after a 50-style pilot came back clean. Around it sits a retrieval substrate that picks a style by eligibility first, and behind that a persistent style database built on SQLite with full-text search and vector lookup, so the corpus the modes study is the one you query. The legacy default stays until you flip it yourself. The md generator also carries a private layer of procedure cards for its extraction work, each step pointing at its own card.

&nbsp;

#### Open Design Transport Removed

The Open Design MCP transport is removed end to end: its mode tree, server entry, hub references, agent and command links and live-render adapters are all gone. If you still point at it, drop the `open_design` server from your `.utcp_config.json` and stop referencing `design-generation-patterns.md`. Figma and the terminal remain your design transports.

---

## One Code Skill

For as long as it existed, `sk-code` was a single flat skill with everything in one place. This release reshapes it into one hub running on two axes, how you work and what you are working on, folds review in as a first-class mode and welcomes Rust as a first-class language. What you type to start a code task does not change. Where the pieces live and how routing decides where to look is a clean break.

#### One Hub, Two Axes

The flat skill became a parent hub, routing on two axes at once:

- **workflow modes that act:** `sk-code-quality` and `sk-code-review`
- **read-only surface packets that inform:** `sk-code-webflow`, `sk-code-opencode`, `sk-code-mobile-cli` and `sk-code-obsidian`, each carrying the shared implement, debug and verify doctrine plus its stack knowledge, with the Motion.dev animation overlay folded into webflow

The guidance you get is scoped to both what you are doing and the stack you are doing it to. Every relocated file was repointed, including a pre-commit hygiene gate that had been silently skipped. The move is breaking. The routing contract and every skill path shifted under the mode and surface packets, so anything that still points at the old flat paths must be updated.

&nbsp;

#### Review, First Class

The review skill stops being a bolt-on. `sk-code-review` was rebuilt as a stack-agnostic review baseline and folded into the hub as a mode. It works on a baseline-plus-overlay precedence model: a shared baseline of findings-first review rules, with stack-specific guidance layered on top rather than each stack carrying its own copy. It is wired across the review runtime, orchestrators, Codex agents and the advisor, so the same standard shows up everywhere you ask for one.

&nbsp;

#### Rust Joins the Code

Rust is a first-class citizen on the opencode surface. The standard docs are in place, `.rs` files and Cargo projects are detected and routing covers both child and parent-union layouts, so a Rust change surfaces the Rust guidance instead of the generic fallback. For everyone else, the same pass split 33 oversized reference documents into 104 topic-cohesive parts, so the files you load are shorter and closer to the point.

---

## Safer Git

Git is where a mistake costs the most, so this release works two sides of the same problem. Your work follows you everywhere you run, and the destructive paths stop and ask. Your IDE checkout stays current with every parallel session you spawn, while a mass delete, an accidental push and a misnamed branch each picked up a tripwire.

#### Every Commit Reaches Your IDE

Your editor reflects work you never touched in it. A trunk-following pipeline autosyncs each commit from a wrapper-launched Claude, Codex or OpenCode session onto one shared live branch, behind an environment flag, a linked worktree and installed hooks. A fast-forward follower keeps your IDE checkout current. When a background session lands work, it is already there when you look.

&nbsp;

#### Remote Push Is Curated by Default

Pushing no longer happens silently. Only `main`, `skilled/v*` releases and names you have added to an allowlist file go up without asking. Every other push needs a fresh, in-the-moment go-ahead. The rule is enforced twice, as a rule agents must follow and as a `pre-push` hook that also catches human pushes. If you have an in-flight branch that is not on the list, expect it to hit this gate on its next push.

&nbsp;

#### A Fail-Open Guard Against Mass Deletion

A single stale `git add -A` once erased 902 files, and a runaway agent can do the same. That path has a tripwire. A guard blocks any commit or push that removes more than a threshold of tracked files unless you authorize the one operation with an explicit flag. It is live for commits and ready for pushes, and it fails open when it cannot verify, so it never wedges you.

&nbsp;

#### Numbered Branch Names

Branches carry a number the tooling issues. Worktree-backed work lives at `worktrees/{NNN}-{slug}` and a dedicated worktree-less branch at `branches/{NNN}-{slug}`, each in its own sequence allocated by a locked clone-wide counter, so two sessions cannot grab the same one. Owner-first names like `<skill>/{NNNN}-{slug}` were tried mid-cycle and are now rejected by the validator. This is a breaking change. Older `wt/`-style names no longer conform, though the gate never blocks a `skilled/v*` release.

Also folded in: a command-time advisory surfaces the relevant git rule the moment a git command runs, and the GitKraken MCP is wired in for those who use it.

---

## Prompt Engineering

Prompt work stopped being spread across two skills. It lives in one standalone skill, and the long run of name changes finally settles. The only things you must do are update one command and one skill reference.

#### One Skill for Prompt Craft

`sk-prompt` is the single home for prompt work: seven frameworks, DEPTH thinking and CLEAR scoring behind `/prompt:improve`, with the `@prompt-improver` agent for the deep path. The old command was a 28KB monolith. It is now a thin router with its auto, confirm and presentation pieces split into their own files. A two-mode hub with per-model profiles was built during the cycle and folded back into this single leaf before release, so there is no `prompt-models` mode to route to. The six CLI executors each carry a lean card that delegates to the one prompt-quality contract instead of around 90 lines of duplicated quality cards.

&nbsp;

#### The Names Settle

The earlier `sk-improve-prompt` to `sk-prompt` skill rename and `@improve-prompt` to `@prompt-improver` agent rename are final. The standalone `sk-prompt-small-model` and `sk-prompt-models` skills no longer exist. The command is `/prompt:improve`.

---

## MCP Tooling

The MCP tools are the bridges that let you drive outside applications, a browser, a design reference or a notes vault, from the terminal. This release drew them together. Several separate skills became one hub with more modes and a router that routes, plus one path move you should know about.

#### One Hub for the MCP Bridges

Every bridge lives under a single `mcp-tooling` parent, so the browser, ClickUp, Notion and design tools are one skill with nine modes that reads which mode you want and routes to it. It meets the full documentation and routing standard and ships the feature catalogs, install front doors and worked examples the other parents already had. The router underneath does what its name promises, backed by a hard gate that refuses to ship if any packet routes wrong.

&nbsp;

#### Four Transports, a Browser Bridge and Notion

The hub's shelf grew:

- **`mcp-refero`**, a read-only design-reference transport that searches styles, screens and flows
- **`mcp-mobbin`**, a read-only transport for design research
- **`mcp-aside-devtools`**, a browser bridge that drives the agentic `aside` browser from its command line, with a server fallback for when the CLI is not enough
- **`mcp-notion`**, Notion workspace operations through the official server over Code Mode
- **`mcp-magicpath`**, component and design-system lookup over a `cli` manual, since its provider ships no MCP server

The design transports defer to the design-judgment skill for taste. They gather references rather than make decisions.

&nbsp;

#### Your Vault at the Terminal

`mcp-obsidian` walks your notes vault out to the terminal. One mode covers a headless notes CLI, the official app-backed CLI and a community MCP server, with a feature catalog and references for the plugins you are most likely to lean on. The work is honest about its rough edges. Title search is broken headlessly, so the mode uses content search instead, and the installed REST API exposes a different tool set than the documented server, a gap still awaiting reconciliation.

&nbsp;

#### Figma Moves Into the Hub

The one change here you may need to act on is a path move, not a removal. The `mcp-figma` skill was folded into the `mcp-tooling` parent as a transport mode. It lives at `.opencode/skills/mcp-tooling/mcp-figma/` instead of the old flat `.opencode/skills/mcp-figma/`, and it stays fully registered and routable. If you had scripts or habits pinned to the old flat path, repoint them. Nothing about how Figma work runs has changed.

---

## Agent Discipline

The operating discipline stopped being something you had to hold in your head and became something the framework states for you. The terminal-proof rule, showing evidence before you claim a result, is written into every governing section instead of living as a separate protocol to maintain. A new writing-quality section gives every runtime one place to find the rules for how an answer should read.

#### Terminal Proof Is Now the Law

The rule that a claim needs proof is no longer a separate protocol you opt into and keep in sync. It is distributed across the authorities you already follow: the Four Laws, the Verification Standards, the Blast-Radius rules, a new Final-State Verification gate, Execution Behavior and the Quick Reference. It reads as one coherent instruction rather than a standalone lifecycle block. The per-turn reminder each session shows carries a proof-over-appearance line through the existing governor chain.

&nbsp;

#### Communication Quality

Every runtime finds its cross-runtime communication rules in one place. A new Communication Quality section spells out how answers should be written: one idea per sentence, a recommendation that has to earn itself, the request restated before diving in. The deeper Codex voice spec was reconciled with four additive edits so the two documents agree. Only the new craft was lifted from the source, since most of it was already covered elsewhere.

---

## Plain-English Output

New this release, and off by default. `sk-communication` is a standalone projection layer that rewrites terse agent output, the clipped shorthand a CLI emits, into plain English without changing the canonical bytes underneath. It is not a doc mode and not on the advisor's radar. It is a separate, opt-in tool you turn on per machine.

What it does:

- Rewrites terse CLI output into readable prose while preserving the exact original, so nothing downstream that reads the canonical output breaks.
- Runs privacy-first. It picks a local or hosted rewrite model under explicit privacy and egress rules, with adapters for local engines over an OpenAI-compatible or Ollama transport.
- Wires into all six runtime surfaces, each declaring a full-projection or safe-native tier.
- Fails closed. Any error returns the exact original output, and its telemetry is content-free.
- Ships with a blind non-inferiority evaluation and a release gate that blocks a runtime's rollout without fresh evidence, plus a compatibility doctor.

Projection is off for everyone until you opt in on your own machine, one of two ways: set the `COMMUNICATION_PROJECTION_ENABLED` environment variable, or drop a git-ignored `enablement.local.json` holding `{ "enabled": true }` at the package root. Every activation path checks `isProjectionEnabled()` first, and the skill is on the advisor's route-exclusion denylist, so the recommender never surfaces it. Nothing rewrites your output until you flip that switch.

---

## Upgrade Notes

There is no single big migration. The common path still works, your spec paths resolve through a compatibility symlink while you catch up, and the new structural protections are on by default while flag-gated features stay off until you enable them. This release does close out a long chain of renames and removals, and each one is breaking wherever an old reference crosses the boundary. The concrete moves:

- **Renames to adopt.** `@improve-prompt` to `@prompt-improver`. `/prompt` to `/prompt:improve`. `/interface:*` to `/design:extract`, `/design:chart` and `/design:diagram`. `doc-quality` to `create-quality-control`. `@create` to `@markdown`. The `/create` commands `sk-skill` to `skill` and `folder_readme` to `readme`. The hook master switch `MK_HOOKS_DISABLED` to `SYSTEM_HOOKS_DISABLED`, with the old name still working.
- **Repoint what moved.** `specs` went from `.opencode/specs/` to a top-level `specs/`. The spec-kit engine went from `scripts/` and `mcp-server/` to `.opencode/skills/system-spec-kit/runtime/cli/`. `deep-loop-workflows` and `deep-loop-runtime` merged into `system-deep-loop` and the deep router agent was retired. `mcp-figma` moved under `mcp-tooling/`. The `sk-code` files and routing contract moved under its new mode and surface packets, so anything still pointing at the old flat paths must be updated.
- **Drop removed surfaces.** `memory_search` and `memory_save` are gone with the memory database, the spec-memory MCP server and its daemon. Use `/speckit:search` and the continuity writer. `cli-gemini` and `cli-copilot` are gone, and Copilot-shaped prompts route to Claude Code. Remove the `open_design` server from `.utcp_config.json` and stop referencing `design-generation-patterns.md`. The `pi-subagents` directive, the `deep-alignment` mode and the `sk-prompt-models` skill were all removed before release.
- **Changed defaults.** Pi hands subtasks to its own subagents unless you name a `cli-*` mode. Goals saved under the old global scheme no longer inject, so migrate or archive them. Only `main`, `skilled/v*` releases and names in your allowlist push without asking. New branches use the numbered form `worktrees/{NNN}-{slug}` or `branches/{NNN}-{slug}`, and owner-first names are rejected.
- **Reconcile your own skills.** This is a framework you adopt, so your own customized skills need aligning to the new skill format. The framework will not do it for you. `sk-code` ships as a parent skill, a hub over workflow modes and read-only surface packets. Either convert your single `sk-code` into that parent shape, or remove the repo's parent and keep your own single `sk-code`. `sk-git` ships as a single skill. Keep it single or promote it to a parent, whichever fits you. Most other skills are framework-internal and repo-agnostic, so leave them alone rather than over-migrating. A step-by-step guide with the decision rule, the single-to-parent procedure using `/create:skill-parent` and the validation steps lives at `sk-create-skill/references/skill/upgrading-a-skill-to-v4.md`.

---

## Internal Seams

No user-facing change in this section. It is here so you know what moved underneath.

- **Two-axis skill hubs.** `sk-code` and `sk-doc` each went from a flat monolith to a parent hub routing on workflow modes plus surface or `create-*` packets. What you type is largely unchanged. Where the pieces live and how routing decides is the clean break.
- **Deep-loop runtime merged.** The workflow hub and the backend runtime it sat over merged into the single `system-deep-loop` skill, with every downstream reference repointed. The six modes behave as before.
- **Advisor extracted to its own package.** The advisor became a standalone `system-skill-advisor` package with its own launcher and a renamed database, and every consumer was cut over to the new home.
- **CLI orchestrators consolidated.** Six CLI-orchestrator skills became one hub, and every executor refuses to start unless its own binary is installed.
- **Review folded in as a mode.** `sk-code-review` was rebuilt as a stack-agnostic baseline with stack-specific guidance layered on top, and wired across runtimes, orchestrators and the advisor so one standard shows up everywhere.
- **Proof requirement distributed.** The claim-needs-proof protocol folded into the authorities you already follow instead of living as a standalone lifecycle block.
- **Push gate enforced twice.** The push rule is both an agent rule and a `pre-push` hook that also catches human pushes.
- **Shared goal core.** Goals moved to a shared core and a common active-goal store, stored per workspace, runtime and session.
- **Shared frontmatter parser.** system-deep-loop and sk-doc import the spec-kit shared package for frontmatter parsing instead of carrying their own copies.
