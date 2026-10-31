# Review Iteration 5, Changelogs and Final Cross-Check

Mode: review | Dimension: traceability (changelog accuracy) + cross-check of all carried findings
Iteration: 5 of 5 | Target: v4.0.0.12 release, changelog group (steer.md scope group 5)

## Dimension

Whether the three release changelogs describe shipped behavior accurately, meet the
`sk-create-changelog` contract, and name paths that exist; plus the final re-verification of
every carried finding and the release's own evidence trail (`tasks.md` rows) against the
artifacts this lineage observed independently.

## Files Reviewed

- `.skilled/changelog/skilled/v4.0.0.12.md`
- `.skilled/skills/system-skill-advisor/changelog/v0.16.0.0.md`
- `.skilled/skills/system-spec-kit/changelog/v2.8.0.0.md`
- `.skilled/skills/system-skill-advisor/SKILL.md`, `.skilled/skills/system-spec-kit/SKILL.md`
  and their `.hermes/skills/...` mirrors (version coherence)
- `.skilled/changelog/skilled/README.md` (folder index; read for context)
- `specs/system-skill-advisor/035-doctor-command-routing/tasks.md` (evidence rows, read as
  traceability context)

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None new. Carried findings re-verified as still active (below).

## Confirmed-Clean Surfaces

- **All three changelogs pass the authoring contract.** `validate_document.py --type changelog`
  exits 0 on each; `hvr_scan.py` exits 0 with no hard blockers on each (evidence:
  `evidence/iter-005-changelog-validators.txt`). Frontmatter order, versions and titles match
  the template; every version is strictly greater than the previous entry
  (advisor `0.15.6.0 -> 0.16.0.0`, spec-kit `2.7.14.0 -> 2.8.0.0`, framework `4.0.0.11 -> 4.0.0.12`).
- **Version coherence across artifacts.** Both shipped skills bumped their `SKILL.md` version to
  the changelog version (advisor `0.16.0.0`, spec-kit `2.8.0.0`) and both Hermes mirrors carry
  the same numbers, inside the 185-mirror sync check from iteration 2.
- **Every changelog claim checked against observed behavior holds.** The v4.0.0.12 points map
  one-to-one to this lineage's evidence: setup/env prompts route (DOC-385/386 probes), the
  matching skill keeps first place with the doctor line second (DOC-387 probe), the no-match
  hint and its outage variant with no hint on unrelated prompts (DOC-389/390 probes and the
  render/hook tests), the 17-row table and five read-only legs (transaction 2 evidence), and
  the `advisor_status` workspace-root repair (exit 64 -> `status: ok`, live). The v0.16.0.0
  points map to the deriver, the Python typed-command rule (DOC-388 probe), the outage hint
  and the plugin parity tests. The v2.8.0.0 points map to the route manifest, the presentation
  contract and the read-only invariant.
- **Named paths exist.** The changelogs name only real commands and one spec folder
  (`specs/system-skill-advisor/035-doctor-command-routing`); the runtime path in the advisor
  upgrade note resolves. No dangling reference found.
- **No repository change during the review window.** `git log --since=2026-10-16T04:45:00Z`
  returns nothing, so every iteration reviewed the same frozen tree and the built `dist`
  measured in iteration 1 stayed the artifact under review.

## Carried Finding Re-Verification

- **R2-P2-001 (umbrella sk-git leg, `.skilled/commands/doctor/assets/doctor-setup.yaml:53`) —
  still active.** Re-read the site: the leg still runs `git-setup-check.cjs` bare, the battery
  still fails a leg as "Any other exit fails", the detection is still
  `process.env.CLAUDECODE ? 'claude' : null`, and DOC-391:65 still records "any other exit is
  FAIL, including a sk-git exit 3". The documented acceptance stands, so the P2 remains an
  advisory to pass `--tool` down or render a fourth UNKNOWN state.
- **R4-P2-001 (DOC-number registry, `.skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/README.md:26`)
  — still active.** Re-read the file: 0 mentions of `DOC-385..DOC-391` or `/doctor:setup`, while
  the advisor playbook ships all seven scenarios and four sibling READMEs point at this file as
  the shared number registry.

## Traceability Checks

- `checklist_evidence`: pass. The release's `tasks.md` evidence rows name real artifacts and
  measurable results; the numbers this lineage could independently reproduce match exactly:
  route-validate "14 routes validated, 2 warnings" (T006/T008), reach probe "phrases=82
  bridges=15" (T019), compatibility counts "typescriptActive 20, pythonActive 30, doctorRoutes
  16, generated 43" (T023), catalog/playbook validators (T032-T034), mirrors in sync (T009/T033),
  and per-prompt lost-0 results consistent with the 40/40 slice probe. The one packet statement
  that does not match shipped behavior (`spec.md:171`, Pi deadline line "carries no hint on
  either runtime") was fixed by a later commit than the sentence and lives in a packet doc that
  steer.md places outside the review target; recorded as an observation, not a finding.
- `spec_code`: pass to the extent the changelog claims were exercised; the release's REQ-level
  implementation evidence is unchanged from iterations 1-4.
- All four overlay protocols: pass (iterations 2-4).

## Edge Cases / Observations

- **Advisory, pre-existing: the changelog folder index is stale.** `.skilled/changelog/skilled/README.md`
  still says the current-generation top-level entries are `v4.0.0.0..v4.0.0.3` and that
  `v4.0.0.4.md` is the untagged entry, although the folder holds up to `v4.0.0.12.md`. Eight
  releases passed without updating it, so it is folder-level debt, not this release's omission;
  it is also outside steer.md's changelog scope (the three entries).
- **Convergence telemetry (informational, no early stop).** Severity-weighted new-finding
  ratios by iteration: 0.0, 1.0, 0.0, 1.0, 0.0. Both non-zero iterations introduced a single new
  P2 in a first-pass dimension (command legs, cross-repo registry); no iteration repeated a
  direction or superseded a prior finding. With `stopPolicy=max-iterations` all five iterations
  ran by design; convergence was never used to stop early.

## Ruled Out

- **"A changelog overstates shipped behavior."** Ruled out for the three entries: each headline
  claim was exercised or read at its implementation site, and the only overstatement candidate
  (the ambiguous-render vs `Also:` line) resolves in the changelog's favor for its own worked
  example, which renders the `Also:` form exactly.
- **"The release's task evidence is fabricated or unreproducible."** Ruled out where
  reproducible: six independent counters matched the recorded values, and no recorded value
  contradicted an artifact this lineage read.
- **"The review target moved under the review."** Ruled out: zero commits in the review window.

## Next Dimension

None. All five scope groups from steer.md are covered; synthesis follows.

Review verdict: PASS
