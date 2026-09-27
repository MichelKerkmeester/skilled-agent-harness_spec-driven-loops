# Deep Research Strategy — mimo lineage (UX and measurement)

## Topic

Where a classifier model, Jev hosted or Deem local, cuts the main AI's context and manual review
work in this repository — measured from the UX and measurement lens: what the operator sees, types
or decides differently, and the counted baseline of context tokens, AI passes and minutes every
claim is measured against.

## Key Questions

1. What is the main AI's counted context spend per turn (usage fields, tool calls, re-reads), and
   which single baseline number should every round-3 context-reduction claim be measured against?
   (mimo-01)
2. Which judgment calls does the AI still make after every validator passes, counted by category?
   (mimo-02)
3. How should Deem 0.8B be compared with Jev on the same judgments — sets, metric, power,
   calibration? (mimo-03)
4. What is the net savings arithmetic per reduction seam, both error directions counted?
   (mimo-04)
5. How often is sk-prompt run, and what does a run cost the main AI? (mimo-05)
6. What is sk-design's usage, routing accuracy and rubric labor? (mimo-06)
7. What does the operator see and type for two backends, and which one measured workflow proves
   the hub? (mimo-07)
8. What does a measured validator-judgment workflow cost in labels and labor? (mimo-08)
9. Which measurement comes first, what operator minutes does each phase need, and what is the
   order? (mimo-09)
10. What are the kill criteria as printed numbers? (mimo-10)

## Known Context

- BASE2 = `specs/cli-jev/003-cli-jev-workflow-integration/004-deep-research-expansion/research/research.md`
  (round-2 synthesis, R1-R22, What Not To Build rows 44-72). BASE1 =
  `specs/cli-jev/003-cli-jev-workflow-integration/001-deep-research/research/research.md` (rows 1-43).
- LOCAL = `context/deem-local.md`: served Deem 0.8B bf16 on MPS at `http://127.0.0.1:8300`,
  p50 about 60 ms per primitive, uncalibrated, quality unmeasured on this repository.
- Angles and per-iteration contract: `context/research-angles.md` (mimo-01..mimo-10, section 4
  contract, section 7 refinements ALL-1..ALL-8 and per-angle).
- Transcript corpus: `~/.claude/projects/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/`,
  usage deduped by `message.id`, main-session and subagent files apart, cut-off
  `2026-09-27T06:22Z`, numbers only (ALL-7).
- Six active `ROUTER.md` leaves: `sk-code`, `sk-doc`, `sk-design`, `mcp-tooling`,
  `system-deep-loop`, `cli-external-orchestration`.
- resource-map.md not present at the spec folder root; skipping coverage gate.

## Research Boundaries

- Read anywhere. Write only inside this lineage directory.
- No live `jev` call of either package; never call, start or download the Deem server or weights.
- Never open a `.env` file. Private transcripts give numbers and names only.
- Never run validators, tests, repository modules, eval scripts or installs; never run Deem code.
- No network calls, no git writes. Vendor figures stay labeled; `LOCAL` figures are the
  orchestrator's measurements of speed and memory, never quality.

## Non-Goals

- Building anything. Every recommendation stays a research finding.
- Redesigning `deem-ctl` or the update schedule; auditing them is deepseek-02/glm territory.
- Re-deriving orchestrator-confirmed facts; cite them as orchestrator-confirmed or by LOCAL line.

## Stop Conditions

- `config.stopPolicy: max-iterations` at 10 iterations. Convergence before the cap is telemetry
  only; broaden review angles instead of synthesizing early. Terminal synthesis record carries
  `stopReason: "maxIterationsReached"`.

## Exhausted Approaches

(Empty at init.)

## What Worked

- Iteration 1 (mimo-01): the counting harness `count-context-baseline.py` over the transcript
  corpus produced the round-3 measuring stick: carried context per assistant turn p50 384,219 /
  p95 887,519 cache-read tokens (66,498 unique messages). Numbers only, dedupe by message.id,
  cut-off applied.

## What Failed

- Iteration 1's Q2-Q4 tool counts were void (dedupe-by-message defect) and its hook claim was
  refuted; corrected in iteration 2 with `count-context-baseline2.py` into
  `results-mimo-01-recount.txt`. Phrase-walk category counting is an exhausted approach
  (BASE2 row 50's dead end, confirmed).

## Next Focus

- Loop complete at the cap (10/10). Synthesis written to `research.md` in this lineage;
  terminal record carries `stopReason: maxIterationsReached`.
