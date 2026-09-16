---
title: "Deep Research Strategy — Skilled Source-Root Migration"
trigger_phrases: []
---
# Deep Research Strategy — Skilled Source-Root Migration

## 2. TOPIC
This repository roots its shared AI asset library at `.opencode/`: every skill, command, agent, hook, plugin, bin script and runtime script is authored there, and six other CLI runtimes reach it through symlinks. A proposal exists to make `.skilled/` the directory that holds those real files, and to turn every runtime directory — `.opencode/` included — into a consumer that links into `.skilled/`. **What would actually have to change, and what would break?** Deliverable: the inventory and blocker list a cutover design can be built from (not the cutover sequence).

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] q1-symlink-topology: For the ~200 links that resolve into `.opencode/`: what does each point at, relative or absolute, does the consuming runtime resolve that position at all, and why is `.claude/skills` a link while `.hermes/skills/` is a real generated directory (and `.hermes/agents` a link while `.claude/agents/` is real)? — ANSWERED (iteration 1): 174 external links, all relative; five link shapes; asymmetry is deliberate (Hermes scanner quarantines symlinked dirs; Claude dialect fork; Codex/Pi generated).
- [x] q2-runtime-contracts: For each of the seven runtimes — Claude Code, Codex, Cursor, Devin, Pi, Hermes, opencode — where does it read skills, commands, agents, hooks and plugins from, and is that path configurable or hardcoded to the runtime's own directory name? Name the file and line that decides it. — ANSWERED (iteration 2): seven contracts, all keyed to the runtime's own directory name; no relocatable path exists in any of them. Generated stubs/TOMLs are runtime-consumed text; Codex hooks install outbound; Codex [agents.*] wiring contradicts the packet README (UNKNOWN).
- [~] q3-opencode-residual: What is the minimum that must remain resolvable at `.opencode/` for the opencode runtime to work (root `opencode.json` launches `.opencode/bin/mcp-code-mode-launcher.cjs`), and does a symlink satisfy each case or do some need a real file? — PARTIAL (iteration 2): seven MCP registrations + launcher internal literal string + dist/ requirement; opencode reads five surfaces inside `.opencode/`; symlink satisfies path resolution, UNKNOWN for plugin flat glob through a symlinked dir.
- [x] q4-derived-state: Every artifact that stores a `.opencode` path as data rather than source text (compiled routing tables, registries, `descriptions.json`, trigger indexes, leaf manifests, SQLite databases, `dist/` output, build attestations, graph metadata): which command regenerates each, and which paths are absolute vs repo-relative? — ANSWERED (iteration 3): trigger index 1,809 refs (generate-trigger-index.mjs); compiled routing closure + serving-closure.manifest.json (compiled-route-sync.cjs, with a spec-tree move-simulation mode); 295 code files construct paths at runtime; four dist trees (90 files) with per-package `npm run build`; 7 hash-only attestations survive a pure move; two SQLite DBs; skill graph-metadata `key_files` authored (no generator); 517 absolute-path files (264 JSON) fail silently-at-old-checkout.
- [x] q5-repo-gates: Which of the pre-commit/pre-push/prepare-commit-msg hooks, validators, naming guards and 20 CI workflows would reject the migration commit itself, and what ordering must they be taught the new path in? — ANSWERED (iteration 4): mirror parity + agent mirror-sync BLOCK a rename commit (the latter with no bypass flag); comment hygiene silently disengages if `.opencode/skills/sk-code` vanishes; route/spec re-mint block when they cannot fix; the installed hooks are home-level symlinks into the MAIN checkout (they dangle before any gate can run); 19 workflows keyed to `.opencode/**` filters with 12-of-19 silent-skip paths; "skilled" already a release-branch namespace.
- [x] q6-external-refs: Which references live outside the repository (`~/.codex/config.toml`, `~/.claude/`, `~/.config/devin/`, `~/.pi/`, `~/.hermes/`, installed hooks, launch wrappers) and will silently keep pointing at the old path? — ANSWERED (iteration 4): four live `.opencode`-naming references (7 git-hook symlinks, `~/.codex/hooks.json` 18 strings, `~/.hermes` MCP args, `~/.codex` trust entry for `.../Public/.opencode`); path-keyed state that survives (codex/hermes/claude registries keyed on the checkout root, `.pi/agent` symlinks to `.pi/*`); clean negatives named; no in-repo validator covers this class.
- [x] q7-migration-mechanics: Does `git mv` preserve history at this size; what happens to existing symlinks whose targets traverse the moved directory; can the change land as one commit or must it be staged; does any tooling cache an absolute path that survives the move? — ANSWERED (iteration 5): 17,766 tracked files; the repo's own large-reorg playbook governs (git mv, pure-rename commit separate from content edits, R-status check, old-prefix sweep, toolchain on main); 174 external links dangle at once; 9 ignored entries don't move (all 4 dist trees untracked); `.skilled/` placeholder makes the naive move nest; cached absolute paths enumerated.
- [x] q8-doc-surface: Of the ~3,000 tracked markdown files naming the path, which mentions are load-bearing instructions that become wrong and which are prose that merely reads stale? — ANSWERED (iteration 5): 3,035 files (excl specs); 816 carry fenced-block runnable refs (rewrite-critical, incl. 111 SKILL.md); 100 generated stubs (regenerate); root docs counted (REPO RULES.md is 0 — brief correction); 1,710 evidence/prose (freeze); treatment table delivered.
<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Not deciding whether the move is a good idea — that decision is made.
- Not proposing the cutover sequence — that is phase 002's work; a sequence written from a partial inventory is worse than none.
- Not editing anything outside this lineage directory (hard write-containment: `research/lineages/deepseek/` only).
- Not re-counting the already-measured baseline; extend and correct it where found wrong.

---

## 5. STOP CONDITIONS
- stopPolicy: max-iterations — run all 5 iterations regardless of convergence signal; convergence before iteration 5 is telemetry only.
- Escalate if: a runtime is found to hard-require its own directory name in a way no symlink can satisfy, or write-containment blocks a required evidence command.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- q1-symlink-topology: **174 external links** resolve into `.opencode/` (56 `.claude`, 53 `.cursor`, 22 `.devin`, 19 `.pi`, 19 `.codex`, 2 `.hermes`, 3 `specs` archive) — not 200; all relative; no `.pytest_cache` in this worktree. Internal `.opencode/` links (excl. node_modules): 208 = 203 in + 1 out (`.opencode/specs -> ../specs`) + 4 broken. Five shapes: whole-dir links, filtered per-file commands, hook mirrors (discovery-only), per-extension links, nested agent links. The `.hermes/skills` vs `.claude/skills` asymmetry is **deliberate**: Hermes's static security scanner quarantines symlinked skill directories (10 min/session for the whole-tree link; the single `cli-hermes` link quarantined on 37 findings), so Hermes gets generated markdown-only copies; `.claude/agents/` is a real fork because the agent dialect is lossy in both directions, guarded by a pre-commit gate; Codex/Pi agent trees are generated dialect translations. (iteration 1)
- q2-runtime-contracts: **Seven runtimes, seven contracts, none relocatable.** opencode reads `.opencode/{skills,commands,agents,plugins}` (+ MCP registration in root `opencode.json:15`); Claude reads `.claude/{skills,commands,agents,settings.json}`; Codex reads `.codex/{prompts,agents}` generated + outbound `~/.codex/hooks.json`; Cursor reads `.cursor/{commands,agents,rules,hooks.json}`; Devin reads `.devin/agents/<name>/AGENT.md` + native `.opencode/skills`; Pi reads `.pi/{skills,prompts,extensions}`; Hermes reads `.hermes/{skills,plugins}` behind a trust grant. Generated stubs (`.codex/prompts`, `.pi/prompts`) and TOMLs are **runtime-consumed text** naming `.opencode` paths → `regenerate`, not rewrite. Codex `[agents.*]` wiring contradicted by both configs (UNKNOWN). (iteration 2)
- q4-derived-state: **Five regenerate classes, two rewrite classes, one clean class.** Regenerate: trigger index (`generate-trigger-index.mjs`, 1,809 refs), compiled routing closure (`compiled-route-sync.cjs`; manifest stores both `generatedFrom` and `runtimeRoot`), four `dist/` trees (`npm run build` per package; 90 compiled files carry `.opencode`), build attestations (hash-only — survive a pure move), spec metadata (`repair-derived.cjs --apply`). Rewrite: 295 code files constructing paths at runtime (root-finder probes fail hard if `.opencode/skills` vanishes), skill-root `graph-metadata.json` `key_files` (authored, no generator). Clean: leaf manifests, `description.json`. Absolute-path class: 517 files (264 JSON), silent-at-old-checkout failure. (iteration 3)
- q5-repo-gates: **The gates that must validate the move are installed from the path being moved.** Mirror parity blocks a rename commit (`MIRROR_SOURCES` matches old paths; only `SPECKIT_SKIP_MIRROR_PARITY=1` escapes); agent mirror-sync blocks with **no bypass**; comment hygiene silently disengages if `.opencode/skills/sk-code` disappears; route/spec re-mint block when they cannot fix. The seven installed hooks are symlinks from `~/.config/git/hooks` into the **main checkout's** `.opencode/scripts/git-hooks/*` — they dangle the moment the main checkout moves. 19 workflows are path-filtered on `.opencode/**`; 12 of 19 skip silently when a guard script is missing. (iteration 4)
- q6-external-refs: **Four live `.opencode`-naming references outside the repo, plus a surviving path-keyed class.** Live: `~/.config/git/hooks/*` (7 symlinks → main checkout), `~/.codex/hooks.json` (18 command strings), `~/.hermes/config.yaml` MCP args, `~/.codex/config.toml` `[projects."…/Public/.opencode"]` trust entry. Survives: registries keyed on the checkout root (`~/.codex` projects + hooks.state, `~/.hermes` trusted_project_dirs, `~/.claude.json`), `~/.pi/agent/*` → `.pi/*` symlinks, `~/.codex/AGENTS.md`. Clean negatives named. No in-repo validator checks this class. (iteration 4)
- q7-migration-mechanics: **The repo's own large-reorg runbook governs the mechanics.** 17,766 tracked files under `.opencode/` (198 executable, 208 symlinks) vs one `.skilled/` placeholder `.gitkeep`; `git mv` over raw `mv`+add; **pure renames in a separate commit from content edits**; verify `R`-status; post-merge zero-tracked-files-under-old-prefix sweep; toolchain and reindex run on `main` after merge. 174 external links dangle at once; 208 internal links travel intact; 9 ignored entries (5 node_modules, 4 dist trees — all untracked — plus a version marker) do not move. `.skilled/` existing means the naive `git mv` nests. (iteration 5)
- q8-doc-surface: **3,035 files, split 816 runnable / 2,219 prose.** 816 carry `.opencode` inside fenced code blocks (rewrite-critical: 111 `SKILL.md`, 217 `references/**`, 47 `commands/**`, 45 `hooks/**`, 36 `agents/**`); 100 generated stubs are regenerate-only; root docs: README 52, PUBLIC-RELEASE 33, AGENTS.md 9, CONTRIBUTING 3, **REPO RULES.md 0 (brief correction)**; 1,710 evidence/prose files freeze; specs corpus 24,661 out of scope. (iteration 5)
<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- Six hand-authored SYNC.md manifests answer mechanism/source/drift questions directly with provenance (iteration 1)
- Pairing manifest claims with a filesystem readlink census exposes drift immediately (iteration 1)
- Reading runtime configs directly converts manifest claims into checkable facts — two claims failed or narrowed (iteration 2)
- Checking the brief's named artifact classes one by one produced both hits and clean negatives; the negatives size the rewrite as much as the hits (iteration 3)
- Reading gate bodies instead of gate names exposed the block-vs-silent-skip split that a name-only inventory misses (iteration 4)
<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- Grepping code for `.claude/skills` / `.pi/skills` found no generator or checker managing those two links — they are hand-made and unguarded (iteration 1)
- Searching for a repo-visible "relocate the runtime directory" key found none in any of the seven runtimes — recorded as absence-of-evidence with the probe that would settle runtime-internal behavior (iteration 2)
- Assumed a generator existed for skill-root `graph-metadata.json`; the metadata contract settled it as authored (iteration 3)
- Full-tree grep of `~/.hermes` for the repo path was too slow and returned cache/session noise; narrowed to the live config surface (iteration 4)
<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[Populated when an approach has been tried from multiple angles without success]
<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- `~/.opencode/` as a live external reference: the directory does not exist; the `~/.zshrc` PATH entry is stale (iteration 4, evidence: iteration-004.md F4.7)
<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded
<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
[Self-owned open questions from iteration write-back -- populated after iteration 1 completes]
<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
SYNTHESIS — iteration cap reached (5/5, stopReason maxIterationsReached). Consolidate all five iterations into `research.md`: the correction ledger, the eight surface answers, the blocker inventory, and the UNKNOWN list. No further iterations.
<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
Research brief measured baseline (from `scratch/topic.txt`, `git grep`/`find` over the current tree) — treat as a starting map, correct where wrong:
- 200 symlinks point into `.opencode/` (`.claude` 56, `.cursor` 53, `.devin` 22, `.pi` 19, `.codex` 19, `.hermes` 2, `specs` 4, `.pytest_cache` 1, `.opencode` itself 1).
- 4,258 tracked files contain the literal string `.opencode`, 85,769 occurrences, excluding `specs/` and `node_modules/`; 1,223 non-markdown (405 json, 371 ts, 111 cjs, 69 sh, 64 yaml, 44 mjs, 40 py, 29 txt, 23 js, 20 yml, 14 toml, 10 tmpl, 4 jsonl + 3 git hooks).
- 20 GitHub Actions workflows reference the path; `.gitignore` has 62 opencode lines; 3,328 symlinks repo-wide (excl `node_modules/`, `.git/`, `.worktrees/`).
- `.skilled/` exists with one empty placeholder dir; `~/.codex/config.toml` references this repo's `.opencode`.
- Ruled out already: `barter/` (links resolve to a different checkout).

### Bounded Context Snapshot
- **Source pointers**: `.claude/SYNC.md`, `.cursor/SYNC.md`, `.devin/SYNC.md`, `.pi/SYNC.md`, `.codex/SYNC.md`, `.hermes/SYNC.md` — each is a hand-authored runtime sync manifest naming every surface, mechanism (symlink/generated/hand-authored) and source. These are the primary evidence base for q1/q2.
- **Reuse candidates**: the six SYNC.md manifests' surface-inventory tables; the mirror generators under `.opencode/skills/system-spec-kit/runtime/cli/` (`sync-*.cjs`).
- **Integration points**: root `opencode.json` (mcp launcher path), root `.mcp.json -> .claude/mcp.json`, root `CLAUDE.md -> AGENTS.md`, `.claude/agents/` fork vs `.opencode/agents/` source, pre-commit agent-mirror gate.
- **Constraints and risks**: hard write-containment to the lineage dir; no git write commands; no repo tooling that writes; read-only commands only.
- **Initial corrections found in recon**: `.pytest_cache` does not exist in this worktree; `specs` has 3 (not 4) links resolving into this repo's `.opencode`; `.claude/SYNC.md` lists `.claude/specs` and `.claude/changelog` whole-dir symlinks that do not exist on disk (manifest drift); `.opencode/` carries ~246 internal symlinks excluding `node_modules/`, not 1.

resource-map.md not present; skipping coverage gate.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 5
- Convergence threshold: 3 (telemetry only — stopPolicy is max-iterations)
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred, not runtime-wired)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A
- Current generation: 1
- Started: 2026-09-16T08:50:00Z
