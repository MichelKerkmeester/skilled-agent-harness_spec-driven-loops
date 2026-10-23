---
title: "Decision Record: Phase 5: leak-and-routing-verification"
description: "Six decisions that fix how this phase proves the surface removal: what the authority is, how the retained population is scoped, how private bytes are proven absent, where routing is probed, how history is treated and how the commits are ordered."
trigger_phrases:
  - "leak and routing verification decisions"
  - "surface verification adr"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/013-private-surface-skills/005-leak-and-routing-verification"
    last_updated_at: "2026-10-23T13:50:00Z"
    last_updated_by: "deepseek-v4.1-flash-1017"
    recent_action: "Recorded six accepted decisions for the verification phase"
    next_safe_action: "Execute tasks.md against these decisions; re-measure the allowlist if the 007 packet moves"
    blockers: []
    key_files:
      - "spec.md"
      - "acceptance-criteria.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "planning-005-leak-and-routing-verification"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Do the three drift scripts pass once both private roots exist? Recorded in 13-drift.md, not decided here."
      - "Does the operator want a history rewrite after this phase? ADR-005 leaves it open."
    answered_questions: []
---
# Decision Record: Phase 5: leak-and-routing-verification

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Verify the public remote, not the working tree

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-23 |
| **Deciders** | Packet author, phase 005 planner |

---

<!-- ANCHOR:adr-001-context -->
### Context

The question this phase answers is whether the two surfaces left the artifact other people receive. A working-tree sweep answers a different question: it reads the same disk the pre-commit guard already polices, and the guard is bypassable with `git commit --no-verify`. It also cannot see what a consumer gets, because the committed trigger index is rebuilt by CI after the push and the gitignored private skills are invisible to `git ls-files` in either location.

### Constraints

- The pre-commit guard can be bypassed with `--no-verify`, so a local pass is not evidence about `main`.
- The four retrieval artifacts change only after CI runs on the pushed commit, so a pre-push read is stale by construction.
- The private skills must never enter the clone, so the check has to read them from the operator disk and compare identities rather than copy them.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: treat a fresh `git clone --no-local` of `origin/main` as the authority for every path, content, blob and artifact check.

**How it works**: the packet's planning commit is already on `origin/main`, so the phase pushes only its evidence commits, clones the public URL into `/tmp/psurf-clone-main`, and runs every sweep there. The operator checkout supplies only what the clone cannot: the private files to hash and the routing probes that need them on disk.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Fresh clone of the public remote** | Reads what a consumer receives; independent of the hook; sees the CI-rebuilt artifacts | Needs a push before verification, so the phase publishes three commits | 9/10 |
| Working-tree sweep | No push needed; instant | Same disk as the guard; stale artifacts; cannot see the served tree | 3/10 |
| CI-only gate | Runs on the real commit | Checks nothing about surface tokens today, and reports after the push either way | 4/10 |
| Source archive download | No git history needed | No history for the D6 diff, and no reachable-blob set for the identity check | 5/10 |

**Why this one**: it is the only option that reads the artifact a consumer receives and still has the history the D6 audit and the blob comparison need.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Every pass is a statement about `origin/main`, not about a developer's disk.
- The D6 audit and the blob comparison both get a history to read.

**What it costs**:
- The phase must push before it can verify, which is why C1 exists. Mitigation: C1 carries one evidence document only, so a bad C1 is a documentation revert.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The clone reads a tip older than the push | M | Compare `git -C "$CLONE" rev-parse HEAD` with the pushed sha and record both |
| A network failure blocks the phase | L | Record the failure and stop; no local fallback claims the same ground |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The packet's purpose is proof about the public artifact; a local sweep cannot supply it |
| 2 | **Beyond Local Maxima?** | PASS | Four options weighed, including an archive download |
| 3 | **Sufficient?** | PASS | One clone plus one operator checkout covers both populations |
| 4 | **Fits Goal?** | PASS | Directly on the critical path: steps 2 through 6 and 14 |
| 5 | **Open Horizons?** | PASS | The same clone can be re-read by a later audit without a new mechanism |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `plan.md` step 2: clone into `/tmp/psurf-clone-main` and record the sha.
- `tasks.md` T008 through T010: clone, identity, first sweep.

**How to roll back**: delete the clone (`rm -rf /tmp/psurf-clone-main`); no tracked file changes.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Scope the artifact zero check and allowlist the retained 007 paths

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-23 |
| **Deciders** | Packet author, phase 005 planner |

---

<!-- ANCHOR:adr-002-context -->
### Context

The committed trigger index carries 200 matching lines at `42b41dd286`: 131 are `.skilled/` paths under the two surface folders phase 002 deletes, and 69 are `specs/sk-code/007-sk-code-obsidian-surface/` paths that stay. The 69 survive because `specs` is a corpus root (`corpus.mjs:31`) and the packet's folder name carries the token. A whole-file zero check therefore fails on retained audit specifications, and the failure says nothing about a live routing source. The same measurement repeated on the four artifacts gives 200 index lines, 260 manifest lines, 60 diagnostics lines and 59 variant lines, all from the same two populations.

### Constraints

- `specs` is a corpus root by design; changing that is a retrieval behavior change outside this packet.
- The 007 packet is a D6 retained record; deleting or renaming it is out of scope.
- The phrase index adds a second population: 59 space-normalized keys, of which 38 come from retained packet documents and 21 from the deleted surface folders.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: scope the zero check to `.skilled/` paths in all four artifacts, count the 69 retained 007 paths against an allowlist written out in full, and count the retained phrase keys against a measured baseline of 38 while asserting zero for the four bare skill ids.

**How it works**: each artifact gets two numbers, a live-source count that must be `0` and a retained count that must equal its measured value. A path outside both populations is a third count that must also be `0`, so a new leak cannot hide inside the allowlist.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Scoped zero plus explicit allowlist** | Passes on a real condition; separates live from retained | Two numbers per artifact to keep true | 9/10 |
| Whole-file zero | One number, simple | Fails on 69 retained audit paths, so it can never pass and would be waived | 2/10 |
| Delete or rename the 007 folder | Makes a whole-file zero possible | Destroys a retained record; out of scope | 2/10 |
| Drop `specs` from the corpus roots | Makes a whole-file zero possible | Changes retrieval behavior for every packet | 1/10 |

**Why this one**: it keeps the check able to fail on a real leak while stating exactly what it does not cover.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- A live leak still fails the check, which a waived whole-file zero would not.
- The retained population is visible by name and count instead of being an unexplained residue.

**What it costs**:
- The allowlist is a measurement, not a constant: if the 007 packet gains or loses documents, 69 changes. Mitigation: the count is re-measured in the same task that asserts it, and a mismatch is a stop condition.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A leak hides inside the allowlisted prefix | H | The third count excludes both populations and must be `0`, and the allowlist prefix is a full path prefix, not a substring |
| The retained count drifts after an unrelated packet edit | M | The task stops on a count that differs from 69 and records the new value instead of adjusting the check |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | A whole-file zero cannot pass on the measured corpus |
| 2 | **Beyond Local Maxima?** | PASS | Four options weighed, including corpus changes |
| 3 | **Sufficient?** | PASS | Three counts per artifact cover live, retained and unclassified |
| 4 | **Fits Goal?** | PASS | REQ-003 and AC-003 depend on it |
| 5 | **Open Horizons?** | PASS | The allowlist is a measurement that a later audit can re-derive |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `plan.md` step 6: the scoped grep, the allowlist count and the phrase counts.
- `acceptance-criteria.md` AC-003: the eight expected values.

**How to roll back**: revert the plan and criteria text; no artifact is modified by the check.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Prove private bytes absent by blob identity, and partial content by markers

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-23 |
| **Deciders** | Packet author, phase 005 planner |

---

<!-- ANCHOR:adr-003-context -->
### Context

The packet's sweeps search for four names and two uppercase tokens. A private file copied to a differently named tracked path, with the markers stripped, passes all of them. The packet therefore proves marker absence, not byte absence, and says so nowhere. Two populations need different treatment: a complete file has an identity, and a fragment does not.

### Constraints

- NFR-S01 forbids copying private file bodies into the evidence.
- `git hash-object --no-filters` computes a blob id from content alone, so it works on an ignored file.
- A zero-byte file hashes to the empty blob, which every repository contains.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: hash every complete file under the two private roots, classify the ids against the removal commit before comparing them with the clone, record the ids that were already public in history, and assert only that new or changed content is absent. Partial content is covered by the marker and token sweeps instead.

**How it works**: `git hash-object --no-filters` over the 228 files produces the private id set; `git ls-tree -r 42b41dd286` over the two archived packets produces the 223-id base set. `comm -12` splits the private ids into the ones the base set already carries, which are recorded as already public in history and feed the history-rewrite decision, and the new or changed rest once the three hub references copied from `shared/references/` are set aside. `git cat-file --batch-all-objects --batch-check` over the clone produces every reachable blob id, and `comm -12` between that dump and the new-or-changed set must be empty. The same intersection with the whole private set must be at least one, which proves the comparison can detect a match; a zero there means the object dump is empty rather than clean.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Blob identity plus a stated marker policy** | Detects a renamed copy; publishes ids only | Blind to a fragment; needs a reachable-blob set | 9/10 |
| Marker sweeps only | Cheap; already written | A renamed copy evades them | 4/10 |
| Byte-for-byte comparison of every file | Same coverage as blob identity | Reads private bodies into the evidence, against NFR-S01 | 6/10 |
| Tree checksum | One number | Says nothing about which file matches what | 3/10 |

**Why this one**: it adds the identity proof without moving a private byte into a tracked file.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- A private file renamed into a tracked path now fails the phase.
- The evidence can publish the private blob ids with no content.

**What it costs**:
- The check excludes zero-byte files and cannot see a fragment. Mitigation: both limits are written into `03-fresh-clone-leak.md` section F rather than left implicit.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| An empty file produces a false match | M | Exclude `-size +0c` and state why |
| The reachable-blob set is expensive on a large history | L | Measured at 586715 blobs and a few seconds on the planning machine |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Marker searches cannot prove arbitrary byte absence |
| 2 | **Beyond Local Maxima?** | PASS | Four options weighed, including a full byte comparison |
| 3 | **Sufficient?** | PASS | Complete files by identity, fragments by markers, both stated |
| 4 | **Fits Goal?** | PASS | REQ-002 and AC-002 name it |
| 5 | **Open Horizons?** | PASS | The same id set can be re-derived by any later audit |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- `plan.md` step 3 section E and section F.
- `tasks.md` T014 and T015.

**How to roll back**: delete `/tmp/psurf-private-blob-ids.txt` and `/tmp/psurf-public-blob-ids.txt`; no tracked file changes.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Probe routing in both consumer checkouts

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-23 |
| **Deciders** | Packet author, phase 005 planner |

---

<!-- ANCHOR:adr-004-context -->
### Context

Two checkouts route work through this hub. The operator checkout holds the private skills. The Obsidian Plugin checkout at `/Users/michelkerkmeester/MEGA/Development/Obsidian Plugin` symlinks `.claude`, `.codex`, `.cursor`, `.devin`, `.hermes`, `.opencode`, `.pi` and `.skilled` back into the same tree, which the surface README documents at line 75 and the hub's own stack-detection guide at line 67. The writer worktree holds neither private skill, so a probe there returns a hub skill and proves nothing.

### Constraints

- The private skills are gitignored and exist on one disk, so a probe must run where they are.
- The plugin checkout's path is an operator-machine fact, not a tracked one, so the phase must locate it and stop if it is gone.
- A probe result depends on a fresh graph, because the daemon can serve a cached one.
<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**We chose**: run the three probes in the operator checkout and the same three in the plugin checkout, after rebuilding the graph in the first and reading the plugin's symlink targets before trusting its results.

**How it works**: the operator run proves the intended split for the primary consumer. The plugin run proves the same split holds for a repository that reaches the hub only through symlinks, which is the case a hub-local test never covers.
<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Both checkouts plus the symlink check** | Covers the primary and the external consumer | Depends on two operator paths | 9/10 |
| Operator checkout only | One dependency | Leaves the documented second consumer unmeasured | 5/10 |
| Writer worktree | Always present | No private skill on disk, so every probe returns a hub skill | 1/10 |
| A synthetic fixture graph | Reproducible anywhere | Does not exercise the real scan or the real symlinks | 4/10 |

**Why this one**: the second consumer is the one whose behavior a hub-local test cannot see, and it is already documented as real.
<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**What improves**:
- A routing regression in either consumer is visible in one phase.
- The plugin dependency is recorded as a measured fact rather than a README claim.

**What it costs**:
- Two machine paths must exist. Mitigation: the locate task records the search output and stops before the three plugin probes, leaving AC-005 partly `Unmet` instead of silently skipping.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The plugin checkout moves | M | Locate first, stop if absent, record the search output |
| The plugin's symlinks point elsewhere | M | Compare each `readlink` target against the hub path before probing |
| A cached graph returns the pre-phase answer | M | Rebuild with `--force true` in the operator checkout and quote `skillCount` |
<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The plugin checkout is a documented live consumer |
| 2 | **Beyond Local Maxima?** | PASS | Four options weighed, including a fixture graph |
| 3 | **Sufficient?** | PASS | Two checkouts plus a symlink check cover both routes |
| 4 | **Fits Goal?** | PASS | REQ-005 and AC-005 name it |
| 5 | **Open Horizons?** | PASS | A third consumer can be added with the same three probes |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-004-five-checks -->

---

<!-- ANCHOR:adr-004-impl -->
### Implementation

**What changes**:
- `plan.md` step 7: the locate command, the symlink loop and six probes.
- `tasks.md` T027 through T037.

**How to roll back**: rebuild the operator graph (`advisor_rebuild --force true`); the probes write no file outside the evidence directory.
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: Inventory history and tags read-only, and leave every rewrite to the operator

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-23 |
| **Deciders** | Packet author, phase 005 planner |

---

<!-- ANCHOR:adr-005-context -->
### Context

The removal commit preserves its parents, so every removed file stays reachable: 1814 reachable objects still carry an old path. Any of the 164 tags that points at an older tree preserves another copy, and a release archive built from such a tag preserves a third. None of that is measured today, and a reader who sees "removed" may assume the content is gone.

### Constraints

- Rewriting history changes every commit sha, which breaks 164 tags and every citation in `specs/`.
- A force push is irreversible for anyone who already fetched.
- The packet's scope excludes git history by the parent spec.
<!-- /ANCHOR:adr-005-context -->

---

<!-- ANCHOR:adr-005-decision -->
### Decision

**We chose**: measure what remains reachable and publish the counts, and leave every rewrite to a separate operator decision.

**How it works**: `git rev-list --objects --all` counts reachable objects with an old path; a per-tag `git ls-tree` counts what each tag retains; `gh release list` and `gh release view` list the hosted assets. The evidence records the numbers and states that no rewrite ran.
<!-- /ANCHOR:adr-005-decision -->

---

<!-- ANCHOR:adr-005-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Read-only inventory** | States the real exposure; changes nothing | Leaves the content reachable | 8/10 |
| `filter-repo` inside this phase | Removes the content | Rewrites every sha, breaks 164 tags and every spec citation | 1/10 |
| Squash and force push | Removes the content | Same breakage, plus a lost history | 1/10 |
| Say nothing | No work | A reader assumes a scrub that never happened | 2/10 |

**Why this one**: the packet's job is to tell the truth about exposure, and a rewrite is a separate decision with a blast radius no verification phase should take on.
<!-- /ANCHOR:adr-005-alternatives -->

---

<!-- ANCHOR:adr-005-consequences -->
### Consequences

**What improves**:
- The exposure is a number instead of an assumption.
- A later rewrite starts from a measured inventory.

**What it costs**:
- The content stays reachable. Mitigation: `12-history-inventory.md` and `implementation-summary.md` state it as a limit next to the claim it bounds.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A tag retains a full pre-removal tree | M | The per-tag count names every tag with a non-zero count |
| A release asset is a built archive nobody inspected | M | `gh release view` lists every asset; an archive is recorded as unmeasured content, not as clean |
<!-- /ANCHOR:adr-005-consequences -->

---

<!-- ANCHOR:adr-005-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The exposure is real and currently unmeasured |
| 2 | **Beyond Local Maxima?** | PASS | Four options weighed, two of them destructive |
| 3 | **Sufficient?** | PASS | Counts plus per-tag mapping plus release assets |
| 4 | **Fits Goal?** | PASS | REQ-013 and AC-013 name it |
| 5 | **Open Horizons?** | PASS | An operator rewrite can reuse the same inventory |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-005-five-checks -->

---

<!-- ANCHOR:adr-005-impl -->
### Implementation

**What changes**:
- `plan.md` step 10: four read-only commands.
- `tasks.md` T041 through T043.

**How to roll back**: delete `/tmp/psurf-tag-old-paths.txt`; no tracked file and no ref changes.
<!-- /ANCHOR:adr-005-impl -->
<!-- /ANCHOR:adr-005 -->

---

<!-- ANCHOR:adr-006 -->
## ADR-006: Publish three commits and report each push's CI result in the handoff

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-23 |
| **Deciders** | Packet author, phase 005 planner |

---

<!-- ANCHOR:adr-006-context -->
### Context

A commit cannot contain the CI result of the push that creates it. It also cannot contain a verification of the tip that push produces, because that tip includes a bot commit written after the push. The phase needs a clone tip to verify, then needs to commit what it found, then needs to verify the tip that commit produced. Two commits leave the last of those unrecorded.

### Constraints

- The evidence must be committed, or a later reader cannot re-run a check.
- The CI result of the final push cannot be committed by definition.
- Appending a CI block after a push leaves the tree dirty and the evidence uncommitted.
<!-- /ANCHOR:adr-006-context -->

---

<!-- ANCHOR:adr-006-decision -->
### Decision

**We chose**: publish three commits - C1 head sweep, C2 evidence and closed packet, C3 final-tip verification - and report each push's CI runs and the post-push artifact counts in the phase handoff message.

**How it works**: C1 gives the clone a tip. C2 carries the remaining fourteen evidence files and the closed packet. C3 carries `11-final-tip.md`, written after C2's push and its bot rebuild. The handoff names every push's run ids and head sha, plus the counts observed on the tip after C3.
<!-- /ANCHOR:adr-006-decision -->

---

<!-- ANCHOR:adr-006-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Three commits plus a handoff report** | Every observable state is committed except the last push | Three pushes and three rebuilds | 8/10 |
| One commit | Fewest pushes | The evidence does not exist when the clone is made, so nothing is verifiable | 2/10 |
| Two commits | One fewer push | The post-C2 tip is never verified, which is the gap this phase exists to close | 5/10 |
| Append CI output to `09-ci.md` after the push | One file holds everything | Leaves the tree dirty and the evidence uncommitted | 1/10 |

**Why this one**: it commits everything a reader can re-run and states the one thing no commit can hold.
<!-- /ANCHOR:adr-006-alternatives -->

---

<!-- ANCHOR:adr-006-consequences -->
### Consequences

**What improves**:
- The tip that carries the evidence is itself verified and that verification is committed.
- The handoff is the single place a reader looks for the last mile.

**What it costs**:
- Three pushes, each followed by a rebuild. Mitigation: the CI poll ceiling is 30 minutes per wait, and the phase is a one-sitting job otherwise.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A red run on C3's push | M | Reported in the handoff and left `Unmet` for REQ-007; never hidden by a re-push |
| A reader misses the handoff | L | `09-ci.md` and `implementation-summary.md` both name it as the place the last runs live |
<!-- /ANCHOR:adr-006-consequences -->

---

<!-- ANCHOR:adr-006-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The amendment requires a rerun after the evidence push and its rebuild |
| 2 | **Beyond Local Maxima?** | PASS | Four options weighed |
| 3 | **Sufficient?** | PASS | Three commits cover every state a commit can hold |
| 4 | **Fits Goal?** | PASS | REQ-015 and AC-015 name it |
| 5 | **Open Horizons?** | PASS | The handoff pattern extends to any later verification pass |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-006-five-checks -->

---

<!-- ANCHOR:adr-006-impl -->
### Implementation

**What changes**:
- `plan.md` "Commit and push" and step 14.
- `tasks.md` T057 through T068.

**How to roll back**: `git revert --no-edit $(git log --format=%H --grep='Surface-Verification-Phase: 005' origin/main)`, which selects the three phase commits by their body trailer.
<!-- /ANCHOR:adr-006-impl -->
<!-- /ANCHOR:adr-006 -->

---
