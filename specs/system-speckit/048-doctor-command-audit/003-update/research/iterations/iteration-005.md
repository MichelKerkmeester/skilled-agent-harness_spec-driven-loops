# Iteration 005 — Q3: Alignment-Proposal Mechanics for Customized Skills

## Focus

Q3: for a customized skill such as sk-git or sk-code, how should the updater build an alignment proposal against the latest release that keeps the repo's override specifics, and how is that proposal presented, approved and applied in a guided, evidence-backed way? The align route shape was sketched in iteration 4 (proposals only, hand application to apply); the merge machinery was ungrounded.

## Actions Taken

1. Searched the tree for existing three-way/merge/hash/provenance machinery (`rg` over `.skilled/` for `merge-file|diff3|three-way|customiz|provenance|sha256`).
2. Read the build/capture/carry/finalize/revert sections of `.skilled/bin/compiled-route-sync.cjs` (lines 440–545, 560–605, 756–856, 930–990) and its three-way test.
3. Read sk-git's guided merge-conflict flow (`references/finish-workflows.md` §Merge Conflicts) and a full release note (`changelog/v1.8.0.0.md`).
4. Read the preserve-first field list in `.skilled/skills/sk-doc/sk-create-skill/scripts/regenerate-skill-derived.cjs` and the skill-advisor provenance machinery (`runtime/schemas/skill-derived-v2.ts`, `runtime/lib/derived/sync.ts`, manual playbook AI-003 `provenance-and-trust-lanes.md`).
5. Verified the git-history signal per skill (`git log --oneline -- .skilled/skills/sk-git`) and the repo-level changelog mirror (`.skilled/changelog/sk-git/` vs `.skilled/skills/sk-git/changelog/`: 23 files each, identical listings).

All researched paths were read-only. No out-of-scope writes were attempted.

## Findings

### F-005-1 — The repo already ships a proven three-way reconciliation transaction whose merge policy is exactly the one align needs

Evidence: `.skilled/bin/compiled-route-sync.cjs`.

- `build()` (lines 756–870) stages a new tree at `<runtimeRoot>.staging-<publicationId>`, then retains the prior serving root by rename to `<runtimeRoot>.rollback-<publicationId>`, and records in publication state: `priorClosureFingerprint`, `currentClosureFingerprint`, and `baselineExternalManifests` (lines 838–847). Base, ours and theirs are first-class, fingerprint-verified states.
- `captureExternalActivationManifests()` (lines 455–479) snapshots every non-owned entry byte-preserving with a sha256 fingerprint; `baselineExternalFingerprints()` (526–528) records them.
- `carryExternalManifests(sourceRoot, targetRoot)` (566–578) is the merge rule, stated in the code comment: entries present in source but absent from target are carried forward; an entry already present in target is left alone — "the target is the newer side, and this tool never deletes an activation manifest."
- The optimistic-concurrency guard is hash-based: `writeExternalManifestAtomic(activationRoot, entry, expectedFingerprint)` (530–541) refuses when the current bytes' fingerprint differs from the expected baseline; `validatePublicationBinding()` (580–598) refuses both `finalize` and `revert` when either closure fingerprint has moved since publication.
- `finalize()` (940–952) and `revert()` (954+) are symmetrical and resumable (`resumeFinalizeCleanup`, `resumeRevertCleanup`); revert renames the failed tree aside rather than deleting it, with verified restoration of whichever closure can be proven intact.
- Test: `.skilled/bin/tests/compiled-route-manifest.test.cjs:691` — "three-way reconciliation preserves a serving-only external update" asserts a serving-root edit survives a full `build → finalize` cycle with `reconciled: []` and byte-identical content.

Transfer to skill alignment: base = the release the checkout is on; ours = the operator working tree; theirs = the latest release tree. Any file changed locally is "target-present, newer" and must never be overwritten — it routes to a proposal. Local-only additions are carried; local deletions are respected and never resurrected. This is a set-granular (whole-file) three-way policy, not a line merge, and it is the repository's own precedent.

### F-005-2 — `provenance_fingerprint` is a schema-locked sha256 of SKILL.md-derived content — a cheap block-level change signal

Evidence: `.skilled/skills/system-skill-advisor/runtime/schemas/skill-derived-v2.ts:45` requires `provenance_fingerprint: z.string().regex(/^sha256:[a-f0-9]{64}$/)`; `runtime/lib/derived/sync.ts:76–79` states it "is deterministic from the source bytes," while every other derived field reflects extracted/normalized SKILL.md content; manual playbook AI-003 (`provenance-and-trust-lanes.md`) requires fingerprints "stable across reindex for unchanged content" and changed for mutated sources.

`.skilled/skills/sk-doc/sk-create-skill/scripts/regenerate-skill-derived.cjs` lists `provenance_fingerprint` in `PRESERVED_FIELDS` (line 43) and never recomputes it — the advisor runtime is the writer, the regenerator preserves. Trust lanes (`author`, `frontmatter`, `body`, `examples`, `local_docs`, `derived_local`/`derived_generated`) are tracked per derived block, not per file.

Consequence: a cheap pre-filter for "SKILL.md content changed since the release," but it is block-level, not whole-tree, and its exact hash input is unverified this iteration (Q3a). File-level precision still needs a hash manifest the updater records itself.

### F-005-3 — sk-git already defines the guided, evidence-first conflict-resolution idiom align should copy

Evidence: `.skilled/skills/sk-git/references/finish-workflows.md:893–930`. Order: report the conflict list; offer A) Resolve now / B) Abort and use the PR route / C) Abort and keep the branch; show `git diff <file>` details; the user resolves; `git add`; commit; run the test command. Human writes the resolution; the tool never merges silently.

Combined with iteration 4's finding that the doctor family's wording lives in `-presentation.txt` assets and approvals gate at phase boundaries, align's proposal UX is fully grounded: one evidence card per customized file or skill with adopt-release / keep-local / keep-local-and-record choices, and apply consumes only explicit decisions.

### F-005-4 — Release notes carry machine-readable version identity and a drift-check idiom align can mirror

Evidence: `.skilled/skills/sk-git/changelog/v1.8.0.0.md` — frontmatter `title: "sk-git v1.8.0.0"`, description, trigger_phrases; sections "Why This Release", "What's New at a Glance", "Upgrade Notes"; line 34 states "A drift check fails when the prose and the block disagree, in either direction." The repo-level mirror `.skilled/changelog/sk-git/` matches `.skilled/skills/sk-git/changelog/` file-for-file (23 each).

Consequence: a proposal can be keyed by (skill, version), cite its changelog entry as rationale, and be validated against the tree with the same drift-check discipline — a proposal whose evidence no longer matches the tree is stale and must be refused at apply time.

### F-005-5 — Git history is a live signal; in-file provenance markers are a gap, not a resource

Evidence: `git log --oneline -- .skilled/skills/sk-git` returns local commits (`8270100873 fix(sk-git): refuse a Spec trailer that points outside the packet root`, …), so `git diff <release-tag>..HEAD -- <skill-path>` is cheap when git metadata exists. In contrast, promoted compiled-route copies carry no generated-file banner — `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs` opens with a plain shebang and WHY comments, no origin stamp. Nothing in the tree currently states "this file is release-X bytes," so the updater must record its own base manifests (divergence ledger).

### F-005-6 — Proposed alignment mechanics (design synthesis grounded in F-005-1..5)

- Classification per file, base-vs-local-vs-release: unchanged → take release; changed locally → proposal; local-only → carry forward; locally deleted → respect the deletion. (Generalizes the carryExternal semantics from hub manifests to skill files.)
- Evidence bundle per conflicted file: base/local/release blob references plus sha256 fingerprints plus `git diff` hunks, rendered like sk-git's conflict list. Never auto-write merged text: the repo's precedent carries whole entries and leaves line resolution to the human.
- Decision vocabulary per file: `adopt-release` | `keep-local` | `keep-local-and-record-divergence`; per skill: `defer`.
- Artifacts: proposal JSON plus its presentation rendering live in the route's run-scoped state dir, never in the skill tree; a divergence ledger records `{path, baseFingerprint, localFingerprint, releaseFingerprint, decision, decidedAt}` so the next run has an explicit base — closing the gap that `provenance_fingerprint` covers only the derived block.
- Apply: consumes accepted decisions only; staging/rollback roots, closure fingerprints and the optimistic-concurrency guard mirror `compiled-route-sync`; cleanup is resumable; the post-apply battery from iteration 4 runs before the advisor reindex writes fresh fingerprints/lanes.

## SCOPE VIOLATIONS

None. All writes were confined to this run's research directory; all researched paths were read-only.

## Questions Answered

- **Q3 (core)**: The merge machinery is now grounded. The repo's own three-way policy is set-granular carry/never-overwrite with fingerprint-guarded base state (F-005-1); the guided resolution flow is sk-git's conflict idiom (F-005-3); proposals can be version-keyed and drift-checked via changelog files (F-005-4); the base ledger must be recorded by the updater because no in-file origin markers exist (F-005-5); the full mechanics are specified in F-005-6.
- **Q2 (partial)**: `provenance_fingerprint` (sha256, deterministic from source bytes) is a block-level change signal (F-005-2); git history is confirmed live (F-005-5); in-file provenance markers do not exist today (F-005-5).

## Questions Remaining

- **Q1 / Q1a**: release detection (local tag / changelog version / frontmatter version vs latest upstream) and the degradation path when git metadata or `gh` auth is absent — now the blocking dependency, because Q3's base resolution needs per-file bytes at the detected release.
- **Q3a (new)**: exact hash input of `provenance_fingerprint` (`lib/derived/provenance.ts`) and whether it covers raw SKILL.md bytes closely enough to serve as a pre-filter.
- **Q3b (new)**: whether the divergence ledger ships as a git-tracked file (audit, merge conflict risk) or a gitignored run-state file (clean tree, weaker audit).
- **Q4**: final disposition of the DB rebuild — needs a decision record.
- **Q5a**: exact flag surface (`--dry-run` default? `--accept <proposal>?`) and whether align ever applies or always hands off to apply.
- **Q1c**: system-skill-advisor frontmatter/changelog mismatch — error or warning (carried).

## Next Focus

Q1: release detection and the degradation path (Q1a), including per-file base resolution at the detected release — the remaining blocker for the align/apply split.
