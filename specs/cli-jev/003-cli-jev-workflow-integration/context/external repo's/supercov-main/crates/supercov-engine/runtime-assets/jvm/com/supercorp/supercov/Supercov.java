package com.supercorp.supercov;

import java.io.BufferedOutputStream;
import java.io.DataOutputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * The runtime half of Supercov's JVM frontend, shared by Java and Kotlin.
 *
 * <p>A probe is a store into {@link #HITS}, a public static array the
 * instrumented class already holds a reference to. That is the shape JaCoCo
 * settled on — it caches a {@code boolean[]} per class and writes
 * {@code probes[i] = true} — and the shape Go's own cover tool uses, for the
 * same reason: the expensive part of a probe is finding somewhere to write,
 * not the write.
 *
 * <p>Everything that cannot be a store happens at a test boundary, where it is
 * paid once per test rather than once per statement.
 */
public final class Supercov {

  private Supercov() {}

  /** Marks a branch whose condition is a single operand and needs no independence obligation. */
  public static final int NO_DECISION = -1;

  /**
   * How many probes the instrumented sources hold, substituted by Supercov
   * when it writes this file into a workspace.
   *
   * <p>The array has to be the right size before a single line of product code
   * runs, because a probe is a bare store and nothing checks its bounds -- that
   * is what makes it cost one instruction. If arming were the only thing that
   * sized it, any run where the listener did not start would not merely lose
   * coverage: the first instrumented line would throw, and Supercov would have
   * turned a passing suite into a failing one.
   */
  static final int PROBE_COUNT = 0; // supercov:probe-count

  /**
   * Per-probe bitmasks: bit 0 for false, bit 1 for true. A point or a branch
   * alternative only ever sets bit 1.
   */
  public static int[] HITS = new int[PROBE_COUNT];

  private static int[] global = new int[0];
  private static long[] evaluating = new long[0];
  private static long[] truth = new long[0];
  private static int[] widths = new int[0];
  // The keys most recently recorded *for the running test*, so a decision
  // evaluated in a loop can answer "seen this already" without taking the
  // monitor. Two entries because the common shape is a condition alternating
  // between outcomes; a third distinct vector simply pays for the call.
  // Cleared by harvest alongside the vectors they stand in for — a recorded
  // key always has a condition bit set, so zero is free to mean empty.
  private static long[] recentFirst = new long[0];
  private static long[] recentSecond = new long[0];
  private static List<long[]> seen = new ArrayList<>();
  private static List<long[]> runWide = new ArrayList<>();
  private static final List<Record> records = new ArrayList<>();
  private static int current = -1;
  private static int open = 0;
  private static boolean overlapped = false;
  private static boolean armed = false;

  private static final int VALUE_SHIFT = 24;
  private static final int OUTCOME_SHIFT = 48;
  private static final int MAX_WIDTH = 24;

  private static final class Record {
    final String name;
    /// Which framework announced this test. A project can run JUnit and
    /// TestNG in one JVM, and a report that named the wrong one would say the
    /// test was attributed by a lifecycle that never saw it.
    String runner = "";
    // How the test ended, as the framework saw it. Defaulted rather than
    // required: a test that reports nothing finished normally, and the
    // runtime should not need the framework's cooperation to say so.
    String status = "passed";
    /// Whether what this test reached could be credited to it. False for every
    /// record once tests have been seen running at once: the test ran and has
    /// an outcome, and its coverage is in the run-wide totals rather than its
    /// own. Leaving such a test out entirely reads downstream as a test that
    /// never ran, and a suite of nothing but concurrent tests then published
    /// no tests at all.
    boolean unattributed = false;
    final List<int[]> probes = new ArrayList<>();
    final List<long[]> vectors = new ArrayList<>();

    Record(String name) {
      this.name = name;
    }
  }

  /** Prepares the runtime for a run of {@code probes} probes. */
  public static synchronized void arm(int probes, int[] conditions) {
    // A project running both JUnit and TestNG installs two listeners in one
    // JVM, and each arms the runtime at its own start. Re-arming would throw
    // away everything the framework that went first had recorded, so a second
    // call describing the same run is left alone.
    if (armed && HITS.length == probes && widths.length == conditions.length) {
      return;
    }
    // Already the right size from PROBE_COUNT in the ordinary case; this is
    // what makes a differently-sized run, or a second one, start clean.
    armed = true;
    HITS = new int[probes];
    global = new int[probes];
    widths = conditions;
    evaluating = new long[conditions.length];
    truth = new long[conditions.length];
    recentFirst = new long[conditions.length];
    recentSecond = new long[conditions.length];
    seen = new ArrayList<>();
    runWide = new ArrayList<>();
    for (int i = 0; i < conditions.length; i++) {
      seen.add(new long[0]);
      runWide.add(new long[0]);
    }
    records.clear();
    current = -1;
    open = 0;
    overlapped = false;
  }

  /**
   * Binds every probe that fires next to this test.
   *
   * <p>Attribution is a harvest at the boundary rather than a lookup on every
   * probe: whatever the array holds now belongs to whoever was running, so it
   * is swept into their record and cleared.
   */
  public static synchronized void enterTest(String name) {
    enterTest(name, "");
  }

  /** Binds every probe that fires next to this test of this runner. */
  public static synchronized void enterTest(String name, String runner) {
    harvest();
    if (open > 0) {
      overlap();
    }
    open++;
    Record record = new Record(name);
    record.runner = runner;
    if (overlapped) {
      // Named and credited with nothing. `current` is left alone so no probe
      // is attributed to it, and the thread remembers which record is its own
      // so the outcome can still be written when the test ends -- tests that
      // overlap do not finish in the order they started.
      record.unattributed = true;
      records.add(record);
      concurrentRecord.set(records.size() - 1);
      return;
    }
    records.add(record);
    current = records.size() - 1;
  }

  /** Ends the running test, harvesting what it reached. */
  public static synchronized void exitTest() {
    exitTest("passed");
  }

  /** Ends the running test, recording how the framework says it ended. */
  public static synchronized void exitTest(String status) {
    if (overlapped) {
      Integer mine = concurrentRecord.get();
      if (mine != null && mine >= 0 && mine < records.size()) {
        records.get(mine).status = status;
      }
      concurrentRecord.remove();
    } else if (current >= 0 && current < records.size()) {
      records.get(current).status = status;
    }
    harvest();
    open = Math.max(0, open - 1);
    current = -1;
  }

  /**
   * Gives up on per-test attribution, once, for the whole run.
   *
   * <p>Probes are a store into one shared array precisely so they cost a
   * single instruction, and attribution is a sweep of that array at each test
   * boundary. Two tests running at once share the array, so the sweep credits
   * whatever it finds to whoever happens to be current — every record from
   * then on is a guess, and records already closed may have had their hits
   * swept into a neighbour. Which ones are wrong is not knowable from here.
   *
   * <p>Run-wide totals are unaffected: they are a union, and a union does not
   * care which test contributed what. So the run still measures what the suite
   * reaches; it just cannot say which test reached it, which is the truth
   * rather than a guess dressed as a measurement.
   *
   * <p>Supercov disables parallel execution in the workspace it generates, so
   * reaching this means something else turned it back on.
   */
  /// Which record belongs to the test this thread is running, once records
  /// stopped being attributable. Tests that overlap do not end in the order
  /// they began, so the outcome cannot be written to whichever was last.
  private static final ThreadLocal<Integer> concurrentRecord = new ThreadLocal<>();

  private static void overlap() {
    if (overlapped) {
      return;
    }
    overlapped = true;
    // What was recorded before the overlap was noticed may have had a
    // neighbour's hits swept into it, so no record keeps its probes. They keep
    // their names and outcomes: those tests ran, and saying otherwise is how a
    // concurrent suite came to publish nothing at all.
    for (Record earlier : records) {
      earlier.unattributed = true;
      earlier.probes.clear();
      earlier.vectors.clear();
    }
    current = -1;
    // Condition state is read-modify-write, so concurrent evaluations lose
    // updates and the vectors they produce describe an evaluation that never
    // happened. Unlike the probe array — where every write stores the same
    // constant and concurrency cannot change the result — these cannot be
    // salvaged, so the run keeps statements and branches and drops MC/DC.
    runWide = new ArrayList<>();
    for (int id = 0; id < widths.length; id++) {
      runWide.add(new long[0]);
    }
    System.err.println(
        "supercov: tests ran concurrently. Statement and branch coverage are still recorded"
            + " run-wide, but they cannot be attributed to individual tests, and condition"
            + " coverage is dropped because concurrent evaluations corrupt it. For per-test and"
            + " condition coverage, run the suite sequentially"
            + " (JUnit: junit.jupiter.execution.parallel.enabled=false).");
  }

  private static void harvest() {
    Record into =
        !overlapped && current >= 0 && current < records.size() ? records.get(current) : null;
    for (int index = 0; index < HITS.length; index++) {
      int value = HITS[index];
      if (value == 0) {
        continue;
      }
      global[index] |= value;
      if (into != null) {
        into.probes.add(new int[] {index, value});
      }
      HITS[index] = 0;
    }
    for (int id = 0; id < seen.size(); id++) {
      long[] keys = seen.get(id);
      if (!overlapped) {
        for (long key : keys) {
          if (into != null) {
            into.vectors.add(new long[] {id, key});
          }
          runWide.set(id, including(runWide.get(id), key));
        }
      }
      if (keys.length > 0) {
        seen.set(id, new long[0]);
      }
      recentFirst[id] = 0L;
      recentSecond[id] = 0L;
    }
  }

  /** {@code keys} with {@code key} in it, which may be {@code keys} itself. */
  private static long[] including(long[] keys, long key) {
    for (long existing : keys) {
      if (existing == key) {
        return keys;
      }
    }
    long[] grown = new long[keys.length + 1];
    System.arraycopy(keys, 0, grown, 0, keys.length);
    grown[keys.length] = key;
    return grown;
  }

  /**
   * Observes one condition of a decision and returns it unchanged, so wrapping
   * an operand cannot change what the expression evaluates to. Java evaluates
   * an argument only when the call is reached, which is what keeps {@code &&}
   * and {@code ||} short-circuiting through the wrapper.
   */
  public static boolean c(int id, int index, boolean value) {
    if (id < 0 || id >= evaluating.length || index >= 64) {
      return value;
    }
    long bit = 1L << index;
    if (index == 0) {
      evaluating[id] = bit;
      truth[id] = 0L;
    } else {
      evaluating[id] |= bit;
    }
    if (value) {
      truth[id] |= bit;
    }
    return value;
  }

  /**
   * Records which arm of a branch a condition selects. The form for a branch
   * whose condition is a single operand: no decision to close.
   */
  public static boolean b(int whenTrue, int whenFalse, boolean value) {
    int probe = value ? whenTrue : whenFalse;
    if (probe >= 0 && probe < HITS.length) {
      HITS[probe] = 2;
    }
    return value;
  }

  /**
   * {@code b} for a branch whose condition has several operands: it also closes
   * the decision those operands opened.
   *
   * <p>Every decision Supercov records sits in a branch, so its outcome is the
   * value this wrapper already holds. A separate outcome wrapper would observe
   * the same fact a second time.
   */
  public static boolean bd(int whenTrue, int whenFalse, int id, boolean value) {
    int probe = value ? whenTrue : whenFalse;
    if (probe >= 0 && probe < HITS.length) {
      HITS[probe] = 2;
    }
    if (id < 0 || id >= evaluating.length) {
      return value;
    }
    long key = evaluating[id] | (truth[id] << VALUE_SHIFT);
    if (value) {
      key |= 1L << OUTCOME_SHIFT;
    }
    evaluating[id] = 0L;
    long mask = key & ((1L << VALUE_SHIFT) - 1);
    if (mask == 0L || widths[id] > MAX_WIDTH) {
      return value;
    }
    // Everything above is a handful of array accesses; `remember` takes a
    // monitor. A decision inside a loop almost always produces the vector it
    // produced last time, so answering from the cache keeps the lock off the
    // path that runs millions of times and leaves it for the rare new vector.
    if (key == recentFirst[id] || key == recentSecond[id]) {
      return value;
    }
    remember(id, key);
    return value;
  }

  private static synchronized void remember(int id, long key) {
    recentSecond[id] = recentFirst[id];
    recentFirst[id] = key;
    long[] keys = seen.get(id);
    for (long existing : keys) {
      if (existing == key) {
        return;
      }
    }
    long[] grown = new long[keys.length + 1];
    System.arraycopy(keys, 0, grown, 0, keys.length);
    grown[keys.length] = key;
    seen.set(id, grown);
  }

  /**
   * Writes this JVM's evidence into {@code directory}, under a name no other
   * JVM will choose.
   *
   * <p>A build may fork more than one JVM to run its tests in parallel --
   * Gradle's maxParallelForks and surefire's forkCount both do, and RxJava
   * sets the first to the number of processors. Every one of them runs this
   * listener, so a single agreed path means each fork overwrites the last and
   * the run keeps whichever finished last: 49 tests of the 406 that ran.
   *
   * <p>The name is a UUID rather than the process id. Nothing reads the name
   * -- the engine merges every file it finds -- so all it has to be is unique
   * per JVM and the same each time this JVM writes. ProcessHandle would say
   * the same thing and is Java 9, and a great many libraries still compile
   * their main source at 8: moshi, gson and OkHttp all do, and the runtime is
   * compiled by the project's own javac, at whatever release the project set.
   */
  private static final String JVM = java.util.UUID.randomUUID().toString();

  public static synchronized void writeInto(String directory) throws IOException {
    java.io.File target = new java.io.File(directory);
    if (!target.isDirectory() && !target.mkdirs() && !target.isDirectory()) {
      throw new IOException("could not create " + directory);
    }
    write(new java.io.File(target, JVM + ".bin").getPath());
  }

  /** Writes the evidence transport the engine reads. */
  public static synchronized void write(String path) throws IOException {
    harvest();
    try (DataOutputStream out =
        new DataOutputStream(new BufferedOutputStream(new FileOutputStream(path), 1 << 20))) {
      putLong(out, global.length);
      for (int value : global) {
        putLong(out, value);
      }
      putLong(out, records.size());
      for (Record record : records) {
        byte[] name = record.name.getBytes("UTF-8");
        putLong(out, name.length);
        out.write(name);
        byte[] status = record.status.getBytes("UTF-8");
        putLong(out, status.length);
        out.write(status);
        // Whether the probes below are this test's own. Every JUnit Platform
        // and TestNG lifecycle this attaches to reports one test at a time, so
        // it always is -- but the reader is shared with frontends where that
        // is not true, and a field written by one writer and not the other is
        // not a format, it is a guess about which wrote the file.
        putLong(out, record.unattributed ? 1 : 0);
        byte[] runner = record.runner.getBytes("UTF-8");
        putLong(out, runner.length);
        out.write(runner);
        putLong(out, record.probes.size());
        for (int[] hit : record.probes) {
          putLong(out, hit[0]);
          putLong(out, hit[1]);
        }
        putLong(out, record.vectors.size());
        for (long[] hit : record.vectors) {
          putLong(out, hit[0]);
          putLong(out, hit[1]);
        }
      }
      putLong(out, widths.length);
      for (int id = 0; id < widths.length; id++) {
        putLong(out, widths[id]);
        // Run-wide rather than a union over the records: the table describes
        // what the run evaluated, which stands even when attribution does not.
        long[] union = id < runWide.size() ? runWide.get(id) : new long[0];
        putLong(out, union.length);
        for (long key : union) {
          putLong(out, key);
        }
      }
    }
  }

  /** Little-endian, matching every other Supercov transport. */
  private static void putLong(DataOutputStream out, long value) throws IOException {
    for (int shift = 0; shift < 64; shift += 8) {
      out.write((int) ((value >>> shift) & 0xFF));
    }
  }
}
