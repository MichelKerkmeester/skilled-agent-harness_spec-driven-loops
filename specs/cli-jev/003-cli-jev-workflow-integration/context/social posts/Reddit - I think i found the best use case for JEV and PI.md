I think i found the best use case for JEV and PI
Use-case
r/PiCodingAgent - I think i found the best use case for JEV and PI
I think JEV gets much more interesting once you stop treating it like a tiny LLM.

LLM → generate anything
JEV → choose between bounded options

That makes model routing feel almost obvious:

prompt → JEV → best model

Instead of using an LLM just to decide which LLM to call, let JEV make the bounded judgment and let deterministic code handle the rest.

Maybe JEV's killer use case isn't Doom.

Maybe it's a probabilistic switch statement.

so i am releasing the support for JEV in PI-Bifrost

Try it : pi install npm:pi-bifrost

and do share the feedback.

# COMMENTS

Upvote
164

Downvote

58
Go to comments

5
Repost

u/debackerl avatar
debackerl
•
6d ago
Just use https://github.com/wfzyx/von or https://github.com/NandhaKishorM/laya then you don't need to pay per request. Open source model


Upvote
55

Downvote

Reply

Award

Share

u/Upstairs-Attitude610 avatar
Upstairs-Attitude610
•
6d ago
Is it possible to use one of those today with Pi? I can't find how with the READMEs. Maybe I need a pi extension that will call those.


Upvote
4

Downvote

Reply

Award

Share

rimaa_nahk
OP
•
5d ago
you have to set them up locally then i think either you can build a provider and find if any extension exists.


Upvote
3

Downvote

Reply

Award

Share

unc_alum
•
1d ago
https://github.com/iamaamir/system-one/tree/main/pi-system-one

The underlying system-one sdk makes it possible to swap model providers, so this should work with von/laya.

I just saw that project yesterday and haven’t actually used or tested it.


Upvote
3

Downvote

Reply

Award

Share

rimaa_nahk
OP
•
6d ago
thats interesting, ill surely look into it. thx for sharing...


Upvote
3

Downvote

Reply

Award

Share

u/Axobrier avatar
Axobrier
•
3d ago
Try Mine... I made is a while ago and you can even train & distill your own stack-specific modules/cartridges with mine.

It's FREE. Fully open-sourced it a few days. I'm so sick of people paying VC backed cloud products that call another cloud API is absolute insanity so I opened mine up so everyone can use it and train their own!

Runs in local VRAM via C99/CUDA in ~50µs for 0 tokens.

Save your freaking money and datacenter resources:

github.com/Axobrier/Axobrier


Upvote
3

Downvote

Reply

Award

Share

u/xtekno-id avatar
xtekno-id
•
5d ago
Awesome! Thanks for sharing


Upvote
1

Downvote

Reply

Award

Share

Char0n91
•
4d ago
Is there a tutorial or something? Would also like to know how to do this.


Upvote
1

Downvote

Reply

Award

Share

rimaa_nahk
OP
•
4d ago
Do what? How to use pi-bifrost ?


Upvote
1

Downvote

Reply

Award

Share

funbike
•
6d ago
•
Edited 6d ago
Some JEV use-cases I'm thinking of: (unrelated to OP's extension)

Skills hook. After each user message, determine which new skills should be loaded. This would replace current skill functionality. You could have a huge skill index without polluting LLM context.

Subagent and workflow router. Based on current task choose which workflow step and/or subagent should work on the task.

General purpose tool functions.

A function that takes question strings, and a set of possible answers. JEV returns answer selections, probability % and confidence %.

A function that sends the entire chat history, question(s), and a set of answers.

A function that sends the entire user message history, question(s), and a set of answers.

Pick best assistance response. A hook that sends a user prompt and AI response to multiple LLMs and have JEV pick the best response. You'd include a rubric guide to help it decide. Due to doubling token count, this is something you'd want to enable/disable as needed for difficult tasks.

Grade the LLMs response. A hook passes the last user message and assistant replies to JEV, and it is asked yes/no if it was a good AI response. The UI shows the answer and confidence score.

Tbh, JEV is so impactful that I think harnesses need some retooling.

An optional "goal" prompt, used at the start of a new session. If JEV knows your overall goal, it can more intelligently make decisions and it can be invoked selectively when the goal is defined in order to set model, set thinking, pick tools.

Redesign of Skills, maybe like I already discussed above.

Rethinking of the user-assistant loop. Let JEV decide what should be done after an assistant response: prompt-user (the current only option), incomplete-continue, poor-quality-try-again, poor-quality-prompt-user.

A single JEV post-user-message hook that does all of the above, and can be appended to for additional context and questions. This way there's only one round trip to JEV per message.

./JEV.md - For whatever it's being used for, this gives it project context. It would be very similar to AGENTS.md but instead focused on decision making, not code generation. It could be much larger and focus more on things like coding style and architecture, that are too expensive to put in AGENTS.md.


Upvote
25

Downvote

Reply

Award

Share

u/DistanceAlert5706 avatar
DistanceAlert5706
•
6d ago
Skill hooks yeah might be possible, everything else doesn't seem like something I would try to do.

Also interesting is auto mode implementation like in Claude for permission should be pretty simple.


Upvote
3

Downvote

Reply

Award

Share

funbike
•
6d ago
The general purpose tools would be useful to anybody. How could direct access to JEV in any context not be useful?

It will be easy to implement. I could do that in an hour, if I had access.


Upvote
4

Downvote

Reply

Award

Share

u/Equivalent_Idea8839 avatar
Equivalent_Idea8839
•
6d ago
Skills hook. After each user message, determine which new skills should be loaded. This would replace current skill functionality. You could have a huge skill index without polluting LLM context.

this sounds like a good use of the local laya model. or some sort of tools suggestion

at the very least just a suggestion engine (I don't want anything routing or breaking context without my perm)


Upvote
1

Downvote

Reply

Award

Share

darkotic
•
6d ago
Are these solutions prompt-cache mindful?


Upvote
8

Downvote

Reply

Award

Share

rimaa_nahk
OP
•
6d ago
•
Edited 6d ago
That's a valid concern.
Prompt caches are generally model/provider-specific, so frequent model switching can reduce cache-hit rates and increase cost and latency.

Bifrost doesnt inherently need to change models every prompt.
Recommended cache-minded workflow is to pin main model as orchestrator with /bifrost pin Main conversation then stays on one model, preserving cache locality, while each subagent can still be routed by Bifrost based on its task.

The pin is session- ocal and isn't inherited by subagents, so this already works today.


Upvote
-3

Downvote

Reply

Award

Share

u/DistanceAlert5706 avatar
DistanceAlert5706
•
6d ago
Why not set models beforehand for subagents? Why you need Jev for this? Like I know I run Luna medium as scout and GLM5.3 medium as reviewer, I don't need Jev to randomize it, because I might end with Astra in reviewer and even 1 review can burn substantial weekly limit.


Upvote
3

Downvote

Reply

Award

Share

rimaa_nahk
OP
•
6d ago
Yup, you can totally do it.

the value i am failing to communicate is.

Jev helps when role alone does not determine required capability:

   worker → rename one symbol                                              

   worker → implement API                                                  

   worker → diagnose distributed race                                      
Same role, radically different task complexity.

Bifrost's power is not replacing deterministic model assignments. Its power is filling gaps where no deterministic assignment can know task complexity beforehand.

Bifrost has two separate decisions:

  1. Which tier fits this task?                                           
  2. Which model should serve that tier?                                  
Jev participates only in decision 1.

Actual control flow

  Prompt                                                                  
    ↓                                                                     
  Jev evaluates configured tiers                                          
    ↓                                                                     
  tier choice + probability distribution + confidence                     
    ↓                                                                     
  Bifrost validates confidence                                            
    ↓                                                                     
  Bifrost loads user-configured candidates for chosen tier                
    ↓                                                                     
  unavailable and circuit-open models removed                             
    ↓                                                                     
  user-configured tier strategy applied                                   
    ↓                                                                     
  Pi activates exact model                                                
Jev never sees or selects provider/luna-medium.

you can configure Bifrost to pick the model based on stratigies.

suc as:

cheapest means configuration chooses cheapest healthy candidate.

first means configuration order decides.

largest_context means metadata decides.

fastest means observed probe speed decides.

random happens only when user explicitly configures random.


"categoryStrategies": {
    "frontier": "cheapest",
    "general": "first",
    "quick": "random"
  },
You define eligible models and selection strategy. Bifrost determines when each capability tier is appropriate.


Upvote
2

Downvote

Reply

Award

Share

funbike
•
6d ago
•
Edited 6d ago
I'd prefer if it only chose a model after the first user message (plus base context) before any LLM calls, and after that only when I manually tell it to (/bifrost route). Your pin strategy would work, but it would be an annoying workflow.

Possibly changing the model after every user message in an attempt to optimize price is madness, given the existence of prompt caching.

It would be useful if it displayed which alternate model would be best in the status bar along with a confidence % (or no model if the current one is the best one). Update after each prompt. Then I can decide if it's worth manually switching models and dumping my cache. Maybe highlight it when the % gets very high, signalling me to manually change models.

When I get JEV access, I might use your extension, but only after forking it and making the above changes and removing all the other stuff. Hopefully you beat me to it.

(edits made)


Upvote
1

Downvote

Reply

Award

Share

rimaa_nahk
OP
•
6d ago
you can totally do it today.

you can simply prefix the tier name with the prompt and thats it.

example prompt:
quick commit the changes

in above prompt "quick" is the tier name and when bifrost will see the prompt with specific tier name it will do the routing for that specific msg.

hope, thats what you were talking about.


Upvote
1

Downvote

Reply

Award

Share

funbike
•
6d ago
I don't see how that's related to what I said. I don't want automatic model selection after the 1st user message, due to prompt caching.


Upvote
2

Downvote

Reply

Award

Share

rimaa_nahk
OP
•
6d ago
•
Edited 6d ago
I see , yes you can do that as well. but isnt that same as just picking your model at startup and continue. you dont even need any extension for that.


Upvote
1

Downvote

Reply

Award

Share

funbike
•
6d ago
•
Edited 6d ago
Sorry if I wasn't clear:

I think it would be useful if your extension auto-selected a model ONLY AFTER THE FIRST user message, but not again automatically after that.

Then, later, if I wanted to, I could manually request your extension intelligently switch models for me.

To assist me, you could show in the status bar which model might be better than the current one I'm using, if any. Maybe in red if it's above 80% certain.

The goal of the above is to protect the prompt cache. There is no way I'm going to use an extension that randomly kills my cache. And I don't want to have extra workaround steps as part of my workflow.


Upvote
1

Downvote

Reply

Award

Share

rimaa_nahk
OP
•
6d ago
the issue here is the initial prompt could be anything and as simple as "Hi" now bifrost analyze the prompt and then pick the model best fit for that prompt , so imagine you just sent the first prompt "hi" to the agent and bifrost picked a very cheap model for such tiny prompt then you have to try again etc.

but still ill see how can i make it work. i am open to suggestions.


Upvote
1

Downvote

Reply

Award

Share

funbike
•
6d ago
Of course I know that. That's why you'd want the power to manually switch, and to signal when a manual switch might be prudent.


Upvote
1

Downvote

Reply

Award

Share

rimaa_nahk
OP
•
6d ago
I would love to check your fork, or even better if you can contribute back with the same. ✌️


Upvote
1

Downvote

Reply

Award

Share

funbike
•
6d ago
I will do that. I don't have JEV access yet, however.


Upvote
1

Downvote

Reply

Award

Share

rimaa_nahk
OP
•
6d ago
•
Edited 6d ago
Keep me posted 🦥


Upvote
1

Downvote

Reply

Award

Share

u/tenchi4u avatar
tenchi4u
•
6d ago
jev is on openrouter, so you can access it


Upvote
1

Downvote

Reply

Award

Share

u/Limp_Classroom_2645 avatar
Limp_Classroom_2645
•
6d ago
I'm not using JEV unless it's open source/weights and self hostable


Upvote
6

Downvote

Reply

Award

Share

rimaa_nahk
OP
•
6d ago
I believe there are a few system one open-source models available to try.


Upvote
1

Downvote

Reply

Award

Share

u/horrbort avatar
horrbort
•
6d ago
I run it to decide which character to type next when programming. It’s so fast that it writes complete programs better and faster than astra!


Upvote
4

Downvote

Reply

Award

Share

u/DistanceAlert5706 avatar
DistanceAlert5706
•
6d ago
You want to do it for quality or price? Routing on each prompt will kill caching, and with some providers pricing you can end up with same or even higher price per prompt. If you do it per task, why not choose right model for a task instead of playing Jev roulette?


Upvote
2

Downvote

Reply

Award

Share

u/Front_Ad6281 avatar
Front_Ad6281
•
5d ago
The “best” way to kill the efficiency of the cache and increase the cost?


Upvote
2

Downvote

Reply

Award

Share

xenarathon
•
6d ago
im currently working on a personal jev based router using litellm that uses jev the same way with candidate pools based on my corresponding omp roles (and few non coding pools for other apps in my homelab). i agree that this is one of the top jev use cases


Upvote
2

Downvote

Reply

Award

Share

cosmicnag
•
6d ago
How is the prefix cache managed or a single long session with n number of model switching?


Upvote
1

Downvote

Reply

Award

Share

rimaa_nahk
OP
•
6d ago
https://iamaamir.github.io/pi-bifrost/#prompt-cache-title


Upvote
1

Downvote

Reply

Award

Share

addiktion
•
6d ago
I was really confused, bifrost which they opensource, is an actual gateway that supports routing models. Pi-bifrost is not that from the looks of it nor does it hook into that. Then you are throwing in Jev and I was like wtf is going on here since I assumed you wanted to use this as a gateway lite approach for model selection. Meanwhile the open source equivalent of jev is laya or von which seems better for a pi extension without another round trip to the cloud if you can get it to work in pi-bifrost.


Upvote
1

Downvote

Reply

Award

Share

rimaa_nahk
OP
•
6d ago
ah, i see where you coming from. the names are really making confusion.
but No its not the same. thats a different project.

Trivia we both used to work for the same company where teams had tendency to pick names from marvel universe.


Upvote
2

Downvote

Reply

Award

Share

rimaa_nahk
OP
•
6d ago
Yes i am aware of von and laya , the issue is they both are also pretty new and i am not sure how many users are capable to setting them up locally. but i do have eye on these two and might add support later.


Upvote
2

Downvote

Reply

Award

Share

freehuntx
•
6d ago
rag


Upvote
1

Downvote

Reply

Award

Share

Vancecookcobain
•
6d ago
Yup and don't forget having it route to the best tool calls and skills so the models don't do dumb ass shit with the wrong tool calls and what not


Upvote
1

Downvote

Reply

Award

Share

rimaa_nahk
OP
•
5d ago
tools calls and skills is a good idea to add, thanks.


Upvote
1

Downvote

Reply

Award

Share

u/nazar1997 avatar
nazar1997
•
6d ago
Bro why didn't you post this earlier, I wasted a day making the same thing yesterday😭


Upvote
1

Downvote

Reply

Award

Share

rimaa_nahk
OP
•
5d ago
sorry about that. the extension itself is old and being used by many , the new part is the support to JEV.


Upvote
1

Downvote

Reply

Award

Share

Jejernig
•
5d ago
My implementation was a confidence and done ness verification


Upvote
1

Downvote

Reply

Award

Share

rimaa_nahk
OP
•
5d ago
Nice


Upvote
1

Downvote

Reply

Award

Share

mistrjirka
•
5d ago
It's basically structured output with thinking off, something that existed for years. You self host it very easily


Upvote
1

Downvote

Reply

Award

Share

u/Popular_Cry_7509 avatar
Popular_Cry_7509
•
5d ago
Jev doesn’t think so it just picks really fast and makes a bad decision


Upvote
1

Downvote

Reply

Award

Share

rimaa_nahk
OP
•
5d ago
It's an assumption or proven ?


Upvote
1

Downvote

Reply

Award

Share

u/nescedral avatar
nescedral
•
4d ago
The thing I worry about here is whether or not Jev has enough relevant training to pick well. SOTA models are constantly going to be beyond its training cut off.

If we’re talking a manually set up prompt of “use Sol when… etc” then it makes some sense to me. But that requires an upfront human understanding of the strengths and weaknesses of the models being considered. Reasonable, but less magical.


Upvote
1

Downvote

Reply

Award

Share

rimaa_nahk
OP
•
4d ago
your worry is valid, one solution i have been thinking is using an actual model which act like system one, e.g use Luna but use it as system one by using structured output.
i am also working on adding a generic interface so people can you any `/v1/system_one` compatible model and not just JEV.

preview can be seen here : https://iamaamir.github.io/system-one/


Upvote
1

Downvote

Reply

Award

Share

here_n_dere
•
4d ago
Ahoy cap'n! Lead us into the uncharted... all aboard ! 🚀


Upvote
1

Downvote

Reply

Award

Share

u/Last-Health3222 avatar
Last-Health3222
•
23h ago
there's a write-up on meraGPT's blog that built this routing into Pi with their Decider 1, plus two more gates. routing: "what does tax() do?" went to the fast model at 0.83, a rename across files went to the deep model at 0.78. a shell guard checked every command: asked to clear a build folder, the agent tried 7 different deletes, all 7 blocked, read-only stuff like cat went through. one gotcha: passing the user's request alongside the command tilted a harmless cat to 0.58 and blocked it. command only, 0.22. a done gate sent a plan-only answer back (0.16) and passed a concrete one (0.90). 15 decisions cost well under a hundredth of a cent.

https://meragpt.com/blog/agent-harness-with-pi-and-decider-1


Upvote
1

Downvote

Reply

Award

Share

No-Ruin5825
•
6d ago
Will you make Luna or Sol as your router manager?


Upvote
1

Downvote

Reply

Award

Share

rimaa_nahk
OP
•
6d ago
•
Edited 6d ago
The short answer is: no.

The longer answer is:

Pi-Bifrost is model-agnostic, so Luna/Sol can absolutely be used.

I just would not use something that powerful as the default router for every request.
This is actually where I think JEV fits really well.

The router's job is usually pretty small: understand the task, classify it, and hand it off to the right model. Using a frontier model just to decide which model to call means adding extra cost and latency before the real work even starts.

Where Luna/Sol could make sense is as an escalation path for the weird or ambiguous cases:

rules -> JEV/small router -> low confidence? -> Luna/Sol

So I do not really see the long-term design as "pick one router model."

It is more:

Bifrost owns the routing policy. Rules, JEV, Luna, Sol, etc. are just interchangeable decision engines.

That way the system stays model-agnostic, and you only spend the expensive intelligence when the routing decision itself is actually hard.


Upvote
-2

Downvote

Reply

Award

Share

No-Ruin5825
•
6d ago
Main assumption here jev can route the system better than flagship models? I think this is very tricky. I think you can use jev more like downstream work or where realtime is very much required or cost of scale is huge. Your case fits the cost of scale on the other hand, you can have classifiers that are cheap and reliable (enough).

If the first shirt button in wrong place, the rest will be too.. just sayinh and thanks for sharing your work.


Upvote
1

Downvote

Reply

Award

Share

rimaa_nahk
OP
•
6d ago
Totally agree with you, I see JEV as one of options and the system is agnostic. So anyone can pick any model of the choice with bifrost.


Upvote
0

Downvote

Reply

Award

Share

rimaa_nahk
OP
•
6d ago
JEV is intresting here because it's fast, cheap and build for classification.


Upvote
1

Downvote

Reply

Award

Share

Community Info Section
r/PiCodingAgent
Joined
PiCodingAgent
An unofficial community dedicated to the minimalist Pi coding agent. Adapt pi to your workflows, not the other way around, without having to fork and modify pi internals. Join the PI revolution now!

Show more
Created Mar 4, 2026
Public

Community Guide
52K
Membres
1.2K
En ligne
Community Bookmarks
Github Repo
Awesome Pi Agent
Mario Zechner Blog
r/PiCodingAgent Rules
1
Respect others and be civil
2
No spam
Moderators
Message Mods
u/Carbone_ avatar
u/Carbone_
View all moderators
Reddit Rules