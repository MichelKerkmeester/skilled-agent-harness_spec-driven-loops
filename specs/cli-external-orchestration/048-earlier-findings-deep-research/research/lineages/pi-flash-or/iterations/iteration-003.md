# Iteration 003 — F2: Devin -p MCP rejection; per-tool allowlist vs dangerous

## Focus
Determine root cause of Devin non-interactive rejecting MCP tool calls under `auto`/`accept-edits` (`smart` unavailable), and whether a narrower per-tool/per-server MCP allowlist exists that avoids `--permission-mode dangerous`.

## Actions Taken
1. Read the local cli-devin reference docs (`cli-reference.md`) for permission modes + MCP.
2. Web-researched Devin's permission modes and MCP tool allowlisting.

## Findings

### Root cause
In Devin non-interactive (`devin -p`), a tool call that `requires confirmation` **cannot be answered** — there is no interactive prompt, so the call is rejected. The permission-mode baseline determines what is auto-approved:
- `auto` / normal: read-only tools auto-approved; edits, shell, network, and **MCP tools** prompt → in `-p` the prompt is unanswerable → rejected.
- `accept-edits`: adds workspace-edit auto-approval; **MCP tools still prompt** → still rejected.
- `smart`: would auto-run "safe" actions via a fast model but is **unavailable** on this install ("Smart permission mode is not available. Falling back to normal." — observed verbatim in vsn-019).
- `dangerous`: auto-approves **all** actions, including MCP tools → works (observed).

So the correct diagnosis is: **Devin has no built-in MCP-managed approval channel in `-p`**; the MCP tools are treated like any confirmation-requiring tool and are gated by the permission-mode baseline. `dangerous` is a **broad** auto-approve, not the intended way to grant MCP access.

### Bug vs expected
Mostly **expected** for `auto`/`accept-edits`/`smart-unavailable`: MCP tools are confirmation-gated by design and an unattended `-p` run cannot answer prompts. The gap is **documentation/contract**: the cli-devin skill's dispatch contract recommends `accept-edits` as the default, but for MCP-tool tasks the realistic non-interactive option is either the allowlist (below) or `dangerous`, and neither is surfaced as a distinct MCP-tool rule.

### The narrower per-tool/per-server MCP allowlist (root fix for F2)
Devin supports a **least-privileged permission allowlist** in config that pre-approves specific MCP tool calls without elevating everything:
```json
// .devin/config.json (shared) or .devin/config.local.json (machine-local/preferred)
{
  "permissions": {
    "allow": [
      "mcp__sk-vision__sk_vision_ocr",
      "mcp__sk-vision__sk_vision_inspect"
      // "mcp__sk-vision__*" = whole server; "mcp__*" = all MCP (high risk)
    ]
  }
}
```
Then run `devin -p "<task>"` in `auto`/`accept-edits` and the allowlisted MCP tools auto-approve. A matching `deny`/`ask` rule wins over `allow`, and enterprise/team policy can override local/project config. This is the **cleanest durable fix**: least privilege scoped to exactly the MCP tools the run needs, no `--permission-mode dangerous`.

### Cross-host generalization
This mirrors the broader pattern across all four hosts: **grant trust at tool/server scope, not by disabling all approval**. (Cursor: `--approve-mcps` / `mcp enable` / allowlist; Claude Code: tool approvals; Devin: `permissions.allow` with `mcp__server__tool`.) The sk-vision skill's contract should recommend the Devin MCP allowlist as the documented route for non-interactive MCP use, reserving `dangerous` for throwaway/isolated runners.

## Questions Answered
- Q: Is there a narrower Devin MCP allowlist? A: Yes — `permissions.allow` with `mcp__<server>__<tool>` entries avoids `dangerous`.
- Q: Is `smart` available? A: No — "Smart permission mode is not available" observed; falls back to normal.

## Questions Remaining
- None for F2 core; open: whether Devin MCP prefix is exactly `mcp__<server>__<tool>` on the installed version (community/`docs.devinai.cn/cli/reference/permissions` confirm this shape).

## Next Focus
Iteration 4: F3a — root cause of the 1-token moondream2 OCR/VQA truncation at the library layer.

## Ruled Out
- Relying on `--permission-mode smart` (unavailable on this install).
- `mcp__*` blanket allow (too broad; documented as high risk).

## Source Citations
- [SOURCE: web docs.devinai.cn/cli/reference/permissions]
- [SOURCE: web qiita.com/startdevin — devin -p non-interactive MCP]
- [SOURCE: file: scratch/run-2026-08-17/vsn-019-devin-status.log]
- [SOURCE: file: .opencode/skills/cli-external-orchestration/cli-devin/SKILL.md]
