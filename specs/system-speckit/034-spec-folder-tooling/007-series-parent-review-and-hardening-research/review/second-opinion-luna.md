# Second-Opinion Review (GPT-6 Luna)

## Verdict

**AGREE-WITH-CHANGE overall.** The reports identify the decision-point problem, but Recommendation 1 misses active menu copies, and Recommendation 6 overlooks a mismatch between the phase-parent template placeholders and the renderer’s substitutions. Review basis: `sk-code/sk-code-review` with `sk-code-opencode` surface evidence. SKILL ROUTING: User directed → sk-code.

## Recommendation-by-Recommendation

1. **AGREE-WITH-CHANGE** — The hook, Pi dialog, quick reference and plan/complete prompts need aligned wording, but active generic “related” choices also appear in `/speckit:implement`, the deep workflows and six `/create:*` prompts [SOURCE: `.skilled/commands/speckit/assets/speckit-implement.yaml:48-53`] [SOURCE: `.skilled/commands/deep/assets/deep-review-presentation.txt:182-185`] [SOURCE: `.skilled/commands/create/assets/create-command-presentation.txt:97-101`]. The core test compares output to the current constant and derives its byte count dynamically, so add explicit wording assertions rather than treating it as a stale text baseline [SOURCE: `.skilled/skills/system-spec-kit/runtime/tests/hooks/spec-gate-core.test.mjs:300-317,336`].

2. **AGREE** — The recipe’s `--phase` command creates three children by default, and `--parent` requires an existing folder path; specify the exact commands and how to replace the validation child [SOURCE: `.skilled/skills/system-spec-kit/references/structure/phase-definitions.md:78`] [SOURCE: `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:62,217-229,751-753`].

3. **AGREE-WITH-CHANGE** — The lister sees only direct numbered folders, drops a row if either metadata read fails and filters by scaffold creation time, so the proposed visibility and failure-path fixes are supported [SOURCE: `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1093-1109`]. Token overlap should rank candidates, not establish that they share an artifact; the series-parent rule requires the same artifact, same track and a different change [SOURCE: `.skilled/skills/system-spec-kit/references/structure/phase-definitions.md:70-74`].

4. **AGREE-WITH-CHANGE** — A read-only candidate list belongs before the folder decision because the current listing runs during branch-name resolution, immediately before folder creation [SOURCE: `.skilled/commands/speckit/assets/speckit-plan-presentation.txt:73`] [SOURCE: `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1123-1128,1285-1288`]. Keep the candidates advisory and require the agent to verify the same-artifact rule rather than auto-selecting from a score [SOURCE: `.skilled/skills/system-spec-kit/references/workflows/quick-reference.md:272-274`].

5. **AGREE-WITH-CHANGE** — The seeder silently returns if its one checked phrase is absent, while the template and judge define a four-phrase set [SOURCE: `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:395-402`] [SOURCE: `.skilled/skills/system-spec-kit/templates/core/spec.md.tmpl:16-20`] [SOURCE: `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/phrase-judge.mjs:25-30`]. Make deterministic full-block drift fail loudly, while preserving no-op behavior for already-personalized packets.

6. **AGREE-WITH-CHANGE** — The parent template contains `[Trigger phrase 1]` and `[Trigger phrase 2]`, but `create.sh` substitutes different `[YOUR_VALUE_HERE: ...]` strings, so the proposed render-time seed would not replace the current placeholders [SOURCE: `.skilled/skills/system-spec-kit/templates/packet-types/phase-parent.spec.md.tmpl:5-7`] [SOURCE: `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1363,1388-1389`]. Fix the literal mismatch and test the generated parent’s trigger phrases; the inline renderer only removes or retains gated lines [SOURCE: `.skilled/skills/system-spec-kit/runtime/cli/templates/inline-gate-renderer.ts:184-240`].

7. **AGREE-WITH-CHANGE** — Recording the artifact and closing condition supports a meaningful validator advisory, but keep the metadata addition optional unless consumers need it; the current strict schema has no artifact field [SOURCE: `.skilled/skills/system-spec-kit/references/structure/phase-definitions.md:76`] [SOURCE: `.skilled/skills/system-spec-kit/runtime/lib/graph/graph-metadata-schema.ts:130-151`]. Child-count health alone cannot identify a small catch-all parent [SOURCE: `.skilled/skills/system-spec-kit/runtime/lib/spec/is-phase-parent.ts:145-151`].

8. **AGREE-WITH-CHANGE** — The freshness step is explicitly report-only, so cadence needs a decision [SOURCE: `.github/workflows/advisory-checks.yml:54-68`]. Prefer a regeneration lane or generated-index check over turning the step into a blocking PR gate without accounting for the workflow’s current fail-open design.

9. **AGREE** — Start with a read-only census and keep any backfill operator-run and dry-run-first; the existing repair contract explicitly previews writes and leaves authored evidence alone [SOURCE: `.skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs:7-22`]. The residual migrator’s target-path checks exclude spec frontmatter, so it is a safeguard reference, not a ready-made spec backfill [SOURCE: `.skilled/skills/system-spec-kit/runtime/cli/continuity/migrate-trigger-phrase-residual.ts:195-216`].

10. **AGREE-WITH-CHANGE** — `--spec-folder` scopes results to that folder and descendants, which can help a bound session [SOURCE: `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs:107-110`]. Do not apply it to the first-write decision: Gate 1 runs before Gate 3, and self-scoping would hide the sibling packets needed to assess a series parent [SOURCE: `AGENTS.md:49-51,74-83`].

## Recommendation 1 Change Set

The exact option C wording is in the shared hook and the skill-advisor parity fixture. Other live prompts use shorter “Related” variants, so updating only copies of the exact literal would leave the same decision gap.

**Shared gate and rule reference**
- `.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs`
- `.skilled/skills/system-spec-kit/runtime/hooks/pi/spec-gate-enforce.ts`
- `.skilled/skills/system-spec-kit/references/workflows/quick-reference.md`

**SpecKit prompts**
- `.skilled/commands/speckit/assets/speckit-plan-presentation.txt`
- `.skilled/commands/speckit/assets/speckit-complete-presentation.txt`
- `.skilled/commands/speckit/assets/speckit-implement.yaml`

**Deep prompts and compiled contracts**
- `.skilled/commands/deep/assets/deep-review-presentation.txt`
- `.skilled/commands/deep/assets/deep-research-presentation.txt`
- `.skilled/commands/deep/assets/deep-ai-council-presentation.txt`
- `.skilled/commands/deep/assets/compiled/deep-review.contract.md`
- `.skilled/commands/deep/assets/compiled/deep-research.contract.md`
- `.skilled/commands/deep/assets/compiled/deep-ai-council.contract.md`

**Create-command prompts**
- `.skilled/commands/create/assets/create-command-presentation.txt`
- `.skilled/commands/create/assets/create-agent-presentation.txt`
- `.skilled/commands/create/assets/create-skill-presentation.txt`
- `.skilled/commands/create/assets/create-skill-parent-presentation.txt`
- `.skilled/commands/create/assets/create-manual-testing-playbook-presentation.txt`
- `.skilled/commands/create/assets/create-feature-catalog-presentation.txt`

**Tests and parity fixture**
- `.skilled/skills/system-spec-kit/runtime/tests/hooks/spec-gate-core.test.mjs` — add semantic assertions for the question and mutation notice; its existing byte checks follow the current constant.
- `.skilled/skills/system-spec-kit/runtime/tests/spec-gate-pi-extension.vitest.ts` — assert the dialog’s option labels.
- `.skilled/skills/system-skill-advisor/runtime/tests/parity/fixtures/policy-plan/baseline-contexts.json` — update the hard-coded question.

The research’s Recommendation 1 includes `quick-reference.md`, but its §13 handoff file list omits it [SOURCE: `specs/system-speckit/034-spec-folder-tooling/007-series-parent-review-and-hardening-research/research/research.md:30,366`]. For documentation parity beyond live prompts, also align `README.md`, `references/workflows/worked-examples.md` and `references/memory/trigger-config.md` [SOURCE: `README.md:479-482`] [SOURCE: `.skilled/skills/system-spec-kit/references/workflows/worked-examples.md:56-62`] [SOURCE: `.skilled/skills/system-spec-kit/references/memory/trigger-config.md:131-135`].

## Missed by Both Reports

1. **`/speckit:implement` has an active generic Gate 3 question.** Its `standard_question` allows a new folder without the “new or unrelated” restriction and leaves the related choice generic [SOURCE: `.skilled/commands/speckit/assets/speckit-implement.yaml:48-53`].

2. **Deep review, research and council each repeat the same weak choice.** Their prompts describe C as related work including a phase folder, and their compiled contracts repeat that wording [SOURCE: `.skilled/commands/deep/assets/deep-review-presentation.txt:182-185`] [SOURCE: `.skilled/commands/deep/assets/deep-research-presentation.txt:144-147`] [SOURCE: `.skilled/commands/deep/assets/deep-ai-council-presentation.txt:130-133`] [SOURCE: `.skilled/commands/deep/assets/compiled/deep-review.contract.md:333-336`].

3. **Six `/create:*` prompts also lack the series-parent qualifier.** They present a new-folder choice beside a generic related-folder choice, including for agent, command, skill, skill-parent, manual-testing and feature-catalog work [SOURCE: `.skilled/commands/create/assets/create-agent-presentation.txt:89-93`] [SOURCE: `.skilled/commands/create/assets/create-skill-parent-presentation.txt:88-92`].

4. **The instructional copies teach the same generic choice.** The README diagram, worked example and trigger-config example show “Related” without the series-parent rule or the new/unrelated restriction [SOURCE: `README.md:479-482`] [SOURCE: `.skilled/skills/system-spec-kit/references/workflows/worked-examples.md:56-62`] [SOURCE: `.skilled/skills/system-spec-kit/references/memory/trigger-config.md:131-135`].

5. **The proposed parent seeding path does not replace the current template placeholders.** The template’s bracketed phrases do not match the strings substituted by `create.sh`, and the gate renderer only filters inline gates, so generated parents can keep generic phrases that fail to surface the parent during retrieval [SOURCE: `.skilled/skills/system-spec-kit/templates/packet-types/phase-parent.spec.md.tmpl:5-7`] [SOURCE: `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1388-1389`] [SOURCE: `.skilled/skills/system-spec-kit/runtime/cli/templates/inline-gate-renderer.ts:184-240`].

## Sources Opened

**Gate wording and prompt copies**
- `AGENTS.md:49-51,74-83`; `.skilled/skills/system-spec-kit/references/workflows/quick-reference.md:263-274`
- `.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs:144-187,226-232`; `.skilled/skills/system-spec-kit/runtime/hooks/pi/spec-gate-enforce.ts:11-16,85`
- `.skilled/skills/system-spec-kit/runtime/tests/hooks/spec-gate-core.test.mjs:300-340`; `.skilled/skills/system-spec-kit/runtime/tests/spec-gate-pi-extension.vitest.ts:169-185`
- `.skilled/skills/system-skill-advisor/runtime/tests/parity/fixtures/policy-plan/baseline-contexts.json:1-6`
- `.skilled/commands/speckit/assets/speckit-plan-presentation.txt:73`; `.skilled/commands/speckit/assets/speckit-complete-presentation.txt:71`; `.skilled/commands/speckit/assets/speckit-implement.yaml:48-53`

**Other prompt copies**
- `.skilled/commands/deep/assets/deep-review-presentation.txt:182-185`; `.skilled/commands/deep/assets/deep-research-presentation.txt:144-147`; `.skilled/commands/deep/assets/deep-ai-council-presentation.txt:130-133`
- `.skilled/commands/deep/assets/compiled/deep-review.contract.md:333-336`; `.skilled/commands/deep/assets/compiled/deep-research.contract.md:301-304`; `.skilled/commands/deep/assets/compiled/deep-ai-council.contract.md:353-356`
- `.skilled/commands/create/assets/create-command-presentation.txt:97-101`; `.skilled/commands/create/assets/create-agent-presentation.txt:89-93`; `.skilled/commands/create/assets/create-skill-presentation.txt:86-90`
- `.skilled/commands/create/assets/create-skill-parent-presentation.txt:88-92`; `.skilled/commands/create/assets/create-manual-testing-playbook-presentation.txt:87-91`; `.skilled/commands/create/assets/create-feature-catalog-presentation.txt:87-91`
- `README.md:479-482`; `.skilled/skills/system-spec-kit/references/workflows/worked-examples.md:56-62`; `.skilled/skills/system-spec-kit/references/memory/trigger-config.md:131-135`

**Scaffolding, lister and index**
- `.skilled/skills/system-spec-kit/references/structure/phase-definitions.md:66-91`; `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:62,217-229,748-753`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:395-423,1076-1118,1363-1415,1606-1610`
- `.skilled/skills/system-spec-kit/templates/core/spec.md.tmpl:16-20`; `.skilled/skills/system-spec-kit/templates/packet-types/phase-parent.spec.md.tmpl:5-7`; `.skilled/skills/system-spec-kit/runtime/cli/templates/inline-gate-renderer.ts:184-240`
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/phrase-judge.mjs:25-30,121-136`; `.skilled/skills/system-spec-kit/runtime/cli/tests/create-track-refresh.vitest.ts:147-182`
- `.skilled/skills/system-spec-kit/runtime/lib/spec/is-phase-parent.ts:145-151`; `.skilled/skills/system-spec-kit/runtime/lib/graph/graph-metadata-schema.ts:130-151`

**CI, backfill and scoped lookup**
- `.github/workflows/advisory-checks.yml:54-68`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs:7-22`; `.skilled/skills/system-spec-kit/runtime/cli/continuity/migrate-trigger-phrase-residual.ts:195-216`
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs:107-110`; `.skilled/commands/speckit/assets/speckit-plan.yaml:79-80`; `.skilled/commands/speckit/plan.md:58-59`

Read-only review; no files changed.

Review status: COMMENTED
