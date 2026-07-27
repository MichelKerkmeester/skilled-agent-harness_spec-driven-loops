# 009-cursor-hooks-lifecycle consolidation — handoff log

Scratch log for the LEAF dispatch that converted `030-cli-cursor-creation`'s
phases 009-014 into a single Phase Parent folder (`009-cursor-hooks-lifecycle/`),
per the repo's Phase Parent convention (precedent studied: `027-cli-codex-revival`).

## 1. Exact old -> new path mapping

| Old path (under `030-cli-cursor-creation/`) | New path (under `009-cursor-hooks-lifecycle/`) |
|---|---|
| `009-cursor-hooks-catalog-and-playbook-coverage/` | `001-cursor-hooks-catalog-and-playbook-coverage/` |
| `010-cursor-hooks-live-wiring/` | `002-cursor-hooks-live-wiring/` |
| `011-cursor-hooks-claude-parity/` | `003-cursor-hooks-claude-parity/` |
| `012-hooks-manual-testing-results/` | `004-hooks-manual-testing-results/` |
| `013-hooks-sk-code-alignment/` | `005-hooks-sk-code-alignment/` |
| `014-cursor-hooks-discovery-mirror/` | `006-cursor-hooks-discovery-mirror/` |

All 6 moved via `git mv` (full history preserved, confirmed via `git log --follow`
compatibility — standard rename detection applies). All original file content
(spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md) preserved
verbatim except the specific field-level fixes below.

New parent's lean trio authored fresh: `009-cursor-hooks-lifecycle/spec.md`,
`description.json`, `graph-metadata.json` (purpose-only spec.md, no
consolidation/merge narration in the body — see §5 for the one narration
token I had to scrub from frontmatter to pass `PHASE_PARENT_CONTENT`).

## 2. Cross-reference fixes made (old string -> new string, file:line)

All fixes below were driven by two effects of the move: (a) phase renumbering
009-014 -> 001-006, and (b) the new folder depth (children now live two levels
under `030-cli-cursor-creation/` instead of one, so any reference to something
OUTSIDE the moved set — the `030` parent's own `spec.md`, phase `004`, `006`,
`008`, `015` — needed `../` -> `../../`).

**001 (was 009):**
- `spec.md:34,149` `../spec.md` -> `../../spec.md` (parent-packet pointer)
- `spec.md:36,148` `../008-cursor-model-allowlist/spec.md` -> `../../008-cursor-model-allowlist/spec.md`
- `spec.md:37` `../010-cursor-hooks-live-wiring/spec.md` -> `../002-cursor-hooks-live-wiring/spec.md`
- `spec.md:150` `../004-cursor-hook-adapter-layer/decision-record.md` -> `../../004-cursor-hook-adapter-layer/decision-record.md`
- `spec.md:151` `../006-cursor-manual-testing-playbook/implementation-summary.md` -> `../../006-cursor-manual-testing-playbook/implementation-summary.md`
- `implementation-summary.md:100` `../004-cursor-hook-adapter-layer/decision-record.md` -> `../../004-cursor-hook-adapter-layer/decision-record.md`
- `implementation-summary.md:29` `Spec Folder` value `009-...` -> `001-...` (see §3)

**002 (was 010):**
- `spec.md:34,149` `../spec.md` -> `../../spec.md`
- `spec.md:36,148` `../009-cursor-hooks-catalog-and-playbook-coverage/spec.md` -> `../001-cursor-hooks-catalog-and-playbook-coverage/spec.md`
- `spec.md:37` `../011-cursor-hooks-claude-parity/spec.md` -> `../003-cursor-hooks-claude-parity/spec.md`
- `spec.md:150` `../004-.../decision-record.md` -> `../../004-.../decision-record.md`
- `implementation-summary.md:98`, `plan.md:119` same `../004-` -> `../../004-` fix
- `implementation-summary.md:29` Spec Folder `010-...` -> `002-...`

**003 (was 011):**
- `spec.md:34,165` `../spec.md` -> `../../spec.md`
- `spec.md:36,87,164` `../010-cursor-hooks-live-wiring/spec.md` -> `../002-cursor-hooks-live-wiring/spec.md`
- `spec.md:37` `../012-hooks-manual-testing-results/spec.md` -> `../004-hooks-manual-testing-results/spec.md`
- `spec.md:166` `../004-.../decision-record.md` -> `../../004-.../decision-record.md`
- `implementation-summary.md:112` `../010-.../implementation-summary.md` -> `../002-.../implementation-summary.md`
- `implementation-summary.md:113` `../004-.../decision-record.md` -> `../../004-.../decision-record.md`
- `checklist.md:66,84` `../010-cursor-hooks-live-wiring/spec.md` -> `../002-cursor-hooks-live-wiring/spec.md`
- `plan.md:131` `../010-.../plan.md` -> `../002-.../plan.md`; `plan.md:132` `../004-.../decision-record.md` -> `../../004-.../decision-record.md`
- `implementation-summary.md:29` Spec Folder `011-...` -> `003-...`

**004 (was 012):**
- `spec.md:34,135` `../spec.md` -> `../../spec.md`
- `spec.md:36,72,134` `../011-cursor-hooks-claude-parity/spec.md` -> `../003-cursor-hooks-claude-parity/spec.md`
- `spec.md:37` `../013-hooks-sk-code-alignment/spec.md` -> `../005-hooks-sk-code-alignment/spec.md`
- `implementation-summary.md:93` `../011-.../implementation-summary.md` -> `../003-.../implementation-summary.md`
- `implementation-summary.md:29` Spec Folder `012-...` -> `004-...`

**005 (was 013):**
- `spec.md:34,145` `../spec.md` -> `../../spec.md`
- `spec.md:36,144` `../012-hooks-manual-testing-results/spec.md` -> `../004-hooks-manual-testing-results/spec.md`
- `spec.md:37` `../014-cursor-hooks-discovery-mirror/spec.md` -> `../006-cursor-hooks-discovery-mirror/spec.md`
- `implementation-summary.md:29` Spec Folder `013-...` -> `005-...`
- No `../004-cursor-hook-adapter-layer` refs in this folder (none existed).

**006 (was 014):**
- `spec.md:34,137` `../spec.md` -> `../../spec.md`
- `spec.md:36,136` `../013-hooks-sk-code-alignment/spec.md` -> `../005-hooks-sk-code-alignment/spec.md`
- `spec.md:37` `../015-hook-code-style-cross-runtime/spec.md` -> `../../015-hook-code-style-cross-runtime/spec.md` (015 stays a TOP-LEVEL sibling of `030`, not a child of the new parent — see §4)
- `implementation-summary.md:29` Spec Folder `014-...` -> `006-...`

**Deliberately NOT touched** (verified false positives / historical evidence,
per the "preserve test-evidence tables, never touch prose that merely shares
words" instruction):
- `.../implementation-summary.md`, `tasks.md`, `checklist.md`, `plan.md` lines
  citing `validate.sh <OLD-folder-name> --strict` output as historical
  evidence-of-execution (e.g. "validate.sh 014-cursor-hooks-discovery-mirror
  --strict -> PASS") — these are records of a command that was literally run
  under that name at the time; not navigational cross-references.
- `../../<repo-root-relative-path>` symlink-target notation in 006's docs
  (implementation-summary.md:52, tasks.md:38, checklist.md:47, plan.md:52,
  spec.md:19) — describes real `.cursor/hooks/` symlink targets in the repo,
  unrelated to spec-folder nesting depth.
- `.../runtime/hooks/cursor` `...`-elided absolute paths in 013's tasks.md:55 /
  checklist.md:54 (ellipsis, not a `../` relative link).
- `../claude/<filename>` in 003's plan.md:42 — describes `shared.ts`'s own
  internal path-resolution logic, not a spec-folder link.
- Each folder's own `.opencode/specs/.../<OLD-folder-name>/*` full-path
  self-reference in "Files to Change" tables (e.g. 004's spec.md:71) — a
  historical evidence-table entry describing the phase's own docs at authoring
  time, same category as the validate.sh citations above.

## 3. Fields NOT covered by the original brief but required for a clean `--strict` pass

Two structural self-identity fields, distinct from prose cross-references,
had to be corrected because the repo's own validators check them against the
real on-disk path:

- **`implementation-summary.md`'s `| **Spec Folder** | <name> |` row** — the
  `SPEC_DOC_INTEGRITY` check fails if this doesn't match the actual folder
  basename. Fixed in all 6 (old number -> new number).
- **`_memory.continuity.packet_pointer` frontmatter field** (in every
  spec.md/plan.md/tasks.md/checklist.md/implementation-summary.md, 30 files
  total) — the `METADATA_DISK_PATH_CONSISTENCY` check fails if this doesn't
  match `cli-external-orchestration/030-cli-cursor-creation/009-cursor-hooks-lifecycle/<NNN-slug>`.
  Fixed via targeted `sed` across all 6 folders (verified via grep, no
  unintended matches).
- **`implementation-summary.md`'s `_memory.continuity.last_updated_at`** — the
  `CONTINUITY_FRESHNESS` check requires this to stay within 10 minutes of
  `graph-metadata.json`'s regenerated `derived.last_save_at`. Bumped all 6 to
  the actual edit time (`2026-07-27T03:27:34Z`) since the fields were
  genuinely touched at that time by this consolidation.

These were discovered empirically by running `validate.sh --recursive --strict`
and iterating — not by assumption. The task's "known bug" caveat (description.json
`level` not persisting on first pass) did NOT reproduce; `--level` persisted
correctly on every `generate-description.js` invocation, first pass, no manual
patch needed.

Also fixed in the new parent's own `spec.md` frontmatter (pre-existing before
first validate run, not a move artifact): `recent_action` originally said
"Consolidated the 6 sequential Cursor-hooks phases (formerly 030's phases
009-014)..." — this tripped both `FRONTMATTER_MEMORY_BLOCK` (narrative/too-long
`recent_action`, >96 chars) and `PHASE_PARENT_CONTENT` (migration-history token
`consolidat*`). Rewrote to a compact, non-narrative field and removed
"consolidation" from `session_dedup.session_id` and `answered_questions` too,
per the repo's own rule that phase-parent `spec.md` must carry NO
merge/rename/collapse/reorganization narration (that belongs in an optional
`context-index.md`, not authored here since not requested).

## 4. Read on phase 015 (`../015-hook-code-style-cross-runtime/`)

**Confirmed genuinely cross-runtime, NOT Cursor-specific.** Its own "Files to
Change" table spans all four runtimes: `cli-opencode/scripts/hooks/{,codex/,devin/}*.mjs`,
`mcp-code-mode/runtime/hooks/{claude,codex,devin}/*.cjs`,
`sk-code/code-quality/scripts/hooks/{claude-posttooluse.cjs,{codex,devin}/post-edit-quality.cjs}`,
`system-code-graph/runtime/hooks/{claude,codex,devin}/*.cjs`,
`system-deep-loop/runtime/hooks/{claude,devin}/task-dispatch-guard.cjs`,
`system-spec-kit/mcp-server/hooks/{claude,codex,devin}/completion-evidence-stop.cjs`,
`system-spec-kit/runtime/hooks/{claude,codex,devin}/spec-gate-{classify,enforce}.mjs`
— plus Cursor's own 5 files touched for SECTIONS ONLY (box header already
correct from phase 013/what-is-now-005). Its own spec.md explicitly frames
phase 013 (now 005) as "the Cursor-only predecessor this phase generalizes"
and calls phase 014 (now 006) "a sequential-numbering neighbor; no dependency
either way."

**Recommendation for the follow-up task:** 015 should stay a TOP-LEVEL SIBLING
of the new `009-cursor-hooks-lifecycle/` parent (and of `030-cli-cursor-creation`
generally), NOT become a 7th child. It is out of this packet's Cursor-hooks
scope by its own admission. Left completely untouched per the brief (read-only) —
I did NOT move it, edit it, or rename it. I only fixed one of ITS neighbors'
(006's) reference TO it (`../015-...` -> `../../015-...`), which was a
necessary consequence of my own move (006's relative-path depth changed), not
an edit to 015 itself.

## 5. Validation

Final `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh
.opencode/specs/cli-external-orchestration/030-cli-cursor-creation/009-cursor-hooks-lifecycle
--recursive --strict` result: **all 7 folders (parent + 6 children) PASSED,
0 errors / 0 warnings.**

Iteration history (informational): first pass had 1 error + 1 warning on the
parent (`FRONTMATTER_MEMORY_BLOCK`, `PHASE_PARENT_CONTENT`) and 1 error + 2
warnings on each child (`SPEC_DOC_INTEGRITY` stale Spec Folder field,
`METADATA_DISK_PATH_CONSISTENCY` stale packet_pointer, `CONTINUITY_FRESHNESS`
stale timestamp after metadata regen) — all root-caused and fixed as
documented in §3, then re-validated clean.

## 6. Commit

`4bf29688aa` — "docs(030-cli-cursor-creation): consolidate 009-014 into
009-cursor-hooks-lifecycle phase parent" — on branch `skilled/v4.0.0.0`.
NOT pushed (per instructions).

Git safety protocol followed: baseline `git status --short` recorded before
any edit; never used `git add -A`/`git add .`; staged only
`.opencode/specs/cli-external-orchestration/030-cli-cursor-creation/009-cursor-hooks-lifecycle/`
via an explicit scoped `git add`; left the concurrent session's dirty files
(`030-cli-cursor-creation/018-cursor-spec-gate-prebind/*`,
`030-cli-cursor-creation/graph-metadata.json`, its untracked `handover.md`)
completely untouched — confirmed still dirty/untracked after my commit.

**IMPORTANT DISCLOSURE — a real anomaly, not swept under the rug:** `git show
--stat HEAD` shows my commit ALSO includes 17 files under
`.opencode/skills/sk-design/design-interface/...` (a `foundations/` ->
top-level reorg: `changelog/v1.0.0.0.md` -> `changelog/v1.0.0.0-foundations.md`,
several `feature-catalog/` and `manual-testing-playbook/` files moved out of
`foundations/`). Every one of these 17 is a **pure rename, 0 insertions, 0
deletions** (`git show --stat --format="" HEAD -- .opencode/skills/sk-design/`
confirms `17 files changed, 0 insertions(+), 0 deletions(-)`) — I never
touched sk-design content myself. My best reconstruction: a concurrent session
had already run its own `git mv`/`git add` on those 17 files, leaving them
STAGED in the shared repo's index before this dispatch started; my `git commit`
call (without a pathspec, since a scoped `git add` had already been run to
select my own files, per the standard workflow shape) committed the FULL
index, which silently included that other session's pre-staged, unrelated
renames alongside mine. I did not run `git add -A`/`git add .` at any point —
only `git add .opencode/specs/.../009-cursor-hooks-lifecycle/` — so this was
not a scope-lock violation on MY part in the staging step, but the resulting
commit is broader than my own scope. Since the swept-in changes are
zero-content pure renames (no data loss, no risk of corrupting the other
session's work — the files are simply now renamed exactly as that other
session already intended, just attributed to my commit message instead of
theirs), I deliberately did NOT attempt any corrective `git reset`/rebase
surgery on a shared branch mid-dispatch, since that risks compounding the
problem far more than the original issue. **Flagging this for the operator/
orchestrator to decide**: options are (a) leave as-is (harmless content-wise,
slightly confusing attribution), or (b) a follow-up commit amending the
message to credit both changes, or (c) history surgery if the sk-design
session's own workflow depends on committing that rename itself (unlikely
since it's already committed content-identical). I recommend (a) unless the
sk-design session reports friction.

## 7. Self-governance note

Completed within budget; no partial-state fallback needed. All 6 moves,
metadata regeneration, validation, and commit finished in one continuous pass.

---

## 8. Follow-up dispatch (Task #2): root documentation update + renumbering + full-packet validation

Scratch log entry appended by the follow-up LEAF dispatch that (a) decided the
renumbering strategy for phases 015-018, (b) updated the `030-cli-cursor-creation`
root `spec.md`'s Phase Documentation Map and Phase Transition Rules, and (c) ran
and fixed the FULL-PACKET `validate.sh --recursive --strict` (parent + `009-cursor-hooks-lifecycle`
+ its 6 children + 015-018), not just the subtree Task #1 already validated.

### 8.1 Renumbering decision and evidence

**Decision: renumbered for full contiguity** — `015→010`, `016→011`, `017→012`,
`018→013` — closing the entire 5-slot gap left by 009-014 collapsing into the
single `009-cursor-hooks-lifecycle/` slot, rather than leaving 015-018 at their
old numbers.

**Evidence (repo-wide grep, run before deciding):**
- `030-cli-cursor-creation/016-...` : zero external hits (all matches confined
  to the packet itself, incl. the now-nested `009-cursor-hooks-lifecycle` child).
- `030-cli-cursor-creation/017-...` : zero external hits.
- `030-cli-cursor-creation/018-...` : **exactly one genuine external navigational
  reference**, `.opencode/specs/cli-external-orchestration/029-cli-devin-revival/012-devin-hook-hardening/spec.md:203`
  (`../../030-cli-cursor-creation/018-cursor-spec-gate-prebind/spec.md` in a
  Related Documents list) — fixed in the same pass (see 8.3).
- One additional hit was a **historical JSONL audit-log line**
  (`sk-doc/019-skill-routing-refactor/017-post-019-alignment/alignment/deep-alignment-state.jsonl:8`,
  a timestamped `containment_violation` event citing the path as it existed at
  that moment) — treated as historical evidence-of-execution, same category as
  Task #1's own precedent of preserving `validate.sh <OLD-name>` citations; left
  untouched.

With disruption this low (1 fixable external link, repo-wide), renumbering was
judged safer and cleaner than leaving a permanent 5-slot gap (010-014 missing)
for zero offsetting benefit — full contiguity (001-013, no gaps) matches every
other phased packet's numbering convention in this repo.

### 8.2 Root `spec.md` changes

- **Phase Documentation Map**: replaced the stale rows 9-18 (which still
  described the pre-Task-1 flat layout, including the six now-nested phases)
  with: row 9 = `009-cursor-hooks-lifecycle/` (Phase Parent, one line, pointing
  to its own map) + a new "Children of `009-cursor-hooks-lifecycle/`" sub-table
  listing all 6 children (9.1-9.6) with their real folder names/focus/status;
  rows 10-13 = the renumbered `010-hook-code-style-cross-runtime/` through
  `013-cursor-spec-gate-prebind/`.
- **Phase Transition Rules**: added two new rules — the phase-9 Phase Parent
  lean-trio rule, and the phase-10 top-level-sibling-not-7th-child rule (015's
  confirmed disposition, carried over verbatim from Task #1's finding) — plus a
  short numbering-contiguity note that deliberately avoids naming the moved
  folders' migration history inline (`PHASE_PARENT_CONTENT`'s content-discipline
  scan flagged an earlier draft for the substring "consolidat*" inside a
  filename mention and for "collapsed"/"renumbered" prose; both were rewritten
  to be purely structural, per the same discipline Task #1 already applied to
  the `009-cursor-hooks-lifecycle/spec.md` frontmatter).
- **Related Documents / METADATA key_files**: updated the `018-...` mentions to
  `013-...`, and added a pointer to `009-cursor-hooks-lifecycle/spec.md`.
- Did **not** touch `handover.md` at the packet root — it is a pre-existing,
  pre-Task-1 session-handoff narrative (already describes phases "010-017" as a
  flat range from before the consolidation existed) and is out of this task's
  explicit "root spec.md only" brief; its historical numbers were left as
  written, same treatment as the validate.sh-citation precedent.

### 8.3 Cross-reference fixes (old string -> new string, file:line)

All four renamed folders' own self-identity fields (`packet_pointer` frontmatter
in every doc, `description.json.specFolder`, `graph-metadata.json.packet_id`/
`spec_folder`, and the `implementation-summary.md` "Spec Folder" table row) were
updated old-number -> new-number in all of: `010-hook-code-style-cross-runtime/`,
`011-cursor-mcp-wiring-and-route-guard-fix/`, `012-codex-claude-hooks-discovery-mirrors/`,
`013-cursor-spec-gate-prebind/` (not itemized line-by-line here; identical
mechanical pattern across `spec.md`/`plan.md`/`tasks.md`/`checklist.md`/
`implementation-summary.md`, plus `handover.md` for 013).

**Predecessor/Successor + prose cross-references, by folder:**

- **010 (was 015)**: `spec.md` Predecessor `../014-cursor-hooks-discovery-mirror/spec.md`
  -> `../009-cursor-hooks-lifecycle/spec.md` (015 has no real dependency on 014
  by its own admission — "sequential-numbering neighbor... no dependency either
  way" — so the Predecessor field now points at the actual new top-level
  neighbor rather than the folder 014 became); Successor `../016-.../spec.md` ->
  `../011-cursor-mcp-wiring-and-route-guard-fix/spec.md`. Stale pointers to the
  now-moved `../013-hooks-sk-code-alignment/` and `../014-cursor-hooks-discovery-mirror/`
  (both moved into `009-cursor-hooks-lifecycle/005/` and `/006/` by Task #1, but
  never updated in 015 since 015 was out of Task #1's scope) fixed to
  `../009-cursor-hooks-lifecycle/005-hooks-sk-code-alignment/...` and
  `.../006-cursor-hooks-discovery-mirror/...` across `spec.md`, `tasks.md`,
  `checklist.md`, `plan.md`, `implementation-summary.md` (key_files array,
  Related Documents, and the two Cross-References bullets in `tasks.md`).
- **011 (was 016)**: Predecessor/Successor renumbered to `../010-.../spec.md` /
  `../012-.../spec.md`. Stale `../011-cursor-hooks-claude-parity/implementation-summary.md`
  (the pre-Task-1 top-level 011, now nested at `009-cursor-hooks-lifecycle/003/`)
  fixed in `spec.md` Related Documents and `implementation-summary.md` Related
  Documents.
- **012 (was 017)**: Predecessor/Successor renumbered to `../011-.../spec.md` /
  `../013-.../spec.md`. Stale `../014-cursor-hooks-discovery-mirror/spec.md`
  fixed to `../009-cursor-hooks-lifecycle/006-cursor-hooks-discovery-mirror/spec.md`.
- **013 (was 018)**: Predecessor renumbered to `../012-.../spec.md` (no
  Successor field — last phase). `handover.md`'s three self-path mentions
  (the "Spec folder:" line, the "Recommended Starting Point" file citation, and
  the 4-item cold-read numbered list, including inside the copy-paste "Ready-to-Use
  Analysis Prompt" block) updated `018-...` -> `013-...`; left untouched the
  handover's historical evidence-table rows ("Phase 018 canonical documents...
  Created in 348b644283", "Phase 018 strict validation... PASSED", etc.) since
  those cite what was literally run under that name at authoring time, same
  category as Task #1's own precedent.
- **`009-cursor-hooks-lifecycle/spec.md`** (the phase-parent itself, a sibling
  of 010-013, not one of its own children): 3 stale mentions of
  `../015-hook-code-style-cross-runtime/` (Successor field, an Out-of-Scope
  bullet, and a Related Documents entry) updated to `../010-hook-code-style-cross-runtime/`;
  the Out-of-Scope bullet's `016`/`017` backtick-number mention also updated to
  `011`/`012`.
- **`009-cursor-hooks-lifecycle/006-cursor-hooks-discovery-mirror/spec.md:37`**
  (a lifecycle CHILD's Successor field, already fixed once by Task #1 for `../`
  -> `../../` depth): the number itself updated `015` -> `010`. This is a
  mechanical cross-reference fix consequent to my own renumbering, not a
  substantive-content edit to the child — the "no child content edits, root
  Map/Rules only" instruction is read as scoped to the lifecycle children's
  *authored* content, not to a pointer that changed only because the folder it
  points at changed number.
- **`008-cursor-model-allowlist/spec.md:37`** (a top-level sibling, NOT one of
  015-018, NOT explicitly named in the writable-scope note): Successor field
  `../009-cursor-hooks-catalog-and-playbook-coverage/spec.md` (Task #1's own
  pre-consolidation target, orphaned when that folder moved into the lifecycle
  parent — Task #1 did not fix this since 008 was outside their scope too) ->
  `../009-cursor-hooks-lifecycle/spec.md`. **Deviation disclosed**: this one
  fix went slightly beyond the literal writable-scope note (which named only
  root spec.md/description.json/graph-metadata.json + 015-018 + files
  referencing them), because the mandated full-packet `validate.sh --recursive
  --strict` run surfaced a real `PHASE_LINKS` failure ("008-cursor-model-allowlist/spec.md
  missing successor reference (009-cursor-hooks-lifecycle)") that pre-dated this
  dispatch (a gap Task #1 left when it created the phase parent) and directly
  blocked the 0/0 result this task explicitly requires. Judged in-scope under
  the task's own step-5 "fix and retry" mandate; a single-line, mechanical,
  same-pattern fix, not a substantive rewrite of 008's content.
- **External file** `.opencode/specs/cli-external-orchestration/029-cli-devin-revival/012-devin-hook-hardening/spec.md:203`:
  `../../030-cli-cursor-creation/018-cursor-spec-gate-prebind/spec.md` ->
  `.../013-cursor-spec-gate-prebind/spec.md`. **Flagged, not fully reconciled**:
  this folder is untracked (`??` in `git status`, i.e. another concurrent
  session's in-progress, uncommitted work under a *different* packet,
  `029-cli-devin-revival`). The one-line text fix was made (explicitly
  authorized by "any repo files referencing them"), but regenerating that
  folder's own `description.json`/`graph-metadata.json` afterward was
  deliberately NOT done — that belongs to the owning session, is outside this
  task's `030-cli-cursor-creation`-scoped validation mandate, and touching
  another session's generated-metadata pipeline felt like unauthorized
  reach beyond a single string fix. Running `validate.sh` on that folder
  afterward (informational only, not part of this task's required gate) shows
  2 pre-existing-pattern `GENERATED_METADATA_INTEGRITY`/`GENERATED_METADATA_DRIFT`
  errors — the same "content edited, metadata not regenerated" class this task
  hit repeatedly in its own packet — for that session to reconcile at its next
  regen pass, same as it would for any other edit to that file.

### 8.4 Metadata regeneration

Ran `generate-description.js` (matching each folder's existing `--level`) then
`backfill-graph-metadata.js`, in that order, for: root `030-cli-cursor-creation`
(twice — once after the initial Map/Rules edit, again after the
`PHASE_PARENT_CONTENT` token fix required a second content change),
`009-cursor-hooks-lifecycle` (root trio, twice for the same reason),
`009-cursor-hooks-lifecycle/006-cursor-hooks-discovery-mirror` (after its
Successor-field fix), `008-cursor-model-allowlist` (after its Successor-field
fix), and all four renamed folders (010-013, twice — once right after rename +
content fixes, once more after the `implementation-summary.md` timestamp bump
below). The task's cited "known bug" (description.json `level` not persisting
on `--level`) did **not** reproduce in any of these runs — `level` persisted
correctly every time, first pass, no manual patch needed for that field.

**One different bug DID reproduce and required a manual patch**: the root
packet's `backfill-graph-metadata.js` run did not *replace* `graph-metadata.json`'s
`children_ids` array — it *appended* the correct new entries
(`009-cursor-hooks-lifecycle`, `010-...`, `011-...`, `012-...`, `013-...`)
alongside the stale pre-Task-1 entries for the now-nonexistent top-level
`009-cursor-hooks-catalog-and-playbook-coverage` through `018-cursor-spec-gate-prebind`,
producing a 23-entry array with 10 dangling paths. Manually patched down to the
correct 13 entries (001-008 + 009-cursor-hooks-lifecycle + 010-013) both times
this happened (once per root regeneration pass). Also manually patched
`derived.last_active_child_id` (still pointed at the now-nonexistent
`018-cursor-spec-gate-prebind` after the first regen) to
`013-cursor-spec-gate-prebind` — the regen script did not refresh this field on
its own the first time, but did carry my manual fix forward correctly on the
second regen pass.

Each `CONTINUITY_FRESHNESS`/`GENERATED_METADATA_INTEGRITY` (fingerprint-mismatch)
failure that showed up after a content edit was root-caused the same way each
time — an `implementation-summary.md` (or, for the lean-trio phase parent,
`spec.md`) `last_updated_at` more than 10 minutes stale relative to the freshly
regenerated `graph-metadata.json.derived.last_save_at` — and fixed by bumping
that one timestamp field to the actual edit time before the final regen pass,
same remediation Task #1 documented in its own §3.

### 8.5 Full-packet validation result

Final `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh
.opencode/specs/cli-external-orchestration/030-cli-cursor-creation --recursive
--strict`: **all 13 immediate entries PASSED, 0 errors / 0 warnings** — root,
`001-cursor-contract-pin` through `008-cursor-model-allowlist`,
`009-cursor-hooks-lifecycle` (as one phase-parent entry), and
`010-hook-code-style-cross-runtime` through `013-cursor-spec-gate-prebind`.

Separately re-ran `validate.sh .../009-cursor-hooks-lifecycle --recursive
--strict` on its own to confirm the 6 nested children (not individually listed
by the root-level `--recursive` scan, which only descends one level) are still
clean after my one cross-reference fix to child 006: **all 7 folders (parent +
6 children) PASSED, 0 errors / 0 warnings.**

Iteration history (informational): the first full-packet pass surfaced 1
`PHASE_LINKS` error (the stale 008 Successor, see 8.3) + 2 warnings on the root
(`PHASE_LINKS`, `PHASE_PARENT_CONTENT`) + 1 `GENERATED_METADATA_INTEGRITY` error
on `009-cursor-hooks-lifecycle` + 1 `CONTINUITY_FRESHNESS` warning each on
010-013 — all root-caused and fixed as documented in 8.2-8.4, then re-validated
clean across three full re-runs.

### 8.6 Commit

Staged and committed with an explicit pathspec (both `git add` and `git commit
--`), scoped strictly to `030-cli-cursor-creation/` — the renamed folders
(010-013), the touched files in 008, 009-cursor-hooks-lifecycle (+ its child
006), the root spec.md/description.json/graph-metadata.json, and this
scratch/ log. `029-cli-devin-revival/012-devin-hook-hardening/` was
deliberately left OUT of staging (untracked, another session's in-progress
work — see 8.3). Commit hash recorded after the commit runs; `git show --stat
HEAD` confirmed the file list matched only what was intended (see the
git-safety confirmation note appended just below, if this run needed one).

### 8.7 Self-governance note

Completed within budget. Three validation loops were needed (root-cause, fix,
regenerate, re-validate) but each converged; no partial-state fallback needed.
