---
title: "Template phrase lint commit gate"
description: "Blocks a commit that stages a trigger phrase copied from a template default or a frontmatter editor fallback, and names the bypass in the refusal."
trigger_phrases:
  - "Template phrase lint commit gate"
  - "SPECKIT_SKIP_PHRASE_LINT"
  - "template-phrase-lint.mjs"
  - "template default trigger phrase"
version: 1.0.0.0
---

# Template phrase lint commit gate (template-phrase-lint.mjs)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

A packet whose trigger phrases are a template's placeholder text is hard to find by search, because the phrase names no topic. The phrase lint gate stops such a phrase from entering a commit. It judges only the phrases that the commit adds, so a phrase already in HEAD is never graded again.

The gate lives in the pre-commit hook. It runs as one of the blocking gates of the hook, and it refuses the commit with exit 1 when it finds a blocking phrase.

---

## 2. HOW IT WORKS

### Commit Check

The hook runs the lint only in a toolchain repository, which is one whose source tree carries the spec-kit `SKILL.md`, and only when `SPECKIT_SKIP_PHRASE_LINT` is not `1`. The lint lists the staged Markdown files, reads each staged version and its HEAD version, and judges every trigger phrase the staged version adds that HEAD does not already hold.

Two classes block the commit. The `template-default` class covers the placeholder phrases of the spec, acceptance criteria, plan, tasks and implementation summary templates. The `editor-fallback` class covers the two terminal words that the frontmatter editor adds when a document has no phrases. Every other negative class is printed as a warning and lets the commit through.

### Refusal and Bypass

A blocked commit exits 1 and names the file, the phrase, its class and the reason. The refusal then prints the bypass, `SPECKIT_SKIP_PHRASE_LINT=1 git commit ...`, which skips the gate for that one commit. A persistent switch also exists: a `speckit.hooks.templatePhraseLint` key set to `off` in git config turns the gate off for the repository, and the hook prints which gate it found switched off.

### Fail-Open Cases

The gate fails open. When the linter file is missing, when node is unavailable, when the repository root cannot be located or when the staged changes cannot be read, the gate prints a WARNING line and lets the commit proceed. Only a judged blocking phrase stops a commit.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.skilled/scripts/git-hooks/pre-commit` | Script | Runs the lint, prints the refusal and the bypass, and honours the environment variable and the git-config switch |
| `.skilled/scripts/git-hooks/lib/gates.tsv` | Script | Registers the gate, its git-config key and its skip variable |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-lint.mjs` | Script | Lists the staged Markdown files, compares each phrase with HEAD and judges the new ones |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/phrase-judge.mjs` | Shared | Holds the negative classes and the template default phrase sets the lint relies on |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `.skilled/skills/system-spec-kit/runtime/cli/tests/template-phrase-lint-hook.vitest.ts` | Vitest | Covers the warning-only single-token case, the HEAD comparison, the environment bypass and the persistent switch |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/template-phrase-integration.vitest.ts` | Vitest | Covers the seeding, cleanup and lint path together for a newly added default phrase |

---

## 4. SOURCE METADATA

- Group: Tooling And Scripts
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `tooling-and-scripts/template-phrase-lint-commit-gate.md`

Related references:
- [spec-lifecycle-automation.md](spec-lifecycle-automation.md) - The scaffold step that seeds the phrases this gate protects
