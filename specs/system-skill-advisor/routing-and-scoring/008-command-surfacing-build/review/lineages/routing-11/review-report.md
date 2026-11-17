# Review Report - routing-11

Review of the sk-doc routing area for command-surfacing pass eleven, lineage `routing-11`.

- Review target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build`
- Review scope: `.skilled/skills/sk-doc/ROUTER.md`, `.skilled/skills/sk-doc/graph-metadata.json`, `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json`
- Diff range: `6d50afe6f39..2f3f893c153`
- Session: `fanout-routing-11-1794851543294-mlt3r6`, generation 1, lineage mode `new`
- Iterations: 3 of 8; stop reason `converged` (`all_dimensions_clean`)

## 1. Executive Summary

- Overall verdict: **PASS**
- hasAdvisories: **true**
- P0/P1/P2 counts: **0 / 0 / 5**, the counts the verdict used
- Review scope summary: three changed files covering phase 039's narrowing of the README intents main added to sk-doc. The `git-*` and `spec-gate` named hook phrases, the `hook mirror readme` phrase and the bare `security policy` phrase were dropped; `security.md` was kept; the router prose says why; the generated intent signals and the compiled skill graph were regenerated.
- Operator review focus: Review pass eleven. First read specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/review-brief-11.txt and follow it: it names your area by lineage label, the scope file, the graph and stop steps each iteration runs, and the holdout rule.
- Self-check outcomes: no P0 or P1 existed, so the adversarial self-check had nothing to adjudicate; the five P2 advisories were re-verified in iteration 3.

What holds:

- Every named README request in the phase probe still tops sk-doc: the session-handover hook, git-preflight hook, spec-gate hook, runtime folder, plugins folder and `SECURITY.md`.
- Bare `git hooks`, `git rules`, `git standards` reach sk-git, and `runtime mirror drift` reaches `command-doctor-runtime-mirrors`.
- `generate-router-intent-signals.cjs --check --hub sk-doc` prints `RESULT: PASSED` (exit 0), and `skill-graph-freshness.cjs --strict` exits 0 with no signal drift, ghost or missing node.
- The compiled `skill-graph.json` signal arrays equal their on-disk `graph-metadata.json` sources for all 14 hubs, and `.signals["sk-doc"]` equals the regenerated `intent_signals` exactly.

What the advisories qualify:

- The phase probe proves the hub top, not the template. A README request for the git-preflight hook or for a hook mirror folder now loads the generic README template rather than the hook or runtime-plugin template.
- One retained named hook phrase (`skill-advisor`) ties the skill README and hook README intents, so two templates load.
- More than `git` and `gate` survives: `hooks` remains via `codex-global-hooks-check`, and the other named hooks still seed env/secret, session/handover, decision/capture and dispatch/subagent tokens into sk-doc's lexical lane.
- The 039 spec's Files to Change table still lists `sk-create-readme/ROUTER.md`, but the delivered phase deliberately left it untouched.
- The generator's carry rule and its `--check` gate share a blind spot for dotted phrases, so a change that relies on `security.md` or `sync.md` alone cannot be verified by the gate.

## 2. Planning Trigger

`/speckit:plan` is **not required** for this verdict. The review is PASS with five advisory P2s; no P0 or P1 blocks merge. The advisories can be scheduled as a small follow-up packet.

```json
{
  "triggered": false,
  "verdict": "PASS",
  "hasAdvisories": true,
  "activeFindings": {
    "P0": 0,
    "P1": 0,
    "P2": 5
  },
  "remediationWorkstreams": [
    {
      "id": "AW-1",
      "severity": "P2",
      "title": "Leaf-selection accuracy for the dropped phrase families",
      "findings": ["F001", "F002"]
    },
    {
      "id": "AW-2",
      "severity": "P2",
      "title": "Phase bookkeeping for the packet router row",
      "findings": ["F003"]
    },
    {
      "id": "AW-3",
      "severity": "P2",
      "title": "Vocabulary footprint and generation-gate coverage",
      "findings": ["F004", "F005"]
    }
  ],
  "specSeed": [
    "Correct or remove the 039 Files to Change row for sk-create-readme/ROUTER.md, with the reason tasks.md already records.",
    "State whether a README request for a dropped named hook or a hook mirror folder intentionally falls back to the generic README template.",
    "Reword the hooks rationale to the words actually removed, or remove the remaining cross-domain hook names."
  ],
  "planSeed": [
    "Add a leaf-level probe for the git-preflight and hook-mirror README requests to the phase evidence.",
    "Teach generate-router-intent-signals.cjs to carry dotted filename phrases, or add a gate case for an intent with zero carryable phrases.",
    "Decide whether the skill-advisor named hook phrase stays, given its tie with the skill README intent."
  ],
  "findingClasses": [
    "matrix/evidence",
    "instance-only",
    "class-of-bug"
  ],
  "affectedSurfacesSeed": [
    ".skilled/skills/sk-doc/ROUTER.md",
    ".skilled/skills/sk-doc/graph-metadata.json",
    ".skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json",
    ".skilled/skills/sk-doc/sk-create-skill/scripts/generate-router-intent-signals.cjs",
    "specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/039-main-sk-doc-routing-repair/spec.md"
  ],
  "fixCompletenessRequired": false
}
```

## 3. Active Finding Registry

| ID | Severity | Dimension | Title | File:line | Disposition |
|----|----------|-----------|-------|-----------|-------------|
| F001 | P2 | traceability | The accepted probe proves hub reach only, while two dropped phrase families now load the generic README leaves | `.skilled/skills/sk-doc/ROUTER.md:136` | active |
| F002 | P2 | correctness | The named skill-advisor hook phrase ties the skill README and hook README intents | `.skilled/skills/sk-doc/ROUTER.md:219` | active |
| F003 | P2 | traceability | The 039 spec still lists `sk-create-readme/ROUTER.md` as a file to change, but the delivered work deliberately left it untouched | `039-main-sk-doc-routing-repair/spec.md:105` | active |
| F004 | P2 | security | The narrowing removes the git and gate words but leaves the same cross-hub token class from the other named hooks | `.skilled/skills/sk-doc/ROUTER.md:219` | active |
| F005 | P2 | maintainability | The generator's carry rule and its `--check` gate share a blind spot for dotted phrases | `.skilled/skills/sk-doc/sk-create-skill/scripts/generate-router-intent-signals.cjs:57` | active |

### F001 - Leaf-level fallback for the dropped phrase families

- Evidence: `readme-probes.txt:3` proves the git-preflight README request tops sk-doc. Stage two scores only `README_CREATION=12`, so `hook-readme-template.md` does not load. `write a hook mirror readme` scores `README_CREATION=4` only and does not load `runtime-plugin-readme-template.md`.
- Impact: the author reaches sk-doc but starts from the generic README template.
- Fix: extend the phase probe to assert the leaf pair, or state the generic fallback as intended.

### F002 - skill-advisor named hook phrase ties two intents

- Evidence: `readme for the skill-advisor hook` contains `readme for the skill` (`ROUTER.md:215`), so `SKILL_README=16` and `HOOK_README=16`; both leaf sets load.
- Impact: two templates load where one artifact is requested, costing tokens and steering the wrong template.
- Fix: drop the named phrase, or require a boundary that excludes a hyphenated name after `skill`.

### F003 - Spec table disagrees with the delivered files

- Evidence: `spec.md:105` lists `.skilled/skills/sk-doc/sk-create-readme/ROUTER.md` as Modify; `tasks.md:46` records it left as is; `implementation-summary.md:57-63` omits it; the commit does not touch it.
- Impact: the phase's scope record overstates what changed; no runtime caller is affected because the hub router gates entry.
- Fix: remove the row with the recorded reason, or make the change.

### F004 - Residual cross-hub token class

- Evidence: the committed signal bag loses `git` and `gate` but keeps `hooks` via `codex-global-hooks-check` (`graph-metadata.json:358-359`); the retained names also inject `env`, `secret`, `session`, `handover`, `decision`, `capture`, `dispatch`, `subagent`, `advisor`, `freshness`, `overlay`, `completion` and `quality`. The probe still routes `git hooks` to sk-git.
- Impact: latent lexical ambiguity; the lexical lane's weight is 0.28 and no probe shows a present misroute.
- Fix: reword the prose and either drop the remaining cross-domain names or restrict them to the full README phrase.

### F005 - Dotted-phrase gate blind spot

- Evidence: `generate-router-intent-signals.cjs:57` keeps only phrases containing a space; `security.md` and `sync.md` are outside the carried set, and `--check` reports `missing=0` while `SECURITY_POLICY` declares `security.md` as its only keyword.
- Impact: a future edit can rely on a dotted phrase and pass the gate while the advisor vocabulary lacks the intent. Reach currently holds through other lanes (probe line 7).
- Fix: carry dotted filename phrases, or flag an intent with zero carryable phrases.

## 4. Remediation Workstreams

### P0 Workstreams

None.

### P1 Workstreams

None.

### P2 Advisories

1. **AW-1 - Leaf-selection accuracy (F001, F002).** Update the phase probe to assert the leaf pair for the git-preflight and hook-mirror requests, and decide the skill-advisor tie. No production behavior change is needed for the hub-top requirement.
2. **AW-2 - Phase bookkeeping (F003).** Reconcile the 039 Files to Change table with the task record. This is a spec-doc edit, not a code edit.
3. **AW-3 - Vocabulary footprint and gate coverage (F004, F005).** Reword the hooks rationale and extend the signal generator or its gate to cover dotted phrases. Both are follow-ups that keep the current routing behavior.

## 5. Spec Seed

- The 039 packet should say plainly that the git-* and spec-gate hook README requests reach sk-doc through the generic README intent, not the hook template, if that is the accepted trade.
- The purpose sentence "README requests keep reaching their templates" should be scoped to the hub top, or the acceptance evidence should gain a leaf-level row.
- The `sk-create-readme/ROUTER.md` row should be removed from the Files to Change table or the file should be changed; the current task note is a valid reason to do the former.
- The generator contract should state which dotted filenames are carried and which are not, or the writer should carry them.

## 6. Plan Seed

- T1: Add `git-preflight` and `hook mirror` README probes to the routing playbook, asserting the `HOOK_README` and `RUNTIME_PLUGIN_README` leaf pairs.
- T2: Decide the skill-advisor named phrase: keep it and bound the `skill` keyword, or rely on the generic hook phrases.
- T3: Extend `generate-router-intent-signals.cjs` to carry filename-shaped tokens, with a unit case for `security.md` and `sync.md`.
- T4: Reword `ROUTER.md:136-137` to "git and gate" only, or name the remaining cross-domain hook words explicitly.
- T5: Reconcile the 039 Files to Change table with `tasks.md:46`.

## 7. Traceability Status

| Protocol | Level | Status | Evidence | Drift |
|----------|-------|--------|----------|-------|
| `spec_code` | core | pass | `ROUTER.md:218-220`; 039 `spec.md:100-111` | F003 only |
| `checklist_evidence` | core | notApplicable | 039 `acceptance-criteria.md:56-58` | none |
| `skill_agent` | overlay | pass | `ROUTER.md:1-14` | none |
| `agent_cross_runtime` | overlay | notApplicable | no agent file in the diff | none |
| `feature_catalog_code` | overlay | partial | `generate-router-intent-signals.cjs:124-195`; `skill-graph.json:1` | F005 |
| `playbook_capability` | overlay | partial | `readme-probes.txt:2-11` | no playbook run |

`AC_COVERAGE`: exempt for this review target. The review target is the phase parent; the reviewed child packet `039-main-sk-doc-routing-repair` carries its own acceptance rows, all `Met` (`acceptance-criteria.md:56-58`), and the advisory rule does not change the verdict.

## 8. Deferred Items

- A routing playbook scenario run for the dropped-phrase leaf behavior.
- A decision on whether the remaining cross-domain named hook phrases should be narrowed the same way as the git-* set.
- A changelog row for the router version bump, if the repository later adopts per-router changelogs; the current convention is skill-level only.

## Dimension Expansion Map

- Completed pivots: 0; failed pivots: 0; audited overrides: 0.
- Swept: correctness of stage-two scoring (iteration 1), security and maintainability of the token footprint (iteration 2).
- Selected directions: exact phrase-set parity, the packet probe, the documented stage-two scorer, and the scorer's token rule.
- Remaining frontier: none. All four dimensions are covered and all six traceability protocols have a final status.
- This map records breadth only; it does not alter the verdict or the finding registry.

## 9. Search Ledger

*No search-depth state captured (legacy v1 record).*

The analysis performed: three iterations over three changed files; exact set comparisons across 381 declared phrases and 345 committed signals; a 14-hub signal parity check; a token intersection across the 13 other hubs; the committed advisor probe file; and the generator's carry filter. Holdout corpora were not opened; the holdout gate was read by count only.

## 10. Audit Appendix

### Convergence Summary

- Stop reason: `converged`, decision `STOP`, detail `all_dimensions_clean`.
- Iteration ratios: 1.0, 0.4, 0.0; threshold 0.10.
- Gates: convergence, dimension coverage, P0 resolution, evidence density, hotspot saturation, claim adjudication, fix-completeness replay, candidate coverage and graphless fallback all passed at the stop.
- Graph at the stop: 29 nodes and 93 edges from the seed and three iteration upserts; no rejected edge or self-loop.

### Coverage Summary

- Dimensions: correctness, security, traceability, maintainability - all covered.
- Protocols: `spec_code` pass, `checklist_evidence` notApplicable, `skill_agent` pass, `agent_cross_runtime` notApplicable, `feature_catalog_code` partial, `playbook_capability` partial.
- Files reviewed: the three changed files, the generator and replay scripts, the scorer's text/lexical/lane files, and the 039 packet's spec, acceptance criteria, tasks, implementation summary and probe file.

### Ruled-Out Claims

- Stale compiled graph: `skill-graph-freshness.cjs --strict` exits 0 with no signal drift.
- Orphaned generated phrases: `--check` reports `orphans=0`.
- Broken SECURITY.md reach: the packet probe tops sk-doc.
- Missing router changelog: the router version is file-local; the changelog is skill-level.
- Present misroute from residual cross-hub tokens: no probe shows sk-doc beating the owning hub; the lexical lane carries 0.28.

### Sources Reviewed

- `.skilled/skills/sk-doc/ROUTER.md`
- `.skilled/skills/sk-doc/graph-metadata.json`
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json`
- `.skilled/skills/sk-doc/sk-create-skill/scripts/generate-router-intent-signals.cjs`
- `.skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/text.ts`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/lexical.ts`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lane-registry.ts`
- `039-main-sk-doc-routing-repair/spec.md`
- `039-main-sk-doc-routing-repair/acceptance-criteria.md`
- `039-main-sk-doc-routing-repair/tasks.md`
- `039-main-sk-doc-routing-repair/implementation-summary.md`
- `039-main-sk-doc-routing-repair/scratch/readme-probes.txt`
- `.skilled/skills/sk-doc/sk-create-readme/ROUTER.md` (context only)

### Closeout

- Verdict: PASS; hasAdvisories: true; release readiness: converged.
- No P0 or P1 is active; no required quality gate is failing.
- The advisory list is the five P2 findings above; none changes the release decision.
