pub fn inherited_child_probe(enabled: bool) -> &'static str {
    if enabled { "inherited" } else { "disabled" }
}

pub fn background_child_probe(enabled: bool) -> &'static str {
    if enabled { "background" } else { "disabled" }
}

pub fn late_child_probe(enabled: bool) -> &'static str {
    if enabled { "late" } else { "disabled" }
}

pub fn forked_worker_probe(enabled: bool) -> &'static str {
    if enabled { "forked" } else { "disabled" }
}

pub fn exec_child_probe(enabled: bool) -> &'static str {
    if enabled { "exec" } else { "disabled" }
}

pub fn pre_exec_child_probe(enabled: bool) -> &'static str {
    if enabled { "preexec" } else { "disabled" }
}

pub fn spawnp_child_probe(enabled: bool) -> &'static str {
    if enabled { "spawnp" } else { "disabled" }
}

pub fn launch_failure_probe(enabled: bool) -> &'static str {
    if enabled { "launch-failure" } else { "disabled" }
}

pub fn nested_thread_probe(enabled: bool) -> &'static str {
    if enabled { "nested" } else { "disabled" }
}

pub fn pool_worker_probe(enabled: bool) -> &'static str {
    if enabled { "pool" } else { "disabled" }
}

pub fn thread_failure_probe(enabled: bool) -> &'static str {
    if enabled { "thread-failure" } else { "disabled" }
}

pub fn thread_recovery_probe(enabled: bool) -> &'static str {
    if enabled { "recovered" } else { "disabled" }
}
