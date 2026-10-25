---
title: "Feature Specification: Phase 4: private-local-skills"
description: "The Webflow and Obsidian surfaces leave the shipped sk-code hub, but the operator still needs their evidence. This phase restores both trees into two external repositories under each repository's local-skills directory and links them as gitignored local-* skills, with no tracked file and no staged path in this checkout."
trigger_phrases:
  - "private local skills"
  - "phase 4 private local skills"
  - "local-webflow local-obsidian"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 4: private-local-skills

<!-- SPECKIT_LEVEL: 3 -->
---

<!-- ANCHOR:metadata -->
## EXECUTIVE SUMMARY

This phase restores the two removed evidence surfaces as gitignored symlinks at
`.skilled/skills/local-webflow/` and `.skilled/skills/local-obsidian/`, pointing into two external
repositories, makes each tree standalone, and
gives each a skill-root `graph-metadata.json` so the operator's advisor can route it. It writes nothing
tracked in this checkout: both links are ignored, the only commit here carries this phase's documents,
and each target repository gets its own commit that stages only `local-skills/<name>`.

**Key Decisions**: ADR-001 records the operator's answer - symlink mode with two external repositories,
one per skill, with the Obsidian repository public by operator choice and the Webflow repository private;
the restore is pinned to `42b41dd286`; the six workflow references become real copies written from that
commit; phase 004 starts only after phase 003's `local-*` compiler skip is on `main`.

**Critical Dependencies**: phase 003's compiler skip on `origin/main`, phase 1's `local-*` ignore rules,
and commit `42b41dd286` in the local object database.

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-10-23 |
| **Branch** | The checked-out branch, pushed with `git push origin HEAD:main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 5 |
| **Predecessor** | 003-advisor-vocabulary-cleanup |
| **Successor** | 005-leak-and-routing-verification |
| **Handoff Criteria** | Both `local-*` links resolve into their own repository's `local-skills/` directory, every relative link resolves, each carries one skill-root `graph-metadata.json`, both target-repository commits hold only their own skill, `git status --porcelain .skilled` is empty here, `git diff --cached --name-only` is empty here, `SPECKIT_PRIVATE_SKILL_ROOTS` holds both roots, and `validate.sh --strict` on this child prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the Move the Webflow and Obsidian surfaces out of the shipped sk-code hub into two gitignored local-* links that point into external repositories and that only the operator's local advisor routes specification.

**Scope Boundary**: In scope are the two local-* links at `.skilled/skills/local-webflow/` and `.skilled/skills/local-obsidian/`, their two external target trees, plus this child's own documents. No tracked file outside this child changes. The hub tree, the advisor runtime, the commit guard, the trigger index and the Hermes mirror belong to phases 1, 2, 3 and 5.

**Checkout**: The run splits by role, not by directory list. The operator's main checkout, `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`, owns the two `local-*` links and every command that reads them: both links are gitignored, and ignored links never travel between checkouts, so a link created inside a separate worktree stays in that worktree, invisible to the operator's checkout and to the advisor that serves it. The target bytes live in the two external repositories. The `WORKTREE` checkout owns every packet-document edit, including `implementation-summary.md`: it is `OPERATOR` by default, and when the orchestrator chose a separate worktree the documents exist only there. The evidence is transcribed from readings taken in the operator's checkout and the target repositories, and the phase's single documents commit and push go through `WORKTREE`. No packet document is copied between checkouts, and no copy bridge exists or is needed.

**Dependencies**:
- `001-ignore-and-commit-guard` must have landed: `/.skilled/skills/local-*` and `/.hermes/skills/local-*` in the root `.gitignore`, and the pre-commit guard that refuses a staged `local-*` path. Without the ignore rules the two links would be tracked here.
- `003-advisor-vocabulary-cleanup` must have landed: the advisor disk scan and the freshness scan accept a top-level `local-*` entry that is a symlink resolving to a directory, and the skill-graph compiler skips `local-*` before it probes. The recorded symlink mode requires that support. The two external roots must also be listed in `SPECKIT_PRIVATE_SKILL_ROOTS`, joined with `:`, in every advisor process.
- Commit `42b41dd286` must be present in the local object database; it is the restore source and the base commit for every removed file.

**Deliverables**:
- `.skilled/skills/local-webflow/` and `.skilled/skills/local-obsidian/`, restored from `42b41dd286` into two external repositories under each repository's `local-skills/` directory, then linked to those folders in this checkout and kept gitignored here.
- Two target-repository commits and two pushes, each staging only `local-skills/<name>` by path and each push gated on an explicit operator yes.
- A durable `SPECKIT_PRIVATE_SKILL_ROOTS` entry holding both roots, and an explicit two-root export in every advisor probe.
- Two standalone skill identities: frontmatter `name` equal to the folder name, no `metadata.family`, no `packetKind`, and no prose claiming a parent hub bundles the skill.
- One skill-root `graph-metadata.json` per skill, so the operator's local advisor can score and return it.
- A recorded, local-only evidence trail in `implementation-summary.md`.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The shipped sk-code hub carried two large evidence surfaces, `.skilled/skills/sk-code/sk-code-webflow/` (1.5M) and `.skilled/skills/sk-code/sk-code-obsidian/` (504K), 226 tracked files together. Phases 2 and 3 take them out of the public tree, the public routing vocabulary and the public advisor graph. Removing them without a replacement deletes working knowledge the operator still uses on real Webflow and Obsidian tasks, and the hub's surface framing makes them unusable anywhere else: every internal link is relative to a hub location, three workflow references are symlinks into the hub's shared tier, and the documents describe themselves as read-only evidence a parent hub attaches.

### Purpose
Restore both surfaces from git history into two external repositories and expose them through two gitignored `local-*` links that stand alone, so the operator keeps the evidence and the local advisor routes it, while no tracked file in this checkout, no committed trigger index and no Hermes mirror ever names them again.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Restoring both surface trees from commit `42b41dd286` into two external repositories at `/Users/michelkerkmeester/MEGA/Development/Obsidian Plugin/local-skills/local-obsidian` and `/Users/michelkerkmeester/MEGA/Development/Websites/anobel.com/local-skills/local-webflow`, then linking them as `.skilled/skills/local-*` in the operator's main checkout.
- Replacing the three `references/workflow-{implement,debug,verify}.md` symlinks in each skill with real file copies, and fixing the guardrail link inside those copies.
- Rewriting every relative link in both skills that the move would break, so each one resolves to the target it resolved to at `42b41dd286`.
- Rewriting every absolute `.skilled/skills/sk-code/sk-code-{webflow,obsidian}` path inside both skills to the new location, excluding `changelog/` and `benchmark/reports/`.
- Turning each tree into a standalone skill: frontmatter identity, no hub-bundling or advisor-invisible prose, one skill-root `graph-metadata.json`.
- Recording the evidence locally: links ignored in this checkout, target trees committed in their own repositories, and a summary in `implementation-summary.md` without private content.

### Out of Scope
- The hub tree, its registries, its manifests and its own docs - phase 2 owns every one of them.
- The advisor's tracked vocabulary, tests and fixtures - phase 3 owns them.
- The ignore rules and the pre-commit guard - phase 1 owns them.
- The fresh-clone leak proof, the trigger-index count and the local routing probes - phase 5 owns them.
- Generic Webflow and Obsidian words in other skills, and every dated historical record (every `changelog/` file, `.skilled/changelog/skilled/*.md`, `benchmark/reports/`, `specs/**/z_archive/`, the `doctor-update-*` playbooks, the `anchor-repair-sample` fixture) - the D6 boundary keeps them unchanged, and this phase touches none of them.
- A `description.json` at either skill root - no leaf skill in the repository carries one (`.skilled/skills/sk-git/` has none) and no consumer reads it; `graph-metadata.json` is the routing artifact.
- Git history - the removed content stays in history, and scrubbing it (filter-repo plus a force push) is an optional operator decision.
- Pre-existing link rot: a relative link that was already broken at `42b41dd286` stays exactly as it was, so the phase's proof is that the broken set does not grow.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/local-webflow`, `.skilled/skills/local-obsidian` | Create (ignored symlinks) | Links in this checkout to the two external repository targets; both stay gitignored here |
| `/Users/michelkerkmeester/MEGA/Development/Websites/anobel.com/local-skills/local-webflow/**` | Create (external, committed there) | Webflow evidence restored from `42b41dd286`, then made standalone; the repository is private |
| `/Users/michelkerkmeester/MEGA/Development/Obsidian Plugin/local-skills/local-obsidian/**` | Create (external, committed there) | Obsidian evidence restored from `42b41dd286`, then made standalone; the repository is public by operator choice |
| `.skilled/skills/local-webflow/graph-metadata.json` | Create (ignored) | Skill-root routing identity for the local advisor |
| `.skilled/skills/local-obsidian/graph-metadata.json` | Create (ignored) | Skill-root routing identity for the local advisor |
| `~/.zshrc` | Modify (outside this repository) | One quoted `export SPECKIT_PRIVATE_SKILL_ROOTS="..."` line, appended only after an explicit operator yes |
| `implementation-summary.md` | Modify | The phase's local-only evidence trail |
| `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md` | Modify | This plan and its gates |
| `decision-record.md` | Modify | Seven decision records; ADR-001 records the operator's two-repository symlink answer |
| `goal.md` | Create | The phase's durable directive and completion criteria |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Both trees exist in two external repositories under each repository's `local-skills/` directory - `local-obsidian` at `/Users/michelkerkmeester/MEGA/Development/Obsidian Plugin/local-skills/local-obsidian` and `local-webflow` at `/Users/michelkerkmeester/MEGA/Development/Websites/anobel.com/local-skills/local-webflow` - restored from `42b41dd286` by `git archive` piped through `tar --strip-components=4`, and both are linked as `.skilled/skills/local-*` in the operator's main checkout. Neither target sits under a repository's `.skilled`, `.opencode` or `.claude` symlink. ADR-001 records the operator's answer. |
| REQ-002 | In each skill, `references/workflow-implement.md`, `references/workflow-debug.md` and `references/workflow-verify.md` are real files with the content of `.skilled/skills/sk-code/shared/references/workflow-*.md` at `42b41dd286`, and the `workflow-guardrails.md` link inside each copy resolves to `.skilled/skills/sk-code/sk-code-skilled/references/shared/workflow-guardrails.md`. |
| REQ-003 | Every relative link in both skills resolves to the same target it resolved to at `42b41dd286`. No link that resolved before the move may fail after it, and a link that was already broken stays untouched. |
| REQ-004 | No file under either skill names `.skilled/skills/sk-code/sk-code-webflow` or `.skilled/skills/sk-code/sk-code-obsidian`, except files under `changelog/` and `benchmark/reports/`. |
| REQ-005 | Each skill is standalone: `SKILL.md` frontmatter `name` equals the folder name (`local-webflow`, `local-obsidian`), carries no `metadata.family` and no `packetKind`, and neither `SKILL.md` nor `README.md` claims that a parent hub detects, bundles or projects the skill, or that the skill is advisor-invisible. |
| REQ-006 | Each skill carries exactly one `graph-metadata.json`, at the skill root, with `skill_id` equal to the folder name, a `family` from the advisor's allowlist, non-empty `derived.trigger_phrases`, `key_topics`, `key_files`, `entities` and `source_docs`, and a `derived.causal_summary`. No nested `graph-metadata.json` or `description.json` exists below either skill root. |
| REQ-007 | In this checkout, nothing under the two symlinks is tracked or staged: `git status --porcelain .skilled` prints nothing, `git diff --cached --name-only` prints nothing, `git status --porcelain --ignored .skilled/skills/local-webflow .skilled/skills/local-obsidian` reports both paths with the `!!` prefix and nothing else, and `git check-ignore -v` names the phase 1 ignore rule for each path. The two target repositories track and commit their own `local-skills/<name>` content separately. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-008 | `implementation-summary.md` records the two-repository symlink decision, both restore commands, both target-repository commits, the link audit before and after, the ignore evidence, the two-root environment value and the advisor-scan result, quoting no private file content beyond paths and counts. |
| REQ-009 | No file inside either skill carries a spec path, a packet number or a phase number in a code comment; the only permitted occurrence is prose inside a document that already carried it at `42b41dd286`. |
| REQ-010 | This phase does not start until phase 003's `local-*` skip is present in `.skilled/skills/system-skill-advisor/runtime/scripts/skill_graph_compiler.py` on `origin/main` and in the operator's working copy, because that compiler follows a symlink today and would export a private skill into the tracked `skill-graph.json`. |
| REQ-011 | This phase commits only its own documents, from the `WORKTREE` checkout, by name, after every check passes, and pushes `HEAD:main` last; no path under `.skilled/skills/local-*` is ever staged. Each target repository gets one commit that stages only `local-skills/<name>` by path and one push, and each push runs only after an explicit operator yes at run time. |
| REQ-012 | A throwaway advisor database, selected with `SYSTEM_SKILL_ADVISOR_DB_DIR`, holds one `skill_nodes` row for `local-webflow` and one for `local-obsidian`, so the operator's advisor can score both skills. |
| REQ-013 | One independent read-only OpenCode 2 `subagent` review, run with agent `review` or `deep-review`, confirms the phase's checks and records one `PASS` row per check before the documents are committed; the prompt says it edits no file, and the before and after `git status --porcelain` outputs must match. |
| REQ-014 | `.skilled/skills/local-webflow` and `.skilled/skills/local-obsidian` are symlinks that resolve into their own repository's `local-skills/` directory, and both links stay git-ignored in this checkout under phase 1's rule. |
| REQ-015 | `SPECKIT_PRIVATE_SKILL_ROOTS` holds both roots joined by `:` for every advisor process. T006b appends one quoted export line to `~/.zshrc` only after an explicit operator yes and proves it with a fresh login shell; every advisor probe in the phase also exports both roots explicitly. |
| REQ-016 | Each target repository receives one commit that stages only `local-skills/<name>` by path, and one push to `HEAD:main` (or the repository's current branch) that runs only after an explicit operator yes. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `git status --porcelain .skilled` is empty and `git status --porcelain --ignored .skilled/skills/local-webflow .skilled/skills/local-obsidian` reports exactly two `!!` entries, one per `local-*` link, while `find .skilled/skills/local-webflow/ -type f | wc -l` prints `162` and `find .skilled/skills/local-obsidian/ -type f | wc -l` prints `66`, one more than the archived counts because each tree carries its skill-root `graph-metadata.json`.
- **SC-002**: The Webflow audit reports exactly one broken link, the pre-existing `-> target` placeholder, and ends `AUDIT_FAIL=1`; the Obsidian audit reports no broken link and ends `AUDIT_FAIL=0`.
- **SC-003**: A throwaway advisor database built with `SYSTEM_SKILL_ADVISOR_DB_DIR` contains a `skill_nodes` row for `local-webflow` and one for `local-obsidian`.
- **SC-004**: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/013-private-surface-skills/004-private-local-skills --strict` prints `RESULT: PASSED`.
- **SC-005**: Each `.skilled/skills/local-*` symlink resolves into its own repository's `local-skills/` directory, and both links stay git-ignored in this checkout.
- **SC-006**: `git -C <repo> ls-files local-skills/<name>` lists `162` paths for `local-webflow` and `66` for `local-obsidian` after each target-repository commit, and each commit contains only its own target path.
- **SC-007**: `zsh -lic 'printenv SPECKIT_PRIVATE_SKILL_ROOTS'` prints both roots joined by `:`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 1 ignore rules | High - without them the two links would be tracked here | Do not start the restore until `git check-ignore -v .skilled/skills/local-webflow` names the `/.skilled/skills/local-*` rule |
| Dependency | Phase 3 symlink-aware scan | Medium - a symlinked skill is invisible to the advisor and the phase's routing proof fails | Phase 003 must land first; the recorded answer is symlink mode, so there is no real-folder fallback |
| Dependency | The two external repositories | High - no link target exists without them | T002a proves both `local-skills/` targets are free and each repository's `.skilled` is a symlink; T005 and T006 restore into them |
| Dependency | `SPECKIT_PRIVATE_SKILL_ROOTS` with both roots | High - the advisor skips a link whose realpath is outside the trusted roots | T006b sets both roots durably after an explicit operator yes; T095 exports them explicitly before the scan |
| Dependency | Commit `42b41dd286` in the local object database | High - nothing can be restored without it | Verify with `git cat-file -t 42b41dd286` before the first restore command |
| Risk | The restore is run in a worktree instead of the operator's main checkout | High - the ignored links never reach the checkout the operator's advisor scans, so the evidence is lost when the worktree is removed | Run every content step from `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`; only the documents work runs in `WORKTREE` |
| Risk | `cp` writes through a `references/workflow-*.md` symlink into the tracked hub file | High - a tracked file changes and the phase leaks | Remove each symlink with `rm` first, then copy; verify with `find -type l` returning zero and `git status --porcelain` staying empty |
| Risk | A rewrite points at the hub's `sk-code/shared/` with the wrong depth after the move | Medium - links break silently in a private folder nothing validates | Recompute every escaping link from the new location and prove it with the link audit before and after |
| Risk | A hand-written `graph-metadata.json` fails the advisor's parse (family allowlist, `skill_id` versus folder name, edge weight bands) | Medium - the skill is indexed by nothing and phase 5's routing probe fails | Follow the field table in `plan.md`, run the `node -e` field check and the dead-path check that resolves every `key_files`, `entities[].path` and `source_docs` path on disk. The generator cannot help, because it refuses a `local-*` root with exit 2 (decision-record.md Amendment 4) |
| Risk | `git add -f` or `git commit --no-verify` stages a private path | High - private content reaches the public repository | Run `git diff --cached --name-only` before the commit; the phase 1 guard blocks the ordinary path and phase 5 proves the fresh clone |
| Risk | A symlink points into a repository that later moves | Low - the skill disappears without a trace in the repo | Record both absolute targets in `implementation-summary.md`; recreate each link with T006a |
| Risk | A target repository commit stages an unrelated uncommitted file | High - unrelated work is published from that repository | T095a and T095b stage only `local-skills/<name>` by path and stop if anything else is staged |
| Risk | The Obsidian push publishes content | High - the public repository gains the skill content | The push runs only after an explicit operator yes at run time |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The link audit over both skills completes in under 10 seconds on the restored 226-file tree.
- **NFR-P02**: The advisor's disk scan indexes both skills in the same pass that already indexes the public skills; no extra scan pass and no second database.

### Security
- **NFR-S01**: No private file content or credential appears in any tracked file. The planning documents may name the two operator-recorded roots, the two repository names and counts, because the operator supplied them; the evidence text quotes paths and counts only.
- **NFR-S02**: The restore source is a public commit of this repository, so the restored content adds no new exposure beyond what history already holds.

### Reliability
- **NFR-R01**: The restore is idempotent: running the `git archive` pipeline twice produces the same bytes, because both sides are pinned to `42b41dd286`.
- **NFR-R02**: The phase leaves no partial state: either both skills exist and validate, or neither exists and the working tree is clean.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- Empty input: a skill restored with zero files is a failed restore; the file count must match the archived tree (`git archive ... | tar -t | wc -l`).
- Maximum length: a `graph-metadata.json` trigger list that grows past the scorer's useful size is trimmed by keeping the mode aliases first and the runtime keywords last.
- Invalid format: a `graph-metadata.json` that fails the advisor's parse aborts the whole scan, so it is validated on a throwaway database before the phase is called done.

### Error Scenarios
- External service failure: the advisor daemon is unavailable; the scan falls back to a direct build with `SYSTEM_SKILL_ADVISOR_DB_DIR` and, if that still refuses, the phase records the failure as an open blocker rather than claiming success.
- Network timeout: not applicable; every command in this phase is local.
- Concurrent access: a running advisor daemon may hold the live database; the throwaway database directory keeps this phase off it.

### State Transitions
- Partial completion: a restore that stops midway leaves an incomplete folder in one target repository; the rollback is `rm -rf` of that target path and `rm` of its link, and no tracked file in this repository is involved.
- Session expiry: ADR-001 and T002 record the two-repository symlink answer, so a resumed session reads it instead of re-asking.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | 226 restored files across two external target trees, two ignored links, one generated JSON per skill; no tracked code in this checkout |
| Risk | 18/25 | A wrong copy or a staged path leaks private content into the public repository |
| Research | 8/20 | Every anchor is already verified at `42b41dd286`; the operator's two-repository answer is recorded |
| Multi-Agent | 5/15 | One implementer runs 114 tasks in order; one read-only OpenCode subagent checks the result; no parallel workstreams |
| Coordination | 10/15 | Three phases must land first, one or two checkouts and two target repositories split the work, and three operator-yes gates protect the profile edit and the two pushes |
| **Total** | **55/100** | **Level 3** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Phase 004 starts before phase 003's compiler skip lands, and the compiler exports a private skill into the tracked `skill-graph.json` | H | M | T001 gates on the exact skip text at `origin/main` and in the working copy, and stops the run on any count other than `1` |
| R-002 | The restore runs in a worktree instead of the operator's main checkout, so the links never reach the advisor | H | M | Every content task names the operator's checkout, and T109 confirms the two ignored links there |
| R-003 | A `cp` writes through a `references/workflow-*.md` symlink into the tracked hub file | H | L | T007 to T012 run `rm` before writing from `git show`, and AC-004 fails if a link survives |
| R-004 | A rewritten link points at the hub tier with the wrong depth after the move | M | M | The audit's intermediate reading counts 16 and 2 broken links, and its final reading must match the baseline |
| R-005 | A hand-written `graph-metadata.json` fails the advisor's parse | M | L | T086 and T087 validate the shape with the `node -e` field check, resolve every `derived` path on disk and assert that the generator refuses the `local-*` root with exit 2 (decision-record.md Amendment 4) |
| R-006 | `git add -f` or `--no-verify` stages a private path | H | L | T106 checks the staged list for `local-` and T107 reads the commit's file list |
| R-007 | A target sits under a repository's `.skilled`, `.opencode` or `.claude` symlink and loops | H | L | T002a proves both targets are free and each repository's `.skilled` is a symlink before the restore |

## 11. USER STORIES

### US-001: Keep the Webflow and Obsidian evidence on my machine (Priority: P0)

**As the** operator who runs real Webflow and Obsidian tasks, **I want** both evidence trees restored
into their own repositories and linked here as gitignored skills with every link resolving, **so that**
the standards, patterns and procedures I already use stay available after the hub sheds them.

**Acceptance criteria:** AC-003, AC-004, AC-005, AC-006, AC-007 and AC-008.

---

### US-002: Reach both skills through my local advisor (Priority: P0)

**As the** operator, **I want** my local advisor to return `local-webflow` or `local-obsidian` on a
matching prompt, **so that** I do not have to remember where the trees live or invoke them by path.

**Acceptance criteria:** AC-011, AC-012 and AC-014.

---

### US-003: Keep every private byte out of the public repository (Priority: P1)

**As the** repository owner, **I want** both links ignored in this checkout and only this phase's documents
committed here, with each target repository carrying only its own skill commit, **so that** this public
repository never carries the private content and the public Obsidian repository publishes only what the
operator approved.

**Acceptance criteria:** AC-013, AC-016, AC-019, AC-020 and AC-021.

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See `decision-record.md`

---

## 12. OPEN QUESTIONS

- The operator's answer is recorded: symlink mode, two external repositories, one per skill. T002 reads
  it, T002a prechecks both targets, and only T005 and T006 restore; T003, T004 and T094 stay `[—]` as
  recorded alternatives. No folder-mode question remains.
- Should the private skills keep their `changelog/` and `benchmark/reports/` trees? They are restored
  as-is because the restore is a whole-tree archive, and the D6 boundary keeps their dated content
  unchanged.
- **Correction, parent spec.** `../spec.md`'s Files to Change row for phase 004 says each private skill
  carries "its own frontmatter, `graph-metadata.json` and `description.json`". That is wrong on the
  third item: the seven `description.json` files in the fleet belong to hubs and parents
  (`cli-classifier`, `cli-external-orchestration`, `mcp-tooling`, `sk-code`, `sk-design`, `sk-doc`,
  `system-deep-loop`), no leaf skill carries one, and no consumer reads a leaf one. This phase writes
  none. The parent is outside this phase's write scope, so the correction is recorded here and ADR-006
  carries the decision.
- **Correction, edit catalogue counts.** `plan.md` described `E-20` as two occurrences and `E-21` as two;
  the restored files carry three and four. It also listed `E-26` as one occurrence in four asset
  READMEs, while the same text also appears once in `assets/animation/snippets/README.md`, where the
  deeper link must not be touched. The counts in `plan.md` and `tasks.md` are now the measured ones.
- **Correction, `O-30` to `O-33`.** The earlier catalogue listed four separate prose edits. `O-30` sits
  inside the HOW IT WORKS block that `O-23` replaces, and `O-31` to `O-33` sit inside the related list
  that `O-24` replaces, so applying the outer block removes them. They are not separate tasks, and
  `tasks.md` records that in T080.
- **Correction, branch rule.** The earlier `tasks.md` named branches `deepseekpi` and `deepseekpihigh`.
  Neither checkout is on either branch: the operator's main checkout is on `main`, and the authoring
  checkout is on its checked-out branch, pushed with `git push origin HEAD:main`. The current rule is
  OpenCode-native: the runtime is OpenCode 2 with a DeepSeek orchestrator, and a review runs through the `subagent` tool with
  agent `review` (agent `deep-review` for a multi-dimension pass), read-only by instruction. No CLI
  dispatch kit, kit branch or executor name (`deepseekpi`, `deepseekpihigh`, `dispatch.sh`, `cli-devin`,
  `cli-pi`) is used anywhere; work is done by the orchestrator itself or the `code` / `markdown` subagents.
- **Correction, workflow-copy source.** The earlier Step 2 copied from the hub's working tree. Phase 2
  removes the surface folders but leaves `sk-code/shared/`, so the copy would usually work; `git show`
  from `42b41dd286` is used instead so the bytes are pinned and a changed working tree cannot affect
  them.
- **Open, for phase 5.** Whether the operator's drift scripts pass with both `local-*` roots present is
  not settled here; the research synthesis assigns that probe to phase 5.
<!-- /ANCHOR:questions -->

---
