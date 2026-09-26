package com.supercorp.supercov;

import org.junit.platform.engine.TestExecutionResult;
import org.junit.platform.engine.support.descriptor.ClassSource;
import org.junit.platform.launcher.TestExecutionListener;
import org.junit.platform.launcher.TestIdentifier;
import org.junit.platform.launcher.TestPlan;

/**
 * Binds JVM tests to their evidence through the JUnit Platform rather than by
 * rewriting test source.
 *
 * <p>This is the better half of the problem. Annotations only find tests that
 * are declared as annotated methods, which leaves out every DSL framework —
 * Kotest writes {@code test("name") { }} inside a constructor block, Spock
 * writes {@code def "name"()} in Groovy. The platform sees all of them,
 * because every one of those frameworks is a platform engine, and it sees them
 * with the names the framework itself chose.
 *
 * <p>It also costs the project's test sources nothing. Supercov rewrites
 * product source because it must; rewriting tests as well would put edits in
 * files people read constantly for no measurement it could not get here.
 *
 * <p>Registered by putting its name in
 * {@code META-INF/services/org.junit.platform.launcher.TestExecutionListener}.
 * Supercov writes that file into the instrumented workspace.
 */
public final class SupercovListener implements TestExecutionListener {

  /**
   * The generated configuration class Supercov writes beside the instrumented
   * sources. Looked up reflectively so this listener compiles and ships
   * without it, and so a project that somehow runs it unconfigured degrades to
   * recording nothing rather than failing the suite.
   */
  private static final String CONFIG = "com.supercorp.supercov.SupercovConfig";

  /** The runner this listener speaks for, as the frontend declares it. */
  private static final String RUNNER = "junit-platform";

  private String evidenceDirectory = "supercov-evidence";
  private TestPlan plan;

  @Override
  public void testPlanExecutionStarted(TestPlan plan) {
    this.plan = plan;
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
  public void executionStarted(TestIdentifier identifier) {
    if (identifier.isTest()) {
      Supercov.enterTest(name(identifier), RUNNER);
    }
  }

  @Override
  public void executionFinished(TestIdentifier identifier, TestExecutionResult result) {
    if (identifier.isTest()) {
      Supercov.exitTest(status(result));
    }
  }

  /**
   * A test that was never started, because a condition or assumption ruled it
   * out. The platform reports it instead of a start/finish pair, so it is
   * opened and closed here to leave a record that covers nothing — which is
   * the truth, and more useful than the test's absence.
   */
  @Override
  public void executionSkipped(TestIdentifier identifier, String reason) {
    if (identifier.isTest()) {
      Supercov.enterTest(name(identifier), RUNNER);
      Supercov.exitTest("skipped");
    }
  }

  /**
   * How the test ended, in the vocabulary the evidence uses.
   *
   * <p>Aborted is a skip rather than a failure: an assumption that did not
   * hold means the test declined to run, and counting its coverage as proven
   * would credit a test that never made its assertions.
   */
  private static String status(TestExecutionResult result) {
    switch (result.getStatus()) {
      case FAILED:
        return "failed";
      case ABORTED:
        return "skipped";
      default:
        return "passed";
    }
  }

  /**
   * The name the framework itself chose, qualified by whatever contains it.
   *
   * <p>A Kotest test is named by its string and a JUnit one by its method, and
   * both read the way their author wrote them. Inventing a scheme here would
   * disagree with every other tool the project uses, and a reader matching a
   * coverage report against a test report should not have to translate.
   */
  private String name(TestIdentifier identifier) {
    StringBuilder qualified = new StringBuilder(identifier.getDisplayName());
    TestIdentifier current = identifier;
    while (plan != null) {
      TestIdentifier parent = plan.getParent(current).orElse(null);
      // The engine itself is not a useful part of a test's name.
      if (parent == null || !plan.getParent(parent).isPresent()) {
        break;
      }
      qualified.insert(0, containerName(parent) + "#");
      current = parent;
    }
    return qualified.toString();
  }

  /**
   * What to call a container: its class's fully qualified name where the
   * platform reports one, and its display name otherwise.
   *
   * <p>A display name is the simple class name, and two classes with the same
   * simple name in different packages are different tests — gson has several.
   * Naming them the same makes two tests one, which the reader refuses
   * outright rather than silently merge. Anything without a class source, such
   * as a Kotest or Spock nesting level, keeps the wording its author chose.
   */
  private static String containerName(TestIdentifier identifier) {
    return identifier
        .getSource()
        .filter(source -> source instanceof ClassSource)
        .map(source -> ((ClassSource) source).getClassName())
        .orElseGet(identifier::getDisplayName);
  }

  @Override
  public void testPlanExecutionFinished(TestPlan plan) {
    try {
      Supercov.writeInto(evidenceDirectory);
    } catch (Exception e) {
      // The measurement is lost either way; failing the suite as well helps
      // nobody, so this says what happened and lets the tests stand.
      System.err.println("supercov: could not write coverage evidence: " + e);
    }
  }
}
