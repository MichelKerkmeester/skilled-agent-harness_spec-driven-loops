# Iteration 005 -- What a default-on integration would need, cost and risk

- **Focus:** Q5. Define the integration target precisely (which branch, which path), then what must exist before it can run by default, what it costs per fire, and what can go wrong.
- **Status:** complete. **newInfoRatio:** 0.80.
- **Sources read:** `alignment-validator.ts` (branch logic, TTY gates, hard blocks), `folder-detector.ts` (both call sites and the redirect), `score-alignment-suggestion.ts` (gate, timeout, payload class, call shape), `022/spec.md` (REQ-001..010, D9 payload gate), `047/goal.md` (D6), 022 implementation summary census counts, F2/F3/F4 findings.

## Findings

**F5-01 [OBSERVED] The integration target is a specific branch, not "the save path".**
The suggestion exists only when the validator prints a low/infrastructure band and finds at least one higher-scoring sibling (alignment-validator.ts:522-545 CLI, :641-664 data). On the CLI path an explicit folder argument already suppresses the switch by policy (:1046-1049); on the data path a non-interactive run proceeds with the specified folder (:666-669) and an interactive run prompts (:671-684). A default-on Jev arm therefore touches (i) the interactive CLI decision, (ii) the interactive data-path decision, (iii) potentially the non-interactive data path. Each has a different consent story; (iii) is the one with the largest blast radius because it changes what automation accepts.
[SOURCE: alignment-validator.ts:522-545, :641-684; folder-detector.ts:1043-1049, :1160, :1187]

**F5-02 [OBSERVED] The current gate stack is already defined and reusable at save time.**
Jev must sit on PATH at exactly `jev 0.6.2`, `jev auth status --provider P` must exit 0, and the operator must accept sending payloads before any call (score-alignment-suggestion.ts:731-770; 022 REQ-003). The arm is otherwise dormant and prints one skip line. Timeout is 90 s per call (:65) with one backoff retry on exit 4 (:1101-1104), and unmeasured calls are recorded without a verdict (:963-970). The payload is the row's session summary on stdin plus the fixed question and the option lines (REQ-006); calls never carry row text except to the provider (:928-932, REQ-004).
[SOURCE: score-alignment-suggestion.ts:65, :731-770, :963-970, :1101-1104; 022/spec.md REQ-003, REQ-004, REQ-006]

**F5-03 [OBSERVED] Per-fire cost is small and measured; frequency and price are not.**
Measured unit: one call at p50 ~324 ms (min 287, max 448 over 120 calls); three passes per decision -> ~1.0 s of model wall; ~274 planned tokens per call (32,927 planned over 121 calls). One auth call happens once per run (KEYS: `planned_calls = 3 * rows + 1`). No token or price receipt exists for the run (F2-06), and the frequency of low-alignment-with-alternatives saves is not established: on the committed tree the 022 census found 3 events total, 2 below-50, 0 with alternatives (implementation summary), while the 047 corpus was constructed rather than drawn. Both the price per fire and the fires per week are UNKNOWN and are what a shadow run would measure.
[SOURCE: F2-05, F2-06; ~/.skilled/.labels/runs/047-022-jev-20261002/calls.jsonl; 022/implementation-summary.md (census counts)]

**F5-04 [DERIVED] Default-on needs six things that do not exist today.**
1. **Consent storage** -- `--accept-payload` is per-run (score-alignment-suggestion.ts:764-767). A default-on arm needs a durable, revocable opt-in, because the payload is operator session text.
2. **A save-time timeout budget** -- 90 s per call is a batch-scorer value; a save cannot wait 90 s. Typical is ~0.3 s, so a 2 s cap with skip-on-timeout preserves the save.
3. **A non-interactive policy** -- who may accept a model's folder pick in an automated save, and whether a Jev pick may lift a below-20% hard block (:552-556, :593-595). Recommendation: never; the hard block stays authoritative.
4. **A kill switch and fallback path** -- env/config flag whose off-state is byte-identical to today's behavior; the fallback already exists (skip line, exit 0).
5. **Observability** -- a calls.jsonl-equivalent for the save flow (pick, probability, wall, exit, no row text) plus the pick in the save's own log.
6. **An evidence gate before default-on** -- the keep verdict must hold on a corpus that is not the 022 fixture (F3-01..F3-04): real transcripts, target headroom, adjudicated labels, negative controls.
[SOURCE: score-alignment-suggestion.ts:65, :546-558, :593-596, :764-767; F3; F5-02]

**F5-05 [DERIVED] Three integration shapes, ordered by reversible-step size.**
- **S1 Flag-gated interactive suggestion** (recommended first): run only on an interactive low-band save, show the model pick as one extra numbered option labelled with its source, never auto-switch. Failure = today's behavior. This is the smallest complete slice: it serves the judgment where the operator is already deciding, and it collects real shadow data in calls.
- **S2 Default-on interactive suggestion**: same as S1 but the call fires without a per-session flag once consent is stored. Value: consistency. Cost: latency on every flagged save, consent management. Needs S1's evidence first.
- **S3 Non-interactive adoption**: automation accepts the pick, including hard-block interplay. Highest value in principle (automation currently cannot use the suggestion), highest risk (a wrong redirect writes to the wrong packet unnoticed); needs a separate policy decision and a much stronger label/consent story.
[SOURCE: derived from F4-01, F5-01, F5-04]

**F5-06 [DERIVED] Risk register with the measured facts behind each.**
- **Wrong redirect (medium impact, unknown rate)**: the CLI/data flows can return an alternative folder and writes follow it (folder-detector.ts:1166 returns the selected folder path). On the 022 fixture Jev was right on 10 of 11 disagreements and the single loss was a near-tie (F1-07); a real-corpus rate is unmeasured.
- **Premature generalization (high, present today)**: the only corpus is a fixture whose target column is dead (F3-01, F3-02). Default-on on this evidence would extend a fixture result into a write path.
- **Privacy (high)**: session summaries leave the machine. REQ-004 keeps row text out of files but the provider receives it; consent must be explicit and revocable (F5-04.1).
- **Availability/latency (medium)**: version/auth drift turns the arm off (already safe); a slow provider can add up to the timeout on a save unless capped (F5-02, F5-04.2).
- **Policy drift on hard blocks (high)**: never let model output override the below-20 non-interactive block (F5-04.3).
- **Injection surface (low but real)**: session text is model input; fetched content can enter summaries. The repo already treats fetched content as untrusted and 035 screens injection; a save-time arm inherits that surface.
- **Cost without receipt (low)**: no price telemetry exists; shadow mode must record tokens if a provider reports them.
[SOURCE: F1-07, F3-01, F3-02, F5-04; folder-detector.ts:1166; score-alignment-suggestion.ts:546-558, :593-596]

**F5-07 [DERIVED] Cost model.**
Marginal per fire: 1 decision = 3 calls (or 1 call under the confidence gate, F2-04) -> ~0.3-1.0 s wall and ~0.3-0.8 k planned input tokens; plus one auth check per session (cached). No dollar figure can be produced from this run (no receipt, F2-06); the smoke budget for S1 on this repository is bounded by the rarity of flagged saves (census: 2 below-50 events in committed text, both without alternatives). The cost that actually decides the design is latency on a save, not tokens.
[SOURCE: F2-04, F2-05, F2-06; 022 implementation summary]

**F5-08 [DERIVED] The pre-default-on checklist.**
1. Rebuild the corpus from real transcripts (T1) and adjudicate discordant labels (T2).
2. Rerun the frozen keep rule and require a keep on that corpus; publish the discordant-pair count and an interval, not only p (T5).
3. Add negative controls (T6) and one inter-run repetition (T7).
4. Add consent storage, timeout cap, kill switch, no-hard-block-override policy, and the save-flow call log (F5-04).
5. Shadow S1 for a measurable window and census fires, picks, and operator acceptance.
6. Only then decide on S2; S3 requires its own decision record and a tougher bar.
Until 1-5 are done, a default-on arm would be a policy change justified by a fixture, against 047 D6 ("No Jev arm joins a default path"), which is an amendment, not an implementation detail.
[SOURCE: F5-04, F5-05; 047/goal.md D6]

## Ruled out

- **Default-on as the immediate next step**: the evidence chain ends at a built fixture with a dead target column and a delegated-arbiter label set; the honest next move is S1 behind a flag plus the T1/T2 corpus work.
- **Hard-block override by model pick**: rejected on policy, not on accuracy. [SOURCE: alignment-validator.ts:552-556, :593-595]

## Next focus

Synthesis -- merge Q1-Q5 into research.md with the convergence report, divergence map and eliminated alternatives.
