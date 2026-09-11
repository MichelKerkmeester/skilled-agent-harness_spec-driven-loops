# Iteration 004: Release readiness, and the operator's walk from SKILL.md to a delivery

## Focus

- Dimensions: **release readiness**, **usability**.
- Scope: I walked both documented paths as a first-time reader — SKILL.md → a delivered `html-svg` diagram, and SKILL.md → a themed delivery from a DESIGN.md — then read the release record (the packet's changelog, the hub's changelog and the packet's own verification claims) against the filesystem and against a command's output. Files read: `SKILL.md`, `README.md`, `changelog/v1.0.0.0.md`, `changelog/v1.1.0.0.md`, `references/design-md-theming.md`, `references/foundations/style-guide.md`, `references/foundations/output-spec.md`, `references/foundations/router-pseudocode.md`, `references/import-export/export.md`, `scripts/README.md`, `scripts/apply-design-md.cjs`, `scripts/check-diagram-corpus.cjs`, `assets/style-reference/harness-diagram/{DESIGN.md,origin.md}`, `assets/diagrams/starter-light.html`, the `/design:diagram` router and its three command assets, `manual-testing-playbook/command-and-hub-integration/hub-registration.md` and its feature-catalog twin, `.github/workflows/diagram-corpus.yml`, the four `sk-design` mode READMEs and their changelog directories, the `sk-doc` and `sk-design` hub registries, and the `019-sk-design-diagram-upgrade` records the changes cite.
- Commands run, none of them a write to the reviewed tree: `node scripts/check-diagram-corpus.cjs` → 38 files, 12 families, `Summary: errors: 0`, `RESULT: PASSED`, exit 0; `node --test scripts/tests/` → 19 tests, 19 pass, exit 0; `node ../shared/scripts/render-screenshots.cjs ./assets ./screenshots --check` → `sources 39, missing 0`, `RESULT: PASSED`, exit 0; `python3 .../validate_skill_package.py .opencode/skills/sk-design/sk-design-diagram --strict` → **exit 1** (quoted in F019), with the same command run on the three sibling modes for comparison; a link-resolution pass over every relative markdown link in SKILL.md, README.md and `design-md-theming.md` (0 broken); and an in-memory call of the shipped `parseColors` / `parseColorDeclarations` / `parseTypography` / `parseRadius` on a frontmatter-prefixed DESIGN.md string built in the process, with no file written. One command did write, and it was cleaned up: `node frontmatter-version.mjs compute` emitted `frontmatter-version-manifest.{csv,json}` at the repo root, both deleted in the same session and confirmed absent afterwards.
- Prior passes: the brief named iterations 1 and 2; the lineage also holds **iteration 3** (coverage and test quality, F013–F018), which I read as well before writing. Nothing below repeats an earlier finding — and one candidate of mine, `scripts/README.md`'s statistics and its "no committed regression suite" claim, is dropped because it is iteration 3's F018, same file and same lines. Two other places touch adjacent ground and are marked: F023 is not iteration 2's ruled-out note on the "26 of the 34" count (that count is accurate; the finding is that SKILL.md states the opposite default), and the Refinements section adjusts F007 — which iteration 3 explicitly declined to re-report — rather than re-litigating it.

## Scorecard

- Dimensions covered: release readiness, usability
- Files reviewed: 38 (the packet tree, the `/design:diagram` command assets, the hub and mode registries, and the spec-packet records the claims resolve through)
- New findings: P0=0 P1=6 P2=1
- Refined findings: P0=0 P1=1 P2=0 (F007, reduced — see Refinements)
- New findings ratio: 1.00 (severity-weighted: `(5·P1 + 1·P2 + 10·P0) / 25`; 31/25 unbounded, reported at the 1.0 bound — six P1s is the cause, and F025 is the only P2)

## Findings

### P0, Blocker

None. The packet's generative machinery is green at this revision: the corpus check, the mutation suite and the screenshot coverage check all pass, and both applicator identity gates pass in CI. Every finding below is a document or a claim that does not match what the tree holds, not a delivery that is wrong today. F019 is the closest to a P0 and is held at P1 because the false claim is about the packaging gate rather than about a shipped artifact.

### P1, Required

- **F019**: The packet's verification table states that the packaging gate exits 0; it exits 1 with three unmet strict requirements, one of which is unique to this packet, `README.md:133` vs observed run. (dimension: release readiness)
  - `README.md:133`: "Package structure | `python3 .opencode/skills/sk-doc/sk-create-skill/scripts/validate_skill_package.py .opencode/skills/sk-design/sk-design-diagram --strict` exits 0". Observed in this session, verbatim: `package_skill.py --check --strict: FAIL (exit 1)` … `❌ Strict mode: 3 contract requirement(s) unmet — Resource doc 'assets/style-reference/harness-diagram/DESIGN.md' has no frontmatter (expected 5-field block: title, description, trigger_phrases, importance_tier, contextType); Resource doc 'assets/style-reference/harness-diagram/origin.md' has no frontmatter (…); SMART ROUTING section missing smart-router marker(s): discover_markdown_resources, _guard_in_skill (see skill_smart_router.md pseudocode)`, then `Result: FAIL`.
  - The third item is this packet's alone. `SKILL.md:148-151` states that the router contract is the prose and "the reference implementation of the router lives in `references/foundations/router-pseudocode.md`"; the markers are in that file (`router-pseudocode.md:60,67`) and no longer in SKILL.md, so the check that looks for them in SKILL.md fails only here. Measured against the same command for comparison: `sk-design-chart` 2 unmet (the two Style Reference assets, no marker failure), `sk-design-fundamentals` 1 (word limit), `sk-design-md-generator` exit 0.
  - The same expectation is repeated where an operator will meet it: the CMD-002 scenario's Expected reads "Step 4 prints a `PASS` line and exits `0`" and its Pass/Fail is "the validator exits `0`" (`manual-testing-playbook/command-and-hub-integration/hub-registration.md:52,60`).
  - The fix is not exotic: a five-field frontmatter block above `# Harness Diagram — Style Reference` and above `# Origin of this Style Reference` is inert to every reader of DESIGN.md — verified here by calling the shipped `parseColors`, `parseColorDeclarations`, `parseTypography` and `parseRadius` on a frontmatter-prefixed copy and on the original: all four outputs identical, 27 colour rows in both. Either add those two blocks and restore the two markers (or record the delegation in SKILL.md in the form the check accepts), or change the README row and the CMD-002 expectation to state what the gate actually reports. The packet should not do neither, which is the current state.

- **F020**: The packet is at 1.2.0.0 and its changelog has no 1.2.0.0 entry — the release commit claims otherwise, and the packet's own spec records the entry as unshipped work, `SKILL.md:5`, `changelog/` listing, commit `7bf1c3af7d`. (dimension: release readiness)
  - `SKILL.md:5` reads `version: 1.2.0.0`. `ls changelog/` returns exactly `v1.0.0.0.md` and `v1.1.0.0.md`. `git show --name-status 7bf1c3af7d -- .opencode/skills/sk-design/sk-design-diagram/changelog/` returns a single line: `A …/changelog/v1.1.0.0.md`. That is the commit whose subject is `fix(sk-design-diagram): close the capture review's findings and release the packet at 1.2.0.0` and whose body says "The skill releases at 1.2.0.0 with every document re-derived, **a changelog entry**, and the theming path reachable from its front door." The entry it added is versioned one minor below the packet it released.
  - Nothing else supplies it. The hub's own changelog (`sk-design/changelog/v2.0.0.0.md`) covers the hub move, and the nested-packet contract keeps the two separate — "Keep real changelog files at both hub and packet level. Do not point packet changelogs at hub changelogs or vice versa" (`sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:277-279`). The packaging workflow's step 4 is explicit: `rg -n '^version:' <skill>/README.md` … "Confirm a matching changelog entry exists" (`sk-create-skill/references/skill/creation-workflow.md:204`).
  - This is a known, unfixed gap, not a mystery: `specs/sk-design/019-sk-design-diagram-upgrade/009-one-form-library/implementation-summary.md:186-190` records "**No changelog entry for this phase.** … the directory still holds only `v1.0.0.0.md` as of this closeout", with `next_safe_action: "Write the missing changelog entry in ../changelog/"` at line 17, and `acceptance-criteria.md:113` repeats "no changelog entry recording the merge exists in `../changelog/`". The release commit then bumped the version without closing that item, so the gap now looks like a released 1.2.0.0 with no record of what it changed.
  - Consequence for the reader: the packet ships the capture-review fixes (label masks moved off their connectors, the nine-coral integration topology reduced to two accents, the venn focal mark, the full starter cut from six accents to one) and none of it can be found from `changelog/`; the 1.2.0.0 version is only reachable through `git log`. Fix: add `changelog/v1.2.0.0.md` recording the 1.2.0.0 work (the release commit's own body is a usable draft), or renumber the packet to 1.1.0.0 and say so in the same entry.

- **F021**: The mode's presentation contract tells the reader to load a workflow file that does not exist, `.opencode/commands/design/assets/diagram-presentation.txt:49`, and the router names the real one at `.opencode/commands/design/diagram.md:64`. (dimension: usability)
  - `diagram-presentation.txt:49`: "then load `create-diagram-auto.yaml` only when every required field is available." The directory holds `diagram-auto.yaml` and `diagram-confirm.yaml`; `find . -name 'create-diagram-*.yaml'` matches only a stale worktree copy under `.worktrees/`, not the live command surface.
  - The router is the authority the presentation defers to, and it names the right file: "Load the workflow YAML bound to the resolved mode from the EXECUTION TARGETS table below" with `:auto → .opencode/commands/design/assets/diagram-auto.yaml` (`diagram.md:39,64`). The router also sets the failure rule the presentation then trips: "If any referenced asset is missing, stop and report the missing path" (`diagram.md:36`), and the presentation's own Phase 0 is a hard block.
  - This is the class of defect the upgrade program opened with, and the sibling got the fix while this one did not: `specs/sk-design/019-sk-design-diagram-upgrade/spec.md:71-72` names "the command that routes to it names YAML files that do not exist" as the packet's starting problem, and commit `3f123f246a` is titled "fix(commands): the chart command names only files that exist, and the hub that owns its mode".
  - The same file still speaks the pre-cutover name in three visible strings: the Phase 0 banner "SELF-CHECK: Are create-diagram packet resources available?" (`:10`), "This command requires the create-diagram packet for" (`:33`) and `STATUS=FAIL ERROR="create-diagram resources unavailable"` (`:44`). Fix: name `diagram-auto.yaml` / `diagram-confirm.yaml` in the load instruction, and rename the packet in the Phase 0 copy while the file is open.

- **F022**: The operator's registration scenario and the packet's feature-catalog both describe registration in the `sk-doc` hub, which no longer holds it; the scenario's own expected PASS is unobtainable, `manual-testing-playbook/command-and-hub-integration/hub-registration.md:45-48,52`. (dimension: usability, release readiness)
  - The scenario instructs: step 1 "Grep `.opencode/skills/sk-doc/mode-registry.json` for the `sk-design-diagram` entry; confirm `workflowMode sk-design-diagram`, command `/design:diagram`, and aliases"; step 2 "Grep `.opencode/skills/sk-doc/leaf-manifest.json` for the packet's leaves"; step 4 the strict validator. Expected: "Step 1 shows a `sk-design-diagram` entry … Step 2 shows the packet's leaf list including all 27 `references/types/type-*.md` paths … Step 4 prints a `PASS` line and exits `0`" (`:45,46,52`).
  - Observed: `grep -n "sk-design-diagram\|create-diagram" .opencode/skills/sk-doc/mode-registry.json .opencode/skills/sk-doc/hub-router.json` returns nothing, and the same grep over `.opencode/skills/sk-doc/command-metadata.json` returns nothing. The registration is in the new hub: `.opencode/skills/sk-design/mode-registry.json:89` carries `workflowMode: sk-design-diagram`, `command: /design:diagram` and the alias list, and `.opencode/skills/sk-design/leaf-manifest.json` contains `references/types/type-architecture.md`. The hub changelog records the move: "Chart and diagram left `sk-doc` and took this hub's name" (`sk-design/changelog/v2.0.0.0.md`, §2). Step 4 fails outright (F019).
  - Two current-state documents carry the same stale fact, so the scenario is not an isolated file: `feature-catalog/command-and-hub-integration/hub-registration.md:21` — "`sk-design-diagram` is a nested workflow packet under the `sk-doc` parent hub … keeping `sk-doc` as the single advisor root" — with the same claim at `:3,37` and the wrong anchors at `:47-49,57`; `feature-catalog/command-and-hub-integration/design-diagram-command.md:37,57`; and the playbook index at `manual-testing-playbook/manual-testing-playbook.md:317,320`.
  - Impact: the packet is correctly registered — I verified the sk-design entry, command, aliases and leaf list — so nothing about routing is broken. What is broken is the one procedure that exists to prove it: an operator or agent running CMD-002 as written fails at step 1 and would file a routing defect that does not exist. Fix: re-point the scenario and both feature-catalog files at `.opencode/skills/sk-design/{mode-registry.json,hub-router.json,leaf-manifest.json,command-metadata.json}` and re-run CMD-002 against them.

- **F023**: SKILL.md and the always-loaded style guide state opposite defaults for the dot-pattern ground, and the difference is visible in the majority of the shipped library, `SKILL.md:185` vs `references/foundations/style-guide.md:169`. (dimension: usability, release readiness)
  - `SKILL.md:185`: "**Background:** default clean `paper` fill, no dot pattern — the diagram sits directly on the page. Optional dotted-paper variant (`22×22` pattern at ~10% ink opacity) only for long-form editorial hero diagrams."
  - `style-guide.md:169`: "**Dot pattern is the default ground**: the 22×22 dot pattern carries the paper, and 26 of the 34 worked forms use it. Drop it for a clean `paper` fill when the drawing is dense enough that the pattern competes with it — the eight that do are the security matrix, both import examples, the IT current-state, medallion, org chart, consultant quadrant and venn…".
  - The release note says which document was brought into line: "The dot pattern is documented as the default because 26 of 34 forms use it" (`changelog/v1.1.0.0.md:68`). So the changelog claims the default is now documented, and SKILL.md — the packet contract, and the only document in the path that a reader loads before the style guide — still documents the reverse. Nothing enforces either reading: the grid family exempts the dot pattern and no family counts pattern usage.
  - Impact: a reader who follows SKILL.md's Core SVG primitives ships a ground unlike 26 of the 38 forms it was told to copy from, and then passes §6 SUCCESS CRITERIA, which has no item for the background. Fix: replace `SKILL.md:185` with the style guide's rule, including the drop-when-dense condition and a pointer to `style-guide.md` §Constraints.
  - Not iteration 2's ruled-out note: that pass checked the "26 of the 34" count against the corpus and found it accurate. The count is not in dispute; the disagreement between the two documents is.

- **F024**: The packet README points five times at a SKILL.md section that does not exist, and the mode's user-visible status text repeats it, `README.md:63,82,105,137`, `.opencode/commands/design/assets/diagram-presentation.txt:171`. (dimension: usability)
  - SKILL.md's sections are `## 1. WHEN TO USE` (`:16`), `2. SMART ROUTING` (`:50`), `3. HOW IT WORKS` (`:155`), `4. RULES` (`:254`), `5. REFERENCES` (`:308`) and `6. SUCCESS CRITERIA` (`:335`). There is no §9. The README says "The taste gate is `SKILL.md` §9's Pre-Output Checklist" (`:63`), "`SKILL.md` §9 is not a style nicety" (`:82`), "Re-run the §9 taste gate's Signal checks" (`:105`) and "passes the full §9 taste gate" (`:137`).
  - The name is stale too. `README.md:35` says "runs the SKILL.md §6 Pre-Output Checklist"; SKILL.md's §6 is titled SUCCESS CRITERIA and the string "Pre-Output Checklist" occurs nowhere in SKILL.md — while the command workflows consistently call the same thing "SKILL.md §6 Pre-Output Checklist (SUCCESS CRITERIA…)" (`diagram-auto.yaml:268,423`; `diagram-confirm.yaml:231,366`). So the command surface and the README agree on the name and disagree on the number, and neither name exists in the contract.
  - Impact: the gate the packet calls non-negotiable has no resolvable pointer from its own README; the reader must guess between §4 RULES (the five connector rules) and §6 SUCCESS CRITERIA (the checklist). Fix: make every reference `SKILL.md §6 SUCCESS CRITERIA`, including `diagram-presentation.txt:171`'s "Taste gate (§9 checklist)" line.

### P2, Suggestion

- **F025**: The changelog names a checker family that does not exist under that name anywhere on disk, `changelog/v1.1.0.0.md:42` vs `scripts/families/label-mask-clearance.cjs`. (dimension: release readiness)
  - `changelog/v1.1.0.0.md:41-42`: "Two more checker families, bringing the corpus check to twelve. `legend-fidelity` refuses a legend swatch drawn unlike the thing it keys. `short-connector-labels` refuses a label mask painted across a connector under about 60px…". The module on disk is `label-mask-clearance.cjs`; `grep -rn "short-connector-labels"` matches only this changelog entry and older benchmark reports.
  - The rename is real history, one commit later than the entry: `git log --follow` on the family shows `9861d7163e` `R068 …/short-connector-labels.cjs → …/label-mask-clearance.cjs`, "make the label-mask rule see the corpus, then fix what it found". Because no 1.2.0.0 entry was written (F020), the rename appears nowhere, and the family that the entry credits with a real first-run find reads as one of eleven available families to anyone auditing the count.
  - Impact is limited — the family is live, registered and mutation-covered — but a reader following the changelog greps for a module that is not there. Fix: name `label-mask-clearance` in the same entry (a changelog entry is a record, and correcting a name inside it is honest), or name both where the 1.2.0.0 entry is written.

## Refinements

- **F007 (iteration 2, P1 → P2).** The finding is right that `check-diagram-corpus.cjs` invokes no applicator and that `derivation-record.md` §6 names the wrong mechanism. What iteration 2 could not see is that the guarantee it called manual is enforced one level up, by CI: `.github/workflows/diagram-corpus.yml` (created in `2010c69740`, phase 005, before this review) runs both applicators under `--default --all` and then `diff -rq` against `assets/diagrams` in a step named "Both applicators reproduce the stock bytes", under the job "Corpus contract, its mutation suite and both applicator gates", after a corpus step that greps for the literal `RESULT: PASSED` rather than trusting the exit code. A drifting value does fail a required pipeline gate; what it does not do is "fail that comparison by name" inside the corpus check, as the record's sentence promises. So the residual defect is the record's wording and the downgrade trigger iteration 2 wrote is met in substance. I recommend P2 and a one-sentence correction in §6 naming the CI gate, not new enforcement. Iteration 2's counterevidence pass looked at `scripts/` — the checker, its imports and the mutation suite — and did not open `.github/workflows/`; iteration 3 explicitly declined to re-report F007 and did not reach it either.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | fail | hard | `diagram-presentation.txt:49` vs `ls .opencode/commands/design/assets/`, `diagram.md:64` | F021 — the presentation's load instruction names a YAML that does not exist |
| spec_code | fail | hard | `SKILL.md:185` vs `style-guide.md:169`, `changelog/v1.1.0.0.md:68` | F023 — two documents state opposite defaults for the same ground |
| spec_code | partial | hard | `README.md:63,82,105,137` vs SKILL.md's six headings | F024 — five pointers to a section that does not exist; the target is §6 |
| spec_code | partial | hard | `changelog/v1.1.0.0.md:42` vs `scripts/families/label-mask-clearance.cjs`, `9861d7163e` | F025 — the release note names a family the tree no longer has |
| checklist_evidence | fail | hard | `README.md:133`, `hub-registration.md:52,60` vs validator run exit 1 | F019 — a verification row and a scenario's pass condition both state a result the gate does not produce |
| checklist_evidence | fail | hard | `creation-workflow.md:204` vs `changelog/` listing and `git show --name-status 7bf1c3af7d` | F020 — the packet's own version has no matching changelog entry, and the release commit says it does |
| feature_catalog_code | fail | advisory | `feature-catalog/…/hub-registration.md:3,21,37,47-49,57`, `…/design-diagram-command.md:37,57` vs `sk-doc` and `sk-design` registries | F022 — the catalog describes registration in the hub the packet left |
| playbook_capability | fail | advisory | `manual-testing-playbook/…/hub-registration.md:45,46,52,60,88-91`, `manual-testing-playbook.md:317,320` vs `sk-design/mode-registry.json:89` | F022 — CMD-002's four steps cannot pass as written; the registration itself is correct |
| checklist_evidence | pass | hard | `node scripts/check-diagram-corpus.cjs`, `node --test scripts/tests/`, `render-screenshots.cjs --check` | Baseline re-established at this revision; see the closing note |

## Assessment

- New findings ratio: 1.00 (bounded; 31/25 raw)
- Dimensions addressed: release readiness, usability
- Novelty justification: this pass read the documents a maintainer acts on — the verification table, the changelog, the version, the playbook scenario, the command presentation — and measured each against the tree and against a command I ran. Five of the seven findings are a stated fact that a file listing or an exit code contradicts; F023 is a contradiction between two live documents; F021 and F022 are instructions that cannot be followed as written. Nothing here repeats F001–F018, and the three adjacencies (iteration 2's dot-pattern count, iteration 2's F007, iteration 3's F018 on the scripts README) are named as adjacencies in their own entries.

### Claim adjudication

```json
{
  "findingId": "F019",
  "claim": "The packet's README states the packaging validator exits 0 with --strict; it exits 1 on three unmet strict requirements, one of which is caused by this packet moving its router pseudocode out of SKILL.md.",
  "evidenceRefs": [
    "README.md:133",
    "manual-testing-playbook/command-and-hub-integration/hub-registration.md:48,52,60",
    "SKILL.md:148-151",
    "references/foundations/router-pseudocode.md:60,67",
    "assets/style-reference/harness-diagram/DESIGN.md:1",
    "assets/style-reference/harness-diagram/origin.md:1"
  ],
  "counterevidenceSought": "Ran the exact command the README prints, read the exit code and the requirement list, then ran the same command on the three sibling modes to separate a packet defect from a fleet-wide one. Checked whether the missing markers are supplied elsewhere in SKILL.md (grep: only UNKNOWN_FALLBACK appears, at :65 and :151). Checked the two frontmatter findings are real by reading the first line of both files. Tested whether the obvious fix breaks the reader by calling the shipped parse functions on a frontmatter-prefixed DESIGN.md copy: all four outputs identical.",
  "alternativeExplanation": "The README row may be a target state written for the next release rather than an observed result, and the strict-only requirements may be advisory in intent. Rejected in part: the row sits under a column headed Result beside four other claims that are true, the validator's own output labels these as contract requirements promoted to errors under the flag the row prints, and CMD-002 makes the same exit code a pass condition.",
  "finalSeverity": "P1",
  "confidence": 0.95,
  "downgradeTrigger": "If DESIGN.md and origin.md gain the five-field block and SKILL.md satisfies the marker check (or the README row is corrected to state the true result), downgrade to closed.",
  "transitions": [{ "iteration": 4, "from": null, "to": "P1", "reason": "Ran the packet's own release check and read the output; compared against the sibling modes" }]
}
```

```json
{
  "findingId": "F020",
  "claim": "The packet declares version 1.2.0.0 and its changelog directory contains no entry for it, although the release commit says it shipped one and the packet's own records reserve the entry as outstanding work.",
  "evidenceRefs": [
    "SKILL.md:5",
    "changelog/v1.0.0.0.md",
    "changelog/v1.1.0.0.md",
    "specs/sk-design/019-sk-design-diagram-upgrade/009-one-form-library/implementation-summary.md:17,186-190",
    "specs/sk-design/019-sk-design-diagram-upgrade/009-one-form-library/acceptance-criteria.md:113",
    ".opencode/skills/sk-doc/sk-create-skill/references/skill/creation-workflow.md:204",
    ".opencode/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:277-279"
  ],
  "counterevidenceSought": "Listed the changelog directory; asked git which files the release commit touched in that path (`A changelog/v1.1.0.0.md` only) and read the commit body. Checked whether the hub's changelog could be the intended record (it documents the hub move, and the nested-packet contract forbids pointing a packet changelog at the hub's). Checked whether any other packet in the hub is missing its entry: chart 0.23.0.0/v0.23.0.0.md, fundamentals 1.0.0.0/v1.0.0.0.md, md-generator 1.1.0.0/v1.1.0.0.md all match; only this one does not.",
  "alternativeExplanation": "The frontmatter version may have been bumped in advance of an entry that was still to be written, making this an in-flight state rather than a release defect. That reading fits the date and the open item in the 019 records, but it leaves the packet declaring a version with no record and no reader-visible sign that the entry is pending, and the version has been bumped since the v1.1.0.0 entry was written.",
  "finalSeverity": "P1",
  "confidence": 0.96,
  "downgradeTrigger": "If changelog/v1.2.0.0.md lands (or the version returns to 1.1.0.0 with the release note saying so), close the finding.",
  "transitions": [{ "iteration": 4, "from": null, "to": "P1", "reason": "Version read against the changelog directory, the release commit and the packet's own open-item records" }]
}
```

```json
{
  "findingId": "F021",
  "claim": "The /design:diagram presentation contract instructs a load of create-diagram-auto.yaml, a file that exists nowhere in the live command surface, while the router it defers to names diagram-auto.yaml.",
  "evidenceRefs": [
    ".opencode/commands/design/assets/diagram-presentation.txt:10,33,44,49",
    ".opencode/commands/design/diagram.md:36,39,64",
    ".opencode/commands/design/assets/diagram-auto.yaml"
  ],
  "counterevidenceSought": "Searched the whole repository for create-diagram-*.yaml (matches only an unrelated stale worktree) and listed the asset directory (chart-*, diagram-* and extract-* only). Checked whether the router maps the name through an alias table — its OWNED ASSETS table has absolute paths and no aliasing — and read the router's missing-asset rule, which stops the run rather than resolving by name. Checked git history for the rename that produced the current names and for the equivalent fix on the chart command (3f123f246a).",
  "alternativeExplanation": "The presentation may be referring to the packet by its former name rather than to a file, and a reader may resolve it to diagram-auto.yaml from context. That reading works for the Phase 0 banner but not for a line that begins 'load', which is an instruction to open a file, and the packet's upgrade research lists exactly this defect as the state to be fixed.",
  "finalSeverity": "P1",
  "confidence": 0.9,
  "downgradeTrigger": "If the file is named create-diagram-auto.yaml again (or the instruction names diagram-auto.yaml/ diagram-confirm.yaml), downgrade to closed.",
  "transitions": [{ "iteration": 4, "from": null, "to": "P1", "reason": "Walked the command's presentation path file by file against the assets directory" }]
}
```

```json
{
  "findingId": "F022",
  "claim": "CMD-002 and the packet's feature-catalog describe the packet as registered in the sk-doc hub and direct the operator at sk-doc's registry files, which contain no entry for it since the sk-design cutover.",
  "evidenceRefs": [
    "manual-testing-playbook/command-and-hub-integration/hub-registration.md:3,19,27,29,45,46,52,88,89,91",
    "manual-testing-playbook/manual-testing-playbook.md:317,320",
    "feature-catalog/command-and-hub-integration/hub-registration.md:3,21,37,47-49,57",
    "feature-catalog/command-and-hub-integration/design-diagram-command.md:37,57",
    ".opencode/skills/sk-design/mode-registry.json:89",
    ".opencode/skills/sk-design/changelog/v2.0.0.0.md"
  ],
  "counterevidenceSought": "Grepped the sk-doc registries and command metadata for the packet name and its old name (no matches), then confirmed the sk-design registry entry carries the workflowMode, command and aliases the scenario expects and that the sk-design leaf manifest lists the type references. Read the hub changelog's CHANGED section for the cutover. Considered whether sk-doc keeps a compatibility registration — it does not.",
  "alternativeExplanation": "The scenario may be deliberately historical, validating the registration as it stood in the sk-doc era. Rejected: the files carry no historical framing (they say 'is a nested workflow packet under the sk-doc parent hub', present tense), the playbook index lists the scenario as current, and the packet's changelog does not name the move for these documents.",
  "finalSeverity": "P1",
  "confidence": 0.9,
  "downgradeTrigger": "If the scenario and the two feature-catalog files name the sk-design hub and the scenario passes end to end, downgrade to closed.",
  "transitions": [{ "iteration": 4, "from": null, "to": "P1", "reason": "Executed the scenario's steps against both hubs' registries" }]
}
```

```json
{
  "findingId": "F023",
  "claim": "SKILL.md tells the reader the default ground is a clean paper fill with the dot pattern reserved for hero diagrams, while the always-loaded style guide states the dot pattern is the default that 26 of 34 forms use.",
  "evidenceRefs": [
    "SKILL.md:185",
    "references/foundations/style-guide.md:169",
    "changelog/v1.1.0.0.md:68",
    "SKILL.md:337"
  ],
  "counterevidenceSought": "Read both sentences in full and checked for a scoping word that would reconcile them ('only for long-form editorial hero diagrams' against a rule that drops the pattern when the drawing is dense). Checked whether either document defers to the other on this point (SKILL.md names the style guide as the token source of truth at :173 and :267, which does not resolve a background default). Looked for an enforcing check (grid-4px exempts the dot pattern; no family counts pattern usage), and re-read iteration 2's ruled-out note to confirm the count itself was verified there and is not in dispute here.",
  "alternativeExplanation": "SKILL.md's sentence may describe the cleanest starting point for a new drawing rather than the library's dominant ground, with the style guide describing what the shipped forms do. That reading keeps both sentences true but leaves a reader with no rule for when to add the pattern, and the changelog says the intent was to document the pattern as the default.",
  "finalSeverity": "P1",
  "confidence": 0.88,
  "downgradeTrigger": "If SKILL.md states the pattern default and its drop-when-dense condition (or the style guide states the clean fill as the default and the corpus is regenerated to match), downgrade to closed.",
  "transitions": [{ "iteration": 4, "from": null, "to": "P1", "reason": "Followed the delivery path from SKILL.md's primitives section into the token source the path declares ALWAYS" }]
}
```

```json
{
  "findingId": "F024",
  "claim": "The packet README's only pointers to its delivery gate name a SKILL.md section that does not exist, and the same stale number appears in the mode's user-visible status text.",
  "evidenceRefs": [
    "README.md:35,63,82,105,137",
    ".opencode/commands/design/assets/diagram-presentation.txt:171",
    ".opencode/commands/design/assets/diagram-auto.yaml:268,423",
    ".opencode/commands/design/assets/diagram-confirm.yaml:231,366"
  ],
  "counterevidenceSought": "Enumerated SKILL.md's H2 headings mechanically (six, none numbered 9) and grepped the packet for the string 'Pre-Output Checklist' (the README and the command workflows only, never SKILL.md). Checked whether the README might be citing a rendered numbering that differs from the source — the headings carry their own numbers. Compared the two command assets to see which numbering the surface actually uses (§6 in both YAMLs).",
  "alternativeExplanation": "The README may be written against a longer SKILL.md whose gate was renumbered to §9 at some point, with the README not carried along. That explains the drift but does not remove it; the packet's own workflows already use §6.",
  "finalSeverity": "P1",
  "confidence": 0.95,
  "downgradeTrigger": "If every reference in the README and the command assets reads SKILL.md §6 SUCCESS CRITERIA, downgrade to closed.",
  "transitions": [{ "iteration": 4, "from": null, "to": "P1", "reason": "Walked the README as a first-time reader and resolved each section pointer against SKILL.md" }]
}
```

```json
{
  "findingId": "F025",
  "claim": "The changelog credits a checker family named short-connector-labels; the module was renamed to label-mask-clearance in a later commit and no entry records the new name.",
  "evidenceRefs": [
    "changelog/v1.1.0.0.md:41-44",
    "scripts/families/label-mask-clearance.cjs",
    "scripts/tests/mutation-cases.cjs"
  ],
  "counterevidenceSought": "Grepped the whole hub for the old name (only this entry and historical benchmark reports), traced the rename with git log --follow across the file pair, and confirmed the current module is the one the mutation suite and the checker exercise under the new name.",
  "alternativeExplanation": "The entry may be intended as a faithful record of what shipped in v1.1.0.0, in which case the old name was correct when written and only a later entry can record the rename. That is consistent with leaving the entry alone if a 1.2.0.0 entry names the current module — which is precisely what F020 says is missing.",
  "finalSeverity": "P2",
  "confidence": 0.9,
  "downgradeTrigger": "If the family is named by its current identifier in a changelog entry a reader can reach, downgrade to closed.",
  "transitions": [{ "iteration": 4, "from": null, "to": "P2", "reason": "Read the release notes for claims the tree could disprove" }]
}
```

## Ruled Out

- **`scripts/README.md`'s stale statistics and test section — iteration 3's F018, not a new finding.** I read the same file, measured the same numbers (21 code files, the committed 19-test suite passing, `resolveAnchor`-style counts unchanged) and wrote the finding before reading iteration 3; on reading it, the claim is the same file and the same lines (`scripts/README.md:27-29,93-95`). Dropped, and recorded here so a later pass does not file it a third time. The only thing I would add to iteration 3's entry if asked is the CI step that runs the suite (`.github/workflows/diagram-corpus.yml:55-59`) and the 12 family modules as part of the count.
- **The 38-form / 27-type / 4-starter counts, the 27-row route table and the `--all` contract**: re-measured here — `ls references/types/type-*.md` 27, `find assets/diagrams -name '*.html'` 38, `starter-*.html` 4, and the applicator's `--all` branch enumerates the form directory with no `--examples` residue (`grep -c examples scripts/apply-design-md.cjs` → 0). Clean.
- **The README's documented screenshot procedure**: `node ../shared/scripts/render-screenshots.cjs ./assets ./screenshots --check` returns `sources 39, missing 0` with `RESULT: PASSED`, and the `--full-page` flag its instructions use exists in the renderer. Clean.
- **Relative markdown links in SKILL.md, README.md and design-md-theming.md**: resolved every one against disk; zero broken.
- **SKILL.md's import claims against `output-spec.md`**: the `faithful` exemption's numbers (zoned above 9 nodes, split above 24) match `output-spec.md:97-105` exactly; the export claim at `SKILL.md:250` matches `export.md:39-41` ("diagram-only — just the `<svg>` node"). Clean.
- **The changelog's other v1.1.0.0 claims**: "Two more checker families, bringing the corpus check to twelve" matches the twelve modules on disk plus the harness's family list; the starter-hash removal claim is consistent with the absence of any hash field. Not reported.
- **The same README row on the sibling packet**: `sk-design-chart` also fails the strict gate (2 unmet, both Style Reference frontmatter), and `sk-design-fundamentals` fails on its SKILL.md word limit. Noted as context for F019, not counted as separate findings — they belong to those packets' reviews.
- **A dangling symlink found while tracing the ASCII validator**: `.opencode/skills/sk-doc/scripts/validate-flowchart.sh` still points at `../sk-create-diagram/scripts/validate-flowchart.sh`, which the move removed. Out of this packet's scope, and no live caller resolves through it — every reference in the diagram packet, the `/design:diagram` assets and the post-edit hook names the sk-design path, which exists. Recorded as a lead for whoever reviews the sk-doc packet, not as a finding here.

## Dead Ends

- **Treating the README's version as drift against SKILL.md**: the README's `1.2.0.16` reads as a mismatch until `frontmatter-version.mjs` is read — the anchor is the SKILL.md/changelog version and the fourth part is a per-file edit count (`computeForFile`, `:269-282`). The two numbers are not supposed to match, and the first check of that hypothesis (`verify --skill sk-design-diagram`) silently selects no files because the packet is a nested mode, not a directory under the skills root. Both were dropped before they became claims.
- **Reading the benchmark reports as evidence about the current packet**: `benchmark/reports/**` names the old family and the old packet name throughout, and is excluded by design. Every claim above was taken from a file outside the report tree or from a command's output.

## Recommended Next Focus

- None: this iteration was scoped to the two dimensions it was given. If the loop continues, the untried ground is the `screenshots/` trees (39 images, no family indexes them and no pass has opened them), the four `feature-catalog/` category READMEs beyond the hub-registration pair, and the `019-sk-design-diagram-upgrade/**` records, which this pass used only as evidence for the changes they cite and which no iteration has reviewed as objects in their own right.

Review verdict: CONDITIONAL
