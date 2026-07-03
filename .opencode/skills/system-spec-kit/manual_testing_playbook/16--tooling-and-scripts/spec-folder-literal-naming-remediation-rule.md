---
title: "PHASE-009 -- Spec-folder literal naming (remediation rule via SKILL.md rule 20)"
description: "Verify that external CLI agents presented with a deep-review FAIL verdict propose a remediation packet slug that names both the source (deep-review findings) and the specific target component, per system-spec-kit SKILL.md ALWAYS rule 20 added in Packet 012 REQ-006."
version: 3.6.0.6
---

# PHASE-009 -- Spec-folder literal naming (remediation rule via SKILL.md rule 20)

## 1. OVERVIEW

Packet 012 REQ-006 added ALWAYS rule 20 (REMEDIATION PACKET NAMING) to `system-spec-kit/SKILL.md`. Rule 20 requires that remediation packet slugs reference both the SOURCE of the findings (the deep-review verdict that triggered remediation) and the specific TARGET component being fixed. Bare names like `remediation`, `cleanup`, `phase-N`, `round-N`, or `review-remediation` are explicitly forbidden.

This scenario routes a synthetic deep-review FAIL verdict through multiple external CLI agents and checks whether each agent's proposed remediation slug honors rule 20. An agent that still returns a bare stoplist slug signals either a broken SKILL.md wiring or insufficient rule weight.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm external CLI agents name remediation packets with both a source token (origin of findings) and a target token (component being fixed) when SKILL.md rule 20 is active.
- Real user request: `An operator gives a CLI agent a deep-review FAIL verdict and asks for the remediation packet name. Verify the proposed slug references BOTH the source (deep-review findings) AND the target (the specific component being remediated), per system-spec-kit SKILL.md ALWAYS rule 20.`
- Prompt: See the canonical test prompt in §3.
- Expected execution process: Rotate the canonical prompt through at least 3 of the 4 supported CLIs; collect JSON responses; verify each proposed slug contains a source token and a target token per rule 20.
- Expected signals: `proposed_slug` matches `NNN-(fix|remediate|address|resolve)-<source-marker>-(p0|p1|p2|findings|verdict)-...-(for|in|on)-<target-component>`; `source_token` is non-empty and names the origin event; `target_token` is non-empty and names the specific component; `rule_20_self_audit` cites both portions.
- Desired user-visible outcome: A per-CLI verdict table with proposed slugs and PASS/PARTIAL/FAIL per CLI plus an aggregate verdict.
- Pass/fail: PASS if the slug includes both source and target tokens and the self-audit confirms. PARTIAL if one token (source OR target) is present but not both. FAIL if the slug matches the bare stoplist or the self-audit is missing.

---

## 3. TEST EXECUTION

### Phase 1 -- Setup

Confirm SKILL.md rule 20 is present before dispatching any CLI:

```bash
grep -F "REMEDIATION PACKET NAMING" \
  .opencode/skills/system-spec-kit/SKILL.md
```

Expected: at least 1 match. If the grep returns nothing, Packet 012 REQ-006 is not implemented; stop and fix before continuing.

Also confirm rule 20 references both source and target requirements:

```bash
grep -F "Literal naming for AI-derived" \
  .opencode/skills/system-spec-kit/SKILL.md
```

Expected: at least 1 match.

### Phase 2 -- Per-CLI invocations

Rotate the canonical prompt through at least 3 of the 4 CLIs below. Record each raw response.

#### Canonical test prompt

```
You are an AI coding agent connected to the system-spec-kit MCP. A deep-review just landed verdict=FAIL on the following packet:

  Reviewed packet: {example-arc}/{example-phase}/{example-leaf-packet}/
  Active P0 findings: 3 (broken ANCHOR pair in spec.md, missing handover.md fields, validate.sh --strict reports 2 errors)
  Active P1 findings: 5 (HVR violations across docs)

The operator asks you to create a remediation packet under
  .opencode/specs/{example-track}/{example-arc}/{example-phase}/

Per system-spec-kit/SKILL.md ALWAYS rule 20 (REMEDIATION PACKET NAMING), propose the next-available numbered slug.

Return ONLY a JSON object:
{
  "cli_name": "<your CLI identifier>",
  "proposed_slug": "NNN-<descriptive-slug>",
  "source_token": "<the part of the slug naming the source>",
  "target_token": "<the part of the slug naming the target>",
  "rule_20_self_audit": "<one sentence proving the slug references both source AND target>"
}

Do NOT execute create.sh. Return only the JSON.
```

#### cli-opencode

```bash
opencode run \
  --model "gpt-5.5" \
  -c model_reasoning_effort="high" \
  -c approval_policy=never \
  -c service_tier="fast" \
  --sandbox workspace-write \
  - <<'PROMPT'
You are an AI coding agent connected to the system-spec-kit MCP. A deep-review just landed verdict=FAIL on the following packet:

  Reviewed packet: {example-arc}/{example-phase}/{example-leaf-packet}/
  Active P0 findings: 3 (broken ANCHOR pair in spec.md, missing handover.md fields, validate.sh --strict reports 2 errors)
  Active P1 findings: 5 (HVR violations across docs)

The operator asks you to create a remediation packet under
  .opencode/specs/{example-track}/{example-arc}/{example-phase}/

Per system-spec-kit/SKILL.md ALWAYS rule 20 (REMEDIATION PACKET NAMING), propose the next-available numbered slug.

Return ONLY a JSON object:
{
  "cli_name": "cli-opencode",
  "proposed_slug": "NNN-<descriptive-slug>",
  "source_token": "<the part of the slug naming the source>",
  "target_token": "<the part of the slug naming the target>",
  "rule_20_self_audit": "<one sentence proving the slug references both source AND target>"
}

Do NOT execute create.sh. Return only the JSON.
PROMPT
```

#### cli-opencode (alternate invocation)

The `cli-opencode` block above is the primary dispatch path. For a second seat or parallel confirmation, reuse the same opencode invocation with a different reasoning effort:

```bash
opencode run \
  --model "gpt-5.5" \
  -c model_reasoning_effort="medium" \
  -c approval_policy=never \
  -c service_tier="fast" \
  --sandbox workspace-write \
  - <<'PROMPT'
You are an AI coding agent connected to the system-spec-kit MCP. A deep-review just landed verdict=FAIL on the following packet:

  Reviewed packet: {example-arc}/{example-phase}/{example-leaf-packet}/
  Active P0 findings: 3 (broken ANCHOR pair in spec.md, missing handover.md fields, validate.sh --strict reports 2 errors)
  Active P1 findings: 5 (HVR violations across docs)

The operator asks you to create a remediation packet under
  .opencode/specs/{example-track}/{example-arc}/{example-phase}/

Per system-spec-kit/SKILL.md ALWAYS rule 20 (REMEDIATION PACKET NAMING), propose the next-available numbered slug.

Return ONLY a JSON object:
{
  "cli_name": "cli-opencode",
  "proposed_slug": "NNN-<descriptive-slug>",
  "source_token": "<the part of the slug naming the source>",
  "target_token": "<the part of the slug naming the target>",
  "rule_20_self_audit": "<one sentence proving the slug references both source AND target>"
}

Do NOT execute create.sh. Return only the JSON.
PROMPT
```

#### cli-opencode

```bash
opencode run \
  --model "deepseek/deepseek-v4-pro" \
  --pure \
  --prompt "You are an AI coding agent connected to the system-spec-kit MCP. A deep-review just landed verdict=FAIL on packet {example-arc}/{example-phase}/{example-leaf-packet}/. P0 findings: 3 (broken ANCHOR pair, missing handover.md fields, validate.sh --strict errors). P1 findings: 5 (HVR violations). Per system-spec-kit/SKILL.md ALWAYS rule 20 (REMEDIATION PACKET NAMING), propose the next-available numbered slug under .opencode/specs/{example-track}/{example-arc}/{example-phase}/. Return ONLY JSON: { \"cli_name\": \"cli-opencode\", \"proposed_slug\": \"NNN-<slug>\", \"source_token\": \"<source>\", \"target_token\": \"<target>\", \"rule_20_self_audit\": \"<sentence>\" }. Do NOT execute create.sh." \
  </dev/null
```

#### cli-claude-code

```bash
claude -p "You are an AI coding agent connected to the system-spec-kit MCP. A deep-review just landed verdict=FAIL on packet {example-arc}/{example-phase}/{example-leaf-packet}/. P0 findings: 3. P1 findings: 5. Per system-spec-kit/SKILL.md ALWAYS rule 20 (REMEDIATION PACKET NAMING), propose the next-available numbered slug under .opencode/specs/{example-track}/{example-arc}/{example-phase}/. Return ONLY JSON: { \"cli_name\": \"cli-claude-code\", \"proposed_slug\": \"NNN-slug\", \"source_token\": \"source\", \"target_token\": \"target\", \"rule_20_self_audit\": \"sentence\" }. Do NOT execute create.sh." \
  --model "claude-sonnet-4-6" \
  --output-format json \
  --dangerously-skip-permissions
```

Note: when running inside a Claude Code session, `cli-claude-code` invocations via `claude` will be blocked by the self-invocation guard. This is expected behavior. Skip `cli-claude-code` and substitute another CLI from the rotation.

### Phase 3 -- Verification

For each CLI response, apply the pass/fail check:

1. Extract `proposed_slug`, `source_token`, `target_token`, and `rule_20_self_audit` from the returned JSON.
2. Confirm `source_token` is non-empty and identifies the origin event (e.g., `deep-review-p0`, `fix-deep-review-findings`, `verdict-fail`, `anchor-pair-failure`).
3. Confirm `target_token` is non-empty and names the specific component being fixed (e.g., `for-skill-local-benchmarks-format`, `for-004-bench-format-packet`, `in-spec-docs-anchor-validation`, `in-hvr-docs`).
4. Confirm the `proposed_slug` contains both the source portion and the target portion.
5. Confirm the slug does NOT match the bare stoplist: `remediation`, `cleanup`, `fix`, `phase-N`, `round-N`, `review-remediation` (as the entire slug body, without a specific component token).
6. Confirm `rule_20_self_audit` explicitly cites both portions.

### Expected

Per-CLI JSON response shape:

```json
{
  "cli_name": "cli-opencode",
  "proposed_slug": "005-fix-deep-review-p0-p1-findings-for-skill-local-benchmarks-format",
  "source_token": "deep-review-p0-p1-findings",
  "target_token": "for-skill-local-benchmarks-format",
  "rule_20_self_audit": "The slug names both the source (p0+p1 findings from the deep-review verdict) and the target (the specific 004-skill-local-benchmarks-format packet) per SKILL.md rule 20."
}
```

### Evidence

Setup command output:

```bash
grep -F "REMEDIATION PACKET NAMING" \
  .opencode/skills/system-spec-kit/SKILL.md
```

```text

```

Setup command output:

```bash
grep -F "Literal naming for AI-derived" \
  .opencode/skills/system-spec-kit/SKILL.md
```

```text
20. **Literal naming for AI-derived spec folders and phases** - When the AI (not the user) picks a spec-folder or phase slug, the name MUST describe the concrete work being built or fixed. Names must include a specific subject token (the component, behavior, or bug being addressed). Forbidden as standalone slugs: `remediation`, `cleanup`, `fix`, `phase-N`, `review-remediation`, `round-N`. Good remediation-packet examples: `fix-deep-review-p1-p2-findings-for-sk-doc-skill`, `harden-mcp-server-startup-races`, `fix-singleton-leak-in-launcher`. Good phase-decomposition examples: `data-model-design`, `api-implementation`, `ui-integration`. **Remediation-packet source/target rule** - remediation slugs MUST follow `NNN-fix-<source>-for-<target>` where: **Source** = the event or evidence that triggered the packet (e.g. `deep-review-p0-p1-findings`, `verdict-fail`, `audit-finding-NN`); **Target** = the specific component being remediated (e.g. `skill-local-benchmarks-format`, `mk-spec-memory-handler`, `launcher-cache`). The source names WHERE the work comes from; the target names WHAT is being fixed. Do not conflate them: the thing being remediated is the target, not the source. Worked example: `007-fix-deep-review-p0-p1-findings-for-skill-local-benchmarks-format` (source=`deep-review-p0-p1-findings`, target=`skill-local-benchmarks-format`). This rule is documentation-layer guidance; `validate.sh` does not lint slugs today (operator decision; may be lifted in a follow-on packet).
```

The Phase 1 precondition expected at least 1 match for `REMEDIATION PACKET NAMING`. The command returned no output, so Phase 2 CLI invocations were not run.

Summary table across CLIs tested:

```
| External CLI    | model            | proposed_slug                                                       | source_token              | target_token                          | verdict |
|-----------------|------------------|---------------------------------------------------------------------|---------------------------|---------------------------------------|---------|
| not run         | not run          | not run                                                             | not run                   | not run                               | BLOCKED |
```

Verbatim JSON responses from each CLI: not collected because the setup precondition failed before CLI dispatch.

### Pass / Fail

- **Pass**: Slug includes both source and target tokens AND `rule_20_self_audit` confirms both portions are named.
- **Partial**: Slug has one token (source OR target, not both) but is more specific than the bare stoplist.
- **Fail**: Slug is bare stoplist (`005-remediation`, `005-fix`, `005-cleanup`) or `rule_20_self_audit` is missing or empty.

Aggregate verdict:

- BLOCKED: Phase 1 setup command `grep -F "REMEDIATION PACKET NAMING" .opencode/skills/system-spec-kit/SKILL.md` returned no output, so the required precondition was missing and CLI rotation was not executed.

### Failure Triage

- If a CLI returns a bare stoplist slug: confirm rule 20 is surfaced to that CLI's session. Run `grep -F "Literal naming for AI-derived" .opencode/skills/system-spec-kit/SKILL.md` and expect at least 1 match. If the match is absent, the Packet 012 implementation is incomplete.
- If the rule is present but the CLI ignored it: the rule wording may have insufficient weight in the SKILL.md context. Flag this as a behavioral failure of the rule instruction and record it in the test report. Consider adding an explicit `ALWAYS:` enforcement prefix to rule 20 text in a follow-on packet.
- If `cli-claude-code` blocks with a self-invocation error: this is expected behavior. Record the error as expected and substitute another CLI from the rotation.
- If `cli-opencode` returns a direct-provider auth or quota error: verify the DeepSeek provider setup with `opencode providers list`, then rerun or substitute another configured direct provider.
- If the target component token is ambiguous (e.g., slug says `for-004-format` without naming the packet context): this is a PARTIAL, not a FAIL, as long as the target portion is distinct from a bare generic word.

---

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Originating spec packet: [012-literal-spec-folder-names](../../../../specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/004-literal-spec-folder-names/)

---

## 5. SOURCE METADATA

- Group: Phase System Features
- Playbook ID: PHASE-009
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `16--tooling-and-scripts/spec-folder-literal-naming-remediation-rule.md`
