---
title: sk-git Adapter — standardSource, discover, check
description: The concrete standardSource("sk-git")/discover(scope)/check(artifact,rules) specification wrapping the live commit-msg hook grammar and wt/{NNNN}-{name} branch-naming rule, built to the phase-005 reference adapter's shape.
trigger_phrases:
  - "sk-git alignment adapter"
  - "conventional commit conformance check"
  - "deep-alignment sk-git check"
  - "worktree branch naming conformance"
importance_tier: important
contextType: implementation
version: 1.0.0.0
---

# sk-git Adapter

The concrete `standardSource("sk-git")` / `discover(scope)` / `check(artifact,rules)` specification wrapping sk-git's live, deterministic commit-message grammar and worktree branch-naming rule. Built to the phase-005 reference adapter's shape (`sk_doc_adapter.md`), sk-git's own content.

---

## 1. OVERVIEW

### Contract This Adapter Implements

ADR-003 (`.opencode/specs/system-deep-loop/059-deep-alignment-mode/002-architecture-decision/decision-record.md`, ANCHOR `adr-003`) freezes a three-method, authority-agnostic contract: `discover(scope) -> artifacts`, `standardSource(authority) -> {templates, rules}`, `check(artifact, rules) -> findings`. This document specifies sk-git's implementation of all three, and `scripts/adapters/sk-git.cjs` is the real, executable code behind it.

### Determinism Statement (ADR-004, ADR-012)

sk-git's `check()` is **100% deterministic, single-layer** — no reasoning-agent sub-check, unlike sk-doc's two-layer shape (`sk_doc_adapter.md` Section 4.2, template-conformance + reality-alignment) or sk-design's hybrid shape (`sk_design_adapter.md` Section 4). ADR-004 states this plainly: "sk-git (deterministic — conventional-commit + worktree/branch rules already AI-scannable in `sk-git/SKILL.md`)." Both dimensions this adapter checks — commit-message grammar and branch-naming — are regex/lookup-checkable against live git state with no judgment call, so there is nothing for a reasoning-agent layer to add. Every finding this adapter produces carries `layer: 'deterministic'`. Per ADR-012, sk-git does not need its own short adapter decision-record (that governance requirement applies to authorities beyond the v1 four plus phase 010); ADR-004's own sequencing rationale already covers it.

### What This Adapter Wraps (Not Reimplements)

Two real, live sk-git sources, cited with exact line numbers so this specification stays checkable against the live files:

1. `.opencode/skills/sk-git/SKILL.md` — "Commit Message Logic" (lines 310-457, the type/scope/summary grammar and its self-check), "Classify Special Git Messages" (lines 319-326, the Git-generated-subject exemption), and ALWAYS rule #4 (line 298, the `wt/{NNNN}-{name}` branch-naming rule).
2. `.opencode/scripts/git-hooks/commit-msg` — the live, installed enforcement hook. This adapter's `checkCommitGrammar()` ports the hook's structural regex checks line-for-line (cited inline in code), with one deliberate, documented deviation — see Section 4.1's "Historical vs. Live File-Count Discrepancy."

Explicitly **not wrapped**: GitKraken MCP's local-mutation tools (`gitkraken.gitkraken_*`) — `SKILL.md` ALWAYS #12 already routes those back to Bash/this skill's own workflow; this adapter reads git state, it does not perform git operations GitKraken MCP would otherwise duplicate.

---

## 2. STANDARDSOURCE("SK-GIT")

`standardSource('sk-git')` returns a single object naming every real source Section 1 lists, plus the parsed known-deviation list. Live output (`node scripts/adapters/sk-git.cjs standard-source`, re-run 2026-07-11):

```json
{
  "authority": "sk-git",
  "determinism": "deterministic",
  "rules": {
    "commitGrammar": { "doc": "SKILL.md", "path": "<repo>/.opencode/skills/sk-git/SKILL.md", "section": "Commit Message Logic", "lines": "310-457" },
    "branchNaming": { "doc": "SKILL.md", "path": "<repo>/.opencode/skills/sk-git/SKILL.md", "rule": "wt/{NNNN}-{name}", "line": 298 },
    "exemptionList": { "doc": "SKILL.md", "path": "<repo>/.opencode/skills/sk-git/SKILL.md", "section": "Classify Special Git Messages", "lines": "319-326" }
  },
  "enforcementHook": { "tool": "commit-msg hook", "path": "<repo>/.opencode/scripts/git-hooks/commit-msg" },
  "exemptSubjectPrefixes": ["Merge ", "Revert \"", "fixup! ", "squash! ", "amend! "],
  "knownDeviations": [ /* parsed from sk_git_known_deviations.md Section 6 */ ]
}
```

Calling `standardSource()` with any authority other than `'sk-git'` throws — this file is the sk-git-specific implementation, not a cross-authority dispatcher (that dispatch belongs to phase 008's engine).

---

## 3. DISCOVER(SCOPE) FOR SK-GIT

### Behavior

sk-git's registered artifact-class is `git-history` (`scripts/scoping.cjs`'s `AUTHORITY_ARTIFACT_CLASSES`), which pairs with a `branchRange` scope (`lane_config_schema.md` Section 4). Given `{type:'branchRange', from, to}`, `discover()`:

1. Runs `git log --pretty=format:%H <from>..<to>` to enumerate **commit** artifacts in the bounded range (NFR-P01: no full-repo scan — this walk is bounded by the caller-supplied range, not the whole repo's history).
2. Runs `git branch --list --format=%(refname:short)` to enumerate **branch** artifacts — see "Branch Discovery Is Not Range-Scoped" below for why this is unconditional rather than range-filtered.
3. Returns `{ artifacts: [{path, ref, artifactKind}, ...], nodes: [...] }` — the real `discover_contract.md` Section 4 output shape, with `artifactKind: 'commit'|'branch'` distinguishing the two artifact types this authority discovers (plan.md's own Architecture section: "resolves a lane's scope... into a list of commit/branch artifacts").

A `paths`/`globs` scope (the wrong shape for this authority — `git-history` pairs with `branchRange`, not `paths`/`globs`, per `lane_config_schema.md` Section 4's table) resolves to `{artifacts:[], nodes:[]}`, mirroring sk-doc.cjs's reciprocal treatment of an off-label `branchRange` scope — an out-of-contract call fails predictably instead of throwing.

### Path/Ref Identity Convention (This Adapter's Own Design Choice)

`discover_contract.md` §4.1 explicitly leaves the `path`/`ref` identity convention to each adapter for `branchRange` scopes. A commit or branch has no filesystem path, so this adapter carries the same identifier in both fields, disambiguated by a synthetic namespace prefix so `path` is never confusable with a real repo file path: `git-log/<sha>` for commits, `git-branch/<name>` for branches. `ref` carries the bare sha or branch name a live git command can act on directly.

### Branch Discovery Is Not Range-Scoped (Named, Not Silently Done)

Unlike commit discovery, branch discovery is **unconditional** — it always enumerates every local branch, regardless of the lane's `from`/`to` values. This is a deliberate design choice, named here rather than silently done: a branch's *name* has no commit-range-bounded identity the way a commit does (branch naming is a static property of the ref, not something that happened "within" a range of commits). `git branch --list` is a ref listing (O(branch count), no history traversal), so this stays compliant with NFR-P01's specific "no full-repo `git log` scan" wording even though it is not scope-bounded by `from`/`to`.

---

## 4. CHECK(ARTIFACT, RULES)

`check(artifact, rules)` dispatches on `artifact.artifactKind` to one of two sub-checks, both re-fetching live git state before asserting any finding (Section 5), then returns a flat findings array after known-deviation suppression (Section 6).

### 4.1 Commit-Message Grammar (`artifactKind: 'commit'`)

1. Re-fetch the commit's live message via `git log -1 --format=%B <sha>` (never trust a cached message — `discover()` only ever returned the sha).
2. If the subject matches one of the Git-generated exemption prefixes (`Merge `, `Revert "`, `fixup! `, `squash! `, `amend! `), return **zero findings** immediately — a structural pre-check exemption, not a suppressible rule (REQ-005; see Section 6's "Two Suppression Mechanisms").
3. Otherwise, run `checkCommitGrammar()` — a line-cited port of `.opencode/scripts/git-hooks/commit-msg`'s structural checks (subject format, scope validity, summary shape, vague-summary list, subject length, blank-line body separator, breaking-change footer, process-label warnings, body-line length).
4. Every ERROR becomes a `P0` finding; every WARNING becomes a `P2` finding (Section 7's severity table).

#### Historical vs. Live File-Count Discrepancy (Deliberate Deviation From a Naive Hook Re-Invocation)

The hook's own body-required-if->=4-files rule (`commit-msg:145-157`) reads `git diff --cached --name-only` — the **live staging index** — via `STAGED_FILE_COUNT`. That is correct for the hook's own job (validating a message *before* a commit is made, against whatever is *currently* staged), but it is meaningless for an *already-made* historical commit: today's staging area has no relationship to what a past commit actually changed. A naive re-invocation of the hook script against a historical commit's message would silently score it against the wrong file count.

This adapter instead computes the commit's **own** changed-file count via `git diff-tree --no-commit-id --name-only -r <sha>` and applies the hook's identical ">=4 files needs an explanatory body" rule against that historical count. This is `plan.md`'s own Risk-mitigation instruction in practice ("`check()` should read/parse the same rule source the hook uses... rather than reimplementing the type/scope/summary grammar independently") applied with the one correction a historical-commit context requires — recorded here plainly rather than silently "just working" by coincidence. Verified live (2026-07-11): `checkCommitGrammar()` unit-tested against five synthetic messages (missing type/scope, vague summary, numeric-only scope, missing breaking-change footer, and a clean conventional message) each produced exactly the expected error type or a clean pass.

### 4.2 Branch Naming (`artifactKind: 'branch'`)

1. Re-confirm the branch still exists live via `git branch --list <name>` (never trust `discover()`-time data).
2. If the name matches the `work/{runtime}/{slug}` launch-wrapper shape, return **zero findings** immediately — a second structural pre-check exemption (`sk_git_known_deviations.md` Section 3).
3. If the name matches `wt/{NNNN}-{name}` (4-digit zero-padded, kebab-case), it conforms — zero findings.
4. Otherwise, the adapter has no direct signal that this branch was "worktree-created" (SKILL.md ALWAYS #4's actual scope — `main`, long-lived integration branches, and ordinary feature branches are legitimately unprefixed). The only live signal available is whether the branch currently backs a live worktree, via `git worktree list --porcelain`:
   - Backed by a live worktree and not `wt/`- or `work/`-prefixed -> `P1` `worktree-branch-missing-namespace`.
   - Not backed by any live worktree -> **no finding either way** — out of this check's evidentiary reach, not silently assumed compliant or non-compliant.

#### Live-Reality Finding: `git worktree list --porcelain`'s Main-Checkout Block Is Indistinguishable From a Linked Worktree

Building and dry-running this adapter surfaced a genuine false-positive, caught before it ever became a live finding rather than shipped and discovered later. `git worktree list --porcelain`'s **first** block always describes the main checkout itself — in the identical `worktree <path>` / `branch refs/heads/<name>` shape as any `git worktree add`-created linked worktree, with no distinguishing marker. Live re-probe (2026-07-11, `git worktree list --porcelain` on this repo): the first block reports `branch refs/heads/skilled/v4.0.0.0` — this repo's current long-lived integration branch, checked out at the repo root, never created via `git worktree add -b`. Before the fix, `branchIsBackedByWorktree('skilled/v4.0.0.0')` returned `true` (since the branch backs *a* worktree block), and because that branch name matches neither `wt/{NNNN}-{name}` nor `work/`, `checkBranch()` would have emitted a false-positive `worktree-branch-missing-namespace` finding against the repo's own primary branch on every run.

**The fix**: `branchIsBackedByWorktree()` now excludes the block whose `worktree <path>` equals `REPO_ROOT` (`git rev-parse --show-toplevel`) before searching for the target branch — an explicit, self-documenting check rather than relying on git's (real, but less legible in code) "main checkout is always listed first" ordering guarantee. Re-verified live after the fix: `check --branch skilled/v4.0.0.0` and `check --branch main` both return `[]`; `check --branch wt/0001-mcp-front-proxy` and `check --branch work/021-graph-preservation` both still return `[]` (correctly conforming/exempt) — no regression.

---

## 5. VERIFY-FIRST BEHAVIOR (ADR-005, HARD REQUIREMENT)

No finding is ever asserted without first re-running the relevant `git` command against live state. This holds structurally, not by discipline alone: `discover()` never returns a commit message or a branch's worktree-backing status — only a bare sha or name — so `check()` has nothing to trust *except* a fresh `git log`/`git branch --list`/`git worktree list --porcelain` call. Both sub-checks open with an existence re-confirmation (`commitExists()`/`branchExists()`) specifically so a commit or branch that vanished between `discover()` and `check()` (rewritten history, a deleted branch) produces an honest `P1` `adapter-error` instead of a stale, silently-wrong finding.

Live re-probe evidence gathered while authoring this adapter's known-deviation list (2026-07-11) is itself an example of the discipline: the hook-installation cutover date (`7ea5cfb7c1`, `2026-07-10T15:17:16+02:00`) and the two supporting legacy-scope commits were confirmed via direct `git log --format='%H %aI %s'` re-runs, not assumed from memory — see `sk_git_known_deviations.md` Section 4 for the full evidence trail, including a third candidate commit that was deliberately **excluded** from the evidence set because its post-hook-install date could not be honestly explained without further investigation this adapter did not perform.

---

## 6. KNOWN-DEVIATION SUPPRESSION (ADR-005)

Every finding `check()` produces passes through `suppressKnownDeviations()` before being returned. The full seeded list, its structured evidence, and the machine-readable rule block `sk-git.cjs` actually parses live in [sk_git_known_deviations.md](./sk_git_known_deviations.md) — not duplicated here.

**Two suppression mechanisms, not one** (see that document's Section 1 for the full explanation): the Git-generated-subject exemption (Section 4.2 above) and the `work/{runtime}/{slug}` branch exemption (Section 4.2 above) are both **structural pre-check exemptions** hard-coded inside `checkCommit()`/`checkBranch()` — REQ-005's acceptance criteria requires them be structurally guaranteed, not merely data-configured, so they have no corresponding JSON rule to edit. The legacy packet-path scope commits (pre-hook-installation) use the standard post-hoc `matchTypes`/`requiresCommitBeforeHookInstall` filter, the same mechanism sk-doc.cjs's suppression list uses. A suppression only silences the matched finding on the matched artifact; it never blanket-exempts the whole artifact from every other check.

---

## 7. SEVERITY MAPPING

| Source | Condition | Severity | `layer` |
|--------|-----------|----------|---------|
| commit-msg grammar (ported) | any ERROR (invalid format, numeric scope, vague summary, missing breaking footer, missing body separator, missing required body) | P0 | deterministic |
| commit-msg grammar (ported) | any WARNING (subject 80-100 chars, process-label leakage, body line >100 chars) | P2 | deterministic |
| branch naming | worktree-backed branch missing `wt/`/`work/` namespace | P1 | deterministic |
| either sub-check | adapter-level failure (sha/branch vanished, git subprocess failed) | P1 (`adapter-error`) | deterministic |

P0 mirrors the hook's own "BLOCKED" framing (these are the exact conditions that would have prevented the commit had it gone through the live hook). P2 mirrors the hook's own "commit allowed; consider revising" framing for warnings — explicitly non-blocking. Branch-naming violations sit at P1: a real, structural violation of an ALWAYS-list rule, but nothing currently prevents a wrongly-named worktree branch from existing the way the hook prevents a malformed commit, so P0 would overstate it.

---

## 8. REFERENCE IMPLEMENTATION

`scripts/adapters/sk-git.cjs` implements every function this document specifies: `discover(scope)`, `standardSource(authority)`, `check(artifact, rules)`, plus the git subprocess wrappers, the ported grammar checker, and the suppression matcher. It also exposes a small CLI (`discover`, `check`, `standard-source` subcommands) for a manual dry-run without any engine wiring. Every behavior this document describes was live-verified against this repo's real git state on 2026-07-11, not merely written and assumed correct:

- `discover HEAD~15 HEAD` — real commit artifacts enumerated from a bounded range.
- `check --commit d3ccce15d2` (this branch's HEAD at authoring time) — correctly found a genuine `subject-long` P2 (85-character subject).
- `check --commit fd9fc599be...` (a real, pre-hook-installation legacy-scope commit) — correctly suppressed to `[]` via the known-deviation list.
- `check --branch wt/0001-mcp-front-proxy`, `check --branch work/021-graph-preservation`, `check --branch main`, `check --branch skilled/v4.0.0.0` — all four correctly return `[]` (conforming, exempt, not-evidenced, and main-checkout-excluded respectively).
- `check --branch <nonexistent>` — correctly returns a `P1` `adapter-error`.
- Five synthetic `checkCommitGrammar()` unit calls (bad subject, vague summary, numeric scope, missing breaking footer, clean message) — each produced exactly the expected result.

See that file's own header comment for exact invocation examples.

---

## 9. REFERENCES AND RELATED RESOURCES

- [sk_git_known_deviations.md](./sk_git_known_deviations.md) — the structured, evidence-cited suppression list.
- [sk-git.cjs](../../scripts/adapters/sk-git.cjs) — the executable reference implementation.
- [sk_doc_adapter.md](./sk_doc_adapter.md) — the phase-005 reference adapter this document's shape was copied from.
- `.opencode/skills/sk-git/SKILL.md` (lines 298, 310-457, 319-326) — the live rule sources.
- `.opencode/scripts/git-hooks/commit-msg` — the live enforcement hook this adapter's grammar is ported from.
- `.opencode/specs/system-deep-loop/059-deep-alignment-mode/002-architecture-decision/decision-record.md` (ANCHORS `adr-003`, `adr-004`, `adr-005`, `adr-012`) — the contract, sequencing/determinism rationale, alignment invariants, and adapter-registration governance this adapter satisfies.
- [../discover_contract.md](../discover_contract.md), [../lane_config_schema.md](../lane_config_schema.md), [../scoping_protocol.md](../scoping_protocol.md) — the real, live `discover(scope)->artifacts` contract this adapter's `discover()` conforms to.
