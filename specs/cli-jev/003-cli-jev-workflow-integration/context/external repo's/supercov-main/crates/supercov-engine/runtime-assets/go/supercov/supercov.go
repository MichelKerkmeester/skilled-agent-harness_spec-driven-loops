// Package supercov is the runtime half of Supercov's Go frontend.
//
// Instrumented source calls into it on every obligation, so a probe costs
// exactly what this package's hot path costs. For a point that is one atomic
// pointer load, one bounds check and one store — small enough that the
// compiler inlines it into the caller. Anything that cannot be done in a store
// happens at a test boundary instead, where it is paid once per test rather
// than once per statement.
package supercov

import (
	"bufio"
	"encoding/binary"
	"fmt"
	"os"
	"sync"
	"sync/atomic"
	"time"
)

// What one test reached: the probes it set and the decision vectors it
// established, as sparse pairs rather than a copy of the whole array.
type testRecord struct {
	name string
	// How the test ended, as the framework saw it. Defaulted rather than
	// required: a test that reports nothing finished normally, and the
	// runtime should not need the framework's cooperation to say so.
	status string
	// Whether what this test reached could be credited to it.
	//
	// A test that called t.Parallel() stores into the same probe array as the
	// tests running beside it, so its own reach cannot be separated from
	// theirs. It still ran, it still has an outcome, and what it reached is
	// still in the run-wide totals -- so the record exists and says that its
	// probes are not its own rather than being left out, which would read
	// downstream as a test that never ran.
	//
	// The distinction matters because an empty probe list means two different
	// things. Under attribution it means the test reached nothing. Here it
	// means nothing can say what it reached.
	unattributed bool
	probes       []probeHit
	vectors      []vectorHit
}

type probeHit struct {
	index uint32
	value uint32
}

type vectorHit struct {
	decision uint32
	key      uint64
}

// One decision's entire state, in one struct.
//
// C and D touch all of it on every evaluation, so splitting it across parallel
// arrays costs a separate global slice header load per field. Held together,
// `&states[id]` is one header load and one bounds check, and everything after
// is an offset from that pointer.
//
// Short-circuiting means a condition may not be evaluated at all, and MC/DC
// asks a different question of an unevaluated operand than of a false one.
// Keeping `evaluating` separate from `truth` preserves that; collapsing them
// would report `a && b` with `a` false as though `b` had been tested.
type decisionState struct {
	evaluating uint64
	truth      uint64
	// The keys most recently recorded *for the current test*, so a decision
	// evaluated in a loop can answer "seen this already" without a call. Two
	// entries because the common shape is a condition alternating between
	// outcomes; a third distinct vector simply pays for the call. Cleared by
	// harvest, alongside the slots it stands in for. A recorded key always has
	// a condition bit set, so zero is free to mean empty.
	recent [2]uint64
	width  uint8
	count  uint8
	// Distinct vectors seen in the current test. Inline rather than a slice:
	// a decision of n conditions has at most 2^(n+1) of them, so three
	// conditions fit exactly and wider ones spill to a map nothing reaches in
	// practice.
	slots [16]uint64
}

const inlineSlots = 16

var (
	states []decisionState
	// Evaluations interrupted by recursion through one of their own operands.
	// `if valid(n-1) && x` can re-enter the same decision, and without this the
	// inner evaluation would consume the outer one's partial vector.
	//
	// A fixed stack rather than a slice, because instrumented product code
	// reaches it and a test may run that code from as many goroutines as it
	// likes. Two of them appending to one slice is a race whose next reader
	// panics with "slice bounds out of range [:-1]" -- samber/lo did, and a
	// panic out of Supercov fails tests that were passing. Every index here is
	// checked against a constant, so concurrent evaluations can still produce
	// a vector describing an evaluation that never happened -- which is what
	// overlap already drops them for -- but nothing can go out of bounds.
	suspended      [suspendedDepth]suspension
	suspendedCount int
	// Vectors from decisions too wide for their inline room. A map because
	// nothing reaches it in practice, and one never touched costs nothing.
	overflow = map[uint32]map[uint64]bool{}
	// Guards overflow alone. A Go map written by two goroutines at once is a
	// fatal error the program cannot recover from, and this map is reached
	// from instrumented product code, which a test is free to run from as
	// many goroutines as it likes. samber/lo's TestAllCase did, and Supercov
	// killed the suite with "concurrent map writes" -- measurement is not
	// worth a crash. It is the cold path by construction: a decision has to
	// produce more distinct vectors than fit inline before it is reached at
	// all, so the lock is never taken on the path that matters.
	overflowMu sync.Mutex
)

type suspension struct {
	id         uint32
	evaluating uint64
	truth      uint64
}

// How deep recursion through a decision's own operands is restored. Beyond it
// the outer evaluation is not put back and its vector is dropped, which is a
// bounded loss; growing without bound is how the slice this replaced became a
// crash.
const suspendedDepth = 256

const (
	packedValueShift   = 24
	packedOutcomeShift = 48
	// Above this a vector no longer fits one word. No real decision has 24
	// independent conditions; one that did would be unreadable long before it
	// was untestable.
	packedMaxWidth = 24
)

var (
	// The array instrumented packages store into. Its contents are reset at
	// every test boundary; the header never changes after Reserve, so a probe
	// running on a leaked goroutine cannot see a torn slice.
	hits    []uint32
	global  []uint32
	records []testRecord
	current int
	widths  []uint8
	size    int
	mu      sync.Mutex
	// Tests currently between EnterTest and its returned closure. More than
	// one means the shared probe array has two owners and neither can be
	// believed; see overlap.
	open       int
	overlapped bool
	// Every distinct vector the run evaluated, per decision. Kept apart from
	// the records because the decision table describes the run, and so stands
	// even when attribution does not.
	runWide [][]uint64
	// Where to write, and when it was last written. See Destination.
	destination     string
	lastFlush       time.Time
	flushEager      bool
	flushComplained bool
)

// Arm records how many conditions each decision has. The probe array is
// already in place by then: packages reserve it as they initialise.
func Arm(count int, conditions []uint8) {
	mu.Lock()
	defer mu.Unlock()
	if hits == nil {
		hits = make([]uint32, count)
		global = make([]uint32, count)
		size = count
	}
	widths = conditions
	states = make([]decisionState, len(conditions))
	for index, width := range conditions {
		states[index].width = width
	}
	suspendedCount = 0
	current = -1
	open = 0
	overlapped = false
	records = nil
	runWide = make([][]uint64, len(conditions))
	overflowMu.Lock()
	for id := range overflow {
		delete(overflow, id)
	}
	overflowMu.Unlock()
}

// EnterTest binds every probe that fires next to this test, and returns the
// function that unbinds it.
//
// Attribution is a harvest at the boundary rather than a lookup on every
// probe: whatever the array holds now belongs to whoever was running, so it is
// swept into their record and cleared. That is one pass over the probes per
// test — a few microseconds — in exchange for removing an indirection from the
// hottest path a coverage tool has.
func EnterTest(name string) func() {
	mu.Lock()
	harvest()
	if open > 0 {
		overlap()
	}
	open++
	if overlapped {
		mu.Unlock()
		return func() {
			mu.Lock()
			harvest()
			if open > 0 {
				open--
			}
			mu.Unlock()
		}
	}
	records = append(records, testRecord{name: name, status: "passed"})
	current = len(records) - 1
	mu.Unlock()
	return func() {
		mu.Lock()
		harvest()
		if open > 0 {
			open--
		}
		current = -1
		flush()
		mu.Unlock()
	}
}

// Destination says where evidence should be written, so that it can be
// written before the process ends rather than only at the end.
//
// Go gives a program no way to run code on os.Exit, and a TestMain does not
// have to reach the m.Run() call the harness wraps: goleak's VerifyTestMain
// takes m, runs it, and exits itself, and testcontainers and hand-written
// harnesses do the same. A run like that used to write nothing at all --
// samber/lo has 548 tests and recorded none of them.
//
// So the evidence is also flushed at test boundaries, at most every flushWindow
// so the cost stays proportional to time rather than to the number of tests.
// What that cannot save is whatever the last window held, which is a great
// deal better than everything.
// `eager` says there will be no end-of-run write to fall back on, so every
// checkpoint must persist rather than wait out the window. It costs a write
// per test, which is why it is not the default: where TestMain ends in
// os.Exit(m.Run()) the final write catches everything the window skipped.
func Destination(path string, eager bool) {
	mu.Lock()
	destination = path
	flushEager = eager
	mu.Unlock()
}

// How often a boundary flush may write, when there is an end-of-run write to
// fall back on. Only then: a parallel phase can finish inside one window, and
// samber/lo's does -- with a window and no final write it recorded 36% of its
// statements where the same run records 86% without one.
const flushWindow = 250 * time.Millisecond

// Caller holds mu.
func flush() {
	if destination == "" || (!flushEager && time.Since(lastFlush) < flushWindow) {
		return
	}
	lastFlush = time.Now()
	if err := writeLocked(destination); err != nil && !flushComplained {
		// A failed flush is not worth failing the suite over: the run still
		// has its end-of-run write, and the tests are what matter. Said once,
		// because a flush happens throughout the run and a line per attempt
		// would bury the output the tests produced.
		flushComplained = true
		os.Stderr.WriteString("supercov: could not flush coverage evidence: " + err.Error() + "\n")
	}
}

// Checkpoint sweeps what has been reached into the run-wide totals, without
// claiming it for anyone.
//
// A test that calls t.Parallel() is never announced, because whatever it
// reaches runs alongside other tests and could not be credited to it. But Go
// resumes parallel tests after the serial ones have finished, so by then there
// are no announcements left to sweep at: everything the parallel phase reached
// sat in the probe array until the process ended, and where the process ends
// without reaching the end-of-run write -- goleak's VerifyTestMain, say --
// none of it was ever recorded. samber/lo lost 62% of its statements that way
// after everything else had been fixed.
//
// This is the sweep without the claim. It is what the declaration means by
// coverage that counts run-wide.
func Checkpoint() {
	mu.Lock()
	harvest()
	flush()
	mu.Unlock()
}

// Ran records that a test ran and how it ended, without claiming any of the
// coverage it produced.
//
// For the tests the harness deliberately does not announce: one that calls
// t.Parallel(), an Example, a Fuzz target. Announcing them would bind whatever
// ran next to them, and what runs next includes the other parallel tests.
// Leaving them out entirely was the other extreme, and it is the one that
// reads as a lie: a suite of nothing but parallel tests published zero tests,
// so `runs <id> test <name>` answered "Test not found" for a test that had
// just passed, and affected-test selection returned an empty set for a change
// that those tests exercised.
//
// The record never becomes current, so no probe is ever credited to it.
func Ran(name, status string) {
	mu.Lock()
	// Whatever this test reached belongs to the run before the record exists,
	// so the sweep happens first.
	harvest()
	records = append(records, testRecord{name: name, status: status, unattributed: true})
	flush()
	mu.Unlock()
}

// Outcome records how the running test ended.
//
// Called from generated test code rather than from the runtime itself, which
// is why it takes a string: reading *testing.T here would link the testing
// package into every product binary that imports this one.
func Outcome(status string) {
	mu.Lock()
	if current >= 0 && current < len(records) {
		records[current].status = status
	}
	mu.Unlock()
}

// overlap gives up on per-test attribution, once, for the whole run.
//
// The harness leaves a test that calls t.Parallel() unannounced, because by
// the time it returns the test has been descheduled and what runs next belongs
// to someone else. Source detection catches the call itself; it does not catch
// a helper that makes it. This is the backstop for that, and for any other way
// two tests end up open at once.
//
// Probes are a store into one shared array, and attribution is a sweep of that
// array at each boundary. Two tests running at once share the array, so the
// sweep credits what it finds to whoever is current: every record from here is
// a guess, and records already closed may have had their hits swept into a
// neighbour. Which ones are wrong is not knowable from here.
//
// Run-wide totals are a union and do not care who contributed what, so the run
// still measures what the suite reaches. It simply cannot say which test
// reached it, which is the truth rather than a guess dressed as a measurement.
//
// Caller holds mu.
func overlap() {
	if overlapped {
		return
	}
	overlapped = true
	records = nil
	current = -1
	// Condition state is read-modify-write, so concurrent evaluations lose
	// updates and the vectors they produce describe an evaluation that never
	// happened. Unlike the probe array — where every write stores the same
	// constant and concurrency cannot change the result — these cannot be
	// salvaged, so the run keeps statements and branches and drops MC/DC.
	runWide = make([][]uint64, len(widths))
	fmt.Fprintln(os.Stderr, "supercov: tests ran concurrently. Statement and branch coverage are"+
		" still recorded run-wide, but they cannot be attributed to individual tests, and"+
		" condition coverage is dropped because concurrent evaluations corrupt it. For per-test"+
		" and condition coverage, run the suite sequentially (go test -p 1, no t.Parallel()).")
}

// harvest moves everything the probe array holds into the running test's
// record and clears it. Execution outside any test still reaches the run-wide
// totals; it simply belongs to no test.
func harvest() {
	var into *testRecord
	if !overlapped && current >= 0 && current < len(records) {
		into = &records[current]
	}
	for index, value := range hits {
		// The plain read is the filter and costs what it always did. Only a
		// slot that actually holds something is swapped, so the atomic is paid
		// per line that ran rather than per line that exists.
		if value == 0 {
			continue
		}
		// Read and clear have to be one operation. As three -- read, OR into
		// the union, store zero -- a probe storing between the first and the
		// last leaves nothing behind, and a line reached only in that window
		// is reported uncovered. Probes are bare stores from whatever
		// goroutine the code is running on, so the window is open whenever a
		// test spawns one: samber/lo runs its subtests in parallel and lost
		// between five and fifty points of line coverage, a different amount
		// every run, against a suite `go test -cover` measures at 98.9%.
		//
		// A swap cannot lose: it returns either the value the probe stored or
		// the one before it, and in the second case the slot is left set and
		// the next sweep takes it.
		value = atomic.SwapUint32(&hits[index], 0)
		if value == 0 {
			continue
		}
		global[index] |= value
		if into != nil {
			into.probes = append(into.probes, probeHit{uint32(index), value})
		}
	}
	for id := range states {
		state := &states[id]
		if !overlapped {
			for _, key := range state.slots[:state.count] {
				if into != nil {
					into.vectors = append(into.vectors, vectorHit{uint32(id), key})
				}
				runWide[id] = including(runWide[id], key)
			}
		}
		state.count = 0
		// The cache answers "this test already recorded that vector", so it
		// expires with the slots it stands in for. Leaving it set would let a
		// later test that produces the same vector skip recording it, and the
		// vector would be credited only to whichever test reached it first.
		state.recent[0], state.recent[1] = 0, 0
	}
	overflowMu.Lock()
	for id, keys := range overflow {
		if !overlapped {
			for key := range keys {
				if into != nil {
					into.vectors = append(into.vectors, vectorHit{id, key})
				}
				runWide[id] = including(runWide[id], key)
			}
		}
		delete(overflow, id)
	}
	overflowMu.Unlock()
}

// including returns keys with key in it, which may be keys itself.
func including(keys []uint64, key uint64) []uint64 {
	for _, existing := range keys {
		if existing == key {
			return keys
		}
	}
	return append(keys, key)
}

// Reserve hands every instrumented package the one array their probes store
// into, allocating it on the first call.
//
// This is the shape Go's own cover tool and JaCoCo both settled on, and for
// the same reason: a probe should be a single store into an array the code
// already holds, not a call that has to find the array first. `hits[5] = 2`
// compiles to one move; reaching the same word through a function means a
// global load and a bounds check before anything is written.
//
// Package-level variables initialise in dependency order, so this package's
// own init has run before any generated `var _ = supercov.Reserve(...)`.
func Reserve(count int) []uint32 {
	mu.Lock()
	defer mu.Unlock()
	if hits == nil {
		hits = make([]uint32, count)
		global = make([]uint32, count)
		size = count
	}
	return hits
}

// P records that a point was reached, for callers that hold no array — the
// generated harness rather than generated probes.
func P(id uint32) {
	if int(id) < len(hits) {
		hits[id] = 2
	}
}

// A records that a branch alternative was taken.
func A(id uint32) { P(id) }

// C observes one condition of a decision and returns its value unchanged, so
// wrapping an operand cannot change what the expression evaluates to. Go
// evaluates a call argument only when the call is reached, which is what keeps
// `&&` and `||` short-circuiting through the wrapper.
func C(id uint32, index uint8, value bool) bool {
	if uint(id) >= uint(len(states)) || index >= 64 {
		return value
	}
	state := &states[id]
	bit := uint64(1) << index
	if index == 0 {
		// B clears the mask when it closes an evaluation, so a non-zero mask
		// here means this decision is already open: recursion arrived through
		// one of its own operands.
		if state.evaluating != 0 && suspendedCount >= 0 && suspendedCount < suspendedDepth {
			suspended[suspendedCount] = suspension{id, state.evaluating, state.truth}
			suspendedCount++
		}
		state.evaluating, state.truth = bit, 0
	} else {
		state.evaluating |= bit
	}
	if value {
		state.truth |= bit
	}
	return value
}

// B records which arm of a branch a condition selects and returns the value
// unchanged.
//
// The form for a branch whose condition is a single operand, which is most of
// them: no independence obligation, no call, and small enough that the
// compiler inlines it into the caller.
func B(whenTrue, whenFalse uint32, value bool) bool {
	if value {
		if int(whenTrue) < len(hits) {
			hits[whenTrue] = 2
		}
	} else if int(whenFalse) < len(hits) {
		hits[whenFalse] = 2
	}
	return value
}

// BD is B for a branch whose condition has more than one operand: it also
// closes the decision those operands opened.
//
// One call rather than two. Every decision Supercov records sits in an `if` or
// a `for`, so its outcome is the value this wrapper already holds — a separate
// outcome wrapper would observe it a second time, and profiling put 38% of an
// instrumented tight loop in exactly that second call.
func BD(whenTrue, whenFalse, id uint32, value bool) bool {
	if value {
		if int(whenTrue) < len(hits) {
			hits[whenTrue] = 2
		}
	} else if int(whenFalse) < len(hits) {
		hits[whenFalse] = 2
	}
	if uint(id) >= uint(len(states)) {
		return value
	}
	state := &states[id]
	key := state.evaluating | state.truth<<packedValueShift
	if value {
		key |= 1 << packedOutcomeShift
	}
	state.evaluating = 0
	// Nothing is suspended in the ordinary case, so no outer evaluation is
	// waiting to be restored and a cached key can return at once.
	if suspendedCount == 0 && (key == state.recent[0] || key == state.recent[1]) {
		return value
	}
	remember(state, id, key)
	return value
}

// remember holds everything B does not need on the path most evaluations
// take: restoring an evaluation that recursion interrupted, and recording a
// vector this test has not produced before.
//
//go:noinline
func remember(state *decisionState, id uint32, key uint64) {
	// Read the depth once: another goroutine may change it between the check
	// and the index, and a stale-but-bounded read is the whole point.
	if depth := suspendedCount; depth > 0 && depth <= suspendedDepth {
		if last := suspended[depth-1]; last.id == id {
			state.evaluating, state.truth = last.evaluating, last.truth
			suspendedCount = depth - 1
		}
	}
	mask := key & ((1 << packedValueShift) - 1)
	if mask == 0 || state.width > packedMaxWidth {
		return
	}
	state.recent[1] = state.recent[0]
	state.recent[0] = key
	for offset := uint8(0); offset < state.count; offset++ {
		if state.slots[offset] == key {
			return
		}
	}
	if state.count < inlineSlots {
		state.slots[state.count] = key
		state.count++
		return
	}
	rare(id, key)
}

func rare(id uint32, key uint64) {
	overflowMu.Lock()
	defer overflowMu.Unlock()
	keys := overflow[id]
	if keys == nil {
		keys = map[uint64]bool{}
		overflow[id] = keys
	}
	keys[key] = true
}

// Finish writes the evidence and returns the exit code it was given.
//
// It wraps `m.Run()` rather than deferring, because the idiomatic TestMain
// ends in `os.Exit(m.Run())` and os.Exit runs no deferred function. Writing on
// the way through is the only placement that survives both shapes.
func Finish(code int, path string) int {
	if err := Write(path); err != nil {
		os.Stderr.WriteString("supercov: could not write coverage evidence: " + err.Error() + "\n")
	}
	return code
}

// Write emits the evidence transport the engine reads. The run-wide totals
// accumulate as tests are harvested, so they cannot disagree with the per-test
// records they come from.
func Write(path string) error {
	mu.Lock()
	defer mu.Unlock()
	return writeLocked(path)
}

// Caller holds mu.
func writeLocked(path string) error {
	harvest()
	file, err := os.Create(path)
	if err != nil {
		return err
	}
	defer file.Close()
	out := bufio.NewWriterSize(file, 1<<20)
	var scratch [8]byte
	put := func(value uint64) error {
		binary.LittleEndian.PutUint64(scratch[:], value)
		_, err := out.Write(scratch[:])
		return err
	}
	if err := put(uint64(len(global))); err != nil {
		return err
	}
	for _, value := range global {
		if err := put(uint64(value)); err != nil {
			return err
		}
	}
	if err := put(uint64(len(records))); err != nil {
		return err
	}
	for _, record := range records {
		if err := put(uint64(len(record.name))); err != nil {
			return err
		}
		if _, err := out.WriteString(record.name); err != nil {
			return err
		}
		if err := put(uint64(len(record.status))); err != nil {
			return err
		}
		if _, err := out.WriteString(record.status); err != nil {
			return err
		}
		// Whether the probes below are this test's own. Written for every
		// record rather than only the unattributed ones, so the reader never
		// has to infer it from an absence.
		var unattributed uint64
		if record.unattributed {
			unattributed = 1
		}
		if err := put(unattributed); err != nil {
			return err
		}
		// Which runner announced the test. Go has one, so the record leaves it
		// empty and the engine reads the frontend's own; a JVM project can run
		// two frameworks at once and has to say.
		if err := put(0); err != nil {
			return err
		}
		// Sparse: only what this test reached, so the transport is
		// proportional to what ran rather than to the size of the project.
		if err := put(uint64(len(record.probes))); err != nil {
			return err
		}
		for _, hit := range record.probes {
			if err := put(uint64(hit.index)); err != nil {
				return err
			}
			if err := put(uint64(hit.value)); err != nil {
				return err
			}
		}
		// The vectors this test established, so independence can be traced to
		// the test that proved it rather than to the run as a whole.
		if err := put(uint64(len(record.vectors))); err != nil {
			return err
		}
		for _, hit := range record.vectors {
			if err := put(uint64(hit.decision)); err != nil {
				return err
			}
			if err := put(hit.key); err != nil {
				return err
			}
		}
	}
	if err := put(uint64(len(widths))); err != nil {
		return err
	}
	for index, width := range widths {
		if err := put(uint64(width)); err != nil {
			return err
		}
		// Run-wide rather than a union over the records: the table describes
		// what the run evaluated, which stands even when attribution does not.
		var union []uint64
		if index < len(runWide) {
			union = runWide[index]
		}
		if err := put(uint64(len(union))); err != nil {
			return err
		}
		for _, key := range union {
			if err := put(key); err != nil {
				return err
			}
		}
	}
	return out.Flush()
}
