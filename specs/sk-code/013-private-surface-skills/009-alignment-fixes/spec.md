---
title: "Feature Specification: Alignment fixes for private-skill guards"
description: "Two skills-root readers added after the private-skill work follow any local-* link without the advisor's trusted-root check, the reader inventory test fails at HEAD, and three smaller gaps remain: an untested orphan skip, no advisor vocabulary for private skill roots and a source file git treats as binary."
trigger_phrases:
  - "alignment fixes"
  - "alignment fixes for private skill guards"
  - "private skill trusted root readers"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Alignment fixes for private-skill guards

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-27 |
| **Branch** | `main` (worktree `232-private-guard-fixes`) |
| **Parent Spec** | `../spec.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The sk-code surface readers in `router-replay-lib.cjs` (`outsideSurfaces`) and in the advisor plugin (`declaredSurfaces`) list the skills root and follow every entry, so an untrusted `local-*` link into a folder outside the tree is returned as a specific surface that outranks the SKILLED fallback. The skills-root reader inventory test fails at HEAD because the replay library reader is neither inventoried nor ruled, and its SCREENED reason for the plugin covers only the cache-signature reader. Three smaller gaps sit beside it: the `local-*` orphan skip in `sync-runtime-mirrors.cjs` has no test, the advisor's graph metadata has no vocabulary for private skill roots, and `canary-router.cjs` holds two literal NUL bytes, so git and the quality gate treat it as binary.

### Purpose
Both surface readers apply the advisor's own trusted-root rule, the inventory test passes, the orphan skip has a test, a private-skill-root request routes top-1 to `system-skill-advisor`, and `canary-router.cjs` is plain text with identical behavior.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ node --test .skilled/skills/sk-doc/sk-create-skill/scripts/tests/skill-root-reader-inventory.test.cjs
AssertionError: skills-root readers with no local-* rule; add one, or add the file to the inventory:
  .skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs:520
exit 1

$ node scratch-repro.cjs <HEAD router-replay-lib.cjs>   # an untrusted local-* link to a folder outside the tree
["specific:EVIL","fallback:OMEGA"]

$ node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"Make the skill advisor index skills from a git-ignored private skills folder without leaking them into the committed skill graph"}' --format json
sk-git 0.8223 | system-skill-advisor 0.82   (ambiguous: true)

$ file .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/lib/canary-router.cjs
data   (two NUL bytes, in the two orderedModes.join calls)
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Route the replay library's outside-surface reader through the advisor's `createPrivateSkillLinkCheck`, and inventory it as an include reader.
- Give the plugin's `declaredSurfaces` the same trusted-root check, narrow its SCREENED reason to the cache-signature reader, and test that an untrusted link is no longer a surface.
- Export `findOrphans` from `sync-runtime-mirrors.cjs` without changing CLI behavior, and test its `local-*` skip.
- Add private-skill-root vocabulary to the advisor's `graph-metadata.json` and regenerate `skill-graph.json` and the advisor index.
- Replace the two literal NUL bytes in `canary-router.cjs`, in the served copy and its authored source, with the `'\0'` escape.

### Out of Scope
- `skill_advisor.py`, `runtime/lib/scorer/text.ts` and sk-code's `hub-router.json` and `graph-metadata.json` - another lane edits them.
- The committed trigger index - the trigger-index-rebuild workflow regenerates it after merge.
- Removing the ambiguity flag on the D-03 probe - the requirement is top-1 only.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs` | Modify | Outside-surface reader keeps real directories and trusted `local-*` links only |
| `.opencode/plugins/system-skill-advisor.js` | Modify | Same rule in the plugin's surface reader |
| `.skilled/skills/system-skill-advisor/runtime/lib/private-skill-target.cjs` | Create | The trusted-root rule as plain CommonJS, loadable on every supported Node version |
| `.skilled/skills/system-skill-advisor/runtime/lib/private-skill-target.ts`, `runtime/tests/private-skill-target.vitest.ts` | Modify | Typed wrapper over the `.cjs`; resolution-count test spies on the shared `fs` object |
| `.skilled/skills/sk-code/sk-code-skilled/scripts/tests/declared-surfaces-parity.test.cjs` | Modify | Untrusted-link case for both readers |
| `.skilled/skills/system-skill-advisor/runtime/tests/system-skill-advisor-plugin.vitest.ts` | Modify | Linked fixtures declare their trusted root; untrusted-link case added |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/skill-root-reader-inventory.test.cjs` | Modify | Inventory entry and narrowed SCREENED reason |
| `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs` | Modify | Export `findOrphans`, guard the entry point |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/sync-runtime-mirrors.test.mjs` | Create | Orphan and `local-*` skip tests |
| `.skilled/skills/system-skill-advisor/graph-metadata.json`, `runtime/scripts/skill-graph.json` | Modify / Regenerate | Private-skill-root vocabulary |
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/lib/canary-router.cjs` and its authored source under `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/` | Modify | `'\0'` escape in place of the NUL byte |
| `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-doc/manifest.json` and its authored copy | Regenerate | Re-minted with `compiled-route-manifest.cjs refresh` after the `sk-create-skill` version step |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `node --test .skilled/skills/sk-doc/sk-create-skill/scripts/tests/skill-root-reader-inventory.test.cjs` exits 0, with the replay library inventoried as an include reader. |
| REQ-002 | Neither surface reader returns a `local-*` link whose target lies outside every trusted root, and both still return one inside a declared root, on Node 20.19.5 and the default Node; `declared-surfaces-parity.test.cjs` and the plugin vitest prove it. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | `sync-runtime-mirrors.test.mjs` passes, and fails when the `local-*` skip is removed; `sync-runtime-mirrors.cjs --check` still prints PASS. |
| REQ-004 | The D-03 probe routes top-1 to `system-skill-advisor`, and the advisor regression and validate runs match their baseline. |
| REQ-005 | `canary-router.cjs` holds no NUL byte, its typed route gold is byte-identical before and after, and the compiled-route tests pass. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The inventory test, the parity test and the plugin vitest pass, and the last two fail against the HEAD readers.
- **SC-002**: The D-03 probe prints `system-skill-advisor` first, and `file` reports `canary-router.cjs` as text.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The shared rule in `private-skill-target.cjs` | If it cannot load, the readers lose the rule | It is plain CommonJS, so it loads on Node 20, 22 and 26; a failure rejects every `local-*` link and writes one stderr line |
| Risk | The plugin vitest linked untrusted fixtures and expected them honored | High: two cases failed after the fix | The fixtures now declare their target folder in `SPECKIT_PRIVATE_SKILL_ROOTS`, the shape an operator's real setup takes |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: The trusted roots resolve at most once per reader call, and only when a `local-*` link is met.

### Security
- **NFR-S01**: An unverified link target never becomes a surface, including when the helper module fails to load.

### Reliability
- **NFR-R01**: Every existing sk-code, plugin and compiled-route test still passes.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a skills root that cannot be listed returns no outside surface, as before.
- Maximum input: a trusted link inside the tree is read through the link and through its own folder, which the parity test pins.
- Failure path: a helper module that throws on load makes the check reject every `local-*` link.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | Eleven files, about 200 lines, four skills |
| Risk | 8/25 | Changes what surface detection trusts |
| Research | 4/20 | The helper and the repro shape were known |
| **Total** | **22/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
