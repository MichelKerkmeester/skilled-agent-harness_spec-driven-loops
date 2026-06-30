# Deep Research Iteration 013 of 20 — Diagnostic logging (.reflection/debug.log, lazy mkdir, ISO-timestamp, safe stringify)

## SITUATION

You are running as **cli-devin SWE-1.6** in non-interactive print mode, dispatched as iteration 13 of a 20-iteration deep-research campaign on the upstream `dzianisv/opencode-plugins` `auto-review` package.

**Prior context (REQUIRED)**:
- Iter 003 documented the `initDebugLogger` function (lazy mkdir, ISO-timestamp prefix, safe JSON.stringify, async-IIFE wrapper)
- Iter 005 documented when it's enabled (`config.debug || process.env.AUTO_REVIEW_DEBUG === "1"`)

**Why this iter exists**: this is a small but reusable diagnostic-logging pattern. The plugin doesn't pollute the user's session with debug noise; instead it writes structured per-workspace logs that an operator can tail. This is exactly the kind of UX-respectful logging we should adopt in our plugins.

Our local equivalent: per memory entry, the skill-advisor hook writes `.mk-skill-advisor-hook-diagnostics.jsonl` in the workspace. Investigate whether our format is comparable.

## TASK

### Step 1 — Re-document the debug logger from iter-003

```bash
sed -n '1,200p' .opencode/specs/skilled-agent-orchestration/z_archive/086-opencode-auto-review-teachings-research/research/iterations/iteration-003.md
```

Pull: log path expression, lazy mkdir pattern, ISO-timestamp format, safe-stringify wrapper, async-IIFE wrapper.

### Step 2 — Document the enable conditions

From iter-005's plugin entry:
- `DEBUG_ENABLED = config.debug ?? process.env.AUTO_REVIEW_DEBUG === "1"`
- If true: `initDebugLogger(directory, true)` runs once at plugin init
- Effect: a module-level `debug: (...args) => void` variable is replaced with a real implementation

### Step 3 — Investigate our diagnostic surfaces

```bash
# Our skill-advisor hooks write a JSONL diagnostic file
find ~ -name '*hook-diagnostics*' 2>/dev/null | head -5
find . -name '*diagnostics*.jsonl' 2>/dev/null | head -5

# Find diagnostic-write code in our hooks
rg -nC3 'diagnostic|debug.log|hook-diagnostics|appendFile|mkdir.*recursive' \
  .opencode/skills/system-skill-advisor/hooks/ \
  .opencode/skills/system-spec-kit/mcp_server/hooks/ \
  .opencode/plugins/ 2>&1 | head -40
```

### Step 4 — Comparison table

| Aspect | Upstream auto-review | Our skill-advisor hooks | Our code-graph hooks | Our plugins (mk-*) |
|--------|---------------------|------------------------|----------------------|---------------------|
| Log path | `<workspace>/.reflection/debug.log` | <path> | <path> | <path or "none"> |
| Format | line: `[<ISO>] [AutoReview] <msg>\n` | <format> | <format> | <format> |
| Enable gate | config.debug OR env=1 | <gate> | <gate> | <gate> |
| Lazy mkdir | YES | <yes/no> | <yes/no> | <yes/no> |
| Safe stringify | YES (try JSON.stringify, fall back to String) | <yes/no> | <yes/no> | <yes/no> |
| Async-IIFE wrapper | YES (avoids blocking debug call) | <yes/no> | <yes/no> | <yes/no> |
| Rotation / retention | NONE (append-only) | <yes/no> | <yes/no> | <yes/no> |

### Step 5 — Propose enhancement opportunities

If our plugins already have per-workspace JSONL logs, ours may be MORE structured than upstream's plaintext format. If we DON'T have lazy mkdir, the upstream pattern is worth adopting (avoids touching disk until needed).

Recommend:
1. Adopt async-IIFE wrapper for non-blocking writes (if we don't have it)
2. Adopt lazy mkdir flag (if we don't have it)
3. Keep our JSONL format (if structured) — it's more queryable than plaintext

## SCOPE

- Iter outputs 003, 005
- Local hook + plugin surfaces (grep above)
- **No writes outside `research/iterations/iteration-013.md` and `research/deep-research-state.jsonl`**

## VERIFICATION COMMANDS

```bash
sed -n '1,200p' .opencode/specs/skilled-agent-orchestration/z_archive/086-opencode-auto-review-teachings-research/research/iterations/iteration-003.md

rg -nC3 'diagnostic|debug.log|appendFile|mkdir.*recursive|async.*IIFE' \
  .opencode/skills/system-skill-advisor/hooks/ \
  .opencode/skills/system-spec-kit/mcp_server/hooks/ \
  .opencode/plugins/ 2>&1 | head -40
```

## CONSTRAINTS

- READ-ONLY.
- Quote `initDebugLogger` body verbatim (from iter-003).
- Cite local hook/plugin file:line for every "we have X" / "we don't have X" claim.

## COMMON FAILURE MODES

1. **Confusing per-workspace vs per-user log path**: upstream uses `<directory>/.reflection/debug.log` (workspace), our hooks may use `~/.cache/...` (user-home). Note the difference.
2. **Async-IIFE confusion**: the pattern `;(async () => { ... })()` is intentional — it doesn't await but allows internal awaits. Don't claim it blocks.
3. **Rotation**: append-only with no rotation will grow unbounded. Note this as a potential issue.

## OUTPUT FORMAT

Write to `research/iterations/iteration-013.md`:

```markdown
<!-- PINNED_UPSTREAM_SHA: <sha> -->

# Iteration 013 — Diagnostic logging pattern

## Summary
<2-4 sentence verdict>

## Findings

### Upstream Debug Logger (verbatim from iter-003)
```typescript
<verbatim initDebugLogger>
```

### Enable Conditions
| Source | Value | Notes |
|--------|-------|-------|
| config.debug | bool from `~/.config/opencode/plugin/auto-review.json` | priority 1 |
| AUTO_REVIEW_DEBUG | env var, "1" enables | priority 2 |

### Per-Pattern Comparison
| Aspect | Upstream auto-review | Our skill-advisor hooks | Our code-graph hooks | Our plugins (mk-*) |
|--------|---------------------|------------------------|----------------------|---------------------|
| <rows from Step 4> | | | | |

### Adoption Recommendations
1. <Recommendation 1>
2. <Recommendation 2>
3. <Recommendation 3>

### Reject List
| Pattern | Why reject | Notes |
|---------|-----------|-------|
| <if any> | | |

## Convergence Signal
`newInfoRatio: <0.0-1.0>` — moderate.
```

Then append to `research/deep-research-state.jsonl`:

```jsonl
{"type":"iteration","run":13,"focus":"diagnostic logging pattern","mechanismsExtracted":1,"gapsIdentified":<N>,"newInfoRatio":<0.0-1.0>,"executor":"cli-devin","model":"swe-1.6","pinnedSha":"<sha>","durationSec":<N>,"timestamp":"<ISO8601>"}
```

## ACCEPTANCE CRITERIA FOR THIS ITER

- [ ] Verbatim initDebugLogger block
- [ ] Enable-conditions table
- [ ] Per-pattern comparison covers 4 columns (upstream + 3 local surfaces) with 7 aspect rows
- [ ] At least 3 adoption recommendations
- [ ] Output file ≥ 70 lines

Begin.
