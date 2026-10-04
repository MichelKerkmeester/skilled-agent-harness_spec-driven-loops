---
title: "Source tag resolution"
description: "The SOURCE_TAGS rule resolves each path:line citation inside a [SOURCE: ...] tag in a packet's research and review artifacts and warns when the file is gone, has moved, is shorter than the cited line or matches only by file name."
trigger_phrases:
  - "source tag resolution"
  - "SOURCE_TAGS rule"
  - "check-source-tags-helper.mjs"
  - "SPECKIT_SOURCE_TAG_CUTOFF"
  - "source citation check"
version: 2.7.0.2
---

# Source tag resolution (SOURCE_TAGS)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

The SOURCE_TAGS rule resolves each path:line citation inside a [SOURCE: ...] tag in a packet's research and review artifacts and warns when the file is gone, has moved, is shorter than the cited line or matches only by file name.

The rule is a warning, never a failure. It answers one narrow question: does the cited path and line exist? A pass says nothing about whether the cited line supports the claim beside it.

---

## 2. HOW IT WORKS

### What It Scans

The rule reads every `.md` file under the packet's `research/` and `review/` folders and skips any `prompts/` folder, because a dispatch prompt carries instructions and examples rather than findings. Inside those files it takes the `path:line` citations that sit inside `[SOURCE: ...]` tags. A fenced code block is skipped, and so is a tag that holds a URL or prose instead of a path citation.

### How A Citation Resolves

Resolution is `resolveCitation` from sk-doc's `cite-drift-scan.mjs`, so a tag and a bare citation in a skill doc get the same verdict and read the same redirect table. Each citation resolves against the citing file's folder, the repository root and the packet folder. A packet is usually validated before it is committed, so untracked files outside `.gitignore` count as present.

### Warning Classes

Each unresolved citation prints one `WARN` line with its class and a detail:

- **gone**: no file at that path and no recorded rename.
- **moved**: the redirect table maps the path to a new one, and the detail names the new path.
- **past end**: the file exists but is shorter than the cited line.
- **guessed**: no file at that path, and the only match is by file name, whether one tracked file or several share it.

The helper ends with `CHECKED <count>` when it scanned the packet.

### Cutoff

`SPECKIT_SOURCE_TAG_CUTOFF` sets the cutoff date, `2026-10-04` by default. A packet whose `spec.md` Created date is on or before the cutoff is skipped with one `SKIP` line naming the date and the cutoff, and so is a packet whose Created date cannot be read. A malformed cutoff value falls back to the default rather than being compared as a string.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/system-spec-kit/runtime/cli/rules/check-source-tags.sh` | Script | The `SOURCE_TAGS` rule the orchestrator runs from the registry |
| `.skilled/skills/system-spec-kit/runtime/cli/rules/check-source-tags-helper.mjs` | Script | Finds the tags, applies the cutoff, resolves each citation and prints the `SKIP`, `WARN` and `CHECKED` lines |
| `.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs` | Shared | `resolveCitation`, the citation pattern and the redirect-table loader the helper imports |
| `.skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json` | Shared | Registers `SOURCE_TAGS` at warn severity with the `SPECKIT_SOURCE_TAG_CUTOFF` flag |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/system-spec-kit/runtime/cli/tests/check-source-tags.vitest.ts` | Vitest | Nine cases in a throwaway repository, covering clean tags, skipped URLs, prose, fences and prompts, moved and gone tags, packet-root and uncommitted citations, the cutoff and its malformed-value fallback, and the warn-only severity |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/source-tag-resolution.md` | Manual playbook | Runs the helper on a research packet with and without the cutoff override |

---

## 4. SOURCE METADATA

- Group: Tooling And Scripts
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `tooling-and-scripts/source-tag-resolution.md`

Related references:
- [source-dist-alignment-enforcement.md](source-dist-alignment-enforcement.md) - the entry before this one in the category
- [spec-folder-detection-and-description.md](spec-folder-detection-and-description.md) - the entry after this one in the category
- [spec-validation-rule-engine.md](spec-validation-rule-engine.md) - the orchestrator that runs the rule from the registry
