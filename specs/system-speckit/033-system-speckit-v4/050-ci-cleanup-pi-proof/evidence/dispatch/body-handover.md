STEP 1 - rebuild P/handover.md from the template, then fill it
a. Run exactly (this overwrites the old handover, which is already backed up at P/scratch/dispatch/handover-v1.md):
   bash .skilled/skills/system-spec-kit/runtime/cli/templates/inline-gate-renderer.sh --level 2 .skilled/skills/system-spec-kit/templates/addons/handover.md.tmpl > P/handover.md
b. Fill every placeholder from evidence.md, using P/scratch/dispatch/handover-v1.md (read-only) only for the
   traps, risks and exact commands it records that evidence.md also supports.
- Frontmatter title "Session Handover: CI Cleanup and Pi Gate-3 Live Proof", description specific to this packet.
- Handover summary: From Session "2026-09-23 orchestrated cli-pi session", To Session "next session",
  Phase Completed IMPLEMENTATION, Handover Time 2026-09-23, recent action from evidence.md.
- Decisions table: the operator decisions. Blockers: the cli-jev re-mint after merge. Files table: the change groups.
- Traps table: advisor exit 75 is not a provider failure; sk-doc node_modules link missing in fresh worktrees;
  any cli-jev SKILL.md edit stales its compiled manifest; the scorer reads the working tree, not HEAD.
- Next session: first action is the commit after the operator's yes, then merge main, re-mint cli-jev and re-verify.
Accept when: only P/handover.md changed and every rule above holds.
