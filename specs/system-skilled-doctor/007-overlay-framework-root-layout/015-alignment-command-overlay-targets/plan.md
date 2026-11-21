---
title: "Implementation Plan: Phase 15: alignment-command overlay targets"
description: "Adds an overlay-layout topic to /local-doc-alignment and an overlays target to /local-skilled-alignment. Both find the overlay folder through .skilled-overlays.json, and new node tests prove each with and without that file."
trigger_phrases:
  - "alignment command overlay targets plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 15: alignment-command overlay targets

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js (CommonJS), YAML and JSON command assets |
| **Framework** | The repository's command assets, no framework |
| **Storage** | None |
| **Testing** | `node --test` |

### Overview
Adds an overlay-layout topic to /local-doc-alignment and an overlays target to /local-skilled-alignment. Both find the overlay folder through .skilled-overlays.json, and new node tests prove each with and without that file.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `node --test .skilled/commands/assets/local-skilled-alignment/tests/*.test.cjs` and the new ldoc test file exit 0, and `route-validate.sh` prints `OK`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other: config-driven command assets with a small resolver.

### Key Components
- **`overlay-layout` topic**: names the overlay folder's READMEs and the engine docs for `/local-doc-alignment`.
- **`overlays` target**: resolves the overlay folder for `/local-skilled-alignment` through `resolve-scope.cjs` and `surface-map.yaml`.

### Data Flow
Each command reads `.skilled-overlays.json` at the vendored tree root, resolves the folder it names relative to that root, refuses a path that leaves the project, and hands the folder's files to its existing audit-and-fix flow.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup reads both commands and their assets. Implementation adds the topic, then the target, each with its tests. Verification runs both suites and `route-validate.sh`. `tasks.md` holds the ordered work.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Topic resolution with and without `.skilled-overlays.json` | `node --test` |
| Unit | `overlays` target resolution and the out-of-project refusal | `node --test` |
| Contract | Router, presentation and target parity | `route-validate.sh` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `.skilled-overlays.json` in a vendored tree | Internal | Green | The topic falls back to the engine docs |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: either command misresolves a scope or `route-validate.sh` fails.
- **Procedure**: copy the private assets back from `/tmp/ovl-gates/private-backup/`; the change is not in git, because both commands are gitignored.
<!-- /ANCHOR:rollback -->

---

