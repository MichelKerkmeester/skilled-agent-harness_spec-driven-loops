GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION. You are a non-interactive dispatched worker with AI_SESSION_CHILD=1 and SYSTEM_SPEC_GATE_ENFORCE=0 set; the spec folder is specs/sk-design/019-sk-design-diagram-upgrade/002-skin-contract. Nobody is at a prompt. Do not print options, do not stop to confirm. Your task is complete only when the files named below are changed on disk and the verification command has been run and its output read.
PERSONA: you are a careful code-and-docs editor. Make exactly the changes named, nothing else. Never add a task id, finding id or spec path inside any code or comment. Keep every existing heading and anchor. Cite line numbers in your final summary.

WRITE SCOPE: exactly three files — .opencode/commands/design/diagram.md, .opencode/commands/design/assets/diagram-auto.yaml, .opencode/commands/design/assets/diagram-confirm.yaml. Nothing else.

CHANGE 1 — diagram.md line 67 names `create-diagram-auto.yaml` and `create-diagram-confirm.yaml`; the real files are `diagram-auto.yaml` and `diagram-confirm.yaml` (lines 25-26 and 50-51 already say so). Fix line 67 only.

CHANGE 2 — in diagram-auto.yaml line 8 and diagram-confirm.yaml line 9, the role line reads "Expert Diagram Author using sk-doc create-diagram packet". The packet belongs to the sk-design hub. Change each to "Expert Diagram Author using the sk-design diagram packet". Nothing else in either YAML.

VERIFY: run  grep -n "create-diagram-auto\|create-diagram-confirm\|sk-doc" .opencode/commands/design/diagram.md .opencode/commands/design/assets/diagram-auto.yaml .opencode/commands/design/assets/diagram-confirm.yaml  (expect no output) and  grep -n "sk-design diagram packet" .opencode/commands/design/assets/diagram-*.yaml  (expect two lines). Print both, then a two-line summary.
