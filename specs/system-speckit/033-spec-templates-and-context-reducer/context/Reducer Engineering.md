Source: https://x.com/gippp69/status/2087120797206819322?s=12

Reducer Engineering: Cutting What Your Model Has To Read (Full Guide)
Most people scaling a multi-agent pipeline are optimizing the wrong layer.

They add more workers.

More workers means more coverage.

More coverage means more raw text landing on whichever model has to write the final answer.

Nobody budgets for that model. Everybody budgets for the workers.

That's the layer that breaks first.

Here is what fixed it on mine: one deterministic reducer between 40 parallel Claude Haiku workers and Claude Sonnet, the model writing the final report. Cost per run dropped 86%. Latency dropped 78%.

TLDR: if you don't want to read the whole thing, the reducer function and the numbers it produced are both at the bottom. Copy the function first, argue about the rest after.

Introduction
It broke on mine before I noticed why.

Full numbers first:

40 parallel Claude Haiku workers, one query each, feeding one Claude Sonnet synthesis call
Raw combined output before any cleanup: 41,200 tokens
Same output after a code-only reducer, no model involved: 5,300 tokens
Synthesis cost per run: $1.38 before, $0.19 after
Synthesis latency: 51 seconds before, 11 seconds after
Contradictions the reducer surfaced that the raw dump had buried: 23
Runs escalated to a human because the final answer was ambiguous: 6 out of 50 before, 1 out of 50 after
Everything below is where those numbers came from and the code that produced the drop.

1. What The Pipeline Looked Like
Forty workers, each given a narrow slice of one research question. Pull sources, extract a claim, attach the evidence.

Every worker ran on Claude Haiku, cheap enough to fan out to forty of them without thinking twice about the bill. Every worker's output went straight into one prompt, and Claude Sonnet read all forty outputs and wrote the final report.

That felt efficient. Forty cheap calls, one strong call to close it out.


2. What Actually Landed On The Synthesis Model
Not forty clean findings. Forty small documents, each with its own preamble, its own formatting, its own way of citing a source.

Fifteen of the forty were near-duplicates of each other, same claim from a different angle, same source cited three different ways.

Six were malformed, missing a field, a broken timestamp, a claim with no evidence attached.

The synthesis model had to read all of it, notice the duplicates itself, decide which malformed entries to ignore, and only then start actually reasoning about the report.

I had built a research pipeline. What I had shipped to the expensive model was a data-cleaning job wearing a research pipeline's clothes.


There's a reason this costs more than just tokens. Liu and colleagues at Stanford (2023, published in TACL 2024) found that model accuracy at finding relevant information in a long context follows a U-shape: strong near the start or end of the input, and significantly worse when the answer is buried in the middle, even on models built for long context. Dumping forty unordered findings into one prompt doesn't just inflate the bill, it puts most of them in the exact spot the model is worst at reading.

3. The Reducer
None of the cleanup step needs a model. It needs code.

python
from dataclasses import dataclass
from collections import defaultdict

@dataclass
class Finding:
    claim: str
    evidence: str
    source: str
    confidence: float
    timestamp: str

def reduce_findings(raw: list[Finding]) -> list[Finding]:
    valid = [f for f in raw if f.claim and f.evidence and f.source]

    grouped: dict[str, list[Finding]] = defaultdict(list)
    for f in valid:
        key = normalize(f.claim)
        grouped[key].append(f)

    deduped = []
    for key, group in grouped.items():
        best = max(group, key=lambda f: f.confidence)
        if len(group) > 1:
            best.evidence += f"  [confirmed by {len(group)-1} other worker(s)]"
        deduped.append(best)

    return sorted(deduped, key=lambda f: f.confidence, reverse=True)
Drop malformed entries. Group by normalized claim. Keep the highest-confidence version of each group. Note when multiple workers independently landed on the same claim, because that agreement is itself a signal the synthesis model should see, not something it should have to rediscover by reading forty documents back to back.

4. The Numbers, Again, With Where Each One Came From
41,200 tokens raw, 5,300 tokens after reduce. That's 34 unique findings surviving out of 40 raw entries, with the six malformed ones dropped and their loss visible in the run log, not silently absorbed.
$1.38 to $0.19 per run. The synthesis model is billed on what it reads. Reading 87 percent less input at the same price-per-token is most of that drop on its own.
51 seconds to 11 seconds. Longer input means more time spent attending to it before the model produces a single token of the actual answer. Cutting the input cut the wait before the real reasoning even started.
None of those three numbers required a smarter model. They required the model to stop doing a job code was always better at. Haiku fanning out to forty workers was already the cheap part. The fix wasn't a cheaper worker, it was giving Sonnet less garbage to read at the end.


5. The Part That Surprised Me
I expected the cost and latency drop. I didn't expect the reducer to catch things the raw synthesis missed.

Grouping by normalized claim doesn't just dedupe, it exposes disagreement. Two workers landing on the same claim with different confidence, or worse, two workers landing on contradictory claims about the same fact, becomes visible the moment you group instead of concatenate.

Across the sample runs, grouping surfaced 23 direct contradictions between workers that the raw, ungrouped dump had never flagged, because a contradiction sitting on page one and page thirty of a wall of text isn't something a model reliably catches by just reading forward.

Structured reduction isn't only a cost optimization. It's a place to put a check that plain concatenation has no way to run.

6. The Guards
plaintext
finding missing claim, evidence, or source     -> dropped before grouping, logged as malformed
two findings in one group disagree on the fact -> flagged as a contradiction, sent to synthesis explicitly
a group has only one member                     -> passes through unchanged, no false confidence added
reduce_findings() receives an empty list         -> returns empty, synthesis step is skipped, not run on nothing
Four checks, none of them a model call, all of them catching something that used to depend on the synthesis model noticing on its own.

7. What I Haven't Tested
The normalize() function that groups claims is doing real work I haven't stress-tested past this sample. It's a similarity match on claim text, and I don't yet know its false-merge rate, two genuinely different claims that happen to phrase similarly getting collapsed into one. That's a correctness bug hiding behind a cost win, and I want more runs before I trust it on anything I can't manually spot-check.

8. The Playbook
If more than one worker feeds one final model, put a reducer between them before you touch the prompt.
Deduping, dropping malformed entries, and grouping are code problems. Reasoning about what's left is the model's job. Don't let one bleed into the other.
Measure raw input size before you optimize anything else. Token count into the synthesis call is usually the whole cost story.
Treat agreement and disagreement between workers as data the reducer should surface, not noise the model has to rediscover.
The Point
Forty Claude Haiku workers were never the expensive part. The expensive part was Claude Sonnet reading all forty outputs raw and doing cleanup work before it could start reasoning. A reducer that touches none of that reasoning cut the bill by 86 percent and the wait by 78 percent, and it did it by taking work away from Sonnet, not by asking it to work harder.

If you want more breakdowns like this, I post one every couple of days on Telegram and X. Both free.

X - https://x.com/gippp69

TG - https://t.me/GipArcAI