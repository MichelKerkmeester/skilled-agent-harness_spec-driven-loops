---
title: "Feature Specification: Phase 4: private-local-skills"
description: "The Webflow and Obsidian surfaces leave the shipped sk-code hub, but the operator still needs their evidence. This phase restores both trees from history into two gitignored local-* skills that only the operator's advisor routes, with no tracked file and no staged path."
trigger_phrases:
  - "private local skills"
  - "phase 4 private local skills"
  - "local-webflow local-obsidian"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 4: private-local-skills

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-10-23 |
| **Branch** | `deepseekpi` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 5 |
| **Predecessor** | 003-advisor-vocabulary-cleanup |
| **Successor** | 005-leak-and-routing-verification |
| **Handoff Criteria** | Both `local-*` skills exist at their decided path, every relative link resolves, each carries one skill-root `graph-metadata.json`, `git status --porcelain .skilled` is empty, `git diff --cached --name-only` is empty, and `validate.sh --strict` on this child prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the Move the Webflow and Obsidian surfaces out of the shipped sk-code hub into gitignored local-* private skills that only the operator's local advisor routes specification.

**Scope Boundary**: In scope are the two gitignored skill trees at `.skilled/skills/local-webflow/` and `.skilled/skills/local-obsidian/`, plus this child's own documents. No tracked file outside this child changes. The hub tree, the advisor runtime, the commit guard, the trigger index and the Hermes mirror belong to phases 1, 2, 3 and 5.

**Checkout**: Two checkouts, split by what each one holds. The operator's main checkout, `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`, owns the two `local-*` trees and every command that reads them: both trees are gitignored, and ignored files never travel between checkouts, so a tree restored inside a worktree stays in that worktree, invisible to the operator's checkout and to the advisor that serves it. The authoring worktree owns every packet-document edit, including `implementation-summary.md`, because this child's documents exist only there; the evidence is transcribed from readings taken in the operator's checkout, and the phase's single commit and push go through the worktree. No packet document is copied between the two checkouts, and no copy bridge exists or is needed.

**Dependencies**:
- `001-ignore-and-commit-guard` must have landed: `/.skilled/skills/local-*` and `/.hermes/skills/local-*` in the root `.gitignore`, and the pre-commit guard that refuses a staged `local-*` path. Without the ignore rules this phase would write tracked files.
- `003-advisor-vocabulary-cleanup` must have landed: the advisor disk scan and the freshness scan accept a top-level `local-*` entry that is a symlink resolving to a directory. A real folder works without it; the symlink mode does not.
- Commit `42b41dd286` must be present in the local object database; it is the restore source and the base commit for every removed file.

**Deliverables**:
- `.skilled/skills/local-webflow/` and `.skilled/skills/local-obsidian/`, restored from `42b41dd286`, either as real folders or as symlinks to a private repository the operator owns.
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
Restore both surfaces from git history into two gitignored `local-*` skills that stand alone, so the operator keeps the evidence and the local advisor routes it, while no tracked file, no committed trigger index and no Hermes mirror ever names them again.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Restoring both surface trees from commit `42b41dd286` into `.skilled/skills/local-webflow/` and `.skilled/skills/local-obsidian/` inside the operator's main checkout, in one of the two supported folder modes.
- Replacing the three `references/workflow-{implement,debug,verify}.md` symlinks in each skill with real file copies, and fixing the guardrail link inside those copies.
- Rewriting every relative link in both skills that the move would break, so each one resolves to the target it resolved to at `42b41dd286`.
- Rewriting every absolute `.skilled/skills/sk-code/sk-code-{webflow,obsidian}` path inside both skills to the new location, excluding `changelog/` and `benchmark/reports/`.
- Turning each tree into a standalone skill: frontmatter identity, no hub-bundling or advisor-invisible prose, one skill-root `graph-metadata.json`.
- Recording the evidence locally: ignored, unstaged, and summarised in `implementation-summary.md` without private content.

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
| `.skilled/skills/local-webflow/**` | Create (ignored) | Webflow evidence restored from `42b41dd286`, then made standalone |
| `.skilled/skills/local-obsidian/**` | Create (ignored) | Obsidian evidence restored from `42b41dd286`, then made standalone |
| `.skilled/skills/local-webflow/graph-metadata.json` | Create (ignored) | Skill-root routing identity for the local advisor |
| `.skilled/skills/local-obsidian/graph-metadata.json` | Create (ignored) | Skill-root routing identity for the local advisor |
| `implementation-summary.md` | Modify | The phase's local-only evidence trail |
| `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md` | Modify | This plan and its gates |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Both trees exist at `.skilled/skills/local-webflow/` and `.skilled/skills/local-obsidian/` in the operator's main checkout, restored from `42b41dd286` by `git archive` piped through `tar --strip-components=4`, in exactly one mode: a real folder, or a symlink to a private repository that holds the restored tree. The mode is the operator's decision and is recorded in `implementation-summary.md`. |
| REQ-002 | In each skill, `references/workflow-implement.md`, `references/workflow-debug.md` and `references/workflow-verify.md` are real files with the content of `.skilled/skills/sk-code/shared/references/workflow-*.md` at `42b41dd286`, and the `workflow-guardrails.md` link inside each copy resolves to `.skilled/skills/sk-code/sk-code-skilled/references/shared/workflow-guardrails.md`. |
| REQ-003 | Every relative link in both skills resolves to the same target it resolved to at `42b41dd286`. No link that resolved before the move may fail after it, and a link that was already broken stays untouched. |
| REQ-004 | No file under either skill names `.skilled/skills/sk-code/sk-code-webflow` or `.skilled/skills/sk-code/sk-code-obsidian`, except files under `changelog/` and `benchmark/reports/`. |
| REQ-005 | Each skill is standalone: `SKILL.md` frontmatter `name` equals the folder name (`local-webflow`, `local-obsidian`), carries no `metadata.family` and no `packetKind`, and neither `SKILL.md` nor `README.md` claims that a parent hub detects, bundles or projects the skill, or that the skill is advisor-invisible. |
| REQ-006 | Each skill carries exactly one `graph-metadata.json`, at the skill root, with `skill_id` equal to the folder name, a `family` from the advisor's allowlist, non-empty `derived.trigger_phrases`, `key_topics`, `key_files`, `entities` and `source_docs`, and a `derived.causal_summary`. No nested `graph-metadata.json` or `description.json` exists below either skill root. |
| REQ-007 | Nothing in either skill is tracked or staged: `git status --porcelain .skilled` prints nothing, `git diff --cached --name-only` prints nothing, `git status --porcelain --ignored .skilled/skills/local-webflow .skilled/skills/local-obsidian` reports both paths with the `!!` prefix and nothing else, and `git check-ignore -v` names the phase 1 ignore rule for each path. The two private paths are named explicitly, because a provisioned checkout already carries other ignored state under `.skilled/` and this requirement is about these two paths only. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-008 | `implementation-summary.md` records the folder-mode decision, the restore command, the link audit before and after, the ignore evidence and the advisor-scan result, quoting no private file content beyond paths and counts. |
| REQ-009 | No file inside either skill carries a spec path, a packet number or a phase number in a code comment; the only permitted occurrence is prose inside a document that already carried it at `42b41dd286`. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `git status --porcelain .skilled` is empty and `git status --porcelain --ignored .skilled/skills/local-webflow .skilled/skills/local-obsidian` reports exactly two `!!` entries, one per `local-*` path, while `find .skilled/skills/local-webflow/ -type f | wc -l` prints `161` and `find .skilled/skills/local-obsidian/ -type f | wc -l` prints `65`, the archived counts.
- **SC-002**: The link audit on both skills reports exactly one broken link, the pre-existing `-> target` placeholder in `references/javascript/quality-standards/shared-listener-and-weakmap.md`, which was broken at `42b41dd286` too.
- **SC-003**: A throwaway advisor database built with `SYSTEM_SKILL_ADVISOR_DB_DIR` contains a `skill_nodes` row for `local-webflow` and one for `local-obsidian`.
- **SC-004**: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/013-private-surface-skills/004-private-local-skills --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 1 ignore rules | High - without them the restore writes 226 tracked files into the repository | Do not start the restore until `git check-ignore -v .skilled/skills/local-webflow` names the `/.skilled/skills/local-*` rule |
| Dependency | Phase 3 symlink-aware scan | Medium - a symlinked skill is invisible to the advisor and the phase's routing proof fails | Use the real-folder mode when phase 3 is not yet landed; the decision is the first task |
| Dependency | Commit `42b41dd286` in the local object database | High - nothing can be restored without it | Verify with `git cat-file -t 42b41dd286` before the first restore command |
| Risk | The restore is run in a worktree instead of the operator's main checkout | High - the ignored trees never reach the checkout the operator's advisor scans, so the evidence is lost when the worktree is removed | Run every step from `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`; only the docs commit uses a worktree |
| Risk | `cp` writes through a `references/workflow-*.md` symlink into the tracked hub file | High - a tracked file changes and the phase leaks | Remove each symlink with `rm` first, then copy; verify with `find -type l` returning zero and `git status --porcelain` staying empty |
| Risk | A rewrite points at the hub's `sk-code/shared/` with the wrong depth after the move | Medium - links break silently in a private folder nothing validates | Recompute every escaping link from the new location and prove it with the link audit before and after |
| Risk | A hand-written `graph-metadata.json` fails the advisor's parse (family allowlist, `skill_id` versus folder name, edge weight bands) | Medium - the skill is indexed by nothing and phase 5's routing probe fails | Follow the field table in `plan.md`; run the generator with `--write` and then a second run without it, which must report `unchanged`, because a bare dry run only reports `would-change` and repairs nothing |
| Risk | `git add -f` or `git commit --no-verify` stages a private path | High - private content reaches the public repository | Run `git diff --cached --name-only` before the commit; the phase 1 guard blocks the ordinary path and phase 5 proves the fresh clone |
| Risk | A symlinked skill is restored as a link into a private repository that later moves | Low - the skill disappears without a trace in the repo | Record the absolute private path in `implementation-summary.md` |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The link audit over both skills completes in under 10 seconds on the restored 226-file tree.
- **NFR-P02**: The advisor's disk scan indexes both skills in the same pass that already indexes the public skills; no extra scan pass and no second database.

### Security
- **NFR-S01**: No private path, private repository URL or private file content appears in any tracked file; the evidence text names paths and counts only.
- **NFR-S02**: The restore source is a public commit of this repository, so the restored content adds no new exposure beyond what history already holds.

### Reliability
- **NFR-R01**: The restore is idempotent: running the `git archive` pipeline twice produces the same bytes, because both sides are pinned to `42b41dd286`.
- **NFR-R02**: The phase leaves no partial state: either both skills exist and validate, or neither exists and the working tree is clean.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: a skill restored with zero files is a failed restore; the file count must match the archived tree (`git archive ... | tar -t | wc -l`).
- Maximum length: a `graph-metadata.json` trigger list that grows past the scorer's useful size is trimmed by keeping the mode aliases first and the runtime keywords last.
- Invalid format: a `graph-metadata.json` that fails the advisor's parse aborts the whole scan, so it is validated on a throwaway database before the phase is called done.

### Error Scenarios
- External service failure: the advisor daemon is unavailable; the scan falls back to a direct build with `SYSTEM_SKILL_ADVISOR_DB_DIR` and, if that still refuses, the phase records the failure as an open blocker rather than claiming success.
- Network timeout: not applicable; every command in this phase is local.
- Concurrent access: a running advisor daemon may hold the live database; the throwaway database directory keeps this phase off it.

### State Transitions
- Partial completion: a restore that stops midway leaves an ignored, incomplete folder; the rollback is `rm -rf` of both paths, and no tracked file is involved.
- Session expiry: the folder-mode decision is recorded in `implementation-summary.md` on the first task, so a resumed session reads the decision instead of re-asking.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | 226 restored files, two ignored trees, one generated JSON per skill; no tracked code |
| Risk | 18/25 | A wrong copy or a staged path leaks private content into the public repository |
| Research | 8/20 | Every anchor is already verified at `42b41dd286`; the open variable is the operator's folder mode |
| **Total** | **40/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Which folder mode does the operator choose: a real folder, or a symlink to a private repository? The phase does not block on the answer; the first task records it and both command paths are written out in `plan.md`.
- Should the private skills keep their `changelog/` and `benchmark/reports/` trees? They are restored as-is because the restore is a whole-tree archive, and the D6 boundary keeps their dated content unchanged.
<!-- /ANCHOR:questions -->

---
