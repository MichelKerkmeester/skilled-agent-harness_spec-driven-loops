# Iteration 4: KQ4 — full blast radius of moving the two browser modes out of mcp-tooling

## Focus

KQ4: enumerate the full blast radius of moving `mcp-chrome-devtools` and `mcp-aside-devtools` out of `mcp-tooling`. The prompt asks for every file inside and outside `mcp-tooling` that names them, split into **hand-edit**, **regenerate** and **leave-as-history**, and asks to validate the leaf carry-over assumed in iteration 3. No ambiguous input: "names them" is read as a literal occurrence of either mode id in a live (non-archived) file; illustrations in historical reports are classified, not treated as edit targets. Exhausted approaches were checked — none of the five BLOCKED directions (broad Bladebro web search, live `bladebro` probes, non-`metadata` routingClass, hand-writing `leaf-manifest.json`, importing `transport-axis`) applies to this question, and none was retried. Research was entirely local and read-only.

## Actions Taken

1. Read the four state files (config, 10-line state JSONL, strategy, findings registry); derived iteration 4 from three prior `iteration` records and found no existing `iteration-004.md` or `iter-004.jsonl`.
2. `grep` for `mcp-chrome-devtools|mcp-aside-devtools` over the whole repository (400 matches returned, truncated) to establish the shape of the radius.
3. `rg -l` for the same pattern over `.skilled/` and over `specs/mcp/mcp-browser-use/` to get complete canonical file lists.
4. Read `.skilled/skills/mcp-tooling/SKILL.md:100-149` for the generated-vs-hand-written rule and the escalation conditions.
5. Probed the runtime mirror roots and the four carry-over leaf files; checked for literal hits in root-level config files outside `.skilled/` and `specs/`.

## Findings

1. **The hub-level hand-edit set is nine live files plus the hub README.** `SKILL.md` itself carries both mode ids in its keyword comment, mode table, ownership boundary and folder tree [SOURCE: .skilled/skills/mcp-tooling/SKILL.md:10] [SOURCE: .skilled/skills/mcp-tooling/SKILL.md:30] [SOURCE: .skilled/skills/mcp-tooling/SKILL.md:33] [SOURCE: .skilled/skills/mcp-tooling/SKILL.md:43] [SOURCE: .skilled/skills/mcp-tooling/SKILL.md:95] [SOURCE: .skilled/skills/mcp-tooling/SKILL.md:98]; `hub-router.json` names them in discovery classes and router signals [SOURCE: .skilled/skills/mcp-tooling/hub-router.json:8] [SOURCE: .skilled/skills/mcp-tooling/hub-router.json:35] [SOURCE: .skilled/skills/mcp-tooling/hub-router.json:69] [SOURCE: .skilled/skills/mcp-tooling/hub-router.json:144]; `mode-registry.json` carries them as mode identities [SOURCE: .skilled/skills/mcp-tooling/mode-registry.json:9] [SOURCE: .skilled/skills/mcp-tooling/mode-registry.json:32]. Also hand-written: `ROUTER.md`, `description.json`, `graph-metadata.json`, `feature-catalog/feature-catalog.md`, `feature-catalog/workflow-vs-transport-routing/workflow-vs-transport-routing.md`, `manual-testing-playbook/manual-testing-playbook.md` and the six `manual-testing-playbook/hub-routing/*.md` scenarios, plus `README.md`. Strategy already requires bidirectionally aligned registry/router keys and an ESCALATE on disagreement, so removing the two modes is a coordinated edit, not a single-file deletion [SOURCE: .skilled/skills/mcp-tooling/SKILL.md:125] [SOURCE: .skilled/skills/mcp-tooling/SKILL.md:140].

2. **`leaf-manifest.json` is the one unambiguous regenerate item inside mcp-tooling.** The SKILL.md states it "is generated from packet resources. Never hand-edit it" and requires regeneration through the canonical metadata command [SOURCE: .skilled/skills/mcp-tooling/SKILL.md:111] [SOURCE: .skilled/skills/mcp-tooling/SKILL.md:127]. This confirms the iteration-3 BLOCKED direction and means the new hub's manifest cannot be authored by 002/003 by hand; it must be produced after the mode packets exist at their new root.

3. **The iteration-3 leaf carry-over assumption is validated: all four named leaves exist.** Chrome's `references/cdp-patterns.md` and `references/session-management.md` (plus `references/troubleshooting.md`) are present under `mcp-chrome-devtools/`; Aside's `references/aside-cli-reference.md` and `references/mcp-wiring.md` (plus `session-management.md`, `troubleshooting.md`, a dated research note and a discovery fixture) are present under `mcp-aside-devtools/`. Because the manifest is generated from packet resources [SOURCE: .skilled/skills/mcp-tooling/SKILL.md:111] and its Chrome/Aside entries already list exactly those leaf pairs [SOURCE: .skilled/skills/mcp-tooling/leaf-manifest.json:4] [SOURCE: .skilled/skills/mcp-tooling/leaf-manifest.json:17], a relocation carries the leaves with the packets and the new manifest regenerates with the same four leaf ids — no hand-written leaf entries are needed. The only blocker remains that Bladebro has no packet, so its leaves cannot be filled yet (carried from iteration 3).

4. **First outside-mcp-tooling hand-edit cluster: `cli-orca` (seven files).** Orca's SKILL.md and README name both modes in their browser-ownership tables [SOURCE: .skilled/skills/cli-orca/SKILL.md:53] [SOURCE: .skilled/skills/cli-orca/SKILL.md:54] [SOURCE: .skilled/skills/cli-orca/README.md:153] [SOURCE: .skilled/skills/cli-orca/README.md:154]; its ROUTER.md lists them as foreign owners and maps keywords to them [SOURCE: .skilled/skills/cli-orca/ROUTER.md:26] [SOURCE: .skilled/skills/cli-orca/ROUTER.md:103] [SOURCE: .skilled/skills/cli-orca/ROUTER.md:104]; and `SKILL.md:237`, `references/mutation-and-browser-boundaries.md:83-84`, and the three `feature-catalog/` files repeat the ownership split [SOURCE: .skilled/skills/cli-orca/references/mutation-and-browser-boundaries.md:83]. These are live routing contracts, so they are hand-edits, not history.

5. **Second outside cluster: `mcp-code-mode` (five files) and its shared-helper coupling.** `SKILL.md` names `mcp-chrome-devtools` as the example Code Mode consumer [SOURCE: .skilled/skills/mcp-code-mode/SKILL.md:318]; `graph-metadata.json` carries a metadata-only ADR-004/005 carve-out note pointing at the hub [SOURCE: .skilled/skills/mcp-code-mode/graph-metadata.json:21]; `scripts/README.md:70` records that `_utils.sh` is kept byte-identical with the `mcp-tooling/mcp-chrome-devtools` copy and that a test enforces it; and two sibling-pair playbooks cite the Chrome packet `SKILL.md` as the catalog [SOURCE: .skilled/skills/mcp-code-mode/manual-testing-playbook/clickup-and-chrome-via-cm/sibling-pair-handover.md:94]. The byte-identical helper coupling is the subtle one: relocating the packet must preserve or deliberately re-point that test-enforced relationship.

6. **Third outside cluster: sibling packets, the skills index, the doctor manifest and the test allowlist.** `mcp-click-up/references/mcp-tools.md` names both modes as the signed-in-work owners in live prose [SOURCE: .skilled/skills/mcp-tooling/mcp-click-up/references/mcp-tools.md:374] [SOURCE: .skilled/skills/mcp-tooling/mcp-click-up/references/mcp-tools.md:636] [SOURCE: .skilled/skills/mcp-tooling/mcp-click-up/references/mcp-tools.md:637]; `mcp-click-up/SKILL.md:317` and `README.md:219` call Chrome a structural sibling/template; `mcp-figma`, `mcp-mobbin` and `mcp-refero` canonical docs and `sk-code`/`sk-design-md-generator` READMEs carry cross-references; the global skills index lists both modes as `mcp-tooling` members [SOURCE: .skilled/skills/README.txt:53]; the doctor mutation-class guard hardcodes both `skill_dir` paths [SOURCE: .skilled/commands/doctor/assets/mcp-mutation-class-manifest.yaml:43] [SOURCE: .skilled/commands/doctor/assets/mcp-mutation-class-manifest.yaml:59]; and the manual-testing-playbook fail-closed allowlist names both packet paths [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/playbook-failclosed-allowlist.txt:25] [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/playbook-failclosed-allowlist.txt:26]. The guard manifest is the highest-risk hand-edit because a stale `skill_dir` silently drops mutation-class coverage — the exact defect recorded in an earlier doctor audit [SOURCE: specs/commands/002-doctor-audit-and-fixes/002-doctor-audit-followups/003-doctor-gates-and-drift/spec.md:77].

7. **Advisor/test fixtures are hand-edits, not history, because they assert current routing.** The system-skill-advisor golden prompts and labeled prompts encode the modes as expected route labels [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/fixtures/gate2-golden-prompts.jsonl:6], alongside `labeled-prompts.jsonl:191`, `capture-local-native-divergence-ledger.mjs:181`, `affordance-normalizer.test.ts:62` and `lane-attribution.test.ts:33`; the native-validate playbook uses `mcp-chrome-devtools` as a slice id [SOURCE: .skilled/skills/system-skill-advisor/manual-testing-playbook/native-cli-tools/native-validate-slices.md:148]. These will drift the moment the mode ids change, regardless of which KQ5 naming is chosen.

8. **Leave-as-history is the largest class by file count and needs no edits.** Every `changelog/**` file that names a mode (mcp-tooling, both mode packets, mcp-click-up, mcp-figma, mcp-code-mode and `.skilled/changelog/skilled/v4.0.x.md`), every `benchmark/reports/**` capture, and every `specs/**` scratch, evidence, handover, gate-a/gate-b TSV, dispatch receipt and prior research artifact that quotes a mode id is a point-in-time record. Moving the modes does not retroactively change what those records observed. This is why the raw 400-match grep overstates the work: most hits are history. [INFERENCE: classification from path shape — `changelog/`, `benchmark/reports/`, `scratch/`, `evidence/`, `research/`, `receipts/`, `*.tsv` — confirmed by representative hits such as `.skilled/skills/mcp-tooling/mcp-chrome-devtools/changelog/v1.0.21.0.md` and `specs/sk-doc/hub-routing-and-surfaces/001-hub-routing-quality/001-routing-completeness/002-gate-a-signal-closure/research/gate-a-raw.tsv:192`.]

9. **Generated index/config surfaces are regenerate-or-no-op, and there are no literal hits in root runtime configs.** The system-spec-kit trigger index and retrieval fixtures name the mode ids [SOURCE: .skilled/skills/system-spec-kit/runtime/data/trigger-index.json:1] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs:1], as do observability reports — these are generated artifacts and belong in regenerate, alongside `leaf-manifest.json`. Runtime skill mirrors need no action because `.claude/skills`, `.opencode/skills` and `.pi/skills` are symlinks to `.skilled/skills` (observed 2026-11-21); moving the canonical directory moves them with it. A literal grep excluding `specs/` and `.skilled/` returned no files, so root configs such as `.utcp_config.json` reach these servers by manual name rather than by skill mode id — consistent with the doctor check that keys the Aside manual on `.utcp_config.json`, not on the mode name [SOURCE: .skilled/skills/mcp-tooling/mcp-aside-devtools/README.md:203]. [INFERENCE: symlink and no-hit observations are from shell probes recorded in Actions Taken, not from a file citation.]

## Questions Answered

- **KQ4: What is the full blast radius of moving mcp-chrome-devtools and mcp-aside-devtools out of mcp-tooling? Answer with every file inside and outside mcp-tooling that names them, split into hand-edit, regenerate and leave-as-history.** Answered:
  - **Hand-edit (inside mcp-tooling):** `SKILL.md`, `ROUTER.md`, `mode-registry.json`, `hub-router.json`, `description.json`, `graph-metadata.json`, `feature-catalog/feature-catalog.md`, `feature-catalog/workflow-vs-transport-routing/workflow-vs-transport-routing.md`, `manual-testing-playbook/manual-testing-playbook.md` + six `manual-testing-playbook/hub-routing/*.md`, `README.md`.
  - **Hand-edit (outside mcp-tooling):** seven `cli-orca` docs; five `mcp-code-mode` docs; `mcp-click-up/references/mcp-tools.md` plus its SKILL.md/README.md; canonical docs in `mcp-figma`, `mcp-mobbin`, `mcp-refero`, `sk-code`, `sk-code-frontend`, `sk-design-md-generator`; `.skilled/skills/README.txt`; `.skilled/commands/doctor/assets/mcp-mutation-class-manifest.yaml`; `sk-doc/sk-create-manual-testing-playbook/playbook-failclosed-allowlist.txt`; `cite-drift-redirects.json`; system-skill-advisor test/fixture files; live downstream specs `003-mode-relocation/{goal,spec,tasks}.md` and `006-verification/spec.md`.
  - **Regenerate:** `mcp-tooling/leaf-manifest.json` (canonical command only), the new hub's own manifest after relocation, system-spec-kit `trigger-index.json` and retrieval fixtures, observability reports.
  - **Move wholesale (neither edit nor regenerate):** the two mode packet directories themselves; `.claude`/`.opencode`/`.pi` skill symlinks follow automatically.
  - **Leave-as-history:** all changelogs, benchmark reports, and all `specs/**` scratch/evidence/handover/research/TSV/receipt artifacts that quote the mode ids.
  - **Carry-over validated:** all four iteration-3 leaf ids exist on disk and regenerate mechanically into the new manifest; only Bladebro's leaves remain unauthorable until 004 authors its packet.

## Questions Remaining

- KQ1 (capability matrix — findings gathered in iteration 1 but the strategy box is still unchecked)
- KQ5 (naming decision: folder / workflowMode / packetSkillName per mode)
- KQ6 (macOS verification steps)
- KQ7 (security risks and mitigations)
- KQ8 (whether Bladebro takes over Aside's deterministic signed-in work)

## Edge Cases

- **Ambiguous input:** none requiring deferral; "names them" was scoped to literal mode-id occurrences in live files, and illustrations in reports were explicitly classified as history rather than ignored.
- **Contradictory evidence:** none. The 400-match raw grep and the file-level `rg -l` inventory agree; the difference is classification, not conflict.
- **Missing dependencies:** no optional source was unavailable. Live `bladebro` probes remain BLOCKED by strategy but are irrelevant to KQ4.
- **Partial success:** none. All planned probes returned; the only truncated result was the 400-line grep, which was superseded by the complete `rg -l` file lists.

## Ruled Out

- Treating the raw 400-match grep as the edit list: rejected because most hits are changelog/benchmark/spec-history records; it would inflate the hand-edit set by an order of magnitude.
- Hand-writing the new hub's `leaf-manifest.json`: already BLOCKED in strategy and now independently confirmed by `SKILL.md:111`; not retried.
- Editing runtime mirrors under `.claude`, `.opencode` or `.pi`: rejected after `ls -l` showed them to be symlinks into `.skilled/skills`.

## Dead Ends

- No new dead end. Candidates for reducer promotion: none; the three ruled-out items above are classification choices specific to KQ4, not exhausted research directions.

## Sources Consulted

- `.skilled/skills/mcp-tooling/SKILL.md`, `ROUTER.md`, `mode-registry.json`, `hub-router.json`, `leaf-manifest.json`
- `.skilled/skills/cli-orca/SKILL.md`, `README.md`, `ROUTER.md`, `references/mutation-and-browser-boundaries.md`, three `feature-catalog/` files
- `.skilled/skills/mcp-code-mode/SKILL.md`, `graph-metadata.json`, `scripts/README.md`, two playbooks
- `.skilled/skills/mcp-tooling/mcp-click-up/references/mcp-tools.md`
- `.skilled/commands/doctor/assets/mcp-mutation-class-manifest.yaml`
- `.skilled/skills/README.txt`, `sk-doc/sk-create-manual-testing-playbook/playbook-failclosed-allowlist.txt`
- `.skilled/skills/system-skill-advisor/runtime/scripts/fixtures/gate2-golden-prompts.jsonl`
- `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json`, `runtime/cli/retrieval/lib/corpus.mjs`
- repository-wide `grep` and `.skilled/`/`specs/`-scoped `rg -l`; symlink and leaf-file shell probes

## Assessment

- New information ratio: **0.94**. Eight findings are new KQ4 blast-radius facts; one (leaf carry-over) partially reuses iteration 3's assumption by confirming the four leaf files on disk and the generation rule.
- Questions addressed: KQ4, plus a validation of the iteration-3 leaf carry-over assumption.
- Questions answered: KQ4.

## Reflection

- What worked and why: a two-stage search — broad `grep` for shape, then `rg -l` for canonical file lists — kept the radius complete while making the history-vs-live classification tractable; reading the hub `SKILL.md` regeneration rule turned "regenerate" from a guess into a cited rule.
- What did not work and why: the unscoped 400-result grep was mostly scratch and benchmark history; it would have buried the ~30 live files. Fixed by re-scoping to `rg -l` plus path-shape classification.
- What I would do differently: capture the file-level inventory first next time, and read the doctor guard manifest earlier since it is the highest-risk stale-path target.

## Recommended Next Focus

KQ5 naming decision. The hand-edit list above is expressed in current mode ids, so the folder / `workflowMode` / `packetSkillName` choice determines which of those literal occurrences are renamed versus merely relocated — answering KQ5 first makes the KQ4 edit list executable.
