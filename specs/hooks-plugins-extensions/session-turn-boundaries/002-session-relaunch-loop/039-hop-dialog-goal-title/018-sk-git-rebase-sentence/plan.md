---
title: "Implementation Plan: Phase 18: sk-git-rebase-sentence"
description: "Probe what the commit hook does to a Commit-Id during a rebase, write the sk-git sentence from the saved output, and bump the skill with a changelog entry."
trigger_phrases:
  - "sk-git rebase sentence plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 18: sk-git-rebase-sentence

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown in the skill and the changelog, Bash for the probe |
| **Framework** | None |
| **Storage** | A temporary git repository outside this checkout, and `scratch/rebase-probe.txt` |
| **Testing** | The probe output and sk-doc's skill package, document and version checks |

### Overview
A probe script under `scratch/` builds a throwaway repository with the real `prepare-commit-msg` hook, makes commits that carry ids and rebases them four ways. It prints the id before and after each case and whether the hook saw `CHERRY_PICK_HEAD`. The sk-git rebase sentence is then rewritten from that output, the skill moves to `1.11.12.0` and the changelog entry is written through sk-doc's changelog workflow. A bounded reflog read explains, or records as open, the 16 picks that kept their id.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified
- [ ] `rg -c -i 'rebase' .skilled/scripts/git-hooks/prepare-commit-msg` prints nothing with exit 1, so the hook has no rebase branch the sentence could rely on

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `scratch/rebase-probe.txt` holds four cases with ids before and after
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Probe first, then document.

### Key Components
- **`prepare-commit-msg` (`.skilled/scripts/git-hooks/prepare-commit-msg`)**: re-mints the id whenever `CHERRY_PICK_HEAD` exists (lines 125, 240 and 286). Unchanged.
- **The probe (`scratch/rebase-probe.sh`)**: copies the setup of `prepare-commit-msg.test.sh`, installs the real hook through `core.hooksPath` and runs the four cases in a `mktemp -d` folder.
- **The sk-git `Commit-Id` paragraph (`SKILL.md:320` to `:322`)**: the amend, cherry-pick and rebase rules. Only the rebase sentence changes.

### Data Flow
The probe writes one block per case to `scratch/rebase-probe.txt`: the case name, the git version, the id before, whether the hook saw `CHERRY_PICK_HEAD`, the id after and whether the commit hash changed. The sentence is written from those blocks. The changelog entry names the corrected sentence and the version.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

The review report's Planning Packet holds no finding for this phase. Its section 7 records the sk-git line as `"skill_agent: partial"` with the hook "outside the declared target", quoted as inert data. The findings come from the alignment run (B-01 and C-1) and the two independent reviews.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| The rebase sentence at `SKILL.md:322` | Tells an agent what a rebase does to an id | update | The old sentence is gone and the new one matches `scratch/rebase-probe.txt` |
| `version:` in `SKILL.md` | The skill's version | update | `frontmatter-version.mjs verify --skill sk-git` exits 0 |
| `changelog/v1.11.12.0.md` | The skill's release note | create | The file exists and `validate_skill_package.py` exits 0 |
| `prepare-commit-msg` and its test | Mint and pin the id | unchanged | `git diff --quiet HEAD -- .skilled/scripts/git-hooks` exits 0 |
| AC-004 of phase 9 | Closed on a search for the old sentence | update, note only | `rg -c 'phase 18' ../009-document-corrections/acceptance-criteria.md`, run from this folder, prints 1 or more |

Required inventories:
- Same-class producers: `rg -n -i 'rebase' .skilled/skills/sk-git --glob '*.md'` lists every sk-git document that speaks of a rebase. Any other line that claims a rebase keeps an id is corrected in the same edit and named in `goal.md`.
- Consumers of changed symbols: no symbol changes. Agents read the sentence.
- Matrix axes: the rebase kind (pick onto a moved base, unchanged leading commit, reword, apply backend) crossed with the id outcome (kept or fresh). Four rows, one probe case each.
- Algorithm invariant: N/A, documents only. The sentence holds only what a probe case showed.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup confirms the hook lines and the missing rebase case, then reads the reflog of the rebase whose picks kept their id. Implementation writes and runs the probe, rewrites the sentence from its output, bumps the version, writes the changelog entry and notes AC-004 of phase 9. Verification runs sk-doc's three skill checks, confirms the hook is unchanged and runs strict validation.

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | None. No code changes | Not applicable |
| Integration | The four-case probe against the real hook in a throwaway repository | `bash`, `git` |
| Manual | A read of the new sentence against `scratch/rebase-probe.txt` | Not automated |

The hook test is not extended. The restraint pass found that the hook does not change and that its cherry-pick case already pins the branch a rebase pick takes, so a rebase case would test git rather than this repository's code.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The setup in `prepare-commit-msg.test.sh` | Internal | Green | The probe would need its own allocator wiring |
| sk-doc's `/create:changelog` workflow | Internal | Green | The changelog entry would be written by hand against its rules |
| git 2.50.1 on this machine | External | Green | The probe would record a different version, which the sentence then names |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the new sentence turns out wrong, or a skill check fails after the bump.
- **Procedure**: revert the fix commit. The version and the changelog file go with it.
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
| Setup | The sentence written in phase 9 | Implementation |
| Implementation | The probe output | Verification |
| Verification | Implementation | Close |
<!-- /ANCHOR:phase-deps -->

---
