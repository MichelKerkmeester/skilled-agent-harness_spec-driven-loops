{"timestamp":"2026-09-11T19:40:28.757Z","runtime":"claude","status":"fail_open","freshness":"unavailable","durationMs":206,"cacheHit":false,"errorCode":"NONZERO_EXIT","errorDetails":"CLI_EXIT_64"}
# Iteration 9 — Repo-Rule System: The Authority Chain, Measurement Debt, and One Always-Loaded Cut

Scope note: read-only run (the harness exposes no write tool). Every line number below was opened at current state this session: all 11 files under `repo-rules/`, `REPO RULES.md`, `AGENTS.md` (re-counted: **502 lines**, last line 502), the four `sk-create-repo-rule` references, both assets, packet `SKILL.md`/`references/README.md`, `check-markdown-links`-adjacent tooling, `check-rule-copies.js`, `parent-skills-nested-packets.md`, the sk-code universal reference pair, the five `cli-*` packet SKILLs, sk-git, install-guides, and the runtime manifests. Prior iterations' findings are not re-argued; where an earlier item was re-touched only to establish currency, that is said once.

Surfaces opened for the first time this iteration: **the sk-code universal reference pair** (`code-quality-standards.md`, `code-style-guide.md`) that the corpus's own doctrine defers to; the **five `cli-*` Gate-2 lines** plus sk-git's; the **root `CLAUDE.md`** content behind the sk-code pointer convention; the **corpus-wide divider and frontmatter invariants** re-audited across all 12 carrier files; and the **`/create:repo-rule` verify chain** one hop further out.

---

## Q1. Which new rules do the skills and other system surfaces actually justify?

**Verdict: zero new rules, and no parity edits** — trigger rows (11, `REPO RULES.md:40-50`), index rows (11, `:58-68`) and files (11, `ls repo-rules/`) stay equal. Three candidates were generated from newly opened surfaces and all three failed a named test.

**Surface survey — what each surface would need bound, and the outcome:**

| Surface | Binds today | What a rule would need bound | Outcome this run |
|---|---|---|---|
| Rule corpus + router | Load discipline (`REPO RULES.md:12-18`), precedence (`:22-32`), scope (`:77-109`) | Nothing new surfaced; the 11 files' doctrine re-read, all refs resolve | No candidate |
| `sk-create-repo-rule` packet + command | Refusal-first authoring, wiring, verify step | The packet's own measurement debt is a repair target (Q2), not a missing constraint | No candidate |
| **sk-code authority chain (new)** | `AGENTS.md:181` and `prevent-overengineering.md:68-75` both cite `code-quality-standards.md` §1 as the authoritative restraint rungs | Would need "the cited authority stays navigable" — fails test 1 (binds while reading) and test 3 part 2 (the doc owns its refs) | Refused; repair in Q3.1 |
| Runtime mirrors (`.codex`, `.cursor`, `.devin`, `.pi`) | Gate 1 pointer only (iteration 3, re-verified: no `REPO RULES`/`Gate 5` matches in `.codex` beyond two agent `.toml`s, none in `.cursor`/`.devin`, `.pi` only `agents/markdown.md:197`) | Gate-5 reach on mirror surfaces | No rule — sync-owned, and it must bind while reading (test 1) |
| CI (`.github`) | Nothing; grep for `repo-rules`/`REPO RULES`/`repo-rule` returns zero today | Corpus parity/link checks | Mechanical, test 3 part 2 |
| Skills catalog `.opencode/skills/README.txt` | :3/:24/:31 claim 11 identities and `sk-*` (5); disk holds 13 roots, `sk-*` = 7 (sk-code, sk-communication, sk-design, sk-doc, sk-git, sk-prompt, sk-vision — `ls`) | Count currency | No rule — test 4; delete or derive counts |
| Agent roster (`.opencode/agents` + mirrors) | `markdown.md:203`, `orchestrate.md:847` reference rule assets that exist | Nothing new | No candidate |
| Sibling repositories (federation) | Sibling routers only | Propagation mechanics | Recorded refusals (iterations 6–7) stand; decision still the operator's |
| `install-guides` | `.opencode/install-guides/README.md:1020` now matches the current advisor model; no repo-rule content | Nothing | No candidate |

**Candidates run through all four tests (decision-tests.md order):**

- **R9.1 — "Cross-reference currency discipline"** (a document that names another as authoritative keeps the pointer resolvable). **Refused: test 1.** It must bind while reading and quoting references, and a read-only turn never loads a rule file: *"A rule file loads on a trigger. Content that must bind when no trigger has fired cannot live in one"* (`decision-tests.md:32-33`); Gate 5 confirms the mechanism (`AGENTS.md:122`: "Read-only turns never fire it"). Reinforced by test 3 part 2 (`decision-tests.md:90`: "Another rule already carries it" — here, the owning documents and their link checks). Content belongs in the owning docs (RANKED 1).
- **R9.2 — "Corpus-metric freeze discipline"** (docs must not hand-maintain counts they cannot keep). **Refused: test 3 part 2 and test 4.** The authoring references already own their document standards, and the correct fix is deletion/replacement of the counts, not a behavioral rule; the packet playbook's own posture is *"does not hand-maintain counts"* (recorded in iteration 3).
- **R9.3 — "Version-and-premise currency discipline"**. **Refused: test 3 part 2.** `agents-md-integration.md` §4 owns the scheme and the bump step (`:89-94`); the observed false premises are repairs (`:92-94` still claims all rules sit at `1.0.0.0` while `delegation-and-orchestration.md:27` = `1.0.0.2` and `handoff-and-questions.md:25` = `1.1.0.0` — 9 of 11 nominal).

No candidate passed test 3; per `decision-tests.md:136-138`, each refusal is recorded with its test (REFUSALS below).

---

## Q2. Which existing rules need changing, and why?

### 2.1 No rule file requires a doctrine change — with new systematic checks passed

- **Frontmatter schema holds 11/11.** Every file carries the six keys in one order (`title`, `description`, `trigger_phrases`, `importance_tier`, `contextType`, `version`) — the invariant `rule-anatomy.md:51` describes; the "9/9" count is stale (known).
- **Divider discipline holds 12/12.** Dividers equal numbered sections in all 11 rules and the router: e.g. `root-cause-and-debugging.md` = 8 `^## N.` sections and 8 body dividers (`:49-151`); `evidence-and-proof.md` = 12/12; `REPO RULES.md` = 4/4. `rule-anatomy.md:58`'s invariant ("dividers equal numbered sections in all 10 files") is intact; only its count is stale.
- **Section-level cross-references all resolve** (a deeper check than iteration 3's section-citation sweep): `communication.md:56` → `uncertainty-and-honesty.md` §6 "TWO REGISTERS" (`:112`); `delegation-and-orchestration.md:152` → `evidence-and-proof.md` §7 (`:129`); `handoff-and-questions.md:105` → `presenting-decisions.md` §3 (`:85`), `:52-53` → `evidence-and-proof.md` §10 (`:162`); `scope-discipline.md:141-142` → `prevent-overengineering.md` §2 (`:87`), `:147` → `evidence-and-proof.md` §8 (`:138`); `skill-hub-routing.md:68` → `parent-skills-nested-packets.md` §7 (`:212`). No drift.
- **The two protected copies are intact** — `prevent-overengineering.md:102` ("Its Restraint Signals table binds and is not repeated here.") and `uncertainty-and-honesty.md:48-49` ("the scale is the Confidence Thresholds table in `AGENTS.md` §2 and there is exactly one of it; this file carries no second copy."). No duplication argument applies to either.

**Q2's honest answer: no rule file needs changing this iteration.** What needs changing are the authoring references that document them.

### 2.2 New instances of the measurement-defect class (one is a self-contradiction, not just staleness)

- **`rule-anatomy.md:77` contradicts its own table.** §2's observed range reads "`| Total lines | 145-224 | Follows section count |`" — but §3's table in the same file lists `skill-hub-routing.md` at 127 (`:98`) and `delegation-and-orchestration.md` at 248 (`:106`), and current reads give 127–250. A range that its own table falsifies needs no external evidence to be wrong.
- **`rule-anatomy.md:150-151`** — "All eight files failed to parse on first authoring for exactly this reason" — corpus count stale in a new location.
- **`rule-anatomy.md:58`** — "all 10 files" — new location for the count class (12 today).
- **`creation-standards.md:124`** — "The five rules without one" and **`:142-143`** — "three of eight sit comfortably under 160 lines" — both new locations; the guard count is itself stale (5 of 11 carry `WHAT THIS RULE IS NOT`: `prevent` §5, `communication` §8, `delegation` §8, `presenting` §6, `handoff` §6).
- Standing, not re-detailed: the `:94-108` table and `:108` summary, `:115`, `:122`, `:3`/`:17-19`/`:47`, `:155`, `agents-md-integration.md:92-94`, and the four-surface widening count.

Nothing in this class is a rule change; it is a document-repair sweep (RANKED 2).

---

## Q3. Where is cross-skill or cross-system integration missing or broken?

### 3.1 NEW (flagship): the authority chain the corpus depends on dead-ends in two of its own cross-references

The chain resolves at its first hop, which makes the break meaningful:

- `AGENTS.md:181` names the authoritative rungs: "Authoritative rungs: `sk-code/shared/references/universal/code-quality-standards.md` §1." The file exists, and §1 does carry the ladder ("### Design Restraint Ladder (pre-write)", `:42`, rungs 1–6 at `:46-51`). `prevent-overengineering.md:68-75` builds the corpus's two-axis doctrine on exactly this citation ("Two orderings, two axes, one authority: cite rung numbers from that file, and cite moves by name from this one").
- **Dead reference 1:** `code-quality-standards.md:53` — "For the over-engineering, gold-plating, and scope-creep detectors, see the repo `CLAUDE.md` 'ANTI-PATTERNS' table." No such table exists here. Root `CLAUDE.md` is content-identical to `AGENTS.md` (same per-line hashes at `:1-40`, both reading "# AI Assistant Framework (Universal Template)"), and a case-insensitive grep of `AGENTS.md` for `ANTI-PATTERNS` returns zero. The nearest owners are the Restraint Signals table (`AGENTS.md:212-226`) and `prevent-overengineering.md` §3–§4 (`:100-141`); the pointer names neither. Caveat: the reference is shared and may intend a consumer repo's `CLAUDE.md`, but in this repository — a consumer of sk-code — the named artifact does not exist.
- **Dead reference 2:** `code-quality-standards.md:81` — "See `code_style_guide.md` §4 …" — no file of that name exists. The real file is `code-style-guide.md` (hyphen), with §4 at `:98` and "### No ephemeral-artifact pointers" at `:124-140`; the same document's §9 already uses the correct name (`:168`). Every other live surface uses the hyphenated name and resolves (e.g. `sk-code-quality/assets/code-quality-checklist/overview-header-and-comments.md:72`, `sk-code-opencode/references/javascript/style-guide.md:322`, `.../universal-patterns/naming-and-commenting.md:235`).
- Consequence: the always-loaded document's named authority is itself navigable one hop in and broken at its own edges. This is repair work in the owning document (test 3 part 2), not a rule (R9.1 refused on test 1).

### 3.2 Extension: the Gate-2 naming class is wider than iteration 2 recorded

Iteration 2 found `sk-git/SKILL.md:587`, `cli-opencode/SKILL.md:357` and an install-guides line. Current state: **five** `cli-*` packets plus sk-git still say Gate 2 runs "via `skill_advisor.py`" — `sk-git/SKILL.md:587`, `cli-opencode/SKILL.md:357`, `cli-claude-code/SKILL.md:369`, `cli-codex/SKILL.md:370`, `cli-cursor/SKILL.md:403` — while the current model (stated at `AGENTS.md:101`: the CLI "is the advisor's single front door"; the Python scorer runs "when the daemon is unreachable") has already been adopted by `AGENTS.md:101` and `.opencode/install-guides/README.md:1020`. `AGENTS.md:61` still names `skill_advisor.py` as the Gate Action. State changes since iteration 2: the `:101` and install-guides surfaces were updated; the shorthand lines were not.

### 3.3 Fresh re-verification at current state (so the broken list is meaningful)

- Router parity 11/11/11 (`REPO RULES.md:40-50`, `:58-68`; `ls repo-rules/`).
- **CI still has zero rule-corpus reach** (re-grepped `.github` today: no matches), and the only canary type — `check-rule-copies.js:33-58` exact strings, `:65-70` Iron Law concepts — never reads `repo-rules/`.
- **No Gate-5 reach on any mirror**: no `REPO RULES`/`Gate 5` in `.codex` (only `.codex/agents/markdown.toml:193`, `orchestrate.toml:840`), none in `.cursor`, none in `.devin` (whose own manifest claims inheritance through CLAUDE/AGENTS, `.devin/SYNC.md:77-83`), `.pi` only `agents/markdown.md:197`.
- `parent-skills-nested-packets.md` §7 exists and is correctly cited by `skill-hub-routing.md:68`; its surfaces table `:222-234` and coverage honesty at `:236-240` are the current owners.
- The Python scorer path honors current `AGENTS.md:101`: `.opencode/skills/system-skill-advisor/runtime/scripts/skill_advisor.py` exists; `.opencode/bin/skill-advisor.cjs` exists.
- The Iron Law canary is satisfied by `AGENTS.md:13`, and the checker is file-wide, not line-pinned (`check-rule-copies.js:126-136`) — this matters for Q4.

### 3.4 Limitation

I cannot execute validators, CI, or the doctor in this run; the `.github` and mirror results are grep-state at current files, not run-state. Whether `code-quality-standards.md:53` was written for consumer repositories is not resolvable from this tree; the observation that it does not resolve **here** stands.

---

## Q4. Which parts of `AGENTS.md` can be cut, compressed, or relocated?

Re-count: **502 lines**. One new cut is proposed; six relocation/compression candidates were tested and refused, each on test 1.

### 4.1 Candidate — compress `AGENTS.md:192` (a duplicate of `AGENTS.md:28`)

- `:28`: "Law 4 blocks forward progress and completion while a check is failing. **A failing check may enter the bounded remediation loop in Section 3, but the hard stop remains until the authoritative gate passes.**"
- `:192`: "Law 4 keeps forward progress and completion blocked while a check fails; **diagnosis and repair are the permitted bounded remediation loop, not permission to proceed past the failure.**"

Both sentences carry the same claim: the stop persists; the loop is permitted. `:28` additionally points to §3, so the §3 reader's bridge survives deleting `:192`, and "remediation loop" remains at `:28` and `:260`. Checks: the canary cannot break (it inspects only lines containing "Iron Law"; `:13` satisfies both required concepts, `check-rule-copies.js:65-70`, `:126-136`); no load-timing risk because the identical content stays inside the same always-loaded document — the Gate 5 constraint never arises for an intra-document dedup. Edit is operator-escalated (`sk-create-repo-rule/SKILL.md:202`, `:209-210`).

### 4.2 Relocations tested and refused — test 1 in every case

- **§4 Verification Standards table (`:242-247`)** — refused; the document states its own test: *"These four bind unconditionally, including on a read-only turn where Gate 5 never fires and no rule file loads"* (`:240`). Owner: stays; expansion already in `evidence-and-proof.md`.
- **§2 Gate 4 tiebreakers (`:116-119`)** — refused; the executor-name case ("Use cli-opencode gpt-5.5 high") arrives mid-task, including on read-only runs, and the cli-* contracts plus deep-loop SKILL invariants are the mechanics homes. Owner: stays, as the always-loaded anti-override.
- **§2 CONSOLIDATED QUESTION PROTOCOL (`:131-132`)** — refused; it binds before the first tool on a multi-question request, so a read-only multi-question turn would never load a rule. Owner: stays (merged with Gate 3's ask in practice).
- **§5 Code Search Decision Tree and Terminal Command Discipline (`:337-353`)** — refused; both bind while searching and running commands. This very run is the evidence: a read-only research turn executing greps under those rows, with Gate 5 never firing (`:122`). Owner: stays.
- **§9 "route to specialized agents" (`:421`) + §10 Dispatch Rules CLI row (`:493`)** — refused; both bind before composing a dispatch, which can precede any file write (a read-only research dispatch writes nothing). The cli-* SKILLs own the mechanics; the rows are the always-loaded precondition. Owner: stays.
- **§6 closing paragraph (`:381`, "before creating a top-level packet, check it is not really a child of an existing one")** — refused; it binds at the packet-creation decision, which comes before the first write; the receiving surfaces (`folder-routing.md`, validators) load later, after the decision has been made. Owner: stays.
- **§10 fork row (`:500`)** — refused; binds while writing a reply, including replies on read-only turns; expanded by `presenting-decisions.md`. Owner: stays.

### 4.3 No other section failed the always-loaded test this iteration

---

## RANKED RECOMMENDATIONS

(order is this iteration's; inherited items are noted at the end, not re-ranked)

1. **Repair the two dead cross-references in `code-quality-standards.md` (`:53`, `:81`).** Evidence: Q3.1, with the resolution targets verified — `AGENTS.md:212-226` (Restraint Signals) and `prevent-overengineering.md:100-141` for the first; `code-style-guide.md:124-140` for the second. Files: the one document (plus a judgment on whether the ANTI-PATTERNS sentence should say "consumer repos bring their own table" if that is the intent). Tests: routed by test 3 part 2 — the owning doc owns its references; no rule question.
2. **Sweep the authoring references' measurements, starting with the self-contradiction.** Evidence: Q2.2 — `rule-anatomy.md:77` (contradiction with `:98`/`:106`), `:58`, `:150-151`; `creation-standards.md:124`, `:142-143`; plus the standing locations already recorded in the same sweep. Files: the two references. Tests: routed by test 3 part 2.
3. **Compress `AGENTS.md:192` (duplicate of `:28`).** Evidence: Q4.1 — both quoted; canary analysis (`check-rule-copies.js:65-70`); no load-timing risk (intra-document dedup). File: `AGENTS.md` only; operator-escalated per `sk-create-repo-rule/SKILL.md:209-210`.
4. **Align the Gate-2 shorthand to the current front-door model, or record that the shorthand is intended.** Evidence: Q3.2 — five `cli-*` lines plus `sk-git/SKILL.md:587` and `AGENTS.md:61` vs the current model at `AGENTS.md:101` and `.opencode/install-guides/README.md:1020`. Files: the six SKILL lines (and `AGENTS.md` if the operator agrees). Tests: documentation repair, test 3 part 2 — no rule.
5. **Inherited, still open (not re-argued):** iteration 8's router row-versus-fires verification extension (`create-repo-rule-auto.yaml:200-204` checks counts and links only), and iterations 6–7's federation propagation decision for the two local-only rules. The operator's pending choices there are unchanged.

## REFUSALS

- **R9.1 "Cross-reference currency discipline"** — failed **test 1** ("Content that must bind when no trigger has fired cannot live in one", `decision-tests.md:32-33`; Gate 5 read-only mechanism at `AGENTS.md:122`), reinforced by **test 3 part 2**. Content belongs in: the owning documents (RANKED 1) and whatever link-check scope the operator chooses.
- **R9.2 "Corpus-metric freeze discipline"** — failed **test 3 part 2** and **test 4** ("Nothing concrete → refuse" is inverted here: the fix is deletion of hand-maintained counts, not behavior). Content belongs in: the authoring references (RANKED 2).
- **R9.3 "Version-and-premise currency discipline"** — failed **test 3 part 2** (`agents-md-integration.md` §4 owns the scheme and bump step, `:89-94`). Content belongs in: the reference's premise sentence and the revise ordering.
- **R9.4 "Authority-pointer registry"** — failed **test 3 part 2**: each document owns its pointers; the failures are repairs. Belongs in: RANKED 1.
- **R9.5 "Comment-hygiene ownership"** — failed **test 3 part 2**: the content is owned by `AGENTS.md` §1 (`:44-46`), `code-style-guide.md` §4 (`:124-140`) and the three gates; the observed failure was one stale filename (RANKED 1).
- **Q4 refusals** — §4 verification table → **test 1** (document's own statement, `:240`); §2 Gate 4 → **test 1** (+ mechanics homes in cli-*/deep-loop); §2 Consolidated Question Protocol → **test 1**; §5 search/terminal rows → **test 1**; §9/§10 dispatch rows → **test 1** (dispatch can precede any write); §6 `:381` → **test 1** (decision precedes the write); §10 `:500` → **test 1**. Owners: all stay in `AGENTS.md`; expansions already exist where linked.
- **Not reopened:** the ten-candidate pre-refused class (`decision-tests.md:94-96`); the two protected copies (no duplication argument); iterations 3–8's candidate sets except where this run added instances or state changes, as marked.

Iteration status: **zero new rules**; Q2's change surface is the authoring references' measurements (one self-contradiction at `rule-anatomy.md:77`); Q3's headline is the dead reference pair inside the document `AGENTS.md:181` itself defers to, plus the wider Gate-2 naming instance set; Q4's single cut is `AGENTS.md:192` with seven relocation refusals on test 1. All cited lines were read this session; UNVERIFIED remain only the run-state of validators/CI and the intent behind `code-quality-standards.md:53`'s consumer-repo reading.
