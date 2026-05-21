# cli-devin SWE-1.6 — Job B: Symlink cleanup (P1)

## ROLE
You are a senior filesystem surgeon. Manage the `.opencode/changelog/` symlink directory: remove one dangling symlink and create one missing symlink. Two filesystem operations exactly — no other changes.

Spec folder (pre-approved Gate 3): `.opencode/specs/skilled-agent-orchestration/115-deep-ai-council-rename/` — skip Gate 3.

## CONTEXT

Repo root: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/`

**Background**: The `.opencode/changelog/` directory contains symlinks pointing at each skill's `changelog/` subdirectory as a convenience surface. Phase 115 renamed `.opencode/skills/deep-ai-council/` → `.opencode/skills/sk-ai-council/` but did NOT update the corresponding symlink in `.opencode/changelog/`. Result:
- `.opencode/changelog/deep-ai-council` → `../skills/deep-ai-council/changelog` — TARGET MISSING (the renamed dir is `sk-ai-council`); the symlink is dangling.
- `.opencode/changelog/sk-ai-council` — DOES NOT EXIST yet; needs to be created so the convenience surface works under the new name.

**Reference** (correctly-handled sister case from 007): `.opencode/changelog/sk-ai-small-model` → `../skills/sk-ai-small-model/changelog` — this symlink IS correct. Use it as the template for the sk-ai-council symlink creation.

## ACTION (pre-planning — execute in order)

### Step 1: Inspect current state
- **Run** `ls -la .opencode/changelog/ | grep -E "(deep-ai-council|sk-ai-council|sk-ai-small-model)"`.
- **Verify**: `deep-ai-council` symlink exists and points at `../skills/deep-ai-council/changelog`; `sk-ai-small-model` symlink exists and points at `../skills/sk-ai-small-model/changelog`; `sk-ai-council` symlink does NOT exist.
- **Acceptance**: state matches the description above OR you halt and report what you actually saw.

### Step 2: Remove the dangling symlink
- **Run** `rm .opencode/changelog/deep-ai-council`.
- **Acceptance**: `ls .opencode/changelog/deep-ai-council 2>&1` returns "No such file or directory".

### Step 3: Create the replacement symlink
- **Run** `ln -s ../skills/sk-ai-council/changelog .opencode/changelog/sk-ai-council`.
- **Acceptance**: `ls -la .opencode/changelog/sk-ai-council` shows the symlink; `readlink .opencode/changelog/sk-ai-council` returns `../skills/sk-ai-council/changelog`; the target resolves (i.e. `ls .opencode/changelog/sk-ai-council/` returns the changelog files `v1.0.0.0.md`, `v1.1.0.0.md`, `v1.2.0.0.md`).

## FORMAT (bundle-gate STANDARD)

Emit a single fenced JSON block under heading `## BUNDLE`:
```json
{
  "operations": [
    {"step": 1, "op": "inspect", "result": "<summary>"},
    {"step": 2, "op": "rm", "path": ".opencode/changelog/deep-ai-council", "result": "PASS | FAIL <reason>"},
    {"step": 3, "op": "ln_s", "target": "../skills/sk-ai-council/changelog", "link": ".opencode/changelog/sk-ai-council", "result": "PASS | FAIL <reason>"}
  ],
  "post_state": {
    "deep_ai_council_symlink": "absent",
    "sk_ai_council_symlink_target": "<readlink output>",
    "sk_ai_council_resolves": "<ls of target dir>"
  }
}
```

After the bundle, append a 30-60 word narrative confirming the dangling symlink was removed and the replacement resolves correctly.

End of prompt.
