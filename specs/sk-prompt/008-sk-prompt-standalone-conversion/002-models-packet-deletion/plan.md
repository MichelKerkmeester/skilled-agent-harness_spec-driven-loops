---
title: "Implementation Plan: Phase 2: models-packet-deletion"
description: "Delete the sk-prompt-models packet and remove every advisor, fixture and test consumer of its model-profiles registry."
trigger_phrases:
  - "008 phase 002 plan"
  - "models-packet-deletion plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 2: models-packet-deletion

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| Language/Stack | TypeScript (advisor scorer), Python 3 (mirrored scorer), JSON fixtures |
| Framework | Vitest 4 for the advisor suites |
| Storage | None |
| Testing | Vitest plus a Python subprocess parity harness |

### Overview
The registry has two readers that mirror each other, so the deletion is a paired edit: the same branch comes out of the TypeScript resolver and the Python scorer, and the shared fixture that pins their agreement loses the cases that exercised it. Both readers already degrade rather than throw on a missing file, so the observable change is a routing capability disappearing, not an error - which is exactly why the fixture and suite edits travel with the code edit rather than after it.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented — evidence: `spec.md` §2 states the problem and §3 fixes the scope
- [x] Success criteria measurable — evidence: `spec.md` §5 states each criterion as an observable check
- [x] Dependencies identified — evidence: §6 of this plan lists them

### Definition of Done
- [x] All acceptance criteria met — evidence: the Verification table in `implementation-summary.md`
- [x] Tests passing (if applicable) — evidence: recorded in the phase-3 verification tasks
- [x] Docs updated (spec/plan/tasks) — evidence: this folder validates with Errors: 0
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Paired resolver edit across a two-language scorer with a shared conformance fixture.

### Key Components
- **`loadFilesystemAliasData`**: Built the alias table from the registry, the archive and the CLI hub registry; now from the latter two only
- **`_load_cli_hub_executors` neighbourhood**: The Python mirror of the same construction
- **`executor-delegation-cases.json`**: The conformance fixture both implementations are scored against

### Data Flow
A prompt reaches the resolver, which consults an alias table assembled at load time from files on disk. Removing the registry removes one contributor to that table; the remaining contributors and the resolution logic are untouched.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`; it owns the Setup, Implementation, and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The two delegation suites are the acceptance signal, plus the three routing suites the CI lean job runs. The parity case is the load-bearing one: it re-runs the Python scorer in a subprocess and asserts identical top-1 selection for every fixture case.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- The advisor's node_modules are present in this checkout; the suites run without a fresh install.
- better-sqlite3 is built against a different Node ABI here, so the scorer degrades to its filesystem projection - the same regime CI uses.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the scoped diff. The packet is restorable from git history, and no state outside the working tree was touched.
<!-- /ANCHOR:rollback -->

---
