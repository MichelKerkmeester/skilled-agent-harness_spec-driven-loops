# Checkout probe

Measured 2026-10-24 on the Rule Canary Sync workflow, which checks out the repository and runs one small node script. The baseline is the checkout step on the five latest push runs (49, 50, 50, 51 and 51 s) and on the five latest pull request runs (49, 50, 51, 51 and 52 s). Both probes ran as test pull requests against main from a probe branch, so the pull request figures are the comparable ones. Each probe pull request was closed unmerged and its branch deleted.

Precondition (checked before the trial): `grep -c 'fetch-depth' .github/workflows/rule-canary-sync.yml` printed `0`, and the checkout step carried no `with:` block, so the full-depth default is what the trial replaces.

| Variant | Run | Checkout step s | Job conclusion |
|---|---|---:|---|
| baseline | 40123920512 and four earlier pull request runs | 52 (range 49 to 52) | success |
| blob:none | 40125935561 | 98 | success |
| sparse | 40126121698 | 3 | success |

`filter: blob:none` alone made the checkout slower, 98 s against about 50 s, and the likely cause (inferred, not measured) is that the checkout step still fetches every blob the working tree needs, one request at a time. The sparse variant adds a `sparse-checkout` list on top of that filter and checks out three paths, so almost no blob is fetched, and the canary's own step still printed `All clear — load-bearing rule wording is in sync.` on the narrowed tree.

Deviation from the task text: the sparse block in the task names `/AGENTS.md` and `/.skilled/skills/sk-code/`. The step runs the checker as `.opencode/skills/sk-code/...`, and `.opencode/skills` is a tracked symlink that those two patterns do not materialize, so the step would fail closed on the missing file. The probe therefore also listed `/.opencode/skills`, and that is the variant measured above. The block exactly as the task wrote it was not run.

verdict: sparse
