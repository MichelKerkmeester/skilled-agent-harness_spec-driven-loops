Source Link: https://x.com/Sprytixl/status/2087066798608752671

The $1.2M Agent Engineering skill is now open source. Here it is.
A senior AI engineer at Anthropic makes $1.2 million a year. And right now you can use the exact same approach that makes them that valuable. Not through a better education. Not through access to closed models. Through a system that Kimi K3 makes accessible to anyone in a week.

Anthropic analyzed 400,000 real coding sessions from 235,000 users and found the exact formula. It's not about who writes code faster. It's about who correctly delegates work to agents.

Bookmark this and follow - I'm Sprytix, a developer who builds AI systems and automation pipelines that turn technology into real income. DMs open.
Here's what they found and how to build it yourself.

What 400,000 sessions actually showed

In June 2026 Anthropic published research on how real developers use Claude Code. Seven months of data. 235,000 developers. 400,000 sessions.

anthropic.com/research/claude-code-expertise
The result surprised everyone including Anthropic.

The human makes most planning decisions. The AI makes most execution decisions. Not "AI writes code instead of humans." A clean division of labor where the human stays the architect and the agent becomes the executor.

But the most important finding was something else entirely. The more domain expertise a person has the more work the agent does per single instruction. A junior developer gives the agent a task and gets a small step back. A senior developer gives the agent a task and gets an entire feature back.

AI doesn't eliminate expertise. It multiplies it.

Over seven months the estimated value of a typical task grew approximately 25%. Debugging sessions fell by almost half. Usage shifted toward end-to-end work - deployment, data analysis, full feature implementation. The trend is not AI writing functions faster. It's AI completing engineering tasks that used to take humans days.

The metric that actually matters

Most people compare AI models through benchmarks. MMLU, HumanEval, SWE-bench. These numbers look scientific but they don't answer the question that actually matters in practice.

METR - an independent AI safety research organization - asked the right question instead.

metr.org/time-horizons

Not how many points did the model score. But how long a human expert task can the agent complete with reliable success.

They found that the 50% task horizon of frontier agents doubled approximately every seven months on their tested task set. Not the raw speed of execution. The complexity of what the agent can reliably finish from a single instruction.

This reframes everything. The question is no longer can AI write this code. The question is how large a task can I hand off to an agent and trust the result without babysitting every step.

Where everything breaks down

Anthropic didn't just study how people use agents. They built complex agent systems themselves and documented every failure.

anthropic.com/engineering/effective-harnesses-for-long-running-agents
They gave an agent the task of building a production-quality web application across multiple context windows. Even with a frontier model it fell apart. Not because the model was stupid. Because the environment was wrong.

Two things kept breaking. The agent tried to do too much in one go. And when a new context window started the agent had no memory of what happened before. It started from scratch every time. Like a team of engineers working in shifts where each new engineer arrives with zero knowledge of what the previous shift did.

The fix was surprisingly simple.

Instead of one agent trying to build everything, you use an initializer that understands the full task and breaks it into individual features. Then a coding agent implements exactly one feature at a time, runs the tests, commits to git and writes a progress file. When the next context window starts the agent reads the progress file and continues from where the last one stopped.

The external memory - git history, progress notes, test results - survives any context window. The agent doesn't need to remember everything. It needs to be able to restore state from what was written down.

The three things that separate working systems from broken ones

Anthropic open-sourced the harness they built.

github.com/anthropics/cwc-long-running-agents

First thing that makes it work: Default-FAIL. Every success criterion starts as false. The agent cannot simply announce that it's done. It has to show evidence that each criterion is actually met. Without this pattern agents grade their own homework and always give themselves an A. With it every claim has to be proven before the task closes.

Second thing: the evaluator is a completely separate agent with a fresh context that has never seen the work being evaluated. It cannot modify anything. It can only return pass or fail with a reason. This is the same principle as code review in a real engineering team. The person who wrote the code is not the person who reviews it. They are too close to it. A fresh pair of eyes catches what familiarity hides.

Third thing: the agent writes its own handoff notes. After every commit it updates the progress file with what was done, what's left and anything the next session needs to know. This one change transforms a system that resets every session into one that accumulates progress indefinitely.

Why SWE-agent and Agentless matter here

Princeton researchers built something called SWE-agent and published the findings.

arxiv.org/abs/2405.15793
Their main insight: models are a new kind of computer user and they need interfaces designed specifically for them. When they built tools optimized for how agents actually navigate code, edit files and run tests, performance jumped significantly. The model didn't change. The environment around it did.

This confirms what Anthropic found from a different direction. The harness is not secondary to the model. It is half the system.

But there's an important counterargument worth knowing. The Agentless paper showed that a simple three-step pipeline - localize the problem, repair it, validate the patch - without any autonomous agent achieved strong results at low cost.

arxiv.org/abs/2407.01489

The lesson is not that agents are always better. It's that complexity should match the task. A simple workflow beats a complex agent for simple problems. A complex agent earns its cost on complex long-horizon problems. Knowing which situation you're in is most of the skill.

What this changes about the job

The old engineering job looked like this. Learn the language. Write the code. Debug the code. Ship. Repeat.

The new engineering job looks different. You define what outcome you want. You design the environment the agent works in. You break the work into pieces the agent can handle reliably. You set up the verification so you know when something is actually done versus just claimed to be done. You preserve state between sessions so nothing is lost. Then you review what came back and decide whether to ship it.

The code writing moved to the agent. The thinking about what to build and whether it worked stayed with the human. Anthropic's research showed this exact division emerging naturally across 400,000 real sessions. The sessions where people got the most out of the agent were the sessions where the human made better planning decisions and trusted the agent with larger execution tasks.

This role already has a name. Agent Engineering. Not prompt engineering. Not vibe coding. Designing environments where agents can reliably do engineering work.

Where Kimi K3 fits

All the principles above work with any capable model. What makes Kimi K3 relevant here is that it's open-weight, built specifically for long-horizon coding and knowledge work, and comes with infrastructure that already implements several of these patterns out of the box.

github.com/MoonshotAI/Kimi-K3
Moonshot built K3 for the exact use case Anthropic's research describes - sessions where a single expert instruction should trigger a large amount of reliable execution. The context window of one million tokens means the agent can hold the entire progress file, the full feature list and large portions of the codebase in one session without losing track.

Kimi Code is where the harness principles become practical.

github.com/MoonshotAI/kimi-code
It already ships with three subagents that map directly onto the Anthropic harness architecture. The plan subagent understands the task and breaks it into steps. The explore subagent researches the repository and documentation without polluting the main context. The coder subagent implements in isolation. Each one works in its own context window so the main session stays clean.

You add Default-FAIL on top. You add progress.md for handoff. You add a fresh-context evaluator. And you have the full harness that Anthropic documented running on an open model.

What a week of building this actually looks like

The first day you install Kimi Code and give it a real small task. Not write a function. Something with a beginning, middle and end. Fix this bug, write a test that proves it's fixed and commit both. You watch what the plan subagent does, where the coder subagent goes wrong and how the current session handles the gap between what you asked for and what came back.

The second day you write AGENTS.md. Every convention you've explained to an AI model more than once goes in this file. Your tech stack. What never to touch. How tests should be written. How commits should be described. You write it once and it's read at the start of every session from then on.

The third day you implement Default-FAIL and progress.md. You create a template for the progress file and test whether the agent can pick it up in a new session and continue correctly. You run the same task twice - once with handoff and once without - and compare what happens at the start of session two.

The fourth day you set up the evaluator. A separate agent with no write access, no history of the current work and a simple job - read what was produced, check it against the success criteria and return pass or fail with evidence. You test it on something you know failed and something you know worked. If it catches one and approves the other the evaluator is calibrated.

The fifth day you connect GraphRAG for persistent memory across the repository.

github.com/microsoft/graphrag
You index the codebase and test whether the agent can find the relevant subgraph for a real question about your architecture. This is the step that makes everything faster - instead of the agent reading ten thousand files it reads the two hundred nodes that are actually relevant.

The sixth day you run the first real long-horizon task. Something that would take you a full day. You set it up, start the system and step away. You come back to the evaluator report and the git history. You review the decisions not the process.

The seventh day you measure. Time spent versus output produced. Quality of the evaluator feedback. Where the system succeeded and where it still needed your intervention. You find the first task type that the system handles reliably enough to hand off to a client.

The conclusion Anthropic's research actually points to

The $1.2M engineer at Anthropic is not faster at typing. They spend their time on the decisions that require human judgment - what to build, whether the architecture is right, whether the output actually solves the problem. The execution happens through systems they designed.

Anthropic showed this across 400,000 sessions. METR showed the task horizon is growing every seven months. Princeton showed the environment matters as much as the model. The Agentless researchers showed that simplicity beats complexity when the problem is simple.

Put it together and the picture is clear. The leverage is not in the model. It's in the harness around it. In the Default-FAIL contract that means done actually means done. In the progress file that means sessions accumulate instead of reset. In the fresh evaluator that means quality is checked by someone who wasn't too close to the work.

All of this is documented. All of it is open source. Kimi K3 makes it runnable without a frontier lab budget.

One week. The same system. Without the $1.2M salary.

Most developers will keep prompting AI for individual functions and wonder why they're not getting dramatically more productive. A few will spend a week building the harness and stop wondering. 

