---
title: "Reference inventory"
trigger_phrases: []
---
# Reference inventory

Measured before the move, with `rg -l "hvr-rules" --hidden -g '!.git'`.

| Set | Count | Disposition |
|---|---|---|
| All referencing files | 678 | - |
| Frozen spec documents under `specs/` | 614 | Left as written |
| Outside `specs/` | 64 | - |
| Frozen benchmark reports and the released `v1.0.0.0` changelog entry | 7 | Left as written |
| Live consumers repointed | 57 | Repointed |

After the move, `grep -rl "hvr-rules" specs/` returns 622: the original 614 plus the eight
documents this packet authored.

Surviving old-path references outside `specs/` are listed in `frozen-old-path-survivors.txt`.
