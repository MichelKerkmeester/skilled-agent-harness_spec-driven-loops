# Review Report - docs-merge-10

## 1. Executive Summary

**Overall verdict: CONDITIONAL**

`hasAdvisories`: false. Active counts the verdict used: **P0 = 0, P1 = 1, P2 = 4**, read from `deep-review-findings-registry.json` and confirmed by `review-verdict.cjs`.

The pass-ten docs-and-merge lineage reviewed the four docs files this branch changed and the five merge paths it resolved. Every docs claim was checked against HEAD code, and every merge path was diffed in both directions so a dropped branch line could not hide behind a clean main-to-merge diff.

- **What holds:** the README's 46-to-47 command-row change matches `command-bridges.generated.json` (`typescriptActive: 47`); the added `hookHealth` sentence matches `advisor-status.ts:487-509`; the fresh-prompt variable matches the scorer's own default; the release's Vibe, hook-health and command-id claims hold; and the sk-doc, ROUTER, v4.0.2.1 and routing-test merges each kept both sides.
- **What does not:** the doctor-install merge kept main's rewritten asset and the branch's contract test that pins the pre-merge text, so that test fails at HEAD (F001, P1); the merged accepted-runtime sentence says "nine" for an eight-runtime manifest (F002); both advisor runtime lists omit Vibe (F003); the no-edit release bullet claims more than the gate does (F004); and the changelog's suffix list is narrower than the parser (F005).
- **Self-check:** the Referee re-read F001 against both merge parents and the HEAD asset and confirmed **P1, not P2**; the claim-adjudication row was recorded through the gateway. No P0 was raised, so no Hunter/Skeptic/Referee replay was required at P0 severity.
- **Scope:** nine files, five iterations, all four dimensions covered. Security produced no finding because the diff is prose, a template and a test; that is a clean result, not skipped coverage.

Operator review focus (verbatim): Review pass ten. First read specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/review-brief-10.txt and follow it: it names your area by lineage label, the scope file, the graph and stop steps each iteration runs, and the holdout rule.

## 2. Planning Trigger

`/speckit:plan` is required: one active P1 remains.

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": [
    {"id": "F001", "severity": "P1", "title": "The merge left the doctor-install contract test pinning the pre-merge presentation text", "file": ".skilled/commands/doctor/assets/doctor-install-presentation.txt:78", "dimension": "correctness"},
    {"id": "F002", "severity": "P2", "title": "The merged accepted-runtime sentence says nine but lists eight", "file": ".skilled/commands/doctor/assets/doctor-install-presentation.txt:78", "dimension": "correctness"},
    {"id": "F003", "severity": "P2", "title": "Both advisor runtime enumerations omit Vibe", "file": ".skilled/skills/system-skill-advisor/README.md:244", "dimension": "traceability"},
    {"id": "F004", "severity": "P2", "title": "The no-edit release bullet claims more than the gate does", "file": ".skilled/skills/system-skill-advisor/changelog/v1.1.0.0.md:44", "dimension": "traceability"},
    {"id": "F005", "severity": "P2", "title": "The suffix list in the changelog is narrower than the parser", "file": ".skilled/skills/system-skill-advisor/changelog/v1.1.0.0.md:102", "dimension": "correctness"}
  ],
  "remediationWorkstreams": [
    {"id": "W1", "priority": 1, "findingIds": ["F001"], "action": "Update the doctor-install contract test to the merged eight-runtime wording, or restore the branch's wording; then retire or correct the stale DSH line in doctor-install.yaml."},
    {"id": "W2", "priority": 2, "findingIds": ["F002"], "action": "Say eight in the presentation, or name the ninth runtime and add it to the symlink manifest."},
    {"id": "W3", "priority": 3, "findingIds": ["F003"], "action": "Add Vibe to README.md:244 and SKILL.md:205, with the other adapters."},
    {"id": "W4", "priority": 4, "findingIds": ["F004", "F005"], "action": "Widen the no-edit bullet to writing commands and widen the suffix sentence to :unattended and the :with-* family."}
  ],
  "specSeed": ["Decide whether the doctor presentation or the branch test is the source of truth for the accepted-runtime wording.", "Record the eight accepted runtimes in one place and reference it from the presentation and the yaml."],
  "planSeed": ["Update doctor-install-contract.test.cjs:240-241 to the merged sentence and remove the stale DSH assertion.", "Fix the presentation count and the yaml DSH line.", "Add Vibe to both advisor enumerations."],
  "findingClasses": ["merge-resolution-integration", "doc-claim-accuracy", "cross-doc-consistency"],
  "affectedSurfacesSeed": [".skilled/commands/doctor/assets/doctor-install-presentation.txt", ".skilled/commands/doctor/scripts/tests/doctor-install-contract.test.cjs", ".skilled/commands/doctor/assets/doctor-install.yaml", ".skilled/skills/system-skill-advisor/README.md", ".skilled/skills/system-skill-advisor/SKILL.md", ".skilled/skills/system-skill-advisor/changelog/v1.1.0.0.md"],
  "fixCompletenessRequired": true
}
```

## 3. Active Finding Registry

| ID | Severity | Title | Dimension | File:line | Disposition |
|----|----------|-------|-----------|-----------|-------------|
| F001 | P1 | The merge left the doctor-install contract test pinning the pre-merge presentation text | correctness | `.skilled/commands/doctor/assets/doctor-install-presentation.txt:78` | active |
| F002 | P2 | The merged accepted-runtime sentence says nine but lists eight | correctness | `.skilled/commands/doctor/assets/doctor-install-presentation.txt:78` | active |
| F003 | P2 | Both advisor runtime enumerations omit Vibe | traceability | `.skilled/skills/system-skill-advisor/README.md:244` | active |
| F004 | P2 | The no-edit release bullet claims more than the gate does | traceability | `.skilled/skills/system-skill-advisor/changelog/v1.1.0.0.md:44` | active |
| F005 | P2 | The suffix list in the changelog is narrower than the parser | correctness | `.skilled/skills/system-skill-advisor/changelog/v1.1.0.0.md:102` | active |

Finding classes: F001 `merge-resolution-integration`; F002, F004, F005 `doc-claim-accuracy`; F003 `cross-doc-consistency`. Scope proof and affected surfaces are recorded in each iteration narrative and in the iteration JSONL deltas.

## 4. Remediation Workstreams

**P1 first.**

1. **W1 - F001: repair the merged doctor contract pair.** Decide the accepted-runtime wording once, then update `doctor-install-contract.test.cjs:240-241` and `doctor-install.yaml:46` together. The failing assertion is the proof: the test still requires `outside claude, opencode, codex, cursor, devin and pi or the ones already there` and `DSH is not offered, because the link manifest has no DSH row.`
2. **W2 - F002:** change "outside the nine" to "eight", or add the ninth runtime to `symlink-manifest.json` and the engine.

**P2 advisories.**

3. **W3 - F003:** add Vibe to `README.md:244` and `SKILL.md:205`; the adapter and the hook contract already name it.
4. **W4 - F004, F005:** say "no writing command it did not type" in the no-edit bullet, and name `:unattended` plus the `:with-*` family in the suffix sentence.

## 5. Spec Seed

- The accepted doctor runtime set is one fact with two consumers (presentation, yaml) and one authority (the symlink manifest). Record that authority in the spec.
- A merge that rewrites an asset and adds a contract test for the old asset must resolve to one wording before the merge commits.
- The advisor runtime set is seven hooks plus the OpenCode plugin; keep the two advisor enumerations and the hook contract in step.

## 6. Plan Seed

- Add a test-fixture update to the doctor merge checklist: when main rewrites a presentation string, grep the contract tests for the old sentence.
- Add a count check: the accepted-runtime list and the sentence's count must come from the same manifest read.
- Add a docs claim check for the release notes' suffix list against `MODE_SUFFIX`.

## 7. Traceability Status

**Core protocols**

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | notApplicable | No spec implementation surface maps to the docs area; doc claims were checked against HEAD code per finding. |
| `checklist_evidence` | notApplicable | No `checklist.md`; the pass-ten brief and scope file are the checklist. |

**Overlay protocols**

| Protocol | Status | Evidence |
|----------|--------|----------|
| `skill_agent` | pass | `.skilled/skills/sk-doc/SKILL.md:29` and `ROUTER.md:27,33,97` agree with `.skilled/commands/create/sk-skill.md`. |
| `agent_cross_runtime` | pass | The Vibe adapter proxies the shared handler; Pi and DSH import the same module; `hooks/skill-advisor-hook.md:119` names Vibe. |
| `feature_catalog_code` | notApplicable | No feature-catalog claim touched. |
| `playbook_capability` | notApplicable | No playbook claim touched. |

`AC_COVERAGE`: exempt. The review target is a spec folder but no `acceptance-criteria.md` lifecycle is active for this review packet; the pass-ten brief is the operative checklist.

## 8. Deferred Items

- The changelog's 185-file / 2121-test measurement was not re-run; it is not a code claim.
- The sealed-row fixture count of "1" in `changelog/v1.1.0.0.md:188` does not map cleanly to the baseline's `plain.holdout` fields (`own=2`, `combined=2`); it may describe the bench's own fixture regime, so it was left unverified rather than raised.
- The deep-loop depth sentence depends on route selection owned by `attach-scorer-10`; this lineage checked only the wording list.

## Dimension Expansion Map

- Completed pivots: 0; failed pivots: 0; audited overrides: 0.
- Swept: correctness, traceability, security, maintainability.
- Council artifacts: none.
- Selected directions: docs claim accuracy, merge resolution integrity, token-level parser claims.
- Remaining frontier: none in this lineage.

## 9. Search Ledger

- `searchCoverage`: required bug classes were doc-claim drift, merge-content loss, and parser/doc mismatch. All three were covered; none was deferred or blocked.
- `candidateCoverage`: five findings, all linked to file:line evidence; the two clean claim families (counts, versions) are recorded as ruled-out.
- `searchDebt`: none.
- `ruledOutCandidates`: the hookHealth prompt leak, the holdout publication, the command inventory, the sk-doc version authority, the parent-hub template paths, and the wrong file-name rule were each ruled out with evidence.
- `cleanSearchProof`: iterations 2, 3 and 5 recorded clean searches with per-surface reads.

## 10. Audit Appendix

**Convergence summary:** 5 iterations, stop reason `converged`, reason detail `composite_converged`, weighted stop score 0.7. Terminal gates: evidence pass, scope pass, coverage pass.

**Coverage summary:** 4 of 4 dimensions covered. Every one of the nine scope files was read under at least two dimensions (correctness and traceability in iteration 1; security and maintainability in iteration 2; targeted re-reads in iterations 3-5).

**Ruled-out claims:** no dropped `/create:sk-skill` name; no dropped main change in the sk-doc merge; no stale `/create:skill` reachable from the docs; no broken `hookHealth`; no wrong command-row count; no wrong fresh-prompt default; no Vibe handler drift; no wrong query-type count; no wrong vector-table name; no contradictory exit taxonomy; no wrong no-edit list; no wrong small-edit set; no wrong weak-cue threshold.

**Sources reviewed:** `.skilled/skills/system-skill-advisor/README.md`, `.skilled/skills/system-skill-advisor/SKILL.md`, `.skilled/skills/system-skill-advisor/changelog/v1.1.0.0.md`, `.env.example`, `.skilled/skills/sk-doc/SKILL.md`, `.skilled/skills/sk-doc/sk-create-skill/ROUTER.md`, `.skilled/commands/doctor/assets/doctor-install-presentation.txt`, `.skilled/changelog/skilled/v4.0.2.1.md`, `.skilled/skills/system-skill-advisor/runtime/tests/command-routing-slice.vitest.ts`.

**Lineage:** session `fanout-docs-merge-10-1794847584683-k2l24m`, generation 1, lineageMode `new`, release-readiness state `converged`.

**Projection note:** the reducer projects each finding's dimension from its delta row. This lineage's delta finding rows carry the id, severity, title, file and iteration, so the registry shows the iteration default dimension (`correctness`) for F003 and F004 while their iteration records name `traceability`. The severity, title, file and active status agree across the registry, the iteration records and this report.
