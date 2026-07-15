# 017 Review Synthesis (parent + 7 children)

**Phase reviewed:** `027/002/017-search-and-output-intelligence-implementation` — a **phase-parent** with 7 child sub-phases.
**Scope:** Search + output-intelligence shipped code across the seven children, plus the per-child spec-folder docs. All code lives under `.opencode/skills/system-spec-kit/mcp_server/lib/search/` (and `.opencode/commands/memory/` for c006/c007). The shipped key_files were read from each child's `implementation-summary.md`.

**Coverage caveat (READ THIS):** the review was **distributed across the children**, so each child was reviewed by only **1–2 model passes**, not 10. Agreement is therefore a weak signal here. Every carried finding below was **re-verified by the synthesizer against the actual cited code (READ-ONLY)**; a finding is reported as CONFIRMED only when the cited file was opened at the cited lines and the claim matched.

### Per-child lineage / model coverage map

| Child | Sub-phase | Lineages (model) | Passes | Shipped key_files |
|---|---|---|---|---|
| c001 | 001-token-budget-truncation-safety | p017c001-ds (deepseek) | 1 | `lib/search/hybrid-search.ts`, `lib/search/dynamic-token-budget.ts` |
| c002 | 002-request-quality-aggregation | p017c002-ds, p017c002-opus | 2 | `lib/search/confidence-scoring.ts` |
| c003 | 003-generic-query-deep-routing | p017c003-mimo | 1 | `lib/search/query-classifier.ts`, `query-expander.ts`, `recovery-payload.ts` |
| c004 | 004-confidence-calibration-labeled-set | p017c004-mimo, p017c004-opus | 2 | `lib/search/confidence-scoring.ts`, `confidence-calibration.ts`, `search-flags.ts` |
| c005 | 005-cosine-topn-reorder | p017c005-kimi | 1 | `lib/search/hybrid-search.ts`, `search-flags.ts` |
| c006 | 006-command-contract-structural | p017c006-kimi, p017c006-opus | 2 | `.opencode/commands/memory/search.md`, `assets/search_presentation.txt` |
| c007 | 007-output-surface-parity | p017c007-opus | 1 | `.opencode/commands/memory/search.md`, `assets/search_presentation.txt` |

**Raw filed tally across 10 lineages:** 0 P0, 5 P1, 24 P2. Per-lineage verdicts as filed: c001 PASS; c002 CONDITIONAL (both); c003 PASS; c004 CONDITIONAL (both); c005 PASS; c006 CONDITIONAL (both); c007 PASS.

---

## Verdict

**CONDITIONAL (one confirmed P1).**

- **Confirmed P0:** 0
- **Confirmed P1:** 1 — c006 `search.md:17` unquoted `$ARGUMENTS` outer-shell exposure (glob/command-substitution/metachar corruption of `QUERY`; bounded security sink). Flagged by **both** c006 lineages (kimi + opus); verified real against code.
- **Confirmed P2 (worth fixing):** 9 — the systemic spec-doc scaffold drift (counts as one cross-child fix) + 8 code/maintainability nits (c001-F005, c002-F003, c002-F004 doc, c003 SQL-param, c003 classifyStatus dead-branch, c004 isotonic-bloat, c004 PAV-duplication, c004 cache-invalidation, c004 weight-invariant, c005 reorder-depth, c006 missing-checklist, c006 routing-hijack). See table for the consolidated set.
- **Rejected / false-positive / already-resolved:** c002-opus-F003 "dist unbuilt / not live" (ALREADY-RESOLVED — dist exists), c001-F001/F002/F003/F004 (PASS observations, not defects), c003-P2-003 stopWordRatio (FALSE-POSITIVE).

The verdict is CONDITIONAL rather than FAIL because the single P1 is a bounded, well-localized fix on one line of one file, and its security facet is mitigated by a self→self trust boundary (the operator types their own `/memory:search` query — no external attacker). The systemic doc-drift is a P2 traceability sweep, not a code defect. No release-blocking P0.

**Children clean vs carrying findings:**
- **Clean (code):** c001, c003, c005, c007 carry only P2 nits / doc-drift; no code defect.
- **Carry confirmed code-actionable findings:** c006 (the P1) and c004 (4 maintainability P2s — the densest code-nit child).
- **Doc-drift only:** c002, c007 (no real code bug; c002-opus's three filed P1s are doc/traceability, one already resolved).

---

## Confirmed Findings (by child)

### c006 — command-contract-structural (the only P1)

| Severity | Child | file:line | Agreement | Issue | Verification evidence | Remediation |
|---|---|---|---|---|---|---|
| **P1** | c006 | `.opencode/commands/memory/search.md:17` | **2 lin / 2 models** (kimi P1-correctness, opus P1-security) | The `§0` ARGUMENT RESOLUTION header ends in `-- $ARGUMENTS` **unquoted**. The `bash -c '…' --` wrapper protects only expansion *inside* the wrapped script; the trailing `$ARGUMENTS` is substituted as raw text into the **outer** shell, which runs its full expansion phase first. So glob (`*`/`?`/`[..]`), command substitution (`$(…)`, backticks), and metacharacters (`;`/`\|`/`&`/`>`) in a query corrupt the resolved `QUERY` (CWD-dependent → contradicts the header's "deterministic ground truth" claim) and constitute a shell-injection sink. The shipped fix handles only word-splitting (`"$*"`) and `"`-escaping. | Opened `search.md:17` verbatim: `!\`bash -c 'if [ "$#" -gt 0 ]; then q="$*"; q="${q//\"/\\\"}"; …' -- $ARGUMENTS\`` — `$ARGUMENTS` is unquoted at end of line; no `set -f`/noglob guard. `implementation-summary.md:66` itself states `$ARGUMENTS` "expands one word per argument" — i.e. raw outer-shell substitution, the same mechanism that admits glob/cmd-sub. The impl-summary's edge-case tests (`:89`, `:129`) cover only embedded double-quotes + analysis subcommands, **not** glob/cmd-sub/metachar. opus adjudication: confidence 0.82, finalSeverity P1 (P1 not P0 because self→self trust). | **R1.** Neutralize outer-shell expansion of user input. Preferred: confirm whether the command renderer shell-quotes `$ARGUMENTS` (if so → downgrade to P2 doc-note). If raw, disable globbing for the substitution (`set -f`) and/or restructure so user text is not subject to the outer shell's expansion phase, then add glob/`$(…)`/`;`/`\|` verification cases. |
| P2 | c006 | `.opencode/commands/memory/search.md:91` | 1 lin / 1 model (opus) | First-token analysis-subcommand routing can hijack legitimate retrieval queries (e.g. `history of auth decisions` → analysis mode). **Pre-existing** semantics moved (not introduced) by O1. | `search.md:91` lists `history`/`causal`/etc. as analysis subcommands matched on first token; advisory. | Optional: require an explicit prefix/sigil for analysis subcommands, or document the constraint. Defer-able. |
| P2 | c006 | `006-command-contract-structural/` (no checklist.md) | 1 lin / 1 model (kimi) | Level 1 spec folder lacks `checklist.md`. | Confirmed absent (and absent in all 7 children). | Level 1 does not require `checklist.md`; advisory only. Fold into doc-sweep if desired. |

### c004 — confidence-calibration-labeled-set (densest code-nit child)

| Severity | Child | file:line | Agreement | Issue | Verification evidence | Remediation |
|---|---|---|---|---|---|---|
| P2 | c004 | `lib/search/confidence-calibration.ts:166-174` | 1 lin / 1 model (opus) | Isotonic/PAV fit does **not** merge adjacent **equal-mean** blocks (merges only on strict violations `prev > curr`), so the model can serialize many adjacent identical-y points (model bloat). | `confidence-calibration.ts:168` `if (prev.sumY/prev.count <= curr.sumY/curr.count) break;` — equality (`<=`) exits the merge loop, leaving equal-mean blocks separate. No correctness impact (equal-mean points interpolate identically); serialization size only. | Optional: collapse adjacent equal-y blocks before emitting `points`. Maintainability/size, not correctness. |
| P2 | c004 | `confidence-calibration.ts:145-183` ↔ `004-…/assets/fit-calibration.mjs:97-124` | 1 lin / 1 model (opus) | PAV fit logic duplicated in two files with no drift guard. | Both files contain near-identical PAV loops; no shared module / drift test. | Extract a shared fit function or add a parity test; or accept (the .mjs is an offline asset). |
| P2 | c004 | `lib/search/confidence-scoring.ts:167-179` | **2 lin / 2 models** (opus F004 + mimo P2-003) | Path-keyed calibration-model cache is not invalidated on file **content** change (only re-reads when the path changes). | `confidence-scoring.ts:173` `if (cachedCalibrationModel !== undefined && cachedCalibrationModelPath === path)` — no mtime/hash check. Documented as known-limitation #4 in impl-summary. | Add mtime/content check, or accept as documented limitation (path-stable in practice). |
| P2 | c004 | `lib/search/confidence-scoring.ts:54-56` | 1 lin / 1 model (mimo) | `WEIGHT_HEURISTIC (0.45) + WEIGHT_SCORE_PRIOR (0.55)` invariant ("must sum to 1.0") is enforced only by a prose comment — no runtime/compile assertion. | `confidence-scoring.ts:54` comment "These two must sum to 1.0"; constants sum to 1.0; no assertion. | Add a `static`/module-load assertion or const-expression check. Trivial defensive nit. |

### c003 — generic-query-deep-routing

| Severity | Child | file:line | Agreement | Issue | Verification evidence | Remediation |
|---|---|---|---|---|---|---|
| P2 | c003 | `lib/search/recovery-payload.ts:288-300` | 1 lin / 1 model (mimo) | `buildGraphExpandedFallback` interpolates `seedPlaceholdersSql` 3× and spreads `seedIds` 3× — correct as written but **fragile** (a 4th `IN(...)` clause would silently desync the param count). | `recovery-payload.ts:298-300` `.all(...seedIds, ...seedIds, ...seedIds)` matches the 3 placeholder groups. Parameterized (no injection — `LIKE ?` is bound). | Build the params array programmatically from the clause list, or add a count assertion. Maintainability only. |
| P2 | c003 | `lib/search/recovery-payload.ts:87` | 1 lin / 1 model (mimo) | `classifyStatus` final `return 'low_confidence'` is a redundant/ambiguous fallback — an earlier branch (`:81-85`) already returns `'low_confidence'`. | `recovery-payload.ts:87` `return 'low_confidence'; // fallback — should only be called when recovery is warranted`. Dead-ish branch; benign. | Optional: change fallback to an explicit sentinel/throw, or document why the duplicate label is intentional. |

### c002 — request-quality-aggregation

| Severity | Child | file:line | Agreement | Issue | Verification evidence | Remediation |
|---|---|---|---|---|---|---|
| P2 | c002 | `lib/search/confidence-scoring.ts:355-375` | 1 lin / 1 model (ds) | `assessRequestQuality(results, confidences)` consumes two **parallel arrays** but never validates `results.length === confidences.length` (guards `results.length===0` and caps `head` to `confidences.length`, but a length mismatch pairs `results[0]` with a mismatched confidence head). | `confidence-scoring.ts:359` guards empty `results`; `:369` `head = Math.min(confidences.length, QUALITY_RATIO_HEAD)`; no cross-array length check. Invariant holds at the call site today → defensive nit, no demonstrated bug. | Add a length-mismatch guard or assertion. Defensive only. |
| P2 (doc) | c002 | `lib/search/confidence-scoring.ts:375`; `implementation-summary.md:61` | 1 lin / 1 model (opus) | Doc-precision drift: impl-summary says weak/gap thresholds "unchanged," but the `qualityRatio` **denominator operand** changed to head-capped `min(N,5)` (`head`), marginally loosening the gap→weak boundary. Constant `0.3` is unchanged; behavior is defensible. | `confidence-scoring.ts:375` `const qualityRatio = head > 0 ? highOrMediumCount / head : 0;` — denominator is `head` (capped), not full set. | Reword the impl-summary to note the denominator operand changed (head-capped). Doc fix, not code. |

### c001 / c005 / c007 — minor

| Severity | Child | file:line | Agreement | Issue | Verification evidence | Remediation |
|---|---|---|---|---|---|---|
| P2 | c001 | `lib/search/hybrid-search.ts:1354` (mutated `:2003`) | 1 lin / 1 model (ds) | `s3meta.tokenBudget.adjustedBudget` initialized with a placeholder at construction, patched after header-overhead computation — fragile mutation-after-construction pattern. | `hybrid-search.ts:1354` init `adjustedBudget: budgetResult.budget`; comment `:1352` "patched in below after they are computed"; mutated `:2003`. **Intentional + documented**; behavior correct. | Optional refactor: move the `s3meta.tokenBudget` assignment to after header-overhead computation. Cosmetic. |
| P2 | c005 | `lib/search/hybrid-search.ts:2416` | 1 lin / 1 model (kimi) | Cosine-reorder depth is a hard-coded module constant, not operator-configurable via `search-flags.ts`. | `hybrid-search.ts:2415` `const COSINE_TOPN_REORDER_DEPTH = 10;`; no `SPECKIT_COSINE_*` flag in `search-flags.ts`. | If runtime tuning is wanted, wire to a `search-flags.ts` env flag; otherwise accept the fixed constant (design choice). |

### Cross-cutting (ALL 7 children) — systemic doc-drift

| Severity | Child | file:line | Agreement | Issue | Verification evidence | Remediation |
|---|---|---|---|---|---|---|
| P2 | **c001-c007 (all 7)** | each `*/spec.md` (`:97-98`), `plan.md`, `tasks.md`, `graph-metadata.json` | **7 lin / 4 models** (raised in c002-ds/opus, c004-mimo/opus, c005-kimi, c006-kimi/opus, c007-opus) | `spec.md`/`plan.md`/`tasks.md` are **identical unfilled scaffold templates** (`[Deliverable 1]`, `scaffold/<name>` packet_pointer, `scaffold-scaffold/…` session_id) and `graph-metadata.json` reads `Status: planned` with `Key Files: spec.md, plan.md, tasks.md` — all contradicting each `implementation-summary.md`'s `completion_pct: 100` and real shipped key_files. | Verified all 7: `spec.md:97-98 = [Deliverable 1]/[Deliverable 2]`, `:14 packet_pointer: "scaffold/<name>"`; `graph-metadata.json: Status: planned`. impl-summaries are populated with real key_files and `completion_pct: 100`. | **DOC sweep (one task per child or batch):** populate `spec.md`/`plan.md`/`tasks.md` with real requirements/scope/file-change tables (or explicitly mark superseded by `implementation-summary.md`), refresh `graph-metadata.json` Status → `done`/`complete` + real Key Files, and reconcile continuity blocks. Best done via `generate-context.js` per child. **This is the dominant cross-child finding.** |

---

## Rejected / False-Positive / Already-Resolved

| Finding | Child / Models | Disposition | Reason |
|---|---|---|---|
| **c002-opus F003 — "100% complete claimed while change not live (dist unbuilt; dist-freshness FAIL)" (filed P1)** | c002 / opus | **ALREADY-RESOLVED** | `dist/lib/search/confidence-scoring.js` exists (built 2026-06-17 09:32). The "dist unbuilt" claim was a point-in-time snapshot that no longer holds; the change is live. The remaining truth in it (spec scaffold) is folded into the systemic doc-drift P2. Not an open P1. |
| **c002-opus F001/F002 — spec scaffold + graph-metadata planned (filed P1×2)** | c002 / opus | **DOWNGRADED to P2** | Real, but pure traceability doc-drift (no code defect). Consolidated into the cross-cutting systemic doc-drift P2 — P1 is not warranted for a metadata/scaffold sweep with code already shipped and tests present. |
| **c002-ds F001 / c004-mimo P1-001 / c004-opus F001 / c006-kimi F002 / c006-opus F002 / c007-opus F001 — "spec docs are scaffold placeholders vs 100% complete" (filed P1 by some, P2 by others)** | c002/c004/c006/c007 / ds, mimo, opus, kimi | **CONSOLIDATED → systemic P2** | Same root cause across all children. Real, but one traceability sweep, not per-child P1 gates. |
| **c001 F001 / F002 / F003 / F004 — skip-and-continue, count-floor, overflow-routing, low-signal budget** | c001 / ds | **PASS observations (not defects)** | The c001 lineage filed these as P2 "verified-correct behavior" confirmations, NOT bugs. Re-verified: `hybrid-search.ts:2845-2853` loop correct; `:2862` floor = `Math.max(1, Math.min(limit,3))` correct; `:2875-2881` overflow → `buildProgressiveResponse()` correct; `dynamic-token-budget.ts:90` `lowSignal ? Math.max(tierBudget, DEFAULT_BUDGET) : tierBudget` preserves budget. No action. |
| **c003 P2-003 — stopWordRatio rounding could mask boundary cases** | c003 / mimo | **FALSE-POSITIVE** | `query-classifier.ts:257` `Math.round(stopWordRatio*1000)/1000` is applied to a **debug-output field only** (comment: "to avoid floating-point noise in debug output"); the routing decision does not consume the rounded value as a boundary. No masking. |
| **c004 F002 isotonic / F003 PAV-dup / F004 cache** were also independently sanity-checked | c004 | **CONFIRMED (kept as P2)** | These are real but P2 maintainability/known-limitation, not correctness — listed in Confirmed Findings, not rejected. |

---

## Remediation Outline

Ordered by severity; seeds a small remediation packet under 017. All target paths absolute under repo root `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`.

### 1. [P1 — c006] Harden `/memory:search` `§0` argument resolution
- **File:** `.opencode/commands/memory/search.md` (line 17).
- **Change:** close the outer-shell expansion path for user input. Step T1: confirm whether the OpenCode/Claude command renderer shell-quotes `$ARGUMENTS` into a single token. If it does → downgrade to a P2 doc-note in the header and stop. If it substitutes **raw** (the impl-summary's "one word per argument" behavior says it does), neutralize the outer shell: e.g. disable globbing for the substitution (`set -f`) and restructure so the typed query is not subject to the outer shell's glob/command-substitution phase, then verify with queries containing `*`, `$(…)`, backticks, `;`, `|`.
- **Verification:** queries with each metacharacter class resolve to the verbatim typed string; arg-echo (`search.md:72`) still matches.

### 2. [P2 — systemic, all 7 children] Reconcile spec-folder docs with shipped reality
- **Files (per child `…/017-search-and-output-intelligence-implementation/<NNN>-…/`):** `spec.md`, `plan.md`, `tasks.md`, `graph-metadata.json`, continuity blocks.
- **Change:** populate `spec.md`/`plan.md`/`tasks.md` with real requirements/scope/file-change tables (or mark superseded by `implementation-summary.md`); refresh `graph-metadata.json` `Status: planned → done`/`complete` and real `Key Files`; reconcile `_memory.continuity`. Preferred mechanism: run `generate-context.js` for each child (batch). **Highest-volume fix; the dominant cross-child finding.**

### 3. [P2 — c004] Calibration maintainability cluster (one packet)
- `lib/search/confidence-scoring.ts:54-56`: add a module-load assertion that `WEIGHT_HEURISTIC + WEIGHT_SCORE_PRIOR === 1.0`.
- `lib/search/confidence-calibration.ts:166-174`: collapse adjacent equal-mean PAV blocks before emitting `points` (model-size only).
- `lib/search/confidence-calibration.ts:145-183` ↔ `004-…/assets/fit-calibration.mjs`: extract shared PAV or add a parity test (drift guard).
- `lib/search/confidence-scoring.ts:167-179`: add mtime/content check to the calibration-model cache, OR keep the documented-limitation note (acceptable).

### 4. [P2 — c003] recovery-payload hygiene
- `lib/search/recovery-payload.ts:288-300`: build the SQL param array programmatically from the clause list (remove the 3× hand-spread fragility).
- `lib/search/recovery-payload.ts:87`: make the `classifyStatus` fallback explicit (sentinel or comment clarifying the duplicate `low_confidence` label).

### 5. [P2 — c002] request-quality defensiveness + doc precision
- `lib/search/confidence-scoring.ts:355`: add a `results.length === confidences.length` guard (defensive).
- `004/002 implementation-summary.md:61`: reword to note the `qualityRatio` denominator operand became head-capped (`min(N,5)`).

### 6. [P2 — c001/c005, optional] Cosmetic
- `lib/search/hybrid-search.ts:1354`: move `s3meta.tokenBudget.adjustedBudget` assignment to after header-overhead computation (remove placeholder-then-patch).
- `lib/search/hybrid-search.ts:2415`: if runtime tuning is desired, wire `COSINE_TOPN_REORDER_DEPTH` to a `search-flags.ts` env flag; otherwise accept the fixed constant.

### 7. [P2 — c006, optional/defer] Command routing + checklist
- `.opencode/commands/memory/search.md:91`: optionally require an explicit prefix for analysis subcommands (or document the first-token routing ambiguity).
- Optionally add `checklist.md` to the Level 1 children (not required by Level 1 rules).
