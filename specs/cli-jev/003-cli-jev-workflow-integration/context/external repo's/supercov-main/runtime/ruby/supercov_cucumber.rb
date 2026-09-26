# frozen_string_literal: true

# Supercov Cucumber adapter: exact scenario identity with Before hooks as
# setup, steps as the call phase and After hooks as teardown, plus Cucumber's
# own result for each scenario.

module Supercov
  module CucumberAdapter
    RUNNER = "cucumber"

    module RuntimeHooks
      def run!
        Supercov::CucumberAdapter.subscribe(@configuration)
        super
      end
    end

    @runtime = nil
    @state = nil

    def self.install(runtime)
      return if @runtime

      @runtime = runtime
      runtime.adapter_active = true
      ::Cucumber::Runtime.prepend(RuntimeHooks)
    end

    def self.subscribe(configuration)
      configuration.on_event(:test_case_started) { |event| started(event.test_case) }
      configuration.on_event(:test_step_started) { |event| step_started(event.test_step) }
      configuration.on_event(:test_step_finished) { |event| step_finished(event.result) }
      configuration.on_event(:test_case_finished) { |event| finished(event.test_case, event.result) }
    end

    def self.identity(test_case)
      { worker: @runtime.worker, test: test_case.location.to_s, retry: 0, phase: nil }
    end

    # A Cucumber location is "features/a.feature:3"; the feature file is the
    # part before the line.
    def self.source_file(test_case)
      test_case.location.file
    rescue NoMethodError
      nil
    end

    def self.enter(phase)
      state = @state
      return if state.nil? || state[:phase] == phase

      state[:phase] = phase
      state[:phases][phase] ||= "passed"
      identity = identity(state[:test_case])
      identity[:phase] = phase
      @runtime.switch(identity)
    end

    def self.started(test_case)
      @state = { test_case: test_case, phase: nil, phases: {}, seen_step: false }
      enter("setup")
    end

    def self.step_started(test_step)
      state = @state
      return if state.nil?

      if test_step.hook?
        enter(state[:seen_step] ? "teardown" : "setup")
      else
        state[:seen_step] = true
        enter("call")
      end
    end

    def self.step_finished(result)
      state = @state
      return if state.nil? || state[:phase].nil?

      status = status_of(result)
      state[:phases][state[:phase]] = status unless status == "passed" || state[:phases][state[:phase]] == "failed"
    end

    def self.status_of(result)
      kind = result.class.name.to_s.split("::").last.to_s.downcase
      case kind
      when "passed", "unknown" then "passed"
      when "skipped", "pending" then "skipped"
      else "failed"
      end
    end

    def self.finished(test_case, result)
      state = @state
      @state = nil
      return if state.nil?

      identity = identity(test_case)
      overall = status_of(result)
      %w[setup call teardown].each do |phase|
        status = state[:phases][phase]
        next if status.nil?

        status = overall if phase == "call" && overall != "passed" && status == "passed"
        @runtime.outcome(identity[:worker], identity[:test], 0, phase, status, false, RUNNER, source_file(test_case))
      end
      @runtime.switch(nil)
    end
  end
end
