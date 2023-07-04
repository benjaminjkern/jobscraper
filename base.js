import { Builder } from "selenium-webdriver";
import "chromedriver";

export let driver;

export const startUp = async () => {
    driver = await new Builder().forBrowser("chrome").build();
};

export const shutdown = async () => {
    driver.close();
};

export const sleep = (time) =>
    new Promise((resolve) => setTimeout(resolve, time));
