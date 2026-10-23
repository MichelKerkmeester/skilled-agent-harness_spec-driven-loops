---
title: "Decision Record: Phase 1: ignore-and-commit-guard"
description: "Five decisions that shape the private-skill guard: which roots it covers, how it enforces, what it matches, how it reads the index, and what recurring check the packet does not add."
trigger_phrases:
  - "ignore and commit guard decision record"
  - "private skill guard adr"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/013-private-surface-skills/001-ignore-and-commit-guard"
    last_updated_at: "2026-10-23T10:34:19Z"
    last_updated_by: "deepseek-v4.1-flash-1017"
    recent_action: "Wrote five decision records for the ignore rules and the guard"
    next_safe_action: "Execute tasks.md; amend an ADR only through a new decision record"
    blockers: []
    key_files:
      - ".gitignore"
      - ".skilled/scripts/git-hooks/pre-commit"
      - ".skilled/scripts/git-hooks/tests/pre-commit.test.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "planning-001-ignore-and-commit-guard"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Decision Record: Phase 1: ignore-and-commit-guard

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Guard eight skill roots, adding `.codex` and `.cursor`

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-23 |
| **Deciders** | The phase-1 planner, on the research synthesis in `../research/research.md` section 8 |

---

<!-- ANCHOR:adr-001-context -->
### Context

The earlier draft of this phase named six skill roots in the guard pattern: `.skilled`, `.opencode`, `.claude`, `.pi`, `.devin` and `.hermes`. The research synthesis found that `.codex` and `.cursor` are absent from that matrix, and that both are tracked runtime roots in this repository: `git ls-files .codex` returns 77 paths and `git ls-files .cursor` returns 81. Neither root carries a `skills/` child today, so the omission has no effect on this checkout - and that is exactly what makes it dangerous. A guard whose root matrix trails the runtime roots fails silently the first time someone creates `.cursor/skills`, and the failure is a published private skill, not a test failure.

The ignore layer has a related shape. `.opencode/skills`, `.claude/skills`, `.pi/skills` and `.devin/skills` are symlinks to `../.skilled/skills`, so a path beneath them cannot be staged at all and the `.skilled` rule already covers the real files. `.hermes/skills` is a real directory. `.codex/skills` and `.cursor/skills` do not exist yet and would be real directories if they did.

### Constraints

- The pattern is one bash constant, so each added root costs one alternation and no new code path.
- A false positive blocks every commit in the repository, so the added roots must not widen what the pattern matches inside an existing root.
- The ignore rules only matter for real directories; a rule for a path that does not exist is inert, not wrong.
- `git check-ignore` matches on the path string, so a rule for `.codex/skills/local-*` can be proven before the directory exists.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: guard all eight runtime roots in the pattern, and add ignore rules for `.codex/skills/local-*` and `.cursor/skills/local-*` alongside the two real-directory rules.

**How it works**: The pattern becomes `^\.(skilled|opencode|claude|pi|devin|hermes|codex|cursor)/skills/local-[^/]+(/|$)`. The hook matches a staged name against it regardless of whether the root exists. `.gitignore` carries four rules, one per real skill directory, so the default layer and the enforcement layer name the same eight roots.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Eight roots in the pattern and four ignore rules** | No gap when a root gains a `skills/` child; two extra lines of config; provable today | Two ignore rules are inert until their directory appears, which a reader may mistake for dead config | 9/10 |
| Six roots, with the absence frozen as an invariant and a proof command | Smallest diff; matches what exists today | The invariant has to be re-proven every time a runtime root changes, and the proof lives in a document rather than in the gate | 5/10 |
| Eight roots in the pattern, no ignore rules for the absent two | One fewer file section | `git add` would still stage a private skill under those roots, leaving only the hook to catch it; the default layer would disagree with the enforcement layer | 6/10 |
| Enumerate roots by listing directories at run time | Always current | Starts a directory scan on every commit, and a missing root silently disappears from the matrix - the same failure mode with more code | 3/10 |

**Why this one**: The guard's cost is one alternation per root and its failure mode is a published private skill, so the asymmetry favors covering a root that does not exist yet. The two added ignore rules are two lines, provable with `git check-ignore --no-index` today, and they keep the two layers naming the same set.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Adding `.cursor/skills` later cannot silently create an unguarded path; the guard already refuses it and the ignore rule already hides it.
- The harness case for eight roots fails visibly if someone trims the pattern back.

**What it costs**:
- Two ignore rules and two pattern alternations describe directories that do not exist in this checkout. Mitigation: the comment above the rules says they are real directories when they exist, and ADR-001 is the record a reader finds.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A reader deletes the two inert rules as dead config | M | The comment above them names the condition, and AC-001 fails if a rule is removed |
| A future root is added without updating the pattern | M | The matrix is listed in `plan.md` and pinned by the eight-root harness case; a new root still needs a deliberate edit |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Both roots are tracked (77 and 81 paths) and neither has a `skills/` child, so the gap is real but latent |
| 2 | **Beyond Local Maxima?** | PASS | Four options weighed, including a run-time directory scan |
| 3 | **Sufficient?** | PASS | One alternation per root and one rule per real directory; no new code path |
| 4 | **Fits Goal?** | PASS | The phase exists to make a private skill unstageable; a root outside the matrix defeats that |
| 5 | **Open Horizons?** | PASS | The pattern is the single place a future root is added, and the harness names each one |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `.gitignore`: a new section with four slash-less rules, replacing the header that introduces the nested-runtime-state section
- `.skilled/scripts/git-hooks/pre-commit`: the `PRIVATE_SKILL_RE` constant names eight roots
- `.skilled/scripts/git-hooks/tests/pre-commit.test.sh`: case 76 loops eight roots

**How to roll back**: `git checkout HEAD~1 -- .gitignore .skilled/scripts/git-hooks/pre-commit .skilled/scripts/git-hooks/tests/pre-commit.test.sh`, then re-run the harness; the six-root pattern returns with the rest of the phase.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Enforce with a blocking hook that has no bypass

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-23 |
| **Deciders** | The phase-1 planner |

---

<!-- ANCHOR:adr-002-context -->
### Context

The repository's pre-commit hook already carries a shared kill switch, a per-gate `lib/gates.tsv` registry, and a `SPECKIT_SKIP_*` variable for most gates. That design is right for gates whose false positives cost more than their misses: an operator who hits a bad mirror check needs a way through. A private-skill gate is the opposite. Its only purpose is to stop a path that must never be published, so a bypass is not an escape hatch - it is the defect the gate exists to prevent.

The alternative enforcement points are worse. A pre-push hook fires after the commit object exists, so the private content is already in local history. CI fires after the push, which is the publication the phase is trying to prevent. Only the pre-commit hook sees the index before the commit object exists.

### Constraints

- The guard must run before the comment-hygiene gate, which is the first gate that reads staged blobs.
- It must not add a `lib/gates.tsv` row, because a row is what makes a gate switchable.
- It must not read any `SPECKIT_SKIP_*` variable.
- It must fail closed when the index read fails, rather than treating an unreadable index as an empty one.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: a blocking pre-commit block with no bypass variable and no `lib/gates.tsv` row, inserted immediately before the comment-hygiene gate.

**How it works**: The block collects matching staged names, prints each one with its `git rm --cached -r -- "$PRIVATE_PATH"` repair, and exits 1. It sits after the trust block and the shared kill switch, so it inherits their documented behavior and adds no configuration of its own.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Blocking hook, no bypass, no registry row** | Fails closed; the gate cannot be switched off by accident or by config | An operator with a legitimate need has only `--no-verify`, which skips every gate | 9/10 |
| A `lib/gates.tsv` row plus `SPECKIT_SKIP_PRIVATE_SKILL=1` | Consistent with every other gate | The bypass becomes the shortest path past the only gate that must not have one | 3/10 |
| Pre-push only | Catches before publication to the remote | The private content is already committed locally and survives in history | 4/10 |
| CI-only check | No local friction | Runs after the push, which is the leak | 1/10 |

**Why this one**: The gate's failure mode is irreversible publication, and the repository's normal bypass design assumes a false positive that costs more than a miss. Neither assumption holds here.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- No git config key, environment variable or registry edit can disable the guard.
- A repository that stages no private path behaves exactly as before, so the gate has no ongoing cost.

**What it costs**:
- `git commit --no-verify` still skips every gate, including this one. Mitigation: recorded as a limit in `spec.md` and covered by the one-time fresh-clone sweep in phase 5.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A false positive blocks every commit | H | The pattern requires `local-` directly under `skills/`; AC-006 pins the boundary and the existing 111 checks stay green |
| An operator learns to use `--no-verify` routinely | H | The limit is documented rather than hidden; phase 5's sweep catches what the bypass publishes |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | No gate reads the staged index for a private path today |
| 2 | **Beyond Local Maxima?** | PASS | Four enforcement points weighed, including pre-push and CI |
| 3 | **Sufficient?** | PASS | One block, no new file, no configuration |
| 4 | **Fits Goal?** | PASS | The goal is that a private skill cannot be committed without a recorded bypass |
| 5 | **Open Horizons?** | PASS | The same shape can cover a future private path class by extending one constant |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `.skilled/scripts/git-hooks/pre-commit`: one block before the comment-hygiene gate, with `exit 1` on a match
- `.skilled/scripts/git-hooks/lib/gates.tsv`: unchanged, deliberately

**How to roll back**: `git checkout HEAD~1 -- .skilled/scripts/git-hooks/pre-commit`; the hook returns to its pre-phase content and the harness still passes because it removes only the new cases.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Match the staged path name, and record the renamed-copy limit

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-23 |
| **Deciders** | The phase-1 planner |

---

<!-- ANCHOR:adr-003-context -->
### Context

A guard can decide in two ways. It can look at the path, which is cheap, deterministic and needs no state. Or it can look at the content, which needs something to compare against: a manifest of private bytes, a hash list, or a marker. Any of those is itself a tracked artifact that describes the private content, and maintaining it is a second leak surface.

The path check has a known hole. A private skill copied to `.skilled/skills/private-copy/SKILL.md` does not match the pattern, so the guard passes it. That is not a bug to fix inside this phase; it is the boundary of what a name check can do.

### Constraints

- The guard may not read blobs; NFR-P02 says cost is linear in staged paths and names only.
- A content check would need a manifest that this phase would have to create, review and keep current.
- The harness must pin the limit with an exact exit code, not a comment.
- Phase 5 already plans a reachable-blob comparison, which is the right place for a content-level proof.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: match the staged path name only, pin the renamed-copy case as committable with exit code 0, and record the limit in `spec.md` and here.

**How it works**: The pattern tests the path string. Harness case 78 stages a private path and a copy under a non-local name, removes the private path from the index, and asserts the hook exits 0 and never mentions the gate. AC-011 requires that case plus the two `spec.md` mentions.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Costs | Score |
|--------|------|-------|-------|
| **Name match, limit recorded and pinned** | No state, no blob reads, no second leak surface; the boundary is tested | A renamed copy passes | 8/10 |
| Content hash list maintained in the repo | Catches a renamed copy | The list describes the private bytes and is itself tracked; every private edit needs a list update | 3/10 |
| Marker scan of staged blobs | No list to maintain | Needs a marker convention inside private files, and a fragment without the marker passes | 4/10 |
| No guard at all, rely on review | Zero cost | The leak is one `git add -f` away | 1/10 |

**Why this one**: A name check is the only option that adds no state and no second place where private content is described. The hole it leaves is narrow (someone must deliberately rename a copy into a tracked path) and phase 5 is already the place a content-level proof belongs.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- The guard has no state to keep current, so it cannot rot.
- The limit is a tested fact rather than an unstated assumption; case 78 fails if someone later makes the guard content-based without updating the record.

**What it costs**:
- A deliberate rename publishes content. Mitigation: ADR-003 and the spec's risk table say so, and phase 5 compares blobs.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A maintainer reads case 78 as a missing feature and "fixes" it with a content check | M | The case comment and this ADR name it as the boundary, not a gap |
| A copy lands in a path that happens to start with `local-` | L | The guard refuses it, because the name matches; only a non-local name passes |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Without a recorded boundary, the first reviewer reads case 78 as a bug |
| 2 | **Beyond Local Maxima?** | PASS | Four options weighed, including two content-based ones |
| 3 | **Sufficient?** | PASS | One constant and one harness case |
| 4 | **Fits Goal?** | PASS | The goal is to stop accidental publication; a deliberate rename is a different threat |
| 5 | **Open Horizons?** | PASS | Phase 5's blob comparison is the content-level answer, in the phase that owns verification |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- `.skilled/scripts/git-hooks/pre-commit`: the comment above the constant states the name-based limit
- `.skilled/scripts/git-hooks/tests/pre-commit.test.sh`: case 78 stages a renamed copy and expects exit 0
- `spec.md`: the Out of Scope list, the risk table and the edge cases name the limit

**How to roll back**: remove case 78 and the two sentences that record the limit; the guard itself does not change.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Keep the guard pure bash, NUL-separated and bash 3.2 compatible

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-23 |
| **Deciders** | The phase-1 planner |

---

<!-- ANCHOR:adr-004-context -->
### Context

The hook runs under `/bin/bash` 3.2 on macOS, and it runs on every commit in every repository on the machine. A guard that needs `node` or `python3` inherits their failure modes: a checkout with a broken runtime would skip the one check that must never skip. The hook already demonstrates the NUL-separated read in its comment-hygiene gate, so the pattern is proven in this file.

Two smaller choices ride along. The read uses `--diff-filter=ACMR`, which excludes `D`: the repair the guard prints is `git rm --cached -r`, which stages a deletion, and a guard that refused deletions would block its own fix. And the pattern is matched with `=~` against an unquoted variable, because a quoted pattern is a literal string in bash.

### Constraints

- No `node`, no `python3`, no network call.
- `set -euo pipefail` is already active in the hook, so an empty array must not trip `set -u`.
- A path with a space or non-ASCII bytes must be refused rather than skipped.
- The repair the guard prints must not itself be refused.
<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**We chose**: a pure-bash loop over `git diff --cached --name-only -z --diff-filter=ACMR`, an array length check, and `=~` against an unquoted pattern constant.

**How it works**: `while IFS= read -r -d ''` splits the NUL-separated names, the pattern test appends each match to `PRIVATE_STAGED`, and `${#PRIVATE_STAGED[@]}` decides whether to print and exit. Every construct was run under `/bin/bash` 3.2.57 before this plan was written.
<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Pure bash, NUL-separated, ACMR** | No runtime dependency; handles spaces and non-ASCII; the repair does not re-block | Slightly more verbose than a one-line `grep` | 9/10 |
| A `node` helper | Easier pattern code | A broken runtime skips the gate, which is the one outcome the phase cannot allow | 2/10 |
| `git diff --cached --name-only` without `-z` | Shorter | A path with a space arrives as two lines and can be skipped | 3/10 |
| `--diff-filter=ACMRD` | Also sees deletions | The printed repair stages a deletion and would block itself | 4/10 |

**Why this one**: The guard's value is that it runs when everything else is broken. A runtime dependency trades that away for a few lines of code.
<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**What improves**:
- The guard runs on a checkout whose Node or Python install is broken.
- The harness can prove a path with a space and a path with non-ASCII bytes without a helper.

**What it costs**:
- The loop is more verbose than a `grep` pipeline. Mitigation: the harness and the plan both pin the shape, so a later simplification that breaks NUL handling fails a case.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A later edit quotes the pattern variable | H | The comment says why it is unquoted, and case 74 fails if the pattern becomes a literal |
| A bash 4 idiom creeps in | H | The plan names the three constructs verified on 3.2, and the hook runs on 3.2 in this checkout |
<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | NFR-S02 forbids a `node` or `python3` dependency |
| 2 | **Beyond Local Maxima?** | PASS | Four shapes weighed, including a Node helper and two filter variants |
| 3 | **Sufficient?** | PASS | No new file, no new dependency, one loop |
| 4 | **Fits Goal?** | PASS | The gate must work on a broken checkout, which is when publication is most likely to slip through |
| 5 | **Open Horizons?** | PASS | The NUL-separated read is the hook's existing idiom, so the next gate can copy it |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-004-five-checks -->

---

<!-- ANCHOR:adr-004-impl -->
### Implementation

**What changes**:
- `.skilled/scripts/git-hooks/pre-commit`: the loop, the array and the pattern constant
- `.skilled/scripts/git-hooks/tests/pre-commit.test.sh`: cases 74, 76, 79 and 80 exercise the read against a path with a child, a nested file, a symlink and a gitlink

**How to roll back**: `git checkout HEAD~1 -- .skilled/scripts/git-hooks/pre-commit`; no other file depends on the loop.
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: Accept the absence of a recurring pre-push surface-token guard

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-23 |
| **Deciders** | The phase-1 planner, with the parent packet's phase-5 boundary |

---

<!-- ANCHOR:adr-005-context -->
### Context

This phase guards private paths. It does not guard the surface tokens (`WEBFLOW`, `OBSIDIAN`, `sk-code-webflow`, `sk-code-obsidian`) that phases 2 and 3 remove from tracked files. The only check that looks for those tokens after removal is phase 5's fresh-clone sweep, and that sweep runs once, at closure.

The research synthesis recorded the gap: no ongoing pre-push surface-token check exists. Once phase 5 closes, a later commit can reintroduce a token and nothing recurring will say so. The checks that do run on every change - CI's routing-registry drift and the trigger-index rebuild - do not scan for these tokens.

The alternative is to add a token check now. That check would need a token list, and the packet's D6 boundary deliberately keeps historical records (`changelog/`, `benchmark/reports/`, `specs/**/z_archive/`, the doctor-update playbooks) in the tree while excluding them from the sweep. A recurring check without that exclusion would fail on retained history; with it, the check carries a path allowlist that has to track every archive.

### Constraints

- This phase's scope is three files, and none of them is a token scanner.
- The D6 boundary is frozen; a new scanner would have to encode it.
- Phase 5 owns the verification of token absence.
- A recorded limit is acceptable only if a reader finds it without reading this ADR.
<!-- /ANCHOR:adr-005-context -->

---

<!-- ANCHOR:adr-005-decision -->
### Decision

**We chose**: record the absence as a maintenance limit in `spec.md` section 6 and here, rather than add a recurring token guard in this phase.

**How it works**: The risk table carries a `Maintenance limit` row that states the fresh-clone sweep is one-time, names the two recurring checks that exist, and says reopening it needs a new packet. Phase 5 remains the single place the token absence is proven.
<!-- /ANCHOR:adr-005-decision -->

---

<!-- ANCHOR:adr-005-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Record the limit, leave the check to a future packet** | Keeps this phase at three files; the D6 boundary stays in one place | A later commit can reintroduce a token unnoticed | 7/10 |
| Add a pre-push token guard now | Closes the gap permanently | Needs a token list and a D6 path allowlist; adds a fourth file to a phase whose scope is frozen at three | 4/10 |
| Add the check to CI | Runs on every push | Same allowlist problem, plus a CI change outside this phase | 4/10 |
| Say nothing | Smallest diff | The gap becomes an unstated assumption, which is the failure this packet exists to prevent | 1/10 |

**Why this one**: The packet already assigns token verification to phase 5, and a scanner built here would duplicate that ownership while carrying a frozen boundary into a new file. Recording the limit keeps the gap visible without pretending it is closed.
<!-- /ANCHOR:adr-005-alternatives -->

---

<!-- ANCHOR:adr-005-consequences -->
### Consequences

**What improves**:
- A reader of `spec.md` learns the sweep is one-time without opening the research synthesis.
- The phase stays at three code files, which keeps its scope proof exact.

**What it costs**:
- A reintroduced token is caught by review or by a future packet, not by a gate. Mitigation: the limit is named in the risk table and in AC-014, so it cannot be lost silently.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A later phase assumes a recurring check exists | M | The risk row says the opposite in the phase a reader is most likely to open |
| The limit is read as permission to skip the phase 5 sweep | M | AC-014 requires the sentence, and phase 5 owns the sweep as its closure gate |
<!-- /ANCHOR:adr-005-consequences -->

---

<!-- ANCHOR:adr-005-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Without the record, the gap is an unstated assumption after phase 5 closes |
| 2 | **Beyond Local Maxima?** | PASS | Four options weighed, including a pre-push guard and a CI job |
| 3 | **Sufficient?** | PASS | One risk row and this ADR; no code |
| 4 | **Fits Goal?** | PASS | The phase's goal is the private-path guard; token verification belongs to phase 5 |
| 5 | **Open Horizons?** | PASS | A future packet can add the recurring check with the D6 boundary already documented |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-005-five-checks -->

---

<!-- ANCHOR:adr-005-impl -->
### Implementation

**What changes**:
- `spec.md` section 6: one `Maintenance limit` risk row
- `spec.md` section 12: the limit is listed with the other recorded limits
- `acceptance-criteria.md` AC-014: a proof that the sentence is present

**How to roll back**: delete the risk row and the AC-014 proof line; no code changes, and no other document depends on them.
<!-- /ANCHOR:adr-005-impl -->
<!-- /ANCHOR:adr-005 -->

---
