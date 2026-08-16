import RemoteKit
import SwiftUI

/// The workspace's center: one conversation, on the shared TurnController.
/// The transcript reads in a capped column (640pt — Tomte's validated
/// desktop reading measure); blocking asks render as inline cards in the
/// flow rather than modals, so the window stays yours while the agent
/// waits.
struct WorkspaceSessionView: View {
    @ObservedObject var state: WorkspaceState
    let title: String

    @StateObject private var turn: TurnController
    @State private var input = ""
    @StateObject private var attachments = PromptAttachments()
    /// What the inspector's badge and the Dock count: asks waiting on you.
    private var pending: Int {
        (turn.permission == nil ? 0 : 1) + (turn.question == nil ? 0 : 1)
    }

    init(state: WorkspaceState, project: String, session: String?, title: String) {
        self.state = state
        self.title = title
        _turn = StateObject(wrappedValue: TurnController(
            project: project, session: session, makeLink: state.makeLink
        ))
    }

    /// Commands to offer right now, or nil when the user isn't typing one.
    private var paletteMatches: [AgentCommand]? {
        guard let query = SlashInput.query(input) else { return nil }
        return state.commands.matching(query)
    }

    var body: some View {
        VStack(spacing: 0) {
            Transcript(
                rows: turn.rows, diffs: turn.diffs, error: turn.error,
                running: turn.running, activity: turn.activity,
                turnStartedAt: turn.turnStartedAt,
                todos: turn.todos
            )
            .frame(maxWidth: 640)
            .frame(maxWidth: .infinity)

            if let permission = turn.permission {
                PermissionCard(request: permission) { reply, message in
                    turn.answer(permission, reply: reply, message: message)
                }
                .frame(maxWidth: 640)
                .padding(.vertical, 8)
                .transition(.move(edge: .bottom).combined(with: .opacity))
            }
            if let question = turn.question {
                QuestionCard(request: question) { answers in
                    turn.answer(question, answers: answers)
                }
                .frame(maxWidth: 640)
                .padding(.vertical, 8)
                .transition(.move(edge: .bottom).combined(with: .opacity))
            }

            if let matches = paletteMatches {
                CommandPalette(commands: matches) { command in
                    // Leave a trailing space when the command wants
                    // arguments, so the caret is where typing continues.
                    input = "/\(command.name)" + (command.takesArguments ? " " : "")
                }
                .frame(maxWidth: 640)
            }
            DesktopComposer(
                input: $input,
                running: turn.running,
                attachments: attachments,
                models: state.models,
                agents: state.agents,
                onSend: send,
                onAbort: { turn.abort() }
            )
            .frame(maxWidth: 640)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Color.canvas)
        .navigationTitle(title)
        .inspector(isPresented: $state.inspectorShown) {
            InspectorPane(state: state, turn: turn, tab: $state.inspectorTab)
                .inspectorColumnWidth(min: 300, ideal: 380, max: 760)
        }
        .toolbar {
            ToolbarItem {
                if turn.running {
                    // The transcript's working indicator anchors autoscroll;
                    // this is its always-visible echo for when you've
                    // scrolled away.
                    HStack(spacing: 6) {
                        ProgressView().controlSize(.small)
                        Text(turn.activity)
                            .font(.caption)
                            .foregroundStyle(Color.inkMuted)
                    }
                }
            }
            ToolbarItem {
                Button {
                    state.inspectorShown.toggle()
                } label: {
                    Image(systemName: "sidebar.right")
                        .overlay(alignment: .topTrailing) {
                            if pending > 0 {
                                Circle()
                                    .fill(Color.caution)
                                    .frame(width: 7, height: 7)
                                    .offset(x: 3, y: -3)
                            }
                        }
                }
                .accessibilityLabel("Toggle inspector")
            }
        }
        .onChange(of: pending) {
            // The Dock badge is the "it needs you" signal when the window
            // is buried; approvals are foreground-only on the desktop.
            NSApp.dockTile.badgeLabel = pending > 0 ? String(pending) : nil
        }
        .onDisappear { NSApp.dockTile.badgeLabel = nil }
        .onChange(of: attachments.error) {
            if let message = attachments.error { turn.error = message }
        }
        .animation(Motion.easeOut(Motion.feedback), value: turn.permission?.id)
        .animation(Motion.easeOut(Motion.feedback), value: turn.question?.id)
        .animation(.easeOut(duration: 0.15), value: paletteMatches?.count)
        .onReceive(NotificationCenter.default.publisher(for: WorkspaceCommand.approveOnce)) { _ in
            if let permission = turn.permission {
                turn.answer(permission, reply: "once", message: nil)
            }
        }
        .onReceive(NotificationCenter.default.publisher(for: WorkspaceCommand.reject)) { _ in
            if let permission = turn.permission {
                turn.answer(permission, reply: "reject", message: nil)
            }
        }
        .onChange(of: state.pendingCommand?.name) {
            guard let command = state.pendingCommand else { return }
            state.pendingCommand = nil
            input = "/\(command.name)" + (command.takesArguments ? " " : "")
        }
        .task { await turn.loadTranscript() }
    }

    private func send() {
        let text = input.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !text.isEmpty || !attachments.isEmpty else { return }
        input = ""
        turn.send(
            text,
            attachments: attachments,
            model: state.models.selected,
            agent: state.agents.selected?.name,
            knownCommands: state.commands.commands
        )
    }
}
