---
title: "Implementation Plan: Phase 19: template-marker-upgrade-and-staleness-scope"
description: "Give passing packets with an old template marker an opt-in, proof-bound path to the current marker, and confine the staleness checker to the spec document root with the corpus walker's exclusions."
trigger_phrases:
  - "template marker upgrade and staleness scope plan"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 19: template-marker-upgrade-and-staleness-scope

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js (ESM and CommonJS), Bash 3.2, vitest |
| **Framework** | system-spec-kit spec tooling: upgrade-legacy, heal-spec-docs, check-template-staleness |
| **Storage** | None |
| **Testing** | Two new vitest files, five existing upgrade, heal and parity files, the cli vitest project, and the checker run on this repository and read-only on Barter |

### Overview
`refreshMarker` reuses the healer's exact-anchor proof to move an existing marker; `upgrade-legacy.mjs --refresh-markers` applies it to passing packets with re-derivation, revalidation and byte-for-byte revert. The staleness checker walks `specs/` only and prunes the corpus walker's directory names.
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
- [x] Both done-when lines hold with recorded output, and the test baselines hold
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Fix at producer.

### Key Components
- **`refreshMarker` in `heal-spec-docs.cjs`**: proof-bound marker move, not a default lane mode
- **`--refresh-markers` in `upgrade-legacy.mjs`**: opt-in pass over passing packets
- **`discover_spec_folders` in `check-template-staleness.sh`**: spec-root discovery with pruning

### Data Flow
upgrade-legacy validates every packet in scope, skips failing ones, asks `refreshMarker` per lane document, and under `--apply` writes, re-derives the fingerprint, revalidates and restores on failure. The checker walks `<root>/specs/`, pruning excluded directories, and compares each spec.md marker with the manifest version.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| upgrade-legacy CLI flags and exit codes | spec maintainers, hosts | update | new vitest cases |
| heal-spec-docs exports | upgrade-legacy | update | unit case |
| Staleness discovery and help text | maintainers, hosts | update | new vitest cases, real runs |
| MIGRATION.md section 2 | maintainers | update | read against the code |

Required inventories:
- heal-spec-docs default lane modes unchanged; `refreshMarker` is only reachable through the new flag.
- Staleness checker callers: maintainers by hand, `heal-provenance.vitest.ts`; both pass a root holding `specs/`.
- Matrix: passing packet with proven old marker, passing packet with unproven anchors, failing packet, no marker, archive flag; checker with no specs, symlinked specs, numbered `-fixtures` packet, real fixture dir, z_archive, scratch, vendored tree.
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
| Unit | `refreshMarker` with no marker | `upgrade-legacy-refresh-markers.vitest.ts` |
| Integration | dry run, apply and strict pass; refused anchors | `upgrade-legacy-refresh-markers.vitest.ts` |
| Integration | discovery scope, empty root, symlinked root, numbered packet | `template-staleness-discovery.vitest.ts` |
| Regression | upgrade, heal, template parity | five existing files, cli project |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| cli-pi DeepSeek | External | Green | none |
| cli-codex Luna | External | Red (quota until 2026-11-13) | DeepSeek took both briefs |
| Barter checkout | Read-only | Green | checker run only reads |
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
