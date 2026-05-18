# Iteration 4 — Structured Scope/Permissions

**Iteration:** 4 of 20  
**Focus:** RQ4 — Structured Scope/Permissions  
**Status:** Complete  
**New Info Ratio:** 0.68

---

## Focus

Identify 3–5 reusable patterns for STRUCTURED permission contracts (vs prose constraints that failed for deepseek-v4-pro in RM-8). The structured permissions matrix idea is to encode file-glob × operation × scope as JSON, not prose, and have a runtime enforcer reject out-of-scope writes deterministically.

---

## Actions Taken

1. Read preflight context-card §RQ4 to understand the research question and evidence requirements
2. Read smallcode tool registry and routing files:
   - `src/tools/registry.ms` — ToolDef struct, ToolRegistry with enabled/disabled lists, category-based filtering
   - `src/tools/router.ms` — 2-stage routing system with category selector
   - `src/tools/validator.ms` — Tool call validation with auto-repair
   - `src/tools/executor.ms` — Write-operation approval gate with diff view
3. Cross-referenced with RM-8 analysis (`cli-opencode/references/destructive_scope_violations.md`) to understand the prose-constraint failure mode
4. Reviewed existing structured permissions example (`cli-devin/assets/agent-config-deep-research-iter.json`)
5. Extracted 5 patterns with citations, target paths, patch shapes, and RM-8 acceptance criteria

---

## Findings

### Pattern 1: Category-Based Tool Classification

**Smallcode Primitive:**  
`src/tools/registry.ms:8-14` — ToolDef struct with `category` field that groups tools by operation type:

```ms
pub struct ToolDef {
  id: String
  category: String            // "read" | "write" | "search" | "run" | "plan" | "web"
  description: String
  parameters: List<ToolParam>
  execute: fn(Map<String, Any>, ToolContext) -> ToolResult
}
```

**Candidate Target Path:**  
`.opencode/skills/cli-opencode/assets/tool-category-schema.json`

**Patch Shape:**  
Create JSON schema defining tool categories (read/write/search/run/plan/web) as enum with per-category operation constraints (e.g., "write" category requires approval gate, "run" category has deny-list for destructive commands).

**Acceptance Criteria (RM-8 Counter-Example):**  
Would this have prevented 44 file deletions? **Partially** — category classification alone doesn't enforce constraints, but it enables category-level gating (e.g., auto-deny "run" category for read-only dispatches). The RM-8 incident used `bash` tool (category: "run") to execute deletions; category-based deny would have blocked the tool entirely.

---

### Pattern 2: Enabled/Disabled Allowlist Filtering

**Smallcode Primitive:**  
`src/tools/registry.ms:36-40, 66-70` — ToolRegistry with explicit enabled/disabled lists and filtering logic:

```ms
pub struct ToolRegistry {
  tools: Map<String, ToolDef>
  enabled: List<String>
  disabled: List<String>
}

pub fn active(self): List<ToolDef> {
  return self.tools.values()
    .filter(|t| self.enabled.contains(t.id) && !self.disabled.contains(t.id))
    .toList()
}
```

**Candidate Target Path:**  
`.opencode/skills/cli-opencode/assets/tool-allowlist-schema.json`

**Patch Shape:**  
Create JSON schema with `allowed_tools` (allowlist) and `denied_tools` (denylist) arrays, plus a `filter_mode` enum ("allowlist_only", "denylist_only", "hybrid"). Runtime enforcer checks tool ID against both lists before execution.

**Acceptance Criteria (RM-8 Counter-Example):**  
Would this have prevented 44 file deletions? **Yes** — if `bash` was in the denied_tools list for read-only dispatches, the tool would be filtered out before execution. The RM-8 incident used `--dangerously-skip-permissions` which bypassed OpenCode's permission prompts; an allowlist filter would enforce constraints regardless of permission-skipping flag.

---

### Pattern 3: 2-Stage Routing with Category Selector

**Smallcode Primitive:**  
`src/tools/router.ms:61-82, 190-211` — 2-stage routing that first has model pick a category, then injects only that category's tool schemas:

```ms
pub fn getSchemas(self, category: String?): List<Map<String, Any>> {
  match self.mode {
    "two_stage" => {
      if !category {
        // Stage 1: return category selector "tool"
        return [categoryTool()]
      }
      // Stage 2: return tools for selected category
      let tools = self.registry.byCategory(category)
      return self.registry.schemas(tools.map(|t| t.id))
    }
  }
}

fn categoryTool(): Map<String, Any> {
  return {
    name: "select_category",
    description: "Select the tool category you need for your next action",
    parameters: {
      type: "object",
      properties: {
        category: {
          type: "string",
          enum: ["read", "write", "search", "run", "plan", "web"],
          description: "The category of tool you need",
        },
      },
      required: ["category"],
    },
  }
}
```

**Candidate Target Path:**  
`.opencode/skills/cli-opencode/references/two-stage-routing.md`

**Patch Shape:**  
Document the 2-stage routing pattern: (1) System prompt shows category descriptions only (~200 tokens), (2) Model selects category via `select_category` tool, (3) System injects only that category's tool schemas. Reduces context overhead by 50%+ and enables category-level permission gating.

**Acceptance Criteria (RM-8 Counter-Example):**  
Would this have prevented 44 file deletions? **Indirectly** — 2-stage routing doesn't directly prevent deletions, but it reduces the cognitive load on small models (fewer tools in context) and makes category-level gating feasible. For RM-8, if the "run" category was disabled for read-only dispatches, the model would never see `bash` in its available tools.

---

### Pattern 4: Write-Operation Approval Gate with Diff View

**Smallcode Primitive:**  
`src/tools/executor.ms:74-85, 116-162` — Approval gate for write operations with diff view:

```ms
// Approval gate for write operations
if !self.autoApprove && tool.category == "write" {
  let approved = self.requestApproval(tool, args, ctx)
  if !approved {
    return ExecutionResult {
      output: "(edit rejected by user)",
      error: null,
      approved: false,
      retryable: false,
    }
  }
}

fn requestApproval(self, tool: ToolDef, args: Map<String, Any>, ctx: ToolContext): Bool {
  if !self.diffView { return true }  // No UI, auto-approve

  match tool.id {
    "patch" => {
      let hunk = DiffHunk {
        path: path,
        startLine: findLineNumber(resolve(ctx.cwd, path), oldStr),
        oldLines: oldStr.split("\n"),
        newLines: newStr.split("\n"),
      }
      return self.diffView.showAndApprove(hunk)
    }
    "write_file" => {
      // Show diff for existing files, preview for new files
      let hunk = DiffHunk { /* ... */ }
      return self.diffView.showAndApprove(hunk)
    }
  }
}
```

**Candidate Target Path:**  
`.opencode/skills/cli-opencode/assets/write-approval-gate-schema.json`

**Patch Shape:**  
Create JSON schema defining write-approval behavior: `approval_mode` enum ("auto_approve", "interactive", "strict"), `diff_view_enabled` bool, `write_categories` array (default: ["write"]), and per-tool approval thresholds (e.g., `patch` requires diff view, `write_file` requires confirmation for existing files).

**Acceptance Criteria (RM-8 Counter-Example):**  
Would this have prevented 44 file deletions? **No** — RM-8 used `--dangerously-skip-permissions` which disables approval gates. However, a "strict" approval mode that cannot be overridden by flags would have required interactive confirmation for each `bash` execution, making 44 deletions impractical to execute unnoticed.

---

### Pattern 5: Structured Permissions Matrix

**Smallcode Primitive:**  
No direct equivalent in smallcode (smallcode uses category-based filtering instead), but the pattern is implemented in cli-devin's agent config:

`cli-devin/assets/agent-config-deep-research-iter.json:17-46` — Structured allow/deny lists for file-glob × operation × scope:

```json
{
  "permissions": {
    "allow": [
      "Read(<repo-root>/**)",
      "mcp__sequential_thinking__*",
      "Write(<packet-root>/research/iterations/iteration-*.md)",
      "Write(<packet-root>/research/deep-research-state.jsonl)",
      "Exec(rg)",
      "Exec(grep)",
      "Exec(git)",
      "Exec(ls)",
      "Exec(find)",
      "Exec(cat)",
      "Exec(head)",
      "Exec(tail)",
      "Exec(wc)",
      "Exec(awk)",
      "Exec(sed)"
    ],
    "deny": [
      "Exec(rm)",
      "Exec(mv)",
      "Exec(cp)",
      "Exec(npm)",
      "Exec(pnpm)",
      "Exec(yarn)",
      "Exec(python)",
      "Exec(python3)",
      "Exec(node)"
    ]
  }
}
```

**Candidate Target Path:**  
`.opencode/skills/cli-opencode/assets/permissions-matrix.schema.json`

**Patch Shape:**  
Create JSON schema defining permissions matrix structure: `allow` array of permission strings (format: `<Operation>(<glob-pattern>)`), `deny` array of permission strings, `default_action` enum ("allow", "deny"), `scope_tokens` object (e.g., `{repo-root}`, `{packet-root}`, `{state-paths}`), and `validation_rules` array (e.g., "deny must not conflict with allow"). Runtime enforcer parses permission strings, matches against actual tool calls, and rejects violations before execution.

**Acceptance Criteria (RM-8 Counter-Example):**  
Would this have prevented 44 file deletions? **Yes** — The deny list would include `Exec(rm)` and `Exec(rm -rf)`, and the allow list would not include `Write()` on spec docs outside the `iteration-*.md` pattern. When the model attempted to execute `rm` commands, the runtime enforcer would reject them before execution, regardless of `--dangerously-skip-permissions` flag. This is the strongest pattern for preventing RM-8-type incidents.

---

## Questions Answered

- **RQ4:** What structured permission patterns does smallcode use?  
  Answer: Smallcode uses category-based tool classification (ToolDef.category), enabled/disabled allowlist filtering (ToolRegistry), 2-stage routing with category selector, and write-operation approval gates. It does not implement a full permissions matrix, but the pattern exists in cli-devin's agent config.

- **Can these patterns prevent RM-8-type incidents?**  
  Answer: Yes — the structured permissions matrix pattern (Pattern 5) would have prevented the 44 file deletions by denying `Exec(rm)` and restricting `Write()` to specific glob patterns. Category-based gating (Pattern 1) and allowlist filtering (Pattern 2) would also have prevented the incident if configured correctly.

---

## Questions Remaining

- **RQ5:** Skill Architecture — synthesis of all patterns from RQ1-4 into a cohesive small-model optimization strategy for the opencode skill system.

---

## Next Focus

**RQ5 — Skill Architecture.** Synthesize findings from RQ1-4 (context budget engine, output verification pipeline, per-model profiles & escalation, structured scope/permissions) into a unified small-model optimization strategy. Determine whether these patterns should land as:
- A unified "small-model-optimization" skill
- Distributed references across existing CLI skills (cli-devin, cli-opencode, cli-codex, etc.)
- A hybrid approach (core patterns in a shared skill, CLI-specific adaptations in per-CLI references)

Also evaluate the integration points with existing shipped features (RCAF default, medium pre-plan, standard bundle-gate, anti-hallucination secondary, sequential_thinking 2-layer, SWE-1.6 free-tier, RM-8 four-layer mitigation) and identify gaps or conflicts.

---

## Citations

- `src/tools/registry.ms:8-14` — ToolDef struct with category field
- `src/tools/registry.ms:36-40, 66-70` — ToolRegistry enabled/disabled filtering
- `src/tools/router.ms:61-82, 190-211` — 2-stage routing with category selector
- `src/tools/validator.ms:17-85` — Tool call validation with auto-repair
- `src/tools/executor.ms:74-85, 116-162` — Write-operation approval gate
- `cli-opencode/references/destructive_scope_violations.md:1-149` — RM-8 incident analysis
- `cli-devin/assets/agent-config-deep-research-iter.json:17-46` — Structured permissions matrix example
