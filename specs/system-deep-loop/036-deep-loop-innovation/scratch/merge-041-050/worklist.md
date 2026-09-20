# Worklist — nest ten former top-level packets under the 036 phase parent

Scratch workspace for the 2026-09-20 merge. The durable record lives in the packet docs
(`spec.md`, `timeline.md`, `changelog.md`, `before-and-after.md`); this file carries the
working state, the placement map and the receipts.

## Baseline (recorded 2026-09-20, before any mutation)

- Branch: current branch, no worktree. HEAD: `c1817442b25afebba69ac46e50a7b19a1998e96c`.
- Rollback: everything is git-tracked; undo is `git reset --hard c1817442b2`, or
  `git checkout -- <paths>` plus reversing the `git mv` set. No push, no history rewrite.
- Pre-move validation: `validate.sh specs/system-deep-loop/036-deep-loop-innovation --strict --recursive`
  → `RESULT: PASSED`, Errors 0, Warnings 1 (GREP_CONVENTION single-token keys in a leaf packet).
  Receipt: `baseline-validation.txt`.
- Pre-existing working-tree deletions (030–035 hosts, other spec trees, `.opencode` dirs) are
  unrelated and untouched; staging is by explicit path only; `git add -A` is forbidden.

## Placement map (destination = `specs/system-deep-loop/036-deep-loop-innovation/<parent>/<child>`)

| Former path (`specs/system-deep-loop/…`) | Destination inside the 036 parent | Files (md/json/other) |
|---|---|---|
| `041-cli-pi-devpass-glm-route` | `007-executor-and-cli-hardening/008-cli-pi-devpass-glm-route` | 7 (4/2/1) |
| `044-cli-pi-devpass-deepseek-route` | `007-executor-and-cli-hardening/009-cli-pi-devpass-deepseek-route` | 6 (4/2/0) |
| `045-fanout-write-containment-hardening` | `007-executor-and-cli-hardening/010-fanout-write-containment-hardening` | 818 (278/202/338) |
| `046-synthesis-chat-presentation` | `003-mode-contracts-migration-and-cutover/005-synthesis-chat-presentation` | 8 (5/2/1) |
| `047-deprecate-skill-benchmark` | `003-mode-contracts-migration-and-cutover/006-deprecate-skill-benchmark` | 8 (5/2/1) |
| `048-fanout-convergence-mode-flag` | `002-substrate-and-orchestration/008-fanout-convergence-mode-flag` | 6 (4/2/0) |
| `050-spec-protocol-ledger-events` | `002-substrate-and-orchestration/009-spec-protocol-ledger-events` | 12 (7/4/1) |
| `042-deep-loop-test-debt` | `006-runtime-docs-and-integrity-hardening/012-deep-loop-test-debt` | 7 (4/2/1) |
| `049-deep-loop-alignment-review` | `006-runtime-docs-and-integrity-hardening/013-deep-loop-alignment-review` | 349 (158/62/129) |
| `043-review-leaf-protocol` | `008-review-and-rollback-followup/005-review-leaf-protocol` | 7 (4/2/1) |

Destination numbers are free against each parent's current maximum. Children of `045` (20)
and `049` (17) keep their numbers; only the parent path changes. The 036 parent keeps exactly
28 direct children — the ten land one level deeper, inside five existing group parents.

`045` carries 20 numbered children plus `research/`, `review/`, `review-archive/` and `scratch/`;
`049` carries 17 numbered children.

## Pre-move census (receipts in this directory)

- Loose pattern sweep repo-wide (`04[1-9]-` / `050-`): 954 files, mostly containment snapshots
  inside other packets' fan-out research trees and the ten moved trees themselves.
- Precise-slug census outside the moved trees (excluding `containment` paths): 30 files
  (`baseline-census-external.txt`), of which the live referrers needing a decision are the
  `.skilled` generated artifacts, `specs/cli-external-orchestration/073-…` (narrative mention),
  `specs/agents/009-…` live docs, `specs/sk-doc/049-…` (one row), `specs/system-speckit/033-…`
  live docs, and `specs/descriptions.json`.
- The 036-scoped sweep pre-move returns 19 hits, all in
  `001-research-inputs-and-architecture/002-deep-loop-effectiveness-and-fanout/research/iterations-modes/iteration-038.md`
  — historical research records naming *different* old packets that merely share the `04x-`
  prefix (e.g. `041-deep-research-loop-instrumentation`). They are not references to the ten
  moved packets and stay untouched (`baseline-sweep-scoped.txt`).
- Zero precise-slug references inside the 036 tree pre-move; the post-move live-doc hits are therefore
  exactly the intentional ones — the ten `timeline.md` rows (seq 64-73) and the `spec.md` merged-children
  block — plus the run-record trees left untouched by design (`sweep-post-move.txt`).

## Toolchain

- Validation: `.skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <folder> --strict --recursive`.
- Per-folder metadata: `runtime/cli/dist/spec-folder/generate-description.js`;
  `runtime/cli/dist/graph/backfill-graph-metadata.js` (single-packet refresh; `--dry-run` supported).
- Aggregate cache: `runtime/dist/lib/search/folder-discovery.js` (`generateFolderDescriptions`,
  `saveDescriptionCache`). A rename is a structural change the per-entry upsert cannot express;
  the unaffected rows are carried through untouched, matching the repo's convention of leaving
  another session's churn alone.
- Trigger index: `runtime/cli/retrieval/generate-trigger-index.mjs` (currently stale; treated as
  a reported exception, not silently widened into this merge).
- Link guard: `runtime/cli/check-markdown-links.cjs`.

## Exclusions (deliberate)

- `036/manifest/phase-tree.json` — frozen original-program manifest; the previous merge left it alone.
- Top-level `system-deep-loop/graph-metadata.json` — stale since 2026-08-08, unrelated.
- Ledger frames, JSONL, state artifacts, containment snapshots and research lineages — historical
  provenance; never rewritten.
- Rewrites are markdown-only. Derived JSON is regenerated from disk, never hand-edited.

## Step status

| Step | State |
|---|---|
| 1 baseline + worklist | done |
| 2 census wave (W1) | done (after the dispatch-gate unblock; `census-w1a/b.out`) |
| 3 drafts wave (W2) | done (`draft-w2a/b.out`) |
| 4 folder moves (`git mv`) | done — 1,218 path pairs |
| 5 markdown rewrite (dry run → apply) | done — 152 replacements, idempotent (`rewrite-plan/applied.txt`) |
| 6 derived JSON regeneration | done — 53 folders + scoped global cache (`regen-derived.log`) |
| 7 integration docs | done — four root docs + five parent maps (repaired after W3b) |
| 8 verification wave (W3) + agent suite | done — `verify-w3a/b.out`, validator, metadata asserts |
| 9 commits | done — one consolidated local commit holds steps 4-8, this workspace included |

## W3 verification

Two read-only agents audited the merge; their replies are persisted as `verify-w3a.out` (mechanical)
and `verify-w3b.out` (adversarial accuracy). Both were classified by output text, not exit code.

- W3a confirmed six claims: no old paths in live documents (15 intentional lines, no fourth class),
  metadata parentage, parent/root inventories (9/6/13/10/5; the root keeps 28), per-packet file
  parity, nothing else moved into or out of the tree, and derived-JSON freshness. Its anomalies are
  carried in `mapping.md` §3 and below.
- W3b raised six findings against the authored text. Repaired here: the alignment review's outcome is
  seventeen *phases* (one per confirmed finding class), not seventeen findings; the timeline no
  longer calls a draft packet's arrival an "evidenced outcome"; the switch-over paragraph says the
  later work does not *redesign the substrate*; the ledger span names the 2026-09-20 merge; the
  frontmatter no longer calls the post-consolidation set "flat-leaf".
- Left unrepaired because both predate the merge and were verified true at HEAD: the group-`003`
  changelog count reads 76 while the subtree holds 77 files, and the timeline's "28 direct children
  between 2026-08-16 and 2026-09-02" is a chronology slip (25 at 2026-09-02; the 2026-09-05 merges
  brought the 28th). Recorded for the operator rather than widened into this change.

## Close-out items

- `specs/descriptions.json`: scoped refresh applied via `update-descriptions-cache.mjs`
  (`descriptions-cache-receipt.txt`) — five obsolete rows removed, 47 refreshed/inserted, all other
  rows and their order untouched.
- Statuses kept honest, not back-filled: `046` reads `draft`, `041` and `049` read `complete` in the
  timeline while their derived graph metadata still says `in_progress`/`draft`. The gate remains the
  closure authority.
- Pre-existing packet-internal discrepancies carried forward unrepaired: `045`'s AC-018 against the
  ADR-005 reversal, its superseded-row count sentence, its summary's stale suite numbers; `050`'s
  summary claim about missing evidence in a file that does carry citations; `046`'s asset provenance.
- `049`'s METADATA adjacency fields (`Parent Spec`/`Parent Packet`/`Predecessor`/`Successor`) go stale
  under nesting and are left untouched — no nested-child convention, no validator backing.
- Run records, foreign tracks, containment snapshots, ledgers and the retrieval quartet stay as they
  were; see `mapping.md` §3 for each reason.

## Dispatch-gate blocker (2026-09-20)

The Pi preflight guard (`shouldDenyPiDispatch`) denies a direct cli-pi dispatch unless the
operator's own input text names the executor. The plan-approval message did not land in the
guard's raw-input capture, and neither did a question-tool answer. Evidence:

- Candidate command inspected in-process: `{"kind":"direct","executor":"cli-pi"}`
  (`probe-dispatch-shape.mjs`).
- The same command against the recorded plan text via the real `shouldDenyPiDispatch`:
  `{"denied":false}` (`probe-gate-verdict.mjs`, `--preserve-symlinks`).
- Live attempts (smoke, transport test): denied twice — "Name the matching executor in the
  user request" — so the live capture holds text other than the recorded message.
- Resolution: the operator sends a normal chat message naming cli-pi; then the smoke dispatch
  is retried before the waves resume.

Transport notes for the dispatch envelope: pi's `@file` message form carries the prompt
(no `$` expansion anywhere, so the inspector still proves one direct executor); the smoke
prompt and the two W1 prompt files are beside this document under `prompts/`.
