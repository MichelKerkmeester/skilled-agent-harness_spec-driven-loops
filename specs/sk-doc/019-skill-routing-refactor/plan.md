---
title: "Implementation Plan: Authored compiled-routing source home"
description: "Adds root spec documents to the folder that holds the authored compiled-routing source, leaving 015-router-unification-program untouched, then regenerates the folder's metadata and proves strict validation and the routing guards pass."
trigger_phrases:
  - "authored routing source plan"
  - "router program custodian plan"
  - "compiled routing source maintenance"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Authored compiled-routing source home

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown spec documents; generated JSON metadata |
| **Framework** | spec-kit validation, compiled routing |
| **Storage** | None |
| **Testing** | `validate.sh --strict`, `compiled-route-guard.cjs`, `check-no-spec-imports.cjs` |

### Overview

Write `spec.md`, `plan.md`, `tasks.md` and `implementation-summary.md` at the folder root, generate `description.json` and `graph-metadata.json`, and validate. No file under `015-router-unification-program/` is touched. Because that subfolder holds neither `spec.md` nor `description.json`, the folder validates as a plain Level 1 leaf, not a phase parent.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (`spec.md`)
- [x] Success criteria measurable (each requirement names its check)
- [x] Dependencies identified (`spec.md` risks and dependencies)

### Definition of Done
- [x] All acceptance criteria met (see `implementation-summary.md` Verification)
- [x] Tests passing (strict validation and both routing guards)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

A custodian record over a live path. The folder's content is owned by the compiled-routing toolchain; the spec documents only describe it.

### Key Components

- **`.skilled/bin/lib/compiled-route-layout.cjs`**: defines `AUTHORED_PROGRAM_DIR` as `specs/sk-doc/019-skill-routing-refactor/015-router-unification-program`, the root every authored routing manifest resolves from.
- **The pre-commit route re-mint** (`.skilled/scripts/git-hooks/pre-commit`, installed at `.skilled/hooks/git/pre-commit`): when a hub's routing inputs change, it re-mints the compiled manifests and copies them into the authored program folder through the layout module.
- **`.skilled/bin/lib/compiled-routing/serving-closure.manifest.json`**: records `generatedFrom` as the authored program folder, so the serving closure names this path as its source.
- **`.skilled/bin/check-no-spec-imports.cjs`**: forbids runtime code from importing spec files, with one sanctioned exception for this build bridge.
- **`specs/sk-doc/z_archive/019-skill-routing-refactor/`**: the router program's packet history (spec, context index, handover, timeline, before-and-after record, routing reference).

### Data Flow

Hub routing inputs change, the pre-commit hook re-mints the manifests, the layout module resolves the authored program folder, and the copies land under `015-router-unification-program/`. The compiled-route guard then compares the served manifests with their sources. Nothing in this packet's documents takes part in that flow.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`.

1. **Read.** Confirm the readers and writers of the folder from the layout module, the serving-closure manifest and the import guard.
2. **Record.** Write the four root documents.
3. **Metadata.** Generate `description.json`, then run the derived-metadata repair to write `graph-metadata.json`.
4. **Verify.** Run strict validation, the compiled-route guard and the no-spec-imports guard, and confirm no file under `015-router-unification-program/` changed.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

No code changes, so no tests are added. Verification runs:

- `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-doc/019-skill-routing-refactor --strict`, requiring `RESULT: PASSED`.
- `node .skilled/bin/compiled-route-guard.cjs`.
- `node .skilled/bin/check-no-spec-imports.cjs`.
- `git status --short specs/sk-doc/019-skill-routing-refactor/015-router-unification-program`, which must print nothing.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `compiled-route-layout.cjs` keeps pointing at this folder. If the authored source ever moves, this record moves or retires with it.
- The spec-kit metadata generators, for `description.json` and `graph-metadata.json`.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Delete the four root documents and the two generated metadata files with git. The authored routing source is untouched, so compiled routing is unaffected either way; the folder would return to failing strict validation.
<!-- /ANCHOR:rollback -->
