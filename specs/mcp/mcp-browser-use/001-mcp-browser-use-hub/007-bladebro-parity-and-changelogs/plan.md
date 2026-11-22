---
title: "Implementation Plan: Phase 7: bladebro-parity-and-changelogs"
description: "Mirror Aside's install surface into Bladebro, relink the browser hub's changelogs, add entries for what shipped and run every playbook scenario that needs no operator yes."
trigger_phrases:
  - "bladebro parity and changelogs plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 7: bladebro-parity-and-changelogs

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash, Markdown, JSON |
| **Framework** | Skilled parent-hub skill layout |
| **Storage** | None |
| **Testing** | shellcheck, the mutation-class guard and its tests, sk-doc validators, parent-skill check, compiled-route guard |

### Overview
Aside's scripts and guide are the model for Bladebro's. The pin and digests stay in `references/install-and-verify.md`, and the scripts carry the same values. Changelog links follow the hub convention of one `parent` link plus one per mode. The benchmark work runs the scenarios that touch no signed-in profile and records them as new report folders.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] `bash .skilled/commands/doctor/scripts/check-mcp-mutation-class.sh` prints `GUARD PASS` and its test file prints `51 passed, 0 failed`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Mode packet inside a parent hub.

### Key Components
- **`scripts/install.sh`**: installs the pinned release through npm and checks the native binary digest.
- **`scripts/doctor.sh`**: read-only checks with the binary's own `BLADE_NO_UPDATE_CHECK=1` switch.
- **`assets/utcp-bladebro-manual.md`**: the single statement of the manual JSON.

### Data Flow
The router's MCP intent loads `mcp-wiring.md`, `cli-reference.md` and the asset. The doctor reads `.utcp_config.json` and the installed package. Nothing writes back.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Mutation-class manifest | Declares each MCP script's class | Add the `mcp-bladebro` row | Guard prints both Bladebro scripts as PASS |
| Hub leaf manifest and activation manifest | Generated routing inventory | Regenerate and re-mint | Guard reports `mcp-browser-use fresh` |

Required inventories:
- Same-class producers: the guard's discovery globs find every `mcp-*/scripts/*.sh`, and it fails an unlisted script.
- Consumers of changed symbols: the router `RESOURCE_MAP` and `leaf-manifest.json` list the new asset.
- Matrix axes: N/A. No parser or resolver changed.
- Algorithm invariant: N/A.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The two scripts' option and no-op paths | bash, shellcheck |
| Integration | Guard, parent-skill check, compiled-route guard, both routing stages | Repository checkers |
| Manual | Playbook scenarios on example.com | bdg, Code Mode, Browser |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Installed Bladebro 4.8.2 | External | Green | No live doctor run |
| Aside app running | External | Red | 13 Aside scenarios wait for an operator yes |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a gate fails after the change, or the operator rejects it.
- **Procedure**: the work is on main as `a5d1912a6c2`, `4d9c5049fca` and merge `5bfe0a856e1`. `git revert -m 1 5bfe0a856e1` undoes the advisor merge resolution, and `git revert 4d9c5049fca a5d1912a6c2` undoes the phase docs and the skill changes, including the two deleted links.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Scripts and asset | Reading Aside's scripts and the binary | Guide, router wiring |
| Changelog entries | Version bumps | Parent-skill check |
| Benchmark runs | Nothing | Reports |
<!-- /ANCHOR:phase-deps -->

---
