package com.supercorp.supercov;

import java.util.HashMap;
import java.util.Map;
import org.testng.IExecutionListener;
import org.testng.ITestListener;
import org.testng.ITestResult;

/**
 * Binds TestNG tests to their evidence.
 *
 * <p>TestNG is the one framework {@link SupercovListener} cannot reach. Kotest
 * and Spock are JUnit Platform engines and the platform reports their tests
 * like any other; TestNG has a lifecycle of its own, so it needs a listener of
 * its own. The mechanism is the same in spirit — the framework announces each
 * test and Supercov records against it — and so the test sources stay
 * untouched here too.
 *
 * <p>Registered by putting its name in
 * {@code META-INF/services/org.testng.ITestNGListener}. Supercov writes that
 * file into the instrumented workspace, and writes this class there only when
 * the project actually depends on TestNG: compiling it anywhere else would
 * fail on imports the project never asked for.
 */
public final class SupercovTestNGListener implements IExecutionListener, ITestListener {

  /**
   * The generated configuration class Supercov writes beside the instrumented
   * sources. Looked up reflectively so this listener compiles and ships
   * without it, and so a project that somehow runs it unconfigured degrades to
   * recording nothing rather than failing the suite.
   */
  private static final String CONFIG = "com.supercorp.supercov.SupercovConfig";

  /** The runner this listener speaks for, as the frontend declares it. */
  private static final String RUNNER = "testng";

  private String evidenceDirectory = "supercov-evidence";

  /**
   * How many times each test name has been announced.
   *
   * <p>A data provider runs one method many times, and TestNG reports each
   * invocation under the same name. Each is its own test as far as coverage
   * goes — they reach different code, which is the whole point of a data
   * provider — so a repeat gets an index rather than overwriting what the
   * previous invocation proved.
   */
  private final Map<String, Integer> seen = new HashMap<>();

  @Override
  public void onExecutionStart() {
    try {
      Class<?> config = Class.forName(CONFIG);
      int probes = config.getField("PROBES").getInt(null);
      int[] widths = (int[]) config.getField("WIDTHS").get(null);
      evidenceDirectory = (String) config.getField("EVIDENCE").get(null);
      Supercov.arm(probes, widths);
    } catch (ReflectiveOperationException | ClassCastException e) {
      // Nothing to measure against. Recording nothing is the honest outcome;
      // failing the user's suite over Supercov's own configuration is not.
      Supercov.arm(0, new int[0]);
    }
  }

  @Override
  public void onTestStart(ITestResult result) {
    Supercov.enterTest(name(result), RUNNER);
  }

  @Override
  public void onTestSuccess(ITestResult result) {
    Supercov.exitTest("passed");
  }

  @Override
  public void onTestFailure(ITestResult result) {
    Supercov.exitTest("failed");
  }

  @Override
  public void onTestSkipped(ITestResult result) {
    // TestNG announces a skipped test only when it started and then bailed —
    // a failed dependency, say. One that was never announced is recorded by
    // nobody, which is the same answer.
    Supercov.exitTest("skipped");
  }

  /**
   * A test that failed but stayed inside its allowed failure percentage.
   *
   * <p>TestNG calls this a success at the suite level, and the coverage it
   * produced is coverage a failing invocation produced. Recorded as failed,
   * because the question coverage answers is what a passing test proved.
   */
  @Override
  public void onTestFailedButWithinSuccessPercentage(ITestResult result) {
    Supercov.exitTest("failed");
  }

  @Override
  public void onExecutionFinish() {
    try {
      Supercov.writeInto(evidenceDirectory);
    } catch (Exception e) {
      // The measurement is lost either way; failing the suite as well helps
      // nobody, so this says what happened and lets the tests stand.
      System.err.println("supercov: could not write coverage evidence: " + e);
    }
  }

  /**
   * The name TestNG itself uses, shaped like the platform listener's so a
   * reader matching a coverage report against a test report never has to
   * translate between two schemes.
   */
  private String name(ITestResult result) {
    String base =
        result.getTestClass().getRealClass().getSimpleName()
            + "#"
            + result.getMethod().getMethodName()
            + "()";
    int count = seen.merge(base, 1, Integer::sum);
    return count == 1 ? base : base + "[" + (count - 1) + "]";
  }
}
