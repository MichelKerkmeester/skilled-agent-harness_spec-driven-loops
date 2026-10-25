# 07 - Routing probes

Recorded on 2026-10-24 by a Claude Sonnet 5.5 sub-agent in the operator checkout on branch `main` at `9129007915a2b6ada693440ad106fd8eefa5e589`. Every output block below is the real output of the command above it. The probes in sections C through E and I through K use the operator ruling of 2026-10-24: the private skill must sit in the top two with `confidence` of at least 0.8 and the generic frontend prompt must keep `sk-code` first.

## A - Operator rebuild

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
export SPECKIT_PRIVATE_SKILL_ROOTS="/Users/michelkerkmeester/MEGA/Development/Obsidian Plugin/local-skills:/Users/michelkerkmeester/MEGA/Development/Websites/anobel.com/local-skills"
node .skilled/bin/skill-advisor.cjs advisor_rebuild --trusted --json '{"force":true}' --format json | jq -r '.data.skillCount'
```

Output (exit status 0, empty stderr):

```text
16
```

Extra read of the same saved JSON, `jq -c '.data|{skillCount,warnings}'`:

```text
{"skillCount":16,"warnings":null}
```

Expected: skillCount of 14 or greater. Held: yes, `16`, which is the 14 tracked nodes plus the two private nodes, with no warnings.

## B - Local nodes

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
sqlite3 -readonly .skilled/skills/system-skill-advisor/runtime/database/skill-graph.sqlite "SELECT id FROM skill_nodes WHERE id LIKE 'local-%' ORDER BY id"
```

Output (exit status 0):

```text
local-obsidian
local-webflow
```

Expected: local-obsidian and local-webflow, one per line. Held: yes.

## C - Webflow prompt

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
export SPECKIT_PRIVATE_SKILL_ROOTS="/Users/michelkerkmeester/MEGA/Development/Obsidian Plugin/local-skills:/Users/michelkerkmeester/MEGA/Development/Websites/anobel.com/local-skills"
node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"implement a responsive webflow animation module"}' --format json | jq -r '.data.recommendations[0:2] | map(.skillId) | join(",")'
```

Output (exit status 0):

```text
sk-code,local-webflow
```

Full top-three array, `jq -c '.data.recommendations[0:3] | map({skillId,score,confidence})'`:

```json
[{"skillId":"sk-code","score":0.695471,"confidence":0.8938},{"skillId":"local-webflow","score":0.524447,"confidence":0.82},{"skillId":"sk-design","score":0.088623,"confidence":0.82}]
```

Rank of `local-webflow`: 2, confidence 0.82. Expected: `local-webflow` within the top two with confidence of at least 0.8. Held: yes.

## D - Obsidian prompt

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
export SPECKIT_PRIVATE_SKILL_ROOTS="/Users/michelkerkmeester/MEGA/Development/Obsidian Plugin/local-skills:/Users/michelkerkmeester/MEGA/Development/Websites/anobel.com/local-skills"
node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"add an obsidian plugin command palette integration"}' --format json | jq -r '.data.recommendations[0:2] | map(.skillId) | join(",")'
```

Output (exit status 0):

```text
mcp-tooling,local-obsidian
```

Full top-three array:

```json
[{"skillId":"mcp-tooling","score":0.660206,"confidence":0.8749},{"skillId":"local-obsidian","score":0.581381,"confidence":0.8325},{"skillId":"sk-code","score":0.238848,"confidence":0.82}]
```

Rank of `local-obsidian`: 2, confidence 0.8325. Expected: `local-obsidian` within the top two with confidence of at least 0.8. Held: yes.

## E - Generic frontend prompt

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
export SPECKIT_PRIVATE_SKILL_ROOTS="/Users/michelkerkmeester/MEGA/Development/Obsidian Plugin/local-skills:/Users/michelkerkmeester/MEGA/Development/Websites/anobel.com/local-skills"
node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"add a responsive css layout to the settings page"}' --format json | jq -r '.data.recommendations[0].skillId'
```

Output (exit status 0):

```text
sk-code
```

Full top-three array (read from the same run with the top-three jq filter):

```json
[{"skillId":"sk-code","score":0.762075,"confidence":0.9296},{"skillId":"local-webflow","score":0.533589,"confidence":0.82},{"skillId":"mcp-tooling","score":0.209031,"confidence":0.82}]
```

Expected: `sk-code` first. Held: yes, score 0.762075. The saved run's two-line form, `jq -r '.data.recommendations[0:2] | map(.skillId) | join(",")'`, printed `sk-code,local-webflow`.

## F - Symlink mode

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
export SPECKIT_PRIVATE_SKILL_ROOTS="/Users/michelkerkmeester/MEGA/Development/Obsidian Plugin/local-skills:/Users/michelkerkmeester/MEGA/Development/Websites/anobel.com/local-skills"
ls -ld .skilled/skills/local-webflow .skilled/skills/local-obsidian
readlink .skilled/skills/local-webflow .skilled/skills/local-obsidian
```

Output (exit status 0):

```text
lrwxr-xr-x@ 1 michelkerkmeester  staff  85 24 Oct 17:31 .skilled/skills/local-obsidian -> /Users/michelkerkmeester/MEGA/Development/Obsidian Plugin/local-skills/local-obsidian
lrwxr-xr-x@ 1 michelkerkmeester  staff  88 24 Oct 17:31 .skilled/skills/local-webflow -> /Users/michelkerkmeester/MEGA/Development/Websites/anobel.com/local-skills/local-webflow
/Users/michelkerkmeester/MEGA/Development/Websites/anobel.com/local-skills/local-webflow
/Users/michelkerkmeester/MEGA/Development/Obsidian Plugin/local-skills/local-obsidian
```

Both entries are symlinks into the two external `local-skills/` folders: `local-obsidian` resolves under the Obsidian Plugin checkout and `local-webflow` under the anobel.com checkout. Expected: two lines each starting with `l`, then the two external target paths. Held: yes.

## G - Plugin checkout

```bash
find /Users/michelkerkmeester/MEGA/Development -maxdepth 2 -type d -iname '*obsidian*' -not -path '*/.git/*' 2>/dev/null | grep -v '/Code_Environment/'
ls "/Users/michelkerkmeester/MEGA/Development/Obsidian Plugin/manifest.json"
```

Output (exit status 0 for the find and grep pipeline, then 0 for the ls):

```text
/Users/michelkerkmeester/MEGA/Development/Obsidian Plugin
/Users/michelkerkmeester/MEGA/Development/Obsidian Plugin/manifest.json
```

Expected: `/Users/michelkerkmeester/MEGA/Development/Obsidian Plugin`. Held: yes, followed by the manifest path echoed.

## H - Symlink targets

```bash
cd "/Users/michelkerkmeester/MEGA/Development/Obsidian Plugin"
for l in .claude .codex .cursor .devin .hermes .opencode .pi .skilled; do printf '%s -> %s\n' "$l" "$(readlink "$l")"; done
```

Output:

```text
.claude -> /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.claude
.codex -> /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.codex
.cursor -> /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.cursor
.devin -> /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.devin
.hermes -> /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.hermes
.opencode -> /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode
.pi -> /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi
.skilled -> /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled
```

Expected: all eight targets resolve under `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/`. Held: yes.

Because `.skilled` in the plugin checkout is a symlink to the operator checkout's `.skilled`, the plugin probes in sections I through K run the same advisor files, the same graph database and the same private roots as sections C through E. Their identical scores below are therefore expected and are the same routing surface seen from a second working directory, not an independent second measurement.

## I - Plugin Webflow prompt

```bash
cd "/Users/michelkerkmeester/MEGA/Development/Obsidian Plugin"
export SPECKIT_PRIVATE_SKILL_ROOTS="/Users/michelkerkmeester/MEGA/Development/Obsidian Plugin/local-skills:/Users/michelkerkmeester/MEGA/Development/Websites/anobel.com/local-skills"
node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"implement a responsive webflow animation module"}' --format json | jq -r '.data.recommendations[0:2] | map(.skillId) | join(",")'
```

Output (exit status 0, empty stderr):

```text
sk-code,local-webflow
```

Full top-three array:

```json
[{"skillId":"sk-code","score":0.695471,"confidence":0.8938},{"skillId":"local-webflow","score":0.524447,"confidence":0.82},{"skillId":"sk-design","score":0.088623,"confidence":0.82}]
```

Rank of `local-webflow`: 2, confidence 0.82. Expected: `local-webflow` within the top two with confidence of at least 0.8. Held: yes.

## J - Plugin Obsidian prompt

```bash
cd "/Users/michelkerkmeester/MEGA/Development/Obsidian Plugin"
export SPECKIT_PRIVATE_SKILL_ROOTS="/Users/michelkerkmeester/MEGA/Development/Obsidian Plugin/local-skills:/Users/michelkerkmeester/MEGA/Development/Websites/anobel.com/local-skills"
node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"add an obsidian plugin command palette integration"}' --format json | jq -r '.data.recommendations[0:2] | map(.skillId) | join(",")'
```

Output (exit status 0, empty stderr):

```text
mcp-tooling,local-obsidian
```

Full top-three array:

```json
[{"skillId":"mcp-tooling","score":0.660206,"confidence":0.8749},{"skillId":"local-obsidian","score":0.581381,"confidence":0.8325},{"skillId":"sk-code","score":0.238848,"confidence":0.82}]
```

Rank of `local-obsidian`: 2, confidence 0.8325. Expected: `local-obsidian` within the top two with confidence of at least 0.8. Held: yes.

## K - Plugin generic frontend prompt

```bash
cd "/Users/michelkerkmeester/MEGA/Development/Obsidian Plugin"
export SPECKIT_PRIVATE_SKILL_ROOTS="/Users/michelkerkmeester/MEGA/Development/Obsidian Plugin/local-skills:/Users/michelkerkmeester/MEGA/Development/Websites/anobel.com/local-skills"
node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"add a responsive css layout to the settings page"}' --format json | jq -r '.data.recommendations[0].skillId'
```

Output (exit status 0, empty stderr):

```text
sk-code
```

Full top-three array:

```json
[{"skillId":"sk-code","score":0.762075,"confidence":0.9296},{"skillId":"local-webflow","score":0.533589,"confidence":0.82},{"skillId":"mcp-tooling","score":0.209031,"confidence":0.82}]
```

Expected: `sk-code` first. Held: yes, score 0.762075.

## L - What the probes do and do not show

Two limits of the sections above, recorded after the first review round.

The `confidence` bound cannot fail on its own. In every top-three array above the recommendations that do not lead sit at exactly `0.82`: `local-webflow` in sections C and E, `sk-design` in section C, `mcp-tooling` in section E and `sk-code` in section D. `0.82` looks like a floor for a non-leading recommendation: every non-leading row above reads `0.82` or, for `local-obsidian`, `0.8325`. That is inferred from these rows, and the advisor source was not read to confirm it. If it holds, a private skill ranked second always clears "at least 0.8". The test with teeth is the rank: `local-webflow` and `local-obsidian` must appear in the top two and `sk-code` must stay first on the generic prompt. The confidence figures are recorded because the operator ruling names them, and they are not evidence that the private skills score well.

`local-webflow` also ranks second on the generic frontend prompt of section E, at `0.533589`, behind `sk-code` at `0.762075`. The ruling asks only that `sk-code` stay first there, and it does. It does mean a settings-page prompt with no Webflow word in it still surfaces the Webflow skill as the second suggestion. Observed, not repaired: the routing surface is out of scope for this phase.

Scores drift in the fourth decimal between reads of the same graph (a later read printed `0.695413` for `sk-code` in section C where this file quotes `0.695471`, and `0.8324` where it quotes `0.8325`). The ranks and the generic-prompt ordering did not change. A replay should compare ranks and the `sk-code` first-place result and not the digits.

<!-- evidence:end -->
