# Deep Review Report — v4.0.0.11 release conformance review (`deepseek-max` lineage)

- Run: `fanout-deepseek-max-1792125954096-ldhndm` (lineage `deepseek-max`, generation 1, mode `new`)
- Target: `specs/sk-git/033-git-setup-customization/006-release-conformance-review` (spec-folder)
- Charter: `review/lineages/deepseek-max/steer.md` — the file list in the packet's
  `goal-file-manifest.txt` (25 paths), judged against the sk-doc authoring contracts, the
  sk-code-opencode checklists and the repo's own validators
- Iterations: 5 of 5; stop reason `maxIterationsReached` (stop policy `max-iterations`)
- Verdict: **CONDITIONAL** — 0 P0, 1 P1, 11 P2 active

---

## 1. Executive Summary

The v4.0.0.11 release — the read-only `/doctor:git setup` battery and its hardening — is
functionally sound and heavily tested: the release's own fixture suites pass (44/44 node tests,
50/50 shell fixtures), the live battery passes on this checkout (`STATUS=OK checks=11`), the
gate-inputs check passes (`failures=0`), route validation and all router-drift checks pass, and the
two changelogs pass their validators with zero HVR hard blockers. No correctness or security defect
was confirmed in the code.

The release is not conformance-clean, in one blocking and eleven advisory ways:

- **One P1:** the sk-git skill package **fails its own packaging check** — `SKILL.md` is 5038
  words against the repository's 5000-word hard limit (`package_skill.py --check` → FAIL, exit 1),
  while `README.md` §8 documents that exact command as reporting PASS.
- **Eleven P2s:** documentation drift and accuracy defects concentrated in the release's own
  documentation updates (stale playbook census, stale index ranges, a missing category in the
  playbook's artifact list, a missing doctor command in the system-spec-kit overview, an
  incomplete/self-contradictory verdict list in the root README, a documented command that does
  not run as written, HVR semicolons in the new presentation asset, and one false-PASS path in
  the battery's allowlist row when its bash probe cannot run).

Scope covered: all five code files, all five command-surface files, all eight sk-git doc files,
all five cross-repo files, both changelogs — 25/25 manifest entries, each with at least one
iteration of review. Evidence base: 5 fixture suites/validators executed (44 node tests, 50 shell
fixtures, gate-input check, route validation + self-test, skill/playbook/catalog/document
validators, HVR scans, router-drift check), the battery exercised live in human and JSON modes,
and release-commit diffs for attribution.

hasAdvisories: not applicable — the verdict is CONDITIONAL, not PASS.

---

## 2. Planning Trigger

`/speckit:plan` **is required**: the active P1 needs a remediation change (trim `SKILL.md` below
the hard limit and re-run the documented check), and the P2 workstreams touch eight files.

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": { "P0": 0, "P1": 1, "P2": 11 },
  "remediationWorkstreams": [
    { "id": "WS-1", "priority": 1, "title": "Restore sk-git packaging conformance", "findings": ["R3-P1-001"], "surfaces": [".skilled/skills/sk-git/SKILL.md"], "exit": "package_skill.py --check reports PASS (exit 0)" },
    { "id": "WS-2", "priority": 2, "title": "Fix the battery's un-runnable bash allowlist path", "findings": ["R1-P2-001"], "surfaces": [".skilled/commands/doctor/scripts/git-setup-check.cjs"], "exit": "an un-runnable bash makes the allowlist row UNKNOWN (exit 3), not PASS" },
    { "id": "WS-3", "priority": 2, "title": "Correct the release documentation drift", "findings": ["R3-P2-001", "R3-P2-003", "R3-P2-004", "R4-P2-001"], "surfaces": [".skilled/skills/sk-git/SKILL.md", ".skilled/skills/sk-git/manual-testing-playbook/manual-testing-playbook.md", ".skilled/skills/system-spec-kit/feature-catalog/doctor-commands/category-overview.md"], "exit": "census, ranges and enumerations match the trees" },
    { "id": "WS-4", "priority": 2, "title": "Correct verdict-vocabulary and command lines", "findings": ["R2-P2-002", "R3-P2-002", "R3-P2-005", "R4-P2-002"], "surfaces": [".skilled/commands/doctor/git.md", ".skilled/skills/sk-git/SKILL.md", ".skilled/skills/sk-git/feature-catalog/feature-catalog.md", "README.md"], "exit": "one consistent five-value verdict set; documented commands run" },
    { "id": "WS-5", "priority": 3, "title": "Voice pass over the new presentation asset", "findings": ["R2-P2-001"], "surfaces": [".skilled/commands/doctor/assets/doctor-git-presentation.txt"], "exit": "hvr_scan reports zero hard blockers" },
    { "id": "WS-6", "priority": 3, "title": "Fix the script test-location sentence", "findings": ["R2-P2-003"], "surfaces": [".skilled/commands/doctor/scripts/README.md"], "exit": "the coverage sentence names the freshness suite's real location" }
  ],
  "specSeed": [
    "Record the SKILL.md word budget as a release gate: the packaging check must run before the version ships.",
    "Note the verdict-vocabulary contract for the setup battery (PASS/FAIL/SKIP/UNKNOWN/DEGRADED, exit 0/1/2/3) once, in the router, and point every other surface at it."
  ],
  "planSeed": [
    "Trim .skilled/skills/sk-git/SKILL.md below 5000 words (5038 now), moving overflow into references/, and re-run package_skill.py --check until PASS.",
    "Update the three stale range/count statements in the playbook index and the SKILL.md playbook census to 46 scenarios / 9 categories.",
    "Add doctor-commands/ to the playbook index's canonical artifact list and /doctor:sk-code to the system-spec-kit doctor overview.",
    "Align the root README's setup bullet with the verification paragraph (five verdicts) and fix the catalog's verdict list.",
    "Repair the SKILL.md validation command line (python3, correct relative path).",
    "Make checkAllowlist return UNKNOWN when bash cannot run, and extend the fixture suite with that case.",
    "Run hvr_scan over the presentation asset and remove the four hard semicolons."
  ],
  "findingClasses": [
    "packaging-conformance",
    "capability-conformance",
    "standards-conformance",
    "documentation-drift",
    "documentation-accuracy",
    "listing-completeness",
    "documented-command"
  ],
  "affectedSurfacesSeed": [
    ".skilled/skills/sk-git/SKILL.md",
    ".skilled/commands/doctor/scripts/git-setup-check.cjs",
    ".skilled/commands/doctor/assets/doctor-git-presentation.txt",
    ".skilled/commands/doctor/git.md",
    ".skilled/commands/doctor/scripts/README.md",
    ".skilled/skills/sk-git/manual-testing-playbook/manual-testing-playbook.md",
    ".skilled/skills/sk-git/feature-catalog/feature-catalog.md",
    ".skilled/skills/system-spec-kit/feature-catalog/doctor-commands/category-overview.md",
    "README.md"
  ],
  "fixCompletenessRequired": true
}
```

---

## 3. Active Finding Registry

| ID | Sev | Dimension | Title | File:line | Disposition |
|----|-----|-----------|-------|-----------|-------------|
| R3-P1-001 | P1 | maintainability / standards conformance | sk-git fails its own skill-packaging check: SKILL.md 5038 words > 5000 limit | `.skilled/skills/sk-git/SKILL.md:1` | active |
| R1-P2-001 | P2 | correctness / capability conformance | Allowlist row reports PASS when the bash probe could not run | `.skilled/commands/doctor/scripts/git-setup-check.cjs:504` | active |
| R2-P2-001 | P2 | standards conformance (prose) | Presentation asset carries four hard semicolon blockers | `.skilled/commands/doctor/assets/doctor-git-presentation.txt:262` | active |
| R2-P2-002 | P2 | standards conformance (budget) | git.md description exceeds the 110-character soft target (133) | `.skilled/commands/doctor/git.md:2` | active |
| R2-P2-003 | P2 | documentation accuracy | Scripts README's test-location claim is inaccurate for one script | `.skilled/commands/doctor/scripts/README.md:21` | active |
| R3-P2-001 | P2 | documentation drift | SKILL.md's playbook census is stale (GIT-042/8 → 46/9) | `.skilled/skills/sk-git/SKILL.md:573` | active |
| R3-P2-002 | P2 | documented command | A documented validation command does not run as written (bash on .py) | `.skilled/skills/sk-git/SKILL.md:573` | active |
| R3-P2-003 | P2 | documentation drift | Playbook index's canonical artifact list omits doctor-commands/ | `.skilled/skills/sk-git/manual-testing-playbook/manual-testing-playbook.md:18` | active |
| R3-P2-004 | P2 | documentation drift | Playbook index range and count statements lag the tree (§13 "18 scenarios"/GIT-023..GIT-043; §8; wave table) | `.skilled/skills/sk-git/manual-testing-playbook/manual-testing-playbook.md:603` | active |
| R3-P2-005 | P2 | documentation accuracy | Catalog entry omits the DEGRADED verdict from the battery's vocabulary | `.skilled/skills/sk-git/feature-catalog/feature-catalog.md:163` | active |
| R4-P2-001 | P2 | listing completeness | Doctor category overview never mentions /doctor:sk-code | `.skilled/skills/system-spec-kit/feature-catalog/doctor-commands/category-overview.md:17` | active |
| R4-P2-002 | P2 | documentation accuracy | Root README gives the new setup command two different verdict sets, one incomplete | `README.md:1262` | active |

Evidence, impact and fix recommendation per finding are recorded in the iteration files
(`iterations/iteration-001.md` … `iteration-005.md`) and in the per-iteration deltas
(`deltas/iter-001.jsonl` … `iter-005.jsonl`); the reducer-owned registry
(`deep-review-findings-registry.json`) is the canonical machine state and holds the same 12
entries. Every finding carries a concrete failure case and a fix boundary:

- R3-P1-001 — evidence: `package_skill.py --check` FAIL ("5038 words, max: 5000", `package_skill.py:101,463`), `validate_skill_package.py` exit 1; affected surface: the packaging gate and `README.md:272`; fix: trim below the limit, re-run the documented command. Finding class: packaging conformance. Scope proof: manifest entry, repo validator run on the file as committed.
- R1-P2-001 — evidence: `result.error` → "not checked" detail → `pass()` at line 523, vs `checkCommitId` returning UNKNOWN on the same condition (line 668) and `runCommand`'s documented "could not run" contract (lines 181-191); fix: return UNKNOWN. Finding class: capability conformance. Scope proof: manifest entry, code read.
- R2-P2-001 — evidence: `hvr_scan.py` 4 hard blockers (lines 262-264) and `hvr-publish-supplement.md:90`; fix: rewrite the four sentences. Finding class: standards conformance. Scope proof: manifest entry, validator run.
- R2-P2-002 — evidence: `validate_document.py` warning `command_description_over_soft_target` 133 > 110; fix: shorten the description. Finding class: standards conformance. Scope proof: manifest entry, validator run.
- R2-P2-003 — evidence: no freshness suite under `tests/`; it lives at `.skilled/skills/system-skill-advisor/runtime/tests/doctor/skill-graph-freshness-panel.vitest.ts` (`tests/README.md:52`, `run-all.sh:100`); fix: name the exception. Finding class: documentation accuracy.
- R3-P2-001/003/004 — evidence: playbook tree = 46 scenarios / 9 categories (validator line + file count) vs the cited prose; fix: update the census, artifact list and range statements. Finding class: documentation drift.
- R3-P2-002 — evidence: the documented command exits non-zero in both working directories (`cite-drift: command not found`); `README.md:271` holds the runnable form; fix: `python3` + correct path. Finding class: documented command.
- R3-P2-005, R4-P2-002 — evidence: verdict lists omit DEGRADED at `feature-catalog.md:163` and `README.md:1262` while sibling artifacts define five verdicts; fix: one consistent list. Finding class: documentation accuracy.
- R4-P2-001 — evidence: `/doctor:sk-code` exists in `_routes.yaml:221-222`, the commands table and the playbook README, and is absent from the overview's enumeration, playbook mapping and source table; fix: add it. Finding class: listing completeness.

---

## 4. Remediation Workstreams

1. **WS-1 (P1) — Restore packaging conformance.** Trim `.skilled/skills/sk-git/SKILL.md` to
   ≤5000 words (38+ words over; the §3 `/doctor:git` block and §4 ALWAYS #8 are the largest
   candidates, with overflow into `references/`). Exit: `package_skill.py --check` → PASS,
   `README.md:272` true again.
2. **WS-2 (P2) — Fix the allowlist un-runnable path.** Return `UNKNOWN` when `.error` is set;
   add the fixture case. Exit: a spawn-failure run reports the row UNKNOWN.
3. **WS-3 (P2) — Documentation drift.** Correct the playbook census (SKILL.md:573), the index
   artifact list (add `doctor-commands/`), the index ranges/counts (§8, §13, wave table), and add
   `/doctor:sk-code` to the system-spec-kit overview. Exit: census and enumerations match the
   trees; playbook validator stays green.
4. **WS-4 (P2) — Accuracy fixes.** One five-value verdict set across README, catalog and YAML;
   fix the SKILL.md validation command; shorten `git.md`'s description. Exit: the four surfaces
   agree and the command runs.
5. **WS-5 (P2) — Voice pass.** Rewrite the four semicolon sentences in the presentation asset.
   Exit: `hvr_scan.py` reports zero hard blockers.
6. **WS-6 (P2) — Coverage sentence.** Name the freshness suite's real location. Exit: sentence
   matches `tests/README.md:52`.

P2 advisories not folded above: none — all eleven are in WS-2..WS-6.

---

## 5. Spec Seed

- Make the skill-packaging check a release gate for `.skilled/skills/**` changes; today a 38-word
  overrun ships with the README asserting PASS.
- Define the setup battery's result vocabulary once (five values, four exit codes) and have every
  doc surface point at that definition instead of restating a subset.
- Add a documentation-consistency step to the release checklist: any folder added to a playbook
  or catalog must be reflected in that package's artifact list, census prose and section ranges.

## 6. Plan Seed

- `Trim SKILL.md and re-run package_skill.py --check` (WS-1).
- `Allowlist row: UNKNOWN on un-runnable bash + fixture` (WS-2).
- `Sync playbook census/ranges/artifact list and the doctor overview to the trees` (WS-3).
- `One verdict list for /doctor:git setup across README, catalog, YAML` (WS-4).
- `HVR pass on doctor-git-presentation.txt` (WS-5).
- `Fix the scripts README coverage sentence` (WS-6).

---

## 7. Traceability Status

Core protocols:

- `spec_code` — partial. The packet's `spec.md` is scaffold context per the charter; code and docs
  were checked against their own contracts, the route manifest, the battery behaviour and the
  release commits. Divergences are the recorded findings.
- `checklist_evidence` — partial. No `checklist.md` evidence rows exist; the release's evidence is
  the executed validator set (44 node tests, 50 shell fixtures, gate-input check, route validation
  and self-test, skill/playbook/catalog/document validators, HVR scans, router-drift check,
  git-standards round-trip) and the live battery runs.

Overlay protocols:

- `skill_agent` — partial: SKILL.md §3 → `/doctor:git` router linkage verified; the SKILL.md
  packaging failure remains (R3-P1-001).
- `agent_cross_runtime` — pass: `.hermes/skills/sk-git/SKILL.md` is content-identical to the
  canonical SKILL.md (generated banner and link rewrites only).
- `feature_catalog_code` — partial: catalog validator PASS; verdict-vocabulary drift
  (R3-P2-005) and the overview omission (R4-P2-001) recorded.
- `playbook_capability` — pass on structure (validator: 46 scenarios, 9 categories, 0
  violations); index census drift recorded (R3-P2-003/004).

`AC_COVERAGE`: **exempt** — the packet has no `checklist.md`, so the advisory signal is not
applicable (Level-2 lifecycle predicate not active).

Resource Map Coverage Gate: **skipped** — `resource-map.md` is not present in the packet at
init (`resource_map_present: false`).

---

## 8. Deferred Items

- The pre-existing HVR semicolon census on the long-standing docs (playbook index 53, hooks
  README 32, catalog 12) is out of release scope: release-commit diffs added 0-2 such lines.
  A future voice pass may sweep them.
- The root README's "ten commands … the eight routed ones" count was examined once and read as
  deliberate (seven commands carry routes; mcp's companion rows also live in the manifest); no
  action recommended.
- Contract tests for the doctor-git workflow assets (the mcp/speckit/update families ship
  `doctor-*-contract.test.cjs`, the git family does not) — noted for backlog; no documented
  requirement was found, so it is not a finding.

## Dimension Expansion Map

No divergent pivots, overrides or saturated directions were produced in this lineage (stop policy
`max-iterations`, mode `default`). Completed pivots: 0; failed pivots: 0; audited overrides: 0.
The dimension frontier: all four dimensions covered by iteration 4; iteration 5 was the
scheduled final cross-check. Remaining frontier: none recorded.

## 9. Search Ledger

*No search-depth v2 state captured (legacy v1 records).* The lineage ran under the classic
iteration contract: five narratives, five deltas, one reducer-owned registry. Candidate coverage
and search debt are empty by construction in this mode; the repo-wide sweeps performed in
iteration 4 (lexical `rg` over all `doctor:git` mentions, bridge JSON inspection, mirror diff)
are recorded in that iteration's narrative rather than as `searchLedger` rows.

---

## 10. Audit Appendix

- Convergence: iterations 1-5 with new-findings ratios 1.0 → 0.75 → 0.71 → 0.125 → 0.0; under
  `stop_policy=max-iterations` convergence was telemetry only. Final state: 12 active findings
  (1 P1, 11 P2), 0 resolved, 0 P0.
- Coverage: correctness/security (codes), traceability/maintainability (command surface, skill
  docs, cross-repo, changelogs) — all four dimensions covered; 5-of-5 iteration cap reached.
- Ruled-out claims (with reasons) live in each delta; the most load-bearing: untrusted-clone
  execution, GIT_DIR redirection, gpg.program via log.showSignature, stale advisor bridge,
  Hermes mirror drift, changelog overstatement of the fix surface — all ruled out with cited
  evidence.
- Sources reviewed: the 25 manifest entries plus context evidence from
  `.skilled/scripts/git-hooks/*`, `.skilled/hooks/shared/hook-flags.cjs`,
  `.skilled/skills/sk-doc/*` contracts and validators, `_routes.yaml` consumers
  (`command-bridges.generated.json`), and the release commits (`de67ec1678`, `3a0e17414e`,
  `45c79baac1`, `6c2c3304d3`).
- Validation commands and their observed results are recorded in the iteration narratives; every
  cited validator was executed with output read, exit status included.

Review verdict: CONDITIONAL
