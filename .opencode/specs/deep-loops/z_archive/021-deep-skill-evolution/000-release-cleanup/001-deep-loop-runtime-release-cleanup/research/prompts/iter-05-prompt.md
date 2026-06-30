# Deep-Research Iter 5 — Sub-README consistency vs current code layout (+ secondary description-drift sweep)

> **Framework: RCAF (Role / Context / Action / Format).** CLEAR 5-check applied: Concrete (8 sub-README path list + ground-truth `ls` snapshots pre-supplied), Layered (3-step ordered plan), Explicit (DO NOT re-report DR-001..DR-026), Adjusted to SWE-1.6 (medium-density pre-planning, standard bundle-gate language), Reviewable (deterministic outputs).

---

## ROLE

You are a deterministic documentation auditor. Operate at SC-007 read-only scope: zero writes to `lib/`, `scripts/`, `tests/`, `storage/` of `.opencode/skills/deep-loop-runtime/`. Plus iter-3 DR-023 tightening: no writes to `.opencode/skills/system-spec-kit/mcp_server/deep-review/scripts/reduce-state.cjs`. You produce a markdown report with file:line citations and a JSONL-delta-shaped finding list. NO file writes — output to stdout only.

---

## CONTEXT

### Spec packet
- Spec folder: `.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/000-release-cleanup/001-deep-loop-runtime` (pre-approved, skip Gate 3).
- Phase: Phase 5 deep-research loop, iteration 5 of 10.
- Authorized by: `decision-record.md` ADR-006.
- Prior iters: 4 complete. 26 NOVEL findings (DR-001..DR-026) tracked. **All 26 DR-NNN are NOVEL relative to AF-0001..AF-0080**; do NOT re-report.

### Iter 5 PRIMARY focus

Verify the 8 sub-READMEs in `.opencode/skills/deep-loop-runtime/` for drift vs the current code layout:

| # | Sub-README path | LOC | What it claims |
|---|---|---|---|
| 1 | `lib/README.md` | 32 | 3 lib/ subdirs (council, coverage-graph, deep-loop) + per-domain README list |
| 2 | `lib/council/README.md` | 38 | 5 .cjs modules table + consumers + tests |
| 3 | `lib/coverage-graph/README.md` | 37 | 3 .ts modules + consumers + storage |
| 4 | `lib/deep-loop/README.md` | 35 | 10 .ts modules in "Helper Surfaces" + arc-009 lifecycle helpers |
| 5 | `scripts/README.md` | 45 | 4 .cjs entry-points + scripts/lib/cli-guards.cjs |
| 6 | `tests/README.md` | 47 | 5 test sub-dirs (council, helpers, integration, lifecycle, unit) + how-to-run |
| 7 | `tests/helpers/README.md` | 28 | 1 file (spawn-cjs.ts) |
| 8 | `storage/README.md` | 36 | 1 file (deep-loop-graph.sqlite) + lifecycle |

### Ground-truth `ls` output (pre-supplied — verify, don't rediscover)

```text
lib/                            -> council/, coverage-graph/, deep-loop/, README.md
lib/council/                    -> 5 .cjs (adjudicator-verdict-scoring, cost-guards, multi-seat-dispatch, round-state-jsonl, session-state-hierarchy) + README.md
lib/coverage-graph/              -> 3 .ts (coverage-graph-db, coverage-graph-query, coverage-graph-signals) + README.md
lib/deep-loop/                  -> 10 .ts (atomic-state, bayesian-scorer, executor-audit, executor-config, fallback-router, jsonl-repair, loop-lock, permissions-gate, post-dispatch-validate, prompt-pack) + README.md
scripts/                        -> convergence.cjs, query.cjs, status.cjs, upsert.cjs, lib/, README.md
scripts/lib/                    -> cli-guards.cjs
tests/                          -> council/, helpers/, integration/, lifecycle/, unit/, README.md
tests/council/                  -> 5 .vitest.ts (adjudicator-verdict-scoring, cost-guards, multi-seat-dispatch, round-state-jsonl, session-state-hierarchy)
tests/integration/              -> 7 .vitest.ts (convergence-script, query-script, review-depth-convergence, review-depth-graph, review-depth-validator, status-script, upsert-script)
tests/lifecycle/                -> 1 .vitest.ts (db-open-close)
tests/unit/                     -> 14 .vitest.ts (atomic-state, bayesian-scorer, cli-matrix, dispatch-failure, executor-audit, executor-audit-process-group, executor-config, fallback-router, jsonl-repair, loop-lock, permissions-gate, post-dispatch-validate, prompt-pack, spawn-cjs)
tests/helpers/                  -> spawn-cjs.ts, README.md
storage/                        -> deep-loop-graph.sqlite, README.md
```

### Iter 5 SECONDARY focus (continue iter-4 description-drift class-of-bug sweep)

DR-025 + DR-026 found 2/17 catalog↔source description-drift instances. Iter 4 sampled 4 sources (3 of 4 matched). Iter 5 spot-checks 3 more feature_catalog entries:

| # | Catalog file | Source file |
|---|---|---|
| A | `feature_catalog/02--prompt-rendering/01-prompt-pack.md:3` (description frontmatter) | `lib/deep-loop/prompt-pack.ts:1` (MODULE comment) |
| B | `feature_catalog/03--validation/01-post-dispatch-validate.md:3` | `lib/deep-loop/post-dispatch-validate.ts:1` |
| C | `feature_catalog/06--coverage-graph/01-coverage-graph-db.md:3` | `lib/coverage-graph/coverage-graph-db.ts:1` |

For each: compare catalog `description:` field vs source `// MODULE:` comment + nearest top JSDoc. Drift = different emphasis OR over-/under-specialization. Match = same concept.

**Verdict logic for class-of-bug**:
- 0/3 drift → "isolated instances" (DR-025/DR-026 are outliers) — downgrade recommendation
- 1/3 drift → "low prevalence" (4 of 17 ≈ 24%) — sample-more-sufficient
- 2/3 drift → "high prevalence" (≥6 of 17 ≈ 35%+) — recommend full-17 remediation packet
- 3/3 drift → "systemic" (all 17 likely drift) — escalate to P1 remediation packet

### Pre-supplied numeric claims to verify

1. `lib/README.md:22-25` table lists 3 lib/ subdirs — verify exact subdir names match `ls` (council, coverage-graph, deep-loop).
2. `lib/README.md:31` "Per-domain READMEs: lib/council/README.md, lib/coverage-graph/README.md" — claim says 2 READMEs but lib/ actually has 3 sub-READMEs (council, coverage-graph, deep-loop). **Suspect drift — verify**.
3. `lib/council/README.md:23-29` lists 5 .cjs files — verify each resolves and no extras/omissions.
4. `lib/coverage-graph/README.md:23-27` lists 3 .ts files — verify each resolves.
5. `lib/deep-loop/README.md:17-28` "Helper Surfaces" lists 10 .ts files — verify each resolves and count = 10.
6. `scripts/README.md:24-30` lists 4 .cjs files — verify each resolves.
7. `scripts/README.md:32-34` mentions `scripts/lib/cli-guards.cjs` — verify resolves.
8. `tests/README.md:24-31` lists 5 sub-dirs — verify each exists.
9. `tests/helpers/README.md:22-24` lists 1 file (spawn-cjs.ts) — verify resolves.
10. `storage/README.md:23-25` lists 1 file (deep-loop-graph.sqlite) — verify resolves.

### Pre-supplied cross-reference claims to verify

11. `lib/coverage-graph/README.md:35-36` cross-refs `lib/deep-loop/` and `storage/deep-loop-graph.sqlite` — both must resolve.
12. `lib/council/README.md:33-34` cross-refs `.opencode/skills/deep-ai-council/scripts/orchestrate-topic.cjs` and `orchestrate-session.cjs` — verify these resolve via rg.
13. `lib/council/README.md:38` cross-refs `.opencode/skills/deep-loop-runtime/tests/council/` — verify resolves.
14. `lib/deep-loop/README.md:30-35` lists arc-009 lifecycle helpers at paths in system-code-graph, system-spec-kit, system-rerank-sidecar — verify at least 3 of those file references resolve to actual files.
15. `tests/README.md:38-41` "How to run" cites `.opencode/skills/system-spec-kit/mcp_server/vitest.config.ts` — verify resolves.

### Anti-patterns to call out

- **False positives on stale paths**: if a path looks broken but resolves through a symlink or alias root, NOT a finding.
- **No re-reports**: anything in DR-001..DR-026 or AF-0001..AF-0080 already captured. Surface only NOVEL drift.
- **Mode discipline**: P1 if the drift causes a reader to look in the wrong place (e.g. omitted sub-README in a list, count off by ≥1). P2 if drift is stylistic (relative path vs absolute, slightly imprecise wording).

---

## ACTION (medium-density 3-step pre-plan)

### Step 1: Sub-README → `ls` reconciliation (PRIMARY focus, 8 files)

For each of the 8 sub-READMEs:

```bash
# In repo-root cwd
ls .opencode/skills/deep-loop-runtime/<dir>/
# Compare with the file/module list in <dir>/README.md
```

For each README:
1. Extract every file/module name claimed (table rows + bullet items + inline `\`path\`` refs).
2. Compare claimed set vs actual `ls` set: surface (a) modules in `ls` but not in README, (b) modules in README but not in `ls`.
3. Verify cross-references (paths in `## Related Resources` / `## Consumers` / `## How to Run`) resolve via `ls` or `test -f`.
4. Verify exact count claims (e.g. "5 cjs modules", "3 .ts modules", "10 modules").

**Acceptance criterion**: for each sub-README, emit a `### <readme path>` block in §A with `MATCH` or `DRIFT: <reason>`.

### Step 2: Secondary description-drift sweep (3 spot-checks)

For each of A/B/C in the SECONDARY focus table:

```bash
# Read catalog frontmatter description
sed -n '3p' .opencode/skills/deep-loop-runtime/feature_catalog/<NN>--<domain>/<NN>-<feature>.md

# Read source MODULE comment + nearest JSDoc
sed -n '1,30p' .opencode/skills/deep-loop-runtime/lib/<area>/<feature>.ts
```

Compare: does the catalog description match the source's emphasis? Drift signals:
- Different trigger condition (DR-025 pattern: "configured target" vs "quota exhaustion")
- Over-/under-specialization (DR-026 pattern: "executor reliability" for general primitive)
- Missing key function (e.g. catalog says only 1 thing, source has 2 functions)

**Acceptance criterion**: §B emits 3 rows (A/B/C) with `MATCH` or `DRIFT: <reason>` + verdict line.

### Step 3: Emit findings + class-of-bug verdict

For each DRIFT row in §A and §B, emit a DR-NNN block. Number sequentially starting at DR-027.

For SECONDARY focus, emit a one-paragraph verdict:
- "isolated instances" (0/3) — recommend close
- "low prevalence" (1/3) — recommend sample 3 more
- "high prevalence" (2/3) — recommend full-17 remediation packet
- "systemic" (3/3) — recommend P1 remediation packet

**Acceptance criterion**: §C lists every novel finding; §D summary table includes total/P0/P1/P2; §E gives class-of-bug verdict + numeric reasoning.

---

## FORMAT

Emit a markdown report to stdout with this exact structure:

```markdown
# Iter 5 — Sub-README consistency + description-drift class-of-bug sweep

## A. Sub-README → ls reconciliation (8 files)

### lib/README.md
- Claimed: <list>
- Actual ls: <list>
- Verdict: <MATCH | DRIFT: reason>

### lib/council/README.md
... (repeat for all 8)

## B. Description-drift secondary sweep (3 spot-checks)

| # | Catalog file:line | Source file:line | Verdict |
|---|---|---|---|
| A | feature_catalog/02--prompt-rendering/01-prompt-pack.md:3 | lib/deep-loop/prompt-pack.ts:1 | <MATCH | DRIFT: reason> |
| B | feature_catalog/03--validation/01-post-dispatch-validate.md:3 | lib/deep-loop/post-dispatch-validate.ts:1 | <MATCH | DRIFT: reason> |
| C | feature_catalog/06--coverage-graph/01-coverage-graph-db.md:3 | lib/coverage-graph/coverage-graph-db.ts:1 | <MATCH | DRIFT: reason> |

## C. Findings (DR-027 onwards)

### DR-027 | <severity P0/P1/P2> | <class> | <artifact:line>
<one-sentence description>

Evidence:
- <file:line>
- <file:line>

Recommended patch shape (text only — no actual edit):
- <one sentence>

(Repeat for DR-028, ...)

## D. Summary

- Total novel findings: <integer>
- P0: <int> / P1: <int> / P2: <int>
- Class breakdown: <table>
- LOG_ONLY count: <integer>
- SC-007 invariant: held
- Bundle gate: <PASS/FAIL>

## E. Class-of-bug verdict

Description-drift prevalence: <X>/3 (combined with iter-4's 2/4 = <X+2>/<7 sampled of 17>)
Recommendation: <one sentence>

## F. Next iter suggestion

<one paragraph: per strategy.md §4 iter 6 is "graph-metadata.json freshness: every key_files entry resolves, every related_to is current". Note iter-2 DR-016 already consolidated council coverage gap in graph-metadata — iter 6 will likely find narrow surface.>
```

---

## CONSTRAINTS (non-negotiable)

1. **SC-007 invariant**: no writes to `lib/`, `scripts/`, `tests/`, `storage/` of `.opencode/skills/deep-loop-runtime/`. Plus iter-3 DR-023 tightening: no writes to `system-spec-kit/mcp_server/deep-review/scripts/reduce-state.cjs`.
2. **No re-reports**: DR-001..DR-026 and AF-0001..AF-0080 are KNOWN. If a finding maps to any of those, do NOT emit; instead note "(re-report of DR-NNN/AF-NNNN, skipped)".
3. **Citation discipline**: every finding has at least one file:line evidence.
4. **Output discipline**: do NOT write files yourself. Output goes to stdout; orchestrator captures `--print` output.
5. **Counting discipline**: §C count must match §D total. If they drift, orchestrator rejects and re-dispatches.
6. **No exploratory mutations**: read-only operations only. Use `rg`, `grep`, `head`, `wc`, `find`, `cat`, `sed -n`. No `sed -i`, no `git add`, no `mv`, no `rm`.
7. **Sequential thinking**: use `mcp__sequential_thinking__sequentialthinking` with at least 5 thoughts before producing §A-§F output, per cli-devin SKILL.md §4 ALWAYS rule 14.

---

## VERIFICATION COMMANDS

```bash
# Verify all 8 sub-READMEs exist
ls .opencode/skills/deep-loop-runtime/lib/README.md \
   .opencode/skills/deep-loop-runtime/lib/council/README.md \
   .opencode/skills/deep-loop-runtime/lib/coverage-graph/README.md \
   .opencode/skills/deep-loop-runtime/lib/deep-loop/README.md \
   .opencode/skills/deep-loop-runtime/scripts/README.md \
   .opencode/skills/deep-loop-runtime/tests/README.md \
   .opencode/skills/deep-loop-runtime/tests/helpers/README.md \
   .opencode/skills/deep-loop-runtime/storage/README.md

# Verify ls baselines match ground-truth above
ls .opencode/skills/deep-loop-runtime/lib/
ls .opencode/skills/deep-loop-runtime/lib/council/
ls .opencode/skills/deep-loop-runtime/lib/coverage-graph/
ls .opencode/skills/deep-loop-runtime/lib/deep-loop/
ls .opencode/skills/deep-loop-runtime/scripts/
ls .opencode/skills/deep-loop-runtime/scripts/lib/
ls .opencode/skills/deep-loop-runtime/tests/
ls .opencode/skills/deep-loop-runtime/tests/helpers/
ls .opencode/skills/deep-loop-runtime/storage/

# SC-007 boundary check (orchestrator will re-verify after dispatch)
git diff --stat -- .opencode/skills/deep-loop-runtime/lib .opencode/skills/deep-loop-runtime/scripts .opencode/skills/deep-loop-runtime/tests .opencode/skills/deep-loop-runtime/storage   # expect empty
```

---

## MEMORY HANDBACK

None — orchestrator handles memory save at synthesis time (per strategy.md §6).
