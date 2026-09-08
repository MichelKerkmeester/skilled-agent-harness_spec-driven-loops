# sk-create-repo-rule changelog digest

Skill path: `.opencode/skills/sk-doc/sk-create-repo-rule/`. Versions covered: v1.0.0.0 through v1.1.0.0 (the full changelog, only two entries exist). The entries carry no dates in their frontmatter. Both changelog files were first committed on 2026-08-31 (read-only `git log`), which is the closest available date signal.

---

## Per version, newest first

### v1.1.0.0 (`changelog/v1.1.0.0.md`)

This release added the two artifacts the mode shipped without. A ten-scenario manual testing playbook was written across three groups: `rule-decision`, `rule-authoring` and `lifecycle-and-wiring`. Four scenarios cover refusal paths, three cover authoring and three cover wiring and retirement, weighted that way on purpose because the mode refuses most of what it is asked for. The playbook states an inverted grading rule twice, once in the overview and once in the acceptance rules: a run that produces no file is usually a pass, graded on whether the refusal named its test and its destination, and a run that produces a well-written rule is a failure when the scenario expected a refusal. A README was added on the nine-section skeleton the sibling create modes share, covering what a rule is, how the trigger table loads one, where a rule sits in the precedence ladder and why the create and retire orderings run in opposite directions. One conformance violation was fixed: the `WHEN TO USE` section carried three file references where the sibling contract requires none, so its routing advice now names destinations rather than paths. The playbook is registered in `playbook-failclosed-allowlist.txt`, so its clean state is enforced rather than incidental. Six defective commands were found and re-run across two review passes, including an invalid comma-separated grep alternation, a divider count that graded every conforming rule as FAIL and an unbounded `git log` returning 30,773 lines newest-first where the scenario needed a bounded chronological one. The authoring scenario changed subject during writing, from dependency intake (which turned out to belong to `overengineering.md`) to concurrent-session work, which no shipped rule covers. Two limits are stated plainly: `validate_document.py --type reference` calls all eight shipped rules invalid because a repo rule has no Overview section by design, and no playbook scenario has been executed yet.

### v1.0.0.0 (`changelog/v1.0.0.0.md`)

Initial release of `create-repo-rule` as a workflow packet in the `sk-doc` parent hub. It turns a request, either a behaviour someone wants or a failure that keeps recurring, into a rule file under `repo-rules/` wired into that repository's `REPO RULES.md` router, and it also revises and retires rules. The mode leads with four decision tests that refuse most requests: always-loaded, scope boundary, a four-part refusal test and restraint. Every refusal names the test it failed and where the content belongs instead, and all ten previously declined candidates still fail, each by the test its original reason names. A rule template was derived from the corpus rather than copied from it, with ten fixed elements (present in all eight shipped rules) and an open numbered body, since section count follows the subject. A separate router template is emitted as a prerequisite when a repository has no trigger table, because the router shares almost no structure with the rules it routes to. Five creation standards act as reader tests deciding whether a structurally correct rule is worth loading. An integration and lifecycle contract fixes three wiring points and orders create, revise and retire so that stopping halfway always leaves an unreferenced file rather than a router row pointing at nothing. The `/create:repo-rule` command ships with auto and confirm workflows, and `retire` defaults to confirm even under an auto suffix because it deletes a file and removes two router rows. Length bands are operator-set at 250 maximum, 200 good and 160 or lower preferred, frontmatter included. Generated rules default to zero sideways cross-references. The accept path is built and structurally proven in parts but has never run end to end, because the reference set was saturated by a five-iteration review that returned zero warranted new rules, so no genuine accept case exists in this repository yet.

No RENAME, REMOVED or BREAKING change appears in either entry. Both are additive.

---

## Facts the v4 draft gets wrong or misses

Draft read: `specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md` (463 lines). The draft mentions this mode at lines 32, 132 and 142.

- **Nothing the draft states about this mode is wrong.** Line 142 says the mode writes, revises and retires the repo-local rule files that `REPO RULES.md` routes to, reachable through `/create:repo-rule`. That matches `changelog/v1.0.0.0.md` exactly, including all three lifecycle verbs and the command name.
- **Missed: the mode's defining behaviour is refusal, not authoring.** `changelog/v1.0.0.0.md` describes four decision tests that refuse more requests than they admit, each refusal naming the failed test and the destination for the content. `changelog/v1.1.0.0.md` repeats it, weighting four of ten playbook scenarios onto refusal paths and stating an inverted grading rule where producing no file is usually a pass. The draft at line 142 reads as a straightforward authoring tool, which is the opposite emphasis.
- **Missed: the router template.** `changelog/v1.0.0.0.md` records a second template, emitted as a prerequisite when a repository has no trigger table at all. That is the entry point for any repository adopting v4 without an existing `REPO RULES.md`, and the draft never mentions it. Line 142 is the natural home.
- **Missed: the accept path has never run end to end.** `changelog/v1.0.0.0.md` states this directly, and `changelog/v1.1.0.0.md` adds that no playbook scenario has been executed either. The draft presents the mode without caveat at line 142.
- **Missed: `retire` defaults to confirm even under an auto suffix.** `changelog/v1.0.0.0.md` gives the reason, that retiring deletes a file and removes two router rows. This is user-visible command behaviour and the draft's `/create:*` discussion at line 136 does not carry it.
- **Missed: v1.1.0.0 entirely.** Both the manual testing playbook and the README from `changelog/v1.1.0.0.md` are absent from the draft. The playbook matters because line 447 tells adopters to reconcile their own skills, and this is the package that says how the mode is validated.
- **Not verifiable from these entries: the packet count at line 132.** The draft says fourteen nested `sk-create-*` workflow packets. Neither changelog entry states a count, so this digest makes no claim about it.

---

## Current version and identity

- **Version:** `1.1.0.0`, from the `version:` field in the `SKILL.md` frontmatter at `.opencode/skills/sk-doc/sk-create-repo-rule/SKILL.md`. It matches the newest changelog entry.
- **Identity: a mode, not a hub and not standalone.** There is no `mode-registry.json` at the skill root. The parent directory `.opencode/skills/sk-doc/` carries `mode-registry.json`, `hub-router.json`, `description.json` and `graph-metadata.json`, which is the parent-hub signature. `sk-doc/mode-registry.json` registers this packet at line 492 with `"workflowMode": "sk-create-repo-rule"`, at lines 510 and 511 as `packet` and `packetSkillName`, and at line 513 with `"command": "/create:repo-rule"`. Both changelog entries agree, describing it as a workflow packet in the `sk-doc` parent hub.
- **Skill root contents:** `SKILL.md`, `README.md`, `assets/`, `changelog/`, `manual-testing-playbook/` and `references/`. No hub-only metadata files, which is correct for a nested mode.
