import { Database } from "sqlite-async";

let db;

const init = async () => {
    db = await Database.open("./jobs.sqlite3");

    if (
        !(
            await db.all(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='jobs'"
            )
        ).length
    )
        await db.run(
            "CREATE TABLE jobs(jobId, jobTitle, companyName, location, extraInfo, details, PRIMARY KEY (jobId))"
        );
};

export const totalNumJobs = async () =>
    (await db.get("SELECT COUNT(*) FROM jobs"))["COUNT(*)"];

export const addNewJob = async (job) => {
    // TODO: Filter
    await db.run("INSERT OR IGNORE INTO jobs VALUES(?, ?, ?, ?, ?, ?)", [
        job.jobId,
        job.jobTitle,
        job.companyName,
        job.location,
        job.extraInfo,
        job.details,
    ]);
};

export const readAllJobs = async () => {
    console.log(await db.all("SELECT * FROM jobs"));
};

export const initDatabase = async () => await init();
