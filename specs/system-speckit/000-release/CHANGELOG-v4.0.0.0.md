# v4.0.0.0, Fewer Skills, Safer Paths

The center of this release is the shape things took. Skill after skill stopped standing alone and folded into a parent that routes to a smaller piece — the deep loops, the CLI executors, the doc authoring, the code skill, the design surface, the MCP bridges, the prompt craft. Seven hubs now share the same two-axis form: a thin parent, a mode per job. Where a monolith once hid a 28KB command or a 3,000-line template, a router now hands you the slice that fits, and it routes correctly all thirteen times out of thirteen.

Around that core, the failure paths got the same attention. Reindexing stopped rewriting documents you authored. Executors now refuse to start unless their own binary is installed. Git stops and asks before a push, a mass delete, or a misnamed branch. Terminal proof — show evidence before you claim a result — is now the law, written into every governing section instead of living as a side protocol.

None of this changes how you actually call the system. The commands you type every day — `memory_search`, `memory_save`, the `/deep:*`, `/create:*` and `/interface:*` families, the agent names — behave as before. A few names did change, and the specs folder moved to a new root, but a symlink and a deliberately tolerant gate keep the old paths alive while you catch up. The work happened in the corners and the address book, not on the path you use daily.

---

## What's New at a Glance

- **One shape for every skill** — Most standalone skills folded into parent hubs with modes — fewer slash commands, one place to maintain, and cleaner routing for the AIs that pick them.
- **Specs at the top level** — Your spec paths move to a physical `specs/` folder, and a compatibility symlink keeps every old `.opencode/specs/...` reference working.
- **Your edits stay yours** — Reindexing and the daemon's startup scan no longer write auto-fixes or trim content back into documents a human authored.
- **Search that degrades honestly** — Memory recall falls back to keyword search when embeddings are unavailable and says so, and eight held-back retrieval features were benchmarked into a graduate/refine/cut verdict.
- **Deep loops, one home** — Research, review, ai-council and improvement run as one `system-deep-loop` skill, joined by a new alignment (conformance-audit) mode — same `/deep:*` commands.
- **Loops run on any model, in parallel** — A deep loop dispatches across every CLI — Codex, Devin, Cursor, Pi, OpenCode, Claude Code — and fans several out at once for independent perspectives.
- **Executors that only run when installed** — Codex, Devin, Cursor and Pi show up as routable only when their binary is actually present, so a missing tool never fails halfway through a run.
- **Pi hosts the framework natively** — `cli-pi` gained native bridges for the repo's skills, commands, agents, MCP servers and hooks — the deepest runtime integration of the six, not just a dispatch target.
- **Docs that make anything** — Diagrams across 27 types, a git-free before/after diff, and plain-English output join the terminal through new `/create:*` commands.
- **One code skill, two axes** — Code guidance is scoped to both what you're doing and the stack, with review as a first-class mode and Rust as a first-class language.
- **Safer git** — Every commit lands in your IDE checkout automatically, while push, mass-delete and branch-name paths now stop and ask.
- **One prompt hub** — Prompt work lives under `sk-prompt` with six per-model profiles, and the long run of renames finally settles.
- **Every bridge, one hub** — The browser, ClickUp, design references and your Obsidian vault all hang off a single `mcp-tooling` skill.
- **Goals in every tool** — A goal you set now carries the same weight in OpenCode, Cursor and Pi, stored per workspace instead of as one global singleton.
- **A tidier advisor** — The skill advisor (already standalone) got stricter workspace anchoring (keeping its state out of spec folders is still in progress), launches cleanly under Codex, and its skill graph was tidied and freshened.

---

## One Shape for Every Skill

The biggest change in this release is one you feel everywhere: most of the framework's skills stopped standing alone. Where there used to be a scatter of separate skills — one per workflow, one per stack, one per tool — there is now a small set of parent hubs. Each hub is a thin router that reads what you asked for and hands it to a mode, and each mode keeps its own behavior underneath.

Seven families made the move — code, documentation, design, prompt craft, the deep loops, the MCP bridges, and the external CLIs. The reasons are practical:

- **One place to maintain**, instead of a dozen near-duplicate homes.
- **No slash-command bloat** — a mode does not need its own command to exist.
- **Cleaner routing for the AIs** that pick skills, because each domain presents a single identity to match against instead of five look-alikes.
- **Easier to iterate** — you can change one mode without disturbing its neighbors.

This isn't ad-hoc: the whole pattern is scaffolded by sk-doc's `create-skill-parent` tooling (see **Documentation as a System**), which stamps out each hub's router, modes, README and drift-check the same, verifiable way — so the seven merges this release followed one recipe rather than being hand-assembled. The sections that follow are organized around those hubs; each tells the story of what its family gained, without re-explaining the shape.

---

## Spec Kit & Memory

The memory and search engine got smarter and more honest this release, the specs folder moved to a new home, and a reindexing bug that could quietly rewrite your edits was closed. Most of the depth is in retrieval — how the system finds the right spec folder, how honestly it reports what it found, and which held-back capabilities finally earned their place.

#### Specs Move to the Top Level

Your spec paths have a new root. The specs folder moved from `.opencode/specs/` to a physical top-level `specs/` directory, so canonical spec paths are now `specs/...`. **This is a breaking change**, but the old location still resolves through a compatibility symlink left in place, so anything still pointing at `.opencode/specs` keeps working while you catch up.

&nbsp;

#### Reindexing Stops Rewriting Your Edits

A force reindex could write its own auto-fixes — including destructive content trimming — back into your tracked source documents, which is the last thing a "fix it up" operation should do. Write-back is now gated on where the indexing originated, so an automated pass can't reach into a document a human authored. The same gap was closed in the daemon's startup scan and file watcher, and the fix goes live once you restart the daemon.

&nbsp;

#### A Smarter, Honester Memory Engine

The Spec-Kit Memory engine — the retrieval behind `memory_search` and context recovery — went through a large intelligence pass:

- A new **retrieval-shape axis** lets the router read what kind of answer a query is asking for, not just its words.
- When the embedder returns nothing, recall **degrades to keyword matching** (BM25/FTS) and tells you it did, rather than throwing and handing back an empty result.
- Causal and lineage edges gained correct **bi-temporal time windows**, so the history you query stays consistent as it changes.
- A deferred **corpus reindex** restored the roughly 20-25% of rows that had gone cold or un-embedded — the precondition for recall being trustworthy in the first place.

&nbsp;

#### Dark Flags Earn Their Keep

A run of finished-but-held-back capabilities finally faced a verdict. Eight families of default-off features — the search tail-appends, retrieval-class channel weights, a true-citation ledger, save-time reconsolidation, seeded-PageRank ranking, edge-lifecycle work, the advisor's fusion seams, and deep-loop finding dedup — were each benchmarked on the real production corpus and returned a graduate, refine or cut. A parallel data-quality pass did the same across the metadata, keeping twelve flags and deleting one. No production default was flipped inside the program; graduation stays a separate, evidence-gated decision, and every measured change was proven byte-identical while off.

&nbsp;

#### Smaller Templates, Same Output

The spec, plan, tasks, and implementation-summary templates were consolidated into one shared core with level-gated addenda, dropping the source from 2,931 to 1,314 lines without changing a single rendered byte. The research template now shrinks by level too, so a Level 1 spec gets a 175-line research doc instead of a 944-line one. You see smaller, level-appropriate templates; what they produce is identical.

The rest of the area is research charters still in planning, release-readiness audits, and a long pass normalizing archived packets to the current template set — real housekeeping, but nothing that changes how you use the system.

---

## The Skill Advisor

The skill advisor — the part that decides which skill should answer a request — was already standalone before this release, with a skill-graph backbone and a fast warm path from earlier work. Its v4 changes are narrower and quieter: its workspace anchoring got stricter (though keeping its state fully out of your spec folders is still in progress), its skill graph was tidied, and it launches cleanly under Codex.

#### Stricter Workspace Anchoring (Containment Still In Progress)

The advisor had been leaving litter in spec folders — writing its `.advisor-state` next to whatever directory a session happened to run from. Two changes this release pull most of that back toward the repo root: a shared anchored root-resolver, and a switch from the old specs-only deny-list to a structural boundary that hoists state above the outermost `.opencode`. It is not fully closed, though — the hook entry point still resolves state relative to the session's own directory, so a session started from inside a spec folder can still leave a stray `.advisor-state` file behind, and the dedicated cleanup packet remains open. Separately, the skill graph was tidied: its metadata now points at the tracked source file, a one-identity ingestion hole was closed, and a read-only freshness panel lets you see whether the compiled graph is current.

&nbsp;

#### Codex Starts the Advisor

Codex sessions now launch the advisor under the Node runtime whose ABI (141) matches the installed native SQLite module, so `mk_skill_advisor` initializes instead of aborting the whole MCP startup cascade. Memory and code mode keep their own independent runtime pins.

---

## Documentation as a System

The doc skill grew up this release. Where one monolithic skill once did everything, a lean parent hub now hands each job to a small, self-contained packet, and two genuinely new authoring surfaces — diagrams and document diffs — joined the family. Most of it is internal, but a few command names and the repo's naming convention changed, so a couple of things you type are different.

#### Parent Skills, Nested Modes — and the Tool That Builds Them

Two shapes of skill exist now. A **standalone skill** is one identity with one job. A **parent skill** (hub) holds no logic of its own — it reads what you asked for and dispatches, through a `mode-registry.json`, to one of its **nested modes**, keyed by a `workflowMode`. A mode is one of two kinds: a **workflow packet** that does work, or a **read-only surface packet** that only supplies evidence. `sk-doc` is the worked example — the parent skill routes to its nested `sk-create-*` workflow packets (`sk-create-skill`, `sk-create-readme`, `sk-create-agent`, `sk-create-diagram`, `sk-create-diff`, `sk-create-changelog`, `sk-create-quality-control`, and the rest), each bound to its own `/create:*` command.

And `sk-doc` is where the shape itself comes from. Its `sk-create-skill` mode scaffolds both kinds: `/create:skill` stamps out a standalone skill, and `/create:skill-parent` stamps out a parent skill wired to its nested workflow or surface packets — the `mode-registry.json` and `hub-router.json` router files, the packets, the README, the agent mirrors, and a routing-drift check that keeps the registry honest against the code. So the seven parent skills in this release were not hand-assembled one at a time; every one was scaffolded the same, verifiable way from this tooling.

A few names you type changed: four `/create` commands were renamed to match their packet (`sk-skill` → `skill`, `folder_readme` → `readme`, and so on), the quality packet is `sk-create-quality-control` (with `/doc:quality` kept as an alias), and the authoring agent is now `@markdown` (was `@create`). The `/create:*` command family itself is untouched.

&nbsp;

#### Two New Ways to Author

Two brand-new surfaces joined the terminal:

- **`sk-create-diagram`** turns out self-contained HTML/SVG diagrams across 27 types, imports and exports draw.io and Mermaid, and is reachable through the new `/create:diagram` command.
- **`sk-create-diff`** compares a before-and-after document without git and produces a self-contained, shareable HTML report — so you can review an edit even when the file lives outside version control.

&nbsp;

#### Kebab-Case Is Now the One Name

The repo settled on kebab-case as its single filesystem-naming form, retiring the older underscore convention. In-scope folders, files and scripts across the repo are renamed, a guard refuses new snake_case names, and a reviewable rename-and-reference toolchain keeps the migration honest. If you had a script or path pinned to an old underscore name, it may need updating.

&nbsp;

#### Benchmarks, One Way

Benchmark authoring now has a single home in `create-benchmark`, and every run lands in one dated folder grammar under `benchmark/reports/`. Two things to know: benchmark result paths moved to the new grammar, and `run-skill-benchmark.cjs` now exits with code 3 on structural or registry blocks instead of 0, so a blocked benchmark can no longer read as a passing one.

---

## The Deep Loops, Unified and Extended

The deep loops finished collapsing into a single home this release, gained a new way to hold your work up against the standard it claims to follow, and learned to run on any model you name — several at a time. The hub and its backend are now one skill, a conformance-audit mode joins the family, and the loops now fan out across every CLI — with one name to watch, since two old skill identities go away. Underneath, a new evidence-ledger runtime began landing dark, so a much larger change is already underway without touching anything you run today.

#### One Skill, Hub and Backend Together

The five-mode hub and the runtime it ran on are now a single skill, `system-deep-loop`. What had been two packages — the workflow hub and the backend runtime it sat over — merged into one, with every downstream reference (commands, agents, READMEs, hooks, advisor routing) repointed at the new home. The modes you already use — research, review, ai-council and improvement — behave exactly as before, now joined by a new alignment mode. During the merge the deep router agent was renamed `deep` → `deep-loop`, then retired as dead weight with its routing folded into the `/deep:*` command bodies, so there is no router agent left to call. What changed is the address: the `deep-loop-workflows` and `deep-loop-runtime` skill identities no longer exist, so anything you script that still names one of them now points at a signpost that isn't there.

&nbsp;

#### A Conformance-Audit Mode

A new `deep-alignment` mode joins the loop family. Hand it artifacts — docs, code, designs, git history — and it audits them against the named parent-skill authority they're supposed to follow, reusing the shared deep-review reducers behind a dedicated alignment-convergence backend so it stays consistent with the loops you already know. Working adapters already cover sk-doc, sk-git, sk-design (static) and sk-code. The mode is usable today; the packet's overall closeout is still in progress.

&nbsp;

#### One Loop, Every Model, In Parallel

The deep loops stopped being tied to a single model. Any loop — research, review, alignment, improvement, council — can run on whichever executor you name, and a fan-out can run several at once:

- **Every CLI is a first-class executor.** A loop dispatches native (Opus) or any of the six external CLIs — `cli-opencode`, `cli-codex`, `cli-devin`, `cli-cursor`, `cli-pi`, `cli-claude-code` — so you can put GPT behind Codex, GLM behind Devin, Composer behind Cursor, DeepSeek behind Pi, and mix them freely.
- **Fan-out runs them in parallel.** Point one loop at several executors and it spawns a lineage per executor in a capped concurrency pool, so a research or review pass gathers independent model perspectives at once instead of one after another.
- **Hardened dispatch.** Each lineage's writes are contained, every iteration records route-proof state (which agent ran, on which route), and the CLI adapters were stress-tested and repaired to parity this cycle — so a fan-out is reproducible and the executor you name is the one that actually runs.

Codex and Devin were revived and Cursor and Pi brought up new to make this real, so the whole roster is available to the loops, not just the native path.

&nbsp;

#### A New Evidence Ledger, Running Dark

The deep loops started growing a new spine this release — and you won't feel it yet, on purpose. A large research program (178 recommendations across the loop family) converged on a single architecture, an append-only ledger with a few load-bearing parts:

- a **typed, append-only event ledger** as the single record of what happened;
- a **fail-closed gateway** that authorizes every state transition;
- **sealed reference artifacts**, versioned **replay fingerprints**, and **receipts**;
- **blinded adjudication** for the judgments the loops make.

Because the runtime holds live in-flight state, it can't be swapped in one move — so the new substrate lands additive and dark behind compatibility adapters, proves shadow-parity against the current behavior first, then takes over one mode at a time behind a rollback window, retiring the legacy writers only after telemetry shows nothing still uses them. It is non-authoritative today; the payoff, as authority moves, is that every run becomes replayable and every transition accountable.

---

## Orchestrating Other AIs

This release, the way the framework talks to other AI coding tools settled into one honest shape. Six separate CLI-orchestrator skills became one hub, every revived or new executor now refuses to start unless its own binary is actually installed, and the surfaces that were no longer worth keeping were turned off for good.

#### One Hub for the External CLIs

The six CLI-orchestrator skills now live under one canonical `cli-external-orchestration` hub: the hub holds no logic of its own and routes to a mode per executor. The change is invisible where it counts — the concrete executor names like `cli-opencode` keep working — but two of them stop being independently routable top-level identities, so anything that pointed at `cli-opencode` or `cli-claude-code` as standalone skills now resolves through the hub instead.

&nbsp;

#### Executors That Only Run When Installed

Codex and Devin are back, and Cursor and Pi are new. All four join as deep-loop executors — the peer AI tools the framework can hand work to — and every one is gated fail-closed on its own binary being present (a check like `command -v codex`, `cursor-agent`, `devin`, or `pi`). A missing tool simply never shows up as routable or dispatchable, rather than failing partway through a run. This is also a reversal of an earlier quiet removal: Codex and Devin had been deprecated and stripped out, then brought back this same way, so the roster you can actually use now matches what's really installed on your machine.

&nbsp;

#### Pi Runs the Framework Natively

Of the runtimes the framework can hand work to, Pi went the deepest this release. `cli-pi` is not just a dispatch target — it hosts the framework natively, with bridges for the whole repo surface:

- a **skill-discovery bridge** so Pi finds and runs the repo's own skills;
- a **command layer** and an **agent bridge**;
- **MCP host integration** and a **hook-and-extension layer**;
- its own **model registry and routing**, a **fan-out executor**, and DeepSeek V4 Flash on the roster;
- **custom forked cache extensions** — `deep-pi` and `pi-cache-optimizer` — that optimize prompt caching (including optional long-retention on DeepSeek-direct models) to cut token cost, with persistent per-run cost stats.

So where the other executors receive a dispatched prompt and run it, Pi actually loads the repo's skills, commands, agents, MCP servers and hooks and runs them itself — arguably the most complete runtime integration of the six, and in that sense now ahead of even `cli-opencode`. (A private, Claude-app-style mobile control plane for driving Pi from your phone is charted too — the parity research concluded it could match and, on replay fidelity and notification privacy, exceed the Claude Code remote experience — but that piece is early-stage and not yet shipped.)

&nbsp;

#### Surfaces Retired

The Gemini and Copilot bridges were retired back in the v3.6 cycle — after the Copilot price hike and the Gemini cleanup made them no longer worth maintaining — and v4 carried the residual reference cleanup. `cli-gemini` and `cli-copilot` are gone from the skill tree, the advisor's scoring and hub routing, so Copilot-shaped prompts now land on the nearest remaining executor, Claude Code; only the external binaries sitting in your home directory are left untouched.

---

## Hooks, Goals and the Runtime

This release the machinery behind your sessions — the goals, the hooks, the little background processes that fire on every turn — learned to travel and to stay out of your way. Goals now follow you across tools, the new Pi runtime arrived with a fast input path, and the whole hook layer became one browsable, switchable library.

#### Goals in Every Tool

Your session goal now means the same thing in every tool you open. The goal system that started in OpenCode now reaches Cursor and Pi too, through a shared core and a common active-goal store, so a goal you set carries the same weight wherever you work. (Devin goal hooks were prototyped this cycle and then deliberately decommissioned, so Devin is not a goal target in the shipped release.) Honesty was part of the port: live capability probes recorded what each tool can actually do rather than what it claims, so Cursor is marked injection-only and Pi verifies at turn's end but cannot force a continuation. On the way, goals stopped living as one global singleton — they are now stored per workspace, runtime and session, so two projects cannot see each other's goals. **Breaking:** a goal saved under the old global scheme no longer injects; it sits in a diagnostic-only state until you migrate or archive it explicitly.

&nbsp;

#### Pi Chooses Its Own Path

When you hand Pi a subtask, it dispatches to its own native subagents by default. Pi subagent dispatch uses `pi-subagents` unless you explicitly name a `cli-*` mode, so a general request stays on Pi's own workers rather than routing out to another model — name a `cli-*` mode when you want a specific external executor instead.

&nbsp;

#### Pi's Fast Input Path

Pi's input path runs its advisor in-process rather than shelling out to a chain of separate processes, and caches only fingerprint-backed labels, so a repeat prompt resolves from a five-minute cache in about a millisecond. A brand-new prompt still pays a roughly 1.3-second cold start, and the cache invalidates correctly when a skill actually changes.

&nbsp;

#### The Hook Library, One Switch

The whole hook layer became one browsable, switchable library:

- **Assembled from source by symlink.** The `.opencode/hooks/` directory gathers every hook through relative symlinks — around ninety-six of them — that point back to each hook's real home (a git hook lives in `sk-git`'s scripts, the advisor hook in the advisor package, and so on), so it is one place to read without duplicating a line of code.
- **One switch, or twenty.** A master `MK_HOOKS_DISABLED` flag turns the entire cross-runtime layer off at once, with a canonical `MK_<concern>_DISABLED` flag for each of the twenty concerns beneath it (old aliases still honored).
- **See what's on, disable what you want.** The README carries a kill-switch index — every concern with its flag, aliases, default and effect — and a gitignored `hook-flags.env` (copied from `hook-flags.env.example`) holds your personal defaults; live environment values win, and a missing file fails open.

Beyond those, the Gate-3 spec question now stays quiet on read-only turns, and the hook reference docs moved into their owning trees — small things, no behavior change.

---

## The Design Surface

This release, the design surface stopped being a stack of reconstructed packets and became a working system. A library of real-world styles now lives on your own machine behind a fast database, a set of `/interface:` commands turns creation into a reproducible conversation, and the hub was refactored to behave more like Claude Design — while one transport, Open Design, leaves the building.

#### A Style Library You Own

You now have a design reference library that lives on your own machine instead of behind someone else's network call. All 1,290 Refero styles — each carrying four tabs — were pulled into a local token library (about 129 MB across 7,744 files), after a 50-style pilot came back clean. Around it sits a retrieval substrate that picks a style by eligibility first, and behind that a persistent style database built on SQLite with full-text search and vector lookup, so the corpus the modes study is the one you query. The payoff is speed: generating against the full 1,290-style corpus runs about 21x faster than the old path, with the legacy default kept until you flip it yourself.

&nbsp;

#### Interface Creation Commands

Creating an interface is now a scripted conversation rather than an ad-hoc back-and-forth. A shared nine-stage contract under `/interface:*` walks you through the stages the same way every time, so a run is reproducible and gateable from the terminal. In the same pass, the ten command workflow files were brought onto the standard command vocabulary; the commands' runtime behavior is unchanged.

&nbsp;

#### A Claude-Style Hub

Under the hood, the design hub was refactored to behave more like Claude Design while keeping OpenCode's native routing and its single advisor identity. It gained a manager-style shell and a private layer of fourteen procedure cards, with each mode pointing at its own procedures. For you, nothing about how you call it changed — the modes kept their authority and routing, and the md-generator's boundary stayed put. The work closed on a conditional parity verdict, with the live and browser scenarios left for you to confirm.

&nbsp;

#### Open Design Transport Removed

One transport leaves this release. The Open Design MCP transport is deprecated and removed end to end: its mode tree, server entry, hub references, agent and command links, and live-render adapters are all gone. If you still point at it, drop the `open_design` server from your `.utcp_config.json` and stop referencing `design-generation-patterns.md`; Figma and the terminal remain your design transports.

---

## One Code Skill

For as long as it has existed, `sk-code` was a single flat skill with everything in one place. This release reshapes it into one hub running on two axes — how you work and what you're working on — folds review in as a first-class mode and welcomes Rust as a first-class language. What you type to start a code task does not change, but where the pieces live and how routing decides where to look is a clean break.

#### One Hub, Two Axes

The flat skill became a parent hub, routing on two axes at once:

- **workflow modes that act** — `sk-code-quality` and `sk-code-review`;
- **read-only surface packets that inform** — `sk-code-webflow` and `sk-code-opencode`, each carrying the shared implement → debug → verify doctrine plus its stack knowledge (with the Motion.dev animation overlay folded into webflow rather than standing alone).

So the guidance you get is scoped to both what you're doing and the stack you're doing it to. All 128 relocated files were repointed — including a pre-commit hygiene gate that had been silently skipped — and a deterministic router benchmark rose from 44 to 71. The move is a breaking one: the routing contract and every skill path shifted under the mode and surface packets, so anything that still points at the old flat paths must be updated.

&nbsp;

#### Review, First Class

The review skill stops being a bolt-on. `sk-code-review` was renamed and rebuilt as a stack-agnostic review baseline, then folded into the hub as a mode. It now works on a baseline-plus-overlay precedence model: a shared baseline of findings-first review rules, with stack-specific guidance layered on top rather than each stack carrying its own copy. It is wired across the review runtime, orchestrators, Codex agents and the advisor, so the same standard shows up everywhere you ask for one. One caveat survives: the doc validators still reject the skill's hyphenated name.

&nbsp;

#### Rust Joins the Code

Rust is now a first-class citizen on the opencode surface. The standard docs are in place, `.rs` files and Cargo projects are detected, and routing covers both child and parent-union layouts, so a Rust change surfaces the Rust guidance instead of the generic fallback. Six registration touchpoints were wired and verified with a fail-closed router replay. For everyone else, the same pass split 33 oversized reference documents into 104 topic-cohesive parts, so the files you load are shorter and closer to the point.

---

## Safer Git

Git is where a mistake costs the most, so this release works two sides of the same problem: your work now follows you everywhere you run, and the destructive paths now stop and ask. Your IDE checkout stays current with every parallel session you spawn, while the paths where a single bad command could erase or leak work — a mass delete, an accidental push, a misnamed branch — each picked up a tripwire.

#### Every Commit Reaches Your IDE

Your editor now reflects work you never touched in it. A trunk-following pipeline autosyncs each commit from a wrapper-launched Claude, Codex, or OpenCode session onto one shared live branch, behind three checks (an environment flag, a linked worktree, and installed hooks), and a fast-forward follower keeps your IDE checkout current. So when a background session lands work, it is already sitting there when you look.

&nbsp;

#### Remote Push Is Curated By Default

Pushing no longer happens silently. Only `main`, `skilled/v*` releases, and names you have added to an allowlist file go up without asking; every other push needs a fresh, in-the-moment go-ahead. The rule is enforced twice — as a rule agents must follow, and as a `pre-push` hook that also catches human pushes. If you have an in-flight branch like `origin/skilled/0064-*`, expect it to hit this gate on its next push.

&nbsp;

#### A Fail-Open Guard Against Mass Deletion

A single stale `git add -A` once erased 902 files, and a runaway agent can do the same. That path now has a tripwire: a guard blocks any commit or push that removes more than a threshold (default 100) of tracked files, unless you authorize the one operation with an explicit flag. It is live for commits now and ready for pushes, and it fails open when it cannot verify, so it never wedges you.

&nbsp;

#### Owner-First Branch Names

Branches now carry their owner. The grammar is `<skill>/{NNNN}-{slug}` (or `skilled/{NNNN}-{slug}`), and the number is allocated by a locked clone-wide counter, so two sessions cannot grab the same one. This is a breaking change: older `wt/`-style names no longer conform and new branches must follow the owner-first form, though the gate that checks them is deliberately tolerant of existing names and never blocks a `skilled/v*` release.

Also folded in: a command-time advisory surfaces the relevant git rule the moment a git command runs, the resource paths moved to hyphen-case as the first step of a repo-wide migration, and the GitKraken MCP was wired in for those who use it.

---

## Prompt Engineering

Prompt work stopped being spread across two skills. It now lives in one hub with two modes, and the long run of name changes finally settles — so the only things you must do are update one command and one skill reference.

#### One Hub for Prompt Craft

`sk-prompt` is now the single home for prompt work, running two modes over one shared structure: `prompt-improve` for turning a rough prompt into a structured one, and `prompt-models` for the per-model profiles. The old `/prompt:improve` command was a 28KB monolith; it's now a thin router with its auto, confirm and presentation pieces split into their own files. The breaking change is one command name: `/prompt` is now `/prompt-improve`, and everything that lived in the standalone `sk-prompt-models` skill moved under `sk-prompt/prompt-models/`.

&nbsp;

#### A Profile for Every Model

The per-model prompt-craft knowledge is now a real hub with six conformed profiles, one per active small model, and a `recommended_frameworks` field on seven of the eight model entries so routing can suggest which of the seven prompt frameworks fits the model you're calling. The six CLI skills each carry a single three-tier precedence rule for composing prompts instead of around 90 lines of duplicated quality cards. The knowledge sits in three layers, so a model's profile lives in exactly one place:

- **framework tables** in `sk-prompt`;
- **per-model profiles** in the `prompt-models` mode;
- **lean delegating mirrors** in the `cli-*` executors.

&nbsp;

#### The Names Settle

The last of the prompt renames landed this release: the models skill went `sk-prompt-small-model` → `sk-prompt-models`. (The earlier `sk-improve-prompt` → `sk-prompt` skill rename and `@improve-prompt` → `@prompt-improver` agent rename had already shipped in prior cycles.) That renamed skill was then folded into the `sk-prompt` parent, so `sk-prompt-models` is a mode now rather than a standalone skill — the advisor resolves it at high confidence (0.95), and the old `sk-prompt-small-model` name still points at the same place.

---

## MCP Tooling

The MCP tools are the bridges that let you drive outside applications — a browser, a design reference, a notes vault — from the terminal, and this release drew them together. What were several separate skills became one hub with more modes and a router that finally routes, plus one path move you should know about.

#### One Hub for the MCP Bridges

Every bridge now lives under a single `mcp-tooling` parent instead of standing alone, so the browser, ClickUp and design tools are one skill that reads which mode you want and routes to it. It is the sixth canon-clean parent in the framework — one of the hubs that meets the full documentation and routing standard — and it ships the feature catalogs, install front doors and worked examples the other parents already had. The router underneath it now does what its name promises: an intent that once replayed correctly six times out of thirteen now replays correctly all thirteen, backed by a hard gate that refuses to ship if any packet routes wrong.

&nbsp;

#### Three Transports and a Browser Bridge

The hub's shelf grew this release:

- **`mcp-refero`** — a read-only design-reference transport that searches styles, screens and flows.
- **`mcp-mobbin`** — a read-only transport for design research.
- **`mcp-aside-devtools`** — a browser bridge that drives the agentic `aside` browser from its command line, with a server fallback for when the CLI is not enough.

The two design transports defer to the design-judgment skill for taste, so they gather references rather than make decisions.

&nbsp;

#### Your Vault at the Terminal

`mcp-obsidian` walks your notes vault out to the terminal. One mode covers three paths — a headless notes CLI, the official app-backed CLI, and a community MCP server — with a feature catalog and references for the plugins you are most likely to lean on. The work is honest about its rough edges: title search is broken headlessly so the mode uses content search instead, and the installed REST API exposes a different tool set than the documented server, a gap still awaiting reconciliation.

&nbsp;

#### Figma Moves Into the Hub

The one change here you may need to act on is a path move, not a removal. The `mcp-figma` skill was folded into the new `mcp-tooling` parent as a transport mode: it now lives at `.opencode/skills/mcp-tooling/mcp-figma/` instead of the old flat `.opencode/skills/mcp-figma/`, and it stays fully registered and routable — Figma work still routes to the in-repo transport exactly as before. If you had scripts or habits pinned to the old flat path, repoint them at the nested hub location; nothing about how Figma work runs has changed.

---

## Agent Discipline

This release is where the operating discipline stopped being something you had to hold in your head and became something the framework states for you. The terminal-proof rule — show evidence before you claim a result — is now written into every governing section instead of living as a separate protocol to maintain, and a new writing-quality section gives every runtime one place to find the rules for how an answer should read.

#### Terminal Proof Is Now the Law

The rule that a claim needs proof is no longer a separate protocol you opt into and keep in sync. It is now distributed across the authorities you already follow — the Four Laws, the Verification Standards, the Blast-Radius rules, a new Final-State Verification gate, Execution Behavior, and the Quick Reference — so it reads as one coherent instruction rather than a standalone lifecycle block. The per-turn reminder each session shows now carries a proof-over-appearance line through the existing governor chain, and the change shipped with the directive-expectation tests green.

&nbsp;

#### Communication Quality §8

Every runtime now finds its cross-runtime communication rules in one place. A new Communication Quality section spells out how answers should be written — one idea per sentence, a recommendation that has to earn itself, the request restated before diving in — rather than leaving those standards scattered or implicit. The deeper Codex voice spec was reconciled with four additive edits so the two documents agree, and only the genuinely new craft was lifted from the source; roughly seventy percent of it was already covered, and covered more thoroughly, elsewhere.

---

## Plain-English Output (sk-communication)

New this release, and off by default: `sk-communication` is a **standalone** projection layer that rewrites terse agent output — the clipped "claudish" a CLI emits — into plain English, without ever changing the canonical bytes underneath. It is not a doc mode and not on the advisor's radar; it is a separate, opt-in tool you turn on per machine.

**What it does**

- Rewrites terse CLI output into readable prose while **preserving the exact original**, so nothing downstream that reads the canonical output breaks.
- Runs **privacy-first** — it picks a local or hosted rewrite model under explicit privacy and egress rules, with adapters for local engines (DeepSeek-direct, Ollama, llama.cpp) over an OpenAI-compatible / Ollama transport.
- Wires into **all six runtime surfaces** (Claude, Codex, Pi, OpenCode, Devin, Cursor), each declaring a full-projection or safe-native tier.
- **Fails closed** — any error returns the exact original output, and its telemetry is content-free.
- Ships with a **blind non-inferiority evaluation** (does the rewrite read as well as a human reference?) and a **release gate** that blocks a runtime's rollout without fresh evidence, plus a compatibility doctor.

**How to turn it on** — projection is off for everyone until you opt in on your own machine, one of two ways:

- set the `COMMUNICATION_PROJECTION_ENABLED` environment variable, or
- drop a git-ignored `enablement.local.json` holding `{ "enabled": true }` at the package root.

Every activation path checks `isProjectionEnabled()` first, and the skill is on the advisor's route-exclusion denylist, so the recommender never surfaces it — you invoke it by hand. Nothing rewrites your output until you flip that switch.

---

## Upgrade Notes

There is no single big migration — the common path still works, your spec paths resolve through a compatibility symlink while you catch up, and the new structural protections are on by default while flag-gated features stay off until you enable them. But this release closes out a long chain of renames and removals, and each one is breaking wherever an old reference crosses the boundary. The concrete moves:

- **Renames to adopt.** `sk-prompt-small-model` → `sk-prompt-models`; `@improve-prompt` → `@prompt-improver`; `/prompt` → `/prompt-improve`; `doc-quality` → `create-quality-control`; `@create` → `@markdown`; the `/create` commands `sk-skill` → `skill` and `folder_readme` → `readme`.
- **Repoint what moved.** `specs` went from `.opencode/specs/` to a top-level `specs/`; `deep-loop-workflows` and `deep-loop-runtime` merged into `system-deep-loop`, and the deep router agent is now `deep-loop`; the `sk-code` files and routing contract moved under its new mode/surface packets, so anything still pointing at the old flat paths must be updated.
- **Drop removed surfaces.** `cli-gemini` and `cli-copilot` are gone — Copilot-shaped prompts now route to Claude Code. Remove the `open_design` server from `.utcp_config.json` and stop referencing `design-generation-patterns.md`.
- **Changed defaults.** Pi hands subtasks to its own subagents unless you name a `cli-*` mode. Goals saved under the old global scheme no longer inject — migrate or archive them. Only `main`, `skilled/v*` releases, and names in your allowlist push without asking. New branches use the owner-first form `<skill>/{NNNN}-{slug}` or `skilled/{NNNN}-{slug}`.
- **Reconcile your own skills.** This is a framework you adopt, so your *own* customized skills need aligning to the new skill format — the framework won't do it for you. `sk-code` now ships as a **parent skill** (a hub over workflow modes + read-only surface packets): either convert your single `sk-code` into that parent shape, or remove the repo's parent and keep your **own single** `sk-code`. `sk-git` ships as a **single** skill — keep it single or promote it to a parent, whichever fits you. Most other skills are framework-internal and repo-agnostic, so leave them alone rather than over-migrating. A step-by-step guide (decision rule, the single→parent procedure with existing `/create:skill-parent` tooling, and validation) lives at `sk-create-skill/references/skill/upgrading-a-skill-to-v4.md`.

---

## Internal Seams (No User-Facing Change)

- **Two-axis skill hubs.** `sk-code` and `sk-doc` each went from a flat monolith to a parent hub routing on two axes — workflow modes plus surface or `create-*` packets. What you type to start a task is largely unchanged; where the pieces live and how routing decides is the clean break.
- **Deep-loop runtime merged.** The workflow hub and the backend runtime it sat over — formerly two packages — merged into the single `system-deep-loop` skill, with every downstream reference repointed. The five modes behave exactly as before.
- **Advisor extracted to its own package.** The advisor became a standalone `system-skill-advisor` package with its own launcher and a renamed database, and every consumer was cut over to the new home.
- **CLI orchestrators consolidated.** Six CLI-orchestrator skills became one hub, and every executor now refuses to start unless its own binary is actually installed, so a missing tool never shows up as routable instead of failing partway through a run.
- **Review folded in as a mode.** `sk-code-review` was rebuilt as a stack-agnostic baseline with stack-specific guidance layered on top, and wired across runtimes, orchestrators, and the advisor so one standard shows up everywhere.
- **Proof requirement distributed.** The claim-needs-proof protocol folded into the authorities you already follow — the Four Laws, Verification Standards, and a new Final-State gate — instead of living as a standalone lifecycle block.
- **Push gate enforced twice.** The push rule is now both an agent rule and a `pre-push` hook that also catches human pushes.
- **Shared goal core.** Goals moved to a shared core and a common active-goal store, and stopped living as a global singleton — they are now stored per workspace, runtime, and session.
