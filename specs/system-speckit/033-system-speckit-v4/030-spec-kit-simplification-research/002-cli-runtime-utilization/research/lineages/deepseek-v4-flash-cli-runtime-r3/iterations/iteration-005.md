---
title: "Iteration 5: CI workflow push versus pull-request coverage"
trigger_phrases: []
---
# Iteration 5: CI workflow push versus pull-request coverage

## Focus

Read the trigger blocks of every file under `.github/workflows/` (15 workflows + README), build one table (workflow, runs on push, runs on pull request, path filter), then read `spec-kit-check.yml` in full and state which of its lanes never run on a direct push to the branch. A gate that only runs on pull requests while the repository's documented flow pushes directly is a finding.

## Trigger table

| Workflow | Push | Pull request | Path filter |
|---|---|---|---|
| advisory-checks.yml | main, skilled/** | any branch | none |
| agent-mirror-sync.yml | none | main | none |
| changed-packet-validation.yml | none | main | none |
| command-tree-parity.yml | main, skilled/** | main, skilled/** | none |
| comment-hygiene.yml | none | main | none |
| markdown-link-integrity.yml | none | main | .opencode/skills/**, commands/agents, .claude/*, .codex/* |
| naming-standard-guard.yml | skilled/v* only | any branch | none |
| playbook-operator-contract.yml | main | any branch | none (deliberate; comment at lines 3-6) |
| prompt-card-sync.yml | none | main | none |
| routing-registry-drift.yml | main, skilled/v* | none (no pull_request key) | workflow file + mode-registry/hub-router/advisor/doctor paths |
| rule-canary-sync.yml | none | main | none |
| runtime-no-spec-import.yml | main | main | workflow file + .opencode/bin/** |
| skill-doc-frontmatter.yml | none | main | .opencode/skills/**/references/**, assets/** |
| spec-kit-check.yml | **none** | main | .opencode/skills/system-spec-kit/** + itself |
| strict-pass-freshness-report.yml | none | none | — (workflow_dispatch + schedule only) |

**Documented direct-push flow (in-tree evidence):** `routing-registry-drift.yml:3-8` — "skilled/v* is included because release-line pushes land directly (no PR), and both live skill-metadata regressions to date arrived exactly that way." `command-tree-parity.yml` and `naming-standard-guard.yml` also run on push to main/skilled — i.e. the repository configures push-triggered gates for both main and skilled/* direct pushes as a normal event.

## spec-kit-check.yml in full (lines 1-93)

Trigger: `pull_request: branches: [main], paths: [.opencode/skills/system-spec-kit/**, .github/workflows/spec-kit-check.yml]` (lines 3-8). **No `push` key.** Two jobs:

- `check` (14-69): Setup Node; Install and build (root ci + shared tsc build + runtime build + cli build, 29-35); CLI check gate and typecheck (40-44); Shared package tests (46-47); CLI vitest project (49-53); Legacy module lanes and the bash validation suites (55-61, `test:legacy` + `test:validation`); Runtime vitest project (63-69).
- `mirrors` (71-93): Mirror parity checks — `sync-runtime-mirrors.cjs --check`, `sync-agents.cjs --check`, `sync-prompts.cjs --check`, `agent-roster-mirror-check.cjs`, `command-catalog-mirror-check.cjs` (86-93).

## Findings

| # | Severity | Claim side | Actual side | Verdict |
|---|----------|-----------|-------------|---------|
| F1 | P1 | Round-one census fix rows 10/12 record that spec-kit-check "runs the five checks" and the test gates, closing the "mirror drift is CI-invisible" and "nothing automated runs npm run check/vitest/typecheck" gaps; routing-registry-drift.yml:3-8 documents that release-line pushes land directly (no PR) | spec-kit-check.yml:3-8 has no `push` trigger — on a direct push to main or skilled/v* NONE of its lanes run: CLI check gate + typecheck (40-44), shared package tests (46-47), CLI vitest project (49-53), legacy module lanes + bash validation suites (55-61), runtime vitest project (63-69), and the mirror parity checks (86-93) are all PR-to-main-only, and the paths filter narrows even that to system-spec-kit/** | The gate the census presented as closing the coverage gap still never fires on the repository's own documented direct-push flow. Recommend: **fix** — add `push: branches: [main, 'skilled/**']` with the same paths filter (mirroring command-tree-parity.yml / routing-registry-drift.yml) |
| F2 | P2 | changed-packet-validation.yml (name: "Spec packets touched by this PR validate clean") runs on `pull_request: branches: [main]` only | No push trigger; controller workflow command-tree-parity and others run on push to main, so a direct push to main lands packet changes unvalidated by the packet-validation lane | Same class as F1 at smaller blast radius. Recommend: **fix** — add push (main, skilled/**), no paths (the lane is cheap and PR-only filters are already absent) |
| F3 | P2 | The PR-only set: of 15 workflows, 8 never run on any push (agent-mirror-sync, changed-packet-validation, comment-hygiene, markdown-link-integrity, prompt-card-sync, rule-canary-sync, skill-doc-frontmatter, spec-kit-check) | The repository's own comment (routing-registry-drift.yml:3-8) concedes direct pushes are a real path; naming-standard-guard, command-tree-parity, runtime-no-spec-import and playbook-operator-contract already run on push | The push/PR asymmetry is deliberate per-workflow in some cases (comment-hygiene has a local pre-commit twin; markdown-link-integrity runs on PRs because GH pages of links are PR-scoped), but the pattern as a whole is undocumented — no README states which gates are push-eligible. Recommend: **document** — a per-workflow rationale note (or align the guards where a local twin exists) |

## Verified Correct (no finding)

- `mirrors` job's parity checks are the on-demand doctor checks plus two extras (sync-agents, sync-prompts), matching the census's "runs the five checks" claim for content — the gap is the trigger, not the coverage.
- `paths` on spec-kit-check includes the workflow file itself, so a workflow edit re-triggers the gate (PRs only).
- runtime-no-spec-import.yml, routing-registry-drift.yml: path-filtered push+PR pairs are coherent (both events covered, each with the same paths).
- strict-pass-freshness-report.yml being schedule-only is coherent — it is a weekly report, not a gate.

## Questions Answered

- Which spec-kit-check lanes never run on a direct push? All of them: both jobs, all six steps — the workflow has no push trigger at all.
- Does any workflow document push-eligibility? Only routing-registry-drift.yml's comment names the direct-push reality; no README classifies the PR-only set.

## Open Questions

1. Is PR-only a deliberate choice for spec-kit-check (cost: full install + build + six suites per PR) or an oversight from the census fix? A `push` trigger on the same paths would double-run on PR merge — the recommend fix should keep `paths` to avoid running on unrelated pushes.
2. The `mirrors` job's commands (sync-runtime-mirrors.cjs, sync-agents.cjs, sync-prompts.cjs) are the runtime-mirror pair relevant to iteration 4's open question (how pi hooks are wired) — the mirror sync covers commands/prompts/agents, not `runtime/hooks/pi/`, so it does not relocate the pi hook modules. The pi loader question stays open.
