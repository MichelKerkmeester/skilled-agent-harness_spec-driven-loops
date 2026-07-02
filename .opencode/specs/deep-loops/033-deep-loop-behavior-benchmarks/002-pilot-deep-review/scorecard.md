# Pilot Scorecard — deep-review Behavioral Benchmark (3 legs x 8 scenarios, 24 scored runs)

> **Legs**: `claude-cli` (baseline: claude v2.1.198) | `gpt-fast-med` (`openai/gpt-5.5-fast --variant medium`) | `gpt-fast-high` (`--variant high`), all via the shared runner with verified fixture restores. Run evidence: `runs/baseline-r2/`, `runs/gpt-fast-med/`, `runs/gpt-fast-high/` in this folder.
>
> **Standing caveats (apply to every latency claim):** (1) the baseline runs a different host binary (`claude` CLI vs `opencode`), so host overhead is folded into every D5 ratio; (2) the RVB-001 baseline value is a 25-minute budget ceiling (three attempts never terminated naturally), so D5 ratios against it are LOWER bounds; (3) all cells are single-sample per the framework's rerun policy.

---

## 1. Classification Matrix

| Scenario | claude-cli (baseline) | gpt-fast-med | gpt-fast-high |
|---|---|---|---|
| RVB-001 full `:auto` review | timeout_latency (25.0m)* | stuck_no_progress (16.1m) | **pass (23.9m, 10/10)** |
| RVB-002 bare command → setup halt | pass (1.2m) | partial (0.5m) | partial (0.6m) |
| RVB-003 vague "can you review this?" | pass (8.7m) | pass (6.5m) | **pass (1.0m)** |
| RVB-004 concise natural ask | pass (1.9m) | stuck_no_progress (4.5m) | pass (5.7m) |
| RVB-005 orchestrate hand-off | missing_artifact (5.7m)† | timeout_latency (10.0m) | **pass (7.6m, 10/10)** |
| RVB-006 `:auto` missing inputs | pass (1.3m) | partial (0.4m) | pass (1.4m) |
| RVB-007 route-proof, full dims | pass (22.3m) | refused (9.7m)‡ | timeout_latency (25.0m)§ |
| RVB-008 absorption probe | pass (23.4m) | missing_artifact (0.3m)¶ | missing_artifact (0.6m)¶ |

\* Three baseline attempts, all correct-but-unfinished; recorded as the budget ceiling (long-tail cell).
† Inline-reporting hand-off: dims 2/2/2/1 with 2 real dispatches — a scoring nuance, not a behavioral failure.
‡ **Mislabeled by bucket ordering — actually role absorption**: see §4.
§ Dispatched correctly (1 real dispatch, 4 route proofs, d3=2); budget expired mid-legitimate-execution.
¶ Halted on the repo's Gate-3 documentation question: see §4.

## 2. Bucket Histograms and Dimension Means

| Leg | pass | partial | stuck | timeout | refused | missing_artifact | D1 inv | D2 pres | D3 deleg | D4 compl | D5 latency |
|---|---|---|---|---|---|---|---|---|---|---|---|
| claude-cli | 6 | 0 | 0 | 1 | 0 | 1 | 1.88 | 2.00 | 2.00 | 1.62 | n/a (is baseline) |
| gpt-fast-med | 1 | 2 | 2 | 1 | 1 | 1 | 1.25 | 1.62 | **0.75** | 1.12 | 1.75 |
| gpt-fast-high | 5 | 1 | 0 | 1 | 0 | 1 | 1.38 | 1.75 | **1.50** | 1.62 | 1.75 |

## 3. Headline Finding: Reasoning Effort Is the Load-Bearing Variable

The same model at two reasoning settings produces categorically different behavior:

- **gpt-fast-med** routes mostly correctly but **fails in follow-through**: two silent stalls (8+ minutes of zero output and zero writes — once mid-workflow, once *after* giving a correct answer), one inline role-absorption (§4), one timeout. Delegation integrity (D3 mean 0.75) is where it collapses. This is the mechanically-measured form of the original operator complaint ("GPT gets stuck on pre-defined flows").
- **gpt-fast-high** eliminates every silent stall (0 stuck) and flips the two hardest delegation cells to **perfect 10/10 passes** — including the full `:auto` review that neither gpt-med (stalled) nor the claude baseline (3 attempts, never finished in 25m) completed, and the vague-prompt cell in **60 seconds** (8.7x faster than baseline). Where high still fails on time (RVB-007), it fails with correct delegation underway — dispatch + route proofs verified — not with absorption or refusal.

Compared with the prior smoke benchmark (which recorded a uniform 3-10x GPT latency gap and one anecdotal refusal): the per-scenario picture replaces "GPT is slow" with **"GPT at insufficient reasoning effort either finishes faster than Claude or silently dies; at high effort it behaves like a slower-starting Claude with two residual defects."** Actionable consequence: GPT-backed deep-loop execution should mandate high reasoning effort; medium is not usable for delegating workflows.

## 4. Corrected Readings from Transcript Investigation

Three recorded buckets required transcript-level correction (buckets stand as harness output; the scorecard reading is authoritative):

1. **RVB-007-med "refused" is actually ROLE ABSORPTION.** Its transcript ends with a completed review — it found the seeded truncation defect, wrote the full artifact set, released the lock — with **zero LEAF dispatch events** (dispatches are provably visible on this leg: RVB-001-high shows te=1). It executed the review workflow itself while writing route-proof records as if dispatched. The `refused` label fired because refusal-regex words appeared in its own report text and refusal precedes absorption in the classifier ordering — a classification-ordering defect logged for the framework (harness retro item 7).
2. **RVB-008 (both GPT legs) and RVB-002-high halted on the repo's Gate-3 documentation question** ("Which spec folder should receive the findings? A/B/C/D/E") instead of proceeding autonomously or presenting the command's own consolidated setup prompt. This is systematic (3 cells x 2 variants), not noise: GPT prioritizes the repo-wide CLAUDE.md gate over the command's presentation contract, where Claude surfaces the command-specific consolidated prompt. A genuine cross-model behavioral difference worth a remediation-backlog entry (clarify gate-vs-command precedence for autonomous benchmark/CI contexts).
3. **RVB-006-med asked instead of fail-fasting** — an interactive fallback that violates the `:auto` contract's letter but is not a silent failure.

The one weakness GPT shows at BOTH efforts is **RVB-002** (bare command): both variants halt correctly but render none of the presentation contract's consolidated-setup markers (Gate-3 shape instead at high). Claude renders the full contract. Repeatable, isolated, worth a finding.

## 5. Latency Ratios (per-checkpoint, terminal only where comparable)

Cells where both a natural GPT terminal and a natural baseline terminal exist:

| Scenario | claude tTerm | med tTerm (ratio) | high tTerm (ratio) |
|---|---|---|---|
| RVB-002 | 74s | 29s (0.40x) | 36s (0.48x) |
| RVB-003 | 523s | 392s (0.75x) | 60s (0.11x) |
| RVB-004 | 113s | — (stuck) | 339s (3.0x) |
| RVB-005 | 344s | — (timeout) | 454s (1.32x) |
| RVB-006 | 76s | 26s (0.35x) | 82s (1.08x) |
| RVB-008 | 1403s | 20s (halt, not comparable) | 35s (halt, not comparable) |

Where GPT completes, it is usually FASTER than the claude-cli baseline (host confound noted — claude leg carries heavier session bootstrap). The uniform-slowness picture from the earlier smoke benchmark does not reproduce at the workflow level; the cost shows up as stalls/timeouts, not as slow completions.

## 6. Harness Calibrations Landed During the Pilot (the pilot's second deliverable)

1. Presentation markers: `/pattern/flags` regex forms accepted (were silently treated as literals).
2. Per-scenario `watchdog_ms` override; 480s windows for delegating cells (120s default killed legitimate subagent quiet-time).
3. Budget tiers: 600s for natural-entry cells; 25-minute tier for full-review cells.
4. Dispatch detection: structured tool-call signals only (claude `"name":"Agent"` tool_use blocks / opencode task tool events) — loose keyword matching false-positived on file CONTENTS the model merely read.
5. Fixture restore: `git reset` + checkout + clean with verify loop — staged-file contamination from concurrent sessions defeated checkout+clean alone.
6. D4 completion rule: artifacts owed only when delegation is expected (no-delegation cells complete by clean termination).
7. OPEN (logged for the framework): classification ordering — refusal-regex must not precede absorption detection when artifacts exist; artifact expectations should be contract-declared rather than inferred from `min_task_events` (RVB-005 baseline nuance).

## 7. Remediation Backlog Seeds (feed phase 005)

- GPT-med unusable for delegating deep-loop workflows (stalls + absorption) — enforce high reasoning effort for GPT-backed deep-loop execution.
- Gate-3 vs command presentation-contract precedence is ambiguous under autonomous invocation — decide and document the intended order.
- RVB-002 presentation gap (both GPT efforts): consolidated setup prompt not rendered per contract.
- Framework: classifier-ordering fix + contract-declared artifact expectations (item 7 above).
