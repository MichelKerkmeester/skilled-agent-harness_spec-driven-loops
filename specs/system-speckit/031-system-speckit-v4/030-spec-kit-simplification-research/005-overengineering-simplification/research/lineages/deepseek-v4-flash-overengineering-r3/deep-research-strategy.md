# Deep Research Strategy — deepseek-v4-flash-overengineering-r3

Session: fanout-deepseek-v4-flash-overengineering-r3-1788784311216-27elid | generation 1 | lineageMode: new | stopPolicy: max-iterations (cap 5) | convergenceThreshold: 3 (telemetry-only; see config `_thresholdNotes`)

## Topic

ROUND THREE of the overengineering lane: five bounded iterations on angles the first two rounds covered thinly or not at all. Round one (GLM 5.3 Flash, lineage `glm-5-3-flash-overengineering`) and round two (DeepSeek V4 Flash, lineage `deepseek-v4-flash-overengineering`) each ran ten iterations; their syntheses are `research/lineages/glm-5-3-flash-overengineering/research.md` and `research/lineages/deepseek-v4-flash-overengineering/research.md`; the census that judged every row of both rounds is `research/confirmed-findings.md`; every confirmed row was remediated in children 011 (`command-surface-contract-realignment`), 012 (`pre-existing-test-repair`) and 017 (`completion-gate-and-catalog-alignment`).

The five angles (one iteration each, in order):

1. **Rule value, first half** — `runtime/cli/lib/validator-registry.json` rows 1-12: header comment of each rule script; defect class, sibling/template overlap, test-name coverage by rule id. A rule with an overlapping sibling and no test is a finding.
2. **Rule value, second half** — registry rows 13-39, header comments only, at most 12 reads; group by family (graph-metadata, canonical-save, acceptance) and judge the family once.
3. **Command surface overlap** — step lists of `/speckit:*` command assets under `.opencode/commands/speckit/` (at most 8 files, steps only): one table command → workflow owned → other commands repeating the same steps. Triple-duplicated step sequence = finding with the merge named; a command whose every step another command performs = finding.
4. **Reachability of the references corpus** — SKILL.md routing/reference sections + `references/README.md`s vs full directory listing of `references/` and `assets/`; a file reachable only by browsing is a P2 finding, grouped by directory.
5. **Coupling from the neighbouring skills** — paths into `system-spec-kit/runtime` from `system-deep-loop` and `sk-doc`; classify each as documented surface (CLI script, dist entry point, shared package) or internal reach (lib module, fixture, private helper); every internal reach is a finding.

## Research Charter

### Role
Skeptical auditor — every claim unverified until cited. A rule, doc, gate, or abstraction earns its keep only by visibly improving one of: better output, better AI adherence in practice, lower maintenance. Absence of harm is not justification.

### Required output shape per finding
One row: `path:line` (claim side / actual side); claimed vs actual in one sentence each; severity P0|P1|P2; recommendation remove|merge|fix|document; at most 12 rows per iteration. Short list of what the angle verified as correct. Open questions.

### Non-Goals
- No edits; research only.
- No redesign, no prose-style review, no repository-wide census.
- Never write a script, harness, re-implementation or census program; read files and compare lines by hand; sample at most 8 items where a set is larger.
- Never run validate.sh, node tooling or git; compiled dist/ directories are untracked and stale. Read the checked-in source; code overrides self-reported success and every document.
- Do not re-report a row the census marks fixed/kept/recorded unless new evidence shows its stated reason is wrong.
- Never reuse an earlier count; if you cannot recount within the call budget, say so instead of guessing.
- Writes ONLY under the lineage directory (see writeSurface); any other write fails the lineage.

### Stop Conditions
- 5 iterations completed → synthesis with stopReason `maxIterationsReached` (hard).
- 3 consecutive iteration failures → stuck recovery; if recovery fails, halt to synthesis with gaps documented.
- An iteration that would need more than its budget records what it did not read as an open question.

## Key Questions (5 — one per iteration)

1. **KQ-R3a**: Registry rows 1-12 — which rules catch a defect class no sibling or template catches, and which have neither a distinguishing defect class nor a test?
2. **KQ-R3b**: Registry rows 13-39 — what do the graph-metadata, canonical-save and acceptance families each catch, and are the internal members of each family redundant with each other?
3. **KQ-R3c**: Which workflow step sequences are duplicated across `/speckit:*` command assets, and is any command's whole body a strict subset of another's?
4. **KQ-R3d**: How much of the references/ and assets/ corpus is reachable by path from SKILL.md, a README or a command asset, and what is browse-only?
5. **KQ-R3e**: How do system-deep-loop and sk-doc reach into system-spec-kit/runtime — through documented entry points or through private internals?

## Known Context

- Census: `research/confirmed-findings.md` (read once in iteration 1).
- Prior syntheses: `research/lineages/glm-5-3-flash-overengineering/research.md`, `research/lineages/deepseek-v4-flash-overengineering/research.md` (read only if an angle sends me there).
- Round two read the rule bodies' existence but not row-by-row value; round one explicitly did NOT read the 39 rule-body contents. Rows 1-39 of the registry are therefore the thinnest-covered surface of the prior rounds.
- Prior rounds did not compare command-asset step lists against each other, did not measure reference-corpus reachability, and did not census neighbour-skill imports into system-spec-kit/runtime.

## Next Focus

Iteration 1: registry rows 1-12 + census read (one call).

## Post-loop notes (phase_synthesis)

- **What worked**: the five angles each produced unrecorded material (19 findings, 1 P1 / 18 P2); no census row was re-reported without new evidence; census kept-rows (F6, F8, F23) were respected; counts were all re-measured in this tree.
- **What failed / budget limits**: iteration 2 read 12 of 21 rule headers (8 unread); iteration 4 did not read the 17 browse-only files' bodies; test-name coverage is id-string based (behavior tests not read); the playbook's broken npx commands were not executed (node tooling excluded).
- **Next focus (successor lineage)**: behavioral confirmation of F3-01/F3-02, the 14 document-orphan bodies, the validate.sh cadence mapping, and the fanout test home.
