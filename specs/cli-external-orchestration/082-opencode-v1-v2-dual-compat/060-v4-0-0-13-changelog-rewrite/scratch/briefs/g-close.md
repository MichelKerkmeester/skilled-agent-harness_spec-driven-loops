ROLE: Spec-folder record keeper. You edit docs only.

TASK: Close phase 060 in `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/060-v4-0-0-13-changelog-rewrite/`. Make exactly these edits:

1. **`tasks.md`:**
   - Tick T010 and append "- `4b7a026f5c` on main".
   - Tick T011 and append "- CI green on `4b7a026f5c` (12 workflows) and on the index rebuild `5228e8c417` (13 passed, Trigger Index Rebuild skipped, Spec-Kit Check 39845676779)".
   - Tick the checklist lines "All tasks marked [x]" and "Manual verification passed".
   - If the continuity block names a next step, set it to "None: phase complete".
2. **`spec.md`:** change the `**Status**` row value to `Complete`.
3. **`implementation-summary.md`:**
   - Change the `**Status**` row value to `Complete`.
   - Where it says CI or the push is pending or open, say instead that the rewrite landed as `4b7a026f5c` and CI passed on it and on the index rebuild `5228e8c417`.
   - If the continuity block names a next step, set it to "None: phase complete".
4. **`../spec.md`:** in the phase map row that starts `| 60 |`, change the last cell `In Progress` to `Complete`. Change nothing else in that file.

Edit only these files. Rules: no Oxford commas, no em dashes, no semicolons. When done, print the changed lines.
