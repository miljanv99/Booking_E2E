import { Page } from "playwright";
import { BrowserContext, expect } from "playwright/test";
import { selectors } from "../selectors";
import { PeopleAndRooms } from "../models";

export async function openApp(page: Page) {
  await page.goto("https://www.booking.com/");

  await page.waitForLoadState();
  await page.getByRole("button", { name: "Dismiss sign-in info." }).click();
}

// 0 = start date calendar, 1 = end date calendar
export async function selectDate(
  page: Page,
  calendarIndex: 0 | 1,
  date: string,
  isDatePickerOpened: boolean = false,
  timeout: number = 5000,
) {
  const regex = /^\d{4}-\d{2}-\d{2}$/;

  if (!regex.test(date)) {
    throw new Error(`Invalid date format: ${date}. Expected YYYY-MM-DD`);
  }

  const dateSelector = `table[role="grid"]:nth-of-type(${calendarIndex + 1}) [data-date="${date}"]`;
  const selectedDateSelector = selectors.selected_date(date);

  const dateElement = page.locator(dateSelector);
  const selectedDate = page.locator(selectedDateSelector);

  await expect(dateElement).toBeVisible({ timeout });
  await dateElement.click();

  await expect(selectedDate).toBeVisible({ timeout });
}

export async function setPeopleAndRooms(page: Page, config: PeopleAndRooms) {
  const popup = page.locator('[data-testid="occupancy-popup"]');
  const peopleAndRooms = page.locator('[data-testid="occupancy-config"]');
  await peopleAndRooms.click();

  //set Adults
  const adultIncrements = config.numberOfPeople - 2;

  for (let i = 0; i < adultIncrements; i++) {
    await popup.locator("button").nth(1).click();
  }

  //set Children
  for (let i = 0; i < config.children.numberOfChildren; i++) {
    await popup.locator("button").nth(3).click();

    await page
      .locator('select[name="age"]')
      .nth(i)
      .selectOption({ label: `${config.children.ages[i]} years old` });
  }

  //set Room
  const roomIncrements = config.numberOfRooms - 1;

  for (let i = 0; i < roomIncrements; i++) {
    await popup.locator("button").nth(5).click();
  }
}

export async function openNewPage(context: BrowserContext): Promise<Page> {
  const newPage = await context.waitForEvent("page");
  await newPage.waitForLoadState("networkidle");
  return newPage;
}
