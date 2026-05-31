---
title: "PHASE-009 -- Spec-folder literal naming (remediation rule via SKILL.md rule 20)"
description: "Verify that external CLI agents presented with a deep-review FAIL verdict propose a remediation packet slug that names both the source (deep-review findings) and the specific target component, per system-spec-kit SKILL.md ALWAYS rule 20 added in Packet 012 REQ-006."
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
- Expected execution process: Rotate the canonical prompt through at least 3 of the 5 supported CLIs; collect JSON responses; verify each proposed slug contains a source token and a target token per rule 20.
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

Rotate the canonical prompt through at least 3 of the 5 CLIs below. Record each raw response.

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

#### cli-codex

```bash
codex exec \
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
  "cli_name": "cli-codex",
  "proposed_slug": "NNN-<descriptive-slug>",
  "source_token": "<the part of the slug naming the source>",
  "target_token": "<the part of the slug naming the target>",
  "rule_20_self_audit": "<one sentence proving the slug references both source AND target>"
}

Do NOT execute create.sh. Return only the JSON.
PROMPT
```

#### cli-devin

Write the prompt to a temp file, then dispatch:

```bash
cat > /tmp/phase009-devin-prompt.txt <<'PROMPT'
You are an AI coding agent connected to the system-spec-kit MCP. A deep-review just landed verdict=FAIL on the following packet:

  Reviewed packet: {example-arc}/{example-phase}/{example-leaf-packet}/
  Active P0 findings: 3 (broken ANCHOR pair in spec.md, missing handover.md fields, validate.sh --strict reports 2 errors)
  Active P1 findings: 5 (HVR violations across docs)

The operator asks you to create a remediation packet under
  .opencode/specs/{example-track}/{example-arc}/{example-phase}/

Per system-spec-kit/SKILL.md ALWAYS rule 20 (REMEDIATION PACKET NAMING), propose the next-available numbered slug.

Return ONLY a JSON object:
{
  "cli_name": "cli-devin",
  "proposed_slug": "NNN-<descriptive-slug>",
  "source_token": "<the part of the slug naming the source>",
  "target_token": "<the part of the slug naming the target>",
  "rule_20_self_audit": "<one sentence proving the slug references both source AND target>"
}

Do NOT execute create.sh. Return only the JSON.
PROMPT

devin --prompt-file /tmp/phase009-devin-prompt.txt \
  --model swe-1.6 \
  --permission-mode auto \
  -p
```

#### cli-opencode

```bash
opencode run \
  --model "opencode-go/glm-5.1" \
  --pure \
  --prompt "You are an AI coding agent connected to the system-spec-kit MCP. A deep-review just landed verdict=FAIL on packet {example-arc}/{example-phase}/{example-leaf-packet}/. P0 findings: 3 (broken ANCHOR pair, missing handover.md fields, validate.sh --strict errors). P1 findings: 5 (HVR violations). Per system-spec-kit/SKILL.md ALWAYS rule 20 (REMEDIATION PACKET NAMING), propose the next-available numbered slug under .opencode/specs/{example-track}/{example-arc}/{example-phase}/. Return ONLY JSON: { \"cli_name\": \"cli-opencode\", \"proposed_slug\": \"NNN-<slug>\", \"source_token\": \"<source>\", \"target_token\": \"<target>\", \"rule_20_self_audit\": \"<sentence>\" }. Do NOT execute create.sh." \
  </dev/null
```

#### cli-gemini

Write the prompt to a temp file first, then dispatch with explicit stdin close (avoids the piped `$(cat)` wrapper race that hangs the dispatch):

```bash
PROMPT_FILE=/tmp/phase-009-gemini-prompt.md
cat > "$PROMPT_FILE" <<'PROMPT'
You are an AI coding agent connected to the system-spec-kit MCP. A deep-review just landed verdict=FAIL on the following packet:

  Reviewed packet: {example-arc}/{example-phase}/{example-leaf-packet}/
  Active P0 findings: 3 (broken ANCHOR pair in spec.md, missing handover.md fields, validate.sh --strict reports 2 errors)
  Active P1 findings: 5 (HVR violations across docs)

The operator asks you to create a remediation packet under .opencode/specs/{example-track}/{example-arc}/{example-phase}/

Per system-spec-kit/SKILL.md ALWAYS rule 20 (REMEDIATION PACKET NAMING), propose the next-available numbered slug.

Return ONLY a JSON object on a single line:
{"cli_name":"cli-gemini","proposed_slug":"NNN-<descriptive-slug>","source_token":"<the part of the slug naming the source>","target_token":"<the part of the slug naming the target>","rule_20_self_audit":"<one sentence proving the slug references both source AND target>"}

Do NOT execute create.sh. Return only the JSON.
PROMPT

gemini -p "$(cat "$PROMPT_FILE")" \
  --model "gemini-2.5-flash" \
  -y </dev/null > /tmp/phase-009-gemini.log 2>&1
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
  "cli_name": "cli-codex",
  "proposed_slug": "005-fix-deep-review-p0-p1-findings-for-skill-local-benchmarks-format",
  "source_token": "deep-review-p0-p1-findings",
  "target_token": "for-skill-local-benchmarks-format",
  "rule_20_self_audit": "The slug names both the source (p0+p1 findings from the deep-review verdict) and the target (the specific 004-skill-local-benchmarks-format packet) per SKILL.md rule 20."
}
```

### Evidence

Summary table across CLIs tested:

```
| External CLI    | model            | proposed_slug                                                       | source_token              | target_token                          | verdict |
|-----------------|------------------|---------------------------------------------------------------------|---------------------------|---------------------------------------|---------|
| cli-codex       | gpt-5.5 high     | 005-fix-deep-review-p0-p1-for-skill-local-benchmarks-format         | deep-review-p0-p1         | for-skill-local-benchmarks-format     | PASS    |
| cli-devin       | swe-1.6          | 005-remediate-verdict-fail-in-004-bench-format-spec-docs            | verdict-fail              | in-004-bench-format-spec-docs         | PASS    |
| cli-gemini      | gemini-2.5-flash | ...                                                                 | ...                       | ...                                   | ...     |
```

Include verbatim JSON responses from each CLI in the test report.

### Pass / Fail

- **Pass**: Slug includes both source and target tokens AND `rule_20_self_audit` confirms both portions are named.
- **Partial**: Slug has one token (source OR target, not both) but is more specific than the bare stoplist.
- **Fail**: Slug is bare stoplist (`005-remediation`, `005-fix`, `005-cleanup`) or `rule_20_self_audit` is missing or empty.

Aggregate verdict:

- PASS: 2 or more CLIs report PASS.
- PARTIAL: 1 CLI reports PASS and the others report PARTIAL.
- FAIL: 0 CLIs report PASS.

### Failure Triage

- If a CLI returns a bare stoplist slug: confirm rule 20 is surfaced to that CLI's session. Run `grep -F "Literal naming for AI-derived" .opencode/skills/system-spec-kit/SKILL.md` and expect at least 1 match. If the match is absent, the Packet 012 implementation is incomplete.
- If the rule is present but the CLI ignored it: the rule wording may have insufficient weight in the SKILL.md context. Flag this as a behavioral failure of the rule instruction and record it in the test report. Consider adding an explicit `ALWAYS:` enforcement prefix to rule 20 text in a follow-on packet.
- If `cli-claude-code` blocks with a self-invocation error: this is expected behavior. Record the error as expected and substitute another CLI from the rotation.
- If `cli-opencode` returns `401 Insufficient balance` for `opencode-go` models: check workspace credits with `opencode providers list`. Substitute `opencode-go/qwen3.6-plus` if GLM-5.1 is unavailable.
- If the target component token is ambiguous (e.g., slug says `for-004-format` without naming the packet context): this is a PARTIAL, not a FAIL, as long as the target portion is distinct from a bare generic word.

---

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Originating spec packet: [012-literal-spec-folder-names](../../../../specs/system-spec-kit/026-graph-and-context-optimization/012-literal-spec-folder-names/)

---

## 5. SOURCE METADATA

- Group: Phase System Features
- Playbook ID: PHASE-009
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `16--tooling-and-scripts/221-spec-folder-literal-naming-remediation-rule.md`
