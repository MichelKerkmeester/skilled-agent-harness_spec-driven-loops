Source: https://x.com/0xCodez/status/2079165300625330317

Graph Engineering with Claude: 14-Step roadmap from 0 to graph architect (Full Course)
Most people who try to build a multi-step agent end up with a straight line. Step one, step two, step three - each waiting politely for the last to finish before it starts.

9/10 notice that half those steps never needed to wait at all.

They don’t route. They don’t branch. They don’t parallelize. They just queue - one head, one context, one thing at a time, until the window fills up and the agent forgets what it was doing.

Follow my Substack to get fresh AI alpha: movez.substack.com
This is the 14-step roadmap that turns that single-file line into a graph: one that fans out across a fleet, verifies its own findings, and converges on a result a lone agent could never hold.


Here’s the shift nobody spells out. A prompt is a sentence. A loop is a cycle. A harness is the floor the agent stands on. 

But the shape of the work itself - what runs before what, what can run at the same time, what has to wait for everything else - that shape is a graph. Nodes do the thinking. Edges carry the results. 

Claude Code shipped the tooling to build these graphs directly: dynamic workflows. 

Claude writes a plain JavaScript orchestration script, then spawns a coordinated fleet of subagents to execute it - and the coordination itself costs zero model tokens, because it’s code, not a conversation.

01. Nodes are jobs. Edges are what flows.
A graph has exactly two things, and getting them straight fixes most of the confusion. A node is a unit of work - one agent, one bounded job, one input in and one output out. 

An edge is a dependency: it says this node’s output feeds that node’s input. Nothing more.


The mistake is treating “and then” as an edge. “Summarize the file and then tell me the weather” has no edge between the two - the weather doesn’t consume the summary. 

That’s two disconnected nodes that a linear script needlessly chains. The edge only exists when data actually moves across it. 

Learn to ask, for every “and then” in your agent: does the next step read the last step’s output? If not, there is no edge, and the wait is wasted.

python
Draw it as boxes and arrows. A box is an agent() call. 
An arrow is a variable passed from one call’s return into another’s 
prompt. If you can’t draw the arrow - if no variable crosses - the two 
boxes are independent, and independence is the thing you’ll exploit 
for the rest of this course.
02. Your linear script is a degenerate graph
When you write an agent as “do A, then B, then C, then D,” you’ve drawn a graph - a single unbranching chain. Every node has exactly one edge in and one edge out.

 It runs correctly. It also runs slowly and fragile, because a chain has no redundancy: if C stalls, D never happens, and A’s work is trapped upstream with nowhere to go.


The first real skill of graph engineering is redrawing the chain. Take your linear agent and, for each arrow, ask the Step 1 question. 

Most chains have two or three arrows that don’t carry data - they’re just the order you happened to type things in. 

Cut those arrows and the chain collapses into something wider: a few independent nodes that could all run at once, feeding a single node that needs them all.

03. Give every node a contract
A node you can’t reason about is a node you can’t parallelize. The fix is a contract: bounded input, bounded output, exactly one job. 

The input is whatever the node reads - passed in explicitly, never assumed from a shared window. The output is a defined shape, ideally validated, so the next node can consume it without guessing.


In a workflow this contract is enforced with a schema. When you hand Claude an agent() call with a JSON schema, the subagent Claude spawns is forced to return validated structured data - validation happens at the tool-call layer, so Claude retries on mismatch instead of handing you free text you have to parse and pray over. 

This is the difference between a node Claude can wire into a graph and a node that only works when a human reads its output.

python
// A node with a real contract: bounded in, validated out, one job.
const ITEM = {
  type: 'object', additionalProperties: false,
  properties: {
    title:   { type: 'string' },
    url:     { type: 'string' },
    impact:  { type: 'string', enum: ['high', 'medium', 'low'] },
  },
  required: ['title', 'url', 'impact'],
};

const result = await agent(source.prompt, {
  label:  `research:${source.key}`,
  schema: ITEM,           // forces validated structured output
  agentType: 'general-purpose',
});
// result is now a shape the next node can trust — not free text.
04. Treat the edge as a data contract
An edge isn’t just “B comes after A.” It’s a promise about what crosses: A produces this shape, and B is built to consume this shape. When you name the edge by its data - not its order - two things get easier. 


You can see instantly whether the edge is real (does data actually move?), and you can swap the node on either end without breaking the graph, as long as the shape holds.

In practice, the edge lives in plain JavaScript. The reduce step between fan-out and synthesis - flatten, dedupe, filter - is just code operating on the shapes your nodes returned. 

No agent needed. One of the quiet wins of graph thinking: a huge amount of what people burn model tokens on is really an edge, and edges are free.

python
The temptation is to spawn an agent to “combine the results.” Resist 
it. If combining means flatten-and-dedupe, that’s results.flatMap(...) 
and a Set — deterministic, instant, zero tokens. Save agents for 
judgment, not for plumbing. A graph where every edge is an agent is a 
graph paying rent on its own wiring.
05. Fan out with parallel()
This is the move that pays for everything. When you have N independent nodes - N sources to check, N files to review, N routes to audit - you don’t chain them. 

You tell Claude to fan them out and run them at once. In a workflow that’s parallel(): Claude takes an array of thunks and spawns one subagent per thunk, all executing concurrently, then hands you back the array of results.


Two details make it robust. First, parallel() is a barrier - it waits for every thunk before it returns, so the next stage sees the complete set. Second, a thunk that throws resolves to null instead of rejecting the whole batch, so one flaky agent can’t sink the run. 

Always .filter(Boolean) the results. Concurrency is capped around your core count and the excess queues, so you can pass a hundred thunks and they’ll all finish - just a handful at a time.

python
phase('Research');

// Nine sources, nine agents, all at once.
const raw = await parallel(
  SOURCES.map((s) => () =>
    agent(s.prompt, {
      label: `research:${s.key}`,
      phase: 'Research',
      schema: ITEM_SCHEMA,     // each node returns validated JSON
      agentType: 'general-purpose',
    }),
  ),
);

const collected = raw.filter(Boolean);  // drop the nulls from failed agents
The fan-out lives in code Claude wrote, not in a model conversation. Claude’s own context never holds nine sources at once - each subagent carries its own, and only the final answer comes back. 

That’s what lets Claude scale a workflow to dozens or hundreds of subagents without drowning the session. The orchestration layer costs zero tokens because it isn’t another turn of Claude thinking.

06. Fan in at a barrier
A fan-out is only useful if something gathers it. The fan-in is the node where edges converge - where one agent (or one piece of code) sees all the upstream results at once and does something that requires the whole set: dedupe across sources, rank by impact, early-exit if the total came back empty. This is the one place a barrier earns its wall-clock cost.


The rule that keeps graphs fast: use a barrier only when a stage genuinely needs every prior result together. Deduping across all sources? Barrier - correct. 

python
// The edge: plain JS, no agent, zero tokens.
const flat = collected.flatMap((c) => c.items);
log(`Collected ${flat.length} items`);

phase('Curate');
// The barrier node: needs the WHOLE set to dedupe + rank.
const curated = await agent(
  `Dedupe and rank these by impact:\n${JSON.stringify(flat)}`,
  { phase: 'Curate', schema: CURATED_SCHEMA },
);
Just flattening a list? That’s an edge, do it inline. The smell test is brutal and simple: if you wrote parallel → transform → parallel, and that middle transform has no cross-item dependency, you should have used a pipeline and skipped the barrier entirely.

07. The diamond: split → work → merge
Put fan-out and fan-in together and you get the workhorse topology of every serious agent graph: the diamond.

 One node splits the job, many nodes do the work in parallel, one node merges. It’s the shape behind a market scan, a dependency audit, a code review, a research report - swap the sources and prompts and the same skeleton adapts.


The canonical form has a name worth memorizing: fan out → reduce → synthesize. Fan out to gather breadth, reduce with plain code to compress it, synthesize with a final agent to write the answer. 

Once you see the diamond, you stop asking “how do I make my agent do more steps” and start asking “where’s the split, where’s the merge” - which is the question that actually scales.

08. Route the edge at runtime with a conditional
Not every graph is fixed. Sometimes the edge to take depends on what a node found. A router node inspects a result and decides which downstream path fires - classify the ticket, then branch to the right handler; check the diff size, then either do a quick review or spin up a full audit. 

In a workflow this is just a JavaScript if or switch on a node’s validated output, because control flow lives in code.


This is where determinism becomes a feature, not a limitation. The router’s decision can be Claude-powered (a subagent classifies), but the routing is code Claude wrote - so it runs the same way every time for the same classification. 

You get Claude’s judgment at the node and the script’s reliability at the edge. No emergent “Claude decided to skip the audit” surprises  - because the skip would have to be written into the graph, and it isn’t.

python
// Router node: an agent classifies, code picks the edge.
const { severity } = await agent(
  `Classify this diff's risk:\n${diff}`,
  { schema: { type: 'object',
      properties: { severity: { enum: ['low', 'high'] } },
      required: ['severity'] } },
);

let review;
if (severity === 'high') {
  // heavy path: full parallel audit
  review = await parallel(FILES.map((f) => () => agent(`Audit ${f}`)));
} else {
  // light path: one quick pass
  review = await agent(`Quick review of ${diff}`);
}
09. Put a verifier on the edge
The real leverage of a graph isn’t more agents - it’s the structure you can wrap around them to produce confidence. 

A verifier node sits on the edge before a result is allowed downstream, and its only job is to try to kill the finding. If it survives, it passes. If not, it never reaches the answer.


Three patterns are worth having in your hands. 

Adversarial verify: for each finding, spawn N independent skeptics prompted to refute it; keep it only if a majority survive. 
Perspective-diverse verify: give each verifier a distinct lens - correctness, security, does-it-reproduce - because diversity catches failure modes that N identical checks never will. 
Judge panel: generate N attempts from different angles, score them with parallel judges, synthesize from the winner while grafting the best of the runners-up. 
This is exactly the pattern that let a real team port the Bun runtime with adversarial code review baked into the loop.

10. Isolate nodes so one failure can’t poison the graph
In a chain, a failure cascades - C dies, D never runs, the whole thing halts. In a graph, failure should be contained to its node. 

That’s already partly true: a thunk that throws inside parallel() resolves to null, so eight good agents still return while one bad one drops out. Your .filter(Boolean) is the containment. 

Design every fan-in to tolerate missing inputs rather than assume a full set.


The subtler failure is nodes stepping on each other. When agents write files in parallel, they can collide. 

The fix is isolation: "worktree" - each agent runs in its own git worktree, does its work in a sandbox, and merges cleanly. 

Reach for it only when nodes actually write in parallel. it’s the seatbelt for the one topology that needs it, not a default tax on every run.

11. Add a cycle - but make it converge
Sometimes you don’t know how big the job is until you’re in it: unknown-size discovery, a bug sweep where finding one bug reveals three more. That needs a cycle - a controlled edge back to an earlier node. 

The danger is obvious: a cycle that doesn’t converge is an infinite loop that spawns agents until your budget is gone.


The pattern that converges is loop-until-dry: keep spawning finders until K consecutive rounds surface nothing new, then stop. The one detail that makes or breaks it - and the mistake almost everyone makes the first time - is what you dedupe against. 

Dedupe against everything seen, not just against confirmed results. Otherwise rejected findings reappear every round, the loop never runs dry, and you’ve built a machine that pays to rediscover the same dead ends forever.

text
const seen = new Set(); const confirmed = []; let dry = 0;

while (dry < 2) {                       // stop after 2 empty rounds
  const found = (await parallel(
    FINDERS.map((f) => () => agent(f.prompt, { schema: BUGS }))
  )).filter(Boolean).flatMap((r) => r.bugs);

  const fresh = found.filter((b) => !seen.has(key(b)));
  if (!fresh.length) { dry++; continue; } // nothing new → toward dry
  dry = 0;
  fresh.forEach((b) => seen.add(key(b))); // dedupe vs SEEN, not confirmed

  // diverse-lens verify each fresh finding before it counts
  const judged = await parallel(fresh.map((b) => () =>
    parallel(['correctness', 'security', 'repro'].map((lens) => () =>
      agent(`Judge "${b.desc}" via ${lens} — real?`, { schema: VERDICT })))
    .then((v) => ({ b, real: v.filter(Boolean).filter((x) => x.real).length >= 2 }))));

  confirmed.push(...judged.filter((v) => v.real).map((v) => v.b));
}
12. Tier the models across the nodes
Not every node needs your best model. A graph makes this obvious in a way a single agent never does: some nodes are bounded and repetitive (extract this field, classify this ticket), and some carry the real judgment (synthesize the report, adjudicate the finding). 

Run the boring nodes on a cheaper model and spend your expensive tokens where judgment actually lives.


In a workflow every subagent Claude spawns inherits your session model unless the script overrides it - so by default a big run bills entirely at your session tier. The model option on a single agent() call tells Claude to route just that node elsewhere. 

Check /model before a large run, then have Claude route the fan-out’s repetitive nodes down to a cheaper model and keep the merge node up. This is the lever that turns a token-hungry graph from expensive into economical without touching its shape.

13. Topology is your cost and latency
The shape of the graph isn’t cosmetic - it’s the single biggest lever on wall-clock time. The choice that trips everyone up: parallel() versus pipeline(). A parallel() barrier makes everything wait for the slowest node before the next stage starts.

A pipeline() streams each item through all stages independently, with no barrier - item A can be in stage 3 while item B is still in stage 1. Fast items finish early instead of idling behind slow ones.


Default to pipeline(). Reach for a barrier only when a stage truly needs every prior result at once - a cross-set dedupe, an early-exit on the total, a prompt that compares against “the other findings.” “It’s cleaner code” and “the stages feel separate” are not reasons; barrier latency is real, measurable, wasted time. Separate is not the same as synchronized.

14. Let Claude draw the graph - self-routing
The final move is to stop drawing the graph by hand for jobs you can’t plan in advance. 

With dynamic workflows, you describe the objective and Claude writes the orchestration script itself- decomposing the task, choosing the fan-out, spawning a coordinated fleet of subagents, and synthesizing the result. You get a graph tailored to this run instead of a fixed one you hoped would fit.


There are three ways in. Say the word “workflow” in your prompt and Claude writes one for the task. Run a saved or bundled one - /deep-research is a real graph shipping in production: scope → parallel search → fetch → adversarial verify → synthesize, the exact skeleton from this course. 

Or turn on ultracode and Claude plans a workflow for every substantial task in the session. When a run is good, press s to save its script into .claude/workflows/ - version-controlled, re-runnable by name, a graph anyone who clones the repo can launch.

python
› Run a workflow to audit every route under src/routes/ for missing 
auth. Spawn one agent per route file, then verify each finding before 
reporting. ● Claude wrote an orchestration script · launching in 
background… /workflows — auth-audit · running ✓ Scope 1/1 2.1k tok · 
4s ✓ Fan-out 18/18 one agent per route file ◯ Verify 11/18 3-vote 
skeptics per finding… ○ Synthesize 0/1 waiting on verify session stays 
responsive — keep working while the fleet runs
Six graphs to build with Claude this week

Security sweep across every route. Claude spawns one subagent per route file, each hunting for missing auth checks, then a verifier pass confirms every finding before it reaches the report. Breadth no single context could hold.
Cited report with /deep-research. A graph that ships in Claude Code already. Claude decomposes your question into distinct angles, runs parallel searches, dedupes sources, then adversarially verifies every claim with three-vote skeptics before writing.
Port a module, file by file. The Bun ceiling, scaled to your repo. Claude fans out translation across files, runs the test suite as a gate on each, and loops the failures back - adversarial review catching what a single pass would ship broken.
Adversarial review of a diff. Claude routes on diff size: a small change gets one quick pass, a large one triggers a full parallel audit with reviewers on distinct lenses - correctness, security, performance - then a judge panel synthesizes.
Ecosystem scan on a schedule. Save it once, re-run it forever. Claude checks many sources in parallel - eleases, blogs, discussion - ranks by impact at a barrier, and writes the digest. Version-controlled in .claude/workflows/, launchable by name.
Discovery of unknown size. You don’t know how many bugs are there. Claude runs finders in parallel, dedupes each new find against everything seen, verifies survivors, and keeps looping until two rounds turn up nothing new - then stops.
Conclusion: 
A prompter asks a question. An architect draws a graph.

The linear agent was never the ceiling - it was just the first shape, the one everyone reaches for because it matches how we type. One line, one head, one thing at a time.

Once you can see the nodes and the edges, you stop asking the agent to do more and start asking the graph to do it wider: fan out where the work is independent, gate the edges where confidence matters, tier the models where judgment doesn’t.

Most people will keep queueing steps in a line. The ones who learn to draw the graph will run a fleet - and never notice the ceiling the rest are stuck under.