## History with comments

## Checkpoint git tag `step1`

Use nx to make a repo called 'ada-mono' with app 'ada'. Ada is the name of our cat, so seems appropriate.

    npx create-nx-workspace ada-mono --preset=nest

In the package.json, can see the scripts, so build, test, serve then the link http://localhost:3333/api should work.

    nx build
    nx lint
    nx test
    nx serve

We can also see the graph of dependencies, at this point should be quite simple.

    nx graph

## Coverage

## Checkpoint git tag `step2`

It is nice to see the coverage of your files to visually see more work is needed. Also it is good to set a threshold of what we take as an acceptable level, if we go below this level we should not accept the test as passed.

Added 'text' to config and '--coverage' to test script. Let's use the scripts rather than calling nx directly here. Also added threshold check.

    yarn test

Now comment out the 'someOtherFunc' test from app.service.spec.ts and re-run the above, you will see the coverage is not acceptable.

Notes: We should really have the coverageThreshold set globally, but the preset from top level did not work for me.

## Lint and Formatting

## Checkpoint git tag `step3`

In the package.json we now see some extra scripts, lint and prettier.

    yarn lint
    yarn prettier-check
    yarn prettier-write

## Add some extra apps and libs

## Checkpoint git tag `step4`

Add a library that store some of the types we will use throughout the apps and other libs. For this demo lets use the game of chess as a problem space.

    nx g @nrwl/nest:lib chess-base  --buildable
    nx build chess-base

Note: We have added a piece.type.ts to this library

Add a new app which will use this library

    nx g @nrwl/nest:app board-eval
    nx build board-eval
    nx serve board-eval

By default this also is served on port 3333, so running everything with the following would be problematic

    nx run-many --target=serve --all

We shall fix this later.

Added a Piece to be returned in the board-eval app service getData() call. I cheated a little in order to make the tests pass, note I don't verify the piece is correct.

Note: The beautiful imports from the new library called '@ada-mono/chess-base' rather that using lots of '../../..' path traversal.

Lets see the dependencies within the project now.

    nx graph

Also changed the package.json 'test' script. Now we traverse all the apps/libs to test.

    yarn test

## Commit hooks with husky

## Checkpoint git tag `step5`

Install husky, see https://www.npmjs.com/package/husky

    yarn add husky -D

    # once only
    npm pkg set scripts.prepare="husky install"
    npm run prepare

    # add hook
    npx husky add .husky/pre-commit "yarn lint"
    git add .husky/pre-commit

## Also add test and prettier to husky

## Checkpoint git tag `step6`

    Try to commit some bad code and see what happens

## Also add pre push for audit

## Checkpoint git tag `step7`

## Use commitizen to standardise on commit messages

## Checkpoint git tag `step8`

    npm install -g commitizen
    commitizen init cz-conventional-changelog --yarn --dev --exact

Added "cz" to scripts in package.json, from now on use 'yarn commit' rather than 'git commit'

    yarn commit

## Lots of versions with semanic-release

Using the structured commit messages and auto updates the version in package.json when we run

    yarn release

## Docker Build

Added custom command to the apps, so we can now build all images with the command

    yarn docker-build

This currently uses a Dockerfile with some of the points from synk's top 10 Dockerfile recommendations.

That yarn command in turn runs each app's dockerbuild entry which in turn hits a shell script which checks there is a name of an image to build and uses the current package.json version for the tag.

That shell script could be improved or even written with Commander.
