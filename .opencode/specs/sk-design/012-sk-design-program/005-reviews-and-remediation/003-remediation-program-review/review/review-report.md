# Consolidated Deep-Review Report — sk-design Remediation Program (Packets A/B/C)

> **Verdict: CONDITIONAL** — **0 P0**. The SOL lineage raised 10 P1s; **independent human verification against the code confirms 5 genuinely-actionable, downgrades 3 to minor nits, flags 1 as over-scoped, and refutes 1.** No correctness/security blocker; the real issues are documentation/metadata-honesty gaps left by the restructure plus two minor code edges.
>
> **Executor:** cli-opencode `openai/gpt-5.6-sol` (normal speed), high effort, **10/10 forced iterations** (`stop-policy max-iterations`), single lineage. Runtime ~1h39m, 0 retries, 0 failures.
> **Scope:** 118-file curated manifest at pinned HEAD `7b9d3b6b71` (bundle data + concurrent deep-loop work excluded). Read-only; no remediation applied, no default flipped.
> **Verification:** every finding below was re-checked against the actual file:line — some empirically reproduced (`operator.mjs` run directly).

## Headline

**No P0s: no correctness failure, no security vulnerability, no fabricated code/data/tests.** The core logic (manifest atomicity, generation-pointer identity, legacy-by-default, fail-closed absent-generation, the 17 preserved modules) held up. The SOL run's value was surfacing **documentation/metadata drift** — the restructure moved `_db → lib/database` and `_engine → lib/engine`, but several docs + generated-metadata files still point at the old paths and still say "Planned/in_progress" for shipped children. That is a real completion-honesty gap in my own reconciliation (commits `61a62a0c40`, `7b9d3b6b71` fixed the *child* packet docs but missed the parent map, the graph-metadata, and two styles docs).

## Verified findings (confirmed against the code, most-actionable first)

### CONFIRMED — documentation / metadata honesty (my missed reconciliation)

| ID | Finding | Verified evidence | Real severity |
|----|---------|-------------------|---------------|
| **P1-002** | Manual playbook references removed `_db`/`_engine` paths | `styles/docs/manual-testing-playbook.md:13,19-26` cite `styles/_db/`, `styles/_engine/`, `_db/{indexer,retrieval,vectors,operator}.mjs` — all moved to `lib/database`/`lib/engine`/`tests/` | **P2** doc-honesty |
| **P1-003** | Parent phase-map calls shipped children "Planned" | `015/spec.md:56,68-69` — `001-foundation`, `005-library-restructure`, `006-persistent-db-activation` all say `Planned`, but all three shipped this session | **P2** doc-honesty |
| **P1-004** | Database README's 5 operator commands point at a removed path | `styles/lib/database/README.md:69-92` — all five `node …/styles/_db/operator.mjs …` (real path is `lib/database/operator.mjs`) | **P2** doc-honesty |
| **P1-005** | Generated graph-metadata carries stale status + dead `_db` targets | `012/graph-metadata.json:45` `"planned"`; `015/001-foundation/graph-metadata.json:42-63` `"in_progress"` + `_db/{retrieval,vectors}.mjs`; `004-growth/graph-metadata.json:33-54` same | **P2** metadata-honesty |

### CONFIRMED — code, but over-scoped / lower severity

| ID | Verified verdict | Real severity |
|----|------------------|---------------|
| **P1-006** | **Real, but 1 file not 4.** `design-audit/corpus/comparison-lane.mjs:503-508` passes post-query generation drift as `outcome='no-fit'`, so the `requery-required` branch (`unavailableProofHandoff:397`, gated on `outcome==='generation-mismatch'`) is unreachable → drift routes to `target-derived-no-fit`. The claimed foundations/interface/motion counterparts **do not exist** (no `comparison-lane.mjs` there). Fallback is safe (`target-derived`, no-source-influence), so this is an edge-recovery-precision issue, not data corruption. | **P2** correctness-edge (was P1; "4 consumers" inaccurate) |
| **P1-010** | **Valid but self-disclosed.** The p95 1150→53 ms claim was already documented in `006` as "my 10-query representative set… indicative; operator confirms on their real workload." No committed raw-sample/methodology artifact. Fair evidence-completeness gap. | **P2** evidence |

### CONFIRMED — minor nits (severity inflated by single reviewer)

| ID | Verified verdict | Real severity |
|----|------------------|---------------|
| **P1-001** | Accurate: `openPublishedStyleDatabase` (`schema.mjs:343-356`) checks the opened generation's internal `generation_hash` against the pointer (catches pointer/generation drift) but does **not** re-verify the file's content digest vs the manifest. For a **locally-built, git-ignored, non-distributed** artifact the tamper threat is negligible; the pointer check already guards the realistic failure. | **P3**/advisory (was P1) |
| **P1-009** | Accurate narrowing: shadow parity 10/10 (`compareQueryResults`) compares projected cards + eligibility, which is the material facade DTO content but not literally every field. Claim slightly broader than the test. | **P3** evidence-precision (was P1) |
| **P1-011** | **Reproduced.** `operator.mjs` `optionValue` silently falls back to the default on a valueless `--database` and silently ignores unknown flags (`--databse` typo → default DB, `ok:true`). Real robustness nit, but CLI-misuse → default path, no corruption. | **P3** (was P1) |

### REFUTED — false positive

| ID | Verified verdict |
|----|------------------|
| **P1-012** | **REFUTED empirically.** Claim: `status` throws `ENOENT` when the clean-checkout database parent is absent. But `styles/database/` is a **tracked directory** (`.gitignore` + `README.md` keep the dir present while ignoring `*.sqlite`), so the parent always exists on checkout. Running `node lib/database/operator.mjs status` in the fresh `0094` checkout returns `{ok:true, published:false}` exit 0 — no crash. The reviewer inferred the throw from `listGenerationPaths`→`readdir` ordering but missed the tracked dir. |

## Meta-caveats (reported honestly)

- **Single-reviewer severity inflation:** all 10 findings were emitted at P1 (0 P0/P2). Verification collapses this to ~5 actionable + 3 P3 nits + 1 over-scoped + 1 refuted — the same single-lineage inflation the sibling 016 review documented. A single SOL lineage is a strong *finder* but an unreliable *severity/scope grader*; the human verification pass is load-bearing.
- **Coverage the reviewer disclosed:** Code Graph was unavailable (direct search substituted); the md-generator Vitest suite was not executed (its backend deps were absent in the pinned worktree — source/path reads only); no input `resource-map.md`. `traceability` hard-gates did not fully converge (recorded, not converted to pass by the max-iteration terminal stop).
- **Packet hygiene (self):** the SOL run also correctly noted the `017` review packet's own metadata was incomplete at review time — addressed during finalization.

## Recommended remediation (separate task — NOT applied here)

**Clear, low-blast, worth doing (finishes my own reconciliation):**
1. **P1-002/003/004/005** — rewrite `manual-testing-playbook.md` + `database/README.md` `_db`/`_engine` paths to `lib/database`/`lib/engine`; correct the `015` parent phase-map (`001/005/006` → shipped) preserving the genuinely-Planned `002/003/004`; regenerate the three `graph-metadata.json` files so status + `key_files` reflect current paths/state.

**Small code fix (optional):**
2. **P1-006** — in `design-audit/comparison-lane.mjs`, route real generation drift to `outcome='generation-mismatch'` so `requery-required` is reachable; add a regression assertion. Drop the non-existent "4 consumers" scope.

**Evidence hardening (optional, tied to the human-gated cutover):**
3. **P1-010/P1-009** — if/when the DB cutover is pursued, commit a reproducible p95 trace (raw samples + method) and name the exact parity fields; otherwise the existing self-disclosed caveats stand.

**No action:** P1-001 (local artifact, pointer check suffices), P1-011 (CLI-misuse nit), P1-012 (refuted).

## Source

- SOL lineage report: `review/lineages/gpt-56-sol-high/review-report.md` (10-iteration audit appendix, per-iteration deltas, findings registry).
- Target: diff `5772e0bfd3..7b9d3b6b71`, pinned HEAD `7b9d3b6b71` on `skilled/v4.0.0.0`. Read-only; default read path unchanged (`legacy`).
