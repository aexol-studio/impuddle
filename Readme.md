# Impuddle

Universal code manager for fetching whole repos, certain folders or certain files from repositories. Config based so you can `sync` all deps at once

## Git code

Git is the base system for impuddle code management. We fo also offer registry for custom needs.

### Inject git repo to folder

### Inject file from git repo to folder

#### Options

- **branch** Git branch name
- **commit** commit hash

### Example folder

```sh
imp https://github.com/graphql-editor/colors src src/colors
```

What it will do?

1. It will alter the config `imp.json`

```json
{
  "code": {
    "https://github.com/graphql-editor/colors": {
      "path": "src",
      "dest": "src/colors"
    }
  }
}
```

2. It will fetch the repository folder src and copy the result to the folder colors in your repository

Whats most important here is the `imp.json` file which allows to sync all our code later.

### sync command

Sync command redownloads all modified files specified in code

## Todo

[ ] - write sync command
[ ] - write command help
[ ] - write config writing

## Developing

### How to test

```sh
npm run cli -- <command here>
```
