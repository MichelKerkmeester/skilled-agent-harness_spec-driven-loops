You are the deep-research LEAF agent, iteration 4 of 5, for an adversarial validation investigation. RESEARCH ONLY — never modify source code, never touch git, never run memory-DB writes. You MAY run read-only shell and read files. Cite every claim as file:line.

REPO ROOT: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public

## RESEARCH TOPIC
Validate the behavioral claims of the "skip-not-fail on live owner" fix to the substrate stress harness.
Primary sources:
- `.opencode/skills/system-spec-kit/mcp_server/stress_test/substrate/run-substrate-stress-harness.mjs`
- The code-index launcher `.opencode/bin/mk-code-index-launcher.cjs` (lease/maintainer/scan logic).

## PRIOR ITERATIONS (build on; do not repeat)
- Q1: crashes still FAIL except PID recycling (F-005).
- Q2: false-green guard fires; only PID recycling bypasses.
- Q3: TSV structure reproducible; pid values session-dependent; EPERM-locked TSV is a stale-pid hazard.

## THIS ITERATION'S FOCUS (Q4)
Claim: the ~1437 modified `graph-metadata.json` files are pre-existing working-tree state + the operator's maintainer-mode code-index daemon background rescans — NOT produced by the harness.

Investigate with file:line evidence:
1. Does the harness (`run-substrate-stress-harness.mjs`) have ANY code path that writes `graph-metadata.json`? Grep the harness and its imports for graph-metadata writes. Enumerate every file the harness writes (TSV, workload.json, stderr logs, iteration/delta state) and confirm none are graph-metadata.
2. In the skip-not-fail (live-owner) path, does the spawned child daemon ever reach a scan? Trace the code-index launcher: when the owner lease is held (`acquireOwnerLeaseFile` fails) and bridging is disabled, the launcher emits LEASE_HELD_BY and exits BEFORE `buildIfNeeded`/INDEX scan. Cite the launcher lines proving exit-before-scan.
3. So in an interactive session (operator daemon live), the harness child cannot scan → cannot write graph-metadata. Confirm.
4. Attribution: what DOES write graph-metadata.json across the tree? The operator's live code-index daemon in maintainer mode (background rescans) — independent of the harness. Cite the maintainer-mode / INDEX scan logic in the launcher.
5. Adversarial: is there ANY path where running the harness (in skip-not-fail mode) could trigger graph-metadata writes (e.g., the operator daemon reacting to the harness's own file writes under _sandbox or the packet)? Distinguish "harness directly writes" from "harness indirectly triggers operator daemon".

## KEY QUESTIONS (full set; lead on Q4)
- Q1 DONE. Q2 DONE. Q3 DONE. Q4 (focus): graph-metadata attribution. Q5: maintainer-mode leak sidestepped vs hidden.

## STATE FILES (relative to REPO ROOT)
- Config: .opencode/specs/system-spec-kit/037-substrate-skip-not-fail-validation/research/deep-research-config.json
- State Log: .opencode/specs/system-spec-kit/037-substrate-skip-not-fail-validation/research/deep-research-state.jsonl
- Strategy: .opencode/specs/system-spec-kit/037-substrate-skip-not-fail-validation/research/deep-research-strategy.md
- Registry: .opencode/specs/system-spec-kit/037-substrate-skip-not-fail-validation/research/deep-research-findings-registry.json

## CONSTRAINTS
- LEAF agent: no sub-agents. 3-5 actions, max 12 tool calls. Findings to files. Report only.

## OUTPUT CONTRACT — THREE artifacts (all REQUIRED)
1. Narrative at: .../research/iterations/iteration-004.md (headings: Focus, Actions Taken, Findings w/ file:line, Questions Answered, Questions Remaining, Next Focus).
2. APPEND single-line canonical record to State Log (newline-terminated), EXACT type:
   {"type":"iteration","iteration":4,"newInfoRatio":<0..1>,"status":"<insight|thought|error>","focus":"Q4 graph-metadata attribution","graphEvents":[]}
3. Delta file at: .../research/deltas/iter-004.jsonl — iteration record then per-finding/ruled_out records.

Begin now.
