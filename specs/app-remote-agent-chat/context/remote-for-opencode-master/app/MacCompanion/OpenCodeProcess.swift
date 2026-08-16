import RemoteKit
import Foundation
import OSLog

/// Owns the `opencode serve` child process. The whole product story is "the
/// user never runs a command", so this finds the binary, starts the server
/// bound to localhost on an OS-assigned port, restarts it when it dies, and
/// reports state the menu bar can show.
///
/// The server is deliberately never exposed to the network — 127.0.0.1 only.
/// The phone reaches it exclusively through RemoteServer's authenticated,
/// encrypted channel; this process is the only trusted gateway.
@MainActor
final class OpenCodeProcess: ObservableObject {
    enum State: Equatable {
        case stopped
        case starting
        /// Serving on this localhost port.
        case running(port: Int, version: String)
        /// Something the user may need to act on ("OpenCode isn't
        /// installed"), or the last crash while backoff counts down.
        case failed(String)
    }

    @Published private(set) var state: State = .stopped

    private let logger = Logger(subsystem: "com.timwilliams.opencodego", category: "opencode")
    private var process: Process?
    private var restartAttempts = 0
    private var stopping = false

    /// Where the homebrew, manual, and bun installs land. `which` isn't
    /// available to a GUI app (no login-shell PATH), so known locations
    /// first, then a login shell as the fallback for exotic setups.
    static func findBinary() -> String? {
        let candidates = [
            "/opt/homebrew/bin/opencode",
            "/usr/local/bin/opencode",
            NSString(string: "~/.bun/bin/opencode").expandingTildeInPath,
            NSString(string: "~/.opencode/bin/opencode").expandingTildeInPath,
        ]
        if let found = candidates.first(where: { FileManager.default.isExecutableFile(atPath: $0) }) {
            return found
        }
        let probe = Process()
        probe.executableURL = URL(fileURLWithPath: "/bin/zsh")
        probe.arguments = ["-lc", "command -v opencode"]
        let pipe = Pipe()
        probe.standardOutput = pipe
        try? probe.run()
        probe.waitUntilExit()
        let path = String(
            data: pipe.fileHandleForReading.readDataToEndOfFile(), encoding: .utf8
        )?.trimmingCharacters(in: .whitespacesAndNewlines)
        return (path?.isEmpty == false) ? path : nil
    }

    func start() {
        reapStalechild()
        guard case .running = state else {
            launch()
            return
        }
    }

    /// A previous companion that crashed (or was stopped from Xcode) leaves
    /// its `opencode serve` child running — children don't die with their
    /// parent. The pidfile remembers who we spawned so the next launch can
    /// clean up, and only ever kills a process that is still ours.
    private static let pidfile = FileManager.default.urls(
        for: .applicationSupportDirectory, in: .userDomainMask
    // Still the pre-rename directory name: a 1.0 companion that crashed
    // left its pid there, and moving the path would orphan that child on
    // the first post-rename launch.
    )[0].appendingPathComponent("OpenCodeGo/opencode.pid")

    private func reapStalechild() {
        guard let text = try? String(contentsOf: Self.pidfile, encoding: .utf8),
              let pid = Int32(text.trimmingCharacters(in: .whitespacesAndNewlines))
        else { return }
        try? FileManager.default.removeItem(at: Self.pidfile)
        // Verify it's still an opencode process before signalling — PIDs
        // get recycled, and killing a stranger is worse than an orphan.
        let probe = Process()
        probe.executableURL = URL(fileURLWithPath: "/bin/ps")
        probe.arguments = ["-p", "\(pid)", "-o", "command="]
        let pipe = Pipe()
        probe.standardOutput = pipe
        try? probe.run()
        probe.waitUntilExit()
        let command = String(
            data: pipe.fileHandleForReading.readDataToEndOfFile(), encoding: .utf8
        ) ?? ""
        guard command.contains("opencode") else { return }
        logger.notice("killing orphaned opencode serve (pid \(pid))")
        kill(pid, SIGTERM)
    }

    private func remember(_ pid: Int32) {
        let dir = Self.pidfile.deletingLastPathComponent()
        try? FileManager.default.createDirectory(at: dir, withIntermediateDirectories: true)
        try? "\(pid)".write(to: Self.pidfile, atomically: true, encoding: .utf8)
    }

    func stop() {
        stopping = true
        process?.terminate()
        process = nil
        try? FileManager.default.removeItem(at: Self.pidfile)
        state = .stopped
    }

    private func launch() {
        guard let binary = Self.findBinary() else {
            state = .failed("OpenCode isn't installed. Install it with: brew install opencode")
            return
        }
        state = .starting
        stopping = false

        let p = Process()
        p.executableURL = URL(fileURLWithPath: binary)
        // --port 0: the OS assigns a free port, printed on stdout. No fixed
        // port means no collision with the user's own `opencode serve`.
        p.arguments = ["serve", "--port", "0"]
        var env = ProcessInfo.processInfo.environment
        // The CLI shells out to git and friends; a GUI app's PATH lacks
        // their usual homes.
        env["PATH"] = "/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:" + (env["PATH"] ?? "")
        p.environment = env

        let out = Pipe()
        p.standardOutput = out
        p.standardError = out
        var buffer = ""
        out.fileHandleForReading.readabilityHandler = { [weak self] handle in
            guard let text = String(data: handle.availableData, encoding: .utf8), !text.isEmpty
            else { return }
            buffer += text
            // "opencode server listening on http://127.0.0.1:PORT"
            if let range = buffer.range(of: #"listening on http://127\.0\.0\.1:(\d+)"#, options: .regularExpression) {
                let port = Int(buffer[range].split(separator: ":").last ?? "") ?? 0
                out.fileHandleForReading.readabilityHandler = nil
                Task { @MainActor [weak self] in self?.confirm(port: port) }
            }
        }
        p.terminationHandler = { [weak self] _ in
            Task { @MainActor [weak self] in self?.exited() }
        }
        do {
            try p.run()
            process = p
            remember(p.processIdentifier)
            logger.notice("launched \(binary, privacy: .public)")
        } catch {
            state = .failed("Couldn't start OpenCode: \(error.localizedDescription)")
        }
    }

    /// The port is known; prove the server actually answers before calling
    /// it running — a health check is cheap and `/global/health` carries the
    /// version the capability handshake wants anyway.
    private func confirm(port: Int) {
        Task { @MainActor in
            let adapter = OpenCodeAdapter(port: port)
            for attempt in 0 ..< 20 {
                if let health = try? await adapter.health(), health.healthy {
                    state = .running(port: port, version: health.version)
                    restartAttempts = 0
                    logger.notice("opencode \(health.version, privacy: .public) on port \(port)")
                    return
                }
                try? await Task.sleep(for: .milliseconds(250 * (attempt + 1)))
            }
            state = .failed("OpenCode started but never became healthy.")
            process?.terminate()
        }
    }

    private func exited() {
        process = nil
        guard !stopping else { return }
        restartAttempts += 1
        guard restartAttempts <= 5 else {
            state = .failed("OpenCode keeps crashing — check its logs.")
            return
        }
        let delay = Double(restartAttempts) * 2
        logger.error("opencode exited; restarting in \(Int(delay))s (attempt \(self.restartAttempts))")
        state = .starting
        Task { @MainActor in
            try? await Task.sleep(for: .seconds(delay))
            guard !stopping else { return }
            launch()
        }
    }
}
