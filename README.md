# React + TypeScript + Vite Starter

A lightweight React setup powered by Vite, with Hot Module Replacement and a pre-configured ESLint baseline out of the box.

## Fast Refresh

Two official Vite plugins can handle Fast Refresh for React:

- **[@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react)** — built on top of [Oxc](https://oxc.rs)
- **[@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react)** — built on top of [SWC](https://swc.rs/)

Either one works fine for local development; pick whichever your setup already uses.

## About the React Compiler

This starter ships without the React Compiler enabled, mainly to keep dev and build times fast. If you want to opt in, follow the official guide: [react.dev/learn/react-compiler](https://react.dev/learn/react-compiler/installation).

## Linting

The base ESLint config here covers the essentials. For a production-grade app, it's worth switching to type-aware rules via `typescript-eslint`, and optionally adding:

- `eslint-plugin-react-x` — React-specific linting
- `eslint-plugin-react-dom` — DOM-related React rules

## Available Scripts

| Command           | Description                        |
| ------------------ | ----------------------------------- |
| `npm run dev`      | Start the dev server with HMR      |
| `npm run build`    | Type-check and build for production |
| `npm run preview`  | Preview the production build       |
| `npm run lint`     | Run ESLint across the project      |

## Tech Stack

- React
- TypeScript
- Vite