---
title: "Canonical Commit Standards"
description: "Canonical commit-message standard for this repo. Locked via 7 ADRs in decision-record.md. Phase 003 applies this to sk-git across 4 runtime mirrors; Phase 004/005 rewrites HEAD history to comply."
trigger_phrases:
  - "commit-standards"
  - "canonical commit standard"
  - "112-commit-standards"
importance_tier: "important"
contextType: "implementation"
---
# Canonical Commit Standards

> Source-of-truth document. Replaces the de facto standards scattered across `sk-git/SKILL.md §3`, `sk-git/assets/commit_message_template.md`, and `CONTRIBUTING.md`. Phase 003 will sync `sk-git` to match this document.

## 1. Subject Line

### Form

```
<type>(<scope>): <subject>
```

- Lowercase `<type>` from the [Type Taxonomy](#11-type-taxonomy).
- Lowercase `<scope>` per the [Scope Rules](#12-scope-rules).
- `<subject>` is short, no trailing period.
- Single space after the colon.
- **Imperative mood** for new commits ("add user auth", not "added user auth" or "user auth"). Retroactive rewrites preserve original tense (per ADR-004).

### Length

- **Hard cap**: 72 characters.
- **Soft guidance**: 50 characters for happy-path commits.
- Measured in display characters (em-dash counts as 1).

### 1.1 Type Taxonomy

Use the FIRST type that applies, in this priority order:

| # | Type | When |
|---|------|------|
| 1 | `merge` | Commit created by `git merge` (any merge strategy) |
| 2 | `revert` | Commit created by `git revert` |
| 3 | `release` | Version bump or release announcement |
| 4 | `scaffold` | Creating a new spec folder, new skill, or new directory tree from scratch |
| 5 | `remedy` | Closing one or more findings from a deep-review/research output (use `fix` instead when no formal finding list applies) |
| 6 | `iter` | Explicit deep-loop iteration output (cli-devin / cli-codex / cli-opencode dispatch artifacts) |
| 7 | `research` | Deep-research output or convergence artifact |
| 8 | `review` | Deep-review output or convergence artifact |
| 9 | `fix` | Bug fix |
| 10 | `feat` | New feature |
| 11 | `refactor` | Non-feature, non-fix code restructure |
| 12 | `test` | Test-only changes |
| 13 | `docs` | Documentation-only changes |
| 14 | `chore` | Everything else (build, tooling, low-stakes maintenance) |

### 1.2 Scope Rules

Pick the FIRST shape that fits the change-set's root path:

**Shape 1 — Skill scope**: all changes under `.opencode/skills/<name>/...`
- `<scope>` = `<name>` (e.g., `sk-git`, `cli-devin`, `mcp-coco-index`).

**Shape 2 — Spec scope**: all changes under one `.opencode/specs/<track>/<NNN>-name/`
- `<scope>` = `<NNN>` (e.g., `017`, `026`).

**Shape 3 — Hierarchical spec scope**: changes under one phase child `.opencode/specs/<track>/<NNN>-name/<MMM>-phase/...`
- `<scope>` = `<NNN>/<MMM>` (e.g., `026/041`, `056/008-010`).
- For deeper nesting: `<NNN>/<MMM>/<KKK>` (e.g., `026/007/012/007`).

**Shape 4 — Multi-spec scope**: changes span multiple specs in `.opencode/specs/<track>/...`
- `<scope>` = `<NNN>/<NNN>` joined by `/`, alphanumeric sort (e.g., `013/009/008` → `008/009/013`; or preserve causal order if there is one).
- Cap at 4 components; if a commit touches more, split it.

**Shape 5 — Release scope (dot form)**: ONLY for `release` type, when releasing a spec.sub-phase
- `<scope>` = `<NNN>.<MMM>` (e.g., `release(026.018)`).

**Fallback scopes** (when no shape fits):
- `agents` — touches `.opencode/agents/**` or `AGENTS.md`
- `commands` — touches `.opencode/commands/**`
- `config` — touches `opencode.json`, `.utcp_config.json`, settings
- `readme` — touches root `README.md` only
- `docs` — touches docs-only paths
- `repo` — generic catchall

### 1.3 Subject Body (the text after the colon)

- Imperative verb-first for new commits.
- Past-tense or noun-phrase forms in older commits are preserved on retroactive rewrite (ADR-004).
- May include task IDs or finding refs: `fix(017): T-SAN-01 NFKC unicode normalization (R5-P2-001)`.
- May include em-dash + secondary clause: `feat(020): ship R1-R11 from 30-iter deep-research`.

## 2. Body

### Form

- Separated from subject by exactly one blank line.
- Each line ≤72 characters.
- No hard max-length.
- Guidance: bodies exceeding 30 lines warrant considering whether the commit should be split.
- May use bullet lists, sub-paragraphs, fenced code blocks, file:line references.

### When required vs. optional

| Diff shape | Body |
|------------|------|
| Single file, ≤10 lines, mechanical | Optional |
| Single file, >10 lines OR non-mechanical | Recommended |
| Multi-file, ≤3 files | Recommended |
| Multi-file, ≥4 files OR touching SKILL.md / spec.md | Required |
| Merge | Preserve any conflict-resolution notes |
| Revert | Required — explain WHY (regression, plan change) |

### Retroactive rewrite policy

- Original body preserved verbatim (trailer block normalized per §3).
- Original body empty + thin diff → body stays empty.
- Original body empty + substantial diff → body stays empty, flag emitted in mapping (`body_augmentation_recommended: true`). Not auto-fixed (ADR-005).

## 3. Trailers

### Co-Authored-By

**Canonical form**:
```
Co-Authored-By: <Name> (<context>) <email>
```

Examples:
- `Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>`
- `Co-Authored-By: Claude Sonnet 4.6 (200K context) <noreply@anthropic.com>`

**Rules**:
1. Header is EXACTLY `Co-Authored-By:` (Title-Case-Hyphen-Title-Case). Variants `Co-authored-by:`, `Co-Authored-by:` MUST be rewritten to canonical.
2. Exactly one space after the colon.
3. Deduplicate identical trailers within the same commit.
4. Empty trailers are stripped.
5. Trailing whitespace collapsed.
6. **Model name and version preserved** — do NOT canonicalize "Opus 4.6" → "Opus 4.7". Historical accuracy matters (ADR-003).

### Wave (retroactive, for packet-111 W3.x history)

Commits that originally had a `NNN W{wave}.{sub-wave}{-suffix}:` subject prefix get a `Wave:` trailer in their rewritten body:

```
Wave: 111-W3.A
```

This trailer is NOT used for new commits; it's a retroactive-rewrite artifact only.

### Other trailers

Standard git/GitHub trailers are preserved as-is:
- `Fixes: #123`
- `Closes: #456`
- `Refs: <hash>`
- `See-Also: <url>`
- `BREAKING CHANGE: <description>` (full caps, separator block at end of body)

## 4. Special Cases

### Merge

Two accepted forms:

```
Merge branch 'feature/x' into main
```

```
merge: resolve conflicts (hooks.v1.json union + plugins README merged)
```

Don't restructure; normalize whitespace only.

### Revert

Standard git form is canonical:

```
Revert "feat(026/041): cli-skills baseline+overlay contract"
```

Body explains WHY (regression detected, plan changed, dependency removed).

### Fixup

Standard git form is canonical:

```
fixup! feat(026/041): cli-skills baseline+overlay contract
```

These ideally squash pre-merge. If they survive, leave them alone.

### Release

Two accepted forms:

```
release(026.018): Phase 018 pipeline complete — all 9 gates pass
```

```
release: v1.5.0
```

The dot-scope form for spec-folder releases. The bare-type form for semver bumps. Body includes release notes when present.

## 5. Worked Examples

**Happy-path feature, single skill**:
```
feat(sk-git): add commit-msg hook scaffold

Optional pre-commit/commit-msg hook scaffold for enforcing the
new commit standards on locally-authored commits. Skip-flag
remains supported for emergency overrides.
```

**Multi-spec feature with finding refs**:
```
fix(017): T-SAN-01 NFKC unicode normalization (R5-P2-001)

Apply NFKC normalization to all user-provided slugs before
trigger-phrase matching. Closes 3 P1 findings from R5:
- R5-P2-001: emoji slugs were splitting code points
- R5-P2-002: combining marks broke index lookup
- R5-P2-003: full-width digits not normalized

Verification: skill_advisor.py unit tests pass; spot-check
on 20 historical slugs from past memories shows correct
canonicalization.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
```

**Retroactive rewrite of a packet-ID-prefixed commit**:

Original:
```
111 W3.A: author phase-parent base files for 008-skill-advisor/004-hardening

cli-devin SWE-1.6 dispatched. Test of W3.A protocol on smallest
sub-phase (3 children) before fanning out to remaining 10.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
```

Rewritten:
```
scaffold(008-skill-advisor/004-hardening): author phase-parent base files

cli-devin SWE-1.6 dispatched. Test of W3.A protocol on smallest
sub-phase (3 children) before fanning out to remaining 10.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>

Wave: 111-W3.A
```

**Merge commit (git-default form)**:
```
Merge remote-tracking branch 'origin/main'
```
(Preserved as-is during rewrite — only whitespace normalized.)

**Merge commit (authored form)**:
```
merge: resolve conflicts (hooks.v1.json union, plugins README merged)
```
(Preserved as-is.)

**Release**:
```
release(026.018): Phase 018 pipeline complete — all 9 gates pass

Closing-pass commit for packet 026/018 — Phase 018 (auto-review
restructure execution wave 2). All 9 quality gates passed:
- G1–G3 spec validation
- G4 sk-doc DQI
- G5 council gate
- G6–G7 deep-review × 7 + regression remediation
- G8 manual testing playbook
- G9 changelog + handover

Phase commits: 73e9e361e, 74782acfb, 65e6f0479.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
```

**Revert**:
```
revert: feat(026/041) cli-skills baseline+overlay contract

Reverts 5423e8d92d. The baseline+overlay design assumed all
downstream skills could discover overlays via filesystem-walk,
but mcp-coco-index needs the overlay set at index-build time.
Re-attempt after packet 060 lands the build-time discovery API.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
```

## 6. Quick Reference (one-screen)

```
SUBJECT: <type>(<scope>): <subject>     ≤72 chars (50 soft)
  type: merge, revert, release, scaffold, remedy, iter, research, review,
        fix, feat, refactor, test, docs, chore   (first-match priority)
  scope: <skill> | <NNN> | <NNN>/<MMM> | <NNN>/<NNN>/<NNN> | <NNN.MMM>
         | agents | commands | config | readme | docs | repo
  subject: imperative for new commits; preserved for retroactive rewrites

BODY:    blank line after subject; ≤72 chars per line; no hard max

TRAILERS:
  Co-Authored-By: <Name> (<context>) <email>     canonical case + spacing
  Wave: 111-W3.X                                 retroactive only
  Fixes: #NNN | Closes: #NNN | Refs: <hash>      standard git trailers
  BREAKING CHANGE: <description>                 full caps, end-of-body

SPECIAL CASES:
  merge:   Merge branch 'X'  OR  merge: <descriptive>
  revert:  Revert "<orig>"
  fixup:   fixup! <orig>
  release: release(NNN.MMM): ...  OR  release: vX.Y.Z
```

## 7. Cross-References

- **Derivation algorithm** (Phase 004 prompts reference this): `derivation-heuristics.md`
- **ADRs** (rationale for each rule): `decision-record.md`
- **20-sample validation** (proof of determinism): `hand-sample-validation.md`
- **sk-git skill** (will be updated to mirror this doc in Phase 003): `.opencode/skills/sk-git/SKILL.md`
