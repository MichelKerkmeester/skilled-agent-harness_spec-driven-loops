# Iteration 5: Adversarial Consistency and Rollback Reconciliation

## Focus

Challenge the prior rename/reference closure, one-writer `manifest.json` v2 design, command evidence, frozen-history classification, and Checkpoint A/B rollback claims. The narrow decision was whether the remaining exact reducer question is sufficiently answered after corrections, not whether all implementation prerequisites are already built.

## Actions Taken

1. Re-read detached config/state/strategy, the reducer registry, and iterations 1, 3, and 4; verified iteration 5, `stopPolicy=max-iterations`, `progressiveSynthesis=false`, and the lineage-only write boundary. [SOURCE: .opencode/specs/sk-design/012-style-database-and-interface-commands/007-gap-remediation-research/002-naming-manifests/research/lineages/sol-high-fast/deep-research-config.json:3-20] [SOURCE: .opencode/specs/sk-design/012-style-database-and-interface-commands/007-gap-remediation-research/002-naming-manifests/research/lineages/sol-high-fast/deep-research-strategy.md:225-245]
2. Re-ran exact legacy-token inventory over the live `sk-design` skill and searched planned/in-progress `sk-design` packets for external references; compared the result with iteration 1's 46-file/140-reference claim. [INFERENCE: bounded `rg --count-matches "_db|_engine|_harness|_manifest\\.json|_retrieval-manifest\\.json" .opencode/skills/sk-design` returned 144 matches in 47 files] [SOURCE: .opencode/specs/sk-design/015-styles-database-evolution/spec.md:12-25]
3. Rechecked package scripts, README commands, computed paths, and environment-selected adapter behavior, distinguishing repository-declared commands from inferred or non-executable-as-written commands. [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/package.json:13-20] [SOURCE: .opencode/skills/sk-design/styles/manual-testing-playbook.md:13-39] [SOURCE: .opencode/skills/sk-design/styles/_engine/persistent-adapter.mjs:97-110]
4. Traced the harness's parse/write, slug, and lifecycle behavior against the proposed v2 envelope and the engine's current ID/provenance/reuse projection. [SOURCE: .opencode/skills/sk-design/styles/_harness/extract-refero.mjs:251-272] [SOURCE: .opencode/skills/sk-design/styles/_harness/extract-refero.mjs:314-315] [SOURCE: .opencode/skills/sk-design/styles/_harness/extract-refero.mjs:392-435] [SOURCE: .opencode/skills/sk-design/styles/_engine/manifest.mjs:434-513] [SOURCE: .opencode/skills/sk-design/styles/_engine/manifest.mjs:584-637]
5. Walked Checkpoint B backward through old reader/writer compatibility and database generation retention, separating the corpus manifest from the DB publication pointer while testing whether the claimed rollback remains available after multiple v2 generations. [SOURCE: .opencode/skills/sk-design/styles/_db/generation-manifest.mjs:121-185] [SOURCE: .opencode/skills/sk-design/styles/_db/operator.mjs:123-185]

## Findings

1. **Confirmed prior finding: the five-name map and name-first/schema-second boundary remain correct.** `_db`, `_engine`, `_harness`, `_manifest.json`, and `_retrieval-manifest.json` are authored path names, and the environment-selected `SK_DESIGN_STYLE_DB_MODE` changes adapter behavior rather than dynamically selecting a filesystem module path; the adapter's database imports are still static and belong in Checkpoint A. [SOURCE: .opencode/skills/sk-design/styles/_engine/persistent-adapter.mjs:97-110] [SOURCE: .opencode/skills/sk-design/styles/_engine/persistent-adapter.mjs:9-13] [INFERENCE: no evidence invalidates the five moves or the separate name-only parity checkpoint]

2. **Confirmed correction: the 46-file/140-reference closure is stale and cannot be used as the implementation baseline.** The same bounded live-skill count now returns **144 occurrences in 47 files**. The safe plan must regenerate and retain a machine-readable pre-cutover inventory at implementation time rather than hard-code iteration 1's count; success is zero mutable legacy matches after classified frozen exceptions, not equality to 46/140. [INFERENCE: current bounded `rg --count-matches` output contains 47 file rows whose counts sum to 144] [SOURCE: .opencode/skills/sk-design/styles/manual-testing-playbook.md:13-25]

3. **Confirmed correction: “frozen history” does not cover all references outside the live skill.** Packet 013 still declares itself `In progress` and uses `_db/retrieval.mjs` as a key file and current problem anchor; packet 015 and its children are planned at 0% and carry `_db` paths in continuity, file tables, tasks, checklists, and generated graph metadata. These are active planning/resume consumers and must be patched or regenerated during Checkpoint A. Completed implementation summaries, completed extraction packets, and changelogs remain frozen evidence and should not be rewritten. [SOURCE: .opencode/specs/sk-design/013-styles-database-rust-opportunities/spec.md:10-25] [SOURCE: .opencode/specs/sk-design/013-styles-database-rust-opportunities/spec.md:35-53] [SOURCE: .opencode/specs/sk-design/015-styles-database-evolution/spec.md:10-25] [SOURCE: .opencode/specs/sk-design/015-styles-database-evolution/spec.md:52-63] [SOURCE: .opencode/specs/sk-design/015-styles-database-evolution/004-growth/spec.md:10-29] [SOURCE: .opencode/specs/sk-design/015-styles-database-evolution/004-growth/spec.md:85-93]

4. **Confirmed correction: the command matrix needs an executable-fixture gate.** Backend `typecheck`, `build`, and `test` are package-declared, and the four mode-corpus `node --test` commands are README-declared. The database test glob is also documented, contrary to iteration 4's “inferred only” wording, but the same playbook requires repo-root execution while spelling `node --test styles/_db/__tests__/*.test.mjs`, a path that exists only relative to the skill root. The fully rooted DB command is therefore inferred until run; the engine playbook names `styles/_engine/__tests__/*` without an exact executable command. Checkpoint A must record successful baseline exits for both corrected full paths before treating them as gates. [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/package.json:13-20] [SOURCE: .opencode/skills/sk-design/design-motion/corpus/README.md:18] [SOURCE: .opencode/skills/sk-design/design-foundations/corpus/README.md:17] [SOURCE: .opencode/skills/sk-design/design-interface/corpus/README.md:29] [SOURCE: .opencode/skills/sk-design/design-audit/corpus/README.md:32] [SOURCE: .opencode/skills/sk-design/styles/manual-testing-playbook.md:13-39]

5. **Confirmed correction: one writer is necessary but not sufficient for safe v2 authority.** The current harness converts every read/parse failure into `[]` and writes the whole manifest directly; carrying either behavior into v2 could erase state after corruption or expose torn bytes. The v2 writer must fail closed, validate before mutation, publish atomically with directory durability, and enforce cross-field/lifecycle rules in addition to exact keys/types/uniqueness: `captured` requires non-null slug/captured time and null error; new `pending` rows have null capture fields; `stale` preserves captured identity; `error` preserves any prior slug/capture and requires an error; IDs and non-null slugs are unique; and only the harness performs declared transitions. [SOURCE: .opencode/skills/sk-design/styles/_harness/extract-refero.mjs:314-315] [SOURCE: .opencode/skills/sk-design/styles/_harness/extract-refero.mjs:392-435] [INFERENCE: iteration 3's exact-key/type/uniqueness validator did not specify these corruption, publication, cross-field, or transition invariants]

6. **Confirmed correction: the shared projector needs explicit ID/slug and provenance-refresh rules.** Current records prefer artifact UUID over crawl UUID, join acquisition state by slug, and reuse an unchanged-content record while refreshing only `id` and `status`; source URL, captured time, and provenance status can therefore remain stale after acquisition-only changes. A recapture also recomputes slug from the current name and can create a new directory without deleting the old one, after which directory scanning can expose two artifacts for one UUID. V2 must require artifact UUID equals entry `id`, map by stable ID before slug, define atomic slug-directory rename/orphan rejection, and either rebuild provenance on every acquisition change or bind reuse to a per-entry acquisition hash. Provenance `status` must explicitly say whether a manifest fallback counts as known. [SOURCE: .opencode/skills/sk-design/styles/_harness/extract-refero.mjs:251-272] [SOURCE: .opencode/skills/sk-design/styles/_harness/extract-refero.mjs:323-332] [SOURCE: .opencode/skills/sk-design/styles/_engine/manifest.mjs:448-513] [SOURCE: .opencode/skills/sk-design/styles/_engine/manifest.mjs:584-621] [SOURCE: .opencode/skills/sk-design/styles/_db/indexer.mjs:656-722]

7. **Partially confirmed with rollback correction: DB pointers remain distinct, but Checkpoint B is not symmetric as written.** The DB generation manifest is correctly separate corpus-external publication state and accepts legacy pointer shapes. However, restoring old code after the canonical file has been overwritten with v2 also requires a validated v2-to-v1 downgrade (or retained exact v1 snapshot) before the old harness/engine runs; the current harness expects an array and does not normalize v2. Likewise, DB retention keeps only current plus one rollback target, so the pre-v2 generation can be pruned after another v2 build. B4/B5 must pin the pre-v2 corpus snapshot, retrieval bridge bytes or deterministic regeneration recipe, and pre-v2 DB generation artifacts until final acceptance; rollback then flips/downgrades in the reverse order before old readers start. [SOURCE: .opencode/skills/sk-design/styles/_harness/extract-refero.mjs:314-315] [SOURCE: .opencode/skills/sk-design/styles/_harness/extract-refero.mjs:392-399] [SOURCE: .opencode/skills/sk-design/styles/_db/generation-manifest.mjs:121-185] [SOURCE: .opencode/skills/sk-design/styles/_db/operator.mjs:123-185]

## Questions Answered

- **Answered after correction:** Which imports, path literals, scripts, tests, documentation, configuration, and generated references must change, and in what safe sequence? The implementation sequence is: (1) regenerate/classify the exact repository inventory, including active packets and generated metadata; (2) prove the backend, four mode-corpus, corrected DB, and explicit engine commands on the old tree; (3) atomically move all five names and update static imports/constants, computed paths, fixtures, source generators, active docs/continuity, then regenerate derived metadata/output; (4) prove byte/observable parity and classified-token cleanliness; (5) separately add fail-closed v1/v2 normalization and projector invariants while retaining v1 outputs; (6) switch the writer and versioned generation identities only after semantic parity; (7) delete the bridge only after all readers and clean rebuilds prove independence, while rollback artifacts remain pinned. [SOURCE: .opencode/skills/sk-design/styles/_engine/persistent-adapter.mjs:97-110] [SOURCE: .opencode/skills/sk-design/styles/manual-testing-playbook.md:31-44] [SOURCE: .opencode/specs/sk-design/015-styles-database-evolution/spec.md:52-63] [INFERENCE: findings 2-7 reconcile the exact closure and safe ordering]

## Questions Remaining

- No original reducer key question remains unanswered.
- Implementation proof prerequisite: run and record the corrected engine/database glob commands; research confirms source ownership but not their exit status.
- Implementation proof prerequisite: define and test the exact v2 validator/transition table, ID-to-slug migration, acquisition-bound projector reuse, and v2-to-v1 downgrade bytes.
- Residual external unknown: repository search cannot prove there are no installed or out-of-tree consumers; release notes must state the path/schema break or provide an explicitly time-bounded compatibility policy if such consumers exist. [INFERENCE: local exact search covers the repository, not external installations]

## Ruled Out

- Treating the old 46-file/140-reference number as a stable acceptance fixture; the live closure has already changed. [INFERENCE: current bounded count is 47/144]
- Classifying every spec-folder hit as frozen history; packets 013 and 015 expose active continuity/planning references. [SOURCE: .opencode/specs/sk-design/013-styles-database-rust-opportunities/spec.md:35-42] [SOURCE: .opencode/specs/sk-design/015-styles-database-evolution/spec.md:52-63]
- Calling the DB command either fully confirmed or wholly absent: it is documented but inconsistent with its declared working directory. [SOURCE: .opencode/skills/sk-design/styles/manual-testing-playbook.md:13-39]
- Assuming DB legacy-pointer normalization preserves an arbitrarily old rollback generation; retention is current plus one rollback target. [SOURCE: .opencode/skills/sk-design/styles/_db/operator.mjs:123-185]

## Dead Ends

- No broad generic styles-tree documentation search was retried; exact legacy paths and current packet status supplied the needed classification without corpus prose noise. [SOURCE: .opencode/specs/sk-design/012-style-database-and-interface-commands/007-gap-remediation-research/002-naming-manifests/research/lineages/sol-high-fast/deep-research-strategy.md:64-69]
- No permanent multi-writer or permanent retrieval-cache target was reconsidered; the adversarial evidence strengthens the need for one fail-closed writer and a temporary bridge. [SOURCE: .opencode/specs/sk-design/012-style-database-and-interface-commands/007-gap-remediation-research/002-naming-manifests/research/lineages/sol-high-fast/deep-research-strategy.md:71-79]

## Sources Consulted

- Detached config, state, strategy, registry, and iterations 1, 3, and 4 under `research/lineages/sol-high-fast/`.
- Exact legacy-token `Grep` and bounded `rg --count-matches` over `.opencode/skills/sk-design` and active `sk-design` specs.
- `.opencode/skills/sk-design/styles/_harness/extract-refero.mjs:240-435`.
- `.opencode/skills/sk-design/styles/_engine/manifest.mjs:420-649`.
- `.opencode/skills/sk-design/styles/_engine/persistent-adapter.mjs:90-139`.
- `.opencode/skills/sk-design/styles/_db/indexer.mjs:620-764`.
- `.opencode/skills/sk-design/styles/_db/canonical.mjs:1-70`.
- `.opencode/skills/sk-design/styles/_db/generation-manifest.mjs:1-308`.
- `.opencode/skills/sk-design/styles/_db/operator.mjs:120-185`.
- `.opencode/skills/sk-design/styles/manual-testing-playbook.md:1-49` and backend/mode package/README command sources.
- `.opencode/specs/sk-design/013-styles-database-rust-opportunities/spec.md:1-70`.
- `.opencode/specs/sk-design/015-styles-database-evolution/spec.md:1-73` and `004-growth/spec.md:1-110`.

## Assessment

- New information ratio: **0.89**. Five findings are fully new corrections, one partially sharpens prior DB-pointer evidence, and one confirms prior conclusions: `(5 + 0.5 * 1) / 7 = 0.786`, plus a 0.10 simplicity bonus for closing the exact reducer question after reconciling contradictions, rounded to 0.89.
- Questions addressed: exact reference closure; active-versus-frozen consumers; executable command evidence; v2 writer/invariants; nullable slug and ID mapping; provenance refresh; rollback symmetry; DB pointer separation.
- Questions answered: the remaining exact reference-plan key question.
- Status: **complete** for this final evidence iteration; the workflow must stop at `maxIterationsReached` and synthesize outside the leaf.
- Edge case: contradictory evidence was resolved by correcting prior counts/classifications and preserving unexecuted-command and external-consumer unknowns.

## Reflection

- What worked and why: testing the plan backward from old readers and current resume metadata exposed failures hidden by forward-only source tracing.
- What did not work and why: the prior fixed match count and broad “spec history” category aged immediately and conflated completed evidence with active planning state.
- What I would do differently: implementation planning should generate the mutable/frozen inventory and command transcript as artifacts at each checkpoint instead of copying research-time counts.

## Recommended Next Focus

Proceed to implementation planning and proof prerequisites, not another research iteration: freeze the current repository inventory; define executable baseline commands and expected fixtures; specify v2 validation/transition/downgrade contracts; pin pre-v2 corpus, bridge, and DB generation rollback artifacts; then implement Checkpoint A and B as separately reviewable changes with reverse-order rollback rehearsals.
