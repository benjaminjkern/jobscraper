import { Database } from "sqlite-async";

export let db;

const init = async () => {
    if (!db) db = await Database.open("./jobs.sqlite3");

    if (
        !(
            await db.all(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='jobs'"
            )
        ).length
    )
        await db.run(
            "CREATE TABLE jobs(jobId, jobTitle, companyName, location, extraInfo, details, jobPostExtraInfo, applied, yearsOfExperience, requiresClearance, salaryMin, salaryMax, PRIMARY KEY (jobId))"
        );

    if (
        !(
            await db.all(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='companies'"
            )
        ).length
    )
        await db.run(
            "CREATE TABLE companies(companyName, opinion INTEGER, companyExtraInfo, PRIMARY KEY (companyName))"
        );
};

export const totalNumJobs = async () =>
    (await db.get("SELECT COUNT(*) FROM jobs"))["COUNT(*)"];

export const addNewJob = async (job) => {
    // TODO: Filter before adding (?) Actually maybe it is better to just store everything and then filter afterwards
    await db.run(
        `REPLACE INTO jobs(jobId, jobTitle, companyName, location, extraInfo, details, jobPostExtraInfo) VALUES(?, ?, ?, ?, ?, ?, ?) ON CONFLICT(jobId) DO UPDATE SET jobTitle=(?),companyName=(?),location=(?),extraInfo=(?),details=(?),jobPostExtraInfo=(?)`,
        [
            job.jobId,
            job.jobTitle,
            job.companyName,
            job.location,
            job.extraInfo,
            job.details,
            job.jobPostExtraInfo,
            job.jobTitle,
            job.companyName,
            job.location,
            job.extraInfo,
            job.details,
            job.jobPostExtraInfo,
        ]
    );
    await db.run(
        `INSERT INTO companies(companyName, companyExtraInfo) VALUES (?, ?) ON CONFLICT(companyName) DO UPDATE SET companyExtraInfo=(?)`,
        [job.companyName, job.companyExtraInfo, job.companyExtraInfo]
    );
};

export const readAllJobs = async () => {
    return await db.all("SELECT * FROM jobs");
};

export const initDatabase = async () => await init();
