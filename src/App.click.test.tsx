import { afterAll, afterEach, expect, spyOn, test } from "bun:test";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { App } from "./App";

// Random 0 makes "Totally random" pick the first option and every "yes":
// Washington (damaged), Jackson Moss (upgraded), Fire in the Sky, 4 flipped special tiles.
const random = spyOn(Math, "random").mockReturnValue(0);

afterEach(() => random.mockClear());
// Other test files run in the same process and need the real Math.random.
afterAll(() => random.mockRestore());

const setupShown = () => screen.queryByRole("region", { name: "Setup" });

test("clicking Randomize shows a setup", () => {
  render(<App />);
  expect(setupShown()).toBeNull();

  fireEvent.click(screen.getByRole("button", { name: "Randomize" }));

  const setup = within(screen.getByRole("region", { name: "Setup" }));
  expect(setup.getByText("Washington, DC · Damaged")).toBeTruthy();
  expect(setup.getByText("Fire in the Sky")).toBeTruthy();
});

test("clicking Español after randomizing shows the same setup in Spanish", () => {
  render(<App />);
  fireEvent.click(screen.getByRole("button", { name: "Randomize" }));
  const drawsForSetup = random.mock.calls.length;

  fireEvent.click(screen.getByRole("button", { name: "Español" }));

  // No new draw: the setup stays the same, only its language changes.
  expect(random.mock.calls.length).toBe(drawsForSetup);
  const setup = within(screen.getByRole("region", { name: "Setup" }));
  expect(setup.getByText("Ciudad")).toBeTruthy();
  expect(setup.getByText("Washington · Damaged")).toBeTruthy();
  expect(setup.getByText("Fuego en el cielo")).toBeTruthy();
  expect(setup.getByText("Loseta de cielo especial 1 · Flipped")).toBeTruthy();
  expect(screen.getByRole("button", { name: "Español", pressed: true })).toBeTruthy();
});
