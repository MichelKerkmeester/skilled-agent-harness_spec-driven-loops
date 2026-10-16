# Deep Review Report, v4.0.0.12 doctor-command routing

Packet: `specs/system-skill-advisor/035-doctor-command-routing`
Lineage: `deepseek-max` (executor `cli-pi model=deepseek-v4.1-flash`, fan-out, stopPolicy=max-iterations, maxIterations=5)
Session: `fanout-deepseek-max-1792125949812-grdnrc` | Generated: 2026-10-16T05:13Z
Review target: the shipped work of the v4.0.0.12 release, per `review/lineages/deepseek-max/steer.md`

---

## 1. Executive Summary

- **Overall verdict: PASS**
- **hasAdvisories: true** (2 active P2 findings; no P0, no P1)
- **Counts (active):** P0 = 0, P1 = 0, P2 = 2
- **Review scope:** five iterations covering the five scope groups in `steer.md`: advisor code
  correctness (iteration 1), command and five runtime mirrors (iteration 2), skill docs and
  playbook capability (iteration 3), cross-repo references and root README (iteration 4),
  changelogs and a final cross-check of every carried finding (iteration 5).
- **Method:** read-only review. No test runner was used (per steer); runtime behavior was
  verified by the repository's own read-only validators, by executing the release's own manual
  playbook scenarios verbatim, and by driving the built runtime (`dist/`) from read-only probes
  under the pinned force-local regime. Reducer-owned artifacts were written only inside the
  lineage directory.
- **Notable strengths:** generated artifacts are drift-free; all 82 admitted doctor phrases
  reach their bridges; all 40 routing-slice rows keep their expected top pick; six of seven new
  playbook scenarios and all five `/doctor:setup` legs pass as written; the `advisor_status`
  workspace-root repair is real (exit 64 → `status: ok`); every mirror and catalog check is
  in sync.
- **Carried advisories:** one command-surface diagnostic wart (R2-P2-001) and one cross-repo
  documentation omission (R4-P2-001). Neither blocks release.

---

## 2. Planning Trigger

`/speckit:plan` is **not required**: the verdict is PASS and both active findings are P2
advisories. The two advisories may be folded into the next maintenance packet or fixed in place.

```json
{
  "triggered": false,
  "verdict": "PASS",
  "hasAdvisories": true,
  "activeFindings": [
    {"id": "R2-P2-001", "severity": "P2", "title": "Umbrella sk-git leg reports a permanent FAIL on runtimes it cannot identify, and the named repair cannot clear it", "file": ".skilled/commands/doctor/assets/doctor-setup.yaml:53", "dimension": "correctness"},
    {"id": "R4-P2-001", "severity": "P2", "title": "Fleet-wide DOC-number registry omits the new DOC-385..DOC-391 scenarios and /doctor:setup", "file": ".skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/README.md:26", "dimension": "traceability"}
  ],
  "remediationWorkstreams": [
    {"id": "WS-1", "priority": "advisory", "summary": "Pass --tool=<runtime> from the /doctor:setup sk-git leg or render UNKNOWN for exit 3", "findings": ["R2-P2-001"]},
    {"id": "WS-2", "priority": "advisory", "summary": "Register DOC-385..DOC-391 and /doctor:setup in the spec-kit doctor-readme number registry", "findings": ["R4-P2-001"]}
  ],
  "specSeed": [
    "Umbrella diagnostic leg semantics: distinguish a check that failed from a check the runtime could not attribute",
    "Shared DOC-number registry maintenance rule: a new doctor scenario updates the registry in the same change"
  ],
  "planSeed": [
    "Update doctor-setup.yaml leg 2 to pass the invoking runtime with --tool, or extend the presentation contract with an UNKNOWN result and map battery exit 3 to it",
    "Extend the system-spec-kit doctor-commands README entry for /doctor:skill-advisor to include /doctor:setup and DOC-385 to DOC-391"
  ],
  "findingClasses": ["instance-only", "instance-only"],
  "affectedSurfacesSeed": [
    "umbrella leg command in doctor-setup.yaml",
    "presentation leg-result vocabulary",
    "v2.8.0.0 changelog wording",
    "system-spec-kit doctor-commands README",
    "advisor playbook DOC range"
  ],
  "fixCompletenessRequired": false
}
```

---

## 3. Active Finding Registry

### R2-P2-001 — Umbrella sk-git leg reports a permanent FAIL on runtimes it cannot identify, and the named repair cannot clear it

- Severity: **P2** (advisory) | Dimension: correctness | Disposition: active
- File: `.skilled/commands/doctor/assets/doctor-setup.yaml:53`
- Evidence: the umbrella runs `git-setup-check.cjs` bare; the battery's `ai-tool-hooks` check
  detects only `CLAUDECODE` (`git-setup-check.cjs:867-870`) and returns UNKNOWN with exit 3
  (`:27-28`, `:931-936`) under any other runtime; the umbrella reads "Exit 0 passes. Any other
  exit fails" (`doctor-setup.yaml:53`). Observed: bare run `STATUS=DEGRADED` exit 3;
  `CLAUDECODE=1` run `STATUS=OK` exit 0. DOC-391:65 records the mapping as deliberate
  ("any other exit is FAIL, including a sk-git exit 3").
- Impact: on OpenCode, Pi, Codex, Cursor and Devin a healthy install shows a failing sk-git leg
  and the named repair cannot clear it on the next umbrella run.
- Recommendation: pass `--tool=<runtime>` the way the `/doctor:git setup` route does
  (`_routes.yaml:285`), or add a fourth UNKNOWN/SKIP result to the presentation contract.
- findingClass: instance-only | scopeProof: two callers of the battery exist; only the umbrella
  omits `--tool` | affectedSurfaceHints: umbrella leg, presentation vocabulary, changelog wording.

### R4-P2-001 — Fleet-wide DOC-number registry omits the new DOC-385..DOC-391 scenarios and `/doctor:setup`

- Severity: **P2** (advisory) | Dimension: traceability | Disposition: active
- File: `.skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/README.md:26`
- Evidence: the registry file has 0 mentions of DOC-385..391 or `/doctor:setup` while the
  advisor playbook ships all seven scenarios; four sibling doctor READMEs (sk-git,
  mcp-code-mode, system-deep-loop, sk-code) name this file as the shared number registry; the
  peer registry in the same skill (feature-catalog `category-overview.md`) was updated.
- Impact: a maintainer allocating the next DOC number can reuse 385 and collide with a shipped
  scenario; readers lose the pointer from the doctor surface registry to the `/doctor:setup`
  scenarios.
- Recommendation: extend the `/doctor:skill-advisor` entry to name `/doctor:setup` and
  DOC-385 to DOC-391, as DOC-382/383 were added earlier.
- findingClass: instance-only | scopeProof: `rg` over all doctor-commands READMEs shows no
  registry entry anywhere | affectedSurfaceHints: spec-kit registry, advisor playbook range,
  category-overview peer map.

---

## 4. Remediation Workstreams

- **P0:** none.
- **P1:** none.
- **P2 advisories (optional):**
  1. WS-1, umbrella leg attribution (R2-P2-001): one-line YAML change plus presentation wording,
     or accept the documented behavior and close as won't-fix.
  2. WS-2, DOC registry (R4-P2-001): one sentence in the registry README.
- No remediation is required before release; both are maintenance-grade.

---

## 5. Spec Seed

- Doctor leg result vocabulary should state whether an unattributable check (UNKNOWN) is
  reported as SKIP or FAIL, and why, so the umbrella and the standalone `/doctor:git setup`
  agree on what a healthy install prints.
- The shared DOC-number convention should carry an explicit "registry update in the same change"
  duty for any new doctor scenario.

---

## 6. Plan Seed

- T1: edit `doctor-setup.yaml` leg 2 (or the workflow's field handling) to pass the invoking
  runtime via `--tool`, or extend `doctor-setup-presentation.txt` with an UNKNOWN result row and
  map battery exit 3 to it; update DOC-391's expected-signals wording accordingly.
- T2: extend `.skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/README.md`
  line 26 to `/doctor:skill-advisor` and `/doctor:setup` (DOC-348, DOC-362 to DOC-367, DOC-385 to
  DOC-391).
- T3 (optional): refresh the root README's "21 underlying YAML workflows" count (see Deferred Items).

---

## 7. Traceability Status

Core protocols:

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | pass | REQ-005/006/007/009/010/011/012/014/016 each evidenced at implementation sites across iterations 1-5 (fusion anchor/order, render lookup/hint, route manifest, reach probe, mirrors, playbook, catalog, README) |
| `checklist_evidence` | pass | `tasks.md` rows name real artifacts; six recorded counters independently reproduced (route-validate 14 routes/2 warnings; reach probe 82 phrases/15 bridges; compatibility counts 20/30/16/43; 185 mirrors; lost-0 per-prompt runs) |

Overlay protocols:

| Protocol | Status | Evidence |
|----------|--------|----------|
| `skill_agent` | pass | router `skill_agent` tags match generated bridge owners for all 16 doctor bridges; route-validate parity checks pass |
| `agent_cross_runtime` | pass | canonical `setup.md` reaches all five mirrors (2 symlinks, 3 generated pointers); 185 mirrors + 37 prompts per runtime in sync |
| `feature_catalog_code` | pass | new catalog leaf maps to verified code sites; index 43→44 / scorer-fusion 6→7 consistent; catalog validator 0 violations |
| `playbook_capability` | pass | DOC-385..390 executed verbatim and matched; DOC-391's five legs executed; package validator 61 scenarios / 0 violations |

`AC_COVERAGE`: **exempt** — the packet has no `checklist.md`, so the lifecycle predicate for the
advisory acceptance-coverage signal is not active.

---

## 8. Deferred Items

- Root `README.md:1283` says "The 21 underlying YAML workflows in `.skilled/commands/doctor/assets/`";
  the directory holds 24 files (23 non-manifest). Pre-existing debt in the reviewed section,
  worsened by one file this release added. Optional refresh.
- `.skilled/changelog/skilled/README.md` still describes `v4.0.0.4.md` as the untagged current
  entry; eight releases, including this one, did not update the folder index. Folder-level debt.
- Pre-existing Human Voice hard blockers on four large touched docs
  (`skill-advisor-hook.md` 28, `SKILL.md` 30, root playbook 9, `claude-hook.md` 2); blocker
  counts are identical before and after the release, so no regression, but the debt remains.
- `spec.md:171` risk row still reads that the Pi deadline outage line "carries no hint on either
  runtime", contradicted by the shipped hint on that path; the sentence predates the commit that
  added the hint. Packet doc outside the declared review target; noted for the packet owner.

---

## Dimension Expansion Map

- Dimensions completed: correctness (1, 2), standards conformance / maintainability (2, 3, 4),
  traceability (3, 4, 5). Security was secondary per steer and produced no finding.
- Saturated directions: generated-artifact drift (fresh under `--check`), mirror parity (four
  independent checks in sync), slice ordering (40/40), playbook executability (6/7 executed),
  changelog accuracy (3/3 pass and verified).
- Failed pivots: none; no direction needed an early exit or produced contradictory evidence.
- Remaining frontier: none — all five steer scope groups have at least one full pass, and the
  final iteration re-verified every carried finding.
- Audited overrides: none.

## Search Ledger

- `searchCoverage`: the review's search surface was lexical over the declared targets and their
  traceability surfaces; no semantic or graph retrieval (unavailable by design in this runtime,
  recorded as `graphless_fallback`).
- `searchDebt`: none — every scope group was covered by at least one iteration, and no required
  bug class was deferred or blocked.
- `ruledOutCandidates` (per iteration): doctor bridge out-ranking a passing skill; companion-line
  truncation; unmapped-id leakage; generated projection drift; mirror drift; umbrella writing to
  the tree; wrong/duplicated leg set; playbook scenario unrunnability; inventory count drift;
  catalog leaf describing absent behavior; nonexistent doctor command; wrong-playbook pointer;
  changelog overstatement; target movement during review.
- `cleanSearchProof`: each rule-out carries an observed artifact (validator exit status, probe
  output, or direct file read), recorded in `evidence/` and the iteration narratives.
- No v2 review-depth fields were emitted (legacy v1 records).

---

## Audit Appendix

**Convergence summary.** Five of five iterations ran under `stopPolicy=max-iterations`;
severity-weighted new-finding ratios were 0.0, 1.0, 0.0, 1.0, 0.0. Both non-zero iterations
opened a first-pass dimension with a single P2. Convergence telemetry was never used to stop
early; the run reached the cap by design.

**Coverage summary.** 40 released files reviewed across the five groups (advisor code,
command plus mirrors, skill docs, cross-repo references, changelogs). All four review
dimensions have coverage; security was scoped secondary and reported nothing.

**Ruled-out claims (consolidated).** No P0/P1-class behavior was found: generated artifacts are
drift-free; every admitted phrase reaches its bridge; ordering keeps a passing skill first;
hints fire only on setup wording and hold on the outage path; the five mirrors and both
catalogs are in sync; every new playbook scenario that could be executed passed exactly; the
three changelogs match observed behavior and validators.

**Sources reviewed.** `steer.md`; the 40-file release diff between `1996cf02a6~1` and `HEAD`;
the release's own validators (`derive-command-bridges.cjs --check`, `doctor-phrase-reach.cjs`,
`route-validate.sh`, `sync-runtime-mirrors.cjs --check`, codex/pi/hermes prompt syncs,
`command-catalog-mirror-check.cjs`, `validate-playbook-package.cjs`, `validate_catalog_package.py`,
`validate_document.py`, `hvr_scan.py`); the built runtime driven read-only under the pinned
force-local regime; the release playbooks' own commands; `tasks.md` evidence rows.

**Cross-reference appendix — Core Protocols.** `spec_code`: pass. `checklist_evidence`: pass.

**Cross-reference appendix — Overlay Protocols.** `skill_agent`: pass.
`agent_cross_runtime`: pass. `feature_catalog_code`: pass. `playbook_capability`: pass.

**Lineage artifacts.** `deep-review-config.json`, `deep-review-state.jsonl` (5 iteration
records + terminal synthesis record), `deep-review-findings-registry.json` (2 active P2,
0 resolved), `deep-review-strategy.md`, `deep-review-dashboard.md`, `resource-map.md`,
`iterations/iteration-001..005.md`, `deltas/iter-001..005.jsonl`, `evidence/` (validator and
probe outputs). Completeness: review-report.md (this file), review/iterations dir: 5 files;
review/deltas dir: 5 files.
