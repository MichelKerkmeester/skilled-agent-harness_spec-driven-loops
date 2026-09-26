//go:build !race

// This test deliberately provokes the concurrent access the runtime is built
// to notice and discard, so the race detector reports it — correctly. Running
// it under -race would fail on the very condition it exists to verify, so it
// is excluded there rather than the detector being talked out of its finding.
// What the runtime promises is not that the access cannot happen; it is that
// nothing the access could corrupt is ever reported.

package supercov

import (
	"sync"
	"testing"
)

// Probes are a store into one shared array, and attribution is a sweep of that
// array at each boundary. Two tests open at once share the array, so the sweep
// credits hits to whoever is current. The harness keeps t.Parallel() tests out
// of attribution by reading the source, but a helper that makes the call slips
// past that, so the runtime backstops it: stop attributing rather than report
// numbers nobody can trust.
//
// Probe hits survive, because every write stores the same constant and no
// interleaving changes the result. Condition vectors do not: their state is
// read-modify-write, so they are dropped rather than reported wrong.
func TestConcurrentTestsLoseAttributionRatherThanGetItWrong(t *testing.T) {
	Arm(4, []uint8{2})

	var started sync.WaitGroup
	var finished sync.WaitGroup
	started.Add(2)
	finished.Add(2)
	for _, name := range []string{"first", "second"} {
		go func() {
			defer finished.Done()
			done := EnterTest(name)
			C(0, 0, true)
			C(0, 1, true)
			BD(1, 2, 0, true)
			// Both are open before either closes, so the overlap is certain
			// rather than a race this test hopes to lose.
			started.Done()
			started.Wait()
			done()
		}()
	}
	finished.Wait()

	if len(records) != 0 {
		t.Errorf("attribution nobody can trust should be absent, got %d records", len(records))
	}
	if !overlapped {
		t.Error("the overlap should have been noticed")
	}
	reached := false
	for _, value := range global {
		if value != 0 {
			reached = true
		}
	}
	if !reached {
		t.Error("run-wide totals are a union and should survive the overlap")
	}
	if len(runWide[0]) != 0 {
		t.Errorf("condition vectors a race can corrupt should be dropped, got %d", len(runWide[0]))
	}
}
