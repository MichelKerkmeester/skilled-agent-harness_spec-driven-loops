# Iteration 002: Security

## Focus
Dimension: security.

Reviewed whether governance rules around comment-hygiene enforcement match the actual blocking surfaces across write-time hooks, commit-time hooks, CI and the authorized direct-push workflow.

## Scorecard
- Dimensions covered: security
- Files reviewed: 6
- New findings: P0=0 P1=1 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.50

## Findings

### P0 Findings
None.

### P1 Findings
- **F002**: Comment-hygiene enforcement is documented stronger than the actual protected paths — `.opencode/skills/system-spec-kit/constitutional/comment-hygiene.md:66` — the constitutional rule describes "two gates" and says neither can be bypassed by `--no-verify` without explicit override, but the Claude write-time hook only warns and always exits 0, the GitHub workflow only runs on pull requests to main, and another constitutional rule authorizes direct pushes to main. The commit hook also has an environment bypass. [SOURCE: .opencode/skills/system-spec-kit/constitutional/comment-hygiene.md:66] [SOURCE: .opencode/skills/system-spec-kit/constitutional/comment-hygiene.md:71] [SOURCE: .opencode/skills/sk-code/scripts/hooks/claude-posttooluse.sh:75] [SOURCE: .opencode/skills/sk-code/scripts/hooks/claude-posttooluse.sh:88] [SOURCE: .github/workflows/comment-hygiene.yml:2] [SOURCE: .opencode/skills/system-spec-kit/constitutional/main-branch-direct-push.md:20] [SOURCE: .opencode/scripts/git-hooks/pre-commit:50]

### P2 Findings
None.

## Claim Adjudication
```json
{
  "findingId": "F002",
  "claim": "The governance docs describe non-bypassable comment-hygiene gates, but the write-time hook is warn-only and the CI workflow only triggers on pull requests while this repo authorizes direct pushes to main.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/constitutional/comment-hygiene.md:66",
    ".opencode/skills/system-spec-kit/constitutional/comment-hygiene.md:71",
    ".opencode/skills/sk-code/scripts/hooks/claude-posttooluse.sh:75",
    ".opencode/skills/sk-code/scripts/hooks/claude-posttooluse.sh:88",
    ".github/workflows/comment-hygiene.yml:2",
    ".opencode/skills/system-spec-kit/constitutional/main-branch-direct-push.md:20",
    ".opencode/scripts/git-hooks/pre-commit:50"
  ],
  "counterevidenceSought": "Checked the installed git hook, tracked hook, GitHub workflow triggers, sk-code quality docs, and direct-push constitutional rule. PR CI exists, but it does not run for the authorized direct-push path.",
  "alternativeExplanation": "The intended protection may be client-side pre-commit plus PR CI only. That is a valid policy, but then the constitutional wording should not describe the system as non-bypassable.",
  "finalSeverity": "P1",
  "confidence": 0.84,
  "downgradeTrigger": "Downgrade if the docs explicitly narrow the guarantee to client-side/PR-only enforcement or the workflow adds a push/server-side gate for direct main pushes.",
  "transitions": [
    {
      "iteration": 2,
      "from": null,
      "to": "P1",
      "reason": "Initial discovery"
    }
  ]
}
```

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | pending | hard | .opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/006-governance-skdoc-skcode/spec.md:39 | Confirmed governance drift candidate; full protocol pass deferred. |
| checklist_evidence | pending | hard | .opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/006-governance-skdoc-skcode/spec.md:84 | No checklist file found yet. |

## Assessment
- New findings ratio: 0.50
- Dimensions addressed: security
- Novelty justification: New governance/enforcement mismatch found in the comment-hygiene trust boundary.

## Ruled Out
- "No CI exists": ruled out. `.github/workflows/comment-hygiene.yml` exists, but it is PR-triggered. [SOURCE: .github/workflows/comment-hygiene.yml:2]
- "Write-time hook blocks writes": ruled out because the hook prints a warning and exits 0. [SOURCE: .opencode/skills/sk-code/scripts/hooks/claude-posttooluse.sh:88]

## Dead Ends
- Treating PR CI as a universal server-side gate did not survive the direct-push constitutional rule.

## Recommended Next Focus
Traceability pass over sk-doc frontmatter and filename standards against current Spec Kit packet templates and shipped examples.
Review verdict: CONDITIONAL
