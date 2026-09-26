//! Generated std-only runtime and strict reader for owned Rust probes.
//!
//! The target runtime writes an intentionally small append-only transport.
//! It never computes coverage. Rust reads, validates, de-duplicates and maps
//! these observations into the shared evidence-v3 model after test execution.

use serde::{Deserialize, Serialize};
use std::{
    collections::BTreeMap,
    fs,
    path::{Component, Path},
};

const RUST_PROBE_MAGIC: &str = "SUPERCOV-RUST-PROBE-1";

#[derive(Debug, Clone, PartialEq, Eq, Deserialize, Serialize)]
#[serde(rename_all = "camelCase", tag = "kind")]
pub enum RustProbeObservation {
    Hit {
        id: String,
    },
    Decision {
        id: String,
        values: Vec<Option<bool>>,
        outcome: bool,
    },
    /// Control passed a statement that asserts. A failing assertion panics,
    /// so reaching the marker means it held.
    Assertion {
        id: String,
    },
}

/// One record of an owned-runtime evidence file, with the thread that wrote
/// it. Evidence is appended under one mutex, so a file is in execution order,
/// but a test that spawns threads interleaves them: an assertion witnesses
/// its own thread's records and no other's.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct RustProbeEntry {
    pub thread: u64,
    pub observation: RustProbeObservation,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum RustProbeReadError {
    Io(String),
    UnsafeEntry(String),
    InvalidHeader,
    InvalidRecord(usize),
}

impl std::fmt::Display for RustProbeReadError {
    fn fmt(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::Io(error) => write!(formatter, "Rust probe I/O failed: {error}"),
            Self::UnsafeEntry(path) => write!(formatter, "unsafe Rust probe entry: {path}"),
            Self::InvalidHeader => write!(formatter, "invalid Rust probe header"),
            Self::InvalidRecord(line) => {
                write!(formatter, "invalid Rust probe record at line {line}")
            }
        }
    }
}

impl std::error::Error for RustProbeReadError {}

/// A thread ordinal: decimal, no sign, no padding, and small enough to parse.
fn valid_thread(value: &str) -> bool {
    !value.is_empty()
        && value.len() <= 20
        && value.bytes().all(|byte| byte.is_ascii_digit())
        && (value == "0" || !value.starts_with('0'))
        && value.parse::<u64>().is_ok()
}

pub(crate) fn valid_probe_id(id: &str) -> bool {
    let mut parts = id.split(':');
    matches!(parts.next(), Some("rs"))
        && matches!(
            parts.next(),
            Some("statement" | "function" | "decision" | "branch")
        )
        && parts.next().is_some_and(|digest| {
            digest.len() == 24 && digest.bytes().all(|byte| byte.is_ascii_hexdigit())
        })
        && parts.all(|suffix| {
            !suffix.is_empty()
                && suffix
                    .bytes()
                    .all(|byte| byte.is_ascii_alphanumeric() || matches!(byte, b'-' | b'_'))
        })
}

pub fn render_rust_runtime(module_name: &str, crate_key: &str) -> Result<String, String> {
    let valid_identifier = !module_name.is_empty()
        && module_name.bytes().enumerate().all(|(index, byte)| {
            byte == b'_' || byte.is_ascii_alphabetic() || (index > 0 && byte.is_ascii_digit())
        });
    if !valid_identifier {
        return Err("invalid Rust runtime module name".into());
    }
    if crate_key.len() != 24 || !crate_key.bytes().all(|byte| byte.is_ascii_hexdigit()) {
        return Err("invalid Rust runtime crate key".into());
    }

    Ok(format!(
        r#"
#[doc(hidden)]
// Injected code must be immune to the HOST crate's lint configuration: serde
// builds with `#![deny(warnings)]`, so this module's fully-qualified imports
// (required for no_std hosts) became hard errors as "unused imports".
#[allow(warnings)]
mod {module_name} {{
    // The host crate may be `#![no_std]` -- `bytes` is, and so is much of the
    // ecosystem's foundation. Nothing here can rely on the std prelude being in
    // scope, so std is brought in explicitly and every prelude item below is
    // written out in full. Without this the module does not compile and the
    // whole build fails, which is a hard failure rather than a degradation.
    extern crate std;
    // Every name is imported explicitly: this module is appended to a crate
    // root, and a crate root may be `no_std` or may turn the prelude off
    // outright (tracing's macro tests carry `#![no_implicit_prelude]`).
    use std::cmp::{{Ord, PartialEq, PartialOrd}};
    use std::convert::From;
    use std::fs::{{File, OpenOptions}};
    use std::io::Write as _;
    use std::iter::{{IntoIterator, Iterator}};
    use std::marker::Sized;
    use std::mem::drop;
    use std::option::Option::{{self, None, Some}};
    use std::result::Result::{{self, Err, Ok}};
    use std::string::String;
    use std::sync::atomic::{{AtomicBool, AtomicU8, AtomicU64, AtomicUsize, Ordering}};
    use std::sync::{{Mutex, OnceLock}};
    use std::cell::Cell;
    use std::ops::ControlFlow;
    use std::task::Poll;
    use std::vec::Vec;

    const MAGIC: &[u8] = b"{RUST_PROBE_MAGIC}\n";
    const CRATE_KEY: &str = "{crate_key}";

    // NOTHING ON THE PROBE PATH MAY ALLOCATE.
    //
    // The crate under test may install a `#[global_allocator]` whose body -- or
    // anything it calls, at any depth -- carries probes. An allocating probe
    // then re-enters the allocator, which probes, which allocates. bytes-1.12.1
    // does this in tests/test_bytes_odd_alloc.rs and tests/test_bytes_vec_alloc.rs,
    // and both died with SIGSEGV before libtest could list a single test.
    //
    // A reentrancy flag cannot fix this, and the attempt is instructive: on
    // macOS the FIRST touch of a thread-local calls `_tlv_bootstrap`, which
    // allocates -- so the guard recursed inside its own initialisation, before
    // it could be consulted. A guard that must allocate to answer "am I already
    // allocating?" is unfixable. Not allocating at all is.
    //
    // Records are therefore built in a stack buffer and written with one call.
    // That also removes a malloc and a free from every probe, which is where
    // most of a probe's cost used to be.
    const RECORD_CAPACITY: usize = 256;

    /// The widest condition vector a decision can carry.
    ///
    /// Beyond this the frame refuses to record rather than emit a vector whose
    /// width disagrees with the manifest -- a malformed record the runner
    /// rejects, which is a wrong number rather than a missing one.
    const MAX_CONDITIONS: usize = 64;

    // A statement or function hit answers "did this ever run", so only the FIRST
    // sighting in a process carries information -- and each libtest case runs in
    // its own process, so first-in-process is first-in-test. Without this, a loop
    // writes one identical record per iteration: bytes'
    // advance_bytes_mut_remaining_capacity runs ~2.8M iterations and was still
    // writing syscalls after four minutes.
    //
    // The table is a fixed, open-addressed set of `&'static str` POINTERS, so it
    // never allocates and never grows -- both of which the probe path forbids.
    // A crowded table simply writes the record again: a duplicate costs time,
    // never correctness, whereas dropping one would cost a real observation.
    const SEEN_SLOTS: usize = 1 << 16;
    static SEEN: [AtomicUsize; SEEN_SLOTS] = [const {{ AtomicUsize::new(0) }}; SEEN_SLOTS];

    // Which thread wrote a record. Evidence is appended under one mutex, so
    // the file is in execution order -- but a test that spawns threads
    // interleaves them, and an assertion on one thread witnesses nothing on
    // another. Ordinals are handed out on a thread's first record; the main
    // test thread is 1.
    static NEXT_THREAD: AtomicU64 = AtomicU64::new(1);
    std::thread_local! {{
        static THREAD_ORDINAL: Cell<u64> = const {{ Cell::new(0) }};
    }}

    fn thread_ordinal() -> u64 {{
        THREAD_ORDINAL.with(|slot| {{
            let existing = slot.get();
            if existing != 0 {{
                return existing;
            }}
            let assigned = NEXT_THREAD.fetch_add(1, Ordering::Relaxed);
            slot.set(assigned);
            assigned
        }})
    }}

    /// Decimal digits of `value`, written into `record`.
    fn push_number(record: &mut [u8; RECORD_CAPACITY], length: &mut usize, value: u64) -> bool {{
        let mut digits = [0u8; 20];
        let mut count = 0;
        let mut rest = value;
        loop {{
            digits[count] = b'0' + (rest % 10) as u8;
            count += 1;
            rest /= 10;
            if rest == 0 {{
                break;
            }}
        }}
        let mut index = count;
        while index > 0 {{
            index -= 1;
            if !push(record, length, &[digits[index]]) {{
                return false;
            }}
        }}
        true
    }}

    // An assertion marker is deduped separately from hits: it names the
    // statement that asserts, and that statement's own hit has already been
    // recorded by the time control reaches the marker.
    const ASSERTED_SLOTS: usize = 1 << 12;
    static ASSERTED: [AtomicUsize; ASSERTED_SLOTS] =
        [const {{ AtomicUsize::new(0) }}; ASSERTED_SLOTS];

    #[inline(always)]
    fn first_assertion(id: &'static str) -> bool {{
        let key = id.as_ptr() as usize;
        let mut slot = (key >> 4) & (ASSERTED_SLOTS - 1);
        for _ in 0..8 {{
            let seen = ASSERTED[slot].load(Ordering::Relaxed);
            if seen == key {{
                return false;
            }}
            if seen == 0 {{
                match ASSERTED[slot].compare_exchange(0, key, Ordering::Relaxed, Ordering::Relaxed)
                {{
                    Ok(_) => return true,
                    Err(now) if now == key => return false,
                    Err(_) => {{}}
                }}
            }}
            slot = (slot + 1) & (ASSERTED_SLOTS - 1);
        }}
        true
    }}

    /// Control passed a statement that asserts, so every assertion in it
    /// held: a failing one panics instead. Evidence this thread wrote before
    /// this point was in scope for that check.
    #[inline(always)]
    pub fn assertion(id: &'static str) {{
        if first_assertion(id) {{
            record_assertion(id);
        }}
    }}

    #[inline(never)]
    fn record_assertion(id: &'static str) {{
        let mut record = [0u8; RECORD_CAPACITY];
        let mut length = 0;
        if push(&mut record, &mut length, b"A\t")
            && push_number(&mut record, &mut length, thread_ordinal())
            && push(&mut record, &mut length, b"\t")
            && push(&mut record, &mut length, id.as_bytes())
            && push(&mut record, &mut length, b"\n")
        {{
            write_record(&record[..length]);
        }}
    }}

    #[inline(always)]
    fn first_sighting(id: &'static str) -> bool {{
        let key = id.as_ptr() as usize;
        let mut slot = (key >> 4) & (SEEN_SLOTS - 1);
        for _ in 0..8 {{
            // Almost every call is a repeat, and a plain load settles it; the
            // CAS is for the one insertion.
            let seen = SEEN[slot].load(Ordering::Relaxed);
            if seen == key {{
                return false;
            }}
            if seen == 0 {{
                match SEEN[slot].compare_exchange(0, key, Ordering::Relaxed, Ordering::Relaxed) {{
                    Ok(_) => return true,
                    Err(now) if now == key => return false,
                    Err(_) => {{}}
                }}
            }}
            slot = (slot + 1) & (SEEN_SLOTS - 1);
        }}
        true
    }}

    // Decisions cannot collapse by id the way hits do: MC/DC needs the SET of
    // distinct condition vectors, so every vector must reach the log once. What
    // carries nothing is the REPEAT of a vector already seen, and in a loop that
    // is nearly all of them -- bytes' advance_bytes_mut_remaining_capacity took
    // 40.6s against a 0.367s baseline writing one syscall per evaluation across
    // ~2.8M iterations.
    //
    // Entries hold the whole record -- id pointer, outcome, width, values -- and
    // are compared word for word. A hash would be smaller and faster, but a
    // collision would silently drop a distinct vector and understate MC/DC, and
    // that is exactly the kind of wrong number this project refuses to risk.
    // A full probe chain falls back to writing, which costs a duplicate.
    //
    // The table is lock-free: a decision in a hot loop is evaluated millions
    // of times, and a mutex per evaluation was most of what a probe cost. A
    // slot's state goes 0 (empty) -> 1 (being written) -> 2 (readable); a
    // reader compares only readable slots, so a slot mid-write reads as
    // "different" and at worst costs one duplicate record.
    const DECISION_SLOTS: usize = 1 << 11;
    const DECISION_ENTRY: usize = 10 + MAX_CONDITIONS;
    const DECISION_WORDS: usize = DECISION_ENTRY.div_ceil(8);

    struct DecisionSlot {{
        state: AtomicU8,
        words: [AtomicU64; DECISION_WORDS],
    }}

    static DECISIONS: [DecisionSlot; DECISION_SLOTS] = [const {{
        DecisionSlot {{
            state: AtomicU8::new(0),
            words: [const {{ AtomicU64::new(0) }}; DECISION_WORDS],
        }}
    }}; DECISION_SLOTS];

    // This module is compiled in the crate's own profile -- unoptimized under
    // `cargo test` -- so the paths below are plain indexed loops: iterator
    // chains and closures cost real function calls there, and a decision in a
    // hot loop pays them millions of times.
    fn first_decision(frame: &DecisionFrame, outcome: bool) -> bool {{
        let key = frame.id.as_ptr() as usize;
        let conditions = if frame.conditions < MAX_CONDITIONS {{ frame.conditions }} else {{ MAX_CONDITIONS }};
        // Word 0 is the id pointer; word 1 starts with outcome and width, then
        // the condition values fill the remaining bytes. Entries of the same
        // width are zero beyond `used` words, and the width byte sits in word
        // 1, so comparing `used` words is exact.
        let mut words = [0u64; DECISION_WORDS];
        words[0] = key as u64;
        words[1] = (if outcome {{ 2u64 }} else {{ 1u64 }}) | ((conditions as u64) << 8);
        let mut index = 0;
        while index < conditions {{
            let byte = 10 + index;
            words[byte / 8] |= (frame.value(index) as u64) << ((byte % 8) * 8);
            index += 1;
        }}
        let used = (10 + conditions).div_ceil(8);
        let mut slot = (key >> 4) & (DECISION_SLOTS - 1);
        let mut attempts = 0;
        while attempts < 16 {{
            let cell = &DECISIONS[slot];
            let state = cell.state.load(Ordering::Acquire);
            if state == 2 {{
                let mut same = true;
                let mut word = 0;
                while word < used {{
                    if cell.words[word].load(Ordering::Relaxed) != words[word] {{
                        same = false;
                        break;
                    }}
                    word += 1;
                }}
                if same {{
                    return false;
                }}
            }} else if state == 0 {{
                if cell
                    .state
                    .compare_exchange(0, 1, Ordering::Acquire, Ordering::Relaxed)
                    .is_ok()
                {{
                    let mut word = 0;
                    while word < DECISION_WORDS {{
                        cell.words[word].store(words[word], Ordering::Relaxed);
                        word += 1;
                    }}
                    cell.state.store(2, Ordering::Release);
                    return true;
                }}
                // Another thread took this slot first: look at it again.
                continue;
            }}
            slot = (slot + 1) & (DECISION_SLOTS - 1);
            attempts += 1;
        }}
        true
    }}

    fn writer() -> Option<&'static Mutex<File>> {{
        static WRITER: OnceLock<Option<Mutex<File>>> = OnceLock::new();
        static OPENING: AtomicBool = AtomicBool::new(false);
        if let Some(writer) = WRITER.get() {{
            return writer.as_ref();
        }}
        // Opening the file is the one step that must allocate: an environment
        // lookup, a path, a formatted file name. That allocation re-enters an
        // instrumented allocator, whose probe arrives back here while the
        // OnceLock is still unset. Declining for the duration of the open costs
        // a few observations at startup and makes the recursion impossible.
        if OPENING.swap(true, Ordering::SeqCst) {{
            return None;
        }}
        let opened = WRITER.get_or_init(|| {{
            let directory = std::env::var_os("SUPERCOV_RUST_EVIDENCE_DIR")?;
            let directory = std::path::PathBuf::from(directory);
            std::fs::create_dir_all(&directory).ok()?;
            let path =
                directory.join(std::format!("{{CRATE_KEY}}-{{}}.events", std::process::id()));
            let empty = std::fs::metadata(&path).map_or(true, |metadata| metadata.len() == 0);
            let mut file = OpenOptions::new().create(true).append(true).open(path).ok()?;
            if empty {{
                file.write_all(MAGIC).ok()?;
            }}
            let guarded = Mutex::new(file);
            // `std::sync::Mutex` boxes a platform mutex on its FIRST lock, and
            // that allocation would otherwise land on the probe path and
            // re-enter the host allocator. Force it here, where `OPENING`
            // already makes re-entry harmless.
            drop(guarded.lock());
            Some(guarded)
        }});
        OPENING.store(false, Ordering::SeqCst);
        opened.as_ref()
    }}

    fn write_record(record: &[u8]) {{
        let Some(writer) = writer() else {{ return }};
        let Ok(mut writer) = writer.lock() else {{ return }};
        let _ = writer.write_all(record);
    }}

    /// Append to a stack record, reporting whether it all fit.
    fn push(record: &mut [u8; RECORD_CAPACITY], length: &mut usize, bytes: &[u8]) -> bool {{
        let Some(slice) = record.get_mut(*length..*length + bytes.len()) else {{
            return false;
        }};
        slice.copy_from_slice(bytes);
        *length += bytes.len();
        true
    }}

    // A frame lives on the stack of the function whose decision it records,
    // once per decision, and a recursive descent parser carries every one of
    // them down every level: serde_json's recursion-limit test overflowed the
    // test thread's stack when each frame held two 64-byte arrays. Values are
    // two bits each in a u128 (0 unevaluated, 1 false, 2 true) and reached
    // marks one bit each, so a frame is 48 bytes.
    pub struct DecisionFrame {{
        id: &'static str,
        values: u128,
        /// Let-chain conditions the evaluation got to: a `let` cannot be
        /// wrapped, so it is marked reached instead and resolved later.
        reached: u64,
        conditions: usize,
        recordable: bool,
    }}

    impl DecisionFrame {{
        pub fn new(id: &'static str, conditions: usize) -> Self {{
            Self {{
                id,
                values: 0,
                reached: 0,
                conditions,
                recordable: conditions <= MAX_CONDITIONS,
            }}
        }}

        #[inline(always)]
        fn value(&self, index: usize) -> u8 {{
            ((self.values >> (2 * index)) & 3) as u8
        }}

        #[inline(always)]
        fn set_value(&mut self, index: usize, value: u8) {{
            let shift = 2 * index;
            self.values = (self.values & !(3u128 << shift)) | ((value as u128) << shift);
        }}

        #[inline(always)]
        fn is_reached(&self, index: usize) -> bool {{
            index < MAX_CONDITIONS && (self.reached >> index) & 1 == 1
        }}
    }}

    /// A let chain got to condition `index` (0 marks the chain evaluated at
    /// all). Always true, so it sits in the chain as an operand.
    #[inline(always)]
    pub fn reached(frame: &mut DecisionFrame, index: usize) -> bool {{
        if index < MAX_CONDITIONS {{
            frame.reached |= 1u64 << index;
        }}
        true
    }}

    /// A let chain decided. A chain tries its conditions in order and stops
    /// at the first that fails, so every reached `let` before the last
    /// reached condition held, the last one held when the chain was taken and
    /// failed when it was not, and conditions never reached stay unevaluated.
    /// `operators` lists the `&&` whose left side holds a `let`, by the index
    /// of their right side's first condition: reached means the operator
    /// evaluated its right side, otherwise it short-circuited. The frame then
    /// resets for the next evaluation, which a `while let` makes every turn.
    pub fn decision_chain(
        frame: &mut DecisionFrame,
        outcome: bool,
        operators: &[(usize, &'static str, &'static str)],
    ) {{
        if !frame.is_reached(0) {{
            return;
        }}
        let conditions = frame.conditions.min(MAX_CONDITIONS);
        let mut last = 0;
        let mut index = 0;
        while index < conditions {{
            if frame.is_reached(index) || frame.value(index) != 0 {{
                last = index;
            }}
            index += 1;
        }}
        let mut index = 0;
        while index < conditions {{
            if frame.value(index) == 0 && frame.is_reached(index) {{
                frame.set_value(index, if index < last || outcome {{ 2 }} else {{ 1 }});
            }}
            index += 1;
        }}
        for (first, short_circuit, evaluated) in operators {{
            let got_there = frame.is_reached(*first)
                || (*first < MAX_CONDITIONS && frame.value(*first) != 0);
            hit(if got_there {{ evaluated }} else {{ short_circuit }});
        }}
        decision(outcome, frame);
        frame.values = 0;
        frame.reached = 0;
    }}

    // The hot paths are inlined into every probe site, so nothing with a
    // stack buffer may be: an inlined 256-byte record per site turned each
    // instrumented function's frame into kilobytes, and serde_json's
    // recursion-limit test overflowed. Writing a record is the rare path and
    // stays a call of its own.
    #[inline(always)]
    pub fn hit(id: &'static str) {{
        if first_sighting(id) {{
            record_hit(id);
        }}
    }}

    #[inline(never)]
    fn record_hit(id: &'static str) {{
        let mut record = [0u8; RECORD_CAPACITY];
        let mut length = 0;
        if push(&mut record, &mut length, b"H\t")
            && push_number(&mut record, &mut length, thread_ordinal())
            && push(&mut record, &mut length, b"\t")
            && push(&mut record, &mut length, id.as_bytes())
            && push(&mut record, &mut length, b"\n")
        {{
            write_record(&record[..length]);
        }}
    }}

    /// One arm of a match was selected. `ids` holds each arm's `not selected`
    /// and `selected` IDs in source order, so every arm before `selected` was
    /// considered and passed over. Each ID is a distinct static string, which
    /// is what `hit` dedupes on.
    #[inline(always)]
    pub fn arms(ids: &[&'static str], selected: usize) {{
        for arm in 0..selected {{
            if let Some(id) = ids.get(arm * 2) {{
                hit(id);
            }}
        }}
        if let Some(id) = ids.get(selected * 2 + 1) {{
            hit(id);
        }}
    }}

    /// The left operand of `&&` or `||`: it short-circuits when it equals
    /// `short_circuits_when`, otherwise the right operand is about to run.
    #[inline(always)]
    pub fn logical(
        left: bool,
        short_circuits_when: bool,
        short_circuit: &'static str,
        evaluated: &'static str,
    ) -> bool {{
        hit(if left == short_circuits_when {{ short_circuit }} else {{ evaluated }});
        left
    }}

    /// A `for` loop's iterator, recording on the first `next` whether the
    /// body ran at all. `size_hint` passes through so collection sizing is
    /// unchanged; nothing else about the iterator is observable to the loop.
    pub struct ForLoop<I> {{
        inner: I,
        first: bool,
        zero: &'static str,
        entered: &'static str,
    }}

    impl<I: Iterator> Iterator for ForLoop<I> {{
        type Item = I::Item;

        #[inline(always)]
        fn next(&mut self) -> Option<I::Item> {{
            let item = self.inner.next();
            if self.first {{
                self.first = false;
                hit(if item.is_some() {{ self.entered }} else {{ self.zero }});
            }}
            item
        }}

        #[inline(always)]
        fn size_hint(&self) -> (usize, Option<usize>) {{
            self.inner.size_hint()
        }}
    }}

    #[inline(always)]
    pub fn for_loop<I: IntoIterator>(
        iterable: I,
        zero: &'static str,
        entered: &'static str,
    ) -> ForLoop<I::IntoIter> {{
        ForLoop {{ inner: iterable.into_iter(), first: true, zero, entered }}
    }}

    /// A `while` body ran: clear the loop's flag on the first entry.
    #[inline(always)]
    pub fn entered(first: &mut bool, id: &'static str) {{
        if *first {{
            *first = false;
            hit(id);
        }}
    }}

    /// A `while` loop is over: a flag still set means the body never ran.
    #[inline(always)]
    pub fn zero_iterations(first: bool, id: &'static str) {{
        if first {{
            hit(id);
        }}
    }}

    /// The operand of `?`, recording which way the operator goes. Every type
    /// `?` accepts on stable Rust implements this.
    pub trait TryProbe: Sized {{
        fn probe(self, continued: &'static str, returned: &'static str) -> Self;
    }}

    impl<T> TryProbe for Option<T> {{
        #[inline(always)]
        fn probe(self, continued: &'static str, returned: &'static str) -> Self {{
            hit(if self.is_some() {{ continued }} else {{ returned }});
            self
        }}
    }}

    impl<T, E> TryProbe for Result<T, E> {{
        #[inline(always)]
        fn probe(self, continued: &'static str, returned: &'static str) -> Self {{
            hit(if self.is_ok() {{ continued }} else {{ returned }});
            self
        }}
    }}

    impl<B, C> TryProbe for ControlFlow<B, C> {{
        #[inline(always)]
        fn probe(self, continued: &'static str, returned: &'static str) -> Self {{
            hit(match self {{
                ControlFlow::Continue(_) => continued,
                _ => returned,
            }});
            self
        }}
    }}

    impl<T, E> TryProbe for Poll<Result<T, E>> {{
        #[inline(always)]
        fn probe(self, continued: &'static str, returned: &'static str) -> Self {{
            hit(match self {{
                Poll::Ready(Err(_)) => returned,
                _ => continued,
            }});
            self
        }}
    }}

    impl<T, E> TryProbe for Poll<Option<Result<T, E>>> {{
        #[inline(always)]
        fn probe(self, continued: &'static str, returned: &'static str) -> Self {{
            hit(match self {{
                Poll::Ready(Some(Err(_))) => returned,
                _ => continued,
            }});
            self
        }}
    }}

    // Anything `!` turns into a bool: `assert!(was_seen)` compiles with a
    // `&bool` (tokio iterates `for was_seen in &seen`), since the macro only
    // negates its operand.
    #[inline(always)]
    pub fn condition<V: std::ops::Not<Output = bool>>(
        value: V,
        frame: &mut DecisionFrame,
        index: usize,
    ) -> bool {{
        let value = !!value;
        if index < frame.conditions && index < MAX_CONDITIONS {{
            frame.set_value(index, if value {{ 2 }} else {{ 1 }});
        }}
        value
    }}

    #[inline(always)]
    pub fn decision(value: bool, frame: &mut DecisionFrame) -> bool {{
        if frame.recordable {{
            record_decision(value, frame);
        }}
        value
    }}

    #[inline(never)]
    fn record_decision(value: bool, frame: &DecisionFrame) {{
        // `writer()` comes first so the file's mutex boxes its platform mutex
        // while `OPENING` still makes re-entry harmless; the decision table
        // itself is lock-free and allocates nothing.
        if writer().is_none() || !first_decision(frame, value) {{
            return;
        }}
        let mut record = [0u8; RECORD_CAPACITY];
        let mut length = 0;
        let mut fits = push(&mut record, &mut length, b"D\t")
            && push_number(&mut record, &mut length, thread_ordinal())
            && push(&mut record, &mut length, b"\t")
            && push(&mut record, &mut length, frame.id.as_bytes())
            && push(&mut record, &mut length, b"\t");
        let mut index = 0;
        while index < frame.conditions {{
            fits = fits && push(&mut record, &mut length, &[b'0' + frame.value(index)]);
            index += 1;
        }}
        fits = fits
            && push(&mut record, &mut length, b"\t")
            && push(&mut record, &mut length, if value {{ b"1" }} else {{ b"0" }})
            && push(&mut record, &mut length, b"\n");
        if fits {{
            write_record(&record[..length]);
        }}
    }}
}}
"#
    ))
}

pub fn parse_rust_probe_events(input: &[u8]) -> Result<Vec<RustProbeEntry>, RustProbeReadError> {
    let text = std::str::from_utf8(input).map_err(|_| RustProbeReadError::InvalidHeader)?;
    let mut lines = text.lines();
    if lines.next() != Some(RUST_PROBE_MAGIC) {
        return Err(RustProbeReadError::InvalidHeader);
    }
    let mut observations = Vec::new();
    for (index, line) in lines.enumerate() {
        let line_number = index + 2;
        let fields = line.split('\t').collect::<Vec<_>>();
        match fields.as_slice() {
            ["H", thread, id] if valid_probe_id(id) && valid_thread(thread) => {
                observations.push(RustProbeEntry {
                    thread: thread.parse().expect("a validated thread ordinal"),
                    observation: RustProbeObservation::Hit { id: (*id).into() },
                })
            }
            ["A", thread, id] if valid_probe_id(id) && valid_thread(thread) => {
                observations.push(RustProbeEntry {
                    thread: thread.parse().expect("a validated thread ordinal"),
                    observation: RustProbeObservation::Assertion { id: (*id).into() },
                })
            }
            ["D", thread, id, digits, outcome]
                if valid_probe_id(id)
                    && valid_thread(thread)
                    && id.starts_with("rs:decision:")
                    && !digits.is_empty()
                    && digits
                        .bytes()
                        .all(|digit| matches!(digit, b'0' | b'1' | b'2'))
                    && matches!(*outcome, "0" | "1") =>
            {
                observations.push(RustProbeEntry {
                    thread: thread.parse().expect("a validated thread ordinal"),
                    observation: RustProbeObservation::Decision {
                        id: (*id).into(),
                        values: digits
                            .bytes()
                            .map(|digit| match digit {
                                b'0' => None,
                                b'1' => Some(false),
                                b'2' => Some(true),
                                _ => unreachable!(),
                            })
                            .collect(),
                        outcome: *outcome == "1",
                    },
                });
            }
            _ => return Err(RustProbeReadError::InvalidRecord(line_number)),
        }
    }
    Ok(observations)
}

pub fn read_rust_probe_directory(
    directory: &Path,
) -> Result<BTreeMap<String, Vec<RustProbeEntry>>, RustProbeReadError> {
    let mut files = fs::read_dir(directory)
        .map_err(|error| RustProbeReadError::Io(error.to_string()))?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|error| RustProbeReadError::Io(error.to_string()))?;
    files.sort_by_key(|entry| entry.file_name());
    let mut observations = BTreeMap::new();
    for entry in files {
        let name = entry
            .file_name()
            .into_string()
            .map_err(|_| RustProbeReadError::UnsafeEntry("<non-utf8>".into()))?;
        if Path::new(&name)
            .components()
            .any(|component| !matches!(component, Component::Normal(_)))
            || !name.ends_with(".events")
        {
            return Err(RustProbeReadError::UnsafeEntry(name));
        }
        let metadata = fs::symlink_metadata(entry.path())
            .map_err(|error| RustProbeReadError::Io(error.to_string()))?;
        if !metadata.file_type().is_file() {
            return Err(RustProbeReadError::UnsafeEntry(name));
        }
        let contents =
            fs::read(entry.path()).map_err(|error| RustProbeReadError::Io(error.to_string()))?;
        observations.insert(name, parse_rust_probe_events(&contents)?);
    }
    Ok(observations)
}

#[cfg(test)]
mod tests {
    use std::{
        fs,
        process::Command,
        time::{SystemTime, UNIX_EPOCH},
    };

    use super::*;
    use crate::rust_instrumenter::instrument_rust_source;

    fn temporary_directory(name: &str) -> std::path::PathBuf {
        let nonce = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_nanos();
        let path = std::env::temp_dir().join(format!(
            "supercov-rust-runtime-{}-{nonce}-{name}",
            std::process::id()
        ));
        fs::create_dir(&path).unwrap();
        path
    }

    #[test]
    fn generated_runtime_records_owned_points_and_exact_short_circuit_vectors() {
        let source = r#"fn choose(first: bool, second: bool) -> i32 {
    if first && second { 7 } else { 3 }
}

fn main() {
    println!("{} {}", choose(false, true), choose(true, true));
}
"#;
        let transformed =
            instrument_rust_source("src/main.rs", source, "crate::__supercov_runtime_v1").unwrap();
        let runtime =
            render_rust_runtime("__supercov_runtime_v1", "0123456789abcdef01234567").unwrap();
        let directory = temporary_directory("record");
        let input = directory.join("main.rs");
        let binary = directory.join("program");
        let evidence = directory.join("evidence");
        fs::write(&input, format!("{}\n{runtime}", transformed.code)).unwrap();
        let compile = Command::new("rustc")
            .arg("--edition=2024")
            .arg(&input)
            .arg("-o")
            .arg(&binary)
            .output()
            .unwrap();
        assert!(
            compile.status.success(),
            "{}",
            String::from_utf8_lossy(&compile.stderr)
        );
        let output = Command::new(&binary)
            .env("SUPERCOV_RUST_EVIDENCE_DIR", &evidence)
            .output()
            .unwrap();
        assert!(output.status.success());
        assert_eq!(output.stdout, b"3 7\n");
        let files = read_rust_probe_directory(&evidence).unwrap();
        assert_eq!(files.len(), 1);
        let observations = files.values().next().unwrap();
        let decisions = observations
            .iter()
            .filter_map(|entry| match &entry.observation {
                RustProbeObservation::Decision {
                    values, outcome, ..
                } => Some((values.clone(), *outcome)),
                RustProbeObservation::Hit { .. } | RustProbeObservation::Assertion { .. } => None,
            })
            .collect::<Vec<_>>();
        assert_eq!(
            decisions,
            [
                (vec![Some(false), None], false),
                (vec![Some(true), Some(true)], true)
            ]
        );
        fs::remove_dir_all(directory).unwrap();
    }

    #[test]
    fn generated_runtime_compiles_into_a_no_std_host_crate() {
        // `#![no_std]` swaps the std prelude for core's, so `format!`, `vec!`
        // and `Vec` are simply not in scope. The injected module named them
        // unqualified and every no_std crate failed to build -- found on
        // bytes-1.12.1, which is `#![no_std]` (src/lib.rs:6). `extern crate std`
        // here mirrors what the injected module does: it links std without
        // restoring the prelude, which is precisely the condition under test.
        let source = r#"#![no_std]

extern crate std;

fn choose(first: bool, second: bool) -> i32 {
    if first && second { 7 } else { 3 }
}

fn main() {
    std::println!("{} {}", choose(false, true), choose(true, true));
}
"#;
        let transformed =
            instrument_rust_source("src/main.rs", source, "crate::__supercov_runtime_v1").unwrap();
        let runtime =
            render_rust_runtime("__supercov_runtime_v1", "0123456789abcdef01234567").unwrap();
        let directory = temporary_directory("no-std");
        let input = directory.join("main.rs");
        let binary = directory.join("program");
        let evidence = directory.join("evidence");
        fs::write(&input, format!("{}\n{runtime}", transformed.code)).unwrap();
        let compile = Command::new("rustc")
            .arg("--edition=2024")
            .arg(&input)
            .arg("-o")
            .arg(&binary)
            .output()
            .unwrap();
        assert!(
            compile.status.success(),
            "{}",
            String::from_utf8_lossy(&compile.stderr)
        );
        let output = Command::new(&binary)
            .env("SUPERCOV_RUST_EVIDENCE_DIR", &evidence)
            .output()
            .unwrap();
        assert!(output.status.success());
        assert_eq!(output.stdout, b"3 7\n");
        // Probes must still record, not merely compile.
        let files = read_rust_probe_directory(&evidence).unwrap();
        assert_eq!(files.len(), 1);
        assert!(!files.values().next().unwrap().is_empty());
        fs::remove_dir_all(directory).unwrap();
    }

    #[test]
    fn probes_reached_through_a_global_allocator_do_not_recurse() {
        // The shape from bytes-1.12.1 tests/test_bytes_vec_alloc.rs: the
        // allocator's `alloc` calls an inherent method, which calls a FREE
        // FUNCTION. Skipping `impl GlobalAlloc` blocks syntactically does not
        // cover `note`, and nothing syntactic can -- the chain may leave the
        // file or the crate. Only the runtime knows a probe is already running,
        // so the guard has to live there. Without it this binary dies with
        // SIGSEGV instead of printing anything.
        let source = r#"use std::alloc::{GlobalAlloc, Layout, System};
use std::sync::atomic::{AtomicUsize, Ordering};

static SEEN: AtomicUsize = AtomicUsize::new(0);

fn note(size: usize) {
    if size > 0 {
        SEEN.fetch_add(1, Ordering::SeqCst);
    }
}

struct Ledger;

impl Ledger {
    fn record(&self, size: usize) {
        note(size);
    }
}

unsafe impl GlobalAlloc for Ledger {
    unsafe fn alloc(&self, layout: Layout) -> *mut u8 {
        self.record(layout.size());
        System.alloc(layout)
    }

    unsafe fn dealloc(&self, pointer: *mut u8, layout: Layout) {
        // dealloc must be instrumented too, or the test never exercises the
        // ladder that actually crashed: freeing the probe's OWN buffer re-enters
        // here, and a guard released before that free recurses without bound.
        self.record(layout.size());
        System.dealloc(pointer, layout);
    }
}

#[global_allocator]
static LEDGER: Ledger = Ledger;

fn classify(flag: bool) -> usize {
    if flag { 1 } else { 2 }
}

fn main() {
    let held = std::vec![7u8; 32];
    println!("{} {}", classify(!held.is_empty()), held.len());
}
"#;
        let transformed =
            instrument_rust_source("src/main.rs", source, "crate::__supercov_runtime_v1").unwrap();
        // `note` is a free function, so it IS instrumented -- proving the guard,
        // not a syntactic skip, is what prevents the recursion.
        assert!(
            transformed
                .code
                .contains("fn note(size: usize) {\ncrate::__supercov_runtime_v1::hit("),
            "the free function reached from the allocator should still be probed"
        );
        let runtime =
            render_rust_runtime("__supercov_runtime_v1", "0123456789abcdef01234567").unwrap();
        let directory = temporary_directory("allocator-reentry");
        let input = directory.join("main.rs");
        let binary = directory.join("program");
        let evidence = directory.join("evidence");
        fs::write(&input, format!("{}\n{runtime}", transformed.code)).unwrap();
        let compile = Command::new("rustc")
            .arg("--edition=2024")
            .arg(&input)
            .arg("-o")
            .arg(&binary)
            .output()
            .unwrap();
        assert!(
            compile.status.success(),
            "{}",
            String::from_utf8_lossy(&compile.stderr)
        );
        let output = Command::new(&binary)
            .env("SUPERCOV_RUST_EVIDENCE_DIR", &evidence)
            .output()
            .unwrap();
        assert!(
            output.status.success(),
            "instrumented allocator did not survive: {:?}",
            output.status
        );
        assert_eq!(output.stdout, b"1 32\n");
        let files = read_rust_probe_directory(&evidence).unwrap();
        let observations = files.values().next().unwrap();
        let decisions = observations
            .iter()
            .filter_map(|entry| match &entry.observation {
                RustProbeObservation::Decision {
                    id,
                    values,
                    outcome,
                } => Some((id.clone(), values.clone(), *outcome)),
                RustProbeObservation::Hit { .. } | RustProbeObservation::Assertion { .. } => None,
            })
            .collect::<Vec<_>>();
        // Suppression costs only duplicates: `classify` runs outside any probe,
        // so its decision is still recorded exactly.
        let classify = transformed
            .manifest
            .decisions
            .iter()
            .find(|decision| decision.source == "flag")
            .expect("classify's decision reached the manifest");
        assert!(
            decisions
                .iter()
                .any(|(id, values, outcome)| id == &classify.id
                    && values == &[Some(true)]
                    && *outcome),
            "classify's decision was lost: {decisions:?}"
        );
        // `note` records too -- every ordinary allocation reaches it outside a
        // probe -- which is why suppressing the nested ones loses nothing.
        let note = transformed
            .manifest
            .decisions
            .iter()
            .find(|decision| decision.source == "size > 0")
            .expect("note's decision reached the manifest");
        assert!(decisions.iter().any(|(id, ..)| id == &note.id));
        // No frame built while nested may reach the log: a zero-width vector
        // for a one-condition decision is a malformed record, not a lost one.
        assert!(
            decisions.iter().all(|(_, values, _)| values.len() == 1),
            "a suppressed frame emitted a malformed vector: {decisions:?}"
        );
        fs::remove_dir_all(directory).unwrap();
    }

    #[test]
    fn a_hit_in_a_loop_is_written_once_but_decisions_keep_every_vector() {
        // bytes' advance_bytes_mut_remaining_capacity is a triple-nested loop of
        // ~2.8M iterations. One write syscall per probe per iteration left it
        // still running after four minutes. A hit only answers "did this ever
        // run", so the repeats carry nothing -- but a decision's condition
        // vector differs per iteration and every distinct one must survive.
        let source = r#"fn step(value: usize) -> bool {
    let doubled = value * 2;
    doubled > 4
}

fn main() {
    let mut seen = 0;
    for value in 0..64 {
        if step(value) { seen += 1; }
    }
    println!("{seen}");
}
"#;
        let transformed =
            instrument_rust_source("src/main.rs", source, "crate::__supercov_runtime_v1").unwrap();
        let runtime =
            render_rust_runtime("__supercov_runtime_v1", "0123456789abcdef01234567").unwrap();
        let directory = temporary_directory("dedup");
        let input = directory.join("main.rs");
        let binary = directory.join("program");
        let evidence = directory.join("evidence");
        fs::write(&input, format!("{}\n{runtime}", transformed.code)).unwrap();
        let compile = Command::new("rustc")
            .arg("--edition=2024")
            .arg(&input)
            .arg("-o")
            .arg(&binary)
            .output()
            .unwrap();
        assert!(
            compile.status.success(),
            "{}",
            String::from_utf8_lossy(&compile.stderr)
        );
        let output = Command::new(&binary)
            .env("SUPERCOV_RUST_EVIDENCE_DIR", &evidence)
            .output()
            .unwrap();
        assert_eq!(output.stdout, b"61\n");
        let files = read_rust_probe_directory(&evidence).unwrap();
        let observations = files.values().next().unwrap();

        // `doubled > 4` runs 64 times; its hit is recorded once.
        let mut hits = BTreeMap::<&str, usize>::new();
        for entry in observations {
            if let RustProbeObservation::Hit { id } = &entry.observation {
                *hits.entry(id.as_str()).or_default() += 1;
            }
        }
        assert!(!hits.is_empty(), "no hits recorded at all");
        assert!(
            hits.values().all(|count| *count == 1),
            "a repeated hit was written more than once: {hits:?}"
        );

        // MC/DC needs the SET of condition vectors, not how often each recurred,
        // so a repeat of an already-seen vector carries nothing -- but every
        // DISTINCT vector must still arrive. `doubled > 4` is evaluated 64 times
        // and takes exactly two distinct shapes, so exactly two records survive.
        let decisions = observations
            .iter()
            .filter_map(|entry| match &entry.observation {
                RustProbeObservation::Decision {
                    values, outcome, ..
                } => Some((values.clone(), *outcome)),
                RustProbeObservation::Hit { .. } | RustProbeObservation::Assertion { .. } => None,
            })
            .collect::<Vec<_>>();
        assert_eq!(
            decisions,
            // In first-occurrence order: `step(0)` is false before any value
            // exceeds the threshold.
            [(vec![Some(false)], false), (vec![Some(true)], true)],
            "both distinct vectors must survive, and neither may repeat"
        );
        fs::remove_dir_all(directory).unwrap();
    }

    #[test]
    fn generated_runtime_survives_a_host_without_the_prelude() {
        // tracing's macro tests carry `#![no_implicit_prelude]` on purpose,
        // to prove their macros do not depend on it. The runtime imports
        // every name it uses for `no_std` hosts, but three `TryProbe` impls
        // reached for `matches!`, which is a prelude macro.
        let source = r#"#![no_implicit_prelude]

fn parse(text: &str) -> ::std::option::Option<i32> {
    let value: i32 = text.parse().ok()?;
    ::std::option::Option::Some(value * 2)
}

fn main() {
    ::std::println!("{:?} {:?}", parse("4"), parse("x"));
}
"#;
        let transformed =
            instrument_rust_source("src/main.rs", source, "crate::__supercov_runtime_v1").unwrap();
        // The `?` takes a probe, which is what pulls in the TryProbe impls.
        assert!(transformed.code.contains("TryProbe"));
        let runtime =
            render_rust_runtime("__supercov_runtime_v1", "0123456789abcdef01234567").unwrap();
        let directory = temporary_directory("no-implicit-prelude");
        let input = directory.join("main.rs");
        let binary = directory.join("program");
        fs::write(&input, format!("{}\n{runtime}", transformed.code)).unwrap();
        let compile = Command::new("rustc")
            .arg("--edition=2024")
            .arg("--cap-lints=warn")
            .arg(&input)
            .arg("-o")
            .arg(&binary)
            .output()
            .unwrap();
        assert!(
            compile.status.success(),
            "{}",
            String::from_utf8_lossy(&compile.stderr)
        );
        let output = Command::new(&binary).output().unwrap();
        assert_eq!(output.stdout, b"Some(8) None\n");
        fs::remove_dir_all(directory).unwrap();
    }

    #[test]
    fn generated_runtime_survives_a_deny_warnings_host() {
        // serde builds with `#![deny(warnings)]`; the injected module's
        // fully-qualified imports (required for no_std hosts) read as unused
        // imports and became hard errors. Injected code must be immune to the
        // host's lint policy.
        let source = r#"#![deny(warnings)]

fn choose(first: bool, second: bool) -> i32 {
    if first && second { 7 } else { 3 }
}

fn main() {
    println!("{} {}", choose(false, true), choose(true, true));
}
"#;
        let transformed =
            instrument_rust_source("src/main.rs", source, "crate::__supercov_runtime_v1").unwrap();
        let runtime =
            render_rust_runtime("__supercov_runtime_v1", "0123456789abcdef01234567").unwrap();
        let directory = temporary_directory("deny-warnings");
        let input = directory.join("main.rs");
        let binary = directory.join("program");
        fs::write(&input, format!("{}\n{runtime}", transformed.code)).unwrap();
        // --cap-lints=warn mirrors what the runner passes for the instrumented
        // workspace: the host policy must not reject generated code, including
        // the `if ({{ frame ... }})` decision wrapping that trips unused_parens.
        let compile = Command::new("rustc")
            .arg("--edition=2024")
            .arg("--cap-lints=warn")
            .arg(&input)
            .arg("-o")
            .arg(&binary)
            .output()
            .unwrap();
        assert!(
            compile.status.success(),
            "{}",
            String::from_utf8_lossy(&compile.stderr)
        );
        let output = Command::new(&binary).output().unwrap();
        assert_eq!(output.stdout, b"3 7\n");
        fs::remove_dir_all(directory).unwrap();
    }

    #[test]
    fn reader_rejects_truncation_invalid_digits_and_non_files() {
        assert_eq!(
            parse_rust_probe_events(
                b"SUPERCOV-RUST-PROBE-1\nD\trs:decision:0123456789abcdef01234567\t03\t1\n"
            ),
            Err(RustProbeReadError::InvalidRecord(2))
        );
        assert_eq!(
            parse_rust_probe_events(b"SUPERCOV-RUST-PROBE-"),
            Err(RustProbeReadError::InvalidHeader)
        );

        let directory = temporary_directory("unsafe");
        fs::create_dir(directory.join("nested.events")).unwrap();
        assert!(matches!(
            read_rust_probe_directory(&directory),
            Err(RustProbeReadError::UnsafeEntry(_))
        ));
        fs::remove_dir_all(directory).unwrap();
    }
}
