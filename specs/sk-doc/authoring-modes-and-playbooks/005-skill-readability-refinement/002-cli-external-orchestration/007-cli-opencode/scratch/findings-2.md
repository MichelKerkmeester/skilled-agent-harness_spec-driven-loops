### .skilled/skills/cli-external-orchestration/cli-opencode/references/destructive-scope-violations.md
- [P2] `destructive-scope-violations.md:167` | 7 | Layer 4 is a single ~200-word paragraph that packs the observed incident pairing, the model preference, a ~90-word verification caveat, the fallback condition, the Copilot concurrency cap and the sequencing instruction, so none of the five reads as its own instruction. | Split it into a two-sentence lead plus three labelled bullets, keeping every clause verbatim:

```markdown
The 2026-05-04 incident was specifically observed with `opencode-go/deepseek-v4-pro` under `/deep:review:auto`. Until a runtime scope guard ships (see §5), the cross-phase synthesis recommendation stands:

- **Preference**: for multi-phase deep-review work, prefer `cli-copilot` with `gpt-6-sol --reasoning-effort high` (verify `gpt-6-sol` availability on the Copilot surface. This slug is carried over from a gpt-5.5-era Copilot-catalog check and is NOT re-verified. `opencode models openai` on OpenCode 1 does not cover Copilot. If Copilot does not expose it, pick an available Copilot model rather than silently falling back to the risky default) when available.
- **Fallback**: fall back to the flash default `llmgateway/deepseek-v4.1-flash-1017` — the default on both OpenCode versions — only with Layers 1+2+3 all in place.
- **Concurrency**: memory feedback `feedback_copilot_concurrency_override.md` caps Copilot at 3 parallel dispatches. Sequence the work accordingly.
```

### .skilled/skills/cli-external-orchestration/cli-opencode/references/install-and-versions.md
- [P2] `install-and-versions.md:36` (also 55, 165, 167, 174, 215, 381, 426) | 2 | The validator returns eight `render_bare_url` warnings on these lines; each `https://opencode.ai/v2/docs/` is plain text outside a link target. | At each line wrap only the URL token: `https://opencode.ai/v2/docs/` → `[https://opencode.ai/v2/docs/](https://opencode.ai/v2/docs/)`, leaving the surrounding `[documented: …]` brackets, commas and table pipes untouched (line 55's cell becomes `| [https://opencode.ai/v2/docs/](https://opencode.ai/v2/docs/) | The official v2 install channels and the v2 platform docs |`).
- [P2] `install-and-versions.md:43` | 4 | The overview runs Purpose → Claim Labels → The Fact Behind Every Collision → When to Use, so When to Use is the fourth block rather than the second. | Move lines 43-48 (`### When to Use` and its four bullets) to directly after line 27, before `### Claim Labels`.
- [P2] `install-and-versions.md:27` | 3 | The Purpose ends with a contents pointer ("What follows is the layouts that work, the helper that builds them, and the facts that decide which version answers a bare `opencode`"), the pointer shape the rubric rules out and which §3 already supplies. | Delete that final sentence; the Purpose ends at "…both claim the name `opencode`."

### .skilled/skills/cli-external-orchestration/cli-opencode/references/integration-patterns.md
- [P2] `integration-patterns.md:24` | 4 | `## 1. OVERVIEW` opens with two unlabelled paragraphs and the use-case table; there is no Purpose or When to Use block. | Insert `### Purpose` and a blank line before line 24, and `### When to Use` and a blank line before line 26 (the paragraph introducing the three use cases); leave both paragraphs and the table unchanged beneath their new headings.
- [P1] `integration-patterns.md:269` | 2 | The decision tree renders wrong: `parallel words` is split across lines 273-274 and collides with `(OpenCode Copilot)`, the left branch has `|` where the right branch has `v` at line 276, and `+------+------+` at line 282 hangs off no column, so the four leaves cannot be traced to their labels. | Replace lines 269-289 with:

```text
[CALLING RUNTIME]   [PROMPT KEYWORDS]
        |               |
        |               +-- parallel words ......... USE CASE 2 (in-OpenCode parallel)
        |               +-- self-dispatch only ..... REFUSE (cycle — surface ADR-001 error)
        |
        +-- Anthropic (Claude Code) ............... USE CASE 1 (external to OpenCode)
        +-- Other (OpenCode Copilot)
              |
              v
        [PROJECT SUBSYSTEM NAMED?]
              +-- YES -> USE CASE 3 (cross-AI handback)
              +-- NO  -> USE CASE 1 (external to OpenCode)
```

- [P2] `integration-patterns.md:428` | 7 | One ~190-word paragraph carries the default, the PID-capture procedure, the group-kill caveat, the never-blanket-kill rule, the next-dispatch condition, the deep-flow exception and the cross-skill exception, so the kill procedure and its exceptions cannot be scanned. | Keep the bold lead-in on its own line, then split the remainder into bullets, preserving every clause verbatim:

```markdown
- **Default**: launch ONE cli-* dispatch at a time across the cli-* family (cli-opencode, cli-claude-code). Wait for the work to return, verify outputs exist.
- **Kill only the dispatch THIS skill started**: capture its PID at launch (`opencode run ... & OC_PID=$!`) and SIGKILL that captured PID directly plus its own orphan children (`kill -9 "$OC_PID" 2>/dev/null; pkill -9 -P "$OC_PID" 2>/dev/null`), then apply the same PID-scoped `gtimeout` / `positional_scoring_fallback:app` cleanup. (A backgrounded `opencode run &` is not a process-group leader, so a group kill would miss it. Kill the captured PID directly.)
- **Never blanket-kill**: never a blanket `pkill -9 -f "opencode run"` pattern (see Rule 5), which kills operator-owned sessions too.
- **Before the next dispatch**: only launch the next dispatch (this skill OR a sibling) after the prior one is dead and RSS has dropped.
- **Deep-flow session** (deep-review / deep-research): the operator authorizes the whole session at start, and iterations chain back-to-back with kill-between as the safety mechanism, NOT a per-iteration confirmation prompt.
- **Exception (cross-skill parallel)**: when the operator explicitly authorizes N parallel dispatches, run N concurrently, but still SIGKILL each by its own captured PID as its work returns.
```

- [P2] `integration-patterns.md:422` | 9 | "post-010 save gates" is a bare packet number in body prose; a reader cannot resolve which gates it names, and the operative claim is only that the same gates apply. | Replace `and post-010 save gates apply` with `and save gates apply`, giving: "The same JSON normalization (camelCase / snake_case aliases) and save gates apply."

### .skilled/skills/cli-external-orchestration/cli-opencode/references/opencode-tools.md
- [P1] `opencode-tools.md:23` | 1 | The overview lists the reference's own skill among the "sibling cli-* skills" it is contrasted against, so the contrast premise is false as written. | Replace `(cli-claude-code, cli-opencode)` with `(cli-claude-code, cli-codex)`.
- [P1] `opencode-tools.md:173` | 1 | The sibling comparison attributes `-p <profile>` to cli-opencode; that flag belongs to cli-codex (`cli-codex/references/agent-delegation.md:47`), and cli-opencode has no `-p` flag. | Replace ``cli-opencode's `-p <profile>` flag`` with ``cli-codex's `-p <profile>` flag``.
- [P2] `opencode-tools.md:23` | 4 | `## 1. OVERVIEW` opens with unlabelled contrast prose; there is no Purpose block and no When to Use block. | Insert `### Purpose` and a blank line before line 23, and after line 33 (before `**Verified versions.**`) insert:

```markdown
### When to Use

- A dispatch needs the project's plugin, skill or MCP runtime (§2)
- The task needs a parallel detached session (§3)
- The calling AI must parse a structured event stream instead of prose (§4)
- The dispatch must run as a named agent definition (§5)
- The dispatch must target another repository's runtime (§6)
```

- [P2] `opencode-tools.md:114` | 5 | The ADR-001 self-invocation gate that decides whether the `--port` dispatch is permitted at all sits after the `--port` command at lines 100-112, so a reader can copy and run the command before meeting its skip gate. | Move lines 114 (the "The skill's smart router gates this use case…" paragraph) and its blank line to directly before `### Invocation shape` at line 98.

### .skilled/skills/cli-external-orchestration/cli-opencode/references/permissions-matrix.md
- [P2] `permissions-matrix.md:17` | 3 | The intro is a bare topic list ("Structured permissions-matrix schema, resolution semantics, example matrices, RM-8 replay reasoning, and migration checklist…") that repeats the frontmatter description and the Purpose almost word for word and tells the reader nothing about when to open the file. | Replace line 17 with: "Open this before you hand-author a matrix or assume one is protecting a run: nothing in the dispatch path enforces it yet."
- [P2] `permissions-matrix.md:319` | 5 | The `**` glob smell warning is the trust rule that governs which broad shapes may be written, but it sits after the migration checklist that tells the reader to write those rules (line 307 even tells them to write allow rules first), so the rule arrives after the step it governs. | Move lines 319-340 (the whole `## 10. `**` GLOB SMELL WARNING` section) to directly before `## 9. MIGRATION CHECKLIST` at line 296, and swap the numbers: the moved heading becomes `## 9. `**` GLOB SMELL WARNING` and the checklist becomes `## 10. MIGRATION CHECKLIST`.
- [P2] `permissions-matrix.md:137` | 9 | "The packet updates only the relevant ALWAYS entry" is a note about the authoring packet, not about the matrix rule, and "the packet" has no resolvable referent for a reader. | Replace the cell with `Only the relevant ALWAYS entry is in scope.`

### .skilled/skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md
- [P2] `providers-and-models.md:23` | 4 | The overview opens with `### Core Principle`; there is no Purpose block, and Core Principle precedes the When to Use list the template puts after Purpose and When to Use. | Change line 23 to `### Purpose` and keep only its first sentence beneath it ("One place to answer "which provider, which model, which effort, how to dispatch" for cli-opencode."), then after the When to Use block (line 29) add `### Core Principle` holding the second sentence: "This mode is the multi-provider master, reaching more providers than any other cli mode."

### .skilled/skills/cli-external-orchestration/cli-opencode/references/self-invocation-guard.md
- clean
