# Failed Runs

> cli-cursor · doc · cursor · composer-2.5 · cursor

1 of 1 scenario(s) recorded a FAIL verdict.

## CU-026

| Field | Value |
|---|---|
| Hub | cli-cursor |
| Stage | git-preflight-advisory |
| Expected route | not recorded |
| Score | not recorded |
| Model | composer-2.5 (cursor) |

**Recorded reason.** hook registered directly (no Shell proxy); hook only accepts tool_name bash/exec, Cursor sends Shell -> silently no-ops, no advisory fires
