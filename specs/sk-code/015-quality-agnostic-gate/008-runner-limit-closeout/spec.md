---
title: "Feature Specification: Phase 8: runner-limit-closeout"
description: "Closes every limitation the built-in runner phase left open: a pre-commit probe that proves the checker its hook names, a dist adapter with a real read-only path, a 50-file run under two seconds, a stated guard boundary and a corrected limitation list."
trigger_phrases:
  - "runner limit closeout"
  - "phase 8 runner limit closeout"
  - "runner limits closed"
  - "quality runner budget"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.3 -->
# Feature Specification: Phase 8: runner-limit-closeout

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-26 |
| **Branch** | `worktrees/229-quality-runner-limits` |
| **Parent Spec** | ../spec.md |
| **Phase** | 8, a closeout child of the parent packet, built after 003 and before 006 |
| **Predecessor** | 002-builtin-runner and 003-config-and-doctor |
| **Successor** | 006-measurement, which measures the final runner |
| **Handoff Criteria** | The six requirements pass on the branch head with phases 002 and 003 landed, the timing command prints five runs under two seconds, and phase 006 can measure a runner with no deferred limitation in its record |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the Make sk-code-quality a codebase-agnostic, executable author gate specification. It is a closeout phase: it finishes the five items that phase 002 named as known limitations and left to a later phase, so nothing in the runner's own record stays deferred.

**Scope Boundary**: The layer probe, the dist adapter and the freshness library it calls, the workspace listing the scope and the guard share, the guard boundary, and the limitation list in the phase 002 implementation summary. It does not change the verdict schema, the exit codes, the built-in sensors, the added lines rule, the config layer, the doctrine, the consumers or the measurement.

**Dependencies**:
- `002-builtin-runner` (earlier phase, required). This phase edits `quality-gate.cjs`, `lib/run-check.cjs`, `assets/quality-defaults.json`, `references/runner-contract.md` and the test folder that phase created. It closes the items that phase left in `implementation-summary.md` Known Limitations 1, 3, 4 and 5, and points item 8 at phase 005.
- `003-config-and-doctor` (earlier phase, required, and not on the main branch yet). That phase adds the repository config, `--config`, the configured checks and the mutation guard around each configured spawn. This phase is written against the runner as that phase leaves it: the guard module is shared with the configured checks, so a change to the snapshot function is a change to both spawn paths. Its `decision-record.md` ADR-006 owns the guard's ownership split, and this phase keeps that split.
- `006-measurement` measures the final runner, so this phase lands before it. The 2-second budget this phase meets is the budget phase 006 gates on.
- `004-doctrine` and `005-consumers-and-routing` do not depend on this phase's output. Phase 005 owns the route file, so this phase changes no `ROUTER.md` entry.

**Deliverables**:
- The resolved-checker probe in `quality-gate.cjs`, and the `broken` definition for it in `references/runner-contract.md`.
- The read-only mode in `dist-freshness.cjs`, the per-file switch in `check-dist-staleness.sh`, the declared `generated` rows in `assets/quality-defaults.json`, and the snapshot that proves a run writes nothing beside a dist entry.
- The measured optimization of the workspace listing and the guard, with the baseline and the after numbers recorded by the same command.
- An ADR that settles the guard boundary with a measurement, and the boundary sentence in `runner-contract.md`.
- The corrected Known Limitations list in the phase 002 implementation summary.
- The version bumps and changelog entries this phase needs, and the packet changelog at `specs/sk-code/015-quality-agnostic-gate/changelog/changelog-015-008-runner-limit-closeout.md`.

**Changelog**:
- The packet changelog is written when this phase closes. Each changed skill takes its own changelog entry under its own `changelog/` folder, and the packet changelog names this phase folder so the change reads on its own.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The runner gives an honest verdict, but five items in its own record are unfinished. A pre-commit hook from another repository reads `present` even when the checker it names does not exist, so a layer the verdict calls installed may be unable to run. The dist adapter has never checked a real generated path, because the freshness library writes a cache record beside the dist entry and the workspace guard does not watch there. The 2-second budget is unmet: the phase 2 summary records 2.59 s to 3.14 s for 93 files here, and the 50-file scope of this phase measured 2.01 s to 2.28 s over five runs, mostly because three untracked-file listings in one run each walk the 114,500-path tree. The guard watches one repository, so a write to an ignored file or outside it goes unseen and nothing states that boundary. And the limitation list still describes all of this as open.

### Purpose
The runner closes its own gaps. One run over 50 changed files finishes under two seconds, a green pre-commit layer means a checker that exists and can run, a declared generated path is really checked with no write anywhere, the guard's boundary is written down with the measurement behind it, and the limitation list says what closed each item.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Resolve the checker path a pre-commit hook names, and report `present` only when that path is a regular executable file, otherwise `broken`.
- Give the dist freshness check a read-only mode, declare the generated paths this repository really has, and let a declared path reach the adapter.
- Prove with the fixture snapshot that a run writes nothing anywhere, the folder beside a dist entry included.
- Record the timing baseline with one command, reduce the workspace listings and the guard cost, and record the after numbers with the same command over five runs.
- Settle the guard boundary in an ADR with a measurement, and state the boundary exactly in `runner-contract.md`.
- Correct the phase 002 limitation list, and write the version bumps and changelog entries this phase needs.

### Out of Scope
- The verdict schema, the exit codes and the gate precedence. They stay `code-quality-run/v1` as phase 002 fixed them.
- The built-in sensors, the parse floor, the hygiene call and the added lines rule. No optimization may weaken a check, and none of these is rewritten here.
- The repository config, the configured checks and any other runner flag. Phase 003 owns them, and this phase only reads the runner it leaves behind.
- The Iron Law 3 text and the universal checklist scope. Phase 004 owns them.
- The route, the surface declarations and the envelope consumers. Phase 005 owns them.
- The benchmark report and the measured verdict for the whole program. Phase 006 owns them.
- Any install of a tool this phase needs. A missing tool gets a repair line, as `AGENTS.md` requires.

### Files to Change

| File Path | Change Type | Requirement | Description |
|-----------|-------------|-------------|-------------|
| `.skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs` | Edit | REQ-001, REQ-002, REQ-003, REQ-006 | `probePreCommit` resolves the checker its hook names, a declared generated path reaches the adapter, the scope and guard read one workspace listing, and a base-layer checklist row that carries a repository condition listens only inside the repository that owns the hub |
| `.skilled/skills/sk-code/sk-code-quality/scripts/lib/run-check.cjs` | Edit | REQ-003, REQ-004 | The snapshot reads one listing per guard, the untracked side is bounded to the scope, and the ignored watch the ADR decides |
| `.skilled/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs` | Edit | REQ-002 | A read-only mode that skips the cache record write, on the option, the CLI and the exports, with the default unchanged |
| `.skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh` | Edit | REQ-002 | The per-file mode passes the read-only switch, and `--all` and the session-start path keep their behavior |
| `.skilled/skills/sk-code/sk-code-quality/assets/quality-defaults.json` | Edit | REQ-002, REQ-006 | The `generated` rows for the dist entries this repository holds, and the repository condition on the spec-folder checklist row |
| `.skilled/skills/sk-code/sk-code-quality/references/runner-contract.md` | Edit | REQ-001, REQ-002, REQ-003, REQ-004, REQ-006 | The `broken` definition and the checker resolution rule, the read-only dist path, the listing count, the guard boundary, and the repository condition a base-layer checklist row may carry |
| `.skilled/skills/sk-code/sk-code-quality/scripts/tests/quality-gate.test.cjs` | Edit | REQ-001 to REQ-004, REQ-006 | The three probe cases, the read-only dist case, the declared-path fixture, the guard boundary cases, and the two checklist-scope fixtures |
| `.skilled/skills/sk-code/sk-code-quality/scripts/tests/fixtures.cjs` | Edit | REQ-002, REQ-004 | The snapshot records a modification time and takes extra roots, so a rewrite and an ignored write are both visible |
| `specs/sk-code/015-quality-agnostic-gate/008-runner-limit-closeout/decision-record.md` | Edit | REQ-004 | The guard boundary ADR, with the two measured numbers |
| `specs/sk-code/015-quality-agnostic-gate/002-builtin-runner/implementation-summary.md` | Edit | REQ-005 | Known Limitations items 1, 3, 4 and 5 say what closed each, item 8 names phase 005, and the continuity block moves |
| `.skilled/skills/sk-code/sk-code-quality/SKILL.md` | Edit | All | The layer-state wording where it names `broken`, the target map row that names the repository condition, and the version |
| `.skilled/skills/sk-code/SKILL.md`, `.skilled/skills/sk-code/description.json`, `.skilled/skills/sk-code/mode-registry.json`, `.skilled/skills/sk-code/hub-router.json` | Edit | All | The hub version, so every hub-root JSON routing file states one release |
| `.skilled/skills/system-spec-kit/SKILL.md` | Edit | REQ-002 | The skill version for the freshness library change |
| `.skilled/skills/sk-code/sk-code-quality/changelog/`, `.skilled/skills/sk-code/changelog/`, `.skilled/skills/system-spec-kit/changelog/` | Create | All | One entry per changed skill, at the version it lands with |
| `.skilled/skills/sk-code/README.md` | Edit | All | The newest-entry row names the new hub changelog, and the document version |
| `.hermes/skills/sk-code/SKILL.md`, `.hermes/skills/sk-code-quality/SKILL.md`, `.hermes/skills/system-spec-kit/SKILL.md` | Regenerate | All | `sync-skills-hermes.cjs` copies of the three edited `SKILL.md` files, never written by hand |
| `.skilled/skills/sk-code/leaf-manifest.json` | Regenerate | All | `generate-leaf-manifest.cjs --write`, only if a resource is added or removed |
| `specs/sk-code/015-quality-agnostic-gate/changelog/changelog-015-008-runner-limit-closeout.md` | Create | All | Packet changelog, written when the phase closes |
| `specs/sk-code/015-quality-agnostic-gate/spec.md` and the graph metadata of the parent and this phase | Edit, Regenerate | All | The parent phase map row, and the derived metadata from `repair-derived.cjs --apply` |
| `.github/workflows/sk-code-script-tests.yml` | Edit | REQ-002 | The runner tests job installs the spec-kit workspace before the runner tests, because the test file loads the dist freshness library, and the job triggers on that library, its shared workspace and the lockfile |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The pre-commit probe resolves the checker path the hook it reads names, against the repository that owns the hook and the source roots under it, and reports `present` only when the resolved path is a regular file with the execute bit. A hook that names the checker whose path is missing, is a directory or lacks the execute bit reports `broken`, the state `runner-contract.md` defines as installed but not runnable. A hook that names no checker stays `absent`, and a hook its trust gate would skip stays `untrusted`. Fixture cases cover a present checker, a missing checker and a non-executable checker. |
| REQ-002 | A dist freshness check runs with no write anywhere. The freshness library gains a read-only mode that skips its cache record write and keeps its verdict, and every existing caller keeps the writable default, so the session-start self-heal is unchanged. `assets/quality-defaults.json` declares the `generated` paths this repository really holds, and a declared path reaches the adapter even though the base layer excludes `**/dist/**`. The fixture snapshot covers the folders that hold the declared paths and fails when a run creates or rewrites a file beside a dist entry. |
| REQ-003 | The built-in checks finish under 2 seconds for 50 changed files in this repository, measured by one named command over five runs. The baseline is recorded with that command before any change and the after numbers with the same command after it. One run reads the workspace listing at most once for the scope and once per guard where the scope allows, and an untracked listing is bounded to what the scope reaches. No optimization weakens the read-only invariant, the guard or any check. |
| REQ-006 | The base layer lists `hub:system-spec-kit/references/workflows/spec-folder-authoring-checklist.md` only for a file inside the repository that owns the declaring hub. A `specs/` path resolves to no surface label on its own: this repository's `specs/sk-code/015-quality-agnostic-gate/spec.md` reads `unknown` today, so a condition on the file's label would drop this repository's own checklist as well. The condition is therefore the file's repository against the hub's repository. A foreign repository with a `specs/` folder lists no spec-folder checklist, because a framework-specific standard handed to an UNKNOWN surface claims an authority the runner cannot check. The quality-owned surface-neutral rows, the `.js` and `.css` checklists, keep matching by path alone. Two fixture cases cover it: F21 reads a foreign repository with a `specs/` folder and lists no spec-folder checklist, and F22 reads this repository's spec files and still lists it. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | A decision record settles, with a measurement recorded beside it, whether a bounded watch of ignored paths inside the scope is cheap enough to add or whether the target-repository boundary stands. `runner-contract.md` states the resulting boundary exactly, so a reader can tell what the guard does and does not see. |
| REQ-005 | Known Limitations items 1, 3, 4 and 5 of the phase 002 implementation summary say what closed each of them, and item 8 says phase 005 closes it. No other content in that file changes except its continuity block. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node --test --test-reporter=tap --test-name-pattern='^unit: layers' .skilled/skills/sk-code/sk-code-quality/scripts/tests/quality-gate.test.cjs` prints `# fail 0`, and its three probe cases read `present`, `broken` and `broken`.
- **SC-002**: On this repository, `node .skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs --files .skilled/skills/sk-code/sk-code-quality/scripts/lib/run-check.cjs --format json` prints `"pre_commit_hygiene": "present"` under `layers`, so the probe still reads this repository's own hook as installed.
- **SC-003**: `node --test --test-reporter=tap --test-name-pattern='^F20|^unit: dist' .skilled/skills/sk-code/sk-code-quality/scripts/tests/quality-gate.test.cjs` prints `# fail 0`, and the fixture snapshot covers every declared dist folder, so a cache write beside a dist entry fails the case.
- **SC-004**: The five-run timing command in `plan.md` section 4 step 3 prints five `real` lines, and each one reads under `2.00`.
- **SC-005**: `rg -n 'ignored' .skilled/skills/sk-code/sk-code-quality/references/runner-contract.md` prints the boundary sentence, and the packet's `decision-record.md` carries the ADR with the two numbers the measurement printed.
- **SC-006**: `rg -n 'closed by' specs/sk-code/015-quality-agnostic-gate/002-builtin-runner/implementation-summary.md` prints four lines for items 1, 3, 4 and 5, and `rg -n 'phase 005' specs/sk-code/015-quality-agnostic-gate/002-builtin-runner/implementation-summary.md` prints the line for item 8.
- **SC-007**: `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py --type spec` exits 0 for this file and for `plan.md`, and the packet's placeholder scan prints no line for either, so no template token survives in the two documents.
- **SC-008**: `node --test --test-reporter=tap .skilled/skills/sk-code/sk-code-quality/scripts/tests/*.test.cjs` prints `# fail 0` with every case from phases 002, 003 and 005 in it, so no optimization removed a check.
- **SC-009**: `node --test --test-reporter=tap --test-name-pattern='^F21|^F22' .skilled/skills/sk-code/sk-code-quality/scripts/tests/quality-gate.test.cjs` prints `# fail 0`, and a run over this repository's `spec.md` lists `spec-folder-authoring-checklist.md` while the same path in a foreign repository lists nothing.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `003-config-and-doctor` runner with `--config`, the configured checks and the guard around each of their spawns | The files this phase edits arrive in a shape this phase has not seen, and the guard change is shared | Start only after phase 003 lands. Re-read `quality-gate.cjs` and `run-check.cjs` at the landed tree before the first edit, and re-check every citation in this plan (section 8) |
| Dependency | The freshness library is `system-spec-kit`'s file, not this hub's | A behavior change there reaches every caller, the four session-start hooks included | Add an opt-in read-only mode and leave the default writable. Prove the default path in a case that keeps its cache write |
| Dependency | `python3` on PATH for the dist checker, the hygiene call and the parse floor | A missing `python3` makes the run UNVERIFIED, never clean | The runner already reports `SKIPPED_ABSENT` with exit 4. This phase does not change that path |
| Risk | A declared generated path lets a file under `dist/` into the checks | A compiled file could block a run on a parse or a comment rule | Only `dist-staleness` reads a declared generated path. The sensors and the parse floor keep skipping it, and a case proves the rest of the plan is unchanged |
| Risk | The timing number is machine specific | A slower machine misses the budget after the phase lands | Record the machine, the HEAD and five runs. Phase 006 measures the same command, so a change shows as a delta rather than as a claim |
| Risk | The bounded untracked listing misses a write the full one caught | The guard gets weaker while the budget gets better | Bound the listing to the scope's own folders and add a case where a check writes an untracked file inside the scope, which must still end the run with exit 3 |
| Risk | The ignored-path watch, if added, costs more on a bigger tree | The budget the phase just met is spent again | The ADR records the measured cost at both the folder bound and the whole tree, and the watch is added only when the bounded number is small |
| Risk | The read-only mode is forgotten by a later caller | A later path writes a cache record during a gate | The mode is a named option and a named switch, the contract states it, and the case fails if a run creates or rewrites a record |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: A run over 50 changed files finishes under 2 seconds on this machine, over five runs of one recorded command.
- **NFR-P02**: A 50-file `--files` run takes no whole-tree untracked listing, so its git cost is bounded by the scope it was given.

### Security
- **NFR-S01**: A run writes no file anywhere, beside a dist entry included, and the fixture snapshot proves it.
- **NFR-S02**: The read-only mode is opt-in. The freshness library's default and every existing caller keep the writable behavior the session-start self-heal depends on.

### Reliability
- **NFR-R01**: The guard still ends a run with exit 3 `CHECK_MUTATED_WORKSPACE` and the changed paths when a check writes inside the scope.
- **NFR-R02**: A layer probe that cannot resolve what its hook names reports `broken` or `unknown`, never `present`.

<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: no declared generated path in scope reads `dist-staleness` as `NOT_APPLICABLE`, and the run pays no adapter cost.
- Maximum length: 50 changed files is the measured scope. The 93-file working tree of the phase 2 record is reported beside it, not gated.
- Unresolvable name: a hook that names the checker through a shell variable, a relative path, an absolute path or a symlink. Each one resolves to a file or reads `broken`, never `present`.

### Error Scenarios
- Checker path missing, a directory, or without the execute bit: `broken`, with a repair line that names the path.
- Hook from another repository behind its trust gate: `untrusted`, unchanged from phase 002.
- Freshness check in read-only mode: the verdict is the same as a writable run, and no cache record appears.
- Git absent: the guard is unavailable, and the checks that need it report their own state. The named-file path keeps working.
- A check writes during the run: exit 3, the changed paths are named, and nothing is reverted.

### State Transitions
- Partial completion: a timed-out check leaves no file written, and the run reads UNVERIFIED.
- Session expiry: N/A. The runner keeps no state between runs.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | Eight source, asset and test files under two skills, one limitation list, one ADR and the version and changelog files |
| Risk | 16/25 | A shared guard module, a library another skill owns, a declaration that lets a compiled file into one check, and a budget measured by wall clock |
| Research | 7/20 | The five items are named by phase 002. This phase measures them, and the measurement of the ignored listing is already taken |
| **Total** | **37/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- No question blocks the phase. The read-only mode and the listing change are decided by their requirements, and the guard boundary is decided by REQ-004 with a measurement rather than by preference.
- Recorded, not open: a `specs/` path resolves to no surface label, measured on this repository, so REQ-006 reads the repository that owns the declaring hub rather than the file's label. A label-only condition would drop this repository's own checklist and fail the second fixture case.
- The versions are re-picked by the coordinator when this phase lands, because phase 003 moves the same two skills first. The rule is the next minor of each, and the changelog file names the number it lands with.
<!-- /ANCHOR:questions -->

---
