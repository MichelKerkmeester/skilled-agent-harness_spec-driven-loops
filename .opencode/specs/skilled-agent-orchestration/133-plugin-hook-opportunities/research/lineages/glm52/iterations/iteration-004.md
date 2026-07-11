# Iteration 4: Cross-cutting unified hooks, blast-radius ranking, and backlog assembly

## Focus

Examine cross-cutting hooks that unify multiple skill checks into single invocations, rank all 14 candidates by value/feasibility/blast-radius, and begin backlog assembly. Also address the open questions about observe-vs-enforce appetite.

## Findings

### Candidate 15: Unified PostToolUse Quality Gate (sk-code + sk-doc + system-spec-kit → Claude PostToolUse/Write|Edit + OpenCode tool.execute.after)

**Source skills:** sk-code (`check-comment-hygiene.sh`), sk-doc (`check-frontmatter-versions.sh`, `validate_flowchart.sh`), system-spec-kit (`check-placeholders.sh`, `quality-audit.sh`)
**Runtime surface:** Claude `PostToolUse` matcher `Write|Edit` + OpenCode `tool.execute.after`

Rather than running 5 separate PostToolUse hooks (Candidates 2, 5, 6, 3, 9), a single unified quality-gate hook could dispatch the right check based on the edited file path:

```
if path matches .opencode/skills/**/*.md → run check-comment-hygiene + frontmatter-version
if path matches .opencode/specs/**/*.md → run check-placeholders + quality-audit
if path contains flowchart fence → run validate_flowchart
if path matches *.{ts,tsx,js,mjs,cjs,py,sh} → run check-comment-hygiene
```

This reduces hook-registration overhead (one hook entry in settings.json instead of five) and centralizes the "what runs when" routing logic. The existing `claude-posttooluse.sh` already does this for dist-staleness; extending it to a multi-check dispatcher is the natural evolution.

**Blast radius:** Low (observe/advise). Single hook, multi-check dispatch.

[SOURCE: .opencode/skills/sk-code/code-quality/scripts/hooks/claude-posttooluse.sh]
[SOURCE: .claude/settings.json:112-123]
[SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:60-70]

### Candidate 16: Skill Advisor Effectiveness Tracker (system-skill-advisor → OpenCode tool.execute.after)

**Source skill:** `.opencode/skills/system-skill-advisor/SKILL.md`
**Runtime surface:** OpenCode `tool.execute.after`

The `mk-skill-advisor.js` plugin surfaces skill recommendations at prompt time, but there is no closed-loop tracking of whether those recommendations were followed. A `tool.execute.after` plugin could detect when a skill is actually loaded (via the `skill` tool call) and correlate it with the advisor's recommendation for that turn, feeding the data back as an effectiveness signal.

This closes the recommendation loop: the advisor recommends → the agent follows or ignores → the tracker records the outcome → future recommendations can be weighted by observed effectiveness.

**Blast radius:** Low (observe/log). Data collection only, no behavioral change in the loop.

[SOURCE: .opencode/plugins/mk-skill-advisor.js]
[SOURCE: .opencode/skills/system-skill-advisor/SKILL.md]

## Ranked Backlog (all 16 candidates)

### Tier 1: High Value, Low Blast Radius, Proven Script (Immediate)

| Rank | ID | Candidate | Source Skill | Surface | Blast Radius |
|------|----|-----------|-------------|---------|-------------|
| 1 | C-15 | Unified PostToolUse Quality Gate | sk-code + sk-doc + spec-kit | PostToolUse + tool.execute.after | Low (observe) |
| 2 | C-2 | Comment Hygiene PostToolUse Hook | sk-code | PostToolUse/Write|Edit | Low (observe) |
| 3 | C-5 | Frontmatter Version Validator Hook | sk-doc | PostToolUse/Write|Edit | Low (observe) |
| 4 | C-4 | Code-Graph Re-index Trigger | system-code-graph | tool.execute.after + PostToolUse | Low (background) |
| 5 | C-1 | Git Commit Message Guard | sk-git | PreToolUse/Bash + tool.execute.before | Medium (enforce) |

### Tier 2: Medium Value, Low Blast Radius, New Surface (Near-term)

| Rank | ID | Candidate | Source Skill | Surface | Blast Radius |
|------|----|-----------|-------------|---------|-------------|
| 6 | C-11 | CLI Dispatch Audit Trail | cli-external | tool.execute.after | Low (log) |
| 7 | C-3 | Spec Validation PostToolUse Hook | system-spec-kit | PostToolUse/Write|Edit | Low (observe) |
| 8 | C-13 | Spec-Kit Completion State Exposer | system-spec-kit | tool.register | Low (read-only tool) |
| 9 | C-12 | Deep-Loop State Cleanup on SessionStart | system-deep-loop | session.created | Low (cleanup) |
| 10 | C-10 | Code-Mode Tool Budget Advisor | mcp-code-mode | tool.execute.before | Low (advise) |

### Tier 3: Specialized or Higher Complexity (Future)

| Rank | ID | Candidate | Source Skill | Surface | Blast Radius |
|------|----|-----------|-------------|---------|-------------|
| 11 | C-16 | Skill Advisor Effectiveness Tracker | system-skill-advisor | tool.execute.after | Low (log) |
| 12 | C-14 | Git Worktree Health Monitor | sk-git | session.created + SessionStart | Low (observe) |
| 13 | C-7 | Small-Model Dispatch Advisory | sk-prompt | experimental.chat.system.transform | Low (advise) |
| 14 | C-8 | Design Anti-Slop PostToolUse Advisor | sk-design | PostToolUse/Write|Edit | Low (observe) |
| 15 | C-6 | Flowchart Validator Hook | sk-doc | PostToolUse/Write|Edit | Low (observe) |
| 16 | C-9 | DQI Quality Score Live Feedback | sk-doc | tool.execute.after | Low (observe) |

## Blast-Radius Analysis

**Observe/Advise (low risk):** Candidates 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 — 15 of 16 candidates. These match the dominant pattern in the existing 7 plugins (5 of 7 are observe/advise).

**Enforce/Block (medium risk):** Candidate 1 (Git Commit Guard) — the only enforce candidate. Its blast radius is mitigated by fail-open design, identical to `mk-deep-loop-guard.js`'s reject mode.

**Mutate (not represented):** No candidates propose autonomous mutation via hooks. This is consistent with the existing architecture's conservative posture.

## Sources Consulted

- All previous iteration sources
- `.opencode/skills/sk-code/code-quality/SKILL.md` (lines 1-70)
- `.opencode/skills/sk-code/code-review/SKILL.md` (lines 1-60)

## Assessment

- **newInfoRatio:** 0.5 — 2 new candidates (C-15, C-16); the ranked backlog and blast-radius analysis are synthesis of prior findings, not new discoveries
- **Novelty justification:** Only 2 genuinely new candidates; the ranking adds analytical value but is derivative
- **Confidence:** High — all 16 candidates grounded in real skills

## Reflection

**What worked:** The cross-cutting unified-hook candidate (C-15) emerged naturally from seeing the PostToolUse pattern repeat across iterations 1-3. Blast-radius analysis confirms the portfolio is heavily observe/advise (safe).

**What failed:** No high-value enforce-style hooks emerged beyond the git-commit guard. The existing plugins already cover the critical enforcement surfaces.

**Ruled out:**
- Deep-loop dispatch enforcement — already covered by mk-deep-loop-guard.js
- Spec-memory continuity injection — already covered by mk-spec-memory.js
- Skill routing — already covered by mk-skill-advisor.js
- Goal-state management — already covered by mk-goal.js

## Recommended Next Focus

Address remaining open questions: observe-vs-enforce appetite (KQ-5 now answered: overwhelmingly observe/advise). Verify no skill family was missed. Prepare for convergence check.
