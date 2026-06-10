---
title: "Main Branch — Owner's AIs Push Directly"
importanceTier: constitutional
contextType: decision
last_confirmed: "2026-05-31"
last_confirmed_source: "git-log-last-touch"
triggerPhrases:
  - push to main
  - commit to main
  - branch protection
  - pull request
  - PR required
  - verified signatures
  - direct push
  - bypass protection
---

# Main Branch — Owner's AIs Push Directly

## Rule

When the owner asks to commit/push, do a **direct `git push origin main`**. Do NOT default to a feature-branch + PR flow, do NOT re-ask whether to use a PR, and do NOT flag the bypass or the unsigned commit as a concern — all of that is expected and authorized.

## Why

The `main` branch (`MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration`) has GitHub protection (PR required, verified signatures, code scanning). The owner's account bypasses these — a direct push succeeds with a "Bypassed rule violations" notice; the commit is unsigned and flagged. The owner clarified (2026-05-27) that **these rules gate external contributors, and any AI working under the owner's command is authorized to bypass them.** Treating the bypass as a blocker is unwanted friction. This overrides sk-git's generic "never commit to protected branches" rule for this repo + owner.

## How to apply

1. Direct `git push origin main` is the expected, authorized path.
2. Still apply normal commit hygiene: scope the commit to intended files only (the tree often has concurrent parallel-session work + daemon metadata churn — NEVER `git add -A` blindly; use explicit pathspecs and prefer atomic `git commit -F - -- <paths>`).
3. Use Conventional Commit messages; report what landed (verify `local HEAD == origin/main`).
4. Only raise commit-signing if the owner specifically asks for verified signatures (needs local signing config).
