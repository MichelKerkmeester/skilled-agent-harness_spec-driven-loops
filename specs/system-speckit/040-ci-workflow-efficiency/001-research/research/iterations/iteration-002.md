# Iteration 002 — Triggers, path filters and the rebuild burst

## 1. FOCUS

Record the `on:` trigger and `paths:`/`paths-ignore:` filter of every workflow in `.github/workflows/`, then measure the Trigger Index Rebuild burst: which workflows run on a rebuild commit, what they cost, and which could skip it.

Read-only iteration. No workflow, script or action was edited. The only writes were this narrative, the delta file, and the append gateway.

## 2. ACTIONS TAKEN

1. Grouped the 1000 recorded runs in `scratch/ci-run-data/runs-last-1000.json` by `headSha`: **73 distinct commits** in the 23.5 h window.
2. Classified each commit by `displayTitle` — rebuild commits are those titled `chore(system-spec-kit): rebuild the trigger index` [SOURCE: .github/workflows/trigger-index-rebuild.yml:148].
3. Tallied which `workflowName` values appear against each rebuild `headSha`, and how many distinct workflows each commit started.
4. Read the `on:` block of all 33 workflows and recorded push branches, `paths:`/`paths-ignore:` filters and `pull_request` types.
5. Read `trigger-index-rebuild.yml` in full: the trailer loop guard [SOURCE: .github/workflows/trigger-index-rebuild.yml:33], the commit step's message [SOURCE: .github/workflows/trigger-index-rebuild.yml:148], and the push-step token [SOURCE: .github/workflows/trigger-index-rebuild.yml:274].
6. Grepped `^concurrency:` across all 33 workflows.
7. Priced each commit class as the sum of the per-run `medBilledMin` recorded for the workflows that fired on it [SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/summary.json:1], then scaled by commits/day.

## 3. FINDINGS

### F1 — 45% of commits are machine-generated rebuild commits (confirmed)

The 1000 runs resolve to **73 distinct `headSha` values**, of which **33 (45.2%) carry the rebuild title** [SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/runs-last-1000.json:1]. For every one of the 33, the set of workflows that started is identical and contains exactly **14 distinct workflows**. Ordinary commits averaged 13.52 workflows; rebuild commits are a flat 14.0 with zero variance — a signature of a machine-authored commit touching one fixed file set, not of human traffic.

This settles, in the opposite direction, iteration 001's F7 hypothesis that a path filter already excluded index-only commits. Nothing excludes them; the rebuild commit is simply a *first-class* participant in every push gate.

### F2 — The rebuild fan-out is half the bill (confirmed, arithmetic on recorded medians)

Summing the recorded per-run `medBilledMin` of the 14 workflows that fire on a rebuild commit gives **58.0 billed min per rebuild commit**, against **45.3 for an ordinary commit**. At 33 rebuild commits in 23.5 h that is 33 x 58.0 x (24/23.5) = **~1955 billed min/day — 51.4% of the 3812 min/day total**. Recomputing the complement (40 normal commits x 45.3 x 24/23.5 = ~1850) reproduces the recorded total to within 0.2%, so the split is internally consistent.

The reason a *generated* commit is the expensive one: it maximizes every gate's run count rather than triggering the cheapest subset. An ordinary commit fires 45.3 min because each path filter admits only its own subset; the rebuild touches `.skilled/skills/system-spec-kit/**`, `.skilled/**`, `.skilled/skills/**` and nothing else, which is the *union* of the expensive gates' inputs.

### F3 — `spec-kit-check` is triggered by the index it does not test (confirmed)

The generated index lives at `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json` — inside `.skilled/skills/system-spec-kit/**`, which is the first path in `spec-kit-check`'s push filter [SOURCE: .github/workflows/spec-kit-check.yml:8] (and its PR filter, [SOURCE: .github/workflows/spec-kit-check.yml:36]). So the repository's single most expensive workflow — 25 billed min and ~20 min wall-clock per run, 33.6% of the whole bill on its own — starts on every rebuild commit to re-run typechecking and a 776 s vitest project against a diff of four generated JSON files. That is **25.0 of the 58.0 min per rebuild commit, ~825 min/day, ~22% of the entire bill**, for work whose inputs did not change: the rebuild is a pure function of its parent, and `spec-kit-check` already ran on the parent.

### F4 — Nine workflows have no push path filter at all; eight prove the alternative works (confirmed)

Per-rebuild-commit cost decomposed against each workflow's trigger shape:

| Workflow | Push filter | Fires on rebuild commit | min/rebuild commit |
|---|---|---|---|
| Spec-Kit Check | paths incl. `.skilled/skills/system-spec-kit/**` | yes | 25.0 |
| sk-doc Script Tests | **none** [SOURCE: .github/workflows/sk-doc-script-tests.yml:8] | yes | 6.0 |
| Command Tree Parity | **none** [SOURCE: .github/workflows/command-tree-parity.yml:3] | yes | 4.0 |
| Hook Node Tests | `.skilled/**` [SOURCE: .github/workflows/hooks-node-tests.yml:15] | yes | 4.0 |
| Dispatch Enforcement Guard | **none** [SOURCE: .github/workflows/dispatch-enforcement-guard.yml:3] | yes | 4.0 |
| OpenCode Plugin Tests | `.skilled/**` [SOURCE: .github/workflows/opencode-plugin-tests.yml:15] | yes | 3.0 |
| Rule Canary Sync | **none** [SOURCE: .github/workflows/rule-canary-sync.yml:2] | yes | 2.0 |
| Message Contract | **none**, on every branch [SOURCE: .github/workflows/message-contract.yml:9] | yes | 2.0 |
| Playbook Operator Contract | **none, deliberate** [SOURCE: .github/workflows/playbook-operator-contract.yml:3] | yes | 2.0 |
| Changed Packet Validation | **none** [SOURCE: .github/workflows/changed-packet-validation.yml:3] | yes | 2.0 |
| Gate Inputs | **none** [SOURCE: .github/workflows/gate-inputs.yml:2] | yes | 2.0 |
| Markdown Link Integrity | `.skilled/skills/**` [SOURCE: .github/workflows/markdown-link-integrity.yml:8] | yes | 1.0 |
| Advisory Checks | **none** [SOURCE: .github/workflows/advisory-checks.yml:2] | yes | 1.0 |
| Trigger Index Rebuild | guarded by `if:` trailer [SOURCE: .github/workflows/trigger-index-rebuild.yml:33] | run yes, job skipped | 0.0 |

The nine unfiltered workflows account for **25.0 of the 58.0 min per rebuild commit** — but they also account for the same 25.0 of the 45.3 min on every *ordinary* commit, ~1800 min/day before any rebuild happens.

The contrast that proves the mechanism is already deployed: eight workflows that do carry a real path filter — OpenCode Dual-Version, Deep-Loop Runtime, Routing Registry Drift, Skill Doc Frontmatter, sk-doc Rename Harness, Runtime No-Spec-Import, sk-code Script Tests, Dependabot — recorded **zero** runs across all 33 rebuild commits. A filter that names the true inputs excludes a generated-output commit automatically. No new mechanism is needed; the nine simply have not got one.

### F5 — 32 of 33 workflows have no concurrency group (confirmed)

Only `trigger-index-rebuild` declares `concurrency:`, and it must set `cancel-in-progress: false` for correctness [SOURCE: .github/workflows/trigger-index-rebuild.yml:16]. Every other workflow lets a superseded push run to completion. With ~73 pushes/day the queue is dense enough that landed-but-superseded runs bill in full; this is the angle-5 lever and it is entirely unexercised.

### F6 — The token contradiction resolved (confirmed)

`README.md` states a push made with the default `GITHUB_TOKEN` starts no run [SOURCE: .github/workflows/README.md:58]. Yet 33 rebuild commits each started 14 runs. Resolution: the push step authenticates with `secrets.TRIGGER_INDEX_PUSH_TOKEN` and falls back to `github.token` [SOURCE: .github/workflows/trigger-index-rebuild.yml:274], so the documented sentence describes only the degraded fallback. Consequence for this iteration: the burst is real, and the `endsWith` trailer guard [SOURCE: .github/workflows/trigger-index-rebuild.yml:33] is load-bearing — it converts 33 would-be rebuild-of-a-rebuild runs into zero-cost skipped runs, but it does **not** suppress the other 13 workflows, which is precisely the gap.

### F7 — `message-contract` triggers on every branch (confirmed)

`branches: ['**']` [SOURCE: .github/workflows/message-contract.yml:9] rather than `[main, 'skilled/**']`. Defensible — every pushed commit's message should be checked, and the file says so in its header — but it means the gate fires on rebuild commits, whose message is machine-authored and template-conformant by construction.

### F8 — `playbook-operator-contract`'s missing filter is documented and should survive (confirmed)

Its header records why: "The contract validates cross-tree citations, so a rename far outside any playbook directory can break hundreds of scenarios. A filtered trigger would let that land green because no watched path changed." [SOURCE: .github/workflows/playbook-operator-contract.yml:3]. Any blanket "add path filters to the nine" recommendation must carve this one out explicitly or it will silently un-gate a check that was reasoned about before.

## 4. QUESTIONS ANSWERED

- **"Which triggers and path filters cause needless runs, including the run burst after each Trigger Index Rebuild commit?"** — answered. The burst is 33 rebuild commits per 73 commits (45.2%), each starting 14 workflows for 58.0 billed min, ~1955 min/day or 51.4% of the bill. `spec-kit-check` alone is 25.0 min of that because its filter matches the generated index file itself. Nine workflows contribute the other 25.0 min by having no push filter at all; eight workflows that do have filters recorded zero rebuild-commit runs, so the fix mechanism is already proven in-repo.

## 5. QUESTIONS REMAINING

Ten of eleven. Ordered by expected yield now that the trigger layer is measured:

1. **Duplicates and the `provision_worktree` + `bun install` cost** (reducer hint): three workflows each source `sk-git` `worktree-naming.sh` and provision a tree with bun; measure the per-run seconds and decide shared cache vs one provisioning job.
2. Caching: the `setup-node` steps in the sampled workflows show no `cache:` input; quantify npm and bun cache hit value.
3. Concurrency groups (F5): pick group keys and `cancel-in-progress` semantics per workflow class.
4. Timeouts: no workflow in the sampled set declared `timeout-minutes`.
5. Overengineering and advisory jobs that never gate.
6. Pinning hygiene, then the on/off control, `/doctor:ci` and `sk-code-ci` designs.

## 6. NEXT FOCUS

Duplicate work across workflows and the per-run cost of provisioning: read `opencode-dual-version.yml`, `opencode-plugin-tests.yml` and `hooks-node-tests.yml` end to end, extract the `provision_worktree` invocation and `bun install` steps, price them from the sampled job JSON where those runs are present in `scratch/ci-run-data/jobs/`, and state whether a shared cache, a single provisioning job with an uploaded artifact, or a committed prebuilt tree is the right shape.

## 7. METHOD NOTES AND CAVEATS

- Per-commit cost is the sum of each firing workflow's **overall** `medBilledMin`, not its medians restricted to rebuild commits. For `spec-kit-check` the approximation is tight in the direction that matters: 33 of its 50 runs in the window *are* rebuild runs, so its 25 min median is dominated by them.
- Billed minutes are `ceil(job seconds / 60)` summed per job, so a skipped job bills 0 — that is why the rebuild workflow's own 33 runs show 0.0.
- The 24/23.5 scaling assumes the two commit classes are stationary. A day with PR traffic adds the PR-triggered gates on top and would lower the rebuild share, not raise it.
- Confirmed: the 33/73 commit split, the 14-workflow fan-out, the 58.0 vs 45.3 split, every `on:` block cited, the absence of concurrency in 32 workflows, the eight zero-run filtered workflows. Inferred: that no rebuild commit's four generated files can change any gate's outcome (strong — the parent commit carried the same corpus and already ran the same gates, but it was not proven file by file).

## SCOPE VIOLATIONS

None. This iteration wrote only to its two allowed artifacts and the append gateway.
