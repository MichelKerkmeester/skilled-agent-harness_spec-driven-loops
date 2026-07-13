---
title: "OpenCode CLI - Self-Invocation Guard (ADR-001)"
description: "Full three-layer self-invocation detection contract (env var, process ancestry, state lock-file) behind ADR-001 in both bash and python pseudocode form, relocated out of SKILL.md so the entry point carries only a short pointer."
trigger_phrases:
  - "opencode self-invocation guard"
  - "opencode adr-001 detection"
  - "opencode layered self-dispatch check"
  - "opencode circular dispatch refusal"
importance_tier: important
contextType: implementation
version: 1.0.0.0
---

# OpenCode CLI - Self-Invocation Guard (ADR-001)

Layered detection contract for refusing a circular cli-opencode dispatch when the calling agent is already running inside OpenCode, in both bash and python pseudocode form.

---

## 1. OVERVIEW

### Purpose

Document the full three-layer self-invocation detection contract behind ADR-001 — env-var lookup, process-ancestry probe, and state lock-file probe — so `SKILL.md` §2 (SMART ROUTING) can carry a short summary and pointer instead of the full code.

### When to Use

Read this when implementing, auditing, or debugging the self-invocation guard referenced from `SKILL.md` §2 and from `integration_patterns.md` §5 (decision tree + exact refusal message).

### Core Principle

A running cli-opencode skill never dispatches itself. The guard trips on ANY positive detection layer unless the prompt carries explicit parallel-session keywords (use case 2 — parallel detached session), in which case the router permits a SEPARATE session id and state directory instead of a self-dispatch.

---

## 2. BASH DETECTION (LAYERS 1-3)

```bash
# Verify OpenCode CLI is available
command -v opencode || echo "Not installed. Run: brew install opencode (macOS) or curl -fsSL https://opencode.ai/install | bash"

# SELF-INVOCATION GUARD (ADR-001 layered detection)
# Layer 1: env var lookup — any OPENCODE_* variable
env | grep -q '^OPENCODE_' && echo "ERROR: OPENCODE_* env detected — already inside OpenCode."
# Layer 2: process ancestry — opencode in parent tree
ps -o command= -p "$PPID" | grep -q opencode && echo "ERROR: opencode parent process detected."
# Layer 3: state lock-file probe
ls ~/.opencode/state/*/lock 2>/dev/null | head -1 | grep -q lock && echo "ERROR: live OpenCode session lock detected."
```

---

## 3. PYTHON PSEUDOCODE

```python
def detect_self_invocation():
    """Returns a non-None signal when the orchestrator is already running inside OpenCode."""
    # Layer 1: env var lookup — OpenCode sets OPENCODE_CONFIG_DIR and OPENCODE_* vars
    for key in os.environ:
        if key == 'OPENCODE_CONFIG_DIR' or key.startswith('OPENCODE_'):
            return ('env', key)
    # Layer 2: process ancestry — opencode in parent tree
    try:
        ancestry = subprocess.check_output(['ps', '-o', 'command=', '-p', str(os.getppid())]).decode()
        if '/opencode' in ancestry or 'opencode ' in ancestry:
            return ('ancestry', 'opencode')
    except subprocess.SubprocessError:
        pass
    # Layer 3: state lock-file probe
    state_dir = os.path.expanduser('~/.opencode/state')
    if os.path.isdir(state_dir):
        for entry in os.listdir(state_dir):
            if os.path.exists(os.path.join(state_dir, entry, 'lock')):
                return ('lockfile', entry)
    return None

if detect_self_invocation():
    # Single legitimate exception: explicit "parallel detached" keywords (use case 2)
    # spawn a SEPARATE session id and state directory, not a self-dispatch.
    if not has_parallel_session_keywords(prompt):
        refuse(
            "Self-invocation refused: this agent is already running inside OpenCode. "
            "Use a sibling cli-* skill or a fresh shell session in a different runtime to dispatch a different model. "
            "For a parallel detached session, restate with explicit parallel-session keywords."
        )
```

---

## 4. REFUSAL BEHAVIOR

When `detect_self_invocation()` returns a signal and the prompt lacks explicit parallel-session keywords, the skill refuses to load and returns the documented error message instead of generating any `opencode` invocation. See [`integration_patterns.md`](./integration_patterns.md) §5 for the full decision tree and the exact refusal text surfaced to the operator, and [`destructive_scope_violations.md`](./destructive_scope_violations.md) for the incident class this guard-plus-worktree-isolation combination protects against.

---

## 5. RELATED RESOURCES

- [`integration_patterns.md`](./integration_patterns.md) - Decision tree and exact refusal message text
- [`destructive_scope_violations.md`](./destructive_scope_violations.md) - RM-8 incident this guard protects against
- [`agent_delegation.md`](./agent_delegation.md) - Agent routing this guard gates before dispatch
- [`../SKILL.md`](../SKILL.md) - Section 2 SMART ROUTING pointer and Section 4 ALWAYS rule 2
