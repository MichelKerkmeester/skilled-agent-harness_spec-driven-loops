---
round: 2
seat: seat-003
executor: deep-research-native
lens: research
vantage: native @deep-research (simulated)
status: ok
timestamp: 2026-05-06T13:31:00.000Z
simulated: true
score_pre_critique: 82
score_post_critique: 88
---

# Seat 003 — Research / native @deep-research (simulated)

## Distinct Mandate (Round 2)

Evidence-first. Enumerate ALL real dispatchers of `@multi-ai-council` via grep across `.opencode/`, `.claude/`, `.gemini/`, `.codex/`. Falsify or confirm round-1's "callers concentrated" assumption.

## Findings (Evidence-Grounded)

### Direct dispatchers and dispatch documenters

Per grep evidence:

- `.opencode/agents/orchestrate.md` (line 97, 192, 749) — `@orchestrate` LEAF-dispatches `@multi-ai-council`. **Not a `/spec_kit:*` command.**
- `.opencode/skills/cli-claude-code/SKILL.md` (line 32, 275), `references/agent_delegation.md` (lines 26, 68, 94, 111), `README.md` (line 55, 181), `manual_testing_playbook/04--agent-routing/004-*.md` — direct dispatch via `claude -p "..." --agent multi-ai-council` documented and tested.
- `.opencode/skills/cli-codex/SKILL.md`, `references/agent_delegation.md`, `manual_testing_playbook/`, `assets/prompt_templates.md` — Codex CLI direct dispatch documented.
- `.opencode/skills/cli-opencode/SKILL.md`, `references/agent_delegation.md`, `manual_testing_playbook/04--agent-routing/005-*.md`, `changelog/v1.1.0.0.md` — opencode CLI direct dispatch documented.
- `.opencode/skills/sk-doc/assets/agent_template.md` — referenced as template example.
- `.opencode/skills/system-spec-kit/references/multi-ai-council/` — folder-layout, state-format, seat-diversity-patterns, convergence-signals. Consumer-facing reference docs implying many callers.

### Falsification of round-1's central assumption

Round-1 stated: *"callers are concentrated (`/spec_kit:*` commands)"* — relied on by all three round-1 seats.

**FALSE per grep evidence.** Actual dispatchers include:
- (a) Top-level user via Task tool (Depth 0 default case)
- (b) `@orchestrate` agent (Depth 1, codified in agent body)
- (c) Direct CLI invocations documented in 3+ cli-skill manual_testing_playbooks (4 runtimes × ~1 playbook each)
- (d) **Zero current `/spec_kit:*` command YAMLs explicitly call `@multi-ai-council`** (grep of `.opencode/commands/` returned no hits)

The "concentrated to `/spec_kit:*`" assumption is empirically wrong — `/spec_kit:*` commands don't even dispatch the council currently.

### Implication for round-1 helper plan

Round-1 Step 3 ("wire helper into `/spec_kit:*` commands") is **necessary but insufficient**. The primary callers today are:
- Direct user Task dispatch (no orchestrator wrapper at all — caller is Claude Code itself)
- `@orchestrate` (no YAML wrapper)
- Manual CLI invocation in playbooks (no shared shell wrapper)

Helper MUST be invokable as a documented post-dispatch convention by Claude Code (or any AI assistant) directly, not only by `/spec_kit:*` YAMLs.

### Backward-compat / legacy artifacts

Verified packet 080 `scratch/` is empty. Round-1 plan does NOT specify whether older packets (e.g., 060 family, 077, 079) might have prior `@multi-ai-council` outputs in non-`ai-council/` locations.

**Open question**: should helper provide a `--migrate-legacy` mode? Probably not — packets are immutable history. §17 should explicitly say "applies forward-only; legacy outputs remain in original location."

### Round-1 unresolved Q1 (path-scoping verification)

Did NOT falsify or confirm in round 2. Defer to packet 081's investigation as round-1 specified. ✓

## Risks & Trade-offs

- Caller-enumeration in §17 expands documentation surface but is unavoidable given empirical dispatcher variety.
- "Forward-only" scope clarification simplifies helper but leaves legacy artifacts un-migrated (acceptable per immutable-history principle).

## Assumptions and Evidence Gaps

- **Assumption**: grep coverage of `.opencode/`, `.claude/`, `.gemini/`, `.codex/` is complete. **Evidence**: explicit grep run during deliberation.
- **Gap**: cannot enumerate user-side direct Task dispatches (those are runtime events, not file artifacts).

## Alternative Challenged

**"Trust round-1's caller-concentration assumption"** — challenged decisively. grep produced 8+ direct-dispatch references outside `/spec_kit:*`, plus zero current `/spec_kit:*` command YAMLs that actually dispatch the council. Round-1 was empirically wrong about its own central assumption.

## Confidence

**82/100** (pre-critique) → **88/100** (post-critique). Held high because findings are grep-verifiable and reproducible.

## Verdict

Round-1 direction CONFIRMED (option (b) is correct). Round-1 *implementation specification* needs amendment: Step 3 must include explicit caller-pattern enumeration (4 patterns minimum) and the helper must be standalone-invokable.
