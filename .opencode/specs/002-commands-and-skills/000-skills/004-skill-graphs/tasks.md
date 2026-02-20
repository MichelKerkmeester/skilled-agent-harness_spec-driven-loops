# Task Tracking: Skill Graphs Integration

<!-- SPECKIT_LEVEL: 3+ -->

## Phase 1: Tooling & Setup
- [ ] TASK-101: Write `check-links.sh` bash script to regex match `\[\[(.*?)\]\]` recursively across all skill folders.
- [ ] TASK-102: Ensure script handles `.md` extension resolution and relative pathing automatically.

## Phase 2: Pilot Migration (`system-spec-kit`)
- [ ] TASK-201: Break down `system-spec-kit/SKILL.md` into primary MOCs/nodes.
- [ ] TASK-202: Write YAML frontmatter for each newly created file.
- [ ] TASK-203: Replace monolithic `SKILL.md` with a lightweight `index.md`.

## Phase 3: Broad Migration (All Other Skills)
- [ ] TASK-301: Convert `workflows-documentation` to a Skill Graph.
- [ ] TASK-302: Convert `workflows-code` (and its variants) to Skill Graphs.
- [ ] TASK-303: Convert `mcp-code-mode` to a Skill Graph.
- [ ] TASK-304: Convert `workflows-chrome-devtools` to a Skill Graph.
- [ ] TASK-305: Convert `workflows-git` to a Skill Graph.
- [ ] TASK-306: Convert `mcp-figma` to a Skill Graph.

## Phase 4: Verification
- [ ] TASK-401: Run `check-links.sh` globally and fix any broken paths.
- [ ] TASK-402: Run a dry-run prompt with an agent to verify progressive disclosure pathing across multiple skills.