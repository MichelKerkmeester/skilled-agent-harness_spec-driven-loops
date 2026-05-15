# Phase 4 Agent-Config Design Review

## 1. JSON or YAML
- Recommendation: JSON — Devin uses strict parsing, and JSON is better for fixture tests, JSON Schema/Zod validation, deterministic diffs, and programmatic generation. YAML is nicer for multiline instructions, but that readability does not beat parser certainty here.

## 2. Recipe count
- Recommendation: 3 — synthesis is distinct because it has scoped write authority. Do not mutate the research recipe with a write toggle; that weakens least-privilege and repeats the stdout-vs-file-write failure mode.

## 3. system_instructions content
- Recommendation: compact embed + per-iter prompt detail — embed the invariant SWE-1.6 contract, but leave full STAR/RCAF/BUILD task framing in each rendered prompt. This prevents silent contract loss while avoiding stale duplicated prompt-card prose.

## 4. Tool allowlist per recipe
- Research: Read, Grep, Glob, Bash(read-only command allowlist only)
- Review: Read, Grep
- Synthesis: Read, Grep, Write(scoped to `research.md` and `delta-verified.md`)
- Review should not allow Bash. It adds command-exec risk without much value if Grep is available.

## 5. Permission mode
- Recommendation: dispatch flag — keep `--permission-mode "{resolved_permission_mode}"` in YAML. Embedding it in JSON creates two control planes and can drift from `executor-config.ts`.

## 6. Sandbox mode
- Recommendation: no recipe sandbox field — local `devin --help` exposes `--sandbox` as a boolean preview flag, not `workspace-write/read-only` values. If Phase 4 wants sandboxing, wire it as a dispatch flag with tests, especially for synthesis.

## 7. Validator consistency
- Recommendation: independent but semantically consistent — `executor-config.ts` validates per-call flags, not the agent-config file. Still, recipes must not contradict it: no `reasoningEffort`, no `serviceTier`, no JSON-owned permission mode unless Devin’s schema proves it supports that field.

## Concrete recipe sketches

Invoke each recipe with `--model swe-1.6 --agent-config <file>`.

### agent-config-deep-research-iter.json
```json
{
  "system_instructions": "You are a SWE-1.6 deep-research iteration worker. Follow the rendered prompt's STAR/RCAF/BUILD pre-plan, acceptance criteria, stop conditions, and output format. Use evidence-first reasoning. Prefer Read/Grep/Glob; use Bash only for read-only inspection commands. Do not write files. Do not invent numeric counts or line citations; mark uncertain claims as UNKNOWN.",
  "tools": {
    "allow": ["Read", "Grep", "Glob", "Bash"]
  },
  "permissions": {
    "read": { "allow": ["{repo_root}"] },
    "write": { "allow": [] },
    "bash": {
      "allow_commands": ["pwd", "ls", "find", "rg", "grep", "sed", "awk", "git status", "git show", "git log"],
      "deny_commands": ["rm", "mv", "cp", "git checkout", "git reset", "git clean", "npm", "pnpm", "python", "node"]
    }
  }
}
```

### agent-config-deep-review-iter.json
```json
{
  "system_instructions": "You are a SWE-1.6 deep-review critique worker. Produce findings-first review output with concrete evidence. Use only Read and Grep. Do not modify files. Cite file paths and lines only after reading the source. Avoid vague residual findings; classify severity and state uncertainty explicitly.",
  "tools": {
    "allow": ["Read", "Grep"]
  },
  "permissions": {
    "read": { "allow": ["{repo_root}"] },
    "write": { "allow": [] }
  }
}
```

### agent-config-synthesis.json
```json
{
  "system_instructions": "You are a SWE-1.6 synthesis worker. Consolidate verified iteration findings into the exact requested markdown outputs. Read all cited iteration artifacts before writing. Preserve provenance. Do not rely on raw numeric totals unless revalidated. Write only the scoped synthesis files named by the prompt.",
  "tools": {
    "allow": ["Read", "Grep", "Write"]
  },
  "permissions": {
    "read": { "allow": ["{repo_root}", "{iteration_dir}"] },
    "write": {
      "allow": ["{spec_folder}/research/research.md", "{spec_folder}/research/delta-verified.md"]
    }
  }
}
```

## Verdict
- BLOCKERS for Phase 4: verify Devin’s exact agent-config schema keys before shipping; strict parsing means `model`, `permission_mode`, and placeholder permission shapes must not be guessed.
- One-line summary: ship three JSON recipes, use them for role/tool/path policy, and keep model/permission/sandbox ownership in the existing dispatch layer.

CODEX_PHASE4_REVIEW_059_COMPLETE
tokens used
