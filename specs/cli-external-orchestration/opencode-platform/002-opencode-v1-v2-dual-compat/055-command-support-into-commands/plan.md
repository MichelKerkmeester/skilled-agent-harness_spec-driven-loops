---
title: "Implementation Plan: Phase 55: command-support-into-commands"
description: "Move the 12 non-command markdown files back under .skilled/commands/ and rename them to .markdown, because both OpenCode versions scan only .md names and have no ignore list or frontmatter opt-out. Then repoint every consumer, teach the three checks the new suffix, recompile the three contracts, and re-read both versions' command lists to show nothing was added or removed."
trigger_phrases:
  - "command support into commands plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 55: command-support-into-commands

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown for the moved files, Node.js and TypeScript for the consumers, Python for the sk-doc scripts |
| **Framework** | OpenCode 1.19.3 and 2.0.32 command scanners, plus the deep-loop contract compiler |
| **Storage** | None; the evidence lands in `scratch/` as two command lists and two suite transcripts |
| **Testing** | The two-version command listing via the battery method, the tracked suites, and a separate read-only review |

### Overview
Phase 004's move solved a registration problem by leaving the tree the operator reads commands from. This phase restores the layout and solves the same problem one level down: the file name. Both versions scan `{command,commands}/**/*.md` with `dot:true` and no ignore list, so no folder, prefix or marker can exclude a file, but `.markdown` is not scanned by either. The 12 files move back into `.skilled/commands/<sub>/` under `.markdown` names, every consumer follows, and the live command lists prove the outcome.
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
Other: a layout change carried by file names, with every consumer repointed and the result read back from both hosts.

### Key Components
- **The 12 non-command files**: four under `deep/assets/compiled/`, four under `deep/assets/legacy/` and four `README` files under `doctor/scripts/`, `doctor/scripts/tests/`, `scripts/` and `scripts/fixtures/`. Every one is a `.markdown` name under `.skilled/commands/`.
- **The scanner contract**: `{command,commands}/**/*.md`, `dot:true`, no ignore list, no frontmatter opt-out, identical on 1.19.3 and 2.0.32. That is what makes the suffix the only lever.
- **The consumers**: `render-command-contract.cjs` (the manifest path and six body and contract paths), `compile-command-contracts.cjs` (`outputPathFor`), the legacy projection manifest, the compile vitest, the gate-3 parity test, `.gitignore`, the sk-create-command contract, the six moved READMEs and the sk-code-skilled checklist.
- **The checks taught the suffix**: `check-markdown-links.cjs`, `template-phrase-lint.mjs`, and sk-doc's `audit_readmes.py`, `test_readme_verdict_parity.py` and `validate_document.py`.
- **The proof**: `scratch/commands-before.json`, `scratch/commands-after.json`, `scratch/suites-before.txt` and `scratch/suites-after.txt`.

### Data Flow
Probe both versions, then rename the file names, then repoint the consumers, then recompile and confirm byte-identical output, then read both command lists again. The command list is the gate the change is judged on; the suites corroborate that the repointed consumers still work.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The command list is read twice per version with the battery method: v1 through `debug config` against a private data home, v2 through a private `serve`, never the shared service. The suites run before the change and after it, so a difference reads as a delta rather than as a number on its own: plugins, hook node tests over 30 files, battery unit tests, gate-3 parity, deep-loop vitest and the sk-doc script tests. The README manifest reproducibility, the verdict parity diff, the link guard and the full version battery on both versions close the check. A separate read-only DeepSeek v4.1 flash session reviewed the change through cli-pi.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Both installed OpenCode versions must answer a command listing, and the battery method must be usable without touching the shared OpenCode 2 service. The deep-loop contract compiler must be runnable against each of the three commands, and the sk-doc script tests must run locally.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the commit: the 12 files return to `.skilled/command-support/` with their `.md` names, the consumers point back at them, and both versions stop registering them again because they are outside `.skilled/commands/`. The rollback restores phase 004's layout, so it costs the operator the layout they asked for but breaks no behaviour.
<!-- /ANCHOR:rollback -->

---
