# Iteration 002 - Security

## State Summary

- Iteration: 2 of 7
- Focus dimension: security
- Active findings entering iteration: P0:0 P1:1 P2:1
- Files reviewed:
  - `.opencode/skills/sk-code/scripts/check-comment-hygiene.sh`
  - `.opencode/hooks/pre-commit`
  - `.github/workflows/comment-hygiene.yml`
  - `.opencode/skills/system-spec-kit/constitutional/comment-hygiene.md`
  - `.opencode/skills/system-spec-kit/constitutional/main-branch-direct-push.md`
  - `.opencode/skills/system-spec-kit/constitutional/memory-system-spec-kit-only.md`
  - `.opencode/skills/system-spec-kit/constitutional/memory-db-file-topology.md`
  - `.opencode/skills/sk-code/assets/opencode/recipes/spec_folder_write.md`

## Findings

### F003 - P1 - Allowed durable references bypass all forbidden-pattern checks on the same comment line

`check-comment-hygiene.sh` checks allowed durable-reference patterns before checking forbidden patterns, and if any allowed pattern matches it skips the whole line. The allowed set includes CWE, RFC, POSIX, HTTP status, platform tags and schema tags. Because the violation scan never runs after an allowed match, a comment line containing both a durable reference and a forbidden ephemeral pointer is accepted. This undermines the comment-hygiene gate described by the constitutional rule and used by the pre-commit and PR gates.

Evidence:

- [SOURCE: .opencode/skills/sk-code/scripts/check-comment-hygiene.sh:70] introduces allowed-class patterns that suppress violation detection.
- [SOURCE: .opencode/skills/sk-code/scripts/check-comment-hygiene.sh:72] starts the allowed-pattern list.
- [SOURCE: .opencode/skills/sk-code/scripts/check-comment-hygiene.sh:80] includes schema tags in that allowed list.
- [SOURCE: .opencode/skills/sk-code/scripts/check-comment-hygiene.sh:112] checks allowed-class patterns before forbidden patterns.
- [SOURCE: .opencode/skills/sk-code/scripts/check-comment-hygiene.sh:113] matches any allowed pattern.
- [SOURCE: .opencode/skills/sk-code/scripts/check-comment-hygiene.sh:114] continues to the next line, skipping the violation-pattern loop.
- [SOURCE: .opencode/skills/sk-code/scripts/check-comment-hygiene.sh:116] starts the forbidden-pattern check only after the allowed-pattern skip.
- [SOURCE: .opencode/hooks/pre-commit:21] invokes this checker for staged files.
- [SOURCE: .github/workflows/comment-hygiene.yml:27] invokes this checker for PR-changed files.

Concrete fix: do not treat allowed patterns as a whole-line exemption. Instead, remove allowed substrings before scanning, or scan forbidden patterns first and only suppress exact allowed-token matches.

Claim adjudication:

```json
{
  "findingId": "F003",
  "claim": "A comment line containing both an allowed durable reference and a forbidden ephemeral pointer bypasses comment-hygiene enforcement because the checker skips the line after the allowed-pattern match.",
  "evidenceRefs": [
    ".opencode/skills/sk-code/scripts/check-comment-hygiene.sh:70",
    ".opencode/skills/sk-code/scripts/check-comment-hygiene.sh:112",
    ".opencode/skills/sk-code/scripts/check-comment-hygiene.sh:114",
    ".opencode/skills/sk-code/scripts/check-comment-hygiene.sh:116",
    ".opencode/hooks/pre-commit:21",
    ".github/workflows/comment-hygiene.yml:27"
  ],
  "counterevidenceSought": "Checked the checker control flow, the pre-commit hook, and the PR workflow to see whether a later gate rescans forbidden patterns.",
  "alternativeExplanation": "The skip may have been intended to avoid false positives for stable standards, but the implementation exempts the entire line rather than only the matched durable token.",
  "finalSeverity": "P1",
  "confidence": 0.9,
  "downgradeTrigger": "Downgrade if a later gate is added that scans mixed allowed/forbidden comment lines, or if policy explicitly allows mixed durable and ephemeral references on one line.",
  "transitions": []
}
```

## Adversarial Self-Check

No P0 findings were reported. The P1 was kept because the bypass is in the control flow itself: `continue` skips the violation loop. The counterargument that allowed standards should suppress false positives only supports token-level suppression, not whole-line suppression.

## Iteration Metrics

| Metric | Value |
|---|---:|
| New P0 | 0 |
| New P1 | 1 |
| New P2 | 0 |
| Severity-weighted new findings | 5 |
| newFindingsRatio | 0.45 |

Review verdict: CONDITIONAL
