import repl from "repl";
import { By } from "selenium-webdriver";
import dotenv from "dotenv";
dotenv.config();
import { driver, startUp } from "./base.js";
import { run, cancel } from "./getJobs.js";
import { initDatabase, readAllJobs } from "./jobs.js";

const signIn = async () => {
    await driver.get("https://www.linkedin.com/login");

    await driver.findElement(By.id("username")).sendKeys(process.env.username);
    await driver.findElement(By.id("password")).sendKeys(process.env.password);
    await driver
        .findElement(By.id("organic-div"))
        .findElement(By.css("form"))
        .findElement(By.css("button"))
        .click();
};

(async () => {
    await initDatabase();
    await readAllJobs();
    await startUp();
    await signIn();
    const r = repl.start();
    r.context.js = { run, cancel };
})();
