# Iteration 011 — v4.0.0.15 / v4.0.0.14 drift verification for the CLI + deep-loop cluster

## Focus

Two unread releases in this cluster:

- **v4.0.0.15** (`bb9b9d1c09..22c3a9b2c7`) — 250 files in the scoped paths, 3346 insertions. Note headline claims that touch this cluster: typed `/deep:* :auto` now ranks the deep loop first, mode suffixes stop counting as prompt words, scaffolds lose filler sections, three add-on templates are removed while the research/review loops "still write their own resource maps, which never read the removed template".
- **v4.0.0.14** (`42b41dd286..bb9b9d1c09`) — 68 files, 1109 insertions. Note headline is in-session handover, per-runtime switches, goal/model carry-over, and a validator hang fix. Nothing in the note names the deep loop.

## Actions Taken

1. Scoped `git diff --stat` for v4.0.0.15 over the four cluster paths (path-limited, as required). Result: cli-opencode docs + `opencode-setup` adjacent material, `cli-pi` SKILL one-liner, 14 `manual-testing-playbook/fanout-stress/*.md` files, `manual-testing-playbook.md`, `cli-external-orchestration` `description.json`/`hub-router.json`/`mode-registry.json` one-liners, `deep-mode` compiled-routing doc, `system-deep-loop` runtime `executor-config.ts` +1, `fanout-run.cjs` +2, a new `fanout-root-resource-map.vitest.ts` (+74) and a `runtime/changelog/v1.9.10.0.md`.
2. Read the v4.0.0.15 note in full.
3. **Ran the note's own claim against the tree** (the highest-value check available in this focus):
   - `advisor_recommend '/deep:research :auto cli parity'` → `system-deep-loop` first, `confidence 0.8269`, `workflowMode: research`; `command-spec-kit` second at `0.821` — i.e. the "borrower never passes its owner" rule holds, and the top pick is the deep loop.
   - `advisor_recommend '/deep:review :auto fanout-run.cjs'` → `system-deep-loop` first, `confidence 0.8851`, `workflowMode: review`.
   - Both prompts resolved `:auto` as a mode suffix, not as a word. **Claim verified for this cluster.**
4. Checked the note's templating claim for dead references: `rg -n 'templates/(resource-map|before-after|roadmap)'` over the three cluster skill trees returns **nothing**, and `deep-research/references/state/state-outputs.md` still emits `{artifact_dir}/resource-map.md` from converged deltas, so the loops are self-sufficient as the note says. **No dead reference.**
5. Scoped `git diff --stat 42b41dd286..bb9b9d1c09` for v4.0.0.14 (68 files) and read the `fanout-run.cjs` (+57), `deep-review-config.json` (+1) and `prompt-pack-iteration.md.tmpl` (+1) hunks — the only deep-loop code in that release.
6. Traced the new `--review-focus` feature end to end: definition and normalization, argv parse, loop-type guard, prompt binding, native-command builder, YAML steps, presentation resolution table, config asset, prompt template. Then searched every changelog for the feature.

## Findings

**F1 — P1 — Drift (release note vs code vs docs): a whole operator-facing flag shipped with no release-note mention anywhere in the release line.**
v4.0.0.14 introduced `--review-focus` for the review loop: a bounded, control-character-collapsing operator focus that is restated in every iteration's leaf contract and carried in the native command. It is fully wired — parsed and normalized at `[SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3323]`, rejected outside the review loop at `[SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3325]`, injected into the leaf contract at `[SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1650]`, emitted as a setup binding at `[SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1700]`, and documented for the presentation layer at `[SOURCE: .skilled/commands/deep/assets/deep-review-presentation.txt:69]` and `[SOURCE: .skilled/commands/deep/assets/deep-review-auto.yaml:32]`. The v4.0.0.14 note (`Opt-In Handover That Keeps Your Goal and Model`) does not mention it, and a search across `.skilled/changelog/skilled/` and the skill's own changelog directories for `review.focus` returns **no file at all**. An operator upgrading cannot learn the flag exists, and an AI user reading only the note cannot know a new hard setup failure (over 1000 characters fails setup) was added.
Introduced: v4.0.0.14. Confidence: high.
Verify: `rg -ln -- 'review.focus' .skilled/changelog/skilled/ .skilled/skills/system-deep-loop/*/changelog/` → no output, versus `rg -c 'review_focus' .skilled/commands/deep/assets/deep-review-presentation.txt`.

**F2 — P1 — Bug: operator free text is interpolated into a shell command line *before* the sanitiser can run.**
The setup step is instructed to pass the **raw** focus (`This step runs before phase_init, so pass the raw review_focus` — `[SOURCE: .skilled/commands/deep/assets/deep-review-auto.yaml:208]`) and interpolates it inside double quotes in a shell command (`--review-focus "{review_focus}"` — `[SOURCE: .skilled/commands/deep/assets/deep-review-auto.yaml:231]`). The sanitiser that strips C0/C1 controls, U+2028/U+2029, collapses whitespace and enforces the 1000-character bound lives **inside the child process** (`[SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:161]`, `[SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:168]`), so it cannot protect the shell that composes the argv. A focus containing `"`, a backtick, `$(...)` or a newline breaks or injects into the composed command before `normalizeReviewFocus` is ever reached. The function's own docstring states the threat model it defends ("a control character would end that binding early and let the rest read as new instructions") — the same class one layer earlier, at the shell, is undefended.
Note the sanitiser is effective at its own layer: the `review_focus:` binding and the native `--review-focus=` JSON-quoted argument are both guarded. The gap is only the presentation→shell hop.
Introduced: v4.0.0.14. Confidence: high on the ordering (code read), medium on exploitability per runtime executor.
Verify: resolve setup with `--review-focus='x" $(id) ..'` on `/deep:review :auto` and inspect the composed fan-out command line before it executes; then confirm `normalizeReviewFocus` never sees the raw string.

**F3 — P2 — Over-engineering / drift seam: one normalization contract implemented twice, in two languages, with no test binding them together.**
The same rule (collapse control characters and whitespace runs to one space, empty result means absent, more than 1000 characters fails setup) is stated in the presentation resolution table (`[SOURCE: .skilled/commands/deep/assets/deep-review-presentation.txt:69]`), applied a second time in the YAML (`step_normalize_review_focus`, `[SOURCE: .skilled/commands/deep/assets/deep-review-auto.yaml:486]`), and implemented a third time in the runner (`[SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:161]`). What breaks if the runner copy is removed: nothing — the runner is the only layer that also protects the `review_focus:` binding and the native argv from control characters, so that copy must stay; the duplicated *presentation-layer* copy is the removable one, and today no test asserts that the two agree. Removing either without a shared source of truth is what re-opens the divergence.
Introduced: v4.0.0.14. Confidence: medium-high.
Verify: `rg -n 'review_focus|reviewFocus' .skilled/commands/deep/assets/deep-review-auto.yaml` and compare the bounds in each site against `normalizeReviewFocus`.

**F4 — P2 — Operator UX: the failure message names an internal field, not the flag the operator typed.**
`reviewFocus must be at most 1000 characters, got N` (`[SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:168]`) and `reviewFocus must be a text value` (`[SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:161]`) use the camelCase JSON-config field. An operator who typed `--review-focus` on the CLI has to translate. The same class of field-name defect was already recorded for the `if_cli_*` branch placeholders in this lineage; this is a second instance in a sibling surface.
Introduced: v4.0.0.14. Confidence: high.
Verify: `--review-focus="$(printf 'a%.0s' $(seq 1 1001))"` → the error text shown.

**F5 — P2 — Drift: the cluster's largest v4.0.0.15 change is not in the release note.**
Ten-plus `manual-testing-playbook/fanout-stress/*.md` cells were restructured from a flat four-heading snippet into a numbered scenario contract (`OVERVIEW`, `SCENARIO CONTRACT`, `TEST EXECUTION`) and their frontmatter version moved `1.4.0.2 → 1.4.1.0` (`[SOURCE: .skilled/skills/cli-external-orchestration/manual-testing-playbook/fanout-stress/auth-failure.md:9]`), with matching expansion of `manual-testing-playbook.md`. The v4.0.0.15 note is entirely about spec authoring, templates and the skill advisor; it names no playbook work. Either the release carried a second, unreported deliverable, or the playbook version line is drifting independently of the release line.
Introduced: v4.0.0.15. Confidence: medium (the note may legitimately omit non-headline work; the version bump is the hard evidence).
Verify: `git diff --stat bb9b9d1c09..22c3a9b2c7 -- .skilled/skills/cli-external-orchestration/manual-testing-playbook` and `rg -n 'version: ' .skilled/skills/cli-external-orchestration/manual-testing-playbook/fanout-stress/*.md | head`.

**F6 — P2 — UX/consumer ambiguity: the top recommendation for a typed `/deep:*` command carries a compiled route with no target.**
For both verified prompts, the first recommendation (`system-deep-loop`) returns `compiledRoute.action: "defer"`, `selectionKind: null`, `targets: []`, while `workflowMode` is `research` / `review` respectively. A consumer that trusts `compiledRoute` — which is what the field exists for — receives "defer" with nothing to defer *to*, and must fall back to `workflowMode` to learn anything. This is the same hub-resolution surface this lineage has been probing; whether `defer` is the documented outcome for a hub that selects by mode is **not yet read**, so this is reported as an ambiguity, not a defect.
Introduced: v4.0.0.15 (as observed). Confidence: medium — the output is exact, the intended semantics are unverified.
Verify: `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"/deep:research :auto cli parity"}' --format json` and read `recommendations[0].compiledRoute`; then check the hub-router contract's meaning of `defer`.

**Negative results recorded (so they are not re-run).**
- v4.0.0.15 advisor claim: **holds** for both typed prompts.
- Retired templates: **no dead reference** in the three cluster skill trees; the loops keep emitting their own `resource-map.md` (`[SOURCE: .skilled/skills/system-deep-loop/deep-research/references/state/state-outputs.md:140]`).
- `--review-focus` is **not** dead code: it is parsed, guard-railed, threaded through both prompt builders and the native command. The defect is documentation and shell-ordering (F1, F2), not wiring.

## Questions Answered

None ticked: this iteration spent its budget on the focus-area releases (v4.0.0.15 / v4.0.0.14) rather than on a strategy key question. The findings feed the still-open hub-canon and UX questions but do not close either.

## Questions Remaining

- **Executor failure handling** (v4.0.0.3, v4.0.0.16): what a single-executor run records for a devin `resource_exhausted` — deferred again; still unread after seven iterations.
- **Hub canon** (v4.0.1.0): `package_skill.py --strict` conformance across the hub and its seven modes remains unproven; F6 now adds a second, concrete hub-resolution question (what `defer` means).
- **Over-engineering**: `runtime-capabilities.json` plus the un-called `dispatchSeat` seam — blast radius unchecked.
- **UX**: two of the three `*-presentation.txt` assets are still unexamined; F2 and F4 are `deep-review-*` instances and the `deep-research-*` twin has not been compared against them.
- **Shell-hop class**: does the same raw-interpolation pattern exist in `deep-research-auto.yaml` and in the `if_cli_*` branches? F2 gives the search key (`"{...}"` inside a `--flag` in a YAML `command`/`run` step).
- **Drift method**: F1 and F5 both derive from "feature landed, note silent". A `git log --name-only` pass per tag, diffed against the note's headline list, would close that class for the whole release line in one action.

## Next Focus

1. Compare `deep-research-presentation.txt` / `deep-research-auto.yaml` against the F2 pattern: `rg -n -- '--[a-z-]+="\{' .skilled/commands/deep/assets/` — the twin of the shell-interpolation defect, and the cheapest close on the remaining UX question.
2. Read the hub-router contract for `action: "defer"` and settle F6 (feeds the open hub-canon question).
3. Then, at last, the executor-failure question — the only direction in this lineage deferred seven times.

## SCOPE VIOLATIONS

None. All reads; writes confined to this iteration's narrative and delta files plus the append gateway.
