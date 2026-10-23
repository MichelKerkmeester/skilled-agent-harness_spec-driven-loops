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

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-10-23 |
| **Branch** | `deepseekpihigh` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 5 |
| **Predecessor** | 004-private-local-skills |
| **Successor** | None |
| **Handoff Criteria** | Every row of `acceptance-criteria.md` is `Met` with observed command output recorded in `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/`, and `validate.sh --strict` prints `RESULT: PASSED`. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the Move the Webflow and Obsidian surfaces out of the shipped sk-code hub into gitignored local-* private skills that only the operator's local advisor routes specification.

**Scope Boundary**: In scope: the sk-code hub tree, tracked consumers that name `sk-code-webflow`, `sk-code-obsidian`, or the `WEBFLOW` / `OBSIDIAN` surface tokens, and the advisor's sk-code surface vocabulary. Out of scope, kept unchanged: generic Webflow/Obsidian words in other skills (mcp-tooling/mcp-obsidian, mcp-notion, mcp-code-mode's Webflow CMS vocabulary at `fusion.ts:600-602`, `explicit.ts:131`, `skill_advisor.py:2181`, the `P1-MCP-002` regression and holdout rows, sk-design style bundles); dated historical records (every `changelog/` file, `.skilled/changelog/skilled/*.md`, `benchmark/reports/`, `specs/**/z_archive/`, the `doctor-update-*` playbooks in `.skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/` that name units of the past v4.0.0.2 release, and the `anchor-repair-sample` test fixture); git history.

This phase changes no production code. It runs checks that read the repository, a fresh clone of `origin/main` and a throwaway advisor database, and it writes only its own evidence documents.

**Dependencies**:
- Phases 001 through 004 have landed on `main`, in that order. 004 depends only on 001 (the ignore rules must exist before any private file is written) but runs after 003 so the advisor scan already follows a `local-*` symlink.
- The operator's main checkout `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public` holds the two private skills (`.skilled/skills/local-webflow/`, `.skilled/skills/local-obsidian/`), which phase 004 creates. Phase 004 runs in that checkout, not in a worktree of its own: the two trees are gitignored, so they exist on one disk and are never carried into another checkout.
- CI rebuilds `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json` after each push to `main` (the `chore(system-spec-kit): rebuild the trigger index` commits).
- `git`, `node`, `sqlite3`, `jq` and an authenticated `gh` on the operator machine.

**Deliverables**:
- `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/00-preflight.md` through `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/10-review.md`, one file per check.
- The same results transcribed into `implementation-summary.md` at close.
- `acceptance-criteria.md` rows marked `Met` with the observed output quoted.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phases 001 through 004 delete the two surfaces from the hub, scrub the advisor vocabulary and recreate them as gitignored private skills, but nothing yet proves the result. The leak paths are not visible from a green local test run: a gitignored folder still sits on disk, the committed trigger index is rebuilt by CI after the push rather than by the developer, the advisor graph database is local and ignored, and `git commit --no-verify` bypasses the pre-commit guard. A packet that closed on "the tests pass" could therefore ship a tracked file naming `sk-code-webflow`, an index line naming `local-obsidian`, or a routing table that sends a Webflow prompt to `sk-code`.

### Purpose
Prove, with commands whose output is recorded, that the two surfaces left no tracked trace, no committed index entry, no sk-code-family advisor vocabulary and no routing hole, and that the private skills still win their own prompts locally.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A tracked-path and tracked-content leak sweep over a fresh clone of `origin/main`.
- The D6 boundary audit: the ten out-of-scope path prefixes named in `plan.md` step 4 are byte-identical to commit `42b41dd286`. The dated records the step 3 grep excludes (per-skill `changelog/`, `benchmark/reports/`, `specs/**/z_archive/`) are kept by D6 but are not audited for byte-identity, because phase 002 deletes the surface changelog and benchmark folders and overwrites the `z_archive` fixture twins.
- An advisor graph database built into a throwaway directory from the fresh clone, queried for any sk-code-family node whose id, domains, intent signals or derived block names webflow or obsidian.
- The committed trigger index, after CI rebuilds it, checked for private-skill names and removed surface ids.
- Three local routing probes in the operator checkout: a Webflow prompt, an Obsidian prompt and a generic frontend prompt.
- D5 invisibility: `git status --porcelain` never lists a private skill, so no ignore rule or commit guard has to fire in practice.
- CI status on `main` for the phase commit and for the trigger-index rebuild that follows it.
- The evidence documents listed under Deliverables.

### Out of Scope
- Any code change. The D5 consumers (`skill_graph_compiler.py:200`, `sync-skills-hermes.cjs` `listSkillFiles` lines 51-68, `ci-skill-root-metadata.cjs:143`, `skill-graph-freshness.cjs:146-148`) and the D4 symlink scans (`skill-graph-db.ts:733`, `freshness.ts:143`) belong to phase 003. `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs` `gitIgnoredPaths` (lines 200-210) needs no change: it honours committed `.gitignore` files, so D2 alone keeps `local-*` out of the index.
- Creating, restoring or editing the private skills - phase 004 owns them, and this phase never writes inside `.skilled/skills/local-*`.
- Editing any D6 kept record. A failing D6 check is reported and routed to the phase that caused it, never repaired here.
- Scrubbing git history (D7). Removed content stays in history; `filter-repo` plus a force push is an optional operator decision.
- Parent packet documents (`../spec.md`, `../graph-metadata.json`).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/00-preflight.md` | Create | Phase order and baseline numbers at `42b41dd286` |
| `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/01-head-leak-sweep.md` | Create | Tracked path and content sweep in the writer worktree |
| `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/02-fresh-clone.md` | Create | Clone command, clone HEAD sha, clean-tree assertion |
| `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/03-fresh-clone-leak.md` | Create | Both leak greps in the clone plus the bare `WEBFLOW`/`OBSIDIAN` token sweep, with the D6 allowlist classification |
| `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/04-d6-kept-records.md` | Create | `git diff 42b41dd286 HEAD` over the out-of-scope paths |
| `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/05-advisor-db.md` | Create | Throwaway DB build plus the zero-row query |
| `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/06-trigger-index.md` | Create | Index line count after the CI rebuild |
| `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/07-routing-probes.md` | Create | Three local `advisor_recommend` probes and their top result |
| `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/08-local-invisibility.md` | Create | `git status --porcelain` and `git check-ignore -v` in the operator checkout |
| `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/09-ci.md` | Create | `gh run list` output for `main`, plus the stated limit that the evidence push's own runs are reported in the handoff message |
| `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/10-review.md` | Create | Reviewer findings and how each was answered |
| `implementation-summary.md` | Modify | Transcribe the evidence at close |
| `acceptance-criteria.md` | Modify | Row statuses and the closure statement |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | In a fresh clone of `origin/main`, no tracked path names `local-webflow`, `local-obsidian`, `sk-code-webflow` or `sk-code-obsidian`. |
| REQ-002 | In the same clone, the tracked-content sweep prints no path outside the two D6 kept-record prefixes named in `plan.md` step 3, and a second sweep for the bare `WEBFLOW` and `OBSIDIAN` tokens over `.skilled/skills/sk-code` and `.hermes/skills/sk-code` prints `0` lines once the kept `WEBFLOW:` comment-hygiene platform tag lines and the dated `changelog/` and `benchmark/reports/` records are excluded. |
| REQ-003 | The committed trigger index reports zero lines naming the two private skills or the two removed surfaces, after CI rebuilds it. |
| REQ-004 | An advisor database built into a throwaway directory from the fresh clone reports zero sk-code-family nodes whose id, domains, intent signals or derived block names webflow or obsidian, and the build is non-vacuous: the rebuild reports `skillCount` greater than zero. |
| REQ-005 | In the operator checkout, the Webflow probe returns `local-webflow` as the top recommendation, the Obsidian probe returns `local-obsidian`, and the generic frontend probe returns `sk-code`. |
| REQ-006 | Every path listed by `git diff --stat 42b41dd286 HEAD` over the ten D6 out-of-scope path prefixes named in `plan.md` step 4 is empty, so every audited kept record is unchanged. |
| REQ-007 | `gh run list --branch main --limit 10` shows every run `completed` with conclusion `success` or `skipped` for the pushes recorded in the committed `09-ci.md`, and the runs of the evidence commit's own push - which no commit can contain, because the run is created by the push that creates the commit - are reported in the phase handoff message with their run ids and head sha. That gap is a recorded limit, not a claim of coverage. |
| REQ-008 | Every acceptance criterion is backed by an evidence file in `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/`, and `validate.sh --strict` prints `RESULT: PASSED`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-009 | `git status --porcelain` in the operator checkout lists neither `.skilled/skills/local-*` nor `.hermes/skills/local-*`, and `git check-ignore -v` names the D2 rule for both. |
| REQ-010 | The evidence states the three recorded limits instead of implying more: removed content stays in git history (D7), `git commit --no-verify` bypasses the pre-commit guard, which is why the fresh-clone check carries the proof, and the CI runs of the evidence push itself are not committed but reported in the phase handoff message with their run ids. |
| REQ-011 | Every check is fail-closed: a non-zero count, a non-empty output where empty is expected, a missing tool or an unauthenticated `gh` leaves the criterion `Unmet` and the phase blocked. No criterion is marked `Met` from inference or from an exit status that was not read. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A fresh clone of `origin/main` contains no tracked path or tracked content naming the two removed surfaces or the two private skills, outside the D6 kept records.
- **SC-002**: The three local routing probes split the way the design intends - private skills win their own prompts and `sk-code` keeps generic frontend work.
- **SC-003**: The committed trigger index and a freshly built advisor database both report zero, so neither tracked retrieval artifact can reintroduce the surfaces.
- **SC-004**: The evidence record in `specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/scratch/evidence/` plus the transcribed `implementation-summary.md` lets a reader re-run every check and reach the same verdict.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases 001-004 on `main` | Nothing to verify; a leak found here is a real leak | Step 0 confirms the order with `git log`; a missing phase leaves the phase blocked, not guessed |
| Dependency | CI trigger-index rebuild after the push | The index check reads a stale 200-line file and fails spuriously | Wait for the rebuild commit before counting; `plan.md` step 6 names the poll and the 30-minute ceiling |
| Dependency | Authenticated `gh` | The CI criterion cannot be observed | `gh auth status` in preflight; if unauthenticated, REQ-007 stays `Unmet` and the phase reports blocked |
| Risk | The broad `local-` alternation matches unrelated paths - 992 tracked paths contain `local-` at `42b41dd286` (for example `.skilled/bin/relink-local-specs.sh`, `mcp-magicpath/feature-catalog/local-canvas/`) | A check that can never pass, or a real leak hidden in noise | Both greps use the precise private-skill alternation (`local-webflow` and `local-obsidian`) instead of bare `local-`; the baseline in `00-preflight.md` records the measured numbers |
| Risk | A rebuild with an empty scan reports `skillCount` 0 and "preserving existing graph", which makes the zero-row query vacuous | A false pass on REQ-004 | The rebuild must report `skillCount` greater than zero and no `EMPTY-SKILL-SCAN` warning; the count is quoted in the evidence |
| Risk | The advisor daemon serves a cached graph, so a probe returns the pre-phase answer | REQ-005 fails or passes for the wrong reason | `advisor_rebuild --trusted --force true` in the operator checkout before probing, and `advisor_status` must report freshness live |
| Risk | A routing probe fails because the private skill's trigger phrases lose to `sk-code` | Phase 004's graph metadata is wrong, not this phase's | Record the probe output and route the fix to phase 004; this phase never edits a private skill |
| Risk | `git commit --no-verify` bypasses the pre-commit guard (D3 recorded limit) | A leaked path could reach `main` without the guard firing | The fresh-clone sweep is the authoritative proof and does not depend on the hook |
| Risk | Removed content remains in git history (D7) | A reader may expect a scrubbed history | REQ-010 records the limit in the evidence |
| Risk | A commit cannot contain the CI result of the push that creates it | The evidence push's own runs stay uncommitted, so the committed `09-ci.md` cannot be the whole CI story | `09-ci.md` covers every run up to that push and states the limit; the push's runs are reported in the phase handoff message with their run ids and head sha, and appending them to `09-ci.md` after the push is forbidden because it would leave the evidence uncommitted |

### Rollback

The phase changes no production file, so rollback is one command plus two deletions: `git revert <phase-commit-sha>` restores the packet documents to their scaffolded state, `rm -rf /tmp/psurf-clone-main /tmp/psurf-db` removes the throwaway clone and database, and `node .skilled/bin/skill-advisor.cjs advisor_rebuild --trusted --json '{"force":true}' --format json` rebuilds the gitignored local graph the probes forced. `plan.md` section 7 owns the procedure and its trigger.
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The whole phase runs in one sitting; the only waiting step is the CI rebuild, capped at 30 minutes by `plan.md` step 6.
- **NFR-P02**: No check builds a search index, installs a dependency or downloads a model. The advisor database build is a metadata scan of the clone.

### Security
- **NFR-S01**: The evidence contains command output only - no file bodies from `.skilled/skills/local-*`, no paths inside a private repository, no prompt text beyond the three fixed probe strings.
- **NFR-S02**: The fresh clone and the throwaway database live outside the repository (`/tmp/psurf-clone-main`, `/tmp/psurf-db`) and are removed at close.

### Reliability
- **NFR-R01**: Every check is repeatable from the recorded command; two runs on the same commit produce the same verdict.
- **NFR-R02**: A check that cannot run is reported as blocked with the failing command and its output, never as a pass.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: a grep that matches nothing exits 1 and prints nothing; the pass case is the empty output, read together with the printed count, not the exit status.
- Maximum length: the content sweep prints about 1,528 lines at `42b41dd286`; the evidence quotes the count plus every path outside the D6 allowlist, never the full listing.
- Invalid format: a non-integer `skillCount`, a missing `data.recommendations` array or a `jq` parse error leaves the criterion `Unmet`.

### Error Scenarios
- External service failure: `gh` unauthenticated or rate-limited leaves REQ-007 `Unmet` and the phase blocked; no fallback claim.
- Network timeout: the clone and the CI poll both have a ceiling; on timeout the evidence records the failure and the phase stops.
- Concurrent access: the advisor daemon may hold the throwaway database open; the query runs with `sqlite3 -readonly` and a fresh `SYSTEM_SKILL_ADVISOR_DB_DIR` per run.

### State Transitions
- Partial completion: checks may run in any order except steps 1, 5 and 6 (order matters there); a partially filled evidence set leaves the affected criteria `Unmet`.
- Session expiry: the phase resumes by re-running the evidence step whose file is missing; nothing is remembered from a previous session.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | [6/25] | No code; 11 evidence documents and 4 checks that read the repository |
| Risk | [4/25] | Read-only, reversible, no deployment; the only wait is CI |
| Research | [8/20] | The checks, their allowlists and their baselines are already fixed in `plan.md` |
| **Total** | **[18/70]** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- How long may the CI trigger-index rebuild take before REQ-003 counts as blocked? Resolved in `plan.md` step 6: poll for 30 minutes, then record blocked.
- A routing probe fails - does this phase edit the private skill's trigger phrases? Resolved in the Risks table: no, phase 004 owns them and this phase records the failure.
<!-- /ANCHOR:questions -->

---


