---
title: "Decision Record: Template-driven, repo-agnostic enforcement of commit messages and PR descriptions"
description: "Four decisions: the template carries the contract, one Node validator serves every gate, 100% enforcement means a required server-side check, and three hook verdicts change on purpose."
trigger_phrases:
  - "message contract decision record"
  - "template carries the contract"
  - "required ci message check"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-git/032-template-driven-message-enforcement"
    last_updated_at: "2026-10-01T17:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Accepted ADR-001 to ADR-003 as built; added ADR-004"
    next_safe_action: "Operator answers spec.md open questions and accepts or amends the ADRs"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-git-032-template-driven-message-enforcement"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Decision Record: Template-driven, repo-agnostic enforcement of commit messages and PR descriptions

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: The template carries the contract

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-01 |
| **Deciders** | Operator |

---

<!-- ANCHOR:adr-001-context -->
### Context

The commit standard is written as prose in the template and again as regexes in the bash hook. Editing the template changes nothing that is enforced, and another repository cannot supply its own standard without editing a shared hook.

### Constraints

- The contract must cover every rule the current hook enforces, including the search-optimized `Spec:` and `Commit-Id:` trailers and the attribution ban
- A user edits one file, the template, to change their standard
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Embed one fenced `json` contract block under an "Enforced rules" heading in the body of `commit-message-template.md` and `pr-template.md`, not in the frontmatter; the prose explains it and the validator reads it. The operator chose this placement on 2026-10-01.

**How it works**: Each rule has a stable id, a severity and its data (pattern, list, limit). A drift test ties the self-check bullets to the rule ids so prose and contract cannot diverge silently.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Contract block in the template** | One file to edit; prose and rules sit together | Markdown parsing step; a broken block blocks commits | 9/10 |
| Separate `commit-contract.json` beside the template | Plain JSON, easy to load | Two files to keep in sync, the drift this packet removes | 6/10 |
| Keep rules in the hook, parameterized by env | Smallest change | Not editable through the template; not repo-agnostic | 3/10 |

**Why this one**: The user asked that editing the template changes the enforced format, and only this option makes the template the source.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Editing the template is the whole change for a new standard
- Prose and enforcement cannot drift without the drift test failing

**What it costs**:
- A malformed block blocks every commit. Mitigation: schema-validate on load and print the file and error.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Contract misses a rule the bash hook enforced | H | Parity run over every existing hook test case before the swap |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Requested by the operator; current enforcement drifts and is bypassable |
| 2 | **Beyond Local Maxima?** | PASS | Alternatives scored above |
| 3 | **Sufficient?** | PASS | Smallest option that meets the stated requirement |
| 4 | **Fits Goal?** | PASS | On the critical path in `plan.md` |
| 5 | **Open Horizons?** | PASS | Works for any repository's template |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `assets/commit-message-template.md` and `assets/pr-template.md` gain contract blocks
- `scripts/lib/message-contract.schema.json` defines the block shape

**How to roll back**: Remove the blocks and restore the previous `commit-msg` with `git revert`; the old hook needs no contract.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: One Node validator serves every enforcement point

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-01 |
| **Deciders** | Operator |

---

<!-- ANCHOR:adr-002-context -->
### Context

Four places need the same verdict: `commit-msg`, `pre-push`, the agent PreToolUse gate and CI. Copying rules into each recreates the drift problem, and bash cannot parse a JSON contract cleanly.

### Constraints

- Node is already required by the spec-kit hooks on committing machines
- CI runners have Node available
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: Write `message-contract.mjs` plus the `validate-message.mjs` CLI and make every enforcement point a thin adapter over it.

**How it works**: Adapters pass a message file, a commit range or a PR body to the CLI and translate its exit code or JSON into the block signal of their runtime.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **One Node module + CLI** | Single source of verdicts; testable as pure functions | Node becomes a hard dependency of `commit-msg` | 9/10 |
| Bash validator with `jq` | No Node | Regex and JSON handling in bash is fragile; `jq` not guaranteed | 4/10 |
| commitlint | Established tool | No `Spec:` existence or `Commit-Id` uniqueness rules without plugins; config is not the template | 5/10 |

**Why this one**: It is the only option where a rule exists once and every layer agrees by construction.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- Parity and unit tests run against one module
- Adding a rule is a contract edit plus a rule implementation, never four edits

**What it costs**:
- `commit-msg` fails closed when Node is missing. Mitigation: the shim prints an install hint.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Validator crash blocks commits | M | Fail closed with the stack location; parity tests before the swap; revert the hook file to unblock |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Requested by the operator; current enforcement drifts and is bypassable |
| 2 | **Beyond Local Maxima?** | PASS | Alternatives scored above |
| 3 | **Sufficient?** | PASS | Smallest option that meets the stated requirement |
| 4 | **Fits Goal?** | PASS | On the critical path in `plan.md` |
| 5 | **Open Horizons?** | PASS | Works for any repository's template |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- New `scripts/lib/message-contract.mjs` and `scripts/validate-message.mjs`
- `commit-msg` and `pre-push` become shims

**How to roll back**: Restore the previous `commit-msg` and `pre-push` from git and re-run `install-git-hooks.sh`.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: "100% enforced" means a required server-side check

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-01 |
| **Deciders** | Operator |

---

<!-- ANCHOR:adr-003-context -->
### Context

The operator asked for certainty that no misaligned commit message or PR description gets through. Every local hook can be skipped with `--no-verify`, a bypass variable or a machine without the hooks. GitHub has no pre-receive hooks for this repository.

### Constraints

- Branch protection and rulesets are owner settings outside the repository files
- Local hooks remain valuable for fast feedback
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: Treat the CI `message-contract` check, made required by a ruleset on protected branches, as the guarantee, with local hooks as early feedback.

**How it works**: The workflow validates every commit in the pushed range and the PR body. With the ruleset requiring it, nothing that fails can merge or be pushed to a protected branch. `pre-push` and CI report any locally skipped check.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Required CI check + local hooks** | Unbypassable on protected branches; fast local feedback | Needs the owner to enable the ruleset | 9/10 |
| Local hooks only, bypass removed | No GitHub setup | Still bypassable with `--no-verify` or a fresh clone | 3/10 |

**Why this one**: It is the only layer a local user cannot skip, which is what "100%" requires.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- A guarantee that holds for every contributor and every machine
- Local hooks still catch problems before a push

**What it costs**:
- Unprotected branches are only checked, not blocked. Mitigation: document the ruleset and report its absence in `--explain`.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Ruleset never enabled | H | The packet closes only with the ruleset setting documented and confirmed by the owner |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Requested by the operator; current enforcement drifts and is bypassable |
| 2 | **Beyond Local Maxima?** | PASS | Alternatives scored above |
| 3 | **Sufficient?** | PASS | Smallest option that meets the stated requirement |
| 4 | **Fits Goal?** | PASS | On the critical path in `plan.md` |
| 5 | **Open Horizons?** | PASS | Works for any repository's template |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- New `.github/workflows/message-contract.yml`
- `SKILL.md` documents the ruleset setting

**How to roll back**: Remove the check from the ruleset and delete the workflow file.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Three hook verdicts change on purpose

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-01 |
| **Deciders** | Operator |

---

<!-- ANCHOR:adr-004-context -->
### Context

AC-007 asked the new validator to give the old hook's verdict on every existing test case. Running the 22 original cases through the new hook gave 19 identical verdicts. The other 3 differ because of decisions taken after the criterion was written.

### Constraints

- The operator removed every bypass on 2026-10-01, so the case that proved the bypass works must now prove it does not
- The template always said `Spec:` carries no `specs/` prefix; the old hook never checked it
<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**We chose**: Keep the 3 new verdicts and supersede AC-007 with this record.

**How it works**: Case 9 now asserts the old bypass variable is ignored. Cases 4 and 10 now use `Spec: example/...` with the packet folder created, and new cases 21 and 22 cover the prefix and missing-packet blocks.
<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Supersede AC-007 for 3 deliberate cases** | Matches the operator's no-bypass decision and the template's own rule | Parity is no longer literal | 9/10 |
| Keep a bypass and drop the Spec checks | Literal parity | Contradicts the operator's answer and leaves the documented rule unenforced | 2/10 |

**Why this one**: The changes are the requested behavior, not regressions.
<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**What improves**:
- A `specs/`-prefixed or dangling `Spec:` line, which `git log --grep='^Spec: <track>/<packet>'` cannot find, is now refused

**What it costs**:
- Scripts that set the old bypass variable now get blocked. Mitigation: fixture commits use `core.hooksPath=/dev/null`, as the hook tests already do.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A script outside this repo relied on the bypass | M | The block names the rule id and the template that holds it |
<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Follows the operator's no-bypass answer |
| 2 | **Beyond Local Maxima?** | PASS | Literal parity considered and rejected above |
| 3 | **Sufficient?** | PASS | Only the 3 affected cases change |
| 4 | **Fits Goal?** | PASS | Enforces what the template already documents |
| 5 | **Open Horizons?** | PASS | Other repositories set their own Spec rules in their template |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-004-five-checks -->

---

<!-- ANCHOR:adr-004-impl -->
### Implementation

**What changes**:
- `.skilled/scripts/git-hooks/tests/commit-msg.test.sh` cases 4, 9 and 10, plus new cases 21 to 25

**How to roll back**: Revert the commit that changed the test file and the commit-msg shim together.
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->

---
