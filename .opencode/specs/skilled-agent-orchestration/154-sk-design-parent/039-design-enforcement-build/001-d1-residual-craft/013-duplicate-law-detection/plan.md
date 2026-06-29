---
title: "Implementation Plan: Duplicate Law Detection"
description: "Plan to extend the existing numeric-law completeness gate (numeric_law_check.py) with an additive within-index duplicate-detection pass so the canonical law index registers each already-adopted numeric law exactly once; the clean index still exits 0, a scratch index with two same-value rows exits non-zero naming the duplicates."
trigger_phrases:
  - "duplicate law detection plan"
  - "duplicate law detection design build"
  - "numeric_law_check duplicate detection"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/001-d1-residual-craft/013-duplicate-law-detection"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Mark plan complete with evidence; keep canonical phase-deps/effort/enhanced-rollback anchors"
    next_safe_action: "Run validate.sh --strict; let orchestrator regenerate description and graph metadata"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/shared/scripts/numeric_law_check.py"
      - ".opencode/skills/sk-design/shared/numeric_design_laws.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Within-index duplicate-row detection on the canonical registry is the deterministic, evergreen reduction of 'reference the owner, not a copy'; a cross-doc prose scanner stays advisory and out of scope"
      - "The duplicate key is the full normalized value/range string, never a single extracted numeral, so an identical restatement is the only thing that can collide"
---
# Implementation Plan: Duplicate Law Detection

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python 3 stdlib (`re`, `json`) — extends the existing docs-benchmark checker |
| **Primary target (MODIFIED)** | `.opencode/skills/sk-design/shared/scripts/numeric_law_check.py` — additive duplicate-detection pass |
| **Input read (UNCHANGED)** | `.opencode/skills/sk-design/shared/numeric_design_laws.md` — the canonical cross-mode law index |
| **Mechanism** | After the existing completeness scan, group law rows by normalized `value/range` and fail when any value is registered by two or more rows |
| **Verification** | Clean index → exit 0 (completeness unchanged); a scratch index with two same-value rows → exit 1 naming the duplicate `law_id`s |

### Overview
The numeric law index gives each already-adopted numeric law (timing, color/contrast, layout/spacing, type) exactly one canonical row so modes cite the owner instead of re-copying the value. The guard that is missing today is the one that keeps that "exactly one row" promise honest: nothing stops a second row from re-porting an already-adopted law under a new `law_id`, which is precisely the drift the spec names ("already-adopted laws → duplicate re-port"). This build adds that guard as an **additive duplicate-detection pass inside the existing completeness gate** — the surface the index's own sibling plan reserved for it ("a later sibling, duplicate-detection, extends this same surface").

The pass is deterministic and registry-scoped: it normalizes each row's `value/range` cell, groups rows by that normalized value, and fails when any group holds two or more rows — a duplicate re-port of an already-adopted law. The existing completeness behavior is preserved byte-for-byte: a fully populated, duplicate-free index still exits 0, and a blanked required cell still bites.

Scope is frozen to the one existing file `numeric_law_check.py`. No law row is added or moved, no other mode doc, script, or asset is edited, and the index content stays read-only.

### Reconciliation note (documented deviation)
The spec frames the risk as a mode-local doc re-stating an owned default (evidence: a layout/timing restatement that lives in a mode-process doc rather than referencing its owner). The deterministic, evergreen enforcement of that intent is **within-index duplicate-row detection on the canonical registry** — the one surface where every adopted law is registered, where "reference the owner, not a copy" reduces to "each value appears once." A scanner that walks arbitrary mode docs for restated numbers is intentionally **out of scope**: it would need a hardcoded list of docs to scan (not evergreen) and would false-positive on legitimate references and on numerals that merely coincide. That cross-doc breadth stays advisory, matching the research's honest enforcement ceiling ("prove the law/owner exists and was cited," not that every prose mention was eliminated). This plan enforces the deterministic core and names the residual as advisory rather than overclaiming.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Target confirmed: `numeric_law_check.py` already exists and owns the docs-benchmark surface duplicate-detection extends — `check()` returns `rows/errors/missing/incomplete/ok` and `_find_law_rows` is the single parser
- [x] Existing completeness contract understood: `ok = no errors AND no missing AND no incomplete`; exit 0/1/2 — preserved, with `not duplicates` folded in
- [x] Duplicate key fixed: normalized `value/range` string equality (full-cell, not a single extracted numeral) — `_normalized_value` = `_clean_cell` + lowercase + whitespace-collapse
- [x] No-false-positive cases enumerated: the 12 live rows carry distinct `value/range` strings; the register-vs-motion drift row owns a distinct value under a distinct owner — clean index exits 0
- [x] Acceptance is deterministic: clean index → exit 0; two same-value rows → exit 1 naming the duplicates — verified without pipe-masking

### Definition of Done
- [x] `numeric_law_check.py` runs a duplicate pass after completeness and folds duplicates into the failure set and the exit code — `_find_duplicates` called from `check()`
- [x] The live index still exits 0 (completeness unchanged AND no duplicates among the seeded rows) — `numeric_design_laws.md` → exit 0, 12 rows
- [x] A blanked required cell still bites (completeness is not regressed by the new pass) — scratch blank caveat → exit 1 `contrast-body-aa: blank caveat`
- [x] A scratch index with two rows sharing one normalized `value/range` exits non-zero and names both `law_id`s plus the shared value — exit 1 `shared by contrast-body-aa, contrast-large-ui-aa`
- [x] The register-vs-motion drift row is NOT flagged (distinct value, distinct owner) — never grouped; clean index stays exit 0
- [x] `--json` output carries a `duplicates` array mirroring the `incomplete` shape — `duplicates` emitted beside `incomplete`
- [x] Additive only: the single change set is `numeric_law_check.py`; the index and all other files are untouched — `git status` shows one modified path
- [x] Evergreen: no spec/packet/phase IDs or `specs/` paths in the modified script — evergreen grep returns no hits

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### 3.1 Where the pass slots in
`check(text)` already produces `rows` (parsed law rows) plus `errors`, `missing`, and `incomplete`. The duplicate pass is a pure function over the same `rows` list, added beside the completeness scan:

1. Reuse the existing parse (`_find_law_rows`) — no second parser, no new dependency.
2. Build duplicate groups from the parsed rows.
3. Add `duplicates` to the result dict and fold it into `ok`.

```python
ok = not errors and not missing and not incomplete and not duplicates
return {"rows": len(rows), "errors": errors, "missing": missing,
        "incomplete": incomplete, "duplicates": duplicates, "ok": ok}
```

### 3.2 Duplicate key and normalization
- Normalize each row's `value/range` cell: reuse `_clean_cell` (strips wrapping backticks), then lowercase and collapse internal whitespace to a single space, then trim. This mirrors the existing `_normalized_header` discipline already in the file.
- Group rows by that normalized string. Any group of size >= 2 is one duplicate group.
- Each group reports `{ "value": <normalized value>, "law_ids": [...], "owners": [...] }` so the operator sees both a same-owner re-port and a cross-mode copy.
- The key is the **full normalized `value/range` string**, never a single extracted numeral — so `4.5:1 WCAG AA body text` only collides with an identical restatement, never with `3:1 ...`. This is what keeps the pass false-positive-safe and deterministic.

### 3.3 No-false-positive guarantees (verified against the live index)
- The 12 seeded rows carry pairwise-distinct `value/range` strings → zero duplicate groups → exit 0 preserved.
- The register motion-budget row (`150-250ms ... Product`, owner `interface`) shares no exact `value/range` with any motion band (`100-150ms`, `200-300ms`, `300-500ms`, `500-800ms`) and owns a distinct value under a distinct owner → never grouped. The intentional register-vs-motion drift caveat stays a caveat, not a false duplicate.

### 3.4 Reconciliation with the completeness gate (exit contract preserved)
| Index state | Completeness | Duplicates | `ok` | Exit |
|-------------|-------------|------------|------|------|
| Clean, populated, distinct values (today) | clean | none | True | 0 |
| One required cell blanked | incomplete | (n/a) | False | 1 |
| Two rows share one normalized value | clean | 1 group | False | 1 |
| No data rows | missing | none | False | 1 |
| Usage / unreadable file | — | — | — | 2 |

Completeness still runs first and still bites on its own; the duplicate pass only ever ADDS a failure reason. Exit codes 0/1/2 are unchanged in meaning.

### 3.5 Output wiring
- Human mode: on duplicates, print one line per group, e.g. `FAIL - duplicate law value "<value>" shared by <law_id_a>, <law_id_b>`. The PASS line is augmented to read that rows are populated AND unique.
- `--json` mode: add a `duplicates` array alongside `incomplete`, same call signature, same `--json` flag.

### 3.6 Additive / no-regression contract
- One file changes: `numeric_law_check.py`. The index, other checkers, and assets are untouched.
- The pass reads only the already-parsed `rows`; it adds no new file read and no third-party dependency.
- Reverting the duplicate pass restores the prior completeness-only gate exactly; nothing downstream consumes the new `duplicates` field except the script's own exit logic.

### 3.7 Honest ceiling
The gate proves the canonical index never registers the same numeric law twice — the deterministic core of "guard against duplicate re-port." It does not prove that no mode prose anywhere paraphrases an owned value; that breadth is non-evergreen and stays advisory (§1 reconciliation note).

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Duplicate pass
- [x] Add a `_find_duplicates(rows)` helper that normalizes each row's `value/range` and returns groups of size >= 2 with their `law_id`s and owners — shipped with `_normalized_value`
- [x] Call it from `check()` and add `duplicates` to the result dict — `duplicates = _find_duplicates(rows)` returned in the result
- [x] Fold `duplicates` into `ok` (`ok = not errors and not missing and not incomplete and not duplicates`) — verdict updated

### Phase 2: Output + exit wiring (preserve completeness)
- [x] Emit one human-readable `FAIL` line per duplicate group naming the shared value and the duplicate `law_id`s; augment the PASS line to assert uniqueness — `duplicate law value "<value>" shared by ...`; PASS now reads "populated and unique"
- [x] Add the `duplicates` array to the `--json` payload, mirroring the `incomplete` shape — `duplicates` in the JSON dict
- [x] Confirm exit contract: 0 only when populated AND duplicate-free; 1 on incomplete OR duplicate; 2 on usage/read error — verified 0/1/1/2

### Phase 3: Verification
- [x] Clean live index → exit 0 (completeness unchanged, no duplicates) — `numeric_design_laws.md` → exit 0, 12 rows
- [x] Duplicate-bite test: a scratch copy with a second row re-porting an existing value → exit 1 naming both `law_id`s + the shared value — exit 1 `shared by contrast-body-aa, contrast-large-ui-aa`
- [x] Completeness no-regression: blank one required cell on a scratch copy → still exit 1 on the incomplete cell — exit 1 `contrast-body-aa: blank caveat`
- [x] No-false-positive: confirm the register motion-budget row is never grouped with a motion band — distinct normalized value; not grouped
- [x] Presence: a table with no data rows → still exit 1 (`rows missing`) — presence guard fires before the duplicate scan
- [x] Evergreen + scope audit: grep the modified script for IDs/paths (none); confirm the only change is `numeric_law_check.py` — evergreen grep clean; `git status` shows one modified path

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Method |
|-----------|-------|--------|
| Acceptance (pass) | Clean live index | `numeric_law_check.py numeric_design_laws.md` exits 0 |
| Acceptance (duplicate) | Scratch index, two rows share one value | exits non-zero, names both `law_id`s + the shared value |
| No-regression (completeness) | Scratch index, one cell blanked | exits non-zero on the incomplete cell (existing behavior) |
| No-false-positive | Live register-vs-motion drift row | not grouped; clean index stays exit 0 |
| Presence | Table with no data rows | exits non-zero (`rows missing`) |
| Evergreen lint | Modified script | grep finds no spec/packet/phase IDs or `specs/` paths |
| Scope audit | Working tree | only `numeric_law_check.py` modified |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `numeric_law_check.py` (existing completeness gate) | Internal | Green | No surface to extend; would require a standalone checker |
| `numeric_design_laws.md` (the law index it reads) | Internal | Green | No rows to grade for duplicates |
| Python 3 stdlib (`re`, `json`) | External | Green | No parser / no JSON payload possible |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the duplicate pass mis-fails the clean index (false positive) or fails to bite a genuine re-port.
- **Procedure**: revert `numeric_law_check.py` to its completeness-only form. The change is additive and the new `duplicates` field is consumed only by the script's own exit logic, so reversion restores the prior gate exactly. No data, migration, or downstream consumer to unwind.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Duplicate pass) ──> Phase 2 (Output + exit) ──> Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Duplicate pass | None (pure function over existing parsed rows) | Output + exit |
| Output + exit | Duplicate pass | Verify |
| Verify | Output + exit | None |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Duplicate pass (`_find_duplicates` + fold into `ok`) | Low | 45 minutes |
| Output + exit wiring (human + `--json`, preserve completeness) | Low | 30 minutes |
| Verification (pass/duplicate/no-regression/no-false-positive/presence/evergreen/scope) | Low | 45 minutes |
| **Total** | | **~2 hours** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Confirm the only staged change is `numeric_law_check.py` — `git status` lists exactly one modified path
- [x] Confirm the live index still exits 0 after the change (completeness + duplicate-free) — `numeric_design_laws.md` → exit 0
- [x] Confirm a duplicate scratch fixture bites and a blanked-cell scratch fixture still bites — both → exit 1 (duplicate names value + law_ids; blank names the cell)

### Rollback Procedure
1. `git checkout -- numeric_law_check.py` (or revert the duplicate pass hunk)
2. Confirm the completeness-only gate still exits 0 on the clean index
3. No database, migration, or downstream consumer to reconcile (stdlib script only)

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Revert the single script file

<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN
- Core + Level 2 addendum (phase deps, effort, enhanced rollback)
- Extends numeric_law_check.py with an additive within-index duplicate-detection pass; completeness preserved; deterministic bite contract
-->
