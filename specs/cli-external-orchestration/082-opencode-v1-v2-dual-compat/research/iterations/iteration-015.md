# Iteration 15 — A13: install guidance for side-by-side, v1-only and v2-only setups

## Focus

What must the `cli-opencode` skill document so a user can (a) copy this repo's working side-by-side setup, or (b) install just one version? Sub-questions carried in: each installer's behaviour per version, what `opencode upgrade` does on v1 1.19.3 and whether it can jump to 2.x, uninstall and data-safety facts, how a script detects the installed versions, and a proposed repo-shipped setup helper with `both`/`v1`/`v2`/`check` modes.

All probes this iteration were read-only: `--help` output, `npm view`, `brew info --json`, `command -v`, `ls`, `cat` of a 260-byte launcher script, and a recursive grep. No install, upgrade or uninstall was executed.

## Actions Taken

1. **Live v1 flag surface.** `opencode upgrade --help` on 1.19.3. This was the decisive probe — it produced a flag that appears in no help capture in the repo and that reframes the entire "can v1 drift into v2?" question.
2. **Captured v2 help.** Read the already-captured `scratch/cli-help/v2-upgrade-help.txt` and `v2-uninstall-help.txt` (no live run needed).
3. **Channel state.** `npm view opencode-ai dist-tags`, `npm view @opencode/cli dist-tags`, `npm view {opencode-ai,@opencode/cli} bin`, `npm view opencode-ai version`.
4. **Homebrew.** `brew info opencode`, `brew info --json=v2 opencode`, `brew search opencode`.
5. **Layout forensics.** `which -a opencode opencode2`; both `--version` outputs; `ls -la` on both bins; `cat` of the `opencode2` launcher; `ls -1` of `$HOME/.local/share/opencode/`; `ls` of the v2 prefix `bin/`; `$PATH` decomposition; `command -v` for npm/bun/pnpm/yarn/vp/brew/curl/winget.
6. **Skill gap check.** `grep -rniE "install|upgrade|npm i |bun add|curl -fsSL|side.by.side|OPENCODE_DB|opencode2"` over the whole `cli-opencode` skill tree.
7. Abandoned a planned `strings` pass over the v1 compiled binary: the bundle is minified to near-unlimited single lines and the grep returned a 50 KB slice of unrelated TUI code. The `--help` surface is authoritative for flags, so the binary read was dropped rather than retried.

## Findings

### F1 (P0) — v1 cannot reach 2.x by a plain `upgrade`. Reaching 2.x from v1 is a separate, explicitly destructive flag.

`opencode upgrade --help` on 1.19.3:

```
opencode upgrade [target]
upgrade opencode to the latest or a specific version
  -m, --method      installation method to use
                          [string] [choices: "curl", "npm", "pnpm", "bun", "brew", "choco", "scoop"]
      --major       upgrade to OpenCode 2 and remove OpenCode 1                            [boolean]
```

Two independent mechanisms keep v1 at 1.x:

- **Nothing above it in the channel.** `opencode-ai`'s `latest` dist-tag is `1.19.3` — the same version installed here. A v1 `upgrade` with no `target` resolves to "the latest" of its own package, which is 1.19.3. v1 is at the top of its channel, so `upgrade` is a no-op.
- **Crossing the major requires `--major`,** whose own help text is `upgrade to OpenCode 2 and remove OpenCode 1`. The removal is in the flag's contract, not an implementation detail.

Consequence for the skill: a side-by-side install is **upgrade-stable by default on the v1 leg** and can be pinned with zero ongoing effort. The only way a documented `opencode upgrade` recipe destroys the v1 leg is by adding `--major`. The skill should document `--major` as a *migration*, never as an upgrade, and should state that it removes v1.

### F2 (P0) — The two versions are distinct npm packages with distinct bin payloads; only v2 ships a second bin name.

| | v1 | v2 |
|---|---|---|
| package | `opencode-ai` | `@opencode/cli` |
| `latest` | `1.19.3` | `2.0.32` |
| `bin` | `{opencode: bin/opencode.exe}` | `{opencode: bin/opencode.exe, opencode2: bin/opencode.exe}` |
| `--version` output | `1.19.3` (bare) | `opencode v2.0.32` (prefixed) |

`opencode-ai` additionally carries `latest-0: 1.0.142` and `latest-1: 1.1.4` dist-tags — major-version channel markers, i.e. upstream deliberately keeps a per-major "latest" pointer for installers/upgraders to resolve against. This is the structural reason a v1 install cannot drift: the `latest` tag it follows has no 2.x in it, and `latest-1` pins the 1.x line.

v2's dual bin name (`opencode` *and* `opencode2` pointing at one `opencode.exe`) is what makes a non-colliding second copy possible at all: one install, two entry names, and only the name that does not collide is put on PATH.

### F3 (P1) — Homebrew is a v2-only channel. There is no v1 formula.

```
opencode: stable 2.0.32 (bottled)   Not installed
versioned_formulae: []
```

`brew search opencode` returns `opencode`, `opencode-desktop`, `open-code-review`, `opencode-desktop`-adjacent names — no `opencode@1`. Homebrew's formula URL is `github.com/anomalyco/opencode/archive/refs/tags/v2.0.32.tar.gz`, i.e. the formula tracks the v2 repository.

Consequence: brew cannot participate in a side-by-side setup. `brew install opencode` puts a v2 `opencode` on the default PATH and shadows an npm-installed v1 at `~/.local/bin/opencode` (Homebrew's bin precedes or trails depending on `/opt/homebrew/bin` position — either way the name collides and one version becomes invisible). The install matrix must mark brew as **v2-only and exclusive**.

### F4 (P1) — `upgrade --method` vocabularies diverge; a shared `--method` recipe is a foot-gun.

| method | v1 1.19.3 | v2 2.0.32 |
|---|---|---|
| curl | ✓ | ✓ |
| npm | ✓ | ✓ |
| pnpm | ✓ | ✓ |
| bun | ✓ | ✓ |
| brew | ✓ | ✓ |
| choco | ✓ | ✗ |
| scoop | ✓ | ✗ |
| yarn | ✗ | ✓ |
| vp | ✗ | ✓ |
| winget | ✗ | ✓ |

Local availability, verified with `command -v`: npm, bun, pnpm, brew, curl **present**; yarn, vp, winget **absent**. So on this machine only the shared five are usable, and only npm and curl are plausibly deterministic.

`--log-level` diverges in the same way and is easy to get wrong in a shared script: v1 accepts `"DEBUG"|"INFO"|"WARN"|"ERROR"` (uppercase only, per `v1-help.txt`), v2 accepts `all|trace|debug|info|warn|warning|error|fatal|none` (lowercase). A shared recipe must not pass `--log-level` at all, or must build it per version.

### F5 (P0, data safety) — On v2, `uninstall` is documented as data-preserving. On v1, `--major` is documented as removing v1. They are not interchangeable rollback primitives.

`scratch/cli-help/v2-uninstall-help.txt`: `Uninstall OpenCode, keeping session data, configuration, and state`, with `--dry-run` ("Show what would be removed without removing") and `--force, -f`.

Contrast with F1's `--major`: `upgrade to OpenCode 2 and remove OpenCode 1`.

So the rollback story per version is:

- **v2**: `opencode2 uninstall --dry-run` first (cheap, non-destructive, prints the manifest), then `--force`. Session data, config and state survive by contract.
- **v1**: `npm uninstall -g --prefix ~/.local opencode-ai`. Session data at `~/.local/share/opencode/opencode.db` is untouched by the npm operation.
- **Never**: `upgrade --major` as a way to "switch" a v1 install — it deletes the v1 leg by design.
- **Never**: deleting `~/.config/opencode` as post-uninstall cleanup. It is shared (F6); removing it breaks whichever version remains.

### F6 (P0) — The working side-by-side layout is exactly three artifacts, and this repo ships none of them.

Verified state on this machine:

1. **v1 lives in the default npm prefix.** `~/.local/bin/opencode` is a symlink → `../lib/node_modules/opencode-ai/bin/opencode.exe`. Installed with `npm install -g --prefix ~/.local opencode-ai@1.19.3`.
2. **v2 lives in a second npm prefix, deliberately not on PATH.** `~/.local/opencode-v2/lib/node_modules/@opencode/cli/bin/opencode.exe`, with `~/.local/opencode-v2/bin/` holding both `opencode` and `opencode2` symlinks to that one binary. `$PATH` contains `~/.local/bin` (four duplicate entries) and `/usr/local/bin`, and **does not contain `~/.local/opencode-v2/bin`** — which is exactly why v2's own `opencode` cannot shadow v1's.
3. **A 260-byte `/bin/sh` launcher carries the isolation, not the packages.** `~/.local/bin/opencode2`:

```sh
#!/bin/sh
# v2 would otherwise open the same opencode.db as v1 and migrate it in place.
# A relative OPENCODE_DB resolves under the shared data directory.
: "${OPENCODE_DB:=opencode-v2.db}"
export OPENCODE_DB
exec "$HOME/.local/opencode-v2/bin/opencode2" "$@"
```

The in-file comment is the load-bearing fact: **v2 defaults to v1's `opencode.db` and migrates it in place**. A relative `OPENCODE_DB` resolves under the shared data directory, so `opencode-v2.db` lands beside `opencode.db` rather than in the cwd.

The data directory confirms this is not hypothetical — `~/.local/share/opencode/` holds three separate databases: `opencode.db`, `opencode-next.db` and `opencode-v2.db` (each with `-shm`/`-wal`). The `-next` one is the residue of an earlier v2 preview build, i.e. a previous version switch already created a third DB rather than reusing one.

**Irreducible sharing remains:** both versions read `~/.config/opencode` and the cache. There is no per-version config directory, so any config key written for one version is immediately live on the other. That is the single largest irreducible constraint in the whole topic and it belongs in the skill's install section as a warning, not a footnote.

### F7 (P0 for documentation) — The `cli-opencode` skill currently contains zero install guidance.

A recursive `grep -rniE "install|upgrade|npm i |bun add|curl -fsSL|side.by.side|OPENCODE_DB|opencode2"` over the entire `.skilled/skills/cli-external-orchestration/cli-opencode/` tree returns **no** hits for install, curl, side-by-side, `OPENCODE_DB` or `opencode2`. Every `Upgrade` hit is a `## Upgrade` heading inside `changelog/v1.*.md`, i.e. notes about the skill's own version bumps. `references/providers-and-models.md` mentions `opencode models` only as a model-catalogue lookup.

Consequence: A13's output is green-field. Nothing to reconcile, nothing to contradict — the skill needs a new install/setup reference rather than an edit to an existing one. That also means there is no existing documented promise to break.

### F8 (P1) — Version detection must accept two output shapes and must not assume a leading `v`.

- v1: `opencode --version` → `1.19.3`
- v2: `opencode2 --version` → `opencode v2.0.32`

`which -a opencode` returns only v1 paths on this machine (the same path four times, once per duplicate PATH entry); `which -a opencode2` returns only the launcher. So on a machine with both installed the **names differ**, and on a v2-only machine both names resolve to v2. A detector must therefore probe both names and classify by output shape, not by name.

## Install matrix

| Setup | Channel | Command | `opencode` resolves to | Data file | Notes |
|---|---|---|---|---|---|
| v1 only | npm | `npm i -g --prefix ~/.local opencode-ai@1.19.3` | v1 | `opencode.db` | Channel is frozen at 1.19.3; no pinning upkeep |
| v2 only | npm (standard prefix) | `npm i -g @opencode/cli@2.0.32` | v2 | `opencode.db` + `opencode-v2.db` unless `OPENCODE_DB` set | Overwrites the `opencode` name — refuse if a v1 `opencode` is on PATH |
| **both** | npm, two prefixes | v1 as above **+** `npm i -g --prefix ~/.local/opencode-v2 @opencode/cli@2.0.32` **+** write `~/.local/bin/opencode2` | v1 | `opencode.db` (v1) / `opencode-v2.db` (v2) | The only layout that satisfies both; requires the launcher |
| v2 only | brew | `brew install opencode` | v2 | `opencode.db` | **Exclusive.** No `opencode@1` formula; collides on the `opencode` name |
| either | curl | upstream installer | whichever was last installed | installer-chosen | Destructive to the other version — the v2 migration guide's "no longer installed side by side by default". Do not document for dual use |
| — | bun / pnpm | `bun add -g` / `pnpm add -g` | single version | — | Single-version only; no dual-prefix story was established. `yarn`/`vp`/`winget` absent locally |

## Proposed helper: `scripts/opencode-setup.sh <both|v1|v2|check>`

Constants (all verified above):

```
V1_PKG="opencode-ai@1.19.3"      V1_PREFIX="$HOME/.local"
V2_PKG="@opencode/cli@2.0.32"    V2_PREFIX="$HOME/.local/opencode-v2"
BIN="$HOME/.local/bin"           DB_DIR="$HOME/.local/share/opencode"
```

### `check` — no mutation, always safe

1. For each of `opencode` and `opencode2`, resolve with `command -v` and print `realpath`.
2. Classify by running `<path> --version` and matching the shape: `^[0-9]+\.[0-9]+\.[0-9]+$` → v1; `opencode v?([0-9.]+)` → v2.
3. Print which version the bare word `opencode` resolves to — the only thing an operator actually cares about.
4. Print `ls -1 "$DB_DIR"/*.db` so the operator sees which data files exist before touching anything.
5. Print whether `$V2_PREFIX/bin` is on `$PATH` (it must not be).

### `both` — idempotent, order matters

1. `npm install -g --prefix "$V1_PREFIX" "$V1_PKG"` — re-running reinstalls the same version; creates `$V1_PREFIX/bin/opencode`.
2. `npm install -g --prefix "$V2_PREFIX" "$V2_PKG"` — creates `$V2_PREFIX/bin/{opencode,opencode2}`. Both bin names land here; neither is on PATH.
3. Write `$BIN/opencode2` **only if absent or content differs** (compare against a heredoc of the 6-line script; do not rewrite an identical file, so the script stays idempotent and mtime-stable).
4. Never add `$V2_PREFIX/bin` to PATH. If the operator has it there, abort with that message — it re-creates the collision the whole layout exists to avoid.
5. Verify: `"$BIN/opencode" --version` matches v1 shape **and** `"$BIN/opencode2" --version` matches v2 shape; print both.

### `v1` — v1 only

1. Assert no `opencode` on PATH already resolves to v2 (if it does, stop and tell the operator to run `check`; the collision must be resolved by hand, not by overwrite).
2. `npm install -g --prefix "$V1_PREFIX" "$V1_PKG"`.
3. Do **not** write the `opencode2` launcher — with only v1 present there is nothing to disambiguate and `OPENCODE_DB` is unnecessary.
4. Verify v1 shape.

### `v2` — v2 only, on a clean machine

1. Assert `command -v opencode` is empty **or** already classifies as v2. If it classifies as v1, **abort** and print: a v1 install is present; use `both` (side-by-side) — `v2` would overwrite the `opencode` name and orphan the v1 install.
2. `npm install -g "$V2_PKG"` to the *standard* prefix so `opencode` itself is v2. No second name and no launcher needed.
3. **Warn, do not act:** if `$DB_DIR/opencode.db` exists from a previous v1 install, v2 will adopt and migrate it in place (the launcher comment is the evidence). The operator must move it aside or set `OPENCODE_DB` first. The helper must not move files.
4. Verify v2 shape on the bare `opencode` name.

### Rollback lines (documented, never scripted)

```
# v1 leg
npm uninstall -g --prefix "$HOME/.local" opencode-ai

# v2 leg
"$HOME/.local/opencode-v2/bin/opencode" uninstall --dry-run     # inspect first
"$HOME/.local/opencode-v2/bin/opencode" uninstall --force       # documented as keeping session data, config, state
npm uninstall -g --prefix "$HOME/.local/opencode-v2" @opencode/cli   # if the prefix is to be discarded

# after either: remove the now-dangling launcher, and DO NOT delete ~/.config/opencode
```

Order matters in rollback too: uninstall v2 **before** removing the `opencode2` launcher, or the launcher execs a missing binary. And `~/.config/opencode` is shared, so it is never cleanup for one version.

### Irreducible gaps the skill must state plainly

1. **brew cannot coexist** — v2-only, no versioned formula, name collision.
2. **`upgrade --major` is a migration that deletes v1**, not an upgrade.
3. **Shared config and cache** — one `~/.config/opencode` for both; a key written for one is live on the other immediately. No isolation exists to document.
4. **Shared default database** — v2 opens v1's `opencode.db` unless `OPENCODE_DB` is set; the launcher is the only thing preventing it.
5. **v2's background service has no v1 analogue.** Its lifecycle is documented as per-user; whether it outlives an uninstall was not probed and stays UNKNOWN.
6. **`upgrade --method` is version-specific** (F4); shared recipes must omit it.
7. **bun/pnpm dual-prefix behaviour was not established.** Only npm was verified for the two-prefix layout. Mark the rest single-version in the docs rather than implying parity.

## Questions Answered

- **"What install, verification and pinning guidance supports side-by-side and single-version setups, and which gaps stay irreducible?"** — The matrix above plus F1–F8: npm two-prefix is the only verified dual layout (F2, F6); v1 is pinned for free by its frozen channel (F1, F2); v2 needs an explicit pin and a separate prefix (F2); brew is exclusive (F3); `uninstall` is the safe rollback on v2 and `--major` is not (F5); detection is output-shape based (F8); seven irreducible gaps enumerated above.

## Questions Remaining

- Does v2's per-user background service survive `opencode2 uninstall`? Was not probed — `--dry-run` prints a manifest, and no uninstall was run. (P2, needs a disposable machine)
- Do `bun add -g` / `pnpm add -g` support the two-prefix side-by-side layout that npm does (`--prefix` equivalent)? Only npm was verified. (P2)
- Does v1 honour `OPENCODE_DB`, or is the variable v2-only? If v1 honours it, the `v2`-only mode's warning about a stale `opencode.db` applies symmetrically. Not probed. (P2)
- Does `opencode upgrade --major` require an interactive confirmation, or does it act on `--force`/non-interactive? Determines how loud the warning must be. (P2)
- Carried and untouched: `plugins` vs `plugin` config keys; `.opencode/plugins/` discovery unions and flat-file loading on v2; `sk-vision.js` symlink following; `run --format json` schema; `session.idle`/`session.execution.*`; `SystemPart` shape; `context` hook `SessionRequestKind`; `plugin.check` extra-key tolerance; `-m provider/model#variant` on v1; `~/.opencode/hooks.json`; `Q-R1`–`Q-R5`; v2 `run` positional-directory behaviour; hidden `--dangerously-skip-permissions`; `models <provider>` on v2.

## Next Focus

The install axis is now closed to the level of a shippable matrix and helper spec; what remains open in it is either probing a live uninstall (not available under the read-only constraint) or non-npm package managers. The larger unresolved mass is still the **config/plugin compatibility** axis — the carried P0s on `plugin` vs `plugins`, flat-file plugin discovery on v2, and `session.idle` remain the questions that decide whether one `.opencode/` tree can serve both hosts, which is the primary key question and is still unanswered.

## SCOPE VIOLATIONS

None. All probes were read-only; no install, upgrade or uninstall was executed, and no file outside this research packet was written.
