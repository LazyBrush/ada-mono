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
