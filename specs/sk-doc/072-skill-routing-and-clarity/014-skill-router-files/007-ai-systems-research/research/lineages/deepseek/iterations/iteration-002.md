# Iteration 2: RQ-2 and RQ-3 - what loads these skills, and every gate that reads a routing section

`[SOURCE: ...]` paths are relative to the AI Systems checkout root, `/Users/michelkerkmeester/MEGA/Development/AI Systems` at `8e4573b8f`, unless the text says otherwise.

## Focus

RQ-2 (loaders) and RQ-3 (checks). The two belong together: a loader that reads only `SKILL.md` decides whether a sibling file is ever seen, and a gate that slices a routing section by heading decides whether the move is legal at all.

## Findings

1. **`opencode.json` names no skill path at all.** Its whole surface is `$schema`, `permission`, one `mcp.code_mode` entry and one `experimental` flag. There is no `skills`, `instructions`, `agents` or `references` key, so OpenCode is not told about a single one of the 16 skills. [SOURCE: opencode.json:1]

2. **`.opencode/skills` is a symlink out of the repository and holds none of the 16.** It resolves to `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills` and lists 17 entries (`cli-classifier`, `cli-external-orchestration`, `cli-orca`, `local-obsidian`, `local-webflow`, `mcp-code-mode`, `mcp-tooling`, `sk-code`, `sk-communication`, `sk-design`, `sk-doc`, `sk-git`, `sk-prompt`, `system-deep-loop`, `system-skill-advisor`, `system-spec-kit`, `README.txt`). [SOURCE: .opencode/skills]

3. **`.claude/skills` is a symlink to the same Public tree, not to `AI Systems/`.** Claude Code therefore loads the same 17 shared skills and, like OpenCode, never sees the 16 project skills. [SOURCE: .claude/skills]

4. **The load path that does reach the 16 is one command, and it reads exactly one file: `{skill_folder}/SKILL.md`.** `Commands/agent-router.md` step 4 says it "Finds and reads the COMPLETE skill identity (the named `{skill_folder}/SKILL.md` that AGENTS.md points to)", its table row 3 records `skill_path, skill_content`, and its load rule says "Primary: read `{agent_scope_root}/{skill_folder}/SKILL.md` COMPLETELY. On load, its routing, references and assets define the identity. Then load only what `SKILL.md` marks ALWAYS". No sibling file is named anywhere in that path. [SOURCE: Commands/agent-router.md:50] [SOURCE: Commands/agent-router.md:329]

5. **No loader in the repository reads a file beside `SKILL.md` on its own, so a sibling `ROUTER.md` is invisible until `SKILL.md` links it.** That is the load-bearing fact behind the canon's pointer rule: the router can move, but the link in `SKILL.md` is the only thing that brings it back in. [INFERENCE: from findings 1-4 plus the absence of any `ROUTER.md` reader in the two runtime symlink trees]

6. **Claude Projects have no automated path at all: the sync compiler was retired on 2026-09-18 and Project files are hand-written.** `AGENTS.md` section 5 states the compiler "is retired and its folder was deleted on 2026-09-18", that a change means listing skill files against their Project counterparts, updating the matching kernel or knowledge file "by hand or record that no Project-facing change is needed", and that "No manifest, lock file or checksum ledger is kept". [SOURCE: AGENTS.md:119]

7. **Four Projects already carry a routing section in their hand-written kernel, so the move changes a Project artefact, not just a skill file.** `claude project/Custom Instructions.md` holds `## 2. SMART ROUTING` in Sales - Direct Communication (line 41), Prompt Improver (line 37), Barter - Deal Templates as `## 5. SMART ROUTING` (line 126) and Sales - HubSpot & Automation as `## 5. SMART ROUTING` (line 107). [SOURCE: AI Systems/Sales - Direct Communication/claude project/Custom Instructions.md:41] [SOURCE: AI Systems/Prompt Improver/claude project/Custom Instructions.md:37] [SOURCE: AI Systems/Barter - Deal Templates/claude project/Custom Instructions.md:126] [SOURCE: AI Systems/Sales - HubSpot & Automation/claude project/Custom Instructions.md:107]

8. **The sync loop's residency ledger shows a hand migration already in flight, counted in statements rather than files.** `residency/counts.md` records 98 of 327 declared statements moved (0 interlock, 16 every-answer, 34 route, 48 duplicate-or-machine), and `residency/moved-route-*.json` keeps per-system statement keys. Anything phase 008 changes in a kernel has to be reconciled with this ledger or it will read as drift. [SOURCE: AI Systems/z — Claude Project Sync Loop/residency/counts.md:1]

9. **The Sales differential gate slices the routing section out of `SKILL.md` by literal heading, so the prose cannot leave without the gate.** `prose[prose.index("## 2. SMART ROUTING"):prose.index("## 3. HOW IT WORKS")]` raises `ValueError` the moment either heading moves. [SOURCE: AI Systems/Sales - Direct Communication/benchmark/router/differential.py:268]

10. **The same gate already reads its pseudocode fence from a sibling file, which is the precedent phase 008 can copy.** `ROUTER_CONTRACT_MD` is `sk-sales-communication/references/router-contract.md` and `extract_pseudocode` compiles the fence out of it, while the prose guard still reads `SKILL.md`. Barter - Deal Templates does the same and says so in its header: "The prose guards keep reading their tables out of SKILL.md, because those tables ...", with the fence in `references/`, and a third copy `## 12. ROUTER CODE` inside the kernel. [SOURCE: AI Systems/Sales - Direct Communication/benchmark/router/differential.py:96] [SOURCE: AI Systems/Barter - Deal Templates/benchmark/router/differential.py:21] [SOURCE: AI Systems/Barter - Deal Templates/benchmark/router/differential.py:117]

11. **The Product Owner hub gate forbids a packet from owning a `ROUTER.md` and requires its routing to stay in `SKILL.md` section 2 - the exact opposite of the canon.** `PACKET_RESIDUE` lists `ROUTER.md` (line 58), `SMART_ROUTING_SECTION = re.compile(r"^## 2\. SMART ROUTING\n(.*?)(?=^## )")` (line 62) is applied at line 185 and a miss appends "packet SKILL.md has no Section 2 SMART ROUTING" (line 187). The same gate also pins the hub's own `ROUTER.md` with `router_state: active` (line 55) and `skill_pointer: SKILL.md` (line 56). [SOURCE: AI Systems/Product Owner/benchmark/gates/check_hub.py:58]

12. **`check_leaf_map_parity.py` reads the hub `ROUTER.md` Python block and each packet's `SKILL.md` `RESOURCE_MAP`, so it spans both homes today**: `source = (ROOT / "ROUTER.md").read_text()` then `DEFAULT_RESOURCE, RESOURCE_MAP, INTENT_SIGNALS` (lines 72-75), against `(ROOT / packet / "SKILL.md")` and its `RESOURCE_MAP` (lines 88-91). [SOURCE: AI Systems/Product Owner/benchmark/gates/check_leaf_map_parity.py:72]

13. **Four Moneybird gates read `ROUTER.md` as a first-class surface, which makes those three skills the working model for the move.** `check-skill-words.py` counts `COUNTED_NAMES = ("ROUTER.md", "SKILL.md")` with the three router files listed as exemptions (lines 54-64); `check-route-table.py` "Reads the ROUTER.md beside the skill's SKILL.md" (line 7) from `ROUTER_MD = os.path.join(SKILL_FOLDER, "ROUTER.md")` (line 63) and can regenerate the router block (line 35); `route-replay.py` replays `ROUTER.md` (lines 8, 77); `exit-code-parity.sh` reads `TROUBLESHOOT` keywords out of `cli-moneybird/ROUTER.md` (lines 45, 230). [SOURCE: AI Systems/Moneybird Accountant/sk-moneybird-accountant/scripts/check-skill-words.py:54] [SOURCE: AI Systems/Moneybird Accountant/sk-moneybird-accountant/scripts/check-route-table.py:63] [SOURCE: AI Systems/Moneybird Accountant/cli-moneybird/scripts/exit-code-parity.sh:45]

14. **This repository's router-shape tooling is vendored into AI Systems but scans `.skilled/skills`, so it does not currently police the 16 project skills.** `ci-router-vocabulary-reach.cjs:50` and `generate-router-intent-signals.cjs:30` both set `SKILLS = path.join(REPO_ROOT, '.skilled', 'skills')`, and `routing-shape-known-debt.json` is keyed by path under `.skilled/skills` with 4 entries. [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs:50] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/routing-shape-known-debt.json:1]

15. **The vendored `package_skill.py` is not the same tool as this repository's: its RS codes are swapped, so a code number means different things in the two repositories.** The AI Systems copy reports `RS-004` as "mode packet carries its own ROUTER.md" / a missing sibling router (lines 1006-1008) and `RS-005` as "no `## MACHINE ROUTER` section" (line 1000), while this repository's copy reports `RS-004` as "no sibling ROUTER.md beside SKILL.md" (line 1029) and `RS-005` as the missing pointer link (line 1113). A migration plan that cites codes without the repository will be read backwards by whoever runs the other copy. [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py:1000] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py:1029]

## Ruled Out

- Assuming `.claude/skills` or `.opencode/skills` holds the 16 project skills. Both are symlinks into `Code_Environment/Public` and hold the same 17 shared skills; the project skills are reached only by `Commands/agent-router.md`.
- Assuming a packaging script will rewrite a Claude Project from the skill source. `AGENTS.md` section 5 retires the compiler and forbids a manifest, lock or checksum, so the Project update is a hand edit or a recorded "no change needed".
- Reading the AI Systems `specs/` harnesses (`AI Systems/Sales - HubSpot & Automation/specs/.../harness.py`, `AI Systems/Barter - Deal Templates/specs/.../harness.py`) as live gates. They live under `specs/`, which the topic excludes, and the replay is kept under `benchmark/`.

## Dead Ends

- Searching for a skill loader in `opencode.json`. There is no skill key to extend, so the only way a sibling router reaches a runtime is the `SKILL.md` pointer and the agent's own follow-the-link behaviour.

## Edge Cases

- Ambiguous input: `AGENTS.md` names `AI Systems/Commands/agent-router.md`, but the directory does not exist inside `AI Systems/`; the real file is `Commands/agent-router.md` at the repository root. Selected the path that exists and recorded the doc inconsistency for phase 008 to fix.
- Contradictory evidence: `check_hub.py` forbids packet `ROUTER.md` while the canon requires one. Both are cited above rather than reconciled; the conflict is phase 008's to settle.
- Missing dependencies: none blocking. No `.env` file was opened.
- Partial success: none.

## Sources Consulted

- `opencode.json`, `.opencode/skills`, `.claude/skills`, `Commands/agent-router.md`, `AGENTS.md`.
- `AI Systems/*/benchmark/router/differential.py`, `AI Systems/Product Owner/benchmark/gates/check_hub.py`, `check_leaf_map_parity.py`.
- `AI Systems/Moneybird Accountant/sk-moneybird-accountant/scripts/{check-skill-words.py,check-route-table.py,route-replay/route-replay.py}`, `AI Systems/Moneybird Accountant/cli-moneybird/scripts/exit-code-parity.sh`.
- `AI Systems/z — Claude Project Sync Loop/systems.cjs`, `residency/counts.md`.
- `.skilled/skills/sk-doc/sk-create-skill/scripts/{package_skill.py,ci-router-vocabulary-reach.cjs,generate-router-intent-signals.cjs,routing-shape-known-debt.json}` in the AI Systems checkout.

## Assessment

- New information ratio: 1.0 - fifteen findings, every one measured this pass.
- Questions addressed: RQ-2, RQ-3.
- Questions answered: RQ-2, RQ-3.

## Reflection

- What worked and why: reading the gates rather than the docs produced both the blocking facts (a heading slice and a residue list) and the precedent (a `references/router-contract.md` already holding a fence), which is what a migration order needs.
- What did not work and why: looking for a loader configuration assumed a config surface that does not exist; the load path turned out to be one command document.
- What I would do differently: check the vendored `package_skill.py` against this repository's copy at the start, not the end. The swapped RS codes change how every later citation should be read.

## Recommended Next Focus

RQ-4 and RQ-5: classify the four existing `ROUTER.md` files against the canon, then design the per-skill target shape, the Project changes and the migration order against the gates measured here - especially `check_hub.py`'s residue rule and the two `differential.py` prose guards - plus each skill's git status in that repository.
