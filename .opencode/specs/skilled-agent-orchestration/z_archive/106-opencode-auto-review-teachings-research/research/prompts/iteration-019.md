# Deep Research Iteration 019 of 20 — Synthesis: ranked teaching list + reject list

## SITUATION

You are running as **cli-devin SWE-1.6** in non-interactive print mode, dispatched as iteration 19 of a 20-iteration deep-research campaign on the upstream `dzianisv/opencode-plugins` `auto-review` package.

**Prior context (REQUIRED)**:
- Iters 007-015 documented all 15 mechanisms
- Iter 016 produced gap vs sk-code-review
- Iter 017 produced gap vs deep-* skills
- Iter 018 produced gap vs mk-* plugins + new-plugin hypothesis

**Why this iter exists**: this is the SYNTHESIS iter (just before final adjudication). You aggregate findings from iters 007-018 and produce two ranked tables:

1. **TEACHINGS** — patterns to adopt, ranked HIGH/MEDIUM/LOW impact, each row including: target skill/plugin + concrete implementation path (file:line) + adoption cost.
2. **REJECT LIST** — upstream choices we should NOT adopt, with rationale.

Iter 020 (final adjudication) consumes these tables to author `research/review-report.md`.

**Minimum acceptance**: 3 HIGH-impact teachings, 1 reject-list entry.

## TASK

### Step 1 — Aggregate findings from iters 007-018

For each mechanism, read iter outputs and pull the "adopt? / why?" rows.

```bash
for N in 007 008 009 010 011 012 013 014 015 016 017 018; do
  echo "=== iter-$N adoption rows ==="
  rg -A 30 'Reusable Patterns|Adopt|Cross-Skill Adoption|adoption|Recommendations' \
    .opencode/specs/skilled-agent-orchestration/106-opencode-auto-review-teachings-research/research/iterations/iteration-$N.md 2>/dev/null | head -40
done
```

### Step 2 — Build the TEACHINGS table (ranked by impact)

For every "adoptable pattern" identified in iters 007-018, place it in this table:

| Rank | Teaching | Mechanism (upstream) | Target (our codebase) | Impact | Adoption cost | Implementation path |
|------|----------|----------------------|----------------------|--------|---------------|---------------------|
| H-1 | <teaching name> | <upstream mechanism + file:line> | <local skill / plugin> | HIGH | LOW/MED/HIGH | <file:line where to make change + brief description> |
| H-2 | | | | HIGH | | |
| H-3 | | | | HIGH | | |
| M-1 | | | | MEDIUM | | |
| M-2 | | | | MEDIUM | | |
| L-1 | | | | LOW | | |
| ... | | | | | | |

Impact criteria:
- **HIGH**: Would close a real gap; clear value to multiple skills/plugins; user-visible improvement
- **MEDIUM**: Closes a gap but only affects one skill; modest improvement
- **LOW**: Nice-to-have; cosmetic or efficiency-only

Adoption cost criteria:
- **LOW**: <50 lines of code or <1 hour of doc edits
- **MEDIUM**: 50-200 lines OR cross-skill coordination
- **HIGH**: New plugin or major refactor

Order rows by impact (HIGH first), then by cost (LOW first within same impact).

### Step 3 — Build the REJECT LIST

For every upstream choice we should NOT adopt, fill:

| ID | Upstream pattern | Why reject | Notes |
|----|------------------|-----------|-------|
| R-1 | session.idle auto-fire across all runtimes | Claude Code, Codex, Gemini don't have a direct session.idle equivalent; porting requires runtime-specific adapters | applies only to OpenCode |
| R-2 | <pattern> | <reason> | |
| R-3 | <pattern> | <reason> | |

Minimum 1 entry; aim for 3.

### Step 4 — Identify the top 3 HIGH-impact teachings in depth

For each of the top 3 HIGH-impact teachings, provide a deeper write-up:

**H-1: <teaching name>**
- Mechanism: <description>
- Why HIGH impact: <specific value proposition>
- Implementation path: <which file to edit, which lines, what to add>
- Estimated effort: <X hours / Y LOC / Z PRs>
- Risk: <any risk to existing behavior>
- Verification: <how we'd test it works>

Repeat for H-2 and H-3.

### Step 5 — Note the remediation packet boundary

If the top 3 HIGH-impact teachings are coherent (e.g. all touch the same skill), recommend a single follow-on packet (e.g. `107-sk-code-review-auto-review-uplift`). If they span multiple skills, recommend either incremental folding-in OR a multi-phase packet structure.

## SCOPE

- All iter outputs 007-018
- Local repo for path resolution: `.opencode/skills/sk-code-review/`, `.opencode/skills/deep-*/`, `.opencode/plugins/mk-*.js`
- **No writes outside `research/iterations/iteration-019.md` and `research/deep-research-state.jsonl`**

## VERIFICATION COMMANDS

```bash
# Aggregate adoption rows
for N in 007 008 009 010 011 012 013 014 015 016 017 018; do
  echo "=== iter-$N ==="
  rg -A 30 'Adopt|adoption|Recommendations|Reject|Justification' \
    .opencode/specs/skilled-agent-orchestration/106-opencode-auto-review-teachings-research/research/iterations/iteration-$N.md 2>/dev/null
done
```

## CONSTRAINTS

- READ-ONLY.
- Every TEACHINGS row must have a concrete `file:line` implementation path in our codebase.
- Every REJECT row must have a reason rooted in real architectural differences (not just "we prefer X").
- The top 3 HIGH-impact teachings each get a deep write-up (Step 4).

## COMMON FAILURE MODES

1. **Vague impact assessment**: "would improve quality" is not a HIGH-impact justification. Be specific (e.g. "catches an entire class of regression that currently requires manual review").
2. **Over-promising adoption cost**: don't mark LOW if the change crosses skill boundaries or requires a new bridge.
3. **Missing the reject list**: at least 1 reject is REQUIRED. Zero rejects suggests insufficient critical thinking.

## OUTPUT FORMAT

Write to `research/iterations/iteration-019.md`:

```markdown
<!-- PINNED_UPSTREAM_SHA: <sha> -->

# Iteration 019 — Synthesis: ranked teaching list + reject list

## Summary
<2-4 sentence verdict on the teachings inventory + remediation-packet recommendation>

## Findings

### Aggregated Mechanism Inventory
| Mechanism | Documented in iter | Status across our codebase |
|-----------|-------------------|---------------------------|
| <15 mechanisms from iters 007-015> | | |

### TEACHINGS (ranked)
| Rank | Teaching | Mechanism | Target | Impact | Cost | Implementation path |
|------|----------|-----------|--------|--------|------|---------------------|
| H-1 | | | | HIGH | | |
| H-2 | | | | HIGH | | |
| H-3 | | | | HIGH | | |
| M-1 | | | | MEDIUM | | |
| M-2 | | | | MEDIUM | | |
| M-3 | | | | MEDIUM | | |
| L-1 | | | | LOW | | |
| L-2 | | | | LOW | | |
| L-3 | | | | LOW | | |

### REJECT LIST
| ID | Pattern | Why reject | Notes |
|----|---------|-----------|-------|
| R-1 | | | |
| R-2 | | | |
| R-3 | | | |

### Top-3 HIGH-Impact Deep Write-ups
#### H-1: <name>
- Mechanism: <verbatim or paraphrase>
- Why HIGH impact: <specific value prop>
- Implementation path: <file:line + change description>
- Estimated effort: <X hours / Y LOC>
- Risk: <any>
- Verification: <test plan>

#### H-2: <name>
<same template>

#### H-3: <name>
<same template>

### Remediation Packet Recommendation
<paragraph: open packet 107 (single coherent uplift) OR fold incrementally OR multi-phase packet structure>

## Convergence Signal
`newInfoRatio: <0.0-1.0>` — synthesis (low-medium since most info is from prior iters).
```

Then append to `research/deep-research-state.jsonl`:

```jsonl
{"type":"iteration","run":19,"focus":"synthesis: teachings + reject list","mechanismsExtracted":0,"gapsIdentified":0,"newInfoRatio":<0.0-1.0>,"executor":"cli-devin","model":"swe-1.6","pinnedSha":"<sha>","durationSec":<N>,"timestamp":"<ISO8601>"}
```

## ACCEPTANCE CRITERIA FOR THIS ITER

- [ ] Aggregated mechanism inventory table (15 rows)
- [ ] TEACHINGS table has ≥ 3 HIGH, ≥ 3 MEDIUM, ≥ 3 LOW rows
- [ ] Every TEACHINGS row has a concrete file:line implementation path
- [ ] REJECT LIST has ≥ 1 entry (target 3)
- [ ] Top-3 HIGH deep write-ups (each with mechanism, value prop, impl path, effort, risk, verification)
- [ ] Remediation packet recommendation paragraph
- [ ] Output file ≥ 150 lines

Begin.
