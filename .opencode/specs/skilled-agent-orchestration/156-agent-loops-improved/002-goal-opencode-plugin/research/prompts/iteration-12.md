DEEP-RESEARCH

# Deep-Research Iteration Prompt Pack — /goal OpenCode plugin design

## STATE
Iteration 12 of 12 | Focus: [G12] | Last 3: run 7: G7 (0.72); run 8: G8 (0.79); run 9: G9 (0.64)

Research goal: Design a buildable OpenCode /goal plugin + command mirroring Claude Code's /goal (set a session completion condition; persist; inject into every turn until met; show/clear/complete/pause). Produce a concrete DESIGN with file:line evidence + exact OUR target file/mechanism + a decision + risk — NOT a survey.

References to mine (read-only):
- Codex goals: ~/.codex/goals_1.sqlite (run: sqlite3 ~/.codex/goals_1.sqlite '.schema thread_goals'). Per-thread objective+status+token/time budget.
- Claude Code /goal (v2.1.139): session completion condition; autonomous continue-until-met; independent supervisor verify; status-line overlay.
- Vendored: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/z_future/openhuman/external (thread_goals + goalsApi + ThreadGoalChip).
- OpenCode plugin pattern: .opencode/plugins/mk-spec-memory.js (injects context via experimental.chat.system.transform; event-hook lifecycle).
- OpenCode command pattern: .opencode/commands/memory/learn.md (thin-router; $ARGUMENTS subcommands).

Targets to design (name exact files): .opencode/plugins/mk-goal.js (new), .opencode/commands/goal.md (new), goal state store.

Focus Area this iteration: [G12] What status set + scope/keying (per-session thread_id vs global)? -> decision

Remaining key questions (context — stay on the Focus Area):
- [G1] What is Codex's thread_goals data model + lifecycle (~/.codex/goals_1.sqlite: status enum, token/time budget fields, per-thread key)? -> our goal state model
- [G2] What exactly does Claude Code /goal (v2.1.139) do (completion condition, autonomous continue-until-met, independent supervisor, status-line overlay)? -> behavior spec
- [G3] What does the vendored z_future/openhuman reference (thread_goals + goalsApi + ThreadGoalChip) model for goal state + UI? -> reuse ideas
- [G4] How does OpenCode inject context via experimental.chat.system.transform (the .opencode/plugins/mk-spec-memory.js pattern)? -> mk-goal.js injection
- [G5] Which OpenCode event/lifecycle hooks (session.created/idle/deleted, message.updated) track + drive a goal; is session.idle the autonomy seam? -> mk-goal.js lifecycle
- [G6] What is the /goal command contract (thin-router like .opencode/commands/memory/learn.md; $ARGUMENTS set|show|clear|complete|pause)? -> goal.md
- [G7] Which state store (flat JSON .goal-state vs sqlite vs spec-kit memory MCP; port thread_goals; key by sessionID)? -> state store decision
- [G8] Which autonomy tier (passive inject / active continuation via session.idle->session.prompt / +supervisor) and what loop caps + kill-switch? -> decision
- [G9] How is completion detected (model self-report vs verifiable shell gate vs supervisor model)? -> decision
- [G10] How to govern budget (token_budget/tokens_used/time_used + usage_limited/budget_limited states)? -> state + lifecycle
- [G11] How to surface the active goal (inject-every-turn + an mk_goal_status tool) as a substitute for Claude's status-line overlay? -> UX
- [G12] What status set + scope/keying (per-session thread_id vs global)? -> decision
- [G13] Should injected goal text pass a prompt-injection sanitizer before entering context (kasper sanitizer idea)? -> safety
- [G14] SYNTHESIS: the recommended end-to-end design (mk-goal.js + goal.md + state store), chosen autonomy tier with guardrails, and ordered build sub-phases -> research.md

## STATE FILES (relative to repo root)
- State Log: .opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/002-goal-opencode-plugin/research/deep-research-state.jsonl
- Strategy: .opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/002-goal-opencode-plugin/research/deep-research-strategy.md
- Write iteration narrative to: .opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/002-goal-opencode-plugin/research/iterations/iteration-012.md
- Write per-iteration delta file to: .opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/002-goal-opencode-plugin/research/deltas/iter-012.jsonl

## CONSTRAINTS
- LEAF agent: no sub-dispatch. Max 12 tool calls. Write findings to files. Do NOT edit deep-research-strategy.md.
- Stay on the Focus Area; cite real file:line (or sqlite output) evidence; name the exact OUR target file/mechanism + a design decision + a risk. Don't duplicate prior iterations (see Last 3).

## OUTPUT CONTRACT (all REQUIRED)
1. Iteration narrative at `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/002-goal-opencode-plugin/research/iterations/iteration-012.md`: headings Focus, Actions Taken, Findings (evidence + OUR target + decision + risk), Questions Answered, Questions Remaining, Next Focus.
2. Per-iteration delta file `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/002-goal-opencode-plugin/research/deltas/iter-012.jsonl`. FIRST line = canonical iteration record EXACT type "iteration": `{"type":"iteration","iteration":12,"newInfoRatio":<0..1>,"status":"<complete|insight|stuck>","focus":"G12","graphEvents":[...]}`. Then one line per finding/decision. Single-line JSON; do NOT pretty-print; do NOT write an executor block.
3. Do NOT append to the shared state log (the orchestrator merges your record from the delta).

newInfoRatio = how much genuinely NEW design information vs prior iterations (be honest; low signals broaden).
