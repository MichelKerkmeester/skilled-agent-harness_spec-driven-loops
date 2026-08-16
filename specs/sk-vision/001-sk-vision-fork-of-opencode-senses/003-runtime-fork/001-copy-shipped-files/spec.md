---
title: "Feature Specification: sk-vision copy shipped dump files"
description: "Copy the locked Senses v0.2.0 file list into vision-runtime/. Do not edit context/. Do not rebrand or build in this child."
trigger_phrases:
  - "sk-vision copy dump"
  - "sk-vision vision-runtime copy"
  - "sk-vision shipped files"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-vision/001-sk-vision-fork-of-opencode-senses/003-runtime-fork/001-copy-shipped-files"
    last_updated_at: "2026-08-16T07:45:00.000Z"
    last_updated_by: "cursor-grok"
    recent_action: "Authored nested-phase copy pack and L1 suite."
    next_safe_action: "Implement files from this child's spec.md copy pack."
    blockers: []
    key_files:
      - "spec.md"
      - ".opencode/skills/sk-vision/vision-runtime/src/plugin.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-001-sk-vision-fork-of-opencode-senses-003-runtime-fork-001-copy-shipped-files"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: sk-vision copy shipped dump files

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-08-16 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 4 |
| **Predecessor** | None |
| **Successor** | 002-rebrand-identifiers |
| **Handoff Criteria** | Listed files exist under vision-runtime/ and context/ is unchanged. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of `003-runtime-fork`.

**Scope Boundary**: cp only the listed files. No string rewrite. No bun install.

**Dependencies**:
- 002-skill-scaffold Complete; SKILL.md exists.

**Deliverables**:
- Exact copied file set under .opencode/skills/sk-vision/vision-runtime/.

**Changelog**:
- When this phase closes, refresh the matching file in the parent changelog using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The skill root is empty of runtime source. Later rebrand and build have nothing to edit.

### Purpose
Copy shipped v0.2.0 files into vision-runtime/ without touching context/.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- mkdir destination trees
- cp the locked file list
- Leave dump files unread-write

### Out of Scope
- Editing context/ — forbidden
- Copying PLAN.md, .github/, dump opencode.json, media/, FUNDING files
- Identifier rewrite — next child
- bun build, GPU, host adapters

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-vision/vision-runtime/src/runtime/client.ts` | Create | Copy from dump |
| `.opencode/skills/sk-vision/vision-runtime/src/plugin.ts` | Create | Copy from dump |
| `.opencode/skills/sk-vision/vision-runtime/python/runtime.py` | Create | Copy from dump |
| `.opencode/skills/sk-vision/vision-runtime/package.json` | Create | Copy from dump |
| `.opencode/skills/sk-vision/vision-runtime/LICENSE` | Create | Copy from dump |

### Implementer copy pack (follow exactly)

Stop and report if any of these is true: `002-skill-scaffold` is still Planned; SKILL.md is missing; you are about to edit `context/`; you are about to copy `PLAN.md`, `.github/`, `opencode.json`, `media/`, or FUNDING files; you are about to rewrite identifiers; you are about to create `.opencode/plugins/sk-vision.js` or `.pi/extensions/sk-vision.ts`; you are about to invent `sk_vision_query`.

Dump root (read-only): `specs/sk-vision/001-sk-vision-fork-of-opencode-senses/context/`
Destination: `.opencode/skills/sk-vision/vision-runtime/`

```bash
DUMP="specs/sk-vision/001-sk-vision-fork-of-opencode-senses/context"
DEST=".opencode/skills/sk-vision/vision-runtime"
mkdir -p "$DEST"/src/{runtime,providers,opencode,core} "$DEST"/python "$DEST"/scripts
cp "$DUMP/src/runtime/client.ts" "$DEST/src/runtime/"
cp "$DUMP/src/providers/types.ts" "$DEST/src/providers/"
cp "$DUMP/src/providers/photon.ts" "$DEST/src/providers/"
cp "$DUMP/src/providers/photon.test.ts" "$DEST/src/providers/"
cp "$DUMP/src/plugin.ts" "$DEST/src/"
cp "$DUMP/src/opencode/tools.ts" "$DEST/src/opencode/"
cp "$DUMP/src/opencode/attachments.ts" "$DEST/src/opencode/"
cp "$DUMP/src/core/context-builder.ts" "$DEST/src/core/"
cp "$DUMP/python/runtime.py" "$DEST/python/"
cp "$DUMP/python/runtime.test.ts" "$DEST/python/"
cp "$DUMP/scripts/build.ts" "$DEST/scripts/"
cp "$DUMP/package.json" "$DEST/"
cp "$DUMP/tsconfig.json" "$DEST/"
cp "$DUMP/LICENSE" "$DEST/"
```

Do not copy: `PLAN.md`, `opencode.json`, `.github/`, `media/`, `FUNDING.yml`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, `bun.lock` (optional later if bun install needs it). README.md is optional operator copy, not required.

Proof:

```bash
test -f .opencode/skills/sk-vision/vision-runtime/src/plugin.ts
test -f .opencode/skills/sk-vision/vision-runtime/python/runtime.py
test -f .opencode/skills/sk-vision/vision-runtime/LICENSE
git diff --exit-code -- specs/sk-vision/001-sk-vision-fork-of-opencode-senses/context
```

Close this child with:

```bash
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/sk-vision/001-sk-vision-fork-of-opencode-senses/003-runtime-fork/001-copy-shipped-files --strict
```
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Copy only the locked list | Each listed dest file exists |
| REQ-002 | context/ unchanged | git diff --exit-code on context/ |
| REQ-003 | Forbidden dump extras absent | No PLAN.md or dump opencode.json in dest |
| REQ-004 | No identifier rewrite yet | senses_ tool keys still present until next child |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-P1 | No extra scope | Files outside Files to Change stay untouched |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- [ ] Listed dest files exist
- [ ] context/ has no diff
- [ ] PLAN.md and dump opencode.json are not in dest
- [ ] This child validate.sh --strict exits 0
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Editing context/ | High | Read-only dump; git diff proof |
| Risk | Copying roadmap extras | High | Locked cp list |
| Dependency | 002-skill-scaffold Complete | High | Stop if Planned |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

### Answered Questions
- **Q**: Copy bun.lock? **A**: Optional later if bun install needs it, not this child's required list.

### Open Questions
- None.
<!-- /ANCHOR:questions -->
