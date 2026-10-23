---
title: "Decision Record: Phase 2: hub-surface-removal"
description: "The six decisions that shape the hub surface removal: what leaves the tracked tree, which files stay hand-owned, what the scenario families do, what the keep-list holds, where the closure boundary sits, and which generated data waits for CI."
trigger_phrases:
  - "hub surface removal decision record"
  - "architecture decision"
  - "decision rationale"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "specs/sk-code/013-private-surface-skills/002-hub-surface-removal"
    last_updated_at: "2026-10-23T12:40:00Z"
    last_updated_by: "deepseek-v4.1-flash-1017"
    recent_action: "Wrote the six phase decisions with their alternatives and consequences"
    next_safe_action: "Run the tasks in tasks.md; change a decision here first if one no longer holds"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "acceptance-criteria.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "deepseek-v4.1-flash-1017-002-planning"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Decision Record: Phase 2: hub-surface-removal

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Delete the two surface packets here; stand them up as private skills in phase 4

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-23 |
| **Deciders** | The packet's planner, working from the research synthesis at `../research/research.md` |

---

<!-- ANCHOR:adr-001-context -->
### Context

The shipped `sk-code` hub carries two surface packets, `sk-code-webflow` (161 tracked files, 1.5M) and `sk-code-obsidian` (65 tracked files, 504K), that exist for the operator alone. They ship in the public repo, feed the committed trigger index and the advisor's tracked graph, get mirrored into `.hermes/skills/`, and widen the hub's routing vocabulary for every adopter.

### Constraints

- The removed content must stay reachable: the operator still uses both stacks, and phase 4 recreates them under `.skilled/skills/local-webflow/` and `.skilled/skills/local-obsidian/`.
- Phase 001 must land first, because its root ignore rules and pre-commit guard are what keep a later private copy out of the index.
- Git history is out of scope. A history rewrite is an operator decision after phase 5.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: remove both packets from the tracked tree with `git rm -r`, leaving the content reachable at `42b41dd286`, and let phase 4 rebuild them as ignored symlinked private skills.

**How it works**: `git rm -r` records the deletion in the index, so the files survive in history and `git checkout 42b41dd286 -- <path>` restores any of them. Every registry, router, manifest and consumer that named the packets is stripped in the same phase, so the tracked tree never advertises a packet it does not ship.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Delete here, recreate privately in phase 4** | One phase owns every tracked removal; the public tree is clean at the phase boundary; the private copy lands only after the guard exists | The content is unavailable in the worktree between phase 2 and phase 4 | 9/10 |
| Move both packets into `.skilled/skills/local-*` in this phase | No window without the content | Writes private bytes before the advisor's scan changes land, and mixes two phases' rollback | 4/10 |
| Keep both packets and hide them from the advisor | No deletion risk | They still ship, still feed the trigger index, and still widen routing vocabulary for adopters | 1/10 |

**Why this one**: the parent decomposition already assigns the private copies to phase 4, and the guard from phase 001 must exist before those bytes do. Deleting here keeps each phase's rollback to one commit.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The public hub ships 226 fewer files, 2.0M smaller, and its trigger index stops indexing two stacks an adopter never asked for.
- The hub's surface vocabulary drops to one surface, so a generic frontend prompt no longer wins a routing tie against this framework's own code.

**What it costs**:
- The worktree has no Webflow or Obsidian content until phase 4 runs. Mitigation: every task's rollback restores from `42b41dd286`, and the phase lands as one commit, so `git revert` restores the whole prior state.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A consumer outside the phase's inventory still names a packet | M | AC-007's phase-wide grep, plus the doc-claims and router-sync guards, name every survivor |
| The deleted folders are restored by a later merge from a stale branch | M | The phase lands on `main` as one commit before phase 3 starts; a merge that reintroduces them fails AC-001 |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The packets ship to every adopter today and feed the committed trigger index; the research audit confirms both. |
| 2 | **Beyond Local Maxima?** | PASS | Three options were scored: delete here, move here, or hide. Only the first keeps the guard-before-bytes order. |
| 3 | **Sufficient?** | PASS | One `git rm -r` plus the consumer edits; no new abstraction. |
| 4 | **Fits Goal?** | PASS | It is the phase's stated purpose. |
| 5 | **Open Horizons?** | PASS | Phase 4 restores the operator's capability inside ignored paths. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `.skilled/skills/sk-code/sk-code-webflow/` and `.skilled/skills/sk-code/sk-code-obsidian/` leave the index in T004.
- Every registry, router, manifest, document, fixture and test that named them is edited in T005 through T095.

**How to roll back**: `git revert --no-edit <phase-commit-sha>`, or before the commit exists, `git checkout 42b41dd286 -- .skilled/skills/sk-code/sk-code-webflow .skilled/skills/sk-code/sk-code-obsidian` plus `git checkout 42b41dd286 -- <any edited path>`.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Hand-edit the two files no generator owns

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-23 |
| **Deciders** | The packet's planner |

---

<!-- ANCHOR:adr-002-context -->
### Context

Most hub artifacts have a generator: `generate-leaf-manifest.cjs` writes `leaf-manifest.json`, `regenerate-skill-derived.cjs` prunes `graph-metadata.json`'s derived fields, `test_readme_manifest.py --write` writes the durable directory manifest, `sync-skills-hermes.cjs` writes the Hermes copies, and the pre-commit hook re-mints the compiled-routing manifest. Two files have no generator: `ROUTER.md`, whose section 11 is a hand-maintained Python-literal projection, and the `causal_summary` field of `graph-metadata.json`.

### Constraints

- REQ-003 forbids hand-editing a generated file.
- `verify-router-sync.cjs` parses `ROUTER.md` section 11 and fails when a key is left with an empty path list.
- `regenerate-skill-derived.cjs` preserves `domains`, `intent_signals` and `derived`, so those fields stay hand-owned after it runs.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: edit `ROUTER.md` and the `causal_summary` by hand, and run the generator for every other artifact.

**How it works**: `ROUTER.md` is edited one section at a time in T015 through T026, and each edit is followed by a section-scoped grep that proves the section is clean. `graph-metadata.json` is regenerated first in T087, then its preserved fields are edited in T088 through T092.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Hand-edit the two files, generate the rest** | Respects which files have a source of truth; the guard proves the hand edit parses | Two files carry hand edits a later regeneration could overwrite | 9/10 |
| Write a generator for `ROUTER.md` section 11 | Removes the hand edit | A new script is new scope, and the projection is deliberately hand-tuned prose plus data | 3/10 |
| Hand-edit every artifact | One editing style | `leaf-manifest.json` and the Hermes copies would drift from their sources and the next run would reintroduce the surfaces | 1/10 |

**Why this one**: a generator is the source of truth for the files it writes, and `ROUTER.md` has none. Adding one is a separate change with its own tests.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- The generated files cannot drift: each is rewritten by the same command that writes it in CI.
- The hand-owned projection is proved by the guard that already reads it.

**What it costs**:
- A future regeneration of `graph-metadata.json` rewrites `causal_summary` only when the generator owns it; the field is preserved, so the hand edit survives. Mitigation: T087 runs before the hand edits, not after.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A hand edit to `ROUTER.md` leaves a key with an empty path list | H | T025 deletes each emptied key, and AC-005 runs `verify-router-sync.cjs` |
| The generator is run after a hand edit and overwrites it | M | T087 is ordered before T088 to T092, and the execution rules forbid reordering |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | No generator exists for either file, and the phase must remove their surface content. |
| 2 | **Beyond Local Maxima?** | PASS | Three options were scored, including writing a new generator. |
| 3 | **Sufficient?** | PASS | Two files, edited in place, proved by existing guards. |
| 4 | **Fits Goal?** | PASS | REQ-003 and REQ-004 state exactly this split. |
| 5 | **Open Horizons?** | PASS | A future generator can take over `ROUTER.md` without changing this decision's outcome. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `ROUTER.md` sections 1, 2, 3, 4, 5, 7, 8, 9, 10, 11 and the closing prose are edited in T015 through T026.
- `graph-metadata.json` is regenerated in T087 and hand-edited in T088 through T092.

**How to roll back**: `git checkout 42b41dd286 -- .skilled/skills/sk-code/ROUTER.md .skilled/skills/sk-code/graph-metadata.json`.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: The Motion.dev scenario families leave with the overlay

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-23 |
| **Deciders** | The packet's planner |

---

<!-- ANCHOR:adr-003-context -->
### Context

Three playbook directories, `cross-stack-routing/` (7 files), `motion-dev-and-animation-regression/` (4 files) and `cross-browser-and-performance-gates/` (3 files), test Motion.dev integration. Every expected reference and asset in those files lives under `sk-code-webflow/references/animation/` or `sk-code-webflow/assets/animation/`, which leaves the hub with the Webflow packet. `spec.md` already records that the Motion.dev overlay leaves the public hub.

### Constraints

- A playbook scenario's pass criterion names exact reference paths, and `verify-router-sync.cjs` leg 4 fails when a scenario expects a path the router does not emit.
- The phase writes no new guidance, so a rewritten scenario cannot invent replacement references.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: delete all fourteen scenario files with the overlay, and prune their rows, sections and cross-references from the playbook index.

**How it works**: T046, T047 and T048 remove the three directories; T053 removes their index sections, rows and totals. The remaining playbook keeps 17 scenarios, all of which assert a route the one-surface hub still emits.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Delete the three families** | No scenario expects a path that no longer ships; the index stays truthful | The hub loses its Motion.dev test coverage, which moves to the private skill with the overlay | 9/10 |
| Rewrite each scenario against SKILLED references | Keeps scenario count | Invents expectations the router does not emit, and writes new guidance the phase forbids | 2/10 |
| Keep the files and exclude them from the router guard | Preserves the text | The guard would need weakening, and the files would still advertise a surface the hub no longer ships | 1/10 |

**Why this one**: a scenario that cannot pass is worse than no scenario. The private skill in phase 4 can carry these cases beside the overlay they measure.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- Every surviving playbook scenario passes leg 4 of `verify-router-sync.cjs`.
- The playbook index matches the files on disk, so a reader is not sent to a deleted page.

**What it costs**:
- Motion.dev integration loses its public test coverage. Mitigation: the overlay and these scenarios move to the private Webflow skill in phase 4, and phase 5's local routing probes cover the private route.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A deleted scenario was the only coverage of a behaviour the hub still has | M | The remaining 17 scenarios cover SKILLED detection, language sub-detection, routing disambiguation, design restraint, tooling hooks, plugins and doctor commands |
| An index row survives its file | H | T053 deletes by line range and AC-007's grep plus a link check catch a stale row |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Each file's pass criterion names a path under the removed packet. |
| 2 | **Beyond Local Maxima?** | PASS | Rewrite and exclude options were scored and rejected on evidence. |
| 3 | **Sufficient?** | PASS | Three `git rm -r` calls plus one index edit. |
| 4 | **Fits Goal?** | PASS | Removing example-authored scenarios is in the phase's In Scope list. |
| 5 | **Open Horizons?** | PASS | The coverage returns with the private skill. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- Three playbook directories are deleted in T046, T047 and T048.
- `manual-testing-playbook.md` loses three sections, nine rows, four prose lines and its cross-reference rows in T053.

**How to roll back**: `git checkout 42b41dd286 -- .skilled/skills/sk-code/manual-testing-playbook`.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Keep the comment-hygiene tag vocabulary and the dated records

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-23 |
| **Deciders** | The packet's planner, following the parent packet's D6 decision |

---

<!-- ANCHOR:adr-004-context -->
### Context

The closure proof searches the hub for `WEBFLOW` and `OBSIDIAN`. Four lines survive that search by design, and deleting them would break a gate rather than remove a surface.

### Constraints

- `check-comment-hygiene.sh` allows a `WEBFLOW:` prefix on a code comment because it names a durable platform. The allowed-token list is the rule, not a surface reference.
- `manual-testing-playbook/tooling-and-hooks/comment-hygiene-hook.md` documents that list twice, once in the rule and once in the failure triage.
- `shared/references/universal/code-style-guide.md` line 151 carries `WEBFLOW:` beside `MOTION:` and `LENIS:` as the same tag rule.
- `changelog/`, `.skilled/changelog/` and `benchmark/reports/` record past releases and past runs. Rewriting them would falsify history.
<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**We chose**: keep the four tag-vocabulary lines and every dated record byte-identical, and state both in the closure proof so a reader can tell a kept record from a leak.

**How it works**: AC-007 expects exactly four token lines in exactly three files, and AC-011 proves the dated records are byte-identical to `42b41dd286`. Every other file in the hub and its consumers is expected to reach zero.
<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Conclusion |
|--------|------|------------|
| **Keep the four lines and the dated records** | The comment-hygiene gate keeps working and history stays true | Chosen |
| Rename the tag to `PLATFORM:` everywhere | No surface token anywhere | Rejected: it changes a hook contract and every existing comment that uses the tag, which is outside this phase |
| Delete the tag lines | A clean grep | Rejected: it breaks the allowed-token list and the two documents that explain it |

**Why this one**: the tag names a platform in a comment, not a surface the hub ships. The distinction is what the allowlist already encodes.
<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**What improves**:
- The comment-hygiene gate keeps accepting a durable platform tag.
- A reader can tell a kept historical record from a live surface reference, because AC-007 names the four lines and AC-011 names the record globs.

**What it costs**:
- The phase-wide grep never reaches a literal zero. Mitigation: the expected count is four, and a fifth line fails the criterion.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A new surface reference hides among the four kept lines | M | The expected count is exact, and AC-007 also lists the three files by name |
| A kept record is edited by a later task | M | AC-011 diffs the record globs against the base commit |
<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Without the keep-list the comment-hygiene gate fails on its own rule text. |
| 2 | **Beyond Local Maxima?** | PASS | Rename and delete options were considered. |
| 3 | **Sufficient?** | PASS | Four lines and a set of globs, no new mechanism. |
| 4 | **Fits Goal?** | PASS | The parent packet's D6 decision fixes this boundary. |
| 5 | **Open Horizons?** | PASS | A future rename is a separate change with its own tests. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-004-five-checks -->

---

<!-- ANCHOR:adr-004-impl -->
### Implementation

**What changes**:
- Nothing in the four kept lines or the dated records.
- AC-007 and AC-011 encode the boundary.

**How to roll back**: not applicable; no edit is made to a kept line.
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: The closure boundary is the two greps, not every mixed-case word

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-23 |
| **Deciders** | The packet's planner |

---

<!-- ANCHOR:adr-005-context -->
### Context

The phase's closure is defined by two searches: the packet names `sk-code-webflow` and `sk-code-obsidian`, and the uppercase surface tokens `WEBFLOW` and `OBSIDIAN`. Three families fall outside that boundary and the phase leaves them alone:

- `benchmark/fixtures/sk-code/sk-code-loadspeed-001.private.json` and `sk-code-motion-002.private.json` carry a lowercase `references/webflow/` path prefix in their notes, which explains a past scoring decision.
- `sk-code-skilled/assets/scripts/verify-doc-claims.cjs` line 38 holds a `code-(?:webflow|opencode)` regex whose job is to detect the old names.
- `sk-code-quality/manual-testing-playbook/quality-gate/quality-checklist.md` says "Webflow-only standard" in prose about which checklist a prompt resolves to, and names no packet and no uppercase token.

### Constraints

- Scope is frozen in `spec.md`. Editing a benchmark fixture rewrites a recorded measurement; editing the detector removes the detector.
- The three families match neither closure pattern, so no criterion is weakened by leaving them.
<!-- /ANCHOR:adr-005-context -->

---

<!-- ANCHOR:adr-005-decision -->
### Decision

**We chose**: leave the three families unchanged, and record them here and in the closure statement rather than widening the grep.

**How it works**: AC-007 runs the two patterns the phase owns. AC-011 proves the benchmark records are untouched. The closure statement names the three survivors so a reader does not mistake them for an omission.
<!-- /ANCHOR:adr-005-decision -->

---

<!-- ANCHOR:adr-005-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Leave them and record the boundary** | Keeps history and the detector intact; the closure stays checkable | Three lowercase mentions survive | 8/10 |
| Rewrite the benchmark notes and the playbook prose | No mention survives | Falsifies a recorded measurement and edits a file outside the phase's file list | 3/10 |
| Delete the detector regex | One fewer match | Removes the check that finds the retired names | 1/10 |

**Why this one**: the phase removes a surface from the shipped hub, not every English word that names a stack. The boundary is stated, not silently narrowed.
<!-- /ANCHOR:adr-005-alternatives -->

---

<!-- ANCHOR:adr-005-consequences -->
### Consequences

**What improves**:
- The closure stays exactly checkable, with no judgment call at the end.
- A recorded benchmark measurement stays true.

**What it costs**:
- A reader who greps case-insensitively still finds three mentions. Mitigation: the closure statement names them, and ADR-005 explains why each stays.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A reviewer reads the survivors as an incomplete removal | M | The closure statement names all three, and phase 5's broader sweep can revisit them |
<!-- /ANCHOR:adr-005-consequences -->

---

<!-- ANCHOR:adr-005-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Without the boundary the phase either falsifies history or leaves an unstated gap. |
| 2 | **Beyond Local Maxima?** | PASS | Rewrite and delete options were scored. |
| 3 | **Sufficient?** | PASS | A recorded boundary, no new mechanism. |
| 4 | **Fits Goal?** | PASS | It keeps the phase inside its frozen scope. |
| 5 | **Open Horizons?** | PASS | Phase 5 can widen the sweep with its own evidence. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-005-five-checks -->

---

<!-- ANCHOR:adr-005-impl -->
### Implementation

**What changes**:
- Nothing in the three families.
- The closure statement in `acceptance-criteria.md` names them.

**How to roll back**: not applicable; no edit is made.
<!-- /ANCHOR:adr-005-impl -->
<!-- /ANCHOR:adr-005 -->

---

<!-- ANCHOR:adr-006 -->
## ADR-006: Generated data comes from its generator, and the retrieval index waits for CI

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-23 |
| **Deciders** | The packet's planner, following the CI workflow that rebuilds the index |

---

<!-- ANCHOR:adr-006-context -->
### Context

Five artifacts have a generator inside the repository: `leaf-manifest.json`, the skill-derived fields of `graph-metadata.json`, the durable directory manifest, the Hermes copies and the compiled-routing activation manifest. Four more are regenerated by the `.github/workflows/trigger-index-rebuild.yml` workflow after a push: `runtime/data/trigger-index.json` and the three retrieval fixtures under `runtime/cli/retrieval/fixtures/`. The trigger index holds 200 matching path entries today, 131 under `.skilled/` and 69 under `specs/sk-code/007-sk-code-obsidian-surface/`.

### Constraints

- A hand edit to a generated file drifts from its source and the next run reintroduces the removed surfaces.
- `specs` is a corpus root, so the 69 retained `007-sk-code-obsidian-surface/` paths survive the rebuild. A post-rebuild zero count over the whole index would fail on an audit folder, not on a leak.
- Phase 5 owns the rebuild proof and the throwaway database.
<!-- /ANCHOR:adr-006-context -->

---

<!-- ANCHOR:adr-006-decision -->
### Decision

**We chose**: run each in-repository generator, never hand-edit its output, and leave the four CI-generated retrieval artifacts to CI. The phase handoff excludes both retrieval paths, and phase 5 proves their post-rebuild count.

**How it works**: T014, T087, T093 and T094 run their generators. T108 commits with the hooks installed, so the compiled-routing manifest is re-minted and copied to its authored twin. No task writes `runtime/data/trigger-index.json` or the three fixtures, and no criterion counts them.
<!-- /ANCHOR:adr-006-decision -->

---

<!-- ANCHOR:adr-006-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Generate in-repo, leave retrieval data to CI** | Every generated file matches its source; the handoff does not wait on a bot | The index keeps surface hits until CI runs | 9/10 |
| Rebuild the trigger index here by hand | A clean index at the phase boundary | The rebuild is CI's, needs a full corpus pass, and phase 5 already owns the proof | 3/10 |
| Hand-edit the generated manifests | No generator run | The next regeneration reintroduces the surfaces, and the diff is not reproducible | 1/10 |

**Why this one**: a generated file is only true when its generator wrote it. The index rebuild is a CI step with its own workflow, and duplicating it here would give two sources of truth.
<!-- /ANCHOR:adr-006-alternatives -->

---

<!-- ANCHOR:adr-006-consequences -->
### Consequences

**What improves**:
- Every regenerated file is reproducible: running the same generator twice produces no diff.
- The phase handoff does not wait on a bot run.

**What it costs**:
- The committed trigger index still names the removed surfaces until the workflow runs after the push. Mitigation: the handoff grep excludes the two paths, and phase 5 proves the post-rebuild count.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| CI fails after the push and the index keeps the surface hits | M | Phase 5 owns the rebuild proof and reports a failed run |
| A developer reruns the drift scripts locally and they see an ignored `local-*` root | L | Phase 5 owns that drift check; phase 4 creates both symlinked private skills |
<!-- /ANCHOR:adr-006-consequences -->

---

<!-- ANCHOR:adr-006-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | REQ-003 forbids hand-editing a generated file. |
| 2 | **Beyond Local Maxima?** | PASS | A local rebuild was scored and rejected on ownership. |
| 3 | **Sufficient?** | PASS | Four generator runs and one hook-driven re-mint. |
| 4 | **Fits Goal?** | PASS | It is the phase's stated generated-artifact rule. |
| 5 | **Open Horizons?** | PASS | The same rule holds for every future routing change. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-006-five-checks -->

---

<!-- ANCHOR:adr-006-impl -->
### Implementation

**What changes**:
- `leaf-manifest.json` (T014), `graph-metadata.json` (T087), the durable directory manifest (T094) and the Hermes copies (T093) are regenerated.
- The compiled-routing manifest is re-minted by the hook during T108.

**How to roll back**: `git checkout 42b41dd286 -- <path>` restores any generated file, and the next generator run reproduces it.
<!-- /ANCHOR:adr-006-impl -->
<!-- /ANCHOR:adr-006 -->

---
