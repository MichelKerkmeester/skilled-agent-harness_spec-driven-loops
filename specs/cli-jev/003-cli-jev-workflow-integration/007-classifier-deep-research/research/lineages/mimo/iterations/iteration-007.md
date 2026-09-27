# Iteration 007 — mimo-07: The operator's view of two backends, and one measured workflow

- **Angle:** mimo-07 (W3, maps to G, A)
- **Lens:** UX and measurement. W3 rule in force: every proposed skill/command/hook/workflow
  carries a metric, a counted baseline and a harness, or is recorded unmeasured.
- **Read first:** `steer.md` unchanged. `LOCAL:55-70` re-read (the operator commands table and
  the health rule). `.skilled/commands/doctor/` read (router with `_routes.yaml`, targets `mcp`,
  `speckit`, `update`; `/doctor <target>` dispatches subsystem diagnostics — `doctor/speckit.md:1-6`).
  The jev skill's activation slice is `references/cli-reference.md` + `references/integration-patterns.md`
  (`JEV/cli-usage/SKILL.md:118-119`).
- **Sibling check (W3 contract, newest of each read first):** `grok/iterations/iteration-010.md`
  (10), `deepseek/iterations/iteration-010.md` (10), `glm/iterations/iteration-005.md` (5) — all
  read in earlier iterations and unchanged; `swe/iterations/iteration-010.md` (10, NEW, read this
  iteration). Hub-and-gate material read across the run: deepseek-10 F2/F4 (the gate text and
  hub order), glm-05 row 77 (minting the hub now is a drop), swe-10 (the census-first PR shape).

## Finding 1 — what the operator types today (Q1)

**Deem (from `LOCAL:55-70`, the orchestrator's tested record):**

| Task | Command |
|---|---|
| Start | `deem-ctl start` (waits for `/health`) |
| Check | `deem-ctl status` (health + model and source commits) |
| Check release | `deem-ctl update --check` |
| Update | `deem-ctl update` (downloads beside live, switches `models/current`, restarts, requires one passing `choice`, rolls back on failure with exit 3) |
| Roll back | implicit in `update` failure (exit 3 restores previous) |
| Stop | `deem-ctl stop` |
| Remove | `rm -rf ~/.local/share/deem` |

The health rule parses `backend` and refuses `stub` (LOCAL's record; ALL-4). The served identity
is model `deem-0.8-v1` at commit `8cbabbb…` on the Python server (`deem-local.md:20-26`).

**Jev (the contract's availability checks):** `command -v jev`, `jev --version` (`jev 0.6.2`),
`jev auth status --provider <p>` — three checks, one line each.

**"Which backend and which model commit did feature X use?" — no surface exists today.**
Confirmed by absence: features are all Planned, and deepseek-10's F2 amendment text (theirs)
requires "record backend + commit" but nothing prints it. This is the one operator question with
no answer today.

## Finding 2 — where the status should print (Q2)

**Nowhere until asked: a `/doctor:classifier` target.** Reasoning from counts: the fleet runs
~167 human prompts/day (`results-mimo-01.txt:45` over 40 days); a session line would print
~4,700 times/week of information the operator needs only when a feature misbehaves or an update
lands. A doctor target matches the existing router (`/doctor <target>` subsystem dispatch,
`doctor/speckit.md:1-6`) and the doctor family already owns `update.md` (the update surface). The
contract (what it prints, in order):

1. Jev: per provider, the three D5 checks with exit codes.
2. Deem: `GET /health` result parsed — `backend` (refuse `stub`), `model`, model commit and
   source commit pair (the pair deepseek-02/10 require, theirs).
3. Per feature switch: enabled/dormant and, from its record, the last backend and commit used.
4. With neither backend: one line `no classifier backend available` and exit 0.

## Finding 3 — one measured workflow from the sibling proposals (Q3)

**Picked: N-glm-03-1, the stage-2 deterministic router replay** (glm's proposal), because it is
the sibling workflow whose baseline I counted myself:

| W3 element | Value |
|---|---|
| Metric | skill/reference load bytes per 40 days and leaf re-scoring events |
| Counted baseline | 8,413 loads / 36,015,038 bytes per 40 days (mine: `results-mimo-04-buckets.txt:49`, `:56`), against a p50 384,219-token carry (`results-mimo-01-recount.txt:10`) |
| Harness | `count-context-baseline2.py` + `count-output-buckets.py` re-run per change (both in this lineage) |
| Operator-visible change | silent by default; `route: stage-2 replay (deterministic)` under `--verbose` |
| Measured-value claim | the model's re-scoring of 617-1,641-line leaves (swe-003's count, via glm-03) stops happening on routed turns; the load bytes stop entering the carry on those turns |

Runner-up recorded, not picked: swe-10's `score-jev-tiebreak.mjs` census slice (their metric
holdout top-1 53/70 under pinned env; their harness `score-jev-tiebreak.vitest.ts` + stub-jev
audit). It measures the advisor seam; the replay measures the context seam this lineage owns.

## Finding 4 — operator labor to adopt (Q4)

- **The replay:** the operator reviews one pinned stage-2 block per router (six `ROUTER.md`
  leaves, 1,572 lines total — my count from iteration 1) and approves the pinning ceremony once:
  **~30 min** (estimate). Authoring is dev work (not operator labor).
- **`/doctor:classifier`:** **~5 min** to learn; it is one command.
- **The swe-10 census:** **0 min** — it is `node score-jev-tiebreak.mjs` and a report (their
  observable check).
- For comparison, the labeling workloads the judged features need are 3.5-5 h each (mimo-02,
  mimo-05) — the measurement-first options are an order of magnitude cheaper in operator time.

## Finding 5 — the default for each switch (Q5)

| Switch | Default | With neither backend |
|---|---|---|
| Feature switches (`--keep-rule`, `--jev`, `--deem`, `--cite-backend`, `--output-prune`) | **off** (two-backend gate; parent D1) | dormant; behavior exactly as today |
| Zero-call fixes (stage-2 replay, read-ledger, retention cap) | **on** — no backend needed, no gate applies | unchanged (they never call anything) |
| `/doctor:classifier` | prints only when typed | prints `no classifier backend available` |
| Thresholds on probabilities | **none** until a calibration file names the served commit (LOCAL:27; grok-01's rule via grok-10) | n/a |

## Per-idea record

### N-mimo-07-1 — `/doctor:classifier` two-backend status target

| Field | Content |
|---|---|
| **Idea** | `N-mimo-07-1`: a doctor target printing both backends' availability, Deem's commit pair, and per-feature last-use records. Type: none (report) |
| **Question** | G, A |
| **Builds on** | new; deepseek-10 F2's record rule (theirs) and LOCAL:55-70 |
| **Value** | The operator answers "which backend ran X, at which commit" in one command — today unanswerable (Finding 1) |
| **Seam** | `.skilled/commands/doctor/` router (`_routes.yaml`, the `speckit.md:1-6` dispatch pattern) |
| **Metric, baseline, harness** | time-to-answer the last-use question; baseline: no surface exists (confirmed by absence); harness = a doctor output fixture with a stub backend and a stub `jev` |
| **Savings** | unmeasured as tokens; it removes one whole class of "ask the AI what happened" turns (each ~98 s, `results-mimo-04.txt:8`) — count UNKNOWN |
| **Cost, latency, privacy** | zero model calls; probes are local processes; the Deem probe is the one ALL-3 exposure touchpoint (localhost, CORS `*`) |
| **Two-backend gate** | the target IS the gate's display; it prints each failure as its own line per deepseek-10 F2's skip-line rule (theirs) |
| **Rough LOC** | ~80-150 command + fixture |
| **Verdict** | **next** — it is the hub phase's operator surface; building it before any feature has run means printing empty records |
| **Confidence** | the missing surface is confirmed by absence; the design is judgment — what would confirm it: one operator session watching them ask the question |

## New against baseline

| Claim | Status | Evidence |
|---|---|---|
| "Which backend and commit did feature X use" has no surface today | new (confirmed by absence) | Finding 1 |
| Status should print on demand at `/doctor:classifier`, not per session (~4,700 prints/week avoided) | new (UX arithmetic) | Finding 2, `results-mimo-01.txt:45` |
| The stage-2 replay is the best-measured sibling workflow: 8,413 loads / 36.0 MB per 40 days | new (my counts backing glm's idea) | `results-mimo-04-buckets.txt:49,56` |
| Zero-call options cost ~0-30 operator minutes vs 3.5-5 h labeling for judged features | new | Finding 4 |
| Switch defaults: gated features off, zero-call fixes on, no thresholds pre-calibration | new (contract) | Finding 5 |

## Hand-off

- mimo-08 designs the validator-judgment labels; carry Finding 4's labor contrast into it.
- mimo-09/10: the order must put the three zero-call items before every judged feature; the
  doctor target lands with the hub phase, not before.
- The synthesis's operator section can use Findings 1, 2 and 5 verbatim as the two-backend UX
  contract.
