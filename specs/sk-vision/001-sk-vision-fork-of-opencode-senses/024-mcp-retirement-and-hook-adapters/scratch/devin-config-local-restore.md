# Restoring `.devin/config.local.json`

That file is excluded in `.git/info/exclude`, so git holds no copy and an edit to it
has no revert path. The two entries removed on 2026-09-11 were:

```json
"mcp__mk_spec_memory__*",
"mcp__mk_skill_advisor__*"
```

Both sat in `permissions.allow`, immediately after `"Exec(awk)"`. To restore, add them
back in that position. Neither server is registered in any runtime config, so the grants
were inert.
