# Iteration 001 — Gate 5 path, rule corpus map, and prior work

- Status: complete
- newInfoRatio: 0.9 (first pass; nearly everything on this surface is new to this lineage)
- Focus: What the current Gate 5 path does and does not reach; the shape of the rule corpus; what specs/hooks/022-smart-rule-injection and specs/agents/010-repo-rule-system-integration already settled.

---

## 1. FINDINGS

### F1 — Gate 5 fires on the first write of a session only
`AGENTS.md:93-94`: "Trigger: the FIRST write of the session, in any repository whose root holds a `REPO RULES.md`. Read-only turns never fire it, and a repository without that file has nothing to load." The gate's output line is `REPO RULES: [rule files loaded]` / `no trigger matched` / `none in this repository` (`AGENTS.md:100`). Loading is a Read and queues behind Gate 3 (`AGENTS.md:98`).

### F2 — The router matches on action, never prompt topic
`REPO RULES.md:12`: "Match on the action you are about to take, not the topic of the request." Same rule in the gate text (`AGENTS.md:96`). `REPO RULES.md:18`: "Nothing fires → `AGENTS.md` alone governs. Do not hunt for a rule to apply." A fire with no row phrase is a silent non-load, not a near miss (010 synthesis, ranked item 2: `specs/agents/010-repo-rule-system-integration/research/synthesis.md:53`).

### F3 — Corpus shape: 13 rule files, 8 `trigger_phrases` each, disposition vocabulary
`.skilled/repo-rules/` holds 13 regular files (directory listing, verified). Each carries `title`/`description`/`trigger_phrases` frontmatter with 8 phrases, e.g. `prevent-overengineering.md` carries "future proof", "might need it later", "flexible", "best practice" (`.skilled/repo-rules/prevent-overengineering.md:4-12`); `scope-discipline.md` carries "frozen scope", "scope drift", "while I was in there" (`.skilled/repo-rules/scope-discipline.md:4-12`); `blast-radius.md` carries "reversibility ladder", "stop for a yes", "force push" (`.skilled/repo-rules/blast-radius.md:4-12`). These phrases name dispositions and anti-patterns, not tool names or actions. The phrase vocabulary is also the input to `sk-create-repo-rule`'s collision check, not a retrieval surface (`retrieval-conventions.md:284`).

### F4 — A second static load path already exists where Gate 5 cannot reach
`AGENTS.md:261`: the five reply-time rules are named in the always-loaded document — "These five fire on a reply rather than on a write, so Gate 5 never reaches them." So the current design already patches the Gate-5 blind spot by putting a static pointer in the always-loaded doc for a whole class of turns (replies). This is precedent for the shape of any admitted new surface: a pointer, not the rule text.

### F5 — The trigger index deliberately excludes `.skilled/repo-rules`
`retrieval-conventions.md:284`: "Decided against. The rule documents carry the same frontmatter as spec docs, but they are loaded at Gate 5 through the trigger table in `REPO RULES.md`, not retrieved at Gate 1; indexing them would surface a rule as a context candidate. Their `trigger_phrases` still serve `sk-create-repo-rule`'s own collision check." The same table shows the ripgrep lane reaches them under `.skilled` (`:284`, "No as a root; reached under `.skilled`"). Candidate (b) therefore reverses a documented decision, and the decision's stated reason is exactly the concern in the research brief: rules surfacing as context the model did not need.

### F6 — 022's admission bar refuses disposition restatement
`specs/hooks/022-smart-rule-injection/001-deep-research/implementation-summary.md:51`: "A prompt-time injection earns its slot by naming a specific prohibition a gate enforces, not by restating a disposition the always-loaded document already carries." Eighteen prompt-vocabulary candidates were refused under it (`decisions.md:21-24`); the hygiene directive survives because it names a prohibition a pre-commit gate enforces (`injection-contract.md:54`).

### F7 — 022's measurement lesson: frequency is read from logs, never reasoned about
`decisions.md:33-36`: the strongest prior candidate "died on measurement" — an existing gate advisory fires roughly eight times a minute at peak. "An event's frequency must be read from the log, never reasoned about." Any cost claim in this packet about a per-turn or per-tool-call surface must name the log or the code that fixes its rate.

### F8 — The advisor brief is a per-turn, deduped injection with one surviving directive
`injection-contract.md:52-54`: the brief injects `Advisor: ...` plus one fixed directive — the comment-hygiene HARD BLOCK. `injection-contract.md:64`: trigger is every user prompt; the constant directive is delivered in full on the first proven message and after lifecycle boundaries, route-only otherwise, gated by `directive-lifecycle.ts` (`:64-65`); `renderAdvisorBrief` + `HYGIENE_DIRECTIVE` in `runtime/lib/render.ts` own the text (`:65`). The governor and proof-over-appearance directives were retired for restating dispositions (`:54`).

### F9 — Federation today: three-layer symlink structure, one live propagation gap
- `Public/.skilled/repo-rules/` — canonical corpus, 13 regular files (listing).
- `Public/repo-rules/` — compatibility layer: 13 symlinks → `../.skilled/repo-rules/*.md` (listing).
- `Obsidian Plugin/repo-rules/` — 12 of 13 as symlinks → `Public/repo-rules/*.md`; `answer-the-actual-request.md` is absent; plus 3 local rules (`screenshot-currency.md`, `spec-tree-layout.md`, `verification-gates.md`) (listing).
- `Obsidian Plugin/AGENTS.md` and `CLAUDE.md` are symlinks → `Public/AGENTS.md`; `.skilled` → `Public/.skilled` (listing).
- "Mobile CLI", named in 010's federation finding (`010 research/synthesis.md:13,31`), no longer exists at `MEGA/Development` (search returned no directory). 010's federation counts are therefore historical; the structural claim (rules shared by symlink into siblings, router text shared via symlinked AGENTS.md) still holds.

### F10 — 010's governing constraint and its status
`010 research/synthesis.md:15`: "Gate 5 fires on the first write and never on a read-only turn, so any content that must bind while reading cannot live in a rule file." Same paragraph: across ~40 candidates the answer was zero new rules. This is prior work this packet must respect or overturn with evidence: the constraint binds here too, and no candidate in this packet proposes new rule content — all four are surfacing mechanics for the existing corpus.

---

## 2. WHAT WAS TRIED

- Read `REPO RULES.md` end to end (114 lines) for the trigger table, usage rules, and §4 scope.
- Read the frontmatter of all 13 rule files for `trigger_phrases` shape.
- Read `AGENTS.md` Gate 5 block (`:93-101`), §8 communication load line (`:261`), and the completion checklist mention (`:193`).
- Read 022 `decisions.md` and `001-deep-research/implementation-summary.md`.
- Read `.skilled/hooks/injection-contract.md` §2 (prompt-time injections) and the advisor brief entry.
- Read `retrieval-conventions.md` §9 coverage/exclusion table.
- Read `010 research/synthesis.md` (verdict, ranked items 1-2).
- Verified the symlink structure of `Public/repo-rules/`, `Obsidian Plugin/repo-rules/`, and the Obsidian root with `ls -la`.

## 3. WHAT FAILED / RULED OUT SO FAR

- **Reusing 010's federation counts.** `Mobile CLI` no longer exists and the corpus has grown from 11 to 13 files; 010's arithmetic (15/12 entries, nine-file shared block) no longer matches disk. Ruled out as current fact; kept only as structural evidence.
- **Treating `trigger_phrases` as action matchers.** The phrases are disposition vocabulary ("future proof", "frozen scope"); the router matches actions ("Add a file, module...", "Delete, overwrite, migrate..."). Any surface that keys on these phrases matches prompt topic, not the action about to be taken — the exact mismatch Gate 5 avoids by design.

## 4. NEXT FOCUS

Candidate (a): the advisor brief pointer. Read `render.ts` and `directive-lifecycle.ts` to fix what a pointer would emit, its silence condition, its per-turn cost, and whether the brief's lifecycle dedup would make the pointer first-turn-only or per-turn.
