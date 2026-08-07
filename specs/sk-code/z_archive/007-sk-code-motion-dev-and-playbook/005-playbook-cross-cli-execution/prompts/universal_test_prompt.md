# Universal Test Prompt Template (cross-CLI playbook execution)

## CONTRACT

When dispatched into any AI runtime via cli-codex, cli-gemini, or cli-opencode, this prompt asks the AI runtime to ANALYZE its own routing decision for a given user request - not to execute it.

## TEMPLATE (substitute {SCENARIO_ID} and {USER_PROMPT} per dispatch)

You are an AI assistant with access to the sk-code skill. A user has just sent the request below. Analyze how you would route this request - do NOT execute any actions.

SCENARIO: {SCENARIO_ID}
USER REQUEST: {USER_PROMPT}

For the request above, REPORT:
1. Run the skill-advisor probe (if available; otherwise infer the top-1 skill).
2. Detect the code surface (WEBFLOW / OPENCODE / UNKNOWN) per sk-code rules.
3. List exactly which references and assets you would load (verbatim relative paths under `.opencode/skills/sk-code/`).
4. Identify any agent dispatch (or "none" for read-only).
5. Provide the user-visible response you would give.

OUTPUT STRICTLY in this YAML format with no surrounding prose:

```yaml
scenario: {SCENARIO_ID}
advisor_top_1_skill: <name>
advisor_confidence: <float, 0-1>
advisor_gap_to_second: <float>
detected_surface: <WEBFLOW|OPENCODE|UNKNOWN|N/A>
references_loaded:
  - <path>
assets_loaded:
  - <path>
agent_dispatched: <name|none>
user_response: |
  <multi-line response>
notes: <any hedging or caveats>
```

DO NOT modify any file. DO NOT dispatch any agent. This is read-only routing analysis.
