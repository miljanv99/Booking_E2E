import { test, expect } from "@playwright/test";
import {
  openApp,
  openNewPage,
  selectDate,
  setPeopleAndRooms,
} from "../helpers/playwrightHelpers";
import { selectors } from "../selectors";
import { destination, today } from "../constants";

test.use({
  geolocation: {
    latitude: 45.2671,
    longitude: 19.8335,
  },
  permissions: ["geolocation"],
});

test.beforeEach(async ({ page }) => {
  await openApp(page);
});

test("Destination search", async ({ page, context }) => {
  // destination search
  const destinationInput = page.locator(
    'input[placeholder="Where are you going?"]',
  );
  await destinationInput.click();
  await destinationInput.fill(destination);
  await page.waitForSelector(
    '[data-testid="autocomplete-result"]:has-text("Budapest")',
  );
  await page.click('[data-testid="autocomplete-result"]:has-text("Budapest")');

  // select dates
  await selectDate(page, 0, today);
  await selectDate(page, 0, "2026-06-10", true);

  // set people and rooms
  await setPeopleAndRooms(page, {
    numberOfPeople: 3,
    children: { numberOfChildren: 2, ages: [2, 3] },
    numberOfRooms: 2,
  });

  await page.getByRole("button", { name: "Search" }).click();

  await page.waitForLoadState("networkidle");

  const resultsContainer = page.locator(selectors.results_container);
  await expect(resultsContainer).toBeVisible();

  const propertyCards = page.locator(selectors.property_card);
  await expect(propertyCards.first()).toBeVisible();

  const count = await propertyCards.count();
  expect(count).not.toBe(0);

  console.log("Number of results:", count);

  // sorting price Low To High
  await page.locator(selectors.sort_result_button).click();
  await page.locator(selectors.price_lowest_first).click();

  await expect(page.locator(selectors.sort_result_button)).toContainText(
    "Price (lowest first)",
  );

  await expect(
    page.locator('[data-testid="availability-cta-btn"]').first(),
  ).toBeVisible();

  const prices = await page
    .locator('[data-testid="price-and-discounted-price"]')
    .allTextContents();

  const price1 = Number(prices[0].replace(/[^\d]/g, ""));
  const price2 = Number(prices[1].replace(/[^\d]/g, ""));

  expect(price1).toBeLessThan(price2);

  // sorting Rating low to high
  await page.locator(selectors.sort_result_button).click();
  await page.locator(selectors.rating_low_to_high).click();

  await expect(page.locator(selectors.sort_result_button)).toContainText(
    "Property rating (low to high)",
  );

  const property_title = await page
    .locator(selectors.title)
    .nth(0)
    .textContent();
  console.log("Title link:", property_title);

  // open property
  await propertyCards.nth(0).click();

  const newPage = await openNewPage(context);

  await newPage.evaluate(() => window.scrollTo(0, 0));

  // wishlist
  await newPage.waitForSelector(selectors.wishlist_btn);
  await newPage.waitForSelector(`h2:has-text("${property_title}")`);
  await newPage.locator(selectors.wishlist_btn).click();

  await newPage.waitForSelector(selectors.saved_wishlist_btn);
  await newPage.waitForTimeout(2000);
  await newPage.waitForSelector(selectors.saved_next_trip);
  await newPage.locator(selectors.saved_next_trip).click();

  const newPage2 = await openNewPage(context);

  await expect(newPage2.locator(selectors.header_my_next_trip)).toBeVisible();

  await expect(
    newPage2.locator(
      `[data-testid="property-card-wishlist-detail-desktop"] h3:has-text("${property_title}")`,
    ),
  ).toBeVisible();

  await newPage2
    .locator(
      `[data-testid="property-card-wishlist-detail-desktop"] h3:has-text("${property_title}")`,
    )
    .click();

  const newPage3 = await openNewPage(context);

  await newPage3.evaluate(() => window.scrollTo(0, 0));

  await newPage3.waitForSelector(selectors.saved_wishlist_btn);
  await newPage3.waitForSelector(`h2:has-text("${property_title}")`);
});

test("Invalid search", async ({ page, context }) => {
  await page.getByRole("button", { name: "Search" }).click();
  await page.waitForSelector(selectors.destination_error);

  // destination search
  const destinationInput = page.locator(
    'input[placeholder="Where are you going?"]',
  );
  await destinationInput.click();
  await destinationInput.fill(destination);

  // add child without ages
  await page.locator(selectors.people_and_room_input).click();
  const popup = page.locator('[data-testid="occupancy-popup"]');
  await popup.locator("button").nth(3).click();

  await expect(page.locator('select[name="age"] option:checked')).toHaveText(
    "Age needed",
  );

  await page.getByRole("button", { name: "Search" }).click();

  await expect(page.locator('select[name="age"] option:checked')).toHaveText(
    "Age needed",
  );
});
