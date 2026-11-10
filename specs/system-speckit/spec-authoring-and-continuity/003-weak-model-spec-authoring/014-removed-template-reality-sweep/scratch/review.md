# Phase 014 review

Verdict: **OK with notes**

Every phase 014 hunk matches its brief and is true against the tree. No table, tree, heredoc or code block was broken. The notes below are leftovers beside the edited lines and one change to how the output is quoted. None of them makes a 014 edit wrong.

## What was checked, with evidence

- Add-ons and packet types: `ls templates/addons` lists 7 files (acceptance-criteria, debug-delegation, decision-record, goal, handover, research, timeline). `templates/packet-types` lists 4. `spec-kit-docs.json` `documents` holds 15 entries.
- `24 passed`: `template-fill-guidance.vitest.ts` runs 4 levels x 4 core docs (16 `it`), one `it` per file in `addons/` (7) and one negative case (1), which makes 24. H1 also reports an observed run printing `Tests  24 passed (24)`. The `12 passed` golden counts were left alone.
- "15 template document kinds": `create.sh` declares `template_default_phrases` for spec plus 14 `*_template_default_phrases` arrays (lines 438-511), which makes 15.
- decision-record is optional at Level 3. This is true:
  - In the manifest, levels 1, 2, 3 and 3+ all have `requiredAddonDocs: []` and list `decision-record.md` under `lazyAddonDocs`.
  - In `orchestrator.ts:476-478`, the required set is `requiredCoreDocs + requiredAddonDocs` only.
  - `check-files.sh:13-14` and `validate.sh:83` say the same ("on-demand when explicitly added").
  - `create.sh` writes it only under `--with-lazy-addons` (`:281`, `:758`), and its header says "L3: ... decision-record.md is on-demand".
  - `upgrade-level.sh:878-881` adds no file for L2 to L3.
- Card section 10 line (conductor edit): it agrees with section 9, and "all five are true" still counts five bullets.
- Agent mirrors:
  - `.claude`, `.codex`, `.pi` and `.skilled` `orchestrate` each carry both new lines.
  - `.hermes/agents` is a symlink to `.skilled/agents`, which is why git reports "beyond a symbolic link".
  - The `.hermes` SKILL.md governance section is byte-identical to the source (`diff` printed SAME).
- Deep-loop "ten-category": `extract-from-evidence.cjs` `CATEGORY_ORDER` runs from `## 1. READMEs` to `## 10. Meta` and reads no `.tmpl`.
- `upgrade-legacy.vitest.ts:486` comment: "the spec-doc set does not hold" is true against `frontmatter-migration.ts:115-123` `SPEC_DOC_BASENAMES`, which has no resource-map. No code changed in 014's hunk. The surrounding test rewrite is phase 013's.
- markdown-link-integrity-guard rewrite: the framing now says clean baseline, +1 on injection, back to the baseline on revert. That agrees with the Expected and Pass sections, so the scenario's meaning is kept. The new injected numbers (`13780 links, 1 broken`) match what H2 saw independently while H1's injection was live.
- level-specifications tree: the fence is intact, every name is real, and the comment column is aligned.
- templates/README rows: they match the existing add-on rows' width (126 chars).
- level-decision-matrix row 46: 188 chars, the same as its neighbours.
- Fresh sweep (`rg -n -i 'before-after|roadmap\.md|resource-map\.md\.tmpl|ten add-?on|ten addon|eighteen templates|18 template|after each doc write|16 passed \(16\)'`, with specs, changelog, node_modules, dist, trigger-index and fixtures excluded). Every hit was judged and none is stale:
  - `sk-create-diff/.../markdown-before-after-review.md` and the two lines in its index: an unrelated diff-tool feature. OK.
  - `sk-doc/benchmark/reports/compiled-routing/2026-07-21--*/skill-benchmark-report.json`: historical run logs. OK.
  - `system-spec-kit/benchmark/reports/2026-10-25--.../outcomes/480.json:6,18` ("Tests 16 passed (16)"): a dated record of a past run. OK, leave it.
  - `runtime/cli/utils/template-structure.js:206`: a false positive. "Workflow-writ**ten add-ons**" matches `ten add-?on`.

Not run: the link checker, vitest, validate.sh. The brief bars builds and tests. The counts above come from reading the code plus the workers' reported runs.

## Findings

| # | file:line | problem | fix |
|---|---|---|---|
| 1 | `.skilled/skills/system-spec-kit/references/templates/level-specifications.md:789` | "A Level 3 parent with phases produces Level 3 child folders (each with spec.md, plan.md, tasks.md, acceptance-criteria.md, decision-record.md)". This contradicts the 014 change in the same file (`:303`, `:318`): children are not given a decision-record. | "(each with spec.md, plan.md, tasks.md, acceptance-criteria.md; decision-record.md on request)" |
| 2 | `.../level-specifications.md:540,566`; `.../assets/level-decision-matrix.md:263`; `.../references/workflows/quick-reference.md:308` | The upgrade-path tables still say L2 to L3 adds or renders `decision-record.md`. `upgrade-level.sh:878-881` adds no file at L2 to L3. The script's own help text at `upgrade-level.sh:281` ("Adds decision-record.md") is stale too. | Reword each row to "decision-record.md on request (lazy add-on)". Fix the help line at `upgrade-level.sh:281` in a code-scoped follow-up. |
| 3 | `.skilled/skills/system-spec-kit/SKILL.md:61` (and its `.hermes` copy) | 014 edited this line, but its list still ends "(the last three optional)", which marks only goal and timeline as optional. `decision-record.md` sits in the unmarked part of the list, so the line reads as if it were always required. That clashes with the decision-record change. The parenthetical is phase 013's wording. | Drop the "(the last three optional)" count, or mark decision-record, handover, debug-delegation, goal and timeline as on-demand. Then rerun `sync-skills-hermes.cjs`. |
| 4 | `.../level-specifications.md:387` | Under Level 3+ "Optional Files", the decision-record bullet keeps "(from Level 3)". In the neighbouring Required lists that phrase means "carried as required", so here it reads as a carried requirement. The brief asked for this wording. | Drop "(from Level 3)" so it matches `:303`. |
| 5 | `.../level-specifications.md:26-33` | The new tree lists core/addons/packet-types/examples/README.md only. `templates/` also holds `changelog/`, `CONTRACT.md`, `EXTENSION-GUIDE.md` and `MIGRATION.md`. `templates/README.md:122` and `folder-structure.md` do list `changelog/`. Nothing in the tree is false, but it is incomplete. | Add `changelog/` and the three maintainer docs, or put "Main entries:" above the fence. |
| 6 | `.../manual-testing-playbook/tooling-and-scripts/markdown-link-integrity-guard.md:56-57,96-97` | The two clean-run blocks are shown as captured output but drop the checker's real final line. That line is `OK`, an em dash, then `0 broken markdown links.`, and H1 cut it to avoid writing an em dash. The transcript is therefore silently edited. | Add one plain sentence after line 52: "The checker's closing OK line is omitted from the clean-run blocks." Or replace the line with a marker such as `[OK line: 0 broken markdown links]`. |
| 7 | `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/synthesis-save-and-guardrails/resource-map-emission.md:58`; `.../deep-review/.../resource-map-emission.md:59` | "the output uses the ten-category template skeleton". The brief left these on purpose, but there is no template any more, so they now disagree with lines 15 and 32 of the same files. | "the output uses the renderer's ten-category layout". |
| 8 | `.skilled/commands/speckit/assets/speckit-plan.yaml:309,640`, `speckit-implement.yaml:284,506,691`, `speckit-complete.yaml:346,809,865,973,1023,1266` | Audit row 11 is still open. These workflows run `validate.sh --strict` (no `--quiet`) after every step's writes. `orchestrate.md:400,429` and `SKILL.md:61` now say "once after the last doc write". The 014 edits make the clash plain. | An owner decides which side moves (audit row 11 gives both texts). Record it as an open item in the phase docs so it is not lost. |
| 9 | `.skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:486` | The comment line is 102 chars against neighbours of 80 and 45. The brief said to rewrap if longer. H1 kept it on the reasoning that no rewrap shortens the prefix, but the words after "does not hold" can move to the next line. Style only. | Break after "does not hold" and carry "and no template maps, so the fill passes it over;" onto line 487. Rewrap 487-488 to match. |
