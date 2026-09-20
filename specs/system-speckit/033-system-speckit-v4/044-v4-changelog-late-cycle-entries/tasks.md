---
title: "Tasks: v4 changelog late-cycle entries"
description: "The tasks that recorded the jev and orca moves in the After This Draft section, with the verification gate."
trigger_phrases:
  - "v4 changelog late cycle tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: v4 changelog late-cycle entries

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:tasks -->
## Tasks

- [x] T001 Verify the claim set: resolve each candidate hash through `git log`, read both benchmark reports for the verdicts, count `mcp-tooling` modes from the live registry, measure the post-draft commit total (`git rev-list --count 1d43dbd38b..HEAD`)
- [x] T002 Correct the After This Draft intro count from 231 to 266 (`../CHANGELOG-v4.0.0.0.md`)
- [x] T003 Rewrite the orca bullet to cover the add-then-promote arc and the nine-mode count (`../CHANGELOG-v4.0.0.0.md`)
- [x] T004 Add the jev bullet covering the hub promotion, the transport contract, compiled-routing membership and both playbook verdicts (`../CHANGELOG-v4.0.0.0.md`)
- [x] T005 Sweep the changed lines for HVR hard blockers and validate the parent strict, then commit and push to `skilled/v4.0.0.0` and `main`
<!-- /ANCHOR:tasks -->

---

<!-- ANCHOR:verification -->
## Verification

Gate: every cited hash resolves via `git log --format="%h %ad %s" --date=short <hash>`; `rg "22 PASS|3 PASS"` hits both recorded reports; a `python3` read of `.skilled/skills/mcp-tooling/mode-registry.json` prints 9; `git rev-list --count 1d43dbd38b..HEAD` prints 266; the changed lines return no hits on the HVR hard-blocker sweep; `validate.sh specs/system-speckit/033-system-speckit-v4 --strict` first verdict `RESULT: PASSED`.
<!-- /ANCHOR:verification -->
