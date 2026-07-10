---
title: Commit Message Template
description: Repository-specific commit message contract and AI author procedure, canonically owned by SKILL.md.
trigger_phrases:
  - "conventional commit scopes"
  - "commit message template"
  - "imperative mood description"
  - "breaking change footer"
  - "commit subject length rules"
importance_tier: normal
contextType: implementation
version: 1.2.0.0
---

# Commit Message Template - Repository-Specific Contract

## 1. CANONICAL CONTRACT

The canonical rules are in `../SKILL.md` under
"Commit Message Logic (Human-Clear and AI-Deterministic)."

Authored subjects use:

```text
type(scope)[!]: imperative summary
```

Type and scope are required. The scope names a stable subsystem, never a
numeric packet. Aim for 80 characters and never exceed 100.

Git-generated `Merge`, `Revert`, `fixup!`, `squash!`, and `amend!` subjects
are preserved unchanged.

Structural rules are enforced by
[../../../scripts/git-hooks/commit-msg](../../../scripts/git-hooks/commit-msg)
(bypass: `SPECKIT_SKIP_COMMIT_MSG_VALIDATE=1 git commit ...`).

---

## 2. AI AUTHOR PROCEDURE

1. Inspect the staged diff, not only filenames.
2. Confirm the staged paths form one logical change.
3. Select the first matching type from the canonical priority list.
4. Select the first matching stable scope.
5. Write an imperative action plus a concrete object.
6. Remove packet numbers, phase names, task counts, model names, and review
   claims from the subject.
7. Add the observable effect when the object remains ambiguous.
8. Add a body when four or more paths are staged or the reason is non-obvious.
9. Run the self-check before invoking `git commit`.

---

## 3. BODY TEMPLATE

```text
Context: <why this change is needed>

Changes:
- <what now behaves differently>
- <second material change, if any>

Verification:
- `<command>` -> <observed result>

Refs: <issue, PR, or spec path>
```

Do not fill sections with boilerplate. Omit an unused section rather than
writing `N/A`.

---

## 4. REPOSITORY-SPECIFIC EXAMPLES

### Fix a missing code-graph consumer

```text
fix(code-graph): consume invalidation markers after commits

Context: Post-commit invalidation markers were written but never read, so a
clean checkout retained a stale code graph.

Changes:
- Consume the marker during launcher startup.
- Preserve the existing atomic marker-writing path.

Verification:
- `bash .opencode/scripts/git-hooks/tests/post-commit-code-graph-invalidation.sh` -> 3/3 pass
```

### Add cross-provider Git workflows

```text
feat(sk-git): add cross-provider GitKraken workflows

Context: The git skill only supported GitHub-specific remote operations.

Changes:
- Register GitKraken's MCP transport.
- Route overlapping local git mutations through the existing Bash workflow.

Verification:
- Advisor routing checks passed for GitKraken and normal commit prompts.
```

### Preserve the intended database journal mode

```text
fix(spec-kit): preserve DELETE journal mode during startup

Context: A startup health check restored WAL mode and reopened a known
multi-process crash risk.

Changes:
- Make the health check accept the configured DELETE mode.
- Distinguish corruption sentinels from repairable missing artifacts.

Verification:
- Repeated warm restarts retained DELETE mode.
```

These examples are tightened versions of real commits in this repository's
own history (`5baf52ff74`, `cf639da725`, `bd693dfc37`) — grounded in what
actually gets committed here, not generic auth/API scaffolding.

---

## 5. SELF-CHECK

- [ ] Authored subject matches `type(scope)[!]: imperative summary`.
- [ ] Type is the first match in the canonical priority.
- [ ] Scope is stable, lowercase, and not numeric-only.
- [ ] Summary says what changed, not how the work was organized.
- [ ] Summary is not vague or dependent on internal jargon.
- [ ] Subject is at most 100 characters.
- [ ] A substantial or non-obvious change has a useful body.
- [ ] Verification claims name the command or observed evidence.
- [ ] Breaking changes include `!` and `BREAKING CHANGE:`.
- [ ] Message remains understandable without the linked spec or issue.

---

## 6. RELATED RESOURCES

- [../SKILL.md](../SKILL.md) - Canonical Commit Message Logic
- [../../../scripts/git-hooks/commit-msg](../../../scripts/git-hooks/commit-msg) - Structural enforcement hook
- [Conventional Commits Specification](https://www.conventionalcommits.org/) - Official specification for commit message formatting
