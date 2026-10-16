# Iteration 5 — Release changelogs and final cross-check

## Dimension

Correctness, traceability, and maintainability.

## Files Reviewed

- Lead scope and rulings: specs/system-skill-advisor/035-doctor-command-routing/review/lineages/luna-max-fast/steer.md:1-53.
- The advisor, system-spec-kit, and root v4.0.0.12 changelogs.
- Changelog template and authoring contract: .skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md:123-150 and .skilled/skills/sk-doc/sk-create-changelog/SKILL.md.
- Advisor wrapper and warm-only handling: .skilled/bin/skill-advisor.cjs:85-105; .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1342-1355, 1371-1389, 1577-1585.
- The doctor setup advisor leg and DOC-391's no-write claim: .skilled/commands/doctor/assets/doctor-setup.yaml:56; .skilled/skills/system-skill-advisor/manual-testing-playbook/doctor-commands/doctor-setup-run.md:14-16, 56-60.
- Earlier finding sources: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:663-679; .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:49-51; .skilled/skills/system-skill-advisor/runtime/lib/render.ts:543-549; .skilled/commands/doctor/scripts/doctor-phrase-reach.cjs:262-267; .skilled/skills/system-skill-advisor/feature-catalog/feature-catalog.md:122-128; README.md:80, 1074, 1231-1235; .skilled/commands/README.txt:42-54, 156-164.

## Review Summary

All three release changelogs pass the changelog document validator with zero issues. The HVR scan reports zero hard blockers; it leaves review-only comma candidates and one soft wording deduction. The release notes repeat claims already covered by P2-001, P2-002, and the corrected setup side-effect finding below.

### Logic-sync record

Iteration 3 recorded P2-005 on the premise that the advisor leg cold-starts the daemon and writes its lease database. The shared CLI reference says warm-only starts or attaches to the daemon, but the implementation contradicts that description: when the daemon is unavailable, warm-only returns a retryable error without spawning it. The doctor setup leg still runs advisor_status when a daemon is already alive. P2-005 is resolved because its recorded cold-start case is false.

The write-free claim remains inaccurate for a narrower reason. The advisor shim calls ensureSocketDir at startup, and that function creates the default /tmp/system-skill-advisor directory when it is absent. DOC-391's git status comparison cannot observe that write. This replacement finding is P2-008.

The shared CLI reference at .skilled/skills/system-skill-advisor/references/runtime/cli-front-door-contract.md:33-34 also says warm-only returns without running a command. The implementation sends the requested command to advisor.call when the daemon is alive. This reference mismatch is outside the shipped-release file list and does not make the doctor setup leg skip its status query, so it is not a separate release finding.

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **P2-001 — Quoted doctor-command text bypasses skill-first ordering**
   - Location: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:679.
   - Case: A prompt that quotes /doctor:setup takes the raw substring branch, preserving doctor-first order even when a matching skill should remain first. The changelog's claim that no previously correct route changes is therefore too broad.
   - Recommendation: Distinguish a direct slash-command invocation from a quoted reference before bypassing skill-first ordering.

2. **P2-002 — Generic check wording advertises setup on unrelated no-match prompts**
   - Location: .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:51.
   - Case: If “Check what time the tide turns” receives no skill match, the generic check predicate adds the /doctor:setup hint. The changelogs say unrelated prompts receive no hint.
   - Recommendation: Require setup, environment, installation, or tooling-health context in addition to a generic check verb.

3. **P2-003 — Doctor phrase reach can report stale scorer behavior as current**
   - Location: .skilled/commands/doctor/scripts/doctor-phrase-reach.cjs:264.
   - Case: When source changes but an older built scorer remains present, the probe can score the old artifact and report current reach as passing.
   - Recommendation: Check source/build freshness or mark the probe indeterminate when the artifact is stale.

4. **P2-004 — Doctor-routing scenarios omit their required feature-catalog backlink**
   - Location: .skilled/skills/system-skill-advisor/manual-testing-playbook/doctor-commands/doctor-routing-setup-onboarding.md:94.
   - Case: DOC-385 through DOC-391 link to implementation sources but not the matching feature-catalog entry, so a reader opening a scenario cannot follow it to the behavior contract and test anchors.
   - Recommendation: Link each scenario to feature-catalog/scorer-fusion/doctor-command-routing.md.

5. **P2-006 — The feature catalog lists an OpenCode hook capability without a feature page**
   - Location: .skilled/skills/system-skill-advisor/feature-catalog/feature-catalog.md:126.
   - Case: The catalog names the native OpenCode hooks and prompt-wrapper fallback but offers no per-feature page for implementation and validation anchors.
   - Recommendation: Add the feature page or merge/remove the row if it is not a distinct capability.

6. **P2-007 — Root README understates the command catalog by two entries**
   - Location: README.md:1074; the same total appears at :80.
   - Case: The README says 37 commands, while the canonical command catalog and its checker report 39.
   - Recommendation: Update both totals and the group breakdown, or explain the two excluded entries.

7. **P2-008 — DOC-391's write-free claim misses a socket-directory creation**
   - Location: .skilled/skills/system-skill-advisor/manual-testing-playbook/doctor-commands/doctor-setup-run.md:16.
   - Case: On a machine without the default advisor socket directory, /doctor:setup's advisor leg starts the shim, whose top-level ensureSocketDir call creates /tmp/system-skill-advisor before warm-only reports that the daemon is unavailable. The scenario's repository status comparison does not see this filesystem write. This does not start the daemon or write its lease database.
   - Recommendation: Describe the temporary directory effect and assert its state directly, or make socket-directory setup conditional on a mode that may spawn/attach the daemon.

## Traceability Checks

- Changelog validator: all three files valid, zero issues, exit 0.
- HVR scan: exit 0, zero hard blockers; review-only comma candidates and one soft deduction remain.
- The advisor release note's unrelated-prompt statement is covered by P2-002. The “no previously correct route changes” statement is covered by P2-001. The “writes nothing” and read-only claims are covered by P2-008.
- Static call-path review confirms warm-only does not cold-start the daemon; with an alive daemon, the requested advisor_status command still executes.
- No test runner, build, or runtime probe was run. The prior blocked doctor-probe search debt remains because that probe writes outside the lineage directory.

## Next Dimension

Synthesis. The max-iteration limit is reached; no further review iteration is requested.

## Verdict

Review verdict: PASS
