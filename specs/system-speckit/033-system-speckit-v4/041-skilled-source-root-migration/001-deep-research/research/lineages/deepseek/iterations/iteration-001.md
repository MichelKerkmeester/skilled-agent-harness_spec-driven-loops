---
title: "Iteration 1: Symlink Topology — Every Link Into .opencode/"
trigger_phrases: []
---
# Iteration 1: Symlink Topology — Every Link Into .opencode/

## Focus
Surface 1. Enumerate and classify every symlink that resolves into `.opencode/`: count, direction, relative-vs-absolute target, per-runtime shape, live-vs-broken status, and the documented reason for the `.claude/skills` (link) vs `.hermes/skills/` (real generated directory) asymmetry. Verify the brief's "200 symlinks" starting map.

## Findings

### F1.1 — The external census is 174 links, not 200; the brief's own breakdown sums to 177

Measured on this worktree: links whose resolved target lands inside this repo's `.opencode/` are **174**, by directory: `.claude` 56, `.cursor` 53, `.devin` 22, `.pi` 19, `.codex` 19, `.hermes` 2, `specs` 3. The brief's per-directory numbers match for the six runtime dirs exactly; its `specs` count is 4 and `.pytest_cache` 1, but this worktree has **3** specs links resolving into `.opencode` and **no `.pytest_cache/` directory at all** (the brief's own itemized list also sums to 177, not 200). [SOURCE: find/readlink census over the worktree, 2026-09-16]

The three specs links are all in `z_archive`: `specs/system-speckit/z_archive/022-hybrid-rag-fusion/{system-spec-kit,feature_catalog,manual_testing_playbook}` → `../../../../.opencode/skills/system-spec-kit[...]` [SOURCE: specs/system-speckit/z_archive/022-hybrid-rag-fusion/system-spec-kit]. A fourth specs link *names* `.opencode` in its target text but points at a **different checkout** — `specs/sk-git/028-crawlable-commit-history/007-git-workflow-run-failures/research/lineages/deepseek/scratch/it1-worktree-global-hooks/global-hooks/pre-commit` → `/Users/michelkerkmeester/worktrees/public/048-crawlable-commit-history/.../.opencode/scripts/git-hooks/pre-commit` — and is broken today (that worktree no longer exists) [SOURCE: specs/sk-git/028-crawlable-commit-history/007-git-workflow-run-failures/research/lineages/deepseek/scratch/it1-worktree-global-hooks/global-hooks/pre-commit]. This is the same class as `barter/`: a path that mentions `.opencode` but resolves outside this repository.

Inside `.opencode/` itself (excluding all `node_modules/`): **208** symlinks — 203 resolve inside the tree, 1 resolves out (`.opencode/specs -> ../specs`), 4 are broken. The brief's "1 from `.opencode/` itself" undercounts the internal structure by two orders of magnitude, though those internal links travel with the directory and are not the migration's external consumers.

- **Classification**: mechanical
- **Consequence for the cutover**: the retarget list is 174 links, not 200; a design sized on the wrong count under-scopes the retarget script. The 4 already-broken links and 1 external-checkout link must be excluded from any "all links must resolve" post-move gate or the gate fails on pre-existing noise.

### F1.2 — Every external link is relative; the only absolute `.opencode`-naming symlink points into another checkout

All 174 links into `.opencode/` use relative targets (`../.opencode/...`, `../../.opencode/...`, `../../../../.opencode/...`). No absolute-target link into this repo's `.opencode/` exists. The one absolute symlink that names `.opencode` (the 048-worktree scratch link above) is broken and out of scope. [SOURCE: readlink census; e.g. .cursor/agents/code.md -> ../../.claude/agents/code.md, .pi/extensions/prompt-advisor.ts -> ../../.opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts]

- **Classification**: mechanical
- **Consequence for the cutover**: relative links fail *together and only* because their target moves — a single `git mv .opencode .skilled` dangles all 174 at once (plus every `.opencode/...` string in runtime configs, see F1.5). They also mean a retarget is depth-sensitive: each link's `../` count is anchored to its own directory, so a script must recompute rather than string-replace.

### F1.3 — Five distinct link shapes, by runtime and by surface

| Runtime | Into `.opencode` | Shape |
|---|---|---|
| `.claude` | 56 | whole-dir: `skills`; 33 filtered per-file `commands/**`; 21 `hooks/*`; 1 `manual-testing-playbook` |
| `.cursor` | 53 | 33 per-file `commands/*` (flattened names); 18 `hooks/*`; 1 `rules/sk-vision.md`; 1 `manual-testing-playbook` |
| `.devin` | 22 | 21 `hooks/*`; 1 `manual-testing-playbook` (its 12 agent links point at `.claude/agents/`, not `.opencode`) |
| `.pi` | 19 | 17 `extensions/*` + `extensions/lib/*`; whole-dir `skills`; 1 `manual-testing-playbook` |
| `.codex` | 19 | 18 `hooks/*`; 1 `manual-testing-playbook` |
| `.hermes` | 2 | whole-dir `agents`; 1 `manual-testing-playbook` |
| `specs` | 3 | archive links into `.opencode/skills/system-spec-kit/**` |

[SOURCE: per-directory readlink census, 2026-09-16; .claude/SYNC.md:27; .cursor/SYNC.md:22-27; .devin/SYNC.md:29-35; .pi/SYNC.md:26-35; .codex/SYNC.md:28-34; .hermes/SYNC.md:24-28]

Additional cross-tree links that do **not** touch `.opencode` but shape the graph: `.cursor/agents/*.md` (12) and `.devin/agents/*/AGENT.md` (12) symlink into **`.claude/agents/`** [SOURCE: .cursor/agents/code.md -> ../../.claude/agents/code.md; .devin/SYNC.md:29], and root `.mcp.json -> .claude/mcp.json` [SOURCE: .mcp.json].

- **Classification**: mechanical
- **Consequence for the cutover**: two second-order effects. (a) `.claude/agents/` is the upstream for 24 of the 65+34 runtime links — a `.claude`-side change moves differently from an `.opencode`-side change, so the retarget cannot assume one link depth. (b) `.cursor/mcp.json -> ../.mcp.json -> .claude/mcp.json` is a double hop that never touches `.opencode` and needs no change.

### F1.4 — The asymmetry is deliberate: four mechanisms, each with a documented runtime constraint

The difference between `.claude/skills` (a symlink) and `.hermes/skills/` (a real generated directory) is **a Hermes constraint, not an accident**, and the manifests state it: Hermes "scans every project skill directory with its static security scanner at session start (content-hash cached, fail-closed): a symlinked directory is scanned in full, so the whole-tree link cost ten minutes per session and quarantined every hub, and even one linked skill directory was quarantined on its scripts and references" [SOURCE: .hermes/SYNC.md:16]. The same paragraph records the live probe: the single `cli-hermes` link was quarantined on 37 findings [SOURCE: .hermes/SYNC.md:24]. Claude Code and Pi carry no such scanner, so their whole-dir links stand [SOURCE: .claude/SYNC.md:27; .pi/SYNC.md:34].

`.hermes/agents` is a link while `.claude/agents/` is a real directory for the **dialect** reason: Claude's agent dialect (`tools:`) differs from OpenCode's (`mode`/`temperature`/`permission:`) and "the mapping is lossy in both directions. That is why the fork exists" [SOURCE: .claude/SYNC.md:16,81], with a blocking pre-commit gate keeping the pair aligned [SOURCE: .claude/SYNC.md:16,102]. Hermes reads the same file as-is, so its `agents/` is a whole-dir symlink onto the canonical `.opencode/agents` [SOURCE: .hermes/SYNC.md:27]. Codex and Pi need dialect translation so their agent trees are **generated** (TOML for Codex [SOURCE: .codex/SYNC.md:16,28]; tool-name remapping for Pi [SOURCE: .pi/SYNC.md:16,26]).

- **Classification**: manual (each mechanism keeps its own regeneration command; nothing uniform replaces it)
- **Consequence for the cutover**: the four mechanisms are not interchangeable. The move must preserve: (1) symlink targets for the 174 links, (2) the *source path* each generator reads — `sync-skills-hermes.cjs` reads `.opencode/skills/**/SKILL.md` [SOURCE: .hermes/SYNC.md:24], `sync-prompts*.cjs` read `.opencode/commands/**` [SOURCE: .codex/SYNC.md:29; .pi/SYNC.md:27; .hermes/SYNC.md:25], `sync-agents*.cjs` read `.opencode/agents/*.md` [SOURCE: .codex/SYNC.md:28; .pi/SYNC.md:26], and `sync-runtime-mirrors.cjs` hardcodes `CLAUDE_AGENTS = '.claude/agents'`, `CLAUDE_COMMANDS = '.claude/commands'`, `OPENCODE_COMMANDS = '.opencode/commands'` [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs:39-41]. Every generator is a `.opencode`-path reader that must be repointed *and re-run*, in the right order, or it regenerates stale output from the old tree.

### F1.5 — Hook mirror trees are discovery-only; the load-bearing references are literal `.opencode/...` command strings in JSON

The 21+18+18+21 hook symlinks under `.claude/`, `.cursor/`, `.codex/`, `.devin/` are mirrors only: "Hook mirrors are derived from each runtime's own hook config rather than a hand-kept list, because the config is what the runtime actually executes" [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs:14-16]. The executed commands are literal strings in the configs — `.claude/settings.json` carries 22 lines with `.opencode` paths (e.g. `node .opencode/skills/system-spec-kit/runtime/dist/hooks/claude/session-prime.js`) [SOURCE: .claude/settings.json], `.cursor/hooks.json` likewise [SOURCE: .cursor/hooks.json], and `.devin/hooks.v1.json` wraps each in `bash -c 'cd "${DEVIN_PROJECT_DIR:-$PWD}" && node .opencode/...'` [SOURCE: .devin/hooks.v1.json].

- **Classification**: mechanical (rewrite) + regenerate (mirrors)
- **Consequence for the cutover**: two reference classes inside the same directory tree. A retarget that fixes symlinks but not the JSON command strings leaves every hook dead at runtime while `--check` tooling reports mirrors healthy. Conversely, if `.opencode/` remains resolvable after the move (symlink or skeleton), the JSON strings keep working untouched — this is the single largest ordering fork in the design and it is decided by q3.

### F1.6 — Only two runtimes expose the whole skill tree through a link; Devin scans `.opencode/skills` natively

`.claude/skills -> ../.opencode/skills` and `.pi/skills -> ../.opencode/skills` are the only whole-tree links [SOURCE: .claude/SYNC.md:27; .pi/SYNC.md:34]. Devin "discovers the repo's `.opencode/skills/` packets on its own — exposed as `/sk-doc`, `/sk-git`" with no mirror [SOURCE: .devin/SYNC.md:21,34]. Cursor has no skills surface in-repo: "Cursor's own skills live in `~/.cursor/skills-cursor/`" [SOURCE: .cursor/SYNC.md:29]. Hermes consumes generated copies [SOURCE: .hermes/SYNC.md:24]. Codex has no skills surface: "There is no `.codex/skills/`" [SOURCE: .codex/SYNC.md:36].

- **Classification**: blocker-risk (Devin's native scan path is the one consumer that may not follow a link) — UNKNOWN whether Devin's skill discovery traverses a symlinked `.opencode/skills` or requires a real directory at that path. What would settle it: a live probe of `devin` skill discovery against a symlinked tree, or the runtime's discovery source. This is the top candidate for the q2 iteration.
- **Consequence for the cutover**: the residual `.opencode/` question is not only "can opencode run" (q3) — Devin's zero-mirror skill discovery depends on `.opencode/skills` existing as a resolvable path. If the design deletes `.opencode/` outright, Devin silently loses all skills with no mirror to fall back on.

### F1.7 — Eight links are broken today; four of them inside `.opencode/`

Broken links (target absent), repo-wide excluding vendored trees: `.opencode/changelog/sk-design-md-generator` → `../skills/sk-design-md-generator/changelog`; `.opencode/changelog/sk-doc/create-diagram` → `../../skills/sk-doc/sk-create-diagram/changelog`; `.opencode/plugins/sk-vision.js` → `../skills/sk-vision/vision-runtime/dist/plugin.js` (a build output that is not built in this worktree); `.opencode/skills/sk-doc/scripts/validate-flowchart.sh` → `../sk-create-diagram/scripts/validate-flowchart.sh`; plus four in `specs/` scratch/archive trees pointing at other checkouts. [SOURCE: `[ ! -e ]` census over all repo symlinks, 2026-09-16]

- **Classification**: mechanical
- **Consequence for the cutover**: a "nothing dangles" acceptance check must baseline these eight or it fails for pre-existing reasons. The `.opencode/plugins/sk-vision.js` case also marks a **generated** dependency (vision-runtime `dist/`) whose build is currently absent — regeneration commands for `dist/` are q4 material.

### F1.8 — The SYNC.md manifests are already drifted from disk; filesystem is the authoritative inventory

Counts that do not match the tree today: `.claude/SYNC.md` lists `.claude/specs` and `.claude/changelog` as whole-dir symlinks [SOURCE: .claude/SYNC.md:28-29] — neither exists on disk; it says hooks are 18 symlinks [SOURCE: .claude/SYNC.md:26] — 21 exist; `.cursor/SYNC.md` says 15 hooks [SOURCE: .cursor/SYNC.md:25] — 18 exist; `.codex/SYNC.md` says 16 hooks [SOURCE: .codex/SYNC.md:30] — 18 exist. Agent counts read "13" in several manifests while the canonical tree holds **12** agent `.md` files plus a `README.txt` [SOURCE: .opencode/agents/; .claude/agents/; .cursor/agents/; .devin/agents/; .codex/agents/; .pi/agents/].

- **Classification**: manual
- **Consequence for the cutover**: SYNC.md counts cannot seed the retarget script; the script must enumerate the filesystem. It also means the SYNC.md files themselves are a documentation surface needing rewrite in the same change (q8), and that their drift must not be mistaken for migration damage afterwards.

## Sources Consulted
- Readlink/realpath census over all repo symlinks (excluding `node_modules/`, `.git/`, `.worktrees/`), 2026-09-16
- `.claude/SYNC.md`, `.cursor/SYNC.md`, `.devin/SYNC.md`, `.pi/SYNC.md`, `.codex/SYNC.md`, `.hermes/SYNC.md`
- `.claude/agents/README.txt`, `.claude/settings.json`, `.cursor/hooks.json`, `.devin/hooks.v1.json`
- `.opencode/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs`
- Directory listings: `.claude/`, `.cursor/`, `.devin/`, `.pi/`, `.codex/`, `.hermes/`, `.opencode/`, `.skilled/`

## Assessment
- **newInfoRatio**: 1.0
- **Novelty justification**: First pass; the corrected census (174 external links, 208 internal), the relative-only finding, the five link shapes, the documented four-mechanism asymmetry, the discovery-mirror-vs-execution-string split, and the manifest-drift finding are all new to this packet.
- **Confidence**: High on counts and shapes (direct filesystem measurement). Medium on "the consuming runtime resolves that position" for whole-dir skill links — the manifests assert it and record live probes for Hermes, but Claude/Pi link-resolution is documented, not re-probed here. Devin's native `.opencode/skills` scan behavior is UNKNOWN (F1.6).

## Reflection
- **What worked**: the six hand-authored SYNC.md manifests answered the asymmetry question directly and with provenance; pairing them with a filesystem census immediately exposed their drift.
- **What failed**: grepping the codebase for `.claude/skills` / `.pi/skills` found **no** generator or checker that manages those two links — they are hand-made and unguarded, which is itself a finding (nothing would catch a broken skills link).
- **Ruled out**: nothing this iteration.

## Recommended Next Focus
Iteration 2: runtime resolution contracts (q2) plus the residual `.opencode/` question (q3). Specifically: for each of the seven runtimes, locate the file/line that decides where it reads skills, commands, agents, hooks and plugins; test whether each path is configurable or hardcoded to its own directory name; and determine the minimum `.opencode/` must keep resolving for opencode itself (root `opencode.json` → `.opencode/bin/mcp-code-mode-launcher.cjs`) and for Devin's native skill scan.
