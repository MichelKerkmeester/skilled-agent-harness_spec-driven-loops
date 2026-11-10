---
title: "Implementation Plan: Phase 8: dsh-repo-guards-safety-wave"
description: "Build the repo-guards Cordis plugin bundle under .dsh/plugins/repo-guards/ with eight safety adapters that call the shared guard cores, load it through .dsh/patches/guards.patch.yml and prove it with fixture parity tests, error-policy throw tests and a keyless boot run."
trigger_phrases:
  - "dsh repo guards safety wave plan"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 8: dsh-repo-guards-safety-wave

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript and JavaScript ES modules loaded by the dsh Cordis plugin loader |
| **Framework** | Cordis plugin bundle on dsh `@deepseek-ai/dsh@0.2.2-rc.1` seams |
| **Storage** | None |
| **Testing** | `node --test` suites beside the bundle, plus a keyless `dsh` boot run under a disposable `DSH_HOME` |

### Overview
This phase adds one plugin bundle at `.dsh/plugins/repo-guards/` with eight adapters, one per safety guard, each a thin seam binding around the shared core the matching `.pi/extensions/*.ts` already imports. A new `guards.patch.yml` loads the bundle by relative path. Fixture parity tests, a throw test per adapter and a keyless boot run prove it, with authoring under `sk-code` `sk-code-skilled` and `cli-codex gpt-6-luna xhigh fast` as executor.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified: `ls 002-dsh-offline-contract-pin/evidence/plugin-boot.txt .dsh/patches/lineage.patch.yml` lists both

### Definition of Done
- [ ] All acceptance criteria met
- [ ] The bundle's `node --test` run exits 0 with sixteen passing cases, and the keyless guarded run's stderr holds `MISSING_CREDENTIAL` and no plugin failure
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Thin seam adapters. Each adapter translates a harness event into the shared core's input and maps the core's verdict back to a deny, block or attach result.

### Key Components
- **Bundle entry**: registers each adapter on its seam and owns the per-guard error policy table.
- **Adapters**: `dispatch-audit` and `post-edit-quality` and `classifier-injection-screen` on `tools/post-execute`, `dispatch-preflight-lint` and `spec-gate-enforce` and `task-dispatch-guard` on `tools/pre-execute`, `spec-gate-classify` on `agent/pre-step`, `completion-evidence` on `agent/turn-stopping`. [SOURCE: specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/001-deep-research/research/research.md:229-238]
- **`guards.patch.yml`**: the only switch that mounts the bundle, passed by the runner after the route and lineage patches.

### Data Flow
The harness emits a seam event with the tool name and arguments. The adapter normalizes the lowercase harness tool name and payload into the shape the shared core takes, calls the core and returns its verdict. When the core throws, the entry applies that guard's declared policy instead of the harness default.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This is new behavior, not a fix, but it touches shared policy, so the surfaces are listed.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Shared guard cores under `.skilled/hooks/` and `.skilled/skills/system-spec-kit/runtime/hooks/lib/` | Own every guard verdict for Pi, Claude and Hermes | unchanged, imported only | `git diff --stat .skilled/hooks .skilled/skills/system-spec-kit/runtime/hooks` prints nothing |
| `.pi/extensions/*.ts` | Pi bindings and the parity oracle for fixtures | not a consumer, unchanged | `git diff --stat .pi/extensions` prints nothing |
| `.dsh/patches/guards.patch.yml` | New mount point for the bundle | update | keyless boot run |
| Packet `references/guards-and-hooks.md` and `.dsh/SYNC.md` | Document the guard surface | update | `rg -n 'repo-guards' <both files>` matches |

Required inventories:
- Same-class producers: `rg -n 'spec-gate-core|dispatch-rule-checks|dispatch-audit|completion-evidence-sentinel|dispatch-guard|post-edit-router|classifier-injection-advisory' .pi/extensions .hermes/plugins/repo-guards`.
- Consumers of changed symbols: none, because no shared symbol changes.
- Matrix axes: eight guards by two outcomes (verdict parity, throw policy), sixteen rows.
- Algorithm invariant: a guard whose core throws never allows a mutation when its declared policy is fail closed.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. Setup confirms the 002 boot proof and the 004 patches. Implementation builds the entry, the eight adapters and the patch. Verification runs the tests and the keyless boot.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Each adapter against a fixture tool call, compared with the Pi extension verdict, plus a throw test per adapter | `node --test` over the bundle's tests |
| Integration | Keyless boot: `printf 'Reply with the single word OK' \| DSH_HOME=$(mktemp -d) dsh --profile headless --patch .dsh/patches/<route> --patch .dsh/patches/lineage.patch.yml --patch .dsh/patches/guards.patch.yml --json -` with no key in env | `dsh` 0.2.2-rc.1, stderr captured |
| Manual | Label hygiene scan and decision record review | `rg` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `002-dsh-offline-contract-pin` boot proof | Internal | Yellow, planned | The relative bundle may not load, so the phase cannot start |
| `004-dsh-runtime-folder-and-patches` | Internal | Yellow, planned | No `.dsh/` folder or route patch to compose with |
| `dsh` 0.2.2-rc.1 installed | External | Green | The keyless boot run cannot execute |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The keyless boot run names a failed plugin, or an adapter allows a mutation its Pi extension denies.
- **Procedure**: Drop `--patch .dsh/patches/guards.patch.yml` from the runner and revert the phase commit, which removes `.dsh/plugins/repo-guards/` and the patch. The shared cores keep their other consumers and nothing else changes.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phases 002 and 004 complete | Implementation |
| Implementation | Setup confirms boot proof and patches | Verification |
| Verification | All eight adapters and the patch exist | Phase 009 and phase 013 |
<!-- /ANCHOR:phase-deps -->

---
