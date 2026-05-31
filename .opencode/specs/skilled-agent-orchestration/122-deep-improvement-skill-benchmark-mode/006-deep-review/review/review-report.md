---
title: "Deep Review Report: deep-improvement Lane C + rename + three-lane docs (Packet 122)"
author: "deep-review loop (9× MiniMax-M2.7-highspeed breadth + 1× Opus-4.8 adversarial verify)"
date: "2026-05-31"
status: "complete"
severity_summary: "0 P0 / 4 P1 / 6 P2 (verified)"
iterations: 10
convergence: "verified — Opus 4.8 adversarially re-read every cited file:line; 0 P0 survive"
execution_mode: "report-only (no fixes applied; operator decides)"
---

# Deep Review Report — Packet 122 (deep-improvement skill-benchmark mode)

`.opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode`

Target: the deep-improvement skill's new **Lane C (skill-benchmark)** engine, the
`deep-agent-improvement → deep-improvement` rename, and the three-lane docs (phases 002–005).

> **Post-review remediation (2026-05-31):** the review loop itself was report-only. After review,
> the operator elected full cleanup, and all 11 verified findings (F-01…F-11) were applied and
> committed at `60030d7278` — three-lane docs corrected, `--advisor-mode` documented, Lane C polish
> + the stale 003 note fixed. Suite re-verified **209/209, exit 0**. The "open" status in the
> registry below reflects state **at review time**; treat F-01…F-11 as RESOLVED by that commit.

## 1. Executive Summary

**Verdict: CONDITIONAL — ship-quality code, documentation-accuracy fixes outstanding.**

The shipped Lane C code is **correct**. Opus 4.8 independently re-ran the suite from
`.opencode/skills/deep-improvement/scripts/` → **208 passed (20 files), exit 0**. No crash paths,
no security holes (the advisor subprocess uses argv-array `spawnSync`, no `shell:true`; d5 path-escape
guard and contamination substring-matching are sound), the rename is complete and consistent across
both the TypeScript and Python advisor surfaces (no split-brain), and `loop-host.cjs` is **purely
additive** — Lane A / Lane B plans are byte-identical (`git show --stat 40d1ca5543` touches no Lane A/B
module; the three mode-sets are disjoint).

The 9-iteration MiniMax breadth pass produced **64 raw findings (20 P0 / 19 P1 / 22 P2)** but was
**heavily false-positive**. Opus adversarial verification (re-reading every cited `file:line`) confirmed
**10**, rejected **18+** P0/P1 claims as hallucinated or misclassified, and added **2 NEW** the breadth
pass missed. Two illustrative rejections:

- **iter1's entire premise** targeted `scorer.cjs:1000` and a flat `[^}]*` regex at `router-replay.cjs:59`
  — **those files/lines do not exist**; the real parser is a brace-depth, string-skipping scanner.
- **iter5 escalated cosmetic doc gaps to 13×P0**, citing a `template_rules.json` "mandate" at line
  numbers that don't exist — the file is 36 lines and marks those sections `recommendedSections` /
  `optional`, **not required**.

**Net verified residue: 0 P0 / 4 P1 / 6 P2 — all documentation-accuracy or polish.** Both
operator-pre-flagged findings are **confirmed**: the agent/command/catalog are not yet fully three-lane
(P1), and the Lane C reference/asset docs are inconsistent with the skill's own Lane A/B convention (P2,
**not** iter5's false 13×P0).

## 2. Planning Trigger

**Does this review require a planning cycle?** NO.

Zero P0; the four P1 items are single-line / mirror-sync documentation corrections, not architectural
work. No spec or plan revision is required. The fixes fit one focused follow-up edit pass (a Level-1/2
spec folder at most). The code under review needs **no change to ship**; the outstanding items make the
*documentation* accurately describe the already-correct three-lane code.

## 3. Active Finding Registry

Verified findings only (the Opus-confirmed set). Severity is the **post-verification** severity; where
Opus revised a MiniMax severity, the origin is noted in §9.

| ID | Severity | File:Line | Issue | Fix | Status |
| -- | -------- | --------- | ----- | --- | ------ |
| F-01 | P1 | `.opencode/agents/deep-improvement.md:44` | "two co-equal lanes" — omits Lane C (skill-benchmark); awareness block stale since the 121 era | → "three co-equal lanes" + one-sentence Lane C clause (canonical source) | open |
| F-02 | P1 | `.claude/agents/deep-improvement.md:29` + `.gemini/agents/deep-improvement.md:29` | both mirrors carry the identical "two co-equal lanes" string | mirror-sync the F-01 correction (NB: `.codex` has **no** per-agent md file — parity is via `.codex/config.toml`; do **not** create a phantom `.codex/agents/deep-improvement.toml`) | open |
| F-03 | P1 (NEW) | `.opencode/skills/deep-improvement/feature_catalog/feature_catalog.md:277` | "`VALID_MODES` is a closed two-value set" — `loop-host.cjs:31` has **three** (`agent-improvement`, `model-benchmark`, `skill-benchmark`); sentence also omits the skill-benchmark route | → "closed three-value set" + add `--mode=skill-benchmark` → `run-skill-benchmark.cjs` route | open |
| F-04 | P1 | `.opencode/commands/deep/start-skill-benchmark-loop.md:43` | D1-inter mislabeled as unbuilt "live-mode follow-on / unscored-mode-a" — it **is** built + deterministic (`advisor-probe.cjs`, `score-skill-benchmark.cjs:107-135`), opt-in via `--advisor-mode=python`; contradicts `scoring_contract.md:9` | reword: D1-inter built-but-opt-in; keep only D4 + Mode B as follow-on | open |
| F-05 | P1 | `references/skill-benchmark/operator_guide.md` (Invocation) + `start-skill-benchmark-loop.md` | `--advisor-mode` — the **only** doc path to the built D1-inter feature — is undocumented in both canonical operator docs (`run-skill-benchmark.cjs:49,54,92` reads it) | add `[--advisor-mode=python]` to documented invocation, one-line "scores D1-inter, deterministic SQLite advisor, off by default" | open |
| F-06 | P2 | `.opencode/skills/deep-improvement/scripts/shared/loop-host.cjs:63-73` | `SKILL_BENCHMARK_RUN_OPTIONS` dead-forwards `profile`, `state-log`, `label`, `grader`, `k-runs`; `run()` consumes none (silently absorbed by permissive `_args.cjs`) | trim to the genuinely-consumed flags (`fixtures-dir`, `output`, `trace-mode`, `advisor-mode`) | open |
| F-07 | P2 | `assets/skill-benchmark/default_profile.json:4` | `weights` block + implied `--profile` override are unwired; `WEIGHTS` is hardcoded at `score-skill-benchmark.cjs:19` | wire `--profile` loading **or** annotate `weights` as a forward-looking reference profile not yet consumed by Mode A | open |
| F-08 | P2 | `references/skill-benchmark/{scoring_contract,operator_guide,scenario_authoring}.md` (+ 2 JSON assets) | no frontmatter / no `## 1. OVERVIEW` / un-numbered sentence-case H2s — inconsistent with the skill's **own** Lane A/B reference docs (which carry `title/type/status` + `## 1. OVERVIEW` + numbered ALL-CAPS). **Operator-flagged.** Consistency polish, not a structural violation (`template_rules.json` marks these recommended/optional; raw-JSON assets are a repo-wide pattern) | add `title/type/status` frontmatter + numbered `## 1. OVERVIEW` + ALL-CAPS H2s to the three reference docs to match the Lane A/B siblings | open |
| F-09 | P2 | `scripts/skill-benchmark/d5-connectivity.cjs:48` | missing-SKILL.md early-return sets `score:0`, but the normal penalty path (line 91-92) yields `60` for the same one-P0 condition (verdict unaffected — `gateFailed:true` on both paths — but raw score differs for debug/compare consumers) | return `score:60` in the early-return branch, or fall through to the shared penalty computation | open |
| F-10 | P2 | `scripts/tests/skill-benchmark.vitest.ts:188-200` | e2e runs `--skill cli-codex` (no fixtures) so `scenarioRows` is empty and it asserts only schema/mode/dual-artifact; plus uncleaned temp dir + uncovered ambiguity/negative-fixture cases (unit scorer tests DO cover scoring, so not false-confidence) | assert `scenarioRows.length > 0` via the deep-improvement skill (ships a real fixture); add `afterAll` cleanup + the two edge-case rows | open |
| F-11 | P2 | `…/003-skill-rename-deep-improvement/implementation-summary.md:60` | stale "Not committed yet … parallel-session-revert hazard" — the rename landed at `caf072e39e` (in HEAD); spec "Complete" status is now correct, only this note is stale | update to "Committed at `caf072e39e`", drop the hazard caveat (`completion_pct:100` is accurate) | open |

## 4. Remediation Workstreams

**WS-1 — Three-lane documentation correction (P1: F-01, F-02, F-03, F-04).** Make the agent, the three
runtime mirrors, the feature catalog, and the command file accurately describe the three-lane skill.
All single-line / mirror-sync edits. Est: ~20 min. No code changes. *This is the operator's first
pre-flagged finding.*

**WS-2 — D1-inter / `--advisor-mode` doc surfacing (P1: F-05, overlaps F-04).** Document the built,
opt-in D1-inter path in the operator guide + command file so the 4-dim→5-dim capability is discoverable.
Est: ~10 min. Markdown only.

**WS-3 — Lane C reference/asset template alignment (P2: F-08).** Bring the three Lane C reference docs
into line with the skill's own Lane A/B convention (frontmatter + numbered OVERVIEW + ALL-CAPS H2s).
Est: ~30 min. Markdown only. *This is the operator's second pre-flagged finding — confirmed real but
P2, not the breadth pass's false 13×P0.*

**WS-4 — Lane C code polish (P2: F-06, F-07, F-09, F-10).** Trim dead-forwarded options; wire-or-annotate
the `--profile`/`weights` scaffold; align d5 early-return score; tighten e2e coverage. Est: ~1–2 h. Small,
low-risk code edits + test additions; re-run the 208-test suite after.

**WS-5 — Stale spec-doc note (P2: F-11).** One-line continuity correction in the 003 impl-summary.
Est: ~2 min.

## 5. Spec Seed

N/A — no planning cycle triggered. All findings are point-fixes, not feature work. If the operator
elects to action them, a single Level-1/2 spec folder (e.g. `122-…/007-three-lane-doc-reconciliation`)
covering WS-1 + WS-2 + WS-3 + WS-5 (docs) and optionally WS-4 (code polish) is sufficient.

## 6. Plan Seed

N/A — no planning cycle triggered. Suggested execution order if actioned: WS-1 → WS-2 → WS-3 → WS-5
(all docs, no test impact) then WS-4 (code, re-run suite). WS-1's canonical edit
(`.opencode/agents/deep-improvement.md`) must land **before** the `.claude`/`.gemini` mirror-sync.

## 7. Traceability Status

| # | Dimension (iteration) | Reviewed | Verdict (post-verification) |
| - | --------------------- | -------- | --------------------------- |
| 1 | Lane C scorer correctness | Yes | PASS (all iter1 parse-bug P0s hallucinated; 1 real P2 → F-09) |
| 2 | Lane C orchestrator + harness | Yes | PASS (all iter2 crash P0s false; guards already present) |
| 3 | loop-host non-regression | Yes | PASS (purely additive; Lane A/B byte-identical) |
| 4 | Rename completeness | Yes | PASS (no split-brain; legacy phrases route to `deep-improvement`) |
| 5 | sk-doc template alignment ⭐ | Yes | 1×P2 → F-08 (iter5's 13×P0 rejected — fabricated "mandate") |
| 6 | Three-lane consistency ⭐ | Yes | 3×P1 → F-01/02/03 + F-04 (operator-flagged; confirmed) |
| 7 | Security + tests | Yes | PASS security; 1×P2 test-coverage → F-10 |
| 8 | Spec-folder doc integrity / completion claims | Yes | 1×P2 stale note → F-11 (no overclaim; rename IS committed) |
| 9 | Docs-vs-code drift | Yes | 1×P1 → F-03 (scoring_contract weights confirmed accurate; catalog "two-value" is the drift) |
| 10 | Opus 4.8 adversarial verify + gap-fill | Yes | CONDITIONAL — 0 P0 survive |

⭐ = operator-pre-flagged priority dimension.

## 8. Deferred Items

Intentional follow-on (NOT defects; out of scope for packet 122 by design):

- **D4 (usefulness ablation)** — pluggable-grader ablation, follow-on lane.
- **Mode B (live in-situ trace)** — live trace capture + A↔B divergence finding.
- `--profile` weight-override **wiring** (F-07 documents the scaffold; building the loader is optional
  future work).

## 9. Audit Appendix

**Method.** Packet-local worker pool (mirrors the 001/002 precedent), used transparently because the
canonical `/deep:start-review-loop` runs one convergence-driven executor per invocation and cannot
express the operator-requested fixed split of **9× MiniMax-M2.7-highspeed + 1× Opus-4.8**. Read-only,
externalized-state, per-iteration-JSONL contracts were preserved. *(This exact capability gap is what
the new phase `123-deep-loop-parallel-fanout/007-native-per-iteration-model-schedule` — created in
parallel — is specified to close.)*

**Iterations.**
- Iters 1–9 (`hs/iterations/iteration-001..009.md`): MiniMax-M2.7-highspeed, one dimension each, all
  `exit=0` (`orchestration-status.log`). 64 raw findings (20 P0 / 19 P1 / 22 P2).
- Iter 10 (`opus/iterations/iteration-010.md`): Opus 4.8 adversarial verification — re-read every cited
  `file:line`; **verified 10, rejected 18+, 2 new**; independently re-ran the test suite.

**Verification ground-truth (Opus, this pass).**
- Test suite: **208 passed, 20 files, exit 0** (run from `scripts/`; "No test files found" is a wrong-cwd
  artifact, not a red suite).
- Both packet commits in HEAD: `caf072e39e` (rename), `40d1ca5543` (Lane C build).
- No advisor split-brain: TS `aliases.ts`/`explicit.ts`/`fusion.ts` carry no rename tokens (grep hits
  were in compiled `dist/`); Python has 35 `deep-improvement` refs + 6 legacy aliases all → new id.

**Key rejected false-positives (full detail in `opus/iterations/iteration-010.md` §"Rejected / revised").**
- iter1 ×5: parse-bug P0s against nonexistent `scorer.cjs:1000` / flat-regex parser — real parser is a
  brace-depth string-skipping scanner (the "recommended fix" is already the implementation).
- iter2 ×8: ReferenceError / uncaught-JSON-crash / NaN / `"undefined"`-string P0s — every cited guard
  already exists and is exercised by passing tests.
- iter3 ×8: filed PASS-evidence as P2 findings (not findings).
- iter4 + iter6-codex: "`command-deep-agent-improvement` routes nowhere" — false; legacy phrases route
  to `deep-improvement` (weight 3.2); the missing `owning_skill` key is documented intentional scope-lock.
- iter5 ×16: 13×P0 + 3×P1 for missing-frontmatter/overview — grounded in fabricated `template_rules.json`
  "mandates" at non-existent lines; downgraded to a single consolidated P2 (F-08).
- iter7: security alarm — advisor-probe argv-array `spawnSync` (no shell), d5 path-escape guard, and
  substring-only contamination-lint are all sound.

**Convergence.** Verified rather than threshold-based: the final adversarial pass re-grounded every
surviving finding in re-read source, and **0 P0 survive**. Residual = 4 P1 + 6 P2, all docs/polish.

**Execution mode.** report-only — **no fixes were applied during this loop** (operator decides).
