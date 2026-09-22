---
title: "Implementation Plan: MiMo v2.5 to v2.6 cutover across skills settings and deep-loop allowlists"
description: "A case-preserving token rename (mimo-v2.5 → mimo-v2.6, MiMo-V2.5-Pro → MiMo-V2.6-Pro) applied to the living skill documents, the .pi settings' enabledModels, and the deep-loop enforcement pair with its mirrors and tests — all in one pass, because the paired roster copies are asserted equal by the very tests being renamed."
trigger_phrases:
  - "mimo v2.6 cutover plan"
  - "roster rename approach"
  - "paired allowlist copies"
  - "mechanical token rename"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: MiMo v2.5 to v2.6 cutover across skills settings and deep-loop allowlists

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Repository documentation (Markdown), one JSON settings file, TypeScript + `.cjs` (system-deep-loop runtime) |
| **Framework** | pi skills; system-deep-loop runtime (vitest 4.1.11, tsx, zod) |
| **Storage** | None (no data migration — the change is surface-level ids enforced as string literals) |
| **Testing** | Vitest 070 trio (`executor-config`, `fanout-run`, `combo-matrix` — the suites that read the allowlist), `tsc --noEmit`, scoped ripgreps, the repository's frontmatter-version gate, and the spec-kit validator |

### Overview
The rename is mechanical but the enforcement graph is not: the Pi and HerMeS rosters exist as four string-literal copies (two declarations, two mirrors) plus a provider map plus eight test expectations, and the pairing tests assert two of those copies equal-each-other-minus-one. So the implementation moves the whole set in one pass — documents, settings, enforcement, mirrors, tests — then re-runs the suites that read the allowlist, the typecheck, the frontmatter gate and the spec-kit validator. Historical bodies and dated evidence are deliberately left as they were written; the 070 precedent calls that theirs, not this packet's.
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
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other — a mechanical rename across a paired-copy enforcement contract. No new abstraction: the copies stay copies, because the test that asserts their agreement is the thing that keeps them honest.

### Key Components
- **The roster contract** (`executor-config.ts` declarations + `fanout-run.cjs` mirrors + provider map): what a Pi or HerMeS dispatch is allowed to resolve, enforced as bare gateway literals.
- **The paired tests** (`executor-config.vitest.ts` pairing/effort expectations, `fanout-run.vitest.ts` provider-map expectation): the assertions that fail if one copy moves without the other.
- **The documented surfaces**: the three skills' living references/rosters and `.pi/settings.json`'s `enabledModels`, which must name what the enforcement actually resolves.

### Data Flow
An id enters through the gateway, resolves through the provider catalogs and `enabledModels`, is admitted or rejected by `PI_SUPPORTED_MODELS` / `HERMES_SUPPORTED_MODELS` and their fan-out mirrors, and is documented by the skills' references. Renaming the id therefore touches every hop of that chain, which is exactly the file list in `spec.md` §3.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The 070 trio plus `npm run typecheck` are the behavioral gates, re-run from the final state and compared against the captured 259-test baseline. Scoped ripgreps prove the rename reached every living occurrence and stopped at the historical ones; the JSON.parse proves the settings file; the frontmatter gate proves the three new changelog entries; the spec-kit validator proves the packet. A full-runtime `npm test` was attempted twice and wedged past 300 s and 600 s on the lineage integration tests (logged to `/tmp/deep-loop-baseline.log`); the trio is the 070 precedent's scope for exactly this reason and covers every suite that reads the edited allowlists.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

N/A — the packet touches no dependency, no install, no network. The only machine-state dependency (the installed pi's catalogs still serving v2.5) is recorded as the operator's resolution check, not this packet's.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Every edited file is tracked and the packet directory is untracked: `git checkout --` the 24 recorded paths (or revert the packet's commit) and `rm -rf specs/cli-external-orchestration/076-mimo-v2-6-cutover`. The pre-existing `lastChangelogVersion` hunk in `.pi/settings.json` survives either way because it predates the packet and a checkout of the file would restore it to the committed 0.86.1 state — noted, because that restores more than the packet changed.
<!-- /ANCHOR:rollback -->

---
