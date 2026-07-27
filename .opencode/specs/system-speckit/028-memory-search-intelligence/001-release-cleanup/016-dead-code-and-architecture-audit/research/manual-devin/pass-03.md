# Dead-Code & Architecture Audit — `.opencode/commands/` + `.opencode/agents/`

Read-only pass. Scope: command tree, agent tree, their `assets/`, `scripts/`, and compiled contracts. Every finding below was verified against disk; commands/README.txt, create/README.txt, agents/README.txt, compiled/README.md, legacy/README.md, doctor/scripts/README.md, commands/scripts/README.md, and `_routes.yaml` were used as the documented-layout authorities. `validate-command-references.cjs --self-test` passes clean (0 unresolved across 67 assets); the drift findings below are documentation-vs-artifact, not broken references.

---

### F1 — CAT-3: Committed `.DS_Store` scratch residue in `commands/`

- **Path:** `.opencode/commands/.DS_Store`
- **Evidence:** `ls -la .opencode/commands/` shows `-rw-r--r--@ 1 michelkerkmeester staff 6169 May 25 11:56 .DS_Store` (macOS Finder metadata, dated weeks before any command file). No other `.DS_Store`, `.bak`, `.old`, `.orig`, or `~` files exist in the commands/ or agents/ trees.
- **Verify:** `ls -la .opencode/commands/.DS_Store`
- **Blast radius:** Trivial. Safe to delete; no code references it. One file.

---

### F2 — CAT-5: Canonical `commands/README.txt` omits the entire live `interface/` command group

- **Path:** `.opencode/commands/interface/` (3 live commands: `design.md`, `design-reference.md`, `motion.md` + 9 assets) vs `.opencode/commands/README.txt`
- **Evidence:** `commands/README.txt` overview table (lines 42-50) lists groups `create, deep, doctor, memory, prompt, speckit, root` — no `interface`. Structure tree (lines 72-116) lists no `interface/` directory. Yet `interface/design.md:7` declares `# /interface:design` as a live slash command, and `validate-command-references.cjs` inventory includes `.opencode/commands/interface/design.md`, `.../design-reference.md`, `.../motion.md`. `commands/scripts/README.md:124` even references "Interface command assets" (`../interface/assets/`), confirming the group is known elsewhere.
- **Verify:** `grep -n 'interface' .opencode/commands/README.txt` (no group/structure mention) vs `node .opencode/commands/scripts/validate-command-references.cjs --json | grep interface`
- **Blast radius:** Routing/discovery only. Users relying on the canonical index cannot discover `/interface:design`, `/interface:design-reference`, `/interface:motion`. No runtime breakage.

---

### F3 — CAT-5: `commands/README.txt` documents `agent_router` (underscore) but the file is `agent-router.md` (hyphen)

- **Path:** `.opencode/commands/agent-router.md` vs `.opencode/commands/README.txt`
- **Evidence:** Actual file is `agent-router.md` (hyphen); `agent_router.md` does not exist (`ls .opencode/commands/agent_router.md` → "No such file"). `commands/README.txt:74` structure tree documents `├── agent_router.md`; line 172 table documents `/agent_router <request>`; line 249 usage shows `/agent_router "..."`; line 307 troubleshooting says `Use /agent_router "<request>"`. The README itself insists "Use the exact command name" (line 249) while naming the wrong one.
- **Verify:** `ls .opencode/commands/agent-router.md .opencode/commands/agent_router.md 2>&1` and `grep -n 'agent_router' .opencode/commands/README.txt`
- **Blast radius:** Discovery. Users following the README would type `/agent_router` (underscore); OpenCode derives command names from filenames, so the live invocation is `/agent-router` (hyphen). UNKNOWN whether OpenCode normalizes underscores — flagging the documented-name-vs-filename drift, which is provable regardless.

---

### F4 — CAT-5: `create/diff.md` is a live, working command omitted from both the canonical index and `create/README.txt`

- **Path:** `.opencode/commands/create/diff.md` vs `.opencode/commands/README.txt` and `.opencode/commands/create/README.txt`
- **Evidence:** `commands/README.txt:44` states create has "10" commands; the create table (lines 129-140) and `create/README.txt:38-49` table both list 10 commands and omit `diff`. `create/README.txt:66-99` structure tree lists no `diff.md`. Yet `create/diff.md` is a full router (57 lines) with owned assets present: `create-diff-auto.yaml`, `create-diff-confirm.yaml`, `create-diff-presentation.txt`, and its referenced engine `create_diff.py` and `validate_report.py` both exist at `.opencode/skills/sk-doc/create-diff/scripts/`. The validate inventory includes `.opencode/commands/create/diff.md`.
- **Verify:** `ls .opencode/commands/create/diff.md .opencode/commands/create/assets/create-diff-* .opencode/skills/sk-doc/create-diff/scripts/create_diff.py` and `grep -n 'diff' .opencode/commands/create/README.txt` (absent)
- **Blast radius:** Discovery. `/create:diff` is invocable and wired but undiscoverable via the canonical indexes.

---

### F5 — CAT-5: `deep/alignment.md` and `deep/command-benchmark.md` are live routers omitted from the canonical deep command index

- **Path:** `.opencode/commands/deep/alignment.md`, `.opencode/commands/deep/command-benchmark.md` vs `.opencode/commands/README.txt`
- **Evidence:** `commands/README.txt:45` states deep has "6" commands; the deep table (lines 157-164) and structure tree (lines 90-97) list only `agent-improvement, ai-council, model-benchmark, research, review, skill-benchmark`. The directory contains 8 command `.md` files. `deep/alignment.md` is a 156-line router with assets `deep-alignment-auto.yaml`, `deep-alignment-confirm.yaml`, `deep-alignment-presentation.txt` present. `deep/command-benchmark.md` is an 86-line router with `deep-command-benchmark-auto.yaml`, `deep-command-benchmark-confirm.yaml`, `deep-command-benchmark-presentation.txt` present. Both appear in the validate inventory.
- **Verify:** `ls .opencode/commands/deep/*.md` (8 files) vs `grep -nE 'alignment|command-benchmark' .opencode/commands/README.txt` (absent)
- **Blast radius:** Discovery. `/deep:alignment` and `/deep:command-benchmark` are invocable and wired but undiscoverable via the canonical index.

---

### F6 — CAT-5: `agents/README.txt` inventory omits the live `deep-alignment.md` agent

- **Path:** `.opencode/agents/deep-alignment.md` vs `.opencode/agents/README.txt`
- **Evidence:** `agents/README.txt:11-23` lists 12 agents; `deep-alignment` is absent (`grep -n 'deep-alignment' .opencode/agents/README.txt` → no matches). The directory contains 13 agent `.md` files. `deep-alignment.md` is a 559-line LEAF agent (frontmatter `name: deep-alignment`, `mode: subagent`) referenced by `deep/alignment.md:120` ("the native @deep-alignment agent"), `deep/assets/deep-alignment-auto.yaml:38,85`, and `deep/assets/deep-alignment-presentation.txt:202,236,248`.
- **Verify:** `grep -rn 'deep-alignment' .opencode/agents/README.txt` (empty) vs `grep -rln 'deep-alignment' .opencode/commands/deep/assets/deep-alignment-auto.yaml .opencode/commands/deep/alignment.md`
- **Blast radius:** Discovery. The agent is live and dispatched by `/deep:alignment` but absent from the runtime inventory README.

---

### F7 — CAT-5: `compiled/README.md` describes `deep-alignment.contract.md` as a non-authority placeholder, but the file is a full generated execution contract recorded in the manifest

- **Path:** `.opencode/commands/deep/assets/compiled/deep-alignment.contract.md` vs `.opencode/commands/deep/assets/compiled/README.md` (and `.opencode/commands/deep/assets/legacy/README.md`)
- **Evidence:** `compiled/README.md:46` states `deep-alignment.contract.md` is a "Placeholder required by manifest hashing while alignment remains outside the compiler command map"; line 78 states it "must not act as an execution authority" and "documents that /deep:alignment is not registered in the compiler." `legacy/README.md:92` repeats: "alignment has no generated compiler contract." The actual artifact contradicts both: `deep-alignment.contract.md:1` opens with `GENERATED_COMMAND_CONTRACT_HEADER_START`, carries full `sourceDigests` (lines 7-60+), a `writeBoundary` (line 140), and a complete `renderBlocks.auto` execution section (lines 144-179+; 466 lines total). `manifest.jsonl` contains 17 `deep/alignment` rows with `compiledContractSha256: 7f84e901...` (lines 134-150).
- **Verify:** `grep -n 'placeholder\|not registered\|execution authority' .opencode/commands/deep/assets/compiled/README.md` and `head -1 .opencode/commands/deep/assets/compiled/deep-alignment.contract.md` and `grep -c 'deep/alignment' .opencode/commands/deep/assets/compiled/manifest.jsonl` (17)
- **Blast radius:** High-mislead, low-runtime. A reader trusting the README would treat a real execution contract as a non-authority stub and ignore its render blocks. The contract itself is correct; only the documenting README is stale. Same root cause spans two README files.

---

### F8 — CAT-5: `commands/scripts/README.md` documents a stale family list (`create, deep, design`) that no longer matches the live tree

- **Path:** `.opencode/commands/scripts/README.md` vs `.opencode/commands/scripts/validate-command-references.cjs`
- **Evidence:** `commands/scripts/README.md:48-52` states the checker "scans command assets under these command families by default: create, deep, design." The `design` family does not exist (renamed to `interface`; no `.opencode/commands/design/` directory). The actual `discoverFamilies()` in `validate-command-references.cjs:47-55` dynamically discovers families with an `assets/` dir, and the live run reports `[create, deep, doctor, interface, memory, prompt, speckit]` (7 families). The README omits `doctor, interface, memory, prompt, speckit` and lists a dead `design`.
- **Verify:** `node .opencode/commands/scripts/validate-command-references.cjs 2>&1` (prints `[create, deep, doctor, interface, memory, prompt, speckit]`) vs `sed -n '48,52p' .opencode/commands/scripts/README.md`
- **Blast radius:** Documentation only. The checker itself is correct (dynamic discovery); only the README is stale.

---

### F9 — CAT-4: `create/assets/tests/` contradicts the documented `assets/` layout (YAML-only) and has no reachable runner

- **Path:** `.opencode/commands/create/assets/tests/` (`test_emitted_name_contract.py` + `fixtures/emitted-name-contract.json`)
- **Evidence:** `create/README.txt:78` documents `assets/` as "YAML workflow definitions" and the structure tree (lines 79-98) enumerates 20 `.yaml` files only — no `tests/` subdir. `commands/README.txt:89` likewise states `assets/ # YAML workflow definitions (20 files)`. The `tests/` directory contains a Python unittest module whose own usage doc (`test_emitted_name_contract.py:8`) is `python3 -m unittest discover .opencode/commands/create/assets/tests`, but no CI workflow, route, script, or README invokes that command (repo-wide grep finds only spec docs + the file itself).
- **Verify:** `ls .opencode/commands/create/assets/tests/` and `grep -rn 'create/assets/tests' .opencode/commands .cursor 2>/dev/null` (no caller)
- **Blast radius:** Low. Tests are functional but orphaned; placement inside the YAML assets dir contradicts the documented layout. Simpler shape: move to a top-level `create/tests/` (or a repo-level test dir) and wire into a CI workflow, or delete if the contract is now covered elsewhere.

---

### F10 — CAT-4: `doctor/scripts/tests/` is omitted from `doctor/scripts/README.md` directory tree and has no reachable runner

- **Path:** `.opencode/commands/doctor/scripts/tests/parent-skill-check-leaf-manifest.test.cjs`
- **Evidence:** `doctor/scripts/README.md:27-40` directory tree lists 10 files (no `tests/` directory). The `tests/` directory contains a 273-line Node test for `parent-skill-check.cjs` guards. No CI workflow, route, script, or README invokes it (repo-wide grep finds only spec docs + the file itself). `doctor/scripts/README.md:132-136` validation section lists `node --check` syntax checks for the 10 documented scripts but not the test file.
- **Verify:** `ls .opencode/commands/doctor/scripts/tests/` and `grep -rn 'parent-skill-check-leaf-manifest.test' .opencode/commands .cursor 2>/dev/null` (no caller)
- **Blast radius:** Low. Functional test coverage that is undocumented and unwired. Simpler shape: add `tests/` to the README tree and wire `node .../tests/parent-skill-check-leaf-manifest.test.cjs` into a CI workflow, or delete.

---

### F11 — CAT-1: `commands/scripts/smoke-command-benchmark.cjs` is an undocumented smoke test with no reachable caller

- **Path:** `.opencode/commands/scripts/smoke-command-benchmark.cjs`
- **Evidence:** `commands/scripts/README.md:27-32` directory tree lists only `fixtures/`, `validate-command-references.cjs`, `README.md` — `smoke-command-benchmark.cjs` is absent. The 309-line script targets `deep/command-benchmark.md` and its assets (`smoke-command-benchmark.cjs:11-20`), i.e. a smoke test for one specific command, placed in the shared `commands/scripts/` directory. Repo-wide grep across `.opencode/` and `.cursor/` (CI workflows) finds no invoker — only spec docs (035-command-surface-benchmark, a completed spec) and the file's own usage string reference it. No external contract (not in any README).
- **Verify:** `grep -rn 'smoke-command-benchmark' .opencode/commands .cursor 2>/dev/null` (only the file itself) and `grep -n 'smoke-command-benchmark' .opencode/commands/scripts/README.md` (absent)
- **Blast radius:** Low. Dead one-off from a completed spec. Simpler shape: delete, or relocate next to `deep/command-benchmark.md` and wire into CI.

---

### F12 — CAT-6: `doctor/scripts/check-mcp-mutation-class.sh` is a documented mutation-class guard that no route, workflow, or CI invokes

- **Path:** `.opencode/commands/doctor/scripts/check-mcp-mutation-class.sh`
- **Evidence:** Documented in `doctor/scripts/README.md:30,52,111,127` as a "Read-only contract scan" that "Enforces read-only and mutating classifications for MCP doctor and installer scripts." But `_routes.yaml` `script_invocations` for the `mcp_subroutes` (install/debug, lines 215-235) do not reference it; `mcp-doctor.sh` and `mcp-doctor-lib.sh` do not invoke it (grep of the commands tree for `check-mcp-mutation-class` returns only the file's own header comments, lines 3 and 40). No `.cursor/` CI workflow references it. It has a README contract (so not strictly CAT-1) but zero live callers.
- **Verify:** `grep -rn 'check-mcp-mutation-class' .opencode/commands/doctor/_routes.yaml .opencode/commands/doctor/scripts/mcp-doctor.sh .opencode/commands/doctor/scripts/mcp-doctor-lib.sh .cursor 2>/dev/null` (no caller outside the file itself)
- **Blast radius:** Low. The guard's cost (a maintained script + README surface) is not justified by current usage (nothing runs it). Simpler shape: either (a) wire it into `route-validate.sh` / a CI workflow so the mutation-class invariant is actually enforced, or (b) delete it and rely on `_routes.yaml`'s `mutating:` field as the single source of truth (which `route-validate.py` already checks per `doctor/scripts/README.md:65-76`).

---

**Summary:** 12 findings — CAT-3: 1 (F1); CAT-4: 2 (F9, F10); CAT-5: 7 (F2, F3, F4, F5, F6, F7, F8); CAT-1: 1 (F11); CAT-6: 1 (F12). No CAT-2 legacy-successor findings: `deep/assets/legacy/` and `deep/assets/compiled/` are both documented and consistent with their stated fallback/compiled roles (the one stale claim about `deep-alignment.contract.md` is reported as F7, not a dead-file finding). No backup/scratch residue beyond F1. All file modifications were avoided; no git state mutated.
