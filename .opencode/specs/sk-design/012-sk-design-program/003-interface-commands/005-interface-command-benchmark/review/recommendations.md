# Recommendations & Remaining-Work Synthesis

> Synthesized from the `/interface:*` benchmark (v1→v5: 4 build-parity rounds + 6 blind judge-configs across
> 3 judge families × 2 briefs) and the broader sk-design work shipped this session. Anchored in
> `review/review-report.md`.

## A. Benchmark-derived recommendations (actionable)

### A1. Command / product (small, evidence-backed)
- **P2 — Standardize the proof-tier rule for static computations** in
  `sk-design/shared/creation-contract.md`. A WCAG-contrast-from-hex value is a *deterministic static
  computation*, yet the benchmark caught mimo (v1, §V2) and LUNA (brief 2, §V4) labeling it `measured` /
  `validated` inconsistently. Decide + document one policy — **static computation = `validated`; reserve
  `measured`/`verified` for an actual runtime render** — so runs stop scoring it differently. This is the
  reviewer's P2, now confirmed as a real, recurring overclaim.
- **P2 — Reconcile the rubric's "artifact-first" dimension with the command's envelope-first §4 output
  order** (the two conflict; rename the dimension or move the machine envelope).
- **No change — keep the presentation-asset design.** Contract portability (all executors emitted all 8
  visible blocks across both briefs, even a raw codex port) is positive evidence that packet-009's
  presentation redesign works.

### A2. Executor / routing guidance (decision-grade)
- For live `/interface:design`: use **`deepseek-v4-pro`** (proof rigor + full state coverage) **or**
  **`gpt-5.6-luna`** (distinctive concept) — statistically-tied co-leaders (22.7 vs 22.6 over 6 judge-configs).
- **Avoid `mimo-v2.5-pro`** for this command — unanimously weakest across every judge family and both briefs.
- **Transport is not a quality lever.** The native cli-opencode path's value is *convenience* (it
  auto-resolves the dials), not a quality ceiling — a raw cli-codex port is co-top-tier.

### A3. Benchmark method (reusable lessons for any future model/command benchmark)
1. **Equalize prompts before comparing models** (dials, colorStrategy, proof ceiling). An asymmetric harness
   silently confounds model vs transport vs prompt — this was the v1 error.
2. **Never score design "taste" by keyword count.** The proxy was not just noisy but *inverted* the ranking.
   Use blind, rubric-scored judgment.
3. **Anonymize + shuffle + blind**, and use a **multi-judge, cross-family panel** — judge-family bias is
   real but bounded (it moves the #1/#2 order, never the tier).
4. **For close pairs, report the tier + task/judge dependence, not a forced single winner.**
5. Fully specify the brief (same problem for all legs) and run **≥2 diverse briefs** for generalization.

## B. Optimized remaining work (prioritized)

### B1. This benchmark packet — one P1 left
- **Within-model run-to-run variance** (n≥3 same config) is the only unmeasured axis. **Recommendation:
  skip** unless a decision hinges on deepseek-vs-luna — they are within 0.1/25, so repeats would almost
  certainly confirm "co-leaders, task-dependent." Optional extension: live runs of
  `foundations`/`motion`/`audit`.

### B2. Planned-but-unbuilt packets (authored + validated this session, NOT executed)
Three packets are fully planned (`validate --strict` Errors:0) and ready to build:

| Packet | Work | Risk | Notes |
|---|---|---|---|
| `sk-design/015/008-styles-readme-create-readme-alignment` (L3) | Expand the 12 sk-design READMEs to the create-readme standard | Low (docs only) | Independent; parallelizable (the operator asked for a parallel Opus agent) |
| `sk-design/015/009-manual-testing-playbook-and-db-readme` (phase parent + 2 L2) | Realign the playbook to create-manual-testing-playbook (out of `docs/`) + align `styles/database/README.md` | Low (docs only) | Independent; two clean children |
| `system-deep-loop/035/015-command-benchmark-cli-opencode-driver` (phase parent + 3 L2) | Add a cli-opencode driver leg to the command-surface behavior benchmark | Higher (touches shipped runtime) | **This benchmark validated the premise** — cli-opencode legs work, native path = convenience. Build on an isolated worktree |

### B3. Recommended execution order
1. **Parallel, low-risk first:** `015/008` (READMEs) and `015/009` (playbook + DB README) are independent
   doc work — run them concurrently (a parallel Opus agent per folder, as the operator preferred).
2. **Then the runtime-touching one:** `035/015` (cli-opencode driver leg) on an isolated git worktree,
   frozen legs held byte-stable — now well-motivated by this benchmark's finding that cli-opencode is a
   viable, quality-neutral transport.
3. **Fold A1 (proof-tier rule) into whichever sk-design touch comes first** — it is a one-line contract
   clarification.

## C. Bottom line

The benchmark is decision-grade and done (skip the variance P1 unless needed). The highest-leverage next
move is executing the three already-planned packets — two low-risk doc sweeps in parallel, then the
benchmark-driver runtime change on a worktree. The single cheap product fix worth folding in is the
proof-tier `validated`-vs-`measured` clarification in `creation-contract.md`.
