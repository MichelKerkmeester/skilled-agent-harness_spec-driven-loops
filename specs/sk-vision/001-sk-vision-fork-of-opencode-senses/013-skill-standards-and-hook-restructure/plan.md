---
title: "Implementation Plan: sk-vision standards + hook restructure"
description: "Three-workstream plan: rebuild docs to standard, move the Pi adapter under hooks/, and add a standalone OpenCode adapter with a build entry, all symlinked to the host load paths."
trigger_phrases:
  - "sk-vision restructure plan"
  - "sk-vision hooks plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "specs/sk-vision/001-sk-vision-fork-of-opencode-senses/013-skill-standards-and-hook-restructure"
    last_updated_at: "2026-08-17T10:28:40.000Z"
    last_updated_by: "claude"
    recent_action: "Rebuilt sk-vision docs and consolidated host adapters under hooks/."
    next_safe_action: "Author the phase spec docs and commit the sk-vision-scoped changes on v4."
    blockers: []
    key_files:
      - "specs/sk-vision/001-sk-vision-fork-of-opencode-senses/013-skill-standards-and-hook-restructure/plan.md"
      - ".opencode/skills/sk-vision/vision-runtime/scripts/build.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-013-skill-standards-and-hook-restructure"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: sk-vision standards + hook restructure

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript adapters + a Bun-built OpenCode bundle; markdown docs |
| **Framework** | sk-create-skill standards; system-skill-advisor hooks pattern |
| **Storage** | Skill-owned `hooks/` source; host symlinks |
| **Testing** | `validate_skill_package.py`, `ci-skill-root-metadata.cjs`, `bun run build`, `bun test`, symlink resolution |

### Overview
Deliver three workstreams under one phase: rebuild the docs to standard (folding the reference into SKILL.md), move the Pi adapter into `hooks/pi`, and author a standalone OpenCode adapter under `hooks/opencode` with a build entry. Every host load path becomes a symlink or re-export into `hooks/`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Standards + exemplar identified. Evidence: `sk-create-skill` templates and the `system-skill-advisor` hooks mirror.
- [x] Host load-path topology defined. Evidence: `spec.md` Files to Change.

### Definition of Done
- [x] Docs and metadata pass the standards gate. Evidence: `validate_skill_package.py --check: PASS`, `OK [S] sk-vision`.
- [x] All host symlinks resolve; OpenCode adapter builds and loads. Evidence: `implementation-summary.md` Verification.
- [ ] sk-vision-scoped changes committed on v4. Evidence: pending the commit.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Skill owns one `hooks/<runtime>/` source tree; host load paths are symlinks (Pi source `.ts`) or a symlinked build artifact (OpenCode `.js`), mirrored into `.opencode/hooks/sk-vision/<runtime>/`.

### Key Components
- **Docs** — self-contained SKILL.md + template README; `feature-catalog/` is the routed leaf.
- **Pi adapter** — `hooks/pi/sk-vision.ts`, loaded by Pi directly as TypeScript.
- **OpenCode adapter** — `hooks/opencode/sk-vision.ts` importing the shared `src` core, bundled by the runtime build to a loadable `.js`.

### Data Flow
Skill `hooks/<runtime>/` source -> host load path symlink (`.pi/extensions`, `.opencode/plugins`) and fleet mirror (`.opencode/hooks/sk-vision/<runtime>`) -> host loads the adapter -> shared vision-runtime core.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Docs to standard
- [x] Rebuild SKILL.md to the template, folding in the runtime reference. Evidence: SKILL.md 1,949 words; `package_skill.py --check: PASS`.
- [x] Rebuild README.md to the README template. Evidence: README section set matches the template scaffold.
- [x] Delete `references/runtime-reference.md`; re-point `leafRoots`; regenerate manifests. Evidence: `ci-skill-root-metadata.cjs` `OK [S] sk-vision`.

### Phase 2: Pi adapter
- [x] Move `pi/sk-vision.ts` to `hooks/pi/sk-vision.ts`. Evidence: `git status` shows the delete + the new `hooks/pi/` source.
- [x] Re-point `.pi/extensions/sk-vision.ts`; add the `.opencode/hooks/sk-vision/pi` mirror. Evidence: both resolve to the 20KB source.

### Phase 3: OpenCode adapter
- [x] Author `hooks/opencode/sk-vision.ts` importing the shared `src` core. Evidence: file present; default export type `function`.
- [x] Add the build entry; gitignore the artifact. Evidence: `build.ts` emits `hooks/opencode/sk-vision.js`; `git check-ignore` confirms it is ignored.
- [x] Symlink `.opencode/plugins/sk-vision.js`; add the `.opencode/hooks/sk-vision/opencode` mirror. Evidence: both resolve.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Standards | docs + package | `validate_skill_package.py --check`, `ci-skill-root-metadata.cjs` |
| Build | OpenCode adapter bundle | `bun run build` |
| Load | adapter entrypoint | `node --input-type=module` default-export check |
| Regression | runtime | `bun test` |
| Topology | host load paths | symlink resolution (`test -e`) |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| sk-create-skill templates + gate | Internal | Available | No standards baseline |
| system-skill-advisor hooks exemplar | Internal | Available | No canonical symlink form |
| vision-runtime Bun build | Internal | Available | OpenCode adapter cannot emit `.js` |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A host fails to load its adapter, or the docs regress the package gate.
- **Procedure**: The changes are scoped to `.opencode/skills/sk-vision/` and the four host load paths. Revert those paths (`git checkout` + restore the old `pi/sk-vision.ts` and the `.opencode/plugins/sk-vision.js` re-export) to return to the pre-restructure state; no other skill or the vision-runtime core is affected.
<!-- /ANCHOR:rollback -->
