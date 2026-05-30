import assert from "assert";
import {
  openTheApp,
  selectDate,
  setDestination,
  setPeopleAndRooms,
} from "../helpers/codeceptJSHelpers";
import { selectors } from "../selectors";
import { destination, today } from "../constants";

Feature("codeceptJS");

Scenario("Destination search", async ({ I }) => {
  openTheApp(I);
  I.executeScript(() => {
    window.scrollBy(0, 300);
  });

  // Destination search
  setDestination(I, destination);

  I.wait(2);
  // Set Date
  selectDate(I, 0, today);
  selectDate(I, 0, "2026-06-10", true);

  I.wait(5);
  setPeopleAndRooms(I, {
    numberOfPeople: 3,
    children: { numberOfChildren: 2, ages: [2, 3] },
    numberOfRooms: 2,
  });

  // Search
  I.click(locate("button").withText("Search"));

  I.waitForElement(selectors.results_container, 10);
  I.waitForElement(selectors.property_card, 10);
  I.grabNumberOfVisibleElements(selectors.property_card).then((value) => {
    assert.notEqual(value, 0);
    console.log("Number of results: ", value);
  });

  I.click(selectors.sort_result_button);
  I.click(selectors.price_lowest_first);
  I.see("Price (lowest first)", selectors.sort_result_button);
  I.waitForElement(selectors.availability_btn, 10);
  const value = await I.grabTextFrom(locate(selectors.title).at(1));

  console.log(`Title link: ${value}`);

  I.click(selectors.sort_result_button);
  I.click(selectors.rating_low_to_high);
  I.see("Property rating (low to high)", selectors.sort_result_button);

  I.click(locate(selectors.property_card).at(1));
  I.switchToNextTab();

  I.waitForElement(selectors.wishlist_btn, 20);
  I.click(selectors.wishlist_btn);

  I.waitForElement(selectors.saved_wishlist_btn, 10);
});
