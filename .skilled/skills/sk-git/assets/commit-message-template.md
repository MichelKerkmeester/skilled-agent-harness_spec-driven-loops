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
version: 1.3.0.0
---

# Commit Message Template - Repository-Specific Contract

## 1. OVERVIEW

This asset shows the commit shape sk-git enforces: a `type(scope): summary` subject, a short prose body and a final trailer paragraph that names the packet and carries the stamped ordinal. The reasoning lives in `SKILL.md`. This file carries the procedure, the examples, the self-check you run before `git commit` and, in section 7, the rules block every gate enforces.

---

## 2. CANONICAL CONTRACT

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

Every authored commit ends with one contiguous trailer paragraph, separated from
the prose above it by a blank line. It carries `Spec: <track>/<packet>[/<phase>...]`
when the work belongs to a packet (the packet's path below `specs/`, including
nested phases, and without the `specs/` segment), then `Commit-Id: NNNNNNN`,
then `Refs:` for external links only.
The `prepare-commit-msg` hook stamps both machine keys, so never type a
`Commit-Id:` by hand.

The rules block in section 7 is what the `commit-msg` and `pre-push` hooks, the
agent gate and CI enforce. There is no bypass switch.

---

## 3. AI AUTHOR PROCEDURE

1. Inspect the staged diff, not only filenames.
2. Confirm the staged paths form one logical change.
3. Select the first matching type from the canonical priority list.
4. Select the first matching stable scope.
5. Write an imperative action plus a concrete object.
6. Remove packet numbers, phase names, task counts, model names, and review
   claims from the subject.
7. Add the observable effect when the object remains ambiguous.
8. Add a prose body that says why, on every authored commit. Trailers do not
   count as a body, and a one-path change still needs one.
9. Run the self-check before invoking `git commit`.

---

## 4. BODY TEMPLATE

```text
Context: <why this change is needed>

Changes:
- <what now behaves differently>
- <second material change, if any>

Verification:
- `<command>` -> <observed result>

Spec: <track>/<packet>[/<phase>...]
Commit-Id: NNNNNNN
Refs: <issue, PR or URL>
```

Do not fill sections with boilerplate. Omit an unused section rather than
writing `N/A`.

---

## 5. REPOSITORY-SPECIFIC EXAMPLES

### Fix a missing code-graph consumer

```text
fix(code-graph): consume invalidation markers after commits

Context: Post-commit invalidation markers were written but never read, so a
clean checkout retained a stale code graph.

Changes:
- Consume the marker during launcher startup.
- Preserve the existing atomic marker-writing path.

Verification:
- `bash .skilled/scripts/git-hooks/tests/post-commit-code-graph-invalidation.sh` -> 3/3 pass

Commit-Id: 0009021
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

Spec: sk-git/014-gitkraken-mcp-integration
Commit-Id: 0009022
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

Spec: system-speckit/026-graph-and-context-optimization/007-mcp-daemon-reliability/033-boot-wal-shm-sigbus-fix
Commit-Id: 0009023
```

These examples are tightened versions of real commits in this repository's
own history (`8701343331`, `e6f9a97b8b`, `ed1c269ee6`), grounded in what
actually gets committed here, not generic auth/API scaffolding.

---

## 6. SELF-CHECK

- [ ] Authored subject matches `type(scope)[!]: imperative summary` (`subject.format`).
- [ ] Type is the first match in the canonical priority.
- [ ] Scope is stable, lowercase, and not numeric-only (`subject.scope-numeric`).
- [ ] Summary says what changed, not how the work was organized (`subject.process-language`).
- [ ] Summary is not vague or dependent on internal jargon (`subject.vague`).
- [ ] Subject is at most 100 characters (`subject.max-length`).
- [ ] The message has a prose body that says why, whatever the path count (`body.required`).
- [ ] Verification claims name the command or observed evidence.
- [ ] Breaking changes include `!` and `BREAKING CHANGE:` (`breaking.footer`).
- [ ] Message remains understandable without the linked spec or issue.
- [ ] The trailer paragraph is the last paragraph and stays contiguous (`trailer.final-paragraph`).
- [ ] `Spec:` names an existing packet without the `specs/` prefix (`trailer.spec-prefix`, `trailer.spec-exists`).
- [ ] The `Commit-Id:` value was stamped by the hook, not typed by hand.
- [ ] No `Co-Authored-By`, `Claude-Session` or vendor attribution line (`attribution.forbidden`).

---

## 7. ENFORCED RULES

The JSON block below is the rulebook. The `commit-msg` hook, the `pre-push` hook,
the agent gate and the CI check all read it from this file through
`scripts/validate-message.mjs`, so editing the block changes what every gate
enforces. Another repository gets its own rules by carrying its own copy of this
template, in `.sk-git/` at its root or in the directory git config
`skgit.contractDir` names. A repository with no rules block is not checked.

Each rule has an id, and every block message names the id it failed:

| Rule id | What it checks |
|---------|----------------|
| `message.empty` | The message has content after comments are stripped |
| `subject.format` | The subject is `type(scope)[!]: summary` with a listed type and a scope matching `scopePattern` |
| `subject.scope-numeric` | The scope is a subsystem name, not a bare number |
| `subject.summary-start` | The summary starts with a lowercase imperative verb |
| `subject.repeated-spaces` | The summary has no double spaces |
| `subject.trailing-punctuation` | The summary does not end with punctuation |
| `subject.vague` | The summary is not one of the listed vague phrases |
| `subject.max-length` | The subject is at most `maxLength` characters |
| `subject.process-language` | Warning only: phase, wave, lane, task-count or tranche language in the summary |
| `body.blank-line` | A blank line separates the subject from the body |
| `body.required` | At least one prose line sits above the trailers |
| `body.line-length` | Warning only: a prose line is longer than `warnLineLength` |
| `trailer.final-paragraph` | `Spec:` and `Commit-Id:` sit in the last paragraph with no prose beside them |
| `trailer.commit-id-format` | `Commit-Id:` holds exactly seven digits |
| `trailer.commit-id-unique` | No other commit already carries the same `Commit-Id:` |
| `trailer.spec-prefix` | `Spec:` omits the `specs/` prefix, so `git log --grep='^Spec: <track>/<packet>'` finds it |
| `trailer.spec-exists` | `Spec:` names a packet folder that exists under `specs/` |
| `attribution.forbidden` | No `Co-Authored-By:`, `Claude-Session:` or vendor-naming trailer |
| `breaking.footer` | A `!` subject carries a `BREAKING CHANGE:` footer |

Git-generated subjects listed in `passthroughSubjects` skip every rule.

```json
{
  "kind": "commit",
  "version": 1,
  "help": {
    "expected": "type(scope): imperative summary",
    "example": "fix(code-graph): consume invalidation markers after commits"
  },
  "passthroughSubjects": ["^Merge ", "^Revert \".*\"$", "^fixup! ", "^squash! ", "^amend! "],
  "subject": {
    "types": ["build", "chore", "ci", "docs", "feat", "fix", "merge", "perf", "refactor", "release", "revert", "style", "test"],
    "scopeRequired": true,
    "scopePattern": "^[a-z0-9]+(-[a-z0-9]+)*$",
    "forbidNumericScope": true,
    "allowBreakingMarker": true,
    "summaryStart": { "pattern": "^[a-z]", "hint": "a lowercase imperative verb" },
    "forbidTrailingPattern": "[.!?;:,]$",
    "forbidRepeatedSpaces": true,
    "maxLength": 100,
    "vagueSummaries": ["change files", "changes", "checkpoint", "cleanup", "fix", "fix bug", "misc", "misc changes", "miscellaneous changes", "stuff", "update", "update files", "update stuff", "various changes", "work in progress", "wip"],
    "warnPatterns": [
      {
        "id": "subject.process-language",
        "pattern": "(Phase\\s[A-Z0-9]|wave\\s[+A-Za-z0-9]|Lane\\s[A-Z]|[0-9]+\\stasks?|swarm|tranche|WU[0-9]+)",
        "message": "Subject contains internal process language; move it to Context or Refs when it does not describe behavior."
      }
    ]
  },
  "body": {
    "required": true,
    "blankLineAfterSubject": true,
    "warnLineLength": 100
  },
  "trailers": {
    "looseKeys": ["Co-Authored-By", "Signed-off-by", "Reviewed-by", "Tested-by", "Refs", "Fixes", "Closes", "Related to"],
    "strictKeys": ["Spec", "Commit-Id"],
    "machineKeys": ["Spec", "Commit-Id"],
    "machineKeysInFinalParagraph": true,
    "commitId": { "key": "Commit-Id", "pattern": "^[0-9]{7}$", "hint": "exactly seven digits", "unique": true },
    "spec": { "key": "Spec", "root": "specs", "forbiddenPrefix": "specs/", "mustExist": true }
  },
  "attribution": {
    "forbiddenKeys": ["Co-Authored-By", "Claude-Session"],
    "forbiddenTrailerValuePattern": "anthropic"
  },
  "breakingFooterPattern": "^BREAKING CHANGE: .+$"
}
```

---

## 8. RELATED RESOURCES

- [../SKILL.md](../SKILL.md) - Canonical Commit Message Logic
- [../scripts/validate-message.mjs](../scripts/validate-message.mjs) - The validator every gate calls
- [../../../scripts/git-hooks/commit-msg](../../../scripts/git-hooks/commit-msg) - Commit-time gate
- [Conventional Commits Specification](https://www.conventionalcommits.org/) - Official specification for commit message formatting
