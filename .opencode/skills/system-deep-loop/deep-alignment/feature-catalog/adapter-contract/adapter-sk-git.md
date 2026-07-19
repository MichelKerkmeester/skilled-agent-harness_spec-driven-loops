---
title: "sk-git adapter"
description: "The single-layer deterministic authority adapter that checks commit-message grammar and wt/{NNNN}-{name} branch naming for the git-history artifact-class."
trigger_phrases:
  - "sk-git adapter"
  - "commit message grammar conformance"
  - "wt branch naming"
  - "git-history artifact class"
  - "conventional commit port"
version: 1.0.0.1
---

# sk-git adapter

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

The single-layer deterministic authority adapter that checks commit-message grammar and `wt/{NNNN}-{name}` branch naming for the `git-history` artifact-class.

`sk-git.cjs` wraps real `git` commands plus a line-cited port of `.opencode/scripts/git-hooks/commit-msg`'s structural grammar. It is 100% deterministic (ADR-004) — both checked dimensions are regex/lookup-checkable against live git state with no judgment call, so it has no reasoning-agent layer, unlike sk-doc's two-layer shape.

## 2. HOW IT WORKS

`discover()` for a `branchRange` scope walks commit SHAs over `from..to` (`git log`) and lists live branch names (`git branch --list`, unbounded because a branch name has no range-bounded identity), emitting `{ path, ref, artifactKind }` entries. `standardSource('sk-git')` returns the `SKILL.md` rule anchors, the `commit-msg` hook path, and the exempt-subject prefixes. `check()` re-fetches live git state at check-time (verify-first: `discover()` only returned a SHA, never a cached message) and runs one of two sub-checks. For a commit, it ports the hook's subject grammar (allowed types, non-numeric scope, imperative lowercase summary, vague-summary and trailing-punctuation bans, required-body-when-≥4-paths) — with one deliberate deviation: the body-required rule is applied against the commit's own historical `git diff-tree` file count, not today's staging index the hook reads. For a branch, it flags a name that backs a live worktree but lacks the `wt/` namespace.

Two exemptions are structural, not JSON suppression: Git-generated subjects (`Merge `, `Revert "`, `fixup! `, etc.) and `work/` launch-wrapper branches return an empty finding array before any grammar runs, because REQ-005 requires the exemption be structurally guaranteed. Only the legacy pre-hook packet-path scope commits use the post-hoc JSON suppression path.

**Difference from deep-review:** deep-review never audits git history — it has no commit-grammar or branch-naming dimension and no `branchRange` scope. sk-git-adapter is the only adapter whose artifacts are refs rather than files, and the only one whose entire check surface is deterministic with zero reasoning-agent layer.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `scripts/adapters/sk-git.cjs` | Adapter | `discover`/`standardSource`/`check`, the ported `commit-msg` grammar, branch-naming, and the structural exemptions. |
| `references/adapters/sk-git-adapter.md` | Reference | Full specification: branch discovery scoping (Section 3), the body-required discrepancy (Section 8), the determinism statement (Section 4.3). |
| `references/adapters/sk-git-known-deviations.md` | Reference | The two structural exemptions plus the legacy pre-hook scope suppression rule (Section 4/6 fenced JSON). |
| `.opencode/scripts/git-hooks/commit-msg` | Standard source | The live enforcement hook whose grammar is ported line-for-line. |
| `.opencode/skills/sk-git/SKILL.md` | Standard source | The `wt/{NNNN}-{name}` rule (line 298) and the commit-message logic the port cites. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `scripts/adapters/sk-git.cjs` CLI (`discover`/`check --commit`/`check --branch`) | Manual dry-run | Runs the adapter against live commits and branches; the deviation list was seeded from exactly these re-probes. |

---

## 4. SOURCE METADATA

- Group: Adapter contract
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `adapter-contract/adapter-sk-git.md`
- Primary sources: `scripts/adapters/sk-git.cjs`, `references/adapters/sk-git-adapter.md`, `references/adapters/sk-git-known-deviations.md`
Related references:
- [adapter-sk-doc.md](../../feature-catalog/adapter-contract/adapter-sk-doc.md) — sk-doc adapter
- [adapter-sk-design.md](../../feature-catalog/adapter-contract/adapter-sk-design.md) — sk-design adapter
- [../lane-resolution/scope-types.md](../../feature-catalog/lane-resolution/scope-types.md) — Scope types
