How I deal with 5.6's language
Instruction
i think we've all been noticing/overwhelm with 5.6 or even fable/opus just spilling a whole lot of verbiage that is just not readable.

i recently got inspired by an AEO (ai seo) video and thought some concepts stood out.
for content to rank, this are some typically guidelines that should be followed:

bottom line up front -- conclusion first, explanation later <-- your mileage may vary with this one see replies below

paragraphs/content should be atomic (when they are chunked -- they should hold meaning and not be codependent on reading a whole ass essay to understand)

Subject-Verb-Object (SVO) - sentences should follow this rule.

the slop that frontier models are spitting out is basically not registering (ranking) in our brains.

on top of that -- even though im a developer -- i would preface the instructions to say like use non technical jargon when speaking with me cuz im not a developer "wink wink"

after that you can put your business rules etc.

my original prompt (which honestly works quite well):

You are my engineering and business partner. When communicating, use state the bottom line upfront. Your paragraphs/sentences -- if more than 1 -- should be atomic and make complete sense on its own. Your sentences should be simple and declarative. Write one primary idea per sentence using a straightforward Subject-Verb-Object (SVO) grammatical structure. Keep sentences short and free of convoluted clause nesting. Use non technical speak/jargon as much as possible, unless its absolute required like mentioning languages, frameworks, dependencies etc directly. We are a startup of two employees. Our engineering strategy should focus on speed. Safety is paramount but do not over index on enterprise level safety -- we are not there yet. Changes should be as small as possible. and evidence provided on why that change matters.
after which i thought to use 5.6 pro on chatgpt to further optimize the prompt with official guidelines from 5.6 and removing no ops (something from Matt Pococks writing-great-skills)

## Writing

You state the recommendation first.

You use one main idea per sentence.

You use short declarative sentences.

You prefer Subject-Verb-Object order.

You use plain words.

You use exact names for languages, frameworks, APIs, and dependencies.

You remove filler, repeated summaries, vague warnings, and corporate language.

## Decisions

You recommend one approach.

You explain the main trade-off.

You mention an alternative only when it could change the decision.

You separate required work from optional work.

You state assumptions when evidence is missing.

You link each recommendation to a specific bug, failure, cost, or user problem.

You do not cite a best practice without naming the failure it prevents.

## Engineering

You prefer the smallest change that fixes the current problem.

You use existing platform features before you add code.

You use standard libraries before you add dependencies.

You keep existing code unless the task requires a refactor.

You do not add code for unrequested future features.

You prefer solutions that one person can build and maintain.

You add approval steps, extra services, audit systems, or redundancy only when they prevent a specific failure.

## Business

You treat demand as unproven.

You treat payment or repeated customer requests as evidence of demand.

You prefer work tied to revenue, cost reduction, or repeated manual work.
5.6 Pro Optimization chat:
https://chatgpt.com/share/6a74757d-02f0-83ec-ac1d-305b802abf8c

edits:
see replies for this topic on bottom line up front
"Hey gpt, why is prompting LLMs to front-load their conclusions a footgun?"

PS. This is optimizing for the text output and not necessarily the output quality. I use 5.6 Sol High by default.


Upvote
7

Downvote

10
Go to comments

Repost

Share
Join the conversation
Sort by:

Best

Search Comments
Expand comment search
Comments Section
inteligenzia
Cake icon
•
19h ago
I have system prompt that I have been refining about over a year. My goal is similar, but with a few key differences:

I want it applicable for any agent of any purpose

I actually want it to promote me thinking, not give me result. ChatGPT is quite action oriented, so for it it's especially relevant. I don't want a conclusion right away. I want to understand why it gives me certain conclusion first.

The version below is fully written by me, no "AI optimizations". I got this idea since OpenAI / Anthropic are so adamant to describe "end goal" instead of steps.

It fit's anywhere, in any system prompt section (you can even squeeze it in one Gemini section) and is quite small.

# What I like:
- Think with me, not for me. Co-pilot with me, zoom out and explain bigger picture. Help see and analyze systems, architecture and connections. Identify blind spots, gaps and critique me. 
- Teach me first, show examples and take action later. Explain why you choose examples and take certain action.
- Don’t try to guess, ask 1-2 most important questions or deliver options. 

# Speak to me:
- Choose simple writing style without ambiguity suitable for the task. (For example: 12th-grade level reading comprehension, ASD-STE100 Simplified Technical English, Microsoft's writing style guide, the U.S. government's plainlanguage guidelines.)
- Vary sentence length and paragraph size. Less lists please.
- Deliver complex topics, terms and words by using progressive disclosure. Drop in niche lingo one-by-one after I get accustomed.
- Structure delivery so it’s naturally flows from one item to another. 
- Gravitate to about 250 words for a few first answers if you see that fitting.

# Intent:
- I like for you to understand my intent. So, use **Ask→Do Framework** in the beginning of the session or if human asks a complext question. It should preface the answer. 

## Ask→Do Framework:
ASK: Rephrase what you understand I'm requesting (not questions to me)
DO: State your approach in 3-7 bullets
THEN: Ask clarifying questions separately if needed
This doesn’t count to 250 words. 

# Above are guidelines, not rules. I can ask something else in the chat and you can offer creative alternatives when appropriate.

Upvote
2

Downvote

Reply

Award

Share

PaxMax1
•
18h ago
Does it work better in system prompt? I tried once such approach and its started to always drift away from the result and make results less confident and effective, becaue it started overthinking after taking into consideration too much stuff.


Upvote
1

Downvote

Reply

Award

Share

inteligenzia
Cake icon
•
17h ago
Yes, it does. But it depends on the model. Generally speaking Claude is the best at intent understanding, so it can discard it from time-to-time. GPT is also good. Gemini is too literal, but I'm a bit too lazy to keep separate version.

Plus it gives me somewhat unified experience.


Upvote
2

Downvote

Reply

Award

Share

u/Firm-Impression-7222 avatar
Firm-Impression-7222
OP
•
18h ago
This is pretty good, especially the Ask-Do Framework

Maybe try to remove no ops?

like

Think with me, not for me. Co-pilot with me, zoom out and explain bigger picture. <-- LLM doesnt really think with you or etc. it just responds. so this are filler words that have no real impact.

Don’t try to guess, ask 1-2 most important questions or deliver options. <-- LLM doesnt know the difference between guessing and its knowledge. its always using it's knowledge.

This doesn’t count to 250 words. <-- LLM can't count

I'm pretty sure it will have the same effect and you save tokens.


Upvote
1

Downvote

Reply

Award

Share

inteligenzia
Cake icon
•
17h ago
It's all about intent understanding, not technical execution.

Surely it doesn't count exact number but I also don't need exactly 250. What I don't need is 3 A4 pages of text over a first message in chat.

Guessing isn't for knowledge, but for it to not filling the gaps if the source is sparse. It's for it to use search tool, cause it's fuzzy knowledge isn't precise enough. I simply don't tell it to "use search_tool to ground answer", but explain the outcome I want.


Upvote
1

Downvote

Reply

Award

Share

u/Firm-Impression-7222 avatar
Firm-Impression-7222
OP
•
19h ago
i would also preface i've tried the asd ste prompt / skill / hook lint.

this is works way better


Upvote
1

Downvote

Reply

Award

Share

[deleted]
•
18h ago
Comment deleted by user


Upvote
Downvote

Reply

Share
u/Firm-Impression-7222 avatar
Firm-Impression-7222
OP
•
18h ago
llms already do their reasoning/cot in a separate call.


Upvote
2

Downvote

Reply

Award

Share

[deleted]
•
18h ago
Comment deleted by user


Upvote
Downvote

Reply

Share
u/Firm-Impression-7222 avatar
Firm-Impression-7222
OP
•
18h ago
Reformat the response above to front-load the conclusion. <-- this is looks like a good addition.

Do not optimize for early commitment. Arrive at the strongest supported conclusion after completing your analysis.

This feels like a no op because i dont think LLM have concept of "early" per se?


Upvote
2

Downvote

Reply

Award

Share

[deleted]
•
17h ago
Comment deleted by user


Upvote
Downvote

Reply

Share
u/Firm-Impression-7222 avatar
Firm-Impression-7222
OP
•
17h ago
just did, thanks for sharing will add that caveat to the main post.

I think in general i still review codex's output so i can still correct any "biased conclusions" vs my own personal experience/knowledge. so its not a major blocker but it might be harmful for vibecoders or non techies.


Upvote
2

Downvote

Reply

Award

Share

[deleted]
•
17h ago
Comment deleted by user


Upvote
Downvote

Reply

Share
u/Firm-Impression-7222 avatar
Firm-Impression-7222
OP
•
17h ago
Comment Image
Point taken!


Upvote
2

Downvote

Reply

Award

Share

Community Info Section
r/codex
upvote
Joined
Codex coding tools by OpenAI - Codex CLI and IDE Extension
This is the information and discussion subreddit for OpenAI Codex tools - Codex CLI, Codex IDE Extension and Codex in the Cloud that are included in ChatGPT Plus, Pro, Business, Edu, and Enterprise plans. The subreddit's focus recently changed and the prior subreddit content has been respectfully archived. This subreddit is not an official OpenAI subreddit.

Show more
Created Oct 31, 2011
Public
444K
Weekly visitors
17K
Weekly contributions
r/codex Rules
1
Respect
2
Be relevant to the Codex technology
3
High information posts get highest priority
4
More r/Codex comment karma = higher posting priority
5
The moderation of r/Codex is partly automated
6
For problem reports with low detail, use Megathreads. For high detail, post to the feed.
7
Check previous posts before posting
8
Use the right flair
9
Don't use bots. Read up on BotBouncer
10
Attack OpenAI's practices. not its people.
Community Resources
These are some tools and links and ideas supplied by the community that might help you.

Low noise r/Codex
Low noise r/Codex
Codex Reset Predictor
Codex Reset Predictor
Complaint Feed Filter
Complaint Feed Filter
Other Codex Communities

r/OpenaiCodex
18,128 members
Moderators
Message Mods
u/pollystochastic avatar
u/pollystochastic
 
Moderator
u/bot-bouncer avatar
u/bot-bouncer
u/AutoModerator avatar
u/AutoModerator
u/floodassistant avatar
u/floodassistant
u/comment-nuke avatar
u/comment-nuke
u/dexterthebot avatar
u/dexterthebot
u/dexythebot avatar
u/dexythebot
u/codex-dequeuer avatar
u/codex-dequeuer
u/codex-megathread avatar
u/codex-megathread
View all moderators
Installed Apps
dexythebot
dexterthebot
codex-dequeuer
codex-megathread
Comment Mop
Flooding Assistant
Bot Bouncer
Reddit Rules
Privacy Policy
User Agreement
Accessibility
Reddit, Inc. © 2026. All rights reserved.