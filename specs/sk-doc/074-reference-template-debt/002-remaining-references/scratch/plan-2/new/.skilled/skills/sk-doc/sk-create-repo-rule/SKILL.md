---
name: sk-create-repo-rule
description: Author, revise or retire a repo rule from a user's request, with the decision tests that refuse most of them.
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob]
version: 1.1.6.0
---

<!-- Keywords: create-repo-rule, /create:repo-rule, repo rule, REPO RULES.md, repo-rules, rule file, trigger table, rule router, operating discipline, always-loaded versus triggered -->

# create-repo-rule

`create-repo-rule` is the repo-rule authoring workflow packet of the `sk-doc` family. It
turns a user's request — a behaviour they want, or a failure they keep hitting — into a
file in the target repository's rules directory (`.skilled/repo-rules/` where a `.skilled`
source root exists, `repo-rules/` otherwise), wired into its `REPO RULES.md` router.

**Most requests should not become a rule.** The four decision tests in
`references/decision-tests.md` refuse more than they admit, and running them first is the
cheap order. Authoring a rule that then fails a test is the expensive one.

A repo rule **supplements the harness**. It sits below `AGENTS.md` and below a live
operator instruction, it can be changed when it stops matching the work, and it can be
removed when it stops earning its load. This mode owns all three.

---

## 1. WHEN TO USE

### Activation Triggers

- Someone asks for a repo rule, a project rule, or a convention that should bind before an action.
- Someone describes a recurring failure and asks how to stop it happening again.
- An existing rule needs changing because it no longer matches how the work is done.
- A rule needs retiring because nothing it prevents still happens.
- A repository needs a rule router because it has none.

Keyword triggers: `create repo rule`, `/create:repo-rule`, `repo rule`, `project rule`, `REPO RULES.md`, `repo-rules`, `add a rule`, `retire a rule`, `revise a rule`, `trigger table`, `rule router`.

### When NOT to Use

- **It teaches how to do something.** A skill is capability, a rule is constraint. Route to the skill-authoring mode.
- **It must bind on every turn.** Content that holds when no trigger fires belongs in the always-loaded document, not behind a trigger. This is decision test 1 and the most common refusal.
- **It is routing.** Which skill, which command, which agent, which flags. The always-loaded document and the skills it routes to own that.
- **It is one line, not a cluster.** A single row is a section inside an existing rule.
- **A sibling mode already produces it.** README, changelog, command, catalog, playbook and diagram all have owners.

---

## 2. SMART ROUTING

`sk-doc` routes repo-rule authoring here: the request names a repo rule, a project rule, `REPO RULES.md` or `/create:repo-rule`.
The hub's mode signal selects this packet.
Four operations route here: create, revise, retire and router.
The operation decides which resources load, and the decision tests decide whether anything should be authored at all.

`references/decision-tests.md` loads first on every path, including retire, because whether a rule should exist and whether it should still exist are the same four questions.
`references/README.md` routes the rest.

Read [`ROUTER.md`](./ROUTER.md) before selecting skill-local resources; open only the matched files.

---

## 3. HOW IT WORKS

### Create

1. **Run the four decision tests.** Always-loaded, scope boundary, four-part refusal, restraint.
2. **On refusal**, name the test that failed and where the content goes instead — the tests' section 6 maps every refusal to a destination. Stop here. This is the common outcome.
3. **Check the destination exists.** No `REPO RULES.md` in the target repository means no rule can load; emit the router from `assets/repo-rules-router-template.md` first.
4. **Fill `assets/repo-rule-template.md`.** Ten fixed elements, open numbered body, aim under 160 lines.
5. **Run `references/creation-standards.md` against the draft.** Structure is checkable and is not the bar; a rule can pass every assertion and be worth nobody's context.
6. **Wire it**: a trigger row and an index row in the router, and a pointer from the `AGENTS.md` section it governs.
7. **Verify by running the checker**, not by eye: `node .skilled/skills/sk-doc/sk-create-repo-rule/scripts/check-repo-rules.cjs`.
   It exits non-zero on any failure, and it asserts:
   - count parity across the rule files and both router tables.
   - row coverage with link resolution.
   - trigger-phrase uniqueness, the line ceiling, frontmatter keys, divider parity and rule links.
   - fires-when sections.
   - that every index summary matches its rule's own description.
   - that every Fires-when bullet has a counterpart in its router row.
   - that every committed rule card still matches the card its rule renders.

   A hand check of the same properties is how every one of them drifted before the checker existed. What it cannot judge is whether the rule is worth loading at all, which is `references/creation-standards.md` and still needs a reader.

### Revise

Run the decision tests again first — a rule that no longer passes them should be retired,
not patched. Then edit, and if the change alters *when* the rule fires, change the trigger
row in the same edit or the router lies silently. Bump `version`. Full ordering and the
`version` convention: `references/agents-md-integration.md` §5.

To learn whether a revision changed behaviour, measure instead of guessing:
`python3 .skilled/skills/sk-doc/sk-create-repo-rule/scripts/measure-rule-compliance.py`.
It reads local Claude Code and Codex transcripts and reports, per runtime, delivery
receipts by channel and compaction window, the Gate 5 and reply-rule miss rates, and each
reply prohibition split by the rule's git blob version, every rate with its denominator and
a Wilson 95% interval. It prints aggregates only, never transcript text.

### Retire

Pointer first, then index row, then trigger row, then the file — create inverted, so no
intermediate state leaves a row pointing at nothing. Record why it went. Do not archive;
git holds the history. Full ordering: `references/agents-md-integration.md` §6.

---

## 4. RULES

### ✅ ALWAYS

1. Run the decision tests before authoring, on every path including retire.
2. Emit the router first when the target repository has none.
3. Quote `title` and `description` in frontmatter; both routinely contain a colon.
4. Keep dividers equal to numbered sections.
5. Make clear, in every numbered section, what goes wrong without it — in the section's substance if not in a dedicated line.
6. Name the failed test and the destination on every refusal.

### ⛔ NEVER

1. Write a rule that must bind when no trigger fires. That is an `AGENTS.md` row.
2. Put routing, skill selection, or dispatch mechanics into a rule.
3. Edit `AGENTS.md` beyond adding or removing a pointer. The always-loaded document carries hard blockers; anything else is an operator decision.
4. Add a rule because the set looks thin. The set is subject to its own `overengineering.md`.
5. Restate another rule instead of linking to it — though the default is no link at all.
6. Report a refusal as a failure. It is the designed outcome for most requests.

### ⚠️ ESCALATE IF

1. The request needs an `AGENTS.md` change beyond a pointer, or a widening of the router's scope statement.
2. Two existing rules disagree, and the new rule would have to pick a side.
3. The proposal fails a test but the operator wants it anyway — that is their call to make explicitly, not one to infer.

---

## 5. SUCCESS CRITERIA

- A generated rule passes the same structural checks the shipped corpus passes.
- A refused request leaves the user knowing which test it failed and where the content belongs.
- A retired rule leaves no dangling router row or pointer.
- The rule set does not grow because rules were easy to write.

---

## 6. REFERENCES

Routed by [`references/README.md`](references/README.md). Load
`references/decision-tests.md` first on every path; everything else is conditional.
