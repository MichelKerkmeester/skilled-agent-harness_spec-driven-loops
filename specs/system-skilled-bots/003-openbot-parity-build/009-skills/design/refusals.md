---
title: "Design: the refusal catalogue for phase 9"
description: "Every refusal this phase adds with its layer, failure class, exit code, registry entry, exact message, trigger and the state left on disk, plus the verb's stdout and stderr forms and the checker's FAIL lines."
trigger_phrases:
  - "skills refusal catalogue"
  - "skill-changed message"
  - "proposal-stale exit code"
importance_tier: "important"
contextType: "implementation"
version: 1.0.0.0
---

# The refusal catalogue for phase 9

`contracts/refusals.md` section 3.8 holds this phase's rows and the packet's exit rule. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/refusals.md, section "3.8 Phase 009, skills"] This note adds the three things that section leaves to the phase: the exact message each refusal prints, the trigger that raises it and the state it leaves on disk. The exit codes and the failure classes are the contract's and are not restated as a choice.

Paths are relative to the repository root. `$R` is `.skilled/skills/system-skilled-bots/runtime` and `$F` is `.skilled/skills/system-skilled-bots/scripts/fixtures`.

---

## 1. THE CATALOGUE

`Registry` says whether the name enters the runner's typed `REFUSAL_CAUSES` map. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/refusals.md, section "2. LAYERS AND THE EXIT RULE"] A dash in `Class` means the layer carries no failure class.

| Name | Layer | Class | Exit | Registry | Message | Trigger | On disk |
|------|-------|-------|------|----------|---------|---------|---------|
| `skills-duplicate` | Definition parse | - | 4 run, 1 checker | No | `bots: definition-malformed: skills-duplicate (<name>)` | the list names one skill twice | nothing, the run is refused before dispatch |
| `skills-name-invalid` | Definition parse | - | 4 run, 1 checker | No | `bots: definition-malformed: skills-name-invalid (<name>)`, or `(<not a list>)` for a value that is not a list of strings | a name outside `SKILL_NAME_PATTERN`, an empty entry, or a value that is not a list | nothing |
| `skills-unknown` | Checker invariant | - | 1 | No | `FAIL: skills-unknown: <bot>: <name>` | the checkout's `BOT.md` names a skill with no `SKILL.md` under the checker's own tree | nothing, the checker writes no file |
| `skills-too-large` | Checker invariant | - | 1 | No | `FAIL: skills-too-large: <bot>: <name> is <n> bytes, over 16384` | one named body is over the per-skill cap | nothing |
| `skills-over-budget` | Checker invariant | - | 1 | No | `FAIL: skills-over-budget: <bot>: <name> takes the list to <n> bytes, over 24576` | the running total crosses the list cap | nothing |
| `skill-unknown` | Run refusal | `author` | 4 | Yes | `bots: skill-unknown: <name>` | the named file does not exist under `<skilledTree>/.skilled/skills/` | a refused run record with `posture.skills` empty |
| `skill-unreadable` | Run refusal | `environment` | 4 | Yes | `bots: skill-unreadable: <name> (<errno>)` | the read fails for a reason other than absence | a refused run record |
| `skill-too-large` | Run refusal | `author` | 4 | Yes | `bots: skill-too-large: <name> is <n> bytes, over 16384` | one body is over the per-skill cap | a refused run record |
| `skills-over-budget` | Run refusal | `author` | 4 | Yes | `bots: skills-over-budget: <name> takes the list to <n> bytes, over 24576` | the running total crosses the list cap | a refused run record |
| `skill-changed` | Run refusal | `operator` | 4 | Yes | `bots: skill-changed: <name> differs from the installed body` | the body's digest differs from `skillDigests[name]`, or no digest is recorded | a refused run record |
| `run-record-missing` | Verb refusal (`skill propose`) | - | 4 | No | `bots: run-record-missing: <run-id>` | the run record file does not exist | nothing |
| `review-already-exists` | Verb refusal (`skill propose`) | - | 4 | No | `bots: review-already-exists: <run-id>` | the review item for that run id already exists | nothing, the two files are not overwritten |
| `proposal-secret` | Verb refusal (`skill propose`) | - | 4 | No | `bots: proposal-secret: <key>` | the draft holds a known secret literal | nothing, neither file is written |
| `proposal-stale` | Verb refusal (`answer` on a `skill-proposal` item) | - | 4 | No | `bots: proposal-stale: <name>` | the target's digest differs from `revisionRead`, or the target appeared or vanished since the proposal | nothing, the item stays open |

Three names are the contract's and this phase only reaches them:

| Name | Owner | How this phase reaches it |
|------|-------|---------------------------|
| `review-answer-invalid` | 005 | the claim refuses an answer that is not `confirm`, `reject` or a NO, with the item still open [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/refusals.md, section "3.4 Phase 005, memory", row `review-answer-invalid`] |
| `prompt-over-budget` | 005 | the composed prompt is over 32,000 characters and the skills block is the block that crossed the line, so the detail reads `prompt-over-budget: skills at <n> of 32000 characters` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/prompt-sections.md, section "4.3 The overflow rule"] |
| `checker-failed` | today | `bots install` runs the checker, so a bad `skills` list refuses the install with the checker's own `FAIL:` line as the detail [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/installer.ts:569-572] |

---

## 2. THE USAGE LAYER

Three messages exit 2 and print the usage text after the message, the way `bots: --as takes a name` already does. [SOURCE: .skilled/bin/bots.cjs:94-98] None of them is a named refusal, because the command line itself is wrong.

| Message | Trigger |
|---------|---------|
| `bots: unknown action: <action>` | `bots skill <action>` where the action is not `propose` |
| `bots: --name takes a skill name` | `--name` holds a value outside `SKILL_NAME_PATTERN` |
| `bots: option --name needs a value` | `--name` is the last argument, or its value is another known flag |

---

## 3. WHAT THE VERB PRINTS

`contracts/cli-json.md` fixes the rule: a non-zero exit prints nothing on stdout and its reason is the first stderr line. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/cli-json.md, section "1. THE RULE"]

| Outcome | stdout | stderr | Exit |
|---------|--------|--------|------|
| Both files and the item written | `bots: proposal written for run <run-id> at proposals/<run-id>` | nothing | 0 |
| A refusal | nothing | `bots: <reason>` or `bots: <reason>: <detail>` | 4 |
| A usage error | nothing | `bots: <message>` then the usage text | 2 |

`bots skill propose` takes no `--json`, so this phase adds no row to `contracts/cli-json.md`. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/cli-json.md, section "2. ONE ROW PER VERB"]

---

## 4. WHAT THE CHECKER PRINTS

The checker prints one `FAIL:` line per broken invariant and exits 1. [SOURCE: .skilled/skills/system-skilled-bots/scripts/bot-check.cjs:112] The three skills invariants are hard, so each has its own defect fixture and each fails closed.

| Fixture | Line the checker prints | Exit |
|---------|-------------------------|------|
| `$F/skills-unknown` | `FAIL: skills-unknown: nightly-digest: no-such-skill` | 1 |
| `$F/skills-too-large` | `FAIL: skills-too-large: nightly-digest: sk-git is 32362 bytes, over 16384` | 1 |
| `$F/skills-over-budget` | `FAIL: skills-over-budget: nightly-digest: sk-doc takes the list to 26183 bytes, over 24576` | 1 |
| `$F/skills-clean` | no `FAIL:` line | 0 |

The three names are added to `HARD_INVARIANTS`, so a fixture that breaks one cannot pass under `--strict` either. [SOURCE: .skilled/skills/system-skilled-bots/scripts/bot-check.cjs:39-58]

---

## 5. DECISIONS TAKEN

| Decision | Why |
|----------|-----|
| The checker names are plural and the run names singular | The checker audits the list and the runner names the one skill, and both spellings are already in the contract. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/refusals.md, section "3.8 Phase 009, skills"] |
| `run-record-missing` is the verb's own name, not the reader's `record-missing` | The reader's name is about a file and the verb's is about the command's argument. The verb maps `record-missing` to `run-record-missing` and passes every other reader reason through unchanged, so no second vocabulary is invented |
| An invalid `--name` is a usage error with no reason name | The command line is wrong before any file is read, which is the usage layer, and 001's `bots: --as takes a name` is the same shape |
| `proposal-secret` names the key and never the value | A refusal that printed the value would put the secret in the terminal and in the shell history |
| `skill-changed` names the skill and not the two digests | The operator's fix is to reinstall, and the digests are long enough to make the line unreadable |
| The checker resolves its own skilled tree | The checker takes a checkout root and no other option, so the tree it audits is the one it ships in. The fixtures name real skills whose sizes are measured in `design/fixtures.md` |
