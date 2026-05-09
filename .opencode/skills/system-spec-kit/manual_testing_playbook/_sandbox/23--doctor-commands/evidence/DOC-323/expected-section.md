### Expected

The command resolves `intent=APPLY`, loads `.opencode/commands/doctor/assets/doctor_memory.yaml`, creates the missing schema through `memory_index_scan`, and reports an applied result. The gold battery succeeds against either the empty corpus floor or the initial indexed seed, with no rollback.

