describe("Navigation", () => {
  beforeEach(() => {
    cy.seed("owner-user", "admin-user")
      .then(([owner, admin]) => ({ owner, admin }))
      .as("seed");
  });

  describe("when user is an admin", () => {
    beforeEach(function() {
      cy.login(this.seed.admin.email, this.seed.admin.password);

      cy.visit("/");
    });

    it("should contain link to user management", () => {
      cy.getByText("Users").should("be.visible");
      cy.getByText("Users").click({ force: true });

      cy.url().should("be", "/users");

      cy.contains("User Management");
    });
  });

  describe("when user is an owner", () => {
    beforeEach(function() {
      cy.login(this.seed.owner.email, this.seed.owner.password);

      cy.visit("/");
    });

    it("should contain link to place management", () => {
      cy.getByText("Restaurants").should("be.visible");
      cy.getByText("Restaurants").click({ force: true });

      cy.url().should("be", "/places");

      cy.contains("Restaurant Management");
    });

    it("should contain link to pending reviews", () => {
      cy.getByText("Reviews").should("be.visible");
      cy.getByText("Reviews").click({ force: true });

      cy.url().should("be", "/reviews");

      cy.contains("Pending Reviews");
    });
  });
});
