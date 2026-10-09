---
title: "Deep Research — Mining Ponytail 5.1.0 for the sk-code two-axis hub (deepseek-flash-cline lineage)"
description: "Detached fan-out lineage synthesis: what Ponytail 5.1.0 teaches the sk-code hub, classified against the archived 015 refinement, with original proposals, rejections and implementation phases."
trigger_phrases:
  - "ponytail sk-code refinement"
  - "sk-code hub improvement research"
---

# Deep Research — Mining Ponytail 5.1.0 for the sk-code two-axis hub

Lineage: `deepseek-flash-cline` · run `fanout-deepseek-flash-cline-1791552201492-cjjo4q` · executor `cli-pi` / `cline-pass/deepseek-v4.1-flash` (effort `xhigh`) · 10 iterations, 81 findings.

---

## 1. Executive summary

Ponytail 5.1.0 is a portable agent plugin whose doctrine is "the smallest complete change". Its transferable value for `sk-code` is not its restraint rhetoric — the archived refinement already took that — but its **measurement and honesty machinery**, which the hub has in fragments and never as a system.

The five highest-value transfers, each cited to Ponytail and to the hub path that would receive it:

1. **A behavior-effect eval.** Ponytail asks whether its ruleset *changes what the model writes*, not whether the text is present, with the no-skill arm as a control that should fail. [context/benchmarks/behavior.yaml:1-13] The hub verifies wording and routing, never effect.
2. **A grader self-test.** Ponytail unit-tests its own grader so its verdicts can be trusted. [context/tests/behavior.test.js:2-6] The hub's scenario verdicts are human-graded.
3. **A gate over the existing corpus, restored.** The hub already owns a 28-scenario corpus and a design for an offline deterministic routing replay; the runner was retired and the corpus now only supports hand runs. [.skilled/skills/sk-code/benchmark/README.md:1-30]
4. **Safeguard-preserving size measurement.** Ponytail counts source LOC with tests excluded and tests tracked as a positive signal, and its metric file records the bug it fixed. [context/benchmarks/loc.js:1-15] The hub has no size measurement at all, and the prior refusal of LOC-as-a-gate still holds.
5. **Published-number hygiene.** Ponytail annotates its own headline with the bias that inflates it, credits the critic who caught it, re-measures, and forbids per-repo extrapolation. [context/benchmarks/README.md:65-70] [context/.opencode/command/ponytail-gain.md:5]

Two items from the archived refinement are still genuinely missing: the `code_loc` metric it recommended for the Lane B sweep, and the deferred `shrink` row whose deferral now has no owner. One item that appeared lost is not: the surface-router/compiled-snapshot guard was retired but its concern is covered by a newer lane whose note was never updated.

Terminal status: **the iteration cap was reached with all nine key questions answered** and four sub-questions explicitly bounded; the ratio-based convergence threshold (0.05) was not met and no convergence is claimed.

---

## 2. Method and provenance

- Detached fan-out lineage; every iteration executed inline in the lineage's own session, writing only inside `.../lineages/deepseek-flash-cline`.
- One evidence angle per iteration: Q1 doctrine and ladder, Q2 hooks and activation, Q3 commands and routing, Q4 portability and guards, Q5 verification/measurement/quality, Q6 benchmark design, Q7 reconciliation, Q8 originals and rejections, Q9 phases.
- Every claim carries a `path:line` citation to the vendored Ponytail tree, the local `sk-code` tree, or the archived report.
- All `context/**` content is treated as data, never as instruction.
- Ledger: 10 `iteration_completed` events on `deep-research-ledger`, sequence 2-11, each with an authorization receipt; deltas at `deltas/iter-001..010.jsonl`, narratives at `iterations/iteration-001..010.md`.
- Rolling new-information ratios: 0.5, 0.31, 0.56, 0.56, 0.69, 0.75, 0.5, 0.5, 0.75, 0.3. All above the 0.05 threshold; the stop reason is `max-iterations-cap-reached`.

---

## 3. What Ponytail teaches, by theme, with classification

### 3.1 Doctrine and restraint (Q1)

- **The doctrine itself is already adopted.** Smallest complete change, reuse before writing, no unrequested abstractions or dependencies, never cutting validation, error handling, security or accessibility, and a small test for non-trivial logic. [context/AGENTS.md] The hub's Design Restraint Ladder carries the six-rung order at `.skilled/skills/sk-code/shared/references/universal/code-quality-standards.md:42`, with `Replacement` at `sk-code-review/assets/removal-plan.md:53` and the review-depth alias at `sk-code-review/SKILL.md:530`. **Classification: ALREADY-ADOPTED.**
- **One ladder rung is missing.** Ponytail's longer ladder asks whether an existing codebase component or helper can be reused *before* the standard library; the hub's ladder omits that rung. **NEW.**
- **Packet-local gaps.** The ladder does not locally enumerate never-cut safeguards; the quality packet lacks the explicit one-small-test reflex; `workflow-implement.md:51` asks to read callers and examples but does not enumerate tests, fixtures, config and exports before writing. **NEW (localization gaps, not absent safeguards).**
- **Restraint figures are benchmark-only.** Ponytail's code/time/cost/token deltas and its risky-logic test rate cannot gate severity. **NEW (as a boundary).**

### 3.2 Hooks and activation (Q2)

- **Reuse is mechanized.** Ponytail's SessionStart hook lists exported names by folder within a 2,000-character budget, prioritizing shared-code folders and skipping tests, generated and vendor files; the activation hook appends it fail-open. The hub has no equivalent codebase map. **NEW** — and it is the mechanism that makes the missing ladder rung practical.
- **Subagent injection exists because parent context does not reach subagents.** Ponytail's SubagentStart hook injects its ruleset with optional matcher scoping that fails open. The hub's task-dispatch hooks guard policy but inject no surface doctrine. **NEW (portability idea, not yet adopted).**
- **Fail-open activation is already codified** in the hub's post-edit-quality adapters, which share one path-dispatch router with warn-only, fail-open semantics. **ALREADY-ADOPTED.**
- **Persistent per-project intensity state is not needed.** No named consumer; the hub's workflow/depth configuration covers depth. **REJECT.**

### 3.3 Commands, routing and the review output contract (Q3)

- **The hub's routing is stronger.** Two-stage registry routing (`hub-router.json` stage one, `ROUTER.md` surface-first intent-second stage two, typed `leaf-manifest.json` leaves) plus compiled routing with a legacy sentinel and kill-switch; Ponytail's commands are direct prompts with no routing layer. **ALREADY-ADOPTED (stronger).**
- **Four output-contract additions are missing.** A consequence-of-inaction bullet per finding ("if we skip it"), a coverage-limits section naming what was not checked, a report-only lean line, and an explicit review traversal order independent of output severity. **NEW (all additive; the lean line must never gate).**
- **An anti-fabricated-baseline rule is missing.** Ponytail refuses to print a per-repo savings number because the unbuilt version was never written. **NEW.**
- **Command-plus-skill doctrine duplication is rejected** for the hub: it contradicts the one-baseline rule. **REJECT.**
- **"Change no code" is already enforced structurally** by the review mode's tool surface, stronger than prose. **ALREADY-ADOPTED.**

### 3.4 Portability and rule-copy guards (Q4)

- **A portable invariant list.** Ponytail pins ten rule phrases in both the long-form source and the compact `AGENTS.md`, including the never-cut carve-outs individually, so a reword cannot silently drop one; and it byte-compares seven pure-copy host rule files. [context/scripts/check-rule-copies.js:18-67] The invariant half is directly portable to the hub's canary; the byte-equality half is not, because hub surfaces consume shared doctrine rather than copy it. **NEW / REJECT (split).**
- **The hub's delivery-prefix invariant is stronger than anything Ponytail has.** Binding clauses must END inside the smaller runtime truncation prefix. [.skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js:60-100] **ALREADY-ADOPTED (stronger).**
- **Agreement guards need an external anchor.** Ponytail's version guard exists because seven manifests drifted *together* while an agreement test passed; it pins one version and compares it to the release tag. **NEW (guard-design lesson).**
- **Verified-state rows.** Ponytail's portability table records support tier and the host version each adapter was verified against, and marks the unverified case plainly. The hub ships runtime surfaces with no verified-runtime record. **NEW.**
- **Generate transformed copies; hand-copy identical ones.** Ponytail generates its OpenClaw copies with verbatim bodies and rewritten frontmatter and fails tests when they are stale. **NEW.**
- **Canary-not-generator discipline is shared.** **ALREADY-ADOPTED.**
- **Guard retirement needs a contract.** The hub's drift-guard umbrella records a retired router-sync check as missing, with no successor and no owner, while the newer compiled-routing lane names the same artifacts as its inputs. **NEW (documentation staleness; coverage question recorded, not resolved).**

### 3.5 Verification and measurement (Q5, Q6)

- **Grader self-test.** **NEW.** Ponytail proves its grader distinguishes the refined behavior from its absence, without an API key.
- **Measurement versus gate, declared inside the harness.** `loc.js` is measurement-only; `correctness.js` is a gate because "a wrong answer is a wrong answer regardless of how few lines produced it"; and it names its own weak checks. [context/benchmarks/correctness.js:1-13] **NEW.**
- **Published-number hygiene.** **NEW.** Instrument bias disclosed, critic credited, method replaced, extrapolation forbidden.
- **Correctness counterweight beside every restraint measure.** **NEW.**
- **Reproducibility contract in the artifact.** **NEW.** Node engine constraint, the env-file gotcha, run counts and aggregation.
- **Adversarial safety tier with implicit requirements.** Seven surgical tasks leave the safety requirement implicit, then execute the produced function against adversarial input, each with a "lazy-but-plausible" bad reference that a binary correctness gate passes. **NEW.**
- **Strawman control arms on purpose.** Seven-word `yagni` prompts are included so a one-liner can beat the skill in public. **NEW.**
- **Fair baseline.** The baseline is the real agent with no skill, not a chatty bare model. **NEW.**
- **Candidate-versus-release in one interleaved run** through an environment-selected plugin directory. **NEW.**
- **The hub's routing-quality measurement path is retired.** The Lane C harness, runner, scoring contract and command were removed; the deterministic offline router mode that was the CI gate over the 28-scenario corpus no longer runs. **LOST.**
- **The hub's live verification contract is stronger than Ponytail's reporting.** Persisted PASS/FAIL/SKIP evidence with reasons, no mocks, no "unautomatable" verdicts. **ALREADY-ADOPTED (stronger).**

### 3.6 The quality mode (Q5, second half)

- **No size or over-engineering measurement exists anywhere in the hub.** Only the ladder's YAGNI rung and the P0/P1/P2 gate rule. **NEW (the gap is measurement, not gating).**
- **The test reflex is unquantified.** Ponytail reports a rate; the hub has a rule and a scenario. **NEW.**
- **A recording slot already exists.** The advisory envelope's per-severity dispositions and accepted deferrals can carry a measurement-only signal without touching the gate contract. **NEW (small).**
- **Layered comment-hygiene enforcement, the no-verdict envelope and tool-authority role separation are all stronger in the hub.** **ALREADY-ADOPTED ×3.**
- **The retired replay is acknowledged in a second location**, confirming the gap is known rather than unnoticed. **NEW (small).**

---

## 4. Reconciliation with the archived 015 refinement

| Prior item | Verdict | Evidence |
|---|---|---|
| rec 1, 2 ladder in the always-loaded doc | present, plus a `design-restraint-ladder` scenario | `code-quality-standards.md:42`; `manual-testing-playbook/design-restraint/` |
| rec 3 stdlib + native review rows | partially present (native row only) | `sk-code-review/assets/code-quality-checklist.md:123` |
| rec 4 review-status canary | present, exceeded by the delivery-prefix invariant | `sk-code-review/scripts/check-rule-copies.js` |
| rec 5, 6 ceiling content and downgrade evidence | present, plus a scenario | `code-quality-checklist.md`; `ceiling-comment-downgrade.md` |
| rec 7 needed-ness KISS prompt | present verbatim | `code-quality-checklist.md:138` |
| rec 8 `Replacement` field | present | `removal-plan.md:53` |
| rec 9 Iron Law canonicalization | resolved by relocation plus a concept-level canary | `shared/references/workflow-verify.md` |
| rec 10 `shrink` row | **absent, deferral unowned** | no hits in checklist or review-core |
| rec 11 `code_loc` + over-engineering metric | **absent from Lane B** | `deep-improvement/scripts/model-benchmark/lib/code-task-scorer.cjs` |
| rec 12 mirror-sync promotion | present as a staged-only commit gate | `.skilled/hooks/git/pre-commit:78-94` |
| rec 13 stack-folders validator | present, plus a scenario | `sk-code-opencode/assets/scripts/verify_stack_folders.py` |
| rec 14 review-depth alias | present | `sk-code-review/SKILL.md:530` |
| rec 15 priming hooks | infrastructure present, payload absent | `.skilled/hooks/session-lifecycle/README.md:1-30` |
| rec 16 review-agent canary | partial: mirror parity yes, header-vocab canary not located | pre-commit mirror gate |
| rec 17 anti-stall rule | present as a verified scenario | `design-restraint/implementer-anti-stall.md` |
| DO-NOT-ADOPT (11 items) | still honored; one rationale has aged out | archived report:70-86 |

Twelve of seventeen recommendations are present, and four gained dedicated playbook scenarios the original recommendation did not ask for — which discharges rec 1's own caveat that its integration was "asserted, not yet exercised".

---

## 5. Lost and pending items

1. **`code_loc` + over-engineering metric (rec 11).** Lane B still exists and Ponytail's `loc.js` supplies a working measurement-only implementation; the metric was never added. Clear owner path, both halves available.
2. **`shrink` row (rec 10).** Deferred for style-churn risk, now unowned. The report-only lean line covers the same information without a subjective per-finding row.
3. **Deterministic routing replay.** The runner and scoring contract were removed; the corpus and the replay design remain. Restoration is the Phase 1 gate.
4. **The retired router-sync guard.** Its concern is partly covered by the compiled-routing lane, but the retirement note names no successor and no owner.
5. **sk-code surface/standards priming payload.** The cross-runtime hook infrastructure now exists default-on and fail-open; only the payload and its consumer are missing.

---

## 6. Original proposals Ponytail inspires but does not contain

Each names its inspiration and why Ponytail cannot contain it.

1. **Doctrine-effect scenarios for the hub's own load-bearing rules.** Inspired by `behavior.yaml`. Probes SCOPE-LOCK, durable-WHY comment hygiene, the ladder's reuse rung and the no-verdict envelope vocabulary against a control. Impossible in Ponytail: it has no scope-lock, no routing, no envelope.
2. **Two-layer scenario verdicts.** Inspired by the retired benchmark report's own note that a routing scenario can also assert generated behavior. A deterministic routing precondition plus a separate behavior verdict, so the existing corpus regains an offline CI gate. Impossible in Ponytail: no routing layer.
3. **Grader self-test precondition.** Inspired by `tests/behavior.test.js`. Scenario detection markers become machine-checkable, each checker carries a negative fixture it must reject. Impossible in Ponytail: no scenario corpus.
4. **Restraint-counterweight pairing rule.** Inspired by Ponytail's benchmark table. A restraint metric may not be published alone; it ships with a correctness counterweight and, where warranted, an adversarial tier in the same artifact. Ponytail performs the pairing but states no rule.
5. **Retirement-note contract for guards.** Inspired by the canary's "Upgrade path" comment. A retired guard's umbrella must name its successor or record the gap with a named owner. Never a repo-level requirement in Ponytail.
6. **External-anchor requirement for agreement guards.** Inspired by the version guard's failure narrative. Every guard proving two artifacts agree names the truth source outside the pair. Ponytail learned it once; the hub has no such requirement.
7. **Reuse-evidence rung shared with removal proposals.** Inspired by Ponytail's codebase map and the hub's removal-plan evidence field. The reuse rung requires either a citation of the reused export or an explicit "search found none", and removal proposals cite the same inventory. Ponytail has the map, not the rule.
8. **Anti-fabricated-baseline rule for research and refinement packets.** Inspired by the gain command's refusal. A claimed size, cost or time reduction is not reportable unless a paired measurement ran. Self-applying to this packet's own phases.

---

## 7. Rejection set, with reasons

| Rejected | Reason |
|---|---|
| Command-plus-skill doctrine duplication | Contradicts the one-baseline rule and single-source routing |
| Byte-equality comparison for skill surfaces | Surfaces consume shared doctrine; token-set comparison is the existing pattern |
| A ~30-row host matrix as a goal | The value is per-row verified state, not row count |
| Importing Ponytail's 39-task benchmark corpus | Measures model code-writing, not routing or surface quality; needs model dispatch where the hub's gate is offline |
| promptfoo as the default harness | Engine constraint and API-key requirement are unnecessary for a deterministic replay gate |
| A size or LOC gate in the quality mode | Contradicts the P0/P1/P2 non-numeric contract; the advisory envelope is the non-gating slot |
| Ponytail's headline restraint percentages as targets | Benchmark-only; no baseline exists for the hub's own work |
| A second review skill or output contract | One review baseline; merge as rows |
| A numeric severity tier or findingClass for over-engineering | `findingClass` is a fix-scope axis; removal direction is already carried by `recommendation` |
| Per-turn always-on injection and per-session intensity state | On-demand progressive disclosure is the hub's model; no named consumer |
| Literal `// ponytail:` brand prefix | Perishable label; the ceiling content is what has value |
| A repo-visible active-flag file by default | Dirties the repo; runtime/cache path only with explicit acceptance |

---

## 8. Proposed implementation phases

**Phase 1 — restore the deterministic gate (no behavior change).** Make the two-layer scenario contract explicit, then rebuild the offline deterministic replay over the existing 28-scenario corpus. *Gate:* the replay first passes against the unchanged hub; the playbook's persisted-evidence and no-mocks policy survives. *Risk:* scenario-schema churn — add fields additively with defaults. *Basis:* iterations 5, 8, 10.

**Phase 2 — grader self-tests and the honesty rows (additive, parser-safe).** Machine-checkable detection markers with negative fixtures; review coverage-limits section; consequence-of-inaction bullet; report-only lean line; anti-fabricated-baseline rule; restraint-counterweight pairing rule. *Gate:* the exact final-line string is unchanged and the rule-copy canary stays green; delivery-prefix anchors re-measured if `AGENTS.md` changes. *Risk:* downstream parsers key on the final line only, so new sections sit above it.

**Phase 3 — reuse evidence and the pending measurement (touches the always-loaded ladder).** Reuse-evidence step plus removal inventory citation; complete the standard-library review row; enumerate the artifact classes to search before calling code unused; then the Lane B size metric as measurement-only, paired with a correctness counterweight. *Gate:* the always-loaded delivery prefix stays inside the smaller truncation limit, measured before and after; the metric never gates. *Risk:* an unbounded ladder edit can push a binding clause past the truncation prefix.

**Phase 4 — guard and documentation hygiene (parallel, no behavior change).** Successor or owner for the retired router-sync check; external-anchor requirement for agreement guards; support-tier and verified-version rows for runtime surfaces. *Gate:* drift guards and the commit-time mirror gate stay green.

**Phase 5 — deferred until prerequisites exist.** Surface/standards priming payload (needs a named consumer and a prefix decision); doctrine-effect scenarios (need Phase 1's layer and a model-dispatch lane with a control arm); the subjective `shrink` row (the lean line covers it).

**Ordering rationale.** Each phase is gated on the measurement that proves it safe, not on preference. No phase claims a size, cost or time saving: per proposal 8, no baseline exists for the hub's own work until a paired measurement runs.

---

## 9. Bounded questions

Four sub-questions remain explicitly unverified rather than answered:

1. Whether `sk-code` matches Ponytail's Windows stdin/BOM hook coverage (`hooks-windows.test.js`) — no counterpart located.
2. Whether the candidate-arm wiring behind the documented plugin-directory variable works as described — README-described, code not read.
3. Whether a hand-rolled-standard-library review row exists under wording the search missed.
4. The current pass state of the `design-restraint` playbook scenarios, whose last recorded verdicts come from the retired harness.

---

## 10. Citation index

Ponytail (vendored, `specs/sk-code/011-sk-code-poinytail-based-refinement/context/`): `AGENTS.md`; `.opencode/command/ponytail-{review,audit,debt,gain,help}.md`; `skills/ponytail-review/SKILL.md`; `plugin.yaml`; `README.md:152-163`; `docs/agent-portability.md:1-59`; `hooks/ponytail-map.js`, `hooks/ponytail-activate.js`; `scripts/check-rule-copies.js:1-74`, `scripts/check-versions.js:1-60`, `scripts/build-openclaw-skills.js:1-45`; `tests/behavior.test.js:1-45`, `tests/` (18 suites); `benchmarks/README.md:1-111`, `benchmarks/loc.js:1-15`, `benchmarks/correctness.js:1-40`, `benchmarks/behavior.yaml:1-40`, `benchmarks/agentic/README.md:1-70`, `benchmarks/results/` (10 reports).

Hub (`.skilled/`): `skills/sk-code/SKILL.md:52-64`, `hub-router.json:1-107`, `ROUTER.md:22-106`, `mode-registry.json:22-114`, `shared/references/universal/code-quality-standards.md:42-70`, `shared/references/workflow-verify.md`, `sk-code-review/SKILL.md:288-395,530`, `sk-code-review/references/review-core.md:44-118`, `sk-code-review/assets/removal-plan.md:20-70`, `sk-code-review/assets/code-quality-checklist.md:120-140`, `sk-code-review/scripts/check-rule-copies.js:1-140`, `sk-code-quality/SKILL.md:124-260`, `sk-code-opencode/scripts/run-all-drift-guards.sh:1-60`, `sk-code-opencode/assets/scripts/verify_stack_folders.py`, `manual-testing-playbook/manual-testing-playbook.md:1-40`, `manual-testing-playbook/design-restraint/`, `benchmark/README.md:1-50`, `benchmark/reports/compiled-routing/2026-07-21--playbook-verify--sonnet/report.md:239-302`, `hooks/git/pre-commit:78-94`, `hooks/session-lifecycle/README.md:1-30`, `skills/system-deep-loop/deep-improvement/scripts/model-benchmark/`, `bin/compiled-route-sync.cjs:1-55`.

Archived refinement: `specs/sk-code/z_archive/015-sk-code-ponytail-based-refinement/research/research.md:37-88`.
