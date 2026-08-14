# Iteration 017 — security

- Executor: cli-codex gpt-5.6-luna effort=xhigh service_tier=fast sandbox=read-only
- Completed: 2026-07-30T07:23:26.652Z
- New findings: 5 (of 5 reported; prior total 61)
- Coverage: {"filesExamined":20,"keyPaths":[".opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs",".opencode/skills/system-deep-loop/deep-improvement/scripts/shared/rollback-candidate.cjs",".opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/rollback-candidate.cjs",".opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/score-candidate.cjs",".opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/generate-profile.cjs",".opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/scan-integration.cjs",".opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs",".opencode/skills/system-deep-loop/deep-improvement/scripts/lib/promotion-gates.cjs",".opencode/skills/system-deep-loop/deep-improvement/scripts/lib/mirror-sync-verify.cjs",".opencode/commands/deep/assets/deep-agent-improvement-confirm.yaml"]}

## Summary
The promotion and rollback paths enforce target-path and numeric gates but trust caller-supplied evidence, acceptance state, and artifact paths. Passing evaluator receipts are not bound to the candidate bytes, and two-phase state is neither authenticated nor immutable. The rollback hash guard is bypassable with a forged acceptance record. The scorer also lets the candidate choose its integration identity and derive its own rubric.

## Findings
- [P0] F-017-01 Promotion accepts evaluator receipts for a different artifact @ .opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs:455
  - evidence: The helper reads score and benchmark JSON, then checks status, recommendation, numeric thresholds, and dimensions at lines 486-606, but never verifies score.candidate, score.target, score.inputHash, or the current candidate hash. The candidate is only checked for existence at line 550 before being copied at lines 716-718; benchmark mode checks only benchmarkReport.target.
  - recommendation: Require exact resolved candidate and target identity plus recomputed content hashes in every score and benchmark receipt. Reject stale, cross-candidate, cross-target, or unsigned evidence.
- [P0] F-017-02 Promotion has no candidate or artifact-output containment @ .opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs:550
  - evidence: The candidate path is accepted from CLI or acceptance state and only checked with fs.existsSync. The write-boundary check at lines 572-579 protects the canonical target only; candidate, archiveDir, acceptance-file, event-log, and state-file paths are not constrained. Lines 658 and 716-718 then copy arbitrary readable candidate bytes into the canonical target.
  - recommendation: Resolve and contain candidates beneath the packet-local candidates directory, require regular non-symlink files, and contain every archive, receipt, journal, and state output beneath the packet runtime.
- [P0] F-017-03 Ship trusts a caller-forged acceptance receipt @ .opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs:157
  - evidence: Acceptance state is plain JSON written at line 201 and later loaded from a caller-selected path. Ship verifies only status and hashes stored inside that same mutable JSON at lines 205-248; score, benchmark, repeatability, config, manifest, target, and candidate paths remain mutable pointers. A forged state can set preAcceptTargetHash to the current target hash, candidateSnapshotPath to arbitrary content, candidateHash to that content's hash, and point to fabricated passing gate files before line 706 copies it into the canonical target.
  - recommendation: Use an authenticated, append-only acceptance receipt binding all evidence digests, paths, target preimage, candidate snapshot, evaluator epoch, and approval identity. Ship must consume that receipt without allowing path overrides.
- [P0] F-017-04 Rollback hash guard is bypassable through the candidate-hash alternative @ .opencode/skills/system-deep-loop/deep-improvement/scripts/shared/rollback-candidate.cjs:177
  - evidence: expectedRollbackSourceHashes accepts both preAcceptTargetHash and candidateHash, and line 210 permits the current target to match either hash. An attacker can forge an acceptance file with preAcceptTargetHash equal to an arbitrary backup's digest and candidateHash equal to the current target's digest; lines 201-214 then pass and line 269 copies the arbitrary backup over the canonical target. The acceptance JSON itself has no authenticity check.
  - recommendation: Require a trusted acceptance receipt, bind backup path and digest to the recorded preimage, require the current target to equal only the recorded promoted-candidate hash, and reject caller-authored hash alternatives.
- [P0] F-017-05 Candidate controls evaluator identity and derived rubric @ .opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/score-candidate.cjs:535
  - evidence: The scorer generates the profile from the candidate itself, then sets agentName to profile.id at line 549. generate-profile derives id from candidate frontmatter name and derives structural, rule, output, and integration checks from that same file. scan-integration uses the attacker-selected name to inspect existing canonical and mirror files, so a candidate can impersonate a well-integrated agent while authoring the checks it is scored against.
  - recommendation: Freeze the evaluator profile and rubric from the canonical target or trusted configuration before candidate generation. Bind evaluator identity to the manifest target basename and scan integration against the canonical target identity, not candidate-authored metadata.

## Leaf output (verbatim JSON)
```json
{
  "iteration": 17,
  "dimension": "security",
  "summary": "The promotion and rollback paths enforce target-path and numeric gates but trust caller-supplied evidence, acceptance state, and artifact paths. Passing evaluator receipts are not bound to the candidate bytes, and two-phase state is neither authenticated nor immutable. The rollback hash guard is bypassable with a forged acceptance record. The scorer also lets the candidate choose its integration identity and derive its own rubric.",
  "findings": [
    {
      "severity": "P0",
      "dimension": "security",
      "title": "Promotion accepts evaluator receipts for a different artifact",
      "file": ".opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs",
      "line": 455,
      "evidence": "The helper reads score and benchmark JSON, then checks status, recommendation, numeric thresholds, and dimensions at lines 486-606, but never verifies score.candidate, score.target, score.inputHash, or the current candidate hash. The candidate is only checked for existence at line 550 before being copied at lines 716-718; benchmark mode checks only benchmarkReport.target.",
      "recommendation": "Require exact resolved candidate and target identity plus recomputed content hashes in every score and benchmark receipt. Reject stale, cross-candidate, cross-target, or unsigned evidence."
    },
    {
      "severity": "P0",
      "dimension": "security",
      "title": "Promotion has no candidate or artifact-output containment",
      "file": ".opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs",
      "line": 550,
      "evidence": "The candidate path is accepted from CLI or acceptance state and only checked with fs.existsSync. The write-boundary check at lines 572-579 protects the canonical target only; candidate, archiveDir, acceptance-file, event-log, and state-file paths are not constrained. Lines 658 and 716-718 then copy arbitrary readable candidate bytes into the canonical target.",
      "recommendation": "Resolve and contain candidates beneath the packet-local candidates directory, require regular non-symlink files, and contain every archive, receipt, journal, and state output beneath the packet runtime."
    },
    {
      "severity": "P0",
      "dimension": "security",
      "title": "Ship trusts a caller-forged acceptance receipt",
      "file": ".opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs",
      "line": 157,
      "evidence": "Acceptance state is plain JSON written at line 201 and later loaded from a caller-selected path. Ship verifies only status and hashes stored inside that same mutable JSON at lines 205-248; score, benchmark, repeatability, config, manifest, target, and candidate paths remain mutable pointers. A forged state can set preAcceptTargetHash to the current target hash, candidateSnapshotPath to arbitrary content, candidateHash to that content's hash, and point to fabricated passing gate files before line 706 copies it into the canonical target.",
      "recommendation": "Use an authenticated, append-only acceptance receipt binding all evidence digests, paths, target preimage, candidate snapshot, evaluator epoch, and approval identity. Ship must consume that receipt without allowing path overrides."
    },
    {
      "severity": "P0",
      "dimension": "security",
      "title": "Rollback hash guard is bypassable through the candidate-hash alternative",
      "file": ".opencode/skills/system-deep-loop/deep-improvement/scripts/shared/rollback-candidate.cjs",
      "line": 177,
      "evidence": "expectedRollbackSourceHashes accepts both preAcceptTargetHash and candidateHash, and line 210 permits the current target to match either hash. An attacker can forge an acceptance file with preAcceptTargetHash equal to an arbitrary backup's digest and candidateHash equal to the current target's digest; lines 201-214 then pass and line 269 copies the arbitrary backup over the canonical target. The acceptance JSON itself has no authenticity check.",
      "recommendation": "Require a trusted acceptance receipt, bind backup path and digest to the recorded preimage, require the current target to equal only the recorded promoted-candidate hash, and reject caller-authored hash alternatives."
    },
    {
      "severity": "P0",
      "dimension": "security",
      "title": "Candidate controls evaluator identity and derived rubric",
      "file": ".opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/score-candidate.cjs",
      "line": 535,
      "evidence": "The scorer generates the profile from the candidate itself, then sets agentName to profile.id at line 549. generate-profile derives id from candidate frontmatter name and derives structural, rule, output, and integration checks from that same file. scan-integration uses the attacker-selected name to inspect existing canonical and mirror files, so a candidate can impersonate a well-integrated agent while authoring the checks it is scored against.",
      "recommendation": "Freeze the evaluator profile and rubric from the canonical target or trusted configuration before candidate generation. Bind evaluator identity to the manifest target basename and scan integration against the canonical target identity, not candidate-authored metadata."
    }
  ],
  "refutations": [
    {
      "id": "F-008-03",
      "verdict": "deepened",
      "reason": "The known direct rollback issue is confirmed at agent-improvement/rollback-candidate.cjs:144. The shared acceptance-file path has an additional bypass: its OR-based hash check can be satisfied with a forged candidateHash even when the backup is supplied through an acceptance record."
    }
  ],
  "coverage": {
    "filesExamined": 20,
    "keyPaths": [
      ".opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs",
      ".opencode/skills/system-deep-loop/deep-improvement/scripts/shared/rollback-candidate.cjs",
      ".opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/rollback-candidate.cjs",
      ".opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/score-candidate.cjs",
      ".opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/generate-profile.cjs",
      ".opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/scan-integration.cjs",
      ".opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs",
      ".opencode/skills/system-deep-loop/deep-improvement/scripts/lib/promotion-gates.cjs",
      ".opencode/skills/system-deep-loop/deep-improvement/scripts/lib/mirror-sync-verify.cjs",
      ".opencode/commands/deep/assets/deep-agent-improvement-confirm.yaml"
    ]
  }
}
```