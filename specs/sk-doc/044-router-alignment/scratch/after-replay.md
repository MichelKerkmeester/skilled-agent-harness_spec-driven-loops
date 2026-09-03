---
trigger_phrases: []
---
TASK | STAGE1_MODES | STAGE2_INTENTS | RES | MISSING | SCORES
--- | --- | --- | --- | --- | ---
create a skill for parsing our webhook payloads | sk-create-skill | SKILL_CREATION | 4 | 0 | sk-create-skill:4
build a parent hub skill with nested mode packets | sk-create-skill-parent | PARENT_HUB | 6 | 0 | sk-create-skill-parent:8
write a readme for the analytics service | sk-create-readme | README_CREATION | 2 | 0 | sk-create-readme:4
create an agent that reviews pull requests | sk-create-agent | AGENT_CREATION | 2 | 0 | sk-create-agent:4
create a slash command that runs the deploy script | sk-create-command | COMMAND_CREATION | 2 | 0 | sk-create-command:3
build a feature catalog for the billing module | sk-create-feature-catalog | FEATURE_CATALOG | 1 | 0 | sk-create-feature-catalog:4
author a manual testing playbook for the release | sk-create-manual-testing-playbook | PLAYBOOK | 1 | 0 | sk-create-manual-testing-playbook:8
create a benchmark for the new model | sk-create-benchmark | BENCHMARK | 3 | 0 | sk-create-benchmark:3
write the changelog for this release | sk-create-changelog | CHANGELOG | 1 | 0 | sk-create-changelog:3
produce a before and after document diff of the onboarding page | sk-create-diff | DIFF | 3 | 0 | sk-create-diff:3
draw an ascii flowchart of the signup flow | sk-create-diagram | FLOWCHART | 2 | 0 | sk-create-diagram:6
add a repo rule that bans force pushes | sk-create-repo-rule | REPO_RULE | 7 | 0 | sk-create-repo-rule:4
rewrite this page in human voice, it reads like ai wrote it | sk-create-quality-control+sk-create-with-human-voice | HVR | 4 | 0 | sk-create-quality-control:4 sk-create-with-human-voice:4
audit documentation quality of this reference and score it | sk-create-quality-control | DOC_QUALITY | 4 | 0 | sk-create-quality-control:12
score this document | sk-create-quality-control | DOC_QUALITY | 4 | 0 | sk-create-quality-control:8
validate the command template | sk-create-quality-control+sk-create-command | COMMAND_CREATION | 2 | 0 | sk-create-quality-control:4 sk-create-command:3
audit the agent file | sk-create-agent+sk-create-quality-control | AGENT_CREATION | 2 | 0 | sk-create-agent:4 sk-create-quality-control:4
check the feature catalog | sk-create-feature-catalog+sk-create-quality-control | FEATURE_CATALOG | 1 | 0 | sk-create-feature-catalog:4 sk-create-quality-control:4
audit the documentation quality of this README | sk-create-readme+sk-create-quality-control | DOC_QUALITY | 4 | 0 | sk-create-readme:4 sk-create-quality-control:4
hvr | sk-create-quality-control+sk-create-with-human-voice | HVR | 4 | 0 | sk-create-quality-control:4 sk-create-with-human-voice:4
optimize this doc for fewer tokens | sk-create-quality-control | OPTIMIZATION | 2 | 0 | sk-create-quality-control:8
show the full sk-doc toolkit | (none) | FULL_INVENTORY | 121 | 0 | 
write an install guide for getting our project running | sk-create-readme | INSTALL_GUIDE | 2 | 0 | sk-create-readme:8
create an agent-based rate limiter for the api | sk-create-agent | AGENT_CREATION | 2 | 0 | sk-create-agent:4
add a slash to the file path template | (none) | (none) | 0 | 0 | 
build a parent process supervisor | (none) | (none) | 0 | 0 | 
write a mode packet of C code | sk-create-skill-parent | PARENT_HUB | 6 | 0 | sk-create-skill-parent:4
review the hub router config for our load balancer | sk-create-quality-control | (none) | 0 | 0 | sk-create-quality-control:4
what does the presentation contract of our sales deck look like | sk-create-command | COMMAND_CREATION | 2 | 0 | sk-create-command:3
