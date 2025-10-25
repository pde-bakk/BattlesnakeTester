# BattlesnakeTester

There are 2 sets of tests (normal and hard). Normal tests should be cases where failing the test results in you dying or a very high chance of death. Hard tests can be special situations where certain moves might be arguably better than others, but don't necessairly mean certain death. Hard tests often involve more looking ahead or prediction.

## Installation

First install dependencies:
```bash
npm install
```

Then build the project:
```bash
npm run build
```

## Running Tests

### Configuration Options

You can configure the Battlesnake server host and port using either:

**Environment Variables (Recommended):**
```bash
BATTLESNAKE_HOST=localhost BATTLESNAKE_PORT=8000 npm run test
```

**npm config flags (Original method):**
```bash
npm --host=localhost --port=8000 run test
```

### Normal Tests
Normal tests should be cases where failing the test results in you dying or a very high chance of death.

```bash
# With environment variables
BATTLESNAKE_HOST=localhost BATTLESNAKE_PORT=8000 npm run test

# With npm config
npm --host=localhost --port=8000 run test

# Or with just hostname (no port)
BATTLESNAKE_HOST=snake.example.com npm run test
npm --host=snake.example.com run test
```

### Hard Tests
Hard tests can be special situations where certain moves might be arguably better than others, but don't necessarily mean certain death. Hard tests often involve more looking ahead or prediction.

```bash
# With environment variables
BATTLESNAKE_HOST=localhost BATTLESNAKE_PORT=8000 npm run hard_test

# With npm config
npm --host=localhost --port=8000 run hard_test
```

### Configuration Priority
The test runner checks for host/port in the following order:
1. `BATTLESNAKE_HOST` and `BATTLESNAKE_PORT` environment variables
2. `npm_config_host` and `npm_config_port` (from npm --host/--port flags)
3. Default: `localhost` with no port


## Open Invite

If you have any questions, or just wish to chat about Battlesnake
 or programming in general, feel free to reach out! I like talking
with people and sharing tips and tricks.
