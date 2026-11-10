### .skilled/skills/sk-doc/sk-create-repo-rule/README.md

- [P2] .skilled/skills/sk-doc/sk-create-repo-rule/README.md:97 | 7 | All four decision tests run together in one 78-word paragraph, so a reader refused by one cannot scan for it. | Replace line 97 with:

  ```markdown
  - **Test 1** asks what must bind on a turn where no trigger fires. Content that holds unconditionally cannot live behind a trigger, so it belongs in `AGENTS.md` instead.
  - **Test 2** checks the router's scope statement, which puts routing out of bounds: which skill, which command, which model, which flags.
  - **Test 3** runs four conditions covering single rows, content another rule already carries and proposals with nothing to load them.
  - **Test 4** asks what fails today without the rule.
  ```

- [P2] .skilled/skills/sk-doc/sk-create-repo-rule/README.md:99 | 7 | The ten fixed elements are packed into one 68-word sentence, so the inventory cannot be checked against a draft. | Replace line 99 with:

  ```markdown
  Survive all four and the anatomy reference and template load. You fill ten fixed elements:

  - six-key frontmatter in one order
  - a title line
  - a routed-from line
  - a line stating the rule expands `AGENTS.md` and never overrides it
  - the actions that fire it
  - one bold sentence carrying the obligation
  - a numbered body in capitals
  - one divider per numbered section
  - a closing self-check
  - a link back to the router
  ```

- [P2] .skilled/skills/sk-doc/sk-create-repo-rule/README.md:188 | 8 | RELATED DOCUMENTS lists every reference and asset but omits `ROUTER.md` and `references/README.md`, both navigation files this skill ships and both listed by the sibling sk-doc READMEs. | Insert after line 188:

  ```markdown
  | [`ROUTER.md`](./ROUTER.md) | Machine router: intent model, resource map and loading levels |
  | [`references/README.md`](./references/README.md) | The index over the four references, in the order the questions arrive |
  ```

### .skilled/skills/sk-doc/sk-create-repo-rule/ROUTER.md

- [P2] .skilled/skills/sk-doc/sk-create-repo-rule/ROUTER.md:23 | 7 | One 112-word paragraph carries both the trigger families and the two resource families with their contents, so the resource half cannot be scanned. | Replace line 23 with:

  ```markdown
  Requests reach this skill when they ask for a repo rule, a project rule, a `REPO RULES.md` row or `/create:repo-rule`, when a recurring failure needs a constraint that binds before an action, when an existing rule no longer matches how the work is done or nothing it prevents still happens, and when a repository needs a rule router because it has none.

  It routes to two resource families:

  - `references/`, which opens at `references/decision-tests.md` on every path and continues through the rule anatomy, the creation standards and the `AGENTS.md` wiring orderings.
  - `assets/`, the blank rule template and the router template a repository with no `REPO RULES.md` needs before any rule can load.
  ```

### .skilled/skills/sk-doc/sk-create-repo-rule/SKILL.md

- [P2] .skilled/skills/sk-doc/sk-create-repo-rule/SKILL.md:142 | 8 | REFERENCES names no file, so the four references and two assets are invisible from the skill body; the template's REFERENCES section requires the core references and templates/assets to be listed. | Append after line 145:

  ```markdown
  - [`references/decision-tests.md`](references/decision-tests.md) — the four tests deciding whether a rule may exist and where refused content goes.
  - [`references/rule-anatomy.md`](references/rule-anatomy.md) — the ten fixed elements, what varies and the length bands.
  - [`references/creation-standards.md`](references/creation-standards.md) — the five reader tests deciding whether a well-formed rule earns its load.
  - [`references/agents-md-integration.md`](references/agents-md-integration.md) — the three wiring points, the scope check and the create, revise and retire orderings.
  - [`assets/repo-rule-template.md`](assets/repo-rule-template.md) — the blank a new rule is filled from.
  - [`assets/repo-rules-router-template.md`](assets/repo-rules-router-template.md) — the router for a repository that has none.
  ```

### .skilled/skills/sk-doc/sk-create-repo-rule/assets/repo-rule-template.md

- clean

### .skilled/skills/sk-doc/sk-create-repo-rule/assets/repo-rules-router-template.md

- clean

### .skilled/skills/sk-doc/sk-create-repo-rule/references/README.md

- [P2] .skilled/skills/sk-doc/sk-create-repo-rule/references/README.md:20 | 4 | OVERVIEW opens with the load table, with no Purpose or When to Use prose before it; that is the opening shape the overview-orientation render check reports for this file type. | Insert after line 20:

  ```markdown
  This index exists so a reader never guesses which reference answers the question in hand.

  **When to Use**: at the start of a repo-rule task, to pick the file the current question belongs to.

  ```

### .skilled/skills/sk-doc/sk-create-repo-rule/references/agents-md-integration.md

- [P2] .skilled/skills/sk-doc/sk-create-repo-rule/references/agents-md-integration.md:27 | 4 | The overview states the purpose but never says when to open the file, and every sibling reference carries a When to Use block. | Replace lines 25-27 with:

  ```markdown
  The router's trigger table is the only thing that **loads** one; the pointer from the
  governed `AGENTS.md` section is the only thing that makes it **findable at the moment
  of need**.

  **When to Use**:

  - Wiring an accepted rule: the trigger row, the index row and the governed-section pointer.
  - Revising a rule, especially when the firing condition changed.
  - Retiring a rule, in the order that leaves nothing pointing at a deleted file.
  ```

- [P2] .skilled/skills/sk-doc/sk-create-repo-rule/references/agents-md-integration.md:39 | 7 | The governed-section pointer rule packs three cases, plus the count command, into one 82-word paragraph. | Replace lines 39-44 with:

  ```markdown
  **Required:** every shipped rule has its trigger row and its index row, and
  `check-repo-rules.cjs` fails the corpus when either is missing.

  - **A rule that expands an `AGENTS.md` section** gets a pointer there, and a rule
    governing two areas gets one in each. The governed-section pointer is the default, not
    a gate.
  - **A rule whose subject no `AGENTS.md` section states** is reached through its trigger
    row alone.

  Count the live pointers with `grep -c <rule-file> AGENTS.md` rather than trusting a number
  written here.
  ```

- [P2] .skilled/skills/sk-doc/sk-create-repo-rule/references/agents-md-integration.md:59 | 7 | One 81-word paragraph mixes the outcomes of the four historical widenings with the rule that governs the fifth. | Split after "refusing route selection." so the history ends one paragraph and the current rule starts the next:

  ```markdown
  All four were caught and the boundary was widened deliberately each time, the third
  being the narrow routing carve-out that admits verifying wiring you changed while still
  refusing route selection.

  **A fifth widening that admitted selection itself would dissolve the boundary the set
  exists to hold** — if the scope statement excludes a proposal, that is a refusal, not a
  paperwork problem. The mode does not widen §4 unilaterally; that is an operator decision,
  and each of the four was one.
  ```

- [P1] .skilled/skills/sk-doc/sk-create-repo-rule/references/agents-md-integration.md:70 | 5 | CREATE's ordered steps omit the router prerequisite that governs the whole path; it appears only in §8, so a reader following this order in a repository with no `REPO RULES.md` writes a rule that can never load. | Replace line 70 with:

  ```markdown
  Order matters, and it is chosen so an interruption is survivable. A repository with no
  `REPO RULES.md` gets its router emitted first, from `assets/repo-rules-router-template.md`
  (§8), because no router means no rule can load.
  ```

### .skilled/skills/sk-doc/sk-create-repo-rule/references/creation-standards.md

- [P2] .skilled/skills/sk-doc/sk-create-repo-rule/references/creation-standards.md:28 | 4 | The overview states what the five tests are but never says when to open the file; every sibling reference carries a When to Use block. | Replace lines 26-28 with:

  ```markdown
  These five tests are read out of what the shipped corpus already does. Every one passes
  across the corpus. Each is a question a reviewer answers by reading; none can be automated, and
  that limit is the reason they live here rather than in the structural floor.

  **When to Use**:

  - Before finishing a draft rule, once it is shaped like a rule.
  - Reviewing a rule that passes every structural check and still reads as filler.
  - Deciding whether a section, a trigger phrase, a binding sentence, a self-check item or a misreading guard earns its place.
  ```

- [P2] .skilled/skills/sk-doc/sk-create-repo-rule/references/creation-standards.md:156 | 5 | The skip gate that tells a reader this document does not decide whether a rule may exist, and that `decision-tests.md` runs first, sits in the last section after the five tests it governs. | Move lines 156-157 to the end of §1, after the When to Use block, dropping the leading `- ` so it reads:

  ```markdown
  **Not a gate on whether the rule may exist** — that is `decision-tests.md`, and it runs
  first. These standards assume the rule has already earned the right to be written.
  ```

### .skilled/skills/sk-doc/sk-create-repo-rule/references/decision-tests.md

- [P2] .skilled/skills/sk-doc/sk-create-repo-rule/references/decision-tests.md:23 | 4 | The overview is one provenance sentence: no Purpose and no When to Use, so a reader entering at §1 learns nothing about what the four tests decide or when to run them. | Replace lines 23-26 with:

  ```markdown
  ## 1. OVERVIEW

  ### Purpose

  An admitted proposal becomes a rule file; a refused one moves to the surface that should
  carry its content, or is recorded with its reason when no surface should.

  ### When to Use

  - Before drafting a rule, and before refusing a request for one.
  - When a proposal reads well but nobody can name what fails today without it.
  - When content needs a home and it is unclear whether a rule file is the right one.

  Each test is recovered from the phase record that established it, not restated from
  memory.
  ```

- [P2] .skilled/skills/sk-doc/sk-create-repo-rule/references/decision-tests.md:133 | 6 | The routing table lists the four-part test's part 2 before part 1, reversing the order §4 presents those two conditions in, so a reader walking the table meets "has a home" before "single row". | Move line 133 (`| Test 3 part 2, has a home | A new section inside the rule that already owns it |`) to after line 134.

- [P2] .skilled/skills/sk-doc/sk-create-repo-rule/references/decision-tests.md:141 | 5 | The decision that governs the recording step — where the refusal record lives — follows the instruction it governs, so a reader is told to record before being told where the record goes. | Move lines 141-143, with the blank line above them, to directly after line 135, so §6 reads: table → where the record lives → record every refusal.

### .skilled/skills/sk-doc/sk-create-repo-rule/references/rule-anatomy.md

- [P2] .skilled/skills/sk-doc/sk-create-repo-rule/references/rule-anatomy.md:21 | 7 | The corpus checker's eleven checks are packed into one comma run inside a paragraph, so the list cannot be scanned or counted one check at a time. | Replace lines 21-28 with:

  ```markdown
  Corpus figures are deliberately not restated here. To see the current ones, run
  `node .skilled/skills/sk-doc/sk-create-repo-rule/scripts/check-repo-rules.cjs` (the
  corpus checker) from the repository root. For the corpus as it stands, its eleven checks
  report:

  - count parity
  - link wiring
  - trigger-phrase uniqueness
  - the line ceiling
  - frontmatter keys
  - divider parity
  - rule-body links
  - fires-when sections
  - index summaries against each rule's description
  - fires-when coverage (every Fires-when bullet named in its router row)
  - card sync (every committed card under `cards/` equal to the card
    `build-rule-cards.cjs` renders from its rule)
  ```

- [P2] .skilled/skills/sk-doc/sk-create-repo-rule/references/rule-anatomy.md:32 | 4 | The first H2 compounds OVERVIEW with a topic, and the overview carries neither Purpose nor When to Use; the compound-overview render check misses this form because the colon leaves `OVERVIEW:` as the first word. The definition paragraph at line 34 is kept unchanged under a new H3. | Replace line 32 with:

  ```markdown
  ## 1. OVERVIEW

  ### Purpose

  A generated rule carries every fixed element, varies the rest with its subject, and lands
  inside a length band.

  ### When to Use

  - Writing a new rule from the template.
  - Reviewing a shipped rule for a missing MUST element.
  - Checking a draft's length before adding another section.

  ### What a Repo Rule Is
  ```

- [P2] .skilled/skills/sk-doc/sk-create-repo-rule/references/rule-anatomy.md:116 | 6 | The section is titled by where it fell in the research write-up ("a second finding") rather than by what it covers, and the file contains no first finding, so the title points at something the reader cannot locate. | `## 5. INTER-RULE CROSS-REFERENCES`

