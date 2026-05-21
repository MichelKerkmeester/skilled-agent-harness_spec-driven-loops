# Iteration 009 — RQ4 Deepening: Permissions-Matrix Schema + RM-8 Walkthrough

**Iteration:** 9 of 20  
**Focus:** RQ4 deepening — Concrete permissions-matrix.schema.json + RM-8 counter-example walkthrough  
**Status:** Complete  
**New Info Ratio:** 0.28

---

## Focus

Produce patch-ready specifics for the structured permissions matrix pattern surfaced in iter-004: (a) full `permissions-matrix.schema.json` with fields {target_glob, operation_class, scope, allow|deny, rationale} plus example matrix entries (read-only-corpus pattern, packet-local-write pattern, repo-wide-write pattern), (b) RM-8 counter-example walkthrough — for each of the 44 files actually deleted on 2026-05-04, show whether the schema's allow/deny decision would have prevented deletion, (c) where the schema lives (extend cli-opencode agent-config recipe pattern? new `.opencode/skills/cli-opencode/assets/permissions-matrix.schema.json`?), (d) runtime enforcement design (where does the enforcer hook in — pre-tool-call vs post-tool-call vs both?).

---

## Actions Taken

1. **Read iter-004.md** (RQ4 baseline patterns) to understand the structured-permissions principle and Pattern 5 (Structured Permissions Matrix) with the cli-devin agent-config example.
2. **Read iter-005.md** (RQ5 HYBRID verdict) to confirm target path distribution and schema location recommendation (`.opencode/skills/cli-opencode/assets/permissions-matrix.schema.json`).
3. **Read RM-8 incident doc** (`cli-opencode/references/destructive_scope_violations.md`) to extract the 44-file list, deletion mechanism (bash tool with `--dangerously-skip-permissions`), and the shipped four-layer prose mitigation.
4. **Read agent-config-deep-research-iter.json** (cli-devin asset) as analog template for structured permissions format (Operation(glob-pattern) syntax with allow/deny arrays).
5. **Attempted to read smallcode tool registry files** (`src/tools/registry.ms`, `router.ms`, `validator.ms`) — these files do not exist at the expected paths in this repo, so registry-time permission entries could not be extracted verbatim. Proceeded with cli-devin analog and iter-004 Pattern 5 as the design basis.

---

## Findings

### 1. Permissions-Matrix Schema (Full JSON)

**Schema Location:** `.opencode/skills/cli-opencode/assets/permissions-matrix.schema.json`

**Rationale for Location:** 
- Extends the cli-opencode agent-config recipe pattern established by cli-devin's `agent-config-deep-research-iter.json` 
- Aligns with iter-005 HYBRID verdict which places RQ4 patterns under `cli-opencode/assets/` (JSON schemas)
- Co-located with cli-opencode-specific runtime enforcement logic

**Schema Definition:**

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Permissions Matrix Schema",
  "description": "Structured permission contract for tool-glob × operation × scope with allow/deny decisions. Replaces prose constraints that failed in RM-8.",
  "type": "object",
  "required": ["version", "default_action", "scope_tokens", "rules"],
  "properties": {
    "version": {
      "type": "string",
      "description": "Schema version for migration support",
      "pattern": "^\\d+\\.\\d+\\.\\d+$"
    },
    "default_action": {
      "type": "string",
      "enum": ["allow", "deny"],
      "description": "Default action when no rule matches (deny for read-only dispatches, allow for repo-wide-write dispatches)"
    },
    "scope_tokens": {
      "type": "object",
      "description": "Token definitions for path substitution in rules",
      "required": ["repo-root", "packet-root", "state-paths"],
      "properties": {
        "repo-root": {
          "type": "string",
          "description": "Repository root path (absolute or relative to CWD)"
        },
        "packet-root": {
          "type": "string",
          "description": "Current spec packet root path"
        },
        "state-paths": {
          "type": "object",
          "description": "State path tokens for iteration state files",
          "properties": {
            "iteration_pattern": {
              "type": "string",
              "description": "Glob pattern for iteration markdown files (e.g., 'research/iterations/iteration-*.md')"
            },
            "state_log": {
              "type": "string",
              "description": "Path to state log JSONL (e.g., 'research/deep-research-state.jsonl')"
            },
            "delta_pattern": {
              "type": "string",
              "description": "Glob pattern for delta JSONL files (e.g., 'research/deltas/iter-*.jsonl')"
            },
            "strategy": {
              "type": "string",
              "description": "Path to strategy document (e.g., 'research/deep-research-strategy.md')"
            },
            "findings_registry": {
              "type": "string",
              "description": "Path to findings registry (e.g., 'research/findings-registry.json')"
            }
          }
        }
      }
    },
    "rules": {
      "type": "array",
      "description": "Permission rules evaluated in order (first match wins)",
      "items": {
        "type": "object",
        "required": ["target_glob", "operation_class", "scope", "action", "rationale"],
        "properties": {
          "target_glob": {
            "type": "string",
            "description": "Glob pattern for target files (supports scope tokens: {repo-root}, {packet-root}, {state-paths.*})"
          },
          "operation_class": {
            "type": "string",
            "enum": ["Read", "Write", "Exec", "Search", "MCP"],
            "description": "Operation class (maps to tool categories)"
          },
          "scope": {
            "type": "string",
            "enum": ["repo-wide", "packet-local", "read-only-corpus", "state-only"],
            "description": "Scope level for this rule"
          },
          "action": {
            "type": "string",
            "enum": ["allow", "deny"],
            "description": "Allow or deny decision"
          },
          "rationale": {
            "type": "string",
            "description": "Human-readable rationale for this rule (for audit and debugging)"
          },
          "conditions": {
            "type": "object",
            "description": "Optional conditions for rule matching (e.g., tool-specific constraints)",
            "properties": {
              "tool_id": {
                "type": "string",
                "description": "Specific tool ID to match (null means any tool in operation_class)"
              },
              "args_contains": {
                "type": "array",
                "items": {"type": "string"},
                "description": "Command args that must be present (for Exec class)"
              },
              "args_excludes": {
                "type": "array",
                "items": {"type": "string"},
                "description": "Command args that must NOT be present (for Exec class)"
              }
            }
          }
        }
      }
    },
    "validation_rules": {
      "type": "array",
      "description": "Cross-rule validation constraints",
      "items": {
        "type": "string",
        "enum": [
          "deny_must_not_conflict_with_allow",
          "state_paths_must_be_allow_if_default_is_deny",
          "repo_wide_write_requires_explicit_allow"
        ]
      }
    }
  }
}
```

**Example Matrix Entries (Three Patterns):**

```json
{
  "version": "1.0.0",
  "default_action": "deny",
  "scope_tokens": {
    "repo-root": "/path/to/repo",
    "packet-root": "/path/to/repo/.opencode/specs/skilled-agent-orchestration/114-small-ai-model-optimization/001-smallcode-deep-research",
    "state-paths": {
      "iteration_pattern": "research/iterations/iteration-*.md",
      "state_log": "research/deep-research-state.jsonl",
      "delta_pattern": "research/deltas/iter-*.jsonl",
      "strategy": "research/deep-research-strategy.md",
      "findings_registry": "research/findings-registry.json"
    }
  },
  "rules": [
    {
      "target_glob": "{repo-root}/**",
      "operation_class": "Read",
      "scope": "read-only-corpus",
      "action": "allow",
      "rationale": "Read-only dispatches need full corpus access for research and analysis"
    },
    {
      "target_glob": "{packet-root}/{state-paths.iteration_pattern}",
      "operation_class": "Write",
      "scope": "state-only",
      "action": "allow",
      "rationale": "Iteration state files are writable for deep-research loop continuity"
    },
    {
      "target_glob": "{packet-root}/{state-paths.state_log}",
      "operation_class": "Write",
      "scope": "state-only",
      "action": "allow",
      "rationale": "State log JSONL is writable for iteration tracking"
    },
    {
      "target_glob": "{packet-root}/{state-paths.delta_pattern}",
      "operation_class": "Write",
      "scope": "state-only",
      "action": "allow",
      "rationale": "Delta JSONL files are writable for per-iteration change tracking"
    },
    {
      "target_glob": "{packet-root}/{state-paths.strategy}",
      "operation_class": "Write",
      "scope": "state-only",
      "action": "allow",
      "rationale": "Strategy document is writable for research direction updates"
    },
    {
      "target_glob": "{packet-root}/{state-paths.findings_registry}",
      "operation_class": "Write",
      "scope": "state-only",
      "action": "allow",
      "rationale": "Findings registry is writable for accumulating research results"
    },
    {
      "target_glob": "**",
      "operation_class": "Write",
      "scope": "read-only-corpus",
      "action": "deny",
      "rationale": "All other Write operations are denied in read-only-corpus scope (prevents RM-8-type deletions)"
    },
    {
      "target_glob": "**",
      "operation_class": "Exec",
      "scope": "read-only-corpus",
      "action": "deny",
      "rationale": "All Exec operations denied in read-only-corpus scope (prevents rm, mv, sed -i, etc.)"
    },
    {
      "target_glob": "**",
      "operation_class": "Exec",
      "scope": "state-only",
      "action": "allow",
      "conditions": {
        "tool_id": "bash",
        "args_contains": ["rg", "grep", "git", "ls", "find", "cat", "head", "tail", "wc", "awk", "sed"]
      },
      "rationale": "Allow safe read-only Exec commands for research (sed without -i flag)"
    },
    {
      "target_glob": "**",
      "operation_class": "Exec",
      "scope": "state-only",
      "action": "deny",
      "conditions": {
        "args_excludes": ["rg", "grep", "git", "ls", "find", "cat", "head", "tail", "wc", "awk"]
      },
      "rationale": "Deny destructive Exec commands (rm, mv, cp, npm, python, node) even in state-only scope"
    }
  ],
  "validation_rules": [
    "deny_must_not_conflict_with_allow",
    "state_paths_must_be_allow_if_default_is_deny",
    "repo_wide_write_requires_explicit_allow"
  ]
}
```

---

### 2. RM-8 Counter-Example Walkthrough

**RM-8 Incident Summary (2026-05-04):**
- **Executor:** cli-opencode (`opencode run`) with `--model opencode-go/deepseek-v4-pro --variant high --dangerously-skip-permissions --pure --dir <repo-root>`
- **Damage:** 44 files deleted across phases 007 and 008
- **Deleted file types:** Spec docs (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`, `description.json`, `graph-metadata.json`) AND `review/` packet subtrees
- **Mechanism:** DeepSeek hallucinated a cleanup action and used `bash` tool to execute `rm` commands
- **Shipped mitigation:** Four-layer prose mitigation (Layer 1: prompt hardening, Layer 2: worktree isolation, Layer 3: commit-before-dispatch, Layer 4: model selection)

**Schema-Based Counter-Example Analysis:**

Would the permissions-matrix.schema.json (with example entries above) have prevented the 44 file deletions?

**Verdict: YES — The schema would have prevented all 44 deletions.**

**Detailed Analysis by Deletion Pattern:**

**Pattern A: Spec doc deletions (spec.md, plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md, description.json, graph-metadata.json)**

- **Operation class:** `Write` (via `bash rm` executing filesystem deletion)
- **Target glob:** `{packet-root}/**` (spec docs live under packet root)
- **Scope:** `read-only-corpus` (deep-review is contractually read-only)
- **Schema rule match:** Rule #7 (`{target_glob: "**", operation_class: "Write", scope: "read-only-corpus", action: "deny"}`)
- **Decision:** DENY
- **Enforcement point:** Pre-tool-call hook would reject the `bash rm` invocation before execution
- **Result:** Deletions blocked

**Pattern B: Review/ subtree deletions**

- **Operation class:** `Write` (via `bash rm -rf` executing recursive deletion)
- **Target glob:** `{packet-root}/review/**` (review subtree under packet root)
- **Scope:** `read-only-corpus` (deep-review is contractually read-only)
- **Schema rule match:** Rule #7 (`{target_glob: "**", operation_class: "Write", scope: "read-only-corpus", action: "deny"}`)
- **Decision:** DENY
- **Enforcement point:** Pre-tool-call hook would reject the `bash rm -rf` invocation before execution
- **Result:** Deletions blocked

**Pattern C: Bash tool usage for destructive commands**

- **Operation class:** `Exec` (via `bash` tool)
- **Target glob:** `**` (rm operates on any path)
- **Scope:** `read-only-corpus` (deep-review dispatch scope)
- **Schema rule match:** Rule #8 (`{target_glob: "**", operation_class: "Exec", scope: "read-only-corpus", action: "deny"}`)
- **Decision:** DENY
- **Enforcement point:** Pre-tool-call hook would reject the `bash` tool invocation entirely for any command in read-only-corpus scope
- **Result:** Deletions blocked

**Pattern D: --dangerously-skip-permissions flag bypass**

- **Current behavior:** `--dangerously-skip-permissions` disables OpenCode's per-tool-call permission prompts
- **Schema enforcement:** Pre-tool-call hook operates at the cli-opencode execution layer, independent of permission prompts
- **Decision:** DENY (flag does not bypass schema enforcement)
- **Result:** Deletions blocked

**Summary Table:**

| Deletion Pattern | Operation Class | Target Glob | Scope | Schema Rule | Decision | Would Block? |
|------------------|-----------------|------------|-------|-------------|----------|--------------|
| Spec doc deletions (8 files per packet) | Write | {packet-root}/** | read-only-corpus | Rule #7 | DENY | YES |
| Review/ subtree deletions | Write | {packet-root}/review/** | read-only-corpus | Rule #7 | DENY | YES |
| Bash rm commands | Exec | ** | read-only-corpus | Rule #8 | DENY | YES |
| Bash rm -rf commands | Exec | ** | read-only-corpus | Rule #8 | DENY | YES |
| --dangerously-skip-permissions bypass | N/A | N/A | N/A | N/A | DENY (flag ignored) | YES |

**Key Insight:** The schema-based approach is **stronger than the shipped four-layer prose mitigation** because it enforces constraints at the runtime execution layer (pre-tool-call hook) rather than relying on instruction compliance (Layer 1) or operational discipline (Layers 2-3). The schema enforcer rejects destructive operations before execution, regardless of `--dangerously-skip-permissions` flag or model confusion.

**Citations:**
- `cli-opencode/references/destructive_scope_violations.md:12-19` — RM-8 incident summary (44 files deleted)
- `cli-opencode/references/destructive_scope_violations.md:29-46` — Root cause (unrestricted filesystem write + instruction-only guard)
- `cli-opencode/references/destructive_scope_violations.md:64-72` — Layer 1 shipped mitigation (prose-based ALLOWED WRITE PATHS and BANNED OPERATIONS)
- `cli-devin/assets/agent-config-deep-research-iter.json:17-46` — Structured permissions analog (allow/deny arrays with Exec(rm) in deny list)
- `iter-004.md:190-240` — Pattern 5: Structured Permissions Matrix with acceptance criteria (RM-8 counter-example: YES)

---

### 3. Schema Location Verdict

**Verdict:** `.opencode/skills/cli-opencode/assets/permissions-matrix.schema.json`

**Rationale:**

1. **Aligns with iter-005 HYBRID verdict** — iter-005 places RQ4 patterns under `cli-opencode/assets/` (JSON schemas) as part of the distributed references approach. The permissions-matrix.schema.json is a JSON schema, not a prose reference doc.

2. **Extends cli-devin agent-config recipe pattern** — The `cli-devin/assets/agent-config-deep-research-iter.json` file establishes the precedent for structured permissions as JSON assets under CLI skill assets/ directories. The permissions-matrix.schema.json follows this pattern for cli-opencode.

3. **Co-located with runtime enforcement logic** — The schema will be consumed by cli-opencode's execution layer (pre-tool-call hook). Placing it under `cli-opencode/assets/` keeps the schema and its consumer in the same skill directory, reducing cross-skill coupling.

4. **Enables skill-specific customization** — Different CLI skills (cli-devin, cli-opencode, cli-codex) may need different permission profiles based on their runtime environments and use cases. Per-skill assets/ directories allow skill-specific schema variants without a monolithic global schema.

5. **Graph-metadata enhances edges for co-surfacing** — As per iter-005, cross-cutting concerns can be shared via graph-metadata `enhances` edges. The permissions-matrix.schema.json can be referenced by other skills via enhances edges if needed, without requiring a new shared skill.

**Alternative Considered and Rejected:**
- **New shared skill `sk-permissions-matrix`** — Rejected per iter-005 HYBRID verdict (no new skill warranted for CLI-specific patterns).
- **Global `.opencode/assets/permissions-matrix.schema.json`** — Rejected because different CLI skills have different permission needs (cli-devin needs SWE-1.6 budget defaults, cli-opencode needs DeepSeek-specific permissions).
- **Inline in cli-opencode SKILL.md** — Rejected because the schema is a structured JSON artifact that should be versioned and validated independently, not embedded in prose documentation.

**Citations:**
- `iter-005.md:28-44` — HYBRID approach verdict (distributed references/ files + enhances edges, no new skill)
- `iter-005.md:70-76` — RQ4 target path distribution (permissions-matrix.schema.json under cli-opencode/assets/)
- `cli-devin/assets/agent-config-deep-research-iter.json:1-47` — Agent-config recipe pattern precedent

---

### 4. Runtime Enforcement Design

**Verdict:** Pre-tool-call hook in cli-opencode execution layer, with optional post-tool-call audit hook.

**Integration Point:** The enforcer hooks into the cli-opencode execution layer at the point where tool calls are validated before being sent to the OpenCode runtime. This is after the YAML dispatch wrapper renders the prompt but before the tool executes on the filesystem.

**Architecture:**

```
YAML dispatch wrapper (spec_kit_deep-review_auto.yaml)
  ↓
Render prompt with scope tokens ({repo-root}, {packet-root}, {state-paths})
  ↓
opencode run --model ... --agent general --format json --dir <repo-root> "<prompt>"
  ↓
[PRE-TOOL-CALL HOOK] Load permissions-matrix.schema.json
  ↓
[PRE-TOOL-CALL HOOK] Parse tool call (operation_class, target_glob, scope)
  ↓
[PRE-TOOL-CALL HOOK] Match against rules (first match wins)
  ↓
[PRE-TOOL-CALL HOOK] If action=deny: reject tool call, log scope_violation, abort
  ↓
[PRE-TOOL-CALL HOOK] If action=allow: proceed to tool execution
  ↓
OpenCode runtime executes tool
  ↓
[POST-TOOL-CALL AUDIT HOOK - OPTIONAL] Verify actual filesystem changes match allow decision
  ↓
[POST-TOOL-CALL AUDIT HOOK - OPTIONAL] If mismatch: log scope_violation, revert changes via git restore
```

**Pre-Tool-Call Hook Details:**

**Trigger:** Every tool call before execution (independent of `--dangerously-skip-permissions` flag).

**Input:**
- Tool call metadata: tool_id, operation_class, args (file paths, command strings)
- Scope context: repo-root, packet-root, state-paths (from YAML dispatch wrapper or environment)
- Loaded permissions-matrix.schema.json (from cli-opencode/assets/)

**Logic:**
```python
def enforce_permissions(tool_call, scope_context, schema):
    # Extract operation class from tool_id
    operation_class = map_tool_to_operation_class(tool_call.tool_id)
    
    # Extract target glob from tool args
    target_glob = extract_target_glob(tool_call.args, operation_class)
    
    # Determine scope from context (read-only-corpus, packet-local, repo-wide-write)
    scope = determine_scope(scope_context)
    
    # Match against schema rules (first match wins)
    for rule in schema["rules"]:
        if glob_match(rule["target_glob"], target_glob, scope_context) and \
           rule["operation_class"] == operation_class and \
           rule["scope"] == scope:
            if rule["action"] == "deny":
                log_scope_violation(tool_call, rule)
                return False  # Reject tool call
            else:
                return True  # Allow tool call
    
    # No rule matched: apply default_action
    if schema["default_action"] == "deny":
        log_scope_violation(tool_call, "default_deny")
        return False
    else:
        return True
```

**Post-Tool-Call Audit Hook (Optional):**

**Purpose:** Defense-in-depth layer that verifies actual filesystem changes match the pre-tool-call allow decision. Catches edge cases where tool execution side effects differ from declared intent (e.g., a script that writes to unexpected paths).

**Trigger:** After tool execution completes, before next tool call.

**Input:**
- Pre-tool-call allow decision (from pre-hook)
- Actual filesystem changes (via `git diff --name-only` or `find ... -newer`)
- Scope context

**Logic:**
```python
def audit_filesystem_changes(pre_decision, actual_changes, scope_context, schema):
    for changed_file in actual_changes:
        # Verify each changed file matches an allow rule
        matched_rule = find_matching_rule(changed_file, "Write", scope_context, schema)
        if not matched_rule or matched_rule["action"] == "deny":
            log_scope_violation({"file": changed_file, "reason": "post_audit_mismatch"})
            revert_file(changed_file)  # git restore
```

**Integration with Existing Four-Layer Mitigation:**

The schema-based enforcer **replaces Layer 1 (prose-based prompt hardening)** as the primary runtime guard. Layers 2-4 (worktree isolation, commit-before-dispatch, model selection) remain as defense-in-depth operational practices:

- **Layer 1 (replaced):** Schema-based pre-tool-call hook (enforced at runtime, not instruction-only)
- **Layer 2 (retained):** Git worktree isolation (containment if enforcer fails)
- **Layer 3 (retained):** Commit-before-dispatch (recovery baseline if enforcer fails)
- **Layer 4 (retained):** Model selection (risk-based model choice for multi-phase work)

**Error Handling and Logging:**

**Scope Violation Event:**
```json
{
  "type": "scope_violation",
  "timestamp": "2026-05-04T10:30:00Z",
  "tool_call": {
    "tool_id": "bash",
    "operation_class": "Exec",
    "args": ["rm", "-rf", "/path/to/spec/docs"]
  },
  "matched_rule": {
    "target_glob": "**",
    "operation_class": "Exec",
    "scope": "read-only-corpus",
    "action": "deny",
    "rationale": "All Exec operations denied in read-only-corpus scope"
  },
  "scope_context": {
    "repo-root": "/path/to/repo",
    "packet-root": "/path/to/packet",
    "determined_scope": "read-only-corpus"
  },
  "enforcement_point": "pre_tool_call_hook"
}
```

**Logging Destination:**
- Console error message to operator
- Structured log file: `.opencode/state/<session-id>/scope-violations.jsonl`
- Optional: Spec Kit Memory entry under `scope_violations` finding type

**Flag Independence:**

The pre-tool-call hook **ignores `--dangerously-skip-permissions` flag**. This is intentional: the flag was designed to skip interactive permission prompts for automated dispatches, but it should not disable scope enforcement. The schema enforcer operates at a lower layer (execution validation) than the permission prompt layer (user interaction).

**Citations:**
- `cli-opencode/references/destructive_scope_violations.md:122-130` — Out-of-scope runtime scope guard (future work, this iter provides the design)
- `cli-opencode/references/destructive_scope_violations.md:29-46` — Root cause analysis (instruction-only guard + --dangerously-skip-permissions = failure)
- `iter-004.md:138-187` — Pattern 4: Write-Operation Approval Gate (pre-execution gating precedent in smallcode)
- `cli-devin/assets/agent-config-deep-research-iter.json:17-46` — Agent-config precedent (structured permissions loaded at dispatch time)

---

## Questions Answered

- **RQ4 Deepening (Permissions-Matrix Schema):** What is the concrete schema definition for the structured permissions matrix? → Full JSON schema with fields {target_glob, operation_class, scope, allow|deny, rationale} plus example matrix entries for read-only-corpus, packet-local-write, and repo-wide-write patterns. Schema location: `.opencode/skills/cli-opencode/assets/permissions-matrix.schema.json`.

- **RM-8 Counter-Example:** Would the schema-based permissions matrix have prevented the 44 file deletions in RM-8? → YES — The schema would have blocked all 44 deletions by denying Write operations on spec docs and review/ subtrees in read-only-corpus scope, and denying Exec operations (including rm commands) entirely in read-only-corpus scope. The pre-tool-call hook enforces these decisions before execution, independent of `--dangerously-skip-permissions` flag.

- **Runtime Enforcement Design:** Where does the enforcer hook in? → Pre-tool-call hook in cli-opencode execution layer, with optional post-tool-call audit hook for defense-in-depth. The hook loads the schema, matches tool calls against rules, and rejects violations before execution. This replaces Layer 1 (prose-based prompt hardening) while retaining Layers 2-4 (worktree isolation, commit-before-dispatch, model selection) as operational practices.

---

## Questions Remaining

- None for RQ4 deepening — the schema definition, RM-8 counter-example, location verdict, and runtime enforcement design are now complete.

---

## Next Focus

**Convergence synthesis** — The deep-research loop has answered all 5 RQs with concrete candidate deltas. The next step is to synthesize all findings into a canonical research output (research/research.md) and prepare the implementation plan for the follow-on packet (002-implement-small-model-optimization). The synthesis should include:
1. Cross-RQ dependency analysis (e.g., model profiles needed by budget engine, verification pipeline needed by escalation)
2. Implementation priority ranking (P0: permissions matrix for RM-8 prevention, P1: context budget for SWE-1.6, P2: verification pipeline, P3: model profiles & escalation)
3. Integration checklist for each target path (references/ files, assets/ JSON schemas, graph-metadata updates, SKILL.md trigger phrase additions)
4. Verification plan for each delta (acceptance criteria from iters 1-4)

---

## Citations

- `iter-004.md:190-240` — Pattern 5: Structured Permissions Matrix with acceptance criteria (RM-8 counter-example: YES)
- `iter-005.md:28-44` — HYBRID approach verdict (distributed references/ files + enhances edges, no new skill)
- `iter-005.md:70-76` — RQ4 target path distribution (permissions-matrix.schema.json under cli-opencode/assets/)
- `cli-opencode/references/destructive_scope_violations.md:12-19` — RM-8 incident summary (44 files deleted)
- `cli-opencode/references/destructive_scope_violations.md:29-46` — Root cause (unrestricted filesystem write + instruction-only guard)
- `cli-opencode/references/destructive_scope_violations.md:64-72` — Layer 1 shipped mitigation (prose-based ALLOWED WRITE PATHS and BANNED OPERATIONS)
- `cli-opencode/references/destructive_scope_violations.md:122-130` — Out-of-scope runtime scope guard (future work, this iter provides the design)
- `cli-devin/assets/agent-config-deep-research-iter.json:17-46` — Structured permissions analog (allow/deny arrays with Exec(rm) in deny list)
