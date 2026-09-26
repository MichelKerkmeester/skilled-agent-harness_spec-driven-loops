use std::{
    env,
    ffi::{CString, c_char, c_void},
    fs,
    process::Command,
    ptr,
    sync::{OnceLock, mpsc},
    thread,
    time::{Duration, Instant},
};

const CONTEXT_ENV: &str = "SUPERCOV_RUST_CONTEXT_ID";

// Declared directly so the calls bind to the executable's own interposed
// symbols exactly like arbitrary instrumented user code would.
/// Oversized storage for the platform pthread_attr_t (64 bytes on macOS,
/// 56 on glibc); u64 alignment satisfies both ABIs.
#[repr(C)]
struct PthreadAttr {
    storage: [u64; 64],
}

unsafe extern "C" {
    static mut environ: *mut *mut c_char;
    fn fork() -> i32;
    fn waitpid(pid: i32, status: *mut i32, options: i32) -> i32;
    fn _exit(status: i32) -> !;
    fn pthread_attr_init(attributes: *mut PthreadAttr) -> i32;
    fn pthread_attr_destroy(attributes: *mut PthreadAttr) -> i32;
    fn pthread_attr_setstacksize(attributes: *mut PthreadAttr, size: usize) -> i32;
    fn pthread_create(
        thread: *mut usize,
        attributes: *const PthreadAttr,
        routine: unsafe extern "C" fn(*mut c_void) -> *mut c_void,
        argument: *mut c_void,
    ) -> i32;
    fn execve(
        path: *const c_char,
        arguments: *const *const c_char,
        environment: *const *mut c_char,
    ) -> i32;
    fn posix_spawnp(
        pid: *mut i32,
        file: *const c_char,
        file_actions: *const c_void,
        attributes: *const c_void,
        arguments: *const *mut c_char,
        environment: *const *mut c_char,
    ) -> i32;
}

fn child() -> Command {
    Command::new(env!("CARGO_BIN_EXE_supercov-subprocess-child"))
}

fn child_path() -> CString {
    CString::new(env!("CARGO_BIN_EXE_supercov-subprocess-child")).expect("child path")
}

fn wait_for_success(pid: i32) {
    assert!(pid > 0);
    let mut status = 0;
    assert_eq!(unsafe { waitpid(pid, &mut status, 0) }, pid);
    assert_eq!(status, 0, "child exited unsuccessfully: {status}");
}

#[test]
fn inherited_subprocess_is_attributed() {
    let output = child()
        .arg("inherited")
        .output()
        .expect("run inherited-context child");
    assert!(output.status.success());
    assert_eq!(String::from_utf8(output.stdout).unwrap().trim(), "inherited");
}

#[test]
fn contextless_subprocess_is_background() {
    let output = child()
        .env_remove(CONTEXT_ENV)
        .arg("background")
        .output()
        .expect("run contextless child");
    assert!(output.status.success());
    assert_eq!(String::from_utf8(output.stdout).unwrap().trim(), "background");
}

#[test]
fn forked_worker_is_attributed() {
    let pid = unsafe { fork() };
    assert!(pid >= 0, "fork failed");
    if pid == 0 {
        // The fork child inherits the forking thread's exact context and the
        // shared transport mapping; no exec, no interposer involvement.
        supercov_subprocess_fixture::forked_worker_probe(true);
        unsafe { _exit(0) };
    }
    wait_for_success(pid);
}

#[test]
fn fork_exec_child_is_attributed() {
    let path = child_path();
    let mode = CString::new("exec").expect("exec mode");
    let pid = unsafe { fork() };
    assert!(pid >= 0, "fork failed");
    if pid == 0 {
        let arguments = [path.as_ptr(), mode.as_ptr(), ptr::null()];
        // The parent environment is forwarded verbatim; only the interposed
        // execve may replace the context variable in the child copy.
        unsafe { execve(path.as_ptr(), arguments.as_ptr(), environ) };
        unsafe { _exit(86) };
    }
    wait_for_success(pid);
}

#[test]
fn pre_exec_child_is_attributed() {
    use std::os::unix::process::CommandExt;
    let mut command = child();
    command.arg("preexec");
    // pre_exec forces std::process off posix_spawn onto its fork+execvp
    // fallback, which must still inherit the exact context.
    unsafe { command.pre_exec(|| Ok(())) };
    let output = command.output().expect("run pre_exec child");
    assert!(output.status.success());
    assert_eq!(String::from_utf8(output.stdout).unwrap().trim(), "preexec");
}

#[test]
fn spawnp_child_is_attributed() {
    let file = child_path();
    let mode = CString::new("spawnp").expect("spawnp mode");
    let mut arguments = [
        file.as_ptr().cast_mut(),
        mode.as_ptr().cast_mut(),
        ptr::null_mut(),
    ];
    let mut pid = 0;
    let result = unsafe {
        posix_spawnp(
            &mut pid,
            file.as_ptr(),
            ptr::null(),
            ptr::null(),
            arguments.as_mut_ptr(),
            environ,
        )
    };
    assert_eq!(result, 0, "posix_spawnp failed");
    wait_for_success(pid);
}

#[test]
fn failed_launch_keeps_exact_context() {
    let error = Command::new("/supercov-nonexistent-child-binary")
        .spawn()
        .expect_err("nonexistent binary must not spawn");
    assert_eq!(error.kind(), std::io::ErrorKind::NotFound);
    assert_eq!(
        supercov_subprocess_fixture::launch_failure_probe(true),
        "launch-failure",
    );
}

unsafe extern "C" fn unexpected_thread(_: *mut c_void) -> *mut c_void {
    // Only reachable if an unallocatable-stack thread somehow spawned; the
    // gate below then fails on the create result before this evidence lands.
    supercov_subprocess_fixture::thread_failure_probe(true);
    ptr::null_mut()
}

#[test]
fn thread_creation_failure_preserves_exact_context() {
    // A stack larger than the entire virtual address space cannot be mapped
    // on any supported target, so the interposed pthread_create must take its
    // failure path: reclaim its start-routine allocation exactly once, commit
    // no thread phase, and leave the caller's exact context untouched.
    let mut attributes = PthreadAttr { storage: [0; 64] };
    assert_eq!(unsafe { pthread_attr_init(&mut attributes) }, 0);
    assert_eq!(
        unsafe { pthread_attr_setstacksize(&mut attributes, 1_usize << 62) },
        0,
        "the oversized stack must be rejected at create, not at attr setup",
    );
    let mut thread = 0_usize;
    let result = unsafe {
        pthread_create(&mut thread, &attributes, unexpected_thread, ptr::null_mut())
    };
    assert_ne!(result, 0, "a 16 TiB stack thread must fail to spawn");
    assert_eq!(unsafe { pthread_attr_destroy(&mut attributes) }, 0);
    assert_eq!(
        supercov_subprocess_fixture::thread_failure_probe(true),
        "thread-failure",
    );
    let value = thread::spawn(|| supercov_subprocess_fixture::thread_recovery_probe(true))
        .join()
        .expect("join recovery thread");
    assert_eq!(value, "recovered");
}

#[test]
fn nested_thread_is_attributed() {
    let value = thread::spawn(|| {
        thread::spawn(|| supercov_subprocess_fixture::nested_thread_probe(true))
            .join()
            .expect("join inner thread")
    })
    .join()
    .expect("join outer thread");
    assert_eq!(value, "nested");
}

type PoolJob = Box<dyn FnOnce() + Send + 'static>;

/// A lazily created long-lived shared worker thread. It is deliberately never
/// joined: its thread phase has no end record, so every probe it commits must
/// fail closed to background with an explicit RUST_THREAD_OUTLIVED_TEST note,
/// including the creating test's own pool work.
fn shared_pool() -> &'static mpsc::Sender<PoolJob> {
    static POOL: OnceLock<mpsc::Sender<PoolJob>> = OnceLock::new();
    POOL.get_or_init(|| {
        let (sender, receiver) = mpsc::channel::<PoolJob>();
        thread::spawn(move || {
            for job in receiver {
                job();
            }
        });
        sender
    })
}

fn run_on_shared_pool<T: Send + 'static>(job: impl FnOnce() -> T + Send + 'static) -> T {
    let (sender, receiver) = mpsc::channel();
    shared_pool()
        .send(Box::new(move || {
            let _ = sender.send(job());
        }))
        .expect("send job to the shared pool");
    receiver
        .recv_timeout(Duration::from_secs(30))
        .expect("receive the shared pool result")
}

#[test]
fn pool_first_use_stays_background() {
    assert_eq!(
        run_on_shared_pool(|| supercov_subprocess_fixture::pool_worker_probe(true)),
        "pool",
    );
}

#[test]
fn pool_second_use_stays_background() {
    assert_eq!(
        run_on_shared_pool(|| supercov_subprocess_fixture::pool_worker_probe(true)),
        "pool",
    );
}

#[test]
fn late_subprocess_is_contained() {
    let Some(marker) = env::var_os("SUPERCOV_LATE_PID_FILE") else {
        return;
    };
    let marker = std::path::PathBuf::from(marker);
    let mut command = child();
    command.arg("late");
    let spawned = command.spawn().expect("spawn late child");
    let deadline = Instant::now() + Duration::from_secs(10);
    while !marker.is_file() {
        assert!(Instant::now() < deadline, "late child never became ready");
        thread::sleep(Duration::from_millis(10));
    }
    let recorded_pid = fs::read_to_string(&marker).expect("read late-child marker");
    assert_eq!(recorded_pid.trim(), spawned.id().to_string());
    drop(spawned);
}

