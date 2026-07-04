---
title: Spec Folder Authoring Checklist
description: Checklist for writing spec folders that satisfy the Level contract, continuity frontmatter, metadata, and strict validation.
trigger_phrases:
  - "spec folder authoring checklist"
  - "spec folder level contract"
  - "continuity frontmatter checklist"
  - "strict validation checklist"
importance_tier: normal
contextType: implementation
version: 3.5.0.5
---

# Spec Folder Authoring Checklist

Checklist for writing spec folders that satisfy the Level contract, continuity frontmatter, metadata files, and strict validation.

## 1. OVERVIEW

### Purpose

This checklist keeps spec folder writes compatible with the system-spec-kit validator and memory resume ladder. It is the companion checklist to the spec folder write recipe and focuses on required files, anchors, metadata, and strict validation.

### Usage

- Use this when authoring a new spec folder under `specs/` or `.opencode/specs/`.
- Use this when modifying a spec folder's canonical docs, frontmatter, `_memory.continuity`, or metadata files.
- Use this when creating a phase child under a phase parent.
- Use this when a workflow writes `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`, `description.json`, or `graph-metadata.json`.

---

## 2. PRE-CHECKS

- [ ] Read the Level 1 contract files in an existing packet such as `<spec-folder>`.
- [ ] Read templates from `.opencode/skills/system-spec-kit/templates/` and the manifest entries under `.opencode/skills/system-spec-kit/templates/manifest/`.
- [ ] Verify the required Level 1 docs: `spec.md`, `plan.md`, `tasks.md`, and `implementation-summary.md`.
- [ ] Confirm required anchor counts for the selected level before writing.
- [ ] Confirm `_memory.continuity.packet_pointer` is slash-separated and relative to the specs track.
- [ ] Confirm `description.json` and `graph-metadata.json` will be refreshed after authoring.

---

## 3. STEPS

1. Decide the spec root, packet number, short name, phase child name, and documentation level.
2. Scaffold from system-spec-kit templates or `create.sh` instead of freehanding the contract.
3. Author `spec.md`, `plan.md`, `tasks.md`, and `implementation-summary.md` with canonical anchors.
4. Add `_memory.continuity` frontmatter with compact `recent_action`, ISO-8601 UTC `last_updated_at`, and a full relative `packet_pointer`.
5. Refresh `description.json` and `graph-metadata.json` with the system-spec-kit metadata scripts.
6. Run strict validation and fix every warning as a failure.
7. Record verification evidence in the implementation summary or handoff output.

---

## 4. POST-CHECKS

- [ ] Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <path> --strict`.
- [ ] grep verification: `rg -n "ANCHOR:metadata|ANCHOR:summary|ANCHOR:notation|_memory:|packet_pointer" <path>`.
- [ ] grep verification: `rg -n "\"title\"|\"contextType\"|\"derived\"" <path>/description.json <path>/graph-metadata.json`.
- [ ] Cross-runtime mirror parity check if the spec folder changes command or agent mirrors.
- [ ] Confirm the companion recipe was followed: `.opencode/skills/sk-code/code-implement/assets/opencode/recipes/spec_folder_write.md`.

---

## 5. RELATED RESOURCES

- sk-doc templates and system-spec-kit/templates/manifest/ (source-of-truth for document contract rules)
- Prior example: `<spec-folder>`
- Verification recipes: `.opencode/skills/sk-code/code-implement/assets/opencode/recipes/spec_folder_write.md`
