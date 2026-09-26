https://www.explainx.ai/blog/fast-jev-compaction-claude-code-plugin-2026

fast-jev-compaction: Claude Code Compaction Without a Lossy Summary
Claude Code, Jev, Context Engineering, Agent Skills, Compaction

fast-jev-compaction replaces Claude Code's /compact summary with Jev-scored deletions of tool calls — nothing kept is ever rewritten or summarized.

Sep 20, 2026
·
9 min read
·
Yash Thakker
add explainx.ai
copy for llm
copy text
explain with melo
share
go deep
fast-jev-compaction: Claude Code Compaction Without a Lossy Summary
A r/ClaudeCode thread with over 300 upvotes and 80+ comments this week pointed at tamaratran/fast-jev-compaction — a Claude Code plugin, now past 4,200 GitHub stars, that swaps out /compact's built-in summary for something structurally different: instead of asking Claude to write a shorter version of the conversation, it asks Jev, TypeSafe AI's non-text-generating "System One Model," a yes/no question about every single tool call in the session — should this stay — and deletes the ones it says no to. Nothing gets rewritten. What survives is kept word for word.

That distinction — deletion versus summarization — is also where the Reddit thread itself went sideways for the first dozen comments, with several sharp technical readers initially describing a completely different plugin before someone traced it back to the actual repo. Both the confusion and the resolution are worth walking through, because they map onto a real distinction in how context-management tools for coding agents can work.

TL;DR
table · 2 cols
Copy
Question	Answer
What does it replace?	Claude Code's built-in /compact summary generation
What does it actually remove?	Tool calls and their results — never user or assistant prose
How does it decide?	Sends the whole conversation state (with tool results replaced by short notes) to Jev, asks two per-call yes/no questions: keep the call, keep the result verbatim
Is it lossy?	Selectively — kept items are untouched; dropped items are gone (or truncated to a head snippet), not summarized in between
Does it need Claude Code function hooks?	Yes — an early-access 2.1.274+ feature gated behind CLAUDE_CODE_ENABLE_FUNCTION_HOOKS=1
Is this the same as native Claude Code background compaction?	No — that's a separate, unofficial, Anthropic-controlled experimental feature reported by Reddit users inspecting the binary, not something this plugin builds on
What actually happens when it runs
Retro desktop window compressing a long stack of context blocks into a shorter kept set

The mechanism, per the project's own README, works like this:

Every tool_use block is paired with its tool_result by ID. Anything in the first message, or in the newest handful of messages (preserveRecentMessages, default 6), is pinned and never touched.
The rest of the conversation — oldest first — gets sent to Jev as "state," but with every tool result swapped for a short placeholder (ok, 4213 chars (omitted)). Tool inputs and all text messages stay in, unabridged, up to a token ceiling; if the whole thing doesn't fit, it gets staged down in several passes (truncating tool inputs, then abridging old messages to head-and-tail, then collapsing them to a one-line note) before compaction gives up and throws an error rather than silently losing more than it's designed to.
For each non-pinned tool call, Jev answers two calibrated yes/no questions: should the call itself stay (its existence and inputs still matter to the task), and should its result stay verbatim (the contents are still needed, and re-running the tool wouldn't just regenerate the same thing).
Above a confidence threshold (keepThreshold, default 0.5), keeping the result keeps the whole call intact. Below that, if the call itself is still judged worth keeping, its result gets truncated to a short head snippet plus a note. Below that too, the call and its result are removed entirely.
The message list is rebuilt from these decisions — nothing pinned or above-threshold ever gets rewritten, only removed or truncated.
The practical effect: a session where an agent ran forty tool calls to debug a broken deploy — reading files, running tests, checking logs, retrying commands — ends up keeping the handful of calls that actually mattered (the error that revealed the root cause, the fix, the passing test) and drops the calls that were dead ends, without ever asking a model to paraphrase what happened. That's a meaningfully different failure mode from summarization, where a paraphrase can silently drop an exact file path, error string, or constraint the agent was told earlier in the session — the exact problem explainx.ai's guide to LLM context windows covers as the core reason context management matters at all.

For developers
3.5k readers
The AI developer stack — weekly

New skills, MCP servers, agent loops, and Claude Code workflows — curated for engineers building with AI. Delivered every week.

Email for explainx.ai newsletter
you@example.com
Subscribe
The Reddit thread conflated two different tools
The top comment thread spent several exchanges describing something that turned out to be a different, earlier project: a hook that filters individual Bash tool outputs before they ever reach the model — so a pytest run that produces a thousand lines of passing-test noise gets scored line by line (or chunk by chunk) and trimmed down to errors and relevant values, with the full output archived to disk and a marker left in its place. That's a real, useful pattern, and one Redditor's own technical inspection of it (posted mid-thread) is a genuinely good walkthrough of how a PostToolUse hook, a disposability classifier, and a hard-protect list for error lines and test summaries fit together.

But it's not what fast-jev-compaction does. The output-filtering hook runs during a tool call, shrinking one command's output before it's added to context at all. fast-jev-compaction runs at compaction time, deciding — after the fact, across the whole session — whether entire earlier tool calls (input and result together) are still worth keeping around. One is input hygiene; the other is retroactive pruning. They compose well together, but they solve different problems, and it took several comments before the thread sorted out which repo actually did which.

The part of the thread that's arguably more interesting: Claude Code's own hidden compaction
Buried a few replies deep, one commenter — describing having inspected the Claude Code binary directly across two recent version bumps — laid out a detailed, unofficial account of Anthropic's own experimental background-compaction work: an internal flag (reported as tengu_session_memory in one build, since renamed) that periodically writes rolling summary files during a session, paired with a separate flag (tengu_sm_compact, later tengu_sepia_moth with a user-facing precomputeCompactionEnabled setting exposed in /config only once the gate is on) that precomputes a compaction result in the background so hitting the context limit causes no visible delay to the user. None of this is documented by Anthropic as a stable feature, the flag names reportedly changed between the two versions inspected, and it should be treated as exactly what it is — one user's binary inspection, not an announced capability. It's a useful data point regardless: if accurate, Anthropic is independently pursuing the same underlying goal — cheap, fast, low-surprise compaction — through a different mechanism (background precomputation of Claude's own summary) than fast-jev-compaction's external scoring-and-deletion approach.

Setting it up
Per the project's README, this ships both as an installable npm library (fast-jev-compaction) and as a Claude Code plugin. The plugin path requires Claude Code 2.1.274 or later with an early-access function-hooks flag enabled:

json
Copy
{ "env": { "CLAUDE_CODE_ENABLE_FUNCTION_HOOKS": "1", "TYPESAFE_API_KEY": "<your key>" } }
Then, from a shell:

bash
Copy
claude plugin marketplace add tamaratran/fast-jev-compaction
claude plugin install fast-jev-compaction@fast-jev-compaction
After a restart (or /reload-plugins), /compact and auto-compaction route through Jev instead of Claude's own summarizer. The plugin reports its own outcome in a toast — kept N/M messages, no summary when the Jev-pruned history replaced the built-in summary, or a fallback notice when the session was too short to see enough reduction and Claude Code's normal summary ran instead. That fallback matters: the library exposes a reductionRatio check specifically so a short session isn't compacted down to something barely smaller than the original at the cost of an extra API round trip.

For anyone who wants the library without the Claude Code plugin wiring — for a custom harness, or Codex, which the repo also ships a parallel adapter for — compactMessages(transcript, options) takes a Claude Code-shaped session transcript directly and returns the pruned messages plus a stats object (message and character counts before/after, decision counts by reason, which fitting stage was needed).

Where this fits next to everything else you're already doing for context
fast-jev-compaction is one entry in a growing category of tools trying to solve the same underlying cost problem from different angles — pxpipe compresses large text dumps into image tiles before they hit context, Headroom targets agent context compression more generally, and Claude 5's own context-engineering guidance argues the better fix is often not over-stuffing context in the first place. None of these replace good context engineering discipline — they're compensating mechanisms for sessions that are already long by the time you reach for them, which is exactly the redeploy-with-many-moving-pieces scenario the original poster described (Oracle terminating a free VPS mid-task, with an orchestrator model running a coding-agent worker at max effort across the whole recovery).

Two practical caveats worth carrying into any decision to adopt this:

It adds a dependency on a third-party API mid-session. Several commenters raised TypeSafe AI's data-handling terms as a real, unresolved concern — sending your tool-call history, including file paths and command output, to an external service is a different trust boundary than keeping everything inside Claude Code and Anthropic's own infrastructure. Read the terms before pointing it at anything sensitive, the same diligence explainx.ai's guide to where Jev actually fails recommends for any Jev integration.
It's a probability, not a proof. The README says this directly: a high keep-probability from Jev is a calibrated signal, not a guarantee a dropped tool call was safe to remove. The agent can always re-run a tool if it turns out something it needed got pruned — which is a reasonable trade for most sessions, but not a substitute for pinning anything truly load-bearing into the messages the tool never touches.
Related reading
Learn Jev: self-paced Jev & TypeSafe AI course on Udemy, or the live Build with Jev workshop — full comparison.

TypeSafe AI launches Jev: a "System One Model" that never hallucinates

How to wire Jev into your agent pipeline for routing decisions

Where Jev actually fails: the specific complaints behind the hype

LLM context windows, explained

pxpipe: cutting Claude Code tokens with an image context proxy

Headroom: AI context compression for agents, a complete guide

Claude 5 context engineering: stop over-constraining the model

Context engineering vs. prompt engineering

Mechanism details above are drawn from the tamaratran/fast-jev-compaction README as published at the time of writing. Claims about Claude Code's own internal, unreleased compaction flags come from one Reddit user's reported binary inspection, not an Anthropic announcement, and may be inaccurate or already outdated by the time you read this.