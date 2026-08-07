# Iteration 051: Local context-first decision tree

## Focus
Adapted XCE's context-first steering idea into local Spec Kit rules while preserving read-first, Gate 3, Code Graph freshness, and Grep/Read verification constraints.

## Findings
1. Local rules already define a safer context-first sequence: parse request, read actual files/docs first, plan, validate, then execute; this maps to XCE-style context steering without letting context retrieval bypass local governance. [SOURCE: AGENTS.md:53-66]
2. Gate 3 remains the first hard blocker for file modifications: all file modifications require a spec folder, and write-action triggers must ask before analysis/tool calls unless the spec folder has already been supplied. A context-first tree must therefore branch on mutation intent before any broad exploration. [SOURCE: AGENTS.md:36-45] [SOURCE: AGENTS.md:38-40]
3. The local code-search decision tree already encodes the practical adaptation: exact token uses Grep, known path uses Glob, conceptual/structural search uses Code Graph plus Grep, and every hit is verified with Read. [SOURCE: AGENTS.md:78-106]
4. Code Graph should be used only as a freshness-gated structural source: its own skill defines readiness states and says read paths refuse stale/non-fresh answers rather than returning false-safe empty data. [SOURCE: .opencode/skills/system-code-graph/SKILL.md:14-29] [SOURCE: .opencode/skills/system-code-graph/SKILL.md:40-53]
5. When Code Graph is stale or unavailable during resume, local rules say to run bootstrap/scan when needed or fall back to Grep/Glob plus direct reads while keeping packet-local continuity as source of truth. This is the key safety adaptation of context-first steering. [SOURCE: AGENTS.md:110-119]
6. The resulting local decision tree is: (a) classify mutation vs read-only, (b) satisfy Gate 3 if mutation, (c) read state/spec/continuity first, (d) check Code Graph freshness for structural questions, (e) use Grep/Glob for exact/path discovery, (f) verify all retrieved context with Read before conclusions or edits. [INFERENCE: based on AGENTS.md:53-66, AGENTS.md:78-106, AGENTS.md:110-119, and .opencode/skills/system-code-graph/SKILL.md:14-29]
7. External XCE source could not be re-read in this workspace snapshot, so this iteration should not claim direct XCE README confirmation; it only adapts the already-scoped XCE context-first concept into local rules. [INFERENCE: based on failed Read/Glob attempts for `external/README.md`]

## Ruled Out
- A pure semantic-first workflow was ruled out because local rules route structural/code questions through Code Graph and still require Grep/Read verification. [SOURCE: AGENTS.md:78-106] [SOURCE: .opencode/skills/system-code-graph/SKILL.md:48-53]
- A context retrieval path before Gate 3 was ruled out for modification requests because Gate 3 is documented as a hard blocker before analysis/tool calls. [SOURCE: AGENTS.md:36-45]

## Dead Ends
- Do not present XCE-style context-first as an override of local read-first or spec-folder governance; it must be a steering layer inside those constraints. [SOURCE: AGENTS.md:24-26] [SOURCE: AGENTS.md:36-45]

## Edge Cases
- Ambiguous input: selected local policy adaptation, not external XCE reverse-engineering.
- Contradictory evidence: none.
- Missing dependencies: external XCE README unavailable; fallback used local governance and code-graph docs.
- Partial success: complete local decision-tree adaptation with missing external-source validation.

## Sources Consulted
- AGENTS.md:24-45
- AGENTS.md:53-119
- .opencode/skills/system-code-graph/SKILL.md:14-29
- .opencode/skills/system-code-graph/SKILL.md:40-53

## Assessment
- New information ratio: 0.71
- Questions addressed: context-first decision tree, read-first, Gate 3, Code Graph freshness, Grep/Read verification
- Questions answered: a safe local context-first tree is feasible only as governance-preserving routing, not as a replacement for gates

## Reflection
- What worked and why: grounding the tree in AGENTS and system-code-graph rules avoided inventing a new workflow.
- What did not work and why: the external XCE corpus was unavailable, so adaptation is based on local constraints and prior scoped concept only.
- What I would do differently: if the external corpus is restored, re-read XCE tool docs and compare each local branch to the original steering claims.

## Recommended Next Focus
Iteration 052 should use this tree to design a context-bundle workflow that records which source won each branch and why.
