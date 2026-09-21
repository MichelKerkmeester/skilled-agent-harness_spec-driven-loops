#!/usr/bin/env python3
"""Rewrite the v4 release notes into the root README's presentation style.

The document writes one paragraph per line, so the rewrite replaces whole
lines by their number in the pre-rewrite copy. Every other line is carried
over byte for byte, which is what makes the fact-preservation diff meaningful
instead of aspirational.

Guards: the script refuses to run unless the target still hashes to the copy
the line numbers were taken from, so a concurrent writer cannot be silently
overwritten.

Usage:
    rewrite-changelog.py <changelog> [--apply]
"""
from __future__ import annotations

import argparse
import hashlib
import sys

EXPECTED_SHA256 = "db374129a5184be7428b0c6637a5c1c4eead0991f9350dc1b075d0d94e2c420a"
EXPECTED_LINES = 612

# In-line corrections: line number -> [(old, new)]
CORRECTIONS = {
    21: [("Six hubs now route", "Seven hubs now route")],
    41: [("skill with ten modes", "skill with nine modes")],
    392: [("The other five hubs", "The other six hubs")],
}

# Bullets appended after a corrected line: line number -> [text]
INSERT_AFTER = {
    41: [
        "- **A judgment transport of its own.** `cli-jev` became its own hub, leaving "
        "`cli-external-orchestration` with seven workflow modes. Its one mode, `cli-usage`, asks the "
        "`jev` CLI for a typed verdict and writes nothing into your workspace.",
        "- **The Orca bridge graduated.** The Orca CLI left `mcp-tooling` as a mode and now ships as "
        "the standalone `cli-orca` class-S skill, with one authored reference and one verbatim "
        "snapshot for each of its eight official skills.",
    ],
}

NEW = {
    15: """Most of this does not change how you call the system. The `/deep:*`, `/create:*`, `/design:*` and `/speckit:*` families and the agent names behave as before, a few other names changed, and the specs folder moved to a new root. A symlink and a deliberately tolerant gate keep the old paths alive while you catch up. Two things you may have leaned on are gone for good:

- **The memory database is gone.** The engine behind `memory_search` and `memory_save` was retired, and a committed lexical trigger index plus ripgrep took its place behind `/speckit:search`.
- **The `/interface:*` commands are now `/design:*`.**""",
    53: """You feel this change everywhere. Most of the framework's skills stopped standing alone, and where there used to be a scatter of separate skills, one per workflow, one per stack, one per tool, there is now a small set of parent hubs. Each hub is a thin router that reads what you asked for and hands the request to a mode, and every mode keeps its own behavior underneath.""",
    55: """Six families made the move: code, documentation, design, the deep loops, the MCP bridges and the external CLIs. Prompt craft tried the hub shape too, ran as a two-mode hub for part of the cycle, and went back to a single standalone skill before release. `sk-vision`, `sk-communication`, `sk-git`, `mcp-code-mode`, the spec kit and the advisor round out the standalone skills that stayed that way the whole cycle.

The reasons for the hubs that stuck are practical:""",
    68: """The spec kit changed the most under the surface. The memory database that powered `memory_search` was retired outright, the specs folder moved, the runtime was renamed and nested, and the completion gate was made coherent. Three research rounds then cut the kit back to what a machine reads.

Most of the depth is in what left: an entire retrieval engine replaced by two small lexical tools.""",
    78: """The Spec-Kit Memory engine is gone. The SQLite database, the embedder, the spec-memory MCP server, its daemon and the `memory_search` and `memory_save` tools were decommissioned end to end, first on a side branch and then landed on the release branch and `main`. The `spec-memory` daemon CLI under `.opencode/bin/` and the `system-spec-memory` OpenCode plugin went down with it, since both were doors into the same engine.

What replaced them is deliberately small:

- A committed trigger index is generated from every document's `trigger_phrases` frontmatter.
- A lookup script reads it with no daemon.
- A set of ripgrep recipes handles free text.

All of it sits behind `/speckit:search`, and the kit's own context writer handles continuity. Retrieval is lexical now, and a miss is a clean no-hit rather than a degraded guess. The debt the decommission left, from dangling registrations to a package that still called itself an MCP server, was closed across six review passes.""",
    84: """The surviving package no longer carries an identity it lost. Its engine lives at `.opencode/skills/system-spec-kit/runtime/cli/`:

- `spec/validate.sh`, `spec/create.sh`, `spec/repair-derived.cjs` and `spec/recommend-level.sh` for the packet lifecycle
- `continuity/` for saves
- `spec-folder/` for generated metadata
- `retrieval/` for the trigger index

The old `scripts/` and `mcp-server/` paths are gone, so anything you pinned to them needs repointing. A shared package underneath carries the Gate-3 classifier and the frontmatter parser that every other skill now imports rather than copies.""",
    90: """The spec-folder question offered five options and two of them said the same thing. Update related and Extend phased packet both meant using a packet that already exists, so they merged into one option, Related, which covers another packet, a child under a phase parent, or a standard packet decomposed into phases when it qualifies.

Skip moved from the letter E to D, and the stable labels are now A) Existing, B) New, C) Related and D) Skip. Forty-two surfaces that printed the list were relabelled in one pass, the spec-gate hook's regexes and deny text follow the new letters, and the compiled command contracts were regenerated.

The classifier that decides whether the gate fires was untouched, because it never keyed on the letters. Captured transcripts in the playbooks and benchmark reports keep the old letters, since they record what a run actually printed.""",
    96: """The gate that decides whether a packet may close now returns the same verdict whatever the environment, counts one fault once, and no longer asks a packet for what it cannot satisfy from inside itself. Forty rules are registered, and a warning is advice that does not fail a run.

It grew two checks of its own. Scope adherence refuses a packet whose changed files fall outside what its spec names, driven by `SYSTEM_SCOPE_CHANGED_FILES` and `SYSTEM_SCOPE_BASE`. Acceptance coverage runs on by default as an advisory.

Two documents joined the packet contract. `acceptance-criteria.md` decides closure at Levels 2 and 3, and an optional `goal.md` holds the durable directive you set as the session objective. A repair tool fixes the facts a packet records wrongly but a machine can recompute, such as its folder, level and generated fingerprints. It refuses to invent the facts only a person can write.""",
    108: """With the database gone, three research rounds ran over the kit to find what no longer earned its place: the search system, CLI runtime utilization, the shared package, the template and acceptance-criteria system and plain overengineering. Twenty-two remediation children shipped from them.

They removed the CLI package residue and dead flags, the dead half of the shared package, orphaned decommission paths and a stale command surface, and they realigned templates, doctor signals and playbook paths with the runtime. A follow-up program then closed every finding those rounds had recorded rather than fixed, sixteen children in one day. Nothing from the research survives as a written-down decision.""",
    114: """The spec, plan, tasks and implementation-summary templates were consolidated into one shared core with level-gated addenda. The source dropped to 1,275 lines across four core templates without changing a single rendered byte, and the research template shrinks by level too.

A Level 1 spec now gets a short research doc instead of the full one, and a Level 1 research doc renders at 175 lines instead of 944. You see smaller, level-appropriate templates. What they produce is identical.""",
    120: """For days, every push mailed the operator a "runs failed" notice because a regenerated prompt mirror was never staged, and the pre-commit hook ran one of the six mirror checks CI runs. Now the hook runs all six and blocks any unstaged change under a generated mirror, so drift surfaces on the commit that caused it.

The Spec-Kit Check workflow fires on every mirror source and every mirror output. The four workflows red since the shared-parser adoption were fixed, and the forty-four open Dependabot alerts on the default branch were brought to zero.""",
    130: """The advisor had been leaving litter in spec folders, writing its `.advisor-state` next to whatever directory a session happened to run from. Two changes pull that back toward the repo root: a shared anchored root resolver and a switch from the old specs-only deny-list to a structural boundary that hoists state above the outermost `.opencode`.

The skill graph was tidied in the same pass. Its metadata now points at the tracked source file, a one-identity ingestion hole was closed, and a read-only freshness panel shows you whether the compiled graph is current.""",
    140: """The scorer discarded any word of two characters or fewer before the token lanes ever saw it, which made `pi` invisible to every one of them. The hub scored only where an authored phrase happened to spell the wording out, so `delegate to pi` resolved and `delegate this to pi` returned nothing at all.

Short filler was already handled by the stop-word list, so the length floor was rejecting short content words and nothing else. Lowering it one character restores the lanes for names like `pi` without letting filler back in, measured against the labelled corpus at no change in accuracy.""",
    146: """The advisor no longer speaks MCP. Its daemon answers the same nine commands over a unix socket, and `node .opencode/bin/skill-advisor.cjs <command>` is the one way to reach them, from a hook, a script or a session. The hook brief you see at prompt time resolves through that CLI, so the two routes cannot disagree.

When the daemon is unreachable the CLI falls back to a local scorer and marks the answer degraded, and an empty result from a healthy daemon now reads as no match rather than as an outage. Running the playbook across four runtimes found the last stale command name and a scorer pinned to unreviewed truth, and both were fixed.""",
    162: """Two shapes of skill exist now. A standalone skill is one identity with one job. A parent skill holds no logic of its own: it reads what you asked for and dispatches, through a `mode-registry.json`, to one of its nested modes, keyed by a `workflowMode`.

A mode is one of two kinds:

- a workflow packet that does work
- a read-only surface packet that only supplies evidence

`sk-doc` is the worked example. The parent routes to fourteen `sk-create-*` modes across thirteen packets (`sk-create-skill`, `sk-create-readme`, `sk-create-agent`, `sk-create-diff`, `sk-create-changelog`, `sk-create-repo-rule`, `sk-create-quality-control` and the rest), twelve of them bound to their own `/create:*` command. A nested packet carries no `graph-metadata.json` of its own. It inherits the hub's one advisor identity.""",
    164: """`sk-doc` is also where the shape itself comes from. Its `sk-create-skill` mode scaffolds both kinds, and `/create:skill` stamps out a standalone skill while `/create:skill-parent` stamps out a parent wired to its nested packets.

That scaffold carries the `mode-registry.json` and `hub-router.json` router files, the packets, the README, the agent mirrors, the root `ROUTER.md` that maps intents to leaves, and a routing-drift check that keeps the registry honest against the code. Every parent skill in this release was scaffolded the same verifiable way from this tooling.""",
    166: """A few names you type changed. Four `/create` commands were renamed to match their packet (`sk-skill` became `skill`, `folder_readme` became `readme`, and so on), and the quality packet is `sk-create-quality-control` with the old `/doc:quality` command gone. The authoring agent is now `@markdown`, formerly `@create`, and the packet directories themselves were renamed from `create-*` to `sk-create-*`.""",
    191: """Benchmark authoring guidance has a single home in `sk-create-benchmark`. Run and scoring stay with the executing lanes, so authoring the fixtures and owning the run are two different jobs now with two different owners.

`/create:benchmark --family=...` exists as a command surface, with the conformance family dropped alongside the alignment mode it fed. `run-skill-benchmark.cjs` now exits with code 3 on structural or registry blocks instead of 0, so a blocked benchmark can no longer read as a passing one.""",
    203: """The workflow hub and the runtime it ran on are one skill, `system-deep-loop`. Every downstream reference (commands, agents, READMEs, hooks, advisor routing) was repointed at the new home, and the modes you already use behave as before: research, review, ai-council, agent-improvement and the model benchmark. What changed is the address.

What left the tree along the way:

- The `deep-loop-workflows` and `deep-loop-runtime` skill identities no longer exist, so anything you script that still names one of them now points at a signpost that is not there.
- The skill-benchmark lane was retired late in the cycle.
- The deep router agent was renamed `deep` to `deep-loop`, then retired with its routing folded into the `/deep:*` command bodies, so there is no router agent left to call.

An alignment mode was built during the cycle and removed before release, and the removal took `/deep:command-benchmark` and the conformance benchmark family with it. The `ai-council/` packet was renamed `deep-ai-council/`, and the second-stage router that used to live at `shared/references/smart-routing.md` moved to a root `ROUTER.md`.""",
    222: """A multi-hour fan-out used to be something you ran on a checkout you were not using. A lane that wrote outside its own directory could be rewound by the containment pass, and your own edits with it. Containment now preserves by default: a lane's out-of-scope writes are left where they landed, and a copy of each goes into a quarantine directory beside the run.

The lane's outcome is recorded apart from the containment result, so a lane never fails because a neighbour or you touched a file. Restores are targeted at the baseline the lane started from, never written through a symlink, and a neighbour's `index.lock` is waited out rather than tripped over.

Forced-depth runs fail loudly on an empty record set, an iteration recorded twice is tolerated once, and every direct state-log append now goes through the gateway. Per-lineage worktrees were built as well, then measured: four research lanes on four models agreed that attribution cannot be made exact on a shared tree after the fact. The operator ruled attribution out as a requirement, and the worktree mechanism was removed from the default path.""",
    235: """Because the runtime holds live in-flight state, it could not be swapped in one move. The substrate landed the careful way: additive and dark behind compatibility adapters, proving shadow parity against the existing behavior, then cutting over one mode at a time behind a rollback window.

Every ledger mode is now on the authoritative path. The ledger is the record, the legacy files are produced by projection from it, and a fail-closed guard rejects any out-of-band write to a projected file. Every run is replayable and every transition accountable. The finding dedup and the two progress gauges in the fan-out runtime stay off by default, so you flip them deliberately rather than inherit them.""",
    251: """Codex and Devin are back, Cursor, Pi and Hermes are new, and all five join as deep-loop executors. Each one is gated fail-closed on its own binary being present, with a check like `command -v codex`, `cursor-agent`, `devin`, `pi` or `hermes`. A missing tool never shows up as routable or dispatchable, so it cannot fail partway through a run.

This reverses an earlier quiet removal. Codex and Devin had been deprecated and stripped out, then brought back this same way, so the roster you can use now matches what is installed on your machine.""",
    278: """Hermes Agent (Nous Research, a Python agent CLI) is the seventh runtime, as `cli-hermes`. It dispatches as a quiet oneshot chat with the prompt on stdin, through the operator's LLM Gateway provider and a closed seven-id roster, and it is the eighth deep-loop executor kind.

The repo-root `.hermes/` folder carries:

- generated markdown-only copies of every skill and every agent persona, because Hermes scans a linked directory in full, so the skills tree ships as generated copies rather than links, and the agent tree is a single tracked symlink into `.skilled/agents`
- generated prompt templates
- one project plugin

That plugin bridges eighteen of the twenty-two hook packages into a Hermes session: the skill advisor and spec gate at prompt time, the dispatch, task-dispatch, MCP-route, git and vision guards before a tool call, post-edit quality on a write result, the shared goal core at session start, the session-start advisories, and session cleanup. The four that stay out are runtime-specific by nature.

Every bridge has a live playbook scenario. The packet is `cli-external-orchestration/071-cli-hermes-creation`.""",
    284: """Adding a seventh runtime meant reading the preflight that is supposed to stop a bad dispatch, and it was approving things it declared forbidden. Six conditions were silently passing. The worst was Codex: the dispatch shape that recognises a `codex exec` command was wrong in two places, so no `cli-codex` rule ever loaded and every Codex dispatch went out unchecked.

Hermes fan-out lineages were unguarded for a different reason, because the runner never set the project-plugin opt-in, so the packet and read-only markers the guards read were never visible. The seven `cli-*` packets moved their stdin rule from advice to blocking, a reader-toolset requirement was added, and a preload exemption that excused too much was removed.""",
    334: """The gap between those two is the part worth carrying away. DeepSeek charges two percent of its prompt rate for a cached read, so a very high hit rate converts almost directly into the saving. GLM charges twenty-eight percent, so a good hit rate yields barely half as much.

Same extension, same optimisation, roughly half the value, decided by the rate card. The hit rate in your footer is an input to the saving, not the saving itself.""",
    340: """The Gemini and Copilot bridges were retired in the v3.6 cycle, after the Copilot price hike and the Gemini cleanup made them not worth maintaining, and v4 carried the residual reference cleanup. `cli-gemini` and `cli-copilot` are gone from the skill tree, the advisor's scoring and hub routing.

That is the standalone bridge only. Gemini 3.7 Flash remains reachable through Devin and Cursor, both dispatch-tested, and Copilot-shaped prompts now land on the nearest remaining executor, Claude Code. The Ox Alpha routes were retired too, and Pi's default model was repointed away from them. Only the external binaries in your home directory are left untouched.""",
    350: """The packet is the goal. A session binds to a spec packet with `bind`, and from then on the packet's `goal.md` is what the runtime injects, rendered from the file on every turn so an edit is seen on the next one. The per-session store keeps only the pointer, liveness and telemetry.

One shared module draws the line between the file's frontmatter and its durable slice, so no chat send, injection or stored objective carries the bookkeeping. When the slice changes, the agent resends it stripped and keeps reminding you to set it, and it never stops working while it waits. Once you set it, it acknowledges in a line and carries on.

The spec kit's validator restores the two checks that had been lost: a parent goal warns past 3,000 characters and fails past 4,000, and a binding row that names a child goal which was never written fails. Devin regained a goal adapter as injection-only, and the `AGENTS.md` root document carries the always-on posture as one row.""",
    352: """Your session goal means the same thing in the four runtimes that carry it. The goal system that started in OpenCode reaches Cursor and Pi through a shared core and a common active-goal store. Devin goal hooks were prototyped, decommissioned, and then regained as an injection-only adapter once the packet became the goal, so Devin receives the brief but has no management command.

Honesty was part of the port. Live capability probes recorded what each tool can do rather than what it claims, so Cursor is marked injection-only and Pi verifies at turn's end but cannot force a continuation. Goals also stopped living as one global singleton: they are stored per workspace, runtime and session, so two projects cannot see each other's goals.

**Breaking:** a goal saved under the old global scheme no longer injects. It sits in a diagnostic-only state until you migrate or archive it.

One late rule closes the loop between the file and your session. Whenever anything above a goal file's log changes, the working agent resends the parent goal's durable slice in chat, frontmatter excluded, so the objective you pasted never drifts from the file.""",
    398: """The chart corpus was brought to the shadcn visual register, with three named stock colour systems, their palette source and proof sheets checked in beside the forms. The chart check grew from fifteen named check families to forty-two, three of them browser-backed, so a form cannot drift off the register without a gate going red.

The stock register is the evilcharts Style Reference, derived from a real chart library and carried beside the forms it produced. A cursor-derived register held the role briefly mid-cycle and was removed before release, so the packet ships one reference rather than two. A fresh review of every chart packet was closed before release.""",
    414: """You have a design reference library on your own machine instead of behind someone else's network call. The Refero styles, each carrying four tabs, were pulled into a local token library after a 50-style pilot came back clean. Around it sits a retrieval substrate that picks a style by eligibility first, and behind that a persistent style database built on SQLite with full-text search and vector lookup, so the corpus the modes study is the one you query.

The legacy default stays until you flip it yourself. The md generator also carries a private layer of procedure cards for its extraction work, each step pointing at its own card.""",
    437: """The guidance you get is scoped to both what you are doing and the stack you are doing it to. Every relocated file was repointed, including a pre-commit hygiene gate that had been silently skipped.

The hub move itself was breaking. The later surface additions were not. The routing contract and every skill path shifted under the mode and surface packets, so anything that still points at the old flat paths must be updated.""",
    443: """The review skill stops being a bolt-on. `sk-code-review` was rebuilt as a stack-agnostic review baseline and folded into the hub as a mode. It works on a baseline-plus-overlay precedence model: a shared baseline of findings-first review rules, with stack-specific guidance layered on top rather than each stack carrying its own copy.

It is wired across the review runtime, orchestrators, Codex agents and the advisor, so the same standard shows up everywhere you ask for one. Every review now ends with a plain-text `Review status: APPROVED|REQUESTED_CHANGES|COMMENTED` line. The six reusable checklists moved from `references/` to `assets/`, so anything pinned to the old path needs repointing.""",
    449: """Rust is a first-class citizen on the opencode surface. The standard docs are in place, `.rs` files and Cargo projects are detected and routing covers both child and parent-union layouts, so a Rust change surfaces the Rust guidance instead of the generic fallback.

Language slicing now covers every language a task touches instead of stopping at the first match, so a task spanning two languages pulls both slices. For everyone else, the same pass split 33 oversized reference documents into 104 topic-cohesive parts, so the files you load are shorter and closer to the point.""",
    459: """Your editor reflects work you never touched in it. A trunk-following pipeline autosyncs each commit from a wrapper-launched Claude, Codex or OpenCode session onto one shared live branch, behind an environment flag, a linked worktree and installed hooks.

The follower daemon that was supposed to keep your IDE checkout current was never auto-started. A SessionStart reconcile now fast-forwards a clean primary checkout instead, so it runs reliably where the daemon did not. When a background session lands work, it is already there when you look.""",
    465: """Pushing no longer happens silently. Only `main`, `skilled/v*` releases and names you have added to an allowlist file go up without asking. Every other push needs a fresh, in-the-moment go-ahead.

The rule is enforced twice, as a rule agents must follow and as a `pre-push` hook that also catches human pushes. If you have an in-flight branch that is not on the list, expect it to hit this gate on its next push.""",
    477: """The commit-msg hook now refuses attribution lines outright, and the prepare-commit-msg hook strips them before stamping, so a generated trailer never reaches history. Every commit ends with one `Spec:` line per touched packet, the dominant packet first, and the seven-digit `Commit-Id` the allocator issues.

The history rewrite that applied this to the past takes a subject plan and proves three more invariants before it touches a commit. The route-remint gate's confirmation was corrected to prove the thing it claimed.""",
    483: """Branches carry a number the tooling issues. Worktree-backed work lives at `worktrees/{NNN}-{slug}` and a worktree-less branch at `branches/{NNN}-{slug}`, each in its own sequence allocated by a locked clone-wide counter, so two sessions cannot grab the same one. The worktree base itself is configurable now, through `SPECKIT_WORKTREE_BASE` or `git config speckit.worktreeBase`, so a worktree can live outside the primary checkout instead of costing every scan a walk through its `node_modules`.

Owner-first names like `<skill>/{NNNN}-{slug}` were tried mid-cycle and are now rejected by the validator. This is a breaking change: older `wt/`-style names no longer conform, though the gate never blocks a `skilled/v*` release. Each live-sync leg carries its own documented disable flag, so you can turn off the reconcile, the publish loop or the whole layer independently.""",
    495: """`sk-prompt` is the single home for prompt work: seven frameworks, DEPTH thinking and CLEAR scoring behind `/prompt:improve`, with the `@prompt-improver` agent for the deep path. The old command was a 28KB monolith. It is now a thin router with its auto, confirm and presentation pieces split into their own files.

A two-mode hub with per-model profiles was built during the cycle. The per-model profile capability was removed with no replacement, and only the CLI quality card came back to `sk-prompt/assets/`. The six CLI executors each carry a lean card that delegates to the one prompt-quality contract instead of around 90 lines of duplicated quality cards.""",
    511: """Every application bridge lives under a single `mcp-tooling` parent, so the browser, ClickUp, Notion and design tools are one skill with nine modes that reads which mode you want and routes to it. `mcp-code-mode`, the execution substrate every MCP call runs through, stays a standalone skill outside the hub.

`mcp-tooling` meets the full documentation and routing standard and ships the feature catalogs, install front doors and worked examples the other parents already had. The router underneath does what its name promises, backed by a hard gate that refuses to ship if any packet routes wrong.

`mcp-webflow` was removed from the hub, and the fold-in that brought the other three bridges in moved three skills at once: `mcp-chrome-devtools`, `mcp-click-up` and `mcp-figma` together, not only Figma.""",
    531: """`mcp-obsidian` walks your notes vault out to the terminal. One mode covers a headless notes CLI, the official app-backed CLI and a community MCP server, with a feature catalog and references for the plugins you are most likely to lean on. The mode's plugin roster was pruned along the way: Excalidraw, Project Manager and Beancount were removed.

The official CLI's contract was corrected too, to `obsidian help`, and the false claim that the CLI launches the app was removed. The work is honest about its rough edges: title search is broken headlessly, so the mode uses content search instead, and the installed REST API exposes a different tool set than the documented server, a gap still awaiting reconciliation.""",
    537: """The one change here you may need to act on is a path move, not a removal. The `mcp-figma` skill was folded into the `mcp-tooling` parent as a transport mode, and it lives at `.opencode/skills/mcp-tooling/mcp-figma/` instead of the old flat `.opencode/skills/mcp-figma/`. It stays fully registered and routable.

The three former bridges, Figma among them, lost their own `graph-metadata.json` and route only through the hub identity now. If you had scripts or habits pinned to the old flat path, repoint them. Nothing about how Figma work runs has changed.""",
    553: """How a reply reads is no longer a section of the root document. Thirteen rule files under `repo-rules/`, routed by `REPO RULES.md` and loaded at Gate 5 before a session's first write, carry the thinking and writing discipline: scope, evidence, blast radius, restraint, root cause, honesty, delegation, hub routing and four rules about the reply itself.

- `communication.md` governs the reply as a whole: register, length, filler, numbered steps, the item cap and the close.
- `communication-prose.md` governs the sentence: one idea each, plain words, no em dash, no semicolon, no serial comma.
- `communication-decisions.md` puts the verdict first with one recommended path.
- `communication-handoff.md` ends every turn by naming what is now the operator's to do, after showing the command and its result.

All four carry the prefix, so the reply-governing set is visible in the directory listing. Every rule ends in a self-check, and a corpus checker in CI holds the router rows, the trigger phrases, the links and a 250-line ceiling.

Two guards came from watching sessions fail: a runtime line that asks the model to plan privately is answered in reasoning and never copied into the reply, and numbered steps mean a numbered list, one per line. The root document kept only what binds when nothing else loads, and went from 496 lines to 284 across six passes. Two of those passes were independent reviews that restored root-only logic the cut had dropped.""",
    569: """A reply benchmark under `benchmark/reply-harness/` measures the rules rather than the models. It freezes seven cases and a negative control, builds one prompt per case from a recorded commit and from the working tree, and scores each reply with the document scanner and one predicate per case. It blinds the two sides for a judge, and runs a release gate that says what it cannot measure.

Run on GLM-5.3-Flash and Sonnet 5 it showed the first-line contract, the closing contract and the item cap each moving one model and not the other, and the operator chose to accept the flat list on the model that kept printing it. A case set edited mid-run stops the scoring, because the prompt manifest carries a hash of the cases.""",
}


def document_shape(lines):
    """Heading and separator counts, the skeleton a voice rewrite must not move."""
    return (
        sum(1 for line in lines if line.startswith("## ")),
        sum(1 for line in lines if line.startswith("#### ")),
        sum(1 for line in lines if line == "---"),
        sum(1 for line in lines if line.strip() == "&nbsp;"),
    )


def sha256(path: str) -> str:
    with open(path, "rb") as handle:
        return hashlib.sha256(handle.read()).hexdigest()


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("target")
    parser.add_argument("--apply", action="store_true")
    args = parser.parse_args()

    actual = sha256(args.target)
    if actual != EXPECTED_SHA256:
        print(f"refusing to rewrite: {args.target} hashes to {actual}, expected {EXPECTED_SHA256}")
        return 1

    lines = open(args.target, encoding="utf-8").read().split("\n")
    if len(lines) != EXPECTED_LINES:
        print(f"refusing to rewrite: {len(lines)} lines, expected {EXPECTED_LINES}")
        return 1

    updated = list(lines)

    # Every key is a line number in the pre-rewrite copy, so the replacements
    # and the corrections land before any insertion shifts the lines below them.
    for number, replacements in CORRECTIONS.items():
        text = updated[number - 1]
        for old, new in replacements:
            if old not in text:
                print(f"refusing to rewrite: line {number} does not contain {old!r}")
                return 1
            text = text.replace(old, new)
        updated[number - 1] = text

    for number in sorted(NEW, reverse=True):
        updated[number - 1] = NEW[number]

    for number, bullets in INSERT_AFTER.items():
        updated[number - 1 : number] = [updated[number - 1]] + bullets

    before_shape = document_shape(lines)
    after_shape = document_shape(updated)
    if before_shape != after_shape:
        print(f"refusing to rewrite: heading and separator counts moved {before_shape} -> {after_shape}")
        return 1

    text = "\n".join(updated)
    if args.apply:
        with open(args.target, "w", encoding="utf-8") as handle:
            handle.write(text)
        print(f"rewrote {args.target}: {len(updated)} lines")
    else:
        print(f"dry run: {len(updated)} lines, no write")

    unchanged = sum(1 for a, b in zip(lines, updated) if a == b)
    print(f"lines carried over byte for byte: {unchanged} of {len(lines)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
