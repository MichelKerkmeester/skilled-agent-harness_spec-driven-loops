{"timestamp":"2026-09-11T18:48:30.270Z","runtime":"claude","status":"ok","freshness":"stale","durationMs":1997,"cacheHit":false,"errorDetails":"SOURCE_NEWER_THAN_SKILL_GRAPH","skillLabel":"sk-code"}
# Iteration 3 — Findings

**Method note.** Read-only: every citation below was opened and line-checked this run against HEAD state. `AGENTS.md` is **502 lines** (read output truncated at `[Showing lines 1-488 of 502]`), not 501. `repo-rules/` holds **11 files** (`ls`), `REPO RULES.md` holds 11 trigger rows (:40-50), 11 index rows (:58-68) — parity holds. The 5 best-surface and rule-system files re-read in full here: `AGENTS.md`, `REPO RULES.md`, `skill-hub-routing.md`, `handoff-and-questions.md`, `presenting-decisions.md`, plus the four `sk-create-repo-rule/references/*` files and the packet's README.

---

## Q1. Which new rules do the skills and other system surfaces actually justify?

**Result: zero.** Five new candidates were proposed and run through all four tests (`decision-tests.md:85-92`); all five failed. The adopted set's own refusal record (`decision-tests.md:94-96`) plus my five make the count of considered-and-declined candidates 15. The deciding facts this iteration adds:

**1.1 The retrieval layer itself documents why rule content cannot bind on read paths.** `retrieval-conventions.md:283` — the trigger-index coverage table — records `repo-rules` as deliberately excluded from both retrieval lanes: *"Decided against. The nine rule documents carry the same frontmatter as spec docs, but they are loaded at Gate 5 through the trigger table in `REPO RULES.md`, not retrieved at Gate 1; indexing them would surface a rule as a context candidate."* A parity test enforces the table (`:270`), and the rest of `.opencode` is exclusion-by-design too (`:281`). This is the system's own confirmation of the Gate 5 constraint (`AGENTS.md:122`: *"Trigger: the FIRST write of the session... Read-only turns never fire it"*; `decision-tests.md:32-33`): a rule has exactly one load path — the write-turn router — so content needed on any read-only turn fails test 1 doubly, since not even Gate 1 could surface it.

**1.2 Every surface that exists has an owner and needs no new rule.** Survey coverage this iteration (beyond iterations 1–2): the 13 skill roots (contracted as H=6/S=7 in `skill-root-metadata-contract.md:53-54`), the five runtime mirrors (`SYNC.md` × 5), `.opencode/agents/` (13 files), `.opencode/commands/` (36 command entries per `commands/README.txt:44-51`), hooks/plugins, and `sk-communication` (which is deliberately off the advisor route: `sk-communication/SKILL.md:14`). Each dependency class resolves to an owner already named in a citation below.

**1.3 Candidates proposed and refused this iteration** (full test mapping in REFUSALS):
- R1 "mirror-sync discipline" (canonical edit → regenerate mirrors) — fails test 3 part 4 (no `AGENTS.md` anchor exists or may be added without escalation, `sk-create-repo-rule/SKILL.md:209-210`) and restraint (drift is mechanically checked: `/doctor runtime-mirrors`, `.codex/SYNC.md:110-115`).
- R2 "router count parity" — fails test 3 part 1 (single row, not a cluster); already a step in `agents-md-integration.md:73-74` and a recipe in packet `README.md:178`.
- R3 "runtime persona resolution" — fails test 3 part 2; `AGENTS.md` §9's table (:427-434) plus the cli-* skills own it; the observed defect is stale citations (Q3), not a missing constraint.
- R4 "MCP registration ≠ availability" — fails test 1; it binds on read-only tool calls and already sits at `AGENTS.md:363`.
- R5 "catalog/currency maintenance" (counts drift in the skills catalog, Q2.5) — fails test 3 part 1; owner is each catalog surface, and the correct fix is deleting hand-maintained counts, not adding a rule (precedent: the playbook root *"does not hand-maintain counts"*, playbook `:32`).

---

## Q2. Which existing rules need changing, and why?

### 2.1 The 11 rule files themselves: no change justified

Different method from iteration 1, same conclusion. All **14 `AGENTS.md §N` citations inside `repo-rules/`** were enumerated and checked against current headings, and all resolve: `uncertainty-and-honesty.md:48`→§2 (Confidence Thresholds `:88-97`), `presenting-decisions.md:93-94,107,141`→§2/§7/§3, `handoff-and-questions.md:52,109,147,150`→§10/§3/§2/§3, `scope-discipline.md:106,123`→§1/§3, `prevent-overengineering.md:69,128`→§3, `communication.md:37`→§8. External refs resolve: `skill-hub-routing.md:68`→`parent-skills-nested-packets.md` §7 exists (:212); `skill-hub-routing.md:88`→`parent-skill-check.cjs` exists; `:114`→`system-skill-advisor/` exists; `communication.md:115`→`hvr-rules.md` exists; `handoff-and-questions.md:128`→`.pi/PLUGINS.md` exists (:16-19 records the ask-user-question extension). Versions show live maintenance (`handoff` 1.1.0.0, `delegation` 1.0.0.2; grep of all 11 frontmatters). **No observed failure in any rule file.**

### 2.2 The falsified-count class extends beyond the four references (new surfaces)

Iterations 1–2 established it for `rule-anatomy.md`, `creation-standards.md`, `agents-md-integration.md`, `decision-tests.md`. It is **not confined to them**:

- **Packet README** `.opencode/skills/sk-doc/sk-create-repo-rule/README.md` — `:89` *"all nine shipped rules and in the router"*; `:139` *"The set carries 161 phrases with zero collisions"*; `:140` *"All nine shipped rules fail that document type"*; `:165` *"Three of the nine shipped rules sit at the limit"* (current bands, per iteration 2's recount and the two missing rows in `rule-anatomy.md:94-106`, do not describe 3-of-9).
- **Packet playbook** — `manual-testing-playbook/rule-authoring/standards-gate-rejection.md:78` *"All five standards pass on all nine shipped rules"*.
- **Changelog contradicts README within the same packet** — `changelog/v1.1.0.0.md:29` says *"all eight shipped rules"* about the identical fact README `:140` calls *"nine"*. Neither is 11.
- **Corpus count, new surface** — `retrieval-conventions.md:283` *"The nine rule documents"* against 11 files on disk (`ls repo-rules`). Since this row also explains the Gate 5 exclusion, its count is load-bearing for the system's own reasoning.
- **Playbook root arithmetic** — `manual-testing-playbook/manual-testing-playbook.md:34`: *"Three scenarios write... The remaining six are read-only"* (= 9) against the changelog's *"Ten-scenario"* (`v1.1.0.0.md:16`) and packet README:195 *"Ten operator scenarios, seven of which end in a refusal or a halt"* (six vs seven).

### 2.3 Two mirror/catalog counts (new surfaces)

- `.devin/SYNC.md:38` — *"Devin also discovers the 12 `.opencode/skills/` packets"*. Current fleet: **13 roots**, enumerated with class in `skill-root-metadata-contract.md:53-54`.
- `.opencode/skills/README.txt` — `:3`/`:24`/`:31` say *"11 top-level skill identities"* / *"cli-* (1), mcp-* (2), sk-* (5), system-* (3)"*. Current: cli-* 1 ✓, mcp-* 2 ✓, system-* 3 ✓, **sk-* 7** (catalog lists 5, and its `sk-design-md-generator` row points at `sk-design-md-generator/README.md` (`:61`) while the actual path is `sk-design/sk-design-md-generator/README.md` — a broken relative link from the skills front door; `sk-communication` and `sk-vision` have no rows at all).

### 2.4 The Python-scorer role claim (extension of iteration 2's finding)

Iteration 2 found `AGENTS.md:61` (`skill_advisor.py` as a Gate Action), `sk-git/SKILL.md:587`, `cli-opencode/SKILL.md:357`, `install-guides/README.md:1032`, `sk-git/README.md:79`. Additional instances this run: **`skills/README.txt:80`** — *"A Python shim (`skill_advisor.py`) provides a fallback when the native path is unreachable"* — which **contradicts its own catalog row four lines earlier** (`:69`: the *"daemon-backed `skill-advisor` CLI as fallback"*) and `AGENTS.md:101` (*"The Python scorer... is not a routing fallback"*). The same file's §7 then recommends comparing native vs Python outputs *"to isolate the mismatch"* (`:152`), and `install-guides/README.md:1036`, `:1121` use the Python script as the Gate-2 verification recipe. One statement, four conflicting homes.

### 2.5 AGENTS.md's own Gate-Action defect still reads as iteration 2 left it

`:61` *"Gate Actions: the trigger index lookup, `skill_advisor.py`"* — the live fallback is `.opencode/bin/skill-advisor.cjs` (`:101`); the Python tool remains correct for `--emit-routing-projection` (`skill_advisor.py:4698`; documented in `system-skill-advisor/feature-catalog/scorer-fusion/projection.md:28`, and used correctly by `create-skill-parent-auto.yaml:240`), so the defect is the one-word Gate-Action name, not the tool.

No rule-file change is justified by any of this; every item is a dependent-document correction, which is Q3/Q4 work.

---

## Q3. Where is cross-skill or cross-system integration missing or broken?

### 3.1 NEW — AGENTS.md section citations from skills/agents/commands have drifted; the rule files' have not

Verified against current headings: the Code Search Decision Tree is **§5** (`AGENTS.md:311`, tree at `:337`); runtime agent directories are **§9** (`:415`, `:423`, table `:427-434`); Confidence Thresholds are **§2** (`:88-97`); Logic-Sync is **§7** (`:387-399`); tool selection is **§5**. Ten files cite *"AGENTS.md Section 6 decision tree"*: `sk-git/SKILL.md:589`, `mcp-code-mode/SKILL.md:417`, `cli-opencode:358`, `cli-claude-code:370`, `cli-codex:371`, `cli-devin:452`, `cli-cursor:404`, `mcp-chrome-devtools:317`, `mcp-aside-devtools:314`, `sk-prompt/SKILL.md:492`. Eight files cite *"AGENTS.md §7"* for the persona/agent-directory rule: the six `cli-*` mode files (`cli-opencode:258`, `cli-pi:207`, `cli-claude-code:284`, `cli-codex:284`, `cli-devin:364`, `cli-cursor:312`), `cli-external-orchestration/SKILL.md:171`, and `sk-prompt/assets/cli-prompt-quality-card.md:113`. `agents/code.md:360-361` cites *"§4"* for both confidence thresholds and Logic-Sync (should be §2 and §7), propagated to `.claude/agents/code.md:346-347`, `.codex/agents/code.toml:350-351`, `.pi/agents/code.md:354-355`. `code.md:518` names a *"Quality & Anti-Patterns table"* that no longer exists by that name (the table is *Restraint Signals*, `AGENTS.md:212-226`); mirrored at `.claude/agents/code.md:504`, `.codex/agents/code.toml:508`. `speckit-plan.yaml:647` says *"Tool selection delegated to AGENTS.md Section 8"* (§8 is Communication). By contrast, the 14 rule-file citations (§2.1) and `folder-routing.md:352` (*"Gate 3 (AGENTS.md §2)"*) all resolve — the drift lives where citations are numeric and ungated. One low-confidence instance flagged for the author, not asserted: `create-agent-auto.yaml:539` and `create-readme-auto.yaml:607,1058` cite *"AGENTS.md §3 — sk-doc template alignment and quality validation"*; §3 holds Quality Principles but the template/validation requirement is §9:440.

### 3.2 NEW — the runtime-mirror layer carries Gate 1 only; no Gate 5 reach is instrumented anywhere

- The generated pointer block exists in exactly two carriers and contains **only** the Gate 1 lookup: `.codex/AGENTS.md:124-132`, `.cursor/rules/skill-routing.md:20-28` (both generated by `sync-gate1-pointers.cjs`, whose intro text is at `:31`).
- The doctor's own Gate-1 reach model records *"codex through .codex/AGENTS.md; cursor and devin through .cursor/rules/skill-routing.md"* and reports `gate1_reach: {claude: direct, codex: pointer, cursor: pointer, devin: pointer, pi: inherited}` (`doctor-speckit-retrieval.yaml:162,175`). Pi's full inheritance is separately documented with a source citation (`.pi/SYNC.md:92`); Devin's is evidenced by its own `devin rules list` output *"skill-routing [Cursor] · CLAUDE [Claude] · AGENTS [Standard]"* (`.devin/SYNC.md:80`). **No equivalent signal, check, or claim exists for Gate 2/3/5 reach on any mirror surface** — grep for `Gate 5` across `.opencode` returns only the router template (`repo-rules-router-template.md:38`), the retrieval table, and an unrelated deep-loop promotion gate.
- The cursor/devin static routing list (`skill-routing.md:9-16`) contains no repo-rule or `REPO RULES.md` entry, and `.cursor/SYNC.md:114` already documents that the list *"has no generator... a new skill packet will not appear in it automatically"* — a documented gap that says nothing about the rule system's absence from it.

Consequence, stated precisely: in any runtime whose framework reach is the pointer block, Gate 5's trigger (`AGENTS.md:122`) is not carried by the mirror, and no check would notice if the root `AGENTS.md` also failed to load. Whether Codex/Cursor do load the root document natively is **not asserted anywhere in this repository** (only Pi and Devin are evidenced, above). The evidence is insufficient to claim a live break; it is sufficient to claim the reach is unverified for exactly the surfaces that matter.

### 3.3 Verified-clean side (so the broken list is meaningful)

AGENTS.md→repo-rules: 34 links on 25 lines, all resolving (recounted from the read: lines 21×3, 32, 50, 90, 114, 148×3, 161, 175×4, 203, 214, 234, 236, 249, 255, 324, 389, 397×2, 405, 407, 409, 419, 480, 489, 498×2, 500). Router parity 11/11/11. `/create:repo-rule` command resolves to the packet and its three assets exist (`.opencode/commands/create/assets/create-repo-rule-{presentation.txt,auto.yaml,confirm.yaml}`); `sk-doc/ROUTER.md` carries the repo-rule intent rows (`:120, :165, :248, :341`); `sk-doc/SKILL.md:34` lists the mode; `agents/orchestrate.md:847` and `agents/markdown.md:203` resolve (templates exist). `evidence-and-proof.md` §10 *CLOSE-OUT* exists (`:162`), backing `handoff-and-questions.md:52`. `system-spec-kit/SKILL.md:59` *Distributed Governance Rule* exists (AGENTS.md:440 pointer resolves); `sk-code/SKILL.md:50` *## 2. SMART ROUTING* exists (AGENTS.md:9 pointer resolves); `ci-skill-root-metadata.cjs` exists as AGENTS.md:112 claims.

### 3.4 NEW — broken link and omissions in the skills front door

`skills/README.txt:61` links `sk-design-md-generator/README.md`, a path that does not exist (the packet lives at `sk-design/sk-design-md-generator/`; `find` confirms no top-level tree). `sk-communication` and `sk-vision` exist as roots (`ls .opencode/skills`; fleet table `skill-root-metadata-contract.md:53-54`) with no catalog rows.

---

## Q4. Which parts of AGENTS.md can be cut, compressed, or relocated?

Applied the always-loaded test (`decision-tests.md:38-41`) per section, with receiving-surface load timing. Result: **one compression candidate, one set of ruled-out relocations, and one relocation constraint that should gate future cuts.**

### 4.1 Compression candidate: §2 Skill Routing Reference, metadata paragraph (`:112-114`)

`:112` states the advisor-metadata placement rules and already names its own full contract (*"Full contract... `skill-root-metadata-contract.md`"*); `:114`'s hub doctrine similarly defers to `parent-skills-nested-packets.md` and `skill-hub-routing.md`. The owner surface exists and is current: `skill-root-metadata-contract.md:40-41` carries the H/S class discriminator, `:49-54` the live fleet, `:29-32` the spec-schema collision warning; a fleet audit exists (`ci-skill-root-metadata.cjs`). Load timing for the owner: creating/editing a skill root is a write turn (Gate 5 fires) and the `.md` artifact trigger routes through `sk-doc`, whose stage-2 router resolves the skill-authoring mode. **What must NOT move:** the one-line warning that `graph-metadata.json`/`description.json` etc. are *"never the same file, never interchangeable"* with the spec-folder schema — that binds when a reader merely inspects a root's file list, i.e. read-only; and `:114`'s final sentence (*"Never report a mode as routed because a registry entry exists..."*), which binds on read-only reports — the exact reason `skill-hub-routing.md`'s trigger row (`REPO RULES.md:50`) cannot cover it, since Gate 5 never fires on a read-only turn. Recommendation: compress `:112-114` to the collision sentence + the two kept sentences + pointers; relocate the class table detail (already in the owners).

### 4.2 Tested and retained (with the deciding load-timing fact)

- **§5 Git Workspace Safety table (`:326-335`)** — the sk-git README duplicates the content (`sk-git/README.md:28, :54, :131, :147, :155`). Retained because the backstop case is real and documented: the advisor brief is **dormant in Cursor** (*"does not fire under the tested CLI build"*, `.cursor/SYNC.md:81`), and sk-git itself loads only through routing; the table's rows (e.g., ask-first `:328`, allowlist push `:333`) bind before any skill is loaded. Each row also ends by naming sk-git as mechanics owner, so no double ownership exists.
- **§5 MCP paragraphs (`:355-364`)** — `mcp-code-mode/SKILL.md:271, :278-286` owns the mechanics (the native-vs-Code-Mode distinction and `.utcp_config.json` location). Retained: calling a read-only MCP tool is a read-only turn, so `Registration is not availability` (`:363`) and `Enumerate at runtime` (`:361`) must stay where they always load; the three config paths (`:357`) are orientation, not mechanics.
- **§9 Runtime agent table (`:427-434`)** — a second copy of the mapping exists in `sk-create-agent/SKILL.md:153-155`, but the two serve different moments (authoring vs dispatch) and the cli-* skills point *back* at AGENTS.md for the mapping (`cli-*:§7` citations, above). Relocating would require editing nine dependent files and still lose the always-loaded dispatch case. Keep.
- **§10 Quick Reference (`:450-474`)** — iteration 2 is right that `commands/README.txt` is a complete index (`:140-153`, `:213-220`, including the `:with-phases` variant at `:217`; its group counts at `:44-51` match 36 commands). But the receiving surface **does not load when the content must bind**: the file is not auto-loaded by any runtime, and `.opencode/commands` is deliberately outside both retrieval lanes (`retrieval-conventions.md:281`). Relocation refused; the table's rows are already single-line pointers.
- **§7 Escalation, §2 CONSOLIDATED QUESTION PROTOCOL (`:131-132`), VIOLATION RECOVERY (`:134-136`), §4 Verification Standards table (`:240-247`), §8's two clauses (`:411`)** — all bind on read-only turns or when the trigger-loaded path may already be broken (the refusal reason recorded at `decision-tests.md:43-46` for Violation Recovery). Stay.
- **The two look-alike blocks** — confirmed single-copy and left untouched as instructed: `prevent-overengineering.md:100-102` (*"Its Restraint Signals table binds and is not repeated here"*) and `uncertainty-and-honesty.md:48` (points at the §2 table as *the* single scale).

### 4.3 Relocation constraint for any future cut

Because the mirror layer carries Gate 1 only and Gate 5 reach is unverified for Codex/Cursor (§3.2), moving content **out of AGENTS.md into skills** widens the reach gap: Claude (direct, `.claude/SYNC.md:38`), Pi (`:92` source-cited), and Devin (`:80` rules list) are evidenced; Codex/Cursor are pointer-only per the repo's own model. Any relocation should state which runtimes' reach it assumes, and none of the Q4 candidates above clears that bar today. Conversely, the *within*-AGENTS.md compressions carry no reach risk.

---

## RANKED RECOMMENDATIONS

*(One order across Q1–Q4. Items 1–4 are corrections, not new rules; where the four tests bear on them, it is because a decision-test requirement — an anchor, a count, a reachable reference — is currently violated.)*

1. **Fix the drifted AGENTS.md section citations across skills/agents/commands.** Evidence: §3.1's 20+ instances against headings `AGENTS.md:311/:337/:415/:423/:88/:387`; note the cli-* persona citation appears in `cli-external-orchestration/SKILL.md:171` too, and fixes must propagate to the `.claude` agent fork (pre-commit gate, `.claude/SYNC.md:47`) and regenerate `.codex`/`.pi`. Files: the 10 Section-6 files, the 8 §7 files, `agents/code.md` (+mirrors), `speckit-plan.yaml:647`. Decision tests: N/A as a rule; recorded per `decision-tests.md:136-138` — the failure is a misresolving anchor, which test 3 part 4 presupposes must work (`decision-tests.md:92`).

2. **Retire or refresh every hand-maintained corpus count in the rule-system documents.** Evidence: §2.2–2.3 (packet README `:89/:139/:140/:165`, playbook `standards-gate-rejection.md:78` + root `:34`, changelog `:29`, `retrieval-conventions.md:283`, `.devin/SYNC.md:38`, `skills/README.txt:3/:24/:31/:61`), plus iterations 1–2's reference-table deltas. Prefer deletion over a re-count where a self-measuring check exists (the playbook root's own precedent, `:32`; the router recipe, packet `README.md:178`). Files: the six named documents + `rule-anatomy.md`/`creation-standards.md` rows. Tests: repeated test 3 part 1 refusals (R5/R6, below) show this belongs in the owning documents, not the rule set.

3. **Make one surface own the advisor-fallback statement, then align dependents to it.** Evidence: `AGENTS.md:101` is the corrected statement; contradicting copies at `skills/README.txt:80/:95/:152` (contradicting its own `:69`), `install-guides/README.md:1032/:1036/:1121`, `sk-git/SKILL.md:587`, `cli-opencode/SKILL.md:357`; `AGENTS.md:61`'s `skill_advisor.py` Gate-Action name. Note the Python tool is still correct for `--emit-routing-projection` (`skill_advisor.py:4698`; `create-skill-parent-auto.yaml:240`), so the fix is role-scoping, not removal. Decision tests: refusal R9 — no rule; an existing fence (`AGENTS.md:101`) is the owner.

4. **Close the Gate 5 reach question in the mirror instrumentation.** Evidence: §3.2 — `doctor-speckit-retrieval.yaml:162,175` models Gate 1 reach only; the pointer carriers embed only Gate 1 (`.codex/AGENTS.md:124-132`, `.cursor/rules/skill-routing.md:20-28`); `.cursor/SYNC.md:114` documents the ungenerated list gap. Either add a `gate5_reach` signal alongside `gate1_reach`, or record per-runtime root-AGENTS inheritance as Pi and Devin already do. Decision tests: N/A — this is verification coverage for the mechanism the rule system depends on (test 1's premise).

5. **Compress AGENTS.md `:112-114`** to the schema-collision warning plus the report-correctness sentence plus pointers; relocate the class-table detail to its named owners (`skill-root-metadata-contract.md:40-54`, `parent-skills-nested-packets.md` §1–2). Evidence and load-timing analysis: §4.1. Decision tests: passes as a compression inside the always-loaded document; the kept sentences are those that must bind read-only (test 1's counter-case).

6. **Refresh the skills front door** — 13 roots, not 11; add `sk-communication` and `sk-vision` rows; fix the `sk-design-md-generator/README.md` link (`skills/README.txt:61`) to `sk-design/sk-design-md-generator/README.md`. Evidence: §2.3/§3.4; contract fleet `:53-54`. (Subset of item 2's class, distinct owner.)

7. **Record the Q1 refusals in the lineage** so the same candidates are not re-proposed (the convention is explicit: `decision-tests.md:136-138`, `agents-md-integration.md:107-108`).

---

## REFUSALS

Every proposal considered and declined this iteration, with the deciding test and where the content belongs (`decision-tests.md:128-134` table):

| # | Proposal | Test failed | Where the content belongs |
|---|----------|-------------|---------------------------|
| R1 | Runtime mirror-sync discipline (edit canonical → regenerate mirrors) | Test 3 part 4 — no `AGENTS.md` anchor exists, and adding one is an escalation (`SKILL.md:209-210`); restraint — drift is checkable (`/doctor runtime-mirrors`; `.codex/SYNC.md:110-115`) | The five `SYNC.md` manifests and their generators |
| R2 | Router count-parity rule | Test 3 part 1 — a single row, not a trigger-shaped cluster | A verification step inside `agents-md-integration.md:73-74` (already there) and the recipe in packet `README.md:178` |
| R3 | Runtime persona-resolution rule | Test 3 part 2 — `AGENTS.md:427-434` and the cli-* skills already own it; the defect is citations (§3.1) | Fix the citations; no new rule |
| R4 | MCP "registration ≠ availability" rule | Test 1 — binds on read-only tool use (`AGENTS.md:363`) | `AGENTS.md` §5, already present |
| R5 | Skills-catalog maintenance rule | Test 3 part 1 — one obligation, not a cluster | The catalogs themselves; drop hand-maintained counts (playbook `:32` precedent) |
| R6 | "Generated counts only" rule | Test 3 part 1 — same single-row failure | Per-document self-measuring checks (e.g., packet `README.md:178`) |
| R7 | Surface-repo verification rule (from `sk-code-obsidian/references/verification.md:42`) | Test 3 part 2 — the surface skill already carries it | `sk-code-obsidian` references |
| R8 | "Mirrors must carry the rule router" rule | Test 3 part 4 — no anchor; and test 2 pressure (mirror mechanics, not posture) | `sync-gate1-pointers.cjs` + the SYNC manifests (see recommendation 4) |
| R9 | One home for the advisor-fallback statement, as a rule | Test 3 part 1 — single row | `AGENTS.md:101` as owner; fix dependents (recommendation 3) |

Carried refusals from iterations 1–2 (not re-run): the ten adoption refusals and the test-1 refusals of any read-only-binding content remain recorded (`decision-tests.md:94-96`, `:32-33`). The two look-alike AGENTS.md blocks were confirmed as sole copies and were not proposed for removal (`prevent-overengineering.md:100-102`; `uncertainty-and-honesty.md:48`).
