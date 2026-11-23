---
id: claude-decision
trigger: {kind: manual}
runtime: {kind: cli-claude-code}
isolation: shared
sandbox: read-only
spec_folder: specs/demo/003-review
---
Review the open notes and ask before deleting any. CLAUDE-PROMPT-TEXT-91c2
STUB:decide=Delete the stale notes?
STUB:option=delete
STUB:option=keep
