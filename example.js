import { db, initDatabase, readAllJobs, totalNumJobs } from "./jobs.js";
import { lookAtJobs, ratioColumnFilter, ratioFilter } from "./utils.js";

const countJobTitles = async () => {
    await ratioColumnFilter("jobTitle", "senior");
    await ratioColumnFilter("jobTitle", "staff");
    await ratioColumnFilter("jobTitle", "principal");

    process.stdout.write(`None of those: `);
    await ratioFilter(
        "jobTitle NOT LIKE '%senior%' AND jobTitle NOT LIKE '%staff%' AND jobTitle NOT LIKE '%principal%'"
    );
};

const countJobDetails = async () => {
    process.stdout.write(
        `Description contains "healthcare" or "health care": `
    );
    await ratioFilter(
        "details LIKE '%healthcare%' OR details LIKE '%health care%'"
    );
    process.stdout.write(`Description contains "game": `);
    await ratioFilter("details LIKE '%game%'");
};

const getNonHealthCareJobs = async () => {
    return await db.all(
        "SELECT * FROM jobs WHERE details NOT LIKE '%healthcare%' AND details NOT LIKE '%health care%' AND details NOT LIKE '%blockchain%'" // Games (Videogames) as well
    );
};

const getJobsAtGoodCompanies = async () => {
    return await db.all(
        `SELECT * FROM jobs INNER JOIN companies ON jobs.companyName=companies.companyName WHERE companies.opinion>0 AND jobs.jobTitle NOT LIKE '%senior%' AND jobs.jobTitle NOT LIKE 'sr.%' AND jobs.jobTitle NOT LIKE '%principal%' AND jobs.jobTitle NOT LIKE '%staff%' AND jobs.applied IS NULL`
    );
};

const getJobsAtGoodCompaniesWithSeniors = async () => {
    return await db.all(
        `SELECT * FROM jobs INNER JOIN companies ON jobs.companyName=companies.companyName WHERE companies.opinion>0 AND jobs.applied IS NULL`
    );
};

(async () => {
    await initDatabase();

    // Note: This needs to be piped into a markdown file. Example: node example.js > jobs.md
    console.log(lookAtJobs(await getJobsAtGoodCompaniesWithSeniors()));
})();
