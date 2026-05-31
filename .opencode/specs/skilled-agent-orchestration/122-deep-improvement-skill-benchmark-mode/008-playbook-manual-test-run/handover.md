# Handover — Execute the deep-improvement Manual Testing Playbook (all 48 scenarios)

> **For a fresh agent session.** Mission: run **every** scenario in the
> `deep-improvement` manual testing playbook **for real** in a sandbox, capture
> evidence, and record a PASS / FAIL / SKIP verdict per scenario + a release
> readiness roll-up. Read this top-to-bottom before running anything.

Repo root (the working directory for almost everything):
`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`

Playbook root:
`.opencode/skills/deep-improvement/manual_testing_playbook/`
Landing/index (READ FIRST — it is the contract):
`.opencode/skills/deep-improvement/manual_testing_playbook/manual_testing_playbook.md`

---

## 0. THE GOLDEN RULES (do not violate)

1. **The per-scenario file is the source of truth.** Each scenario `.md` carries
   an exact, runnable command sequence (a 9-column table row, and for the CP
   stress tests an "Exact Runnable Command Sequence" bash block) plus an
   "Expected signals" / "Pass/fail" contract. RUN WHAT THE FILE SAYS. Do not
   improvise commands from memory.
2. **Execute for real.** The landing's EXECUTION POLICY is binding: no mocking,
   no stubbing, no "unautomatable". The only verdicts are **PASS**, **FAIL**, or
   **SKIP (with a specific sandbox blocker documented)**.
3. **Everything writes to `/tmp`.** Scenarios use disposable `/tmp/...` paths.
   The repo must not be mutated by a test. After dispatch scenarios, confirm the
   repo is unchanged (see the tripwire note in §5).
4. **Never `git add -A`.** If you record results into the repo, stage only your
   results folder by explicit pathspec. A background daemon constantly rewrites
   `graph-metadata.json` across `.opencode/specs/**` — that is NOT your change.
5. **`opencode run` needs `</dev/null`.** Any non-interactive `opencode run`
   dispatch hangs without it. The CP scenario command blocks already include it —
   keep it.
6. **Single-dispatch discipline for model runs.** For scenarios that call
   `opencode run` (the CP stress tests, possibly some E2E), run ONE dispatch at a
   time, wait for it to return, verify, then `pkill -9 -f "opencode run"` before
   the next. Do NOT auto-kill an operator's own interactive opencode/TUI session.
7. **Bash stdout can be unreliable in this environment** (concurrent sessions +
   the daemon). Write command output to a uniquely-named `/tmp` file and read it
   back; treat blank output as "unknown", not "pass". Re-verify on disk.

---

## 1. SCENARIO MAP (48 scenarios, 10 categories, 3 lanes)

IDs are now contiguous and `file number == feature_id number` (001–048). "Engine"
tells you the heaviest thing the scenario needs.

| Cat dir | IDs | Lane | Count | Engine | Notes |
|---|---|---|---|---|---|
| `01--integration-scanner` | IS-001..004 | A | 4 | pure node | `scan-integration.cjs`; one missing-agent + one --output-file case |
| `02--profile-generator` | PG-005..008 | A | 4 | pure node | `generate-profile.cjs`; rules/checks extraction + --output |
| `03--5d-scorer` | 5D-009..011 | Shared | 3 | pure node | `score-candidate.cjs`; incl. missing-candidate infra_failure |
| `04--benchmark-integration` | BI-012..013 | Shared | 2 | pure node | `run-benchmark.cjs` with/without --integration-report |
| `05--reducer-dimensions` | RD-014..016 | Shared | 3 | pure node | `reduce-state.cjs`; dashboard + plateau detection |
| `06--end-to-end-loop` | E2E-017..021 | A | 5 | **may dispatch** | full loop; candidate-gen step may invoke `@deep-improvement`. Read each file — some steps need a model dispatch, others are node-only graph/lineage checks |
| `07--runtime-truth` | RT-022..031 | A | 10 | pure node | journal/reducer/coverage/stability/trade-off helpers + 1 YAML-wiring grep |
| `08--agent-discipline-stress-tests` | CP-032..037 | A | 6 | **model dispatch** | SANDBOXED; each = 2 `opencode run` calls (generic vs disciplined) seeded by `setup-cp-sandbox.sh`; ~4–6 min each |
| `09--model-benchmark-mode` | MB-038..042 | B | 5 | pure node | `loop-host --mode=model-benchmark` + `run-benchmark.cjs`; default noop grader = deterministic |
| `10--skill-benchmark` | SB-043..048 | C | 6 | pure node | `run-skill-benchmark.cjs` etc.; Mode A router-replay is deterministic, no LLM |

**~39 scenarios are pure-node deterministic** (fast, safe, no model). **The 6 CP
stress tests need real model dispatch** and are the slow/heavy wave; **some E2E
(06) may need a dispatch** for the candidate-generation step — check each file.

---

## 2. PREREQUISITES (run once, cache the result)

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
node --version            # scenarios run .cjs via node
git rev-parse --short HEAD   # record the commit you tested against
```
For the model-dispatch scenarios (CP + any E2E that dispatches), pre-flight the
provider once (the CP command blocks use `deepseek/deepseek-v4-pro`):
```bash
opencode providers list 2>&1 | grep -iE 'deepseek|opencode-go|openai'
```
If the model the scenario names is not configured, do NOT silently substitute —
record those scenarios as **SKIP (provider not configured)** and tell the
operator, or ask which model to use.

---

## 3. GATE 3 — WHERE RESULTS GO

This run produces files (results matrix + evidence), so it needs a spec-folder
home. Use **this packet** (it was created for the run):
`.opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/008-playbook-manual-test-run/`

- Write the verdict matrix to `008-.../results-matrix.md` (template in §7).
- Keep raw transcripts/artifacts under `/tmp` during the run; copy only the
  decisive excerpts into the results doc (per the playbook's evidence rules).
- When done, formalize the packet if needed (`spec.md` + run
  `generate-context.js`) and commit results by explicit pathspec, then push.

---

## 4. EXECUTION PROTOCOL (per scenario)

For each scenario file, in category order:

1. **Open the file** (e.g. `01--integration-scanner/001-scan-known-agent.md`).
2. Read its `## 2. SCENARIO CONTRACT` (Objective, Prompt, Expected signals,
   Pass/fail) and `## 3. TEST EXECUTION`.
3. **Resolve placeholders** (e.g. `{spec}`) to disposable `/tmp` paths.
4. **Run the exact command sequence** from the file's 9-column table "Exact
   Command Sequence" cell (or the CP files' "Exact Runnable Command Sequence"
   bash block). Capture: stdout, stderr, **exit code**, and any generated files.
   - Tip: append `; echo "EXIT=$?"` and/or `| tee /tmp/<id>-out.txt`.
5. **Run the verification block** from the SAME file against the SAME artifacts.
6. **Compare to "Expected signals" + "Pass/fail"** and assign a verdict:
   - `PASS` — all acceptance checks true.
   - `PARTIAL` — core behavior works, non-critical evidence/metadata incomplete.
   - `FAIL` — expected behavior missing / contradictory output / critical check failed.
   - `SKIP` — only with a concrete sandbox blocker (e.g. provider not configured),
     documented.
7. **Record** the verdict + 1 decisive evidence line + the failing-check (if any)
   into `results-matrix.md`.

Cleanup between scenarios: remove the scenario's `/tmp/<id>*` dirs so runs do not
contaminate each other.

---

## 5. CATEGORY-SPECIFIC RUNBOOK NOTES

- **01–05, 07, 09, 10 (pure node):** straightforward `node .../scripts/.../<x>.cjs
  --flags ...`. Fast. Each file's command is self-contained. 09 (MB) needs
  `--profile` + `--outputs-dir`; the file supplies the shipped default profile
  path. 10 (SB) is deterministic Mode A — no model, no advisor (D1-inter/D4 come
  back `unscored`, which is the EXPECTED signal, not a failure).
- **06 end-to-end-loop:** the full `/deep:start-agent-improvement-loop` pipeline.
  The candidate-generation step normally dispatches `@deep-improvement`. Read each
  E2E file: graph/lineage/coverage assertions (022/024-era content) can be checked
  on node-produced artifacts, but a true end-to-end run (017 full-pipeline) needs
  a model dispatch. If a dispatch is required and the provider is available, run
  it under single-dispatch discipline; otherwise SKIP-with-reason.
- **08 agent-discipline-stress-tests (CP-032..037) — the heavy wave:**
  - Seed the sandbox with the helper FIRST:
    `.../08--agent-discipline-stress-tests/setup-cp-sandbox.sh --sandbox-dir /tmp/cp-<id>-sandbox`
  - Each scenario runs **two** `opencode run` calls (Call A = generic `As @Task:`,
    Call B = disciplined `/deep:start-agent-improvement-loop`), with a sandbox
    reset between them. Commands are in the file's bash block — run them verbatim
    (they already include `</dev/null` and `--dir /tmp/cp-<id>-sandbox`).
  - These are RM-8 destructive-scope-sensitive: they use
    `--dangerously-skip-permissions` against a `/tmp` sandbox. Confirm `--dir`
    points at the `/tmp` sandbox (never the repo) before running.
  - **Tripwire caveat (IMPORTANT):** the CP files check a "project tripwire" =
    `git status --porcelain` diff before/after, expecting it empty. In THIS
    environment a background daemon rewrites `graph-metadata.json` under
    `.opencode/specs/**` constantly, so a naive whole-repo tripwire will show
    noise and false-FAIL. Scope the tripwire to the deep-improvement skill +
    sandbox, or diff-filter out `*/graph-metadata.json`, before judging. A real
    failure is a change to `.opencode/skills/deep-improvement/agents/**` or the
    canonical target — not daemon metadata churn.
  - Slow: ~4–6 min each, sequential. Budget ~30–40 min for the CP wave alone.

---

## 6. RECOMMENDED WAVE ORDER

1. **Wave 1 — deterministic core (fast):** 01, 02, 03, 04, 05, 07, 09, 10
   (≈36 scenarios, pure node). Knock these out first; they need no model.
2. **Wave 2 — end-to-end (06):** run the node-checkable parts; dispatch the
   full-pipeline ones if a provider is available.
3. **Wave 3 — CP stress tests (08):** last, sequentially, single-dispatch, with
   the scoped tripwire. Slowest + highest-risk.

Stop-and-report if Wave 1 shows systemic FAILs (e.g. a script errors on every
scenario) — that's a real regression, not a per-scenario issue.

---

## 7. RESULTS MATRIX TEMPLATE (`008-.../results-matrix.md`)

```markdown
# deep-improvement Playbook — Manual Test Run

- Date: <YYYY-MM-DD>
- Commit tested: <git short sha>
- Runner: <session/agent id>
- Provider used for dispatch scenarios: <model or "n/a">

| ID | Scenario | Lane | Verdict | Exit | Decisive evidence / failing check |
|---|---|---|---|---|---|
| IS-001 | Scan Known Agent | A | PASS | 0 | status:"complete", 20+ surfaces, mirrors aligned |
| ... | ... | ... | ... | ... | ... |
| SB-048 | Dual report + remediation | C | PASS | 0 | report.json + .md emitted; re-render byte-identical |

## Roll-up
- PASS: NN / 48   PARTIAL: NN   FAIL: NN   SKIP: NN
- Per-lane: A __/__  B __/__  C __/__  Shared __/__
- Release readiness (per landing §5): READY / NOT READY — reason

## FAIL / SKIP details
- <ID>: <what failed, decisive output excerpt, triage step taken>
```

---

## 8. RELEASE-READINESS (from the landing's REVIEW PROTOCOL)

Release is READY only when: no feature verdict is FAIL; the closure-wave
scenarios (RT-022..031, CP-032..037, MB-038..042, SB-043..048) are all executed
or explicitly SKIP-with-blocker; coverage == 48/48; no unresolved blocking
triage item. Report READY/NOT-READY with the decisive reason.

---

## 9. CONTEXT YOU MAY WANT (not required to run)

- The playbook + feature_catalog were just re-architected to cover all 3 lanes
  (A: agent-improvement, B: model-benchmark, C: skill-benchmark) and the scenario
  IDs were renumbered contiguously to 001–048. History: packet 122 child
  `007-deep-improvement-3lane-doc-rebuild` (see its `handover.md`).
- Skill source under test: `.opencode/skills/deep-improvement/scripts/{agent-improvement,model-benchmark,skill-benchmark,shared}/*.cjs`.
- Automated regression tests (complementary, fast sanity): `scripts/tests/*.vitest.ts`
  — run these first if you want a quick "is the skill even healthy" signal before
  the manual scenarios.
- Environment hazards this week: multiple concurrent `claude` sessions + a
  graph-metadata daemon → noisy `git status`, occasionally laggy tool output.
  Prefer `/tmp`-file capture + read-back; commit results by explicit pathspec.
