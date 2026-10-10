---
title: "Research round two: Ponytail 5.1.0 teachings for the sk-code hub, agents, mirrors, repo rules and root framework"
description: "Second-round deep research over Ponytail 5.1.0: what round one's recommendations have already delivered (closure ledger), which Ponytail teachings reach the agent definitions, runtime mirrors, repository rules and root framework, and the ranked findings table with classifications and priorities."
trigger_phrases:
  - "ponytail round two"
  - "sk-code ponytail agents rules"
  - "r2-dsflash-llmgw synthesis"
importance_tier: "important"
contextType: "research"
---

# Research round two: Ponytail 5.1.0 teachings for the sk-code hub, agents, mirrors, repo rules and root framework

A detached fan-out lineage ran ten iterations over the vendored Ponytail 5.1.0 tree, targeting three families round one did not cover: the code-working agent definitions and their runtime mirrors, the repository rules and root framework, and the sk-code hub surfaces beyond round one's settled set. Every finding is classified NEW, ALREADY-COVERED (an idea already in round one's `research.md`) or ALREADY-ADOPTED (present in the target file), and carries a priority.

---

## 1. Executive Summary

Round two's largest result is a **closure ledger**: most of round one's recommendations are already implemented in this tree, including four defect fixes round one listed as open. Verified closed: surface precedence and Obsidian coverage; the doctrine pass (the seven-rung ladder with the reuse step, accessibility in the never-cut line, the full reach list in the implement workflow); the review-output additions (`Not checked:`, the workload note, the consequence line, the widened removal search); the Webflow minified-runtime checker (D1); the stale scenario (D3); the shared stdin deadline (D4); and the Codex mirror gap (D2). Half closed: D1's known-bad test input. Open: the retirement note and deferred items round one parked by design.

The actionable round-two set reaches beyond round one's targets. The highest-value gaps are:

1. **Restraint has no front door.** Ponytail activates on "yagni", "simplest solution", "over-engineering or bloat"; the sk-code hub's lexical surfaces — `hub-router.json`, `mode-registry.json`, `description.json`, and the canary corpus — carry none of that vocabulary, so a "simplify this" request cannot score the mode built for it.
2. **The review contract cannot demand a reproducing case.** Ponytail's "no case, no finding" rule has no field in sk-code-review's finding format; Scope proof proves class coverage, not reproducibility.
3. **The reviewer never reads the connected code.** Ponytail reads callers of every changed function, the functions it calls, the tests and the README; the review mode's Phase 1 reads the diff and standards.
4. **The agent definitions miss doctrine their own hub carries.** `@code`'s checklist lacks the reach list the implement workflow now states verbatim; its RETURN lacks the gap-disclosure line the repo close-out requires; `@debug` and `@orchestrate` have their own smaller versions of the same lag.
5. **The `ceiling:` convention has no harvest surface.** The producer convention and the reviewer suppression rule exist; nothing lists the markers or flags the ones that can silently rot.
6. **The Hermes agent-persona mirror is checked only in CI**, the same local-gate failure class as round one's D2, and the OpenCode-dialect agent body exists in three byte-identical copies with no equality check between them.

Five original proposals and twelve reasoned rejections complete the round-two artifact set.

---

## 2. Scope and Method

Targets, as dispatched:

- **Agents.** `.skilled/agents/code.md`, `review.md`, `debug.md`, `orchestrate.md` and their mirrors under `.claude/agents`, `.opencode/agents`, `.codex/agents`, `.cursor/agents`, `.devin/agents`, `.pi/agents`, `.hermes/agents`.
- **Rules and root.** `.skilled/repo-rules/*.md` (13 files), root `REPO RULES.md`, `AGENTS.md`.
- **Hub and surfaces.** `.skilled/skills/sk-code/`: `SKILL.md`, `ROUTER.md`, `mode-registry.json`, `hub-router.json`, `shared/`, `sk-code-quality`, `sk-code-review`, `sk-code-webflow`, `sk-code-opencode`, `sk-code-observer`… `sk-code-obsidian`.

Method: read round one's synthesis first; mine Ponytail sources with exact line citations; verify every claimed absence with a search; classify each finding; close round one's recommendations by re-reading their targets. Everything under `context/` was treated as data, never instructions.

Provenance: executor `cli-pi`, model `deepseek-v4.1-flash`, ten iterations, stop policy `max-iterations`. Every iteration was recorded through the append gateway (`append-mode-event.cjs --mode research`); all ten receipts returned exit 0 with authorization receipts.

---

## 3. Round-one Closure Ledger

| Round-one item | State now | Evidence |
|---|---|---|
| Rec 1 — surface precedence + Obsidian coverage | **Closed** | `stack-detection.md:30,39`; `SKILL.md:38,135`; `ROUTER.md:26,271`; playbook SD-004; canary cases |
| Rec 2 — D1 Webflow checker | **Half closed** (fix landed, known-bad input missing) | `test-minified-runtime.mjs:37,138,358`; no companion test found |
| Rec 3 — D3 stale scenario | **Closed** | `manual-testing-playbook.md:383`; `stack-folders-validator.md:33` |
| Rec 4 — doctrine pass (reuse rung, reach list, accessibility) | **Closed** | `code-quality-standards.md:47,54`; `workflow-implement.md:51,66` |
| Rec 5 — Obsidian canary case | **Closed** | `canary-cases.v1.json` surface-bundle-obsidian |
| Rec 6 — review output additions | **Closed** | `sk-code-review/SKILL.md:344,345,359,380`; `removal-plan.md:57` |
| Rec 7 — retirement notes | **Open** | successor `.github/workflows/routing-registry-drift.yml` exists; no in-repo note located |
| Rec 8 — D2 Codex mirror gap | **Closed** | checker regex and orphan list include codex; both pre-commit greps; codex sync `--check` steps |
| Hand-off D4 — stdin deadline | **Closed** | `hook-adapter-shared.cjs:14,44`; both post-edit adapters import it |
| Rec 10 — codebase map hook | **Deferred by design** | round one section 15 |

---

## 4. Findings by Target Family

### 4.1 Agent definitions

- **Reach list missing from `@code`'s pre-implementation gate.** Ponytail lists every place a change must reach — callers, tests, fixtures, config, exports [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/AGENTS.md:14]; `@code`'s checklist checks scope, allowlist and routing but never enumerates the reach set [SOURCE: .skilled/agents/code.md:205]. The shared implement workflow now carries it verbatim [SOURCE: .skilled/skills/sk-code/shared/references/workflow-implement.md:51], so the agent is the lagging surface. **NEW target; ALREADY-COVERED idea. P1.**
- **No gap-disclosure line in `@code`'s RETURN.** Ponytail closes every reply with what was skipped or unchecked plus user risk [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail/SKILL.md:15]; the RETURN fields are Mode/Files/Verification/Command/Exit/Rubric/Escalation/Confidence plus Summary, Adversarial Summary, Out Of Scope, Spec Drift [SOURCE: .skilled/agents/code.md:297]. The repo close-out already requires the disclosure [SOURCE: .skilled/repo-rules/evidence-and-proof.md:194], which sharpens the gap. **NEW target. P1.**
- **`@review` has no no-case-no-finding bar.** Ponytail: "Every finding needs a concrete case: 'this input or situation leads to this wrong result'. No case, no finding" [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail-review/SKILL.md:59]. `@review`'s evidence table requires file:line plus snippet or pattern reference, not a case [SOURCE: .skilled/agents/review.md:358]. **NEW. P1.**
- **`@review` never reads the connected code as a workflow step.** Ponytail reads the diff then callers, called functions, tests, README [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail-review/SKILL.md:21]; `@review`'s read-budget discipline discourages wide reads without a coverage obligation [SOURCE: .skilled/agents/review.md:72]. **NEW. P1.**
- **`@debug` response contract has no not-checked disclosure.** Ponytail's audit closes with what was not read or could not run [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail-audit/SKILL.md:98]; none of `@debug`'s three response shapes carries it [SOURCE: .skilled/agents/debug.md:380]. **NEW target. P2.**
- **`@debug` does not read the test harness or build config covering the failure.** Ponytail's audit maps a repo by README, build/deploy config, dependencies, entry points and tests first [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail-audit/SKILL.md:20]. **NEW for `debug.md` Phase 2. P2.**
- **`@debug` bounded hypotheses do not disclose the omitted count.** Ponytail caps an audit at 20 findings and says how many were left out [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail-audit/SKILL.md:83]; Phase 3 caps at 2-3 with no disclosure [SOURCE: .skilled/agents/debug.md:248]. **NEW mechanism. P2.**
- **The reach set is not a dispatch field in `@orchestrate`'s Task Format.** Scope and Boundary exist; the reach set does not [SOURCE: .skilled/agents/orchestrate.md:186]. **NEW target; ALREADY-COVERED idea. P2.**
- **Already adopted in agents.** `@code`'s bug-fix root-cause discipline (Critic wrong-abstraction questions, scope-conflict escalation) [SOURCE: .skilled/agents/code.md:475]; `@debug`'s fresh-observation and counter-evidence passes [SOURCE: .skilled/agents/debug.md:177,288]; `@orchestrate`'s sub-agent verification checklist [SOURCE: .skilled/agents/orchestrate.md:510].

### 4.2 Runtime mirrors

- **Hermes agent-persona check runs only in CI.** `sync-skills-hermes.cjs` mirrors `.skilled/agents` personas into `.hermes/skills/agent-*` with `--check` [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs:48]; CI runs both Hermes checks [SOURCE: .github/workflows/command-tree-parity.yml:65]; the pre-commit gate has zero Hermes references and both mirror lists omit `.hermes` [SOURCE: .skilled/scripts/git-hooks/pre-commit:210,223]; the doctor's runtime-mirror config has none, and its update route checks Hermes prompts only [SOURCE: .skilled/commands/doctor/assets/doctor-update-apply.yaml:186]; the doctor doc overclaims agent mirrors [SOURCE: .skilled/commands/doctor/runtime-mirrors.md:59]. **NEW; same failure class as D2. P1.**
- **Three byte-identical OpenCode-dialect agent bodies, no mutual equality check.** `.skilled/agents`, `.opencode/agents` and `.hermes/agents` hashed identically for the four agents; each checker compares a different pair and the doctor roster check treats `.skilled` as presence-only [SOURCE: .skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs:62]. **NEW, latent. P2.**
- **Already adopted.** Adapter thinness: Cursor symlinks resolve to the Claude canonical [SOURCE: .skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs:51]; Devin/Codex/Pi/Hermes trees are generated; the dialect split is documented [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs:36].

### 4.3 Repository rules

- **Reach set only half-enumerated in the pre-write pass.** `prevent-overengineering.md` §2 asks for the owning module, one real caller and the contract [SOURCE: .skilled/repo-rules/prevent-overengineering.md:94]; tests, fixtures, config and exports are absent. **P2.**
- **No decodability floor for minimal diffs.** Ponytail: "A one-liner that needs decoding is not short" [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail/SKILL.md:36]; the reversal-cost order has no readability counterweight. **NEW. P2.**
- **Moved or merged code is not required to keep its error handling and validation.** [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail/SKILL.md:39]. **NEW. P2.**
- **No equal-cost tiebreak on edge-case correctness.** [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail/SKILL.md:40]. **NEW. P2.**
- **Accessibility absent from the rules' never-cut set.** Zero occurrences across all 13 rule files and the root docs; round one found the same in the standards, which now carry it [SOURCE: .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md:54]. **ALREADY-COVERED idea, NEW targets. P2.**
- **Already stronger than Ponytail.** Root-cause doctrine [SOURCE: .skilled/repo-rules/root-cause-and-debugging.md:52,60]; close-out disclosure [SOURCE: .skilled/repo-rules/evidence-and-proof.md:187,194].

### 4.4 Root framework

- **The close-out contract never discloses a residual risk.** Ponytail's closing line has two halves; the repo's close-out lists four items and "what is not done" but never a known risk the operator must weigh [SOURCE: AGENTS.md:296] [SOURCE: .skilled/repo-rules/evidence-and-proof.md:187]. **NEW. P2.**
- **Accessibility absent from `AGENTS.md` and `REPO RULES.md`** (zero occurrences). **P2.**
- **Verified:** the trigger table covers all 13 rule files; the no-trigger fallback is explicit [SOURCE: REPO RULES.md:18]; self-application and adapter alignment are carried by universal binding and the precedence clause [SOURCE: REPO RULES.md:29,74].

### 4.5 Hub core

- **Restraint and simplification prompts have no routing vocabulary.** Ponytail activates on them [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail/SKILL.md:7,8]; none of yagni, simplify, over-engineering, bloat, lean or refactor appears in `hub-router.json` classes [SOURCE: .skilled/skills/sk-code/hub-router.json:52], `mode-registry.json` aliases [SOURCE: .skilled/skills/sk-code/mode-registry.json:36], `description.json`, `ROUTER.md`, or any canary case. **NEW. P1.**
- **No canary case for restraint or simplification.** The corpus covers single, bundle, ambiguous, zero-signal and certificate cases [SOURCE: .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json:1]. **NEW. P2.**
- **Already adopted:** version parity anchored to SKILL.md plus the changelog outside reference (check 13a/13b) [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1694,1685]; inline mode hint, named disambiguation checklist, when-not-to-use routing [SOURCE: .skilled/skills/sk-code/SKILL.md:23,77,42].

### 4.6 Shared layer and workflow modes

- **The review finding contract lacks a reproducing case.** Same core as 4.1, at the mode [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:344–350]. **NEW. P1.**
- **Phase 1 never enumerates the connected code** [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:290,304]. **NEW for the mode. P1.**
- **Findings are not numbered across severity groups** [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:342,352]. **NEW. P2.**
- **Test-effectiveness check partially present** [SOURCE: .skilled/skills/sk-code/shared/references/workflow-verify.md:127]. **Verified partial. P2.**

### 4.7 Surfaces and defects

- **D1 closed** [SOURCE: .skilled/skills/sk-code/sk-code-webflow/assets/scripts/test-minified-runtime.mjs:358]; **known-bad test input still missing. P2.**
- **D3 closed** [SOURCE: .skilled/skills/sk-code/manual-testing-playbook/manual-testing-playbook.md:383].
- **D4 closed** [SOURCE: .skilled/hooks/shared/hook-adapter-shared.cjs:14].
- **Precedence/Obsidian closed** across hub, detection, ROUTER, playbook, canary, advisor graph.
- **The `ceiling:` convention has no harvest surface.** Ponytail-debt collects markers, flags `no-trigger` rows that rot, and prints counts [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail-debt/SKILL.md:36,39]; sk-code-quality ships only comment-hygiene and dist-staleness scripts [SOURCE: .skilled/skills/sk-code/sk-code-quality/scripts/README.md:1]. **NEW. P1.**
- **Retirement note still open** (rec 7). **P2.**

---

## 5. Original Ideas

1. **A `no-signal` tag** for `ceiling:` markers whose trigger names no measurable quantity — extends Ponytail's `no-trigger` tag from "a trigger exists" to "the trigger can ever fire here".
2. **Citation resolution for agent and rule docs** — extend the `[SOURCE: path:line]` resolution `validate.sh` already performs inside spec folders to `.skilled/agents/*` and `.skilled/repo-rules/*`.
3. **One authored agent source per dialect** — declare `.skilled/agents` the authored OpenCode-dialect source and generate `.opencode/agents` and `.hermes/agents`, as four hosts already do.
4. **A review-output contract fixture** for the reproducing-case field once it exists, grading the contract the way the canary corpus grades routing.
5. **A vocabulary-parity check** across hub-router classes, mode-registry aliases, description keywords and the canary corpus, modeled on the doctor's version parity and anchored to the canary as the outside reference.

---

## 6. Eliminated Alternatives

| Approach | Reason Eliminated | Iteration |
|---|---|---|
| Session-global `lite/full/ultra` intensity | Flattens the two routing axes; rejected twice by round one | 1, 6, 9 |
| Persona sentence for agent definitions | Adds no enforceable behavior to contract-style definitions | 1, 5, 9 |
| Rename `ceiling:` to `shortcut:` | Churn; the token is deliberately brand-neutral | 2, 9 |
| Port Ponytail's numbered ladder into repo rules | Rules use reversal cost and delegate rungs to the code skill | 4, 9 |
| Ponytail's one-small-test reflex | Weaker than the P1 coverage floor | 4, 9 |
| "Build nothing" as a default answer | Would narrow the ask; scope discipline blocks it | 4, 9 |
| At-most-20-findings cap for review | Trades completeness; disclosure served by `Not checked:` | 7, 9 |
| Second plain-English contract in the review mode | Repo-wide rules own prose; duplication drifts | 7, 9 |
| Per-host verified-version records | Deferred already; doctor and CI prove freshness structurally | 3, 9 |
| Separate Obsidian probe battery | Graph, canary and playbook now carry Obsidian | 8, 9 |
| Separate restraint-routing harness | The canary corpus is the harness; add a case | 6, 9 |
| Session-state hook revival | No consumer; hooks are event-scoped | 9 |

---

## 7. Ranked Findings Table

### P1 — high value

| # | Finding | Target file | Classification | Rationale |
|---|---|---|---|---|
| 1 | Restraint/simplification vocabulary absent from the hub front door | `.skilled/skills/sk-code/hub-router.json`, `mode-registry.json`, `description.json` | NEW | The mode exists; the words that reach it do not |
| 2 | Review finding contract lacks a reproducing case | `.skilled/skills/sk-code/sk-code-review/SKILL.md`, `.skilled/agents/review.md` | NEW | Scope proof is not reproducibility; cheapest upgrade to the evidence floor |
| 3 | Review Phase 1 never reads the connected code | `.skilled/skills/sk-code/sk-code-review/SKILL.md`, `.skilled/agents/review.md` | NEW for mode; same idea filed for the agent | Callers/tests are where diff-blind reviews fail |
| 4 | `@code` pre-implementation gate lacks the reach list | `.skilled/agents/code.md` | NEW target; ALREADY-COVERED idea | The agent is the executor; the shared workflow already states it |
| 5 | `@code` RETURN has no gap-disclosure line | `.skilled/agents/code.md` | NEW target | Repo close-out already requires it; the RETURN is the missing surface |
| 6 | `ceiling:` convention has no harvest report | `.skilled/skills/sk-code/sk-code-quality` | NEW | Marked deferrals can rot silently; `no-trigger` names them |
| 7 | Hermes persona mirror checked only in CI | pre-commit mirror gate, doctor runtime-mirror config | NEW | Same local-gate failure class as the closed D2 |
| 8 | One authored agent source per dialect (original) | runtime-mirrors sync | NEW | Three identical copies with no mutual check |
| 9 | Vocabulary-parity check (original) | `parent-skill-check.cjs` / compiled-routing gate | NEW | Four surfaces share one vocabulary; nothing verifies agreement |

### P2 — worthwhile

| # | Finding | Target file | Classification | Rationale |
|---|---|---|---|---|
| 10 | `@debug` has no not-checked line | `.skilled/agents/debug.md` | NEW target | Same disclosure duty as review and RETURN |
| 11 | `@debug` omits candidates silently | `.skilled/agents/debug.md` | NEW | Bounded lists should say what was dropped |
| 12 | `@debug` skips the test harness/build config read | `.skilled/agents/debug.md` | NEW | Reproduction is stronger when the harness is read |
| 13 | `@orchestrate` Task Format lacks a reach-set field | `.skilled/agents/orchestrate.md` | NEW target; ALREADY-COVERED | The orchestrator owns the reach set before the leaf starts |
| 14 | `@review` findings lack an assumed-load statement | `.skilled/agents/review.md` | NEW target; ALREADY-COVERED | Scale findings need the load they judged |
| 15 | Findings not numbered across severity groups | `sk-code-review/SKILL.md`, `.skilled/agents/review.md` | NEW | Enables "fix 2 and 5" addressing |
| 16 | No stated report order in `@review` | `.skilled/agents/review.md` | NEW | Rubric weights exist without an order instruction |
| 17 | Close-out never names a residual risk | `AGENTS.md`, `evidence-and-proof.md` | NEW | Ponytail's second half of the closing contract |
| 18 | Accessibility absent from rules and root never-cut set | `prevent-overengineering.md`, `AGENTS.md`, `REPO RULES.md` | ALREADY-COVERED idea, NEW targets | Standards carry it; the outer layers do not |
| 19 | Reach set half-enumerated in pre-write pass | `prevent-overengineering.md` §2 | ALREADY-COVERED idea | Extend to tests/fixtures/config/exports |
| 20 | No decodability floor for minimal diffs | `prevent-overengineering.md` §1 | NEW | Prevents restraint becoming golf |
| 21 | Move/merge not required to preserve behavior | `scope-discipline.md` §2 | NEW | Mechanical moves must keep error handling |
| 22 | No equal-cost edge-case tiebreak | `prevent-overengineering.md` §1 | NEW | Cost order does not decide ties |
| 23 | No canary case for restraint vocabulary | canary fixture | NEW | Unverified aliases are unproven |
| 24 | D1 fix lacks its known-bad test input | Webflow packet tests | Residual | Half of round one rec 2 remains |
| 25 | Retirement note still open | retired guard successor chain | OPEN (rec 7) | Successor exists; no note located |
| 26 | Three-way agent copy equality unchecked | runtime-mirrors sync | NEW, latent | No drift today; the check is cheap |
| 27 | `no-signal` tag for unmeasurable triggers (original) | debt report | NEW | Extends `no-trigger` |
| 28 | Citation lint for agent and rule docs (original) | doctor lint | NEW | Claims in instruction docs never resolve |
| 29 | Review contract fixture (original) | `sk-code-review` tests | NEW | Grades the new case field deterministically |

### Closure and adopted rows (no action)

| Finding | Classification | Note |
|---|---|---|
| Rec 1, 3, 4, 5, 6, 8 and D4 handoff | CLOSURE (verified) | See the ledger in §3 |
| Rec 2, rec 7, rec 10 | Half / open / deferred | §3 |
| Root-cause doctrine, close-out disclosure, adapter thinness, version parity with changelog anchor, trigger coverage, activation practices, `@orchestrate` verification, `@debug` counter-evidence, `@code` root-cause Critic | ALREADY-ADOPTED | 11 reconfirmations across iterations 1–6 |

---

## 8. Evidence Limits and Confidence

- **High confidence:** the closure ledger (each item re-read at its target), the restraint-vocabulary gap (exact string counts across four surfaces and the canary corpus), and the mirror findings (file hashes, checker code, gate lists read directly).
- **Medium:** the review-contract and debug/orchestrate additions — sourced from Ponytail's text and the current files, not from running either agent.
- **Not verified:** no Ponytail benchmark was run; no claim here measures sk-code behavior. The doctor/reducer tooling was not re-run (outside the lineage write boundary); the version-parity check was read, not executed.
- **Inferred:** that a restraint-vocabulary alias addition would route correctly; the canary case in finding 23 is the proposed proof.

---

## 9. Convergence Report

- **Stop reason:** `maxIterationsReached` — the cap governs; convergence before the cap was telemetry only.
- **Iterations:** 10 of 10. Findings: 8, 7, 4, 7, 5, 4, 6, 6, 5, 4 = 56.
- **newInfoRatio trend:** 0.69, 0.57, 0.75, 0.57, 0.40, 0.62, 0.83, 0.92, 1.00, 0.88; mean 0.72. The ratio never fell below the 0.05 threshold, so no convergence was claimed.
- **Key questions:** 9 of 9 answered.
- **Classification roll-up:** NEW 33 real (including nine closure verifications and five original proposals); ALREADY-COVERED idea with a new target 8; ALREADY-ADOPTED reconfirmation 11; plus four verification findings in iteration 10.
- **Terminal record:** `deep_research.synthesis_complete` carries `stopReason: "maxIterationsReached"`.
- **Write boundary:** every artifact of this run lives under `research/lineages/r2-dsflash-llmgw/`; parent-packet writeback was deferred by the detached-lineage boundary and no file outside the lineage was created or modified.
