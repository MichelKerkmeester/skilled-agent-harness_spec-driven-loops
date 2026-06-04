---
title: "Constitutional Rules: Always-Surface Memory Files"
description: "Markdown rule files that define always-surfaced Spec Kit Memory constraints."
trigger_phrases:
  - "constitutional memory"
  - "always-surface rules"
  - "constitutional tier"
---

# Constitutional Rules: Always-Surface Memory Files

> Markdown rule files for global Spec Kit Memory constraints that must surface ahead of ordinary search results.

---

## 1. OVERVIEW

`constitutional/` contains Markdown rule files indexed as the constitutional tier in Spec Kit Memory. Constitutional records are intended for global rules that must surface before ordinary search results, such as gate enforcement and search-tool routing.

Current state:

- The folder contains 12 active rule files spanning gate enforcement, tool routing, CLI dispatch, comment hygiene, memory-system and DB-topology rules, completion verification, deep-review, and naming conventions (see §2 Package Topology). It originated with just `gate-enforcement.md` and `gate-tool-routing.md`.
- Rule files use frontmatter with `importanceTier: constitutional` and trigger phrases.
- Constitutional rules are fixed-visibility records: `searchBoost: 3.0`, `alwaysSurface: true`, `decay: false`, `autoExpireDays: null`, and `maxTokens: 2000`.
- Constitutional rules are permanent until edited or removed from this folder. They are not temporary memories and must not age out through decay.
- Constitutional rules support agent safety and retrieval routing. They do not replace packet recovery from `handover.md`, `_memory.continuity` and canonical spec docs.

---

## 2. PACKAGE TOPOLOGY

```text
constitutional/
+-- bash-output-truncation-verdict-visibility.md  # Make command verdicts visible despite Bash output truncation
+-- cli-dispatch-skill-preload.md                 # Read cli-X/SKILL.md before composing any CLI dispatch prompt
+-- code-graph-scope-intent.md                    # The repo-wide code-graph scope here is an intentional owner override
+-- comment-hygiene.md                            # No ephemeral artifact pointers (ADR/REQ/spec paths) in code comments
+-- gate-enforcement.md                           # Gate edge cases: compaction recovery + continuation validation
+-- gate-tool-routing.md                          # Search and retrieval routing decision tree
+-- main-branch-direct-push.md                    # Owner's AIs push directly to main; the bypass is authorized
+-- memory-db-file-topology.md                    # Index DB and vector stores are separate files; treat as one unit
+-- memory-system-spec-kit-only.md                # Use Spec Kit Memory only; never write Claude native memory unprompted
+-- post-implementation-deep-review.md            # Mandatory deep-review after substantive ships
+-- spec-folder-naming.md                         # Spec-folder naming and rename conventions
+-- verify-before-completion-claims.md            # Gate completion claims on a positive check you actually read
`-- README.md                                     # Folder topology and editing guidance
```

Rule-file shape:

```markdown
---
title: "RULE TITLE"
importanceTier: constitutional
contextType: decision
triggerPhrases:
  - relevant phrase
---

# Rule Title

## RULE SECTION

Rule content.

```

Allowed dependency direction:

```text
constitutional/*.md -> memory indexing metadata
memory_search() -> constitutional records first, then query results
memory_match_triggers() -> trigger phrase matches
```

Disallowed dependency direction:

```text
constitutional rules -> packet-specific status or mutable packet history
constitutional rules -> runtime code behavior not enforced elsewhere
README.md -> replacement for the rule files themselves
```

---

## 3. DIRECTORY TREE

```text
constitutional/
+-- bash-output-truncation-verdict-visibility.md  # Make command verdicts visible despite Bash output truncation
+-- cli-dispatch-skill-preload.md                 # Read cli-X/SKILL.md before composing any CLI dispatch prompt
+-- code-graph-scope-intent.md                    # The repo-wide code-graph scope here is an intentional owner override
+-- comment-hygiene.md                            # No ephemeral artifact pointers (ADR/REQ/spec paths) in code comments
+-- gate-enforcement.md                           # Gate edge cases: compaction recovery + continuation validation
+-- gate-tool-routing.md                          # Search and retrieval routing decision tree
+-- main-branch-direct-push.md                    # Owner's AIs push directly to main; the bypass is authorized
+-- memory-db-file-topology.md                    # Index DB and vector stores are separate files; treat as one unit
+-- memory-system-spec-kit-only.md                # Use Spec Kit Memory only; never write Claude native memory unprompted
+-- post-implementation-deep-review.md            # Mandatory deep-review after substantive ships
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
| `cli-dispatch-skill-preload.md` | MUST `Read` `cli-X/SKILL.md` before composing any CLI dispatch prompt (model-specific prompt contracts). |
| `code-graph-scope-intent.md` | The repo-wide code-graph index scope is a deliberate owner env override, not a misconfiguration. |
| `comment-hygiene.md` | Never embed spec paths or packet/ADR/REQ/task/finding ids in code comments; keep the durable WHY. |
| `gate-enforcement.md` | Gate edge cases: compaction recovery and continuation validation (full gate definitions in AGENTS.md §2). |
| `gate-tool-routing.md` | Search and retrieval routing across memory, code graph, and the FTS fallback chain. |
| `main-branch-direct-push.md` | Owner's AIs push directly to `main`; the protected-branch bypass is expected and authorized. |
| `memory-db-file-topology.md` | The index DB and embedding vectors live in separate files; wipe/restore/integrity-check them as one unit. |
| `memory-system-spec-kit-only.md` | Use Spec Kit Memory for all saves; never write Claude native memory unless explicitly asked. |
| `post-implementation-deep-review.md` | Run a deep-review after every substantive implementation phase or when uncertain about shipped code. |
| `spec-folder-naming.md` | `NNN-short-name` convention and the rename/move procedure (`git mv`, never delete + recreate). |
| `verify-before-completion-claims.md` | Gate every completion claim on a positive check whose result you actually read. |
| `README.md` | Explains folder ownership, file topology and validation steps. |

---

## 5. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | Rule files are Markdown inputs for memory indexing. They do not import code. |
| Exports | Indexed records surface through memory search and trigger matching. |
| Ownership | This folder owns global always-surface rules only. Packet-specific decisions stay in spec folders. |
| Rule language | Use direct MUST, STOP and REQUIRED language only when the rule is an actual hard constraint. |
| Visibility budget | Keep each constitutional rule lean enough for the `maxTokens: 2000` budget in `importance-tiers.ts`. |
| Verification | After rule edits, validate the README and re-index the changed rule file so fixed-priority surfacing is refreshed. |

Main flow:

```text
╭──────────────────────────────────────────╮
│ constitutional/*.md                      │
╰──────────────────────────────────────────╯
                  │
                  ▼
┌──────────────────────────────────────────┐
│ frontmatter and ANCHOR sections          │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ memory_save or memory_index_scan         │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ constitutional-tier memory records       │
└──────────────────────────────────────────┘
                  │
                  ▼
╭──────────────────────────────────────────╮
│ surfaced in search and trigger results   │
╰──────────────────────────────────────────╯
```

---

## 6. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `*.md` rule files (12) | Rule document | Always-surfaced constitutional guidance; see §4 Key Files for the full list. |
| `memory_search({ includeConstitutional: true })` | MCP tool behavior | Returns constitutional records before query-relevant records by default. |
| `memory_match_triggers({ prompt })` | MCP tool behavior | Surfaces matching rules from trigger phrases. |
| `memory_save({ filePath })` | MCP tool behavior | Indexes a single constitutional rule file. |
| `memory_index_scan({ includeConstitutional: true })` | MCP tool behavior | Scans constitutional rule files with other indexed docs. |

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

When a rule file changes, index it after validation:

```typescript
memory_save({ filePath: ".opencode/skills/system-spec-kit/constitutional/gate-enforcement.md", force: true })
```

---

## 8. RELATED

- [`../README.md`](../README.md)
- [`../SKILL.md`](../SKILL.md)
- [`./gate-enforcement.md`](./gate-enforcement.md)
- [`./gate-tool-routing.md`](./gate-tool-routing.md)
- The full set of 12 rule files is listed in §4 Key Files.
- [`../mcp_server/lib/scoring/importance-tiers.ts`](../mcp_server/lib/scoring/importance-tiers.ts)
