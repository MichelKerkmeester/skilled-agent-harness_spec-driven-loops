---
title: "Decision Record: Crawlable Commit Grammar"
description: "The frozen commit grammar, identifier rule, stamping mechanics, retrofit mapping and repo-rule verdict, reconciled from the DeepSeek research and an Opus adversarial review, approved by the operator on 2026-09-11."
trigger_phrases:
  - "commit grammar decision"
  - "commit-id ordinal"
  - "spec trailer key"
  - "retrofit mapping cascade"
  - "git repo rule verdict"
importance_tier: "critical"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "sk-git/028-crawlable-commit-history/002-format-decision"
    last_updated_at: "2026-09-11T11:10:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Recorded operator approval of all five decisions"
    next_safe_action: "Open phase 003: hook whitelist and tests first, then the stamper and allocator"
    blockers: []
    key_files:
      - "../001-research/research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-11-skgit-028"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "ADR-001: repository-wide ordinal"
      - "ADR-003: re-mint on cherry-pick"
---
# Decision Record: Crawlable Commit Grammar

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

Two lenses fed this record. DeepSeek V4.1 Flash ran ten research iterations and proposed a grammar. An Opus reviewer was then briefed to break it, with the repository as the judge. Where they disagree, the repository decided. Evidence for every claim is in `../001-research/research/` and in the review transcript summarized under each decision.

---

<!-- ANCHOR:adr-001 -->
## ADR-001: The identifier is a repository-wide ordinal, and the packet lives in `Spec:`

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-11 |
| **Deciders** | Operator; conductor session |

---

<!-- ANCHOR:adr-001-context -->
### Context

The operator wants commits addressable "almost like spec folders with numbers". The research proposed `Commit-Id: sk-git-028-0003`, a packet-derived key. The review showed that `<track>-<number>` is not unique in this repository: 15 prefixes name two packets each, seven of them live against live (for example `system-skill-advisor/023-model-server-default-spawn` and `023-semantic-lane-enablement`). It also showed that three of the last five commits touch no packet at all and would fall into the `misc` namespace, which is one third of history. A key that is ambiguous for some commits and absent for a third of them is two schemes.

### Constraints

- The subject grammar `type(scope): summary` stays unchanged. The hook blocks a numeric scope and the skill forbids a packet scope.
- The identifier must be plain text in the final trailer paragraph, because that is the only place `git log --grep`, `%(trailers:key=...)` and GitHub search all read.
- Phases nest three deep in this repository (822 directories match `specs/*/NNN-*/NNN-*/NNN-*`), so any packet pointer must carry the full path.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: a repository-wide, zero-padded, seven-digit ordinal in `Commit-Id:`, and the full packet path in `Spec:`.

**How it works**: every commit ends with a contiguous trailer paragraph. `Spec: sk-git/028-crawlable-commit-history/002-format-decision` carries the packet path relative to `specs/`, nested phases included, and is omitted when the commit is not packet work. `Commit-Id: 0009113` is minted once per commit in commit order. `Refs:` carries external links only. `Phase:` is dropped because `Spec:` carries the full path. The retrofit assigns ordinals to the frozen history by topological order, and the allocator continues from the highest ordinal found in `git log --all --grep='^Commit-Id:'` at cold start, cached under the common Git directory and taken under the same lock `worktree-naming.sh` uses.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Repository-wide ordinal plus `Spec:` path** | Unique by construction, chronological, no fallback namespace, citations survive a future rewrite | Says nothing about the packet on its own; readers use `Spec:` for that | 8/10 |
| Packet-derived key `sk-git-028-0003` | Reads like the packet analogy | Collides on 15 existing prefixes, needs a `misc` namespace for a third of commits, one counter per packet with no replicated store | 4/10 |
| `Spec:` only, no identifier | Cheapest, answers the packet query | No rewrite-stable handle, no ordering, and the operator asked for a number | 5/10 |

**Why this one**: it is the only candidate that is unique for every commit in the repository today and needs one counter instead of hundreds.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- `git log -E --grep='^Spec: sk-git/028'` returns a packet's commits. Today the same question returns 2 of 9,112.
- A citation of `Commit-Id: 0009113` in a spec document survives the phase 005 rewrite and any later one, which the hash does not.
- One allocator, one namespace, no adjudication table.

**What it costs**:
- The ordinal is not memorable per packet. Mitigation: `Spec:` sits one line above it.
- Cold-start scan of the message history costs about 0.15 seconds. Mitigation: cached high-water under the common Git directory.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Two clones mint the same ordinal | M | The commit-msg hook refuses an id already present in `git log --all`, and the stamper re-mints |
| The 198 unique commits on 23 live branches have no id after the rewrite | M | Phase 005 stamps them at rebase time, in order, from the allocator |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The packet query returns 2 of 9,112 commits today |
| 2 | **Beyond Local Maxima?** | PASS | Three shapes scored, packet-derived key rejected on 15 collisions |
| 3 | **Sufficient?** | PASS | One counter, two keys, no fallback namespace |
| 4 | **Fits Goal?** | PASS | Numbered and searchable, the operator's two words |
| 5 | **Open Horizons?** | PASS | Survives future rewrites and nested phases |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- sk-git SKILL.md section 6 and the template asset define the two keys and the placement law
- A commit-id allocator beside `worktree-naming.sh`, with the same lock and a derived high-water mark

**How to roll back**: revert the skill and template edits; ordinals already stamped stay valid text and harm nothing.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: The hook whitelists the keys with a colon-only branch, and lands before the stamper

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-11 |
| **Deciders** | Operator; conductor session |

---

<!-- ANCHOR:adr-002-context -->
### Context

The hook's trailer whitelist decides what counts as explanatory body. Today `Spec:` and `Commit-Id:` are not on it, so a body made only of machine keys satisfies the gate that blocks a body-less commit when four or more paths are staged. The review confirmed this with a four-key body that exits 0. Once a stamper adds the keys to every commit, that gate dies unless the whitelist lands first. The review also showed that extending the existing alternation, which accepts a space after the key, would swallow prose such as `Spec folder was renamed during the wave`.

### Constraints

- The hook change is one line plus tests, but the order against the stamper is not optional.
- No test covers the hook's regexes today.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: add `Spec` and `Commit-Id` to the whitelist as a colon-only branch, ship the hook test suite with it, and land it one commit before the stamper.

**How it works**: the trailer regex gains `(Spec|Commit-Id):` as a separate branch that never matches the whitespace form. The hook also refuses a `Commit-Id:` value already present in history. A test file beside the hook covers the old grammar, the new keys, the prose look-alikes and the duplicate id.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Colon-only branch, hook before stamper** | Gate survives, prose stays prose | Two commits instead of one | 9/10 |
| Extend the existing alternation | One token change | Whitelists `Phase 2 ...` and `Spec folder ...` prose | 3/10 |
| Stamper and hook in one commit | One change | If the stamper reaches a machine before the hook, the body gate is dead there | 5/10 |

**Why this one**: the gate is the only thing that forces a human sentence into a large commit, and the review showed exactly how the naive change kills it.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- The four-path body gate keeps meaning human prose.
- The hook gets its first regression test.

**What it costs**:
- One more regex branch to read. Mitigation: a comment naming the prose case it excludes.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Hooks are installed machine-wide through the global hooks path, so the worktree edit does nothing until it reaches the main clone | M | Phase 003 verifies against the path `git rev-parse --git-path hooks` resolves |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Four-key body exits 0 today |
| 2 | **Beyond Local Maxima?** | PASS | Three orderings scored |
| 3 | **Sufficient?** | PASS | One branch, one test file |
| 4 | **Fits Goal?** | PASS | Enforcement is half the objective |
| 5 | **Open Horizons?** | PASS | New keys join the colon branch |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `.opencode/scripts/git-hooks/commit-msg` trailer regex and a duplicate-id check
- A new test beside it, run by the existing hook test runner

**How to roll back**: revert the hook commit; no stamped commit depends on it.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: The stamper forces a fresh paragraph, and a cherry-pick re-mints

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-11 |
| **Deciders** | Operator; conductor session |

---

<!-- ANCHOR:adr-003-context -->
### Context

The research recommended stamping through `git interpret-trailers`. The review ran it on the minimal legal body, `Context: short reason`, and got the id merged into that paragraph with no blank line, which turns `Context:` into a trailer. The placement law is right, the named tool alone is not enough. The review also measured copies: 210 distinct patch ids repeat within the last 2,000 commits, so about one commit in ten is a cherry-pick or an equivalent. An id that duplicates on copy stops being an address for that traffic.

### Constraints

- `prepare-commit-msg` receives the message source: `message`, `template`, `merge`, `squash` or `commit` with a SHA. A cherry-pick arrives as `commit` with `CHERRY_PICK_HEAD` present. An amend arrives as `commit` with `HEAD` as the SHA.
- The hook runs for every repository on the machine because of the global hooks path.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: a repository-aware `prepare-commit-msg` that inserts a blank line whenever the final line is trailer-shaped, then appends the keys; it preserves an existing id on amend and rebase, and strips and re-mints on cherry-pick.

**How it works**: the stamper checks the repository identity first and exits for any other repository. It reads the message source. On `commit` with `CHERRY_PICK_HEAD` it removes the copied `Commit-Id:` line and mints a new one. On `commit` with `HEAD` or under a rebase it keeps the id. On `message` or `template` it mints. Idempotence is a fixture test: stamping twice yields one id.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Re-mint on cherry-pick, detected by git's own source flag** | Every commit has a unique address, no patch-id heuristic | A cherry-pick loses its link to the original id | 8/10 |
| Accept duplicates | Nothing to detect | One commit in ten shares an address | 3/10 |
| Detect copies by `git patch-id` | Catches copies made outside cherry-pick | Must be right 210 times per 2,000 commits in a machine-wide hook | 5/10 |

**Why this one**: git already tells the hook when a commit is a copy, so the detection costs nothing and cannot misfire on an ordinary commit.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- Uniqueness holds for the copy traffic the review measured.
- The `Context:` body stays prose.

**What it costs**:
- A cherry-picked commit does not point back at its source. Mitigation: `git cherry-pick -x` already appends the source hash, and the citation remap keeps that line valid.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A copy made by patch apply or a squash keeps the old id | L | The commit-msg duplicate check refuses it and names the fix |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | 210 repeated patch ids in 2,000 commits |
| 2 | **Beyond Local Maxima?** | PASS | Three policies scored |
| 3 | **Sufficient?** | PASS | Uses git's source flag, no heuristic |
| 4 | **Fits Goal?** | PASS | Uniqueness is what makes an id an address |
| 5 | **Open Horizons?** | PASS | The duplicate check in the hook backs it |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- New `prepare-commit-msg` under `.opencode/scripts/git-hooks/`, registered in the installer
- Fixture tests: message, template, amend, rebase, cherry-pick, `Context:`-only body, double stamp

**How to roll back**: uninstall the hook symlink; existing ids stay valid.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: The retrofit mapping ignores rolling files and checks the scope against the track

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-11 |
| **Deciders** | Conductor session |

---

<!-- ANCHOR:adr-004-context -->
### Context

The research cascade assigns 4,250 commits to a packet because they touch exactly one. The review found real misassignments: commit `4951165d23` regenerates deep-loop contracts and touches one spec file, a rolling `goal.md` under a memory-decommission packet, so rule 3 files a deep-loop commit under system-speckit. Generated files such as `graph-metadata.json`, `description.json` and manifests under `activation/` behave the same way.

### Constraints

- Under ADR-001 the mapping only decides the `Spec:` value. The ordinal no longer depends on it, so a wrong mapping mislabels a commit but never breaks uniqueness.
<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**We chose**: keep the four-rule cascade, exclude rolling and generated spec files from the touch signal, require the commit scope to be consistent with the track before rule 3 fires, and measure the error rate on a random sample before the rewrite.

**How it works**: the mapping script drops `goal.md`, `graph-metadata.json`, `description.json` and anything under `activation/` from the touched-path set. Rule 3 applies only when the scope names the track, a skill under it, or is a generic scope such as `specs`. A sample of 100 mapped commits is judged by hand and the rate recorded in phase 005; above 5 percent the rule is tightened again.
<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Cascade with exclusions and a scope check** | Keeps the measured coverage, removes the known failure shape | Coverage drops for commits whose only touch was a rolling file | 8/10 |
| Cascade as researched | Highest coverage number | Reports 4,250 exact assignments with an unmeasured error rate | 4/10 |
| Trailer path only | Precise | 362 commits | 2/10 |

**Why this one**: it keeps the backbone and fixes the shape the review demonstrated with a real commit.
<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**What improves**:
- Commits stop being filed under packets they only brushed.

**What it costs**:
- Some commits lose their only signal and get no `Spec:`. Mitigation: no `Spec:` is honest, and the ordinal still addresses them.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The sample judge is the same model that wrote the cascade | L | The sample is judged by the conductor, not the lineage |
<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Real misassignment shown on `4951165d23` |
| 2 | **Beyond Local Maxima?** | PASS | Three variants scored |
| 3 | **Sufficient?** | PASS | Exclusion list and one consistency check |
| 4 | **Fits Goal?** | PASS | A wrong `Spec:` defeats the packet query |
| 5 | **Open Horizons?** | PASS | Error rate is measured, not assumed |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-004-five-checks -->

---

<!-- ANCHOR:adr-004-impl -->
### Implementation

**What changes**:
- The phase 005 mapping script and its sample report

**How to roll back**: the map is a file; regenerate it with different rules before the rewrite runs.
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: No new repo rule; one paragraph in the delegation rule and one row in AGENTS.md

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-11 |
| **Deciders** | Operator; conductor session |

---

<!-- ANCHOR:adr-005-context -->
### Context

The operator asked whether the git discipline needs a repo rule wired into `REPO RULES.md` and `AGENTS.md`. `REPO RULES.md` section 4 keeps mechanics out of rule files on purpose: which command, which flag and which hook belong to the skills. The commit grammar and the identifier are mechanics and belong to sk-git, where the hook enforces them. `blast-radius.md` already governs force-push and history rewrite at tier 3. The one gap this packet exposed is posture, not mechanics: the conductor edited the repository while a fan-out lineage was live, and the runner reverted the edits and failed the run. `delegation-and-orchestration.md` section 2 binds the delegate's write authority and says nothing about the orchestrator's own writes during the run.

### Constraints

- `REPO RULES.md` precedence: a rule file may tighten `AGENTS.md`, never relax it.
- Revising an existing rule routes through sk-doc's create-repo-rule mode, which owns create, revise and retire.
<!-- /ANCHOR:adr-005-context -->

---

<!-- ANCHOR:adr-005-decision -->
### Decision

**We chose**: no new rule file. Phase 006 adds one paragraph to `delegation-and-orchestration.md` section 2 ("while a lineage runs, the repository is frozen for you as well") and one row to the `AGENTS.md` section 5 Git Workspace Safety table pointing commit identity at sk-git.

**How it works**: the paragraph names the failure (a containment revert of the orchestrator's own edits) and the rule (no repository write outside the lineage until the run settles). The `AGENTS.md` row says every commit carries the sk-git trailer block and identifier, that the commit-msg hook enforces it, and that sk-git owns the grammar.
<!-- /ANCHOR:adr-005-decision -->

---

<!-- ANCHOR:adr-005-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Tighten the existing delegation rule, one AGENTS.md row** | Fixes the observed gap where it lives, no new file | Nothing named "git rule" exists for a reader to find | 8/10 |
| New `repo-rules/git-discipline.md` | Findable by name | Would restate sk-git mechanics, which section 4 forbids, or blast-radius posture, which exists | 4/10 |
| Nothing | Zero cost | The containment failure repeats for the next orchestrator | 2/10 |

**Why this one**: the router's own scope statement says mechanics stay in skills, and the only posture gap fits an existing rule.
<!-- /ANCHOR:adr-005-alternatives -->

---

<!-- ANCHOR:adr-005-consequences -->
### Consequences

**What improves**:
- The next orchestrator reads the freeze rule before dispatching.
- `AGENTS.md` names commit identity beside branch naming, so both halves of git identity route to sk-git.

**What it costs**:
- One rule file grows by a paragraph. Mitigation: it is the rule that already fires on every dispatch.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The paragraph reads as mechanics and gets pulled by a later scope audit | L | It states posture only and points at the runner for the mechanism |
<!-- /ANCHOR:adr-005-consequences -->

---

<!-- ANCHOR:adr-005-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The failure happened in this packet |
| 2 | **Beyond Local Maxima?** | PASS | New file and nothing both scored |
| 3 | **Sufficient?** | PASS | One paragraph, one row |
| 4 | **Fits Goal?** | PASS | Parent decision D8 asked for exactly this verdict |
| 5 | **Open Horizons?** | PASS | Both edits sit where readers already look |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-005-five-checks -->

---

<!-- ANCHOR:adr-005-impl -->
### Implementation

**What changes**:
- `repo-rules/delegation-and-orchestration.md` section 2, through sk-doc create-repo-rule revise
- `AGENTS.md` section 5 Git Workspace Safety, one row

**How to roll back**: revert the two edits; nothing depends on them at runtime.
<!-- /ANCHOR:adr-005-impl -->
<!-- /ANCHOR:adr-005 -->

---

## OPERATOR APPROVAL

| Decision | Operator answer | Date |
|----------|-----------------|------|
| ADR-001 identifier shape | Approved: repository-wide ordinal, Spec: carries the full packet path | 2026-09-11 |
| ADR-002 hook whitelist and order | Approved as written | 2026-09-11 |
| ADR-003 stamper and cherry-pick policy | Approved: re-mint on cherry-pick | 2026-09-11 |
| ADR-004 retrofit mapping | Approved as written | 2026-09-11 |
| ADR-005 repo rule verdict | Approved as written | 2026-09-11 |
