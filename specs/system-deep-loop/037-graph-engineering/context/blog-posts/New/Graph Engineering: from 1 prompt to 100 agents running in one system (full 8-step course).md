Source Link: https://x.com/hanakoxbt/status/2087167924410658912?s=12

A research task comes in at nine in the morning.

Your agent reads the brief, searches, reads what it found, searches again, drafts, checks itself, and hands you something at half past ten.

Ninety minutes for work where almost nothing depended on anything else.

Six of those searches never needed each other. Four of them could have run while the fifth was still loading.

Nothing was slow. Everything was queued.

That is not a prompting problem and it is not a model problem.

It is the shape of the work, and the shape is the thing nobody designs.

Step 1 - most of your edges are not real
The default agent workflow is a line, because that is how instructions get written. Do this, then that, then the other thing.

But sequence is not dependency.

An edge between two steps should mean one thing only: the second step reads what the first step produced.

If it does not read it, the edge is imaginary, and you are paying for it in wall clock time.

Take the research example. Company filings, academic papers, competitor pricing, expert commentary. None of these four consume each other. They all feed the same synthesis at the end.

Written as a chain, that is four round trips in a row.

Written as a fan, it is one round trip and a join.

This is where the hundred comes from, by the way. Not from cleverness. From noticing that most of the arrows in your diagram were never dependencies, and deleting them.


Ask one question of every arrow in your system:

does the next step actually read the previous output
or does it just happen to be written underneath it
Cut every arrow that fails that test.

Most people find they have three real dependencies inside a chain of twelve.

Step 2 - a node you cannot describe is a node you cannot route
Once work is parallel, something has to decide where each result goes. That decision needs to read the result, which means the result has to have a shape.

A node that returns prose forces the next node to interpret it. Interpretation is another model call, another sample, another chance to be wrong about something that was already known.

Every node in a working graph has four properties.

One job, small enough to name in three words.

An explicit input, so you know what it needs.

A structured output, so the graph can branch on it without asking a model what it means.

A named failure state, so a failure is a value and not an exception.

That last one matters more than it sounds. When a node can return not_found as data, the graph routes it. When it throws, the graph stops.

Contracts also make nodes swappable. Change the model, change the prompt, change the tool, and as long as the shape of the output holds, nothing downstream needs to know.

Step 3 - four shapes cover almost everything
You do not need a pattern library. Production graphs are combinations of four things.

The chain, where each step genuinely needs the last. Rare, and usually shorter than people think.

The fan, where one job splits into independent branches that run together and merge at the end. This is the workhorse: research, review, audit, comparison, anything with breadth.

The router, where the system inspects the request and picks a path. Small work takes the short one. Risky work earns the long one.

The controlled cycle, where a node repeats until evidence says it is done. Not until it feels done.

The fan is the one that produces the number in the title. A hundred agents is not a hundred different roles. It is one role, instantiated a hundred times, each with its own slice of the problem and its own context window, all reporting to the same join.


Step 4 - a join is a decision, not a formality
Parallelism is easy to add and easy to abuse. The mistake is putting a barrier after every stage, which quietly turns your fan back into a chain.

A join is worth waiting for only when the next node needs the complete set.

It is needed when you are deduplicating across sources, ranking all candidates against each other, comparing alternatives, or deciding whether coverage is sufficient.

It is not needed when each result can move on by itself. In that case, keep it streaming.

And when you do join, one failed branch should not take the other ninety-nine with it. Collect what settled, note what did not, and let the graph decide whether that is enough to continue.

The topology, not the number of agents, is what decides where your system waits.

Step 5 - let the model judge, let the graph decide
Routing is where people give away more control than they meant to.

A model classifying a request is fine. It is good at that. A model choosing what the system is allowed to do next is a different thing entirely.

Split it.

The classifier is probabilistic and returns a label. The route table is deterministic and maps labels to paths. Low risk goes to the quick path. High risk goes to the full audit. Anything unrecognised goes to a human.

You get the model's flexibility on the judgement and none of its improvisation on the authority.

This also makes the system explainable. When something went the wrong way, you can point at a label and a table instead of guessing at a paragraph of reasoning that no longer exists.

Step 6 - the most valuable node produces nothing
In every graph that survives contact with production, the highest-leverage node is a verifier. It adds no content. Its entire job is to stop weak work from moving downstream.

A verifier can check whether every claim carries a source, whether the source actually supports the claim, whether the output matches the schema, whether the tests pass, whether a second independent path reached the same conclusion.

Put it on the edge, between the generator and everything after it.

And do not ask one agent to produce, approve, and publish in the same context. It will approve. The review is drawn from the same distribution that produced the work, which is why a self-check catches formatting and misses being wrong.

Separate the roles. Separate the prompts. Separate the failure boundaries.

This is the same gate logic as merging code: something outside the worker decides whether the work is allowed to continue.


Step 7 - state is the part the diagram hides
Boxes and arrows look clean until the run dies halfway through and you find out the system has no idea what already happened.

A graph that runs in production keeps durable state: which node is current, which have completed, what artifacts exist, what decisions were made and on what evidence, what budget is left, how many retries have been spent, which human approvals are recorded.

Two rules make this survivable.

Do not pass transcripts between nodes. Pass references. A research node stores its report and returns an identifier. The reviewer reads the artifact directly instead of receiving a summary that has been through three retellings.

Make writes idempotent, so a retry does not create a second copy of something that already exists.

At any moment the graph should be able to answer three questions: what has already happened, why was this route taken, and where can execution safely resume.

If it cannot answer all three, it is a demo with good diagrams.

Step 8 - the shape is your cost model
A graph is not automatically cheaper. It is usually more expensive, and the honest version of this course says so.

Anthropic reported that their multi-agent research system outperformed a single agent by a wide margin on breadth-first work, and that it consumed roughly fifteen times the tokens of a normal chat interaction.

That is the trade. Parallel breadth costs money.

So the shape has to earn it.

- cheap models for bounded extraction, classification, and formatting
- strong models for decomposition, synthesis, and hard verification
- short paths for simple requests
- the full graph only for work whose value justifies the coordination
A hundred agents is the right answer when the task is genuinely wide, when the branches are independent, and when the result is worth the spend.

It is the wrong answer when one context could have held the whole problem.


When a graph is the wrong tool
Keep one agent in one loop when the task is short, when a single context holds everything relevant, when there are no independent branches, when failure is cheap, and when a person can check the result in a minute.

Reach for a graph when work can genuinely run in parallel, when different nodes need different tools or permissions, when outputs need independent verification, when the run has to survive an interruption, or when cost and authority need to be controlled by route.

Start with the loop. Draw the graph when the dependencies force you to, not before.

The layers, in order
Prompt engineering improves the message.

Context engineering controls what the model sees.

Harness engineering builds the machinery around the call.

Loop engineering makes one unit of work improve through feedback.

Graph engineering coordinates the whole job.

The model is one node in that picture. Everything that makes it reliable, fast, and affordable is the system you built around it.

Going from one prompt to a hundred agents is not a matter of spawning more.

It is a matter of knowing which arrows were never real.

I put the full agent engineering course together separately, covering all five layers with the templates and the rollout order.