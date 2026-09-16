---
title: "Decision Record: Phase 4: migration-design"
description: "Three proposed decisions for the .skilled move: what .opencode becomes, the cutover order with its point of no return, and which .opencode references survive the rewrite."
trigger_phrases:
  - "opencode compatibility link decision"
  - "skilled cutover order decision"
  - "opencode keep list"
  - "migration point of no return"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/004-migration-design"
    last_updated_at: "2026-09-16T22:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Proposed the layout, cutover order and keep-list decisions"
    next_safe_action: "Resolve ADR-001 from the phase 003 probe records"
    blockers:
      - "Phase 003 probe records for P1 to P3 do not exist yet"
    key_files:
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "041-004-decision-record"
      parent_session_id: null
    completion_pct: 30
    open_questions:
      - "Which layout do probes P1 to P3 select?"
    answered_questions: []
---
# Decision Record: Phase 4: migration-design

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: What `.opencode` becomes

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-09-16 |
| **Deciders** | Orchestrator on Opus, pending the phase 003 probe records and the GPT-5.6 review |

---

<!-- ANCHOR:adr-001-context -->
### Context

`.skilled/` takes the real files, and parent D5 requires `.opencode/` to stay resolvable for opencode, root discovery and consumers (`../goal.md:50`). Phase 001 found that `.opencode` is four things at once: the root-discovery sentinel, opencode's project namespace, a path hardcoded into launchers and gates, and a published contract that consumer projects link to by name (`001-deep-research/research/research.md:16`). The question is which shape keeps every one of those working while the files live somewhere else.

### Constraints

- opencode loads plugins by a flat glob over `.opencode/plugins/` (`.opencode/plugins/README.md:16`), loads every skill under `.opencode/skills/` (`.opencode/skills/cli-external-orchestration/cli-opencode/README.md:47`), and launches `code_mode` from `opencode.json:15`.
- Root discovery keys on `.opencode/skills/system-spec-kit/SKILL.md` and hoists above a literal `.opencode` segment (`.opencode/skills/system-spec-kit/shared/workspace/repo-root.mjs:27`, `:38-46`).
- Ten consumer links on this machine and seven global hooks name `.opencode` by absolute path (`find` census and `ls -l ~/.config/git/hooks`, both run 2026-09-16).
- Plugins import `@opencode-ai/plugin` (`.opencode/plugins/opencode-goal.js:16`, `.opencode/plugins/system-speckit-completion.js:28`), and CommonJS resolves its own location to the real path (`PUBLIC-RELEASE.md:32`), so where `node_modules` lives matters under any link.
- Whether opencode or Devin follows a link at the directory level is UNKNOWN until probes P1 to P3 report (`001-deep-research/research/research.md:69`).
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: a conditional layout. If P1 and P3 pass for a whole-directory link, `.opencode` becomes one tracked relative link to `.skilled` (L1). Otherwise, if P2 and P3 pass for per-entry links, `.opencode/` stays a real directory holding one relative link per moved entry (L2), with opencode's install files where the passing P2 variant put them. Otherwise the packet stops and escalates under parent D2.

**How it works**: The links are relative, `.opencode -> .skilled` or `.opencode/<entry> -> ../.skilled/<entry>`, so a checkout at any path resolves them. The placeholder's own name asks for the same thing (`.skilled/future-task-placeholder-move-opencode-contents-to-here-and-relative-symlink-back`). Runtime directories stop depending on the compatibility name in phase 008, when their links retarget to `.skilled/`, so what still reads `.opencode` afterwards is exactly ADR-003's keep-list.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **L1, one link (chosen when P1 and P3 pass)** | Every reader keeps working on the day of the move. One tree, so dependency resolution never splits. Walkers below `.opencode` never meet a link | opencode's install files live in `.skilled/`. Git filters naming `.opencode/` see nothing | 8/10 |
| **L2, one link per entry (chosen when only P2 and P3 pass)** | The same readers keep working, and opencode's install files can stay in `.opencode/` | A plugin reached through a linked entry may resolve imports from `.skilled/`. Walkers that start at `.opencode/` meet child links (`.opencode/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:104-111`) | 6/10 |
| L3, thin namespace of opencode-mandated entries | Smallest `.opencode/` | The global hooks dangle when the main checkout moves (`001-deep-research/research/research.md:59`), consumer paths into dropped entries break, and references must be rewritten before the rename | 4/10 |
| L4, removal | Nothing left to maintain | Violates parent D5: opencode, root discovery and ten consumer links stop resolving | 1/10 |

**Why this one**: L1 is the smallest shape that keeps every reader working without a precondition on the rewrite, and L2 is the fallback when a runtime refuses a linked top-level directory but follows linked entries. The probes decide between them, so neither is picked on preference.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The rename commit does not depend on 2,938 mechanical rewrites landing first (`002-per-runtime-reference-map/research/maps/reconciliation.json:22`)
- Consumer projects and the seven global hooks survive the move with no edit of their own

**What it costs**:
- Git records changes only under `.skilled/`, so every filter naming `.opencode/` must learn the second root first. Mitigation: steps 2 to 5 in `plan.md`
- Under L1, opencode's `package.json`, `bun.lock` and `node_modules` sit inside `.skilled/`. Mitigation: accepted, because the alternative splits dependency resolution between two directories

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A probe passes on the probed runtime version and a later upgrade stops following links | M | Step 23's live proof on the main checkout, repeated after a runtime upgrade |
| `hoistAboveOpencodeTree()` misses a `.skilled` real path and a writer nests state under the wrong root | H | Step 6 hoists above either segment |
| A tool walking the repository skips the `.opencode` link and misses content it used to see | M | The content is reachable under `.skilled/`, and walkers keyed on `.opencode/` are rewritten in step 17 |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Parent D5 requires `.opencode` to stay resolvable (`../goal.md:50`) |
| 2 | **Beyond Local Maxima?** | PASS | Four shapes scored against seven readers in `plan.md` layout options |
| 3 | **Sufficient?** | PASS | One link is the smallest shape that keeps every reader working |
| 4 | **Fits Goal?** | PASS | The rename can land alone, as the large-reorg runbook requires (`.opencode/skills/sk-git/references/large-reorg-playbook.md:82-85`) |
| 5 | **Open Horizons?** | PASS | An L2 layout can later shrink toward L3 without reopening this record |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Step 11 creates the link or links in the same commit as the rename, and no file content changes in that commit
- Step 6 teaches root discovery, the launcher and the installers both roots before step 11

**How to roll back**: Before step 24, run `git reset --hard <step-10 commit>` in the worktree, move step 9's ignored entries from `.skilled/` back into `.opencode/`, and confirm `test ! -e .skilled`. After step 24, push a revert of the move commit and treat it as the forward fix ADR-002 describes.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: The cutover order and its point of no return

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-09-16 |
| **Deciders** | Orchestrator on Opus, pending the phase 003 probe records and the GPT-5.6 review |

---

<!-- ANCHOR:adr-002-context -->
### Context

The inventory says what moves, not in which order. Four verified facts decide the order. The gates skip rather than fail when a script or a filter misses (`.opencode/scripts/git-hooks/pre-commit:180`, `001-deep-research/research/research.md:75-87`). The hook drivers that run on every commit are the main checkout's copies, because the seven global hooks are absolute links into it (`ls -l ~/.config/git/hooks`, `.opencode/scripts/install-git-hooks.sh:30-31`). `git mv` into the existing `.skilled/` nests (`001-deep-research/research/research.md:73`). And the main checkout holds 184 ignored entries under `.opencode/`, four of them SQLite databases, that no commit carries.

### Constraints

- Gates and CI learn the new root before anything moves
- Dual-root code lands before the move
- The `.skilled/` placeholder is handled before any `git mv`
- Renames land in commits separate from content edits (`large-reorg-playbook.md:82-85`)
- The seven global hooks are reinstalled when the main checkout's tree moves
- Generated files are regenerated by their owners, never text-edited
- Toolchain validation runs on the main checkout's toolchain (`large-reorg-playbook.md:129-141`)
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: the 25-step sequence in `plan.md`, in three bands. Backward-compatible changes publish first (steps 1 to 8: the autosync guard, hooks, the independent check, CI, dual-root code and ignore twins). Layout-changing commits stay held in the worktree (steps 9 to 17: placeholder, rename, links, regeneration and rewrite). The main checkout moves once, in phase 010 (steps 18 to 22), with the global hooks reinstalled directly after its fast-forward, and the push in step 24 is the point after which rollback becomes a forward fix.

**How it works**: Publishing the compatible bands early puts dual-root hook drivers into the main checkout, which is where every commit's hooks run from, so each gate that could catch a mistake in step 11 is already live when step 11 happens. Holding the layout bands keeps rollback local: until step 24 every step reverts in the worktree or in the main checkout from recorded SHAs, an archive and backups. After step 24, other clones, CI and consumer projects may already act on the moved tree, so a revert is a new forward change rather than a return to the earlier state.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Publish compatible bands, hold layout bands, move the main checkout once** | Gates run dual-root logic before any file moves. The machine-wide state changes once. Rollback stays local until step 24 | A held window in which the live branch can move, handled by the drift check in step 19 | 8/10 |
| Publish every phase as it validates | No held window and no drift | The main checkout and 28 other worktrees run on a half-moved tree for days, and the hook reinstall falls at step 11 instead of a planned cutover | 5/10 |
| Move the main checkout first, then fix references | An early real-world test | Every reader that the layout does not route around breaks until the rewrite lands | 3/10 |
| One commit for everything | One revert undoes it | Breaks the rename doctrine, and passes only because the gates skip | 2/10 |

**Why this one**: It is the only order in which every gate already runs dual-root logic at the moment a mistake could happen, and in which hooks, home configs and ignored databases change exactly once.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- A broken move trips a gate or the independent check instead of committing green
- Every step before step 24 has a local rollback that restores ignored state, hook links and home configs where it touched them

**What it costs**:
- Phases 005 and 006 change the hooks every linked worktree runs. Mitigation: both are backward compatible, and step 8 proves a commit at the pre-005 commit still passes the hooks
- Phases 007 to 009 wait unpublished. Mitigation: rebase in step 9 and a drift check in step 19

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Autosync publishes a held commit to the live branch (`.opencode/scripts/git-hooks/post-commit:26-32`) | H | Step 1 exports `SPECKIT_AUTOSYNC=0` and compares the remote tip after each commit |
| The installer skips the seven existing links in step 20 (`install-git-hooks.sh:58-67`, `:138-142`) | H | Step 6 teaches the ownership test both roots, and step 20 checks `readlink` on each link |
| Gate 0 counts renames in the push range as deletions (`.opencode/scripts/git-hooks/lib/mass-deletion-guard.sh:45-47`) | M | Probe P6 over the whole range, then at most one recorded bypass push |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Without a frozen order, the gates skip on the migration commit (`001-deep-research/research/research.md:18`) |
| 2 | **Beyond Local Maxima?** | PASS | Four orders scored above |
| 3 | **Sufficient?** | PASS | Each of the seven constraints maps to named steps in `plan.md` |
| 4 | **Fits Goal?** | PASS | The parent phase map already splits the work into these phases (`../spec.md:114-126`) |
| 5 | **Open Horizons?** | PASS | The dual-root code can be removed later, once every linked worktree has moved |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- Phases 005 to 011 take their steps verbatim from `plan.md`, each phase owning the steps its heading names
- Each executing phase records the SHAs, counts, archives and backups its later rollbacks read

**How to roll back**: For the design, revert this folder's document commit and set this record back to Proposed. For the cutover, run the failing step's rollback line in `plan.md`. Past step 24 there is no rollback, only a forward fix: push a revert range as new commits, then run steps 21 and 20 in reverse on every machine that pulled the moved tree.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Which `.opencode` references survive

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-09-16 |
| **Deciders** | Orchestrator on Opus, pending ADR-001's resolution and the GPT-5.6 review |

---

<!-- ANCHOR:adr-003-context -->
### Context

The parent's completion criteria require that `.opencode/` holds only what this phase chose to keep, and that no tracked non-frozen file names an `.opencode` path the design did not keep (`../goal.md:87`, `:90`). Phase 009's rescan cannot finish without a list that says which remaining references are intended.

### Constraints

- opencode's own configuration and documentation describe opencode's view, which stays `.opencode`
- Consumer checkouts carry `.opencode` and no `.skilled`, so discovery must still accept the old sentinel
- 28 other linked worktrees check out real `.opencode/` directories until they rebase, and they all run the same global hooks
- 968 map C rows record runs at the old path and are frozen by parent D4 (`002-per-runtime-reference-map/research/maps/reconciliation.json:25`, `../goal.md:49`)
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: keep `.opencode` only where the reader is opencode itself, root discovery, the consumer contract, the spec compatibility link, a dual-root alternate or a frozen record, and rewrite every other reference to `.skilled`.

**How it works**: The keep-list below is the exclusion set for step 17's rescan. T009 completes it for the resolved layout, adding a file:line for each entry that the layout introduces.

| ID | Kept reference | Where | Why |
|----|----------------|-------|-----|
| K1 | The launcher path `.opencode/bin/mcp-code-mode-launcher.cjs` | `opencode.json:15` | opencode's configuration names its own namespace, and consumer projects keep their own `opencode.json` (`PUBLIC-RELEASE.md:26`), which this repository cannot edit |
| K2 | The `.opencode/skills/system-spec-kit/SKILL.md` sentinel, as a second sentinel beside the `.skilled` one | `repo-root.mjs:27` | Consumer checkouts have `.opencode` and no `.skilled` |
| K3 | The literal `.opencode` segment in the fallback hoist, beside `.skilled` | `repo-root.mjs:38-46` | A nested `.opencode/` planted under a wrong root must still be caught (`repo-root.mjs:4-7`) |
| K4 | The consumer link `.opencode -> Public/.opencode` | `PUBLIC-RELEASE.md:22` | Parent D5 |
| K5 | `.opencode/specs -> ../specs` and the guard that defines it | `.opencode/bin/check-no-spec-imports.cjs:26-32`, `.opencode/skills/system-spec-kit/runtime/cli/core/spec-root-migration.ts:356-357` | The existing spec compatibility contract |
| K6 | Documentation of where opencode looks | `.opencode/plugins/README.md:16`, `cli-opencode/README.md:47`, `cli-opencode/SKILL.md:214` | It describes opencode's view, which stays `.opencode` |
| K7 | The `.opencode` alternates inside dual-root filters, installers, ignore twins and workflow path filters | Steps 2, 4, 6 and 7 in `plan.md` | Linked worktrees on older branches still carry a real `.opencode/` |
| K8 | The negation of the global `/.opencode/` ignore | `.gitignore:7-10`, `~/.gitignore_global:16` | Harmless under both layouts, and removing it is a separate cleanup |
| K9 | The 968 frozen rows | `reconciliation.json:25` | Records of runs at the old path (parent D4) |
| K10 | Under L2 with P2a only: `.opencode/package.json`, `.opencode/bun.lock` and `.opencode/node_modules` | `.opencode/package.json:3-5`, `.opencode/bun.lock:1-12` | opencode's plugin dependency is declared there |
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Keep-list of named readers** | A finite rescan target that preserves every reader D5 protects | Dual-root alternates linger until a later cleanup | 8/10 |
| Rewrite every reference | No `.opencode` string left outside frozen records | Breaks opencode's configuration, the consumer contract and worktrees on older branches | 3/10 |
| Rewrite nothing and rely on the link | No rewrite risk | Fails the parent criterion at `../goal.md:90`, and every runtime keeps depending on the compatibility name | 2/10 |

**Why this one**: It is the smallest set that keeps every protected reader working while letting the rescan prove everything else points at `.skilled`.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- Phase 009's rescan has a definition of done: every remaining `.opencode` reference is on this list, frozen or a defect
- The goal criterion at `../goal.md:90` becomes checkable with one command

**What it costs**:
- The dual-root alternates (K7) stay in the hooks, CI and installers. Mitigation: a later cleanup removes them once `git worktree list` shows no worktree on a pre-move commit

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A reference is kept that no protected reader needs, and the rewrite silently skips it | M | The GPT-5.6 review checks each row against its Why column |
| A new `.opencode` reference lands on the live branch during the held window | M | Step 19's drift check and a second rescan before step 24 |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The parent criterion at `../goal.md:90` needs a definition of "kept" |
| 2 | **Beyond Local Maxima?** | PASS | Three policies scored above |
| 3 | **Sufficient?** | PASS | Every row names its reader and its evidence |
| 4 | **Fits Goal?** | PASS | Step 17's check uses this list as its exclusion set |
| 5 | **Open Horizons?** | PASS | K7 and K8 carry their own removal condition |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- Step 17's rescan excludes K1 to K10 and flags any other `.opencode` reference as a defect
- Step 21's per-file counts come from this list: every home config keeps zero references unless a row here names it

**How to roll back**: Remove or add a row by amendment before phase 009 starts, then re-run the rescan. After phase 009, a removed row turns its references into defects that phase 009 rewrites in a new commit.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---
