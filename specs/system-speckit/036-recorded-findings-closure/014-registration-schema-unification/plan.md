---
title: "Implementation Plan: Phase 14: registration-schema-unification"
description: "One canonical hook-set source feeds a per-runtime template generator that reproduces the four JSON registration files' exact existing dialects, verified byte-for-byte before anything is allowed to change."
trigger_phrases:
  - "registration schema unification"
  - "hook registration drift"
  - "one behavioral contract five schemas"
  - "generated hook registration check"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 14: registration-schema-unification

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js (CommonJS), matching `sync-runtime-mirrors.cjs` and `sync-prompts.cjs` |
| **Framework** | None. Extends the existing generate-and-check convention in `runtime/cli/runtime-mirrors/` |
| **Storage** | None. The canonical source and its generated output are all checked-in files |
| **Testing** | Byte-for-byte comparison of generated output against the current committed files, plus the existing hook test suites named in success criteria |

### Overview
One canonical hook-set source (JSON or a small TS/CJS module, decided during implementation) names every hook once: its concern, the runtime events it binds to and the script it invokes. A new generator reads that source and, for each of the four JSON-registering runtimes, emits that runtime's exact structural dialect: Claude and Codex and Devin's nested `{matcher, hooks:[{type,command,timeout}]}` array-per-event shape (with each runtime's own project-dir variable and matcher convention), Cursor's flat unwrapped array with no matcher and Devin's un-nested top-level event map. Pi gets a verification pass instead of a generated file, since its registration is the presence of a symlink, not a JSON structure. The first generator run must reproduce all four files byte-for-byte against what is committed today, proving the canonical source models each dialect correctly before the pipeline is trusted for any future change.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Generator's `--check` mode exits 0 against the repository
- [ ] Docs updated (spec/plan/tasks, hooks README, CI workflow)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Generate-and-check, extending the pattern `sync-runtime-mirrors.cjs` and `sync-prompts.cjs` already use elsewhere in this same directory: one canonical source, a generator with per-target template logic and a `--check` mode.

### Key Components
- **Canonical hook-set source**: names every hook's concern, its per-runtime event bindings (in each runtime's own vocabulary, since Claude/Codex/Devin use PascalCase, Cursor uses camelCase and Pi uses its own lowercase event names), the script it invokes and each runtime's matcher value where that runtime's schema carries one.
- **Per-runtime template functions**: four small functions inside the generator, one per JSON-registering runtime, each responsible for that runtime's nesting shape, matcher dialect, project-dir variable name and fallback-envelope text. This is deliberately not one shared template with per-runtime flags, because the four shapes diverge on independent axes and a single parameterized template would be harder to verify against each real file than four short, direct ones.
- **Pi verification pass**: reads the canonical source's Pi-applicable hooks and confirms a matching symlink exists under `.pi/extensions/` for each, without writing anything (Pi's registration is hand-maintained per `.pi/extensions/README.md`, and this phase only checks it stays consistent with the same canonical list the other four runtimes now derive from).

### Data Flow
The canonical source is the single input. The generator's four template functions each produce one runtime's JSON output. A `--check` run diffs that output against the committed file and reports per-file, per-hook drift. The Pi verification pass reads the same source's Pi-applicable subset and cross-references it against a directory listing of `.pi/extensions/`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.claude/settings.json` | Hand-authored, `hooks` key mixed with unrelated runtime settings | Update: `hooks` key becomes generated. Every other key untouched | Diff of the non-`hooks` keys before and after is empty |
| `.codex/hooks.json` | Hand-authored, whole file is the hooks object | Update: whole file becomes generated | Byte-for-byte diff against pre-change content is empty on the first run |
| `.cursor/hooks.json` | Hand-authored, `{version, hooks}` with no matcher field, unwrapped commands | Update: whole file becomes generated | Byte-for-byte diff against pre-change content is empty on the first run |
| `.devin/hooks.v1.json` | Hand-authored, event names at top level, regex-anchored matchers | Update: whole file becomes generated | Byte-for-byte diff against pre-change content is empty on the first run |
| `.pi/extensions/*.ts` symlinks | Hand-maintained discovery mirror, no JSON registration | Not a consumer of the generator's write path. Verified only | The verification pass's report lists zero missing or mismatched symlinks |
| `sync-runtime-mirrors.cjs`'s `hookSourcesFromConfig()` | Reads the four JSON files' raw text to build its own discovery-mirror symlinks | Unchanged code, but now reads generated files instead of hand-authored ones | `node runtime-mirrors/sync-runtime-mirrors.cjs --check` still exits 0 against the regenerated files |
| `.github/workflows/spec-kit-check.yml`'s `mirrors` job (lines 92-122) | Runs the existing four mirror `--check` calls | Update: one new `--check` call added | The job's step list shows the new call alongside the existing four |
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
| Round-trip byte comparison | The generator's first run against the current repository state | `diff` (or an equivalent Node file comparison) of each of the four files before and after generation |
| Drift check | The generator's `--check` mode | `node <generator script> --check`, exit code and per-file report |
| Existing hook test suites | Every runtime's own hook adapter test, plus `directive-lifecycle-adapter-parity` and `completion-evidence` | The suites' own existing invocation, run unchanged after regeneration |
| Mirror-generator compatibility | `sync-runtime-mirrors.cjs`'s ability to keep reading the (now generated) registration files | `node runtime-mirrors/sync-runtime-mirrors.cjs --check` |
| Manual | Pi's registration verification pass, since it has no automated test today | A read of the verification pass's own printed report, confirming zero missing symlinks |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `sync-runtime-mirrors.cjs`'s `hookSourcesFromConfig()` regex extraction | Internal | Green | REQ-006 depends on this continuing to work against generated output. If the generator's formatting broke it, the mirror symlinks would go stale, caught by the existing `--check` in CI |
| The `mirrors` job in `.github/workflows/spec-kit-check.yml` | Internal | Green | The new `--check` call is additive. The job's existing four checks are unaffected either way |
| Phase 001's hook adapter port (a sibling phase, not a blocking dependency) | Internal | Green | This phase's registration-layer work and phase 001's adapter-implementation work touch different files and can land in either order without conflict |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The generator's first run does not reproduce one of the four files byte-for-byte, or a regenerated file causes a hook test or the mirror-generator's `--check` to fail.
- **Procedure**: Revert the generator and canonical-source commits. The four JSON registration files return to their pre-phase, hand-authored content through a plain `git revert`, since no runtime state outside version control depends on them.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┐
                      ├──► Phase 2 (Core) ──► Phase 3 (Verify)
Phase 1.5 (Config) ───┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core, Config |
| Config | Setup | Core |
| Core | Setup, Config | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup (canonical source authoring) | Medium | Requires transcribing every existing hook's per-runtime binding accurately from four files |
| Core Implementation (four template functions plus Pi verification) | Medium | The four-axis structural divergence is the main source of implementation risk |
| Verification | Low | Byte comparison and existing test suites, no new test framework |
| **Total** | | Moderate for a Level 2 phase, concentrated in getting the four templates exactly right |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] No backup needed. Every file this phase touches is tracked in git
- [ ] No feature flag needed. The generator is a local/CI tool, not a runtime behavior switch
- [ ] No monitoring alert needed. `--check` runs on demand and in the `mirrors` CI job

### Rollback Procedure
1. Revert the canonical-source and generator commits.
2. Revert the four regenerated JSON files to their prior committed content (a plain `git revert` restores them exactly, since the first run was required to reproduce them byte-for-byte).
3. Revert the `.github/workflows/spec-kit-check.yml` addition.
4. Re-run each runtime's own hook test suite to confirm the pre-phase state still passes.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A.
<!-- /ANCHOR:enhanced-rollback -->

---
