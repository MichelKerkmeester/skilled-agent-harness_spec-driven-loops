---
title: "Follow-Ups: 005-cross-cutting-quality"
description: "Six concrete follow-ups surfaced by the consolidated changelog for the cross-cutting quality umbrella. Each entry names what stalled or remained open, why it matters and the next concrete action."
trigger_phrases:
  - "005-cross-cutting-quality follow-ups"
  - "cross-cutting quality follow-ups"
  - "playbook audit follow-ups"
importance_tier: "normal"
contextType: "implementation"
---

# Follow-Ups: 005-cross-cutting-quality

> Six open follow-ups surfaced by the consolidated [CHANGELOG.md](./CHANGELOG.md). Read the changelog for shipped work. Read this for what remains.
>
> **Spec folder:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/005-cross-cutting-quality/`

---

## 1. Phase 003 skill-docs-alignment has not executed

**What happened:** Phase 003 is a phase parent with three planned children: skill MDs audit, root README update and embedder-pluggability narrative. All three are scaffolded with spec.md files but no implementation has shipped.

**Why it matters:** The 016-019 work changed embedder defaults across mk-spec-memory and CocoIndex, added the retrieval-rescue layer and reshaped the skill-advisor architecture. Skill docs may still reference old defaults (gemma instead of nomic or jina-v3), describe the pre-rescue retrieval flow or document pre-016 architecture. A new contributor reading the SKILL.md files will get an inaccurate mental model.

**Concrete next action:** Dispatch the three children as native Opus or Sonnet agents in parallel. Child 001 sweeps all `.opencode/skills/*/SKILL.md`, `README.md`, `references/` and `assets/` for stale gemma or nomic refs and outdated architecture claims, producing an audit CSV with P0/P1 fixes and P2/P3 backlog. Child 002 refreshes the root README with current embedder defaults plus architecture summary. Child 003 authors a canonical embedder-pluggability narrative covering mk-spec-memory plus CocoIndex embedder architecture, out-of-box support and swap mechanisms. The narrative becomes the single source of truth that other docs link to.

---

## 2. Phase 004 sk-doc compliance pending (Phase C and D)

**What happened:** Phase 004 shipped Phase A (historical FORMAT.md convention plus symlink in mcp-coco-index) and Phase B (benchmark folder population for mk-spec-memory and mcp-coco-index). Phase C (write sk-doc-compliant `benchmark_report.md` and README.md files via @markdown agents) and Phase D (validation) are pending.

**Why it matters:** The shipped benchmark folders contain raw CSV plus JSONL evidence but lack the narrative reports that make them operator-readable. Anyone asking "which embedder is the production default and why?" still has to read the parent spec packets rather than land directly on a benchmark folder and get an answer.

**Concrete next action:** Dispatch @markdown agents to author `benchmark_report.md` plus `README.md` for both adopters following the canonical `benchmark_creation.md` template. Then run sk-doc `validate_document.py` against both report files. Acceptance: both reports validate clean, both READMEs link to the report, both folders pass `validate.sh --strict` on their parent packets.

---

## 3. Phase 007 pipx repair blocked on operator config

**What happened:** Phase 005 diagnosed a pipx versus local-editable install drift in CocoIndex. The preferred `pipx install --force --editable` repair failed under sandbox permissions when pipx tried to rotate logs outside writable roots. Phase 007 is a scaffold-only follow-on awaiting operator-side pipx config.

**Why it matters:** Until the repair runs, the bench harness loads from a stale non-editable pipx install missing newer modules (reranker.py, fts_index.py, fusion.py, registered_embedders.py). This makes benchmark results harness-stale rather than production-truthful and threatens the integrity of any reranker or hybrid-search measurement that uses the PATH `ccc` binary.

**Concrete next action:** Operator-side: ensure `~/.local/pipx` is writable outside the repo sandbox (this means running outside `--sandbox` or with explicit pipx-writable paths in the sandbox config). Then dispatch phase 007. Acceptance: `pipx package direct-url` shows `editable: true`, previously missing modules import cleanly from the pipx environment and `which ccc` resolves to the production-equivalent path. After phase 007 ships, rerun the bench-off harness and compare results against the pre-repair baseline to confirm no measurement drift.

---

## 4. Phase 008 vitest stabilization deferred

**What happened:** Phase 008 inventoried 168 pre-existing vitest failures across 33 test files in mk-spec-memory's `mcp_server`. The failures cluster into 5 categories: 13 missing mock exports in `stage1-expansion.vitest.ts`, 25 MCP connection closures in `runtime-routing.vitest.ts`, 7 PID lease timeouts in `launcher-lease.vitest.ts`, 127 assertion-drift cases across 4 test files and 4 flag/config mismatches in 2 test files. The remediation plan exists per cluster but execution is deferred.

**Why it matters:** The vitest suite is red. Today this is acceptable because production code is not broken (focused vitests and pytest run green) and the failures trace to pre-existing infrastructure plus fixture drift. But a red suite erodes trust over time. New contributors cannot tell a real regression from the inherited 168 failures.

**Concrete next action:** Pick one cluster per session as opt-in operator work. Suggested order by leverage: (a) cluster 5 (4 flag/config mismatches in `profile-db-filename.vitest.ts`) is smallest and most likely to be a quick win, (b) cluster 1 (13 missing mock exports in `stage1-expansion.vitest.ts`) is bounded to one file, (c) cluster 4 (127 assertion-drift cases) is the largest and should come last after the smaller clusters validate the remediation pattern. Acceptance per cluster: that cluster's tests turn green, no new failures introduced, suite-wide count drops by the expected delta.

---

## 5. Periodic playbook-fairness rerun

**What happened:** Phase 001 shipped 3 audit CSVs (fairness, tool coverage, scenario expansion) via a reproducible JavaScript helper. The audit froze the cat-24 fixture-surgery lesson into systematic checks. The helper supports rerun for future audits.

**Why it matters:** New mk-spec-memory MCP tools have already been added since the audit (the 002 stack added embedder_list, embedder_set, embedder_status, plus others from later packets). Those tools have no playbook scenario coverage. New cat-* surgery lessons should feed back into the inventory. Without a periodic rerun, the audit goes stale.

**Concrete next action:** Add the rerun to a quarterly or semi-annual operator cadence. Each pass: regenerate the 3 CSVs via `evidence/generate-playbook-quality-audit.js`, diff against the previous pass, flag new tools without scenario coverage, flag new cat-* surgery lessons that need fixture additions. Treat a clean diff as the durable signal that the playbook is in sync with the live MCP surface.

---

## 6. Deep-review cadence after the 20-iteration arc

**What happened:** Phase 002 ran a 20-iteration deep-review with cli-devin SWE-1.6 on the 016-019 embedder and rescue architecture. The review found 3 confirmed P0 findings plus P1/P2 groups across 8 dimensions and a 7-iteration remediation re-review verified closure against commit `ba6816a49`.

**Why it matters:** The 20-iteration review pattern is a heavy investment (multi-hour wall-clock, significant context consumption). Running it on every release is overkill. Running it never is risky. The right cadence is somewhere in between and has not been defined.

**Concrete next action:** Define a tiered review cadence. Tier 1: a lighter 5-iteration diff-only sweep per significant release (anything that touches the embedder layer, retrieval pipeline or rescue logic). Tier 2: a 10-iteration sweep on the changed surface every quarter. Tier 3: a full 20-iteration sweep before any major architectural change (e.g. shared factory extraction in 003-skill-advisor-stack follow-up #1). Document the cadence in a `references/review-cadence.md` so future sessions know which tier to invoke.
