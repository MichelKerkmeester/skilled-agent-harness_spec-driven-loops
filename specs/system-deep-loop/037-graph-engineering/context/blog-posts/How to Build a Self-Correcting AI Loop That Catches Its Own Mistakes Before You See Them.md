Source: https://x.com/cyrilXBT/status/2077827005777588266?s=12

How to Build a Self-Correcting AI Loop That Catches Its Own Mistakes Before You See Them
There is a specific moment that separates someone using AI casually from someone actually running it as a system.

It is the moment they stop being the one who catches the mistake.

Right now, for most people, the loop looks like this. Ask Claude for something. Read the output. Notice something is wrong. Point it out. Get a corrected version. Read that. Notice something else. Point it out again. You are the verification layer, manually, every single time, for every single task.

A self-correcting loop removes you from that position entirely. The system generates, checks its own work against a real standard, catches what it got wrong, fixes it, and only then shows you the result. By the time you see the output, the obvious mistakes have already been caught and handled. What is left for you is judgment on the things that genuinely need a human, not proofreading a machine's first draft.

This is the complete build. By the end you will have the exact architecture, the exact prompts, and the exact failure modes to test for before you trust this with anything that matters.

Why This Is Not The Same As Just Asking Twice
The obvious first instinct is to just ask the model to check its own work in the same conversation. "Review what you just wrote and fix any mistakes." This helps a little. It does not build a real self-correcting loop, and understanding why is the entire foundation of what follows.

A model reviewing its own output in the same context, with the same reasoning that produced the mistake in the first place, tends to defend its own work rather than genuinely scrutinize it. This is not a flaw specific to any one model. It is a structural problem. The same pass that generated a plausible-sounding but wrong answer is not well positioned to notice it is wrong, because from the inside, the answer still sounds plausible. Asking "are you sure?" produces reassurance more often than it produces genuine re-examination.

The fix is not asking better. It is architecture. A real self-correcting loop separates the work of producing an answer from the work of judging it, using a different pass, a different prompt, and ideally a different frame of reference entirely, so the judgment is not contaminated by the same blind spots that created the mistake.

The Three Roles Every Self-Correcting Loop Needs
Every working self-correcting system, regardless of the specific task, reduces to three distinct roles. Understanding these roles clearly is more important than any specific prompt below, because once you see them, you can build a loop for almost any task by filling in the specifics.

The Builder. Produces the actual output. Writes the code, drafts the content, does the research, executes the task. This role should be given the most creative latitude and the least constraint, because its job is to produce a first attempt, not a perfect one.

The Judge. Does not build anything. Its only job is to evaluate the Builder's output against a specific, written standard, not a vague sense of quality. Does the code pass its tests. Does the draft match the brief. Does the research actually answer the question asked. The Judge should ideally have access to something the Builder does not, the original source material, the test suite, the actual requirements document, so it has independent ground truth to check against rather than just re-reading the same output and forming a fresh opinion.

The Manager. Reads the Judge's verdict and decides what happens next. Send it back to the Builder with specific feedback. Escalate to a human. Mark the task complete. This is also where your stop condition lives, the rule that prevents the loop from running forever when something cannot actually be fixed automatically.

The critical design principle across all three roles: verification needs to reference something outside the Builder's own reasoning. A test suite. An original source document. A written checklist. A second AI call with a genuinely different framing. Anything that is not simply "the same model, asked again, in the same breath."

Building The Handoffs
The actual engineering work in a self-correcting loop is not clever prompts for each role. It is the structure of what passes between them, and this is the part most people building their first loop skip entirely, then wonder why the system behaves unpredictably.

A handoff needs three properties to work reliably. A defined format, so the receiving role is not parsing loose prose and guessing at what matters. A defined trigger, so the Builder is not the one deciding when it is finished. And a defined failure path, so that when something does not go cleanly, there is a specified next step instead of the system silently breaking or looping forever.

In practice, this means the Builder should output something structured, not just conversational text. A clear deliverable plus an explicit statement of what it is uncertain about. The Judge then evaluates that structured output against a written standard and returns its own structured verdict, not a paragraph of hedged prose, but a clear pass, fail, or needs-revision, with the specific reason attached. The Manager reads that structured verdict, not the raw content, and decides the next action based on rules established in advance, not by improvising a judgment call in the moment.

Here is a template structure that works across most tasks, whether the underlying work is writing, code, or research:

text
BUILDER OUTPUT FORMAT
Deliverable: [the actual output]
Confidence: [high / medium / low]
Known uncertainties: [anything you are unsure about, stated explicitly]
Assumptions made: [anything you assumed without being told]

JUDGE VERDICT FORMAT
Verdict: [PASS / FAIL / NEEDS REVISION]
Checked against: [the specific standard used, e.g. the original brief,
the test suite, the source document]
Specific issues found: [exact problems, not a general impression]
Confidence in this verdict: [high / medium / low]

MANAGER ACTION
If PASS: mark complete, deliver to user.
If FAIL or NEEDS REVISION: send back to Builder with the Judge's
specific issues attached. Increment the revision counter.
If revision counter exceeds [N]: stop looping, escalate to human
with full history of what was tried and why it failed.
This looks like more structure than a casual back-and-forth conversation, and it is. That upfront cost is what buys you a system that behaves the same way on the hundredth run as it did on the first one, instead of drifting unpredictably as context accumulates.

The Judge Needs Ground Truth, Not Just An Opinion
This is the single most important principle in the entire system, and it is worth its own section because getting it wrong quietly undermines everything else.

A Judge that only sees the Builder's output, with no independent reference to check against, can only evaluate internal consistency, whether the output seems coherent and well formatted. It cannot evaluate correctness, whether the output actually matches what was asked for or actually solves the real problem. A confidently wrong answer, well formatted and internally consistent, will sail past a Judge with no ground truth every single time.

For coding tasks, ground truth is the test suite, the actual output of running the code, the lint results, the build status. Not "does this code look right," but "did it actually pass when executed."

For content tasks, ground truth is the original source material and the original brief, side by side with the draft. Not "does this read well," but "does every specific claim in this draft trace back to something actually in the source, and does the piece actually satisfy every requirement in the brief."

For research tasks, ground truth is the actual search results and source documents the research was supposed to be based on. Not "does this summary sound authoritative," but "can every claim be traced to a specific source, and were the sources that were searched actually the relevant ones."

If you cannot articulate what the Judge's ground truth is for your specific task, you do not have a self-correcting loop yet. You have a rephrasing loop, where the Builder's confident mistake gets confidently rephrased by the Judge instead of actually being caught.

The Stop Condition Is Not Optional
The most common way a self-correcting loop becomes an expensive, out-of-control mess is the absence of an explicit, hard stop condition. Without one, a Builder and Judge can cycle indefinitely, each revision triggering another evaluation, each evaluation triggering another revision, while cost climbs and nobody notices until the bill arrives.

A real stop condition needs three components, and all three should be enforced as explicit logic, not left to the model's judgment in the moment.

A maximum iteration count. A hard ceiling on revision cycles, after which the Manager is forced to escalate to a human regardless of whether the Judge is satisfied yet.

A quality threshold that is actually measurable, not aspirational. "Good enough" as an instruction inside a prompt is not a stop condition, because it is a suggestion the model can and will eventually ignore under the right pressure. A specific, checkable bar, all eleven test cases pass, or the draft matches all five stated brief requirements, is a stop condition, because it can be verified mechanically rather than judged subjectively each time.

A cost or time ceiling. An absolute budget the task cannot exceed regardless of what state it is in when that ceiling hits. This is the guardrail that protects you specifically from the worst case scenario, a genuinely unsolvable task looping until someone notices the invoice.

STOP CONDITIONS
Maximum revisions: 3. On the 3rd failed verdict, stop and escalate
to a human with the full revision history attached, do not attempt
a 4th cycle automatically.

Quality threshold: all items on the Judge's checklist must show PASS,
not "mostly passing" or "close enough."

Budget ceiling: if this task has consumed more than [X] tokens or
[Y] minutes, stop immediately regardless of current state and report
what was completed versus what remains.

Write these into the Manager's actual logic, not into a soft instruction inside a longer prompt that the model can talk itself out of under pressure.

A Worked Example: Self-Correcting Content Production
To make this concrete, here is exactly how the three roles and the stop condition come together for a real, common task, turning a source document into a finished piece of content without a human manually proofreading every draft.

The Builder receives the source material and the brief, and produces a draft. Its output includes the draft itself, plus an explicit confidence statement and a list of anything it was uncertain about while writing, a specific number it was not fully sure was in the source, a claim it inferred rather than found stated directly.

The Judge receives the draft and the original source side by side, never the draft in isolation. It checks three specific things, each with its own pass or fail. Does every factual claim in the draft trace back to something actually present in the source. Does the draft satisfy every specific requirement in the brief, length, tone, required sections. Is the core argument or hook actually present and undiluted by filler. The Judge returns a structured verdict with a pass or fail on each of the three checks separately, because collapsing this into one overall score hides exactly which dimension failed.

The Manager reads that structured verdict. A clean pass on all three sends the draft to a final output queue. A failure on the fact-checking dimension sends it back to the Builder with the specific unverified claim flagged directly, not a vague instruction to "double check accuracy." A failure on brief compliance sends it back with the specific missing requirement named. After three failed cycles on the same specific check, the Manager stops looping entirely and escalates to a human with the complete history of what was tried, rather than continuing to retry a problem the system has already demonstrated it cannot resolve on its own.

This is a small system. Three roles, one structured handoff format, one explicit stop condition. It is also a system you could genuinely run unattended and trust the output of, because every failure mode has a defined path instead of an undefined one.

Testing The Loop Before You Trust It
Before you rely on any self-correcting system for something that actually matters, run it through these specific stress tests deliberately. Most loops that fail in real use would have failed one of these tests immediately, if anyone had bothered to check first.

The unsolvable task test. Deliberately give the Builder a task it cannot complete to the Judge's standard, on purpose. Does the Manager correctly hit the iteration ceiling and escalate to a human, or does it spin indefinitely, burning cost on a task that was never going to succeed.

The confidently wrong test. Feed the Judge an output you already know is subtly wrong, something that reads well but contains a specific factual or logical error. Does the Judge, with its ground truth reference, correctly catch it. If the Judge passes something you know is broken, your ground truth reference is not actually being checked, or the check is too shallow.

The same-model blind spot test. If your Builder and Judge run on the same underlying model, this is worth checking directly. Feed the Judge an output containing exactly the kind of mistake that model characteristically tends to make. If the Judge waves it through, you have built a loop that shares its blind spots between roles, which defeats the entire purpose of separating them. Consider using a genuinely different model, or at minimum a meaningfully different prompt framing, for the Judge role specifically.

The cost runaway test. Calculate the worst case path through your system, maximum revisions, most expensive model calls involved, longest reasonable content length, and work out what that actually costs in real dollars and real time. If that number would alarm you appearing on an actual invoice, your stop conditions are not tight enough yet.

Running these four tests before trusting a self-correcting loop with anything real catches the overwhelming majority of failures that would otherwise show up for the first time in front of a client, a boss, or your own bank statement.

Common Mistakes That Quietly Break An Otherwise Good Design
Even with the right three-role architecture, a handful of specific implementation mistakes show up repeatedly across completely different domains, and knowing them in advance saves you from rediscovering each one the hard way.

Letting the Judge see only the Builder's output, with no independent reference. This is the single most common mistake, and it silently turns your system from a correctness check into a coherence check. A Judge with nothing to compare against can only tell you the output looks internally consistent, never whether it is actually right.

Giving every role the same model with only a thin instruction difference layered on top. If the Judge is running the exact same underlying model as the Builder, with just a different prompt telling it to "be critical," it often inherits the exact same blind spots the Builder has, because it is fundamentally the same reasoning process wearing a different hat. Where the budget allows, a genuinely different model for the Judge role produces real independence rather than theatrical independence.

Treating the Manager as a simple pass-through instead of giving it real memory of prior attempts. A Manager with no visibility into what was already tried on this specific task will happily send the same failed feedback back to the Builder a second and third time, producing the identical failed result each time, because nothing in the system remembers that this exact approach already failed once.

Skipping the four stress tests because the system worked fine in the one demo run everyone watched closely. A system that behaves correctly while you are watching it closely and a system that behaves correctly while running unattended are different claims. Only the second one is the actual point of building a self-correcting loop in the first place. If you have not tested the failure modes deliberately, you do not actually know which claim is true of your system yet.

Writing the stop condition as a soft instruction instead of hard logic. "Stop when it's good enough" inside a prompt is not a stop condition, it is a suggestion the model can and eventually will talk itself past under the right pressure. A hard iteration counter the Manager checks mechanically before allowing another cycle is a stop condition. The difference between these two matters enormously the first time a task turns out to be genuinely unsolvable.

A Second Worked Example: Self-Correcting Code
The same skeleton looks different but follows identical logic when the task is code instead of content, and walking through both side by side makes clear how little actually changes between domains.

The Builder here is a coding agent working through a defined task, a bug fix, a feature, a refactor. Its structured output is not just the code diff, but the actual command output from attempting to run it, the test results, the lint output, the build status, bundled into the handoff. A Builder that produces code but never actually executes it is not really filling the Builder role correctly, because syntactically plausible code that fails its own test suite is worse than no code at all, since it looks finished without being finished.

The Judge checks three specific, verifiable things. Did the change pass the existing test suite without the tests themselves being modified, since a Builder quietly editing a test to make it pass is a specific and surprisingly common failure worth checking for directly. Did static analysis and linting come back clean. Does the diff actually address the task that was assigned, not a related but different problem the Builder decided was more interesting to solve along the way. Each of these gets its own explicit pass or fail in the structured verdict.

The Manager routes based on which specific check failed. A failing test suite goes back to the Builder with the exact failing test output attached directly, not a generic instruction to "fix the tests." A scope mismatch, where the diff solved a different problem than the one assigned, escalates immediately to a human rather than looping, because that is a judgment failure about what the task actually was, not a mechanical defect the Builder can simply iterate its way out of on its own.

Notice that the underlying skeleton here, Builder produces and submits with evidence, Judge checks against specific named criteria with a per-check verdict, Manager routes based on exactly which check failed, is identical to the content production example above. This is the actual lesson worth carrying forward from seeing two different domains side by side. Once you have the skeleton correct, applying it to a new kind of task is mostly a matter of writing a new, specific checklist for the Judge, not redesigning the entire architecture from first principles each time.

Scaling To Multiple Concurrent Loops
Once a single self-correcting loop is genuinely reliable, the next real question is how to run several at once without the system becoming unmanageable, since this is exactly where most people's second attempt at scaling this up goes wrong.

The temptation is to spin up many loops simultaneously the moment the first one works, tackling five different tasks in parallel because the architecture technically supports it. Resist this longer than feels necessary. Each additional concurrent loop is another place where a stop condition can fail silently, another place where cost can run away unnoticed, another place where a Judge's ground truth reference might be subtly wrong in a way that only shows up under real volume rather than in a single test run.

The safer scaling path is sequential expansion with a genuine trust threshold at each step. Get one loop running reliably enough that you have stopped checking its output closely, meaning it consistently passes your own manual spot-checks over a real stretch of time, not just a single successful demo run. Only then add a second loop for a different task. Track each loop's actual failure rate over time, not just whether it appeared to work on the runs you happened to observe.

When you do run multiple loops concurrently, give serious thought to a shared cost dashboard across all of them, not per-loop tracking in isolation. A single loop with a reasonable per-task budget looks completely fine in isolation. Ten loops each individually within budget can still add up to a genuinely alarming total that nobody notices until the aggregate bill arrives, precisely because each individual loop's tracking looked fine on its own.

The single habit that prevents scaling problems before they start: log every stop condition trigger across every loop, not just the successful completions. A loop that hits its maximum iteration ceiling and escalates to a human is doing exactly what it is supposed to do, but if one specific loop is hitting that ceiling constantly while others rarely do, that is a signal the Judge's standard for that particular task is either miscalibrated, too strict to ever actually pass, or checking against the wrong ground truth entirely. That pattern is invisible if you are only tracking successes and treating every escalation as an isolated, unremarkable event rather than a data point about that specific loop's design.

Where To Start This Week
Do not try to build a fully general self-correcting system on your first attempt. Pick one specific, narrow, well-defined task you already do regularly, something with a clear standard you could write down if asked, and build the three-role loop around that single task first.

Write the Judge's checklist down explicitly before you write a single line of the Builder's prompt. The standard you are checking against should shape what you ask the Builder to produce, not the other way around. If you cannot write the checklist yet, you do not yet know what "correct" means for this task well enough to automate checking it, and that is worth discovering before you build anything.

Run the four stress tests above before you trust the loop with anything that actually matters, not after something has already gone wrong in front of someone. Add the stop condition as real, hard logic from the very first version, not as an afterthought once you have already been burned by a runaway loop once.

Once one loop is genuinely reliable, running unattended, catching real mistakes, stopping cleanly when it should, the second one goes much faster. Not because the prompts transfer directly, they usually need to be rewritten for the new task, but because you already understand the actual shape of the problem. Separate the building from the judging. Give the judging something real to check against. Write the stop condition as logic, not hope.

That shape is the entire discipline. Everything else is just applying it to whatever task is in front of you.

Follow @cyrilXBT for the exact loop templates and Builder-Judge-Manager setups behind everything in this article.