# 08 - Local invisibility

Recorded on 2026-10-24 by a Claude Sonnet 5.5 sub-agent in the operator checkout on branch `main` at `9129007915a2b6ada693440ad106fd8eefa5e589`. Every git command ran with `core.fsmonitor` disabled through the `GIT_CONFIG_*` environment variables.

## A - Status

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
git status --porcelain --ignored | grep -c -E "local-(webflow|obsidian)"
git status --porcelain | grep -c -E "local-(webflow|obsidian)" || echo 0
```

Output:

```text
2
0
0
```

The first line is the positive control. The second `0` is the `grep -c` count and the third `0` is the `|| echo 0` fallback, which prints because `grep -c` exits 1 when it counts zero matches. So the tracked and untracked listing holds zero `local-*` entries.

The two ignored entries behind the control, from `git status --porcelain --ignored | grep -E "local-(webflow|obsidian)"`:

```text
!! .skilled/skills/local-obsidian
!! .skilled/skills/local-webflow
```

Expected: 2 ignored entries as the positive control, then 0. Held: yes. Both entries carry the `!!` ignored marker and nothing carries a `??` or staged marker.

## B - Ignore rules

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
git check-ignore -v .skilled/skills/local-webflow .hermes/skills/local-obsidian | wc -l
```

Output:

```text
       2
```

The two lines behind that count, from the same command without `wc -l`:

```text
.gitignore:236:/.skilled/skills/local-*	.skilled/skills/local-webflow
.gitignore:237:/.hermes/skills/local-*	.hermes/skills/local-obsidian
```

Expected: 2, naming `/.skilled/skills/local-*` and `/.hermes/skills/local-*` from the root `.gitignore`. Held: yes, lines 236 and 237. The second path, `.hermes/skills/local-obsidian`, does not exist on disk (`.hermes/skills` holds no `local-*` entry), so that line tests the ignore pattern and not a present file. The present file is covered by the first path, `.skilled/skills/local-webflow`, and by the `!!` markers in section A.

<!-- evidence:end -->
