# Northcoders News API

## Background

I will be building an API for the purpose of accessing application data programmatically. The intention here is to mimic the building of a real world backend service (such as reddit) which should provide this information to the front end architecture.

This database will be PSQL, will be interacted with using [node-postgres](https://node-postgres.com/).

## Kanban

### Personal Trello board for this project https://trello.com/b/ucGBLin

## Git Branching and Pull Requests

You will be working on each ticket on a new **branch**.

To create and switch to a new git branch use the command:

```
git checkout -b <new branch name>
```

This will create a branch and move over to that branch. (Omit the `-b` flag if you wish to switch to an already existing branch).

We recommend that you name the branch after the number assigned to each ticket via the header. eg. `ncnews-1`

When pushing the branch to git hub ensure that you make reference to the branch you are pushing to on the remote.

```
git push origin <branch name>
```

From github you can make a pull request and share the link and ticket number via a pull request specific nchelp using the command `nchelp pr`. A tutor will swing by to review your code. Ensure that you keep your trello up to date whilst you await the PR approval. Regular `nchelp` will be available for when you need support.

Once a pull request been accepted be sure to switch back to the main branch and pull down the updated changes.

```
git checkout main

git pull origin main
```

You can tidy up your local branches once they have been pull into main by deleting them:

```
git branch -D <local branch>
```

## Husky

To ensure we are not commiting broken code this project makes use of git hooks. Git hooks are scripts triggered during certain events in the git lifecycle. Husky is a popular package which allows us to set up and maintain these scripts. This project makes use a _pre-commit hook_. When we attempt to commit our work, the script defined in the `pre-commit` file will run. If any of our tests fail than the commit will be aborted.

The [Husky documentation](https://typicode.github.io/husky/#/) explains how to configure Husky for your own project as well as creating your own custom hooks.\_

## Info for cloners

You will need to add two files '.env.test' and '.env.development' containing the code 'PGDATABASE=nc_news_test' and 'PGDATABASE=nc_news' respectively, to successfully connect to the databases.
