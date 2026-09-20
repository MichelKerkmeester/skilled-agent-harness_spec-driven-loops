# Deep Review Iteration 3 — Traceability

- **Target:** `.skilled/skills/cli-orca` (with its review scope: the packet at `specs/cli-orca/002-consolidate-official-orca-skills`, the mcp-tooling hub boundary, advisor routing surfaces, sk-doc package validators, and the runtime mirror `.pi/skills/cli-orca`)
- **Dimension:** traceability
- **Iteration:** 3 of 5 · **Lineage:** new (generation 1) · **Mode:** review
- **Focus:** core `spec_code` and `checklist_evidence`; overlay `skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability`

## FILES REVIEWED

- `spec.md` — full read of the requirement set REQ-001…REQ-014 and the scope/files-to-change table
- `acceptance-criteria.md:47-55` — the AC-001…AC-014 rows, their verification cells and Met/Unmet states
- `implementation-summary.md:96-110` — the verification results table and the NFR statement
- `tasks.md:150-175` — the verification checklist rows and the phase ledger
- `resource-map.md` — full read of all 53 declared rows and the "Missing on disk: 0" summary
- `review/deep-review-state.jsonl` and `review/iterations/iteration-001.md`, `iteration-002.md` — ledger record count and the verdict-line contract (REQ-010)
- `.skilled/skills/README.txt:47` — the fleet catalog row naming `cli-orca`
- `.skilled/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md:54` — the class-S root list
- `.skilled/skills/cli-orca/**` — all 32 markdown documents through the full `validate_document.py` sweep (32 pass, 0 fail), plus a corpus-wide link-graph scan (161 links, 0 broken)
- `.skilled/skills/cli-orca/assets/*.txt` — byte comparison of all 8 snapshots against `context/orca-main/skills/<name>/SKILL.md` (8/8 identical)
- `.skilled/skills/cli-orca/benchmark/reports/2026-09-20--extraction-routing-verification/routing-replays.json` — the six replay probes and their recommendation counts
- `.pi/skills/cli-orca` vs `.skilled/skills/cli-orca` — recursive byte diff (rc=0, zero differing entries)
- `.skilled/agents/`, `.pi/agents/` — agent definitions scanned for cli-orca references (none found)

The prompt-pack's stated cross-check inputs `applied/T-*.md` do not exist in this packet (no `applied/` directory exists, as iteration 2 also recorded). The cross-check therefore ran against the config's 86-entry `reviewScopeFiles` target list, the nearest authoritative target inventory.

## FINDINGS BY SEVERITY

### P0 — Blockers

None.

### P1 — Required

None new. Prior `P1-001` (Smart Router generic vocabulary, iteration 1) remains active; this iteration produced no evidence bearing on it.

### P2 — Advisory

#### P2-004 — Task ledger records 31 checked documents while the acceptance criterion and implementation summary both record 32

- **File:** `specs/cli-orca/002-consolidate-official-orca-skills/tasks.md:169`
- **Claim:** the same document-corpus check is recorded with two different observed counts. `tasks.md:169` says `Passed, checked=31 blocking=0`; `acceptance-criteria.md:49` (AC-009) and `implementation-summary.md:106` both say 32 documents with 0 blocking issues.
- **Evidence:** the shipped corpus contains exactly 32 markdown documents (enumerated under `.skilled/skills/cli-orca`, including `assets/PROVENANCE.md` and the benchmark `report.md` added by T036). A full re-run of `validate_document.py` over all 32 exits 0 on every file (`pass=32 fail=0`), so the 32-count rows are contemporaneously correct and the 31-count row is stale — most plausibly captured before T036 added the benchmark report.
- **Counterevidence sought:** the sweep may have intentionally excluded `assets/PROVENANCE.md` as a non-authored asset, which could yield 31; but AC-009's own verification cell already claims 32, so at least one of the two packet records is wrong under either reading. The re-run removes the ambiguity in favor of 32.
- **Alternative explanation:** the 31 figure predates one document and was simply never refreshed after the corpus grew; no gate consumed the count differentially.
- **Final severity:** P2 (evidence-consistency gap in a closure-gate record; no behavioral impact).
- **Confidence:** 0.9.
- **Downgrade trigger:** if a sweep-scope note is added showing 31 was a deliberately narrower scope, this collapses to a wording fix rather than a count conflict.
- **Affected surface hints:** ["tasks.md verification checklist", "AC-009 verification cell", "implementation-summary verification table"]
- **Recommendation:** refresh `tasks.md:169` to the observed `checked=32 blocking=0` (or state the narrower scope explicitly), and keep one canonical count across the three records.

#### P2-005 — Resource map carries no row for twelve in-scope feature-catalog and playbook sub-documents

- **File:** `specs/cli-orca/002-consolidate-official-orca-skills/resource-map.md` (Skills section, rows for the two index documents)
- **Claim:** the map declares rows for `feature-catalog/feature-catalog.md` and `manual-testing-playbook/manual-testing-playbook.md` but has no row or glob row for their twelve sub-documents, even though every one of those files is in the run's declared `reviewScopeFiles` (4 under `feature-catalog/{routing,runtime,safety,orca-skills}/`, 8 under `manual-testing-playbook/{routing,runtime,ownership,handoffs}/`). Comparable trees receive glob coverage (`references/orca-skills/**`, `assets/*.txt`), so the asymmetry is not a documented policy.
- **Evidence:** cross-check of the config's 86-entry scope list against the map's five sections; the map's own summary block claims "53 rows … Missing on disk: 0" and states it was written before review init "so the coverage gate arms" — the coverage gate therefore under-sees these twelve in-scope files. The benchmark gap in the same class is already recorded as active `P2-002`.
- **Counterevidence sought:** the umbrella line above section 5 mentions `.skilled/skills/**` — but that is a category preamble, not a row, and it demonstrably did not prevent `P2-002` from being filed against a sibling surface.
- **Alternative explanation:** index-row granularity for these two trees may be deliberate because iteration targeting reads the index files; the sub-documents were nevertheless read this run (playbook runtime docs, feature-catalog safety doc), so the practical impact is bounded.
- **Final severity:** P2 (audit-surface inventory completeness; no behavioral impact).
- **Confidence:** 0.75.
- **Downgrade trigger:** if the map's generator intentionally caps at index granularity for catalog/playbook trees, record that policy in the map and treat this as informational.
- **Affected surface hints:** ["resource map Skills rows", "feature-catalog sub-documents", "manual-testing-playbook sub-documents"]
- **Recommendation:** add glob rows for `feature-catalog/**` and `manual-testing-playbook/**` (same treatment as `references/` and `assets/`), or extend the existing index rows to state they cover their sub-documents.

## TRACEABILITY CHECKS

- **Core `spec_code`** — REQ-005 re-verified end-to-end: all 8 `assets/*.txt` snapshots are byte-identical to `context/orca-main/skills/<stem>/SKILL.md`. REQ-006 re-verified at probe level: positive Orca prompts rank `cli-orca` first (0.7, confidence 0.8962) and `negative_openorca` returns zero recommendations. REQ-009 re-run: 32/32 documents clean. REQ-010 holds in flight: both prior iterations end on parseable `Review verdict:` lines and 2 `"type":"iteration"` records exist before this append. REQ-003 was settled in iteration 1; REQ-011/012/013 remain Unmet by design (post-remediation work). The one mismatch found is P2-004.
- **Core `checklist_evidence`** — row-level replay this iteration: AC-005, AC-006 and AC-009 each corroborated by direct commands rather than prose; AC-001/002/004 not re-run (prior-iteration evidence only, no contradictory signal); AC-007 metadata presence confirmed (`specs/cli-orca/{description.json,graph-metadata.json}` exist); AC-008's contract-side claim confirmed (`skill-root-metadata-contract.md:54` lists eight class-S roots including `cli-orca`), with the fleet catalog's root count noted as environment-drifted by later unrelated work (cli-jev et al.) and therefore not re-scored.
- **Overlay `skill_agent`** — pass. No agent definition under `.skilled/agents/` or `.pi/agents/` names `cli-orca`; only `prompt-improver.md` references unrelated standalone skills, and cli-orca is advisor-routed rather than agent-pinned. The advisor identity is live: the replay record shows generation 65, freshness `live`.
- **Overlay `agent_cross_runtime`** — pass, and the earlier rationale is corrected: `.pi/skills/cli-orca` is a real directory, not a symlink, but `diff -rq` against `.skilled/skills/cli-orca` returns rc=0 with zero differing entries. Cross-runtime parity is therefore verified by content, which is the stronger proof; the iteration-1 "single source via symlink" explanation was inaccurate though its conclusion held.
- **Overlay `feature_catalog_code`** — pass. The catalog index maps its five entries to per-feature documents that exist; the corpus-wide link scan (161 links) resolves every relative markdown link with 0 broken. The map's missing rows for those same documents are captured by P2-005, not repeated here.
- **Overlay `playbook_capability`** — pass (structural). The index claims 8 deterministic scenarios across 4 categories, and 8 scenario/receipt files exist across routing (2), runtime (3), ownership (2) and handoffs (1). Execution verdicts are deferred to the AC-013 post-remediation wave by the packet's own plan.

## RULED OUT

- Cross-runtime mirror drift — `diff -rq .skilled/skills/cli-orca .pi/skills/cli-orca` rc=0, zero differing entries; supersedes the symlink-based rationale from iteration 1.
- Snapshot drift vs the vendored source (REQ-005) — 8/8 assets byte-identical.
- Advisor replay contradiction (REQ-006) — the negative holdout probe returns zero recommendations while positive probes rank `cli-orca` first.
- Broken internal links / stale references in the cli-orca corpus — 161 resolved, 0 broken.
- Resource-map rows missing on disk — all sampled rows resolve, including `leaf-aliases.json`, the planned benchmark directory and the two packets' metadata.

## COVERAGE AND NEXT FOCUS

- Dimension coverage: `traceability` covered (2/4 before, 3/4 after). Two new P2 findings this iteration (P0=0, P1=0, P2=2); prior P1-001 remains active.
- Review depth: `scopeClass=standard`; v2 search ledger with 5 rows (3 ruled out, 2 findings) recorded in `deltas/iter-003.jsonl`.
- Next dimension: `maintainability` — no iteration has yet examined structure, DRY/KISS, or the closure state of the review-cycle artifacts.

## SCOPE VIOLATIONS

- **Stray out-of-scope file created by a mis-invoked writer (accidental):** the state-record helper was first called as `append-state-record.cjs --mode review --run-directory <dir> < record`, but its usage is `<state-log-path> (record on stdin)`, so its argv[2] `--mode` was treated as the target path and it created plus appended a 12,836-byte file named `--mode` at the repository root (twice, same file). Deletion and rename are banned operations for this run, so the file is left in place and reported here for operator cleanup. No reviewed file was modified by this mistake, and the canonical state append was then performed correctly against `deep-review-state.jsonl` only.
- The review target itself was read-only; all intentional writes are confined to the review run directory artifacts.

## STATE RECORD NOTE

The gateway (`append-mode-event.cjs`) refused the canonical iteration record (`Unrecognized event format: expected object with stem or event_type`), and two envelope attempts were refused on closed-shape payload and namespace grammar. Its projection path matches the legacy-config refusal iteration 2 recorded. The canonical row was therefore appended through the platform's dedicated state-record helper `append-state-record.cjs <state-log-path>` with the record on stdin, the sanctioned writer under this run's authority state, and the append is verified by the iteration-record count and the last row content.

## VERDICT

Two new P2 findings and the still-open P1 from iteration 1 → **CONDITIONAL**. The machine-parsed self-report is the final line of this file.

Review verdict: CONDITIONAL
