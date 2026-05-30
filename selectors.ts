import { Sign } from "node:crypto";
import { destination } from "./constants";

export const selectors = {
  header_booking_logo: "data-testid=header-booking-logo",
  sign_in_or_register_btn: "data-testid=auth-link-in-view",
  banner_title: "data-testid=herobanner-title1",
  destination_input: 'input[placeholder="Where are you going?"]',
  auto_complete_result: "data-testid=autocomplete-result",
  select_date_input: 'button[aria-label="Select dates"]',
  selected_date: (date: string) =>
    `span[data-date="${date}"][aria-checked="true"]`,
  people_and_room_input: "data-testid=occupancy-config",
  select_childern_age: "[data-testid='kids-ages-select']",
  results_container: "[data-results-container='1']",
  property_card: '[data-testid="property-card"]',
  sort_result_button: "data-testid=sorters-dropdown-trigger",
  price_lowest_first: 'button[aria-label="Price (lowest first)"]',
  rating_low_to_high: 'button[aria-label="Property rating (low to high)"]',
  title: '[data-testid="title"]',
  availability_btn: "data-testid=availability-cta-btn",
  wishlist_btn: 'button[aria-label="Save this item to a trip list"]',
  saved_wishlist_btn: 'button[aria-label="Remove item from your list"]',
  saved_next_trip: 'a[aria-label="Saved to: My next trip"]',
  header_my_next_trip: 'h1:has-text("My next trip")',
  destination_error: 'div:has-text("Enter a destination to start searching.")',
};
