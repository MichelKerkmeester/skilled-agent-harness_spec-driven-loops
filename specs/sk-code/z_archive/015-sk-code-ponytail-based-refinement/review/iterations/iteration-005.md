# Review Iteration 5 — seat rv-5 (openai/gpt-5.5-fast, variant high)

- Dimension: cross-cutting-and-docs-accuracy
- Status: complete | exit=0 | duration=236s | P0=0 P1=1 P2=3 (pre-adversarial)
- Dispatch: cli-opencode opencode run, openai/gpt-5.5-fast --variant high (read-only)

## Seat output

Findings:

1. P1 `.opencode/skills/sk-code-review/SKILL.md:514` — `SK_CODE_REVIEW_DEPTH` is documented as an env/config/default-resolved session alias, but search found no non-doc code path reading it. The actual router still keys ON_DEMAND on explicit deep-dive keywords at `.opencode/skills/sk-code-review/SKILL.md:90` and `.opencode/skills/sk-code-review/SKILL.md:148`. Wire it into the dispatcher/router or reword it as advisory documentation only.

2. P2 `.opencode/skills/sk-code-review/changelog/v1.4.0.0.md:37` — changelog says `rule-canary-sync.yml` runs “on every push and pull request,” but the workflow only declares `pull_request` at `.github/workflows/rule-canary-sync.yml:2`. Add `push` or correct the release note.

3. P2 `.opencode/skills/sk-code-review/changelog/v1.4.0.0.md:41` — all three changelog “Files Changed” lists omit the README edits that are part of this packet scope: sk-code-review README additions at `.opencode/skills/sk-code-review/README.md:122` and `:188`, sk-code README additions at `.opencode/skills/sk-code/README.md:104` and `:178`, deep-improvement README addition at `.opencode/skills/deep-improvement/README.md:80`. Add README rows or explicitly define the list as excluding README/release-note edits.

4. P2 `.opencode/skills/deep-improvement/README.md:80` — “an agent edit cannot land with out-of-sync runtime copies” overclaims the gate. The pre-commit hook skips if Node or the checker is unavailable at `.opencode/hooks/pre-commit:48`, and the CI workflow only runs on PRs to main at `.github/workflows/agent-mirror-sync.yml:2`. Either fail closed or qualify the README/changelog language.

Notes:

- `node .opencode/skills/sk-code-review/scripts/check-rule-copies.js` exits 0.
- `python3 .opencode/skills/sk-code/assets/scripts/verify_stack_folders.py` exits 0.
- `node .opencode/skills/deep-improvement/scripts/check-agent-mirror-sync.cjs --all` exits 0.
- The canary does hard-code `v1.3.0.0` at `.opencode/skills/sk-code-review/scripts/check-rule-copies.js:51`; I did not count that alone as a finding because that historical changelog is the one carrying the exact `Review status: COMMENTED` copy, but it should be a conscious policy choice.

```json
{"seat":"rv-5","dimension":"cross-cutting-and-docs-accuracy","findings":[{"id":"F1","severity":"P1","title":"SK_CODE_REVIEW_DEPTH is documented as an operational env alias but is not wired","file":".opencode/skills/sk-code-review/SKILL.md","line":"514","evidence":"§9.3 says SK_CODE_REVIEW_DEPTH is resolved env > config > default and maps lite/full/ultra, but repository search found it only in docs/specs; ON_DEMAND routing remains explicit keyword-based at SKILL.md:90 and SKILL.md:148.","recommendation":"Either implement env/config resolution in the review dispatcher/router, or reword SKILL.md/README/changelog to say this is advisory prose only."},{"id":"F2","severity":"P2","title":"Rule canary changelog overstates CI trigger coverage","file":".opencode/skills/sk-code-review/changelog/v1.4.0.0.md","line":"37","evidence":"The changelog says rule-canary-sync.yml runs on every push and pull request, but .github/workflows/rule-canary-sync.yml:2 only declares pull_request.","recommendation":"Add a push trigger or correct the changelog to PR-only."},{"id":"F3","severity":"P2","title":"Changelog Files Changed sections omit packet README edits","file":".opencode/skills/sk-code-review/changelog/v1.4.0.0.md","line":"41","evidence":"The Files Changed lists omit README edits that are in scope and present at sk-code-review/README.md:122, sk-code-review/README.md:188, sk-code/README.md:104, sk-code/README.md:178, and deep-improvement/README.md:80.","recommendation":"Add README rows to the three changelog Files Changed sections or explicitly define the sections as excluding README/release-note edits."},{"id":"F4","severity":"P2","title":"Deep-improvement README overclaims mirror-sync as impossible to bypass","file":".opencode/skills/deep-improvement/README.md","line":"80","evidence":"README says an agent edit cannot land out of sync, but .opencode/hooks/pre-commit:48 skips when node/checker is unavailable and .github/workflows/agent-mirror-sync.yml:2 only covers pull requests to main.","recommendation":"Either make the gates fail closed and add push/direct-commit coverage, or qualify the README/changelog language to describe the actual best-effort/pre-commit-plus-PR coverage."}],"severityCounts":{"P0":0,"P1":1,"P2":3},"newInfoRatio":0.78}
```