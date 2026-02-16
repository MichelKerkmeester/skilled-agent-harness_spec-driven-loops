---
title: "Agent Provider Scripts"
description: "Operational guide for switching runtime agents between copilot and chatgpt profiles."
trigger_phrases:
  - "activate provider"
  - "provider status"
  - "agent profile switch"
  - "rollback"
---

# Agent Provider Scripts

This folder contains the scripts that manage provider profile switching while keeping `.opencode/agent/*.md` as the runtime path used by commands and orchestration.

---

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1-overview)
- [2. SCRIPTS](#2-scripts)
- [3. MANAGED AGENT SET](#3-managed-agent-set)
- [4. ACTIVATION LOGIC](#4-activation-logic)
- [5. USAGE](#5-usage)
- [6. EXIT CODES](#6-exit-codes)
- [7. TROUBLESHOOTING](#7-troubleshooting)

---

<!-- /ANCHOR:table-of-contents -->
<!-- ANCHOR:overview -->
## 1. OVERVIEW

Runtime agents stay in `.opencode/agent/*.md`.

Provider-specific variants live in:
- `.opencode/agent/copilot/*.md`
- `.opencode/agent/chatgpt/*.md`

Activation copies the selected provider profile into runtime files, verifies parity, and restores backup on failure.

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:scripts -->
## 2. SCRIPTS

| Script | Purpose |
|--------|---------|
| `activate-provider.sh` | Activates `copilot` or `chatgpt` profile into runtime files with backup, verification, and rollback |
| `provider-status.sh` | Reports runtime/profile parity and detects active provider (`copilot`, `chatgpt`, or mixed/unknown) |

---

<!-- /ANCHOR:scripts -->
<!-- ANCHOR:managed-agent-set -->
## 3. MANAGED AGENT SET

Both scripts manage the same 8 runtime files:

- `context.md`
- `debug.md`
- `handover.md`
- `orchestrate.md`
- `research.md`
- `review.md`
- `speckit.md`
- `write.md`

---

<!-- /ANCHOR:managed-agent-set -->
<!-- ANCHOR:activation-logic -->
## 4. ACTIVATION LOGIC

`activate-provider.sh` performs these steps:

1. Validate arguments (`copilot|chatgpt`, optional `--force`, `--dry-run`)
2. Validate profile folder and required files exist
3. Guard against dirty runtime files unless `--force` (skipped in `--dry-run`)
4. Create backup under `.opencode/agent/.provider-backups/`
5. Copy provider files into `.opencode/agent/*.md`
6. Verify each copied file with `cmp -s`
7. If verification fails, restore backup and exit non-zero
8. On success, write `.opencode/agent/.active-provider`

---

<!-- /ANCHOR:activation-logic -->
<!-- ANCHOR:usage -->
## 5. USAGE

```bash
# Dry run (no file writes)
.opencode/agent/scripts/activate-provider.sh chatgpt --dry-run

# Force activation when runtime files are dirty
.opencode/agent/scripts/activate-provider.sh chatgpt --force

# Switch back
.opencode/agent/scripts/activate-provider.sh copilot --force

# Inspect active provider and parity
.opencode/agent/scripts/provider-status.sh
```

---

<!-- /ANCHOR:usage -->
<!-- ANCHOR:exit-codes -->
## 6. EXIT CODES

### activate-provider.sh

| Code | Meaning |
|------|---------|
| `0` | Success |
| `2` | Invalid or missing arguments |
| `3` | Missing runtime/profile path or required profile file |
| `4` | Runtime files dirty and `--force` not provided |
| `5` | Post-copy verification failed and rollback was triggered |

### provider-status.sh

| Code | Meaning |
|------|---------|
| `0` | Runtime fully matches one provider |
| `1` | Runtime is mixed/unknown |
| `2` | Runtime root missing |

---

<!-- /ANCHOR:exit-codes -->
<!-- ANCHOR:troubleshooting -->
## 7. TROUBLESHOOTING

- If activation fails with verification errors, check profile file integrity and re-run status.
- If status shows mixed/unknown, re-activate a provider and verify all 8 files match.
- If dirty-file guard blocks activation, either commit/stash runtime changes or use `--force` intentionally.
<!-- /ANCHOR:troubleshooting -->
