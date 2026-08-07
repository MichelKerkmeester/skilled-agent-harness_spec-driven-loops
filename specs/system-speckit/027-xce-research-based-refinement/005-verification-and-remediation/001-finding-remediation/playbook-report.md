---
title: "MiMo Playbook Wave + Stress Stage: 475 Scenarios, 22 Real Defects Found and Fixed"
description: "Full manual-testing-playbook execution across the three system skills with MiMo v2.5 Pro as test subject, cross-model FAIL re-verification splitting 61 FAILs into 22 real defects (all fixed), 22 sandbox conditions, and 17 subject errors, plus four gap-filling stress suites running green."
trigger_phrases:
  - "027 playbook report"
  - "mimo playbook wave results"
  - "playbook fail re-verification"
  - "stress stage report"
importance_tier: "important"
contextType: "implementation"
---

# Playbook Execution + Stress Stage — Report

> **Verdict: COMPLETE.** All 475 playbook scenarios across the three system skills were executed with MiMo v2.5 Pro as the test subject. Every FAIL was re-verified by independent gpt-5.5 seats and dispositioned: 22 real defects (all fixed and committed the same day), 22 sandbox-conditional, 17 subject errors. The stress stage added four gap-filling suites; the full stress config runs green twice (35 files / 118 tests).

## 1. Method

Sixty-three MiMo v2.5 Pro seats (cli-opencode, `--variant high`, time-boxed scenarios, safety rails = SKIP for live-state scenarios) executed the manual-testing playbooks of system-spec-kit, system-code-graph, and system-skill-advisor. Three initially unparseable seats were re-run to complete the census. Every FAIL then went through a re-verification wave: eight gpt-5.5-fast high seats, eight FAILs each, re-running each scenario's decisive check and classifying REAL-DEFECT / ENV-CONDITIONAL / SUBJECT-ERROR. (A first re-verify attempt at sixteen FAILs per seat exceeded the 700-second budget and was redone at eight per seat — the narrow-slice rule held.) Each REAL-DEFECT classification was then re-checked directly in this session before any fix.

## 2. Census

| Skill | PASS | FAIL | SKIP | UNAUTOMATABLE | Total |
|-------|------|------|------|---------------|-------|
| system-spec-kit | 174 | 52 | 118 | 63 | 407 |
| system-code-graph | 17 | 3 | 2 | 0 | 22 |
| system-skill-advisor | 15 | 10 | 21 | 0 | 46 |
| **Total** | **206** | **65** | **141** | **63** | **475** |

SKIPs are safety rails (live daemon/DB state the seats must not touch) plus missing sandbox services; UNAUTOMATABLE covers operator-interactive scenarios (live session observation, account switching, phone notifications).

## 3. FAIL re-verification outcome

61 distinct FAILs entered re-verification (the remaining four arrived with the seat-54 rerun and were folded into the same triage): **22 REAL-DEFECT / 22 ENV-CONDITIONAL / 17 SUBJECT-ERROR**.

ENV-CONDITIONAL breakdown: 14 daemon-down / warm-only refusals (the sandbox runs without warm daemons by design), 4 stale-dist freshness gates, 1 missing Ollama, 3 other sandbox conditions. None reproduce against a correctly provisioned host.

## 4. Real defects — all fixed

**Code and test defects (7):**

| Defect | Fix commit |
|--------|-----------|
| `query_text` resolution threw on the PII-clean consumption_log schema (validation resolver + shadow-evaluation query pool) | `cbd59062f4` |
| Stale test fixtures: subscriber-summary hint rename unasserted; raw `query_text` inserts | `cbd59062f4` |
| Module headers missing on two storage modules; deploy script lacked full strict mode; phase-workflow test asserted prose that moved into workflow assets | `b510f37cec` |
| BM25 engine-selection log wrote to stdout (JSON-RPC purity) | `ea857be10c` |
| Search UX-hook test mock missing the session-trust export | `2ce26d094f` |
| Advisor: sk-git outranked owning skills on memory-save and PR-review prompts (gold regression dataset 100/100 after fix) | `28c2fb7178` |
| Advisor: age haircut decayed by projection build time, never by per-skill freshness; local fallback results carried no source tag | `0504582b0e`, `9b1fc48904` |

**Scenario/doc drift fixed (the playbook asserted surfaces that never shipped or had moved) (12):**

| Scenario | Drift | Fix commit |
|----------|-------|-----------|
| hybrid-search-pipeline | `useGraph` is an internal option, not a `memory_search` parameter | `891310e726` |
| semantic-and-lexical-search | `citationPolicy` is a string enum; `responsePolicy` absent on good queries | `891310e726` |
| retention-sweep-dry-run | tool accepts only `dryRun` | `891310e726` |
| runtime-family-count-census | plural agents dir; equality invariant (now 12) | `ea857be10c` |
| feature-flag-governance | asserted invented age/cadence columns | `ea857be10c` |
| comment-hygiene hook | hook wired in `.claude/settings.json`, not the personal local file | `ea857be10c` |
| tool-routing-enforcement | Codex chain reads root `AGENTS.md` | `ea857be10c` |
| tool-call-shape-validation | `code_graph_apply` has no required fields by design | `268ee4effc` |
| specificity-ladder | free-text `code_graph_query` shape no longer exists; ladder targets `memory_search` | `9b1fc48904` |
| provenance-and-trust-lanes | provenance is block-level (`provenance_fingerprint` + `trust_lane`) | `2c69e21741` |
| projection | lane attribution exposes the strict laneBreakdown fields only | `2c69e21741` |
| ambiguity | OR-margin cluster, every member tagged `ambiguousWith` | `2c69e21741` |

**Infrastructure defects fixed without a commit (build artifacts) (1):** ten orphaned dist outputs (deleted sidecar/gemini-hook/migration sources) removed and dist rebuilt; the source-dist alignment checker reports zero violations.

**Validator fixtures (2 scenarios + 1 shared root cause):** the valid-phase children and both template-compliant fixtures were regenerated to current template compliance (`dca74a8e7b`); valid-phase validates recursively, both compliant fixtures pass strict, phase-workflow tests 89/0, template-structure suite 8/8.

Two re-verifier REAL-DEFECT calls were overturned on direct recheck: the hooks-barrel README accurately describes the shipped `postMutationHooks` response field (the seat grepped the wrong file), and `npm run lint` exists in `mcp_server` (the seat ran it from the wrong directory).

## 5. Stress stage

Baseline: 31 stress files / 113 tests green via `vitest.stress.config.ts`. Coverage audit against the 027 features and remediation additions found four gaps, now filled:

| New suite | Covers |
|-----------|--------|
| `stress_test/durability/ipc-client-cap-fanout-stress.vitest.ts` | IPC secondary-client cap (default 64) under 20+ concurrent initializes; low-cap refusal + recovery |
| `stress_test/substrate/secret-scrub-save-flood-stress.vitest.ts` | 50+ saves with fake credentials leave no raw secret on any durable surface |
| `stress_test/durability/shard-repair-persistence-stress.vitest.ts` | persisted repair intent dedupes 10 concurrent repair requests across a simulated restart |
| `stress_test/substrate/idempotency-receipt-race-stress.vitest.ts` | 12 concurrent identical stores: one immutable winner, losers replay it |

Full stress config green twice — once by the authoring seat, once independently in this session: **35 files / 118 tests** (`2ce26d094f`). All temp-dir and sandbox-socket scoped; the vitest setup's production-DB isolation guard was verified fail-closed.

## 6. Incident discovered during the stress stage

The live spec-memory main database (`mcp_server/database/context-index.sqlite`) carries real B-tree corruption, detected by the system's own post-crash integrity probe after the daemon died uncleanly. Damage is confined to derived/disposable structures: the `memory_fts_data` FTS5 shadow tree, `feedback_events`, `ingest_jobs`, and their indexes. The core `memory_index` content (10,287 rows) scans cleanly, and the markdown source-of-truth is intact. The needs-rebuild sentinel the probe wrote is legitimate and was left in place; the daemon is down pending an operator decision on repair (FTS rebuild + telemetry-table recreate in place, or the proven move-aside + force-reindex runbook). No automated write was made to the live database. The 027-built containment (integrity probe, sentinel, refusing to serve corrupt data) worked as designed.

## 7. Follow-ons

- `scripts/tests/test-validation-system.js` is broken independently of this work (CJS `require` under the scripts package's ESM scope); rename to `.cjs` or convert imports.
- Shadow-evaluation replay is intentionally starved post-PII (raw query text is no longer durably stored); a privacy-preserving replay pool is the open design follow-on.
- Live-DB repair decision (section 6) is operator-gated.

## 8. Verification

| Check | Result |
|-------|--------|
| Playbook census | 475/475 scenarios dispositioned |
| FAIL re-verification | 61/61 classified by independent seats; every REAL-DEFECT re-checked directly before fixing |
| Stress suites | 35 files / 118 tests green, twice |
| Typecheck | spec-kit `tsc` and advisor `npm run typecheck` clean after all fixes |
| Advisor gold regression | 100/100 pass |
| Drift checker | `verify_alignment_drift.py` 0 findings; source-dist alignment 0 violations |
