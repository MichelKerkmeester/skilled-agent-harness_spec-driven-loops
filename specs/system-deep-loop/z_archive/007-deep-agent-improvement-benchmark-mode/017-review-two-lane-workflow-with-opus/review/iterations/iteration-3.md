# Deep Review — Iteration 3

## Dimension

Traceability (D3). Second independent Opus 4.8 pass over the post-015 two-lane code. Goal: (a) confirm the 015 traceability/provenance remediations resolve to shipped code, (b) hunt NEW spec/doc-vs-code traceability gaps a different model surfaces, without re-reporting the prior materializer fixture-id traversal (`correctness-1-1`) or the bundle-gate criteria-exec gap (`security-2-1`).

## State Summary

- Target: two-lane program 008-013 post-remediation (files mode).
- Prior findings: P0=0 P1=2 (iter-1 materializer fixture-id traversal; iter-2 bundle-gate criteria-exec gap) P2=0.
- This round adds: 1 new P1 + 1 new P2 traceability finding, plus confirmations that the 015 provenance/history/mode-aware-record remediations and the advisor Lane B routing all resolve to shipped behavior.

## Files Reviewed

- `commands/deep/start-model-benchmark-loop.md:364-370,488-498` (Step-1 "Mode 4" pointer + Notes provenance/canonical-source pointer)
- `commands/deep/start-agent-improvement-loop.md:502-514` (Lane B section + canonical-source pointer)
- `skills/deep-agent-improvement/SKILL.md:216-281,337-348` (§3 LANE A "Mode 1/2/2A/3" headings, §4 LANE B, §7 Static Benchmark Assets)
- `commands/deep/assets/deep_start-model-benchmark-loop_auto.yaml:144-183` (step_run_benchmark, step_append_ledger ledger-ownership, step_report_status STATUS string)
- `scripts/shared/loop-host.cjs:130-169` (planInvocation forwarding, EC-5 ordering)
- `scripts/model-benchmark/run-benchmark.cjs:111-120,455-533` (inferStateLogPath, provenance, report-history snapshot, benchmark_run ledger row)
- `scripts/shared/materialize-benchmark-fixtures.cjs:80-99` (output path, fixtures-materialized status)
- `system-skill-advisor/.../lanes/explicit.ts:98,116-138,123-129` (Lane B phrase boosts + stale "single canonical node" comment)
- `system-skill-advisor/.../scorer/projection.ts:121-135` (deep-model-benchmark node)
- `system-skill-advisor/.../scorer/aliases.ts:27-37` (deep-model-benchmark alias group)
- `.opencode/specs/.../121-...-benchmark-mode/` (provenance packets 003/004/005/008)

## Findings by Severity

### P0

None.

### P1

**traceability-3-1 — Both Lane command docs cite a non-existent "Mode 4: Model-Benchmark" SKILL.md section as the canonical source of truth, and Step 1 routes the agent to "Focus on Mode 4".**

Evidence (what I saw):
- `start-model-benchmark-loop.md:370` — Workflow Step 1 reads `Read(".opencode/skills/deep-agent-improvement/SKILL.md")` then instructs: "Focus on **Mode 4: Model-Benchmark** for the canonical contract."
- `start-model-benchmark-loop.md:497` (Notes) — "Canonical source of truth: `.opencode/skills/deep-agent-improvement/SKILL.md` **'Mode 4: Model-Benchmark'**."
- `start-agent-improvement-loop.md:514` (Lane B section) — "Canonical source of truth: `.opencode/skills/deep-agent-improvement/SKILL.md` **'Mode 4: Model-Benchmark'**."
- `rg "^#" SKILL.md` shows the actual heading inventory: §3 `LANE A: AGENT-IMPROVEMENT` contains subheadings `Mode 1: Runtime Initialization`, `Mode 2: Proposal and Evaluation`, `Mode 2A`, `Mode 3: Promotion and Recovery`. The model-benchmark contract lives under §4 `LANE B: MODEL-BENCHMARK` (SKILL.md:271). There is **no** "Mode 4" heading anywhere in SKILL.md (`rg -n "Mode 4" SKILL.md` returns zero hits).
- The 121/009 packet ("skill-md-two-lane") and 121/010 reorg renamed the SKILL's model-benchmark content from a "Mode 4" structure into the "Lane A / Lane B" structure. The two command docs were not updated to follow the rename, so all three canonical-source pointers now dangle.

Impact: an agent following Step 1 literally (`Read SKILL.md` → "Focus on Mode 4: Model-Benchmark") cannot find the named anchor; the only correct contract section is §4 LANE B. This is a spec_code traceability break: the normative doc instruction does not resolve to a shipped anchor, and a stale "Mode 4: Model-Benchmark" label confusingly collides with the unrelated agent-improvement "Mode 1/2/3" headings that DO exist (under Lane A), so a reader could wrongly anchor on Lane A content. The agent-improvement command (the OTHER lane) is also affected — it points its own Lane B note at the same dead anchor.

Severity rationale: P1 not P2 because this is a workflow-step instruction (Step 1 of the executable command), not a passive footnote — it tells the orchestrating agent where the canonical contract is, and that pointer is wrong in the live command body for both lanes. It is a real defect (the named section does not exist), but it does not corrupt state or break the runtime loop (the YAML, not this prose, drives execution), so it is not P0.

Fix: replace all three "Mode 4: Model-Benchmark" references with "§4 LANE B: MODEL-BENCHMARK" (the real heading), or with a stable anchor. Update `start-model-benchmark-loop.md:370`, `start-model-benchmark-loop.md:497`, and `start-agent-improvement-loop.md:514`. Optionally add a doc-lint check that command-doc SKILL.md section pointers resolve to a real heading.

### P2

**traceability-3-2 — Stale code comment in `explicit.ts` claims the advisor projection exposes a "single canonical node (deep-agent-improvement)", but a second live node `deep-model-benchmark` now exists and is the actual boost target.**

Evidence (what I saw):
- `explicit.ts:123-129` comment block states: "The projection exposes a **single canonical node for that skill (deep-agent-improvement)**, so the disambiguation penalty must target that canonical id to actually lower the ranked Lane A candidate. The earlier alias-shaped target (command-spec-kit-deep-agent-improvement) is not a projection node, so it never reached the ranked skill and the penalty was inert."
- But `projection.ts:121-135` now defines a distinct `id: 'deep-model-benchmark'` node (`kind: command`, `lifecycleStatus: 'active'`), and `aliases.ts:33-37` defines a `deep-model-benchmark` alias group. The code on `explicit.ts:130-138` correctly targets `deep-model-benchmark` (e.g. `'benchmark a model': [['deep-model-benchmark', 1.6], ['deep-agent-improvement', -0.6]]`).
- So the code behavior is CORRECT (the positive boost lands on the real `deep-model-benchmark` node; the negative penalty correctly suppresses the Lane A `deep-agent-improvement` candidate). The defect is purely that the comment's projection model is stale: it describes a single-node world that no longer holds, which could mislead a future maintainer into believing the `deep-model-benchmark` boost is inert (the exact failure the comment warns about for a different target).

Severity rationale: P2 — this is a comment-vs-code traceability drift with no behavior impact. The routing works; the explanation lags the projection refactor.

Fix: update the `explicit.ts:123-129` comment to describe the current two-node projection (`deep-agent-improvement` for Lane A, `deep-model-benchmark` for the Lane B command), and note that the positive boost lands on `deep-model-benchmark` while the bounded penalty demotes the Lane A skill.

## Traceability Checks (spec_code / feature_catalog_code / playbook_capability)

- `spec_code` (canonical-source pointer): command docs claim SKILL.md "Mode 4: Model-Benchmark" is canonical. FAIL — anchor does not exist (→ traceability-3-1).
- `spec_code` (EC-5 ordering): command docs + auto YAML promise materialize-before-benchmark; `loop-host.cjs:153-159` plans `[materialize-benchmark-fixtures.cjs, run-benchmark.cjs]` in that order, abort-on-failure (`runPlan` line 187). PASS.
- `spec_code` (state-log ledger ownership): YAML `step_append_ledger:152-154` claims run-benchmark.cjs is the sole ledger writer and infers the state-log path. `run-benchmark.cjs:111-120 inferStateLogPath` walks up from `outputs-dir` to the `improvement` dir → `agent-improvement-state.jsonl`, matching `state_paths.state_log`. The YAML omits `--state-log` but inference reaches the same target. PASS.
- `spec_code` (mode-aware records + scoringMethod): SKILL.md:278 + both command docs claim every state record carries `mode` and `benchmark_run`/report carry `scoringMethod`. `run-benchmark.cjs:463-532` writes `mode:'model-benchmark'` + `scoringMethod` on both `report.json` and the `benchmark_run` ledger row (and on the `infra_failure` paths). PASS. Confirms 015 mode-aware remediation.
- `spec_code` (provenance + history): the 014 traceability remediations (provenance block, immutable label-stamped report-history snapshot, grader on report) resolve to shipped code: `run-benchmark.cjs:455-533` (`provenance`, `report-history/`, `reportSnapshot`, `grader`). PASS. Confirms 015.
- `feature_catalog_code` (provenance packet chain): command-doc provenance "built 121/003, remediated 121/004, opt-in scorer/docs 121/005, command entry 121/008" resolves to real packets `003-build-model-benchmark-mode-runtime`, `004-benchmark-mode-remediation`, `005-add-opt-in-5dim-scorer-and-skill-docs`, `008-add-model-benchmark-lane-selection-prompts`. PASS.
- `feature_catalog_code` (advisor Lane B node): the `/deep:start-model-benchmark-loop` command and Lane B phrasing route to a REAL projection node `deep-model-benchmark` (projection.ts:121, aliases.ts:33), so the explicit-lane boosts are live (not inert). PASS for behavior; comment drift recorded as traceability-3-2.
- `playbook_capability` (benchmark_completed gating): SKILL.md:348 + agent-doc:495 claim `benchmark_completed` emits only after `report.json` exists; auto YAML `step_emit_journal_event_benchmark_completed:149-150` guards on `test -f .../report.json`. PASS.

## Verdict

CONDITIONAL — one new P1 (dead "Mode 4" canonical-source anchor in both Lane command docs) plus one P2 (stale projection comment in explicit.ts). All checked 015 provenance/history/mode-aware-record remediations and the advisor Lane B routing verified sound.

## Next Dimension

Maintainability (D4).
