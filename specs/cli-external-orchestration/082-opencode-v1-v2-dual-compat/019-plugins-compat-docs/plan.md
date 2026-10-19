---
title: "Implementation Plan: Phase 19: plugins-compat-docs"
description: "Audit the plugins README against the code from each plugin's v1 factory, record the facts with sources, then have a writer dispatch apply the README edits and write ARCHITECTURE.md, with Luna reviewing read-only until PASS and the validators and the suite closing the phase."
trigger_phrases:
  - "plugins compat docs plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 19: plugins-compat-docs

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown documents over a JavaScript plugin surface |
| **Framework** | The sk-doc hub modes and validators, and the OpenCode plugin API on 1.19.3 and 2.0.32 |
| **Storage** | None |
| **Testing** | `validate_document.py`, `test_readme_manifest.py`, `node --test .opencode/plugins/tests/` and strict spec validation |

### Overview
The audit loads each plugin file, calls its v1 `server` factory with a stub host (`scratch/list-plugin-hooks.mjs`, output `scratch/plugin-hook-keys.txt`) and records every fact with its source in `scratch/facts.md`. Writer briefs apply the README edits and write `ARCHITECTURE.md` from those facts, Luna reviews read-only until PASS, and the validator, manifest and suite gates close the phase.
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
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation audit and rewrite. Facts first with sources, then the rewrite, then the gates. No runtime code changes.

### Key Components
- **`scratch/facts.md`**: the audit record. Every fact names its source file and line on `origin/main` at `1001ab297f`, including the six drift items and the three kill-switch exceptions.
- **`.opencode/plugins/README.md`**: states both versions and the proof date in the overview, fixes the six drift items and links `ARCHITECTURE.md`.
- **`.opencode/plugins/ARCHITECTURE.md`**: the sk-doc architecture template's eight fixed sections, each claim with a repo source.

### Data Flow
`scratch/list-plugin-hooks.mjs` loads each plugin file, calls its `server` with a stub and prints the returned hook keys into `scratch/plugin-hook-keys.txt`. The orchestrator records the facts with sources in `scratch/facts.md`, the writer briefs turn them into the README edits and the eight ARCHITECTURE.md sections, and Luna reads the result against the facts before the gates run.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The Phase 3 tasks in `tasks.md` own the checks: `validate_document.py` on both files, `test_readme_manifest.py`, the plugin suite `node --test .opencode/plugins/tests/`, and strict validation of this folder plus recursive validation of the 082 parent. No testing beyond them is planned.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The 082 proof record (`../011-two-version-proof-and-closeout/`), the packet research (`../research/research.md`) and phase 013's implementation summary supply the facts. The writer runs through cli-pi and Luna reviews through cli-codex.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the phase commit. Both files are documentation only, so nothing else needs unwinding.
<!-- /ANCHOR:rollback -->

---
