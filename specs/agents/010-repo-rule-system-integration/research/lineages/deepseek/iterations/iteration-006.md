{"timestamp":"2026-09-11T19:09:43.489Z","runtime":"claude","status":"ok","freshness":"live","durationMs":1687,"cacheHit":false,"skillLabel":"sk-git"}
All verification complete. Assembling the iteration-6 report.

---

# Iteration 6 — Repo-Rule System: Cross-Federation Findings

Scope note: this run is read-only. Every citation below was opened and re-checked against the current tree (AGENTS.md measures 502 lines, not the brief's 501 — the brief's Gate 3 sentence at `AGENTS.md:122` and the two "protected copy" pointers at `repo-rules/prevent-overengineering.md:102` and `repo-rules/uncertainty-and-honesty.md:48` all re-verified correctly).

**The single most important new fact this iteration establishes, because it reframes earlier ones:** the rule system is federated across four repositories. `repo-rules/` in this repo holds **11** files; **nine** of them are the *shared* set, symlinked into the sibling repositories and edited here. The other two (`handoff-and-questions.md`, `presenting-decisions.md`) exist only in this repo. Evidence: `Mobile CLI/REPO RULES.md:100-101` states it verbatim — *"The shared rules are symlinked from the Public monorepo and are git-ignored here; edit them there. The local rules and this router are tracked in this repository."* — and `specs/sk-doc/043-repo-rules-router-audit/implementation-summary.md:238-240, 260-263` records *"all four repositories"* and *"The nine shared rule files are symlinked, so those repairs already reached all four."* The shared nine, derived by comparing three directory listings (Public `repo-rules/` 11 files; Mobile CLI 15; Obsidian Plugin 12; the common nine names are identical): blast-radius, communication, delegation-and-orchestration, evidence-and-proof, prevent-overengineering, root-cause-and-debugging, scope-discipline, skill-hub-routing, uncertainty-and-honesty. **Earlier iterations' central "stale nine" conclusions were single-repo-scoped and are partly superseded — see Q2.3.**

---

## Q1. Which new rules do the skills and other system surfaces actually justify?

**Surface survey** (what exists, what it binds today, what it would need bound):

| Surface | Binds today | Gap found this run |
|---|---|---|
| `AGENTS.md` (always-loaded) | Gates 1–5, Four Laws, excerpts; `AGENTS.md:11` describes the repo-local layer | The federation (shared vs local rule files) is not described on the hub side — Q3.1 |
| `REPO RULES.md` + 11 rule files (9 shared, 2 local) | The load discipline (`REPO RULES.md:12-18`), precedence (`:22-32`), scope (`:77-109`) | Scope statement and rules say nothing about propagation to symlinked siblings — Q3.1 |
| Sibling routers — Mobile CLI (15/15/15 rows/files), Obsidian Plugin (12/12/12) | Same load discipline plus a `**local**` marker the hub doesn't have (`Mobile CLI/REPO RULES.md:48-62`; `Obsidian Plugin/REPO RULES.md:45-56`) | Both carry stale communication rows and seven unresolvable references — Q3.2 |
| `sk-create-repo-rule` packet | Decision tests, anatomy, wiring, refuse-first flow | Zero federation awareness — Q3.5 |
| `/create:repo-rule` chain (`repo-rule.md`, both YAMLs) | Refusal-first workflow, scope check before wiring (`create-repo-rule-auto.yaml:188, 200-204`) | Verify step's link/count checks are single-repo only (`auto.yaml:199-204`) |
| Skills fleet / commands / hooks / CI / runtime mirrors / retrieval | Iterations 1–5 checked these; no new binding need surfaced this run | The CI gap is iteration 4's finding; 043 adds the decision record — Q3.6 |
| The federation edge (4 repos) | Nothing on the hub side; sibling routers carry the fact only | A rule is not the right home — see below |

**Candidates run through all four decision tests** (details of each refusal in REFUSALS):

- **C6.1 — Federation propagation discipline** (editing/creating a rule must account for symlinked siblings). Test 1: passes (action-triggered). Test 2: borderline posture/mechanics. **Test 3 part 2 fails: it has homes** — `blast-radius.md:105` already names *"Installed clients, SDKs, and other repositories that pin this interface"* as the consumer class, and `references/agents-md-integration.md:31-41` owns rule wiring. **Test 3 part 4 also fails: no `AGENTS.md` anchor exists** for it.
- **C6.2 — Corpus-count scope-noun standard** (docs that count the corpus must name which set). Fails **test 3 part 2**: the authoring references own their own document standards; this is a repair, not a constraint on behavior.
- **C6.3 — Cross-repository link verification discipline**. Fails **test 3 part 2**: the command's step-5 verify list (`create-repo-rule-auto.yaml:199-204`) and the link-check tooling own it; a rule would duplicate a checkable step.

**Verdict: zero new rules.** No additions or removals are proposed, so trigger rows, index rows and rule files all stay at 11 in `REPO RULES.md:40-50, 58-68` — no parity edits required. This is a refusal result, per the expected answer.

---

## Q2. Which existing rules need changing, and why?

**No new change is justified across the other nine rule files' doctrine** — each was re-read against the surfaces it governs; the defects below are content/integration repairs, not doctrine changes.

### 2.1 `communication.md` (shared) points at a file that only exists in this repo — observed, cross-repo failure
`repo-rules/communication.md:46-48`: *"The shape of a decision you hand over, the verdict-first ordering and the recommendation, moved to [`presenting-decisions.md`](presenting-decisions.md) when this file reached its length ceiling."* Because the file is symlinked into siblings whose `repo-rules/` directories do **not** contain `presenting-decisions.md` (verified: Mobile CLI listing; Obsidian Plugin listing), that relative link is broken in at least two repositories today. The same split produced sibling router rows still describing the pre-split composite — `Mobile CLI/REPO RULES.md:55` and `Obsidian Plugin/REPO RULES.md:52` still promise *"verdict-first order, Ask→Do framing"* from `communication.md`, which the file no longer carries; this repo's rows were updated (`REPO RULES.md:47, 65`). The revise discipline that should have caught it — *"If the change alters when the rule fires, change the trigger row in the same edit"* (`references/agents-md-integration.md:87-88`) — has no federation-aware form; it was satisfied in one router of four. **Change needed; the direction (propagate vs re-scope) is an operator decision** (see RANKED 1).

### 2.2 `prevent-overengineering.md:77-80` — spliced blockquote, observed rendering defect
Line 78 reads: *"by code that exists, and reading first is what reveals it. The sentence, written out, > "Extending `parseConfig` in place fails, because the CLI and the daemon call it with"* — the blockquote marker is embedded mid-paragraph, so the worked example renders as garbled prose instead of the quote the section needs. My grep for `, > ` across `repo-rules/` isolates this as the corpus's only instance. The same splice survives in both sibling routers (`Mobile CLI/REPO RULES.md:4`, `Obsidian Plugin/REPO RULES.md:4`: *"only here, > the paths, the commands..."*) — so it is a recurring edit artifact, not a one-off.

### 2.3 The count claims, re-scoped (supersedes parts of iterations 1, 3 and 5)
The "nine shipped rules" claims are **arithmetically true for the unnamed shared set** and false for the full local corpus (11 here, 12 and 15 in the two verifiable siblings). The real defect is the missing scope noun plus genuinely stale measurements, not the number nine:
- `rule-anatomy.md:94-106`'s length table lists exactly the shared nine — scope right, numbers stale (communication row says 244; the file reads 193 after the split; delegation row says 248, reads 250; every other row is off by one). Summary line `:108` *"Four preferred, two good, three at the limit"* is now **four preferred, three good, two at the limit** for the shared nine (read counts: skill-hub 128, uncertainty 145, blast 155, root-cause 160 preferred; prevent 163, scope 165, communication 193 good; evidence 210, delegation 250 at limit).
- Iteration 1 called `rule-anatomy.md:122` (*"10 cross-reference links in total, 7 distinct pairs, across 9 files, and only 3 files carry any"*) falsified. **Recount: it is exactly right for the shared nine.** In-set links total 14; subtracting the two local files' own links (handoff 2 at `:52, :105`; presenting 2 at `:45, :77`) leaves 10, sourced from communication (4: `:47, :56, :175, :176`), delegation (5: `:68, :97, :152, :204, :225`) and skill-hub-routing (1: `:93`) — 3 files, 7 distinct pairs. By contrast `creation-standards.md:138-139` (*"four sideways links across eight files"*) and `assets/repo-rule-template.md:129-131` (*"four inter-rule links across eight files"*) reproduce under no scope I can measure — the mutual contradiction iteration 1 flagged stands, now with a verified side.
- Phrase counts: `creation-standards.md:74` and `rule-anatomy.md:155` say 161; measured today **158 across the shared nine, 194 across all 11** (grep of `^  - "`); 043's record says 164/164. Stale number either way, but the collision constraint itself still holds (no exact duplicate surfaced).
- `rule-anatomy.md:3` (nine) vs `:17-19` (*"the eight files"*, *"8 of 8"*) vs `:47` (*"9/9"*) — internal inconsistency stands.
- `creation-standards.md:115` (*"Three of eight"* for `WHAT THIS RULE IS NOT`) — still three, "of nine" now (`prevent` §5, `communication` §8, `delegation` §8).
- `retrieval-conventions.md:283` (*"The nine rule documents"*) — same scope ambiguity; its own reasoning (repo-rules excluded from Gate 1 because they load at Gate 5, phrases serve only the collision check) is consistent with 043's record (`:203-206`).
- **Recorded reversals for the next reader:** the `rule-anatomy:94-106` "missing rows" complaint (handoff/presenting absent) is correct-by-scope for the shared set, and the `:122` falsification is superseded.

### 2.4 The widening count is maintained in four places and agrees in none
`assets/repo-rules-template.md:103` (*"The shipped router hit this twice and both times the boundary had to move"*) is a count nowhere else stated; `references/agents-md-integration.md:49-60` describes two misses then says *"All three were caught"*; `references/decision-tests.md:72-76` says *"widened exactly three times"* and pre-refuses "a fourth widening"; `REPO RULES.md:91, 98-109` enumerates a third *and* a fourth. The numbers render as 2 / 2→3 / 3 / 4 across four surfaces with no source of truth. Iteration 1 found the 3-vs-4 split; the template's "twice" and agents-md's internal double-count are new locations.

### 2.5 Everything else verified clean this run
The other nine rule files' links, fires lists, and self-checks resolve; `communication.md:115`'s `hvr-rules.md` target exists here and in Mobile (`.opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md`); `skill-hub-routing.md:88`'s `parent-skill-check.cjs` exists; `handoff-and-questions.md:128`'s `.pi/PLUGINS.md` citation stands (iteration 2), and this run additionally confirmed `AskUserQuestion` (`:127`, "Named in this repository") appears in committed spec docs.

---

## Q3. Where is cross-skill or cross-system integration missing or broken?

### 3.1 The federation is documented only at the leaves, never where rules are edited
`AGENTS.md:11` presents rule files as per-repository (*"anything belonging to ONE repository lives beside it in that repository's root `REPO RULES.md`"*). The only statements of the shared/symlinked mechanism are in the sibling routers (`Mobile CLI/REPO RULES.md:100-101`; `Obsidian Plugin/REPO RULES.md:93-94`) and the 043 audit record (`:238-240, 260-263`). In this repo, `blast-radius.md:105` names *"other repositories that pin this interface"* generically but never says the rule corpus is such an interface. Consequence: the blast radius of editing a rule here is mis-stated by every hub-side surface. Fix location by load timing: the fact must bind when a rule is authored/edited — the sk-create-repo-rule references load then (`SKILL.md:63-67`), whereas an `AGENTS.md` edit beyond a pointer is an operator escalation (`SKILL.md:202, 209-210`).

### 3.2 Seven unresolvable references per sibling, verified in two repositories (new)
`AGENTS.md` is the shared universal document — Mobile CLI's and Obsidian Plugin's copies carry the identical pointer lines (`:148`, `:175`, `:407`, `:409`, `:498`, `:500`, grep-verified in both). Each names `repo-rules/presenting-decisions.md` or `repo-rules/handoff-and-questions.md`, and neither file exists in either sibling's `repo-rules/`. Add `communication.md:47`, and **each sibling carries 7 broken repo-rule references today** — which falsifies the "zero broken links" invariant 043 recorded federation-wide (`:235`); chronology of when the pointers landed is UNKNOWN (INFERRED: the two rules were added here after the last sibling sync).

### 3.3 The 043 generalisation stopped one surface short (extends iteration 4)
043's record (`implementation-summary.md:176-180`): *"`AGENTS.md` Gate 5 said 'LOAD the one rule file it names' and 'Two triggers fire, load both.' The measured mean is 3.2. Both `AGENTS.md` and the router now say that three or four firing at once is the normal case."* Current state: `AGENTS.md:125` fixed; but `AGENTS.md:304` still asks *"LOADED the rule file it names?"* (singular) and `:455` still says *"load the one `repo-rules/*.md` it names"* (iteration 4 found this one; `:304` is new). The router's own header retains the same singular at `REPO RULES.md:4-5` (*"routes you to the one rule file"*) — line-wrapped, which is why a flat grep misses it — and the router template repeats it (`assets/repo-rules-router-template.md:39-40`). `REPO RULES.md:15-16` ("Every trigger that fires is loaded") and `AGENTS.md:125` contradict all four remaining instances.

### 3.4 The splice damage class (new)
`repo-rules/prevent-overengineering.md:78`, `Mobile CLI/REPO RULES.md:4`, `Obsidian Plugin/REPO RULES.md:4` — all carry `, > ` mid-line. The 043 record shows the em-dash sweep repaired 35 collateral cases (`implementation-summary.md:140-172`); these four survived it (one in-repo, three sibling-side, one of a different generation than the repaired set).

### 3.5 The authoring packet has no federation concept (new)
Grep of `.opencode/skills/sk-doc/sk-create-repo-rule/` for `symlink|sibling|federation|Public monorepo|other repositor`: zero relevant hits ("sibling" appears only about sibling sk-doc modes, `SKILL.md:44`). The create/revise/retire orderings (`agents-md-integration.md:64-116`) and the command YAMLs are single-repo by construction. This is the mechanism by which 3.2 arose: creating a rule in Public produces a file the shared documents may then point at, with nothing that updates the three routers or links.

### 3.6 Enforcement: the recorded decision not to build a checker has been overtaken
043: *"No automated checker was wired. The invariants remain enforced by hand"* (`:265`), and the proposed-not-built checker rationale was *"Every invariant currently holds in all four repositories, so nothing fails today for want of a script"* (`:216-219`). Today, two of the three verifiable repositories fail the recorded link invariant (3.2). Iteration 4 established no CI or local hook reads `repo-rules/` at all; this run adds the upstream decision record and a demonstrated drift since. Additionally, 043 records an unfixed blocking validator error on the router template (`missing_required_section: overview`, `:242-245, 264`) — current status UNVERIFIED (a read-only run cannot execute `validate_document.py`).

### 3.7 Verified-clean additions (so the broken list is meaningful)
Per-repo router parity holds exactly where claimed: Public 11/11/11, Mobile CLI 15/15/15, Obsidian Plugin 12/12/12. Both sibling routers carry the repaired precedence cell (*"Not applicable, it is the instruction"*) and the generalised load rule — so 043's "three sibling repositories still carry the identical defect" limitation (`:260-262`) has since been remediated for its two verifiable members, which shows the federation *can* be synced when a sync operation runs. `hvr-rules.md` resolves in Mobile's tree. `parent-skill-check.cjs` exists.

### 3.8 Limitation
`Visual Builder`, the fourth repository named in 043 (`:260-261`), was not locatable: a `**/REPO RULES.md` search under `/Users/michelkerkmeester/MEGA` returns exactly three routers. Its state is UNVERIFIED.

---

## Q4. Which parts of AGENTS.md can be cut, compressed, or relocated?

This iteration found **no section that fails the always-loaded test**, and proposes no cut. Three serious relocation candidates were tested and refused, each on the deciding test:

- **§4 "Invoking validate.sh" warning (`AGENTS.md:276-282`)** → refused, **test 1**: a completion claim can arise on a read-only turn, where Gate 5 never fires and no rule file loads; `AGENTS.md:240` already declares this class unconditional (*"These four bind unconditionally, including on a read-only turn"*), and the paragraph feeds the Completion Verification block immediately below it.
- **§2 advisor-metadata paragraphs (`AGENTS.md:112, 114`)** → refused, **test 1**: the filename-collision guard (*"graph-metadata.json ... also name spec-folder continuity metadata ... never interchangeable"*) binds while reading and interpreting files; its detail owners (`skill-root-metadata-contract.md`, `parent-skills-nested-packets.md`) load only when skill work triggers.
- **§10 "Order that matters" column (`AGENTS.md:448-474`)** → refused, **test 1**: the ordering binds before a command is chosen or invoked — i.e., before the command's own documentation (or `.opencode/commands/README.txt`) loads. The column is load-timing-critical, not summarizing.

Two adjacent notes: the Iron Law line (`AGENTS.md:13`) is not cuttable for a mechanical reason — the CI canary pins its concepts in `CLAUDE.md`/`AGENTS.md` (`check-rule-copies.js`, recorded in iteration 4); and the counter-pressure is real — the federation evidence (3.1) implies `AGENTS.md:7-13` or the authoring reference must carry one more fact, not fewer. Compression without relocation exists only in the defect list already reported: `:304`, `:455` (Q3.3).

---

## RANKED RECOMMENDATIONS

1. **Decide and execute the federation propagation for `handoff-and-questions.md` and `presenting-decisions.md`, or re-scope the shared pointers.** Either propagate the two files plus rows to the three siblings, or change the shared surfaces that point at them. Evidence: 7 broken references per sibling (Q3.2); `communication.md:47`; sibling routers' stale rows. Files: `AGENTS.md:148/:175/:407/:409/:498/:500`, `repo-rules/communication.md:47`, three sibling routers. Tests: not a rule (no rule passes/fails this); the policy call follows the `REPO RULES.md:98-109` pattern of an operator-recorded decision. If propagation is chosen, the "nine" vocabulary in every counted surface (Q2.3) must be re-derived in the same change.
2. **Extend `references/agents-md-integration.md` (and the create path's loaded set) with the federation mechanic; name the set in every count.** Evidence: Q3.1, Q3.5, Q2.3–2.4. Files: the reference, `rule-anatomy.md:3/:17-19/:47/:94-108/:122`, `creation-standards.md:3/:26-27/:74/:115/:138-139`, `assets/repo-rule-template.md:86-87/:104/:129-131` (wait — `:129-131`), packet `README.md:89/:139/:140/:165`, `retrieval-conventions.md:283`, `assets/repo-rules-router-template.md:103`. Tests: routed here by **test 3 part 2** — the owning documents exist; no rule warranted. Load timing: these references load during rule authoring (`SKILL.md:63-67`).
3. **Finish the 043 generalisation: `AGENTS.md:304` and `:455`; align `REPO RULES.md:4-5` and `assets/repo-rules-router-template.md:39-40`.** Evidence: 043 record `:176-180`; contradiction with `AGENTS.md:125` and `REPO RULES.md:15-16`. Files as listed. Tests: an `AGENTS.md` edit beyond a pointer escalates (**operator decision**, `SKILL.md:209-210`); the router/template edits are within the authoring mode's ownership.
4. **Repair the spliced paragraph at `repo-rules/prevent-overengineering.md:77-80`.** Evidence: Q2.2; sibling instances `Mobile CLI/REPO RULES.md:4`, `Obsidian Plugin/REPO RULES.md:4` for the class. Test: a content repair inside the owning file; no rule question.
5. **Adopt cross-repo link/count checking (CI or doctor), using the checker 043 proposed but did not build.** Evidence: 043 `:216-219`, `:235`, `:265` plus the drift demonstrated in Q3.2; iteration 4's finding that no CI/hook currently reads `repo-rules/`. Files: `.github/` or doctor scripts; reference implementation recorded at `specs/sk-doc/043-repo-rules-router-audit/scratch/invariant-check.cjs`. Test: the 043 restraint argument ("nothing fails today") is now falsified by observed failures.

## REFUSALS

- **C6.1 — "Federation propagation discipline" as a repo rule.** Failed **test 3 part 2** (homes exist: `blast-radius.md:105` already names other repositories as consumers; `agents-md-integration.md` owns wiring) and **test 3 part 4** (no `AGENTS.md` anchor; adding one escalates per `SKILL.md:209-210`). Content belongs in: `agents-md-integration.md` §3–§5 and the sibling routers, per the Q1 verdict.
- **C6.2 — "Corpus-count scope-noun standard" as a rule.** Failed **test 3 part 2** — it is a documentation convention owned by the authoring references themselves (decision-tests §5 routes test-3-part-2 refusals to "a section inside the rule that already owns it"; here, a correction inside the references and templates).
- **C6.3 — "Cross-repository link-verification" as a rule.** Failed **test 3 part 2**: the command's verify step (`create-repo-rule-auto.yaml:199-204`) and the link tooling own it. Content belongs in the verify step and the checker of RANKED 5.
- **Q4 relocation A — move the `validate.sh` warning to the validation reference.** Failed **test 1** (must bind when no trigger fires; the receiving reference does not load then). Stays in `AGENTS.md`.
- **Q4 relocation B — demote the advisor-metadata paragraphs (`AGENTS.md:112, 114`) to pointers.** Failed **test 1** (the filename-collision guard binds while reading; owners load only on skill work). Stays.
- **Q4 relocation C — move the "Order that matters" column to the commands README.** Failed **test 1** (binds before the command docs load). Stays.
- **Not re-proposed, earlier refusals stand:** the ten-candidate class (`decision-tests.md:94-96`), and iterations 3–5's R1–R5, tier-3, and row-vs-fires items — none is reopened here except where this iteration adds a new location or falsifying evidence, as marked.

Close-out: this run executed reads and greps only; nothing was written, edited, staged or committed; no file outside the lineage directory was touched. Every line number above was read this session. UNVERIFIED remain: the Visual Builder repository's state (not on disk under `/Users/michelkerkmeester/MEGA`), and the current validator status of the router template (cannot execute checks in a read-only run). The operator's next action is a decision, not a command: choose propagation vs re-scoping for RANKED 1, since it determines whether RANKED 2's count vocabulary moves to eleven or stays nine.
