# Iteration 9 — mimo-09: Cost, latency and privacy as the operator experiences them

**Lineage:** `mimo` (UX and measurement lens) — wave 4
**Session:** `fanout-mimo-1790438758756-5mso8j`
**Focus Area:** `mimo-09` — Cost, latency and privacy as the operator experiences them
**Angle question:** For the top ideas, what does a day of use cost, how much latency does the operator feel, what leaves the machine, and how is egress announced?

## Sibling check

Both siblings are complete at 10 (their newest files read in iterations 4 and 5). Deepseek-09's prompt-cache analysis (its citation list) finds the surviving ideas touch no model prompt, which matches this iteration's conclusion for every arm except the parked compaction pass. Grok-09's checklist wave is this angle's neighbor but does not price anything.

## Grounding opened this iteration

- `.skilled/skills/cli-jev/cli-usage/SKILL.md:20-34,70-80,205-211,262-268` — the linter rules, the secret-state refusal, the send-minimum rule, the provider/model recording requirement.
- `pi-jev-context-main/README.md:30-50` — the enablement egress warning and the threshold honesty note.
- `supercov-main/docs/quality.md:175-205` — the measured cost table, estimate-before-send, content-hash cache.
- Digest claims used with attribution: the vendor cost claims ($0.042/M input and about 150 ms per answer, claude-jev README; $42/B input, about a cent per MB, supercov), the Hermes user report ($0.002 per compaction, 5.6 s versus 44.8 s), the parallel-questions latency note, the 64k/32k token budgets, the Python client's 60 s timeout, and the latency gap row.

## The cost and latency ground truth, classified

Money (all arithmetic below is INFERRED arithmetic on VENDOR CLAIMS): per-call input is what is billed. One `choice` call carrying a prompt and two or three skill descriptions is on the order of 1 to 2k input tokens, so about $0.0001 per call at the claimed $42 per billion (supercov's own measured rows: one changed file $0.0005, 0.9 MB of source $0.02, `quality.md:182-186`, opened). Even the highest-volume shape here, a live per-turn goal shadow at a few hundred turns a day, is cents a day. The operator will not feel the money; a wrong claim of "expensive" would be its own fabrication.

Latency (UNMEASURED here; the gap row is explicit: "None records latency, cost per call or judgment accuracy", H8). The vendor claim is about 150 ms per answer with parallel questions costing about one latency (digest attribution). The only hard numbers in this repository are ceilings: 60 s Python client timeout, 1200 ms sentinel check (`completion-evidence-sentinel.cjs:94`, opened in mimo-06), 1800 ms precompact internal, 2500 ms advisor child (seam-map).

The consequence, stated against my own iteration 3: the in-hook drops there were decided on the timeout ceiling, not on measured latency. If a Jev call's p95 including spawn overhead lands under a few hundred milliseconds, some of the 3 s-hook shapes are not deadline-dead after all. The drops stand as policy until measured (never build on an unmeasured promise), but the measurement can revive them. This is the single most leveraged unknown in the cost picture.

Privacy (CONFIRMED classifications by payload):

| Idea | Payload that leaves the machine | Sensitivity |
|---|---|---|
| Routing arm (offline) | Corpus prompts, skill descriptions | Low; synthetic routing prompts (confirm corpus provenance before claiming low) |
| D4 grader | Fixture diffs and outputs | Low; synthetic repo states |
| Stop replay | Archived iteration findings | High; repository internals |
| Severity replay | Finding evidence text | High; repository internals |
| Done-gate and goal labeling set | Operator session turn excerpts | High; working conversation content |
| Goal shadow if live | Every turn's transcript excerpt and objective, permanently | Highest; standing conversation egress |
| Compaction pass | History fragments | Highest; and it can break the host provider's prompt cache (unmeasured cost) |

## Per-idea cost and privacy lines

### A. Routing tie-break arm

| Field | Record |
|---|---|
| **Cost** | Eligible rows only (UNKNOWN until the census; ceiling tens of rows) times 3 stability reruns: on the order of 100 to 300 calls per full evaluation, cents (INFERRED on VENDOR CLAIM). Not a daily surface; run per evaluation. |
| **Latency felt** | None; offline. Its per-call JSONL is simultaneously the latency probe that fills gap row 1 (deepseek-08's fold, adopted). |
| **Privacy** | Corpus prompts and skill descriptions. CONFIRMED low-sensitivity by content type. |
| **Egress announcement** | Report header naming payload and call count before phase 1 runs; per-call records carry version and provider (transport completion rule, `SKILL.md:266-268`, opened). |
| **Class** | VENDOR CLAIM cost, CONFIRMED privacy, UNMEASURED latency. |

### B. D4 `jev` grader kind

| Field | Record |
|---|---|
| **Cost** | Fixture count times samples times reruns: with class-complete fixtures (mimo-08 check 1) roughly 40 to 100 calls per full run, cents (INFERRED on VENDOR CLAIM). |
| **Latency felt** | Benchmark wall time only; nobody waits on it interactively. |
| **Privacy** | Fixture diffs (synthetic). CONFIRMED low. |
| **Egress announcement** | Per-run report row; the run refuses at startup without a key (mimo-08 check 3). |
| **Class** | VENDOR CLAIM cost, CONFIRMED privacy. |

### C. Stop replay and D. Severity replay

| Field | Record |
|---|---|
| **Cost** | Stop replay 125 to 250 calls per 25-lineage sample; severity replay 69 in the sampled registries and a few hundred corpus-wide. Both cents to about a dollar (INFERRED on VENDOR CLAIM). |
| **Latency felt** | None; offline batch. |
| **Privacy** | Both send repository internals (archived findings and evidence). This is the class where the transport's rule bites hardest: "The state is a secret or private record... Authorization to send it is the caller's to hold, and a judgment is not worth a leak" (`SKILL.md:76-77`, opened), and "Send only the state the judgment needs, stripped of credentials and private records" (`:209`, opened). The replays must strip and scope their state, not forward whole iteration files. |
| **Egress announcement** | Before the first call: what class of content leaves and how many calls; then a `--dry-run` mode listing requests without sending, copying supercov (`quality.md:191-196`, opened). |
| **Class** | VENDOR CLAIM cost, CONFIRMED high privacy exposure. |

### E. Done-gate and goal shared labeled set

| Field | Record |
|---|---|
| **Cost** | 30 to 50 excerpts, one or two calls each: under 100 calls, cents. |
| **Latency felt** | None; offline. |
| **Privacy** | The excerpts are the operator's own session turns (mimo-03/06 design). Labeling keeps them local; the Jev arms send them. The set should be written with secrets stripped at authoring time (transport rule, `:209`). |
| **Egress announcement** | At set authoring: the operator is the labeler and sees exactly what will be sent; the arms then run on the already-approved set. |
| **Class** | CONFIRMED high privacy, mitigated by the operator authoring the set themselves. |

### F. Goal shadow if ever live (the only standing-cost shape)

| Field | Record |
|---|---|
| **Cost** | One call per turn on opted-in sessions: at 50 to 300 turns a day, about $0.005 to $0.03 a day (INFERRED on VENDOR CLAIM). |
| **Latency felt** | None if shadow-only and async; the Pi turn_end has no declared deadline (seam-map S08) but a slow call still delays the turn's bookkeeping. |
| **Privacy** | Standing conversation egress, every turn, permanently. This is the surface where pi-jev's enablement warning is mandatory in the operator's voice: "Data leaves your machine when enabled... They can contain private code or secrets... No TypeSafe requests are made while disabled" (`pi-jev-context-main/README.md:37`, opened). |
| **Egress announcement** | At enablement, not per call: one warning blockquote in whatever surface flips the flag, plus the flag defaulting off (pi-jev: "Pruning is off by default", `:35`). |
| **Class** | VENDOR CLAIM cost, CONFIRMED highest privacy, UNMEASURED latency. |

### G. Compaction pass (parked, priced for completeness)

| Field | Record |
|---|---|
| **Cost** | USER REPORT $0.002 per compaction and 5.6 s versus 44.8 s for an LLM summarizer (Hermes post, digest attribution). Plus an UNMEASURED multiplier: if the pass breaks the host provider's prompt cache (pi-jev's concession, jev-material digest §4.4), every subsequent request in the session costs more than the judgment saved. |
| **Privacy** | History fragments; highest. |
| **Egress announcement** | As F. |
| **Class** | USER REPORT cost with an unmeasured cache-risk multiplier. |

## The egress-announcement pattern to carry into any build

Three existing patterns compose it, all opened this iteration: pi-jev's enablement warning in the operator's voice (`README.md:37`), supercov's estimate-before-send so "a number that looks wrong can be stopped rather than discovered on an invoice" (`quality.md:191-196`) plus `--dry-run`, and supercov's content-hash cache so a second run "pays only for files that actually changed" (`:198-203`). Add the transport's own completion rule: record the provider and model with every result (`SKILL.md:266-268`). A Jev arm that cannot name its payload, its call count and its provider before the first call does not ship.

## Ruled out this iteration

- Pricing anything per day from the vendor claims as if measured: every number above is marked, and the one number that would make cost real (per-call latency and token counts) is gap row 1.
- Claiming the corpus prompts are harmless because they look synthetic: the routing corpus's provenance is not opened; the claim stays qualified.

## Hand-off

- Per-idea cost and privacy lines: A and B are low-privacy cents-per-evaluation offline arms; C and D send repository internals and must strip and announce; E keeps the operator as the set's own labeler; F is the only standing-cost shape and the only one needing an enablement warning; G's cost is dominated by an unmeasured prompt-cache risk.
- The one measurement that must come first: the per-call latency and cost probe (gap row 1), which the routing arm's per-call JSONL fills for free. Its p95 number is the gate on the deadline-dropped shapes (mimo-03's in-hook drops): under a few hundred milliseconds they may live, at seconds they stay dead. Write the drop/revive decision as a function of that number in the synthesis.
- The announcement pattern (pi-jev warning + supercov estimate and dry-run + provider recording) is a design requirement on every surface, not a nice-to-have.
