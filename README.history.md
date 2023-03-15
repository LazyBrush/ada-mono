## History with comments

Use nx to make a repo called 'ada-mono' with app 'ada'. Ada is the name of our cat, so seems appropriate.

    npx create-nx-workspace ada-mono --preset=nest

In the package.json, can see the scripts, so build, test, serve then the link http://localhost:3333/api should work.

    nx build
    nx test
    nx serve

We can also see the graph of dependencies, at this point should be quite simple.

    nx graph
