# Deep-Research Iter 4 — feature_catalog + manual_testing_playbook path-ref + cross-doc reconciliation sweep

> **Framework: RCAF (Role / Context / Action / Format).** CLEAR 5-check applied: prompt is Concrete (exact file enumeration + count claims pre-supplied), Layered (4-step ordered plan with acceptance criteria), Explicit (DO NOT re-report DR-001..DR-024 / AF-0001..AF-0080), Adjusted to model (SWE-1.6, medium-density pre-planning, no defensive bundle-gate tightening), Reviewable (deterministic outputs).

---

## ROLE

You are a deterministic documentation auditor. You operate at SC-007 read-only scope: zero writes to `lib/`, `scripts/`, `tests/`, `storage/`, plus the iter-3 DR-023 tightening (no writes to `system-spec-kit/mcp_server/deep-review/scripts/reduce-state.cjs`). You produce a markdown report with file:line citations and a JSONL-delta-shaped finding list.

---

## CONTEXT

### Spec packet
- Spec folder: `.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/000-release-cleanup/001-deep-loop-runtime` (pre-approved, skip Gate 3).
- Phase: Phase 5 deep-research loop, iteration 4 of 10.
- Authorized by: `decision-record.md` ADR-006.
- Prior iters: iter 1 (cross-doc consistency, 11 findings DR-001..DR-011), iter 2 (test-coverage map + graph-metadata council consolidation, 5 findings DR-012..DR-016), iter 3 (integration-point completeness, 8 findings DR-017..DR-024). **All 24 DR-NNN findings are NOVEL relative to `findings/audit-findings.jsonl` (AF-0001..AF-0080).**

### Ground-truth enumeration (pre-supplied — verify, don't rediscover)

**feature_catalog/** has 7 domain folders + 1 root index = **18 .md files** total (17 features + 1 index):
- `feature_catalog.md` (root index, 357 LOC)
- `01--executor/` → 3 files (01-executor-config, 02-executor-audit, 03-fallback-router)
- `02--prompt-rendering/` → 1 file (01-prompt-pack)
- `03--validation/` → 1 file (01-post-dispatch-validate)
- `04--state-safety/` → 4 files (01-atomic-state, 02-jsonl-repair, 03-loop-lock, 04-permissions-gate)
- `05--scoring/` → 1 file (01-bayesian-scorer)
- `06--coverage-graph/` → 3 files (01-coverage-graph-db, 02-coverage-graph-query, 03-coverage-graph-signals)
- `07--script-entry-points/` → 4 files (01-convergence-script, 02-upsert-script, 03-query-script, 04-status-script)

**manual_testing_playbook/** has 7 domain folders + 1 root index = **18 .md files** total (17 scenarios + 1 index):
- `manual_testing_playbook.md` (root index, 415 LOC)
- `01--executor/` → 3 files (001-executor-config, 002-executor-audit, 003-fallback-router)
- `02--prompt-rendering/` → 1 file (004-prompt-pack)
- `03--validation/` → 1 file (005-post-dispatch-validate)
- `04--state-safety/` → 4 files (006-atomic-state, 007-jsonl-repair, 008-loop-lock, 009-permissions-gate)
- `05--scoring/` → 1 file (010-bayesian-scorer)
- `06--coverage-graph/` → 3 files (011-coverage-graph-db, 012-coverage-graph-query, 013-coverage-graph-signals)
- `07--script-entry-points/` → 4 files (014-convergence-script, 015-upsert-script, 016-query-script, 017-status-script)

### Pre-supplied numeric claims to verify

1. `feature_catalog.md:31` says **"17 entries"** — verify, AND verify the Category/Coverage table at L33-41 sums to 17 (3+1+1+4+1+3+4=17).
2. `manual_testing_playbook.md:47` says **"17 deterministic scenarios across 7 categories"** — verify, AND verify the per-domain `(N scenarios)` claims at sections §6-§12 each match the folder file count.
3. Both indices have a TABLE OF CONTENTS at the top — feature_catalog has 8 sections (OVERVIEW + 7 domains numbered 2-8); playbook has 14 sections (5 global + 7 domains numbered 6-12 + 2 cross-refs).
4. Playbook §14 FEATURE CATALOG CROSS-REFERENCE INDEX at L394-414 maps DLR-001..DLR-017 → F001..F017 — every link target must resolve.

### Pre-supplied claim/folder offset structure (NOT a defect — confirm understanding)

- feature_catalog folder names use `0N--` for N=1..7, but the catalog **section numbers** are 2-8 (because OVERVIEW takes slot 1). Example: `01--executor` is `## 2. EXECUTOR`. **This is internal and consistent; cross-folder reference is by folder path, not section number.**
- playbook folder names use `0N--` for N=1..7, but the playbook **section numbers** for the 7 domains are 6-12 (because 5 global sections precede). Example: `01--executor` is `## 6. EXECUTOR`. **Also internal and consistent.**
- Cross-doc reference between catalog and playbook is by feature-NUMBER (F001↔DLR-001) and folder-PATH, NOT by section number. The playbook §14 cross-reference index uses paths.

---

## ACTION (medium-density 4-step pre-plan)

### Step 1: Enumerate every path reference inside the 36 .md files

For each of the 18 + 18 = 36 .md files:

```bash
# In repo-root cwd, with .opencode/skills/deep-loop-runtime as the skill root
rg -n --no-heading \
   -e '\]\(\.?\.?/?[^)]+\.md[^)]*\)' \
   -e '\]\(\.?\.?/?[^)]+\.cjs[^)]*\)' \
   -e '\]\(\.?\.?/?[^)]+\.ts[^)]*\)' \
   -e '`[a-zA-Z./0-9_-]+\.(md|cjs|ts|json|sqlite)`' \
   -e '`[a-zA-Z./0-9_-]+(/[a-zA-Z./0-9_-]+)+`' \
   .opencode/skills/deep-loop-runtime/feature_catalog \
   .opencode/skills/deep-loop-runtime/manual_testing_playbook
```

For each hit:
- Resolve the target path against (a) the file's own directory, (b) the skill root `.opencode/skills/deep-loop-runtime/`, (c) the repo root.
- If the path resolves in any of (a)/(b)/(c), it's RESOLVED.
- If it resolves nowhere, it's BROKEN — emit DR-NNN finding with severity P1 + class `path-ref-broken`.
- Anchors and section IDs (`#1--overview` etc.) are NOT checked for this iter (out of scope).

**Acceptance criterion**: total cited / resolved / broken counts must be present in the Format section. Spot-check at least 5 broken hits to confirm they're true negatives (no symlink rescue, no alias rescue) before emitting findings.

### Step 2: Cross-reference count verification

Verify each claim from Context §"Pre-supplied numeric claims":

1. Read `feature_catalog/feature_catalog.md:29-41` — verify "17 entries" + table sums to 17.
2. Read `manual_testing_playbook/manual_testing_playbook.md:45-47` — verify "17 deterministic scenarios".
3. For each playbook §6-§12, verify the `"covers N scenarios"` line matches the folder file count for that domain.
4. For each playbook §14 row, verify the F00N target resolves and the scenario file resolves.

**Acceptance criterion**: every claim verified PASS or emit a DR-NNN finding with exact L line + expected vs actual.

### Step 3: 1:1 pairing verification (catalog ↔ playbook)

Build a 17-row pairing table:

| F-id | Catalog file (relative to feature_catalog/) | DLR-id | Playbook file (relative to manual_testing_playbook/) | Domain match | Slug match |
|------|---|---|---|---|---|
| F001 | 01--executor/01-executor-config.md | DLR-001 | 01--executor/executor-config.md | ✓ | ✓ |
| F002 | 01--executor/02-executor-audit.md | DLR-002 | 01--executor/executor-audit.md | ✓ | ✓ |
| ... | ... | ... | ... | ... | ... |

If any row has `Domain match = ✗` or `Slug match = ✗`, emit DR-NNN finding (P1 if structural, P2 if cosmetic).

Also check that each pair's `description` frontmatter matches (catalog feature file's `description:` field vs playbook scenario file's underlying feature claim). Drift signals stale cross-doc sync.

**Acceptance criterion**: full 17-row table emitted; any drift surfaced as DR-NNN.

### Step 4: Secondary cross-doc consistency

a. Per-feature file structural shape — spot-check 3 catalog entries + 3 playbook entries for the 4-section / 5-section template conformance:
   - Catalog: OVERVIEW + CURRENT REALITY + SOURCE FILES + SOURCE METADATA
   - Playbook: OVERVIEW + SCENARIO CONTRACT + TEST EXECUTION + EXPECTED OUTCOME + FAILURE MODES (verify by reading)

b. Internal path-refs from per-feature files INTO `lib/`, `scripts/`, `tests/` — these MUST resolve. If any per-feature file cites a `lib/deep-loop/*.ts` or `tests/unit/*.vitest.ts` that doesn't exist, emit P1 finding (this is the documentation-vs-reality gap).

c. Cross-doc anchor: catalog says "F011 is Coverage graph DB" (`feature_catalog/06--coverage-graph/01-coverage-graph-db.md`). Playbook says "DLR-011 is Coverage graph DB" (`manual_testing_playbook/06--coverage-graph/coverage-graph-db.md`). The DESCRIPTIONS in both per-feature files must agree word-for-word in the OVERVIEW section. If they drift, emit P2 finding.

**Acceptance criterion**: each sub-check yields a clear PASS/FAIL with file:line citation.

---

## FORMAT

Emit a markdown report to stdout with this exact structure:

```markdown
# Iter 4 — feature_catalog + playbook path-ref + cross-doc sweep

## A. Path-ref resolution summary

- Total cited: <integer>
- Resolved: <integer>
- Broken: <integer>
- Sample 5 broken (or "none"): <list with file:line + cited path + reason it doesn't resolve>

## B. Count claim verification

| # | Claim | Location | Expected | Actual | Verdict |
|---|---|---|---|---|---|
| 1 | "17 entries" | feature_catalog.md:31 | 17 | <N> | <PASS/FAIL> |
| 2 | Coverage table sums to 17 | feature_catalog.md:33-41 | 17 | <N> | <PASS/FAIL> |
| 3 | "17 deterministic scenarios" | manual_testing_playbook.md:47 | 17 | <N> | <PASS/FAIL> |
| 4..10 | playbook §6-§12 per-domain | <file:line> | <N> | <N> | <PASS/FAIL> |
| 11..27 | playbook §14 row targets resolve | playbook.md:398-414 | resolves | <yes/no> | <PASS/FAIL> |

## C. 1:1 pairing table

<full 17-row table>

Pairing drift count: <integer>

## D. Secondary checks

- a. Per-feature structural shape (3+3 spot-check): <PASS/FAIL each, file:line>
- b. lib/scripts/tests path-refs (broken count): <integer> + sample
- c. Description word-for-word agreement (5 spot-check): <PASS/FAIL each>

## E. Findings (DR-025 onwards)

Number each finding sequentially starting at DR-025. For each finding, emit one block:

### DR-025 | <severity P0/P1/P2> | <class> | <artifact:line>

<one-sentence description>

Evidence:
- <file:line>
- <file:line>

Recommended patch shape (text only — no actual edit):
- <one sentence>

(Repeat for DR-026, DR-027, ...)

## F. Summary

- Total novel findings: <integer>
- P0: <int> / P1: <int> / P2: <int>
- Class breakdown: <table>
- LOG_ONLY count: <integer> (findings inside lib/scripts/tests/storage scope that are read-only-flagged)
- SC-007 invariant: held (no writes to forbidden tree)
- Bundle gate: <PASS/FAIL>

## G. Next iter suggestion

<one paragraph: per strategy.md §4 iter 5 is "Sub-README consistency: 8 sub-READMEs vs current code layout">
```

---

## CONSTRAINTS (non-negotiable)

1. **SC-007 invariant**: no writes to `lib/`, `scripts/`, `tests/`, `storage/`. Plus iter-3 tightening: no writes to `system-spec-kit/mcp_server/deep-review/scripts/reduce-state.cjs`.
2. **No re-reports**: DR-001..DR-024 and AF-0001..AF-0080 are KNOWN. If a finding maps to any of those, do NOT emit; instead note "(re-report of DR-NNN/AF-NNNN, skipped)" inline.
3. **Citation discipline**: every finding has at least one file:line evidence. No vague "somewhere in feature_catalog".
4. **Output discipline**: do NOT write files yourself. Output goes to stdout; the orchestrator captures `--print` output to `research/logs/iter-04-stdout.txt`.
5. **Counting discipline**: the final DR-NNN count in §E must match §F total. If they drift, the orchestrator will reject and re-dispatch.
6. **No exploratory mutations**: read-only operations only. Use `rg`, `grep`, `head`, `wc`, `find`, `cat`. No `sed -i`, no `git add`, no `mv`, no `rm`.
7. **Sequential thinking**: use `mcp__sequential_thinking__sequentialthinking` with at least 5 thoughts before producing §A-§G output, per cli-devin SKILL.md §4 ALWAYS rule 14.

---

## VERIFICATION COMMANDS (run inside the dispatch, surface results)

```bash
# Count enumeration verification
find .opencode/skills/deep-loop-runtime/feature_catalog -name '*.md' -type f | wc -l   # expect 18
find .opencode/skills/deep-loop-runtime/manual_testing_playbook -name '*.md' -type f | wc -l   # expect 18

# Spot-check 5 random per-feature files exist (catalog side)
ls .opencode/skills/deep-loop-runtime/feature_catalog/01--executor/01-executor-config.md
ls .opencode/skills/deep-loop-runtime/feature_catalog/06--coverage-graph/01-coverage-graph-db.md
ls .opencode/skills/deep-loop-runtime/feature_catalog/07--script-entry-points/04-status-script.md

# SC-007 boundary check (orchestrator will re-verify after dispatch)
git diff --stat -- .opencode/skills/deep-loop-runtime/lib .opencode/skills/deep-loop-runtime/scripts .opencode/skills/deep-loop-runtime/tests .opencode/skills/deep-loop-runtime/storage   # expect empty
```

---

## MEMORY HANDBACK

None — orchestrator handles memory save at synthesis time (per strategy.md §6).
