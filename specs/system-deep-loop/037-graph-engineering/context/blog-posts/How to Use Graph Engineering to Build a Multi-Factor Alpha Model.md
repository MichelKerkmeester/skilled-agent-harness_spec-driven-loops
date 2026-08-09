Source: https://x.com/RohOnChain/status/2080296261576687751?s=46

I am going to break down exactly how to build a hedge fund grade multi-factor alpha model using graph engineering.

Let's get straight to it.

Bookmark This -  
I'm Roan, a backend developer working on system design, HFT-style execution, and quantitative trading systems. My work focuses on how prediction markets actually behave under load. For any suggestions, thoughtful collaborations, partnerships DMs are open.
In my last article I said I would personally walk through the first 20 setups of anyone building an AI quant system and I meant it.

Few builders are already deep in the process with me. The offer is still open.

If you are building a graph engineering system or about to start, or even just thinking about it, reply under this article or DM me your current setup. I will personally walk through your architecture and show you the gap between what you have and a swarm that hunts alpha on its own. 

If I do not reply, you were not in the first 20. Move fast.

Multi-factor investing is how every serious hedge fund on Wall Street generates returns. They do not trade single ideas. They stack factors.

This is the same process AQR runs. The same process Two Sigma runs. The same process Bridgewater runs. And it is the first time it has been executable by a solo builder.

The problem has always been that building this required a research team. Factor engineers. Statisticians. Portfolio construction specialists. Risk analysts. Execution engineers. You need at least ten people per factor family, and no solo quant can build that team.

That is why retail quants stick to single strategies and hedge funds print alpha.

Until now.

https://x.com/i/web/status/2074134246784921977
In my last two articles I walked through loop engineering and how to build a swarm of AI agents that hunts alpha 24/7. 

Once you have loops and swarms, the layer that holds them together as one working system is a graph.

Graph engineering is the practice of designing that layer. You define the nodes. You define the edges. The graph runs itself.
By the end of this article you will not just understand graph engineering. 

You will have a self-running multi-factor alpha model firing every 24 hours on your laptop.

Part 1: What Graph Engineering Actually Is
Every quant working with AI is somewhere on the same progression. Naming where you are makes it obvious where to go next.


What Graph Engineering Actually Is
Stage 1: Prompts. You type a prompt. You wait. You read the output. You type the next one. You are the loop. Nothing survives when you close the laptop.
Stage 2: Loops. You write a script that wraps the prompt and fires on a schedule. The loop holds state. It survives after you close the laptop. This is what my loop engineering article taught. One agent, one job, running forever.
Stage 3: Swarms. You fan the loop out into many agents with specialized roles. One generates signals. One validates them. One executes. This is what the swarm of AI agents article taught. Multiple agents in parallel, coordinated by hand through Python glue code.
Stage 4: Graphs. You describe the coordination structure once. Nodes are agents. Edges are data hand-offs. The graph knows when to parallel, when to wait, when to retry, when to escalate. You do not touch the glue code again.
Graph engineering is the practice of designing that coordination structure.

A graph is not a script. That distinction matters more than anyone tells you.

A script breaks the moment one agent needs to wait on another. A script breaks the moment state has to persist across cycles. A script breaks the moment you want six loops in parallel on different models. Every retail quant who has tried to build a multi-agent system has hit these three walls.

The failure wall broke me. When my profitability agent got blocked because it had to parse 500 balance sheets and hit rate limits, the entire pipeline died. 

I would come back the next morning to a stopped process, no signal, and no idea where the failure originated. Debugging meant reading a stack trace and guessing which agent was upstream of the crash.

By month two I had spent more time debugging coordination than doing research. I was on the verge of shelving the whole project.

That is the failure state every multi-agent quant hits. It is also the reason graphs exist.

A graph does not have those failure modes. Parallel is native. State is persistent. Failure is scoped to the node, not the pipeline. When a node breaks, the rest of the graph keeps running, and you patch the broken node by describing the failure in plain English.
That is the promise of graph engineering. Now the question is what runs the graph.

Part 2: The Tool That Runs The Graph
Graphs are architectural diagrams. They do not run themselves. They need a runtime.

The runtime is what most people building multi agent systems get wrong.

They assume the hard part is designing the graph. It is not. The hard part is finding infrastructure that can actually execute it.

I spent weeks trying different runtimes before I found one that could run a multi factor graph end to end.


The one I use is called Slate. Built by @wearerandomlabs. Runs in your terminal. Picks up your existing model subscriptions and fans out work across them.

What matters for this article is a capability they shipped recently called Programs. A Program is a graph written in JavaScript that Slate runs for you continuously.

A prompt runs once and stops. A Program keeps going until the task is done.

You do not write the Program alone. You tell Slate what you want in plain English. Slate drafts the graph.

Slate then presents you a diagram. You ask questions about the diagram. You change nodes. You adjust models. Only when you are satisfied do you tell Slate to save and run it.

If it breaks, you chat with Slate about the failure. Slate patches the graph.

You can find Slate at http://randomlabs.ai/rr. It is available today.

The best way to feel graph engineering before you build one is to run the two example Programs that ship with Slate.

They are called /goal and /deepresearch.
/goal - Graphs That Run Until Verifiably Done

Type this inside Slate:

plaintext
/goal implement a Newey-West adjusted t-statistic function in Python and verify it matches the statsmodels implementation on ten random return series
Slate does not fire one prompt at a model. It spins up a graph.


One node writes the function. 
Another writes the verification test. 
A third runs both. 
A fourth grades whether the outputs match.
If they do not match, the graph loops back with the specific mismatch as feedback. It keeps going until a separate small grader model confirms the goal is done.

This is the maker checker pattern in a runtime. The maker never grades the maker's own work.

/deepresearch - Graphs That Parallelize Research

Try this inside Slate:

plaintext
/deepresearch what does the latest academic research say about the Fama-French five factor model out of sample performance in emerging markets from 2015 to 2026
The graph that spins up here is different from /goal.


It is a parallel research fanout.

Slate dispatches multiple worker agents at once. Each one owns a different angle of the question.

One reads recent papers. Another checks arXiv q fin. Another pulls data from the Kenneth French library. Another cross references citations.

They all report back to a central orchestrator that synthesizes the findings.

The reason /deepresearch matters for this build is that it demonstrates the exact pattern you need for factor construction.

Seven factor agents. Each owns a different factor. All running in parallel. All reporting to a central orchestrator.

That is the multi factor graph, minus the quant specific tasks.

Spend 30 minutes running /goal and /deepresearch on questions you actually care about. That is how graph engineering intuition happens.


Part 3: The Multi-Factor Alpha Graph
Multi factor investing decomposes stock returns into systematic drivers plus a residual. The foundational version is the Fama French three factor model, published in 1993:


R_i is the return on stock i. R_f is the risk free rate. R_m is the market return. SMB is size premium. HML is value premium.

The alpha α is what the model cannot explain. That residual is what you are hunting.

Carhart added momentum in 1997. Fama and French added profitability (RMW) and investment (CMA) in 2015.

Modern hedge funds run a seven factor stack. AQR, Two Sigma, Millennium, Bridgewater all run variants. Here are the seven factors that matter in 2026.


Factor 1: Market Beta. 
Rolling 60 month regression of stock excess return against market excess return.

Factor 2: Size (SMB). 
Small cap outperforms large cap on a risk adjusted basis.

Factor 3: Value (HML). 
High book to market outperforms low book to market over long horizons.

Factor 4: Momentum (MOM). 
Recent 12 month winners keep winning for 3 to 12 months.

Factor 5: Profitability (RMW). 
Robust operators outperform weak operators.

Factor 6: Investment (CMA). 
Conservative asset growth outperforms aggressive expansion.

Factor 7: Low Volatility. 
Low vol stocks earn higher risk adjusted returns than theory predicts.

Every fund runs a version of this. Solo builders cannot because it needs a research team.

Graph engineering solves that. Each factor becomes a node.
Here is the full graph. Eleven nodes total.

Factor Construction Nodes (run in parallel)

Node 1: Market Beta Agent. 
Runs the rolling 60 month regression. Outputs a beta for every stock.
Node 2: Size Agent. 
Sorts by market cap. Computes the small big spread.
Node 3: Value Agent. 
Sorts by book to market. Computes the high low spread.
Node 4: Momentum Agent. 
Computes 12 minus 1 month momentum. Constructs MOM from the decile spread.
Node 5: Profitability Agent. 
Computes gross profitability. Constructs RMW.
Node 6: Investment Agent. 
Computes annual asset growth. Constructs CMA.
Node 7: Low Vol Agent. 
Computes trailing 60 day realized volatility. Constructs low vol from the decile spread.
Coordination Nodes (run in sequence)

Node 8: The Validator. 
Runs Newey West adjusted t statistics on each factor. Bootstrap resamples 10,000 iterations. Kills any factor with in sample versus out of sample degradation above 30 percent.
Runs on a stronger reasoning model. The maker never validates the maker's own work.

Node 9: The Regime Auditor. 
Segments the 20 year history into three regimes using a Hidden Markov Model on volatility and returns. Kills anything that only works in one regime.
Node 10: The Portfolio Constructor. 
Combines surviving factors into a long short portfolio using risk parity weights. Enforces sector, beta, and dollar neutrality.
Node 11: The Risk Decomposer. 
Regresses the portfolio against the seven factors plus style and macro factors. Reports residual alpha and t statistic.
Only signals where the residual alpha survives factor decomposition are genuine new alpha. Everything else is repackaged style with extra steps.

Eleven nodes. Each owns one job. They pass their outputs down the graph.

The whole model runs on a single Slate Program that fires every 24 hours.

Part 4: How To Build It Step By Step
Here is the exact build. Follow along in your terminal.

Step 1: Install Slate
Open your terminal and run:

bash
npm i -g @randomlabs/slate
Slate is a global npm package. Install takes about 30 seconds.

Verify with:

bash
slate --version

Step 2: Create Your Project Directory
Multi factor research needs its own workspace. State files, historical factor tests, portfolio snapshots all live here.

bash
mkdir ~/projects/multifactor-alpha
cd ~/projects/multifactor-alpha
Do not run other Slate projects out of the same folder. State namespacing is per workspace.

Step 3: Launch Slate
Type:

bash
slate

Step 4: Connect Your Providers
Inside Slate, type:

bash
/providers
This opens the provider configuration screen. Random Labs authenticates by default. You can also connect OpenAI Codex and GitHub Copilot directly.


Navigate to Codex with the arrow keys and hit enter to authenticate. Your existing subscription works.

Step 5: Connect Your Models
Inside Slate, type:

bash
/models
You see every model available across every provider connected. Random Labs hosts about 90 models.

You want two model tiers.

A fast tier for the seven factor construction agents. Claude Sonnet works.

A stronger reasoning tier for the validator, regime auditor, and risk decomposer. Claude Opus works.

Step 6: Warm Up With /goal And /deepresearch
Before you draft your own Program, spend 30 minutes with the two shipped example Programs.

This is how graph engineering stops being a concept and starts being intuition.

Try this /goal command inside Slate:

plaintext
/goal write a Python function that computes Fama-MacBeth cross sectional regression coefficients and verify it matches the empiricalfin package on 20 years of monthly return data
Watch how the graph fans out. Watch the grader model check the work of the writer model. Watch what happens when the first attempt fails.

Then try this /deepresearch command:

plaintext
/deepresearch what does the academic literature say about the profitability factor RMW versus the quality factor as defined by MSCI and how do they differ empirically from 2015 to 2026
Watch the parallel worker fanout. Watch the orchestrator synthesize.

These two runs give you the mental model you need before you write your own Program.

Step 7: Draft The Multi Factor Program
This is the most important step. You describe the graph in plain English and Slate drafts it with you.

Type this exact prompt into Slate:

plaintext
draft me a program that runs seven multi-factor research agents in parallel:
market beta, size, value, momentum, profitability, investment, and low-volatility.
After all seven complete, run a validator, a regime auditor, a portfolio
constructor, and a risk decomposer in sequence. Use Claude Sonnet for the seven
factor agents and Claude Opus for validator, regime auditor, and risk decomposer.
Run the whole pipeline every 24 hours. Use file system as memory. Set a budget
of $30 per run. Enforce Newey-West t-stat above 2.5, bootstrap 10,000 iterations,
and reject any factor with in-sample versus out-of-sample Sharpe degradation
above 30 percent.
Slate does not just start writing code. It reads carefully and asks clarifying questions.


Which data source. What backtest window. Which universe. What regime classifier. Whether to use overridable defaults.

You answer in plain English. Slate writes the JavaScript.

Step 8: Review The Graph Diagram
Once Slate has drafted the Program, it renders a diagram of the graph.

You are not reading code to understand what will run. You are looking at the coordination structure.

Seven factor nodes running in parallel from the orchestrator. A sync point. Four coordination nodes in sequence. A persistence step. A sleep node. A loop back to the top.

Ask Slate questions about the diagram before you run anything:

Why is the validator running on Opus?
What happens if the momentum agent times out?
What state gets persisted between cycles?
What triggers the regime auditor to reject a factor?
If any answer surprises you, ask Slate to change the graph.

Step 9: Save And Run
Once the diagram matches what you want, tell Slate to commit the Program to a file. Then run:

bash
slate run multifactor-alpha.js
The moment you hit enter, Slate spins up the graph. The seven factor agents fire in parallel.

Feature engineering runs in parallel. Validation runs on the stronger model.

The first run takes 15 to 25 minutes. Subsequent daily runs are faster because the state file already holds history.

Step 10: Set A Budget
Inside Slate, type:

plaintext
/budget $30/run

This caps total spend per run. If a run approaches the cap, Slate escalates before continuing.

Step 11: Debug When It Breaks
Real Programs break. Mine broke three times in the first two weeks.

The value agent got blocked because it could not interpret non US balance sheets. I told Slate. Slate patched the value agent to include a currency normalization step.

The momentum agent occasionally returned zero surviving signals in momentum hostile regimes. I told Slate. Slate added a fallback that widens the momentum lookback window during those regimes.

The portfolio constructor sometimes violated sector neutrality. I told Slate. Slate added a projection step to enforce neutrality before writing the portfolio.

You do not chase a stack trace. You describe the problem to Slate. Slate patches the node.

Part 5: What Actually Happened When I Ran It
Here is the part I did not expect.

I described the graph to Slate in one paragraph. Slate checked the available model identifiers first, activated the models skill, and picked claude-sonnet-4.6 for the fast agents and claude-opus-4.5 for the coordination stages.

Then Slate drafted the entire Program in one pass. Not a rough draft. The full JavaScript. Eleven nodes wired together. Parallel factor construction. Sequential validation. Filesystem shared memory with timestamped run directories. Budget allocations. The whole thing.


Slate did not just write code and disappear. It came back with three specific decisions it wanted me to confirm before we ran it.


Decision 1: Portfolio constructor model. My draft prompt specified Opus for validator, regime auditor, and risk decomposer, but I did not name a model for the portfolio constructor. Slate defaulted it to Opus because the stage is heavy analytical work, but flagged it as a flip if I wanted Sonnet.

Decision 2: Model versions. Slate used the current stable Sonnet and Opus (4.6 and 4.5) and offered to bump to newer versions if I preferred.

Decision 3: Budget enforcement. This one surprised me. Slate explicitly told me that the $30 per run cap was advisory, not a hard kill switch. There is no real time cost metering primitive, so the budget gets enforced as a stated cap plus self reported spend that gets summed and flagged. If I wanted a hard abort mid run, Slate offered to design it explicitly.

That third callout is why I trust this tool. Most agent frameworks would silently pretend the budget was enforced. Slate told me exactly what layer of enforcement it could actually provide.

I confirmed all three defaults, renamed the Program to multifactor-research-pipeline and told Slate to commit it.

Then I hit run.


The seven factor agents fired immediately. Each one showed up in the terminal with its own subagent ID and status timer.

Slate confirmed the run in plain English:

"It's running in the background as multifactor-pipeline, starting with the seven factor agents in parallel on Sonnet, then the validator → regime → portfolio → risk sequence on Opus, with defaults (./research-memory, $30 budget, the three gates, perpetual 24-hour loop)."
That single line captures why graphs beat scripts.

I did not write coordination code. I did not chase a stack trace. I did not glue APIs together. I described the graph in plain English, answered three design questions, and Slate built it.

Everything is overridable at launch. Interval, budget, gate thresholds, models, memory location, and a maxRuns cap if you do not want the graph running forever.

Here is the full Program that Slate wrote for me. Study it, but do not copy it verbatim. Yours will look slightly different depending on the answers you gave to Slate's clarifying questions.

Part 6: What Happens Every 24 Hours
At 3am your time, the graph wakes up.

The seven factor agents fire in parallel. Each one pulls the latest 24 hours of price and fundamental data. Updates its factor time series. Hands off to the validator.

The validator runs Newey West t tests. Bootstraps 10,000 samples. Kills anything that failed out of sample.

This step alone rejects roughly 80 percent of what looks promising on a first backtest.

The regime auditor takes what survived. Segments history using the HMM. Recomputes Sharpe per regime.

A factor that only works in one regime is not alpha. It is beta to that regime, dressed up as alpha.

The portfolio constructor takes the surviving factors. Builds the long short portfolio with the neutrality constraints enforced.

The risk decomposer takes the portfolio. Regresses it against the broad style and macro factor set.

If the residual alpha t stat is above 2.5, the signal survives. If not, the day is logged as no signal and the graph sleeps until tomorrow.

Every morning you wake up to a Slack message. Either you have a signal you can trade. Or you have documented evidence that today was noise.

Both outcomes are useful. Neither required you to be at the keyboard.

This is what a self running multi factor alpha model looks like in 2026.


The Blueprint
If you remember nothing else, remember these seven moves in order.

1. Understand the progression. Prompts became loops. Loops became swarms. Swarms became graphs.

2. Know your factors. Market, size, value, momentum, profitability, investment, low volatility. Seven factors. Each one becomes a node.

3. Design eleven nodes. Seven factor agents in parallel. Four coordination agents in sequence. Draw the graph before you write a line of code.

4. Use different models for different nodes. Sonnet for factor construction. Opus for validation and decomposition. Maker never validates maker.

5. Enforce hard rules. Newey West t stat above 2.5. Bootstrap 10,000 iterations. Regime robustness across three HMM states. Residual alpha t stat above 2.5.

6. Warm up with /goal and /deepresearch. Graph engineering intuition comes from watching graphs, not from reading about them.

7. Let it compound. Month one is finding bugs. Month two is refining factors. By month three, your graph produces signals you can actually trade.

Now Go Build It
Install Slate tonight. Launch it. Run /goal on a real quant question. Run /deepresearch on a factor you are curious about.

Then draft your own Program with the exact prompt from Step 6. Review the diagram. Run it. Set a $30 budget.

By this time next week you will have your first self running multi factor graph.

By this time next month you will have your first tradeable signal survive all eleven nodes.

That is the trade. One weekend of setup for a compounding research system that never sleeps.

Now go build it.

If you get stuck at any part of the build, DM me here.

You can find Slate at http://randomlabs.ai/rr.

Follow @wearerandomlabs if you want to see every capability they ship. /goal and /deepresearch are the first two Programs. They will not be the last.