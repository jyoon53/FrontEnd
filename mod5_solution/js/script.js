$(function () {
  // Ensure the navbar collapses on small screens when it loses focus
  $("#navbarToggle").blur(function (event) {
    var screenWidth = window.innerWidth;
    if (screenWidth < 768) {
      $("#collapsable-nav").collapse("hide");
    }
  });
});

(function (global) {
  var dc = {};

  // Snippet URLs
  var homeHtmlUrl = "snippets/home-snippet.html";
  var allCategoriesUrl =
    "https://coursera-jhu-default-rtdb.firebaseio.com/categories.json";
  var categoriesTitleHtml = "snippets/categories-title-snippet.html";
  var categoryHtml = "snippets/category-snippet.html";
  var menuItemsUrl =
    "https://coursera-jhu-default-rtdb.firebaseio.com/menu_items/";
  var menuItemsTitleHtml = "snippets/menu-items-title.html";
  var menuItemHtml = "snippets/menu-item.html";
  var aboutHtmlUrl = "snippets/about.html"; // New snippet for About page

  // Convenience function for inserting innerHTML for a given selector
  var insertHtml = function (selector, html) {
    var targetElem = document.querySelector(selector);
    targetElem.innerHTML = html;
  };

  // Show loading icon inside element identified by 'selector'
  var showLoading = function (selector) {
    var html = "<div class='text-center'>";
    html += "<img src='images/ajax-loader.gif'></div>";
    insertHtml(selector, html);
  };

  // Replace all occurrences of {{propName}} in 'string' with propValue
  var insertProperty = function (string, propName, propValue) {
    var propToReplace = "{{" + propName + "}}";
    string = string.replace(new RegExp(propToReplace, "g"), propValue);
    return string;
  };

  // Switch CSS active classes between Home and Menu buttons
  var switchMenuToActive = function () {
    var classes = document.querySelector("#navHomeButton").className;
    classes = classes.replace(new RegExp("active", "g"), "");
    document.querySelector("#navHomeButton").className = classes;

    classes = document.querySelector("#navMenuButton").className;
    if (classes.indexOf("active") === -1) {
      classes += " active";
      document.querySelector("#navMenuButton").className = classes;
    }
  };

  // On page load, show the home view
  document.addEventListener("DOMContentLoaded", function (event) {
    showLoading("#main-content");
    $ajaxUtils.sendGetRequest(
      allCategoriesUrl,
      buildAndShowHomeHTML, // Callback to build the home view using a random category
      true
    ); // Expecting JSON response
  });

  // Builds HTML for the home page based on the categories array returned from the server.
  function buildAndShowHomeHTML(categories) {
    $ajaxUtils.sendGetRequest(
      homeHtmlUrl,
      function (homeHtml) {
        // Choose a random category from the categories array
        var chosenCategory = chooseRandomCategory(categories);

        // Replace the placeholder with the chosen category's short name (surrounded by quotes)
        var homeHtmlToInsertIntoMainPage = insertProperty(
          homeHtml,
          "randomCategoryShortName",
          "'" + chosenCategory.short_name + "'"
        );

        // Insert the processed HTML into the main page
        insertHtml("#main-content", homeHtmlToInsertIntoMainPage);
      },
      false
    ); // False because we're loading regular HTML
  }

  // Given an array of category objects, returns a random category object.
  function chooseRandomCategory(categories) {
    var randomArrayIndex = Math.floor(Math.random() * categories.length);
    return categories[randomArrayIndex];
  }

  // Load the menu categories view
  dc.loadMenuCategories = function () {
    showLoading("#main-content");
    $ajaxUtils.sendGetRequest(allCategoriesUrl, buildAndShowCategoriesHTML);
  };

  // Load the menu items view. 'categoryShort' is a short_name for a category.
  dc.loadMenuItems = function (categoryShort) {
    showLoading("#main-content");
    $ajaxUtils.sendGetRequest(
      menuItemsUrl + categoryShort + ".json",
      buildAndShowMenuItemsHTML
    );
  };

  // Builds HTML for the categories page based on the data from the server.
  function buildAndShowCategoriesHTML(categories) {
    $ajaxUtils.sendGetRequest(
      categoriesTitleHtml,
      function (categoriesTitleHtml) {
        $ajaxUtils.sendGetRequest(
          categoryHtml,
          function (categoryHtml) {
            switchMenuToActive();
            var categoriesViewHtml = buildCategoriesViewHtml(
              categories,
              categoriesTitleHtml,
              categoryHtml
            );
            insertHtml("#main-content", categoriesViewHtml);
          },
          false
        );
      },
      false
    );
  }

  // Using categories data and snippet HTML, build categories view HTML to be inserted into the page.
  function buildCategoriesViewHtml(
    categories,
    categoriesTitleHtml,
    categoryHtml
  ) {
    var finalHtml = categoriesTitleHtml;
    finalHtml += "<section class='row'>";
    for (var i = 0; i < categories.length; i++) {
      var html = categoryHtml;
      var name = "" + categories[i].name;
      var short_name = categories[i].short_name;
      html = insertProperty(html, "name", name);
      html = insertProperty(html, "short_name", short_name);
      finalHtml += html;
    }
    finalHtml += "</section>";
    return finalHtml;
  }

  // Builds HTML for the single category (menu items) page based on the data from the server.
  function buildAndShowMenuItemsHTML(categoryMenuItems) {
    $ajaxUtils.sendGetRequest(
      menuItemsTitleHtml,
      function (menuItemsTitleHtml) {
        $ajaxUtils.sendGetRequest(
          menuItemHtml,
          function (menuItemHtml) {
            switchMenuToActive();
            var menuItemsViewHtml = buildMenuItemsViewHtml(
              categoryMenuItems,
              menuItemsTitleHtml,
              menuItemHtml
            );
            insertHtml("#main-content", menuItemsViewHtml);
          },
          false
        );
      },
      false
    );
  }

  // Using category and menu items data and snippet HTML, build menu items view HTML.
  function buildMenuItemsViewHtml(
    categoryMenuItems,
    menuItemsTitleHtml,
    menuItemHtml
  ) {
    menuItemsTitleHtml = insertProperty(
      menuItemsTitleHtml,
      "name",
      categoryMenuItems.category.name
    );
    menuItemsTitleHtml = insertProperty(
      menuItemsTitleHtml,
      "special_instructions",
      categoryMenuItems.category.special_instructions
    );
    var finalHtml = menuItemsTitleHtml;
    finalHtml += "<section class='row'>";
    var menuItems = categoryMenuItems.menu_items;
    var catShortName = categoryMenuItems.category.short_name;
    for (var i = 0; i < menuItems.length; i++) {
      var html = menuItemHtml;
      html = insertProperty(html, "short_name", menuItems[i].short_name);
      html = insertProperty(html, "catShortName", catShortName);
      html = insertItemPrice(html, "price_small", menuItems[i].price_small);
      html = insertItemPortionName(
        html,
        "small_portion_name",
        menuItems[i].small_portion_name
      );
      html = insertItemPrice(html, "price_large", menuItems[i].price_large);
      html = insertItemPortionName(
        html,
        "large_portion_name",
        menuItems[i].large_portion_name
      );
      html = insertProperty(html, "name", menuItems[i].name);
      html = insertProperty(html, "description", menuItems[i].description);
      if (i % 2 !== 0) {
        html +=
          "<div class='clearfix visible-lg-block visible-md-block'></div>";
      }
      finalHtml += html;
    }
    finalHtml += "</section>";
    return finalHtml;
  }

  // Appends price with '$' if price exists; otherwise, replaces with an empty string.
  function insertItemPrice(html, pricePropName, priceValue) {
    if (!priceValue) {
      return insertProperty(html, pricePropName, "");
    }
    priceValue = "$" + priceValue.toFixed(2);
    html = insertProperty(html, pricePropName, priceValue);
    return html;
  }

  // Appends portion name in parentheses if it exists.
  function insertItemPortionName(html, portionPropName, portionValue) {
    if (!portionValue) {
      return insertProperty(html, portionPropName, "");
    }
    portionValue = "(" + portionValue + ")";
    html = insertProperty(html, portionPropName, portionValue);
    return html;
  }

  /* ============================
     New: About Page Functionality
     ============================ */

  // Load the About page view
  dc.loadAboutPage = function () {
    showLoading("#main-content");
    $ajaxUtils.sendGetRequest(aboutHtmlUrl, buildAndShowAboutHTML, false); // Loading plain HTML snippet
  };

  // Build and show the About page with a random 5-star rating.
  function buildAndShowAboutHTML(aboutHtml) {
    // Generate a random rating between 1 and 5 (inclusive)
    var rating = randomRating();

    // For each star, if its position is <= rating, use a filled star;
    // otherwise, use an empty star.
    aboutHtml = insertProperty(
      aboutHtml,
      "class1",
      rating >= 1 ? "fa fa-star" : "fa fa-star-o"
    );
    aboutHtml = insertProperty(
      aboutHtml,
      "class2",
      rating >= 2 ? "fa fa-star" : "fa fa-star-o"
    );
    aboutHtml = insertProperty(
      aboutHtml,
      "class3",
      rating >= 3 ? "fa fa-star" : "fa fa-star-o"
    );
    aboutHtml = insertProperty(
      aboutHtml,
      "class4",
      rating >= 4 ? "fa fa-star" : "fa fa-star-o"
    );
    aboutHtml = insertProperty(
      aboutHtml,
      "class5",
      rating >= 5 ? "fa fa-star" : "fa fa-star-o"
    );

    // BONUS: Insert the numeric/textual rating next to the stars.
    aboutHtml = insertProperty(
      aboutHtml,
      "ratingText",
      rating + "-star rating"
    );

    // Insert the processed HTML into the main page
    insertHtml("#main-content", aboutHtml);
  }

  // Returns a random integer from 1 to 5 (inclusive)
  function randomRating() {
    return Math.floor(Math.random() * 5) + 1;
  }

  // Expose the dc object to the global scope
  global.$dc = dc;
})(window);
