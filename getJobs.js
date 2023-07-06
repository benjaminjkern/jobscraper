import { By } from "selenium-webdriver";
import { driver, sleep } from "./base.js";
import { addNewJob, totalNumJobs } from "./jobs.js";

let shouldCancel = true;
let cancelled = true;

export const cancel = async () => {
    shouldCancel = true;

    console.log("Cancelling!");
    while (!cancelled) {
        await sleep(1000);
    }
};

export const run = async () => {
    let page = 0;
    shouldCancel = false;
    cancelled = false;
    console.log("Starting!");
    while (!shouldCancel) {
        await fetchJobs(page);
        page++;
        if (page >= 40) page = 0;
    }
    cancelled = true;
};

const fetchJobs = async (
    page,
    queryParams = "keywords=software%20engineer&location=United%20States&f_WT=2&"
) => {
    await driver.get(
        `https://www.linkedin.com/jobs/search/?${queryParams}start=${page * 25}`
    );

    await sleep(1000); // Need to wait cuz the scroll will be reset

    await driver.executeScript(
        `let e = document.querySelector('#main > div > div.scaffold-layout__list > div');
        let i = 0;
        const smoothScroll = () => {
            if (i >= 1000) return;

            i++;
            e.scrollTop += 100;
            setTimeout(smoothScroll, 10);
        }
        smoothScroll();`
    );

    await sleep(5000); // Without this sleep it doesnt get the insights or extra info

    let jobElements;
    try {
        jobElements = await driver.findElements(
            By.className("job-card-container")
        );
    } catch (err) {
        console.warn("Get all jobs failed");
    }

    for (const jobElement of jobElements) {
        let job;
        try {
            job = await convertJobToObject(jobElement);
        } catch (err) {
            console.warn("Get specific job failed");
            continue;
        }
        await addNewJob(job);
    }

    console.log(await totalNumJobs(), "jobs found");
};

const convertJobToObject = async (webElement) => {
    const baseText = (await webElement.getText()).split("\n");

    await webElement.click();
    await sleep(1000);

    const details = await driver.findElement(By.id("job-details")).getText();

    const jobPostExtras = await driver.findElements(
        By.css(".jobs-unified-top-card__job-insight")
    );

    return {
        jobId: await webElement.getAttribute("data-job-id"),
        jobTitle: baseText[0],
        companyName: baseText[1],
        location: baseText[2],
        extraInfo: baseText.slice(3).join("\n"),
        jobPostExtraInfo: await jobPostExtras[0].getText(),
        details,
        companyExtraInfo: await jobPostExtras[1].getText(),
    };
};
