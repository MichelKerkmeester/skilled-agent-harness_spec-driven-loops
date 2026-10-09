---
title: "Feature Specification: Phase 3: update"
description: "`/doctor:update` rebuilds the spec-kit runtime databases in dependency order."
trigger_phrases:
  - "doctor update audit"
  - "/doctor:update relevance"
  - "doctor-update.yaml"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 3: update

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-02 |
| **Branch** | `worktrees/079-doctor-command-audit` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 14 |
| **Predecessor** | 002-mcp-debug-code-mode |
| **Successor** | 004-deep-loop |
| **Handoff Criteria** | `acceptance-criteria.md` shows every row Met, Waived or Superseded and `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the doctor command audit. It covers `/doctor:update` alone.

**Scope Boundary**: `/doctor:update` and what it became. The audit found a database rebuild that could never host a release apply, so the phase split it: the rebuild moved to `/doctor:rebuild` (`doctor-rebuild.yaml`), and `/doctor:update` became the release-aware updater over `release-update.cjs` with three workflows, `doctor-update-check.yaml` (read-only), `doctor-update-align.yaml` (add-only) and `doctor-update-apply.yaml` (mutates). The original single `doctor-update.yaml` no longer exists.

**Dependencies**:
- A provisioned worktree, so the scripts the doctor calls can run.
- The route manifest `.skilled/commands/doctor/_routes.yaml` and its validator.

**Deliverables**:
- An inventory of everything the route and `doctor-update.yaml` name, checked against this checkout.
- One read-only or dry-run run of `/doctor:update`, with its output kept.
- One verdict, keep, fix or retire, with its evidence.
- The verdict applied to the workflow, the route and the router text.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`/doctor:update` was a database rebuild. Its workflow, `.skilled/commands/doctor/assets/doctor-update.yaml`, rebuilt the spec-kit runtime databases in dependency order, and its mutation boundary forbids skill writes, so it could not host a release apply. Audited against this checkout, it also named scripts, files, flags and databases written for an earlier state of the system: the graph-metadata step omitted its required scope, the migration signals and the checkpoint still pointed at the retired `mcp-server/database`, and its advisor and deep-loop calls named operations that no longer exist. The evidence supports one verdict, fix, and the fix is a redesign: the release updater and the database rebuild have different mutation boundaries and different rollback disciplines, so one command cannot carry both.

### Purpose
Split the target. Today's database rebuild moves unchanged in behaviour to `/doctor:rebuild`, with the held rebuild fixes applied, and `/doctor:update` becomes the release-aware updater: it detects the release this checkout is on, finds the latest upstream release, updates the units the operator never customized, and proposes evidence-backed alignment, with a per-file decision, for the ones they did. The rebuild stays the reindex step of a release apply.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The audit evidence behind the verdict: `scratch/reality-check.md`, its read-only probe log `scratch/doctor-run.log`, and the original verdict in `scratch/proposal.md`.
- The research and design that fix the redesign: `research/research.md` and the settled choices in `scratch/design.md`.
- The split: today's database rebuild moves to `/doctor:rebuild` (router, workflow YAML, presentation and `.doctor-rebuild.*` state files renamed; held rebuild fixes applied), and every live reference, playbook scenario, catalog row, contract entry, symlink and prompt mirror is swept.
- The release-aware `/doctor:update`: a thin router, `doctor-update-check.yaml` (read-only), `doctor-update-align.yaml` (add-only, run directory only), `doctor-update-apply.yaml` (mutating) and the shared `doctor-update-presentation.txt`, over the `release-update.cjs` engine and its test suite.
- Registration: standalone `_routes.yaml` entries for both commands, with an actions map for `/doctor:update` (check read-only, align add-only, apply mutates).

### Out of Scope
- Other doctor targets, which have their own phases.
- Changes to the subsystem the doctor inspects; defects there become findings, not fixes.
- Any automatic write of merged text for a customized file: merged text is written only after an explicit per-file `merge` or `use-proposal` decision.
- Publishing the three local commits; none are pushed by this phase.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/doctor/update.md` → `rebuild.md` | Moved | The database rebuild router under its new name, with the held rebuild fixes applied |
| `.skilled/commands/doctor/assets/doctor-update.yaml` → `doctor-rebuild.yaml` | Moved | The rebuild workflow; state files renamed `.doctor-update.*` → `.doctor-rebuild.*` |
| `.skilled/commands/doctor/assets/doctor-update-presentation.txt` → `doctor-rebuild-presentation.txt` | Moved | The rebuild presentation text |
| `.skilled/commands/doctor/update.md` | Rewritten | Thin router for the release updater's check, align and apply actions |
| `.skilled/commands/doctor/assets/doctor-update-check.yaml` | Created | Read-only check workflow (bare `/doctor:update`) |
| `.skilled/commands/doctor/assets/doctor-update-align.yaml` | Created | Add-only alignment workflow; writes the run directory only |
| `.skilled/commands/doctor/assets/doctor-update-apply.yaml` | Created | Mutating apply workflow: dry-run plan, one startup approval, post-apply battery, engine rollback, `/doctor:rebuild` prompt |
| `.skilled/commands/doctor/assets/doctor-update-presentation.txt` | Created | Presentation for the three update actions |
| `.skilled/commands/doctor/scripts/release-update.cjs` | Created | The engine: `check`, `align`, `decide`, `apply`, `rollback` |
| `.skilled/commands/doctor/scripts/tests/release-update.test.cjs` | Created | Engine tests, 16 cases |
| `.skilled/commands/doctor/_routes.yaml` | Modified | Standalone entries for `/doctor:update` (with its actions map) and `/doctor:rebuild` |
| `.gitignore` | Modified | `.skilled/release/runs/` is ignored; `base.json` and `divergence.json` stay git-tracked |
| `.skilled/commands/README.txt`, `README.md`, feature catalog, playbook | Modified | Catalog rows, command counts and the six renamed rebuild scenarios |
| `.skilled/skills/sk-doc/sk-create-command/assets/command-contract.json` | Modified | Doctor family selector, aliases and operation text |
| Runtime mirrors (`.claude/`, `.cursor/`) and the codex, pi and hermes prompt trees | Modified | Regenerated by their sync scripts |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `scratch/reality-check.md` lists every path, script, command, flag and environment variable that the `/doctor:update` route and `doctor-update.yaml` name, each marked present, moved or missing with the command that showed it. |
| REQ-002 | `/doctor:update` runs once on this checkout in its read-only or dry-run form, or against a disposable copy of any database it would change, and its output is saved to `scratch/doctor-run.log`. |
| REQ-003 | `implementation-summary.md` records one verdict, keep, fix or retire, with the evidence behind it. |
| REQ-005 | The release-update engine (`.skilled/commands/doctor/scripts/release-update.cjs`) implements `check`, `align`, `decide`, `apply` and `rollback`, refuses to overwrite a locally changed file without a recorded per-file decision, and passes its test suite. |
| REQ-006 | The split is registered: the database rebuild keeps its behaviour as `/doctor:rebuild`, `/doctor:update` becomes the release-aware updater, both routers exist, and a bare `/doctor:update` routes to the read-only `doctor-update-check.yaml`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | After the verdict is applied, `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0. |
| REQ-007 | The catalog mirror check reports `STATUS=OK`, the runtime mirrors and the three prompt trees are in sync, and both router documents validate with 0 issues. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: An operator who runs `/doctor:update` sees results that match this checkout.
- **SC-002**: `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A run changes runtime state | High | Run only the read-only or dry-run form, or point it at a disposable copy |
| Risk | A retired target is still named in docs | Med | Search the repository for the target name before closing |
| Dependency | Scripts the doctor calls | The run cannot complete | Record the missing script as a finding; it is part of the verdict |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The command finishes its checks without a network call it did not already make.

### Security
- **NFR-S01**: No secret value is printed to the run log or the report.

### Reliability
- **NFR-R01**: A missing script or database is reported by name, never as a pass.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A runtime database that a fresh worktree has not built yet: reported as not built, not as missing code.

### Error Scenarios
- A script the workflow calls has moved: recorded in `scratch/reality-check.md` with its new path.

### State Transitions
- The phase stops part way: `scratch/reality-check.md` and the run log let the next session resume.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | One command, its workflow and route |
| Risk | 10/25 | A doctor run can touch runtime state |
| Research | 8/20 | Every named path is checked |
| **Total** | **26/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None yet. Findings from the inventory go to `implementation-summary.md`.
- Deep-research topic: redesign /doctor:update into a release-aware updater for this framework. it must smartly detect which release tag the operator's checkout is on (tags, changelog versions, skill version frontmatter), find the latest upstream release, and compute what changed between the operator's current state and that release. for skills the operator has not customized, it updates them to the release. for skills the operator has customized or overridden locally (for example sk-git or sk-code), it must not overwrite: it proposes fixes that align them with the latest release while keeping the repo's own override specifics. detection of customization and the alignment proposals must be smart (three-way merge against the release base, provenance markers, hashes, git history), and where manual, guided and evidence-backed. decide whether this is one command or several (for example check, apply, align), what happens to today's database-rebuild behaviour of /doctor:update, and specify each resulting command's workflow yaml to the sk-create-command contract (thin router, -presentation.txt, workflow yaml with approval gates, rollback, dry-run). ground every claim in this repository: .skilled/commands/doctor/, .skilled/changelog/, skill changelogs and versions, sk-git, sk-doc/sk-create-command, the install and sync scripts.

Research context: deep-research is active for this topic; `research/research.md` remains canonical.

<!-- BEGIN GENERATED: deep-research/spec-findings -->
<!-- checksum: sha256:91a28530ea73805a8e0419c82db66b936d3ee0508ad5ecbad5b31181de1bf133 -->
Deep-research findings (abridged; `research/research.md` is canonical):

- Split the command. Keep today's database rebuild unchanged under its own name (proposed `/doctor:rebuild`), because `doctor-update.yaml` forbids skill-content writes and rolls back through VACUUM snapshots.
- Repurpose `/doctor:update` as the release family: `check` (read-only), `align` (writes proposals and a decision file only) and `apply` (the only skill-body writer, consuming accepted decisions, rolled back through git, then invoking the rebuild as its final reindex phase).
- Release identity comes from annotated tags and GitHub releases, compared numerically by segment. Changelog entries can precede their tag, and docs are never the oracle. An unreachable upstream reports UNKNOWN, never up to date.
- Update units are 14 hubs and 45 direct child skills. A locally changed file is never overwritten; it becomes an evidence-backed proposal, following the whole-file carry and fingerprint-guard policy of `compiled-route-sync.cjs`.
- Open: the full customization signal set (Q2), the divergence ledger location, and the registration shape and trigger-phrase split for the new family.
<!-- END GENERATED: deep-research/spec-findings -->
<!-- /ANCHOR:questions -->

---


