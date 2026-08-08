Context Link: https://x.com/AnatoliKopadze/status/2080668775796314331?s=12

Graph Engineering explained: what it is, when to use it and when not to
Most people are using AI at 5 to 10% of what it can actually do. There is a faster way, and it is bigger than it looks. Learn it, and you can optimize enormous processes, not just personal tasks.

This is the skill behind real roles at large companies. The difference between doing one job, and designing how a hundred of them get done.

I got lucky with it early. When I studied at one of the best universities in Denmark, we had a whole course on one thing: how to lay a process out as a diagram and make it as efficient as possible.

Back then it felt abstract. Now it is the exact thing the top AI engineers are arguing about on your timeline.

By the end of this article you will understand Graph Engineering better than almost anyone you follow: what a graph actually is, the one test that instantly makes your AI faster, the single pattern that pays for itself, where these things quietly break, when a graph is the wrong tool, and how to build a real one yourself in a couple of minutes.

Before we get into it, follow me on X and join my Telegram channel I just created where I post more AI content every day. Both are free.

X - https://x.com/AnatoliKopadze

Telegram - https://t.me/kopadzemp

https://x.com/i/web/status/2078277297791189132
1 - Where this even came from.
A month ago the whole field was talking about loops. Then Peter Steinberger posted the line above, and a corner of the internet that had just finished learning loops declared them old news overnight.

The joke landed because it was half true. If you have read my Loops article, you already have the foundation. A loop is one agent improving one thing on repeat: try, check, adjust, go again. That was the skill of last month.

What everyone moved to is not a better loop. It is a graph of loops, a network where cycles watch and correct each other instead of one agent chasing one number alone.

And engineers pushed back on the hype within hours, pointing out this is a decades-old idea wearing a new name. They are right, and that is the good news. A pattern that has run critical systems for thirty years is exactly what you want to trust with your work.

2 - What a graph actually is.
A graph is just a plan for your AI work, drawn out so you can see it. It answers two questions: which jobs need to happen, and which job has to wait for which.

There are only two parts, and getting them straight fixes most of the confusion.

A box is called a node. It's one job: one agent doing one task, with one thing going in and one thing coming out. Researching a competitor. Writing a draft. Checking a claim.

An arrow is called an edge. It just means one job needs what another job produced, so it has to wait for it. And the arrow only counts when something real actually passes along it.


Nodes do the thinking. Edges carry the results. That is the entire vocabulary. Once you have it, you never need a definition again.

The thing that makes a node actually usable in a graph is a contract: one bounded job, a defined input, a defined output. A node whose output is a wall of free text is a node only a human can read. A node with a fixed output shape is one the next node can consume without guessing, which is the whole point.

text
▸ NODE CONTRACT
JOB:     research one competitor's pricing (one job, nothing else)
IN:      { competitor: "name", url: "https://..." }   ← passed in, never assumed
OUT:     { price: number, plan: string, source: url, date: "YYYY-MM-DD" }
SCHEMA:  enforced. if the agent returns free text, it's rejected and retried
WHY:     a defined output is what lets the next node read this one
         without a human in the middle. that is what makes it wire-able.
3 - The test that finds the fake edges.
Look at the AI workflow you run today and walk it step by step. At each step, ask one thing: does this step actually need the result of the one before it?

If yes, the edge is real. Keep the order. If no, there is no edge, and the wait is wasted. Those two jobs can run at the same time.

Take a simple one: "review file A for bugs, then review file B for bugs." It reads like a sequence, but the check on file B never looks at what file A returned. They only run one after another because that is the order you typed them in. Run them side by side and the whole thing finishes in the time of the slower single file, not the two added together.

You will find two or three of these fake edges in almost any workflow you draw. Every one of them is time you are throwing away for free.


4 - Your current setup is already a graph.
When you write an agent as "do A, then B, then C, then D," you have technically already drawn a graph. It is just the saddest possible one: a single straight chain where every node has one arrow in and one arrow out.

It runs correctly. It also runs slowly and breaks easily, because a chain has no redundancy. If C stalls, D never happens, and A's work is trapped upstream with nowhere to go.

The first real skill of graph engineering is redrawing that chain. Take your linear workflow, and for each arrow, ask the fake-edge question. Cut the arrows that carry no data, and the line collapses into something wider: a few independent jobs that can all run at once, feeding one job that needs them all.

The reason this matters is not cosmetic. A linear workflow with 40 steps has 40 points of sequential failure and the latency of all 40 added together. The same 40 jobs drawn as a graph have only as many real dependencies as actually exist, usually three to five, and finish at the speed of your slowest layer, not the sum of everything. That is the difference between a job that takes five minutes and one that takes fifteen seconds, running the exact same work.

The model was never the bottleneck. The line you drew was.

5 - The one pattern that pays: the diamond.
You do not need a hundred shapes. Watch any serious agent system work and the same picture keeps appearing. The work splits, several workers dig side by side, something checks what they found, and everything merges back into one answer.

That picture is called the diamond, and it is close to the only pattern you need this year. Its formal name is worth memorizing: fan out, reduce, synthesize. 

Fan out to gather breadth, reduce with plain code to compress it, synthesize with a final agent to write the answer.


The research feature inside Claude runs exactly this in production. One lead plans the angles, workers gather in parallel, findings get checked, and only then does one report reach you. Once you can see the diamond, you stop asking "how do I make my agent do more steps" and start asking "where is the split, where is the merge." That second question is the one that scales.

Here is what the diamond actually looks like under the hood. When you say "workflow," Claude writes a short script like this itself and runs the coordination as code, which is why passing results between agents costs zero extra context.

text
// a market-scan graph — the diamond, written by Claude when you say "workflow"

const angles = [
  "pricing vs the top 3 competitors",
  "what buyers complain about in reviews",
  "the feature gaps in the category",
  "where the market moves in the next 12 months",
];

// FAN OUT — one researcher per angle, all at the same time
const raw = await parallel(
  angles.map(a => () => agent({
    task: `research: ${a}. every claim needs a source url + date.`,
    schema: Finding,        // validated output, not free text
    model: "cheap",         // boring node → cheap model
  }))
);

// REDUCE — plain code, no model, no tokens
const findings = dedupeBySource(raw.flat().filter(Boolean));

// VERIFY — a FRESH skeptic per finding, tries to kill it
const survivors = await parallel(
  findings.map(f => () => agent({
    task: "try to disprove this. return keep | drop + why.",
    input: f,
    freshContext: true,     // never reuse the researcher's chat
    model: "strong",        // judgment node → strong model
  }))
).then(v => findings.filter((_, i) => v[i].verdict === "keep"));

// SYNTHESIZE — one agent writes the answer from what survived
return agent({ task: "one report, ranked by confidence, sources attached.",
               input: survivors, model: "strong" });
Read it once and the whole craft is visible: the fan-out where work is independent, the reduce done in free code, the verify on a fresh context, cheap models on the boring nodes and the strong one where judgment lives and a single synthesize at the end. Same skeleton behind a market scan, a code review, or a research report. Swap the angles and the prompts.

6 - The checker is the whole trick.
Now the part almost everyone skips, and it is what separates a real graph from an expensive toy.

Every serious test of AI self-review says the same thing: models miss most of their own mistakes. A model grading its own work is far too easy on itself.

So you never let the agent that did the work check the work.

You put a separate node on the edge. Its only job is to try to kill the finding before it moves on. If it survives, it passes. If not, it dies right there.

Here is the catch nobody names: that checker needs a clean context.

Give it the same chat the worker had and it is not checking anything, it is nodding along to itself in a different font. A graph of agents sharing one context is just a single loop in a costume, and it breaks the same way, only later and pricier.

So make the verifier fresh. Own context. Checking a real signal, not "did the agent say it is done" but "does the test actually pass."

Then split the checking three ways. Is it correct? Is it current? Is the source even real? Three different lenses catch what ten identical ones miss.

text
▸ VERIFIER NODE
INPUT:    one finding from a worker (the finding only, never the worker's chat)
CONTEXT:  fresh and empty. it has not seen the work it is judging
CHECKS:   three skeptics run in parallel, each with a different question
  1. is it correct?      → does the claim actually hold up
  2. is it current?      → is the source recent, not something stale
  3. is the source real? → does the link resolve to the claim it's cited for
PASS:     keep the finding only if a majority of skeptics let it live
FAIL:     drop it before it ever reaches the final answer
The rule to remember: a worker and its verifier must never share a context. The moment they do, you are back to one loop grading its own homework, just with a bigger bill.

7 - Where graphs actually break.
1. Context collapse.
Fan out a thousand nodes, then try to feed all thousand outputs into one final step, and you blow past the context window before synthesis even starts.

The fix: layer your fan-in. Batch the results, summarize each batch, then combine the summaries, never the raw pile.

text
// layered fan-in — never pour 1,000 raw outputs into one step
const batches = chunk(results, 40);              // groups of 40
const summaries = await parallel(
  batches.map(b => () => agent({ task: "summarize this batch", input: b }))
);
return agent({ task: "write the answer from the summaries", input: summaries });
// the final step reads ~25 summaries, not 1,000 raw outputs
2. False independence.
Two nodes look independent because their prompts never mention each other, but they both write to the same file or hit the same rate-limited API. That is a hidden edge.

When Bun's team first fanned a big job across many agents, they shared one workspace and overwrote each other.

The fix: give every worker its own isolated space, and audit for shared resources, not just shared data.

text
// isolate the workers — no shared file, no shared workspace
await parallel(files.map(f => () => agent({
  task: `refactor ${f}`,
  worktree: true,        // each agent works in its own git worktree
})));
// they can't overwrite each other, then the results merge cleanly
// rule: any two nodes writing the same file need an edge, not parallelism
3. Silent node failure.

In a chain, one failure stops everything, annoying but obvious. In a graph, one dead node among two hundred can slip into a report that looks complete.

The fix: every merge step counts its inputs against the number it expected, and flags the gap instead of quietly running on half the data.

text
// fan-in guard — catch the node that quietly died
const results = (await parallel(jobs)).filter(Boolean);   // dropped nodes = null
if (results.length < jobs.length) {
  flag(`WARNING: ${jobs.length - results.length} of ${jobs.length} nodes returned nothing`);
}
// never synthesize on a partial set and call the report complete
8 - Do you even need one?
As tradition goes for my articles, let's honestly figure out who this could even be useful for.

A graph buys breadth. It does not buy better judgment.

It is a tool for width, for independent work done at once. When the work is not wide, the line was never the problem.

Skip the graph when:
- The task is small or isolated. Adding one function, fixing one bug. The coordination is pure overhead, and a single agent is faster and cheaper.

- You want to approve every step. A graph's whole point is running wide without you, so a tight leash works against it.

- You do not know yet what you are looking for. Exploratory work wants one agent you can steer, not a fleet locked into a plan.

- The steps genuinely depend on each other. Forcing a graph onto truly sequential work just adds cost for zero speedup.

- The tell is the fake-edge test. If you cannot find two jobs with no edge between them, there is no graph to build. It is a loop, and a loop is fine.

9 - The part nobody wants to hear: anchors.
There is a deeper trap here, and it is the real lesson of this whole shift.

Imagine you build the full graph. Paired checkers, audit nodes, meta-nodes tuning the other nodes. Every node watches another node, and every one of them reads a report.

The audit checks the numbers against the finance numbers, which came from the same system in the first place.

Everything is consistent. Nothing is verified.

This graph fails exactly like the single loop did, just later, more expensively, and with far more green lights on the way down.


Topology alone does not buy truth. The graph needs anchors: nodes that cannot be argued with.

Tests that actually ran, not "should pass," did pass. Revenue that landed in the bank. Customers who actually stayed.

And some rules must be frozen, the ones an optimizer would be tempted to weaken, kept off-limits precisely because they are the ones it would bend to win.

The graph is only as honest as the things inside it that refuse to move.

Judge it on numbers that cannot argue back and it stays grounded. Let it grade its own reports and it will be confidently wrong.

10 - Build one yourself in Claude Code.
Enough theory. If you have decided this is for you, or you just want to try it, let's build one. You can build a real graph in a couple of minutes, because Claude Code shipped the tooling to do it directly, called dynamic workflows.

It comes down to one word: "workflow."

Put it in your prompt and Claude stops working through a single line of steps. Instead it writes a short orchestration script, then spawns a coordinated fleet of sub-agents to run it.

The important part is that the coordination is code, not a conversation. Passing results between agents does not re-spend your context the way a chat handoff does, which is what lets one run scale to a whole fleet without drowning the session.

Open a real repository you know, and paste this:

text
▸ GRAPH SPEC
GOAL: audit every route file under src/routes/ for missing auth checks

FAN OUT:    one agent per file, all running in parallel
VERIFY:     an independent checker on each finding, with fresh context
CAP:        20 files on this first run
ON FAIL:    flag any file that doesn't return, never skip it silently
REPORT:     one merged list of the routes missing auth

(start the prompt with the word "workflow" so Claude builds the graph)
Run it, and here is what happens.

First, Claude signals that it is building a workflow instead of answering in a normal chat, and shows you the plan before doing anything. You read it and approve.

Then the fleet runs. One agent per file, all at the same time, while your own session stays free the whole way through.

And what lands at the end is not twenty separate chats to dig through. It is one report. The in-between results lived inside the script, never in your context, so the only thing you actually see is the final answer.

That is a graph. A dozen agents from a single sentence. When a run comes out good, save it, and it turns into one command you can re-run by name forever.


Notice the "20 files" cap in that prompt. It keeps your first run cheap, and it hints at the thing every demo leaves out: the bill.

11 - Ready graphs you can paste right away.
Every one of these is the same diamond aimed at a different job. Open Claude Code in a real folder, swap the bracketed parts for your own, and paste. The word "workflow" is what tells Claude to build a coordinated fleet instead of a single line of steps. Keep yourself as the last yes before anything ships.

A decision-grade research desk. Replaces a week of googling or an expensive analyst invoice. Your question splits into angles, researchers dig at once, a skeptic attacks every finding, and only the survivors reach the report.

text
▸ GRAPH SPEC
GOAL: decision-grade research on [your question]

FAN OUT:      split into 5 distinct angles, one researcher per angle, in parallel
RULE:         every finding needs a source link and a date
VERIFY:       a skeptic attacks each finding and tries to disprove it, drop what fails
MERGE:        survivors into one report ranked by confidence
SAVE:         research-report.md, then show me the top findings
HUMAN GATE:   change nothing after that without asking me

(start the prompt with the word "workflow" so Claude builds the graph)
An SEO content machine. Writes one ranking-ready draft per run, and never publishes without you.

text
▸ GRAPH SPEC
GOAL: one ranking-ready draft for [topic]

PARALLEL JOBS (run at once):
  1. what the current top-ranking pages cover
  2. the real questions people ask about this topic
  3. what those top pages skip
MERGE:        the three into an outline, then write a full draft
VERIFY:       a fact-checker that flags every claim without a source
SAVE:         drafts/ with the flagged claims listed at the top
HUMAN GATE:   never publish anything

(start the prompt with the word "workflow" so Claude builds the graph)
A go-to-market kit. The full launch pack in one run, with you approving every piece.

text
▸ GRAPH SPEC
GOAL: full launch kit for [product], aimed at [audience]

PARALLEL JOBS (research, run at once):
  1. profile the buyer and the exact words they use
  2. map where these buyers spend time online
  3. collect how competitors pitch them
MERGE:        a one-page positioning doc
HUMAN GATE:   pause and show me the positioning doc before writing
PARALLEL JOBS (writing, from that doc):
  1. landing page copy
  2. a week of launch posts
  3. a set of outreach messages
VERIFY:       a checker compares every asset to the positioning doc, flags anything off
SAVE:         launch-kit/, change nothing after that without asking me

(start the prompt with the word "workflow" so Claude builds the graph)
A refactor sweep across a whole repo. Breadth no single context could hold.

text
▸ GRAPH SPEC
GOAL: find every function over 100 lines and propose a refactor for each

FAN OUT:    one agent per file, in parallel
VERIFY:     an independent checker on each proposed refactor, fresh context
DEDUPE:     proposals against everything already seen
CAP:        50 files on this first run
REPORT:     how many files came back, so nothing fails silently

(start the prompt with the word "workflow" so Claude builds the graph)
A discovery loop of unknown size. For jobs where you do not know how big the work is until you are in it, like a bug sweep where finding one bug reveals three more.

text
▸ GRAPH SPEC
GOAL: hunt this repo for [security issues / broken error handling / dead code]

FAN OUT:    run finders in parallel
DEDUPE:     check each new find against everything already seen
VERIFY:     an independent checker on the survivors
LOOP:       keep going until two rounds in a row find nothing new, then stop
CAP:        a hard limit on total agents so it can't run away
REPORT:     final list ranked by severity

(start the prompt with the word "workflow" so Claude builds the graph)
Run one scoped, watch what it costs, then widen. When a run is good, save it, and every one of these becomes a single command you launch by name.
12 - The cost and the supervision.
A graph costs more than a normal chat. A lot more. The coordination is what gets cheaper, not the work itself. The agents still burn tokens, and a fleet of them burns a pile.

The clearest example is public. An engineer used this exact setup to rewrite the Bun runtime, translating around 535,000 lines of one language into over a million lines of another in about eleven days. By hand that is close to a year of work.

It ran about 50 workflows, with up to 64 agents going at once.

It also cost roughly $165,000 in usage, needed a human designing and watching the whole thing, and got real criticism over whether that much AI-written code can even be reviewed safely.

That is the honest shape of it. A graph can fan out to a thousand agents and chew through a job no single context could hold. It can also quietly spend your money in the background if you point it at the wrong task or skip the anchors.

So the heavy version is for teams with the budget, the caps, and the monitoring to run it. If that is not you yet, you are not missing anything. Start small, watch what a run costs, and go wider only once one has earned it.

13 - What this actually means for you.
That is the whole picture. You now know what a graph is, where it shines, where it breaks, and who it is actually for.

You know the strength: breadth, independent work done at once. And the weakness: it buys width, not judgment, and it will spend your money if you point it at the wrong job.

So the move is not to graph everything. It is to know when the work is wide enough to need one, and when a simple loop was the answer all along.

My take: learn the fake-edge test tonight. Draw your current workflow, find the edges that carry no data, and delete them. That one move makes you faster than most people before you touch a single new tool.

Most will keep queueing steps in a line. The few who learn to draw the graph will run a fleet.

If you want to stay up to date with everything happening in AI, follow me on X and Telegram:  

X - https://x.com/AnatoliKopadze

Telegram - https://t.me/kopadzemp

