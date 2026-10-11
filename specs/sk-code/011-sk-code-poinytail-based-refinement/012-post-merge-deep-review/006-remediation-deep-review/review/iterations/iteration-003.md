# Review Iteration 003 — Traceability: remediation claims rerun against git and the tree

## Dispatcher
- Mode: review; target agent: @deep-review; iteration 3 of 5; stop policy max-iterations; run rvw-012-006-remediation-20261010T211804Z.
- Assigned focus: commits 019b94a403 (phase 004-hub-doc-pointers) and f4f678328b (phase 005-claim-corrections).
- Agent definition loaded: .skilled/agents/deep-review.md.
- Setup bindings (agent contract §0b; emitted late relative to the contract's step order):

```
BINDING: target=commits 019b94a403,f4f678328b in 1d078f3356..d1741a28f7
BINDING: maxIterations=5
BINDING: convergence=0.1
BINDING: mode=review
BINDING: dimensions=correctness,security,traceability,maintainability
BINDING: specFolder=specs/sk-code/011-sk-code-poinytail-based-refinement/012-post-merge-deep-review/006-remediation-deep-review
```

## Dimension
Traceability: core protocols spec_code and checklist_evidence; overlay protocols skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability. Every claim changed by the two focused commits was rerun against git or the working tree; the epic goal's amended count criterion was executed verbatim.

## Files Reviewed
- .skilled/skills/sk-code/manual-testing-playbook/tooling-and-hooks/check-dist-staleness-hook.md — legacy-hook wording and live-hook pointer [SOURCE: .skilled/skills/sk-code/manual-testing-playbook/tooling-and-hooks/check-dist-staleness-hook.md:11]
- .skilled/skills/sk-code/manual-testing-playbook/tooling-and-hooks/comment-hygiene-hook.md — same [SOURCE: .skilled/skills/sk-code/manual-testing-playbook/tooling-and-hooks/comment-hygiene-hook.md:11]
- .skilled/skills/sk-code/manual-testing-playbook/manual-testing-playbook.md — playbook root bullet [SOURCE: .skilled/skills/sk-code/manual-testing-playbook/manual-testing-playbook.md:52]
- .skilled/skills/sk-code/shared/references/stack-detection.md — mixed-marker row now cites frontmatter-version.mjs [SOURCE: .skilled/skills/sk-code/shared/references/stack-detection.md:145]
- .skilled/skills/system-deep-loop/deep-improvement/scripts/check-agent-mirror-sync.cjs — two-mirror header [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/check-agent-mirror-sync.cjs:6]
- .skilled/skills/sk-code/sk-code-quality/scripts/ceiling-report.sh — rerun for the corrected reading [SOURCE: .skilled/skills/sk-code/sk-code-quality/scripts/ceiling-report.sh:1]
- Two corrected child summaries: 008/004-debt-report-and-hermes-gate line 115 and 011/005-doc-claims-hardening line 61.
- Phase docs: 004 and 005 implementation-summary.md, goal.md and spec.md; epic goal.md criterion 2.

## Findings - New

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings
1. **Provenance clause misnames the packet that added the first six doc-claims tests** — specs/sk-code/011-sk-code-poinytail-based-refinement/012-post-merge-deep-review/005-claim-corrections/implementation-summary.md:88 (and spec.md:105).
- Case: the Key Decisions row reads `Git shows 817ff5b2a7 added 6 and d2701afc3b took the file from 6 to 12, both in the packet`, and REQ-002 reads `Git shows the packet's commits took it from 0 to 6 and from 6 to 12`.
- Evidence: `git log -1 --format='%B' 817ff5b2a7 | grep '^Spec:'` prints `Spec: sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/005-opencode-and-guards`, and the same for `d2701afc3b` prints `Spec: .../011-round-four-remediation/005-doc-claims-hardening`; `git show 817ff5b2a7 -- <test file> | grep -c '^+test('` prints 6 and `git show d2701afc3b -- <test file> | grep -c '^+test('` prints 6. So the 0-to-6 step belongs to a sibling packet (010/005-opencode-and-guards), not to this packet or to the corrected doc-claims-hardening packet; the clause holds only if `the packet` is read as the epic root specs/sk-code/011-sk-code-poinytail-based-refinement, which is not its local antecedent.
- Confidence: 0.6. Counterevidence sought: both commits' Spec trailers and the packet trees; no record places 817ff5b2a7 in either 005 packet. Alternative explanation: epic-wide usage of `packet`. Downgrade trigger: if the epic's convention allows `the packet` to mean the epic root in child summaries, this collapses to a note.
- User impact: a reader auditing the corrected count learns the wrong provenance for half the arithmetic. The count itself (12 total, six added by the corrected packet) is right.
- Finding class: class-of-bug
- Recommendation: name the owning packet in both places (`817ff5b2a7, 010-round-three-remediation/005-opencode-and-guards`) or drop the clause.

## Traceability Checks
- spec_code: 004 REQ-001 (`rg` no-match, rc=1) and REQ-002 (no `preview-server`; `.skilled/skills/sk-doc/scripts/frontmatter-version.mjs` exists) rerun green; REQ-004 six carriers each read 2.2.8.0 and Hermes prints `PASS: 70 Hermes skill copies in sync`; route-guard rerun omitted (script header does not assert read-only). 005 REQ-001: `python3 ceiling-report.sh` ends `markers=3 no-trigger=1 no-signal=1` and line 115 carries the same text; REQ-003: header contains `codex/agents/<name>.toml` once and `--all` prints `12 agent(s) checked` with exit 0; REQ-002 numbers green (`grep -c '^test('` = 12; line 61 = `Six new test cases, 12 in total`) with its provenance clause flagged R3-P2-001. 004 and 005 strict validation each print `RESULT: PASSED`.
- checklist_evidence: the epic's convention (goal log) is that Level-1 children close through goal criteria plus REQ/SC rows, and this was exercised: 004 criteria 1-3 and 5 pass, criterion 4 partial (route guard omitted; Hermes PASS); 005 criteria 1-4 pass, criterion 5 `RESULT: PASSED`; epic criterion 2 executed verbatim prints 41 (and f4f678328b's diff shows the criterion line raised 36 to 41, matching the commit message).
- skill_agent: sk-code 2.2.8.0 on all six carriers; deep-improvement 1.19.2.0 in SKILL.md and changelog; Hermes copies in sync.
- agent_cross_runtime: `check-agent-mirror-sync.cjs --all` → `agent-mirror-sync: 12 agent(s) checked — all mirrors in sync — OK`, exit 0, matching the summary's claim.
- feature_catalog_code: hub-router.json, mode-registry.json and description.json carry 2.2.8.0.
- playbook_capability: the legacy/live hook distinction reads correctly in the playbook root and both scenarios, points at a real `.cjs` and a real router scenario, and the wider sweep finds no stale framing outside the changelog's description of the fix. A runtime-config sweep (`.claude .codex .devin .hermes .opencode .cursor .pi .skilled/hooks`, excluding docs/tests) finds no registration of the `.sh`, supporting `registered in no runtime`.

## Integration Evidence
- Surfaces exercised read-only: the sk-code playbook tree, the deep-improvement mirror checker and changelog, the ceiling-report script, the doc-claims test file, and the epic goal criteria. No reviewed file was modified; the only writes were this run's state artifacts.

## Edge Cases
- The working tree currently carries uncommitted review-session edits (012 goal.md/spec.md/graph-metadata.json modified; 006 untracked). A recursive strict run over the epic therefore prints 12 PASSED / 1 FAILED: 012 fails GENERATED_METADATA_INTEGRITY (graph-metadata source_fingerprint mismatch) and GENERATED_METADATA_DRIFT (description), i.e. derived metadata is stale relative to the session's own doc edits. This is in-flight session state, not a defect of the reviewed commits, and clears when the session refreshes its derived metadata and commits.
- ceiling-report.sh is Python under a `.sh` name (shebang `#!/usr/bin/env python3`); invoked via `bash` it fails with `import: command not found`. Run it via its shebang. Same pre-existing convention as check-dist-staleness.sh (documented in TH-001), and the script itself is not part of the f4f678328b diff.
- The 005 implementation-summary's Files Changed table lists its six deliverable edits while the commit also carries review-packet bookkeeping (012 completion marks, the epic criterion 36->41, four graph-metadata refreshes) credited only in the commit message. Recorded as an observation, not a finding: the same convention holds in 004 (manifest re-mint not tabled), so the table is scoped to deliverables by design.
- Prior finding R2-P2-001 (dead citation in sk-code-webflow performance reference) remains active; not re-verified this iteration, no new evidence.

## Verdict
P0=0, P1=0, P2=1 new (R3-P2-001). All other assigned traceability claims rerun green; new findings ratio 1.0 (one finding across seven executed search rows).

## Next Dimension
- Proposed for iteration 4: maintainability over the five remediation diffs and their doc chains (version-carrier mechanics, derived-metadata lifecycle, drift-guard coverage), leaving security for the final pass over the hook fail-open paths.

Review verdict: PASS
