---
title: "Implementation Plan: Phase 18: host-trigger-index-and-repin-generated"
description: "Make the Gate 1 lookup and the trigger index generator default to a host repository's own index, keep Skilled's checkout on the packaged index, and prove a host re-pin no longer refuses the four generated retrieval files."
trigger_phrases:
  - "host trigger index and repin generated plan"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 18: host-trigger-index-and-repin-generated

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js ES modules, vitest |
| **Framework** | system-spec-kit retrieval CLI and the doctor overlay engine |
| **Storage** | None |
| **Testing** | Eight retrieval vitest files, the cli vitest project, a read-only lookup in Barter, and a staged re-pin on a temporary host copy |

### Overview
One shared helper decides whether the caller's repository is a host. The lookup reads an existing host index; the generator indexes the host and writes `.speckit-index/` when no flag says otherwise. Skilled's own checkout keeps every current default.
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
- [x] Both done-when lines hold with recorded output, and the retrieval and cli baselines hold
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Fix at producer.

### Key Components
- **`lib/host-index.mjs`**: host detection and the host index path
- **`lookup-trigger-index.mjs`**: bare lookup reads an existing host index
- **`generate-trigger-index.mjs`**: bare generation in a host indexes the host into `.speckit-index/`

### Data Flow
Gate 1 runs the lookup from the repository root; the lookup asks git for the caller's root and reads `<root>/.speckit-index/trigger-index.json` when it exists, else the packaged index. The generator resolves the same root and writes there only when the root is a host.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Lookup default index | Gate 1 in every repository | update | host and own-repo tests, Barter read-only run |
| Generator default root and output | host index build and `--check` | update | fake-host tests, host copy run |
| Host index docs (data README, folder-structure section 7) | operator commands | update | read against the code |

Required inventories:
- Lookup callers: AGENTS.md Gate 1, speckit resume and search assets, doctor speckit retrieval; all invoke the CLI and inherit the default.
- In-process `loadIndex()` callers keep the packaged default; only the CLI entry changed.
- Matrix: Skilled checkout, host with `.speckit-index/`, host without it, cwd outside git, explicit `--index`/`--out`.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`: setup records baselines, implementation sends one worker brief per change group, verification reruns the probes and the baseline suites.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | host detection, caller root, host index path | `host-trigger-index.vitest.ts` |
| Integration | bare lookup and bare generation in a fake host | `host-trigger-index.vitest.ts` |
| Regression | existing retrieval behaviour | seven retrieval vitest files, cli project |
| Manual | Barter lookup and a staged re-pin on a host copy | recorded output below |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| cli-pi DeepSeek | External | Green | none |
| cli-codex Luna | External | Red (quota until 2026-11-13) | DeepSeek took the brief |
| Barter checkout | Read-only | Green | writes ran on a copy |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a baseline-passing test fails after the change.
- **Procedure**: `git revert <phase commit>` in the worktree.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup (baselines, negative controls) | None | Implementation |
| Implementation (worker briefs) | Setup | Verification |
| Verification (probes, suites, cross-family review) | Implementation | Close and commit |
<!-- /ANCHOR:phase-deps -->

---
