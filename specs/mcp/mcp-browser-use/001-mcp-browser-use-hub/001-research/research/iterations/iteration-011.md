# Iteration 11: Outside-hub blast radius (operator inbox question 9)

## Focus

Resolve the operator's queued blast-radius question: list every file **outside** `.skilled/skills/mcp-tooling` that names `mcp-chrome-devtools` or `mcp-aside-devtools` (excluding changelog and benchmark/reports) and classify each as **rewrite path**, **rewrite mode name**, or **historical, leave**. This is a tighter scope than KQ4 (iteration 4), which classified the whole repository into hand-edit / regenerate / leave-as-history. The narrow interpretation taken here: "outside mcp-tooling" is literal, so sibling packets that live *under* mcp-tooling are excluded; "names them" means a literal occurrence of either mode id; changelog and benchmark/reports are excluded by the question. Exhausted approaches were checked first — none applies (no Bladebro facts needed, no upstream fetch, no install): the two directions blocked since iteration 1 (broad Bladebro web search, live `bladebro` probes) are irrelevant to a local file inventory. All research was local and read-only; no sub-agent was dispatched.

## Actions Taken

1. Read the four state files (config, state JSONL, strategy, findings registry); derived iteration 11 from the 10 prior `iteration` records plus the resume event, confirmed `iteration-011.md` and `iter-011.jsonl` were absent, and read `lineage.sessionId = 2026-11-21T08:29:48.000Z` from config for the gateway record.
2. Read the KQ4 classification in `iteration-004.md` to reuse its cluster inventory instead of re-deriving it.
3. `rg -l --hidden` over the whole repository excluding mcp-tooling to get the complete outside-hub file list, then a second pass excluding `specs/`, changelog, benchmark and reports to isolate live files.
4. `rg -n` on the live set to capture each reference's exact form (path string vs bare mode id) and classify it.
5. Targeted probes of the two ambiguous surfaces — the compiled-routing canary fixture and the system-spec-kit trigger index / observability report — to confirm mode-name vs path vs generated classification.

## Findings

1. **The literal outside-hub scope excludes six sibling packets that KQ4 grouped as an "outside cluster."** `mcp-click-up`, `mcp-figma`, `mcp-mobbin`, `mcp-notion`, `mcp-obsidian` and `mcp-refero` all live at `.skilled/skills/mcp-tooling/<name>/` — the paths in iteration 4 already show this [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/research/iterations/iteration-004.md:27]. Under this question's literal "outside mcp-tooling" wording they are **inside** and drop out of scope. KQ4's cluster list remains correct for KQ4; this question is a strict subset of it. [INFERENCE: path-prefix comparison of the iteration-4 source list against the question's scope boundary.]

2. **Rewrite-path class — live files whose reference is a filesystem path containing `mcp-tooling/mcp-(chrome|aside)-devtools`.** These must be re-pointed to the new hub root on relocation: the doctor mutation-class guard hardcodes both `skill_dir` values [SOURCE: .skilled/commands/doctor/assets/mcp-mutation-class-manifest.yaml:45] [SOURCE: .skilled/commands/doctor/assets/mcp-mutation-class-manifest.yaml:61]; the installer test joins the path [SOURCE: .skilled/bin/tests/mcp-installers.test.cjs:29]; the fail-closed playbook allowlist lists both packet playbook directories [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/playbook-failclosed-allowlist.txt:25] [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/playbook-failclosed-allowlist.txt:26]; the mcp-code-mode `_utils.sh` byte-identical coupling and its two playbook catalog rows name the Chrome packet path [SOURCE: .skilled/skills/mcp-code-mode/scripts/README.md:70] [SOURCE: .skilled/skills/mcp-code-mode/manual-testing-playbook/clickup-and-chrome-via-cm/sibling-pair-handover.md:94] [SOURCE: .skilled/skills/mcp-code-mode/manual-testing-playbook/clickup-and-chrome-via-cm/chrome-navigate-screenshot.md:93]; sk-code and sk-doc cross-references use relative links into the packet [SOURCE: .skilled/skills/sk-code/sk-code-frontend/references/figma-to-code.md:187] [SOURCE: .skilled/skills/sk-doc/scripts/tests/render/web-markup-and-css.md:184]; and the generated corpus manifest carries the paths as data [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/corpus-manifest.json:2718].

3. **Rewrite-mode-name class — live files whose reference is a bare mode id used as a routing key, label or ownership owner, with no path.** The seven `cli-orca` files encode the two ids as foreign owners and vocabulary values [SOURCE: .skilled/skills/cli-orca/ROUTER.md:26] [SOURCE: .skilled/skills/cli-orca/ROUTER.md:103] [SOURCE: .skilled/skills/cli-orca/references/mutation-and-browser-boundaries.md:83] [SOURCE: .skilled/skills/cli-orca/SKILL.md:237] [SOURCE: .skilled/skills/cli-orca/README.md:154]; the skills index names them as members [SOURCE: .skilled/skills/README.txt:53]; the canary routing fixture uses them as expected route ids [SOURCE: .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/003-mcp-tooling/fixtures/canary-cases.v1.json:86]; the advisor golden and labeled fixtures use them as expected route labels [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/fixtures/gate2-golden-prompts.jsonl:6]; and mcp-code-mode's prose uses the bare id as the example consumer [SOURCE: .skilled/skills/mcp-code-mode/SKILL.md:318] [SOURCE: .skilled/skills/mcp-code-mode/graph-metadata.json:21].

4. **KQ5 makes the rewrite-mode-name class a near no-op; path rewrites dominate.** Naming decision KQ5 kept the `mcp-` prefix and set folder == `workflowMode` == `packetSkillName` for each mode, so literal mode ids stay valid and only the `mcp-tooling/` path component moves [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/research/research.md:117]. Therefore every "rewrite mode name" file above needs no id change under the current decision; its real action is a no-op (or, for path-bearing files, the path rewrite in finding 2). Rewriting a mode name would only be needed if the operator reverses KQ5. [INFERENCE: applying the KQ5 consequence in research.md to the reference-form split in findings 2 and 3.]

5. **Generated / regenerate surfaces are a third, non-hand-edit outcome inside the path and name classes.** The system-spec-kit trigger index carries packet paths as generated data [SOURCE: .skilled/skills/system-spec-kit/runtime/data/trigger-index.json:696], and the observability measurement report declares itself generated (`Generated: 2026-05-03…`) [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/observability/smart-router-measurement-report.md:3]. The sk-doc test fixtures (`durable-directory-manifest.json`, `baseline-readme-verdicts.json`) and `cite-drift-redirects.json` are path-bearing snapshots [SOURCE: .skilled/skills/sk-doc/scripts/tests/code-folder/durable-directory-manifest.json:403] [SOURCE: .skilled/skills/sk-doc/scripts/tests/code-folder/baseline-readme-verdicts.json:4091] [SOURCE: .skilled/skills/sk-doc/shared/scripts/cite-drift-redirects.json:205]. These should be regenerated by their canonical commands rather than hand-edited — the same rule KQ4 applied to `leaf-manifest.json` [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/research/iterations/iteration-004.md:19].

6. **Historical, leave is the largest class by file count and is exactly the set the question's exclusions target.** Every `specs/**` hit is a point-in-time record — prior research iterations, scratch baselines, review seats, changelog digests and archived plans — and the question additionally excludes `changelog/**` and `benchmark/reports/**`. Moving the modes does not retroactively change what those records observed, which is why the raw repository `rg -l` overstates the work by an order of magnitude. [INFERENCE: path-shape classification confirmed by representative hits such as `specs/.../011-mcp-chrome-devtools/spec.md` and `specs/.../changelog-000-009-011-mcp-chrome-devtools.md` in the repository-wide `rg -l` output.]

7. **The doctor mutation-class guard is the single highest-risk path rewrite.** A stale `skill_dir` silently drops mutation-class coverage — the exact defect an earlier doctor audit recorded — so its two `skill_dir` values must be re-pointed and its test re-run before any relocation is called complete [SOURCE: .skilled/commands/doctor/assets/mcp-mutation-class-manifest.yaml:43] [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/research/iterations/iteration-004.md:27].

8. **Q10 (Lighthouse) remains open; this iteration did not re-enter it.** The iteration-1 contradiction still stands: the hub router advertises Lighthouse as Chrome DevTools intent while the feature catalog has no dedicated Lighthouse feature, and `cli-orca` still lists Lighthouse as a Chrome-owned capability [SOURCE: .skilled/skills/cli-orca/SKILL.md:53] [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/research/research.md:49]. Settling it from the chrome-devtools-mcp / bdg upstream docs is the recommended next focus.

## Questions Answered

- **List every file outside .skilled/skills/mcp-tooling that names mcp-chrome-devtools or mcp-aside-devtools (rg -l, excluding changelog and benchmark/reports), and classify each: rewrite path / rewrite mode name / historical, leave.** — Answered, as three classes with the KQ5 no-op correction:
  - **Rewrite path (live, hand-edit or regenerate):** doctor mutation-class manifest, mcp-installers test, playbook fail-closed allowlist, mcp-code-mode `_utils.sh` README + two playbook catalog rows, sk-code/sk-doc relative cross-references, generated corpus manifest / trigger index / sk-doc test fixtures / cite-drift-redirects.
  - **Rewrite mode name (bare ids):** seven cli-orca docs, skills index `README.txt`, compiled-routing canary fixture, system-skill-advisor golden/labeled fixtures, mcp-code-mode `SKILL.md`/`graph-metadata.json`. Under KQ5 the ids are unchanged, so these are effectively no-ops; only the path-bearing ones above need edits.
  - **Historical, leave:** all `specs/**` research/scratch/review/archive hits, plus the changelog and benchmark/reports files excluded by the question.
  - **Out of scope by literal boundary:** the six sibling packets under mcp-tooling that KQ4 called an "outside cluster."

## Questions Remaining

- Does the Chrome DevTools mode really offer Lighthouse? Its hub router lists it but its feature catalog has no entry; settle it from the files and the chrome-devtools-mcp / bdg upstream docs (operator inbox question 10, iteration 12 candidate).
- Phase 003 still owns the exact whole-repository per-file edit list; this iteration tightened the outside-hub subset only.

## Edge Cases

- **Ambiguous input:** "outside mcp-tooling" has a strict path-prefix reading and a looser "outside the two mode packets" reading (KQ4's). The strict reading was chosen and the alternative recorded in finding 1.
- **Contradictory evidence:** none; the raw repository list and the scoped list agree, and the difference is scope plus classification. KQ4's "outside cluster" label for the six sibling packets is reconciled, not contradicted — different boundary.
- **Missing dependencies:** none; the question needed only local files.
- **Partial success:** none; all planned searches returned and all findings are cited.

## Ruled Out

- Re-running KQ4's whole-repository inventory: rejected because the question is a strict subset and iteration 4 already holds the cluster inventory; only the outside-hub form split was new.
- Treating bare mode-id occurrences as path rewrites: rejected after line-level inspection showed cli-orca and advisor fixtures use ids as route labels, not paths, and KQ5 keeps the ids stable.

## Dead Ends

- No new dead end. Candidates for reducer promotion: none; the two ruled-out items are scope/classification choices specific to this question, not exhausted research directions.

## Sources Consulted

- `.skilled/commands/doctor/assets/mcp-mutation-class-manifest.yaml`, `.skilled/bin/tests/mcp-installers.test.cjs`
- `.skilled/skills/cli-orca/{SKILL.md,README.md,ROUTER.md,references/mutation-and-browser-boundaries.md}`
- `.skilled/skills/mcp-code-mode/{SKILL.md,graph-metadata.json,scripts/README.md,manual-testing-playbook/clickup-and-chrome-via-cm/*.md}`
- `.skilled/skills/README.txt`, `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/003-mcp-tooling/fixtures/canary-cases.v1.json`
- `.skilled/skills/system-skill-advisor/runtime/scripts/fixtures/gate2-golden-prompts.jsonl`
- `.skilled/skills/system-spec-kit/runtime/{data/trigger-index.json,cli/retrieval/fixtures/corpus-manifest.json,cli/observability/smart-router-measurement-report.md}`
- `.skilled/skills/sk-doc/{sk-create-manual-testing-playbook/playbook-failclosed-allowlist.txt,scripts/tests/code-folder/durable-directory-manifest.json,scripts/tests/code-folder/baseline-readme-verdicts.json,shared/scripts/cite-drift-redirects.json,scripts/tests/render/web-markup-and-css.md}`
- `.skilled/skills/sk-code/sk-code-frontend/references/figma-to-code.md`
- repository-wide `rg -l` and live-set `rg -n` probes (2026-11-21); `iteration-004.md`, `research.md`

## Assessment

- New information ratio: **0.62**. Two findings are fully new (the literal scope boundary correction and the KQ5 no-op consequence for the name class); five are partially new (file inventories largely reused from iteration 4, re-split by reference form); one is redundant (the carried-forward Lighthouse contradiction). No synthesis bonus because the run's open-question count did not fall (one answered, one still open).
- Questions addressed: operator inbox question 9.
- Questions answered: question 9.

## Reflection

- What worked and why: reusing iteration 4's cluster inventory and spending the iteration on the new axis — reference form (path vs bare id) — turned a potentially huge re-inventory into a tractable classification; reading line-level `rg -n` output was what made the path/name split decidable.
- What did not work and why: the first whole-repository `rg -l` was hundreds of spec-history lines wide and had to be re-scoped twice; path-shape exclusions, not the pattern, were the discriminator, same lesson as iteration 4.
- What I would do differently: lead with the non-`specs/` `rg -l` for this question next time, since the operator's exclusions already imply the historical class needs only a count, not an enumeration.

## Recommended Next Focus

Operator inbox question 10: settle the Lighthouse contradiction. Read the hub router intent [SOURCE: .skilled/skills/mcp-tooling/ROUTER.md:49-53] against the feature catalog gap [SOURCE: .skilled/skills/mcp-tooling/mcp-chrome-devtools/feature-catalog/feature-catalog.md:227-238] and the chrome-devtools-mcp / bdg upstream docs, then state whether the new hub should add a catalog feature or drop the router intent. Do not open with `Close F-<n>-<n>`; the reducer closes frontier nodes.
