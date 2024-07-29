const { test, expect, beforeEach, describe } = require("@playwright/test");
const { loginWith, createBlog } = require("./helper");

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("/api/testing/reset");
    await request.post("/api/users", {
      data: {
        name: "Axel",
        username: "AckeH",
        password: "salainen",
      },
    });
    await request.post("/api/users", {
      data: {
        name: "random",
        username: "AnotherUser",
        password: "password",
      },
    });

    await page.goto("/");
  });

  test("Login form is shown", async ({ page }) => {
    const locator = await page.getByText("Log in to application");
    await expect(locator).toBeVisible();
  });

  describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      loginWith(page, "AckeH", "salainen");
      await expect(page.getByText("logged in as Axel")).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      loginWith(page, "AckyH", "lol");
      await expect(
        page.getByText("invalid username or password")
      ).toBeVisible();
    });
  });

  describe("When logged in", () => {
    beforeEach(async ({ page }) => {
      loginWith(page, "AckeH", "salainen");
    });

    test("A blog can be created", async ({ page }) => {
      createBlog(page, "test title", "test author", "test url");
      await expect(page.getByText("test title test author")).toBeVisible();
    });

    test("A blog can be liked", async ({ page }) => {
      createBlog(page, "test title", "test author", "test url");
      await page.getByRole("button", { name: "view" }).click();
      await page.getByRole("button", { name: "like" }).click();
      await expect(page.getByText("likes: 1")).toBeVisible();
    });

    test("Only the user who added the blog sees the delete button", async ({
      page,
    }) => {
      // Create a blog
      createBlog(page, "test title", "test author", "test url");

      // Check if the delete button is visible for the user who added the blog
      await page.getByRole("button", { name: "view" }).click();
      await expect(page.getByRole("button", { name: "remove" })).toBeVisible();

      // Log out the user
      await page.getByRole("button", { name: "logout" }).click();

      // Log in with a different user
      loginWith(page, "AnotherUser", "password");

      // Check if the delete button is not visible for the different user
      await page.goto("/");
      await page.getByRole("button", { name: "view" }).click();
      await expect(page.getByRole("button", { name: "remove" })).not.toBeVisible();
    });

    test("The user who added the blog can delete the blog", async ({ page }) => {
        // Dialog handler to confirm the deletion        
        page.on('dialog', async dialog => {
            await dialog.accept();
        });

        // Create a blog
        createBlog(page, "test title", "test author", "test url");

        // Check if the delete button is visible for the user who added the blog
        await page.getByRole("button", { name: "view" }).click();
        await expect(page.getByRole("button", { name: "remove" })).toBeVisible();

        // Delete the blog
        await page.getByRole("button", { name: "remove" }).click();

        // Check if the blog is deleted
        await expect(page.getByText("test title test author")).not.toBeVisible();
    });
  });
});
