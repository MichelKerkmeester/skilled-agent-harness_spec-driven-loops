---
title: "Review: Goal-OpenCode-Plugin Documentation Staleness Audit (Independent Audit of Companion Research)"
description: "10-iteration forced-depth deep-review independently auditing the companion 10-iteration deep-research pass's 6 findings on /goal OpenCode plugin documentation staleness, plus 3 additional findings the research pass missed."
trigger_phrases:
  - "goal plugin documentation review"
  - "goal opencode plugin doc audit review"
  - "mk-goal.js documentation gaps review"
  - "companion research independent audit"
importance_tier: important
contextType: review
---

<!-- SPECKIT_TEMPLATE_SOURCE: deep-review-output | v1.0 -->

# Review: Goal-OpenCode-Plugin Documentation Staleness Audit

## 1. Executive Summary

**Overall verdict: CONDITIONAL** (hasAdvisories: not applicable — verdict is CONDITIONAL, not PASS)

**Active findings: P0=0, P1=3, P2=6** (9 total active findings across 10 forced iterations, 0 refuted, 0 duplicates after ID reconciliation)

**Review scope:** Independent audit of whether related skill documentation (`SKILL.md`, `references/`, `assets/`) and README files (skill READMEs, code READMEs) across the repo describe now-stale behavior for the `/goal` OpenCode plugin, following the phases 010-014 remediation and the `goal_opencode.md` filename correction. Executor: `cli-opencode`, model `openai/gpt-5.5-fast`, reasoning effort `high`, 10 forced iterations (`stopPolicy=max-iterations`, `antiConvergence.minIterations=10`) per operator directive to not converge early. Dimensions: correctness, security, traceability, maintainability — all 4 received genuine multi-iteration coverage (not nominal touches).

**Companion research packet audited:** `.opencode/specs/deep-loops/032-goal-opencode-plugin/research/research.md` (10-iteration deep-research pass, same executor/model). All 6 of its numbered findings were independently re-verified against live code/docs (not re-cited) — **all 6 CONFIRMED** at the same or an adjusted severity (see §1.5). Three additional findings not present in the research packet were discovered (§1.5, item "New").

**Live command filename re-confirmed independently in iterations 1, 6, 10:** `.opencode/commands/goal_opencode.md` is the only file matching `.opencode/commands/*goal*.md`; `.opencode/commands/goal.md` does not exist.

---

## 1.5 Independent Audit Verdict vs. Companion Research (operator-requested)

Per the operator's explicit instruction, each companion-research finding was independently re-verified (not re-cited) and assigned this review's own P0/P1/P2 verdict:

| # | Companion Research Finding | Research's Severity | This Review's Verdict | Evidence |
|---|---|---|---|---|
| 1 | `ENV_REFERENCE.md` omits the 3 new `MK_GOAL_STATE_*` env vars | P1 | **CONFIRMED-P1** (`P1-001`) | Independently re-read `mk-goal.js:33-42` vs `ENV_REFERENCE.md:646-660` in iteration 1; re-verified in iteration 9's adversarial pass |
| 2 | `references/hooks/goal_plugin.md` (already updated this session) still lacks the same 3 env vars + `store_health`/`mutation=` coverage | P1 | **CONFIRMED-P1** (`P1-002`) | Full-file read in iteration 3; the "already updated, still wrong" pattern independently reproduced |
| 3 | `.opencode/plugins/README.md` too thin to be the "plugin contract" the root README delegates to it as | P1 | **CONFIRMED-P1** (`P1-003`) | Both files read in full in iteration 4; root cause elaborated as a doc-topology issue in iteration 8 (`I8-P2-1`) |
| 4 | `system-skill-advisor/README.md:85` contradicts its own feature catalog on live-tool verification status | P2 | **CONFIRMED-P2** (`P2-001`) | Both docs read in iteration 4; contradiction holds exactly as described |
| 5 | Manual testing playbooks don't validate `store_health=`/`mutation=` output | P2 | **CONFIRMED-P2** (`P2-002`) | Both playbooks read in full in iteration 5; exact-string sweep confirms no coverage; cross-playbook asymmetry noted (system-skill-advisor has partial generic mutation-response coverage, system-spec-kit has none) |
| 6 | Stale `goal.md` filename references in phase 009/011/003 docs + archived review README | P3 (operator's call, "lower priority") | **CONFIRMED-P2 for the operational subset, REFUTED-AS-ACTIONABLE for the historical subset** (`DR-006-P2-001`) | Iteration 6 classified each of the 4 cited locations individually: phase 009 `handover.md:95` and phase 011 `tasks.md:66,109` are **current-and-wrong** operational claims (upgraded from research's P3 framing because they instruct a live cold-read/task action against an absent file, not just narrate history); phase 003 changelog and the archived review README are correctly historical narrative (no action needed, consistent with research's own framing) |

**New findings not in the companion research packet** (research's reducer stalled on repeated ground for its own iterations 4-9, so its coverage was treated as incomplete per the operator's brief — these 3 were found by actively broadening past research's scope):

| ID | Severity | Title | Iteration |
|---|---|---|---|
| `I8-P2-1` | P2 | Goal-plugin docs lack a single contract owner and canonical output-field schema (structural root-cause finding explaining *why* 3+ docs independently drifted after the same code change) | 8 |
| `I9-P2-1` | P2 | `ENV_REFERENCE.md` carries a stale "generated from source analysis, last updated 2026-06-10" marker while missing env vars shipped and documented as of phase 014 (2026-07-01) | 9 |
| `I10-P2-1` | P2 | Registered tool-path tests (`mk-goal-tool-path.test.cjs`) assert only `mutation=created`; `mutation=refreshed` and `mutation=replaced` are unpinned | 10 |

**Traceability re-verification (iteration 7 + iteration 9):** research's own negative-sweep claims — that no OTHER skill besides `system-spec-kit` and `system-skill-advisor` has a stray goal-plugin `feature_catalog`/`manual_testing_playbook`/`constitutional` entry, and that `cli-opencode`/`cli-claude-code`/`sk-code`/`sk-prompt-models`/`deep-loop-workflows` have zero goal-plugin mentions — were independently re-run (not trusted) in iteration 7 (full re-sweep + `assets/` directories, which research's brief flagged as a possible gap) and iteration 9 (config manifests, `.env.example`, `docs/`, `CHANGELOG.md`, `.opencode/AGENTS.md`). Both iterations **CONFIRM** research's negative claims hold; no additional stray doc-class was found anywhere in the repo.

---

## 2. Planning Trigger

`/speckit:plan` is **required** — 3 active P1 findings block a clean PASS.

```json Planning Packet
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": [
    { "id": "P1-001", "severity": "P1", "title": "ENV_REFERENCE.md omits 3 MK_GOAL_STATE_* env vars" },
    { "id": "P1-002", "severity": "P1", "title": "goal_plugin.md (already updated) still omits the 3 env vars plus store_health/mutation output coverage" },
    { "id": "P1-003", "severity": "P1", "title": "Root README delegates the /goal plugin contract to .opencode/plugins/README.md, which does not define it" },
    { "id": "P2-001", "severity": "P2", "title": "system-skill-advisor/README.md contradicts its own feature catalog on live-tool verification status" },
    { "id": "P2-002", "severity": "P2", "title": "Manual testing playbooks do not validate store_health=/mutation= output" },
    { "id": "DR-006-P2-001", "severity": "P2", "title": "Packet-history docs (phase 009/011) contain current-and-wrong stale goal.md operational claims" },
    { "id": "I8-P2-1", "severity": "P2", "title": "Goal-plugin docs lack a single contract owner and canonical output-field schema" },
    { "id": "I9-P2-1", "severity": "P2", "title": "ENV_REFERENCE.md carries a stale generated-date marker while missing shipped env vars" },
    { "id": "I10-P2-1", "severity": "P2", "title": "Registered tool-path tests do not pin mutation=refreshed or mutation=replaced" }
  ],
  "remediationWorkstreams": [
    "P1: fix env-var + output-field documentation gaps (P1-001, P1-002)",
    "P1: fix or retarget the plugin-contract delegation (P1-003)",
    "P2: fix contradiction, playbook coverage, structural doc ownership, stale marker, and test coverage (P2-001, P2-002, DR-006-P2-001, I8-P2-1, I9-P2-1, I10-P2-1)"
  ],
  "specSeed": [
    "Add MK_GOAL_STATE_ARCHIVE_RETENTION_DAYS / MK_GOAL_STATE_ACTIVE_RETENTION_DAYS / MK_GOAL_STATE_SWEEP_INTERVAL_MS rows to ENV_REFERENCE.md and references/hooks/goal_plugin.md",
    "Add an Output Fields section (store_health=, mutation=) to references/hooks/goal_plugin.md",
    "Decide and implement one of: expand .opencode/plugins/README.md with a real mk-goal contract subsection, OR retarget root README's pointer to references/hooks/goal_plugin.md",
    "Designate references/hooks/goal_plugin.md as the single canonical operator contract; convert ENV_REFERENCE.md/root README/plugins README/feature catalogs/playbooks to pointers where practical"
  ],
  "planSeed": [
    "T-ENV-01: Add 3 env var rows (defaults 90d/30d/1h) + regenerate/update the generated-date marker in ENV_REFERENCE.md",
    "T-HOOK-01: Add the same 3 env vars plus an Output Fields table (store_health, mutation) to references/hooks/goal_plugin.md",
    "T-CONTRACT-01: Resolve the plugins/README.md vs root README delegation gap (expand or retarget)",
    "T-ADVISOR-01: Fix system-skill-advisor/README.md:85 wording to match the verified feature catalog status",
    "T-PLAYBOOK-01: Add store_health=/mutation= verification steps to both manual testing playbooks",
    "T-HIST-01 (optional, operator's call): annotate phase 009 handover.md:95 and phase 011 tasks.md:66,109 as historical/superseded",
    "T-TEST-01: Add registered tool-path test assertions for mutation=refreshed and mutation=replaced"
  ],
  "findingClasses": ["cross-consumer", "instance-only", "matrix/evidence", "test-isolation", "cross-consumer documentation maintainability"],
  "affectedSurfacesSeed": [
    ".opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md",
    ".opencode/skills/system-spec-kit/references/hooks/goal_plugin.md",
    "README.md",
    ".opencode/plugins/README.md",
    ".opencode/skills/system-skill-advisor/README.md",
    ".opencode/skills/system-spec-kit/manual_testing_playbook/18--ux-hooks/goal-opencode-plugin.md",
    ".opencode/skills/system-skill-advisor/manual_testing_playbook/02--cli-hooks-and-plugin/goal-opencode-plugin.md",
    ".opencode/specs/deep-loops/032-goal-opencode-plugin/009-speckit-command-goal-prompt-offer/handover.md",
    ".opencode/specs/deep-loops/032-goal-opencode-plugin/011-command-surface-normalization/tasks.md",
    ".opencode/plugins/tests/mk-goal-tool-path.test.cjs"
  ],
  "fixCompletenessRequired": false
}
```

`fixCompletenessRequired` is `false` because no active finding is in security-sensitive fix scope (iteration 2's dedicated security pass found zero doc drift on sanitizer/redaction claims; no P0 exists anywhere in this review).

---

## 3. Active Finding Registry

| ID | Sev | Title | Dimension | File:Line | Disposition |
|---|---|---|---|---|---|
| P1-001 | P1 | ENV_REFERENCE.md omits 3 new env vars | correctness | `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:646-660` | open |
| P1-002 | P1 | goal_plugin.md (already updated) still omits same 3 env vars + store_health/mutation | correctness, traceability | `.opencode/skills/system-spec-kit/references/hooks/goal_plugin.md:33-52` | open |
| P1-003 | P1 | Root README delegates /goal plugin contract to an inventory that doesn't define it | traceability, maintainability | `README.md:1230-1233` → `.opencode/plugins/README.md` | open |
| P2-001 | P2 | Skill Advisor README contradicts feature catalog on live-tool verification | traceability | `.opencode/skills/system-skill-advisor/README.md:85` | open |
| P2-002 | P2 | Manual playbooks don't validate store_health=/mutation= output | traceability | `.opencode/skills/system-spec-kit/manual_testing_playbook/18--ux-hooks/goal-opencode-plugin.md:19-25` (+ skill-advisor sibling) | open |
| DR-006-P2-001 | P2 | Packet-history docs contain current-and-wrong stale goal.md claims | correctness, traceability | `009-.../handover.md:95`, `011-.../tasks.md:66,109` | open |
| I8-P2-1 | P2 | Goal-plugin docs lack a single contract owner / canonical output-field schema | maintainability | multiple (see below) | open |
| I9-P2-1 | P2 | ENV_REFERENCE.md carries a stale generated-date marker | traceability | `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:772` | open |
| I10-P2-1 | P2 | Tool-path tests don't pin mutation=refreshed/replaced | correctness (test coverage) | `.opencode/plugins/tests/mk-goal-tool-path.test.cjs:49-68` | open |

### P1-001 — ENV_REFERENCE.md omits 3 new env vars

- **Evidence:** `mk-goal.js:33-42` defines and consumes `MK_GOAL_STATE_ARCHIVE_RETENTION_DAYS` (default 90d), `MK_GOAL_STATE_ACTIVE_RETENTION_DAYS` (default 30d), `MK_GOAL_STATE_SWEEP_INTERVAL_MS` (default 1h) in `archiveGoalStateFile()`/`pruneArchive()`/`sweepOrphanedActiveStates()` (`mk-goal.js:825-899`, `:1758-1761`, `:1824-1828`); `ENV_REFERENCE.md:646-660`'s goal-plugin table has no rows for any of the three.
- **Impact:** operators cannot discover shipped retention/sweep controls via the central env reference.
- **Fix recommendation:** add all 3 rows with defaults and source references.
- **Finding class:** cross-consumer. **Scope proof:** source-side definitions + central-doc gap both independently re-read (iterations 1, 9).
- **Affected surfaces:** `ENV_REFERENCE.md`, operator configuration docs.

### P1-002 — goal_plugin.md still omits env vars + output fields (the "already updated, still wrong" finding)

- **Evidence:** `references/hooks/goal_plugin.md` was touched this session for the filename fix (`goal_plugin.md:29`) but its env table (`:43-52`) still has no rows for the 3 env vars, and it has no output-field section documenting `store_health=` (`mk-goal.js:1605-1637`) or `mutation=<created|refreshed|replaced>` (`mk-goal.js:1668-1675`).
- **Impact:** the operator contract doc for this plugin is incomplete despite being the doc most recently touched; this is a genuine "believed complete, actually isn't" gap, independently re-confirmed in iteration 9's adversarial pass.
- **Fix recommendation:** add the 3 env rows + an Output Fields table.
- **Finding class:** cross-consumer. **Scope proof:** full-file read, sibling-doc consistency check against `ENV_REFERENCE.md` (both omit the same vars — no naming/default disagreement exists because neither documents them at all).
- **Affected surfaces:** `references/hooks/goal_plugin.md`.

### P1-003 — Root README delegates the plugin contract to a document that doesn't define it

- **Evidence:** root `README.md:1230-1233` says "See `.opencode/plugins/README.md` for the plugin contract"; `.opencode/plugins/README.md`'s `mk-goal.js` coverage (`:42-51`) is a single inventory row, and its config/contract subsections (`:69-130`) cover only `mk-skill-advisor` and `mk-code-graph` — no mk-goal config/env/output subsection exists.
- **Impact:** operators following the root README's own pointer for the goal-plugin contract land on a document that does not contain it.
- **Fix recommendation (two options surfaced, not adjudicated per review's read-only mandate):** (a) expand `.opencode/plugins/README.md` with a real `mk-goal` contract subsection, or (b) retarget the root README pointer to `references/hooks/goal_plugin.md`.
- **Finding class:** cross-consumer. **Root cause (iteration 8):** the doc topology itself — env vars and output fields are split across `ENV_REFERENCE.md`, `goal_plugin.md`, root README, and `.opencode/plugins/README.md` with no single canonical owner — is the structural reason this and the two P1s above co-occurred (see `I8-P2-1`).
- **Affected surfaces:** `README.md`, `.opencode/plugins/README.md`, `references/hooks/goal_plugin.md`.

### P2-001 — Skill Advisor README self-contradiction

- **Evidence:** `.opencode/skills/system-skill-advisor/README.md:85` says `/goal` live OpenCode-tool invocation is "still under investigation"; the sibling `feature_catalog/07--hooks-and-plugin/goal-opencode-plugin.md:41` states a real `opencode serve` run listed `mk_goal`/`mk_goal_status` and a live model turn persisted state.
- **Impact:** internal contradiction within the same skill's own documentation set on a verification-status claim.
- **Fix recommendation:** update `README.md:85` to match the feature catalog's verified status (or narrow the wording to a more specific unverified sub-claim, if one exists).
- **Finding class:** instance-only. **Affected surfaces:** `system-skill-advisor/README.md`, its feature catalog.

### P2-002 — Manual testing playbooks don't validate the new output fields

- **Evidence:** neither `system-spec-kit/manual_testing_playbook/18--ux-hooks/goal-opencode-plugin.md` nor `system-skill-advisor/manual_testing_playbook/02--cli-hooks-and-plugin/goal-opencode-plugin.md` names `store_health=` or `mutation=<created|refreshed|replaced>` as a pass criterion; exact-string sweep confirms zero hits.
- **Impact:** a manual test run can currently pass without ever exercising these newly-shipped status surfaces.
- **Asymmetry noted (iteration 5):** the system-skill-advisor playbook has a generic post-mutation-state check that could catch some regressions incidentally; the system-spec-kit playbook has no equivalent step at all.
- **Fix recommendation:** add explicit `store_health=` and `mutation=` pass criteria to both playbooks.
- **Finding class:** matrix/evidence. **Affected surfaces:** both manual testing playbooks.

### DR-006-P2-001 — Packet-history docs with current-and-wrong stale filename claims

- **Evidence (per-location classification, iteration 6):**
  - `009-speckit-command-goal-prompt-offer/handover.md:95` — **current-and-wrong**: a cold-read order still literally points at the absent `goal.md`.
  - `011-command-surface-normalization/tasks.md:66,109` — **current-and-wrong**: body text/completion-criteria claim of "zero stale-reference hits" that is no longer literally true; `tasks.md:53` is mixed historical completed-task wording (lower concern).
  - `changelog/changelog-032-003-goal-command.md:26,56` — **historical narrative**, correctly describes the original bug being fixed; no action needed.
  - `review_archive/2026-07-01-plugin-implementation-review/README.md:12` — **current-and-wrong** scope table; `:17` is historical (no action).
  - Independent repo-wide sweep (iteration 6) found no additional active-scope `goal.md` hits beyond these.
- **Severity note:** research framed this class as P3 ("operator's call, lower priority"); this review upgrades the *operational* subset (handover.md, tasks.md) to P2 because those specific lines instruct a live action against a nonexistent file rather than merely narrating history. The historical subset (changelog, archived README) is correctly historical and needs no fix.
- **Fix recommendation:** annotate or update the current-and-wrong lines only; preserve historical narrative untouched. Operator's call per original brief.
- **Finding class:** instance-only. **Affected surfaces:** phase 009 `handover.md`, phase 011 `tasks.md`.

### I8-P2-1 — Doc topology lacks a single contract owner (NEW, structural root-cause finding)

- **Evidence:** the goal-plugin operator contract is split across `ENV_REFERENCE.md` (env vars), `goal_plugin.md` (partial contract + filename history), root `README.md` (pointer), `.opencode/plugins/README.md` (inventory only), feature catalogs, and two playbooks — with no canonical "Output Fields" schema section anywhere, even though `mk-goal.js`'s status renderer (`:1598-1647`) is itself clear and self-documenting.
- **Impact:** this structural fragmentation is the most plausible root cause for why the SAME code change (phases 010-014) independently drifted across 3+ separate documents rather than one.
- **Fix recommendation:** designate `references/hooks/goal_plugin.md` as the single canonical operator contract (add the missing Output Fields table there), and convert the other docs into pointers or narrower validation-only references rather than each owning partial contract text.
- **Finding class:** cross-consumer documentation maintainability.

### I9-P2-1 — Stale generated-date marker on ENV_REFERENCE.md (NEW)

- **Evidence:** `ENV_REFERENCE.md:772` states the file was generated from source-code analysis and last updated `2026-06-10`; phase 014 (completed `2026-07-01`, see `014-goal-state-cleanup-and-archive/implementation-summary.md:61-65`) shipped the 3 new env vars afterward, but the marker was never refreshed.
- **Impact:** the stale marker implies the table reflects current source analysis when it does not — compounds P1-001 by giving readers false confidence in completeness.
- **Fix recommendation:** regenerate or update the marker as part of the P1-001 fix.
- **Finding class:** instance-only.

### I10-P2-1 — Tool-path tests don't pin all 3 mutation states (NEW)

- **Evidence:** `mk-goal.js:1668-1675` selects `mutation=created|refreshed|replaced`; `.opencode/plugins/tests/mk-goal-tool-path.test.cjs:49-68` (grep-confirmed) only asserts `mutation=created` (line 56).
- **Impact:** output regression risk for the `refreshed`/`replaced` branches is untested at the tool-path level (state-level and lifecycle tests cover adjacent but different behavior).
- **Fix recommendation:** add tool-path assertions for same-objective set (`refreshed`) and changed-objective set (`replaced`).
- **Finding class:** test-isolation.

---

## 4. Remediation Workstreams

**P1 (blocking clean PASS):**
1. Add the 3 `MK_GOAL_STATE_*` env var rows to `ENV_REFERENCE.md` (P1-001) — bundle with the I9-P2-1 marker refresh.
2. Add the same 3 env vars plus an Output Fields table (`store_health=`, `mutation=`) to `references/hooks/goal_plugin.md` (P1-002) — this can double as the I8-P2-1 canonical-contract fix.
3. Resolve the plugin-contract delegation gap: expand `.opencode/plugins/README.md` or retarget the root README pointer (P1-003).

**P2 (advisory, does not block PASS but should be tracked):**
4. Fix `system-skill-advisor/README.md:85` wording (P2-001).
5. Add `store_health=`/`mutation=` checks to both manual testing playbooks (P2-002).
6. Annotate/update the current-and-wrong stale-filename lines in phase 009/011 docs, operator's call (DR-006-P2-001).
7. Add tool-path test assertions for `mutation=refreshed`/`replaced` (I10-P2-1).

---

## 5. Spec Seed

- `ENV_REFERENCE.md` goal-plugin table needs 3 new rows (`MK_GOAL_STATE_ARCHIVE_RETENTION_DAYS`=90d, `MK_GOAL_STATE_ACTIVE_RETENTION_DAYS`=30d, `MK_GOAL_STATE_SWEEP_INTERVAL_MS`=1h) plus a refreshed generated-date marker.
- `references/hooks/goal_plugin.md` needs the same 3 env rows plus a new Output Fields section (`store_health`, `mutation`).
- A decision is needed on plugin-contract ownership: expand `.opencode/plugins/README.md` vs. retarget the root README pointer to `goal_plugin.md`.
- Both manual testing playbooks need explicit pass criteria for the 2 new output fields.
- `mk-goal-tool-path.test.cjs` needs 2 additional assertions (`refreshed`, `replaced`).

---

## 6. Plan Seed

- T-ENV-01: Add 3 env var rows + refresh generated-date marker in `ENV_REFERENCE.md`.
- T-HOOK-01: Add 3 env var rows + Output Fields table to `references/hooks/goal_plugin.md`.
- T-CONTRACT-01: Resolve plugins/README.md vs. root README delegation (pick one option, implement).
- T-ADVISOR-01: Fix `system-skill-advisor/README.md:85` wording.
- T-PLAYBOOK-01: Add `store_health=`/`mutation=` steps to both playbooks.
- T-HIST-01 (optional): annotate phase 009/011 current-and-wrong lines.
- T-TEST-01: Add `mutation=refreshed`/`replaced` tool-path test assertions.

---

## 7. Traceability Status

**Core protocols:**

| Protocol | Status | Evidence |
|---|---|---|
| `spec_code` | partial-pass | Doc claims cross-checked against live `mk-goal.js` source across iterations 1, 2, 3, 9, 10; 3 P1 + several P2 mismatches confirmed, no correctness defect found in the plugin code itself |
| `checklist_evidence` | not_applicable | Review target type is `files` (repo-wide doc audit), not a spec-folder's own checklist |

**Overlay protocols:**

| Protocol | Status | Evidence |
|---|---|---|
| `skill_agent` | pass | `deep-review` workflow + `sk-code-review` severity doctrine loaded every iteration before severity calls |
| `agent_cross_runtime` | partial | `constitutional/goal-prompting-runtime-specific.md`'s Claude-vs-OpenCode distinction re-verified as accurate (iteration 1); no `.opencode/AGENTS.md` goal-plugin mention found (iteration 10) |
| `feature_catalog_code` | pass | Both feature catalogs (system-spec-kit, system-skill-advisor) checked against code; system-skill-advisor's contradicts its own README (P2-001); system-spec-kit's is accurate |
| `playbook_capability` | fail-advisory | Both manual playbooks checked; neither validates the 2 new output fields (P2-002) |

**AC_COVERAGE:** exempt (review target type is `files`, not a lifecycle-active spec-folder target).

---

## 8. Deferred Items

- Whether to fix `.opencode/plugins/README.md` by expansion or by retargeting the root README pointer (P1-003) is a genuine either/or design decision, not adjudicated by this review (read-only mandate) — flag for `/speckit:plan` to decide.
- Annotating vs. leaving the historical-narrative subset of stale `goal.md` references (phase 003 changelog, archived review README) is explicitly the operator's call per the original brief; no fix required.
- The `.opencode/plugins/README.md:~70` "Both plugins support" wording mismatch against its own 5-6-entrypoint table (research's P3, iteration 4's brief confirmation) was not filed as a separate formal finding this iteration — it's subordinate to P1-003 and can be corrected in the same pass.

---

## 9. Search Ledger

*No search-depth state captured (legacy v1 record).* All 10 iterations used the v1 JSONL schema (no `reviewDepthSchemaVersion: 2` records); `searchCoverage`, `candidateCoverage`, `searchDebt`, `ruledOutCandidates`, and `cleanSearchProof` are not populated in the reducer-owned registry for this run.

---

## 10. Audit Appendix

### Convergence Summary

10 iterations forced to completion per `stopPolicy=max-iterations` / `antiConvergence.minIterations=10` (operator directive: "target exactly 10 iterations; do not converge early unless every doc class is genuinely covered"). Iterations 4-7 and 8-10 ran as two concurrent parallel batches (narrowed per-iteration write paths, orchestrator-merged into canonical state after each batch) per a mid-session operator instruction to parallelize remaining iterations; iterations 1-3 ran sequentially. `newFindingsRatio` per iteration: 1.0, 0.0, 1.0, 0.67, 0.25, 0.14, 0.0, ~0.14, ~0.14, ~0.11 — genuine broadening occurred (iteration 10's own self-assessment: "correctness, security, traceability, and maintainability each received real, evidence-backed coverage rather than repeated citation").

### Coverage Summary

Dimension coverage: 4/4 (correctness: iterations 1, 3, 6, 9, 10; security: iteration 2 + spot-checks in 9/10; traceability: iterations 3, 4, 5, 7, 9, 10; maintainability: iteration 8, 10). Doc-class coverage: `ENV_REFERENCE.md`, `references/hooks/goal_plugin.md`, root `README.md`, `.opencode/plugins/README.md`, `system-skill-advisor/README.md` + feature catalog, both manual testing playbooks, `constitutional/goal-prompting-runtime-specific.md`, `plugin_bridges/README.md`, `ARCHITECTURE.md`, packet-history docs (phases 009/011/003, archived review), a targeted negative sweep of 5 sibling skills' `SKILL.md`/`references/`/`assets/`, a repo-wide sweep of ALL skills' `feature_catalog/`/`manual_testing_playbook/`/`constitutional/`/`assets/` directories, config manifests (`opencode.json`), `.env.example`, top-level `CHANGELOG.md`, and `.opencode/AGENTS.md`.

### Ruled-Out Claims

- `.opencode/commands/goal.md` does not exist as a live file (re-confirmed independently 3 times: iterations 1, 6, 10).
- No live/current doc anywhere claims `usage_limited` is dead/unimplemented, or that goal-state is never cleaned up (consistent with research's own negative sweep; not independently re-swept exhaustively by this review since research's confirmation on this specific point was strong and multiply-replicated, but no contradicting evidence surfaced in any of the 10 iterations).
- `.opencode/plugins/mk-goal.js`'s sanitizer/redaction hardening claims: no in-scope doc over- or under-claims this security property (iteration 2, dedicated security pass, clean negative).
- Research's negative-sweep claims (no stray goal-plugin doc in any skill besides system-spec-kit/system-skill-advisor; no goal-plugin mention in cli-opencode/cli-claude-code/sk-code/sk-prompt-models/deep-loop-workflows) — independently re-verified TRUE in iterations 7 and 9, including the `assets/` directory class research's brief flagged as a possible gap.
- `.opencode/plugins/README.md`'s "Both plugins support" wording mismatch — confirmed as a real but minor (P3-equivalent) inconsistency, subordinate to P1-003, not filed separately.

### Sources Reviewed (representative, not exhaustive — see individual iteration files for full lists)

`.opencode/plugins/mk-goal.js`, `.opencode/commands/goal_opencode.md`, `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md`, `.opencode/skills/system-spec-kit/references/hooks/goal_plugin.md`, `.opencode/plugins/README.md`, `README.md`, `.opencode/skills/system-skill-advisor/README.md`, `.opencode/skills/system-skill-advisor/feature_catalog/07--hooks-and-plugin/goal-opencode-plugin.md`, `.opencode/skills/system-spec-kit/manual_testing_playbook/18--ux-hooks/goal-opencode-plugin.md`, `.opencode/skills/system-skill-advisor/manual_testing_playbook/02--cli-hooks-and-plugin/goal-opencode-plugin.md`, `.opencode/skills/system-spec-kit/constitutional/goal-prompting-runtime-specific.md`, `.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/README.md`, `.opencode/skills/system-spec-kit/ARCHITECTURE.md`, `.opencode/plugins/tests/mk-goal-tool-path.test.cjs`, phase 009/011/003 packet docs, `review_archive/2026-07-01-plugin-implementation-review/README.md`, and the companion `research/research.md` packet.

**Iteration artifacts:** `review/iterations/iteration-{001..010}.md`, `review/deltas/iter-{001..010}.jsonl`, `review/deep-review-state.jsonl`, `review/deep-review-findings-registry.json`, `review/deep-review-dashboard.md`, `review/deep-review-strategy.md`.

**Orchestration note (non-finding, for maintainers of this deep-review runtime, not a finding about the reviewed docs):** the shared `reduce-state.cjs` reducer's fallback deduplication (used when a finding's `findingDetails` entry lacks a `contentHash`) appears to conflate two distinct P2 findings emitted in the same batch under coincidentally-adjacent conditions (iteration 4's `P2-001` and iteration 5's finding, after ID-collision remediation renamed to `P2-002`, were merged into a single `repeatedFindings` entry under the `P2-001` id/title on every reducer run). This review report's Active Finding Registry (§3) was reconciled directly from the raw per-iteration JSONL records rather than the auto-generated registry to avoid propagating this artifact into the final findings; both P2-001 and P2-002 are genuine, distinct, independently-evidenced findings.

---

**STATUS=OK PATH=.opencode/specs/deep-loops/032-goal-opencode-plugin**
