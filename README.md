# Scribe

Write one progress update, publish it to LinkedIn, Discord and GitHub first. Instagram and others may follow.

## What it is

A tool for learning in public. Instead of posting the same update by hand on every platform, you write what you did, your progress and what you are up to in one place, attach images or video, and it publishes to your accounts on several platforms, formatted for each one with suitable hashtags.

Replies, comments and support stay in each platform's own app. Scribe is for writing and publishing updates, not for managing conversations.

## Status

Planning. The base model comes first, then more platforms and features are added.

- Base model goal: write one update, attach media, choose platforms, publish with one click to a small set of platforms.
- Later: more platforms, scheduling, better media handling, progress tracking.
- Platforms: LinkedIn, Discord and GitHub first, because none of them needs a paid API as far as the docs show. Later: Instagram (more setup). X is on hold because its API costs money. YouTube has no API for community posts that I could find.
- Tech stack: not decided yet.

## Repository layout

| Path | Purpose |
|---|---|
| `README.md` | This file |
| `docs/` | Project notes, platform research, design decisions |
| `.gitignore` | Keeps secrets and build output out of Git |

Code will be added here once the base model and stack are decided.

## Secrets

Never commit passwords, API keys, tokens or `.env` files. This repository may be public. Keep secrets in a local `.env` file, which is ignored by Git, and commit an `.env.example` with empty placeholder values instead.

## How the project is run

The project's working memory (current state, decisions, lessons) is kept outside this repository, so work can continue across several chat sessions. This repository holds the code and the notes in `docs/`.
