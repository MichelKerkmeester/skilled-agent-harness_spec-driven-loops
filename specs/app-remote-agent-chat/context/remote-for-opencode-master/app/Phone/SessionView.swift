import RemoteKit
import SwiftUI

/// One conversation with the agent: prompt at the bottom, the turn
/// streaming above it, approvals as a sheet the moment the agent blocks.
///
/// The turn lifecycle itself — send/resume/abort, the event loop, the
/// reconnection design — lives in the shared `TurnController`; this screen
/// is the phone-shaped shell around it: sheets, dictation, scenePhase.
struct SessionView: View {
    let title: String

    @StateObject private var turn: TurnController
    @State private var input = ""
    @Environment(\.scenePhase) private var scenePhase
    @StateObject private var dictation = Dictation()
    @ObservedObject private var models = ModelStore.shared
    @ObservedObject private var commands = CommandStore.shared
    @ObservedObject private var agents = AgentStore.shared
    @State private var showingChanges = false
    @StateObject private var attachments = PromptAttachments()
    /// What was typed before dictation started, so speech appends to it
    /// rather than eating it.
    @State private var typedBeforeDictation = ""

    init(project: String, session: String?, title: String) {
        self.title = title
        _turn = StateObject(wrappedValue: TurnController(project: project, session: session))
    }

    /// Commands to offer right now, or nil when the user isn't typing one.
    private var paletteMatches: [AgentCommand]? {
        guard let query = SlashInput.query(input) else { return nil }
        return commands.matching(query)
    }

    var body: some View {
        VStack(spacing: 0) {
            Transcript(
                rows: turn.rows, diffs: turn.diffs, error: turn.error,
                running: turn.running, activity: turn.activity,
                turnStartedAt: turn.turnStartedAt,
                todos: turn.todos
            )
            if let matches = paletteMatches {
                CommandPalette(commands: matches) { command in
                    // Leave a trailing space when the command wants
                    // arguments, so the caret is where typing continues.
                    input = "/\(command.name)" + (command.takesArguments ? " " : "")
                }
            }
            Composer(
                input: $input,
                running: turn.running,
                dictation: dictation,
                attachments: attachments,
                models: models,
                agents: agents,
                onDictate: {
                    if !dictation.recording { typedBeforeDictation = input }
                    dictation.toggle()
                },
                onSend: { turn.running ? turn.abort() : send() }
            )
        }
        .navigationTitle(title)
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .topBarTrailing) {
                Button { showingChanges = true } label: {
                    Image(systemName: "arrow.triangle.branch")
                }
                .accessibilityLabel("Review changes")
            }
        }
        .sheet(isPresented: $showingChanges) {
            ChangesView(project: turn.project)
        }
        .sheet(item: $turn.permission) { request in
            PermissionSheet(request: request) { reply, message in
                turn.answer(request, reply: reply, message: message)
            }
        }
        .sheet(item: $turn.question) { request in
            QuestionSheet(request: request) { answers in
                turn.answer(request, answers: answers)
            }
        }
        .onChange(of: attachments.error) {
            if let message = attachments.error { turn.error = message }
        }
        .task {
            turn.active = scenePhase == .active
            await turn.loadTranscript()
        }
        .task { await models.loadIfNeeded() }
        .task { await commands.loadIfNeeded() }
        .task { await agents.loadIfNeeded() }
        .animation(.easeOut(duration: 0.15), value: paletteMatches?.count)
        .onChange(of: scenePhase) {
            turn.active = scenePhase == .active
            // Back on screen with a turn unfinished: the socket is dead
            // (iOS killed it), the Mac's work isn't. Pick the turn back up.
            if scenePhase == .active, turn.running { turn.resume() }
            // Leaving with the mic live would keep recording off-screen.
            if scenePhase != .active { dictation.stop() }
        }
        .onChange(of: dictation.transcript) {
            guard !dictation.transcript.isEmpty else { return }
            let prefix = typedBeforeDictation.isEmpty ? "" : typedBeforeDictation + " "
            input = prefix + dictation.transcript
        }
        .onChange(of: dictation.error) {
            if let message = dictation.error { turn.error = message }
        }
    }

    private func send() {
        let text = input.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !text.isEmpty || !attachments.isEmpty else { return }
        // Order matters: stop the recogniser and drop its transcript before
        // clearing, or its next partial result refills the field.
        dictation.reset()
        typedBeforeDictation = ""
        input = ""
        // A multi-line TextField holds uncommitted text — the predictive
        // suggestion sitting in the field — and commits it to the binding
        // after our button action returns, refilling what we just cleared.
        // Clearing again on the next tick wins that race.
        Task { @MainActor in input = "" }
        turn.send(
            text,
            attachments: attachments,
            model: models.selected,
            agent: agents.selected?.name,
            knownCommands: commands.commands
        )
    }
}
