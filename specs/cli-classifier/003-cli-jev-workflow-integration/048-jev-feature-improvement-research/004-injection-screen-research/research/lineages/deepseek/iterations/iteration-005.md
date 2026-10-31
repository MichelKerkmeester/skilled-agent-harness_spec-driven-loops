# Iteration 5: What a Default-On Integration Would Need, Cost and Risk

## Focus

Turn the measured behavior into an integration shape: seam and capability, decision tiers, per-fetch
cost, failure modes, and the risks a default-on screen carries.

## Findings

1. **The only candidate seam is a PostToolUse matcher for `WebFetch|WebSearch`, and the capability
   question decides the integration shape.** The settings file already runs command hooks on tool
   results (Bash PostToolUse at `.claude/settings.json:210-215`, timeout 5 s; Write|Edit at
   `:198-208`), and every existing hook posts back through `hookSpecificOutput` with
   `additionalContext`, which is exactly an advisory channel. Whether a PostToolUse hook can warn
   *before* the agent acts on the output, or withhold the output, remains UNKNOWN and is recorded
   as the open question in feature 035 [SOURCE: `.claude/settings.json`; 035 spec Open Questions].
   A default-on design should therefore assume advisory first: inject a review note with the
   probability, and treat blocking as a capability to verify, not a given.

2. **The tiered operating points are measured, and a block tier exists with zero false positives on
   this run.** Modal thresholds over the recorded calls: at `0.25`, 40 flags = 33 true + 7 false
   (recall 94.3%, precision 82.5%); at `0.5`, 36 = 31 + 5 (88.6%/86.1%); at `0.75`, 26 = 26 + 0
   (recall 74.3%, precision 100%) [derived from `calls.jsonl`; `report.json flagCounts
   review=40/flag=36/block=26`; thresholds at `score-injection-screen.mjs:53-55,822-824`]. A
   default-on policy can map the tiers directly: remark at the review line, block only at the block
   line, and quote both numbers. The caveat is that these curves come from three reruns per row;
   a single-call hook has a different operating curve and must be re-measured before default-on.

3. **The per-fetch cost is bounded and small at fetch volume: about a third of a second per call.**
   The recorded run: p50 324 ms, p95 388 ms, max 561 ms per call
   [SOURCE: `~/.skilled/.labels/runs/035-jev-20261001/report.json columns.jev.latency`]. One call
   per fetched section plus one auth call per process; the three-rerun protocol would add about a
   second per section, and the measured early-exit protocol (iteration 2) lands near two calls.
   Payload is one section of 5-60 lines; the run's pre-call estimate was 62,439 input tokens for 90
   sections (about 694 tokens per section) [SOURCE: `035-jev.stdout.txt`, `score-injection-screen.mjs:1048-1052`].
   Real fetched pages are longer than a vendored section, so a hook needs a byte cap and its own
   measurement on real fetch output, which feature 035 lists as a transfer risk.

4. **The availability chain is three silent skips and a retry, and a default-on screen must say
   what it does when the screen is absent.** The arm runs only if `jev` resolves on PATH, prints
   exactly `jev 0.6.2`, and `jev auth status --provider P` exits 0; otherwise it prints a skip line
   and exits 0 `[score-injection-screen.mjs:979-1012]`. Exit 4 gets one retry, 2 s backoff; key
   rejection, usage errors and interrupts stop the arm and print partial rows
   `[score-injection-screen.mjs:1127-1131,1152-1157]`. Model drift is detectable only against a
   stored report (`requalify: model changed`, `:1178-1183`), so a hook should log the model on every
   call and alert when it changes, rather than trust the version pin alone.

5. **The risk ledger, with the numbers this run supports.** False positives: 5 of 55 clean sections
   at 0.5 (9.1%), 7 at the review line (12.7%), all within 0.15 of the line (iteration 1); harmful
   only if the screen blocks, tolerable if it remarks. False negatives: 4 of 35 instructs (11.4%),
   including reporting-redirection attacks (`r62`, `r63`, `r86`) that a naive hook would pass
   silently (iterations 1-2). Verdict fragility: precision passed by 11 points of slack, three
   false positives from `kill` (iteration 2), so a default-on policy should not present the keep as
   a wide margin. Privacy: the payload leaves the machine; the measured run sent public vendored
   text, but a real fetch can be an authenticated page, which feature 035 lists as an open question
   needing a payload-acceptance gate [SOURCE: 035 spec Open Questions]. Supply chain: a hosted
   provider behind a pinned CLI version plus a credential.

6. **The cheapest first step is the extended lexical floor, and the second step is advisory Jev.**
   The current four patterns catch 1 of 30 planted sentences; the measured extension candidates
   catch 9 of 30 at zero latency and zero cost (iteration 2), which is a floor a hook can run
   unconditionally. Jev then covers the remainder and the natural positives. A staged plan:
   (i) verify the PostToolUse fetch-hook capability; (ii) re-measure on real fetch output under the
   same keep rule, with `labelsSha256` and `plantedSha256` recorded in `report.json`
   (iteration 3); (iii) ship advisory review at 0.25 with a block tier at 0.75 if blocking exists;
   (iv) log payload bytes, model and verdict per call; (v) publish the skip behavior. Nothing here
   needs a new dependency beyond the Jev CLI the repository already uses.

## Sources Consulted

- `.claude/settings.json:88-95, 198-224`; `specs/cli-jev/003-cli-jev-workflow-integration/035-fetched-text-injection-screen/spec.md` (Open Questions, Risks)
- `~/.skilled/.labels/runs/035-jev-20261001/report.json`, `calls.jsonl`; `035-jev.stdout.txt`
- `.skilled/skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs:53-55, 979-1012, 1048-1052, 1127-1131, 1152-1157, 1178-1183`
- Iterations 1-4 of this lineage (tier composition, error rows, protocol costs, trust gaps)

## Assessment

- newInfoRatio: 0.78
- Novelty justification: The tier composition (0.75 blocks 26 with zero false positives), the hook
  capability constraint as the integration fork, the availability-chain behavior and the staged
  plan with the lexical floor are new; the iteration mostly synthesizes own prior findings plus the
  run's cost data.
- Confidence: High for the tier counts and cost numbers (recomputed from the recorded run). Medium
  for the advisory-vs-blocking assumption and the transfer to real fetch pages, which the hook
  capability check and a re-measurement would settle.

## Reflection

- What worked: Reading the hook definitions against the scorer's own threshold reporting produced a
  policy that uses numbers the measurement already prints.
- What failed: The capability question cannot be closed from the repository; it needs a live hook
  experiment, which is out of this research's scope.
- Ruled out: Default-on blocking at the decision line (FP noise and capability unknown); treating
  the version pin as drift protection (requalify needs a stored report).
