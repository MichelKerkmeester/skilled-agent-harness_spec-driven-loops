---
title: "Implementation Plan: Phase 2: release-update-customization-signals"
description: "Add a generated-file class and regenerate-after-apply handling to the release engine, record the base at install, evaluate provenance_fingerprint as a pre-filter, settle the prerelease policy, and allow update-only applies without an alignment run."
trigger_phrases:
  - "implementation plan"
  - "release engine changes"
  - "generated class"
  - "base recording"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 2: release-update-customization-signals

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | CommonJS Node, git plumbing through `child_process.execFileSync('git', ...)` |
| **Framework** | None — one engine script with five subcommands |
| **Storage** | `.skilled/release/base.json` and `divergence.json` (git-tracked), run directories gitignored |
| **Testing** | `node --test` over disposable repositories built per case |

### Overview
Extend the engine's per-file classification with a generated-file class that is excluded from customization and regenerated after apply, add a base-recording action that writes `base.json` from a named release, evaluate the `provenance_fingerprint` pre-filter with its now-known hash input, add a prerelease opt-in, and let `apply` run without an alignment run when no decision is needed. Every change lands with a disposable-repository test.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The current `check --json` output is captured as the baseline
- [ ] The generator scripts that write each generated artifact are inventoried
- [ ] `provenance.ts`'s hash input is read and quoted in the evaluation

### Definition of Done
- [ ] All acceptance criteria met with the named command output
- [ ] The engine suite reports zero failures with the new cases
- [ ] The measurement is recorded in `scratch/` with its method
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Three-way classification over git blobs, with a mutation gate per subcommand: `check` reads, `align` writes run state, `apply` writes the tree under a lock and a rollback record.

### Key Components
- **`release-update.cjs`**: the engine; unit discovery, base resolution, file classes, decisions, apply and rollback.
- **Generator scripts**: `generate-leaf-manifest.cjs`, `regenerate-skill-derived.cjs`, `compiled-route-sync.cjs`, `sync-runtime-mirrors.cjs` and the advisor runtime's derived sync — each owns a generated artifact.
- **`provenance.ts`**: the advisor's provenance fingerprint writer; the pre-filter's evidence source.
- **Update workflow assets**: `doctor-update-check.yaml`, `doctor-update-apply.yaml` and `update.md` carry the operator-facing policy.

### Data Flow
Release tags → base resolution (`recorded` → `ancestry` → `inferred` → `none`) → per-file class (base/local/release blobs) → unit status → align plan and decisions → apply writes → base and divergence updates → post-apply regeneration of generated files.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `release-update.cjs` file-class logic | Classes every differing file as `take-release`, `local-only` or `conflict` | Update: add a generated class excluded from customization | `rg -n "local-only\|take-release\|conflict" .skilled/commands/doctor/scripts/release-update.cjs` |
| `baseForUnit` (`:595-630`) | Resolves `recorded`/`ancestry`/`inferred`/`none` | Update: add the recording action that populates `recorded` | `rg -n "source: 'recorded'" .skilled/commands/doctor/scripts/release-update.cjs` |
| `stableReleaseTag` + `remoteTags` (`:20,144,285-296`) | Exclude prereleases structurally | Update: keep default, add the opt-in path | `rg -n "prerelease" .skilled/commands/doctor/scripts/release-update.cjs` |
| `resolveApplyRun` (`:1394`) | Refuses apply without a run | Update: allow no-run apply for update/new units | `rg -n "resolveApplyRun" .skilled/commands/doctor/scripts/release-update.cjs` |
| `.skilled/skills/system-skill-advisor/runtime/lib/derived/provenance.ts:95-116` | Writes the fingerprint from normalized buckets plus sorted dependencies | Unchanged; quoted as the pre-filter's hash input | `rg -n "computeProvenanceFingerprint" .skilled/skills/system-skill-advisor/runtime` |
| Generator scripts (leaf manifest, skill derived, route sync, runtime mirrors) | Write generated artifacts | Unchanged; their output paths seed the classifier inventory | `rg -n "writeFileSync\|publishJson" .skilled/skills/sk-doc/sk-create-skill/scripts/*.cjs` |
| `doctor-update-check.yaml`, `doctor-update-apply.yaml`, `update.md` | Document current policy | Update: first-run base recording and the settled rules | `rg -n "base\.json\|prerelease\|align" .skilled/commands/doctor/update.md` |
| `release-update.test.cjs` | 16 cases over disposable repositories | Update: one case per new behavior | `node --test .skilled/commands/doctor/scripts/tests/release-update.test.cjs` |

Required inventories:
- Same-class producers: `rg -n "writeFileSync|publishJson|write\(" .skilled/skills/sk-doc/sk-create-skill/scripts/ .skilled/skills/system-skill-advisor/runtime/lib/derived/`.
- Consumers of changed symbols: `rg -n "classCounts|unit.status|local-only|customized" .skilled/commands/doctor/ --glob '!**/tests/**'`.
- Matrix axes: generated/authored × base recorded/inferred/none × release changed/unchanged × decisions present/absent.
- Algorithm invariant: an authored edit is never regenerated; a generated file is never reported as a customization; apply without a run writes only units whose local blobs still equal their base blobs.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Classifier, base recording, prerelease resolution, no-run apply | `node --test` over disposable repositories |
| Integration | `check` on a copied tree; `apply --dry-run` without a run | The engine's own fixture helpers |
| Manual | Read-only `check --json` on this checkout for the measurement | The engine CLI |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Generator scripts | Internal | Green | The classifier inventory cannot be sourced |
| Disposable test harness | Internal | Green | Engine changes cannot be proven |
| Update workflow assets | Internal | Green | Policy text cannot be published |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the engine suite fails, or a new refusal path blocks a legitimate apply.
- **Procedure**: revert the engine and workflow changes, rerun the suite, and restore `base.json` and `divergence.json` from the previous commit if the recording action wrote them.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (baseline + writer walk) ──► Core (engine changes) ──► Verify (suite + measurement)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 2 hours |
| Core Implementation | High | 8-12 hours |
| Verification | Med | 2-3 hours |
| **Total** | | **12-17 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Baseline `check --json` output captured
- [ ] The current `base.json` and `divergence.json` contents are recorded
- [ ] The engine suite passes before the first change

### Rollback Procedure
1. Revert the engine and workflow files
2. Restore `base.json` and `divergence.json` from the previous commit
3. Rerun the engine suite
4. Report the failing case with its output

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Not applicable — run directories are disposable and gitignored
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Setup     │────►│    Core     │────►│   Verify    │
│  baseline + │     │  engine +   │     │ suite +     │
│ writer walk │     │  workflows  │     │ measurement │
└─────────────┘     └──────┬──────┘     └─────────────┘
                           │
                     ┌─────▼─────┐
                     │ Evaluation│
                     │ provenance│
                     │   ADR     │
                     └───────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Baseline and writer walk | None | Generated inventory and baseline report | Core |
| Generated class | Writer walk | Regenerate-after-apply handling | Verification |
| Base recording | Baseline | `baseSource: recorded` | Verification |
| Provenance evaluation | `provenance.ts` read | Recorded decision | Verification |
| Prerelease opt-in | None | Explicit policy and tests | Verification |
| No-run apply | Baseline | Update-only apply path | Verification |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Writer walk and baseline** - 2 hours - CRITICAL
2. **Generated class and its tests** - 4-6 hours - CRITICAL
3. **Base recording and its tests** - 2-3 hours - CRITICAL
4. **Suite and measurement** - 2-3 hours - CRITICAL

**Total Critical Path**: 10-14 hours

**Parallel Opportunities**:
- The prerelease opt-in and the no-run apply path are independent of the classifier
- The provenance evaluation is a read-and-record task that can run alongside the engine work
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Inventory and baseline captured | Writer walk and `check --json` baseline in `scratch/` | Setup complete |
| M2 | Engine changed | Suite passes with the new cases | Core complete |
| M3 | Measured and verified | Generated-only count recorded; workflow text updated; suite green | Phase close |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Generated files are a separate class, regenerated after apply

**Status**: Proposed

**Context**: A locally regenerated `graph-metadata.json` or leaf manifest differs from its release copy, so the current three-way class reads it as `local-only` and its unit as customized. No author edited those bytes; a generator wrote them from local sources.

**Decision**: Add a generated class, sourced from the writers' output inventory. Generated files are excluded from customization status and are regenerated after apply, never merged. If a generated file also carries an authored change the unit reports a conflict rather than silently regenerating.

**Consequences**:
- The unit status reflects authored intent, not generator noise.
- The post-apply battery must run the owning generator for each regenerated artifact.
- A missed writer misclassifies its output; the inventory is walked from the scripts, not guessed.

**Alternatives Rejected**:
- Path-pattern-only exclusion: misses writers and misclassifies on rename.
- Treating generated files as `take-release`: overwrites locally regenerated content with the release's stale copy before regeneration.
- Documenting manual regeneration: leaves the unit customized and the report wrong.

---

### ADR-002: Record the base at install through an explicit engine action

**Status**: Proposed

**Context**: `baseForUnit` infers a base from ancestry or the closest tag when no record exists. A copied `.skilled/` tree with no shared history can only infer, and a non-git checkout cannot infer at all.

**Decision**: Add an explicit recording action that writes `.skilled/release/base.json` per unit from a named release (default: the newest local stable tag) and have the update workflow invoke it on first run after a copy or install. `check` names the action whenever a unit's `baseSource` is `inferred` or `none`.

**Consequences**:
- A first run on a copied tree starts from `recorded` evidence.
- The install/first-run documentation must carry the step.
- Recording is a write to a git-tracked file, so it needs the same approval discipline as any other write.

**Alternatives Rejected**:
- Relying on inference: wrong for vendored trees and impossible off git.
- Failing closed without a base: blocks the first update of every copied tree.
- Recording at build time in this repository only: does not help a consumer's copy.

---

### ADR-003: Evaluate provenance_fingerprint as a pre-filter and record the decision

**Status**: Proposed

**Context**: `provenance_fingerprint` is deterministic from source bytes: `computeProvenanceFingerprint` hashes a payload of normalized bucket values plus dependencies sorted by path, each `{path, hash, exists}` (`provenance.ts:95-116`), and the schema locks it as `sha256:` hex (`skill-derived-v2.ts:45`). The research left open whether it can pre-filter customization.

**Decision**: The build evaluates the field as a pre-filter: compare a unit's stored fingerprint and its source dependencies against the base's recorded values, and treat an unchanged fingerprint as evidence that a derived block was regenerated rather than authored. The evaluation's outcome — adopted or rejected, with its fixture — is recorded before any engine change that depends on it.

**Consequences**:
- A cheap block-level signal joins the per-file blob compare.
- It covers the derived block only, not the whole tree, and cannot speak for a non-git checkout.
- The decision record must state the evidence that justified adoption or rejection.

**Alternatives Rejected**:
- Using it as the only customization signal: too narrow; covers one block in one file.
- Ignoring it: the hash input is now known and the evaluation is cheap.

---

