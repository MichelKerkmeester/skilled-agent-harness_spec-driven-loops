---
title: Trigger and Filter Rules
description: The twin rule for path filters, the rule that keeps a rebuild commit from starting the downstream workflows, push-only scope for generated-path filters and the table of intentional trigger exceptions.
trigger_phrases:
  - "workflow path filters"
  - "workflow trigger rules"
  - "twin path filter rule"
  - "intentional trigger exception"
importance_tier: normal
contextType: general
version: 1.1.0.0
---

# Trigger and Filter Rules

Which events start a workflow, which paths it ignores and which triggers only look like drift.

---

## 1. OVERVIEW

Four topics sit here: the twin rule for path filters, the rule that stops a rebuild commit from starting the downstream workflows, the push-only scope of generated-path filters and the table of intentional trigger exceptions. A review reads the exceptions table before it flags a trigger as drift.

Each rule is universal. The values it applies to, the twin roots, the integration branches and the rebuild trailer, come from the repository CI profile described in `references/protected-set.md`. A line marked Skilled example shows this repository's value and holds nowhere else.


---

## 2. THE TWIN RULE

When the profile lists `pathTwins`, every path filter, hook input and dependabot entry that names one root of a pair must name its twin, in the same filter group. A repository whose profile lists no pair has no twin rule.

Skilled example: the profile pairs `.skilled/` with `.opencode/`, so a `.skilled/` entry needs the matching `.opencode/` entry and the reverse. The gate-input check enforces this here, so a filter that names one root fails with a `filter-twins` verdict.

Skilled example: four generated paths times two source roots make **8 entries**. A filter that ignores the four trigger-index outputs therefore lists eight lines, never four.

A twin is **inert** where its tree is absent. The rule still requires it, because a check reads the filter and not the disk. Skilled example: `repo-rules-corpus.yml` names `.opencode/repo-rules/**` next to `.skilled/repo-rules/**` and says why in a comment.

Evidence (Skilled example):

- Skilled example: `.github/scripts/check-gate-inputs.sh:112-124` holds the twin matcher. `function twin` at `:116` swaps `.opencode` for `.skilled` and the reverse.
- `.github/scripts/check-gate-inputs.sh:339` fails a pathspec that has no twin with `twin-one`. The same verdict repeats at `:423` for path filters and `:478` for directories.
- `.github/scripts/check-gate-inputs.sh:372-375` recognises the `paths:` and `paths-ignore:` keys, in block and inline form.
- Skilled example: `.github/workflows/repo-rules-corpus.yml:9-12` records the inert `.opencode/repo-rules/**` twin, and `:21-24` repeats it for the `push:` filter.

---

## 3. REBUILD COMMITS

The trigger-index rebuild workflow commits four generated files to the branch it ran on. No downstream workflow reads them as an input, so every other workflow that answers to a push would run for nothing.

**The rule.** A rebuild commit carries `[skip ci]` in its message body. GitHub then starts no push-triggered or pull-request-triggered workflow for that commit, and the downstream workflows stay quiet without a single filter edit. The commit also ends with a trailer the profile names as `rebuildTrailer`, so the report can skip it when it looks for the newest commit worth reading.

Evidence (Skilled example):

- `.github/workflows/trigger-index-rebuild.yml:78-84` holds the list of the four generated paths the commit stages.
- `.github/workflows/trigger-index-rebuild.yml:152` holds the commit body line that ends in `[skip ci]`.
- `.github/workflows/trigger-index-rebuild.yml:33` guards the rebuild job itself with the `Trigger-Index-Rebuild: ci` trailer, so a run GitHub creates anyway does not rebuild a rebuild.

**The alternative.** A push-only `paths-ignore` that lists the eight twin entries on each downstream workflow does the same job, at the price of 104 twin-matched entries across 13 files and an amended ordering rule. Use it only if the skip token proves unreliable.

**What it saves.** Skipping the downstream workflows on the four generated paths saves about 2,073 runner-min/day, roughly 54% of the repository's daily total. The push-only filter form saves about 2,002 runner-min/day when `message-contract.yml` is left unfiltered.

**Reading statuses.** A skipped rebuild commit leaves no runs on the branch tip. Any tool that reads statuses on the tip must resolve the newest commit that is not a rebuild commit.

---

## 4. PUSH-ONLY SCOPE

A rule that ignores generated paths is push-only.

The rebuild workflow triggers on `push` alone (`.github/workflows/trigger-index-rebuild.yml:6-9`) and has no `pull_request:` event, so a generated-path commit only ever arrives through a push. A `pull_request:` ignore for the same paths would add nothing, and where the workflow supplies a required status check it would leave that check **Pending**, because GitHub reports a path-filtered required workflow as pending rather than passed.

When a workflow already lists `paths:` for an event, GitHub refuses `paths-ignore:` on the same event. Add `!` negations inside the `paths:` list instead, and keep both roots in each negation.

---

## 5. INTENTIONAL EXCEPTIONS

A trigger that departs from the norm for a reason is recorded here so a review or a report reads it as intentional and not as drift. The norm is that a push-triggered workflow answers to pushes on the profile's `integrationBranches` only. Skilled example: those are `main` and `skilled/**`. Each row carries the label `intentional-exception`, and every row below is a Skilled example.

| Label | Workflow | Trigger | Norm departed from | Why | Evidence |
|---|---|---|---|---|---|
| intentional-exception | `message-contract.yml` | `push` on `branches: ['**']` | Push to `main` and `skilled/**` only (Skilled example) | Every pushed branch's name and commits are checked, because a local hook can be skipped on any branch. The workflow also holds the only required status context in the branch ruleset | `.github/workflows/message-contract.yml:9`, the comment at `.github/workflows/message-contract.yml:2-6` and the row at `.github/workflows/README.md:72` |

No YAML change is made for this row. The workflow file is correct as written. A report route reads this row before it flags the trigger, so the every-branch push is never reported as drift.

If `branches: ['**']` or the comment block disappears from the workflow, the row is stale. Remove it, or re-record the new trigger with its own reason.
