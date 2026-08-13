Source Link: https://x.com/ArchiveExplorer/status/2080621294979023358?s=12

LOOP ⭢ GRAPH ⭢ HARNESS: build the whole pipeline in one sitting
Your agent re-reads the whole spreadsheet every turn. The whole codebase. The whole doc.

It finds something, forgets it, finds it again next turn - and you pay for those tokens twice, three times over.

The reflex is a bigger window, or a smarter model. Neither helps.

The problem isn't capacity. It's that everything the agent touches stays in the one window it thinks in.

The mental model: three layers, not three skills

A single model call answers once and stops. An agent has to do three harder things, and each one is a layer:

Do a unit of work in a controlled cycle - try, check, retry until it's actually right. That's the loop.
Split work too big for one cycle across many cycles - and keep each cycle's mess out of the others. That's the graph.
Run all of that on a substrate that hands each cycle its tools, its own clean context, and a safety boundary. That's the harness.
They don't compete. They nest:

The fix is a three-layer pipeline, and by the end of this you'll have it running locally. We build it bottom-up:

text
HARNESS   -- the runtime everything executes inside (Layer 3)
  |__ GRAPH   -- several loops, fanned out and checked (Layer 2)
        |__ LOOP   -- one worker: gather -> act -> verify (Layer 1)
Clone the finished version now so the code below is real, not pseudocode. No install, no key, no network:

text
git clone https://github.com/Archive228/loop-graph-harness
cd loop-graph-harness && ./run.sh
Every quote below is a verbatim line from a real talk, with its exact timecode - the one thing in this whole niche you can check against the tape. Most of these threads can't survive that check: 9 of 16 "courses" they quote don't exist as video. Ours do.

Layer 1 - THE LOOP
A loop is not "a cycle." It's a unit of work with three named parts, and the third is the one that makes it an agent instead of a chatbot:

Gather context - decide what goes into the model's window for this step. Too little and it answers blind; too much and it's slow, expensive, and distracted.
Take action - produce a candidate: code, an edit, a tool call, an answer.
Verify the work - a check decides accept or try again. This is the step everyone draws and nobody builds.
"here is the three parts to an agent loop: first gather context, second taking action, and the third is verifying the work."
Gather, act, verify, repeat until verified. The whole discipline is one rule: the verifier is written before the action, and the loop cannot pass it. And the verifier should be a plain rule, not a model grading a model:

"the best form of verification is rule-based... if it doesn't lint or compile - as many rules as you can, insert them."
Here is the loop, whole. It's twenty lines; the discipline is that the verifier exists first (src/loop.py):

text
def run_loop(material, act, verify, max_attempts=5):
    failures = []
    for attempt in range(1, max_attempts + 1):
        candidate = act(material, failures)     # ACT - sees prior failures as context
        report = verify(candidate)              # VERIFY - rule-based, written first
        if report.passed:
            return LoopResult(True, candidate, attempt)
        failures = report.failures              # the failure text IS the next context
    return LoopResult(False)                    # budget spent -> ship nothing
Why this isn't a toy: the demo fails on purpose. The worker parses durations (1h52m, 30m, 0s...). Attempt 1 uses a parser that is correct on every input a person would think to try - and genuinely crashes on "0s":

text
def _parse_v1(text):
    h = re.search(r"(\d+)h", text); m = re.search(r"(\d+)m", text); s = re.search(r"(\d+)s", text)
    hours = int(h.group(1)) if h else 0
    mins  = int(m.group(1)) if m else 0
    secs  = int(s.group(1)) if s else 0
    if hours or mins or secs:            # for "0s" this is 0 or 0 or 0 -> False
        return hours*3600 + mins*60 + secs
    return int(text)                     # ...so int("0s") raises. Jagged.
That's the "jagged edge" Karpathy warns about - models peak on the obvious inputs and are "rougher on the edges" one input over (clip K1 · Karpathy 10:35). You don't catch it in review. The rule-based verifier does, and the loop retries with a boring, total parser. When you run the repo you see it happen:

text
PASS  sheet-A: builds    total=18420s  attempts=1
PASS  sheet-B: tests     total=4830s   attempts=2  <- attempt 1 failed on '0s', loop retried
PASS  sheet-C: deploys   total=12600s  attempts=1
That is loop engineering: one unit a program has to approve before it ships.

Layer 2 - THE GRAPH
Now scale the loop. Several workers, each on one slice, running at once, handing back small results:

"multiple read sub agents going on at the same time... can this agent read and summarize sheet one? Sheet two? Sheet three? Then they return their results, and the agent maybe spins off more sub agents again."
"spin up three sub agents to do this task. And it will do that."
Read clip again - he narrates fan-out, fan-in, fan-out-again and never says the word "graph," because from inside the system it isn't a topology you architect, it's a knob you turn. In code, the graph is only the wiring; each node is just a loop (src/graph.py):

text
def fan_out(harness, worker, items):
    # one loop-worker per (task, slice) - each runs in its own clean context
    return [harness.spawn(worker, task, material) for task, material in items]
The design rule for a graph node: decide what comes back before you spawn it. The parent's context grows by exactly the return value, so you design the return first. If you can't say in one sentence what shape comes back - a number, a list, a verdict - you haven't drawn a boundary, you've doubled your bill.

A returned answer you didn't check is just faster pollution, so the graph ends with a checker - and it must run clean, with no loyalty to the work that produced it:

"you might even want an adversarial one... really go to town on it, with no sympathetic relationship to the work already done."
"as the models get better at reasoning, you can have these sub agents to check the work of the main agent."
text
def adversarial_verify(harness, artifact, rules):
    def checker(ctx, tools, task, material):     # ctx is FRESH; sees the artifact only
        broken = rules(artifact)                 # not how it was made - nothing to defend
        return "REJECT: " + "; ".join(broken) if broken else "ACCEPT"
    verdict = harness.spawn(checker, "adversarially verify", repr(artifact))
    return str(verdict).startswith("ACCEPT")
The tests prove this gate has teeth - hand it a bad merge and it rejects. A graph without this last node is just an unverified system with a nicer diagram.

Layer 3 - THE HARNESS
The two layers above kept calling harness.spawn(...). This is what that is: the runtime everything executes inside. The engineer lists what's in it:

"in the harness you've got tools"
"tools you run in a loop, then you have the prompts, and finally the file system. The file system is a way of context engineering."
"research, compacting, hooks, memory - they're all these other things around the harness as well."
"tools you run in a loop." The loop is a component of the harness - which is why this is one stack, not three rival skills. The harness does two jobs for you.

Job 1 - make spawning cheap. You think about what to spawn, not how:

"we take care of all of this for you in the harness so you can think about: what sub agents do I need to spin off?"
"when you're running parallel sub agents... bash becomes very complex - there are lots of race conditions. There's a lot of work we've solved there."
And it prefers one general tool over a drawer of bespoke ones:

"if you were designing an agent harness, you'd have a search tool and a lint tool and an execute tool. Instead, now Claude just uses grep."
Job 2 - keep every worker's context clean. This is the load-bearing method, and the one rule that makes isolation real (src/harness.py):

text
def spawn(self, worker, task, material):
    child = Context()               # <-- NEW, empty. NOT self.parent.
    child.add(task); child.add(material)   # heavy material enters the CHILD only
    result = worker(child, self.tools, task, material)
    self.parent.add(str(result))    # parent grows by the RESULT only
    return result
"the main thing is to avoid context pollution, so you wouldn't want to fork the context. You'd start a new context session."
Fork the parent's window into the child and you isolated nothing - you copied the mess. The child starts empty, reads its slice in its own window, and hands back one line. And when a swarm is running bash, the last layer of the harness is the one that contains it:

"the last layer is sandboxing. Let's say someone has maliciously taken over your agent - what can it actually do?"
Run it, and watch the bill stay flat
That's the pipeline. Bottom-up: a loop that a program must approve, a graph that fans loops out and checks them clean, a harness that makes both cheap and keeps their contexts isolated. ./run.sh prints the proof:

text
HARNESS event log (parent context grows by RESULTS, not by sheets):
  spawn #1: child_ctx=58B  parent +71B (sum sheet: sheet-A)
  spawn #2: child_ctx=57B  parent +69B (sum sheet: sheet-B)
  spawn #3: child_ctx=53B  parent +72B (sum sheet: sheet-C)
  spawn #4: child_ctx=81B  parent +6B  (adversarially verify)

parent (main-agent) context size: 218 bytes - it never held a full sheet.
Three full sheets processed. The main agent's context - the thing you pay for every turn - ended at 218 bytes. No bigger window, no better model. Just boundaries with return types. That's the whole point the engineer keeps circling:

"you should never read the entire spreadsheet into context, because it would take too much."
"I'm on my fifth compact. I'm like - what? I've almost never done a compact before."
He almost never compacts because he almost never lets the window fill. That's the skill, and now it's running on your machine.

Where to go next
The demo generator is scripted so it runs offline and deterministically. Swap src/workers.py's act for a real model call and nothing else changes - loop, graph, and harness don't know or care what produced the candidate. That's the test that the layering is honest.

Three questions - where's the boundary, what's the return type, how do you verify it. None of them is which of the three words goes in your bio.

The repo: github.com/Archive228/loop-graph-harness - ./run.sh from a clean clone, 9 tests. Full timecode-to-file map in its LECTURE.md.