---
title: "Implementation Plan: sk-design mode consolidation"
description: "Retire /interface:audit and /interface:foundations entirely (ADR-002 supersedes the original relocate-and-preserve plan), fold the load-bearing anti-slop checks into the interface preflight card, and verify the resulting four-mode/three-command topology plus frozen styles."
trigger_phrases:
  - "sk-design consolidation plan"
  - "four design mode implementation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/006-design-mode-consolidation"
    last_updated_at: "2026-07-27T04:33:25.494Z"
    last_updated_by: "claude"
    recent_action: "Reconciled plan to the ADR-002 retirement outcome; removed obsolete relocation stages"
    next_safe_action: "Orchestrator runs validate.sh --strict, styles SHA-256 equality, and the design benchmark suite"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/hub-router.json"
      - ".opencode/skills/sk-design/design-interface/assets/interface-preflight-card.md"
    completion_pct: 85
    open_questions: []
    answered_questions:
      - "Foundations and audit are retired, not relocated-and-preserved (ADR-002)."
---
# Implementation Plan: sk-design Mode Consolidation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, JSON, JavaScript, TypeScript, Python, Bash, YAML |
| **Framework** | OpenCode skill hub, command routers, advisor metadata, compiled routing |
| **Storage** | Repository files and generated manifests |
| **Testing** | Node tests, corpus checks, shell verifiers, benchmark gates, strict SpecKit validation |

### Overview

**Superseded by ADR-002** (see `decision-record.md`): the original plan below staged a relocate-and-preserve migration. That design proved undeliverable — embedding foundations/audit as permanent `commandSubworkflows` required a second per-packet ownership array, which the create-skill parent-hub doctrine does not allow. The operator retired both commands instead. Actual delivery: delete the audit surface (70 files / 6,202 lines) and two dead AI-fingerprint parity scripts (915 lines); flatten foundations into `design-interface/` without preserving its `contract.md`/`README.md`/`changelog/`; fold 7 load-bearing anti-slop checks into `design-interface/assets/interface-preflight-card.md` section 11; rewrite `shared/procedures/polish-gate-orchestration.md` for its five live consumers; delete six now-unfixable playbook scenarios; fix one pre-existing dangling reference in `command-metadata.json`. Final registry: 4 modes, 3 commands. Styles remain untouched.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Approved retirement decision (ADR-002) is documented, superseding the original relocate-and-preserve design (ADR-001).
- [x] Baseline foundations/audit file counts and styles manifest were captured before any change (`scratch/foundations-files.before.txt`: 48, `scratch/audit-files.before.txt`: 70, `scratch/styles.sha256.before`: 7,812 rows).
- [x] Rollback boundary is documented (see Rollback Plan below).

### Definition of Done

- [x] Exactly four mode registry entries remain: `interface`, `motion`, `md-generator`, `design-mcp-open-design`.
- [x] `/interface:audit` and `/interface:foundations` are retired; three commands remain (`/interface:design`, `/interface:motion`, `/interface:design-reference`).
- [x] Live `design-audit/`/`design-foundations/` references confirmed at 0 (down from 152 baseline).
- [x] `interface-command-contract.test.mjs` (8/8), `design-command-surface-check.test.mjs` (7/7), `design-command-surface-check.mjs` (`commands=3 aliases=9 invalid=0 drift=0`), `parent-skill-check.cjs` (OK, 0 warnings), and corpus tests (interface+motion, 70/0) all pass.
- [ ] Styles pre/post SHA-256 equality across all 7,812 tracked paths — NOT run.
- [ ] Design benchmark suite — NOT run.
- [ ] `validate.sh --strict` — NOT run (orchestrator runs this after this reconciliation pass).
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Four top-level hub modes, three commands, no subworkflow ownership layer.

### Key Components

- **Hub registry/router**: Enumerates `interface`, `motion`, `md-generator`, `design-mcp-open-design` — no `commandSubworkflows` array.
- **Interface mode**: Owns ordinary interface generation. A `VISUAL_SYSTEM` intent + `visual-system` task lane keeps the inherited foundations resources (procedures, corpus, scripts, now flat under `design-interface/`) reachable.
- **Interface preflight card**: `design-interface/assets/interface-preflight-card.md` section 11 carries the 7 anti-slop checks that used to be part of the audit workflow.
- **Command routers**: Three commands map directly to their owning mode; no separate subworkflow discriminator.
- **Generated routing surfaces**: Mirror the authored four-mode/three-command source.

### Data Flow

```text
user prompt -> sk-design advisor identity -> four-mode hub router
                                      |
                                      +-> interface  -> /interface:design (incl. visual-system lane)
                                      +-> motion     -> /interface:motion
                                      +-> md-generator -> /interface:design-reference
```
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Prior Role | Actual Action | Verification |
|---------|--------------|--------|--------------|
| Mode registry and hub router | Six top-level modes | Reduced to four rows; `commandSubworkflows` and its signals/bundles/aliases deleted, not added | `design-command-surface-check.mjs`: `commands=3 aliases=9 invalid=0 drift=0` |
| Interface skill contract | Ordinary interface owner | Added `VISUAL_SYSTEM` intent + `visual-system` task lane so inherited foundations resources stay reachable | Parent-hub checker: OK, 0 warnings |
| Foundations tree | Peer mode | Flattened into `design-interface/`; `contract.md`/`README.md`/`changelog/` deleted (not transformed/preserved) | Corpus tests (interface+motion): 70/0 |
| Audit tree | Peer mode | Deleted entirely (70 files / 6,202 lines: `design-interface/audit/`, `assets/audit/`, `references/audit/`) | Live old-path grep: 152 -> 0 |
| Dead fingerprint parity scripts | Audit-only checkers | Deleted (`ai-fingerprint-registry-check.mjs` 383 lines + `ai-fingerprint-fixture-check.mjs` 532 lines) | No replacement gate needed; scripts had no other consumer |
| Anti-slop essentials | Part of audit scoring | 7 binary checks folded into `interface-preflight-card.md` section 11 (204 -> 211 lines) | Manual diff of the card; no scoring apparatus carried over |
| Command metadata/wrappers/assets | Public route surface | Reduced to 3 commands; fixed a pre-existing dangling reference to a `design-audit/references/transform-remediation.md` directory that never existed | `interface-command-contract.test.mjs`: 8/8 |
| Playbook scenarios | Proved audit/foundations routing | 6 scenarios deleted as unfixable (no longer a live routing target to prove) | N/A — target retired |
| Styles tree | Shared frozen package | No edit | Baseline manifest captured (`scratch/styles.sha256.before`, 7,812 rows); final equality NOT run |

Algorithm invariant (revised by ADR-002): registry identity and workflow capability are no longer kept separate for audit/foundations — removing the mode row and retiring the command are the same action. This intentionally reverses the original invariant, which required capability to survive identity removal.
<!-- /ANCHOR:affected-surfaces -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Baseline (done)

- [x] Captured foundations/audit file counts (`scratch/foundations-files.before.txt`: 48, `scratch/audit-files.before.txt`: 70) and tracked styles SHA-256 manifest (`scratch/styles.sha256.before`: 7,812 rows).
- [x] Captured test/checker baselines: `interface-command-contract.test.mjs`, `design-command-surface-check.test.mjs`/`.mjs`, `parent-skill-check.cjs`, `scratch/benchmark-before/`.

### Phase 2: Scope reversal to retirement (ADR-002)

- [x] Identified that `commandSubworkflows` violates the create-skill one-entry-per-packet doctrine rule; operator chose retirement over standalone-skill extraction.

### Phase 3: Audit deletion + foundations flattening (done)

- [x] Deleted the audit surface (70 files / 6,202 lines) and the two dead AI-fingerprint parity scripts (915 lines).
- [x] Flattened foundations into `design-interface/`; deleted its `contract.md`/`README.md`/`changelog/`; moved `procedures/`, `corpus/`, `scripts/` flat.
- [x] Folded 7 anti-slop checks into `interface-preflight-card.md` section 11; added `VISUAL_SYSTEM` intent + `visual-system` task lane.
- [x] Rewrote `shared/procedures/polish-gate-orchestration.md` for its five live consumers; deleted 6 unfixable playbook scenarios; fixed the dangling `command-metadata.json` reference.

### Phase 4: Registry/router cleanup (done)

- [x] Reduced `mode-registry.json` to four rows; deleted `commandSubworkflows`, `extensions["command-subworkflows"]`, `commandSubworkflowSignals`, `canonicalBySubworkflow`, `commandSubworkflowBundles`, `transformVerbRouting.excludedAliases`.
- [x] Confirmed 0 live `design-audit/`/`design-foundations/` references remain (down from 152).

### Phase 5: Verification (partial — remaining work)

- [x] Ran command/corpus/checker gates (see gate table in `implementation-summary.md`).
- [ ] Compare styles manifests byte-for-byte — NOT run.
- [ ] Run the design benchmark suite — NOT run.
- [ ] `validate.sh --strict` and final doc reconciliation — orchestrator runs after this pass.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Result |
|-----------|-------|-------|
| Command contract | `interface-command-contract.test.mjs` | 8/8 pass (baseline and final) |
| Command surface | `design-command-surface-check.test.mjs` | 7/7 pass (baseline and final) |
| Command surface (direct) | `design-command-surface-check.mjs` | baseline `commands=5 aliases=15`; final `commands=3 aliases=9`; `invalid=0 drift=0` both |
| Parent-hub | `parent-skill-check.cjs` | OK, 0 warnings (baseline and final) |
| Corpus | interface + motion | 70 passing, 0 failing |
| Live old-path refs | grep for `design-audit/`/`design-foundations/` | 152 baseline -> 0 final |
| Frozen data | Tracked styles files | Baseline captured (7,812 rows); final equality NOT run |
| Benchmark | Design benchmark suite | NOT run |
| Documentation | `validate.sh --strict` | NOT run — orchestrator runs after this pass |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Canonical mode-consolidation research (ranked audit-as-standalone-skill rec) | Internal evidence | Considered, overridden by ADR-002 | Rationale for retirement vs. extraction unavailable |
| create-skill parent-hub doctrine (one-entry-per-packet) | Internal doctrine | Verified conflict — this is why ADR-002 exists | Would reopen the `commandSubworkflows` design |
| Command/corpus gates | Internal verification | Green (see gate table) | Behavioral regression cannot be proven |
| SpecKit validator | Internal docs | NOT run yet | Packet cannot close |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A corpus, checker, command-contract, or styles invariant fails after a stage.
- **Procedure**: Restore only this packet's touched paths from the scoped pre-change Git state: reinstate the deleted audit tree, the two parity scripts, the foundations `contract.md`/`README.md`/`changelog/`, and the six playbook scenarios; restore `commandSubworkflows` and the six-row registry; revert `interface-preflight-card.md` and `polish-gate-orchestration.md`. Never revert unrelated dirty files. Not recommended past this point — reinstating `commandSubworkflows` reintroduces the doctrine conflict ADR-002 resolved.
<!-- /ANCHOR:rollback -->

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Baseline -> Scope reversal (ADR-002) -> Deletion + flattening -> Registry cleanup -> Verification (partial)
```
<!-- /ANCHOR:phase-deps -->

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

Not tracked at per-phase granularity for the retirement outcome; deletion + flattening replaced the original 15-25 hour relocation estimate with a smaller, mostly-subtractive change. See `implementation-summary.md` for what shipped.
<!-- /ANCHOR:effort -->

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-Implementation Checklist

- [x] Captured source file accounting: `scratch/foundations-files.before.txt` (48), `scratch/audit-files.before.txt` (70).
- [x] Captured tracked styles hashes: `scratch/styles.sha256.before` (7,812 rows).
- [ ] Scoped git-status/diff snapshot for every target path — not captured as a standalone artifact.

### Rollback Procedure

1. Stop at the first failing stage and retain its command output.
2. Restore only paths listed in this packet from the pre-change Git content and recorded manifests (see Rollback Plan above for the exact list).
3. Re-run the baseline gates and compare pass counts.
4. Confirm styles hashes still match `scratch/styles.sha256.before`.

### Data Reversal

- **Has data migrations?** No.
- **Reversal procedure**: Repository path relocation only; no persistent user data or external deployment changes.
<!-- /ANCHOR:enhanced-rollback -->

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
audit tree (deleted) ---------+
foundations tree (flattened) -+--> design-interface/ --> command contracts + corpora
mode registry + router --------------------------------> compiled routing consumers
styles hash manifest (untouched) -----------------------> equality proof (pending)
```
<!-- /ANCHOR:dependency-graph -->

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Baseline manifests** - CRITICAL - done
2. **Scope reversal decision (ADR-002)** - CRITICAL - done
3. **Audit deletion + foundations flattening** - CRITICAL - done
4. **Registry/router cleanup** - CRITICAL - done
5. **Styles equality + benchmark + strict validation** - CRITICAL - NOT run
<!-- /ANCHOR:critical-path -->

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Status |
|-----------|-------------|--------|
| M1 | Baseline frozen (counts, hashes, benchmark-before) | Done |
| M2 | Scope reversed to retirement (ADR-002) | Done |
| M3 | Audit deleted, foundations flattened, anti-slop checks folded into preflight card | Done |
| M4 | Four-mode/three-command registry live, 0 old-path references | Done |
| M5 | Styles equality, design benchmark, `validate.sh --strict` | Pending |
<!-- /ANCHOR:milestones -->

## L3: ARCHITECTURE DECISION RECORD

See `decision-record.md` for the complete record.

| ADR | Decision | Status |
|-----|----------|--------|
| ADR-001 | Four hub modes plus two interface command subworkflows | Superseded by ADR-002 |
| ADR-002 | Retire both command subworkflows; delete `commandSubworkflows` entirely | Accepted |
