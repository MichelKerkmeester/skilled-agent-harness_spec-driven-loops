---
title: "Tasks: Teach the git preflight advisory that environment assignments between cd and git keep the cd"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "advisory cd prefix env steps tasks"
  - "assignment step between cd and git tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Teach the git preflight advisory that environment assignments between cd and git keep the cd

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`R` is `.skilled/skills/sk-git/scripts/lib/git-rule-checks.mjs`. `T` is `.skilled/skills/sk-git/scripts/lib/git-rule-checks.test.mjs`. `ARGS` is `.skilled/skills/sk-git/changelog`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the pre-change reading of the three shapes (`R`). Verify: the pattern taken from `git show HEAD:` reports `false`, `false` and `true` for the export-multi, export-and bare-assignment shapes.
- [x] T002 [P] Create the packet folder (`specs/sk-git/037-advisory-cd-prefix-env-steps`). Verify: `ls specs/sk-git/037-advisory-cd-prefix-env-steps` lists `spec.md`, `plan.md`, `tasks.md` and `implementation-summary.md`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Widen the cd pattern to skip assignment-only steps (`R`). Verify: `node -e '...'` on the shipped pattern reports `true` for all three assignment shapes and `false` for `cd /wt && echo hi; git add f1`.
- [x] T004 Rewrite the comment above the pattern to say why an assignment step is allowed (`R`). Verify: `sed -n '32,40p' R` names the assignment step and the `;` or `&&` that closes it.
- [x] T005 Add the four assertions beside the existing cd assertion (`T`). Verify: `node --test T` prints `pass 29` and `fail 0`.
- [x] T006 Bump the skill version (`.skilled/skills/sk-git/SKILL.md`). Verify: `rg -n '^version: 1\.11\.7\.0$' .skilled/skills/sk-git/SKILL.md` prints one line.
- [x] T007 Write the release note (`ARGS/v1.11.7.0.md`). Verify: `ls ARGS/v1.11.7.0.md` prints the path and `rg -n '^version: 1\.11\.7\.0$' ARGS/v1.11.7.0.md` prints one line.
- [x] T008 Regenerate the packet metadata (`description.json`, `graph-metadata.json`). Verify: both files parse with `node -e 'JSON.parse(...)'` and the track root lists the new packet.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Run the changed test file (`T`). Verify: `node --test .skilled/skills/sk-git/scripts/lib/git-rule-checks.test.mjs` exits 0 with `pass 29`.
- [x] T010 Run every other test beside it (`.skilled/skills/sk-git/scripts/lib/message-contract.test.mjs` and `.skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.test.mjs`). Verify: both exit 0.
- [x] T011 Validate the packet (`specs/sk-git/037-advisory-cd-prefix-env-steps`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-git/037-advisory-cd-prefix-env-steps --strict` prints `RESULT: PASSED`.
- [x] T012 Scan the packet for unfilled placeholders (`specs/sk-git/037-advisory-cd-prefix-env-steps`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/check-placeholders.sh specs/sk-git/037-advisory-cd-prefix-env-steps` prints `PASS`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: the three assignment shapes report no advisory and the `echo` shape still warns
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
