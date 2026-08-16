---
title: "Feature Specification: sk-vision 006-002 package hygiene"
description: "Neutralize vision-runtime/package.json publish/provenance, delete the .venv residue, prove hermetic tests, rebuild dist, sweep identifiers."
trigger_phrases:
  - "sk-vision package hygiene"
  - "sk-vision publishConfig"
  - "sk-vision venv cleanup"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-vision/001-sk-vision-fork-of-opencode-senses/006-skill-contract-realignment/002-package-hygiene"
    last_updated_at: "2026-08-16T12:00:00.000Z"
    last_updated_by: "pi"
    recent_action: "Created 006-002 copy pack."
    next_safe_action: "Implement File 1 (package.json) from this spec copy pack."
    blockers: []
    key_files:
      - "spec.md"
      - ".opencode/skills/sk-vision/vision-runtime/package.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-006-002-package-hygiene"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: sk-vision 006-002 package hygiene

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
| **Phase** | 2 of 2 |
| **Predecessor** | 001-skill-md-and-readme |
| **Successor** | 007-pi-input-images |
| **Handoff Criteria** | package.json neutralized; `.venv` gone; `bun run build && bun test` green without `.venv`; `rg` sweep clean; LICENSE notice verified. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of `006-skill-contract-realignment`.

**Scope Boundary**: `vision-runtime/` package files only (package.json, LICENSE check, `.venv`, dist rebuild, .gitignore). No doc rewrites. No `context/` edits.

**Dependencies**:
- 001-skill-md-and-readme (manifest regeneration ordering).

**Deliverables**:
- Neutralized `.opencode/skills/sk-vision/vision-runtime/package.json`
- Deleted `.opencode/skills/sk-vision/vision-runtime/.venv`
- Rebuilt `dist/plugin.js` + `dist/python/runtime.py`
- `.gitignore` for `vision-runtime/` (if absent)
- Clean `rg` sweep + hermetic test proof

**Changelog**:
- Record the package.json change in the skill `changelog/` only if one exists; otherwise record in this child's implementation-summary.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`vision-runtime/package.json` still points its `repository` at the upstream `opencode-senses` repo, keeps `publishConfig.access: public` and a `publish:npm` script (so a stray `npm publish` would ship this fork to npm), names the upstream author, and describes the package as "for text-only OpenCode models" even though Pi is a first-class host. A 22MB python3.9 `.venv` sits in the runtime tree, and the build child recorded that tests depended on it ("after `.venv` + Pillow").

### Purpose
Make the fork hygienic: no accidental publishing, no upstream identity leakage, no committed interpreter residue, and tests that provably pass without it.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `vision-runtime/package.json`: remove `publishConfig`, remove `publish:npm` script, replace upstream `repository`/`author` URLs with fork-neutral values or remove them, fix the `description` for dual-host reality, keep `name: sk-vision`, keep `license: MIT`, keep the upstream attribution in LICENSE (legal, not identity).
- Delete `.opencode/skills/sk-vision/vision-runtime/.venv` (22MB python3.9 residue).
- Prove `bun run build` and `bun test` pass WITHOUT `.venv`. If `python/runtime.test.ts` needs Pillow, the test must provision its own interpreter (documented auto-provision) or be marked with a clean SKIP that names the blocker — never restore the residue.
- Rebuild `dist/` so it matches `src/` after any source-adjacent change.
- Add `vision-runtime/.gitignore` if absent (node_modules, .venv, *.pyc, __pycache__).
- Verify LICENSE keeps the Adarsh MIT line + modification notice.

### Out of Scope
- SKILL.md/README/references (001 owns).
- Runtime behavior changes (007 owns the pi factory; no src/ logic changes here).
- `context/` (read-only dump).
- npm publishing decisions — default is "never"; if the operator explicitly overrides, stop and get a written decision first.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-vision/vision-runtime/package.json` | Modify | Neutralize publish/provenance/description |
| `.opencode/skills/sk-vision/vision-runtime/.venv` | Delete | Residue removal |
| `.opencode/skills/sk-vision/vision-runtime/.gitignore` | Create if absent | Hygiene |
| `.opencode/skills/sk-vision/vision-runtime/dist/**` | Rebuild | Match src |

### Implementer copy pack (follow exactly)

Stop and report if any of these is true: you are about to change runtime `src/` or `python/` logic; you are about to edit `context/`; you are about to restore or re-create a committed venv; you are about to publish anything.

**File 1 — `package.json`.** Keep: `name` (`sk-vision`), `version` (`0.2.0`), `type`, `license` (MIT), `scripts` minus `publish:npm`, `dependencies`/`devDependencies`, `main`, `exports`, `files`, `engines`. Remove: `publishConfig` entirely, the `publish:npm` script. Replace: `repository` with a fork-neutral object (e.g. `{ "type": "git", "url": "git+https://example.invalid/sk-vision.git" }` OR omit the field — pick omit unless the operator says otherwise, then say why in the summary), `author` with `{ "name": "sk-vision contributors" }` (keep the Adarsh copyright in LICENSE — that is the legal attribution), `description` → "Local vision runtime for text-only coding models: OCR, detect, inspect and analysis tools via Moondream, hosted as the sk-vision skill runtime for OpenCode and Pi." Update `keywords` to drop upstream branding if any remains. Do NOT add `publishConfig` anywhere else.

**File 2 — `.venv` deletion.** `rm -rf .opencode/skills/sk-vision/vision-runtime/.venv`. Then prove hermiticity:

```bash
cd .opencode/skills/sk-vision/vision-runtime
bun run build   # must exit 0
bun test        # must exit 0 WITHOUT .venv
```

If `bun test` fails because `python3`/Pillow is missing, inspect `python/runtime.test.ts` and `scripts/build.ts` to see how the test locates the interpreter. The intended fix is auto-provisioning (the runtime already provisions a venv under `~/.cache/sk-vision/venv` on demand — tests should exercise that path or skip cleanly with a named blocker). Do not commit a new venv.

**File 3 — `.gitignore`** (create only if absent): `node_modules/`, `.venv/`, `__pycache__/`, `*.pyc`, `.DS_Store`.

**File 4 — rebuild + sweep.**

```bash
cd .opencode/skills/sk-vision/vision-runtime
bun run build
rg -n -i "opencode-senses" . --glob '!bun.lock' --glob '!LICENSE'   # exit 1 expected after fix
rg -n "SENSES_" . --glob '!LICENSE'                                   # exit 1 expected
rg -n "publishConfig|publish:npm" package.json                        # exit 1 expected
```

Also verify the LICENSE still carries the upstream copyright line: `rg "Adarsh" .opencode/skills/sk-vision/vision-runtime/LICENSE`.

Close this child with:

```bash
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/sk-vision/001-sk-vision-fork-of-opencode-senses/006-skill-contract-realignment/002-package-hygiene --strict
```
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No accidental publishing | `publishConfig` and `publish:npm` absent from package.json (`rg` exit 1) |
| REQ-002 | No upstream identity in package.json | `rg -i "opencode-senses|itsmeadarsh" package.json` exit 1 |
| REQ-003 | `.venv` deleted | `test ! -d .opencode/skills/sk-vision/vision-runtime/.venv` exit 0 |
| REQ-004 | Hermetic build + tests | `bun run build && bun test` exit 0 without `.venv` |
| REQ-005 | Sweep clean | residual identifier `rg` exit 1 (LICENSE and bun.lock exempt) |
| REQ-006 | LICENSE attribution preserved | `rg "Adarsh" LICENSE` exit 0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-P1 | Description dual-host accurate | package.json description mentions OpenCode and Pi |
| REQ-P2 | No scope creep | Files outside Files to Change untouched |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- [ ] `rg -n "publishConfig|publish:npm" package.json` exit 1
- [ ] `rg -i "opencode-senses|itsmeadarsh" package.json` exit 1
- [ ] `test ! -d vision-runtime/.venv` exit 0
- [ ] `bun run build && bun test` exit 0 (record output)
- [ ] identifier sweep exit 1 (LICENSE/bun.lock exempt, recorded)
- [ ] `rg "Adarsh" LICENSE` exit 0
- [ ] This child `validate.sh --strict` exits 0
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Tests hard-depend on the deleted venv | High | Provision-on-demand path exists in the runtime; document the SKIP with blocker |
| Risk | Removing author/repo fields confuses provenance | Low | LICENSE keeps the upstream copyright; summary explains the choice |
| Dependency | 001-skill-md-and-readme | Low | Manifest regeneration already done there |
<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

### Answered Questions
- **Q**: Can the fork keep the upstream repository URL? **A**: No — upstream identity stays only in the LICENSE attribution.

### Open Questions
- Whether to omit the `repository` field or use a placeholder URL (default: omit; record the choice in the summary).
<!-- /ANCHOR:questions -->

