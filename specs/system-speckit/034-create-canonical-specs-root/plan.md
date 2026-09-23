---
title: "Implementation Plan: Make create.sh write new packets under the canonical specs root"
description: "Point SPECS_DIR in create.sh at the canonical specs/ root and turn the writer test that pinned the legacy root into the guard for the canonical one."
trigger_phrases:
  - "create.sh canonical specs root"
  - "create.sh writes to .opencode/specs"
  - "spec packet lands in .opencode/specs"
  - "track numbering restarts at 001"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Make create.sh write new packets under the canonical specs root

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash, TypeScript tests |
| **Framework** | Vitest |
| **Storage** | None |
| **Testing** | `tests/spec-root-*.vitest.ts`, `tests/scaffold-*.vitest.ts` and the registry-rule suite |

### Overview
One assignment decides where a packet is written. It moves from `$REPO_ROOT/.opencode/specs` to `$REPO_ROOT/specs`, and the track, the numbering scan and the feature directory all follow from it. The test that asserted the legacy root is rewritten first, run red against the old script, then green against the new one.
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
- [x] Tests passing
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single source of the write root, read by every later step of the script.

### Key Components
- **`SPECS_DIR`**: the write root, now `specs/` plus the optional track
- **Path guard**: still accepts explicit targets under `specs/` or `.opencode/specs/`, so legacy packets stay reachable
- **Writer test**: builds a throwaway workspace, runs the copied script and checks where the packet landed

### Data Flow
`REPO_ROOT` to `SPECS_DIR`, then the numbering scan over `SPECS_DIR`, then `FEATURE_DIR` under it.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The flipped writer tests run first against the unchanged script, where both fail, the track case producing `.opencode/specs/demo/001-next-packet` instead of `specs/demo/008-next-packet`. The same tests then pass against the fixed script, and the 17 related test files run as a regression pass.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The canonical resolver in `core/spec-root-canonical-resolver.ts`, which already treats `specs/` as canonical. It is unchanged.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the commit. Packets created in the meantime sit under `specs/`, where every reader already looks.
<!-- /ANCHOR:rollback -->

---
