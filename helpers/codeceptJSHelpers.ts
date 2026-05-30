import { ChildrenData, PeopleAndRooms } from "../models";
import { selectors } from "../selectors";
export async function openTheApp(I: CodeceptJS.I) {
  I.amOnPage("https://www.booking.com/");
  I.waitForElement(selectors.header_booking_logo, 10);
  if (isElementVisible(I, selectors.sign_in_or_register_btn)) {
    I.say("Modal is visible");
    I.pressKey("Escape");
    I.say("Modal closed");
  }
  I.say("App is successfully opened");
}

export async function isElementVisible(
  I: CodeceptJS.I,
  selector: string,
  timeout: number = 5,
): Promise<boolean> {
  try {
    I.waitForElement(selector, timeout);
    return true;
  } catch (e) {
    return false;
  }
}

export function setDestination(I: CodeceptJS.I, destination: string) {
  I.seeElement(selectors.destination_input);
  I.fillField(selectors.destination_input, destination);
  I.seeInField(selectors.destination_input, destination);
  I.wait(2);
  I.click(selectors.auto_complete_result);
}

// 0 calendar index is start date, 1 calendar index is end date
export function selectDate(
  I: CodeceptJS.I,
  calendarIndex: 0 | 1,
  date: string,
  isDatePickerOpened: boolean = false,
  timeout: number = 5,
) {
  const regex = /^\d{4}-\d{2}-\d{2}$/;

  if (!regex.test(date)) {
    throw new Error(`Invalid date format: ${date}. Expected YYYY-MM-DD`);
  }

  const date_selector = `table[role="grid"]:nth-of-type(${calendarIndex + 1}) [data-date="${date}"]`;
  const selected_date = selectors.selected_date(date);

  I.waitForElement(date_selector, timeout);
  I.click(date_selector);

  I.seeElement(selected_date);
}

function validateChildren(data: ChildrenData) {
  if (data.numberOfChildren === 0) {
    return true;
  }

  if (!data.ages) {
    throw new Error("Ages are required");
  }

  if (data.ages.length !== data.numberOfChildren) {
    throw new Error(
      `Expected ${data.numberOfChildren} ages, got ${data.ages.length}`,
    );
  }

  return true;
}

export function setPeopleAndRooms(
  I: CodeceptJS.I,
  peopleAndRooms: PeopleAndRooms,
) {
  validateChildren(peopleAndRooms.children);

  I.click(selectors.people_and_room_input);
  const adultsPlusButton =
    '//label[text()="Adults"]/ancestor::div[contains(@class,"e484bb5b7a")]//button[last()]';

  const childrenPlusButton =
    '//label[text()="Children"]/ancestor::div[contains(@class,"e484bb5b7a")]//button[last()]';

  for (let index = 1; index <= peopleAndRooms.numberOfPeople - 2; index++) {
    if (peopleAndRooms.numberOfPeople === 1) {
      break;
    }
    I.click(adultsPlusButton);
  }

  I.see(peopleAndRooms.numberOfPeople.toString(), "span");


  if (peopleAndRooms.children.numberOfChildren !== 0) {
    for (
      let index = 0;
      index < peopleAndRooms.children.numberOfChildren;
      index++
    ) {
      I.click(childrenPlusButton);
    }
    I.see(peopleAndRooms.children.numberOfChildren.toString(), "span");

    for (
      let index = 1;
      index <= peopleAndRooms.children.numberOfChildren;
      index++
    ) {
      console.log("INDEX: ", index + 1);
      I.waitForClickable(locate(selectors.select_childern_age).at(index));
      I.click(locate(selectors.select_childern_age).at(index));

      const age_value = peopleAndRooms.children.ages[index - 1];

      for (let index = 0; index <= age_value; index++) {
        I.pressKey("ArrowDown");
      }
      I.pressKey("Enter");
    }

    const roomsPlusButton =
      '//label[text()="Rooms"]/ancestor::div[contains(@class,"e484bb5b7a")]//button[last()]';

    for (let index = 1; index < peopleAndRooms.numberOfRooms; index++) {
      if (peopleAndRooms.numberOfRooms === 1) {
        break;
      }
      I.click(roomsPlusButton);
    }

    I.see(peopleAndRooms.numberOfRooms.toString(), "span");

    I.click(locate("button").withText("Done"));

    I.see(
      `${peopleAndRooms.numberOfPeople} adults · ${peopleAndRooms.children.numberOfChildren} children · ${peopleAndRooms.numberOfRooms} rooms`,
      selectors.people_and_room_input,
    );
  }
}
