# LinkedIn Jobscraper
Scrapes LinkedIn for jobs, and puts them into a local sqlite file so that you (or someone who knows SQL) can browse jobs better than you can on their website, lol

## How to scrape
0. Create a file `.env` and fill it as follows:
```
username=[Your LinkedIn username (or email)]
password=[Your LinkedIn password]
```
2. Install `yarn install`
3. Run `yarn start`
   a. This will open up a browser and sign in for you. At this point either LinkedIn will take you straight to the home screen, or it will give you a "I'm not a robot" prompt. If you get the prompt, fill it out before moving on to the next step.
4. You should be inside of a node repl at this point. To scrape jobs run: `js.run()`.
5. This will continue forever until you spam Control+C or until you run: `js.cancel()`.

You should now have a `jobs.sqlite3` file in the same directory.

## How to use
1. Either use the javascript code or a sqlite reader of your choice to look at the jobs.
2. If you want the JavaScript route, I have included an [example.js](https://github.com/benjaminjkern/linkedin-jobscraper/example.js) file to see examples of how to query the local database. I have also included some utility functions to aid with this:
   a. `ratioFilter(sqlFilter)`: Print out the ratio of all jobs that match `sqlFilter`.
   b. `ratioColumnFilter(column, textToInclude)`: Print out a ratio of all jobs whose [`column`] contains [`textToInclude`] (Case insensitive)
   c. `lookAtJobs(inputJobs)`: Print out a markdown-formatted list of all jobs within the `inputJobs` array. This does not do any database calls, it just formats a list that already exists in the JavaScript.
