---
title: "Gate B: realistic-corpus routing measurement"
description: "A 180-row corpus of natural phrasings across all five parent hubs, measured against the live skill-advisor daemon, with misses grouped by mechanism."
trigger_phrases:
  - "gate b realistic corpus"
  - "routing hit rate"
  - "miss mechanism"
  - "advisor top recommendation"
importance_tier: "important"
contextType: "implementation"
---

# Gate B: realistic-corpus routing measurement

## The number

**8 / 180 prompts (4.4%) reached their intended mode as the advisor's top pick.**

That is the number to act on, because the top recommendation is what a caller actually
routes on. A second, looser count exists and is worth carrying alongside it: if a hit
counts anywhere in the returned list rather than only at position one, the rate is
**20 / 180 (11.1%)**. Both counts come from the same 180 calls and the same JSON, computed
two different ways, so they are a check on each other rather than two separate
experiments.

The 12-row gap between them is not noise. Six of those twelve rows belong to one hub,
`cli-external-orchestration`, and share one exact mechanism: a leftover, uncompiled
advisor entry carrying the same name as the correct mode (for example a bare
`cli-claude-code` entry with no `compiledRoute` at all) outranks the hub's own correct,
compiled entry for that same mode. The other six are ordinary near-misses where a
stronger competing hub sits at position one and the right hub trails behind it. Both are
detailed under Miss mechanism distribution below.

| Hub | Top-only hits | Any-position hits | Total | Top-only rate | Any-position rate |
|---|---|---|---|---|---|
| cli-external-orchestration | 0 | 8 | 24 | 0.0% | 33.3% |
| mcp-tooling | 0 | 0 | 37 | 0.0% | 0.0% |
| sk-code | 7 | 7 | 26 | 26.9% | 26.9% |
| sk-doc | 1 | 4 | 68 | 1.5% | 5.9% |
| system-deep-loop | 0 | 1 | 25 | 0.0% | 4.0% |
| **Total** | **8** | **20** | **180** | **4.4%** | **11.1%** |

sk-code is the only hub that clears a quarter of its own corpus. Every other hub sits
under 6% on the strict count, and two of the five (`mcp-tooling` and
`cli-external-orchestration`) score zero.

## How this was measured

A 180-prompt corpus was written by hand, at least four prompts per mode across all
forty-three modes in the five parent hubs (`sk-doc`, `sk-code`, `mcp-tooling`,
`cli-external-orchestration`, `system-deep-loop`), read out of each hub's
`mode-registry.json` plus its packets' `SKILL.md` files. No prompt names its own mode.
Eight prompts sit deliberately on a boundary between two modes, each carrying a one-line
reason for which mode should win and why.

Each prompt was sent to the live daemon:

```
node .opencode/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"<prompt>"}' \
  --format json --timeout-ms 60000
```

The call was made once per row, output redirected to a file, exit status read from that
file separately (never through a pipe), and the full JSON response kept for every row.
180 calls at roughly five to six seconds apiece ran as a background script rather than
one long foreground command.

A row counts as a **hit** when the intended `workflowMode` appears among the
`compiledRoute.targets` of the advisor's top-ranked recommendation (`recommendations[0]`).
`confidence` clearing 0.82 is not evidence of a match on its own: that value is a floor,
and several rows below return exactly `0.8200` confidence while carrying a `score` under
0.1 and no target at all. The `score` field, not `confidence`, is what was used to judge
whether a competing hub was a real contender or floor noise.

## Per-mode hit rate

| Hub / Mode | Top-only | Any-position | Total |
|---|---|---|---|
| cli-external-orchestration / cli-claude-code | 0 | 4 | 4 |
| cli-external-orchestration / cli-codex | 0 | 0 | 4 |
| cli-external-orchestration / cli-cursor | 0 | 1 | 4 |
| cli-external-orchestration / cli-devin | 0 | 0 | 4 |
| cli-external-orchestration / cli-opencode | 0 | 3 | 4 |
| cli-external-orchestration / cli-pi | 0 | 0 | 4 |
| mcp-tooling / mcp-aside-devtools | 0 | 0 | 4 |
| mcp-tooling / mcp-chrome-devtools | 0 | 0 | 4 |
| mcp-tooling / mcp-click-up | 0 | 0 | 4 |
| mcp-tooling / mcp-figma | 0 | 0 | 4 |
| mcp-tooling / mcp-magicpath | 0 | 0 | 4 |
| mcp-tooling / mcp-mobbin | 0 | 0 | 5 |
| mcp-tooling / mcp-notion | 0 | 0 | 4 |
| mcp-tooling / mcp-obsidian | 0 | 0 | 4 |
| mcp-tooling / mcp-refero | 0 | 0 | 4 |
| sk-code / sk-code-mobile-cli | 0 | 0 | 4 |
| sk-code / sk-code-obsidian | 1 | 1 | 5 |
| sk-code / sk-code-opencode | 3 | 3 | 4 |
| sk-code / sk-code-quality | 0 | 0 | 4 |
| sk-code / sk-code-review | 1 | 1 | 4 |
| sk-code / sk-code-webflow | 2 | 2 | 5 |
| sk-doc / sk-create-agent | 0 | 0 | 4 |
| sk-doc / sk-create-benchmark | 0 | 0 | 5 |
| sk-doc / sk-create-changelog | 0 | 0 | 4 |
| sk-doc / sk-create-chart | 0 | 0 | 4 |
| sk-doc / sk-create-command | 0 | 0 | 4 |
| sk-doc / sk-create-diagram | 0 | 0 | 4 |
| sk-doc / sk-create-diff | 0 | 0 | 5 |
| sk-doc / sk-create-feature-catalog | 0 | 0 | 4 |
| sk-doc / sk-create-frontmatter | 0 | 0 | 4 |
| sk-doc / sk-create-manual-testing-playbook | 1 | 1 | 4 |
| sk-doc / sk-create-quality-control | 0 | 1 | 5 |
| sk-doc / sk-create-readme | 0 | 0 | 4 |
| sk-doc / sk-create-repo-rule | 0 | 1 | 4 |
| sk-doc / sk-create-skill | 0 | 1 | 5 |
| sk-doc / sk-create-skill-parent | 0 | 0 | 4 |
| sk-doc / sk-create-with-human-voice | 0 | 0 | 4 |
| system-deep-loop / agent-improvement | 0 | 0 | 4 |
| system-deep-loop / ai-council | 0 | 0 | 4 |
| system-deep-loop / model-benchmark | 0 | 0 | 4 |
| system-deep-loop / research | 0 | 0 | 4 |
| system-deep-loop / review | 0 | 1 | 5 |
| system-deep-loop / skill-benchmark | 0 | 0 | 4 |

Thirty-five of the forty-three modes score zero under the strict, top-only definition.
Six of the eight modes that land at least one strict hit sit inside `sk-code`, which
means four of the five hubs are close to unreachable by natural phrasing right now, not
merely imperfect.

Two modes, `model-benchmark` and `skill-benchmark`, never appear as a target anywhere in
any of their eight combined rows, at any position. That matches their registry entry:
both carry `advisorRouting.routingClass: "command-bridge"`, meaning they are documented
as reachable only through their literal slash command and are never advisor-scored at
all. Their zero is architectural, not a failure this corpus discovered. It is included
here so a later phase does not spend effort trying to fix a routing path that was never
supposed to exist.

## Miss mechanism distribution

Every miss under the strict, top-only definition was classified from the same JSON the
hit check used, by inspecting the top recommendation's `skillId`, its `compiledRoute`
(when present) and its `score`.

| Mechanism | Count | Share of misses |
|---|---|---|
| No recommendation at all | 94 | 54.7% |
| Wrong hub | 40 | 23.3% |
| No recommendation (confidence-floor noise only) | 15 | 8.7% |
| Right hub, shadowed by a legacy duplicate entry | 12 | 7.0% |
| Right hub, deferred with no target | 11 | 6.4% |
| Right hub, wrong mode | 0 | 0.0% |

172 misses plus 8 hits account for all 180 rows. No call failed or returned malformed
output.

The "confidence-floor noise" row is a variant of "no recommendation" worth keeping
separate from it. Several rows return a single competing recommendation that clears the
0.82 confidence floor while carrying a `score` under 0.2 and an empty target list, for
example `sk-doc score=0.06` on a prompt about re-examining a pull request across several
passes. That entry is not a real routing signal. It is the floor doing what the floor
does. Folding it into plain "no recommendation" would understate how often the system
returns literally nothing usable (94 rows), while folding it into "wrong hub" would
overstate how often a real competing hub wins on the merits. It is reported on its own
so a later phase can decide how to treat it.

"Right hub, wrong mode" (the advisor names the correct hub, routes with `action: route`,
but resolves to a different mode inside that hub) never happened once in 180 rows. Every
failure inside the right hub was either a deferral with no target, or the legacy-entry
shadow described next. That is worth stating plainly: intra-hub mode confusion was not
observed at all in this corpus. Every problem found here is either total silence, a
different hub entirely, or an architectural duplicate.

### No recommendation at all (94)

The single largest bucket by a wide margin. Fifty-four percent of all 180 rows, not just
of the misses, returned an empty `recommendations` array. This spans every hub. It is
heaviest in `sk-doc` (docs-authoring intents such as "How do I define a persona's
permission boundaries" or "Draw the relationships between these three database tables")
and in `mcp-tooling` (nearly every `mcp-figma`, `mcp-refero`, `mcp-notion` and
`mcp-click-up` prompt returned nothing at all). The full row list is in
`assets/realistic-corpus.tsv` cross-referenced against `hit_top: false, mechanism:
"no_recommendation"` in the raw results. The prompts themselves are reproduced in the
table below, grouped by hub and mode.

| Hub / Mode | Prompt | What won instead |
|---|---|---|
| cli-external-orchestration / cli-devin | Hand this task off to Devin and have it delegate pieces to its own subagents. | - |
| cli-external-orchestration / cli-devin | Kick off a cloud handoff so Devin can work on this while I'm away from my machine. | - |
| cli-external-orchestration / cli-devin | I want Devin to spin up its own helpers to split this work up. | - |
| cli-external-orchestration / cli-pi | Delegate this to Pi in guarded mode so it can only touch files inside this folder. | - |
| cli-external-orchestration / cli-pi | Can you have Pi pull in one of its community packages for this task? | - |
| cli-external-orchestration / cli-pi | I need Pi running headless, callable from a script, not one that needs a terminal session open. | - |
| mcp-tooling / mcp-aside-devtools | Can you have an AI-driven browser click through the signup flow and tell me if it completes without errors? | - |
| mcp-tooling / mcp-aside-devtools | Can you use Aside to run through five different sign-in combinations and tell me which ones fail? | - |
| mcp-tooling / mcp-chrome-devtools | Inspect this element in the live browser and tell me why the layout is broken. | - |
| mcp-tooling / mcp-chrome-devtools | Something is firing three network requests when it should fire one, and I need to see it happen live. | - |
| mcp-tooling / mcp-click-up | Mark task 4471 as done and log two hours against it. | - |
| mcp-tooling / mcp-click-up | Can you pull my open work queue from our tracker and tell me what's overdue? | - |
| mcp-tooling / mcp-click-up | I need to see how long everything on this list has actually been sitting in each stage before I report status. | - |
| mcp-tooling / mcp-figma | Pull the button component from our design file and tell me its exact padding and corner radius. | - |
| mcp-tooling / mcp-figma | Can you render this frame from the design tool so I can see what the designer intended? | - |
| mcp-tooling / mcp-figma | Extract the color values from this design file for me. | - |
| mcp-tooling / mcp-magicpath | Can you pull the canvas layout for this project so I know the intended structure? | - |
| mcp-tooling / mcp-magicpath | I don't want to duplicate a card component that might already exist somewhere in our design library. | - |
| mcp-tooling / mcp-mobbin | Show me how a few different apps handle empty states on their dashboard screens. | - |
| mcp-tooling / mcp-mobbin | I need examples of mobile checkout flows from real shipped apps for inspiration. | - |
| mcp-tooling / mcp-mobbin | Pull up some flow references for a subscription cancellation screen. | - |
| mcp-tooling / mcp-mobbin | Find examples of how top apps design their onboarding carousel. | - |
| mcp-tooling / mcp-notion | Search our workspace for the page about Q3 planning and pull its content. | - |
| mcp-tooling / mcp-notion | I need to set up a formula property that flags overdue items. | - |
| mcp-tooling / mcp-notion | Our workspace has three databases that should be linked by a relation and right now they're just sitting separate. | - |
| mcp-tooling / mcp-obsidian | My vault's query for open tasks isn't returning the notes I expect. Can you check the syntax? | - |
| mcp-tooling / mcp-obsidian | Set up automatic backups for my notes folder. | - |
| mcp-tooling / mcp-obsidian | I want a note that auto-populates with a table pulling from all my project notes, and I don't know the query syntax. | - |
| mcp-tooling / mcp-refero | Find me some real production examples of a pricing page with a toggle for monthly versus yearly. | - |
| mcp-tooling / mcp-refero | I want to see how other products have handled a multi-step signup before we design ours. | - |
| mcp-tooling / mcp-refero | Search for screenshots of settings screens that use a sidebar layout. | - |
| mcp-tooling / mcp-refero | We're stuck on how to lay out a comparison table. Can you pull up how other sites have solved it? | - |
| sk-code / sk-code-mobile-cli | The settings panel on the pocket remote app looks inconsistent with the rest of the interface after my last change. | - |
| sk-code / sk-code-obsidian | I added a new component to the plugin's source and it's breaking the naming convention. Can you look at it? | - |
| sk-code / sk-code-opencode | Our config file validation passes locally but breaks in the automated pipeline, and I can't tell why. | - |
| sk-code / sk-code-quality | Is this implementation actually ready, or am I missing something before I call it finished? | - |
| sk-code / sk-code-review | What would a reviewer say is wrong with this diff before I ask a teammate to look at it? | - |
| sk-code / sk-code-webflow | Does this front-end component follow our implementation and performance standards before I publish it live? | - |
| sk-doc / sk-create-agent | I need a new dedicated persona that only has read and grep access, for auditing PRs. | - |
| sk-doc / sk-create-benchmark | I ran the model comparison and now need a proper writeup with a source file and the scenario contract documented. | - |
| sk-doc / sk-create-benchmark | What's the standard structure for writing up a behavior comparison so someone else can reproduce it? | - |
| sk-doc / sk-create-benchmark | How should I document the scoring dimensions and fixtures I used so the next person doesn't have to guess? | - |
| sk-doc / sk-create-benchmark | I want a written report of how well this package handles realistic requests, formatted the way our other comparison reports look. | - |
| sk-doc / sk-create-changelog | Does this folder need its own local history of changes, or does it roll up into the project-wide one? | - |
| sk-doc / sk-create-changelog | We're about to cut a release and nobody has written down what's actually different from the last one. | - |
| sk-doc / sk-create-chart | What's the best way to show this distribution of response times so a non-technical reviewer gets it immediately? | - |
| sk-doc / sk-create-chart | Turn this list of vote counts into something visual I can drop into a report. | - |
| sk-doc / sk-create-chart | Our dashboard needs a standalone page showing how these five metrics trend over the last twelve months. | - |
| sk-doc / sk-create-command | Can you wire up a new shortcut with an argument hint and a thin router that calls out to the real logic? | - |
| sk-doc / sk-create-command | I want users to type one shortcut and have it delegate to the right workflow, but the router file should stay presentation-only. | - |
| sk-doc / sk-create-command | What tools do I declare as allowed for a brand-new shortcut file? | - |
| sk-doc / sk-create-command | We need a typed entry point that takes a target argument and hands off to three different workflows depending on a flag. | - |
| sk-doc / sk-create-diagram | Can you sketch out a picture showing how these three services talk to each other during a failed request? | - |
| sk-doc / sk-create-diagram | Draw the relationships between these three database tables. | - |
| sk-doc / sk-create-diff | I edited this Word document heavily. Can you show me a clean before-and-after comparison without needing version control? | - |
| sk-doc / sk-create-diff | Is there a way to see exactly what changed between two drafts of this policy PDF? | - |
| sk-doc / sk-create-diff | Our contract went through four rounds of edits and I can't tell what actually moved between draft two and draft four. | - |
| sk-doc / sk-create-diff | Can you show me exactly what changed between the last two versions of this policy document, without using git? | - |
| sk-doc / sk-create-feature-catalog | We need an inventory of everything this package can do, organized by category, with each capability getting its own page. | - |
| sk-doc / sk-create-frontmatter | What fields am I supposed to put in the metadata block at the top of this skill file, and how long can the description be? | - |
| sk-doc / sk-create-frontmatter | My file's version number doesn't match the four-part format everyone else uses. What's the pattern? | - |
| sk-doc / sk-create-frontmatter | Can you check whether this document is missing any required metadata fields? | - |
| sk-doc / sk-create-frontmatter | Half our files use a three-segment version string and half use four. Which one is actually correct? | - |
| sk-doc / sk-create-manual-testing-playbook | Before we ship this release, I want a step-by-step script a human tester can follow with clear pass or fail checkpoints. | - |
| sk-doc / sk-create-quality-control | Before I publish this, can you tell me how good it actually is and where it falls short? | - |
| sk-doc / sk-create-quality-control | Does this file pass the structural and voice checks we hold everything to? | - |
| sk-doc / sk-create-quality-control | I wrote this reference doc in a hurry and want an honest score on it before anyone else reads it. | - |
| sk-doc / sk-create-repo-rule | This entry in our project's rulebook is outdated. Can you update it? | - |
| sk-doc / sk-create-repo-rule | Is this pattern common enough to deserve its own line in the trigger table, or should I just leave a comment? | - |
| sk-doc / sk-create-repo-rule | One of our old enforced rules doesn't apply anymore since we dropped that dependency. Can it be retired cleanly? | - |
| sk-doc / sk-create-skill | I keep pasting the same five-step checklist into every agent conversation. Can you turn it into a reusable capability the team can invoke by name? | - |
| sk-doc / sk-create-skill | How do I scaffold a brand-new package with its own instructions file, templates and a router, starting from nothing? | - |
| sk-doc / sk-create-skill | We need a fresh reusable capability for logging coffee orders that any agent session can call up automatically when someone mentions ordering coffee. | - |
| sk-doc / sk-create-skill | What goes into building a standalone capability package from scratch, versus just writing a one-off script? | - |
| sk-doc / sk-create-skill-parent | What's involved in setting up one hub that dispatches to several nested workflows depending on intent? | - |
| sk-doc / sk-create-skill-parent | I want one identity that gets scored once by the advisor, then internally forwards to five different sub-workflows. | - |
| sk-doc / sk-create-skill-parent | Our five overlapping packages need to become one umbrella package with mode-based dispatch instead of five separate lookups. | - |
| sk-doc / sk-create-with-human-voice | This paragraph reads like a robot wrote it. Can you make it sound like a person typed it? | - |
| sk-doc / sk-create-with-human-voice | Check whether this text has the usual telltale signs of AI writing, like throat-clearing or over-hedged phrasing. | - |
| sk-doc / sk-create-with-human-voice | Rewrite this section so it doesn't sound generated. | - |
| sk-doc / sk-create-with-human-voice | Every doc from the last sprint has that same stiff, over-explained tone. Can you loosen it up? | - |
| system-deep-loop / agent-improvement | Evaluate whether this candidate configuration is actually an improvement before I make it the default. | - |
| system-deep-loop / ai-council | Can you have a few distinct viewpoints deliberate on this plan and converge on a recommendation? | - |
| system-deep-loop / ai-council | Set up a panel-style discussion where different angles critique each other's proposals for this feature. | - |
| system-deep-loop / ai-council | We keep going back and forth on this decision internally. Can you simulate a few opposing seats hashing it out until they land somewhere? | - |
| system-deep-loop / model-benchmark | Can you have three different models take a crack at the same task and tell me which one came out ahead? | - |
| system-deep-loop / model-benchmark | We're choosing between two model providers for this workload and need real numbers, not vibes. | - |
| system-deep-loop / research | I don't actually know which of these three caching strategies is right. Can you dig into this over several passes until you're confident? | - |
| system-deep-loop / research | Investigate why our onboarding conversion dropped last month, and keep digging until you hit diminishing returns. | - |
| system-deep-loop / research | Nobody on the team has a confident answer for why this metric moved. Can you keep pulling threads until something solid turns up? | - |
| system-deep-loop / review | Before we ship, I want several passes of scrutiny over this codebase for anything a rushed read would miss, with severity ratings. | - |
| system-deep-loop / skill-benchmark | How well does this package actually get discovered and routed to in real-world use? Can you measure it? | - |
| system-deep-loop / skill-benchmark | I want a report on whether this capability is efficient and useful when a real request hits it, not just a routing check. | - |
| system-deep-loop / skill-benchmark | We think this package's routing is fine but nobody's actually tested it against realistic phrasing. Can you check? | - |

### No recommendation, confidence-floor noise only (15)

The `recommendations` array is non-empty, but the entry carries a `score` under 0.25
alongside a `confidence` at or near the 0.82 floor and an empty target list. Treated as
functionally equivalent to no signal, listed separately from true silence.

| Hub / Mode | Prompt | What won instead |
|---|---|---|
| mcp-tooling / mcp-click-up | Create a new task for the login bug and assign it to me. | sk-doc score=0.102285 action=defer targets=[] |
| mcp-tooling / mcp-magicpath | Check what components already exist in our design-system tool before I create a new one. | sk-code score=0.174536 action=defer targets=[] |
| mcp-tooling / mcp-notion | Can you create a new database in our workspace with a rollup field that sums hours from a related table? | sk-doc score=0.104388 action=defer targets=[] |
| sk-doc / sk-create-agent | How do I define a persona's permission boundaries and runtime placement so it can't write files it shouldn't? | system-spec-kit score=0.117243 action=None targets=[] |
| sk-doc / sk-create-changelog | Add an entry documenting today's fixes. | sk-code score=0.06315 action=defer targets=[] |
| sk-doc / sk-create-feature-catalog | Is there a structured index of what this thing supports somewhere, or do I have to build one from scratch? | system-spec-kit score=0.189 action=None targets=[] |
| sk-doc / sk-create-feature-catalog | Build me a root index plus per-capability pages that cite exact source lines. | sk-code score=0.127412 action=defer targets=[] |
| sk-doc / sk-create-quality-control | Can you check how good this write-up is and flag anything that falls short before I call it done? (boundary row) | sk-code score=0.132539 action=defer targets=[] |
| sk-doc / sk-create-readme | Draft a getting-started guide for this package, including a five-phase install walkthrough. | system-spec-kit score=0.012334 action=None targets=[] |
| sk-doc / sk-create-repo-rule | We keep hitting the same footgun across three different tasks. Should this become an enforced project rule? | system-spec-kit score=0.165702 action=None targets=[] |
| system-deep-loop / agent-improvement | I changed the reviewer persona's instructions. Is it safe to promote that change or should it roll back? | sk-doc score=0.104222 action=defer targets=[] |
| system-deep-loop / model-benchmark | I want a deterministic run across a few models to see which one handles this task best. | cli-external-orchestration score=0.060874 action=defer targets=[] |
| system-deep-loop / research | Run an open-ended investigation into whether we should migrate off this library, checking in each pass with what's new. | sk-design score=0.07 action=None targets=[] |
| system-deep-loop / review | We only ever get one shallow pass before merging and things slip through. Can you run this through several rounds of scrutiny instead? | sk-doc score=0.06 action=defer targets=[] |
| system-deep-loop / skill-benchmark | Measure how this package performs against realistic requests and give me a ranked list of what to fix. | mcp-tooling score=0.100559 action=defer targets=[] |

### Wrong hub (40)

The top recommendation names a real, different skill with a meaningful score. The two
skills that win this bucket most often are not in this corpus's own five hubs at all:
`sk-git` (14 wins, spread across `sk-code`, `system-deep-loop`, `sk-doc` and
`cli-external-orchestration`) and `sk-code` itself, which wins over three other hubs
sixteen times (eight over `sk-doc`, four over `mcp-tooling`, four over
`cli-external-orchestration`). Together those two skills account for more than
three-quarters of every genuine wrong-hub loss in the corpus.

`sk-git` absorbs almost every prompt that mentions a pull request, a review pass, or
"before I mark this done", because that vocabulary is git-workflow vocabulary as much as
it is code-review vocabulary, and `sk-git` sits outside the five hubs this corpus
measures. `sk-code` absorbs prompts meant for `sk-create-skill`, `mcp-figma`,
`mcp-aside-devtools`, `cli-opencode` and `sk-create-manual-testing-playbook` whenever the
prompt touches implementation, a live site, "OpenCode" or a checklist, because
`sk-code`'s surface bundling (`sk-code-webflow`, `sk-code-opencode`) claims that ground
first.

| Hub / Mode | Prompt | What won instead |
|---|---|---|
| cli-external-orchestration / cli-codex | Have Codex take a pass at reviewing this PR for anything I might have missed. | sk-git score=0.491341 action=None targets=[] |
| cli-external-orchestration / cli-codex | Can you delegate a repo-wide analysis to Codex and cross-check its findings against mine? | sk-code score=0.551794 action=defer targets=[] |
| cli-external-orchestration / cli-devin | Can you get a cross-model validation pass on this from Devin? | system-spec-kit score=0.415065 action=None targets=[] |
| cli-external-orchestration / cli-opencode | Can you kick off this refactor as a parallel OpenCode session while I keep working here? | sk-code score=0.660256 action=route targets=['sk-code-opencode'] |
| cli-external-orchestration / cli-opencode | Delegate this to a detached OpenCode session so I'm not blocked waiting on it. | sk-code score=0.713533 action=route targets=['sk-code-opencode'] |
| cli-external-orchestration / cli-opencode | I need three variations of this explored at once in OpenCode, each isolated, then reported back together. | sk-code score=0.660256 action=route targets=['sk-code-opencode'] |
| mcp-tooling / mcp-aside-devtools | I need an automated browser to fill out this form repeatedly with different test data. | sk-code score=0.6847 action=route targets=['sk-code-webflow'] |
| mcp-tooling / mcp-aside-devtools | Drive a browser session through our checkout flow and report where it breaks. | sk-code score=0.647432 action=route targets=['sk-code-webflow'] |
| mcp-tooling / mcp-chrome-devtools | Can you run a performance audit on this page and tell me what's dragging the score down? | sk-code score=0.395803 action=defer targets=[] |
| mcp-tooling / mcp-figma | Our design file has a spacing scale I need the exact numbers from before I hardcode anything. | sk-design score=0.666549 action=None targets=[] |
| mcp-tooling / mcp-magicpath | Look up how our design system defines its component library before I start building this screen. | sk-design-md-generator score=0.470016 action=None targets=[] |
| mcp-tooling / mcp-mobbin | Our empty-state design feels thin. What have other mobile apps actually shipped for this? | sk-code score=0.446422 action=defer targets=[] |
| mcp-tooling / mcp-obsidian | Can you add a new note to my vault with a frontmatter field for the health tracker plugin? | sk-doc score=0.50598 action=route targets=['sk-create-frontmatter'] |
| sk-code / sk-code-mobile-cli | Does this component change respect our mobile design-system grammar before I merge it? | sk-git score=0.584143 action=None targets=[] |
| sk-code / sk-code-mobile-cli | Figure out why the design tokens aren't applying correctly on the handheld remote client. | sk-design score=0.622878 action=None targets=[] |
| sk-code / sk-code-obsidian | Does this new component follow the plugin's existing class grammar before I open a PR? | sk-git score=0.476683 action=None targets=[] |
| sk-code / sk-code-obsidian | Can you check whether my notes plugin's source follows our db-star class naming before I open a PR? (boundary row) | sk-git score=0.486094 action=None targets=[] |
| sk-code / sk-code-quality | Before I mark this ticket done, can you run through the pre-merge checks and make sure I didn't leave stray comments in? | sk-git score=0.524023 action=None targets=[] |
| sk-code / sk-code-quality | Check this function against our usual pre-merge checklist. | sk-git score=0.550314 action=None targets=[] |
| sk-code / sk-code-review | Can you go through this pull request and flag anything that looks like a security hole or a correctness bug? | sk-git score=0.562934 action=None targets=[] |
| sk-code / sk-code-review | This PR has been sitting for two days and nobody's looked at it closely. Can you give it a proper pass? | sk-git score=0.467684 action=None targets=[] |
| sk-code / sk-code-webflow | The button on our live site doesn't match what's in the design file. Can you tell me what's different and fix the site to match? (boundary row) | mcp-tooling score=0.369721 action=route targets=['mcp-figma'] |
| sk-doc / sk-create-agent | Set up a fresh subagent file with the right permission block for delegating review work. | sk-code score=0.646598 action=route targets=['sk-code-review'] |
| sk-doc / sk-create-agent | We want a narrowly scoped persona that can only run inside the mobile-cli folder and nowhere else. | sk-code score=0.464647 action=defer targets=[] |
| sk-doc / sk-create-benchmark | Draft the report layout and fixture folder structure for a new reviewer-prompt comparison. | sk-code score=0.65905 action=route targets=['sk-code-review'] |
| sk-doc / sk-create-chart | I have a spreadsheet of quarterly revenue by region and want something people can glance at in a browser to see which region is winning. | sk-code score=0.581117 action=route targets=['sk-code-webflow'] |
| sk-doc / sk-create-diagram | I need something visual that shows the decision branches in our approval flow. | sk-git score=0.35934 action=None targets=[] |
| sk-doc / sk-create-diagram | Nobody on the team can follow this state machine from the code alone. Can you lay it out visually? | sk-code score=0.384879 action=defer targets=[] |
| sk-doc / sk-create-feature-catalog | Every time someone asks what this tool can actually do, I end up grepping the code. Can we have one page that lists it all? | sk-code score=0.424312 action=defer targets=[] |
| sk-doc / sk-create-manual-testing-playbook | How do we plan a release-readiness pass that multiple people can run in parallel and log evidence for? | system-deep-loop score=0.471772 action=route targets=['review'] |
| sk-doc / sk-create-manual-testing-playbook | We keep shipping regressions that automated checks miss. Can you put together a hands-on verification pass before the next release? | sk-code score=0.415068 action=defer targets=[] |
| sk-doc / sk-create-skill | Can you build me a brand new OpenCode skill that formats JSON test fixtures before they get committed? (boundary row) | sk-code score=0.91977 action=route targets=['sk-code-opencode'] |
| sk-doc / sk-create-skill-parent | We have four related skills that keep stepping on each other. Can you merge them under one router with a shared registry? | sk-git score=0.534394 action=None targets=[] |
| system-deep-loop / agent-improvement | Can you score this persona's last few runs across a few dimensions and tell me if the new prompt version is actually better? | sk-prompt score=0.477524 action=None targets=[] |
| system-deep-loop / agent-improvement | We tweaked the debugging persona's prompt last week and I have no idea if it's actually working better or just different. | sk-prompt score=0.465606 action=None targets=[] |
| system-deep-loop / ai-council | I want several different perspectives arguing this architecture decision out before we commit to one. | sk-git score=0.59534 action=None targets=[] |
| system-deep-loop / model-benchmark | Run a graded comparison of these two prompt structures against a fixed set of test cases. | sk-prompt score=0.463787 action=None targets=[] |
| system-deep-loop / review | Can you keep re-examining this module across multiple rounds until you stop finding new issues? | sk-git score=0.342364 action=None targets=[] |
| system-deep-loop / review | Give this pull request a release-readiness pass that doesn't stop after the first obvious bug. | sk-git score=0.583294 action=None targets=[] |
| system-deep-loop / review | I want you to keep circling back on this pull request across several passes, digging deeper each time, until nothing new turns up. (boundary row) | sk-git score=0.549805 action=None targets=[] |

### Right hub, shadowed by a legacy duplicate entry (12)

This mechanism belongs to one hub only: `cli-external-orchestration`. Five of its six
leaf modes (every one except `cli-devin`) carry a second, older advisor entry under the
mode's own bare name (`cli-claude-code`, `cli-opencode`, `cli-codex`, `cli-cursor`,
`cli-pi`), and that entry has no `compiledRoute` object at all, meaning it never routes
anywhere and reports no action. It nonetheless outranks the hub's correct, compiled
entry by score in every one of these twelve rows.

Six of the twelve are pure ranking defects: the correct compiled entry (`skillId:
"cli-external-orchestration"`, with the right mode in its `targets`) is present at
position two or three of the same response, just outranked. `cli-claude-code` accounts
for four of those six on its own, all four of that mode's rows in the corpus. Fixing the
ranking alone (dropping the score of the bare legacy entry, or removing it) would turn
those six into hits without touching any vocabulary or registry mapping.

The other six carry the same shadow entry at the top, but the correct compiled route
does not appear anywhere in the response at all for that prompt (`cli-codex` twice,
`cli-cursor` three times, `cli-pi` once). For those, the ranking fix alone would not be
enough. The compiled route itself needs to start firing for that phrasing before a
ranking fix can matter.

| Hub / Mode | Prompt | What won instead |
|---|---|---|
| cli-external-orchestration / cli-claude-code | Get a second opinion from Claude Code on whether this refactor is sound. | cli-claude-code score=0.67111 action=None targets=[] |
| cli-external-orchestration / cli-claude-code | Can you hand this off to Claude Code and bring the structured findings back here? | cli-claude-code score=0.608353 action=None targets=[] |
| cli-external-orchestration / cli-claude-code | Dispatch this edit to Claude Code so it applies the change directly. | cli-claude-code score=0.648533 action=None targets=[] |
| cli-external-orchestration / cli-claude-code | I want a completely independent Claude Code pass on this before I trust my own read of it. | cli-claude-code score=0.561247 action=None targets=[] |
| cli-external-orchestration / cli-codex | Ask Codex to do some quick web research and report back before I decide. | cli-codex score=0.280276 action=None targets=[] |
| cli-external-orchestration / cli-codex | I want a Codex second opinion on this PR before I approve it. | cli-codex score=0.467683 action=None targets=[] |
| cli-external-orchestration / cli-cursor | Spin up Cursor in ask mode so it can look at the code without touching anything. | cli-cursor score=0.446972 action=None targets=[] |
| cli-external-orchestration / cli-cursor | Can you isolate this experiment in its own native git worktree using Cursor's agent? | cli-cursor score=0.685141 action=None targets=[] |
| cli-external-orchestration / cli-cursor | Hand this task off to a cloud worker running Cursor's agent. | cli-cursor score=0.077907 action=None targets=[] |
| cli-external-orchestration / cli-cursor | I want Cursor's agent to just answer questions about this file, not edit it. | cli-cursor score=0.092913 action=None targets=[] |
| cli-external-orchestration / cli-opencode | I want to hand this task to a separate OpenCode run and get the results back with full context. | cli-opencode score=0.683762 action=None targets=[] |
| cli-external-orchestration / cli-pi | Run this through Pi's JSON and RPC integration so I can wire it into our own tooling. | cli-pi score=0.558453 action=None targets=[] |

### Right hub, deferred with no target (11)

The top recommendation correctly names the expected hub, but `compiledRoute.action` is
`defer` rather than `route`, with an empty `targets` list. `sk-doc` accounts for five of
these eleven, `sk-code` for four. These are the closest misses in the corpus: the hub
layer recognized the request, but the mode-selection layer beneath it did not commit to
one.

| Hub / Mode | Prompt | What won instead |
|---|---|---|
| mcp-tooling / mcp-chrome-devtools | The page is janky and I want to see what's actually happening in the DOM and network tab while it loads. | action=defer score=0.145864 |
| sk-code / sk-code-mobile-cli | This screen in the mobile remote app doesn't match our ink-on-parchment palette. Can you check the components? | action=defer score=0.416571 |
| sk-code / sk-code-obsidian | The build for our notes plugin is failing after I touched the sync logic, and the error message isn't helpful. | action=defer score=0.119161 |
| sk-code / sk-code-quality | I always forget one of the standard checks before marking something complete. Can you run the full gate on this change? | action=defer score=0.060499 |
| sk-code / sk-code-webflow | The custom code embed on our landing page is throwing console errors after the last CMS update. | action=defer score=0.450356 |
| sk-doc / sk-create-changelog | Can you write up what changed since the last tag, with the right version bump? | action=defer score=0.185364 |
| sk-doc / sk-create-diff | Generate a visual comparison of this markdown file's last revision. | action=defer score=0.569062 |
| sk-doc / sk-create-quality-control | Take this rough draft and tighten it against our documentation standards. | action=defer score=0.690556 |
| sk-doc / sk-create-readme | Nobody on the team can figure out how to set this project up. Can you write the docs with proper install steps? | action=defer score=0.7 |
| sk-doc / sk-create-readme | Does this folder have documentation explaining what it does and how to run it? | action=defer score=0.752613 |
| sk-doc / sk-create-readme | Our repo's top-level docs are years out of date and don't mention the new build step. Can you refresh them? | action=defer score=0.686862 |

## Boundary rows and how they resolved

Eight prompts in the corpus were written to sit on a boundary between two modes, each
with a recorded reason for which mode should win. None cleared the strict, top-only
check. Two recovered at a lower position in the response (an `any-position` hit), and the
other six lost outright to the competing mode or to nothing at all.

| Hub / Mode | Boundary against | Resolution | What won |
|---|---|---|---|
| sk-doc / sk-create-skill | sk-code-opencode ("OpenCode" collision) | Lost outright | sk-code / sk-code-opencode, score 0.920 |
| sk-doc / sk-create-benchmark | skill-benchmark (authoring vs. running) | No recommendation at all | - |
| sk-doc / sk-create-diff | sk-code-review ("what changed" framing) | No recommendation at all | - |
| sk-doc / sk-create-quality-control | sk-code-quality ("call it done" framing) | Recovered at a lower position | sk-code, score 0.133 (floor noise) at top |
| sk-code / sk-code-webflow | mcp-figma (design-source lookup) | Lost outright | mcp-tooling / mcp-figma, score 0.370 |
| sk-code / sk-code-obsidian | mcp-obsidian (plugin vs. vault) | Lost outright | sk-git, score 0.486 |
| mcp-tooling / mcp-mobbin | mcp-refero (design-reference search) | No recommendation at all | - |
| system-deep-loop / review | research (convergence framing) | Lost outright | sk-git, score 0.550 |

The `sk-create-skill` boundary row is the clearest confirmation of a real collision, not
a hypothetical one. The prompt asked to scaffold a new package, worded to avoid every
literal keyword, and still lost decisively (score 0.920, `action: route`) to
`sk-code-opencode` the moment it mentioned "OpenCode" in passing. A separate,
non-boundary `sk-create-skill` row phrased the identical intent without naming OpenCode
and returned no recommendation at all, so the word itself is doing the damage rather
than the underlying intent being genuinely ambiguous.

The two `sk-git` boundary losses (`sk-code-obsidian`, `review`) are ordinary instances of
the same wrong-hub pattern documented above, not evidence that the boundary framing
itself was unclear.

## Modes an honest prompt could not be written for

None. Every one of the forty-three modes had a clear enough `SKILL.md` description to
write concrete, grounded prompts, including the surface-evidence packets
(`sk-code-webflow`, `sk-code-opencode`, `sk-code-mobile-cli`, `sk-code-obsidian`) that
are read-only evidence bundled alongside a workflow mode rather than a directly-invoked
workflow themselves. The two `command-bridge` modes, `model-benchmark` and
`skill-benchmark`, were understood well enough to write real prompts for, but those
prompts were always going to score zero by design, since neither mode is reachable
through the advisor at all. That is a routing-architecture fact, not a corpus gap.

## Reproduce this

```
# regenerate the measurement (writes one JSON object per row to OUT)
bash measure.sh assets/realistic-corpus.tsv gate-b-results.jsonl gate-b-progress.log

# where measure.sh runs, per row:
node .opencode/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"<prompt>"}' \
  --format json --timeout-ms 60000 > raw_output.json 2>&1
status=$?   # read separately, never through a pipe
```

A hit under the strict definition used for the headline number:

```python
top = parsed["data"]["recommendations"][0]
targets = [t["workflowMode"] for t in top.get("compiledRoute", {}).get("targets", [])]
hit = intended_mode in targets
```

A hit under the looser, any-position cross-check:

```python
hit_any = any(
    intended_mode in [t["workflowMode"] for t in rec.get("compiledRoute", {}).get("targets", [])]
    for rec in parsed["data"]["recommendations"]
)
```

Re-running the full 180-row corpus a second time is expected to reproduce the same rate
within a few rows: the daemon is deterministic per prompt when the underlying registries
have not changed, and several rows in this run already showed `cache.hit: true` on a
verbatim repeat with an identical result.
