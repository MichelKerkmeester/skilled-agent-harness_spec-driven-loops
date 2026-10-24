---
title: "Feature Specification: Phase 5: leak-and-routing-verification"
description: "Read-only proof that the removed Webflow and Obsidian surfaces left no tracked path, no trigger-index line, no sk-code-family advisor vocabulary and no routing hole, recorded as evidence inside this packet."
trigger_phrases:
  - "leak and routing verification"
  - "phase 5 leak and routing verification"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 5: leak-and-routing-verification

<!-- SPECKIT_LEVEL: 3 -->
---

<!-- ANCHOR:metadata -->
## EXECUTIVE SUMMARY

Phases 001 through 004 remove two surfaces from the shipped hub and rebuild them as gitignored `local-*` skills, but a green local test run cannot show whether the removal held: a gitignored symlink still sits on disk, CI rebuilds the committed trigger index after the push rather than during it, the advisor graph database is local and ignored, and `git commit --no-verify` bypasses the pre-commit guard. This phase answers that question with commands whose output is recorded: a fresh clone of the public remote, a throwaway advisor database, the four generated retrieval artifacts, and routing probes in both checkouts that consume this hub.

**Key Decisions**: verify from a fresh clone of `origin/main` rather than the working tree; scope the rebuilt-index zero check to live routing sources and allowlist the 69 retained `specs/sk-code/007-sk-code-obsidian-surface/` paths; compare git blob identities for new or changed private content, record the bytes the removal commit already carries as already public in history, and cover partial content with marker sweeps; run routing probes in the operator checkout and in the Obsidian Plugin checkout, never in the writer worktree.

**Critical Dependencies**: phases 001 through 004 on `main`; the CI trigger-index rebuild that follows each push; an authenticated `gh`; both private skills present in `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`.

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | In progress |
| **Created** | 2026-10-23 |
| **Executor** | OpenCode 2 orchestrator; reviews via the `subagent` tool, agent `review` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 5 |
| **Predecessor** | 004-private-local-skills |
| **Successor** | None |
| **Handoff Criteria** | Every row of `acceptance-criteria.md` is `Met` with observed command output recorded in `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/`, and `validate.sh --strict` prints `RESULT: PASSED`. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the Move the Webflow and Obsidian surfaces out of the shipped sk-code hub into gitignored local-* skills that this checkout links to but never tracks, routed only by the operator's local advisor specification.

**Scope Boundary**: In scope: the sk-code hub tree, tracked consumers that name `sk-code-webflow`, `sk-code-obsidian`, or the `WEBFLOW` / `OBSIDIAN` surface tokens, and the advisor's sk-code surface vocabulary. Out of scope, kept unchanged: generic Webflow/Obsidian words in other skills (mcp-tooling/mcp-obsidian, mcp-notion, mcp-code-mode's Webflow CMS vocabulary at `fusion.ts:602`, `explicit.ts:131`, `skill_advisor.py:2181`, the `P1-MCP-002` regression and holdout rows, sk-design style bundles); dated historical records (every `changelog/` file, `.skilled/changelog/skilled/*.md`, `benchmark/reports/`, `specs/**/z_archive/`, the `doctor-update-*` playbooks in `.skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/` that name units of the past v4.0.0.2 release, and the `anchor-repair-sample` test fixture); git history.

This phase changes no production code. It runs checks that read the repository, a fresh clone of `origin/main`, a throwaway advisor database, a temporary probe repository and two consumer checkouts, and it writes only its own evidence documents.

**Retained-history classification.** Every sweep separates two populations and never merges them:

- **Active routing leak** - a path, content line or index entry that a live consumer reads: the hub tree, `.hermes/skills/`, the advisor runtime, the committed retrieval artifacts, or a tracked file a later phase did not clean.
- **Retained D6 historical hit** - a dated record or fixture the packet deliberately keeps: the `doctor-update-*` playbooks and the `anchor-repair-sample` fixture in the tracked-content sweep, the 108 tracked `specs/` paths in the tracked-path sweep, and the 69 `specs/sk-code/007-sk-code-obsidian-surface/` paths in the rebuilt trigger index. These are reported by name and count, never counted as a pass for the active population.

**Maintenance limit.** Nothing prevents a later commit from reintroducing a surface token. The pre-commit guard that phase 001 adds refuses a staged `local-*` path, and neither `pre-commit` nor `pre-push` carries a surface-token scan: a grep of `.skilled/scripts/git-hooks/pre-push` for `local-`, `surface` and `WEBFLOW` returns nothing. The fresh-clone sweep in this phase is a one-time closure gate, not a standing check. A future regression is caught only by a later audit.

**Dependencies**:
- Phases 001 through 004 have landed on `main`, in that order. 004 depends only on 001 (the ignore rules must exist before any private file is written) but runs after 003 so the advisor scan already follows a `local-*` symlink.
- The operator's main checkout `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public` holds two gitignored symlinks, `.skilled/skills/local-webflow/` and `.skilled/skills/local-obsidian/`, which phase 004 creates. Their targets are `local-skills/` folders in two external repositories: `local-obsidian` in a public repository by operator choice and `local-webflow` in a private one. Phase 004's content and link steps run there; its packet-document edits run in the `WORKTREE` checkout defined in `004-private-local-skills/tasks.md`'s Checkout rule (by default this same checkout): the symlinks are gitignored here and never carried into another checkout, and `SPECKIT_PRIVATE_SKILL_ROOTS` names both external `local-skills/` parents for every advisor process.
- The Obsidian Plugin checkout at `/Users/michelkerkmeester/MEGA/Development/Obsidian Plugin` resolves `.claude`, `.codex`, `.cursor`, `.devin`, `.hermes`, `.opencode`, `.pi` and `.skilled` back into that same hub by symlink, which makes it a second live consumer of the routing table.
- CI rebuilds `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json` and its three fixture sidecars after each push to `main` (the `chore(system-spec-kit): rebuild the trigger index` commits).
- `git`, `node`, `sqlite3`, `jq` and an authenticated `gh` on the operator machine.

**Deliverables**:
- Fifteen evidence files under `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/`, named `00-preflight.md`, `01-head-leak-sweep.md`, `02-fresh-clone.md`, `03-fresh-clone-leak.md`, `04-d6-kept-records.md`, `05-advisor-db.md`, `06-trigger-index.md`, `07-routing-probes.md`, `08-local-invisibility.md`, `09-ci.md`, `10-review.md`, `11-final-tip.md`, `12-history-inventory.md`, `13-drift.md` and `14-corpus-boundary.md`.
- The same results transcribed into `implementation-summary.md` at close.
- `acceptance-criteria.md` rows marked `Met` with the observed output quoted.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phases 001 through 004 delete the two surfaces from the hub, scrub the advisor vocabulary and recreate them as gitignored `local-*` symlinks, but nothing yet proves the result. The leak paths are not visible from a green local test run: a gitignored symlink still sits on disk, the committed trigger index is rebuilt by CI after the push rather than by the developer, the advisor graph database is local and ignored, and `git commit --no-verify` bypasses the pre-commit guard. A packet that closed on "the tests pass" could therefore ship a tracked file naming `sk-code-webflow`, an index line naming `local-obsidian`, or a routing table that sends a Webflow prompt to `sk-code`.

### Purpose
Prove, with commands whose output is recorded, that the two surfaces left no tracked trace, no committed index entry, no sk-code-family advisor vocabulary and no routing hole, and that the private skills still win their own prompts locally in both checkouts that consume this hub.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A tracked-path and tracked-content leak sweep over a fresh clone of `origin/main`, repeated against the final tip after the evidence commit and its bot-generated rebuild.
- A classified reachable-blob comparison: the git blob identity of every complete file under the two private skill roots, split into the ids commit `42b41dd286` already carries, which are recorded as already public in history, and the new or changed rest, which is compared against every blob reachable from the public clone.
- The D6 boundary audit: the ten out-of-scope path prefixes named in `plan.md` step 4 are byte-identical to commit `42b41dd286`. The dated records the step 3 grep excludes (per-skill `changelog/`, `benchmark/reports/`, `specs/**/z_archive/`) are kept by D6 but are not audited for byte-identity, because phase 002 deletes the surface changelog and benchmark folders and overwrites the `z_archive` fixture twins.
- An advisor graph database built into a throwaway directory from the fresh clone, queried for any sk-code-family node whose id, domains, intent signals or derived block names webflow or obsidian.
- The four committed retrieval artifacts CI regenerates, after the rebuild: `trigger-index.json`, `corpus-manifest.json`, `generation-diagnostics.json` and `phrase-variants.json`.
- A corpus-boundary probe in a temporary repository: a unique marker inside an ignored `local-probe` skill must be absent from all four generated artifacts while a tracked control phrase is present.
- Three local routing probes in the operator checkout and the same three in the Obsidian Plugin checkout: a Webflow prompt, an Obsidian prompt and a generic frontend prompt.
- A symlink-target check on the Obsidian Plugin checkout, which resolves its runtime directories into this hub.
- The drift scripts the routing-registry workflow runs, executed in the operator checkout with both private skills present, plus the exported graph checked for `local-` ids.
- A read-only history inventory: reachable objects with the old paths, tag trees and hosted release assets.
- D5 invisibility: `git status --porcelain` never lists a private skill, so no ignore rule or commit guard has to fire in practice.
- CI status on `main` for the phase commits and for the trigger-index rebuilds that follow them.
- The evidence documents listed under Deliverables.

### Out of Scope
- Any code change. The D5 consumers (`skill_graph_compiler.py:200`, `sync-skills-hermes.cjs` `listSkillFiles` lines 51-68, `ci-skill-root-metadata.cjs:143`, `skill-graph-freshness.cjs:146-148`) and the D4 symlink scans (`skill-graph-db.ts:733`, `freshness.ts:143`) belong to phase 003. `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs` `gitIgnoredPaths` (lines 200-210) needs no change: it honours committed `.gitignore` files, so D2 alone keeps `local-*` out of the index.
- Creating, restoring or editing the private skills - phase 004 owns them, and this phase never writes inside `.skilled/skills/local-*`.
- Editing any D6 kept record. A failing D6 check is reported and routed to the phase that caused it, never repaired here.
- Repairing a drift-script failure. The drift task records the exit code and the failing output; a failure is routed to phase 003 or 004.
- Scrubbing git history, rewriting a tag or deleting a release asset (D7). The history inventory is read-only; `filter-repo` plus a force push is an optional operator decision recorded in `12-history-inventory.md`, never executed here.
- Parent packet documents (`../spec.md`, `../graph-metadata.json`).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/00-preflight.md` | Create | Tool versions, phase order and the baselines measured at `42b41dd286` and at the planning tip |
| `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/01-head-leak-sweep.md` | Create | Tracked path, content and bare-token sweeps in the writer worktree |
| `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/02-fresh-clone.md` | Create | Clone command, clone HEAD sha, clean-tree assertion |
| `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/03-fresh-clone-leak.md` | Create | Both leak sweeps in the clone, the D6 allowlist classification, the bare-token sweep, the blob comparison and the partial-content policy |
| `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/04-d6-kept-records.md` | Create | The ten-prefix `git diff --stat 42b41dd286 HEAD` audit |
| `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/05-advisor-db.md` | Create | Throwaway DB build plus the zero-row query |
| `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/06-trigger-index.md` | Create | The four regenerated retrieval artifacts, scoped and allowlisted |
| `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/07-routing-probes.md` | Create | Six routing probes across two checkouts, the two symlink targets and the plugin symlink targets |
| `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/08-local-invisibility.md` | Create | `git status --porcelain` and `git check-ignore -v` in the operator checkout |
| `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/09-ci.md` | Create | `gh run list` output for `main`, plus the stated limit that each evidence push's own runs are reported in the handoff |
| `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/10-review.md` | Create | Reviewer verdicts and how each finding was answered |
| `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/11-final-tip.md` | Create | Re-clone of the final tip and every sweep rerun against it |
| `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/12-history-inventory.md` | Create | Reachable old-path objects, tag trees and hosted release assets |
| `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/13-drift.md` | Create | The drift scripts run with both private skills present, and the exported graph's ids |
| `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/14-corpus-boundary.md` | Create | Temporary-repository marker probe against all four generated artifacts |
| `implementation-summary.md` | Modify | Transcribe the evidence at close |
| `acceptance-criteria.md` | Modify | Row statuses and the closure statement |
| `spec.md` | Modify | Status row and the corrected anchors recorded in Open Questions |
| `tasks.md` | Modify | Task checkboxes and the verification summary at close |
| `description.json`, `graph-metadata.json` | Modify (derived) | Regenerated by `repair-derived.cjs --apply`, never hand-edited |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | In a fresh clone of `origin/main`, no live tracked path outside `specs/` names `local-webflow`, `local-obsidian`, `sk-code-webflow` or `sk-code-obsidian`, so `git ls-files -- ':!specs/**'` counts `0 live` while the retained `specs/` population counts `108` retained paths and the `42b41dd286` control still counts `336`. |
| REQ-002 | In the same clone, the tracked-content sweep prints 17 paths that fall in exactly three classes (the 8 retained paths under the two D6 kept-record prefixes named in `plan.md` step 3, 6 test files that use the skill names as fixture directory names and 3 retrieval artifacts) and no other path, and a second sweep for the bare `WEBFLOW` and `OBSIDIAN` tokens over `.skilled/skills/sk-code` and `.hermes/skills/sk-code` prints `0` lines once the kept `WEBFLOW:` comment-hygiene platform tag lines and the dated `changelog/` and `benchmark/reports/` records are excluded. The evidence names the retained D6 hits separately from the active population, so a kept path never counts as a pass for an active one. Amended 2026-10-24 (operator ruling): the original expectation was 8 paths and no other. The fresh clone shows 17, classified in `scratch/evidence/03-fresh-clone-leak.md` section C as 8 D6 kept records, 6 test files (`pre-commit.test.sh`, `skill-root-metadata-contract.test.cjs`, `skill-graph-freshness-panel.vitest.ts`, `advisor-status.vitest.ts`, `private-skill-target.vitest.ts`, `sync-skills-hermes.test.mjs`) and 3 retrieval artifacts (`trigger-index.json`, `corpus-manifest.json`, `phrase-variants.json`) that carry allowlisted retained-record paths and phrase keys. A test path is told from a leak by sitting under `tests/` with a `.test.` or `.vitest.` basename and by every hit line being a fixture directory name, never skill body text. An artifact is told from a leak by every hit line being a `specs/sk-code/007-sk-code-obsidian-surface/` path string or a phrase key, and by holding no `.skilled/` routing path. No private skill content was found in any of the 17, only names, paths and phrase keys. The retained D6 count stays 8. The same ruling amends the blob identity command to `find -L` and its measured values (228 files, 223 base ids, 138 already public, 1 copied reference, 86 new or changed, control 139, assertion 0). The assertion of 0 means none of the 86 new or changed ids is reachable from the public clone. Only `workflow-debug.md` is a copied reference, because the private `workflow-implement.md` and `workflow-verify.md` differ from the public copies. |
| REQ-003 | The four committed retrieval artifacts - `trigger-index.json`, `corpus-manifest.json`, `generation-diagnostics.json` and `phrase-variants.json` - carry no `.skilled/` path naming the two private skills or the two removed surfaces after CI rebuilds them, and the retained `specs/sk-code/007-sk-code-obsidian-surface/` paths are reported as an explicit, counted allowlist rather than folded into that zero. |
| REQ-004 | An advisor database built into a throwaway directory from the fresh clone reports zero sk-code-family nodes whose id, domains, intent signals or derived block names webflow or obsidian, and the build is non-vacuous: the rebuild reports `skillCount` greater than zero. |
| REQ-005 | In the operator checkout, the Webflow probe returns `local-webflow` within the top two recommendations with confidence of at least 0.8, the Obsidian probe returns `local-obsidian` within the top two recommendations with confidence of at least 0.8, and the generic frontend probe still returns `sk-code` first, with the rank and score of each result recorded. The same three probes meet the same bounds from the Obsidian Plugin checkout, whose runtime directories are symlinks into this hub. Amended 2026-10-24 (operator ruling): the advisor daemon now carries the private roots and returns both private skills, but the measured ranks are `implement a responsive webflow animation module` with sk-code 0.695 then local-webflow 0.524 (confidence 0.82), `add an obsidian plugin command palette integration` with mcp-tooling 0.660 then local-obsidian 0.581, and `add a responsive css layout to the settings page` with sk-code 0.762 first. The operator ruled that the private skill must appear in the top two recommendations with confidence of at least 0.8, with ranks recorded, and that the generic frontend prompt must still return sk-code first. |
| REQ-006 | Every path listed by `git diff --stat 42b41dd286 HEAD` over the ten D6 out-of-scope path prefixes named in `plan.md` step 4 is empty, so every audited kept record is unchanged. Amended 2026-10-24 (operator ruling): the audit prints one changed path, `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py`, from commit `e00fef3e76`, the intended bounded-scan change landed by the third phase of this same program. That path and commit are the single accepted exception and the other nine prefixes stay required empty. |
| REQ-007 | `gh run list --branch main --limit 10` shows every run `completed` with conclusion `success` or `skipped` for the pushes recorded in the committed `09-ci.md`, and the runs of each evidence commit's own push - which no commit can contain, because the run is created by the push that creates the commit - are reported in the phase handoff message with their run ids and head sha. That gap is a recorded limit, not a claim of coverage. |
| REQ-008 | Every acceptance criterion is backed by an evidence file in `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/`, and `validate.sh --strict` prints `RESULT: PASSED`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-009 | `git status --porcelain` in the operator checkout lists neither `.skilled/skills/local-*` nor `.hermes/skills/local-*`, and `git check-ignore -v` names the D2 rule for both. |
| REQ-010 | The evidence states the four recorded limits instead of implying more: removed content stays in git history (D7), `git commit --no-verify` bypasses the pre-commit guard, which is why the fresh-clone check carries the proof, the CI runs of an evidence push itself are not committed but reported in the phase handoff message, and no pre-push surface-token guard exists, so this sweep is a one-time closure gate rather than a standing check. |
| REQ-011 | Every check is fail-closed: a non-zero count, a non-empty output where empty is expected, a missing tool or an unauthenticated `gh` leaves the criterion `Unmet` and the phase blocked. No criterion is marked `Met` from inference or from an exit status that was not read. |
| REQ-012 | A temporary repository holding an ignored `local-probe` skill with a unique marker produces four generated retrieval artifacts in which the marker count is `0` and a tracked control phrase count is at least `1`, so the corpus boundary is proven by a positive control rather than by an empty scan. |
| REQ-013 | A read-only history inventory records the number of reachable objects whose path names the removed surfaces, maps every tag to the old paths it retains, and lists every hosted release with its assets; no rewrite is executed. Amended 2026-10-24 (operator ruling): the measured values are 1681 reachable objects (not 1814), 157 remote tags (the 164 count is the operator checkout's local tags and includes 7 local-only tags), 18 tags with a non-zero old-path count and 30 of 146 hosted releases listed with every release having zero assets. |
| REQ-014 | The drift scripts named in `.github/workflows/routing-registry-drift.yml` lines 198-200 (the `ci-skill-root-metadata`, `ci-leaf-manifest-freshness` and `ci-skill-derived-freshness` commands) are run in the operator checkout with both private skills present, their exit codes are recorded, and the exported skill graph is checked for `local-` ids; a failure is recorded and routed, not repaired. |
| REQ-015 | After the evidence commit is pushed and after the trigger-index rebuild that follows it, the clone is refreshed and every path, content, bare-token, blob and artifact check is rerun against that tip, with the results committed in `11-final-tip.md`. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A fresh clone of `origin/main` contains no live tracked path or tracked content naming the two removed surfaces or the two private skills outside the D6 kept records - the 108 retained `specs/` paths are counted separately - and no new or changed private file shares a git blob identity with any blob reachable from the clone, while the ids the removal commit already carries are recorded as already public in history.
- **SC-002**: The six routing probes split the way the design intends - private skills win their own prompts and `sk-code` keeps generic frontend work - in both the operator checkout and the Obsidian Plugin checkout.
- **SC-003**: The four committed retrieval artifacts and a freshly built advisor database all report zero for live routing sources, while the retained 007 audit paths and the retained D6 hits are named and counted separately.
- **SC-004**: The evidence record in `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/` plus the transcribed `implementation-summary.md` lets a reader re-run every check and reach the same verdict, including against the final tip.
- **SC-005**: The corpus boundary is proven by a marker probe with a positive control, so a scan that indexed nothing cannot read as a pass.
- **SC-006**: The history inventory states what remains reachable without changing it, and every recorded limit is stated where a reader meets the claim it bounds.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases 001-004 on `main` | Nothing to verify; a leak found here is a real leak | Step 0 confirms the order with `git log`; a missing phase leaves the phase blocked, not guessed |
| Dependency | CI trigger-index rebuild after the push | The artifact checks read a stale index and fail spuriously | Wait for the rebuild commit before counting; `plan.md` step 6 names the poll and the 30-minute ceiling |
| Dependency | Authenticated `gh` | The CI criterion cannot be observed | `gh auth status` in preflight; if unauthenticated, REQ-007 stays `Unmet` and the phase reports blocked |
| Dependency | Obsidian Plugin checkout at `/Users/michelkerkmeester/MEGA/Development/Obsidian Plugin` | Its three probes cannot run and REQ-005 stays partly `Unmet` | A locate task runs first and stops with the recorded path when the directory is absent; the checkout is a consumer, not a target |
| Risk | The broad `local-` alternation matches unrelated paths - 992 tracked paths contain `local-` at `42b41dd286` (for example `.skilled/bin/relink-local-specs.sh`, `mcp-magicpath/feature-catalog/local-canvas/`) | A check that can never pass, or a real leak hidden in noise | Both greps use the precise private-skill alternation (`local-webflow` and `local-obsidian`) instead of bare `local-`; the baseline in `00-preflight.md` records the measured numbers |
| Risk | A rebuild with an empty scan reports `skillCount` 0 and "preserving existing graph", which makes the zero-row query vacuous | A false pass on REQ-004 | The rebuild must report `skillCount` greater than zero and no `EMPTY-SKILL-SCAN` warning; the count is quoted in the evidence |
| Risk | The advisor daemon serves a cached graph, so a probe returns the pre-phase answer | REQ-005 fails or passes for the wrong reason | `advisor_rebuild --trusted --force true` in each checkout before probing, and `advisor_status` must report freshness live |
| Risk | A routing probe fails because the private skill's trigger phrases lose to `sk-code` | Phase 004's graph metadata is wrong, not this phase's | Record the probe output and route the fix to phase 004; this phase never edits a private skill |
| Risk | `git commit --no-verify` bypasses the pre-commit guard (D3 recorded limit) | A leaked path could reach `main` without the guard firing | The fresh-clone sweep is the authoritative proof and does not depend on the hook |
| Risk | Removed content remains in git history and in tag trees (D7) | A reader may expect a scrubbed history | REQ-010 and `12-history-inventory.md` record the limit with counts; the rewrite stays an operator decision |
| Risk | The rebuilt index retains 69 `specs/sk-code/007-sk-code-obsidian-surface/` paths because `specs` is a corpus root (`corpus.mjs:31`) and the folder name carries the token | A whole-file zero check fails on retained audit specs and hides a real leak | The zero check is scoped to `.skilled/` paths, and the 69 retained paths are counted against an explicit allowlist; both counts are recorded |
| Risk | The rebuilt phrase index retains surface-named phrase keys from retained packet documents - 38 keys measured from the 007 packet and from `004-private-local-skills/spec.md` | A phrase-level zero check fails on historical records | The phrase check asserts zero for the four bare skill ids and counts the retained keys against a measured baseline of 38 |
| Risk | The blob comparison flags an empty file, whose blob is reachable by definition | A false positive that blocks closure | The comparison excludes zero-byte files explicitly and states why |
| Risk | The drift scripts fail once `local-*` roots exist, because their scanners take every direct child directory | A local run is red where CI is green | The drift task records the exit code and output as a finding and routes it to phase 003; it never repairs it |
| Risk | A commit cannot contain the CI result of the push that creates it | An evidence push's own runs stay uncommitted, so the committed `09-ci.md` cannot be the whole CI story | `09-ci.md` covers every run up to that push and states the limit; each push's runs are reported in the phase handoff message with their run ids and head sha, and appending them to `09-ci.md` after the push is forbidden because it would leave the evidence uncommitted |

### Rollback

The phase changes no production file, so rollback is one command plus three deletions: `git revert --no-edit $(git log --format=%H --grep='Surface-Verification-Phase: 005' origin/main)` restores the packet documents to their committed state, `rm -rf /tmp/psurf-clone-main /tmp/psurf-final-tip /tmp/psurf-db /tmp/psurf-corpus-probe` removes the throwaway clone, the final-tip clone, the database and the probe repository, and `node .skilled/bin/skill-advisor.cjs advisor_rebuild --trusted --json '{"force":true}' --format json` rebuilds the gitignored local graph the probes forced. `plan.md` section 7 owns the procedure and its trigger. The rebuild exports both external `local-skills/` roots in `SPECKIT_PRIVATE_SKILL_ROOTS` first, so it keeps the symlinked skills in the graph.
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The whole phase runs in one sitting; the only waiting steps are the two CI rebuilds, each capped at 30 minutes by `plan.md` step 6.
- **NFR-P02**: No check builds a search index over the whole repository, installs a dependency or downloads a model. The advisor database build is a metadata scan of the clone, and the corpus probe indexes four documents.

### Security
- **NFR-S01**: The evidence contains command output only - no file bodies from `.skilled/skills/local-*`, no URLs for the two external repositories, while the public origin clone URL `https://github.com/MichelKerkmeester/skilled-agent-harness_spec-driven-loops.git` is allowed, and no paths inside an external repository beyond the two `local-skills/` parents and the two symlink targets needed to prove the layout; no prompt text beyond the six fixed probe strings.
- **NFR-S02**: The fresh clone, the final-tip clone, the throwaway database and the probe repository live outside the repository (`/tmp/psurf-clone-main`, `/tmp/psurf-final-tip`, `/tmp/psurf-db`, `/tmp/psurf-corpus-probe`) and are removed at close.
- **NFR-S03**: The blob comparison publishes blob ids only, never file contents, so a private byte never enters a tracked file through the evidence.

### Reliability
- **NFR-R01**: Every check is repeatable from the recorded command; two runs on the same commit produce the same verdict.
- **NFR-R02**: A check that cannot run is reported as blocked with the failing command and its output, never as a pass.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- Empty input: a grep that matches nothing exits 1 and prints nothing; every zero check wraps the command so zero matches is an explicit success and is read together with the printed count, never from the exit status alone.
- Maximum length: the content sweep prints 1529 lines at the planning tip (`583316d083`) and 1528 at `42b41dd286`; the difference is one line in `phrase-variants.json` that the intervening index rebuilds added. The evidence quotes the count plus every path outside the D6 allowlist, never the full listing.
- Empty file: a zero-byte private file hashes to the reachable empty blob, so the blob comparison excludes it and states that exclusion.
- Invalid format: a non-integer `skillCount`, a missing `data.recommendations` array or a `jq` parse error leaves the criterion `Unmet`.

### Error Scenarios
- External service failure: `gh` unauthenticated or rate-limited leaves REQ-007 `Unmet` and the phase blocked; no fallback claim.
- Network timeout: the clone and the CI polls both have a ceiling; on timeout the evidence records the failure and the phase stops.
- Missing consumer checkout: the locate task records the search output and stops before the three plugin probes, leaving REQ-005 partly `Unmet`.
- Concurrent access: the advisor daemon may hold the throwaway database open; the query runs with `sqlite3 -readonly` and a fresh `SYSTEM_SKILL_ADVISOR_DB_DIR` per run.

### State Transitions
- Partial completion: checks may run in any order except the clone, the index count and the final tip, where order matters; a partially filled evidence set leaves the affected criteria `Unmet`.
- Session expiry: the phase resumes by re-running the evidence step whose file is missing; nothing is remembered from a previous session.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | [6/25] | No code; 15 evidence documents and 17 read-only checks across four artifacts, two checkouts and one temporary repository |
| Risk | [5/25] | Read-only and reversible, no deployment; the only waits are two CI rebuilds and the only external state is a throwaway database |
| Research | [8/20] | The checks, allowlists and baselines are fixed in `plan.md` and measured on disk before writing |
| Multi-Agent | [0/15] | One writer and one read-only reviewer, run through the `subagent` tool; no parallel workstreams |
| Coordination | [3/15] | Three ordered commits and two CI waits; no cross-team dependency |
| **Total** | **[22/100]** | **Level 3** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | A tracked path or content line survives in the hub or the Hermes mirror | H | L | Fresh-clone path and content sweeps with a measured positive control |
| R-002 | The rebuilt index or a sidecar keeps a live routing entry | H | M | Four-artifact check scoped to `.skilled/` paths, plus the 69-path allowlist count |
| R-003 | The advisor graph keeps a surface signal after the rebuild | H | L | Throwaway database, non-vacuous build, zero-row query |
| R-004 | A private byte reaches the public remote under a different name | M | L | Blob identity comparison over new or changed private content, after the already-public ids are recorded |
| R-005 | The corpus indexes ignored private bytes | M | L | Temporary-repository marker probe with a tracked positive control |
| R-006 | The external consumer checkout routes a surface prompt to a hub skill | M | M | Symlink-target check and three probes from the plugin checkout |
| R-007 | A local drift script fails once `local-*` roots exist | M | M | Record the exit code and route to phase 003; never repair here |
| R-008 | History, tags or release assets retain the removed content | M | H | Read-only inventory with counts; rewrite left to the operator |

## 11. USER STORIES

### US-001: Prove the removal held on the public remote (Priority: P0)

**As an** operator who just moved two surfaces into private skills, **I want** the public clone swept for paths, content and blob identities, **so that** I can say the removal held on the artifact other people actually receive rather than on my working copy.

**Acceptance criteria:** see `acceptance-criteria.md` rows AC-001, AC-002, AC-003 and AC-006.

---

### US-002: Keep routing working for both consumers (Priority: P0)

**As an** operator whose advisor and whose plugin checkout both route work, **I want** the six probes to split private prompts from generic frontend prompts, **so that** a removed surface does not leave a hole that silently sends Webflow work to `sk-code`.

**Acceptance criteria:** see `acceptance-criteria.md` rows AC-004, AC-005 and AC-014.

---

### US-003: Know what the proof does not cover (Priority: P1)

**As a** reader of this packet six months from now, **I want** every limit named next to the claim it bounds, **so that** I do not read a one-time sweep as a standing guarantee or a green CI line as a scrubbed history.

**Acceptance criteria:** see `acceptance-criteria.md` rows AC-010, AC-013 and AC-015.

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See `decision-record.md`

---

## 12. OPEN QUESTIONS

- How long may a CI trigger-index rebuild take before an artifact check counts as blocked? Resolved in `plan.md` step 6: poll for 30 minutes, then record blocked.
- A routing probe fails - does this phase edit the private skill's trigger phrases? Resolved in the Risks table: no, phase 004 owns them and this phase records the failure.
- Where is the Obsidian Plugin checkout? Resolved on 2026-10-23: `/Users/michelkerkmeester/MEGA/Development/Obsidian Plugin`, found with the locate command in `plan.md` step 7 and confirmed to hold eight symlinks into this hub. The phase still runs the locate task, because a moved checkout must stop the run rather than silently skip three probes.
- Does the rebuilt index retain the 007 paths? Resolved by measurement: 69 path lines at `42b41dd286` and at the planning tip, all under `specs/sk-code/007-sk-code-obsidian-surface/`, so the zero check is scoped and the 69 are allowlisted.
- Do the drift scripts pass with `local-*` roots present? Unproven by planning; `13-drift.md` records the answer and routes a failure instead of repairing it.
- **Correction recorded 2026-10-23**: earlier drafts cited `resolveSkillGraphDbDir` at `skill-graph-db.ts:271` and `SYSTEM_SKILL_ADVISOR_DB_DIR` at line 272; the file on disk has them at 270 and 271. Earlier drafts also described `fusion.ts:600-602` as the Webflow CMS match; the match is at line 602, with the comment at 599-601. Earlier drafts said the index carried no surface-named phrase keys; it carries 59 in space-normalized form, of which 38 survive the rebuild. All three are corrected in this revision.
<!-- /ANCHOR:questions -->

---

