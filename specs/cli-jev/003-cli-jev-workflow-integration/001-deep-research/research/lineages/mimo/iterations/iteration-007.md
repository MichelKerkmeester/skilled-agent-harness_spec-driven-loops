# Iteration 7 — mimo-07: New commands and workflows the operator would actually use

**Lineage:** `mimo` (UX and measurement lens) — wave 3
**Session:** `fanout-mimo-1790438758756-5mso8j`
**Focus Area:** `mimo-07` — New commands and workflows the operator would actually use
**Angle question:** Which new command or workflow step removes a decision from the operator rather than adding one, and what is its default?

## Sibling check

Read both siblings' wave-3 surface files this iteration: `deepseek/iterations/iteration-007.md` (surface decision "none"; shared helper earned only at the third real caller) and `grok/iterations/iteration-007.md` (smell and second-hub-mode drop on alias-replay cost; pi-jev's egress announcement worth copying). Both lineages are complete at 10. I accept deepseek's no-new-surface conclusion and add the UX reason it did not give: a surface is only worth building here if it removes a decision, and no new command does. Grok's egress-announcement point becomes a design requirement on every surface below, not a surface itself.

## Grounding opened this iteration

- `.skilled/commands/` inventory (47 markdown commands: `deep/*`, `speckit/*`, `design/*`, `doctor/*`, `rewrite/*`, `goal-opencode.md`, `agent-router.md`).
- `claude-jev-main/commands/` (vendored): `jev-ask.md`, `jev-pick.md`, `jev-review.md`, `jev-why.md` — four slash commands wrapping the MCP tools (jev-material digest §4.1 attribution).
- `jev-cli-main/docs/recipes.md:1-50` (opened): PR-claims gate, web-fetch screen, ticket classify, backlog batch, search rerank — shell recipes with thresholds, not surfaces.
- Section 5 of the repo-rules digest (UX doctrine, in context) and the wave 1 and 2 keep lists of all three lineages.

## The UX test applied to every surface candidate

The doctrine (repo-rules-digest §5): a Jev integration serves UX when it removes a decision or a check from the operator, and hurts when it adds a flag, a prompt or a report to parse. Every candidate below is scored on the operator's before and after, not on the code's convenience.

## Per-idea records

### Idea 1: Confirm-mode stop suggestion (workflow step, not a command)

| Field | Record |
|---|---|
| **Idea** | In `/deep:research:confirm`'s existing per-iteration continuation decision, one added line: "no new cited finding in the last N iterations; stopping saves M", backed by the mimo-04 replay-calibrated signal. The operator still decides. |
| **Value** | Before: the operator answers a continuation question per iteration with only the iteration's prose. After: the question arrives pre-annotated with the loop's exhaustion evidence, so the easy "stop" answers take one glance. This removes decision effort from a question the operator already answers. |
| **Seam** | The deep-research command workflow's confirm step (workflow-owned; `.skilled/commands/deep/research.md` exists in the inventory, not opened this iteration). The signal's seam is mimo-04's replay output. |
| **Metric, baseline, harness** | Metric: suggestion precision (share of suggestions where stopping really lost zero first-appearance sources) and the operator's accept rate. Baseline: the confirm prompt carries no signal at all today. Harness: the mimo-04 replay. |
| **Cost, latency, privacy** | Zero calls: it reads a locally computed signal or a cached replay result. |
| **Opt-in and no key** | Default: the line does not exist. It appears only when a calibrated signal is present. No key or no calibration means today's prompt exactly. |
| **Complexity** | Tens of lines in the command workflow plus the signal source; the workflow is a frozen contract surface (PLAN-WORKFLOW LOCK family), so its owner approves before any edit. |
| **Verdict** | **next,** behind the mimo-04 replay number and its precision threshold. |
| **Confidence** | Inferred from the loop's mode contract; the confirm prompt's exact shape is not opened this iteration. |

### Idea 2: P0 reread order in review reports (workflow step)

| Field | Record |
|---|---|
| **Idea** | Order the post-replay P0 section of `review-report.md` by the mimo-05 survival flag. The recorded severities never change. |
| **Value** | Before: the operator rereads every P0 in registry order. After: the likely-real P0s come first and the operator can stop early. Removes a chunk of a mandatory pass, conditionally on mimo-05's thresholds (recall at least 0.9, reduction at least 30%). |
| **Seam** | The review report's registry section (completion-criteria.md:48, the 9-section contract; opened in mimo-05). |
| **Metric, baseline, harness** | As mimo-05, plus the share of runs where early stop would have been safe. |
| **Cost, latency, privacy** | One call per post-replay P0 in a live shape; offline replay reuses mimo-05's calls. Finding evidence leaves the machine (announced at first use per grok-07's pattern). |
| **Opt-in and no key** | Default: registry order, unchanged. |
| **Complexity** | A report-ordering change once mimo-05 exists; the report layout is reducer-owned, named-owner check first. |
| **Verdict** | **next,** strictly gated on mimo-05's thresholds. |
| **Confidence** | Inferred; unmeasured operator reading behavior. |

### Idea 3: Done-gate advisory noise suppression (refinement of an existing surface)

| Field | Record |
|---|---|
| **Idea** | Let the completion sentinel's claim detection use a measured Jev `noul` offline first; if the false-fire rate on words like `occurred` and `happened` (sentinel regex, mimo-06) is real, narrow the regex by measured evidence rather than adding a call. |
| **Value** | Before: the operator reads advisories on turns that were never claiming completion. After: fewer, truer advisories. Note the shape: the measured outcome may be a regex fix, not a Jev call at all. That is the cheapest move winning outright (reversal-cost order), and it would be a finding about the regex, bought with Jev measurements. |
| **Seam** | `.skilled/skills/system-spec-kit/runtime/lib/hooks/completion-evidence-sentinel.cjs:64` (opened in mimo-06). |
| **Metric, baseline, harness** | False-fire rate before and after, on the shared 30 to 50 excerpt set from mimo-06. |
| **Cost, latency, privacy** | Measurement only; no runtime cost either way. |
| **Opt-in and no key** | The sentinel's kill switch already exists; a regex fix is not a feature and needs no flag. |
| **Complexity** | A regex constant change plus tests if the measurement justifies it; the pattern is duplicated byte-identically in two files (`sentinel:60-63`, opened), so both copies change together. |
| **Verdict** | **next,** and it may close with zero Jev runtime code, which is the desired outcome of measurement-first work. |
| **Confidence** | Confirmed the regex words and the duplication; inferred the false-fire rate. |

### Idea 4: A `jev-judge` command or second hub mode

| Field | Record |
|---|---|
| **Idea** | A command or `cli-jev` mode that judgment scripts route through (claude-jev's four slash commands are the vendored precedent). |
| **Value** | Adds a routing surface and a command to learn. It removes no decision: nobody was blocked on "how do I call jev", and the transport docs already publish the spawn shapes (deepseek-07's finding, its citations). |
| **Seam** | `cli-jev/hub-router.json` (grok-07's citation: the bundle is unreachable on purpose). |
| **Metric, baseline, harness** | None; a surface with no decision attached has no metric. |
| **Cost, latency, privacy** | Alias-replay cost on every new mode (grok-07's point, fitness checklist Q13). |
| **Opt-in and no key** | N/A. |
| **Complexity** | Hub registry plus aliases plus replay fixtures. |
| **Verdict** | **drop.** Both sibling lenses drop it and the UX test independently fails it: it adds a surface, not a removal. Three lenses agreeing after cross-reading, not three independent votes. |
| **Confidence** | Confirmed from the hub file claim and the transport posture. |

### Idea 5: A measurement harness command family (`jev-probe`, arm runners)

| Field | Record |
|---|---|
| **Idea** | One command that runs the measurement arms (mimo-02 tie-break, mimo-04 replay, mimo-05 severity) and prints the comparison. |
| **Value** | For the maintainer it removes "how do I run four arms and compare", which is friction but not a decision. For the operator it adds a command to learn. The arms themselves are scripts with reports; deepseek-07's caller-count rule (helper only at caller three) applies to the shared spawn logic, not to a command. |
| **Seam** | Beside the routing-accuracy scripts (deepseek-07 named `score-jev-tiebreak.mjs` as slice 1's file). |
| **Metric, baseline, harness** | The arms' own metrics; the command adds none. |
| **Cost, latency, privacy** | The arms' costs plus one more surface to maintain. |
| **Opt-in and no key** | Each arm already skips cleanly with no key. |
| **Complexity** | A wrapper over scripts — the wrapper-that-only-forwards red flag (repo-rules-digest §4). |
| **Verdict** | **drop as a command.** The arms are the deliverable; if a shared spawn piece is later earned at the third caller (deepseek-07's 60 to 80 line reference client), it is a library, not a command. |
| **Confidence** | Judgment from the restraint rules; would change if the operator actually reports arm-running friction after slice 1. |

### Idea 6: PR-claims verification as a git workflow step (the recipes' first pattern)

| Field | Record |
|---|---|
| **Idea** | `jev verify` over the PR description's claims against the diff as a step before merge (recipes.md:5-11, opened). |
| **Value** | Before: the operator rereads the PR body against the diff (or trusts it). After: contradicted claims are flagged first. It removes a check — genuinely UX-positive in shape. But it inserts a billed, off-machine call into the git flow whose owner is `sk-git`, it has no gold in this repository, and a false flag on a merge step is the worst place for a noisy judge (a wrong block is operator-visible cost). |
| **Seam** | The sk-git PR flow (not opened; out of this packet's named seams entirely). |
| **Metric, baseline, harness** | No gold: no labeled PR-claims corpus exists here. |
| **Cost, latency, privacy** | Every PR body and the diff leave the machine. Egress at merge time is the highest-attention moment in the flow (blast-radius rule: sending is publishing). |
| **Opt-in and no key** | No key: the step must not gate; recipes use `--fail-on` exit-2 gates which are the npm `jevctl` shape, not the Python `jev-cli` this repository wraps (the naming-clash trap, jev-material digest §5). The recipe as written cannot even run against the pinned package. |
| **Complexity** | The recipe's command shape does not exist in the Python contract (`verify` is jevctl's subcommand); porting it is new work in another packet's flow. |
| **Verdict** | **later,** and only as an advisory flag-the-claims report, never a merge gate. It is the best "removes a check" shape outside the named seams but sits outside this packet's scope and has zero gold. |
| **Confidence** | Confirmed the naming clash from the digests; the recipe line numbers opened. |

## The shortlist: three surfaces with the operator's before and after

1. Confirm-mode stop suggestion: before, an unannotated continuation question every iteration; after, one evidence line on exhausted loops. Default: absent until the mimo-04 replay calibrates it.
2. P0 reread order: before, reread every P0; after, survival-ordered with early-stop option. Default: registry order until mimo-05's thresholds hold.
3. Done-gate advisory suppression: before, advisories on generic claim words; after, fewer, truer advisories, possibly by a measured regex fix with zero Jev runtime code. Default: today's regex.

## Report-only surfaces to reject (they add a report to read)

- The D4 grader's agreement row: build it as measurement (mimo-01), but do not sell it as UX. The operator decision it informs (keep or revise a reviewer prompt) is made rarely, and the row is read then and there. It passes the proof test and fails the removes-a-decision test; both facts belong in its record.
- Shadow lanes' JSONL (mimo-02, mimo-04 idea 3): collection is not a surface.
- The smell or second-hub-mode family: dropped above with grok-07.
- Any per-turn grade display (mimo-01 idea 3): the report nobody reads, on every turn.

## Hand-off

- At most three surfaces: the confirm-mode stop suggestion, the P0 reread order, the done-gate suppression. Each has its gate named: mimo-04 precision, mimo-05 thresholds, mimo-06's false-fire measurement.
- The ones that only add a report: the grader agreement row (kept as measurement), shadow logs, smell modes, per-turn grades.
- A cross-cutting design requirement from grok-07 worth keeping: any surface that calls Jev prints the egress announcement before its first call (pi-jev's README pattern, its citation), because the repo treats sending as publishing.
- For mimo-08: the proof plan per surface above is one to three checks each, and the done gate's proof plan must allow the outcome "regex fix, no Jev code" as a passing result of the measurement program.
