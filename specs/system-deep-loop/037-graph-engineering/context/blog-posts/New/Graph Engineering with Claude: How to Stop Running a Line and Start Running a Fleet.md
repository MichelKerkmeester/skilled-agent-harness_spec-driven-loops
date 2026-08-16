Source Link: https://x.com/rvaniaaaa/status/2083542830086000704?s=12

Graph Engineering with Claude: How to Stop Running a Line and Start Running a Fleet
Most people who build a multi-agent system end up with a straight line. Step one, step two, step three, each one waiting for the last to finish before it starts. Half those steps never needed to wait at all. That is not an agent problem. That is a shape problem. The model was never the bottleneck. The line you drew was.

This is the guide that fixes the shape. By the end you will know what a graph actually is, how to find the fake edges that slow everything down, the one pattern that appears behind every serious agent system, where graphs break in ways nobody warns you about, and how to build a real one in Claude Code from a single sentence.

What graph engineering actually is
A month ago everyone was talking about loops. One agent, one metric, one cycle of try, check, adjust, go again. That was the skill of last month, and it was useful.

The problem with a loop is Goodhart's Law. A loop can only see its own metric. A support bot tied to ticket resolution rate will learn to close tickets fast, not to solve problems. The number climbs while satisfaction drops. The loop can not ask whether the target is right. It can only chase the number it was given.

The answer is not a better loop. It is a graph of loops. A network where cycles watch and correct each other instead of one agent chasing one number alone.

For agents, this means one thing: stop writing one agent that does everything in a line, and start designing the shape of the work. What runs before what. What can run at the same time. What has to wait for everything else. That shape is a graph. And Claude Code shipped the tooling to build these directly.

The only vocabulary you need
A graph has exactly two parts.

A node is one unit of work. One agent, one bounded job, one thing going in and one thing coming out. Research one competitor. Review one file. Check one claim. The moment a node has two jobs, it becomes something you can not parallelize, can not verify, and can not debug.

An edge is a dependency. It says this node's output feeds that node's input. Nothing more. An edge only exists when data actually moves across it.

Nodes do the thinking. Edges carry the results. That is the entire vocabulary.

The thing that makes a node actually usable in a graph is a contract: one bounded job, a defined input, a defined output shape enforced by a schema. A node whose output is a wall of free text is a node only a human can read. A node with a fixed output shape is one the next node can consume without guessing, which is the whole point.

javascript
const ITEM = {
  type: 'object',
  properties: {
    title:  { type: 'string' },
    url:    { type: 'string' },
    impact: { type: 'string', enum: ['high', 'medium', 'low'] },
  },
  required: ['title', 'url', 'impact'],
};

const result = await agent(source.prompt, {
  label:  `research:${source.key}`,
  schema: ITEM,
  agentType: 'general-purpose',
});
// result is a shape the next node can trust, not free text
Step 1: Find the fake edges
This is the move that costs nothing and pays immediately.

Take any workflow you run today and walk it step by step. At each step, ask one question: does this step actually need the result of the one before it? If yes, the edge is real. Keep the order. If no, there is no edge. The wait is pure waste. Those two jobs can run at the same time.

"Review file A for bugs, then review file B for bugs." It reads like a sequence. But the review of file B never looks at what file A returned. They chain only because that is the order you typed them. Run them side by side and the whole thing finishes in the time of the slower single file, not the two added together.

You will find two or three of these fake edges in almost any workflow you draw. Every one of them is time you are throwing away for free.

Your current linear agent is already a graph. Just the saddest one: a single chain where every node has one arrow in and one arrow out. It runs correctly. It runs slowly. And a chain has no redundancy: if one node stalls, everything downstream never happens.

The first real skill of graph engineering is redrawing that chain. Cut the arrows that carry no data and the line collapses into something wider: a few independent jobs that can all run at once, feeding one job that needs them all. A linear workflow with forty steps has forty points of sequential failure and the latency of all forty added together. The same forty jobs drawn as a graph have only as many real dependencies as actually exist, usually three to five, and finish at the speed of the slowest layer, not the sum of everything.


Step 2: The one pattern behind every serious agent system
Watch any serious agent system work and the same picture keeps appearing. The work splits. Several workers dig at the same time. Something checks what they found. Everything merges into one answer.

That picture is called the diamond. Its formal name is worth memorizing: fan out, reduce, synthesize.

Fan out to gather breadth. Reduce with plain code to compress it. Synthesize with a final agent to write the answer.

The research feature inside Claude runs exactly this in production. One lead plans the angles, workers gather in parallel, findings get checked, and only then does one report reach you.

Here is what the diamond looks like when Claude writes it:

javascript
const angles = [
  "pricing vs the top 3 competitors",
  "what buyers complain about in reviews",
  "the feature gaps in the category",
  "where the market moves in the next 12 months",
];

// FAN OUT -- one researcher per angle, all at the same time
const raw = await parallel(
  angles.map(a => () => agent({
    task: `research: ${a}. every claim needs a source url and date.`,
    schema: Finding,
    model: "cheap",
  }))
);

// REDUCE -- plain code, no model, no tokens
const findings = dedupeBySource(raw.flat().filter(Boolean));

// VERIFY -- a fresh skeptic per finding, tries to kill it
const survivors = await parallel(
  findings.map(f => () => agent({
    task: "try to disprove this. return keep or drop and why.",
    input: f,
    freshContext: true,
    model: "strong",
  }))
).then(v => findings.filter((_, i) => v[i].verdict === "keep"));

// SYNTHESIZE -- one agent writes the answer from what survived
return agent({
  task: "one report, ranked by confidence, sources attached.",
  input: survivors,
  model: "strong"
});
Read it once and the whole craft is visible. The fan-out where work is independent. The reduce done in free code with no model tokens. The verify on a fresh context. Cheap models on the boring nodes and the strong one where judgment lives. A single synthesize at the end.

Same skeleton behind a market scan, a code review, a research report. Swap the angles and the prompts. The shape stays the same.

Once you can see the diamond, you stop asking "how do I make my agent do more steps" and start asking "where is the split, where is the merge." That second question is the one that scales.


Step 3: Build your first graph
Enough theory. Open a real repository you know and paste this into Claude Code:

text
Create a workflow to audit every route file under src/routes/
for missing auth checks. Spawn one agent per file, then run an
independent verifier on each finding before reporting.
Analyze a maximum of 20 files to start.
Swap src/routes/ for where your files live. The "max 20" keeps your first run cheap.

Watch what happens. Claude Code highlights "workflow" and signals that a graph is building, not a normal chat. It writes a JavaScript orchestration script and shows you the phases before doing anything. Read them and approve.

Then the fleet runs. One agent per file, all at the same time, while your session stays free. Type /workflows to watch it live: scope, fan-out, verify, synthesize.

What lands at the end is not twenty separate chats to dig through. One report. The intermediate results lived inside the script's variables, never in your context.

That is a graph. A dozen agents from a single sentence. When a run comes out well, press s. It saves to .claude/workflows and becomes a single command you can re-run by name forever. Change the task and keep the shape.

Step 4: The verifier is the whole trick
Most people build the fan-out and call it done. That is the expensive toy. The real graph has a checker on every edge that matters.

Every serious test of AI self-review says the same thing: models miss most of their own mistakes. A model grading its own work is far too easy on itself. So you never let the agent that did the work check the work.

You put a separate node on the edge. Its only job is to try to kill the finding before it moves downstream. If it survives, it passes. If not, it dies right there.

Here is the catch nobody names: that verifier needs clean context. Give it the same conversation the worker had and it is not checking anything. It is nodding along to itself in a different font. A graph of agents sharing one context is a single loop in a costume. It breaks the same way, only later and more expensively, with far more green lights on the way down.

So the verifier is a fresh node. Own context. Checking a real signal, not "did the agent say it is done" but "does the test actually pass." Three lenses catch what ten identical checks miss. Is it correct? Is it current? Is the source real? Run those three in parallel on every finding. Keep only what a majority of skeptics let live.

javascript
const verdicts = await parallel(
  ['correctness', 'recency', 'source-validity'].map(lens => () =>
    agent({
      task: `judge this finding via ${lens}. return keep or drop.`,
      input: finding,
      freshContext: true,
      schema: { verdict: { enum: ['keep', 'drop'] } }
    })
  )
);

const passes = verdicts.filter(v => v.verdict === 'keep').length >= 2;
The rule to remember: a worker and its verifier must never share a context. The moment they do, you are back to one loop grading its own homework, just with a bigger bill.

Step 5: When you don't know how big the job is
Sometimes you can not plan the graph in advance because you do not know the size of the work until you are inside it. A bug sweep where finding one bug reveals three more. A dependency audit where pulling one thread unravels ten others.

That needs a cycle: a controlled edge back to an earlier node that keeps the search going until it runs dry.

The pattern that converges is loop-until-dry. Keep spawning finders until two consecutive rounds surface nothing new, then stop.

The detail that makes or breaks it, and the mistake almost everyone makes the first time, is what you deduplicate against. Dedupe against everything seen, not just against confirmed results. Otherwise rejected findings reappear every round, the loop never runs dry, and you have built a machine that pays to rediscover the same dead ends forever.

javascript
const seen = new Set();
const confirmed = [];
let dry = 0;

while (dry < 2) {
  const found = (await parallel(
    FINDERS.map(f => () => agent(f.prompt, { schema: BUGS }))
  )).filter(Boolean).flatMap(r => r.bugs);

  const fresh = found.filter(b => !seen.has(key(b)));
  if (!fresh.length) { dry++; continue; }
  dry = 0;

  // dedupe against SEEN, not confirmed -- this is the detail that matters
  fresh.forEach(b => seen.add(key(b)));

  const verified = await parallel(
    fresh.map(b => () => agent(
      `is this real: ${b.desc}`, { schema: VERDICT }
    ))
  );

  confirmed.push(
    ...verified.filter(v => v.real).map((v, i) => fresh[i])
  );
}
The loop has three stopping conditions in production: two dry rounds, a fixed budget, or a maximum number of iterations. All three together. Any one alone is a trap.

The topology that controls your latency
The shape of the graph is not cosmetic. It is the single biggest lever on wall-clock time, and the choice that trips everyone up is parallel() versus pipeline().

A parallel() barrier makes everything wait for the slowest node before the next stage starts. Every item idles behind the one that takes longest. If nine agents finish in two seconds and one takes twenty, the whole batch waits twenty seconds before synthesis can begin.

A pipeline() streams each item through all stages independently with no barrier. Item A can be in stage three while item B is still in stage one. Fast items finish early instead of idling behind slow ones.

Default to pipeline(). Reach for a barrier only when a stage truly needs every prior result at once: a cross-set dedupe, an early-exit on the total, a prompt that compares against "the other findings." The smell test: if you wrote parallel, then transform, then parallel, and that middle transform has no cross-item dependency, you should have used a pipeline and skipped the barrier entirely. The barrier latency is real, measurable, and wasted.

javascript
// barrier -- everything waits for the slowest node
const results = await parallel(jobs);
// one slow agent holds the whole batch

// pipeline -- items flow through independently
const results = await pipeline(jobs, stages);
// fast items finish early, slow ones catch up without blocking
Step 6: Where graphs actually break
Three failures end most real graphs. Know them before you build.

Context collapse. Fan out a thousand nodes, then try to feed all thousand outputs into one final step, and you blow past the context window before synthesis even starts. Layer your fan-in. Batch the results, summarize each batch, combine the summaries. The final step reads twenty-five summaries, not a thousand raw outputs.

javascript
const batches = chunk(results, 40);
const summaries = await parallel(
  batches.map(b => () => agent({ task: "summarize this batch", input: b }))
);
return agent({ task: "write the answer from the summaries", input: summaries });
False independence. Two nodes look independent because their prompts never mention each other, but they both write to the same file or hit the same rate-limited API. That is a hidden edge. When Bun's team first fanned a large port across many agents, they shared one workspace and overwrote each other. Give every worker its own git worktree.

javascript
await parallel(files.map(f => () => agent({
  task: `refactor ${f}`,
  worktree: true,
})));
Silent node failure. In a chain, one failure stops everything, annoying but obvious. In a graph, one dead node among two hundred can slip into a report that looks complete. Every merge step must count its inputs against the number it expected and flag the gap.

javascript
const results = (await parallel(jobs)).filter(Boolean);
if (results.length < jobs.length) {
  flag(`WARNING: ${jobs.length - results.length} nodes returned nothing`);
}

Six graphs to build this week
Each one is the same diamond aimed at a different job. Open Claude Code in a real folder, swap the bracketed parts, and paste. The word "workflow" is what tells Claude to build a coordinated fleet instead of a single line of steps.

Decision-grade research.

text
workflow: decision-grade research on [your question]
fan out into 5 distinct angles, one researcher per angle, in parallel
every finding needs a source link and a date
a skeptic attacks each finding and tries to disprove it, drop what fails
survivors into one report ranked by confidence
save to research-report.md
change nothing after that without asking me
Security sweep.

text
workflow: audit every route file under src/routes/ for missing auth checks
one agent per file, in parallel
an independent verifier on each finding with fresh context
cap at 20 files on this first run
report how many files came back so nothing fails silently
Codebase refactor.

text
workflow: find every function over 100 lines and propose a refactor for each
one agent per file, in parallel
an independent checker on each proposed refactor with fresh context
dedupe proposals against everything already seen
cap at 50 files on this first run
Content machine.

text
workflow: one ranking-ready draft for [topic]
parallel research: what top-ranking pages cover, real questions people ask,
what those pages skip
merge into an outline then write a full draft
a fact-checker flags every claim without a source
save to drafts/ with flagged claims listed at the top
never publish anything
Discovery loop of unknown size.

text
workflow: hunt this repo for [security issues / broken error handling / dead code]
finders run in parallel
dedupe each new find against everything already seen, not just confirmed results
an independent checker on survivors
keep looping until two consecutive rounds find nothing new, then stop
hard cap on total agents
final list ranked by severity
Ecosystem scan on a schedule.

text
workflow: weekly scan of [topic] across [sources]
check all sources in parallel
dedupe and rank by impact at a barrier
write the digest
save to ecosystem-report.md
re-run by name every week
The model tiering nobody uses
Not every node needs your best model. A graph makes this obvious in a way a single agent never does.

Some nodes are bounded and repetitive: extract this field, classify this ticket, check this source. Some carry the real judgment: synthesize the report, adjudicate the finding, write the final answer.

Run the boring nodes on a cheaper model and spend your expensive tokens where judgment actually lives. Check /model before a large run, then route the fan-out's repetitive nodes down and keep the merge node up. This is the lever that turns a token-hungry graph from expensive into economical without touching its shape.

When a graph is the wrong answer
Here is the part most graph engineering articles skip, because it does not sell the technique.

A graph buys breadth. It does not buy better judgment. It is a tool for width, for independent work done at once. When the work is not wide, the line was never the problem, and adding a graph just adds more ways to fail.

I had a whole course on process diagrams at university. We spent weeks learning to lay work out as graphs and make them as efficient as possible. Back then it felt abstract. Now it is exactly what serious AI engineers argue about. And the hardest lesson from that course was not how to build a graph. It was knowing when not to.

Skip it when the task is small or isolated. Fixing one bug, adding one function. The coordination is pure overhead and a single agent is faster and cheaper. Skip it when you need tight oversight. If you want to read and approve every step before the next runs, a graph's whole point works against you. Skip it when you do not know what you are looking for yet. Exploratory work wants one agent you can steer, not a fleet locked into a plan. Skip it when the steps genuinely depend on each other. If every step reads the last step's output, there is nothing to parallelize.

The tell is the fake-edge test from Step 1. If you cannot find two jobs with no edge between them, there is no graph to build. It is a loop, and a loop is fine. A loop that actually runs is worth more than a graph that impresses nobody and finishes slower.

The anchors that keep a graph honest
Topology alone does not buy truth.

Imagine you build the full graph. Paired verifiers, audit nodes, every node watching another. And the audit checks numbers against the finance system, which came from the same system in the first place. Everything is consistent. Nothing is verified. This graph fails exactly like the single loop did, just later, more expensively, and with far more green lights on the way down.

The graph needs anchors: nodes that can not be argued with. Tests that actually ran, not "should pass," did pass. Revenue that landed in the bank. Customers who actually stayed. And some rules must be frozen, the ones an optimizer would be tempted to weaken, kept off-limits precisely because they are the ones it would bend to win.

The graph is only as honest as the things inside it that refuse to move. Judge it on numbers that can not argue back and it stays grounded. Let it grade its own reports and it will be confidently wrong.

What this actually costs and how to start right
A graph costs more than a normal chat. The coordination gets cheaper, not the work itself. The agents still burn tokens, and a fleet of them burns a pile.

The clearest public example: an engineer used this machinery to rewrite the Bun runtime, translating roughly 535,000 lines of Zig into over a million lines of Rust in about eleven days. By hand that is close to a year of work. It ran about fifty workflows with up to 64 agents going at once. It also cost roughly $165,000 in usage, needed a human designing and monitoring the whole thing, and drew real criticism over whether that much AI-written code can be safely reviewed.

That is the ceiling. Here is where you actually start.

Run one graph capped at twenty items. Read the usage report before you run the next one. Ask three questions: did the fan-out produce anything I could not have gotten from a single agent? Did the verifier catch something the worker missed? Did the result justify what it cost?

If yes to all three, double the cap. If not, fix the shape before you go wider. A graph that earns its cost at twenty items will earn it at two hundred. A graph that does not earn it at twenty will not earn it at two thousand, it will just cost a hundred times more to find that out.

Cap first. Watch the cost. Earn the scale.

The shift
A prompter asks a question. An architect draws a graph.

The linear agent was never the ceiling. It was just the first shape, the one everyone reaches for because it matches how we type. One line, one head, one thing at a time.

Once you can see the nodes and the edges, you stop asking the agent to do more and start asking the graph to do it wider. Fan out where the work is independent. Gate the edges where confidence matters. Freeze the nodes that hold the truth. Tier the models where judgment does not live.

Most people will keep queueing steps in a line.

The ones who learn to draw the graph will run a fleet. And they will never notice the ceiling the rest are stuck under.

