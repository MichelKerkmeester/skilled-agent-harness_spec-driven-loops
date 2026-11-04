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
