### .skilled/skills/sk-doc/sk-create-manual-testing-playbook/README.md

- [P1] .skilled/skills/sk-doc/sk-create-manual-testing-playbook/README.md:100 | 5 | The skip gate ("Skip it when test steps fit cleanly in a spec-folder `checklist.md` row…") sits in §5, after QUICK START's scaffold-and-validate steps and after HOW IT WORKS, so a reader can build a package the gate would have rejected. | Move lines 100-102 (`### When To Use This Skill` and its paragraph) to directly after line 35, as the second subsection of `## 2. OVERVIEW`, ahead of `## 3. QUICK START`.
- [P2] .skilled/skills/sk-doc/sk-create-manual-testing-playbook/README.md:86 | 7 | One paragraph carries the whole authoring sequence — confirm scope, choose categories and IDs, scaffold the root, scaffold per-feature files, write policy, fill contracts, link summaries, isolate destructive scenarios, validate, spot-check — which is a list rendered as prose. | Replace line 86 with:

```markdown
1. Confirm the target skill or system, its feature set and whether a feature catalog already exists.
2. Decide categories and stable feature IDs using a `{PREFIX}-{NNN}` pattern before writing anything else.
3. Create the root file from `assets/manual-testing-playbook-template.md`.
4. Create one per-feature file per ID, starting single-prompt files from `assets/manual-testing-playbook-snippet-template.md` and conversation files from `assets/manual-testing-playbook-conversation-snippet-template.md`.
5. Write root package policy (review protocol, evidence rules, orchestration guidance) before scenario-specific exceptions.
6. Fill each scenario contract with the nine required fields from The Scenario Contract.
7. Link root category summaries to every per-feature file and to a matching feature-catalog entry when one exists.
8. Note explicitly when no catalog entry exists.
9. Isolate destructive scenarios behind clear preconditions and a recovery path.
10. Validate the root document with the shared validator.
11. Manually spot-check per-feature frontmatter, section order and feature ID counts before delivery.

The operator validator warns when a prompt copy disagrees.
```

### .skilled/skills/sk-doc/sk-create-manual-testing-playbook/ROUTER.md

- clean

### .skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md

- [P1] .skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md:370 | 1 | `## 7. VALIDATION AND RELEASE GATES` carries two different sections under the identical H3 `Automated Checks`: line 370 covers shared document validation and line 393 covers the operator-contract validator. The label names neither mechanism, and a reader moving through §7 cannot tell which one a link or a note refers to. | Change line 370 to `### Shared Document Validation` and line 393 to `### Operator Contract Validator`.
- [P2] .skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md:337 | 5 | The gate that governs every rule above it ("Pick the style for each scenario before you write its execution truth") is the last subsection of §6, after Determinism, Prompt Quality, Voice and the Prompt Synchronization Gate, while §5 step 7 already sends the reader to it first. | Move lines 337-365 to directly after line 267 so `### Choosing the Scenario Style` opens §6. The `See [conversation-scenarios.md]` sentence then sits at line 288, so update the stored line reference from 357 to 288.
- [P2] .skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md:418 | 7 | One paragraph packs the operator validator's 17 per-feature checks into a semicolon run, which is a list rendered as prose. | Replace lines 418-424 with:

```markdown
The command validates the operator-scenario contract, not the routing-gold contract. It walks every non-excluded
scenario tree and checks, per feature:

- Five-section ordering.
- `title`, `description` and four-part `version` frontmatter.
- Feature ID.
- Operator or orchestrator prompt.
- Exact command sequence.
- Expected signals.
- Evidence.
- Pass/fail criteria.
- Failure triage.
- Root-playbook link.
- Allowed verdicts.
- Filename and category shape.
- Unique IDs.
- Root-index bijection.
- Local links.
- Evergreen truth.
- Placeholder exclusion.

Conditional checks cover a realistic user request when user intent is explicitly being clarified, an exact prompt
when a scenario table is present, and a feature-catalog link when catalog applicability is declared.
```

### .skilled/skills/sk-doc/sk-create-manual-testing-playbook/assets/manual-testing-playbook-conversation-snippet-template.md

- [P2] .skilled/skills/sk-doc/sk-create-manual-testing-playbook/assets/manual-testing-playbook-conversation-snippet-template.md:26 | 1 | §1 OVERVIEW opens by repeating the intro verbatim ("Use this template for a multi-turn conversation scenario. Use `manual-testing-playbook-snippet-template.md` for a single-prompt scenario.") and repeats the first "Do not use" bullet at line 41; the asset template forbids duplicating intro content in OVERVIEW. | Delete lines 26-27, leaving line 28 ("Each feature file is the canonical home…") as the first overview paragraph.

### .skilled/skills/sk-doc/sk-create-manual-testing-playbook/assets/manual-testing-playbook-snippet-template.md

- clean

### .skilled/skills/sk-doc/sk-create-manual-testing-playbook/assets/manual-testing-playbook-template.md

- [P1] .skilled/skills/sk-doc/sk-create-manual-testing-playbook/assets/manual-testing-playbook-template.md:172 | 1 | In the root-playbook scaffold, `### Result persistence` sits before any H2, so a copied `manual-testing-playbook.md` opens H1 → intro → H3 and the section renders as a child of the H1 rather than of §1. The shipped playbooks carry the same marker as a paragraph, not an orphan H3. | Move lines 172-175 (the `### Result persistence` heading, blank line, contract comment and paragraph) to after line 183, inside `## 1. OVERVIEW` and before `### Realistic Test Model`.

### .skilled/skills/sk-doc/sk-create-manual-testing-playbook/references/README.md

- [P2] .skilled/skills/sk-doc/sk-create-manual-testing-playbook/references/README.md:18 | 3 | The intro is a pure pointer: it labels itself a route map, points at `../SKILL.md`, and tells the reader to open a file only when sent. Every claim it makes also appears in §1 at line 24 and the Core Principle at line 26, so it can be replaced with a hook. | Replace line 18 with: `Four overflow files sit behind the workflow, and the wrong pick costs a detour. Use this map to land on the right one in a single row, then read only that file.`
- [P2] .skilled/skills/sk-doc/sk-create-manual-testing-playbook/references/README.md:65 | 10 | A closing pointer paragraph follows `## 3. RELATED RESOURCES`, so the related-resources section is not the last content in the file; the sentence repeats line 18 and line 24. | Delete line 65.

### .skilled/skills/sk-doc/sk-create-manual-testing-playbook/references/common-pitfalls.md

- [P2] .skilled/skills/sk-doc/sk-create-manual-testing-playbook/references/common-pitfalls.md:21 | 4 | `## 1. OVERVIEW` opens with an unlabelled paragraph that runs straight into a bold `Core Principle`, so neither Purpose nor When to Use is labelled; the reference template's OVERVIEW skeleton requires both. | Replace lines 21-25 with:

```markdown
## 1. OVERVIEW

### Purpose

Most playbook defects come from splitting package truth across sidecar files, desynchronizing prompt fields, or overloading the root summary with execution detail that belongs in the per-feature file. Each row below pairs the mistake with why it breaks the package and the correct fix.

### When to Use

- Reviewing a drafted playbook for defects.
- Diagnosing a package that splits truth or desyncs prompts.

### Core Principle

One canonical truth per scenario - shared policy in the root, execution truth in the per-feature file, and nothing duplicated between them.
```

### .skilled/skills/sk-doc/sk-create-manual-testing-playbook/references/conversation-scenarios.md

- [P2] .skilled/skills/sk-doc/sk-create-manual-testing-playbook/references/conversation-scenarios.md:21 | 4 | `## 1. OVERVIEW` opens with the when-to-use paragraph at line 23 and the block-placement fact at line 25; it has no Purpose or When to Use subsection, so the reference template's OVERVIEW skeleton is missing. | Replace lines 21-25 with:

```markdown
## 1. OVERVIEW

### Purpose

The script is one fenced `json conversation` block in section 3 of the scenario file. The block is the source of truth for the conversation turns.

### When to Use

Write a conversation scenario when the behavior depends on multiple prompts, scripted answers, runtime actions, or state checks across a session. One prompt is enough when a single request and its result capture the full behavior. The ordered decision rule, the runtime requirements and the cost of each style live in `SKILL.md` §6, Choosing the Scenario Style.
```

- [P2] .skilled/skills/sk-doc/sk-create-manual-testing-playbook/references/conversation-scenarios.md:135 | 5 | The rule that governs every check - read state only, never write under `$CONVERSATION_REPO_ROOT` - is the last bullet, after the rules at 126-134 that tell the reader how to write checks, so a reader can build a check that writes before meeting the constraint. | Move line 135 to directly after line 126.

- [P2] .skilled/skills/sk-doc/sk-create-manual-testing-playbook/references/conversation-scenarios.md:153 | 7 | One paragraph packs six run settings - the check env vars, the 60-second check timeout, the 120-second setup timeout, the exit-77 skip, the setup env vars and the `--repo-root` resolution - so a reader cannot scan the defaults. | Replace line 153 with:

```markdown
- The runner sets `CONVERSATION_RUNTIME`, `CONVERSATION_REPO_ROOT`, `CONVERSATION_RUN_DIR` (the runtime's evidence folder) and `CONVERSATION_TURN_DIR` (the turn's evidence folder) for each `check` command.
- A check defaults to 60 seconds. Set `CONVERSATION_CHECK_TIMEOUT_MS` to override that bound. An overrun fails as `CHECK_TIMEOUT`.
- Each `setup` command has 120 seconds. An overrun refuses the run as `SETUP_TIMEOUT`.
- Exit 77 skips the runtime with its first non-empty output line as the blocker.
- The runner sets `CONVERSATION_REPO_ROOT` and `CONVERSATION_RUNTIME` for every `setup` command too, so setup can copy project files from the repository without any variable set by hand.
- `CONVERSATION_REPO_ROOT` is the repository the run snapshots, which `--repo-root` can point at a worktree.
```

### .skilled/skills/sk-doc/sk-create-manual-testing-playbook/references/examples.md

- [P2] .skilled/skills/sk-doc/sk-create-manual-testing-playbook/references/examples.md:21 | 4 | `## 1. OVERVIEW` runs a benefit sentence straight into an inline bold `**Core Principle**`; it has no Purpose or When to Use subsection, so the overview never labels why a reader opens the file or when to reach for it. | Replace lines 21-25 with:

```markdown
## 1. OVERVIEW

### Purpose

The fastest way to author a correct playbook is to model it on one that already ships and validates. The reference implementations below are live packages built to the current contract; the templates are the scaffolds to copy from.

### When to Use

- Seeding a new canonical package from a scaffold.
- Studying a shipped, validating package before writing your own.

### Core Principle

Model a new package on a shipped, validating playbook rather than authoring the structure from scratch.
```

### .skilled/skills/sk-doc/sk-create-manual-testing-playbook/references/prompt-voice.md

- [P2] .skilled/skills/sk-doc/sk-create-manual-testing-playbook/references/prompt-voice.md:21 | 4 | `## 1. OVERVIEW` states the default voice and then an inline bold `**Core Principle**`; it has no Purpose or When to Use subsection, so the opening does not follow the reference template's OVERVIEW skeleton. | Replace lines 21-25 with:

```markdown
## 1. OVERVIEW

### Purpose

The canonical `Prompt:` field defaults to **natural-human voice** - how a real user would phrase the request to an AI in conversation. The RCAF (Role-Context-Action-Format) wrapper is the exception, reserved for when the actor IS an AI orchestrator.

### When to Use

- Choosing or reviewing the `Prompt:` voice for a scenario.
- Deciding whether the RCAF wrapper applies.

### Core Principle

When in doubt, prefer natural-human. RCAF is the exception, natural is the default.
```

- [P2] .skilled/skills/sk-doc/sk-create-manual-testing-playbook/references/prompt-voice.md:60 | 6 | The baseline rule for `Real user request:` sits after both voice lists, while the natural-human list's last bullet at line 53 already tells the writer to match that field's voice; the reader meets the dependency before the rule that resolves it. | Move line 60 to directly after line 46 (`## 3. VOICE GUIDELINES`), before `**Natural-human prompts**:`.

