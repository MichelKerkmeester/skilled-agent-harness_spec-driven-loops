## Edit 1

File: `.skilled/commands/deep/assets/deep-agent-improvement-confirm.yaml`

OLD:

~~~~text
user_inputs:
  target_path: "[TARGET_PATH] - Path to the agent .md file to evaluate. REQUIRED. Any file in .skilled/agents/*.md."
  target_profile: "[TARGET_PROFILE] - Profile ID: handover, context-prime, or dynamic. Auto-derived from target_path if not explicit."
~~~~

NEW:

~~~~text
user_inputs:
  target_path: "[TARGET_PATH] - Path to the agent .md file to evaluate. REQUIRED. Any file in .skilled/agents/*.md or .opencode/agents/*.md."
  target_profile: "[TARGET_PROFILE] - Profile ID: handover, context-prime, or dynamic. Auto-derived from target_path if not explicit."
~~~~

## Edit 2

File: `.skilled/commands/deep/assets/deep-agent-improvement-confirm.yaml`

OLD:

~~~~text
    target_path_must_exist: true
    target_path_must_be_agent: "Must match .skilled/agents/*.md pattern"

# ─────────────────────────────────────────────────────────────────
~~~~

NEW:

~~~~text
    target_path_must_exist: true
    target_path_must_be_agent: "Must match .skilled/agents/*.md or .opencode/agents/*.md pattern"

# ─────────────────────────────────────────────────────────────────
~~~~
