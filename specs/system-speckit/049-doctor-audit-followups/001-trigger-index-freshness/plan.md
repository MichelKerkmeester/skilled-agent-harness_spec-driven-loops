---
title: "Implementation Plan: Phase 1: trigger-index-freshness"
description: "Regenerate the committed trigger index through /doctor:rebuild, make folder-token-fallback reachable at generation by sharing packetFolderTokens, add the generator's --check as the doctor's staleness evidence, and correct the retrieval lane's documents and version pins."
trigger_phrases:
  - "implementation plan"
  - "trigger index regeneration"
  - "folder token fallback"
  - "staleness evidence"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1: trigger-index-freshness

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node ESM (retrieval scripts), Bash and Python (doctor validators) |
| **Framework** | None — plain Node processes, no daemon and no MCP transport |
| **Storage** | JSON artifacts: the committed index and its three sidecars |
| **Testing** | vitest suites under `runtime/cli/tests/`, `node --test`, `route-validate.sh --self-test` |

### Overview
Regenerate the committed index and sidecars with the existing generator, make the phrase judge's `folder-token-fallback` class reachable in generation by feeding it the folder tokens of each phrase's owning documents, and replace the doctor's mtime-only staleness verdict with the generator's content comparison. Then correct the four stale claims the audit recorded and name `/doctor:rebuild` as the byte-identical proof owner.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Every finding is re-checked against the current tree and still holds, or is marked resolved
- [ ] The generator's `--check` output is captured before the change as the baseline
- [ ] `/doctor:rebuild`'s generator leg and its write targets are confirmed

### Definition of Done
- [ ] All acceptance criteria met with the named command output
- [ ] The index and all three sidecars carry one `manifestHash`
- [ ] Retrieval vitest suites, `node --test`, and `route-validate.sh` pass
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Generator/publisher pipeline with a read-only diagnostic consumer: one generator writes four deterministic artifacts, one lookup reads them cold, and one doctor reports on them without writing.

### Key Components
- **`generate-trigger-index.mjs`**: walks the corpus, reads `trigger_phrases`, publishes the index, manifest, diagnostics and variants; owns the `phraseQuality` bucket.
- **`lib/phrase-judge.mjs`**: the single place the negative classes live; takes optional `folderTokens` context.
- **`lib/grep-convention.mjs`**: exports `packetFolderTokens(relativePath)`, the derivation the validator already uses.
- **`doctor-speckit-retrieval.yaml`**: the read-only workflow that reads the artifacts and emits signals.
- **`route-validate.sh`**: enforces parity between the route manifest, the router and the presentation.

### Data Flow
Corpus documents → generator (phrase extraction → judgment → bucket counts) → four committed artifacts → doctor phases read the artifacts and emit signals → report and state log only. `/doctor:rebuild` is the only writer of the artifacts.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `generate-trigger-index.mjs:260` | Judges every unique normalized phrase with no folder context | Update: judge with the owning documents' folder tokens | `rg -n "judgeTriggerPhrase\(" .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs` |
| `lib/phrase-judge.mjs:62,100-103` | Returns `folder-token-fallback` only when `context.folderTokens` matches | Unchanged (contract is correct) | `rg -n "folderTokens" .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/phrase-judge.mjs` |
| `lib/grep-convention.mjs:738` | Shared `packetFolderTokens` derivation | Unchanged; imported by the generator | `rg -n "export function packetFolderTokens" .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/grep-convention.mjs` |
| `rules/check-grep-convention-helper.mjs:187` | Passes folder tokens per document | Unchanged; the label the generator must match | `rg -n "judgeTriggerPhrase\(raw, \{ folderTokens \}\)" .skilled/skills/system-spec-kit/runtime/cli/rules/check-grep-convention-helper.mjs` |
| `runtime/data/trigger-index.json` + `fixtures/*.json` | Committed artifacts, currently stale | Regenerate through `/doctor:rebuild` | `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs --check --json` exits 0 |
| `doctor-speckit-retrieval.yaml` phase 0/1 | mtime-only staleness verdict; byte-identical policy unnamed | Update: add `--check`; demote mtime; name `/doctor:rebuild` | `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0 |
| `retrieval-conventions.md` §9, §2.5, §4 | Names an absent `.opencode/specs` symlink and ripgrep 14.1.1 | Update: describe the alias conditionally; re-test and update the pin | `node --test`-equivalent vitest: `cd .skilled/skills/system-spec-kit/runtime/cli && npx vitest run tests/retrieval-coverage-parity.vitest.ts --config ../vitest.config.ts --root .` |
| `runtime/cli/retrieval/README.md:93-94` | Promises the full class list; claims a deleted symlink | Update: keep the promise true; drop the symlink claim | `rg -n "CLAUDE.md" .skilled/skills/system-spec-kit/runtime/cli/retrieval/README.md` |
| `033/001-trigger-index-replacement/acceptance-criteria.md:20-21` | Continuity `key_files` name `.opencode/.../scripts|data` | Update: name the live runtime paths | `rg -n "opencode/skills/system-spec-kit/(scripts|data)" specs/system-speckit/033-system-speckit-v4/017-memory-database-decommission/001-trigger-index-replacement/acceptance-criteria.md` finds none |

Required inventories:
- Same-class producers: `rg -n "folderTokens|folder-token-fallback" .skilled/skills/system-spec-kit/runtime/cli --glob '!**/tests/**'`.
- Consumers of changed symbols: `rg -n "phraseQuality" .skilled --glob '!node_modules'`.
- Matrix axes: index present/absent × index fresh/stale × folder-token phrase present/absent × validator class match/mismatch.
- Algorithm invariant: a phrase's bucket class must equal the per-document validator's class for every owning document, and the generator must never import the validator to get it.
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
| Unit | Phrase judgment with folder tokens; bucket counting | vitest (`trigger-index.vitest.ts`, `retrieval-coverage-parity.vitest.ts`) |
| Integration | Full generator run, `--check` round trip, four-way hash compare | `node generate-trigger-index.mjs --check --json` |
| Manual | Doctor asset read-through against `route-validate.sh` and the presentation parity | `bash .skilled/commands/doctor/scripts/route-validate.sh` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `/doctor:rebuild` generator leg | Internal | Green | Index cannot be regenerated; the phase blocks |
| `route-validate.sh` | Internal | Green | Doctor asset edits cannot be verified |
| Retrieval vitest suites | Internal | Green | Convention and corpus edits cannot be verified |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the regenerated index fails `--check`, or the folder-token change regresses an existing bucket count.
- **Procedure**: restore the four artifacts from the previous commit (`git checkout -- <four paths>`), revert the generator change, and rerun the suites.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (baseline capture) ──► Core (generator + asset + docs) ──► Verify (regenerate + suites)
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
| Setup | Low | 1 hour |
| Core Implementation | Med | 4-6 hours |
| Verification | Low | 1-2 hours |
| **Total** | | **6-9 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] The four committed artifacts are captured before regeneration
- [ ] The pre-change `phraseQuality` bucket is captured for diffing
- [ ] The doctor asset's current phase text is captured

### Rollback Procedure
1. `git checkout --` the four artifacts and the edited source files
2. Rerun `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs --check --json`
3. Rerun the retrieval vitest suites and `route-validate.sh`
4. Report the rollback with the failing command's output

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Not applicable — all changes are tracked files
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Setup     │────►│    Core     │────►│   Verify    │
│  baseline   │     │ generator + │     │ regenerate  │
│   capture   │     │ asset+docs  │     │  + suites   │
└─────────────┘     └──────┬──────┘     └─────────────┘
                           │
                     ┌─────▼─────┐
                     │ Docs pass │
                     │ (README,  │
                     │ conventions│
                     │  packet)  │
                     └───────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Baseline capture | None | Pre-change bucket and check output | Core |
| Generator change | Baseline | Reachable `folder-token-fallback` | Regeneration |
| Doctor asset edit | Generator change | Evidence-backed staleness activity | Verification |
| Doc corrections | None | Corrected claims and paths | Verification |
| Regeneration | Generator change | Fresh artifacts | Verification |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Baseline capture** - 1 hour - CRITICAL
2. **Generator folder-token change** - 2-3 hours - CRITICAL
3. **Regeneration through `/doctor:rebuild`** - 1 hour - CRITICAL
4. **Suites and validator** - 1-2 hours - CRITICAL

**Total Critical Path**: 5-7 hours

**Parallel Opportunities**:
- The four document corrections can proceed while the generator change is under test
- The acceptance packet continuity fix is independent of everything else
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Baseline captured | `--check` output and bucket snapshot stored in `scratch/` | Setup complete |
| M2 | Generator and asset changed | Folder-token test passes; route-validate exits 0 | Core complete |
| M3 | Fresh and verified | `--check` exits 0; all suites green; docs corrected | Phase close |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Make folder-token-fallback reachable in generation by sharing the validator's derivation

**Status**: Proposed

**Context**: `generate-trigger-index.mjs:260` judges normalized phrases with no folder context, so `folder-token-fallback` can never appear in the committed `phraseQuality` bucket, while the per-document validator reports it. One phrase therefore gets two labels depending on which reader looks, and `README.md:93`'s promise that the bucket counts every class is false.

**Decision**: Pass the folder tokens of each phrase's owning documents into `judgeTriggerPhrase`, using the existing `packetFolderTokens` export from `lib/grep-convention.mjs` rather than a second derivation. The bucket's counting rule is stated in the diagnostics contract and covered by a test.

**Consequences**:
- The generator and the validator name the same class for the same phrase.
- The bucket can gain a seventh key without a schema change if `artifact.mjs`'s shape assertion tolerates it; otherwise the schema bumps deliberately.
- A phrase owned by several folders is judged against each owner, so the counting rule must say which class wins when owners disagree.

**Alternatives Rejected**:
- Re-deriving folder tokens inside the generator: a second implementation of the same rule, which is the drift this repository bans.
- Changing the judge's default context: it would reclassify phrases without folder evidence and break the validator's contract.
- Documenting the class as validator-only (the 013 audit's interim fix): leaves one phrase with two labels, which is the recorded defect.

---

