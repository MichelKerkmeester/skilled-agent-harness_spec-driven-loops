# Hardening the spec-folder tooling and automating spec healing

Lineage: `pi-deepseek-flash-max` | 15 iterations | stop reason: maxIterationsReached

## Executive Answer

The branch's one-off repairs were mostly right, and most of them already have a permanent owner in the existing toolchain: `upgrade-legacy.mjs` is a staged, dry-run-first, refuse-to-invent migration pipeline; `repair-derived.cjs` recomputes derived facts; `heal-spec-docs.cjs` restores only literal template values; `migrate-generated-json.ts` rewrites disk-derived paths; and the census/cleanup pair is the reference shape for a safe mass repair. Three real gaps remain: (1) the core `spec.md` template nests the `questions` anchor around three other sections and the documented no-nesting rule is not implemented by the validator, so the defect regenerates without failing anything; (2) `archive.sh` and `restore_spec` move packets without re-deriving the moved packet's recorded paths, which reintroduces the dominant baseline failure class; (3) missing-document reconstruction and anchor-structure repair have no tooling. For old and pre-v4 repos, the migration path already exists and should be exposed through the doctor surface as detect, dry run, apply, with the `upgrade-baseline.json` grandfathering ledger as the record of what a tool must never invent.

---

## 1. Method and Evidence Base

- Branch inventory: 10 commits, 2,641 files changed against the merge base, dominated by two corpus commits (1,856 and 898 files) and two tooling commits (7 and 79 files).
- Failure taxonomy: re-derived from the scratchpad reports; baseline 2,083 failing folders led by `METADATA_DISK_PATH_CONSISTENCY` (2,898), `ANCHORS_VALID` (510), `SPEC_DOC_INTEGRITY` (417); latest snapshot 474 folders led by `ANCHORS_VALID` (235), `GREP_CONVENTION` (152), `LEVEL_MATCH` (131), `FILE_EXISTS` (131).
- Phase 013 baseline: 4,371 packets, 2,046 failing (1,935 archived), 470 archive files with template phrases, 102 packets missing level-required documents.
- Rule-to-producer mapping from the validator registry (42 rules) and the rule implementations.
- Migration mechanics from `upgrade-legacy.mjs`, its three stage tools, and the validator's baseline reader.
- Adversarial pass: the anchor premise was refuted against the live implementation and corrected here.

---

## 2. Question 1: Which one-off repair fixes should become permanent idempotent tooling, and where should each live?

**Answer.** Two of the four one-off classes are already owned and need only a regression test; two need real additions to the existing pipeline.

| One-off | Permanent home | Status |
|---------|----------------|--------|
| `fix-specfolder.mjs` | `migrate-generated-json.ts` (computes `specFolder` from disk) | Already owned |
| `add-fm-fields.mjs` | `fill-frontmatter` step via `frontmatter-migration.ts` | Already owned |
| `fix-dup-anchors.mjs` | No owner: no pipeline step edits anchors; `heal-spec-docs` only reads them | Gap |
| Missing-document reconstruction | Deliberately not automatable; lane work with a dated note | Stays a lane |

The permanent tooling should live inside `upgrade-legacy.mjs`'s step order, not beside it: `fill-frontmatter -> heal-spec-docs -> repair-derived -> migrate-generated-json`, with two additions, an anchor-structure step (prose-preserving rules proven by `fix-dup-anchors.mjs`) and, for archive moves, a packet-level re-derive in `archive.sh` and `restore_spec`.

**Evidence.** Pipeline and step order `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:589]`; repair boundary `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/README-repair-derived.md:23]`; no anchor step anywhere in the pipeline `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:392]`.

**Key recommendations.** R-005 (post-move re-derive, plus R-040's end-to-end archive test), R-014 (anchor repair step), R-011/R-017 (adopt the census/cleanup shape; permanent heal modes from the nine lane rules), R-015 (keep reconstruction a lane), R-001/R-024 (a census that reports per class before any write).

---

## 3. Question 2: What causes each validation failure class at the source, and how do we stop new instances?

**Answer.** The classes and their producers:

| Class | Producer | Stop-new-instances fix |
|-------|----------|------------------------|
| `METADATA_DISK_PATH_CONSISTENCY` (2,898 baseline occurrences) | Path recorded at creation; `archive.sh`/`restore` move the folder without re-deriving the moved packet's `description.json` `specFolder`, `graph-metadata.json` `spec_folder`, or frontmatter pointer | Post-move re-derive in both move paths (R-005 + R-040) |
| `ANCHORS_VALID` (510 -> 235) | Duplicate/never-closed/orphan markers, from template copies and old templates; the core template nests `questions` around `nfr`, `edge-cases`, `complexity` | Fix the template; resolve the doc-vs-code divergence (R-008, R-039) |
| `GREP_CONVENTION` (195 -> 152) | Old documents with no frontmatter block, single-token author phrases, uppercase basenames; template-default phrases are already at zero live carriers | Route the no-frontmatter class to `fill-frontmatter` (R-012, R-032) |
| `FILE_EXISTS` / `LEVEL_MATCH` (180/180 -> 131/131) | Packets missing level-required documents and declared levels that disagree with the docs | Reporting + lane reconstruction; the level half is derivable and repairable |
| `TEMPLATE_SOURCE` (99 -> 76) | Old template versions without the header, or headers whose anchor set does not match | `heal-spec-docs` already owns it (anchors prove provenance) |
| `FRONTMATTER_VALID` (95 -> 33) | Empty or missing authored fields; a grandfather allowlist already exists for old docs | `fill-frontmatter` step + grandfather list |
| `SCAFFOLD_NEVER_TOUCHED` (42 -> 30) | Scaffold markers in docs whose `spec.md` claims Complete | Heal mode; report first |

The single highest-leverage cause is the template anchor nesting, because it regenerates in every new packet; the single highest-volume cause is the move without re-derive.

**Evidence.** Path check semantics `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-metadata-disk-consistency-helper.cjs:1]`; archive move sequence `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh:277]`; template nesting `[SOURCE: .skilled/skills/system-spec-kit/templates/core/spec.md.tmpl:184]`; scaffold render `[SOURCE: specs/system-speckit/034-spec-folder-tooling/014-spec-auto-healing-research/research/scaffold-sample/spec.md.txt:128]`.

**Correction from the adversarial pass.** The live `ANCHORS_VALID` implementation does NOT enforce the documented no-nesting rule; it checks only missing anchors, duplicate opens, unclosed opens and orphan closers `[SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:698]`. The nesting defect therefore passes validation today; it is a template-contract bug with extraction cost, not a validator failure. R-039 records the doc-vs-code divergence for resolution.

---

## 4. Question 3: How should an older or pre-v4 repo be detected and migrated or healed safely, and how does that fit /doctor:update?

**Answer.** Detect by evidence, heal by pipeline, record what cannot be derived, and never invent.

**Detection.** "Pre-v4" is a bundle of independent eras, measured in this corpus: old template header versions (`resource-map | v1.1` 224 vs `v2.2` 98), header naming drift (three spellings of the implementation-summary header), 74 archived packets without `description.json` and 77 without `graph-metadata.json`, and documents with no frontmatter. The detector should be a census with one shared packet classifier, an explicit exclusion list (containment copies, research lineages, scratch, changelog), and per-class counts routed to their owning stage. A single repo version verdict would be fiction.

**Migration mechanics (already built).** `upgrade-legacy.mjs` validates every packet, repairs only failing non-archived packets through the staged pipeline, re-validates, and records whatever remains in `upgrade-baseline.json`; the validator relaxes a recorded finding to a warning while anything unlisted stays an error; five derivable rules can never be recorded and must be repaired; a packet that passed before and fails after a repair step stays an error so pipeline damage is never hidden; archived packets are recorded, never repaired, unless `--include-archive` is deliberate. Dry run is the default and writes require `--apply`.

**The operator constraints, satisfied by design.** Dry run first (default); idempotent (unchanged-compare baseline, atomic writes, second-run-zero pattern); reversible (all edits in tracked files; deleting a baseline entry re-raises its error); never changes what a document says (the refusal boundary of `repair-derived` and `heal-spec-docs`, with one honest exception: the implementation-summary status cell aligned to `spec.md`, recorded in R-041); never invents history (reconstruction stays a lane with a dated note and "Not recorded" sentinels).

**Fit with /doctor:update.** The release engine is unit-based over `.skilled/` and has no unit kind for `specs/`, so corpus healing cannot be an engine unit. It fits as a check in the update apply battery (the battery already has name/command/repair triples with approval and rollback) or as a sibling doctor route; the "spec-kit version migration" trigger currently points at an update that migrates only tooling files, so the split should be documented (R-020, R-022).

**Evidence.** Apply flow `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:497]`; baseline write `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:442]`; validator read `[SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:930]`; never-recorded rules `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:94]`; battery pattern `[SOURCE: .skilled/commands/doctor/assets/doctor-update-apply.yaml:146]`; engine unit kinds `[SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:129]`.

---

## 5. Question 4: What should be hardened in this branch's own changes?

**CI rebuild job and token push.** The guards are sound (subject-based loop guard because the token push runs under the owner's name; secret fallback with a named error). Three hardenings: stage all four generator outputs (the index plus `corpus-manifest.json`, `generation-diagnostics.json`, `phrase-variants.json`) or derive the list from the generator; add a post-commit `--check`; and document the ruleset alternates because the personal-token mechanism is not portable to external users.

**Cleanup tools.** The census/cleanup pair is the reference shape (dry-run exact preview, `--apply` gate, idempotent second run, author rows byte-for-byte). Harden by routing skipped files (no frontmatter delimiter) to `fill-frontmatter` instead of leaving a skip count, and by adding an applied-state audit that compares the base-revision preview with the working tree, replacing sampled diff review.

**Seeder.** `create.sh` hardcodes a third copy of the 20 template-default phrases and a stop-word list shared with the cleanup tool. Keep one source (the templates or a file generated from them) and keep the pinning tests as extraction tests.

**Gate 3 wording.** The four choice labels are exported constants consumed by the Pi dialog, but the two menu lists still inline option C and use two different D wordings; the copy surface is 34 files. Use the constants in both lists and add a drift test.

**Evidence.** Workflow `[SOURCE: .github/workflows/trigger-index-rebuild.yml:12]`; generator outputs `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs:35]`; cleanup report `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-cleanup.mjs:370]`; seeder arrays `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:403]`; Gate 3 constants `[SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs:149]`.

---

## 6. Question 5: Which checks belong in CI or pre-commit so drift is caught early and cheaply?

- **Per-change CI (already exists):** `changed-packet-validation.yml` validates only packets whose own graded documents changed and blocks only regressions against the merge base. Template and scaffold regressions already surface here as failing packets; the missing piece is a test that catches them before they are committed.
- **Unit suites in `spec-kit-check.yml` (add):** scaffold-render anchor test for all levels (R-035), Gate 3 constants drift test (R-036), phrase-list extraction test (R-030).
- **Pre-commit (already the repair ceiling):** the hook auto re-mints derived metadata on staged changes and blocks only when it cannot fix. Do not add corpus sweeps here.
- **Pre-push (add if needed):** the applied-state audit and phrase-cleanup diff rule need a base revision or a staged range (R-033, R-034, R-038), alongside the existing mass-deletion, route, and track-root gates.
- **Weekly/advisory (add as a report):** the per-class census belongs in `strict-pass-freshness-report.yml` or the advisory suite, which are deliberately non-gating (R-037); the trigger-index sidecars and post-commit `--check` belong inside the rebuild workflow itself (R-029).

**Evidence.** Regression gate `[SOURCE: .github/workflows/changed-packet-validation.yml:48]`; weekly report rationale `[SOURCE: .github/workflows/strict-pass-freshness-report.yml:5]`; pre-commit re-mint `[SOURCE: .skilled/scripts/git-hooks/pre-commit:535]`; pre-push gates `[SOURCE: .skilled/scripts/git-hooks/pre-push:20]`.

---

## 7. The Model Behind the Answers

1. **Derived facts are tool work; authored facts are human work.** `repair-derived.cjs` and `heal-spec-docs.cjs` both refuse to author content, and `upgrade-legacy` records what it cannot derive rather than inventing it.
2. **Repair at the producer, not at the render.** The template anchor bug and the archive move are producers; fixing rendered packets alone leaves the source generating new defects.
3. **Dry run is the census.** Every safe tool in the tree is report-first with an `--apply` gate and a second-run-zero idempotence proof.
4. **Grandfathering is a ledger, not an amnesty.** `upgrade-baseline.json` keeps unresolved authored findings visible as recorded warnings; derivable rules can never be recorded.
5. **One classifier, one phrase source, one menu source.** The current duplication (packet-name regex in four places, phrases in three, Gate 3 wording in 34 files) is the drift engine behind the remaining convention failures.

## 8. Ruled Out

- A single repo version detector; a second migration pipeline; auto-reconstruction of missing documents; auto-fixing never-recorded rules via the baseline; extending the release engine to `specs/`; treating `/doctor:speckit` as the heal home; unifying the grammar and pairing anchor checks; writing a new path-repair tool; deleting author phrases to satisfy the judge.

## 9. Open Items and Risks

- The anchor doc-versus-code divergence (R-039) needs a maintainer decision; implementing no-nesting regrades the corpus and needs a baseline run first.
- The archive post-move step must settle both the description and the graph writer paths; the fixture test (R-040) is the proof.
- The status-alignment exception to "prose never changes" (R-041) should be stated in the operator contract, not left implicit.
- The census must exclude containment copies and research lineages or its counts are off by multiples (observed: 2,281 vs 8,198).

## 10. References

- `steer.md` (lead brief, this lineage).
- Iterations 1 to 15 and their deltas in this directory.
- Repository sources cited inline as `[SOURCE: path:line]`.

---

## 11. Ranked Recommendations (highest value first)

| Rank | Recommendation (IDs) | Answers | Where it lives | Effort | Risk | Key evidence |
|------|----------------------|---------|----------------|--------|------|--------------|
| 1 | Fix the core `spec.md` template's `questions` anchor per level and resolve the no-nesting doc-vs-code divergence (R-008, R-039) | Q1, Q2 | `templates/core/spec.md.tmpl`, `orchestrator.ts` anchor check, `validation-rules.md` | S-M | Med: template feeds every scaffold; per-level render tests bound it | Template lines 184/399/425 vs render sample line 128; rule 3 documented but unimplemented |
| 2 | Post-move re-derive in `archive.sh` and `restore_spec`, settling both `description.json` and `graph-metadata.json` paths, with an end-to-end archive fixture test (R-005, R-040) | Q1, Q2 | `archive.sh`, test suite | S | Low: report-first tool exists; writer split proven | Move at archive.sh:277/403; writers at migrate-generated-json.ts:358 and repair-derived.cjs:89 |
| 3 | Add the anchor-structure repair step with prose-preserving rules, run after `heal-spec-docs` so provenance anchors are read first (R-014, R-003) | Q1, Q2 | pipeline in `upgrade-legacy.mjs`, shared rules module | M | Med: only marker lines change; leave-ambiguous rule mandatory | No step edits anchors; fix-dup-anchors rules proven |
| 4 | Expose the old-repo migration as detect, dry run, apply with the baseline ledger documented, plus a per-class census on one shared classifier (R-021, R-023, R-024, R-026, R-027, R-028) | Q3, Q5 | `upgrade-legacy.mjs` mode plus doctor presentation | M | Low: read-only census, existing pipeline | Apply flow upgrade-legacy.mjs:497; baseline :442; measured classes |
| 5 | Add the corpus-heal check to the doctor update battery and document the update-vs-heal split at the version-migration trigger (R-020, R-022) | Q3, Q4 | `doctor-update-apply.yaml`, update docs | M | Med: approval gate and rollback bound it | Battery pattern doctor-update-apply.yaml:146; engine unit kinds release-update.cjs:129 |
| 6 | Harden the trigger-index rebuild: stage all generator outputs, add a post-commit `--check`, retry the push once, document ruleset alternates (R-029) | Q4, Q5 | `.github/workflows/trigger-index-rebuild.yml` | S | Low: CI-only | Generator writes four outputs; workflow stages one; no postcondition |
| 7 | Turn the nine lane rules into permanent dry-run-first heal modes, reconstruction staying a lane (R-017, R-015, R-019) | Q1, Q3 | `heal-spec-docs.cjs` + pipeline | M-L | Med: structure-only by rule; per-folder validation after apply | Lane brief rules; phase-spec NFRs |
| 8 | Single-source the phrase lists and the Gate 3 menus; add drift tests (R-030, R-031, R-036) | Q4, Q5 | templates/phrase-judge/create.sh; gate core + tests | M/S | Low-Med: wording and lists only | create.sh:403 triplication; constants partially consumed |
| 9 | Add the scaffold-render anchor test to the spec-kit suite (R-035) | Q5, Q2 | cli tests under `spec-kit-check.yml` | S | Low: deterministic | No gate renders templates today |
| 10 | Route cleanup skips to `fill-frontmatter`, add the applied-state audit and the CI/pre-push phrase diff rule (R-032, R-033, R-034, R-038) | Q4, Q5 | cleanup tool, CI advisory/pre-push | M | Med: audit needs a pinned base; diff rule needs tolerance | Cleanup report shape; 21 skipped files; sampled-diff control |
| 11 | Add a scaffold-time structural self-check and the frontmatter heal class for required documents (R-009, R-012) | Q1, Q2 | `create.sh`, heal tooling | S-M | Low-Med: report/check first | Broken scaffold shipped; detail3 no-frontmatter counts |
| 12 | Keep reconstruction a lane, keep phrase warnings advisory, and state the status-alignment exception honestly (R-015, R-013, R-041) | Q3, Q4 | docs and policy | S | Low: policy wording | Lane rule 7 edits a status cell; judge refuses author rewrites |
