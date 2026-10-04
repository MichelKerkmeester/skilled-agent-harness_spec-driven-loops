---
title: "Feature Specification: Doctor update fixes"
description: "A deep-research audit found 26 defects in /doctor:update, 5 P1 and 21 P2, across the release-update engine, its three workflows, the presentation and the command contract. This phase fixes every one in four ordered build phases, each with a proving test, and keeps the engine's existing invariants and its 56 tests."
trigger_phrases:
  - "doctor update fixes"
  - "release-update engine fixes"
  - "doctor update stale lock"
  - "doctor update copied tree"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Doctor update fixes

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-03 |
| **Branch** | `worktrees/079-doctor-command-audit` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 6 |
| **Predecessor** | 005-doctor-update-research |
| **Successor** | None |
| **Handoff Criteria** | Every row of `acceptance-criteria.md` is Met, the engine suite passes 71 of 71, `run-all.sh` exits 0, and `validate.sh --strict` on this folder prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the doctor audit follow-ups packet (`../spec.md`). Phase 005 audited `/doctor:update` end to end and recorded 26 findings, DU-01 to DU-26, in `../005-doctor-update-research/research/research.md` (Section 5 lists them, Section 11 ranks a fix for each). This phase re-checked every finding against the code and plans the fixes as four build phases, A to D, that land in order.

**Scope Boundary**: the `/doctor:update` router, its three workflows and presentation, two new workflows for rollback and base recording, the release-update engine and its test suite, one new contract test, the doctor rows of the command contract and the route manifest, one tracked ignore file under `.skilled/release/`, the three catalog lines that name the update actions, and the release-note index row. No other doctor command changes.

**Dependencies**:
- `../005-doctor-update-research/research/research.md`, Sections 5, 11 and 12, read as claims and re-verified in `plan.md` Section 3.
- `../002-release-update-customization-signals/scratch/generated-inventory.md`, which records why each generated-file candidate was kept or left out.
- The sk-create-command contract (`.skilled/skills/sk-doc/sk-create-command/SKILL.md:217-219`, `:354`, `:378-379`) and the sk-code-opencode JavaScript checklist (`.skilled/skills/sk-code/sk-code-opencode/assets/checklists/javascript-checklist.md`).

**Deliverables**:
- Phase A, engine integrity: DU-01, DU-15 and the engine half of DU-02.
- Phase B, copied-tree journey: DU-03, DU-04, DU-07, DU-08, DU-14, DU-25 and DU-13 item 5.
- Phase C, approval, recovery and journey: DU-05, DU-06, DU-09, DU-10, DU-11, DU-12, DU-16, the workflow half of DU-02 and DU-13 items 3 and 4.
- Phase D, contract hygiene: DU-13 items 1, 2 and 6, DU-17 to DU-24, DU-26, and a new contract test.
- The engine suite grows from 56 to 71 tests, and a new contract test file joins `run-all.sh`.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`/doctor:update` is not safe to build on yet. Its engine keeps its core invariants: align writes only inside its run directory (`release-update.cjs:1371-1382`), apply rechecks every path under its lock (`release-update.cjs:1842`, `:1877-1882`) and rollback skips later edits (`release-update.cjs:2045-2047`). The defects sit in hand-offs between actions and between the engine and the operator. A partial decision set drops release changes and records the release as the unit's base (`release-update.cjs:1691-1731`). An interrupted apply strands `.skilled/release/.apply.lock`, and the lock then blocks rollback and every later apply (`release-update.cjs:1775-1795`, `:1834-1836`). A copied tree cannot name its framework remote through the routed command (`update.md:36-38`, `release-update.cjs:2073`). `record-base` trusts whatever release the operator names (`release-update.cjs:1996-2001`). The one startup approval is not bound to the plan apply executes (`release-update.cjs:1860-1873`, `:1566-1568`). Twenty-one P2 defects add journey gaps, drift between the workflows, presentation and engine, sk-create-command contract gaps and missing tests.

### Purpose

Every finding is closed by the smallest change that fully closes it, each change has a test that fails on the old code, and the engine's existing invariants and its 56 tests stay intact.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Engine changes in `release-update.cjs` for DU-01 to DU-06, DU-08, DU-09, DU-11, DU-16, DU-17 and DU-25, each with tests in `release-update.test.cjs`.
- A new engine subcommand `unlock`, a `rollback --dry-run`, and three new engine flags: `apply --plan-digest`, `record-base --trust-release`, and a persisted `remote` in `base.json`.
- Two new routed actions, `rollback` and `record-base`, each with its own workflow YAML, approval gate, path validator and state log.
- Workflow, presentation, router, command-contract and route-manifest edits that make the documents match the engine.
- A tracked `.skilled/release/.gitignore` and one new generated-artifact pattern for compiled-route activation manifests.
- A new contract test, `.skilled/commands/doctor/scripts/tests/doctor-update-contract.test.cjs`, run by `run-all.sh`.
- A two-line refresh of the release-note index (DU-26).

### Out of Scope

- The tag-namespace collision in a copied tree whose own project uses four-part tags (`research.md:427`). It is inferred and not reproduced, and a recorded base outranks ancestry for every unit the installed release holds (`release-update.cjs:797-810`). It is recorded as a risk below.
- Batching the HEAD-dirty check into one `git status` call (`research.md:239`, item 5). It speeds apply but does not close DU-02, and it would replace `pathDirtyAgainstHead` (`release-update.cjs:1499-1506`), whose untracked and directory cases a batch would have to re-derive.
- Cleaning a `writeAtomic` temp file after a SIGKILL (`research.md:236`). Once signals are deferred only SIGKILL or power loss can leave one, it was never reproduced, and it shows in `git status` as an untracked file.
- A deliberate-downgrade flag (`research.md:302`). Rolling back the apply that took the newer release, or git, already returns a tree to an older release.
- Similarity-threshold rename pairing and automatic migration of local edits to a renamed path (`research.md:344-345`). Git's own rename detection links the two paths, and the operator still decides each path.
- Edits to `PUBLIC-RELEASE.md`. It documents the Public repository's own symlinked consumers (`PUBLIC-RELEASE.md:3`, `:76`), not how an operator updates a copied tree. The presentation owns the copied-tree route.
- The deep-loop `dispatch_failure` record and executor stamp (`research.md:66`, `:68`, `:431`). Those are deep-loop defects outside this command.
- The feature-catalog entries under `.skilled/skills/system-spec-kit/feature-catalog/doctor-commands/`. They describe the command's purpose, which does not change.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/doctor/scripts/release-update.cjs` | Modify | Completeness rule, lock owner and stale detection, `unlock`, signal deferral, remote resolution, nearest-release check, plan digest, downgrade status, bare-apply guard, ledger remedy, release-directory exclusion, unverified base, activation-manifest pattern, rename links, `rollback --dry-run` |
| `.skilled/commands/doctor/scripts/tests/release-update.test.cjs` | Modify | Fifteen new tests and three updated assertions |
| `.skilled/commands/doctor/scripts/tests/doctor-update-contract.test.cjs` | Create | Contract checks across the router, five workflows, presentation, engine and command contract |
| `.skilled/commands/doctor/update.md` | Modify | Two new actions, `--remote`, apply `--offline`, summarized hint, two tools, corrected wording |
| `.skilled/commands/doctor/assets/doctor-update-check.yaml` | Modify | `--remote` input, engine vocabulary, report-status mapping, `downgrade`, rename fields, base-recording routing |
| `.skilled/commands/doctor/assets/doctor-update-align.yaml` | Modify | `remote` and `include_prerelease` inputs, run-root failure template, unresolved files, dry-run rule |
| `.skilled/commands/doctor/assets/doctor-update-apply.yaml` | Modify | New inputs, digest-bound apply, lock handling, timeout rule, battery steps, cancellation, dry-run rule |
| `.skilled/commands/doctor/assets/doctor-update-rollback.yaml` | Create | Routed rollback with stale-lock recovery |
| `.skilled/commands/doctor/assets/doctor-update-record-base.yaml` | Create | Routed base recording with the nearest-release check |
| `.skilled/commands/doctor/assets/doctor-update-presentation.txt` | Modify | Every new prompt, template and status, plus the corrected wording |
| `.skilled/commands/doctor/_routes.yaml` | Modify | `rollback` and `record-base` actions under the standalone `/doctor:update` entry |
| `.skilled/skills/sk-doc/sk-create-command/assets/command-contract.json` | Modify | Doctor hint, execution targets, owned assets, loader requirement, destructive operations, aliases |
| `.skilled/release/.gitignore` | Create | Ignores `runs/` and `.apply.lock` |
| `.skilled/commands/doctor/scripts/README.md` | Modify | Names the five workflows and the `unlock` subcommand |
| `.skilled/commands/doctor/scripts/tests/README.md` | Modify | Lists the contract test |
| `.skilled/commands/README.txt` | Modify | The `/doctor:update` catalog row names five actions |
| `README.md` | Modify | The `/doctor:update` line names five actions |
| `.skilled/changelog/skilled/README.md` | Modify | The index lists `v4.0.0.3.md` and names the untagged entry |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | No regression. The 56 engine tests stay green. Three are updated only where a decision in `plan.md` changes the expected behaviour: the prefilled-decision test at `release-update.test.cjs:822-839` (DU-15), the new-unit assertion at `release-update.test.cjs:569` (DU-08) and the recorded-source assertion at `release-update.test.cjs:689` (DU-25). `run-all.sh` keeps exiting 0. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-002 | DU-01. A customized, conflict or removed unit is applied only when every planned file of class `take-release` or `conflict` has an operator decision. Otherwise apply skips the unit, names the undecided paths, writes none of its files and leaves its base record unchanged (`release-update.cjs:1691-1731`). |
| REQ-003 | DU-02. SIGINT, SIGTERM and SIGHUP cannot strand the apply lock. A lock left by a dead owner is reported as stale with its recovery, a new `unlock` subcommand removes only such a lock, and the routed rollback clears it with the operator's approval. The lock path is gitignored (`release-update.cjs:1775-1795`, `:1834-1836`, `:2178`). |
| REQ-004 | DU-03. Check, align and apply route `--remote=<name-or-url>`. `record-base --remote` persists the remote in `base.json` and later commands use it by default. A remote that lists no release tags sets `upstream.error` (`release-update.cjs:771-773`, `:2073`). |
| REQ-005 | DU-04. `record-base` refuses a named release when another release is strictly nearer the local tree for any unit, names the nearest release per unit, accepts an explicit `--trust-release` override, and writes `base.json` under the apply lock (`release-update.cjs:1996-2003`). |
| REQ-006 | DU-05. The apply dry-run returns `release`, `releaseCommit`, `runDir` and a `planDigest`. The workflow passes the release and the digest to the real apply, and the engine refuses a plan whose digest differs (`release-update.cjs:1860-1873`). |

### P2 - Required by the operator's request to fix every finding

| ID | Requirement |
|----|-------------|
| REQ-007 | DU-06. A refused apply that found an uncommitted `base.json` or `divergence.json` says to commit them, and the apply result template and the align handoff say so too (`release-update.cjs:1755-1760`). |
| REQ-008 | DU-07. `.skilled/release/.gitignore` ships with `runs/` and `.apply.lock`, and the align and apply preflights show the exact ignore lines when the run root is not ignored. |
| REQ-009 | DU-08. Nothing under `.skilled/release/` becomes a unit, and a unit with no local files is left out of `baseRecording` (`release-update.cjs:535`, `:1102-1111`). |
| REQ-010 | DU-09. A bare apply refuses to reuse an alignment run that holds an operator decision or a deferred unit, and names the `--decisions` path (`release-update.cjs:1566-1571`). |
| REQ-011 | DU-10. `rollback` and `record-base` are routed actions, each with an approval gate, the canonical path validator and a state log, registered in `command-contract.json` and `_routes.yaml`. |
| REQ-012 | DU-11. A unit whose base release is newer than the selected release reports `downgrade`, and apply skips it with that reason (`release-update.cjs:907-921`). |
| REQ-013 | DU-12. The post-apply battery acts on every generator that `followUps.regenerate` names (`doctor-update-apply.yaml:133-176`). |
| REQ-014 | DU-13. The six field-level mismatches between the workflows, presentation and engine are removed. |
| REQ-015 | DU-14. Align and apply declare `include_prerelease` as an input (`doctor-update-align.yaml:33-38`, `doctor-update-apply.yaml:37-42`). |
| REQ-016 | DU-15. A record with `source: 'prefilled'` counts as undecided in apply, so a prefilled suggestion applies only after `decide` records it (`release-update.cjs:1277-1279`). |
| REQ-017 | DU-16. Compiled-route activation `manifest.json` files are classed `generated`, `intent_signals` and `fence-state.json` stay authored with the reason recorded beside the inventory, and a test covers the trigger-index patterns. |
| REQ-018 | DU-17. A release rename inside a unit links its old and new paths in the file report and the evidence card (`release-update.cjs:1020-1057`). |
| REQ-019 | DU-18. Cancellation and interruption end apply with `STATUS=CANCELLED ACTION=cancelled`, and an explicit no stays `STATUS=DECLINED` (`doctor-update-presentation.txt:212`). |
| REQ-020 | DU-19. Align and apply state one dry-run rule: a dry run writes no file, including no state log (`doctor-update-apply.yaml:33`, `:111`, `:195`). |
| REQ-021 | DU-20. The router hint summarizes the flags within 140 characters, and the command contract carries the identical hint (`update.md:3`, `command-contract.json:203`). |
| REQ-022 | DU-21. The router carries no record-base invocation or commit instruction (`update.md:68`). |
| REQ-023 | DU-22. The router states that a release change to an unregenerated generated file is applied like any other file (`update.md:66`). |
| REQ-024 | DU-23. The router says check is read-only for the checkout, and the presentation discloses the object-store fetch next to `--offline` (`update.md:16`, `doctor-update-presentation.txt:23-31`). |
| REQ-025 | DU-24. The router grants `Read, Bash` only (`update.md:4`). |
| REQ-026 | DU-25. A base record with no tree fingerprint reports `recorded-unverified` and is listed in `baseRecording` (`release-update.cjs:806`). |
| REQ-027 | DU-26. The release-note index lists every top-level entry and names the entry whose tag does not exist yet (`.skilled/changelog/skilled/README.md:23-25`). |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node --test .skilled/commands/doctor/scripts/tests/release-update.test.cjs` reports `tests 71`, `pass 71`, `fail 0` and exits 0 after phase D.
- **SC-002**: `bash .skilled/commands/doctor/scripts/tests/run-all.sh` exits 0 after every phase, and its node:test step runs 10 files after phase D.
- **SC-003**: Every new engine test fails when run against the engine at commit `506bc5a10c`, observed once per phase.
- **SC-004**: `generate-command-routers.cjs --check` lists no doctor router as drifted, and `route-validate.sh` exits 0.
- **SC-005**: Every row of `acceptance-criteria.md` is Met with observed evidence.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Git rename detection (`git diff -M`) for DU-17 | Low. Without it renames stay unlinked | Called only for a unit that holds both a release deletion and a release addition. A failed call leaves the reports unlinked, never wrong |
| Dependency | The compiled-route minting CLI and guard (`.skilled/bin/compiled-route-manifest.cjs`, `.skilled/bin/compiled-route-guard.cjs`) for DU-12 and DU-16 | Medium. The new battery step depends on them | Both exist and pass on this tree. The guard skips the authored comparison when the authored copy is absent (`compiled-route-guard.cjs:67`), so it runs in operator trees |
| Risk | Prefilled records stop applying (DU-15), so a raw-engine user who applies an untouched `decisions.json` sees a customized unit skipped | Med | The skip names the reason, and the routed workflow already requires `decide` for every file (`doctor-update-align.yaml:123`) |
| Risk | Signal deferral lets an apply finish its writes after Ctrl-C | Low | A complete apply with `rollback.json` is safer than a partial tree. A killed git child still aborts the run before the first write |
| Risk | The nearest-release check (DU-04) fetches every candidate tag in a copied tree | Low | Check's base inference already does the same (`release-update.cjs:820-835`) |
| Risk | Tag-namespace collision in a copied tree whose project uses four-part tags | Low, inferred | Out of scope. A recorded base outranks ancestry, and `--remote` makes upstream tags come from the framework |
| Risk | A persisted `remote` in a tracked `base.json` could be edited by another committer | Med | The engine refuses any remote that starts with `-`, so a value cannot become a git option |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Apply adds no git process per written path. The plan digest is computed in memory from data apply already holds.
- **NFR-P02**: The engine suite runtime stays within 120 seconds over the 91-second baseline measured on 2026-10-03.

### Security
- **NFR-S01**: No engine write lands outside its documented targets. Plan-path confinement (`release-update.cjs:1627-1634`) and rollback-path confinement (`release-update.cjs:2027-2034`) stay unchanged.
- **NFR-S02**: `unlock` removes a lock only when its owner pid is not running, and never a lock with no readable owner. A remote value that starts with `-` is refused from the flag and from `base.json`.

### Reliability
- **NFR-R01**: SIGINT, SIGTERM and SIGHUP during a lock-held section never leave the lock behind.
- **NFR-R02**: Every new refusal exits 1 before the first target write and leaves the checkout unchanged.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: a unit whose decided set covers no `take-release` or `conflict` file is skipped as `no decisions`, the existing reason.
- Maximum length: the router hint is 128 characters, within the 140 limit (`sk-create-command/SKILL.md:217`).
- Invalid format: a `--plan-digest` that is not 64 lowercase hex characters, or a `--remote` that starts with `-`, exits 2 as a usage error.

### Error Scenarios
- External service failure: a remote that cannot be listed makes `record-base` refuse unless `--trust-release` is passed, because the named release cannot be checked against others.
- Network timeout: check keeps reporting `unknown` with `upstream.error`, never `current`.
- Concurrent access: a live lock owner is never removed. A second apply, rollback or record-base refuses and names the owner pid.

### State Transitions
- Partial completion: an apply interrupted by SIGKILL leaves a stale lock and a `rollback.json`. `/doctor:update rollback` clears the lock with approval, then restores the run.
- Session expiry: a decided alignment run survives a bare apply, which now refuses instead of consuming it.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 20/25 | 18 files, about 1,400 changed lines, one engine, five workflows, one presentation |
| Risk | 18/25 | The engine writes release-managed files, rollback records and a lock, and the contract is shared |
| Research | 6/20 | The research and this review settled every question before the build |
| **Total** | **44/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The four questions research.md left open, prefill consent, copied-tree support, the generated candidates and the release-note index, are decided with evidence in `plan.md` Section 3.
<!-- /ANCHOR:questions -->

---
