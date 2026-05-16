# Deep Research Iteration 018 of 20 — Gap analysis vs mk-skill-advisor + mk-code-graph plugin ecosystem

## SITUATION

You are running as **cli-devin SWE-1.6** in non-interactive print mode, dispatched as iteration 18 of a 20-iteration deep-research campaign on the upstream `dzianisv/opencode-plugins` `auto-review` package.

**Prior context (REQUIRED)**:
- Iter 016 produced gap vs sk-code-review
- Iter 017 produced gap vs deep-* skills

**Why this iter exists**: this is the LAST gap-analysis iter. Our OpenCode plugin ecosystem currently has `mk-skill-advisor.js` and `mk-code-graph.js`. They're plugins (not skills), so they ARE runtime hookable. They have the highest structural similarity to the upstream auto-review plugin — both are OpenCode plugin shape. The gap here tells us if we should add a third plugin (e.g. `mk-auto-review`) or extend the existing ones with auto-review behaviors.

## TASK

### Step 1 — Read both plugin source files

```bash
echo "=== mk-skill-advisor.js ($(wc -l < .opencode/plugins/mk-skill-advisor.js) lines) ==="
cat .opencode/plugins/mk-skill-advisor.js | head -200
echo "..."
cat .opencode/plugins/mk-skill-advisor.js | tail -100

echo
echo "=== mk-code-graph.js ($(wc -l < .opencode/plugins/mk-code-graph.js) lines) ==="
cat .opencode/plugins/mk-code-graph.js | head -200
echo "..."
cat .opencode/plugins/mk-code-graph.js | tail -100
```

### Step 2 — Document the plugin shape for each

For each of our two plugins, fill the shape table:

| Aspect | mk-skill-advisor | mk-code-graph |
|--------|------------------|---------------|
| Language | JS / TS | JS / TS |
| Plugin id | `'mk-skill-advisor'` (verify line) | `'mk-code-graph'` (verify) |
| Default export shape | function vs {id, server} | same question |
| Events listened | `UserPromptSubmit` only? Others? | similar question |
| Config loading | env-only / file / both | similar |
| Diagnostic logging | format + path | similar |
| Child sessions used? | YES/NO | YES/NO |
| Cross-model dispatch? | YES/NO | YES/NO (likely NO — both are advisory) |

### Step 3 — Build the 2-column gap matrix

| Mechanism | mk-skill-advisor | mk-code-graph |
|-----------|------------------|---------------|
| Event-driven activation (session.idle) | <answer> | <answer> |
| Cross-model selection algorithm | <answer> | <answer> |
| Cross-AI family bias | <answer> | <answer> |
| Loop-prevention markers | <answer> | <answer> |
| Loop-prevention session-set | <answer> | <answer> |
| Loop-prevention dedup map | <answer> | <answer> |
| Boundary detection | <answer> | <answer> |
| Min-evidence gate | <answer> | <answer> |
| Structured prompt template | n/a (no LLM dispatch) | n/a |
| PASS/FAIL/UNKNOWN severity | n/a | n/a |
| Final-line exact-string contract | n/a | n/a |
| Anti-repetition rule | n/a | n/a |
| Bounded evidence interpolation | n/a | n/a |
| 3-tier config (file/env/default) | <answer> | <answer> |
| Dynamic model discovery | n/a | n/a |
| Diagnostic logging (per-workspace) | <answer> | <answer> |
| Child-session isolation | n/a | n/a |

Note: many mechanisms are `n/a` for advisor/code-graph because they don't dispatch LLMs.

### Step 4 — The "mk-auto-review" hypothesis

Hypothesize: should we add a third plugin (`mk-auto-review.js`) that ports the upstream behavior, OR extend an existing plugin?

Pros of new plugin:
- Clean separation of concerns
- Independent enable/disable
- Matches upstream pattern directly

Cons:
- Plugin count grows
- Each plugin reloads on its own session.idle (resource cost)

Pros of extending mk-skill-advisor:
- Shares advisor infrastructure (skill-graph lookup for review-relevance)
- Single plugin install/config story

Cons:
- Mixes review with routing — different responsibilities
- Advisor runs on UserPromptSubmit (early), auto-review runs on session.idle (late)

Recommend one approach with rationale.

### Step 5 — Design sketch (if new plugin recommended)

If a new plugin is recommended, sketch its structure:

```
.opencode/plugins/mk-auto-review.js (~300 lines)
├── loadConfig() — reads ~/.config/opencode/plugin/mk-auto-review.json
├── REVIEW_MARKERS, MK_AUTO_REVIEW_DEDUP_MAP, etc.
├── inferReviewModels() (adapted to use our model fleet)
├── runReview() (mirrors upstream)
├── event handler (session.idle / session.error)
└── default export: { id: "mk-auto-review", server: ... }
```

Document key adaptations:
- Config path: `~/.config/opencode/plugin/mk-auto-review.json` (NOT auto-review.json — avoid colliding with upstream if user installs both)
- Env-var prefix: `MK_AUTO_REVIEW_*`
- Diagnostic log: `<workspace>/.mk-auto-review-diagnostics.jsonl` (JSONL for queryability, matching our existing pattern)
- Marker strings: same as upstream (`AUTO-REVIEW` etc.) for cross-plugin compatibility OR distinct (`MK-AUTO-REVIEW`) if we want isolation

## SCOPE

- `.opencode/plugins/mk-skill-advisor.js` (~26 KB)
- `.opencode/plugins/mk-code-graph.js` (~18 KB)
- Iter outputs 007-017
- **No writes outside `research/iterations/iteration-018.md` and `research/deep-research-state.jsonl`**

## VERIFICATION COMMANDS

```bash
for P in mk-skill-advisor.js mk-code-graph.js; do
  echo "=== $P ==="
  wc -l .opencode/plugins/$P
  rg -nE 'session\.idle|UserPromptSubmit|onIdle|abort|loadConfig|readFile|process\.env|diagnostic|debug\.log|appendFile|client\.session|parentID' \
    .opencode/plugins/$P 2>&1 | head -30
done
```

## CONSTRAINTS

- READ-ONLY.
- Cite plugin file:line for every claim.
- Be explicit about which mechanisms are `n/a` (don't apply) vs `DON'T HAVE` (could apply but missing).

## COMMON FAILURE MODES

1. **Plugin entry shape**: OpenCode plugin loader accepts multiple shapes. Don't claim ours is wrong if it's a function default-export.
2. **Bridge module vs plugin**: our plugins delegate to bridge modules (`mk-skill-advisor-bridge.mjs`, `mk-code-graph-bridge.mjs`). Read the plugin file, not the bridge.

## OUTPUT FORMAT

Write to `research/iterations/iteration-018.md`:

```markdown
<!-- PINNED_UPSTREAM_SHA: <sha> -->

# Iteration 018 — Gap analysis vs mk-skill-advisor + mk-code-graph plugin ecosystem

## Summary
<2-4 sentence verdict + recommendation (new plugin vs extension)>

## Findings

### Plugin Shapes
| Aspect | mk-skill-advisor | mk-code-graph |
|--------|------------------|---------------|
| <rows from Step 2> | | |

### Gap Matrix
| Mechanism | mk-skill-advisor | mk-code-graph |
|-----------|------------------|---------------|
| <17 rows from Step 3 with n/a where appropriate> | | |

### mk-auto-review Hypothesis
**Recommendation**: <new plugin / extend existing / hybrid>

**Pros of new plugin**: <list>
**Cons of new plugin**: <list>
**Pros of extending mk-skill-advisor**: <list>
**Cons of extending mk-skill-advisor**: <list>

### Design Sketch (if new plugin)
```
<sketch from Step 5>
```

Key adaptations:
- Config path: `~/.config/opencode/plugin/mk-auto-review.json`
- Env-var prefix: `MK_AUTO_REVIEW_*`
- Diagnostic log: `<workspace>/.mk-auto-review-diagnostics.jsonl`
- Markers: <same as upstream / distinct prefix>

## Convergence Signal
`newInfoRatio: <0.0-1.0>` — high.
```

Then append to `research/deep-research-state.jsonl`:

```jsonl
{"type":"iteration","run":18,"focus":"gap vs mk-* plugins + auto-review hypothesis","mechanismsExtracted":0,"gapsIdentified":<N>,"newInfoRatio":<0.0-1.0>,"executor":"cli-devin","model":"swe-1.6","pinnedSha":"<sha>","durationSec":<N>,"timestamp":"<ISO8601>"}
```

## ACCEPTANCE CRITERIA FOR THIS ITER

- [ ] Plugin shapes table (8 aspects × 2 plugins)
- [ ] Gap matrix (17 rows × 2 plugins) with appropriate n/a markings
- [ ] mk-auto-review hypothesis: clear recommendation with pros/cons for both approaches
- [ ] Design sketch (if new plugin recommended)
- [ ] Output file ≥ 120 lines

Begin.
