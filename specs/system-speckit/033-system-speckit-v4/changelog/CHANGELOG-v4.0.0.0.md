---
title: "v4.0.0.0, The Foundation Rebuilt: Spec Kit, Deep Loops and Parent Skills"
trigger_phrases:
  - "v4.0.0.0 release notes"
  - "v4 changelog"
  - "fewer skills safer paths"
  - "what changed in v4"
---
# v4.0.0.0, The Foundation Rebuilt: Spec Kit, Deep Loops and Parent Skills

v4 rebuilds the foundation of the framework. It gives an AI coding agent one path from a file change to a documented, validated result, one runtime for long-running research and review and one way to group related skills without hiding the work each mode does.

Spec Kit now owns the whole change record. Structured packets, continuity, lexical retrieval, workspace gates, derived metadata and completion checks live in one lifecycle. The specs moved to a physical top-level root, the retired memory database gave way to a committed trigger index and ripgrep and the completion gate learned to check scope and acceptance. A file change has a place to land, a record to follow it and a gate that can say whether it is finished.

Deep Loop now gives research, review, AI council and improvement one runtime. Each loop carries its state outside the chat, fans out to the executors you choose and records its passes in an append-only ledger with typed events, sealed artifacts and receipts. The runtime checks coverage and convergence before it permits a stop, so a finished-looking transcript is not proof that the work is finished.

Skills have a second shape now. A standalone skill still owns one job. A parent skill owns the route, reads the request and dispatches through `mode-registry.json` to a nested workflow or read-only surface. That gives code, documentation, design, MCP tooling and external CLI orchestration one identity each without flattening the behavior that belongs to their modes.

The rest of this release is the work that makes those three changes hold: new roots and compatibility paths, retrieval without the old database, stricter gates, safer dispatch, new executors and the runtime details that make a long session recoverable. The sections below explain the new shape and the breaking paths, defaults and implementation details that come with it.

## Why This Release

Most of the framework's skills now present one identity instead of a scatter of separate skills. Seven families made the move: code, documentation, design, the deep loops, MCP tooling, external CLI orchestration and judgment transport. Prompt craft tried the parent shape during the cycle and returned to a standalone skill before release. `sk-vision`, `sk-communication`, `sk-git`, `mcp-code-mode`, the Spec Kit and the advisor stayed standalone.

A parent skill owns no workflow logic. It reads what you asked for and dispatches through a `mode-registry.json` to one of its nested modes, keyed by a `workflowMode`. A mode either does the work or supplies read-only evidence. The gain is practical:

- **One place to maintain.** One hub instead of near-duplicate homes.
- **No slash-command bloat.** A mode does not need its own command.
- **Cleaner routing.** Each domain presents one identity to the advisor.
- **Easier to iterate.** Change one mode without disturbing its neighbors.

`sk-doc`'s `create-skill-parent` tooling stamps out each hub's router, modes, README and drift check the same verifiable way. The sections below explain what each family gained.

---

## What's New at a Glance

- **Spec Kit has one canonical core.** Specs now live under `specs/`, with level-gated core templates for specs, plans, tasks and implementation summaries. Old `.opencode/specs/...` paths still resolve through a compatibility symlink.
- **The memory database is retired.** SQLite, embeddings and `memory_search`/`memory_save` are gone. `/speckit:search` uses a committed trigger index and ripgrep, returning a clean no-hit when the phrase is absent.
- **The Skill Advisor is CLI-only.** Its MCP transport is gone. `node .skilled/bin/skill-advisor.cjs` is the front door, and local scoring marks itself degraded when the daemon is unavailable.
- **Deep loops share one runtime.** Research, review, AI council and improvement fan out across chosen executors. Typed ledger evidence and convergence checks control the stop.
- **Cross-CLI dispatch has one parent.** `cli-external-orchestration` routes seven bridges. Cursor and Hermes join OpenCode, Claude Code, Codex, Devin and Pi as deep-loop executors. Each bridge checks its binary before dispatch.
- **Repo Rules are routed.** `REPO RULES.md` loads scoped rules for evidence, blast radius, communication and hub routing before a first write.
- **Design has one hub.** `sk-design` routes fundamentals, measured `DESIGN.md` extraction, charts and diagrams to the mode that owns the job.
- **Goals and hooks travel with the session.** The goal plugin binds `goal.md` to OpenCode, Cursor, Pi and Devin. One switchable hook library carries shared guards into Hermes through one plugin.
- **Authentication is sign-in based.** Codex and Claude Code use the accounts you already have. Their API-key paths are gone.
- **Git stops before costly mistakes.** Pushes, mass deletion and misnamed branches hit explicit tripwires. Parallel-session commits still reach the IDE checkout.

---

## Spec Kit

The spec kit changed the most under the surface. The memory database that powered `memory_search` was retired outright, the specs folder moved, the runtime was renamed and nested, and the completion gate was made coherent. Three research rounds then cut the kit back to what a machine reads.

Most of the depth is in what left: an entire retrieval engine replaced by two small lexical tools.

#### Specs Move to the Top Level

Your spec paths have a new root. The specs folder moved from `.opencode/specs/` to a physical top-level `specs/` directory, so canonical spec paths are now `specs/...`. This is a breaking change, but the old location still resolves through a compatibility symlink, so anything still pointing at `.opencode/specs` keeps working while you catch up.

&nbsp;

#### The Memory Database Retired

The Spec-Kit Memory engine is gone. The SQLite database, the embedder, the spec-memory MCP server, its daemon and the `memory_search` and `memory_save` tools were decommissioned end to end, first on a side branch and then landed on the release branch and `main`. The `spec-memory` daemon CLI under `.opencode/bin/` and the `system-spec-memory` OpenCode plugin went down with it, since both were doors into the same engine.

What replaced them is deliberately small:

- A committed trigger index is generated from every document's `trigger_phrases` frontmatter.
- A lookup script reads it with no daemon.
- A set of ripgrep recipes handles free text.

All of it sits behind `/speckit:search`, and the kit's own context writer handles continuity. Retrieval is lexical now, and a miss is a clean no-hit rather than a degraded guess. The debt the decommission left, from dangling registrations to a package that still called itself an MCP server, was closed across six review passes.

&nbsp;

#### The Runtime Renamed and Nested

The surviving package no longer carries an identity it lost. Its engine lives at `.skilled/skills/system-spec-kit/runtime/cli/`:

- `spec/validate.sh`, `spec/create.sh`, `spec/repair-derived.cjs` and `spec/recommend-level.sh` for the packet lifecycle
- `continuity/` for saves
- `spec-folder/` for generated metadata
- `retrieval/` for the trigger index

The old `scripts/` and `mcp-server/` paths are gone, so anything you pinned to them needs repointing. A shared package underneath carries the Gate-3 classifier and the frontmatter parser that every other skill now imports rather than copies.

&nbsp;

#### A Completion Gate That Tells the Truth

The gate that decides whether a packet may close now returns the same verdict whatever the environment, counts one fault once, and no longer asks a packet for what it cannot satisfy from inside itself. Forty rules are registered, and a warning is advice that does not fail a run.

It grew two checks of its own. Scope adherence refuses a packet whose changed files fall outside what its spec names, driven by `SYSTEM_SCOPE_CHANGED_FILES` and `SYSTEM_SCOPE_BASE`. Acceptance coverage runs on by default as an advisory.

Two documents joined the packet contract. `acceptance-criteria.md` decides closure at Levels 2 and 3, and an optional `goal.md` holds the durable directive you set as the session objective. A repair tool fixes the facts a packet records wrongly but a machine can recompute, such as its folder, level and generated fingerprints. It refuses to invent the facts only a person can write.

&nbsp;

#### Reindexing Stops Rewriting Your Edits

A force reindex could write its own auto-fixes, including destructive content trimming, back into your tracked source documents. That is the last thing a "fix it up" operation should do. Write-back is now gated on where the indexing originated, so an automated pass cannot reach into a document you wrote. The same gap was closed in the daemon's startup scan and file watcher.

&nbsp;

#### Three Rounds of Simplification, Every Finding Closed

With the database gone, three research rounds ran over the kit to find what no longer earned its place: the search system, CLI runtime utilization, the shared package, the template and acceptance-criteria system and plain overengineering. Twenty-two remediation children shipped from them.

They removed the CLI package residue and dead flags, the dead half of the shared package, orphaned decommission paths and a stale command surface, and they realigned templates, doctor signals and playbook paths with the runtime. A follow-up program then closed every finding those rounds had recorded rather than fixed, sixteen children in one day. Nothing from the research survives as a written-down decision.

&nbsp;

#### Smaller Templates, Same Output

The spec, plan, tasks and implementation-summary templates were consolidated into one shared core with level-gated addenda. The source dropped to 1,275 lines across four core templates without changing a single rendered byte, and the research template shrinks by level too.

A Level 1 spec now gets a short research doc instead of the full one, and a Level 1 research doc renders at 175 lines instead of 944. You see smaller, level-appropriate templates. What they produce is identical.

&nbsp;

#### CI Catches Drift at Commit Time

For days, every push mailed the operator a "runs failed" notice because a regenerated prompt mirror was never staged, and the pre-commit hook ran one of the six mirror checks CI runs. Now the hook runs all six and blocks any unstaged change under a generated mirror, so drift surfaces on the commit that caused it.

The Spec-Kit Check workflow fires on every mirror source and every mirror output. The four workflows red since the shared-parser adoption were fixed, and the forty-four open Dependabot alerts on the default branch were brought to zero.

---

## The Deep Loops, Unified and Extended

The deep loops finished collapsing into a single home and learned to run on any model you name, several at a time. The hub and its backend are one skill. The loops fan out across every CLI. Underneath, a new evidence-ledger runtime landed dark, proved parity and then, under an operator-ratified flip, became the authoritative record for every mode.

#### One Skill, Hub and Backend Together

The workflow hub and the runtime it ran on are one skill, `system-deep-loop`. Every downstream reference (commands, agents, READMEs, hooks, advisor routing) was repointed at the new home, and the modes you already use behave as before: research, review, ai-council, agent-improvement and the model benchmark. What changed is the address.

What left the tree along the way:

- The `deep-loop-workflows` and `deep-loop-runtime` skill identities no longer exist, so anything you script that still names one of them now points at a signpost that is not there.
- The skill-benchmark lane was retired late in the cycle.
- The deep router agent was renamed `deep` to `deep-loop`, then retired with its routing folded into the `/deep:*` command bodies, so there is no router agent left to call.

An alignment mode was built during the cycle and removed before release, and the removal took `/deep:command-benchmark` and the conformance benchmark family with it. The `ai-council/` packet was renamed `deep-ai-council/`, and the second-stage router that used to live at `shared/references/smart-routing.md` moved to a root `ROUTER.md`.

&nbsp;

#### One Loop, Every Model, In Parallel

The deep loops stopped being tied to a single model. Any loop can run on whichever executor you name, and a fan-out can run several at once.

- **Every CLI is a first-class executor.** A loop dispatches native or to any of the seven external CLIs: `cli-opencode`, `cli-codex`, `cli-devin`, `cli-cursor`, `cli-pi`, `cli-claude-code` and `cli-hermes`. Codex carries GPT-5.5 and the three GPT-5.6 models, each with its own effort ceiling. Devin carries six families, Gemini 3.7 Flash and GPT-5.6 Luna Max among them. Cursor carries 21 ids across six families. Pi runs a closed six-provider roster with DeepSeek V4.1 Flash as its default. Mix them freely.
- **Fan-out runs them in parallel.** Point one loop at several executors and it spawns a lineage per executor in a capped concurrency pool. A research or review pass gathers independent model perspectives at once instead of one after another.
- **Hardened dispatch.** Each lineage's writes are contained, every iteration records which agent ran on which route, and the CLI adapters were stress-tested and repaired to parity. A fan-out is reproducible, and the executor you name is the one that runs.
- **Allowlists where it counts.** Codex, Cursor, Devin and Pi each enforce a model allowlist, so an off-roster id fails at dispatch instead of quietly landing on a default. `cli-opencode` takes a free-form `provider/model` id instead and relies on discipline rather than a gate.

Codex and Devin were revived and Cursor and Pi brought up new to make this real, so the whole roster is available to the loops. Every deep-review run now ends with a plain `Review verdict: PASS|CONDITIONAL|FAIL` line, and every deep-research run records which executor produced its first record.

&nbsp;

#### Fan-Outs Contain Their Writes

A multi-hour fan-out used to be something you ran on a checkout you were not using. A lane that wrote outside its own directory could be rewound by the containment pass, and your own edits with it. Containment now preserves by default: a lane's out-of-scope writes are left where they landed, and a copy of each goes into a quarantine directory beside the run.

The lane's outcome is recorded apart from the containment result, so a lane never fails because a neighbour or you touched a file. Restores are targeted at the baseline the lane started from, never written through a symlink, and a neighbour's `index.lock` is waited out rather than tripped over.

Forced-depth runs fail loudly on an empty record set, an iteration recorded twice is tolerated once, and every direct state-log append now goes through the gateway. Per-lineage worktrees were built as well, then measured: four research lanes on four models agreed that attribution cannot be made exact on a shared tree after the fact. The operator ruled attribution out as a requirement, and the worktree mechanism was removed from the default path.

&nbsp;

#### A New Evidence Ledger, Now Authoritative

The deep loops grew a new spine, and by the end of the cycle it became the record. A research program of recommendations across the loop family converged on a single architecture, an append-only ledger with a few load-bearing parts:

- a typed, append-only event ledger as the single record of what happened
- a fail-closed gateway that authorizes every state transition
- sealed reference artifacts, versioned replay fingerprints and receipts
- blinded adjudication for the judgments the loops make

Because the runtime holds live in-flight state, it could not be swapped in one move. The substrate landed the careful way: additive and dark behind compatibility adapters, proving shadow parity against the existing behavior, then cutting over one mode at a time behind a rollback window.

Every ledger mode is now on the authoritative path. The ledger is the record, the legacy files are produced by projection from it, and a fail-closed guard rejects any out-of-band write to a projected file. Every run is replayable and every transition accountable. The finding dedup and the two progress gauges in the fan-out runtime stay off by default, so you flip them deliberately rather than inherit them.

---

## Orchestrating Other AIs

The way the framework talks to other AI coding tools settled into one honest shape. Seven separate CLI-orchestrator skills became one hub. Every executor refuses to start unless its own binary is installed. The surfaces no longer worth keeping were turned off for good.

#### One Hub for the External CLIs

The seven CLI-orchestrator skills live under one `cli-external-orchestration` hub, renamed from `cli-external` during the cycle. The hub holds no logic of its own and routes to a mode per executor. The change is invisible where it counts, because the concrete executor names like `cli-opencode` keep working. Two of them stop being independently routable top-level identities, so anything that pointed at `cli-opencode` or `cli-claude-code` as standalone skills now resolves through the hub.

Judgment questions have their own hub now: `cli-jev` answers them through the `jev` CLI.

&nbsp;

#### Executors That Only Run When Installed

Codex and Devin are back, Cursor, Pi and Hermes are new, and all five join as deep-loop executors. Each one is gated fail-closed on its own binary being present, with a check like `command -v codex`, `cursor-agent`, `devin`, `pi` or `hermes`. A missing tool never shows up as routable or dispatchable, so it cannot fail partway through a run.

This reverses an earlier quiet removal. Codex and Devin had been deprecated and stripped out, then brought back this same way, so the roster you can use now matches what is installed on your machine.

&nbsp;

#### Sign In Once, Dispatch Everywhere

**Breaking:** Codex authenticates only through ChatGPT OAuth now, run `codex login` once. Claude Code authenticates only through your Claude subscription, run `claude auth login` once. The API-key paths are gone. `OPENAI_API_KEY` and `ANTHROPIC_API_KEY` are no longer read anywhere in the dispatch flow.

&nbsp;

#### Pi Runs the Framework Natively

Of the runtimes the framework can hand work to, Pi went the deepest. `cli-pi` is more than a dispatch target. It hosts the framework, with bridges for the whole repo surface:

- a skill-discovery bridge so Pi finds and runs the repo's own skills
- a command layer and an agent bridge
- MCP host integration and a hook-and-extension layer
- its own model registry and routing, plus a fan-out executor
- two vendored extensions, a cache optimizer and a fast-mode toggle, described below

Where the other executors receive a dispatched prompt and run it, Pi loads the repo's skills, commands, agents, MCP servers and hooks and runs them itself. It is the most complete runtime integration of the seven.

&nbsp;

#### Hermes Runs It Too

Hermes Agent (Nous Research, a Python agent CLI) is the seventh runtime, as `cli-hermes`. It dispatches as a quiet oneshot chat with the prompt on stdin, through the operator's LLM Gateway provider and a closed seven-id roster, and it is the eighth deep-loop executor kind.

The repo-root `.hermes/` folder carries:

- generated markdown-only copies of every skill and every agent persona, because Hermes scans a linked directory in full, so the skills tree ships as generated copies rather than links, and the agent tree is a single tracked symlink into `.skilled/agents`
- generated prompt templates
- one project plugin

That plugin bridges eighteen of the twenty-two hook packages into a Hermes session: the skill advisor and spec gate at prompt time, the dispatch, task-dispatch, MCP-route, git and vision guards before a tool call, post-edit quality on a write result, the shared goal core at session start, the session-start advisories, and session cleanup. The four that stay out are runtime-specific by nature.

Every bridge has a live playbook scenario. The packet is `cli-external-orchestration/071-cli-hermes-creation`.

&nbsp;

#### The Dispatch Guards Now Actually Guard

Adding a seventh runtime meant reading the preflight that is supposed to stop a bad dispatch, and it was approving things it declared forbidden. Six conditions were silently passing. The worst was Codex: the dispatch shape that recognises a `codex exec` command was wrong in two places, so no `cli-codex` rule ever loaded and every Codex dispatch went out unchecked.

Hermes fan-out lineages were unguarded for a different reason, because the runner never set the project-plugin opt-in, so the packet and read-only markers the guards read were never visible. The seven `cli-*` packets moved their stdin rule from advice to blocking, a reader-toolset requirement was added, and a preload exemption that excused too much was removed.

Coverage then widened past the runtimes that had an adapter. Cursor gained one, and OpenCode began enforcing in-process before a tool call rather than only recording after it. Both call the same shared rule engine rather than carrying a copy, so a rule cannot mean one thing in one runtime and something else in another.

The last piece is the one that keeps this from rotting. A guard asserts a bijection between the rules the packets declare and the checks the engine implements, with a fixture pair per check, and a workflow runs it on every change and fails closed when the suite is missing. A declared rule with no check, which is exactly how all six holes opened, now fails the build instead of passing quietly.

&nbsp;

#### A Closed Roster

Pi narrowed in two ways here: the subagent machinery went, and the door to new models closed.

Pi removed its subagents feature during the cycle, which left the CLI as the only way a Pi session can hand work out. So the rule forbidding a Pi session from dispatching `cli-pi` had to go, and it went in all three places at once: the prose in the skill, the Pi preflight hook that enforced it by name, and the shared deep-loop guard that enforced it structurally. Removing only the prose would have left the hook refusing what the prose allows.

This is the one carve-out from the self-invocation rule that blocks every other executor from calling itself, and it is deliberately narrow. The exemption is keyed to `cli-pi` and read only by the two layers that mean "the caller is inside this CLI". The layers that bound a runaway spawn chain, the fan-out lineage and the dispatch stack, still apply to every kind including this one.

Pi reaches six authenticated providers, and the model roster is closed: an id that is not on it is refused, in the fan-out and on a direct call alike. OpenRouter came off that roster this cycle, on Pi and on OpenCode both, which removed twenty-three live references across seven files. Nothing broke, because it was never a default on either CLI, and both models it served keep a direct route and a fan-out route.

&nbsp;

#### The Cache Extension Learned What Caching Costs

Pi ran two forked cache extensions for most of the cycle, splitting work by a hand-maintained model allowlist written twice, with a fixture and a cross-extension test whose only job was proving the two copies had not drifted. That is gone. `deep-pi` is retired, its capabilities absorbed into the surviving `pi-cache-optimizer` fork, and one extension now covers every model.

What it gained along the way:

- **Cost, not just token counts.** `/cache-optimizer stats` reports input cost, the fully-uncached baseline it is measured against, savings and prefix churn, priced from the model registry rather than hardcoded rates. A model with no cost block reads as unpriced, never as a confident zero.
- **Honest measurement.** A response that reports no cache fields counts as unmeasured and stays out of the hit ratio instead of scoring as a miss, while its tokens and cost still count in full, because the request really was billed. A model that never reports can declare so once rather than being guessed at per response.
- **A retry-loop guard.** A turn whose tool batch keeps failing used to reissue the same billable request with nothing noticing. The guard tracks a whole batch and escalates only when the batch fails repeatedly with no success in between, so one legitimate retry stays silent and the case that actually burns money, a batch that partially succeeds every time and never converges, is the case it catches.
- **Hash-verified edits.** A model reads a file, composes an edit against what it saw, and the content moves before the edit lands. The edit still matches somewhere, succeeds against the wrong lines and reports nothing. Read output now carries per-line content hashes and the file's line count, and an edit that cannot prove its target held still is refused by name. There is no fuzzy fallback, because a looser match is the silent corruption this exists to prevent.

One experiment was reverted rather than kept. A gate meant to lift a prompt prefix only after it proved stable across turns turned out to rest on void evidence: the hook it used fires once per user prompt rather than once per provider request, so the one-shot processes that tested it never reached a second observation and lifted nothing at all.

&nbsp;

#### What the Caching Is Actually Worth

The gateway behind Pi's DeepSeek and GLM routes is DevPass, and a claim that it is a flat-price subscription was wrong. It bills per token at ordinary list rates. The plan buys credits at a three-times bonus, which discounts the bill rather than removing it. That correction matters, because the flat-price story had been used to argue that no dollar figure could exist for these routes and that tokens were the only honest metric.

They can be measured, and were, across thirteen requests in one sitting:

| Model | Cached input | Billed | Uncached baseline | Saving |
|---|---|---|---|---|
| DeepSeek V4 Flash Vision | 169,728 of 172,000 | $0.000793 | $0.024080 | 96.7% |
| GLM-5.3-Flash | 95,296 of 140,317 | $0.006344 | $0.012348 | 48.6% |

The gap between those two is the part worth carrying away. DeepSeek charges two percent of its prompt rate for a cached read, so a very high hit rate converts almost directly into the saving. GLM charges twenty-eight percent, so a good hit rate yields barely half as much.

Same extension, same optimisation, roughly half the value, decided by the rate card. The hit rate in your footer is an input to the saving, not the saving itself.

&nbsp;

#### Surfaces Retired

The Gemini and Copilot bridges were retired in the v3.6 cycle, after the Copilot price hike and the Gemini cleanup made them not worth maintaining, and v4 carried the residual reference cleanup. `cli-gemini` and `cli-copilot` are gone from the skill tree, the advisor's scoring and hub routing.

That is the standalone bridge only. Gemini 3.7 Flash remains reachable through Devin and Cursor, both dispatch-tested, and Copilot-shaped prompts now land on the nearest remaining executor, Claude Code. The Ox Alpha routes were retired too, and Pi's default model was repointed away from them. Only the external binaries in your home directory are left untouched.

---

## The Skill Advisor

The skill advisor decides which skill should answer a request. It was already standalone before this release, with a skill-graph backbone and a fast warm path from earlier work. Its v4 changes are narrower and quieter. Workspace anchoring got stricter, the skill graph was tidied, it launches cleanly under Codex, and by the end of the cycle its MCP transport was retired so the CLI is the only front door.

#### Stricter Workspace Anchoring

The advisor had been leaving litter in spec folders, writing its `.advisor-state` next to whatever directory a session happened to run from. Two changes pull that back toward the repo root: a shared anchored root resolver and a switch from the old specs-only deny-list to a structural boundary that hoists state above the outermost `.opencode`.

The skill graph was tidied in the same pass. Its metadata now points at the tracked source file, a one-identity ingestion hole was closed, and a read-only freshness panel shows you whether the compiled graph is current.

**Breaking:** the CLI front door is fail-closed and untrusted by default now too. A mutation through the CLI needs `--trusted`, or it is refused. The native MCP registration that once carried the same setting is gone with the transport.

The reciprocal-rank-fusion spine and the conflict rerank graduated from dark flags to shipping defaults, and the separate self-recommendation guard was cut as redundant once the penalty covered the same ground. A document's `trigger_phrases` now feed the advisor too. Doc-trigger harvesting reads them into a new `skill_docs` table behind `SPECKIT_ADVISOR_DOC_TRIGGERS`.

&nbsp;

#### Short Names Reach the Scorer

The scorer discarded any word of two characters or fewer before the token lanes ever saw it, which made `pi` invisible to every one of them. The hub scored only where an authored phrase happened to spell the wording out, so `delegate to pi` resolved and `delegate this to pi` returned nothing at all.

Short filler was already handled by the stop-word list, so the length floor was rejecting short content words and nothing else. Lowering it one character restores the lanes for names like `pi` without letting filler back in, measured against the labelled corpus at no change in accuracy.

&nbsp;

#### The CLI Is the Only Front Door

The advisor no longer speaks MCP. Its daemon answers the same nine commands over a unix socket, and `node .skilled/bin/skill-advisor.cjs <command>` is the one way to reach them, from a hook, a script or a session. The hook brief you see at prompt time resolves through that CLI, so the two routes cannot disagree.

When the daemon is unreachable the CLI falls back to a local scorer and marks the answer degraded, and an empty result from a healthy daemon now reads as no match rather than as an outage. Running the playbook across four runtimes found the last stale command name and a scorer pinned to unreviewed truth, and both were fixed.

&nbsp;

#### Codex Starts the Advisor

Codex sessions now launch the advisor under the Node runtime whose ABI matches the installed native SQLite module, so the advisor initializes instead of aborting the whole MCP startup cascade. Code mode keeps its own independent runtime pin. The advisor is not fully standalone even now. It keeps a symlink to the spec kit's embeddings and extends the spec kit's tsconfig.

---

## One Code Skill

`sk-code` was eight sub-skills with duplicated doctrine, one copy of the same rules repeated across stacks. This release reshapes it into one hub running on two axes, how you work and what you are working on, folds review in as a first-class mode and welcomes Rust as a first-class language. What you type to start a code task does not change. Where the pieces live and how routing decides where to look is a clean break.

#### One Hub, Two Axes

The flat skill became a parent hub, routing on two axes at once:

- **workflow modes that act:** `sk-code-quality` and `sk-code-review`
- **read-only surface packets that inform:** `sk-code-webflow`, `sk-code-opencode` and `sk-code-obsidian`, each carrying the shared implement, debug and verify doctrine plus its stack knowledge, with the Motion.dev animation overlay folded into webflow

`sk-code-quality` is the post-implementation gate. It applies the P0 to P2 author checks and comment hygiene per modified file, running between implementation and verification on whatever surface just changed. The obsidian surface covers the Note Database plugin.

The guidance you get is scoped to both what you are doing and the stack you are doing it to. Every relocated file was repointed, including a pre-commit hygiene gate that had been silently skipped.

The hub move itself was breaking. The later surface additions were not. The routing contract and every skill path shifted under the mode and surface packets, so anything that still points at the old flat paths must be updated.

&nbsp;

#### Review, First Class

The review skill stops being a bolt-on. `sk-code-review` was rebuilt as a stack-agnostic review baseline and folded into the hub as a mode. It works on a baseline-plus-overlay precedence model: a shared baseline of findings-first review rules, with stack-specific guidance layered on top rather than each stack carrying its own copy.

It is wired across the review runtime, orchestrators, Codex agents and the advisor, so the same standard shows up everywhere you ask for one. Every review now ends with a plain-text `Review status: APPROVED|REQUESTED_CHANGES|COMMENTED` line. The six reusable checklists moved from `references/` to `assets/`, so anything pinned to the old path needs repointing.

&nbsp;

#### Rust Joins the Code

Rust is a first-class citizen on the opencode surface. The standard docs are in place, `.rs` files and Cargo projects are detected and routing covers both child and parent-union layouts, so a Rust change surfaces the Rust guidance instead of the generic fallback.

Language slicing now covers every language a task touches instead of stopping at the first match, so a task spanning two languages pulls both slices. For everyone else, the same pass split 33 oversized reference documents into 104 topic-cohesive parts, so the files you load are shorter and closer to the point.

---

## MCP Tooling

The MCP tools are the bridges that let you drive outside applications, a browser, a design reference or a notes vault, from the terminal. This release drew them together. Several separate skills became one hub with more modes and a router that routes, plus one path move you should know about.

#### One Hub for the MCP Bridges

Every application bridge lives under a single `mcp-tooling` parent, so the browser, ClickUp, Notion and design tools are one skill with nine modes that reads which mode you want and routes to it. `mcp-code-mode`, the execution substrate every MCP call runs through, stays a standalone skill outside the hub.

`mcp-tooling` meets the full documentation and routing standard and ships the feature catalogs, install front doors and worked examples the other parents already had. The router underneath does what its name promises, backed by a hard gate that refuses to ship if any packet routes wrong.

`mcp-webflow` was removed from the hub, and the fold-in that brought the other three bridges in moved three skills at once: `mcp-chrome-devtools`, `mcp-click-up` and `mcp-figma` together, not only Figma. The Orca bridge took the opposite road later in the cycle: it left the hub as a mode and now ships as the standalone `cli-orca` skill.

&nbsp;

#### Four Transports, a Browser Bridge and Notion

The hub's shelf grew:

- **`mcp-refero`**, a read-only design-reference transport that searches styles, screens and flows
- **`mcp-mobbin`**, a read-only transport for design research
- **`mcp-aside-devtools`**, a browser bridge that drives the agentic `aside` browser from its command line, with a server fallback for when the CLI is not enough
- **`mcp-notion`**, Notion workspace operations through the official server over Code Mode
- **`mcp-magicpath`**, component and design-system lookup over a `cli` manual, since its provider ships no MCP server

Figma, Refero and Mobbin hand measured values to the md generator. MagicPath hands taste questions to the design hub instead, because its `get_theme` call already returns named values with nothing left to measure. `mcp-chrome-devtools`, the hub's other browser bridge alongside `mcp-aside-devtools`, prefers its own command line too, with the MCP path as fallback.

&nbsp;

#### Your Vault at the Terminal

`mcp-obsidian` walks your notes vault out to the terminal. One mode covers a headless notes CLI, the official app-backed CLI and a community MCP server, with a feature catalog and references for the plugins you are most likely to lean on. The mode's plugin roster was pruned along the way: Excalidraw, Project Manager and Beancount were removed.

The official CLI's contract was corrected too, to `obsidian help`, and the false claim that the CLI launches the app was removed. The work is honest about its rough edges: title search is broken headlessly, so the mode uses content search instead, and the installed REST API exposes a different tool set than the documented server, a gap still awaiting reconciliation.

&nbsp;

#### Figma Moves Into the Hub

The one change here you may need to act on is a path move, not a removal. The `mcp-figma` skill was folded into the `mcp-tooling` parent as a transport mode, and it lives at `.skilled/skills/mcp-tooling/mcp-figma/` instead of the old flat `.opencode/skills/mcp-figma/`. It stays fully registered and routable.

The three former bridges, Figma among them, lost their own `graph-metadata.json` and route only through the hub identity now. If you had scripts or habits pinned to the old flat path, repoint them. Nothing about how Figma work runs has changed.

---

## The Design Surface

`sk-design` was a single skill. It is now a parent hub of four modes that projects one design identity and routes you to the mode that owns the decision in front of you. Two of those modes moved in from sk-doc, one returned from a standalone life, and the values mode grew from screens to every laid-out surface. Around the hub, the chart corpus was rebuilt on a real visual register, a library of real-world styles lives on your own machine, and one transport, Open Design, leaves the building.

#### One Hub, Four Modes

The hub carries no procedure of its own. It decides which mode owns the question and hands over.

- **`sk-design-fundamentals`**, the default. It designs, builds and reviews any laid-out surface from fixed value scales: spacing, type, colour, contrast and hierarchy. That used to mean screen UI only. It now covers slide decks, printed pages and document layouts too, and adds interaction guidelines, motion principles and a WCAG review pass where the surface is a screen. It routes by alias and carries no command of its own.
- **`sk-design-md-generator`**, behind `/design:extract`. It measures a live site's real CSS into a v3 Style Reference `DESIGN.md` through an extract, write and validate pipeline, and it validates one you already have. It was a standalone skill and came back as a mode.
- **`sk-design-chart`**, behind `/design:chart`. Turn the comparison a reader needs into one of 29 catalog forms and ship it as a standalone HTML file.
- **`sk-design-diagram`**, behind `/design:diagram`. Self-contained HTML/SVG diagrams across 27 types with a skinnable editorial design system, plus ASCII and Markdown flowcharts and draw.io or Mermaid redraws.

Chart and diagram used to live under sk-doc as `sk-create-chart` and `sk-create-diagram`. They moved here and were registered in the hub's router. Every form the two canvas modes ship now has a rendered screenshot kept beside its mode, so you can see a chart before you ask for it. The `/interface:*` family that preceded all this is gone.

A manifest version stored as a string had silently disabled three manifest checks, byte drift, target collision and reachability, because a numeric check read it as absent. It is now a number, so the checks run.

One honest caveat. The other six hubs resolve through a compiled router contract first. This hub's routing is still the registry and the root router alone, with the compiled closure planned, not shipped.

&nbsp;

#### Charts on a Real Register

The chart corpus was brought to the shadcn visual register, with three named stock colour systems, their palette source and proof sheets checked in beside the forms. The chart check grew from fifteen named check families to forty-two, three of them browser-backed, so a form cannot drift off the register without a gate going red.

The stock register is the evilcharts Style Reference, derived from a real chart library and carried beside the forms it produced. A cursor-derived register held the role briefly mid-cycle and was removed before release, so the packet ships one reference rather than two. A fresh review of every chart packet was closed before release.

Every chart now carries a second palette block behind `prefers-color-scheme`. All three colour systems gained a dark ground with matching text and series values, and a dark-render check guards it, so a form cannot ship a light-only look by accident.

A missing reading used to dive a line to the baseline and print the word null beside it. Now it does not.

Charts also theme from your own site now. Point the chart mode at a local v3 `DESIGN.md` and `apply-design-md.cjs` derives a gated delivery palette from its measured values, both grounds included, without fetching anything or changing the stock files. Extraction stays with the md generator. Applying an extracted reference stays with the chart mode.

Late in the cycle the packet shed everything that was not a form. The seven worked deliveries and the gallery page are gone, so the twenty-nine templates are the corpus and the rendered captures are the review surface. Every chart's data table now starts open, because the old rule left a tooltip as the only way to read a value on twenty of the forms.

This mode ships pre-1.0 and its number says so. Its releases run `v0.1.0.0` to `v0.22.0.0`, which is the honest contract for a corpus still moving. Anything in it may change between releases.

&nbsp;

#### A Style Library You Own

You have a design reference library on your own machine instead of behind someone else's network call. The Refero styles, each carrying four tabs, were pulled into a local token library after a 50-style pilot came back clean. Around it sits a retrieval substrate that picks a style by eligibility first, and behind that a persistent style database built on SQLite with full-text search and vector lookup, so the corpus the modes study is the one you query.

The legacy default stays until you flip it yourself. The md generator also carries a private layer of procedure cards for its extraction work, each step pointing at its own card.

&nbsp;

#### Open Design Transport Removed

The Open Design MCP transport is removed end to end: its mode tree, server entry, hub references, agent and command links and live-render adapters are all gone. If you still point at it, drop the `open_design` server from your `.utcp_config.json` and stop referencing `design-generation-patterns.md`. Figma and the terminal remain your design transports.

---

## Documentation as a System

The doc skill grew up. Where one monolithic skill once did everything, a lean parent hub now hands each job to a small, self-contained packet, and two new authoring surfaces joined the family. Most of the change is internal, but a few command names and the repo's naming convention changed, so a couple of things you type are different.

#### Parent Skills, Nested Modes and the Tool That Builds Them

`sk-doc` is the worked example. The parent routes to fourteen `sk-create-*` modes across thirteen packets (`sk-create-skill`, `sk-create-readme`, `sk-create-agent`, `sk-create-diff`, `sk-create-changelog`, `sk-create-repo-rule`, `sk-create-quality-control` and the rest), twelve of them bound to their own `/create:*` command. A nested packet carries no `graph-metadata.json` of its own. It inherits the hub's one advisor identity.

`sk-doc` is also where the shape itself comes from. Its `sk-create-skill` mode scaffolds both kinds, and `/create:skill` stamps out a standalone skill while `/create:skill-parent` stamps out a parent wired to its nested packets.

A few names you type changed. Four `/create` commands were renamed to match their packet (`sk-skill` became `skill`, `folder_readme` became `readme`, and so on), and the quality packet is `sk-create-quality-control` with the old `/doc:quality` command gone. The authoring agent is now `@markdown`, formerly `@create`, and the packet directories themselves were renamed from `create-*` to `sk-create-*`.

&nbsp;

#### Two New Ways to Author

- **`sk-create-repo-rule`** writes, revises and retires the repo-local rule files that `REPO RULES.md` routes to. Reach it through `/create:repo-rule`.
- **`sk-create-diff`** compares a before-and-after document without git and produces a self-contained, shareable HTML report, so you can review an edit even when the file lives outside version control.

&nbsp;

#### Every Document Carries a Version

Every skill definition now carries a four-part `version` in its frontmatter. A script bumps it, and a CI gate refuses a file that ships without one. The rollout covered the whole corpus, so this is not a rule waiting for adoption. If you adopt the framework, your own skills need the field before the gate lets them through.

&nbsp;

#### Kebab-Case Is Now the One Name

The repo settled on kebab-case as its single filesystem naming form and retired the older underscore convention. In-scope folders, files and scripts were renamed, a guard refuses new snake_case names and a reviewable rename-and-reference toolchain keeps the migration honest. This reverses an older sk-doc rule that enforced snake_case recursively. If you had a script or path pinned to an old underscore name, update it.

&nbsp;

#### Benchmarks, One Way

Benchmark authoring guidance has a single home in `sk-create-benchmark`. Run and scoring stay with the executing lanes, so authoring the fixtures and owning the run are two different jobs now with two different owners.

`/create:benchmark --family=...` exists as a command surface, with the conformance family dropped alongside the alignment mode it fed. `run-skill-benchmark.cjs` now exits with code 3 on structural or registry blocks instead of 0, so a blocked benchmark can no longer read as a passing one.

The Human Voice Rules moved into their own `sk-create-with-human-voice` mode with a scanner that enforces them.

---

## Prompt Engineering

Prompt work stopped being spread across two skills. It lives in one standalone skill, and the long run of name changes finally settles. The only things you must do are update one command and one skill reference.

#### One Skill for Prompt Craft

`sk-prompt` is the single home for prompt work: seven frameworks, DEPTH thinking and CLEAR scoring behind `/prompt:improve`, with the `@prompt-improver` agent for the deep path. The old command was a 28KB monolith. It is now a thin router with its auto, confirm and presentation pieces split into their own files.

A two-mode hub with per-model profiles was built during the cycle. The per-model profile capability was removed with no replacement, and only the CLI quality card came back to `sk-prompt/assets/`. The six CLI executors each carry a lean card that delegates to the one prompt-quality contract instead of around 90 lines of duplicated quality cards.

&nbsp;

#### The Names Settle

The earlier `sk-improve-prompt` to `sk-prompt` skill rename and `@improve-prompt` to `@prompt-improver` agent rename are final. The standalone `sk-prompt-small-model` and `sk-prompt-models` skills no longer exist, and neither does the intermediate name `sk-prompt-improve` the engine carried mid-cycle. The command is `/prompt:improve`.

---

## Hooks, Goals and the Runtime

The machinery behind your sessions, the goals, the hooks and the background processes that fire on every turn, learned to travel and to stay out of your way. Goals now follow you across four tools, Pi arrived with a fast input path and the whole hook layer became one browsable, switchable library.

#### Goals in OpenCode, Cursor, Pi and Devin

The packet is the goal. A session binds to a spec packet with `bind`, and from then on the packet's `goal.md` is what the runtime injects, rendered from the file on every turn so an edit is seen on the next one. The per-session store keeps only the pointer, liveness and telemetry.

One shared module draws the line between the file's frontmatter and its durable slice, so no chat send, injection or stored objective carries the bookkeeping. When the slice changes, the agent resends it stripped and keeps reminding you to set it, and it never stops working while it waits. Once you set it, it acknowledges in a line and carries on.

The spec kit's validator restores the two checks that had been lost: a parent goal warns past 3,000 characters and fails past 4,000, and a binding row that names a child goal which was never written fails. Devin regained a goal adapter as injection-only, and the `AGENTS.md` root document carries the always-on posture as one row.

Your session goal means the same thing in the four runtimes that carry it. The goal system that started in OpenCode reaches Cursor and Pi through a shared core and a common active-goal store. Devin goal hooks were prototyped, decommissioned, and then regained as an injection-only adapter once the packet became the goal, so Devin receives the brief but has no management command.

Honesty was part of the port. Live capability probes recorded what each tool can do rather than what it claims, so Cursor is marked injection-only and Pi verifies at turn's end but cannot force a continuation. Goals also stopped living as one global singleton: they are stored per workspace, runtime and session, so two projects cannot see each other's goals.

**Breaking:** a goal saved under the old global scheme no longer injects. It sits in a diagnostic-only state until you migrate or archive it.

One late rule closes the loop between the file and your session. Whenever anything above a goal file's log changes, the working agent resends the parent goal's durable slice in chat, frontmatter excluded, so the objective you pasted never drifts from the file.

&nbsp;

#### Pi's Fast Input Path

Pi's input path runs its advisor in-process rather than shelling out to a chain of separate processes, and it caches only fingerprint-backed labels. A repeat prompt resolves from a five-minute cache in about a millisecond. A brand-new prompt still pays a cold start of around 1.3 seconds, and the cache invalidates when a skill changes.

&nbsp;

#### The Hook Library, One Switch

The whole hook layer became one browsable, switchable library.

- **Assembled from source by symlink.** The `.skilled/hooks/` directory gathers every hook through one relative symlink per hook that points back to its real home. A git hook lives in `sk-git`'s scripts, the advisor hook in the advisor package, and so on. It is one place to read without duplicating a line of code.
- **One switch, or twenty-two.** A master `SYSTEM_HOOKS_DISABLED` flag turns the entire cross-runtime layer off at once, with a `SYSTEM_<concern>_DISABLED` flag for each of the twenty-two concerns beneath it. The older `MK_` names are still honored as aliases.
- **See what's on, disable what you want.** The README carries a kill-switch index with every concern, its flag, aliases, default and effect. A gitignored `hook-flags.env`, copied from `hook-flags.env.example`, holds your personal defaults. Live environment values win, and a missing file fails open.
- **Hermes gets the same guards through one plugin.** `.hermes/plugins/repo-guards` runs the shared hook cores from inside a Hermes session, so the rules reach a seventh runtime without a second implementation.

The Gate-3 spec question also stays quiet on read-only turns, and the hook reference docs moved into their owning trees. Small things, no behavior change.

---

## Safer Git

Git is where a mistake costs the most, so this release works two sides of the same problem. Your work follows you everywhere you run, and the destructive paths stop and ask. Your IDE checkout stays current with every parallel session you spawn, while a mass delete, an accidental push and a misnamed branch each picked up a tripwire.

#### Every Commit Reaches Your IDE

Your editor reflects work you never touched in it. A trunk-following pipeline autosyncs each commit from a wrapper-launched Claude, Codex or OpenCode session onto one shared live branch, behind an environment flag, a linked worktree and installed hooks.

The follower daemon that was supposed to keep your IDE checkout current was never auto-started. A SessionStart reconcile now fast-forwards a clean primary checkout instead, so it runs reliably where the daemon did not. When a background session lands work, it is already there when you look.

&nbsp;

#### Remote Push Is Curated by Default

Pushing no longer happens silently. Only `main`, `skilled/v*` releases and names you have added to an allowlist file go up without asking. Every other push needs a fresh, in-the-moment go-ahead.

The rule is enforced twice, as a rule agents must follow and as a `pre-push` hook that also catches human pushes. If you have an in-flight branch that is not on the list, expect it to hit this gate on its next push.

&nbsp;

#### A Fail-Open Guard Against Mass Deletion

A single stale `git add -A` once erased 902 files, and a runaway agent can do the same. That path has a tripwire. A guard blocks any commit or push that removes more than a threshold of tracked files unless you authorize the one operation with an explicit flag. It is live for commits and ready for pushes, and it fails open when it cannot verify, so it never wedges you.

&nbsp;

#### Commits That Read Like a Record

The commit-msg hook now refuses attribution lines outright, and the prepare-commit-msg hook strips them before stamping, so a generated trailer never reaches history. Every commit ends with one `Spec:` line per touched packet, the dominant packet first, and the seven-digit `Commit-Id` the allocator issues.

The history rewrite that applied this to the past takes a subject plan and proves three more invariants before it touches a commit. The route-remint gate's confirmation was corrected to prove the thing it claimed.

&nbsp;

#### Numbered Branch Names

Branches carry a number the tooling issues. Worktree-backed work lives at `worktrees/{NNN}-{slug}` and a worktree-less branch at `branches/{NNN}-{slug}`, each in its own sequence allocated by a locked clone-wide counter, so two sessions cannot grab the same one. The worktree base itself is configurable now, through `SPECKIT_WORKTREE_BASE` or `git config speckit.worktreeBase`, so a worktree can live outside the primary checkout instead of costing every scan a walk through its `node_modules`.

Owner-first names like `<skill>/{NNNN}-{slug}` were tried mid-cycle and are now rejected by the validator. This is a breaking change: older `wt/`-style names no longer conform, though the gate never blocks a `skilled/v*` release. Each live-sync leg carries its own documented disable flag, so you can turn off the reconcile, the publish loop or the whole layer independently.

Also folded in: a command-time advisory surfaces the relevant git rule the moment a git command runs, and the GitKraken MCP is wired in for those who use it.

---

## Agent Discipline

The operating discipline stopped being something you had to hold in your head and became something the framework states for you. The terminal-proof rule, showing evidence before you claim a result, is written into every governing section instead of living as a separate protocol to maintain. A new writing-quality section gives every runtime one place to find the rules for how an answer should read.

#### Terminal Proof Is Now the Law

The rule that a claim needs proof is no longer a separate protocol you opt into and keep in sync. It is distributed across the authorities you already follow: the Four Laws, the Verification Standards, the Blast-Radius rules, a new Final-State Verification gate, Execution Behavior and the Quick Reference. It reads as one coherent instruction rather than a standalone lifecycle block. The per-turn reminder each session shows carries a proof-over-appearance line through the existing governor chain.

&nbsp;

#### Communication Quality Lives in the Repo Rules

How a reply reads is no longer a section of the root document. Thirteen rule files under `repo-rules/`, routed by `REPO RULES.md` and loaded at Gate 5 before a session's first write, carry the thinking and writing discipline: scope, evidence, blast radius, restraint, root cause, honesty, delegation, hub routing and four rules about the reply itself.

- `communication.md` governs the reply as a whole: register, length, filler, numbered steps, the item cap and the close.
- `communication-prose.md` governs the sentence: one idea each, plain words, no em dash, no semicolon, no serial comma.
- `communication-decisions.md` puts the verdict first with one recommended path.
- `communication-handoff.md` ends every turn by naming what is now the operator's to do, after showing the command and its result.

All four carry the prefix, so the reply-governing set is visible in the directory listing. Every rule ends in a self-check, and a corpus checker in CI holds the router rows, the trigger phrases, the links and a 250-line ceiling.

Two guards came from watching sessions fail: a runtime line that asks the model to plan privately is answered in reasoning and never copied into the reply, and numbered steps mean a numbered list, one per line. The root document kept only what binds when nothing else loads, and went from 496 lines to 284 across six passes. Two of those passes were independent reviews that restored root-only logic the cut had dropped.

---

## Plain-English Output

New this release. `sk-communication` is a standalone skill with one lane. The projection lane rewrites terse agent output, the clipped shorthand a CLI emits, into plain English without changing the canonical bytes underneath, and it is off by default until you opt in per machine. A second lane that drew diagrams shipped for part of the cycle and was retired, because what it produced was fenced source rather than a rendered picture, and a runtime's own visual capability does that job.

What the projection lane does:

- Rewrites terse CLI output into readable prose while preserving the exact original, so nothing downstream that reads the canonical output breaks.
- Sends the wording standard itself as the provider instruction. The Human Voice Rules were split into a base every reader loads and a publish supplement only a document needs, and the engine reads the base at call time. No packed copy, no detector set, no second rubric.
- Refuses a rewrite that loses meaning. After the structure, fact, polarity, strength and priority checks, a candidate that drops a claim sentence returns `claim-omitted`, and one that keeps every word while swapping a cause with its effect returns `cause-inverted`. Both fall back to the exact original. An unchanged candidate is recorded as a `no-op`, apart from a `reworded` one.
- Runs privacy-first. It picks a local or hosted rewrite model under explicit privacy and egress rules, with adapters for local engines over an OpenAI-compatible or Ollama transport.
- Wires into every runtime surface, each declaring a full-projection or safe-native tier, and fails closed with content-free telemetry.

A reply benchmark under `benchmark/reply-harness/` measures the rules rather than the models. It freezes seven cases and a negative control, builds one prompt per case from a recorded commit and from the working tree, and scores each reply with the document scanner and one predicate per case. It blinds the two sides for a judge, and runs a release gate that says what it cannot measure.

A case set edited mid-run stops the scoring, because the prompt manifest carries a hash of the cases.

Projection is off for everyone until you opt in on your own machine, one of two ways: set the `COMMUNICATION_PROJECTION_ENABLED` environment variable, or drop a git-ignored `enablement.local.json` holding `{ "enabled": true }` at the package root. Every activation path checks `isProjectionEnabled()` first, and the skill is on the advisor's route-exclusion denylist, so the recommender never surfaces it. Nothing rewrites your output until you flip that switch.

---

## Upgrade Notes

There is no single big migration. The common path still works, your spec paths resolve through a compatibility symlink while you catch up, and the new structural protections are on by default while flag-gated features stay off until you enable them. This release does close out a long chain of renames and removals, and each one is breaking wherever an old reference crosses the boundary. The concrete moves:

- **Renames to adopt.** `@improve-prompt` to `@prompt-improver`. `/prompt` to `/prompt:improve`. `/interface:*` to `/design:extract`, `/design:chart` and `/design:diagram`. `/doc:quality` to the `sk-create-quality-control` packet (the old command is gone). `@create` to `@markdown`. The `/create` commands `sk-skill` to `skill` and `folder_readme` to `readme`. The Gate 3 letters: Update related and Extend phased packet are one option, C) Related, and Skip is D, so anything keyed to `E) Skip` or to five letters must follow. The repo rule `prose-mechanics.md` to `communication-prose.md`. `communication-handoff-and-questions.md` to `communication-handoff.md`, and `communication-presenting-decisions.md` to `communication-decisions.md`. The `create-*` packet directories to `sk-create-*`. The `ai-council/` packet to `deep-ai-council/`. The hub `cli-external` to `cli-external-orchestration`. `sk-prompt-improve` existed briefly as an intermediate name and is retired. The hook master switch `MK_HOOKS_DISABLED` to `SYSTEM_HOOKS_DISABLED`, with the old name still working.

- **Repoint what moved.** The tracked source root now lives under `.skilled/`. `specs` went from `.opencode/specs/` to a top-level `specs/`. The spec-kit engine went from `scripts/` and `mcp-server/` to `.skilled/skills/system-spec-kit/runtime/cli/`. `deep-loop-workflows` and `deep-loop-runtime` merged into `system-deep-loop` and the deep router agent was retired. `mcp-figma` moved under `mcp-tooling/`. The `sk-code` files and routing contract moved under its new mode and surface packets, so anything still pointing at the old flat paths must be updated. Several hubs moved their second-stage router from `shared/references/smart-routing.md` to a root `ROUTER.md`. The `sk-code-review` checklists moved from `references/` to `assets/`. The Human Voice Rules standard moved into `sk-create-with-human-voice/references/` and then split into `hvr-rules.md`, the base, and `hvr-publish-supplement.md`, the document-only half. The deep-loop runtime's `storage/` became `database/`. `deep-review`'s flat reference files regrouped into topic subfolders.

- **Drop removed surfaces.** `memory_search` and `memory_save` are gone with the memory database, the spec-memory MCP server and its daemon. Use `/speckit:search` and the continuity writer. `cli-gemini` and `cli-copilot` are gone, and Copilot-shaped prompts route to Claude Code. Remove the `open_design` server from `.utcp_config.json` and stop referencing `design-generation-patterns.md`. The `pi-subagents` directive, the `deep-alignment` mode and the `sk-prompt-models` skill were all removed before release. `mcp-webflow` and the Ox Alpha routes are gone too. The four `deep_loop_graph_*` MCP tools were removed with no aliases, so a hardcoded caller needs the script path instead. `SPECKIT_DETERMINISTIC_RANKING` was deleted outright, so a set value now does nothing. `/deep:command-benchmark` and the conformance benchmark family went with the alignment mode. The API-key auth paths for Codex and Claude Code are gone, replaced by sign-in. `/rewrite:explain-visually` is gone with the explanation lane. The skill advisor's MCP server and `sk-vision`'s MCP transport are gone, so reach the advisor through `node .skilled/bin/skill-advisor.cjs` and the vision skill through its host plugin, hook or CLI. The skill-benchmark lane of the deep loops is retired. The chart mode dropped its `assets/examples/` deliveries, its `assets/gallery.html` and the cursor Style Reference under `assets/style-reference/cursor/`, so copy a template from `assets/templates/` instead.

- **Changed defaults.** Pi removed its subagents feature, so a Pi session now dispatches `cli-pi` to hand work out, the one carve-out from the self-invocation rule. Goals saved under the old global scheme no longer inject, so migrate or archive them. Only `main`, `skilled/v*` releases and names in your allowlist push without asking. New branches use the numbered form `worktrees/{NNN}-{slug}` or `branches/{NNN}-{slug}`, and owner-first names are rejected. The executor defaults moved too: `cli-opencode` defaults to `opencode-go/deepseek-v4.1-flash --variant max`, the Pi picker defaults to DeepSeek V4.1 Flash on the LLM Gateway with the Astra and OpenRouter entries dropped, and Devin's `swe` alias resolves to SWE-2. Fan-out lanes run on the shared checkout in preserve mode, and per-lane worktrees are off. The commit-msg hook refuses attribution lines, so a tool that appends them will see its trailers stripped. The skill advisor's CLI front door is fail-closed and untrusted by default, and its reciprocal-rank-fusion spine is a shipping default now rather than a dark flag. `sk-vision` is opt-in.

- **Reconcile your own skills.** A step-by-step guide with the decision rule, the single-to-parent procedure using `/create:skill-parent` and the validation steps lives at `sk-create-skill/references/skill/upgrading-a-skill-to-v4.md`.

---

## Appendix: Under the Hood

No user-facing change in this section. It is here so you know what moved underneath.

- **Advisor extracted to its own package.** The advisor became a standalone `system-skill-advisor` package with its own launcher and a renamed database, and every consumer was cut over to the new home.

- **Root routers replace the shared file.** Three hubs replaced `shared/references/smart-routing.md` with a root `ROUTER.md`.

- **The evidence ledger, its protocol and its admission checks.** The deep-loop ledger, protocol and admission work landed after this document's draft. The deep-loop runtime's own records are the durable history.

One deliberate asymmetry is worth knowing before you read the code and think it is a bug. The deep-loop fan-out still maps two model literals to OpenRouter, so the documented direct roster is narrower than the enforced allowlist on purpose. One literal maps to one provider, so deleting that mapping to tidy it would silently move those two models to a different route.

The `.opencode/` spellings in this document are not uniform. The skills, agents and commands trees still answer at their `.opencode/` paths through tracked symlinks into `.skilled/`, the tracked sources themselves live under `.skilled/`, and `.opencode/bin` and `.opencode/hooks` are gone. Read those two from their `.skilled/` locations.
