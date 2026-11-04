### .skilled/skills/cli-external-orchestration/README.md

- [P2] .skilled/skills/cli-external-orchestration/README.md:25 | 3 | The second intro sentence restates the hub’s purpose instead of adding a hook. | Replace the quote with: “The seven modes cover parallel sessions, cloud handoffs, and read-only review.”
- [P2] .skilled/skills/cli-external-orchestration/README.md:42 | 4 | The overview starts with “Why This Hub Exists”; its When to Use guidance appears after Quick Start. | Rename `### Why This Hub Exists` to `### Purpose`, then move `### When To Use This Hub` and its paragraph from lines 103–105 to immediately after line 44, renaming it `### When to Use`.
- [P2] .skilled/skills/cli-external-orchestration/README.md:80 | 5 | The multi-mode tie-break rule appears after the dispatch examples it governs. | Move “When a request names several modes at once, the `tieBreak` order runs them as an `orderedBundle`” to immediately after the Step 2 heading at line 68, before the examples.
- [P2] .skilled/skills/cli-external-orchestration/README.md:88 | 7 | This paragraph packs the routing stages, bundle behavior, and ambiguity fallback into one block. | Convert its five sentences into a five-item numbered list, preserving their wording.

### .skilled/skills/cli-external-orchestration/ROUTER.md

- [P2] .skilled/skills/cli-external-orchestration/ROUTER.md:17 | 3 | The H1 is followed directly by the overview, with no 1–2 sentence hook. | Insert after the H1: “Use this router when a selected executor’s first-slice resources are unclear.”
- [P2] .skilled/skills/cli-external-orchestration/ROUTER.md:156 | 9 | “Moved here from `SKILL.md`” records authoring history in the body. | Replace the paragraph with: “The hub’s detailed routing prose lives here so the skill body can keep a short routing summary and a pointer to this file. This section is last, after the stage-two map above, and declares no map of its own: the `INTENT_SIGNALS` and `RESOURCE_MAP` block in section 3 remains the only replay source.”

### .skilled/skills/cli-external-orchestration/SKILL.md

- [P2] .skilled/skills/cli-external-orchestration/SKILL.md:14 | 3 | The intro runs through lines 14–18, exceeding the 1–2 sentence hook. | Keep line 14 as the hook; remove line 15 because Section 2 already states that routing chain; move line 16 under “Recursion Guards Stay Packet-Local” and line 18 under “Companion Metadata.”
- [P2] .skilled/skills/cli-external-orchestration/SKILL.md:201 | 9 | The escalation rule includes an authoring-history reference to `ADR-005`. | Replace the bullet with: “If the executor-delegation scorer resolves a delegation prompt to `cli-external-orchestration` rather than a real executor, report the silent-misroute failure instead of working around it.”

### .skilled/skills/cli-external-orchestration/shared/references/child-dispatch-preamble.md

- [P2] .skilled/skills/cli-external-orchestration/shared/references/child-dispatch-preamble.md:14 | 3 | The H1 is followed directly by the overview, with no 1–2 sentence hook. | Insert after the H1: “Use this preamble before dispatching a child that may reach a gate it cannot answer at runtime.”
- [P2] .skilled/skills/cli-external-orchestration/shared/references/child-dispatch-preamble.md:16 | 4 | The overview does not open with Purpose and When to Use; the use guidance appears later in Section 4. | Add `### Purpose` before the existing paragraph at lines 18–21, then add `### When to Use` and “Use it before dispatching a child whose instructions require an answer from a human” before Section 2.
- [P2] .skilled/skills/cli-external-orchestration/shared/references/child-dispatch-preamble.md:78 | 7 | The paragraph combines three pre-dispatch actions in prose. | Replace lines 78–80 with three numbered items: “Before dispatching, ask which gates the child will read”; “Pre-resolve every one that expects an answer from a human”; “Give the answer in the prompt rather than the permission to skip it, so the child proceeds on a decision you made rather than on its own judgment.”
- [P2] .skilled/skills/cli-external-orchestration/shared/references/child-dispatch-preamble.md:82 | 7 | The paragraph combines the interactive halt, child retry behavior, and retry limit. | Split it into three bullets covering those points, preserving the existing claims and wording.
- [P2] .skilled/skills/cli-external-orchestration/shared/references/child-dispatch-preamble.md:98 | 7 | The paragraph combines two verification actions with the exit-code warning. | Split the artifact check and transcript check into a two-item checklist; keep the exit-code contrast as prose.
