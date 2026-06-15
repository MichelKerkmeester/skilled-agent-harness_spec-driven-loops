# Improvement Iteration 004 — Tooling & developer experience

- **Model**: opus-4.8 (claude2, read-only)
- **Seat**: i04
- **top_pick**: Wire the routing-registry drift-guard + parent-skill-check into an automated pre-commit/CI gate — the guarantee already exists and is green; only execution is missing, and adding it (S effort, near-zero regret) makes the central C-plus claim true today.
- **improvements**: 5

## Analysis

I have comprehensive evidence. Here is my analysis.

---

# Improvement Research — Angle i04/5: Tooling & Developer Experience

**Scope read (all read-only):** `create_parent_skill_auto.yaml`, `parent-skill.md`, `parent-skill-check.cjs`, `skill_creation.md §10`, `run-skill-benchmark.cjs`, `score-skill-benchmark.cjs`, `advisor-probe.cjs`, the per-mode benchmark fixtures, `skill_advisor.py` (maps + dump), `aliases.ts`, the drift-guard test, the doctor `_routes.yaml`/`doctor_skill-advisor.yaml`, the 7 GitHub workflows, and the pre-commit hook.

**Headline:** The *structural* invariant (one graph-metadata.json) is exceptionally well-tooled — `parent-skill-check.cjs` checks 1–3 are target-aware, value-validated, and traversal-safe. But the *advisor-routing* half of the contract has a tooling cliff: every guard, dump, fixture, and the drift-guard test itself is **hardcoded to `deep-loop-workflows`**, and **nothing executes the drift-guard automatically**. The C-plus design's headline promise — "a map change without a matching registry change fails CI" (`skill_creation.md:1085`) — is currently **aspirational**: no CI or pre-commit gate runs it.

---

## What a second parent skill actually costs today (the C-plus gap, measured)

To wire one `lexical`/`alias-fold` mode for a *new* parent skill, a developer must hand-edit **all** of:

1. `DEEP_ROUTING_MODE_BY_KEY` — `skill_advisor.py:2320`
2. `DEEP_ROUTING_LEXICAL_PATTERNS` (the regex weights) — `skill_advisor.py:2326`
3. `DEEP_ROUTING_STRUCTURAL_PATTERNS` — `skill_advisor.py:2347`
4. `DEEP_ROUTING_SKILLS` tuple — `skill_advisor.py:2307`
5. Python `SKILL_ALIAS_GROUPS` — `skill_advisor.py:228`
6. TS `DEEP_MODE_BY_CANONICAL` — `aliases.ts:96`
7. TS `RAW_ALIAS_GROUPS` — `aliases.ts:5`
8. A **new** drift-guard test — the existing one hardcodes `registryPath` to deep-loop-workflows (`routing-registry-drift-guard.vitest.ts:32`) and can't generalize
9. `--dump-routing-maps` dumps **only** deep-loop-workflows maps — `skill_advisor.py:3780-3786`
10. New routing-parity fixtures (`routing-parity-deep-skills.vitest.ts`, `routing-parity-deep-council.vitest.ts` are deep-loop-specific)

The scaffolder helps with **none** of this — `create_parent_skill_auto.yaml:320-332` only emits a *warning*, and that warning isn't even in the human-facing `parent-skill.md` (it documents structure at `:38-54` but never mentions that lexical/alias-fold modes are inert until hand-wired). So a 2nd-skill builder reading the command doc learns the inert-routing reality only by running the auto workflow.

---

## Improvements (ranked)

### P1 — Wire the drift-guard + `parent-skill-check` into an automated gate `[TOP PICK]`
**Concretely:** Add a pre-commit entry (mirroring the existing card-sync block at `pre-commit:60-77`) that runs `routing-registry-drift-guard.vitest.ts` + `parent-skill-check.cjs` whenever `aliases.ts`, `skill_advisor.py`, or any `mode-registry.json` is staged; and/or a GitHub Actions job (the repo has 7 workflows, **none run vitest** — verified). 
**Rationale:** The guard already exists and is green; the *only* missing piece is execution. Today the central C-plus guarantee never fires automatically — drift is caught only if a human remembers to run the advisor suite. This is the cheapest way to make an already-built guarantee real, and it protects the live canonical skill on every commit. 
**Evidence:** `.github/workflows/` (7 files, no vitest); `.opencode/scripts/git-hooks/pre-commit` (runs doc-model-refs, comment-hygiene, card-sync, tool-ownership — not the drift-guard); claim of "CI" at `skill_creation.md:1085`. 
**Effort:** S · **Risk:** low · **Preserves invariants:** yes (execution only; parity fixtures stay green by construction).

### P1 — Make `parent-skill-check.cjs` target-aware (kill the false-pass) + assert registry→map coverage
**Concretely:** Check 4a does `fs.existsSync(DRIFT_GUARD_TEST)` against a **hardcoded constant** (`parent-skill-check.cjs:59-60`, used at `:283-288`) regardless of `target`, and 4b *skips* every non-canonical skill (`:300-301`). Net: running `/doctor:parent-skill <new-skill>` reports **PASS** for 4a because the *deep-loop-workflows* test exists — even though the new skill has zero advisor wiring and no parity guard. Fix: derive the expected per-skill drift-guard path from the target, and **FAIL** (not skip) when a target declares `lexical`/`alias-fold` modes but (a) has no per-skill drift-guard test, or (b) any `legacyAdvisorId` is absent from the dumped maps. This is the `/doctor:advisor-sync` capability the angle asks about, folded into the existing checker. 
**Rationale:** Converts the named C-plus footgun from a silent inert state into a hard, tooling-caught failure — and removes a *misleading green* that's worse than silence. This is the load-bearing DX fix for anyone building a 2nd parent skill. 
**Evidence:** `parent-skill-check.cjs:59-60, 283-288, 300-301`; no parity check in `doctor_skill-advisor.yaml` (verified empty). 
**Effort:** M · **Risk:** low · **Preserves invariants:** yes (read-only checker).

### P2 — Scaffold a drift-guard test stub + surface the inert-routing warning in the human docs
**Concretely:** Have `/create:parent-skill` emit a parameterized copy of `routing-registry-drift-guard.vitest.ts` pointed at the new registry (so wiring is *scaffolded*, not from-scratch), and add the `advisor_map_sync_note` (currently only in `create_parent_skill_auto.yaml:320-332`) to the human-facing `parent-skill.md` and `sk-doc §10`. 
**Rationale:** Today the 2nd-skill builder hits the inert-routing wall only at runtime. A stub + a visible warning turns ~6 hand-edits + a from-scratch test into "fill in the regex weights." 
**Evidence:** scaffolder warns but generates nothing on the advisor side (`create_parent_skill_auto.yaml:315, 320-332`); `parent-skill.md` lacks the warning (`:38-54`). 
**Effort:** S–M · **Risk:** low · **Preserves invariants:** yes.

### P2 — Add an advisory mode-precision signal to the skill-benchmark (don't replace the parity split)
**Concretely:** The benchmark scores **skill-id, never mode**: `expectedFromScenario` (`score-skill-benchmark.cjs:55-69`) reads `skillId/intentKeys/resources/assets/negativeActivation`, and `scoreD1Inter` (`advisor-probe.cjs:85-97`) matches the advisor's `.skill` only. Yet the fixtures **already carry** `expected.mode` and `expected.advisorLane` (`dlw-review-001.private.json`), and the advisor already exposes per-mode routing via `--deep-skill-routing-json` (`skill_advisor.py:3727`). Wire an **advisory** mode-precision signal (outside the weighted aggregate, like `D4_task_outcome`/`assetRecall` at `score-skill-benchmark.cjs:409-416`) so a report surfaces "right skill, wrong mode." 
**Rationale:** For a parent skill, wrong-mode-within-right-skill is the failure that matters most, and the benchmark verdict is silent on it. Keep it advisory — the parity fixtures already enforce mode *exactly and deterministically*, so this is signal-convergence in one report, **not** a correctness gap. The parity-fixture split is fine; don't fold mode into the weighted aggregate (would change v1 weights). 
**Evidence:** `score-skill-benchmark.cjs:55-69`; `advisor-probe.cjs:85-97`; `dlw-review-001.private.json` (`expected.mode`, `advisorLane`); fixture's own note: "mode-level precision is additionally enforced by the advisor routing-parity fixtures + the registry drift-guard." 
**Effort:** M · **Risk:** low · **Preserves invariants:** yes.

### P3 — Codegen the *projection maps* (not the weights) from the union of registries (cross-ref i01) — recommend NOT now
**Concretely:** Generate `DEEP_ROUTING_MODE_BY_KEY` / `DEEP_MODE_BY_CANONICAL` / alias-group keys from all parent-skill registries, demoting the drift-guard to a "generated file is fresh" lint (the `tool-ownership-map` gate at `pre-commit:80-96` is the precedent). 
**Rationale & honest caveat:** This removes only items 1, 6, 7 of the wiring list — the **regex weights** (items 2–4, the part that *actually makes lexical routing work*) must stay in code by explicit design (`skill_creation.md:1088`: moving weighted regex to JSON risks escaping corruption against exact thresholds). So codegen is a half-measure: it eliminates bookkeeping the drift-guard already protects cheaply, while the hard part remains manual. The deliberate "drift-guard over runtime-read/codegen" choice (`skill_creation.md:1087`) is sound; the real gap is **enforcement (P1), not maps-vs-codegen**. 
**Evidence:** `skill_creation.md:1087-1088`; `pre-commit:80-96`. 
**Effort:** L · **Risk:** med (touches the live advisor hot path) · **Preserves invariants:** yes if guarded.

---

## Honest "already near-optimal" notes
- **`parent-skill-check.cjs` checks 1–3** are genuinely strong: value-set validation for the 3-tier discriminator (`:244-261`), packet-path traversal safety (`:224-237`), and exact one-identity counting (`:140-185`). Don't touch these.
- **Not making the advisor read the registry at runtime** is the correct call (`skill_creation.md:1087`) — recommend *keeping* it; the fix is enforcing the drift-guard, not adding runtime coupling.
- **The benchmark's honesty about unscored dimensions** (Mode A normalizes over measured dims, `score-skill-benchmark.cjs:194-204`) is well-engineered; the only gap is mode-precision visibility (P2), not the scoring math.

**My single most-likely-wrong claim:** that *zero* automation runs the drift-guard. I verified `.github/workflows/` (no vitest) and the pre-commit hook (4 gates, no drift-guard), but I did not exhaustively trace every `.opencode/scripts/*` for a non-git-hook runner — a hidden invocation would downgrade P1-top from "make it real" to "make it broader."

===RESEARCH-JSON===
{"angle":"Tooling & developer experience for the parent-skill / deep-loop pattern","improvements":[{"title":"Wire the routing-registry drift-guard + parent-skill-check into pre-commit/CI","rationale":"The C-plus design's headline promise ('a map change without a matching registry change fails CI') is aspirational today — the green test exists but no GitHub workflow or pre-commit gate runs it, so drift is caught only if a human remembers. Cheapest way to make an already-built guarantee actually fire and protect the live skill every commit.","evidence":".github/workflows/ (7 files, none run vitest); .opencode/scripts/git-hooks/pre-commit (doc-model-refs/comment-hygiene/card-sync/tool-ownership only); skill_creation.md:1085","effort":"S","risk":"low","preserves_invariants":true,"priority":"P1"},{"title":"Make parent-skill-check.cjs target-aware + assert registry->advisor-map coverage (the /doctor:advisor-sync capability)","rationale":"Check 4a tests a hardcoded deep-loop-workflows test path regardless of target and 4b skips non-canonical skills, so /doctor:parent-skill <new-skill> reports PASS even when the new skill's lexical modes are completely inert and unguarded. Converts the named C-plus footgun from a misleading green into a hard tooling failure.","evidence":"parent-skill-check.cjs:59-60,283-288,300-301; doctor_skill-advisor.yaml has no registry==maps check","effort":"M","risk":"low","preserves_invariants":true,"priority":"P1"},{"title":"Scaffold a parameterized drift-guard test stub and surface the inert-routing warning in human docs","rationale":"The scaffolder only warns (and only in the auto YAML, not parent-skill.md), generating nothing on the advisor side; the drift-guard test hardcodes the deep-loop-workflows registry path so it cannot be reused. A stub + visible warning turns ~6 hand-edits and a from-scratch test into 'fill in the regex weights'.","evidence":"create_parent_skill_auto.yaml:315,320-332; parent-skill.md:38-54 (no inert warning); routing-registry-drift-guard.vitest.ts:32 (hardcoded registryPath)","effort":"S","risk":"low","preserves_invariants":true,"priority":"P2"},{"title":"Add an advisory mode-precision signal to the skill-benchmark (keep the parity-fixture split)","rationale":"The harness scores skill-id only (expectedFromScenario / scoreD1Inter ignore mode), yet fixtures already carry expected.mode + advisorLane and the advisor exposes per-mode routing via --deep-skill-routing-json. For a parent skill, right-skill/wrong-mode is the failure that matters and the benchmark is silent on it. Keep it advisory (not in the weighted aggregate) since parity fixtures already enforce mode exactly.","evidence":"score-skill-benchmark.cjs:55-69,409-416; advisor-probe.cjs:85-97; dlw-review-001.private.json (expected.mode/advisorLane); skill_advisor.py:3727","effort":"M","risk":"low","preserves_invariants":true,"priority":"P2"},{"title":"Codegen the advisor projection maps from the union of registries (cross-ref i01) — not recommended now","rationale":"Would remove only the bookkeeping maps (DEEP_ROUTING_MODE_BY_KEY/DEEP_MODE_BY_CANONICAL/alias keys) the drift-guard already protects cheaply; the regex weights that actually drive lexical routing must stay in code by explicit design, so it is a half-measure. The deliberate drift-guard-over-codegen choice is sound; the real gap is enforcement, not the maps.","evidence":"skill_creation.md:1087-1088; pre-commit:80-96 (tool-ownership generated+lint precedent); skill_advisor.py:2326-2366","effort":"L","risk":"med","preserves_invariants":true,"priority":"P3"}],"top_pick":"Wire the routing-registry drift-guard + parent-skill-check into an automated pre-commit/CI gate — the guarantee already exists and is green; only execution is missing, and adding it (S effort, near-zero regret) makes the central C-plus claim true today.","open_questions":["Is there any non-git-hook runner under .opencode/scripts that already invokes the advisor vitest suite that I did not trace? If so P1-top narrows to broadening coverage rather than introducing it.","Given only one parent skill exists today, should the parent-skill-check generalization (P1) be deferred until a 2nd skill is actually on the roadmap, or built now as a guardrail against the first attempt false-passing?","Should mode-precision become a hard benchmark dimension once a 2nd parent skill exists, or stay split across the deterministic parity fixtures permanently?"]}
===END===

## Improvements (structured)

```json
[
  {
    "title": "Wire the routing-registry drift-guard + parent-skill-check into pre-commit/CI",
    "rationale": "The C-plus design's headline promise ('a map change without a matching registry change fails CI') is aspirational today \u2014 the green test exists but no GitHub workflow or pre-commit gate runs it, so drift is caught only if a human remembers. Cheapest way to make an already-built guarantee actually fire and protect the live skill every commit.",
    "evidence": ".github/workflows/ (7 files, none run vitest); .opencode/scripts/git-hooks/pre-commit (doc-model-refs/comment-hygiene/card-sync/tool-ownership only); skill_creation.md:1085",
    "effort": "S",
    "risk": "low",
    "preserves_invariants": true,
    "priority": "P1"
  },
  {
    "title": "Make parent-skill-check.cjs target-aware + assert registry->advisor-map coverage (the /doctor:advisor-sync capability)",
    "rationale": "Check 4a tests a hardcoded deep-loop-workflows test path regardless of target and 4b skips non-canonical skills, so /doctor:parent-skill <new-skill> reports PASS even when the new skill's lexical modes are completely inert and unguarded. Converts the named C-plus footgun from a misleading green into a hard tooling failure.",
    "evidence": "parent-skill-check.cjs:59-60,283-288,300-301; doctor_skill-advisor.yaml has no registry==maps check",
    "effort": "M",
    "risk": "low",
    "preserves_invariants": true,
    "priority": "P1"
  },
  {
    "title": "Scaffold a parameterized drift-guard test stub and surface the inert-routing warning in human docs",
    "rationale": "The scaffolder only warns (and only in the auto YAML, not parent-skill.md), generating nothing on the advisor side; the drift-guard test hardcodes the deep-loop-workflows registry path so it cannot be reused. A stub + visible warning turns ~6 hand-edits and a from-scratch test into 'fill in the regex weights'.",
    "evidence": "create_parent_skill_auto.yaml:315,320-332; parent-skill.md:38-54 (no inert warning); routing-registry-drift-guard.vitest.ts:32 (hardcoded registryPath)",
    "effort": "S",
    "risk": "low",
    "preserves_invariants": true,
    "priority": "P2"
  },
  {
    "title": "Add an advisory mode-precision signal to the skill-benchmark (keep the parity-fixture split)",
    "rationale": "The harness scores skill-id only (expectedFromScenario / scoreD1Inter ignore mode), yet fixtures already carry expected.mode + advisorLane and the advisor exposes per-mode routing via --deep-skill-routing-json. For a parent skill, right-skill/wrong-mode is the failure that matters and the benchmark is silent on it. Keep it advisory (not in the weighted aggregate) since parity fixtures already enforce mode exactly.",
    "evidence": "score-skill-benchmark.cjs:55-69,409-416; advisor-probe.cjs:85-97; dlw-review-001.private.json (expected.mode/advisorLane); skill_advisor.py:3727",
    "effort": "M",
    "risk": "low",
    "preserves_invariants": true,
    "priority": "P2"
  },
  {
    "title": "Codegen the advisor projection maps from the union of registries (cross-ref i01) \u2014 not recommended now",
    "rationale": "Would remove only the bookkeeping maps (DEEP_ROUTING_MODE_BY_KEY/DEEP_MODE_BY_CANONICAL/alias keys) the drift-guard already protects cheaply; the regex weights that actually drive lexical routing must stay in code by explicit design, so it is a half-measure. The deliberate drift-guard-over-codegen choice is sound; the real gap is enforcement, not the maps.",
    "evidence": "skill_creation.md:1087-1088; pre-commit:80-96 (tool-ownership generated+lint precedent); skill_advisor.py:2326-2366",
    "effort": "L",
    "risk": "med",
    "preserves_invariants": true,
    "priority": "P3"
  }
]
```
