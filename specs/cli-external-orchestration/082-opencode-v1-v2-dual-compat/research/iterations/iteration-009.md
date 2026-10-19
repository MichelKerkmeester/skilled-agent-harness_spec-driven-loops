# Iteration 9 — A8: skill discovery on OpenCode v1 1.19.3 and v2 2.0.32

## Focus

Which skill sources each version discovers, how each treats this repo's skill tree (`.opencode/skills` → `../.skilled/skills`, nested mode packets, `.claude/skills` → the same real directory), whether duplicate ids collapse, which `SKILL.md` frontmatter fields are read, and which permission keys gate skills.

## Actions Taken

1. Confirmed both binaries and their versions: `opencode` = **1.19.3**, `opencode2` = **v2.0.32**.
2. Confirmed `opencode debug skill` exists on v1 (`debug` subcommands include `skill   list all available skills`, alongside `debug v2` and `debug agent <name>`), then captured its full output to a scratch file outside the repo and counted it: **73 entries, 60 of them under the repo root**.
3. Called v2's skill API twice with the raw URL-encoded query, as instructed: `opencode2 api GET "/api/skill?location%5Bdirectory%5D=<url-encoded repo root>"` → `{"location":{"directory":"…/Public"},"data":[…]}`. Captured **74 entries, 60 of them under the repo root**.
4. Diffed the two id sets and the two path-attribution maps, and cross-checked the 60 against a filesystem census (`find .skilled/skills -name SKILL.md`).
5. Verified the two skill roots are the same real directory (`readlink` on both).
6. Ran a frontmatter key census over all 60 repo `SKILL.md` files and inspected `sk-communication`, the one top-level skill-shaped directory that appears in neither host's list.
7. Attempted a permission-key check: no `"skill"` permission key exists in `opencode.json` / `.opencode/*.json`, and `opencode debug config` produced no usable `permission` projection — **inconclusive, carried forward** (see Q-R3).

## Findings

### F1 — Both versions expose exactly the same 60 repo skills, nested packets included (P0)

`opencode debug skill` (v1) returned 73 rows; `/api/skill` (v2) returned 74. Filtering to the repo root gives **60 on both**, and the id sets are identical: `cli-classifier`, `cli-external-orchestration` plus its seven `cli-*` children, `cli-orca`, `mcp-code-mode`, `mcp-tooling` plus its ten `mcp-*` children, `sk-code` plus its five `sk-code-*` children, `sk-doc` plus its fifteen `sk-create-*` children, `sk-design` plus its five children, `sk-git`, `sk-prompt`, `sk-vision`, `system-deep-loop` plus `deep-research`/`deep-review`/`deep-ai-council`, `system-skill-advisor`, `system-spec-kit`.

The count matches a filesystem census exactly: `find .skilled/skills -name SKILL.md` = **60**. So both hosts recurse into nested directories and treat **every** `SKILL.md` as its own skill — the parent-hub-plus-mode-packet layout the repo already uses needs no change for either version.

### F2 — Both hosts follow the symlinked roots and collapse them to one entry per real file (P1)

`.opencode/skills` and `.claude/skills` are both symlinks to `../.skilled/skills` (`readlink` returns `../.skilled/skills` for each), and `pwd -P` inside `.skilled/skills` resolves to `.../Public/.skilled/skills`. Two roots × 60 files would yield 120 rows if neither host deduped; both yield 60. Conclusion: discovery resolves the symlink, then dedupes by resolved real path, and the repo's duplicate-root exposure is **not** an "exposed twice" risk on either version.

### F3 — The two versions disagree on *which* symlinked path they report (P1)

For five shared ids v1 reports `.claude/skills/…` while v2 reports `.opencode/skills/…`, for the same underlying file:

| id | v1 `location` | v2 `path` |
|---|---|---|
| `cli-codex` | `.claude/skills/cli-external-orchestration/cli-codex/SKILL.md` | `.opencode/skills/cli-external-orchestration/cli-codex/SKILL.md` |
| `cli-devin` | `.claude/skills/cli-external-orchestration/cli-devin/SKILL.md` | `.opencode/skills/…/cli-devin/SKILL.md` |
| `sk-code-quality` | `.claude/skills/sk-code/sk-code-quality/SKILL.md` | `.opencode/skills/sk-code/sk-code-quality/SKILL.md` |
| `sk-create-frontmatter` | `.claude/skills/sk-doc/sk-create-frontmatter/SKILL.md` | `.opencode/skills/…/sk-create-frontmatter/SKILL.md` |
| `sk-create-with-human-voice` | `.claude/skills/sk-doc/sk-create-with-human-voice/SKILL.md` | `.opencode/skills/…/sk-create-with-human-voice/SKILL.md` |

Everything else both hosts report under `.opencode/skills/…`. Practical impact: any consumer that keys on the reported path string — a hook that matches a skill path prefix, a cache keyed by `location`, a log-based dedupe — will disagree across versions for those five ids. Consumers must normalise via `realpath`, not compare reported strings.

### F4 — Global and built-in layers differ; the repo layer does not (P2)

Directional delta of the non-repo rows:

- **v2 only:** `opencode` (`/builtin/opencode.md`), `report` (an operator-global skill under `~/.claude/skills/synced/…`).
- **v1 only:** `customize-opencode` (`location: <built-in>`, i.e. compiled into the binary).

So the built-in skill packaged with each binary differs in both name and mechanism — v1 ships a virtual `<built-in>` row, v2 ships a real markdown file at `/builtin/opencode.md`. Repo-neutral, but it means a "skill count" assertion (73 vs 74) can never be a compatibility check on its own.

### F5 — Both versions leak `node_modules` skills into the catalog (P1)

Three ids in both catalogs come from a vendored dependency tree, not from `.skilled/skills` proper:

```
playwright-cli                 .opencode/skills/sk-design/sk-design-md-generator/backend/node_modules/playwright-core/lib/tools/skills/playwright-cli/SKILL.md
playwright-component-testing   …/node_modules/playwright-core/lib/tools/skills/playwright-component-testing/SKILL.md
playwright-trace               …/node_modules/playwright-core/lib/tools/skills/playwright-trace/SKILL.md
```

Byte-identical behaviour on both hosts, so it is not a compatibility break — but it is 3 of the 60 slots, it inflates the parent-hub count, and it means an `npm install` under `sk-design/sk-design-md-generator/backend` can change the exposed skill catalog on both versions at once. Any "60 skills" acceptance check is fragile against that install.

### F6 — Frontmatter: `name`/`description` are optional (directory name wins), and two documented fields are unused (P2)

Census over the 60 repo `SKILL.md` files:

| field | files carrying it |
|---|---|
| `name` | 57/60 |
| `description` | 57/60 |
| `allowed-tools` | 57/60 |
| `version` | 57/60 |
| `metadata` | 11/60 |
| `argument-hint` | 4/60 |
| `disable-model-invocation` | 0/60 |
| `license` | 0/60 |

The three without any of `name`/`description`/`allowed-tools`/`version` are exactly the three vendored `playwright-*` skills from F5 — and both hosts still list them, with directory-derived ids. So `name` is **not** required on either version; a directory basename is the id fallback. Representative shapes, both accepted by both hosts:

```yaml
allowed-tools: [Read, Bash, mcp__code_mode__call_tool_chain]
argument-hint: "[worktree|commit|finish]"
version: 1.9.4.0
```

[SOURCE: .skilled/skills/sk-git/SKILL.md:4] [SOURCE: .skilled/skills/sk-git/SKILL.md:5] [SOURCE: .skilled/skills/sk-git/SKILL.md:6]

and the no-`argument-hint` shape [SOURCE: .skilled/skills/system-skill-advisor/SKILL.md:4] [SOURCE: .skilled/skills/system-skill-advisor/SKILL.md:5], and the minimal two-field shape [SOURCE: .skilled/skills/sk-vision/SKILL.md:4] [SOURCE: .skilled/skills/sk-vision/SKILL.md:5].

`disable-model-invocation` is used by **no** repo skill on either version, so its cross-version semantics are untested by the repo and do not constrain compatibility today.

### F7 — `sk-communication` is a skill-shaped directory that exposes nothing on either version (P1)

`.skilled/skills/sk-communication/` contains no `SKILL.md` at all — only `cli-communication-projection/{dist,node_modules}`. Since both hosts key on a file literally named `SKILL.md` (F1's census counts 60 and skips this tree entirely), this top-level entry is invisible to v1 **and** v2. That is version-neutral but it is a repo bug of the same family: a top-level directory under the skills root that the catalog silently drops.

### F8 — Skill permission keys: NOT settled (P2, carried forward)

No `"skill"` permission key exists in `opencode.json` or `.opencode/*.json`, and `opencode debug config` yielded no readable `permission` projection in this iteration, so the v2 `skill` action and its v1 equivalent remain **UNVERIFIED**. What *is* established is the read surface: v1's list payload carries `{name, description, location, content}` and v2's carries `{id, name, description, path, content}` — neither surfaces `allowed-tools`, `version`, `argument-hint` or `metadata`, so those fields influence nothing observable through the catalog API on either version.

### Compatibility table (skills only)

| Dimension | v1 1.19.3 | v2 2.0.32 | Repo compatible? |
|---|---|---|---|
| Repo skills exposed | 60 | 60 | **Yes — identical ids** |
| Nested `SKILL.md` as separate skills | yes | yes | Yes, no layout change |
| Root followed | `.opencode/skills` + `.claude/skills`, both symlinks resolved | same | Yes |
| Duplicate handling | deduped by real path (60, not 120) | deduped by real path | Yes |
| Reported path for 5 ids | `.claude/skills/…` | `.opencode/skills/…` | **Diverges — normalise with realpath** |
| `name` required | no (dir fallback) | no (dir fallback) | Yes |
| `description`/`allowed-tools`/`version` | tolerated | tolerated | Yes |
| `argument-hint`, `metadata` | tolerated (unobserved effect) | tolerated (unobserved effect) | Yes |
| `disable-model-invocation` | unused by repo | unused by repo | Untested |
| Built-in skill row | `customize-opencode` (`<built-in>`) | `opencode` (`/builtin/opencode.md`) | N/A (binary-owned) |
| `node_modules` skills catalogued | yes (3) | yes (3) | Yes, but fragile |
| Skill permission key | UNVERIFIED | `skill` action UNVERIFIED | Open |

### Skills the repo has that a version would not expose, or expose twice

- **Would not expose:** `sk-communication` — and its `cli-communication-projection` child — on **both** versions (no `SKILL.md`). Nothing else: the exposed 60 = the 60 discoverable `SKILL.md` files.
- **Expose twice:** nothing, on either version. Both collapse the two symlinked roots to one entry per real file.
- **Would expose without the repo asking:** the 3 vendored `playwright-*` skills, on both versions.

## Questions Answered

None of the five remaining strategy key questions is fully answered by this iteration. Its skills leg is settled with evidence, but the question also covers agents, commands and `opencode.json`, which are not re-verified here. Honest status: skills leg of Q2 **answered**; Q2 as written **unanswered**.

## Questions Remaining

- **Q-R1 (new, P1):** Which permission key gates skill invocation on each version — v2's `skill` action and the v1 equivalent — and do they accept the same values? Read `opencode.json`'s resolved `permission` block on both hosts, or the `permission` schema page on each docs tree.
- **Q-R2 (new, P1):** The five ids in F3 that report `.claude/skills/…` on v1 only — what decides the winning root, and does it flip when `.claude/skills` is removed? Cheap test: temporarily point only one root at the tree in a scratch project (not this repo) and re-read both catalogs.
- **Q-R3 (new, P2):** Does either version honour `disable-model-invocation: true`, and does `allowed-tools` restrict the model's tool surface or is it documentation only? The repo uses `allowed-tools` in 57 files, so a v2 change of meaning would be a behaviour break even though the catalog looks identical.
- **Q-R4 (new, P2):** Is the `node_modules` leak (F5) suppressible by config on either version (an ignore/exclude key), or must the vendored tree move out of the skills root?
- **Q-R5 (new, P2):** Should `sk-communication` gain a `SKILL.md` or move out of `.skilled/skills` — a repo decision, not a host one, and out of scope for editing here.
- Carried forward and untouched: v1/v2 `plugin` vs `plugins` config keys; `.opencode/plugins/` discovery unions; flat-file plugin loading on v2; `sk-vision.js` symlink following; `run --format json` schema; `ORCA_OPENCODE_PLUGIN_API` host-derived replacement; the `Reload` mixin; `session.idle`/`session.execution.*`; `SystemPart` shape; `context` hook `SessionRequestKind`; `plugin.check` extra-key tolerance; command-template `` !`cmd` `` injection and `POST /api/session/{id}/command`; `.opencode/command` vs `.opencode/commands` scan; why `/api/command` returned no project commands.

## Next Focus

**A9 — skill permission gating and `allowed-tools` semantics on both versions** (Q-R1, Q-R3), because it is the last skills-surface gap and it is the one with real behavioural risk: the catalog is proven identical, but a permission or `allowed-tools` meaning change would be invisible in the catalog and visible only at invocation. Concrete actions: read the resolved `permission` block on both hosts, locate the `skill` action in v2's config schema and its v1 counterpart, and confirm whether `allowed-tools` restricts or merely documents. If A9 closes quickly, promote A10 to the vendor-leak question (Q-R4) and then move to the Q2 synthesis across agents, commands and skills.

## SCOPE VIOLATIONS

None. Every write in this iteration went to `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/research/` (this narrative, `deltas/iter-009.jsonl`, and the gateway's own ledger refresh). Probe outputs were redirected only to `/tmp` scratch files. No researched file was modified, and none of the would-be repo fixes (adding a `SKILL.md` to `sk-communication`, relocating the vendored playwright tree) was performed.
