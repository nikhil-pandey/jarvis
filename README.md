# Jarvis - Voice-First AI Assistant

A sophisticated Next.js application that provides a voice-first AI assistant interface with real-time audio processing capabilities.

## Features

- 🎙️ Real-time voice interaction
- 🤖 AI-powered conversations
- 🎨 Dark mode support
- 📊 Real-time audio visualization
- 🔧 Customizable tool integrations
- 💾 Persistent chat history
- ⚡ Built with Next.js and TypeScript

## Tech Stack

- **Framework**: Next.js 15.0
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: Zustand
- **Markdown**: react-markdown
- **Form Handling**: react-hook-form with Zod validation

## Getting Started

1. Clone the repository
2. Install dependencies:
```bash
pnpm install
```

3. Run the development server:
```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── app/              # Next.js app directory
├── components/       # React components
│   ├── ui/          # shadcn/ui components
│   ├── chat/        # Chat interface components
│   ├── landing/     # Landing page components
│   └── tools/       # Tool-specific components
├── contexts/        # React contexts
├── hooks/           # Custom React hooks
├── lib/            # Utility functions and tools
└── types/          # TypeScript type definitions
```

## Features in Detail

### Voice Interaction
- Real-time audio recording and processing
- WebAudio API integration for audio visualization
- Voice activity detection

### Chat Interface
- Real-time conversation updates
- Markdown support for messages
- Code syntax highlighting
- Tool integration support

### Tools System
- Extensible tool architecture
- Built-in weather and text editor tools
- Custom tool settings management

### Settings & Configuration
- Customizable audio settings
- Connection configuration
- Chat behavior preferences
- Export/Import functionality

## Development

### Code Style

The project uses:
- ESLint for code linting
- Prettier for code formatting
- TypeScript for type safety

### Commands

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm format       # Format code with Prettier
pnpm type-check   # Run TypeScript checks
pnpm storybook    # Start Storybook
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Add your environment variables here
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
