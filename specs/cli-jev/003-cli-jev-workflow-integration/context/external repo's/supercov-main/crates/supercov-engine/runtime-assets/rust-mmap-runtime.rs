#[doc(hidden)]
#[allow(dead_code)]
mod __SUPERCOV_MODULE__ {
    use std::cell::{Cell, RefCell};
    use std::collections::BTreeSet;
    use std::sync::OnceLock;
    use std::sync::atomic::{AtomicU64, Ordering};
    // The descriptor commit byte exists only where a mapping does; on any
    // other target this import was the stub's first unused warning.
    #[cfg(any(
        all(
            target_os = "macos",
            any(target_arch = "aarch64", target_arch = "x86_64")
        ),
        all(
            target_os = "linux",
            any(target_env = "gnu", target_env = "musl"),
            any(target_arch = "aarch64", target_arch = "x86_64")
        ),
        all(
            target_os = "windows",
            any(target_arch = "aarch64", target_arch = "x86_64")
        )
    ))]
    use std::sync::atomic::AtomicU8;

    const MAGIC: &[u8; 8] = b"SCVRUST3";
    const VERSION: u32 = 3;
    const HEADER_SIZE: usize = 128;
    const DESCRIPTOR_SIZE: usize = 40;
    const ENDIAN_MARKER: u32 = 0x0102_0304;
    const NEXT_DESCRIPTOR_OFFSET: usize = 32;
    const NEXT_PAYLOAD_OFFSET: usize = 40;
    const DROPPED_OFFSET: usize = 48;
    const TOKEN_OFFSET: usize = 56;
    const TOKEN_SIZE: usize = 16;
    const ATTACHMENTS_OFFSET: usize = 72;
    const NEXT_PHASE_OFFSET: usize = 80;
    const CONTEXT_ENV: &str = "SUPERCOV_RUST_CONTEXT_ID";
    const KIND_HIT: u8 = 1;
    const KIND_DECISION: u8 = 2;
    const KIND_ORDINAL_HIT: u8 = 3;
    const KIND_PHASE: u8 = 4;
    const KIND_THREAD_PHASE: u8 = 5;
    const KIND_THREAD_END: u8 = 6;
    const KIND_TEST_BOUNDARY: u8 = 7;
    const DECISION_ID_PREFIX: &[u8; 12] = b"rs:decision:";
    const DECISION_ID_LENGTH: u32 = 36;
    const NO_CONTEXT_OVERRIDE: u64 = u64::MAX;

    std::thread_local! {
        static CONTEXT_OVERRIDE: Cell<Option<u64>> = const { Cell::new(None) };
        /// Ordinals already published by this thread under the current
        /// context.
        ///
        /// Coverage asks whether an obligation ran, never how often, so a loop
        /// running a million times carries the same information as one pass.
        /// Publishing per hit reserved a crash-visible descriptor and payload
        /// every time, making a hot loop cost proportional to its trip count.
        ///
        /// The first sighting is published immediately, so nothing is ever
        /// buffered and nothing can be lost at thread or process exit; later
        /// sightings are skipped. Cleared when the context changes, because the
        /// same obligation under a different context is a different observation.
        static PUBLISHED_HITS: RefCell<(u64, BTreeSet<u64>)> =
            RefCell::new((0, BTreeSet::new()));
    }

    #[cfg(any(target_os = "macos", target_os = "linux"))]
    mod inherited_thread_context {
        use std::{
            ffi::{c_char, c_void},
            mem,
            sync::OnceLock,
        };

        type StartRoutine = unsafe extern "C" fn(*mut c_void) -> *mut c_void;
        type PthreadCreate = unsafe extern "C" fn(
            *mut usize,
            *const c_void,
            StartRoutine,
            *mut c_void,
        ) -> i32;

        struct ThreadStart {
            routine: StartRoutine,
            argument: *mut c_void,
            context: u64,
        }

        #[cfg(target_os = "macos")]
        #[link(name = "System")]
        unsafe extern "C" {
            fn dlsym(handle: *mut c_void, symbol: *const c_char) -> *mut c_void;
        }

        #[cfg(target_os = "linux")]
        #[link(name = "dl")]
        unsafe extern "C" {
            fn dlsym(handle: *mut c_void, symbol: *const c_char) -> *mut c_void;
        }

        fn real_pthread_create() -> PthreadCreate {
            static REAL: OnceLock<usize> = OnceLock::new();
            let address = *REAL.get_or_init(|| {
                // RTLD_NEXT resolves the platform implementation after this
                // executable-owned interposer instead of recursively finding
                // Supercov's exported symbol.
                let next = usize::MAX as *mut c_void;
                // SAFETY: the symbol is NUL-terminated and dlsym accepts the
                // platform RTLD_NEXT sentinel on macOS and Linux.
                let resolved = unsafe { dlsym(next, c"pthread_create".as_ptr()) };
                if resolved.is_null() {
                    std::process::abort();
                }
                resolved as usize
            });
            // SAFETY: dlsym returned the platform pthread_create symbol, whose
            // pointer-shaped ABI is described by PthreadCreate above.
            unsafe { mem::transmute::<usize, PthreadCreate>(address) }
        }

        unsafe extern "C" fn run_with_context(opaque: *mut c_void) -> *mut c_void {
            // SAFETY: pthread_create receives exactly one Box allocation from
            // the interposer and invokes this start routine at most once.
            let start = unsafe { Box::from_raw(opaque.cast::<ThreadStart>()) };
            // The thread runs under a fresh derived thread-phase context, so
            // a thread that outlives its creating test can be detected and
            // failed closed to background instead of contaminating the test.
            let previous = super::enter_thread_context(start.context);
            // SAFETY: the original start routine and argument came directly
            // from the caller's pthread_create invocation.
            let result = unsafe { (start.routine)(start.argument) };
            super::exit_thread_context(previous);
            result
        }

        /// Preserve the exact active Supercov context across native thread
        /// creation without mutating process-global environment or requiring
        /// cooperation from `std::thread`, an executor, or the test suite.
        #[unsafe(no_mangle)]
        pub unsafe extern "C" fn pthread_create(
            thread: *mut usize,
            attributes: *const c_void,
            routine: StartRoutine,
            argument: *mut c_void,
        ) -> i32 {
            let context = super::active_context();
            if matches!(context, 0 | u64::MAX) {
                // SAFETY: arguments are forwarded unchanged to the platform.
                return unsafe {
                    real_pthread_create()(thread, attributes, routine, argument)
                };
            }
            let start = Box::new(ThreadStart {
                routine,
                argument,
                context,
            });
            let raw = Box::into_raw(start).cast::<c_void>();
            // SAFETY: run_with_context has the platform start-routine ABI and
            // owns raw only if pthread_create succeeds.
            let result = unsafe {
                real_pthread_create()(thread, attributes, run_with_context, raw)
            };
            if result != 0 {
                // SAFETY: a failed pthread_create never transfers raw to a
                // child thread, so the caller must reclaim it exactly once.
                unsafe { drop(Box::from_raw(raw.cast::<ThreadStart>())) };
            }
            result
        }
    }

    #[cfg(any(target_os = "macos", target_os = "linux"))]
    mod inherited_process_context {
        use std::{ffi::{CStr, CString, c_char, c_void}, mem, sync::OnceLock};

        type PosixSpawn = unsafe extern "C" fn(
            *mut i32,
            *const c_char,
            *const c_void,
            *const c_void,
            *const *mut c_char,
            *const *mut c_char,
        ) -> i32;

        const CONTEXT_PREFIX: &[u8] = b"SUPERCOV_RUST_CONTEXT_ID=";

        #[cfg(target_os = "macos")]
        #[link(name = "System")]
        unsafe extern "C" {
            fn dlsym(handle: *mut c_void, symbol: *const c_char) -> *mut c_void;
        }

        #[cfg(target_os = "linux")]
        #[link(name = "dl")]
        unsafe extern "C" {
            fn dlsym(handle: *mut c_void, symbol: *const c_char) -> *mut c_void;
        }

        fn resolve(slot: &'static OnceLock<usize>, symbol: &'static CStr) -> PosixSpawn {
            let address = *slot.get_or_init(|| {
                let next = usize::MAX as *mut c_void;
                // SAFETY: symbol is NUL-terminated and the platform accepts
                // RTLD_NEXT for an executable-owned interposer.
                let resolved = unsafe { dlsym(next, symbol.as_ptr()) };
                if resolved.is_null() {
                    std::process::abort();
                }
                resolved as usize
            });
            // SAFETY: both resolved POSIX spawn functions have PosixSpawn's
            // pointer-shaped ABI.
            unsafe { mem::transmute::<usize, PosixSpawn>(address) }
        }

        struct ChildEnvironment {
            pointers: Vec<*mut c_char>,
            _context: CString,
        }

        unsafe fn child_environment(
            environment: *const *mut c_char,
        ) -> Option<ChildEnvironment> {
            let context = super::active_context();
            if environment.is_null() || matches!(context, 0 | u64::MAX) {
                return None;
            }
            let mut pointers = Vec::new();
            let mut found = false;
            let mut index = 0_usize;
            loop {
                // SAFETY: POSIX requires envp to be a null-terminated pointer
                // array whose entries remain valid for the spawn call.
                let pointer = unsafe { *environment.add(index) };
                if pointer.is_null() {
                    break;
                }
                // SAFETY: each non-null envp entry is a NUL-terminated C
                // string owned by the caller for the duration of this call.
                let bytes = unsafe { CStr::from_ptr(pointer) }.to_bytes();
                if bytes.starts_with(CONTEXT_PREFIX) {
                    found = true;
                } else {
                    pointers.push(pointer);
                }
                index = index.checked_add(1).unwrap_or_else(|| std::process::abort());
            }
            // Absence is meaningful: Command::env_remove explicitly opts the
            // child into authenticated context-zero/background attribution.
            if !found {
                return None;
            }
            let context = CString::new(format!(
                "SUPERCOV_RUST_CONTEXT_ID={context:016x}"
            ))
            .unwrap_or_else(|_| std::process::abort());
            pointers.push(context.as_ptr().cast_mut());
            pointers.push(std::ptr::null_mut());
            Some(ChildEnvironment {
                pointers,
                _context: context,
            })
        }

        unsafe fn spawn_with_context(
            real: PosixSpawn,
            pid: *mut i32,
            path: *const c_char,
            file_actions: *const c_void,
            attributes: *const c_void,
            arguments: *const *mut c_char,
            environment: *const *mut c_char,
        ) -> i32 {
            // SAFETY: child_environment only reads the caller-owned envp for
            // the duration of this synchronous spawn call.
            let child = unsafe { child_environment(environment) };
            let environment = child
                .as_ref()
                .map_or(environment, |owned| owned.pointers.as_ptr());
            // SAFETY: all arguments except the optional replacement envp are
            // forwarded unchanged to the platform implementation.
            unsafe {
                real(
                    pid,
                    path,
                    file_actions,
                    attributes,
                    arguments,
                    environment,
                )
            }
        }

        /// Propagate the active context through std::process::Command and any
        /// other POSIX-spawn caller without changing process-global env state.
        #[unsafe(no_mangle)]
        pub unsafe extern "C" fn posix_spawn(
            pid: *mut i32,
            path: *const c_char,
            file_actions: *const c_void,
            attributes: *const c_void,
            arguments: *const *mut c_char,
            environment: *const *mut c_char,
        ) -> i32 {
            static REAL: OnceLock<usize> = OnceLock::new();
            // SAFETY: the wrapper has the exact pointer-shaped POSIX ABI.
            unsafe {
                spawn_with_context(
                    resolve(&REAL, c"posix_spawn"),
                    pid,
                    path,
                    file_actions,
                    attributes,
                    arguments,
                    environment,
                )
            }
        }

        #[unsafe(no_mangle)]
        pub unsafe extern "C" fn posix_spawnp(
            pid: *mut i32,
            file: *const c_char,
            file_actions: *const c_void,
            attributes: *const c_void,
            arguments: *const *mut c_char,
            environment: *const *mut c_char,
        ) -> i32 {
            static REAL: OnceLock<usize> = OnceLock::new();
            // SAFETY: the wrapper has the exact pointer-shaped POSIX ABI.
            unsafe {
                spawn_with_context(
                    resolve(&REAL, c"posix_spawnp"),
                    pid,
                    file,
                    file_actions,
                    attributes,
                    arguments,
                    environment,
                )
            }
        }

        type Execve = unsafe extern "C" fn(
            *const c_char,
            *const *mut c_char,
            *const *mut c_char,
        ) -> i32;
        type Execv = unsafe extern "C" fn(*const c_char, *const *mut c_char) -> i32;

        unsafe extern "C" {
            static mut environ: *mut *mut c_char;
        }

        fn resolve_address(slot: &'static OnceLock<usize>, symbol: &'static CStr) -> usize {
            *slot.get_or_init(|| {
                let next = usize::MAX as *mut c_void;
                // SAFETY: symbol is NUL-terminated and the platform accepts
                // RTLD_NEXT for an executable-owned interposer.
                let resolved = unsafe { dlsym(next, symbol.as_ptr()) };
                if resolved.is_null() {
                    std::process::abort();
                }
                resolved as usize
            })
        }

        /// Propagate the active context through a direct execve, whose caller
        /// supplies the child environment explicitly. A fork child still reads
        /// the forking thread's exact context, so fork+execve compositions and
        /// std::process pre_exec fallbacks inherit like posix_spawn callers.
        #[unsafe(no_mangle)]
        pub unsafe extern "C" fn execve(
            path: *const c_char,
            arguments: *const *mut c_char,
            environment: *const *mut c_char,
        ) -> i32 {
            static REAL: OnceLock<usize> = OnceLock::new();
            // SAFETY: dlsym resolved the platform execve with Execve's ABI.
            let real = unsafe {
                mem::transmute::<usize, Execve>(resolve_address(&REAL, c"execve"))
            };
            // SAFETY: child_environment only reads the caller-owned envp for
            // the duration of this exec attempt.
            let child = unsafe { child_environment(environment) };
            let environment = child
                .as_ref()
                .map_or(environment, |owned| owned.pointers.as_ptr());
            // SAFETY: all arguments except the optional replacement envp are
            // forwarded unchanged; on success the image is replaced and on
            // failure the owned buffers are still alive here.
            unsafe { real(path, arguments, environment) }
        }

        /// execv and execvp read the process-global environ instead of taking
        /// an envp argument, and their libc-internal exec calls do not pass
        /// through the interposed execve symbol. Swap environ to the replaced
        /// copy only for the duration of the exec attempt and restore it on
        /// failure, so a successful exec ships the exact context while a
        /// failed exec leaves the caller's environment untouched.
        unsafe fn exec_with_environ(
            real: Execv,
            path: *const c_char,
            arguments: *const *mut c_char,
        ) -> i32 {
            // SAFETY: environ is the platform-owned NULL-terminated array and
            // child_environment only reads it for the duration of this call.
            let child = unsafe { child_environment(environ.cast_const().cast()) };
            let Some(owned) = child else {
                // SAFETY: no context replacement applies; forward unchanged.
                return unsafe { real(path, arguments) };
            };
            // SAFETY: exec callers own this thread; a fork child is single
            // threaded and a direct caller's environ is restored before any
            // failure return escapes this frame.
            unsafe {
                let saved = environ;
                environ = owned.pointers.as_ptr().cast_mut().cast();
                let result = real(path, arguments);
                environ = saved;
                result
            }
        }

        #[unsafe(no_mangle)]
        pub unsafe extern "C" fn execv(
            path: *const c_char,
            arguments: *const *mut c_char,
        ) -> i32 {
            static REAL: OnceLock<usize> = OnceLock::new();
            // SAFETY: dlsym resolved the platform execv with Execv's ABI.
            let real = unsafe {
                mem::transmute::<usize, Execv>(resolve_address(&REAL, c"execv"))
            };
            // SAFETY: forwarded with the documented environ swap contract.
            unsafe { exec_with_environ(real, path, arguments) }
        }

        #[unsafe(no_mangle)]
        pub unsafe extern "C" fn execvp(
            file: *const c_char,
            arguments: *const *mut c_char,
        ) -> i32 {
            static REAL: OnceLock<usize> = OnceLock::new();
            // SAFETY: dlsym resolved the platform execvp with Execv's ABI.
            let real = unsafe {
                mem::transmute::<usize, Execv>(resolve_address(&REAL, c"execvp"))
            };
            // SAFETY: forwarded with the documented environ swap contract.
            unsafe { exec_with_environ(real, file, arguments) }
        }
    }

    /// The transport file mapped whole, read-write and shared, on the POSIX
    /// hosts: a symlink is refused, the file must be regular and at least a
    /// header long.
    #[cfg(any(
        all(
            target_os = "macos",
            any(target_arch = "aarch64", target_arch = "x86_64")
        ),
        all(
            target_os = "linux",
            any(target_env = "gnu", target_env = "musl"),
            any(target_arch = "aarch64", target_arch = "x86_64")
        )
    ))]
    mod mapping {
        use std::{
            ffi::{OsStr, c_void},
            fs::OpenOptions,
            os::{fd::AsRawFd as _, unix::fs::OpenOptionsExt as _},
        };

        #[cfg(target_os = "linux")]
        const O_NOFOLLOW: i32 = 0x2_0000;
        #[cfg(target_os = "macos")]
        const O_NOFOLLOW: i32 = 0x100;

        unsafe extern "C" {
            fn mmap(
                address: *mut c_void,
                length: usize,
                protection: i32,
                flags: i32,
                file: i32,
                offset: isize,
            ) -> *mut c_void;
            fn munmap(address: *mut c_void, length: usize) -> i32;
        }

        pub fn map(path: &OsStr, minimum: usize) -> Option<(*mut u8, usize)> {
            let file = OpenOptions::new()
                .read(true)
                .write(true)
                .custom_flags(O_NOFOLLOW)
                .open(path)
                .ok()?;
            let metadata = file.metadata().ok()?;
            if !metadata.file_type().is_file() {
                return None;
            }
            let length = usize::try_from(metadata.len()).ok()?;
            if length < minimum {
                return None;
            }
            // SAFETY: the descriptor is valid for the call and the mapping
            // outlives the file, which may close afterwards.
            let pointer = unsafe {
                mmap(std::ptr::null_mut(), length, 1 | 2, 1, file.as_raw_fd(), 0)
            };
            if pointer as isize == -1 {
                return None;
            }
            Some((pointer.cast::<u8>(), length))
        }

        /// # Safety
        /// `pointer` and `length` must be exactly what `map` returned.
        pub unsafe fn unmap(pointer: *mut u8, length: usize) {
            // SAFETY: guaranteed by the caller.
            let _ = unsafe { munmap(pointer.cast(), length) };
        }
    }

    /// The same mapping on Windows. A view of a file mapping is backed by the
    /// section object, so its dirty pages survive a killed process exactly as
    /// mmap's do, which is what makes a killed worker's coverage recoverable.
    #[cfg(all(
        target_os = "windows",
        any(target_arch = "aarch64", target_arch = "x86_64")
    ))]
    mod mapping {
        use std::{
            ffi::{OsStr, c_void},
            fs::OpenOptions,
            os::windows::{fs::OpenOptionsExt as _, io::AsRawHandle as _},
        };

        #[link(name = "kernel32")]
        unsafe extern "system" {
            fn CreateFileMappingW(
                file: *mut c_void,
                attributes: *mut c_void,
                protection: u32,
                maximum_size_high: u32,
                maximum_size_low: u32,
                name: *const u16,
            ) -> *mut c_void;
            fn MapViewOfFile(
                mapping: *mut c_void,
                access: u32,
                offset_high: u32,
                offset_low: u32,
                length: usize,
            ) -> *mut c_void;
            fn UnmapViewOfFile(address: *const c_void) -> i32;
            fn CloseHandle(handle: *mut c_void) -> i32;
        }

        const FILE_FLAG_OPEN_REPARSE_POINT: u32 = 0x0020_0000;
        const PAGE_READWRITE: u32 = 0x04;
        const FILE_MAP_WRITE: u32 = 0x0002;
        const FILE_MAP_READ: u32 = 0x0004;

        pub fn map(path: &OsStr, minimum: usize) -> Option<(*mut u8, usize)> {
            // Opening the reparse point itself rather than its target is the
            // O_NOFOLLOW of Windows; a link then fails the regular-file check.
            let file = OpenOptions::new()
                .read(true)
                .write(true)
                .custom_flags(FILE_FLAG_OPEN_REPARSE_POINT)
                .open(path)
                .ok()?;
            let metadata = file.metadata().ok()?;
            if !metadata.file_type().is_file() {
                return None;
            }
            let length = usize::try_from(metadata.len()).ok()?;
            if length < minimum {
                return None;
            }
            // SAFETY: the handle is valid for the call; a zero maximum size
            // maps the whole file.
            let section = unsafe {
                CreateFileMappingW(
                    file.as_raw_handle(),
                    std::ptr::null_mut(),
                    PAGE_READWRITE,
                    0,
                    0,
                    std::ptr::null(),
                )
            };
            if section.is_null() {
                return None;
            }
            // SAFETY: the section handle is valid and the length is the
            // file's; the view keeps the section alive after both close.
            let view = unsafe { MapViewOfFile(section, FILE_MAP_READ | FILE_MAP_WRITE, 0, 0, length) };
            // SAFETY: the section handle was returned above and is closed once.
            let _ = unsafe { CloseHandle(section) };
            if view.is_null() {
                return None;
            }
            Some((view.cast::<u8>(), length))
        }

        /// # Safety
        /// `pointer` must be exactly what `map` returned.
        pub unsafe fn unmap(pointer: *mut u8, _length: usize) {
            // SAFETY: guaranteed by the caller.
            let _ = unsafe { UnmapViewOfFile(pointer.cast()) };
        }
    }

    /// Windows has no symbol interposition: `CreateThread` and
    /// `CreateProcessW` reach kernel32 through the executable's import address
    /// table, and std -- linked into the test binary -- imports both there. The
    /// table is patched once, when the transport opens, to the same contract
    /// as the POSIX interposers above. Anything unexpected in the image leaves
    /// the table untouched: threads and children then attribute to background
    /// rather than crash the program under test.
    #[cfg(all(
        target_os = "windows",
        any(target_arch = "aarch64", target_arch = "x86_64")
    ))]
    mod inherited_windows_context {
        use std::{
            ffi::c_void,
            mem,
            sync::{
                Once,
                atomic::{AtomicUsize, Ordering},
            },
        };

        type Handle = *mut c_void;
        type Bool = i32;
        type StartRoutine = unsafe extern "system" fn(*mut c_void) -> u32;
        type CreateThreadFn = unsafe extern "system" fn(
            *mut c_void,
            usize,
            Option<StartRoutine>,
            *mut c_void,
            u32,
            *mut u32,
        ) -> Handle;
        type CreateProcessWFn = unsafe extern "system" fn(
            *const u16,
            *mut u16,
            *mut c_void,
            *mut c_void,
            Bool,
            u32,
            *mut c_void,
            *const u16,
            *mut c_void,
            *mut c_void,
        ) -> Bool;

        #[link(name = "kernel32")]
        unsafe extern "system" {
            fn GetModuleHandleW(name: *const u16) -> Handle;
            fn VirtualProtect(
                address: *mut c_void,
                size: usize,
                protection: u32,
                previous: *mut u32,
            ) -> Bool;
            fn GetEnvironmentStringsW() -> *mut u16;
            fn FreeEnvironmentStringsW(block: *mut u16) -> Bool;
        }

        const PAGE_READWRITE: u32 = 0x04;
        const CREATE_UNICODE_ENVIRONMENT: u32 = 0x400;
        const IMAGE_DIRECTORY_ENTRY_IMPORT: usize = 1;
        const IMAGE_ORDINAL_FLAG64: u64 = 1 << 63;
        const CONTEXT_PREFIX: &str = "SUPERCOV_RUST_CONTEXT_ID=";

        static REAL_CREATE_THREAD: AtomicUsize = AtomicUsize::new(0);
        static REAL_CREATE_PROCESS_W: AtomicUsize = AtomicUsize::new(0);
        static INSTALL: Once = Once::new();

        pub fn install() {
            // SAFETY: the executable image is mapped for the life of the
            // process and only its own import table is rewritten.
            INSTALL.call_once(|| unsafe { patch_imports() });
        }

        /// POSIX interposition is in force from the first instruction; a
        /// thread spawned before any probe fires -- in a child process that
        /// inherits its context from the environment, say -- is still seen.
        /// The CRT runs every pointer in `.CRT$XCU` before main, which is the
        /// Windows form of that, so the table is patched there as well as
        /// when the transport opens.
        unsafe extern "C" fn install_at_start() {
            install();
        }

        #[used]
        #[unsafe(link_section = ".CRT$XCU")]
        static INSTALL_AT_START: unsafe extern "C" fn() = install_at_start;

        unsafe fn read<T: Copy>(address: usize) -> T {
            // SAFETY: callers pass addresses inside the mapped image that the
            // PE headers declare.
            unsafe { std::ptr::read_unaligned(address as *const T) }
        }

        unsafe fn patch_imports() {
            // SAFETY: a null name asks for the executable's own module.
            let base = unsafe { GetModuleHandleW(std::ptr::null()) } as usize;
            if base == 0 {
                return;
            }
            // IMAGE_DOS_HEADER: "MZ", with e_lfanew at 0x3c.
            if unsafe { read::<u16>(base) } != 0x5a4d {
                return;
            }
            let nt = base + unsafe { read::<u32>(base + 0x3c) } as usize;
            // "PE\0\0", then IMAGE_FILE_HEADER (20 bytes), then the optional
            // header, whose PE32+ magic is 0x20b and whose data directories
            // start at offset 112.
            if unsafe { read::<u32>(nt) } != 0x0000_4550 {
                return;
            }
            let optional = nt + 4 + 20;
            if unsafe { read::<u16>(optional) } != 0x20b {
                return;
            }
            let import_rva =
                unsafe { read::<u32>(optional + 112 + IMAGE_DIRECTORY_ENTRY_IMPORT * 8) } as usize;
            if import_rva == 0 {
                return;
            }
            let mut descriptor = base + import_rva;
            loop {
                // IMAGE_IMPORT_DESCRIPTOR: OriginalFirstThunk, TimeDateStamp,
                // ForwarderChain, Name, FirstThunk -- 20 bytes, zero-terminated.
                let names_rva = unsafe { read::<u32>(descriptor) } as usize;
                let name_rva = unsafe { read::<u32>(descriptor + 12) } as usize;
                let table_rva = unsafe { read::<u32>(descriptor + 16) } as usize;
                if name_rva == 0 && table_rva == 0 {
                    break;
                }
                if names_rva != 0 && table_rva != 0 {
                    let mut index = 0_usize;
                    loop {
                        let entry = unsafe { read::<u64>(base + names_rva + index * 8) };
                        if entry == 0 {
                            break;
                        }
                        if entry & IMAGE_ORDINAL_FLAG64 == 0 {
                            // IMAGE_IMPORT_BY_NAME: a u16 hint, then the name.
                            let name = base + entry as usize + 2;
                            let slot = base + table_rva + index * 8;
                            if unsafe { name_is(name, b"CreateThread") } {
                                unsafe {
                                    replace(slot, create_thread as *const () as usize, &REAL_CREATE_THREAD)
                                };
                            } else if unsafe { name_is(name, b"CreateProcessW") } {
                                unsafe {
                                    replace(
                                        slot,
                                        create_process_w as *const () as usize,
                                        &REAL_CREATE_PROCESS_W,
                                    )
                                };
                            }
                        }
                        index += 1;
                    }
                }
                descriptor += 20;
            }
        }

        unsafe fn name_is(address: usize, expected: &[u8]) -> bool {
            for (offset, byte) in expected.iter().enumerate() {
                if unsafe { read::<u8>(address + offset) } != *byte {
                    return false;
                }
            }
            (unsafe { read::<u8>(address + expected.len()) }) == 0
        }

        /// Point one import slot at the replacement, remembering the real
        /// function the first time. A second slot with the same name imports
        /// the same kernel32 export, so the first original serves both.
        unsafe fn replace(slot: usize, replacement: usize, original: &AtomicUsize) {
            let current = unsafe { read::<usize>(slot) };
            if current == 0 || current == replacement {
                return;
            }
            let _ = original.compare_exchange(0, current, Ordering::AcqRel, Ordering::Acquire);
            let mut previous = 0_u32;
            // SAFETY: the slot lies inside the image's import table.
            if unsafe {
                VirtualProtect(
                    slot as *mut c_void,
                    mem::size_of::<usize>(),
                    PAGE_READWRITE,
                    &mut previous,
                )
            } == 0
            {
                return;
            }
            // SAFETY: the page is writable now and the slot is pointer-sized.
            unsafe { std::ptr::write_unaligned(slot as *mut usize, replacement) };
            let mut ignored = 0_u32;
            // SAFETY: restores the protection VirtualProtect reported.
            let _ = unsafe {
                VirtualProtect(
                    slot as *mut c_void,
                    mem::size_of::<usize>(),
                    previous,
                    &mut ignored,
                )
            };
        }

        struct ThreadStart {
            routine: StartRoutine,
            argument: *mut c_void,
            context: u64,
        }

        unsafe extern "system" fn run_with_context(opaque: *mut c_void) -> u32 {
            // SAFETY: CreateThread received exactly one Box allocation from
            // the hook and starts this routine at most once.
            let start = unsafe { Box::from_raw(opaque.cast::<ThreadStart>()) };
            // The thread runs under a fresh derived thread-phase context, so
            // a thread that outlives its creating test can be detected and
            // failed closed to background instead of contaminating the test.
            let previous = super::enter_thread_context(start.context);
            // SAFETY: the original routine and argument came directly from
            // the caller's CreateThread invocation.
            let result = unsafe { (start.routine)(start.argument) };
            super::exit_thread_context(previous);
            result
        }

        unsafe extern "system" fn create_thread(
            attributes: *mut c_void,
            stack_size: usize,
            routine: Option<StartRoutine>,
            argument: *mut c_void,
            flags: u32,
            thread_id: *mut u32,
        ) -> Handle {
            // SAFETY: the slot was patched only after the real address was
            // stored, and that address has CreateThreadFn's ABI.
            let real = unsafe {
                mem::transmute::<usize, CreateThreadFn>(REAL_CREATE_THREAD.load(Ordering::Acquire))
            };
            let context = super::active_context();
            let Some(routine) = routine else {
                // SAFETY: forwarded unchanged to the platform.
                return unsafe { real(attributes, stack_size, None, argument, flags, thread_id) };
            };
            if matches!(context, 0 | u64::MAX) {
                // SAFETY: forwarded unchanged to the platform.
                return unsafe {
                    real(attributes, stack_size, Some(routine), argument, flags, thread_id)
                };
            }
            let raw = Box::into_raw(Box::new(ThreadStart {
                routine,
                argument,
                context,
            }))
            .cast::<c_void>();
            // SAFETY: run_with_context has the platform start-routine ABI and
            // owns raw only if the thread was created.
            let handle = unsafe {
                real(
                    attributes,
                    stack_size,
                    Some(run_with_context),
                    raw,
                    flags,
                    thread_id,
                )
            };
            if handle.is_null() {
                // SAFETY: a failed CreateThread never handed raw to a thread,
                // so it is reclaimed exactly once here.
                unsafe { drop(Box::from_raw(raw.cast::<ThreadStart>())) };
            }
            handle
        }

        unsafe extern "system" fn create_process_w(
            application: *const u16,
            command_line: *mut u16,
            process_attributes: *mut c_void,
            thread_attributes: *mut c_void,
            inherit_handles: Bool,
            flags: u32,
            environment: *mut c_void,
            current_directory: *const u16,
            startup: *mut c_void,
            information: *mut c_void,
        ) -> Bool {
            // SAFETY: as for create_thread.
            let real = unsafe {
                mem::transmute::<usize, CreateProcessWFn>(
                    REAL_CREATE_PROCESS_W.load(Ordering::Acquire),
                )
            };
            let context = super::active_context();
            let replacement = if matches!(context, 0 | u64::MAX) {
                None
            } else {
                // SAFETY: the caller's block is read only for the duration of
                // this synchronous call.
                unsafe { child_environment(environment, flags, context) }
            };
            match replacement {
                // SAFETY: every argument but the environment block and the
                // flag describing it is forwarded unchanged; the block lives
                // until the call returns.
                Some(mut block) => unsafe {
                    real(
                        application,
                        command_line,
                        process_attributes,
                        thread_attributes,
                        inherit_handles,
                        flags | CREATE_UNICODE_ENVIRONMENT,
                        block.as_mut_ptr().cast(),
                        current_directory,
                        startup,
                        information,
                    )
                },
                // SAFETY: forwarded unchanged to the platform.
                None => unsafe {
                    real(
                        application,
                        command_line,
                        process_attributes,
                        thread_attributes,
                        inherit_handles,
                        flags,
                        environment,
                        current_directory,
                        startup,
                        information,
                    )
                },
            }
        }

        /// The child's environment block with the active context in place of
        /// the inherited one. `None` leaves the call untouched: an ANSI block
        /// this runtime does not rewrite, or a block from which the variable
        /// was removed -- absence is meaningful, as on POSIX: Command::env_remove
        /// opts the child into authenticated background attribution.
        unsafe fn child_environment(
            environment: *mut c_void,
            flags: u32,
            context: u64,
        ) -> Option<Vec<u16>> {
            let source = if environment.is_null() {
                // SAFETY: the block returned is owned by this process until
                // freed below.
                let strings = unsafe { GetEnvironmentStringsW() };
                if strings.is_null() {
                    return None;
                }
                let copied = unsafe { copy_block(strings) };
                let _ = unsafe { FreeEnvironmentStringsW(strings) };
                copied
            } else if flags & CREATE_UNICODE_ENVIRONMENT == 0 {
                return None;
            } else {
                // SAFETY: a non-null Unicode block is double-NUL-terminated.
                unsafe { copy_block(environment.cast::<u16>()) }
            };
            let mut block = Vec::with_capacity(source.len() + 64);
            let mut found = false;
            for entry in source.split(|unit| *unit == 0) {
                if entry.is_empty() {
                    continue;
                }
                if has_prefix_ignore_ascii_case(entry, CONTEXT_PREFIX) {
                    found = true;
                    continue;
                }
                block.extend_from_slice(entry);
                block.push(0);
            }
            if !found {
                return None;
            }
            block.extend(format!("{CONTEXT_PREFIX}{context:016x}").encode_utf16());
            block.push(0);
            block.push(0);
            Some(block)
        }

        /// Copy a block of NUL-terminated UTF-16 strings ended by an empty one.
        unsafe fn copy_block(block: *const u16) -> Vec<u16> {
            let mut copied = Vec::new();
            let mut index = 0_usize;
            loop {
                // SAFETY: the block is terminated by two NULs, and reading
                // stops at the second.
                let unit = unsafe { *block.add(index) };
                copied.push(unit);
                if unit == 0 && (index == 0 || copied[index - 1] == 0) {
                    break;
                }
                index += 1;
            }
            copied
        }

        /// Environment names are case-insensitive on Windows.
        fn has_prefix_ignore_ascii_case(entry: &[u16], prefix: &str) -> bool {
            entry.len() >= prefix.len()
                && entry
                    .iter()
                    .zip(prefix.bytes())
                    .all(|(unit, byte)| {
                        u8::try_from(*unit).is_ok_and(|unit| unit.eq_ignore_ascii_case(&byte))
                    })
        }
    }

    struct Transport {
        pointer: *mut u8,
        length: usize,
        descriptor_capacity: u32,
        payload_capacity: u32,
        payload_base: usize,
        context_id: u64,
    }

    // SAFETY: all shared mutations use disjoint atomically reserved regions;
    // publication uses a release-store descriptor commit byte.
    unsafe impl Send for Transport {}
    unsafe impl Sync for Transport {}

    #[cfg(any(
        all(
            target_os = "macos",
            any(target_arch = "aarch64", target_arch = "x86_64")
        ),
        all(
            target_os = "linux",
            any(target_env = "gnu", target_env = "musl"),
            any(target_arch = "aarch64", target_arch = "x86_64")
        ),
        all(
            target_os = "windows",
            any(target_arch = "aarch64", target_arch = "x86_64")
        )
    ))]
    impl Transport {
        fn open() -> Option<Self> {
            let path = std::env::var_os("SUPERCOV_RUST_TRANSPORT_FILE")?;
            let token = parse_token(&std::env::var("SUPERCOV_RUST_TRANSPORT_TOKEN").ok()?)?;
            let context_id = match std::env::var(CONTEXT_ENV) {
                Ok(value) => parse_context(&value)?,
                Err(std::env::VarError::NotPresent) => 0,
                Err(std::env::VarError::NotUnicode(_)) => return None,
            };
            let (pointer, length) = mapping::map(&path, HEADER_SIZE)?;
            let parsed = (|| {
                // SAFETY: the mapping has at least HEADER_SIZE readable bytes.
                let header = unsafe { std::slice::from_raw_parts(pointer, HEADER_SIZE) };
                if header.get(..8) != Some(MAGIC.as_slice())
                    || read_u32(header, 8)? != VERSION
                    || read_u32(header, 12)? != HEADER_SIZE as u32
                    || read_u32(header, 16)? != DESCRIPTOR_SIZE as u32
                    || read_u32(header, 28)? != ENDIAN_MARKER
                    || header.get(TOKEN_OFFSET..TOKEN_OFFSET + TOKEN_SIZE)? != token
                    || header.get(52..56)? != [0; 4]
                    || header.get(88..HEADER_SIZE)? != [0; 40]
                {
                    return None;
                }
                let descriptor_capacity = read_u32(header, 20)?;
                let payload_capacity = read_u32(header, 24)?;
                if descriptor_capacity == 0 || payload_capacity == 0 {
                    return None;
                }
                let payload_base = HEADER_SIZE.checked_add(
                    usize::try_from(descriptor_capacity)
                        .ok()?
                        .checked_mul(DESCRIPTOR_SIZE)?,
                )?;
                (payload_base.checked_add(usize::try_from(payload_capacity).ok()?)? == length)
                    .then_some((descriptor_capacity, payload_capacity, payload_base))
            })();
            let Some((descriptor_capacity, payload_capacity, payload_base)) = parsed else {
                // SAFETY: this is the exact mapping the platform returned and
                // it has not been transferred into a Transport.
                unsafe { mapping::unmap(pointer, length) };
                return None;
            };
            let transport = Self {
                pointer,
                length,
                descriptor_capacity,
                payload_capacity,
                payload_base,
                context_id,
            };
            transport
                .atomic_u64(ATTACHMENTS_OFFSET)
                .fetch_add(1, Ordering::Relaxed);
            Some(transport)
        }

        fn atomic_u64(&self, offset: usize) -> &AtomicU64 {
            // SAFETY: header offsets are aligned within the page-aligned map.
            unsafe { &*self.pointer.add(offset).cast::<AtomicU64>() }
        }

        /// A nonce for derived phase identities, drawn from the shared header
        /// so every attached process takes from one sequence.
        fn next_phase_nonce(&self) -> u64 {
            self.atomic_u64(NEXT_PHASE_OFFSET)
                .fetch_add(1, Ordering::Relaxed)
        }

        fn dropped(&self) {
            self.atomic_u64(DROPPED_OFFSET).fetch_add(1, Ordering::Relaxed);
        }

        fn active_context(&self) -> u64 {
            CONTEXT_OVERRIDE.with(Cell::get).unwrap_or(self.context_id)
        }

        fn record(&self, kind: u8, outcome: u8, id: &str, values: &[u8]) {
            self.record_in_context(kind, outcome, id, values, self.active_context());
        }

        fn record_in_context(
            &self,
            kind: u8,
            outcome: u8,
            id: &str,
            values: &[u8],
            context_id: u64,
        ) {
            let Ok(id_length) = u32::try_from(id.len()) else {
                self.dropped();
                return;
            };
            let Ok(value_length) = u32::try_from(values.len()) else {
                self.dropped();
                return;
            };
            let Some(payload_length) = id_length.checked_add(value_length) else {
                self.dropped();
                return;
            };
            let descriptor = self
                .atomic_u64(NEXT_DESCRIPTOR_OFFSET)
                .fetch_add(1, Ordering::Relaxed);
            if descriptor >= u64::from(self.descriptor_capacity) {
                self.dropped();
                return;
            }
            let payload = self
                .atomic_u64(NEXT_PAYLOAD_OFFSET)
                .fetch_add(u64::from(payload_length), Ordering::Relaxed);
            if payload.saturating_add(u64::from(payload_length))
                > u64::from(self.payload_capacity)
            {
                self.dropped();
                return;
            }
            let descriptor_offset = HEADER_SIZE + descriptor as usize * DESCRIPTOR_SIZE;
            let payload_offset = self.payload_base + payload as usize;
            // SAFETY: the two atomic reservations prove these descriptor and
            // payload ranges are in-bounds and disjoint from every writer.
            unsafe {
                let descriptor_pointer = self.pointer.add(descriptor_offset);
                descriptor_pointer.add(1).write(kind);
                descriptor_pointer.add(2).write(outcome);
                descriptor_pointer.add(3).write(0);
                write_u32(descriptor_pointer, 4, std::process::id());
                write_u64(descriptor_pointer, 8, context_id);
                write_u32(descriptor_pointer, 16, payload as u32);
                write_u32(descriptor_pointer, 20, payload_length);
                write_u32(descriptor_pointer, 24, id_length);
                write_u32(descriptor_pointer, 28, value_length);
                write_u64(
                    descriptor_pointer,
                    32,
                    checksum(
                        kind,
                        outcome,
                        std::process::id(),
                        context_id,
                        payload as u32,
                        payload_length,
                        id_length,
                        value_length,
                        id.as_bytes(),
                        values,
                    ),
                );
                std::ptr::copy_nonoverlapping(id.as_ptr(), self.pointer.add(payload_offset), id.len());
                std::ptr::copy_nonoverlapping(
                    values.as_ptr(),
                    self.pointer.add(payload_offset + id.len()),
                    values.len(),
                );
                (&*descriptor_pointer.cast::<AtomicU8>()).store(1, Ordering::Release);
            }
        }

        fn reserve_decision(
            &self,
            id_high: u64,
            id_low: u32,
            conditions: usize,
        ) -> u64 {
            let id = decision_id(id_high, id_low);
            let id_length = DECISION_ID_LENGTH;
            let Ok(value_length) = u32::try_from(conditions) else {
                self.dropped();
                return 0;
            };
            let Some(payload_length) = id_length.checked_add(value_length) else {
                self.dropped();
                return 0;
            };
            let descriptor = self
                .atomic_u64(NEXT_DESCRIPTOR_OFFSET)
                .fetch_add(1, Ordering::Relaxed);
            if descriptor >= u64::from(self.descriptor_capacity) {
                self.dropped();
                return 0;
            }
            let payload = self
                .atomic_u64(NEXT_PAYLOAD_OFFSET)
                .fetch_add(u64::from(payload_length), Ordering::Relaxed);
            if payload.saturating_add(u64::from(payload_length))
                > u64::from(self.payload_capacity)
            {
                self.dropped();
                return 0;
            }
            let descriptor_offset = HEADER_SIZE + descriptor as usize * DESCRIPTOR_SIZE;
            let payload_offset = self.payload_base + payload as usize;
            let context_id = self.active_context();
            // SAFETY: reservations are in-bounds and private to this frame.
            // The commit byte remains zero until decision_finish publishes the
            // complete vector; process death therefore becomes explicit
            // incomplete health instead of silent loss.
            unsafe {
                let descriptor_pointer = self.pointer.add(descriptor_offset);
                descriptor_pointer.add(1).write(KIND_DECISION);
                descriptor_pointer.add(2).write(0);
                descriptor_pointer.add(3).write(0);
                write_u32(descriptor_pointer, 4, std::process::id());
                write_u64(descriptor_pointer, 8, context_id);
                write_u32(descriptor_pointer, 16, payload as u32);
                write_u32(descriptor_pointer, 20, payload_length);
                write_u32(descriptor_pointer, 24, id_length);
                write_u32(descriptor_pointer, 28, value_length);
                write_u64(descriptor_pointer, 32, 0);
                std::ptr::copy_nonoverlapping(id.as_ptr(), self.pointer.add(payload_offset), id.len());
                std::ptr::write_bytes(
                    self.pointer.add(payload_offset + id.len()),
                    0,
                    conditions,
                );
            }
            descriptor + 1
        }

        fn decision_condition(&self, token: u64, index: usize, value: bool) {
            let Some(descriptor) = token.checked_sub(1) else {
                return;
            };
            if descriptor >= u64::from(self.descriptor_capacity) {
                return;
            }
            let descriptor_offset = HEADER_SIZE + descriptor as usize * DESCRIPTOR_SIZE;
            // SAFETY: the descriptor index is in-bounds. Only the evaluation
            // owning this token mutates its uncommitted value bytes.
            unsafe {
                let pointer = self.pointer.add(descriptor_offset);
                if (&*pointer.cast::<AtomicU8>()).load(Ordering::Acquire) != 0 {
                    return;
                }
                let bytes = std::slice::from_raw_parts(pointer, DESCRIPTOR_SIZE);
                if bytes[1] != KIND_DECISION
                    || read_u32(bytes, 4) != Some(std::process::id())
                {
                    return;
                }
                let Some(payload) = read_u32(bytes, 16).map(usize::try_from).and_then(Result::ok)
                else {
                    return;
                };
                let Some(id_length) = read_u32(bytes, 24).map(usize::try_from).and_then(Result::ok)
                else {
                    return;
                };
                let Some(value_length) =
                    read_u32(bytes, 28).map(usize::try_from).and_then(Result::ok)
                else {
                    return;
                };
                if index >= value_length
                    || payload
                        .checked_add(id_length)
                        .and_then(|start| start.checked_add(value_length))
                        .is_none_or(|end| end > self.payload_capacity as usize)
                {
                    return;
                }
                self.pointer
                    .add(self.payload_base + payload + id_length + index)
                    .write(if value { 2 } else { 1 });
            }
        }

        fn finish_decision(&self, token: u64, outcome: bool) {
            let Some(descriptor) = token.checked_sub(1) else {
                return;
            };
            if descriptor >= u64::from(self.descriptor_capacity) {
                return;
            }
            let descriptor_offset = HEADER_SIZE + descriptor as usize * DESCRIPTOR_SIZE;
            // SAFETY: the descriptor and its reserved payload are in-bounds;
            // this evaluation is the sole writer before the release commit.
            unsafe {
                let pointer = self.pointer.add(descriptor_offset);
                if (&*pointer.cast::<AtomicU8>()).load(Ordering::Acquire) != 0 {
                    return;
                }
                let bytes = std::slice::from_raw_parts(pointer, DESCRIPTOR_SIZE);
                if bytes[1] != KIND_DECISION
                    || read_u32(bytes, 4) != Some(std::process::id())
                {
                    return;
                }
                let Some(context_id) = read_u64(bytes, 8) else {
                    return;
                };
                let Some(payload) = read_u32(bytes, 16) else {
                    return;
                };
                let Some(payload_length) = read_u32(bytes, 20) else {
                    return;
                };
                let Some(id_length) = read_u32(bytes, 24) else {
                    return;
                };
                let Some(value_length) = read_u32(bytes, 28) else {
                    return;
                };
                if id_length.checked_add(value_length) != Some(payload_length)
                    || u64::from(payload).saturating_add(u64::from(payload_length))
                        > u64::from(self.payload_capacity)
                {
                    return;
                }
                let payload_pointer = self.pointer.add(self.payload_base + payload as usize);
                let id = std::slice::from_raw_parts(payload_pointer, id_length as usize);
                let values = std::slice::from_raw_parts(
                    payload_pointer.add(id_length as usize),
                    value_length as usize,
                );
                let outcome = u8::from(outcome);
                pointer.add(2).write(outcome);
                write_u64(
                    pointer,
                    32,
                    checksum(
                        KIND_DECISION,
                        outcome,
                        std::process::id(),
                        context_id,
                        payload,
                        payload_length,
                        id_length,
                        value_length,
                        id,
                        values,
                    ),
                );
                (&*pointer.cast::<AtomicU8>()).store(1, Ordering::Release);
            }
        }

        fn reserve_ordinal(&self) -> u64 {
            let descriptor = self
                .atomic_u64(NEXT_DESCRIPTOR_OFFSET)
                .fetch_add(1, Ordering::Relaxed);
            if descriptor >= u64::from(self.descriptor_capacity) {
                self.dropped();
                return 0;
            }
            let payload = self
                .atomic_u64(NEXT_PAYLOAD_OFFSET)
                .fetch_add(8, Ordering::Relaxed);
            if payload.saturating_add(8) > u64::from(self.payload_capacity) {
                self.dropped();
                return 0;
            }
            let descriptor_offset = HEADER_SIZE + descriptor as usize * DESCRIPTOR_SIZE;
            // SAFETY: reservations are in-bounds and private to this frame.
            // The first terminal branch observation writes the ordinal and
            // commits the descriptor; interruption remains explicit health.
            unsafe {
                let pointer = self.pointer.add(descriptor_offset);
                pointer.add(1).write(KIND_ORDINAL_HIT);
                pointer.add(2).write(0);
                pointer.add(3).write(0);
                write_u32(pointer, 4, std::process::id());
                write_u64(pointer, 8, self.active_context());
                write_u32(pointer, 16, payload as u32);
                write_u32(pointer, 20, 8);
                write_u32(pointer, 24, 0);
                write_u32(pointer, 28, 8);
                write_u64(pointer, 32, 0);
            }
            descriptor + 1
        }

        fn finish_ordinal(&self, token: u64, ordinal: u64) {
            let Some(descriptor) = token.checked_sub(1) else {
                return;
            };
            if descriptor >= u64::from(self.descriptor_capacity) {
                return;
            }
            let descriptor_offset = HEADER_SIZE + descriptor as usize * DESCRIPTOR_SIZE;
            // SAFETY: the descriptor and its eight-byte payload were reserved
            // together. The release commit publishes exactly one alternative.
            unsafe {
                let pointer = self.pointer.add(descriptor_offset);
                if (&*pointer.cast::<AtomicU8>()).load(Ordering::Acquire) != 0 {
                    return;
                }
                let bytes = std::slice::from_raw_parts(pointer, DESCRIPTOR_SIZE);
                if bytes[1] != KIND_ORDINAL_HIT
                    || read_u32(bytes, 4) != Some(std::process::id())
                    || read_u32(bytes, 20) != Some(8)
                    || read_u32(bytes, 24) != Some(0)
                    || read_u32(bytes, 28) != Some(8)
                {
                    return;
                }
                let Some(context_id) = read_u64(bytes, 8) else {
                    return;
                };
                let Some(payload) = read_u32(bytes, 16) else {
                    return;
                };
                if u64::from(payload).saturating_add(8) > u64::from(self.payload_capacity) {
                    return;
                }
                let payload_pointer = self.pointer.add(self.payload_base + payload as usize);
                write_u64(payload_pointer, 0, ordinal);
                let values = std::slice::from_raw_parts(payload_pointer, 8);
                write_u64(
                    pointer,
                    32,
                    checksum(
                        KIND_ORDINAL_HIT,
                        0,
                        std::process::id(),
                        context_id,
                        payload,
                        8,
                        0,
                        8,
                        &[],
                        values,
                    ),
                );
                (&*pointer.cast::<AtomicU8>()).store(1, Ordering::Release);
            }
        }
    }

    #[cfg(not(any(
        all(
            target_os = "macos",
            any(target_arch = "aarch64", target_arch = "x86_64")
        ),
        all(
            target_os = "linux",
            any(target_env = "gnu", target_env = "musl"),
            any(target_arch = "aarch64", target_arch = "x86_64")
        ),
        all(
            target_os = "windows",
            any(target_arch = "aarch64", target_arch = "x86_64")
        )
    )))]
    impl Transport {
        fn open() -> Option<Self> {
            None
        }

        fn record(&self, _kind: u8, _outcome: u8, _id: &str, _values: &[u8]) {}

        fn active_context(&self) -> u64 {
            0
        }

        fn record_in_context(
            &self,
            _kind: u8,
            _outcome: u8,
            _id: &str,
            _values: &[u8],
            _context_id: u64,
        ) {
        }

        fn reserve_decision(
            &self,
            _id_high: u64,
            _id_low: u32,
            _conditions: usize,
        ) -> u64 {
            0
        }

        fn decision_condition(&self, _token: u64, _index: usize, _value: bool) {}

        fn finish_decision(&self, _token: u64, _outcome: bool) {}

        fn reserve_ordinal(&self) -> u64 {
            0
        }

        fn finish_ordinal(&self, _token: u64, _ordinal: u64) {}

        /// Without a mapping there is no shared sequence; a process-local one
        /// keeps derived identities distinct within this process. The stub
        /// had no such method and was never compiled until a Windows host
        /// ran the tests that build it.
        fn next_phase_nonce(&self) -> u64 {
            static NONCE: AtomicU64 = AtomicU64::new(0);
            NONCE.fetch_add(1, Ordering::Relaxed)
        }
    }

    impl Drop for Transport {
        fn drop(&mut self) {
            // SAFETY: this is the exact live mapping the platform returned.
            unsafe { unmap_mapping(self.pointer, self.length) }
        }
    }

    #[cfg(any(
        all(
            target_os = "macos",
            any(target_arch = "aarch64", target_arch = "x86_64")
        ),
        all(
            target_os = "linux",
            any(target_env = "gnu", target_env = "musl"),
            any(target_arch = "aarch64", target_arch = "x86_64")
        ),
        all(
            target_os = "windows",
            any(target_arch = "aarch64", target_arch = "x86_64")
        )
    ))]
    unsafe fn unmap_mapping(pointer: *mut u8, length: usize) {
        // SAFETY: the caller owns the exact live mapping and length.
        unsafe { mapping::unmap(pointer, length) }
    }

    #[cfg(not(any(
        all(
            target_os = "macos",
            any(target_arch = "aarch64", target_arch = "x86_64")
        ),
        all(
            target_os = "linux",
            any(target_env = "gnu", target_env = "musl"),
            any(target_arch = "aarch64", target_arch = "x86_64")
        ),
        all(
            target_os = "windows",
            any(target_arch = "aarch64", target_arch = "x86_64")
        )
    )))]
    unsafe fn unmap_mapping(_pointer: *mut u8, _length: usize) {}

    fn read_u32(source: &[u8], offset: usize) -> Option<u32> {
        Some(u32::from_le_bytes(source.get(offset..offset + 4)?.try_into().ok()?))
    }

    fn read_u64(source: &[u8], offset: usize) -> Option<u64> {
        Some(u64::from_le_bytes(source.get(offset..offset + 8)?.try_into().ok()?))
    }

    fn decision_id(id_high: u64, id_low: u32) -> [u8; DECISION_ID_LENGTH as usize] {
        const HEX: &[u8; 16] = b"0123456789abcdef";
        let mut output = [0; DECISION_ID_LENGTH as usize];
        output[..DECISION_ID_PREFIX.len()].copy_from_slice(DECISION_ID_PREFIX);
        let mut offset = DECISION_ID_PREFIX.len();
        for shift in (0..16).rev() {
            output[offset] = HEX[((id_high >> (shift * 4)) & 0xf) as usize];
            offset += 1;
        }
        for shift in (0..8).rev() {
            output[offset] = HEX[((u64::from(id_low) >> (shift * 4)) & 0xf) as usize];
            offset += 1;
        }
        output
    }

    fn parse_token(value: &str) -> Option<[u8; TOKEN_SIZE]> {
        if value.len() != TOKEN_SIZE * 2 {
            return None;
        }
        let mut token = [0_u8; TOKEN_SIZE];
        for (index, slot) in token.iter_mut().enumerate() {
            *slot = u8::from_str_radix(&value[index * 2..index * 2 + 2], 16).ok()?;
        }
        Some(token)
    }

    fn parse_context(value: &str) -> Option<u64> {
        (value.len() == 16)
            .then(|| u64::from_str_radix(value, 16).ok())
            .flatten()
    }

    unsafe fn write_u32(target: *mut u8, offset: usize, value: u32) {
        for (index, byte) in value.to_le_bytes().into_iter().enumerate() {
            // SAFETY: caller proves the descriptor range is writable.
            unsafe { target.add(offset + index).write(byte) };
        }
    }

    unsafe fn write_u64(target: *mut u8, offset: usize, value: u64) {
        for (index, byte) in value.to_le_bytes().into_iter().enumerate() {
            // SAFETY: caller proves the descriptor range is writable.
            unsafe { target.add(offset + index).write(byte) };
        }
    }

    #[allow(clippy::too_many_arguments)]
    fn checksum(
        kind: u8,
        outcome: u8,
        pid: u32,
        context: u64,
        payload_offset: u32,
        payload_length: u32,
        id_length: u32,
        value_length: u32,
        id: &[u8],
        values: &[u8],
    ) -> u64 {
        let mut value = 0xcbf2_9ce4_8422_2325_u64;
        for byte in [kind, outcome]
            .into_iter()
            .chain(pid.to_le_bytes())
            .chain(context.to_le_bytes())
            .chain(payload_offset.to_le_bytes())
            .chain(payload_length.to_le_bytes())
            .chain(id_length.to_le_bytes())
            .chain(value_length.to_le_bytes())
            .chain(id.iter().copied())
            .chain(values.iter().copied())
        {
            value ^= u64::from(byte);
            value = value.wrapping_mul(0x0000_0100_0000_01b3);
        }
        value
    }

    fn thread_context_id(parent: u64, nonce: u64) -> u64 {
        let mut value = 0xcbf2_9ce4_8422_2325_u64;
        for byte in b"supercov-rust-thread-phase-v1\0"
            .iter()
            .copied()
            .chain(parent.to_le_bytes())
            .chain(nonce.to_le_bytes())
        {
            value ^= u64::from(byte);
            value = value.wrapping_mul(0x0000_0100_0000_01b3);
        }
        if matches!(value, 0 | u64::MAX) {
            value ^ 0xa5a5_5a5a_d3c3_b4b4
        } else {
            value
        }
    }

    /// Enter a fresh derived thread-phase context for an inherited native
    /// thread. Offline partitioning attributes the phase's records to the
    /// root test only when the matching thread-end record commits before the
    /// root test's boundary, so shared pool threads fail closed to background.
    pub fn enter_thread_context(parent: u64) -> u64 {
        debug_assert!(!matches!(parent, 0 | u64::MAX));
        let Some(transport) = transport() else {
            return enter_context(parent);
        };
        let nonce = transport.next_phase_nonce();
        let child = thread_context_id(parent, nonce);
        let mut definition = [0_u8; 16];
        definition[..8].copy_from_slice(&parent.to_le_bytes());
        definition[8..].copy_from_slice(&nonce.to_le_bytes());
        transport.record_in_context(KIND_THREAD_PHASE, 0, "", &definition, child);
        let previous = enter_context(child);
        debug_assert_eq!(previous, NO_CONTEXT_OVERRIDE);
        previous
    }

    /// Commit the thread-end record that bounds an inherited thread's phase.
    pub fn exit_thread_context(previous: u64) {
        if let Some(transport) = transport() {
            let child = transport.active_context();
            if !matches!(child, 0 | u64::MAX) {
                transport.record_in_context(KIND_THREAD_END, 0, "", &[], child);
            }
        }
        exit_context(previous);
    }

    /// Exit an exact test context, committing the test-boundary record that
    /// join-bounds every thread phase rooted in this test. A same-context
    /// re-entry (the MIR-instrumented test body running inside the libtest
    /// companion's context guard) is not the outermost exit, so only the
    /// enclosing exit commits the single authoritative boundary.
    #[inline(never)]
    pub fn exit_test_context(context_id: u64, previous: u64) {
        if previous != context_id
            && !matches!(context_id, 0 | u64::MAX)
            && let Some(transport) = transport()
        {
            transport.record_in_context(KIND_TEST_BOUNDARY, 0, "", &[], context_id);
        }
        exit_context(previous);
    }

    fn assertion_context_id(parent: u64, id_high: u64, id_low: u32, nonce: u64) -> u64 {
        let mut value = 0xcbf2_9ce4_8422_2325_u64;
        for byte in b"supercov-rust-assertion-phase-v2"
            .iter()
            .copied()
            .chain(parent.to_le_bytes())
            .chain(id_high.to_le_bytes())
            .chain(id_low.to_le_bytes())
            .chain(nonce.to_le_bytes())
        {
            value ^= u64::from(byte);
            value = value.wrapping_mul(0x0000_0100_0000_01b3);
        }
        if matches!(value, 0 | u64::MAX) {
            value ^ 0xa5a5_5a5a_d3c3_b4b4
        } else {
            value
        }
    }

    fn transport() -> Option<&'static Transport> {
        static TRANSPORT: OnceLock<Option<Transport>> = OnceLock::new();
        TRANSPORT
            .get_or_init(|| {
                let transport = Transport::open();
                if transport.is_some() {
                    install_platform_hooks();
                }
                transport
            })
            .as_ref()
    }

    /// POSIX hooks are exported symbols and need no installation; Windows
    /// hooks are written into the executable's import table once the
    /// transport is known to exist.
    #[cfg(all(
        target_os = "windows",
        any(target_arch = "aarch64", target_arch = "x86_64")
    ))]
    fn install_platform_hooks() {
        inherited_windows_context::install();
    }

    #[cfg(not(all(
        target_os = "windows",
        any(target_arch = "aarch64", target_arch = "x86_64")
    )))]
    fn install_platform_hooks() {}

    pub struct DecisionFrame {
        id: &'static str,
        values: Vec<u8>,
    }

    impl DecisionFrame {
        pub fn new(id: &'static str, conditions: usize) -> Self {
            Self {
                id,
                values: vec![0; conditions],
            }
        }
    }

    #[inline]
    pub fn hit(id: &'static str) {
        if let Some(transport) = transport() {
            transport.record(KIND_HIT, 0, id, &[]);
        }
    }

    // Anything `!` turns into a bool: `assert!(was_seen)` compiles with a
    // `&bool`, since the macro only negates its operand.
    #[inline]
    pub fn condition<V: std::ops::Not<Output = bool>>(
        value: V,
        frame: &mut DecisionFrame,
        index: usize,
    ) -> bool {
        let value = !!value;
        if let Some(slot) = frame.values.get_mut(index) {
            *slot = if value { 2 } else { 1 };
        }
        value
    }

    #[inline]
    pub fn decision(value: bool, frame: &mut DecisionFrame) -> bool {
        if let Some(transport) = transport() {
            transport.record(KIND_DECISION, u8::from(value), frame.id, &frame.values);
        }
        value
    }

    /// Begins one compiler-injected decision evaluation. The token is carried
    /// in a MIR local, so nested evaluations, parallel tests and thread
    /// migration cannot merge their ternary vectors. Its transport descriptor
    /// remains uncommitted until the decision outcome, making interrupted
    /// evaluations explicit reader health.
    #[inline(never)]
    pub fn mir_decision_start(id_high: u64, id_low: u32, conditions: u64) -> u64 {
        let Ok(conditions) = usize::try_from(conditions) else {
            return 0;
        };
        transport().map_or(0, |transport| {
            transport.reserve_decision(id_high, id_low, conditions)
        })
    }

    #[inline(never)]
    pub fn mir_decision_condition(token: u64, index: u64, value: bool) {
        let Ok(index) = usize::try_from(index) else {
            return;
        };
        if let Some(transport) = transport() {
            transport.decision_condition(token, index, value);
        }
    }

    #[inline(never)]
    pub fn mir_decision_finish(token: u64, outcome: bool) {
        if let Some(transport) = transport() {
            transport.finish_decision(token, outcome);
        }
    }

    /// Reserves one crash-visible branch-selection frame. The first selected
    /// alternative commits it; later loop checks cannot relabel the same
    /// invocation from entered to zero-iteration.
    #[inline(never)]
    pub fn mir_branch_start() -> u64 {
        transport().map_or(0, Transport::reserve_ordinal)
    }

    #[inline(never)]
    pub fn mir_branch_hit(token: u64, ordinal: u64) {
        if let Some(transport) = transport() {
            transport.finish_ordinal(token, ordinal);
        }
    }

    #[inline]
    pub fn ordinal_hit(ordinal: u64) {
        let Some(transport) = transport() else {
            return;
        };
        let context = transport.active_context();
        let novel = PUBLISHED_HITS
            .try_with(|published| {
                let mut published = published.borrow_mut();
                if published.0 != context {
                    published.0 = context;
                    published.1.clear();
                }
                published.1.insert(ordinal)
            })
            // During thread-local teardown the set is gone; publishing is always
            // the safe answer, since a duplicate record reads as one observation
            // while a missing one reads as uncovered code.
            .unwrap_or(true);
        if novel {
            transport.record_in_context(
                KIND_ORDINAL_HIT,
                0,
                "",
                &ordinal.to_le_bytes(),
                context,
            );
        }
    }

    #[inline(never)]
    pub fn active_context() -> u64 {
        transport().map_or(0, Transport::active_context)
    }

    #[inline(never)]
    pub fn enter_context(context_id: u64) -> u64 {
        debug_assert!(!matches!(context_id, 0 | u64::MAX));
        // A thread or child spawned inside this context must be seen by the
        // platform hooks, which install with the transport.
        let _ = transport();
        CONTEXT_OVERRIDE
            .with(|current| current.replace(Some(context_id)))
            .unwrap_or(NO_CONTEXT_OVERRIDE)
    }

    #[inline(never)]
    pub fn exit_context(previous: u64) {
        CONTEXT_OVERRIDE.with(|current| {
            current.set((previous != NO_CONTEXT_OVERRIDE).then_some(previous));
        });
    }

    #[inline(never)]
    pub fn enter_assertion_context(id_high: u64, id_low: u32) -> u64 {
        let Some(transport) = transport() else {
            return NO_CONTEXT_OVERRIDE;
        };
        let parent = transport.active_context();
        if parent == 0 {
            return NO_CONTEXT_OVERRIDE;
        }
        let nonce = transport.next_phase_nonce();
        let child = assertion_context_id(parent, id_high, id_low, nonce);
        let id = decision_id(id_high, id_low);
        // SAFETY: decision_id writes only the fixed ASCII prefix and lowercase
        // hexadecimal digits.
        let id = unsafe { std::str::from_utf8_unchecked(&id) };
        let mut definition = [0_u8; 16];
        definition[..8].copy_from_slice(&parent.to_le_bytes());
        definition[8..].copy_from_slice(&nonce.to_le_bytes());
        transport.record_in_context(KIND_PHASE, 0, id, &definition, child);
        enter_context(child)
    }
}
