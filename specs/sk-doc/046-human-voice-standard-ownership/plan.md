---
title: "Implementation Plan: Human Voice Rules standard ownership and packet template conformance"
description: "Move one markdown file into the packet that parses it, repoint every live consumer including a run-time parser and a hub router contract, and conform four packet docs to the skill templates."
trigger_phrases:
  - "hvr move implementation plan"
  - "repoint hvr consumers"
  - "leaf alias diskpath change"
  - "golden snapshot substitution"
  - "packet template conformance plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Human Voice Rules standard ownership and packet template conformance

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, JSON, Python 3, Node |
| **Framework** | sk-doc parent hub (two-tier compiled routing), system-spec-kit templates |
| **Storage** | None. Files on disk plus one generated manifest |
| **Testing** | Vitest for spec-kit, `hvr_scan.py` fixtures, four hub gate scripts |

### Overview

One markdown file moves from `sk-doc/shared/references/` into
`sk-doc/sk-create-with-human-voice/references/`. The move is trivial. The work is finding
every live consumer, because the file is parsed at run time by a Python scanner, addressed
by a hub router contract that fails when a path does not resolve, projected into a
generated manifest through an alias, and named by ten spec-kit templates whose output a
golden snapshot records. Alongside it, four packet documents are brought onto the shapes
`sk-create-skill/assets/skill/` publishes.
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
- [x] Tests passing: scanner fixtures, negative control, spec-kit golden snapshot
- [x] Docs updated (spec/plan/tasks/acceptance-criteria/implementation-summary)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Parent hub with nested workflow packets. The hub owns routing metadata at its root and a
`shared/` backbone whose entry rule is stated in `shared/README.md`: a resource earns a
place there by having consumers in two or more packets, and a resource with exactly one
consumer belongs inside that packet. The Human Voice Rules had one applying packet, so the
move is the rule being applied rather than an exception to it.

### Key Components

- **`references/hvr-rules.md`**: the standard. Read, never copied.
- **`scripts/hvr_scan.py`**: parses the standard's sections at run time and fails closed
  when the parse comes back thinner than its floors.
- **`ROUTER.md` `RESOURCE_MAP`**: every path must resolve on disk and dual-read to a typed
  pair present in `leaf-manifest.json`.
- **`leaf-aliases.json`**: lets `sk-create-quality-control` address the file as its own
  `references/hvr-rules.md` while the file lives in a different packet.
- **spec-kit templates**: emit an `HVR_REFERENCE` comment into generated spec docs. No code
  parses that comment, so it is a pointer for a reader and a golden-snapshot line.

### Data Flow

A request routes to a mode, `ROUTER.md` names leaf paths, the leaf-resource contract turns
each path into a typed `(workflowMode, leafResourceId)` pair, and `leaf-manifest.json` is
the committed record of every valid pair. The scanner sits outside that flow: it resolves
the standard from its own file location, which is why a move that satisfies the router can
still break the scanner, and why the scanner is verified separately.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `scripts/hvr_scan.py` | Resolves and parses the standard at run time | Update `DEFAULT_RULES_PATH` to `parents[1]` | Clean fixture exit 0, dirty fixture exit 1, renamed section exit 2 |
| `ROUTER.md` `RESOURCE_MAP` | Declares the leaf paths the HVR and FULL_INVENTORY intents load | Update two rows | `parent-skill-check` 12a-router-contract |
| `leaf-aliases.json` | Projects the file into `sk-create-quality-control` | Update `diskPath` | `generate-leaf-manifest.cjs --check` byte drift |
| `leaf-manifest.json` | Generated record of every typed pair | Regenerate | Same check, plus 10b-byte-drift |
| Hub playbook scenarios | Routing gold for the HVR intent | Update path, and the mode for the two single-resource scenarios | `validate-playbook-topology.cjs` |
| spec-kit templates and examples | Emit the HVR reference line | Update ten files | Golden snapshot |
| spec-kit fixtures | Record that line as fixture data | Update seven files | Spec-kit scripts test lane |
| Golden snapshot | Byte record of rendered template output | Substitute the one changed line | Snapshot test green with no obsolete entries |
| Consumer docs across four skills | Link to the standard | Repoint by relative depth | Full-text search returns only frozen artifacts |

Required inventories:
- Every referencing file: `rg -l "hvr-rules" --hidden -g '!.git'` (678 files).
- Live consumers only: the same with `-g '!specs/**'` (64 files, of which benchmark
  reports and released changelog entries are frozen).
- Relative-path variants: `./`, `../`, `../../`, `../../../` and the repo-root-absolute
  form each need a different replacement, so a single blanket substitution is wrong.
- Algorithm invariant: the scanner keys section lookup on H2 titles, not numbers. A move
  must not touch the standard's section titles, and the negative control proves the parser
  still refuses a standard whose section 6 was renamed.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`; it owns the Setup, Implementation, and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Scanner resolution and fail-closed floors | `hvr_scan.py` against its two fixtures plus a mutated standard |
| Integration | Hub routing contract, manifest freshness, playbook gold | `parent-skill-check.cjs`, `generate-leaf-manifest.cjs --check`, `validate-playbook-topology.cjs` |
| Regression | Rendered template output | `scaffold-golden-snapshots.vitest.ts` and the spec-kit scripts test lane |
| Manual | Prose that now claims the standard lives elsewhere | Read every edited passage, then scan it with the packet's own scanner |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `generate-leaf-manifest.cjs` | Internal | Green | A hand-edited manifest fails 10b-byte-drift |
| `frontmatter-version.mjs` | Internal | Green | Versions would be hand-picked rather than derived |
| Spec-kit vitest suite | Internal | Partial | The mcp-server lane is 694 files and hours long, so the scoped scripts lane carries the gate |
| Spec-kit Memory MCP | External | Red | Unreachable this session, so packet metadata is generated by script rather than indexed |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: any hub gate turns red, or the scanner stops resolving the standard.
- **Procedure**: nothing is committed, so `git status` lists every changed path. Move
  `references/hvr-rules.md` back to `shared/references/`, revert `DEFAULT_RULES_PATH` to
  `parents[2] / "shared" / "references"`, invert the path substitution across the listed
  files, and regenerate `leaf-manifest.json`. The substitution is a pure string swap in
  both directions, which is what makes the revert mechanical.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Baselines) ──► Phase 2 (Move + repoint) ──► Phase 3 (Regenerate) ──► Phase 4 (Verify)
                                     │
                                     └──► Phase 2b (Template conformance) ──┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Baselines | None | Everything. A gate with no captured baseline cannot be shown unchanged |
| Move + repoint | Baselines | Regenerate |
| Template conformance | Move + repoint | Verify |
| Regenerate | Move + repoint | Verify |
| Verify | Regenerate, Template conformance | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Baselines | Low | 20 minutes, most of it waiting on test lanes |
| Move and repoint | Medium | 60 minutes, dominated by classifying 64 non-frozen references |
| Template conformance | Low | 30 minutes |
| Verification | Medium | 40 minutes |
| **Total** | | **2.5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Baselines captured into `scratch/baseline/` before the first edit
- [x] No feature flag needed. The change is file layout, not behavior
- [x] Gate scripts identified and run clean before editing

### Rollback Procedure
1. Move `sk-create-with-human-voice/references/hvr-rules.md` back to `shared/references/`.
2. Revert `DEFAULT_RULES_PATH` in `hvr_scan.py`.
3. Invert the path substitution across the files listed in `spec.md` section 3.
4. Run `generate-leaf-manifest.cjs --write`, then rerun the four gates.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A. The only generated artifacts are `leaf-manifest.json`, which
  regenerates from disk, and the golden snapshot, whose one changed line inverts with the
  same substitution.
<!-- /ANCHOR:enhanced-rollback -->

---
