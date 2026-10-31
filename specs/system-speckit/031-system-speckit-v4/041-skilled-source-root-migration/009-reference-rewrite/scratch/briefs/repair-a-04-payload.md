## Edit 1

File: `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/labeled-prompts.jsonl`

OLD:

~~~~text
{"id":"rr-iter2-018","bucket":"true_read_only","source_type":"synthetic-realistic","prompt":"Explain the difference between `resume` and `restart` in deep-research lineage.","gate3_triggers":"no","gate3_reason_category":"read_only","skill_top_1":"system-deep-loop","skill_correct":"yes","notes":"deep-research concept question"}
{"id":"rr-iter2-019","bucket":"true_read_only","source_type":"synthetic-realistic","prompt":"Inspect `.skilled/agents` and tell me which agent names are defined.","gate3_triggers":"no","gate3_reason_category":"read_only","skill_top_1":"none","skill_correct":"no","notes":"directory listing request without strong skill need"}
{"id":"rr-iter2-020","bucket":"true_read_only","source_type":"paraphrased-realistic","prompt":"Audit whether `memory_save` prompts are documented consistently across packet docs.","gate3_triggers":"no","gate3_reason_category":"read_only","skill_top_1":"sk-code","skill_correct":"yes","notes":"docs audit only"}
~~~~

NEW:

~~~~text
{"id":"rr-iter2-018","bucket":"true_read_only","source_type":"synthetic-realistic","prompt":"Explain the difference between `resume` and `restart` in deep-research lineage.","gate3_triggers":"no","gate3_reason_category":"read_only","skill_top_1":"system-deep-loop","skill_correct":"yes","notes":"deep-research concept question"}
{"id":"rr-iter2-019","bucket":"true_read_only","source_type":"synthetic-realistic","prompt":"Inspect `.opencode/agents` and tell me which agent names are defined.","gate3_triggers":"no","gate3_reason_category":"read_only","skill_top_1":"none","skill_correct":"no","notes":"directory listing request without strong skill need"}
{"id":"rr-iter2-020","bucket":"true_read_only","source_type":"paraphrased-realistic","prompt":"Audit whether `memory_save` prompts are documented consistently across packet docs.","gate3_triggers":"no","gate3_reason_category":"read_only","skill_top_1":"sk-code","skill_correct":"yes","notes":"docs audit only"}
~~~~
