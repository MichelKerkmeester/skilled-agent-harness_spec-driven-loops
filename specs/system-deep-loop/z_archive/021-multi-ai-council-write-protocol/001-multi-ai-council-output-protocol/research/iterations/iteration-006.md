# Iteration 6: Q6 four-runtime mirror-sync automation

## Focus

Answer Q6: determine whether four-runtime mirror-sync for `multi-ai-council` can be automated or checked at commit/test time, and decide whether packet 081 should add a general agent mirror checker or a narrow council-specific stopgap.

## Actions Taken

- Confirmed iteration number from `deep-research-state.jsonl`; five prior iteration records make this iteration 6.
- Read the strategy, findings registry, and iteration 5 narrative to preserve Q1-Q5 decisions and follow Section 11 Next Focus.
- Compared the four `multi-ai-council` runtime mirrors: `.opencode/agents/multi-ai-council.md`, `.claude/agents/multi-ai-council.md`, `.gemini/agents/multi-ai-council.md`, and `.codex/agents/multi-ai-council.toml`.
- Searched the repo for existing mirror/sync/parity patterns and inspected the deep-research contract parity test as the closest sibling pattern.
- Checked packet 080 council report and decision record for the maintenance constraint behind the mirror-sync question.

## Findings

### 1. Mirror-sync should mean normalized contract parity, not byte-for-byte equality

The live mirror files are not byte-identical: `.opencode/agents/multi-ai-council.md` is 689 LOC, `.claude/agents/multi-ai-council.md` is 687 LOC, `.gemini/agents/multi-ai-council.md` is 671 LOC, and `.codex/agents/multi-ai-council.toml` is 675 LOC.

The differences are expected in part. Gemini strips unsupported OpenCode frontmatter keys: the diff removes `mode`, the full `permission` block, and `mcpServers` from the top of `.gemini/agents/multi-ai-council.md`. Codex converts the body into TOML with `developer_instructions = '''...'''` and runtime fields such as `sandbox_mode = "read-only"`.

Concrete evidence:
- `.opencode/agents/multi-ai-council.md:1` starts with OpenCode frontmatter including permissions and MCP servers.
- `.gemini/agents/multi-ai-council.md:1` preserves only `name`, `description`, and `temperature` in frontmatter.
- `.codex/agents/multi-ai-council.toml:1` declares the converted agent and wraps the markdown body under `developer_instructions`.

The right check is therefore a normalizer that extracts the canonical instruction body and compares required sections, headings, and sentinel strings across runtime-specific wrappers. A raw SHA or full-file diff would create false positives.

### 2. A sibling parity-test pattern already exists, but it is stale and too specific

`.opencode/skills/system-spec-kit/scripts/tests/deep-research-contract-parity.vitest.ts` already encodes the broad pattern: define `runtimeMirrors` for `.opencode`, `.claude`, `.gemini`, and `.codex` at lines 35-40, then assert contract markers across each file at lines 59-72. It also asserts canonical path discipline for command assets at lines 87-108 and checks a runtime capability matrix at lines 111-124.

That is the right shape for Q6: a Vitest contract test catches drift at test time without promoting `multi-ai-council` into a dedicated skill. But the existing test is not copy-paste-ready. It imports `.opencode/skills/sk-deep-research/scripts/runtime-capabilities.cjs` at lines 12-15 and lists `.opencode/skills/sk-deep-research/...` primary docs at lines 25-32, while the live folder on disk is `.opencode/skills/deep-research/`. The pattern is reusable; the paths need a fresh, council-specific implementation or a cleaned-up generalized helper.

### 3. The repo currently documents mirroring as an expectation, not as an enforced invariant

`.codex/agents/README.txt:8` says agents are mirrored to `.claude/agents/`, `.gemini/agents/`, and `.codex/agents/`, and `.codex/agents/README.txt:21` lists `multi-ai-council` as one of the mirrored agents. Packet 080's council report also calls out the four-runtime mirroring cost: `.opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/ai-council/council-report.md:80` says to mirror to all four runtimes, while line 59 frames that cost as a reason to avoid heavier alternatives.

I did not find an existing general agent mirror-sync script in the searched system-spec-kit, command, and agent paths. The closest enforcement is the deep-research parity test, which is a targeted test, not a commit-time synchronizer.

### 4. Packet 081 should add a general checker if small, with a council-specific fallback

The best follow-on is a general `agent-mirror-contract` test/helper under `.opencode/skills/system-spec-kit/scripts/` or `.opencode/skills/system-spec-kit/scripts/tests/` that can be parameterized by agent name:

- Inputs: canonical `.opencode/agents/<name>.md`, mirror paths, required body headings, required marker strings, and allowed runtime wrapper differences.
- Normalization: strip YAML frontmatter for markdown mirrors, extract `developer_instructions` from Codex TOML, normalize line endings, and compare contract markers rather than full file bytes.
- Exit behavior: fail tests when a required mirror is missing, when required sections are absent, or when runtime-specific wrappers violate expected metadata.
- First fixture: `multi-ai-council`, because packet 080 already made mirror drift a concrete maintenance risk.

If that general helper is too much for packet 081, the stopgap should be a narrow `multi-ai-council-mirror-parity.vitest.ts` that follows the deep-research parity-test style and checks only the markers that matter for the council protocol:

- `## 0. ILLEGAL NESTING (HARD BLOCK)`
- `## 12. OUTPUT PROTOCOL - AI-COUNCIL ARTIFACTS`
- `## 13. INVOCATION CONTRACT - FIRST-CALL VS SUBSEQUENT VS RESUME`
- `## 14. STATE SCHEMA - JSONL EVENT TYPES`
- `## 15. CONVERGENCE SIGNAL - 2/3 AGREEMENT RULE`
- `ai-council-state.jsonl`
- `Reference: .opencode/skills/system-spec-kit/references/multi-ai-council/state-format.md`

This preserves ADR-001's lightweight bound because the invariant lives in the existing system-spec-kit test surface, not in a new `.opencode/skills/multi-ai-council/` package.

### 5. Commit-time automation is optional; test-time enforcement is enough for v1.1

A commit hook would catch drift earlier, but it creates more workflow surface and needs hook installation guarantees across local runtimes. Test-time enforcement is sufficient for v1.1 because packet 080 already uses Vitest regression coverage for council validator behavior, and follow-on packets can run the relevant system-spec-kit tests before claiming completion.

Packet 081 should therefore land a test-first guard. A hook can come later if mirror drift still occurs after the test exists.

## Questions Answered

- Q6 answered: yes, four-runtime mirror-sync can be checked at test time using a normalized contract-parity test. The best packet 081 shape is a small general agent mirror checker parameterized by agent name, with a narrow `multi-ai-council` parity test as the fallback if the general helper is too large.

## Questions Remaining

- Q7 remains: state.jsonl forward-compat / versioning policy should decide how v1.1 evolves council state without breaking existing packet 080 artifacts.
- Q8 remains: `/memory:save` council-completion anchoring still needs a separate decision.
- Q9 remains: ADD-1..ADD-6 risk mitigation should happen after Q7 and Q8 sharpen the operational contract.
- Q10 remains: lightweight-bound revisit conditions should be answered last, after the remaining maintenance costs are visible.

## Next Focus

Iteration 7 should answer Q7: define the `ai-council-state.jsonl` forward-compat strategy for v1.1, including whether to add versioned events, optional fields, schema evolution rules, and compatibility guidance for packet 080 artifacts.
