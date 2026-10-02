---
title: "Implementation Plan: Phase 1: skill-and-command-removal"
description: "Remove the skill, both rewrite commands, runtime mirrors and OpenCode projection plugin, then clear active integration references. Verify that the retained advisor route-exclusion mechanism and mirror generators still pass their focused checks."
trigger_phrases:
  - "implementation plan"
  - "skill removal approach"
  - "rewrite command removal checks"
  - "mirror sync verification"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1: skill-and-command-removal

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, Node.js, shell and generated runtime prompt/skill copies |
| **Framework** | Repository skill and command routing; OpenCode chat-message plugin |
| **Storage** | Version-controlled repository files; no application data store |
| **Testing** | Node.js sync checks and Vitest in the system-skill-advisor runtime package |

### Overview
Remove the canonical skill, its Hermes mirror, both rewrite commands, all command/prompt mirrors and the OpenCode plugin with its test. Remove active documentation, install, routing and retrieval references, but keep historical specs and changelog files untouched. The route-exclusion list becomes empty while its loader and filter remain supported.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The parent spec's phase boundary and history exclusions are reflected in the file inventory.
- [x] The baseline commit `ecf2897455` is available for scoped diff inspection.
- [x] Owners of the active sk-doc and infrastructure reference cleanup have identified their changed paths.

### Definition of Done
- [x] The authorized skill, command, prompt and plugin surfaces are absent.
- [x] The advisor route-exclusion mechanism remains and its focused Vitest test passes.
- [x] Codex, Hermes and Pi prompt sync plus Hermes skill sync pass with `--check`.
- [x] The final non-historical live-reference search is empty after phase 2.
- [x] The recursive strict packet validator reports `RESULT: PASSED` with 0 errors and 0 warnings.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Remove canonical sources and their generated/runtime consumers as one bounded feature set, then check the source-to-mirror contracts. Keep generic advisor routing behavior intact.

### Key Components
- **Canonical skill package** (`.skilled/skills/sk-communication/`): removed with its package changelog.
- **Runtime command and prompt copies**: removed from `.skilled`, Claude, Cursor, Codex, Pi and Hermes command surfaces.
- **OpenCode plugin** (`.opencode/plugins/sk-communication-projection.js`): removed with its test.
- **Advisor route-exclusion loader** (`.skilled/skills/system-skill-advisor/runtime/lib/route-exclusions.ts`): retained; only the skill-specific config entry and assertions change.
- **Active references and install paths**: cleaned in the sk-doc, advisor, sk-git, CI, README and retrieval-fixture files assigned to this phase.

### Data Flow
Canonical command and prompt sources feed runtime mirrors. The phase removes the sources and confirms that the generators no longer emit the feature. The advisor reads its exclusion list through a general loader, so an empty list must remain a valid input rather than a reason to remove the loader.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

The phase removes a cross-runtime feature and changes routing metadata, so the full surface inventory applies.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.skilled/skills/sk-communication/` and `.hermes/skills/sk-communication/` | Canonical skill and Hermes mirror | Delete | `test ! -d` checks in acceptance criteria |
| Rewrite command sources and runtime prompt/command mirrors | Operator entry points for two rewrite commands | Delete | Check every listed path, then run Codex, Hermes and Pi prompt sync checks |
| `.opencode/plugins/sk-communication-projection.js` and its test | Projects assistant output in OpenCode | Delete | `test ! -e` checks and scoped diff review |
| Advisor route-exclusion config and test | Keeps selected skills off advisor routing | Remove only the skill-specific entry; retain mechanism | Focused Vitest run from the runtime package |
| sk-doc, sk-git, CI, README and retrieval fixture paths | Installation, provisioning, discoverability and counts | Remove live references | Scoped `rg` plus final `git grep` outside history |
| Historical specs outside this authorized packet and historical changelogs | Record prior work | Unchanged | `git -c core.fsmonitor=false diff --name-only ecf2897455 -- specs ':(exclude)specs/sk-communication/007-sk-communication-removal/**' ':(glob)**/changelog/**' ':(exclude).skilled/changelog/sk-communication/**'` prints nothing |

Required inventories:
- Same-class producers: `rg -n 'sk-communication|rewrite:response|rewrite-response|communication-projection' .skilled/skills/sk-doc .skilled/skills/system-skill-advisor .skilled/skills/sk-git .github README.md AGENTS.md 'REPO RULES.md'`.
- Consumers of changed surfaces: `rg -n 'sk-communication|rewrite:response|rewrite-response|communication-projection' . --glob '!specs/**' --glob '!**/changelog/**'` after phase 2; the result must be empty.
- Matrix axes: artifact class (skill, command, plugin, active integration) by runtime/generator (Claude, Cursor, Codex, Pi, Hermes, OpenCode); record each required removal/check in tasks.md.
- Algorithm invariant: the advisor loader still accepts an empty exclusion list and continues to route other eligible skills; the focused Vitest suite checks this contract.
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
| Unit | Empty, missing, malformed and configured advisor exclusion lists; non-excluded skills still route | `npm --prefix .skilled/skills/system-skill-advisor/runtime test -- tests/route-exclusions.vitest.ts` |
| Integration | Canonical prompt/skill sources and generated runtime mirrors | Four `node ... --check` commands listed in acceptance-criteria.md |
| Manual | Confirm exact deleted path set and absence of active references while keeping history untouched | `test -e` / `test -d`, `git diff --name-status ecf2897455 --`, and scoped `rg` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Baseline commit `ecf2897455` | Internal | Available by operator instruction | Cannot compare the deletion set with the pre-change tree |
| Prompt and Hermes skill generators | Internal | Retained | Mirror checks cannot establish generated state |
| Advisor route-exclusion test package | Internal | Retained | Empty-list behavior cannot be checked |
| Phase 2 rule edits | Internal | Complete | The final live-reference sweep found no dead runtime consumer |
| sk-doc and infrastructure cleanup lanes | Internal | Complete | Active references were cleared and the checks passed |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A retained runtime consumer still requires the skill or either command, a mirror generator emits stale copies, or the advisor mechanism fails with an empty list.
- **Procedure**: Restore only the affected canonical tracked source from `ecf2897455`, leave unrelated lane edits intact, regenerate its mirrors through the owning script, then rerun the focused route and mirror checks.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Scope and baseline inventory ──► Delete canonical sources and runtime surfaces ──► Active-reference cleanup
                                                              │                              │
                                                              └──► Empty-list route check ─────┴──► Mirror checks and handoff
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Scope and baseline inventory | Parent spec and `ecf2897455` | Deletion and cleanup |
| Canonical and runtime deletion | Confirmed surface inventory | Mirror checks |
| Active-reference cleanup | Canonical source inventory | Final cross-phase sweep |
| Verification | Deletion, cleanup and retained advisor mechanism | Phase 2 handoff |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 30-60 minutes to confirm paths and ownership |
| Core Implementation | High | 4-8 hours for the 333-file deletion set and active-reference cleanup |
| Verification | Medium | 1-2 hours for mirror checks, the advisor test and scoped review |
| **Total** | | **5.5-11 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Identify any retained caller that still needs a removed source.
- [ ] Confirm which canonical files were changed by this phase before restoring anything.
- [ ] Keep `specs/` and every `changelog/` file outside a rollback selection.

### Rollback Procedure
1. Restore only the affected canonical source files from `ecf2897455`.
2. Regenerate the corresponding runtime mirrors with their owning scripts.
3. Run the route-exclusions Vitest command and all four mirror `--check` commands.
4. Re-run the scoped active-reference search and inspect the diff for unrelated changes.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Not applicable; the phase changes version-controlled source, mirror and configuration files only.
<!-- /ANCHOR:enhanced-rollback -->

---
