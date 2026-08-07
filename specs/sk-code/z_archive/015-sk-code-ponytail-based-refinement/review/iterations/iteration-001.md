# Review Iteration 1 — seat rv-1 (openai/gpt-5.5-fast, variant high)

- Dimension: new-guard-scripts
- Status: complete | exit=0 | duration=240s | P0=0 P1=3 P2=1
- Dispatch: cli-opencode opencode run, openai/gpt-5.5-fast --variant high (read-only)

## Seat output

**Findings**

P1 `.opencode/skills/sk-code-review/scripts/check-rule-copies.js:63-67` omits a live root Iron Law copy. `AGENTS.md:11` contains the same loaded framework rule, but `IRON_LAW_FILES` only checks `sk-code/SKILL.md` and `CLAUDE.md`, so `AGENTS.md` can drift while the canary exits 0.

P1 `.opencode/skills/sk-code-review/scripts/check-rule-copies.js:118-120` checks only the first `Iron Law` line per file. `sk-code/SKILL.md` has two live Iron Law lines at `:45` and `:140`; `.find()` validates only `:45`, so drift in `:140` is invisible.

P1 `.opencode/skills/sk-code/assets/scripts/verify_stack_folders.py:88-94` only detects orphan `references/*` folders. The script/docstring says it keeps both `references/<surface>/` and `assets/<surface>/` aligned, but undeclared `assets/<surface>/` folders are never scanned, so half of the on-disk binding can drift undetected.

P2 `.opencode/skills/deep-improvement/scripts/check-agent-mirror-sync.cjs:73-78` treats a missing `.opencode` canonical as success. Probe: `node .../check-agent-mirror-sync.cjs .opencode/agents/definitely-missing-agent.md` printed `1 agent(s) checked — all mirrors in sync — OK`; stale or orphan runtime mirrors would not be reported as drift.

Checks run: rule canary, rule-canary self-test, mirror sync `--all`, stack-folder verifier. All passed on the current tree.

```json
{"seat":"rv-1","dimension":"new-guard-scripts","findings":[{"id":"F1","severity":"P1","title":"Rule canary omits live AGENTS.md Iron Law copy","file":".opencode/skills/sk-code-review/scripts/check-rule-copies.js","line":"63-67","evidence":"IRON_LAW_FILES checks only sk-code/SKILL.md and CLAUDE.md, but root AGENTS.md:11 contains the same loaded Iron Law. Drift in AGENTS.md would pass the canary.","recommendation":"Add AGENTS.md to IRON_LAW_FILES or derive the root framework aliases so every live root copy is checked."},{"id":"F2","severity":"P1","title":"Iron Law check validates only the first matching line","file":".opencode/skills/sk-code-review/scripts/check-rule-copies.js","line":"118-120","evidence":"The code uses .find(), while sk-code/SKILL.md has two Iron Law lines at 45 and 140. A drift in the second copy would pass as long as the first copy remains valid.","recommendation":"Collect all Iron Law lines for each checked file and validate each one, or enforce exactly one canonical Iron Law line per file."},{"id":"F3","severity":"P1","title":"Stack-folder verifier misses orphan assets surface folders","file":".opencode/skills/sk-code/assets/scripts/verify_stack_folders.py","line":"88-94","evidence":"Only REFERENCES.iterdir() is scanned for undeclared surface folders. The script contract also covers assets/<surface>/, but undeclared assets/* directories are never reported.","recommendation":"Add an ASSETS orphan scan with explicit exemptions for non-surface support dirs such as scripts and universal."},{"id":"F4","severity":"P2","title":"Missing canonical agent path is reported as in sync","file":".opencode/skills/deep-improvement/scripts/check-agent-mirror-sync.cjs","line":"73-78","evidence":"When canonicalPath does not exist the script continues. A read-only probe with .opencode/agents/definitely-missing-agent.md exited 0 and said 1 agent was checked, so orphan/stale mirror cases can look green.","recommendation":"Fail for missing canonical paths when the changed path is under .opencode/agents, and/or explicitly check whether .claude/.codex mirrors exist before deciding an agent is unowned."}],"severityCounts":{"P0":0,"P1":3,"P2":1},"newInfoRatio":1.0}
```