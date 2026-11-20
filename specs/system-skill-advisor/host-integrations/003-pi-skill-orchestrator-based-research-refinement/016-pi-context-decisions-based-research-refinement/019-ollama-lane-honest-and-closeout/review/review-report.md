# Deep Review Report: phase 019 work and its follow-ups

## 1. Executive Summary

- **Verdict:** CONDITIONAL
- **hasAdvisories:** false
- **Counts the verdict used:** P0 0, P1 7, P2 25, search debt 2. These are the merged lineage counts, which are the authority on a fan-out root.
- **Run:** expansive depth, three `cli-mistral-vibe` lineages on `deepseek-flash`, 16-iteration cap each. vibe-1 ran 5 iterations, vibe-2 ran 8 and vibe-3 ran 10, 23 in all. Each lineage stopped on convergence. All four canonical dimensions are covered.
- **Scope:** the commits named in the operator focus, read at HEAD, across six seeded areas: vector refresh lifecycle (F-1-001), semantic lane honesty (F-1-002), daemon and launcher liveness (F-1-003), status and doctor surfaces (F-1-004), claims against code (F-1-005), and follow-up fixes with answer routing (F-1-006).
- **Operator review focus:** Review only what these commits changed, read at HEAD with git show: 31ffd18beab, 1ccbb3283c6 and dc3979eb451 (background vector refresh, semantic lane coverage gate, launcher liveness, OLLAMA_* passthrough, generation counter, status and doctor coverage); 86038dfba80, c74042fd559, 571575632a4, 5c91b2f3f5d and 0390556ee2b (test and routing follow-ups); and the ten docs(specs) commits 2f5fe41bb9e to aaaff7dd9df that wrote 231 ended-session answers into decision-record.md files. Report defects in shipped behavior, not style. P0 is wrong routing, a crash, lost data, or a doc claim that misleads an operator. A test change that matches new text while leaving the behavior unchecked is a finding. Owning packet: specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/019-ollama-lane-honest-and-closeout.

### Self-check outcomes

The orchestrator re-read every P1 at its `file:line`. The merged counts above stay the authority; these calls are recorded for planning.

| Finding | Call | Basis |
|---|---|---|
| R1-P1-001--228f85b91749, R1-P1-001--41dbe685051c, R1-P1-002 | P1, duplicates of one defect | `semantic-shadow.ts:392` calls `embeddingCoverage()` with no handle, which falls back to `getDb()` at `skill-graph-db.ts:1326` and opens the database read-write. Reached only when the lane weight is above 0: at weight 0 the prompt vector is null and the lane returns at `semantic-shadow.ts:357` first |
| R2-P1-001 | P1 confirmed | `advisor-status.ts:242` computes `laneEnabled` without `coverageComplete`, and the `disabledReason` chain at `:212-223` has no incomplete-coverage branch, so status reports the lane enabled while the gate refuses to score. Reached only above weight 0 |
| R1-P1-001--f584df41ace3 | P1 confirmed | `refreshEmbeddingsInBackground` at `skill-graph-db.ts:1442-1444` returns the running refresh to a second caller and schedules no follow-up pass, so rows a mid-refresh reindex adds can stay unembedded until the next reindex or restart. It fails safe, since the gate then disables the lane, but it breaks REQ-011's full-coverage promise |
| R9-P1-001 | Downgraded to P2 | `v4.1.0.0.md:222` sits in the phase 018 section and reports that phase's earlier measurement, which was true when it shipped. Both figures support weight 0. The fix is a clarifying sentence |
| R6-P1-001 | Downgraded to P2 | The `581` in the summary's frontmatter description is not reconciled with the body's own breakdown (232 entries from 228 answers, 246 and 35 consumed rows). It is a packet-record wording defect, not shipped behavior |

After the self-check, four distinct P1 defects remain: two latent ones that bite once the lane is turned back on, one race in the refresh, and none at the shipped default weight of 0.

## 2. Planning Trigger

`/speckit:plan` is required for the three confirmed P1 defects.

```json
{
  "label": "Planning Packet",
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": [
    {"id": "R1-P1-001--228f85b91749", "severity": "P1", "file": ".skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts", "line": 392, "duplicates": ["R1-P1-001--41dbe685051c", "R1-P1-002"]},
    {"id": "R2-P1-001", "severity": "P1", "file": ".skilled/skills/system-skill-advisor/runtime/handlers/advisor-status.ts", "line": 242},
    {"id": "R1-P1-001--f584df41ace3", "severity": "P1", "file": ".skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts", "line": 1442},
    {"id": "R9-P1-001", "severity": "P1", "selfCheck": "P2", "file": ".skilled/changelog/skilled/v4.1.0.0.md", "line": 222},
    {"id": "R6-P1-001", "severity": "P1", "selfCheck": "P2", "file": "specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/019-ollama-lane-honest-and-closeout/implementation-summary.md", "line": 3}
  ],
  "remediationWorkstreams": ["read-only coverage on the recommend path", "status reports the coverage gate", "refresh reruns after a mid-refresh reindex", "doc and packet record corrections"],
  "specSeed": ["The recommend path reads coverage through the read-only handle", "laneEnabled and disabledReason include incomplete coverage", "A refresh request during a running refresh schedules one more pass"],
  "planSeed": ["Pass getDbReadOnly() into embeddingCoverage from the lane and fail closed when it is null", "Add an incomplete_skill_vectors branch to advisor-status and gate laneEnabled on coverageComplete", "Replace the shared-promise single-flight with a pending flag that reruns once"],
  "findingClasses": ["correctness", "lost_update", "traceability"],
  "affectedSurfacesSeed": ["advisor_recommend", "advisor_status", "daemon watcher reindex", "v4.1.0.0 changelog", "019 implementation summary"],
  "fixCompletenessRequired": true
}
```

## 3. Active Finding Registry

### P1

| ID | Title | Dimension | File:line | Fix |
|---|---|---|---|---|
| R1-P1-001--228f85b91749 (+2 duplicates) | The coverage gate opens the daemon-owned database read-write on the recommend path | correctness | `semantic-shadow.ts:392`, `skill-graph-db.ts:1326` | Read coverage through `getDbReadOnly()`; treat a null handle as `database_absent` |
| R2-P1-001 | `advisor_status` reports the lane enabled while its gate refuses to score | correctness | `advisor-status.ts:242` | Gate `laneEnabled` on `coverageComplete` and add an `incomplete_skill_vectors` reason |
| R1-P1-001--f584df41ace3 | The refresh single-flight drops a reindex that lands mid-refresh | correctness | `skill-graph-db.ts:1442` | Record a pending request and run one more pass when the current one ends |
| R9-P1-001 (self-check P2) | The changelog's default-weight rationale quotes the earlier 149/193 ablation | traceability | `v4.1.0.0.md:222` | Name it as the earlier measurement and point to the 156/161 result |
| R6-P1-001 (self-check P2) | The summary's description claims 581 recorded answers | traceability | `implementation-summary.md:3` | State the counts the body gives |

### P2

| ID | Title | File:line |
|---|---|---|
| R3-P2-002 | `OLLAMA_BASE_URL` is forwarded without a loopback check, so the shared daemon sends the corpus to whatever host the first caller names | `system-skill-advisor-launcher.cjs:185` |
| R5-P2-001--0a985d30127e | The hub-vocabulary fix left "security policy" in the mode's own `ROUTER.md` intent keywords | `sk-create-readme/ROUTER.md:47`, `:107` |
| R4-P2-001--30707159e7ca | The refresh catalog page promises a refresh after every reindex | `background-vector-refresh.md:31` |
| R4-P2-002 | The status catalog page describes `laneEnabled` without the coverage gate | `advisor-status.md:41` |
| R1-P2-002--8fd448f8720a, R1-P2-001--fa5dab572bad | The coverage check re-reads every `SKILL.md`, vector blob and the command-bridges file on each scored prompt | `skill-graph-db.ts:1325`, `:1406` |
| R1-P2-001--4f742bf4275e | `incomplete_skill_vectors` also fires for a missing command vector | `semantic-shadow.ts:405` |
| R1-P2-003 | The exact-subset rerank has no coverage gate | `semantic-shadow.ts:288` |
| R1-P2-002--bf4a6ab01e19 | The fixture-dimension guard is one-directional | `semantic-shadow.ts:352` |
| R3-P2-001--46c2b94b2b5e | The refresh disable switch fails open on any value other than `off` | `skill-graph-db.ts:1445` |
| R1-P2-001--826eaf6a37f7 | The Ollama-unavailable early return reports zero failures | `skill-graph-db.ts:1466` |
| R3-P2-001--4ca5faff404b | The lane logs the adapter's raw error, which carries the base URL | `semantic-shadow.ts:245` |
| R2-P2-001--1786e5d41a98 | No test covers a stale or missing command vector | `advisor-status.vitest.ts:221` |
| R5-P2-002 | The stress test restates the lane weight instead of deriving it | `mcp-diagnostics-stress.vitest.ts:75` |
| R2-P2-001--93fa008ac34b | The widened hook assertion accepts names the hook does not use | `system-skill-advisor.test.cjs:1078` |
| R8-P2-001--9893c31600ad | The hand-over test copies the writer path the module keeps private | `session-handover.test.ts:48` |
| R2-P2-001--c90ad2dafab1 | The changelog says the launcher always sets `SYSTEM_SKILL_ADVISOR_DB_DIR`; it fills it only when unset | `v4.1.0.0.md:229` |
| R2-P2-002, R6-P2-001 | One changelog cites two corpus sizes and two score pairs for the lane | `v4.1.0.0.md:222` |
| R8-P2-001--a471d3e47365 | Two claims recorded as wrong are repeated in the older changelog | `v1.3.0.0.md:26` |
| R4-P2-001--c29a06340492 | The scorer reference defines three of eight `disabledReason` tokens | `advisor-scorer.md:80` |
| R5-P2-001--6f4faef82be3 | AC-005 claims five earlier matching runs; the evidence shows two | `acceptance-criteria.md:60` |
| R7-P2-002 | `incompleteIds` is exported with no consumer and mixes two id spaces | `skill-graph-db.ts:124` |
| R7-P2-001--2142c30a11b7 | The coverage reader re-implements the vector-table read | `skill-graph-db.ts:1325` |
| R7-P2-001--bec5f65eea34 | `DEFAULT_SCORER_LANE_WEIGHTS` holds the resolved live weights, not defaults | `semantic-shadow.ts:156` |

Per-finding evidence, scope proof and surface hints are in each lineage's iteration files under `lineages/*/iterations/`.

## 4. Remediation Workstreams

1. **P1, recommend path:** read coverage through the read-only handle.
2. **P1, status:** report the coverage gate in `laneEnabled` and `disabledReason`, then fix the catalog page.
3. **P1, refresh:** rerun once after a mid-refresh request, then fix the catalog page.
4. **P2, docs and record:** the changelog figures, the `DB_DIR` sentence, the `581` description, AC-005, the reason-token table, and the mode `ROUTER.md` phrase.
5. **P2, hardening:** a loopback check or warning for `OLLAMA_BASE_URL`, strict parsing of the refresh switch, and no base URL in logged errors.

## 5. Spec Seed

- REQ: the recommend path never opens the skill-graph database read-write, including for the coverage check.
- REQ: `advisor_status` reports the lane disabled with `incomplete_skill_vectors` whenever the gate would refuse to score.
- REQ: a refresh request that arrives during a running refresh causes exactly one more pass.

## 6. Plan Seed

- Thread an optional read-only handle through `embeddingCoverage` and pass `getDbReadOnly()` from the lane, with a test that fails if `getDb()` is reached.
- Add the coverage branch to the status reason chain with a stale-vector and a missing-command-vector test.
- Replace the shared-promise guard with a pending flag, with a test that queues a reindex during a slow refresh and asserts the new row is embedded.
- Make the doc and packet corrections in one docs commit, then rerun `validate.sh --strict` on 019.

## 7. Traceability Status

- **spec_code (core):** partial. REQ-011 (full, current coverage on a live daemon) is broken by the refresh race. REQ-003 holds on the recommend path. Status does not reflect the gate.
- **checklist_evidence (core):** partial. AC-005 overstates its evidence (R5-P2-001--6f4faef82be3).
- **feature_catalog_code (overlay):** drift on the refresh and status pages.
- **playbook_capability (overlay):** no drift reported.
- **AC_COVERAGE:** advisory. The review did not re-score every acceptance row.

## 8. Deferred Items

- The P2 advisories above that no workstream picks up.
- Frontier areas F-1-001 and F-1-004 stayed open as search debt; see the Search Ledger.

## Dimension Expansion Map

- **Seeded directions:** F-1-001 to F-1-006, dealt two per lineage: vibe-1 took F-1-001 and F-1-004, vibe-2 took F-1-002 and F-1-005, vibe-3 took F-1-003 and F-1-006.
- **Growth:** none. vibe-1 recorded "frontier not drained because this executor may not write the node store", so no depth-2 node was admitted in any lineage and no seed was marked answered.
- **Pivots:** none.

## 9. Search Ledger

- **hasSearchDebt:** true. Debt rows `frontier-F-1-001` and `frontier-F-1-004` are deferred because their nodes are still open. Both areas were reviewed and produced findings, but the Vibe lineage could not close the nodes.
- **Next review step for the debt:** another `/deep:review` over the refresh lifecycle and the status and doctor surfaces on an executor that can write the node store, after the P1 fixes land.
- **Candidate coverage, ruled-out candidates, clean-search proof:** in the merged registry at `deep-review-findings-registry.json`.

## 10. Audit Appendix

- **Convergence:** each lineage stopped on its own convergence check: vibe-1 at a weighted new-finding ratio of 0.08 after 5 iterations, vibe-2 after 8 and vibe-3 after 10. None wrote a `terminal_gates` row, so `fanout-run.cjs` marked all three `failed (exit)` with status `partial`. Each lineage still wrote `synthesis_complete` and its own `review-report.md`.
- **Coverage:** correctness, security, traceability and maintainability are covered in the merged registry. The frontier partition guard passed.
- **Sources reviewed:** listed per iteration under `lineages/*/iterations/`. Attribution is in `fanout-attribution.md`.

### Core Protocols

- spec_code: partial (see section 7).
- checklist_evidence: partial (see section 7).

### Overlay Protocols

- feature_catalog_code: drift on two pages.
- playbook_capability: no drift reported.
- skill_agent, agent_cross_runtime: not applicable to this target.

### Tooling observations for the expansive mode

These are about the deep-review run itself, not the reviewed work:

- The Vibe lineages could not write `frontier-nodes.jsonl`, so expansive depth seeded but never grew or closed a node.
- The lineages stopped on convergence without the `terminal_gates` row the runner requires, so a usable run reads as `failed`.
