#!/bin/sh
# usage: make-packet.sh <workspace> <packet-rel>
WS="$1"; P="$2"
mkdir -p "$WS/.git" "$WS/$P"
cat > "$WS/$P/goal.md" <<'GOAL'
---
title: "Goal: runtime verification canary"
description: "FRONTMATTER_CANARY_ZX81 must never reach a model."
importance_tier: "important"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- comment two -->
<!-- comment three -->
# Goal: runtime verification canary

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Prove the OBJECTIVE_CANARY_Q7 goal slice reaches the model from the bound packet file.

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] CRITERION_CANARY_ALPHA holds
- [ ] CRITERION_CANARY_BETA holds
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

| Item | State | Evidence |
|------|-------|----------|
| LOG_CANARY_VOLATILE | Open | none |
<!-- /ANCHOR:log -->
GOAL
