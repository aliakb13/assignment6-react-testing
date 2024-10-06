import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import App from "./App";

const mockData = {
  recipes: [
    {
      image: "image-1",
      name: "Recipe 1",
      rating: 4.5,
      tags: ["Tag1", "Tag2", "Tag3"],
      id: 1,
    },
    {
      image: "image-2",
      name: "Recipe 2",
      rating: 4.6,
      tags: ["Tag4", "Tag5", "Tag6"],
      id: 2,
    },
  ],
};

test("renders App component with NavBar, image banner, and Footer", async () => {
  render(<App />);

  // screen.debug();

  // image banner is rendered
  const banner = screen.getByTestId("image-banner");
  expect(banner).toBeInTheDocument();
  expect(banner).toHaveProperty(
    "src",
    "https://www.instacart.com/company/wp-content/uploads/2022/11/cooking-statistics-hero.jpg"
  );
  expect(banner).toHaveProperty("alt", "banner");
});

describe("error", () => {
  beforeAll(() => {
    global.fetch = jest.fn();
  });

  test("handles fetch error gracefully", async () => {
    // Mock fetch untuk mengembalikan error
    fetch.mockRejectedValueOnce(new Error("Failed to fetch"));

    // Spy console.log untuk menangkap error (opsional)
    const consoleSpy = jest.spyOn(console, "log");

    // Render komponen
    render(<App />);

    // Reset spy console log
    consoleSpy.mockRestore();
  });
});

test("renders recipe cards", async () => {
  // Mock fetch
  fetch.mockResolvedValueOnce({
    json: jest.fn().mockResolvedValueOnce(mockData),
  });

  render(<App />);

  // Tunggu hingga data selesai di-fetch dan state diupdate
  await waitFor(() => {
    expect(fetch).toHaveBeenCalledWith("https://dummyjson.com/recipes"); // Verifikasi URL fetch benar
  });

  await waitFor(() => {
    const card = screen.getAllByTestId("card"); // added for test purpose
    expect(card).toHaveLength(2); // Harus ada 12 resep yang ditampilkan
  });
});
