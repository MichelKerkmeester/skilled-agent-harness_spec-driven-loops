Framework: RCAF

# Deep-Review Iteration 1 of 4 — Dimension: correctness

## ROLE

You are a senior code+spec reviewer auditing a shipped packet. Read-only intent. SWE-1.6 default model. Output one iter file per the contract below.

## CONTEXT

Scope under review (absolute path): `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/006-mcp-launcher-concurrency`
Repo root: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`
Scope relative path: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/006-mcp-launcher-concurrency`

**SCOPE TYPE: PHASE PARENT (lean trio).** Do NOT review individual phase children's code or heavy docs — they have their own dispatches. Focus on ARC-LEVEL invariants, cross-phase consistency, lean-trio doc quality, and arc changelog.

This iter focuses on the **correctness** dimension. Previous iter coverage: No prior iterations in this packet.

Anchor materials for a PHASE-PARENT review (read in order):
1. `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/006-mcp-launcher-concurrency/spec.md` — root spec; what the arc as a whole shipped + which children own which slice
2. `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/006-mcp-launcher-concurrency/description.json` — metadata, importance tier, derived state
3. `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/006-mcp-launcher-concurrency/graph-metadata.json` — manual + derived fields, last_active_child_id, parent_id
4. `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/006-mcp-launcher-concurrency/changelog/` — arc-level changelog (if present)
5. Each phase child spec.md ONLY (titles, REQs, status) for cross-phase consistency — do NOT walk the code under children:
   - `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/006-mcp-launcher-concurrency/001-concurrent-daemon-corruption-fix/spec.md`
   - `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/006-mcp-launcher-concurrency/002-cross-launcher-lease-propagation/spec.md`
   - `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/006-mcp-launcher-concurrency/003-launcher-race-and-error-surface-hardening/spec.md`
   - `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/006-mcp-launcher-concurrency/004-launcher-diagnostics-and-signal-coverage/spec.md`

What to look for at PHASE-PARENT level:
- Does the arc spec.md narrative match what each child claims to have shipped?
- Are cross-cutting invariants (single-writer lease, SQLite WAL, signal-handler parity) stated consistently in parent spec + the 4 children specs?
- Does `graph-metadata.json` carry the right `status` (lowercase), `last_active_child_id`, `parent_id`, and survive a save without getting stomped?
- Is `description.json` accurate (importance_tier, trigger_phrases)?
- Are children numbered consistently (001..004 with no gaps, no duplicates)?
- Are arc-level docs free of phase-specific narrative drift (per the rule that phase parents must not narrate consolidation history)?

EXPLICIT NON-GOALS for this dispatch:
- Do NOT open child code under `mcp_server/`, `scripts/`, `tests/` — each child has its own dispatch for that.
- Do NOT re-litigate individual REQs of any one child.

## ACTION (medium-density pre-planning)

Execute these 4 ordered steps. Each has acceptance criteria. Stop and emit the iter file when all 4 are satisfied OR when a P0 finding is surfaced and verified.

**Step 1.** Read the anchor materials in the order listed above. Build a mental model of what this scope shipped (or, for the phase parent, what invariants hold across the arc).
- Acceptance: you can name (a) specific REQ IDs or invariants in scope, and (b) the file paths or doc paths you opened.
- Verification: cite at least 2 REQ IDs or invariants and 2 file paths in your iter output's Findings or Notes section.

**Step 2.** Focus on the **correctness** dimension. Find issues specific to this dimension:
- correctness: race windows, error-surface mishandling, edge cases the spec didn't list, behavior under adversarial inputs
- security: secret handling, injection surfaces, privilege boundaries, file-path traversal, signal-handling for cleanup
- traceability: spec→code→test alignment, REQs without test coverage, tests without REQ anchors, evidence trails for claimed verifications
- maintainability: code clarity, duplication, hard-coded constants, missing documentation, drift between docs and code
- Acceptance: at least one file in scope has been opened and visually traced.
- Verification: cite file:line for any finding.

**Step 3.** Classify each finding as P0 / P1 / P2:
- P0 = blocker; the shipped work has a correctness or security defect that must be fixed before further work proceeds.
- P1 = required; a real gap or correctness issue, but workable around or non-blocking for the immediate goal.
- P2 = suggestion; hygiene, style, future-proofing, or low-impact polish.
- Acceptance: every finding has a severity tag.
- Verification: severity tags appear inline in the Findings section.

**Step 4.** Decide a verdict for this iter based on the findings:
- FAIL if any P0
- CONDITIONAL if any P1, no P0
- PASS otherwise (P2-only or no findings)
- Acceptance: one verdict line is emitted, exact format required by the output contract.

Bundle-gate: standard. Do not over-constrain with strict wording; produce direct findings.

## SEQUENTIAL-THINKING MANDATE

Before producing the iter output you MUST call the sequential_thinking MCP tool with at least 5 thoughts covering:
1. Which anchor files you'll read and in what order.
2. What you discovered from reading them.
3. Findings extracted with severity classification.
4. Cross-reference against any prior iter findings (avoid duplicates).
5. Final verdict and the rationale.

The recipe's allowed_tools include `mcp__sequential_thinking__*`. The MCP server is globally registered via `devin mcp add sequential_thinking`.

## OUTPUT FORMAT

Emit a single markdown file with this exact structure:

```markdown
# Iteration 1 — correctness

## Summary

<3–5 sentence overview of what you reviewed and what you found this iter.>

## Findings

### [P0] <one-line title>
- File: <path>:<line-range>
- Evidence: <quote or grep result>
- Impact: <what could break>
- Suggested fix: <concrete pointer>

### [P1] <one-line title>
...

### [P2] <one-line title>
...

(Omit severity sub-section if no findings of that severity.)

## Notes

<Any non-finding observations: dimension coverage status, areas not yet audited, cross-phase observations.>

Review verdict: <PASS|CONDITIONAL|FAIL>
```

The verdict line MUST be the LAST line of the file. Exact format. No trailing whitespace.

## CONSTRAINTS

- Read-only intent. Do NOT modify any file in the scope being reviewed.
- Write ONLY to the iter file path provided via stdout capture by the dispatcher.
- Stop at the verdict line. Do not summarize further.
