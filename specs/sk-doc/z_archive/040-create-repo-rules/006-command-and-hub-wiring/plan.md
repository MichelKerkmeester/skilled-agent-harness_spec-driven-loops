---
title: "Implementation Plan: Phase 6: Command and Hub Wiring"
description: "Author the command through sk-create-command rather than by hand, then register the mode across four hub files and mirror the command into the second runtime. Every registration is confirmed by reading the file back and comparing counts, because a successful write is not evidence of a correct entry."
trigger_phrases:
  - "wiring plan"
  - "four registration files"
  - "read back verification"
  - "mirror symlink"
importance_tier: "normal"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 6: Command and Hub Wiring

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown command router, YAML workflow assets, JSON registries |
| **Framework** | `sk-create-command` owns the command; eleven sibling commands are the pattern |
| **Storage** | `.opencode/commands/create/`, four registries under `.opencode/skills/sk-doc/` |
| **Testing** | Read each registry back, compare counts before and after, follow the symlink |

### Overview
Four registration files plus a command with three assets is exactly the shape where one file gets missed and the failure looks like a routing bug. Counts are taken before and after every edit, each file is parsed after writing, and the mirror is verified by following the link rather than by its existence.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phases 3-5 closed, so the mode has something worth routing to
- [x] Baseline counts recorded for all four registries

### Definition of Done
- [x] The command resolves in both runtime directories
- [x] All four registries name the mode, verified by read-back
- [x] Every registry still parses as JSON
- [x] Docs updated (spec/plan/tasks/acceptance-criteria)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Delegate the command, register by hand, verify everything by read-back. Registration is the one step where writes can succeed and change nothing.

### Key Components
- **`/create:repo-rule`**: thin router `.md` plus auto, confirm and presentation assets, authored by `sk-create-command`.
- **Four registries**: `mode-registry` for the mode contract, `hub-router` for signals, `command-metadata` for the command declaration and discriminator, `leaf-manifest` for the mode entry.
- **The mirror**: `.claude/commands/create/repo-rule.md` symlinked to the `.opencode` original.

### Data Flow
A user's words reach the hub router, whose signals select this mode over `sk-create-skill`; the command's choreography loads the hub, then the mode contract, then the presentation.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Four shared files the whole hub loads, which is the widest blast radius in this packet.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `mode-registry.json` | Twelve modes | add one | Parses; mode count 12 to 13 |
| `hub-router.json` | Routing signals | add signals | Parses; signals select this mode for rule-shaped requests |
| `command-metadata.json` | Command declarations | add one | Parses; the discriminator names when to prefer a sibling |
| `leaf-manifest.json` | Mode entries | add one | Parses; count rises by one |
| `.opencode/commands/create/` | Eleven sibling commands | add one plus three assets | The command resolves |
| `.claude/commands/create/` | Mirror symlinks | add one | Followed to a real file, not just present |
| The mode packet | The routing target | unchanged | Phases 3-5 closed it |

Required inventories:
- Same-class producers: every sibling entry in each registry, to match the file's existing shape rather than impose one.
- Consumers of changed symbols: the hub loads all four; a malformed edit breaks routing for twelve other modes.
- Matrix axes: 4 registries x (parses, count rose, entry readable).
- Algorithm invariant: exactly one new entry per registry - never zero, never two.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

`tasks.md` owns task state (T001-T014).

### Phase 1: Baseline
- [x] Counts and md5s recorded for all four registries and both command directories

### Phase 2: Author and register
- [x] Command authored through `sk-create-command`
- [x] Four registries edited, each matching its own existing entry shape
- [x] Mirror symlink created

### Phase 3: Verify
- [x] Every registry parsed and read back; counts compared; the mirror followed
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Parse | All four registries after editing | `json.loads` |
| Count delta | Exactly one new entry per registry | Before/after comparison |
| Read-back | The entry is present and correct | Load and inspect the named entry |
| Resolution | Command resolves in both runtimes | Existence in `.opencode`, followed symlink in `.claude` |
| Routing | "add a repo rule" selects this mode | Signal inspection against `sk-create-skill` |
| Packet gate | Spec docs validate | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `sk-create-command` | Internal | Green | The command would be hand-rolled and unlike its siblings |
| Phases 3-5 | Internal | Sequenced | Registering an unfinished mode makes it reachable and wrong |
| Sibling registry entries | Internal | Green | Entry shape would be invented |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a registry fails to parse, routing regresses for another mode, or the mirror dangles.
- **Procedure**: `git checkout` the four registries first - they are what other modes depend on - then remove the command, its assets and the symlink. The mode packet itself stays; it is simply unreachable again, which is its state through phases 3-5.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Baseline counts --> Author command --> Register x4 --> Mirror --> Verify all
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Baseline | Phases 3-5 | Author |
| Author command | `sk-create-command` | Register |
| Register | Author | Mirror |
| Mirror | Register | Verify |
| Verify | Mirror | Phase 7 |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Baseline | Low | minutes |
| Author and register | Medium | 2-3 hours across seven files |
| Verify | Low | under an hour |
| **Total** | | **half a day** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] md5 and entry counts recorded for all four registries
- [x] Sibling entry shapes read, so the edit matches the file's conventions

### Rollback Procedure
1. `git checkout` the four registries - other modes depend on them, so they revert first
2. Remove the command, its three assets and the mirror symlink
3. Confirm the other twelve modes still route

### Data Reversal
- **Has data migrations?** No
<!-- /ANCHOR:enhanced-rollback -->

---

