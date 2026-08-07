DEEP-REVIEW

# Deep-Review Iteration Prompt Pack — iter 10 of 20

## STATE

state_summary: 9 iters done. P0=0, P1=2, P2=11. Convergence math held for 4 iters. Iter 10: cross-runtime configuration sync — AGENTS.md / CLAUDE.md / .claude/CLAUDE.md / .codex/AGENTS.toml / .gemini/CLAUDE.md (if present) / root README.md sync for the small-model dispatch rule + 21-skill count + sk-small-model entry.

Review Iteration: 10 of 20
Mode: review
Dimension: **cross-runtime-config** (cross-cutting)

## ITERATION 10 FOCUS — RUNTIME-PARITY SYNC

### Check 1: Small-model dispatch rule presence + parity

Grep for "Small-model dispatch rule" (or `sk-small-model` mention) across:
- `/AGENTS.md`
- `/CLAUDE.md`
- `/.claude/CLAUDE.md`
- `/.codex/AGENTS.toml` or `/.codex/CLAUDE.md`
- `/.gemini/CLAUDE.md`

For each file that mentions the rule, capture the wording. Check for byte-level (or close) parity across markdown copies. Per `feedback_codex_toml_body_drift`: codex TOML body is allowed to differ in form but must contain equivalent rule.

Flag P1 if rule is missing from any expected runtime file. Flag P2 if rule wording drifts non-trivially.

### Check 2: Root README skill count

Read `/README.md` (root) and verify:
- Mentions "21 skills" (or "21" with skill context)
- sk-small-model entry exists under §3 OTHER (or wherever non-system skills land)
- Total skill count is internally consistent (count actual skills directory entries vs claim)

Run Bash `ls .opencode/skills/ | wc -l` to verify the actual count.

Flag P1 if count mismatch ≥2; P2 if marginal.

### Check 3: sk-small-model entry in root README

Re-read README sk-small-model entry. Verify:
- Description matches what sk-small-model SKILL.md describes (anchor for small-model patterns)
- Trigger phrases sample matches description.json (1-2 representative phrases)
- Linked path `.opencode/skills/sk-small-model/` works

### Check 4: AGENTS.md ↔ CLAUDE.md sync rule

Per memory `feedback_agents_md_sync_triad` (canonical + Barter only as of 2026-05-01): AGENTS.md should sync to CLAUDE.md. Check whether the small-model dispatch rule wording in both files is identical (modulo runtime-specific tweaks).

### Check 5: Trigger phrases in description.json

Read `.opencode/skills/sk-small-model/description.json`. Verify:
- Has trigger_phrases array (per skill metadata convention)
- Phrases include model names + pattern names
- No malformed phrases (empty strings, leading/trailing whitespace)

Verify the file frontmatter passes `jq` parse via Bash.

## STATE FILES

- Write iter to: `.opencode/specs/sk-prompt/004-sk-prompt-small-model-optimization/review/iterations/iteration-010.md`
- Write delta to: `.opencode/specs/sk-prompt/004-sk-prompt-small-model-optimization/review/deltas/iter-010.jsonl`
- State log: `.opencode/specs/sk-prompt/004-sk-prompt-small-model-optimization/review/deep-review-state.jsonl`

## CONSTRAINTS

- LEAF agent. Soft 12 / hard 13 tool calls.
- Read-only review target.
- Allowed write: 3 paths above.
- Use absolute paths.

## OUTPUT CONTRACT

1. **iteration-010.md** with per-check sections + findings + verdict.
2. **state.jsonl APPEND** single line.
3. **deltas/iter-010.jsonl** multi-line.

## EXECUTION

1. sequential_thinking 5+ thoughts.
2. Bash `ls .opencode/skills/ | wc -l` for count.
3. Grep "Small-model dispatch rule" across the 5 runtime files.
4. Read README sk-small-model entry.
5. Bash `jq` on description.json to validate.
6. Compose iter + delta + state. Stop.
