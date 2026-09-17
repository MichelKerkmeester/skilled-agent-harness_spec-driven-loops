## Edit 1

File: `.skilled/commands/deep/assets/deep-agent-improvement-auto.yaml`

OLD:

~~~~text
user_inputs:
  target_path: "[TARGET_PATH] - Path to the agent .md file to evaluate. REQUIRED. Any file in .skilled/agents/*.md or .opencode/agents/*.md."
  target_profile: "[TARGET_PROFILE] - Profile ID: handover, context-prime, or dynamic. Auto-derived from target_path if not explicit."
~~~~

NEW:

~~~~text
user_inputs:
  target_path: "[TARGET_PATH] - Path to the agent .md file to evaluate. REQUIRED. Any file in .skilled/agents/*.md (or .opencode/agents/*.md)."
  target_profile: "[TARGET_PROFILE] - Profile ID: handover, context-prime, or dynamic. Auto-derived from target_path if not explicit."
~~~~
