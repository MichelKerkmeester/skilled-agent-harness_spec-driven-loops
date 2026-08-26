---
title: "Constitutional Rules: Reference Documents"
description: "Markdown reference docs for the durable operating rules. No longer a searchable memory tier."
trigger_phrases:
  - "constitutional rules"
  - "operating rules reference"
  - "rule reference docs"
---

# Constitutional Rules: Reference Documents

> Markdown reference docs holding the long-form text of the durable operating rules. These are plain documents, not a searchable memory tier.

---

## 1. OVERVIEW

`constitutional/` holds the long-form text of the project's durable operating rules — gate enforcement, tool routing, CLI dispatch, comment hygiene, completion verification, and the rest.

These files were formerly indexed as a special "constitutional" always-surface memory tier that pinned them to the top of Spec Kit Memory search results. **That tier has been retired.** The rules themselves remain fully in force: their operative text is inlined into the root operating docs (`CLAUDE.md`, `AGENTS.md`, `BARTER.md`) and enforced by hooks and classifiers. This folder is the canonical long-form home for each rule and a stable link target for those root docs.

Current state:

- The folder contains 20 rule files (see §2 Package Topology) plus this README.
- The files are **plain, unindexed reference docs**. They are not indexed into Spec Kit Memory, carry no importance tier, and are not auto-surfaced or injected at session start.
- `memory-system-spec-kit-only.md` stays authoritative: use Spec Kit Memory for saves; never write native agent memory unprompted.
- These docs support agent guidance and are stable link targets. They do not replace packet recovery from `handover.md`, `_memory.continuity` and canonical spec docs.

---

## 2. PACKAGE TOPOLOGY

```text
constitutional/
+-- bash-output-truncation-verdict-visibility.md  # Make command verdicts visible despite Bash output truncation
+-- automated-writers-never-overwrite-manual.md   # Automated writers must preserve manual evidence and edits
+-- cli-dispatch-skill-preload.md                 # Read cli-X/SKILL.md before composing any CLI dispatch prompt
+-- comment-hygiene.md                            # No ephemeral artifact pointers (ADR/REQ/spec paths) in code comments
+-- deep-skill-workflow-required.md               # Use the deep skill command or workflow, never hand-roll a manual substitute
+-- entity-cooccurrence-is-not-causal.md          # Co-occurrence is not causal-graph evidence by itself
+-- fable-governor.md                             # Fable integration boundaries and governor constraints
+-- fable-subagent-model-policy.md                # Fable main loop -> subagents must be opus or sonnet, never fable or a fork
+-- finding-is-a-hypothesis.md                    # Confirm findings against real code before acting
+-- gate-enforcement.md                           # Gate edge cases: compaction recovery + continuation validation
+-- gate-tool-routing.md                          # Search and retrieval routing decision tree
+-- goal-prompting-runtime-specific.md            # Claude Code native /goal vs OpenCode opencode-goal plugin, by runtime
+-- main-branch-direct-push.md                    # Owner's AIs push directly to main; the bypass is authorized
+-- memory-system-spec-kit-only.md                # Use Spec Kit Memory only; never write Claude native memory unprompted
+-- post-implementation-deep-review.md            # Mandatory deep-review after substantive ships
+-- recursion-control.md                          # Bound recursive self-improvement and loop dispatch
+-- recorded-failure-must-route.md               # Recorded failures must link to a follow-up route
+-- regression-baseline-and-delta.md              # Capture baseline and report deltas before no-regression claims
+-- spec-folder-naming.md                         # Spec-folder naming and rename conventions
+-- verify-before-completion-claims.md            # Gate completion claims on a positive check you actually read
`-- README.md                                     # Folder topology and editing guidance
```

Rule-file shape:

```markdown
---
title: "RULE TITLE"
contextType: decision
---

# Rule Title

## RULE SECTION

Rule content.

```

---

## 3. DIRECTORY TREE

```text
constitutional/
+-- bash-output-truncation-verdict-visibility.md  # Make command verdicts visible despite Bash output truncation
+-- automated-writers-never-overwrite-manual.md   # Automated writers must preserve manual evidence and edits
+-- cli-dispatch-skill-preload.md                 # Read cli-X/SKILL.md before composing any CLI dispatch prompt
+-- comment-hygiene.md                            # No ephemeral artifact pointers (ADR/REQ/spec paths) in code comments
+-- deep-skill-workflow-required.md               # Use the deep skill command or workflow, never hand-roll a manual substitute
+-- entity-cooccurrence-is-not-causal.md          # Co-occurrence is not causal-graph evidence by itself
+-- fable-governor.md                             # Fable integration boundaries and governor constraints
+-- fable-subagent-model-policy.md                # Fable main loop -> subagents must be opus or sonnet, never fable or a fork
+-- finding-is-a-hypothesis.md                    # Confirm findings against real code before acting
+-- gate-enforcement.md                           # Gate edge cases: compaction recovery + continuation validation
+-- gate-tool-routing.md                          # Search and retrieval routing decision tree
+-- goal-prompting-runtime-specific.md            # Claude Code native /goal vs OpenCode opencode-goal plugin, by runtime
+-- main-branch-direct-push.md                    # Owner's AIs push directly to main; the bypass is authorized
+-- memory-system-spec-kit-only.md                # Use Spec Kit Memory only; never write Claude native memory unprompted
+-- post-implementation-deep-review.md            # Mandatory deep-review after substantive ships
+-- recursion-control.md                          # Bound recursive self-improvement and loop dispatch
+-- recorded-failure-must-route.md               # Recorded failures must link to a follow-up route
+-- regression-baseline-and-delta.md              # Capture baseline and report deltas before no-regression claims
+-- spec-folder-naming.md                         # Spec-folder naming and rename conventions
+-- verify-before-completion-claims.md            # Gate completion claims on a positive check you actually read
`-- README.md                                     # This folder guide
```

Do not document `.DS_Store` or other local machine artifacts as part of the package.

---

## 4. KEY FILES

| File | Responsibility |
|---|---|
| `bash-output-truncation-verdict-visibility.md` | Never infer a command result from blank/truncated Bash output; make verdicts land in the first ~2KB. |
| `automated-writers-never-overwrite-manual.md` | Automated writers must not overwrite manual evidence, decisions, or user-authored content. |
| `cli-dispatch-skill-preload.md` | MUST `Read` `cli-X/SKILL.md` before composing any CLI dispatch prompt (model-specific prompt contracts). |
| `comment-hygiene.md` | Never embed spec paths or packet/ADR/REQ/task/finding ids in code comments; keep the durable WHY. |
| `deep-skill-workflow-required.md` | Use the deep skill's command, agent or workflow; never hand-roll a manual cli-* substitute for a deep loop. |
| `entity-cooccurrence-is-not-causal.md` | Treat entity co-occurrence as retrieval evidence only, not causal-graph evidence. |
| `fable-governor.md` | Keep fable governor behavior bounded to its documented runtime contract. |
| `fable-subagent-model-policy.md` | Under a Fable main loop, every subagent needs an explicit opus/sonnet override; forks and model-less dispatches inherit Fable and are forbidden. |
| `finding-is-a-hypothesis.md` | Treat every finding as a hypothesis until it is verified against the real code or symptom. |
| `gate-enforcement.md` | Gate edge cases: compaction recovery and continuation validation (full gate definitions in AGENTS.md §2). |
| `gate-tool-routing.md` | Search and retrieval routing across memory, code graph, and the FTS fallback chain. |
| `goal-prompting-runtime-specific.md` | Use each runtime's own goal-prompting surface: Claude Code native `/goal`, OpenCode's `opencode-goal` plugin. Never cross-wire the two. |
| `main-branch-direct-push.md` | Owner's AIs push directly to `main`; the protected-branch bypass is expected and authorized. |
| `memory-system-spec-kit-only.md` | Use Spec Kit Memory for all saves; never write Claude native memory unless explicitly asked. |
| `post-implementation-deep-review.md` | Run a deep-review after every substantive implementation phase or when uncertain about shipped code. |
| `recursion-control.md` | Bound recursive workflows, self-improvement loops, and repeated delegated passes. |
| `recorded-failure-must-route.md` | A detector that records a FAIL, contradiction, drift, warning, or follow-up must link to a remediation route or accepted-risk decision. |
| `regression-baseline-and-delta.md` | Capture a baseline before no-regression claims and report the delta after verification. |
| `spec-folder-naming.md` | `NNN-short-name` convention and the rename/move procedure (`git mv`, never delete + recreate). |
| `verify-before-completion-claims.md` | Gate every completion claim on a positive check whose result you actually read. |
| `README.md` | Explains folder ownership, file topology and validation steps. |

---

## 5. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | Rule files are standalone Markdown reference docs. They do not import code. |
| Exports | None. These are documents, not indexed records; nothing reads them at runtime. |
| Ownership | This folder owns the long-form text of the durable operating rules only. Packet-specific decisions stay in spec folders. |
| Rule language | Use direct MUST, STOP and REQUIRED language only when the rule is an actual hard constraint. |
| Enforcement | The rules are enforced by hooks and classifiers and inlined into the root operating docs. This folder is documentation, not the enforcement path. |
| Verification | After a rule edit, validate the README structure. No re-indexing is needed — the folder is not indexed. |

Main flow:

```text
╭──────────────────────────────────────────╮
│ constitutional/*.md (reference docs)     │
╰──────────────────────────────────────────╯
                  │
                  ▼
┌──────────────────────────────────────────┐
│ inlined into CLAUDE.md / AGENTS.md /      │
│ BARTER.md; enforced by hooks + classifiers │
└──────────────────────────────────────────┘
```

---

## 6. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `*.md` rule files (20) | Reference document | Long-form text of a durable operating rule; see §4 Key Files for the full list. |
| Root operating docs | Inlined text | `CLAUDE.md`, `AGENTS.md`, `BARTER.md` carry the operative rule text and link here for the long form. |

---

## 7. VALIDATION

Run from the repository root unless noted.

```bash
python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/system-spec-kit/constitutional/README.md
```

Expected result: the README passes document validation.

```bash
python3 .opencode/skills/sk-doc/scripts/extract_structure.py .opencode/skills/system-spec-kit/constitutional/README.md
```

Expected result: structure extraction reports no critical README issues.

---

## 8. RELATED

- [`../README.md`](../README.md)
- [`../SKILL.md`](../SKILL.md)
- [`./gate-enforcement.md`](./gate-enforcement.md)
- [`./gate-tool-routing.md`](./gate-tool-routing.md)
- The full set of 20 rule files is listed in §4 Key Files.
