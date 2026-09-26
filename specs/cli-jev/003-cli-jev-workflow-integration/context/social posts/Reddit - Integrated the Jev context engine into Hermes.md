Integrated the Jev context engine into Hermes — cuts 75% of the context (vs 55%) but keeps every user & agent message verbatim; only old tool-call bulk goes
Showcase — Projects, tools, builds, demos

r/hermesagent - Integrated the Jev context engine into Hermes — cuts 75% of the context (vs 55%) but keeps every user & agent message verbatim; only old tool-call bulk goes
Page 1 (Current page)
Page 2


Item 1 of 2
Hey Everyone, I would like to share my first post on reddit because i think this might be helpful and worth sharing.

One thing every long session hits is context compaction, and the stock LLM-summarizer approach bugged me: it's slow, and it rewrites your history into lossy prose.

So I built a Hermes plugin that integrates Jev — a context engine that selects instead of summarizes. The one-line summary: every user message and every agent message survives compaction verbatim — Jev only removes or shrinks old tool-call/result bulk. Whatever survives stays in its original form — no "here's what happened so far" rewrite.

Around the engine I added the integration layer: engine hook, fallback chain, metrics, and the shadow-comparison harness.

How I measured it: I built a shadow mode into the plugin. On every compaction, BOTH engines run on the same frozen context snapshot — the stock summarizer's output is what the live agent uses, and Jev's result is recorded alongside it in one paired metrics row. Same input, two outputs, every time. A small FastAPI dashboard plots the pairs live.

First three paired compactions (real data, ~75k char contexts excluding user/system instructions):

Metric	Stock summarizer	Jev
Avg context reduction	55%	75%
Avg context after (est., 4 ch/tok)	29,300 tok	16,100 tok
Extra tokens freed per compaction	-	+13,200
Avg duration	44.8 s	5.6 s
Selection-model cost	(bundled)	$0.002
Raw paired rows (chars, context before → after):

before	LLM summarizer	cut	time	Jev	cut	time
278,924	105,935	62%	31s	52,215	81%	6s
277,078	134,350	52%	51s	50,695	82%	7s
236,606	111,548	53%	53s	90,045	62%	5s
255,971	116,359	55%	41s	58,935	77%	5s
What the plugin actually does to your context:

Compaction has to shrink a transcript that's mostly tool traffic: the assistant's function calls with their JSON arguments, and the (often huge) results those calls returned. The stock summarizer collapses all of it into LLM-written prose — every re-write loses fidelity, and the summarizer call itself is slow and expensive.

So what gets removed is specifically old tool-call/result bulk — the stuff that dominates a coding agent's context. Everything conversational stays exactly as it was: user messages are never edited, the assistant's reasoning is never edited, and the recent tail plus anything the scorer flagged as load-bearing passes through untouched. Even an assistant row whose calls were all dropped keeps its text — it just loses the dead tool_calls entries.

That's why the surviving transcript stays fully structured (real tool calls a model can still "see" ran), and why it's cheap: two small-model calls scored the whole thing instead of a frontier model rewriting 240k chars of prose. If the scored plan can't hit the reduction target, the plugin falls back to the stock summarizer — graceful degradation, never a harder cut.

If you're running Hermes on long coding sessions, compaction is the part you feel — this makes it near-instant. Happy to answer questions about how the integration works (engine hook, fallback, shadow mode, the dashboard).

Update:

context engine — jev instead of the stock LLM summarizer
context: engine: jev jev: shadow_mode: true # measure, jev + LLM (For benchmarks)

# --- selection ---
keep_threshold: 0.5        # scorer keeps a call+result only if score >= 0.5
preserve_recent: 3         # last 3 tool calls untouchable
pin_max_chars: 1500        # recent results <= 1500 chars pinned verbatim
truncate_head_chars: 300   # truncated results keep a 300-char head

# --- budget ---
min_reduction: 0.05        # plan must cut >= 5%, else fall back to summarizer
max_state_tokens: 20000    # state-block budget
max_request_tokens: 30000  # scoring-request budget
timeout_ms: 60000          # 60s hard cap per scoring pass

# --- the tiny scorer ---
model: typesafe/jev-1.13   # small fast model via openrouter, ~$0.002/compaction

# --- anti-loop ---
hysteresis_margin: 0.15    # suppress refire if reduction is barely better
hysteresis_cooldown_s: 300 # 5-min cooldown after each compaction


# COMMENTS

u/Hot_Vegetable_932 avatar
Hot_Vegetable_932
•
7d ago
Using JEV for context compression definitely seems like a good idea. Thanks for sharing a good use case.


Upvote
27

Downvote

Reply

Award

Share

u/tanjiro2401 avatar
tanjiro2401
OP
•
7d ago
You can also do Jev + LLM compressor together. So Jev can remove the unnecessary tool definition which doesn't lose much context and LLM compressor can compress the main conversation. Which will give almost current accuracy with a lot of tokens saving


Upvote
9

Downvote

Reply

Award

Share

PolarUgle
•
7d ago
Compaction is more than filtering. Deleting tool calls based on relevance scores can remove critical state and make the agent repeat work.

Jev has too little context for safe pruning. Tool calls often only make sense together with earlier decisions and their results.

You can lose model-native reasoning/state. Editing history can break continuity and hurt prompt caching.

The benchmark measures compression, not agent quality. Fewer tokens and faster compaction mean little if the agent performs worse afterward.

Jev makes much more sense for choosing which tools and skills to load than for deleting conversation history.


Upvote
20

Downvote

Reply

Award

Share

u/Valuable-Run2129 avatar
Valuable-Run2129
•
4d ago
You wrote what I wanted to write.

This is a horrible use of Jev.


Upvote
1

Downvote

Reply

Award

Share

u/tanjiro2401 avatar
tanjiro2401
OP
•
7d ago
Its really helpful for long running coding task. Where old unit, integration test runs result doesn't matter in future. I didn't face any issue with accuracy till now. And yes i am aware it might cause few more turns later to get the context back if it need it again


Upvote
-1

Downvote

Reply

Award

Share

slowmotionrunner
•
6d ago
This example of using it to remove integration test results makes a lot more sense now. Yes, in your case those tool call responses could just be bloat, but tool call responses are not bloat in every case. 


Upvote
4

Downvote

Reply

Award

Share

u/BrennanFlentge avatar
BrennanFlentge
•
6d ago
Teknium (co-founder of Hermes) posted this today: https://x.com/teknium/status/2101398453578555898

TL;DR: it breaks your cache. More expensive sessions.

Comment Image

Upvote
18

Downvote

Reply

Award

Share

sirloindenial
•
7d ago
Two things i could think off is just not have tool list and skill list loaded at first prompt. Instead just have jev fed the list and decide what to use on demand and load it. The main model only needs to call jev and let it decide and load, i think we already have this as tool describe but not skill which still load all the name and description.


Upvote
6

Downvote

Reply

Award

Share

u/tanjiro2401 avatar
tanjiro2401
OP
•
7d ago
I was thinking to try something on skill as well. Thats the major one which takes most context other than tool defination and tool results


Upvote
1

Downvote

Reply

Award

Share

VariousBase
•
5d ago
hey any tutorial on how can we replicate


Upvote
3

Downvote

Reply

Award

Share

u/tanjiro2401 avatar
tanjiro2401
OP
•
4d ago
I can see if i can share the repo. Or you can ask hermes to use jev as compressor via plugin to remove old tool calls and result


Upvote
0

Downvote

Reply

Award

Share

u/JoSquarebox avatar
JoSquarebox
•
7d ago
Nice! I'm curious what the performance looks like, considering the newly cut down context usually is out of distribution to what an agent usually sees.
Another idea would be to use Jeff to i.e. scan tools/skills for relevancy or to just give the agent a natural language search tool that's masked as a subagent (This could be an incredible unlock for searching past conversations for relevancy, or simply as a reranker for RAG).
Jeff is such a cool Primitive.


Upvote
2

Downvote

Reply

Award

Share

u/Great-Marsupial-975 avatar
Great-Marsupial-975
•
7d ago
What about performance/deep reasoning cut?


Upvote
2

Downvote

Reply

Award

Share

u/tanjiro2401 avatar
tanjiro2401
OP
•
7d ago
Still testing, but i think rough numbers are 8x faster, Around 30-40% less token usage that should be equal to 30-40% less cache token cost. Accuracy i believe should be better because exact conversation are intact only tool defination and results are washed away. Only problem I see is that if it need results from a tool result it won't have it and it might need to do a session search


Upvote
1

Downvote

Reply

Award

Share

u/More_Algae8807 avatar
More_Algae8807
•
6d ago
That sounds excellent. Could you please provide instructions on how to install it? Is there a GitHub repository or plugin URL available that I can use to follow the installation process?


Upvote
2

Downvote

Reply

Award

Share

Fair-Perspective7352
•
6d ago
The shadow mode is the part I'd steal here. Running both engines on the same frozen snapshot is the only way I'd trust numbers like this. On the pruning debate above: in my coding sessions the tool results that actually hurt to lose are file contents the agent read once and edits 30 turns later. Old test run output, not so much. Does Jev score those differently, or is it mostly recency plus size?


Upvote
2

Downvote

Reply

Award

Share

Rx29g
•
6d ago
two issues to consider:

Full tool-result contents are sent to TypeSafe without redaction.

The Jev engine has an ungated destructive path if accidentally selected as context.engine.


Upvote
2

Downvote

Reply

Award

Share

BlokZNCR
•
7d ago
team may add it officially?


Upvote
1

Downvote

Reply

Award

Share

riceinmybelly
•
7d ago
This is for Jev, but would it work on OpenJev or Laya?


Upvote
1

Downvote

Reply

Award

Share

Bizzniches
•
6d ago
Laya needs fine tuning. Yes it would work but Jev is plug and play.


Upvote
2

Downvote

Reply

Award

Share

riceinmybelly
•
6d ago
Oh OH, that makes it way less accessible as a a go-to


Upvote
2

Downvote

Reply

Award

Share

u/Choice_Letter_5912 avatar
Choice_Letter_5912
•
7d ago
Awesome now you can pay for another service


Upvote
1

Downvote

Reply

Award

Share

u/mrazster avatar
mrazster
•
6d ago
I'm new to Jev, but after reading up on it a bit, it seems interesting.
Can I ask, how did you integrate it ?


Upvote
1

Downvote

Reply

Award

Share

1-800-Taco
•
6d ago
How does it compare to https://github.com/stephenschoettler/hermes-lcm ?


Upvote
1

Downvote

Reply

Award

Share

Bizzniches
•
6d ago
lol you can make local models like phi-4 with high reasoning but sucky tool calling actually usable. Jev ables this model by being the tool caller. Now a 14b model is closer to a 70b though the context window is like 16,000 but you can work around that some.


Upvote
1

Downvote

Reply

Award

Share

u/CDanger avatar
CDanger
•
6d ago
Why are there two near simultaneous posts on hermes and openclaw subreddits about "jev" (bitch)


Upvote
1

Downvote

Reply

Award

Share

u/N1TROGUE avatar
N1TROGUE
•
6d ago
What bout using Jev to route prompts to the most appropriate model for that task? Think that would be pretty useful no?


Upvote
1

Downvote

Reply

Award

Share

u/Worth_Light_9353 avatar
Worth_Light_9353
•
6d ago
I did exactly the thing, also added sementic decison layer for inputs so llm doesnt have to call billion things. Only best possible outcomes gets reasoning tokens are %90 less. Context stays calm and reliable.


Upvote
1

Downvote

Reply

Award

Share

PoppaBear1950
•
4d ago
Profile Badge for the Achievement Top 1% Commenter Top 1% Commenter
Credit to you for building the shadow-harness and measuring outputs side-by-side—that’s solid engineering hygiene.

But you didn't build an alternative context engine; you built a tool-output pruner. And it will bust your balls sooner than later.

Keeping every user and agent message verbatim sounds great until you’re on turn 40 and realize dead-end reasoning tokens fill a context window just fine on their own.


Upvote
1

Downvote

Reply

Award

Share

PoppaBear1950
•
4d ago
Profile Badge for the Achievement Top 1% Commenter Top 1% Commenter
use open-code-review as a mcp into hermes, see my github: https://github.com/rpmalouin/deepseek-harness


Upvote
1

Downvote

Reply

Award

Share

PoppaBear1950
•
3d ago
Profile Badge for the Achievement Top 1% Commenter Top 1% Commenter
and yes you still run JEV infront of your coding harness... so Hermes->code-review-graph MCP->JEV->coding harness->Hermes that's the flow. I pushed 1.6 billion tokens through deepseek for 15 bucks using this architecture.


Upvote
1

Downvote

Reply

Award

Share

u/peeeanuts avatar
peeeanuts
•
3d ago
I planted marker strings in each request field and checked what gets sent: prompts and assistant text go to TypeSafe verbatim, tool inputs like paths and commands go truncated, and tool result bodies are replaced with 'ok, 51 chars (omitted)'.

Jev is asked whether to keep a result whose contents it never sees. I reviewed this plugin for GitTested: https://gittested.com/reviews/fast-jev-compaction/


Upvote
1

Downvote

Reply

Award

Share

u/solrebel7 avatar
solrebel7
•
7d ago
I saw this Jev on X


Upvote
0

Downvote

Reply

Award

Share

[deleted]
•
7d ago
Community Info Section
r/hermesagent
hermes
Join
hermesagent
The unofficial community for Hermes Agent by Nous Research!
Created Mar 14, 2026
Public

Community Guide
151K
Weekly visitors
4.7K
Weekly contributions
User flair
0sko59fds24
Community Bookmarks
Wiki

Community Links
Megathread Posts

Nous Research Links

Jonathan's Links
Post Flair
Workflow — Daily habits, multi-agent setups, best practices
Strategy — Business models, monetization, automation
Use Case — Real tasks, business & personal
Showcase — Projects, tools, builds, demos
Guide — Tutorials, walkthroughs, repeatable how-tos
Discussion — General thoughts, opinions, comparisons
Help — Technical issues, errors, config, debugging
News — Official Releases, announcements, major changes
MODELS - model choice, routing, pricing, local vs cloud, VRAM
MEMORY & Context — Providers, context window, forgetting issues
INTEGRATIONS — App connections, webhooks, API workflows
Infra / Hosting - VPS, Docker, Coolify, Proxmox, Remote, uptime
Meta - Subreddit, wiki, rules, moderation, community feedback
Megathread — Weekly help, check-ins, recurring mod threads
Scheduled Post Calendar
Thursday - Showcase Post
Thursday - Showcase Post
Friday - Weekly Usecase
Friday - Weekly Usecase
r/hermesagent Rules
1
Respect others and be civil
2
No Spam, Soliciting, or Unapproved Selling
3
The 90/10 Self-Promotion Guideline
4
Technical Help Requires Context
5
Keep It Relevant to Hermes Agent
6
Context Required in Posts & Reports
7
Keep Politics to a Minimum
8
Cross-Post Limit
9
New Account Post Approval
10
Constructive Discussion
11
Moderator Discretion
Welcome to the Sub
Welcome to the unofficial community for Hermes Agent — the powerful, open-source AI assistant created by Nous Research.

Whether you are migrating from OpenClaw, tinkering with local LLMs, or just want an AI that actually gets stuff done, you are in the right place.

What Hermes Agent can do:

📱 Omnichannel: Chat seamlessly on Telegram, Discord, WhatsApp, Signal, or email.

💻 Action-Oriented: Runs code, executes terminal commands, browses the web, and manages local files.

🧠 Context Aware: Features persistent memory across all your conversations.

🛠️ Highly Customizable: Comes with 20+ built-in tools and fully customizable personalities.

Moderators
Message Mods
u/smolpotat0_x
u/Jonathan_Rivera avatar
u/Jonathan_Rivera
JR
u/NousResearch avatar
u/NousResearch
 
Hermes Contributor
u/AutoModerator avatar
u/AutoModerator
u/bot-bouncer avatar
u/bot-bouncer
u/PracticlySpeaking
 
News Curator
u/xeeff
 
Mod-Setups/Models
floory
u/Riknarr avatar
u/Riknarr
 
Community Technical Support
u/community-home avatar
u/community-home
🚀 ​​Community Home
View all moderators
Installed Apps
🚀 ​​Community Home
Bot Bouncer
Reddit Rules
Privacy Policy
User Agreement
Accessibility